# Supabase docs and API deep dive for Haunted Hacks (31 Oct 2026)

Checked **29 October 2026**. Sources: live supabase.com docs and pricing pages (read through Exa `web_fetch` and WebFetch), the Supabase changelog and blog index, `gh` release data for `supabase/cli`, `supabase/supabase-js`, `supabase/realtime`, `supabase/server` and `supabase-community/supabase-mcp`, and npm registry versions. No early Supabase draft existed in this folder, so this file starts from scratch. **[V]** means I read it in a primary source. **[I]** means inference. **[BG]** marks material from before August 2026. Bracketed numbers point to the Sources list.

---

## 0. TL;DR

- **The credit is $25, "equivalent to 1 free month of Pro plan"** [0]. The arithmetic checks out: Pro is $25 a month plus $10 for Micro compute, minus the $10 compute credit Pro includes, so one Pro org with **one** Micro project costs **$25 a month** [1]. A second project adds another $10. [V]
- **Realtime limits are the binding demo constraint.** Defaults: Free allows 200 concurrent connections and 100 msg/s. Pro allows 500 and 500 msg/s. **Pro with the spend cap turned off allows 10,000 and 2,500 msg/s** [2]. Going over sends `too_many_connections` or `tenant_events` disconnects. A live "1,000 bots" load demo **fails on Pro defaults** unless you turn off the spend cap. [V]
- **Use Broadcast, not Postgres Changes, for anything that has to scale.** The docs call Broadcast "the recommended method for scalability and security" [5]. `realtime.broadcast_changes()` triggers plus private channels plus RLS on `realtime.messages` is the scale pattern. [V]
- **Send from servers with `channel.httpSend()` or the REST endpoint, never by subscribing.** Every subscribed Edge Function worker counts as a peak connection and is billed as a recipient of every message [3][4]. [V]
- **Edge Functions:** Deno/TypeScript only. 256 MB memory, **2 s CPU** per request, wall clock of 150 s on Free and **400 s on paid plans**, 150 s idle timeout [6]. Too short for a long-running agent loop, so keep long-running agents in Terse actors. [V]
- **New idiom since the Oct 2026 docs refresh:** `export default { fetch: withSupabase({ auth: 'user' }, handler) }` from `npm:@supabase/server@1`. Legacy `anon` and `service_role` keys are **deprecated by end of 2026**, so use `sb_publishable_…` and `sb_secret_…` [7][8]. Tutorials that show `eyJ…` keys or `createClient(SERVICE_ROLE)` in every function are out of date. [V] (Correction, fact-check: `Deno.serve` itself is **not** obsolete. Supabase's own 22 Oct MCP blog wraps `withSupabase` inside `Deno.serve(pipeline([...]))` [31]. The `export default { fetch }` form is what the Edge Functions auth guide uses [8].)
- **Versions on 29 Oct:** CLI **v2.122.0** stable (23 Oct, npm `latest`). **On 29 Oct the CLI repo published v3.0.0-beta.1 through beta.15, v3.0.0-next.26/27 and v2.123.0-beta.17 (npm `beta` = 3.0.0-beta.15, `next` = 3.0.0-next.27), so pin 2.122.0.** supabase-js **2.118.0** (15 Oct; 2.119.0 is still canary), `@supabase/server` **1.9.2** (12 Oct), Realtime server v2.150.1 (server-side, not something you install), `@supabase/mcp-server-supabase` 0.15.0 (29 Oct) [9]. [V]

---

## 1. Plans, quotas and what the $25 buys

### 1.1 Plan quotas (from the pricing page, 29 Oct) [1]

| Item | Free | Pro ($25/mo) | Overage on Pro |
|---|---|---|---|
| Active projects | 2, paused after 1 week idle | unlimited, never paused | each project costs compute |
| DB size / disk | 500 MB (shared CPU, 500 MB RAM) | 8 GB disk per project | $0.125/GB |
| MAU | 50,000 | 100,000 | $0.00325/MAU |
| Egress / cached egress | 5 GB / 5 GB | 250 GB / 250 GB | $0.09 / $0.03 per GB |
| File storage | 1 GB, 50 MB max upload | 100 GB, 500 GB max upload | $0.0213/GB |
| Edge Function invocations | 500k | 2M | $2 per 1M |
| Realtime messages | 2M | 5M | $2.50 per 1M (billed in whole 1M packages) |
| Realtime peak connections | 200 | 500 | $10 per 1,000 (billed in whole 1k packages) |
| Realtime max message | 256 KB | 3 MB | |
| Log retention | 1 day | 7 days | |
| Branching | no | $0.01344/branch-hour | |

Compute add-ons [1]: Micro $10 (1 GB RAM, 60 direct / 200 pooler connections), Small $15 (2 GB, 90/400), Medium $60 (4 GB, 120/600), Large $110 (2 dedicated vCPU, 8 GB, 160/800), and so on up to 16XL at $3,730. Compute is billed hourly.

### 1.2 How the credit maps to usage [V unless marked]

- Credits sit in an **organization credit balance** and "are applied to future invoices… credits will be used before charging your payment method" [10]. On upgrade, "If you still have credits in your account, we will use the credits first before charging your card" [11].
- The plan fee is charged **upfront** and usage, including compute, is charged **in arrears** [10]. So $25 covers the first Pro month for one Micro project. Overages bill at the next cycle.
- **Spend cap** (Pro only, on by default). It covers disk, egress, Edge Function invocations, log ingest/query, MAU, **Realtime messages and peak connections**, image transforms and storage. It does **not** cover compute, branching compute, read replicas, custom domains, IOPS, IPv4, log drains, phone MFA or PITR [12]. With the cap on, going over a quota means "further usage of that item is disallowed until the next billing cycle" [12].
- [I] **Hackathon budget math.** Pro, one Micro project, spend cap ON comes to $25, fully covered. Turning the cap OFF to get 10k Realtime connections only costs money if you actually exceed 500 peak connections or 5M messages: $10 per extra 1k peak connections, $2.50 per extra 1M messages [3][4]. A 2,000-socket demo on one day therefore costs about $20 in peak-connection packages, past the credit. Branching (about $0.32/day per branch) and a Small compute upgrade ($15/mo, prorated hourly) are cheap.
- **How the code is redeemed (updated by fact-check).** A Feb 2026 Studio PR added credit-code redemption in billing settings, initially "Feature Flag toggled off on production" [13]. Two later merged PRs added a standalone redeem page (#42496, merged 6 Feb 2026) and redesigned it (#45909, merged 18 May 2026) [13]. **Live check on 29 Oct: `https://supabase.com/redeem?code=X` returns HTTP 307 to `/dashboard/redeem?code=X`, and `/dashboard/redeem` returns 200** [13]. So the redeem route is deployed. The flow is: sign in, pick an organization, enter the code (hCaptcha). Still unverified: whether sponsor codes go through this route, and whether you need a card on file before the org can move to Pro. Bring a card anyway. The credits docs don't mention codes at all [10].

### 1.3 Realtime limits by plan [2]

| | Free | Pro | Pro, no spend cap | Team |
|---|---|---|---|---|
| Concurrent connections | 200 | 500 | 10,000 | 10,000 |
| Messages/s | 100 | 500 | 2,500 | 2,500 |
| Channel joins/s | 100 | 500 | 2,500 | 2,500 |
| Channels per connection | 100 | 100 | 100 | 100 |
| Presence keys per object | 10 | 10 | 10 | 10 |
| Presence msgs/s | 20 | 50 | 1,000 | 1,000 |
| Presence calls per client per 30 s | 5 | 5 | 5 | 5 |
| Broadcast payload | 256 KB | 3,000 KB | 3,000 KB | 3,000 KB |
| Postgres Changes payload | 1,024 KB | same | same | same |
| Broadcast replay retention / msgs per request | 72 h / 25 | same | same | same |

Error codes: `too_many_channels`, `too_many_connections`, `too_many_joins`, and `tenant_events` (disconnects when msg/s is too high; supabase-js reconnects automatically) [2]. Over the Postgres Changes payload limit, only fields of 64 bytes or less are sent [2].

**Message counting** [3]: a Broadcast costs 1 for the send plus 1 per receiving client. The sender is not counted unless `self: true`. A database change costs 1 per listening client. **Peak connections** [4] counts the highest concurrent count per project in the billing cycle, summed across projects. Only successful connections count.

### 1.4 Edge Functions limits [6]

Memory 256 MB. Wall clock 150 s on Free, 400 s on paid. **CPU 2 s per request** (async I/O excluded). Request idle timeout 150 s, then 504. Bundle size 20 MB via CLI, 5 MB via dashboard or API. Function count: 100 on Free, 1,000 on Pro. Secrets: 100 per project, 48 KiB each, and the `SUPABASE_` prefix is reserved. Recursive calls: 30 per trace per 60 s. Log events: 100 per 10 s. **No outbound ports 25 or 587. `text/html` is rewritten to `text/plain` without a custom domain. No Web Workers. No multithreaded native libraries (sharp, libvips).**

### 1.5 Auth rate limits [14]

Built-in email: **2 emails per hour per project**. Anonymous sign-ins: 30/h per IP. OTP: 30 per 5 min per IP, and one send per user per 60 s. Token refresh: 150 per 5 min per IP. Over the limit returns 429. **Do not use magic-link email at a live demo without custom SMTP.** Use anonymous sign-in or OAuth instead.

### 1.6 Other limits

- Cron: "For best performance, we recommend no more than 8 Jobs run concurrently. Each Job should run no more than 10 minutes." This is a recommendation, not an enforced cap. Sub-minute schedules (`'30 seconds'`) need Postgres 15.1.1.61 or later [15].
- Queues: `pgmq` needs Postgres 15.6.1.143 or later. Queue names allow lowercase letters, hyphens and underscores [16].
- Vector buckets (alpha): 10 buckets per project, 10 indexes per bucket, max 4,096 dimensions [17].

---

## 2. API surface map (what exists and when to use it)

| Surface | Endpoint / entry | Notes |
|---|---|---|
| Data API (PostgREST) | `https://<ref>.supabase.co/rest/v1` | `supabase.from()`, `.rpc()`. RLS gates every request. "RLS with no policies denies every request" [18]. pgvector operators need an RPC wrapper [19]. |
| Auth (GoTrue) | `/auth/v1` | Anonymous, OAuth, OTP, MFA, **OAuth 2.1 server** (all plans) [1], auth hooks |
| Realtime | `wss://<ref>.supabase.co/realtime/v1`, REST `POST /realtime/v1/api/broadcast/{topic}/events/{event}` | Broadcast, Presence, Postgres Changes [20] |
| Storage | `/storage/v1` | S3-compatible buckets, image transforms (Pro), vector buckets (alpha) [17] |
| Edge Functions | `/functions/v1/<name>` | Deno, `npm:` and `jsr:` imports, WebSockets, `EdgeRuntime.waitUntil`, `Supabase.ai` [6][21][22][23] |
| Postgres direct | `db.<ref>.supabase.co:5432` | IPv6 by default. IPv4 needs a paid add-on [18] |
| Shared pooler (Supavisor) | `aws-[INDEX]-[REGION].pooler.supabase.com:5432` (session) / `:6543` (transaction), user `postgres.<ref>` | IPv4 on all plans. **Transaction mode is the one for serverless**: no prepared statements, pool size 1, `sslmode=require` [18]. Copy the host from the Connect dialog because `[INDEX]` can't be derived [18]. |
| Dedicated pooler | `db.<ref>.supabase.co:6543` | Pro and up, transaction mode only [18] |
| Management API / CLI | `api.supabase.com` | **Scoped PATs GA on 6 Oct 2026**: limit tokens to projects and permissions for the Management API, MCP and CLI [24] |
| Hosted MCP | `https://mcp.supabase.com/mcp` (local: `http://localhost:54321/mcp`) | OAuth, no PAT needed [25] |

**SDKs [V]:** JS/TS (`@supabase/supabase-js`), Dart/Flutter, Swift, Kotlin, Python, C#/.NET (**officially supported since 9 Oct 2026**, now with OpenTelemetry and ASP.NET DI), and **Go public alpha v0.1.0-alpha.1 (5 Oct 2026)**, which only verifies tokens and queries under RLS [24]. Binary Broadcast payloads need supabase-js 2.91.0+ or supabase-swift 2.44.0+. Dart, Kotlin and Python don't support binary yet. **Older clients silently drop binary messages** [20]. Python does not support Broadcast `ack` [20].

**API keys [7]:** publishable `sb_publishable_…` maps to the `anon` role, or to `authenticated` when a user JWT is present. Secret `sb_secret_…` maps to `service_role` and bypasses RLS. You can have several named secret keys (`default`, `automations`…). `anon` and `service_role` JWT keys keep working until you disable them, but are deprecated by end of 2026. **A missing grant gives a permission error. A policy with no matching rows gives an empty result. Check grants first.** [7]

---

## 3. Realtime in depth (the core of a "Real-Time AI" demo)

### 3.1 Broadcast [20]

- Three send paths: the client lib over WS (it falls back to HTTP if not yet subscribed), REST, and the database (`realtime.send()` writes to `realtime.messages`, which streams out over logical replication).
- Options: `config.broadcast.self` (echo to sender), `config.broadcast.ack` (server confirms receipt), `config.private` (RLS-gated).
- `channel.httpSend(event, payload)` (supabase-js 2.76.0+, binary in 2.107.0+) always uses REST and opens no socket. **Use it from Edge Functions, Terse actors and agent processes.**
- Batch REST: `POST /realtime/v1/api/broadcast` with `{ "messages": [{topic,event,payload}] }`. JSON only.
- **DB broadcasts default to private.** Public and private must match on both ends or the message is silently not delivered [20].
- **Broadcast Replay** (new in the current docs): private channels can fetch earlier messages, **but only ones sent via Broadcast-from-Database**. Config is `since` (epoch ms, required) and `limit` (max 25). Partitions are dropped after 72 h. Needs JS 2.74.0+, Dart 2.10.0+, Swift 2.34.0+ or Python 2.22.0+. Not supported in Kotlin [20]. [I] This is a cheap "late joiner catches up on the séance" feature.

### 3.2 Presence [26]

Events are `sync`, `join` and `leave`. Call `channel.track(obj)` and `untrack()`. Set a custom key with `config.presence.key`. **The docs warn against calling `track()` on every mouse move**: use Broadcast for cursors and keep Presence for slow-changing state. With the 5 calls per client per 30 s limit [2], cursor-via-Presence will throttle.

### 3.3 Authorization [27]

RLS policies on `realtime.messages`, keyed on `realtime.topic()` and `realtime.messages.extension in ('broadcast'|'presence')`. Checks run at channel join. Clients must use `config: { private: true }`, and to enforce private channels you must turn off "Allow public access" in Realtime Settings. **Gotchas:** the `realtime` schema has been fully locked since 14 Jul 2026 [24]. **Do not write `ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY`**: it fails with `42501 must be owner` and aborts the rest of the migration [27]. Complex RLS slows joins [27].

### 3.4 DB-change fan-out [5]

`realtime.broadcast_changes(topic, TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD)` inside an `after insert or update or delete` trigger. The client calls `await supabase.realtime.setAuth()` and subscribes to a private channel. Postgres Changes needs tables in the `supabase_realtime` publication and "does not scale as well" [5].

---

## 4. Background work: Queues, Cron, pg_net, Edge Functions

- **Queues (pgmq)** [16][28]: pull-based FIFO with no priorities. Messages are exactly-once inside a visibility window. Basic queues are logged tables. Unlogged queues are faster but can lose messages. Each queue gets tables `pgmq.q_<name>` and `pgmq.a_<name>`. To use queues from clients, turn on "Expose Queues via PostgREST", which creates the `pgmq_public` schema. The API is `send(queue_name, message, sleep_seconds)`, `send_batch`, `read(queue_name, sleep_seconds, n)`, `pop`, `archive` and `delete`. Grants: send needs Select+Insert, read/pop needs Select+Update, archive/delete needs Select+Delete.
- **Cron (pg_cron)** [15]: `cron.schedule(name, schedule, sql)`. Same name means upsert. Inspect runs in `cron.job_run_details`, **which is never auto-cleaned**. To call an Edge Function on a schedule, use `net.http_post(...)`, which needs `pg_net`.
- **Edge background tasks** [21]: `EdgeRuntime.waitUntil(promise)` lets you respond immediately and keep working until the wall-clock or CPU cap. Listen for `beforeunload` to checkpoint. For local testing, set `[edge_runtime] policy = "per_worker"`, otherwise local instances die after the response.
- **Edge WebSockets** [22]: `Deno.upgradeWebSocket(req)`. Inbound and outbound are both supported, so it can relay the OpenAI Realtime API. Browsers can't send auth headers: deploy with `--no-verify-jwt` and verify a JWT passed in the query string or as `Sec-WebSocket-Protocol: jwt-<token>`. `withSupabase` **cannot** authenticate WebSocket upgrades.
- **Supabase.ai** [23]: `new Supabase.ai.Session('gte-small')` gives built-in English embeddings, truncated at 512 tokens. The docs page doesn't state the dimension. 384 comes from the gte-small model itself and is (unverified) on the Supabase page. Hosted LLM inference is still early-access. LLMs otherwise require your own Ollama or Llamafile host.
- **Automatic embeddings recipe** [19]: a trigger enqueues to pgmq, `pg_cron` drains the queue, `pg_net` calls an Edge Function, the function calls OpenAI, and the result is written to `vector(N)`. Extensions needed: `vector`, `pgmq`, `pg_net`, `pg_cron`, `hstore`. The project URL is stored in Vault.
- **Supabase Compute (private alpha, 27 Oct 2026)** [29]: long-running Node, Deno or Dockerfile services next to the DB (2 GB/1 vCPU or 4 GB/2 vCPU). Needs CLI 2.120.0+ and `[experimental] compute = true`, then `supabase compute new` / `push`. **us-west-2 only, waitlist only, may restart at any time, no autoscale, GPU or persistent disk. Every service receives all project secrets. Public services suspend when idle, while private ones keep running** [29]. [I] Don't plan on it for Saturday. It is worth one sentence in the "scale" pitch.

---

## 5. Auth essentials for a 5-hour build

- Anonymous sign-in [30]: turn it on in Auth → Providers, then call `supabase.auth.signInAnonymously()`. Anonymous users get the `authenticated` role, so gate them with `(auth.jwt()->>'is_anonymous')::boolean`. Upgrade later with `updateUser({email})` or `linkIdentity({provider})` (manual linking must be on). Add Turnstile or captcha if the demo is public.
- **OAuth 2.1 server and "your app's own MCP server" (announced at Select, 2 Oct; blog 22 Oct)** [31]: `npx shadcn@latest add https://supabase.com/library/r/mcp.json` scaffolds `supabase/functions/mcp` with `withOAuthProtectedResource()` and `withSupabase({ auth: 'user' })`. Every tool call runs as the signed-in user under RLS. Prerequisites: asymmetric JWT signing keys, OAuth 2.1 server ON, dynamic client registration ON, a consent page (OAuth Consent block), and `[functions.mcp] verify_jwt = false`. [I] This could give the Agent Relay track an interesting angle, since external agents act as users. Budget about an hour of setup risk.

---

## 6. Hosted MCP server (for your coding agent) [25][32]

URL `https://mcp.supabase.com/mcp`, with OAuth in the browser. Query params: `project_ref=<id>` (turns off account tools), `read_only=true`, `features=database,docs,…` (Storage is off by default), and `skip_elicitations=…`. Tools: **account** (`list_projects`, `get_project`, `create_project`, `pause_project`, `restore_project`, `list_organizations`, `get_organization`, `get_cost`, `confirm_cost`), **docs** (`search_docs`), **database** (`list_tables`, `list_extensions`, `list_migrations`, `apply_migration`, `execute_sql`), **debugging** (`query_logs`, `get_advisors`), **development** (`get_project_url`, `get_publishable_keys`, `generate_typescript_types`), **functions** (`list_edge_functions`, `get_edge_function`, `deploy_edge_function`, `create_edge_function_secret`), **branching** (paid, experimental) and **storage**. Local CLI MCP offers a subset of tools and no OAuth [32]. For Claude Code: `claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=<ref>&features=database,docs,debugging,development,functions"`, then authenticate via `/mcp`.

---

## 7. CLI and config (Oct 2026 state)

- Install: `brew install supabase/tap/supabase` or `npx supabase@2.122.0`. **Pin 2.x. v3.0.0-beta.* tags appeared on 29 Oct** [9].
- Core loop [33]: `supabase login`, `supabase init`, `supabase link --project-ref <ref>`, `supabase start`, `supabase functions new <name>`, `supabase functions serve`, `supabase functions deploy [name] [--use-api]`, `supabase db push`, `supabase secrets set KEY=val`, `supabase gen types typescript --linked`. "The CLI automatically falls back to API-based deployment if Docker isn't available" [33]. Caveats from the limits page: server-side bundles are capped at **5 MB** (versus 20 MB built locally), and "Static files cannot be deployed using the API flag" [6].
- **`@supabase/server` framework adapters (Hono, H3, Elysia, NestJS) were deprecated on 5 Oct and will be removed on 1 Dec 2026** [24]. If you put a Hono router inside a function, use the framework bridges, not the adapter.
- **Docker-free local stack (CLI 2.119.0+, experimental)** [34]: `SUPABASE_EXPERIMENTAL_STACK=1 supabase init`, or `[experimental] stack = true`. Add `supabase start --runtime native` on macOS 14+ Apple silicon or Linux with glibc 2.35+. It starts Postgres only and the other services wake lazily, idling at about 290 MiB versus 2.6 GiB. `supabase start --output-format json` prints URLs and keys. One stack per git worktree, so each agent gets its own DB. The blog's own caveat: Docker "is still the better fit for several projects on one laptop". Think of native as "one project per sandbox", and its "flags and output can still change" [34]. The Select post calls the native/multi-instance mode "alpha today, off by default" [35].
- **Declarative Schemas 2.0 / pg-delta** [35]: edit `supabase/schemas/*.sql`, run `supabase db schema declarative sync`, then `supabase db push`. On by default for new `supabase init`. `supabase config pull` and `supabase pull` bring dashboard settings, schema and functions back into the repo.
- `config.toml` keys used above: `[functions.<name>] verify_jwt = false`, `[edge_runtime] policy = "per_worker"`, `[experimental] stack = true / compute = true`.

---

## 8. Copy-paste minimal setup

**8.1 Client (browser):**
```ts
import { createClient } from '@supabase/supabase-js' // 2.118.0
export const sb = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
await sb.auth.signInAnonymously()
await sb.realtime.setAuth()                      // needed for private channels
const room = sb.channel('room:haunt-1', { config: { private: true, broadcast: { self: true } } })
room
  .on('broadcast', { event: 'ghost' }, ({ payload }) => render(payload))
  .on('presence', { event: 'sync' }, () => setPlayers(room.presenceState()))
  .subscribe(async (s) => { if (s === 'SUBSCRIBED') await room.track({ name: 'pumpkin' }) })
```

**8.2 Realtime RLS plus DB fan-out (migration):**
```sql
create table public.events (id bigint generated always as identity primary key,
  room text not null, kind text not null, body jsonb, created_at timestamptz default now());
alter table public.events enable row level security;
create policy "read own rooms" on public.events for select to authenticated using (true);

create policy "join room topics" on realtime.messages for select to authenticated
  using ( (select realtime.topic()) like 'room:%' and realtime.messages.extension in ('broadcast','presence') );
create policy "send to room topics" on realtime.messages for insert to authenticated
  with check ( (select realtime.topic()) like 'room:%' );
-- NOTE: no ALTER TABLE realtime.messages ... (fails with 42501)

create or replace function public.events_fanout() returns trigger
language plpgsql security definer as $$
begin
  perform realtime.broadcast_changes('room:' || NEW.room, TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD);
  return null;
end $$;
create trigger events_fanout after insert on public.events for each row execute function public.events_fanout();
```

**8.3 Server or agent sending without a socket (Terse actor, Agent Relay worker, Edge Function):**
```ts
const ch = sb.channel('room:haunt-1', { config: { private: true } })
await ch.httpSend('ghost', { from: 'agent-7', text: 'boo' })   // no WS, no peak-connection cost
sb.removeChannel(ch)
```
or `curl -H "apikey: $SB_SECRET" -H 'Content-Type: application/json' -d '{"text":"boo"}' "https://$REF.supabase.co/realtime/v1/api/broadcast/room:haunt-1/events/ghost?private=true"` [20].

**8.4 Edge Function (current idiom) [8]:**
```ts
// supabase/functions/agent-step/index.ts
import { withSupabase } from 'npm:@supabase/server@1'
export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    const { prompt } = await req.json()
    EdgeRuntime.waitUntil(runLLMAndBroadcast(ctx.supabaseAdmin, ctx.userClaims!.id, prompt)) // stays under the 400 s wall clock
    return Response.json({ queued: true })
  }),
}
```
`ctx` provides `supabase` (RLS-scoped), `supabaseAdmin`, `userClaims`, `jwtClaims` and `authMode`. Auth modes are `'user' | 'secret' | 'publishable' | 'none'`, with variants `'secret:<name>'` / `'secret:*'` [8].

**8.5 Queue plus cron worker:**
```sql
create extension if not exists pgmq; create extension if not exists pg_net with schema extensions;
select pgmq.create('agent_jobs');
select cron.schedule('drain-agent-jobs', '5 seconds', $$
  select net.http_post(url := 'https://<ref>.supabase.co/functions/v1/agent-step',
    headers := jsonb_build_object('Content-Type','application/json','apikey','<sb_secret_…>'),
    body := '{}'::jsonb, timeout_milliseconds := 5000) $$);
```
[I] Calling `pgmq.create` directly is standard pgmq. The Supabase docs show creating queues through the Dashboard [16]. Store the secret in Vault instead of inlining it, as the embeddings recipe does [19].

---

## 9. First 30 minutes checklist (Saturday 11:00)

1. (Do on Thursday or Friday) Create the org, redeem or prepare billing, **create the project in a US-West region** (us-west-2 if you want to join the Compute waitlist [29]), and save the URL plus publishable and secret keys to a team password manager.
2. `brew upgrade supabase` and check that `supabase --version` shows 2.122.x. `npm i @supabase/supabase-js@2.118.0`.
3. `supabase init && supabase link --project-ref <ref>`. Add MCP to Claude Code/Codex with `project_ref` and authenticate.
4. Dashboard: Auth → turn on Anonymous sign-ins. Realtime Settings → turn off "Allow public access" if you use private channels.
5. Apply migration 8.2. Test with two browser tabs and confirm that broadcast and presence work.
6. `supabase functions new agent-step`, deploy, run `supabase secrets set OPENAI_API_KEY=…`, and curl it.
7. Decide on spend cap: leave it ON unless the demo needs more than 500 concurrent sockets.
8. Open the Realtime Inspector and the Usage page in pinned tabs for the live "scale" slide.

---

## 10. Limits and what I could not verify

- **How the $25 is delivered** (code? automatic grant? card required?) is not confirmed. The `/redeem` route is live as of 29 Oct (307 to `/dashboard/redeem`) [13], but I did not sign in to test it with a real code.
- Whether the $25 counts toward overage when the spend cap is off, or only the plan fee, is not stated. The docs say credits apply to any future invoice [10].
- Whether Realtime counts failed or WebSocket Edge invocations is not spelled out on the pricing page [6].
- Supabase Compute and Multigres are invite or waitlist only. I did not test access.
- I did not run any CLI command or deploy anything. All behavior comes from docs or release metadata.
- The `us-west-1` region name is assumed, not checked in the dashboard.
- Who from Supabase judges the "scale to millions" prize and what criteria they use is not on the event page [0].

---

## Hackathon implications

- **What to build:** Terse Durable Actors (one per room, agent or séance) plus Agent Relay for agent chatter, with **Supabase as the shared fan-out and query layer**. Actors and agents write facts to Postgres, triggers run `broadcast_changes` to private channels, and thousands of browsers watch. The Terse docs themselves advise using a database for cross-entity queries, because actor calls aren't transactional across actors (see `../terse/01-docs-api.md` §FAQ). [I]
- **"Most likely to scale to millions" pitch, using documented primitives only:** Broadcast over Postgres Changes [5]. Sends that open no socket (`httpSend` or REST) [20]. Topic-scoped RLS [27]. Transaction-mode pooler for serverless [18]. pgmq for backpressure [16]. Realtime ceilings that can be raised on request [2]. Read replicas and Multigres (private alpha, 1 Oct) for HA and connection scaling [24]. OrioleDB public beta (1 Oct) for update-heavy tables such as agent state [24]. It is chosen at project creation and avoids table bloat and VACUUM [36]. Show the Usage page and a fan-out counter live. Context for the pitch: at Select (2 Oct) Supabase announced it is acquiring Turso, and stage material described "Spark" instances for "huge numbers of independent databases" [36][37]. That is a natural line if your design runs one actor per entity. Spark availability is (unverified), so don't build on it.
- **Gotchas:** Pro defaults to 500 sockets and 500 msg/s. Subscribing from servers multiplies cost. Public/private mismatches fail silently. Old SDKs silently drop binary payloads. Presence is not for cursors. 2 s CPU and 400 s wall clock on Edge. Only 2 auth emails per hour. Free projects pause after a week. `cron.job_run_details` grows forever. Don't `ALTER` the `realtime` schema. Avoid CLI v3 beta (15 beta tags landed on 29 Oct alone). Old tutorials use `anon` and `service_role` JWT keys. The `@supabase/server` Hono/H3/Elysia/NestJS adapters are deprecated. API-bundled deploys are capped at 5 MB.
- **Setup before Oct 31:** project created and keys saved, CLI pinned, MCP authenticated, anonymous auth on, the 8.2 migration rehearsed once, and a 200-tab or headless load script tested against your plan's limit.
- **What Supabase wants to see [I]:** Realtime plus Postgres as the backbone of a real-time AI system rather than "we stored a row." The October launches push agent-native tooling (MCP, Compute, Docker-free local stacks, app MCP servers) [29][31][34]. Mentioning one of them credibly, for example "our agents also act through our app's MCP server as users, under RLS," fits the company's current story.

---

## Sources

0. Event page capture: `/Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md` (from https://events.ycombinator.com/haunted-hacks-2026)
1. https://supabase.com/pricing
2. https://supabase.com/docs/guides/realtime/limits
3. https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages
4. https://supabase.com/docs/guides/platform/manage-your-usage/realtime-peak-connections
5. https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
6. https://supabase.com/docs/guides/functions/limits ; https://supabase.com/docs/guides/functions/pricing
7. https://supabase.com/docs/guides/api/api-keys
8. https://supabase.com/docs/guides/functions/auth
9. `gh release list` for supabase/cli, supabase/supabase-js, supabase/realtime, supabase/server; npm `@supabase/supabase-js`, `supabase`, `@supabase/mcp-server-supabase` (checked 29 Oct 2026)
10. https://supabase.com/docs/guides/platform/credits ; https://supabase.com/docs/guides/platform/billing-faq
11. https://supabase.com/docs/guides/platform/manage-your-subscription
12. https://supabase.com/docs/guides/platform/cost-control
13. https://github.com/supabase/supabase/pull/42377 (merged 4 Feb 2026) [BG]; https://github.com/supabase/supabase/pull/42496 (merged 6 Feb 2026) [BG]; https://github.com/supabase/supabase/pull/45909 (merged 18 May 2026) [BG]; live `curl -I https://supabase.com/redeem?code=TEST` (29 Oct 2026)
14. https://supabase.com/docs/guides/auth/rate-limits
15. https://supabase.com/docs/guides/cron ; https://supabase.com/docs/guides/cron/quickstart
16. https://supabase.com/docs/guides/queues ; https://supabase.com/docs/guides/queues/quickstart
17. https://supabase.com/docs/guides/storage/vector/limits
18. https://supabase.com/docs/guides/database/connecting-to-postgres
19. https://supabase.com/docs/guides/ai/automatic-embeddings ; https://supabase.com/docs/guides/ai/vector-columns
20. https://supabase.com/docs/guides/realtime/broadcast
21. https://supabase.com/docs/guides/functions/background-tasks
22. https://supabase.com/docs/guides/functions/websockets
23. https://supabase.com/docs/guides/functions/ai-models
24. https://supabase.com/changelog (entries dated 14 Jul to 23 Oct 2026)
25. https://supabase.com/docs/guides/getting-started/mcp
26. https://supabase.com/docs/guides/realtime/presence
27. https://supabase.com/docs/guides/realtime/authorization
28. https://supabase.com/docs/guides/queues/api
29. https://supabase.com/blog/supabase-compute-private-alpha (27 Oct 2026) ; https://supabase.com/blog/select-2026-build-anything (2 Oct 2026)
30. https://supabase.com/docs/guides/auth/auth-anonymous
31. https://supabase.com/blog/give-your-supabase-app-its-own-mcp-server (22 Oct 2026)
32. https://supabase.com/mcp ; https://github.com/supabase-community/supabase-mcp (README)
33. https://supabase.com/docs/guides/functions/quickstart
34. https://supabase.com/blog/local-supabase-project-per-agent-with-or-without-docker (14 Oct 2026)
35. https://supabase.com/blog/select-2026-scale-without-limits (2 Oct 2026) ; https://supabase.com/blog/select-2026-build-anything
36. https://supabase.com/blog/supabase-select-2026-recap (2 Oct 2026)
37. https://select.supabase.com/ (Select 26, 2 Oct 2026, talk list) ; https://www.thefrontier.dev/articles/supabase-select (15 Oct 2026, secondary)

---

## Verification log (2026-10-29)

An adversarial re-check of the most decision-relevant claims against live sources. Outcomes: **CONFIRMED** (matches the primary source), **CORRECTED** (edited in place above), **ADDED** (new material), **UNVERIFIED**.

1. **$25 Supabase credit per attendee, "equivalent to 1 free month of Pro plan"; $1K "most likely to scale to millions" prize.** Re-read in EVENT_PAGE.md lines 14 and 86. CONFIRMED.
2. **Pro $25 + Micro $10 − $10 compute credit = $25 for one project. A second project adds $10.** The pricing page gives the worked example "$25 (plan) + $10 + $10 - $10 (credits) = $35/month". CONFIRMED.
3. **Pricing table (MAU, egress, storage, Edge invocations, Realtime 2M/5M messages, 200/500 peak connections, $2.50/1M, $10/1k, 256 KB/3 MB, branching $0.01344/h, compute add-on table to 16XL $3,730).** Pricing page via Exa. CONFIRMED. Package billing for whole 1M and whole 1k is confirmed on the manage-your-usage pages. The "2,000 sockets is about $20" math matches the docs' own example: 1,700 peak gives $20.
4. **Realtime limits (200/500/10,000 connections; 100/500/2,500 msg/s; presence 20/50/1,000; 5 presence calls per 30 s; replay 72 h/25; 64-byte Postgres Changes fallback; error codes).** realtime/limits page. CONFIRMED, all cells.
5. **Servers that subscribe are billed as recipients and count as peak connections. Use REST.** Both manage-your-usage pages say this nearly verbatim. CONFIRMED.
6. **Broadcast is "the recommended method for scalability and security". Postgres Changes "does not scale as well".** subscribing-to-database-changes page. CONFIRMED (exact quotes).
7. **Edge Functions: 256 MB, 2 s CPU, 150 s/400 s wall clock, 150 s idle, 20 MB/5 MB, 100/1,000 functions, ports 25/587 blocked, no sharp/libvips.** functions/limits page. CONFIRMED. ADDED: "Static files cannot be deployed using the API flag", plus the 5 MB cap on API fallback deploys.
8. **`withSupabase` from `npm:@supabase/server@1`, `export default { fetch }`, auth modes, ctx fields.** functions/auth page. CONFIRMED. Also confirmed that `withSupabase` "can't authenticate WebSocket clients" (functions/websockets). CORRECTED: the implication that `Deno.serve` is obsolete is wrong, because Supabase's own 22 Oct MCP blog uses `Deno.serve(pipeline(...))`.
9. **Legacy `anon`/`service_role` keys deprecated "by the end of 2026". The grants-before-RLS gotcha.** api-keys page. CONFIRMED (exact phrase).
10. **Versions: CLI 2.122.0 (23 Oct), v3 betas on 29 Oct, supabase-js 2.118.0, @supabase/server 1.9.2, Realtime 2.150.1, MCP 0.15.0.** `gh release list` plus `npm view`. CONFIRMED. CORRECTED/ADDED: npm dist-tags (`beta` 3.0.0-beta.15, `next` 3.0.0-next.27), the scale of the beta burst (beta.1 to beta.15 on 29 Oct), and the publish dates. Realtime 2.150.1 was published 2026-10-30 00:09 UTC, which is 29 Oct Pacific.
11. **Credit-code redemption "unverified, behind a flag".** PR #42377 merged 4 Feb 2026 (flag off at merge). Follow-ups #42496 (redeem page, merged 6 Feb) and #45909 (redesign, merged 18 May) found. Live `curl` shows that `supabase.com/redeem?code=…` redirects 307 to `/dashboard/redeem`, which returns 200. CORRECTED: the route is live. Whether the sponsor uses codes, and whether a card is required, is still UNVERIFIED.
12. **Spend cap scope, and "further usage of that item is disallowed until the next billing cycle".** cost-control page. CONFIRMED (exact quote; the excluded items list matches).
13. **Auth: 2 emails/h, anonymous 30/h per IP, OTP/sign-in 30 per 5 min per IP, 60 s per user, token endpoint 150 per 5 min.** auth/rate-limits page. CONFIRMED.
14. **Changelog dates: realtime schema locked 14 Jul; scoped PATs GA 6 Oct; Go SDK alpha 5 Oct; .NET official 9 Oct; Multigres private alpha and OrioleDB public beta 1 Oct.** supabase.com/changelog. CONFIRMED. ADDED: `@supabase/server` framework adapters deprecated 5 Oct, removal on 1 Dec 2026.
15. **Supabase Compute private alpha (CLI ≥2.120.0, `[experimental] compute = true`, us-west-2, 2 GB/1 vCPU or 4 GB/2 vCPU, restarts, no autoscale/GPU/disk).** Compute blog. CONFIRMED. ADDED: all secrets are shared with every service, and public services suspend when idle.
16. **App MCP server: shadcn URL, `withOAuthProtectedResource` + `withSupabase({auth:'user'})`, asymmetric keys, OAuth 2.1 server, DCR, consent block, `verify_jwt = false`. Announced at Select on 2 Oct.** MCP blog plus select.supabase.com ("October 2nd"). CONFIRMED. The Select post also shows the alternative `npx shadcn@latest add @supabase/mcp-server`.
17. **Docker-free stack (CLI 2.119.0, `SUPABASE_EXPERIMENTAL_STACK=1`, `--runtime native`, macOS 14 Apple silicon or glibc 2.35, 290 MiB vs 2.6 GiB).** 14 Oct blog. CONFIRMED. ADDED: the "alpha, off by default" status and the Docker-preferred caveat for several projects on one laptop.
18. **Cron "no more than 8 Jobs concurrently / 10 minutes".** cron page. CORRECTED: the docs phrase this as a recommendation ("For best performance, we recommend…"), not a hard limit. Sub-minute needs PG 15.1.1.61 or later, and `job_run_details` "not cleaned up automatically" (quickstart). CONFIRMED.
19. **Queues: pgmq ≥15.6.1.143, lowercase names, logged/unlogged, `pgmq_public`, grants.** queues/quickstart. CONFIRMED.
20. **Broadcast details: httpSend 2.76.0 / binary 2.107.0, binary receive 2.91.0 / swift 2.44.0, old SDKs drop silently, replay rules and SDK minimums, DB broadcasts private by default, Python no `ack`.** broadcast page. CONFIRMED.
21. **Supabase.ai `gte-small` "384-dim".** ai-models page gives the model name and the 512-token truncation but **no dimension**. Marked (unverified) on the page.
22. **Presence warning against `track()` on mouse move.** presence page: "Calling `track()` rapidly — for example on every mouse move … will flood the channel". CONFIRMED.

No fabricated quotes or URLs were found. Every quoted phrase that was re-checked appears in the cited source. Not re-checked: the Storage vector-bucket limits [17], the pooler hostname format [18], and the full hosted-MCP tool list [32]. Treat those as the original author's reading.
