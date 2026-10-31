// Terse Durable Actor backend (LEASE_BACKEND=terse). One LeaseTask actor per task (actor/src/task.ts,
// adapted from teammate Nihal's Task actor in github.com/nihalnihalani/afterlife). The actor is the
// commit authority: epoch fencing, first-wins claim, idempotent (epoch,step) commit, and the
// RUNNING -> LOST transition (epoch++) fired by the actor runtime's own alarm. This adapter holds
// no timers that decide anything; it only polls actor state (~300ms) to turn new ledger rows and
// task changes into the same LeaseEvents the local backend emits.
// Needs the local runtime: `npm run actor:dev` (control plane on :7100, DURABLE_ACTORS_CONTROL_PLANE_URL).
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { Lease, LeaseEvent, LeaseOptions, LedgerKind, LedgerRow, Task } from './index.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const POLL_MS = Number(process.env.TERSE_POLL_MS || 300);

type View = { task: Task | null; seq: number; rows?: LedgerRow[]; res?: any; hb?: LedgerRow; outbox?: any };
type Entry = { cursor: number; task: Task | null; json: string; rows: LedgerRow[]; chain: Promise<void> };

function withTimeout<T>(p: Promise<T>, ms: number, what: string): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`${what} timed out after ${ms}ms`)), ms))]);
}

