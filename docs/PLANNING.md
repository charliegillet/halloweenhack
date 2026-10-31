# Haunted Hacks plan: recommendation, timeline, lanes, checklist, demo

Prepared **29 Oct 2026 (PT)** for Sat 31 Oct (build 11:00-16:00, submit by 16:00, top 8 demo live 16:00-17:00). Inputs: all research in [research/SOURCE_RESEARCH_INDEX.md](research/SOURCE_RESEARCH_INDEX.md), the 48-idea book and six-persona scores in [IDEAS.md](IDEAS.md), and the prize/stack analysis in [SPONSOR_STRATEGY.md](SPONSOR_STRATEGY.md).

**Status: research and planning only.** No event code exists (rule: all code written at the event). Every number in the demo below is a *slot to be measured live*, not a claim. [V] = verified in a cited brief; [I] = inference.

## 1. The recommendation in one paragraph

Build **Midnight Soul Exchange**: a live Halloween auction where the room's phones bid against AI broker agents that secretly collude over Agent Relay, and every lot is a Terse Durable Actor whose one-request-at-a-time mailbox makes "two winners" impossible. It had the top average (6.50) and the top Terse and Crowd scores, which are the two personas closest to the most valuable floor prize (iPhone Duo, $1,999+) and the stage. Its two weak scores (Skeptic 3, YC 4.5) are fixed with grafts: a scripted concurrent burst so the hero number never depends on venue Wi-Fi, fewer beats, an honest labelled baseline that does not cast Supabase as the villain, and a buyer story ("the arbiter for agentic commerce"). Keep **Hearsay Hollow** (most balanced across both hosts) and **The Curse** (best consumer/Supabase story) as the alternates, decided by the open questions in §9.

## 2. Top 3

### #1 Midnight Soul Exchange (grafted) — default

**First sentence for BuilderBase:** "Midnight Soul Exchange is a live auction where a room of humans bids against colluding AI brokers, and every lot is a Durable Actor, so a flash crowd still produces exactly one winner."

**Who it's for (criterion 5) [I]:** marketplaces, ticketing and limited-drop platforms that are about to let AI agents buy on users' behalf. When agents and humans hit the same scarce inventory at once, each SKU needs a single writer, and agent-to-agent side deals need an audit trail. Evidence the theme is live: d402 won YC's Make Something Agents Want (17-18 Oct) on agent payments; Cloudflare's Monetization Gateway beta (30 Sep); Cloudflare's Jon Bunting predicting "multi-agent systems that negotiate against each other rather than collaborate" (Brainbase panel, 28 Sep) ([past-winners.md](research/past-winners.md) §3.2, §4, §6). Market size and buyer demand are not researched; say "wedge", not "market".

**Why it wins each judge (and how the grafts lift the weak scores):**

| Judge | Original | What carries it | Graft that fixes the objection |
|---|---:|---|---|
| Terse | 8.5 | "Each lot is its own actor; the mailbox is the lock; the alarm closes the lot even with every tab closed." Re-enacts their founding bug ("10 agents on shared Postgres state got stale snapshots", [terse.md](research/terse.md) §1.1) | Keyhole's labelled primitive overlay (mailbox / alarm / grant / `observe/state`), so the mapping is broad, Crate-style |
| Relay | 7 | Heterogeneous brokers colluding in DMs and group DMs; typed `placeBid` action; Medium mines Relay history for the reveal | Ghost Ticket's kill-a-broker beat: its DMs queue and drain on restart (durable delivery, the differentiator native Claude messaging lacks); collusion evidence cites real Relay message IDs |
| YC | 4.5 | Audience energy | "Arbiter for agentic commerce" framing; measured before/after number; Accord-style honesty ("here's what broke") |
| Skeptic | 3 | — | Trick-or-Trade's scripted 200-bid burst guarantees the conflict number; phones are a bonus, not the proof. Cut the k6 stage beat to a recorded readout; 2-3 lots only; 3 brokers, not 4; no cross-lot wallet |
| Supabase | 7 | Anon auth + RLS, `httpSend` ticker to many phones, settlements table, load number with breaking point | Full-Size Bar's honest baseline: the naive version is an in-process store with a labelled LLM-length await between read and write, described as "any store without a lock", never "Postgres" |
| Crowd | 9 | 30 phones, giant countdown, cartel lines, collusion reveal | Keep it; cut nothing from the room-facing beats |

