# Supabase: social media pulse (Aug-Oct 2026)

> Captured 2026-10-29 for Haunted Hacks (Oct 31, 2026). This file covers one angle: what developers are saying about Supabase in public. It does not cover API docs, the newest features in depth, or code. Those are in `01`-`03` and `05`.
> Method: `last30days` v3.3.1 engine run (window 2026-09-30 to 2026-10-30, with a query plan over Supabase / Turso / Realtime scale / MCP agents, and X handles @supabase, @kiwicopple, @AntWilson). Then direct HN Algolia API queries (from 2026-08-01), yt-dlp metadata and top comments, `gh` API, Exa and WebSearch for blogs, LinkedIn, Product Hunt, TechCrunch and status trackers. Raw engine dump: `~/Documents/Last30Days/supabase-raw-v3-2026-10-29.md`.
> Labels: **[verified]** means I read the primary source myself. **[vendor claim]** is Supabase's own number. **[inference]** is my reading. Items dated before Aug 2026 are marked **(background)**.

---

## TL;DR

1. **Volume is high, and most of it is ambient rather than about the product.** Supabase shows up as the default backend in "my stack is..." posts far more often than in posts that talk about Supabase itself. HN: 63 stories and 215 comments mention "supabase" since 2026-08-01 (Algolia counts). Most comments are job-seeker stack lists or Show HN stack lines. Only one Supabase-specific story broke 100 points: "Supabase is acquiring Turso", 222 pts / 117 comments.
2. **The month's biggest story was corporate news, not a feature.** On Oct 2 Supabase announced a $150M round and the Turso acquisition. Its own numbers: "70% of new databases created by agents" and "more than 1M users and 4M databases per month" **[vendor claim]**. People also discussed it as part of a wider wave of devtools consolidation.
3. **The most common complaint is security of vibe-coded apps.** That means RLS left off, `service_role` keys in browser bundles, and public buckets. TechCrunch/UpGuard reported about 16,000 Supabase-hosted databases exposing personal data (Sep 25). A small industry of "Supabase scanner" tools keeps appearing on HN and Product Hunt.
4. **The second complaint is reliability in Aug-Sep.** An intermittent JWT 401 incident stayed open from Aug 14 to Sep 29. Nano projects went unresponsive for about 27 hours on Sep 10-11. These are public on status trackers. October looks quieter in social chatter.
5. **Supabase's own story for this hackathon's prize is "from day one to millions."** At Select (Oct 2) it announced, and in blog follow-ups on Oct 28-29 it opened up, Multigres (HA, private alpha, paid plans, by invite), OrioleDB (public beta, all plans) and Compute (private alpha with a waitlist, per the [Select recap](https://supabase.com/blog/supabase-select-2026-recap)). Reception was positive but skeptical. The top YouTube comment on the recap video complains that Auth Hooks and Vault are "still in beta since 2023".
6. **Realtime gets little hype but a lot of practical how-to writing.** In October, dev.to and blog posts kept repeating the same gotchas: Broadcast is ephemeral, late joiners see nothing, Presence is not for high-frequency data, and a stalled socket still shows "Connected". The usual comparison is Convex, which gets credit for "reactive by default". Supabase gets credit for Postgres, SQL and portability.

---

## 1. Volume by source

| Source | What I measured | Count / engagement | Notes |
|---|---|---|---|
| X | last30days engine (Bird search, 4 subqueries) | 35 posts; 430 likes, 361 reposts, 110 replies (engine totals) | Dominated by official @supabase / @kiwicopple / @AntWilson and Turso posts. Organic posts are small (1-26 likes). |
| Hacker News | Algolia API, `created_at > 2026-08-01` | 63 stories, 215 comments | Top Supabase-specific story: Turso, [222 pts / 117 cmt](https://news.ycombinator.com/item?id=49934784). TechCrunch exposure story: [16 pts](https://news.ycombinator.com/item?id=49857595). |
| Reddit | Engine (keyless RSS/listing; JSON search returned 403) | 6 threads; 176 upvotes, 140 comments | Titles and metadata only. Thread bodies could not be fetched (see Limits). |
| YouTube | yt-dlp search + metadata | Official recap [29.7K views](https://www.youtube.com/watch?v=I9GymvCJRRw) (Oct 13). Creator critique [9.7K](https://www.youtube.com/watch?v=JllzgqiOF34) (Oct 12). Latent Space interview [3.9K](https://www.youtube.com/watch?v=zHG6sAss_kE) (Oct 28). | Older evergreen videos still lead search results (background). |
| LinkedIn | Exa | CEO funding post (Oct 2). @supabase Multigres/OrioleDB post: 44 reactions, 5 comments (unverified; Exa snippet only) | Low organic signal. Mostly vendor and agency posts. |
| Product Hunt | Exa | Supabase page: 5.0, 921 reviews, 59K followers, 16 launches (unverified; Exa snippet only) | No Supabase launch found on PH in Aug-Oct 2026. Recent PH activity is third-party tools (scanners, analytics). |
| Dev blogs (dev.to etc.) | Exa | At least 6 Realtime-specific posts in Oct 2026 | Practical and critical in tone. See section 6. |
| GitHub | `gh api` (live, 2026-10-29) | supabase/supabase **114,325 stars** (re-checked 2026-10-29), 16,321 forks. supabase/realtime **7,673 stars** | Realtime shipped [v2.150.0](https://github.com/supabase/realtime/releases/tag/v2.150.0), "broadcast persistence opt-in" (#2235), on Oct 29, then v2.150.1 (Postgres Changes frame-cache fix) at 00:09 UTC Oct 30 [verified]. |

**The single most viral item is a joke.** On Oct 20 @kiwicopple posted "i had 12 Claude agents running in parallel for 6 hours and i managed to reverse engineer @supabase ... 100% free & open-source", with a link to the existing repo. A third party measured it through the X API on Oct 22: **1,982,350 views and 6,130 likes**. The @supabase follow-up ("Supabase is now fully available and open source thanks to Claude") had 1,026,171 views and 10,863 likes ([eraofminds](https://eraofminds.com/blog/supabase-12-claude-agents-reverse-engineer/)). I could not re-verify those counts myself. Some readers took it literally ([ABAB News](https://www.ababnews.com/en/news/80252a02-10c5-4c9c-b99c-fbd9561a9215)).

---

## 2. Sentiment overview

| Bucket | Share of substantive items I read [inference] | Typical voice |
|---|---|---|
| Positive / default-choice | ~45% | "Every vibe-coded app I see: Next JS, Supabase, Stripe"; "Supabase is excellent"; "Supabase is the nuts" |
| Neutral / news | ~25% | Funding, Turso, Multigres coverage; job posts |
| Negative / wary | ~30% | Security exposures, outages, "I loathe supa", "so much more complicated to work with", consolidation anxiety |

There is no hostile pile-on. The negative posts are specific: security defaults, complexity, and beta features that stay in beta. Brand affection is strong. Even critics open with "Supabase is excellent" ([John Kealy](https://www.youtube.com/watch?v=JllzgqiOF34)) or "Supabase is a great product, we use it for all of our products" ([HN integrallis](https://news.ycombinator.com/item?id=49935840)).

---

## 3. Themes, with verbatim quotes

### 3.1 Turso acquisition and the $150M round (Oct 2): mixed, mostly curious [verified]

- The HN thread ([222 pts](https://news.ycombinator.com/item?id=49934784)) split three ways: Turso users worried, SQLite purists annoyed at "rewriting SQLite", and people who see a sensible prototype-to-Postgres path.
  - Worried: "UGH as a turso customer, I do not want this." (kilroy123). Also: "I do not feel good about this. I really want SQLite (and the Turso re-write of it) to win for tiny apps..." (brainless)
  - Positive: "a rare win-win-win (supabase-turso-customers being the parties)." (popalchemist). Also: "I'll likely be choosing turso going forward for projects." (vmg12)
  - Founder replies: Turso CEO glommer wrote "We were doing fine. This is a strategic acquisition..." A Supabase employee (saltcod) wrote "Turso remains a product and SQLite remains their focus. Supabase/Postgres is the path as workloads grow."
  - Skeptic on prototyping: "supabase is a great product for prototyping... But the value of instant access to a real postgres db is also where inevitable pain comes from." (apsurd)
- [r/Supabase repost](https://www.reddit.com/r/Supabase/comments/1ww0t8r/supabase_is_acquiring_turso/): 74 upvotes, 9 comments (body not readable).
- Vendor framing ([PR Newswire, Oct 2](https://www.prnewswire.com/news-releases/supabase-announces-150m-in-new-funding-and-turso-acquisition-302896752.html)): GIC led, with CapitalG, IronArc and SquarePeg participating. The release names **Mastra** (a hackathon sponsor) as a Turso customer for per-agent databases, alongside Superhuman, Sauna.ai and CTO.new [verified]. "70% of new databases created by agents or AI-driven tools", four months after a $500M Series F **[vendor claim]**. The CEO's [LinkedIn post](https://www.linkedin.com/posts/paulcopplestone_today-supabase-is-announcing-150m-in-new-activity-7511811438659710977-qyxC) says "nearly 5M databases every month". The press release says "4M". Small inconsistency, noted.
- Glauber Costa (@glcst), Oct 29: "start small, with Turso databases: the shape of SQLite, but with the feature set of postgres. Then evolve all the way to the petabyte clusters with Multigres." ([X](https://x.com/glcst/status/2115791268391383085), 44 likes / 3.4K views on re-check)

### 3.2 Consolidation anxiety: a background theme, not aimed at Supabase specifically

- @pondorasti, Oct 9: "Bitter sweet to see most of the web ecosystem consolidate into big players... Turso → Supabase • Drizzle → PlanetScale • ... Better Auth → Vercel • Neon → Databricks" ([X](https://x.com/pondorasti/status/2108614734757134652))
- @danieldraper, Oct 26: "Big tech is acquiring a lot of open-source startups... Supabase bought Turso. Cloudflare bought Deno (and killed most of it!)" ([X](https://x.com/danieldraper/status/2114820614615978282))
- @erikvbos, Oct 21: "Do turso, they just got bought out by supa. I loathe supa" ([X](https://x.com/erikvbos/status/2112721850895573048), 6 likes). This is the bluntest negative post in the sample.

### 3.3 "The default stack" and agents as the main user: the dominant positive signal

- @DanielSmidstrup, Oct 30 UTC: "Every vibe-coded app I see: Next JS, Supabase, Stripe. Is that just the default stack now?" ([X](https://x.com/DanielSmidstrup/status/2115990684842836184), 20 likes / 27 replies on re-check)
- HN, Oct 2: "Best app stack of 2026, according to LLMs: Next.js, Supabase, Vercel, Stripe" ([openllmrank](https://openllmrank.io/blog/ai-app-stack-2026), 3 pts)
- @BasharAboudaoud, Oct 26: "Agents do not shop for infrastructure. They reach for the default, and the default compounds with every app they ship." ([X](https://x.com/BasharAboudaoud/status/2114629297323311332))
- HN, Oct 25: kiwicopple replied in person to a story about a teenager's Supabase-backed app. "Please tell your little sister that I'm happy supabase could be a small part of her builder journey" ([HN](https://news.ycombinator.com/item?id=50229415)). The founders show up in threads, and that is part of the brand.
- Latent Space, Oct 28: "Why Agents Love Supabase" interview with both founders ([YouTube](https://www.youtube.com/watch?v=zHG6sAss_kE), 3.9K views).

### 3.4 Security of vibe-coded apps: the #1 complaint [verified]

- **TechCrunch, Sep 25** ([Zack Whittaker](https://techcrunch.com/2026/09/25/some-supabase-customers-are-publicly-exposing-reams-of-peoples-data-to-the-web/)): UpGuard found "around 16,000 databases on which some degree of personal data was exposed". Supabase CISO Bil Harmer said projects are "secure by default" and called security "a shared responsibility". HN gave it only [16 pts](https://news.ycombinator.com/item?id=49857595). The story spreads through scanners and warnings more than through debate.
- Scanner launches Aug-Oct on HN: [Free tool to check Supabase vulnerabilities](https://news.ycombinator.com/item?id=49401599) (Aug 22), [RLS audit SQL file](https://news.ycombinator.com/item?id=49771238) (Sep 20), [Free scanner for exposed Supabase data in AI-built apps (Lovable, Bolt, Base44)](https://news.ycombinator.com/item?id=49772946) (Sep 20), [rls-guard](https://news.ycombinator.com/item?id=49135109) (Aug 1), [Sodabase](https://sodabase.io/) (Oct 8). On X, @yadav_patle (Oct 30): "Vibe-coded apps can ship a Supabase service_role key straight into the browser bundle. Anyone with devtools can read it." ([X](https://x.com/yadav_patle/status/2116009698478768260))
- Reddit, Oct 1: "Anyone else not trusting 'RLS enabled' after letting an AI agent touch their migrations?" ([r/Supabase](https://www.reddit.com/r/Supabase/comments/1wv5k7i/anyone_else_not_trusting_rls_enabled_after/), 8 upvotes / 18 comments. Title only.)
- **Could not verify:** a Spanish-language X post (@BotBauR, Oct 30, attributed to @VECERTRadar) says a 1M-record Indonesian visa dump came from an agency on Supabase with "RLS abierto y bucket público" (open RLS and a public bucket) ([X](https://x.com/BotBauR/status/2116019520435327257)). This is an unverified threat-intel repost. Treat it as rumor.

### 3.5 Reliability in Aug-Sep (the period just before this window)

- **JWT 401 incident**: opened Aug 14 and resolved Sep 29. In the middle, PostgREST 14.17 was rolled back. The final fix required users to upgrade from the dashboard: "This issue has been open for over a month..." ([Pulsetic mirror of status page](https://pulsetic.com/status/supabase/incidents/6409/))
- **Unresponsive Nano projects**: Sep 10-11 (resolved Sep 11, 1:06 PM; the start timestamp is not shown on the status page, so the "about 27h40m" duration is unverified). Some users got false "Disk IO Budget" emails ([status.supabase.com](https://status.supabase.com/incidents/4mkcsnlf6p5x)).
- A third-party tracker counts "Supabase, 90 days 82 incidents" ([incidents.fru.dev](https://incidents.fru.dev/incidents/supabase-zkmggc01sdvj)). This includes minor and no-impact entries, so the number is inflated as a severity signal.
- October entries: project lifecycle and Management API errors (Oct 21-22) ([isitupordown](https://isitupordown.com/is-supabase-down/history/)). These affect **project creation**, which matters if you create a project on hack day.

### 3.6 The "scale to millions" story from Select: welcomed, with "is it GA?" skepticism

- Official recap ([YouTube, Oct 13](https://www.youtube.com/watch?v=I9GymvCJRRw), 29.7K views, 412 likes) lists: Turso powering "Supabase Spark... built for billions of databases"; OrioleDB "2x faster... with no vacuum" (the [blog](https://supabase.com/blog/orioledb-public-beta) is narrower: about 1.8x on an 8XL instance when data is larger than memory, 13-29% ahead in-memory at Large/8XL, and heap ahead at Small); Multigres "1,000 failovers with zero data loss"; a rebuilt CLI with "no Docker, 9x faster cold starts" (the written recap says the Docker-free local mode is alpha and off by default); Compute ("run any runtime with no timeouts"); and "log in with ChatGPT, MCP elicitations, scoped access tokens".
- Top comment (15 likes), @abdirahmann: "supabase auth hooks and supabase vault are still in beta since 2023, why aren't this the stable/GA for these products be released?? this is crazy". Reply (4 likes), @TheHegi: "Because those aren't related to AI... All these features are for your agents, not for you". Others: "Computer is far more exciting than acquiring turso" (4 likes); "Pretty excited about the compute part".
- @jessethanley, Oct 30 UTC, on Multigres: "@supabase .... so you just built the default @PlanetScale setup? Where is your response to Neki?" ([X](https://x.com/jessethanley/status/2115986414731186359))
- The @supabase Multigres post, Oct 29: 115 likes, 26 replies, about 12.2K views on re-check ([X](https://x.com/supabase/status/2115849903427502490)).
- Independent write-ups keep the caveats: "Keep the keynote doubling as talk; keep the 1.8 figure as the published vendor bench" ([The Frontier](https://www.thefrontier.dev/articles/supabase-select)). "For a client site I wouldn't touch it yet" ([Headless Digital](https://headless-digital.com/notes/weekly-roundup-2026-10-02)).
- **A gotcha surfaced in the docs and absent from social chatter**: Multigres alpha has "No Realtime. Multigres doesn't yet support logical replication, which Realtime depends on". It is also not on the Free plan, by invite only, and East US (North Virginia) only ([Supabase blog, Oct 29](https://supabase.com/blog/multigres-private-alpha)). OrioleDB beta runs pgvector HNSW through an "experimental bridge" and is "not ready for production" ([blog, Oct 28](https://supabase.com/blog/orioledb-public-beta)) [verified].

### 3.7 Edge Functions and the Cloudflare-Deno deal: a short scare, answered by staff

- "Cloudflare acquires Deno" ([HN, 1,391 pts, Oct 9](https://deno.com/blog/cloudflare)) prompted "What happens to Supabase?" and "Doesn't supabase edge functions run on Deno?"
- The Supabase employee reply, saltcod ([HN](https://news.ycombinator.com/item?id=50031340)): "we operate our own infrastructure and don't depend on Deno's hosted services. While Deno is winding down active development over the next year, the Deno team has committed to contributing bug and security fixes... Our next-generation offering, Compute... will support Deno as well as other runtimes like Node.js and Bun... there's no need to migrate today". **[inference]** Edge Functions are safe to use on Oct 31. Expect judges to like hearing "Compute" mentioned, but it is not something to build on yet.

### 3.8 AI agents touching the database: MCP vs CLI

- John Kealy, Oct 12 ([YouTube](https://www.youtube.com/watch?v=JllzgqiOF34), 9.7K views): "Supabase is excellent. Letting AI experiment on your live database isn't." He recommends CLI, local dev and migrations with Claude Code, and MCP only where it "actually makes sense". One commenter pushed back: "Supabase MCP creates migration files by default". Another: "some people are actually just raw doggin the prod db".
- Supabase's own channel: "Agents write my migrations. I still read the diff." ([YouTube, Sep 8](https://www.youtube.com/watch?v=XpuGS7t5qLY)).
- CodeHead, "Did Supabase just FIX the problem with AI agents??" ([Aug 21](https://www.youtube.com/watch?v=FNREoiVyOrU), 4.3K views) is about Agent Skills. Its description has a Supabase affiliate/sponsor link (`supabase.plug.dev`), so it is **not independent**.
- @just_teju (Oct 30 UTC) on connecting Supabase to Claude for SQL from a phone ([X](https://x.com/just_teju/status/2116025184373096788)). This is a low-signal but representative "agent drives Supabase" workflow post.

---

## 4. Realtime specifically (most relevant to "Real-Time AI")

Social chatter about Realtime is small but technical. The strongest October items are long-form posts:

- **"Notes from a 2 AM On-Call: Supabase Realtime Connection Reset Under Next.js SSR Load"** ([dev.to, Oct 21](https://dev.to/elena_rostova/notes-from-a-2-am-on-call-supabase-realtime-connection-reset-under-nextjs-ssr-load-1dj3)). Creating clients in Server Components spawned "50+ WebSocket connections... within 2 seconds" and caused retry storms. Lesson: keep the Realtime client in one client component.
- **Tic-tac-toe + live order board** ([dev.to, Oct 23](https://dev.to/tomozilla/supabase-realtime-from-scratch-tic-tac-toe-with-broadcast-and-presence-then-a-live-order-board-1d9m)). Measured about **111 ms** for Broadcast versus **497-1,265 ms** for DB change to Realtime to browser. "A stalled connection can look healthy: 46 s of green 'Connected' with the default heartbeat, 16 s with 10 s." "Broadcast does not remember the past."
- **"What Is Supabase Realtime, and Why Does It Get Slow?"** ([axonbuild, Aug 8](https://axonbuild.com/blog/supabase-realtime-slow/)). Cites Supabase guidance to move from Postgres Changes to Broadcast above about **3,000 concurrent subscribers** on the same changes. Also: `worker: true` plus `heartbeatCallback` for background tabs, and a `ClientPresenceRateLimitReached` error if Presence is spammed.
- **Field-notes pattern** ([Adroit, Oct 7](https://adroit.io/field-notes/realtime-presence-broadcast-2026)): Presence for the roster and Broadcast for cursors, on one channel.
- A docs PR (background, May 2026) added an explicit caution that Presence is not for high-frequency updates ([PR #45502](https://github.com/supabase/supabase/pull/45502)).
- **Recent builder showcases with this pattern**: a [LinkedIn multiplayer game](https://www.linkedin.com/posts/samuel-peter-5117223b_devops-cloudengineering-softwareengineering-activity-7514641380980178945-IZN7) built for an "OpenAI Multiplayer Game Challenge" (Oct 10); a [5-screen TV escape game](https://dev.to/remi_bouvant_4fdbf8738ec6/an-escape-game-on-the-tv-played-with-phones-keeping-5-screens-in-sync-3p2i) that uses a server-authoritative engine plus a private Broadcast channel sent over HTTP from API routes (Oct 17); and [Figment Gaming](https://figmentanalytics.com/blog/shipping-on-supabase-and-cloudflare) on Supabase + Cloudflare (Oct 6). Shared design rule: **"the database is the source of truth. Realtime messages tell clients that something changed."**
- Vendor benchmark (docs, undated): **32,000 concurrent users, 224,000 msgs/sec, 6 ms median** for Broadcast over WebSocket. The same page has a larger "scalability" scenario: **250,000 concurrent users, 500,000 channel joins, >800,000 msgs/sec, 58 ms median / 508 ms p99** ([benchmarks.mdx](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/realtime/benchmarks.mdx)) **[vendor claim]**. Both are useful for a "scales to millions" pitch slide.
- **Missing from social chatter: Broadcast Replay** (background, launched Dec 5 2025 as public alpha; [blog](https://supabase.com/blog/realtime-broadcast-replay)). Private channels can replay messages sent via Broadcast-from-Database (stored in `realtime.messages`) using `config.broadcast.replay = { since, limit }`; replayed messages carry `meta.replayed`. Needs supabase-js 2.74.0+. The [limits page](https://supabase.com/docs/guides/realtime/limits) lists 72 h retention and 25 messages per replay request. So "Broadcast does not remember the past" is true for client-sent Broadcast, but only partly true for DB-triggered Broadcast. I did not find a GA announcement.
- Open issue (Oct 13): "Realtime: postgres_changes subscriptions time out (ErrorOnRpcCall PostgresCdcRls create_subscription)" ([#51629](https://github.com/supabase/supabase/issues/51629)). Older issue still open: "Realtime Updates Fail Only When RLS is Enabled" (#35195, 9 comments).
- Community posts disagree on connection limits ("Free: 60" in the dev.to on-call post, 200 in [axonbuild](https://axonbuild.com/blog/supabase-realtime-slow/)). **Resolved against the [official limits page](https://supabase.com/docs/guides/realtime/limits) [verified 2026-10-29]:** concurrent connections Free 200 / Pro 500 / Pro without spend cap 10,000. Messages/sec 100 / 500 / 2,500. Presence messages/sec 20 / 50 / 1,000. Presence calls are capped at **5 per client per 30 seconds** on every plan. Broadcast payload 256 KB on Free and 3,000 KB on Pro. The "60" figure is wrong.

---

## 5. Comparisons people make

| vs | What people say Supabase wins on | What people say the rival wins on | Sources |
|---|---|---|---|
| **Convex** | Postgres/SQL, pgvector, portability, free tier, "safer bet" | Reactive-by-default, no subscription plumbing, fewer sync bugs, "magical" DX | [Will Rowston](https://www.willrowston.com/blog/convex-vs-supabase) (background, Jan), [converge.run](https://converge.run/blog/convex-vs-supabase-for-vibe-coding) (background, Feb), [socialanimal](https://socialanimal.dev/blog/convex-vs-supabase-2026-nextjs-backend-comparison/) (background, Apr), Web Dev Cody "Why I use Convex over Supabase" (59K views, older) |
| **Firebase** | Open source, SQL, RLS | Maturity, Google ecosystem | AppStuff video, 30K views (background, Feb) |
| **PlanetScale (Neki)** | Integrated BaaS | Multigres "is the default PlanetScale setup" jab | [@jessethanley](https://x.com/jessethanley/status/2115986414731186359) |
| **Self-hosted single binary** | Full feature set | "Self-hosting Supabase means a dozen containers" | [instancez Show HN](https://news.ycombinator.com/item?id=50090956) (Oct 14), [Typebase Show HN](https://news.ycombinator.com/item?id=49447178) (119 pts, Aug 26) |
| **Cloudflare (D1/Workers)** | Auth, RLS, REST "you might not even realise Supabase is handling" | Edge compute | Kealy reply in [video comments](https://www.youtube.com/watch?v=JllzgqiOF34). Supabase + Cloudflare is often a *pairing*, not a rivalry. |

Strongest critical video: "Why I Stopped Using Supabase for My SaaS" (Eliana Jordan, **Feb 2026, background**, 35K views, 201 comments) ([YouTube](https://www.youtube.com/watch?v=nfQ3FKyDAZw)). It still ranks high for "supabase problems".

---

## 6. Which features get attention (ranked by share of social mentions, last 90 days) [inference]

1. **Postgres DB + Auth as the "default backend"** (ubiquitous, mostly ambient)
2. **RLS / security** (mostly negative: exposures and scanners)
3. **Turso / agent databases / "70% by agents"** (news cycle)
4. **Multigres, OrioleDB, Compute** (Select; fans are enthusiastic, independent writers cautious)
5. **MCP / Agent Skills / CLI for agents** (workflow debate)
6. **Realtime** (low volume, high technical depth; almost all the practical writing is from October)
7. **Edge Functions** (only around the Deno news)
8. Barely discussed in public in this window: **Queues, Cron, pgvector**. pgvector appears mostly in job-seeker stack lists and one LinkedIn comment about a RAG eval.

---

## 7. Limits / could not verify

- **Reddit**: public JSON search returned 403, RSS returned 429, and Exa and Firecrawl both refused reddit.com. I have **thread titles, upvote and comment counts only**, from the engine's listing discovery. No comment text. Reddit sentiment is therefore under-represented, and I quote no Reddit comments.
- **X**: engine search through Bird with browser cookies. Safari cookie access was denied, but the X results came back anyway. Coverage is search-ranked, not exhaustive. Engagement counts are as returned by the engine. The 1.98M-view figure for the kiwicopple joke comes from a third party (eraofminds) and I did not reproduce it. Some posts are stamped 2026-10-30 because timestamps are UTC.
- **TikTok / Instagram / Threads**: not searched (ScrapeCreators key disabled). Treat them as unknown, not quiet.
- **YouTube**: the engine got 0 transcripts because the yt-dlp binary is stale (2026.03.17). I used metadata and top comments from yt-dlp directly instead. Views are as of 2026-10-29.
- **LinkedIn / Product Hunt**: Exa snippets only. No Supabase PH launch found in Aug-Oct 2026. I did not exhaustively check PH.
- **Polymarket**: 0 relevant markets.
- **Unverified**: the Indonesian visa leak attribution (section 3.4). Turso deal price (undisclosed). "4M" vs "nearly 5M" databases per month (vendor sources disagree). (The Realtime connection-limit conflict is now resolved against the official limits page; see section 4.)
- **Sentiment shares in section 2 are my judgment** over roughly 60 substantive items. They are not a classifier output.

---

## Hackathon implications

**What Supabase judges will reward ("most likely to scale to millions", $1k).** Supabase's own public story this quarter is three things together: (a) agents as the main creators of databases, (b) "from day one to millions of users" (the Select recap line), and (c) the security posture of AI-built apps. A project that tells all three at once fits their framing better than one that only uses Supabase as a CRUD store. [inference from sections 3.1, 3.3, 3.4 and 3.6]

**Concrete build pattern that matches the community's hard-won lessons:**
1. **Postgres is the authoritative state. Realtime is the notification layer.** Agents (Durable Actors / Agent Relay) write to tables. Use a trigger with `realtime.broadcast_changes()` to fan out to **private** Broadcast channels with RLS on `realtime.messages`. Do not use `postgres_changes` for a many-viewer demo, because each change is authorized once per subscriber.
2. **Use Presence only for the roster** ("3 ghosts haunting this room"). Use Broadcast for high-frequency data such as cursors, token streams and agent "typing". Each client gets 5 Presence calls per 30 s; going over triggers `ClientPresenceRateLimitReached` and closes the channel.
3. **Handle late joiners**: fetch a table snapshot on subscribe and on reconnect, or use Broadcast Replay (`broadcast.replay.since`, private channel, DB-sent messages only, public alpha, 25 msgs per request). Set `realtime: { worker: true, heartbeatIntervalMs: 10000 }` plus a `heartbeatCallback`, so a stalled socket does not show green while the demo is frozen.
4. **One Realtime client per browser tab.** Do not create clients inside Next.js Server Components (the dev.to on-call failure).
5. **Scale slide**: cite the vendor Broadcast benchmark (32K concurrent users, 224K msgs/sec) **as a vendor number**. Add the 250K-user / >800K msgs/sec scenario from the same page. Add the ~3,000-subscriber threshold for switching from Postgres Changes to Broadcast, and say you designed for that switch from the start.

**Gotchas to avoid on Oct 31:**
- **Do not pick Multigres** (no Realtime, invite-only, us-east-1 only). **Do not pick OrioleDB** if you use pgvector HNSW (experimental bridge, not production). Both are chosen at project creation and cannot be changed later.
- **Never ship `service_role` to the browser. Turn on RLS for every table.** Show the Security Advisor as clean in the demo. Judges will be aware of the TechCrunch/UpGuard story [inference].
- If an agent writes migrations through MCP, scope it: a dev project, read-only where possible, migrations committed to git. "Letting AI experiment on your live database" is a known community criticism.
- Project creation had Management API incidents in late Oct. **Create the project and enable extensions the night before.**
- Edge Functions are fine (Deno-based, Supabase-hosted). Mention Compute (private alpha, waitlist) as future direction only.
- The rebuilt Docker-free local CLI is **alpha and off by default**. Do not rely on it Saturday morning. Either have Docker running for `supabase start`, or develop straight against the hosted project.
- **Sponsor overlap:** the funding release lists Mastra as a Turso customer for per-agent databases. A Mastra agent with a Supabase/Postgres backend is a story both sponsors already tell. A per-agent Turso DB is optional and only worth it if you have time.

**Setup before Oct 31:**
- Redeem the $25 credits (one Pro month, per the [event page](../../EVENT_PAGE.md)) and create the project on Pro. Pro gives 500 concurrent Realtime connections and 500 msgs/sec. That is enough for a demo room, but if judges' phones plus a load script might pass 500, turn off the spend cap (10,000 connections) for the day.
- Enable `pgvector` and `pg_cron` (and `pgmq` / Queues if you need agent job queues). Run `supabase login` and link the CLI. Connect the Supabase MCP to your coding agent with a project-scoped token.
- Smoke-test a DB-trigger Broadcast to a private channel with an RLS policy, and a Presence roster, across 3 tabs. Time the end-to-end latency so you can quote a real number in the demo.

**Pitch language that matches Supabase's own words:** "Build in a weekend. Scale to millions." This is the current tagline on the [supabase.com homepage](https://supabase.com/), and it maps directly onto the prize name. (An earlier draft attributed it to a Launch Week 14 post. That attribution was not verified and has been corrected.) Also "agents create the database, Postgres keeps it honest". Avoid claiming Multigres or OrioleDB in production.

---

## Sources

- last30days raw dump: `~/Documents/Last30Days/supabase-raw-v3-2026-10-29.md`
- HN: Turso thread https://news.ycombinator.com/item?id=49934784 · TechCrunch story https://news.ycombinator.com/item?id=49857595 · saltcod on Deno https://news.ycombinator.com/item?id=50031340 · kiwicopple reply https://news.ycombinator.com/item?id=50229415 · instancez https://news.ycombinator.com/item?id=50090956 · Typebase https://news.ycombinator.com/item?id=49447178 · Cloudflare acquires Deno https://deno.com/blog/cloudflare
- Supabase: Turso post https://supabase.com/blog/supabase-is-acquiring-turso · Multigres https://supabase.com/blog/multigres-private-alpha · OrioleDB https://supabase.com/blog/orioledb-public-beta · Select recap https://supabase.com/blog/supabase-select-2026-recap · Realtime benchmarks https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/realtime/benchmarks.mdx · Presence PR https://github.com/supabase/supabase/pull/45502 · Realtime releases https://github.com/supabase/realtime/releases · Status https://status.supabase.com/incidents/4mkcsnlf6p5x
- Press: PR Newswire https://www.prnewswire.com/news-releases/supabase-announces-150m-in-new-funding-and-turso-acquisition-302896752.html · TechCrunch https://techcrunch.com/2026/09/25/some-supabase-customers-are-publicly-exposing-reams-of-peoples-data-to-the-web/ · Asia Tech Review https://www.asiatechreview.com/p/supabase-raises-another-150m-to-build · The Frontier https://www.thefrontier.dev/articles/supabase-select · Headless Digital https://headless-digital.com/notes/weekly-roundup-2026-10-02 · FounderMag https://foundermag.co/launches/supabase-select-2026/
- X: https://x.com/glcst/status/2115791268391383085 · https://x.com/supabase/status/2115849903427502490 · https://x.com/DanielSmidstrup/status/2115990684842836184 · https://x.com/pondorasti/status/2108614734757134652 · https://x.com/danieldraper/status/2114820614615978282 · https://x.com/erikvbos/status/2112721850895573048 · https://x.com/jessethanley/status/2115986414731186359 · https://x.com/yadav_patle/status/2116009698478768260 · https://x.com/BasharAboudaoud/status/2114629297323311332 · https://x.com/BotBauR/status/2116019520435327257 · https://x.com/just_teju/status/2116025184373096788 · joke explainer https://eraofminds.com/blog/supabase-12-claude-agents-reverse-engineer/
- YouTube: https://www.youtube.com/watch?v=I9GymvCJRRw · https://www.youtube.com/watch?v=JllzgqiOF34 · https://www.youtube.com/watch?v=zHG6sAss_kE · https://www.youtube.com/watch?v=XpuGS7t5qLY · https://www.youtube.com/watch?v=FNREoiVyOrU · https://www.youtube.com/watch?v=nfQ3FKyDAZw
- Reddit (titles only): https://www.reddit.com/r/Supabase/comments/1wv5k7i/ · https://www.reddit.com/r/Supabase/comments/1ww0t8r/ · https://www.reddit.com/r/nextjs/comments/1x9x4u3/
- LinkedIn / PH: https://www.linkedin.com/posts/paulcopplestone_today-supabase-is-announcing-150m-in-new-activity-7511811438659710977-qyxC · https://www.linkedin.com/posts/supabase_scale-without-limits-multigres-orioledb-activity-7511846328696651776-fytv · https://www.producthunt.com/products/supabase
- Dev blogs: https://dev.to/elena_rostova/notes-from-a-2-am-on-call-supabase-realtime-connection-reset-under-nextjs-ssr-load-1dj3 · https://dev.to/tomozilla/supabase-realtime-from-scratch-tic-tac-toe-with-broadcast-and-presence-then-a-live-order-board-1d9m · https://axonbuild.com/blog/supabase-realtime-slow/ · https://adroit.io/field-notes/realtime-presence-broadcast-2026 · https://dev.to/remi_bouvant_4fdbf8738ec6/an-escape-game-on-the-tv-played-with-phones-keeping-5-screens-in-sync-3p2i · https://figmentanalytics.com/blog/shipping-on-supabase-and-cloudflare · https://numptr.com/guides/convex-vs-supabase/ · https://www.willrowston.com/blog/convex-vs-supabase · https://converge.run/blog/convex-vs-supabase-for-vibe-coding
- Status trackers: https://pulsetic.com/status/supabase/incidents/6409/ · https://isitupordown.com/is-supabase-down/history/ · https://incidents.fru.dev/incidents/supabase-zkmggc01sdvj

---

## Verification log (2026-10-29)

Adversarial re-check by a second pass. Each claim was re-fetched from a live source and checked for ways it could be wrong.

| # | Claim | Method | Outcome |
|---|---|---|---|
| 1 | HN: 63 stories / 215 comments mention "supabase" since 2026-08-01 | Algolia `search_by_date`, `created_at_i>1785542400` | **Confirmed** (63 / 215). |
| 2 | Turso HN thread 222 pts; quotes from kilroy123, brainless, popalchemist, vmg12, glommer, saltcod, apsurd; integrallis quote | Algolia items API, full comment tree | **Confirmed** verbatim. Story posted 2026-10-02 by cvburgess. |
| 3 | saltcod's Deno/Edge Functions reply; kiwicopple's "little sister" reply | Algolia items 50031340, 50229415 | **Confirmed** (Oct 10 and Oct 25 UTC). |
| 4 | $150M led by GIC; "1M users and 4M databases per month"; "70%" by agents; LinkedIn says "nearly 5M" | PR Newswire and LinkedIn post fetched | **Confirmed.** 4M vs nearly 5M inconsistency is real. **Added:** IronArc and SquarePeg as investors, and Mastra named as a Turso customer. |
| 5 | TechCrunch Sep 25: UpGuard, ~16,000 databases; CISO Bil Harmer "secure by default", "shared responsibility" | TechCrunch article fetched | **Confirmed.** HN story is 16 pts, posted Sep 26. |
| 6 | Multigres alpha: no Realtime, invite-only, us-east-1; OrioleDB pgvector HNSW experimental bridge, not production | Supabase blog posts fetched | **Confirmed.** **Added:** Multigres needs a paid plan and is free for 2 projects in alpha. **Corrected:** OrioleDB's "2x" is a video claim; the blog says about 1.8x at 8XL (larger than memory), and heap wins at Small in-memory. |
| 7 | Select recap video claims (Spark, 2x, 1,000 failovers, CLI no Docker 9x, Compute, ChatGPT login) | yt-dlp description of I9GymvCJRRw; written recap blog | **Confirmed** in the video description. The written recap omits the numbers and says the Docker-free CLI is alpha and off by default. **Corrected:** Compute is "private alpha, waitlist", not just "announced". |
| 8 | YouTube views/dates (29.7K, 9.7K, ~4K, 35K, 4.3K) and recap top comments (@abdirahmann 15, @TheHegi 4, "Computer is far more exciting" 4) | yt-dlp metadata + top comments | **Confirmed** (Latent Space now 3,999 views). Kealy comment quotes confirmed. |
| 9 | GitHub: 114,320 stars; Realtime v2.150.0 "broadcast persistence opt-in" Oct 29 | `gh api` | **Updated** to 114,325. v2.150.0 confirmed. **Added:** v2.150.1, Oct 30 UTC. PR #45502 (merged 2026-05-21), issue #51629 (opened Oct 13, open) and #35195 (open, 9 comments) confirmed. |
| 10 | Realtime benchmark 32K users / 224K msgs/s / 6 ms | benchmarks.mdx via `gh api` | **Confirmed.** **Added:** 250K-user / >800K msgs/s scenario. |
| 11 | Connection limits conflict (Free 60 vs 200; Pro 500) | Official Realtime limits page | **Resolved:** Free 200, Pro 500, Pro without spend cap 10,000. The "60" figure is wrong. Presence 5 calls / client / 30 s added. |
| 12 | "Broadcast does not remember the past" / late joiners see nothing | Supabase Broadcast Replay blog + limits page | **Qualified.** Broadcast Replay (public alpha, Dec 2025) covers DB-sent messages on private channels: 72 h, 25 msgs per request. Added to section 4 and to the implications. |
| 13 | X posts (glcst, supabase Multigres, DanielSmidstrup, pondorasti, danieldraper, erikvbos, jessethanley, yadav_patle, BasharAboudaoud, BotBauR, just_teju) | fxtwitter API per status ID | **All 11 exist, and the quoted text matches** (ellipses mark elisions). Like counts updated: glcst 44, @supabase 115, DanielSmidstrup 20/27. BotBauR remains an unverified rumor; its own source is @VECERTRadar. |
| 14 | kiwicopple joke: 1.98M views / 6,130 likes; @supabase 1.03M / 10,863 | eraofminds article re-read | **Confirmed only as eraofminds' Oct 22 measurement.** I did not find the original status ID, so the figure is still third-party. |
| 15 | JWT 401 incident Aug 14 to Sep 29; PostgREST 14.17 rollback; "open for over a month" quote | Pulsetic mirror | **Confirmed** (Sep 17 update; rolled back to 14.5 on Aug 31). Nano incident resolved Sep 11 is confirmed. **The 27h40m duration is unverified** (start time not shown). |
| 16 | "built in a weekend, scales to millions" from a Launch Week 14 post | supabase.com homepage | **Corrected:** the phrase is the live homepage tagline, "Build in a weekend. Scale to millions." The LW14 attribution was removed. |
| 17 | Product Hunt stats; LinkedIn Multigres post reactions | Not re-fetched (PH and LinkedIn counts not readable) | Marked **(unverified)**. |
| 18 | dev.to tic-tac-toe numbers (111 ms; 497-1,265 ms; 46 s / 16 s); axonbuild ~3,000 subscribers, worker/heartbeatCallback | WebFetch of both posts | **Confirmed.** axonbuild was published Aug 8 and updated Oct 21. |
