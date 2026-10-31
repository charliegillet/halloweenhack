# Supabase: team, strategy and competition

> Researched 2026-10-29 for Haunted Hacks (Sat 2026-10-31, YC SF). Supabase sponsors $25 in credits per attendee and a $1K credits prize for the project "most likely to scale to millions." This file covers the founders, funding, positioning, ICP, competitors, roadmap hints, and what Supabase says it wants built. API and feature details are in `01-docs-api.md` and `02-newest-features.md` and are only touched here where they matter for strategy.
> Method: Exa search and fetch (primary blog posts, PR Newswire, podcast transcripts), WebSearch, and the `gh` CLI for repo stats. **[V]** = verified against a primary source (Supabase blog, press release, the founders' own words in a transcript). **[S]** = secondary or single source. **[I]** = my inference. Items before Aug 2026 are labelled *background*.

## TL;DR

- **Founders:** Paul Copplestone (CEO, from New Zealand, previously ran a Southeast Asia marketplace and co-founded Nimbus) and Ant Wilson (CTO, from Liverpool, Imperial MSc, early career in HA storage failover, rejected by YC four times). YC S20, primary partner Jared Friedman. [V]
- **Money and momentum:** $500M Series F at $10.5B post in June 2026 (*background*), then **$150M more on 2026-10-02 led by GIC with CapitalG**, plus the **acquisition of Turso**. Total raised is over $1B. [V] They report adding **more than 1M users and 4M databases a month, with 70% of new databases created by agents or AI tools**. [V]
- **Positioning has moved from "open source Firebase alternative" to "agentic infrastructure."** The press releases now call Supabase "the leader in agentic infrastructure." The tagline at Select 2026 was **"prototype to petabyte."** [V]
- **Strategy in one line [I]:** be the first backend an agent reaches for. That means scaling *down* to billions of tiny per-agent or per-idea databases (Turso, which becomes "Supabase Spark") and scaling *up* to one huge Postgres (OrioleDB, Multigres). Compute runs next to the data. Everything is code-first so agents can operate it.
- **The prize name is Supabase's own slogan.** YC's company page tagline is "Build in a weekend. Scale to millions." [V] Supabase has sponsored a prize with exactly this name at a YC HQ hackathon before (Hack the Stackathon, ~2026-02-01, *background*). The winner's LinkedIn post says "Big thank you to Supabase for sponsoring the award." [S, winner's own post]
- **What would win it [I]:** a working real-time multiplayer AI app that shows its scaling story on stage. Use Broadcast (not `postgres_changes`) for fan-out, RLS-scoped private channels, Postgres as the system of record, and a credible "per-agent/per-room state, graduate to Postgres" architecture. That last point lines up with both Terse's actors and Supabase's own Spark/Turso thesis.

## 1. Founders and key people

| Person | Role | Background | Source |
|---|---|---|---|
| Paul Copplestone | Co-founder & CEO | Grew up on a family farm near Kaikoura, New Zealand. Contracted from age 18, then a hedge-fund platform job, then Accenture in Australia. Was CTO of ServisHero, a Thumbtack-style marketplace in Malaysia, Thailand and Singapore, then co-founded Nimbus For Work in Singapore. His own account: "most of the tech that we use now at Supabase was what I implemented in my second startup." Calls his first startup a lesson in "playing startup." Built the first Realtime engine (Elixir, reading the Postgres WAL) after Firestore dropped chat messages at his previous startup. Handle on X: @kiwicopple, bio "e/postgres". | diaspora.nz 2024; Accel podcast; Cloudflare TV 2021; First Round *In Depth*, 2026-06-25 (all *background*) [V] |
| Ant Wilson | Co-founder & CTO | From Liverpool. BSc Leeds, MSc Imperial. First job was in distributed-systems failover for HA storage clusters (ZFS). Techstars London '17, EF Singapore '18. **He and Copplestone met in the same Entrepreneur First Singapore cohort**, where Wilson was working on a crypto project and Copplestone on "building the metaverse." They shared a house. Says he was "rejected by Y Combinator 4 times" before S20. | LinkedIn; *Open Source Stacks* 2021; LinkedIn post 2023 (*background*) [V] |
| Glauber Costa | Head of Agentic Services (ex-Turso CEO) | Top Linux x86 contributor (2008), KVM, OSv, founding engineer at ScyllaDB, Staff Engineer at Datadog. Joined via the Turso deal on 2026-10-02. | Supabase PR; turso.tech/about; Wikipedia [V] |
| Pekka Enberg | Ex-Turso co-founder/CTO; joins with the Turso team (Supabase title not stated in the PR or blog, so "agent databases" is my label) | Former Linux kernel memory-allocator maintainer, ScyllaDB, author of Manning's *Latency*. His bio lists research interests in "databases, sandboxing, and agent filesystems." | penberg.org [V] |
| Sugu Sougoumarane | Leads Multigres | Co-creator of Vitess. Copplestone on Latent Space: "Sugu originally created Vitess... he said 'I wanna focus only on compatibility first.'" | Latent Space transcript, 2026-10-26 [V] |
| Craig Cannon | Head of DevRel and Marketing | In the role since Jun 2024. | LinkedIn [S] |

Origin story worth knowing [V]: **Realtime was Supabase's first product.** Ant Wilson's account is that Paul swapped Firestore for Postgres, lost live subscriptions, and so "built his own real-time engine, which listens to the Postgres write-ahead log... and then blasts it out over WebSockets. So that was literally the first version." A "Real-Time AI" hackathon is about as close to Supabase's roots as a theme gets. [I]

## 2. Company, batch, funding

