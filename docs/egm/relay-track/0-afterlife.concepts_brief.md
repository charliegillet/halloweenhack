# Concepts Brief: Afterlife, durable task leases and context handoff for long-running AI agents

**Author:** Charlie Gillet
**Date:** 2026-10-31

## Overview

Afterlife's pitch is "When an agent dies, its work doesn't." Each 6-step LLM task is a Terse Durable Actor that holds a lease alarm, an attempt counter and a checkpoint ledger. Workers run as separate processes. They send heartbeats straight to the actor and post checkpoints over Agent Relay. A board page renders the actor's WebSocket. Demo beats: three tasks run; `kill -9` a worker "and the bridge"; the alarm fires and the card turns red ("lost, attempt 2"); a standby receives a Relay DM and continues from step 4; a `kill -STOP`/`-CONT` zombie write is rejected on screen. Source: [0-afterlife.concept.md](./0-afterlife.concept.md).

Context: Haunted Hacks: Real-Time AI Edition, YC SF, Sat 31 Oct 2026. It is about 13:00, building stops at 16:00, so **about 2.5-3 hours of build time are left**. Round 1 is judged from a demo video plus a description, and a working demo is required. **The target is the Agent Relay track (Mac mini) only.** Terse is a bonus, and the kickoff notes say a Durable Actors track was not announced.

Six Goldfish lenses ran in BRAINSTORM mode: Design Critic, Codebase Details, Zoom Out, Comprehension, Implementation Readiness and Structural. **All six completed and all six returned *proceed-with-changes*.** They agree closely: the mechanics are sound and buildable, but as written this is a Terse demo with Relay as a side pipe, and the main handoff beat has no defined sender.

## Analysis

Findings are deduplicated across lenses. The count in brackets shows how many of the 6 lenses raised each one.

### Blockers

**B1. Relay is not essential, and none of its differentiators are shown [6/6].** The alarm detects the death, heartbeats skip Relay, the actor holds the ledger and does the fencing, and the board reads the actor socket. Relay carries checkpoint posts and one DM, and either could be a plain HTTP POST. The fallback "Afterlife-solo: no Relay" admits that Relay can be removed. None of the four things the founders say set Relay apart appear. All agents are one vendor. Everything is one person on one laptop. The standby is already online, so the DM is a live push, not durable offline delivery. Shared history is not used, because the standby gets its context from the DM payload or the actor. A Relay judge can fairly say "same demo with Redis pub/sub" or "this is Temporal-lite".
*Fix:* make Relay carry the recovery, with no new infrastructure. (1) **Cross-vendor:** workers on the OpenAI API, standby on Claude, and say so out loud: "GPT died at step 3; Claude finished it." (2) **Offline delivery:** the standby process is *not running* when the lease expires. The handoff DM waits in Relay, and the standby is started afterwards and drains it. (3) **Shared history:** each task gets its own Relay channel (or thread) holding the checkpoint record. The standby rebuilds steps 1-3 from that history with `messages.list`, not from the actor or a stuffed DM. (4) Optional: run the standby on a teammate's laptop for a cross-person beat ("my agent died, my teammate's agent picked it up").

**B2. No Relay traffic is visible on screen [6/6].** The board renders only actor state. In a video, a card turning red looks the same as a React state change. The founders dogfood heavily and will look for faked or hidden traffic.
*Fix:* add a Relay observer pane (`POST /observer-tokens`, then `wss://cast.agentrelay.com/v1/ws?token=ot_live_...`, or `@relaycast/react`) next to the board, scoped to the task channels and DMs. Show the Relay message id, sender `envelope.from.name` (not `.handle`) and timestamp. Every card event shows the same Relay message id, so viewers can match the two panes. This is about 30 minutes of work and the most valuable addition for this track. Never show `rk_live_` or `TERSE_API_KEY`.

