// Terse variant of lease/test.ts (same scenario against the LeaseTask actor). Needs `npm run actor:dev`.
import assert from 'node:assert/strict';
import { readFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createLease, createLocalLease, type LeaseEvent } from '../lease/index.ts';
import { createTerseLease } from '../lease/terse.ts';

const outboxPath = join(tmpdir(), `afterlife-outbox-test-${process.pid}.jsonl`);
const statePath = join(tmpdir(), `afterlife-lease-test-${process.pid}.json`);
const lease = await createTerseLease({ statePath, outboxPath, fresh: true, leaseMs: 8000 });
const events: LeaseEvent[] = [];
lease.on((e) => events.push(e));
const T = 'tasktest' + process.pid; await lease.reset(T);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ok = (m: string) => console.log('  PASS', m);

// factory honours LEASE_BACKEND and falls back to local
const viaFactory = await createLease({ backend: 'terse', statePath: null, outboxPath: null });
assert.equal(viaFactory.backend, 'terse'); viaFactory.close();
ok('createLease(terse) -> terse actor backend');

// start
let t = await lease.start(T, 'workergpttest', 'openai');
assert.equal(t.state, 'RUNNING'); assert.equal(t.epoch, 1);
ok('start -> RUNNING(1)');

// heartbeats every 2s keep it alive past one lease length? (short: 3 beats)
let seq = 0;
for (let i = 0; i < 3; i++) {
  const r = await lease.heartbeat({ taskId: T, epoch: 1, step: 0, seq: ++seq });
  assert.equal(r.ok, true);
  await sleep(200);
}
ok('heartbeats accepted, lease re-armed');

// worker commits steps 1..3
for (const s of [1, 2, 3]) {
  const r = await lease.commit({ taskId: T, epoch: 1, step: s, author: 'workergpttest', vendor: 'openai', text: `step ${s} text`, relayMsgId: `msg_${s}` });
  assert.equal(r.ok, true);
}
assert.equal((await lease.status(T))!.step, 3);
ok('commits 1-3 at epoch 1');

// idempotent recommit
const dup = await lease.commit({ taskId: T, epoch: 1, step: 3, author: 'workergpttest', vendor: 'openai', text: 'step 3 again' });
assert.deepEqual([dup.ok, (dup as any).duplicate], [true, true]);
assert.equal((await lease.status(T))!.steps.length, 3);
ok('recommit (1,3) is an idempotent no-op');

// stop heartbeats ("kill -9") -> LOST within ~8s, epoch++
const killedAt = Date.now();
while ((await lease.status(T))!.state === 'RUNNING') {
  assert.ok(Date.now() - killedAt < 9500, 'lease did not expire in time');
  await sleep(100);
}
t = (await lease.status(T))!;
const waited = Date.now() - killedAt;
assert.equal(t.state, 'LOST'); assert.equal(t.epoch, 2);
assert.ok(t.alarmFiredAt && t.detectLatencyMs! >= 7900 && t.detectLatencyMs! < 9000, `detectLatencyMs=${t.detectLatencyMs}`);
assert.ok(events.some((e) => e.type === 'ledger' && e.kind === 'alarm'));
ok(`LOST after ${waited}ms, epoch 1 -> 2, detectLatencyMs=${t.detectLatencyMs}`);

// old worker cannot resurrect the lease with a heartbeat
const zhb = await lease.heartbeat({ taskId: T, epoch: 1, step: 3, seq: ++seq });
assert.deepEqual([zhb.ok, (zhb as any).reason], [false, 'fenced']);
ok('stale heartbeat fenced');

// claim by standby; second claimer loses
const c1 = await lease.claim({ taskId: T, agent: 'standbyclaudetest', vendor: 'anthropic' });
const c2 = await lease.claim({ taskId: T, agent: 'someoneelse', vendor: 'x' });
assert.deepEqual([c1.ok, c1.epoch, c1.resumeFromStep], [true, 2, 4]);
assert.equal(c2.ok, false);
t = (await lease.status(T))!;
assert.deepEqual([t.state, t.epoch, t.owner], ['RUNNING', 2, 'standbyclaudetest']);
ok('claim -> RUNNING(2), first claim wins, resumeFromStep 4');

// zombie (epoch 1) late write -> fenced + REJECTED ledger row
const z = await lease.commit({ taskId: T, epoch: 1, step: 4, author: 'workergpttest', vendor: 'openai', text: 'zombie step 4', relayMsgId: 'msg_zombie' });
assert.deepEqual([z.ok, (z as any).reason], [false, 'fenced']);
const rej = lease.ledger(T).find((r) => r.kind === 'rejected' && r.text.startsWith('REJECTED: epoch 1 < 2'));
assert.ok(rej, 'missing REJECTED ledger row');
assert.ok(!(await lease.status(T))!.steps.some((s) => s.step === 4));
ok(`stale commit fenced; ledger: "${rej!.text}"`);

// standby finishes 4..6; step 6 writes outbox exactly once
for (const s of [4, 5, 6]) {
  const r = await lease.commit({ taskId: T, epoch: 2, step: s, author: 'standbyclaudetest', vendor: 'anthropic', text: s === 6 ? 'REFUND $120 to guest' : `step ${s}` });
  assert.equal(r.ok, true);
}
const again = await lease.commit({ taskId: T, epoch: 2, step: 6, author: 'standbyclaudetest', vendor: 'anthropic', text: 'REFUND $120 to guest' });
assert.equal((again as any).duplicate, true);
const zombie6 = await lease.commit({ taskId: T, epoch: 1, step: 6, author: 'workergpttest', vendor: 'openai', text: 'REFUND $120 to guest' });
assert.equal(zombie6.ok, false);
t = (await lease.status(T))!;
assert.equal(t.state, 'DONE');
const outLines = readFileSync(outboxPath, 'utf8').trim().split('\n');
assert.equal(outLines.length, 1);
assert.equal(events.filter((e) => e.type === 'outbox').length, 1);
ok('DONE; outbox written exactly once (dup + zombie step 6 refused)');

// persistence round trip
const reloaded = await createTerseLease({ statePath, outboxPath: null });
const r2 = (await reloaded.status(T))!;
assert.deepEqual([r2.state, r2.epoch, r2.steps.length], ['DONE', 2, 6]);
reloaded.close();
ok('fresh adapter reloads task from the actor');

lease.close();
for (const p of [outboxPath, statePath]) if (existsSync(p)) rmSync(p);
console.log('ALL LEASE TESTS PASSED');
