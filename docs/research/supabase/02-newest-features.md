# Supabase: newest features, Aug to Oct 2026 (for Haunted Hacks, Oct 31 2026)

> Researched 2026-10-29. Angle: what Supabase shipped or announced from Aug 1 to Oct 29 2026, with exact dates and release status, and which of those features the company most wants people to show off. Primary sources: the Supabase changelog, blog (including the blog `.mdx` source files in `supabase/supabase` on GitHub, which carry exact dates), GitHub releases for `supabase/realtime` and `supabase/supabase-js`, plus the Oct 2 press release. Third-party sources are used only to corroborate, and are labeled when used.
> Labels: **[Verified]** means read on a primary source. **[Inference]** is my own reading. **[Background]** is older than Aug 2026.

---

## 1. TL;DR

- **The big event in this window was Supabase Select, on Oct 2 2026.** Everything was grouped under three themes: **Build anything**, **Operate with confidence**, and **Scale without limits**. On the same day Supabase announced **$150M in new funding** (led by GIC, with CapitalG, IronArc, and SquarePeg; "four months after the company's $500 million Series F") and said it **is acquiring Turso**. **[Verified]** ([recap](https://supabase.com/blog/supabase-select-2026-recap), [PR Newswire](https://www.prnewswire.com/news-releases/supabase-announces-150m-in-new-funding-and-turso-acquisition-302896752.html)). That Select took the place of a "Launch Week" this cycle is **[Inference]**: the blog source directory's last Launch Week posts are LW15 (Jul 2025), and no Supabase source I read says so.
- **Supabase's message is "agentic infrastructure."** Its press release calls Supabase "the leader in agentic infrastructure" and says it is "now adding more than 1M users and 4M databases per month with 70% of new databases created by agents or AI-driven tools," with "more than 13 million developers" using it. The Turso post says Supabase is "already launching over one million databases per week." **[Verified]** (press release text read directly on 2026-10-29)
- **The newest feature you can actually use on Saturday is "Your app's MCP server"** (blog Oct 22). It is a shadcn block that drops an authenticated MCP Edge Function into your app. Users connect ChatGPT or Claude through Supabase Auth's OAuth 2.1 server, and every tool call runs as that user under RLS. No waitlist. **[Verified]** ([blog](https://supabase.com/blog/give-your-supabase-app-its-own-mcp-server))
- **Supabase Compute** (long-running agents and services next to Postgres) was announced Oct 2 and is in **private alpha with a waitlist since Oct 27, in us-west-2 only.** Do not plan around it. **[Verified]** ([blog](https://supabase.com/blog/supabase-compute-private-alpha))
- **Realtime updates in the window:**
  - Postgres Changes gained **AND filters, new operators, and column `select`** (Aug 5).
  - Server code added **Broadcast persistence opt-in (`persist: true`, TTL up to 72h)** on Oct 29, the day this was written. Client support is not in a stable supabase-js release yet.
  - Realtime added Multigres support (Sep 23).

  **[Verified]**
- **Gotcha that lands the day before the hackathon:** from **Oct 30 2026**, new tables in `public` are **no longer exposed to the Data API without an explicit `GRANT`**. This now applies to all existing projects too. **[Verified]** ([changelog](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically))

---

## 2. Dated timeline, Aug 1 to Oct 29 2026

Status is copied from the source. "n/s" means the source states no status.

| Date | Item | Status | Area | Source |
|---|---|---|---|---|
| Aug 1 | "Are Supabase docs agent-friendly?" (blog) | n/a | Docs/AI | blog file `2026-08-01-are-supabase-docs-agent-friendly.mdx` |
| Aug 3 | supabase-js 2.112.0: OpenTelemetry tracing moved to an opt-in `/tracing` subpath | Released | SDK | [GH release](https://github.com/supabase/supabase-js/releases/tag/v2.112.0) |
| **Aug 5** | **Postgres Changes: AND filters, new operators (`like`, `ilike`, `is`, `match`, `imatch`, `isdistinct`, `not.`), column `select`** | "available now" | Realtime | [blog](https://supabase.com/blog/postgres-changes-filters-and-column-selection) |
| Aug 7 | Supabase becomes a connector on Perplexity Computer | n/s | AI | blog file `2026-08-07-...perplexity-computer.mdx` |
| Aug 18 | Client traces linked to logs (W3C Trace Context in supabase-js, Swift, Flutter, Python) | Available | Observability | [blog](https://supabase.com/blog/connect-client-traces-to-your-logs) |
| Aug 20 | Edge Functions per project raised: Pro 500→1,000, Team 1,000→2,000 | Live | Edge Functions | [Threads @supabasecom](https://www.threads.com/@supabasecom/post/DcQ7rVAjNB3), [limits doc](https://supabase.com/docs/guides/functions/limits) |
| Aug 24 | Enterprise-managed auth for the Supabase MCP server (Okta, built with Anthropic) | **GA** (Team/Enterprise) | MCP/Auth | blog file `2026-08-24-enterprise-managed-auth-...mdx` |
| Sep 2 | supabase-js 2.113.0: "allow wait for pg changes" (realtime) | Released | Realtime SDK | [GH release](https://github.com/supabase/supabase-js/releases/tag/v2.113.0) |
| Sep 7 | supabase-js 2.116.0: MFA recovery codes API, Storage bucket lifecycle, object versioning | Released | Auth/Storage | [GH release](https://github.com/supabase/supabase-js/releases/tag/v2.116.0) |
| Sep 9 | Supabase available in Gemini Enterprise | n/s | AI | blog file `2026-09-09-...gemini-enterprise.mdx` |
| Sep 13 | "Observability on Auto-Pilot": prepared agent prompts for monitoring | New Feature | AI/Obs | [changelog](https://supabase.com/changelog) |
| Sep 18 | Health Check Advisors (error rates for Auth, Storage, Edge Functions, Data APIs) | Improvement | Platform | [changelog](https://supabase.com/changelog) |
| Sep 21 | Database "Replication" renamed to **Pipelines** | Improvement | Data | [changelog](https://supabase.com/changelog) |
| Sep 22 | supabase-js 2.117.0: **passkey API enabled by default**; experimental opt-in deprecated | Released | Auth | [GH release](https://github.com/supabase/supabase-js/releases/tag/v2.117.0) |
| Sep 23 | Realtime v2.138.0: Multigres support | Released | Realtime | [GH release](https://github.com/supabase/realtime/releases/tag/v2.138.0) |
| Sep 25 | Logs usage-based pricing announced (grace period through early 2027) | Announced | Billing | [changelog](https://supabase.com/changelog/50925-logs-usage-based-pricing) |
| Sep 28 | Scoped Personal Access Tokens GA (announced at Select Oct 2; changelog Oct 6) | **GA** | Security/MCP | [blog](https://supabase.com/blog/scope-your-personal-access-tokens) |
| Sep 30 | `@supabase/middleware` 1.0.0 (MIT, runs on any fetch runtime) | **Stable 1.0** | Edge Functions | [changelog](https://supabase.com/changelog/supabase-middleware-1-0) |
| Oct 1 | OrioleDB public beta (changelog); Multigres private alpha (changelog) | Beta / Private alpha | Database | [changelog](https://supabase.com/changelog) |
| **Oct 2** | **Supabase Select 2026** (recap + 3 theme posts); Turso acquisition; $150M round | Mixed (see §3) | All | [recap](https://supabase.com/blog/supabase-select-2026-recap) |
| Oct 5 | Go SDK v0.1.0-alpha.1; `@supabase/server` framework adapters deprecated (removed Dec 1) | Public alpha / Deprecation | SDK | [changelog](https://supabase.com/changelog) |
| Oct 7 | Realtime v2.141.0: private-channel authorization through one Postgres function (about 10 DB round trips cut to 1, behind a feature flag) | Released, flagged | Realtime | [PR #2336](https://github.com/supabase/realtime/pull/2336) |
| Oct 9 | .NET SDK officially supported | Official | SDK | [changelog](https://supabase.com/changelog) |
| Oct 12 | Breaking: old TLS 1.2 CBC ciphers disabled on Nov 10 | Scheduled | Platform | [changelog](https://supabase.com/changelog/cbc-tls-ciphers-deprecated) |
| Oct 13 | Declarative Schemas 2.0 (pg-delta) blog; Grok Bot integration blog | Default for new CLI projects | CLI | [blog](https://github.com/supabase/supabase/blob/master/apps/www/_blog/2026-10-13-declarative-schemas-2-0-pg-delta.mdx) |
| Oct 14 | Local Supabase per agent/worktree, native runtime without Docker (CLI v2.119.0) | **Experimental flag** | CLI | [blog](https://supabase.com/blog/local-supabase-project-per-agent-with-or-without-docker) |
| Oct 15 | Stripe Data Pipeline syncs to Supabase Postgres; Middleware blog; faster branch creation | Live | Integrations | [blog](https://supabase.com/blog/supabase-middleware) |
| Oct 20 | Agent prompts plus `query_logs` MCP tool ("Operate with confidence") | "all available now" | MCP/Obs | [blog](https://supabase.com/blog/operate-with-confidence-check-production-with-your-coding-agent) |
| **Oct 22** | **Give your Supabase app its own MCP server** (deep-dive blog) | Available (Library block) | MCP/Auth/Edge | [blog](https://supabase.com/blog/give-your-supabase-app-its-own-mcp-server) |
| Oct 23 | Supabase Knowledge Base (supabase.com/kb) | Public beta | Docs | [changelog](https://supabase.com/changelog) |
| Oct 26 | Realtime v2.148.0: broadcast request outcomes reported over websocket | Released | Realtime | [GH release](https://github.com/supabase/realtime/releases/tag/v2.148.0) |
| **Oct 27** | **Supabase Compute** private alpha opens (us-west-2, waitlist) | **Private alpha** | Compute | [blog](https://supabase.com/blog/supabase-compute-private-alpha) |
| Oct 28 | OrioleDB public beta blog; Make integration blog; Realtime v2.149.0 (application-side RLS evaluation experiment) | Beta / Released | DB / Realtime | [blog index](https://supabase.com/blog) |
| **Oct 29** | Multigres private alpha blog; **Realtime v2.150.0: Broadcast persistence opt-in** (PR merged 15:29 UTC; patch v2.150.1 tagged Oct 30 00:09 UTC); Supabase CLI v3.0.0 betas begin | Private alpha / server released / CLI pre-release | DB / Realtime / CLI | [blog](https://supabase.com/blog/multigres-private-alpha), [PR #2235](https://github.com/supabase/realtime/pull/2235), [CLI releases](https://github.com/supabase/cli/releases) |
| **Oct 30** | **Data API GRANT requirement enforced on all existing projects** | Breaking (scheduled) | Data API | [changelog](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically) |

Note on completeness: the rendered supabase.com/blog index skipped the Aug 1 and Aug 5 posts. I built this table from the blog source directory (`apps/www/_blog/2026-08*` through `2026-10*`), which lists 27 posts in the window. No Developer Update posts for Aug, Sep, or Oct showed up on the changelog. The last one I saw is July 9. **[Verified]**

---

## 3. Status matrix: what you can use on Oct 31 and what you can't

### GA, stable, or "available now" (safe to build on)

| Feature | What it is | Notes for the hackathon |
|---|---|---|
| **App MCP server block** | `npx shadcn@latest add https://supabase.com/library/r/mcp.json` copies an Edge Function to `supabase/functions/mcp`. It includes the MCP handler, auth middleware, and a `whoami` tool. Built on the official MCP TS SDK, `@supabase/server@1`, and `@supabase/middleware`. | Needs **asymmetric JWT signing keys**, the **OAuth 2.1 server** turned on, **dynamic client registration**, the OAuth Consent block in your frontend, and `verify_jwt = false` for `[functions.mcp]`. MCP Apps (UI shown inside ChatGPT) also works. ([blog](https://supabase.com/blog/give-your-supabase-app-its-own-mcp-server)) |
| **Headless App block** | Template for a backend where an agent is the main interface: browser sign-in and consent, example task tools, RLS-protected DB. | [Library docs](https://supabase.com/library/docs/tanstack/headless-app) |
| **`@supabase/middleware` 1.0** | Typed `pipeline([...], handler)` and `defineMiddleware`. The engine ships only **`withCors` and `withFeatureFlag`**. The Supabase helpers (`withSupabase`, `withClaims`, `withRequiredClaims`, `withSupabaseClient`, `withSupabaseAdminClient`, `withPostgresClient`, `withPostgresAdminClient`, `withOAuthProtectedResource`) are in **`@supabase/server`**, "stable as of `@supabase/server` 1.9.0" (npm `latest` is 1.9.2 on Oct 29). | Runs on Edge Functions, Vercel, Cloudflare Workers, Deno, Bun, and Node 22+. ([changelog](https://supabase.com/changelog/supabase-middleware-1-0)) |
| **Postgres Changes filters and `select`** | Server-side AND filters, regex/like/is operators, `postgresChangesFilter()` builder, and per-subscription column selection. Only AND is supported, not OR. | Column `select` needs supabase-js **≥2.109.0**. DELETE events carry only the primary key. Supabase says filtering cuts billed messages and egress. ([blog](https://supabase.com/blog/postgres-changes-filters-and-column-selection)) |
| **Scoped PATs** | Tokens limited to an org, project, or specific permissions across the Management API, MCP, and CLI. GA Sep 28; scoped tokens start with `sbp_fc`; scope is fixed at creation. | Use one when connecting your coding agent to the Supabase MCP server. Supabase warns the **"Read-only" preset includes secrets like API keys**; it suggests starting from "No access" and toggling Database to read. ([blog](https://supabase.com/blog/scope-your-personal-access-tokens)) |
| **Supabase MCP: `query_logs`, elicitations, read-only mode** | `query_logs` runs read-only SQL over logs, up to 24h per request. Elicitations ask for confirmation before creating paid projects or branches and before SQL that could delete data. Supabase notes "it's not a guarantee" and that "your agent client must support elicitations for the prompt to appear." | ([Oct 20 blog](https://supabase.com/blog/operate-with-confidence-check-production-with-your-coding-agent), [recap](https://supabase.com/blog/supabase-select-2026-recap)) |
| **Declarative Schemas 2.0** | Schema lives in `supabase/schemas/*.sql`. `pg-delta` generates migrations, now including RLS, grants, and partitions. Default for new `supabase init`. | Helpful for agent-written schema. It also writes the GRANTs you now need. |
| Health Check Advisors, Database Connections page | Dashboard operations tools. | Low demo value. |
| Stripe Data Pipeline → Supabase | Stripe Dashboard syncs into a `stripe_sdp` schema using short-lived JWT DB credentials. | Not relevant unless you take payments. |
| Passkeys | supabase-js 2.117.0 turned the passkey API on by default (Sep 22). The May 28 changelog called the feature Beta. | Current status is unclear: client API default-on, product label last seen as Beta. |

### Beta, alpha, or experimental (usable, with caveats)

| Feature | Status | Caveat |
|---|---|---|
| Local per-worktree stack plus native runtime (no Docker) | Experimental (CLI v2.119.0+, `SUPABASE_EXPERIMENTAL_STACK=1` or `[experimental] stack = true`) | Flags and output may change. Linux glibc 2.35+ or macOS 14+ on Apple silicon. ([blog](https://supabase.com/blog/local-supabase-project-per-agent-with-or-without-docker)) |
| OrioleDB | Public beta, chosen at project creation | No benefit in a 5-hour demo. |
| Supabase Pipelines (BigQuery, ClickHouse, DuckLake, Snowflake) | Public alpha, paid plans | Not relevant. |
| Explorer and Notebooks | Feature preview (rollout through Oct 12) | Not relevant. |
| Broadcast Replay | Public alpha [Background, 2025] | Private channels only; needs Broadcast-from-Database messages; 3-day retention. ([blog](https://supabase.com/blog/realtime-broadcast-replay)) |
| **Broadcast persistence opt-in** | **Server merged Oct 29 (Realtime v2.150.0).** `channel.send({..., persist: true})` or `persist: { ttl: 3600 }`, with TTL 1 to 259,200 s (72h). | **I found no stable supabase-js release with the `persist` option.** The latest stable is 2.118.0 (Oct 15); 2.119.0 is canary. It may not be rolled out to hosted projects yet. Treat it as unavailable unless you test it Friday. ([PR #2235](https://github.com/supabase/realtime/pull/2235)) |
| Go SDK | Public alpha | Only token verification and RLS-scoped queries. |

### Private alpha or announced only (do NOT plan around these)

| Feature | Status | Why not |
|---|---|---|
| **Supabase Compute** | Private alpha (Oct 27), waitlist, us-west-2 only | "For evaluation, not production." Services can restart at any time. No autoscaling, GPU, or persistent disk. Agent sandboxes are **not** in the alpha. Needs CLI v2.120.0+ and `compute = true`. Access by waitlist is unlikely to arrive by Saturday. ([blog](https://supabase.com/blog/supabase-compute-private-alpha)) |
| **Multigres** (HA, failover, pooling) | Private alpha, by invite, paid orgs | Invite only. You can *mention* it in a "scale to millions" pitch, but you can't demo it. ([blog](https://supabase.com/blog/multigres-private-alpha)) |
| Turso / per-agent SQLite databases | Acquisition announced; "deeper integrations" promised | No product exists inside Supabase yet. ([blog](https://supabase.com/blog/supabase-is-acquiring-turso)) |
| dbarena | Benchmarks site | Useful for pitch slides only. |

---

## 4. Detail on the features most relevant to a "Real-Time AI" build

### 4.1 Your app's MCP server (Oct 2 announcement, Oct 22 deep dive)
- Supabase describes it as separate from the official Supabase MCP server: it lets *your users'* agents act inside *your* app. **[Verified]** ([Build anything source](https://github.com/supabase/supabase/blob/master/apps/www/_blog/2026-10-02-select-2026-build-anything.mdx))
- The auth chain is `pipeline([withOAuthProtectedResource(), withSupabase({ auth: 'user' })], handleMcp)`. Tools get a `supabase` client scoped to the user, and RLS decides which rows a tool can reach. There is no service role key in tools. **[Verified]**
- The Select demo app was "Sizzle," shown in Greg Richardson's talk. Tools generated video ads, and MCP Apps rendered React UI inside ChatGPT. **[Verified]**
- The "Get started" section in the Build-anything post gives a second install path: `npx shadcn@latest add @supabase/mcp-server`, after `supabase pull`. **[Verified]**

### 4.2 Realtime changes (Aug to Oct)
- **Aug 5**: Postgres Changes filters and `select`. See the table above. **[Verified]**
- **Sep 2**: supabase-js 2.113.0 "allow wait for pg changes". I did not dig into what this does. **[Verified title only]**
- **Oct 7 to 29, server releases**:
  - private-channel authorization through one Postgres function, behind a flag (v2.141.0)
  - presence track latency metrics (v2.142 to 2.145)
  - broadcast request outcomes over websocket (v2.148.0)
  - application-side RLS evaluation experiment (v2.149.0)
  - **Broadcast persistence opt-in** (v2.150.0)

  Most of these are infrastructure or telemetry work. They show the Realtime team is focused on **auth performance and Broadcast durability at scale**. **[Verified releases; Inference on focus]** ([releases](https://github.com/supabase/realtime/releases))
- **[Background]**:
  - Binary Broadcast payloads (Jun 11 2026)
  - `realtime` schema locked against modification (Jul 14 2026); RLS on `realtime.messages` still works
  - Broadcast/Presence authorization through RLS on `realtime.messages`, with `private: true` channels
  - Broadcast from Database (`realtime.send`, `realtime.broadcast_changes`)

  ([changelog](https://supabase.com/changelog), [Broadcast docs](https://supabase.com/docs/guides/realtime/broadcast))
- The docs warn against calling Presence `track()` at high frequency, for example on cursor moves. Use Broadcast for that. **[Verified]** ([Presence docs](https://supabase.com/docs/guides/realtime/presence))

### 4.3 Edge Functions, Queues, Cron, vectors
- No new launch for Queues, Cron, pgvector, or Vector Buckets appeared in the Aug to Oct window. The only Edge Functions news was the limit increase (Aug 20), Middleware 1.0, and the MCP block. **[Verified by absence across the changelog and blog source list; may be incomplete]**
- The Edge Functions limits doc currently says: wall clock **150s Free / 400s paid**, **2s CPU per request**, 256MB memory, 150s request idle timeout. This 400s ceiling is the reason Supabase gives for building Compute. **[Verified]** ([limits](https://supabase.com/docs/guides/functions/limits), [Compute blog](https://supabase.com/blog/supabase-compute-private-alpha))
- **[Background]**:
  - Vector Buckets: S3-backed, public alpha for Pro+, up to 50M vectors per index
  - Queues: pgmq
  - Cron: pg_cron
  - the "automatic embeddings" pattern combining pgvector, pgmq, pg_net, and pg_cron

  ([Vector Buckets](https://supabase.com/blog/vector-buckets), [automatic embeddings](https://supabase.com/docs/guides/ai/automatic-embeddings))

### 4.4 Scale story ("most likely to scale to millions")
- Select's "Scale without limits" pillar: Multigres (private alpha), OrioleDB (public beta, up to 1.8x throughput vs heap on Supabase's own TPC-C-derived benchmark on dbarena), and dbarena. **[Verified]** ([blog](https://supabase.com/blog/scale-without-limits))
- The recap's framing line is "from day one to millions of users" and "the same Postgres carries it from prototype to petabyte." **[Verified]** ([recap](https://supabase.com/blog/supabase-select-2026-recap))
- Postgres Changes filters and `select` are presented as ways to cut per-subscriber messages and egress. Broadcast from Database is presented as scaling to "tens of thousands of connected users." **[Verified; the latter is Background]**

---

## 5. What Supabase most wants showcased (inference)

Ranked by how much launch effort and follow-up content each feature got in the window. This is my reading; Supabase has not said it.

1. **Agents as first-class users of your app: the app MCP server, OAuth 2.1 server, and RLS.** It got a Select pillar, a dedicated deep-dive post 20 days later, a Library block, a Headless App template, and a live demo. It is GA-usable today. **Strongest fit.**
2. **"Agentic infrastructure" overall.** Supporting signals: the Turso deal is about per-agent databases, Compute is about agents running next to the data, and the CLI now gives each worktree its own stack. A demo where agents create and use Supabase resources matches the company's story. **[Inference]**
3. **Code-first backend driven by a coding agent**: Declarative Schemas 2.0, `supabase pull`/`config pull`, the Supabase MCP server with scoped PATs, and `query_logs`. Developers are clearly the audience, but this is hard to make visible in a 3-minute demo.
4. **Realtime at scale.** The team is shipping Broadcast persistence and auth performance work right now. A multiplayer, private-channel, RLS-authorized Realtime demo fits the event's "Real-Time AI" theme and the Supabase prize. **[Inference]**
5. Compute and Multigres are where Supabase is heading, but you can't access them. Mention them on a "path to millions" slide; do not demo them.

---

## 6. Limits / could not verify

- I found **no Supabase-specific judging criteria** for this event beyond the prize line. *(Corrected 2026-10-29: an earlier draft said EVENT_PAGE.md does not mention the $1k prize. It does: "The project deemed the 'most likely to scale to millions' will receive $1K in credits from Supabase," along with $25 Supabase credits per attendee, "equivalent to 1 free month of Pro plan.")* Whether a Supabase representative judges that prize is not stated.
- **Broadcast `persist`**: the server is merged and released, but I could not confirm hosted rollout or a stable client release. Test it before relying on it.
- The supabase-js 2.113.0 "wait for pg changes" behavior was not investigated.
- **Passkeys status**: the label was Beta in May. The client turned it on by default Sep 22. I did not find a GA announcement.
- The Build-anything and Compute pages could not be fetched through Exa (CRAWL_NOT_FOUND). I read the GitHub `.mdx` source and the `/blog/supabase-compute-private-alpha` URL instead. The marketing page at supabase.com/compute describes broader features (sandboxes, firewalls, cloaked secrets, autoscaling) than the alpha blog post says are included. **Trust the blog's alpha limits.**
- *(Resolved in the fact-check: the 70% figure is in the press release text itself.)*
- Hosted rollout timing for Realtime server releases (v2.150.x) is not published anywhere I found. GitHub release dates do not prove that hosted projects run that version.
- No social sentiment was gathered; another angle covers that.

---

## 7. Hackathon implications

**What to build (Supabase angle, combined with Durable Actors and/or Agent Relay):**
- **Use the app MCP server block as the agent-facing doorway.** For example, a haunted multiplayer game or "séance room" where each player's own ChatGPT or Claude connects through MCP. Tool calls run as that user under RLS. Durable Actors hold per-room state, and Agent Relay carries agent-to-agent chatter. State changes fan out to browsers over **private Realtime Broadcast channels** authorized by RLS on `realtime.messages`. This touches the newest GA Supabase feature, Realtime, and Auth at once.
- **Make the scale story concrete for the $1k prize.** Show:
  - Broadcast from Database (`realtime.send` in a trigger) instead of Postgres Changes for fan-out
  - Postgres Changes with AND filters and `select` where you do use it
  - RLS-scoped tokens with no service role in user paths
  - a slide covering Multigres and OrioleDB as the path to HA and update-heavy scale. Label them "private alpha / beta, not demoed."
- Use Edge Functions for short tool calls. Keep anything longer than 400s or CPU-heavy elsewhere, such as a Durable Actor, Superserve, or Freestyle. **Compute is not available.**

**Gotchas:**
- **Oct 30 GRANT change.** On any project, new `public` tables need explicit `grant select/insert/... on table ... to authenticated` (and `anon` / `service_role` if needed) or the Data API will not see them. Tables that already exist keep their grants. A missing grant returns PostgREST error `42501` "permission denied for table …" with a `hint` containing the exact `GRANT`, so if your agent writes the schema, have it read that hint. Direct Postgres connections are unaffected. Supabase's recommended unit is grant, then `enable row level security`, then policies. Declarative Schemas 2.0 / pg-delta captures grants. Put the grants in your first migration. ([changelog](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically); no postponement found as of Oct 29)
- **Mastra (a sponsor) is a named Turso customer.** Both the press release and the Turso post list Mastra among the companies using per-agent databases. A Mastra-agent + Supabase story fits both sponsors' narrative. **[Verified fact; Inference on judging value]**
- Edge Functions rewrite `GET` responses of `text/html` to `text/plain` unless you use a custom domain ([limits](https://supabase.com/docs/guides/functions/limits)). Don't plan to serve your demo frontend from an Edge Function. MCP Apps UI is unaffected because it is sent inside the tool result.
- The MCP block needs **asymmetric signing keys**, the **OAuth 2.1 server**, **dynamic client registration**, a consent page (OAuth Consent block), the Auth **Site URL** pointing to the consent host, and `verify_jwt = false` on the MCP function. Expect 30 to 60 minutes the first time, so do it before Saturday.
- The `anon`/`service_role` keys are deprecated by end of 2026. Use `sb_publishable_…` / `sb_secret_…` keys ([Broadcast docs](https://supabase.com/docs/guides/realtime/broadcast)).
- Presence `track()` is for slow-changing state. Use Broadcast for cursors and streaming tokens.
- Edge Functions: 2s CPU and 400s wall clock (paid). Free tier is 150s. The $25 credit buys roughly one Pro month per the event page, so upgrade to Pro for the 400s limit.

**Setup to do before Oct 31 (thinking and setup are allowed; code must be written at the event):**
1. Create a Pro project with the credit. Pick **us-west-2** in case Compute access appears.
2. Update the CLI to the latest **stable v2.122.0** (Oct 23; npm `latest`) and supabase-js to 2.118.0 (latest stable; 2.119.0 is canary only). **Do not install the CLI v3.0.0 betas**, which started shipping Oct 29 (`3.0.0-beta.15` on npm `beta` as of Oct 30 UTC). A major-version beta the night before is a risk.
3. Turn on asymmetric JWT keys, the OAuth 2.1 server, and dynamic client registration. Generate publishable and secret keys.
4. Connect the Supabase MCP server to your coding agent with a **scoped PAT**, `project_ref`, and `read_only=true` for inspection. Use a write-scoped token only on the hackathon project.
5. Read the MCP block docs and the Realtime authorization docs. Optionally test Broadcast `persist: true` over REST (`?persist=true`) on a throwaway project.
6. Join the Compute waitlist anyway (free), but don't depend on it.

**What judges and sponsors likely want (inference):** Supabase is selling "agentic infrastructure" and "prototype to millions." A project where *agents are users*, connecting over MCP with RLS-enforced identity, coordinating in real time, with an honest scaling story, matches that pitch closely.

---

## Sources

- Supabase Changelog: https://supabase.com/changelog
- Data API GRANT breaking change: https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically
- Supabase Middleware 1.0 changelog: https://supabase.com/changelog/supabase-middleware-1-0
- Logs usage-based pricing: https://supabase.com/changelog/50925-logs-usage-based-pricing
- TLS cipher deprecation: https://supabase.com/changelog/cbc-tls-ciphers-deprecated
- Blog index: https://supabase.com/blog
- Blog source directory (exact dates): https://github.com/supabase/supabase/tree/master/apps/www/_blog
- Supabase Select 2026 Recap (Oct 2): https://supabase.com/blog/supabase-select-2026-recap
- Build anything (Oct 2, source): https://github.com/supabase/supabase/blob/master/apps/www/_blog/2026-10-02-select-2026-build-anything.mdx
- Scale without limits (Oct 2): https://supabase.com/blog/scale-without-limits
- Supabase is acquiring Turso (Oct 2): https://supabase.com/blog/supabase-is-acquiring-turso
- Press release, $150M and Turso (Oct 2): https://www.prnewswire.com/news-releases/supabase-announces-150m-in-new-funding-and-turso-acquisition-302896752.html
- Layerbase analysis of Turso deal: https://layerbase.com/blog/supabase-acquires-turso
- Declarative Schemas 2.0 (Oct 13, source): https://github.com/supabase/supabase/blob/master/apps/www/_blog/2026-10-13-declarative-schemas-2-0-pg-delta.mdx
- Local project per agent (Oct 14): https://supabase.com/blog/local-supabase-project-per-agent-with-or-without-docker
- Supabase Middleware (Oct 15): https://supabase.com/blog/supabase-middleware
- Stripe Data Pipeline (Oct 15, source): https://github.com/supabase/supabase/blob/master/apps/www/_blog/2026-10-15-stripe-data-pipeline-now-syncs-real-time-data-to-supabase.mdx
- Operate with confidence / agent prompts (Oct 20): https://supabase.com/blog/operate-with-confidence-check-production-with-your-coding-agent
- Give your Supabase app its own MCP server (Oct 22): https://supabase.com/blog/give-your-supabase-app-its-own-mcp-server
- Scope your PATs (Oct 26): https://supabase.com/blog/scope-your-personal-access-tokens
- Supabase Compute private alpha (Oct 27): https://supabase.com/blog/supabase-compute-private-alpha
- Compute marketing page: https://supabase.com/compute
- Dreambase on Compute (third party): https://dreambase.com/blog/running-our-data-pipeline-on-supabase-compute
- Multigres private alpha (Oct 29): https://supabase.com/blog/multigres-private-alpha
- Postgres Changes filters and column selection (Aug 5): https://supabase.com/blog/postgres-changes-filters-and-column-selection
- supabase-js PR #2463 (filters/select): https://github.com/supabase/supabase-js/pull/2463
- Connect client traces to your logs (Aug 18): https://supabase.com/blog/connect-client-traces-to-your-logs
- Enterprise-managed auth for MCP (Aug 24, source): https://github.com/supabase/supabase/blob/master/apps/www/_blog/2026-08-24-enterprise-managed-auth-for-the-supabase-mcp-server.mdx
- Edge Functions limit increase (Aug 20): https://www.threads.com/@supabasecom/post/DcQ7rVAjNB3
- Edge Functions limits doc: https://supabase.com/docs/guides/functions/limits
- Realtime releases: https://github.com/supabase/realtime/releases
- Realtime PR #2235 (Broadcast persistence opt-in): https://github.com/supabase/realtime/pull/2235
- Realtime PR #2336 (authorize via Postgres function): https://github.com/supabase/realtime/pull/2336
- supabase-js releases: https://github.com/supabase/supabase-js/releases
- Broadcast docs: https://supabase.com/docs/guides/realtime/broadcast
- Presence docs: https://supabase.com/docs/guides/realtime/presence
- Broadcast Replay [Background]: https://supabase.com/blog/realtime-broadcast-replay
- Vector Buckets [Background]: https://supabase.com/blog/vector-buckets
- Automatic embeddings [Background]: https://supabase.com/docs/guides/ai/automatic-embeddings
- Third-party release aggregator (corroboration): https://releases.fru.dev/companies/supabase/2026-10
- Supabase CLI releases (v2.122.0 stable, v3.0.0 betas): https://github.com/supabase/cli/releases
- Scoped PATs GA changelog (Oct 6): https://supabase.com/changelog/scoped-personal-access-tokens-ga
- Event page (local): /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md

---

## Verification log (2026-10-29)

Adversarial re-check of the claims that matter most for decisions. I tried to refute each one against live primary sources (gh CLI against GitHub, Exa fetch of supabase.com and PR Newswire, npm registry).

| # | Claim | Method | Outcome |
|---|---|---|---|
| 1 | Data API GRANT requirement is enforced on all existing projects on **Oct 30 2026** | Fetched changelog 45329; web search for a postponement | **Confirmed.** Added: existing tables keep their grants, the `42501` + hint error, and that direct connections are unaffected. No postponement found. |
| 2 | Oct 2: $150M led by GIC, Turso acquisition, "leader in agentic infrastructure" | Fetched PR Newswire release | **Confirmed.** Added co-investors and the "four months after $500M Series F" line. |
| 3 | "70% of new databases created by agents" (was marked unconfirmed, sourced to Layerbase) | Read the press release text directly | **Confirmed in primary source.** Upgraded; the Layerbase dependency is no longer needed. |
| 4 | Turso post: "over one million databases per week" | Fetched blog | **Confirmed.** Also found that Mastra (a hackathon sponsor) is a named Turso customer, and added it. |
| 5 | Select "replaced the usual Launch Week format" | Grepped the recap, Build-anything, and Operate posts; listed blog dir for launch-week posts | **Not supported by any source.** Relabeled **[Inference]**. |
| 6 | App MCP server block: install command, `verify_jwt = false`, asymmetric keys, OAuth 2.1, DCR, consent block, Sizzle/Greg Richardson | Fetched Oct 22 blog; grepped the Build-anything `.mdx` | **Confirmed**, including the second install path `npx shadcn@latest add @supabase/mcp-server`. |
| 7 | `@supabase/middleware` 1.0 includes `withRequiredClaims`, `withSupabaseClient`, `withPostgresClient`, `withOAuthProtectedResource` | Fetched middleware changelog | **Wrong. Fixed.** The engine ships only `withCors` and `withFeatureFlag`; the rest are in `@supabase/server` (stable as of 1.9.0). Date Sep 30 and runtimes are confirmed. |
| 8 | Supabase Compute: private alpha Oct 27, us-west-2, waitlist, CLI v2.120.0+, `compute = true`, no autoscaling/GPU/disk, sandboxes excluded | Fetched blog | **Confirmed.** |
| 9 | Broadcast persistence opt-in in Realtime v2.150.0 on Oct 29; TTL 1 to 259,200 s; `persist: true` / `?persist=true` | `gh pr view 2235`, `gh release view v2.150.0` | **Confirmed** (merged 2026-10-29T15:29Z). Hosted rollout is still **(unverified)**. |
| 10 | supabase-js latest stable is 2.118.0 (Oct 15) and 2.119.0 is canary; 2.117.0 enabled the passkey API by default (Sep 22) | `gh release list/view` | **Confirmed.** |
| 11 | Realtime v2.138.0 Multigres (Sep 23), v2.141.0 Postgres-function auth (Oct 7), v2.148.0 (Oct 26), v2.149.0 (Oct 28) | `gh release view` | **Confirmed.** "About 10 DB round trips cut to 1, behind a feature flag" was not re-checked against the PR body: **(unverified detail)**. |
| 12 | Postgres Changes Aug 5: operators, AND only, `select` needs supabase-js ≥2.109.0, DELETE carries PK only | Grepped blog `.mdx` | **Confirmed.** |
| 13 | Edge Functions limits: 150s/400s wall clock, 2s CPU, 256MB, 150s idle; Pro 1,000 / Team 2,000 functions (Aug 20 Threads post) | Fetched limits doc and Threads post | **Confirmed.** Added the gotcha that `text/html` is rewritten to `text/plain` without a custom domain. |
| 14 | Scoped PATs GA Sep 28, announced Oct 2, changelog Oct 6, blog Oct 26 | Fetched blog and changelog; blog filename | **Confirmed.** Added the warning that the "Read-only" preset includes secrets, and the `sbp_fc` prefix. |
| 15 | `query_logs` up to 24h per request; elicitations | Grepped Oct 20 and Operate `.mdx` | **Confirmed.** Added the caveat that elicitations need client support and are "not a guarantee." |
| 16 | 27 blog posts in the Aug to Oct window | `gh api` on `apps/www/_blog` | **Confirmed** (27 files dated 2026-08-01 to 2026-10-29). |
| 17 | EVENT_PAGE.md does not mention the $1k Supabase prize | Grepped the event page | **Wrong. Fixed.** Line 86 states the $1K "most likely to scale to millions" prize. |
| 18 | Setup advice "CLI v2.120+" | `gh release list -R supabase/cli`, `npm view supabase dist-tags` | **Refined.** Stable is v2.122.0 (Oct 23). v3.0.0 betas appeared Oct 29; added advice to avoid them. |
| 19 | `anon`/`service_role` keys deprecated by end of 2026 | curl of the Broadcast docs page | **Confirmed** (deprecation banner text). |

Not re-checked (left as originally sourced): the Aug 7 Perplexity, Aug 24 Okta enterprise auth, and Sep 9 Gemini Enterprise posts (filenames confirmed, contents not re-read); the OrioleDB "1.8x" figure (confirmed in the Scale `.mdx`, but the benchmark itself was not inspected); Logs pricing and TLS deprecation dates (confirmed in the changelog listing); and the Dreambase 2.9 ms vs 65 ms figure (it appears in the Compute blog).
