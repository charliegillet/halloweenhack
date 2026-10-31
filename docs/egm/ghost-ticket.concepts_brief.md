# Concepts Brief: Ghost Ticket, cross-org agent debugging over Agent Relay

**Author:** Charlie Gillet
**Date:** 2026-10-31

## Overview

Ghost Ticket lets a vendor's support agent and a customer's agent debug a broken integration together over Agent Relay, so no human has to copy logs and config between the two sides ("don't be a meat proxy"). The vendor agent (OpenAI) can read the vendor's code and logs. The customer agent (Claude, or a second OpenAI persona) can read the customer's app and config. A Terse Durable Actor owns the ticket: its state (open → diagnosing → fix proposed → verified → closed), who claimed each step, and the agreed fix. Only one agent may apply a fix. A human approves from a phone. The Halloween skin: the customer app is "possessed" and the vendor agent "exorcises" it. Demo beats: the copy-paste "before", agents talking with the Relay observer stream on screen, killing the customer agent mid-debug so its messages queue and it catches up on restart, the ticket actor showing state and the single fix claim, then verify and close. Source: `docs/ideas/ghost-ticket-agent-relay.md`.

Context: Haunted Hacks, Sat 31 Oct 2026. It is about 12:30 and submission closes at 16:00. Once the video and write-up are taken out, **about 2.5 hours of build time are left**. Round 1 is judged on a video plus a description, and a working demo is required. The concept targets the Agent Relay track prize (Mac mini) and the grand prize.

All six Goldfish lenses completed: Design Critic, Codebase Details, Zoom Out, Comprehension, Implementation Readiness and Structural. All six returned *proceed-with-changes*.

## Analysis

Findings are deduplicated across lenses. The count in brackets shows how many of the 6 lenses raised each one.

### Blockers

**B1. The scope does not fit 2.5 hours [6/6; blocker in 2, major in 4].** The concept has about nine moving parts: two tool-using LLM agents, two fake codebases with a planted bug, Relay identities and messaging, a 5-state ticket actor, a bridge, the kill/restart catch-up, a phone approval flow, an observer UI, the Halloween skin, and optionally a second laptop or a Freestyle VM. Each extra surface (phone, VM, second laptop, bridge) brings its own deploy and network work. If any of them is half-built at 15:20, the one recorded take breaks. None of the secondary surfaces is what the Relay judges score.
*Fix:* freeze the core now: two Node agent processes on one laptop, hosted Relay, one ticket actor, one planted bug, the kill/restart beat, and one custom web page. Cut the Freestyle VM, the second laptop and the separate phone app. Feature freeze at 15:00, and whatever works at 15:15 gets recorded.

**B2. The headline kill/restart beat rests on three things nobody has checked [6/6; blocker in 3, major in 3].**
1. *Replay.* The research confirms durable delivery at the broker/node layer and for webhook deliveries. It does not confirm that a plain `@agent-relay/sdk` process that calls `reconnect` and `addListener('*')` receives the DMs that queued while it was down. The observer socket is "never a delivery path".
2. *Identity.* Registration is create-only. A restart that calls `register` again throws 409 `agent_already_exists`, and `at_live_*` tokens are shown only once. The obvious restart code crashes on camera.
3. *Memory.* The agent's LLM context lives in process memory. After a restart it starts over, repeats questions, or contradicts itself.

The beat also mixes two kinds of durability. A viewer can't tell "Relay held the messages" from "Terse held the state", so neither sponsor gets clear credit.
*Fix:* do a 15-20 minute spike before anything else. Register A and B, save the tokens, kill B, have A send 3 messages, restart B with `workspace.reconnect({apiToken})`, and see what arrives. If nothing is replayed, B reads its channel/DM history from a last-seen message ID stored in the ticket actor when it boots. Rebuild the agent's context from that history plus `getState()` and a short working summary held in the actor. Show the beat as two labelled moments: a "Relay: 3 messages waiting for customer agent" badge counts up and then drains, while the ticket bar stays unchanged with the caption "state lives in the Terse actor". Rehearse it at least 3 times before 14:45.

