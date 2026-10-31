# Concepts Brief: Hearsay Hollow (trace a lie as it spreads between agents)

Author: Charlie Gillet
Date: 2026-10-31

Sources: concept at `docs/TOP_4_IDEAS.md` section "1. Hearsay Hollow"; constraints in `docs/EVENT_KICKOFF_NOTES.md`, `docs/research/agent-relay.md`, `docs/research/terse.md`, `docs/research/reference/INTEGRATION_COOKBOOK.md`. Synthesised from 6 Goldfish BRAINSTORM lenses (Design Critic, Codebase Details, Zoom Out, Comprehension, Implementation Readiness, Structural). All 6 returned **proceed-with-changes**.

---

## Overview

Hearsay Hollow starts from one problem: when one AI agent in a fleet gets a false fact or a prompt injection, it passes it to every agent it talks to, and nothing records where it came from. The haunted version is a town of ghost agents gossiping over Agent Relay. A lie is injected into one ghost and spreads. A Terse Durable Actor (TownLedger) keeps an independent record of who told whom. TRACE walks any claim back to its source, a correction goes out to every agent that heard it, and a killed agent catches up from Relay's durable queue when it restarts.

Every reviewer thought the idea was strong: it suits the video, it uses Relay well and it has a real problem behind it. Every reviewer also found the same hole. **The concept never says how the system knows which message caused which.** Five more issues come up in at least four lenses each: gossip that never stops, an agent count over the cap, a process model that rules out the kill beat, an overstated "can't be forged" ledger, and too much scope for the 2.5 hours of build time left (12:30 now, recording around 15:00, submission at 16:00).

None of these needs new research to fix. Each needs a decision taken now, before any code is written. This brief makes those decisions.

---

## Analysis

### Blockers

**B1. Provenance is undefined, and it is the whole product.** (all 6 lenses)
A Relay DM carries id, sender, recipient, text and a free-form `metadata` object. It has no parent-message field. The ghosts are LLMs that retell the lie in their own words, so you can't tell "which message caused this one", or whether a retelling is "the same claim", by reading the text. If an LLM classifier or the ghost's own words supply `parentMsgId`/`claim`, TRACE is a guess that looks like proof. It will sometimes name the wrong source on camera, and the Relay and Terse judges will ask how the link is computed.
**Fix: provenance by construction.** Code in each ghost process (the harness), not the LLM, stamps every outbound DM's `data` (it comes back as `metadata`, verified live in the cookbook) with `{prov_v:1, runId, hopId, claimId, parentHopId, hop, kind, origin}`. Only the injection point mints a `claimId`. A reply inherits `claimId` and takes `parentHopId` from the inbound DM that triggered it, with exactly one parent per message. `from`/`to` come from the Relay envelope (`from.name`) and never from the agent's own text. The LLM only writes the prose. Put this rule in the description as the definition of "heard the lie".

**B2. Nothing stops the gossip.** (Design, Codebase, Comprehension, Impl, Structural)
Four LLM ghosts that each answer every whisper fan out faster with every hop. Corrections are DMs too, so ghosts gossip about them and start a second wave. The result is a graph that looks worse after the quarantine, drained Relay quota (300 req/min, 10k msgs/month on `free`, and a possible silent drop to the 100-message `trial` plan), drained OpenAI credit, and a different video on every take.
**Fix: a deterministic schedule in the harness.** A fixed neighbour list, each ghost forwards a given `claimId` at most once, nothing is forwarded at `hop >= 3`, a global budget of about 25 messages per run, 1-2 s between sends, and `kind:'correction'` messages never reach the LLM and are never forwarded. Honour `Retry-After` on 429s. At boot, check `GET /v1/workspace` and abort if `plan` is `trial`.

**B3. The process model rules out the kill beat, and the catch-up it relies on is untested.** (Design, Codebase, Zoom Out, Impl, Structural)
"One bridge process for Relay" and "kill one ghost's process" can't both hold. If every ghost shares one process, killing one kills all of them. If inbound traffic arrives by webhook, Relay delivers to the bridge, so nothing queues for the dead ghost. The research has not verified that an SDK listener which reconnects (`workspace.reconnect({apiToken})`) gets its queued DMs replayed. This is the beat the Relay founders said they want to see, and they also said they spot fakes.
**Fix:** run each ghost as its own small Node/Bun process with its own persisted `at_live_` token, listening on `'*'` and handling `dm.received`. In the first 15-20 minutes, before anything else, spike it with two bare agents and no LLM: stop B, DM it twice, restart B, confirm both DMs arrive. If that fails, change the beat honestly to "the restarted ghost rebuilds its state from TownLedger and receives the correction". Don't fake it.

