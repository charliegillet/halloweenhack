# Blood Pact: two people's agents strike a deal while each side's limits stay private

> Context: [EVENT_KICKOFF_NOTES.md](/Users/charlie/.t3/projects/halloweenhack/docs/EVENT_KICKOFF_NOTES.md) | [research/agent-relay.md](/Users/charlie/.t3/projects/halloweenhack/docs/research/agent-relay.md)

## One-line

Two people on two laptops each run their own agent from a different vendor (buyer on Claude, vendor on OpenAI). The agents negotiate a small, real deal over Agent Relay without either side's walk-away limits ever crossing the wire, escalate only out-of-authority asks to their own human, keep going while one side is offline, and seal the deal only when both humans react on the same message. Merges Familiars, both Blood Pacts, Planchette and Dead Drop.

## Problem

Any agreement between two people or two companies (a pilot SOW, freelance terms, a meeting plus cost split) still runs as email ping-pong, where a human copies one assistant's output into another. The Relay founders call this the 'meat proxy'. They name 'two different people's agents negotiating' as a demo they want, and it is exactly what Claude Code v2.1.224's same-user cross-machine messaging cannot do: two owners, two vendors, two machines. Each side already has an AI and a private playbook (budget cap, floor price, must-have clauses). What doesn't exist is a shared, durable, auditable channel where the two agents negotiate directly and each human keeps the veto.

## How it works

- **Participants (4 of the 5-agent cap):** `buyeragent` (Claude), `vendoragent` (OpenAI), `buyerhuman`, `vendorhuman`. No hyphens. A seed script on the organiser laptop holds `rk_live_`, registers all four once, and writes each side's two `at_live_` tokens to a separate file. Laptop A gets only the buyer tokens and laptop B only the vendor tokens, so least privilege is real. Every process then calls `workspace.reconnect({apiToken})` and never registers again.
- **The deal:** a fixed 3-term pilot SOW: price, start date, auto-renew. Each laptop has a local `playbook.json` with hard bounds (buyer: cap $40k, net-30, no auto-renew without an opt-out; vendor: floor $35k, wants auto-renew). The playbook never goes over Relay.
- **Negotiation in a channel thread:** `#deal`, one root message per deal. Each proposal is a threaded reply with `data:{dealId, term, rev, value}` and human-readable text, sent with `idempotencyKey = dealId:term:rev`. Using a channel instead of a DM sidesteps the observer DM-scope risk.
- **Rules decide, the model drafts:** a deterministic check in code decides whether an offer is inside the playbook, and the LLM only drafts text and picks values within the allowed range. Max 3 rounds per term; on round 3 the agent must escalate.
- **Escalation to its own human, never the counterparty:** when the other side asks for something outside authority (auto-renew), the agent DMs its own human participant: 'Vendor wants auto-renew. Outside playbook. Counter with 60-day opt-out?' The human answers with an approve or reject reaction, or a reply in a small web page that posts as `buyerhuman`. The human decides; they never relay text.
- **Offline beat:** vendor laptop lid closes (process killed). The buyer agent posts its final offer and the escalation for `vendorhuman` waits. On reopen, the vendor process reconnects with the same token and drains via `messages.list` on the deal thread (history, always safe) plus `inbox.get` if it exists on 14.0.0, answers only the latest rev, and dedupes by `term:rev`.
- **Seal:** each agent posts 'ready to sign rev N'. Each side's bridge checks that both `buyerhuman` and `vendorhuman` reacted with the handshake reaction on that same `messageId`, then posts 'SEALED' with the final terms.
- **Judge screen:** the raw observer stream (`ot_live_` with `stream:read`, `messages:read`, `threads:read` and DM scope) on the left. On the right, a contract parchment whose clauses fill and turn from red ink to signed as metadata arrives, every line linked to its Relay `messageId` and `from.name`. At the end, a 'never revealed' panel reads both local playbooks: $35k floor, $40k cap, closed at $38k, neither number ever appeared in the stream.

## Relay features used

- `@agent-relay/sdk@14.0.0` with register-once, `reconnect({apiToken})`, per-side `at_live_` tokens and `rk_live_` kept on the organiser laptop only.
- Channel `#deal` with a threaded `reply` per proposal; `messageId` ties every counter and signature to the exact proposal.
- Message metadata (`data:`) as the structured term sheet, so the UI never parses prose.
- Agent-to-own-human DMs for escalation; human participants (`createHuman` if in the 14.0.0 types, else a normal registration named `buyerhuman`).
- Reactions as approval and signature state.
- `idempotencyKey` per `dealId:term:rev`.
- `addListener('*')` (DMs arrive as `dm.received`); `envelope.from.name`.
- Durable per-recipient delivery plus `messages.list` / `inbox.get` for offline catch-up; optional `messages.readers` 'seen by counterparty' ticks.
- Observer token with message, thread and DM scopes on the projector.
- Cross-person, cross-vendor and cross-machine are all load-bearing.

