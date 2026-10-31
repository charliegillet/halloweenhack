// Afterlife always-on server: lease authority + dispatcher + SSE board feed + static board. Never killed in the demo.
// http://localhost:4000  (PORT env to override)
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFileSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { join, extname, normalize as normPath } from 'node:path';
import { loadEnv } from '../agents/common.ts';
import { connect, fullName, ROOT, type RelayConn, type RelayMsg } from '../agents/relay.ts';
import { createLease } from '../lease/index.ts';

loadEnv();
const PORT = Number(process.env.PORT || 4000);
const APP = join(ROOT, 'app');
const lease = await createLease();

// ---------------------------------------------------------------- state for replay
type Proc = { name: string; status: 'up' | 'down'; pid?: number; lastSeen: number };
const procs = new Map<string, Proc>();
const relayMsgs = new Map<string, any>();
const outbox: any[] = [];
const channels = new Map<string, string>(); // taskId -> channel
const handoffs = new Map<string, any>(); // `${taskId}:${epoch}` -> deterministic DM payload
const clients = new Set<ServerResponse>();

function send(res: ServerResponse, evt: unknown) { res.write(`data: ${JSON.stringify(evt)}\n\n`); }
function broadcast(evt: any) { for (const c of clients) send(c, evt); }

// ---------------------------------------------------------------- relay (afterlife identity)
let relay: RelayConn | null = null;
const AFTERLIFE = fullName('afterlife');
try {
  relay = await connect('afterlife');
  console.log(`[server] relay connected as ${relay.name}`);
  relay.onAny((m) => ingestRelay(m));
} catch (e: any) {
  console.warn('[server] relay connect failed, running without Relay:', e.message);
}

async function isStale(m: { data?: any }) {
  const d = m.data;
  if (d?.kind !== 'checkpoint' || !d.taskId) return false;
  if (d.late) return true;
  const t = await lease.status(d.taskId);
  const rec = t?.steps.find((s) => s.step === d.step);
  return !rec || rec.epoch !== d.epoch;
}
async function ingestRelay(m: RelayMsg | any) {
  if (!m?.id) return;
  const prev = relayMsgs.get(m.id);
  const msg = {
    id: m.id, from: m.from, channel: m.channel ?? prev?.channel ?? '', text: m.text ?? prev?.text ?? '',
    data: m.data ?? prev?.data ?? null, ts: typeof m.ts === 'string' ? Date.parse(m.ts) || Date.now() : m.ts ?? Date.now(),
  } as any;
  if (m.type === 'dm' || msg.data?.kind === 'handoff') { msg.channel = ''; msg.data = { kind: 'dm', ...(msg.data ?? {}) }; }
  msg.stale = await isStale(msg);
  const merged = { ...(prev ?? {}), ...msg, data: { ...(prev?.data ?? {}), ...(msg.data ?? {}) } };
  relayMsgs.set(m.id, merged);
  broadcast({ type: 'relay', msg: merged });
}

// ---------------------------------------------------------------- procs
function touch(name: string | undefined, pid?: number) {
  if (!name) return;
  const p = procs.get(name);
  const now = Date.now();
  if (!p || p.status !== 'up') {
    procs.set(name, { name, status: 'up', pid: pid ?? p?.pid, lastSeen: now });
    broadcast({ type: 'proc', name, status: 'up', pid: pid ?? p?.pid });
  } else { p.lastSeen = now; if (pid) p.pid = pid; }
}
function setProc(name: string, status: 'up' | 'down', pid?: number) {
  const p = procs.get(name);
  procs.set(name, { name, status, pid: pid ?? p?.pid, lastSeen: Date.now() });
  broadcast({ type: 'proc', name, status, pid: pid ?? p?.pid });
}
setInterval(() => {
  const now = Date.now();
  for (const p of procs.values()) if (p.status === 'up' && p.name !== AFTERLIFE && now - p.lastSeen > 4500) setProc(p.name, 'down', p.pid);
}, 500);
function seedProcs() {
  procs.clear();
  for (const r of ['workergpt', 'standbyclaude']) procs.set(fullName(r), { name: fullName(r), status: 'down', lastSeen: 0 });
}
seedProcs();

// ---------------------------------------------------------------- dispatcher: LOST -> Relay DM to standby
async function dispatch(taskId: string) {
  const t = await lease.status(taskId);
  if (!t || t.state !== 'LOST') return;
  const channel = channels.get(taskId) ?? `task-${taskId}`;
  const key = `${taskId}:${t.epoch}`;
  const to = fullName('standbyclaude');
  // deterministic from (taskId, epoch) so a retry re-sends the identical payload under the same idempotency key
  const payload = handoffs.get(key) ?? {
    kind: 'handoff', taskId, epoch: t.epoch, resumeFromStep: t.step + 1, channel, to,
    summary: `${t.owner} (${t.vendor}) went silent; steps 1-${t.step} committed; resume at step ${t.step + 1} from #${channel}`,
  };
  handoffs.set(key, payload);
  if (!relay) { lease.log(taskId, 'dm', `NO RELAY: could not DM ${to}`); return; }
  // "presumed dead" notice in the task channel (best effort, not on the critical path)
  relay.post(channel, `${t.owner} presumed dead: no heartbeat for ${((t.detectLatencyMs ?? 0) / 1000).toFixed(1)}s. Epoch ${t.epoch - 1} -> ${t.epoch}. Handing to ${to}.`,
    { kind: 'alarm', taskId, epoch: t.epoch, step: t.step }, `${key}:alarm`).then((m) => ingestRelay({ id: m.id, from: AFTERLIFE, channel, text: `${t.owner} presumed dead; epoch ${t.epoch}`, data: { kind: 'alarm', taskId, epoch: t.epoch }, ts: Date.now() }))
    .catch((e) => console.warn('[dispatch] alarm post failed', e.message));
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const text = `HANDOFF: resume task ${taskId} at step ${payload.resumeFromStep} (epoch ${payload.epoch}). ${payload.summary}`;
      const m = await relay.dm(to, text, payload, key);
      const st = procs.get(to)?.status === 'up' ? 'online' : 'offline, queued in Relay';
      lease.log(taskId, 'dm', `DM ${m.id} -> ${to} (${st}): resume step ${payload.resumeFromStep}, epoch ${payload.epoch}, idem ${key}`);
      await ingestRelay({ id: m.id, type: 'dm', from: AFTERLIFE, text, data: payload, ts: Date.now() });
      return;
    } catch (e: any) {
      console.warn(`[dispatch] DM attempt ${attempt} failed`, e.message);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  lease.log(taskId, 'dm', `DM to ${to} FAILED after retries`);
}