**B3. The "bridge" is undefined, and after the kill nothing can send the handoff DM [6/6].** Actors cannot hold Relay listeners, so some process has to connect Relay and the actor. Demo step 2 kills that process. Then either the DM comes from inside `onAlarm` as an outbound REST POST to Relay with an `at_live_` token stored in the actor (never tested: outbound fetch from a Terse actor, and actor secrets on Terse Cloud), or a surviving process sends it, which makes "nothing supervising" false. If this is left vague, the build stalls at the riskiest step, or someone triggers the DM by hand, which is exactly the "meat proxy" the founders say they will spot. Killing the bridge also freezes the healthy cards on camera, and it is unclear which death turned the card red.
*Fix:* **remove the bridge from the kill beat. Kill exactly one worker.** Write down one path: `onAlarm` marks the task LOST, bumps the epoch, and makes one short REST POST (a Relay DM to `standby`, plus a post in the task channel) with an `Idempotency-Key` of `taskId:epoch`. No LLM call in `onAlarm`, and use a single short await. Test this path first (gate G2). If it fails on hosted Terse, try `terse actor dev` locally. If it fails there too, a small always-on **dispatcher** that is never killed polls `actor.leaseStatus()` every second and sends the DM. Say on screen which process sent it.

**B4. Fencing, the wire schema and the source of truth are not designed [6/6; blocker in 2, major in 4].** The zombie beat depends on every write carrying an attempt or epoch, but the concept never says what a heartbeat or checkpoint carries. Heartbeats (to the actor) and checkpoints (over Relay) take different routes with different timing. Relay can redeliver on reconnect, and Terse socket order has not been guaranteed since v0.12.3. Relay does not know about leases, so a zombie's Relay post will land in shared history whatever the actor decides. Without fencing, the zombie's heartbeat can extend a lease it no longer holds, and its checkpoint can overwrite the standby's step 4. The on-screen rejection then happens by luck, or only in the UI, which is faking it. There are also two ledgers (actor SQLite and Relay history) with no rule for which one wins.
*Fix:* **the actor is the only commit authority; Relay is the visible, shared record.** Every heartbeat and commit carries `{taskId, epoch, step, seq}`. `commit()` is a synchronous, non-interleaved (ideally `@Atomic`) method. It rejects `epoch < currentEpoch` with `{ok:false, reason:'fenced'}`, treats an existing `(epoch, step)` as an idempotent no-op, and writes a ledger row: `REJECTED: epoch 1 < 2, pid X, relay msg Y`. The worker commits first, then posts the checkpoint with its epoch to the task's Relay channel. The standby and the board ignore Relay messages from an old epoch. The zombie's post stays visible in the observer pane, marked "stale (attempt 1, superseded)". Visible, refused stale traffic is a stronger beat than hiding it. Reassign `@Persisted` arrays, never `.push()`.

### Majors

**M1. The fallbacks give up the prize or can't be done in time [5/6].** "Afterlife-solo, no Relay" forfeits the only target. Pivoting to TREATY at 13:15 is a rewrite with about 2.75 hours left. The 13:15 and 13:30 gates are effectively now. *Fix:* use fallbacks that keep Relay. For Relay: the local engine (`npx @relaycast/engine --db ./relay.db --port 8787`, chosen by an env flag; verify `baseUrl` on `@agent-relay/sdk@14.0.0`). Hosted Terse actors cannot reach a laptop's localhost engine, so local Relay means local `terse actor dev` too; decide hosted vs local as a pair. For alarms: the dispatcher polls the actor's lease and calls `actor.expire()`. Drop the TREATY and Séance Room rows.

**M2. The lease state machine and timing are not specified [5/6].** There is no heartbeat interval, no lease length and no rule for when the attempt increments. With heartbeats tied to LLM calls, a slow completion on the venue network marks a healthy worker dead. Each actor has one alarm, and every `alarm.set` replaces it. The card also flips from fine to red with no countdown, which looks scripted, and if the alarm doesn't fire there is no telemetry. *Fix:* states `RUNNING(e)` → `LOST` (alarm fired, epoch bumped) → `RUNNING(e+1)` on `claim()` (serialized; the first claim wins) → `DONE`. A DM means "invited to claim", not "claimed". Heartbeat every 2 s on its own timer. Lease 8 s, re-armed on each heartbeat with `alarm.set(now+8000)`. The SIGSTOP lasts at least 12 s. Persist and broadcast `last_heartbeat_at`, `lease_expires_at`, `alarm_fired_at` and `detect_latency_ms`. Draw a draining lease bar on each card. Log every `alarm.set` and `onAlarm` entry and exit to the ledger.

