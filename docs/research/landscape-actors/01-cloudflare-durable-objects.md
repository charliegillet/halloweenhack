# Cloudflare Durable Objects and the Agents SDK: the reference Terse is measured against

Checked **29 October 2026** for Haunted Hacks (Sat 31 Oct 2026, SF, 11:00 to 16:00 build window). Sources: Boris Tane's explainer, which the event page links; Cloudflare's docs (limits, pricing, lifecycle, WebSockets, alarms, rules of DOs, Agents API, schedule tasks); the Durable Objects and Agents changelogs; the Cloudflare blog; `gh` against `cloudflare/agents` and `denoland/celld`; npm registry and download counts; and Terse's own "Terse vs Cloudflare" post. The Terse-side facts come from `../terse/01-docs-api.md` and were not re-derived here. **[BG]** marks material dated before Aug 2026. **Verified** means I read it in a primary source. **Inference** is labelled as such.

---

## TL;DR

- **The mental model the event points to (verified):** a DO is "a tiny, long-lived server that is guaranteed to be unique for a specific ID." Every request for `idFromName("workspace-123")` goes to one instance, which is single-threaded and has its own storage, alarms and WebSockets. [1] Terse describes an actor in almost the same words: "a tiny server with a SQLite database." [T]
- **Cloudflare's platform has settled (verified).** Since the 24 Jul 2026 changelog entry, accounts that do not already have a KV-backed namespace **must** use the SQLite backend for new namespaces [8]. Each object holds up to **10 GB** (paid; 1 GB on Free), there is no limit on the number of objects, the soft limit is about **1,000 req/s per object**, and CPU is capped at **30 s per invocation** (configurable to 5 min) [2]. Duration is billed on **128 MB** per object, and objects of one class may share a 128 MB isolate; this figure comes from the pricing page footnote, not the limits page [3].
- **Pricing is public and cheap for a hackathon (verified).** Free plan: 100k requests/day and 13,000 GB-s/day. Paid: $0.15 per million requests and $12.50 per million GB-s. Incoming WebSocket messages are billed at 20:1, and hibernated objects are not charged for duration. [3] Terse has **no public pricing** [T].
- **Aug-Oct 2026 news that matters for Terse's pitch:**
  - **Oct 9: Cloudflare acquired Deno.** The goal is to make self-hosted Workers and **distributed Durable Objects** first-class by merging Deno's `celld` (Apache-2.0, **6.2k stars**) into `workerd` [11][12][13]. Kenton Varda's half of the post says celld was released "in August" 2026 [11] (the GitHub repo dates from Apr 2025, so it was presumably private until then). This takes over the "open-source DO alternative" positioning Terse uses for this event (`TerseAI/durable-actors`: 291 stars, created 30 Aug 2026) [14].
  - **Oct 1: pending I/O now prevents eviction** (up to 15 min per operation), for long-running agents that have no connected client [6].
  - **The Agents SDK ships almost daily.** It went from v0.23 (11 Sep) to v0.32 (29 Oct) with **3.4M npm downloads/week**, against **3.7k/week for `durable-actors`** [9][14].
- **The biggest behavioral difference (verified from both sets of docs):** on Cloudflare, a non-storage `await` such as an LLM `fetch()` **lets other requests interleave** by default [5]. On Terse, a method **holds the mailbox across `await`** unless you mark it `@Interleave` [T]. Anyone who brings DO habits to Terse will freeze their actor on the first LLM call.

---

## 1. What Boris Tane's post (linked by the event) actually teaches  [BG, 5 Nov 2025]

