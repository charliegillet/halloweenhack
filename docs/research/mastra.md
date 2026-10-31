# Mastra: master brief for Haunted Hacks (Sat Oct 31, 2026)

**Compiled:** 2026-10-29 (PT) by the consolidating editor from the five sub-files in [`mastra/`](mastra/), each of which was adversarially fact-checked the same day. Five contradictions between sub-files were re-checked live (npm, `gh`, the `@mastra/mcp` CHANGELOG); see §7.
**Tags:** **[V]** = verified against a primary source (cited). **[I]** = inference. **[3P]** = third-party report that was not confirmed on a Mastra-owned page. Items before Aug 1, 2026 are labelled *background*.

| Sub-file | Angle | Use it for |
|---|---|---|
| [mastra/01-docs-api.md](mastra/01-docs-api.md) | Docs, API surface, CLI, platform limits, pricing | Copy-paste snippets, CLI flags, deploy behaviour |
| [mastra/02-newest-features.md](mastra/02-newest-features.md) | Aug–Oct 2026 launches, GA/beta status | Dated timeline, status matrix, breaking-change notes |
| [mastra/03-github-code.md](mastra/03-github-code.md) | Repo activity, releases, open issues, examples | Sharp edges by issue number, starter internals |
| [mastra/04-social-pulse.md](mastra/04-social-pulse.md) | X, HN, Reddit, PH, LinkedIn, blogs | Sentiment, quotes, security history |
| [mastra/05-team-strategy.md](mastra/05-team-strategy.md) | Founders, funding, strategy, competitors | What Mastra-affiliated judges value, DEV double-dip |

---

## 1. Executive summary

- **What it is.** Mastra (YC W25, Kepler Software, Inc.) is the default TypeScript agent framework. It covers agents, tools, workflows, memory, evals, tracing and a local Studio UI on `:4111`. The licence is Apache-2.0 everywhere except `ee/` directories, which is why GitHub reports `NOASSERTION`. A paid "Mastra Platform" adds hosted Server, Studio, Observability and a Memory Gateway. [V] [01, 03]
- **Its role at this event.** Mastra is a **sponsor, not a host, and has no track of its own**. Its prize is **3, 2 and 1 months of "Mastra Platform"** for 1st, 2nd and 3rd overall, and the page does not say which tier. Attendees get **no per-person Mastra credit**. The judging criteria name only Durable Actors and Agent Relay. [V, EVENT_PAGE.md]
- **Scale and velocity.** The repo has 29,202 stars and 3,061 forks. `@mastra/core` gets about 3.04M npm downloads a week, and monthly downloads grew from 5.38M in July to 7.69M for Oct 1–28. There were **27 stable core releases between Aug 5 and Oct 28**: 25 minor versions (1.56 through 1.80) plus two patches. Most of them carry a "Breaking Changes" section. `1.81.0-alpha.0` and `alpha.1` were published on Oct 29, so a new stable could land before Saturday. [V, re-checked by editor]
- **Strategic arc in the window.** Mastra has moved from framework to platform to harness to software factory to enterprise services. The flagships in the window were **Agent Controller GA (Oct 6)**, **Signals and Goals GA (Oct 5)** [3P], **Harness Channels (Sep 1, multiplayer)**, **Mastra Connect public beta (Oct 7)**, an **observability series (Oct 12–28)** and **MCP Events (Oct 23, experimental)**, which is their newest real-time primitive. [V, 02, 05]
- **The winning posture.** Use Mastra as the **brain**, a Terse Durable Actor as the **state**, and Agent Relay as the **wire**. Terse has already published this exact Mastra-in-an-actor pattern (`TerseAI/durable-actors-mastra-example`, created Oct 14). Nobody ships an Agent Relay adapter for Mastra, so you bridge with Mastra `createTool` wrappers around the Relay SDK or with `agent-relay mcp` through `MCPClient`. [V, 03, 05]
- **Biggest risks.** API churn (pin versions). The beta, bug-dense Mastra durable agents (let Terse own durability). The Oct 21 Railway breach and builds outage on Mastra Platform (demo locally first). The `@mastra/mcp` 2.x migration. External PRs have been disabled since Oct 15, so expect no same-day upstream fixes. [V]

