# Terse / Durable Actors: master brief for Haunted Hacks

> Consolidated **2026-10-29** (late evening PT; GitHub clock 2026-10-30 ~05:30 UTC) for Haunted Hacks: Real-Time AI Edition (Sat 2026-10-31, YC SF, build 11:00-16:00, judging 16:00-17:00).
> This brief merges five verified sub-files (linked below) and adds an editor's live re-check of the points where they disagreed. **[V]** = read in a primary source. **[I]** = inference. **[BG]** = before Aug 2026 (background). **(unverified)** = looked for and could not confirm. Sub-files hold the full detail and per-claim verification logs.

| Sub-file | Angle | Size |
|---|---|---|
| [terse/01-docs-api.md](terse/01-docs-api.md) | Docs, API surface, CLI, limits, copy-paste setup | 32 KB |
| [terse/02-newest-features.md](terse/02-newest-features.md) | Dated changelog, feature status (shipped / beta / announced) | 32 KB |
| [terse/03-github-code.md](terse/03-github-code.md) | Repos, activity, issues, code-level gotchas, example ranking | 34 KB |
| [terse/04-social-pulse.md](terse/04-social-pulse.md) | HN, X, LinkedIn, YouTube sentiment | 31 KB |
| [terse/05-team-strategy.md](terse/05-team-strategy.md) | Founders, funding, pivot, competition, what they want built | 29 KB |

---

## Executive summary

1. **What it is [V].** Terse (YC F26, NYC, 2 founders) builds **Durable Actors**, an open-source (MIT, Rust runtime with TS and Python SDKs) alternative to Cloudflare Durable Objects. An actor is "a tiny server that handles one request at a time and has its own SQLite database", addressed by (project, class, id). It sleeps after **10 s idle** and wakes on a call, WebSocket message or alarm, and WebSockets stay open at a gateway while it sleeps. **Terse Cloud** is the managed host, reached through the `terse` CLI and `terse-sdk`. It has been a public **beta since 2026-10-29 07:25 UTC**, about 52 hours before the event.
2. **Very young, very fast [V].** The repo was created 2026-08-30. It has **103 releases** (v0.1.0 on 09-02 to **v0.14.4 on 10-29 12:44 UTC**), **6 of them between Oct 27 and 29 UTC**, and `terse-cli` 0.14.3 → 0.14.7 shipped in under 19 hours. **v0.13.0 (10-27) broke clients generated with SDK ≤0.12.3.** Stars: **291** live on re-check (279 → 290 → 291 over Oct 29-30), 22 forks. No third-party code builds on it yet.
3. **The two hosts are already working together in public [V].** Agent Relay co-founder Khaliq Gant tweeted on Oct 8: *"We're moving over to their tech for @agent_relay ... Terse can't miss!"* On Oct 30 UTC (Oct 29 PT evening), Agent Relay co-founder **Will Washburn** opened #368, #369, PR #370 (Drizzle ORM, `db.query`/`db.transaction`) and PR #371 (closed) against `durable-actors`. Tekaratzas (Thomas) filed the matching #367 minutes earlier. A Durable Actors + Agent Relay build is therefore the story both hosts are already telling, and it also earns the event's "bonus points for both".
4. **Sentiment [V/I].** People like the idea ("more cloudflare alternatives", actors for agents) and doubt the numbers. The founders' own Show HN figure of **85.6 ms p95 durable write** drew "100ms for a write - not usable for anything beyond toys". GCP-only self-hosting and cross-actor state queries are the other complaints. Overall volume is small: one Show HN (53 pts / 25 comments) and founder posts.
5. **What wins with this host [I, grounded in their demos].** Multiplayer real-time AI, with one actor per room or agent, streaming LLM output broadcast to every client, and durability shown live (kill, restart, state is back). Second choice: an agent swarm guarding shared state, or a mini software factory (`@Resource` sandbox). Deploy it on Terse Cloud, not just localhost.

---

