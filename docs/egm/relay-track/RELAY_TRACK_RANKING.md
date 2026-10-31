# Agent Relay track: ranking and pick

Haunted Hacks: Real-Time AI Edition, YC SF, Sat 31 Oct 2026. Written at about 13:00. Target: the Agent Relay track prize (Mac mini) only. Terse is a bonus and is cut from the pick.

Inputs: the six new briefs in this folder (Afterlife, Blood Pact, Possession, Embargo, Ouija Line, Dead Fax), the five existing briefs in `docs/egm/` (Hearsay Hollow, Medium, Midnight Soul Exchange, Witching Hour, Ghost Ticket), four judge personas, `docs/EVENT_KICKOFF_NOTES.md`, `docs/research/agent-relay.md`, and the read-only external repo `halloweenhack-ext/haunted-hacks-2026-docs`.

Note on the count: the brief said 10 ideas, but the relay-track folder also holds `0-afterlife`, and all four judges scored it. It is included as an 11th row so nothing is hidden. It does not change the top of the ranking.

## 1. Score table

J1-J4 are the four judge personas, in the order supplied. Average is the plain mean of the four. Brief columns are from each EGM brief's "Hackathon verdict": Surv = survives review, Feas = feasibility in the remaining time, Video = video-demo strength, Mean = meaningfulness, Relay = Relay prize fit (all 0-10).

| Rank | Idea | New / existing | J1 | J2 | J3 | J4 | Avg | Surv | Feas | Video | Mean | Relay | Brief go/no-go |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Blood Pact | New | 9 | 8.5 | 8 | 8.5 | **8.50** | 6 | 5 | 8 | 7 | 9 | GO, conditional (Terse and start date cut, human identities never cut, 13:20 spike) |
| 2 | Dead Fax | New | 8 | 8 | 7 | 8 | **7.75** | 6 | 5 | 8 | 9 | 8 | GO, conditional (3-identity MVP, 13:30 spike on observer DM scope and reconnect drain) |
| 3 | Embargo | New | 7 | 7.5 | 6.5 | 6.5 | **6.88** | 6 | 6 | 6 | 7 | 8 | GO, conditional (spike on group-DM readers and offline drain, 4-agent MVP) |
| 4 | Ghost Ticket | Existing | 6.5 | 6.5 | 5 | 7 | **6.25** | 6 | 5 | 7 | 7 | 8 | GO, conditional (no-bridge topology, frozen scope, restart spike) |
| 5 | Ouija Line | New | 5.5 | 7 | 5.5 | 5.5 | **5.88** | 5 | 5 | 7 | 5 | 6 | GO, conditional (text path end to end by 14:15, voice last) |
| 6 | Possession | New | 6 | 6 | 6 | 5 | **5.75** | 5 | 6 | 5 | 5 | 6 | GO, conditional (S1/S2 spike, Brain B on a second laptop) |
| 7 | Hearsay Hollow | Existing | 4.5 | 5.5 | 4.5 | 6 | **5.13** | 6 | 5 | 8 | 7 | 8 | GO, with changes |
| 8 | Afterlife (11th, extra) | New | 5 | 5 | 3.5 | 4 | **4.38** | 6 | 6 | 7 | 6 | 6 | GO, conditional (Relay-centred handoff, gate G2 by 13:20) |
| 9 | Medium | Existing | 4 | 4.5 | 4 | 4.5 | **4.25** | 6 | 5 | 6 | 8 | 7 | GO, conditional (bypass-proof topology, frozen scope) |
| 10 | Witching Hour | Existing | 3.5 | 4 | 3 | 3.5 | **3.50** | 5 | 5 | 5 | 8 | 5 | Conditional GO (lease-and-fencing ledger only) |
| 11 | Midnight Soul Exchange | Existing | 2 | 2.5 | 2 | 2.5 | **2.25** | 4 | 3 | 6 | 4 | 4 | NO-GO as written |

Observations:

- The judges agree with each other more than they agree with the briefs. Every judge puts Blood Pact first and Dead Fax second, by a margin of 0.5 to 1 point. Midnight Soul Exchange is last for all four.
- The briefs gave Relay-fit 8 to several ideas (Hearsay Hollow, Ghost Ticket, Embargo) that the judges marked down. The judges' main reason is the same each time: one owner, one vendor, or a Terse actor doing the real work, with Relay as transport. The briefs scored "could reach 8 after fixes"; the judges scored what is likely to ship.
- Every brief except Midnight Soul Exchange said GO with conditions, so go/no-go does not separate the field. Judge average and Relay fit do.
- Feasibility is 5-6 for everything that is still viable. Nothing in the pool is easy from zero code at 13:00.