**Architecture (fits every documented constraint):**

```
Phones (Supabase anon auth) ──POST /bid──▶ Backend (Bun, holds TERSE_API_KEY + Relay keys)
   ▲  ticker via Supabase Broadcast            ├─ actors.Lot.get(lotId).placeBid(bidder, amount, seq)
   │  (server httpSend; phones subscribe)      ├─ actors.Lot.prepareWebsocket() → projector grant
Projector ◀── actor WebSocket grant ───────────┤
   + Relay observer stream (ot_live_*)         └─ Relay bridge: addListener('*') → placeBid / Medium
Terse Cloud: Lot actor ×2-3 (NO LLM inside; @Atomic placeBid; @Persisted @Emittable highBid/leader/endsAt;
             this.alarm.set(endsAt) → onAlarm closes, settles, writes settlement row to Supabase)
             Lobby actor (lot index; opens next lot; timers table if more than one timer)
Agent Relay (≤5 identities): auctioneer (registers placeBid action, posts #auction-floor) +
             3 brokers (OpenAI: Luna Decisions bid/no-bid, Sol for cartel DMs; 1 may be Mastra/Claude) +
             medium (reads history, posts the antitrust reveal)
```

Constraints honoured: actors cannot hold Relay listeners, so one bridge process does ([INTEGRATION_COOKBOOK](research/reference/INTEGRATION_COOKBOOK.md) TL;DR 1); no LLM in the Lot actor, so no `@Interleave` and rollback stays intact ([terse.md](research/terse.md) §5 #2); phones are not Relay agents (5-agent cap, [agent-relay.md](research/agent-relay.md) §2.4); `TERSE_API_KEY` never reaches a browser (#224); socket messages carry `seq` (ordering not guaranteed since v0.12.3); fresh `lot-${Date.now()}` IDs per run (#228, no delete). The SDK listener bridge needs no public URL, so Freestyle is not required.

**Throughput honesty:** methods are serialized and Terse's own number is 85.6 ms p95 per durable write (Show HN, self-reported, pre-latency-work), so one contended lot may accept roughly 10-12 durable bids/s [I, untested]. Mitigate: phone throttle (1 bid / 1.5 s), 2-3 concurrent lots, and an honest bids/s readout. **Measure on Fri 30 Oct in a throwaway project.**

**Cut order:** Mastra/Claude broker → k6 stage readout (keep the recorded number) → Medium reveal (keep split screen, alarm close, broker catch-up). Never cut: the split screen, the alarm closing a lot with everything closed, Relay DMs visible on screen.

### #2 Hearsay Hollow (grafted) — balanced both-hosts alternate

Four ghost agents gossip over Relay; the audience whispers lies from phones (moderated by a Luna Decisions check); a single-writer **TownLedger** actor (no LLM inside) records `{msgId, from, to, claim, parentMsgId, version}` and rejects writes citing a stale version; **TRACE** replays the chain to "phone #17"; the **Medium** quarantines it with a correction DM to every ghost that heard it. Score 5.92: Terse 7, Relay 7, Crowd 8; the most even both-hosts story because the Relay traffic *is* the content.

Grafts: Medium/Exorcist's **deterministic rules first** (hop cap, unattributed claim, stale version) with the LLM only narrating; Dead Men Tell Tales' **named Relay mechanics** (DMs = whispers, threads = retellings, reactions = believe/doubt); Rumor Mill's **correction travels on the same channel as the rumor** (answers Cognizant's "a correction in one place doesn't spread"); Ledger of the Dead's **plain hop list** before any force graph; Ghost Ticket's **kill-a-ghost, DMs queue, it catches up**. Startup framing: a flight recorder for agent-to-agent traffic (weak, YC 4.5; say it in one line). Pitch hook: Cognizant's Haunted Hollow (29 Oct) asked "Can shared records preserve earlier versions and identify who changed them?" ([past-winners.md](research/past-winners.md) §4). Do not claim "first shared agent memory" (MedRoute, AgentGossip came first). **Risk:** the research's own consensus pointed several briefs at séance/rumor ideas, so other teams may build something close; AI Town drift.

