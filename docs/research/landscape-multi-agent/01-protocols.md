# Agent protocols as of late Oct 2026: A2A, MCP, ACP(s), AGNTCY, agents.json, and where Agent Relay fits

Checked **2026-10-29**. Sources: official spec sites, foundation press releases, GitHub API (`gh api` for stars, releases, and commits), npm and PyPI metadata, and the Relaycast source code (`AgentWorkforce/relaycast`, read through `gh api`/`gh search code`). I sent one live unauthenticated request to `cast.agentrelay.com`. I did not create an Agent Relay workspace or run any A2A/MCP interop test, so every interop claim below comes from reading code, not executing it.

Labels: **[V]** = verified in a primary source (URL in Sources). **[I]** = my inference. Items dated before Aug 2026 are marked *(background)*.

---

## TL;DR

1. **Two protocols have won and now share one governance home.** MCP handles agent-to-tool connections and A2A handles agent-to-agent. Both are projects of the **Agentic AI Foundation (AAIF)** under the Linux Foundation. A2A joined AAIF on **2026-08-17**, accepted as a "Growth Stage" project. [V]
2. **MCP's current spec is `2026-07-28`, and it breaks things.** The core is now **stateless**: no `initialize` handshake and no `Mcp-Session-Id`. Server-to-client elicitation and sampling are replaced by **Multi Round-Trip Requests**, and **Tasks** have moved into an official extension. Roots, Sampling, and Logging are deprecated. [V]
3. **A2A is at v1.0.1.** v1.0 shipped 2026-03-12 and v1.0.1 on 2026-05-28. Since Aug 2026 the news has been AAIF membership, the official `a2a` CLI (announced 2026-10-01), SDKs at 1.3.0, and Bloomberg joining the TSC (2026-10-20). [V]
4. **"ACP" names three different protocols.** IBM's Agent **Communication** Protocol merged into A2A in Aug 2025 and its repo is archived. AGNTCY's Agent **Connect** Protocol is archived and deprecated in OASF. Zed/JetBrains' Agent **Client** Protocol (editor to coding agent) is alive at v1.13.0, released 2026-10-27. [V]
5. **AGNTCY is still active, but as infrastructure around A2A/MCP, not as a rival protocol.** Its components are the SLIM transport, the Directory (`dir`), OASF schemas, and identity. **agents.json has been dormant since Feb 2025.** [V]
6. **Agent Relay sits on top of these protocols rather than competing with them.** It exposes itself **as an MCP server** (`agent-relay mcp`) and runs an **A2A gateway** (`/.well-known/agent-card.json`, `/a2a/rpc`). Its value-add is durable, persistent, many-to-many messaging (channels, DMs, inbox, observer). The A2A gateway uses **v0.3-era method names and snake_case fields**, and its MCP package pins the **v1 MCP TS SDK**. Both are interop gotchas. [V code / I impact]

---

## 1. Google A2A (Agent2Agent)

### Status and governance [V]
- **Timeline (background):** Google launched A2A in Apr 2025. The Linux Foundation took it on 2025-06-23. v0.3.0 shipped 2025-07-30, **v1.0.0 on 2026-03-12**, and **v1.0.1 on 2026-05-28**, which included "prefer `application/a2a+json` in HTTP binding" (GitHub releases).
- **AAIF move (in window):** AAIF announced A2A as a hosted project on **2026-08-17**. The A2A blog said on **2026-08-27** that it had been accepted as a "Growth Stage" project. Axios reported that AAIF has grown "from fewer than 40 members to more than 250" since launching in Dec 2025, with backers including Google, Microsoft, Amazon, Anthropic, OpenAI, Bloomberg, Shopify, and Block. AAIF's own post names the sibling projects as **MCP, AGENTS.md, goose, and agentgateway**; the A2A blog lists only MCP, goose, and AGENTS.md.
- **TSC:** At v1.0 the members were AWS, Cisco, Google, IBM Research, Microsoft, Salesforce, SAP, and ServiceNow (LinkedIn reshare of the v1.0 announcement). A commit on 2026-10-20 adds **Bloomberg** to the TSC.
- **Repo activity:** `a2aproject/A2A` has **26,347 stars** (gh API, 2026-10-29), last pushed 2026-10-29. `a2a-python` v1.3.0 shipped 2026-10-27, `a2a-js` v1.3.0 shipped 2026-09-29, and `a2a-cli` v0.3.1 shipped 2026-10-16. On PyPI, `a2a-sdk` is at 1.3.0; on npm, `@a2a-js/sdk` is at 1.3.0.

