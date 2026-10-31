# Mastra: docs and API deep dive for Haunted Hacks (Oct 31, 2026)

Checked 2026-10-29 (PT). Sources: Mastra's machine-readable docs (`https://mastra.ai/llms.txt`, plus pages fetched as `.md`), the pricing page, Mastra blog posts, npm registry metadata, and `gh` against `mastra-ai/mastra` and `TerseAI/durable-actors-mastra-example`. No account was created and nothing was deployed, so platform behavior below is **documented, not tested**. Tags: **[V]** = verified in a primary source (cited). **[I]** = my inference.

Scope: this file covers concepts, API surface, CLI, config, limits, pricing and how the prize translates into usage. Newest-features, GitHub-code, social and strategy angles are covered in sibling files.

---

## 1. What Mastra is, in one paragraph

Mastra is a TypeScript framework (YC W25), Apache-2.0 except code under any `ee/` directory (for example `@mastra/core/auth/ee`), which is under a separate Enterprise license (GitHub reports the repo license as `NOASSERTION` for this reason) [34], for agents, tools, workflows, memory, evals and tracing. The paid side is "Mastra platform" (Observability, Studio and Server, plus a separate Memory Gateway). The framework is TypeScript-only. I found no Python SDK in the docs index. **[V]** [1][2]. Current versions as of Oct 29–30, 2026 UTC: `@mastra/core` **1.80.0** (released Oct 28), `mastra` CLI 1.36.0, `@mastra/client-js` 1.57.0, `@mastra/memory` 1.39.1. `@mastra/core` requires **Node >= 22.13.0** and has peer dependency `zod ^3.25 || ^4`. **[V]** (npm). Release cadence: **27 stable `@mastra/core` releases between Aug 5 (1.56.0) and Oct 28 (1.80.0)**, roughly two a week. **[V]** (npm `time`). Repo: ~29.2k stars (29,202), 3.06k forks, ~647 open issues+PRs (GitHub's `open_issues_count` includes PRs), last push Oct 30 UTC. **[V]** (gh API, re-checked). Pre-releases `1.81.0-alpha.0/.1` landed Oct 29, so a 1.81.0 stable may ship on or before Oct 31. **[V]** (npm `time`)

**[I] Consequence:** pin exact versions on the morning of Oct 31 (`npm i @mastra/core@1.80.0`) and do not run `@latest` mid-hack. A release could land during the 5-hour window.

## 2. Concept map (every top-level docs area)

From the docs index [1], grouped by how much each matters for a 5-hour real-time build:

| Area | Key primitives / imports | Hackathon relevance |
|---|---|---|
| **Agents** | `new Agent({ id, name, instructions, model, tools, memory, voice, agents })` from `@mastra/core/agent`; `.generate()`, `.stream()` | Core. |
| **Tools** | `createTool({ id, description, inputSchema, outputSchema, execute(inputData, context) })` from `@mastra/core/tools` | Core. The docs warn that plain-object tools "silently fail to execute" [3]. |
| **Workflows** | `createStep`, `createWorkflow(...).then().branch().parallel().commit()`; suspend/resume, snapshots, time travel, scheduled workflows | Medium: deterministic pipelines. |
| **Harness** | Durable Agents (`createDurableAgent`, `createEventedAgent`, `createInngestAgent`), Background Tasks, Goals, Schedules, AgentController | **High** for "long-running agent", the event's suggested theme. |
| **Signals** | `agent.subscribeToThread()`, `agent.sendMessage()`, `sendSignal()`, state signals, notifications, signal providers | **High** for real-time: one persistent output stream per thread, with input injectable mid-run. |
| **Memory** | `new Memory({ storage })` from `@mastra/memory`: message history, working memory, semantic recall, observational memory, multi-user threads | High (threads are the unit for signals). |
| **Subagents / multi-agent** | `agents: { a, b }` on a supervisor Agent; `A2AAgent` for remote agents | High: the Agent Relay track. |
| **Connections** | MCP (`@mastra/mcp` `MCPClient`/`MCPServer`), A2A v0.3 + v1.0, ACP, SDK agents | High: the bridge to Agent Relay. |
| **Voice** | `OpenAIRealtimeVoice` (`@mastra/voice-openai-realtime`), `OpenAIVoice`, plus about 18 other providers | **High** for "Real-Time AI" plus OpenAI credits. |
| **Sandboxes / Workspace / Browser** | `Workspace`, E2B/Daytona/Modal/Vercel/Docker…, `PlatformSandbox` | Medium (overlaps with Freestyle and Superserve). |
| **Server** | Hono-based server, adapters (Express, Next, Fastify, Koa, Nest, Elysia, TanStack), `registerApiRoute`, middleware, **PubSub** | High: PubSub is pluggable (see §6). |
| **Studio** | Local UI at `localhost:4111` via `mastra dev` | High: free demo and debug UI. |
| **Auth** | `SimpleAuth`, JWT, Clerk, **Supabase**, Better Auth, WorkOS… | Medium: Supabase Auth provider exists. |
| **Observability / Evals** | `@mastra/observability` `Observability`, `MastraPlatformExporter`, scorers, datasets, experiments | Low to medium for a hackathon. Traces are good demo material. |
| **Classifier** (new, 1.69.0, Sep 23) | typed decision questions against a `decisionModel()` | Low. |

Feature introduction dates come from "Added in" tags mapped to npm publish dates. Last 90 days: Classifier `@mastra/core@1.69.0` (2026-09-23). Background: Signals 1.39.0 (Jun 3), Goals 1.43.0 (Jun 17), Durable Agents 1.45.0 (Jun 19, still **Beta**), Schedules 1.50.0 (Jul 6), Channels 1.22.0 (Apr 3), Subagents 1.8.0 (Feb 25). **[V]** [4][5][6]

## 3. Model routing (how OpenAI credits plug in)

- Models are strings in the form `provider/model`, for example `'openai/gpt-6.1-sol'`. The docs say to use `openai/<model>`, "not `openai:<model>`", and not to import a provider object. Mastra reads `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` or `GOOGLE_API_KEY` automatically. The models page claimed "8253 models from 220 providers" when re-fetched on Oct 29 (an earlier fetch the same day read 8221 from 221; the count auto-updates, so treat it as "~8.2k models, ~220 providers"). **[V]** [3][7]
- Model IDs the docs list as current: `openai/gpt-6.1-sol` and `openai/gpt-6-luna`, plus Anthropic `claude-*-5-5` and `google/gemini-3.8-flash`. **[V]** [3]. Check these against the model list on your OpenAI credit org. **[I]**
- **Fallbacks:** pass `model: [{ model, maxRetries }, …]`. On a 500, rate limit or timeout, Mastra fails over to the next entry. **[V]** [7]. **[I]** This is cheap insurance for live demos.
- **Mastra Memory Gateway** (optional): prefix `mastra/openai/...` and set `MASTRA_GATEWAY_API_KEY` (keys start `msk_`). It is an OpenAI-compatible proxy with automatic Observational Memory keyed by `x-thread-id` and `x-resource-id`. Rate limits: 2,000 LLM requests/60s, a burst cap of 400/10s, and 5,000 requests/60s across all endpoints. **[V]** [8][9]. Gateway tokens are billed at **"Market Rate + 5.5%"**, and BYOK is supported. **[V]** [10]. **[I] Don't route through the gateway at the hackathon.** Use your $100 OpenAI credit directly with `OPENAI_API_KEY`. The gateway would bill Mastra credits you don't have.

## 4. Minimal setup snippets (copy-paste)

### 4a. Scaffold (fastest)
```bash
npm create mastra@latest haunted -- --llm openai   # per pricing-page agent prompt [10]
cd haunted && echo "OPENAI_API_KEY=sk-..." >> .env
npm run dev                                         # mastra dev → Studio + REST on :4111
open http://localhost:4111            # Studio;  /swagger-ui lists every endpoint [11]
```
`create mastra` also installs Mastra "skills" for detected coding agents, which you can opt out of with `--no-skills`. Use `--empty` for a provider-free scaffold. **[V]** [11]. For coding agents: `npx skills add mastra-ai/skills`. **[V]** [1]

### 4b. Hand-rolled minimal (from the official agent quickstart [3])
```bash
npm i @mastra/core@1.80.0 zod typescript @types/node mastra@1.36.0   # package.json: {"type":"module"}
```
```ts
// src/mastra/tools/haunt.ts
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
export const hauntTool = createTool({
  id: 'haunt-room',
  description: 'Flicker the lights in a room',
  inputSchema: z.object({ room: z.string() }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ room }) => ({ ok: true }),   // signature: execute(inputData, context)
})
// src/mastra/agents/ghost.ts
import { Agent } from '@mastra/core/agent'
import { hauntTool } from '../tools/haunt.ts'
export const ghost = new Agent({
  id: 'ghost', name: 'Ghost', instructions: 'You are a playful poltergeist.',
  model: 'openai/gpt-6.1-sol', tools: { hauntTool },
})
// src/mastra/index.ts
import { Mastra } from '@mastra/core'
import { ghost } from './agents/ghost.ts'
export const mastra = new Mastra({ agents: { ghost } })
// run.mjs  (Node >= 22.18 runs .ts imports directly, per docs)
import { mastra } from './src/mastra/index.ts'
const r = await mastra.getAgentById('ghost').generate('Haunt the kitchen')
console.log(r.text)
```

### 4c. Persistent memory + real-time thread stream (signals) [12][13]
```ts
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
const memory = new Memory({ storage: new LibSQLStore({ id: 'store',
  url: process.env.TURSO_DATABASE_URL ?? 'file:./mastra.db',   // env-guarded: required for platform deploy
  authToken: process.env.TURSO_AUTH_TOKEN }) })
// agent: new Agent({ ..., memory })
const thread = { resourceId: 'user_1', threadId: 'seance_1' }
const sub = await agent.subscribeToThread(thread)        // subscribe FIRST
await agent.sendMessage('Who is there?', thread).accepted
for await (const chunk of sub.stream) { /* text, tool calls, approvals, errors */ }
```
Client side (`@mastra/client-js`): `client.getAgent('ghost').subscribeToThread({...,withInitialHistory:true, withRunStatus:true})`, then `sendMessage(...)` and `processDataStream({ onChunk, reconnect: true })`. `thread-run-status` chunks carry `success|failed|aborted|suspended`. **[V]** [13]

### 4d. Durable agent with a reconnectable stream [6]
```ts
import { createDurableAgent } from '@mastra/core/agent/durable'
export const durableGhost = createDurableAgent({ agent: ghost })
const { output, runId, cleanup } = await durableGhost.stream('Plan the haunting')
for await (const c of output.fullStream) {}
// any other client later:  const { output } = await durableGhost.observe(runId)  // replays cache then live
```
The default cache is in-memory, so replay works within one process only. Cross-process replay needs `RedisServerCache` (`@mastra/redis`). **[V]** [6]

### 4e. Realtime voice (speech-to-speech on OpenAI Realtime) [14]
```ts
import { OpenAIRealtimeVoice } from '@mastra/voice-openai-realtime'   // v0.14.8, Oct 28
const agent = new Agent({ id:'medium', name:'Medium', instructions:'...', model:'openai/gpt-6.1-sol',
  tools: { hauntTool }, voice: new OpenAIRealtimeVoice() })            // docs example model: gpt-5.1-realtime
await agent.voice.connect()
agent.voice.on('speaker', ({ audio }) => playAudio(audio))   // also 'speaking','writing',{text,role},'error'
await agent.voice.speak('Who disturbs my slumber?')
await agent.voice.send(micStream)
```
Agent tools are callable inside realtime sessions. **[V]** [14]. **Multi-user gotcha:** a static `voice` instance is shared across every request, and realtime providers hold per-session state (WebSocket, tools, instructions), so concurrent sessions can overwrite each other. For more than one live caller, pass `voice: ({ requestContext }) => new OpenAIRealtimeVoice(...)` and use `await agent.getVoice({ requestContext })`. `agent.voice` throws when `voice` is a resolver, and Mastra does not add tools or instructions to resolver instances, so configure them inside the resolver. **[V]** [14] **[I]** The docs examples use `@mastra/node-audio` (mic and speaker on Node). For browser audio you would build your own WebRTC/WS relay, which is a time risk.

### 4f. Supervisor + MCP + A2A (multi-agent / Agent Relay bridge) [15][16][17]
```ts
const seance = new Agent({ id:'seance', instructions:'Coordinate spirits', model:'openai/gpt-6-luna',
  agents: { researchAgent, writingAgent }, memory })              // subagents need descriptions
import { MCPClient } from '@mastra/mcp'
const mcp = new MCPClient({ id:'relay', servers: { relay: { command:'npx', args:['agent-relay','mcp'],
  env: { RELAY_WORKSPACE_KEY: process.env.RELAY_WORKSPACE_KEY! } } } })   // key prefix rk_live_*
// tools: await mcp.listTools()  -> register_agent, join_channel, post_message, send_dm, check_inbox, ...
import { A2AAgent } from '@mastra/core/a2a'
const remote = new A2AAgent({ url:'https://host/api/.well-known/<id>/agent-card.json', protocolVersion:'1.0' })
```
Every Mastra agent served by Mastra Server automatically exposes an A2A agent card at `/api/.well-known/<agent-id>/agent-card.json` and an execution endpoint at `/api/a2a/<agent-id>`. Versions 0.3 and 1.0 are both supported, selected by the `A2A-Version` header. **[V]** [17]. Agent Relay's docs confirm `agent-relay mcp` is a stdio MCP server with no subcommands that reads `RELAY_WORKSPACE_KEY` from the environment (create one with `agent-relay workspace create <name>`). Registered agents then act with their own `at_live_*` tokens. **[V]** [35]. **Protocol risk [V-src, handshake untested]:** `@mastra/mcp@2.x` speaks only MCP 2026-07-28, while `agent-relay` depends on `@modelcontextprotocol/sdk ^1.23.0` (1.x line; 2026-07-28 support ships in the 2.x TS SDK packages), so this `MCPClient` path may fail to connect. Prefer the `createTool` + REST wrapper in `../reference/INTEGRATION_COOKBOOK.md` §3.7. Sibling research found **no Agent Relay adapter for Mastra**. Integrate via Relay's TS SDK inside `createTool`, or via `agent-relay mcp` through `MCPClient`. **[V, sibling]** (../agent-relay/01-docs-api.md)

### 4g. Lock down a public demo [18]
```ts
import { SimpleAuth } from '@mastra/core/server'
export const mastra = new Mastra({ agents:{ghost}, server:{ auth: new SimpleAuth({ tokens:{ [process.env.DEMO_TOKEN!]: { id:'judge' } } }) } })
```
On the platform, Studio is protected by org login by default, but **your API routes stay open unless you set `server.auth`**. **[V]** [19]

## 5. Terse Durable Actors + Mastra: the pattern Terse itself published

`TerseAI/durable-actors-mastra-example` (created Oct 14) pins `@mastra/core 1.76.0`, `durable-actors 0.8.0` and `elysia 1.4.30`, and runs on Bun >= 1.4.2. **[V]** (gh). Its `src/actors.ts` uses this pattern: one `Actor` per conversation, `@Persisted messages`, an `@Interleave async prompt()` that calls `agent.stream([...history, user])` and `broadcast`s each `textStream` delta to all WebSockets, plus a `meteorHitsDatacenter()` method that calls `process.exit(1)` to demonstrate durability. **[V]** (gh contents API). The agent is a plain `new Agent({ model: \`openai/${OPENAI_MODEL||'gpt-5-mini'}\` })` with **no Mastra memory or storage**, because the actor owns state.

**[I] Division of labor that avoids overlap:** the Terse actor owns state, sockets and serialization, and Mastra owns the model loop, tools, subagents, voice and tracing. Don't also enable Mastra Memory/Storage for the same conversation, or you get two sources of truth. Mastra's own durable agents, signals and PubSub overlap conceptually with actors. Choose actors for the Terse track and treat Mastra as the "brain".

## 6. Real-time plumbing internals worth knowing

- **PubSub is the single internal bus.** Workflows, scheduled runs, background tasks, signals and resumable streams all use it. The default `EventEmitterPubSub` is in-process only. Built-in alternatives: `UnixSocketPubSub` (one host), `RedisStreamsPubSub`, `ValkeyStreamsPubSub`, `GoogleCloudPubSub` (no leases). **[V]** [20][21]
- **Custom transport:** extend `PubSub` from `@mastra/core/events` and implement 4 methods (`publish`, `subscribe(topic, cb, {group,batch,startFrom})`, `unsubscribe`, `flush`) plus `supportedModes: ['pull'|'push']`. **[V]** [22]. **[I]** A `RelayPubSub` (Agent Relay channels) or an actor-backed PubSub would be a novel "both hosts" integration. It is also risky, because leases and redelivery semantics must hold.
- **Thread ownership:** a lease defaults to a 15 s TTL, renewed every 5 s. Delivery is at-least-once, so make tool side effects idempotent. **[V]** [21]
- A paused run (awaiting tool approval) blocks new runs on that thread (`accepted` → `blocked`). **[V]** [13]

## 7. CLI reference (what you'll actually type)

All from the CLI reference [11] **[V]**:

| Command | Purpose / notable flags |
|---|---|
| `mastra dev` | Studio + REST at `:4111`, `/swagger-ui`. `--https`, `--inspect`. `MASTRA_DEV_NO_CACHE=1` forces a rebuild; `MASTRA_CONCURRENCY` caps parallelism |
| `mastra build [--studio]` / `mastra start` | Self-contained output in `.mastra/output` |
| `mastra studio --port 3000` | Standalone Studio pointed at any server |
| `mastra deploy [--env] [--region us\|eu] [--env-file] [-y] [--skip-build] [--skip-preflight]` | Unified deploy. `--env` defaults to `production`; `--region` applies only when the CLI creates a new environment. Supersedes `mastra server deploy` / `mastra studio deploy`, which "continue to work but should no longer be used for new setups". (An earlier draft listed a `--workers dedicated\|in-process` flag; it is not in the current deploy flag list, so it was removed.) |
| `mastra env list\|create\|delete\|restart\|deploys\|vars pull` | Environments |
| `mastra env db create [env] --kind turso\|neon\|postgres [--shared]` | Hosted DBs |
| `mastra auth login\|whoami\|orgs\|tokens create <name>` | Credentials in `~/.mastra/credentials.json`; `MASTRA_API_TOKEN` for headless use |
| `mastra connect list\|add\|remove <provider>` | Platform-managed OAuth/API-key toolsets (Linear, Slack, GitHub, Supabase…) |
| `mastra api agent run <id> '{"messages":"..."}'` | JSON-in/JSON-out against local `:4111`, `--url`, or the linked project. **Useful for scripted demos** |
| `mastra lint --preflight` | Local preflight; only sees local env files |
| `mastra server pause\|restart` | Legacy server controls |

## 8. Mastra platform: limits and behavior that bite

All **[V]** from platform docs [19][23][24][25][26]:

- **Deploy:** `mastra deploy` runs build, preflight, upload, Docker image and live, in "30 seconds and a few minutes". Builds longer than **15 minutes fail**. One build per project at a time, and newer queued deploys cancel older ones. The URL is stable, `https://<project>.server.mastra.cloud`, with `/health` and `/api/agents`.
- **Ephemeral filesystem:** preflight **hard-blocks** a `file:./mastra.db` store unless it is env-guarded (`process.env.TURSO_DATABASE_URL ?? 'file:...'`). It offers to provision a managed Turso DB inline.
- **Idle sleep:** a service sleeps after **~10 minutes with no outbound packets**. Open SSE/WebSockets, `setInterval` network calls, DB heartbeats and exporters keep it awake. The **Persistent Server add-on** costs $100/project. **[I]** A WebSocket-heavy real-time demo stays awake while sockets are open (good for the demo). Expect a cold start if judges hit it after 10 idle minutes, so warm it before your slot.
- **Deploys interrupt streaming turns.** Drain time isn't guaranteed. Don't redeploy during judging.
- **Regions:** `us` resolves to `pdx` (default), and `iad` and `sfo` are also available. `eu` resolves to `ams`. The region is fixed at environment creation. Observability ingest runs in Iowa or Amsterdam.
- **Hosted DBs:** Turso (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`; default region `sjc`), Neon (`DATABASE_URL`, public), and Postgres (`DATABASE_URL`, VPC-only, unreachable from your laptop). Neon and Postgres are mutually exclusive per environment. MongoDB is "coming soon". Managed Redis (`REDIS_URL`) is not enabled for all orgs. Creating or deleting DBs requires the org admin role.
- **System env vars injected:** `MASTRA_PROJECT_ID`, `MASTRA_ENVIRONMENT_{ID,NAME,SLUG}`, `MASTRA_PLATFORM_REGION`, `MASTRA_PLATFORM_ACCESS_TOKEN`, `MASTRA_PLATFORM_BUCKET_NAME`, `MASTRA_WORKERS`. Platform values win on collision.
- **Env file upload gotcha:** deploy merges **one** local env file (`.env.<env>`, else the only `.env*`) into stored vars, and file values win. Sanitize before deploying.
- **Workspaces:** each environment gets a bucket (`PlatformFilesystem`) and on-demand sandboxes (`PlatformSandbox` from `@mastra/platform-workspace`). The bucket is not mounted into sandboxes.
- **CI:** `MASTRA_API_TOKEN` + `MASTRA_ORG_ID` + `MASTRA_PROJECT_ID` + `--yes`. Commit `.mastra-project.json`.
- **Observability exporter:** `new Observability({ configs:{ default:{ serviceName, exporters:[new MastraPlatformExporter()] }}})` from `@mastra/observability`. It batches at 1,000 events or 5 s and does not export model chunk spans. `CloudExporter` is deprecated.

## 9. Pricing tiers and how the prize translates

Pricing page, fetched 2026-10-29 [10]. All **[V]**:

| Meter | Starter ($0) | Teams ($250/mo) |
|---|---|---|
| Observability events (logs/metrics/traces) | 100K, then $10/100K | 1M, then $8/100K |
| CPU time | 24 h, then $0.35/h | 250 h, then $0.25/h |
| Data egress | 10 GB, then $0.10/GB | 100 GB, then $0.10/GB* |
| Persistent Server (24/7) | $100/project | $100/project |
| Gateway tokens | market + 5.5% | market + 5.5% |
| Memory tokens / retrieval storage | 100K, then $10/1M / 250 MB, then $20/GB | 1M, then $10/1M / 1 GB, then $20/GB |
| Hosted LibSQL rows / Postgres compute / DB storage | 1M/mo then $2.50/1M · 5 h then $0.50/h · 1 GB then $1/GB-mo | 1M/mo then $2/1M · 5 h then $0.40/h · 1 GB then $0.75/GB-mo |
| Platform data storage | 1 GB | 100 GB |
| Data retention | 15 days | 6 months |
| Users / deployments / projects | unlimited | unlimited, plus multiple teams, SSO, SOC 2 docs |

\*The Jul 17 pricing blog says Teams egress overage is $0.08/GB. The pricing page says $0.10/GB. [27]. The blog also says "Everything runs on a single pool of credits, including model and token spend", with optional auto top-up, and calls the $100 add-on "Server Always-On" (the pricing page calls it "Persistent Server"). **[V]** [27]. The pricing-page row label for LibSQL reads "Rows Written" but the overage text reads "$2.50/1M read"; which operation is metered is ambiguous on the page itself.

**Prize math [I]:** the event gives **no per-attendee Mastra credit**. Only 1st, 2nd and 3rd place win "3 / 2 / 1 months free of Mastra Platform" [28]. The event page doesn't name the tier. If it means Teams, the face value is $750, $500 and $250. Starter is already free, so the prize only means something if it is Teams or credit-equivalent. Ask the Mastra rep on site. For the hackathon itself, **the free Starter allowance is ample**: 24 CPU-hours covers one small server awake for the whole 5-hour hack and the demos, if CPU-hours meter wall-clock while awake. I could not confirm whether they meter wall-clock or actual CPU (see limits). 100K trace events is far above a demo's volume. Model spend should go to your OpenAI credits via BYOK, not the Mastra gateway. Background: the platform launched Apr 9, 2026 [29]; standalone Observability launched May 13 [30]; the Helm chart for self-hosting (EE license) shipped Aug 26 [31]; "Mastra Launch" (enterprise + FDE program) launched Oct 20 [32].

## 10. First 30 minutes checklist (on Oct 31, 11:00)

1. (0–3 min) `node -v` ≥ 22.13 (≥ 22.18 to run `.ts` directly). `npm create mastra@latest <name> -- --llm openai`. Put `OPENAI_API_KEY` in `.env`.
2. (3–6) Pin versions in `package.json` (`@mastra/core 1.80.0` or whatever you smoke-tested on Oct 30). Commit.
3. (6–10) `npm run dev` and open Studio at `:4111`. Chat with the template agent and look at a trace. Confirm your OpenAI model ID resolves.
4. (10–15) Swap in your agent(s) and tools with `createTool`. Add a `model: [primary, fallback]` array.
5. (15–20) Add `Memory` + `LibSQLStore` with the **env-guarded** URL (the §4c snippet), so deploy preflight won't block later.
6. (20–25) Wire the real-time path: either Terse actor + `agent.stream()` broadcast (§5), or `subscribeToThread` + `sendMessage` (§4c).
7. (25–30) `mastra auth login` → `mastra deploy --region us -y`. Accept the managed Turso prompt. `curl https://<project>.server.mastra.cloud/api/agents`. Add `SimpleAuth` before sharing the URL.

## 11. Limits / could not verify

- **Which platform tier the prize months refer to** is not stated on the event page [28]. Unknown.
- **How CPU time is metered** (wall-clock while awake versus actual CPU) is not explicit on the pages I read. The pricing blog points to "idle and active time" docs I didn't locate. The Persistent Server line ("folds in a full month of CPU hours") hints that awake time counts. **[I]**
- **Retention inconsistency:** the pricing page says Starter retention is 15 days, but the trace-import and query docs repeatedly mention "the current 30-day Platform retention period" [10][25]. The pricing page also has a separate "Stale Thread Retention: 15 days" row for Starter, so "retention" may refer to different data classes (unverified).
- **Environments per project** "depends on your plan". No numbers are published [24].
- The model IDs `openai/gpt-6.1-sol` and `gpt-6-luna` are listed by Mastra docs. I did not check them against OpenAI's API or the hackathon credit org.
- `OpenAIRealtimeVoice` browser usage (non-Node audio) is not documented in the pages read.
- I did not test Durable Agents (Beta: "Breaking changes may occur without a major version bump") [6], nor whether `npx agent-relay mcp` works end-to-end as an `MCPClient` stdio server (Relay's docs confirm it is a stdio MCP server configured via `RELAY_WORKSPACE_KEY` [35]; the Mastra side is untested).
- No Python SDK was found. I didn't run `mastra deploy`, so deploy timings are documentation claims.

## 12. Hackathon implications

**What to build (Mastra as the brain, hosts as the body)** [I]:
1. **Terse actor per room + Mastra agent per persona**, following Terse's published pattern (§5). Add Mastra **subagents** for a "council of ghosts", and a tool that posts to **Agent Relay** so personas in different processes message each other. That hits both hosts and the sponsor. Show `meteorHitsDatacenter()`-style crash recovery live.
2. **Voice séance:** `OpenAIRealtimeVoice` on a Mastra agent whose tools mutate actor state (lights, sounds) and which broadcasts transcripts (`'writing'` events) to all clients. This is "Real-Time AI" made literal, and it burns OpenAI credits as intended. Keep it to a Node-side audio loop or a single laptop mic to avoid browser-audio yak-shaving.
3. **Stretch:** a custom `PubSub` backed by Agent Relay, so Mastra's signals and durable streams ride Relay (§6). It is novel but risky. Only attempt it with a working baseline by 2:00pm.

**Gotchas:** pin versions (about two core releases a week). Tools must use `createTool`. Model strings use `/`, not `:`. Env-guard any `file:` DB. Don't redeploy during judging. Warm the server before your slot (10-minute idle sleep). Platform API routes are public without `server.auth`. Don't double-store conversation state in both an actor and Mastra Memory. The durable-agent in-memory cache doesn't survive multi-instance setups. A static `OpenAIRealtimeVoice` is shared across sessions, so use a voice resolver if more than one judge or browser talks to it at once. `agent-relay mcp` needs `RELAY_WORKSPACE_KEY` in the `MCPClient` server `env`.

**Setup before Oct 31 (ideas and setup are allowed, but all code must be written at the event):** install Node ≥ 22.18 (or Bun ≥ 1.4.2 if you're using Terse's example stack). Run `npm create mastra@latest scratch -- --llm openai` once to warm the npm cache, then delete it. Run `mastra auth login` and confirm `mastra auth whoami`. Read the Terse Mastra example (don't copy it). Bookmark `mastra.ai/llms.txt` and run `npx skills add mastra-ai/skills` for your coding agent. Confirm which OpenAI realtime/model IDs your credit org exposes.

**What Mastra (sponsor) likely wants [I]:** visible use of Mastra primitives beyond a single `generate()`, such as subagents, tools, workflows/durable agents, voice and Studio traces. Ideally the app is deployed on Mastra platform (their prize is platform months). Showing a Studio trace of the multi-agent run during the demo is a cheap, credible signal.

## Sources

1. Mastra docs index: https://mastra.ai/llms.txt
2. Mastra platform overview: https://mastra.ai/docs/mastra-platform/overview
3. Get started / agent quickstart: https://mastra.ai/docs (`.md`)
4. Classifier: https://mastra.ai/docs/classifier ; Goals: https://mastra.ai/docs/harness/goals
5. Harness overview: https://mastra.ai/docs/harness/overview ; Signals: https://mastra.ai/docs/signals/overview
6. Durable agents: https://mastra.ai/docs/harness/durable-agents
7. Models / fallbacks: https://mastra.ai/models
8. Mastra gateway: https://mastra.ai/models/gateways/mastra
9. Memory Gateway limits and features: https://gateway.mastra.ai/docs/limits , https://gateway.mastra.ai/docs/features
10. Pricing: https://mastra.ai/pricing
11. CLI reference: https://mastra.ai/reference/cli/mastra ; create-mastra: https://mastra.ai/reference/cli/create-mastra
12. Memory overview: https://mastra.ai/docs/memory/overview
13. Thread streams: https://mastra.ai/docs/signals/thread-streams
14. Speech-to-speech: https://mastra.ai/reference/voice/speech-to-speech ; OpenAI voice: https://mastra.ai/integrations/voice/openai
15. Subagents: https://mastra.ai/docs/subagents
16. MCP: https://mastra.ai/docs/connections/mcp
17. A2A: https://mastra.ai/docs/connections/a2a
18. Simple Auth: https://mastra.ai/docs/auth/simple-auth
19. Studio on platform: https://mastra.ai/docs/mastra-platform/studio ; Server on platform: https://mastra.ai/docs/mastra-platform/server
20. PubSub: https://mastra.ai/docs/server/pubsub
21. Running across processes: https://mastra.ai/docs/signals/running-across-processes
22. PubSub base class: https://mastra.ai/reference/pubsub/base
23. Deploy: https://mastra.ai/docs/mastra-platform/deploy ; Configuration: https://mastra.ai/docs/mastra-platform/configuration
24. Environments: https://mastra.ai/docs/mastra-platform/environments ; Regions: https://mastra.ai/docs/mastra-platform/regions ; System env vars: https://mastra.ai/docs/mastra-platform/system-environment-variables
25. Hosted databases: https://mastra.ai/docs/mastra-platform/database ; Workspaces: https://mastra.ai/docs/mastra-platform/workspaces ; Observability: https://mastra.ai/docs/mastra-platform/observability
26. Client SDK: https://mastra.ai/docs/server/mastra-client
27. "How Mastra Platform Pricing Works" (Jul 17, 2026): https://mastra.ai/blog/mastra-platform-pricing
28. Event page: https://events.ycombinator.com/haunted-hacks-2026 (local copy ../../EVENT_PAGE.md)
29. "Announcing Mastra Platform" (Apr 9, 2026): https://mastra.ai/blog/announcing-mastra-platform
30. "Announcing Mastra Observability" (May 13, 2026): https://mastra.ai/blog/announcing-mastra-observability
31. "Introducing the Mastra Helm Chart" (Aug 26, 2026): https://mastra.ai/blog/introducing-mastra-helm-chart
32. "Announcing Mastra Launch" (Oct 20, 2026): https://mastra.ai/blog/announcing-mastra-launch
33. npm registry: https://www.npmjs.com/package/@mastra/core (versions/time via `npm view`)
34. GitHub: https://github.com/mastra-ai/mastra (LICENSE.md) ; https://github.com/TerseAI/durable-actors-mastra-example (package.json, src/actors.ts)
35. Agent Relay MCP docs: https://agentrelay.com/docs/agent-relay-mcp ; CLI overview: https://agentrelay.com/docs/cli-overview

## Verification log (2026-10-29)

Adversarial re-check against live sources. Each item was checked with an attempt to refute it.

1. **`@mastra/core` 1.80.0 (Oct 28), Node >= 22.13.0, zod `^3.25 || ^4`; CLI 1.36.0, client-js 1.57.0, memory 1.39.1, voice-openai-realtime 0.14.8 (Oct 28)**: CONFIRMED via `npm view`. Added: `1.81.0-alpha.0/.1` published Oct 29.
2. **Feature dates (Subagents 1.8.0 Feb 25, Channels 1.22.0 Apr 3, Signals 1.39.0 Jun 3, Goals 1.43.0 Jun 17, Durable Agents 1.45.0 Jun 19, Schedules 1.50.0 Jul 6, 1.56.0 Aug 5, Classifier 1.69.0 Sep 23)**: npm publish dates CONFIRMED for all eight versions. Durable Agents "Added in 1.45.0" and the Beta banner CONFIRMED on the docs page.
3. **GitHub stats (29.2k stars, 3.06k forks, last push Oct 30 UTC)**: CONFIRMED (29,202 / 3,061). Open-issue count CORRECTED from 640 to ~647, which is drifting and includes PRs.
4. **"Apache-2.0" license**: PARTIALLY REFUTED. Apache-2.0 applies outside `ee/` directories, which carry a separate EE license. Corrected in §1.
5. **Terse example (created Oct 14, `@mastra/core 1.76.0`, `durable-actors 0.8.0`, `elysia 1.4.30`, Bun >= 1.4.2, `@Persisted`/`@Interleave`/`broadcast`/`meteorHitsDatacenter`, `gpt-5-mini` default)**: CONFIRMED via gh contents API.
6. **Model router count "8221 models from 221 providers"**: CORRECTED. The live page now says 8253 / 220. Model IDs `openai/gpt-6.1-sol`, `openai/gpt-6-luna`, `google/gemini-3.8-flash` and `anthropic/claude-*-5-5` appear in the docs examples (CONFIRMED in Mastra docs only; not checked against OpenAI). The fallback-array semantics (500, rate limit, timeout) were CONFIRMED.
7. **Memory Gateway limits (5,000/60s global, 2,000/60s LLM, 400/10s burst, `msk_` keys)**: CONFIRMED at gateway.mastra.ai/docs/limits. The page also lists memory read 1,200/60s and write 600/60s.
8. **Pricing table (Starter $0 / Teams $250; 100K vs 1M events; 24 vs 250 CPU-h; $100 Persistent Server; market + 5.5%; 15 days vs 6 months)**: CONFIRMED on the live pricing page. Overage rates for memory, retrieval storage, LibSQL and DB storage, plus the platform data-storage row, were ADDED.
9. **Pricing blog Jul 17: Teams egress $0.08/GB, "single pool of credits"**: CONFIRMED (author Joel Smith). The quote was tightened to the exact wording.
10. **Idle sleep ~10 min with no outbound packets; 15-min build limit; one build at a time, latest queued wins; env-file merge where file values win**: CONFIRMED on the Server-on-platform docs. Nuance added in the source: an empty value in the file does not clear a stored var.
11. **Studio protected by platform auth, API routes open without `server.auth`**: CONFIRMED (Studio-on-platform docs).
12. **`mastra deploy` flags**: PARTIALLY REFUTED. `--workers dedicated|in-process` is not in the current flag list, so it was removed. `--skip-build` was added. `--region` applies only when an environment is created.
13. **Regions (`us`→`pdx` default, `iad`, `sfo`; `eu`→`ams`)**: CONFIRMED. Turso `sjc` for `pdx`/`sfo` is consistent with the regions table. The Observability ingest location (Iowa/Amsterdam) was not re-checked.
14. **Realtime voice: docs example model `gpt-5.1-realtime`, tools usable in realtime, events `speaker`/`speaking`/`writing`/`error`**: CONFIRMED. ADDED: the shared-instance / voice-resolver gotcha.
15. **Lease 15 s TTL renewed every 5 s; at-least-once delivery; `GoogleCloudPubSub` has no leases; paused run → `blocked`**: CONFIRMED (running-across-processes and thread-streams docs).
16. **A2A card path `/api/.well-known/<id>/agent-card.json`, execution `/api/a2a/<id>`, v0.3 + v1.0 via `A2A-Version`**: CONFIRMED. Note that `A2AAgent` defaults to v0.3 unless `protocolVersion: '1.0'` is set.
17. **Plain-object tools "silently fail"; `execute(inputData, context)`; Node 22.18 runs `.ts`; `npx skills add mastra-ai/skills`; `create-mastra --llm/--empty/--no-skills`**: CONFIRMED (docs.md, create-mastra reference).
18. **Blog dates: Platform Apr 9, Observability May 13, Helm chart Aug 26 (requires EE license), Mastra Launch Oct 20**: CONFIRMED.
19. **Prize: 3 / 2 / 1 months of Mastra Platform for 1st / 2nd / 3rd, with no per-attendee Mastra credit**: CONFIRMED against the local event page (the per-attendee list names only OpenAI, Supabase, Freestyle and Superserve). The tier is still unstated (unverified).
20. **`npx agent-relay mcp` as a stdio server**: CONFIRMED against Agent Relay docs. CORRECTED the snippet to pass `RELAY_WORKSPACE_KEY`. Not tested end-to-end with `MCPClient` (unverified).
