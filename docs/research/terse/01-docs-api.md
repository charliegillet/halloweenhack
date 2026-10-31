# Terse Durable Actors: docs and API deep dive

Checked **29 October 2026** for Haunted Hacks (Sat 31 Oct 2026, SF, 11:00 to 16:00 build window). Sources: every page on docs.useterse.ai, pulled as Mintlify `.md` endpoints plus `llms.txt`, `llms-full.txt` and `sitemap.xml`; the `TerseAI/durable-actors` repo through `gh` (README, `docs/reference/*`, OpenAPI spec, SDK source, releases, issues); the published `terse-cli@0.14.7` npm tarball, which I unpacked and read without running it; npm and PyPI registry metadata; the `TerseAI/Terse-Examples` repo; useterse.ai and its two Oct 17 blog posts (fetched with Exa); and an Exa-cached copy of a docs FAQ page that has since been removed. Bracketed numbers point to the Sources list. **[BG]** marks material dated before Aug 2026. **Verified** means I read it in a primary source. **Inference** is labelled as such.

---

## TL;DR

- **One product, two names, two toolchains (verified).** `durable-actors` is the MIT-licensed Rust runtime with TS/Python SDKs and the `durable-actors` CLI. **Terse** ("Terse Cloud") is the managed host, reached through the `terse` CLI (`terse-cli`) and the `terse-sdk` package. The hackathon docs (docs.useterse.ai) teach the **Terse path**: `import ... from "terse-sdk/actor"`, `terse actor dev`, `terse deploy`. The GitHub README teaches the **OSS path**: `import ... from "durable-actors"`, `bunx durable-actors dev`. `terse-sdk` depends on `durable-actors`, so the APIs are the same. [1][5][9][12]
- **The official docs are thin: 4 pages** (Quickstart, Concepts, CLI, TypeScript Reference) [1]. The real reference lives in the repo: `configuration.md` (32 KB of env vars and limits), `cli.md`, `python-guide.md`, `openapi.yaml` (75 KB), and `self-hosting.md` [6][7][8]. **Python is supported by the OSS runtime but is not mentioned in the hosted docs.**
- **Model (verified):** an actor is "a tiny server with a SQLite database" that runs one call at a time. It is addressed by (project, class, id). It goes dormant after **10 s idle** and wakes on the next call, WebSocket message or alarm. WebSockets stay open at a gateway while the actor sleeps. [2][7]
- **Very high release churn:** `terse-cli` has had 167 versions, **4 of them on 29 Oct alone** (0.14.4 to 0.14.7). The runtime went from v0.2 to v0.14.4 between 21 Sep and 29 Oct. v0.13.0 (27 Oct) was a **breaking client/control-plane change**. [10][11] **Pin versions on Saturday morning.**
- **Credits:** Terse is **not** in the per-attendee credit list. The event gives OpenAI, Supabase, Freestyle and Superserve credits, nothing from Terse [0]. **No public pricing page exists** (the useterse.ai sitemap has no `/pricing`) [13]. Hosted quotas follow the OSS defaults: **500 concurrent active actors per project, 50 starts/s, burst of 100** (the hosted control plane enforces these by default). I could not confirm whether Terse Cloud overrides those values. [7]
- **Local blocker found:** this machine has **Bun 1.3.14**. Terse requires **Bun 1.4.2 or later** (current is 1.4.4, released 22 Oct). Run `bun upgrade` before Saturday.

---

## 1. Package and tool map (verified 29 Oct)

| Artifact | Latest | What it is | Source |
|---|---|---|---|
| `terse-cli` (npm, bin `terse`) | 0.14.7 (29 Oct 16:37Z) | Hosted CLI. Bun ≥1.4.2. Depends on `durable-actors` (pinned 0.14.4) and `terse-sdk` (0.14.7). **License is `SEE LICENSE IN LICENSE.md`, not MIT** | [10] |
| `terse-sdk` (npm) | 0.14.7 | Import path `terse-sdk/actor`. Depends on `durable-actors`, `terse-types`, `zod`. License `SEE LICENSE IN LICENSE.md` (only the `durable-actors*` packages declare MIT) | [10] |
| `durable-actors` (npm, bin `durable-actors`) | 0.14.4 | OSS SDK + CLI. Exports `.`, `./backend`, `./codegen`, `./compiler`, `./dev`, `./host`, `./observe`, `./proxy` | [9][10] |
| `durable-actors-observer` (npm) | 0.14.4 | Embeddable React observability UI | [10] |
| `durable-actors` (PyPI) | 0.14.4 | Python ≥3.11, extras `[cli]` and `[codegen]`. Ships a native runtime wheel for Linux/macOS on x64/arm64 | [8][10] |
| GitHub `TerseAI/durable-actors` | 290★, 22 forks (re-checked 29 Oct evening PT; was 279/21 earlier the same day), MIT, Rust primary | Created 30 Aug 2026; 103 GitHub releases since v0.1.1 (2 Sep) | [5][11] |

