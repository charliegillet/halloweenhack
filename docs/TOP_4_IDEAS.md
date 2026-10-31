# Top 4 ideas (re-ranked after kickoff)

> Sat 31 Oct 2026. Re-ranked against the rules announced at kickoff ([EVENT_KICKOFF_NOTES.md](EVENT_KICKOFF_NOTES.md)), not the pre-event panel alone. Source material: [IDEAS.md](IDEAS.md) (48 ideas, 6 persona judges), [PLANNING.md](PLANNING.md), [research/](research/SOURCE_RESEARCH_INDEX.md).

## What changed the ranking

1. **Round 1 is judged from a demo VIDEO plus a description.** Only 8 finalists demo live, for 2 minutes. An idea whose hero moment needs a live crowd loses its punch on video. Every idea below therefore has a beat that works on video, with bots standing in for the crowd.
2. **"Meaningfulness of the problem" is a criterion.** Pure Halloween games drop; real problems with a Halloween look rise.
3. **The Durable Actors / iPhone track wasn't announced; the Agent Relay Mac mini was.** Relay should be load-bearing in every idea. Terse still counts under "real-time AI usage". Confirm the iPhone track with Olivier.
4. **Working demo is required.** Favour fewer beats that work every time.

Criteria: real-time AI (incl. Terse/Relay) · originality · working demo · UX/design · meaningfulness.

| # | Idea | Problem it solves | Relay (Mac mini) | Terse | Video-friendly | 5-hr risk | Pre-event panel avg |
|---|---|---|---|---|---|---|---|
| 1 | **Hearsay Hollow** (bad-instruction tracing) | One compromised agent spreads bad instructions through a multi-agent system | ★★★ messages *are* the content | ★★ ledger actor | ★★★ graph lights up | Medium | 5.92 |
| 2 | **Medium** (agent-to-agent firewall) | Agents from different companies talking with no trust layer | ★★★ | ★★ warden actor per agent | ★★ before/after number | Medium | 5.58 (YC 7.5, Relay 8) |
| 3 | **Midnight Soul Exchange** (race-free auction) | Humans and AI agents hitting the same scarce inventory at once | ★★ cartel DMs | ★★★ one actor per lot | ★★ needs bot bidders | Higher | 6.50 (top) |
| 4 | **Witching Hour** (multiplayer incident room) | Several agents and humans fixing the same outage step on each other | ★★ | ★★★ intent ledger | ★ least visual | Medium | 5.67 (YC 8) |

**Default pick: #1.** It has the most even use of both hosts, the clearest picture on video, and a real problem. Choose #2 if you want the strongest YC story, and #3 if the iPhone track is confirmed and the team loves it.

---

## 1. Hearsay Hollow: watch a lie spread between agents, trace it, quarantine it

**One line:** "When one AI agent gets fed a lie, or a prompt injection, it spreads to every agent it talks to. Hearsay Hollow records who told whom, traces any claim back to its source in one click, and sends a correction down the same path."

**The problem (meaningfulness):** multi-agent systems pass instructions and facts between agents with no provenance. One poisoned input propagates silently. The Halloween version is a haunted town of ghost gossips; the real version is any agent fleet.

**How it works:**
- **4 ghost agents on Agent Relay** (OpenAI models, each with a persona). DMs are whispers, threads are retellings, and reactions mean believe or doubt.
- **Injection:** the audience, or a bot script on video, "whispers" a lie into one ghost through a phone page. The lie spreads as ghosts gossip.
- **TownLedger, a Terse Durable Actor:** a single writer with no LLM inside. It records `{msgId, from, to, claim, parentMsgId, version}` for every message, and rejects writes that cite a stale version, so the record can't be forged or overwritten out of order.
- **TRACE:** replays the chain from any ghost back to the source ("phone #17"), shown as a hop list, then a graph.
- **Quarantine:** the Medium agent sends a correction DM to every ghost that heard the lie, travelling the same route the lie did.
- **Midnight bell:** a Terse alarm fires on a timer even with every tab closed and publishes the "town's truth" snapshot.
- **Durability beat:** kill one ghost's process. Its Relay DMs queue, and when it restarts it catches up and receives the correction.

