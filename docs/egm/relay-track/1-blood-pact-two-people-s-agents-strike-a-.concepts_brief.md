# Concepts Brief: Blood Pact, two people's agents strike a deal while each side's limits stay private

**Author:** Charlie Gillet
**Date:** 2026-10-31

## Overview

Blood Pact's pitch is "two people, two vendors, two machines, and nobody copied a word." A buyer agent (Claude) and a vendor agent (OpenAI), each on its own laptop with its own owner, negotiate a 3-term pilot SOW (price, start date, auto-renew) in a threaded `#deal` channel on Agent Relay. Each side's walk-away limits stay in a local `playbook.json`. Out-of-authority asks go by DM to that side's own human. The vendor goes offline and catches up on reconnect, and the deal is sealed only when both human identities react on the same message. The judge screen shows the observer stream, a contract parchment and a "never revealed" panel. Source: [1-blood-pact-two-people-s-agents-strike-a-.concept.md](./1-blood-pact-two-people-s-agents-strike-a-.concept.md).

Context: Haunted Hacks: Real-Time AI Edition, YC SF, Sat 31 Oct 2026. It is about 13:00 and building stops at 16:00. The demo video has to be recorded and uploaded before then, so **about 1.5-2 hours of real build time are left**. Round 1 is judged from the video plus a description, and a working demo is required. **The target is the Agent Relay track (Mac mini) only.** Terse is a bonus.

Six Goldfish lenses ran in BRAINSTORM mode: Design Critic, Codebase Details, Zoom Out, Comprehension, Implementation Readiness and Structural. **All six completed and all six returned *proceed-with-changes*.** They agree closely. This is the best fit for the Relay prize so far: it hits cross-person, cross-vendor, cross-machine, durable offline delivery and shared history, which is the demo the founders asked for by name. But the headline privacy claim is not enforced. The seal is under-specified and contradicts the cut list. Nobody owns the revision counter. And the scope is about twice what the time allows.

## Analysis

Findings are deduplicated across lenses. The count in brackets shows how many of the 6 lenses raised each one.

### Blockers

**B1. "Limits never cross the wire" is claimed, not enforced, and the panel only asserts it [6/6].** The LLM "picks values within the allowed range", so it has to see the cap and floor, and nothing stops it writing "our ceiling is $40k" in the prose. The deterministic check gates only the numeric value field, not the text. Escalation DMs ("Outside playbook...") are also Relay messages, and the observer on the projector has DM scope, so a limit mentioned there shows up on screen. The "never revealed" panel just prints the two local playbooks next to the stream, which proves nothing. The wording also overclaims: the playbook goes to Anthropic and OpenAI as prompt context, and an escalation reaches the Relay server even though the counterparty never sees it. One leaked number on video kills the main originality claim, and founders who dogfood Relay will read the raw stream.
*Fix:* (1) **Code chooses every number.** A fixed concession schedule from the playbook computes the next offer. The LLM gets only `{term, value, counterparty's last text}` and never sees the bounds. (2) **Escalation DMs are fixed templates** with no LLM and no numbers ("outside my authority", not "$40k cap"). (3) **Outbound guard** in each bridge: before any send (channel or DM), regex-scan the text and metadata for that side's private values in every form (`35000`, `35k`, `$35,000`, `40,000`...) and for any number other than `metadata.value`. On a hit, log `blocked_leak`, redraft once, then fall back to a template sentence. (4) **The panel computes its verdict live.** It pulls the deal thread plus both escalation DMs, runs the same regex and shows "N messages scanned, 0 matches for floor or cap", with a "leaks blocked: 0" counter. (5) Say "never sent over Relay to the counterparty", not "never left the laptop".

