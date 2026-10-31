# Agent Relay: GitHub and code reality

Researched 2026-10-29 (two days before Haunted Hacks, Oct 31). Angle: what the code, releases, issues and examples actually show, plus the gotchas a 5-hour team will hit. Method: `gh` CLI against the `AgentWorkforce` org, npm and PyPI registry metadata, the published docs index (`agentrelay.com/llms.txt`), and a **local smoke test I ran** of `@agent-relay/sdk@14.0.0` against a self-hosted `@relaycast/engine@12.2.1` on macOS with Node 25.8.0. Labels used below: **[verified]** means I checked it directly (API output or my own run). **[reported]** means it is stated in an issue or doc that I did not reproduce. **[inference]** means my own judgment.

---

## 1. Org and repo map

**[verified]** The GitHub org is **`AgentWorkforce`**, not "agentrelay". Org metadata lists blog `https://agentrelay.com`, email `hello@agentrelay.com`, X handle `agent_relay`, 83 public repos and 61 followers, and it was created 2025-12-29 (https://github.com/AgentWorkforce).

Repos that matter for a hack, as of 2026-10-29:

| Repo | Stars / forks | Lang | Last push | What it is |
|---|---|---|---|---|
| [relay](https://github.com/AgentWorkforce/relay) | **1,057** / 95 (1,059 on 2026-10-30 recheck) | Rust + TS (GitHub primary language: Rust) | 2026-10-29 | Monorepo: `agent-relay` CLI, Rust broker, `@agent-relay/sdk`, harness-driver, fleet, Swift SDK. Apache-2.0. Created 2025-12-17. |
| [relaycast](https://github.com/AgentWorkforce/relaycast) | 14 / 3 | TS | 2026-10-29 | "Headless Slack for agents": the messaging engine, `@relaycast/sdk`, `@relaycast/react`, MCP, A2A, Rust/Swift SDKs. Hosted at `cast.agentrelay.com`. Apache-2.0. |
| [relayfile](https://github.com/AgentWorkforce/relayfile) | 17 / 2 | Go | 2026-10-27 | Webhooks from GitHub, Linear, Slack and others exposed as a virtual filesystem |
| [flows](https://github.com/AgentWorkforce/flows) / [relayflows](https://github.com/AgentWorkforce/relayflows) | flows 4 / 2; relayflows 4 / 0 | TS | flows 2026-10-30; relayflows 2026-10-08 | Multi-step workflows defined in TypeScript |
| [skills](https://github.com/AgentWorkforce/skills) | 4 | TS | 2026-10-29 | Agent skills, including `using-agent-relay`, `messaging-agents-on-the-relay`, `choosing-swarm-patterns`, `writing-agent-relay-workflows`, `relay-connect` |
| [trajectories](https://github.com/AgentWorkforce/trajectories) | 33 | TS | 2026-10-27 | "Document layer for agent work" |

**[verified]** Stars are concentrated in `relay`. Every other repo has 33 stars or fewer, and most have 0 to 2. I could not get a star timeline because the stargazers endpoint returned HTTP 404 for this repo with my token.

## 2. Activity and release cadence (Aug-Oct 2026)

**[verified]** Commit counts on default branches (GitHub commits API):

| Repo | Since 2026-08-01 | Since 2026-09-29 (30 d) |
|---|---|---|
| relay | 651 (658 on recheck) | 324 (331 on recheck) |
| flows | 956 | 231 |
| relaycast | 409 | 202 |
| relayfile | 188 | 29 |
| skills | 186 | 122 |

**[verified]** Authors of the last 30 days of `relay` commits: `khaliqgant` 143, `kjgbot` 52, `agentrelaybot` 41, "Proactive Runtime Bot" 25, "Relayflow" 15, plus CI bots. All-time contributors: `khaliqgant` 2,273, `willwashburn` 1,032, `claude` 538, `actions-user` 356, `miyaontherelay` 89, `kjgbot` 43 (45 on recheck). A large share of the code and issues is written by agents ("Software factory change by @agent-relay-code[bot]" PRs appear in the v13.0.0 notes). Apart from bots and agents, only two humans are core committers. **[inference]** In practice the bus factor is about two people, and during the event you will be talking to the same people who write the code.

**[verified]** The release cadence is extreme, with three major versions in seven weeks:

- v12.0.0 on 2026-09-10, v13.0.0 on 2026-09-30, **v14.0.0 (GitHub "Latest") on 2026-10-13**, and about 40 tagged releases since 2026-08-27 (https://github.com/AgentWorkforce/relay/releases).
- "Agent Relay core 15.0.0" (`probe-v15.0.0`, a new `agent-relay-probe` binary that `relay init` downloads) was published on **2026-10-29** (07:44Z), followed by `probe-v15.0.1` at 2026-10-30 04:48Z. GitHub's "Latest" release is still v14.0.0.
- npm dist-tags on 2026-10-29: `agent-relay` and `@agent-relay/sdk` are `latest`=14.0.0 and `next`=**15.0.0-next.4** (already 15.0.0-next.5 on the 2026-10-30 recheck, which shows the pace). `@relaycast/sdk`, `relaycast` and `@relaycast/engine` are 12.2.1, republished 2026-10-29. `@relayflows/sdk` is 2.0.55.
- Major bumps mostly track broker and fleet changes. The release notes are auto-generated PR lists, with no migration guides.

**[inference]** v15 could plausibly reach `latest` on or near Oct 31. Pin exact versions.

**[verified]** npm downloads for 2026-09-29 to 2026-10-28: `@relaycast/sdk` 199,197; `@agent-relay/sdk` 164,979; `@agent-relay/harness-driver` 91,666; `agent-relay` 28,678; `@relayflows/sdk` 13,508. **[inference]** These numbers are probably inflated by the project's own CI, fleet nodes and release automation, so don't treat them as adoption.

**[verified]** CI on `main` at 2026-10-29 20:02Z was green except "Probe CI", which was failing (it also failed at 07:07Z). On the 2026-10-30 ~05:05Z recheck, Probe CI had passed (00:48Z) and every listed `main` workflow, including E2E Tests, Fleet E2E and Stress Tests, was green. Issue #1550 (open) says E2E Tests were "~25% flaky on main". GitHub Discussions and the wiki are disabled, so issues and Discord (`discord.gg/6E6CTxM8um`, linked from the README) are the support channels.

## 3. Issues: the bug surface

**[verified]** `relay` has **231 open and about 198 closed issues**, plus 64 open PRs (63 on recheck). `relaycast` has 29 open and 71 closed. Almost all open `relay` issues are filed by the team or its bots (`khaliqgant` 108, `willwashburn` 80, `kjgbot` 16, `miyaontherelay` 13). Only a handful come from outside users (`coygeek` 2, `nissrin2020ali-ux` 1, `prefrontalsys` 1). The tracker works as an internal engineering log, so it is unusually candid but says little about external adoption.

Most open issues concern the **fleet, broker and PTY layers**: spawning and supervising Claude, Codex and others on remote nodes. The messaging core is much quieter. These open issues from the last 90 days matter for a hack:

**Messaging and SDK**
- #1987 (2026-10-24, open): a DM sent with `sendMessage({to:'@x'})` returns `kind:'dm'`, but `messages.get(id)` returns `kind:'channel'` for the same message. **[verified, I reproduced it]** On SDK 14.0.0 with the local engine, readback of a DM gave `kind channel`.
- #1988 (closed 2026-10-27): the SDK docs promised that `workspace.register()` adopts an existing name and rotates its token. It actually **rejects an existing name in both default and strict mode**. relaycast #581 (open, 2026-10-26) adds that the self-hosted engine has no recover or rotate, so re-registering a name requires delete plus re-register, which changes the agent id and orphans that agent's DMs and read state.
- #1466 (2026-08-08, open): channel `@`-mentions reportedly stop at the first hyphen, so `@chief-khaliq` was delivered to `chief`. **[verified, partial]** I could not reproduce this on engine 12.2.1. With agents `witch` and `witch-hazel` both registered, `@witch-hazel` appeared only in `witch-hazel`'s inbox mentions. It may be specific to the hosted or MCP path, or already fixed.
- #1471 (open): `check_inbox` and `list_dms` fail with a raw SQL error once an agent has about 120 DM conversations, and the failure looks the same as an empty inbox.
- #1593 (open, 10 comments): agents stop receiving DM **injections** after 1h15m to 5h alive, while sends still report `recipientMatched: true` and `queued_unconfirmed`. This is the broker/PTY path, not plain SDK listeners.
- relaycast #283 (opened 2026-07-17, background, still open): `action.completed` fan-back to the caller is "ephemeral at-most-once", so if the caller's socket drops, it never learns that the action finished.
- relaycast #356 (open): idempotency is still missing on spawn, upload and create/append POSTs.

**Hosted service reliability**
- relaycast #476 (opened 2026-10-05, open) and #503 (opened 2026-10-10 about an incident on 2026-10-09, open): production relaycast returned slow responses, 500s and 429s, plus `database_overloaded` errors, from roughly 13:55 to 15:45Z on Oct 9. Correction: #503's title scopes this to "the relayfile inbound path", not plain message sends, and #476 is about "rising DB query failures" in `relaycast-cloud-api`. #476 was on "the day of Relay Connect GA". #503 calls it a "recurring" failure class. **[inference]** If 50+ hackers hit the same hosted engine at the same time, there is a real chance of degradation during your demo window.
- #1416 (open): a transient Relaycast DNS failure exits resident nodes fleet-wide.
- **[verified]** `GET https://cast.agentrelay.com/health` returned `{"ok":true,"version":"1.0.0",...}` on 2026-10-29.

**Spawning coding agents (CLI/broker), the riskiest layer**
- #1865: Codex agents fail with `database is locked` on the shared `~/.codex/logs_2.sqlite`. One Mac failed 5 times in a row.
- #1951: a new Codex spawn waits forever behind Codex's hook-trust modal while the broker reports `working`. Workaround: attach `--mode drive` and press `t`. #1824 reports the same class of problem for Devin's directory-trust prompt (closed).
- #1938 / #1890: the start of the `--task` brief gets cut off. #1890 (closed 10-10) covered silent truncation to the tail.
- #1949: spawning under an already-registered name reports "operation timed out" instead of a name conflict.
- #1927, #1935, #1554, #1510: spawn readiness reports `spawn_unconfirmed` or `spawn_failed` while the agent is in fact running. In #1554, spawns are dispatched twice.
- #1818: `install.sh` skipped the Linux x64 broker, leaving the CLI and broker on split versions.
- #1963 (closed 10-27): `agent-relay update` always ran `npm install -g`, even on standalone installs.
- #1986 (open): `agent-relay uninstall --dry-run` actually sends SIGTERM to the recorded broker PID.
- Security (open): #1570 / #1889 say workspace keys and agent tokens are passed as **plaintext argv** to spawned agents. #1460 says a live `rk_live_` key is written unmasked to fleet-node logs.

## 4. What the API actually looks like (verified locally)

There are **two TypeScript SDKs** with different shapes, which is a real source of confusion:

- `@relaycast/sdk` (v12.2.1) is the lower-level client: `RelayCast.createWorkspace(name)` gives an `apiKey`, `relay.agents.register()` gives a `token`, `relay.as(token)` acts as that agent, then `.send('#general', ...)` and `.subscribe(['general','@self'], cb)` (https://github.com/AgentWorkforce/relaycast#quick-start).
- `@agent-relay/sdk` (v14.0.0) is the higher-level client: `AgentRelay.createWorkspace({name, baseUrl})`, `relay.workspace.register({name,type})` returns a live agent client, `.sendMessage({to:'#ch'|'@handle'|['@a','@b']})`, `.reply`, `.react`, `relay.addListener(selector, handler)`, and Zod-typed **actions** that are auto-exposed as MCP tools (https://github.com/AgentWorkforce/relay/blob/main/packages/sdk/README.md).

Python: **[verified]** `agent-relay-sdk` 14.0.0 on PyPI, Python ≥3.10. Extras include `communicate`, `openai-agents`, `crewai`, `google-adk`, `agno` and `claude-sdk`. Wheels exist only for macOS and Linux. Windows fails with "no matching distribution found". The standalone CLI also has no Windows build; only the broker has `win32-x64`.

Hosted REST/WS: base URL `https://cast.agentrelay.com/v1`. Workspace keys look like `rk_live_*` and agent tokens like `at_live_*`, and both are **returned only once**. WebSockets take `?token=`, but note the token types: per the API doc, `GET /v1/ws` is a read-only **observer** stream that needs an `ot_live_*` token with `stream:read` ("Never a delivery path"), and `GET /v1/node/ws` needs an `nt_live_*` node token. The documented event vocabulary is `message.created`, `message.reacted`, `message.read`, `delivery.*`, `agent.status.*`, `action.*`, `node.*`, `file.uploaded`; it does **not** list `dm.received`, which surfaced at the SDK listener level in the smoke test below. If you build a browser UI on raw WebSockets instead of the SDK, check the DM event name yourself. The engine also serves an A2A gateway at `/.well-known/agent-card.json` and `/a2a/*` (https://agentrelay.com/docs/markdown/relaycast-api.md).

**Smoke test results [verified]** (`/tmp/arprobe`, engine started with `relaycast-engine --db ./r.db --port 8799`):
- `npm install @relaycast/engine @relaycast/sdk @agent-relay/sdk zod` took **29 s** (52 packages). The engine compiles the native `better-sqlite3` module, and the self-hosting doc says you need a C toolchain if that fails.
- The engine booted in under 1 s. `createWorkspace` took 55 to 61 ms. Channel messages reached a workspace-level listener about **25 ms** after send on localhost.
- **Gotcha:** the README's `relay.addListener('message.created', ...)` sees only channel messages. DMs arrive as a **separate `dm.received` event**, and group DMs as `group_dm.received`. Listen on `'*'` or on both.
- **Gotcha:** the README example reads `envelope.from.handle`. In my run the envelope was `{"from":{"id":"…","name":"caller"},"channel":{"name":"coven"}}`. There was no `handle`, so that expression is `undefined`. Use `envelope.from.name`.
- #1987 reproduced (DM readback `kind: 'channel'`).
- Inbox works: `agent.inbox()` returned `{unreadChannels, mentions, unreadDms, recentReactions}` with the correct mention.

## 5. Official examples and templates

**[verified]**
- `relay/examples/` contains a single file, `relay-node.ts`. It is a `defineNode` fleet config that spawns claude, codex or gemini, plus an `echo` action triggered by `onMessage({channel:'#general', match:/echo:/})`. It needs `agent-relay node up`, so this is the heavy broker path.
- `relay-cross-framework-demo` (last push 2026-03-15, background): LangGraph ↔ CrewAI through Relaycast, with an MCP server for Claude Desktop, a FastAPI server and `index.html`, using `agent-relay-sdk[communicate]`. It is the closest thing to a "web demo" template. It is seven months old and predates v12 to v14, so expect API drift.
- `relay-poc-*` (smart-home, shopping-assistant, health-dashboard, content-pipeline, code-review, tax-assistant): Python "Relay Communicate SDK" proofs of concept from March and April 2026, all at 0 stars. These are background material.
- Org showcase repos built by agent swarms: `tic-tac-toe` ("the original proof point"), `swarm-patterns`, `software-garden-demo` ("tended by agents", 2026-09-04), `relay-visualizer`, `relay-pulse` (Svelte message-flow animation), and `moltslack` (7 stars). These are useful as visual inspiration, but none is a starter kit.
- Agent skills in `AgentWorkforce/skills` (active, 122 commits in 30 days). Loading `using-agent-relay` or `messaging-agents-on-the-relay` into Claude Code or Codex is probably the fastest onboarding.
- Docs pivot: **[verified]** `llms.txt` now leads with the desktop app, Sessions, Relay Connect, "Forward deployed agents" and Flows. Correction: the SDK page `https://agentrelay.com/docs/typescript-sdk` returns **HTTP 307 to `/docs/7.1.1/typescript-sdk`**, a docs snapshot pinned to v7.1.1, seven majors behind the current 14.0.0. It is not linked from `llms.txt`. Treat it as stale and use the package README (`packages/sdk/README.md`) as the SDK reference. Every doc has a `.md` mirror, and `/llms-full.txt` bundles them all, which is handy to drop into an agent's context.

**Community projects:** **[verified, thin]** GitHub code search outside the org found only `machina-sports/sportsclaw` (`@agent-relay/sdk`), `hostinger/hostinger-templates` (`@relaycast/sdk`), and `beep-effect/beep-effect` and `Hugopeck/archeia` (which reference `agent-relay-broker`). Many unrelated repos named "agent-relay" (for example `mnemox-ai/AgentRelay` with 67 stars and `GumbyEnder/agent-relay` with 40) are **not** this product. Judges may confuse them too, so link the exact org. I could not verify any third-party showcase app of note.

## 6. Cross-sponsor hooks found in code

- **Terse Durable Actors [verified]:** relayfile's `docs/vendor-compatibility-matrix.md` (last changed 2026-10-04) defines a conformance target named "TerseAI durable-actors v0.7.9" and the script `test:conformance:terse`. It also says plainly that "The checked-in Terse target is a qualification contract, not an implemented or qualified adapter", because durable-actors at that revision has **no `setAlarm`/`getAlarm`/`deleteAlarm`**. The alarm PRs #147 to #151 were closed unmerged, and cron PR #111 was still open (https://github.com/AgentWorkforce/relayfile/blob/main/docs/vendor-compatibility-matrix.md). **[inference]** The two host teams have already looked at each other's stacks. An official Relay ↔ Durable Actors bridge does not exist, and that gap is the "bonus points for both" opening.
- **Relaycast hosted runs on Cloudflare Durable Objects [verified]:** the self-hosting doc's comparison table lists "Horizontal scaling / multi-region: Durable Objects + edge" for hosted. relaycast #139 is titled "Scaling to millions of agents: offload write-amplifiers to DO storage". The repo includes `wrangler.*.toml`.
- **Freestyle [verified]:** `relay/packages/cloud/src/fleet-sandbox.ts` lists `'freestyle'` as a fleet sandbox provider alongside daytona, e2b, vercel, agent37 and microsandbox (last changed 2026-10-13).
- **Supabase [verified]:** `relayfile-providers/packages/supabase` exists (provider, tokens, webhook).
- **Mastra:** the only match is a mention in a relayfile integration spec. I found no Mastra adapter.
- **OpenAI:** the Python SDK has an `openai-agents` extra.

## 7. Limits / could not verify

- Star history and growth rate: the stargazers API returned 404.
- Hosted free-tier quotas and rate limits for `cast.agentrelay.com`: the API doc mentions 429s but I found no numbers. I did not create a workspace on hosted prod.
- Whether #1466 (hyphen mentions) still affects the hosted engine: it did not reproduce on self-hosted 12.2.1.
- Python SDK behaviour: I did not run it.
- Whether v15 will be `latest` on Oct 31.
- Real external adoption: npm counts are likely self-inflated, and code search is sparse.
- I ran nothing on the broker/fleet/PTY path. Those findings are **[reported]** from issues.

---

## Hackathon implications

**What to build (code-reality view)**
1. Build on the **messaging core (Relaycast through `@agent-relay/sdk` or `@relaycast/sdk`)**, not on fleet spawning of Claude or Codex. Messaging is the quiet, stable part, and it worked first try for me in under 2 minutes. Fleet, broker and PTY is where most of the 231 open issues live: silent spawn failures, truncated briefs, trust modals and DB locks.
2. Make agent-to-agent traffic **visible**. The engine streams `message.created`, `dm.received`, `thread.reply`, `message.reacted` and `action.*` over WebSocket, and `@relaycast/react` exists. A live Halloween "séance room" UI showing agents DMing, threading and reacting in real time is cheap to build and demos well. The Relay team's own showcases (`relay-pulse`, `relay-visualizer`, `swarm-patterns`) are all visualizations.
3. Use **Zod actions** (`registerAction`), which become MCP tools automatically. That gives agent ↔ tool-call handoff with audit events, and it shows depth beyond "chat between bots".
4. For both tracks, give each agent a Terse Durable Actor that holds its state, memory or game state, with Relay as the transport between actors. Neither team ships this bridge (relayfile's Terse target is unimplemented), so it is novel. Remember that Terse has no alarms, which makes Relay messages a natural trigger for wake-ups.

**Gotchas to plan around**
- **Name collisions on restart:** `workspace.register({name})` fails if the name exists (#1988, relaycast #581). Hot-reloading dev servers will crash on their second boot. Persist `at_live_` tokens and call `workspace.reconnect({apiToken})`, or append a run suffix to names.
- **Stale SDK docs:** `agentrelay.com/docs/typescript-sdk` redirects to a v7.1.1 snapshot. Point your coding agent at `packages/sdk/README.md` in the relay repo and at `llms-full.txt`, not at that page, or it will write code against an API from seven majors ago.
- **Keys are shown once:** save `relay.workspaceKey` and every agent token the moment you create them.
- **DMs are a different event:** listen on `'*'` or on `dm.received` and `group_dm.received`, not only `message.created`. Read `envelope.from.name`, not `.handle`. Don't branch on `messages.get().kind` (#1987).
- **Hosted overload risk:** prod returned `database_overloaded` and 429s on Oct 5 and Oct 9. Have the **local engine fallback** ready: `npx @relaycast/engine --db ./relay.db --port 8787`, then pass `baseUrl: 'http://localhost:8787'`. It is single-process with in-memory idempotency and sequences, which is fine for a demo.
- **Version churn:** pin `@agent-relay/sdk@14.0.0`, `@relaycast/sdk@12.2.1`, `@relaycast/engine@12.2.1`. Avoid `@next` (15.0.0-next.x), and don't run `agent-relay update` mid-hack.
- **Windows teammates:** there is no Python wheel and no standalone CLI for Windows. Use WSL or have a Mac/Linux teammate run it.
- **Avoid hyphenated agent names** in `@`-mentions until #1466 is confirmed fixed on hosted. Names like `ghost`, `witch` and `vampire` are safe.
- If you do spawn Codex through the broker, expect `database is locked` (#1865) and the hook-trust modal (#1951). Claude spawns had fewer reports.
- Don't let thousands of DM conversations accumulate on one coordinator agent (#1471), and don't rely on `action.completed` reaching a caller that disconnected (relaycast #283).

**Setup to do before Oct 31**
- `npm i @agent-relay/sdk@14.0.0 @relaycast/engine@12.2.1 zod` in a scratch repo. Confirm `better-sqlite3` compiles (it needs Xcode CLT) and that the local engine boots. Venue Wi-Fi plus a 29 s install is a bad combination, so cache it.
- Clone `AgentWorkforce/skills` and load `using-agent-relay` and `messaging-agents-on-the-relay` into your coding agent. Save `https://agentrelay.com/llms-full.txt` locally.
- Pre-write a 30-line "two agents talk" script (section 4 pattern) and a fallback flag that switches `baseUrl` between hosted and local.
- Optionally run `relay init` once to see the desktop/CLI path, but keep the demo independent of it.
- Join their Discord. With Discussions disabled, that is where you can reach the people who write the code during the event.

**What judges and sponsors likely want [inference]**
- Agents "collaborating directly" with no human copy/paste, which is the event-page pitch. Show agents choosing whom to message, using threads and reactions, and handing off typed actions.
- Real-time visibility of agent-to-agent traffic. That fits the event's "Real-Time AI" theme and the Relay team's own taste in demos.
- Use of both host products. A credible Relay ↔ Durable Actors integration fills a gap both teams have already scoped in code.

## Sources

- https://github.com/AgentWorkforce (org metadata, repo list)
- https://github.com/AgentWorkforce/relay (README, contributors, releases v12.0.0 to v14.0.0, probe-v15.0.0)
- https://github.com/AgentWorkforce/relay/blob/main/packages/sdk/README.md
- https://github.com/AgentWorkforce/relay/blob/main/docs/self-hosting/README.md
- https://github.com/AgentWorkforce/relay/blob/main/examples/relay-node.ts
- https://github.com/AgentWorkforce/relay/blob/main/packages/cloud/src/fleet-sandbox.ts
- relay issues: https://github.com/AgentWorkforce/relay/issues/1987 , /1986 , /1988 , /1466 , /1471 , /1593 , /1865 , /1951 , /1938 , /1949 , /1927 , /1554 , /1818 , /1963 , /1570 , /1889 , /1460 , /1416 , /1550
- https://github.com/AgentWorkforce/relaycast (README, docs/self-hosting.md "Limitations" section)
- relaycast issues: https://github.com/AgentWorkforce/relaycast/issues/581 , /535 , /503 , /476 , /356 , /283 , /139
- https://github.com/AgentWorkforce/relayfile/blob/main/docs/vendor-compatibility-matrix.md
- https://github.com/AgentWorkforce/skills
- https://github.com/AgentWorkforce/relay-cross-framework-demo
- https://agentrelay.com/llms.txt ; https://agentrelay.com/docs/markdown/relaycast-api.md
- https://cast.agentrelay.com/health
- https://agentrelay.com/docs/typescript-sdk (307 to /docs/7.1.1/typescript-sdk, checked 2026-10-30)
- https://github.com/AgentWorkforce/relay/actions (workflow runs on `main`)
- https://www.npmjs.com/package/@agent-relay/sdk ; https://www.npmjs.com/package/@relaycast/sdk ; https://www.npmjs.com/package/@relaycast/engine ; npm downloads API (api.npmjs.org/downloads/point/last-month/…)
- https://pypi.org/project/agent-relay-sdk/
- Local smoke test: `/tmp/arprobe/probe.mjs`, `/tmp/arprobe/probe2.mjs` (run 2026-10-29)

## Verification log (2026-10-29)

Adversarial re-check run late on 2026-10-29 PT (API timestamps read 2026-10-30 ~05:00-05:50Z) with `gh api`, `npm view`, the npm downloads API, PyPI JSON, `curl`, and a re-run of the local smoke-test scripts against fresh `@relaycast/engine@12.2.1` databases.

| # | Claim | Outcome |
|---|---|---|
| 1 | Org `AgentWorkforce`: blog, email, X `agent_relay`, 83 repos, 61 followers, created 2025-12-29 | **Confirmed** exactly. |
| 2 | Repo table stars/forks/push dates | **Mostly confirmed.** relay 1,059 stars now (was 1,057, Apache-2.0, created 2025-12-17). relaycast 14/3, relayfile 17/2, skills 4, trajectories 33 confirmed. **Corrected:** flows has 2 forks and relayflows has 0 (not "4 / 4"), and relayflows was last pushed 2026-10-08. |
| 3 | v12.0.0 on 09-10, v13.0.0 on 09-30, v14.0.0 "Latest" on 10-13, about 40 releases since 08-27, probe-v15.0.0 on 10-29 | **Confirmed** (41 releases since 08-27 including probe-v15.0.1). **Added:** probe-v15.0.1 published 2026-10-30 04:48Z. |
| 4 | npm dist-tags (`latest` 14.0.0, `next` 15.0.0-next.4; relaycast 12.2.1; relayflows 2.0.55) | **Confirmed, with drift:** `next` is now 15.0.0-next.5. |
| 5 | npm 30-day downloads (199,197 / 164,979 / 91,666 / 28,678 / 13,508) | **Confirmed** exactly for 2026-09-29 to 2026-10-28. The "self-inflated" reading stays **[inference]**. |
| 6 | Commit counts and contributor counts | **Confirmed** for flows, relaycast, relayfile and skills. relay drifted upward (658 / 331). Contributor totals match apart from kjgbot (45). |
| 7 | Issue counts: relay 231 open / 198 closed / 64 open PRs; relaycast 29 / 71 | **Confirmed** (63 open PRs now). |
| 8 | Cited issue states, dates and titles (#1987, #1988, #1466, #1471, #1593, #1550, #1865, #1951, #1986, #1570, #1889, #1460, #1416, #1963, #1890, #1824; relaycast #581, #356, #139) | **Confirmed.** #1987 and #1988 were filed by external user `coygeek`. #1593 has 10 comments. #1550's title says "~25% flaky on main (4 of last 15 pushes)". |
| 9 | relaycast #503 dated 2026-10-09, `database_overloaded` "on sends" | **Corrected:** opened 2026-10-10 about the Oct 9 incident, and the title scopes it to "the relayfile inbound path". #283 is from 2026-07-17 (background) and is now labelled as such. |
| 10 | CI: only Probe CI failing | **True at 20:02Z, now outdated.** Probe CI passed at 00:48Z on Oct 30, and all `main` workflows were green on recheck. |
| 11 | `docs/typescript-sdk` returns HTTP 200 | **Refuted:** it returns 307 to `/docs/7.1.1/typescript-sdk`, a v7.1.1 snapshot. A gotcha was added. |
| 12 | Hosted API: `rk_live_` / `at_live_` returned once, WS `?token=`, A2A at `/.well-known/agent-card.json` | **Confirmed** in `relaycast-api.md`. **Added nuance:** `/v1/ws` is an observer stream (`ot_live_*`), and `dm.received` is not in the documented event vocabulary. |
| 13 | `cast.agentrelay.com/health` → `{"ok":true,"version":"1.0.0"}` | **Confirmed** (build `53007fe…`). The local engine reports `version 0.1.0`. |
| 14 | PyPI `agent-relay-sdk` 14.0.0, Python ≥3.10, extras, macOS/Linux wheels only | **Confirmed.** There are 4 wheels (macOS x86_64 and arm64, manylinux x86_64 and aarch64) and no Windows wheel or sdist. Extras also include `dev` and `node`. |
| 15 | Smoke-test gotchas: DMs arrive as `dm.received`; `envelope.from` has `name` not `handle`; #1987 DM readback `kind: channel`; `@witch-hazel` not truncated; duplicate `register()` rejected | **All reproduced** on a fresh DB: the DM came as `dm.received`, the envelope was `{"from":{"id":…,"name":"caller"},…}`, readback gave `kind channel`, only `witch-hazel` got the mention, and a second `register({name:'ghost'})` threw `Agent "ghost" already exists in this workspace`. The SDK README does use `envelope.from.handle` (line 159) and `addListener('message.created', …)`. |
| 16 | relayfile Terse matrix: v0.7.9 target, no alarm API, PRs #147-#151 closed unmerged, cron #111 open, last change 2026-10-04 | **Confirmed** verbatim. The doc also points to `relayfile-cloud#275` (private repo, not checked) for implementation. |
| 17 | `fleet-sandbox.ts` lists `freestyle` among providers | **Confirmed** (`daytona`, `e2b`, `vercel`, `freestyle`, `agent37`, `microsandbox`). |
| 18 | Self-hosting doc: C toolchain, in-memory idempotency, "Durable Objects + edge" for hosted | **Confirmed** in relaycast `docs/self-hosting.md`. `relay/docs/self-hosting/README.md` also exists. |
| 19 | Discord `discord.gg/6E6CTxM8um` in README; Discussions disabled | **Confirmed.** Correction: the wiki is disabled on `relay` but enabled (flag only) on relaycast, relayfile, skills and others. |
| 20 | Look-alike repos `mnemox-ai/AgentRelay` 67 stars, `GumbyEnder/agent-relay` 40 | **Confirmed.** `relay-cross-framework-demo` last pushed 2026-03-15 with 0 stars, confirmed. |
| 21 | Prize framing (Agent Relay track → Mac mini; bonus for both) | **Confirmed** against `EVENT_PAGE.md`. |

Not re-verified: the 29 s install time and 25 ms latency figures (environment-specific), the community code-search hits in section 5, and every [reported] broker/fleet/PTY behaviour.