`terse-cli` also carries an older Terse **workflow/jobs** product: `terse integrate`, `terse test`, `terse replay`, `terse history`, `src/terse.jobs.ts` [12]. For actors you need only `install`, `init`, `actor dev`, `actor generate`, `deploy`, `secrets`, `auth` and `dashboard`.

---

## 2. Concepts and execution semantics (verified unless marked)

- **Identity.** `actors.X.get(id)` returns a reference. IDs are **1 to 128 ASCII letters, digits, `.`, `_`, `-`** [9 actor.ts]. A new ID creates a fresh actor with empty state. Reuse an ID across reconnects. Use a new ID for each new conversation or run. [2]
- **Mailbox.** Calls and socket events share one FIFO mailbox. By default a method holds the mailbox **across `await`**, so an awaited `fetch` or LLM call blocks everyone else. The docs say: "You really want to run this if a long running task, like triggering an LLM, is in the method. Impact could be catastrophic and throttle everything otherwise." ("this" = `@Interleave`) [2]
- **Interleave trade-off.** Once **any** method in a class uses `@Interleave`, **no call in that class rolls back** on failure [3]. In Python, `@interleave` methods run in a worker thread and can be preempted at any point, not only at awaits, so guard shared state with a `threading.Lock` in an `ephemeral()` field [8].
- **Persistence (TS, current docs).** "Each SQL write and each `@Persisted` assignment is saved as it happens", so writes survive a crash mid-method and writes made before a throw stay saved. `@Atomic` makes a method all-or-nothing. [3] *Conflict:* the Python guide [8] and the Oct 17 blog [14] still describe commit-on-successful-call semantics, and **the same TS reference page contradicts itself**: its Interleave section says "A failed call normally rolls back its field and SQLite changes" [3]. Supporting the "recent change" reading: issue #351 (closed 28 Oct) fixed a bug where "Immediate writes that leave SQLite unchanged stop the actor database service", found in the mini-lovable demo; every new chat ID failed to connect until a duplicate upsert in `onResume` was removed [11]. Inference: TS moved to immediate writes in the last few days and other docs lag. Test the behavior you depend on, and keep `onResume`/constructor SQL idempotent.
- **Nested mutation is not persisted.** `this.messages.push(m)` changes memory only. You must reassign: `this.messages = [...this.messages, m]`. Assign `undefined` to delete a field. [3] **The README's AI-chat sample and the chat example both use `.push()` on `@Persisted` arrays** [5][15]. Do not copy that pattern.
- **Lifecycle.** The idle timeout defaults to 10,000 ms (range 1 ms to 24 h, set per class with `@Compute({ idleTimeoutMs })`). Method calls and handlers reset it. **Open WebSockets do not keep the sandbox alive**, and gateway auto-replies do not reset idle [7]. A removed FAQ said the opposite ("Open WebSockets keep the host and connections alive") [4]. The current config reference is authoritative.
- **Alarms.** One alarm per actor. `this.alarm.set(epochMs)` replaces any previous alarm. `onAlarm()` fires even while the actor is dormant, and the alarm is cleared afterward unless `onAlarm` sets a new one. The default poll interval is 100 ms. [3][7][9]
- **Not a transaction across actors.** "Actor calls do not create a transaction across several actors. Coordinate cross-actor work explicitly." Use a database for cross-entity queries. [4]
- **Hosted isolation.** Each actor runs in its own sandbox. The hosted defaults are **0.25 CPU / 256 MiB** [4][7]. *Corrected:* an earlier draft said hosted sandboxes run on Modal. The runtime supports two providers, and **`DURABLE_ACTORS_SANDBOX_PROVIDER` defaults to `gke`** (GKE Sandbox); Modal is opt-in [7]. The v0.13.0 notes (27 Oct) mention "Provision GKE spares from one shared pod watch" [11]. Which provider Terse Cloud uses is **(unverified)**. The mini-lovable template's `.env.example` does say `MODAL_TOKEN_ID/SECRET` "are reserved by the actor runtime" [16], so do not use those names for your own Modal credentials.

