# AI funding and market signals, Sept-Oct 2026: what money and YC are betting on

> Researched 2026-10-29 for Haunted Hacks (Sat Oct 31, SF; Terse Durable Actors + Agent Relay). Scope: big rounds, acquisitions, VC/YC category heat, YC Requests for Startups (RFS), and what makes an idea "YC-interview-worthy" right now. Window emphasized: Aug-Oct 2026; older items marked **[background]**.
> Method: Exa search/fetch + WebSearch; primary pages (company blogs, YC RFS page, Crunchbase News, SEC EDGAR, TechCrunch) preferred over aggregators. Tags: **[V]** = read on a primary or named-outlet page; **[T]** = third-party tracker/aggregator figure, not independently checked; **[I]** = my inference.

---

## 1. Headline numbers (the macro picture)

| Signal | Figure | Source | Tag |
|---|---|---|---|
| Global venture, Q3 2026 | $159B, ~6,000 startups; down 25% QoQ from $212B, up 53% YoY | Crunchbase News, Oct 5 | [V] |
| AI share of Q3 venture | $102B = 64% of global | Crunchbase News | [V] |
| Billion-dollar rounds in Q3 | Record 27 companies (Q2: 16, Q1: 14); ~1/3 of all Q3 capital | Crunchbase News | [V] |
| Largest Q3 rounds | Databricks $5B, Safe Superintelligence $5B; Crusoe, Moonshot, Mistral, Nscale, Boring Co., Kling each >$3B | Crunchbase News | [V] |
| Physical AI | Aerospace, robotics, data centers, semis, energy each raised >$10B in Q3 | Crunchbase News | [V] |
| Seed, Q3 | $13B; ~20% ($2.6B) in seed rounds of $100M+ | Crunchbase News | [V] |
| KPMG view of Q3 | $170.9B across 8,341 deals; $728.3B YTD; "increasingly concentrated" and a "more selective funding environment" outside AI/infra/robotics/defense | KPMG Venture Pulse, Oct 14 | [V] |
| October so far | $43.6B across 105 AI rounds (through Oct 26), median round $18M; OpenAI $20B on Oct 1 the largest | aifunding.me | [T] |
| Weekly pulse | Oct 19-25: ~$5.18B in 25 AI rounds of $20M+; Tenstorrent $1.5B and Flapping Airplanes $1B made up nearly half | AI Funding Tracker | [T] |

**[I] What this means:** money keeps piling into a few names. Seed is still healthy, but the large checks go to (a) frontier labs and compute, (b) physical AI, and (c) **agent infrastructure that has real revenue**. Section 3 covers (c); it is the category closest to what this hackathon's hosts sell.

## 2. The biggest deals and stories, Sept-Oct 2026

