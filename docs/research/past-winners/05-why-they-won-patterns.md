# Why they win: patterns across short AI hackathons with live demos

> **Researched 2026-10-29** for Haunted Hacks (YC office, Sat 2026-10-31; 5 h build, 11:00-16:00; top entries demo live; judging on Builderbase). This is the **synthesis** layer. It compares winners with non-winners at the same events and pulls out what decided the result. The event-by-event catalog lives in [01-yc-hackathons.md](01-yc-hackathons.md), so this file only repeats facts it needs for an argument.
>
> **Labels.** **[V]** = verified against a host or sponsor recap, an official event page, or the winner's own public post (cited). **[I]** = my inference. No event in this corpus published judge scorecards, so every "why" is inference, with a confidence level. Items dated before Aug 2026 are marked **[background]**.
>
> **Corpus.** 9 one-day events from Aug-Oct 2026, 5-8 h of build each, all with live or on-stage finals. Plus 2 background events used for contrast. ~650 submissions in total.

---

## 1. The short answer

In these 9 events, winners almost always did the same **five things at once**. Non-winners at the same event usually missed one or two of them.

| # | Factor | What it looks like on stage | Evidence | Confidence |
|---|---|---|---|---|
| 1 | **Every host primitive does a visible job in the product.** The sponsor is the mechanism, not a footnote. | Crate: "every Duo feature does something musical": the hinge is the FX knob, the two screens are the pads plus sequencer, and the back screen is a light show. Kevin "emails the leasing office from his own inbox" (the recap does not name the provider; AgentMail was a co-host, so AgentMail is likely but **[I]**). QM Motion extends the host's own product (QM) and saves to GBrain. | Bitrig, Neon, Own Your Intelligence (OYI) winners [V] | **High** |
| 2 | **One physical or multi-party moment that happens in the room** | A fold triggers a drop (Crate). A sensor reading leads to a phone call (Fizz). Robot-dog faults captured by voice (Fleetbrain). A roommate group chat (Kevin). | Bitrig, Supabase Select, OYI, Neon [V] | **Medium-high** |
| 3 | **A hard before/after number on screen** | "0/30 → 29/30" and "blocked in 1.8 s" (49th Labs, 2nd). "Cost per ticket fell 66%" (Support AGI, 3rd). "a beat in 0.3s" (Crate). "under 100ms" (MenuSafe). | OYI, Bitrig, Accel Amsterdam [V] | **Medium-high** |
| 4 | **The first sentence says who it's for and what it does.** Context comes later. | "Email a capybara a wish, get a working app back" (Wishybara, 3rd). "A roommate assistant that lives in the house group chat" (Kevin, 1st). "Your team's 49th engineer, trained on your other 48." | Neon, OYI recaps [V]; judge guidance [V] | **Medium** |
| 5 | **Narrow scope that works live, end to end, through bad Wi-Fi** | Neon's own recap says teams "shipped through a dying Wi-Fi network". At c0mpiled-2, "WiFi failed during submissions" [background]. | [V] organiser recaps | **High** (as a necessary condition) |

**What did *not* tell winners apart:**
- **Merely using the sponsor stack.** At OYI, 90 of 91 submissions tagged a sponsor side quest, and GBrain appeared in 65 of them (71.4%) [V]. Usage is the baseline everyone meets.
- **Voice on its own.** Fly.io's CEO saw "a significant %" of hacks use voice [V]. It wins only when voice is the payoff of a real-world trigger (Fizz, Scamurai, CareLoop).
- **Team size.** Many grand prizes went to solo builders: QM Motion and 49th Labs (OYI), Fizz (Supabase Select), and ATO Copilot (DC) [V].

This matches the scopewatch round-2 synthesis of *video-judged* Devpost events (`~/hackathons/scopewatch/docs/research/winners/WHY_THEY_WON.md`): **sponsor fit first, overall quality second, depth of integration last.** The difference at live-demo events is that factor 2, something that happens in the room, adds weight the video format never rewarded.

---

## 2. Corpus: the matched set

