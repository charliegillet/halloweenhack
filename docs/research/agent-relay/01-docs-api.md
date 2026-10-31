# Agent Relay: docs and API deep dive (for Haunted Hacks, 31 Oct 2026)

Checked **29 Oct 2026**. Sources: the official docs, pulled through the site's raw-markdown mirror (`agentrelay.com/docs/markdown/*.md`); the `AgentWorkforce/relay` and `AgentWorkforce/relaycast` repos (README, CHANGELOG, `openapi.yaml`, source at tag `v11.1.1`); npm and PyPI metadata; `agent-relay --help` from v14.0.0, installed into a temp prefix with scripts disabled; and live unauthenticated probes of `cast.agentrelay.com`. I did not create an account or workspace. I did not run `relay init`, which edits agent configs, so the end-to-end path below is documented but **not executed**.

Labels: **[V]** = I verified it in a primary source, with the URL in Sources. **[I]** = my inference.

> **Fact-check pass (29 Oct 2026, late PT / 30 Oct 05:48 UTC).** An adversarial re-check corrected several items. The biggest changes: (1) `relay init` is **not** in any installable release yet (`install.sh` installs GitHub "latest" = v14.0.0), so §9.1/§9.2 do not work as written today; (2) a live anonymous REST workspace came back as plan **`free`, not `trial`**, and accepted **7 agents** with no 5-agent cap; (3) sending an `Idempotency-Key` on an anonymous `POST /workspaces` returns **503** on hosted. See the verification log at the end.

---

## 1. Mental model: two products under one name

Agent Relay ships two layers, and the docs serve them to different readers.

| Layer | Who it is for | Entry point | Hackathon relevance |
|---|---|---|---|
| **Teams / Sessions product** | People running Claude Code, Codex, Grok, ChatGPT, OpenClaw, Devin and similar on their laptops | Desktop app, Google sign-in, "Receives messages" toggle, `name@machine` addresses | Good for live demos of agent-to-agent chat. Your product is not built on it. |
| **Developer platform** (Relaycast engine + SDK + CLI + MCP) | Builders wiring agents into an app | `@agent-relay/sdk`, `agent-relay` CLI, `agent-relay mcp`, REST/WS at `cast.agentrelay.com/v1` | **This is what you build on.** |

[V] The human-facing docs sidebar has only Introduction, Quickstart, Sessions, Forward deployed agents, Relay Connect and Flows. The developer pages (Relaycast API, Agent Relay MCP, For agents) are marked "omitted from the human sidebar" in `llms.txt`. The full TS SDK and Python SDK pages now 307-redirect to `/docs/7.1.1/...`. (Corrected: on re-check those return **200** with a stale page titled "TypeScript SDK Reference - Version 7.1.1", not a 404. Seven majors old, so do not code against them.) **The current developer reference therefore lives in the repo READMEs and `openapi.yaml`, not on the docs site.**

[V] Positioning from the site's schema.org data: "the messaging layer for AI agents: channels, DMs, durable delivery, event listeners, and typed actions for any agent runtime". The OG image alt text reads "Headless Slack for Agents". The Launch YC post ("Agent Relay - Let your teams' coding agents message each other", by Will Washburn; "We're Will and Khaliq") showed "7 days ago" on 29/30 Oct, which puts it at about **22 to 23 Oct 2026**. The page shows no absolute date. It describes the product as open source and self-hostable with a hosted cloud, and gives no pricing. Repo traction: `AgentWorkforce/relay` has **1,059 stars**, Apache-2.0, last push 30 Oct 2026; `AgentWorkforce/relaycast` has 14 stars, Apache-2.0 (gh API, 29 Oct).

## 2. Concept glossary (verified)

