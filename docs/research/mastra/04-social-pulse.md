# Mastra: Social Media Pulse (Aug-Oct 2026)

Researched 2026-10-29 for Haunted Hacks (YC, SF, Sat 2026-10-31). Narrow angle: what people are actually saying about Mastra (mastra.ai, YC W25) on X, HN, Reddit, YouTube, Product Hunt, LinkedIn and dev blogs. Mastra is a sponsor. Its prize is Mastra Platform time (3 / 2 / 1 months free for 1st / 2nd / 3rd overall, per `docs/EVENT_PAGE.md`). It is not a host track.

Method: the last30days engine (v3.3.1; window 2026-09-30 to 2026-10-30; raw dump at `~/Documents/Last30Days/mastra-ai-agent-framework-raw-v3-2026-10-29.md`), plus direct HN Algolia queries (exact-match, typo tolerance off, since 2026-05-01), the GitHub search API through `gh`, the npm downloads API, Exa searches and page fetches, and WebSearch. Labels: **[V]** means I verified it against the primary source. **[R]** means a third party reported it and I did not check it independently. **[I]** means my own inference.

---

## 1. Headline read

- **The volume is mostly usage, not conversation.** Mastra's adoption numbers are large and still growing. Organic discussion that is specifically about Mastra is thin, though. In the last-30-days window, almost every Reddit hit and most X hits were generic "agent framework" posts where Mastra was one name in a list. Product Hunt and Sam Bhagwat's (@calcsam) own X launch threads produce the concentrated spikes. [V/I]
- **Sentiment among developers who use it: positive.** Praise keeps landing on the same three things: (1) it is the default TypeScript answer, (2) agents plus workflows plus memory plus Studio/tracing come in one package, and (3) the team ships fast. [V]
- **Complaints are consistent.** They are: release velocity and breaking changes; the June 2026 npm supply-chain compromise (background, but still cited); the October `@mastra/server` advisory; the pricing jump from free to $250 with nothing in between; and confusion about the license and "self-hosted" for Factory. [V]
- **What gets attention right now:** Mastra Factory (agents running an issue-to-PR pipeline), observability features (Metrics API, Trace Queries), AgentController GA, Mastra Launch (an FDE program with a 90-day guarantee), and the decision to stop accepting external PRs. [V]

## 2. Volume indicators (hard numbers)

| Metric | Value | Source / note |
|---|---|---|
| GitHub stars / forks | 29,202 / 3,061 | `gh repo view mastra-ai/mastra`, re-checked 2026-10-29 [V]. GitHub reports the license as "Other" (NOASSERTION): Apache-2.0 everywhere except `ee/` directories, which use the Mastra Enterprise License (CONTRIBUTING.md) |
| Latest core release | `@mastra/core@1.80.0`, 2026-10-28 | GitHub releases [V] |
| Issues opened | Aug 562, Sep 724, Oct 1-29 810 | GitHub search API [V]. The trend is rising, which means more usage and more bug surface |
| PRs merged, Oct 1-28 | 1,760 | GitHub search API [V]. Much of this comes from Mastra's own Factory/bots [I] |
| npm `@mastra/core` weekly | 3,044,665 (Oct 22-28) | npm API [V]. Weekday days run about 450-565K. The monthly range API has zero-filled gaps (Oct 6, 13-15, 19-21), so do not trust monthly sums |
| npm `mastra` (CLI) weekly | 1,225,436 | npm API [V] |
| HN stories matching "mastra" since May | 11 (max 5 pts) | Algolia, typoTolerance=false [V, re-run 2026-10-29]. Only 5 have Mastra in the title, and 4 of those are about the June npm compromise. The rest are Show HNs that mention Mastra in passing. This is very low |
| HN comments mentioning Mastra since May | 51 | Algolia [V]. Roughly 40% are "Who wants to be hired" résumé tech lists |
| last30days engine corpus | 13 Reddit, 15 X, 2 YouTube, 2 HN, 16 web | Engine footer [V]. Most items were only tangentially about Mastra |

Interpretation [I]: Mastra is infrastructure people use without talking about it. The tell is the résumé lists on HN: developers now put "Mastra" next to "LangChain" as a skill to hire for. That supports a "category default for TypeScript" reading more than any viral post does.

## 3. Notable posts (last ~90 days), with real quotes

