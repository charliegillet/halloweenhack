# Mastra: team, strategy and competition (for Haunted Hacks, 31 Oct 2026)

Checked **29 October 2026**. Sources: Mastra blog and sitemap (`mastra.ai/sitemaps/blog.xml`), YC company page, founder LinkedIn and X posts (read through public mirrors), `gh` CLI for GitHub, npm registry download API, and third-party comparison articles. Firecrawl was not used. Each claim links to its source. **Inference** is labelled as such. Items before about 1 Aug 2026 are marked *background*.

Mastra's role at this event: it is a **sponsor, not a host**. It has no track of its own. Its prize is months of Mastra Platform for the top three overall: 3 months for first place, 2 for second, 1 for third ([event page](https://events.ycombinator.com/haunted-hacks-2026), local copy `../../EVENT_PAGE.md`). Judges were "to be announced", so it is **unknown whether anyone from Mastra will judge**.

---

## 1. Team

### Founders (verified)

| Person | Role | Background (source) |
|---|---|---|
| **Sam Bhagwat** (X: `@calcsam`) | Founder/CEO | Co-founded Gatsby.js, which "scaled to $5M ARR, sold to Netlify". Engineer in the first ~20 at Zenefits (W13) and Plangrid (W12). Stanford '11 ([YC page](https://www.ycombinator.com/companies/mastra)). Author of *Principles of Building AI Agents* and *Patterns for Building AI Agents* ([LinkedIn](https://linkedin.com/in/sambhagwat)). Says Gatsby "raised $50M" (same LinkedIn). |
| **Abhi Aiyer** | Co-founder/CTO | "Principal eng & lead of >100 person eng org at Netlify. Built Gatsby Cloud infra that ran 10s of thousands of build nodes" ([YC page](https://www.ycombinator.com/companies/mastra)). Earlier at Workpop (acquired by Cornerstone). Lead architect of Netlify Connect, Feb 2023 to Jun 2024 ([LinkedIn](https://linkedin.com/in/abhi-aiyer-aa41bb42)). |
| **Shane Thomas** | Co-founder/CPO | "Prev: built Audiofeed (AI podcasting). Staff eng / head of product @ Gatsby. 15+ years in open source" ([YC page](https://www.ycombinator.com/companies/mastra)). Co-hosts the "Agents Hour" show ([LinkedIn](https://linkedin.com/in/smthomas3)). |

Other people worth recognising:
- **Tony Kovanen** is a Founding Engineer at Mastra (listed on the [about page](https://mastra.ai/about)). His LinkedIn headline says he was previously "co-founder of Vercel, co-creator of Next.JS" ([LinkedIn](https://fr.linkedin.com/in/tony-kovanen-36991a74)). **Re-checked 29 Oct:** the co-founder part is independently corroborated. Guillermo Rauch wrote that he started ZEIT (renamed Vercel in 2020) in November 2015 "with my friends and brilliant engineers Tony Kovanen and Naoyuki Kanezawa" ([rauchg.com, 2016 in review](https://rauchg.com/2017/2016-in-review); [ZEIT is now Vercel](https://vercel.com/blog/zeit-is-now-vercel)). The Next.js part is **not** corroborated: Rauch's own account names "Tim Neutkens, Naoyuki Kanezawa and I" as Next.js co-creators ([rauchg.com/2020/vercel](https://rauchg.com/2020/vercel)). Kovanen's LinkedIn says he "co-authored Next.js". Treat that as self-described.
- **Paul Scanlon** writes nearly all of the "Introducing X" feature posts from Aug to Oct 2026 and acts as the DevRel voice for features. **Patrycja Jenkner-Sar** wrote Agent Controller GA, Mastra Connect and Thread View. **Alex Booker** is listed on the team page ([blog index](https://mastra.ai/blog), [about](https://mastra.ai/about)).
- Team size is "a team of 45" according to the [about page](https://mastra.ai/about). A LinkedIn-derived aggregator says 62 employees across 10+ countries ([LinkedIn company data](https://linkedin.com/company/mastra-ai)). The [YC page](https://www.ycombinator.com/companies/mastra) still says "Team Size: 30", which looks stale. Use 45 as the official figure. The about page lists 45 named people.

### Founding story (their own words)
- "Last October, Shane, Abhi and I were struggling to build agents for sales. The tooling just sucked. After we got back from a weekend hackathon, the idea came up that we should build better tooling instead." ([seed post, 8 Oct 2025](https://mastra.ai/blog/seed-round), *background*)
- "18 months ago, we walked out of a NYC AI hackathon trying to figure out why people were writing Python notebooks instead of shipping TypeScript agents." ([Series A post, 9 Apr 2026](https://mastra.ai/blog/series-a), *background*)
- **Inference:** Mastra was born out of a hackathon, and the founders tell that story in both funding posts. They will probably be sympathetic to hackathon builders and to the idea that a weekend project can turn into a company.

## 2. YC batch, funding and traction

| Date | Event | Source |
|---|---|---|
| Winter 2025 | YC W25. Launch pitch: "open-source JavaScript SDK for building agents on top of Vercel's AI SDK". The launch post says it "went viral on Hacker News and Github and went from 1,500 to 7,500 stars" | [YC page](https://www.ycombinator.com/companies/mastra) (*background*) |
| Mar 2025 (announced 8 Oct 2025) | **$13M seed** from "120+ others" per the headline ("100+" in the body), including YC, Paul Graham, Gradient, basecase, Guillermo Rauch, Amjad Masad, Balaji and others. Sam calls it "the largest post-YC cap table, as far as we can tell, in several years" | [seed post](https://mastra.ai/blog/seed-round) (*background*) |
| 6 Nov 2025 | v1 beta, at "over 220k weekly npm downloads" | [v1 post](https://mastra.ai/blog/mastrav1) (*background*) |
| 9 Apr 2026 | **$22M Series A led by Spark Capital**, bringing the total to **$35M**. Mastra Platform (Studio, Server, Memory Gateway) launched the same day | [Series A post](https://mastra.ai/blog/series-a), [Spark LinkedIn](https://www.linkedin.com/posts/spark-capital-llc_activity-7449498829219020801-j-Cs) (*background*) |

Aggregators conflict: LinkedIn-derived data says "$48M", which appears to count the seed twice. Dealroom lists Gokul Rajaram as a Series A participant ([Dealroom](https://app.dealroom.co/companies/mastra_ai)). **The official figure is $35M.**

**Traction, measured 29 Oct 2026:**
- GitHub `mastra-ai/mastra`: **29,200 stars**, 3,061 forks, 640 open issues and PRs, last push 30 Oct 2026 UTC (`gh repo view`). Weekly commits over the last 12 weeks ranged from 263 to 638 (`gh api .../stats/participation`).
- **Release cadence is roughly weekly or faster:** `@mastra/core` 1.76.0 (11 Oct), 1.77.0 (14 Oct), 1.78.0 (15 Oct), 1.79.0 (21 Oct), 1.80.0 (28 Oct) (`gh release list`).
- npm `@mastra/core` monthly downloads: Jul **5.38M**, Aug **6.07M**, Sep **7.05M**, Oct 1–28 **7.69M** (npm range API). That is steady month-over-month growth.
- License: Apache 2.0, except that `ee/` directories (auth/RBAC, agent-builder and editor enterprise features) use a separate license ([LICENSE.md](https://github.com/mastra-ai/mastra/blob/main/LICENSE.md)). The copyright holder is "Kepler Software, Inc."

## 3. Positioning and ICP

**Core thesis:** TypeScript is where agents get built, because agents are becoming features inside ordinary web apps.
- Spark's announcement: "Last year TypeScript overtook Python as the #1 language on GitHub. Agents are becoming features inside normal web applications, and normal web applications run on TypeScript." ([Spark LinkedIn](https://www.linkedin.com/posts/spark-capital-llc_activity-7449498829219020801-j-Cs))
- Sam on a podcast: "In our YC batch, roughly a third of agent startups were using TypeScript; we heard that three months later the share was already over half." This line comes from an AI-extracted Q&A of the episode ([Scaling DevTools, Jul 2025](https://scalingdevtools.com/podcast/episodes/sam-from-mastra-the-gatsby-founder-building-an-agents-framework), *background*), so treat it as a paraphrase.
- "More powerful models need more powerful harnesses… harnesses have become bigger, not smaller." ([Series A post](https://mastra.ai/blog/series-a))
- Model-agnostic ownership as a selling point: "it works with every model and every platform, so when you build with Mastra, you own your agents in a way that's not true elsewhere." ([Mastra Launch, 20 Oct 2026](https://mastra.ai/blog/announcing-mastra-launch))

**ICP, as Mastra names it** ([Series A post](https://mastra.ai/blog/series-a), [Launch post](https://mastra.ai/blog/announcing-mastra-launch)):
1. Scale-ups embedding agents in their product: Brex, Sanity, Factorial, and Indeed's career-counselor agent.
2. Enterprise platform teams automating DevOps/SRE: MongoDB, Workday, Salesforce. Marsh McLennan runs enterprise search used by "100k+ people every day".
3. Platforms that let their own users build agents: Replit.
4. More recently, regulated enterprises. Aug to Oct 2026 posts include Fine-Grained Authorization (19 Aug), "GDPR-ready agents" and "secure, governed agents for regulated enterprise" (28 Sep), VPC-isolated Postgres (1 Oct), and Studio SSO (19 Oct) ([sitemap](https://mastra.ai/sitemaps/blog.xml)).

**Monetisation** ([pricing](https://mastra.ai/pricing)):
- **Starter** is $0: 100K observability events, 24 CPU-hours, 15-day retention, unlimited deployments.
- **Teams** is $250/month: 1M events, 250 CPU-hours, 6-month retention, "Multiple teams, SSO, and SOC 2 docs".
- **Enterprise** is custom, or self-hosted for a flat annual fee.
- Model Gateway tokens cost "Market Rate + 5.5%". A "Persistent Server (24/7 Uptime)" is $100/project on both Starter and Teams. That matters if you want an always-on demo agent on Mastra Platform.
- **Inference:** "3 months of Mastra Platform" is probably the Teams tier, worth about $750 for first place. I could not verify which tier the prize refers to.

## 4. Strategy over the last 90 days (Aug–Oct 2026)

Reading the [blog sitemap](https://mastra.ai/sitemaps/blog.xml) and [index](https://mastra.ai/blog) in order shows a clear arc: **framework, then platform, then harness, then software factory, then enterprise services.**

| Date | Launch | What it signals |
|---|---|---|
| 27 Jul (*background, just outside the window*) | **Mastra Factory** alpha. "Mastra started as an agent framework. Then we shipped long-running agents. We became a harness framework. And now Mastra is also a factory framework." ([post](https://mastra.ai/blog/announcing-mastra-factory)) | Their self-described trajectory |
| Aug 3–28 | Managed sandboxes/filesystems, iMessage support, dynamic workflows, built-in tools, `create-coding-agent` helper, AI SDK v7 support, FGA, multi-turn evals, tool/skill search processors, Helm chart, token cost control ([sitemap](https://mastra.ai/sitemaps/blog.xml)) | Coding-agent and enterprise primitives |
| 1 Sep | **Harness Channels**: "Run a multi-player harness from Slack, iMessage, WhatsApp, Discord" ([post](https://mastra.ai/blog/introducing-harness-channels)) | Multiplayer agents |
| 8 Sep | **Mastra Factory beta**: "now writing 25-35% of our PRs and closing 50-60% of our issues" ([post](https://mastra.ai/blog/announcing-mastra-factory-beta)) | Building it for themselves first |
| Sep 14–30 | Server health, incident alerts, experiment targets/hooks/tool mocks, Vitest integration, memory hooks ([sitemap](https://mastra.ai/sitemaps/blog.xml)) | Evals/ops depth |
| 6 Oct | **Agent Controller GA** (renamed from "Harness"): the "runtime that hosts long-running agent sessions"; "over 1800 commits authored by Mastra Factory this month alone"; memory use cut "from 2–20 GB to 300–750 MB" ([post](https://mastra.ai/blog/announcing-agent-controller-ga)) | Long-running, multi-session agents |
| 7 Oct | **Mastra Connect**: 23 providers, about 900 tools, free during beta ([post](https://mastra.ai/blog/introducing-mastra-connect)) | Integrations without third parties |
| 8 Oct | **Fine-Grained Context** essay by Sam ([post](https://mastra.ai/blog/fine-grained-context)) and **Agency Program** with 5 launch partners ([post](https://mastra.ai/blog/mastra-agency-program)) | Multiplayer agents and a channel strategy |
| Oct 12–28 | Observability series: Thread View, Metrics API, Trace Imports, Trace Queries, Span Queries ([index](https://mastra.ai/blog)) | Competing with LangSmith and Langfuse |
| 20 Oct | **Mastra Launch**: a forward-deployed engineer (FDE) for 90 days; if the agent isn't live, "all you pay is the implementation fee" ([post](https://mastra.ai/blog/announcing-mastra-launch)) | Enterprise services |
| 21–23 Oct | MCP 2.0 (spec 2026-07-28) and **MCP Events** (push/poll/webhook `emit()`/`subscribe()`; agents react through `MCPEventsSignalProvider`) ([post](https://mastra.ai/blog/introducing-mcp-events)) | **Real-time / event-driven agents** |
| 22 Oct | **Incident report**: hosting provider Railway announced a security breach. Mastra Platform users' env vars "may have been accessed by third parties"; builds were down for hours; Mastra is "considering moving off of Railway entirely" ([post](https://mastra.ai/blog/platform-incident-october-21-2026)) | Platform reliability risk |
| 26 Oct | **Mastra Knowledge** "company brain", early access, "eight more design partners" ([post](https://mastra.ai/blog/announcing-mastra-knowledge)) | Org-level context layer |

### Public statements and roadmap hints from founders (last 90 days)
- Sam on X, 18 Aug: "a lot of open source projects are going to stop accepting PRs. It's faster to fix an issue with a factory than go back and forth with a meat proxy". On 15 Oct: "Today we turned off external PRs for Mastra… Instead we're encouraging contributors to open issues with detailed repros" ([X mirror](https://nitter.rdrama.net/calcsam/status/2110560376173863206)).
- Sam on X, 5 Oct, promoting a CI-harness meetup: "you can un-fuck your CI with agents!" (unverified on re-check) ([X mirror](https://xitter.cf/calcsam/status/2107173181471752653)).
- Sam on X, 22 Oct: "Langfuse built their in-app assistant with Mastra!" ([X mirror](https://teapawt.org/calcsam/status/2113373884917617051)).
- Abhi was a speaker at the "first SF Software Factory Meetup" co-hosted by Momentic, around 25 Sep ([LinkedIn activity](https://linkedin.com/in/abhi-aiyer-aa41bb42)).
- Things they say are on the roadmap:
  - Series A post: "we're working on heartbeat, channels, browser access, and web data". Channels and browser access have since shipped ([Series A](https://mastra.ai/blog/series-a), [Firecrawl browser post](https://mastra.ai/blog/mastra-firecrawl-browser-login)).
  - Fine-Grained Context: "We might add it as a primitive in the future" ([FGC](https://mastra.ai/blog/fine-grained-context)).
  - Knowledge graph "as a free-standing primitive", now shipped as Knowledge ([Factory beta](https://mastra.ai/blog/announcing-mastra-factory-beta)).
  - "control plane work to allow hosting on other providers" ([incident](https://mastra.ai/blog/platform-incident-october-21-2026)).
- Durable-agent philosophy, from Sam's essay "What are durable AI agents?" The page now shows "Last updated: Oct 28, 2026", and its original 30 Jun publication date is (unverified). It maps directly onto this event. The subtitle reads: "A long-running agent is a durable record that short-lived processes take turns with." The body says a long-running agent is "less one program running for a week and more a relay of processes passing a record between them". In his framing, "The durable record is the log of what happened… the one source of truth a fresh model loop reads" ([post](https://mastra.ai/blog/what-are-durable-ai-agents)).

## 5. Competition and how Mastra differs

**Measured 29 Oct 2026** (`gh repo view`; npm downloads for 29 Sep to 28 Oct):

| Framework | GitHub stars | npm/month | Mastra's framing, or third-party framing |
|---|---|---|---|
| Mastra (`@mastra/core`) | 29,200 | 8.45M | "Teams developing production AI applications with TypeScript"; batteries included ([Mastra roundup](https://mastra.ai/blog/best-ai-agent-frameworks)) |
| Vercel AI SDK (`ai`) | 27,616 | 119.9M | Mastra was originally built **on top of** it and supports AI SDK v7. It is a partner and a substrate more than a rival. One third-party writer says it "persists nothing by default and pushes durability into a companion runtime" (`WorkflowAgent`) ([menuagentic, Sep 2026](https://menuagentic.com/blogs/mastra-vs-langgraph-js-vs-voltagent-vs-ai-sdk/)) |
| LangGraph.js / LangChain Deep Agents | 3,387 / 1,626 | 14.68M (`@langchain/langgraph`) | Mastra's roundup says of LangGraph: "flexibility comes with additional complexity". Mastra has published head-to-heads: Agent Controller vs Deep Agents (1 Oct), and vs LangSmith and Langfuse (22 Oct) ([comparisons hub](https://mastra.ai/topics/comparisons)) |
| OpenAI Agents SDK JS (`@openai/agents`) | 3,955 | 7.90M | Mastra's roundup: "intentionally focused on the OpenAI ecosystem rather than providing a complete framework". Third parties highlight its `RealtimeAgent` voice support ([ayautomate](https://www.ayautomate.com/blog/best-typescript-ai-agent-frameworks)) |
| Cloudflare Agents SDK (`agents`) | 5,916 | 8.83M | Built on Durable Objects, with per-agent state, hibernation and WebSockets. Described as "Built for Cloudflare's runtime… Still pre-1.0" ([ayautomate](https://www.ayautomate.com/blog/best-typescript-ai-agent-frameworks)). **This is the closest conceptual rival to Terse's Durable Actors** |
| VoltAgent (`@voltagent/core`) | 10,896 | 0.15M | "observability-first" with a built-in console ([ayautomate](https://www.ayautomate.com/blog/best-typescript-ai-agent-frameworks)) |

Caveat: npm counts include CI and transitive installs. `ai` and `@langchain/langgraph` get pulled in as dependencies, and Mastra itself depends on the AI SDK. **Do not read the downloads column as market share.**

How Mastra differentiates itself (self-described plus third-party):
- An integrated stack: agents, workflows with `suspend()`/`resume()`, memory, evals, a local Studio with tracing, and deployers for Cloudflare, Netlify, Vercel and Mastra Cloud ([GitHub deployers dir](https://github.com/mastra-ai/mastra/tree/main/deployers)).
- One third party calls this "the most capability per line of code" and also "concentrates the most in one vendor's vocabulary" ([menuagentic](https://menuagentic.com/blogs/mastra-vs-langgraph-js-vs-voltagent-vs-ai-sdk/)).
- Mastra already ships `CloudflareDOStorage`, a storage adapter on Durable Objects SQL ([repo](https://github.com/mastra-ai/mastra/tree/main/stores/cloudflare)). So actor-backed storage has precedent inside Mastra.
- **Overlap with this event's hosts (inference):**
  - Agent Controller sessions and channels sit in the same conceptual space as Terse's Durable Actors (per-session stateful hosts) and Agent Relay (multi-party messaging).
  - Mastra's MCP Events also overlaps with Relay's realtime events.
  - I found **no** official Mastra integration with either host: no `@mastra/*` Relay package, and no Mastra mention in Terse's quickstart or `llms.txt`. Agent Relay's "communicate mode" lists AI SDK, CrewAI, Claude Agent SDK and others, but I did not see Mastra ([Relay docs](https://agentrelay.com/docs/7.1.1/communicate)). Re-checked 29 Oct on the unversioned page ([/docs/communicate](https://agentrelay.com/docs/communicate), TypeScript SDK v14.0.0 latest, Python v7.1.1). It covers Claude Agent SDK, Google ADK, Pi, AI SDK, OpenAI Agents, Agno, Swarms and CrewAI, and **does not mention Mastra**. Only the `ai-sdk`, `claude-sdk` and `pi` TypeScript adapters are published entry points. AI SDK delivery is "Poll (Tier 2)": messages arrive only at tool-call boundaries, not mid-run.
  - Mastra still works with Relay in practice, either by using Relay's MCP server (`agent-relay mcp`) as an MCP tool source or through the AI SDK adapter ([Relay MCP](https://agentrelay.com/docs/agent-relay-mcp)). `agent-relay mcp` is a **stdio** server, so configure it in Mastra's `MCPClient` as a command, not a URL. It exposes `register_agent`, `list_agents`, `spawn`, messaging/inbox tools and `invoke_action`. Wrapping the AI SDK model via `wrapLanguageModel` inside a Mastra agent is (unverified): I did not test that Mastra accepts a middleware-wrapped model.

## 6. What Mastra says it wants developers to build

- **DEV Hacktoberfest 2026 (live now):** Mastra is a partner category sponsor. The brief for "Best Use of Mastra" reads: "Orchestrate an agent over open models, add memory and tools to a chat agent, or build a workflow that triages GitHub issues." ([DEV Week 4](https://dev.to/challenges/hacktoberfest-week4-2026-10-26))
  - Week 4's theme is **"Ghost in the Machine"** (spooky). It runs **26–31 Oct, closing 11:59pm PDT on Halloween**. Projects must be new, created during the entry period, and built with open-weight models or open-source AI, and the write-up is "weighted most heavily" ([rules](https://dev.to/page/hacktoberfest-week4-2026-10-26-contest-rules)).
  - The prize is $100 plus a badge. Mastra is one of 14 "Partner" categories at $100 each. The 6 "Featured" categories pay $200 and the overall winner gets $250. Each participant can win **at most one** prize, and only one entry is allowed. Required elements: a DEV post using the template and challenge tag, a demo (link or video), a repo link, an explanation of the open-source AI used, and "meaningful use" of the partner tech for each category entered ([rules](https://dev.to/page/hacktoberfest-week4-2026-10-26-contest-rules)).
  - Recent Mastra category winners were small, specific, useful tools, for example ParcelProof, a voice-note dispute checker ([DEV winners](https://dev.to/devteam/congrats-to-the-hacktoberfest-open-source-ai-challenge-week-2-side-hustle-winners-2i33)).
- **Other Mastra hackathon tracks (*background*):**
  - HackGT 2025 "Best Use of Mastra Agent Framework for Productivity", sponsored by Ergo (YC W25). The winner, CanDraw, was a real-time whiteboard and diagram copilot ([Devpost](https://hackgt-12.devpost.com/), [winner LinkedIn](https://linkedin.com/in/vikashftw)).
  - An A2A hackathon in July 2025 had "Best use of Mastra" ([Devpost](https://a2a-agents-hackathon.devpost.com/)).
  - Mastra ran its own virtual MASTRA.BUILD: Templates hackathon, 28 Jul – 11 Aug, which it called its "second-ever hackathon" ([page](https://mastra.ai/hackathon)). The year isn't shown, but it is probably 2025.
- **What the blog keeps showcasing:**
  - Software factories ("Come build your own Software Factory" is also in this event's brief).
  - Multiplayer agents in Slack and chat channels, with permission-correct context (FGC).
  - Long-running agents you can watch, interrupt and steer (Agent Controller signals).
  - Event-driven agents (MCP Events).
  - Observability you can query with a coding agent (Trace and Span Queries).

## 7. What would impress Mastra-affiliated judges (inference)

These points are inferred from the statements above, not from any judging rubric. Mastra's prize goes to the top three overall, so these are **tie-breakers on top of** the host criteria (Durable Actors and/or Agent Relay).
1. **Durable "relay of short-lived processes"** is Sam's own framing. A demo where you kill the agent process mid-task and a fresh Mastra agent resumes from a Terse actor's record hits both his essay and the Durable Actors track.
2. **Multiplayer and steerable, not a chatbot.** Several humans or agents join one live session, steer it mid-run, and approve tools. This matches Agent Controller and Channels and the FGC essay. A *visible* permission boundary would land well: for example, a private "haunted" fact one player knows that the agent refuses to leak into the shared room.
3. **A small software factory or ops loop** that does real work, such as issue to triage to fix to review. This is literally how they now run their own repo.
4. **Traces shown in Mastra Studio** (`localhost:4111`) during the demo. They have shipped an observability feature almost every day in October.
5. **Idiomatic TypeScript primitives**: Agent, Workflow with suspend/resume, Memory, MCPClient. Avoid a raw OpenAI loop with a Mastra import bolted on.

## Limits / could not verify
- Whether any Mastra employee is judging, attending or mentoring on 31 Oct. Judges were unannounced as of the event page capture.
- Which Mastra Platform tier the prize covers.
- The current post-money valuation and revenue. None has been published.
- Tony Kovanen's Vercel co-founder claim comes only from his LinkedIn headline.
- Founder X posts were read through Nitter-style mirrors, not x.com directly. I quoted the text as shown there. On 29 Oct, x.com and the nitter mirror returned errors (403/unavailable) for direct fetches. The 15 Oct, 18 Aug and 22 Oct texts were re-confirmed through Exa's index of the mirrors. The 5 Oct "un-fuck your CI" post was not re-checked.
- The 30 Jun original date of the durable-agents essay. The live page shows only "Last updated: Oct 28, 2026".
- The "a third / over half TypeScript" stat is from an AI-extracted podcast Q&A, not a verbatim transcript.
- No social-sentiment sweep was run; that belongs to another angle.
- Third-party framework comparisons are SEO-style articles. I used them only for framing, not as fact.

---

## Hackathon implications

**What to build (Mastra-leaning, host-compliant):**
- Use a **Mastra Agent for the reasoning loop**.
- Use **Terse Durable Actors as the per-entity durable record**, one actor per haunted house, séance room or player.
- Use **Agent Relay for agent-to-agent handoffs**, for example via Relay's MCP server consumed through Mastra's `MCPClient`.
- Optionally react to outside events with **MCP Events**. Real-time is the theme, and MCP Events is Mastra's newest real-time primitive (`@mastra/mcp@2.5.0+`, `@mastra/core@1.79.0+`).
- Demo beat: kill a worker live and show it resume from the actor's record, with the trace visible in Studio.

**Gotchas:**
- Mastra ships about weekly (1.76 to 1.80 in October). **Pin `@mastra/core` (1.80.0 today)** and don't upgrade on the day.
- Node **≥22.13** is required. Re-verified from the npm registry: `@mastra/core@1.80.0` and `create-mastra@1.36.0` both declare `engines.node: ">=22.13.0"`.
- Mastra **turned off external PRs on 15 Oct** (Sam on X, see §4). If you hit a framework bug on the day, file an issue with a repro. Don't expect a PR to merge, and route around the bug.
- MCP Events needs `@mastra/mcp@2.5.0+` and `@mastra/core@1.79.0+` ([post](https://mastra.ai/blog/introducing-mcp-events)). Latest on 29 Oct: `@mastra/mcp` 2.6.0, `@mastra/core` 1.80.0.
- **Platform risk:**
  - The 21 Oct Railway breach and build outage hit Mastra Platform.
  - Run locally or deploy elsewhere as the primary path, and treat Mastra Cloud deploy as optional.
  - Don't put high-value secrets in Platform env vars. Use the per-event $100 OpenAI key and rotate it after.
- Agent Controller and Channels overlap with what the hosts sell. **Present Mastra as the agent brain, Terse as state, and Relay as the wire.** Don't use Mastra to replace the host products.
- Don't spend build time writing a Terse storage adapter for Mastra. `CloudflareDOStorage` shows the pattern, but it costs too much in 5 hours. Instead, call actor RPCs from Mastra tools.

**Setup before 31 Oct:**
- Run `npm create mastra@latest` and confirm Studio comes up on `:4111`.
- Set the model string `openai/<model>` with your key.
- Create a free Starter Platform account so the prize is redeemable.
- Skim the Agent Controller, MCP and Memory docs.
- Pre-plan (but don't pre-write, since all code must be written at the event) the actor and tool boundaries.

**Optional double-dip:**
- The same new, open-source-framework project could also go to **DEV Hacktoberfest Week 4 "Best Use of Mastra"**, which is Halloween-themed and closes 11:59pm PDT on 31 Oct.
- It needs a write-up post (weighted most heavily) and must have open-source AI at its core.
- First check that the YC event has no exclusivity terms. I could not verify either way.
- Caveat: the DEV project must be "built with open-weight models and/or open-source AI". Mastra, being an Apache-2.0 framework, plausibly qualifies by itself, but the Mastra brief explicitly says "over open models". A GPT-only build is a weaker fit. Using an open-weight model for at least one agent is safer. Whether the judges will accept Mastra plus a closed model is (unverified).

**Team logistics (secondary source):** the Builderbase-run Luma listing says "Teams of up to 4" and puts the event at the YC office ([Luma](https://luma.com/builde-oxba)). The YC event page does not state a team cap. An older aggregator copy said judging was on Devpost, but the current pages say Builderbase ([hackathonradar](https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026)).

## Sources
- Event page: https://events.ycombinator.com/haunted-hacks-2026 (local `../../EVENT_PAGE.md`)
- https://www.ycombinator.com/companies/mastra
- https://mastra.ai/about · https://mastra.ai/pricing · https://mastra.ai/hackathon · https://mastra.ai/topics/comparisons · https://mastra.ai/sitemaps/blog.xml · https://mastra.ai/blog
- https://mastra.ai/blog/seed-round · https://mastra.ai/blog/series-a · https://mastra.ai/blog/mastrav1
- https://mastra.ai/blog/what-are-durable-ai-agents · https://mastra.ai/blog/software-factory · https://mastra.ai/blog/best-ai-agent-frameworks · https://mastra.ai/blog/choosing-a-js-agent-framework
- https://mastra.ai/blog/announcing-mastra-factory · https://mastra.ai/blog/announcing-mastra-factory-beta · https://mastra.ai/blog/introducing-harness-channels
- https://mastra.ai/blog/announcing-agent-controller-ga · https://mastra.ai/blog/introducing-mastra-connect · https://mastra.ai/blog/fine-grained-context · https://mastra.ai/blog/mastra-agency-program
- https://mastra.ai/blog/announcing-mastra-launch · https://mastra.ai/blog/introducing-mcp-events · https://mastra.ai/blog/platform-incident-october-21-2026 · https://mastra.ai/blog/announcing-mastra-knowledge
- https://www.linkedin.com/posts/spark-capital-llc_activity-7449498829219020801-j-Cs · https://app.dealroom.co/companies/mastra_ai
- https://linkedin.com/in/sambhagwat · https://linkedin.com/in/abhi-aiyer-aa41bb42 · https://linkedin.com/in/smthomas3 · https://fr.linkedin.com/in/tony-kovanen-36991a74
- https://nitter.rdrama.net/calcsam/status/2110560376173863206 · https://xitter.cf/calcsam/status/2107173181471752653 · https://teapawt.org/calcsam/status/2113373884917617051
- https://www.infoq.com/podcasts/tiger-teams-evals-agents/ · https://scalingdevtools.com/podcast/episodes/sam-from-mastra-the-gatsby-founder-building-an-agents-framework
- https://github.com/mastra-ai/mastra (LICENSE.md, deployers/, stores/cloudflare)
- npm API: https://api.npmjs.org/downloads/point/last-month/@mastra/core (and `ai`, `@langchain/langgraph`, `@openai/agents`, `agents`, `@voltagent/core`)
- https://menuagentic.com/blogs/mastra-vs-langgraph-js-vs-voltagent-vs-ai-sdk/ · https://www.ayautomate.com/blog/best-typescript-ai-agent-frameworks · https://cadenya.com/other-content/typescript-ai-agent-frameworks-compared
- https://agentrelay.com/docs/agent-relay-mcp · https://agentrelay.com/docs/7.1.1/communicate · https://agentrelay.com/docs/communicate
- https://rauchg.com/2017/2016-in-review · https://rauchg.com/2020/vercel · https://vercel.com/blog/zeit-is-now-vercel
- https://luma.com/builde-oxba · https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026
- npm registry: https://registry.npmjs.org/@mastra/core/latest · https://registry.npmjs.org/create-mastra/latest · https://registry.npmjs.org/@mastra/mcp/latest
- https://dev.to/challenges/hacktoberfest-week4-2026-10-26 · https://dev.to/page/hacktoberfest-week4-2026-10-26-contest-rules · https://dev.to/devteam/congrats-to-the-hacktoberfest-open-source-ai-challenge-week-2-side-hustle-winners-2i33
- https://hackgt-12.devpost.com/ · https://a2a-agents-hackathon.devpost.com/ · https://linkedin.com/in/vikashftw

## Verification log (2026-10-29)

Adversarial re-check of 15 decision-relevant claims against live sources. Outcomes: **OK** = confirmed, **FIXED** = corrected in place, **PARTIAL** = part confirmed, **UNVERIFIED** = could not confirm.

| # | Claim | Method / source | Outcome |
|---|---|---|---|
| 1 | Mastra prize = 3/2/1 months of Platform for top three; no Mastra track; judges TBA | `../../EVENT_PAGE.md`, YC Luma mirror (luma.com/yc-meetup-7183-9316f87f) | OK |
| 2 | GitHub 29,200 stars, 3,061 forks, last push 30 Oct UTC | `gh repo view mastra-ai/mastra`: 29,202 stars, 3,061 forks, pushedAt 2026-10-30T05:50Z | OK |
| 3 | `@mastra/core` releases 1.76.0 to 1.80.0 on 11/14/15/21/28 Oct | `gh release list` | OK. Tags were published 13 Oct and 16 Oct for 1.76 and 1.78, but the release names carry the listed dates |
| 4 | npm monthly downloads Jul 5.38M / Aug 6.07M / Sep 7.05M / Oct 1-28 7.69M; 29 Sep-28 Oct 8.45M | npm range API | OK (exact: 5,381,812 / 6,073,044 / 7,054,478 / 7,690,785 / 8,452,839) |
| 5 | Competitor stars and npm figures (AI SDK 27,616 / 119.9M, etc.) | `gh repo view` + npm API | OK, within +1 star |
| 6 | $22M Series A led by Spark, $35M total, 9 Apr 2026 | mastra.ai/blog/series-a | OK |
| 7 | $13M seed, "120+" investors, "largest post-YC cap table" quote | mastra.ai/blog/seed-round | OK. Added the 100+/120+ inconsistency |
| 8 | Team of 45 | mastra.ai/about (45 named) | OK. Added YC page's stale "30" |
| 9 | Pricing: Starter $0, Teams $250, Market Rate +5.5% | mastra.ai/pricing | OK. Added 6-month retention, SOC 2 docs, $100/project persistent server |
| 10 | Railway incident: env vars "may have been accessed", "considering moving off of Railway entirely" | mastra.ai/blog/platform-incident-october-21-2026 | OK. Quotes verbatim |
| 11 | MCP Events: push/poll/webhook, `MCPEventsSignalProvider`, requires mcp 2.5.0 / core 1.79.0 | mastra.ai/blog/introducing-mcp-events (23 Oct) | OK |
| 12 | Agent Controller GA quotes (1800 commits; 2-20 GB to 300-750 MB) and Factory beta (25-35% PRs, 50-60% issues) | blog posts, 6 Oct / 8 Sep | OK. Quotes verbatim |
| 13 | Durable-agents essay quote "a relay of short-lived processes passing a record between them" | mastra.ai/blog/what-are-durable-ai-agents | **FIXED**. The actual text is "a relay of processes passing a record between them". The "30 Jun" date is unverified (page shows last updated 28 Oct) |
| 14 | Tony Kovanen "co-founder of Vercel, co-creator of Next.JS" | rauchg.com 2016 review + 2020 Vercel post | **PARTIAL**. ZEIT co-founder corroborated; Next.js co-creator not supported by Rauch's account |
| 15 | Agent Relay communicate mode lacks Mastra; `agent-relay mcp` exists | agentrelay.com/docs/communicate + /docs/agent-relay-mcp | OK. Added that the MCP server is stdio and AI SDK delivery is poll-only |
| 16 | DEV Week 4 "Best Use of Mastra" brief, 26-31 Oct 11:59pm PDT, $100, writing weighted most | dev.to challenge page + rules (raw HTML grep) | OK. Added the one-prize cap, required elements, and open-model caveat |
| 17 | Node >= 22.13 (originally sourced to a third-party blog) | npm registry `engines` | OK. Re-sourced to primary |
| 18 | Sam X posts 18 Aug / 15 Oct / 22 Oct | Exa index of nitter/teapawt mirrors (direct fetch 403) | OK, via mirror index; 5 Oct post UNVERIFIED |
| 19 | `CloudflareDOStorage` in `stores/cloudflare`; deployers cloudflare/netlify/vercel/cloud | `gh search code`, `gh api contents` | OK |
| 20 | LICENSE: Apache 2.0 except `ee/`; "Kepler Software, Inc." | `gh api .../LICENSE.md` | OK |

No fabricated URLs were found among those checked. Not re-checked: Dealroom/Gokul Rajaram, the Scaling DevTools paraphrase, the HackGT/A2A Devpost winners, the Abhi meetup LinkedIn activity, and the third-party comparison quotes (menuagentic, ayautomate).
