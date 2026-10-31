# Event and people: master brief (Haunted Hacks: Real-Time AI Edition)

> Consolidated **2026-10-29 late PT (2026-10-30 ~06:20 UTC)**, two days before the event (Sat 2026-10-31, YC office, SF). This brief merges three sub-files and adds a live re-check of every point where they disagreed or where facts move quickly: judges, releases, PR status and npm tags.
> Sub-files (for depth and per-claim verification logs):
> - [01 Host founders](event-people/01-host-founders.md): Karatzas, Simard-Morissette, Washburn, Gant. Backgrounds, posts, videos, GitHub evidence, judging lens.
> - [02 Sponsor, DevRel and judge candidates](event-people/02-sponsor-devrel-judges.md): the Builderbase rubric, YC partners, OpenAI/Freestyle/Superserve/Supabase/Mastra people, Bitrig precedent.
> - [03 Event listings and logistics](event-people/03-event-listings-logistics.md): every listing, the listing changelog, rules, per-sponsor account setup, pre-event checklist.
>
> Labels: **[V]** = verified in a primary source (by a sub-file's verification pass or by this editor's live re-check, marked **[V-live]**). **[I]** = inference. *(background)* = before Aug 2026. X posts were read through Nitter/teapawt mirrors, never x.com, so view counts are mirror snapshots.

---

## 1. Executive summary

1. **No judges have been announced anywhere.** Re-checked live at 06:20 UTC Oct 30: the YC Luma page still reads "Judges will be announced soon" [V-live]. Builderbase's "Meet the judges" block was empty on the Oct 29 live scrape [V]. The YC page itself returns a JS shell to curl. The four host founders are near-certain judges. At least one YC partner (most likely Aaron Epstein, Terse's partner, or Grey Baker, Agent Relay's) and one OpenAI person are likely, based on the Bitrig Hacks precedent (Sep 26, same rubric template) [I].
2. **The scoring rubric is public, but only on Builderbase.** There are 5 criteria, each scored 1-5: (1) Use of Real-Time AI and Track Technology, (2) Originality and Creativity, (3) Execution and Demo, (4) User Experience and Design, (5) Potential and Impact. **Only the top 8 finalists demo live, for 2 minutes each** [V]. That means the written Builderbase submission decides who gets on stage, and 2 of the 5 scores (UX, Impact) have nothing to do with infrastructure.
3. **The hosts are merging their own stacks, and the "use both" bonus mirrors that.** Khaliq Gant, Oct 8: "We're moving over to their tech for @agent_relay" [V]. On Oct 29 PT, Will Washburn opened Terse issues and PRs after running "the relaycast engine (Drizzle, 148 joins) inside a workspace actor" [V]. The winning shape is **one Durable Actor per room or workspace holding state and the agent message log, with heterogeneous agents talking over Agent Relay** [I, strong].
4. **Both products are changing daily.** Durable Actors went from v0.11.0 (Oct 24) to v0.14.4 (Oct 29 12:44Z), 12 GitHub releases in 6 days. The `terse-cli` npm package reached **0.14.7** on Oct 29 16:37Z [V-live]. Agent Relay's npm `latest` is still **14.0.0**, but `next` is at **15.0.0-next.5** (published Oct 30 05:30Z), and the GitHub "Agent Relay core 15.0.0/15.0.1" probe binaries shipped Oct 29-30 [V-live]. Pin versions Friday.
5. **Logistics:** about 225 capacity, QR check-in, registration closed or sold out, the venue is almost certainly 560 20th St (YC, Dogpatch), and teams should be **4 or fewer** [V, details in section 3]. Judging is on **Builderbase** (signup at check-in), not Devpost. The Devpost URL 404s and aggregators are stale.

---

## 2. What matters for Haunted Hacks