**M3. The demo is too dense for 2 minutes and for the remaining build time [4/6].** Three tasks, a kill, an alarm, a handoff and a zombie cycle, with 18 streamed LLM steps at 5-15 s each. The zombie beat is the most fragile part and earns little on the Relay track. *Fix:* build with **1 task** first, then 2 for the video (one killed, one paused). The zombie beat is a stretch goal, added only after the handoff works end to end. Limit each step to 120-200 output tokens, temperature 0, short fixed input. Script the kill and stop with a timed shell script so takes repeat. Record terminal, board and observer pane in one frame.

**M4. The agent cap, quota and re-registration will bite during recording [5/6].** Three workers, a standby, a bridge and an actor identity add up to 6 or more against the cap of about 5 per hosted workspace (not enforced on 30 Oct, but it can be switched on). An anonymous workspace may be plan `trial` (100 messages, ever) rather than `free` (10k/month), and each run sends 20-40 messages. Registration is create-only (409 `agent_already_exists`), so take 2 crashes, and actor state from take 1 leaks into take 2. *Fix:* 4 identities: `worker-gpt-a`, `worker-gpt-b` (zombie), `standby-claude`, `afterlife` (used by actor REST and the dispatcher). The board uses an observer token, not an identity. Register once in a seed script, store the `at_live_` tokens in `.env`, and always `reconnect`. Add a `runId` suffix to agent names and actor IDs (`task-<runId>-1`), show the `runId` on the board, and add a `reset` script. Run `GET /v1/workspace` now, and use a fresh workspace for the final recording.

**M5. Nothing proves the standby really continued from steps 1-3 [3/6].** If the standby's input isn't shown, step 4 looks generated from scratch, and nothing shows that a missed DM or ignored checkpoint was the cause. The DM's content isn't defined either. Full outputs risk size limits and create a second copy of the truth. *Fix:* the DM is a pointer plus a short summary: `{taskId, epoch:2, resumeFromStep:4, channel, summary}`. The standby reads the channel history, filters to the current epoch, and resumes from `max(committed step)+1`. The card shows "resumed at step 4 from checkpoint #3, msg rly_..., by standby-claude (Claude)". Make step 4's prompt quote a specific fact from step 3. Tag every step with author, vendor and epoch.

**M6. The problem framing is a toy and reads as infrastructure [4/6].** "A report from a fixed fact sheet" has no stakes, and lease, fencing and epoch mean nothing to non-specialist judges. Leases with fencing tokens are textbook (Chubby, Temporal, SQS visibility timeouts), which is a risk to the originality score. *Fix:* open with a 10-second before/after. A long agent job dies at step 4 (laptop sleeps, OOM, rate limit), and the work is lost or done twice, for example the customer email goes out twice. Pick a task with a side effect that must happen once, so blocking the zombie matters. Use plain board labels: "heartbeat", "presumed dead", "taken over by Claude", "late write from the old agent blocked". Pitch: *"Relay already gives agents durable mail and shared history. Afterlife adds the missing claim-and-fence layer on top, so a different vendor's agent, offline when the crash happened, can safely pick up a dead agent's work."*

**M7. Only the Relay version is pinned, and there is no rollback point [2/6].** Terse ships 2-4 releases a day, clients older than v0.13 break, and generated clients come from the running server's contract. *Fix:* pin `terse-sdk`/`terse-cli` 0.14.x, `durable-actors` 0.14.4 and `@agent-relay/sdk` 14.0.0 exactly. Commit the lockfile and the generated client now. No `npm update` before 16:00. Tag a git commit at each gate. Wrap each SDK in one thin adapter file (`relay.ts`, `lease.ts`).