---

## 3. TypeScript API surface (complete public exports of `durable-actors`, verified from `sdk/src/index.ts`)

**Decorators:** `@Persisted` (durable field), `@Ephemeral` (memory only, reset on wake), `@Emittable` (pushes a public `@Persisted` field to sockets), `@Interleave`, `@Atomic`, `@Resource`, `@Compute(opts)` (class decorator). Every instance field needs `@Persisted` or `@Ephemeral`. Initialized private `ActorResource` fields are implicitly ephemeral. **All application methods must be `async`.** [9]

**`Actor<Metadata, Incoming, Outgoing, Tag>` members:** `this.db` (SQLite), `this.alarm`, `this.id`, `getConnections(tag?)`, `getConnectionCount()`, `broadcast(msg, { tags?, except? })`, and `setWebSocketAutoResponse({ request, response })`, which answers raw text such as `ping` with `pong` without waking the actor. Hooks: `onConnect(socket)` (call `socket.reject(4003, reason)` to deny), `onMessage(socket, msg)`, `onDisconnect(socket, code, reason, wasClean)` (may be skipped on server failure), and `onAlarm()`. Socket methods: `socket.send`, `socket.setTags`, `socket.metadata`. [3][9]

**Generated client reference** (`actors.X.get(id)`): every public method becomes an RPC, plus `.connect(metadata)` (a backend socket) and `.broadcast(msg)` (sends to all sockets **without running actor code**, and messages are not saved). Class-level: `actors.X.prepareWebsocket({ actorId, metadata })` returns `{ websocketUrl, connectByMs, ... }` [3][9]. **Emitted-state wire protocol:** a `{ type: "state", state }` message on connect, then `{ type: "state_update", changes }` after each successful mutating call [3].

**SQLite rules:** `this.db.exec(sql, ...bindings)` returns rows. Binding types are string, number, bigint, bytes or null. The runtime **rejects** `BEGIN/COMMIT/END/ROLLBACK/SAVEPOINT/RELEASE/ATTACH/DETACH/VACUUM`. Only 10 PRAGMAs are allowed (`table_info`, `table_xinfo`, `index_info`, `index_xinfo`, `index_list`, `foreign_key_list`, `foreign_key_check`, `integrity_check`, `quick_check`, `user_version`). The `__terse_` and `_litestream_` name prefixes are reserved. Constructor/initializer SQL runs again on every restore, so keep it idempotent (`CREATE TABLE IF NOT EXISTS`). Explicit constructors must call `super(context)`. [3]

**`@Compute` options:** `cpu` and `cpuLimit` (0.1 to 64 cores in the schema), `memoryMiB` and `memoryLimitMiB` (128 to 262144 in the schema), `idleTimeoutMs`, and `regions` ⊂ {`canada`, `north-america-east|central|south|west`, `europe-west`, `asia-southeast`}. The **server range is narrower**: 0.125 to 4 CPU and 256 to 4096 MiB by default. Classes without `@Compute` start on **prewarmed** sandboxes; custom sizes start a new sandbox, which means slower cold starts. [3][7][9]

**`@Resource` / `ActorResource`:** for external lifecycles such as a sandbox or coding harness. Implement `onResume()` and `onGracefulShutdown()`, where the shutdown hook is not called on a crash. The reference implementation is a Modal sandbox (`examples/pi`) [3].

**`Unchecked<T>` / `unchecked(v)`:** opts complex types (Vercel AI SDK, pi-durable) out of client codegen, so they appear as `unknown` on the client [3].

**Errors:** `ActorInvocationError`. Outcomes are `completed`, `failed` (`actor_error`) and `not_executed` (e.g. `host_unavailable`). `outcome_unknown` means the call may have executed. The SDK **never auto-replays** actor failures, and `requestId` does **not** deduplicate ("requestId identifies an attempt; it does not deduplicate execution"). One exception: when the gateway cannot reach a cached host it returns `not_executed` / `upstream_not_reached`, and the SDK retries **once** through the control plane with the same `requestId`. [7 openapi]

---

## 4. Python SDK (OSS; hosted support in CLI code, undocumented)