### Adoption claims (vendor/foundation-sourced, not independently verified)
- In its Apr 2026 one-year release, the LF claimed "more than 150 organizations" plus integrations in Azure AI Foundry, Copilot Studio, and Bedrock AgentCore Runtime *(background)*.
- In Aug 2026, AAIF named production users: **Huawei HarmonyOS** (the Celia assistant talking to in-app agents) and **Tencent WeChat**. It also named Google Cloud ADK/Agent Engine and AP2 commerce with PayPal. The A2A blog lists framework support in LangGraph, CrewAI, Pydantic AI, AG2, and IBM BeeAI.

### What v1.0 actually is (from the spec) [V]
- **Three equal bindings:** JSON-RPC, gRPC, and HTTP+JSON/REST. The spec separates the application protocol from the transport mapping.
- **JSON-RPC methods in v1.0 are PascalCase:** `SendMessage`, `SendStreamingMessage`, `GetTask`, `ListTasks`, `CancelTask`, `SubscribeToTask`, `GetExtendedAgentCard`. The v0.3 names (`message/send`, `message/stream`, `tasks/get`) do not appear in the v1.0 spec.
- **Versioning:** clients send an `A2A-Version: 1.0` header (or `?A2A-Version=`). **An empty value is interpreted as 0.3.** An unsupported version returns `VersionNotSupportedError`. The agent card can advertise 0.3 and 1.0 at the same time, so migration can be gradual.
- **Streaming** uses SSE and requires `capabilities.streaming`. **Push notifications** are POSTs to a client-supplied webhook and require `capabilities.pushNotifications`.
- **Task states** include `TASK_STATE_INPUT_REQUIRED` and `TASK_STATE_AUTH_REQUIRED`, both classed as "interrupted". `REJECTED` is terminal.
- **Enterprise features added in 1.0:** signed Agent Cards, multi-tenancy, OAuth modernization (implicit and password flows removed, device code and PKCE added), and `tasks/list`.
- **New tooling:** the official **`a2a` CLI** (Go, "Built on A2A Protocol v1.0") can fetch cards, send messages, and stream updates. It installs with `brew tap a2aproject/a2a-cli https://github.com/a2aproject/a2a-cli && brew install a2a`. Its README positions it as a tool you hand to coding agents.

### Sponsor tie-in: Mastra [V]
Mastra's docs say its agents serve **A2A v0.3 and v1.0 on the same card and URL**, with the version selected by the `A2A-Version` header. The `A2AAgent` class consumes remote A2A agents as subagents, and its default is v0.3 unless you set `protocolVersion: '1.0'`. Agent cards are served at `/api/.well-known/<agent>/agent-card.json` and execution happens at `/api/a2a/<agent>`. A2A support arrived in `@mastra/core@1.33.1` (Mastra blog, May 2026, background).

---

## 2. MCP (Model Context Protocol)

### Latest spec: `2026-07-28` (in window) [V]
The RC landed 2026-05-29 and the final release on **2026-07-28** (GitHub tag published 2026-07-28T16:47Z). The **RC blog post** calls it "the largest revision of the protocol since launch"; the final-release post instead quotes David Soria Parra calling it "MCP's most important since remote MCP first launched over a year ago". The final-release blog cites "close to half-a-billion downloads a month" across Tier 1 SDKs. Anthropic's post on Claude support gives "400M monthly SDK downloads". The two numbers differ, so cite each with its own source.