### #3 The Curse (grafted) — consumer / Supabase alternate

Open a cursed link and a ghost latches on; a `Curse` actor per victim haunts the phone on alarms with every tab closed; a one-shot `@Atomic claim(inviteCode)` refuses double claims; pass it on before the countdown or "doom". The projector shows a live lineage tree with R0. Score 6.25: Supa 8, Crowd 8.5, Terse 7.5.

Grafts that fix Relay 4.5: make the 4-agent coven load-bearing. The **Warden** is a deterministic verifier (new anonymous user, not the parent, not a sibling tab) that approves pass-ons through a typed `registerAction('approve_pass')`; the **Scribe** writes the "what the ghost learned" handoff as a durable DM that waits if the next coven step is offline; kill the coven process on stage and show it catch up. Possession Live's **load generator with a named breaking point** ("500 active actors and 50 starts/s per project; dormant actors free slots after 10 s; spread alarms with jitter"). **Risks:** Terse quotas (SDK does not retry 429), a QR onboarding spike on venue Wi-Fi, moderation of user-written facts, and YC's "what happens in week 2?".

### Startup-first pivot (not top 3, but keep in mind)

If the team cares most about the YC interview and is infra-heavy, **Witching Hour** (YC 8, Relay 7) is the best interview candidate: a bring-your-own-agent incident room with an intent ledger and a judge approving a rollback from their phone. It loses the crowd (4.5) and has a funded incumbent (Resolve AI). Decide only if the user says so (§9).

## 3. Five-hour timeline for #1 (team of 4)

Lunch at 13:00 happens at the keyboard. Checkpoints are hard gates: if a checkpoint fails, take the listed fallback, don't push on.

| Time | Lane A: Actors | Lane B: Relay + agents | Lane C: Phones, projector, Supabase | Lane D: Backend, baseline, pitch |
|---|---|---|---|---|
| 10:00-10:45 | Check in. Pin versions (`npm view … dist-tags`). Ask Terse table about quotas | Check `GET /v1/workspace` → `plan`. Ask about workspace upgrades | Redeem Supabase code, *then* upgrade to Pro (one project) | Redeem OpenAI vouchers into the shared org. Ask organizer: stacking? which YC batch? |
| 11:00-11:20 | `git init` (fresh repo after 11:00). `terse init msx --template counter`, `terse actor dev` | Seed script: register auctioneer + 3 brokers + medium, save `at_live_` tokens to `.env` (create-only) | Migration #1: GRANTs, RLS, `bidders`, `settlements`; anon sign-in on | Bun backend skeleton: `/grant`, `/bid` (verifies Supabase JWT), `.env` |
| 11:20-12:30 | `Lot` actor: `@Atomic placeBid(bidder, amount, seq)` with monotonic price, per-bidder budget (100 coins per lot), per-bidder rate limit; `@Persisted @Emittable` highBid/leader/endsAt; `alarm.set(endsAt)` → `onAlarm` closes. `terse deploy` + `terse secrets import .env` **by 12:30** | Bridge: `addListener('*')` (DMs arrive as `dm.received`); auctioneer `registerAction('placeBid', zod)` → Lot. One broker bidding via action | Phone page: anon auth, lot card, bid button with 1.5 s throttle. Projector: countdown in giant numerals from actor WS grant | Naive baseline: same handler on an in-process map with a labelled `await sleep(llmMs)` between read and write. Burst script: 200 concurrent bids at both |
| **12:30** | **Checkpoint 1: phone bid → backend → Lot actor → projector updates; alarm closes a lot with all tabs closed.** Fallback: run `terse actor dev` locally and keep deploy for later | | | |
| 12:30-13:30 | `Lobby` actor: lot index, opens next lot; settlement row insert to Supabase on close | 3 brokers: Luna Decisions bid/no-bid each tick; Sol drafts cartel DMs and group DMs; hop counter in `data`; per-broker step and $ budget | Supabase ticker: backend `httpSend` to a private channel; live viewer counter | Split-screen view: naive vs actor counters fed by the burst script |
| 13:30-14:30 | `seq` on every broadcast; reconnect requests a new grant; `observe/state` or actor browser on screen 2 | Medium: deterministic collusion detector over Relay history (paired drop-outs, DM before withdrawal) cites message IDs; LLM writes the one-paragraph reveal. Broker kill/restart: reconnect with stored token, drain queued DMs | Cartel lines between broker avatars from the observer stream; proof panel (bids, bids/s, conflicts, broker messages) | Load run: 200 simulated bidders, record bids/s, p95 accept latency, sockets; note where it breaks |
| **14:30** | **Checkpoint 2: full dry run end to end.** Fallback: drop Medium, keep split screen + alarm + broker catch-up | | | |
| 14:30-15:15 | Harden kill/restart path; fresh IDs per run | Stretch: one Mastra or Claude broker (`createTool` over Relay SDK) | Polish, primitive overlay labels, QR | BuilderBase draft under the five criterion headings |
| **15:15** | **Feature freeze.** Two rehearsals from a pre-warmed state | | | Record 60-90 s fallback video (link, not upload) |
| 15:30-15:45 | | | | Final BuilderBase submit by **15:45** (submit is final; uploads block the button) |
| 15:45-16:00 | Rehearse the 1:50 script; costume on | | | |

