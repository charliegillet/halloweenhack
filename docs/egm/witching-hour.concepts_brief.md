# Concepts Brief: Witching Hour (multiplayer incident room)

**Author:** Charlie Gillet
**Date:** 2026-10-31
**Mode:** BRAINSTORM. Synthesized from 6 Goldfish lenses: Design Critic, Codebase Details, Zoom Out, Comprehension, Implementation Readiness and Structural. All six returned **proceed-with-changes**.
**Source concept:** `docs/TOP_4_IDEAS.md`, section "4. Witching Hour"

---

## Overview

Witching Hour is a shared intent ledger for an incident. Before any agent or human takes a remediation (rollback, restart, migration), they must claim it from an `IncidentRoom` Terse Durable Actor. Agents coordinate on Agent Relay. The pitch is "duplicate remediations: 2 without the ledger, 0 with it", plus a `kill -9` crash beat and a phone approval.

All six reviewers agree the problem is real and a good fit for YC. They also agree the concept as written is a **mutex with no lifecycle**. It has no lease and no expiry. Nothing enforces it at the target. No conflict rule is defined. The crash beat, the hero number and the Relay story each break in a way a Terse or Relay judge will spot. Every fix is small and well understood (leases, fencing tokens, a fake target service, deterministic triggers). The scope must also shrink, because only about 2.5 build hours are left before recording at 3:00.

The reframe the reviewers converged on: **"a lock manager for agents that share production", with the incident as the example.** It should not be pitched as an AI-SRE product competing with Resolve AI.

---

## Analysis

### Blockers

**B1. The claim has no lifecycle, so the crash beat deadlocks or double-acts.** (All 6 lenses)
The concept never says what "held" means once the holder dies. With no expiry, a dead agent's claim blocks the room forever, which looks like a hang on video. With a naive timeout, the waiter takes over while the restarted agent also resumes, and you get two rollbacks. That is the exact failure the product exists to prevent. "Resume" is also undefined: the ledger knows the claim is held, but not how far the rollback outside the actor got. Terse's CTO has said in public that Durable Actors "manages durable state, not durable execution", so overclaiming here will be noticed.
*Fix:* each claim gets `{claimId, resourceKey, action, holder, state, step, leaseUntil, fencingToken}`. Heartbeats renew the lease. The actor's **single** alarm expires leases: keep a deadlines table and always re-arm the alarm for the earliest one. Store the step cursor in the actor. In narration, say "the ledger remembers where it was", not "execution is durable".

**B2. After a restart the agent's identity is not stable.** (Design Critic, Codebase Details, Implementation Readiness)
Relay registration is create-only (409 `agent_already_exists`), and `at_live_` tokens are shown only once. A restarted agent that calls `register()` crashes on camera, or comes back under a new name the ledger does not recognise.
*Fix:* a seed script registers every identity once per run and saves the tokens to a file. Agents always start with `workspace.reconnect({apiToken})`, then `room.getMyClaim(agentName)`. The ledger keys the owner on the Relay agent name, not the PID.

**B3. Nothing enforces the ledger, and the hero number has no independent source.** (Design Critic, Codebase Details, Comprehension, Structural)
"Agents must claim" is a prompt rule. The target will run a rollback whether or not a claim exists. Counting the ledger's own grants proves nothing, and in "no ledger" mode there is nothing to count from. The Relay founders "dogfood heavily and will spot fakes".
*Fix:* build a small **FakeService** (actor or Bun process) with `version`, `health` and an applied-actions log. Its mutating endpoints require a current fencing token and reject stale ones ("stale token 41 < 42"). The hero number is computed from FakeService's log in both modes. "Without ledger" is **one flag** (`LEDGER_ENABLED`) on the same code path, not a second implementation.

**B4. "One claim at a time" is ambiguous, and "the other waits" does not stop the second action.** (Comprehension, plus Design Critic, Zoom Out and Structural as majors)
A global lock makes comms and diagnosis queue behind a rollback, which looks slow. And if B waits and then rolls back anyway, there are still two rollbacks; only the timing changed.
*Fix:* key claims by `(resource, action)` and hard-code a 3-4 row conflict table: rollback vs rollback on the same service conflicts, restart vs migrate conflicts, comms and diagnose conflict with nothing. `claim()` returns **granted**, **queued (holder X, 14s)** or **already-done (A rolled back v42)**. An agent that gets already-done posts "skipping" to Relay. That message is the key video frame. Write down that a general policy engine is out of scope.