## Terse use

Bonus, about 30 minutes, cut first. One `DealRoom` Durable Actor per dealId on the organiser laptop holds the authoritative term-sheet revisions, per-term status (open / agreed / escalated), the two signatures and the set of handled `messageId`s. The Node bridge holds the Relay listener (actors can't) and calls `dealRoom.apply(msg)`. The actor rejects a non-monotonic rev or a signature from the wrong human, which answers the 'just a communication layer' critique. Use `@Atomic` on `apply` and reassign persisted arrays instead of pushing. If Bun or durable-actors setup runs past 30 minutes, keep the same state in bridge memory or SQLite.

## Demo beats

Target 90 seconds.

1. 0-12s: Before. A person pastes a redline from Claude into an email, then pastes the reply from ChatGPT back. Caption: 'you are the meat proxy'.
2. 12-35s: Two laptops labelled 'Acme (buyer, Claude)' and 'Spectral SaaS (vendor, OpenAI)'. Hit Start. Real proposals stream on the observer; parchment clauses fill in for price and start date.
3. 35-50s: The vendor asks for auto-renew. The buyer agent DMs `buyerhuman` instead of conceding. Person 1 taps reject; the agent counters with a 60-day opt-out.
4. 50-70s: Person 2 closes the vendor laptop lid. The buyer's final offer lands and sits in the thread, unread. Reopen: the vendor reconnects with the same token, drains the thread, answers only rev 7. Caption: 'durably stored, delivered on reconnect'.
5. 70-85s: Both humans tap the handshake reaction on rev 7 on their own laptops. SEALED. The 'never revealed' panel shows $35k floor and $40k cap, closed at $38k.
6. 85-90s: 'Two people, two vendors, two machines. Nobody copied a word.' Honest limit: read state is not agreement; agreement is defined as two human reactions.

## Cut order

1. Terse DealRoom actor (bridge memory or SQLite).
2. `messages.readers` 'seen' ticks.
3. Parchment animation polish (plain clause table).
4. Human participants as Relay identities (the humans approve in the web UI, which posts as the agent with a 'approved by Alice' tag, said honestly).
5. Second laptop (two processes with separate token files on one machine, said honestly).
6. Second vendor (two OpenAI personas).

Never cut: two agents negotiating over real visible Relay traffic, private limits that never cross the wire, the offline catch-up beat, and the reaction-based seal.

## Risks

- **Unverified offline catch-up.** Nobody has checked whether a reconnecting 14.0.0 listener receives messages queued while it was down. Spike in the first 15 minutes with two bare processes and no LLM. The design already drains from `messages.list` on the thread, so it does not depend on listener replay.
- **LLM convergence.** Three terms, hard numeric bounds, deterministic accept rule, 3 rounds per term, temperature 0, constraints with exactly one overlapping zone. Pre-run 3 takes.
- **API drift.** `createHuman`, `inbox.get` and `messages.readers` come from docs that may describe post-14.0.0 surfaces. Check the installed `.d.ts` first.
- **Toy-ness.** 'Two chatbots haggling' is the critique. Counter with the authority boundary, the human escalation and the never-revealed panel.
- **Overlap with Ghost Ticket's two-org framing.** This is negotiation with private reservation values converging on a signed artifact, not debugging.
- **Venue Wi-Fi.** The local-engine fallback (`RELAY_BASE_URL` / `baseUrl` to `:8787`) needs both laptops on one LAN, or fall back to one machine.
- **Legal framing.** Pitch as deal terms with human sign-off, not legal advice.

## Source grounding

- `docs/research/agent-relay.md` 'What matters' item 5: founders want 'two different people's agents negotiating', cross-vendor, no human copy-paste, observer URL; 'Don't be a meat proxy' launch pitch; section 1 'Strategic edge' (Claude Code v2.1.224 covers same-user cross-machine only).
- Gotchas: create-only registration on 14.0.0 (persist `at_live_`, reconnect), `'*'` for `dm.received`, `envelope.from.name`, no hyphens (#1466), 5-agent cap, `queued_unconfirmed` counts as success.
- External `docs/technologies/agent-relay.md`: metadata `data:`, `messageId` for replies and reactions, `idempotencyKey`, `inbox.get` / `messages.readers`, observer scopes (`stream:read` alone shows no payloads; DMs need a DM scope), credential table (`rk_live_` server-side only).
- `/docs/migration`: `createHuman`, 'humans post as first-class participants instead of acting as a meat proxy'. `/docs/emoji-reactions`: reactions as approval. `/docs/delivery`: durable is not processed.
- External `actor-primer.md`: 'a model proposes an action; application rules decide whether to apply it'. `integration-architecture.md`: stable app IDs, apply once.
- Relay Connect's isolated room per deal as the template for the deal-room workspace.
