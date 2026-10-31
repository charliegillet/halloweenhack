# Supabase: GitHub and code reality (for Haunted Hacks, Oct 31 2026)

Compiled 2026-10-29. Angle: what the repos, releases, issues, and discussions show about Realtime (Broadcast/Presence/Postgres Changes), Edge Functions, Queues, MCP, and the CLI, and which sharp edges a 5-hour team will hit. Data was pulled live with the `gh` CLI (REST + GraphQL) on 2026-10-29 unless marked otherwise. Docs claims come from the docs source in `supabase/supabase/apps/docs`, read through the GitHub API.

Labels: **[V]** = verified directly from the cited GitHub object. **[I]** = my inference. **Background** = older than Aug 1 2026.

---

## 1. Org and repo snapshot (as of 2026-10-29) [V]

`supabase` org: 177 public repos, 12,595 followers (`gh api orgs/supabase`).

| Repo | Stars | Forks | Open issues+PRs | Last push | Notes |
|---|---|---|---|---|---|
| supabase/supabase | 114,312 (114,325 on re-check later 2026-10-29) | 16,321 | 1,179 | 2026-10-29 | Monorepo: Studio, docs, `examples/`. 1,820 commits on default branch since Aug 1 |
| supabase/realtime | 7,673 | 479 | 92 | 2026-10-30 | Elixir. Broadcast, Presence, Postgres Changes |
| supabase/supabase-js | 4,605 | 781 | 133 | 2026-10-28 | Includes realtime-js. 88 commits since Aug 1 |
| supabase/mcp | 2,983 | 424 | 120 | 2026-10-29 | Official MCP server (`supabase-community/supabase-mcp` now resolves to the same repo) |
| supabase/agent-skills | 2,953 | 256 | 522 | 2026-10-02 | Skills `supabase` and `supabase-postgres-best-practices` |
| supabase/auth | 2,589 | 799 | 400 | 2026-10-28 | GoTrue fork |
| supabase/cli | 2,447 | 540 | 56 | 2026-10-29 | v3 in beta (see section 2) |
| supabase/etl | 2,350 | 191 | 37 | 2026-10-30 | Rust CDC/replication |
| supabase/edge-runtime | 999 | 134 | 26 | 2026-10-28 | Deno-based runtime behind Edge Functions |
| pgmq/pgmq | 5,362 (5,364 on re-check) | 149 | 29 | 2026-10-20 | The queue extension behind Supabase Queues. It moved from `tembo-io` to its own `pgmq` org |

Realtime contributors since Aug 1, by commit count (excluding bots): edgurgel 60, PragTob 48, leandrocp 42, seangeo 24, hsusul 16, filipecabaco 11, mandar1045 10. semantic-release-bot cut **144** releases in this window. [V]

## 2. Release cadence (last ~90 days) [V]

