# Mastra: GitHub and code reality (for Haunted Hacks, 31 Oct 2026)

Checked 29 October 2026 (PT) with the `gh` CLI against the GitHub REST, Search and GraphQL APIs, plus `npm view` and the npm downloads API. Every number below is a snapshot from that day. **[V]** means I verified it directly from GitHub or npm output. **[I]** means it is my inference. Items before August 2026 are marked *background*.

Scope: org/repos, activity, releases, issues, examples/templates and community code. Docs, launch news and social sentiment are covered in sibling files (01, 02, 04).

---

## 1. TL;DR

- **Mastra is huge and moves very fast.** `mastra-ai/mastra` has 29.2k stars and 3,061 forks. About 2,000 commits and 1,858 merged PRs landed in October 2026 alone, and `@mastra/core` ships a **minor release roughly every 2–5 days (1.56 → 1.80 between Aug 6 and Oct 28)**. Most of those releases include a "Breaking Changes" section. **[V]**
- **This means two things for a 5-hour hack.** First, pin exact versions on Friday. The official starter depends on `"latest"` for every package. Second, LLM coding assistants trained on old Mastra will produce stale APIs. Install the `mastra-ai/skills` skill or use the embedded docs. **[V for facts, I for advice]**
- **Mastra has no prize track of its own.** Its prize is 3/2/1 months of Mastra Platform for 1st/2nd/3rd overall (EVENT_PAGE.md, Prizes section). That means Mastra should be the *agent brain inside* a Durable Actors and/or Agent Relay project, not the headline. **[V event page, I strategy]**
- **A Terse + Mastra integration pattern already exists:** `TerseAI/durable-actors-mastra-example` uses `@mastra/core@1.76.0` as a plain library inside a Durable Actor (`new Agent(...)`, `agent.stream()`), with no `mastra dev` server. That is the lowest-risk way to combine the two. **[V]**
- **There is no Agent Relay adapter for Mastra.** A code search of the `AgentWorkforce` org for "mastra" returns only `relayfile/docs/relayfile-agents-integration-spec.md`, and a repo search for "mastra agent relay" returns nothing. Mastra ships **A2A v0.3 + v1.0** (`@mastra/core/a2a`, `/a2a/v1`) and MCP v2. **[V]** The Agent Relay README says `relay init` "adds Relay to" coding agents, and it documents `agent-relay mcp --sessions-only` for Shared Sessions, so Relay does expose MCP. Whether a general Relay MCP server exposes message send/receive to an arbitrary MCP client like `@mastra/mcp` is **(unverified)**. The safe path is to wrap the Relay CLI/SDK in Mastra `createTool` tools. **[I]**

---

## 2. Org and repo inventory

`mastra-ai` org: 137 public repos, 738 followers, created 2023-10-26. **[V]** (`gh api orgs/mastra-ai`)