**B3. The architecture is not chosen, and the bridge it implies isn't needed [5/6; blocker in 2, major in 3].** The concept lists "actors can't hold Relay listeners (needs a bridge)" as a constraint but never places the bridge. A webhook bridge needs public HTTPS (Freestyle or a tunnel), HMAC checks and dedupe on `webhook-id`. A listener bridge is one more process that can die. Either way it is a single point of failure that judges never see. But the actor doesn't have to *receive* Relay traffic at all.
*Fix:* lock this topology now. Each agent is a long-lived Node process holding its own Relay SDK listener, its LLM loop, and a generated Terse client. The TicketActor has no Relay code and only takes outbound RPCs (`open`, `claimFix`, `propose`, `approve`, `markVerified`, `close`, `getState`). There are no webhooks, no public URL and no bridge. The UI mirrors the actor through `@Emittable` state or by polling `observe/state`. Draw it as 4 boxes: vendor agent, customer agent, Relay, TicketActor.

**B4. The bug and "verified" are not defined [5/6; blocker in 1, major in 4].** The concept names no vendor, no symptom, no root cause and no fix. Without a concrete planted bug, the agents have nothing specific to find and drift into open-ended chat. "Verified" would just mean one LLM agreeing with the other. If one side can solve the bug alone, Relay adds nothing and the "meaningful problem" argument fails. After one successful run the app is fixed, so the next take has nothing to debug.
*Fix:* plant one deterministic bug whose evidence is split across both sides. Example: a payments webhook returns 401 on every delivery. The vendor log shows `signature_mismatch` and what the signature was computed over. The customer config shows the signing secret from the wrong environment, or the customer verifies against re-serialized JSON instead of the raw body. Put each side's evidence in its own fixture directory with 2-3 narrow read-only tools (`read_log`, `read_config`, `grep_code`, output capped at about 2 KB). "Verified" means a script replays the webhook and gets a 200, and the possessed app visibly turns normal. Add `reset.sh` (restore the fixture, mint a new ticket ID, restart both agents) and rehearse the reset itself.

**B5. Two sources of truth and no correlation key [3/6; blocker in 2, major in 1].** The Relay thread is called "the audit trail" and the actor "owns the ticket", and nothing says which one wins. An agent can write "fix verified" in chat while the actor is still in fix-proposed, and the video would then show a stream that contradicts the ticket panel. With four moving parts and no shared key, a ticket stuck at 15:00 can't be traced to the hop that dropped it.
*Fix:* the actor is the only authority for state. Agents change state only by tool calls to the actor, never through chat text. Each DM or channel message carries `data: {ticketId, step, hops, sender}`. The actor stores each transition with its sequence number and the Relay message ID that triggered it, and the agent posts one structured "ticket → fix_proposed" system line to the ticket's channel after each accepted transition. Keep the conversation in Relay and only small structured facts in the actor (state, claimant, fix summary, verification result, timestamps). Don't build a second transcript store.

### Majors

**M1. The "only one agent can apply a fix" claim is never exercised [6/6].** There are two agents, and in the story only one of them fixes anything, so the lock looks decorative and the Terse part shrinks to "stores a status string". There are also sharp edges. TS methods don't roll back partial writes unless they are `@Atomic`. `@Interleave`, which any method awaiting an LLM needs, turns rollback off for the whole class. A retry after a restart can claim twice. And if the agent killed in the restart beat holds the claim, the ticket deadlocks.
*Fix:* script a real contest. The customer agent wants to patch its config and the vendor agent wants to ship a server-side workaround. Both call `claimFix` within the same second, and the UI shows "REJECTED: already claimed by vendor at 14:02:11", with that rejection also posted to the Relay channel. Keep LLM calls out of the actor (no `@Interleave`). Make `claimFix` and transitions `@Atomic` and idempotent on `(agent, step)`. Make the claim a lease `{agent, claimedAt, expiresAt}`, checked lazily on every call, so a restarted agent gets its own lease back from persisted state. If this can't be built, drop the claim language and lead with crash survival.

**M2. The state machine is a straight line with no failure paths [3/6].** Failed verification, a denied approval, duplicate calls and out-of-order calls all have no defined outcome. LLMs will propose before diagnosing and call verify twice, so a strict linear machine either throws (demo breaks) or accepts nonsense (demo lies).
*Fix:* write the transitions as a data table of allowed `(from, event, role)` triples, including `verify_failed → diagnosing` (releases the claim) and `approval_denied → diagnosing`. A rejected transition returns a structured error that the agent loop shows to the model so it can recover. Drop "diagnosing" as a separate visible state if time is short: open → fix_proposed → approved → verified → closed.

