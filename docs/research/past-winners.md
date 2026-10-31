# Past winners: what won comparable hackathons, and what that means for Haunted Hacks

> **Master brief, consolidated 2026-10-29 (PT)** for Haunted Hacks: Real-Time AI Edition (YC office, SF, Sat 2026-10-31; build 11:00-16:00; judging on BuilderBase; top 8 demo live).
> This file merges six sub-files (linked in section 12). They have the event-by-event depth, full source lists and per-claim verification logs. Each sub-file was adversarially re-checked on 2026-10-29. During consolidation I re-checked the remaining contradictions live (gh API, npm, raw HTML of the Supabase, Luma and YC pages, ~06:20 UTC Oct 30). Results are in section 7.
> **Labels.** **[V]** verified at a cited source. **[S]** self-reported by the winner (their own post), not by the organizer. **[I]** inference by the researcher or editor. **[BG]** background, before Aug 2026. No event in the corpus published judge scorecards, so every "why it won" is **[I]**.

---

## 1. Executive summary

1. **No one has won a Terse or Agent Relay hackathon before. This is the first one.** Karatzas (Terse CEO) calls it "the first (to our knowledge) Actor Hackathon at @ycombinator" (Oct 19, X via mirror) [V]. No Agent Relay-hosted event or "best use of Agent Relay" winner exists. Several 2026 winners named "Relay" (Aicoo, Columbia DevFest, Ramp Builders Cup) are unrelated to Agent Relay [V]. Host taste therefore has to be inferred from four things: what the founders build, what they judged, what they lost to, and the rubric.
2. **Bitrig Hacks (YC office, Sep 26 2026) is the closest analog.** It used the same YC events template, a near-identical prize ladder (YC interview + $5k / $2.5k / $1k OpenAI, plus an iPhone Duo track prize), the same five criterion names that Haunted Hacks now uses on BuilderBase, 73 submissions narrowed to 8 finalists, and **Terse's CEO on the judging panel** [V]. Every podium project made the new primitive (the hinge) *the interaction itself*. Crate won by mapping *every* Duo feature to a musical verb. A single-trick hinge CAPTCHA reached the finals and did not place [V/I].
3. **Verification and durable state won most agent hackathons in Aug-Oct 2026.** Organizer recaps from Brainbase, Runloop and Crusoe/Cerebral Valley describe their winners the same way: agents doing work, with something independent checking them [V]. Accord won the Cloudflare-hosted Startup Speedrun with auction state in a **Durable Object** and "231 passing tests". Dead Reckoning won a sponsor prize by logging intent before acting, so after a crash its agent did not pay for the ferry twice [V].
4. **Agent-to-agent negotiation recurs on podiums.** Examples: Accord, Mutual (2nd at Build Personal Agents), Attest, Surf/Skate/Bike ("not an orchestration function wearing a costume"), Sell2Agents, Gavel, and Milo's A2A escalation ladder [V/S]. A host's post-mortem of 24 A2A entries found "True peer-to-peer A2A is still aspirational" and that nobody built async A2A, reputation, settlement or multi-party deliberation [V, BG Jul 2026].
5. **The winning recipe in short live-demo events has five parts.** (a) Every host primitive does a visible job. (b) Something happens in the room: a phone call, a sensor, an audience action. (c) A hard number goes on screen. (d) The first sentence says who it is for and what it does. (e) Scope is narrow enough to run live through bad Wi-Fi. Simply using the sponsor stack does **not** separate projects: at Own Your Intelligence, 90 of 91 submissions tagged a sponsor side quest [V].
6. **The hosts' own demos set the bar you must not clone.** Terse's showcase is a multiplayer Victorian murder mystery (`whitechapel`, Oct 9) where "Every conversation is a durable Actor". Agent Relay's go-to demos are Claude-vs-Codex tic-tac-toe and agents arguing [V]. Karatzas's own distributed-systems demo "lost in the finals to a robotic arm playing Doom" (Oct 8) [V]. He knows invisible infrastructure loses to spectacle.
7. **The two hosts are converging.** Agent Relay CTO Khaliq Gant (Oct 8): "We're moving over to their tech for @agent_relay" [V]. "Relay as the agents' nervous system, Durable Actors as their bodies and memory" is the architecture both founders already believe in [I].

---

## 2. What matters for Haunted Hacks (the box)