- **Realtime:** 144 releases since Aug 1, several per day. Latest is v2.150.1 (2026-10-30T00:09Z). The hosted server can change under you mid-hackathon. [V] [I]
- **supabase-js:** latest stable **v2.118.0** (2026-10-15). v2.119.0 canaries run up to canary.4 (2026-10-28). Realtime fixes since Aug: "prevent duplicate on bindings" (#2594), "clear stale join payload on sign-out" (#2597), "ensure setAuth doesn't disable token refresh" (#2592), "allow wait for pg changes" (#2630). [V]
- **CLI:** latest stable **v2.122.0** (2026-10-23). On Oct 29 (UTC) the CLI repo cut `v2.123.0-beta.13` through `beta.17`, `v3.0.0-next.26`/`next.27`, `v3.0.0-beta.1` and `v3.0.0-beta.14`, and `v3.0.0-beta.15` followed at 2026-10-30T02:17Z. Prereleases are landing hourly; `releases/latest` still returns v2.122.0. v2.122.0 added `supabase/supabase.lock` to pin local stack versions, and fixed Podman start/stop and idle gateway connections dropping (`TypeError: fetch failed`). [V]
  - **v3 breaking change coming:** PR #7186 (merged 2026-10-20) adds a warning that "v3 ... makes the local stack the default target for every command that can run against either the local stack or a hosted project, with one `--remote` flag to reach a project." It affects `db push`, `db pull`, `gen types`, `migration *`, `storage *`, and `inspect`. [V]
- **Edge runtime:** v1.77.2 through v1.77.9 shipped between Sep 30 and Oct 28. [V]
- **MCP server:** v0.11.0 (Aug 20), v0.12.0 (Sep 4), v0.13.0 (Sep 17), v0.14.0 (Oct 14), **v0.15.0 (Oct 29)**. 0.14 added a health advisor and "destructive SQL observations", and stopped the double cost confirmation on `create_project`. 0.15 added `submit_feedback` and `delete_feedback` tools, detection of instant elicitation cancels, an error when a confirmation expires, and fixes for splitting UPDATEs on semicolons inside quoted or dollar-quoted values. [V]
- **pgmq:** v1.13.0 (Sep 7) fixed "partitioned queues silently overrun premake and cannot recover". v1.13.1 (Oct 20) added "read with poll" methods to the Rust `Queue` trait, fixed "insert notifications never fire for a queue name that is not all lowercase", and shipped two security fixes (hardened `search_path`; no `pg_monitor` SELECT on queue tables) with the advice that "everyone on v1.13.0 or earlier upgrade". [V] [I] Whatever pgmq version the hosted project ships, use all-lowercase queue names.

## 3. New in Aug-Oct 2026 that matters for a "real-time AI" demo

1. **Broadcast persistence, server-side.** realtime PR #2022 "feat: broadcast persistence" merged 2026-08-31. It stores broadcast messages in `realtime.messages` so they can be replayed. It sits behind a feature flag, `broadcast_persistence`. PR #2235 "broadcast persistence opt-in" merged **2026-10-29** and adds a per-message flag: `channel.send({ type: 'broadcast', event, payload, persist: true })` or `persist: { ttl: 3600 }`, and REST `?persist=true`. [V] **Gotcha [I]:** this merged two days before the event, is flag-gated, and I found no supabase-js stable release that exposes `persist`. Don't plan a demo around it.
2. **Broadcast Replay (already documented, usable).** Private channels can fetch earlier messages with `config.broadcast.replay = { since, limit }`. `limit` is at most 25 per request. Retention is 72 hours, stored in daily partitions; because whole days are dropped, a message survives "at least 72 hours and at most 4 days". **Only messages sent through "Broadcast From the Database" (`realtime.send`) are replayable.** Requires supabase-js >= 2.74.0. Source: `apps/docs/content/guides/realtime/broadcast.mdx`, around line 1138. [V] **Partition gotcha (same file, ~line 1034):** "A client connecting over WebSocket creates those daily partitions. `realtime.send` does not." With no partition for today the insert fails with a `WarnSendingBroadcastMessage` Postgres warning, so connect a client before you broadcast from the database. On a fresh demo morning, open the page first, then fire DB triggers. [V]
3. **`channel.httpSend()`** sends a broadcast over REST without opening a socket (supabase-js >= 2.76.0). Binary payloads need >= 2.107.0. Docs commit #51466 (2026-10-23) "warn against subscribing to publish from servers": in server code, use `httpSend`, not subscribe-then-send. [V]
4. **Postgres Changes "wait".** realtime PR #2109 (merged 2026-08-26): `postgres_changes_options: { wait: true, timeout: 15000 }` makes the join wait until the CDC subscription actually exists. The client side shipped in supabase-js #2630. [V] This fixes the classic "SUBSCRIBED but no events yet" race.
5. **Application-side RLS evaluation experiment** (realtime #2384, merged 2026-10-28) speeds up channel joins during mass reconnects. It's an experiment, not a guarantee. [V]
6. **BYO MCP server on Edge Functions.** Docs PR #50218 (2026-09-15) rewrote the guide around `@modelcontextprotocol/server` v2 `createMcpHandler` and a new auth middleware. PR #51031 (2026-09-30) dropped "alpha" labels: `@supabase/middleware` is 1.0.0, `@supabase/server` has a 1.6.0 floor, and imports should be pinned as `npm:@supabase/server@1` and `npm:@supabase/middleware@1`. Examples live at `examples/edge-functions/supabase/functions/mcp/{simple-mcp-server,authenticated-mcp-server}`. [V]
7. **Supabase Compute (private alpha).** Discussion #52403 (2026-10-27): it runs "agents, background jobs, and APIs inside your Supabase project ... like an agent that runs for an hour". It deploys Node, Deno, or a Dockerfile via `supabase compute push`. It's free during alpha, **us-west-2 only**, and has a waitlist. "A service can be restarted at any time, so save long-running work to Postgres." [V] The launch blog (https://supabase.com/blog/supabase-compute-private-alpha, fetched 2026-10-29) adds: needs CLI v2.120.0+, `compute = true` under `[experimental]` in `config.toml`, `supabase compute new`, sizes 2 GB/1 vCPU or 4 GB/2 vCPU, "no autoscaling, GPU, or persistent disk", public services suspend when idle, every service gets all project secrets, and it lists "A WebSocket service for low-latency, real-time apps like voice agents" as a use case. [V] Inference: you probably can't count on access by Oct 31. If you have it, it fits the "long-running agent" brief.

## 4. Hard limits from the docs source [V]

From `apps/docs/content/guides/functions/limits.mdx` and `guides/realtime/limits.mdx`:

**Edge Functions:** 256 MB memory. Wall clock 150 s on Free, **400 s on paid** (the $25 event credit equals one month of Pro). **2 s CPU per request.** Request idle timeout is 150 s and returns 504. Bundle size is 20 MB from the CLI, 5 MB from the Dashboard/API. Nested calls are capped at 30 per trace in a 60 s window. `text/html` GET responses are rewritten to `text/plain` unless you use a custom domain. No Web Workers or `vm`. No multithreaded Node libs (sharp, libvips). Ports 25 and 587 are blocked.

**Realtime (Free / Pro / Pro without spend cap):**

| Limit | Free | Pro | Pro, no cap |
|---|---|---|---|
| Concurrent connections | 200 | 500 | 10,000 |
| Messages/sec | 100 | 500 | 2,500 |
| Channel joins/sec | 100 | 500 | 2,500 |
| Presence messages/sec | 20 | 50 | 1,000 |
| Broadcast payload | 256 KB | 3,000 KB | 3,000 KB |

Fixed on every plan: 100 channels per connection, 10 Presence keys per object, 5 Presence calls per client per 30 s, and a 1,024 KB Postgres Changes payload limit (above it, only fields of 64 bytes or less are sent). Hitting the message rate triggers a `tenant_events` disconnect. Other errors: `too_many_channels`, `too_many_connections`, `too_many_joins`.

[I] **The Presence limit of 5 calls per client per 30 s is the trap for "live cursors" or "agent status" demos.** Put high-frequency state (cursors, token streams) in Broadcast and use Presence only for join/leave and coarse status.

## 5. Open bugs and sharp edges by area (all [V] unless noted)

### Realtime / realtime-js

- **Silent LongPoll fallback in browsers.** supabase-js #2768 (open, 2026-10-15): the bundled `@supabase/phoenix` does `opts.transport || global.WebSocket || LongPoll`. Without a `global` shim (Vite, esbuild, and Angular don't add one by default), the client falls back to LongPoll. Channels report `SUBSCRIBED` but `postgres_changes` events are never delivered and nothing is logged. The issue says this is still shipped in 2.118.0. [I] Mitigation: in Vite, add `define: { global: 'globalThis' }` or pass `realtime: { transport: WebSocket }` in client options. Check DevTools for a `wss://` connection in the first hour.
- **A broadcast payload with an `ids` key crashes the shared socket.** supabase-js #2801 (open, 2026-10-28): `{ ids: [...] }` without `data` is mistaken for a batched Postgres change and throws in `_updateFilterTransform`, and broadcasts stop **for all channels**. Never use a top-level `ids` key in broadcast payloads (for example agent message IDs). Nest them instead.
- **`realtime.send()` silently drops non-object JSON.** realtime #2389 (open, 2026-10-13): arrays, strings, numbers, and null raise a WARNING, nothing is stored, and nothing is broadcast. Always send a JSON object.
- **The positional `private` flag on `realtime.send` was documented inconsistently.** supabase/supabase #50532 (closed; docs fixed in #50537 on 2026-10-19). Signature: `realtime.send(payload jsonb, event text, topic text, private boolean)`. Getting `private` wrong means private-channel subscribers never see the message.
- **A filter on an array column breaks Postgres Changes for the whole project.** realtime #2361 (open, 2026-10-07): `tags=is.null` on `text[]` causes `malformed array literal`, and every subscriber misses changes, including on other tables.
- **One subscriber whose RLS evaluation raises kills Postgres Changes for all subscribers.** realtime #2093 (open; production incident 2026-08-13, about 2.5 h lost).
- **Stale JWT after a tab wakes.** supabase-js #2613 (open, 2026-08-15): a hidden tab that becomes visible reconnects without re-auth, so private channels fail with `InvalidJWTToken: Token has expired`. This matters during demos where a laptop sleeps between rehearsal and stage. [I] Reload the tab before you demo.
- **Out-of-order broadcasts across nodes.** realtime #2424 (open, 2026-10-26): bursts (batch REST broadcasts, several `realtime.send` calls in one transaction, fast pushes) can arrive reordered for subscribers on other nodes. [I] For LLM token streaming over Broadcast, add a sequence number and reorder on the client.
- **Local Docker: `realtime.send()` from SQL is not delivered** (realtime #1730, open since 2026-03-02; background). Client `channel.send` works locally, but DB-originated broadcasts may not. [I] Test DB-triggered broadcasts against a hosted project, not just `supabase start`.
- **Unpublished table means silence.** The table must be added with `alter publication supabase_realtime add table ...`. Otherwise the channel reaches SUBSCRIBED and gets nothing. Community write-up: discussion #52006 (2026-10-20, explicitly "unofficial").
- **RLS on `realtime.messages`:** `alter table realtime.messages enable row level security` in a migration fails with `42501 must be owner of table messages`. Only `create/alter/drop policy` is allowed through `supautils` (discussion #50926, copy of an official troubleshooting article, 2026-09-25).
- Latency reports exist: supabase/supabase #51629 (open, 2026-10-13) describes joins taking about 30 s and `ErrorOnRpcCall PostgresCdcRls create_subscription` timeouts on one project. It's a single report, so its frequency is unknown.

### Edge Functions / edge-runtime

- **Cold-isolate freeze of about 75 s on the first outbound socket**, reported on "~50% of cold isolates", with timers frozen too (edge-runtime #738, open, 2026-09-13). [I] If your function calls OpenAI on a cold start, add a warm-up ping before demoing and use client-side timeouts and retries.
- Memory grows without release until a crash (#740, open). Retired workers aren't fully reclaimed (#719, open).
- **HTTP/2 closes with no response on function-generated 4xx** (supabase/supabase #51893, open, 2026-10-18). Clients may see a network error instead of your JSON error.
- **A function served code that was never deployed for about 75 minutes** after the first deploy (edge-runtime #721, open, 2026-08-25; title: "served code that was never deployed for ~75 min after first deploy"). `functions deploy` can exit 0 without deploying under concurrent load (cli #6247, open; 138 of 237 functions missing). [I] After each deploy, check that a version string in the response changed.
- Local "stack" engine: every request starts a new worker, so each call pays a cold start (cli #7274, open, 2026-10-22). Local latency won't match hosted.
- `node:crypto` `X509Certificate` methods aren't implemented (#750, #761). This doesn't matter for most hacks.

### Keys, auth, gateway

- **New `sb_secret_` keys:** intermittent `PGRST303 JWT issued at future` 401s (supabase/supabase #50651, open, 2026-09-21; earlier #49655 closed "awaiting-details"). About 10x the instance CPU of the legacy `service_role` key per Data API request, with JWT cache hits around 0.6% (#51510, open, 2026-10-10). [I] On a Free or Micro instance under demo load, prefer the legacy `service_role` JWT for server-to-server calls if the project still offers it, or retry on PGRST303.
- The gateway (`sb_gateway_version: 2`) sometimes holds browser requests for about 5 s (#52011, open, 2026-10-20; one Free-plan project in the SIN region).
- `config push` with `[auth.email] enable_signup = false` disables password sign-in for **all** users (cli #7055, open). Don't toggle this during a demo.

### Queues / Cron

- The Dashboard "partitioned queue" creation fails with `function pgmq.create_partitioned(unknown, integer, integer) does not exist`. The Studio form sends integers but the params are `text` (supabase/supabase #52479, closed 2026-10-29). [I] Create queues in SQL with `select pgmq.create('jobs');`, which is unaffected per the issue ("Basic and unlogged queue types are unaffected").
- Supabase Queues has no push consumer. You poll (`pgmq.read`, or the new "read with poll" in pgmq 1.13.1), typically from pg_cron plus pg_net calling an Edge Function. That last part is [I] from the architecture; I didn't find a specific GitHub issue for it in this window.

### MCP

- The hosted endpoint is `https://mcp.supabase.com/mcp?project_ref=<ref>&read_only=true&features=database,docs` (supabase/mcp README). [V] Scoping to one project and `read_only=true` is the documented safe mode. 0.14 and 0.15 added destructive-SQL observations and confirmation (elicitation) flows. A confirmation that expires now returns a tool error (0.15). [I] Agents driving MCP may stall on confirmations in non-interactive loops.

## 6. Official examples and templates worth cloning [V]

`supabase/supabase/examples/` holds `ai`, `auth`, `edge-functions`, `realtime`, `slack-clone`, `todo-list`, `user-management`, `with-cloudflare-workers`, `prompts`, and more.

- `examples/realtime/`: `nextjs-auth-presence`, `nextjs-authorization-demo` (private channels with RLS), `flutter-multiplayer-shooting-game`, `flutter-figma-clone`.
- `examples/edge-functions/supabase/functions/`: `openai`, `openai-image-generation`, `streams`, `elevenlabs-speech-to-text` and `elevenlabs-text-to-speech`, `mcp/simple-mcp-server` and `mcp/authenticated-mcp-server`, `upstash-redis-ratelimit`, `discord-bot`, `slack-bot-mention`, `telegram-bot`, `background-upload-storage`, `stripe-webhooks`.
- `examples/ai/`: `vector_hello_world.ipynb`, `image_search`, `llamaindex`, `semantic_text_deduplication.ipynb`, `llamafile-edge`.
- Example commits since Aug are mostly docs maintenance: the MCP middleware bump (Sep 21), the BYO-MCP rewrite (Sep 15), and a Fireworks AI guide (Oct 26). I found no new realtime example in the window.
- `supabase/agent-skills` v0.1.9 (2026-09-28) provides coding-agent skills (`supabase`, `supabase-postgres-best-practices`). It's worth loading into Claude Code or Codex before the event.

## 7. Community projects built on Supabase (relevant patterns)

- **akdeb/ElatoAI** (2,088 stars, pushed 2026-10-25): realtime voice AI on an ESP32. Deno edge servers bridge to the OpenAI Realtime API, Gemini Live, Grok, ElevenLabs, and Hume. Transcripts and auth live in the Supabase DB. The README says ">20-minute uninterrupted conversations". It's linked from an OpenAI Cookbook entry. [V] It's a good reference for proxying OpenAI Realtime through Deno.
- **dmotz/trystero** (2,820 stars, pushed 2026-10-29): WebRTC matchmaking with a Supabase strategy (`@trystero-p2p/supabase`), which uses Realtime as the signaling channel. [V]
- **tinbase/tinbase** (354 stars): "Supabase-compatible backend in a single binary". [V]
- Mastra integration: `mastra-ai/mastra` has `auth/supabase` (Supabase Auth provider) and `packages/connect/src/providers/supabase/tools/*` (`invoke-rpc`, `query-table-rows`, `upsert-table-row`, and auth-user tools). [V] Combining Mastra and Supabase covers two sponsors.
- Small Supabase + OpenAI Realtime repos exist (jefhild/NuxtChat, 16 stars; several with 0 stars). None are significant. [V]

## 8. Limits / could not verify

- I didn't check whether hosted projects have the `broadcast_persistence` flag enabled, or whether supabase-js stable exposes `persist`. My inference is no, given #2235 merged on 2026-10-29.
- I couldn't see Supabase Compute access or post-alpha pricing. Sources are discussion #52403 and the launch blog post; I did not verify waitlist turnaround.
- The "~50% of cold isolates" freeze (#738) and the `sb_secret_` CPU cost (#51510) are each one reporter's measurements, with no maintainer confirmation that I found.
- Open-issue counts from `gh api` include PRs. agent-skills' 522 is mostly PRs: `gh issue list` showed 1 open issue.
- I didn't check the Discord, X, or Reddit sentiment, which is another agent's angle. I also didn't check Terse or Agent Relay code for Supabase adapters.

---

## Hackathon implications

**What to build (Supabase angle, [I]):**
- Use Supabase as the **durable record and fan-out layer**, and Terse Durable Actors / Agent Relay as the compute and agent bus. Actors write state transitions to Postgres. A trigger calls `realtime.send(jsonb_build_object(...), 'event', 'room:<id>', true)` so every browser watching sees agent activity live. Late joiners use **Broadcast Replay** (`since`, `limit` of 25 or fewer). This is a defensible "scale to millions" story: Broadcast fans out from the Realtime cluster rather than through Postgres CDC per subscriber, and Pro without a spend cap lists 10k connections and 2.5k msg/s per project.
- Use pgvector for agent memory, and Queues (pgmq, created in SQL) plus pg_cron to wake idle agents. That covers all four Supabase primitives in one diagram, which suits the $1k "most likely to scale" pitch.
- Optional: expose your app's state to agents through a BYO MCP server on Edge Functions (`examples/.../mcp/authenticated-mcp-server`, `npm:@supabase/server@1`).

**Gotchas, ranked by likelihood of costing you an hour:**
1. Browser realtime silently on LongPoll (Vite with no `global`). Confirm a `wss://` socket in DevTools (#2768).
2. Table not in the `supabase_realtime` publication, or RLS with no select policy. Both fail silently.
3. Wrong positional `private` flag on `realtime.send`, or a non-object payload. Both are silent drops (#50532, #2389).
4. A top-level `ids` key in a broadcast payload kills the socket (#2801).
5. Presence spam: 5 calls per client per 30 s. Use Broadcast for frequent updates.
6. Edge Functions: 2 s CPU and 150 s/400 s wall clock. An LLM stream longer than that dies. Stream from the actor or client, or use `EdgeRuntime.waitUntil` background tasks within the limit. Cold-start freeze (#738): warm before demo.
7. Testing DB-originated broadcasts only locally (#1730). Test on hosted. Also: `realtime.send` fails if no client has connected yet today (no daily partition). Open a client first.
8. Token-stream ordering across nodes (#2424). Add a `seq` field.
9. Don't use the Dashboard to create partitioned queues (#52479).
10. CLI: install **v2.122.0 stable**, not v3 beta. v3 flips the default target to local. Pass `--linked` explicitly in scripts.

**Setup before Oct 31:**
- Create the hosted project now in **us-west-2** (the only region eligible for the Compute alpha; us-west-1 (N. California, unverified for this date) is closer to SF but forecloses Compute), redeem the $25 credit for Pro (400 s wall clock, 3 MB broadcasts), and note the URL and both key types. Keep the legacy `service_role` JWT if it's offered, as a fallback for #50651.
- Pin `@supabase/supabase-js@2.118.0`. Spike a 20-line page that subscribes to a private channel with replay and receives a `realtime.send` from a SQL trigger. Verify a `wss` socket.
- Set up a migration with `alter publication supabase_realtime add table ...`, RLS policies on `realtime.messages` (policies only, no ALTER TABLE), `create extension vector`, and `pgmq.create`. Rules say code must be written at the event, so keep this as notes or a checklist, not committed code [I].
- Add the Supabase MCP (`read_only=true`, `project_ref` scoped) and `supabase/agent-skills` to your coding agent.

**What judges and sponsors likely want [I]:** Supabase's $1k prize says "scale to millions". Show the limits table, explain why the design is Broadcast-first rather than Postgres Changes (Postgres Changes runs RLS per subscriber on the DB, and #2093 and #2361 show it failing project-wide), and run a live load burst (for example 200 simulated clients) in the demo. Hosts' judges want Durable Actors and Agent Relay at the center, so Supabase should be the visible persistence and realtime spine, not the headline.

## Sources

- Repo metadata and releases: https://github.com/supabase/supabase , https://github.com/supabase/realtime/releases , https://github.com/supabase/supabase-js/releases/tag/v2.118.0 , https://github.com/supabase/cli/releases/tag/v2.122.0 , https://github.com/supabase/cli/releases/tag/v3.0.0-next.27 , https://github.com/supabase/edge-runtime/releases , https://github.com/supabase/mcp/releases/tag/mcp-server-supabase-v0.15.0 , https://github.com/supabase/mcp/releases/tag/mcp-server-supabase-v0.14.0 , https://github.com/pgmq/pgmq/releases/tag/v1.13.0 , https://github.com/pgmq/pgmq/releases/tag/v1.13.1 , https://github.com/supabase/agent-skills
- Realtime PRs: https://github.com/supabase/realtime/pull/2022 , https://github.com/supabase/realtime/pull/2235 , https://github.com/supabase/realtime/pull/2109 , https://github.com/supabase/realtime/pull/2384
- CLI v3 default target: https://github.com/supabase/cli/pull/7186
- Realtime issues: https://github.com/supabase/supabase-js/issues/2768 , https://github.com/supabase/supabase-js/issues/2801 , https://github.com/supabase/supabase-js/issues/2613 , https://github.com/supabase/realtime/issues/2389 , https://github.com/supabase/realtime/issues/2361 , https://github.com/supabase/realtime/issues/2093 , https://github.com/supabase/realtime/issues/2424 , https://github.com/supabase/realtime/issues/1730 , https://github.com/supabase/supabase/issues/50532 , https://github.com/supabase/supabase/issues/51629
- Edge issues: https://github.com/supabase/edge-runtime/issues/738 , https://github.com/supabase/edge-runtime/issues/740 , https://github.com/supabase/edge-runtime/issues/719 , https://github.com/supabase/edge-runtime/issues/721 , https://github.com/supabase/supabase/issues/51893 , https://github.com/supabase/cli/issues/6247 , https://github.com/supabase/cli/issues/7274
- Keys/gateway/config: https://github.com/supabase/supabase/issues/50651 , https://github.com/supabase/supabase/issues/51510 , https://github.com/supabase/supabase/issues/52011 , https://github.com/supabase/cli/issues/7055
- Queues: https://github.com/supabase/supabase/issues/52479
- Supabase Compute blog: https://supabase.com/blog/supabase-compute-private-alpha
- pgmq release notes and broadcast partition note: https://github.com/pgmq/pgmq/releases/tag/v1.13.1
- Discussions: https://github.com/supabase/supabase/discussions/52403 , https://github.com/supabase/supabase/discussions/52006 , https://github.com/supabase/supabase/discussions/50926 , https://github.com/supabase/supabase/discussions/50671
- Docs source: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/functions/limits.mdx , https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/realtime/limits.mdx , https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/realtime/broadcast.mdx
- Docs/example PRs: https://github.com/supabase/supabase/pull/50218 , https://github.com/supabase/supabase/pull/51031 , https://github.com/supabase/supabase/tree/master/examples
- MCP README: https://github.com/supabase/mcp
- Community: https://github.com/akdeb/ElatoAI , https://github.com/dmotz/trystero , https://github.com/tinbase/tinbase , https://github.com/mastra-ai/mastra/tree/main/auth/supabase , https://github.com/jefhild/NuxtChat

## Verification log (2026-10-29)

Adversarial re-check by a second agent with `gh` (REST + GraphQL), the docs source via the contents API, and Exa fetch. "Confirmed" means the cited object says what the doc says.

1. **Star/fork/push table** (`gh api repos/...`, all 12 repos plus org): confirmed. Small drift from live growth only (supabase 114,325, pgmq 5,364; org followers 12,597). The fork/issue counts that had been missing for mcp (424/120), etl (191/37), and pgmq (149/29) were filled in, and that line was removed from Limits.
2. **Realtime: 144 releases since Aug 1, latest v2.150.1 at 2026-10-30T00:09Z**: confirmed. Paginated count = 144.
3. **supabase-js v2.118.0 latest stable (2026-10-15), v2.119.0-canary.4 (Oct 28)**: confirmed. PRs #2592/#2594/#2597 merged Aug 5-6, and #2630 merged Aug 27: confirmed.
4. **CLI v2.122.0 latest stable (2026-10-23), lock file, Podman fix**: confirmed from the release body. **Corrected:** the list of Oct 29 prereleases was incomplete, and `v3.0.0-beta.15` has since shipped (Oct 30 02:17Z).
5. **CLI PR #7186 quote and merge date (2026-10-20)**: confirmed verbatim from the PR body. The PR also names `db dump`, `migration fetch/list/repair`, and `inspect report`, and says to pass `--linked` to silence the warning. The doc's `--linked` advice is consistent with that.
6. **Realtime PR #2022 (merged 2026-08-31, flag `broadcast_persistence`) and #2235 (merged 2026-10-29T15:29Z, `persist: true` / `{ ttl }`, REST `?persist=true`)**: confirmed. TTL range is 1 to 259,200 s. A code search of supabase-js `realtime-js` found no `persist` implementation (only example files matched), which supports the "don't demo it" inference. Still inference.
7. **Realtime PR #2109 (wait on pg changes, 2026-08-26) and #2384 (RLS experiment, 2026-10-28)**: confirmed.
8. **Realtime limits table**: confirmed line by line against `guides/realtime/limits.mdx` (200/500/10k connections; 100/500/2,500 msg/s; Presence 20/50/1,000; 256 KB/3,000 KB; 5 Presence calls per 30 s; 25 replay messages; 72 h).
9. **Edge Functions limits (256 MB, 150 s Free / 400 s paid, 2 s CPU, 150 s idle timeout, 20 MB/5 MB, 30 nested calls per 60 s, ports 25/587, text/html rewrite)**: confirmed against `guides/functions/limits.mdx`.
10. **"$25 credit = one month of Pro"**: confirmed in EVENT_PAGE.md line 14. **"All code must be created at the hackathon"**: confirmed at line 60.
11. **Broadcast Replay (private only, DB-originated only, limit 25, 72 h, supabase-js >= 2.74.0) and `httpSend` versions (2.76.0, binary 2.107.0)**: confirmed in broadcast.mdx. **Added:** the "at most 4 days" retention nuance, and the missing daily-partition gotcha (`realtime.send` cannot create today's partition, so you get a `WarnSendingBroadcastMessage` warning).
12. **Supabase Compute (#52403, 2026-10-27, quotes)**: confirmed. The ellipsis quote is faithful. **Added** details from the launch blog post, which the original said it couldn't see. **Changed** the setup advice from "us-west near SF" to us-west-2.
13. **Issue states and dates** (supabase-js #2768/#2801/#2613; realtime #2389/#2361/#2093/#2424/#1730; supabase #50532/#51629/#51893/#50651/#51510/#52011/#52479; edge-runtime #738/#740/#719/#721; cli #6247/#7274/#7055): all confirmed open/closed as stated, with matching dates. **Corrected** the #721 wording: the function served "code that was never deployed", not "stale code".
14. **MCP v0.11 to v0.15 dates and the 0.14/0.15 notes**: confirmed. Added the `delete_feedback` tool and elicitation-cancel detection in 0.15. Hosted URL `https://mcp.supabase.com/mcp?project_ref=<project-ref>&read_only=true&features=database,docs`: confirmed in the README.
15. **pgmq v1.13.0 premake fix and v1.13.1 notes**: confirmed. **Added** the lowercase-queue-name notification fix and the security upgrade advisory.
16. **Docs PRs #50218 (2026-09-15), #51031 (2026-09-30, middleware 1.0.0, server 1.6.0 floor, `@1` pins), #51466 (2026-10-23), #50537 (2026-10-19)**: confirmed. Discussion #52006 is self-labelled "Unofficial and community-written" and covers the unpublished-table case: confirmed. #50926 (2026-09-25): confirmed.
17. **ElatoAI ">20-minute uninterrupted conversations" and the OpenAI Cookbook link**: confirmed in the README. agent-skills v0.1.9 (2026-09-28): confirmed.
18. **Discussion URLs**: rewritten from `github.com/orgs/supabase/discussions/N` to the repo form `github.com/supabase/supabase/discussions/N`. GraphQL resolved them under `supabase/supabase`; the org-form URL was not tested.

Not re-verified (left as originally sourced): per-contributor commit counts (section 1), 1,820 monorepo commits since Aug 1, edge-runtime #750/#761, the contents of the Mastra Supabase integration paths, and the NuxtChat star count.