Read in full [1]. Its main points:
- **One instance per ID.** The Worker is a stateless router. `env.NS.idFromName(id)` → `env.NS.get(id)` returns a stub, and method calls on the stub are **RPC** that run inside the object.
- **Four storage layers:** in-memory fields (lost on hibernation), the KV API `ctx.storage.put/get`, SQLite `ctx.storage.sql.exec`, and external R2/D1/KV.
- **The parent-child pattern.** A workspace DO keeps a registry of child DOs (threads or projects) in its own SQLite, so listing them never wakes the children, and children run in parallel. "Don't put everything in one DO."
- **Alarms.** Per-entity scheduling replaces cron scans. At-least-once delivery, retried up to 6 times with exponential backoff starting at 2 s, so handlers must be idempotent.
- **Pitfalls.** (1) "One instance = one thread", so don't block. (2) A DO cannot read its own name from inside, so persist identity with an `init()`.
- **The Hibernation API** `ctx.acceptWebSocket()` plus `webSocketMessage/Close` handlers lets a room with 1,000 idle sockets cost almost nothing.
- **The Agents SDK** (`npm i agents`) is "a general-purpose framework for building stateful real-time applications." It provides `onConnect/onMessage/onClose`, `onRequest`, email, cron-style scheduling, a queue, and hibernation by default.

**Caveat (inference):** Boris's "a slow external API took 5 s, so the 10th request waited 50 s" example conflicts with Cloudflare's current rules page, which says `fetch()` lets other requests interleave [5]. His example uses `setTimeout`, and his story may predate the current gate semantics. Treat the docs as authoritative.

---

## 2. Architecture and execution semantics (verified)

**Lifecycle** [6]: there are five states: Active, Idle non-hibernateable, Idle hibernateable, Hibernated, and Inactive.
- A hibernateable object hibernates "after 10 seconds of no incoming request or event."
- A non-hibernateable idle object is evicted "after 70-140 seconds of inactivity."
- Hibernation is blocked by: pending `setTimeout`/`setInterval`, unfinished I/O or `waitUntil` promises, open outbound connections, use of the standard WebSocket `accept()` API, or a request still in progress.
- The constructor runs again on every wake, so keep it idempotent.
- On a runtime update, in-flight requests get up to 30 s to finish, and **WebSockets are terminated**.

**Concurrency** [5]:
- *Input gates* block new events while synchronous JS runs and during storage operations.
- *Output gates* hold outgoing responses and fetches until pending writes are durable, so a client never sees an ack for an unpersisted write.
- Non-storage I/O (`fetch`, R2) **allows interleaving**, so the guidance is to use optimistic check-and-set.
- `blockConcurrencyWhile()` is for init and migrations only. Use `transaction()` for read-modify-write.
- Throughput guidance: ~500-1,000 req/s for simple operations and 200-500 req/s with storage writes. Sharding formula: required DOs = total rps / per-DO rps.

**RPC** [3][5]:
- For compatibility date ≥ 2024-04-03, Cloudflare says you "should use RPC methods" instead of `fetch()`. Prefer `getByName()` with deterministic names.
- Each stub method call is one billed "RPC session". Calls on an `RpcTarget` stub returned from that call are free within the session.
- **17 Sep 2026:** Workers traces now follow RPC sessions into DOs automatically [6].
- **3 Aug 2026:** Workers RPC works across Python and JS Workers [10].

**SQLite-in-DO** [2][6][8]:
- `ctx.storage.sql.exec(sql, ...binds)` is synchronous and local. The KV API is stored in a hidden SQLite table and billed as rows.
- Point-in-time recovery to any moment in the **last 30 days**.
- SQL limits: 100 columns, 2 MB per row/string/BLOB, 100 KB per statement, 100 bound parameters, `LIKE` patterns of 50 bytes.
- When the object is full, writes throw `SQLITE_FULL`, while reads and `DELETE` still work.
- Changelog: KV-backed namespaces can no longer be created on accounts that don't already have one (grouped under the **24 Jul 2026** date on the DO changelog) [BG]. A declarative Wrangler `exports` map replaces the tagged `migrations` array (4 Jul 2026) [BG].

**Alarms** [4]:
- **One alarm per object.** `setAlarm(ms)` overwrites any existing alarm. There are also `getAlarm()` and `deleteAlarm()`.
- At-least-once delivery, retried up to **6 times** with exponential backoff starting at 2 s. `alarmInfo.retryCount` and `isRetry` tell you whether a run is a retry.
- An alarm handler has a **15 min** wall-time limit [2]. Each `setAlarm()` is billed as one row write [3].
- **25 Aug 2026:** `ctx.abort(reason, { retryAlarm: false })` stops the retry (Wrangler ≥ 4.126.0) [6].

