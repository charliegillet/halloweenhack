# Mastra: newest features, Aug–Oct 2026 (with GA, beta and announced-only status)

**Captured:** 2026-10-29 (Thu), two days before Haunted Hacks (Sat Oct 31, 2026).
**Angle:** what Mastra shipped and announced between Aug 1 and Oct 29, 2026; how mature each item is; and which features Mastra most likely wants to see at a hackathon. Docs, API shape and social sentiment are covered in the sibling files.
**Method:** I read the Mastra blog index and the blog sitemap (`/sitemaps/blog.xml`, which has per-post lastmod dates). I read about 25 individual posts, the GitHub release notes for `@mastra/core` 1.56.0 through 1.80.0 via `gh release`, the stability banners on the current docs pages (`/docs/*.md`), npm registry versions, and Mastra's weekly "Last week, we launched" LinkedIn posts. Tags: **[V]** means verified from a primary source, **[I]** means my inference, **[3P]** means a third-party report I could not confirm on a Mastra-owned page.

---

## 1. TL;DR

- **Shipping cadence is extreme.** `@mastra/core` went from 1.56.0 (Aug 6) to 1.80.0 (Oct 28): 25 minor releases in 12 weeks, about two a week [V, `gh release list -R mastra-ai/mastra`]. Mastra posts a weekly "Last week, we launched: 1/ … 2/ …" roundup on LinkedIn/X, and Oct 12–16 was billed as "observability week" [V, LinkedIn]. There was no single launch week. Instead they ship themed weeks continuously.
- **The flagship story in the window is long-running, steerable, multiplayer agents.** Agent Controller (formerly "Harness") went **GA on Oct 6**. Signals and Goals were reported GA on Oct 5. Harness Channels (Sep 1) let several people drive one agent session from Slack, iMessage, WhatsApp or Discord. The Fine-Grained Context essay (Oct 8) is explicitly about "multiplayer agents." This lines up almost word for word with the event brief ("long-running agent, multiplayer AI system, Software Factory").
- **The platform story is Mastra Platform plus Connect.** Managed sandboxes and filesystems (Aug 3), **Mastra Connect public beta** (Oct 7, *free on platform during beta*), the observability-week launches, and Span Queries (Oct 28). The hackathon prize is months of Mastra Platform, so a project deployed with `mastra deploy` and visible in platform traces is the most on-message thing to demo [I].
- **The newest real-time primitive is experimental.** MCP Events (Oct 23, needs `@mastra/core@1.79.0`) push server events to agents, workflows and apps. Docs label it a *draft extension (SEP-3415) and experimental*.
- **Mastra Factory beta** (Sep 8) is Mastra's own open-source "software factory." The event page uses the same phrase.
- **Watch out:** 1.79.0 (Oct 21) **broke the Agent Controller session API** (sessions are now keyed by `sessionId`). Plain `createSession({ resourceId })` still works, because `id` defaults to the `resourceId`. What broke: the `scope` option was removed, `getSessionByResource(resourceId, scope)` was replaced by `getSession(sessionId)`, `deleteSession()` now takes `{ sessionId }`, and client-js `controller.session()`/`session.create()` signatures changed [V, r79]. Treat any pre-Oct 21 snippet that uses `scope`, `getSessionByResource` or the old client-js calls as stale. Mastra Platform also had a **severe incident on Oct 21** (an upstream Railway outage plus a Railway security breach) [V].

---

## 2. Dated timeline, Aug 1 – Oct 29, 2026

Dates are post dates as shown on mastra.ai (cross-checked against sitemap lastmod) or GitHub release publish dates. "Req." gives the minimum package version the post itself names.

### August

| Date | Item | Status | Req. / notes | Source |
|---|---|---|---|---|
| Aug 3 | **Managed Sandboxes + Filesystems on Mastra Platform** (`@mastra/platform-workspace`: `PlatformFilesystem`, `PlatformSandbox`). Per-environment bucket and sandbox, warm base image, billed from project CPU/egress | Shipped on platform; on by default for new projects | Existing projects: Workspaces tab → "Enable workspaces" | [blog][b-sbx] |
| Aug 4 | Feedback + feedback analytics (observability) | Shipped | | sitemap |
| Aug 5 | **Ephemeral sandbox deploys**: deploy Server+Studio to E2B / Daytona / Vercel Sandbox, which gives two public URLs | Shipped | `@mastra/core@1.52.0`, `@mastra/deployer-sandbox` | [blog][b-eph] |
| Aug 6 | core 1.56.0: persistable declarative (JSON) workflows | Shipped | | [rel][r56] |
| Aug 10 | Sensitive data redaction; core 1.57.0 adds **transient agent signals** and a faster platform sandbox exec | Shipped | | [rel][r57] |
| Aug 11 | **iMessage channel** (Photon adapter) | Shipped | `@mastra/core@1.56.0`; dedupe keys are in-memory unless you add `createRedisState()` | [blog][b-imsg] |
| Aug 12 | **Dynamic Workflows**: add/update workflows on a live server as JSON via `POST /api/stored/workflows` | **Beta** (docs banner) | `@mastra/core@1.58.0` + a storage adapter | [blog][b-dyn], docs |
| Aug 13 | **Built-in tools**: task list (`TaskSignalProvider`), `webSearchTool`, `webFetchTool`, `askUserTool`, `submitPlanTool`; they render live in Studio | Shipped | | [blog][b-bit] |
| Aug 17 | **`createCodingAgent` helper**: sandbox + task list + error retries + goal judge | Shipped | | [blog][b-cca] |
| Aug 18–19 | AI SDK v7 support; fine-grained authorization | Shipped | | sitemap, LinkedIn Aug 24 |
| Aug 19 | core 1.60.0: **durable execution for Agents API**, Cloudflare Sandbox provider, MCP stateless 2026-07-28 groundwork, sandbox checkpoints | Shipped | | [rel][r60] |
| ~Aug 10–14 | "Realtime voice agents guide (with LiveKit)" | Guide | LiveKit docs warn not to combine `memory` with LiveKit `preemptiveGeneration` | LinkedIn Aug 17, docs |
| Aug 24–28 | Multi-turn evals, Tool Search / Skill Search processors, Helm chart, TokenCostControl, token limiting; core 1.62.0 adds **computer-use sandboxes** (E2B Desktop) | Shipped | | sitemap, [rel][r62] |

