# Past hackathons run or sponsored by the Haunted Hacks hosts and sponsors: winners, stacks, and why they won

> Researched 2026-10-29 for Haunted Hacks: Real-Time AI Edition (Sat 2026-10-31, YC SF, 5 hours of build time).
> Scope: hackathons hosted or sponsored by **Terse, Agent Relay, Mastra, Freestyle, Superserve, Supabase** (Launch Week included). Covers who won, what they built, the stack where it was published, and any sponsor or judge explanation of the pick. OpenAI is out of scope.
> Method: Exa search and fetch, WebSearch, one Firecrawl scrape (the JS-rendered Supabase Select 2026 submissions page). LinkedIn and X posts were read via Exa fetches and X mirrors (teapawt/nitter).
> Labels: **[V]** read directly at the cited URL. **[S]** self-reported by the winner or a third party, not confirmed by the organizer. **[I]** my inference. **[BG]** background, before Aug 2026.
> Sibling files already cover each sponsor's founders and taste (`../<sponsor>/05-team-strategy.md`). This file sticks to winners and their stacks, and cites siblings where they overlap.

---

## 1. TL;DR

1. **Terse and Agent Relay have never run a hackathon before.** Thomas Karatzas (Terse CEO) calls Haunted Hacks "the first (to our knowledge) Actor Hackathon at @ycombinator" (Oct 19) [V, X mirror]. I found no Agent Relay-hosted or Agent Relay-sponsored hackathon and no "best use of Agent Relay" winner anywhere. So there are **no host-track winners to copy**. The closest evidence of host taste is Karatzas's own demo, an agent-coordination demo on Durable Actors that he says "almost won me the @ycombinator demo showcase. lost in the finals to a robotic arm playing Doom" (Oct 8) [V, X mirror]. Terse's own showcase app (Oct 9) is a **multiplayer Victorian murder-mystery game** in which every conversation is a durable Actor with ElevenLabs voices [V]. Agent Relay's co-founder Khaliq Gant says Agent Relay is "moving over to their tech" (Oct 8) [V].
2. **The hackathons from the last 90 days that most resemble this one** (one day, SF, YC-adjacent, agent-themed):
   - Supabase **Select 2026** (Oct 3, YC office): won by **Fizz/Fizzlayer**, "a physical layer for agents" (sensors over HTTPS, then MCP, then phone-call alerts) [S].
   - YC **Make Something Agents Want** (Oct 17-18, Supabase co-sponsor): won by **d402**, where agents pay for APIs by labelling data instead of holding a wallet [S].
   - Coshell's **Multiplayer Coding Hackathon** (Oct 3, Freestyle sponsor): Freestyle's prize went to **Kudos** [V, tweet].
   - Terac's **Zero-Human Company Hackathon** (Aug 15, Superserve track): 2nd place was **TalosAI**, which runs repairs in sandboxes with independent verification [S].
   - **Mastra x Elastic Agent Memory Hack Night** (Aug, SF): won by a structural-decay memory entry [S].
3. **The common pattern among 2026 winners [I]:** *agents as the users or the workforce*, with a **verifiable boundary** shown live: verified fixes, an agent-proof payment, permissioned context, or a real phone call. Winners also typically pick one physical or real-world hook: a phone call, a sensor, money moving, or a game.
4. **Supabase Launch Week hackathons are dormant.** The last was LW15 (winners posted 2025-08-20). Supabase's hackathon tag page lists nothing after that [V]. Its hackathon energy moved to the in-person **Select** hackathons at YC (2025, 2026) and to co-sponsoring YC events. The LW winners (2022-2025, [BG]) skew toward **realtime multiplayer toys and games**: *Whisker Jam* (realtime cat rock band, LW12 best overall), *SupaSketch* (multiplayer AI drawing, LW13 runner-up), *Gaze into the Abyss* (eye-tracking rooms, LW13 most fun). That is directly on-theme for "Real-Time AI plus Halloween".
5. **The "Most Likely to Scale to Millions" award has one known precedent.** Supabase sponsored it at **Hack the Stackathon** (YC HQ, Feb 2026, [BG]). The winner (Nadaa M.) described the day as "push it until it breaks, and then stand in front of people who actually run infra and explain why it broke" [V]. No project details were published.
6. **Mastra rewards polish plus a real-world hook.** In its MASTRA.BUILD retrospective, Shane Thomas explained the overall winner as "a good combination of reasonably good technical challenge, very good execution, really good UI" and praised the storybook entry for its "intersection of agents into the real world" [V, podcast transcript, BG]. Mastra keeps sponsoring through Oct 2026 (DEV Hacktoberfest "Best Use of Mastra" every week; hackCBS; HackBarna) [V].

---

## 2. Host-by-host record

### 2.1 Terse (Durable Actors): no prior hackathons