## 4. Team lanes

| Lane | Owns | Skills | Also owns |
|---|---|---|---|
| A: Actors | Lot, Lobby, alarm, emitted state, deploy, secrets, kill/restart | TypeScript, comfortable with new SDKs | Terse billing/quota questions; the "why an actor" answer |
| B: Relay + agents | Seed script, bridge, brokers, Medium, hop/budget limits, local-engine fallback flag | Node, prompt design | Relay workspace and keys; observer token |
| C: Front end + Supabase | Phone page, projector, split screen, cartel lines, Supabase migration and Broadcast | React, CSS | Supabase billing captain; QR |
| D: Backend + story | Bun backend, naive baseline, burst/load scripts, pitch, video, submission | Generalist | OpenAI billing captain; demo driver; check-in questions |

Team of 3: merge C and D (cut the load readout to a recorded number). Team of 2: build Trick-or-Trade's subset (one house, burst split screen, 3 agents) instead.

## 5. Pre-event checklist (Thu 29 to Fri 30 Oct; accounts, installs, docs, ideas; **no project code**)

**Accounts and keys**
- [ ] BuilderBase account on the same email as the YC RSVP; GitHub username added ([past-winners.md](research/past-winners.md) §10).
- [ ] Terse: `bunx terse-cli@latest install`, `terse auth login`, API key at app.useterse.ai.
- [ ] Agent Relay: signed-in workspace; save `rk_live_*` once in a password manager; every teammate in one workspace.
- [ ] OpenAI: one shared org; project hard limit; scoped expiring key. Buy $5 and turn off auto-reload **only if** we might use GPT-Live.
- [ ] Supabase: one org, one project; enable anonymous sign-ins; turn off Realtime "Allow public access"; vault publishable + secret keys.
- [ ] Mastra Platform account (prize landing). Freestyle and Superserve accounts, team IDs noted, nothing purchased.

**Installs (every laptop, macOS/Linux)**
- [ ] `bun upgrade` to ≥1.4.2 (this machine has 1.3.14) ([terse.md](research/terse.md) box).
- [ ] Node 22.18+ (24 fine). Cache: `@agent-relay/sdk@14.0.0 @relaycast/sdk@12.2.1 @relaycast/engine@12.2.1 zod openai@7.45.1 @openai/agents@0.21.0 @supabase/supabase-js@2.118.0 @mastra/core@1.80.0`; confirm `better-sqlite3` builds and `npx @relaycast/engine --db ./relay.db --port 8787` boots.
- [ ] `npx supabase@2.122.0`; k6 installed.

**Throwaway tests (run, note results, then delete the code)**
- [ ] Terse round trip: `terse init x --template counter` → `terse actor dev` → `terse actor generate` → `terse deploy`.
- [ ] Alarm re-arm in `onAlarm` fires twice with all clients closed.
- [ ] Throw after a write in a non-`@Atomic` method: is the write kept? (docs contradict; [landscape-actors.md](research/landscape-actors.md) §5)
- [ ] **Contended-write throughput:** 200 concurrent calls at one actor; record accepted/s.
- [ ] Relay: two throwaway agents, one DM, confirm the SDK listener on `'*'` sees `dm.received`; mint an observer token; check `plan`.
- [ ] Supabase: `httpSend` from a server script to a private channel; two tabs receive it; confirm `wss://` (not long-poll).
- [ ] Hosted `observe/state` / actor browser reachable for a deployed throwaway actor.