**WebSocket hibernation** [3][7]:
- `ctx.acceptWebSocket(ws)` (instead of `ws.accept()`) allows hibernation. `serializeAttachment` holds **16,384 bytes** per socket and survives hibernation.
- Incoming messages can be up to **32 MiB** [2]. `setWebSocketAutoResponse()` answers pings without waking the object and is not billed for duration [3]. From compatibility date 2026-04-07, Close frames get an automatic reply.
- **Outgoing WebSockets do not hibernate.** For high-frequency data Cloudflare suggests batching "every 50-100ms or every 50-100 messages, whichever comes first". One object can connect "thousands of clients per instance" [7]. `setWebSocketAutoResponse` request/response strings are capped at 2,048 characters each.

**Oct 1 2026 eviction change** [6]: from compatibility date `2026-10-01`, the following keep an object alive with no client connected: pending service-binding calls, DO-to-DO RPC and `fetch`, `ctx.waitUntil`, timers, and `ctx.container.monitor()`. Each pending operation holds it for up to 15 min, and duration is billed for that time. This is aimed at agents that keep working after the user's tab closes.

---

## 3. Limits and pricing (verified 29 Oct; limits page updated 29 Oct, pricing 18 Oct) [2][3]

| | Free | Paid ($5/mo minimum) |
|---|---|---|
| Requests (HTTP, RPC sessions, alarms, WS messages ÷20) | 100,000/day | 1M/mo incl., then $0.15/M |
| Duration (charged on 128 MB regardless of use) | 13,000 GB-s/day | 400k GB-s/mo incl., then $12.50/M GB-s |
| SQLite rows read / written | 5M / 100k per day | 25B / 50M per mo incl., then $0.001 / $1.00 per M |
| SQL storage | 5 GB total (1 GB per object) | 5 GB-mo incl., then $0.20/GB-mo; 10 GB per object |
| Classes per account | 100 | 500 |

- On the Free plan, operations past a cap **fail** and the caps reset at 00:00 UTC.
- The pricing page's own Example 4 (100 DOs × 100 hibernated sockets, 1 msg/min each) comes to **$20.65/mo**. Example 3 (100 DOs kept awake all month by a non-hibernated socket) comes to **$419.30/mo**. The difference is hibernation.
- Not verified: the Free-plan CPU cap for DOs specifically. The page lists 30 s without separating the plans.

---

## 4. Cloudflare Agents SDK (verified)

- **`Agent<Env, State>`** extends a DO.
  - Lifecycle hooks: `onStart`, `onRequest`, `onConnect`, `onMessage`, `onError`, `onClose`, `onEmail`, `onStateChanged`.
  - `this.sql` is a tagged template.
  - `setState()` **syncs state to every connected client**. The React `useAgent()` hook returns `agent.stub.method()` and `agent.setState()`.
  - Callable methods use `@callable()`. Routing is `/agents/:agent/:instance` through `routeAgentRequest`. [15]
- **Scheduling** [16]: `schedule(delaySec | Date | cron, "methodName", payload)` and `scheduleEvery()`. Schedules are stored in SQLite and run from a job queue, so the SDK puts **many schedules on top of the one-alarm-per-object primitive**. `keepAlive()`/`keepAliveWhile()` block the ~70-140 s idle eviction, but "a deploy or crash still stops the work".
- **Durable execution** (Project Think, Apr 2026 [BG]): `runFiber()`/`stash()`/`onFiberRecovered()`. **Sub-agents** are child DOs placed on the same host through **Facets**, each with its own SQLite. `AIChatAgent` provides resumable streaming [17].
- **Aug-Oct 2026 releases** [6][9][10][18]:
  - **3 Aug:** `@cloudflare/computer` preview, a SQLite-backed virtual filesystem whose code runs in an isolate or a container. It reached v0.8.0 on 26 Oct.
  - **4 Aug:** "Cloudflare Agents" dashboard with agent tracing and session replay.
  - **2 Oct:** `PiHarness` (Pi Durable).
  - **12-13 Oct:** `web_search` and `web_fetch` tools, a persistent `browserTool`, and the experimental `OpenCodeHarness`.
  - **20 Oct:** Think moves to the Computer workspace. `@cloudflare/shell` is deprecated, which is a **breaking** change.
  - **21 Oct:** `createAI()` replaces `workers-ai-provider`/`ai-gateway-provider`.
  - **22 Oct:** v0.30, Pi 1.4. **Cannot be rolled back**, because the SQLite schema migrates.
  - **28 Oct:** browser internal hostnames.
  - **29 Oct:** v0.32. Skills become files in the workspace, which is **breaking** for `agents/skills`.