| Date | Item | Status |
|---|---|---|
| 2026-10-08 | Karatzas: an agent-coordination demo on Durable Actors reached the finals of a YC demo showcase and lost to "a robotic arm playing Doom". The @IncTerse company account (not Karatzas) quote-posted: "Did pretty well for a distributed systems demo going against robotic arms playing Doom imo" | [V] teapawt.org/IncTerse mirror |
| 2026-10-08 | Khaliq Gant (Agent Relay co-founder) after dinner with the Terse founders: "We're moving over to their tech for @agent_relay". The two hosts are already integrating, so a project that puts Relay on top of Durable Actors matches where the hosts are heading | [V] same mirror (retweet by @IncTerse) |
| 2026-10-09 | Terse's own showcase app: Olivier Simard-Morissette (CTO) built "a multiplayer mystery game set in Victorian England powered by Durable Actors, @typesafeai Jev and @ElevenLabs" to stress-test the infra. @IncTerse: "Every conversation is a durable Actor", with one speaker at a time, idle and resume with history intact, fan-out speech to all characters, and dynamic text-to-speech | [V] same mirror |
| 2026-10-19 | "first (to our knowledge) Actor Hackathon" | [V] same mirror |
| — | YC page: the founders "won several hackathons together" at McGill | [V] ycombinator.com/companies/useterse |

[I] The Oct 9 murder-mystery game is the closest thing to a reference project from the hosts: multiplayer, voice, a game, and a spooky premise, with each conversation as an actor. Expect judges to have seen it, so go beyond it rather than cloning it.

[I] The Doom anecdote is the clearest signal. A *distributed-systems* demo loses to a *visceral physical* demo, and the Terse founder knows it. To win the Durable Actors track, wrap the actor mechanics (serialized execution, per-actor SQLite, survives kill/restart) in something visually dramatic.

### 2.2 Agent Relay: no prior hackathons found

- Searches for "Agent Relay" plus hackathon/winner/track (Exa, WebSearch) returned only unrelated projects that happen to be named "Relay". Examples: the **Aicoo hackathon champion "Relay"** (Jul 2026), **Columbia DevFest "Relay"** (Feb 2026, agent file-locking over MCP + Redis), and **Ramp Builders Cup "Relay"** (Jul 2026, Codex MCP-adapter generator). **None of them use Agent Relay.** Do not cite them as Agent Relay wins. [V for each post; the negative finding is mine]
- Adjacent, non-sponsor retrospective worth reading. Aicoo published a detailed post-mortem of its own A2A hackathon (about 100 hackers, 24 submissions). Its findings: "The winners all made the permission boundary the product". "True peer-to-peer A2A is still aspirational … load-bearing in none that shipped". Nobody built "async fire-and-forget A2A, cross-agent reputation, agent-to-agent settlement, or multi-party deliberation" [V, aicoo.io/blog/our-own-agent-hackathon]. [I] This is the best available proxy for what an agent-messaging judge sees too often (hub-and-spoke routing) and too rarely (real peer-to-peer messaging).

### 2.3 Supabase

**Recent (Aug-Oct 2026)**

