# Concepts Brief: Dead Fax, prior authorization settled between a clinic's agent and an insurer's agent, with the patient's consent

**Author:** Charlie Gillet
**Date:** 2026-10-31

## Overview

In Dead Fax, a clinic's Claude agent and an insurer's OpenAI agent settle a synthetic prior-authorization request directly over Agent Relay. The flow covers the "send more information" loop, a human patient who approves the one sensitive field that gets shared, an insurer that is offline overnight and catches up, and a decision that only the insurer's identity can record (`record_determination`, `availableTo: ['payer']`). There are four participants (clinic, payer, patient, optional pharmacy), each case lives in one DM thread keyed by `caseId`, and a judge screen shows a chain-of-custody timeline over the observer stream. Source: [5-dead-fax-prior-authorization-settled-bet.concept.md](./5-dead-fax-prior-authorization-settled-bet.concept.md).

Context: Haunted Hacks: Real-Time AI Edition, YC SF, Sat 31 Oct 2026. It is about 13:00 and building stops at 16:00, so **about 2.5-3 hours of build time are left, and the repo contains only docs (no package.json, no src, no Relay smoke test)**. Round 1 is judged from a demo video plus a description, and a working demo is required. **The target is the Agent Relay track (Mac mini) only.** Terse is a bonus.

Six Goldfish lenses ran in BRAINSTORM mode: Design Critic, Codebase Details (checked against the installed `@agent-relay/sdk` 14.0.0 and `@relaycast/sdk` typings, read only), Zoom Out, Comprehension, Implementation Readiness and Structural. **All six completed and all six returned *proceed-with-changes*.** They agree that this is the strongest problem in the pool for meaningfulness and for the founders' wish list (cross-vendor, cross-org, a human participant, offline durable delivery, no meat proxy). They also agree that the scope is too large for the time left, and that several load-bearing mechanics (the idempotency key, the restart identity, who owns the action, how the decision is delivered, where the timeline comes from) are wrong or undefined as written.

## Analysis

Findings are deduplicated across lenses. The count in brackets shows how many of the 6 lenses raised each one.

### Blockers

**B1. The scope does not fit the time left, and no code exists yet [6/6].** As written the concept needs 4 identities, 2 LLM vendors, a phone page, a typed action, an observer feed, a separate timeline, a three-pane judge screen, a fax skin, a Terse actor with a SQLite fallback, a pharmacy group DM and two extra beats (offline, least-privilege). The "never cut" list plus a judge screen is about 2.5 hours of focused work on its own, and a video still has to be recorded and uploaded before 16:00. Several of the APIs it depends on are unverified on 14.0.0.
*Fix:* freeze the MVP now. **3 identities (clinic, payer, patient), the info-request loop, the consent tap, kill and catch-up, and one page rendered from the observer stream.** Remove Terse, the SQLite actor fallback, the pharmacy and the fax skin from the plan now, not as later cuts (one static fax image in the intro is enough). Set hard gates (see Staging) and apply the cut order at each gate without debate.

**B2. `idempotencyKey = caseId` will silently drop messages [4/6].** One case has several sends from the same sender: the request, the consent question, the consented-field reply and the pharmacy notice. If the server dedupes on the key, every send after the first is swallowed with no error. That is the info-request loop, a "never cut" beat, and it would look like Relay losing messages on camera. Reusing `case-1` across rehearsals in the same workspace fails the same way.
*Fix:* key = `${caseId}:${step}` (`c7f3a:request`, `c7f3a:consent-ask`, `c7f3a:info-reply`, `c7f3a:determination`), on SDK sends and on the REST `Idempotency-Key` header. Use random caseIds per run, not a counter that restarts at 1. Log the key with each send's `queued` / `queued_unconfirmed` result. Add one spike assert: two sends with different steps both arrive.

