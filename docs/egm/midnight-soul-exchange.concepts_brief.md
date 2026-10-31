# Concepts Brief: Midnight Soul Exchange (race-free drop with colluding AI brokers)

**Author:** Charlie Gillet
**Date:** 2026-10-31
**Source concept:** `docs/TOP_4_IDEAS.md`, section "3. Midnight Soul Exchange"
**Reviews merged:** 6 Goldfish lenses (Design Critic, Codebase Details, Zoom Out, Comprehension, Implementation Readiness, Structural). Verdicts: 5 proceed-with-changes, 1 rethink.

---

## Overview

The pitch: AI agents are starting to buy limited stock (tickets, drops) for people. When humans and agents go for the last item at the same moment, there must be exactly one winner, and side deals between agents must be caught.

The concept as written has these parts:

- Each lot is a Terse Durable Actor. It handles bids one at a time and closes on its own alarm, even with every tab shut.
- 3 OpenAI broker agents on Agent Relay bid and collude in secret DMs.
- A split screen shows a naive store selling the same lot 3 times, next to the actor selling it once.
- An "Antitrust Medium" agent reads the Relay history and exposes the cartel, citing real message IDs.
- Phones bid through Supabase (anonymous sign-in, broadcast ticker, settlements).

Context at review time: it is about 12:30. Building stops around 15:00 and the video is recorded after that, with submission at 16:00. That leaves roughly 2.5 build hours. The Durable Actors / iPhone track, which was the main reason to pick this concept, was **not** announced at kickoff. The Agent Relay Mac mini was announced, and this concept has the weakest Relay story of the four.

---

## Analysis

The six lenses agreed closely. Every lens raised the same three issues: scope against time, how the collusion evidence gets read, and whether the split screen is honest. Duplicate findings are merged below and attributed to the lenses that raised them.

### Blockers

**B1. The race doesn't fit the mechanism (auction vs. drop).** *(Design Critic, Structural, Comprehension, Zoom Out)*
A normal auction can't "sell a lot 3 times". It picks one highest bidder when it closes, however many bids arrive at once. Overselling is a limited-stock, buy-now problem: many buyers check stock, wait on something, then buy. The concept uses auction words ("bids", "closes on alarm", "highest bid") for a limited-stock failure. A platform-engineer judge will spot this first, and the "3 winners" side will look staged.
*Fix:* pick one model now. The recommended one is a **scarce drop**: N units (1 or 3), buy-now at a fixed or capped price, and a hard close on the alarm. States: OPEN, then CLOSED (set by `onAlarm`), then SETTLED. Every rejected request gets an explicit reason: `sold_out`, `closed` or `duplicate`.