### Minors (grouped)
- **Alarm docs conflict [5/6]:** `agent-relay.md` §7.6 says Durable Actors has no alarm API (v0.7.9). `terse.md` says alarms shipped in v0.8.1 (one per actor, polled every 100 ms, fires while dormant). Trust `terse.md`, but run the gate and record the result in the concept file.
- **DM listener trap:** DMs arrive as `dm.received`, not `message.created`. A send returns `queued_unconfirmed`, which only means enqueued. Use `addListener('*')` and log every envelope type.
- **Board socket:** add `seq` to every broadcast and sort on the client. Write a 10-line reconnect. The backend issues `prepareWebsocket` grants; keys stay server-side.
- **`outcome_unknown` (v0.5.0):** a worker killed mid-call may or may not have committed. Idempotent `commit` on `(taskId, epoch, step)` covers this.
- **Process sprawl and no runbook:** one `bun run demo` script starts every process with fixed tokens. A `reset` script makes a new `runId`.
- **LLM telemetry:** log step start, end, latency and errors to the ledger, so a slow LLM can't look like a dead worker. Label each card with model and vendor.

## Goals vs. Non-Goals

**Goals**
- A handoff that Relay visibly carries: cross-vendor (GPT to Claude), offline delivery (the standby boots after the death), and context rebuilt from shared Relay history (B1).
- Real Relay traffic on screen through an observer pane, matched to board events by message id (B2).
- One defined path for alarm → DM, with nothing faked and no hand-triggered messages (B3).
- Real fencing in the actor: `{taskId, epoch, step, seq}` on every write, stale writes refused and recorded (B4).
- Visible lease state (countdown bar, detect latency) and visible proof of continuity (step 4 cites step 3) (M2, M5).
- A meaningful framing with a side effect that must happen once (M6).

**Non-Goals (today)**
- Three concurrent tasks in the first build; the zombie beat before the handoff works.
- Killing the bridge or dispatcher as part of the demo.
- Relay presence leases (Relaycast 12.1+) as the liveness signal; they are young and unverified.
- Any fallback that drops Relay, or a pivot to TREATY or the Séance Room.
- Cross-workspace federation, Freestyle VMs, a generic job-scheduler API.
- Persisting full step outputs in the DM.

## Alternatives Weighed

| Decision | Option chosen | Rejected | Why |
| --- | --- | --- | --- |
| Role split | Actor = clock and commit authority; Relay = visible checkpoint record and shared history | Actor holds everything, Relay is a pipe | Relay-track fit (B1); one rule for which ledger wins (B4) |
| Who sends the handoff DM | Actor `onAlarm` → Relay REST, with an `Idempotency-Key` | A bridge that is killed in the same beat | Nothing would be left to send it (B3) |
| DM fallback | Always-on dispatcher polling `leaseStatus()` | Hand-triggered DM | Hand-triggering is the "meat proxy" the founders reject |
| Standby state at handoff | Offline; boots and drains the DM | Already listening | Shows durable offline delivery (B1) |
| Standby context source | Relay channel history filtered by epoch | DM payload or actor ledger | Shows shared history, no size limits (B1, M5) |
| Vendors | Workers on the OpenAI API, standby on Claude | Single vendor | The founders' main differentiator, and nearly free |
| Zombie handling | Actor fences; stale Relay post shown as "superseded" | UI-only rejection | UI-only is a fake (B4) |
| Kill beat | Kill exactly one worker | Worker plus bridge | Clear cause and effect; healthy cards keep updating (B3) |
| Relay fallback | Local engine via env flag (paired with local Terse) | Afterlife-solo, no Relay | Keeps the prize (M1) |
| Alarm fallback | Dispatcher polls and calls `expire()` | TREATY pivot | No rewrite at 13:15 (M1) |
| Scope | 1 task to build, 2 for the video; zombie as a stretch | 3 tasks plus zombie from the start | Time, agent cap, fragility (M3, M4) |

## Key Decisions & Staging for Next Steps

**Decide now (before any code):** the role split and the alarm → DM path (B3, B4); the identity list `worker-gpt-a`, `worker-gpt-b`, `standby-claude`, `afterlife`, all suffixed with `runId` (M4); the numbers (2 s heartbeat, 8 s lease, at least 12 s STOP, steps of 120-200 tokens); the task story, with a side effect that must happen once (M6).