> **1. The written BuilderBase submission decides who gets on stage; the 2-minute demo decides who wins.** Only the top 8 demo. Judging is one hour (4:00-5:00), so the Round 1 skim is roughly 35-40 minutes across all teams [I]. At Neon's Build Personal Agents, judges cut 71 projects to 6 in a 15-minute window [V]. In BuilderBase, "Teams nobody has scored are not ranked and cannot advance" [V].
> **2. Write the submission under the five criterion names**, each scored 1-5 with no published weights: *Use of Real-Time AI and Track Technology*, *Originality and Creativity*, *Execution and Demo*, *User Experience and Design*, *Potential and Impact* [V]. Name the exact Durable Actors and Agent Relay APIs under criterion 1. That one score feeds the overall ranking *and* the track prizes [I].
> **3. Answer Bitrig's criterion 1 in one line:** "this would be impossible or much worse without Durable Actors / Agent Relay because ___" [I from Bitrig's "significantly less compelling, or impossible" wording, V].
> **4. Make the primitives visible.** Kill and resume an actor on stage. Put a live Relay message log on screen. Show the race condition that *doesn't* happen. "We stored JSON in an actor" will not win [I].
> **5. Add one thing that happens in the room and one number.** Audience phones, a phone call, or a physical action, plus a measured recovery time, duplicate actions prevented, concurrent actors, or messages/sec [I from Fizz, Crate, OYI, Accord].
> **6. Do not build a murder mystery, tic-tac-toe, Werewolf, a debate council, or an AI Town clone.** Those are the hosts' own demos or saturated clichés [V/I].
> **7. Timeline:** feature freeze 3:15, start the submission 3:30, final submit by 3:45. Final submit locks the entry. Uploads in progress block the submit button. Every teammate must check in, because submission can be gated on check-in [V app strings]. Create the repo after 11:00am, since BuilderBase Terms (Oct 12) describe "submission timestamp verification, and pre-build detection" [V].

---

## 3. Key facts tables

### 3.1 Haunted Hacks judging facts (re-checked 2026-10-29/30)

| Fact | Value | Status |
|---|---|---|
| Rubric | 5 criteria, each "scored 1 to 5"; no weights published | [V] BuilderBase page (04) |
| Finalists | "top 8 finalists demo live for 2 minutes each". The YC page says only "top entries" | [V] |
| Team size | Up to 4. One aggregator's "no solo" claim is unverified; the YC page offers help forming teams | [V] / flagged |
| Judges | "Judges will be announced soon". Still unannounced on the Luma mirror as of 06:20 UTC Oct 30 | [V, re-checked live] |
| Track prizes | Stateful Apps (Durable Actors) → **iPhone Duo**; Agent to agent (Agent Relay) → **Mac mini**; "most likely to scale to millions" → $1K Supabase credits | [V] event page |
| Grand prize | YC interview + $5k OpenAI + $10k Freestyle + $1k Superserve + 3 months of Mastra Platform. The BuilderBase text omits Freestyle and Superserve; the YC page is authoritative | [V] |
| Platform | BuilderBase. An earlier YC page said Devpost, and stale aggregators (HackathonRadar) still say Devpost | [V] |
| Rules | "All code must be created at the hackathon"; ideas beforehand are fine | [V] |
| BuilderBase JSON-LD organizer | "Agent Relay" | [V] (04) |

### 3.2 Recent comparable events (Aug-Oct 2026, newest first)

| Event (date) | Build | Field → finalists | 1st place (and notable placers) | Why it won [I] |
|---|---|---|---|---|
| Make Something Agents Want, YC HQ (Oct 17-18) | overnight, ~24h | 70 teams [S] | **d402**: agents pay for APIs by labelling data for a voucher of up to 150 calls [S]. primitive.dev track: Continuity (cited, resumable task state), gud (replaying the thread "rebuilds the exact same state") [V] | Twist on a hot protocol (x402); resumable state = the actor story |
| Recursive Agents, Crusoe x CV (Oct 17) | ~12h | 215 attendees / 109 submissions [V] | **Etch** ($14k): voice-to-PCB agent; "plain code measures every value"; "cannot measure", never guessed [V] | Verification against physical artifacts in a crowded "Done Means Done" field |
| Build Personal Agents, Neon/Mastra et al. (Oct 4) | ~5.25h | 71 projects → top 6, 2 min + 1 min Q&A [V] | **Kevin** (roommate agent in a group chat); 2nd Mutual (agents negotiate calendars) [V/S] | Multi-party and social, with a character; Supa Neo's deeper engineering only took a side quest |
| Supabase Select 2026, YC office (Oct 3) | day-long; ~6h per a participant | 68 on the portal (59 per a finalist) → 6 planned / 9 reported [V] | **Fizz**: "a physical layer for agents", sensors → MCP → phone call [S] | Real-world loop ending in an action; DYAD (vitals, no action) didn't make the finals |
| Coshell Multiplayer Coding (Oct 3) | 1 day | 170+ builders | Freestyle prize: **Kudos** (project details not found) [V] | n/a |
| Startup Speedrun, Brainbase @ Cloudflare SF (Sep 28) | ~6h | 29 submissions; criteria include "how honestly the demo showed what worked" [V] | **Accord** (solo): Workers + **Durable Object** auction state, 231 tests. 2nd Bountyloop (3x exploit replay, signed receipt) [V] | DO-backed state, agent negotiation, honest scope |
| Own Your Intelligence, YC (Sep 27) | ~3.75h | 91 submissions [V] | **QM Motion** (solo); 2nd 49th Engineer "0/30 → 29/30"; 3rd Support AGI "-66% cost/ticket" [V] | Measured deltas beat ticking more sponsor boxes |
| **Bitrig Hacks iPhone Duo, YC office (Sep 26)** | 4h (11:30-15:30) | 73 → 8 finalists [V] | **Crate**: hinge = FX knob, "a beat in 0.3s". 2nd Duo-Man; 3rd Saura; RevenueCat track: TranslateCat [V] | Every primitive mapped to a user verb; instantly legible on stage |
| Long Horizon Agents, AWS Loft (Sep 25) | ~5.5h | ~120 builders | **NurserAI**. Tinybird prize: **Dead Reckoning** (intent log, crash, no double-pay) [V] | Crash-safe durable state, shown live |
| Codex Community, PostHog (Aug 29) | 6h | 100+ builders | **Groundtruth** (prize: a **Mac mini**): checks PR claims against the running app [V] | Independent verifier with evidence |
| Agent Natives @ Cloudflare SF (Aug 26-27) | 2 days | 22 teams | TitleWise (External), Climatico ("durable receipt"), Surf/Skate/Bike (best demo, A2A mesh) [V] | Auditable A2A, durable receipts |
| YC x Medplum (Aug 1) | 7h | 160+ | **Lamina**; judged by YC partner Diana Hu on "impact" and "effective use of the provided technologies" [V] | Startup wedge, sponsor tech used natively |