> **The one-paragraph brief.** Build a Halloween **multiplayer** experience in which **one Terse Durable Actor per room, ghost or player** holds live state, and **agents on different harnesses coordinate directly over Agent Relay**. Show the traffic live on screen (Relay observer view next to actor state), and show an actor going idle and then resuming with state intact. Add at least one **deterministic gate** (a test or check step, or a reviewer agent that cannot write) so Khaliq sees a "narrow path". Open the demo with one sentence naming the user, problem and value (rubric criteria 4-5, and Aaron Epstein's stated taste). The written Builderbase submission (title naming "Durable Actors + Agent Relay", 60-90 s video, screenshots, live URL) must win a top-8 slot **without you in the room**. Start a fresh repo after 11:00 Saturday. Pin `durable-actors`/`terse-cli` and `agent-relay@14.0.0` on Friday. Do not depend on `durable-actors/drizzle`. Wear a costume.

---

## 3. Key facts

### 3.1 Event facts (reconciled)

| Fact | Value | Status / source |
|---|---|---|
| Date and schedule | Sat Oct 31. Doors 10:00, hacking 11:00, lunch 13:00, **submission 16:00**, judging 16:00-17:00, awards 17:00-18:00 PT | [V] YC page via `../../EVENT_PAGE.md`. Builderbase JSON-LD 17:00Z-01:00Z |
| Venue | YC office, **560 20th St, SF 94107** | Very likely [V indirect]: CompeteHub summary plus Luma `full_address` of the Aug 2025 YC-office hackathon. Official pages obfuscate it, so check the confirmation email |
| Capacity / RSVP | 225 capacity, QR check-in, LinkedIn is the only required question, YC Luma `sold-out`, approval required | [V] YC page data (curl) and Luma MCP (sub-file 03) |
| Team size | **Plan for 4 or fewer** (see contradiction C1) | [V] Builderbase and its Luma say "up to 4". YC form data says `max_team_size: 5` |
| Host (official) | Luma host is "Y Combinator". Builderbase organizer is "Agent Relay". Run by Terse + Agent Relay | [V] |
| Sponsors | OpenAI, Supabase (S20), Mastra (W25), Freestyle (F24), Superserve (F26) | [V] YC page. Builderbase About text omits Superserve |
| Per-attendee credits | $100 OpenAI, $25 Supabase, $100 Freestyle, $100 Superserve | [V] YC page (Builderbase lists only OpenAI and Supabase) |
| Grand prize | Guaranteed YC interview + $5k OpenAI + $10k Freestyle + $1k Superserve + 3 mo Mastra Platform | [V] YC page |
| 2nd / 3rd | $2.5k OpenAI + 2 mo Mastra / $1k OpenAI + 1 mo Mastra | [V] |
| Tracks | Durable Actors: **iPhone Duo**. Agent Relay: **Mac mini**. Supabase "most likely to scale to millions": **$1k credits**. Costume contest: bragging rights. "More prizes will be announced!" | [V] |
| Code rule | "All code must be created at the hackathon. Thinking of ideas before the hackathon is fine." | [V]. Nothing on templates or scaffolds |
| Judging | Builderbase, signup at check-in. Top 8 demo 2 min each. "very well-executed products or incredibly creative use cases using Durable Actors and Agent Relay ... bonus points if you can do both" | [V] |
| Judges | **None announced** (Oct 30 06:20Z) | [V-live] Luma |
| Age / format | 16+, in person only | [V] |

### 3.2 Rubric (Builderbase, verbatim headings)

| # | Criterion | Key wording | What scores [I] |
|---|---|---|---|
| 1 | Use of Real-Time AI and Track Technology | "How meaningfully does the project use AI in real time? For the Terse and Agent Relay track prizes, how effectively does it use the corresponding technology?" | Live streaming UI or voice, visible agent-to-agent traffic, actors waking and sleeping |
| 2 | Originality and Creativity | "unexpected or creative use of real-time AI" | A Halloween premise that is not a chat wrapper |
| 3 | Execution and Demo | "functionality, polish, and how clearly and convincingly the demo communicates the concept" | Pre-warmed state and a rehearsed 2-min script |
| 4 | User Experience and Design | "intuitive, cohesive, and thoughtfully designed" | Projector-readable UI |
| 5 | Potential and Impact | "meaningful problem ... developed further into something useful" | One-line user, problem and value |

The same five headings were used at Bitrig Hacks (Sep 26, YC office), with "Use of iPhone Duo" in slot 1 [V], so this is probably a YC-events template [I]. How the criteria are weighted, and whether track prizes use only criterion 1, is unpublished.

### 3.3 People most likely in the judging room

| Person | Role | Likelihood [I] | What they reward [I, from their own posts] |
|---|---|---|---|
| Thomas Karatzas | Terse CEO. Ex-Staff Eng at Apple (Siri / Apple Intelligence). RustGPT author (3,192 stars, HN 369 pts) | Near certain (organizer; also judged Bitrig Sep 26) | An actor "aha" for a lay audience ("Explaining what Terse Inc does has been one of the greatest challenges"), multiplayer AI, actor + sandbox + Pi coding-agent stack, showmanship (lost a YC showcase final "to a robotic arm playing Doom") |
| Olivier Simard-Morissette | Terse CTO. Ex-Pigeon (W23), Squarespace, NYT. Main runtime author (285+ GitHub events on durable-actors since Oct 23) | High | Real concurrency that stresses the runtime, clean DX, games (built the Whitechapel multiplayer murder mystery on actors, Oct 9), "what product should we build next?", the costume contest |
| Will Washburn | Agent Relay CEO. 14 yrs at Tailwind per YC | Near certain (Builderbase organizer) | Team-scale workflows, shared sessions, "Don't be a meat proxy", polish and show. Hands-on in Terse's codebase this week |
| Khaliq Gant | Agent Relay CTO. Ex-Nango founding engineer. **Based in Oslo** | Uncertain whether he is in SF | Deterministic gates, "narrow path", least privilege, agent identity and ledgers, memory ("amnesia"), voice as interface. Dislikes noisy proactive agents |
| Aaron Epstein | YC GP, Terse's primary partner | Plausible | Product clarity, "animation that actually reinforces the point", "who should use it why ... it's valuable" (Lightcone, Oct 22) |
| Grey Baker | YC GP (since Jun 16 2026), Agent Relay's primary partner, Dependabot co-founder | Plausible | Dev tools (no recent posts collected) |
| Brad Flora / Jon Xu / Nemil Dalal | YC partners who judged recent hackathons | Possible | Flora judged Bitrig; Dalal hosted "Make Something Agents Want" (Oct 17-18) |
| Ari Weinstein | OpenAI, Computer Use ("Head of" title unverified) | Plausible (judged Bitrig with Karatzas) | Agents that *act* and recover from failure live |
| Romain Huet / Saptarshi Banerjee | OpenAI DevEx / Applied AI | Possible (judged SF hackathons Sep-Oct) | Real-time and agentic OpenAI APIs |
| Ben Swerdlow | Freestyle CEO | Plausible ($10k in the grand prize; judged the Supabase YC hackathon *background* Nov 2024) | Parallel agents on forked VMs, games and benchmarks (Brood War Bench, Sep 21) |
| Pavitra Bhalla | Superserve founder | Plausible (awarded an Aug hackathon track in person) | Fast fan-out of sandboxes, cold starts, secrets handling |
| Dan Goosewin | Mastra SF DevRel (agency) | Possible | Mastra Studio traces on screen (his Aug 19 hack-night criterion) |
| Supabase (Copplestone / Wilson / staff) | | Unknown | A credible scale story readable from the submission |

---

## 4. Newest developments, with dates (Aug-Oct 2026)

| Date (2026) | Event | Source |
|---|---|---|
| Aug 5, Aug 25 | Khaliq essays "Trusting an agent you didn't spawn" and "Someone else's agent, in your repo" (titles only verified) | agentrelay.com/blog [V] |
| Sep 12 | Khaliq, "Promptgramming": gates over prompts. Its `software-factory` flow is planner -> implementer -> deterministic `npm test` -> adversary agent on a different model -> PR, `$8/run` | [V] |
| Sep 26 | Bitrig Hacks at the YC office, same rubric template. Karatzas, Flora and Weinstein judged | Devpost / Luma [V] |
| Sep 30 | Khaliq on The Parameter #57 (39 min): "narrow path", identity/ledger, memory | YouTube [V] |
| Oct 2-4 | Agent Relay `relayfile` PR #523 adds a conformance harness with a `terse-durable-actors` target ("a qualification contract, not an implemented or qualified adapter") | gh [V] |
| Oct 8 | Khaliq: "We're moving over to their tech for @agent_relay" | X mirror [V] |
| Oct 9 / 12 / 14 | Terse: Whitechapel murder-mystery stress test / Python SDK / Omnara demo night | X mirror [V] |
| **Oct 18** | Durable Actors **v0.8.1** published on GitHub (Alarms #207, Pi durable adaptor #204, `inspect` CLI #213). Thomas tweeted it Oct 20 | gh [V-live: 2026-10-18T19:49Z] |
| Oct 19 16:28-16:29Z | Both teams announce the event in the same minute. Thomas: "the first (to our knowledge) Actor Hackathon" | X mirrors [V] |
| Oct 22 | Olivier: "Spots are filling really fast" (names only OpenAI, Supabase, Mastra) | X mirror [V] |
| Oct 23 | Agent Relay Launch YC ("Don't be a meat proxy"). Will's launch tweet ~96.6k views | YC / mirror [V] |
| Oct 24-29 | Durable Actors v0.11.0 -> v0.14.4 (12 releases). Breaking change around Oct 27 per sibling `terse.md` | gh [V-live] |
| Oct 28-29 | Terse Launch YC ("Durable Actors: The perfect primitive for Multiplayer AI and Agent Coordination") plus a cloud beta: `bunx terse-cli@latest install`. Videos: 2:08 whiteboard, 2:41 mini-lovable demo. Pinned tweet 16,207 views at re-check | YC / YouTube / mirror [V] |
| Oct 28-30 | Agent Relay `15.0.0-next.2..5` on npm. "Agent Relay core 15.0.0/15.0.1" probe binaries on GitHub (Oct 29 07:44Z, Oct 30 04:48Z) | npm / gh [V-live] |
| Oct 29 PT (Oct 30 04:35-05:02Z) | Thomas opens #367 (ORM in `exec`). Will opens #368/#369, PR #370 (Drizzle + transactions) and #371. #371 was closed unmerged, folded into #370. **#370 is still open, `blocked`** (updated Oct 30 06:11Z) | gh [V-live] |

---

## 5. Social sentiment

The event's social footprint is **small and entirely host-driven**: six posts over Oct 19-22, none between Oct 23 and 29, and no posts from any sponsor account [V, sub-file 03]. Mirror view counts: Karatzas's announcement ~2,471, Olivier's ~1,105. On LinkedIn, Paul Jump (Uber) posted twice ("Y Combinator (and the world?) will be talking about it for years to come"), and Will replied that "50% of Paul Jump's linkedIn posts are about this hackathon". The founders' attention since Oct 23 has gone to their own launches: Will's ~96.6k-view Agent Relay launch, Thomas's 16.2k-view Terse launch.

Sentiment toward the hosts' theses, from the founders' own posts [V quotes, I reading]:
- **Positive and self-reinforcing:** "Terse can't miss!" (Khaliq, Oct 8). Olivier: "great to see the actor model becoming so mainstream" (Oct 16). Thomas endorsed Jessie Frazelle's "pi durable is ... awesome".
- **Self-aware about explaining actors:** "A groundbreaking 3 people knew what an actor was! (new record)" (@IncTerse, Oct 14). This is the opening for a demo that makes actors obvious.
- **Skeptical of agent noise:** Khaliq on proactive digests: "we've kind of stopped reading them" (Oct 17). "Reading long blocks of text from AI is definitely not it" (Oct 15, arguing for voice).
- **Culture signals:** Will: "we're getting rid of PRs on a lot of our repos" and "very soon it will be weird NOT to share your sessions".

No independent (non-host) sentiment about the event was found. Gap-fill (2026-10-30): Agent Relay's Discord has 18 members and Terse has no Discord, so help on the day will come from founders in the room. Bluesky has no host or sponsor activity. See `reference/social-coverage-gaps.md`. The `last30days` skill was not run, because the footprint is too thin to sample.

---

## 6. Contradictions between sub-files, and resolutions

| # | Conflict | Resolution |
|---|---|---|
| C1 | **Team size:** "up to 4" (Builderbase page and Builderbase Luma) vs `max_team_size: 5` (YC RSVP page data) vs "2-4, no solos" (Manyfold aggregator) | **Plan for 4 or fewer.** The YC 5 governs the RSVP form, Builderbase governs judging. Manyfold's "no solos" appears in no official copy, and the YC copy offers to help solos find a team. Ask at check-in. **Flagged, not fully resolved** |
| C2 | **Terse v0.8.1 date:** sub-file 02 said "Oct 20", 01 said Oct 18 | **Oct 18** [V-live: GitHub `published_at` 2026-10-18T19:49:02Z]. Oct 20 is Thomas's tweet |
| C3 | **Terse launch date:** 01 says Oct 29, 02 says "Oct 28-29" | Both hold. The Launch YC page is dated Oct 29. Launch tweets appeared late Oct 28 to Oct 29 (mirror relative times) |
| C4 | **Releases since 0.8.1:** 02 implies 0.8.1 -> 0.14.4 "in 9 days" with 3 releases Oct 29 | Confirmed: v0.14.2, v0.14.3 and v0.14.4 all carry Oct 29 UTC timestamps. Separately, the npm `terse-cli` reached 0.14.7, with 4 publishes on Oct 29 UTC (0.14.4-0.14.7). **The CLI and library version numbers diverge**, so pin each separately |
| C5 | **Agent Relay pin:** 03 says pin `agent-relay@14.0.0` | Still correct for npm `latest` [V-live]. But 15.0.0 is in `next`, and the GitHub "core 15.0.x" probe binaries are what `relay init` downloads (per release notes). [I] A CLI/core mismatch is possible on Saturday, so test `relay init` on Friday and record the core version |
| C6 | **Builderbase vs YC prize lists:** Builderbase omits Freestyle and Superserve prizes and credits | **The YC page is canonical** (it matches the YC Luma word for word). Builderbase's logo strip does show all five sponsors |
| C7 | **Will's Tailwind tenure:** ~13 yrs (LinkedIn dates) vs 14 (YC bio, Launch YC); Series A (YC) vs B (LinkedIn) | Unresolved. Use "14 years" if it comes up (his own YC copy). Not decision-relevant |
| C8 | **Will's base:** Boston (GitHub, LinkedIn) vs SF (X bio) | Both are probably true (in SF for the batch) [I]. He is expected in person as organizer |
| C9 | **Judging platform:** Devpost (old aggregator copy) vs Builderbase | **Builderbase.** The Devpost URL returns HTTP 404 [V] |
| C10 | **GitHub activity counts:** earlier drafts said Olivier 91 / Will 70 events | Corrected by 01's verification pass to Olivier 285+ (capped) / Thomas 60 / Will 134 on relaycast. These numbers move hourly. Directionally, Olivier writes the runtime |
| C11 | **Ari Weinstein's title / Charlie Guo's YC batch** | Both unverified. Treat them as "OpenAI, Computer Use" and "OpenAI" only |

---

## 7. Gotchas

1. **Top-8 gate:** a strong build with a weak Builderbase write-up never reaches the stage. Budget 20-30 minutes before 16:00 for the submission and a fallback video.
2. **Drizzle trap:** `durable-actors/drizzle` exists only in the open, blocked PR #370. Use raw `this.db.exec`. Issue #368 (still open): **duplicate column names in joins collapse in positional rows**, so alias every joined column.
3. **Version churn:** Durable Actors shipped 12 releases in 6 days, with a breaking change around Oct 27 (sibling `terse.md`). Agent Relay 15 is imminent. Pin both on Friday and keep a lockfile.
4. **Code-rule optics:** a repo whose first commit predates 11:00 Saturday looks like a violation. Keep all prep in prose. Whether unmodified `terse init --template` or `npm create mastra` scaffolds count as pre-written code is **unanswered**, so ask at check-in.
5. **"Meat proxy" anti-pattern:** don't route agent-to-agent traffic through a human or fake it. It is literally what Agent Relay pitches against.
6. **Noisy agents:** a "proactive digest" bot will land badly with Khaliq.
7. **Vocabulary:** don't call Relay a "multi-agent framework" or Durable Actors "a database" or "workflows". Their framing is durable *state*, not durable execution (sub-file 01, section 6).
8. **Credit redemption costs time at 11:00:** Superserve refuses Free-plan teams (credit goes per team ID). Freestyle `FS-…` codes land on the *active* team. OpenAI promo credit may not lift your usage tier (GPT-Live is not on the Free tier). Supabase Pro Realtime caps at 500 connections (sub-file 03, section 5).
9. **Stale listings:** ignore Hackathon Radar, BuildJams and CompeteHub. CompeteHub's "experts from OpenAI, Mastra, Supabase, Freestyle will be present" is AI-written summary text with no source.
10. **Khaliq may be remote** (Oslo). Don't build the pitch around a single founder being in the room.

---

## 8. Integration recipes (the shapes the hosts themselves use)

**Recipe A: "Haunted workspace actor" (best fit for both tracks and the bonus)** [I, modelled on Will's relaycast-in-a-workspace-actor work and Thomas's "army of little servers"]
- One Durable Actor per haunted room or session. Its embedded SQLite holds room state plus an append-only `messages` table. One request at a time means no duplicate work and no races.
- 2-4 agents on *different* harnesses (for example the OpenAI Agents SDK, a Mastra agent and a Codex CLI worker) join an Agent Relay channel for the room. Each agent writes its decisions back to the room actor.
- Humans connect over the actor's WebSocket. The UI shows a live Relay message pane (observer token `ot_live_*`, never the `rk_live_*` workspace key) next to an actor-state pane.
- Demo beat: let the room idle, so the actor sleeps to object storage ("costs you nothing"), then reconnect and it "pulls back into memory exactly as it was".

**Recipe B: Gated ghost crew (Khaliq's lens)** [I, from the Promptgramming essay]
- Planner -> worker -> **deterministic check** (a test, schema validation or a file-exists gate) -> adversary/reviewer on a different model that can only comment -> commit. Scoped file permissions per agent and a budget cap per run. Say "narrow path" on stage.

**Recipe C: Real-time voice layer (theme and Khaliq's Oct 15 post)** [I]
- Ghost NPCs or a "tasks in flight" voice front end. Speech fans out to every character via the room actor, as in Olivier's Whitechapel game ("every conversation is an actor, one person speaks at a time").

**Recipe D: Sponsor add-ons** [I]
- Freestyle or Superserve VMs as each agent's "computer", which feeds the grand-prize sponsors ($10k + $1k): show a live fan-out of sandboxes. Supabase for the "scale to millions" story (Broadcast, RLS, a per-actor fan-out diagram, a load number). Mastra Studio traces on screen if a Mastra judge appears.

Setup commands, keys and versions for each sponsor are in sub-file 03, section 5, and in the sibling sponsor briefs (`terse.md`, `agent-relay.md`, `freestyle.md`, `superserve.md`, `supabase.md`, `mastra.md`, `openai.md`).

---

## 9. Limits / could not verify

- **Judges:** none confirmed for any company. Everything in section 3.3 beyond the hosts is inference from role and precedent.
- **Builderbase** renders client-side. The editor's live curl could not see the rubric or judges block, so the rubric rests on sub-file 02's Firecrawl live scrape of Oct 29. Organizers can edit it.
- **Venue address** is not printed on any official Haunted Hacks page.
- **Team-size cap** (4 vs 5) and the scaffold/template question are unanswered officially.
- **Khaliq's attendance**, PR #370's merge timing, Tailwind A/B, the RustGPT "#1 on HN" rank, Ari Weinstein's title and Charlie Guo's batch remain unverified.
- **Not re-checked by any pass:** the LinkedIn post quotes of Oct 6/8/19, Khaliq's Oct 15/17 X posts, the Paul Jump reply, Sessionize wording, the bodies of Khaliq's Aug 5 and Aug 25 essays, and the per-sponsor setup table in sub-file 03, section 5 (taken from sibling files).
- X content came only from third-party mirrors. Relative timestamps were converted approximately.
- How the per-attendee credits are delivered on the day is undocumented.

---

## 10. Hackathon implications

> Added 29 Oct: prize stacking, prize face values, who picks the track winners (precedent: sponsors judge their own tracks), and the YC W27 deadline (2 Nov, 8pm PT) are covered in [reference/prize-stacking-and-ev.md](reference/prize-stacking-and-ev.md). A live re-fetch on 29 Oct still showed "Judges will be announced soon."

**What to build**
1. Recipe A, themed: for example a multiplayer haunted house where each room is a Durable Actor and ghost agents (different models and harnesses) coordinate over Agent Relay to scare, trick or help players in real time. Add one gate (Recipe B) and optionally voice (Recipe C). It hits both tracks, the stated bonus, rubric criterion 1 and the founders' own architecture.
2. Make three guarantees visible in under 2 minutes: (a) many players and agents on one actor with no duplicate work, (b) idle, sleep, then resume with state intact, (c) direct agent-to-agent messages on screen.
3. Open with user, problem and value in one line. Close with "where this goes" (criterion 5) and one scale number (the Supabase prize).

**Setup before Oct 31 (prose and accounts only, no project code)**
- Friday: `bun upgrade` (Bun >= 1.4.2), `bunx terse-cli@latest install`, `terse auth status`. Run `terse init` -> `terse deploy` in a throwaway folder, then **delete it**. Record the working `terse-cli` (0.14.7 now) and `durable-actors` (0.14.4 now) versions.
- Agent Relay: install, sign in with Google (free workspace), save the `rk_live_*` key once in a password manager, connect two agents, note the `relay init` core version, and pin `agent-relay@14.0.0` / `@agent-relay/sdk@14.0.0` unless the hosts say to move to 15.
- OpenAI key (buy $5 of credit if using GPT-Live), Supabase project (CLI v2.122.0, not the v3 beta), Freestyle shared team plus token, Superserve team ID, Mastra on Node >= 22.13.
- Watch Terse's 2:08 and 2:41 launch videos. Read "Promptgramming" and the Agent Relay Launch YC.
- Draft the Builderbase submission text, the 2-min demo script and a video shot list.
- **Friday night and Saturday morning:** re-check the Builderbase "Meet the judges" block, the YC page and @IncTerse / @agent_relay for judges and "more prizes", then tune the pitch for whoever is listed.

**On the day**
- 10:00: QR check-in, Builderbase signup, collect credit codes. Ask (a) whether templates are OK, (b) the team cap, (c) the Superserve credit path. Fresh `git init` after 11:00.
- 15:30: code freeze, record a fallback video, submit before 16:00. Rehearse from a pre-warmed state. Wear a costume.

**What judges and sponsors want**
- Hosts: visible actor semantics plus real agent-to-agent traffic, in their own words ("army of little servers", "one request at a time", "don't be a meat proxy", "narrow path", "gates").
- YC: a clear product story and polish.
- OpenAI: real-time or agentic APIs (voice, computer use) and recovery from failure.
- Freestyle and Superserve: parallel or forked sandboxes and fast fan-out.
- Supabase: a credible scale path.
- Mastra: Studio traces.

---

## Sources

Official event pages
- https://events.ycombinator.com/haunted-hacks-2026 (captured in `../EVENT_PAGE.md`)
- https://builderbase.com/event/haunted-hacks-2026 ; https://builderbase.com/event/haunted-hacks-2026/register
- https://luma.com/yc-meetup-7183-9316f87f ; https://luma.com/builde-oxba

Aggregators (stale, for the changelog only)
- https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026 ; https://www.hackathonradar.com/database/hackathon/haunted-hacks-real-time-ai-edition-2026
- https://jams.shippedby.app/events/haunted-hacks-realtime-ai-edition/
- https://www.competehub.dev/en/competitions/luma5817b434236ee51fb67bb836e92f8ac6 ; https://www.competehub.dev/en/competitions/lumab9b15b9eb9cf3521b8c9d05e0ab34cbe
- https://data.manyfold.ai/ai-hackathons/r/rec_01m5gbs14057m4p16f9azveak8 ; https://hackface.dev/hack/552086475580286752 ; https://luma.com/hacklist-sf

Host companies and launches
- https://www.ycombinator.com/launches/WbG-durable-actors-the-perfect-primitive-for-multiplayer-ai-and-agent-coordination (Terse, Oct 29)
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other (Agent Relay, Oct 23)
- https://www.ycombinator.com/companies/useterse ; https://www.ycombinator.com/companies/agent-relay ; https://www.ycombinator.com/founders/will-washburn
- https://youtu.be/UNaG-PLw17s ; https://www.youtube.com/watch?v=wpF3VTmljqM ; https://www.youtube.com/watch?v=Ksg1Gxoeprs
- https://agentrelay.com/blog ; https://agentrelay.com/blog/promptgramming ; https://agentrelay.com/blog/the-agent-centered-world-is-almost-here
- https://www.useterse.ai/blog ; https://thomaskaratzas.com/ ; https://sessionize.com/will-washburn/ ; https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082

GitHub and npm (live-checked 2026-10-30 06:20Z)
- https://github.com/TerseAI/durable-actors/releases (v0.8.1 Oct 18; v0.11.0-v0.14.4 Oct 24-29) ; https://github.com/TerseAI/durable-actors/releases/tag/v0.8.1
- https://github.com/TerseAI/durable-actors/issues/367 ; /issues/368 ; /issues/369 ; /pull/370 ; /pull/371
- https://github.com/TerseAI/Terse-Examples ; https://github.com/AgentWorkforce/relay/releases ; https://github.com/AgentWorkforce/relayfile/pull/523
- https://www.npmjs.com/package/terse-cli ; https://www.npmjs.com/package/agent-relay ; https://www.npmjs.com/package/@agent-relay/sdk
- https://github.com/tekaratzas/RustGPT ; https://news.ycombinator.com/item?id=45247890

Founder social (mirrors, plus LinkedIn)
- https://teapawt.org/karatzas_thomas/status/2112219511327965403 ; https://teapawt.org/Khaliqgant/status/2112219340422721818 ; https://teapawt.org/oliviersm199/status/2113069849341767743
- https://teapawt.org/IncTerse ; https://teapawt.org/agent_relay ; https://teapawt.org/willwashburn ; https://teapawt.org/Khaliqgant ; https://teapawt.org/karatzas_thomas ; https://teapawt.org/oliviersm199
- https://nitter.rdrama.net/karatzas_thomas ; https://nitter.rdrama.net/oliviersm199 ; https://nitter.rdrama.net/IncTerse ; https://nitter.rdrama.net/willwashburn ; https://nitter.rdrama.net/Khaliqgant ; https://nitter.rdrama.net/agent_relay
- https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0
- https://www.linkedin.com/posts/thomas-karatzas-a3015a94_explaining-what-terse-inc-does-has-been-one-activity-7514076987481735168-MpTa
- https://www.linkedin.com/posts/olism_work-update-thomas-karatzas-and-i-got-into-activity-7513251967154995203-k6ux
- https://www.linkedin.com/posts/paul-jump_haunted-hacks-real-time-ai-edition-activity-7518313439392387074-oiYp
- https://www.linkedin.com/posts/willwashburn_haunted-hacks-real-time-ai-edition-activity-7518360737891725312-jOLX
- https://www.linkedin.com/posts/henry-osborn_57-agent-relay-yc-f26-turning-ai-agents-activity-7511141169720938496-KDUI
- https://no.linkedin.com/in/khaliqgant ; https://www.linkedin.com/posts/khaliqgant_my-superpower-is-perspective-activity-7500229301766668288-Hm5o
- https://www.linkedin.com/posts/thomasgrauwin_another-talk-talk-session-with-thomas-karatzas-activity-7511962460489240576-N0Rv
- https://teapawt.org/aboodman/status/2088155104851657110

YC partners and judging precedent
- https://bitrig-hacks-duo-edition.devpost.com/ ; https://luma.com/yc-meetup-4378
- https://teapawt.org/aaron_epstein/status/2113683578651615294 ; https://xitter.cf/aaron_epstein/status/2105818202873921812 ; https://realalpha.app/people/aaron-epstein/
- https://www.ycombinator.com/people/grey-baker ; https://www.ycombinator.com/blog/chris-golda-and-grey-baker-general-partners ; https://www.ycombinator.com/people/brad-flora
- https://www.ycombinator.com/people/jon-xu ; https://nitter.cf/xuster/status/2020923920745103791 ; https://luma.com/compiled-8lsr
- https://www.ycombinator.com/founders/nemil-dalal ; https://xitter.cf/nemild/status/2098048890717212871 ; https://www.linkedin.com/posts/mason-arditi_excited-to-announce-nemil-dalal-y-combinator-activity-7514196352567013376-J0SW
- https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent ; https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF
- https://luma.com/hzwlapu0 (Aug 2025 YC-office rules precedent, background)

Sponsor people
- OpenAI: https://twiscan.com/en/x/AriX ; https://nitter.rdrama.net/AriX ; https://lspace.beehiiv.com/p/devday-2026 ; https://cerebralvalley.ai/e/openai-gpt-6-astra-sf ; https://builder.aws.com/post/3HHU3UEMBfKKxw1LFwNUAO2KLK2_p/how-to-build-a-video-agent-with-neo4j-twelvelabs-and-strands-agents ; https://www.garysguide.com/events/l9am65x/Codex-Community-Hackathon ; https://www.linkedin.com/posts/vivianamarquez_hackathon-day-tomorrow-sf-register-activity-7508982288672808960-XpWd ; https://events.trymimetic.com/events/sf/cyberdefense-hackathon-oct-2026
- Freestyle: https://nitter.rdrama.net/freestyle_dev ; https://c0mpiled-14.devpost.com/
- Supabase: https://supabase.com/blog/ai-hackathon-at-y-combinator ; https://supabase.com/events/supabase-ai-hackathon-at-y-combinator ; https://palaner.com/events/luma-61208c918c ; https://www.linkedin.com/posts/builderbase-labs_nyctech-hackathon-supabase-activity-7516144189311643649-u9NL
- Superserve: https://nitter.rdrama.net/pavitrabhalla ; https://www.linkedin.com/posts/super-serve-ai_activity-7488676422224551937-f1zo ; https://www.linkedin.com/posts/abhinav-garg-12b9343b5_my-team-and-i-just-won-500-at-the-zero-human-activity-7494806275881459712-Pp3C
- Mastra: https://www.goosewin.com/customers/mastra ; https://agent-memory-hack-night.devpost.com/
- Builderbase: https://builderbase.com/press/ ; https://linkedin.com/company/builderbase-labs

Sub-files and siblings
- [event-people/01-host-founders.md](event-people/01-host-founders.md) ; [event-people/02-sponsor-devrel-judges.md](event-people/02-sponsor-devrel-judges.md) ; [event-people/03-event-listings-logistics.md](event-people/03-event-listings-logistics.md)
- `../EVENT_PAGE.md` ; `terse.md` ; `agent-relay.md` ; `freestyle.md` ; `superserve.md` ; `supabase.md` ; `mastra.md` ; `openai.md` ; `past-winners/`