**Major changes (from the official changelog):**
| Area | 2026-07-28 behavior |
|---|---|
| Sessions | **`Mcp-Session-Id` removed.** Servers that need state across calls mint explicit handles and pass them as tool arguments (SEP-2567). |
| Handshake | **`initialize`/`initialized` removed.** Every request carries its protocol version and client capabilities in `_meta`. A new, mandatory `server/discover` RPC handles up-front discovery (SEP-2575). |
| Server→client requests | **MRTR (Multi Round-Trip Requests)** replaces server-initiated `elicitation/create`, `sampling/createMessage`, and `roots/list`. The server returns `resultType: "input_required"` with `inputRequests`, and the client retries with `inputResponses` (SEP-2322). |
| Elicitation | Still exists, but it now travels through MRTR. The URL-mode additions from 2025-11-25 (`notifications/elicitation/complete` and `elicitationId`) are **removed**. Correlation state goes in `requestState`. |
| Notifications | The HTTP GET stream and `resources/subscribe` are replaced by **`subscriptions/listen`**, an opt-in long-lived POST stream. |
| Transport | **Streamable HTTP** now requires the `Mcp-Method` and `Mcp-Name` headers, so gateways can route on headers. SSE resumability (`Last-Event-ID`) is removed: if a stream breaks, the client must re-issue the request. The legacy HTTP+SSE transport is formally Deprecated. stdio remains. |
| Tasks | Moved out of the core into the **`io.modelcontextprotocol/tasks` extension** (SEP-2663). The server returns `resultType: "task"` with a `taskId`, `ttlMs`, and `pollIntervalMs`. Clients poll with `tasks/get`, send mid-flight input with `tasks/update`, and cancel cooperatively with `tasks/cancel`. `tasks/list` and the blocking `tasks/result` are removed. Statuses: `working`, `input_required`, `completed`, `failed`, `cancelled`. Optional push via `notifications/tasks` over `subscriptions/listen`. |
| Caching | List results must carry `ttlMs` and `cacheScope`, and `tools/list` order should be deterministic. |
| Deprecations | **Roots, Sampling, and Logging** are deprecated with a minimum 12-month window. **Dynamic Client Registration** is deprecated in favor of Client ID Metadata Documents. |
| Auth | RFC 9207 `iss` validation; credentials bound to their issuer. |
| Extensions | A formal `extensions` capability. Official extensions include **Tasks, MCP Apps** (`ext-apps` v2.0.4, 2026-10-27), and Enterprise Managed Authorization (unverified in this pass). **Server Cards (SEP-2127, extension id `io.modelcontextprotocol/server-card`)** is **Final**: PR #2127 merged 2026-10-06 and `seps/2127-mcp-server-cards.md` reads `Status: Final`. |

### SDK reality check (important for Oct 31) [V]
- The **TS SDK v2** packages are `@modelcontextprotocol/server` and `@modelcontextprotocol/client`, currently 2.4.0. v2.0.0 shipped 2026-07-27, and the repo README says v2 implements 2026-07-28.
- **`npm i @modelcontextprotocol/sdk` still installs v1.x** (dist-tag `latest` = 1.32.2). That is the older line, which gets bug and security fixes for at least six months. [V npm] **Pick the package deliberately.**
- The Python `mcp` package is at 2.3.0. The OpenAI Agents SDK (Python) accepts `mcp>=1.19.0,<3`. With v2 installed, it probes `server/discover` first and falls back to `initialize` for older servers.
- OpenAI's Responses API `mcp` tool takes a `server_url` and "works with remote MCP servers that support either the Streamable HTTP or the HTTP/SSE transport". `connector_id` is deprecated for models released after 2026-09-01.
- **Mastra** `MCPClient`/`MCPServer` "speak the MCP `2026-07-28` revision over stdio and Streamable HTTP" and serve at `/api/mcp/:serverId/mcp`.

---

## 3. ACP: three unrelated protocols share the acronym

| "ACP" | Owner | Purpose | Status Oct 2026 |
|---|---|---|---|
| **Agent Communication Protocol** | IBM Research / BeeAI (LF AI & Data) | REST agent-to-agent | **Merged into A2A** on 2025-08-29 *(background)*. IBM's Kate Blair joined the A2A TSC. `i-am-bee/acp` is **archived** (1,019 stars, last push 2025-08-25). BeeAI now uses A2A adapters. [V] |
| **Agent Connect Protocol** | AGNTCY (Cisco) | Remote agent invocation | `agntcy/acp-spec` is **archived** (169 stars, last push 2025-05-23). **OASF v1.1.0 (2026-07-10) "Deprecated ACP objects".** [V] |
| **Agent Client Protocol** | Zed + JetBrains | Editor ↔ coding agent (the "LSP for agents") | **Active.** `agentclientprotocol/agent-client-protocol` has 4,542 stars and released v1.13.0 on 2026-10-27. The ACP Registry has listed Claude Code, Codex CLI, Copilot CLI, Gemini CLI, OpenCode, goose, and others since Jan 2026 (background; registry contents not re-checked in the verification pass). Mastra can run ACP coding agents as tools or subagents. [V] |

[I] At the hackathon, assume "ACP" means the Zed/JetBrains Agent Client Protocol unless someone says otherwise. It overlaps with Agent Relay's broker, which spawns Claude Code, Codex, and similar harnesses, but ACP talks one editor to one agent over stdio, while Relay is many-to-many.

---

## 4. AGNTCY (Cisco-originated, Linux Foundation)