| Repo | Stars | Last push | Why it matters for the hack |
|---|---|---|---|
| [mastra](https://github.com/mastra-ai/mastra) | 29,200 | 2026-10-30 (UTC) | Monorepo: core, CLI, 35+ stores, 20 voice providers, deployers, templates |
| [ui-dojo](https://github.com/mastra-ai/ui-dojo) | 180 | 2026-08-03 | Mastra + UI frameworks (AI SDK UI, CopilotKit, assistant-ui) |
| [skills](https://github.com/mastra-ai/skills) | 100 | 2026-10-27 | Official coding-agent skill (`npx skills add mastra-ai/skills`) |
| [softwarefactory-template](https://github.com/mastra-ai/softwarefactory-template) | 62 | 2026-10-27 | "Mastra Factory": issues → plans → PRs. The event page literally says "build your own Software Factory" |
| [template-browsing-agent](https://github.com/mastra-ai/template-browsing-agent) | 43 | 2026-09-15 | Stagehand + Mastra |
| [workshops](https://github.com/mastra-ai/workshops) | 30 | 2026-10-23 | Team workshop code |
| [template-agent-harness](https://github.com/mastra-ai/template-agent-harness) | 3 | 2026-10-22 | General agent with workspace, shell, memory, tasks |
| [weather-agent](https://github.com/mastra-ai/weather-agent) | 7 | 2026-10-22 | What `create-mastra` scaffolds |

About 40 `template-*` repos are mirrored from `mastra/templates/`. Many were pushed Oct 15–29 and are enterprise-flavoured (KYC onboarding, AP invoice processing, vendor-risk, insurance policy checking, security incident triage). Most have 0–1 stars. **[V]** They are fine as references, but none is real-time or multiplayer. **[I]**

**License:** GitHub reports `NOASSERTION`. `LICENSE.md` says Apache-2.0 for everything except any `ee/` directory (e.g. `@mastra/core/auth/ee`, `@mastra/core/agent-builder/ee`, `@mastra/editor/ee`), which uses `ee/LICENSE`. Avoid the `ee` subpaths in the hack. **[V]**

### Monorepo layout (top level, Oct 29) **[V]**
- `packages/`: core, cli, create-mastra, memory, rag, mcp, server, deployer, playground (Studio), evals, connect, agent-builder, editor, schema-compat, codemod, mcp-docs-server
- `stores/` (35): pg, libsql, redis, upstash, convex, cloudflare / cloudflare-d1, clickhouse, duckdb, mongodb, pinecone, qdrant, turbopuffer, etc.
- `voice/` (20): **openai-realtime-api**, **xai-realtime-api**, **google-gemini-live-api**, **aws-nova-sonic**, deepgram, elevenlabs, inworld, etc.
- `integrations/`: **livekit**, brightdata, parallel, perplexity, tavily, opencode
- `server-adapters/`: hono, express, fastify, koa, elysia, nestjs, next, tanstack-start
- `deployers/`: cloud, cloudflare, netlify, vercel, sandbox
- `workflows/`: inngest, temporal. `pubsub/`: redis-streams, valkey-streams, google-cloud-pubsub
- `channels/`: slack, discord, teams, telegram. `agent-sdks/`: acp, claude, cursor, openai
- `examples/`: `durable-agents`, `voice-agent` (LiveKit call-centre), `voice` (interactive-story, voice-memo-app), `mcp-events`, `inngest`, `agent`, etc.

---

## 3. Activity and cadence

### Monthly throughput (GitHub Search API counts) **[V]**

| Month (2026) | Commits | Merged PRs | Issues opened |
|---|---|---|---|
| August | 1,284 | 1,174 | 562 |
| September | 1,684 | 1,531 | 724 |
| October 1–29 | 1,992 | 1,858 | 806 |

- Repo totals: 372 open / 6,703 closed issues and 268 open PRs. GitHub's `open_issues_count` of 640 includes PRs (it read 647 on a re-check late on Oct 29 PT, so these numbers drift by the hour). 89 open issues carry `bug` and 7 carry `p: urgent`. **[V]**
- **Bots dominate the commit log.** Since Aug 1, the top committers are `mastra-platform[bot]` (1,306) and `dane-ai-mastra[bot]` (636), followed by damien-schneider (437) and abhiaiyer91 (308). The contributors API lists 467 contributors in total. **[V]** Raw commit counts overstate human velocity. **[I]**
- **Issue triage is fast but partly self-generated.** For 300 issues opened Oct 1–28 and already closed, the median time-to-close was **20.7 h** (p75 52 h). The most frequent author in that sample is `app/mastra-platform` (56 of 300), with co-founder `abhiaiyer91` next (34). Many "issues" are internal or bot-filed tracking items. **[V numbers, I interpretation]**
- **GitHub Discussions are disabled** (`has_discussions: false`). Support happens on Discord (linked from the create-mastra README). **[V]**

### Release cadence: `@mastra/core` stable releases **[V]**
1.56.0 (Aug 6) → 1.60.0 (Aug 19) → 1.64.0 (Sep 4) → 1.68.0 (Sep 23) → 1.72.0 (Sep 30) → 1.75.0 (Oct 7) → 1.78.0 (Oct 16) → 1.79.0 (Oct 21) → **1.80.0 (Oct 28)**. Those dates are GitHub release `publishedAt` (UTC). The npm publish usually lands hours to a day earlier (e.g. 1.56.0 on npm 2026-08-05T00:16Z, 1.78.0 on npm 2026-10-15T22:37Z, 1.80.0 on npm 2026-10-28T13:39Z per `npm view @mastra/core time`). That is 24 minor bumps (25 minor versions counting both ends) in about 12 weeks, with no prereleases on the releases page. Expect **1.81 between now and Saturday**. **[I]**

npm on Oct 29 **[V]**: `@mastra/core` 1.80.0 (3.04M weekly downloads), `mastra` CLI 1.36.0 (1.23M), `@mastra/memory` 1.39.1 (1.63M), `@mastra/pg` 1.33.0 (1.40M), `@mastra/mcp` 2.6.0 (1.09M), `@mastra/ai-sdk` 1.11.2 (819k), `@mastra/libsql` 1.27.1, `@mastra/client-js` 1.57.0, `@mastra/react` 1.13.0, `@mastra/inngest` 1.10.8, `@mastra/voice-openai-realtime` 0.14.8 (50k, still pre-1.0), `@mastra/deployer-cloudflare` 1.2.39 (7.4k), `create-mastra` 1.36.0 (3.7k).

`@mastra/core` 1.80.0 requires **Node `>=22.13.0`** and peer `zod ^3.25 || ^4`. It bundles `ws`, `hono`, `croner`, two A2A SDK versions (`@a2a-js/sdk` 1.0 and 0.3) and three AI SDK provider generations (v5/v6/v7). **[V]**

---

## 4. What shipped Aug–Oct 2026 that is relevant to "real-time" and "actors"

From release-note Highlights **[V]**. Relevance labels are **[I]**.

| Release | Highlight | Hack relevance |
|---|---|---|
| 1.58 (Aug 12) | File-based agent schedules, dynamic workflows, custom `createRoute()` API routes | Cron-style "haunting" agents |
| 1.60 (Aug 19) | **Durable execution for Agents API (no deploy required)**, live-tail PubSub (`startFrom: "latest"`, #21535), *opt-in* MCP stateless 2026-07-28 (legacy connections unaffected until 1.68) | Resumable agent streams |
| 1.62 (Aug 24) | SSE heartbeats, computer-use sandboxes (E2B Desktop) | Long streams survive idle |
| 1.66 (Sep 11) | First-chunk timeout for streaming | Prevents hung UIs |
| 1.68 (Sep 23) | **`@mastra/mcp@2.0.0` major rewrite (MCP 2026-07-28 only, legacy handshake removed)** | Old MCP servers may not connect |
| 1.70 (Sep 25) | `ModelSelectionProcessor` per-request model routing; cross-process cancellation | Cheap model for simple turns |
| 1.72 (Sep 30) | Thread streaming / PubSub retention, multi-worker leases, Teams channel | Multi-client thread streams |
| 1.75 (Oct 7) | `@mastra/connect@1.0` (renames `integrations` → `providers`) | Breaking for any old snippet |
| 1.76–1.77 (Oct 13–14) | Durable-agent run ownership and storage-level **run fencing** | Single-writer semantics (overlaps conceptually with actors) |
| 1.78 (Oct 16) | Agent `scopes`, **typed `queueSignal()`** for agents | Inject events into a running agent |
| 1.79 (Oct 21) | **Experimental MCP Events** (poll/stream/webhook), sessions by `sessionId` (breaking) | Event-driven agents |
| 1.80 (Oct 28) | Thread subscriptions `withRunStatus: true`, `agent.abortRun(runId)`; **disconnecting observers no longer aborts durable runs** | Exactly the "close tab, agent keeps going" demo |

The **durable-agents example** shows three patterns: `createDurableAgent` (Redis resumable streams), `createEventedAgent` (workflow engine), and `createInngestAgent`. All of them reconnect with `POST /api/agents/:id/observe {runId, offset}`. **It requires Redis** (`docker run -p 6379:6379 redis`), and the default `EventEmitterPubSub` is **process-local**. [examples/durable-agents/README.md](https://github.com/mastra-ai/mastra/tree/main/examples/durable-agents) **[V]**

---

## 5. Sharp edges from issues (last 90 days unless marked)

### Build / dev server (the most likely to burn hack time)
- **#28645 (open, Oct 27):** `mastra build` needs about 13× more memory since `@mastra/deployer` 1.79.0. Larger apps hit `JavaScript heap out of memory`. **[V]**
- **#28491 (open, Oct 26):** `mastra dev` writes `server-config.mjs` chunks as `.js`, which fail to load under tsx. **[V]**
- #28303 / #28317 (open, Oct 23): `mastra build` reinstalls inlined workspace packages. Cloud Docker installs for pnpm are lockfile-less since deployer 1.68. **[V]**
- Closed in Oct but indicative: #27143 `DEPLOYER_BUNDLE_EXTERNALS_SHARED_CHUNK` on valid monorepos, #27134, #27033, #27086, #26540, #26321. The **monorepo/workspace bundler is the fragile part**. #25029 (Sep): deployer inlined core + zod in monorepo builds, causing OOM and "dual zod crash". **[V]** → Keep the hack a **single package, not a pnpm workspace**. **[I]**
- #25404: `mastra dev` treats a stale `dev.lock` as a live server. #22382: `mastra build` empties `.mastra` while dev holds the lock. **[V]** → Delete `.mastra/` when things act strangely. **[I]**
- Security: #26897 (filed Oct 13, closed Oct 21), CVE-2026-78847, gray-matter `---js` frontmatter `eval()` in `@mastra/deployer`. Fixed. Stay on current versions. **[V]**

### Streaming / real-time behaviour
- **#21902 (open, p: high):** when a model emits N parallel tool calls in one step, **all tool results stream only after the slowest finishes**. A "tool 1 done" UI won't update incrementally. **[V]** → Emit progress yourself (actor broadcast) from inside the tool's `execute`. **[I]**
- #24628 (open): the agent loop persists a snapshot before inference on every turn (about 300 ms default-path cost). #27319 (open): Observational Memory does about 13 storage round trips per model call. #21881 (closed Aug): 25–30 serial DB round trips per turn, adding 1–2 s TTFT over networked Postgres. **[V]** → For a latency-sensitive demo, skip Memory/OM and keep history in your actor. **[I]**
- #28843 (open, Oct 29): thread-stream runtime can swallow the next send after an aborted parked run. #28535/#28536: thread signals can be dropped if the process exits. **[V]** These are new and edge-casey, but they sit exactly on the 1.78–1.80 "signals/subscriptions" features. **[I]**

### Durable agents (new and still settling)
- 10+ open `Durable Agents` issues filed Oct 24–29, e.g. #28879 `DURABLE_AGENT_EXECUTION_UNVERIFIED` under pg pool contention, #28641 crash-recovered run skips `isTaskComplete`, #28421 `observe()` replay shows both lost and re-run step. Inngest variants: #27925 (severity critical: duplicated final answer with queued approvals), #27860, #27485. **[V]** → Don't make Mastra durable agents your durability story. Terse's Durable Actors is the sponsor-aligned durability primitive anyway. **[I]**
- #24044 (open, p: high): durable workflow operation IDs collide across loop iterations and resumes. #20603 (open, p: high): custom tool suspension / Studio resume UI / invalid `resumeData`. **[V]**

### Voice / realtime
- `@mastra/voice-openai-realtime` is **0.14.x** and speaks to OpenAI over a **server-side WebSocket**. The README sample uses `@mastra/node-audio` mic streams. Browser audio plumbing is on you. [README](https://github.com/mastra-ai/mastra/tree/main/voice/openai-realtime-api) **[V]**
- Bugs fixed in Sep–Oct show the shape of the sharp edges: #22971 `connect()` hangs forever on an invalid API key, #23723 tools received `{context: args}` (wrong input shape), #26505 tool returning `undefined` sends `function_call_output` without `output`, #26693 speaker stream never ends on tool-only turns. All closed. **[V]** → Always return a value from voice tools, and wrap `connect()` in your own timeout. **[I]**
- `examples/voice-agent` shows the more robust path: **`@mastra/livekit`** handles WebRTC, STT, turn detection and barge-in, while Mastra generates replies. It is heavier to set up (LiveKit project + worker). **[V/I]**

### Deploy targets
- **#14503 (open since Mar 19, p: urgent, background but still live):** `@mastra/core` ≥1.11 breaks on **Cloudflare Workers** because AJV v8 uses `new Function()`. A maintainer re-flagged it on 2026-09-21 with 4 independent reporters, still reproducible on main. **[V]** → Do not plan a Workers deploy for Mastra code. **[I]**
- Postgres/Supabase (background): #16041 PostgresStore SCRAM failure against Supabase Supavisor (closed May). #15338 15–20 s connect via CF Workers + Supabase (closed Apr). #19468 pg pool had no `error` listener, so ECONNRESET crashed the process (closed Jul). #27258 (open) asks for Postgres sizing guidance for durable agents. **[V]** → For a hack, use LibSQL (`file:./mastra.db`, the starter default) or Supabase's direct/session connection, not transaction pooling. **[I]**

### Schema / provider
- Zod v3/v4 coexistence keeps biting: #24403 MCP 2.0 + zod v3 schema rejection, #23993, #24516, #21170, #23658 (TS memory blow-up with many Zod tools). **[V]** → Use zod 4 everywhere (the starter pins `^4.3.6`). **[V/I]**
- #26311 (closed): OpenAI strict-schema compat wasn't applied to Azure. #26829 (open): constraints folded into descriptions for OpenAI. #28691 (open): can't send explicit `reasoning_effort: null` to OpenAI-compatible providers. **[V]**
- #24110 (open, p: urgent): `TokenLimiter` processor drops the current run's tool call/result, so the agent loops. → Don't use `TokenLimiter`. **[V/I]**

---

## 6. Official starter and examples: what you actually get

- `npx create-mastra@latest` requires **Node ≥22.13** and is interactive (`--help` lists non-interactive flags). [create-mastra README](https://github.com/mastra-ai/mastra/tree/main/packages/create-mastra) **[V]**
- The scaffold mirrors `templates/weather-agent`: scripts `mastra dev | build | start`, deps `@mastra/core`, `evals`, `libsql`, `loggers`, `memory`, `observability` **all `"latest"`**, `zod ^4.3.6`, `packageManager: pnpm@11.3.0`. `index.ts` wires `LibSQLStore('file:./mastra.db')`, `PinoLogger`, and `Observability` with `MastraStorageExporter` + `MastraPlatformExporter` (sends traces to Mastra Platform only if `MASTRA_CLOUD_ACCESS_TOKEN` is set). **[V]**
- **Mastra Studio** runs at `http://localhost:4111` under `mastra dev` and is the recommended first debugging stop (`skills/mastra/references/common-errors.md`). **[V]**
- Top documented errors (same file) **[V]**: ESM only (`"type": "module"`, no CJS tsconfig). Tools must be passed to the Agent *and* IDs must match. Memory needs a storage backend plus a consistent `threadId`. Workflows fail with `Cannot read property 'then' of undefined` if you forget `.commit()`. Workflow state changes need `setState`.
- CLI subcommands in `packages/cli/src/commands`: `init, create, dev, build, start, deploy, studio, server, worker, env, db, migrate, auth, connect, api, traces, scorers, experiment, lint`. **[V]**
- `@mastra/deployer-cloud`: Studio is **excluded by default** in cloud builds (`new CloudDeployer({ studio: true })` to include it). Uses Mastra Cloud LibSQL when `MASTRA_STORAGE_URL`/`MASTRA_STORAGE_AUTH_TOKEN` are present. **[V]**

---

## 7. Community and partner code built on Mastra

| Repo | Stars | Pushed | Note |
|---|---|---|---|
| [TerseAI/durable-actors-mastra-example](https://github.com/TerseAI/durable-actors-mastra-example) | 0 | Oct 2026 | **Host-built** (created 2026-10-14, last push 2026-10-18, MIT). Bun ≥1.4.2, Elysia 1.4.30, `durable-actors` 0.8.0, `@mastra/core` 1.76.0 (4 minors behind current 1.80.0). One actor per chat owns sockets and the agent loop. `openai/${OPENAI_MODEL \|\| "gpt-5-mini"}` model string, `agent.stream([...history, msg])` → `textStream` broadcast **[V]** |
| [convex/mastra](https://github.com/convex/mastra) | 57 | 2026-10-28 | Convex component for durable Mastra workflows **[V]** |
| [assistant-ui/mastra-hitl](https://github.com/assistant-ui/mastra-hitl) | 45 | 2026-10-29 | Human-in-the-loop UI demo **[V]** |
| [CopilotKit canvas-with-mastra](https://github.com/CopilotKit/canvas-with-mastra) / mastra-pm-canvas | 58 / 54 | Mar 2026 (background) | AG-UI canvases **[V]** |
| [shadcn-labs/agentcn](https://github.com/shadcn-labs/agentcn) | 497 | 2026-10-07 | "shadcn/ui for agents" (matched a Mastra search; I did not confirm how deeply it uses Mastra) **[V/unclear]** |
| [tubone24/a2a_mastra](https://github.com/tubone24/a2a_mastra) | 43 | May 2026 (background) | Multi-agent A2A demo with Mastra **[V]** |
| [w-okada/mastra-realtime-voice-api-demo](https://github.com/w-okada/mastra-realtime-voice-api-demo) | 5 | Jul 2025 (background) | Old realtime voice demo; APIs have changed since **[V]** |

Past "Mastra hackathon" repos on GitHub (2025–Jul 2026) are all 0–2 stars, mostly travel/market-intel/portfolio agents. Nothing in that set is real-time or multiplayer. **[V]** Plain chat agents are crowded territory. **[I]**

---

## 8. Limits / could not verify

- I did not run `create-mastra` or build anything, so the build regressions are as reported in issues and not reproduced.
- I could not get a reliable GitHub code-search count of repos depending on `@mastra/core`. npm downloads are the only adoption proxy here.
- Issue counts come from the Search API and include bot/internal filings. Time-to-close is based on a 300-issue sample, not the full population.
- The Mastra Platform prize terms (what "3 months free" covers, and whether a Platform deploy is expected) are not on GitHub. See the docs/news sibling files.
- I could not determine whether the `gpt-4o-mini-realtime` model string in the realtime voice README is current for OpenAI's 2026 realtime models. Check it against the OpenAI research.
- I did not inspect Agent Relay internals beyond confirming that no Mastra adapter exists. That is covered in `agent-relay/03-github-code.md`.

---

## 9. Hackathon implications

**What to build (Mastra's role)** **[I]**
1. Use Mastra as the **per-agent brain inside a Terse Durable Actor**: one actor per room/agent, a Mastra `Agent` with tools, and `agent.stream()` output broadcast over the actor's WebSockets. This copies the host's own example, so judges will recognise it and it carries little risk.
2. Make each Mastra agent an **Agent Relay participant**. Expose relay send/receive as Mastra `createTool` tools. Connecting Relay's MCP server through `@mastra/mcp` 2.x is possible only if that server speaks MCP 2026-07-28 (`@mastra/mcp@2.0.0` removed the legacy handshake), so test it on Friday. This gives you both bonus tracks, plus Mastra and OpenAI as the model layer.
3. If you want "real-time AI" in the literal sense, voice is the flashy option. `@mastra/voice-openai-realtime` is the quick path, and `@mastra/livekit` is the robust one. Only do it if someone on the team has done browser audio before.
4. Optional garnish: the Software Factory angle. The event text explicitly invites "your own Software Factory", and Mastra ships `create factory`. It is too heavy to stand up and customise in 5 hours, though, and "all code must be created at the hackathon" makes a scaffolded factory a weak submission.

**Gotchas a 5-hour team will hit** **[V-backed, advice I]**
- `"latest"` everywhere plus weekly breaking minors: **pin exact versions** (e.g. `@mastra/core@1.80.0`, `mastra@1.36.0`) and commit the lockfile. Don't upgrade mid-hack if 1.81 drops.
- Node ≥22.13 (core) vs Bun (Terse example): decide on one runtime. The Terse example runs `@mastra/core` under Bun without `mastra dev`. If you also want Studio, run a separate `mastra dev` process for debugging only.
- Single package, no pnpm workspace (the deployer/bundler regressions are monorepo-centric). Delete `.mastra/` on weird dev errors.
- Don't target Cloudflare Workers (#14503). Deploy to a Node/Bun host, or just demo locally.
- Parallel tool results stream late (#21902). Push your own progress events from tools.
- Skip Memory/Observational Memory/TokenLimiter for the live demo, because of extra DB round trips and open urgent bugs. Keep conversation state in the actor.
- Mastra durable/evented agents need Redis and are bug-dense this week. Let Terse own durability.
- Voice tools must return a value. Add a timeout around `voice.connect()`.
- Use zod 4 only. Pass tools to the Agent and match IDs. Remember `.commit()` on workflows.
- Model strings use the router format `openai/<model>` (as in the Terse example). Set `OPENAI_API_KEY`.

**Setup before Oct 31**
- `nvm install 22` (≥22.13). Install Bun ≥1.4.2 if you use the Terse example.
- `npx skills add mastra-ai/skills` into your coding agent so it reads current APIs. Optionally add `@mastra/mcp-docs-server`.
- Clone and run `TerseAI/durable-actors-mastra-example` and `mastra-ai/mastra/examples/durable-agents` once to learn the patterns, then throw them away (code must be written at the event).
- Pre-pull `redis` and `postgres/pgvector` Docker images only if you plan to use them.
- Create a Mastra Platform account and confirm `MASTRA_CLOUD_ACCESS_TOKEN` tracing works. That is cheap goodwill toward the Mastra prize. **[I]**

**What judges/sponsors likely want** **[I]**: the event page's judging criterion is Durable Actors and Agent Relay. Mastra's payoff is only through overall placement (Platform months). Show Mastra visibly (Studio traces on a second screen, named agents with tools), but pitch the actor + relay architecture.

---

## Sources

- https://github.com/mastra-ai (org metadata via `gh api orgs/mastra-ai`)
- https://github.com/mastra-ai/mastra (repo stats, contributors, commits, LICENSE.md, directory listings)
- https://github.com/mastra-ai/mastra/releases (`@mastra/core@1.56.0` … `@mastra/core@1.80.0` release notes)
- https://github.com/mastra-ai/mastra/tree/main/examples/durable-agents
- https://github.com/mastra-ai/mastra/tree/main/examples/voice-agent
- https://github.com/mastra-ai/mastra/tree/main/voice/openai-realtime-api
- https://github.com/mastra-ai/mastra/tree/main/templates/weather-agent
- https://github.com/mastra-ai/mastra/tree/main/packages/create-mastra
- https://github.com/mastra-ai/mastra/tree/main/deployers/cloud
- https://github.com/mastra-ai/skills (README; skills/mastra/references/common-errors.md)
- https://github.com/mastra-ai/softwarefactory-template
- Issues: https://github.com/mastra-ai/mastra/issues/14503, /21902, /24110, /24628, /27319, /21881, /28645, /28491, /28303, /28317, /27143, /25029, /25404, /22382, /26897, /28843, /28535, /28536, /28879, /28641, /28421, /27925, /27860, /27485, /24044, /20603, /22971, /23723, /26505, /26693, /16041, /15338, /19468, /27258, /24403, /23993, /24516, /21170, /23658, /26311, /26829, /28691
- https://github.com/TerseAI/durable-actors-mastra-example (package.json, src/actors.ts, src/backend.ts)
- https://github.com/AgentWorkforce/relayfile/blob/main/docs/relayfile-agents-integration-spec.md
- https://github.com/convex/mastra, https://github.com/assistant-ui/mastra-hitl, https://github.com/CopilotKit/canvas-with-mastra, https://github.com/shadcn-labs/agentcn, https://github.com/tubone24/a2a_mastra, https://github.com/w-okada/mastra-realtime-voice-api-demo
- npm: https://www.npmjs.com/package/@mastra/core and the downloads API https://api.npmjs.org/downloads/point/last-week/@mastra/core (plus the other packages listed in §3)
- /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md (Prizes section)
- https://github.com/AgentWorkforce/relay (README: `relay init`, `agent-relay mcp --sessions-only`)

---

## Verification log (2026-10-29)

Adversarial re-check by a second pass on 2026-10-29 (PT), using `gh api`, `gh release view`, `gh search`, `npm view` and the npm downloads API. "Confirmed" means the live source matched the claim.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | `mastra-ai/mastra` 29.2k stars, 3,061 forks, Discussions off, license NOASSERTION | `gh api repos/mastra-ai/mastra` | Confirmed: 29,202 stars, 3,061 forks, `has_discussions:false`, `NOASSERTION`. `open_issues_count` is now 647 (doc had 640, which is drift). Annotated. |
| 2 | Org: 137 repos, 738 followers, created 2023-10-26 | `gh api orgs/mastra-ai` | Confirmed |
| 3 | Repo table stars and push dates (skills 100, softwarefactory-template 62, ui-dojo 180, weather-agent 7, template-agent-harness 3) | `gh api repos/...` | Confirmed, exact |
| 4 | npm: core 1.80.0 / 3.04M weekly, mastra CLI 1.36.0 / 1.23M, mcp 2.6.0 / 1.09M, voice-openai-realtime 0.14.8 / 50k, create-mastra 1.36.0 / 3.7k | `npm view` + downloads API | Confirmed (3,044,665; 1,225,436; 1,094,990; 50,198; 3,707) |
| 5 | Core needs Node >=22.13.0, peer zod ^3.25 \|\| ^4; bundles ws, hono, croner, A2A 0.3 + 1.0 | `npm view engines peerDependencies`; core `package.json` | Confirmed (`@a2a-js/sdk-v0_3` ~0.3.14, `@a2a-js/sdk-v1` ~1.0.1) |
| 6 | Release dates 1.56 → 1.80 | `gh release view` publishedAt vs `npm view time` | Confirmed as GitHub release dates. npm publishes run about 0.5–1 day earlier. Clarified in §3. "25 minor versions" restated as 24 bumps / 25 versions inclusive. |
| 7 | 1.60 highlights: durable Agents API, `startFrom: "latest"`, MCP stateless | Release body | Confirmed. MCP stateless was *opt-in* and non-breaking in 1.60; legacy removal came in `@mastra/mcp@2.0.0` (1.68). Row clarified. |
| 8 | 1.68: `@mastra/mcp@2.0.0` MCP 2026-07-28 only, legacy handshake removed | Release body "Breaking Changes" | Confirmed verbatim |
| 9 | 1.76/1.77 run fencing; 1.78 `queueSignal()`; 1.79 experimental MCP Events + `sessionId` breaking | Release bodies | Confirmed (1.79 MCP Events cites SEP-3415 draft) |
| 10 | 1.80: `withRunStatus: true`, `agent.abortRun(runId)`, disconnecting observers no longer aborts durable runs | Release body | Confirmed. Source adds "by default" and "durable/evented execution". |
| 11 | October throughput: 1,992 commits, 1,858 merged PRs, 806 issues | GitHub Search API, same date ranges | Confirmed, exact |
| 12 | Issue facts: #14503 (open, p: urgent, Mar 19, maintainer re-flag 2026-09-21, 4 reporters); #21902 (open, p: high); #24110 (open, p: urgent); #28645, #28491, #28303 (open); #26897 CVE-2026-78847 closed; #27925 severity critical; #28879, #28843 (open, Oct 29); #24044, #24628 (open, p: high) | `gh api repos/mastra-ai/mastra/issues/N` + #14503 comments | All confirmed. #14503 re-flag was by `abhiaiyer91` (MEMBER) on 2026-09-21. #26897 was filed Oct 13 and **closed Oct 21** (the doc's "closed Oct 13" means filed Oct 13; the fix closed later). |
| 13 | Durable-agents example needs Redis; three factories; `/observe`; EventEmitterPubSub is process-local | README in `examples/durable-agents` | Confirmed (README line comment: "EventEmitter pubsub for real-time delivery (process-local)") |
| 14 | Terse example pins `@mastra/core` 1.76.0, `durable-actors` 0.8.0, Elysia 1.4.30, Bun >=1.4.2; `openai/${OPENAI_MODEL \|\| "gpt-5-mini"}`; `agent.stream([...messages, msg])` | `package.json`, `src/actors.ts` | Confirmed. Added created/pushed dates and MIT license. |
| 15 | No Mastra adapter for Agent Relay | `gh search code mastra --owner AgentWorkforce`; repo search | Confirmed (only the relayfile spec). Added that Relay does expose some MCP (`agent-relay mcp --sessions-only`); general message-send MCP for third-party clients is unverified. |
| 16 | Voice README uses `@mastra/node-audio` and `gpt-4o-mini-realtime` | README in `voice/openai-realtime-api` | Confirmed strings exist. Model currency is still unverified (see §8). |
| 17 | Mastra prize = 3/2/1 months Mastra Platform for 1st/2nd/3rd overall; no Mastra track | EVENT_PAGE.md Prizes section | Confirmed. The prize text is around lines 73–83 of the current file rather than exactly 76–80, but the content matches. |

Not re-checked this pass: the Aug/Sep throughput rows, the 300-issue time-to-close sample, bot committer counts, the 40 `template-*` repos, and third-party repo stars in §7 other than Terse's. They are plausible and consistent with the checked numbers but were not independently reproduced.