### Majors

**M1. The LLM-driven collision will not reproduce reliably.** (Design Critic, Codebase Details, Zoom Out, Comprehension, Structural)
Latency and model choices vary between takes. In naive mode the second agent may back off or choose a different action, so the "2" disappears on the take you record.
*Fix:* split decision from narration. A seeded scenario script fires both agents' rollback at T+0. The LLM writes diagnosis, the one-line reason attached to each claim, and the streamed comms update. Say in the description that the collision is reproduced on purpose, as a chaos test.

**M2. Relay is decorative.** (5 lenses; the concept itself rates Relay two stars)
If agents call the actor directly, deleting Relay leaves the demo working. That gives the Relay judges their own known critique, "only a communication layer".
*Fix (consensus):* claims travel over Relay as a typed action or a DM to a `ledger` identity. One bridge process, using the SDK listener on the laptop (no public URL needed), turns each claim into an actor RPC and posts grant, deny or release back to `#incident-<runId>`. Waiters are woken by a Relay DM but **re-check the actor** before acting, because delivery is at-most-once. Show the Relay observer stream (`ot_live_`) as a pane. Stretch goal: a restarted agent catches up from Relay's durable messages.
*Dissent (Structural):* keep inbound Relay off the correctness path. **Resolution:** the actor is the only authority. Relay is the transport the agents use, and the bridge is a thin forwarder with a visible health chip. If the bridge dies, the UI shows "bridge down", not "waiting".

**M3. The actor's serialization can be broken by one decorator or one await.** (All 6 lenses)
`@Interleave` (which the docs recommend for LLM-awaiting methods) turns off rollback for the whole class and lets two `claim()` calls both pass the "is it free?" check. The docs contradict each other on whether a non-`@Atomic` throw rolls back.
*Fix:* `IncidentRoom` has no LLM calls, no `fetch`, no `@Interleave` and no awaits inside `claim`, `release`, `heartbeat`, `approve` or `expire`. Each of those is a synchronous SQLite check-then-write marked `@Atomic`. Store the ledger as SQLite rows, never as a pushed `@Persisted` array. Assert at most one active claim per resource, and show an **invariant-violation counter at 0** on screen. Optional: write the ledger as a pure reducer `(state, cmd) -> (state, events)` with the actor as a thin wrapper, so it can be unit-tested in minutes.

**M4. Retries and duplicates.** (Codebase Details, Implementation Readiness)
`outcome_unknown` is possible, `requestId` does not deduplicate, and the SDK never replays. Relay webhooks can deliver twice.
*Fix:* every ledger method is idempotent on `(holder, intentId, step)`. A retried claim returns the existing claim. On an unknown outcome the agent re-reads the claim instead of re-sending it.

**M5. The scope is too large for the time left.** (Zoom Out, Comprehension, Design Critic, Structural)
Phone approval needs a public URL, socket grants, durable pending state and a second user of the single alarm, and on video it looks the same as a button. Supabase adds a third persistence layer with nothing to show for it.
*Fix:* cut Supabase. Approval is a ledger state (`awaiting_approval`, then `approved by X at T` or `approval_expired`) triggered by a dashboard button through the backend. A phone, if used at all, opens the same URL on a teammate's device, filmed side by side. Humans never get Relay identities.

**M6. The harm is invisible, and the concept is "least visual".** (Comprehension, Implementation Readiness, Zoom Out, Codebase Details)
Two rollbacks shown as two log lines do not come across on video.
*Fix:* a big FakeService tile showing health and a version badge. In the no-ledger run the second rollback takes v42 to v40, which is broken, and the tile goes red again. In the ledger run it stays green. Give one lane per agent or human, a lock sigil on the holder, a waiters queue with timers, a lease countdown, the hero counter, the invariant counter and the Relay observer pane. **The observability view is the product.** Keep the Halloween skin cosmetic.