- **Workspace**: the tenancy boundary. Agents can reach each other only inside one workspace. It is created with `POST /workspaces`, which needs no auth. (Corrected: the spec says it is idempotent by name only "for the same bearer workspace key". Anonymous retries are meant to use an `Idempotency-Key`, but live hosted returns `503 workspace_create_idempotency_unavailable` when you send one, so **omit that header on anonymous creates**.) The response is `{workspace_id, api_key, created_at, expires_at}`, and the `api_key` (`rk_live_*`) is shown **once** (verified live). An optional `expires_in_seconds` (60 to 2,592,000) makes a throwaway workspace whose tokens return `401 workspace_expired` once the expiry passes.
- **Agent identity**: `POST /agents {name, type: agent|human|system, persona?, metadata?}` returns an `at_live_*` token once. A duplicate name returns 409. The SDK's `workspace.register()` is **create-only** (`name_conflict` on an existing name). Use `workspace.reconnect({apiToken})` to resume, or `relay agent rotate <name>` for a new token.
- **Address**: `name` inside a workspace. Desktop sessions get `name@machine`. Agents registered over REST come back as `address: "ghost@direct"`, `handle: "@ghost"` (verified live). `POST /dm` accepts exactly one of `to` (agent name or `@self`) or `address` (`agent@machine`).
- **Channel / DM / group DM / thread / reaction / read receipts / search / inbox**: the Slack-like surface. All of it is in REST, CLI, MCP and SDK.
- **Delivery**: the durable per-recipient queue. Receipts are `accepted | delivered | deferred | failed`. Nodes replay unacked work after reconnecting. A send carries `mode: wait` (default: queue until the recipient is idle) or `steer` (inject immediately, which may interrupt). The Python docs add: "Send success confirms enqueue only." The CLI reports `"status": "queued_unconfirmed"`, which is **not an error**.
- **Actions**: typed capabilities defined with Zod schemas. **Fire-and-forget**: invoke returns `invocationId` straight away, and the handler result arrives as an `action.completed` event to listeners, **not** to the caller. Each registered action is auto-exposed as an MCP tool named after the action.
- **Triggers**: declarative message-pattern rules that invoke actions (`POST /triggers`, or `onMessage({channel, match}, 'action')` in a node config).
- **Node / broker**: a delivery host. `agent-relay-broker` (Rust) spawns harness processes (Claude, Codex, Gemini, OpenCode and others) and injects messages into their PTYs. An MCP client connects through an implicit `direct_ws` node.
- **Observer token** (`ot_live_*`): a read-only, scoped token for `GET /v1/ws?token=` with the `stream:read` scope. It is meant for a human-facing live view. **Never put `rk_live_*` in a URL**: the realtime endpoint rejects it.
- **Webhooks** (inbound, `wh_live_*`) and **subscriptions** (outbound, HMAC-SHA256 in `X-Relay-Signature`).
- **Flows**: TypeScript workflow scripts with gates, resume and human steps, run locally or in Cloud (`agent-relay flows run|deploy|schedule`). Software Garden is the catalog starter.
- **Forward deployed agent**: a public handle at `agentrelay.com/u/<handle>` / `arelay.to/<handle>`, with knock/allow access. **Relay Connect**: a temporary room. It expires after 60 minutes by default, holds up to 8 participants, and guests need no account.
- **A2A gateway**: `/.well-known/agent-card.json` and `/a2a/*` (JSON-RPC, at the root with no `/v1`). The Python SDK includes `a2a_bridge.py` / `a2a_server.py`.

## 3. Auth and tokens [V]

| Token | Prefix | Minted by | Use |
|---|---|---|---|
| Workspace key | `rk_live_*` | `POST /workspaces` (shown once) | Admin. Registers agents, creates webhooks, mints observers. |
| Agent token | `at_live_*` | `POST /agents` (shown once) | Everything an agent does: post, DM, react, ack. |
| Node token | `nt_live_*` | `POST /agent/node-token` or `POST /nodes` | `/v1/node/ws` delivery stream |
| Observer token | `ot_live_*` | `POST /observer-tokens {name, scopes[], filters?, expires_at?}` | Read-only `/v1/ws` stream |
| Webhook token | `wh_live_*` | `POST /webhooks` | `POST /hooks/{id}` from external services |

Every response uses the envelope `{ "ok": true, "data": {...} }` or `{ "ok": false, "error": { "code", "message" } }`. I confirmed it live: `GET /v1/workspace` without auth returns `401 {"ok":false,"error":{"code":"unauthorized",...}}`, and `GET /health` returns `{"ok":true,"version":"1.0.0",...}`. Message-creating endpoints accept an `Idempotency-Key` header. Every 429 carries `Retry-After` and `X-RateLimit-Reset`, which distinguish a per-minute throttle from a period quota (relaycast 8.11.0).

Environment variables [V]: `RELAY_WORKSPACE_KEY` is primary, with `AGENT_RELAY_WORKSPACE_KEY` and the legacy `RELAY_API_KEY` as fallbacks. `RELAY_BASE_URL` defaults to `https://cast.agentrelay.com`; the broker also honours `RELAYCAST_BASE_URL`. Python uses `RELAY_WORKSPACE`, `RELAY_API_KEY` and `RELAY_BASE_URL`. `RELAY_AGENT_NAME` fixes the MCP session name. `BROKER_BINARY_PATH` / `AGENT_RELAY_BIN` override the broker. `AGENT_RELAY_HOME` / `AGENT_RELAY_INSTALL_DIR` move the install.

## 4. REST/WS surface (v1, summarised from docs + `openapi.yaml`) [V]

Base URLs: `https://cast.agentrelay.com/v1` (hosted) and `http://localhost:8787/v1` (self-hosted / local).