lease.on((evt: any) => {
  if (evt.type === 'outbox') outbox.push(evt);
  broadcast(evt);
  if (evt.type === 'ledger' && evt.kind === 'alarm') dispatch(evt.taskId).catch((e) => console.error('[dispatch]', e));
});

// ---------------------------------------------------------------- http
async function body(req: IncomingMessage): Promise<any> {
  let s = '';
  for await (const c of req) s += c;
  try { return s ? JSON.parse(s) : {}; } catch { return {}; }
}
function json(res: ServerResponse, code: number, obj: unknown) {
  res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify(obj));
}
const MIME: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };

async function replay(res: ServerResponse) {
  send(res, { type: 'reset' });
  for (const p of procs.values()) send(res, { type: 'proc', name: p.name, status: p.status, pid: p.pid });
  for (const t of await lease.list()) send(res, { type: 'task', task: t });
  for (const r of lease.ledger()) send(res, r);
  for (const m of [...relayMsgs.values()].sort((a, b) => a.ts - b.ts)) send(res, { type: 'relay', msg: m });
  for (const o of outbox) send(res, o);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://x');
  const p = url.pathname;
  try {
    if (req.method === 'GET' && p === '/events') {
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' });
      res.write(': afterlife\n\n');
      clients.add(res);
      await replay(res);
      const ka = setInterval(() => res.write(': ka\n\n'), 15000);
      req.on('close', () => { clients.delete(res); clearInterval(ka); });
      return;
    }
    if (req.method === 'GET' && p === '/health') return json(res, 200, { ok: true, relay: !!relay, backend: lease.backend, afterlife: AFTERLIFE });
    if (req.method === 'GET' && p === '/procs') return json(res, 200, [...procs.values()]);
    if (req.method === 'GET' && p.startsWith('/task/')) {
      const id = decodeURIComponent(p.slice(6));
      const t = await lease.status(id);
      const dmSent = lease.ledger(id).some((r: any) => r.kind === 'dm' && /^DM \S+ ->/.test(r.text));
      return json(res, t ? 200 : 404, { ok: !!t, task: t, dmSent, channel: channels.get(id) ?? `task-${id}`, outbox: outbox.filter((o) => o.taskId === id).length });
    }
    if (req.method === 'POST') {
      const b = await body(req);
      if (b.name) touch(b.name, b.pid);
      switch (p) {
        case '/task/start': {
          const channel = `task-${b.taskId}`;
          channels.set(b.taskId, channel);
          // background: hosted Relay can take seconds; the worker creates-or-joins the channel itself before posting
          if (relay) {
            const r = relay;
            r.ensureChannel(channel, `afterlife task ${b.taskId}`)
              .catch(() => new Promise((ok) => setTimeout(ok, 2500)).then(() => r.ensureChannel(channel)))
              .catch((e) => console.warn('[server] ensureChannel', e.message));
          }
          const task = await lease.start(b.taskId, b.owner, b.vendor, { totalSteps: 6 });
          touch(b.owner);
          return json(res, 200, { ok: true, task, channel });
        }
        case '/lease/heartbeat': return json(res, 200, await lease.heartbeat(b));
        case '/lease/commit': return json(res, 200, await lease.commit({ ...b, relayMsgId: b.relayMsgId ?? null }));
        case '/lease/claim': {
          const r = await lease.claim(b);
          return json(res, 200, { ...r, channel: channels.get(b.taskId) ?? `task-${b.taskId}` });
        }
        case '/lease/relaymsg': {
          const ok = lease.attachRelay(b.taskId, b.step, b.epoch, b.msg.id);
          await ingestRelay(b.msg);
          return json(res, 200, { ok });
        }
        case '/relay/seen': await ingestRelay(b.msg); return json(res, 200, { ok: true });
        case '/proc': setProc(b.name, b.status, b.pid); return json(res, 200, { ok: true });
        case '/reset': {
          await lease.reset();
          relayMsgs.clear(); outbox.length = 0; channels.clear(); handoffs.clear();
          seedProcs();
          writeFileSync(join(ROOT, 'outbox.jsonl'), '');
          for (const c of clients) await replay(c);
          return json(res, 200, { ok: true });
        }
      }
      return json(res, 404, { ok: false, error: 'unknown endpoint' });
    }
    // static board
    let f = normPath(join(APP, p === '/' ? 'index.html' : p));
    if (!f.startsWith(APP)) return json(res, 403, { ok: false });
    if (existsSync(f) && statSync(f).isFile()) {
      res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
      return res.end(readFileSync(f));
    }
    json(res, 404, { ok: false });
  } catch (e: any) {
    console.error('[server]', p, e);
    json(res, 500, { ok: false, error: e.message });
  }
});
server.listen(PORT, () => console.log(`[server] afterlife on http://localhost:${PORT} (lease backend ${lease.backend}, relay ${relay ? relay.name : 'off'})`));