`uvx --from 'durable-actors[cli]' durable-actors init my-bank`, then `uv run durable-actors dev`, then `uv run durable-actors generate`. Field helpers: `persisted(0)`, `ephemeral(0)`, `emitted`. Decorators: `@interleave`, `@compute(cpu=..., memory_mib=..., idle_timeout_ms=...)`. Hooks and alarms: `on_alarm`, `self.alarm.set(ms)`. Methods can be synchronous `def`. [8] `terse init --language python` exists, but `--template` is TypeScript-only [12]. The hosted docs (all four pages) never mention Python. *Updated on re-check:* the `terse-cli` 0.14.7 tarball has a `pythonActors.js` module, and `commands/deploy.js` has a Python-only branch: if the entry file ends in `.py` and there is no `tsconfig.json`, it requires `pyproject.toml`, and compilation runs `mypy --strict` plus `durable_actors.build` [12]. The runtime's Kubernetes config also has a `DURABLE_ACTORS_PYTHON_IMAGE` for `.pyz` artifacts [7]. So hosted Python deploy appears to be implemented, but I have not run it and it is undocumented. `mypy --strict` failures would block a deploy. Use TypeScript at the hackathon.

---

## 5. CLI reference

**Hosted `terse` CLI** [1][12]

| Command | Notes |
|---|---|
| `bunx terse-cli@latest install` | Installs the global `terse`. `--non-interactive --yes` for unattended runs. `--no-browser` prints the login URL |
| `terse init <name> [--template counter\|helloWorld\|mini-lovable] [--language python]` | Signs in, scaffolds, installs. Templates are downloaded from `TerseAI/Terse-Examples` and produce `actor/` and `client/` folders [12][16] |
| `terse actor dev [--port 7100] [--project-id local]` | Watches source. State lives in `.durable-actors/`. Endpoint `http://127.0.0.1:7100/v1/projects/local/actors` |
| `terse actor generate [--out-dir generated]` | Run from the **client** folder while dev is running. Regenerate after any public method, state or socket type change. Generated clients need no packages |
| `terse deploy` | Type-checks the contract, uploads source, prints `https://api.useterse.ai/<PROJECT_ID>/actors` |
| `terse secrets add\|list\|import .env\|remove` | `add` also writes to local `.env` unless `--skip-local-sync` |
| `terse auth login\|logout\|status\|org list\|org switch`, `terse target status\|use\|clear`, `terse dashboard`, `terse update` | |

**OSS `durable-actors` CLI** adds two debugging commands that the hosted docs omit. `durable-actors inspect [Actor/id] [--json]` prints the instance inventory and latest persisted state. `durable-actors observe` opens the local observability UI. Its `init --template` accepts `actor`, `chat`, `ai-chat` or `documents`. Entrypoint: `actors.ts` or `actors.py` in `src/` or the project root. [6]

**Connection env vars** (hosted names): `TERSE_ACTOR_URL`, `TERSE_API_KEY` (create it in app.useterse.ai under **API keys**), `TERSE_ACTOR_PORT`, `TERSE_ACTOR_PROJECT_ID`, `TERSE_ACTOR_SECRET` (enables local auth), and `DURABLE_ACTORS_DATA_DIR`. The OSS equivalents are `DURABLE_ACTORS_CONTROL_PLANE_URL`, `DURABLE_ACTORS_PROJECT_ID` and `DURABLE_ACTORS_SECRET`. Rule: "Keep provider keys in the actor project. Keep Terse credentials in the calling backend. Keep both out of browser code." [1][6]

---

## 6. HTTP API (OpenAPI 3.1, `docs/reference/openapi.yaml`) [7]

Auth is a bearer API key, a scoped session JWT or a host ticket. Main routes:
`PUT/GET/DELETE /v1/projects/{p}/deployment`, `GET .../deployment/contract`, `POST .../sessions` (scoped RPC session, **TTL capped at 60 s**, all actors in one project), `POST .../actors/{name}/{id}/invoke` (body `{requestId ≤255, method ≤128, args[], homeRegion?}`), `.../find-actor`, `.../find-websocket`, `.../socket-effects`, and `GET/POST /v1/socket`. Observability: `GET .../observe/{actors,residency,events,state,state/history,requests,metrics,queue-waits,websockets,requests/events}`. **`observe/state` reads a snapshot from storage without waking the actor**, which is handy for a judge-facing "state inspector" panel. Errors: 413 `payload_too_large`, and 429 `actor_quota_exceeded` / `actor_start_rate_limited` (with `Retry-After`; the SDK does not retry these). Inference: the hosted URL shape `api.useterse.ai/<id>/actors` differs from the OSS `/v1/projects/<id>/actors`, so let the generated client handle routing rather than calling raw HTTP.

