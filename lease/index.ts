// Afterlife lease authority: the ONLY commit authority for a task.
// State machine: RUNNING(e) -> LOST (lease expired, epoch++) -> RUNNING(e+1) on claim() (first wins) -> DONE.
// Every heartbeat/commit carries {taskId, epoch, step, seq}. Writes from an old epoch are fenced.
// Backend: LEASE_BACKEND=local (default; in-process node timers + JSON snapshot) | terse (see ./terse.ts).
import { appendFileSync, existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export type TaskState = 'RUNNING' | 'LOST' | 'DONE';

export interface StepRecord {
  step: number;
  author: string;
  vendor: string;
  epoch: number;
  text: string;
  relayMsgId?: string | null;
  ts: number;
}

export interface Task {
  taskId: string;
  state: TaskState;
  epoch: number;
  step: number; // highest committed step (0 = none)
  totalSteps: number;
  owner: string;
  vendor: string;
  leaseMs: number;
  leaseExpiresAt: number;
  lastHeartbeatAt: number;
  lastSeq: number;
  alarmFiredAt: number | null;
  detectLatencyMs: number | null; // alarmFiredAt - lastHeartbeatAt (time from last sign of life to "presumed dead")
  alarmLagMs: number | null; // alarmFiredAt - leaseExpiresAt (timer lateness)
  owners: { epoch: number; owner: string; vendor: string; since: number }[];
  steps: StepRecord[];
  startedAt: number;
  doneAt: number | null;
}

export type LedgerKind = 'heartbeat' | 'commit' | 'rejected' | 'alarm' | 'claim' | 'dm' | 'done' | 'start';

export interface LedgerRow {
  type: 'ledger';
  taskId: string;
  kind: LedgerKind;
  text: string;
  ts: number;
  epoch?: number;
  step?: number;
}

export type LeaseEvent =
  | { type: 'task'; task: Task }
  | LedgerRow
  | { type: 'outbox'; taskId: string; text: string; ts: number; epoch: number; author: string; vendor: string };

export type CommitResult =
  | { ok: true; duplicate?: boolean; done?: boolean; epoch: number; step: number }
  | { ok: false; reason: 'fenced' | 'lost' | 'done' | 'unknown_task' | 'bad_step'; currentEpoch?: number; text?: string };

export interface Lease {
  start(taskId: string, owner: string, vendor: string, opts?: { totalSteps?: number }): Promise<Task>;
  heartbeat(hb: { taskId: string; epoch: number; step: number; seq: number }): Promise<
    { ok: true; leaseExpiresAt: number; epoch: number } | { ok: false; reason: 'fenced' | 'lost' | 'done' | 'unknown_task'; currentEpoch?: number }
  >;
  commit(c: { taskId: string; epoch: number; step: number; author: string; vendor: string; text: string; relayMsgId?: string | null }): Promise<CommitResult>;
  claim(c: { taskId: string; agent: string; vendor: string }): Promise<{ ok: boolean; epoch: number; reason?: string; resumeFromStep?: number }>;
  status(taskId: string): Promise<Task | null>;
  on(cb: (evt: LeaseEvent) => void): () => void;
  // extras (not in the shared contract, safe to ignore)
  list(): Promise<Task[]>;
  ledger(taskId?: string): LedgerRow[];
  log(taskId: string, kind: LedgerKind, text: string): void; // e.g. dispatcher records 'dm'
  reset(taskId?: string): Promise<void>;
  close(): void;
  backend: 'local' | 'terse';
}

export interface LeaseOptions {
  leaseMs?: number; // default env LEASE_MS or 8000
  statePath?: string | null; // default lease/state.json; null = no persistence
  outboxPath?: string | null; // default <repo>/outbox.jsonl; null = no file
  fresh?: boolean; // ignore existing snapshot
  backend?: 'local' | 'terse';
}

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const LEDGER_CAP = 500;

export async function createLease(opts: LeaseOptions = {}): Promise<Lease> {
  const backend = opts.backend ?? ((process.env.LEASE_BACKEND as 'local' | 'terse') || 'local');
  if (backend === 'terse') {
    try {
      const { createTerseLease } = await import('./terse.ts');
      return await createTerseLease(opts);
    } catch (e: any) {
      console.warn(`[lease] terse backend unavailable (${e?.message ?? e}); falling back to local`);
    }
  }
  return createLocalLease(opts);
}

export function createLocalLease(opts: LeaseOptions = {}): Lease {
  const leaseMs = opts.leaseMs ?? Number(process.env.LEASE_MS || 8000);
  const statePath = opts.statePath === undefined ? join(HERE, 'state.json') : opts.statePath;
  const outboxPath = opts.outboxPath === undefined ? join(REPO, 'outbox.jsonl') : opts.outboxPath;

  const tasks = new Map<string, Task>();
  let ledgerRows: LedgerRow[] = [];
  const timers = new Map<string, NodeJS.Timeout>();
  const listeners = new Set<(e: LeaseEvent) => void>();

  // ---- persistence ----
  if (statePath && !opts.fresh && existsSync(statePath)) {
    try {
      const snap = JSON.parse(readFileSync(statePath, 'utf8'));
      for (const t of snap.tasks ?? []) tasks.set(t.taskId, t);
      ledgerRows = snap.ledger ?? [];
    } catch (e) {
      console.warn('[lease] could not read state.json, starting fresh', e);
    }
  }
  function persist() {
    if (!statePath) return;
    try {
      const tmp = statePath + '.tmp';
      writeFileSync(tmp, JSON.stringify({ savedAt: Date.now(), tasks: [...tasks.values()], ledger: ledgerRows }, null, 1));
      renameSync(tmp, statePath);
    } catch (e) {
      console.warn('[lease] persist failed', e);
    }
  }

  // ---- events ----
  function emit(e: LeaseEvent) {
    for (const cb of listeners) {
      try { cb(e); } catch (err) { console.warn('[lease] listener error', err); }
    }
  }
  const snapshot = (t: Task): Task => JSON.parse(JSON.stringify(t));
  function emitTask(t: Task) { emit({ type: 'task', task: snapshot(t) }); }
  function log(taskId: string, kind: LedgerKind, text: string, extra: { epoch?: number; step?: number } = {}) {
    const row: LedgerRow = { type: 'ledger', taskId, kind, text, ts: Date.now(), ...extra };
    if (kind !== 'heartbeat') ledgerRows = [...ledgerRows, row].slice(-LEDGER_CAP); // heartbeats: stream only
    emit(row);
  }

  // ---- alarm ----
  function arm(t: Task) {
    disarm(t.taskId);
    const delay = Math.max(0, t.leaseExpiresAt - Date.now());
    timers.set(t.taskId, setTimeout(() => onAlarm(t.taskId), delay));
  }
  function disarm(taskId: string) {
    const h = timers.get(taskId);
    if (h) clearTimeout(h);
    timers.delete(taskId);
  }
  function onAlarm(taskId: string) {
    timers.delete(taskId);
    const t = tasks.get(taskId);
    if (!t || t.state !== 'RUNNING') return;
    const now = Date.now();
    if (now < t.leaseExpiresAt) return arm(t); // re-armed meanwhile
    const prev = t.epoch;
    t.state = 'LOST';
    t.epoch = prev + 1;
    t.alarmFiredAt = now;
    t.detectLatencyMs = now - t.lastHeartbeatAt;
    t.alarmLagMs = now - t.leaseExpiresAt;
    log(taskId, 'alarm',
      `lease expired: no heartbeat from ${t.owner} for ${(t.detectLatencyMs / 1000).toFixed(1)}s; presumed dead. epoch ${prev} -> ${t.epoch}; resume from step ${t.step + 1}`,
      { epoch: t.epoch, step: t.step });
    persist();
    emitTask(t);
  }
  // If the event loop lagged past expiry, fire the alarm before judging an incoming write.
  function checkExpiry(t: Task) {
    if (t.state === 'RUNNING' && Date.now() >= t.leaseExpiresAt) { disarm(t.taskId); onAlarm(t.taskId); }
  }

  // re-arm running tasks restored from snapshot
  for (const t of tasks.values()) if (t.state === 'RUNNING') arm(t);

  const lease: Lease = {
    backend: 'local',

    async start(taskId, owner, vendor, o = {}) {
      disarm(taskId);
      const now = Date.now();
      const t: Task = {
        taskId, state: 'RUNNING', epoch: 1, step: 0, totalSteps: o.totalSteps ?? 6,
        owner, vendor, leaseMs, leaseExpiresAt: now + leaseMs, lastHeartbeatAt: now, lastSeq: 0,
        alarmFiredAt: null, detectLatencyMs: null, alarmLagMs: null,
        owners: [{ epoch: 1, owner, vendor, since: now }], steps: [], startedAt: now, doneAt: null,
      };
      tasks.set(taskId, t);
      ledgerRows = ledgerRows.filter((r) => r.taskId !== taskId);
      arm(t);
      log(taskId, 'start', `task started: owner ${owner} (${vendor}), epoch 1, lease ${leaseMs / 1000}s`, { epoch: 1, step: 0 });
      persist();
      emitTask(t);
      return snapshot(t);
    },

    async heartbeat({ taskId, epoch, step, seq }) {
      const t = tasks.get(taskId);
      if (!t) return { ok: false, reason: 'unknown_task' };
      checkExpiry(t);
      if (epoch < t.epoch) {
        log(taskId, 'rejected', `REJECTED: heartbeat epoch ${epoch} < ${t.epoch} (stale owner, seq ${seq}, step ${step})`, { epoch, step });
        return { ok: false, reason: 'fenced', currentEpoch: t.epoch };
      }
      if (t.state === 'DONE') return { ok: false, reason: 'done', currentEpoch: t.epoch };
      if (t.state === 'LOST') return { ok: false, reason: 'lost', currentEpoch: t.epoch };
      const now = Date.now();
      t.lastHeartbeatAt = now;
      t.leaseExpiresAt = now + leaseMs;
      t.lastSeq = Math.max(t.lastSeq, seq);
      arm(t);
      log(taskId, 'heartbeat', `heartbeat e${epoch} s${step} #${seq} from ${t.owner}; lease to +${leaseMs / 1000}s`, { epoch, step });
      emitTask(t);
      return { ok: true, leaseExpiresAt: t.leaseExpiresAt, epoch: t.epoch };
    },

    async commit({ taskId, epoch, step, author, vendor, text, relayMsgId = null }) {
      const t = tasks.get(taskId);
      if (!t) return { ok: false, reason: 'unknown_task' };
      checkExpiry(t);
      if (epoch < t.epoch) {
        const msg = `REJECTED: epoch ${epoch} < ${t.epoch} (step ${step} by ${author}${relayMsgId ? `, relay msg ${relayMsgId}` : ''}; late write from the old agent blocked)`;
        log(taskId, 'rejected', msg, { epoch, step });
        persist();
        return { ok: false, reason: 'fenced', currentEpoch: t.epoch, text: msg };
      }
      // idempotency: (epoch,step) already committed, or this step committed by an earlier epoch
      const existing = t.steps.find((s) => s.step === step);
      if (existing) {
        log(taskId, 'commit', `duplicate commit e${epoch} s${step} by ${author}: no-op (already committed by ${existing.author} e${existing.epoch})`, { epoch, step });
        return { ok: true, duplicate: true, epoch: t.epoch, step };
      }
      if (t.state === 'DONE') return { ok: false, reason: 'done', currentEpoch: t.epoch };
      if (t.state === 'LOST') return { ok: false, reason: 'lost', currentEpoch: t.epoch };
      if (!Number.isInteger(step) || step < 1 || step > t.totalSteps) return { ok: false, reason: 'bad_step', currentEpoch: t.epoch };
      const now = Date.now();
      t.steps = [...t.steps, { step, author, vendor, epoch, text, relayMsgId, ts: now }].sort((a, b) => a.step - b.step);
      t.step = Math.max(t.step, step);
      // a commit is also a sign of life
      t.lastHeartbeatAt = now;
      t.leaseExpiresAt = now + leaseMs;
      log(taskId, 'commit', `COMMITTED step ${step} e${epoch} by ${author} (${vendor})${relayMsgId ? ` relay msg ${relayMsgId}` : ''}`, { epoch, step });
      let done = false;
      if (step >= t.totalSteps) {
        done = true;
        t.state = 'DONE';
        t.doneAt = now;
        disarm(taskId);
        // the exactly-once side effect: written only here, only once per task
        const line = { taskId, epoch, step, author, vendor, text, relayMsgId, ts: now };
        if (outboxPath) {
          try { appendFileSync(outboxPath, JSON.stringify(line) + '\n'); } catch (e) { console.warn('[lease] outbox append failed', e); }
        }
        emit({ type: 'outbox', taskId, text, ts: now, epoch, author, vendor });
        log(taskId, 'done', `DONE: refund issued exactly once by ${author} (${vendor}) at epoch ${epoch}`, { epoch, step });
      } else {
        arm(t);
      }
      persist();
      emitTask(t);
      return { ok: true, done, epoch: t.epoch, step };
    },

    async claim({ taskId, agent, vendor }) {
      const t = tasks.get(taskId);
      if (!t) return { ok: false, epoch: 0, reason: 'unknown_task' };
      checkExpiry(t);
      if (t.state === 'DONE') return { ok: false, epoch: t.epoch, reason: 'done' };
      if (t.state === 'RUNNING') {
        if (t.owner === agent) return { ok: true, epoch: t.epoch, resumeFromStep: t.step + 1 }; // idempotent re-claim
        return { ok: false, epoch: t.epoch, reason: 'held' };
      }
      // LOST: first claim wins (single-threaded event loop = serialized)
      const now = Date.now();
      const prevOwner = t.owner;
      t.state = 'RUNNING';
      t.owner = agent;
      t.vendor = vendor;
      t.lastHeartbeatAt = now;
      t.leaseExpiresAt = now + leaseMs;
      t.lastSeq = 0;
      t.owners = [...t.owners, { epoch: t.epoch, owner: agent, vendor, since: now }];
      arm(t);
      log(taskId, 'claim', `CLAIMED by ${agent} (${vendor}) at epoch ${t.epoch}; taken over from ${prevOwner}; resume from step ${t.step + 1}`, { epoch: t.epoch, step: t.step });
      persist();
      emitTask(t);
      return { ok: true, epoch: t.epoch, resumeFromStep: t.step + 1 };
    },

    async status(taskId) {
      const t = tasks.get(taskId);
      if (!t) return null;
      checkExpiry(t);
      return snapshot(t);
    },

    on(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },

    async list() { return [...tasks.values()].map(snapshot); },
    ledger(taskId) { return taskId ? ledgerRows.filter((r) => r.taskId === taskId) : [...ledgerRows]; },
    log(taskId, kind, text) { log(taskId, kind, text); persist(); },

    async reset(taskId) {
      if (taskId) {
        disarm(taskId);
        tasks.delete(taskId);
        ledgerRows = ledgerRows.filter((r) => r.taskId !== taskId);
      } else {
        for (const id of timers.keys()) disarm(id);
        tasks.clear();
        ledgerRows = [];
      }
      persist();
    },

    close() { for (const id of [...timers.keys()]) disarm(id); listeners.clear(); },
  };
  return lease;
}

export default createLease;