**M7. The UI can show events out of order or freeze.** (All 6 lenses)
Terse socket messages can arrive out of order (since v0.12.3), there is no auto-reconnect, and a send just before close can be dropped.
*Fix:* stamp every event with a monotonic `seq`. The client sorts by seq, and on a gap or reconnect it re-fetches a snapshot (with a fresh grant). Fallback: poll every 500 ms. Use one append-only `events` table `(seq, ts, runId, claimId, actor, kind, payload)` and carry `runId` and `claimId` through every Relay message, FakeService call and UI event.

**M8. Stale state between takes, schema drift and the quota.** (Design Critic, Codebase Details, Implementation Readiness, Structural)
Actors cannot be deleted. Constructor SQL does not add new columns to old rooms. Relay names are create-only. Five identities is already at the documented cap of about 5.
*Fix:* a "new run" script creates `runId = Date.now()`, a fresh room ID, a per-run channel and saved tokens, and shows the runId in the UI corner. Add a `schema_version` check that fails loudly. Use at most 4 Relay agents (3 agents plus the bridge/ledger identity). Check `GET /v1/workspace` for the plan before recording. Add a hop or turn cap per incident. Run `terse actor generate` and restart agents after every actor change.

**M9. There is no fallback for a sponsor outage.** (Implementation Readiness, Design Critic, Codebase Details)
Hosted Relay had incidents on Oct 5 and 9. Terse Cloud is a 2-day-old beta.
*Fix:* read `RELAY_BASE_URL` and the Terse target from env from the start. Prove `npx @relaycast/engine --port 8787` and `terse actor dev` once before 2:00. Record on whichever path is stable at 3:00. Pin terse-sdk/terse-cli 0.14.7, durable-actors 0.14.4 and @agent-relay/sdk 14.0.0.

### Minors

- Every agent is OpenAI. Swap one agent to Claude only if it takes under 15 minutes; it only posts intents, so it is cheap.
- "Bring your own agents" needs a stated three-step contract (register on Relay, claim before acting, heartbeat while holding) or should be dropped from the pitch.
- Add one line on Resolve AI: it is one agent doing diagnosis, while Witching Hour coordinates many agents and humans from any vendor.
- Token and throughput costs are not a risk: a few thousand tokens per incident, far below Terse limits. Don't optimize for them.
- Agent decisions should carry a visible one-line reason, stored in the event payload and the Relay message.

---

## Goals vs. Non-Goals

**Goals (must ship by 3:00)**
- An `IncidentRoom` actor with `claim`, `heartbeat`, `advance`, `release`, `approve`, `expire` (`@Atomic`, synchronous, SQLite), leases, fencing tokens and a conflict table keyed by `(resource, action)`.
- A FakeService with a version, a health tile and an applied-actions log, enforcing fencing tokens. The hero number is computed from this log.
- 3 agents in plain Node processes with Relay listeners. The action triggers are scripted; the LLM writes diagnosis, reasons and comms.
- A bridge that forwards Relay to the actor and posts grant, deny and release outcomes back to Relay.
- One dashboard: agent lanes, a waiters queue, a lease countdown, the FakeService tile, the hero and invariant counters, a Relay observer pane, a `LEDGER_ENABLED` toggle, an approve button and the runId.
- A "new run" seed script and env-switchable fallbacks.

**Non-Goals**
- Durable *execution* of agent code: only the ledger and step cursor are durable.
- A general policy or conflict engine, multiple rooms, or bring-your-own onboarding.
- Supabase, a phone-specific approval client, humans as Relay identities, OTel, or public webhook subscriptions.
- Being an AI-SRE diagnosis product.

---

## Alternatives Weighed