## 2. Ranked recommendation

1. **Blood Pact (pick).** Two people's agents on two vendors negotiating a deal, private limits enforced in code, an offline side catching up from the thread, and a seal made of two human reactions.
2. **Dead Fax (runner-up).** Best problem in the pool, but more unverified surfaces and more to build.
3. **Embargo.** Deepest SDK coverage, thin AI, and its main claim depends on group-DM readers, the least verified surface.
4. **Ghost Ticket.** Good fit, but it is the founders' own roadmap item (originality risk) and the Terse ticket actor holds most of the logic.
5. **Ouija Line.** Good real-time AI moment, but voice plumbing threatens the working-demo requirement and it reads as one owner's specialists.

Not recommended for the Relay prize: Possession (reads as a model-fallback router; relies on two sockets per token, untested), Hearsay Hollow (one owner, one vendor, scripted), Afterlife, Medium, Witching Hour and Midnight Soul Exchange (Terse or a gateway does the real work; Relay is a pipe).

**Single pick for the Agent Relay track: Blood Pact.**

## 3. Why Blood Pact beats Dead Fax

- **Judges prefer it, all four of them.** Average 8.50 against 7.75. It is ahead or level on every persona, by 0.5 to 1 point.
- **It is the demo the founders asked for by name.** `research/agent-relay.md` item 5 says "two different people's agents negotiating". Dead Fax fits the same wish list (cross-org, cross-vendor, human participant, offline drain), but it has to argue for it; Blood Pact is the literal example.
- **It avoids Dead Fax's two weakest surfaces.** Blood Pact runs in a channel thread, so the observer needs no DM scope for the main traffic. Dead Fax's case traffic is DMs, and the external docs confirm the observer stream stays empty without the DM scope and filters. Dead Fax's authority beat also depends on `availableTo` being enforced server-side, which the 14.0.0 typings suggest it is not. Blood Pact's authority boundary (code picks numbers, escalations are templates, an outbound guard) lives in our own code and can be checked against the raw stream.
- **Less to build.** One bridge codebase run as `SIDE=buyer|vendor`, 4 identities, state folded from `threads.get`. Dead Fax needs about 6 message types, a server route holding the patient's token, a drain-and-dedupe start-up order and a timeline built from the observer. Both briefs rate feasibility 5, but J3 (the build-time persona) separates them by a full point for this reason.
- **Proof on screen is cheaper.** "N messages scanned, 0 matches for floor or cap" is a live check over real Relay traffic. Dead Fax's "Stored, Seen, Decided" needs `readers` on DMs, which is unverified.

What Dead Fax does better, said plainly: the problem is more meaningful (brief 9 against 7) and it is less exposed to the "two chatbots haggling" critique. If the 13:15 spike shows reaction read-back and thread fold both fail, and DM scope works, Dead Fax becomes the stronger choice. That is unlikely to happen, and switching after 13:15 would cost more than it gains.

## 4. Biggest risk and the 15-minute test

**Biggest risk: the never-cut Relay beats depend on 14.0.0 hosted behaviour nobody has run yet.** Specifically: (a) reading back *who* reacted to a message (`messages.reactions` returning reactor names), which is the seal; (b) a killed process reconnecting with its saved token and recovering the thread with `threads.get`, which is the offline beat; and (c) the observer showing thread replies, reactions and `from.name`. If (a) fails silently the seal looks faked; if (b) fails there is no durable beat, which is the main thing the Relay judges reward. A related trap: SDK `register()` rotates tokens by default, so a rerun of the seed script silently logs out the other side mid-recording.

A smaller, related unknown: our live curl test found the hosted API returned 503 when an `Idempotency-Key` header was sent on workspace creation, while the external docs say message endpoints accept it. Blood Pact sends `idempotencyKey` on every proposal.

**Test, 13:00-13:15, one throwaway script, no LLM, no UI:**

