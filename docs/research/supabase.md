# Supabase: master brief for Haunted Hacks (Sat 31 Oct 2026)

> Consolidated **2026-10-29 (Pacific)** from five sub-files, each with its own adversarial verification log. While consolidating I re-checked the contested and time-sensitive points live (`gh`/`npm` versions, the peak-connection billing example, the GRANT changelog, the regions page). Those are marked **[re-checked]**.
> Labels: **[V]** = verified in a primary source. **[I]** = inference. **[S]** = secondary or single source. **[BG]** = before Aug 2026. **[vendor]** = Supabase's own number.

**Sub-files:**
- [01-docs-api](supabase/01-docs-api.md): quotas, limits, API surface, CLI, copy-paste setup
- [02-newest-features](supabase/02-newest-features.md): Aug–Oct timeline and GA/beta/alpha matrix
- [03-github-code](supabase/03-github-code.md): releases, open bugs, examples
- [04-social-pulse](supabase/04-social-pulse.md): HN, X, YouTube, blogs, sentiment
- [05-team-strategy](supabase/05-team-strategy.md): founders, funding, competitors, judge taste

---

## Executive summary

1. **What Supabase gives the event:**
   - $25 credits per attendee ("equivalent to 1 free month of Pro plan")
   - **$1K credits for "most likely to scale to millions"** (EVENT_PAGE.md lines 14 and 86) [V]

   No Supabase judge or rubric has been published ("Judges will be announced soon") [V]. The prize name is Supabase's own tagline: "Build in a weekend. Scale to millions." appears on supabase.com and on its YC page [V]. Supabase sponsored an award with the same name at a YC HQ hackathon in Feb 2026 [S][BG].
2. **The company's story is "agentic infrastructure, prototype to petabyte."** At Select (2 Oct) Supabase announced:
   - $150M led by GIC, with CapitalG, IronArc and SquarePeg
   - that it is acquiring Turso
   - "1M users and 4M databases per month with 70% of new databases created by agents or AI-driven tools" [V][vendor]

   Its roadmap scales *down* (Turso-based "Spark", a database per agent) and *up* (OrioleDB, Multigres), with Compute running next to the data.
3. **Realtime Broadcast is what matters for "Real-Time AI."** The docs call Broadcast "the recommended method for scalability and security" and say Postgres Changes "does not scale as well" [V]. The scale pattern: Postgres as the system of record → `realtime.broadcast_changes()` / `realtime.send()` triggers → **private** channels gated by RLS on `realtime.messages`. Realtime was Supabase's first product.
4. **The binding constraint is plan limits.** Pro (covered by the credit) allows 500 concurrent connections and 500 msg/s. With the spend cap off, Pro allows 10,000 and 2,500 msg/s [V]. A 2,000-socket burst costs about **$20** in overage [re-checked].
5. **The platform is moving this week:**
   - Realtime cut 144 releases between Aug 1 and Oct 29.
   - CLI v3 betas started 29 Oct.
   - **The Data API GRANT requirement is enforced on all projects on 30 Oct.**

   Pin versions, and put GRANTs in migration #1 [V, re-checked].
6. **Newest usable feature: "your app's own MCP server"** (22 Oct). External agents connect through Supabase Auth OAuth 2.1, and every tool call runs as that user under RLS [V]. **Do not plan around:** Compute (private alpha, waitlist), Multigres (invite-only, no Realtime), Spark (no product yet), or Broadcast `persist` (server merged 29 Oct, no stable client support) [V].
7. **Sentiment:** Supabase is the ambient "default stack". The top complaint is the security of AI-built apps (TechCrunch/UpGuard, 25 Sep: ~16,000 exposed databases). Realtime chatter is small but technical [V].

> ### What matters for Haunted Hacks
> - **Role:** Terse actors (hot per-room/agent state) plus Agent Relay (agent bus) are the headline for the host judges. **Supabase is the durable record and fan-out spine**: actors write rows, triggers broadcast to private channels, and many browsers watch. This mirrors Supabase's own "database per agent, graduate to Postgres" thesis [I].
> - **Servers never subscribe in order to send.** Use `channel.httpSend()` or the REST broadcast endpoint. A subscribed server counts as a peak connection and is billed as a recipient of every message [V].
> - **Migration #1 = GRANT + RLS + policies.** A missing grant gives PostgREST `42501` with the exact GRANT in its hint [V].
> - **Pin** CLI `2.122.0` and `@supabase/supabase-js@2.118.0`. Avoid CLI `3.0.0-beta.*` and supabase-js `next` (`3.0.0-next.29`) [re-checked].
> - **Spend cap ON** unless you will exceed 500 sockets. If you turn it off for a load demo, budget about $20, then turn it back on.
> - **Pitch:** "Build in a weekend. Scale to millions." Then Broadcast-first design, RLS-gated private channels, a live latency or connection counter, and the vendor benchmark labelled as vendor.
> - **Event rule:** "All code must be created at the hackathon" (line 60). Prepare accounts, settings and notes, not committed code.