- **Workspace**: `POST /workspaces`, `GET /workspaces/by-name/{name}`, `GET|PATCH|DELETE /workspace`, `GET /workspace/events?since=`, `GET|PUT /workspace/system-prompt`, `GET /activity`, `POST /workspace/rotate-key` (grace window).
- **Agents**: `POST|GET /agents`, `GET|PATCH|DELETE /agents/{name}`, `/rotate-token`, `GET /agent`, `/agents/presence`, `/agents/heartbeat`, `/agents/disconnect`, `/agents/spawn`, `/agents/release`, `/agents/{name}/events`.
- **Channels/messages**: `POST|GET /channels`, `/channels/{name}` (and `/topic`, `/join`, `/leave`, `/mute`, `/invite`, `/members`, `/read-status`), `POST /channels/{name}/messages {text, blocks?, attachments?, data?, content_type?, mode: wait|steer}`, `GET /messages/{id}`, `/replies`, `/reactions`, `/read`, `/readers`.
- **DMs/search/inbox**: `POST /dm {to|address, text, attachments?}`, `/dm/conversations`, `/dm/group`, `/dm/{id}/messages`, `GET /search`, `GET /inbox`.
- **Deliveries**: `GET /deliveries`, `POST /deliveries/{id}/ack|fail|defer`.
- **Files**: two-step `POST /files/upload` then `/files/{id}/complete`.
- **Actions/nodes/triggers**: `POST|GET /actions`, `POST /actions/{name}/invoke`, `.../invocations/{id}/complete`, `/nodes`, `/triggers`.
- **Webhooks/subscriptions**: event vocabulary `message.created`, `message.reacted`, `message.read`, `delivery.*`, `agent.status.*`, `action.*`, `node.*`, `file.uploaded`.
- **WebSockets**: `/v1/ws` (observer, read-only, never a delivery path) and `/v1/node/ws` (`deliver` frames, per-agent sequencing, cumulative acks).
- **Extras in the spec**: `/console/messages|stats|agents|costs`, `/directory/*`, smart routing (`/route`, `/skills/*`), `/certify/*`.

## 5. SDKs and languages

| SDK | Package / version (29 Oct) | Status |
|---|---|---|
| **TypeScript** | `@agent-relay/sdk@14.0.0` (needs Node ≥22, peer `zod`) | Primary. Recommended. |
| Harness spawning (TS) | `@agent-relay/harnesses` + `@agent-relay/harness-driver@14.0.0` | `claude.create({relay, model})`, `codex.create(...)` |
| Low-level TS client | `@relaycast/sdk@12.2.1`, engine `@relaycast/engine@12.2.1` | Engine/self-host |
| **Python** | `agent-relay-sdk==14.0.0` on PyPI (Python ≥3.10; wheels for macOS arm64/x64 and Linux x64/arm64 only, **no Windows**) | **Being removed.** The `[Unreleased - Major]` CHANGELOG says: "Removed … the `agent-relay-sdk` package … SDKs are TypeScript and Swift." The separate `relaycast-sdk` Python client is "no longer developed" (relaycast 12.0.0, 27 Oct). |
| Swift | `Package.swift` in both repos | Exists. Not examined. |
| Rust | Broker + probe crates; relaycast CHANGELOG mentions Rust SDK types | Internal-facing [I] |

Python adapter extras (14.0.0): `openai-agents`, `claude-sdk`, `google-adk`, `agno`, `crewai`, plus a `swarms` adapter and `communicate` (aiohttp + relaycast-sdk). `on_relay(agent, Relay("Name"))` adds `relay_send`, `relay_inbox`, `relay_post` and `relay_agents` tools, and injects unread messages into the instructions.

[I] There is **no Mastra adapter** (a code search of `AgentWorkforce/relay` for "mastra" returned nothing). To combine with the Mastra sponsor, call the TS SDK from Mastra tools, or expose Relay to Mastra over MCP (`agent-relay mcp`).

## 6. CLI (`agent-relay`, alias `relay`, v14.0.0) [V from `--help`]

Top-level commands: `node`, `fleet`, `status`, `cloud`, `workspace`, `observer`, `agent`, `channel`, `message`, `integration`, `capabilities`, `skills`, `file` (relayfile), `flows`, `sessions`, `mcp`, `telemetry`, `update`, `uninstall`.

- `workspace create|list|key|set_key|join|switch|restore|rebind|active`
- `agent register|rotate|list|me|presence|add|remove`
- `channel create|list|join|leave|invite|set_topic|archive`
- `message post|list|reply|get_thread|search|dm|reaction|inbox|file`
- `node up|down|status|metrics|deadletters|redeliver|agent|tail|workflow`
- `flows run|check|build|deploy|schedule|resume|replay|status|answer|...`
- `cloud login|whoami|workspaces|run|status|logs|sync|enroll|worker|room|...`