**B2. The seal is under-specified and contradicts the cut list [6/6].** Cut #4 removes the human Relay identities ("web UI posts as the agent with an 'approved by Alice' tag"), while the never-cut list keeps a seal defined as `buyerhuman` and `vendorhuman` reacting. Make cut #4 and the seal becomes the agent approving itself, which is the meat-proxy or fake signature the founders will spot. Each agent also posts its own "ready to sign rev N", which gives two messages, so "the same messageId" is ambiguous, and both bridges post SEALED (a duplicate). The human interface is undefined: which client the human reacts from, which emoji means approve, reject or sign, and what happens if the human never answers. How the bridge reads reactions back was never specified either.
*Fix:* **Human identities become never-cut.** They cost 2 of the 5 slots. Register them like the agents, with an explicit `type` checked against `wire.AgentType` (`createHuman` is not in 14.0.0, per Implementation Readiness). **One seal anchor:** only the buyer agent posts a single `kind:'ready'` message, "Proposed final: rev N", with the full term sheet in metadata. **One human page per laptop** (see M9) with exactly three buttons, each calling `react(messageId, fixedEmoji)`: Approve = `white_check_mark`, Reject = `x`, Sign = `handshake`. No free-text path. A visible "waiting for Alice" state, and a default reject after N seconds so the demo can't hang. **Seal check:** read `messages.reactions(readyId)` (reported to return `{emoji, count, agents[]}`) and require both human names under `handshake`. Re-check on every reaction event and on startup. **Only the buyer bridge posts SEALED**, with `idempotencyKey = dealId:sealed`. Fallback if reaction read-back or observer display fails in the spike: each human page posts a threaded `kind:'sign'` reply with `{rev}` and a fixed idempotency key. Pitch it as "two human approvals recorded on one immutable message", not as a signature.

**B3. The scope does not fit the time [5/6].** The never-cut set alone covers a seed script, two vendor integrations, a threaded rev protocol, own-human escalation, a human approval page, the offline drain and dedupe, the reaction seal, an observer pane, a parchment, a never-revealed panel, two laptops and possibly a Terse actor. All of it is new: the repo has only docs. The only time-boxed item is the 15-minute spike. If the happy path is not working end to end by about 15:00, there is no video, and a working demo is mandatory.
*Fix:* **Cut Terse now.** **One bridge codebase** parameterised by `SIDE=buyer|vendor` and `LLM=anthropic|openai`. **Drop start date** (two terms: price and auto-renew; auto-renew carries the escalation). **Plain clause table**, no parchment animation. **One machine with two processes and two token files is the default video path**; use the second laptop only if it works by 14:45. Hard time boxes are in the staging section. Stop coding at 15:15.

**B4. The 14.0.0 `register()` rotates tokens instead of throwing [2/6; blocker in 1].** The concept assumes "registration is create-only, register once". Implementation Readiness read the installed 14.0.0 facade types: `workspace.register()` is idempotent by default. It adopts an existing name and **rotates its token, invalidating the old one**. Only `{ strict: true }` throws. The create-only gotcha in the research brief describes the raw REST path. A rerun of the seed script, or any "reconnect failed, so register" recovery path, silently breaks the other laptop's token with no clear error, probably mid-recording, and the old token is gone for good.
*Fix:* the seed script calls `register(..., { strict: true })` and refuses to run if the token files exist. Runtime processes call only `workspace.reconnect({apiToken})`, never register, and exit loudly on auth failure. On boot each bridge logs its own `from.name` and refuses to start if it doesn't match its configured role, which catches mixed-up token files. Keep one `reseed` script (wipe, re-issue all four tokens, redistribute) as the only rollback, and time it once.

### Majors

**M1. Nobody owns the revision counter or the deal state [6/6].** The idempotency key `dealId:term:rev` implies per-term revs capped at 3, but the demo says "answers only rev 7", which implies a global counter. No rule says whose turn it is, so both agents can counter at once and produce two rev 3s. The idempotency key then silently drops one, and the two sides disagree on rev N, so the seal never fires. Agents listening on `'*'` also receive their own messages, which risks a runaway loop that burns LLM and message budget mid-take. State lives only in bridge memory once Terse is cut, so it is lost when the vendor process is killed for the offline beat.
*Fix:* **one global `sheetRev` with strict alternation.** The buyer owns odd revs and the vendor owns even revs. A side may post rev N+1 only when the latest deal message is the other side's rev N. Terms are handled one at a time in a fixed order. Keep a per-term `round` (max 3) for display and escalation only. **Deal state is a pure fold of the thread:** `state = fold(threads.get(rootId))`, rebuilt on startup and after every event. A side acts only when the latest message is the counterparty's and its rev is above its own last rev. That removes the need for a separate dedupe store and makes the reconnect clean. Filter `envelope.from.name === self`. `idempotencyKey = dealId:sheetRev:side`. Put `{side, sheetRev, round, inReplyTo}` in metadata.