**Docs to save for coding agents**
- [ ] `https://agentrelay.com/llms-full.txt`; `relay/packages/sdk/README.md`; AgentWorkforce skills. Do **not** use `agentrelay.com/docs/typescript-sdk` (serves v7.1.1).
- [ ] `docs.useterse.ai/llms.txt` (4 pages) and the TS reference; Supabase Broadcast docs; OpenAI Decisions guide.
- [ ] [INTEGRATION_COOKBOOK.md](research/reference/INTEGRATION_COOKBOOK.md) §3.1-3.3 open on a second screen.

**Ideas that may be prepared (prose, not code)**
- [ ] Lot names and art direction (Cursed Full-Size Snickers, Haunted Roomba, ...); broker personas (Vampire, Lich, Banshee) and their cartel strategies; Medium's detection rules in plain English.
- [ ] BuilderBase template with the five criterion headings and the API names under criterion 1.
- [ ] Demo script (§6) and video shot list; Q&A card (§6).
- [ ] Anyone who would join YC drafts a **W27 application** (deadline Mon 2 Nov, 8pm PT).
- [ ] Agree who keeps hardware prizes and whose account receives prize credits.

**Hardware:** phone hotspot, HDMI/USB-C adapters, second screen or laptop for the actor browser, printed QR backup, headset if any voice, costumes.

## 6. Demo script skeleton (1:50, stop before 2:00)

| Time | Beat | On screen | Primitive named out loud |
|---|---|---|---|
| 0:00-0:12 | "Agents are about to buy things for us. When a thousand agents and humans hit the last item at once, who gets it, and who's colluding?" | Title + QR | — |
| 0:12-0:40 | Room joins; Lot 1 "Cursed Full-Size Snickers", 30 s countdown; phones bid; brokers bid | Giant countdown, ticker, broker avatars | "Each lot is its own Durable Actor; bids enter its mailbox one at a time" |
| 0:40-0:55 | Cartel DMs appear as lines between avatars | Relay observer pane | "The brokers are separate agents dealing directly over Agent Relay, no human in the middle" |
| 0:55-1:10 | Split screen: burst of 200 concurrent bids at both | "Naive: N winners" vs "Actor: 1 winner, 0 conflicts" (measured live; naive delay labelled) | "Same logic, minus the actor" |
| 1:10-1:25 | Close every tab, kill the web server and one broker mid-countdown; reopen | Lot closed at T=0 by its alarm; broker reconnects and its queued DMs drain | "The alarm fired with nothing connected; Relay held the broker's messages" |
| 1:25-1:40 | Antitrust Medium reveal | "Lich and Banshee colluded on lots 1-2; evidence msg #…, #…" | "Relay's shared history is the audit trail" |
| 1:40-1:50 | Proof panel + scale line | bids, bids/s, conflicts 0 vs N, sockets, where it breaks | "One actor per SKU shards contention; Supabase fans it out to every phone" |

**Q&A card:** *What breaks first?* One hot lot's serialized write rate (~measured bids/s); shard by lot, throttle clients. *Why not Postgres + row locks?* You can; the actor makes it correct by default and gives each lot its own socket server and SQLite. *What's the user?* Platforms letting agents buy scarce inventory. *How is this different from Cloudflare DO?* Same family; serialize-by-default, sandbox-sized `@Compute`, open source. *What does Relay add over Claude messaging?* Cross-vendor peers, durable delivery to an offline agent, shared history we audit.

## 7. Risks and fallbacks

