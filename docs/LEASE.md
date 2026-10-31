# Lease authority

`lease/index.ts` is the only commit authority for a task. Relay carries the visible, shared record. The lease decides what counts.

## State machine

```
start() -> RUNNING(1) --no heartbeat for 8s--> LOST (epoch++) --claim(), first wins--> RUNNING(2) --commit(step 6)--> DONE
```

- The worker sends a heartbeat every 2 s on its own timer, separate from LLM calls. Each heartbeat and each accepted commit re-arms the lease to now + 8 s (`LEASE_MS`).
- The alarm fires when the lease expires. It sets `state=LOST`, `epoch++`, `alarmFiredAt`, `detectLatencyMs` (= alarmFiredAt - lastHeartbeatAt, about 8000) and `alarmLagMs`, then emits a ledger `alarm` row and a `task` event. The always-on server listens for this and sends the Relay DM. The lease itself makes no network calls.
- `claim()` succeeds only from LOST. It is serialized by the single-threaded event loop, so the first claim wins and later ones get `{ok:false, reason:'held'}`. A re-claim by the current owner is idempotent. The claim returns `{ok, epoch, resumeFromStep}`.
- `step` is the highest committed step. A commit of step `totalSteps` (default 6) sets DONE and appends exactly one line to `outbox.jsonl` (the refund). **Only the lease writes the outbox.** The server should forward the `outbox` event and must not append the line itself.

## Fencing rules

| Write | Result |
|---|---|
| any write with `epoch < current` | `{ok:false, reason:'fenced', currentEpoch}` plus ledger `rejected`: `REJECTED: epoch 1 < 2 (step 4 by …, relay msg …; late write from the old agent blocked)` |
| commit of a step that is already committed (same `(epoch,step)`, or the step was committed by an earlier epoch) | `{ok:true, duplicate:true}`, no-op |
| heartbeat or commit while LOST, at the current epoch | `{ok:false, reason:'lost'}` (an expired lease is never extended) |
| commit after DONE | `{ok:false, reason:'done'}`, or `duplicate` if that step already exists |

If the event loop lags past expiry, each incoming write first fires the overdue alarm and is then judged against the new epoch.

## API (exact)

```ts
import { createLease } from './lease/index.ts';
const lease = await createLease();          // LEASE_BACKEND=local|terse (terse falls back to local)
await lease.start(taskId, owner, vendor, { totalSteps?: 6 }) // -> Task
await lease.heartbeat({ taskId, epoch, step, seq })  // -> {ok:true, leaseExpiresAt, epoch} | {ok:false, reason, currentEpoch}
await lease.commit({ taskId, epoch, step, author, vendor, text, relayMsgId }) // -> {ok:true, duplicate?, done?, epoch, step} | {ok:false, reason, currentEpoch, text?}
await lease.claim({ taskId, agent, vendor })          // -> {ok, epoch, reason?, resumeFromStep?}
await lease.status(taskId)                            // -> Task | null
const off = lease.on(evt => …)                        // events below; returns unsubscribe
// extras: list(), ledger(taskId?), log(taskId, kind, text) (e.g. the dispatcher logs 'dm'), reset(taskId?), close(), backend
```

`Task` = `{taskId, state, epoch, step, totalSteps, owner, vendor, leaseMs, leaseExpiresAt, lastHeartbeatAt, lastSeq, alarmFiredAt, detectLatencyMs, alarmLagMs, owners:[{epoch,owner,vendor,since}], steps:[{step,author,vendor,epoch,text,relayMsgId,ts}], startedAt, doneAt}`. It is a superset of the `/events` task shape.

Events from `on()` match the `/events` contract and can be forwarded as they are:
- `{type:'task', task}` on every state change and every heartbeat (drives the lease bar)
- `{type:'ledger', taskId, kind, text, ts, epoch?, step?}`, where kind is `heartbeat|commit|rejected|alarm|claim|dm|done|start`. Heartbeat rows are streamed only and are not kept in `ledger()`. For replay on connect, use `list()` + `ledger()`.
- `{type:'outbox', taskId, text, ts, epoch, author, vendor}`, emitted exactly once per task

## Persistence

Every change writes an atomic snapshot to `lease/state.json` (gitignored), using a tmp file and then a rename. On `createLease()`, RUNNING tasks are re-armed with their remaining lease, and a lease that has already expired fires straight away. Options: `{leaseMs, statePath (null = off), outboxPath (null = off), fresh}`.

## Backends

- **local (default, working):** in-process `setTimeout` per task inside the always-on server (`server/index.ts`, :4000). That server is never killed in the demo.
- **terse:** `LEASE_BACKEND=terse` runs the lease on a Terse Durable Actor (`durable-actors@0.14.6`, local runtime, no API key). `actor/src/task.ts` (`LeaseTask`, adapted from Nihal's Task actor in nihalnihalani/afterlife; his `attempt` is our `epoch`) is one actor per task. It holds the Task and the ledger as `@Persisted` fields, and `start`/`heartbeat`/`commit`/`claim` re-arm `this.alarm.set(leaseExpiresAt)`. The actor runtime fires `onAlarm()`, which is the only code that moves RUNNING to LOST (epoch++, `alarmFiredAt`, `detectLatencyMs`). Actor calls are serialized, so first claim wins and commits do not interleave. `lease/terse.ts` is a thin adapter. It calls the generated client (`actor/generated`) and polls each task actor every 300 ms (`TERSE_POLL_MS`) for new ledger rows, re-emitting the same `LeaseEvent`s, so the server's DM dispatcher works unchanged. The adapter has no timers that decide state. The outbox line is returned by the actor only on the commit that made the task DONE. If the control plane on :7100 does not answer within 2 s, `createLease()` falls back to local.
  - Run: `npm run actor:install` once, then terminal 1 `npm run actor:dev` (control plane :7100), terminal 2 `npm run server:terse` (or `npm run demo:terse` when no server is already up). `/health` reports `backend: "terse"`.
  - Test: `LEASE_BACKEND=terse npm run test:lease` (runs `actor/test-lease-terse.ts`, the same scenario as `lease/test.ts`, including a real 8 s alarm expiry inside the actor). `lease/test.ts` asserts that `createLease({backend:"terse"})` falls back to local, so that one assertion fails while `actor:dev` is running.
  - After editing the actor, regenerate the client: `npm run actor:generate` (with `actor:dev` running).

## Test

`npx tsx lease/test.ts` takes about 10 s and covers: start, heartbeats, recommit no-op, heartbeats stopped → LOST in ~8.0 s with epoch 1→2, stale heartbeat fenced, claim → RUNNING(2) where the first claim wins and resumeFromStep is 4, zombie commit fenced with a `REJECTED: epoch 1 < 2` ledger row, standby finishing with the outbox written exactly once (a duplicate and a zombie step 6 are both refused), and a snapshot reload.