**Sponsors:** Terse (ledger + alarm), Agent Relay (all agent traffic), OpenAI (ghosts + moderation check on injected text), Supabase (phone page with anonymous sign-in, broadcast to the projector).

**Video beats (60–90 s):** a lie is injected → the graph lights up as it spreads → TRACE to the source → a green quarantine wave → a ghost is killed, restarts and catches up.

**Build order / cut order:** ledger actor + 4 ghosts + hop list (must have) → TRACE → quarantine → graph view → phone injection (on video, a script can inject) → kill/catch-up beat → Supabase mirror (cut first).

**Risks:** drifting into "AI Town" passive simulation, so keep it about tracing, not chatting. Other teams may build rumor/séance ideas. Use deterministic rules first (hop cap, unattributed claim, stale version) and let the LLM only narrate. Don't claim "first shared agent memory".

**Pre-event panel scores:** Terse 7 · Relay 7 · YC 4.5 · Skeptic 5 · Supabase 4 · Crowd 8. The reframed problem should lift YC and meaningfulness.

---

## 2. Medium: a firewall and flight recorder for agent-to-agent traffic

**One line:** "Your agents are starting to talk to other companies' agents. Medium sits between them, blocks unauthorized actions, and keeps a tamper-proof record of every message."

**The problem:** agents from different organizations exchanging messages and requests have no trust or audit layer. A malicious or confused external agent can talk yours into doing something it shouldn't.

**How it works:**
- **A Warden, one Terse Durable Actor per protected agent:** it holds that agent's policy and a hash-chained log of every inbound and outbound message.
- **Agents talk over Agent Relay:** "your" company agents and an "outside" vendor agent, which on video turns hostile ("possessed").
- **Every message passes through the Warden.** Deterministic rules run first (allowed actions, spend limits, data that must not leave). Then an OpenAI classifier judges intent. The message is allowed, blocked, or quarantined for human release from a phone.
- **Tamper beat:** an attacker edits a naive log and nobody notices; the actor's hash chain flags entry #7.
- **Hero number:** "unauthorized actions 10/10 without Medium → 0/10 with it", from a scripted attack run.