### September

| Date | Item | Status | Req. / notes | Source |
|---|---|---|---|---|
| Sep 1 | **Harness Channels**: multiplayer Agent Controller sessions driven from Slack/iMessage/WhatsApp/Discord; Slack `toolDisplay: "cards"` renders approve/deny buttons | Shipped | `@mastra/core@1.54.0`, `@chat-adapter/slack` | [blog][b-hch] |
| Sep 2 | **Sandbox Computer Use**: 11 `computer_*` tools on a Linux desktop (E2B Desktop, Daytona), with `.streamUrl()` to watch live | Shipped | `@mastra/core@1.62.0` | [blog][b-cu] |
| Sep 3 | Sandbox lifecycle controls; **Temporal workflows integration (GA)** | Shipped / GA | | LinkedIn Sep 7 |
| Sep 7–11 | Remote filesystem support, filesystem mounts / search / skills | Shipped | | LinkedIn Sep 14 |
| **Sep 8** | **Mastra Factory beta**: open-source software factory (GitHub/Linear/Slack → boards: Intake→Triage→Planning→Build→Review→Done). Mastra says it writes 25–35% of their PRs and closes 50–60% of their issues. `npm create factory@latest` | **Beta**. LinkedIn says "#1 on Product Hunt last week" | `@mastra/factory` now 0.25.0 (npm) | [blog][b-fac], LinkedIn Sep 14 |
| Sep 14–18 | Platform: server health, error diagnostics CLI, incident alerts, HTTP feedback API | Shipped | | sitemap, LinkedIn Sep 21 |
| Sep 15 | core 1.67.0: **new `@mastra/connect` package**, Studio workflow-builder backend | Pre-release of Connect | | [rel][r67] |
| Sep 21–24 | Experiment targets, lifecycle hooks, tool mocks, Vitest integration | Shipped | | LinkedIn Sep 28 |
| Sep 23 | core 1.68.0: **`@mastra/mcp@2.0.0`** (MCP 2026-07-28 server architecture) | Shipped | | [rel][r68] |
| Sep 24 | core 1.69.0: **Classifiers** as a first-class primitive + `ClassifierProcessor` ("Classifiers with Jev") | Shipped | `@mastra/core@1.69.0` | [rel][r69], docs |
| Sep 29 | **Memory Hooks**: lifecycle and transform hooks on observational memory, plus `skillResultRedactor()` | Shipped | `@mastra/memory@1.31.0` | [blog][b-mh] |
| Sep 30–Oct 1 | Factory Jira/GitLab/incident.io integrations; VPC-isolated Postgres for the platform | Shipped | | LinkedIn Oct 5 |

### October