> ### What matters for Haunted Hacks (read this if nothing else)
> 1. **Mastra only pays off through overall placement** (Platform months), and only Durable Actors and Agent Relay are judged. Pitch the actor and relay architecture, and show Mastra visibly: named agents, tools, and Studio traces on a second screen.
> 2. **Pin `@mastra/core@1.80.0`, `mastra@1.36.0` and `@mastra/mcp@2.6.0`, and use Node >= 22.13** (>= 22.18 runs `.ts` directly). The scaffold uses `"latest"` everywhere. Commit the lockfile at 11:05am.
> 3. **Model spend goes on the $100 OpenAI credit through `OPENAI_API_KEY`** with `openai/<model>` strings. Do not use the `mastra/` gateway prefix, which bills Mastra credits at market rate + 5.5%.
> 4. **State lives in the actor, not in Mastra Memory.** Running both creates two sources of truth and adds 13 to 30 DB round trips per turn (#27319, #21881).
> 5. **Agent Relay bridge:** `MCPClient` stdio `{command:'npx', args:['agent-relay','mcp'], env:{RELAY_WORKSPACE_KEY}}`. Live check: `@mastra/mcp` 2.x clients **fall back to the legacy handshake**, so Relay's MCP-SDK-1.x server should connect. This is still untested end-to-end, so the safer path is wrapping the Relay TS SDK in `createTool`.
> 6. **Demo beat Mastra's CEO will recognise:** kill the worker mid-task and have a fresh Mastra loop resume from the actor's record. Sam Bhagwat's own words are "a relay of processes passing a record between them".
> 7. **Rules:** all code must be written at the event. Pre-event spikes are throwaway learning only. Run `npm create mastra@latest` fresh at 11:00.

---

## 2. Key facts

### 2a. Versions and runtime (npm, 2026-10-29) [V]

| Package | Version | Weekly downloads | Notes |
|---|---|---|---|
| `@mastra/core` | **1.80.0** (npm Oct 28 13:39Z) | 3,044,665 | Node `>=22.13.0`; peer `zod ^3.25 \|\| ^4`; bundles A2A SDK 0.3 and 1.0; `1.81.0-alpha.0/.1` published Oct 29 |
| `mastra` (CLI) / `create-mastra` | 1.36.0 | 1,225,436 / 3,707 | Span Queries CLI needs 1.36.0 |
| `@mastra/mcp` | 2.6.0 | 1,094,990 | Rebuilt on MCP 2026-07-28 since 2.0.0 (Sep 22); MCP Events needs >= 2.5.0 |
| `@mastra/memory` | 1.39.1 | ~1.63M | |
| `@mastra/client-js` | 1.57.0 | | `subscribeToThread`, `processDataStream` |
| `@mastra/voice-openai-realtime` | 0.14.8 (Oct 28) | 50,198 | Still pre-1.0; server-side WebSocket |
| `@mastra/connect` | 1.2.0 | | Public beta |
| `@mastra/factory` | 0.25.0 | | Beta |

### 2b. Company [V, 05]

| Item | Value |
|---|---|
| Founders | Sam Bhagwat (CEO, `@calcsam`, co-founded Gatsby), Abhi Aiyer (CTO, ex-Netlify principal engineer), Shane Thomas (CPO, ex-Gatsby head of product) |
| Team | 45, per the about page. The YC page's "30" is stale |
| Funding | $13M seed (announced Oct 8, 2025, *background*) plus a **$22M Series A led by Spark Capital** (Apr 9, 2026, *background*), **$35M total** |
| Origin story | Born after a hackathon. Both funding posts tell that story [I: likely sympathetic to hackathon builders] |
| Support channel | Discord. GitHub Discussions are disabled. **External PRs have been disabled since Oct 15** (CONTRIBUTING.md) |

### 2c. Pricing (mastra.ai/pricing, 2026-10-29) [V, 01, 05]

| Meter | Starter $0 | Teams $250/mo |
|---|---|---|
| Observability events | 100K, then $10/100K | 1M, then $8/100K |
| CPU time | 24 h, then $0.35/h | 250 h, then $0.25/h |
| Egress | 10 GB, then $0.10/GB | 100 GB, then $0.10/GB (the Jul 17 blog says $0.08) |
| Persistent Server (24/7) | $100/project | $100/project |
| Gateway tokens | Market rate + 5.5% | Market rate + 5.5% |
| Retention | 15 days | 6 months; also SSO and SOC 2 docs |

Prize maths [I]: if the prize means Teams, it is worth $750, $500 and $250 at face value. Starter is already free, so the prize only matters if it is Teams or a credit equivalent. **Ask the Mastra rep on site.**

### 2d. Platform behaviour that bites (documented, not tested) [V, 01]

- A server **sleeps after about 10 minutes with no outbound packets**. Open WebSockets and SSE keep it awake. Warm it before your slot.
- Builds over **15 minutes fail**. Only one build runs at a time and the newest queued deploy wins. **Deploys interrupt streaming turns**, so don't redeploy during judging.
- Preflight **hard-blocks** a `file:./mastra.db` store unless it is env-guarded (`process.env.TURSO_DATABASE_URL ?? 'file:...'`).
- The deploy step merges one local `.env*` file into stored vars and file values win. An empty value does not clear a stored var.
- Studio sits behind platform login, but **API routes are public unless you set `server.auth`** (`SimpleAuth`).
- Regions: `us` maps to `pdx` (default; `iad` and `sfo` also available) and `eu` maps to `ams`. The region is fixed when the environment is created.

---

## 3. Newest features (Aug–Oct 2026), with status

Full table in [02](mastra/02-newest-features.md). Dates are post dates or GitHub release dates; npm publishes usually land 0.5 to 1 day earlier.

| Date | Feature | Status | Real-time / actor relevance |
|---|---|---|---|
| Aug 3 | Managed sandboxes and filesystems on Platform | Shipped | Low |
| Aug 12 | Dynamic Workflows (JSON workflows on a live server) | **Beta** | Low |
| Aug 13 / 17 | Built-in tools; `createCodingAgent` | Shipped | Software-factory angle |
| Aug 19 | core 1.60: durable execution for the Agents API, live-tail PubSub | Shipped | Resumable streams |
| Sep 1 | **Harness Channels**: multiplayer sessions from Slack, iMessage, WhatsApp and Discord | Shipped | Multiplayer |
| Sep 8 | **Mastra Factory beta** (writes 25–35% of Mastra's PRs, by Mastra's own claim); #1 Product of the Day on PH (Sep 9) | Beta | Matches the event's "Software Factory" phrase |
| Sep 23 | `@mastra/mcp@2.0.0` (MCP 2026-07-28) | Shipped | See §7, C3 |
| Sep 24 | Classifiers primitive (core 1.69) | Shipped | Low |
| Oct 5 | **Signals and Goals GA** | GA [3P, Seismo]; the docs carry no Beta banner [V] | **High** |
| **Oct 6** | **Agent Controller GA** (renamed from Harness, PR #18510): per-user sessions, live pub/sub state, `steer()`. Memory use down from 2–20 GB to 300–750 MB | GA | **High** |
| Oct 7 | **Mastra Connect**: "23 providers" (the post itemises 22), ~900 tools | **Public beta, free on platform** | Medium |
| Oct 12–15 | Observability week: Thread View, Metrics API, Trace Imports, Trace Queries | Shipped | Demo screen |
| Oct 16 | core 1.78: Agent Scopes, **typed `queueSignal()`** | Shipped | Inject events into a running agent |
| Oct 20 | Mastra Launch (FDE program with a 90-day guarantee) | Commercial | None |
| **Oct 21** | core 1.79: **BREAKING** sessions keyed by `sessionId`; experimental MCP Events plumbing | Shipped | Use current docs |
| Oct 21–22 | **Platform incident**: Railway builds outage (~02:11 to ~20:59 PT), then a Railway security breach; env vars "may have been accessed". The open-source framework was unaffected | Incident | Local-first demo |
| **Oct 23** | **MCP Events**: `defineEvent()`/`.emit()`, `subscribe(..., {delivery:'push'\|'poll'\|'webhook'})`, `MCPEventsSignalProvider` | **Experimental** (draft SEP-3415) | Freshest real-time primitive |
| Oct 26 | Mastra Knowledge | Early access, design partners only | Not usable |
| **Oct 28** | Span Queries; core **1.80**: `agent.abortRun(runId)`, `withRunStatus` subscriptions, **disconnecting observers no longer abort durable or evented runs by default** | Shipped | "Close the tab and the agent keeps going" |

**Status cheat-sheet for Saturday:** safe to use are Agent, Tools, Workflows, Signals, Goals and Agent Controller (current API only). **Beta, so avoid as your foundation:** Durable Agents, Dynamic Workflows and Connect. Use **experimental** MCP Events only if one teammate owns it and you have a fallback. **Unavailable:** Knowledge and Trace Intelligence.

---

## 4. Social sentiment (Aug–Oct 2026) [04]

- **Volume comes from usage, not conversation.** Organic discussion that is specifically about Mastra is thin. Of the 11 HN stories that matched "mastra" since May (max 5 points), only 5 have Mastra in the title, and 4 of those are about the June npm compromise. HN résumé lists now pair "Mastra" with "LangChain". [V]
- **Praise** keeps landing on the same things: it is the TypeScript default ("ended up picking mastra… more complete for people making agents in typescript", dzonga, HN, Sep 23); one package covers agents, workflows, memory and Studio; the observability launches; and fast-moving maintainers. The strongest X reaction was @crtwithintent on Trace Queries: "ok wow im nuking my whole agent stack mastra it is". [V]
- **Complaints:** (1) release velocity and breaking changes; (2) security trust, from the June 16–17 compromise of 116 to 145 `@mastra/*` packages (*background*; Microsoft attributes it to Sapphire Sleet) and the **GHSA-8982-g8xm-3x5h** prototype-pollution advisory (Oct 12), which affects `@mastra/server` 1.62.0 to 1.76.0-alpha.6 and `@mastra/deployer` <= 1.75.0; (3) pricing jumps from free to $250 with nothing in between; (4) ambiguity about whether Factory can really be self-hosted; (5) the **external-PR shutdown** ("kind of sad tho", @0xKoller; "detailed repros were the real contribution anyway", @Kelvin_json). [V]
- **Comparisons:** vs LangGraph.js, Mastra wins on DX and LangGraph on expressive power (Developers Digest, Jun 10, *background*). Beginners are told to start with the Vercel AI SDK, which Mastra builds on. Newer frameworks (Flue, Strands, Google AX) get asked "how is this different from Mastra?" [V]
- **Validation from other vendors:** Sentry's JS agent tracing names Mastra as first-party (changelog Oct 9, tweet Oct 28). [V]
- **Hackathon signal:** winning entries at Mastra-sponsored hackathons share a pattern of **multi-agent debate or validation plus MCP tools plus memory** (HiDevs "Helm", Kavach's "4-agent adversarial debate"). **No social posts pair Mastra with Terse or Agent Relay**, so the combination is novel and has no copy-paste examples. [V, limited negative search]

---

## 5. Gotchas (deduplicated, ranked by expected hack-time cost)

1. **Version churn.** Pin exact versions and don't upgrade if 1.81 drops mid-hack. LLM coding assistants emit stale APIs, so install `npx skills add mastra-ai/skills` (or `@mastra/mcp-docs-server`). [V]
2. **Post-1.79 session API.** `createSession({ resourceId })` still works because `id` defaults to `resourceId`. The `scope` option is gone, `getSessionByResource` became `getSession(sessionId)`, `deleteSession` now takes `{ sessionId }`, and the client-js `controller.session()`/`session.create()` signatures changed. For one session per room, use `createSession({ id: roomId, resourceId })`. [V, r79]
3. **Connect renames.** Core **1.75** renamed `integrations` to `providers` and re-keyed the Slack channel to `slack-channels` (`slack` is still accepted as an alias; Slack *tools* stay `slack`). Core **1.80** changed `connectUrl` to `launchUrl`. [V]
4. **Tools must use `createTool`.** The docs warn that plain-object tools "silently fail to execute". Pass tools to the Agent with matching IDs, call `.commit()` on workflows, keep the project ESM-only (`"type":"module"`), and use zod 4 throughout. [V]
5. **Model strings use `/`, not `:`** (`openai/<model>`). Use a fallback array `model: [{model, maxRetries}, …]` for demo insurance. [V]
6. **Bundler fragility.** Keep a single package, not a pnpm workspace (#25029, #27143). `mastra build` needs about 13× more memory since deployer 1.79 (#28645, open). Delete `.mastra/` when dev acts strangely (#25404). [V]
7. **Streaming quirk.** When a step makes parallel tool calls, all results stream only after the slowest one finishes (#21902, open). Emit progress from inside each tool's `execute` through the actor broadcast. [V]
8. **Latency.** Memory and Observational Memory add DB round trips (#27319, #24628). `TokenLimiter` drops tool results and the agent loops (#24110, open, p: urgent). Skip all three in the live demo. [V]
9. **Mastra durable agents.** They are beta, need Redis for cross-process replay, replay LLM and tool calls on recovery, and had 10+ issues filed Oct 24–29 (#28879, #28641, #28421). Let Terse own durability. [V]
10. **Signals edge cases on the new 1.78–1.80 features:** #28843 (a swallowed send after an aborted run) and #28535/#28536 (signals dropped on process exit). A paused run blocks new runs on its thread. Leases default to a 15 s TTL renewed every 5 s, and delivery is at-least-once, so keep side effects idempotent. The default `EventEmitterPubSub` is process-local. [V]
11. **Voice.** A static `OpenAIRealtimeVoice` is shared across sessions, so for concurrent callers use the resolver `voice: ({requestContext}) => new OpenAIRealtimeVoice()` with `agent.getVoice()`. Under a resolver, `agent.voice` throws and tools are not auto-attached. Always return a value from voice tools (#26505). Wrap `connect()` in a timeout (#22971 hung on a bad key). Browser audio plumbing is on you. [V]
12. **Goals cost.** The default is `maxRuns: 50`, with an LLM judge on every iteration. Set 5–10 and use a cheap judge model. [V]
13. **Don't deploy to Cloudflare Workers**: #14503 has been open since Mar 19 and is p: urgent (AJV `new Function()`). [V]
14. **Platform.** Env-guard `file:` DBs, set `server.auth`, warm the server before your slot, don't redeploy during judging, and keep high-value secrets out of Platform env vars after the Railway breach. [V/I]
15. **Security floor.** A fresh install pulls core 1.80.0. Make sure `@mastra/server` is >= 1.76.0 stable and `@mastra/deployer` is current (GHSA-8982). [V]
16. **Telemetry.** Studio reportedly loads PostHog unless `MASTRA_TELEMETRY_DISABLED` is set [R, ReviewRamble only].

---

## 6. Integration recipes

### R1. Mastra brain inside a Terse Durable Actor (host-published pattern) [V, 01 §5, 03 §7]
`TerseAI/durable-actors-mastra-example` (MIT, created Oct 14, last pushed Oct 18) runs on Bun >= 1.4.2 with Elysia 1.4.30, `durable-actors` 0.8.0 and **`@mastra/core` 1.76.0, four minors behind 1.80**. It creates one `Actor` per conversation with `@Persisted messages`. An `@Interleave async prompt()` calls `agent.stream([...history, msg])` and `broadcast`s each `textStream` delta to every WebSocket. A `meteorHitsDatacenter()` method calls `process.exit(1)` to demonstrate recovery. The agent is a plain `new Agent({ model: \`openai/${OPENAI_MODEL||'gpt-5-mini'}\` })` with no Mastra memory or storage and no `mastra dev`. **Read it, don't copy it.** Decide on Friday whether to match its 1.76.0 or move to 1.80, and pick one runtime. If you want Studio, run `mastra dev` separately for debugging.

### R2. Agent Relay as the wire
- **Option A (safer): SDK in tools.** Wrap `@agent-relay/sdk` 14.0.0 `sendMessage` and inbox reads in `createTool`. Relay messages reach the agent when it calls a tool, so drive it with a "check inbox" tool, or inject them into a Mastra thread with `sendSignal()`/`queueSignal()` [I]. Relay's AI SDK adapter is poll-only and delivers at tool-call boundaries (Relay docs, via 05).
- **Option B: Relay MCP through `MCPClient`.**
  ```ts
  import { MCPClient } from '@mastra/mcp'
  const mcp = new MCPClient({ id: 'relay', servers: { relay: {
    command: 'npx', args: ['agent-relay', 'mcp'],
    env: { RELAY_WORKSPACE_KEY: process.env.RELAY_WORKSPACE_KEY! } } } })  // rk_live_*
  const tools = await mcp.listTools()  // register_agent, post_message, send_dm, check_inbox, ...
  ```
  `agent-relay mcp` is a stdio server with no subcommands. Create the workspace beforehand with `agent-relay workspace create <name>`. [V, Relay docs] Compatibility, editor's live check: `agent-relay@14.0.0` depends on `@modelcontextprotocol/sdk ^1.23.0` (the legacy handshake), and `@mastra/mcp@2.6.0` uses `@modelcontextprotocol/client 2.4.0`. Per the `@mastra/mcp` 2.0.0 changelog, "`MCPClient` probes each server with `server/discover` and falls back to the legacy handshake unless `protocolVersion` pins `'2026-07-28'` or `'legacy'`", and legacy connections keep tools but lose "subscriptions, list-changed handlers or input requests". **It should work, but nobody has tested it end-to-end.** Don't pin `protocolVersion: '2026-07-28'`.
- **Option C: A2A.** Every agent served by Mastra Server exposes `/api/.well-known/<id>/agent-card.json` and `/api/a2a/<id>`, with v0.3 or v1.0 selected by the `A2A-Version` header. `A2AAgent` defaults to v0.3. This is a fallback, not Relay itself. [V]

### R3. Multiplayer steerable session (Mastra's GA flagship) [V, 01 §4c, 02]
```ts
const thread = { resourceId: 'room_13', threadId: 'seance_1' }
const sub = await agent.subscribeToThread(thread)          // subscribe FIRST
await agent.sendMessage('Who is there?', thread).accepted   // others can sendMessage/steer mid-run
for await (const chunk of sub.stream) { /* text, tool calls, approvals, goal chunks */ }
```
On the client, call `client.getAgent(id).subscribeToThread({..., withRunStatus: true})` and then `processDataStream({ onChunk, reconnect: true })`. Add a Goal (e.g. "escape the haunted house") with a low `maxRuns`. [I] If the actor already owns state, use this only for the steering UX, and keep the actor as the source of truth.

### R4. Realtime voice séance (literal "Real-Time AI") [V, 01 §4e]
`new Agent({..., tools, voice: ({requestContext}) => new OpenAIRealtimeVoice() })`, then `const v = await agent.getVoice({requestContext}); await v.connect(); v.on('speaker', …); v.on('writing', …)`. Broadcast `writing` transcripts through the actor. Tools mutate actor state (lights, sounds). The model ID is unresolved (see §7). Stick to a Node-side audio loop unless someone has done browser audio before. `@mastra/livekit` is the robust but heavier path.

### R5. Stretch goals (only after a working baseline at 2:00pm)
- A custom `PubSub` backed by Relay or actors: extend `PubSub` from `@mastra/core/events` and implement `publish`, `subscribe`, `unsubscribe` and `flush`. It is novel, but the lease and redelivery semantics must hold. [V/I, 01 §6]
- MCP Events push into threads via `MCPEventsSignalProvider`, for example a Supabase-row or webhook "wake-up". This needs a 2026-07-28 connection, so it won't run over the legacy Relay link. [V/I]

### R6. Lock down and observe
`server: { auth: new SimpleAuth({ tokens: { [DEMO_TOKEN]: { id: 'judge' } } }) }`. For traces, the scaffold's `MastraPlatformExporter` only sends to Platform if `MASTRA_CLOUD_ACCESS_TOKEN` is set. Otherwise use local Studio. [V]

---

## 7. Contradictions between sub-files: resolved or flagged

| # | Conflict | Resolution |
|---|---|---|
| C1 | Release count: "27 stable releases Aug 5–Oct 28" (01) vs "25 minor releases" (02) vs "24 bumps" (03) | **Resolved live (npm `time`):** 27 stable versions = 25 minors (1.56.0–1.80.0) + 2 patches (1.63.1, 1.63.2). That is 24 minor *bumps*. Aug 5 is the npm date and Aug 6 the GitHub release date. |
| C2 | Release dates differ by about a day (e.g. 1.78 on Oct 15 vs Oct 16; 1.76 on Oct 11 vs Oct 13) | **Resolved:** npm publishes precede GitHub `publishedAt` by 0.5–1 day, and 05 used release names. All are correct for their source. |
| C3 | `@mastra/mcp` 2.x "only accepts 2026-07-28 clients / SSE removed" (02, unverified) vs "legacy handshake removed" (03) vs the 05/01 advice to use `agent-relay mcp` via `MCPClient` | **Resolved live (changelog):** the *server* side of 2.0.0 serves 2026-07-28 only, with no standalone HTTP+SSE transport (2.6.0 added an opt-in `legacy` option for HTTP servers). The *client* side probes and **falls back to legacy**. So `MCPClient` should reach Relay's MCP-SDK-1.x stdio server, but only with tools, not subscriptions. The 03 warning applies to *exposing* a Mastra MCPServer to old clients. |
| C4 | October merged PRs: 1,858 (03) vs 1,760 (04); issues 806 vs 810 | **Resolved live:** different windows. Oct 1–28 gives 1,760 PRs and 768 issues, and Oct 1–29 gives 1,858 and 806 (`gh search`). 04's issue figure of 810 is drift. |
| C5 | Open issues 640 vs 647 | Drift. It read 647 at the editor's check, and the count includes PRs. |
| C6 | Use Mastra Memory scoped by actor ID (04) vs skip Memory and let the actor own state (01, 03) | **Editor's call:** skip Mastra Memory for the actor-owned conversation (avoids double state and latency bugs). Use Memory or storage only if you rely on Signals, Goals or threads, which need storage. |
| C7 | Deploy to Mastra Platform in the first 30 minutes (01) / "most on-message" (02) vs optional after the breach (05) | **Editor's call:** a local `mastra dev` plus actor demo is the primary path. A Platform deploy is a bonus after 2:00pm, dry-run on Friday with a throwaway project. |
| C8 | A2A "v0.3.0" (02) vs "v0.3 + v1.0" (01, 03) | **Resolved:** both are supported, selected by header, and `A2AAgent` defaults to v0.3. |
| C9 | Realtime model: docs example `gpt-5.1-realtime` (01) vs README `gpt-4o-mini-realtime` (03) | **Flagged:** neither has been checked against the hackathon OpenAI org. List models on Oct 30. |
| C10 | Teams egress $0.08/GB (Jul 17 blog) vs $0.10/GB (pricing page); retention 15 days (pricing) vs 30 days (trace docs) | **Flagged:** treat the pricing page as authoritative. Retention may refer to different data classes. Irrelevant at hackathon scale. |
| C11 | Connect "23 providers" vs 22 itemised | **Flagged:** the blog's own list has 22 names (Telegram is channels-only). |
| C12 | Sam's essay quote: "relay of short-lived processes…" (an earlier draft) | **Fixed in 05:** the text is "a relay of processes passing a record between them". The subtitle says "short-lived processes take turns with" a durable record. |

---

## 8. Limits / could not verify

- **Prize-value precedent added 2026-10-30 ([sponsor-coverage-audit §2.3](reference/sponsor-coverage-audit.md)):** at Build Personal Agents Hack (SF, 4 Oct 2026) Mastra gave $25 credits per attendee and $5k/$3k/$1k credits to the top three. The platform bills everything from one credit pool. The Haunted Hacks prize is still worded as months; Teams months would be worth $750/$500/$250.

- **The prize tier** behind "N months of Mastra Platform", and whether Connect and sandboxes are included. Not stated anywhere.
- **Whether Mastra staff will judge or mentor** ("Judges will be announced soon").
- **The Signals and Goals GA date** rests on Seismo plus the missing Beta banner. There is no Mastra "GA" post.
- **`agent-relay mcp` through `MCPClient` end-to-end** is untested (the protocol fallback is documented, not exercised). Whether a Mastra Agent accepts a Relay `onRelay`-wrapped AI SDK model is also untested.
- **CPU-hour metering** (wall-clock while awake vs actual CPU) is not explicit.
- **The OpenAI model IDs** in Mastra's docs (`openai/gpt-6.1-sol`, `gpt-6-luna`, `gpt-5.1-realtime`) have not been checked against the event's credit org.
- **Single-pass social items** that were not re-checked: the Reddit snapshots, several LinkedIn posts, YouTube views, StackPulse flags and the aggregator sentiment scores. Treat the PostHog-telemetry claim as [R].
- **The Product Hunt vote count** for Factory varies by source (303 to 528 votes; 539 is PH's *score*).
- **The DEV Hacktoberfest double-dip:** no YC exclusivity terms were found either way.
- No code was run and nothing was deployed. Platform behaviour comes from documentation.

---

## 9. Hackathon implications

**What to build** [I, synthesised from all five]:
1. **"Séance Council" (recommended).** One Terse actor per haunted room holds the record, the sockets and the fan-out. Three or four Mastra agents (ghost, medium, skeptic, exorcist) each use `createTool` tools that call actor RPCs. They argue in real time over **Agent Relay** channels, which follows the multi-agent-debate pattern that wins at Mastra hackathons. Humans steer mid-run. Live beat: kill the worker process and a fresh Mastra loop resumes from the actor's record ("a relay of processes"). This hits Durable Actors, Agent Relay, and Mastra's CEO's own framing.
2. **Voice twist.** Make the medium an `OpenAIRealtimeVoice` agent (using the resolver pattern) whose tools flicker lights in the actor state. This is "Real-Time AI" made literal and spends the OpenAI credit as intended.
3. **Software-factory garnish (optional).** A small `createCodingAgent` plus Goal loop that "exorcises" bugs. Don't stand up Mastra Factory itself.

**What to show judges (a 60-second Mastra moment):** a Studio trace of the multi-agent run on a second screen, a mid-run steer landing, a Goal flipping to done, and the GA names spoken aloud: "Agent Controller, Signals, Goals". Pitch line: *Mastra is the brain, Terse is the state, Relay is the wire.*

**Before Oct 31 (setup and ideas only):**
- Install Node >= 22.18 (and Bun >= 1.4.2 if following the Terse stack). `npm i -g mastra@1.36.0`.
- Warm the npm cache with a throwaway `npm create mastra@latest scratch -- --llm openai`, then delete it.
- `npx skills add mastra-ai/skills` for your coding agent. Bookmark `mastra.ai/llms.txt`.
- Read (don't copy) `TerseAI/durable-actors-mastra-example`.
- Create the Relay workspace (`agent-relay workspace create`) and stash `RELAY_WORKSPACE_KEY`. On Friday, run a 5-minute throwaway test that `MCPClient` lists Relay's tools.
- List the realtime and chat model IDs available on the event's OpenAI org.
- Create a free Starter Platform account (`mastra auth login`, `mastra auth whoami`) so the prize is redeemable, and optionally dry-run `mastra deploy` on hello-world.
- Pre-plan (don't pre-write) the actor/tool boundaries.

**On the day:** pin versions at 11:05. Have a working baseline with no voice and no MCP Events by 2:00pm. No upgrades, and no redeploys after 3:30pm. Warm any deployed server before your demo slot.

**Optional double-dip:** DEV Hacktoberfest Week 4 "Best Use of Mastra" closes at 11:59pm PDT on Oct 31. It is Halloween-themed, pays $100, allows one prize per person, requires a write-up (weighted most heavily), and wants open-weight models ("over open models"). Run at least one agent on an open-weight model if you enter. [V, 05]

---

## Sources

**Event and sub-files:** `../EVENT_PAGE.md` (https://events.ycombinator.com/haunted-hacks-2026); [mastra/01-docs-api.md](mastra/01-docs-api.md); [mastra/02-newest-features.md](mastra/02-newest-features.md); [mastra/03-github-code.md](mastra/03-github-code.md); [mastra/04-social-pulse.md](mastra/04-social-pulse.md); [mastra/05-team-strategy.md](mastra/05-team-strategy.md); sibling `agent-relay/01-docs-api.md`, `agent-relay/03-github-code.md`, `terse/03-github-code.md`.

**Mastra docs (key pages; the full per-page list is in 01 and 02):** https://mastra.ai/llms.txt · https://mastra.ai/docs/mastra-platform/overview (and /server, /studio, /deploy, /database, /regions, /connect/overview under it) · https://mastra.ai/docs/harness/goals · https://mastra.ai/docs/harness/durable-agents · https://mastra.ai/docs/signals/overview · https://mastra.ai/docs/signals/thread-streams · https://mastra.ai/docs/signals/running-across-processes · https://mastra.ai/docs/connections/mcp · https://mastra.ai/docs/mcp/overview · https://mastra.ai/docs/connections/a2a · https://mastra.ai/docs/auth/simple-auth · https://mastra.ai/docs/server/pubsub · https://mastra.ai/reference/voice/speech-to-speech · https://mastra.ai/models · https://mastra.ai/reference/cli/mastra · https://mastra.ai/pricing · https://mastra.ai/about · https://mastra.ai/sitemaps/blog.xml

**Mastra blog:** https://mastra.ai/blog/introducing-managed-sandboxes-and-filesystems-for-mastra-platform · /introducing-ephemeral-sandbox-deploys · /introducing-imessage-support · /introducing-dynamic-workflows · /introducing-built-in-tools · /introducing-create-coding-agent-helper · /introducing-mastra-helm-chart · /introducing-harness-channels · /introducing-sandbox-computer-use · /announcing-mastra-factory · /announcing-mastra-factory-beta · /introducing-memory-hooks · /announcing-agent-controller-ga · /announcing-agent-harness · /introducing-mastra-connect · /mastra-agency-program · /fine-grained-context · /announcing-mastra-launch · /introducing-mcp-2 · /platform-incident-october-21-2026 · /introducing-mcp-events · /announcing-mastra-knowledge · /introducing-span-queries · /mastra-platform-pricing · /announcing-mastra-platform · /announcing-mastra-observability · /what-are-durable-ai-agents · /software-factory · /seed-round · /series-a · /mastrav1 · /best-ai-agent-frameworks (all under https://mastra.ai/blog/)

**GitHub and npm:** https://github.com/mastra-ai/mastra (LICENSE.md, CONTRIBUTING.md, releases `@mastra/core@1.56.0`–`1.80.0`, `packages/mcp/CHANGELOG.md`, examples/durable-agents, examples/voice-agent, voice/openai-realtime-api, templates/weather-agent, stores/cloudflare, deployers/) · https://github.com/mastra-ai/mastra/security/advisories/GHSA-8982-g8xm-3x5h · issues #14503, #18061, #21881, #21902, #22971, #24110, #24628, #25029, #25404, #26505, #26897, #27143, #27319, #28421, #28535, #28536, #28641, #28645, #28843, #28879 (https://github.com/mastra-ai/mastra/issues/N) · PR https://github.com/mastra-ai/mastra/pull/18510 · https://github.com/mastra-ai/skills · https://github.com/TerseAI/durable-actors-mastra-example · https://github.com/AgentWorkforce/relay · https://www.npmjs.com/package/@mastra/core · https://www.npmjs.com/package/agent-relay · https://api.npmjs.org/downloads/point/last-week/@mastra/core

**Agent Relay:** https://agentrelay.com/docs/agent-relay-mcp · https://agentrelay.com/docs/cli-overview · https://agentrelay.com/docs/communicate

**Social and third-party:** https://seismonews.com/event/mastra-launches-agent-signals-and-agent-goals-in-ga · https://releasebot.io/updates/mastra · https://nitter.rdrama.net/calcsam/status/2110560376173863206 · https://nitter.rdrama.net/calcsam/status/2110759787814375721 · https://x.com/Ga_Vasques/status/2107829799460749521 · https://x.com/sentry/status/2115529505133429141 · https://sentry.io/changelog/javascript-agent-tracing-improvements/ · https://x.com/ethanwalkerman/status/2112534816898138269 · https://news.ycombinator.com/item?id=49822231 · https://news.ycombinator.com/item?id=49618568 · https://www.hunted.space/product/mastra · https://www.producthunt.com/leaderboard/monthly/2026/9 · https://www.producthunt.com/products/mastra · https://nick-tune.me/blog/2026-10-20-automating-spec-to-pr-with-mastra-ai/ · https://www.developersdigest.tech/blog/mastra-whats-new-2026 · https://www.developersdigest.tech/blog/mastra-vs-langgraph-js-2026 · https://www.reviewramble.com/github-repos/mastra · https://indie-machine.com/posts/mastra-factory-agent-sdlc · https://socket.dev/blog/mastra-npm-packages-compromised · https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/ · https://thehackernews.com/2026/06/144-mastra-npm-packages-compromised-via.html · https://www.ycombinator.com/companies/mastra · https://www.linkedin.com/posts/spark-capital-llc_activity-7449498829219020801-j-Cs · https://rauchg.com/2017/2016-in-review · https://rauchg.com/2020/vercel · https://dev.to/challenges/hacktoberfest-week4-2026-10-26 · https://dev.to/page/hacktoberfest-week4-2026-10-26-contest-rules · https://luma.com/builde-oxba · https://www.linkedin.com/posts/mastra-ai_long-running-agents-need-a-reliable-way-to-activity-7519038672202072064-c3fA · https://www.linkedin.com/posts/mastra-ai_last-week-was-observability-week-we-launched-activity-7517963071256965121-PrNH