- **Repo:** `cloudflare/agents` has 5,916★ and 815 forks, MIT, last pushed 29 Oct 2026 [9].
- **Deprecation to know (27 Jul 2026, just before the window):** `McpAgent` is "deprecated and feature-frozen"; Cloudflare's MCP servers moved to stateless per-request handlers for the MCP 2026-07-28 spec, and on 22 Oct its MCP servers stopped serving the old `/sse` transport [18]. Do not start a new MCP server on `McpAgent` on Saturday.
- **Other Sep-Oct posts:** Containers rebuilt with 6× faster starts and managed from a DO (30 Sep). Streamline, a video pipeline on DOs (2 Oct) [19].

---

## 5. Precise comparison: Cloudflare DO vs Terse Durable Actors

Terse column from `../terse/01-docs-api.md` [T] and Terse's 17 Oct blog [20].

| Dimension | Cloudflare Durable Objects (+ Agents SDK) | Terse Durable Actors |
|---|---|---|
| Address | `getByName(name)` / `idFromName`; the object can't read its own name [1] | `actors.X.get(id)`, ID of 1-128 chars; `this.id` is available [T] |
| Compute unit | V8 isolate, **128 MB**, can share an isolate with other objects of the class [3] | Per-actor sandbox, **0.25 CPU / 256 MiB** default, up to 4 CPU / 4 GiB via `@Compute`. Runtime sandbox provider defaults to GKE Sandbox with Modal opt-in; which provider Terse Cloud uses is (unverified) [T] |
| Languages | JS/TS (Python Workers interoperate over RPC) [10] | TS (hosted docs); Python SDK in the OSS runtime (the 17 Oct blog advertises "TypeScript and Python SDKs" [20]); hosted Python deploy exists in CLI code but is undocumented [T] |
| Default concurrency | Single thread; input/output gates; **non-storage awaits interleave** [5] | **Mailbox held across `await`**; opt out with `@Interleave`, which turns off rollback class-wide [T] |
| Durable state | Explicit: `ctx.storage` KV + sync SQL; class fields are memory-only [1][20] | `@Persisted` fields + `this.db` SQLite; nested `.push()` is **not** persisted. Commit semantics are contested: the 17 Oct blog says changes commit after a successful call and failed calls roll back [20], but the current TS reference says each write "is saved as it happens" [T] |
| Transactions | `transaction()`/`transactionSync`, PITR 30 days [5][8] | `BEGIN/COMMIT/SAVEPOINT` **rejected**; `@Atomic` per method [T] |
| Alarms | 1 per object, at-least-once, 6 retries, 15 min wall; Agents SDK multiplexes cron/delay schedules [4][16] | 1 per actor, `this.alarm.set(ms)`, fires while dormant, polled every 100 ms; no multiplexer [T] |
| Idle | Hibernate after 10 s; evict at 70-140 s; pending I/O holds up to 15 min [6] | Dormant after 10 s by default (configurable 1 ms-24 h); open sockets **don't** keep it alive [T] |
| WebSockets | Hibernation API, 16 KB attachments, `setWebSocketAutoResponse`, 32 MiB incoming [3][7] | Gateway holds sockets while the actor sleeps; `setWebSocketAutoResponse` (**same name**), tags, `broadcast` without waking; 32,768 per actor per process [T] |
| Client sync | Agents SDK `setState` → all clients; `useAgent` React hook [15] | `@Emittable` → `{type:"state"}` / `state_update` frames; generated typed client; `prepareWebsocket` grant [T] |
| Scale ceiling | Unlimited objects; ~1k rps/object; 10 GB/object [2] | **500 active actors per project, 50 starts/s** (OSS defaults; hosted overrides unknown) [T] |
| Heavy compute | Containers/Sandboxes attached to a DO; `@cloudflare/computer` [10][19] | `@Resource` lifecycle around an external sandbox (Modal reference) [T] |
| Pricing | Public, detailed [3] | None published [T] |
| Self-host | `workerd` is single-instance only for DOs; distributed version coming via `celld` [11] | MIT runtime, GKE Helm path; hosted Terse Cloud [T][20] |
| Maturity signal | `agents` 3.40M dl/wk; `wrangler` 37.8M dl/wk [14] | `durable-actors` 3,702 dl/wk; `terse-sdk` 3,222 dl/wk; 291★ [14] |

