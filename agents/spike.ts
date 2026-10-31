// Relay spike: proves the 4 things Afterlife needs. Run: npm run spike  (RELAY_BASE_URL=http://localhost:8787 for local engine)
// Uses its own throwaway workspace + names (spike<rand>) so it never burns the seeded run's identities.
import { AgentRelay } from '@agent-relay/sdk';
import { randomBytes } from 'node:crypto';
import { baseUrl, normalize, RelayConn } from './relay.ts';

const results: { step: string; ok: boolean; detail: string }[] = [];
const rec = (step: string, ok: boolean, detail = '') => { results.push({ step, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${step} ${detail}`); };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const url = baseUrl();
  const r = randomBytes(2).toString('hex');
  console.log(`[spike] base ${url} run ${r}`);
  const t0 = Date.now();
  const ws = await AgentRelay.createWorkspace({ name: `afterlifespike${r}`, baseUrl: url });
  const key = ws.workspaceKey!;
  rec('createWorkspace', !!key, `${Date.now() - t0}ms key=${key.slice(0, 8)}…`);

  // GET workspace plan
  const wres = await fetch(`${url}/v1/workspace`, { headers: { authorization: `Bearer ${key}` } });
  const wbody: any = await wres.json();
  rec('GET /v1/workspace', wres.ok, `plan=${wbody?.data?.plan} name=${wbody?.data?.name}`);

  // register strict -> reconnect with at_live token in a fresh client (no workspace key)
  const wName = `workergpt${r}`, sName = `standbyclaude${r}`;
  const wReg: any = await ws.workspace.register({ name: wName, type: 'agent' }, { strict: true });
  const sReg: any = await ws.workspace.register({ name: sName, type: 'agent' }, { strict: true });
  rec('register strict', !!wReg.token && !!sReg.token, `tokens ${String(wReg.token).slice(0, 8)}…`);
  try {
    await ws.workspace.register({ name: wName, type: 'agent' }, { strict: true });
    rec('re-register strict throws', false, 'did not throw');
  } catch (e: any) { rec('re-register strict throws', true, String(e.message).slice(0, 80)); }

  const wRelay = new AgentRelay({ baseUrl: url, agentToken: wReg.token });
  const worker: any = await wRelay.workspace.reconnect({ apiToken: wReg.token });
  rec('reconnect({apiToken}) without workspace key', worker.name === wName, `name=${worker.name}`);
  const W = new RelayConn(wName, 'workergpt', wRelay, worker);

  // channel + data metadata + list back
  const ch = `task${r}`;
  await W.ensureChannel(ch, 'afterlife spike');
  await W.ensureChannel(ch); // idempotent
  rec('ensureChannel (create + join, idempotent)', true, ch);
  const data = { kind: 'checkpoint', taskId: `t${r}`, epoch: 1, step: 1, text: 'Guest: Room 13, cold spot, 2 nights' };
  const p = await W.post(ch, 'step 1: read complaint', data);
  rec('post with metadata', !!p.id, `id=${p.id}`);
  const hist = await W.listChannel(ch);
  const got = hist.find((m) => m.id === p.id);
  rec('messages.list returns metadata', !!got && got.data?.kind === 'checkpoint' && got.data?.step === 1,
    JSON.stringify(got ? { from: got.from, data: got.data } : hist[0]));

  // DM to an agent that is NOT connected (standby never connected yet)
  const d = await W.dm(sName, 'HANDOFF: resume task', { taskId: `t${r}`, epoch: 2, resumeFromStep: 2, channel: ch, summary: 's' }, `t${r}:2`);
  rec('dm to offline agent', !!d.id, `id=${d.id}`);
  // idempotency: same key again
  const d2 = await W.dm(sName, 'HANDOFF: resume task', { taskId: `t${r}`, epoch: 2, resumeFromStep: 2, channel: ch, summary: 's' }, `t${r}:2`).catch((e) => ({ id: 'ERR ' + e.message }));
  rec('dm idempotency key dedupes', d2.id === d.id, `first=${d.id} second=${d2.id}`);

  await sleep(1500);
  // Now standby comes online: fresh process-like client
  const sRelay = new AgentRelay({ baseUrl: url, agentToken: sReg.token });
  const live: any[] = [];
  const standby: any = await sRelay.workspace.reconnect({ apiToken: sReg.token });
  const S = new RelayConn(sName, 'standbyclaude', sRelay, standby);
  S.onAny((m, raw) => live.push({ m, type: raw.type }));
  await sleep(2500);
  rec('queued DM pushed on connect via listener', live.some((x) => x.m.id === d.id), `live events: ${live.map((x) => x.type).join(',') || 'none'}`);

  let drained: any[] = [];
  try {
    drained = await S.drainDms();
    rec('inbox.list drains queued DM', drained.some((m) => m.id === d.id), `items=${drained.length} data=${JSON.stringify(drained[0]?.data)} from=${drained[0]?.from}`);
  } catch (e: any) { rec('inbox.list drains queued DM', false, e.message); }
  if (!drained.some((m) => m.id === d.id)) {
    // Fallback: unread DM summary from inbox.get()
    try {
      const ib: any = await standby.inbox.get();
      rec('inbox.get unreadDms', (ib.unreadDms?.length ?? 0) > 0, JSON.stringify(ib.unreadDms?.[0] ?? {}).slice(0, 300));
    } catch (e: any) { rec('inbox.get unreadDms', false, e.message); }
  }
  const after = await S.drainDms().catch(() => []);
  rec('drain is ack-ed (second drain empty)', after.filter((m: any) => m.id === d.id).length === 0, `items=${after.length}`);

  // Live push: standby joins channel, worker posts, standby receives message.created; worker DMs live
  await S.ensureChannel(ch);
  live.length = 0;
  const p2 = await W.post(ch, 'step 2', { kind: 'checkpoint', taskId: `t${r}`, epoch: 1, step: 2, text: 'x' });
  const d3 = await W.dm(sName, 'live dm', { ping: 1 });
  const tLive = Date.now();
  while (Date.now() - tLive < 12000 && !live.some((x) => x.m.id === d3.id && x.m.data)) await sleep(250);
  console.log(`[spike] live dm hydrated after ${Date.now() - tLive}ms`);
  rec('live channel message.created', live.some((x) => x.m.id === p2.id), live.map((x) => `${x.type}:${x.m.from}:${JSON.stringify(x.m.data)}`).join(' | '));
  rec('live dm.received (from=envelope.from.name, data hydrated)', live.some((x) => x.m.id === d3.id && x.type === 'dm.received' && x.m.from === wName && x.m.data?.ping === 1), '');

  // standby rebuilds from history
  const h2 = await S.listChannel(ch);
  const steps = h2.filter((m) => m.data?.kind === 'checkpoint').map((m) => `${m.data!.epoch}:${m.data!.step}`);
  rec('standby reads channel history', steps.length >= 2, steps.join(','));

  // observer token
  try {
    const res = await fetch(`${url}/v1/observer-tokens`, {
      method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(10000), body: JSON.stringify({ name: 'spikeboard', scopes: ['stream:read', 'messages:read', 'channels:read', 'dms:read'], filters: { include_dms: true } }),
    });
    const b: any = await res.json();
    const ot = b?.data?.token ?? '';
    rec('POST /v1/observer-tokens', res.ok && String(ot).startsWith('ot_live_'), `status=${res.status} keys=${Object.keys(b?.data ?? b?.error ?? {}).join(',')}`);
    if (ot) {
      const mres = await fetch(`${url}/v1/channels/${ch}/messages?limit=5`, { headers: { authorization: `Bearer ${ot}` }, signal: AbortSignal.timeout(10000) });
      const mb: any = await mres.json();
      rec('observer token reads channel messages (REST)', mres.ok, `status=${mres.status} n=${Array.isArray(mb?.data) ? mb.data.length : JSON.stringify(mb).slice(0, 120)}`);
      // WS observe
      const seen: string[] = [];
      const sock = new WebSocket(`${url.replace(/^http/, 'ws')}/v1/ws?token=${ot}`);
      sock.onmessage = (ev) => { try { seen.push(JSON.parse(String(ev.data)).type); } catch {} };
      sock.onerror = (ev: any) => seen.push('ERR ' + ev?.message);
      await new Promise((r2) => { sock.onopen = r2; setTimeout(r2, 5000); });
      await sleep(500);
      await W.post(ch, 'observer ping', { kind: 'ping' });
      await W.dm(sName, 'observer dm ping', { kind: 'ping' });
      await sleep(4000);
      sock.close();
      rec('observer WS sees events', seen.length > 0, seen.join(','));
    }
  } catch (e: any) { rec('observer token', false, e.message); }

  void normalize;
  console.log('\n[spike] SUMMARY');
  for (const x of results) console.log(`${x.ok ? 'PASS' : 'FAIL'}\t${x.step}\t${x.detail}`);
  process.exit(0);
}
main().catch((e) => { console.error('[spike] crashed', e); console.log(JSON.stringify(results, null, 1)); process.exit(1); });