---

## 1. Key facts

### 1.1 Credit and billing [V, 01]
- **Cost:** Pro $25 + Micro compute $10 − $10 included compute credit = **$25/mo for one project**. Each extra project adds about $10.
- **How credits apply:** they are spent "before charging your payment method". The plan fee is charged upfront, usage in arrears.
- **Redemption:** `supabase.com/redeem?code=…` redirects (307) to `/dashboard/redeem`, which returns 200, so the flow is live. **Unverified:** whether sponsor codes use it, and whether a card is needed to upgrade.
- **Spend cap** (Pro, on by default):
  - covers Realtime messages and peak connections, egress, MAU, Edge invocations
  - does **not** cover compute, branching, replicas, IPv4 or PITR
  - over quota, further usage is "disallowed until the next billing cycle"

### 1.2 Realtime limits [V, docs `realtime/limits`; confirmed in 01/03/04/05]

| | Free | Pro | Pro, cap off |
|---|---|---|---|
| Concurrent connections | 200 | 500 | 10,000 |
| Messages/s | 100 | 500 | 2,500 |
| Channel joins/s | 100 | 500 | 2,500 |
| Presence msgs/s | 20 | 50 | 1,000 |
| Broadcast payload | 256 KB | 3,000 KB | 3,000 KB |
| Included per month | 2M msgs / 200 peak | 5M / 500 | $2.50 per 1M msgs, $10 per 1k peak conns (whole packages) |

All plans:
- 100 channels per connection
- **5 Presence calls per client per 30 s**
- Postgres Changes payload 1,024 KB (beyond that, only fields ≤64 bytes are sent)
- Replay: 72 h retention, 25 msgs per request

Error codes: `too_many_connections`, `too_many_channels`, `too_many_joins`, `tenant_events`. Billing counts a Broadcast as 1 send plus 1 per recipient [V].

### 1.3 Other limits [V, 01/03]
- **Edge Functions:**
  - 256 MB memory; **2 s CPU**; wall clock **150 s Free / 400 s paid**; 150 s idle timeout, then 504
  - bundle 20 MB via CLI, but **5 MB via the API fallback**, which also can't ship static files
  - 1,000 functions on Pro
  - ports 25/587 blocked; no sharp/libvips
  - **`text/html` is rewritten to `text/plain` without a custom domain**
- **Auth:** built-in email **2/hour per project**; anonymous sign-ins 30/h per IP.
- **Cron:**
  - "we recommend" no more than 8 concurrent jobs of 10 min or less (advice, not a cap)
  - sub-minute schedules need PG 15.1.1.61+
  - `cron.job_run_details` is never auto-cleaned
- **Queues:** pgmq needs PG 15.6.1.143+. Names are lowercase. It is pull-only.

### 1.4 Versions [re-checked via `gh` and `npm`, 30 Oct 06:17 UTC]