- **YC S20**, founded 2020, HQ San Francisco, fully remote. The YC page says "Team Size: 120", which is stale. A 2026-08-21 DevRel job post says "~400 team members, 60+ countries." [V]
- **Funding timeline:**
  - Series D, $200M at $2B (early 2025), then Series E, $100M at $5B (Oct 2025). *Background*, per TechCrunch. [V]
  - **Series F, 2026-06-04:** $500M at a $10B pre / $10.5B post, led by GIC. All existing investors joined (Accel, YC, Craft, Felicis, Peak XV, Coatue), Stripe invested a second time, and Georgian and Salesforce Ventures were new. Stated uses were open source/Postgres tooling, growth, and employee liquidity. Multigres v0.1 alpha shipped the same day. *Background*. [V]
  - **2026-10-02:** "$150 million in new funding led by GIC, with Alphabet's independent growth fund CapitalG, IronArc, and SquarePeg," plus the **Turso acquisition** (terms not disclosed). [V] A New Zealand outlet put the valuation at about US$10.65B. That figure is single-source and I have not verified it. [S]
- **Scale claims (company-reported):**
  - Jun 2026: "Nearly 10 million developers", "database launches... grown 600%", "More than 60% of new databases are launched by some sort of AI tool." [V]
  - Oct 2026 PR: "More than 13 million developers"; "adding more than 1M users and 4M databases per month with 70% of new databases created by agents." [V]
  - Latent Space (recorded just before Select): "we launch about five million databases on our platform every single month." The Turso post says "over one million databases per week." [V]
  - A Select main-stage summary claims "over 45 million Postgres instances" and "more than 1,700 YC companies." [S]
- **GitHub (snapshot 2026-10-29 via `gh`):** supabase/supabase has 114.3k stars; supabase/realtime has 7.7k stars, with v2.150.1 published 2026-10-30T00:09Z (still Oct 29 Pacific) and four releases (v2.149.2 to v2.150.1) between 00:38Z Oct 29 and 00:09Z Oct 30; multigres/multigres has 2.7k; orioledb/orioledb has 4.3k; tursodatabase/turso has 25.1k. [V, re-checked] Realtime is shipping several releases a day the week of the event, so pin your `supabase-js` version and do not upgrade on Oct 31. [I]

## 3. Last 90 days: what they shipped and said (Aug to Oct 2026)

| Date | Event | Strategic read |
|---|---|---|
| 2026-08-07 | Supabase becomes a connector on Perplexity Computer [V] | Distribution through AI surfaces |
| 2026-08-18 / 08-24 | Client traces linked to logs; enterprise-managed auth for the Supabase MCP server [V] | Enterprise and agent governance |
| 2026-09-09 | Available in Gemini Enterprise [V] | Every major AI platform becomes a channel |
| **2026-10-02** | **Supabase Select 2026** (SF, 555 20th St) plus the $150M raise and Turso deal. Keynote by Copplestone and Wilson, themed **Build anything / Operate with confidence / Scale without limits** [V] | Full "agent-operated backend" pitch |
| 2026-10-03 | Select hackathon, judged by **Copplestone, Wilson**, Stripe, Anthropic and Vercel; 68 submissions [V] | Founders judge hackathons in person |
| 2026-10-13 to 10-15 | Declarative Schemas 2.0 (pg-delta), a local Supabase per agent without Docker, Supabase Middleware, Stripe Data Pipeline sync, Grok Bot [V] | Code-first for agents |
| 2026-07-29 (*just before window; corrected 2026-10-29, an earlier draft dated this Oct 19-22*) | Launch partner for OpenAI's **Sign in with ChatGPT** beta (alongside Airtable, GitLab, HubSpot, Notion, Vercel). The Supabase blog post is dated 2026-07-29 and OpenAI's changelog rollout began 29 Jul; the OpenAI help article was only *updated* around Oct 19-22 [V] | Tight OpenAI alignment, and OpenAI also sponsors this event |
| 2026-10-22 | "Give your Supabase app its own MCP server" (Auth plus RLS per tool call) [V] | Agents as end users of your app |
| 2026-10-20 | "Operate with confidence": agent prompts, a `query_logs` MCP tool, Health Advisors [V] | Self-driving ops |
| 2026-10-27 | **Supabase Compute** private alpha (us-west-2 only; Node, Deno or Dockerfile; 2GB/1vCPU or 4GB/2vCPU; no wall-clock limit; "Sandboxes for AI agents aren't part of the alpha") [V] | Supabase moves into agent hosting |
| 2026-10-28 / 10-29 | OrioleDB public beta on all plans; Multigres private alpha with automatic failover [V] | Scale-up story |
| 2026-10-26 / 10-28 | Latent Space episode "Why Agents Love Supabase," the founders' first joint podcast [V] | Freshest founder statements |
| 2026-07-31 (*just before window*) | **Supabase Evals** open-sourced (`supabase/evals`, 148 stars on 2026-10-29; the repo was created 2026-04-30 and made public with the 07-31 blog post). It runs Claude Code, Codex, OpenCode and others against real Supabase tasks (build, deploy, investigate, resolve) and publishes scores at supabase.com/evals [V] | They measure "agent experience" as a KPI. An earlier note called this "Supabase Eval" from an interview summary; it is now confirmed |
| 2026-10-12 to 10-18 | Supabase co-sponsored YC's **"Make Something Agents Want"** hackathon (YC HQ, Oct 17–18). Supabase's LinkedIn post: "We're sponsoring the YCombinator hackathon for builders whose primary user is an agent" [V]. A week before, Supabase's track still read "Coming soon," with no prize or judges listed [S, Pivot News 2026-10-13] | Third YC-HQ hackathon Supabase backed in 2026. I could not find the Supabase track winner |
| 2026-10-14 to 10-31 | **#SelectBadge contest** for hacks on the programmable Select badge: $1,000 / $500 / $250 in Supabase credits, open "through the end of October 2026." The blog suggests "With Supabase Realtime, the badge can react the moment something changes in your app" [V] | DevRel pushes Realtime toward hardware and playful uses |

### 3a. The Select 2026 hackathon: strongest direct evidence of founder taste