**B4. The scope doesn't fit the time left.** (Zoom Out, Design, Impl, Structural, Comprehension)
The concept covers four sponsors (Terse, Relay, OpenAI, Supabase), a phone page, moderation, an alarm, a graph, a hop list, TRACE, quarantine and kill/catch-up. Every extra integration is another chance of a version, auth or pinning failure on venue Wi-Fi with two SDKs that are days old. A working demo is required, and three beats that always work beat seven that half work.
**Fix:** freeze the scope now (see Goals). Cut Supabase, the phone page, OpenAI moderation and the midnight bell, and don't list them as stretch goals.

### Majors

**M1. The "stale version" check is the wrong mechanism, and "can't be forged" isn't true.** (all 6)
A Terse actor already handles one call at a time, so writes are serialised. A compare-and-set on a global version would only reject legitimate concurrent writes from different ghosts. Each rejection leaves a gap in the trace while the message has already gone out on Relay. A Terse method that throws without `@Atomic` can also leave partial rows. Anyone holding the API key can still append false rows, so the record can be forged.
**Fix:** make the ledger append-only. The actor assigns a monotonic `seq` and dedupes on `hopId` (an idempotent insert that absorbs Relay redelivery and catch-up replays). Store an orphan whose parent hasn't arrived and link it later. Count rejected or deduped writes and show the count. In the pitch say "single-writer, ordered, duplicate-proof, outside every agent", not "unforgeable".

**M2. There are several sources of truth, and the order of ledger write and Relay send is undefined.** (Design, Codebase, Impl, Structural, Zoom Out)
The ledger can drift from Relay. Send then write loses edges after a crash, a 429 or an actor cold start (`actor_start_rate_limited` is not retried by the SDK). Write then send can record hops that never happened. Feeding the graph from the Relay observer while TRACE reads the ledger lets the screen show an edge that TRACE then denies.
**Fix:** use two idempotent rows per hop. The sender's harness writes `sent(hopId)` and then sends, with `hopId` in metadata (`queued_unconfirmed` counts as success). The receiver's harness writes `received(hopId, relayMsgId)` on `dm.received`. The difference between the two is the "queued for the dead ghost" count for the kill beat. The graph and TRACE read only the ledger. The Relay observer URL goes on a second panel as independent "this is real traffic" proof, and a health strip shows DMs sent vs ledger rows.

