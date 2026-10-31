# Terse / Durable Actors: Social Media Pulse

> Captured 2026-10-29 (two days before Haunted Hacks, Oct 31 2026). Angle: what people say about Terse and Durable Actors in public: volume, sentiment, notable posts, praise, complaints, comparisons. Window: Aug-Oct 2026, with the Oct 6-7 launch as the focus. Anything earlier is marked **background**.
> Method: I ran the `last30days` v3.3.1 engine (Reddit, HN, YouTube, GitHub, web; X was not authenticated), pulled the full Show HN thread from the HN Algolia API, read X timelines through nitter-style mirrors (teapawt.org, nitter.*) via Exa, pulled GitHub repo, issue and release data with `gh`, used `yt-dlp` for YouTube, and ran Exa/WebSearch for LinkedIn, Product Hunt, Reddit and blogs.
> Convention: **Verified** means I saw the primary text myself. **Inferred** means it is my reading of that text. Engagement counts come from mirrors or APIs as of the capture date and are approximate.

---

## TL;DR

1. **Small but real launch.** Nearly all the conversation sits in one burst, Oct 6-8 2026: the YC F26 announcement, the Show HN (53 points, 25 comments), the X launch tweet (about 10-11K views) and the cofounder's LinkedIn post. After that it is mostly the founders posting. Outside the HN thread I found almost no independent organic discussion.
2. **Sentiment is positive about the idea and skeptical about the numbers.** People like "another OSS Cloudflare alternative" and the actor model for agents. The sharpest public criticism was on HN, about durable-write latency. The founders' own Show HN post lists **85.6 ms p95 durable write** (2.14 ms stateful read, 334 ms actor warm-up), and a commenter rounded it to "100ms for a write - not usable for anything beyond toys". The other recurring complaint is that **self-hosting is documented only for GCP**.
3. **The most useful social fact for this hackathon:** Khaliq Gant of Agent Relay, the co-host, posted on X on Oct 8: *"We're moving over to their tech for @agent_relay ... Terse can't miss!"* The tweet itself had little reach (about 236 views on the mirror), but the alignment shows up in code too. On Oct 29 (PT evening; Oct 30 UTC), Agent Relay cofounder **Will Washburn** opened two issues and two PRs on `TerseAI/durable-actors`: Drizzle ORM support (#370), nested `db.transaction` (#371, closed), plus issues #368 and #369 on `ActorDatabase`. The two hosts are openly aligned, so a project that combines Durable Actors and Agent Relay fits the story both hosts are telling.
4. **What people respond to:** per-actor configurable RAM/CPU via a decorator, serialized execution by default (no interleaving on `await`), per-actor SQLite, generated type-safe clients, and multiplayer AI demos (a murder-mystery game, a "tiny Lovable"). People keep asking how it compares to Cloudflare DO, Rivet, celld (Deno), Temporal/Azure Durable Functions and Orleans.
5. **Coverage gaps:** no Reddit threads, no Product Hunt launch, YouTube is limited to two founder videos uploaded Oct 29 with 1-5 views, and I had no authenticated X search, so replies and quote-tweets are only partly visible.

---

## 1. Volume by source

| Source | What exists (Aug-Oct 2026) | Volume signal | Coverage confidence |
|---|---|---|---|
| **Hacker News** | 1 Show HN (Oct 6) + 1 passing mention in the "Cloudflare acquires Deno" thread (Oct 9) | 53 pts, 25 comments (Algolia; nicheloom and gitnova show 52); nicheloom ranks it "top 18%" of HN launches | High (full thread pulled via API) |
| **X / Twitter** | Founder and company posts; a few third-party replies and endorsements | Launch tweet ~10.5-11.3K views; YC-batch tweet ~23.9K views; @IncTerse has ~111-127 followers, @karatzas_thomas ~1.5K | Medium (mirrors only, no search API) |
| **LinkedIn** | Cofounder posts (YC news, demo video), one third-party post | Olivier's YC post shows "46 comments"; a commenter mentions "200 reactions" | Medium-low (snippets only) |
| **GitHub** | `TerseAI/durable-actors` | 290 stars, 22 forks, 22 open issues+PRs (live API, re-checked late Oct 29 PT); 10 releases from v0.12.0 to v0.14.4 between Oct 25 and 29 (15 counting v0.9.0 on Oct 22 onward) | High |
| **YouTube** | "Terse AI" channel: 2 videos uploaded 2026-10-29 | 7 views and 4 views on re-check (yt-dlp) | High |
| **Reddit** | No thread mentioning Terse or Durable Actors found | 0 | Medium (public Reddit search returned 403; RSS/listing fallback plus web search found nothing) |
| **Product Hunt** | No launch found | 0 | Medium |
| **Blogs / aggregators** | deniz.in write-up (Oct 7), 80aj.com (Chinese, Oct 8), zeli.app HN translations, nicheloom, gitnova, AGI Hunt digest | A handful, mostly derived from the HN post | Medium |

**Inferred:** This is a two-person YC F26 company three weeks after launch. The volume is what you would expect from one decent Show HN plus steady founder posting. It has not broken out, and almost all non-founder discussion is in the single HN thread.

---

## 2. Timeline of notable posts

**Background (before Aug 2026)**
- **2026-06-02:** Terse started as something else. A "Show HN: Terse, TypeScript First Workflow Builder" got 3 points ([HN Algolia](https://hn.algolia.com/api/v1/search?query=terse&tags=story)). Thomas Karatzas's LinkedIn launch post called it "a Typescript-first Workflow builder built to work with Claude Code" ([LinkedIn](https://www.linkedin.com/posts/thomas-karatzas-a3015a94_happy-to-finally-share-what-olivier-simard-morissette-activity-7467602970143236097-_58G)). Durable Actors is therefore a **pivot or refocus**, not the original product.

**Aug-Sep 2026 (build-up)**
- **2026-08-30:** the `durable-actors` repo is created ([GitHub](https://github.com/TerseAI/durable-actors)).
- **Sep 4-16:** @IncTerse posts about "little-durable" now powering Terse and durable retries. Sep 17: Nico Lecomte (@NicolasLec91112), whose tweet reads as a founder from an earlier batch, names @IncTerse among F26 companies that "stood out" ([@IncTerse mirror](https://teapawt.org/IncTerse)).
- **2026-10-03:** Thomas Grauwin (rtk-ai labs) posts on LinkedIn: "building a great open source alternative to Durable Objects! They just entered Y Combinator F26" ([LinkedIn](https://www.linkedin.com/posts/thomasgrauwin_another-talk-talk-session-with-thomas-karatzas-activity-7511962460489240576-N0Rv)).

**Launch burst (Oct 6-9)**
- **Oct 6:** @karatzas_thomas: "Terse is joining the YC F26 batch! We are the open-source alternative to Cloudflare's Durable Objects..." The mirror shows about 23.9K views ([mirror](https://teapawt.org/karatzas_thomas/status/2107500256976085230)). The thread adds: "No more crashing at 128MiB" and "By default, we persist fields + block new requests while someone else is in the actor."
- **Oct 6:** @can quote-tweets: *"i hear durable storage is so hot right now..."* ([@IncTerse mirror](https://teapawt.org/IncTerse)).
- **Oct 6:** the Show HN goes up and reaches the front page on Oct 7 (Thomas: "was on the first page of @hackernews for most of the day yesterday!") ([HN](https://news.ycombinator.com/item?id=49980399)).
- **Oct 6:** Olivier Simard-Morissette's LinkedIn post asks for stars and invites people to "help us break our infra at demo.useterse.ai" ([LinkedIn](https://www.linkedin.com/posts/olism_work-update-thomas-karatzas-and-i-got-into-activity-7513251967154995203-k6ux)).
- **Oct 7:** pinned launch tweet: "Introducing Durable Actors: Open source alternative of Durable Objects built for agent fleets and multiplayer AI..." About 10.5-11.3K views ([mirror](https://xitter.cf/karatzas_thomas/status/2107872102829502622)). In the replies Thomas promises "More detailed benchmarks coming soon! I am seeing some day to day variability with GCS Rapid ... will get a benchmark.md out."
- **Oct 7-8:** third-party write-ups: [deniz.in](https://deniz.in/terse-open-sources-durable-actors-a-self-hostable-alternative-to-cloudflare-dura) and [80aj.com](https://www.80aj.com/2026/10/08/durable-actors-ai-apps/) (Chinese, about 42 reads).
- **Oct 8:** **Khaliq Gant (Agent Relay):** *"Had dinner with the @IncTerse guys ... So much of what they're doing just makes so much sense from first principles. For agent native software it's a near perfect match. We're moving over to their tech for @agent_relay and I'm super excited for it. Terse can't miss!"* ([@IncTerse mirror, retweet](https://teapawt.org/IncTerse)).
- **Oct 8:** Thomas says a Durable Actors agent-coordination demo "almost won me the @ycombinator demo showcase. lost in the finals to a robotic arm playing Doom".
- **Oct 9:** in the 1,391-point "Cloudflare acquires Deno" HN thread, patcon writes that Cloudflare is the main implementer of the actor paradigm, "but others have been trying to push it (Rivet, and TerseAI's durable actors, celld)" ([HN comment](https://news.ycombinator.com/item?id=50024586)). This is the only organic mention of Terse I found outside its own launch thread.
- **Oct 9:** @oliviersm199 ships a multiplayer Victorian murder-mystery stress-test game: "Every conversation is a durable Actor," with ElevenLabs TTS and three.js ([mirror](https://teapawt.org/IncTerse)).

**Follow-through (Oct 12-29)**
- **Oct 12:** Python SDK announced: "one of the most requested features for durable-actors is Python SDK support."
- **Oct 14:** demo at Omnara demo night. @IncTerse jokes: *"A groundbreaking 3 people knew what an actor was! (new record)"*.
- **Oct 15:** Thomas posts a thread on how Durable Actors differ from Cloudflare DO (about 520-556 views). **Oct 17:** two blog comparisons, [vs Cloudflare DO](https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects) and [vs Rivet](https://www.useterse.ai/blog/terse-vs-rivet-actors).
- **Oct 19:** "I built a tiny Lovable with @pidotdev durable, @modal and @IncTerse Durable Actors ... Maybe it becomes a software factory" (about 3.3-3.4K views). Replies: @ravixalgorithm: "a tiny lovable built on durable actors is such a fun demo"; @kaify_co: "make it a series" ([mirror](https://teapawt.org/karatzas_thomas/status/2112273088759132217)).
- **Oct 19-22:** hackathon promotion. "@IncTerse is throwing the first (to our knowledge) Actor Hackathon at @ycombinator!"
- **Oct 18-20:** v0.8.1 (GitHub release published Oct 18; the date of the accompanying tweet is unverified): async Python actors, `@Atomic` decorator, "Adaptor for Pi durable within a durable actor", Alarms.
- **Oct 23:** Agent Relay launches publicly: a [YC Launch post](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other) and Will Washburn's launch tweet (about 96.5K views, 506 likes on the [mirror](https://teapawt.org/willwashburn/status/2113753053191131581)). I could not confirm whether Thomas retweeted it.
- **Oct 23:** "Durable Objects are confusing. here is what made it click for me." About 12.9K views (12,887 on the mirror), the founder's best-performing post after launch ([mirror](https://teapawt.org/karatzas_thomas/status/2113686145225871790)).
- **Oct 24:** Thomas introduces a mascot, "Arnie the Armadillo" (about 1.9K views).
- **Oct 28:** @agent_relay: "We just launched and are already shipping updates to our desktop app."
- **Oct 29:** Two YouTube videos go up on the "Terse AI" channel: ["Durable Actors Launch YC Demo Video"](https://www.youtube.com/watch?v=wpF3VTmljqM) and ["How to build Multiplayer AI into your product"](https://youtu.be/UNaG-PLw17s). The same evening Will Washburn files the Drizzle/transaction issues and PRs described in the TL;DR.

---

## 3. Hacker News thread in detail (the only real critique venue)

All quotes are verbatim from the [Show HN](https://news.ycombinator.com/item?id=49980399), pulled via the Algolia API.

**Praise / interest**
- m1117: *"Great! Let's have more cloudflare alternatives"*. patcon: *"solid agree! cloudflare has inspiring offline tooling, for sure, but OSS def better"*.
- patcon: *"Love actor-based infra!"*. divyagnan: *"This looks really nice!"*.
- jeremycarter, defending against a Temporal comparison: *"The latency on those listed products is high because it's async queue based processing. This on the other hand should have predictable low latency as the placement of the live object is known."*

**Complaints / hard questions**
- **Write latency (the sharpest exchange).** anilgulecha: *"100ms for a write - not usable for anything beyond toys. I mean we have github.com/denoland/celld - with a known good open source history. Durable writes there are as low as 1ms."* After Thomas replied that celld single-node is about 90 ms, anilgulecha answered: *"I'm surprised at your technical language. Either you're ignorant of basics of how other key durable systems works, or you're misrepresenting a unnecessary worse case. Neither inspires confidence in your work."* Thomas: "We would love to offer an option to have 1ms writes" and said tunable durability is coming.
- **State query problem.** jeremycarter: *"one of the common problems with the virtual actor model is state query ... that means further double up on storing the state again in another database that can query it."* Thomas: "We actually get this a lot ... I think we need something you can set up to sync to a data lake."
- **GCP lock-in.** divyagnan: *"are you able to self-host this outside of GCP (from the docs it seems like it is locked to GCP...)"*. Thomas: "We are pretty opinionated on how to host these."
- **Category confusion.** verst asked how it compares to Azure Durable Functions, Temporal and AWS Lambda Durable Functions, and added: *"I don't yet live in a world where my agents are fast enough where the cloud service latency matters :)"*. Olivier (olism): *"durable actors manages durable state, not durable execution."* behindsight: *"the 'durable' in durable objects is not the same 'durable' in those three you mentioned ... (naming is kinda confusing...)"*.
- **Comparisons requested:** celld (handfuloflight, patcon), Rivet (divyagnan), Erlang/Pekko/Pony vs Swift actors (steve_adams_86).

**Inferred:** On the concept, HN was friendly to curious. On credibility, the performance claims and hosting story drew the pushback. The founders answered quickly and politely, but the latency argument ended with no data from either side.

---

## 4. Themes: what gets attention

| Theme | Evidence | Valence |
|---|---|---|
| **Configurable compute per actor** (RAM/CPU/residency via decorator) | Thomas on HN: "Our biggest differentiator is the configurable compute"; X: "No more crashing at 128MiB" | Founder-led; m1117 echoed "more configurable compute wise" |
| **Serialized by default / no interleave on await** | Launch tweet; X reply asking "How do you handle a slow tool call blocking an actor with the non-interleaving default?" Thomas: "add the interleave decorator on the method" | Interest plus a practical worry |
| **Multiplayer AI and agent coordination demos** | Murder-mystery game, tiny Lovable, YC demo-showcase finalist | Best organic replies ("such a fun demo") |
| **OSS vs Cloudflare lock-in** | HN top comments, patcon in the Deno thread, deniz.in | Positive |
| **Latency / benchmarks** | anilgulecha critique; Thomas promising benchmark.md | Negative / unresolved |
| **GCP-only self-host** | HN, deniz.in ("self-hosting is documented for GCP specifically for now"), 80aj.com | Negative |
| **"What even is an actor?"** | "3 people knew what an actor was"; LinkedIn: "Explaining what Terse Inc does has been one of the greatest challenges I have faced"; Oct 23 explainer is the top post | The education gap the team itself acknowledges |

**Comparisons people make:** Cloudflare Durable Objects (always), Rivet Actors, celld (Deno's DO port), Temporal / Azure Durable Functions / AWS Lambda Durable Functions (category confusion), Orleans, Erlang/Pekko. Context: a separate HN launch "Open Source Durable Objects for Postgres" (solidobjects.dev, 41 pts, Sep 8) shows the "OSS Durable Objects" niche is crowded.

---

## 5. GitHub as a social signal

- **Live (re-checked late Oct 29 PT):** 290 stars, 22 forks, 22 open issues+PRs, language Rust, last push 2026-10-30 05:02 UTC ([repo](https://github.com/TerseAI/durable-actors)). gitnova (Oct 23) measured 242 stars with "+4 stars" in a 16-hour window and called growth "organic", "Magnitude: 1.2 out of 10, Steady" ([gitnova](https://gitnova.dev/en/r/TerseAI/durable-actors)). That is about 48 stars in 7 days. gitnova's daily series shows the launch spike: Oct 6 +29, Oct 7 +69, Oct 8 +30, Oct 9 +17, then about 2-9 per day.
- **Authorship of ~371 issues/PRs:** oliviersm199 280, tekaratzas 68, thomas-terse 7. External: **willwashburn (Agent Relay cofounder, 4: Drizzle ORM PR #370, nested transactions PR #371, issues #368/#369, all Oct 30 UTC)**, ANSHSINGH050404 (4, hardening: request-body limits, bounded queues), mvanhorn (2 PRs: `inspect` CLI, `onWake`/`onSleep` hooks), Kathircpe (auth fix), Aryan1718 (S3 storage), GabrielBianconi (README). **Inferred:** almost entirely team-driven, and the community is not yet filing bug reports.
- **Release cadence:** v0.12.0 through v0.14.4 (10 releases) shipped Oct 25-29, often several times a day (warm-pool, admission slots, observability UI holding only 500 events, an SQLite activation bug fixed Oct 28). **Inferred:** the API and runtime are changing fast right before the event.

---

## 6. Limits / could not verify

- **X:** no authenticated search. Timelines came from mirrors, so reply trees, quote-tweets and full engagement are incomplete. Mirrors show engagement counters without labels. I treat the largest number as views and do not assign likes or reposts precisely.
- **Rita Kozlov:** an AGI Hunt digest attributes an Oct 8 X item about Durable Actors to "ritakozlov" ([AGI Hunt](https://agihunt.info/en/p/1a118bc9c60d137c71f9883debf)). I could not see the original post or confirm whether it was a Cloudflare employee's comment or just a share. Treat it as unverified.
- **LinkedIn:** only snippets. Comment and reaction counts ("46 comments", "200 reactions") come from page text or a commenter, not an API.
- **Reddit:** public search returned 403. Keyless RSS/listing fallback and web search found no Terse threads. Absence is likely but not proven.
- **YouTube:** both Terse videos were uploaded on the capture date with no transcripts. No third-party videos found.
- **Hidden HN comment:** HN child 50012517 did not appear in the Algolia tree; it was probably deleted or flagged.
- **Name collision:** "Terse" is also a popular Claude Code plugin (Show HN "claude-terse", 25 pts, Oct 7) and other projects. Searches for "Terse" pull in a lot of noise, so I used "Durable Actors", "useterse" and "TerseAI" as anchors.
- **GitHub stargazer timeline:** the API call failed (404 with the star-timestamp header). gitnova's page has a per-day series through Oct 23 (quoted in section 5), but it is third-party and I have not cross-checked it.

---

## Hackathon implications

**What to build (social evidence for what lands):**
1. **A multiplayer AI experience where each room, conversation or agent is one Durable Actor.** The founders' best organic reactions came from the murder-mystery game and the "tiny Lovable / software factory". A Halloween version (a haunted-house mystery where each ghost NPC is an actor, players join over WebSocket, and turns are serialized) fits both their demos and the theme.
2. **Use both Durable Actors and Agent Relay.** Agent Relay's cofounder publicly said they are moving onto Terse tech, Agent Relay launched Oct 23, and Will Washburn was filing Drizzle and transaction PRs against durable-actors on Oct 29-30. A design where agents coordinate over Agent Relay and their shared state (for example a CRM record, a codebase lock or a game board) sits in a Durable Actor gives the "bonus points for both" story, and both hosts already describe it publicly.
3. **Show the actor guarantee on screen.** The education gap is the team's own stated pain ("3 people knew what an actor was"). A short visual of two agents hitting the same actor while calls queue, then a kill/restart with state surviving, makes the concept land with judges. The built-in observability UI (recently reworked) is a good thing to show.

**Gotchas from what people complain about:**
- **Latency:** durable writes are 85.6 ms p95 by the founders' own Show HN numbers, which predate the v0.9-v0.14 runtime work. Don't put a durable write in a hot real-time loop, such as per audio frame or per keystroke. Batch writes, and use the in-memory/socket broadcast path for UI updates.
- **Non-interleaving default:** a slow LLM or tool call inside an actor method blocks every other caller. Use `@Interleave` on long-running methods. Note the Terse blog's warning that once any method in a class interleaves, the class loses automatic rollback.
- **Fast-moving runtime:** 10 releases in 5 days (Oct 25-29), and 15 since Oct 22. Pin the CLI and SDK version on Oct 31 and don't upgrade mid-hack.
- **Self-host is GCP-only:** for a 5-hour build, use local `terse actor dev` or Terse Cloud (`bunx terse-cli@latest install`, `terse deploy`). Don't attempt a Helm deploy.
- **State query:** if the demo needs cross-actor dashboards, plan a small export or mirror table (Supabase works and helps the "scale to millions" pitch). HN flagged this as a known weak spot.

**Setup to do before Oct 31:**
- Install Bun ≥1.4.2. Run the [quickstart](https://docs.useterse.ai/quickstart) counter end to end, including `terse deploy` and API-key creation, so auth or CLI problems show up before the event. Also try the Python SDK if the team prefers Python.
- Watch the [YC demo video](https://www.youtube.com/watch?v=wpF3VTmljqM) and the [multiplayer whiteboard video](https://youtu.be/UNaG-PLw17s) to match the founders' framing.
- Skim the two comparison posts ([vs DO](https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects), [vs Rivet](https://www.useterse.ai/blog/terse-vs-rivet-actors)) so the pitch uses their vocabulary: persisted fields, serialized calls, generated clients, per-actor SQLite, configurable compute.

**What judges and sponsors appear to want (inferred from their posts):**
- Terse wants **proof that the primitive is useful for agents and multiplayer**. Its founders repeat "software factory", "agent fleets", "multiplayer AI" and "agent coordination". A demo that could become a reusable example in their repo, like the tiny Lovable, matches what they promote.
- Visible use of distinguishing features (decorator-configured compute, `@Persisted`, serialized execution, sockets, observability) beats treating Durable Actors as a generic key-value store.
- **Watch PR #370 (Drizzle ORM, `db.query`/`db.transaction`) before Oct 31.** It was opened by the Agent Relay cofounder the night before this check. If it merges, a Drizzle-typed per-actor SQLite schema is probably the API both hosts will want to see. If it does not merge, do not depend on it. Pin whichever version you test.
- Filing a real issue or PR during the hack (external contributors are rare) would get attention from a two-person team. This is my inference, not a stated criterion.

---

## Sources

- Event page (local): /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md
- Show HN thread: https://news.ycombinator.com/item?id=49980399 (full tree via https://hn.algolia.com/api/v1/items/49980399)
- HN comment, patcon in "Cloudflare acquires Deno": https://news.ycombinator.com/item?id=50024586
- HN story search (Terse pivot, claude-terse collision, solidobjects): https://hn.algolia.com/api/v1/search?query=terse&tags=story
- GitHub repo: https://github.com/TerseAI/durable-actors ; releases: https://github.com/TerseAI/durable-actors/releases
- gitnova star tracking: https://gitnova.dev/en/r/TerseAI/durable-actors
- YC company page: https://www.ycombinator.com/companies/useterse
- Terse homepage: https://www.useterse.ai/ ; quickstart: https://docs.useterse.ai/quickstart ; demo: https://demo.useterse.ai/
- Terse blog: https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects ; https://www.useterse.ai/blog/terse-vs-rivet-actors
- X mirrors: https://teapawt.org/IncTerse ; https://teapawt.org/karatzas_thomas ; https://teapawt.org/karatzas_thomas/status/2107500256976085230 ; https://xitter.cf/karatzas_thomas/status/2107872102829502622 ; https://teapawt.org/karatzas_thomas/status/2112273088759132217 ; https://teapawt.org/karatzas_thomas/status/2113686145225871790 ; https://nitter.rdrama.net/IncTerse
- LinkedIn: https://www.linkedin.com/posts/olism_work-update-thomas-karatzas-and-i-got-into-activity-7513251967154995203-k6ux ; https://www.linkedin.com/posts/thomas-karatzas-a3015a94_explaining-what-terse-inc-does-has-been-one-activity-7514076987481735168-MpTa ; https://www.linkedin.com/posts/thomas-karatzas-a3015a94_happy-to-finally-share-what-olivier-simard-morissette-activity-7467602970143236097-_58G ; https://www.linkedin.com/posts/thomasgrauwin_another-talk-talk-session-with-thomas-karatzas-activity-7511962460489240576-N0Rv
- YouTube: https://www.youtube.com/watch?v=wpF3VTmljqM ; https://youtu.be/UNaG-PLw17s
- Blogs/aggregators: https://deniz.in/terse-open-sources-durable-actors-a-self-hostable-alternative-to-cloudflare-dura ; https://www.80aj.com/2026/10/08/durable-actors-ai-apps/ ; https://www.nicheloom.com/launches/44910/ ; https://agihunt.info/en/p/1a118bc9c60d137c71f9883debf
- Agent Relay repo (context): https://github.com/AgentWorkforce/relay (the old `khaliqgant/agent-relay` path redirects here; 1,059 stars on Oct 29)
- Agent Relay launch: https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other ; https://teapawt.org/willwashburn/status/2113753053191131581 ; https://teapawt.org/agent_relay/with_replies
- Will Washburn's durable-actors contributions: https://github.com/TerseAI/durable-actors/pull/370 ; https://github.com/TerseAI/durable-actors/pull/371 ; https://github.com/TerseAI/durable-actors/issues/368 ; https://github.com/TerseAI/durable-actors/issues/369
- Show HN story text (perf numbers): https://hn.algolia.com/api/v1/items/49980399
- last30days raw output: ~/Documents/Last30Days/terse-durable-actors-raw-v3.md

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live sources (gh CLI, HN Algolia API, X mirrors via curl/Exa, yt-dlp, the Terse site and docs).

| # | Claim (as originally written) | Check | Outcome |
|---|---|---|---|
| 1 | Show HN: 53 points, 25 comments, Oct 6 | Algolia `items/49980399` | **Confirmed.** 53 pts, 25 comments, 2026-10-06 15:58 UTC. All HN quotes in section 3 match verbatim (anilgulecha, jeremycarter, divyagnan, verst, olism, behindsight, m1117, patcon). |
| 2 | "~85-100 ms p95 durable write" | Show HN story text | **Corrected.** Founders' number is 85.6 ms p95 (plus 2.14 ms read, 334 ms warm-up). "100ms" was the critic's rounding. |
| 3 | Khaliq Gant quote "We're moving over to their tech ... Terse can't miss!" (Oct 8) | teapawt.org/IncTerse retweet | **Confirmed verbatim.** Added: about 236 views. |
| 4 | Agent Relay launched Oct 28-29; Will Washburn tweet about 62.6K views, retweeted by Thomas | YC Launch page, Washburn tweet mirror, launchvideo.com | **Wrong, fixed.** Launch was **Oct 23**; the tweet shows about 96.5K views and 506 likes. Thomas's retweet could not be confirmed and was removed. The Oct 28 @agent_relay post is a follow-up about desktop-app updates. |
| 5 | Repo: 279 stars, 21 forks, 18 open issues | `gh api repos/TerseAI/durable-actors` | **Updated.** 290 stars, 22 forks, 22 open issues+PRs. Created 2026-08-30 confirmed. |
| 6 | "14 releases from v0.12.0 to v0.14.4 between Oct 25 and 29" | `gh release list` | **Wrong, fixed.** That range is 10 releases (11 counting v0.11.1, which shipped early Oct 25 UTC). 15 since v0.9.0 on Oct 22. |
| 7 | Issue/PR authorship (~360; all external contributors listed) | `gh issue/pr list --json author` | **Corrected, and an important item was missing.** ~371 total; tekaratzas 68. **willwashburn (Agent Relay) has 4** (#368-#371, Drizzle ORM and nested transactions), added to the TL;DR and section 5. |
| 8 | "Arnie the Armadillo" introduced Oct 28-29 | karatzas_thomas mirror | **Wrong, fixed.** Introduced **Oct 24**. |
| 9 | Oct 23 explainer about 12.8K views; tiny Lovable about 3.3-3.4K, with @ravixalgorithm and @kaify_co replies | mirrors | **Confirmed.** 12,887 and 3,420 views; both reply quotes match. |
| 10 | Launch tweet Oct 7, about 10.5-11.3K views; the "benchmark.md" reply; the interleave-decorator reply | xitter.cf mirror | **Confirmed.** 11,346 views; reply texts match. |
| 11 | patcon mention in the 1,391-point "Cloudflare acquires Deno" thread, Oct 9 | Algolia items/50024586, story 50019911 | **Confirmed.** |
| 12 | `@Interleave` removes automatic rollback for the whole class; self-host documented only for GCP | Terse blog vs DO (Oct 17) | **Confirmed.** |
| 13 | Quickstart: Bun ≥1.4.2, `bunx terse-cli@latest install`, `terse actor dev`, `terse deploy` | docs.useterse.ai/quickstart | **Confirmed.** Note: the Oct 17 blog and the Oct 7 deniz.in write-up show older `durable-actors` CLI commands and Bun 1.3.9. Follow the current quickstart. |
| 14 | YouTube: 2 videos uploaded Oct 29, 5 and 1 views; second titled "multiplayer AI whiteboard" | yt-dlp | **Updated.** 7 and 4 views. Real title of the second video is "How to build Multiplayer AI into your product". |
| 15 | nicheloom "top 19%"; gitnova 242 stars with +4 | nicheloom, gitnova pages | **Corrected** to "top 18%" (52 upvotes in their snapshot). gitnova confirmed, and it has a per-day star series, now quoted. |
| 16 | Sep 17 "YC-affiliated account" | IncTerse mirror | **Clarified.** Nico Lecomte; his wording implies he is from an earlier batch. |
| 17 | Agent Relay repo URL `khaliqgant/agent-relay` | gh api | **Updated.** It redirects to `AgentWorkforce/relay` (1,059 stars). |
| 18 | Event-page prize facts (iPhone duo for Durable Actors, Mac mini for Agent Relay, bonus for both, Builderbase) | EVENT_PAGE.md and the Oct 19 Thomas tweet on the IncTerse mirror | **Confirmed.** The tweet also lists "Guaranteed YC Interview". |

**Not re-checked (left as originally sourced):** the Oct 6 YC-batch tweet's ~23.9K views; the v0.8.1 tweet date; LinkedIn snippet counts ("46 comments", "200 reactions"); the Rita Kozlov item (AGI Hunt does list "ritakozlov · x · 2026-10-08", but the original post is still unseen, so it stays **(unverified)**); the "almost won YC demo showcase" tweet (seen in the IncTerse mirror text, but without a date anchor).