**M2. Several field and method names don't match the pinned 14.0.0 types [4/6].** Per Implementation Readiness, which read the installed `.d.ts`: messages carry `metadata`, not `data` (an untyped `data` object would be dropped silently, leaving the clause table blank). `messages.list(channel, ...)` lists a channel and may return only root messages; thread replies come from `threads.get(rootId)` → `{parent, replies}`. `createHuman` does not exist. `inbox.get`, `messages.readers`, `messages.reactions`, `react`, `markRead` and `deliveries.ack` do exist. The other lenses flagged the same surfaces as unverified, and noted that the seal, drain and escalation all depend on them.
*Fix:* rewrite the concept with definite choices and delete the "if it exists" hedges: `metadata`, drain with `threads.get`, humans registered with `type`, seal via `messages.reactions`. Leave `inbox.get` and `readers` out of the build; they add nothing the thread fold doesn't give. Wrap every Relay call in one small adapter module (`connect`, `post`, `reply`, `react`, `reactions`, `thread`, `subscribe`). **Expand the 15-minute spike, no LLM:** register 4 identities with `strict`, post a root and a threaded reply with metadata, react from two human tokens and read the reactors back by name, kill a listener, send, reconnect and `threads.get`, and open the observer with the planned scopes to confirm that DMs and reactions show up with `from.name`. Grep the `.d.ts` for each method as you go.

**M3. The offline beat lacks visible proof and overclaims [6/6].** Closing a lid suspends the process rather than killing it, and it can leave a half-open socket that the server still treats as connected, so it can look like nothing happened. Nothing on screen shows the vendor was offline or that catch-up happened. Draining by reading history is valid, but it is not "delivered on reconnect", and the founders will notice. The order of drain and listener attach is unspecified, so messages can be lost in the gap or handled twice. "The escalation for `vendorhuman` waits" is confused, because only the buyer escalates in this script.
*Fix:* **Ctrl-C the vendor process on camera** (or a "Go offline" button) and keep the lid open. Presence chips: online / offline / draining. Fixed reconnect order: attach the `'*'` listener and buffer events, `threads.get` the deal thread, merge, dedupe by messageId, fold, act once. Show the drain log in the vendor pane: "reconnected with existing token, offline 14:02:10-14:02:41, fetched 1 message (sheetRev 7, createdAt inside window), skipped 4 already handled". Tag every inbound event `source: listener | drain`. Caption: "stored by Relay, fetched on reconnect with the same identity". Say "delivered on reconnect" only if the spike shows the listener itself receives the queued messages. Drop the vendorhuman-waiting clause.

**M4. The run is too slow and not reproducible [3/6].** Three terms by three rounds by two sides is about 18 sequential LLM calls at 2-5 s each, or 40-90 s for beat 2 alone. An LLM choosing values makes the closing price vary between takes, yet the script hard-codes $38k and rev 7. That can't be rehearsed into a 2-minute live slot, and a stall on stage looks like failure. Zoom Out raised the opposite worry: with rules deciding everything, the LLM looks decorative and the outcome looks canned.
*Fix:* deterministic number trajectory (from B1), so every run ends at the same rev and price. Aim for 5-7 proposals in total, using small fast models with `max_tokens` around 120. **Give the LLM one real decision:** it classifies each counterparty ask as within or outside authority, which triggers the escalation itself, and it writes the wording. Say in one on-screen line what the model does and what code enforces. Optionally show each side's private reasoning in its local pane only. Never send that reasoning to Relay. Speed up dead air in the edit, with an honest caption.