**B2. Nobody has shown that the auditor can read other agents' DMs.** *(all 6 lenses)*
The research doesn't show that one agent's `at_live_` token can read DMs between two other agents. DM history is fetched per conversation. Observer tokens are read-only live streams. There are known bugs: DM readback mislabels `kind` (#1987), DM listing breaks at about 120 conversations (#1471), and DMs arrive as `dm.received`, not `message.created`. If the auditor can't read the DMs, the LLM will make up plausible message IDs. The Relay founders will spot fakes, and this is the only beat where Relay carries real weight.
*Fix:* stop relying on Relay's DM permissions. The backend process that sends each broker DM records the send response (Relay message ID, from, to, text, timestamp, run_id) in an evidence log. A workspace-key subscription or an observer with `include_dms` can serve as a second source. The auditor reads only that log. Every message ID it cites is checked against the log before display, and IDs that don't match are dropped. Fallback: brokers collude in a group DM or private channel that the auditor belongs to ("subpoenaed"), shown on the observer URL. **Test the round trip with throwaway agents by 13:15 to 13:30, or cut the reveal.** Never fake it.

**B3. Too many parts for 2.5 hours.** *(all 6 lenses; Zoom Out rated it rethink)*
The design has Terse lots and alarms, a naive store, a bot runner, 3 LLM brokers, a Relay bridge, an LLM auditor, Supabase phones with auth and a ticker, several lots, and a split-screen UI. That is 4 sponsors and at least 3 processes. The concept itself calls this the riskiest of the four. A working demo is required.
*Fix:* delete things now rather than "cutting later". Remove phones, Supabase, extra lots and LLM-driven bid decisions. What remains: 1 lot actor, 1 naive store, 1 burst script, 1 broker script, and 1 LLM audit call.

**B4. The reason for choosing #3 no longer holds.** *(Zoom Out)*
TOP_4_IDEAS says to pick #3 "if the iPhone track is confirmed". It wasn't announced. The prize that was announced (Relay Mac mini) goes to Relay-heavy entries, and this concept scores 2 stars on Relay. The panel already said "the hero beat belongs to Terse, not Relay".
*Fix:* unless Olivier confirms the iPhone track right away, prefer #1 or #2. If the team keeps #3, move weight onto Relay (see Key Decisions).

**B5. No contract for a bid, and no single way in.** *(Comprehension, Implementation Readiness, Structural)*
Bids come from bots, brokers, phones and the naive twin, and the concept never says who actually calls the actor, through which process, or with what auth. Terse requires the client to be regenerated after every signature change, so a signature that keeps changing breaks every caller at once.
*Fix:* freeze one type and one route before writing producer code:
`submitBid({runId, lotId, bidderId, source: 'bot'|'broker', amount, idempotencyKey, causeMsgIds?}) -> {outcome: 'accepted'|'outbid'|'sold_out'|'closed'|'duplicate', seq, state}`
Every producer calls it through one Bun/Node backend that holds `TERSE_API_KEY`. Generate the client once. After that, add fields inside the payload object and leave the signature alone.

**B6. Nothing proves "exactly one winner", and state isn't checked to survive sleep.** *(Codebase Details, Implementation Readiness)*
A bare "1" looks staged, and a "1" sitting next to silently dropped bids is a false claim. Terse returns `429 actor_start_rate_limited` and doesn't retry. The per-actor queue is unbounded (#177). Actors sleep after 10 s idle. `@Persisted` arrays changed with `.push()` are silently not saved (the README sample does this). Writes made before a throw stay saved unless the method is `@Atomic`. The alarm close happens exactly when the actor is asleep. If any of these bites, `onAlarm` wakes into an empty or half-written lot and settles wrongly, and nobody is watching.
*Fix:*
- Give each bid a `bid_id`/idempotency key and keep a ledger in the actor: seq, bid_id, bidder, amount, received_at, outcome. Update persisted arrays by reassigning, never by pushing.
- Mark `submitBid` and `closeLot` `@Atomic`. Make `closeLot` idempotent.
- Have the burst script count sent, acked, http_error by status, and missing. Show a reconciliation row on screen: `N sent / N answered / 1 sold / N-1 rejected / 0 lost`. **Don't record unless lost = 0.**
- Before 14:30, run a test: place bids, wait 15 s or more, then read `observe/state` (which doesn't wake the actor) and confirm the ledger length matches.

### Majors

**M1. The split screen looks like a strawman.** *(all 6 lenses)* The naive store loses only because of a "labelled delay" the team added, and "a Postgres row lock fixes that" is the obvious reply.
*Fix:* send one seeded bid sequence to **both** stores in the same loop. Make the naive side a real read, await, write sequence (any small delay disclosed on screen, labelled "read-then-write with no lock, the common bug"). Show matching counters on each side, plus a small timeline of the overlapping read and write windows that caused the oversell. In the description, say plainly that a row lock also fixes this. Then say why actors fit anyway: per-lot isolation, live socket fan-out, and a close that runs with no server or tab open, all with no shared database in the hot path. Keep this as a 10-second beat, not the headline.

**M2. Throughput is unmeasured and is the critical path.** *(Design Critic, Zoom Out, Structural, Implementation Readiness, Comprehension)* The p95 durable write is about 86 ms, which means about 10 writes/s per lot. 200 bids would take 20 s or more, and bids queued behind the close have no defined outcome.
*Fix:* deploy the lot actor to Terse Cloud first and fire 50 concurrent bids at it by **13:15**. Cap bot concurrency at 8 to 10 in flight. Reject losing or sold-out bids from in-memory checks with no durable write (safe because calls are serialized). Any bid processed after `closed=true` returns `closed`, and the closed count is shown on screen. Size the burst to the measured rate (30 to 100 bids) and quote that real number, not "200".

**M3. The two stories aren't linked.** *(Comprehension, Structural)* "No double-sell" and "cartel detection" are two theses with two villains, in a 2-minute video.
*Fix:* one thesis: **"The exchange is the single referee for agent buyers: one winner per lot, and rigged bidding gets flagged."** Tie the collusion to the same lot. The cartel agrees over DM to hold bids under X. The auditor shows those DM IDs next to the lot's price ledger, then voids or flags the winning bid.

**M4. The alarm close can't be seen on video.** *(Design Critic, Codebase Details, Zoom Out, Comprehension)* A closed tab looks the same whether or not the alarm fired.
*Fix:* use a short alarm (20 to 30 s). Keep a wall clock on screen and close the tab on camera. Keep outside evidence visible: an `observe/state` read in a terminal or the Terse actor browser, and the auctioneer identity posting the settlement to a Relay channel on the observer screen. Then reopen the tab and show "SOLD to Broker B at 23:59:59, closed by alarm, 0 clients connected" with `closedAt` read from actor state. Pin Terse 0.14.x and confirm the alarm fires on Terse Cloud, not just in `actor dev`.

**M5. Unbounded LLM chatter and quota risk.** *(Design Critic, Codebase Details, Implementation Readiness, Structural, Zoom Out)* Brokers reacting to every event make message counts grow quadratically. The hosted Relay free plan allows 300 req/min, 10k msgs/mo and 5 agents, the caps are closed-source and can change, and each LLM call takes 1 to 3 s.
*Fix:* drive brokers from a clock in the backend: one "decide" turn every 3 to 5 s, at most 2 DMs per turn, a hop counter in DM `data` capped at 3, low temperature, and a fixed playbook prompt (the collusion is disclosed as part of the scenario). Bids are scripted or rule-based. The LLM writes DM text and the audit only. Keep the bots off Relay. Agents: 3 brokers + 1 auditor (+ optionally 1 auditor/house identity) is 5 at most. Don't add a sixth. Budget: about 30 to 50 broker calls plus 1 audit call per take on gpt-5-mini.

**M6. Terse correctness traps.** *(Design Critic, Codebase Details, Implementation Readiness)*
- `@Interleave` anywhere on the class drops rollback for the whole class.
- Raw `BEGIN` is rejected.
- Socket messages can arrive out of order (since v0.12.3), there's no auto-reconnect, and `onDisconnect` may be skipped.
- Constructor SQL reruns on every restore, `CREATE TABLE IF NOT EXISTS` never adds new columns, and actors can't be deleted (#228).

*Fix:* keep the Lot class free of LLM calls, network calls and `@Interleave`, and add a code comment saying so. Put a `seq` on every broadcast and have the client drop or reorder stale messages. Show a visible "reconnecting" state and fetch a fresh `prepareWebsocket` grant when the socket drops. Freeze the schema by 13:15. Any later schema change means new IDs, never ALTER.

**M7. Stale state leaks between takes.** *(Codebase Details, Implementation Readiness, Structural, Comprehension)* Old lots keep their alarms and can settle into the current take. Relay registration is create-only (409 on re-register, so hot reload crashes on its second boot). Workspaces expire.
*Fix:* one `RUN_ID` (plus `BUILD_ID`) prefixes actor IDs (`lot-${BUILD}-${RUN}-1`), evidence-log rows and message metadata. The UI filters on the current run and shows the run_id in a corner. The backend refuses lot IDs from an old build. Create the Relay workspace once with `expires_in_seconds: 172800`, save the `at_live_` tokens to JSON and reconnect instead of re-registering. Add a one-command "New round" or `reset-run` script.

**M8. Two sources of truth for the winner.** *(Implementation Readiness, Structural)* Writing settlements to Supabase from `onAlarm` needs a secret inside the actor and a write that can't be made atomic with the close.
*Fix:* the actor is the only record of who won. The UI reads results from the actor's socket or state. Since Supabase is cut, this goes away. If Supabase comes back, it is only a best-effort idempotent mirror keyed by `(runId, lotId, seq)`.

**M9. No causal link from DM to bid.** *(Codebase Details, Zoom Out)* "They chatted" is weak evidence.
*Fix:* each broker bid carries `broker_name` and `causeMsgIds`, stored in the lot ledger. The reveal is a two-column join: "DM X said hold at 40" next to "bids Y and Z followed within 2 s". Detection combines a rule-based flag (brokers who DMed each other then bid in lockstep under a ceiling) with one LLM explanation that cites logged IDs.

**M10. The bridge is a single point of failure.** *(Design Critic, Codebase Details, Zoom Out, Structural)* Relay webhooks need public HTTPS, and hosted Relay had incidents on 5 and 9 October.
*Fix:* no webhooks and no Relay-to-actor path. Brokers run as Relay SDK clients inside the same local backend process that calls the actor over RPC. Pre-install the dependencies (the native compile took 29 s). Add a health strip showing last Relay event age, bridge uptime and 429 count. Keep the local `@relaycast/engine` behind an env flag. Record a complete good take by about 15:15 and keep it as the fallback for both the video and the live final.

**M11. Relay is built last.** *(Implementation Readiness, Design Critic)* The must-have tier uses no Relay at all, so any slip leaves a Terse-only entry.
*Fix:* add the brokers right after the core lot works, before any polish. Optionally send broker bid intents as Relay channel messages so bids also travel over Relay. Show the observer URL on screen during bidding. For extra Relay credit if time allows: put one broker on a different model or vendor, or take one broker offline and show it catching up from durable DMs.

### Minor points (merged)

- The staged-collusion objection: present it as the exchange's own regulated broker network, where agents must trade on the audited channel, like recorded lines at exchanges. *(Zoom Out, Comprehension)*
- Vocabulary overload: keep the Halloween skin, but use plain role names on screen (Lot, Bid, Winner, Broker agent, Auditor). Rename "Antitrust Medium" (for example to "the Inquisitor") so it doesn't clash with idea #2. Open with a plain title card. *(Comprehension)*
- Pin `terse-sdk/terse-cli@0.14.7` and `@agent-relay/sdk@14.0.0`, use Bun 1.4.2 or later and Node 22 or later, import from `terse-sdk/actor`, commit the lockfile, and ban `update`/`@latest`. *(Implementation Readiness)*
- Commit and tag each working tier (`tier1-ok`, `tier2-ok`). *(Implementation Readiness)*
- For the YC interview: frame "one authority per lot" as an interface with Terse as the first implementation, and keep the evidence log independent of any vendor. *(Structural)*

---

## Goals vs. Non-Goals

**Goals (for the Round 1 video, by about 15:00)**
- One drop lot on Terse Cloud that provably sells exactly N units, with a reconciliation row showing 0 lost.
- A fair split screen: the same seeded input goes to both sides, and the naive side's race is real and visible.
- An alarm close shown with evidence from outside the browser, and `closedAt` read back from actor state.
- 3 brokers colluding over Relay DMs on a clock, with every DM logged with its real Relay ID.
- An auditor that cites only verified message IDs, joined to the bids they caused.
- One thesis sentence, one screen layout with at most 3 panes (naive store, actor lot, Relay observer or audit).

**Non-Goals (cut now)**
- Phones, Supabase anonymous auth, the broadcast ticker and Supabase settlements. A QR bid page that calls the same `submitBid` is allowed only for the live final, after the video is recorded.
- Multiple lots before the single lot works and has been measured.
- LLMs choosing bid amounts, or any LLM or network call inside an actor.
- Relay webhooks, public HTTPS bridges, Freestyle deploys.
- The "200 bids" claim. Quote the measured number instead.
- A sixth Relay agent.

---

## Alternatives Weighed

| Option | For | Against | Verdict |
|---|---|---|---|
| Keep the concept as written | Highest crowd and Terse-founder appeal | 4 sponsors, 3+ processes, two stories, unproven DM read; very unlikely to work in 2.5 h | Reject |
| **Cut-down #3: "single referee" drop** (1 lot + fair split screen + clocked brokers + evidence log + auditor) | Keeps the Terse hero shot, adds a real Relay beat, about 5 components | Still the riskiest of the four; meaningfulness only moderate | Accept **only if** the team is already committed to #3 |
| Collusion as the hero, double-sell as support | Moves weight to the confirmed Relay prize | Collusion is the least verified part (B2), and the LLM behaviour is the least predictable | Use as framing if B2 passes by 13:30 |
| Postgres row lock instead of actors | Familiar, one-line fix | Throws away the Terse requirement and the alarm-close beat | Mention honestly in the description; don't build |
| Switch to idea #1 or #2 | Better Relay fit for the confirmed prize; fewer moving parts (per Zoom Out) | Context switch at 12:30 | **Preferred** unless the iPhone track is confirmed |
| Supabase phones for the crowd | $1K Supabase track | Not seen in a video round; auth, schema and venue Wi-Fi risk | Reject for Round 1 |

---

## Key Decisions & Staging for Next Steps

**Decisions to make in the next 10 minutes**
1. **Go or switch:** ask Olivier about the iPhone track. If it isn't confirmed, switch to #1 or #2.
2. **Model:** a scarce drop (N units, buy-now, hard alarm close), not an English auction.
3. **One way in:** a single `submitBid` route in one backend. Brokers are SDK clients in the same process. No webhooks.
4. **Evidence:** a log written by the sender. The auditor never relies on reading other agents' DMs.
5. **Freeze:** pin versions, commit the lockfile, freeze the actor methods (`openLot(endsAt, qty)`, `submitBid(payload)`, `getState()`) and the schema.

**Staging (hard timeboxes)**

| By | Deliverable | Kill switch |
|---|---|---|
| 12:45 | Repo, pinned deps and lockfile, Relay workspace (48 h expiry), tokens saved, RUN_ID/BUILD_ID helper | — |
| 13:15 | Lot actor on Terse Cloud: `@Atomic` `submitBid`/`closeLot`, ledger, idempotency, alarm. **50-bid throughput test.** **DM evidence round trip tested with throwaway agents** | If the DM evidence can't be read reliably, use the group-DM fallback. If that fails too, drop the reveal |
| 14:00 | Burst script with reconciliation counters. Naive store on the same input. Split screen with seq-ordered socket ticker. Visible alarm close + `observe/state` read. Sleep/wake persistence test passed. **Tag `tier1-ok`, record a rough insurance video** | — |
| 14:45 | 3 clocked brokers (hop cap, fixed playbook), DMs logged with IDs, `causeMsgIds` on bids, auditor with ID validation, two-column reveal, observer URL on screen, health strip. **Tag `tier2-ok`** | If the reveal doesn't work by 14:30, ship tier 1 and describe the reveal as next steps |
| 15:00 | `reset-run` script, title card, plain labels, polish | Stop building |
| 15:00-15:30 | Record takes. Keep the best full take as the fallback for the live final | — |
| 15:30-16:00 | Description (thesis, the "why not Postgres" answer, the regulated-network framing, measured numbers), submit | — |

---

## Hackathon verdict

| Dimension | Score (0-10) | Reason |
|---|---|---|
| Survives review | 4 | Three structural problems (auction vs. drop, unproven DM read, no proof of one winner) all fixable, but they show up first under expert questioning |
| 5-hour feasibility | 3 | About 2.5 h left for the concept with the most parts. Becomes about 5 only after the cuts above |
| Video-demo strength | 6 | The split screen and alarm close make good shots once made fair and visible. Collusion reveal is strong if the IDs are real |
| Meaningfulness | 4 | Agentic commerce is a real wedge, but "a row lock fixes it" undercuts it unless framed as a single referee |
| Relay prize fit | 4 | Relay only carries chat. Rises to about 6 with the evidence log, observer on screen and an offline catch-up beat |

**Go/no-go:** No-go as written. Go only as the cut-down "single referee" drop if the iPhone track is confirmed or the team is already committed; otherwise switch to idea #1 or #2.

**Top 3 changes that would most improve the idea**
1. **Re-model it as a scarce drop with one frozen `submitBid` route and a visible ledger** (idempotency keys, `@Atomic`, a reconciliation row with 0 lost, the same seeded input sent to an honest naive store). This makes the "exactly one winner" claim real rather than staged.
2. **Make the collusion evidence a log written by the sender, with verified Relay message IDs and `causeMsgIds` linking each DM to its bid.** Test the round trip by 13:15 to 13:30, or cut the beat rather than fake it. This is the only path to a believable Relay story.
3. **Cut scope hard now:** no phones or Supabase, no extra lots, no LLM-chosen bids, no webhooks. Run the brokers on a fixed clock with a hop cap, measure throughput first, and record an insurance video at 14:00.