| Risk | Likelihood | Fallback |
|---|---|---|
| Venue Wi-Fi throttles 30 phones | High | Burst script is the guaranteed hero; hotspot for the demo laptop; phones are a bonus |
| Naive baseline doesn't race on stage | Medium | Labelled delay makes it deterministic; recorded run as backup, said out loud |
| Lot actor slower than expected | Medium | Measure Friday; 2-3 concurrent lots; client throttle; show honest bids/s |
| Hosted Relay cap or incident (Oct 5, 9 precedents) | Medium | `RELAY_BASE_URL` env flag to local engine; ≤5 identities; handle `429 plan_limit_exceeded` |
| Relay registration 409 on hot reload | High if ignored | Seed once, persist tokens, `reconnect`; run suffix in names (no hyphens, #1466) |
| Terse release breaks clients on Saturday | Medium | Pin 0.14.7/0.14.4; never `bun update`; regenerate client after signature changes |
| Terse Cloud deploy fails | Low-medium | `terse actor dev` locally; OSS `durable-actors` fallback; still show actor browser |
| LLM brokers ping-pong and burn credits | Medium | Hop counter in `data`, max turns per lot, per-broker $ budget, kill switch |
| Medium reveal misfires | Medium | Deterministic detector produces the evidence; LLM only narrates; cut if needed |
| Audience types something offensive (Hearsay/Curse) | Medium | Luna Decisions moderation before projector; short inputs |
| Judges see "Accord with candy" | Medium | Lead with audience-vs-AI-cartel drama and the collusion audit, not "auction on an actor" |
| Submission blocked at 15:59 | Low | Submit by 15:45; video as a link; every teammate checked in |

## 8. What judges and sponsors want (summary)

Terse: actor as backbone, visible state, alarm while dormant, kill/resume, Terse Cloud URL. Agent Relay: real heterogeneous peer traffic on an observer screen, durable catch-up, a gate. YC: first sentence naming user and value, a number, a reason to exist after Halloween. Supabase: Broadcast, RLS, a load number and an honest breaking point. OpenAI: current APIs (Decisions, Responses). Details: [SPONSOR_STRATEGY.md](SPONSOR_STRATEGY.md).

## 9. Open questions for you

1. **Team:** how many people (cap is 4 per Luma), and who is strongest at TS backend vs front end? This sets the lane plan or the 2-3 person fallback.
2. **Which of the top 3?** Default is Midnight Soul Exchange. Choose Hearsay Hollow if you want the most even both-hosts story; The Curse if you want the consumer/Supabase angle.
3. **Priority:** floor prize (iPhone Duo via the Terse beat) vs YC interview (startup framing)? If the interview matters most, consider the Witching Hour pivot.
4. **YC:** will anyone actually apply to W27 by Mon 2 Nov? If so, draft the application Friday.
5. **Voice:** any appetite for a GPT-Live narrator? It needs a $5 purchase and a real test call Friday; default plan uses none.
6. **Machines:** everyone on macOS/Linux with Bun ≥1.4.2 by Friday night?
7. **Heterogeneity:** do we have a Claude API key for one broker (stronger Relay story), or stay all-OpenAI plus optional Mastra?
8. **Prizes:** agreement on who keeps hardware and whose accounts receive credits.

## Limits / could not verify

Judges, rubric weights, stacking rules and "more prizes" are unannounced. Terse write throughput under contention, hosted actor-to-actor calls, hosted `observe/state`, non-`@Atomic` rollback, and hosted Relay DM delivery through the SDK listener are untested by us (Friday tests in §5). The "agentic commerce" buyer is an inference without market research. Persona scores are simulated.

## Sources

Internal: [IDEAS.md](IDEAS.md), [SPONSOR_STRATEGY.md](SPONSOR_STRATEGY.md), [research/SOURCE_RESEARCH_INDEX.md](research/SOURCE_RESEARCH_INDEX.md), [terse.md](research/terse.md), [agent-relay.md](research/agent-relay.md), [past-winners.md](research/past-winners.md), [landscape-actors.md](research/landscape-actors.md), [supabase.md](research/supabase.md), [openai.md](research/openai.md), [reference/INTEGRATION_COOKBOOK.md](research/reference/INTEGRATION_COOKBOOK.md), [reference/prize-stacking-and-ev.md](research/reference/prize-stacking-and-ev.md), [reference/sponsor-coverage-audit.md](research/reference/sponsor-coverage-audit.md).
External (as cited there): https://events.ycombinator.com/haunted-hacks-2026 · https://docs.useterse.ai/quickstart · https://agentrelay.com/llms-full.txt · https://www.cognizant.com/us/en/ai-lab/blog/halloween-ai-agent-simulation-terralingua · https://www.ycombinator.com/apply/
