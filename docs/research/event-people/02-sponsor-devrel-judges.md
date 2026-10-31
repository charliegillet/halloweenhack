# Likely judges and attendees: hosts, sponsors, YC (Haunted Hacks, Oct 31 2026)

> Researched 2026-10-29. Angle: who is likely to judge or be in the room from Terse, Agent Relay, OpenAI, Supabase, Mastra, Freestyle, Superserve and YC; what they posted recently; and whether judges have been announced. Tools: Exa search/fetch, WebSearch, one Firecrawl live scrape (Builderbase event page), and X posts read through Nitter mirrors (nitter.rdrama.net, teapawt, twiscan, xitter.cf), not x.com. **[V]** = verified on the cited page. **[I]** = my inference. Items before Aug 2026 are marked *background*. Sponsor company strategy is covered in `../<sponsor>/05-team-strategy.md`, and I only repeat it here where it bears on a person.

---

## 1. Bottom line

1. **No judges have been named anywhere as of 2026-10-29.** I checked five places. The YC page says "Judges will be announced soon" ([YC event](https://events.ycombinator.com/haunted-hacks-2026)). The Builderbase page, scraped live today, has an empty **"Meet the judges"** section ([Builderbase](https://builderbase.com/event/haunted-hacks-2026)). The YC Luma mirror says the same ([Luma](https://luma.com/yc-meetup-7183-9316f87f)), and so does the Builderbase Luma ([Luma](https://luma.com/builde-oxba)). The hosts' X feeds since Oct 19 have no judge announcement (section 4). [V]
2. **The live Builderbase page has the actual rubric, and it isn't on the YC page.** There are five criteria, **each scored 1 to 5**. The **top 8 finalists demo live for 2 minutes each** ([Builderbase](https://builderbase.com/event/haunted-hacks-2026)). [V] Section 2 has the details.
3. **That rubric is almost word for word the one from Bitrig Hacks** (YC office, Sep 26 2026). Bitrig Hacks was hosted by **Bitrig (S25)**, not Terse, and sponsored by YC, OpenAI, RevenueCat, Sentry and Supabase. Its eight judges included **Terse CEO Thomas Karatzas, YC GP Brad Flora and OpenAI's Ari Weinstein**, plus Bitrig's CEO and a RevenueCat partnerships lead, so sponsors did sit on that panel ([Devpost](https://bitrig-hacks-duo-edition.devpost.com/), [Luma](https://luma.com/yc-meetup-4378)). [V] So expect the same mix here: host founders, one YC partner, one person from OpenAI, and a few from the sponsors. [I]
4. **The most likely judges, ranked by evidence** (section 3):
   - Almost certain: Karatzas and Simard-Morissette (Terse), and Washburn and Gant (Agent Relay).
   - Likely: one YC partner. The obvious candidates are the hosts' own primary partners, **Aaron Epstein** (Terse) and **Grey Baker** (Agent Relay), or a GP who judges hackathons often.
   - Plausible: **Ari Weinstein** (OpenAI), **Ben Swerdlow** (Freestyle) and **Pavitra Bhalla** (Superserve).
   - Unknown: Supabase and Mastra. For Mastra, the person most likely to be in the room is its contracted SF DevRel, **Dan Goosewin**. [I]

---

## 2. The rubric (verified, live Builderbase page, 2026-10-29)

Source: [builderbase.com/event/haunted-hacks-2026](https://builderbase.com/event/haunted-hacks-2026) (Firecrawl live fetch, `maxAge: 0`).

| # | Criterion (verbatim heading) | What it asks (quoted or close paraphrase) |
|---|---|---|
| 1 | **Use of Real-Time AI and Track Technology** | "How meaningfully does the project use AI in real time? For the Terse and Agent Relay track prizes, how effectively does it use the corresponding technology?" |
| 2 | **Originality and Creativity** | "How fresh and inventive is the idea? Does it demonstrate an unexpected or creative use of real-time AI?" |
| 3 | **Execution and Demo** | "functionality, polish, and how clearly and convincingly the demo communicates the concept" |
| 4 | **User Experience and Design** | "Is the experience intuitive, cohesive, and thoughtfully designed?" |
| 5 | **Potential and Impact** | "Does the project address a meaningful problem or demonstrate a compelling use case? Could the idea be developed further into something useful?" |

Format: "Each criterion is scored 1 to 5. The top 8 finalists demo live for 2 minutes each." The page also says "Teams are up to 4 people." [V]

The Bitrig rubric had the same five headings, with "Use of iPhone Duo" in slot 1 ([Devpost](https://bitrig-hacks-duo-edition.devpost.com/)). [V] **[I]** It looks like a YC-events template that hosts adapt. Two of the five criteria (UX/Design and Potential/Impact) have nothing to do with infrastructure. A clever backend that looks bad on the projector gives up about 40% of the score.

Small differences between the pages [V]: Builderbase's logo strip shows all five sponsors, but its "About" text names only four (no Superserve). Its prize and per-participant lists leave out everything from Freestyle and Superserve: the $10k and $1k grand-prize credits and the $100-per-attendee credits. It also drops the Terse quickstart link from "New to Actors?", and it says spots are requested and approved on the YC page, not on Builderbase. The YC page and the YC Luma include $10k Freestyle and $1k Superserve inside the grand prize, plus $100 per attendee from each. The YC page is the canonical one. The Builderbase JSON-LD names **"Agent Relay"** as organizer ([Builderbase](https://builderbase.com/event/haunted-hacks-2026)), so Agent Relay probably runs the Builderbase setup. [I]

---

## 3. People, ranked by how likely they are to judge or attend

### 3a. Hosts: near certain to be in the room and on the panel [I, strong]

| Person | Role | Evidence of presence | Recent public interests (Aug to Oct 2026) |
|---|---|---|---|
| **Thomas Karatzas** (`@karatzas_thomas`) | Terse co-founder/CEO; ex-Staff Engineer at Apple (Siri / Apple Intelligence) ([YC](https://www.ycombinator.com/companies/useterse)) | Oct 19 post: "drink some coffee made by me" at the hackathon ([mirror](https://teapawt.org/karatzas_thomas/status/2112219511327965403)). Judged Bitrig Hacks on Sep 26 ([Luma](https://luma.com/yc-meetup-4378)) | Terse YC launch, posted Oct 28 to 29. The mirror shows the posts as 15h and 3h old on Oct 29: "This is our YC launch. I talk about armies of tiny servers" and the pinned "You are probably building Multiplayer AI Wrong... MIT Open Source + Cloud hosted version available". A cloud beta shipped with it: `bunx terse-cli@latest install`. Oct 26: "a durable, horizontally scalable coding agent platform... Sandboxes, pi, Durable Actors". Oct 19: "a tiny Lovable with @pidotdev durable, @modal and @IncTerse Durable Actors... Maybe it becomes a software factory". Oct 8: his agent-coordination demo "almost won me the @ycombinator demo showcase. lost in the finals to a robotic arm playing Doom" ([Nitter](https://nitter.rdrama.net/karatzas_thomas), [@IncTerse](https://nitter.rdrama.net/IncTerse)) |
| **Olivier Simard-Morissette** (`@oliviersm199`) | Terse co-founder/CTO; ex-Pigeon (W23), Squarespace, NYT ([YC](https://www.ycombinator.com/companies/useterse)) | Oct 22: "We are hosting a hackathon at @ycombinator , with sponsorship from @OpenAI , @supabase and @mastra... Come enjoy some scary fast AI apps, a costume contest" ([Nitter](https://nitter.rdrama.net/oliviersm199)) | Oct 9: built a **multiplayer Victorian murder-mystery game** on Durable Actors with Jev and ElevenLabs as a stress test. In it, every conversation is an actor, one person speaks at a time, and speech fans out to every character. Oct 12: shipped the **Python SDK**. Oct 14: demo night ("A groundbreaking 3 people knew what an actor was!") ([@IncTerse](https://nitter.rdrama.net/IncTerse)) |
| **Will Washburn** (`@willwashburn`) | Agent Relay co-founder/CEO; 14 years at Tailwind ([YC](https://www.ycombinator.com/companies/agent-relay)) | Co-host. The Builderbase listing names Agent Relay as organizer | Launched Agent Relay Oct 23 (~96k views). Oct 28: "we're getting rid of PRs on a lot of our repos". On shared sessions: "very soon it will be weird NOT to share your sessions in a professional setting". Reads Khaliq's prompts through "Grokbot... from the relay" ([Nitter](https://nitter.rdrama.net/willwashburn)) |
| **Khaliq Gant** (`@Khaliqgant`) | Agent Relay co-founder/CTO; ex-founding engineer at Nango (W23) ([YC](https://www.ycombinator.com/companies/agent-relay)) | Promoted the event: "Want to dig into agent to agent communication? This hackathon is for you" ([mirror](https://teapawt.org/Khaliqgant/status/2112219340422721818)) | Oct 24: "My grok bot talks to my dot which interacts with my instinct. A true team of personal agents". Oct 8: "We're moving over to their tech [Terse] for @agent_relay". Oct 27: proposed talk "Agent Led Development" ([Nitter](https://nitter.rdrama.net/Khaliqgant)) |

**[I] What this means:** the two host teams are openly converging. Agent Relay says it is moving onto Terse. A project where **Relay is the messaging layer and Durable Actors are the state** shows their joint thesis back to all four of them. Their own demos are games (the murder mystery), coding-agent platforms and personal-agent swarms. Karatzas lost a YC showcase to "a robotic arm playing Doom", so he knows what wins a room.

### 3b. YC: one partner likely, identity unknown

The prize is a "guaranteed YC interview", and in past events of this kind at least one YC partner was on the panel. [V for precedent, I for this event]

| Candidate | Why plausible | Recent public interests |
|---|---|---|
| **Aaron Epstein** (GP, `@aaron_epstein`) | **Terse's primary partner** ([YC](https://www.ycombinator.com/companies/useterse)) [V] | Design-focused. On Lightcone (Oct 22): "animation that actually reinforces the point that you're trying to make" and "You should be talking about your product who should use it why why it's valuable" ([Real Alpha](https://realalpha.app/people/aaron-epstein/)). Oct 23: interviewed Farza on launch videos ("why you should always be launching") ([mirror](https://teapawt.org/aaron_epstein/status/2113683578651615294)). Oct 2: boosted Conductor Mobile ("Slide to Merge from anywhere") ([mirror](https://xitter.cf/aaron_epstein/status/2105818202873921812)) |
| **Grey Baker** (GP) | **Agent Relay's primary partner** ([YC](https://www.ycombinator.com/companies/agent-relay)) [V]. Co-founded Dependabot (acquired by GitHub). Made GP on Jun 16 2026 ([YC blog](https://www.ycombinator.com/blog/chris-golda-and-grey-baker-general-partners)) *background* | Developer-tools builder. I did not collect any recent posts |
| **Brad Flora** (GP) | Judged Bitrig Hacks on Sep 26, a YC-office event hosted by Bitrig that shares this rubric ([Luma](https://luma.com/yc-meetup-4378)) [V] | No relevant recent posts collected |
| **Jon Xu** (GP, `@xuster`) | "I'll be judging" the Manufact MCP hackathon at YC, Feb 2026 ([mirror](https://nitter.cf/xuster/status/2020923920745103791)) *background*. He is also the office-hours prize at the c0mpiled series ([Luma](https://luma.com/compiled-8lsr)) | Ex-CTO of FutureAdvisor ([YC](https://www.ycombinator.com/people/jon-xu)) |
| **Nemil Dalal** (Visiting Partner, `@nemild`) | Hosted YC's "Make Something Agents Want" (Oct 17–18) ([mirror](https://xitter.cf/nemild/status/2098048890717212871)) and judged B@BHacks (Oct 2026) ([LinkedIn](https://www.linkedin.com/posts/mason-arditi_excited-to-announce-nemil-dalal-y-combinator-activity-7514196352567013376-J0SW)) | "Agents are replacing humans as users, coders, and decision makers" (Sep 10). Background in crypto and x402 ([YC](https://www.ycombinator.com/founders/nemil-dalal)) |

**[I]** Epstein is the single most useful YC person to prepare for. He is Terse's partner and the most public about design taste. A demo that *explains itself visually*, with a clear user, problem and value, is what he praises. That lines up with rubric criteria 4 and 5.

### 3c. OpenAI: one person likely, identity unknown

OpenAI pays for all placing prizes ($5k, $2.5k and $1k in credits). The pattern at the sibling event was a senior product person, not a DevRel. [V for precedent]

- **Ari Weinstein** (`@AriX`, X bio "Computer Use & Frontier Interfaces @OpenAI". Latent Space lists him as "Product & Engineering, Computer Use at OpenAI" and says he is "leading all the amazing CUA progress". I could not verify a formal "Head of" title). He judged Bitrig alongside Karatzas ([Luma](https://luma.com/yc-meetup-4378)), and both are ex-Apple. Recent: Sep 4, "With Astra, ChatGPT is nearly 2x faster at computer use". Aug 13, "Computer History in ChatGPT". Aug 20, native iMessage integration ([twiscan](https://twiscan.com/en/x/AriX)). On Latent Space (Sep 30): Computer Use is "180 degrees different", and the show notes say agents are "learning to debug and recover from failures" (episode summary, not a transcript quote) ([Latent Space](https://lspace.beehiiv.com/p/devday-2026)). **[I]** Of everyone at OpenAI, he has the best evidence for coming back. He would reward agents that *act* (computer use, Dots-style per-agent computers) and recover from failure on stage.
- **Romain Huet** (Head of Developer Experience) judged Cerebral Valley's GPT-6 Astra hackathon in SF on Sep 8 ([Cerebral Valley](https://cerebralvalley.ai/e/openai-gpt-6-astra-sf)). [V] His stance is in `../openai/05-team-strategy.md`.
- **Charlie Guo** (OpenAI; "YC S13" is unverified) gave the OpenAI session and the credits at an AWS Loft hackathon on Jul 30 ([AWS Builder Center](https://builder.aws.com/post/3HHU3UEMBfKKxw1LFwNUAO2KLK2_p/how-to-build-a-video-agent-with-neo4j-twelvelabs-and-strands-agents)) *background*. He also speaks at Codex community events ([GarysGuide](https://www.garysguide.com/events/l9am65x/Codex-Community-Hackathon)).
- **Saptarshi Banerjee** (Applied AI Specialist Architect, OpenAI) judged two SF hackathons in Sep and Oct 2026: tokens& Long Horizon Agents, Sep 25 ([LinkedIn](https://www.linkedin.com/posts/vivianamarquez_hackathon-day-tomorrow-sf-register-activity-7508982288672808960-XpWd)), and Cyberdefense Hackathon, Oct 9 ([Mimetic](https://events.trymimetic.com/events/sf/cyberdefense-hackathon-oct-2026)). [V] **[I]** He is the kind of solutions person OpenAI sends to credit-sponsored events.

### 3d. Freestyle: founder judging is plausible

- **Ben Swerdlow** (`@benswerd`, CEO). He judged the semifinals of the **Supabase AI hackathon at YC** in Nov 2024 ([Supabase blog](https://supabase.com/blog/ai-hackathon-at-y-combinator)) *background*. In Aug 2025 he reshared his favourite project at a YC hackathon (see `../freestyle/05-team-strategy.md`). Recent: launched **Brood War Bench** (Sep 21): "Codex plays cheese and confuses the opponents" ([Nitter](https://nitter.rdrama.net/freestyle_dev)). Freestyle also sent judges to c0mpiled-14 at Berkeley on Oct 17 ([Devpost](https://c0mpiled-14.devpost.com/)). [V]
- **Jacob Zwang** (`@theshortjacob`, CTO). "17 more servers to rack" (Jul 17) ([Nitter](https://nitter.rdrama.net/freestyle_dev)) *background*.
- **[I]** Freestyle's $10k sits inside the grand prize, so it votes on the overall winner, not a track. Games and benchmarks with parallel agents on forked VMs fit Ben's taste.

### 3e. Superserve: founder attendance plausible

- **Pavitra Bhalla** (`@pavitrabhalla`, sole founder/CEO). In August he showed up in person at a hackathon to award a Superserve track (see `../superserve/05-team-strategy.md`). Recent: Oct 23, "@superserve_ai has the fastest cold starts, snapshot starts and fan-out burst creates. Zero failures" (citing aisandboxbench). Oct 24: Superserve became a machine provider in Omnara. Oct 26: "AWS costs ~52% more" ([Nitter](https://nitter.rdrama.net/pavitrabhalla)). [V] **[I]** He would notice fan-out (many sandboxes spun up live) and secrets handling.

### 3f. Supabase: who comes is unknown

- The founders judge their own hackathons. **Copplestone and Wilson** judged Select on Oct 3 ([Palaner/Luma copy](https://palaner.com/events/luma-61208c918c)), and judged with YC partners at the Nov 2024 YC hackathon ([Supabase event](https://supabase.com/events/supabase-ai-hackathon-at-y-combinator)) *background*. [V]
- At YC hackathons Supabase co-sponsors, it often doesn't publish a judge. Its "Make Something Agents Want" track still read "Coming soon" five days before the event ([Pivot News](https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent)). [V]
- Supabase is co-running a **Builderbase** hackathon in NYC on Nov 4 ([LinkedIn](https://www.linkedin.com/posts/builderbase-labs_nyctech-hackathon-supabase-activity-7516144189311643649-u9NL)). [V] That points to an existing relationship with the judging platform.
- **[I]** The "$1K most likely to scale to millions" prize may be picked by the hosts' panel rather than a Supabase person in the room. Make the scale story easy to read without one: RLS, multi-tenant structure, per-actor fan-out.

### 3g. Mastra: likely a field DevRel, not a founder

- **Dan Goosewin** runs Mastra's SF Bay Area field program through his agency. Sam Bhagwat: "It is very, very hard to find someone as good at DevRel as Goose. We tried to hire him, but he wanted to make an agency, so we hired his agency" ([Goosewin case study](https://www.goosewin.com/customers/mastra)). He **judged a Mastra × Elastic hack night** in SF on Aug 19 2026, where one criterion was "shows agent traces using Mastra Studio" ([Devpost](https://agent-memory-hack-night.devpost.com/)). [V]
- Founders Sam Bhagwat, Abhi Aiyer and Shane Thomas are profiled in `../mastra/05-team-strategy.md`. I found no evidence of them judging in-person SF hackathons in Aug to Oct 2026. [I]
- **[I]** If a Mastra person judges, the precedent says they will look for **Studio traces on screen**. Mastra's prize is "Mastra Platform" months for the top three, so it carries little weight in the vote.

---

## 4. Did anyone announce judges? (checked 2026-10-29)

| Source | Result |
|---|---|
| events.ycombinator.com/haunted-hacks-2026 | "Judges will be announced soon" ([page](https://events.ycombinator.com/haunted-hacks-2026)) |
| builderbase.com/event/haunted-hacks-2026 (live) | Rubric present; "Meet the judges" header with **no entries** ([page](https://builderbase.com/event/haunted-hacks-2026)) |
| Luma (YC mirror, Builderbase mirror) | Same "announced soon" text ([1](https://luma.com/yc-meetup-7183-9316f87f), [2](https://luma.com/builde-oxba)) |
| Host X feeds (Karatzas, Simard-Morissette, Washburn, Gant, @IncTerse, @agent_relay) | Promotional posts Oct 19 to 22. **No judge posts** through Oct 29 ([Nitter](https://nitter.rdrama.net/karatzas_thomas)) |
| Aggregators (hackathonradar, CompeteHub) | Stale copies. hackathonradar still says "We will be using devpost!" ([hackathonradar](https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026)). **Ignore it**: Builderbase is current |
| LinkedIn search ("Haunted Hacks" judging) | Nothing found |

**[I]** At Bitrig, the judges appeared on the Luma page before the event. Here, Builderbase's empty "Meet the judges" block will probably fill in Oct 30 or 31. Check it Friday night.

---

## 5. Limits / could not verify

- **No confirmed judge for any company.** Everything in section 3 beyond the hosts is inference from precedent.
- I read X through mirrors only. Counts and relative dates ("3h") are as of the fetch, and some mirrors drop replies. I did not run `last30days`, because this angle is identity, not sentiment.
- I could not find who represented OpenAI, Supabase or Mastra at "Make Something Agents Want" (Oct 17–18), or whether a YC partner judged its main prize. Ashley Ha credits "YC Nemil Dalal for hosting" ([LinkedIn](https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF)).
- Freestyle's YC primary partner was not checked. Superserve's (Max Kolysh) comes from the sibling file `../superserve/05-team-strategy.md` and was not re-verified here.
- Grey Baker's and Brad Flora's recent posts were not collected.
- I did not read the `aboodman` X post the event page links to. It is linked as a learning resource, not as a judge.
- The Builderbase rubric is from a page the organizers can edit. Scoring could change on the day.

---

## Hackathon implications

**What to build, aimed at the likely panel**
- **Make the real-time behaviour visible on screen.** Criterion 1 literally says "use AI in real time". Use streaming voice or UI, live agent-to-agent messages (Relay observer), and actors waking and sleeping. A host founder scores it, and Karatzas and Simard-Morissette have both said actors are hard to explain ("3 people knew what an actor was").
- **Use both host products together, the way they themselves plan to.** Gant says Agent Relay is moving onto Terse. A project with Relay as the messaging layer and Durable Actors as per-entity state (one actor per ghost, room or player) matches their joint roadmap and earns the stated bonus.
- **Lean into games and multiplayer.** Simard-Morissette's own showcase is a multiplayer murder mystery on actors. Ben Swerdlow builds StarCraft agent benchmarks. Karatzas lost a YC showcase to a robot playing Doom. A Halloween multiplayer game with agent characters fits the theme and the judges' tastes. [I]
- **Spend real time on UX and the "why".** Criteria 4 and 5 are 2 of the 5 scores, and Aaron Epstein (Terse's YC partner) talks publicly about product clarity and explanatory animation. Show one sentence of user, problem and value before any architecture.

**Gotchas**
- **The demo lasts 2 minutes, and only the top 8 get one.** First you have to make the cut on the Builderbase submission. Write a clear description, add screenshots and a fallback video. Then rehearse a 2-minute live demo with a pre-warmed state.
- Ignore aggregator pages that mention Devpost. Judging runs on **Builderbase**, and signup happens at check-in.
- If an OpenAI computer-use person like Ari Weinstein judges, a scripted happy path is weak. Showing an agent recover from a failure live is strong. [I]
- Don't count on a Supabase judge being in the room. Make the "scale to millions" case readable from the submission page itself.

**Setup before Oct 31**
- Re-check https://builderbase.com/event/haunted-hacks-2026 on Friday evening for the judge list, then adjust the pitch for whoever is on it.
- Build a Builderbase account in advance if signup allows it, and draft the submission text template now. Writing ideas beforehand is allowed.
- Pre-record a 60 to 90 second fallback video slot in your plan for the end of the day.
- **Pin your Durable Actors version.** On 2026-10-29 the `gh` API showed `TerseAI/durable-actors` (MIT, 291 stars) going from 0.8.1 (Oct 20, which added Alarms, async Python actors and a Pi adaptor) to **v0.14.4**, with three releases on Oct 29 alone. The API is moving fast, so run the quickstart and `bunx terse-cli@latest install` (cloud beta) on Friday and pin whatever works. `AgentWorkforce/relay` (Apache-2.0, 1,059 stars) was also pushed that day. Both founder teams will be in the room, so ask them about breaking changes in person rather than guessing.
- Read the Terse launch video and the Agent Relay launch post. Use their own words ("armies of tiny servers", "stop being the message bus") in the pitch.

**What judges and sponsors want (summary)**
- Hosts: visible actor semantics and agent-to-agent traffic, both products together.
- YC: a clear product story and a polished demo.
- OpenAI: real-time and agentic OpenAI APIs (computer use, voice).
- Freestyle and Superserve: parallel or forked sandboxes, fast fan-out, secrets kept out of the VM.
- Mastra: Studio traces.
- Supabase: a credible path to scale.

---

## Sources

- YC event page: https://events.ycombinator.com/haunted-hacks-2026
- Builderbase event page (live scrape 2026-10-29): https://builderbase.com/event/haunted-hacks-2026
- Luma (YC): https://luma.com/yc-meetup-7183-9316f87f ; Luma (Builderbase): https://luma.com/builde-oxba
- hackathonradar (stale): https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026
- Bitrig Hacks judges and rubric: https://bitrig-hacks-duo-edition.devpost.com/ ; https://luma.com/yc-meetup-4378
- Terse YC page: https://www.ycombinator.com/companies/useterse ; Agent Relay YC page: https://www.ycombinator.com/companies/agent-relay
- Karatzas X: https://nitter.rdrama.net/karatzas_thomas ; https://teapawt.org/karatzas_thomas/status/2112219511327965403
- Simard-Morissette X: https://nitter.rdrama.net/oliviersm199 ; Terse X: https://nitter.rdrama.net/IncTerse
- Washburn X: https://nitter.rdrama.net/willwashburn ; Gant X: https://nitter.rdrama.net/Khaliqgant ; https://teapawt.org/Khaliqgant/status/2112219340422721818 ; Agent Relay X: https://nitter.rdrama.net/agent_relay
- Aaron Epstein: https://teapawt.org/aaron_epstein/status/2113683578651615294 ; https://xitter.cf/aaron_epstein/status/2105818202873921812 ; https://realalpha.app/people/aaron-epstein/
- Grey Baker: https://www.ycombinator.com/people/grey-baker ; https://www.ycombinator.com/blog/chris-golda-and-grey-baker-general-partners
- Brad Flora: https://www.ycombinator.com/people/brad-flora
- Jon Xu: https://www.ycombinator.com/people/jon-xu ; https://nitter.cf/xuster/status/2020923920745103791 ; https://luma.com/compiled-8lsr
- Nemil Dalal: https://www.ycombinator.com/founders/nemil-dalal ; https://xitter.cf/nemild/status/2098048890717212871 ; https://www.linkedin.com/posts/mason-arditi_excited-to-announce-nemil-dalal-y-combinator-activity-7514196352567013376-J0SW
- Make Something Agents Want: https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent ; https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF
- Ari Weinstein: https://twiscan.com/en/x/AriX ; https://nitter.rdrama.net/AriX ; https://lspace.beehiiv.com/p/devday-2026
- Romain Huet judging: https://cerebralvalley.ai/e/openai-gpt-6-astra-sf
- Charlie Guo: https://builder.aws.com/post/3HHU3UEMBfKKxw1LFwNUAO2KLK2_p/how-to-build-a-video-agent-with-neo4j-twelvelabs-and-strands-agents ; https://www.garysguide.com/events/l9am65x/Codex-Community-Hackathon
- Saptarshi Banerjee judging: https://www.linkedin.com/posts/vivianamarquez_hackathon-day-tomorrow-sf-register-activity-7508982288672808960-XpWd ; https://events.trymimetic.com/events/sf/cyberdefense-hackathon-oct-2026
- Freestyle X: https://nitter.rdrama.net/freestyle_dev ; c0mpiled-14: https://c0mpiled-14.devpost.com/
- Supabase YC hackathon 2024: https://supabase.com/blog/ai-hackathon-at-y-combinator ; https://supabase.com/events/supabase-ai-hackathon-at-y-combinator
- Supabase Select judges: https://palaner.com/events/luma-61208c918c
- Supabase x Builderbase NYC: https://www.linkedin.com/posts/builderbase-labs_nyctech-hackathon-supabase-activity-7516144189311643649-u9NL
- Pavitra Bhalla X: https://nitter.rdrama.net/pavitrabhalla
- Dan Goosewin / Mastra: https://www.goosewin.com/customers/mastra ; https://agent-memory-hack-night.devpost.com/
- Builderbase company: https://builderbase.com/press/ ; https://linkedin.com/company/builderbase-labs
- Sibling research files: `../openai/05-team-strategy.md`, `../supabase/05-team-strategy.md`, `../mastra/05-team-strategy.md`, `../freestyle/05-team-strategy.md`, `../superserve/05-team-strategy.md`, `../past-winners/01-yc-hackathons.md`

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live pages (Firecrawl live scrape for Builderbase, Exa fetch for the rest, `gh api` for repos).

| # | Claim | Checked against | Outcome |
|---|---|---|---|
| 1 | No judges named; Builderbase "Meet the judges" is empty | Builderbase live scrape (`maxAge: 0`), YC Luma mirror | **Confirmed.** Both say "Judges will be announced soon". The judges section is empty |
| 2 | Rubric has five criteria, each scored 1 to 5; top 8 finalists demo for 2 min; teams up to 4 | Builderbase live scrape | **Confirmed verbatim** |
| 3 | Builderbase lists only four sponsors / omits Freestyle and Superserve amounts | Builderbase live scrape | **Corrected.** The logo strip shows all five. The About text names four. Freestyle and Superserve prize *and* per-attendee credits are both missing. Builderbase also routes spot requests to the YC page |
| 4 | Builderbase JSON-LD organizer = Agent Relay | Exa fetch of the JSON-LD | **Confirmed** |
| 5 | Bitrig rubric is the same template; Karatzas, Flora and Weinstein judged | Bitrig Devpost and Luma | **Confirmed**, with context added: Bitrig was hosted by Bitrig (S25), not Terse, and had 8 judges, including sponsor RevenueCat. "Sibling event" wording softened |
| 6 | Primary partners: Epstein (Terse), Baker (Agent Relay); founder bios | YC company pages, YC blog (Jun 16 2026) | **Confirmed** |
| 7 | Karatzas Oct 19 "coffee made by me"; Oct 26 coding-agent platform; Oct 19 tiny Lovable; Oct 8 lost to "a robotic arm playing Doom" | teapawt / nitter mirrors | **Confirmed.** The Oct 19 post also calls it "the first (to our knowledge) Actor Hackathon" |
| 8 | "Terse YC launch today, Oct 29" | Karatzas nitter | **Corrected** to Oct 28 to 29 (posts 15h and 3h old). Cloud beta CLI added |
| 9 | Gant Oct 8 "We're moving over to their tech for @agent_relay"; Oct 24 Grok/dot post; Oct 27 talk | @IncTerse and Gant nitter | **Confirmed verbatim** |
| 10 | Simard-Morissette murder mystery (Oct 9), Python SDK (Oct 12), "3 people knew what an actor was" (Oct 14), Oct 22 hackathon post | @IncTerse and oliviersm199 nitter | **Confirmed.** The Oct 22 quote was expanded: it names only OpenAI, Supabase and Mastra |
| 11 | Washburn launch ~96k views; "getting rid of PRs"; shared-sessions quote; Grokbot reading prompts | willwashburn nitter | **Confirmed** (96,602 views at fetch) |
| 12 | Epstein Lightcone quotes; Farza interview; Conductor post | Real Alpha, teapawt, xitter.cf | **Confirmed verbatim** |
| 13 | Ari Weinstein "Head of Product & Engineering"; Latent Space quote "really good at debugging... trying again" | twiscan, Latent Space page | **Corrected.** The "Head of" title is unverified (sources say "Product & Engineering, Computer Use"). The second quote is not in the page text, so it was replaced with the show-notes paraphrase. Sep 4, Aug 13 and Aug 20 posts confirmed |
| 14 | Romain Huet judged GPT-6 Astra hackathon Sep 8 | Cerebral Valley page | **Confirmed** |
| 15 | Saptarshi Banerjee judged tokens& (Sep 25) and Cyberdefense (Oct 9) | LinkedIn repost, Mimetic page | **Confirmed** |
| 16 | Charlie Guo (OpenAI; YC S13) at AWS Loft Jul 30 | AWS Builder Center | AWS event **confirmed**. "YC S13" **marked unverified** |
| 17 | Swerdlow judged Supabase YC hackathon semis (Nov 2024); Brood War Bench Sep 21; Freestyle judged c0mpiled-14 | Supabase blog and event page, freestyle_dev nitter, Devpost | **Confirmed** (Supabase event page says Nov 22 to 23. The blog lists "Benjamin Swerdlow" among YC-founder semi-final judges) |
| 18 | Copplestone and Wilson judged Supabase Select Oct 3 | Palaner copy of Luma | **Confirmed** |
| 19 | Pavitra Bhalla Oct 23 / 24 / 26 posts | pavitrabhalla nitter | **Confirmed verbatim** |
| 20 | Goosewin quote from Sam Bhagwat; Goosewin judged Mastra x Elastic hack night Aug 19 with a Studio-traces criterion | goosewin.com case study, Devpost | **Confirmed verbatim** |
| 21 | Jon Xu "I'll be judging" (Feb 2026); Nemil Dalal hosted MSAW and judged B@BHacks 2.0 | nitter.cf, xitter.cf, LinkedIn (Oct 9 2026), YC founder page | **Confirmed** |
| 22 | Supabase MSAW track "Coming soon"; Supabase x Builderbase NYC Nov 4 | Pivot News (Oct 13), Builderbase LinkedIn (Oct 14) | **Confirmed** |
| 23 | hackathonradar still says Devpost | hackathonradar page | **Confirmed** ("We will be using devpost!"). It is stale |
| Added | Repo state / release velocity | `gh api` on TerseAI/durable-actors and AgentWorkforce/relay | New: Durable Actors v0.14.4 (3 releases Oct 29), 291 stars, MIT. Relay 1,059 stars, Apache-2.0 |

Not re-checked in this pass: Grey Baker and Brad Flora recent posts (none claimed), Superserve's primary partner, the Ashley Ha LinkedIn post, the GarysGuide Codex event, and Jacob Zwang's Jul 17 post beyond the Freestyle repost (seen on the freestyle_dev mirror, so effectively confirmed).