- **Theme.** The Select hackathon page (Oct 3, 580 20th St, SF) is headed **"Build in a weekend, scale to millions."** That is the same phrase as the Haunted Hacks Supabase prize. [V, hackathon.supabase.com page scraped 2026-10-29]
- **Voting categories:** Functionality and Completeness, Innovation and Creativity, User Experience and Design, Impact and Usefulness, Best Use of Vercel / Claude / Stripe / Codex / Multimodal AI for Gemini, and a **"Supabase Compute"** category. [V on the first scrape; a 2026-10-29 re-fetch rendered the "Voting Categories" heading with no names, so these are (unverified on re-check)] The page still said "Judging Complete. Final results will be available soon" on 2026-10-29. [V]
- **Judges:** Copplestone, Wilson, Pratik Gupta (Stripe), John Robison (Anthropic), George Fahmy (Vercel). The top six teams demoed live. [V, Luma]
- **What was submitted (68 entries; count not re-confirmed on 2026-10-29).** Most were agent-facing products: *PortCall* ("a phone line to the freight world for AI agents": Claude asks it to move a container, and it calls truckers, picks a price and books), *MayDay – 911 for agents*, *Doorway: every website, an API your agent can call*, *Agent on Call*, *CutRoom* (installable as a Claude plugin and as an MCP server), *BountyMesh*, *AI Incident detector*. [V, submissions list]
- **Winner.** "Won first at the @supabase Select 2026 hackathon today with my project **Fizz, a physical layer for agents**" (Nisarg, @noslopmaxima, 2026-10-04). [S, seen only through X mirrors and the Select page embed] Ant Wilson quote-posted it the same day ("Breakfast with @noslopmaxima and @JSummersMuir"), which amounts to founder acknowledgement. [S, nitter mirror] The project has since been relaunched as **Fizzlayer** (fizzlayer.com, 2026-10-29): "Connect any sensor, ask about it in plain English, and get a call when something goes wrong." [S, builder's own X post via mirror] So the winner was IoT sensors plus an agent plus phone alerts: a real-time, agent-facing, physical-world product. A LinkedIn attendee named the top projects as "fizz, blast, supabrain and verdant." [S] I did not verify Fizz's Supabase architecture.
- **Prize pool.** Luma: "Everyone who takes part shares 100K+ in credits from Supabase, Claude, Stripe and Vercel. Winning teams share a 31K credits prize pool." [V] (AGI Hunt says the hackathon was held "at the YC office", but Luma lists 580 20th St. Treat the venue claim as conflicting.)
- **Framing from Wilson.** When Supabase shared the hackathon wrap-up, Wilson's line was **"Build something agents want."** [S, AGI Hunt 2026-10-09 summary of his post]

**Inference:** Supabase's founders rewarded agent-as-user products that cross into the real world (phones, hardware, freight) and that run end to end. That matches their rules page wording: "builds that actually run, with real auth and real data."

### 3b. Founder statements, Aug to Oct 2026 (verbatim where possible)

- Copplestone, 2026-08-04: "Supabase is now deploying >1m new Postgres databases every week & that doesn't include read replicas." [V, also posted on his Bluesky]
- Copplestone, 2026-09-18: "Growth this year at @supabase has been wild... What feels unprecedented is that all charts are trending up - even as sign ups grow, so does activation and conversion." [S, X mirror twiscan]
- Copplestone, 2026-10-09: "i have growing conviction in Personal Agents... it has built up a CRM of all my contacts... It's like pair-coding (for work tasks)." [S, X mirror]
- Copplestone reposted @agentnative_ (2026-08-05): "Supabase won. It became the Agent Default." [S, X mirror]
- Latent Space (recorded before Select, released 2026-10-26):
  - Copplestone: "we launch about five million databases on our platform every single month... we think that we're going to have to launch billions per month. And so scaling out is a whole different beast." [V]
  - On Turso and Spark: "for these... billions of databases, what we need them to be is a file format." Also "you can have one database for any idea, any prototype... and when it takes off, then you just upgrade to full Postgres databases." [V]
  - On Edge Functions vs Compute: Edge Functions "have basically a two-second limit" (he presumably means CPU time). Compute "is long-running... in the same private network as your database... You can run agents inside it." [V]
  - Go-to-market: "land with them on day one and then make sure that they stick around to day one thousand, day ten thousand... Greenfield." Migrations "almost never happen." [V]
  - On monetisation: "as soon as we saw someone earn... $10,000 within the first few days of launching their product, we were like, 'Wow, this is real.'" [V]
  - Wilson on the future builder: "you say to your phone... 'I want to build X,' and one second later, you kind of have this application live... what tooling do we need to provide to make sure that we are the default provider in this new world?" [V]
  - On safety: "very early on the agents were... turning off RLS in order to get their projects to work... Lovable wrote really good skills to stop their agents doing stupid stuff." [V]
  - CapitalG means "we now have to consider a multi-cloud strategy. Meaning GCP." [V]

## 4. Positioning and ICP

**Then and now.** On why it worked early, Wilson said: "it wasn't until we changed the tagline to the open-source Firebase alternative where people like, 'Oh yeah, this is obviously something that I want'" (David Ondrej interview, 2026-10-16). [V] Today the PR boilerplate reads "the leader in agentic infrastructure and open source Postgres development platform," and the Select framing is "how Supabase works for your app from day one to millions of users, and how your agent builds and runs it with you." [V]

**The ICP has shifted toward agents and the people who direct them [I, grounded in V quotes]:**
1. **Coding agents as the actual operator.** "Agents are now deploying the majority of databases on our platform" (Copplestone, Jun 2026). [V] Copplestone wants the `supabase/` folder to be "a pure representation of everything that's on your platform... It shouldn't have to reach out to the platform" (First Round, Jun 2026, *background*). [V]
2. **Non-technical and "consumer-like" builders.** Wilson on Latent Space: "now you have these startups that start without a technical co-founder... everyone's a builder now." [V]
3. **Platforms that build on Supabase (Lovable-style app builders).** "Supabase for Platforms has been the fastest growing product over the last year" (Series F post). [V]
4. **Large Postgres users scaling up.** Multigres design partners named on Latent Space: "Booz Allen... Postman... Perplexity." [V]

**Philosophy they repeat:**
- **Open source and no lock-in.** "He refuses to lock in customers" (First Round). OrioleDB is now Apache 2 "and the Apache 2 license covers the patent" (Latent Space). [V]
- **Security through openness.** Wilson: "when your code is open source, anyone can come and scrutinize it... if you make it open source, you catch a lot of these issues much earlier." He also admits agents went through "probably 6 month period where they were paperclip maxing... turning off RLS as a way to like get things working quickly." [V]

## 5. Roadmap hints

- **Supabase Spark**, a new small instance type built on Turso technology. Copplestone in the keynote: "What you need is a database per user, one per agent, or even a database per idea... think of the database as a file and not a machine... multi-tenant by design... built on object storage." [V, keynote transcript via ceointerviews.ai; that page's summary credits the keynote to Garry Tan, but the text reads as Copplestone, who says "I think Ant said...", and select.supabase.com lists the keynote as Copplestone and Wilson.] On Latent Space: "it'll be compatible with all our libraries... When it takes off, then you just upgrade to full Postgres databases, all the way up to Multigress [sic]." [V] No launch date was given. One video summary calls it "Supabase Light," which is probably a transcription variant. [S]
- **Multigres sharding:** "some of it should land by probably early next year," with "zero changes to your code" (Copplestone, Latent Space). [V]
- **Compute GA** with more regions and agent sandboxes. The product page already describes "ephemeral sandboxes for untrusted code," "per-workload firewalls," and "cloaked secrets," but the alpha blog says sandboxes are not included yet. [V] This is a direct overlap with sponsors Freestyle and Superserve (sandboxes) and with Terse (long-running stateful compute). [I]
- **"Control Tower"** for managing fleets of databases is mentioned only in the interview (AT Pulse summary, transcript around 40:10). [S]
- **Key deprecation:** the `anon`/`service_role` keys are deprecated "by the end of 2026"; use `sb_publishable_` and `sb_secret_` keys instead (Broadcast docs). [V]
- **Supabase Evals** shipped on 2026-07-31 (supabase.com/evals). The blog says a "new CLI command and MCP tool that will allow agents to submit feedback when they struggle" is coming. [V]

## 6. Competitive landscape

| Competitor | 2026 status | How it differs from Supabase | Source |
|---|---|---|---|
| **Neon / Databricks Lakebase** | Neon was acquired by Databricks (2025, *background*). It powers Lakebase, which went GA on Azure in Mar 2026. Databricks says agents create "80% of all databases and 97% of database branches" on Neon. Launch partner for Stripe Projects (Apr 2026): agent-provisioned Postgres "in under 350ms." | Pure serverless Postgres with branching and scale-to-zero, enterprise and lakehouse oriented. Now adds a `neon.ts` backend-as-code file with Functions, Storage and managed Better Auth (per a third-party comparison). No built-in Realtime equivalent is documented in those comparisons. | Databricks blog Jan/Apr 2026 (*background*) [V]; vibecodetemplates.com 2026-10-12 [S] |
| **Convex** | **$57M Series B, 2026-08-04**, led by Insight Partners; $110.5M total. Claims "nearly 2M applications from close to 500k developers." Founded by ex-Dropbox engineers Jamie Turner and James Cowling. | A reactive TypeScript document-relational DB in which every query is a live subscription. It markets directly against Postgres for agents: "90% of AI-built apps on a traditional database silently corrupted data." Its biggest edge over Supabase is real-time UX. It launched a Convex AI Gateway on 2026-09-21 that calls models without provider accounts. convex-backend has 12.8k stars (the repo now lives at `convex/convex-backend`; `get-convex/convex-backend` redirects). | Convex blog/PR, news.convex.dev [V] |
| **InstantDB** | 10.6k stars | A sync engine with presence and cursors, but no hosted server functions, cron or vectors (per third-party reviews). | awaited.dev 2026-07 [S] |
| **Firebase (Google)** | Incumbent, now competing for "agent default" directly. Data Connect was renamed **Firebase SQL Connect** with realtime Postgres query subscriptions (Apr 2026, *background*). Firebase Studio is being sunset (Mar 2027) in favour of Google AI Studio, which auto-provisions Firestore and Auth. A **Firebase plugin for Codex** (skills, MCP and CLI) shipped 2026-09-28. | Google is copying Supabase's agent playbook (skills, MCP, plugin) and its Postgres realtime offering. Note the irony that CapitalG (Alphabet) now backs Supabase. | firebase.blog 2026-03/04/09 [V]; Supabase PR [V] |
| **Cloudflare (D1, Durable Objects)** | Per-object SQLite at the edge | Closest to the **Spark/Turso thesis** of a database per agent as a file. | [I] |
| **Terse Durable Actors (event host)** | Per its docs, each actor is "a tiny server with a SQLite database"; "each write is saved to bucket storage before the call returns." It reserves `_litestream_` names, which suggests Litestream replication. Its repo was created 2026-08-30 and has 290 stars (2026-10-29). | This is architecturally the **same "many small SQLite databases on object storage" pattern** that Supabase just bought with Turso. It complements Supabase rather than competing: hot per-actor state in Terse, shared system of record in Supabase Postgres. | docs.useterse.ai/concepts, TS reference [V]; `gh` [V]; framing [I] |
| **Turso** (now Supabase) | 25.1k stars. Customers included "Superhuman, Sauna.ai, CTO.new, and Mastra." | Absorbed. Note that **Mastra, a co-sponsor of this event, is a Turso customer.** | Supabase PR [V] |

**How Supabase answers rivals [I]:** against Convex's "correctness by construction," it offers RLS, declarative schemas, MCP elicitations and Advisors. Against Neon's branching, it has Branching 2.0 (Jul 2025, *background*) and a local stack per agent. Against Cloudflare and DO, it now has Spark. Its standing moat is that agents already choose it: swyx's AEO tracker found "an almost complete sweep of first choice for app backends... for every frontier model" (Latent Space, 2026-10-28). [V, his claim]

## 7. What founders and DevRel say they want built

- **Long-running agents next to the data.** Compute's examples: "An AI agent that can spin up and coordinate multiple tasks... A WebSocket service for low-latency, real-time apps like voice agents... A durable job processor that pulls tasks from Postgres." [V]
- **Apps that other people's agents can use.** "Your customers can use your app from ChatGPT, Claude, or another MCP client... Every tool call runs as that user, so your RLS policies decide what each agent can reach." The Select demo was "Sizzle," which turns product photos into video ads. [V]
- **Realtime done right.** Supabase's own AI prompt for Realtime says: "`postgres_changes` should be avoided due to scalability limitations. Use `broadcast` with database triggers (`realtime.broadcast_changes`)." It also says to use dedicated topics such as `room:${roomId}:messages` and to shard hot topics. Published benchmark: 250k concurrent users and more than 800k msgs/sec on Broadcast. [V]
- **Hackathon judging rubric (Supabase's own rules page):** innovation, functionality ("Reward builds that actually run, with real auth and real data, over slideware and mockups"), UX/design, and impact. Projects must "meaningfully integrate Supabase services." [V] Haunted Hacks is not a Supabase-run event, but this is the clearest written statement of their taste. [I]
- **Security posture.** Wilson advises asking frontier models to do "30 minutes of penetration testing before shipping" (Ondrej interview summary). [S]

## 8. What would impress Supabase as judges [all I]

1. **A scaling story they recognise.** For example: "Each haunted room or agent gets its own actor/state (Terse). Postgres is the durable record. Broadcast-from-DB fans out to N viewers. Here is the path from one room to a million." That mirrors Spark → Postgres → Multigres almost exactly.
2. **Real Auth and RLS, live on stage.** Private Realtime channels gated by RLS on `realtime.messages`. Show a second account being blocked. This addresses the "agents turn off RLS" failure Wilson describes.
3. **Broadcast, not `postgres_changes`.** Mention it out loud. It signals that you read their scaling guidance.
4. **Agent-native touches:** declarative schema in the repo, the MCP server used during the build, maybe an app-level MCP server so ChatGPT or Claude can join the game as a player.
5. **Numbers.** A small load test, such as a script spawning 500 to 2,000 fake clients on a channel, with a latency readout on screen. The dbarena/benchmark culture says they like reproducible numbers.
6. **Agents as users, not just as builders.** The Oct 2026 hackathons Supabase ran or backed ("Build in a weekend, scale to millions" at Select, "Make Something Agents Want" at YC) rewarded products that agents themselves call. A judge's own ChatGPT or Claude joining the game through an app MCP server gated by RLS fits Wilson's "Build something agents want" framing.
7. **Speak their architecture vocabulary:** "one database per room or agent, graduate to Postgres" is Copplestone's Spark pitch ("one database for any idea... when it takes off... upgrade to full Postgres"). A Terse actor (SQLite per actor) plus Supabase Postgres shows that pattern working today.
8. **Avoid** mocked data, `service_role` keys in the browser, and relying on Compute (private alpha, waitlist, us-west-2 only).

## Limits / could not verify

- **Who judges the Supabase prize is unknown.** No Supabase judge is named on the event page ("Judges will be announced soon"). The rubric for "most likely to scale to millions" is unpublished.
- The Feb 2026 "Most Likely to Scale to Millions" award at "Hack the Stackathon" (YC HQ, hosted by Firecrawl, Resend and Reducto) is sourced only from the winner's LinkedIn post. That post describes the day as "push it until it breaks, and then stand in front of people who actually run infra and explain why it broke." I could not find the winning project's details or who judged the award.
- Select 2026 hackathon final rankings are not published ("final results will be available soon"). Fizz's first place rests on the builder's own X post, which I saw only through mirrors and the Select page embed. The submissions list I scraped may be incomplete; Fizz did not appear in it.
- Founder X posts were read through mirrors (twiscan, teapawt, nitter), not x.com directly. The quoted text matches across mirrors, but I did not see engagement on x.com.
- CB Insights lists "2025 revenue $20M" behind a paywall. That conflicts with the scale of the funding, so I do not use it.
- I could not find the winner or judges of the Supabase track at "Make Something Agents Want" (Oct 17–18).
- The ~$10.65B October valuation and Turso deal terms are unverified. The "45M Postgres instances / 1,700 YC companies / $1M community stock scheme" claims come from a third-party summary of the Select keynote that also misattributes the speaker. Treat them as unconfirmed.
- Supabase Spark has no public docs, pricing or date. "Control Tower" and "Supabase Eval" appear only in interview summaries.
- Growth metrics are company-reported. Competitor claims (Convex's 90% corruption stat, Databricks' 80% agent-created stat) are vendor marketing.
- I did not run the last30days social scan. Social sentiment is a different file's angle.
- The Latent Space transcript is auto-captioned and contains spelling errors such as "AurionDB," "Multigress" and "Glover." I quoted it as written.

## Hackathon implications

**What to build (Supabase-prize-optimised and compatible with the host tracks) [I]:**
- **"Séance Server" / multiplayer haunted-house AI.** Each room is a Terse Durable Actor holding hot game state and an LLM "ghost." Agents talk to each other over Agent Relay. Supabase Postgres stores players, scores and transcripts. Supabase Auth handles login, and **Realtime Broadcast from DB** pushes room events to spectators. Pitch it as "per-room actors scale horizontally; Postgres is the record; Broadcast fans out to millions of spectators." That covers both host tracks and the Supabase prize.
- Optional crowd-pleaser: add Sign in with ChatGPT as a narrative tie-in (Supabase is a launch partner), or an app MCP server so a judge's ChatGPT/Claude can "possess" a player. Only do this if the core works by 2:30pm.

**Setup to do before Oct 31:**
1. Create the Supabase org and project now. Put it in **us-west-2** (closest to SF, and the only Compute alpha region). Redeem the $25 credit at check-in if offered.
2. Use **publishable/secret keys** (`sb_publishable_`, `sb_secret_`), not the legacy anon/service_role keys, which are deprecated by end of 2026.
3. Install the Supabase CLI, the agent skills (`npx skills add supabase/agent-skills`), and the MCP server scoped to the project (`?project_ref=...`). Use `read_only=true` only for ops checks, not during the build.
4. Rehearse locally: a private Broadcast channel with an RLS policy on `realtime.messages`, plus a trigger calling `realtime.broadcast_changes`. Remember that ideas, but not code, can be prepared in advance (event rule).
5. Write a small load-test script plan (k6 or node `ws`) for the scale slide. Write the code on the day.

**Gotchas:**
- **Realtime plan caps will break a naive load-test demo.** The Realtime limits page gives concurrent connections as Free 200, Pro 500, Pro with no spend cap 10,000; messages/sec as 100 / 500 / 2,500; Presence messages/sec as 20 / 50 / 1,000. The $25 credit covers Pro, so a 2,000-client test needs the spend cap turned off, or keep the test to about 400 clients and extrapolate on a slide. Cite Supabase's published benchmark (250k concurrent users, more than 800k msgs/sec) for the "millions" claim instead of overstating your own numbers. [V, supabase.com/docs/guides/realtime/limits]
- `postgres_changes` runs an RLS check per subscriber per change. It will not "scale to millions," so use Broadcast.
- Do not call Presence `track()` on every mouse move. Use Broadcast for cursors.
- Server processes that subscribe just to send messages multiply the Realtime bill. Send via REST or `realtime.send` instead.
- Do not plan around Compute, Spark or Multigres. They are alpha, invite-only, or unreleased.
- Edge Functions have execution limits: about 2 s CPU (Copplestone, Latent Space) and work "longer than 400 seconds" does not fit (Compute alpha blog). Keep long-running agent loops in Terse actors.
- **Turning off the spend cap costs real money past the $25 credit.** Realtime peak connections above the Pro quota of 500 are billed at "$10 per 1,000 peak connections" [V, supabase.com/docs/guides/platform/manage-your-usage/realtime-peak-connections]. A single 2,000-client burst costs about $15 in connection overage on top of the $25 Pro fee, plus message overage. That is affordable, but turn the cap back on after the demo.
- **Pin your Realtime/supabase-js versions.** supabase/realtime cut four releases in roughly 24 hours on Oct 29.

**What judges and sponsors want:** the hosts want Durable Actors and Agent Relay. Supabase wants a credible path from weekend build to millions, with real auth and data, and an agent-native workflow. OpenAI and Mastra are adjacent: Supabase is OpenAI's Sign-in-with-ChatGPT launch partner, and Mastra was a Turso customer.

## Sources

- Supabase Series F (2026-06-04): https://supabase.com/blog/series-f
- PR: $500M at $10.5B: https://www.prnewswire.com/news-releases/supabase-raises-500m-at-10-5b-to-accelerate-lead-in-agentic-infrastructure-302791787.html
- TechCrunch, doubles valuation: https://techcrunch.com/2026/06/05/supabase-doubles-valuation-to-10b-in-8-months/
- CNBC: https://www.cnbc.com/2026/06/04/database-startup-supabase-raises-500-million-10point5-billion-valuation.html
- PR: $150M + Turso (2026-10-02): https://www.prnewswire.com/news-releases/supabase-announces-150m-in-new-funding-and-turso-acquisition-302896752.html
- Supabase is acquiring Turso: https://supabase.com/blog/supabase-is-acquiring-turso
- NBR (valuation, unverified): https://www.nbr.co.nz/tech/supabase-raises-another-us150m/
- Select 2026 recap: https://supabase.com/blog/supabase-select-2026-recap
- Scale without limits: https://supabase.com/blog/select-2026-scale-without-limits
- Supabase Compute alpha: https://supabase.com/blog/supabase-compute-private-alpha ; product page https://supabase.com/compute
- Dreambase on Compute: https://dreambase.com/blog/running-our-data-pipeline-on-supabase-compute
- Operate with confidence: https://supabase.com/blog/operate-with-confidence-check-production-with-your-coding-agent
- App MCP server: https://supabase.com/blog/give-your-supabase-app-its-own-mcp-server
- Sign in with ChatGPT (Supabase): https://supabase.com/blog/sign-in-with-chatgpt-beta ; OpenAI help: https://help.openai.com/en/articles/20001410-sign-in-with-chatgpt
- OrioleDB public beta: https://supabase.com/blog/orioledb-public-beta
- Blog index (dates): https://supabase.com/blog
- Select site: https://select.supabase.com/
- Select hackathon (judges): https://luma.com/select-2026-hackathon ; https://hackathon.supabase.com/supabase-select-2026-hackathon
- Supabase hackathon rules (rubric): https://hackathon.supabase.com/hackathon-rules
- Latent Space, "Why Agents Love Supabase": https://latent.space/p/supabase/ ; transcript https://lspace.beehiiv.com/podcast/s/latent_space_the_ai_engineer_podcast/supabase_s_plan_for_a_billion_ai-built_apps
- Keynote transcript (third-party): https://ceointerviews.ai/interview/2990135/
- AT Pulse summary: https://at-pulse.com/stories/4670/
- David Ondrej x Ant Wilson: https://app.frontiernews.tech/videos/2283
- First Round In Depth (Copplestone): https://review.firstround.com/podcast/how-supabase-became-the-essential-infrastructure-for-the-ai-era-paul-copplestone-co-founder-ceo/
- YC company page: https://www.ycombinator.com/companies/supabase
- Ant Wilson LinkedIn: https://linkedin.com/in/ant-wilson-46179937 ; YC rejections post: https://www.linkedin.com/posts/ant-wilson-46179937_startups-entrepreneurship-ycombinator-activity-7036205375305510912-pAi2
- Realtime origin (Ant Wilson, 2021): https://ajcwebdev.com/podcasts/open-source-stacks-ant-wilson/
- Craig Cannon LinkedIn: https://linkedin.com/in/craigrcannon
- DevRel job post (headcount): https://jobs.ashbyhq.com/supabase/a1320bbf-bfae-49a8-a1b7-12eeccaf39ca
- Turso founders: https://turso.tech/about ; https://en.wikipedia.org/wiki/Glauber_Costa ; https://penberg.org/
- "Most Likely to Scale to Millions" at Hack the Stackathon: https://www.linkedin.com/posts/nadaa-moharram_i-won-most-likely-to-scale-to-millions-activity-7423607935161004032-z6w8
- Realtime docs: https://supabase.com/docs/guides/realtime/benchmarks ; https://supabase.com/docs/guides/realtime/broadcast ; https://supabase.com/docs/guides/ai-tools/ai-prompts/use-realtime ; https://supabase.com/blog/realtime-broadcast-from-database
- Convex Series B: https://news.convex.dev/convex-raises-57m/ ; https://www.prnewswire.com/news-releases/convex-raises-57m-series-b-led-by-insight-partners-to-scale-the-reliable-backend-for-the-ai-era-302841686.html
- Databricks/Neon: https://www.databricks.com/blog/enterprise-ai-agent-trends-top-use-cases-governance-evaluations-and-more ; https://www.databricks.com/blog/databricks-and-stripe-projects-infrastructure-built-agents
- Comparisons: https://vibecodetemplates.com/blog/supabase-vs-neon-vs-convex ; https://awaited.dev/guides/convex-alternatives/
- Event page: https://events.ycombinator.com/haunted-hacks-2026 ; https://builderbase.com/event/haunted-hacks-2026
- Select hackathon page (theme, voting categories, submissions): https://hackathon.supabase.com/supabase-select-2026-hackathon
- Fizz winner post (mirror): https://nitter.rdrama.net/AntWilson/status/2106803568779088313 ; top-projects LinkedIn: https://www.linkedin.com/posts/localfitevents_activity-7512418713594171392-PO58
- AGI Hunt on Wilson's "Build something agents want": https://agihunt.info/en/p/1a122361765a6bd70f957fba2ce
- Make Something Agents Want: https://www.linkedin.com/posts/supabase_make-something-agents-want-activity-7515480834540310529-4Jmq ; https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent ; winner post https://www.linkedin.com/posts/konrad-weber_ycombinator-aiagents-x402-activity-7518042534678466560-fBEd
- Select badge contest: https://badge.select/contest ; https://supabase.com/blog/how-we-made-the-supabase-select-2026-badge
- Supabase Evals: https://supabase.com/blog/supabase-evals ; https://supabase.com/evals ; https://github.com/supabase/evals
- Latent Space transcript (beehiiv): https://lspace.beehiiv.com/podcast/s/latent_space_the_ai_engineer_podcast/why_agents_love_supabase
- Copplestone X posts (mirrors): https://twiscan.com/en/x/kiwicopple ; https://www.techtwitter.com/profiles/kiwicopple ; Bluesky https://couchsky.app/u/kiwicopple.bsky.social
- Founder background: https://www.diaspora.nz/p/s2-e3-paul-copplestone-co-founder ; https://www.accel.com/podcast-episodes/supabases-paul-copplestone-on-the-difference-between-playing-startup-and-strategy ; https://cloudflare.tv/shows/founder-spotlight/founder-spotlight-paul-copplestone/2aX69Dgb
- Hack the Stackathon context: https://www.linkedin.com/posts/supabase_activity-7417936257923588096-RIAP
- Realtime limits: https://supabase.com/docs/guides/realtime/limits
- Firebase: https://firebase.blog/posts/2026/09/firebase-plugin-for-codex/ ; https://firebase.blog/posts/2026/04/whats-new-sql-connect/ ; https://firebase.blog/posts/2026/03/announcing-ai-studio-integration/
- Convex AI Gateway: https://news.convex.dev/
- Neon CEO on 80% agent-created (2026-10-12): https://answers.databricks.com/new-kind-database-architecture-nikita-shamgunov-co-founder-ceo-neon-4NERxA5ZI6g
- Terse Durable Actors docs: https://docs.useterse.ai/concepts ; https://docs.useterse.ai/reference/typescript-sdk ; https://github.com/TerseAI/durable-actors
- GitHub stats via `gh api repos/{supabase/supabase, supabase/realtime, multigres/multigres, orioledb/orioledb, tursodatabase/turso, get-convex/convex-backend, instantdb/instant}` on 2026-10-29
- Added during verification: https://supabase.com/docs/guides/platform/manage-your-usage/realtime-peak-connections ; https://help.openai.com/en/articles/6825453-chatgpt-release-notes ; https://www.ainewsbank.com/posts/openai-sign-in-with-chatgpt-partner-beta ; https://nitter.rdrama.net/noslopmaxima ; https://luma.com/yc-meetup-7183-9316f87f

## Verification log (2026-10-29)

An adversarial re-check. I tried to refute each claim against live sources. Outcomes: **Confirmed**, **Corrected**, **Downgraded** (marked unverified), **Added**.

1. **Event prize and credits** ("$25 Supabase credits per attendee, equivalent to 1 month Pro"; "$1K in credits from Supabase" for "most likely to scale to millions"). **Confirmed** in EVENT_PAGE.md, on Luma (luma.com/yc-meetup-7183-9316f87f) and on hackathonradar. Side note: Luma and hackathonradar both word the Durable Actors prize as "an iPhone duo", not just "an iPhone". No Supabase judge is named anywhere yet.
2. **$150M round on 2026-10-02, led by GIC with CapitalG, IronArc and SquarePeg, plus Turso; "1M users and 4M databases per month, 70% created by agents or AI-driven tools"; "13 million developers"; Glauber Costa as Head of Agentic Services.** **Confirmed** verbatim in the PR Newswire release. Pekka Enberg's Supabase title is not stated, so I relabelled it.
3. **"Build in a weekend. Scale to millions." is the YC page tagline; Team Size 120; primary partner Jared Friedman.** **Confirmed** on ycombinator.com/companies/supabase.
4. **Sign in with ChatGPT launch partner, dated "2026-10-19 to 10-22".** **Corrected.** The partner list (Airtable, GitLab, HubSpot, Notion, Supabase, Vercel) is confirmed on OpenAI's help page. However, the Supabase blog post is dated **2026-07-29**, and OpenAI's changelog plus press coverage (ainewsbank, magica, 2026-07-30) put the rollout on July 29. The October date came from the help article's "updated" timestamp. I split the row and moved it outside the 90-day window.
5. **Supabase Compute private alpha (2026-10-27; us-west-2 only; Node/Deno/Dockerfile; 2GB/1vCPU or 4GB/2vCPU; "Sandboxes for AI agents aren't part of the alpha"; no wall-clock limit).** **Confirmed** in the blog post and blog index. The Select recap says "no limit on how long they run". I also added the alpha caveats: no autoscaling, GPU or persistent disk; restarts at any time; every service gets all project secrets.
6. **Realtime plan limits (200/500/10,000 connections; 100/500/2,500 msg/s; Presence 20/50/1,000).** **Confirmed** on the limits page. **Added** the overage price of "$10 per 1,000 peak connections" and the 256 KB Free / 3,000 KB Pro broadcast payload cap.
7. **Broadcast benchmark "250k concurrent users, >800k msgs/sec".** **Confirmed** in the benchmarks page "Large-Scale Broadcasting" table (median latency 58 ms, p95 279 ms, p99 508 ms). Note that the DB-triggered `broadcast_changes` benchmark is much lower: 80k users and 10k msgs/s at 46 ms median. Quote the right one for your architecture.
8. **anon/service_role keys deprecated "by the end of 2026", replaced by `sb_publishable_` and `sb_secret_`.** **Confirmed** verbatim on the Broadcast docs page.
9. **GitHub star counts.** **Confirmed** via `gh api` (114,325 / 7,673 / 2,696 / 4,291 / 25,091 / 12,769 / 10,563). Corrected small details: Evals is 148, not 147; Terse is 290, not 289; Convex's repo is now `convex/convex-backend`; the realtime "v2.150.1 released 2026-10-30" is a UTC timestamp, and there were four releases in about 24 hours, not three.
10. **Convex $57M Series B on 2026-08-04, Insight Partners, $110.5M total, "nearly 2M applications from close to 500k developers", "90% of AI-built apps... silently corrupted data".** **Confirmed** in Convex's PR Newswire release and blog. The 90% figure is "in Convex's own testing", which is vendor marketing.
11. **Select hackathon judges (Copplestone, Wilson, Gupta/Stripe, Robison/Anthropic, Fahmy/Vercel), top six demo live.** **Confirmed** on Luma. **Added** the 31K prize pool. The theme phrase "Build in a weekend, scale to millions" is **confirmed** on hackathon.supabase.com. The voting categories and the "68 submissions" count did **not** render on re-fetch, so they are **downgraded** to unverified on re-check.
12. **Fizz won first.** Still **[S]**: it rests on the builder's X post via mirrors. Ant Wilson's quote-post is now also seen via a mirror. **Added** what Fizz is (Fizzlayer: sensors, plain-English queries, phone-call alerts). The URL in Sources points at Ant Wilson's status, which quotes Nisarg's post. That is legitimate, not a mismatch.
13. **Supabase rules rubric ("builds that actually run, with real auth and real data, over slideware and mockups"; "must meaningfully integrate Supabase services").** **Confirmed**. The second phrase sits in the Project Requirements section, not the judging criteria.
14. **Latent Space quotes** ("five million databases... every single month", "two-second limit", "Booz Allen... Postman... Perplexity") and the date. **Confirmed** in the beehiiv transcript, published 2026-10-26. The latent.space write-up is dated 2026-10-28, so both dates are correct for different artifacts.
15. **Timeline dates from the blog index** (Perplexity 08-07, client traces 08-18, MCP enterprise auth 08-24, Gemini Enterprise 09-09, Turso/Select 10-02, Declarative Schemas 10-13, badge 10-14, Operate 10-20, app MCP 10-22, Compute 10-27, OrioleDB 10-28, Multigres 10-29). **Confirmed**. Also confirmed: Select at 555 20th St on Oct 2 with the keynote by Copplestone and Wilson (select.supabase.com); the #SelectBadge prizes of $1,000/$500/$250, open "through the end of October 2026" (badge.select/contest); the Firebase plugin for Codex on 2026-09-28 with skills, MCP and CLI; and the Feb 2026 "Most Likely to Scale to Millions" award with Supabase as sponsor (the winner's LinkedIn post).

**Not re-checked this pass (left as originally tagged):** founder biography details (YC rejected Wilson "4 times", farm near Kaikoura), Craig Cannon's role, the NBR ~$10.65B valuation, the Databricks/Neon 80% figure, Copplestone's X posts via twiscan, and the ceointerviews keynote transcript. No fabricated URLs or quotes were found among the items checked.
