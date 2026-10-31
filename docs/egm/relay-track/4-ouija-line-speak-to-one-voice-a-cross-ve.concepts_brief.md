# Concepts Brief: Ouija Line, speak to one voice and a cross-vendor team answers

**Author:** Charlie Gillet
**Date:** 2026-10-31

## Overview

Ouija Line's pitch: an on-call engineer talks to an OpenAI Realtime voice agent (`oracle`). Its tools send work over Agent Relay to a Claude code-reader (`codeghost`) and an OpenAI log-reader (`logghost`). The two check each other's work in `#incident`, return typed `report_finding` results, and the voice speaks the merged answer. A Ouija planchette points at whichever agent is sending on Relay. Stretch beat: kill `codeghost`, ask again, restart it, and it drains its stored inbox. Source: [4-ouija-line-speak-to-one-voice-a-cross-ve.concept.md](./4-ouija-line-speak-to-one-voice-a-cross-ve.concept.md).

Context: Haunted Hacks: Real-Time AI Edition, YC SF, Sat 31 Oct 2026. It is about 13:00 and building stops at 16:00, so **about 2.5-3 hours of build time are left**, and recording, editing and the written description come out of that. Round 1 is judged from a demo video plus a description, and a working demo is required. **The target is the Agent Relay track (Mac mini) only.** Terse is a bonus. The repo has no code yet, and the external prep repo is docs only.

Six Goldfish lenses ran in BRAINSTORM mode: Design Critic, Codebase Details, Zoom Out, Comprehension, Implementation Readiness and Structural. **All six completed and all six returned *proceed-with-changes*.** They agree closely. The idea is visually strong and Relay is load-bearing through the peer cross-check. But the parts that decide whether it works on camera are undesigned: process boundaries, the cross-check turn protocol, the voice-to-Relay async contract, and observer visibility. The cut order also protects voice, which buys little Relay credit, ahead of the durable beat, which the Relay judges asked to see.

## Analysis

Findings are deduplicated across lenses. The count in brackets shows how many of the 6 lenses raised each one.

### Blockers

**B1. The process layout is not decided [5/6].** "Bridge (Node 22) with 3 participants" reads as one process holding `oracle`, `codeghost`, `logghost`, the Realtime sideband and the UI server. In that setup the kill/restart beat cannot be honest: killing codeghost kills the voice and the other agents too, and faking it with an in-process flag is the kind of fake the founders say they will spot. One process driving three names from one `addListener('*')` also looks like a puppet talking to itself, which undercuts "peer to peer". Splitting processes later means refactoring shared state (task map, tokens, listeners) after 15:00.
*Fix:* decide by 13:10. Three entrypoints: `oracle-bridge.ts` (oracle identity, voice adapter, UI server), `codeghost.ts`, `logghost.ts`. Each has its own `AgentRelay` client, its own persisted `at_live_` token, its own listener and its own terminal. They share only a `schema.ts` module. Say plainly that codeghost is the Anthropic API wrapped in an SDK listener. This also makes the kill beat a single Ctrl-C and opens the cross-person beat (M1).

**B2. The specialist cross-check has no turn protocol, no stop rule and no ordering [5/6].** Nothing says who speaks first, how codeghost knows to wait for logghost, or what stops two LLM agents replying to each other (and their own echoes) in `#incident`. Likely results: no cross-talk at all, a runaway ping-pong that burns paid LLM calls and Relay quota (send weight 0.5, 429s, possibly a `trial` plan with 100 messages ever), or a `report_finding` that lands before the cross-check, so the voice speaks a half answer. Hard-coding the messages instead would be faked traffic. The concept itself says this is the part that makes Relay necessary, yet it is item 5 in the cut order and absent from "never cut".
*Fix:* a fixed turn order, with every message still LLM-generated live. (1) oracle DMs both specialists with a `taskId`. (2) logghost posts exactly one root message to `#incident` (line number, tenant, `taskId`). (3) codeghost reacts only to logghost's root post for that `taskId`, replies once in thread with the diff hunk, then calls `report_finding`. It is gated: no report until the thread reply exists, or 20 s pass and it reports "unverified". (4) logghost reports after posting. Guards: ignore your own `envelope.from.name`, act only in the `taskId` thread, at most 2 messages per agent per task, ignore `hop >= 2`. Show a "cross-checked" tick on the board. Move the cross-check into "never cut". Budget about 12-15 sends per run and check `GET /v1/workspace` for the plan before rehearsing.