---

## 7. Limits and quotas (OSS defaults from `configuration.md` [7]; hosted overrides not published)

| Limit | Default |
|---|---|
| Active actors per project (starting, running or draining) | **500** (enforced by default on hosted control planes) |
| Actor starts, including dormant wakes | **50/s sustained, burst 100**. Warm deliveries are free |
| Idle eviction | 10 s (1 ms to 24 h) |
| Default actor size | 250 millicores CPU (uncapped limit), 256 MiB |
| `@Compute` allowed range | 0.125 to 4 CPU, 256 to 4096 MiB |
| WebSocket connections per actor per process | 32,768 |
| Session/JWT lifetime | session ≤60 s; JWT max 86,400 s |
| Alarms | 1 per actor, polled every 100 ms |
| Sandbox disk | 256 MiB reserved per pod (v0.13.0) [11] |
| Modal sandbox max lifetime (Modal provider) | 3600 s default |
| Observability UI buffer | was capped at 500 events; fixed 29 Oct (#359) [11] |

---

## 8. Pricing and how the credits translate

- **Verified:** there is no pricing page and no plan table in the docs or on useterse.ai [1][13]. `https://www.useterse.ai/pricing` returns HTTP 200, but it is a catch-all that serves the homepage (an arbitrary path like `/zzqnotapage` also returns 200), and `/pricing` is not in the sitemap. Aggregators list Terse as "Free" with no paid tiers [17]. The runtime added **usage metering** (v0.10.0, 23 Oct) and **"independent admin and billing suspension of organization access"** (v0.11.0, 24 Oct) [11], so billing infrastructure has existed for a week but no prices are public.
- **[BG, cached only]** Exa holds a cached `terse-types/Billing.ts` from the now-inaccessible `TerseAI/Terse` repo, with plan keys `free` and `pro`, `includedCreditsPerMonth`, and top-ups [18]. That most likely belongs to the earlier workflow product. I could not open it on 29 Oct.
- **Event credits:** none are from Terse. Per attendee: $100 OpenAI, $25 Supabase, $100 Freestyle, $100 Superserve [0]. The Durable Actors track prize is listed as an "iPhone Duo" [0]. The credits that matter for a Terse project are **OpenAI $100 per person**, which pays for the LLM calls made inside actors, and **Superserve or Freestyle $100 each**, which pay for any sandbox an actor `@Resource` owns. Inference: on Terse itself, the binding constraint is the **500 active / 50 starts/s project quota**, not money. Ask the Terse table on arrival whether hackathon projects get raised limits.

---

## 9. Copy-paste setup (composed from the documented APIs; not executed here)

```sh
bun upgrade                          # need >=1.4.2; this machine has 1.3.14
bunx terse-cli@latest install        # global `terse`, browser login
terse init haunt --template counter  # actor/ + client/
cd haunt/actor && bun install && terse actor dev     # terminal 1
cd haunt/client && terse actor generate && bun run start   # terminal 2
```

LLM agent actor (`actor/src/actor.ts`). Streams to every socket, uses reassignment so state actually persists, and uses `@Interleave` so the mailbox stays open:

```ts
import { Actor, Interleave, Persisted, Emittable, type ActorSocket } from "terse-sdk/actor"
import OpenAI from "openai"
type Msg = { role: "user" | "assistant"; content: string }
type Out = { type: "delta"; text: string } | { type: "done" }

export class Ghost extends Actor<{ userId: string }, string, Out> {
    @Persisted @Emittable messages: Msg[] = []

    @Interleave
    async onMessage(_s: ActorSocket<{ userId: string }, Out>, text: string) {
        this.messages = [...this.messages, { role: "user", content: text }]
        const stream = await new OpenAI().chat.completions.create({ model: "gpt-5-mini", messages: this.messages, stream: true })
        let reply = ""
        for await (const c of stream) { const d = c.choices[0]?.delta?.content ?? ""; reply += d; if (d) this.broadcast({ type: "delta", text: d }) }
        this.messages = [...this.messages, { role: "assistant", content: reply }]
        this.broadcast({ type: "done" })
    }
}
```
Put the OpenAI key in `terse secrets add OPENAI_API_KEY`. The model name follows the repo examples (`gpt-5-mini`) [5][15].

Backend grant (Express/Bun). The browser never sees `TERSE_API_KEY`:
```ts
app.post("/api/socket/:room", async (req, res) => {
  const grant = await actors.Ghost.prepareWebsocket({ actorId: req.params.room, metadata: { userId: "anon" } })
  res.set("Cache-Control", "no-store").json(grant)       // client: new WebSocket(grant.websocketUrl) before connectByMs
})
```
Deploy: `terse deploy`, then set `TERSE_ACTOR_URL=https://api.useterse.ai/<id>/actors` and `TERSE_API_KEY=...` in `client/.env`, then run `terse actor generate` again. [1]

---

## 10. First 30 minutes checklist (Saturday, 11:00)

1. **(pre-event)** `bun upgrade` to ≥1.4.2. Install the `terse` CLI and log in. Run `terse init` once with the counter template and complete **one `terse deploy`** so that auth, org and API key are proven. Delete it afterward: the rules require all code to be written at the event.
2. 11:00: `terse update`, then **pin** `terse-sdk` to an exact version in `actor/package.json` (the templates already pin it, e.g. `0.14.2` in mini-lovable [16]). Make sure the client and the runtime come from the same release (see the v0.13 break [11]).
3. 11:05: `terse init <proj> --template counter`, then `terse actor dev`, then `terse actor generate`, then `bun run start`. Green within 10 minutes.
4. 11:10: Replace the counter with your domain actor. Use one actor per room, agent or run. Add `@Interleave` to anything that calls an LLM.
5. 11:15: `terse secrets add OPENAI_API_KEY`. Add the backend grant route and a browser WebSocket.
6. 11:25: **Deploy early** (`terse deploy`) and run a smoke test against the hosted URL. Keep `durable-actors observe` or the Terse dashboard open for the demo.
7. 11:30: Restart-proof test: kill the dev server, restart, and check that state is still there. That is the core "durable" moment to show judges.

---

## Limits / could not verify

- Hosted **pricing, free-tier caps, and whether Terse Cloud overrides the OSS quota defaults**. Nothing is published.
- **Actor-to-actor calls (partly resolved 30 Oct).** `sdk/tests/host/actor-calls.test.ts` exercises `Destination.get(id).increment()`, `.broadcast()` and `.connect()` from inside another actor's method, through `/invoke`, `/socket-effects` and `/find-websocket`, so the mechanism is real. Hosted runs get `TERSE_PROJECT_KEY` injected (`terse-cli@0.14.7` README), which is presumably the credential used, but this is untested on Terse Cloud. Also: set `TERSE_ACTOR_SETUP_TIMEOUT_MS=120000` on the grant backend if cold starts exceed the 10 s default (`terse-sdk` README). See `../reference/INTEGRATION_COOKBOOK.md`. Original note: the SDK source shows `X.get(id)` references forwarding through the actor client [9], but no doc covers calling one actor from inside another (auth inside hosted sandboxes, or the deadlock risk when A→B→A without `@Interleave`). Test this before relying on it for agent swarms.
- Whether `terse deploy` works end-to-end for **Python** actors. The CLI source has a Python deploy path [12], but I did not run it and no doc covers it.
- Which sandbox provider (GKE or Modal) Terse Cloud runs on. The OSS default is GKE [7].
- **Persistence semantics conflict** (TS "saved as it happens" vs Python/blog "after successful call"). Default behavior for a socket hook that throws is untested.
- The FAQ page with hosted defaults (0.25 CPU / 256 MiB) is now **removed**. I saw it only through Exa's cache [4], although the same numbers appear in `configuration.md` [7].
- I did not run any code. Snippets are assembled from documented signatures.
- Max payload sizes for invoke and WebSocket frames: 413 exists, but no byte limit is documented.

## Hackathon implications

- **What to build:** one actor per agent, room or run, plus browser WebSockets. Multiplayer streaming with persisted state is the case the docs, README, Mastra example and template all optimize for [5][15][16]. Alarms give you "agents that wake on their own" (haunting timers) for free. `@Resource` plus a Superserve or Freestyle sandbox gives you a mini-Lovable-style coding agent (the official `mini-lovable` template does this with Modal [16]). Pair it with Agent Relay for the both-hosts bonus: each actor is a relay participant, and the actor provides durable memory. **New signal (29 Oct evening PT):** issue #369, opened by `willwashburn` (the #2 contributor to `AgentWorkforce/relaycast`, "Headless Slack for AI agents"), asks for nested SQL rollback scopes and says the relaycast engine's delivery insert fires a `mailbox_capacity` trigger inside a Durable Actor call [11][20]. Inference: someone on the relaycast side is porting it onto Durable Actors, so an Agent Relay + Durable Actors combo is something both hosts are already working on. Whether `AgentWorkforce/relaycast` is the agentrelay.com product is **(unverified)** here.
- **Demo moments judges will recognize:** (a) kill and restart the server, then show state survives; (b) two browsers on the same actor ID see the same stream; (c) an alarm fires while the actor is dormant; (d) the observability UI showing actors waking and sleeping.
- **Gotchas:** forgetting `@Interleave` on LLM methods freezes the actor. `.push()` on persisted arrays silently fails to persist. Interleaved classes lose rollback. Clients must be regenerated after every signature change. Version skew between client and runtime breaks calls. `MODAL_TOKEN_*` names are reserved on the hosted runtime. Never ship `TERSE_API_KEY` to the browser. Custom `@Compute` sizes skip the warm pool and cold-start slower. There is **no ORM support** in `this.db.exec` (open feature request #367, 30 Oct UTC) and no savepoints (the runtime rejects `SAVEPOINT`, and #369 is open), so write raw SQL and avoid control flow that relies on partial rollback [11].
- **What Terse likely wants (inference):** visible use of their distinctive primitives (`@Persisted`, `@Emittable`, WebSocket grants, alarms, `@Resource`) on **hosted Terse via `terse deploy`**, not just local dev. They shipped "Terse vs Cloudflare/Rivet" posts on Oct 17 [14], so a demo that makes the "DO-alternative" story obvious will land. For the Supabase "scale to millions" prize, the architecture story is that state is sharded per actor, with Supabase holding cross-entity queries, which matches the FAQ's own advice [4].

## Sources

0. Event page: /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md (https://events.ycombinator.com/haunted-hacks-2026)
1. https://docs.useterse.ai/llms.txt, /quickstart.md, /reference/cli.md, /sitemap.xml (fetched 29 Oct)
2. https://docs.useterse.ai/concepts.md
3. https://docs.useterse.ai/reference/typescript-sdk.md
4. https://docs.useterse.ai/faqs (Exa cache, undated; the live URL now serves Concepts)
5. https://github.com/TerseAI/durable-actors (README, repo metadata via `gh`)
6. https://github.com/TerseAI/durable-actors/blob/main/docs/reference/cli.md
7. https://github.com/TerseAI/durable-actors/blob/main/docs/reference/configuration.md and .../openapi.yaml
8. https://github.com/TerseAI/durable-actors/blob/main/docs/reference/python-guide.md
9. https://github.com/TerseAI/durable-actors/tree/main/sdk (src/index.ts, src/actor/actor.ts, src/actor/compute.ts, package.json)
10. https://registry.npmjs.org/terse-cli, /terse-sdk, /durable-actors, /durable-actors-observer; https://pypi.org/pypi/durable-actors/json
11. https://github.com/TerseAI/durable-actors/releases (v0.10.0 to v0.14.4) and /issues (#290, #297, #340, #342, #359)
12. terse-cli 0.14.7 npm tarball (README.md, dist/index.js, dist/templates.js, dist/commands/init.js)
13. https://www.useterse.ai/ and https://www.useterse.ai/sitemap.xml
14. https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects and /blog/terse-vs-rivet-actors (17 Oct 2026)
15. https://github.com/TerseAI/durable-actors/tree/main/examples (README, chat/README.md); https://github.com/TerseAI/durable-actors-mastra-example
16. https://github.com/TerseAI/Terse-Examples (01_gettingStarted/{counter,helloWorld}, 02_codingAgent/mini-lovable)
17. https://www.eli.work/tool/useterse; https://aitoolcompass.net/tools/terse
18. https://github.com/TerseAI/Terse/blob/main/terse-types/Billing.ts (Exa cache only; repo not resolvable 29 Oct)
19. https://github.com/oven-sh/bun/releases (bun-v1.4.4, 22 Oct 2026)
20. https://github.com/TerseAI/durable-actors/issues/369, /issues/367, /issues/351; https://github.com/AgentWorkforce/relaycast (contributors via `gh api`)

## Verification log (2026-10-29)

Adversarial re-check against live sources (gh CLI, npm/PyPI registries, curl of docs.useterse.ai `.md` endpoints and useterse.ai, and an unpacked `terse-cli@0.14.7` tarball). Outcome codes: CONFIRMED, CORRECTED, UPDATED, ADDED.

1. **Repo stats** (279★, 21 forks, MIT, Rust, created 30 Aug 2026). `gh repo view`: 290★, 22 forks, MIT, Rust, created 2026-08-30T14:37Z. UPDATED (the counts grew during the day).
2. **npm versions and churn** (terse-cli 0.14.7, 167 versions, 4 on 29 Oct; durable-actors 0.14.4). Registry: terse-cli has 167 versions, and 0.14.4/.5/.6/.7 were all published 29 Oct UTC; terse-sdk 0.14.7 (155 versions); durable-actors and durable-actors-observer 0.14.4. CONFIRMED.
3. **Licenses.** `durable-actors*` packages are MIT. `terse-cli` and `terse-sdk` declare `SEE LICENSE IN LICENSE.md`. ADDED (the earlier draft implied everything was MIT).
4. **PyPI** `durable-actors` 0.14.4, Python ≥3.11, extras `cli`/`codegen`. CONFIRMED.
5. **Bun requirement.** `engines.bun >=1.4.2` on terse-cli and durable-actors; the quickstart says "Bun 1.4.2 or later"; Bun v1.4.4 was released 2026-10-22; local `bun --version` is 1.3.14. CONFIRMED.
6. **Release timeline.** v0.2.0 is dated 21 Sep; v0.13.0 is 27 Oct, and its notes say clients from SDK ≤0.12.3 fail with "control-plane response did not contain a valid actor host target" and to upgrade clients first. v0.10.0 (23 Oct) adds "Track actor lifecycle and organization usage". v0.11.0 (24 Oct) adds billing suspension. #359 was closed 29 Oct. CONFIRMED. Added that releases began at v0.1.1 on 2 Sep.
7. **Docs are 4 pages.** `llms.txt` lists Quickstart, Concepts, CLI, TypeScript Reference. CONFIRMED. `/faqs` now serves Concepts. CONFIRMED.
8. **`@Interleave` quote.** The earlier draft truncated it. CORRECTED to the full sentence from concepts.md.
9. **"Tiny server with a SQLite database", 10 s dormancy, sockets stay open at the gateway.** concepts.md lines 11, 15 and 31. CONFIRMED.
10. **Persistence semantics.** "saved as it happens" and the `.push()` warning are verbatim in typescript-sdk.md. Found that the same page also says a failed call "normally rolls back". ADDED this internal conflict, plus the #351 evidence.
11. **README uses `.push()` on `@Persisted` arrays.** README lines 63 and 66. CONFIRMED.
12. **Quotas** (500 active, 50 starts/s, burst 100, enabled by default when hosted), compute range 0.125 to 4 CPU and 256 to 4096 MiB, idle 10,000 ms, 32,768 sockets, JWT max 86,400 s, Modal timeout 3600 s. configuration.md. CONFIRMED. Operators can override per project in PostgreSQL (the example shows 20,000 / 500 / 1,000), so Terse Cloud could raise limits on request (inference).
13. **Session TTL capped at 60 s; requestId ≤255; 429 codes not auto-retried.** openapi.yaml. CONFIRMED. Added the single `upstream_not_reached` retry nuance.
14. **"Hosted sandboxes run on Modal."** The default provider is `gke`, and v0.13.0 mentions GKE spares. CORRECTED to "provider for Terse Cloud unverified".
15. **Python deploy "unverified".** The CLI tarball has a Python deploy branch (`pyproject.toml`, `mypy --strict`). UPDATED: implemented in code, still untested and undocumented.
16. **No pricing page.** Not in the sitemap. `/pricing` is a soft 200 that serves the homepage. CONFIRMED.
17. **Blog posts dated 17 Oct 2026.** Both pages contain "October 17, 2026". CONFIRMED.
18. **Event credits and prizes.** EVENT_PAGE.md lists no Terse credits; the track prize is "iPhone Duo"; per-person Supabase credit is $25. CONFIRMED, with detail ADDED.
19. **Env var names, hosted URL `api.useterse.ai/<id>/actors`, and the "Keep provider keys..." quote.** cli.md lines 94 and 100 to 105, quickstart line 132. CONFIRMED.
20. **mini-lovable pins `terse-sdk` 0.14.2.** `actor/package.json` in Terse-Examples. CONFIRMED.

Not re-verified in this pass: the Exa-cached FAQ text [4], the cached `Billing.ts` [18], the aggregator "Free" listings [17], and the SQLite PRAGMA allow-list (taken from the docs as-is).