**B3. The restarted payer gets no identity back, so the offline beat cannot work [5/6].** Registration is create-only (409 `agent_already_exists` on a duplicate name; the external docs say SDK `register` may instead adopt the name and rotate the token, which would log out the stopped payer). A run suffix creates a new identity with an empty inbox, so the overnight cases never drain, and each attempt uses one of about 5 agent slots.
*Fix:* one bootstrap script registers all identities once per workspace, writes each `at_live_` token to its own env file (outside git) and mints the observer token. Every process calls `reconnect({apiToken})` and never calls `register`. Rehearse kill and restart at least 3 times before recording. For a clean final take, use a fresh workspace rather than suffixed names.

**B4. The decision path is undefined and cannot be lost [6/6].** There are two problems here.
(a) *Ownership and enforcement.* `registerAction` makes the registering participant the handler. If the payer registers `record_determination` and invokes it, it is calling its own function and Relay proves nothing about authority. `facade.d.ts` also suggests that `availableTo` may be enforced by the registering client's facade, not by the server, so with the payer offline the clinic's "rejected" attempt may queue or fail silently. 14.0.0 does have an `action.denied` event with a `reason` (listeners.d.ts:94, 212).
(b) *Delivery.* The clinic UI moves forward only on `action.completed`, a live listener event that is at most once if a socket drops (relaycast #283), with no evidence that it can be replayed. The restart beat is exactly when sockets reconnect.
*Fix:* **the determination is a durable thread reply** (`data:{type:'auth.determination', caseId, decision, policyClause, rationale, vendor, model}`) sent with the payer's token. The clinic rebuilds state from `messages.list` and advances on that reply. If the typed action ships, it is a fast path, deduped by caseId. The clinic bridge (the requester's system of record) registers `record_determination` with `availableTo: ['payer']`, the payer invokes it, and the handler stores the invoker identity Relay reports. Keep the least-privilege beat only if a spike shows that an invoke with the clinic's own token fails **server-side** and shows up as `action.denied` with a reason. Test with the payer online and offline. If not, cut the beat; never fake the refusal.

**B5. The timeline and observer must show real Relay traffic, and the observer may show nothing [6/6].** The concept never says where timeline rows come from. If they are local UI events with a messageId attached, that is faked traffic, which the founders say they will spot. Separately, all the important traffic is DMs and a group DM. The observer token needs `stream:read` plus messages, threads and DM scopes and filters. With one missing, the stream connects but stays empty, which looks the same as idle agents. Hosted reliability issues #476 and #503 are open.
*Fix:* **the timeline is the observer stream rendered as rows**, keyed on `metadata.type` and `caseId`, plus `messages.list` / `readers` on load. It is not a separate component with its own state. Add a "verify" click per row that re-fetches that messageId from Relay and shows the raw payload. Mint the observer token and confirm that a clinic-to-payer DM renders in the browser **before writing any agent logic**. If DM scope fails, use one private channel per case (`#case-<id>`, with clinic and payer as members) and keep a DM only for the patient. Add a small health strip: observer connected, scopes, last event time, event count, engine, workspace plan.

### Majors

**M1. Offline drain and the live listener can double-process, and "seen" has no source [5/6].** On startup the payer drains `inbox.get` / `messages.list` and also attaches `addListener('*')`, so a message that arrives mid-drain, or is redelivered, is handled twice: two info requests or two decisions. Order across the overnight cases is not guaranteed. `readers(messageId)` exists on the `@relaycast/sdk` agent client (agent.d.ts:216-217, `ReaderInfo{agent_name, read_at}`) but stays empty unless the payer calls `markRead`. `deliveries({status})` gives a real "queued" state. If "handled" means `markRead`, seen and decided become the same thing, which the concept's own honest limit says to avoid.
*Fix:* payer startup order: reconnect, attach the listener into a buffer, drain, sort by `created_at`, skip caseIds already in a handled set on disk (a JSON file), decide, write the handled set, `markRead`, then flush the buffer through the same dedupe. While the payer is down, the clinic shows "queued" from `deliveries()` / inbox. After restart, the UI polls `readers` for `read_at`. If `readers` is unusable, the payer sends a "seen" reaction as the receipt. Rehearse one kill in the middle of a decision.