> ### What matters for Haunted Hacks (read this box if nothing else)
> - **Before Saturday:** `bun upgrade` (Bun **≥1.4.2** is required; this machine has **1.3.14**, current is 1.4.4). Run `bunx terse-cli@latest install`, then `terse auth login`, then create an API key at app.useterse.ai. Do one full `terse init x --template counter` → `terse actor dev` → `terse actor generate` → `terse deploy` round trip, then delete it (all event code must be written on the day).
> - **On Saturday morning:** check GitHub Releases for anything after v0.14.4, then **pin exact versions** (`terse-sdk`/`terse-cli` 0.14.7, `durable-actors` 0.14.4 as of Oct 29). Don't `bun update` during the hack. Regenerate the client after every change to an actor signature.
> - **Four rules that will otherwise break the demo:** (1) put `@Interleave` on any method that awaits an LLM, or the actor blocks every other caller; (2) **reassign** `@Persisted` arrays (`this.x = [...this.x, m]`) and never `.push()`, even though the README does; (3) never ship `TERSE_API_KEY` or the generated client to the browser, and have the backend hand out `prepareWebsocket` grants instead; (4) add sequence numbers to streamed socket messages (ordering is not guaranteed since v0.12.3) and write your own reconnect (auto-reconnect was removed in v0.7.16).
> - **Build:** a haunted multiplayer room or séance (one actor per room, an LLM ghost streaming to every player, alarms that "haunt" while all tabs are closed). Agents coordinate over Agent Relay, with each agent's memory or shared board in an actor. Run the observability UI or actor browser on a second screen.
> - **Prizes in play:** Durable Actors track = **iPhone Duo**; Agent Relay track = Mac mini; grand prize = YC interview + $5k OpenAI + $10k Freestyle + $1k Superserve + 3 months Mastra; Supabase $1k for "most likely to scale to millions". **Terse gives no credits**, and Terse Cloud has no published pricing or quotas beyond the OSS defaults (500 active actors per project, 50 starts/s).

---

## 1. Key facts

### 1.1 Company and people [V unless marked]

| Item | Fact | Source |
|---|---|---|
| Company | Terse Inc. dba Terse AI, YC **F26**, NYC, team of 2, group partner Aaron Epstein | YC company page |
| CEO | **Thomas Karatzas**: 7 yrs at Apple (Staff Engineer, Siri / Apple Intelligence platform). X `@karatzas_thomas`, HN `thomask1995`, GH `tekaratzas` (105 commits) | YC page, gh |
| CTO | **Olivier Simard-Morissette**: ex-Pigeon (YC W23), Squarespace, NYT. X `@oliviersm199`, HN `olism`, GH `oliviersm199` (**261 of ~374 commits**: runtime, storage, sandbox pool, Python SDK) | YC page, gh |
| Investors | "Articulate and Y Combinator (F26)". Articulate's standard check is $500K on a post-money YC SAFE; Terse's own round size is **(unverified)** | useterse.ai, f4.fund |
| Pivot [BG] | Mar-Jul 2026: "AI workflow platform for coding agents" (`terse-sdk`/`terse-cli` first on npm 2026-03-03). Actors repo created 2026-08-30 | npm, blog RSS |
| Origin story | Swift actors; 10 agents on shared Postgres state got stale snapshots; Cloudflare has "insane lock in" | YC page |
| Judges | Event page still says "Judges will be announced soon" (live re-check 10-29) | event page |

### 1.2 Packages and toolchains (two names, one engine) [V]

| Artifact | Latest (10-29) | Notes |
|---|---|---|
| npm `terse-cli` (bin `terse`) | **0.14.7** (16:37 UTC) | Hosted CLI; 167 versions; pins `durable-actors` 0.14.4. License "SEE LICENSE IN LICENSE.md" (Sustainable Use License body), **not MIT** |
| npm `terse-sdk` | 0.14.7 | Import `terse-sdk/actor`. Source repo `TerseAI/Terse` is private (404) even though the homepage links it |
| npm `durable-actors` | **0.14.4** | OSS SDK + CLI (`bunx durable-actors init/dev/generate/inspect/observe`), MIT |
| PyPI `durable-actors` | 0.14.4 | Python ≥3.11; `uvx --from 'durable-actors[cli]'` |
| GitHub `TerseAI/durable-actors` | 291★ / 22 forks / 22 open issues+PRs | Rust primary; builds for darwin and linux (x64, arm64), **no Windows** |
| Hosted docs | **4 pages** (Quickstart, Concepts, CLI, TypeScript Reference); no Python, no changelog, no pricing | docs.useterse.ai/llms.txt |

**Rule:** the hosted docs teach `terse-sdk/actor` + `terse actor dev` + `terse deploy`. The README and Oct 17 blog teach `durable-actors` + `bunx durable-actors dev` (the blog also shows the stale Bun 1.3.9). Use the hosted path and don't mix the two imports.