1. `npm i @agent-relay/sdk@14.0.0 --save-exact`, commit the lockfile. Grep the installed `.d.ts` for `reactions`, `react`, `threads.get`, `reconnect`, `metadata`, `strict`.
2. Create a fresh hosted workspace. Register `buyeragent`, `vendoragent`, `buyerhuman`, `vendorhuman` with `{ strict: true }`, write each token to its own file. Mint an observer token with `stream:read`, `messages:read`, `threads:read` (and DM scope).
3. `buyeragent` posts a root in `#deal` and a threaded reply with `metadata` and an `idempotencyKey`. Pass: both return a `messageId`, no 503, `metadata` comes back intact.
4. `buyerhuman` and `vendorhuman` each `react(replyId, 'handshake')`. Read `messages.reactions(replyId)`. Pass: both human names are listed under `handshake`.
5. Start a `vendoragent` listener, kill it, post two replies as `buyeragent`, restart `vendoragent` with `reconnect({apiToken})`, call `threads.get(rootId)`. Pass: both replies are present; note whether the listener also replayed them (this changes only the caption).
6. Open the observer stream for 60 seconds while steps 3-5 run. Pass: replies and reactions appear with `from.name`.

Fallbacks, decided now so there is no debate:

- Reaction names not readable: the seal becomes a threaded `kind:'sign'` reply posted by each human identity. Never an agent approving for its human.
- `idempotencyKey` causes a 503: drop it and dedupe by `sheetRev` in the thread fold (the fold already makes duplicates harmless).
- Reconnect or `threads.get` fails: stop and reassess at 13:15. This is the one result that would justify switching to Dead Fax, and only if its own DM-scope check passes in the same 5 minutes.
- Observer shows nothing: render the judge view from `threads.get` plus each message's `messageId`, and show the stock observer URL in one shot to prove the traffic is real.

## 5. Build plan, 13:00-15:45

Fixed scope (from the brief, tightened for a 15:00 freeze): two terms (price, auto-renew), one machine with two processes and separate token files as the default, Terse cut, start date cut, parchment animation cut, `inbox.get` and `readers` cut. Never cut: real Relay traffic, human identities and the reaction seal, the offline beat, code-enforced private limits with the live leak scan.

Roles assume 2-3 people. With one person, run the lanes in order and drop the second-laptop and polish items first.

