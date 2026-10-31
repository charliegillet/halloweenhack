# Dead Fax: prior authorization settled between a clinic's agent and an insurer's agent, with the patient's consent

> Context: [EVENT_KICKOFF_NOTES.md](/Users/charlie/.t3/projects/halloweenhack/docs/EVENT_KICKOFF_NOTES.md) · [research/agent-relay.md](/Users/charlie/.t3/projects/halloweenhack/docs/research/agent-relay.md)

## One line

A clinic's Claude agent and an insurer's OpenAI agent settle a (synthetic) prior-authorization request directly over Agent Relay, including the 'send more information' loop, a patient human who approves the one sensitive field shared, an insurer that is offline overnight and catches up, and a decision only the insurer's identity can record. Merges Dead Fax and Ferryman.

## Problem

Prior authorization and specialist referrals between independent organizations still run on fax, portals and phone tag. Clinic staff copy chart notes into insurer portals, the insurer asks for more information, and the patient waits days and calls both sides asking 'did you get it?'. Three parties in three organizations, each with its own systems and increasingly its own AI, and no shared channel with guaranteed delivery, proof of receipt, per-field consent, or a clear authority boundary. The nurse and the patient are the meat proxies. This is the most meaningful problem in the pool for the 'meaningfulness' criterion.

## How it works

- **Participants (4):** `clinic` (Claude, reads a synthetic FHIR-ish chart), `payer` (OpenAI, reads a 2-clause synthetic policy, e.g. 'GLP-1 requires BMI >= 30 or documented metformin failure, plus A1c within 90 days'), `patient` (human participant on a phone-sized web page), `pharmacy` (optional, notified on approval). Each org's process holds only its own token.
- **Flow, all in one case thread with `caseId`:**
  1. A clinic user clicks 'Request auth'. `clinic` DMs `payer` a structured request (`data:{caseId, drug, fieldsShared}`, `idempotencyKey = caseId`).
  2. `payer` checks policy deterministically, then replies in thread: 'Policy GLP1-4 requires A1c within 90 days; not provided.'
  3. The chart has the A1c plus a sensitive psychiatric note the payer's template also requests. `clinic` DMs the `patient` participant: 'Insurer requests A1c (routine) and mental-health note. Share?' The patient taps approve on A1c, deny on the note.
  4. `clinic` replies in thread with only the consented field and a `consentMsgId` reference. The chart never leaves the clinic except for consented fields.
  5. `payer` records the decision with the typed action `record_determination({caseId, decision, policyClause, rationale})`, registered with `availableTo: ['payer']`. The clinic UI advances on `action.completed`. On approval, a group DM `[clinic, pharmacy]` goes out.
- **Offline beat:** the payer process is stopped ('insurer closed for the night'). The clinic files two more cases; they show 'stored, unread'. Restart: payer reconnects, drains `inbox.get` / `messages.list`, resolves both in order; `messages.readers` shows 'seen by payer 13:42'.
- **Least-privilege beat:** the clinic agent tries to call `record_determination` itself and is rejected.
- **Judge screen:** clinic portal left, insurer queue right, patient phone inset, a 'chain of custody' timeline (sent, seen, info requested, consented, decided), each event linked to a real Relay `messageId`, and the observer stream underneath. Skin: a haunted fax machine that stops printing once Relay takes over.

## Relay features used

- DMs and one thread per case; `messageId` ties every reply to the request.
- Human participant (`createHuman` if present in the 14.0.0 types, else a human-labelled registration driven only by the phone page) for consent: first-class sender, not a proxy.
- Message metadata for structured request, consent and determination records.
- Typed `record_determination` with Zod and `availableTo: ['payer']`; `action.completed` to advance the clinic.
- Durable per-recipient delivery to the stopped payer; `inbox.get`, `markRead`, `messages.readers` as the anti-fax receipt.
- Reactions as status (reviewing, approved); group DM to the pharmacy.
- `idempotencyKey = caseId` so a retry never files twice.
- `addListener('*')` for `dm.received` / `group_dm.received`.
- Observer token with DM and group-DM scopes.
- Cross-org (three orgs, each with only its own token) and cross-vendor.

## Terse use

Bonus only. One `AuthCase` Durable Actor per caseId is the system of record: state machine submitted, info_requested, consented, determined; the consent ledger (which fields, which approving messageId); handled message IDs. The bridge holds listeners and calls `authCase.apply(event)`. The actor rejects out-of-order transitions and any field share without a consent record, which makes 'the model proposes, rules decide' concrete. `@Atomic`, reassign arrays. Fallback: SQLite in the clinic bridge.

## Demo beats

Target 90 seconds.

1. 0-12s: Before. A fax cover sheet, a nurse retyping chart notes into a portal, a patient on hold. Caption: 'days of this, per prescription' (use a sourced statistic or none).
2. 12-30s: Click Request. The observer shows clinic's DM to payer; payer asks for the A1c in thread.
3. 30-45s: The patient's phone lights up: approve A1c, deny the mental-health note. The clinic sends only the A1c.
4. 45-55s: `record_determination` fires; both portals go green with the policy clause cited; pharmacy is notified.
5. 55-75s: Kill the payer ('insurer closed overnight'). File two cases: stored, unread. Restart: both resolve, 'seen by payer' timestamps appear.
6. 75-90s: The clinic agent tries to approve its own request and is refused by `availableTo`. Close: 'Three orgs, two vendors, one patient tap, zero fax. Every message is real Relay traffic.' Honest limit: seen is not decided; decision is a separate typed action. Synthetic data only.

## Cut order

1. Pharmacy group DM.
2. Terse AuthCase actor.
3. `availableTo` rejection beat.
4. Patient phone page (patient participant in a third browser tab).
5. Typed action (decision as a structured thread reply).
6. Second vendor (OpenAI for both orgs).

Never cut: the info-request loop, the patient consent tap, kill and catch-up, the observer feed.

## Risks

- **Healthcare framing.** Synthetic data only, said on screen; no HIPAA claims; pitch as a delivery, consent and authority layer.
- **Offline catch-up unverified.** 15-minute spike first; explicit `inbox.get` / `messages.list` drain on startup as fallback.
- **API drift:** `availableTo`, `createHuman`, `messages.readers`, `inbox.get` unverified on 14.0.0. Check the `.d.ts`; if readers is missing, derive 'seen' from an explicit acknowledgement reaction.
- **Overlap with Ghost Ticket** (cross-org agents in a loop). The difference is an authority boundary plus third-party consent converging on a decision, not joint debugging. Also distinct from Embargo: one request-decision loop, not one-to-many notice.
- **Observer scope:** without DM scope the feed is empty; mint and test early.
- **LLM drift:** 2-clause policy, fixed chart, temperature 0.

## Source grounding

- `docs/research/agent-relay.md`: founders want cross-vendor, cross-org, offline durable delivery ('an offline agent catching up from durable messages'), no faked messages, observer on the projector, 'Don't be a meat proxy'.
- External `docs/technologies/agent-relay.md`: `availableTo`, `action.completed`, `messages.readers` / `inbox.get` / `markRead`, observer scopes, credential table (`rk_live_` server-side only), 'a message becoming durable does not mean an LLM has processed it' (hence seen vs decided).
- `/docs/orchestrating-with-actions`: task by message, result by typed action. `/docs/dms`: targeted assignments and private sidebars; group DM via handle array. `/docs/migration`: `createHuman`.
- External `actor-primer.md`: 'A delivered message does not prove the receiver committed a state change'; `integration-architecture.md`: app-generated caseId, apply once.
- Gotchas: create-only registration, `'*'` listener, 5-agent cap, at-most-once actions (#283).