- **Background:** Cisco open-sourced it in Mar 2025, and the LF took it on 2025-07-29 with Cisco, Dell, Google Cloud, Oracle, and Red Hat as formative members. It covers four areas: discovery (OASF), identity, messaging (SLIM), and observability. It interoperates with A2A and MCP rather than replacing them. [V]
- **In window (Aug–Oct 2026)** [V]:
  - **SLIM v2.0** (Secure Low-latency Interactive Messaging: pub/sub, streaming, MLS encryption) shipped 2026-08-04. SLIM 3.4.6 shipped 2026-10-20. Repo: 231 stars.
  - **Directory v1.8.0** (2026-10-15) adds publisher identity proofs, OPA/CEL content policies, and runtime workload filters. It removes `dirctl mcp serve`. Repo: 199 stars.
  - **app-sdk v0.6.0** (2026-10-21) migrated to **a2a-sdk 1.x** over the SLIM transport.
  - The Apr 2026 Directory WG notes say AGNTCY is adapting OASF and Directory to **AAIF's AI Catalog** discovery format.
- [I] AGNTCY now works as A2A-compatible plumbing: an alternative transport (SLIM in place of HTTP), a federated registry, and schemas. Star counts are low (20 for app-sdk, 199–341 for slim/dir/oasf) and contributors are mostly Cisco (WG attendee lists), so it is unlikely to be on judges' radar.

## 5. agents.json (Wildcard)

- Version 0.1.0 is an OpenAPI extension that adds "flows" and "links" for LLM API chaining, served at `/.well-known/agents.json`. The last release was 0.1.3 on **2025-02-09**, and the last commit (governance files) was 2025-08-21. The repo has 1,317 stars and is not archived. [V]
- A Mar 2026 third-party post says the project "appears abandoned" and that Wildcard pivoted to GEO. That is a secondary claim I did not check.
- **What replaced it for discovery:** the **AI Catalog** (`/.well-known/ai-catalog.json`, specVersion 1.0), a typed index of MCP Server Cards, A2A Agent Cards, skills, and similar artifacts, backed by AAIF and the Agent Card WG (Google, Microsoft, Anthropic, PulseMCP). Google's competing proposal is **ARD v0.91** (2026-08-26), which uses `/.well-known/ard.json` and treats `ai-catalog.json` as an optional predecessor path. Both are drafts. [V]

---

## 6. Where Agent Relay fits

| Layer | Standard | Agent Relay's relationship |
|---|---|---|
| Agent ↔ tools | MCP | **Agent Relay is an MCP server.** `agent-relay mcp` (stdio) exposes messaging tools (`send_dm`, `post_message`, `check_inbox`, etc.) plus **one MCP tool per registered Zod action**. The docs say the MCP server can push `message.created`, `delivery.*`, and `action.*` when the host supports streaming, with inbox polling as a fallback. Relay also argues that MCP alone can't push ("MCP lets the agent pull"), hence Relayfile. [V docs] |
| Agent ↔ agent (cross-org, request/task) | A2A | **A2A gateway built into Relaycast.** It serves a workspace agent card at `/.well-known/agent-card.json` or `/{workspace}/.well-known/agent-card.json` (each workspace agent is listed as a skill), plus `POST /a2a/register` for external agents, `/a2a/rpc`, and `/a2a/webhook/...`. Inbound A2A message identities are "deduplicated durably for up to 24 hours per workspace" (openapi.yaml), so same-key retries inside 24 h do not create duplicates. The "at-least-once" delivery label is (unverified): I did not find that phrase in openapi.yaml. Ratify delegation proofs travel in `metadata["com.agentrelay.ratify"]`. [V openapi.yaml, source] |
| Agent ↔ agent (persistent, many-to-many) | none standard | **Relay's own surface:** workspaces, channels, DMs, threads, read receipts, observer tokens, and delivery modes (`wait`/`steer`). Neither A2A nor MCP defines group chat or shared history. [V / I] |
| Editor ↔ agent | Agent Client Protocol | No ACP integration found. Relay's broker injects into PTYs and hooks instead. [I, from `05-team-strategy` and `01-docs-api` in this repo] |
| Discovery | AI Catalog / ARD / AGNTCY dir | None found. Relaycast has its own `/directory/*` and `/skills/*` routes. [V docs] |