### Rounds
- **Cognition**: raised $2B at $48B in September (run-rate revenue "nearly $900 million", up from $492M in May, as the company stated at the time, per Dealroom). On Oct 28 Business Insider reported inbound offers at **$70-80B**; talks are early and unconfirmed by the company. [V for the BI report, T for the run-rate figure]
- **TypeSafe AI (Jev)**: **$870M Series A at $7.5B**, led by a16z with Sequoia and DCVC (Oct 9), less than a month after Jev launched on Sept 15. Jev is a transformer that returns *typed decisions plus calibrated probabilities* (yes/no, pick-from-list, score) instead of text. a16z calls it "the biggest narrative violation we've seen this year" and says it reached 1T tokens in 3 days. TypeSafe's own blog says "a third of the Fortune 500" use Jev, while a16z's post says 25%; quote the lower figure. Modal's Series D post says Jev served its first 1T tokens on Modal. [V, typesafe.ai + a16z.com + modal.com, re-checked Oct 29] YC's Diana Hu cites Jev by name in the Winter 2027 RFS (section 4).
- **Modal**: **$750M Series D at $15.75B** (Accel, Oct 14). The company says it crossed $1B annualized run rate. **Sandboxes alone are a $300M run-rate product**, with close to 3B sandboxes spun up and scaling to 1M concurrent. [V]
- **Temporal** (durable execution): **$550M Series E at $12.55B** (Lightspeed co-lead, Sept 14). The company says ARR is up >200% YoY, NDR has stayed above 200% since February, it processed 1.9T billable actions in August, and it has 4,300+ paying customers including OpenAI, whose usage it says "grew 60-fold in under a year." [V]
- **Restate** (durable execution with "Virtual Objects", i.e. keyed stateful entities with one writer per key, which is actor-like): **$20M Series A** (Singular, Sept 30). Restate's post says "Replit moved the execution of the Replit Agent onto Restate" and that the new architecture uses more than 10x the durable actions of the previous one. It also argues managed durable execution costs $25-50 per million actions versus ~$1 per million DB writes. [V]
- **Daytona** (agent sandboxes): **$60M Series B at $1B** (FirstMark Growth, Oct 20). It claims ~25x revenue growth since January and ~135% average monthly NRR. [V]
- **Supabase** (sponsor): **$150M** led by GIC with CapitalG, announced Oct 2, four months after its $500M Series F at a $10B pre-money valuation. In the same announcement it said it is **acquiring Turso** "for higher volumes of databases for agentic workloads." It now describes itself as "the leader in agentic infrastructure," says it adds more than 1M users and 4M databases a month, and says 70% of new databases are created "by agents or AI-driven tools." The release names **Mastra** (also a sponsor here) as a Turso customer for per-agent databases. [V, PR Newswire, re-checked Oct 29] The June Series F announcement said over 60% of new databases are launched "by some sort of AI tool." **[background, V]**
- **ElevenLabs**: $300M employee tender at **$22B** (Sept 30), double February's price. Its ElevenAgents product handles 15M+ conversations a week. [V]
- **Flapping Airplanes** (data-efficient training lab, about a year old): **$1B Series A at a reported $6B** (Index and Lux, Oct 21). [V]
- Others worth knowing: Tenstorrent $1.5B Series E at $6.2B (Oct 19, Reuters via trackers); Legora $550M at $8.8B (legal AI); Armadin $255.5M Series B at $2.5B (agent swarms for security testing, a16z and Accel, Oct 1); Arena $200M at $3.1B (model evals); Town $108M Series B at $1B ("AI assistants that coordinate work across a company's staff"); Blacksmith $66M at $1B (CI for AI-written code). [T, from ValueAdd VC and AI Funding Tracker tables, which cite TechCrunch, Reuters and SiliconANGLE]
- **Ando**: $20M seed (Accel, Index, Emergence; Sept 24) for "messaging software for humans and AI agents to work side by side". It is agent-agnostic and supports Codex, Claude and others. [V] This is the closest funded comparable to "Slack where agents are members."

### Acquisitions (agent / real-time infra)
- **Baseten acquires Blaxel** (Sept 10). Blaxel built microVM sandboxes that suspend and resume in 25 ms and that it describes as "the stateful execution layer agents need to act." Baseten says it is building "the cloud for the next trillion agents." [V]
- **Palo Alto Networks buys Console** (~$500M cash and stock, early Sept; IT-ops agents). Race to AGI reports this was ~3x Console's last private mark and frames it as "each one became a feature." **Adobe bought Rilo** and **Meta bought Stilla.ai** in the same two weeks. [T, Race to AGI citing TechCrunch]
- **ZoomInfo acquires DoubleO.ai** (Sept 30), a "multi-agent orchestration platform" for reliable go-to-market (GTM) automation. [V]
- **Bolt.new acquires Dokai** (Sept 29), an enterprise GTM agent company. [V]
- **Deepgram acquires Daily**, maker of the open-source **Pipecat** real-time voice/video agent framework (**today, Oct 29**). Pipecat stays open source. Deepgram also launched a "Real-Time Context Standard" protocol for voice agents. [V]
- **Nebius acquires Inferize** (Oct 1; inference cold starts). [V]
- Large non-infra deals: Salesforce/Braze (~$5.66B EV), Guidewire/Hyperexponential ($1.7B), Intel/Classiq ($2.2B). [T]
- **[background, corrected Oct 29]** Nvidia's ~$12.9B deal for Hugging Face is reported by Crunchbase News (as a "bid") and Race to AGI (as an "agreement"), so treat it as announced, not closed [T]. Dealroom's Cognition story says "SpaceX completed its $60 billion acquisition of Cursor in August" [T, one secondary source; primary not opened].

