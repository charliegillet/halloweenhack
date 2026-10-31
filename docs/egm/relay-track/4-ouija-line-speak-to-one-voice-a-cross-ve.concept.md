# Ouija Line: speak to one voice, a cross-vendor team answers

> Context: [EVENT_KICKOFF_NOTES.md](/Users/charlie/.t3/projects/halloweenhack/docs/EVENT_KICKOFF_NOTES.md) · [research/agent-relay.md](/Users/charlie/.t3/projects/halloweenhack/docs/research/agent-relay.md)

## One line

An on-call engineer talks to an OpenAI Realtime voice agent. Its server-side tools assign work over Agent Relay to a Claude code-reader and an OpenAI log-reader, which cross-check each other peer to peer and return typed findings that the voice speaks back, while a Ouija planchette points at whichever agent is talking on Relay.

## Problem

An engineer at 2 a.m. with a 500ing checkout pastes logs into one chatbot and code into another and carries answers between them. A single assistant can't see both; the human is the bus. Field techs and anyone with busy hands have the same problem. This is the only candidate that hits the 'real-time AI' criterion head-on (live voice with barge-in) while keeping Relay load-bearing: without Relay the specialists cannot reach each other at all.

## How it works

- **Front end:** browser opens WebRTC to OpenAI Realtime via the unified flow: SDP goes to our backend, which calls `/v1/realtime/calls` with the server key, reads `call_id` from the `Location` header and attaches a sideband WebSocket. The sideband, not the browser, owns tool execution (one executor, no double application). A typed-text box in the same UI calls the identical tool path and is wired first.
- **Bridge (Node 22) with 3 participants:** `oracle` (the voice agent's Relay identity), `codeghost` (Claude, given a frozen repo snapshot with one planted bug), `logghost` (OpenAI Responses, given a frozen log file). Optional `oncall` human makes 4.
- **Orchestrating with actions:** the voice model calls `ask_specialist({to, question})`; the sideband turns it into a real Relay DM from `oracle` with `idempotencyKey = taskId`. `oracle` registers `report_finding` with `availableTo: ['codeghost','logghost']`.
- **Peer to peer, not hub and spoke:** in `#incident`, `logghost` tells `codeghost` 'line 212 throws on null tenant, tenant acme', and `codeghost` replies in thread with the diff hunk. Neither goes back through the voice agent. Reactions show claimed then done.
- **Back to voice:** on each `action.completed`, the sideband injects the finding via `conversation.item.create` plus `response.create`, and the voice speaks the merged answer. The engineer can interrupt mid-sentence.
- **Durable beat (stretch):** kill `codeghost`, ask a follow-up; the assignment is stored and unread. Restart; it drains its inbox and answers; the voice says 'Claude is back, it says…'.
- **Judge screen:** live transcript on the left; raw Relay observer stream on the right; a task board built only from `action.completed`; and a Ouija board whose planchette slides to the name of the agent sending each real envelope.

## Relay features used

- `@agent-relay/sdk@14.0.0`, register once, `reconnect`.
- DMs for assignments; channel `#incident` with threads for the specialist cross-check.
- `registerAction` with Zod schema and `availableTo`, `action.completed`: the documented request then typed-callback pattern.
- `idempotencyKey = taskId`; reactions as claim and done status.
- `addListener('*')`, `envelope.from.name`.
- Durable delivery for the kill/restart stretch.
- Observer token with message, thread and DM scopes; the planchette is driven only by observed envelopes.
- Cross-vendor: OpenAI Realtime, Claude and OpenAI Responses in one mesh.

## Terse use

Optional, cut early. One `Incident` Durable Actor holds the task board (taskId, assignee, status, finding, handled invocation IDs) and emits it to the browser with `@Emittable` as a 'durable record' panel. The bridge applies each `action.completed` only if its taskId is not already applied. Relay carries the conversation; the actor owns the record. Fallback: a JSON file.

## Demo beats

Target 90-100 seconds.

1. 0-10s: Before. An engineer alt-tabbing between two chatbots, pasting logs into one and code into the other.
2. 10-30s: Spoken: 'Checkout is 500ing for the Acme tenant, what's going on?' Voice: 'Asking the code and log spirits.' Two real DMs appear on the observer; the planchette swings to CODEGHOST, then LOGGHOST.
3. 30-60s: The specialists talk to each other on screen: line number from logghost, diff hunk reply from codeghost. Reactions flip to done; two `report_finding` actions complete on the task board.
4. 60-80s: The voice speaks the answer ('null tenant config from yesterday's migration, here's the one-line fix'). The engineer interrupts; the voice stops and answers the follow-up.
5. 80-100s (stretch): kill codeghost, ask again, message shown stored and unread; restart, the voice delivers the answer. Close: architecture slide plus honest limit: actions are at-most-once if the caller's socket drops, so tasks are deduped by ID.

## Cut order

1. Terse actor.
2. Kill/restart beat.
3. WebRTC voice (push-to-talk over the Realtime WebSocket, or typed text in the same UI; Relay traffic unchanged).
4. Ouija animation (plain sender highlight).
5. Specialist-to-specialist cross-check (avoid; it is what proves peer to peer).

Never cut: two vendors' specialists over real Relay traffic, typed action results, the observer pane.

## Risks

- **Time.** With about 2.5 hours left, Realtime sideband plumbing can eat an hour. Time-box voice to 45 minutes, starting only after the text path works end to end.
- **Double application.** The sideband is the only tool executor.
- **14.0.0 surface.** Verify `registerAction`, `availableTo`, `action.completed` in the installed types; fallback is a structured JSON DM reply validated with Zod.
- **'Just plumbing' perception.** Real-time judges may credit voice and see Relay as transport. The on-screen peer cross-check is what makes Relay load-bearing.
- **Repeatability:** frozen snapshot and log, one planted bug, low temperature, 3 rehearsal takes.
- **Not cross-person.** It is cross-vendor only; the optional `oncall` human or a teammate-hosted specialist helps.

## Source grounding

- External `docs/technologies/openai.md`: Realtime sideband (`Location` header carries `call_id`; backend attaches and executes tools; `function_call` then `conversation.item.create` and `response.create`; one owner for tool execution); called 'the cleanest way to put a voice agent on Relay'.
- `/docs/orchestrating-with-actions` (`research/relay-docs-index.json`): 'canonical request → typed-callback pattern … advance the pipeline from handle.completed() listeners'.
- Brief gotcha 7: actions at-most-once on socket drop (relaycast #283); section 5 row 7 and gotcha 11: build on SDK-driven agents, not broker/PTY.
- External `integration-architecture.md`: taskId dedupe.
- `EVENT_KICKOFF_NOTES.md`: criteria include 'real-time AI (incl. Terse/Agent Relay)' and UX/design.