| Event (date) | Build time | Field → finalists | Winner (1st) | Notable non-winner(s) used for matching |
|---|---|---|---|---|
| **Bitrig Hacks iPhone Duo**, YC office (Sep 26) | 11:30-15:30 (4 h) [V] | 73 projects; 157-161 participants (Devpost, press) or "about 300" (a participant's post). Counts conflict. → 8 finalists, "top 6" per another finalist [V] | **Crate** | "Human" fold-CAPTCHA (top 6, not placed); Bend, Foldtales, Arden (gallery, no placement) |
| **Own Your Intelligence**, YC (Sep 27) | 13:15-17:00 (~3.75 h) [V] | 91 submissions, 16 prizes [V] | **QM Motion** (solo) | AgentPalace, Command & Control, Barrier (used 4-6 sponsors each, no prize) |
| **Supabase Select 26 Hackathon**, YC office (Oct 3) | ~6 h, per a participant [V] | 59 submissions per a finalist; DYAD's author says he joined "59 other teams" (~60); 68 per the Supabase portal (unverified on re-check). → 9 finalists (two attendees) vs "top six" (Luma). "About 50 judges" per a finalist. Counts conflict. [V] | **Fizz** ("a physical layer for agents") | DYAD (Oura ring + agent vitals; not a finalist, by the author's own post) |
| **Build Personal Agents** (Neon/Mastra et al.), Terra Gallery (Oct 4) | 10:30-16:30 minus lunch (~5.25 h) [V] | 71 projects → top 6, 2-min pitch + 1-min Q&A [V] | **Kevin** (roommate agent in a group chat) | Supa Neo (won only the CodeRabbit open-source side quest) |
| **Codex Community Hackathon** (Runloop/OpenAI/Tenor) (late Aug) | "six hours" [V] | 100+ builders → 3 winners [V] | **Groundtruth** (checks PR claims against the running app) | n/a |
| **YC × Medplum Agentic Healthcare**, YC office (Aug 1) | 10:00-17:00 [V] | 160+ hackers [V] | **Lamina** | MedTrace AI (People's Choice = most YouTube views, not a judged place) |
| **Pax Silica (Builderbase-run)**, SF (Oct 7) | "one afternoon", due at 4:00 [V] | Finalists named [V] | **Talkie Walkie / Bastion** (scam-ad takedown) | Merkle-tree lab custody, TrustLedger (finalists, not placed) |
| **Accel AI Innovate Amsterdam (Builderbase)** (late Sep) | 1 day [V] | 70+ teams [V] | **Scamurai** (real-time scam-call cutoff) | n/a |
| **Mastra × Elastic Memory Hack Night** (Aug 19) | ~2 h [V] | 34 participants [V] | Structural-decay memory (Nanonets) | n/a |
| *[background]* Aicoo A2A hackathon (Jul) | weekend | 24 submissions [V] | **Relay** (agent-to-agent broker) | 3 off-theme projects with no Aicoo use |
| *[background]* c0mpiled 1, 2, 10 (Feb-Apr) | ~4 h | 32-65 submissions | various | organiser post-mortems only |

---

## 3. Natural experiments (where the causal evidence is strongest)

| Comparison | Outcome | What it shows | Conf. |
|---|---|---|---|
| **Crate vs. the "Human" fold-CAPTCHA** (both used the hinge, both reached the finals) | Crate 1st; CAPTCHA top 6, no place | The CAPTCHA used one feature for one gimmick. Crate mapped *every* platform feature to a user job ("two screens become a display and pads, the hinge becomes a filter, and the back screen becomes a light show for the crowd") [V]. **Breadth of sponsor-primitive mapping beat a single clever trick.** The criterion was "creative, thoughtful use of iPhone Duo's new APIs" [V]. | Medium |
| **OYI grand prize vs. the 4-6-sponsor projects** (Barrier tagged all 6; AgentPalace and C&C tagged 4) | None of those placed; the 1st-3rd winners all showed a measured delta | In a field where almost everyone used sponsors, **a quantified result decided it**: 29/30 held-out, 66% cost drop, pixel-diff before/after [V]. Ticking more sponsor boxes did not help. | Medium-high |
| **Kevin / Mutual / Wishybara vs. the other 68 Neon entries** | All 3 placed teams are multi-party or have a character | Kevin lives in a *group* chat; Mutual coordinates "between you and the people in your life"; Wishybara is a capybara with its own inbox [V]. The challenge was "personal agents", yet the winners made them **social**. A judge (Fly.io CEO) named the qualities as "Domain Depth" and "Surprise & Taste … 'Whoa! Your agent can do THAT?!'" [V]. | Medium |
| **Supa Neo (Neon)**: self-healing cloud-browser chore runner with live view and approval gate | Won only the $10k CodeRabbit open-source side quest | The strongest *engineering* story (it "repairs itself when the website changes") landed a side prize, not a top-3 place [V]. **Technical depth wins the technical side prize; the grand prize goes to the clearest human story.** | Medium |
| **Fizz vs. DYAD (Supabase Select)**: both bridge agents and the physical or bodily world | Fizz 1st; DYAD not a finalist | Fizz's product line is a complete loop: "Connect any sensor, ask about it in plain English, and get a call when something goes wrong" [V, but this is the fizzlayer.com tagline as of Oct 29, not confirmed as the on-stage pitch; the winner's own Oct 4 post only says "a physical layer for agents"]. DYAD swaps vitals both ways with no action at the end [V; the gap is inference]. **A loop that ends in an action beats a dashboard.** The c0mpiled organisers saw the same [background]: "Winners built visionary autonomous systems, not just dashboards." | Medium |
| **Thomas Karatzas's (Terse CEO) agent-coordination demo vs. a robotic arm playing Doom** at a YC demo showcase (early Oct) | He lost in the finals | His own words: "lost in the finals to a robotic arm playing Doom" [V, X via mirror]. Even the host knows **invisible infrastructure loses to visible spectacle** in a live room. Actors need a visible face. | High (as a risk) |
| **Aicoo Relay vs. the field** [background] | Champion | Per the host's analysis, "The winners all made the permission boundary the product". True peer-to-peer A2A was "load-bearing in none that shipped" [V]. Relay also **dogfooded**: it was built by 4 parallel Claude Code sessions that coordinated through the sponsor's product [V]. | Medium |