**Where Terse is truly different (inference from the table):**
1. Actors are real sandboxes with configurable CPU and RAM, not 128 MB isolates, so an actor can run heavy npm or Python code directly.
2. State is declarative (`@Persisted`, `@Emittable`). Rollback-on-failure is documented in the 17 Oct blog [20] but contradicted by the current TS reference (immediate writes; `@Atomic` for all-or-nothing) [T], so test it before pitching it.
3. Clients are generated and typed outside any Worker binding.
4. The core is open source today.

**Where Cloudflare is ahead (verified):**
1. Global managed operation and published pricing.
2. Hibernation economics.
3. A much richer agent framework (scheduling, fibers, sub-agents, browser, computer, MCP).
4. Scale that is effectively unbounded per namespace.

**Name overlap.** Terse reuses DO vocabulary (`setWebSocketAutoResponse`, `onAlarm`, "hibernation"-style gateway sockets). Inference: the API is meant to feel familiar to DO users, so judges from Terse will expect you to know the DO model.

**Terse's own framing (verified [20]).** Choose Cloudflare "when you want Cloudflare to operate your stateful application infrastructure" and Terse "when you want to operate an open-source actor runtime." The 17 Oct post lists Terse production deployment as "Self-host; documented GCP path" and does **not** mention the hosted `terse deploy` path or Cloudflare's 9 Oct Deno/celld news. It says plainly that it is "not a performance benchmark".

---

## Limits / could not verify

- The Free-plan CPU cap for DOs, and whether the 1,000 rps soft limit changed in 2026. The docs give the numbers without plan nuance.
- The "new namespaces must be SQLite" entry has no permalink of its own in the fetched changelog; it appears under the 24 Jul 2026 date heading [8]. Treat the exact day as approximate.
- How `celld` behaves or how fast it is. I only read the announcement and repo metadata. Merging it into `workerd` has no published timeline ("more announcements… in the coming months") [11].
- Boris Tane's blocking example versus the docs' interleaving rule. I did not run code to settle it.
- The Agents SDK scheduler's internal table layout and retry policy. The docs page defers to a Scheduler capability page that I did not read.
- No head-to-head latency or cost benchmark exists between Cloudflare and Terse. Terse says so itself [20].
- The `aboodman` X post the event links was not read (out of scope for this file).

---

## Hackathon implications

- **Build on Terse, not Cloudflare.** Cloudflare is not a sponsor, gives no credits, and the Durable Actors track (prize listed as an "iPhone Duo" on the event page) explicitly asks for Durable Actors. Use Cloudflare knowledge for *design patterns and the pitch*, not the stack.
- **Borrow these DO patterns directly:**
  1. **Parent-child:** a `Haunt`/`Game` registry actor plus one child actor per room, agent or ghost. List children from the parent's SQLite without waking them. This is also your Supabase "scale to millions" story: state is sharded per actor, and the formula is required actors = total rps / per-actor rps [1][5].
  2. **Per-entity alarms instead of cron:** "each ghost wakes itself."
  3. **An `init()` that persists identity.** On Terse `this.id` exists, but persist any parent ID anyway.