**M2. The overnight cases would stall on another consent tap [2/6].** If the two cases filed while the payer is down follow the normal flow, catch-up turns into an info-request and consent exchange that waits for a human, so "both resolve" in 20 seconds does not happen.
*Fix:* the overnight cases are submitted complete, with A1c already consented, so the payer decides them straight from the drained inbox. The beat shows one thing: stored while offline, drained in order, seen, decided.

**M3. Consent integrity depends on the LLM and on the clinic's word [3/6].** The clinic's Claude has the full chart in context, including the sensitive note. If the outbound reply is free text, the model can paraphrase the denied note. "The chart never leaves the clinic" is also false at the provider level. `consentMsgId` is not checked against a real patient message, and it points into a DM the payer cannot read.
*Fix:* build the outbound `data` from consented fields **in code**. Never give the sensitive note to the LLM; the LLM writes only the cover sentence. Before sharing, the clinic fetches `consentMsgId`, checks `from.name === 'patient'` and that the field list matches, and refuses and logs otherwise. The clinic's reply carries the consent text, sender id and messageId in metadata, and the timeline joins conversations by `caseId`. (Option: ask the consent question in a `[clinic, payer, patient]` group DM so the payer sees it directly.) Change the claim to "only consented fields cross the org boundary over Relay", and keep "synthetic data" on screen.

**M4. The patient participant is undefined, and `createHuman` is not in 14.0.0 [4/6].** No match in `@agent-relay/sdk` or `@relaycast/sdk` typings. The `@relaycast/types` agent enum does include `'human'`. If the clinic sends the consent on the patient's behalf, that is the meat proxy. Putting the patient's `at_live_` (or `rk_live_`) in browser JS or on a projected URL leaks it.
*Fix:* register `patient` through REST `POST /agents` with type `'human'` (or `'agent'` plus a human label in metadata if refused). A small patient-only server route holds the patient token and sends the approve or deny DM when the page POSTs. The browser only ever holds the observer token. Show a "human" sender badge in the timeline. A plain browser tab is fine; phone styling comes last.

**M5. The two LLMs do no visible work, so "real-time AI" and "cross-vendor" read as labels [6/6].** The payer checks policy deterministically, the patient's tap decides the fields and the chart is fixed, so both models only write prose around decisions made in code.
*Fix:* give each model exactly one load-bearing job with a visible artifact, and keep a rule as the guard after it. **Clinic (Claude):** maps the payer's free-text request onto chart fields and flags which are sensitive, which produces the consent prompt; writes the cover sentence. **Payer (OpenAI):** reads the submission against the policy text, names the missing clause and writes the info request and rationale; code then checks the clause and picks the decision. Say this split plainly in the description. Tag every message with `{vendor, model}` in metadata and show it per row. Temperature 0, max_tokens about 300, short fixed prompts, and no other LLM calls. Log prompt hash, latency and raw output beside caseId and messageId.

**M6. There is no shared message contract [3/6].** Five components read `data` and none of the shapes are defined. Producer and consumer mismatches are the most likely integration failure when 2-3 people build in parallel across two vendors. DM threads are also unverified on 14.0.0.
*Fix:* commit one `contract.ts` before splitting work: a Zod discriminated union on `type` (`auth.request`, `auth.info_request`, `consent.ask`, `consent.result`, `auth.info_reply`, `auth.determination`), each with `caseId`, `step`, `v:1` and `refMsgId`. Keep the chart and the 2-clause policy in one fixtures file. Anything that fails parsing is dropped and logged. **`metadata.caseId` is the only correlation key** for bridges, timeline and observer filter. Threads are for display only, so losing DM threads costs only presentation.