---

## 4. Sponsor-integration depth: what "depth" means when judging is live

1. **Depth as judges see it means mapping, not lines of code.** Crate is the cleanest case: each platform capability becomes a user-visible verb [V]. In the scopewatch code audits, winners' sponsor code was often shallow or late, and it still won because the *role* was clear on screen (see the scopewatch file, §5). Nothing in this corpus contradicts that. **[I]**
2. **Extending the host's own product is a strong move.** QM Motion (OYI 1st) is a QM tool that also writes to GBrain. Both are host products, and Garry Tan's GBrain is the event's own lineage [V]. Air_RSI and Countinghouse also won by extending QM or GBrain [V]. Translation for Oct 31: Terse and Agent Relay judges will reward something that looks like **a showcase they would put on their own landing page**. Terse's own showcase demos are a multiplayer Victorian murder mystery where "Every conversation is a durable Actor" (fan-out speech, idle-then-resume history, one speaker at a time), and a "tiny Lovable" built with Durable Actors that "maybe … becomes a software factory" [V].
3. **The hosts are already coupled.** Agent Relay's CTO said publicly, "We're moving over to their tech for @agent_relay" [V]. So "use both" is not an arbitrary bonus. **Relay as the agents' nervous system and Durable Actors as their bodies and memory** is the architecture both founders already believe in. **[I], high**
4. **Side prizes go to the deepest single integration; the grand prize goes to the best whole story.** Seen at Neon (Supa Neo; note Neon's rules said "Any submitted team can win, including a top-three team", so side prizes were not exclusive there), OYI (side-quest winners differ from the top 3 except GM and Countinghouse), and Bitrig (TranslateCat won RevenueCat, not a top-3 place) [V]. On Oct 31 the iPhone (Durable Actors) and Mac mini (Agent Relay) are effectively side prizes. **One project can target the grand prize plus one track. Targeting both tracks dilutes the demo beat** (consistent with scopewatch's finding that "the number of sponsors … diluted the sponsor beat"). **[I]**
5. **Builderbase scoring is weighted and per-criterion.** The API exposes `criterion_weight`, slider scoring mode, a `team_problem` field shown on each judge assignment, and participant-visible feedback [V, developers.builderbase.com]. Builderbase markets "blind scoring" and "instant tiebreakers" [V]. **[I]** A pre-screen probably narrows the field to the live finalists (the event page says "top entries will demo live"), so the **written `team_problem` sentence and the submission are what earn the stage**. Write it like a headline.

---

## 5. Demo structure: what the formats imply

**Observed formats [V]:**
- Neon: top 6, **2-min presentation + 1-min Q&A**.
- Bitrig: 8 finalists across a 90-min demos-and-judging block.
- Supabase: "top six teams demo live on stage".
- OYI: video plus judging (judging "took a lot longer than what was scheduled").
- c0mpiled organisers [background]: "1-minute demos were too short, 2 minutes is ideal, 3 minutes is too long."

