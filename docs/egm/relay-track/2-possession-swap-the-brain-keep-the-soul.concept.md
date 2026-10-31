# Possession: swap the brain, keep the soul

Context: [EVENT_KICKOFF_NOTES.md](../../EVENT_KICKOFF_NOTES.md) | [research/agent-relay.md](../../research/agent-relay.md)

## One line

An agent's identity and working memory live in Agent Relay, not in a model vendor's session. When the Claude-backed brain dies mid-task, an OpenAI-backed brain takes over the same Relay identity, rebuilds its context only from Relay thread history, and carries on; when the Claude brain returns it reads the takeover and stands down instead of duplicating work. Merges Possession and Changeling.

## Problem

Teams run Claude and OpenAI agents side by side, and a task's context is trapped in whichever vendor session started it. A rate limit, outage, cost cap or closed laptop kills the context, and a human re-pastes the transcript into the other tool. Claude Code's native cross-session messaging only connects Claude sessions. The founders list shared history and cross-vendor as Relay's differentiators; Possession makes them the product: the thread is the memory, and no vendor owns it.

## How it works

- **Participants (3, well under the cap):** `scribe` (the possessable identity), `pm` (an OpenAI requester sending 6 numbered requirement messages over about 90 seconds, for example sections of a short incident postmortem), and `charlie` (human, optional). Register once; tokens in `.tokens.json`.
- **Work happens in one `#work` channel thread** under a task root. Every step `scribe` posts carries `data:{taskId, step, brain, epoch}` and `idempotencyKey = taskId:step`. When `scribe` finishes a request it adds a checkmark reaction to that request message: a public, durable 'handled' marker, because storage is not processing.
- **Brain A** is a Node process on Claude: `reconnect` as `scribe`, listen on `'*'`, answer requests 1-3.
- **Possession:** `kill -9` Brain A (a 'simulated Anthropic outage'). `pm` keeps posting requests 4 and 5; they are stored with no reply. Start **Brain B**, a different process on the OpenAI API with empty memory. It reconnects with the same token, calls `messages.list` on the thread (plus `inbox.get` if it exists), skips every request that already carries `scribe`'s checkmark, and posts a lease message: 'Possessed by brain gpt, epoch 2, context rebuilt from 11 messages, last handled <messageId>'. It then answers 4 and 5, continuing Brain A's numbering and template. `pm` never notices.
- **Return and stand down:** restart Brain A. Before acting it reads the latest lease message in the thread. Its epoch (1) is stale, so it reacts with a ghost reaction and exits. Duplicate counter stays at 0. Optionally, it then posts one review note on step 5 as a cross-vendor check before leaving.
- **Judge screen:** the observer stream on the left. On the right, a 'soul card' (same handle, brain badge flipping Claude purple to OpenAI green, a 'context rebuilt from N Relay messages' counter) and a step timeline coloured by brain. Hovering step 4 shows the exact message IDs its prompt was built from.

## Relay features used

- `workspace.reconnect` with one persisted `at_live_` token used by two vendor processes: identity outlives the model.
- Channel thread as shared, cross-vendor memory; `messages.list` to rebuild context.
- Durable delivery while `scribe` has no live process.
- Reactions as the visible checkpoint and lease protocol (checkmark handled, ghost stand down).
- Metadata `data:` carrying step, brain and epoch.
- `idempotencyKey` per `taskId:step`.
- `addListener('*')`, `envelope.from.name`.
- Optional `messages.readers` showing the returning brain read the takeover.
- Observer token on the projector.
- Points at Relayhistory handoffs ('send a pointer, the receiver resumes it') as the productised version, without depending on it.

## Terse use

Bonus only. A `SoulVault` Durable Actor holds `scribe`'s `at_live_` token, the current epoch (a fencing token) and the handled message IDs. Each brain calls `checkout(brain)` at boot; a second live checkout is refused, and a stale-epoch `commitStep` is rejected. That turns the visible reaction protocol into an enforced one. No alarms (the API conflicts between v0.7.9 and `main`); timing lives in Node. Cut it first: the core claim is that Relay history alone is enough to resume.

## Demo beats

Target 90 seconds.

1. 0-10s: Before. A Claude rate-limit error; a human copies a half-finished transcript into ChatGPT and re-explains. Caption: 'your agent's memory is locked to one vendor'.
2. 10-30s: `pm` posts requirements; `scribe` (Claude badge) answers steps 1-3 in the thread, checkmarks appear.
3. 30-42s: `kill -9` Brain A on screen. Requests 4 and 5 arrive with no reply; soul card reads 'no brain, 2 waiting'.
4. 42-65s: Start Brain B (OpenAI badge, empty memory). It pulls 11 messages from Relay, skips the 3 handled items, posts its lease line, answers 4 and 5 in green continuing the same numbering. Hover shows the source message IDs.
5. 65-80s: Restart Brain A. It reads the lease, reacts ghost, exits. Duplicates: 0.
6. 80-90s: One slide: identity is a Relay token, memory is Relay history, checkpoints are reactions, the brain is swappable. Honest limit: a half-generated reply in flight is lost and redone, never resumed, and the swap is triggered by us, not detected by Relay.

## Cut order

1. Terse SoulVault actor.
2. Brain A's review note on return.
3. The hover 'context source' tooltip (keep the colour timeline).
4. Soul-card polish (raw observer plus one status line).
5. The return-and-stand-down beat (end on Brain B finishing).

Never cut: the kill, requests stored while no brain is running, the second-vendor resume under the same handle built only from Relay history, and skipping already-handled items.

## Risks

- **Overlap with Afterlife** (handoff after an agent dies), which is already in the repo. The difference must be explicit: Afterlife centres a Terse lease alarm and failover between agents; Possession keeps one identity across vendors and uses Relay history, not an actor ledger, as the only checkpoint. If the team builds Afterlife, skip this.
- **Two processes on one token.** If Brain A and B are briefly live together, both may receive events. The returning brain must read the lease before acting; spike token reuse in the first 15 minutes.
- **API drift:** confirm `messages.list` with a thread filter and reactions on 14.0.0; fall back to REST history. DM readback returns `kind:'channel'` (#1987), so don't branch on it.
- **Originality vs the popular 'Claude writes, Codex reviews' post.** Lead with outage failover and identity, not write-then-review.
- **Not cross-person.** Mitigation: run `pm` on a teammate's laptop.
- **LLM continuity:** strict step template, short numbered requests, temperature 0.

## Source grounding

- `docs/research/agent-relay.md`: 'Strategic edge' (v2.1.224 covers same-user Claude messaging; cross-vendor, shared history and offline durability still differentiate Relay); founders' 'no meat proxy'; gotchas 4 (create-only registration, persist and reconnect), 5 (`'*'`), 6 (`envelope.from.name`), 8 (`queued_unconfirmed` is enqueue only).
- External `docs/technologies/agent-relay.md`: `messages.list` / `inbox.get` / `readers`, `idempotencyKey`, reactions; 'durable does not mean an LLM has processed it', hence checkmarks as the processed marker; 'read state is evidence a message was seen, but your product needs its own definition of completion', hence the explicit lease.
- Prep notes section 4: adopt-and-rotate re-registration can silently invalidate tokens, so never re-register.
- `/docs/relayhistory/handoffs` (from `research/relay-docs-index.json`): founders' own interest in session handoff.
- Brief section 1.6 vs external `durable-actors.md`: alarm API conflict, so no alarms.