### Exits and public markets
- **Anthropic filed a public S-1 on Oct 26** (Nasdaq: "ANT"). H1 2026 revenue was **$16.286B** (vs $1.163B in H1 2025). CNBC calculates an implied ~85% gross margin. The net loss was $80.7B, of which $72.4B was a fair-value charge on convertible notes, derivatives and SAFEs; the operating loss was only $693M, and adjusted operating income was +$1.6B (10% margin). NRR was ~900% as of Sept 30. [V, S-1 table on SEC EDGAR + CNBC + Fortune, re-checked Oct 29]
- OpenAI raised $20B on Oct 1 [T]. It is reportedly discussing up to $30B at $1.25T [T, Daily AI Brief citing reports].

## 3. Where the category heat is (for this event specifically)

**Agent infrastructure is the hottest *investable* software category this fall, and the money goes to the state/execution layer, not to frameworks.** [I, supported by the following]
1. **Durable execution / stateful entities:** Temporal at $12.55B, Restate's Series A, and Restate's pitch that "Virtual Objects" (keyed, single-writer state) became "a fan-favorite... for anything from agent context to session stores." Temporal's blog says customers "are asking to run agents that work for days, weeks, or months." This is the same thesis as **Terse's Durable Actors** (one request at a time per actor, each actor has its own SQLite, addressed by name). [V]
2. **Agent sandboxes / computers:** Modal Sandboxes at a $300M run rate, Daytona at $1B, Blaxel acquired, and Freestyle (sponsor; YC Summer 2024 per its YC page; persistent, forkable VMs for agents). *Correction: an earlier draft listed a "$10M Series A in March 2026" for Freestyle. That PR Newswire release is about Freestyle the diaper brand (Silas Capital lead), and some aggregators have mixed it into freestyle.sh's profile. No funding round for freestyle.sh was verified.*. Daytona: "This year, long-running agents went mainstream, and agent-specific infrastructure became consensus." [V]
3. **Agent databases:** Supabase's Turso deal is explicitly about database *volume* for agents. [V]
4. **Humans + agents in shared rooms:** Ando ($20M seed), Town ($108M), and the YC "Multiplayer AI" RFS (below). [V/T]
5. **YC F26 batch composition:** Eight Capital (Sept 24) calls infrastructure for AI agents "the single biggest sub-theme in the batch... isolated runtimes, persistent sandboxes, workspace managers, and reliability layers." It also notes that vertical agents are "getting narrower, not broader." MarkosWeb's classifier puts agent infrastructure at 18.2% of F26, up 5.2 points from S26. [V for Eight Capital, T for MarkosWeb] **Both hosts are in this cohort.** Terse's YC page lists **Aaron Epstein**, the author of the Multiplayer AI RFS, as its primary partner, and Terse pitches Durable Actors as "the perfect primitive for deploying multiplayer agents." [V]
6. **Real-time voice keeps consolidating:** ElevenLabs at $22B and the Deepgram/Daily (Pipecat) deal today. A trackers' tally puts September voice-AI funding at ~$500M across 16 rounds (Krest). [V/T]

**Cooling or crowded:** horizontal "agent platform" pitches. Three September agent acquisitions were folded into incumbents as features. Race to AGI describes two markets: "One pays hundreds of millions for an agent that completes someone else's product. The other pays billions for the chance to be the product." [T] Thin GPT wrappers get no mention anywhere in the YC RFS. [I]

## 4. YC Requests for Startups: what YC says it wants right now

### Winter 2027 RFS (live on ycombinator.com/rfs; published ~Oct 27 per secondary coverage. ycombinator.com/apply says the on-time deadline is **Nov 2, 8pm PT**, with decisions by Dec 11 [V]. The $500K standard deal is per secondary coverage citing the YC FAQ [T])
Banner (verbatim): *"AI's biggest bottlenecks are moving beyond the models. We're excited about a new wave of startups building the hardware, infrastructure, financial systems, and specialized software needed to bring intelligence into the real economy, from factories and data centers to government and space."* [V]