**Staging (time boxes):**
1. **13:00-13:20, gates (run now, not at 13:15/13:30).** G1: an alarm fires while the actor is dormant (past 10 s idle) and broadcasts. G2: `onAlarm` → `fetch` POST of a Relay DM with a stored `at_live_` token works on hosted Terse (else `terse actor dev`, else the dispatcher). G3: `GET /v1/workspace` shows the plan. G4: a DM sent to an offline agent is drained on connect through `addListener('*')`. Pin versions, commit the lockfile, tag `gates-ok`. Record pass or fail and the time in the concept file.
2. **13:20-14:15, core loop with 1 task.** Seed and reset scripts. Actor with `heartbeat`, `commit` (fenced, idempotent, synchronous), `claim` and the alarm. A GPT worker with a separate heartbeat timer, commit-then-post to the task channel. `onAlarm` → LOST, epoch++, DM. A Claude standby started after the death: drain the DM, `claim`, read the channel history, resume at step 4 quoting step 3. Tag `core-ok`.
3. **14:15-14:45, screen.** Board with a lease bar, author, vendor and epoch tags, and Relay message ids. The observer pane. One `bun run demo` script. Tag `screen-ok`.
4. **14:45-15:00, stretch only if 2 and 3 work.** A second task and the STOP/CONT zombie beat, with the stale post marked "superseded" in the observer pane.
5. **15:00, freeze.** 15:00-15:30: record from a scripted run, with a fresh workspace and `runId`. 15:30-15:50: write the description (cross-vendor, offline delivery, shared history, the claim-and-fence layer on Relay; name the packages) and submit before 16:00. For the live final, have the local engine, `terse actor dev` and the recorded clip ready.

**Open items:** G2 (outbound fetch from an actor, actor secrets on Terse Cloud) is the one unknown that decides the architecture. Confirm `baseUrl` on SDK 14.0.0 for the local fallback. Confirm with Olivier whether a Durable Actors track exists (it only affects the bonus).

## Hackathon verdict

| Dimension | Score (0-10) | Note |
| --- | --- | --- |
| Survives review | 6 | Four blockers, all fixable by design decisions made now; the mechanics are sound and all six lenses said proceed-with-changes |
| Feasibility in remaining time | 6 | Feasible in about 2.5-3 h only with the 1-to-2-task scope, the bridge out of the kill beat, and the zombie as a stretch; G2 is the one real unknown |
| Video-demo strength | 7 | `kill -9` → draining lease bar → red card → offline Claude agent boots and continues is easy to follow; it needs the observer pane to read as real |
| Meaningfulness | 6 | Agent crash recovery is a real pain, but the fact-sheet report is a toy and the design is textbook; needs a side effect that must happen once and the claim-and-fence framing |
| Relay prize fit | 6 | 3-4 as written (Relay is a side pipe); about 8 once cross-vendor, offline delivery, shared history and the observer pane are in, all of which are cheap |

**Go/no-go:** GO, conditional on adopting the Relay-centred handoff now (offline Claude standby rebuilding context from Relay history, observer pane, kill only the worker) and passing gate G2 or switching to the always-on dispatcher by 13:20. Do not use any fallback that drops Relay.

**Top 3 changes that would most improve the idea:**
1. **Make the handoff a Relay moment.** The GPT worker dies. The Claude standby is offline, then boots, drains the queued DM and rebuilds steps 1-3 from the task's Relay channel history. Show it all in an observer pane next to the board.
2. **Define the single alarm → DM path, and kill only the worker.** `onAlarm` makes a short REST POST to Relay with an idempotency key (tested first); if that fails, an always-on dispatcher sends it. No bridge in the kill beat, nothing triggered by hand.
3. **Fence every write and cut scope.** `{taskId, epoch, step, seq}` on every heartbeat and commit, a synchronous fenced `commit()` in the actor, and stale Relay posts shown as "superseded". 2 s heartbeat, 8 s lease, visible countdown. Build 1 task first and add the zombie beat only after the handoff works; freeze at 15:00.