### 1.3 Limits and defaults (OSS `configuration.md`; hosted overrides unpublished) [V]

| Limit | Default |
|---|---|
| Active actors per project | **500** (enforced by default on hosted control planes; 429 `actor_quota_exceeded`) |
| Actor starts incl. wakes | **50/s, burst 100** (429 `actor_start_rate_limited` + `Retry-After`; the SDK does not retry these) |
| Idle eviction | **10 s** (1 ms to 24 h via `@Compute({ idleTimeoutMs })`). **Open WebSockets do not keep the actor alive** |
| Default size | 0.25 CPU / 256 MiB. `@Compute` server range 0.125-4 CPU, 256-4096 MiB. Any non-default size skips the prewarmed pool (slower cold start) |
| Alarms | **1 per actor**, polled every 100 ms. Fires while dormant; re-arm inside `onAlarm` |
| WebSockets | 32,768 per actor per process. Grants must connect before `connectByMs` |
| Sessions | Scoped RPC session TTL ≤60 s; JWT max 86,400 s |
| SQLite | `BEGIN/COMMIT/END/ROLLBACK/SAVEPOINT/RELEASE/ATTACH/DETACH/VACUUM` rejected; 10 introspection PRAGMAs allowed; `__terse_`/`_litestream_` prefixes reserved |
| Payload | 413 `payload_too_large` exists; no byte limit is documented |
| Self-reported perf (Show HN, 10-06) | p95: durable write **85.6 ms**, stateful read 2.14 ms, actor warm-up 334 ms. Predates the v0.9-v0.14 latency work; the promised benchmark.md is not published |

Operators can raise quotas per project in Postgres (the docs example shows 20,000 / 500 / 1,000), so **ask the Terse table** if your demo needs many actors [I].

---

## 2. Newest features, dated (last ~90 days)

| Date (2026) | What shipped or happened | Status |
|---|---|---|
| Aug 30 | `durable-actors` and `little-durable` repos created | — |
| Sep 2 | v0.1.0 (as "little-actors"): GCS leases and snapshots, generated clients | shipped |
| Sep 23 / 27 / 29 | v0.4.0 HTTP calls, dependency-free clients; v0.5.0 `outcome_unknown`, no auto-replay, project sessions; v0.6.0 Kubernetes + gVisor + Rust control plane, Helm | shipped |
| Oct 3 | Gateway-owned WebSockets + **hibernation**; `@Reentrant` → **`@Interleave`** | shipped |
| Oct 6 | `@Sandbox` → **`@Compute`**; **Show HN** (53 pts / 25 comments); "joining YC F26" tweet (~23.9k views) | — |
| Oct 7 | "Introducing Durable Actors" tweet (11,346 views); v0.7.16 **removes WS auto-reconnect**; "DST coming soon" | announced |
| Oct 9 | `whitechapel` co-op Victorian murder mystery (three.js, ElevenLabs via fal, actors on Terse Cloud) | demo |
| Oct 10 | v0.8.0: **Bun ≥1.4.2 required**, Python CLI via `uvx`, `this.db` in constructors | shipped |
| Oct 12-14 | Sponsor-aligned examples: OpenAI Agents SDK (Python), background-agents (Open-Inspect), **Mastra** multiplayer chat | examples |
| Oct 17 | Blogs: Terse vs Cloudflare DO, Terse vs Rivet | — |
| Oct 18 | **v0.8.1**: async Python actors, **`@Atomic`**, **Alarms**, Pi-durable adaptor, `inspect` CLI, `Unchecked<T>`. Terse-Examples switched to the hosted version | shipped |
| Oct 19 | Hackathon announced ("first (to our knowledge) Actor Hackathon"); "tiny Lovable" (`mini-lovable`) demo | — |
| Oct 22 | v0.9.0: **Modal sandbox provider**, `@Compute` requests vs limits, ClickHouse telemetry, Redis socket pub/sub | shipped (runtime) |
| Oct 23-24 | v0.10.0 usage metering; v0.11.0 org/billing suspension, runaway-start protection | billing groundwork |
| Oct 26 | v0.12.3: **socket output can arrive out of order**; a send right before close can be dropped | breaking-ish |
| Oct 27 | **v0.13.0**: all calls route via control plane; **SDK ≤0.12.3 clients break** ("control-plane response did not contain a valid actor host target"); upgrade clients first. v0.14.0 single warm-pool manager | breaking |
| Oct 28 | v0.14.1 fixes #351 (identical-bytes write killed DatabaseService; silent activation failure) | fix |
| Oct 29 | v0.14.2 **actor browser + residency view** (00:11 UTC); v0.14.3 observer >500 events; v0.14.4 stale admission slots (12:44 UTC); **Terse Cloud beta tweet 07:25 UTC**; **Launch YC 19:30 UTC** ("perfect primitive for Multiplayer AI and Agent Coordination"); 2 YouTube videos | beta / launch |
| Oct 30 UTC | Washburn #368-#371, Thomas #367 (ORM / nested transactions). **All open or unmerged** as of 05:30 UTC | proposal |

