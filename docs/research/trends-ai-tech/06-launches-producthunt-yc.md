# Launch Landscape: Product Hunt, Launch YC (F26), and Notable AI Launches, Aug-Oct 2026

Compiled 2026-10-29 for Haunted Hacks (Sat 2026-10-31). Scope: what shipped publicly in roughly the last 90 days, which categories are saturated, and which are thin. Window emphasis: Sept-Oct 2026. Items from before August 2026 are marked **[background]**.

Method: Exa search and fetch of Product Hunt monthly and daily leaderboards, third-party PH/HN aggregators (Junior, Launch Index, hunted.space, Nicheloom), Launch YC posts, YC company pages, F26 batch directories, and Eight Capital's weekly F26 notes. No Firecrawl credits were spent. "Verified" below means I read it on the cited page. "Inference" means my own interpretation.

---

## 1. Headline findings

1. **"Slack or a room for your agents" is the most crowded launch category of October 2026.** I counted at least 15 public launches between Sept 1 and Oct 29 that pitch a shared space, chat, or multiplayer workspace where several agents and people work together (table in §4). Agent Relay, one of the hosts, launched into the same category on Oct 23. (Verified count; see §4 for sources.)
2. **Agent infrastructure grew as a share of YC F26, and vertical agents shrank.** MarkosWeb's classification of 132 F26 companies puts "Agent infrastructure" at 18.2% (+5.2pp vs S26) and "Vertical AI agents" at 18.9% (−4.2pp). Within agent infra, sandboxes/VMs and agent testing/simulation are the densest clusters. (Verified: https://www.markosweb.com/startup-ideas/batch/f26)
3. **The top of Product Hunt goes to GTM, marketing, and "AI teammate" products, not to dev infra.** Sept's #1 was Ami AI (AI SDR), October's #1-#2 by PH score were Spira Maxima (AI influencers) and Pancake ("Vercel for GTM"). Junior ranks by raw upvotes and puts them the other way round: Pancake 578, Spira 569. Mastra Factory, from a sponsor, made Sept's top 5. (Verified: PH monthly leaderboards.)
4. **Consumer real-time multiplayer with AI participants is thin on *quality*, not on attempts.** Several AI social-deduction and NPC games launched in October with almost no traction (1 to 7 upvotes). Platform-level "vibe-code a multiplayer game" products did well (myPip #2 of the day, Google Playground #3). (Verified; inference on the gap is mine.)
5. **The investor narrative for F26 is "proactive, outcome-delivering, verifiable."** Eight Capital's weekly notes repeat three themes: AI that acts before you ask, narrow products that win, and verification becoming the scarce thing as generation gets cheap. (Verified: Eight Capital weeks 1, 4, 5, 6.)

---

## 2. YC F26: batch shape and host/sponsor launches

### 2.1 Batch size: sources disagree
- RemJobs: 114 startups (updated Oct 19). https://www.remjobs.works/startups/yc/f26
- Eight Capital: "136 startups have now launched in F26" (Oct 15). https://www.eightcapital.com/spotlight/seed-spotlight-y-combinator-f26-week-5
- Fundraising Fox: 140 companies. https://fundraisingfox.com/companies/yc/f26
- MarkosWeb and startup.bid: 189 listed, 137 in SF per startup.bid (Oct 29). https://www.markosweb.com/startup-ideas/batch/f26, https://startup.bid/zh/startups/batch/fall-2026/
- Present of AI: 78 *AI* companies (48 business software, 14 industry/robotics, 7 consumer/media). https://presentofai.com/collections/y-combinator-fall-2026

Inference: the gap is publicly launched companies vs. the full directory. Use about 190 total, about 140 launched by late October.

### 2.2 Cluster mix (MarkosWeb, 132 classified, vs S26)
| Cluster | Share | Change vs S26 |
|---|---|---|
| Vertical AI agents | 18.9% | −4.2pp |
| Agent infrastructure | 18.2% | +5.2pp |
| Robotics / physical world | 14.4% | −1.4pp |
| Data for AI | 6.8% | +2.9pp |
| Developer tools | 6.1% | +2.7pp |
| Defense and space | 6.1% | +2.7pp |
| Horizontal AI assistants | 5.3% | +1.3pp |
| AI infra and compute | 5.3% | −3.7pp |
| Consumer | 3.0% | n/a |

Source: https://www.markosweb.com/startup-ideas/batch/f26. Consumer is about 3% of the batch. Inference: a consumer-facing, playful demo stands out in a room full of agent infra.

### 2.3 F26 dev-tools roster (DevHunt snapshot 2026-10-20, 33 companies)
Clusters I grouped from https://devhunt.org/yc/f26:
- **Agent compute / sandboxes (6):** Boat ("cloud VMs for billions of agents"), Maritime ("managed cloud for AI agents"), Boxes.dev, Agent 37 (persistent sandboxes), Tilion (browser infra), plus Superserve (sponsor, not tagged dev-tools there). Agent37's Show HN reached 163 points in the week of Oct 12-18 (https://launchindex.ai/week/2026-10-12).
- **Agent testing / simulation / evals (9):** Simulithic, Composal, Aucert, Hue, Rystic, Workers IO, Papaya, Mirrors, Simantic. Present of AI adds Latent and ORO AI.
- **Agent coordination / runtime (4):** Agent Relay, Terse, Acyclic Labs (agent swarms), herdr ("open agent runtime").
- **Agent observability / security (4):** Stacktrace, Armorer Labs, OpenHack, GrayPass.
- **Realtime / voice infra:** Hopper ("inference and post-training for realtime agents"), ObsessionDB ("real-time data warehouse for agents").

### 2.4 Host and sponsor launches (verified)
- **Terse / Durable Actors (F26).** Show HN "Durable Actors – OSS Durable Objects with configurable compute," launched Oct 6, 52 upvotes, top 18% per Nicheloom (the live HN page showed 53 points and 25 comments on Oct 29). Self-reported p95 numbers: durable write 85.6ms, stateful read 2.14ms, actor warm-up 334ms. Repo TerseAI/durable-actors: 291 stars, 22 forks, MIT, created 2026-08-30, last push 2026-10-30 UTC (re-checked with the GitHub API on 2026-10-29 Pacific; an earlier draft said 241/17, which was stale). On Oct 17 Terse published a comparison with Cloudflare that says self-hosting "currently supports Google Cloud" and that Terse is "an architectural alternative rather than an API-compatible replacement." The same post warns that once any method in a class uses `@Interleave`, "calls throughout that class lose automatic rollback." Sources: https://news.ycombinator.com/item?id=49980399, https://www.nicheloom.com/launches/44910/, https://github.com/TerseAI/durable-actors, https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects. Nicheloom files it under "serverless computing platforms," a niche with only 10 launches, against 221 launches it judges similar overall.
- **Agent Relay (F26).** Launch YC post on Oct 23, "Let your teams' coding agents message each other." It is framed around coding agents (Claude Code, Codex, Cursor, Conductor) and shared, searchable session history. The X launch got 96K views, 506 likes, and 705 bookmarks per launchvideo.com. The YC page says "Setup takes about 5 minutes: give your agent the link and it installs itself," and offers a free hosted version or a self-hosted open-source one. The "50+ agents in parallel" line comes from the founders' own launch post. Repo: AgentWorkforce/relay ("Infrastructure for coding agents"), Apache-2.0, 1,059 stars, v14.0.0 released Oct 13, with probe-v15 tags pushed Oct 29-30 (GitHub API, 2026-10-29). The SDK package is `@agent-relay/sdk`. Source: https://github.com/AgentWorkforce/relay Sources: https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other, https://www.ycombinator.com/companies/agent-relay, https://www.launchvideo.com/directory/agent-relay. Their Feb 27 SDK post **[background]** describes "real time push communication, spawning and releasing agents, channels, emoji reactions, read receipts": https://agentrelay.com/blog/introducing-agent-relay
- **Superserve (F26).** VMs for agents, under 50ms start, pause/fork. The YC page says "We run over 100K machines (as of Oct 2026) every week for world-class teams, including Lindy, and Y Combinator itself." Founderland (Oct 28) says Lindy's use "is supported by public posts," but it found no independent confirmation that YC is a user. Sources: https://www.ycombinator.com/companies/superserve, https://www.founderland.ai/articles/superserve-launches-vms-for-ai-agents-now-at-100k-weekly-run-mvshtedg
- **Mastra.** "Mastra Factory – From issue to production, run by agents" was #5 on PH's September monthly board (score 539, 110 comments). https://www.producthunt.com/leaderboard/monthly/2026/9
- **Freestyle (S24 on its YC page; the event page says F24).** The Sept 9 changelog says Freestyle is "now focused on VMs" and deprecated its standalone Git, code-exec, web-deploy, and trigger APIs. The Oct 14 changelog added browser terminals and 24h `vm.exec()`. On Oct 24 it shipped a Kali VM. Sources: https://www.freestyle.sh/changelog, https://www.freestyle.sh/changelog/changelog-october-14, https://www.freestyle.sh/blog/product/give-your-ai-security-agent-a-kali-vm

### 2.5 Other F26 launches worth knowing (verified)
- **Spacesheep (F26):** agent output turned into a shared, live "space." Hunted by Garry Tan, #3 Product of the Day on Oct 27, 252 upvotes. One example space streams a live thermal camera. https://www.hunted.space/dashboard/spacesheep
- **Simulithic (F26):** AI users that test apps. Launch YC on Oct 21, 92 upvotes on Nicheloom. Nicheloom's "automated software testing tools" niche has 159 launches. https://www.nicheloom.com/launches/62722/
- **Cyclon, Vexo, Sintem, antimattr (F26):** AI-first phones, wearables, and voice hardware, highlighted by Eight Capital in weeks 5 and 6. https://www.eightcapital.com/spotlight/seed-spotlight-y-combinator-f26-week-5
- **Melty (F26):** "Mashup any game," a consumer gaming bet (same source).
- **DeepMark:** a live watermark inside AI voice. Eight Capital frames its pitch as "verification is becoming the product." https://www.eightcapital.com/spotlight/seed-spotlight-y-combinator-f26-week-4

---

## 3. Product Hunt: Aug-Oct 2026 top launches

PH "score" (on producthunt.com) and "upvotes" (on Junior and Launch Index) differ. For example, Pancake has score 594 vs 578 upvotes. Treat both as approximate.

### October 2026, PH monthly top 10 (fetched Oct 29; month not over)
1. Spira Maxima, autonomous AI influencers (670 on Oct 29; 669 on re-check)
2. Pancake, "Vercel for GTM" via one MCP connection (594)
3. /dev/null, a dev social network built live in 48h (513)
4. ReSO AI, generative-engine optimization (493)
5. IrisGo, "show it once, let it run" desktop automation (469)
6. PH Visual Launch Editor (454)
7. Rill Browser, a browser where Claude Code/Codex work beside you (432)
8. **Velozity, "The Multiplayer AI Office where your team and agents work" (432)**
9. Monospace from Directus, a governed API layer for apps and agents (422)
10. OpenSEO, an open-source Semrush alternative with MCP (415)

Source: https://www.producthunt.com/leaderboard/monthly/2026/10. Junior's October top 20 also includes **OpenSwarm** ("A swarm of agents, in the same place you work," 367) and **OpenBot** ("free, local, open-source, multiplayer," 345). https://junior.adamlead.com/launches/2026/10

### September 2026, PH monthly top 10
Ami AI (AI SDR, 697), tiun. (auth/billing for AI builders, 625), CREEM 2.0 (629), Clueso MCP (618), **Mastra Factory (539)**, Jev (structured AI decisions, 598), Voiskey (voice typing, 537), **Switch ("Bring any AI agent into Slack, Teams & Discord," open source, 413)**, Naoma (video AI demo agent, 541), Kilo Code for JetBrains (425). https://www.producthunt.com/leaderboard/monthly/2026/9

### August 2026, PH monthly top 10 [edge of window]
Clipto MCP, Hey Noah (proactive EA), AdAnt AI (multi-agent social marketing team), **Dograh (open-source Vapi alternative, voice agents)**, Astute, Wispr Flow Notetaker, Grok Bot, Meridian, Coldtea.ai, x1. https://www.producthunt.com/leaderboard/monthly/2026/8

### Week-level signals
- Week of Oct 19-25: 7,146 tools launched on PH plus Show HN, and 254 got 10+ votes. The "AI Agents" category had 546 launches with an 11.9% traction rate. That is the highest count among AI categories and a better hit rate than Productivity (3.9%) or Dev Tools (4.0%). Notable entries: Claude Duet (322), **BAND for Developers ("Coding agents, meet teamwork," 303)**, Beam.win (354), Agent Hunt (259). On Show HN, Omnara ("open-source alternative to Claude Managed Agents") got 112 and Corgi (agent/terminal multiplexer) got 97. https://launchindex.ai/week/2026-10-19
- Week of Oct 12-18: 7,810 launches. Notable entries: Harness by Autonomous ("Every coding agent, every machine, one command center," 326), OpenCode 2.0 (301), daily.dev for agents (204). https://launchindex.ai/week/2026-10-12
- Oct 28 daily #3: BotGauge ("trust layer for your agents," red-team/evals). Oct 28 also had Trigger.dev "Webhooks for your AI agents," pitched as "durable agents: retries, queues." https://www.producthunt.com/leaderboard/daily/2026/10/28

### Frontier-lab launches that shaped October (via PH and Launch Archive)
Claude Haiku 5.5 (Oct 7), GPT-6.1 Terra (computer use), Claude Duet proactive agent (Oct 21), Gemini 4 Carbon (PH Oct 29), Meta Muse Wonder (Oct 13), MiniMax M3.1 Flash (Oct 26, $0.15/$0.60 per 1M tokens), Mistral Voxtral 3 speech models, Genie 4 world model. Sources: https://launcharchive.ai/categories/ai-agents/2026/october, https://junior.adamlead.com/best/artificial-intelligence/october-2026, https://www.producthunt.com/leaderboard/daily/2026/10/26

---

## 4. Crowding map

### 4.1 CROWDED: "multiplayer workspace / chat room for agents and humans"
| Launch | Date (2026) | Signal | Source |
|---|---|---|---|
| Switch (agents in Slack/Teams/Discord) | Sept | PH Sept #8, 413 | PH monthly Sept |
| Bottari (multiplayer Claude Code sessions) | Oct 1 | blog | https://bottari.ai/blog/claude-code-multiplayer |
| Velozity (Multiplayer AI Office) | Oct 7 | PH Oct #8, 451 upvotes | PH monthly Oct; Junior |
| OpenSwarm | Oct 8 | #1 of day, 367 | Junior |
| OpenBot (multiplayer, open source) | Oct 6 | #2 of day, 345 | Junior |
| endue rooms (moderator routes to agents) | Oct 9 | release notes | https://endue.ai/releases/2026-10-09 |
| Agor Cloud open beta (spatial boards) | Oct 13 | blog | https://agor.live/blog/agor-cloud-open-beta |
| Harness by Autonomous | Oct 12-18 wk | 326 | Launch Index |
| Jinxo ("team room for your AI agents") | Oct 18 | X launch | https://launcharchive.ai/categories/ai/2026/october |
| ThoughtSpot AgentSpot ("Multiplayer AI") | Oct 22 | press release | https://www.globenewswire.com/news-release/2026/10/22/3386300/0/en/introducing-agentspot-from-chatbots-to-multiplayer-ai.html |
| Agent Relay (host) | Oct 23 | 96K X views | Launch YC |
| BAND for Developers | Oct 19-25 wk | 303 | Launch Index |
| AgentGrid.io (shared drive for humans and agents) | Oct 25 | #3 of day, 202 | https://hunted.space/product/agentgrid-io |
| Delta ("Claude Code is now multiplayer") | Oct 27 | blog | https://delta.dev/blog/claude-code-multiplayer |
| Spacesheep (F26) | Oct 27 | #3 of day, 252 | hunted.space |
| SwarmChat (Fleet AI, open-source Slack for agent swarms) | Oct 29 | release | https://swarmchat.io/ |
| CoCreate (rooms with AI companions, Supabase Auth) | Oct 23 | open beta | https://olisemeka.dev/projects/cocreate/ |

Inference: a hackathon team that builds "Slack for agents" or "multiplayer Claude Code" is rebuilding the host's own product in a category with more than 15 October entrants. Judges from Agent Relay will compare it directly against their own product.

### 4.2 CROWDED: agent sandboxes, VMs, browsers
F26 alone has Superserve, Agent 37, Boat, Maritime, Boxes.dev, and Tilion. Freestyle (sponsor) and Gologin Cloud Browser (PH Oct 29 #6) compete as well. Inference: use sponsor sandboxes as plumbing and don't pitch a new one.

### 4.3 CROWDED: agent testing, evals, simulation, red-teaming
F26 has Simulithic, Composal, Aucert, Hue, Rystic, Workers IO, Papaya, Mirrors, Latent, and ORO AI. On PH there are BotGauge, Dedica, heal.dev, and RunFiredrill. Nicheloom's testing niche has 159 launches.

### 4.4 CROWDED on PH: GTM, SDR, marketing, GEO agents
Ami AI, Pancake, Spira, AdAnt, ReSO, OpenSEO, Naoma, Needle, GenPage, and Imagine AI (Launch YC Oct 29). These top the leaderboards but are off-theme for this event.

### 4.5 CROWDED: proactive assistants and AI browsers
Hey Noah, Claude Duet, IrisGo, Empacer (PH Oct 29 #1), Kicker, readywhen, and Vexo. Browsers: Rill, Strawberry, Retriever.

### 4.6 CROWDED at the platform layer: "vibe-code a multiplayer game"
myPip ("Hive coding," real-time co-creation, #2 of day Oct 24, 266, claims 140K creators): https://hunted.space/product/mypip-2. Google Labs Playground (#3 of day Oct 9, 227): https://www.hunted.space/product/google-labs. Our Silly Games (Oct 27, a Claude Code/Codex skill with multiplayer rooms): https://aitoolly.com/ai-news/article/2026-10-30-our-silly-games-launches-on-product-hunt-claude-powered-browser-games-with-free-multiplayer-hosting

### 4.7 THIN: a single live multiplayer *experience* where AI agents are players
- Nightfall (Mafia with AI players, voice): PH Oct 17, **1 upvote**. Nicheloom puts "multiplayer browser games" at 130 launches on re-check (an earlier draft said 114). https://www.nicheloom.com/launches/57796/
- Cyber Imposter: AI Among Us: 4 upvotes, not featured. Its launch date is not shown on hunted.space, so it may predate October (unverified). https://hunted.space/product/cyber-imposter-ai-among-us/launches/cyber-imposter-ai-among-us-2
- Humalike Bar (social NPCs, multiplayer room): 7 upvotes. https://hunted.space/product/humalike-bar
- Agentic Kingdoms (browser MMO where AI agents play by the same rules, public MCP server, `skill.md` onboarding): open beta Oct 23. https://www.indiedb.com/news/agentic-kingdoms-is-open-a-browser-strategy-mmo-with-people-and-ai-agents-in-one-world
- **[background]** Gradient Bang (Daily/Pipecat): a voice-driven MMO where you manage AI subagents. Built on Supabase and Vercel Sandbox. PH page says "Launched 6mo ago." https://www.producthunt.com/products/gradient-bang

Inference: people have tried this idea, but none of these has strong polish or traction. The gap is execution. A live room demo where judges' phones join the game is something no October launch I found has done well.

### 4.8 THIN: visible concurrency-safe shared state between agents
Terse's own pitch centers on agents racing on shared data (a CSV, a CRM record). The OSS actor niche is small: 10 launches in Nicheloom's serverless niche. No PH top-20 launch in Sept or Oct demonstrated "N agents, one shared object, no data races" as a visible product feature. Trigger.dev's "durable agents" (Oct 28, 145) is about retries and queues, not shared live state. (Inference based on the leaderboards I read.)

### 4.9 THIN: cross-owner agent-to-agent interaction
Agent Relay's YC page mentions "let a customer's agent debug with yours." Almost every October launch in §4.1 is intra-team. Agents owned by *different* people negotiating or competing in real time appear only in games like Agentic Kingdoms. (Inference.)

---

## 5. What judges and investors are rewarding right now (verified quotes, sourced)
- Eight Capital, Oct 8: "Verification is becoming the product, not the feature... As generation gets cheap, the thing worth selling is proof." Also: "The narrow products are the ones with customers."
- Eight Capital, Oct 15: "The strongest companies stopped building another box to type into. They are building AI that already has the context, does the work, and hands back an outcome."
- Eight Capital, Oct 23 (LinkedIn): "When code generation gets cheap, verification becomes the scarce thing"; "'Where does it run, and who controls it?' has become a selling point." https://www.linkedin.com/posts/eight-capital_ycombinator-startups-venturecapital-activity-7519368070528671744-DQf5
- Launch Index, week of Oct 19-25: the AI Agents category had the most launches *and* the best traction rate (11.9%). Demand for agent products is real, and so is the competition.

---

## 6. Limits / could not verify
- **The Launch YC index page (ycombinator.com/launches) renders client-side.** Exa returned only the filter chrome, so I could not rank F26 Launch YC posts by votes. Individual launch posts were readable.
- Launch Index's week of Sep 28-Oct 4 shows only 173 launches and no PH section. That looks like an ingestion gap, not a real drop.
- PH October data is partial (fetched Oct 29), and ranks may shift by month end.
- Batch-size figures conflict (114 to 189). The MarkosWeb cluster percentages come from one third-party classifier.
- Self-reported metrics that I did not independently verify: Superserve's 100K machines/week, Terse's latency numbers, myPip's 140K creators, Agent Relay's "50+ agents in parallel" (its own launch post).
- I did not run last30days or other social sentiment tools (that angle belongs to another agent). Traction here is leaderboard and aggregator counts only.
- I could not find a Product Hunt launch for Agent Relay or Terse, and I can't say whether either plans one.
- Freestyle's batch: the YC page says Summer 2024, the event page says F24. I cite the YC page.

---

## 7. Hackathon implications

**What to build (category choice)**
1. **Avoid the "Slack for agents" or "multiplayer Claude Code" category.** It had more than 15 entrants in October, and Agent Relay is one of them. Use Agent Relay as the messaging layer *inside* a product that is not itself a chat room.
2. **Aim at §4.7 plus §4.8: a live, multiplayer, Halloween-themed experience where AI agents are participants with hidden state.** Example: a social-deduction séance or haunted-house game. Each room is a Durable Actor that holds authoritative game state and websocket fan-out, and serialized execution prevents double votes and races. The AI "ghosts" or impostors are separate agents that coordinate secretly over an Agent Relay channel. The demo payoff is revealing that hidden agent-to-agent back channel at the end. This uses both host products, fits the theme, sits in the ~3% consumer slice of the batch, and targets a category whose October entrants got 1 to 7 upvotes.
3. **Make the race-condition story visible.** Terse's founding story is agents corrupting shared state. Show a "without actors" split screen with duplicated or lost moves next to the actor version. This lines up with the investor theme that verification is scarce (§5).
4. **Supabase "scale to millions" angle:** one actor per room scales horizontally by design (per Terse's Show HN). Keep accounts, leaderboards, and the durable match history in Supabase Postgres. CoCreate and Gradient Bang both already pair real-time rooms with Supabase.

**Gotchas from the launch material**
- Agent Relay's launch is framed around *coding* agents in terminals and desktop apps. Before Saturday, confirm that the SDK (channels, spawn/release, push) works for agents you run in your own backend, not only Claude Code sessions.
- Durable Actors has **two CLI paths that disagree**, and both need Bun 1.4.2+. The official quickstart, which the event page links to (https://docs.useterse.ai/quickstart), uses `bunx terse-cli@latest install`, then `terse init counter --template counter`, `terse actor dev`, and `terse actor generate`, and it imports from `terse-sdk/actor`. The GitHub README still shows `bunx durable-actors init` and `bunx durable-actors dev` with the `durable-actors` package. An earlier draft called `terse-cli` "Terse Cloud"; that was wrong, because the quickstart uses it for local development. Follow the docs quickstart and pin whichever path works on Thursday or Friday. Self-hosting is documented only on GCP (GKE Sandbox, Postgres, GCS, Helm). Don't attempt a Helm deploy on the day.
- Avoid `@Interleave` in any actor that holds game state you need rolled back on failure. Per Terse's Oct 17 post, it disables automatic rollback for the whole class.
- Terse says it is not API-compatible with Cloudflare DO. Don't port PartyKit or Durable Objects code and expect it to run unchanged.
- Avoid pitching sandboxes, evals, or agent testing as the product. Those categories are saturated inside F26 itself.

**Setup before Oct 31** (ideas are allowed beforehand, code is not)
- Install Bun 1.4.2+, run the docs.useterse.ai quickstart (terse-cli path), and the Agent Relay 5-minute setup on a throwaway project to confirm accounts and keys work. Then delete it, since all code must be written at the event.
- Claim the OpenAI, Supabase, Freestyle, and Superserve credits at check-in. Decide in advance which one, if any, hosts the AI players' tool execution.
- Prepare a 90-second demo script where judges join from their phones. Audience participation is the main lever none of the low-traction October AI party games used.

**What judges and sponsors want (from launch copy)**
- Terse: "multiplayer agents," "coordinating agents... without worrying about data races," websockets per actor.
- Agent Relay: agents that "find each other, talk to each other, and work together" without a human acting as message bus.
- YC and investor lens: narrow, proactive, outcome-delivering, and verifiable (§5).

---

## Sources
- Event page: /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md (https://events.ycombinator.com/haunted-hacks-2026)
- https://www.producthunt.com/leaderboard/monthly/2026/10
- https://www.producthunt.com/leaderboard/monthly/2026/9
- https://www.producthunt.com/leaderboard/monthly/2026/8
- https://www.producthunt.com/leaderboard/daily/2026/10/26
- https://www.producthunt.com/leaderboard/daily/2026/10/28
- https://www.producthunt.com/leaderboard/daily/2026/10/29
- https://junior.adamlead.com/launches/2026/10
- https://junior.adamlead.com/best/artificial-intelligence/october-2026
- https://launchindex.ai/week/2026-10-19
- https://launchindex.ai/week/2026-10-12
- https://launchindex.ai/week/2026-09-28
- https://launcharchive.ai/categories/ai-agents/2026/october
- https://launcharchive.ai/categories/ai/2026/october
- https://www.markosweb.com/startup-ideas/batch/f26
- https://presentofai.com/collections/y-combinator-fall-2026
- https://devhunt.org/yc/f26
- https://fundraisingfox.com/companies/yc/f26
- https://www.remjobs.works/startups/yc/f26
- https://startup.bid/zh/startups/batch/fall-2026/
- https://www.eightcapital.com/spotlight
- https://www.eightcapital.com/spotlight/seed-spotlight-y-combinator-f26-week-1
- https://www.eightcapital.com/spotlight/seed-spotlight-y-combinator-f26-week-4
- https://www.eightcapital.com/spotlight/seed-spotlight-y-combinator-f26-week-5
- https://www.linkedin.com/posts/eight-capital_ycombinator-startups-venturecapital-activity-7519368070528671744-DQf5
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other
- https://www.ycombinator.com/companies/agent-relay
- https://www.launchvideo.com/directory/agent-relay
- https://agentrelay.com/blog/introducing-agent-relay
- https://www.ycombinator.com/companies/useterse
- https://news.ycombinator.com/item?id=49980399
- https://github.com/AgentWorkforce/relay
- https://docs.useterse.ai/quickstart
- https://www.nicheloom.com/launches/44910/
- https://github.com/TerseAI/durable-actors
- https://www.useterse.ai/
- https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects
- https://www.ycombinator.com/companies/superserve
- https://www.founderland.ai/articles/superserve-launches-vms-for-ai-agents-now-at-100k-weekly-run-mvshtedg
- https://www.ycombinator.com/companies/freestyle
- https://www.freestyle.sh/changelog
- https://www.freestyle.sh/changelog/changelog-october-14
- https://www.freestyle.sh/blog/product/give-your-ai-security-agent-a-kali-vm
- https://www.ycombinator.com/launches/W3D-simulithic-ai-users-that-test-your-app-on-every-device-and-browser
- https://www.nicheloom.com/launches/62722/
- https://www.ycombinator.com/launches/WdQ-imagine-ai-you-never-need-to-go-on-linkedin-again
- https://www.ycombinator.com/launches/Vnj-placecall-by-voygr-the-phone-is-the-last-api
- https://www.hunted.space/dashboard/spacesheep
- https://hunted.space/product/agentgrid-io
- https://swarmchat.io/
- https://endue.ai/releases/2026-10-09
- https://agor.live/blog/agor-cloud-open-beta
- https://bottari.ai/blog/claude-code-multiplayer
- https://delta.dev/blog/claude-code-multiplayer
- https://olisemeka.dev/projects/cocreate/
- https://www.globenewswire.com/news-release/2026/10/22/3386300/0/en/introducing-agentspot-from-chatbots-to-multiplayer-ai.html
- https://hunted.space/product/mypip-2
- https://www.hunted.space/product/google-labs
- https://aitoolly.com/ai-news/article/2026-10-30-our-silly-games-launches-on-product-hunt-claude-powered-browser-games-with-free-multiplayer-hosting
- https://www.nicheloom.com/launches/57796/
- https://hunted.space/product/cyber-imposter-ai-among-us/launches/cyber-imposter-ai-among-us-2
- https://hunted.space/product/humalike-bar
- https://www.indiedb.com/news/agentic-kingdoms-is-open-a-browser-strategy-mmo-with-people-and-ai-agents-in-one-world
- https://www.producthunt.com/products/gradient-bang

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims, using live fetches (Exa web_fetch, GitHub API via `gh`). No Firecrawl credits used.

| # | Claim | Re-check source | Outcome |
|---|---|---|---|
| 1 | Event prizes and credits (iPhone for Durable Actors track, Mac mini for Agent Relay, $1k Supabase for "scale to millions", Freestyle listed as F24) | EVENT_PAGE.md lines 9, 29-30, 76-86 | **Confirmed.** The event page calls the prize an "iPhone Duo." |
| 2 | Freestyle batch | ycombinator.com/companies/freestyle | **Confirmed discrepancy.** The YC page says Summer 2024 and the event page says F24. The doc already cites the YC page. |
| 3 | Durable Actors repo: 241 stars, 17 forks, MIT, created 2026-08-30 | `gh api repos/TerseAI/durable-actors` | **Corrected** to 291 stars and 22 forks. MIT and the creation date are confirmed. |
| 4 | Show HN on Oct 6, 52 upvotes, p95 numbers (85.6ms / 2.14ms / 334ms) | HN item 49980399; Nicheloom 44910 | **Confirmed.** Nicheloom shows 52, while live HN now shows 53 points. The latency numbers are quoted exactly but remain self-reported. |
| 5 | Terse vs Cloudflare post (Oct 17): GCP-only self-hosting, "architectural alternative rather than an API-compatible replacement" | useterse.ai blog | **Confirmed.** I also added the `@Interleave` rollback caveat from the same post. |
| 6 | Durable Actors setup commands | docs.useterse.ai/quickstart; repo README | **Corrected.** The docs use `terse-cli` / `terse actor dev` / `terse-sdk`, while the README uses `bunx durable-actors`. The earlier claim that `terse-cli` meant "Terse Cloud" was wrong. Bun 1.4.2+ is confirmed in both. |
| 7 | Agent Relay Launch YC on Oct 23, coding-agent framing, "about 5 minutes", open source/self-host, "50+ agents in parallel" | YC launch post; YC company page | **Confirmed.** "50+ agents" is founder self-report. |
| 8 | Agent Relay X launch: 96K views, 506 likes, 705 bookmarks | launchvideo.com/directory/agent-relay | **Confirmed** (96,378 views; also 62 reposts and 93 comments). This is a third-party tracker, not X itself. |
| 9 | Agent Relay SDK features from the Feb 27 post (push, spawn/release, channels, reactions, read receipts) | agentrelay.com/blog/introducing-agent-relay | **Confirmed** (background). **Added** repo AgentWorkforce/relay: 1,059 stars, Apache-2.0, v14.0.0 on Oct 13, SDK package `@agent-relay/sdk`. |
| 10 | Superserve: <50ms start, 100K machines/week, Lindy customer, YC-as-user unconfirmed | YC page; Founderland Oct 28 | **Refined.** The YC page explicitly claims "Y Combinator itself." Founderland backs Lindy but not YC. |
| 11 | Freestyle Sept 9 VM pivot, Oct 14 browser terminals and 24h `vm.exec()`, Oct 24 Kali VM | freestyle.sh changelog and blog | **Confirmed.** The 24h exec limit needs the updated guest agent; older agents keep the 5-minute limit. |
| 12 | MarkosWeb F26 cluster mix (189 listed, 132 classified, agent infra 18.2% +5.2pp, consumer 3.0%) | markosweb.com F26 | **Confirmed.** It is a single third-party classifier. |
| 13 | Eight Capital quotes (Oct 8 "Verification is becoming the product...", Oct 15 "stopped building another box...", "136 startups") | Eight Capital weeks 4 and 5 | **Confirmed verbatim.** The doc's Oct 8 quote joins two separate bullets with "..." but does not distort them. |
| 14 | Eight Capital LinkedIn Oct 23 quotes | LinkedIn post 7519368070528671744 | **Confirmed verbatim.** The post had 1 reaction, so this is a low-reach source. |
| 15 | PH Oct and Sept monthly boards (Spira 670, Pancake 594, Velozity #8, Mastra Factory #5 at 539, Switch 413) | producthunt.com leaderboards | **Confirmed.** Spira now shows 669. Junior's upvote ranking puts Pancake #1, which I added. |
| 16 | Launch Index Oct 19-25: 7,146 launches, AI Agents 546 with 11.9% traction, BAND 303, Omnara 112, Corgi 97 | launchindex.ai | **Confirmed.** |
| 17 | Spacesheep: #3 of day Oct 27, 252 upvotes, hunted by Garry Tan, live thermal-camera space | hunted.space | **Confirmed.** |
| 18 | Crowding table URLs (SwarmChat Oct 29, Delta Oct 27, Bottari Oct 1, endue Oct 9, Agor Oct 13, CoCreate Oct 23 with Supabase Auth) | Direct fetch of each | **All resolve, and the dates match.** None looks fabricated. |
| 19 | Thin-category games (Nightfall 1 upvote, Cyber Imposter 4, Agentic Kingdoms Oct 23 with MCP + skill.md, Gradient Bang Supabase/Vercel) | Nicheloom, hunted.space, IndieDB, PH | **Mostly confirmed.** Nightfall's niche count is now 130, not 114. Cyber Imposter's launch date is not shown and is marked (unverified). |
| 20 | Our Silly Games URL dated "2026-10-30" (after today) | aitoolly.com | **Resolves.** The page's publish date is Oct 27, so the URL slug date is the site's own convention. Kept. |

**Not re-checked (left as originally sourced):** the exact batch counts from RemJobs, Fundraising Fox, and startup.bid; the DevHunt F26 roster grouping; the frontier-model launch list in §3 (Claude Haiku 5.5, GPT-6.1 Terra, Gemini 4 Carbon, and others), which carries second-hand aggregator dates; Agent37's 163-point Show HN; myPip's 140K creators (self-reported).