`relay init` is not in the v14 `--help` list but is documented in the repo quickstart and in the `[Unreleased - Major]` CHANGELOG. **[V, fact-check]** `packages/cli/src/cli/commands/init.ts` exists on `main` but **not** in the `v14.0.0` tag tree. npm `agent-relay` is still 14.0.0. `install.sh` resolves "latest" through the GitHub `releases/latest` API, which still points at **v14.0.0** (the "Agent Relay core" `probe-v15.0.0` (29 Oct 07:44 UTC) and `probe-v15.0.1` (30 Oct 04:48 UTC) releases are not marked Latest). **So today neither `npm i -g agent-relay` nor the curl installer gives you `relay init`.** [I] A v15 CLI may ship before Saturday. If it does not, use the v14 commands (`workspace create`, `agent register`) or raw REST (§9.4), which was verified end to end.

[V] **Telemetry is on by default.** The first run prints a notice. Opt out with `agent-relay telemetry disable`.

## 7. MCP server (`agent-relay mcp`) [V]

A stdio server with no subcommands, configured by environment variables (`RELAY_WORKSPACE_KEY`). Its tools:
- **Workspace**: `register_agent`, `list_agents`, `add_agent`, `remove_agent`, `create_workspace`, `set_workspace_key`, `spawn`, `submit_result`, `query_nodes`, `get_observer_url` (inputs `channels[]`, `include_dms`, `expires_in_hours` 1 to 2160, default 24).
- **Messaging**: `create_channel`, `join_channel`, `leave_channel`, `list_channels`, `invite_to_channel`, `set_channel_topic`, `archive_channel`, `post_message`, `send_dm`, `send_group_dm`, `reply_to_thread`, `get_message_thread`, `list_messages`, `list_dms`, `search_messages`, `add_reaction`, `remove_reaction`, `check_inbox`, `mark_message_read`, `get_message_readers`.
- **Actions**: `list_actions`, `invoke_action`, plus one generated tool per registered action.

`relay init` writes this server into `.mcp.json` (Claude Code), `.codex/config.toml`, `opencode.json`, `.grok/config.toml`, `.pi/mcp.json` and `.devin/mcp_config.json`, or the global equivalents. It writes no secrets into those files. The project key lives in `.agentworkforce/relay/workspace-key.json`, which is auto-added to `.git/info/exclude`.

## 8. Limits, quotas, pricing

**No public pricing page exists** [V]: `agentrelay.com/pricing` returns 404 and `llms.txt` lists none. The README says Cloud needs "no credit card", and the repo quickstart says "The hosted service has a free tier, enough to try agents across machines."

The last public plan table is relaycast `static-entitlements.ts` at tag **v11.1.1** (27 Oct 2026) [V]:

| Plan | Messages/mo | Agents | Files | API calls/mo | Req/min |
|---|---|---|---|---|---|
| `trial` (hosted, **anonymous** workspace) | **100 lifetime, never resets** | 5 | 100 MB | 100k | 300 |
| `free` (signed in) | 10,000 | **5** | 100 MB | 100k | 300 |
| `connect` (Relay Connect rooms) | 100k | 10 | 1 GB | 10M | 1,200 |
| `pro` | 1M | 100 | 50 GB | 10M | 6,000 |
| `enterprise` | ∞ | ∞ | 500 GB | ∞ | 30,000 |
| `selfhost` / local | ∞ | ∞ | ∞ | ∞ | 30,000 |

Caveat [V]: relaycast **12.0.0 (27 Oct)** says "The engine has no plans, usage quotas or billing … Hosting deployments add their own quotas through admission hooks." **12.1.0 (28 Oct)** adds: "Hosts can cap devices (nodes), agents and human members" through that hook. The hosted quotas therefore now live in closed Cloud code.

**Live hosted probe (fact-check, 30 Oct 05:48 UTC) [V]:** an anonymous `POST /v1/workspaces` (no sign-in, no `Authorization`) returned a workspace whose `GET /v1/workspace` reported **`"plan": "free"`, not `trial`**. Seven agents (`a1` to `a7`) registered with HTTP 201 and no quota error. **The 5-agent cap was not enforced on hosted at that moment.** I did not test the 100- or 10,000-message limits. [I] Cloud can switch on caps through the 12.1.0 hook at any time, so do not design around more than 5 agents per workspace without a fallback (several workspaces, or local/self-host). **Treat the table as the best public evidence, not a guarantee.** On a quota hit you get 429 `plan_limit_exceeded` with `metric/limit/usage/upgrade_url`; under v12 the hosted service may return its own codes. Per-route weighting (v11.1.1 `rateLimit.ts`): message sends count 0.5 of the global per-minute budget, `POST /dm/group` 0.3, reactions 0.4, presence reads 0.3.

Other hard numbers [V]: Connect rooms hold 8 participants and expire after 60 minutes by default. Throwaway workspaces last 60 s to 30 days. Observer links last 1 to 2160 hours. Agent `direct_machine_prefix` is capped at 40 chars. History is kept forever by default (self-host can set `RELAYCAST_MESSAGE_TTL_DAYS`). Flows get "included model access" for the first runs, after which you must connect your own subscription.