**Announced only, so don't rely on these:** "export SQLite table via CLI + MCP" ("coming soon, like today" on Oct 6; not shipped), DST, configurable durability, `onWake`/`onSleep` (PR #212), AWS/S3 storage (PR #273), deleting instances (#228), OTLP logs, `@Cron`.

---

## 3. Social sentiment (Aug-Oct 2026)

| Signal | Reading |
|---|---|
| Volume | One burst, Oct 6-8 (YC tweet, Show HN, launch tweet, LinkedIn). After that it is mostly founder posts. No Reddit, no Product Hunt; YouTube has 2 founder videos with single-digit views. The only organic mention outside its own thread is patcon in the 1,391-pt "Cloudflare acquires Deno" HN thread ("Rivet, and TerseAI's durable actors, celld") [V] |
| Praise | OSS vs Cloudflare lock-in, the actor model for agents, decorator-configured compute, multiplayer demos ("a tiny lovable built on durable actors is such a fun demo") [V] |
| Criticism | **Write latency** (anilgulecha: "100ms for a write - not usable for anything beyond toys", citing celld's ~1 ms); **GCP-only self-host**; **state query** across actors (Thomas: "I think we need something you can set up to sync to a data lake"); category confusion with Temporal (Olivier: "durable actors manages durable state, not durable execution") [V] |
| Education gap | "A groundbreaking 3 people knew what an actor was! (new record)" (@IncTerse); the Oct 23 explainer (12,887 views) is their best post-launch post [V] |
| Stars | gitnova: Oct 6 +29, Oct 7 +69, Oct 8 +30, then about 2-9/day; "organic, 1.2/10, Steady" (third party, not cross-checked) |
| Competition | Rivet 6.5k★ (3.0 preview 10-26 claims 0.69 ms p50 SQLite writes, 6.9 ms cold start), denoland/celld 6.2k★, cloudflare/agents 5.9k★. Cloudflare and Rivet both shipped Pi Durable integrations before Terse [V] |

[I] Judges will be the founders or people close to them. They come from platform engineering and care about correctness-by-default, data races and durability boundaries. Their weak spot is latency, so don't build a demo that depends on sub-10 ms durable writes.

---

## 4. Contradictions across sub-files: resolved or flagged

| # | Conflict | Resolution (editor live check, 10-29/30) |
|---|---|---|
| 1 | **Is Will Washburn Agent Relay?** 01 and 03: affiliation unverified. 04: Agent Relay co-founder | **Resolved: yes.** The Agent Relay Launch YC post (2026-10-23) is authored by Will Washburn: "We're Will and Khaliq". His GitHub profile names no company, which is why 01/03 couldn't confirm it. `AgentWorkforce/relay` (homepage agentrelay.com, 1,059★) and `AgentWorkforce/relaycast` ("Headless Slack for AI agents", 14★) are in the same org, so #369's relaycast engine reference is Agent Relay's own stack [I, strong] |
| 2 | **Rollback on failure (TS).** 01 and 03 flag that the docs contradict themselves; 02 states "a throw does not undo earlier writes" | **Still contradictory, live.** typescript-sdk.md line 310: "A failed call normally rolls back its field and SQLite changes." Line 331: "Each SQL write and each `@Persisted` assignment is saved as it happens ... If the method throws, writes made before the error stay saved." Line 339 adds that constructor SQL "commit[s] with the next successful method." **Assume no rollback unless the method is `@Atomic`**, and test it if it matters |
| 3 | **First release / count in Oct 27-29.** 01: v0.1.1 first; 03: 5 releases Oct 27-29 | **Resolved:** first is **v0.1.0** (2026-09-02 12:12 UTC); **6** releases Oct 27-29 UTC (v0.13.0, v0.14.0-v0.14.4); 103 total [V gh] |
| 4 | **Releases Oct 25-29.** An older 04 draft said 14 | 10 from v0.12.0 to v0.14.4 (11 with v0.11.1 at 02:40 UTC Oct 25); 15 since v0.9.0 (Oct 22) [V] |
| 5 | **Star count** 279 / 290 | **291** at 05:30 UTC Oct 30; it is moving, so quote it with a date |
| 6 | **Hosted sandbox provider.** An early 01 draft said Modal | **Unresolved.** The runtime default is `DURABLE_ACTORS_SANDBOX_PROVIDER=gke`; Modal is opt-in (v0.9.0); v0.13.0 mentions GKE spares. Don't claim either in the pitch. `MODAL_TOKEN_*` names are reserved on hosted (use `SANDBOX_MODAL_TOKEN_*`) |
| 7 | **Did Thomas retweet the Agent Relay launch?** 04 removed it as unconfirmed | **Likely yes.** An Exa-cached teapawt snapshot of @karatzas_thomas (around Oct 24) shows "Thomas Karatzas retweeted Will Washburn ... Today we're launching @agent_relay" (62,636 views at that snapshot; 04's later count is ~96.5K). Cached mirror, so not a primary source |
| 8 | **Oct 26 "durable, horizontally scalable coding agent platform ... Sandboxes, pi, Durable Actors".** 02: a @bensenescu tweet the founder retweeted. 05 §8 quotes "Thomas, 10-26: 'Insane how easy it is...'" | **Flagged.** 02's verification read the timeline and found a retweet. 05's attribution of the "Insane how easy" line to Thomas was not re-checked and may be the quoted third-party text. Don't attribute either line to Terse in a pitch |
| 9 | **v0.8.1 date.** Release Oct 18; tweet "~Oct 18-20" | Release **Oct 18** [V gh]; the founder's announcement tweet is dated **Oct 20** on the cached mirror |
| 10 | **Launch YC "paired with Cloud beta".** | The post body doesn't mention the beta. The beta tweet (07:25 UTC) and "MIT Open Source + Cloud hosted version available" (19:32 UTC) are separate founder tweets [V, 02] |
| 11 | **`@Interleave` scope.** Class-wide (blog/docs) vs per-method (FAQ) | Compatible: the decorator applies to the decorated entry-point method, but its **rollback loss applies to the whole class**. Isolate LLM methods in their own actor class |
| 12 | **Licenses.** "SEE LICENSE IN LICENSE.md" (01) vs "Sustainable Use License" (03) | Same thing: the npm field points at a LICENSE.md whose body is the Sustainable Use License. Only `durable-actors*` packages are MIT |
| 13 | **Open WebSockets keep the actor alive?** A removed FAQ said yes | **No**, per current configuration.md: they stay at the gateway but don't prevent the 10 s eviction |
| 14 | **"S3" in Launch YC** vs runtime storage | The shipped runtime persists to **GCS**; AWS/S3 is open PR #273. Say "object storage" |

---

## 5. Gotchas (deduplicated, ranked by demo risk)

1. **Bun version.** Run `bun upgrade` to ≥1.4.2 on every laptop. Windows has no build, so use WSL or a Mac.
2. **Mailbox blocking.** Without `@Interleave`, an awaited LLM call holds the actor and everyone queues behind it. The docs: "Impact could be catastrophic and throttle everything otherwise." With it, the class never rolls back. The per-actor queue is unbounded (#177).
3. **Nested mutation isn't saved.** The README `ChatHistory` uses `.push()` and `+=` on a `@Persisted` field, which only changes memory. `examples/ai-chat` reassigns correctly. Reassign once more after streaming finishes.
4. **Version skew.** Clients older than v0.13 break, and releases land 2-4 times a day. Pin, regenerate with dev running (generation fetches the contract from the server), and never update mid-hack.
5. **Sockets.** Out-of-order delivery is possible (v0.12.3). There's no auto-reconnect, and a reconnect needs a **new** grant from your backend. `onDisconnect` may be skipped on server failure.
6. **Secrets and keys.** `terse secrets add/import .env` (your local `.env` doesn't ship with deploy). Keep the generated client and `TERSE_API_KEY` server-side (#224: nothing stops you bundling them). The platform injects `TERSE_PROJECT_KEY` into actors.
7. **Idempotent init.** Constructor and initializer SQL reruns on every restore (`CREATE TABLE IF NOT EXISTS`). #351 showed that a duplicate upsert in `onResume` could silently kill activation before 0.14.1.
8. **No delete, no ORM, no transactions.** You can't delete instances (#228), so use fresh IDs per demo run (`room-${Date.now()}`). Drizzle/`db.transaction` is an **unmerged** PR (#370). Raw `BEGIN` is rejected.
9. **No first-class actor-to-actor call.** The `Actor` base class has no documented API for it [V absence]. The likely route is a generated client over HTTP with `TERSE_PROJECT_KEY` [I, untested]. Avoid A→B→A cycles without `@Interleave`, or route coordination through Agent Relay.
10. **Ten-second eviction.** `@Ephemeral` state vanishes after 10 s idle, so persist anything that matters.
11. **Template leftovers.** mini-lovable's `terse.config.json` hard-codes the Terse team's `projectId`, so re-init before deploying. Port 7100 is fixed per dev server (`--port` for a second). Templates use `src/actors.ts` while the docs say `src/actor.ts`.
12. **Python.** The OSS SDK works and the CLI has a hosted deploy path (`pyproject.toml` + `mypy --strict`), but it's undocumented and untested. Python `@interleave` can be preempted anywhere, so guard state with a `threading.Lock`. Use TypeScript.

---

## 6. Integration recipes (composed from documented APIs; not executed)

**A. Haunted room, the core Terse pattern.** One actor per room ID. `@Persisted @Emittable` fields hold the game state and are pushed as `state` / `state_update` to every socket. An `@Interleave` `onMessage` streams OpenAI deltas through `this.broadcast({type:"delta", seq, text})`, then reassigns the history once at the end. The backend route calls `actors.Room.prepareWebsocket({ actorId, metadata })` and returns the grant; the browser opens `new WebSocket(grant.websocketUrl)` before `connectByMs`. Full snippet: [01-docs-api.md §9](terse/01-docs-api.md).

**B. Hauntings that run with every tab closed.** `this.alarm.set(Date.now() + 30_000)`, and in `onAlarm()` run the scare, broadcast it, then re-arm. Alarms fire while the actor is dormant, which is a demo moment a plain Next.js + Supabase app can't fake.

**C. Durable Actors + Agent Relay (both-hosts bonus).** Each agent (OpenAI Agents SDK or Mastra, both of which already have Terse examples) is an Agent Relay participant for agent-to-agent messaging. Its **memory and the shared board, ledger or lock live in a Durable Actor**, so the one-at-a-time mailbox means no duplicate work (Thomas's own origin bug). Relay carries the conversation and actors carry the state. This sidesteps the missing actor-to-actor API, and it mirrors what Washburn is doing with relaycast on Durable Actors right now (#369). Details of the Agent Relay side are in `research/agent-relay/`.

**D. Mini software factory (higher risk).** An actor per session owns a sandbox through `@Resource` (`onResume` / `onGracefulShutdown`). Freestyle or Superserve ($100 credits each) stand in for Modal. Use `Unchecked<T>` for AI SDK and Pi message types. The reference is Terse-Examples `mini-lovable` (pins `terse-sdk` 0.14.2 and was the source of bug #351).

**E. Supabase "scale to millions" story.** State is sharded per actor (its own SQLite and socket server, dormant when unused), and Supabase holds the cross-entity queries and dashboards. This is the docs' own advice and directly answers the HN state-query criticism. Quote Launch YC: "Because each actor has its own database and websocket server, we remove a ton of pressure from your main DB as well as your websocket server."

**F. Judge-facing inspector.** `GET .../observe/state` reads a snapshot from storage **without waking the actor**. Alternatives are `durable-actors inspect Room/id --json` or the v0.14.2 actor browser.

---

## 7. Limits / could not verify

- **Re-checked 2026-10-30 06:29Z ([sponsor-coverage-audit §2.5](reference/sponsor-coverage-audit.md)):** there is still no pricing or quota page, and llms.txt still lists 4 pages. PR #371 (nested transactions) was **closed unmerged** at 05:01Z. #370 (Drizzle) is still open.

- **Terse Cloud pricing, free tier and beta quotas.** None published (`/pricing` is a soft-200 homepage, not in the sitemap). Billing code exists (v0.10-v0.11). Whether Terse Cloud overrides the 500/50 defaults is unknown.
- **Which sandbox provider Terse Cloud runs on** (GKE default vs Modal).
- **Actual rollback behaviour** of a failing non-`@Atomic` TS call: the docs contradict themselves live, and nobody ran it.
- **Actor-to-actor invocation** mechanism and hosted Python deploy: untested.
- **Whether PR #370 merges before Oct 31**, and whether another breaking release lands Oct 30-31.
- **Judges, and any Terse-specific rubric:** unannounced.
- **Social reach:** X counts come from mirrors (teapawt/xitter) and lag. The Rita Kozlov Oct 8 item (AGI Hunt) is unseen. LinkedIn counts are snippets. Reddit search returned 403. The #7 and #8 tweet attributions in §4 rely on cached mirrors.
- **Not re-checked by any pass:** weekly commit totals, the 86-of-~92 team issue split, the RustGPT claims, the deniz.in article, and the whitechapel Vercel hosting.
- **No code was executed** in any sub-file; snippets are assembled from documented signatures.

---

## 8. Hackathon implications

**What to build (ranked) [I]:**
1. **Haunted multiplayer séance or mystery.** One actor per room, LLM ghost NPCs streaming to every player, serialized turns, alarms that haunt while the actor is dormant, and state that survives a kill. This mirrors their own whitechapel demo and hits "Real-Time AI" plus Halloween. Add Agent Relay so ghost agents gossip or coordinate across rooms (both bonuses, and both track prizes in reach).
2. **"Ghost workers" swarm on shared state.** N agents split a task over Agent Relay while an actor guards the ledger. Show live that no work is duplicated, with a side-by-side naive-Postgres race if time allows.
3. **Mini haunted software factory** (`@Resource` + Freestyle/Superserve sandbox + OpenAI). It sits on Thomas's stated roadmap, but it's the riskiest in 5 hours.

**Demo moments judges will recognize:** (a) kill the server or wait out the 10 s idle, reconnect, and the state is back; (b) two browsers on one actor ID see the same stream; (c) an alarm fires while dormant; (d) the observability UI or actor browser shows actors waking and sleeping; (e) a live **Terse Cloud URL**, not localhost.

**Pitch framing:** use their vocabulary (persisted fields, serialized calls, generated clients, per-actor SQLite, configurable compute). Answer "why an actor instead of Postgres plus a WebSocket server" with the shared-state race. Don't lean on latency or name a sandbox provider.

**Setup before Oct 31 (Oct 30):**
1. `bun upgrade`; install the terse CLI; `terse auth login`; create an API key; complete a deploy round trip; delete it.
2. Run the OSS `bunx durable-actors init t --template ai-chat` once as a local-only fallback.
3. Prepare `.env` (OpenAI $100 credits, Agent Relay, Freestyle/Superserve) for `terse secrets import .env`.
4. Test an actor ↔ Agent Relay call in a throwaway project, and skim the Agent Relay quickstart.
5. Watch the Launch YC demo video and "How to build Multiplayer AI into your product" to match the founders' framing.
6. Saturday 10:30: check Releases and PR #370, pin versions, and ask the Terse table about raised project limits.

**Credible extra signal [I]:** external contributors are rare (no community builds exist; Washburn is the first notable one). Filing one clean, reproducible issue or PR found during the hack will be noticed by a two-person team.

---

## Sources (merged, deduplicated)

**Event**
- /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md (https://events.ycombinator.com/haunted-hacks-2026)
- https://luma.com/builde-oxba (Builderbase listing)

**Terse docs and site**
- https://docs.useterse.ai/llms.txt · /quickstart.md · /concepts.md · /reference/cli.md · /reference/typescript-sdk.md (re-fetched 10-29) · /faqs (Exa cache only; now serves Concepts) · /sitemap.xml
- https://www.useterse.ai/ · /rss.xml · /sitemap.xml · /blog/terse-vs-cloudflare-durable-objects · /blog/terse-vs-rivet-actors (both 2026-10-17)
- https://demo.useterse.ai/

**GitHub**
- https://github.com/TerseAI · https://github.com/TerseAI/durable-actors (README; docs/reference/{configuration,cli,typescript-guide,python-guide}.md, openapi.yaml; docs/self-hosting.md; sdk/src)
- https://github.com/TerseAI/durable-actors/releases (v0.1.0 to v0.14.4; notes for v0.2.0, v0.4.0-v0.8.1, v0.9.0-v0.14.4)
- Issues: /issues/177, 178, 192, 193, 195, 196, 197, 203, 218, 222, 224, 228, 232, 233, 321, 324, 330, 351, 359, 362, 367, 368, 369 · PRs: /pull/179, 212, 273, 337, 340, 370, 371
- https://github.com/TerseAI/Terse-Examples · /durable-actors-mastra-example · /durable-actors-openai-agents-sdk-python-example · /background-agents · /whitechapel · /talkingAgent · /MultiplayerAI-Backend · /little-durable · https://github.com/TerseAI/Terse (404)
- https://github.com/AgentWorkforce/relay · https://github.com/AgentWorkforce/relaycast · https://api.github.com/users/willwashburn
- https://github.com/oven-sh/bun/releases (v1.4.4, 2026-10-22)

**Registries**
- https://registry.npmjs.org/terse-cli · /terse-sdk · /durable-actors · /durable-actors-observer · /@earendil-works/pi-durable · https://api.npmjs.org/downloads/point/last-month/durable-actors
- https://pypi.org/pypi/durable-actors/json

**YC / launches**
- https://www.ycombinator.com/companies/useterse
- https://www.ycombinator.com/launches/WbG-durable-actors-the-perfect-primitive-for-multiplayer-ai-and-agent-coordination (2026-10-29 19:30 UTC)
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other (2026-10-23, Will Washburn)

**Hacker News**
- https://news.ycombinator.com/item?id=49980399 (Show HN, 2026-10-06; https://hn.algolia.com/api/v1/items/49980399)
- https://news.ycombinator.com/item?id=50024586 (patcon, Deno thread) · https://news.ycombinator.com/item?id=48371847 (Jun 2 workflow Show HN) [BG]

**X (mirrors)**
- https://teapawt.org/karatzas_thomas · /status/2107500256976085230 (Oct 6) · /status/2112219511327965403 (Oct 19 hackathon) · /status/2112273088759132217 (Oct 19 tiny Lovable) · /status/2113686145225871790 (Oct 23) · /status/2115706450454479170 (Oct 29 cloud beta) · /status/2115889405642641730 (Oct 29 launch) · /status/2108276198564638886 (Oct 8)
- https://xitter.cf/karatzas_thomas/status/2107872102829502622 (Oct 7) · /status/2107925182103068753 (DST)
- https://teapawt.org/IncTerse · /IncTerse/with_replies · https://teapawt.org/willwashburn/status/2113753053191131581 · https://teapawt.org/agent_relay/with_replies · https://teapawt.net/oliviersm199

**LinkedIn / YouTube / secondary**
- https://www.linkedin.com/posts/olism_work-update-thomas-karatzas-and-i-got-into-activity-7513251967154995203-k6ux · https://www.linkedin.com/posts/thomas-karatzas-a3015a94_explaining-what-terse-inc-does-has-been-one-activity-7514076987481735168-MpTa · https://www.linkedin.com/posts/thomas-karatzas-a3015a94_happy-to-finally-share-what-olivier-simard-morissette-activity-7467602970143236097-_58G [BG] · https://www.linkedin.com/posts/thomasgrauwin_another-talk-talk-session-with-thomas-karatzas-activity-7511962460489240576-N0Rv · https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0
- https://www.youtube.com/watch?v=wpF3VTmljqM · https://youtu.be/UNaG-PLw17s
- https://deniz.in/terse-open-sources-durable-actors-a-self-hostable-alternative-to-cloudflare-dura · https://www.80aj.com/2026/10/08/durable-actors-ai-apps/ · https://gitnova.dev/en/r/TerseAI/durable-actors · https://www.nicheloom.com/launches/44910/ · https://agihunt.info/en/p/1a118bc9c60d137c71f9883debf · https://www.eli.work/tool/useterse · https://aitoolcompass.net/tools/terse
- https://f4.fund/firms/articulate · https://app.dealroom.co/companies/articulate_4 · https://www.gpagent.ai/yc/company/useterse · https://mentionfox.com/funding/yc-useterse · https://thomaskaratzas.com/

**Competitors**
- https://rivet.dev/changelog/2026-10-26-introducing-rivet-3-0-preview/ · https://rivet.dev/changelog/2026-10-07-introducing-pi-durable-for-rivet/ · https://developers.cloudflare.com/changelog/product/agents/ · https://developers.cloudflare.com/changelog/post/2026-10-02-pi-harness/ · https://github.com/denoland/celld
