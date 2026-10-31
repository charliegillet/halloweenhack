# Agent Relay: master brief for Haunted Hacks (Oct 31 2026)

> Consolidated 2026-10-29 (late PT, live re-checks at 2026-10-30 06:17-06:20 UTC). Merges the five sub-files in [`agent-relay/`](./agent-relay/), each of which already had an adversarial fact-check pass. This brief resolves the contradictions between them and adds three new live checks (marked **[live 06:18Z]**).
> Labels: **[V]** = verified against a primary source or a live probe. **[I]** = inference. *Background* = before Aug 2026.
> Sub-files (go there for depth): [01 docs and API](./agent-relay/01-docs-api.md) · [02 newest features](./agent-relay/02-newest-features.md) · [03 GitHub and code reality](./agent-relay/03-github-code.md) · [04 social pulse](./agent-relay/04-social-pulse.md) · [05 team, strategy and competition](./agent-relay/05-team-strategy.md)

---

## 1. Executive summary

- **What it is.** Agent Relay (agentrelay.com, YC F26, GitHub org `AgentWorkforce`, Apache-2.0) is a messaging layer for AI agents: workspaces, channels, DMs, group DMs, threads, reactions, durable per-recipient delivery, Zod-typed actions exposed as MCP tools, read-only observer streams, and shared session history. It has two layers. The **desktop Sessions product** lets people's Claude Code, Codex, Cursor and similar sessions message each other. The **developer platform** (the Relaycast engine at `cast.agentrelay.com/v1`, `@agent-relay/sdk`, the `agent-relay` CLI and MCP server) is what you build a hack on. [V] ([01 §1](./agent-relay/01-docs-api.md))
- **Who.** Two technical founders: Will Washburn (CEO, 13-14 years at Tailwind) and Khaliq Gant (CTO, ex-Nango W23 and Overview W19, based in Oslo). Caplight records one $500K accelerator round on Sep 1 2026. They co-run this hackathon with Terse. [V] ([05 §2](./agent-relay/05-team-strategy.md))
- **Launch.** Public launch on **Oct 23 2026** (Launch YC plus Will's X post, about 96.6K views via a third-party mirror). The pitch is "Don't be a meat proxy" and "Nobody has to be the message bus." [V] ([02 §1](./agent-relay/02-newest-features.md), [04 §3](./agent-relay/04-social-pulse.md))
- **Stable vs. moving.** Stable is **14.0.0** (npm `latest` and GitHub "Latest", Oct 13). v15 is in flight: npm `next` = `15.0.0-next.5`, and Rust "core" binaries `probe-v15.0.0` (Oct 29) and `probe-v15.0.1` (Oct 30 04:48Z) are out. The account-free `relay init` and push injection into running sessions exist **only in unreleased v15**. **[live 06:18Z]** still 14.0.0 / next.5 / GitHub Latest v14.0.0.
- **Code reality.** The messaging core (SDK plus engine) is quiet and worked first try in a local smoke test (about 25 ms channel latency on localhost). Most of the 231 open issues are in the **broker/fleet/PTY layer**, which spawns coding agents. Build on the messaging core. [V] ([03 §3-4](./agent-relay/03-github-code.md))
- **Social.** Low volume and concentrated in launch week. Reactions are positive but shallow. The main critique is "it's only a communication layer", so orchestration, verification and rollback are still on you. Outside usage is thin: 4 of 217 issues since Aug 1 came from outsiders. [V] ([04 §1](./agent-relay/04-social-pulse.md))
- **Strategic edge.** Since Claude Code v2.1.224 (Aug 7 2026), Claude can message the same user's sessions across machines, so "cross-machine" alone no longer differentiates Relay. What does: **cross-vendor** (Codex, OpenAI-API agents, Grok, Cursor), **cross-person and cross-org** communication, **durable delivery to offline agents**, and **shared session history**. [V] ([05 §6](./agent-relay/05-team-strategy.md))

---

> ### What matters for Haunted Hacks (read this if nothing else)
> 1. **Prize:** best project built with Agent Relay wins a **Mac mini**. Using Agent Relay *and* Terse Durable Actors earns the stated bonus and counts toward the grand prize (YC interview). **The event lists no Agent Relay credits.** Hosted free tier and self-hosting cost nothing. [V: EVENT_PAGE.md]
> 2. **Build on `@agent-relay/sdk@14.0.0`** (or `@relaycast/sdk@12.2.1`) or raw REST. Do not plan on `relay init`, because it is not in any installable release. [V]
> 3. **Anonymous hosted workspaces currently get plan `free`, not the 100-message `trial`.** This was confirmed three times: a REST probe at 05:48Z, and both a REST probe and an `@relaycast/sdk` probe **[live 06:18Z]**. The documented 5-agent cap was *not* enforced at 05:48Z (7 agents accepted). The host can turn caps on at any time, so check `GET /v1/workspace` → `plan` and design for 5 or fewer agents per workspace.
> 4. **Have a local fallback ready:** `npx @relaycast/engine --db ./relay.db --port 8787`, then `baseUrl: 'http://localhost:8787'`. Hosted relaycast had incidents on Oct 5 and Oct 9.
> 5. **Demo shape the founders want:** heterogeneous agents (for example Codex or OpenAI-API plus Claude) talking peer to peer with **no human copy-paste**, shown live through an **observer URL** (`ot_live_*`). Show something native Claude messaging can't do: an offline agent catching up from durable messages, or two different people's agents negotiating.
> 6. **Both-hosts bonus:** each Terse Durable Actor owns one Relay agent identity (its `at_live_*` token) plus its state, and Relay carries the messages between actors. Neither team ships this bridge. Relayfile has a Terse conformance target that is unimplemented because Durable Actors v0.7.9 has no alarm API.
> 7. **Pin versions on Friday Oct 30** and never run `agent-relay update` or `@next` on Saturday.

---

## 2. Key facts

### 2.1 Company and traction (as of 2026-10-29/30)

| Item | Value | Source |
|---|---|---|
| Company | Agent Relay, YC Fall 2026, team of 2, primary partner Grey Baker | [YC](https://www.ycombinator.com/companies/agent-relay) [V] |
| Founders | Will Washburn (CEO, Boston per LinkedIn/IBTimes; YC lists SF), Khaliq Gant (CTO, Oslo) | [05 §2](./agent-relay/05-team-strategy.md) [V] |
| Funding | One accelerator round, Sep 1 2026, $500K total (YC, Cortical, Yonder, Hustle Fund, Active Capital); Shumer Capital appears only on Will's LinkedIn | [Caplight](https://www.caplight.com/company/agentrelay) [V] |
| Main repo | `AgentWorkforce/relay`: **1,059 stars**, 95 forks, created 2025-12-17, Rust + TS, Apache-2.0 | gh API **[live 06:18Z]** |
| Engine repo | `AgentWorkforce/relaycast`: 14 stars, Apache-2.0; hosted engine runs on Cloudflare Durable Objects | [03 §6](./agent-relay/03-github-code.md) [V] |
| Issues | relay 231 open / ~198 closed + 63 open PRs; relaycast 29 / 71 | [03](./agent-relay/03-github-code.md), [04](./agent-relay/04-social-pulse.md) [V] |
| npm downloads | `@agent-relay/sdk` 26,277 and `agent-relay` 3,325 for Oct 22-28; 30-day `@relaycast/sdk` 199,197. Probably inflated by the project's own CI and fleet [I] | npm API [V] |
| Support | Discord `discord.gg/6E6CTxM8um`; GitHub Discussions disabled | relay README [V] |
| Pricing | No pricing page (`/pricing` 404). "Free to start", "no credit card" | [01 §8](./agent-relay/01-docs-api.md) [V] |

### 2.2 Packages to pin

| Package | Version | Notes |
|---|---|---|
| `agent-relay` (CLI, alias `relay`) | **14.0.0** | `next` = 15.0.0-next.5. Telemetry is on by default (`agent-relay telemetry disable`) |
| `@agent-relay/sdk` | **14.0.0** | Node ≥22, peer `zod`. High-level client: `workspace.register`, `sendMessage`, `addListener`, `registerAction` |
| `@relaycast/sdk` / `@relaycast/engine` | **12.2.1** | Low-level client and self-host engine (native `better-sqlite3`, needs a C toolchain; Node 25+ may lack a prebuilt module) |
| `agent-relay-sdk` (PyPI) | 14.0.0 | Python ≥3.10, macOS/Linux wheels only. **Removed in unreleased v15**; relaycast Python SDK discontinued in 12.0.0 |
| `@relayflows/sdk` | 2.0.55 | Flows; the API is still churning (2.0.14 to 2.0.55 in about 6 weeks) |

### 2.3 Tokens and endpoints [V]

| Token | Prefix | Use |
|---|---|---|
| Workspace key | `rk_live_*` (shown once) | Admin: register agents, mint observers. **Never put it in a URL.** |
| Agent token | `at_live_*` (shown once) | Everything an agent does |
| Observer token | `ot_live_*` | Read-only `GET /v1/ws?token=` (`stream:read`), for the demo screen |
| Node token | `nt_live_*` | `/v1/node/ws` delivery stream (broker) |
| Webhook token | `wh_live_*` | Inbound `POST /hooks/{id}` |

Hosted base: `https://cast.agentrelay.com/v1`; local: `http://localhost:8787/v1`. Envelope: `{ok, data}` / `{ok:false, error:{code,message}}`. `/health` → `{"ok":true,"version":"1.0.0","build":"53007fe…"}` **[live 06:18Z]**. Per-route rate weights (v11.1.1): message send 0.5, group DM 0.3, reactions 0.4. 429s carry `Retry-After`.

### 2.4 Plan table (best public evidence, relaycast `static-entitlements.ts` @ v11.1.1, Oct 27)

| Plan | Msgs | Agents | Req/min |
|---|---|---|---|
| `trial` (anon hosted, per changelog) | 100 lifetime | 5 | 300 |
| `free` | 10,000/mo | 5 | 300 |
| `connect` | 100k/mo | 10 | 1,200 |
| `pro` | 1M/mo | 100 | 6,000 |
| `selfhost`/local | ∞ | ∞ | 30,000 |

Caveat: relaycast 12.0.0 (Oct 27) removed plans from the open engine, and 12.1.0 (Oct 28) lets the host add caps through admission hooks. Live hosted enforcement is therefore closed-source and can change without notice. [V] ([01 §8](./agent-relay/01-docs-api.md))

---

## 3. Newest features, dated (Aug-Oct 2026)

| Date | Feature | Status |
|---|---|---|
| Aug 5 / Aug 25 | Ratify Protocol cross-company trust demos; a signed revocation sent as a Relay DM blocked a foreign agent "within seconds" | Blog/demo, not a shipped feature |
| Aug 13 | `@agent-relay/session` (cross-harness session continuity) | GA |
| Aug 20 | v11.8.1: `fleet spawn <cli> --sandbox`; **`agent-relay observer`** read-only URLs + `get_observer_url` MCP tool | GA |
| Sep 10 | v12.0.0: `integration subscribe --to @agent --spawn` (GitHub events wake agents) | GA |
| Sep 12 | Blog "Promptgramming": Flows `flow()` scripts with `.gate()` checks | Blog |
| Sep 18 | YC F26 announced; Muse/Devin spawning (v12.4.0, Sep 20); Shared Sessions MCP (v12.4.1, Sep 22) | GA |
| Sep 30 | v13.0.0: per-agent `model`; durable existing-session delivery | GA |
| Oct 2-4 | **Relay Connect**: temporary rooms, 8 participants, 60-min default expiry, guests need no account | GA |
| Oct 7-8 | **arelay.to** forward-deployed agent handles, verified-agent directory | GA |
| Oct 10 | v13.3.0: file attachments up to 25 MiB over DMs and channels | GA |
| Oct 13 | **v14.0.0 (current stable)**: checkout-first sandbox spawns | GA |
| Oct 16-18 | Relaycast 10.6.0: `connect` plan + workspace-key rotation; OpenAI Apps domain challenge on site (PR #230) | GA / hint |
| Oct 21→26 | Docs rewritten "around sessions" ("Sessions are the product"); old SDK docs archived at `/docs/7.1.1/` | Docs |
| **Oct 23** | **Public launch** (Launch YC + X) | Launch |
| Oct 26-27 | Microsoft sign-in, `/download`, `/open-source` catalog | Site |
| Oct 27 | Relaycast 11.1.0 `trial` plan (100 msgs lifetime) + standalone `relaycast-engine` binaries; 12.0.0 engine has no quotas | Engine |
| Oct 28-29 | Relaycast 12.1-12.2.1: `agent.on.*` before `connect()`, presence leases, DM unread fixes | Engine |
| **Oct 29** | **Freestyle hosting guide** (PR #251, merged 20:17Z): section "Run the answering agent on a Freestyle VM" inside `/docs/forward-deployed-agents`; `probe-v15.0.0` core | Docs / core |
| Oct 30 04:48Z | `probe-v15.0.1`; npm `next` → 15.0.0-next.5 | Prerelease |
| Unreleased (v15) | `relay init` (account-free local server, `--hosted` join), push delivery via probe (Claude SessionStart/inbox, Codex hooks, OpenCode), Python SDK removed, CLI owner-takeover on re-register | **Not installable** |
| Not public | "Agent Relay in ChatGPT" plugin (README: "not a published directory listing") | Private |

*Background:* SDK launch Feb 27 (tic-tac-toe Claude vs Codex), "runtime for proactive agents" reframe May 10, OSSCAR index listing (Supabase + Commit VC) Apr 28-29. Release volume: 68 tagged releases from v11.4.0 (Aug 2) to v14.0.0 (Oct 13); 15 in October. Full table in [02 §2](./agent-relay/02-newest-features.md).

---

## 4. Social sentiment (window Aug 1-Oct 29)

| Signal | Data [V] |
|---|---|
| Launch tweet (@willwashburn, Oct 23) | 506 likes, 62 RT, 33 quotes, 93 replies, ~96.6K views (teapawt mirror, re-read Oct 29) |
| Biggest independent post (@longhaiqwe123, Chinese, Oct 24) | 492 likes, 71 RT, ~51.4K views. "Claude Code writes, Codex reviews, two rounds, no human relay" |
| YC LinkedIn launch post | 307 reactions, 150 comments (Exa-indexed copy) |
| Hacker News | No Launch HN; about 2 points total in the window |
| Product Hunt | 8 upvotes, #67, not featured |
| Reddit / TikTok | Nothing found (Reddit search returned 403, so this is a coverage gap) |
| YouTube | One podcast (The Parameter #57, 131 views). Rival Buzz videos: 74.7K and 35.5K (*background*, Jul-Aug) |

**Praise:** it names a real pain (the human as message bus); it works across vendors; it is open source with a free cloud; it works with existing tools (Codex app, Claude in the terminal, Conductor).
**Critiques (verbatim sources in [04 §3-4](./agent-relay/04-social-pulse.md)):** "it's a communication layer" (decomposition, verification and rollback are left to you); "too heavy, just use herdr"; "you are doing it wrong, use a coordinator with ephemeral VMs" (@madarco, promoting his own tool); push only works for broker-launched agents, self-started ones poll over MCP, and hosted is the default (heysynapse, a competitor).
**Name collisions:** at least 6 other "agent-relay"/"AgentRelay" projects (`Wearer-Lab/agent-relay`, `saranyan/agent-relay`, `mnemox-ai/AgentRelay`, a Mac app "Relay", Toli, and others). Link `AgentWorkforce/relay` explicitly in your submission.
**[I]** Many replies to the Chinese thread looked AI-written (the author agreed), so treat reply volume with caution. Outside adoption is thin, so the founders will value a polished, credible third-party build.

---

## 5. Contradictions between sub-files: resolved or flagged

| # | Conflict | Resolution |
|---|---|---|
| 1 | **Anonymous hosted plan.** 02 says anonymous = `trial` (100 msgs ever, from relaycast 11.1.0 changelog); 01's live REST probe got `free` | **Resolved live: `free`.** 01 REST at 05:48Z; my REST probe and an `@relaycast/sdk@12.2.1` `RelayCast.createWorkspace()` probe **[live 06:18Z]** both returned `"plan":"free"`. The SDK posts to the same `/v1/workspaces` endpoint with origin headers. `trial` may apply to other origins or come later. Still check `plan` on the day. The CLI path and `@agent-relay/sdk` `AgentRelay.createWorkspace()` were not probed. |
| 2 | **Quotas.** 03 says "found no published numbers"; 01 has a full plan table | 01 is right about the *code* table (v11.1.1). Both are right that **live** hosted quotas are unpublished (closed admission hooks since 12.0/12.1). |
| 3 | **5-agent cap** in the table vs. 7 agents accepted live | Not enforced at 05:48Z. Not re-tested (to avoid spamming the service). Design for 5 or fewer per workspace or shard across workspaces. |
| 4 | **Launch date.** 01 says "~22-23 Oct" (page shows "7 days ago"); 02/05 say Oct 23 | **Oct 23** (YC launch page publish metadata, per 02/05 verification). |
| 5 | **Python.** 01 gives a Python recipe; 02 says "no Python SDK" | `agent-relay-sdk==14.0.0` exists on PyPI and works for stable. It is removed in unreleased v15. Use TypeScript unless you must use Python, and pin it if you do. |
| 6 | **probe-v15 = "v15 prerelease"** (early 05 draft) | These are Rust "Agent Relay core" binaries that `relay init` downloads, not the npm CLI. They are flagged `prerelease=false` but are not GitHub "Latest" **[live 06:18Z]**. |
| 7 | **Push vs. pull.** 04 says "spawn through the broker so messages are pushed"; 03 says "avoid fleet/broker, it is the buggy layer" | These do not conflict. Your own process gets realtime events via SDK listeners (WebSocket), which is push for your code. Broker push only matters for CLI coding agents (Claude Code/Codex in PTYs). **Recommended:** make the core agents SDK-driven (OpenAI API), and treat a broker-spawned Codex/Claude as an optional stretch. |
| 8 | **X mirror domain.** 02 cites `teapaw.org`, 04/05 cite `teapawt.org` | Same site. Both return 200 with title "… \| teapawt" **[live 06:18Z]**. It is unofficial; counts may differ from x.com. |
| 9 | **Tweet views** 96,454 / 96,474 / 96,603 / "96.5k" | Reads taken at different times. Use "~96.6K (Oct 29, mirror)". |
| 10 | **TS SDK docs page** "200" (03 original) vs "404" (01 original) | It is a 307 redirect to `/docs/7.1.1/typescript-sdk`, which returns 200 but is stale (7 majors old). Use `packages/sdk/README.md` and `llms-full.txt`. |
| 11 | **Claude Code native messaging is "same machine" only** (05 original) | Refuted. v2.1.224 reaches the same user's sessions on other machines via Remote Control. |
| 12 | **Setup path.** 04/05 say "desktop app + cloud workspace", 01 §9.1 says `relay init` | `relay init` is unavailable on stable. Desktop/Sessions is fine for a "before/after" demo, but build the product on the SDK/REST. |
| 13 | **Weekly downloads** "~1.0K" (05 draft) | 3,325 (`agent-relay`) / 26,277 (`@agent-relay/sdk`), Oct 22-28. |
| 14 | **Freestyle guide** "new page" (02 draft) | It is a section of `/docs/forward-deployed-agents`. |
| 15 | **Hyphen-mention bug #1466** | Not reproduced on local engine 12.2.1; unknown on hosted/MCP. **Flagged.** Avoid hyphenated agent names. |
| 16 | **Release counts** (68 / ~41 / 15) | Different windows (Aug 2-Oct 13 / since Aug 27 / October). Consistent. |
| 17 | **`crossSessionInbound` values** (04) | Only `hold` is confirmed in source; "accept"/"refuse" are **unverified**. "One relay team per checkout" is also unverified. |

---

## 6. Gotchas (deduplicated, ranked by demo risk)

1. **Version churn.** Three majors in a month, and `next` moved twice on Oct 29 alone. Pin `agent-relay@14.0.0`, `@agent-relay/sdk@14.0.0`, `@relaycast/sdk@12.2.1`, `@relaycast/engine@12.2.1`. If v15 becomes `latest` before Saturday, don't switch unless you've tested it.
2. **`relay init` doesn't exist on 14.0.0.** `install.sh` installs GitHub "Latest" (v14.0.0). `init.ts` exists only on `main`.
3. **`Idempotency-Key` on an anonymous `POST /workspaces` returns `503 workspace_create_idempotency_unavailable`.** Omit it. Also note that `POST /workspaces` is idempotent by name only "for the same bearer workspace key".
4. **Registration is create-only.** Re-registering a name throws (`Agent "ghost" already exists…` from the SDK, `409 agent_already_exists` over REST). Hot-reload dev servers crash on their second boot. Persist `at_live_` tokens and call `workspace.reconnect({apiToken})`, or add a run suffix. On self-host there is no rotate (relaycast #581).
5. **DM events.** `addListener('message.created')` sees only channel messages. DMs arrive as `dm.received` and group DMs as `group_dm.received`. Listen on `'*'`. The API doc's raw WS event list doesn't include `dm.received`, so check it yourself if you use raw WS.
6. **README bug.** `envelope.from.handle` is undefined; use `envelope.from.name`. DM readback returns `kind:'channel'` (#1987), so don't branch on it.
7. **Actions are fire-and-forget.** `invoke` returns an `invocationId`, and the result goes to `action.completed` listeners, not the caller. It is at-most-once if the caller's socket drops (relaycast #283, *background*, still open).
8. **`queued_unconfirmed` is success**, not an error. A send confirms enqueue only. `mode:'wait'` (the default) waits for the recipient to be idle; `mode:'steer'` interrupts.
9. **Hosted reliability.** relaycast #476 (Oct 5) and #503 (Oct 9 incident, relayfile inbound path) are still open. With 50+ hackers on one engine, degradation is plausible [I]. Keep the local engine flag ready.
10. **Stale docs.** Don't feed `agentrelay.com/docs/typescript-sdk` to your coding agent (it serves v7.1.1). Use `relay/packages/sdk/README.md`, `https://agentrelay.com/llms-full.txt`, and the `using-agent-relay` / `messaging-agents-on-the-relay` skills.
11. **Broker/PTY layer (if you spawn coding agents).** Codex `database is locked` (#1865), the hook-trust modal hangs a spawn (#1951), brief truncation (#1938; #1890 closed), false `spawn_failed` (#1927/#1935/#1554), and injections stopping after 1-5 h (#1593). PTY task cap is 14 KiB (16 KiB with envelope), so pass files for anything larger. Messages arrive "between turns".
12. **Security.** Keys passed as plaintext argv to spawned agents (#1570/#1889); `rk_live_` written unmasked to fleet logs (#1460); 11.3.0 and earlier print the workspace key during `node up`. Keep keys out of URLs, shared channels and the repo. Use observer tokens for anything shown on screen.
13. **Platform.** No Windows Python wheel and no Windows standalone CLI; the Windows desktop build is unsigned. Use macOS/Linux or WSL.
14. **Other limits.** DM listing breaks at about 120 conversations on one agent (#1471). `npm i` of engine + SDK took 29 s with native compilation, so cache it before venue Wi-Fi.

---

## 7. Integration recipes (all verified unless noted)

**7.1 Hosted workspace in curl (verified live 05:48Z; plan re-checked 06:18Z).**
```bash
B=https://cast.agentrelay.com/v1
# NO Idempotency-Key header here (hosted returns 503 with it)
KEY=$(curl -s -X POST $B/workspaces -H 'content-type: application/json' \
  -d '{"name":"haunted-'$RANDOM'","expires_in_seconds":172800}' | jq -r .data.api_key)
curl -s $B/workspace -H "Authorization: Bearer $KEY" | jq .data.plan      # expect "free"
TOK=$(curl -s -X POST $B/agents -H "Authorization: Bearer $KEY" -H 'content-type: application/json' \
  -d '{"name":"ghost","type":"agent"}' | jq -r .data.token)
curl -s -X POST $B/agents -H "Authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"name":"witch","type":"agent"}' >/dev/null
curl -s -X POST $B/dm -H "Authorization: Bearer $TOK" -H 'content-type: application/json' -d '{"to":"witch","text":"boo"}'
```

**7.2 TypeScript core (shapes from the SDK README @ v14.0.0, with the smoke-test fixes applied).**
```ts
import { AgentRelay } from '@agent-relay/sdk';   // npm i @agent-relay/sdk@14.0.0 zod
const relay = new AgentRelay({ workspaceKey: process.env.RELAY_WORKSPACE_KEY!
  /*, baseUrl: 'http://localhost:8787' */ });     // baseUrl at runtime: unverified for this client
const ghost = await relay.workspace.register({ name: 'ghost', type: 'agent' }); // throws if it exists -> reconnect({apiToken})
relay.addListener('*', async ({ message, envelope }) => {        // '*' catches dm.received too
  if (envelope.from.name === 'ghost') return;                    // .name, not .handle
  /* call OpenAI, then ghost.sendMessage({ to: '#seance', text }) */
});
await ghost.sendMessage({ to: '#seance', text: 'Is anyone there?' });
```
The `registerAction({name, input: z.object(...), handler})` actions automatically become MCP tools. Results reach `relay.action(name).completed()` listeners. See [01 §9.3](./agent-relay/01-docs-api.md).

**7.3 Local engine fallback (verified locally).** `npx @relaycast/engine --db ./relay.db --port 8787`. It boots in under 1 s, `createWorkspace` takes about 60 ms, and it is single-process with in-memory idempotency (fine for a demo). Switch with an env flag.

**7.4 Live view for judges.** MCP `get_observer_url {channels:["seance"], expires_in_hours: 6}`, or `POST /observer-tokens` (scope `stream:read`), then open `wss://cast.agentrelay.com/v1/ws?token=ot_live_…` from the browser UI. Revoke afterwards with `agent-relay observer revoke <id>`. `@relaycast/react` exists for UI.

**7.5 Always-on agent on Freestyle (sponsor tie-in, official docs Oct 29).** Use `freestyle@latest` (the `/v5` API; `/v1` returns 401) with one broker per VM and agent-relay ≥11.3.1. Before snapshotting, delete `~/.local/share/agent-relay/machine-id` and the node-token/state dirs, or clones fail with `provider_instance_conflict`. Then run `agent-relay node up --spawn --background --broker-name "$BROKER_NAME"`. `fleet-sandbox.ts` also lists `freestyle` as a sandbox provider. For a lighter path, run your SDK-based agent process on the VM instead of the broker [I].

**7.6 Terse Durable Actors bridge (the bonus) [I].** One actor per agent. It stores its `at_live_*` token, memory and task state, and it reconnects (never re-registers) on wake. Relay messages (DM or channel) act as the wake-up trigger, which suits Durable Actors' missing alarm API (relayfile matrix: no `setAlarm`, PRs #147-#151 closed unmerged). A coordinator actor owns the job state machine (claim → work → verify → done/rollback). That answers the "just a communication layer" critique.

**7.7 Other sponsors.** **Mastra:** there is no adapter, so call the TS SDK from Mastra tools or connect over `agent-relay mcp`. **OpenAI:** the Python SDK has an `openai-agents` extra; in TS, wrap OpenAI calls inside listeners. **Supabase:** a `relayfile-providers/packages/supabase` package exists. For "scale to millions", mirror the message history into Postgres/Realtime, and cite the hosted engine on Durable Objects (relaycast #139 "Scaling to millions of agents") and the 30k req/min self-host ceiling.

---

## 8. Hackathon implications

**What to build (ranked):**
1. **"Haunted handoff" / séance room.** A cross-vendor agent team (OpenAI-API "ghost" plus Claude "medium" plus a Codex "builder", or several OpenAI personas with distinct roles) coordinating over Relay channels, DMs, threads and reactions. Each agent's state lives in a Terse Durable Actor. The live observer stream goes on the projector. **Signature demo beat:** kill one agent mid-task, show its messages queuing durably, and show it resuming from actor state. That one moment covers both hosts, durable delivery and real-time.
2. **Cross-org variant.** Your agent and a "customer's" agent (a second laptop, or a Freestyle VM behind an `arelay.to` handle) debugging together, with scoped permissions and a human-escalation step. This matches the founders' "Debug with customers, agent to agent" roadmap.
3. **Software-factory flow** (`@relayflows/surface` `flow()` with planner, implementer and `.gate()`). It matches the event's "Software Factory" wording but rests on a churning API, so it is a riskier choice.

**Pitch framing.** Open with a human copy-pasting between two agents ("meat proxy"), then cut to the agents doing it themselves. Say "messaging infrastructure", not "multi-agent framework" (they distance themselves from LangGraph and CrewAI). Be ready to answer "what does Relay add over Claude Code's built-in messaging?" The answer: cross-vendor, cross-person, offline durability, shared history. Keep 2-5 workers per lead (Khaliq's stated sweet spot) and add a reviewer or "shadow" agent that catches stubbed work.

**Setup before Oct 31 (code must be written at the event; setup and ideas are fine):**
- [ ] `node -v` shows 22 or 24. Install the CLI and confirm `agent-relay --version` = 14.0.0. Run `agent-relay telemetry disable`.
- [ ] Run recipe 7.1 once from your network, confirm `plan` = `free`, then let the workspace expire.
- [ ] Cache `npm i @agent-relay/sdk@14.0.0 @relaycast/sdk@12.2.1 @relaycast/engine@12.2.1 zod` in a scratch dir, and confirm `better-sqlite3` builds and the local engine boots.
- [ ] Save `https://agentrelay.com/llms-full.txt` and clone `AgentWorkforce/skills` (`using-agent-relay`, `messaging-agents-on-the-relay`) for your coding agent.
- [ ] Optional: install the desktop app, sign in (Google/Microsoft), and confirm a Claude Code ↔ Codex DM for the "before/after" segment.
- [ ] Read the Freestyle section of `/docs/forward-deployed-agents` and claim Freestyle credits. Skim the Terse Durable Actors quickstart.
- [ ] Run `/list-agents` in Claude Code ≥2.1.224 so you can state precisely what Relay adds.
- [ ] Join the Discord (`discord.gg/6E6CTxM8um`). Founders are likely to be reachable during the event.
- [ ] Re-check npm dist-tags Friday night. If `latest` flipped to 15.x, stay on your tested pin.

**What judges and sponsors want [I, from the founders' own words].** Real, visible, autonomous peer-to-peer agent traffic across vendors, with no faked messages (both founders dogfood heavily and will spot fakes). Durable/offline delivery and least-privilege shown explicitly. A crisp before/after. For Terse: real statefulness. For Freestyle and OpenAI: at least one agent on a Freestyle VM and one on the OpenAI API (Relay just documented Freestyle hosting and appears to be preparing an OpenAI Apps surface). Judges have not been announced.

---

## 9. Limits / could not verify

- Live hosted **message** quotas (10k free / 100 trial) are untested, the 5-agent cap was tested only once (not enforced), and the CLI-created and `@agent-relay/sdk` `AgentRelay.createWorkspace()` plan assignments were not probed (the `@relaycast/sdk` path was: `free`).
- Whether v15 reaches npm/GitHub "latest" before Oct 31, and whether it breaks the v14 SDK API.
- The `@agent-relay/sdk` `baseUrl` option against a local engine was not run end to end (the local smoke test used it with the engine, per 03, but 01 flags the high-level option as unverified).
- Hosted behaviour of hyphen mentions (#1466); the raw-WS DM event name on hosted.
- X metrics come only from the unofficial teapawt mirror. Reddit, TikTok and Discord were not inspected. Product Hunt date unknown. Star growth curve unavailable (stargazers API 404).
- Tailwind Series A vs. B (YC vs. LinkedIn); whether Caplight's $500K includes angels; Shumer Capital.
- Telemetry "first-run notice" wording; desktop app version notes; whether hackathon-specific credits or upgraded workspaces will be handed out on site (not on the event page; ask at check-in).
- relayfile-cloud#275 (Terse adapter implementation) is in a private repo.

---

## Sources (merged, deduplicated)

**Event:** /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md (from https://events.ycombinator.com/haunted-hacks-2026) · https://builderbase.com/event/haunted-hacks-2026

**Official site and docs:** https://agentrelay.com · https://agentrelay.com/llms.txt · https://agentrelay.com/llms-full.txt · https://agentrelay.com/docs/introduction · https://agentrelay.com/docs/quickstart · https://agentrelay.com/docs/sessions · https://agentrelay.com/docs/agents · https://agentrelay.com/docs/relaycast-api (mirror: /docs/markdown/relaycast-api.md) · https://agentrelay.com/docs/markdown/agent-relay-mcp.md · https://agentrelay.com/docs/flows · https://agentrelay.com/docs/forward-deployed-agents · https://agentrelay.com/docs/relay-connect · https://agentrelay.com/connect · https://agentrelay.com/download · https://agentrelay.com/terms · https://agentrelay.com/docs/typescript-sdk (307 → /docs/7.1.1/) · https://cast.agentrelay.com/health

**Blog:** https://agentrelay.com/blog/introducing-agent-relay (Feb 27, background) · https://agentrelay.com/blog/let-them-cook-multi-agent-orchestration (Feb 4, background) · https://agentrelay.com/blog/just-give-the-agent-files · https://agentrelay.com/blog/trusting-an-agent-you-didnt-spawn (Aug 5) · https://agentrelay.com/blog/someone-elses-agent-in-your-repo (Aug 25) · https://agentrelay.com/blog/promptgramming (Sep 12) · https://proactiveagents.dev/posts/the-genesis/ (May, background)

**GitHub (AgentWorkforce):** https://github.com/AgentWorkforce · https://github.com/AgentWorkforce/relay (README, CHANGELOG.md, releases, actions, contributors) · https://github.com/AgentWorkforce/relay/blob/main/packages/sdk/README.md · https://github.com/AgentWorkforce/relay/blob/main/docs/self-hosting/README.md · https://github.com/AgentWorkforce/relay/blob/main/examples/relay-node.ts · https://github.com/AgentWorkforce/relay/blob/main/packages/cloud/src/fleet-sandbox.ts · https://github.com/AgentWorkforce/relay/blob/main/TELEMETRY.md · https://raw.githubusercontent.com/AgentWorkforce/relay/main/install.sh · https://github.com/AgentWorkforce/relaycast (README, openapi.yaml, CHANGELOG.md, docs/self-hosting.md) · https://github.com/AgentWorkforce/relaycast/blob/v11.1.1/packages/engine/src/providers/static-entitlements.ts · https://github.com/AgentWorkforce/relaycast/blob/v11.1.1/packages/engine/src/middleware/rateLimit.ts · https://github.com/AgentWorkforce/relayfile/blob/main/docs/vendor-compatibility-matrix.md · https://github.com/AgentWorkforce/skills (incl. plugins/chatgpt) · https://github.com/AgentWorkforce/agentrelay.com (commit log, PRs #230, #243, #251) · https://github.com/AgentWorkforce/ratify-agent-relay-evidence · https://github.com/AgentWorkforce/relay-cross-framework-demo

**Issues cited:** relay #1416, #1460, #1466, #1471, #1510, #1550, #1554, #1570, #1593, #1674, #1781, #1794, #1818, #1824, #1837, #1838, #1865, #1889, #1890, #1899, #1927, #1935, #1938, #1949, #1951, #1963, #1986, #1987, #1988 (https://github.com/AgentWorkforce/relay/issues/<n>) · relaycast #139, #283, #356, #476, #503, #535, #581 (https://github.com/AgentWorkforce/relaycast/issues/<n>)

**Registries:** https://www.npmjs.com/package/agent-relay · https://www.npmjs.com/package/@agent-relay/sdk · https://www.npmjs.com/package/@relaycast/sdk · https://www.npmjs.com/package/@relaycast/engine · https://registry.npmjs.org/agent-relay · https://api.npmjs.org/downloads/point/last-week/agent-relay · https://api.npmjs.org/downloads/point/last-week/@agent-relay/sdk · https://api.npmjs.org/downloads/range/2026-08-01:2026-10-28/@agent-relay/sdk · https://pypi.org/project/agent-relay-sdk/

**YC and company:** https://www.ycombinator.com/companies/agent-relay · https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other (Oct 23) · https://www.ycombinator.com/founders/will-washburn · https://www.caplight.com/company/agentrelay · https://fundraisingfox.com/companies/agent-relay · https://mentionfox.com/funding/yc-agent-relay · https://launcharchive.ai/companies/agent-relay · https://animatiq.ai/launch-directory/agent-relay · https://linkedin.com/in/willwashburn · https://no.linkedin.com/in/khaliqgant · https://linkedin.com/company/agent-relay

**Social (X via unofficial teapawt mirror; teapaw.org serves the same site):** https://x.com/willwashburn/status/2113646682001101151 · https://x.com/longhaiqwe123/status/2114031712430948410 · https://x.com/AIQuickFindings/status/2114942189340110929 · https://x.com/agent_relay/status/2115264276445450347 · https://x.com/Khaliqgant/status/2115836049624887759 · https://x.com/swkkadjo/status/2114228519442190598 · https://x.com/saikatx/status/2114260537974349856 · https://teapawt.org/agent_relay · https://teapawt.org/willwashburn/status/2113753053191131581 · https://teapawt.org/willwashburn/status/2113834761110319374 · https://teapawt.org/Khaliqgant/status/2112219340422721818 · LinkedIn: https://www.linkedin.com/posts/y-combinator_agent-relay-yc-f26-lets-your-teams-coding-activity-7519414526870589440-andg · https://www.linkedin.com/posts/willwashburn_on-joining-y-combinator-activity-7506769056285450240-HM17 · https://www.linkedin.com/posts/khaliqgant_every-ai-company-is-racing-to-build-the-smartest-activity-7433281449396580352-x54X · https://www.linkedin.com/posts/khaliqgant_we-recently-pushed-out-the-agent-relay-sdk-activity-7443329202424274945-1NzN · HN: https://news.ycombinator.com/item?id=47208242 · /item?id=47934957 · /item?id=50106258 · /item?id=50182360 · /item?id=50194681 · /item?id=50262407 · Product Hunt mirror: https://www.hunted.space/product/agent-relay-2

**Press and third-party:** https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082 (Sep 30) · https://explainx.ai/blog/agent-relay-open-source-shared-sessions-flows-coding-agents-handoff-apache-2026 (Oct 23) · https://heysynapse.dev/blog/claude-code-and-codex-talk-to-each-other/ (Oct 16/24) · https://www.youtube.com/watch?v=Ksg1Gxoeprs · https://www.youtube.com/watch?v=P1KpxzLVg7c · https://www.youtube.com/watch?v=JDiAQp63WB4 · https://www.youtube.com/watch?v=oBuWXUy7stw

**Competitors and platform:** https://github.com/anthropics/claude-code/releases/tag/v2.1.224 · https://code.claude.com/docs/en/cross-session-messaging · https://agentcouch.dev/compare · https://github.com/osteele/agent-loom · https://github.com/vbcherepanov/a2abridge · https://github.com/alexfrmn/murmur · https://github.com/kpab/agmsg · https://github.com/Wearer-Lab/agent-relay · https://github.com/saranyan/agent-relay · https://github.com/arumwu/agentrelay

**Live checks for this brief (2026-10-30 06:17-06:20 UTC):** `npm view agent-relay|@agent-relay/sdk|@relaycast/sdk dist-tags`; `gh api repos/AgentWorkforce/relay/releases/latest` and `/releases`; anonymous throwaway workspaces (120 s expiry) via REST and via `@relaycast/sdk@12.2.1` `RelayCast.createWorkspace()`, then `GET /v1/workspace` → `plan: "free"` both times; `@relaycast/sdk` dist `relay.js` read to confirm the endpoint and headers; `curl` of teapaw.org and teapawt.org. No keys were stored.