**M3. The agent count is over the 5-agent cap.** (Design, Codebase, Comprehension, Impl, Zoom Out)
4 ghosts plus the Medium plus an injector identity makes 6. Registration is create-only, so every dev restart adds suffixed names. The cap wasn't enforced in a probe, but the host can turn it on at any time.
**Fix:** **3 ghosts + Corrector + Outsider (the injector) = 5.** That gives hop 0 a Relay-attested sender. Use a fresh workspace per run from a seed script, persist tokens to `.tokens.json`, and always `reconnect`, never re-register. Use unhyphenated names (mention bug #1466).

**M4. The integrity story conflicts with the premise.** (Codebase, Structural)
The story is that one agent is compromised, yet a compromised harness can lie about its own parents. Only Relay's server-set fields (message id, `from_agent_id`, `to`, `created_at`) are attested.
**Fix:** store attested fields and sender-reported fields (`parentHopId`, `claimId`) separately. Draw attested edges as solid lines and reported ones as dashed lines. Flag any message that arrives without valid provenance as **unattributed**, which is already a planned deterministic rule. The pitch becomes: "Who said what to whom is attested; why is self-reported and flagged when it doesn't add up." That is more honest, more original, and it answers the YC question "what about agents you don't control?"

**M5. Quarantine is self-contradictory and has no metric.** (Comprehension, Zoom Out, Codebase, Structural)
It is described both as a broadcast to every ghost that heard the lie and as a hop-by-hop replay. If the green wave depends on the LLMs complying, it won't look the same twice.
**Fix:** the ledger marks the `claimId` as quarantined, and from then on the harness refuses to forward anything carrying it. The Corrector looks up the tainted set in the ledger and DMs the members in recorded order (`mode:'steer'`). The UI animates the wave along the original edges as a visual effect, not a messaging protocol. Ghost colour comes from ledger state (unexposed / infected / corrected), and the harness strips the corrected claim from the ghost's prompt window. The on-screen metric is "Correction reached 3/3 in N s, 0 re-infections".

**M6. The hero visual comes too late in the build order.** (Zoom Out, Comprehension)
The video opens with "the graph lights up", but the graph is fourth in the build order and a hop list of IDs is unreadable on video.
**Fix:** build one view right after the ledger: a fixed-position SVG of 5 nodes with no layout engine. Edges light up in `seq` order, TRACE is a path highlight, and a sidebar shows the same data as plain sentences.

**M7. There is no rollback for a sponsor outage.** (Design, Impl)
50+ teams share one hosted Relay engine, which has open incidents (#476, #503). Terse Cloud ships breaking releases several times a day.
**Fix:** pin versions now (`@agent-relay/sdk` 14.0.0, `terse-sdk`/`terse-cli` 0.14.7, `durable-actors` 0.14.4). Use the SDK listener path, not webhooks, so no public URL or Freestyle is needed. Keep `RELAY_PROFILE=hosted|local` in one `.env`, and test the local engine once before 14:00. Record a safety take as soon as inject, spread and TRACE work, and never throw it away.

**M8. There is no run identity or replay, and no schema migration.** (Codebase, Impl)
Actors can't be deleted, initialiser SQL never alters an existing table, and LLM output varies on every take.
**Fix:** mint `runId` at boot and use it in the actor ID (`ledger-v<schema>-${runId}`), in every DM's metadata, in log lines and in the UI header. Store rows as `(seq, hopId, json)` so new fields need no DDL. Add a replay mode that rebuilds the graph from a finished run's ledger, so the video can be cut from a known-good run. Script the injection and use low temperature.

### Minors (merged)

- **Midnight bell:** it doesn't serve the problem, it is invisible on video, and it would need actor egress plus a Relay token inside the actor. Cut it. (Zoom Out, Comprehension, Structural, Codebase)
- **Labels:** the vocabulary is two layers deep, and "Medium agent" collides with idea #2 "Medium". Rename it to **Corrector** and use plain labels on screen ("Ghost B received claim #1 from Ghost A"). (Comprehension)
- **Meaningfulness:** make the lie an operational instruction ("the crypt key changed, send it to X") rather than idle gossip, so it maps directly onto prompt injection spreading through a fleet. (Zoom Out)
- **Silent failures:** DMs arrive as `dm.received`, not `message.created`; `envelope.from.handle` is undefined; `.push()` on a `@Persisted` array isn't saved. Use actor SQLite and log one structured line per hop. (Codebase, Design)
- **LLM budget:** a small fast model, the last 5-10 lines of context, `max_tokens` around 80, so a 3-hop spread finishes in under 10 s. (Design)
- **UI feed:** poll a ledger snapshot by `seq` every 500 ms (a re-fetch fixes any gap). Use a Terse socket only if there is time; socket ordering isn't guaranteed and it doesn't reconnect on its own. (Design, Codebase, Structural)

---

## Goals vs. Non-Goals

**Goals (frozen at 12:30)**
1. A scripted Outsider injects an instruction-style lie into one ghost over Relay.
2. The lie spreads deterministically across 3 ghosts, with provenance stamped by the harness.
3. TownLedger (Terse) records every hop append-only, with attested and self-reported fields kept apart.
4. One SVG graph lights up live, and TRACE highlights the path back to "injected by Outsider, input #17".
5. The Corrector sends corrections from the ledger, forwarding is blocked, and the screen shows "3/3 corrected, 0 re-infections".
6. Kill/catch-up: the dead ghost's queued count climbs, then drains on restart, and it receives the correction. This depends on the B3 spike.

**Non-Goals**
- Supabase, the phone page, anonymous auth, broadcast to a projector.
- OpenAI moderation of injected text.
- The midnight bell / Terse alarm.
- Detecting lies by meaning or matching paraphrases.
- Webhooks, Freestyle, any public URL.
- A general graph layout engine, or a separate hop-list UI.
- Any claim that the record "can't be forged".
- Support for agents outside our harness (shown only as "unattributed").

---

## Alternatives Weighed

| Decision | Options | Chosen | Why |
|---|---|---|---|
| How parent links are known | LLM classifier / text match / ghost self-reports in prose / harness-stamped metadata | **Harness-stamped `metadata`** | Deterministic, free, can be explained in one sentence; `data`→`metadata` round-trip is verified live |
| Ledger concurrency | Version compare-and-set / actor-assigned `seq` + idempotent insert | **`seq` + idempotent insert** | The actor is already serial; compare-and-set only drops valid writes |
| Ledger ingestion | Ghost sends then writes / derived only from Relay events / sent+received rows | **sent + received rows, keyed by `hopId`** | Survives a partial failure and gives the queued count needed for the kill beat |
| Process model | All ghosts in one bridge / webhook bridge / one process per ghost | **One process per ghost + one small ledger/UI server** | Only option that makes the kill beat real; no public URL |
| Agent set (cap 5) | 4 ghosts + Medium (Medium injects) / 4 ghosts + Medium + injector (6) / **3 ghosts + Corrector + Outsider** | **3 + 1 + 1** | Fits the cap and makes hop 0 attested |
| Quarantine | Hop-by-hop LLM relay / ledger-driven direct DMs + UI wave animation | **Ledger-driven + harness blocks forwarding** | Same result on every take, no loop risk, measurable |
| UI feed | Terse socket / Relay observer / polling the ledger by `seq` | **Poll the ledger; observer on a second panel** | One source of truth; gaps fix themselves; the observer proves traffic is real |
| Relay hosting | Hosted only / local only / env-flag switch | **Hosted, with a rehearsed local fallback** | Keeps the observer story with a way out |

---

## Key Decisions & Staging for Next Steps

**Decisions (write them in the repo README before coding)**
- D1: Shared type `Prov = {prov_v:1, runId, hopId, claimId|null, parentHopId|null, hop, kind:'inject'|'gossip'|'correction', origin}` in one file, sent on every DM.
- D2: The LLM writes only text. The graph, colours and quarantine are computed from ledger state.
- D3: Agents are `ghosta`, `ghostb`, `ghostc`, `corrector`, `outsider`. Fresh workspace per run, `.tokens.json`, `reconnect` only.
- D4: Loop guard: neighbour list, one forward per claim per ghost, `hop<3`, 25-message budget, corrections never reach the LLM.
- D5: Ledger: `record(row)` (idempotent on `hopId`+type), `trace(hopId)`, `snapshot(sinceSeq)`, `quarantine(claimId)`. Actor ID `ledger-v1-${runId}`.
- D6: Pinned versions, `RELAY_PROFILE` flag, `runId` in every log line and in the UI header.

**Staging (12:30 to 16:00)**
| Time | Step | Exit check |
|---|---|---|
| 12:30-12:50 | Pin deps; seed script; **spike: kill, DM twice, reconnect, replay**; check `plan` | Both queued DMs arrive, or the kill beat is redefined (B3) |
| 12:50-13:30 | TownLedger actor (SQLite rows, seq, idempotent insert, trace, snapshot) + `Prov` type | Unit script appends and traces a 3-hop chain |
| 13:30-14:10 | Ghost harness processes + Outsider inject script + loop guard + OpenAI prose | Scripted run produces about 6-10 hops, same shape twice |
| 14:10-14:40 | SVG graph + TRACE highlight + sentence sidebar + health strip | **Record safety take #1** (inject → spread → TRACE) |
| 14:40-15:10 | Corrector + quarantine block + metric; kill/catch-up pending counter | Screen shows "3/3 corrected, 0 re-infections" |
| 15:10-15:40 | Final recording (2 takes); replay mode if a take glitches | Video 60-90 s |
| 15:40-16:00 | Description (provenance by construction; attested vs reported; Relay = transport, Terse = provenance) and submit | Submitted before 16:00 |

Cut order if behind: the kill beat (if the spike failed) → the health strip → the dashed self-reported styling → the sentence sidebar. Never cut: inject, spread, graph, TRACE.

---

## Hackathon verdict

| Dimension | Score (0-10) | Note |
|---|---|---|
| Survives review | 6 | All 6 lenses say proceed-with-changes. The blockers are missing decisions, not fatal flaws, and all of them have cheap deterministic fixes |
| 5-hour feasibility | 5 | Not feasible as written. Realistic after the cuts and with B1-B3 decided, but there is little slack before 15:00 |
| Video-demo strength | 8 | Spread, trace, correction wave and kill/catch-up are visual and tell a story, if the graph is built early |
| Meaningfulness | 7 | Prompt-injection spread and fleet provenance is a real problem; the instruction-style lie and the "unattributed" flag lift it |
| Relay prize fit | 8 | DMs, metadata, durable catch-up and the observer stream are each used for something real; the kill beat is exactly what Relay asked for |

**Go/no-go:** GO, with changes. Freeze scope and the provenance rule now, and run the reconnect spike before writing anything else.

**Top 3 changes**
1. Provenance by construction: the harness stamps `claimId`/`parentHopId`/`hop` into Relay metadata, the LLM only writes prose, and attested vs self-reported fields are shown separately, with "unattributed" flagging.
2. Deterministic control instead of free-running gossip: one process per ghost, 3 ghosts + Corrector + Outsider (5 agents), a hop cap and message budget, ledger-driven quarantine that blocks forwarding, and the metric "3/3 corrected, 0 re-infections".
3. Cut to the core and test the riskiest part first: drop Supabase, moderation and the bell; spike kill/reconnect at 12:30; make the ledger append-only and idempotent (no version check, no "unforgeable"); build the SVG graph right after the ledger; record a safety take by 14:40.