**M5. Rehearsal takes are not isolated [2/6].** With one `#deal` channel, reused identities and a reused `dealId`, take 2's idempotency keys can collide with take 1's, so messages vanish for no visible reason. Old reactions and revs also stay in history, where a loose filter or a reconnecting vendor will pick them up.
*Fix:* `dealId = run-<timestamp>` per take, shown in the UI header. Each take posts a new root message, and every query, listener and view filters on `dealId` plus `rootId`. A `new-take` command creates only a new root and clears local state, never registrations.

**M6. Cross-vendor and cross-machine are invisible, and there is no trace [4/6].** The observer shows `from.name` and text, so nothing shows that `buyeragent` is Claude, `vendoragent` is OpenAI, or that they run on two machines. That opens the "two prompts in one process" critique. Raw JSON envelopes can't be read at video resolution. When the negotiation stalls, the only record is scattered console output on two laptops.
*Fix:* stamp every message's metadata with `{model: <id returned by the API>, host, side}` and render it as a badge. Render the observer as a chat log: time, kind (channel / DM / reaction), `from.name`, vendor badge, term and value, short messageId, first 60 characters, with raw JSON behind a toggle and a counter per event kind in the header. One JSONL trace per side: `{ts, side, dealId, sheetRev, phase: llm_draft|rule_check|guard|send|recv|escalate|seal_check, decision, reason, llm_ms, messageId, relayStatus, source}`. Treat `queued_unconfirmed` as success, but record it. Add a header line with baseUrl, workspace, plan, agent count and the last 429 with `Retry-After`, and a plain-English status line ("LLM proposed $34k, clamped to $35k", "token rejected, rerun seed").