The 11 requests [V, fetched from ycombinator.com/rfs]:
1. Startups in a World of Abundant Space Access (Ankit Gupta)
2. The $15-an-Hour Expert: AI that turns ordinary workers into experts in benefits, taxes, insurance claims and medical billing (Brad Flora)
3. Robots Made in America (Diana Hu)
4. LLMs That Write Well
5. Plaid for Government Benefits; notes that "soon AI agents will handle enrollment, but only if they can trust the data"
6. Wall Street for the Physical Buildout: financing robots and GPUs
7. Vertical Foundation Models (Diana Hu): "I think Jev hit a nerve because it gives developers a typed decision and a probability instead of generated text"
8. AI for City Hall: permits, 311, inspections
9. Data Center Supply Chain
10. AI for the Air-Gapped Economy: on-prem frontier AI
11. Own Your Intelligence: open-weight models plus evals and post-training on company data

(Bylines are given only where the raw page text shows "By ...". The raw extract shows no byline under items 4-6. A summarizing fetcher returned names for every item, but they could not be confirmed in the raw text, so they are omitted here.)

A Spanish-language analysis (themarketingtalker.com, Oct 29) observes that **"agents" appears in none of the W27 titles**: "YC da la IA por hecha" (YC takes AI as a given). [T, but checkable: no W27 title contains "agent".] Separately, YC partner Nemil Dalal posted a crypto RFS on Oct 28 that includes "crypto API infrastructure for AI agents." [T, CryptoBriefing]

### Fall 2026 RFS (the list current through most of Sept-Oct; still viewable on the RFS page)
Banner: *"AI is moving into the physical world."* 13 requests (count per usepoly.co). [V, banner seen in YC page search index Oct 29; the `?batch=Fall+2026` URL now renders the W27 list, so the Fall text is reachable only via search caches and mirrors like zavod-it.com] The four most relevant to this hackathon:
- **Multiplayer AI (Aaron Epstein)**, quoted from YC: *"AI agents are the most powerful new tool a team has, but it's the one thing people still use by themselves... Anyone on a team should be able to drop into the same live agent session to watch it work, redirect it, and hand it off... So if you're building AI that's multiplayer by default, we'd love to hear from you."* [V]
- **A Cloud for Small Software (Pete Koomen)**: a cloud for tools with one or a handful of users; "Small software should be as easy to share with your colleagues as a Google Doc." [V]
- **Self-Maintaining APIs (Harsha Gaddipati)**: "Dependabot but for APIs." (author and quote unverified against YC; the Birdhouse summary confirms the request exists)
- **Proving You're Human** and **AI-Native Compliance Infrastructure**, both with audit-trail angles. [V via secondary summaries]

### Spring 2026 **[background]**
Spring 2026 included "Cursor for Product Managers," "AI-Native Agencies," "AI Guidance for Physical Work" (real-time camera plus voice coaching) and "Make LLMs Easy to Train." [V, archived RFS text]

## 5. What makes an idea YC-interview-worthy right now

These are YC's own signals, from partner statements in Sept-Oct 2026:
- **Full-stack job completion beats tools.** On the Sept 18 Lightcone episode ("The State of Startups in 2026"), Diana Hu said the share of accepted companies "that do sort of full stack end-to-end work or a task has gone from just 10% to over 25% of the batch." She also said median revenue at the end of the batch rose from $8K to $20K MRR, and some companies go "from zero to seven figures in revenue during the batch." [T: quotes via a third-party transcript summary (teahose.com), not the video itself]
- **The system of record becomes the harness.** In the same episode Garry Tan said a system of record must become "the way people not just read and write, but actually do their work inside your system of record," or it gets "preyed upon." [T, same caveat]
- **Hard tech and deep-tech founders are in favor**, and W27's slant toward physical infrastructure confirms it. [V for the RFS]
- **YC itself runs agents internally.** In a May 2026 Lightcone episode on YC's internal agent infrastructure, Pete Koomen called the "unrestricted access to one database" "the key unlock." **[background, V via YC LinkedIn post]**