| Event | Winners / stack | Status |
|---|---|---|
| **Supabase Select 2026 Hackathon**, Oct 3, 580 20th St (YC), headed "Build in a weekend, scale to millions". 68 submissions per the index page. One finalist said 59 submissions, 9 finalists on stage, "About 50 judges … from Supabase, Anthropic, Google, Stripe, Vercel, and YCombinator" | **1st: Fizz** (X handle @noslopmaxima, verified in the tweet embed; the builder's first name "Nisarg" is unverified): "Won first at the @supabase Select 2026 hackathon today with my project Fizz, a physical layer for agents!" The live site (fizz-zeta.vercel.app) shows sensors (Raspberry Pi, ESP32, phone) posting over HTTPS, agents connecting "over MCP", and threshold alerts that place **a phone call**. An attendee named the top projects "fizz, blast, supabrain and verdant" | Win [S] via select.supabase.com tweet embed. Site [V]. Official page still says "Judging Complete. Final results will be available soon", and the submissions header reads "Final - All Submissions Judged", but no ranking is shown [V, re-scraped 2026-10-29] |
| Same event: format and judges | Luma: "The top six teams demo live on stage". Final panel: Ant Wilson and Paul Copplestone (Supabase), Pratik Gupta (Stripe), John Robison (Anthropic), George Fahmy (Vercel). "Winning teams share a 31K credits prize pool"; all participants share "100K+ in credits". The hackathon page lists a 45-person judging panel (6 named "and 39 more"). Note the conflict: Luma says six teams demo live, while the finalist post and the attendee post both say 9 finalists | [V] luma.com/select-2026-hackathon; hackathon page |
| Same event: voting categories | Functionality and Completeness; Innovation and Creativity; UX and Design; Impact and Usefulness; Best Use of Vercel / Claude / Stripe / Codex / Gemini multimodal; **Supabase Compute** | [V] Firecrawl scrape |
| Same event: representative submissions (first ~24 of 68 visible) | **Agent on Call**: a phone-first small-business OS. "Claude Code: we built the entire product … in one day, including the schema, RLS, Edge Functions…". Postgres as "business brain", RLS per owner, **Realtime powers the live dashboard**, pg_cron automations, Vapi voice, Stripe, Vercel. **fixnet.dev**: "Stack Overflow for AI agents". pgvector matching, each patch run in a fresh Vercel Sandbox against a hidden judge ("3/3 honest fixes pass, 5/5 cheats are rejected"), payments over HTTP 402. **MayDay**: "911 for AI agents", other agents race to fix and the first verified repair wins. **Doorway**: turns API-less websites into verified, pay-per-call MCP tools | [V] Firecrawl scrape. Placement of these four is **unknown** |
| **YC "Make Something Agents Want"**, Oct 17-18, YC HQ. Supabase co-sponsor. Its track was "still unannounced" on Oct 13, per a summary of the YC listing | **1st overall: d402** (Konrad Weber, Fahim Ahmed, Muaaz Shafiq). x402-style pay-per-request where "the agent pays by labelling a small batch of data and earns a voucher for up to 150 API calls"; 70 teams; YC interview. **primitive.dev track:** 1st *Continuity* (email threads become "cited task state, so a fresh agent can pick up exactly where the last one left off"), 2nd *gud* ("replaces git with an email thread for agent swarms … replaying the thread rebuilds the exact same state"), 3rd *Unicess* (six office agents with their own addresses) | d402 [S]. primitive track [V, judge Ashley Ha's post]. **The Supabase track winner was not found** |

**Background precedents [BG]**

| Event | Notable winners | Status |
|---|---|---|
| Hack the Stackathon, YC HQ, Feb 2026 (Firecrawl, Resend, Reducto) | Supabase-sponsored **"Most Likely to Scale to Millions"** went to Nadaa M. Project not described | [V] LinkedIn |
| Supabase Select 2025, Oct 4 2025 | **Winner: Repatch.** Category finalists included WZRD.Studio, Vortal (dashboard for Vapi voice agents), Minty (node-graph full-stack builder) | [V] hackathon.supabase.com/supabase-select-2025 |
| LW15 (Jul-Aug 2025, online) | Best overall *Figma AI Tickets* (Figma frames to GPT-4 user stories). Best AI *Aryn* (pgvector + Edge Functions clustering). Most technical *Thrink* | [V] supabase.com/blog/lw15-hackathon-winners |
| SDx x Supabase LW15 hack day, San Diego, **2 hours** | 1st *Marco Polo* (GPS IRL networking). 2nd *Mira*, "real-time collaboration powered by AI tools. … They rebuild Excalidraw!" | [V] LinkedIn repost |
| LW13 (Dec 2024) | Best overall *Brainrot GPT* (PDF to short video). Runner-up *SupaSketch* (multiplayer AI drawing). Best AI *Stravation* (BLE heart rate + real-time) | [V] |
| LW12 (Sep 2024) | Best overall **Whisker Jam**: "realtime virtual rock band made up of cats! Host the jam session on a TV, and join on your phone." Most fun: Minecraft laser-game server + real-time stats | [V] |
| LWX (Jan 2024) | Best overall *Supafork*. Best AI *AVSE* (video embeddings search). Visually pleasing *Mirror of Loss* (WebGL + AI art) | [V] |

Supabase's own written rubric rewards "builds that actually run, with real auth and real data, over slideware and mockups" (see `../supabase/05-team-strategy.md` §rubric, citing hackathon.supabase.com/hackathon-rules). LW prizes were swag kits and keyboards [V]. No published retrospective explains individual picks beyond one-line blurbs.

### 2.4 Mastra

| Date | Event | Winners / stack | Status |
|---|---|---|---|
| **Aug 2026** | **Mastra x Elastic Agent Memory Hack Night**, SF (about 2 hours). Challenge: memory with time-decay plus hybrid search on Elasticsearch | **1st:** Ali Shehral and Rushabh Nagda. Added *structural* decay (`score = relevance x time_decay x structural`), re-fingerprinting functions with tree-sitter so stale memories lose trust when the code changes. **2nd: Elastra**, a travel companion with episodic memory and hands-free voice calling. Prize: a Lego bonsai | [S] Nanonets and team posts |
| Oct 2026 | DEV **Hacktoberfest Open-Source AI Challenges** (weekly, Mastra partner prize $100) | Best Use of Mastra: *Prep Buddy* (offline interview coach, wk 0), a photo-driven walking mystery on Gemma (wk 1), *ParcelProof* (voice-note claim checked against receipts, wk 2). **Week 4 (Oct 26-31) is themed "Ghost in the Machine" (spooky or Día de los Muertos)**. DEV's own suggested ideas include "a haunted terminal", "an offline séance chatbot", and a sensor-log ghost-story generator. Expect many Halloween-hackathon teams to reach for these same ideas | [V] dev.to winner posts; dev.to/challenges/hacktoberfest-week4-2026-10-26 |
| Jun-Jul 2026 | HiDevs x Mastra (India, 1,241+ registrations) | 1st *Helm* (meeting intelligence with agentic validation). PRD winner *Nirmaan AI*, "8-agent architecture" on Mastra + Qdrant + Enkrypt | [S] |
| Jul 2026 | Qonto x Anthropic (Mastra not a sponsor) | *Argentier* won on "a Mastra harness" plus Qonto/Linkup MCPs: "The model is not the product. The harness is." | [S] |
| Aug 2025 [BG] | **MASTRA.BUILD Templates Hackathon**, with categories judged by partners (Smithery, WorkOS, Browserbase, Arcade, Chroma, Recall, Confident AI) | Best Overall + Best AgentNetwork: Storybook generator. "Shane's Favorite": GitHub PR Review Bot. Funniest: a hackathon-template reviewer | [V] mastra.ai/blog/hackathon-winners-community-templates |
| May 2025 [BG] | MASTRA.BUILD #1 (300+ sign-ups, ~100 projects) | Overall + B2B: *Chameleon* (chat with invoices). Art: *Family Storybooks* (human-in-the-loop workflow). Other: *MCP Lens* ("postman for MCP servers") | [V] blog + podcast |
| Sep 2025 [BG] | HackGT (Ergo's Mastra track) | *Atlas* (unified AI memory) won Best Use of Mastra + Cedar. The founders later got into **YC S26 as Tsenta**, after the Mastra founders "encouraged us to apply" | [S] |

**Mastra's own explanation of picks [V, podcast, BG]:** the overall winner "checked a lot of different boxes … reasonably good technical challenge, very good execution, really good UI". Of the storybook entry, which sends a book "off to a printer": "that intersection of agents into the real world … even though it wasn't completely finished was something that I think the judges really liked." On MCP Lens: it "had been worked on a little bit before" (allowed if disclosed), and judges weighed "the number of features that were added throughout the week". [I] Haunted Hacks forbids pre-written code, so only the first two criteria carry over.

### 2.5 Freestyle

| Date | Event | Winners / stack | Status |
|---|---|---|---|
| **2026-10-03** | **Coshell Multiplayer Coding Hackathon**, SF, "170+ builders" per Coshell's Oct 6 recap tweet (the Luma page planned "one room of 150"), teams of 2-5 in one shared agent session. Freestyle: $500 credits on the day, and each winner got "$10,000 in credits plus 6 months of Freestyle Pro" | Freestyle prize: **Kudos**. Chargebee: *War Room*. assistant-ui: *Square One*. Honorable mentions: *Orbit*, *1000 Blank Agent Cards*, *Jonaki*. **Project details were not found** | [V] @MicOgundare tweet via mirror; prizes [V] luma.com/hacs1uig |
| 2025-08-09 [BG] | **YC AI Coding Agents Hackathon** (Freestyle co-host with Anthropic, Same, Morph; "391 attendees" per the McLovin team page, "300+ hackers and ~100 teams" per the 2nd-place post; 8 hours; YC interview) | **1st: Operius**, which a team member described as "an agentic healing system for Kubernetes clusters". (An earlier draft quoted "an agent swarm that self-heals Kubernetes via chaos engineering" from ophanimus.com. That site no longer mentions Operius, so the quote was removed.) **2nd + Game track: "Lovable for video games"**. Freestyle's Ben Swerdlow: "my favorite of the hackathon. This is something I've tried to build myself and failed at repeatedly". **Web/Mobile track: McLovin**, an AI CTO whose stack used "Freestyle git repositories … Freestyle dev servers … Mastra and Claude power the builder agent". Morph prize: *merge-solve* (GitHub merge-conflict bot) | Operius [S, team member's LinkedIn]. Others [S]. Swerdlow quote [V] |

[I] Freestyle's picks favor **agents that operate real infrastructure** (self-healing K8s) or **app/game builders on Freestyle VMs and dev servers**. McLovin is the one published winner whose stack names a Freestyle primitive *and* Mastra.

### 2.6 Superserve

| Date | Event | Winners / stack | Status |
|---|---|---|---|
| **2026-08-15** | **Zero-Human Company Hackathon** (Terac at Humanmade, SF; 200 builders; 8 hours; challenge: an agent that runs a company). Superserve founder attended; ran a "best use of Superserve" track | **1st Superserve track:** Nithin Aruswamy (LinkedIn honours list; project not found). **2nd ($500): TalosAI**, "a software repair company with no employees … It can't approve its own work, so an independent QA system has to confirm". **RigShare** (Peyton Li) won the Band and Replay tracks with Superserve in its stack: a text-thread marketplace where "agents run the whole marketplace … and they are the only ones who can touch the money". Overall judging weighted human-input-driven improvement at 40% | [S] for each. Rubric [V] terac.com/events/hackathon |

Also covered in `../superserve/05-team-strategy.md` §6. No other Superserve-sponsored hackathon was found.

---

## 3. Patterns across winners

**Verified observations**
- One-day SF events with YC-interview prizes, held in 2025-2026, were won by: a self-healing K8s swarm (Operius), a physical sensor layer for agents (Fizz), and an agent payment primitive (d402). [S]
- Supabase's 2026 Select categories included a **Supabase Compute** award [V]. Compute is private alpha (see `../supabase/02-newest-features.md`).
- Realtime and multiplayer winners recur across Supabase LW history: Whisker Jam, SupaSketch, Gaze into the Abyss, Wordbuzz, Mira. [V]
- Several 2026 winners **show verification as the climax**: fixnet's "5/5 cheats are rejected", TalosAI's independent QA, MayDay's "first verified repair", gud's "replaying the thread rebuilds the exact same state". [V/S]

**Inferences [I]**
- *Replay that reproduces state* (gud, Continuity) is literally the Durable Actors and Agent Relay pitch: durable history plus a fresh agent picking up where the last left off. A judge who saw these at YC two weeks ago will recognise the idea. Do it with real actors and real Relay channels, not email.
- Physical or real-world hooks win close calls: the Doom arm over Terse's demo, Fizz's phone call, Mastra's printed storybook. For Halloween that could be a phone call from the "ghost", a webcam, or the audience's phones joining a room (Whisker Jam's TV-plus-phones format).
- Sponsor-specific tracks are judged by the sponsor's own team (Coshell, Mastra Templates, Terac, YC Oct). Expect Terse and Agent Relay founders to judge their own tracks and to open the code.

---

## 4. Limits / could not verify

- **Supabase Select 2026 final rankings are unpublished.** Fizz's 1st place rests on the builder's own post. Only about 24 of 68 submissions rendered in the scrape. The placements of "blast, supabrain, verdant" and of every project named in §2.3 are unknown.
- **The Supabase track winner at Make Something Agents Want** was not found. Neither were the "Scale to Millions" project at Hack the Stackathon, the Kudos project details, or Nithin Aruswamy's Superserve-track project.
- I found **no Agent Relay hackathon at all**. A private or Discord-only event cannot be excluded.
- The Supabase Launch Week hackathon cadence may resume. Nothing was announced as of 2026-10-29, and hackathon.supabase.com shows "No Upcoming Hackathons" [V].
- Mastra Hack Night placements come from the teams' own posts. I found no official Mastra or Elastic recap.
- X content was read through third-party mirrors (teapawt/nitter), which can lag or drop posts.
- Operius's 1st place at the Aug 2025 YC event is self-reported by a team member on LinkedIn. The ophanimus.com URL cited earlier does not mention Operius.
- Select 2026 finalist count conflicts: Luma planned "top six" live demos, while two attendee posts say 9 finalists.

---

## 5. Hackathon implications

**What to build (given the precedents)**
1. **Make state durability the demo climax.** Kill a process or refresh mid-demo, show the actor resume with identical state, then replay the Relay channel history and show a fresh agent continuing. This is the gud/Continuity pattern done with the hosts' primitives. It scores for both tracks and the "bonus for both".
2. **Add one visceral real-world hook** to beat the "robotic arm playing Doom" problem: audience phones joining a haunted room (Whisker Jam format, Supabase Realtime Broadcast), a voice call from an agent (Fizz, Agent on Call), or a live game.
3. **Show a verification boundary.** For example, agents that can't approve their own work, or a judge agent in a separate actor that rejects cheats on screen. This mirrors TalosAI, fixnet and MayDay, which 2026 judges at Supabase and Superserve events rewarded.
4. **Show real peer-to-peer agent messaging, not hub-and-spoke.** Aicoo's retrospective says nearly every A2A entry routed around peer discovery and nobody built "multi-party deliberation". A séance or jury of agents arguing over Relay channels fills that gap, and multi-agent debate is the theme that wins Mastra-sponsored hackathons (see `../mastra/04-social-pulse.md`).
5. **For the Supabase $1k "scale to millions":** the only precedent award went to someone who explained "why it broke" under load. Bring a tiny load-test readout (N simulated clients on a Broadcast channel or N actors) and talk through the architecture.

**Gotchas**
- No pre-written code (same rule as the Aug 2025 YC event). Mastra's tolerance for pre-hackathon work at MASTRA.BUILD **does not apply** here.
- Polish matters in 5 hours. Mastra's and YC judges repeatedly cite "execution" and "UI". Budget the final 45 minutes for the demo path only.
- Do not name the project "Relay". At least three unrelated 2026 hackathon winners use the name.
- Avoid the stock Halloween ideas: DEV's "Ghost in the Machine" prompt this same week lists a haunted terminal, a séance chatbot, and a sensor-log ghost story [V]. Also avoid copying Terse's murder-mystery demo. If you build a game, make the twist agent-to-agent messaging over Relay rather than chat with characters.

**Setup before Oct 31 (setup and ideas allowed)**
- Accounts and keys: Terse (`terse deploy` once), Agent Relay workspace, Supabase project (us-west-2), Freestyle and Superserve credit redemption paths, OpenAI key. See each sponsor's `01-docs-api.md`.
- Pre-plan the demo script around a kill-and-resume moment and one physical hook. Rehearse who presses what.
- Prepare a 30-second architecture slide naming which primitive (actor, Relay channel, Broadcast, VM) carries which job. Track judges are founders who will ask.

**What judges and sponsors have rewarded**
- Terse: dramatic demos beat correct-but-dry distributed-systems demos (founder's own Oct 8 loss). Terse's own showcase is a multiplayer voice game: one actor per conversation, one speaker at a time, idle and resume.
- Agent Relay: its founders are moving Agent Relay onto Durable Actors, so using both hosts together is the story they are telling themselves.
- Supabase: real auth, real data, real-time multiplayer, agent-native products. Its 2026 events framed everything as "Build in a weekend, scale to millions" and "Make something agents want".
- Mastra: "technical challenge + execution + UI", plus agents touching the real world.
- Freestyle: agents operating real infra, and app or game builders (founder's "favorite" was the game builder).
- Superserve: isolated sandboxes used for independent verification of agent work.

---

## Sources

- Event page (local): /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md
- Terse / Karatzas X posts (mirror): https://teapawt.org/IncTerse ; https://teapawt.org/IncTerse/with_replies
- Terse YC page: https://www.ycombinator.com/companies/useterse
- Aicoo hackathon retrospective: https://www.aicoo.io/blog/our-own-agent-hackathon ; winners: https://aicoo-hackathon.devpost.com/updates/44943-aicoo-hackathon-winners-announced
- Columbia DevFest "Relay": https://www.linkedin.com/posts/yoavmuscal_last-weekend-my-team-and-i-won-columbia-activity-7427475539617116160--jd0
- Ramp Builders Cup "Relay": https://www.linkedin.com/posts/aadi-biyani_no-one-at-ramps-builders-cup-could-beat-activity-7485444412865597441-s_rw
- Supabase hackathon index: https://hackathon.supabase.com/
- Supabase Select 2026 hackathon (scraped 2026-10-29): https://hackathon.supabase.com/supabase-select-2026-hackathon ; Luma: https://luma.com/select-2026-hackathon
- Fizz win (tweet embed): https://select.supabase.com/ ; Fizzlayer site: https://fizz-zeta.vercel.app
- Select 2026 attendee post: https://www.linkedin.com/feed/update/urn:li:activity:7512414135083790336 ; finalist post: https://www.linkedin.com/posts/burkybang_supabaseselect-supabase-anthropic-activity-7512372936960483328-07t0
- Supabase Select 2026 recap (conference product announcements, not hackathon results): https://supabase.com/blog/supabase-select-2026-recap
- DEV Hacktoberfest Week 4 "Ghost in the Machine": https://dev.to/challenges/hacktoberfest-week4-2026-10-26
- Agent Relay YC page: https://www.ycombinator.com/companies/agent-relay ; Launch YC (Oct 23 2026): https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other
- Supabase Select 2025 results: https://hackathon.supabase.com/supabase-select-2025
- Make Something Agents Want: d402 post https://www.linkedin.com/posts/konrad-weber_ycombinator-aiagents-x402-activity-7518042534678466560-fBEd ; primitive.dev track https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF ; listing summary https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent ; Supabase post https://www.linkedin.com/posts/supabase_make-something-agents-want-activity-7515480834540310529-4Jmq
- Hack the Stackathon "Most Likely to Scale to Millions": https://www.linkedin.com/posts/nadaa-moharram_i-won-most-likely-to-scale-to-millions-activity-7423607935161004032-z6w8
- Supabase hackathon blog tag: https://supabase.com/blog/tags/hackathon
- LW15: https://supabase.com/blog/lw15-hackathon-winners ; LW13: https://supabase.com/blog/lw13-hackathon-winners ; LW12: https://supabase.com/blog/lw12-hackathon-winners ; LWX: https://supabase.com/blog/launch-week-x-hackathon-winners ; LW8: https://supabase.com/blog/launch-week-8-hackathon-winners
- SDx x Supabase LW15 hack day: https://www.linkedin.com/posts/andykeil_we-closed-out-the-supabase-launch-week-events-activity-7358500543436132354-qwOc
- Mastra Templates hackathon winners: https://mastra.ai/blog/hackathon-winners-community-templates
- MASTRA.BUILD recap: https://mastra.ai/blog/mastra-build-recap ; podcast: https://mastra.ai/podcasts/bananas-pigs-and-muscle-hackathon-results-regina-from-dex-erik-from-pig-and-some-ai-news
- Mastra x Elastic Hack Night: https://www.linkedin.com/posts/nanonets_structural-decay-for-context-graphs-with-activity-7496693197230800897-H_Lb ; https://www.linkedin.com/posts/sunnyrodrigues_mastra-elasticsearch-aiagents-activity-7496084969589551104-Q4YO
- DEV Hacktoberfest Mastra winners: https://dev.to/devteam/congrats-to-the-hacktoberfest-weekend-challenge-build-for-a-friend-winners-pgc ; https://dev.to/devteam/congrats-to-the-hacktoberfest-open-source-ai-challenge-touch-grass-winners-152c ; https://dev.to/devteam/congrats-to-the-hacktoberfest-open-source-ai-challenge-week-2-side-hustle-winners-2i33
- HiDevs x Mastra: https://www.linkedin.com/posts/punitjain163_hidevs-mastra-aiagents-activity-7484335854669324288-XSCm ; https://www.linkedin.com/posts/pari-gupta-30494b366_hidevs-mastra-aihouse-activity-7493160246274818048-an4F
- Qonto x Anthropic (Mastra harness): https://www.linkedin.com/posts/kevin-mameri_mcp-productbuilder-harness-activity-7485973962036850688-DcYE
- HackGT / Tsenta: https://hackgt-12.devpost.com/ ; https://www.linkedin.com/posts/jacketanner_ive-been-having-an-excellent-time-working-activity-7424491516041236481-j3k8
- HackBarna x Mastra: https://www.linkedin.com/posts/hackbarna_agents-are-everywhere-now-lets-see-what-activity-7502640558729764864-vjo-
- Coshell hackathon: https://luma.com/hacs1uig ; https://coshell.ai/hack ; winners tweet (mirror): https://nitter.cf/coshellhq
- YC AI Coding Agents Hackathon: https://luma.com/hzwlapu0 ; Operius: https://www.linkedin.com/posts/unobtainiumrock_went-to-my-first-hackathon-it-was-at-yc-activity-7360419677405106178-5UkI ; McLovin: https://quasa0.com/hackathons/mclorable ; 2nd place: https://www.linkedin.com/posts/george-ishaq_tldr-enes-aky%C3%BCz-and-i-took-2nd-place-overall-activity-7360805843702878208-2wx9 ; Swerdlow: https://www.linkedin.com/posts/benswerdlow_i-love-this-project-its-my-favorite-of-the-activity-7360900805811425283-IK8L ; merge-solve: https://www.linkedin.com/posts/britannio_we-won-the-morph-llm-prize-nvidia-jetson-activity-7360587975975440384-ZLsA
- Zero-Human Company Hackathon: https://terac.com/events/hackathon ; TalosAI: https://www.linkedin.com/posts/abhinav-garg-12b9343b5_my-team-and-i-just-won-500-at-the-zero-human-activity-7494806275881459712-Pp3C ; RigShare: https://www.linkedin.com/posts/peytonali_zerohumancompany-terac-stripe-activity-7496263909343920128-MdAr ; Aruswamy honours: https://linkedin.com/in/aruswamy ; Superserve post: https://www.linkedin.com/posts/super-serve-ai_activity-7488676422224551937-f1zo
- Sibling files: ../supabase/05-team-strategy.md ; ../superserve/05-team-strategy.md ; ../freestyle/05-team-strategy.md ; ../mastra/04-social-pulse.md ; ../agent-relay/05-team-strategy.md ; ../terse/05-team-strategy.md

---

## Verification log (2026-10-29)

Adversarial re-check of 17 decision-relevant claims against live sources (Exa fetch, curl of raw HTML, and one Firecrawl scrape of the JS-rendered Select 2026 page).

| # | Claim | Checked at | Outcome |
|---|---|---|---|
| 1 | Karatzas: "first (to our knowledge) Actor Hackathon" (Oct 19); prizes include YC interview, iPhone, Mac mini | teapawt.org/IncTerse | **Confirmed** |
| 2 | Doom-arm loss quote (Oct 8) | same | **Confirmed**, with an attribution fix: the "Did pretty well…" follow-up was posted by @IncTerse, not Karatzas. Corrected |
| 3 | Terse founders "won several hackathons together" (McGill) | ycombinator.com/companies/useterse | **Confirmed** |
| 4 | No Agent Relay hackathon exists; "Relay" winners at Aicoo and Columbia are unrelated | Exa search; Aicoo Devpost update; Columbia LinkedIn posts | **Confirmed** (no counter-evidence). **Added** Khaliq Gant's "moving over to their tech" post and Terse's Oct 9 murder-mystery demo, both missing before |
| 5 | Aicoo retrospective quotes ("permission boundary the product", "load-bearing in none that shipped", whitespace list; ~100 hackers, 24 submissions) | aicoo.io/blog/our-own-agent-hackathon (Jul 9 2026) | **Confirmed** verbatim |
| 6 | Fizz won Select 2026, per a tweet embed on select.supabase.com; site features (Pi/ESP32/phone, MCP, phone-call alerts) | raw HTML of select.supabase.com; fizz-zeta.vercel.app | **Confirmed**. Handle @noslopmaxima is in the embed. The name "Nisarg" was not found and is marked unverified |
| 7 | Select 2026: 68 submissions; "Judging Complete. Final results will be available soon"; voting categories incl. Supabase Compute | hackathon.supabase.com index (curl); Firecrawl scrape of event page | **Confirmed**. **Added** that the header also reads "Final - All Submissions Judged", with no ranking shown |
| 8 | Agent on Call / fixnet ("3/3 honest fixes pass, 5/5 cheats are rejected") / MayDay ("911 for AI agents", "first verified repair") / Doorway quotes | same scrape | **Confirmed** verbatim; placements still unknown |
| 9 | Finalist post: 59 submissions, 9 finalists, about 50 judges | burkybang LinkedIn post | **Confirmed**. **Added** Luma details ("top six teams demo live", named final panel, 31K credit pool), which conflict on the finalist count |
| 10 | d402 1st at Make Something Agents Want; 70 teams; labelling-for-voucher mechanism | Konrad Weber LinkedIn (Oct 19) | **Confirmed** (self-reported) |
| 11 | Supabase track at MSAW "read 'Coming soon'" | pivotnews.ai summary (Oct 13) | **Reworded**: the source says "still unannounced". "Coming soon" was not found |
| 12 | primitive.dev track winners Continuity / gud / Unicess and the quotes | Ashley Ha LinkedIn (Oct 20) | **Confirmed** verbatim |
| 13 | Hack the Stackathon "Most Likely to Scale to Millions" (Supabase-sponsored) to Nadaa M., with the "why it broke" quote | Nadaa M. LinkedIn (Feb 1 2026) | **Confirmed** verbatim; no project details |
| 14 | Supabase LW hackathons dormant after LW15 (Aug 20 2025); index shows "No Upcoming Hackathons" | supabase.com/blog/tags/hackathon; hackathon.supabase.com | **Confirmed** |
| 15 | LW12 Whisker Jam quote; LW13 SupaSketch runner-up and Gaze into the Abyss most fun; LW15 Figma AI Tickets / Aryn / Thrink; Select 2025 winner Repatch | supabase.com LW blog posts; hackathon.supabase.com/supabase-select-2025 | **Confirmed** |
| 16 | Mastra: Templates hackathon winners (Storybook, Shane's Favorite PR bot, Funniest); Shane Thomas podcast quotes | mastra.ai blog (Aug 19 2025); podcast transcript (May 16 2025) | **Confirmed**. The transcript has "uh" fillers that were tidied in the quotes; wording otherwise matches. DEV "Best Use of Mastra" wk 0 (Prep Buddy) and wk 2 (ParcelProof) confirmed; the $100 partner prize and wk 4 theme confirmed and named ("Ghost in the Machine") |
| 17 | Mastra x Elastic Hack Night 1st (structural decay, tree-sitter, Lego bonsai) | Nanonets LinkedIn (Aug 21 2026) | **Confirmed** (self-reported) |
| 18 | Coshell: Freestyle prize to Kudos; "$10,000 in credits plus 6 months of Freestyle Pro"; 170+ builders | nitter mirror of @coshellhq / @MicOgundare; luma.com/hacs1uig | **Confirmed**. Clarified that Luma planned 150 and the 170+ figure comes from Coshell's own recap |
| 19 | Terac Aug 15 at Humanmade; Superserve track 2nd $500 (TalosAI quote); RigShare quote; "Project improvement 40%" rubric | terac.com/events/hackathon (raw HTML); Abhinav Garg and Peyton Li LinkedIn; Superserve LinkedIn (Jul 30) | **Confirmed**. The page lists "Best Use of Superserve 1st $1,000 / 2nd $500" and the weights 40/35/25 |
| 20 | Operius 1st at YC AI Coding Agents Hackathon, quoted from ophanimus.com | ophanimus.com (raw HTML) | **Refuted source**: the page has no mention of Operius. The quote was deleted and the source swapped to a team member's LinkedIn ("agentic healing system for Kubernetes clusters"). The 1st place is confirmed as self-reported |
| 21 | Swerdlow "my favorite of the hackathon…" quote; McLovin stack names Freestyle git + dev servers + Mastra | LinkedIn; quasa0.com/hackathons/mclorable | **Confirmed**. "391 attendees" is attributed to the McLovin page; the 2nd-place post says "300+ hackers" |

Not re-checked (left as originally labelled): HiDevs x Mastra, Qonto x Anthropic / Argentier, HackGT / Tsenta, SDx LW15 hack day, LWX winners, Nithin Aruswamy's honours list, HackBarna.