- **Gotchas when moving DO habits to Terse:**
  1. LLM calls interleave on Cloudflare but **block on Terse**, so put `@Interleave` on every method that streams a model.
  2. On Cloudflare, class fields are ephemeral and you call storage. On Terse, `@Persisted` fields persist, but only on **reassignment**.
  3. No `BEGIN`/`transactionSync` on Terse. Use `@Atomic`.
  4. Cloudflare's Agents SDK gives you many schedules. Terse gives you **one alarm**, so keep a small `schedules(id, due_ms, kind)` SQLite table and always re-arm `this.alarm.set(min(due_ms))` in `onAlarm`. That takes about 20 lines and is worth writing on Saturday.
  5. Make alarm handlers idempotent on both platforms.
- **A demo that lands with DO-literate judges:**
  - Kill and restart, and state survives.
  - Two browsers on one actor ID see the same `@Emittable` stream.
  - An alarm fires while the actor is dormant.
  - Optionally, one slide titled "what this would be on Cloudflare" that shows the thing Terse makes easy and an isolate can't do, such as an actor running a heavy npm or Python tool inside its 1-4 CPU sandbox, or an `@Resource` that owns a Freestyle or Superserve sandbox.
- **Don't oversell "open source vs Cloudflare".** Since 9 Oct, the Deno team (and celld, 6.2k★, Apache-2.0) has joined Cloudflare and is making self-hosted distributed DOs official [11][12]. Pitch Terse on developer experience (decorators, typed clients, rollback-by-default, sandbox-sized actors), not on "Cloudflare is closed."
- **Scale answer for the Supabase judges:** cite Terse's real ceiling honestly (500 active actors per project, 50 starts/s by default [T]). Explain that dormant actors don't count, and put cross-entity queries in Supabase, which is the same split Boris recommends with D1 [1].
- **Before Oct 31:** no Cloudflare setup is needed. Read Boris's post (15 min) and Cloudflare's "Rules of Durable Objects" page [5] so you can speak the judges' language. Bookmark Terse's blog comparison [20]. Do the Terse setup listed in `../terse/01-docs-api.md` (Bun ≥1.4.2, `terse deploy` smoke test).

---

## Sources

1. Boris Tane, "What even are Cloudflare Durable Objects?", 5 Nov 2025. https://boristane.com/blog/what-are-cloudflare-durable-objects/
2. Cloudflare DO Limits (updated 29 Oct 2026). https://developers.cloudflare.com/durable-objects/platform/limits/
3. Cloudflare DO Pricing (updated 18 Oct 2026). https://developers.cloudflare.com/durable-objects/platform/pricing/
4. Alarms API. https://developers.cloudflare.com/durable-objects/api/alarms/
5. Rules of Durable Objects. https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/
6. DO lifecycle (updated 15 Oct 2026) https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/ and DO changelog https://developers.cloudflare.com/changelog/product/durable-objects/
7. WebSockets best practices. https://developers.cloudflare.com/durable-objects/best-practices/websockets/
8. Changelog entry, "New Durable Object namespaces must use the SQLite storage backend" (on the DO changelog page above, 2026).
9. `gh repo view cloudflare/agents` and `gh release list -R cloudflare/agents` (29 Oct 2026). https://github.com/cloudflare/agents
10. "Everything we launched during Agents Week" (Aug 2026). https://blog.cloudflare.com/agents-week-review-august-2026/ and https://blog.cloudflare.com/cloudflare-computer/ and https://blog.cloudflare.com/agents-on-cloudflare/
11. Kenton Varda and Ryan Dahl, "Deno is joining Cloudflare", 9 Oct 2026. https://blog.cloudflare.com/deno-joins-cloudflare/
12. Ryan Dahl, Deno blog, 9 Oct 2026. https://deno.com/blog/cloudflare ; Simon Willison summary https://simonwillison.net/2026/Oct/9/deno-is-joining-cloudflare/
13. `gh repo view denoland/celld`: "self-hosted, distributed Durable Objects", Apache-2.0, 6,174★ / 425 forks on 29 Oct 2026. https://github.com/denoland/celld
14. npm registry and api.npmjs.org last-week downloads, 22-28 Oct 2026 (`agents`, `@cloudflare/think`, `@cloudflare/computer`, `@cloudflare/ai-chat`, `wrangler`, `durable-actors`, `terse-sdk`); `gh repo view TerseAI/durable-actors`.
15. Agents API reference. https://developers.cloudflare.com/agents/api-reference/agents-api/
16. Schedule tasks. https://developers.cloudflare.com/agents/api-reference/schedule-tasks/
17. "Project Think", 15 Apr 2026 [BG]. https://blog.cloudflare.com/project-think/
18. Agents changelog. https://developers.cloudflare.com/changelog/product/agents/
19. Cloudflare blog, Durable Objects tag. https://blog.cloudflare.com/tag/durable-objects/
20. Thomas Karatzas, "Terse vs Cloudflare Durable Objects: choosing an actor runtime", 17 Oct 2026. https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects
T. `../terse/01-docs-api.md` (Terse docs, repo, configuration.md, OpenAPI; checked 29 Oct 2026). Also https://github.com/TerseAI/MultiplayerAI-Backend (runs Cloudflare DO and Terse adapters side by side, a useful migration reference).

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live sources. Outcomes: CONFIRMED, CORRECTED, or FLAGGED.