The full catalogs, including Medplum, Voice Agents, Call My Agent, Browser Use [BG], VibeCon, Vultr, AI Tinkerers, Mastra x Elastic and Terac, are in sub-files 01-03.

### 3.3 Sponsor and host signals (one line each)

**Terse:** judged Bitrig; own demos are the whitechapel murder mystery and a "tiny Lovable" software factory; lost to the Doom arm. **Agent Relay:** "Don't be a meat proxy" (Launch YC, Oct 23); cross-provider channels; moving onto Durable Actors. **Supabase:** picked Fizz (sensor → agent → call); the only "Scale to Millions" precedent winner explained "why it broke"; favors "builds that actually run, with real auth and real data". **Mastra:** "technical challenge … execution … UI" plus agents in the real world [BG]; CTO Abhi Aiyer judged Build Personal Agents. **Freestyle:** a game builder was the founder's "favorite" [BG]. **Superserve:** rewarded TalosAI, which "can't approve its own work" [S]. Detail: 01, 02, 03, 05.

---

## 4. Newest changes that affect the build (dated)

| Date | Change | Implication | Source |
|---|---|---|---|
| **Oct 30 04:48 UTC** | Agent Relay GitHub release `probe-v15.0.1` (`probe-v15.0.0` Oct 29). npm `@agent-relay/sdk` latest is **14.0.0** (last stable tag v14.0.0, Oct 13). Repo: 1,059 stars, Apache-2.0, pushed 06:17 UTC Oct 30 | **Pin the SDK version**; v15 may land on the day | gh/npm, re-checked by editor |
| **Oct 29** | `TerseAI/durable-actors` cut v0.14.2 → v0.14.4 in one day. npm `durable-actors` 0.14.4, `terse-cli` 0.14.7. 291 stars | Pin versions; expect churn | gh/npm, re-checked by editor |
| Oct 29 | Cognizant "Haunted Hollow": 16 Haiku agents trick-or-treat, and shared records get rewritten and rumors spread unchecked. It ends with three open questions | Citable, fresh problem statement for a provenance/truth-keeper idea | 06 [V] |
| Oct 23 | Agent Relay Launch YC | Founders are in launch mode and want visible use | 03, 05 [V] |
| Oct 12 | Terse Python SDK shipped. BuilderBase Terms updated (anti-cheat §3.3) | Python is an option; don't import pre-written code | 04, 05 [V] |
| Oct 9 | Terse whitechapel murder-mystery showcase; Deno joins Cloudflare (self-hostable Workers/DOs) | Don't clone it; Terse will value configurable compute and no lock-in over plain DO parity | 02, 06 [V] |
| Oct 7-8 | Durable Actors launch: no interleaving on await by default, `@Interleave` opt-in. Terse Show HN (53 points) pitches races-free multi-agent state | Demo serialization as a feature | 05, 06 [V] |
| Oct 1 | Cloudflare: pending I/O keeps a DO alive with no client for up to 15 min (default from compat date 2026-10-01) | "Keeps working after I close the tab" is now table stakes; *prove* it with a live kill | 06 [V] |
| Sep 30 | Cloudflare Monetization Gateway beta (announced Jul 1); x402 examples in cloudflare/agents | The agent settlement/reputation theme is current | 06 [V] |
| Aug 27 / Oct 1 | A2A joins the Agentic AI Foundation; A2A CLI `--exec` ships | A2A interop demos are now easy, and dry | 06 [V] |

---

## 5. Why they won: patterns ranked by evidence