**Sponsors:** Terse (warden per agent, durable log), Agent Relay (cross-agent traffic, the founders' favourite topic), OpenAI (intent classifier), Supabase (approval queue and audit view).

**Video beats:** unprotected run, where the possessed vendor agent extracts data → the same run with Medium, where each attempt is blocked live → the tamper check catches the edited entry → a human approves one quarantined request from a phone.

**Cut order:** Warden + rules + 3 agents + before/after number (must have) → classifier → hash-chain tamper beat → phone approval → polish.

**Risks:** looks like a CISO dashboard (low crowd energy), so make the UX dramatic, with possessed-agent styling. The unprotected agent may refuse the attack on its own, so script the attack so it reliably succeeds without Medium. The actor can read as plumbing, so show its live state on screen.

**Pre-event panel scores:** Terse 6 · Relay 8 · YC 7.5 · Skeptic 5 · Supabase 3 · Crowd 4. It has the strongest "why now" and buyer story (security teams).

---

## 3. Midnight Soul Exchange: a live auction that can't double-sell

**One line:** "AI agents are about to buy things for us. When humans and agents hit the last item at once, there must be exactly one winner, and agent side deals must be caught."

**The problem:** platforms are starting to let AI agents buy limited inventory such as tickets and drops. Concurrent buyers cause overselling, and agents can collude. (Buyer framing: "the arbiter for agentic commerce". Market size wasn't researched; say "wedge".)

**How it works:**
- **Each lot is a Terse Durable Actor** that accepts bids one at a time, so "two winners" is impossible. Its alarm closes the lot even with every tab closed.
- **3 AI broker agents on Agent Relay** bid and secretly collude in DMs.
- **Split screen:** a naive store (in-process, with a labelled delay, never "Supabase") sells the same lot 3 times; the actor sells it once.
- **Antitrust Medium agent:** reads the Relay message history and exposes the cartel, citing real message IDs.
- **Phones bid** through Supabase (anonymous sign-in, broadcast ticker).

**Sponsors:** Terse (lots, alarms), Agent Relay (brokers, collusion evidence), OpenAI (broker decisions), Supabase (phones, ticker, settlements).

**Video beats:** run a scripted burst of 200 bot bids so the video doesn't depend on a crowd → split screen shows "3 winners vs 1" → the lot closes on its alarm with every tab closed → the collusion reveal.

**Cut order:** 1 lot + burst + split screen + alarm close (must have) → brokers → collusion reveal → phones → extra lots.

**Risks:** single-lot throughput may be only about 10 bids/s (untested), so throttle phones and run 2–3 lots. It has the most moving parts of the four. It was the Terse founder's favourite, which matters most if the iPhone track exists. Meaningfulness is its weakest criterion, so lead with the agentic-commerce problem.

**Pre-event panel scores:** Terse 8.5 · Relay 7 · YC 4.5 · Skeptic 3 · Supabase 7 · Crowd 9.

---

## 4. Witching Hour: a multiplayer incident room for humans and agents

**One line:** "At 3am, three agents and two engineers all try to fix the same outage and undo each other's work. Witching Hour gives them one shared intent ledger so nobody double-acts."

**The problem:** with several AI agents and humans responding to one incident, they duplicate or conflict on remediations (two rollbacks, a restart during a migration).

**How it works:**
- **An IncidentRoom Terse Durable Actor** holds the intent ledger. Any agent or human must claim an action before doing it, and the actor grants one claim at a time.
- **Bring-your-own agents on Agent Relay:** diagnosis, rollback and comms agents coordinate in an incident channel.
- **Approval:** a human (the judge, live) approves the rollback from their phone.
- **Crash beat:** `kill -9` an agent mid-rollback. The ledger shows the action as held, and the restarted agent resumes instead of starting over.
- **Hero number:** "duplicate remediations 2 without the ledger, 0 with it".

**Sponsors:** Terse (room + ledger), Agent Relay (agent coordination), OpenAI (agents), Supabase (optional incident timeline).

**Video beats:** a fake outage starts → without the ledger, two agents roll back at once → with it, one claims and the other waits → kill an agent mid-action; it resumes → the phone approval.

**Cut order:** room actor + 3 agents + before/after number (must have) → kill/resume → phone approval → timeline UI.

**Risks:** least visual and least Halloween; the look is only a skin, so invest in UX. A funded incumbent exists (Resolve AI). Every agent is OpenAI, so it's not cross-vendor unless you add one more model.

**Pre-event panel scores:** Terse 6.5 · Relay 7 · YC 8 · Skeptic 5 · Supabase 3 · Crowd 4.5. It's the best YC-interview candidate.

---

## Shared constraints (all four)

- **One bridge process for Relay:** actors can't hold Relay listeners. Keep LLM calls out of the actor that holds the authoritative state.
- **Hosted Relay allows about 5 agents per workspace:** audience phones go through Supabase, never Relay.
- **The Terse API key stays server-side.** Use fresh actor IDs each run, since actors can't be deleted.
- **Timeline:**
  - Build until about 3:00.
  - Record the demo video 3:00–3:30, with bots standing in for the crowd.
  - Write the Builderbase description using the five criteria as headings.
  - Submit by 3:45; the deadline is 4:00.
- **Setup details:** see [research/reference/INTEGRATION_COOKBOOK.md](research/reference/INTEGRATION_COOKBOOK.md) and the [PLANNING.md](PLANNING.md) checklist.