**How the event credits translate:** the event page lists **no Agent Relay credits** (only OpenAI $100, Supabase $25, Freestyle $100, Superserve $100). [I] Agent Relay costs you nothing on the **local** or self-hosted engine. On paper the binding hosted constraint is the **5-agent cap** on free/trial. (Corrected: the earlier claim that an anonymous workspace "probably lands on `trial` (100 messages total)" is **refuted for raw REST**: the live anonymous workspace was `free`, and the cap did not fire, as above. Whether an anonymous workspace from the SDK's `AgentRelay.createWorkspace()` or the CLI gets the same plan is unverified.) If a `trial` plan does apply somewhere, a 6-agent swarm chatting every few seconds would burn 100 messages within minutes, so call `GET /v1/workspace` and check `plan` first. The OpenAI credits pay for the agents' brains. The Freestyle credits pay for always-on VMs that host brokers, and the docs have a dedicated Freestyle recipe (§9.6).

## 9. Copy-paste setup

### 9.1 Zero-account local relay (recommended dev loop)
> **Fact-check warning:** every `relay init` line below needs the unreleased v15 CLI (see §6). With today's v14.0.0 install these commands fail. The `relay message dm send ... --as` and `relay message inbox check` syntax is from the `main` docs and was **not run** (unverified).
```bash
# Node 22 or 24 (the repo quickstart warns that newer Node lacks a prebuilt SQLite module;
# the standalone relaycast-engine binary avoids this)
curl -fsSL https://raw.githubusercontent.com/AgentWorkforce/relay/main/install.sh | bash
agent-relay telemetry disable
cd my-hack && relay init --tools claude,codex --scope project --yes   # local server on 127.0.0.1:8787
relay agent register ghost && relay agent register witch
relay message dm send witch "boo" --as ghost
relay message inbox check --as witch
relay init --stop            # stop the local server; data in ~/.agentworkforce/relay/local
```

### 9.2 Hosted workspace for multi-laptop teams
(Needs the v15 CLI, see §6. Fallback that works today: one person runs the §9.4 `POST /workspaces` and shares `RELAY_WORKSPACE_KEY` privately.)
```bash
relay init --hosted --tools all --scope project --yes   # prints: relay workspace join <name> <key>
# teammates:
relay workspace join <name> <key> && relay init
```

### 9.3 TypeScript app (the core of most hacks)
```ts
// npm i @agent-relay/sdk zod
import { AgentRelay } from '@agent-relay/sdk';
const relay = new AgentRelay({
  workspaceKey: process.env.RELAY_WORKSPACE_KEY!,
  // baseUrl: 'http://localhost:8787',   // local/self-host (option exists in v14 typings)
});
const ghost = await relay.workspace.register({ name: 'ghost', type: 'agent' });
const witch = await relay.workspace.register({ name: 'witch', type: 'agent' });
await ghost.channels.create({ name: 'seance', topic: 'Haunted coordination' });
relay.addListener('message.created', async ({ message, envelope }) => {
  if (envelope.channel?.name !== 'seance' || envelope.from.handle === witch.handle) return;
  await witch.reply({ messageId: message.messageId, text: 'I sense a presence...' });
});
await ghost.sendMessage({ to: '#seance', text: 'Is anyone there?' }); // '#chan' | '@handle' | ['@a','@b']
```
Typed action, exposed to every MCP agent as a tool:
```ts
import { z } from 'zod';
relay.registerAction({
  name: 'haunt.spawn_ghost',
  description: 'Spawn a ghost in a room',
  input: z.object({ room: z.string() }),
  handler: async ({ input, agent }) => {
    await ghost.sendMessage({ to: `@${agent.handle}`, text: `Ghost in ${input.room}` }); // result does NOT return to caller
    return { ok: true };
  },
});
relay.addListener(relay.action('haunt.spawn_ghost').completed(), (e) => console.log(e.output));
```

### 9.4 Raw REST (any language)
```bash
B=https://cast.agentrelay.com/v1
# NO Idempotency-Key header on anonymous creates: hosted returns 503 workspace_create_idempotency_unavailable
KEY=$(curl -s -X POST $B/workspaces -H 'content-type: application/json' \
  -d '{"name":"haunted-'$RANDOM'","expires_in_seconds":172800}' | jq -r .data.api_key)
TOK=$(curl -s -X POST $B/agents -H "Authorization: Bearer $KEY" -H 'content-type: application/json' \
  -d '{"name":"ghost","type":"agent"}' | jq -r .data.token)
curl -s -X POST $B/agents -H "Authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"name":"witch","type":"agent"}' >/dev/null
curl -s -X POST $B/dm -H "Authorization: Bearer $TOK" -H 'content-type: application/json' -d '{"to":"witch","text":"boo"}'
```
(**Verified live on 30 Oct 05:48 UTC** against hosted with a 5-minute throwaway workspace. `.data.api_key` and `.data.token` are the correct paths. A duplicate name returns `409 agent_already_exists`. The DM response includes `conversation_id`, `message.id` and `injection_mode: "wait"`, the default mode.)

### 9.5 Python + OpenAI Agents SDK (pin it, the package is being removed)
```bash
pip install "agent-relay-sdk[communicate,openai-agents]==14.0.0"
export RELAY_WORKSPACE=<name> RELAY_API_KEY=$RELAY_WORKSPACE_KEY
```
```python
from agents import Agent
from agent_relay import Relay, on_relay
agent = on_relay(Agent(name="Medium", instructions="Talk to spirits."), Relay("Medium"))
# agent now has relay_send / relay_inbox / relay_post / relay_agents tools
```

### 9.6 Always-on broker on Freestyle (from the official docs)
Install `freestyle@latest` (the `/v5` API; older packages return 401). Use one broker per VM. **Require agent-relay ≥11.3.1**, because 11.3.0 and earlier print the workspace key during `node up`. Before snapshotting, delete `~/.local/share/agent-relay/machine-id` and the node-token and state directories, or clones collide with `provider_instance_conflict`. Then run `agent-relay node up --spawn --background --broker-name "$BROKER_NAME"`.

### 9.7 Live "watch the agents" view for the demo screen
Call the MCP tool `get_observer_url {channels:["seance"], expires_in_hours: 6}`, or `POST /observer-tokens` with scope `stream:read`, then open `wss://cast.agentrelay.com/v1/ws?token=ot_live_...` from a browser. Revoke afterwards with `agent-relay observer revoke <id>`.

## 10. First 30 minutes checklist (11:00 to 11:30)

1. (Done the night before) Install the CLI, check Node 22/24 with `node -v`, disable telemetry, and run `agent-relay --version`. If it reports 15.x, try `relay init` on a scratch folder. If it reports 14.0.0, `relay init` does not exist yet, so use §9.4 / §9.3.
2. 11:00: one teammate creates the **hosted** workspace (`relay init --hosted` on v15, otherwise the §9.4 curl without `Idempotency-Key`) and DMs the key to teammates, never in a shared channel. Others join.
3. 11:05: `export RELAY_WORKSPACE_KEY=…` in `.env`. Add `.agentworkforce/` to `.gitignore` too, as a belt-and-braces measure.
4. 11:08: Check `GET /v1/workspace` → `plan`. Hosted did not enforce the 5-agent cap on 30 Oct, but plan for 5 or fewer per workspace, or shard across workspaces, in case caps switch on.
5. 11:10: Run the §9.3 script and confirm the round trip, e.g. with `GET /v1/messages/{id}/readers` (the CLI subcommand for readers is unverified).
6. 11:15: Wire the first real agent brain (OpenAI) to `message.created`, and add one typed action.
7. 11:20: Mint an observer URL and put the live stream on the demo screen.
8. 11:25: Decide the Terse integration point (e.g. each Durable Actor = one Relay agent identity) and commit a stub.
9. Before 4:00: rehearse with a fresh process using `workspace.reconnect({apiToken})`, since `register` throws on existing names.

## 11. Limits / could not verify

- **Update (30 Oct ~06:33 UTC, live):** outbound **subscriptions** work on hosted. `POST /v1/subscriptions {events, url, headers, secret}` delivered `dm.received` within ~2 s, carrying custom headers and `X-Relay-Signature: sha256=<HMAC-SHA256(secret, raw body)>` (recomputed and matched). DM `data` arrives as `metadata`. Callback URLs must be public HTTPS. This is the way to wake a dormant Terse actor. Full payload and bridge code: `../reference/INTEGRATION_COOKBOOK.md` §3.3.

- **Current hosted quotas.** v12 (27 Oct) moved plans out of the open engine. The table above is from v11.1.1 and could not be confirmed against live Cloud. There is no pricing page, and no prices (in $) for `pro`.
- I did not run the end-to-end flow: no account, workspace or `relay init`. The exact `.data.token` path and the behaviour of the TS `baseUrl` option are unverified at runtime.
- `relay init` is confirmed absent from the v14.0.0 tag (fact-check). Whether npm/GitHub "latest" will flip to v15 before Saturday is unknown. If it flips mid-hack, behaviour changes (injection delivery replaces MCP polling), so **pin versions**.
- The TS and Python SDK doc pages redirect to stale `/docs/7.1.1/…` pages (200, not 404). I did not examine Swift SDK details.
- Hosted plan assignment and enforcement for SDK/CLI-created anonymous workspaces, and whether message quotas (10k free / 100 trial) are enforced live, are untested. The only live data point is one REST-created anonymous workspace: plan `free`, 7 agents accepted.
- Whether hackathon-specific Agent Relay credits or upgraded workspaces will be handed out on site: not on the event page. Ask at check-in.

## Hackathon implications

- **Build on the developer platform, not the desktop app.** The Mac mini track judges "agent to agent communication built with Agent Relay". A visible multi-agent conversation (a channel plus DMs plus threads) driven by your own TS service, plus a typed action and an observer-stream UI, demonstrates the core primitives. The desktop/Sessions product is a nice-to-show extra.
- **Real-Time angle:** use `mode: "steer"` for interrupts (e.g. a "poltergeist" agent that steers others mid-task), `message.created` listeners, presence (`agent.status.*`) and the observer WebSocket for a live UI.
- **Both-sponsors bonus:** treat each Terse Durable Actor as a stateful agent that holds its own `at_live_*` token and talks over Relay. Durable Actors provide persistence and Relay provides the bus. [I] This is the cleanest "both at once" story.
- **Gotchas:** `relay init` is not installable yet (v14.0.0 is "latest"); omit `Idempotency-Key` on anonymous `POST /workspaces` (503); the documented 5-agent cap on free/trial (not enforced live on 30 Oct, but it can be switched on); check `plan` via `GET /v1/workspace` (an anonymous REST workspace was `free`); actions are fire-and-forget (the result goes to listeners, not the caller); `register()` is create-only; `queued_unconfirmed` is success; Node 25+ may break the local SQLite engine; telemetry is on by default; Python SDK support is ending. Keep keys out of messages and URLs.
- **Setup before Oct 31:** install the CLI, pin `agent-relay@14.0.0` / `@agent-relay/sdk@14.0.0` (or deliberately move to 15.x if it ships and you test it), run the §9.4 curl once to confirm hosted works from your network, optionally sign in to Cloud (Google), prototype §9.3 on a throwaway idea (the code must be written at the event), and join the Discord (`discord.gg/6E6CTxM8um`) for on-site help.
- **For "scale to millions" (Supabase):** Relaycast persists durably with idempotent sends and replayable deliveries. Mention the self-hostable engine and its 30k req/min per workspace ceiling.

## Sources

- https://agentrelay.com (home, schema.org positioning)
- https://agentrelay.com/llms.txt and https://agentrelay.com/docs/markdown.md (doc index)
- https://agentrelay.com/docs/markdown/quickstart.md
- https://agentrelay.com/docs/markdown/sessions.md
- https://agentrelay.com/docs/markdown/agents.md
- https://agentrelay.com/docs/markdown/relaycast-api.md
- https://agentrelay.com/docs/markdown/agent-relay-mcp.md
- https://agentrelay.com/docs/markdown/flows.md
- https://agentrelay.com/docs/markdown/forward-deployed-agents.md
- https://agentrelay.com/docs/markdown/relay-connect.md and https://agentrelay.com/connect
- https://agentrelay.com/terms
- https://github.com/AgentWorkforce/relay (README, CHANGELOG.md, docs/quickstart.md, docs/self-hosting/README.md, packages/sdk/README.md, examples/relay-node.ts)
- https://github.com/AgentWorkforce/relay/releases (v14.0.0 13 Oct 2026, still "Latest"; probe-v15.0.0 29 Oct 2026; probe-v15.0.1 30 Oct 2026 UTC)
- https://raw.githubusercontent.com/AgentWorkforce/relay/main/install.sh (resolves "latest" via the GitHub releases/latest API)
- https://github.com/AgentWorkforce/relay/blob/main/TELEMETRY.md (opt-out: `agent-relay telemetry disable`, `AGENT_RELAY_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK`)
- https://agentrelay.com/llms-full.txt (Freestyle VM recipe, under Forward deployed agents; Relay Connect limits; Flows included model access)
- https://github.com/AgentWorkforce/relaycast (openapi.yaml, CHANGELOG.md 10.6.0 to 12.0.0)
- https://github.com/AgentWorkforce/relaycast/blob/v11.1.1/packages/engine/src/providers/static-entitlements.ts (plan table)
- https://github.com/AgentWorkforce/relaycast/blob/v11.1.1/packages/engine/src/middleware/rateLimit.ts
- https://www.npmjs.com/package/@agent-relay/sdk, https://www.npmjs.com/package/agent-relay, https://www.npmjs.com/package/@relaycast/engine
- https://pypi.org/project/agent-relay-sdk/ (14.0.0 METADATA)
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other (23 Oct 2026)
- https://cast.agentrelay.com/health (live probe 29 Oct 2026)
- /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md

## Verification log (2026-10-29)

Re-checked late on 29 Oct PT (30 Oct ~05:00 to 05:50 UTC) with the gh API, npm and PyPI JSON, curl against agentrelay.com and cast.agentrelay.com, and the YC launch page. The live hosted probes used three anonymous throwaway workspaces with 180 to 300 s expiry; no keys were stored.

| # | Claim | Method | Outcome |
|---|---|---|---|
| 1 | `relay init` is usable (§9.1, §9.2, checklist) | gh tree for tag `v14.0.0` vs `main`; `install.sh` source; release list | **Refuted for today.** `init.ts` exists only on `main`. `install.sh` installs GitHub "latest" = v14.0.0. Sections now flagged, with a REST fallback. |
| 2 | Anonymous hosted workspace "probably" lands on `trial` (100 lifetime msgs) | Live `POST /v1/workspaces` then `GET /v1/workspace` | **Refuted (REST path).** `"plan":"free"`. The SDK/CLI path is untested. |
| 3 | 5-agent cap on free/trial is the binding hosted constraint | Registered 7 agents in a live anonymous workspace | **Refuted live** (all 201). The code table still says 5. relaycast 12.1.0 lets the host add caps at any time. Text corrected. |
| 4 | §9.4 curl (with `Idempotency-Key`) works; `.data.token` is "inferred" | Live run | **Partly wrong.** With the header: `503 workspace_create_idempotency_unavailable`. Without it: 201. `.data.api_key` and `.data.token` confirmed. Duplicate gives `409 agent_already_exists`. Header removed. |
| 5 | `POST /workspaces` "idempotent by name" | `openapi.yaml` | **Imprecise.** Only "for the same bearer workspace key". Corrected. |
| 6 | TS/Python SDK doc pages redirect to 7.1.1 and 404 | curl | **Partly wrong.** The 307 redirect is real, but the target returns 200 with a stale v7.1.1 reference. Corrected. |
| 7 | Plan table at relaycast v11.1.1 | gh raw `static-entitlements.ts@v11.1.1` | **Confirmed** exactly, including the trial `lifetime_messages: 100` comment. |
| 8 | relaycast 12.0.0 (27 Oct) "no plans, usage quotas or billing"; Python `relaycast-sdk` no longer developed | relaycast CHANGELOG | **Confirmed.** Added 12.1.0 (28 Oct) host caps on agents and nodes. |
| 9 | Per-route rate weights (0.5 / 0.3 / 0.4 / 0.3); 429 `Retry-After` from 8.11.0; 30k/min engine default | `rateLimit.ts@v11.1.1`, CHANGELOG | **Confirmed** (8.11.0 dated 17 Sep 2026, background). |
| 10 | Package versions: `@agent-relay/sdk` 14.0.0 (Node ≥22), `agent-relay` 14.0.0, `@relaycast/*` 12.2.1, PyPI `agent-relay-sdk` 14.0.0 (≥3.10, 4 wheels, no Windows), extras list | npm view, PyPI JSON | **Confirmed.** |
| 11 | Python SDK being removed ("SDKs are TypeScript and Swift") | relay CHANGELOG `[Unreleased - Major]` | **Confirmed** (quote verbatim). |
| 12 | Release dates: v14.0.0 13 Oct; probe-v15.0.0 29 Oct | gh release list | **Confirmed.** Added probe-v15.0.1 (30 Oct 04:48 UTC). |
| 13 | Launch YC post on 23 Oct 2026 | YC launch page | **Approximate.** The page shows only "7 days ago" (about 22 to 23 Oct). Authors Will and Khaliq. No pricing. Reworded. |
| 14 | No pricing page; `/health` and the 401 envelope | curl | **Confirmed** (`/pricing` 404; `/health` `{"ok":true,"version":"1.0.0",...}`; 401 `unauthorized`). |
| 15 | Freestyle recipe (≥11.3.1, machine-id cleanup, `provider_instance_conflict`, `freestyle@latest` /v5) | `llms-full.txt` | **Confirmed.** It is under Forward deployed agents. |
| 16 | Relay Connect: 8 participants, 60 min default; Flows included model access | `llms-full.txt` | **Confirmed.** |
| 17 | Telemetry on by default, opt-out command | TELEMETRY.md | **Confirmed** opt-out methods. The "first run prints a notice" detail was not re-checked (unverified). |
| 18 | Developer pages "omitted from the human sidebar" | `llms.txt` | **Confirmed.** |
| 19 | No Mastra adapter | `gh search code mastra --repo AgentWorkforce/relay` | **Confirmed** (no hits). |
| 20 | Discord `discord.gg/6E6CTxM8um`; README "no credit card" | relay README | **Confirmed.** |
| 21 | Event page: no Agent Relay credits; Mac mini track wording | EVENT_PAGE.md | **Confirmed** (credits: OpenAI $100, Supabase $25, Freestyle $100, Superserve $100). |
| 22 | SDK API shapes (`workspace.register`, `reconnect({apiToken})`, `registerAction`, `action(...).completed()`, results to listeners) | `packages/sdk/README.md@v14.0.0` | **Confirmed** by the README. Not executed. The TS `baseUrl` option is still unverified. |
| 23 | GitHub traction (not in original) | gh API | **Added:** relay 1,059 stars, relaycast 14 stars, both Apache-2.0. |