export async function createTerseLease(opts: LeaseOptions = {}): Promise<Lease> {
  const leaseMs = opts.leaseMs ?? Number(process.env.LEASE_MS || 8000);
  const outboxPath = opts.outboxPath === undefined ? join(REPO, 'outbox.jsonl') : opts.outboxPath;
  const statePath = opts.statePath === undefined ? join(HERE, 'state.json') : opts.statePath;
  const idsPath = statePath ? statePath.replace(/\.json$/, '') + '.terse-ids.json' : null;
  const ns = (process.env.TERSE_NS || 'afterlife').replace(/[^A-Za-z0-9._-]/g, '_');

  const genPath = join(REPO, 'actor', 'generated', 'index.js');
  if (!existsSync(genPath)) throw new Error('actor/generated missing; run `npm run actor:generate`');
  const { actors } = await import(pathToFileURL(genPath).href);
  const actorOf = (taskId: string) => actors.LeaseTask.get(`${ns}-${taskId.replace(/[^A-Za-z0-9._-]/g, '_')}`);
  // probe the control plane so createLease() can fall back to local if the runtime is down
  await withTimeout(actorOf('__probe').state({ since: 0 }), 2000, 'terse control plane probe');

  const listeners = new Set<(e: LeaseEvent) => void>();
  const entries = new Map<string, Entry>();
  const emit = (e: LeaseEvent) => { for (const cb of listeners) { try { cb(e); } catch (err) { console.warn('[lease:terse] listener error', err); } } };

  function saveIds() {
    if (!idsPath) return;
    try { writeFileSync(idsPath, JSON.stringify([...entries.keys()])); } catch {}
  }
  function entry(taskId: string): Entry {
    let e = entries.get(taskId);
    if (!e) { e = { cursor: 0, task: null, json: '', rows: [], chain: Promise.resolve() }; entries.set(taskId, e); saveIds(); }
    return e;
  }

  // apply a view: emit rows past the cursor, then the task if it changed
  function apply(taskId: string, v: View) {
    const e = entry(taskId);
    for (const r of v.rows ?? []) { e.rows = [...e.rows, r].slice(-500); emit(r); }
    if (v.rows) e.cursor = v.seq;
    const json = JSON.stringify(v.task);
    if (json !== e.json) {
      e.json = json;
      e.task = v.task;
      if (v.task) emit({ type: 'task', task: JSON.parse(json) });
    }
  }
  // serialized per task so concurrent polls/calls never emit a row twice
  function sync(taskId: string): Promise<void> {
    const e = entry(taskId);
    const next = e.chain.then(async () => {
      const v: View = await actorOf(taskId).state({ since: e.cursor });
      if (v.seq < e.cursor) { e.cursor = 0; e.rows = []; } // actor was reset elsewhere
      apply(taskId, v);
    }).catch((err) => { console.warn('[lease:terse] sync failed', err?.message ?? err); });
    e.chain = next;
    return next;
  }

  if (idsPath && !opts.fresh && existsSync(idsPath)) {
    try { for (const id of JSON.parse(readFileSync(idsPath, 'utf8'))) entry(id); } catch {}
  }
  await Promise.all([...entries.keys()].map(sync));

  const poll = setInterval(() => {
    for (const [id, e] of entries) if (!e.task || e.task.state !== 'DONE') void sync(id);
  }, POLL_MS);
  poll.unref?.();

  const lease: Lease = {
    backend: 'terse',

    async start(taskId, owner, vendor, o = {}) {
      const e = entry(taskId);
      await e.chain;
      const v: View = await actorOf(taskId).start({ taskId, owner, vendor, totalSteps: o.totalSteps ?? 6, leaseMs });
      e.cursor = 0; e.rows = []; e.json = '';
      await sync(taskId);
      return JSON.parse(JSON.stringify(v.task));
    },

    async heartbeat(hb) {
      const v: View = await actorOf(hb.taskId).heartbeat({ epoch: hb.epoch, step: hb.step, seq: hb.seq });
      if (v.hb) emit(v.hb);
      await sync(hb.taskId);
      return v.res;
    },

    async commit(c) {
      const v: View = await actorOf(c.taskId).commit({ epoch: c.epoch, step: c.step, author: c.author, vendor: c.vendor, text: c.text, relayMsgId: c.relayMsgId ?? null });
      if (v.outbox) {
        // the actor returns the outbox line exactly once (the single commit that moved the task to DONE)
        if (outboxPath) { try { appendFileSync(outboxPath, JSON.stringify(v.outbox) + '\n'); } catch (err) { console.warn('[lease:terse] outbox append failed', err); } }
        const o = v.outbox;
        emit({ type: 'outbox', taskId: o.taskId, text: o.text, ts: o.ts, epoch: o.epoch, author: o.author, vendor: o.vendor });
      }
      await sync(c.taskId);
      return v.res;
    },

    async claim(c) {
      const v: View = await actorOf(c.taskId).claim({ agent: c.agent, vendor: c.vendor });
      await sync(c.taskId);
      return v.res;
    },

    async status(taskId) {
      await sync(taskId);
      const t = entries.get(taskId)?.task;
      return t ? JSON.parse(JSON.stringify(t)) : null;
    },

    on(cb) { listeners.add(cb); return () => listeners.delete(cb); },

    async list() {
      await Promise.all([...entries.keys()].map(sync));
      return [...entries.values()].filter((e) => e.task).map((e) => JSON.parse(JSON.stringify(e.task)));
    },
    ledger(taskId) {
      const all = taskId ? (entries.get(taskId)?.rows ?? []) : [...entries.values()].flatMap((e) => e.rows).sort((a, b) => a.ts - b.ts);
      return [...all];
    },
    log(taskId: string, kind: LedgerKind, text: string) {
      void actorOf(taskId).log({ kind, text }).then(() => sync(taskId)).catch((err: any) => console.warn('[lease:terse] log failed', err?.message ?? err));
    },
    attachRelay(taskId, step, epoch, relayMsgId) {
      const t = entries.get(taskId)?.task;
      if (!t || !t.steps.some((s) => s.step === step && s.epoch === epoch)) return false;
      void actorOf(taskId).attachRelay({ step, epoch, relayMsgId }).then(() => sync(taskId)).catch(() => {});
      return true;
    },

    async reset(taskId) {
      const ids = taskId ? [taskId] : [...entries.keys()];
      await Promise.all(ids.map((id) => actorOf(id).reset()));
      for (const id of ids) entries.delete(id);
      saveIds();
    },

    close() { clearInterval(poll); listeners.clear(); },
  };
  return lease;
}