**M3. "Shares logs, never secrets" is enforced only by a prompt [5/6].** Relay does no content filtering. A judge will ask what stops the agent pasting the API key, and one key leaking into the on-screen stream would discredit the pitch. Relay tooling has leaked keys before (#1460, #1570).
*Fix:* add a deterministic redaction filter in the customer agent between the LLM and every send (regex for `sk-`, `at_live_`, `rk_live_`, connection strings, and the fixture's env values). Plant a fake secret in the customer config so it visibly fires, and show "[REDACTED by customer policy]" plus a "secrets withheld: N" badge. Describe it honestly as tool-level least privilege. About 20 minutes. If it isn't built by 14:00, drop the claim.

**M4. Two LLMs talking can loop, stall, or burn quota [4/6].** They may ping-pong politely, wait on each other, or wander. Each turn costs 3-10 s. Hosted plan caps are closed-source and could switch on mid-recording (300 req/min, and the "trial" plan is 100 messages lifetime).
*Fix:* a hop counter in message `data` and a hard cap (about 8 turns) that forces escalation; a per-turn timeout with a "waiting on <agent> since <t>" indicator; a fast model; and the plan from `GET /v1/workspace` shown at startup. Rehearse until a full run is under 90 seconds.

**M5. The observer stream is raw JSON and may show nothing [4/6].** `GET /v1/ws?token=ot_live_*` gives JSON frames, which read as a log dump on video. Observer tokens are scoped by channels and `include_dms`, so DM traffic can leave the pane empty. DMs also read back as `kind:'channel'` (#1987).
*Fix:* run each ticket in its own Relay channel (`#tkt<id>`, no hyphens, per #1466), with the observer token scoped to it. Render it in one page with three columns: customer agent (OFFLINE banner plus queued counter), the Relay conversation in the middle (sender, per-agent colour, "via Agent Relay" label, delivery state), and vendor agent. Put the ticket state as a progress bar across the top with the claimant's name. Keep a small "raw" toggle as proof. Treat this page as required scope. Never put `rk_live_` in the URL.

**M6. Phone escalation is undefined and is its own frontend [6/6].** "When the agents disagree" can't be detected by a machine, and push or SMS costs time there isn't.
*Fix:* "fix proposed" always needs approval. Approval is a mobile-width page served with the dashboard (shown as a QR code), with the diff and Approve/Deny buttons that call the actor directly. Record approver, time and latency as a transition. If the page isn't ready, approve from the dashboard. Cut this first.

**M7. The cross-org story is staged and unexplained [5/6].** Both "orgs" will share one workspace on one laptop, and the concept never says how two companies would share Relay. "A different OpenAI persona" weakens the cross-vendor claim, which is one of Relay's few real differentiators. The customer laptop would also hold the vendor's `TERSE_API_KEY`.
*Fix:* decide now: vendor on the OpenAI API, customer on the Anthropic API (one extra fetch call, no broker-spawned Claude Code or Codex). Use two branded panes with model badges and distinct identities. Say plainly in the description that the demo uses one shared workspace and the shared actor key, and that a production version would use Relay Connect or arelay.to handles across workspaces.

**M8. Rehearsals and the finalist slot will hit leftover state [4/6].** `@Persisted` state survives, so a reused ticket ID starts "closed". Actors can't be deleted. Adding fields to an existing instance has undocumented behaviour. Fresh agent names per take eat into the roughly 5-agent workspace cap. Short-lived workspaces and observer tokens expire before the 17:00 live demos. Terse ships several releases a day, and Relay v15 is on `next`.
*Fix:* use fixed identities (vendor, customer) registered once by a seed script, with tokens saved to `.env.run`. Agents only ever call `reconnect`. If the workspace gets dirty, create a new one and re-seed rather than adding suffixed agents. Put a run ID only in the ticket ID (`ticket-<timestamp>`). Reassign `@Persisted` arrays, never `.push()`, and use only `CREATE TABLE IF NOT EXISTS`. Create the workspace with `expires_in_seconds` ≥ 172800 and the observer token with `expires_in_hours` 12. Pin `@agent-relay/sdk@14.0.0`, terse-sdk/cli 0.14.7 and durable-actors 0.14.4, commit the lockfile, and update nothing after 13:00. Keep `npx @relaycast/engine` behind an env flag as a fallback, but record on hosted early.

**M9. No contract between the separately built halves [3/6].** If two people build the vendor and customer agents, each will invent its own payloads and actor calls, and integration around 14:30 eats the recording time. Terse clients must be regenerated after every actor signature change.
*Fix:* before splitting the work, write one `contract.ts`: a Zod union for message `data` (`{ticketId, type: 'logs'|'hypothesis'|'propose_fix'|'verify_result'|'escalate', hops, body}`) and the actor method signatures. Freeze it, generate the Terse client once, and share it. Keep Relay calls in `relayClient.ts` and actor calls in `ticketClient.ts`.

### Minors (grouped)
- **Freestyle VM:** cut. Its logs aren't visible on camera, and `vm.exec` has a 30 s default timeout. If you add a second machine later, use a second laptop with its terminal in the shot.
- **Socket rendering:** Terse sockets don't auto-reconnect (since v0.7.16) and don't guarantee order (since v0.12.3). Sort by sequence number and add a manual reconnect. Use `observe/state` or `durable-actors inspect Ticket/<id> --json` for debugging.
- **Baseline number:** show an end card computed from actor timestamps, e.g. "human relay: 9 copy-pastes, 6 min → agents: 0, 48 s".
- **Presentation as build work:** record the "before" as 15 seconds of screen capture with no code. The Halloween look is CSS and copy only: glitch on the possessed app, clean when verified.
- **Mixed metaphors:** "ghost ticket", "possessed", "exorcism" and "meat proxy" are three mental models, and "ghost ticket" sounds like a ticket nobody owns. Keep possession/exorcism. Lead with the plain problem, theme second. Consider renaming.
- **Jargon:** add a one-line gloss for Agent Relay and Terse Durable Actor in the description, and link `AgentWorkforce/relay`.
- **Originality risk:** this is the brief's own #2 suggestion and the founders' public "Debug with customers, agent to agent" roadmap item, close to their Ratify demos. Other teams may build it. Lead with what sets it apart: the actor-arbitrated contested claim, the objective verify, and redaction in code.
- **Meaningfulness rebuttal:** "why not a shared Slack channel?" Answer it in one line: agents from different vendors and orgs, delivery to an agent that is offline, a shared audit trail, and no human relaying.

## Goals vs. Non-Goals

**Goals**
- One deterministic, two-sided bug with an objective, visible verify (B4).
- A kill/restart beat that works every take and credits Relay and Terse separately (B2).
- A simple topology with no bridge: agents hold Relay, the actor is passive state (B3).
- The actor as the single authority for ticket state, with a contested claim it visibly rejects (B5, M1).
- Redaction in code, shown on screen (M3).
- One readable page: two agent panes, the Relay conversation, and the ticket bar (M5).
- Cross-vendor agents (OpenAI vs Claude) with honest cross-org framing (M7).

**Non-Goals (today)**
- Webhook subscriptions, a bridge service, or any public HTTPS endpoint.
- Freestyle VM, second laptop, native phone app, push or SMS.
- Real cross-workspace federation (Relay Connect, arelay.to); a permission/ACL system.
- Detecting "disagreement" between agents; free-form debugging of real repos.
- A transcript store inside the actor; Relay typed actions.

## Alternatives Weighed

| Decision | Option chosen | Rejected | Why |
| --- | --- | --- | --- |
| Relay ↔ actor wiring | Agents hold Relay listeners and call the actor by RPC | Webhook bridge on Freestyle; separate listener bridge | No public URL, HMAC or extra process (B3) |
| Restart recovery | `reconnect` with saved token; history read from a cursor in the actor if replay is missing | Re-register; trust automatic replay | Create-only registration; replay unverified (B2) |
| Agent memory after restart | Rebuild from Relay history + `getState()` + short summary in actor | Full transcript in actor; nothing | Avoids two transcript stores while keeping context (B2, B5) |
| Source of truth | Actor for state, Relay channel for conversation, joined on ticketId + seq + message ID | Both treated as authoritative | Prevents contradicting panes (B5) |
| Conversation transport | One Relay channel per ticket | DMs | Observer scoping, readback bug, cleaner audit trail (M5) |
| Fix claim | Contested, `@Atomic`, leased claim | Uncontested lock; drop it | A lock nobody competes for gets no credit (M1) |
| Secrets | Regex redaction before send | Prompt instruction | Deterministic and demonstrable (M3) |
| Approval | Always required at fix_proposed; mobile web page | "Disagreement" detection; push/SMS | Deterministic, no extra frontend (M6) |
| Rehearsal identity | Fixed seeded identities; new workspace if dirty; run ID only in ticket ID | Suffixed agent names per take | Workspace agent cap (M8). Lenses disagreed here, and this is the safer option |
| Customer model | Anthropic API | Second OpenAI persona | Cross-vendor is Relay's differentiator (M7) |

## Key Decisions & Staging for Next Steps

**Decide now (before any code):** the topology in B3; the bug, its two-sided evidence and the verify script (B4); the identity scheme (M8); `contract.ts` with message types and actor signatures (M9); vendor on OpenAI, customer on Claude (M7).

**Staging (time boxes):**
1. **By 13:00, spike.** Seed the workspace, save tokens, kill one agent, send 3 messages, reconnect, and record what arrives. Choose automatic replay or cursor catch-up based on the result.
2. **By 13:45, core loop.** Two agents exchange messages in `#tkt<id>` with a hop cap. TicketActor with the transition table, `@Atomic` lease claim and idempotency. Fixtures plus the verify script plus `reset.sh`.
3. **By 14:30, the screen.** One page with three columns and the ticket bar, fed by the observer token and actor state. Queued counter and OFFLINE banner. Redaction filter with a visible badge.
4. **By 14:45, the beats.** Kill/restart rehearsed 3 times. Contested claim with a visible rejection. Possessed app turns clean on verify.
5. **Only if 1-4 are done:** mobile approval page via QR, end-card numbers, extra CSS.
6. **15:00 freeze.** Record a full take by 15:15 and keep it as the submission and the live-demo fallback. Write the description (glossary, cross-org honesty, what is live and what is seeded) and submit before 16:00.

**Open items:** what an SDK listener receives on reconnect; whether `dm.received` reaches `addListener('*')` (moot if channels are used); the hosted plan's agent cap and message limits; whether non-`@Atomic` methods roll back on throw.

## Hackathon verdict

| Dimension | Score (0-10) | Note |
| --- | --- | --- |
| Survives review | 6 | Five blockers, but all are design decisions or a 20-minute spike. As written it would not survive Relay or Terse Q&A |
| 5-hour feasibility | 5 | About 2.5 h left with two LLM agents, fixtures, an actor and a custom UI. Feasible only with the frozen scope and no bridge |
| Video-demo strength | 7 | Kill-and-catch-up, a rejected claim, a redaction and the possessed app turning clean are strong visual beats, if the page is readable |
| Meaningfulness | 7 | A real, familiar pain (support handoffs), but it needs the "why not Slack" answer and a measured before/after |
| Relay prize fit | 8 | It is the founders' own roadmap item and shows durable offline delivery and cross-vendor agents. The same fact is an originality risk |

**Go/no-go:** GO, on the condition that the no-bridge topology and frozen scope are adopted now and the restart spike passes (or the cursor catch-up is built) by 13:00.

**Top 3 changes that would most improve the idea:**
1. **Lock the no-bridge topology and prove the restart beat first.** Agents hold Relay and call the actor by RPC. Saved tokens plus `reconnect`, and a 20-minute spike on what gets replayed, with cursor-based catch-up if needed. Show "Relay held the messages" and "Terse held the state" as two separate labelled moments.
2. **Plant one deterministic, two-sided bug with an objective verify.** Each side holds half the evidence, the tools are narrow, there is a turn cap, a replayed webhook goes from 401 to 200, the possessed app turns clean, and `reset.sh` makes every take repeatable.
3. **Make the sponsor value visible on one page.** A contested fix claim that the actor rejects on screen (`@Atomic`, leased), a deterministic redaction badge, and a three-column layout with the queued-message counter and the ticket bar, in place of raw observer JSON.