| # | Pattern | Evidence | Confidence [I] |
|---|---|---|---|
| 1 | **The host primitive is the mechanic, mapped broadly** | Crate (every Duo feature does something musical) beat the one-trick CAPTCHA; QM Motion extended the host's own product | High |
| 2 | **A separate verifier, shown rejecting a false "done"** | Etch, Groundtruth, Antibody, Bountyloop, Browser Brain ("failed three agents that confidently reported success"), fixnet ("5/5 cheats are rejected"), TalosAI | High, but verification *alone* was crowded at Recursive Agents |
| 3 | **Durable intent/receipt log and a crash-replay demo** | Accord (DO), Dead Reckoning, Climatico, NurserAI, Continuity, gud | High; this *is* the Durable Actors pitch |
| 4 | **Agents negotiating across a boundary, with auditable traffic** | Accord, Mutual, Attest, Surf/Skate/Bike, Sell2Agents, Gavel, Milo | High; this *is* the Agent Relay pitch |
| 5 | **Real-world I/O that ends in an action, not a dashboard** | Fizz (call), Gavel/JailCall/City311 (phones), Thump (helmet sensors), Lookout (cameras); c0mpiled: "not just dashboards" [BG] | Medium-high |
| 6 | **A number on stage** | 0/30→29/30, -66%, 0.3s, 231 tests, ~300ms, "all eight planted signals" | Medium-high |
| 7 | **Social or multiplayer with a character** | Kevin, Wishybara, Mutual; Supabase LW winners skew realtime multiplayer (Whisker Jam [BG]) | Medium |
| 8 | **Honest scoping** | Brainbase's explicit honesty criterion; Etch's "cannot measure" | Medium |
| 9 | **Team size doesn't matter; scope does** | Solo winners: QM Motion, 49th Engineer, Accord, Attest, Fizz; Mutual's team met that morning | High |

**What did not win:** generic chat wrappers, RAG bots, dashboards, linear "agent pipelines" (judges "see a for-loop"), voice on its own ("a significant %" used voice, per the Fly.io CEO), and more sponsors ticked [V/I].