### Protocol-conformance gotchas found in Relaycast source [V code; impact is I]
1. **The A2A dialect is v0.3-style, not v1.0.** The workspace card advertises `capabilities.methods: ['message/send', 'message/stream', 'task/get', 'task/cancel']`. Outbound calls use `method: 'message/send'`. The card has **no `protocolVersion` or `supportedInterfaces`** fields (`packages/engine/src/engine/a2a.ts`). Note that v0.3 named the methods `tasks/get` and `tasks/cancel`, but Relay uses `task/...`.
2. **Field names are snake_case.** The zod schemas (`packages/a2a/src/index.ts`, `@relaycast/a2a` 12.2.1) require `message_id` and use `context_id`, `default_input_modes`, `mime_type`, and `kind`-discriminated parts. Official A2A JSON uses camelCase (`messageId`, `contextId`), as the Mastra examples show. Zod strips unknown keys by default, so **an official-SDK client sending `messageId` will probably fail Relay's validation, or the reverse**. [I, untested] ProtoJSON parsers on the v1.0 side may accept snake_case proto names, so the failure could be one-directional. Test it before you demo it.
3. **The MCP side is on SDK v1.** `@relaycast/mcp` depends on `@modelcontextprotocol/sdk ^1.26.0`, and the deploy health check sends `initialize` with `protocolVersion: "2025-06-18"`. A 2026-07-28-only client should still connect through version negotiation, but don't expect MCP Tasks or MRTR from Relay's MCP server. [V code / I]
4. A sibling file, `agent-relay/05-team-strategy.md`, says "I found no Agent Relay A2A bridge in docs". **That is wrong.** The bridge exists in the Relaycast API docs ("Other Surfaces"), in `openapi.yaml`, and in the Python SDK (`a2a_bridge.py`, per `01-docs-api.md`).

---

## Limits / could not verify
- I ran no end-to-end A2A interop test (official `a2a` CLI or a Mastra agent against a Relay workspace card). The snake_case and v0.3 incompatibility is inferred from source.
- The live `GET cast.agentrelay.com/.well-known/agent-card.json` returned `404 workspace_not_found` without a workspace selector, which matches the documented behavior. I did not see a real card.
- The adoption numbers (150+ orgs, 250+ AAIF members, MCP download counts) are self-reported by foundations and vendors.
- The A2A CLI announcement ("Meet the A2A CLI", dated October 1, 2026) is confirmed on the A2A announcements index; the full post body was not read.
- I could not confirm whether OpenAI's hosted MCP tool negotiates 2026-07-28. Its docs mention only Streamable HTTP and HTTP/SSE.
- I found nothing on whether Terse Durable Actors expose an MCP or A2A surface. That is out of scope here; check the `terse/` research.

---

## Hackathon implications