| Decision | Options | Chosen | Why |
|---|---|---|---|
| Crash beat | (a) kill the actor process and show the ledger survives; (b) kill the agent, the alarm expires its lease and B takes over; (c) kill the agent, it reconnects within its lease and resumes from the step cursor | **(c), with a zombie-rejection beat as stretch** | (c) matches the pitch and costs one integer column. Make the lease longer than the restart time so no takeover happens on camera. The fencing token makes a late zombie's rollback fail visibly. (a) is not controllable on Terse Cloud. (b) is the fallback if reconnect is flaky. |
| Claim scope | global mutex / per-resource single writer / per `(resource, action)` with a conflict table | **per `(resource, action)` + 3-4 row table** | Lets comms run in parallel and shows one granted and one denied. Bounded so it does not become a rules engine. |
| Enforcement | advisory (agent prompts) / fencing at the target | **fencing at FakeService** | Turns the hero number into a structural guarantee. About 30 lines. |
| Relay role | chat only / claims over Relay through the bridge / inbound webhooks | **claims over Relay through the SDK-listener bridge** | Makes Relay load-bearing for the Mac mini without needing a public URL. The actor stays the authority. |
| Collision | live LLM choice / scripted triggers with LLM narration | **scripted triggers** | Reproducible "2" on every take. Stated honestly as a chaos test. |
| Approval | phone page / dashboard button | **dashboard button, phone optional on the same URL** | Same beat on video for roughly a tenth of the risk. |
| Timeline store | Supabase / actor SQLite events table | **actor SQLite** | One persistence layer. |

---

## Key Decisions & Staging for Next Steps

Time left is about 12:30 to 3:00, roughly 2.5 hours. Stage in this order and cut from the bottom.

1. **12:30-12:50: freeze contracts.** Write the claim schema, the state list (`requested, queued, granted, awaiting_approval, executing, done, failed, expired, released`), the conflict table, the event schema with seq and runId, and the fencing rule. Pin versions. Write the seed script that creates the runId, workspace, channel and 4 identities and saves the tokens.
2. **12:50-1:40: core.** Build the `IncidentRoom` actor (atomic methods, deadline-table alarm, invariant check) and FakeService with fencing. Unit-test the reducer and one throw-mid-claim case.
3. **1:40-2:20: agents and bridge.** Scripted triggers, LLM narration, reconnect-on-start, `getMyClaim`, heartbeat, and the already-done skip path. Add the `LEDGER_ENABLED` flag. Prove the local Relay and Terse fallbacks once.
4. **2:20-2:50: dashboard.** Lanes, the tile, counters, the waiters queue, the lease countdown, the observer pane, the approve button, seq-sorted rendering with snapshot refetch.
5. **2:50-3:00: rehearse** kill -9 at three points (before the claim, after the grant, mid-execution). Check the plan quota, then start a fresh run for recording.

**Cut order (first to go):** Claude agent, then zombie-fencing beat on video (keep the enforcement in code), then the approval state, then the observer pane (fall back to a link). **Never cut:** the leases, the FakeService log as the source of the hero number, or scripted collision.

---

## Hackathon verdict

| Dimension | Score (0-10) | Note |
|---|---|---|
| Survives review | 5 | All six lenses say proceed-with-changes, but they raise 4 blockers. With leases, fencing and the FakeService it rises to about 8. |
| 5-hour feasibility | 5 | Feasible only with the cuts above. The new work (lease, fencing, FakeService) is small, but 2.5 hours leaves no slack for a Relay or Terse outage. |
| Video-demo strength | 5 | "Least visual" by its own admission. The red/green FakeService tile and the "skipping, A already rolled back" frame are what make it watchable. |
| Meaningfulness | 8 | A real and growing problem, and the strongest YC-interview story of the four. |
| Relay prize fit | 5 | Two stars as written. About 7 if claims travel over Relay and the observer pane plus durable catch-up are shown. |

**Go/no-go:** Conditional GO. Build it only as a lease-and-fencing intent ledger with a fake target service and scripted collisions; drop Supabase and the phone client now.

**Top 3 changes that would most improve the idea**
1. Replace the mutex with a real claim lifecycle: per-`(resource, action)` claims with leases, heartbeats, a step cursor, alarm-driven expiry and fencing tokens, plus stable agent identity via saved Relay tokens and `reconnect()`. This makes the kill -9 beat survive a Terse judge.
2. Make the hero number structural and reproducible: a FakeService that rejects stale or missing fencing tokens and owns the applied-actions log and the red/green health tile, with scripted collision triggers and one `LEDGER_ENABLED` flag.
3. Make Relay load-bearing and the UI the product: claims and grant/deny messages travel over `#incident-<runId>` through one SDK-listener bridge. The dashboard shows agent lanes, the waiters queue, the "already-done, skipping" message, the invariant counter at 0 and the Relay observer pane. Cut Supabase and the phone client.