**Cliché scorecard (from 06):** murder mystery with one actor per suspect (5+ prior, including Terse's own) **very high risk**. Agent tic-tac-toe/chess **very high**. Werewolf/Mafia, debate councils/courtrooms, AI Town-style passive sims (Haunted Hollow took the Halloween version on Oct 29), linear pipelines: **high**. Generic background coding agent (OpenInspect, 3,406 stars) **medium-high**. **Low risk / white space:** contention over scarce shared state, verifiable rumor provenance between agents, async cross-machine A2A, reputation/settlement between agents. Most prior art has 0 stars, so the risk is how original judges find it, not competition [V/I].

---

## 6. Social sentiment and signals (Aug-Oct 2026)

This angle is not primarily social. These are the founder and judge statements found, all verbatim from sub-files:
- **Karatzas (Oct 8):** his agent-coordination demo "almost won me the @ycombinator demo showcase. lost in the finals to a robotic arm playing Doom". The **@IncTerse** account (not Karatzas) added: "Did pretty well for a distributed systems demo going against robotic arms playing Doom imo" [V, X via teapawt mirror; no primary event page].
- **Karatzas (Oct 7):** "we don't interleave requests on await by default" [V].
- **Khaliq Gant, Agent Relay CTO (Oct 8):** "We're moving over to their tech for @agent_relay" [V].
- **Will Washburn (Agent Relay)** is described by a friend as someone who "knows how to put on a show" (Oct 20 promo post; weak evidence) [V].
- **Scott Johnston, Fly.io CEO, judge at Build Personal Agents (Oct 8):** valued "Domain Depth" and "Surprise & Taste … 'Whoa! Your agent can do THAT?!'"; "a significant %" of hacks used voice [V].
- **Brainbase panel (Sep 28):** Cloudflare's Jon Bunting predicted "multi-agent systems that negotiate against each other rather than collaborate" [V].
- **Supabase founders' Q&A at Select (per an attendee):** "How you pitch yourself in the first sentence matters" [V].
- **Terse's best organic reactions** came from the murder-mystery game (per `../terse/04-social-pulse.md`) [V there]. That is exactly why judges will find a copy unoriginal [I].

Overall tone [I]: the host founders are building in public, shipping daily (see the release cadence in section 4) and rewarding showmanship. Neither has a hackathon track record yet, and as of 06:20 UTC Oct 30 no judges have been announced.

---

## 7. Contradictions between sub-files: resolved or flagged

| # | Contradiction | Resolution |
|---|---|---|
| 1 | **What to build:** 03 ranks a "Clue/haunted mansion" murder mystery #1; 02 and 06 say avoid it | **Resolved: avoid.** Terse's own `whitechapel` (Oct 9) is a murder mystery with one actor per conversation, and 5+ prior examples exist (06). Use 03's *mechanics* (a sealed verifier actor, agents whispering over Relay) inside a different premise |
| 2 | **Both tracks vs focus:** 01-04 say use both for the bonus; 05 says targeting both tracks "dilutes the demo beat" | **Resolved:** build so both are load-bearing (the event page and criterion 1 reward both), and tick both tracks on the form. In the 2-minute demo, give **one hero beat** (for example the kill/resume) and show the other as a labelled supporting pane. Whether one project can win both an overall and a track prize is **unknown** (Neon allowed it; Haunted Hacks hasn't said) |
| 3 | Durable Actors prize: "iPhone" (EVENT_PAGE.md derived table, 01) vs "iPhone Duo" | **Resolved: iPhone Duo**, per the event page's Tracks and Prizes text, BuilderBase and Karatzas's post |
| 4 | Supabase Select submissions: 59 (finalist post) vs 68 (portal) | **Re-checked live:** the hackathon.supabase.com index still shows **68** (Oct 30 UTC). 59 likely excludes drafts [I]. Both kept |
| 5 | Select finalists: "top six" (Luma) vs 9 (two attendees) vs 8 (one post) | **Flagged.** Live page JSON shows `"finalists_count":3` (likely the number of placed winners [I]) and `"results_published":false`. No official ranking exists. Fizz's 1st rests on the builder's own post plus Ant Wilson's quote-post |
| 6 | Select duration: "~6 hours" vs "9am-5pm" vs portal 15:00-00:30 UTC | **Resolved:** a full-day event (portal window 8:00am-5:30pm PT). "~6h" is one participant's estimate of build time. Theme "make something agents want" is **unverified**; the page header reads "Build in a weekend, scale to millions" (02) |
| 7 | Bitrig turnout 157 / 161 / ~300; finalists 6 vs 8 | **Resolved:** 73 submissions → **8 finalists** (Devpost plus a finalist's post). Participant count conflicts; 157 registered on Devpost |
| 8 | Make Something Agents Want: "48-hour" (winner) vs ~24h | **Resolved:** overnight, ~24h of build per the listed schedule |
| 9 | Fizz's pitch: 01 quotes the loop sentence as its description | **Resolved (05):** "Connect any sensor … get a call" is the fizzlayer.com tagline as of Oct 29, not confirmed as the stage pitch. "Fizz incorporated within a week" is unverified |
| 10 | Build Personal Agents: 200 vs 250 hackers; 71 projects vs "120 teams" | **Resolved:** use the host recap (250 hackers, 71 projects). 200 was pre-event copy; 120 comes from a translated participant post |
| 11 | Pax Silica winner "Bastion" (03) vs "Talkie Walkie / Bastion" (05) | **Flagged:** likely team and project names for the same entry [I]; not re-checked |
| 12 | Mastra x Elastic: 34 vs 36 participants | **Flagged (minor).** Devpost vs a post; immaterial |
| 13 | Khaliq Gant "co-founder" vs "CTO" | **Both true** (YC founder page lists CTO) |
| 14 | "Only Browser Use published a rubric" | **Refuted (01):** Bitrig published 5 criteria and Cactus/DeepMind published 2 |
| 15 | Rubric "copied word for word" from Bitrig | **Corrected (04):** names match; descriptions were rewritten, except for the first UX sentence |
| 16 | Install path: `terse-cli` (docs) vs `bunx durable-actors init` (README) | **Both exist** (npm `terse-cli` 0.14.7, `durable-actors` 0.14.4, live). Pick one before the event |

---

## 8. Gotchas

- **Submission mechanics (BuilderBase app strings) [V]:** check-in gate ("You need to check in at … before submitting"); optional milestone gate; "Submit on behalf of team"; "This action cannot be undone"; "Files are uploading… submission will be available once uploads finish" (use a Loom or YouTube **link**, not an upload); the deadline countdown locks edits. If the organizer enables the GitHub integration, repos freeze at the deadline and org invites expire after 7 days.
- **Anti-cheat:** BuilderBase advertises "code comparison across events globally, submission timestamp verification, and pre-build detection" [V]. Start a fresh repo after 11:00; scaffold with on-the-day quickstarts.
- **Ignore Devpost listings** for this event [V].
- **Version churn:** both host repos were pushed within the hour on the night before the event. Agent Relay `probe-v15` releases started Oct 29-30 [V]. Pin `@agent-relay/sdk@14.0.0` (or whatever you tested) and `durable-actors`/`terse-cli`.
- **Agent Relay multi-laptop:** `relay init` runs a local server on **one machine**. For a cross-laptop team, use the desktop app's hosted workspace (Google sign-in, `name@computer` addresses) [V, 05].
- **Durable Actors:** no interleaving on await by default; add `@Interleave` only where needed. Persist state by reassigning, not mutating, and use fresh actor IDs per run (see `../terse/03-github-code.md`) [V].
- **Naming:** don't call the project "Relay" (at least three unrelated 2026 winners use that name). When you say Relay, say "Agent Relay" [V].
- **Stock spooky ideas:** the DEV Hacktoberfest week-4 theme "Ghost in the Machine" (Oct 26-31) suggests a haunted terminal, a séance chatbot and a sensor-log ghost story [V].
- **Durability claims:** after Cloudflare's Oct 1 change, saying "survives disconnect" is not enough. Kill the process live [I].
- **Wi-Fi:** "dying Wi-Fi" at Neon's 250-person room [V]. Bring a hotspot and a 60-90s recorded fallback captured before 15:30.
- **Five hours is shorter than every comparable event found** (about 4h at Bitrig, which was simpler on-device work, up to about 12h). Scope down [V/I].

---

## 9. Integration recipes (patterns the winners used, mapped onto the host primitives) [I]

**Recipe A: Truth keeper vs rumor mill (white space #1 + #2; both tracks).** Agent "spirits" in a haunted town trade favors and rumors over **Agent Relay** channels and DMs. One **Durable Actor per town** is the single-writer, versioned record of what actually happened. It rejects forged history, keeps attributed rewrites, and settles contention over a scarce resource (the last full-size candy bar) without races. Humans join from their phones and whisper a lie to see whether it spreads. On screen: a provenance graph, a live Relay log, and a naive double-spend shown beside the actor version. Pitch it against Cognizant's Oct 29 questions, for example "Can shared records preserve earlier versions and identify who changed them?". Do **not** claim "first shared agent memory": Aicoo's MedRoute ledger and AgentGossip came first (06).

**Recipe B: Crash-proof long-running agent (the Dead Reckoning pattern; Durable Actors track).** The agent writes intent to its actor before every side effect, then confirms. Kill the process on stage. A fresh process rehydrates from the actor and does not double-send or double-charge. Agent Relay notifies a second agent ("I resumed at step 7"), and the Relay channel history lets a *new* agent continue (the Continuity/gud pattern). Number: recovery time, plus "0 duplicate actions vs N for the baseline".

**Recipe C: Cross-provider negotiation with a sealed verifier (Agent Relay track).** A Claude agent and a Codex/OpenAI agent negotiate peer to peer on a Relay channel (Agent Relay's stated differentiator), each with its own actor holding private state. A third verifier actor, which neither negotiator can write to, checks the outcome and visibly rejects one cheat. Ends in a real-world action (an email, an SMS or a call). Avoid tic-tac-toe or a debate as the subject.

**Primitive → visible job (Crate-style mapping):** "Actor = a room that remembers." "One request at a time = no two ghosts grab the same soul." "Relay = how the ghosts whisper." "Supabase = the system of record and the Realtime fan-out to audience phones."

**Setup commands (verified in 05; run once in a throwaway directory, then delete):** Bun ≥ 1.4.2; `bunx terse-cli@latest install` → `terse init <name> --template counter` → `terse actor dev` / `terse deploy` (or the README path `bunx durable-actors init`); Agent Relay desktop app (agentrelay.com/download) or `npm install -g agent-relay` → `relay init`.

---

## 10. Hackathon implications

**What to build:** Recipe A (best originality and both tracks) or Recipe B (safest Durable Actors story). Either way, include: audience-triggered input, one character with a Halloween skin, a real-world ending action, and one theme phrase said out loud ("multiplayer AI system" or "long-running agent", both from the brief).

**Submission (Round 1 skim):**
- Headline first sentence: "X is a ___ that ___ for ___."
- Five criterion headings, with exact APIs named under criterion 1.
- One "why impossible without actors/Relay" line.
- A 60-90s video link, a screenshot, a live URL and the repo.
- Tick both tracks.

**2-minute demo** (BuilderBase guide, Neon and Bitrig formats):
- Problem (15-20s)
- Solution (15-20s)
- Live run with the primitive labelled on screen, triggered by a judge or the audience (60-90s)
- Proof panel showing the number, the actor state and the Relay log (10-15s)
- One line on why it scales (Supabase prize) and stop at 1:50

Have answers ready for "what breaks first?", "how would this scale?", "who's the user?", "how is this different from Cloudflare DO / subagents?". For the last one: configurable compute and no lock-in for Terse (per its HN post); cross-provider peer messaging for Agent Relay.

**Prize targeting:**
- **Grand prize / YC interview:** frame the project as a startup wedge with a crisp user and number (Medplum's YC-partner criteria; Fizz became a waitlist startup).
- **iPhone Duo:** the kill/resume and contention beat.
- **Mac mini:** real, visible peer-to-peer cross-provider messaging. "Don't be a meat proxy": show the human removed from the loop.
- **Supabase $1K:** a small load readout (N simulated clients or actors) and an explanation of where it would break, echoing the only precedent winner.

**Prize stacking and the YC clock (added 29 Oct, see [reference/prize-stacking-and-ev.md](reference/prize-stacking-and-ev.md)):** no stacking rule is published. Stacking is common at SF/YC-adjacent events (Cactus Apr, Moss Jun, YC Startup School Jul 24), but at Bitrig, Select and MSAW (the in-window YC-office analogs) the track winners were different teams from the overall winners. Treat one track prize as the floor and overall as upside, and ask the organizer at check-in. Face values: iPhone Duo $1,999+ and Mac mini $899+. The grand prize is about $16.75k in credits plus the interview. **The YC W27 deadline is Mon 2 Nov, 8pm PT**, two days after the event, so draft an application in advance.

**Before Oct 31:**
- BuilderBase account on the same email as your YC RSVP, with your GitHub username added.
- Accounts and keys: Terse, Agent Relay (every teammate in one workspace), OpenAI, Supabase, Freestyle, Superserve.
- Run both quickstarts once, then delete the code.
- Pre-write personas, rules, the pitch sentence, a submission template with the five headings, and the demo script with the kill moment.
- Read the Cognizant and Aicoo posts so you can quote them.

---

## 11. Limits / could not verify

- **Judges and rubric weights** for Haunted Hacks are unannounced as of 06:20 UTC Oct 30. Whether Round 1 includes table visits, whether track winners come from all submissions or only the top 8, and whether the BuilderBase GitHub integration or anti-cheat scanning is on are all unknown.
- **No judge scorecards exist** for any event. All causal claims are inference from placements.
- **Unofficial placements:** Supabase Select 2026 has no published ranking (`results_published:false`, live). Make Something Agents Want 2nd/3rd and its Supabase, Blaxel and Stripe track winners were not found. YC Voice Agents 1st was not found. Kudos (Coshell) project details were not found. The Hack the Stackathon "Scale to Millions" project is undescribed.
- **Single-source items:** the Doom-arm result (X mirror only). Many placements come from LinkedIn posts by winners [S]. X was read via third-party mirrors.
- No demo videos were watched and no winner code was run; repo checks covered metadata and README only.
- Not re-checked in any pass: HiDevs, Qonto/Argentier, HackGT/Tsenta, SDx LW15, LWX, HackBarna, Pax Silica, AlphaSignal, the AI Tinkerers global results, and the background Werewolf/Hedera/GKE items.

---

## 12. Sub-files (depth, full source lists, verification logs)

- [past-winners/01-yc-hackathons.md](past-winners/01-yc-hackathons.md): YC-office events. Bitrig (closest analog), Make Something Agents Want, Supabase Select, OYI, Medplum, Voice Agents, Call My Agent, Browser Use [BG].
- [past-winners/02-sponsor-hackathons.md](past-winners/02-sponsor-hackathons.md): host and sponsor records. Terse/Agent Relay signals, Supabase LW history, Mastra, Freestyle (Coshell), Superserve (Terac).
- [past-winners/03-sf-agent-realtime-hacks.md](past-winners/03-sf-agent-realtime-hacks.md): SF agent/realtime events, Jul-Oct 2026. Brainbase/Accord, Recursive Agents/Etch, Long Horizon/Dead Reckoning, Agent Natives, Codex Community.
- [past-winners/04-builderbase-judging.md](past-winners/04-builderbase-judging.md): the BuilderBase rubric, submission and judging mechanics from app strings and API docs, plus the timing math.
- [past-winners/05-why-they-won-patterns.md](past-winners/05-why-they-won-patterns.md): matched-set natural experiments, the demo template, hidden factors, and setup paths.
- [reference/prize-stacking-and-ev.md](reference/prize-stacking-and-ev.md): stacking precedents, prize face values, who judges tracks, and the YC W27 interview clock.
- [past-winners/06-durable-objects-agent-showcases.md](past-winners/06-durable-objects-agent-showcases.md): DO/actor/A2A prior art, the cliché scorecard, white space, and platform shifts.

---

## Sources (merged, deduplicated; the sources cited in this brief. The sub-files list ~270 URLs in total)

**Event and judging platform**
- https://events.ycombinator.com/haunted-hacks-2026 (local: /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md)
- https://luma.com/yc-meetup-7183-9316f87f · https://luma.com/builde-oxba
- https://builderbase.com/event/haunted-hacks-2026 · https://builderbase.com/terms/ · https://developers.builderbase.com/reference/judging/
- https://intercom.help/builderbase/en/articles/14836128-builder-s-guide-ch-14-crafting-a-demo-that-lands · https://intercom.help/builderbase/en/articles/14836129-builder-s-guide-ch-15-how-judging-works
- https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026 (stale Devpost copy)
- https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0

**Hosts**
- https://teapawt.org/IncTerse (mirror of Terse/Karatzas/Gant X posts) · https://www.ycombinator.com/companies/useterse · https://docs.useterse.ai/quickstart · https://github.com/TerseAI/durable-actors · https://news.ycombinator.com/item?id=49980399
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other · https://agentrelay.com/blog/introducing-agent-relay · https://github.com/AgentWorkforce/relay · https://www.ycombinator.com/founders/khaliq-gant · https://www.linkedin.com/posts/paul-jump_haunted-hacks-real-time-ai-edition-activity-7518313439392387074-oiYp

**Bitrig Hacks (closest analog)**
- https://luma.com/yc-meetup-4378 · https://bitrig-hacks-duo-edition.devpost.com/ · https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html · https://www.linkedin.com/posts/mahin-bharathwaj-344b8a31b_incoming-activity-7510385152649502720-_KzG · https://www.linkedin.com/posts/gergana-dragoeva-quievy_yesterday-i-literally-moved-into-a-coat-activity-7510474243281793024-Qq50

**Other YC-office and YC-adjacent events**
- https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent · https://www.linkedin.com/posts/konrad-weber_ycombinator-aiagents-x402-activity-7518042534678466560-fBEd · https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF · https://github.com/napoleon1313/d402-site
- https://luma.com/select-2026-hackathon · https://hackathon.supabase.com/ · https://hackathon.supabase.com/supabase-select-2026-hackathon · https://select.supabase.com/ · https://nitter.rdrama.net/AntWilson/status/2106803568779088313 · https://www.linkedin.com/posts/burkybang_supabaseselect-supabase-anthropic-activity-7512372936960483328-07t0 · https://supabase.com/blog/supabase-select-2026-recap
- https://www.compiled.sh/articles/yc-own-your-intelligence-hackathon · https://github.com/charliec2004/qm-motion · https://github.com/OKKHALIL3/49th-labs · https://github.com/ToukoUrsin/own-your-intelligence-hack
- https://www.medplum.com/blog/yc-medplum-hackathon-2026 · https://www.medplum.com/blog/yc-medplum-hackathon-2026-recap
- https://hackhq.io/customers/browser-use-hackathon [BG] · https://agentphone.ai/callmyagent [BG]

**SF agent/realtime events**
- https://brainbaselabs.com/blog/startup-speedrun-hackathon-recap/index.md · https://brainbaselabs.com/blog/panel-agents-that-act-in-the-real-world
- https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon · https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon/hackathon/gallery/58 · https://pranavachar.com/etch · https://www.tipranks.com/news/private-companies/crusoe-highlights-developer-engagement-with-agentic-ai-hackathon
- https://luma.com/build-agents · https://build-personal-agents.com · https://www.linkedin.com/posts/scottcjohnston_really-inspired-by-all-the-great-hacks-at-activity-7513779298210648064-sjIm
- https://www.linkedin.com/feed/update/urn:li:activity:7511077975543533568 (Dead Reckoning) · https://www.linkedin.com/posts/nimble-search_aiagents-hackathon-activity-7511059572682412033-eIs8
- https://www.linkedin.com/posts/runloopai_aiagents-codex-devtools-activity-7500321526815256577-OLCV · https://www.linkedin.com/posts/kjazayeri_thank-you-openai-runloop-ai-and-tenor-activity-7500389238996271104-Q7-w
- https://www.immersivecommons.com/events/hackathon · https://www.linkedin.com/posts/immersivecommons_agentnatives-aiagents-sanfrancisco-activity-7501166025955270656-9Hir
- https://coshell.ai/hack · https://luma.com/hacs1uig · https://terac.com/events/hackathon

**Sponsor history**
- https://www.linkedin.com/posts/nadaa-moharram_i-won-most-likely-to-scale-to-millions-activity-7423607935161004032-z6w8 [BG] · https://supabase.com/blog/lw12-hackathon-winners [BG] · https://supabase.com/blog/lw15-hackathon-winners [BG]
- https://mastra.ai/blog/hackathon-winners-community-templates [BG] · https://mastra.ai/podcasts/bananas-pigs-and-muscle-hackathon-results-regina-from-dex-erik-from-pig-and-some-ai-news [BG] · https://dev.to/challenges/hacktoberfest-week4-2026-10-26

**Prior art and platform shifts**
- https://www.aicoo.io/blog/our-own-agent-hackathon [BG] · https://github.com/s-k-28/relay [BG]
- https://www.cognizant.com/us/en/ai-lab/blog/halloween-ai-agent-simulation-terralingua
- https://developers.cloudflare.com/changelog/post/2026-10-01-pending-io-keep-alive/ · https://blog.cloudflare.com/birthday-week-2026-wrap-up/ · https://blog.cloudflare.com/monetization-gateway/ · https://blog.cloudflare.com/deno-joins-cloudflare/
- https://hacks.elevenlabs.io/hackathons/1 [BG] · https://github.com/ColeMurray/background-agents · https://github.com/skyaara/llmgames-online · https://a2a-protocol.org/latest/blog/2026/10/01/introducing-a2a-cli/

**Judge guidance [BG]**
- https://blog.jetbrains.com/ai/2026/06/how-to-win-a-hackathon-notes-from-the-judging-table/ · https://dev.to/kurbaitaev/what-judges-actually-score-notes-from-a-year-of-hackathon-judging-3p4l · https://www.compiled.sh/articles/c0mpiled-2-the-adaptive-city-post-mortem

**Editor's live re-checks (Oct 30, ~06:20 UTC):** `gh api repos/AgentWorkforce/relay` (+ releases and tags), `gh api repos/TerseAI/durable-actors` (+ releases), `npm view @agent-relay/sdk|durable-actors|terse-cli version`, raw HTML of hackathon.supabase.com (68 submissions; `results_published:false`; `finalists_count:3`), and Luma mirror (judges "announced soon").