**M7. The network topology has a single point of failure [2/6].** Hosted Relay may degrade with 50+ hackers (incidents #476 and #503). The local `:8787` fallback is effectively a migration: tokens, channel, root id and history are all per-engine. Venue Wi-Fi often isolates clients, so a LAN fallback may not work. The organiser laptop is a third machine.
*Fix:* laptop A is the organiser, so there are only two machines. Pre-generate two complete credential sets (hosted and local), selected by one `RELAY_TARGET=hosted|local` env var that every process and the observer read. The seed script creates the channel idempotently. The local fallback runs on **one machine only**. Test LAN or phone-hotspot reachability during the spike. Record on whichever target works first.

**M8. The message schema has no `kind` [1/6, implied by 3 more].** Proposals, counters, accepts, escalations, decisions, the ready message and SEALED all share the same fields, so consumers end up inferring intent from prose or field presence. That is the "UI parses prose" failure the concept claims to avoid.
*Fix:* freeze one shared file before writing code: `{v:1, dealId, kind:'propose'|'counter'|'accept'|'escalate'|'decision'|'ready'|'sign'|'sealed', term, sheetRev, round, value, side, model, host, inReplyTo}`. Every consumer switches on `kind`.

**M9. Too many UI surfaces, and human tokens risk leaking on screen [4/6].** The plan has two human approval pages, a custom observer, a parchment, a never-revealed panel and a judge layout. If a human `at_live_` token sits in browser JS or a URL, it can show up in the recording.
*Fix:* one web app per laptop, served by that laptop's bridge, with a Human tab (buttons call a localhost endpoint; the bridge holds the human token) and a Deal tab (clause table plus never-revealed panel). The judge view is the same app in observer mode on an `ot_live_` token minted with all needed scopes in the seed script, or the stock observer URL if the custom view slips. Show only the observer token on screen, and revoke it afterwards. Limit each shot to two panes, and record screens rather than filming over a shoulder.

### Minors (grouped)
- **Pinning and rollback:** commit the lockfile, use `npm ci` only, pin the Anthropic and OpenAI SDKs, no `agent-relay update`. Tag a git commit after the first full end-to-end run and record against that tag before adding polish.
- **Definite wording:** delete the "Merges Familiars, ..." list from the brief. Add a three-line glossary: `sheetRev`, `round`, the emoji table.
- **Failure states:** visible messages for 429, a value outside the playbook (clamped), a failed reconnect, an unanswered human. Each bridge gets a `reset-deal` command.
- **Longer term:** the SDK moves fast (three majors in a month, v15 in flight), and reactions carry no signed payload. The adapter module contains the first risk; the "approvals, not signature" wording handles the second. Keep the legal framing as "deal terms with human sign-off".

## Goals vs. Non-Goals

**Goals**
- Two agents from different vendors, owned by different people, negotiating over real, visible Relay traffic with vendor and host badges on every message (M6).
- Private limits that are enforced in code: bounds kept out of the LLM, template escalations, an outbound guard, and a live "0 matches in N messages" scan (B1).
- A single, unambiguous seal: one `ready` message, two human identities reacting with `handshake`, read back with `messages.reactions`, and SEALED posted once by the buyer (B2).
- Strict turn-taking on a global `sheetRev`, with state folded from thread history (M1).
- A visible offline beat: Ctrl-C, presence chips, a drain log, an honest caption (M3).
- A deterministic, rehearsable run of 5-7 proposals in which the LLM makes the authority call (M4).

**Non-Goals (today)**
- Terse DealRoom actor.
- Start date as a third term; parchment animation; `messages.readers` ticks; `inbox.get`.
- Free-text human replies; the LLM choosing numbers; LLM-written escalations.
- Two laptops as the default path; a LAN local-engine fallback.
- Any form of cut #4, where an agent signs or approves on its human's behalf.
- Legal-grade signatures or contract advice.

## Alternatives Weighed

| Decision | Option chosen | Rejected | Why |
| --- | --- | --- | --- |
| Who picks numbers | Code (fixed concession schedule) | LLM within range | LLM must see bounds and can leak them; non-reproducible runs (B1, M4) |
| LLM's real job | Classify asks as in or out of authority, write the wording | Decorative prose only | Keeps the real-time AI criterion credible (M4) |
| Leak proof | Outbound guard plus live regex scan of the stream | Panel printing both playbooks | Evidence instead of assertion (B1) |
| Human identities | Never-cut Relay participants with `type` | Agent posts "approved by Alice" | Otherwise it is a meat proxy or fake signature (B2) |
| Seal anchor | One buyer-posted `ready` message, buyer posts SEALED | Each side posts ready, both post SEALED | Ambiguous messageId, duplicate SEALED (B2) |
| Seal fallback | Threaded `kind:'sign'` reply | Agent reacts for the human | Stays visible as real human traffic (B2) |
| Revision model | Global `sheetRev`, buyer odd and vendor even | Per-term rev, no turn rule | Forked revs, missed seal (M1) |
| State store | Fold of `threads.get(rootId)` | Bridge memory or Terse actor | Survives the kill; Terse is cut (M1) |
| Drain path | `threads.get` after buffering the listener | `messages.list` on the channel, or `inbox.get` | Channel list may miss replies; inbox adds nothing (M2, M3) |
| Offline trigger | Ctrl-C on camera, lid open | Lid close | A half-open socket muddles the beat (M3) |
| Seeding | `register({strict:true})` once, guard on existing files | Default `register` | 14.0.0 rotates tokens silently (B4) |
| Machines | One machine by default, second laptop as an upgrade | Two laptops plus an organiser | Wi-Fi and time risk (B3, M7) |
| Relay fallback | Separate local credential set, one machine | LAN `:8787` | Client isolation; tokens are per-engine (M7) |
| UI | One app per laptop with Human and Deal tabs, observer mode | Separate pages plus custom raw observer | Halves front-end work; tokens stay server-side (M9) |

## Key Decisions & Staging for Next Steps

**Decide now (5 minutes, before code):** the schema file (M8); `sheetRev` with buyer-odd and vendor-even turns; the emoji table; the buyer as the only `ready` and SEALED poster; the code-chosen price trajectory (for example vendor opens $45k, buyer $32k, converging to $38k by sheetRev 6 or 7) and the auto-renew → escalation → reject → "60-day opt-out" path; human identities never cut; Terse cut.

**Staging (time boxes):**
1. **13:00-13:20, spike, no LLM.** Seed with `strict`, guarded by existing token files, 4 identities, plus an observer token with all scopes. Root plus threaded reply with `metadata`. Two human tokens react and the reactors are read back by name. Kill, send, reconnect, `threads.get`. Check that the observer shows the DM, the reaction and `from.name`. Run `GET /v1/workspace`. Commit the lockfile. Record each result in the concept file. If reaction read-back fails, switch to the `kind:'sign'` seal now.
2. **13:20-13:50, core loop.** One bridge (`SIDE`, `LLM`), the adapter, the fold, turn-taking, self-filter, and code-chosen offers on price converging with no LLM. JSONL trace. Tag `loop-ok`.
3. **13:50-14:20, LLM plus guard.** Claude and OpenAI drafting the wording from `{term, value, last text}`, the authority classifier triggering the auto-renew escalation (template DM), the outbound guard, model and host badges.
4. **14:20-14:50, humans and seal.** The per-laptop app's Human tab (buttons → localhost → `react`), timeout default, the `ready` message, the `messages.reactions` check, buyer-only SEALED. Tag `e2e-ok`.
5. **14:50-15:10, screen and offline.** Clause table, live leak scan panel, chat-log observer view with per-kind counters, presence chips, the drain log, `new-take`. Try the second laptop only if everything else works.
6. **15:15, freeze.** 15:15-15:40: record 2-3 takes on one fresh `dealId` each, at the `e2e-ok` tag or later. 15:40-15:55: edit, captions, and a description that names `@agent-relay/sdk@14.0.0`, cross-vendor, cross-person, durable catch-up, shared history and the leak scan. Submit before 16:00. For the live final, keep the local-engine credential set and the recorded clip ready.

**Open items:** the spike results for reaction read-back and observer visibility of reactions and DMs (they decide the seal path); whether the listener replays queued messages on reconnect (it only changes the caption); hosted plan and quota; whether venue Wi-Fi allows two laptops.

## Hackathon verdict

| Dimension | Score (0-10) | Note |
| --- | --- | --- |
| Survives review | 6 | Four blockers, all fixable by design decisions made now; no lens doubted the idea, and all six said proceed-with-changes |
| Feasibility in remaining time | 5 | Only with the cuts: Terse out, two terms, one machine by default, a plain table, deterministic offers, freeze at 15:15 |
| Video-demo strength | 8 | Two vendor badges, a human tapping reject, a Ctrl-C and catch-up, a handshake seal and "0 leaks in N messages" make a clear 90-second story |
| Meaningfulness | 7 | The meat proxy in cross-company deal-making is real and easy to grasp; the risk is that it reads as a toy, which the authority boundary and leak proof answer |
| Relay prize fit | 9 | It is the demo the founders asked for: cross-person, cross-vendor, cross-machine, durable catch-up, shared history, real visible traffic |

**Go/no-go:** GO, conditional on cutting Terse and start date now, making human identities never-cut with a single buyer-owned seal anchor, and passing the 13:20 spike (strict seed, reaction read-back, reconnect plus `threads.get`, observer visibility). If reaction read-back fails, switch to the threaded `sign` reply, not to agent-signed approval.

**Top 3 changes that would most improve the idea:**
1. **Make the privacy claim provable.** Code picks every number, the LLM never sees the bounds, escalations are templates, an outbound guard blocks any playbook number, and the panel shows a live "N messages scanned, 0 matches" over the real stream.
2. **Fix the seal and keep the humans real.** Human identities are never cut. There is one buyer-posted `ready` message, three fixed buttons per laptop calling `react`, the seal is checked with `messages.reactions`, and only the buyer posts SEALED, once. Seed with `register({strict:true})` so tokens never rotate silently.
3. **One owner for state, and cut scope to fit.** A global `sheetRev` with strict turn-taking, state folded from `threads.get`, `metadata` with a `kind` field, a fresh `dealId` per take. Cut Terse and start date, use one machine by default, Ctrl-C for the offline beat, stop coding at 15:15.