**B3. The voice-to-Relay async contract is not designed [5/6].** `ask_specialist` is a Realtime `function_call` that needs a `function_call_output`, but the specialists take 10-40 s. If the tool blocks, the voice goes silent. If it returns at once, later `conversation.item.create` plus `response.create` injections collide with a response that is still playing (Realtime rejects a second active response), with barge-in, or with each other, so the voice double-speaks or contradicts itself. "Speaks the merged answer" has no merge rule. Nothing covers a specialist that never answers: actions are at-most-once on socket drop (relaycast #283), and taskId dedupe stops duplicates but not silence.
*Fix:* (1) on `function_call`, send the DMs, then return `function_call_output` at once with `{status:'dispatched', taskId}`, and have the voice say one scripted holding line. (2) A per-incident outbox in oracle, separate from the voice session, with a join barrier: wait for both findings or a 25 s timeout. (3) A single drainer tracks `response.created`/`response.done` and user speech, and injects one merged item plus one `response.create` only when nothing is active. (4) On timeout, the board shows "no reply" and the voice says "codeghost hasn't answered; here's what logghost found". (5) On a Zod failure, reply in thread with the validation error so the specialist retries once, which is itself real traffic. Tell the voice model to quote only the injected fields (cause, file:line, fix), so it cannot invent "yesterday's migration".

**B4. Nobody has checked that the observer stream shows DMs or action events [5/6].** Beat 2 ("two real DMs appear on the observer; the planchette swings") and the whole Ouija board are "driven only by observed envelopes". But DMs arrive as `dm.received`, which is not in the documented raw WS event list. Observer DM payloads need `include_dms` (or a DM scope and filters) on top of `stream:read`. `addListener('message.created')` does not see DMs. The task board is "built only from `action.completed`", which is an SDK listener event in the bridge, and nothing says it appears on the observer stream. If any of this is missing, the opening Relay beat shows nothing, or the board has to be fed by the backend while the concept claims otherwise.
*Fix:* first 15 minutes, before any UI. Mint an observer token with `include_dms` and `#incident`, open a bare browser WS to `/v1/ws?token=`, send one DM between two test identities, invoke one action, and log every raw frame type. If DMs are missing, send assignments as @mentions in `#incident` threads instead (still real and visible, same planchette logic). If `action.*` is missing, label the board honestly as "from action results (backend)", or derive status from reactions, which are observable messages. Keep the planchette strictly observer-fed.

**B5. The scope does not fit, and the cut order is upside down for a Relay-only target [4/6].** There is no code. The concept stacks a WebRTC plus sideband voice bridge, 3-4 Relay participants, typed actions with `availableTo`, threads, reactions as status, an observer pane, a task board, a Ouija animation, a Terse actor and a kill/restart beat into about 2 hours of real build time. Voice is the most expensive part, it scores on the general real-time criterion rather than with Relay judges, and it is protected (cut third). The durable kill/restart is the cheapest Relay-native feature and one the founders named, yet it is cut second. The concept's own risks admit sideband plumbing can eat an hour, and the 45-minute time-box is optimistic. If time runs out, the team ships the part that does not win the Mac mini.
*Fix:* build in this order: text path → real DMs plus the gated thread cross-check → findings → kill/restart → cross-person laptop → voice. Cut voice before the durable beat. Go/no-go at 14:15: if the text path is not working end to end (DM out, cross-check, finding back, answer shown), voice is dropped. Stop building at 15:15-15:20 to record.

**B6. Identity, tokens and leftover state across restarts and takes are unspecified [4/6].** The sources disagree on `register()` with an existing name: the internal brief says it throws (409 `agent_already_exists`); the external doc says it adopts the name and rotates the token. Either breaks a naive restart: a crash, or a silently invalidated token in another process. Run suffixes change the names on the Ouija board and pile up agents against the ~5-per-workspace cap. Durable delivery also means unread DMs from earlier takes and dev runs wait in codeghost's inbox, so on restart it answers stale questions and the voice reads the wrong finding, and the observer shows old traffic.
*Fix:* a one-shot `setup` script creates the workspace, registers `oracle`, `codeghost`, `logghost`, mints the observer token and writes `.tokens.json` and `.env`. Every agent process only calls `reconnect({apiToken})`, never `register()`. Fixed names, no suffixes. Before each take, `reset` creates a fresh workspace and rewrites tokens. Specialists ignore any `taskId` not seeded by oracle for the current run. Use a separate throwaway workspace for development. Check `register` behaviour on 14.0.0 in the installed types and with one call in the first 10 minutes.

### Majors

**M1. The problem is weak to a cold reader and has no cross-person element [5/6].** "A single assistant can't see both" is false: one Claude with `read_logs` and `read_code` sees both. Judges will ask "why not one agent with two tools?", and "different vendors" alone sounds made up for the demo. The concept admits it is "cross-vendor only", while the founders also want cross-person and cross-org, and they distance themselves from CrewAI or LangGraph-style orchestration. Voice for an engineer at a keyboard is also loosely motivated.
*Fix:* a real ownership boundary at almost no code cost. logghost belongs to the SRE or platform team, who hold prod log access the app engineer lacks. It runs on a teammate's laptop under its own registered token and its own log file, gets only `report_finding` through `availableTo`, and never hands over raw logs. The answer becomes "the logs agent is someone else's, and least privilege means you can't give one agent both tools." Show both machines or terminals and say it out loud in the video. This replaces the optional `oncall` human.

**M2. The kill/restart beat has no catch-up code path and no evidence on screen [5/6].** The SDK listener only receives new deliveries, so "drains its inbox" needs an explicit `inbox()`/`inbox.get`/`messages.list` call on boot. Whether 14.0.0 replays unread DMs on reconnect is unverified. If both a replay and a manual fetch fire, codeghost answers twice. The observer shows traffic, not read state, so "shown stored and unread" is only narration unless something renders it.
*Fix:* a 5-minute probe first: DM an offline agent, reconnect, log what arrives. On boot codeghost calls `reconnect`, fetches unread DMs before attaching listeners, processes them deduped by `messageId` and `taskId`, marks them read, and logs `catchup_count`. While codeghost is down, oracle polls its inbox and the board shows a grey "queued for codeghost (msg …)" badge. Rehearse 3 times before touching voice. Now that it ranks above voice (B5), it is cut only if not done by 15:00.

**M3. The action design is muddled, and there are three ways for a finding to arrive [4/6].** oracle registers `report_finding`, so its handler runs inside oracle when a specialist invokes it. The concept then also drives voice injection and the board from `action.completed`, which goes to listeners, is fire-and-forget and is at-most-once. That gives two paths in one process for one event, plus the JSON-DM fallback as a third. `registerAction`, `availableTo` and `action.completed` are still marked "verify in installed types" on 14.0.0. The `idempotencyKey` option on `sendMessage` is not confirmed in any source. The Claude and OpenAI Responses models cannot call Relay actions natively, so each specialist has to turn its model's tool call into an SDK invoke, in two formats.
*Fix:* one `FindingSchema` (Zod: `taskId, from, cause, file, line, diff, crossChecked`) in `schema.ts`. Build the structured JSON DM reply checked with Zod as the default. Spend at most 20 minutes upgrading to `registerAction`; keep the DM path if the 14.0.0 types or behaviour differ. Either transport calls one idempotent `applyFinding(taskId, finding)` in oracle. The board, voice outbox and transcript subscribe to its output, never to Relay directly. Do not build both transports. Have each specialist emit the finding JSON directly from a single low-temperature call with the schema, rather than an agent tool loop.

**M4. The voice transport is the heaviest Realtime path available [3/6].** The unified `/v1/realtime/calls` flow, parsing `call_id` from the `Location` header and a sideband WebSocket add a second socket nobody has debugged, in the same process as the Relay listeners and the UI. A failure there means the voice keeps talking but tools never run, and it looks as if the voice ignores Relay. The typed-text path is said to call "the identical tool path", but nothing stops that path depending on Realtime types, so cutting voice could break it.
*Fix:* write `askSpecialist(to, question) → taskId` as a plain function with no Realtime types; the text box and any voice layer are thin adapters over it. Voice options, cheapest first: (a) the browser's `SpeechRecognition` and `speechSynthesis` over the text path, with no Realtime; (b) Realtime with an ephemeral client secret, where the browser owns the data channel, runs tools by POSTing to oracle, and gets merged findings back over SSE (one executor, no sideband); (c) the sideband, only if the core is done by 14:30. Show a status pill (connected / last event age) and log Realtime `error` events.

**M5. There is no end-to-end correlation or telemetry [3/6].** Six IDs are involved and nothing links them: Realtime `call_id`, `taskId`, DM `messageId`, thread `messageId`, action `invocationId`, and the injected item. When the voice goes quiet in rehearsal, nobody can tell which stage stalled. Nothing defines how bridge state (board, transcript) reaches the browser, so the planchette (observer) and the board (bridge) can disagree with no way to tell which is wrong.
*Fix:* mint `taskId` when the ask arrives, carry it in the DM, the thread posts and the `FindingSchema`, and echo it in the injected item. Log one JSONL line per stage (`tool_call, dm_sent, dm_seen, peer_msg, finding_received, injected, spoken`) with `relayMessageId` and age, to `takes/<n>.jsonl` and to the browser over one SSE stream. That stream feeds the board and transcript; the observer feeds the planchette and raw strip. Show the Relay `messageId` on each board row so judges can match the panes. Count messages and non-ok envelopes per take, and log 429s with `Retry-After`.

**M6. Hosted infrastructure is a shared single point of failure [3/6].** relaycast #476 and #503 record recurring 500, 429 and `database_overloaded` incidents, and 50+ teams will hit `cast.agentrelay.com` in the same window. Moving to the local engine mid-build is not data-compatible: workspace key, agent tokens, observer token, URL and history all differ, and `baseUrl` against a local engine is unverified on 14.0.0. Realtime also has a 60-minute session cap and per-minute cost.
*Fix:* one env flag, `RELAY_TARGET=hosted|local`, read by the `setup`/`reset` script, which writes every token and URL. Prove the local path (`npx @relaycast/engine`) once early with one DM. Record the Round 1 video by about 15:15 on whichever target is green at 15:00, and do not switch after that. Fresh Realtime session per take, a spend cap, a small model for logghost, and a small fixed repo snapshot for Claude.

**M7. The judge screen has four panes and two answers to "who is talking" [2/6].** Transcript, raw observer JSON, task board and Ouija board are too much for a 90-second video. Raw JSON is unreadable at video resolution. The planchette follows every envelope, including reactions and action events, so it jumps in bursts shorter than a second, and it points at a Relay sender while the audio comes from oracle.
*Fix:* make the Ouija board the main element, label it "Relay sender", and drive it from a queue with a minimum 1.2 s dwell. Only DMs, channel messages and thread replies move it; reactions do not. Show each envelope's text under the planchette. Shrink the raw observer to a scrolling strip kept as the "not faked" proof (consider `@relaycast/react`). Captions for the voice. A slim board only if findings work. If time is short, a CSS name highlight replaces the sliding planchette.

### Minors (grouped)
- **Duplicate asks [1/6]:** `taskId` as idempotency key misses the voice calling `ask_specialist` twice or retrying after barge-in. Dedupe `(to, normalized question)` within 30 s in oracle.
- **Agent cap during development [2/6]:** hot reloads with suffixed names fill the ~5-agent cap. Fixed names, persisted tokens, separate dev workspace (B6).
- **Credentials on screen [1/6]:** redact `rk_live_|at_live_|ot_live_|nt_live_` in the logger and the raw strip, never project terminals that print keys (#1570, #1889, #1460), revoke the observer token after judging.
- **Terse actor [3/6]:** drop it from the plan now rather than "cut early". One in-memory map behind `applyFinding`, plus the JSONL per take. If added later, only as a removable "durable record" panel.
- **Model pinning [1/6]:** pin the Realtime, Responses and Anthropic model IDs in one config file.
- **Codeghost input [1/6]:** a handful of snapshot files in the prompt, low temperature, fixed output schema; no tool loop.
- **Video production [1/6]:** record the "before" as a 5-second two-tab capture during idle LLM waits; replace the architecture slide with one spoken sentence over the observer strip.
- **Text vs voice output [1/6]:** both modes must produce identical Relay traffic and board; only the final rendering (spoken vs text) differs.

## Goals vs. Non-Goals

**Goals**
- Three separate processes, one per Relay identity, with logghost on a teammate's laptop owned by "the SRE team" (B1, M1).
- A real, gated cross-check: one root post from logghost, one thread reply from codeghost, findings only after it, with hop caps (B2).
- One finding path (`applyFinding`, Zod-validated, idempotent on `taskId`) feeding board, transcript and voice (M3).
- An honest async voice contract: immediate ack, join barrier, single drainer, visible and spoken timeouts (B3).
- Observer-fed planchette and raw strip, with DMs confirmed visible in the first 15 minutes (B4).
- Durable kill/restart with explicit inbox catch-up and a visible "queued for codeghost" badge (M2).
- Fresh workspace and fixed names per take; correlation log per take (B6, M5).

**Non-Goals (today)**
- The Realtime sideband as the first or only voice path.
- The Terse actor, reactions as a second state channel, or a dedupe ledger.
- Building both `registerAction` and the JSON-DM transport.
- A four-pane screen or a planchette that follows every envelope.
- An `oncall` human as a fourth participant.
- An agent tool loop over the whole repo.
- Switching Relay targets after 15:00.

## Alternatives Weighed

| Decision | Option chosen | Rejected | Why |
| --- | --- | --- | --- |
| Process layout | One process per identity; logghost on a second laptop | One bridge with three participants | Honest kill beat, no puppet look, cross-person for free (B1, M1) |
| Cross-check | Fixed turn order, LLM-generated content, gated report, hop caps | Free-form agents on `'*'`; hard-coded messages | Free-form loops or races; hard-coded is faked traffic (B2) |
| Findings transport | Zod JSON DM by default, 20 min upgrade to `registerAction` | `registerAction` first, DM as fallback | Three unverified 14.0.0 surfaces in the never-cut path (M3) |
| Finding entry point | One `applyFinding` in oracle | Handler plus `action.completed` plus DM | Double-speaking and missed findings (M3) |
| Voice injection | Immediate ack, join barrier (both or 25 s), drain after `response.done` | Inject on each `action.completed` | Collides with active responses and barge-in (B3) |
| Voice transport | Browser speech APIs or ephemeral-secret Realtime | Unified call plus sideband WS | Plumbing cost, second socket, single crash point (M4) |
| Build and cut order | Text → cross-check → findings → durable → cross-person → voice | Voice protected, durable cut second | Relay-only prize; durable is cheap and requested (B5) |
| Identity lifecycle | Setup script registers once, processes only `reconnect`, fresh workspace per take | `register` on boot, run suffixes | 409s, token rotation, stale inbox, agent cap (B6) |
| Assignment channel if DMs are not observable | @mentions in `#incident` threads | Bridge-fed planchette | Keeps traffic real and visible (B4) |
| Relay fallback | `RELAY_TARGET` flag, local engine proven early | Ad hoc switch mid-recording | Not data-compatible (M6) |
| Durable record | In-memory map plus JSONL per take | Terse actor | Bonus not targeted; extra store to reconcile |

## Key Decisions & Staging for Next Steps

**Decide now (before any code):** three processes and which teammate's laptop runs logghost (B1, M1); the cross-check turn order and caps (B2); `FindingSchema` and `applyFinding` (M3); the build and cut order with voice last (B5); fixed names `oracle`, `codeghost`, `logghost` and the setup/reset scripts (B6). Drop the Terse actor.

**Staging (time boxes):**
1. **13:00-13:20, probes.** P1: observer with `include_dms` sees a DM and logs action frames (B4). P2: `register` vs existing name on 14.0.0; `reconnect` with a stored token works (B6). P3: DM to an offline agent, reconnect, what arrives (M2). P4: `GET /v1/workspace` plan (B2). P5: `registerAction`/`availableTo` exist in installed types (M3). Pin versions, commit the lockfile, write results into the concept file.
2. **13:20-14:15, core over text.** `setup`/`reset` scripts. Three processes. Text box → `askSpecialist` → DMs → logghost root post → codeghost thread reply → two findings via Zod JSON DM → `applyFinding` → answer shown as text. JSONL stage log plus SSE. **14:15 go/no-go:** if this does not run end to end twice, drop voice entirely and decide whether to continue.
3. **14:15-14:45, Relay differentiators.** Kill/restart with inbox catch-up and the "queued" badge, rehearsed 3 times. Move logghost to the teammate's laptop. Optional 20 min `registerAction` upgrade.
4. **14:45-15:10, screen and voice.** Ouija board as the main element (observer-fed, dwell queue), raw strip, transcript, slim board. Voice: browser speech APIs first; ephemeral-secret Realtime only if ahead of schedule. Outbox drainer and timeouts.
5. **15:15, freeze.** Fresh workspace, 2-3 takes, record the Round 1 video by 15:30 on whichever Relay target is green. 15:30-15:50: write the description (cross-vendor, cross-person, peer cross-check in a shared thread, durable offline delivery; name the packages) and submit before 16:00. For the live final, have the local engine flag and the recorded clip ready.

**Open items:** whether the observer stream carries DMs and `action.*` (P1) decides the assignment channel and board labelling. `register` behaviour and offline replay on 14.0.0 (P2, P3) decide the durable beat. The workspace plan (P4) decides how many rehearsal takes are safe.

## Hackathon verdict

| Dimension | Score (0-10) | Note |
| --- | --- | --- |
| Survives review | 5 | Six blockers, all design gaps rather than a broken idea; every lens said proceed-with-changes |
| Feasibility in remaining time | 5 | About 3 as written (sideband voice plus 8 parts in about 2 h); about 6 with the text-first order, browser speech and the Terse actor dropped |
| Video-demo strength | 7 | A spoken question, real DMs, two vendors' agents arguing in a thread and a Ouija planchette is memorable, if the screen is simplified to one main element |
| Meaningfulness | 5 | "One agent with two tools" defeats it as written; about 7 once logghost belongs to another team with least-privilege log access |
| Relay prize fit | 6 | Peer cross-check and cross-vendor are strong Relay material; about 8 with cross-person (second laptop) and the durable kill/restart beat ranked above voice |

**Go/no-go:** GO, conditional on a Relay-first rebuild of the plan: three processes, the gated cross-check over text working end to end by 14:15, durable kill/restart and cross-person ranked above voice, and voice as a cheap late layer. If the text path is not working end to end by 14:15, drop voice; do not trade Relay beats for voice.

**Top 3 changes that would most improve the idea:**
1. **Reorder around Relay and make it cross-person.** One process per identity, with logghost owned by "the SRE team" on a teammate's laptop. Build text → cross-check → findings → durable kill/restart → voice, and cut voice (browser speech APIs, or ephemeral-secret Realtime) before the durable beat.
2. **Make the cross-check deterministic but real, with one finding path.** Fixed turn order keyed by `taskId` (logghost root post once, codeghost one thread reply, gated `report_finding` with a 20 s "unverified" fallback, hop caps, ignore self). Zod JSON DM by default, one idempotent `applyFinding`, `registerAction` only as a 20-minute upgrade.
3. **Probe the risky surfaces first and design the voice outbox.** In the first 20 minutes, confirm observer DM and action visibility, `register`/`reconnect` and offline inbox replay on 14.0.0, and the workspace plan. Ack `function_call` at once, join both findings or 25 s, inject only after `response.done`, use a fresh workspace and a JSONL correlation log per take.