### X (Twitter)
- **@calcsam, 2026-10-15, turned off external PRs** (read via a nitter mirror, 6,821 views and 122 likes at check time). It is now enforced: `CONTRIBUTING.md` says the repo "disabled pull requests for outside contributors" and asks for a detailed issue with a minimal reproduction instead [V]. It follows his 2026-08-18 post: "a lot of open source projects are going to stop accepting PRs": "Today we turned off external PRs for Mastra We noticed we're almost always closing PRs and having our factory do them anyway Instead we're encouraging contributors to open issues with detailed repros." Replies split. @0xKoller: "kind of sad tho". @ejc3: "Makes no sense. The pr serves as at least a feasibility spike." @Kelvin_json: "detailed repros were the real contribution anyway". This is the most debated Mastra post in the window. [V via mirror] https://nitter.rdrama.net/calcsam/status/2110560376173863206
- **@calcsam, 2026-10-15, Trace Queries launch** (5,291 views). Strongest organic reply: @crtwithintent, "ok wow im nuking my whole agent stack mastra it is." The practitioner replies asked for scheduled queries (@julesmalin) and for piping query results into eval sets (@Mintscope1). Sam's "yeah you can create an agent to do that" answered the scheduling question. [V via mirror] https://nitter.rdrama.net/calcsam/status/2110759787814375721
- **@calcsam, 2026-10-13, Metrics API launch** (about 4.1K views). The replies are mostly generic "Awesome launch" accounts that read as engagement-farm. Treat the reply volume as noise. [V/I] https://nitter.rdrama.net/calcsam/status/2110047871806603534
- **@Ga_Vasques, 2026-10-07** (6 likes, 602 views): "I run Mastra and CopilotKit in production across two different SaaS products… If you need structured workflows, graph-based execution (.branch, .parallel), human-in-the-loop, and MCP support without messy glue code, Mastra's architecture is top tier. Pure TypeScript, clean primitives, zero fluff." This is the clearest practitioner endorsement on X. [V full text via nitter] https://x.com/Ga_Vasques/status/2107829799460749521
- **@Taylor_AIPM, 2026-10-29** (Chinese framework-selection thread): "TypeScript 生态考虑Mastra" ("for the TypeScript ecosystem, consider Mastra"). This is the typical positioning: Mastra is the TypeScript slot in a framework map. [V] https://x.com/Taylor_AIPM/status/2115641486478094464
- **@sentry, 2026-10-28:** Agent Tracing for JS "now auto-instruments Anthropic, OpenAI, Vercel AI SDK, LangChain, LangGraph, and Mastra" (660 views via nitter). The underlying Sentry changelog is dated 2026-10-09 and lists "Mastra: First-party instrumentation, including new classifier evaluations (since 11.6.0)" (https://sentry.io/changelog/javascript-agent-tracing-improvements/). Mastra is now named as a first-class integration target by other vendors. The same pattern shows up with Ratel, Persona.js, Stagehand v4 and Plimsoll. [V] https://x.com/sentry/status/2115529505133429141
- **@hackCBS, 2026-10-28:** Mastra is "Learning Partner for hackCBS 9.0". Mastra sponsors hackathons heavily. [V] https://x.com/hackCBS/status/2115431210369585405
- **@ethanwalkerman, 2026-10-20** (reply count not re-checked), on Mastra Launch: "they promise to embed an engineer with your team and ship your AI agent into production within 90 days. If they miss the deadline, you pay $0 for their enterprise platform." [V] **Caveat:** "$0" applies to the platform only. Mastra's own post says that if the agent is not in production in 90 days, "all you pay is the implementation fee (which pays the salary of your FDE)", and the same thread later admits there is a base implementation fee (https://mastra.ai/blog/announcing-mastra-launch). https://x.com/ethanwalkerman/status/2112534816898138269

### Hacker News (exact-match, quoted)
- **dzonga, 2026-09-23**, on the "Strands Harness" thread: "I looked into it and ended up picking mastra as it had a better story / seems more complete for people making agents in typescript." https://news.ycombinator.com/item?id=49822231 [V]
- **SillyUsername, 2026-09-21**, on the "AX - Google's Open Agentic Orchestrator" thread: "I've been using https://github.com/mastra-ai/mastra which is pretty similar but has workflow visibility and a number of templates. For a generic swarm, workflows aren't too useful…" https://news.ycombinator.com/item?id=49781922 [V]
- **BrandiATMuhkuh, 2026-09-01**, on another project's agent factory: after describing bugs fixed in under 24h following detailed reports, the comment ends "Btw: I have a very similar experience with the Mastra project." https://news.ycombinator.com/item?id=49525067 [V]
- **zahlekhan, 2026-08-05**, on "Flowise is shutting down": "Mastra even has an agent that helps you build other agents." https://news.ycombinator.com/item?id=49182549 [V]
- **The only Mastra-titled HN submission in 90 days that is not about security**: "Mastra Agent Factory" (2026-09-08), 1 point, 0 comments, submitted by the user BrandiATMuhkuh, not by the Mastra team. https://news.ycombinator.com/item?id=49618568 [V]. Mastra does not break through on HN, and even the Factory launch got no HN traction.
- **Background (May 2026)**, the Flue launch thread: "Why would I choose this over Mastra?" (dataviz1000); "Mastra is a business, this seems to be a helpful lib" (bigethan); "Why would I choose mastra over anthropic or cursor sdk ?" (maxdo). https://news.ycombinator.com/item?id=47989590 [V]
- **Background, critical (dataviz1000, 2026-01-21)**: "I worked with Mastra for three months and it is awesome… it felt clunky working with workflows and branching logic with non LLM agents… Otherwise, Mastra is best in class for working with TypeScript." https://news.ycombinator.com/item?id=46699990 [V text and date via Algolia items API]

### Reddit (r/AI_Agents dominates)
Reddit's API returned 403 to the engine, so these come from Exa-indexed snapshots and an aggregator (bittide.aicompass.dev).
- **u/rayferrell, about 2026-08-09**: "my coding agent now deploys its own changes to a sandbox and tests them before i merge… mastra (the typescript agent framework the bot's built on) shipped exactly that a few days ago." One top reply pushed back: "The sandbox closes the execution gap, but not the correctness gap." [V snapshot] https://reddit.sentinel-team.org/posts/1vjrdct/snapshots/2026-08-15T02%3A07%3A43.063054Z
- **Background, u/aidenclarke_12 (June)**: "Mastra - typescript Stack, frontend team moving into agents". This is the stock Reddit positioning. [V snapshot]
- r/AI_Agents posts in late August (titles via aggregator, not opened): "We built a software factory with 6 scoped agents, 1 orchestrator, and 3 feedback loops" (2026-08-26) and "A RAG agent over 500 sci-fi movies in ~60 lines of TypeScript" (2026-08-28). Both read like Mastra DevRel posts. [R] http://bittide.aicompass.dev/tag/mastra
- An "Agent Builder" in the TypeScript learning thread (Aug): Vercel AI SDK got more "start here" recommendations than Mastra. One reply listed "langraph.js, mastra, vercel ai sdk". [V snapshot]

### Product Hunt
- **Mastra Factory** was #1 Product of the Day on 2026-09-09, hunted by Garry Tan (hunted.space, re-checked). Vote counts disagree by source and timestamp: 303 (Indie Machine, mid-day), 422 (FounderMag, not re-checked), 479 upvotes with 108 comments (hunted.space), 528 (@AINativeF, not re-checked), and a **score** (PH's activity metric, not raw votes) of 539 with 110 comments on the PH September monthly leaderboard, where it ranked #5 of the month. [V for each source; the final count is uncertain] https://www.hunted.space/product/mastra , https://www.producthunt.com/leaderboard/monthly/2026/9
- @calcsam on LinkedIn: "somehow we're #1 on Product Hunt today over OpenAI/Meta!?!?" https://www.linkedin.com/feed/update/urn:li:activity:7503493732466507776 [V]
- The PH product page shows 4.9/5 from 9-10 reviews. Reviewer Asad M. praised self-hosting ("the core is a library sitting in my own repo rather than a platform I have to live inside") and complained: "Free to $250 with nothing in between means a small thing that is real and in production has no plan to sit on, so I self host and they get nothing from me." https://www.producthunt.com/products/mastra [V]

### LinkedIn and dev blogs
- **Nick Tune, 2026-10-20**, "Automating Spec to PR with Mastra AI": "I replaced my home-rolled agent workflow engine with Mastra… it solves the problems I have in what I think is the right way." He has one gripe: "I can't have tool-based rules on a step." Closing line: "Please Mastra, don't let me down." https://nick-tune.me/blog/2026-10-20-automating-spec-to-pr-with-mastra-ai/ [V]
- **Velizar Mihaylov, 2026-10-16** (LinkedIn): "Everyone seems to be building AI agents right now, yet most people I talk to still haven't heard of Mastra." He praises the agent-to-workflow handoff, Hono-based self-hosting, and AI SDK UI / assistant-ui / CopilotKit integrations. [V] https://www.linkedin.com/posts/velizarmihaylov_everyone-seems-to-be-building-ai-agents-right-activity-7516805515654348800-abAl
- **Vlad Tsybin, 2026-08-12** (LinkedIn, ML engineer): liked the docs, the Langfuse integration and "User separation out of the box." His pause points were "TypeScript instead of Python", config living in code only, and "There's an API, but it's not OpenAI-compatible." [V]
- **Developers Digest, 2026-10-17 (updated 10-22)**: "for TypeScript teams it is the most complete batteries-included option available right now," with the cost being "15 minor releases of `@mastra/core` in six weeks" and durable agents, workers and dynamic workflows "still labelled beta." https://www.developersdigest.tech/blog/mastra-whats-new-2026 [V]
- **ReviewRamble, 2026-10-18**: "seven minor releases in three weeks"; "Studio loads PostHog analytics unless MASTRA_TELEMETRY_DISABLED is set" [R]; "Hosted platform marks up model tokens by 5.5%". The 5.5% figure is now verified: mastra.ai/pricing lists Gateway input/output tokens at "Market Rate + 5.5%" on every tier [V]. https://www.reviewramble.com/github-repos/mastra
- **RLM Labs on DEV, 2026-10-25**: a critical piece on live evals, noting Mastra scorers run "in the background" with a `sampling.rate`, so "nine answers in ten reach your user with no score at all" at 0.1. https://dev.to/rlmlabs_founder/sampled-asynchronous-non-blocking-2a19 [V]

### YouTube
- The engine found only 2 in-window videos. Both are on Mastra's own channel: the "Build A Knowledge Base For Agents (with Sanity)" workshop (2026-10-13, 1,064 views) and "Agent Builder: Turn No-Code Agents into Production Code" (2026-09-30, 970 views). Transcripts failed. [V]
- Third-party creators (dates mostly unconfirmed): WEBdoze, "Build Complex AI Agents in Minutes, Not Weeks", a positive walkthrough that mentions "about 156 millions tokens just building this" and "25,000 stars" (so probably recorded earlier); Kristian (several Mastra tutorials, small view counts, e.g. 210 views on a May RAG video); "Flue vs Claude Code vs Mastra" (DIY Smart Code). Takeaway [I]: YouTube coverage is driven by Mastra DevRel and small tutorial channels. No large creator moment in the window.

## 4. What gets praised (ranked by how often it recurs)
1. **The TypeScript default.** "Ended up picking mastra… more complete for people making agents in typescript" (HN dzonga). Reddit says "frontend team moving into agents".
2. **One package covers agents, workflows, memory, evals and tracing, plus Studio** at localhost:4111. People repeatedly say they deleted glue code (PH reviews, Ga_Vasques, Nick Tune).
3. **Observability.** Trace Queries, the Metrics API, and Studio traces got the most enthusiastic X replies.
4. **Shipping speed and responsive maintainers** (HN BrandiATMuhkuh, Velizar Mihaylov). The same speed is the top complaint below.
5. **Provider-agnostic models through the AI SDK** (Nick Tune switching to GLM; Himanshu Kapoor on LinkedIn).

## 5. What gets criticized
1. **Release velocity and breaking changes.** About 80 minor core versions so far. There are background complaints from the pre-1.0 era (Discord/AnswerOverflow, Oct 2025: "every-time a new release is pushed it feels like it is not tested"). StackPulse flags breaking API changes in both the Oct 7 and Oct 28 2026 releases. [V]
2. **Security trust.** The June 16-17 2026 compromise of 116-145 `@mastra/*` npm packages is background, but it is still the first complaint aggregators surface. Counts: Mastra's own incident report (GitHub issue #18061) says 116; StepSecurity, Socket and Microsoft say 140+ (Socket: 141); The Hacker News and CSA say 145. The cause was a phished maintainer token. Microsoft attributes it to the North Korean actor Sapphire Sleet. Mastra says it has since removed npm token bypass. Separately, **GHSA-8982-g8xm-3x5h** (high, 2026-10-12) is a prototype pollution in `normalizeQueryParams` that allows "unauthenticated process-wide state changes (cross-user data exposure, DoS)". It affects `@mastra/server` >= 1.62.0 through 1.76.0-alpha.6 and `@mastra/deployer` <= 1.75.0. The advisory's patched version field reads "1.760", which appears to be a typo for 1.76.0. [V via `gh api .../security-advisories`]
3. **Pricing shape.** Free Starter (100K observability events, 24 CPU hours, 15-day retention) jumps to Teams at $250/mo (1M events, 250 CPU hours, 6-month retention). There is no tier in between. Persistent 24/7 servers cost $100 per project on both tiers, and Gateway tokens are market rate + 5.5%. [V, mastra.ai/pricing, 2026-10-29]. The complaint itself comes from a PH review and aiagents.org.uk [R].
4. **Factory "open source / self-hosted" ambiguity.** Indie Machine (2026-09-09): `npm create factory@latest` provisions "a Mastra platform project, API key, and Postgres database", so even the "self-hosted" path requires a Mastra platform account. Indie Machine labels the license "Apache-2.0 + EE" and calls it "murky". [V that Indie Machine says this; the Factory behavior itself was not tested]
5. **TypeScript-only, and the API is not OpenAI-compatible** (Tsybin). **The external-PR shutdown** reads as hostile to some OSS contributors (@0xKoller, @ejc3).

## 6. Comparisons people make
- **vs LangGraph(.js):** the framing that keeps recurring is "Mastra wins on developer experience, batteries included, and time to first working product. LangGraph.js wins on expressive power, the depth of its human-in-the-loop and checkpointing story". The source is Developers Digest's separate "Mastra vs LangGraph.js" page (published 2026-06-10, background), not the Oct 17 post: https://www.developersdigest.tech/blog/mastra-vs-langgraph-js-2026. Python teams default to LangGraph.
- **vs Vercel AI SDK:** beginners get told to start with the AI SDK. Mastra is pitched for when you need orchestration, memory or evals. Mastra builds on the AI SDK.
- **vs Flue / Eve / Strands / Google AX / Genkit:** new entrants keep getting "how does this differ from Mastra?" on HN. Mastra is the incumbent that TypeScript newcomers are measured against.
- **vs LangSmith / LangChain Deep Agents:** Mastra itself published comparison pages (Oct 1 and Oct 22). These are vendor content, not community verdicts.

## 7. Hackathon-specific social signal
- Mastra-sponsored hackathons are common and winners post about them. Examples: the HiDevs x Mastra AI Agent Hackathon (India, June-July 2026; "1,241+ registrations", winner "Helm", a meeting-intelligence app with agentic validation), and Kevin M.'s win at the Qonto x Anthropic hackathon with "an AI agent on a Mastra harness" ("The model is not the product. The harness is."). Winning entries share a pattern: **multi-agent debate/validation plus MCP tools plus memory**, for example Kavach's "4-agent adversarial debate". [V LinkedIn posts]
- I found **no social posts pairing Mastra with Terse Durable Actors or Agent Relay**. Any combination would be novel. That is a plus for creativity scoring and a minus for copy-paste examples. [V negative search, limited]

## 8. Limits / could not verify
- **X:** the engine's X search ran (15 posts). I read @calcsam threads through a nitter mirror, not x.com. Exa could not fetch x.com directly. View counts are as shown by the mirror. Reply sets include obvious engagement-bot accounts.
- **Reddit:** the public JSON API returned 403. Evidence comes from third-party snapshots (reddit.sentinel-team.org) and an aggregator. Upvote counts for Mastra-specific threads were not captured. The 13 engine Reddit items were mostly generic r/AI_Agents threads.
- **YouTube:** the transcript fetch failed (stale yt-dlp). Third-party video dates and views are mostly unknown.
- **TikTok / Instagram:** not searched (no ScrapeCreators key). Treat as unknown, not as quiet.
- **LinkedIn:** only the posts Exa indexed. Engagement counts are not available.
- **Product Hunt:** final vote count conflicts (303-539) depending on source and capture time.
- **Aggregator sentiment scores** (RightAIChoice "53% positive / 47% critical", Tooliverse "9.29/10", VibeCodePicks) are unverified. Tooliverse's "selected reviews" have generic handles I could not trace, so they are excluded as evidence.
- **The 5.5% token markup** is now verified on mastra.ai/pricing. **"Tens of thousands of organizations"** is verified as Mastra's own claim (Launch blog, 2026-10-20), but no independent source backs it.
- **Funding** ($22M Series A led by Spark Capital, $35M total) is verified on Mastra's blog dated 2026-04-09. That is background.

## Hackathon implications

**What to build (social evidence points here):**
- Use Mastra as the **brain inside each actor or agent, not as the coordination layer**. Judges reward Durable Actors and/or Agent Relay. Mastra has no social footprint with either, so it is the supporting framework. A concrete pattern [I]: each Terse Durable Actor hosts a Mastra `Agent` (with memory scoped by actor ID), and agents talk across Agent Relay channels. Mastra Studio traces then become your live "watch the agents think" demo screen. Observability is what gets the strongest audience reaction on X.
- The theme that wins at Mastra hackathons is multi-agent debate or validation (Kavach, Helm). A Halloween fit [I]: a "haunted jury" or "séance council" where adversarial agents cross-examine in real time over Relay, with each agent's state durable in an actor so it survives refresh or kill during the live demo.

**Gotchas from the complaint stream:**
- **Pin exact versions.** Core ships near-daily (1.80.0 came out 2026-10-28). Run `npm create mastra@latest` once before Oct 31, lock the versions, and do not bump at the event. The Oct 28 release lists breaking changes in trace / Connect / code-sdk APIs.
- **Use `@mastra/server` >= 1.76.0 (stable, not 1.76.0-alpha.x) and a current `@mastra/deployer`** (GHSA-8982 prototype pollution is fixed there) if you expose an HTTP endpoint for the demo. A fresh `create-mastra` install today pulls core 1.80.0, which is well past the fix.
- Durable agents, workers and dynamic workflows are **beta**. Do not let your demo depend on Mastra's own durability. Let Terse actors own durability, which is also what the hosts want to see.
- Set `MASTRA_TELEMETRY_DISABLED=1` if conference wifi or privacy matters [R].
- Storage is required for goals, schedules and threads (LibSQL works locally; Supabase Postgres would also earn a nod from the Supabase sponsor [I]).

**Setup before Oct 31:**
- Scaffold a project, run Studio at localhost:4111, and wire an OpenAI model (the event gives $100 in OpenAI credits). Install the Mastra skills/MCP docs server for your coding agent. The `create-mastra` CLI offers it, and it helps with an API that changes this fast.
- **Rules gotcha:** the event page says "All code must be created at the hackathon. Thinking of ideas before the hackathon is fine." Any pre-event spike (a Mastra agent inside a Terse actor, one Relay message) must be **throwaway learning code**, kept out of the submission repo and rewritten on Oct 31. The same applies to the scaffold above: practice `npm create mastra@latest` beforehand, but run it fresh at 11:00am. Pre-install global CLIs and cache npm packages; that is setup, not project code [I].
- Upstream fixes are not an option: external PRs to mastra-ai/mastra are disabled. If you hit a Mastra bug mid-hack, pin an older version or work around it. Do not plan on a same-day fix.

**What Mastra (as sponsor) likely wants [I]:** visible Studio/trace usage, workflows with human-in-the-loop or suspend/resume, and a "this could go to production" story (their whole October messaging: Launch, Metrics API, Trace Queries). The prize is Platform time, so a project that plausibly deploys to Mastra Platform afterward fits their narrative.

## Sources
- Event page: /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md
- last30days raw dump: ~/Documents/Last30Days/mastra-ai-agent-framework-raw-v3-2026-10-29.md
- GitHub repo / releases / advisories: https://github.com/mastra-ai/mastra ; https://github.com/mastra-ai/mastra/security/advisories/GHSA-8982-g8xm-3x5h
- npm API: https://api.npmjs.org/downloads/point/last-week/@mastra/core
- HN Algolia: https://hn.algolia.com/api/v1/search?query=mastra&typoTolerance=false ; items 49822231, 49781922, 49525067, 49182549, 49618568, 47989590, 46699990, 48564925, 48565319
- X: https://x.com/Ga_Vasques/status/2107829799460749521 ; https://x.com/Taylor_AIPM/status/2115641486478094464 ; https://x.com/sentry/status/2115529505133429141 ; https://x.com/hackCBS/status/2115431210369585405 ; https://x.com/ethanwalkerman/status/2112534816898138269 ; https://x.com/AINativeF/status/2109932359579521369
- @calcsam via nitter: https://nitter.rdrama.net/calcsam/status/2110560376173863206 ; https://nitter.rdrama.net/calcsam/status/2110759787814375721 ; https://nitter.rdrama.net/calcsam/status/2110047871806603534
- Reddit snapshots: https://reddit.sentinel-team.org/posts/1vjrdct/snapshots/2026-08-15T02%3A07%3A43.063054Z ; https://reddit.sentinel-team.org/posts/1ue9bl6/snapshots/2026-06-26T22%3A31%3A52.572667Z ; http://bittide.aicompass.dev/tag/mastra
- Product Hunt: https://www.producthunt.com/products/mastra ; https://www.producthunt.com/p/mastra ; https://www.producthunt.com/leaderboard/monthly/2026/9 ; https://www.hunted.space/product/mastra ; https://foundermag.co/launches/mastra-factory/ ; https://indie-machine.com/posts/mastra-factory-agent-sdlc
- Mastra blog: https://mastra.ai/blog/announcing-mastra-factory ; https://mastra.ai/blog/announcing-mastra-factory-beta ; https://mastra.ai/blog/announcing-mastra-launch ; https://mastra.ai/blog/series-a ; https://mastra.ai/docs/harness/durable-agents
- LinkedIn: https://www.linkedin.com/feed/update/urn:li:activity:7503493732466507776 ; https://www.linkedin.com/posts/velizarmihaylov_everyone-seems-to-be-building-ai-agents-right-activity-7516805515654348800-abAl ; https://www.linkedin.com/posts/v-tsybin_tried-mastra-ai-what-is-mastra-its-a-typescript-activity-7493352385017446402-MbDJ ; https://www.linkedin.com/feed/update/urn:li:activity:7484335854669324288 ; https://www.linkedin.com/posts/nivas25_aiagents-typescript-mastra-activity-7482712826223042560-3fR8 ; https://www.linkedin.com/posts/kevin-mameri_mcp-productbuilder-harness-activity-7485973962036850688-DcYE
- Blogs/reviews: https://nick-tune.me/blog/2026-10-20-automating-spec-to-pr-with-mastra-ai/ ; https://www.developersdigest.tech/blog/mastra-whats-new-2026 ; https://www.reviewramble.com/github-repos/mastra ; https://dev.to/rlmlabs_founder/sampled-asynchronous-non-blocking-2a19 ; https://aiagents.org.uk/mastra-factory-review/ ; https://www.stackpulse.work/stacks/mastra ; https://aicrier.com/post/nxih51k0emq31l97r7re ; https://www.answeroverflow.com/m/1423431095889821778 ; https://rightaichoice.com/tools/mastra
- YouTube: https://www.youtube.com/watch?v=SNM36g2t5Wk ; https://www.youtube.com/watch?v=tZD1L2l05TM ; https://www.youtube.com/watch?v=FdMQAyzsbbI ; https://www.youtube.com/watch?v=FiFLJCx4yWo
- Added during verification: https://sentry.io/changelog/javascript-agent-tracing-improvements/ ; https://www.developersdigest.tech/blog/mastra-vs-langgraph-js-2026 ; https://mastra.ai/pricing ; https://github.com/mastra-ai/mastra/blob/main/CONTRIBUTING.md ; https://github.com/mastra-ai/mastra/issues/18061 ; https://www.stepsecurity.io/blog/mastra-npm-packages-compromised-using-easy-day-js ; https://socket.dev/blog/mastra-npm-packages-compromised ; https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/ ; https://thehackernews.com/2026/06/144-mastra-npm-packages-compromised-via.html ; https://nitter.rdrama.net/ethanwalkerman/status/2112534816898138269 ; https://nitter.rdrama.net/Ga_Vasques/status/2107829799460749521 ; https://nitter.rdrama.net/sentry/status/2115529505133429141 ; https://nitter.rdrama.net/hackCBS/status/2115431210369585405

## Verification log (2026-10-29)

Adversarial re-check: I tried to refute each claim against live primary sources (gh CLI, npm API, HN Algolia items API, mastra.ai pages, a nitter mirror for X, vendor blogs).

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Mastra prize = 3/2/1 months of Mastra Platform; $100 OpenAI credits per participant; Mastra is a sponsor, not a track | EVENT_PAGE.md lines 13, 76-80 | **Confirmed** |
| 2 | 29,200 stars / 3,061 forks | `gh repo view` | **Confirmed** (29,202 / 3,061). Added the license nuance ("Other": Apache-2.0 + `ee/` Enterprise License) |
| 3 | `@mastra/core@1.80.0` released 2026-10-28, with breaking changes | `gh release list` and release body | **Confirmed** (15:23 UTC; the body has a "Breaking Changes" section) |
| 4 | npm weekly: core 3,044,665, CLI 1,225,436 (Oct 22-28) | npm downloads API | **Confirmed** exactly |
| 5 | GHSA-8982-g8xm-3x5h, high, 2026-10-12, fixed in `@mastra/server` 1.76.0 | `gh api .../security-advisories` | **Confirmed, with additions**: `@mastra/deployer` <= 1.75.0 is also affected; the patched field is written "1.760" (typo) |
| 6 | 11 HN stories since May, max 5 points | Algolia search_by_date re-run | **Confirmed**, but the "exactly about Mastra" wording was misleading: only 5 are Mastra-titled, and 4 of those are about the npm attack. Reworded |
| 7 | HN quotes: dzonga, SillyUsername, BrandiATMuhkuh, zahlekhan, dataviz1000 | Algolia items API for each ID | **Confirmed** text. Corrected context: the BrandiATMuhkuh comment is about another project and mentions Mastra at the end; the "unknown date" comment is dataviz1000, 2026-01-21; the "Mastra Agent Factory" HN post was submitted by a user, not by Mastra |
| 8 | @calcsam turned off external PRs on 2026-10-15; reply quotes | nitter, plus `CONTRIBUTING.md` via gh | **Confirmed**: 6,821 views; all quoted replies present; CONTRIBUTING now says PRs are disabled for outside contributors |
| 9 | Trace Queries thread, @crtwithintent quote | nitter | **Confirmed** (5,291 views); clarified which reply Sam answered |
| 10 | Mastra Launch, 90 days, "$0" | mastra.ai/blog/announcing-mastra-launch, nitter | **Partly refuted**: the tweet text is real, but Mastra says you still pay the implementation fee if it misses. Caveat added |
| 11 | Factory #1 PotD 2026-09-09, hunted by Garry Tan, 539 votes / #5 of month | hunted.space, PH monthly leaderboard | **Confirmed**, with a correction: 539 is PH's "score", not a vote count (hunted.space shows 479 upvotes / 108 comments). FounderMag 422 and @AINativeF 528 not re-checked |
| 12 | Pricing: free to $250 with nothing in between; 5.5% token markup | mastra.ai/pricing | **Confirmed**; the 5.5% claim was upgraded from unverified to verified |
| 13 | Nick Tune quotes (3) | page fetch + text grep | **Confirmed** verbatim |
| 14 | Developers Digest quotes, including the LangGraph comparison | page fetch + text grep | **Misattributed**: the "15 minor releases"/beta quotes are in the 10-17 post, but the LangGraph quote comes from a separate 2026-06-10 comparison page. Fixed |
| 15 | npm compromise "116-141 packages" | Mastra incident issue #18061, StepSecurity, Socket, Microsoft, THN | **Range corrected to 116-145**; added Microsoft's Sapphire Sleet attribution |
| 16 | @sentry tweet naming Mastra | nitter + Sentry changelog | **Confirmed** (tweet 2026-10-28; changelog 2026-10-09, Mastra first-party since SDK 11.6.0) |
| 17 | @Ga_Vasques, @hackCBS posts | nitter | **Confirmed**; replaced the truncated Ga_Vasques snippet with full text |
| 18 | $22M Series A led by Spark, $35M total, 2026-04-09 | mastra.ai/blog/series-a | **Confirmed** |
| 19 | Hackathon advice to pre-scaffold and spike code before Oct 31 | EVENT_PAGE.md rules | **Conflicted with rules** ("All code must be created at the hackathon"). Rewritten so pre-event work is throwaway only |

Not re-checked (left as originally labeled): @Taylor_AIPM, the Reddit snapshots, the LinkedIn posts (Velizar Mihaylov, Vlad Tsybin, the calcsam PH post, Kevin M., HiDevs), RLM Labs DEV quote, YouTube view counts, the StackPulse breaking-change flags, and the aggregator sentiment scores. Treat those as single-pass findings from the original research.