**What to build (protocol angle)**
- **The "Relay as universal agent switchboard" pitch.** Show one Relay workspace bridging three worlds: (a) a coding agent over `agent-relay mcp`, (b) an **external A2A agent** (Mastra, Google ADK, or your own) registered through `POST /a2a/register`, and (c) a browser observer view. This tells the story judges want: Relay adds durable, persistent, many-to-many delivery on top of standards that only do point-to-point. It also uses the Relay feature most teams won't find, because the A2A pages are hidden from the human docs sidebar.
- **Pairing with Terse Durable Actors for the both-sponsors bonus.** Make each Durable Actor the long-lived identity or state behind one Relay agent. A2A's `INPUT_REQUIRED` and MCP Tasks' `input_required` both model "pause and wait for a human", and an actor is a natural place to hold that suspended state across the demo.
- **Halloween/real-time framing.** For example, a "séance" channel where agents from different frameworks (Mastra via A2A, Claude Code via MCP, an OpenAI Agents SDK agent via MCP) join one shared channel. Stream it to the audience with an observer token (`ot_live_*`, never `rk_live_*`, in URLs). The `agent-relay mcp` server ships a `get_observer_url` tool that mints a scoped read-only observer link (optional `channels`, `include_dms`), so an orchestrating agent can produce the audience URL itself (https://agentrelay.com/docs/agent-relay-mcp).

**Gotchas**
- **Don't promise "full A2A v1.0 interop" on stage.** Relay's gateway speaks a snake_case, v0.3-style dialect. If you connect a standard A2A agent, either put a small translation shim in front of it, or connect a Mastra agent with the default v0.3 client and test the round trip beforehand.
- **MCP package confusion.** `@modelcontextprotocol/sdk` (v1, the npm `latest` tag) and `@modelcontextprotocol/server`/`client` (v2, spec 2026-07-28) have different APIs, and example code online mixes them. Pick one. If you write a new MCP server, v2 is stateless and deploys cleanly to serverless (Freestyle, Superserve).
- **MCP 2026-07-28 removed sessions.** Any state must live in an explicit handle passed as a tool argument, which a Durable Actor ID handles well [I]. Server-initiated elicitation and sampling are gone; use MRTR or the Tasks extension.
- **Relay actions are fire-and-forget.** The MCP tool call returns right away, and the result comes back as an `action.completed` event, not inline.
- **"ACP" ambiguity.** If a judge or teammate says ACP, ask which one they mean.

**Setup before Oct 31**
- `brew tap a2aproject/a2a-cli https://github.com/a2aproject/a2a-cli && brew install a2a`. Use it to probe agent cards: `a2a` against your Mastra agent, then against a Relay workspace card.
- Create a throwaway Relay workspace (`POST /v1/workspaces` with `expires_in_seconds`), fetch `/{workspace}/.well-known/agent-card.json`, and inspect the card. Then try `POST /a2a/register` with a Mastra agent card URL. This reveals the interop gaps in 15 minutes instead of during the 5-hour build.
- Pre-install `@agent-relay/sdk@14`, `@mastra/core` (A2A ≥1.33.1), `@a2a-js/sdk@1.3.0` or `a2a-sdk==1.3.0`, and the MCP v2 packages if you need them. Remember the rule: ideas and setup ahead of time are fine, but all project code must be written at the event.

**What judges and sponsors likely want** [I]
- The Agent Relay track wants direct agent-to-agent collaboration that goes beyond copying and pasting. Using Relay's A2A gateway, MCP actions, and observer together shows depth.
- Mastra (a sponsor) supports A2A v0.3/v1.0, MCP 2026-07-28, and ACP, which makes it the easiest "foreign framework" agent to plug into Relay.
- Supabase's "scale to millions" angle: the stateless MCP 2026-07-28 design ("any request can land on any instance behind a plain round-robin load balancer") is a credible scaling story to cite.

---

## Sources
- A2A v1.0 announcement: https://a2a-protocol.org/latest/blog/2026/03/12/a2a-protocol-ships-v10-production-ready-standard-for-agent-to-agent-communication/
- A2A releases: https://github.com/a2aproject/A2A/releases (v1.0.0 tag: https://github.com/a2aproject/A2A/releases/tag/v1.0.0)
- A2A spec (v1.0): https://a2a-protocol.org/latest/specification/
- A2A announcements index (CLI 2026-10-01, AAIF 2026-08-27): https://a2a-protocol.org/latest/blog/category/announcements/
- A2A joins AAIF (A2A blog): https://a2a-protocol.org/latest/blog/2026/08/27/a-new-chapter-for-a2a-joining-the-agentic-ai-foundation/
- AAIF: https://aaif.io/blog/a2a-joins-aaif ; https://aaif.io/blog/where-a2a-fits-in-the-open-agent-ecosystem
- Axios, 2026-08-17: https://www.axios.com/2026/08/17/a2a-agentic-ai-foundation-open-ai-standards
- LF A2A launch (2025, background): https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents
- LF A2A one-year (2026-04, background): https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year
- A2A v1.0 LinkedIn (TSC list): https://www.linkedin.com/posts/agent2agent-protocol_activity-7437990339170447360-ltHk
- A2A CLI: https://github.com/a2aproject/a2a-cli
- A2A Java SDK 1.0 GA: https://a2aproject.github.io/a2a-java/posts/a2a-java-sdk-1-0-0-final-released/
- MCP 2026-07-28 changelog: https://modelcontextprotocol.io/specification/2026-07-28/changelog
- MCP 2026-07-28 blog: https://blog.modelcontextprotocol.io/posts/2026-07-28/
- MCP RC blog: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
- MCP release tag: https://github.com/modelcontextprotocol/modelcontextprotocol/releases/tag/2026-07-28
- MCP Tasks extension: https://modelcontextprotocol.io/extensions/tasks/overview ; https://github.com/modelcontextprotocol/ext-tasks
- Anthropic on MCP 2026-07-28: https://claude.com/blog/bringing-mcp-2026-07-28-to-claude
- MCP TS SDK README (v1 vs v2): https://github.com/modelcontextprotocol/typescript-sdk
- OpenAI MCP docs: https://developers.openai.com/api/docs/guides/tools-connectors-mcp ; https://openai.github.io/openai-agents-python/mcp/
- Mastra A2A: https://mastra.ai/docs/connections/a2a ; Mastra MCP: https://mastra.ai/docs/connections/mcp ; Connections overview: https://mastra.ai/docs/connections/overview ; A2A blog: https://mastra.ai/blog/introducing-agent-to-agent-support
- IBM ACP to A2A merger: https://lfaidata.foundation/communityblog/2025/08/29/acp-joins-forces-with-a2a-under-the-linux-foundations-lf-ai-data/ ; repo: https://github.com/i-am-bee/acp
- AGNTCY Agent Connect spec (archived): https://github.com/agntcy/acp-spec ; OASF releases: https://github.com/agntcy/oasf/releases
- Agent Client Protocol: https://github.com/agentclientprotocol/agent-client-protocol ; registry: https://github.com/agentclientprotocol/registry ; Zed: https://zed.dev/blog/acp-registry ; JetBrains: https://blog.jetbrains.com/ai/2026/01/acp-agent-registry/
- AGNTCY LF launch (background): https://www.linuxfoundation.org/press/linux-foundation-welcomes-the-agntcy-project-to-standardize-open-multi-agent-system-infrastructure-and-break-down-ai-agent-silos
- AGNTCY changelog: https://agntcy.org/changelog ; SLIM changelog: https://github.com/agntcy/slim/blob/main/CHANGELOG.md ; SLIM WG 2026-08-11: https://github.com/agntcy/slim/discussions/1998 ; Dir WG 2026-04-23: https://github.com/agntcy/dir/discussions/1405 ; docs: https://docs.agntcy.org/
- agents.json: https://github.com/wild-card-ai/agents-json ; https://docs.wild-card.ai/agentsjson/file-about ; third-party status post: https://www.dawnliphardt.com/a2a-acp-and-agents-json-whats-next-for-these-agent-based-protocols/
- AI Catalog: https://ai-catalog.io/spec/ ; https://aaif.io/blog/the-missing-layer-in-ai-interoperability-discovery ; https://aaif.io/blog/before-agents-can-work-together-they-have-to-find-each-other ; wiki summary: https://agenticweb.wiki/protocols/ai-catalog-well-known-file/
- ARD v0.91: https://github.com/ards-project/ard-spec/blob/main/spec/ard.md
- Agent Relay MCP docs: https://agentrelay.com/docs/agent-relay-mcp ; Relaycast API docs: https://agentrelay.com/docs/markdown/relaycast-api.md ; Why files: https://agentrelay.com/docs/file/why-files
- Relaycast OpenAPI: https://github.com/AgentWorkforce/relaycast/blob/main/openapi.yaml
- Relaycast A2A source: https://github.com/AgentWorkforce/relaycast/blob/main/packages/engine/src/engine/a2a.ts ; https://github.com/AgentWorkforce/relaycast/blob/main/packages/a2a/src/index.ts ; https://github.com/AgentWorkforce/relaycast/blob/main/docs/a2a-ratify-federation.md
- Relaycast MCP package.json: https://github.com/AgentWorkforce/relaycast/blob/main/packages/mcp/package.json
- AAIF on A2A's stack position: https://aaif.io/blog/a2a-joins-aaif
- SEP-2127 file: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2127-mcp-server-cards.md ; PR: https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127
- A2A TSC Bloomberg commit (#2308): https://github.com/a2aproject/A2A/pull/2308
- AGNTCY app-sdk v0.6.0: https://github.com/agntcy/app-sdk/releases/tag/v0.6.0

---

## Verification log (2026-10-29)

An adversarial re-check of 15 decision-relevant claims against live sources: `gh api`, the npm registry, the PyPI JSON API, and direct page fetches. Outcomes: **Confirmed**, **Corrected** (the doc was edited in place), or **Unverified** (marked in the text).

| # | Claim | Method | Outcome |
|---|---|---|---|
| 1 | A2A v1.0.0 on 2026-03-12, v1.0.1 on 2026-05-28, v0.3.0 on 2025-07-30 | `gh api repos/a2aproject/A2A/releases` | Confirmed (exact timestamps match). |
| 2 | A2A repo has 26,346 stars | `gh api repos/a2aproject/A2A` | Corrected to 26,347, a live drift of +1. Not material. |
| 3 | a2a-python v1.3.0 (2026-10-27), a2a-js v1.3.0 (2026-09-29), a2a-cli v0.3.1 (2026-10-16); PyPI `a2a-sdk` 1.3.0; npm `@a2a-js/sdk` 1.3.0 | gh releases, PyPI, npm | Confirmed. |
| 4 | Bloomberg added to A2A TSC on 2026-10-20 | `gh api .../commits` | Confirmed: commit "chore: Add Bloomberg as a member of the Technical Steering Committee (#2308)", 2026-10-20T17:28Z. |
| 5 | A2A joined AAIF 2026-08-17 as "Growth Stage"; Axios's "fewer than 40 members to more than 250"; sibling projects | Axios, AAIF blog, A2A blog fetched | Confirmed. Corrected: Axios's backer list also includes Bloomberg, Shopify, and Block. agentgateway is named by AAIF but not by the A2A blog. |
| 6 | A2A v1.0 PascalCase JSON-RPC methods; an empty `A2A-Version` means 0.3; `VersionNotSupportedError` | Spec page fetched (sections 3.6.1, 3.6.2, 9.4) | Confirmed. The spec only addresses an *empty* header, not a missing one. |
| 7 | MCP 2026-07-28 changelog: sessions removed, `initialize` removed, `server/discover`, MRTR, Tasks moved to an extension, SSE resumability removed, `Mcp-Method`/`Mcp-Name` headers, `ttlMs`/`cacheScope`, Roots/Sampling/Logging deprecated with a 12-month minimum window, DCR deprecated | Official changelog fetched in full | Confirmed, item by item. |
| 8 | "Largest revision of the protocol since launch" quote | Grep of RC blog, final blog, and Anthropic post | Corrected attribution: the phrase is in the **RC** post, not the final-release post. "Close to half-a-billion downloads a month" (MCP blog) and "400M monthly SDK downloads" (Anthropic) are both confirmed verbatim. |
| 9 | npm `@modelcontextprotocol/sdk` latest is 1.32.2; `@modelcontextprotocol/server` and `client` are 2.4.0; PyPI `mcp` is 2.3.0; openai-agents requires `mcp>=1.19.0,<3` | npm dist-tags, PyPI JSON | Confirmed (openai-agents 0.24.0). |
| 10 | SEP-2127 Server Cards Final on 2026-10-06 (previously sourced to a wiki) | `gh api` PR #2127 plus the SEP file | Upgraded to primary-source confirmed: merged 2026-10-06T14:43Z, `Status: Final`. |
| 11 | OpenAI Responses `mcp` tool supports Streamable HTTP or HTTP/SSE; `connector_id` deprecated for models after 2026-09-01 | OpenAI docs page grep | Confirmed verbatim ("deprecated for models released after September 1"). |
| 12 | Mastra: A2A v0.3 and v1.0 on the same card and URL; `A2AAgent` defaults to v0.3; card and execution paths; requires `@mastra/core@1.33.1`; MCP 2026-07-28; ACP supported | Mastra docs and blog (2026-05-19) | Confirmed. Current `@mastra/core` is 1.80.0. |
| 13 | IBM ACP archived (1,019 stars, last push 2025-08-25); AGNTCY acp-spec archived; OASF v1.1.0 (2026-07-10) "Deprecated ACP objects"; Agent Client Protocol v1.13.0 on 2026-10-27 with 4,542 stars | gh API, OASF release notes | Confirmed. Added: acp-spec has 169 stars. |
| 14 | AGNTCY: SLIM v2.0 on 2026-08-04, SLIM 3.4.6 on 2026-10-20, dir v1.8.0 on 2026-10-15, app-sdk v0.6.0 on 2026-10-21 migrated to a2a-sdk 1.x; agents.json last release 0.1.3 on 2025-02-09 with 1,317 stars | gh releases | Confirmed. Note that the agents.json 0.1.3 release is tagged `resend`. Corrected the AGNTCY star range: app-sdk has only 20. |
| 15 | Relaycast A2A: card methods `message/send`, `message/stream`, `task/get`, `task/cancel`; snake_case `message_id`/`context_id`/`mime_type`; `@relaycast/mcp` depends on `@modelcontextprotocol/sdk ^1.26.0`; `/a2a/register`, `/a2a/rpc`, agent-card routes in openapi.yaml; "at-least-once, 24 h retry window" | Source files via `gh api` (a2a.ts L546/L811, a2a/index.ts L127-152), `npm view @relaycast/mcp@12.2.1`, openapi.yaml | Confirmed for methods, fields, the SDK pin, and routes. Corrected: openapi.yaml describes *24 h durable dedup of inbound identities*; "at-least-once" is marked (unverified). |
| 16 | Agent Relay docs: the MCP server pushes `message.created`/`delivery.*`/`action.*` when the host streams; the "MCP lets the agent pull" quote | Agent Relay MCP docs and Why-files page | Confirmed verbatim (the docs also list `session.event`). |
| 17 | Event facts used here: Agent Relay track wins a Mac mini, bonus for using both, "All code must be created at the hackathon" | `docs/EVENT_PAGE.md` | Confirmed. The event page names the Durable Actors prize as an "iPhone Duo". |

No fabricated quotes or URLs were found. Not re-checked in this pass: the ACP Registry agent list, Enterprise Managed Authorization as an official extension, AI Catalog/ARD v0.91 details, the Huawei and WeChat production claims beyond the AAIF post (which does state them), and the A2A v1.0 TSC member list from LinkedIn.