1. **Deno joins Cloudflare, 9 Oct 2026; merging workerd and celld.** Blog post fetched; dated 9 Oct, authors Kenton Varda and Ryan Dahl; "we're merging workerd and celld!"; workerd DO support "is limited to a single instance". CONFIRMED. *Added:* Varda says celld was released "in August".
2. **celld stars / license.** `gh repo view denoland/celld`: 6,174★, 425 forks, Apache-2.0, description "self-hosted, distributed Durable Objects". CONFIRMED (6,173 to 6,174, rounding to 6.2k holds).
3. **Terse `durable-actors` stars.** `gh`: 291★, 22 forks, MIT, created 30 Aug 2026. CORRECTED 290 to 291 (trivial drift).
4. **`cloudflare/agents` 5,916★ / 815 forks / v0.32 on 29 Oct / v0.23 on 11 Sep.** `gh repo view` and `gh release list`: all match (agents@0.32.0 published 2026-10-29T18:53Z; agents@0.23.0 2026-09-11). CONFIRMED. v0.32 release notes confirm the "Breaking: `agents/skills`" change.
5. **npm weekly downloads (22-28 Oct).** api.npmjs.org: `agents` 3,399,259; `durable-actors` 3,702; `terse-sdk` 3,222; `wrangler` 37,786,647; `@cloudflare/computer` 297,335. CONFIRMED.
6. **Pricing ($0.15/M requests, $12.50/M GB-s, Free 100k req/day and 13,000 GB-s/day, 20:1 WS messages, rows-read/written, $0.20/GB-mo, Example 3 $419.30, Example 4 $20.65, page updated 18 Oct).** Pricing page fetched. CONFIRMED.
7. **Limits (10 GB/object, unlimited objects, ~1,000 rps soft, 30 s CPU configurable to 5 min, 32 MiB incoming WS, 15 min alarm wall, 100/500 classes, SQL limits, updated 29 Oct).** Limits page fetched. CONFIRMED. **128 MB memory is not on the limits page**; it comes from the pricing footnote. CORRECTED the TL;DR citation.
8. **Oct 1 2026 pending-I/O eviction change (compat date 2026-10-01, 15 min per operation, duration billed).** DO changelog entry fetched, including the opt-in flag `durable_object_io_tasks_prevent_eviction` and opt-out flag. CONFIRMED.
9. **Lifecycle: hibernate after 10 s, evict after 70-140 s, WebSockets terminated on shutdown, 30 s for in-flight requests on runtime update.** Lifecycle page (updated 15 Oct) fetched. CONFIRMED.
10. **Rules of DOs: `fetch()` / R2 allow interleaving; ~500-1,000 rps; sharding formula; `blockConcurrencyWhile` for init only.** Markdown version of the page (updated 18 Oct) grepped. CONFIRMED verbatim ("Non-storage I/O like `fetch()` or writing to R2 allows other requests to interleave").
11. **Alarms: one per object, at-least-once, 6 retries, 2 s backoff, `retryCount`/`isRetry`.** Alarms page fetched. CONFIRMED. **25 Aug `ctx.abort(..., { retryAlarm: false })`, Wrangler 4.126.0** confirmed on DO changelog. **17 Sep RPC trace spans** confirmed.
12. **WebSocket details.** `serializeAttachment` max 16,384 bytes, outgoing WebSockets don't hibernate, 2026-04-07 auto close reply: CONFIRMED. Batching guidance: CORRECTED from "10-100 messages per frame every 50-100 ms" to the docs' "every 50-100ms or every 50-100 messages, whichever comes first".
13. **"New namespaces must use SQLite" date.** Found under the 24 Jul 2026 heading of the DO changelog, and it applies only to accounts without an existing KV-backed namespace. CORRECTED the "date not resolved" text and narrowed the TL;DR wording.
14. **Boris Tane post: 5 Nov 2025; quotes "a tiny, long-lived server that is guaranteed to be unique for a specific ID", "Don't put everything in one DO", "general-purpose framework for building stateful real-time applications", the 5 s / 50 s example using `setTimeout`, "One Instance = One Thread", 6 alarm retries.** Page fetched and grepped. All CONFIRMED.
15. **Terse blog 17 Oct 2026 (Thomas Karatzas) quotes.** "when you want Cloudflare to operate…", "when you want to operate an open-source actor runtime", "not a performance benchmark", "Self-host; documented GCP path". CONFIRMED. *Added:* the post advertises "TypeScript and Python SDKs" and commit-after-successful-call / rollback semantics.
16. **Agents SDK Aug-Oct dates.** Agents changelog headings: 3 Aug computer preview, 4 Aug agent tracing, 2 Oct Pi harness, 12-13 Oct web_search/web_fetch/persistent browser/OpenCode, 20 Oct Think on computer + `@cloudflare/shell` deprecated (breaking, no automatic migration), 21 Oct `createAI`, 22 Oct Pi 1.4 (no rollback because of the SQLite schema), 28 Oct browser internal hostnames, 29 Oct skills as files. CONFIRMED (the web_fetch permalink is dated 11 Oct). Blog dates: cloudflare-computer 3 Aug, agents-on-cloudflare 4 Aug, agents-week-review 10 Aug, project-think 15 Apr. `@cloudflare/computer` latest 0.8.0 published 26 Oct (npm). CONFIRMED.
17. **Terse-side facts imported from `../terse/01-docs-api.md`.** That file was corrected after this doc was written: hosted sandboxes are **not** confirmed to run on Modal (runtime default provider is GKE Sandbox), and the TS persistence semantics now conflict with the blog. CORRECTED the comparison-table rows and the "where Terse is different" bullet. 500 active actors / 50 starts/s, 0.25 CPU / 256 MiB, 32,768 sockets, one alarm polled every 100 ms: consistent with that file (not re-derived here).
18. **All cited URLs** (sources 1-7, 10-12, 15-20) return HTTP 200 on 29 Oct. CONFIRMED; no fabricated URLs found.
19. **Prize framing.** EVENT_PAGE.md lists the Durable Actors prize as an "iPhone Duo" and the Agent Relay prize as a Mac mini; Cloudflare is not listed as a sponsor. CONFIRMED; wording adjusted.
20. **Added, missing before:** `McpAgent` deprecated and feature-frozen (27 Jul 2026) and Cloudflare MCP servers dropping `/sse` (22 Oct) [18].

Not re-checked: the Agents API hook list and `useAgent` details [15], the schedule-tasks `keepAlive` quote [16], the 30 Sep Containers / 2 Oct Streamline posts [19], and the 3 Aug Python/JS RPC claim [10]. Treat these as single-pass claims.