| Date | Item | Status | Req. / notes | Source |
|---|---|---|---|---|
| Oct 5 | **Agent Signals and Goals GA**. Signals were alpha since June and Goals beta since July | **GA** [3P]. The current docs pages carry no Beta banner [V] | Signals `@mastra/core@1.39.0`; Goals `1.43.0` + storage + memory thread; Goals stop at `maxRuns` 50 by default | [Seismo][seismo], [docs][d-sig], [docs][d-goal] |
| **Oct 6** | **Agent Controller GA**: per-user `Session` (own threads, mode, model, approvals, memory, subagents), live pub/sub state to every subscribed client, `steer()`/follow-up queue, storage-only thread reads. Mastra says memory use in long Mastra Code processes fell from 2–20 GB to 300–750 MB | **GA** | Renamed from `Harness` (PR #18510) | [blog][b-acga] |
| Oct 7 | **Mastra Connect**: 23 providers, ~900 tools, 7 hosted MCP providers; `tools()`, `channels()`, `credential()`; `mastra connect add <provider>` | **Public beta, free on platform during beta** (docs banner). Note: the post's "Full provider list" itemizes 22 names (Telegram is channels-only), not 23 | `@mastra/connect@1.0.0` + `@mastra/core@1.75.0`; needs `MASTRA_PLATFORM_ACCESS_TOKEN` + `MASTRA_PROJECT_ID` | [blog][b-conn], docs |
| Oct 8 | Mastra Agency Program (5 launch partners); essay "Multiplayer agents need fine-grained context" | Program / design concept ("Today FGC is a design concept") | | [blog][b-agency], [blog][b-fgc] |
| Oct 12–15 | **Observability week**: Thread View, Metrics API, Trace Imports, Trace Queries | Shipped | | LinkedIn Oct 19 |
| Oct 16 | core 1.78.0: **Agent Scopes** (multi-tenant identity), typed `queueSignal()`, trace aggregation API | Shipped | | [rel][r78] |
| Oct 19 | Studio-scoped SSO (WorkOS, Okta, Auth0, Clerk, Google) | Shipped | | blog index |
| Oct 20 | **Mastra Launch**: enterprise platform + a forward-deployed engineer; "if your agent isn't in production in 90 days, all you pay is the implementation fee" | Commercial offer | | [blog][b-launch] |
| Oct 21 | **MCP 2.0 support** blog (spec 2026-07-28: no `initialize`, no session IDs, `Mcp-Method`/`Mcp-Name` headers, cache hints, `server/discover`, `requestState` via tool `suspend()`). `@mastra/mcp` 2.x **only accepts 2026-07-28 clients**; SSE transport removed | Shipped (code landed Sep 23) | `@mastra/mcp` ^2.0.0; npm latest 2.6.0 | [blog][b-mcp2], [Releasebot][rb] |
| Oct 21 | core 1.79.0: **BREAKING** Agent Controller sessions keyed by `sessionId`; sandbox native filesystem API; end-user-scoped Connect + Teams channel | Shipped | | [rel][r79] |
| Oct 21–22 | **Platform incident**: builds down (upstream Railway outage), then Railway disclosed a security breach; env vars "may have been accessed," with no evidence of user breach. Mastra is considering moving off Railway | Incident | "does not affect Mastra open-source". Builds were down from ~02:11 PT; Railway acknowledged the breach at 14:59 PT; builds back ~20:59 PT. Mastra did not recommend key rotation while builds were down | [blog][b-inc] |
| Oct 22 | LinkedIn announces a live **Signals workshop** (`sendMessage()`, `queueMessage()`, `queueSignal()`, `sendSignal()`, state/notification signals, "coordinating long-running agents across distributed deployments"). Workshop date not shown in the snippet I read | Event | Good primer for the multiplayer-steering pattern | [LinkedIn][li-sigws] |
| **Oct 23** | **MCP Events**: `defineEvent()` on `MCPServer`, `.emit()`; `mcp.events.subscribe(server, event, args, { delivery: "push" \| "poll" \| "webhook" })`; `MCPEventsSignalProvider` delivers events into an agent thread; events can start workflow runs | **Experimental** ("wire format and the Mastra API are experimental and may change in any release") | `@mastra/mcp@2.5.0` + `@mastra/core@1.79.0` | [blog][b-mcpev], docs |
| **Oct 26** | **Mastra Knowledge**: standalone company-brain service next to Mastra memory; per-function knowledge bases, individual/team/org permissions | **Early access with design partners only** ("eight more design partners") | Not usable at a hackathon | [blog][b-know] |
| **Oct 28** | **Span Queries** (filter/group spans: counts, error rate, p95; CLI `mastra api span aggregate`). core **1.80.0**: end-user (per-resource) OAuth connections, in-chat `request_connection` tool, `agent.abortRun(runId)`, `withRunStatus` thread subscriptions | Shipped (latest) | `mastra@1.36.0` CLI; `@mastra/core@1.80.0` (npm latest, verified 2026-10-29) | [blog][b-span], [rel][r80] |

Background (before Aug, label only): Agent Signals announced Jun 3; Agent Controller (as "Harness") Jun 18; Durable Agents Jun 26 (`createDurableAgent`, `createEventedAgent`); Schedules Jul 8; Goals Jul 15; Platform pricing explainer Jul 17; Factory alpha and Trace Intelligence Jul 27; MASTRA.BUILD Templates virtual hackathon Jul 28–Aug 11.

---

## 3. Status matrix: what is safe to build on Saturday

| Feature | Status (as of Oct 29) | Evidence | Hackathon risk |
|---|---|---|---|
| Agent / Workflows / Memory core | GA (v1.x) | Core of the 1.x line | Low |
| **Agent Controller** (sessions, modes, subagents, `steer`, channels) | **GA Oct 6**, but the API **broke Oct 21** (sessionId) | [b-acga], [r79] | Low–Med: follow the *current* reference only |
| **Signals** (`subscribeToThread`, `sendMessage`, `sendSignal`, state/notification signals) | GA [3P]; no beta banner in docs [V] | [seismo], [d-sig] | Low |
| **Goals** (`setObjective`, judge model, `maxRuns`) | GA [3P]; no beta banner [V] | [seismo], [d-goal] | Low. Watch judge-loop token cost |
| Channels (Slack, Discord, Telegram, WhatsApp, iMessage, Teams, GitHub) | Shipped (since core 1.22.0) | docs | Med: vendor bot setup + public webhook URL |
| Built-in tools, `createCodingAgent`, computer use, sandboxes | Shipped | [b-bit], [b-cca], [b-cu] | Med: third-party sandbox keys (E2B/Daytona) |
| MCP 2.0 (`@mastra/mcp` 2.x) | Shipped | [b-mcp2] | Med: old MCP clients are rejected |
| **Durable Agents** (`createDurableAgent`) | **Beta** (docs banner) + replay warning | docs `/docs/harness/durable-agents` | Med: recovery replays LLM and tool calls, so tools must be idempotent |
| **Dynamic Workflows** | **Beta** | docs | Med |
| **Mastra Connect** | **Public beta**, free on platform | docs, [b-conn] | Med: needs a platform project + token; the API renamed fields in 1.75 and 1.80 |
| Mastra Factory | **Beta** (0.25.0) | [b-fac], npm | High for a 5-hour build; better as inspiration |
| **MCP Events** | **Experimental**, draft SEP-3415 | docs warning | High-ish: API may change, but it is the most "real-time" new feature |
| Trace Intelligence | Private beta | platform docs | Not available |
| Mastra Knowledge | Early access, design partners | [b-know] | Not available. Announced only |
| Mastra Launch, Agency Program | Commercial programs | [b-launch], [b-agency] | Irrelevant to building |

---

## 4. Which new features Mastra most wants showcased [I, with evidence]

Ranked by how hard Mastra is pushing them, judged by authorship (CEO Sam Bhagwat vs. DevRel), the "Announcements" category on the blog, GA timing and fit with the prize.

1. **Agent Controller + Signals + Goals (the "harness").** These are Mastra's GA launches in the window. They sit in the blog's "Announcements" section, and Mastra positions them as one package: "Signals let people and other agents steer a session while it runs. Schedules wake the agent up on a timer. Goals keep it working until the job is done. Channels forward incoming messages to the session" [b-acga]. Mastra's own example of a good use case is "Shared by several people, or several clients, at the same time" [b-acga]. That is the event's "multiplayer AI system."
2. **Mastra Platform deploy + observability.** The prize is 1–3 months of Mastra Platform. The blog's recent "Features" posts (Oct 12–28) are dominated by platform/observability launches (Thread View, Metrics API, Trace Imports, Trace Queries, Span Queries, Studio SSO) [blog index; the exact "seven of eight" count is (unverified) on re-check]. Mastra's Oct 19 LinkedIn roundup confirms "Last week was observability week!" with Thread view, Metrics API, Trace imports, Trace queries [li-obs]. A demo that shows a live trace or Thread View of the multiplayer session in Mastra Studio speaks directly to what they are shipping. Pricing context (background, Jul 17): the free Starter tier includes 100K observability events, 24 CPU hours and 10 GB egress per month; Team is $250/month [b-price]. Whether the prize equals Team-plan months is **[I], not stated**.
3. **Mastra Connect (public beta, free).** It is the newest platform product and the fastest way to give an agent real tools (GitHub, Slack, Linear, Notion, Supabase, OpenAI and 17 more [b-conn]). Using it gives Mastra beta usage they can point to. Supabase is a listed Connect provider, which touches a second sponsor.
4. **Software factory / Mastra Factory.** The event brief says "build your own Software Factory." Mastra has a blog guide ("How to Build an AI Software Factory," Jul 16) and Factory beta (Sep 8). That makes Mastra the sponsor with the most authority on that phrase [b-sf], [b-fac].
5. **MCP Events (experimental), for "Real-Time AI."** This is Mastra's newest real-time primitive (Oct 23). It pushes external events into agent threads via `MCPEventsSignalProvider`. Showing it two weeks after launch would be fresh. The tradeoff is that it is labeled experimental.

Not worth chasing: Knowledge (gated), Launch/Agency (sales programs), Trace Intelligence (private beta).

---

## 5. Sponsor-overlap facts relevant to this event

- **Terse:** Terse has published `TerseAI/durable-actors-mastra-example` (Elysia + Mastra + Durable Actors multiplayer chat, created Oct 14), per sibling research `../terse/03-github-code.md` [V by that file]. Mastra also has its own `createDurableAgent` (beta). Be ready to explain the split: the Terse actor owns room state and fan-out, and Mastra owns the agent loop, tools and memory [I].
- **Agent Relay:** there is no Mastra adapter (sibling research `../agent-relay/01-docs-api.md`). Mastra-side bridges that exist today are MCP (Relay exposes `agent-relay mcp`), A2A protocol v0.3.0 (Mastra serves an agent card at `/api/.well-known/<agent>/agent-card.json` and an executor at `/api/a2a/<agent>`) [docs a2a], or plain Mastra tools that call the Relay SDK. Relay messages can also be injected into a Mastra thread with `sendSignal()`/notification signals [I, based on the Signals docs].
- **OpenAI:** `@mastra/voice-openai-realtime` (`OpenAIRealtimeVoice`, WebSocket speech-to-speech with VAD) is maintained (0.14.8, modified Oct 28 on npm) [V]. Connect lists OpenAI as a provider.
- **Supabase:** Supabase is a Connect provider and has a Mastra auth integration (`/integrations/auth/supabase`) [V llms.txt].
- **Freestyle / Superserve:** neither is listed in Mastra's sandbox integrations (AgentCore, Apple Container, Blaxel, Cloudflare, Daytona, Docker, E2B, E2B Desktop, Modal, Railway, Sprites, Vercel) [V llms.txt]. Using them with Mastra means writing a custom tool or `WorkspaceSandbox` [I].

---

## 6. Limits / could not verify

- **The Signals/Goals GA date (Oct 5)** comes from Seismo, a third-party aggregator citing Mastra/@calcsam on X. I did not find a Mastra blog post titled "GA" for either. The current docs pages carry no Beta banner, though Exa's cached copy of the older `/docs/long-running-agents/*` URLs (which now redirect) still showed "Beta." Treat it as GA with moderate confidence.
- **mastra.ai/changelog** returned not-found to Exa. `/topics/changelog` lists entries only through Mar 23, 2026, so GitHub releases are the de facto changelog for this window.
- **Exact post dates:** I used the date printed on each post. Sitemap lastmod sometimes differs (e.g. the MCP 2.0 post shows Oct 21, while Exa metadata said Jul 28, which is the spec date).
- **What "N months free of Mastra Platform" means** (which plan, whether Connect/sandboxes are included) is not stated on the event page or Mastra's site.
- **Whether Mastra staff will judge or mentor on-site** is unknown. The event page says "Judges will be announced soon."
- I did not run the X/Twitter timeline directly. The LinkedIn roundups were read through Exa highlights, and engagement counts there are low (6–26 reactions). Social sentiment is out of scope (see 04-social-pulse if present).
- Customer and metric claims (1,800 Factory commits per month, 25–35% of PRs, the memory-usage drop, "tens of thousands of organizations") are Mastra's own claims and are not independently verified.

---

## 7. Hackathon implications

**What to build (Mastra-flavored, both-hosts compatible):**
- **A multiplayer, long-running "haunted" agent session.** Run one `AgentController` session per room/haunting, with several humans (browser and/or Slack via Harness Channels) steering it live through `session.sendMessage()` / `steer()`. Give it a durable **Goal** (e.g. "escape the haunted house," judged by a judge model) and a live goal-progress UI driven by `goal` stream chunks. The Terse actor holds room state and fans it out. Agent Relay carries agent-to-agent chatter between multiple Mastra agents (ghost, medium, skeptic), with Relay messages surfaced into threads as signals. This covers Mastra's GA flagship, Terse and Relay at once [I].
- **Real-time twist:** use OpenAI Realtime voice (`@mastra/voice-openai-realtime`) for a spoken "séance." Alternatively, use MCP Events with `delivery: "push"` so external triggers (a webhook, a GitHub star, a Supabase row) "wake" the agent mid-run via `MCPEventsSignalProvider`. Only do this if one teammate owns it, since it is experimental.
- **Software-factory angle:** a small "haunted software factory" built with `createCodingAgent` plus a Goal judge on a sandbox. Do not try to stand up Mastra Factory itself in 5 hours.

**What to show judges (60-second Mastra moment):** open Mastra Studio or the platform **Thread View/traces** of the live multiplayer session. Show a mid-run steer landing, a goal evaluation flipping to `done`, and (if deployed) the `mastra deploy` URL. Say the GA names out loud: "Agent Controller, Signals, Goals."

**Gotchas:**
- **Use 1.79+/1.80 APIs.** Sessions are keyed by `sessionId`; `controller.session()` in client-js takes a session id, and the resource moves to `create()` [r79]. For multiple sessions per user (e.g. one per haunted room), pass `createSession({ id: roomId, resourceId })`; the old `scope` option is gone. `createSession` throws if an explicit `resourceId` doesn't match the live session with that id [r79].
- Connect in core 1.80 changed the `POST /connect/:provider/sessions` response from `connectUrl` to `launchUrl` [r80]. Separately, core **1.75** (not 1.80) renamed `integrations` to `providers` and re-keyed the Slack channel to `slack-channels`, with `slack` still accepted as an alias in `channels()`. Slack *tools* stay on `slack` [r75].
- Durable Agents are **beta** and replay LLM and tool calls on recovery, so make tools idempotent.
- Signals across multiple processes need a shared Pub/Sub backend. If Terse actors and the Mastra server run in different processes, plan for that or keep Mastra in one process.
- `@mastra/mcp` 2.x rejects pre-2026-07-28 MCP clients and dropped SSE. Check that any MCP client you pair with (including `agent-relay mcp`) speaks the new spec, or pin `@mastra/mcp` 1.x.
- Goals default to `maxRuns: 50` with an LLM judge on every iteration. On $100 of OpenAI credits, set `maxRuns` low (5–10) and use a cheap judge model.
- LiveKit voice: disable `preemptiveGeneration` if you use Mastra memory.
- Platform reliability: the Oct 21 Railway incident shows platform builds can stall. Keep a local `mastra dev` demo path, and treat the platform deploy as a bonus.

**Setup to do before Oct 31 (allowed: setup and ideas, not project code):**
1. `npm i -g mastra@latest` (CLI 1.36.0), and confirm `npm view @mastra/core version` reports 1.80.x.
2. Create a Mastra Platform account at projects.mastra.ai (Starter is free), create a project, and get `MASTRA_PLATFORM_ACCESS_TOKEN` + `MASTRA_PROJECT_ID`. Dry-run `mastra deploy` on a throwaway hello-world so deploy auth is not a surprise on Saturday.
3. If you plan to use Connect, run `mastra connect add github|slack|supabase` on the throwaway project to pre-authorize the OAuth consents.
4. If you plan to use Slack channels, pre-create the Slack app/bot and a tunnel (ngrok/cloudflared) for webhooks.
5. Read the current docs for Agent Controller session, Signals overview, Goals and (optionally) MCP Events, rather than the blog snippets.
6. Clone and read (do not reuse code) `TerseAI/durable-actors-mastra-example` to see the actor/Mastra split.

---

## Sources

Mastra blog (dates as printed on each post):
- [b-sbx]: https://mastra.ai/blog/introducing-managed-sandboxes-and-filesystems-for-mastra-platform (Aug 3)
- [b-eph]: https://mastra.ai/blog/introducing-ephemeral-sandbox-deploys (Aug 5)
- [b-imsg]: https://mastra.ai/blog/introducing-imessage-support (Aug 11)
- [b-dyn]: https://mastra.ai/blog/introducing-dynamic-workflows (Aug 12)
- [b-bit]: https://mastra.ai/blog/introducing-built-in-tools (Aug 13)
- [b-cca]: https://mastra.ai/blog/introducing-create-coding-agent-helper (Aug 17)
- [b-hch]: https://mastra.ai/blog/introducing-harness-channels (Sep 1)
- [b-cu]: https://mastra.ai/blog/introducing-sandbox-computer-use (Sep 2)
- [b-fac]: https://mastra.ai/blog/announcing-mastra-factory-beta (Sep 8)
- [b-mh]: https://mastra.ai/blog/introducing-memory-hooks (Sep 29)
- [b-acga]: https://mastra.ai/blog/announcing-agent-controller-ga (Oct 6); background: https://mastra.ai/blog/announcing-agent-harness (Jun 18, updated Oct 6)
- [b-conn]: https://mastra.ai/blog/introducing-mastra-connect (Oct 7)
- [b-agency]: https://mastra.ai/blog/mastra-agency-program (Oct 8)
- [b-fgc]: https://mastra.ai/blog/fine-grained-context (Oct 8)
- [b-launch]: https://mastra.ai/blog/announcing-mastra-launch (Oct 20)
- [b-mcp2]: https://mastra.ai/blog/introducing-mcp-2 (Oct 21)
- [b-inc]: https://mastra.ai/blog/platform-incident-october-21-2026 (Oct 22)
- [b-mcpev]: https://mastra.ai/blog/introducing-mcp-events (Oct 23)
- [b-know]: https://mastra.ai/blog/announcing-mastra-knowledge (Oct 26)
- [b-span]: https://mastra.ai/blog/introducing-span-queries (Oct 28)
- Blog index and sitemap: https://mastra.ai/blog, https://mastra.ai/sitemaps/blog.xml
- Background: [b-sf] https://mastra.ai/blog/software-factory (Jul 16); [b-price] https://mastra.ai/blog/mastra-platform-pricing (Jul 17); https://mastra.ai/blog/introducing-durable-agents (Jun 26); https://mastra.ai/blog/announcing-agent-signals (Jun 3); https://mastra.ai/blog/introducing-goals (Jul 15); https://mastra.ai/blog/what-are-durable-ai-agents (Jun 30); https://mastra.ai/hackathon (MASTRA.BUILD, Jul 28–Aug 11)

GitHub releases (`gh release view -R mastra-ai/mastra`):
- [r56]–[r80]: https://github.com/mastra-ai/mastra/releases (tags `@mastra/core@1.56.0` … `@mastra/core@1.80.0`; specifically 1.57, 1.60, 1.62, 1.67, 1.68, 1.69, 1.78, 1.79, 1.80 cited above)
- Repo stats via `gh api repos/mastra-ai/mastra`: 29,202 stars, 3,061 forks, last push 2026-10-30T05:50Z UTC (re-checked during verification)

Docs (stability banners read from `.md` versions):
- [d-sig]: https://mastra.ai/docs/signals/overview
- [d-goal]: https://mastra.ai/docs/harness/goals
- https://mastra.ai/docs/harness/durable-agents (Beta + replay warning)
- https://mastra.ai/docs/workflows/dynamic-workflows (Beta)
- https://mastra.ai/docs/mastra-platform/connect/overview (Public Beta)
- https://mastra.ai/docs/mcp/overview (MCP events experimental warning)
- https://mastra.ai/docs/mastra-platform/overview (Trace Intelligence private beta)
- https://mastra.ai/docs/connections/a2a (A2A v0.3.0)
- https://mastra.ai/integrations/voice/openai (OpenAIRealtimeVoice), https://mastra.ai/integrations/voice/livekit
- https://mastra.ai/llms.txt (integration index)
- https://mastra.ai/topics/changelog (stale after Mar 23, 2026)

npm registry (`npm view`, 2026-10-29): `@mastra/core` 1.80.0, `mastra` 1.36.0, `create-mastra` 1.36.0, `@mastra/connect` 1.2.0, `@mastra/mcp` 2.6.0, `@mastra/factory` 0.25.0, `@mastra/voice-openai-realtime` 0.14.8.

Third-party / social:
- [seismo]: https://seismonews.com/event/mastra-launches-agent-signals-and-agent-goals-in-ga (Oct 5)
- [rb]: https://releasebot.io/updates/mastra
- Mastra LinkedIn weekly roundups: https://www.linkedin.com/posts/mastra-ai_last-week-we-launched-1-dynamic-workflows-activity-7495132391167090689-0EBp (Aug 17); …-coding-agent-activity-7497669077910491136-W1vA (Aug 24); …-harness-channels-activity-7502742686832037889-Mp1M (Sep 7); …-mastra-factory-activity-7505279511597441024-15Sz (Sep 14); …-server-health-activity-7507816144561496065-W0_D (Sep 21); …-experiment-targets-activity-7510352930546429952-WhfJ (Sep 28); …-classifiers-with-activity-7512889654887637012-zqiF (Oct 5); …-observability-week-we-launched-activity-7517963071256965121-PrNH (Oct 19)

Sibling research used for overlap facts: `../terse/03-github-code.md`, `../agent-relay/01-docs-api.md`, `../../EVENT_PAGE.md`.

[b-sbx]: https://mastra.ai/blog/introducing-managed-sandboxes-and-filesystems-for-mastra-platform
[b-eph]: https://mastra.ai/blog/introducing-ephemeral-sandbox-deploys
[b-imsg]: https://mastra.ai/blog/introducing-imessage-support
[b-dyn]: https://mastra.ai/blog/introducing-dynamic-workflows
[b-bit]: https://mastra.ai/blog/introducing-built-in-tools
[b-cca]: https://mastra.ai/blog/introducing-create-coding-agent-helper
[b-hch]: https://mastra.ai/blog/introducing-harness-channels
[b-cu]: https://mastra.ai/blog/introducing-sandbox-computer-use
[b-fac]: https://mastra.ai/blog/announcing-mastra-factory-beta
[b-mh]: https://mastra.ai/blog/introducing-memory-hooks
[b-acga]: https://mastra.ai/blog/announcing-agent-controller-ga
[b-conn]: https://mastra.ai/blog/introducing-mastra-connect
[b-agency]: https://mastra.ai/blog/mastra-agency-program
[b-fgc]: https://mastra.ai/blog/fine-grained-context
[b-launch]: https://mastra.ai/blog/announcing-mastra-launch
[b-mcp2]: https://mastra.ai/blog/introducing-mcp-2
[b-inc]: https://mastra.ai/blog/platform-incident-october-21-2026
[b-mcpev]: https://mastra.ai/blog/introducing-mcp-events
[b-know]: https://mastra.ai/blog/announcing-mastra-knowledge
[b-span]: https://mastra.ai/blog/introducing-span-queries
[seismo]: https://seismonews.com/event/mastra-launches-agent-signals-and-agent-goals-in-ga
[rb]: https://releasebot.io/updates/mastra
[d-sig]: https://mastra.ai/docs/signals/overview
[d-goal]: https://mastra.ai/docs/harness/goals
[r75]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.75.0
[li-sigws]: https://www.linkedin.com/posts/mastra-ai_long-running-agents-need-a-reliable-way-to-activity-7519038672202072064-c3fA
[li-obs]: https://www.linkedin.com/posts/mastra-ai_last-week-was-observability-week-we-launched-activity-7517963071256965121-PrNH
[r56]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.56.0
[r57]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.57.0
[r60]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.60.0
[r62]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.62.0
[r67]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.67.0
[r68]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.68.0
[r69]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.69.0
[r78]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.78.0
[r79]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.79.0
[r80]: https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.80.0

---

## Verification log (2026-10-29)

An adversarial re-check of the most decision-relevant claims against live sources. Outcomes: **Confirmed**, **Corrected**, **Partially confirmed**, **Unverified**.

| # | Claim | Check performed | Outcome |
|---|---|---|---|
| 1 | Grand prize includes "3 months free of Mastra Platform"; 2nd gets 2 months, 3rd gets 1 month | `../../EVENT_PAGE.md` lines 76–80 | **Confirmed**. The plan tier is still not stated |
| 2 | `@mastra/core` 1.56.0 (Aug 6) to 1.80.0 (Oct 28) is 25 minor releases in about 12 weeks | `gh release list -R mastra-ai/mastra` gives 1.56.0 at 2026-08-06T08:58Z and 1.80.0 at 2026-10-28T15:23Z, with every minor in between present | **Confirmed** |
| 3 | 1.79.0 breaking change: `createSession({ resourceId })` snippets are stale | `gh release view @mastra/core@1.79.0` says `id` defaults to `resourceId`, "so existing one-session-per-resource code keeps working"; `scope`, `getSessionByResource` and `deleteSession({resourceId,scope})` broke | **Corrected**. The original claim overstated it; the TL;DR and gotchas are fixed |
| 4 | Connect 1.80 changed `connectUrl` to `launchUrl`, and Slack channel id is `slack-channels` | 1.80.0 release notes confirm `launchUrl`. The `slack-channels` re-key and the `integrations` to `providers` rename are in **1.75.0** notes, and `slack` remains an accepted alias | **Corrected**. Version attribution fixed |
| 5 | Agent Controller GA on Oct 6; memory 2–20 GB to 300–750 MB; "Shared by several people…" quote; Signals/Schedules/Goals/Channels quote | Fetched `/blog/announcing-agent-controller-ga` (Oct 6, Patrycja Jenkner-Sar) | **Confirmed**. All quotes are verbatim. The same post also says "over 1800 commits authored by Mastra Factory this month alone" |
| 6 | Harness renamed via PR #18510 | `gh pr view 18510` gives "Make AgentController the canonical API surface and remove the legacy Harness surface", merged 2026-06-26 | **Confirmed** (the rename landed in June; GA came Oct 6) |
| 7 | Connect: public beta, free during beta, 23 providers, ~900 tools, 7 hosted MCP; requires connect 1.0.0 + core 1.75.0; env vars | Blog post and docs banner ("Public Beta: Mastra Connect is free to use on Mastra platform while in beta") | **Confirmed**, with a caveat: the post's own provider list itemizes 22 names |
| 8 | Signals/Goals GA Oct 5 | Seismo card (2026-10-05) cites Mastra and @calcsam on X; the `/docs/signals/overview.md` and `/docs/harness/goals.md` banners have no Beta label; Goals `maxRuns` defaults to 50 in docs | **Partially confirmed**. GA still rests on a third party plus the missing banner; no Mastra "GA" blog post found |
| 9 | MCP Events Oct 23; needs `@mastra/mcp@2.5.0` + core 1.79.0; push/poll/webhook; `MCPEventsSignalProvider`; experimental, SEP-3415 | Blog fetched; docs `/docs/mcp/overview.md` line 456 warning; npm shows `@mastra/mcp` 2.5.0 published 2026-10-21 | **Confirmed**. Push is the default delivery; poll runs at most once a second by default |
| 10 | MCP 2.0: no `initialize`, no session IDs, `Mcp-Method`/`Mcp-Name`, cache hints, `server/discover` | Blog fetched (printed date Oct 21; Exa metadata says 2026-07-28); `@mastra/mcp` 2.0.0 on npm 2026-09-22 | **Confirmed**. "SSE transport removed" and "only accepts 2026-07-28 clients" are not in the excerpt I read: **(unverified on re-check)**, but they are kept as plausible since the spec drops sessions |
| 11 | Oct 21 platform incident (Railway outage + breach; env vars may have been accessed; considering leaving Railway; OSS unaffected) | Fetched `/blog/platform-incident-october-21-2026` (Sam Bhagwat, Oct 22) | **Confirmed**. Timeline detail added |
| 12 | Factory beta Sep 8; 25–35% of PRs, 50–60% of issues; boards Intake→…→Done; "#1 on Product Hunt" | Blog fetched (Sam Bhagwat); LinkedIn Sep 14 post reads "Mastra Factory (#1 on Product Hunt last week!)" | **Confirmed** (still Mastra's own claims). The Product Hunt rank is not checked on producthunt.com |
| 13 | Pricing: Starter free with 100K events / 24 CPU h / 10 GB; Team $250/mo | `/blog/mastra-platform-pricing` (Jul 17, background) | **Confirmed**. Team adds 1M events, 250 CPU h, 100 GB, SSO. Always-On is $100/project |
| 14 | Knowledge is early access, "eight more design partners"; Span Queries Oct 28 needs `mastra@1.36.0` | Both posts fetched | **Confirmed**. Span queries also work self-hosted on DuckDB/Postgres/ClickHouse observability storage |
| 15 | npm versions: core 1.80.0, mastra 1.36.0, connect 1.2.0, mcp 2.6.0, factory 0.25.0, voice-openai-realtime 0.14.8 (modified Oct 28) | `npm view` re-run | **Confirmed** |
| 16 | Repo stats 29,200 stars / 3,061 forks | `gh api repos/mastra-ai/mastra` gives 29,202 / 3,061 | **Confirmed** (updated) |
| 17 | `TerseAI/durable-actors-mastra-example` created Oct 14, Elysia + Mastra + Durable Actors multiplayer chat | `gh api repos/TerseAI/durable-actors-mastra-example` gives created 2026-10-14T00:32Z, with a description that matches | **Confirmed** |
| 18 | Durable Agents, Dynamic Workflows are Beta | Docs `.md` banners: "Beta: Breaking changes may occur without a major version bump" on both | **Confirmed** |
| 19 | "Seven of eight Features-rail posts are platform/observability" | Not re-fetched (blog index layout) | **(unverified)**. Reworded; observability week confirmed via LinkedIn Oct 19 |

Added during verification: the Oct 22 Signals workshop announcement (LinkedIn), the corrected session-API migration guidance, the 1.75 Connect renames, and incident timeline times.