Haunted Hacks has **one hour (16:00-17:00) for judging plus live demos**, so expect a pre-screen and then ~6-8 finalists at ~2-3 min each **[I]**.

**Template from the winners and the judge guidance:**

| Time | Beat | Grounding |
|---|---|---|
| 0:00-0:10 | **One declarative sentence**: "X is a ___ that ___ for ___." No market size. | dev.to judge notes: teams that opened with context "lost ground" [V]. Supabase founders' Q&A takeaway: "How you pitch yourself in the first sentence matters" [V, attendee post]. |
| 0:10-0:20 | The human or physical stake, with one number | 49th Labs, Support AGI, Ringdown ("81 minutes … against a 30-minute standard") [V] |
| 0:20-1:30 | **Live run.** The audience or a judge triggers it (a phone, a fold, a message). Show the sponsor primitive deciding something, labelled on screen. | JetBrains judges (Jun 2026, [background]): Jono Bacon's rule, paraphrased by the author, is that you must show something working within about 90 seconds [V]. Crate's hinge drop; Fizz's phone call [V]. |
| 1:30-2:00 | Proof panel: the before/after number, and the actor/relay log as evidence | OYI winners [V]; Aicoo Relay's `GET /api/proof` endpoint, which "reports every Aicoo endpoint Relay calls plus live activity counts" [V, Relay GitHub README; not in the Aicoo blog] |
| 2:00-2:30 | One line each: "Durable Actors are ___; Agent Relay is ___", plus why it scales | **[I]**, adapted from scopewatch's "3-word job per sponsor" |
| Q&A | Have an honest answer ready to "what breaks first?" | dev.to judge notes [V]; JetBrains: "Be very direct about what works, what doesn't" [V] |

**Insurance:** record a 60-second capture of the working flow before 15:30, because "Wifi fails at most events I judged" [V, dev.to, Jul 2026, background]. Neon's 250-person room had "dying Wi-Fi" [V].

---

## 6. Storytelling patterns that recur in winners

- **Personify the agent.** Kevin (a named roommate), Wishybara (a capybara), and "the 49th engineer" are characters the room remembers and repeats [V names; the effect is **[I]**]. Halloween gives a free costume for this: a haunted-house of agents, a séance of agents, ghosts that are actors.
- **Flip a familiar frame.** "Slack assumes a human reads every message. Relay flips the default" [V, background]. "LinkedIn for healthcare AI agents" (Lamina, 1st) [V]. A one-line analogy lets judges file the project in about 5 s. **[I]**
- **Close the loop in the physical world.** Scamurai "cuts the call and alerts family members" [V]. Fizz calls you [V]. Ringdown phones the charge nurse [V]. Ending on a real-world action beats ending on a chart (the dashboard pattern above).
- **Dogfood the sponsor while building.** Aicoo Relay: "the same pattern that powers the product also ran the build" [V]. On Oct 31, a team whose own Claude Code/Codex sessions coordinated over Agent Relay during the hack has a true, demonstrable meta-story that Relay's founders will love. **[I]**
- **Consumer delight still wins at a dev-infra event.** Crate (music), Duo-Man (nostalgia), and Kevin (roommates) beat the more "serious" entries [V placements]. This only works when the infra still does visible work. **[I]**

---

## 7. Hidden factors