**M7. Three records of the same history [5/6].** The Relay thread, a separate timeline and the Terse actor (or SQLite) would each hold state. That brings sync bugs, two portals showing different statuses, and the critique that the app, not Relay, is the source of truth. One actor shared by clinic and payer would also mean the "three orgs" share a database.
*Fix:* **Relay messages for a caseId are the event log.** Every UI pane is a projection over them. State is per org: the clinic owns its case and consent checks (a 10-line in-memory guard), and the payer keeps its handled set. Terse is added only if everything is recorded by about 15:15, and then only as the clinic's own actor consuming the same events.

**M8. The info request and the consent prompt do not match [2/6].** In step 2 the payer asks only for the A1c. In step 3 the patient is asked about a mental-health note that no Relay message requested, and a GLP-1 insurer asking for a psychiatric note looks staged.
*Fix:* the payer's step-2 reply lists both items explicitly: "A1c within 90 days (required) and most recent visit note". The visit note contains mental-health content, and the patient denies it. The consent card quotes and links that exact payer messageId.

**M9. Cross-org is mostly a label [3/6].** One `rk_live_` key, one laptop and one person register all three "orgs" in one workspace, and "insurer closed for the night" is a ctrl-C next to the clinic.
*Fix:* each org runs as a separate process with an env file holding only its own `at_live_` token, and the video shows the three terminals briefly. Better and free: run the payer on a teammate's laptop and close the lid for the offline beat, and say so on camera. In the description, state that a shared hosted workspace stands in for a cross-org network.

**M10. The status ladder is undefined and the judge screen is overloaded [1/6, plus overlap with B5].** "Stored, unread", "seen", "reviewing", "decided", `action.completed` and "chain of custody" blur together. Five panes in a 90-second video watched small means the viewer does not know where to look.
*Fix:* one 5-step ladder used everywhere, each step with one colour, one icon and the Relay field behind it: **Sent** (messageId) → **Stored** (durable delivery / `deliveries`) → **Seen** (`readers.read_at` or ack reaction) → **Info requested / Consented** (typed messages) → **Decided** (determination message). The timeline is the main pane, with a thin raw observer strip under it. Crop the video onto the active pane in each beat.

**M11. No reset, re-take, quota or engine-fallback plan [4/6].** Each take leaves old cases in the workspace. An anonymous workspace may be on plan `trial` (100 messages, ever), and one run is about 20-30 messages. Switching to the local engine (`npx @relaycast/engine`) mid-recording means different tokens, a different observer URL and in-memory idempotency.
*Fix:* make bootstrap one command, `npm run fresh -- --engine=hosted|local`: new workspace, register agents, save tokens, mint the observer token, write the `.env` the UI reads. Run `GET /v1/workspace` → `plan` now. Use one workspace for dev and a fresh one for the final take. Drop status reactions if the budget is tight. Each process writes a timestamped JSONL log with caseId and messageId, so a failed take can be diagnosed.

### Minors (grouped)
- **Agent budget:** clinic, payer and patient use 3 of about 5 slots. Leave headroom; drive the clinic's "Request auth" button through the clinic bridge, not a fifth identity.
- **Jargon:** use "insurer" everywhere a person sees it (the handle stays `payer`). Caption: "Prior authorization: your insurer must approve a prescription before you can fill it." Gloss A1c as "blood-sugar test".
- **Statistic TODO:** decide now; use "Today: fax, portals, phone tag" with no number unless a source is already in hand.
- **Internal names:** remove "Merges Dead Fax and Ferryman", "Ghost Ticket" and "Embargo" from anything judges see.
- **Fallback forks:** settle typed action vs reply, `readers` vs reaction, human registration and state store in the first 30 minutes from the `.d.ts`, and put a thin adapter in front of the UI so later cuts do not touch it.
- **"Awaiting decision...":** show a timeout hint rather than a silent stall.

## Goals vs. Non-Goals