| Package | Pin | Avoid |
|---|---|---|
| Supabase CLI | **2.122.0** (npm `latest`, GH `releases/latest`, 23 Oct) | `3.0.0-beta.1…15` (29–30 Oct UTC), `3.0.0-next.27`. v3 makes the **local stack the default target** (PR #7186) |
| supabase-js | **2.118.0** (15 Oct) | `2.119.0-canary.4`; `next` = `3.0.0-next.29` |
| `@supabase/server` | 1.9.2 (`npm:@supabase/server@1`) | Hono/H3/Elysia/NestJS adapters (deprecated 5 Oct, removal 1 Dec) |
| MCP server | 0.15.0 (29 Oct), or hosted `mcp.supabase.com/mcp` | — |
| Realtime (hosted) | v2.150.1 (30 Oct 00:09 UTC) | — |

### 1.5 Benchmarks to quote, labelled as vendor numbers [V, docs `realtime/benchmarks`]

| Scenario | Users | Throughput | Latency |
|---|---|---|---|
| WS Broadcast, large | 250,000 | >800,000 msgs/s | 58 ms median, 508 ms p99 |
| WS Broadcast, small | 32,000 | 224,000 msgs/s | 6 ms median |
| **DB-triggered `broadcast_changes`** | 80,000 | 10,000 msgs/s | 46 ms median |

If you fan out from triggers, quote the third row. Community measurements:
- about 111 ms for Broadcast vs 497–1,265 ms for the DB → Postgres Changes → browser path [S, dev.to 23 Oct]
- a cited guidance to move to Broadcast above roughly 3,000 subscribers [S, axonbuild]

---

## 2. Newest features, Aug–Oct 2026

| Date | Item | Status | Use Oct 31? |
|---|---|---|---|
| Aug 5 | Postgres Changes AND filters, operators, column `select` (supabase-js ≥2.109.0) | Available | If using PG Changes |
| Aug 26–27 | PG Changes `wait: true` fixes the "SUBSCRIBED but no events yet" race (realtime #2109, js #2630) | Released | Yes |
| Aug 31 | Broadcast persistence behind the `broadcast_persistence` flag (#2022) | Flagged | No |
| Sep 22 | supabase-js 2.117.0: passkey API on by default | No GA post | Optional |
| Sep 28 / Oct 6 | **Scoped PATs** GA (blog GA Sep 28; changelog Oct 6) | GA | Yes (coding agent) |
| Sep 30 | `@supabase/middleware` 1.0 (engine has only `withCors`/`withFeatureFlag`; helpers are in `@supabase/server` ≥1.9.0) | Stable | Yes |
| Oct 1 | OrioleDB public beta; Multigres private alpha | Beta / alpha | Pitch only |
| **Oct 2** | **Select**: Build anything / Operate with confidence / Scale without limits; $150M; Turso | — | Pitch context |
| Oct 13–15 | Declarative Schemas 2.0 (pg-delta, captures grants); Docker-free local stack (**alpha, off by default**) | Default / experimental | Declarative yes; native stack no |
| Oct 20 | `query_logs` MCP tool; elicitations ("not a guarantee"; the client must support them) | Available | Yes |
| **Oct 22** | **App MCP server block** (`npx shadcn@latest add https://supabase.com/library/r/mcp.json`) | Available | **Yes**, with 30–60 min setup |
| Oct 23 | Docs: "warn against subscribing to publish from servers" (#51466) | Docs | Follow it |
| **Oct 27** | **Compute** private alpha | Alpha | No |
| Oct 28 | Realtime v2.149.0: app-side RLS evaluation experiment | Experiment | Passive |
| **Oct 29** | Realtime v2.150.0 **Broadcast `persist`** (TTL 1–259,200 s); Multigres blog; CLI v3 betas | Server only | **No** |
| **Oct 30** | **Data API GRANT enforcement on all projects** (default for new projects since 30 May) | Breaking | **Must handle** |

Compute alpha details:
- us-west-2 only, waitlist, CLI ≥2.120.0
- 2 GB/1 vCPU or 4 GB/2 vCPU
- no autoscaling, GPU or persistent disk
- services can restart at any time
- every service sees all project secrets
- no agent sandboxes

Background that still applies [BG]:
- Broadcast Replay (public alpha, Dec 2025)
- Broadcast from Database
- binary payloads (Jun 2026)
- `realtime` schema locked (14 Jul 2026)
- `sb_publishable_`/`sb_secret_` keys, with `anon`/`service_role` deprecated "by the end of 2026"

---

## 3. Company and judge taste (from 05)

- **People** [V]:
  - Paul Copplestone (CEO, @kiwicopple) and Ant Wilson (CTO), YC S20
  - Glauber Costa (ex-Turso CEO), now Head of Agentic Services
  - Sugu Sougoumarane (Vitess co-creator), leads Multigres
- **Positioning:** "the leader in agentic infrastructure." Copplestone on Latent Space (26 Oct) [V]:
  - "we launch about five million databases… every single month… we're going to have to launch billions"
  - on Spark: "one database for any idea… when it takes off, then you just upgrade to full Postgres"
- **Taste:** the Select hackathon (3 Oct) was themed "Build in a weekend, scale to millions" and judged by both founders plus Stripe, Anthropic and Vercel.
  - Submissions were mostly agent-as-user products.
  - The reported winner, **Fizz** (sensors + plain-English queries + phone-call alerts), rests on the builder's X post via mirrors [S].
  - Supabase's own rubric: "Reward builds that actually run, with real auth and real data, over slideware and mockups" [V].
- **Sponsor ties:**
  - Supabase was a Sign in with ChatGPT launch partner on **29 Jul 2026**, not in October [V, corrected].
  - **Mastra is a named Turso customer** [V].
  - Compute's roadmap (sandboxes) overlaps with Freestyle, Superserve and Terse [I].
- **Competitors:**
  - Convex ($57M Series B on 4 Aug; "reactive by default", the comparison developers make most often)
  - Neon/Databricks
  - Firebase (SQL Connect, Codex plugin 28 Sep)
  - Cloudflare Durable Objects

  **Terse's "a tiny server with a SQLite database" per actor is the same many-small-SQLite pattern Supabase just bought with Turso**, so pitch it as complementary [V/I].

---

## 4. Social sentiment (from 04)

| Signal | Reading |
|---|---|
| Volume | HN: 63 stories and 215 comments since Aug 1, mostly ambient stack mentions. Only one story over 100 pts: Turso (222 pts) [V]. 114,325 GitHub stars [V]. |
| Mood (judgment over ~60 items) | about 45% positive, 25% neutral, 30% wary. No pile-on [I]. |
| #1 complaint | AI-built app security: RLS off, `service_role` in bundles, public buckets. Supabase's CISO answered with "secure by default" and "a shared responsibility". A wave of "scanner" launches followed [V]. |
| #2 complaint | Reliability: JWT 401 incident Aug 14–Sep 29; Nano outage Sep 10–11; **Management API / project-creation errors Oct 21–22** [V/S]. |
| Select reception | Positive, with "is it GA?" doubts. The top recap comment says Auth Hooks and Vault have been "still in beta since 2023". The video's "2x" OrioleDB claim is about 1.8x in the blog, and only at 8XL with data larger than memory [V]. |
| Deno/Cloudflare scare (9 Oct) | A Supabase staffer: "we operate our own infrastructure… there's no need to migrate today." Edge Functions are safe [V]. |
| Realtime | Recurring lessons: Broadcast is ephemeral; a stalled socket can show "Connected" for 46 s; Presence is not for cursors; one client per tab. Shared rule: "the database is the source of truth. Realtime messages tell clients that something changed." [S] |

---

## 5. Contradictions: resolved or flagged

| # | Conflict | Resolution |
|---|---|---|
| 1 | 2,000-socket overage: ~$20 (01) vs ~$15 (05) | **About $20** [re-checked]. Packages are whole 1k units, and the docs' invoice example shows "1,700 connections $20". 2,000 peak is 1,500 over the 500 included, which rounds up to 2 packages. 05's figure was pro-rata. |
| 2 | 05: us-west-2 is "closest to SF" | **Corrected.** The regions page lists us-west-1 (N. California) and us-west-2 (Oregon) [re-checked]. us-west-1 is closer. us-west-2 is the only Compute-alpha region. Either works; pick us-west-2 only to keep the Compute option open [I]. |
| 3 | GRANT change "lands Oct 30" | **Clarified:** it has been the default for new projects since 2026-05-30, so any project you create now already needs grants [re-checked]. |
| 4 | Scoped PAT GA: Oct 6 (01) vs Sep 28 (02) | Different artifacts: blog GA Sep 28, Select Oct 2, changelog Oct 6 [V]. |
| 5 | Middleware 1.0 helper list | Resolved in 02: the helpers are in `@supabase/server` [V]. |
| 6 | Is `Deno.serve` obsolete? | No. `export default { fetch }` (auth guide) and `Deno.serve(pipeline(...))` (MCP blog) are both valid [V]. |
| 7 | 4M vs "nearly 5M" databases/mo vs "1M+/week" | **Flagged**; all are vendor figures. Say "millions a month, ~70% by agents (Supabase)". |
| 8 | `sb_secret_` (01/02/05) vs a legacy `service_role` fallback (03) | **Flagged.** Official guidance is the new keys [V]. Open issues #50651 (PGRST303) and #51510 (~10x CPU) are single-reporter. Use the new keys, keep the legacy JWT as a server fallback if shown, and retry on PGRST303 [I]. |
| 9 | "Late joiners see nothing" | **Qualified:** DB-sent messages on private channels can be replayed (≤25 per request, kept "at least 72 hours and at most 4 days") [V]. |
| 10 | Copplestone's "two-second limit" vs 400 s | 2 s is CPU time; 400 s is wall clock [V]. |
| 11 | Community "Free: 60 connections" | Wrong: the limit is 200 [V]. |

---

## 6. Gotchas, ranked by likely hours lost

1. **Missing GRANTs.** The table is invisible to supabase-js and the hint gives the fix [V].
2. **Silent Realtime drops** [V]:
   - table not in the `supabase_realtime` publication
   - public/private mismatch between sender and receiver
   - wrong positional `private` in `realtime.send(payload, event, topic, private)`
   - non-object payload (realtime #2389)
   - **a top-level `ids` key in a broadcast payload kills the shared socket** (supabase-js #2801)
3. **Silent LongPoll fallback in Vite/esbuild** (supabase-js #2768, still in 2.118.0). Fix with `define: { global: 'globalThis' }` or `realtime: { transport: WebSocket }`, then check for `wss://` in DevTools [V/I].
4. **`realtime.send` fails until a WebSocket client connects that day**, because only clients create the daily partition. Open the page before firing triggers [V].
5. **Never `ALTER TABLE realtime.messages`** (it fails with `42501` and aborts the migration). Create policies only, and turn off "Allow public access" [V].
6. **Presence:** 5 calls per 30 s, then `ClientPresenceRateLimitReached`. Use Broadcast for cursors and tokens [V].
7. **Out-of-order bursts across nodes** (realtime #2424). Add a `seq` [V/I].
8. **Edge Functions** [V/S]:
   - 2 s CPU / 400 s wall clock
   - a cold-isolate freeze of about 75 s (edge-runtime #738): warm up first
   - deploys can serve the wrong code or exit 0 without deploying (#721, cli #6247): return a version string
   - HTTP/2 4xx responses can arrive with no body (#51893)
9. **Stale JWT after the laptop sleeps** gives `InvalidJWTToken` (#2613). Reload before going on stage [V].
10. **Auth email is limited to 2 per hour.** Use anonymous sign-in or OAuth [V].
11. **Local is not hosted:** DB broadcasts may not deliver under local Docker (#1730). Test on the hosted project [V].
12. **Project-creation incidents (Oct 21–22).** Create the project the night before [S].
13. **Queues:** create them in SQL (`pgmq.create`), not with the Dashboard's partitioned form (#52479). Use lowercase names [V].
14. **PAT "Read-only" preset includes secrets.** Start from "No access" [V].
15. **Multigres** (no Realtime, invite-only) and **OrioleDB** (pgvector HNSW only via an "experimental bridge") are fixed at project creation. Avoid both [V].

---

## 7. Integration recipes (patterns to rewrite on the day)

**R1. Migration: grants + RLS + Realtime auth + DB fan-out** [V primitives; combination I]
```sql
create table public.events (id bigint generated always as identity primary key,
  room text not null, seq bigint not null, kind text not null, body jsonb not null,
  created_at timestamptz default now());
grant select, insert on public.events to authenticated;  -- required since the GRANT change
grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "read rooms" on public.events for select to authenticated using (true);
create policy "join room topics" on realtime.messages for select to authenticated
  using ((select realtime.topic()) like 'room:%' and realtime.messages.extension in ('broadcast','presence'));
create or replace function public.events_fanout() returns trigger language plpgsql security definer as $$
begin perform realtime.broadcast_changes('room:'||NEW.room, TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD);
return null; end $$;
create trigger events_fanout after insert on public.events for each row execute function public.events_fanout();
```

**R2. Browser** (2.118.0, publishable key, anonymous auth, private channel, replay):
```ts
const sb = createClient(URL, SB_PUBLISHABLE_KEY, { realtime: { transport: WebSocket, heartbeatIntervalMs: 10000 } })
await sb.auth.signInAnonymously(); await sb.realtime.setAuth()
const room = sb.channel('room:haunt-1', { config: { private: true,
  broadcast: { replay: { since: Date.now() - 600_000, limit: 25 } } } })
room.on('broadcast', { event: '*' }, ({ payload }) => apply(payload))   // reorder by seq
    .on('presence', { event: 'sync' }, () => setGhosts(room.presenceState()))
    .subscribe(async s => { if (s === 'SUBSCRIBED') await room.track({ name: 'pumpkin' }) })
```
Also fetch a snapshot on subscribe and on reconnect. Replay is alpha and covers only DB-sent messages. Check the `broadcast_changes` event and payload shape in the Realtime Inspector [I].

**R3. Terse actor or Relay worker → spectators, with no socket** [V]: `await sb.channel('room:haunt-1', { config: { private: true } }).httpSend('ghost', { seq, text: 'boo' })`, or `POST /realtime/v1/api/broadcast/room:haunt-1/events/ghost?private=true` with `apikey: sb_secret_…`. Choose by event type [I]:
- durable or replayable events: `insert` into `events`, and let R1 fan out
- ephemeral events (tokens, typing): `httpSend`

**R4. Edge Functions for short tool calls** [V]:
- Handler: `export default { fetch: withSupabase({ auth: 'user' }, handler) }`. `ctx.supabase` is RLS-scoped and `ctx.supabaseAdmin` is admin.
- Background work: `EdgeRuntime.waitUntil()` for anything under 400 s.
- OpenAI Realtime voice relay: use `Deno.upgradeWebSocket`. `withSupabase` can't authenticate WebSocket upgrades, so deploy with `--no-verify-jwt` and verify a JWT from the query string or `Sec-WebSocket-Protocol` (reference: akdeb/ElatoAI).

**R5. Wake-ups and backpressure** [V/I]: a pgmq `agent_jobs` queue, `pg_cron` every few seconds, and `net.http_post` to a function or actor. Keep the secret in Vault.

**R6. Agents as users through the app MCP server** [V]:
- Pipeline: `pipeline([withOAuthProtectedResource(), withSupabase({auth:'user'})], handler)`.
- Needs: asymmetric JWT keys, the OAuth 2.1 server, dynamic client registration, the OAuth Consent block, Site URL set to the consent host, and `[functions.mcp] verify_jwt = false`.
- Demo idea: a judge's ChatGPT or Claude "possesses" a player under RLS [I]. Only attempt it if the core works by 2:30pm.

**R7. Coding-agent setup** [V]:
- `claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=<ref>&features=database,docs,debugging,development,functions"`
- `npx skills add supabase/agent-skills`
- Declarative Schemas
- `--linked` passed explicitly in scripts

---

## 8. Hackathon implications

**What to build [I]:** a multiplayer **séance room / haunted house**:
- each room or ghost is a **Terse Durable Actor** with an LLM
- ghosts coordinate over **Agent Relay**
- **Supabase** provides Auth, Postgres (players, transcripts, events, optional pgvector memory), and **Broadcast from DB to private RLS channels** that fan out to spectators' phones
- Presence shows the ghost roster

This covers both host tracks (the "bonus points") and the Supabase prize. A sensor or "physical ghost" alert agent would echo the Select winner's taste [S/I].

**Scale pitch (3 slides):**
1. Architecture: actors scale horizontally; Postgres is the record; Broadcast fans out from the Realtime cluster rather than per-subscriber CDC; servers send over REST without sockets; topic-scoped RLS; pgmq for backpressure.
2. Numbers: a live client counter and the latency you measured, plus the vendor benchmark (pick the row that fits).
3. Path: Pro with the cap off (10k connections / 2.5k msg/s, raisable on request), replicas, then "Multigres (alpha) / OrioleDB (beta), not demoed". Per-entity actors mirror the Spark direction.

Close with the tagline and a clean Security Advisor: no `service_role` in the browser, RLS on every table.

**Setup before Sat 11:00:**
1. Create the org and project (region: see §5 #2). Redeem a code at `/redeem` if you get one, and bring a card. Vault the publishable, secret and (if shown) legacy keys.
2. Use `npx supabase@2.122.0`. Plan on supabase-js 2.118.0.
3. Dashboard: enable anonymous sign-ins; turn off Realtime "Allow public access"; enable `vector`, `pg_cron`, `pg_net` and `pgmq`. Optionally set up the R6 OAuth prerequisites.
4. Connect the MCP with a scoped PAT built from "No access", and add agent-skills.
5. Rehearse R1–R3 on a throwaway project: two tabs, `wss://` confirmed, latency timed. Delete the code afterwards (event rule) and keep the notes.
6. Plan the load test (200–400 clients fit within Pro limits). Decide in advance about the spend cap (about $20 for 2,000 sockets).
7. Pin the Realtime Inspector and Usage pages for the demo.

**What Supabase likely rewards [I]:**
- builds that actually run with real auth and data
- saying "Broadcast, not Postgres Changes" out loud
- agents as users (MCP + RLS)
- honest, labelled numbers
- no overclaiming of alpha features

Host judges decide the main prizes, so keep Supabase as the visible spine, not the headline.

---

## 9. Limits / could not verify

- **Partly closed 2026-10-30 ([sponsor-coverage-audit §2.2](reference/sponsor-coverage-audit.md)):** credits apply to *future* invoices, and the Pro fee is charged upfront, so **redeem the code before upgrading**. Each paid org gets $10 of compute credits, so $25 covers exactly one Pro month with **one** Micro project. The redeem modal previews amount, expiry and charges and uses hCaptcha, with a ~10/h rate limit (PR #42377). Supabase's own events email each participant a code.

- **Prize and judging:** the Supabase judge and the rubric for the $1K prize are unpublished.
- **Credit mechanics:** how the $25 arrives (code or automatic grant), whether a card is needed, and whether credits offset overage when the cap is off are all unverified.
- **Unreleased features:**
  - hosted rollout of Realtime v2.150.x `persist`; no supabase-js stable support found
  - Broadcast Replay GA status
  - Compute waitlist turnaround and pricing
  - Spark availability
  - which pgmq version hosted projects run
- **Never re-checked by any verifier:** vector-bucket limits, pooler hostname format, full hosted-MCP tool list, contributor counts, founder biography details, the ~$10.65B valuation, Product Hunt and LinkedIn counts, and the 1.98M-view figure for the kiwicopple joke (third party).
- **Thin sourcing:**
  - issue measurements #738 and #51510 are single-reporter
  - Reddit comment bodies could not be fetched
  - TikTok and Threads were not searched
  - the Fizz win rests on mirrors
- **Not tested:** no CLI command was run, nothing was deployed, and no code was redeemed.

---

## Sources (merged, deduplicated; full per-claim lists and verification logs are in each sub-file)

**Event:** `/Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md` (https://events.ycombinator.com/haunted-hacks-2026) · https://luma.com/yc-meetup-7183-9316f87f

**Docs** (prefix `https://supabase.com/docs/guides/`):
- Realtime: `realtime/limits` · `realtime/broadcast` · `realtime/presence` · `realtime/authorization` · `realtime/subscribing-to-database-changes` · `realtime/benchmarks` · `ai-tools/ai-prompts/use-realtime`
- Platform and billing: `platform/manage-your-usage/realtime-messages` · `platform/manage-your-usage/realtime-peak-connections` · `platform/cost-control` · `platform/credits` · `platform/billing-faq` · `platform/regions`
- Edge Functions: `functions/limits` · `functions/auth` · `functions/background-tasks` · `functions/websockets` · `functions/ai-models` · `functions/quickstart`
- Keys and auth: `api/api-keys` · `auth/rate-limits` · `auth/auth-anonymous`
- Cron and queues: `cron` · `cron/quickstart` · `queues` · `queues/quickstart` · `queues/api`
- Database, AI and MCP: `database/connecting-to-postgres` · `ai/automatic-embeddings` · `getting-started/mcp`
- Elsewhere: https://supabase.com/pricing · https://supabase.com/mcp

**Changelog** (prefix `https://supabase.com/changelog`): root · `/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically` · `/supabase-middleware-1-0` · `/scoped-personal-access-tokens-ga`

**Blog** (prefix `https://supabase.com/blog/`):
- Select (2 Oct): `supabase-select-2026-recap` · `select-2026-build-anything` · `select-2026-scale-without-limits` · `supabase-is-acquiring-turso`
- October follow-ups: `give-your-supabase-app-its-own-mcp-server` · `supabase-compute-private-alpha` · `multigres-private-alpha` · `orioledb-public-beta` · `local-supabase-project-per-agent-with-or-without-docker` · `supabase-middleware` · `operate-with-confidence-check-production-with-your-coding-agent` · `scope-your-personal-access-tokens`
- Earlier in the window: `postgres-changes-filters-and-column-selection` · `sign-in-with-chatgpt-beta`
- Background: `realtime-broadcast-replay` [BG] · `series-f` [BG]
- Other: https://select.supabase.com/ · https://github.com/supabase/supabase/tree/master/apps/www/_blog

**GitHub:**
- Releases: https://github.com/supabase/realtime/releases · https://github.com/supabase/supabase-js/releases · https://github.com/supabase/cli/releases · https://github.com/supabase/mcp · https://github.com/pgmq/pgmq/releases/tag/v1.13.1 · https://github.com/supabase/agent-skills
- PRs: realtime #2022, #2109, #2235, #2336, #2384 (`github.com/supabase/realtime/pull/N`) · https://github.com/supabase/cli/pull/7186 · supabase #42377, #42496, #45909, #50218, #51031 (`github.com/supabase/supabase/pull/N`)
- Issues, supabase-js #2768, #2801, #2613 (`github.com/supabase/supabase-js/issues/N`)
- Issues, realtime #2389, #2361, #2093, #2424, #1730 (`github.com/supabase/realtime/issues/N`)
- Issues, supabase #50532, #51629, #51893, #50651, #51510, #52011, #52479 (`github.com/supabase/supabase/issues/N`)
- Issues, edge-runtime #738, #740, #719, #721 (`github.com/supabase/edge-runtime/issues/N`)
- Issues, cli #6247, #7274, #7055 (`github.com/supabase/cli/issues/N`)
- Discussions: supabase #52403, #52006, #50926 (`github.com/supabase/supabase/discussions/N`)
- Examples and community: https://github.com/supabase/supabase/tree/master/examples · https://github.com/akdeb/ElatoAI · https://github.com/mastra-ai/mastra/tree/main/auth/supabase

**Press, people, strategy:**
- Press: https://www.prnewswire.com/news-releases/supabase-announces-150m-in-new-funding-and-turso-acquisition-302896752.html · https://techcrunch.com/2026/09/25/some-supabase-customers-are-publicly-exposing-reams-of-peoples-data-to-the-web/ · https://www.nbr.co.nz/tech/supabase-raises-another-us150m/ (unverified valuation)
- Founders and company: https://lspace.beehiiv.com/podcast/s/latent_space_the_ai_engineer_podcast/why_agents_love_supabase · https://latent.space/p/supabase/ · https://www.ycombinator.com/companies/supabase · https://help.openai.com/en/articles/20001410-sign-in-with-chatgpt
- Hackathons: https://luma.com/select-2026-hackathon · https://hackathon.supabase.com/supabase-select-2026-hackathon · https://hackathon.supabase.com/hackathon-rules · https://nitter.rdrama.net/AntWilson/status/2106803568779088313 (mirror) · https://www.linkedin.com/posts/nadaa-moharram_i-won-most-likely-to-scale-to-millions-activity-7423607935161004032-z6w8 [BG]
- Competitors and Terse: https://news.convex.dev/convex-raises-57m/ · https://firebase.blog/posts/2026/09/firebase-plugin-for-codex/ · https://docs.useterse.ai/concepts

**Social and community:**
- HN: https://news.ycombinator.com/item?id=49934784 · https://news.ycombinator.com/item?id=49857595 · https://news.ycombinator.com/item?id=50031340
- X: https://x.com/DanielSmidstrup/status/2115990684842836184 · https://x.com/supabase/status/2115849903427502490 · https://x.com/glcst/status/2115791268391383085 · https://eraofminds.com/blog/supabase-12-claude-agents-reverse-engineer/
- YouTube: https://www.youtube.com/watch?v=I9GymvCJRRw · https://www.youtube.com/watch?v=JllzgqiOF34
- Dev blogs: https://dev.to/tomozilla/supabase-realtime-from-scratch-tic-tac-toe-with-broadcast-and-presence-then-a-live-order-board-1d9m · https://dev.to/elena_rostova/notes-from-a-2-am-on-call-supabase-realtime-connection-reset-under-nextjs-ssr-load-1dj3 · https://axonbuild.com/blog/supabase-realtime-slow/
- Status: https://status.supabase.com/incidents/4mkcsnlf6p5x · https://pulsetic.com/status/supabase/incidents/6409/ · https://isitupordown.com/is-supabase-down/history/

**Live checks for this consolidation (30 Oct 06:17 UTC):** `gh release list` (supabase-js, realtime, cli); `gh api repos/supabase/cli/releases/latest`; `npm view` dist-tags (`supabase`, `@supabase/supabase-js`); `curl` of the realtime-peak-connections, GRANT changelog and regions pages.