1. **Judge identity.** Karatzas judged Bitrig, where the winner saturated the platform's primitives [V]. He builds demos as games and app builders, not dashboards [V]. Agent Relay's Will Washburn is described by a friend as someone who "knows how to put on a show" [V]. Expect taste for **showmanship plus primitives used correctly** (one request at a time, durable state, a websocket per actor). **[I], medium**
2. **A pre-screen gates the stage.** Supabase had 59-68 submissions for 6-9 slots, and Bitrig 73 for 8 [V]. The clearest documented mechanics are Neon's: "4:30–4:45 PM: Judges review the submissions and together pick the top 6 teams", i.e. ~15 minutes to cut 71 projects to 6, then "2-minute presentation, 1-minute Q&A" [V, luma.com/build-agents]. Haunted Hacks has a similar 4:00-5:00 judging hour. If your written submission is weak, the live demo never happens. **[I]**
3. **Solo and duo builders are competitive.** In the c0mpiled DC event [background], the solo winner (ATO Copilot) "submitted first at 9:05pm, pitched with a voice agent, and scored 10/10" [V; but the same article's Prizes section says it was pitched with "a Google Vids–generated walkthrough", so the voice-agent detail is internally inconsistent]. With AI coding tools, team size matters less than scope discipline. **[I]**
4. **The theme words matter.** The Haunted page lists "Software Factory, long-running agent, multiplayer AI system" [V]. At Neon, all three winners hit "multiplayer"; at OYI, winners hit "own your model" with held-out evals [V]. Pick one of the three phrases and say it out loud.
5. **The Supabase "scale to millions" prize** will be judged by people who just ran a conference on "from day one to millions of users" and "your app's MCP server … RLS policies" [V, Supabase Select recap]. Show RLS, Realtime and a load number, not just "uses Postgres". **[I]**

---

## 8. Limits / could not verify

- **No scorecards or rubric weights** were found for any event in the corpus. All causal claims are inferred from placements.
- **Field and finalist counts conflict** across sources: Bitrig (157 / 161 / ~300 participants; 6 vs 8 finalists) and Supabase (59 vs 68 submissions; 6 / 8 / 9 finalists). I report both.
- **The full finalist list is not public** for Supabase Select, Bitrig, Medplum or Neon. I could not confirm whether DYAD, Bend or Agent on Call reached any stage beyond their authors' own statements.
- **I did not watch demo videos** or read winners' code for this file, so integration depth is judged from descriptions. The scopewatch audits suggest descriptions overstate depth.
- The **YC demo-showcase result** (Karatzas vs. the Doom robot arm) comes from his post via an X mirror (teapawt). I could not find a primary event page.
- The Haunted Hacks **judges, Builderbase rubric criteria and finalist count were not announced** as of 2026-10-29.
- The **Codex Community Hackathon** date and format come from one winner's LinkedIn repost of the organiser's recap.

---

## 9. Hackathon implications (Oct 31)

**What to build (shape, not idea):**
- A **multiplayer or multi-agent system where each agent or room is a Durable Actor** (durable state, one request at a time, websocket fan-out), and **agents negotiate or hand off over Agent Relay**.
- The **audience triggers it live**, by joining from their phones or sending a message to an agent's address.
- It **ends in a real-world action** (a phone call, an email, a PR, a physical light or sound), and it has **one character** with a Halloween skin.
- Map every primitive to a visible job, Crate-style. For example:
  - "**Actor = a haunted room that remembers.**" Kill the server mid-demo and the room resumes with history intact.
  - "**One request at a time = no two ghosts grab the same soul.**" Show the race that *doesn't* happen.
  - "**Relay = how the ghosts whisper to each other.**" A live message log on screen.

**Gotchas:**
- Don't use more than 2 hero sponsors in the demo beat; extra sponsors go in the README.
- Don't end on a dashboard.
- Don't spend the first 30 s on context.
- Don't rely on venue Wi-Fi. Bring a hotspot and a pre-recorded 60-s fallback.
- Don't fake the agent-to-agent part. Judges here built the product, and Aicoo found real A2A was "load-bearing in none that shipped". Make your Relay traffic real and visible.
- Durable Actors interleaving is off by default ("we don't interleave requests on await by default", Karatzas, Oct 7). Opt in per method with the `@Interleave` decorator only where you need it (e.g. accepting new sockets while a reply streams). Demo the default as the feature; don't fight it.
- Two install paths exist and they differ: the docs quickstart uses `bunx terse-cli@latest install` → `terse init <name> --template counter` → `terse actor dev` / `terse actor generate` / `terse deploy` with `terse-sdk/actor` imports; the GitHub README uses `bunx durable-actors init` / `bunx durable-actors dev` with `durable-actors` imports. Pick one before the event. Both need Bun ≥ 1.4.2. A Python SDK shipped Oct 12.
- Agent Relay also has two paths: the desktop app (Google sign-in, device code, per-session "Receives messages" toggle, addresses like `name@your-computer`, cross-machine within one workspace) and the open-source CLI (`relay init`, a local private server with no account, sessions named `<tool>-<folder>`). For a multi-laptop team demo, use the hosted workspace; `relay init` alone is single-machine.

**Setup before Oct 31 (ideas are allowed; code must be written at the event):**
- Install Bun ≥ 1.4.2 and the Terse CLI (`bunx terse-cli@latest install`), create a Terse API key, and install the Agent Relay desktop app (agentrelay.com/download) and/or CLI (`curl -fsSL https://raw.githubusercontent.com/AgentWorkforce/relay/main/install.sh | bash` or `npm install -g agent-relay`, then `relay init`). Get every teammate into the same Relay workspace.
- Run both quickstarts once on throwaway code, then delete it.
- Pre-provision OpenAI, Supabase, Freestyle and Superserve keys.
- Write the one-sentence pitch and the Builderbase `team_problem` line.
- Pick which theme phrase you'll say ("multiplayer AI system" is the best-evidenced).
- Rehearse the first 10 seconds out loud.

**What judges and sponsors want:**
- **Terse**: actors as the obvious right primitive (state, concurrency, websockets).
- **Agent Relay**: agents talking without a human "meat proxy". Its YC launch says "Don't be a meat proxy", so show a human removed from the loop.
- **Supabase**: a scale story with numbers.
- **YC partners**: a crisp user, a crisp number, and something that feels like a company. Fizz incorporated within a week (unverified on re-check; what is verified is that by Oct 29 Fizz had become "Fizzlayer" with a waitlist site and an official X account).

---

## Sources

- Haunted Hacks event page (local capture): `/Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md`; Luma mirrors https://luma.com/yc-meetup-7183-9316f87f, https://luma.com/builde-oxba
- Bitrig Hacks: https://luma.com/yc-meetup-4378 · https://bitrig-hacks-duo-edition.devpost.com/ · https://bitrig-hacks-duo-edition.devpost.com/project-gallery · https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html · https://handheld.guru/apple-iphone-duo-hackathon-reveals-apps-using-hinge-for-audio-and-translation/ · https://www.linkedin.com/posts/steven-zhang-44114a244_we-won-1st-place-at-the-y-combinator-bitrig-activity-7510360950768562176-vw4e · https://www.linkedin.com/posts/benjamin-nisevich_we-just-killed-captcha-at-ycs-hackathon-activity-7510100128687579136-mBqt · https://www.linkedin.com/posts/gergana-dragoeva-quievy_yesterday-i-literally-moved-into-a-coat-activity-7510474243281793024-Qq50
- Own Your Intelligence: https://www.compiled.sh/articles/yc-own-your-intelligence-hackathon · https://www.linkedin.com/posts/agokulakrishna_y-combinator-is-hosting-the-own-your-intelligence-activity-7505801391307706368-6_0Z · https://www.linkedin.com/posts/aliabbaskhalfan_we-won-1st-at-the-yc-hackathon-the-theme-activity-7510769103880572928-YKB5
- Supabase Select 26: https://luma.com/select-2026-hackathon · https://hackathon.supabase.com/ · https://supabase.com/blog/supabase-select-2026-recap · https://nitter.rdrama.net/noslopmaxima · https://www.linkedin.com/posts/burkybang_supabaseselect-supabase-anthropic-activity-7512372936960483328-07t0 · https://www.linkedin.com/posts/adamasafcoury_just-wrapped-up-my-first-hackathon-and-what-activity-7512367771201159168-_A7r · https://www.linkedin.com/posts/localfitevents_activity-7512418713594171392-PO58 · https://www.linkedin.com/posts/rakhatbek-zholdoshkanov_i-happy-to-announce-that-me-and-karim-baba-activity-7512378274354782208--izf
- Build Personal Agents: https://build-personal-agents.com · https://luma.com/build-agents · https://www.linkedin.com/posts/scottcjohnston_really-inspired-by-all-the-great-hacks-at-activity-7513779298210648064-sjIm · https://www.linkedin.com/posts/sudhersankv_techcrunchdisrupt-aiagents-buildinpublic-activity-7516973039293517824-mbt4
- Codex Community Hackathon: https://www.linkedin.com/posts/kjazayeri_thank-you-openai-runloop-ai-and-tenor-activity-7500389238996271104-Q7-w
- YC × Medplum: https://www.medplum.com/blog/yc-medplum-hackathon-2026-recap · https://www.medplum.com/blog/yc-medplum-hackathon-2026 · https://www.linkedin.com/posts/ethan-bell-434a47260_really-grateful-that-our-team-took-1st-place-activity-7490229512429789184-E_6y
- Builderbase events: https://www.linkedin.com/posts/shanmukhsain_sftechweek-sftechweek-paxsilica-activity-7514732008430833664-_rmc · https://www.linkedin.com/posts/builderbase-labs_aiinnovate-hackathon-ai-activity-7510741710172467200-HrXw · https://developers.builderbase.com/reference/judging/ · https://builderbase.com/
- Mastra × Elastic: https://agent-memory-hack-night.devpost.com/ · https://www.linkedin.com/posts/nanonets_structural-decay-for-context-graphs-with-activity-7496693197230800897-H_Lb
- Aicoo [background]: https://www.aicoo.io/blog/our-own-agent-hackathon · https://github.com/s-k-28/relay
- c0mpiled post-mortems [background]: https://www.compiled.sh/articles/c0mpiled-1-before-the-ballot-post-mortem · https://www.compiled.sh/articles/c0mpiled-2-the-adaptive-city-post-mortem · https://www.compiled.sh/articles/c0mpiled-10-dc-ai-for-government · https://www.compiled.sh/articles/c0mpiled-16-ucsd-hackathon
- Hosts: https://teapawt.org/IncTerse (Terse/Karatzas/Gant posts, mirror of X) · https://www.useterse.ai/ · https://www.ycombinator.com/companies/useterse · https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other · https://agentrelay.com/docs/quickstart · https://github.com/AgentWorkforce/relay/ · https://www.linkedin.com/posts/paul-jump_haunted-hacks-real-time-ai-edition-activity-7518313439392387074-oiYp
- Judge guidance: https://blog.jetbrains.com/ai/2026/06/how-to-win-a-hackathon-notes-from-the-judging-table/ · https://dev.to/kurbaitaev/what-judges-actually-score-notes-from-a-year-of-hackathon-judging-3p4l
- Prior synthesis: `/Users/charlie/hackathons/scopewatch/docs/research/winners/WHY_THEY_WON.md`
- Added during verification: https://docs.useterse.ai/quickstart · https://github.com/TerseAI/durable-actors · https://www.ycombinator.com/companies/agent-relay · https://www.ycombinator.com/founders/khaliq-gant · https://www.linkedin.com/posts/scottcjohnston_really-inspired-by-all-the-great-hacks-at-activity-7513779298210648064-sjIm · https://hackathon.supabase.com/supabase-select-2026-hackathon · https://nitter.rdrama.net/AntWilson/status/2106803568779088313 (mirror of Fizz win post) · https://www.linkedin.com/feed/update/urn:li:activity:7512414135083790336 · https://www.linkedin.com/posts/karim-baba-130547289_ended-up-winning-the-stripe-track-with-raha-activity-7512373718036148225-WXSD

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live sources. **Confirmed** = matched the primary source; **Corrected** = edited in place above; **Unverified** = marked as such.

| # | Claim | Source checked | Outcome |
|---|---|---|---|
| 1 | OYI: 91 submissions; 90 of 91 tagged a side quest; GBrain in 65 (71.4%); QM Motion and 49th Labs solo; 49th Labs "0/30 → 29/30" and "blocked in 1.8 s"; Support AGI "cost per ticket fell 66%"; Barrier tagged all 6, AgentPalace 4; "Judging took a lot longer than what was scheduled" | compiled.sh OYI article (published 2026-10-16) | **Confirmed** |
| 2 | Neon: 250 hackers, 71 projects, 11 judges, "shipped through a dying Wi-Fi network"; Kevin/Mutual/Wishybara 1-3; Supa Neo won $10k CodeRabbit; top 6, 2-min + 1-min Q&A | build-personal-agents.com; luma.com/build-agents | **Confirmed**. Added: judges cut 71 → 6 in a 15-min window (§7.2); side quests open to top-3 teams (§4.4). Kevin's "AgentMail" attribution was **corrected** to inference |
| 3 | Fly.io CEO: voice "a significant %", "Domain Depth", "Surprise & Taste … 'Whoa! Your agent can do THAT?!'" | Scott Johnston LinkedIn, 2026-10-08 | **Confirmed** |
| 4 | Karatzas "lost in the finals to a robotic arm playing Doom" | teapawt mirror of @karatzas_thomas, Oct 8 | **Confirmed** (mirror only; still no primary event page) |
| 5 | Agent Relay CTO: "We're moving over to their tech for @agent_relay" | teapawt mirror (Khaliq Gant, Oct 8); YC founder page lists Gant as CTO | **Confirmed** |
| 6 | Durable Actors don't interleave on await by default | Karatzas launch post Oct 7; durable-actors README (`@Interleave` opt-in) | **Confirmed**; added the opt-in decorator name |
| 7 | Terse showcase quotes ("Every conversation is a durable Actor"; tiny Lovable that "maybe … becomes a software factory") | teapawt mirror of @IncTerse (Oct 9) and @karatzas_thomas (Oct 19) | **Confirmed** |
| 8 | Setup commands `bunx terse-cli@latest install` and `relay init` | docs.useterse.ai/quickstart; AgentWorkforce/relay README via gh | **Confirmed**, but **added** that there are two different install paths per product (docs vs README; desktop app vs local CLI) |
| 9 | Builderbase API: `criterion_weight`, slider scoring mode, `team_problem`, participant-visible feedback | developers.builderbase.com/reference/judging | **Confirmed** (`super_event_scoring_mode: "slider"`; weights 0-1 summing to ≤ 1.0; judge comment hidden, `feedback` shown) |
| 10 | Aicoo: "The winners all made the permission boundary the product"; network primitive "load-bearing in none that shipped"; 4 parallel Claude Code sessions; "the same pattern that powers the product also ran the build" | aicoo.io blog (now redirects to yourcoo.ai), 2026-07-09 | **Confirmed** [background] |
| 11 | Aicoo Relay `GET /api/proof` | Aicoo blog: not present. s-k-28/relay README: present | **Corrected** attribution to the GitHub README |
| 12 | Fizz 1st at Supabase Select ("a physical layer for agents"); quoted loop sentence | @noslopmaxima Oct 4 post via mirror; fizzlayer.com tagline Oct 29 | Win **confirmed**. Loop sentence **corrected**: it is the current site tagline, not confirmed as the stage pitch |
| 13 | "Fizz incorporated within a week" | Searched; no source found | **Unverified**, marked |
| 14 | Supabase Select field: 59 submissions, 9 finalists, Luma "top six"; founders' "How you pitch yourself in the first sentence matters"; DYAD not a finalist, ~6 h | Adam Smith and Adam Asaf Coury LinkedIn posts; Luma; attendee post (activity 7512414135083790336) | **Confirmed**; added "about 50 judges" and "59 other teams". The 68-submission portal count was not re-checked. Official hackathon window: Sat Oct 3, 15:00-00:30 UTC (hackathon.supabase.com) |
| 15 | Supabase recap phrases "from day one to millions of users"; app MCP server with "RLS policies" | supabase.com/blog/supabase-select-2026-recap | **Confirmed** |
| 16 | Bitrig: 11:30-15:30 build; criterion "creative, thoughtful use of iPhone Duo's new APIs"; Karatzas was a judge; Crate quotes ("every Duo feature does something musical", "a beat made in 0.3 seconds") | luma.com/yc-meetup-4378; Steven Zhang LinkedIn 2026-09-28 | **Confirmed** |
| 17 | Medplum: 160+ hackers; Lamina 1st ("Linkedin for Healthcare AI Agents"); People's Choice = most YouTube views | medplum.com recap (2026-08-03) and pre-event post | **Confirmed** |
| 18 | Will Washburn "knows how to put on a show" | Paul Jump LinkedIn, 2026-10-20 (Washburn replied "I'm nervous.") | **Confirmed** (friend's promo post, so weak evidence about judging taste) |
| 19 | Agent Relay launch "Don't be a meat proxy" | YC Launch page (2026-10-23) | **Confirmed** |
| 20 | Judge guidance: JetBrains "within about 90 seconds" / "Be very direct about what works, what doesn't"; dev.to "Wifi fails at most events I judged", "The teams that lost ground opened with context", "what breaks first" | JetBrains blog (2026-06-22); dev.to (Jul 27) | **Confirmed**, re-labelled [background]. "90 seconds" is the author's paraphrase, not a direct quote |
| 21 | c0mpiled: "1-minute demos were too short, 2 minutes is ideal, 3 minutes is too long"; "Winners built visionary autonomous systems, not just dashboards"; "WiFi failed during submissions" | c0mpiled-2 post-mortem (published 2026-02-11, 64 submissions / 144 participants) | **Confirmed** [background] |
| 22 | c0mpiled DC solo winner "pitched with a voice agent" | c0mpiled-10 article | **Corrected**: the article contradicts itself (voice agent vs Google Vids walkthrough) |

**Repo stats at check time (gh API, ~2026-10-30 05:00 UTC):** TerseAI/durable-actors 291 stars; AgentWorkforce/relay 1,059 stars; both pushed within the hour, so both are under active development the night before the event. Expect breaking changes; pin versions on the day.

**Still not verifiable:** Haunted Hacks judges and Builderbase rubric weights (not announced); whether Haunted Hacks will pre-screen in Builderbase before demos (inferred from Neon/Bitrig/Supabase precedent); Bitrig participant counts; the Codex Community Hackathon details (single LinkedIn source).