**Goals**
- A complete, real loop over Relay: request → info request → patient consent → consented-field reply → determination, every step a typed message with `caseId:step` keys (B2, M6, M8).
- A real offline beat: the same payer identity reconnects from a saved token, drains in order without duplicates, and shows Stored → Seen → Decided (B3, M1, M2).
- A determination that cannot be lost: a durable thread reply, with the typed action as an optional fast path (B4).
- A timeline that is the observer stream, with per-row verify and a health strip (B5).
- Consent enforced in code and checked against a real message from a human-typed patient identity whose token never reaches the browser (M3, M4).
- One visible, load-bearing job per vendor, tagged on every message (M5).
- Visibly separate org processes, ideally the payer on a second laptop (M9).

**Non-Goals (today)**
- The Terse AuthCase actor, the SQLite actor fallback, or any shared state store across orgs.
- The pharmacy participant and group DM.
- The fax-machine skin beyond a static intro image; phone styling before everything else works.
- `createHuman` (not in 14.0.0).
- A least-privilege beat without verified server-side enforcement.
- Status reactions, if the message budget is tight.
- HIPAA claims, real patient data, or a sourced statistic hunt mid-build.

## Alternatives Weighed

| Decision | Option chosen | Rejected | Why |
| --- | --- | --- | --- |
| Idempotency key | `${caseId}:${step}` | `caseId` | Later sends in a case would be silently dropped (B2) |
| Restart identity | Register once, save tokens, always `reconnect` | Re-register or suffix on each start | Create-only registration; a new identity has an empty inbox (B3) |
| Decision transport | Durable `auth.determination` thread reply; typed action as fast path | `action.completed` only | At most once (#283) and live-only, lost at the restart (B4) |
| Action host | Clinic bridge registers, `availableTo: ['payer']` | Payer registers and invokes itself | Self-invocation proves no authority (B4) |
| Least-privilege beat | Only if a server-side `action.denied` is verified | Scripted local try/catch | A faked refusal is what the founders spot (B4) |
| Timeline source | Observer stream plus `messages.list`, keyed on `caseId` | Local UI events with messageIds attached | Faked traffic (B5) |
| Case transport | DM threads if observer DM scope works; else a private channel per case | Assume DM scope works | An empty feed kills the proof (B5) |
| Overnight cases | Submitted pre-consented | Full info and consent loop | Would stall on a human tap (M2) |
| Outbound chart data | Built in code from consented fields; LLM writes the cover sentence | LLM writes the reply from the full chart | The model can leak the denied note (M3) |
| Patient identity | REST `POST /agents` type `human`, server route holds the token | `createHuman`; token in the browser | Not in 14.0.0; leaks the key (M4) |
| LLM roles | Claude maps request to fields and flags sensitive ones; OpenAI names the clause; rules decide | Prose around scripted decisions | Cross-vendor must be visible (M5) |
| State | Relay is the event log; per-org local guards | Terse actor or SQLite as system of record | Three sources of truth; shared DB undercuts cross-org (M7) |
| Sensitive field | "Most recent visit note" with mental-health content | Psychiatric note for a GLP-1 | Plausible ask, matching Relay message (M8) |
| Cross-org staging | Payer on a teammate's laptop | Three tabs on one laptop | Makes the cross-org and offline claims honest (M9) |

## Key Decisions & Staging for Next Steps

**Decide now (before any code):** 3 identities (`clinic`, `payer`, `patient`); the per-step idempotency keys; `contract.ts` with the six message types; the determination as a thread reply; Relay as the only event log; the LLM split (Claude maps and flags, OpenAI names the clause, rules decide); the pre-consented overnight cases; the payer on a second laptop if a teammate has one; "insurer" in all visible copy; no statistic.

**Staging (time boxes):**
1. **13:00-13:30, spike and gates (one script against pinned 14.0.0).** Read the `.d.ts` for `registerAction`/`availableTo`, `action.denied`, `readers`, `markRead`, `deliveries`, `inbox`. `GET /v1/workspace` → plan. Bootstrap: register 3 agents, save tokens, mint the observer token with DM scopes. Then: DM, reply in thread, confirm both render in a browser observer; stop the payer, send 2 with different `caseId:step` keys, restart with `reconnect`, drain, `markRead`, read `readers`. Record pass or fail in the concept file and freeze the design to what passed. **Gate: DM plus thread round trip and observer DM events by 13:30, otherwise switch to private channels per case.**
2. **13:30-14:30, happy path.** `contract.ts` and fixtures; the clinic bridge (Claude: field mapping and sensitivity flags, code-built consented reply, consent check); the payer bridge (OpenAI: clause naming, rule check, determination reply, handled set); the patient server route plus a plain tab. **Gate: end-to-end happy path by 14:30.**
3. **14:30-15:00, offline beat and screen.** Payer startup order (buffer, drain, sort, dedupe, decide, `markRead`), "queued" from `deliveries`, Seen from `readers`. One page: the timeline built from the observer stream with the 5-step ladder, vendor and model tags, verify click, health strip and the patient tab. Rehearse kill and restart 3 times. **Gate: kill and catch-up works by 15:00.**
4. **15:00-15:15, stretch only if 1-3 pass.** The typed `record_determination` fast path, and the least-privilege beat only if the server-side `action.denied` was verified in step 1.
5. **15:15, freeze and record.** `npm run fresh` on a new workspace, scripted take, payer laptop lid closed for the offline beat. 15:40: write the description (three orgs, two vendors, one human tap, offline catch-up, every row is a Relay messageId, synthetic data, a shared workspace standing in for a cross-org network) and submit before 16:00. For the live final, have the local-engine flag and the recorded clip ready.

**Open items:** whether `availableTo` is enforced server-side on 14.0.0; whether observer DM and group-DM scopes deliver payloads; whether DM threads exist; whether the hosted workspace is `free` or `trial`; whether `POST /agents` accepts type `human`.

## Hackathon verdict

| Dimension | Score (0-10) | Note |
| --- | --- | --- |
| Survives review | 6 | Five blockers, all fixable by design decisions taken now; the problem and the Relay fit were praised by every lens, and all six said proceed-with-changes |
| Feasibility in remaining time | 5 | No code at 13:00 and several APIs unverified; feasible only with the 3-identity MVP, the 13:30 spike and hard gates |
| Video-demo strength | 8 | Patient phone tap, insurer laptop lid closed and reopened, cases draining with Seen timestamps is a clear and human story, if the timeline is visibly Relay-sourced |
| Meaningfulness | 9 | Prior authorization by fax is a real, widely felt pain with three parties and a consent problem; the strongest in the pool |
| Relay prize fit | 8 | Hits cross-vendor, cross-org, a human participant, offline durable delivery, shared history and no meat proxy; it drops if the observer is empty or the refusal is faked |

**Go/no-go:** GO, conditional on freezing the 3-identity MVP now and passing the 13:30 spike (observer shows DM traffic, the payer reconnects with its saved token and drains). If the spike fails on DM scope, switch to private channels per case rather than cutting the observer.

**Top 3 changes that would most improve the idea:**
1. **Cut to the MVP and spike first.** 3 identities (clinic, payer, patient), no Terse, no pharmacy, no fax skin. One 20-minute script against 14.0.0 that registers once, saves tokens, `reconnect`s after a kill, drains with `caseId:step` keys, and confirms that the observer shows DM traffic, before any UI.
2. **Make Relay the only record and make the decision durable.** The determination is a thread reply (typed action optional). The timeline is the observer stream keyed on `caseId`, with verify and a health strip. The payer drains with a handled set and `markRead`, so Stored → Seen → Decided all come from Relay fields.
3. **Make consent and cross-vendor real.** Outbound fields are built in code and checked against a real message from a human-typed patient identity whose token lives on a server route. Claude maps the request to fields and flags the sensitive one, OpenAI names the missing clause and rules decide, with the vendor shown on every row. Run the payer on a second laptop for the offline beat.