My synthesis for a 5-hour demo [I]:
1. **Name a buyer and a job, not a platform.** Eight Capital calls F26 "narrow beats broad," and acquirers buy agents that slot into an existing product.
2. **Show a reason the primitive is necessary.** Investors are paying for state and durability (Temporal, Restate, Modal, Daytona). A demo where Durable Actors visibly prevents a race, survives a crash, or lets a second human join a live agent session maps directly onto that thesis.
3. **Map to an RFS in one sentence.** "Multiplayer AI" is the cleanest fit for Terse plus Agent Relay. "The $15-an-Hour Expert," "AI for City Hall" and "Self-Maintaining APIs" are credible vertical wrappers around the same infrastructure.
4. **Show cost or latency discipline.** The Jev and Modal stories reward intelligence cheap enough to call everywhere, and the Supabase "scale to millions" prize asks the same question.

---

## Hackathon implications

**What to build (ranked by fit with the money and the judges):**
1. **"Multiplayer agent war room" for one vertical.** One Durable Actor per live agent session holds state and websocket fan-out. Several humans join, watch, steer and hand off. Agent Relay carries agent-to-agent delegation (e.g. a planner, worker and reviewer). This is close to verbatim the Fall 2026 RFS written by Terse's own YC partner. Pick a Halloween-flavored but real vertical: a permit-review "City Hall" crew (W27 RFS), an incident-response swarm, or a claims-adjuster "$15/hr expert" copilot.
2. **"Self-maintaining API" swarm.** Agents watch a changelog, coordinate fixes through Agent Relay, and a Durable Actor serializes writes to the shared repo or PR state, which demonstrates single-writer safety. This maps to an RFS, and Freestyle sandboxes can run the tests.
3. **Real-time voice plus shared state.** Pipecat-style voice agents (today's Deepgram/Daily deal makes the category newsworthy) where every caller and agent shares one actor. It is riskier in 5 hours.

**Pitch framing for the YC-interview grand prize:**
- Open with buyer, pain, and why now: "agents now run for hours, teams can't share them" (cite the RFS).
- Show one live failure mode the primitive fixes, e.g. two agents racing on a record versus the actor serializing them, or killing a process mid-task and resuming.
- Close with the market line: agent state and execution infrastructure is where 2026 capital went (Temporal $12.55B, Modal's $300M sandbox run rate, Daytona $1B, Supabase plus Turso). Keep each number to one sentence, and attribute it.

**"Most likely to scale to millions" (Supabase):** Supabase's own Oct 2 messaging is "millions of new agents each month" plus the Turso deal for agent database volume. Show per-agent isolation (actor + SQLite) together with Supabase as the shared system of record and auth, and talk about cost at idle (Terse actors go dormant and back up to S3).

**Gotchas:**
- Don't pitch "agent platform for everyone." Fall acquisitions show horizontal agents become features.
- W27 RFS titles avoid "agents"; YC frames AI as a given. Lead with the customer outcome and keep the infrastructure as the "how."
- Quote funding numbers carefully in the demo: several rounds are "reported" (Cognition at $70-80B, OpenAI at $1.25T), not closed.

**Before Oct 31:**
- Re-read the Fall 2026 "Multiplayer AI" text and the W27 list at ycombinator.com/rfs, and write a one-sentence RFS mapping.
- Prepare a 3-slide market backdrop (numbers in sections 1-3), each line sourced.
- If anyone on the team wants to apply to YC W27, the deadline is **Nov 2**, two days after the event, per secondary sources; verify at ycombinator.com/apply. A hackathon win plus the guaranteed interview is a different path, so confirm which batch that interview targets with the organizers.

## Limits / could not verify
- **Monthly totals disagree widely.** September AI funding ranges from $27.7B to $36.9B across aifunding.me's own pages, and AF.NET says $34.1B. October trackers also differ (aifunding.me $43.6B vs ValueAdd VC $5.8B through Oct 19, because of different inclusion rules). Only Crunchbase's and KPMG's Q3 figures are methodology-stated.
- **Lightcone quotes** come from a third-party summary (teahose.com), not the video. Treat the exact wording as unverified.
- **W27 RFS publication date (Oct 27)** and the **$500K / Nov 2** details come from secondary sites. I did not fetch ycombinator.com/apply.
- I did not open Reuters (Tenstorrent), TechCrunch (Console, Armadin, Arena) or Bloomberg (Manus) directly; those figures come via trackers.
- I found no public funding announcement for **Terse** beyond "Articulate and Y Combinator (F26)" on its site (re-checked Oct 29). **Agent Relay**'s homepage lists "Y Combinator" and "YONDER" as backers, with no disclosed amount. Its YC page lists Grey Baker as primary partner, and it posted a Launch YC on Oct 23, 2026 ("Let your teams' coding agents message each other"). Superserve funding was not researched; it belongs to other agents' angles.
- **Freestyle batch label:** the event page says "Freestyle (F24)" but Freestyle's YC page says **Summer 2024**. Use S24 if you name it on a slide.
- I could not determine which YC batch the hackathon's "guaranteed YC interview" applies to.

## Sources
- Crunchbase News, Q3 2026 global funding: https://news.crunchbase.com/venture/q3-2026-global-startup-funding-ai-billion-dollar-rounds-exits-data/
- KPMG Venture Pulse Q3'26: https://kpmg.com/xx/en/media/press-releases/2026/10/ai-megadeals-dominate-venture-capital-as-investors-pour-billions-into-fewer-startups.html
- YC Requests for Startups (W27 live; Fall 2026 view): https://www.ycombinator.com/rfs and https://www.ycombinator.com/rfs?batch=Fall+2026
- Superframeworks RFS tracker (Fall 2026 list, W27 deadline): https://superframeworks.com/articles/yc-rfs-startup-ideas-indie-hackers-2026
- themarketingtalker, W27 RFS analysis (Oct 27 date, "agents" absent): https://themarketingtalker.com/blog/business/request-for-startups-y-combinator-invierno-2027/
- Beinsure, W27 RFS coverage: https://beinsure.com/news/y-combinators-winter-2027-startup-priorities/
- Poly, Multiplayer AI RFS explainer: https://usepoly.co/yc-multiplayer-ai
- CryptoBriefing, YC crypto RFS: https://cryptobriefing.com/y-combinator-crypto-startup-priorities/
- Lightcone "State of Startups in 2026" summary: https://www.teahose.com/podcast/Lightcone/The%20State%20of%20Startups%20in%202026
- Eight Capital F26 spotlights: https://www.eightcapital.com/spotlight/seed-spotlight-y-combinator-f26-week-2 and https://www.eightcapital.com/spotlight/seed-spotlight-y-combinator-f26-week-4
- MarkosWeb F26 cluster mix: https://www.markosweb.com/startup-ideas/batch/f26
- Terse YC page / site: https://www.ycombinator.com/companies/useterse , https://www.useterse.ai/
- Temporal Series E: https://temporal.io/blog/temporal-raises-usd550m-series-e-at-usd12-55b-valuation-ai
- Restate Series A: https://restate.dev/blog/announcing-series-a ; https://techcrunch.com/2026/09/30/restate-lands-20m-as-the-need-for-durable-infrastructure-increases-with-ai-agents/
- Modal Series D: https://modal.com/blog/1-billion-annualized-run-rate-series-d ; https://siliconangle.com/2026/10/14/ai-cloud-startup-modal-raises-750m-at-15-75b-valuation/
- Daytona Series B: https://www.daytona.io/dotfiles/daytona-raises-60m-series-b-to-build-the-agent-cloud ; https://fortune.com/2026/10/20/daytona-startup-building-the-agentic-cloud-valued-at-1-billion-in-latest-funding-round/
- Supabase $150M + Turso: https://www.prnewswire.com/news-releases/supabase-announces-150m-in-new-funding-and-turso-acquisition-302896752.html ; Series F (background): https://techcrunch.com/2026/06/05/supabase-doubles-valuation-to-10b-in-8-months/
- TypeSafe/Jev: https://typesafe.ai/blog/series-ai ; https://a16z.com/announcement/investing-in-typesafe-ai/ ; https://techcrunch.com/2026/10/09/the-maker-of-non-text-ai-model-jev-valued-at-7-5b-just-weeks-after-launch/
- Cognition talks: https://www.businessinsider.com/cognition-round-of-funding-at-a-75-billion-valuation-2026-10 ; https://dealroom.co/news/167954-cognition-in-talks-at-75b-valuation-weeks-after-48b-valued-raise/
- Flapping Airplanes: https://techcrunch.com/2026/10/21/year-old-ai-lab-flapping-airplanes-raises-1b-at-a-6b-valuation/
- ElevenLabs tender: https://elevenlabs.io/blog/tender-22bn ; https://techcrunch.com/2026/09/30/ai-voice-startup-elevenlabs-doubles-valuation-to-22b/
- Ando seed: https://www.globenewswire.com/news-release/2026/09/24/3368344/0/en/ando-launches-agent-native-messaging-platform-announces-20-million-seed.html
- Baseten/Blaxel: https://www.baseten.co/blog/blaxel-is-joining-baseten-to-build-the-future-of-agentic-cloud/
- Race to AGI on agent acquisitions: https://www.racetoagi.org/analysis/three-ai-agent-startups-were-acquired-in-two-weeks-each-one-became-a-feature
- ZoomInfo/DoubleO: https://www.zoominfo.com/newsroom/press-releases/zoominfo-acquires-doubleo-ai
- Bolt/Dokai: https://bolt.new/blog/bolt-acquires-dokai
- Deepgram/Daily: https://techcrunch.com/2026/10/29/deepgram-acquires-pipecat-maker-daily-to-bolster-its-voice-ai-infrastructure/
- Nebius/Inferize: https://nebius.com/newsroom/nebius-acquires-inferize-to-strengthen-nebius-token-factorys-production-inference-stack
- Anthropic S-1: https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm ; https://www.cnbc.com/2026/10/26/anthropic-ipo-live-updates-ai-s-1-filing.html
- Trackers: https://valueaddvc.com/blog/october-2026-ai-funding-rounds-tenstorrent-typesafe-modal ; https://aifundingtracker.com/ai-funding-hits-5-2b-as-tenstorrent-and-flapping-airplanes-lead-week-oct-18-oct-25-2026/ ; https://aifunding.me/roundups/october-2026 ; https://dailyaibrief.com/newsletters/ai-funding-brief/2026-10-27-openai-discusses-up-to-30-billion-at-1-25-trillion-legora-raises-550-million-and-more-ai-funding-brief-88 ; https://www.siliconreport.com/capital/archive/2026-10 ; https://signals.getkrest.app/funding/voice-ai/2026-09
- Freestyle (background): https://www.ycombinator.com/companies/freestyle ; Mastra Series A (background): https://mastra.ai/blog/series-a
- Added in verification: YC apply page https://www.ycombinator.com/apply/ ; Fall 2026 RFS mirror https://zavod-it.com/blog/zavodit/y-combinator-requests-for-startups-fall-2026-original/ ; Agent Relay https://agentrelay.com/ , https://www.ycombinator.com/companies/agent-relay , https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other ; Fortune on the S-1 https://fortune.com/2026/10/26/anthropics-s-1/ ; the diaper-brand release behind the Freestyle mix-up (for reference only) https://www.prnewswire.com/news-releases/freestyle-closes-10m-series-a-funding-led-by-silas-capital-302711004.html

## Verification log (2026-10-29)

An adversarial re-check of the most decision-relevant claims against live primary pages (Exa fetch / WebFetch). The outcomes are CONFIRMED, CORRECTED, DOWNGRADED or ADDED.

1. **Crunchbase Q3 2026** ($159B, ~6,000 startups, -25% QoQ, +53% YoY, 27 billion-dollar rounds, AI $102B = 64%, seed $13B / $2.6B in $100M+ rounds, Databricks and SSI $5B each): **CONFIRMED** on news.crunchbase.com (Oct 5).
2. **TypeSafe/Jev $870M at $7.5B, a16z lead, Sequoia + DCVC, Oct 9; "biggest narrative violation"; 1T tokens in 3 days**: **CONFIRMED** (typesafe.ai footnote; a16z.com). **CORRECTED:** the Fortune 500 share differs by source (TypeSafe says "a third", a16z says 25%), and both are now noted.
3. **Modal $750M Series D at $15.75B post, Accel; >$1B run rate; Sandboxes $300M run rate; ~3B sandboxes; 1M concurrent**: **CONFIRMED** on modal.com (Oct 14).
4. **Temporal $550M Series E at $12.55B, Lightspeed co-lead, Sept 14; ARR >200%, NDR >200%, 1.9T actions in Aug, 4,300+ customers, OpenAI 60-fold**: **CONFIRMED** on temporal.io.
5. **Restate $20M Series A (Singular), Virtual Objects "fan-favorite", Replit Agent moved onto Restate**: **CONFIRMED** on restate.dev (Sept 30). Added the 10x durable-actions detail and Restate's per-action cost argument.
6. **Daytona $60M Series B at $1B (FirstMark Growth, Oct 20), ~25x revenue since Jan, ~135% monthly NRR, the "consensus" quote**: **CONFIRMED** on daytona.io.
7. **Supabase $150M (GIC lead, CapitalG), Oct 2; Turso acquisition; "leader in agentic infrastructure"; June Series F $500M at $10B pre-money, "over 60%" of DBs by AI tools**: **CONFIRMED** (PR Newswire; TechCrunch Jun 5). **ADDED:** the Oct 2 figures (70% of new DBs by agents/AI tools, 1M users + 4M DBs per month) and the fact that Mastra, a sponsor, is a named Turso customer.
8. **Deepgram acquires Daily/Pipecat today; Pipecat stays open source; Real-Time Context Standard**: **CONFIRMED** on TechCrunch (Oct 29). The deal value was not disclosed.
9. **Anthropic S-1 (Oct 26, Nasdaq "ANT"), H1 revenue $16.29B, ~85% implied GM, $80.7B net loss, ~$72B non-cash**: **CONFIRMED** against the S-1 table on EDGAR ($16,286M revenue; $72,388M fair-value change), CNBC and Fortune. **ADDED:** the $693M operating loss, +$1.6B adjusted operating income, and ~900% NRR.
10. **W27 RFS: banner text, 11 titles, Diana Hu's Jev citation, no title contains "agent"**: **CONFIRMED** on ycombinator.com/rfs. **CORRECTED:** removed bylines that a summarizing fetcher supplied but the raw page text did not show.
11. **W27 deadline Nov 2**: **UPGRADED from secondary to CONFIRMED** by the ycombinator.com/apply text ("November 2 at 8pm PT", decisions by Dec 11). The $500K deal remains secondary.
12. **Fall 2026 "Multiplayer AI" RFS by Aaron Epstein, quoted text**: **CONFIRMED** verbatim against YC's page (search-index copy) and the zavod-it.com mirror. Note that `?batch=Fall+2026` no longer renders the Fall list.
13. **Terse YC page lists Aaron Epstein as primary partner; "perfect primitive for deploying multiplayer agents"; "Articulate and Y Combinator (F26)"**: **CONFIRMED**. The partner appears on the YC page, and the quote and investors appear on useterse.ai (not the YC page).
14. **Freestyle "$10M Series A in March 2026"**: **CORRECTED/REMOVED.** The only primary source is a PR Newswire release for Freestyle, the diaper brand. Aggregators (recentfunding.com, fundraisingfox.com) mixed it into the freestyle.sh profile. Freestyle's YC page also says Summer 2024, not the event page's "F24".
15. **Cognition $2B at $48B; BI report of $70-80B offers (Oct 28)**: **CONFIRMED** (businessinsider.com, Katie Roof; Dealroom). The ~$900M run rate is the company's own statement relayed by Dealroom.
16. **Nvidia/Hugging Face and SpaceX/Cursor** (previously "unverified"): **UPGRADED to [T]**. Crunchbase News reports Nvidia's ~$12.9B "bid", and Dealroom says SpaceX "completed" a $60B Cursor acquisition in August. Neither primary source was opened.
17. **Spot checks:** Baseten/Blaxel (25 ms suspend/resume, "cloud for the next trillion agents", Sept 10), Ando $20M seed (Accel, Index, Emergence; agent-agnostic), ElevenLabs $22B tender with "more than 15 million conversations every week", Flapping Airplanes $1B Series A "reportedly" at $6B (Index and Lux co-lead), the Race to AGI "two markets" quote, and the Eight Capital F26 quotes: all **CONFIRMED** on the cited pages.
18. **Not re-checked (still [T]):** the Lightcone quotes (teahose.com summary), MarkosWeb's 18.2%, the KPMG figures, aifunding.me and AI Funding Tracker totals, the Console/Rilo/Stilla deal sizes, Tenstorrent, Legora, Armadin, Arena, Town and Blacksmith, the OpenAI $20B / $1.25T talks, and the Spanish-language W27 analysis.