| Time | Lane A (Relay and bridge) | Lane B (LLM and rules) | Lane C (UI) | Gate |
|---|---|---|---|---|
| 13:00-13:15 | Spike script (section 4) | Freeze `schema.ts`: `{v, dealId, kind, term, sheetRev, round, value, side, model, host, inReplyTo}`; both `playbook.json`; concession schedule (vendor opens $45k, buyer $32k, meet at $38k by sheetRev 6-7); emoji table | Scaffold one Express + static page app per side, served by the bridge | 13:15: spike results logged, seal and drain paths chosen |
| 13:15-13:45 | Relay adapter (`connect`, `post`, `reply`, `react`, `reactions`, `thread`, `subscribe`). Bridge with `SIDE`, self-filter, fold of `threads.get`, buyer-odd / vendor-even turns, fresh `dealId` per take | Pure function: next offer from playbook and last counter. Rule check. Outbound leak guard (regex for every form of the private numbers, any number other than `metadata.value`) | Deal tab: plain clause table from the fold, every row showing `messageId`, `from.name`, vendor badge | 13:45: two processes converge on price with no LLM. Tag `loop-ok` |
| 13:45-14:15 | JSONL trace per side; `model`/`host`/`side` stamped in metadata | Claude (buyer) and OpenAI (vendor) write the wording from `{term, value, last text}` only, never the bounds; `max_tokens` about 120. LLM classifies the auto-renew ask as outside authority, which triggers a fixed-template DM to its own human | Observer pane as a chat log (time, kind, name, vendor badge, short text), raw JSON behind a toggle | 14:15: if the LLM path is flaky, keep LLM wording only and make escalation rule-based; say so in the description |
| 14:15-14:40 | Buyer posts one `kind:'ready'` message; `messages.reactions` check on every reaction event and at start-up; buyer-only SEALED with a fixed key | Escalation round trip: human rejects, agent counters with a 60-day opt-out | Human tab: three buttons (Approve, Reject, Sign) calling localhost, bridge holds the human token; "waiting for Alice" state; default reject after 45 s | 14:40: full run end to end twice. Tag `e2e-ok`. If the seal fails, switch to `kind:'sign'` replies now |
| 14:40-15:00 | Offline beat: "Go offline" button or Ctrl-C on the vendor; reconnect order (attach listener and buffer, `threads.get`, merge, dedupe, fold, act once); drain log line | `new-take` command; pre-run 2 full takes | Live leak-scan panel ("N messages scanned, 0 matches, leaks blocked: 0"); presence chips (online, offline, draining) | 15:00: hard freeze at `e2e-ok` or later. Second laptop only if it was already working by 14:45 |
| 15:00-15:30 | Record 2-3 takes, each on a fresh `dealId`, screen recording not over-the-shoulder, only the observer token visible | Write the description | Edit to about 90 s, captions, speed up LLM dead air with an honest caption | 15:30: best take chosen |
| 15:30-15:45 | Revoke the on-screen observer token after recording | Submit on Builderbase (the kickoff notes say Builderbase; the external repo's "Devpost" is out of date) | Check the submission from a second device | **15:45: submitted.** 15 min buffer to 16:00 |

Video, about 90 seconds:

1. 0-10 s: a person pasting from Claude into an email and back from ChatGPT. Caption: "you are the meat proxy".
2. 10-30 s: two panes labelled "Acme, buyer, Claude" and "Spectral SaaS, vendor, OpenAI". Start. Real proposals stream in the observer; the price row fills in.
3. 30-45 s: vendor asks for auto-renew. The buyer agent DMs `buyerhuman` instead of conceding. The human taps Reject; the agent counters with a 60-day opt-out.
4. 45-65 s: vendor goes offline on camera. Buyer's offer lands in the thread. Vendor reconnects with the same token; drain log shows "fetched 1 message, skipped 4 already handled". Caption: "stored by Relay, fetched on reconnect with the same identity".
5. 65-80 s: both humans tap Sign on the same message. SEALED. Leak panel: "14 messages scanned, 0 matches for floor or cap".
6. 80-90 s: "Two people, two vendors, nobody copied a word." One honest line: what the model decides (wording, authority call) and what code enforces (every number).

Description must name: `@agent-relay/sdk@14.0.0`, channel threads with metadata, reactions as human approvals, reconnect with saved tokens and thread fold for offline catch-up, observer token, cross-vendor (Claude and OpenAI), cross-person (separate human identities with their own tokens), the leak scan, and the honest limits (one machine if that is what was recorded; reactions are approvals, not cryptographic signatures).

## 6. What the external repo changed

The external repo did not change the ranking or the pick. It changed design details inside the briefs and lowered confidence in the DM-heavy ideas.

1. **`register()` rotates tokens by default.** The SDK reference says registration adopts an existing name and rotates its token; only `strict: true` throws. Our research brief described create-only behaviour (409), which is the raw REST path. This is why Blood Pact seeds once with `strict: true` and every process only calls `reconnect`. It also explains Dead Fax B3 and Possession's two-sockets-per-token problem.
2. **Observer payloads need resource scopes, and DMs need a DM scope plus filters.** `stream:read` alone connects but shows no payloads. This favours ideas whose main traffic is in channels (Blood Pact) over ideas whose traffic is DMs or group DMs (Dead Fax, Embargo, Midnight Soul Exchange's collusion DMs). It is a large part of why Blood Pact beats Dead Fax.
3. **Stored is not processed.** The delivery doc separates storage from delivery into a session. That forced the honest caption in the offline beat ("stored by Relay, fetched on reconnect") instead of "delivered on reconnect", unless the spike shows listener replay.
4. **`messages.readers`, `markRead`, `inbox.get` and `react` are documented.** That made Embargo and Dead Fax look buildable, but they are documented, not tested, which is why both carry a spike gate.
5. **"A model proposes; application rules decide"** (`actor-primer.md`). This backs Blood Pact's fix that code chooses every number and the LLM only drafts wording and makes the authority call.
6. **Idempotency conflict, still open.** The external guide says message endpoints accept an `Idempotency-Key` header; our live test saw a 503 when it was sent on hosted workspace creation. Tested in the 13:00 spike, with a fallback that does not need it.
7. **Submission platform.** The external repo says Devpost from the event listing; the kickoff notes say Builderbase. The kickoff notes are newer and from the room, so submit on Builderbase, and confirm with an organiser if the form is not obvious.

Nothing in the external repo was executed; it was read only.
