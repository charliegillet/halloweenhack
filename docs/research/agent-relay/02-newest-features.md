# Agent Relay: newest features (Aug-Oct 2026)

> Research date: 2026-10-29 (event is Sat 2026-10-31). Angle: changelog, releases, blog posts, and launches from Aug 1 to Oct 29 2026, sorted into GA, prerelease/beta, and announced-only, plus which features Agent Relay most wants to see demoed.
> Method: `gh api` against the `AgentWorkforce` GitHub org (release list, `CHANGELOG.md` in `relay` and `relaycast`, commit log of the `agentrelay.com` site repo, docs MDX sources), `npm view` for package versions and dist-tags, Exa fetch for the blog, YC company and launch pages, and an X mirror. No Firecrawl credits used.
> Convention: **Fact** means read directly from the cited source. **Inference** is labeled as such. Items before Aug 2026 are marked *background*.

---

## 1. TL;DR

- **The big news is the public launch on Oct 23 2026.** It went out as a Launch YC post and a Will Washburn X post (the teapaw X mirror shows 96,474 views and Launch Archive shows 96.5k, both third-party, re-read 2026-10-29). The launch pitch is narrow: "Let your teams' coding agents message each other", meaning Claude Code, Codex, Cursor and Conductor talking directly, plus shared, searchable session history. [YC launch](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other), [Launch Archive](https://launcharchive.ai/companies/agent-relay)
- **The product shape changed in October.** The docs were rewritten "around sessions" (commit authored 2026-10-21, merged to main via PR #243 on 2026-10-26). They now name four surfaces: **Sessions** ("Sessions are the product"), **Forward deployed agents** (public `arelay.to/<handle>` addresses), **Flows** (triggered, checked scripts), and **For agents** (setup that the agent performs). The old SDK-first docs survive only as a versioned `v7.1.1` archive. [docs/introduction](https://agentrelay.com/docs/introduction)
- **They ship at a very high rate.** `AgentWorkforce/relay` published 68 tagged releases between v11.4.0 (Aug 2) and v14.0.0 (Oct 13) inclusive, three of them majors (12, 13, 14). The `next` tag on npm is `15.0.0-next.5` (it was `-next.4` earlier on Oct 29, so it is moving daily). Relaycast, the messaging engine, went from 8.16.0 (Oct 1) to 12.2.1 (Oct 29) in October alone. Expect breaking changes. Pin versions on Friday.
- **Feature most relevant to the hackathon:** a sponsor tie-in landed the night before the event. On **2026-10-29** the site gained a "Freestyle agent hosting guide" (commit #251). It is a new section, "Run the answering agent on a Freestyle VM", inside the existing `/docs/forward-deployed-agents` page (not a standalone page). It explains how to run an always-on Relay agent on a Freestyle VM. Freestyle is a sponsor of this event.

---

## 2. Dated timeline, Aug 1 to Oct 29 2026

| Date | What | Type | Source |
|---|---|---|---|
| Aug 5 | Blog: "Trusting an agent you didn't spawn" (Ratify Protocol phase 1: delegated-authority permission slips, six scenarios, four of them adversarial) | Blog / research demo | [blog](https://agentrelay.com/blog/trusting-an-agent-you-didnt-spawn) |
| Aug 10-11 | v11.5.x: commit `Session-Id:` git trailers, cross-node `agent attach` (Daytona and physical nodes), default-on "obligation/boomerang" DM re-injection (`@@c2a-obligation@@`) | Release | [CHANGELOG](https://github.com/AgentWorkforce/relay/blob/main/CHANGELOG.md) |
| Aug 13 | v11.6.0: new `@agent-relay/session` package (cross-harness session continuity, native Claude resume); Swift SDK fleet terminal sessions | Release | CHANGELOG; npm `@agent-relay/session` created 2026-08-13 |
| Aug 17-18 | v11.7.x: `fleet agent list`, `node agent list --status` (pending queue, "stuck" flag), `relay session replay <id>` | Release | CHANGELOG |
| Aug 20 | v11.8.1: **`fleet spawn <cli> --sandbox`** (one-command agent in a fresh Cloud Daytona sandbox with Relayfile mounted at `/workspace`); **`agent-relay observer`** scoped read-only follow-along URLs plus a `get_observer_url` MCP tool | Release | CHANGELOG |
| Aug 21 | Site: new Observer docs page; docs mitigation for "Agent Relay 11.3.0 credential output" | Docs / security | site commits #44, #38 |
| Aug 25 | Blog: "Someone else's agent, in your repo". Ratify phase 2 run live between two companies: a signed revocation was sent as an ordinary Relay DM and blocked the foreign agent "within seconds" | Blog / demo | [blog](https://agentrelay.com/blog/someone-elses-agent-in-your-repo), repo [`ratify-agent-relay-evidence`](https://github.com/AgentWorkforce/ratify-agent-relay-evidence) |
| Aug 27 | v11.8.5 (**breaking**): SDK `placement.spawn` fails fast by default; `sandboxOnly` placement | Release | CHANGELOG |
| Sep 1-2 | v11.9.0 / v11.10.0: `--sandbox-provider daytona\|e2b`; scoped Relayfile mounts | Release | CHANGELOG |
| Sep 6 | `@relayflows/sdk` and `@relayflows/surface` (Flows v2 authoring) first published to npm | Package | npm |
| Sep 10 | v12.0.0: `integration subscribe --to @agent --spawn <cli>`, which wakes or spawns an agent on GitHub events | Release (major) | CHANGELOG |
| Sep 12 | Blog: "Promptgramming" (CTO Khaliq Gant). Pitches `@relayflows/surface` `flow()` scripts with multi-harness agents and filesystem `.gate()` checks, using a "software-factory" example | Blog | [blog](https://agentrelay.com/blog/promptgramming) |
| Sep 12 | v12.1.0: `node up --local-only`, a degraded mode that keeps working through Relaycast outages | Release | CHANGELOG |
| Sep 15-22 | Flows onboarding on the site: Teams landing page, software-factory onboarding, GitLab/Linear/Shortcut sources, versioned flow catalog (Sep 20), `f.human` human gates documented as shipped (Sep 18) | Site / docs | site commits #71, #78, #99, #110 |
| Sep 18 | @agent_relay on X: "Proud to announce we're in the Fall batch of Y Combinator... Try flows today: agentrelay.com/flows" | Announcement | [X mirror](https://teapaw.org/agent_relay) |
| Sep 18 | v12.2.4: one binary: `agent-relay file\|flows\|sessions` mounts the Relayfile, Relayflows and Relayhistory CLIs; `reflex` removed | Release | CHANGELOG |
| Sep 20 | v12.4.0: first-class **Muse CLI** and **Devin CLI** spawning; `fleet nodes --pretty` | Release | CHANGELOG |
| Sep 22 | v12.4.1: **Shared Sessions plugin** and `agent-relay mcp --sessions-only` (search teammates' session history over MCP) | Release | CHANGELOG |
| Sep 30 | v13.0.0: per-agent `model` in `teams.json`; durable existing-session delivery ("Cloud Babysitter") | Release (major) | CHANGELOG |
| Oct 2-4 | `@agent-relay/connect` published (Oct 2); **Relay Connect** public guide (Oct 4): temporary rooms, guest needs no account, 8 participants, 60-minute default expiry | Feature / docs | npm; [docs/relay-connect](https://agentrelay.com/docs/relay-connect) |
| Oct 7-8 | **arelay.to**: "chat-with-our-agent" front door, `/u/<handle>` pages, verified-agent directory (`agentrelay.com/directory`), owner analytics dashboard, account verification on `/agents/register` | Feature | site commits #145, #150, #152, #164, #169, #170 |
| Oct 10 | v13.3.0: **file attachments** (screenshots, up to 25 MiB) over DMs and channels in the CLI, MCP and SDK (`files.upload/get/download`); `--task-file` | Release | CHANGELOG |
| Oct 11 | v13.4.0: PTY delivery evidence (`delivery_unconfirmed`, `delivery_resubmitted`); `integration subscribe --to self` | Release | CHANGELOG |
| Oct 13 | **v14.0.0, the current `latest` on npm**: sandbox spawns start from a git checkout without waiting on Relayfile; `fleet relayfile attach` | Release (major) | [release](https://github.com/AgentWorkforce/relay/releases/tag/v14.0.0) |
| Oct 13-15 | Homepage rebuilt around "Let Claude Code talk to Codex" and Desktop session search; marketing waitlists replaced with direct sign-in; enterprise trust page | Site | site commits Oct 13-15 |
| Oct 16-18 | Relaycast 10.6.0: **`connect` plan** (10 agents, 1,200 req/min) and **workspace-key rotation**; site serves an OpenAI Apps domain challenge (commit #230) | Engine / plan | [relaycast CHANGELOG](https://github.com/AgentWorkforce/relaycast/blob/main/CHANGELOG.md) |
| Oct 21 (merged Oct 26) | Docs rewritten around Sessions (PR #243 `docs/sessions-first`) | Docs | site commits |
| Oct 23 | **Public launch** (Launch YC and X) | Launch | YC launch, Launch Archive |
| Oct 24 | Skills repo: "host-aware Relay plugin setup with bundled Desktop bootstrap" (ChatGPT/Codex plugin) | Plugin | skills commit #188 |
| Oct 26-27 | Microsoft sign-in; `/download` page; `/open-source` repo catalog | Site | site commits #238, #241, #246, #216 |
| Oct 27 | Relaycast 11.1.0: **`trial` plan for hosted *anonymous* workspaces = 100 messages, one time, never resets**; standalone `relaycast-engine` binaries (no Node needed). Relaycast 12.0.0: the engine itself drops plans and quotas, so self-hosted is unlimited (30k req/min default ceiling) | Engine | relaycast CHANGELOG |
| Oct 28 | @agent_relay: "We just launched and are already shipping updates to our desktop app" | Announcement | [X mirror](https://teapaw.org/agent_relay) |
| Oct 28-29 | Relaycast 12.1-12.2.1: SDK `agent.on.*` handlers can be registered before `connect()`; presence leases; DM unread fixes | Engine | relaycast CHANGELOG |
| Oct 29 | `probe-v15.0.0` "Agent Relay core" binary release (07:44 UTC); site: **Freestyle agent hosting guide** (#251, a section of forward-deployed-agents); `/mcp` OAuth routing to Cloud (#250) | Release / docs | [releases](https://github.com/AgentWorkforce/relay/releases), site commits |
| Oct 29 PT (Oct 30 04:48 UTC) | `probe-v15.0.1` core binary; npm `next` advanced to `15.0.0-next.5` | Release | releases, `npm view agent-relay dist-tags` |

*Background (pre-Aug):* "Introducing Agent Relay" SDK post (Feb 27), Relayfile post (May 13), "Six Workflow Patterns" (Jun 3). Releases v8 through v11.3 ran Jun-Jul.

---

## 3. GA vs prerelease vs announced-only

### GA (in stable `latest` 14.0.0 and/or live on hosted Cloud)
**Fact** for each item: it appears in a stable release changelog or in current docs presented as shipped.
- **Desktop app and Sessions.** macOS/Linux/Windows builds with SHA-256 files. Windows builds are unsigned, so expect a SmartScreen prompt. Per-session "Receives messages" toggle; addresses look like `name@machine`. Messages arrive "when that agent is between turns." [quickstart](https://agentrelay.com/docs/quickstart), [download](https://agentrelay.com/download)
- **Messaging primitives.** Channels, threads, DMs, group DMs, reactions, search, realtime WebSocket, and file attachments (Oct 10). All of it sits on the Relaycast REST/WS API at `https://cast.agentrelay.com/v1` with `rk_live_` workspace keys, `at_live_` agent tokens and `ot_live_` observer tokens, plus `Idempotency-Key` support. [relaycast-api](https://agentrelay.com/docs/relaycast-api)
- **Relay Connect.** Ad-hoc cross-company rooms. The host needs a Cloud sign-in; guests do not. [relay-connect](https://agentrelay.com/docs/relay-connect)
- **Forward deployed agents / arelay.to handles.** A public agent address with knock/allow access control and domain-proof registration. [forward-deployed-agents](https://agentrelay.com/docs/forward-deployed-agents)
- **Observer tokens.** Read-only live follow-along URLs (Aug 20).
- **Fleet / sandbox spawn.** `fleet spawn <cli> --sandbox` on Daytona, E2B or Agent37. Harnesses: Claude, Codex, OpenCode, Cursor, Gemini, Grok, Muse, Devin and others.
- **Flows (Relayflows v2).** `@relayflows/sdk` 2.0.55 (Oct 26). Catalog at agentrelay.com/flows ("Software Garden" is the default first flow). `f.human` human gates. Hosted GitHub listeners. **Inference:** the version churn (2.0.14 to 2.0.55 in about six weeks) suggests the API is still moving.
- **Shared Sessions MCP** (`--sessions-only`) and `@agent-relay/session` replay.

### Prerelease (npm `next` = `15.0.0-next.5` as of late Oct 29, the "[Unreleased - Major]" changelog section)
- **`relay init` with no account.** It starts a private local Relaycast server so that "two agents communicate without an account." `--hosted` prints a join command for other machines. It is a guided TUI that wires the MCP server into Claude Code, Codex, OpenCode, Grok CLI, Pi and Devin.
- **Push delivery into running sessions.** The `agent-relay-probe` core injects messages through Claude Code's session inbox and SessionStart hook, Codex hooks, the OpenCode plugin, and similar paths, instead of agents polling an MCP inbox.
- **Python workflows and the `agent-relay-sdk` Python package are removed.** SDKs are TypeScript and Swift only. Relaycast also stopped publishing its Python SDK (12.0.0, Oct 27).
- Source: [CHANGELOG](https://github.com/AgentWorkforce/relay/blob/main/CHANGELOG.md), `npm view agent-relay dist-tags`.

### Announced-only, demo, or not publicly listed
- **"Agent Relay in ChatGPT" plugin.** OAuth hosted MCP at `agentrelay.com/cloud/api/v1/mcp/relay-events`. Its own README says: "The package's presence in this repository is not a published directory listing." It can be tried privately as a custom MCP server. [skills/plugins/chatgpt](https://github.com/AgentWorkforce/skills/tree/main/plugins/chatgpt)
- **Ratify Protocol delegated-authority integration.** Two blog posts and an evidence repo exist, but it is not a shipped Relay feature.
- **Freestyle VM hosting.** A docs guide (Oct 29) that describes a pattern; there is no packaged integration.
- **Pricing.** `agentrelay.com/pricing` returned not-found. Plan names (`trial`, `free`, `connect`, `pro`) appear only in the Relaycast changelog. Hosted is described as "free to start" with no credit card.

---

## 4. What Agent Relay most wants showcased (inference, ranked)

Evidence used: launch copy, homepage, docs ordering, and the event page.

1. **Cross-harness, cross-person agent-to-agent messaging.** The homepage hero is "Let Claude Code talk to Codex"; the og-card was changed to "Real-time agent to agent messaging" (Oct 15). The launch examples are a frontend agent querying a backend agent and two agents resolving a merge conflict. A demo showing two *different* model vendors negotiating live hits the core pitch. With OpenAI as sponsor and $100 of credits each, Codex/GPT plus a second harness is natural.
2. **Sessions as shared memory.** "Sessions are the product" (docs intro). A demo where one agent reads another agent's transcript to pick up its work.
3. **Agents across machines and organizations.** Forward deployed agents (`arelay.to`), Relay Connect, and Ratify-style revocation by DM. The trust and permission story is their favorite blog topic (two of three posts since August).
4. **Flows and the "software factory".** The event page asks for a "Software Factory, long-running agent, multiplayer AI system." The Promptgramming post's first code sample is a `social-post-pipeline` flow, and it follows with a literal `flow("software-factory", ...)` example, and fleet spawn and Software Garden are the long-running pieces.
5. **Observability of agent chatter.** Observer URLs give judges a live view of the agents talking, which suits a short live demo. (The event page does not state a demo length; any "4-minute" figure is unverified.)

---

## 5. Hackathon implications

**What to build (concrete):**
- Build a "haunted" multiplayer or real-time system where agents on different harnesses or machines coordinate over Relaycast channels and DMs. Put the conversation on screen with an observer URL. For the bonus, give each agent's state a home in a Terse Durable Actor. For example, each actor is a ghost or NPC that holds state and talks to the others through Relay.
- Or build a small software-factory flow: a `@relayflows/surface` `flow()` with a Claude planner, a Codex implementer and a filesystem `.gate()`, triggered by a GitHub PR. Show the gate failing and then passing.
- To touch the Freestyle sponsor as well, host an always-on answering agent on a Freestyle VM (the Oct 29 guide) behind an `arelay.to` handle that judges' agents can message.

**Gotchas:**
- **The anonymous hosted workspace allows only 100 messages, ever** (Relaycast 11.1.0, Oct 27). A chatty multi-agent demo will burn through that in minutes. Sign in first so the workspace gets a normal plan, or self-host `relaycast-engine` (standalone binary, no quotas since 12.0.0). **Could not verify:** whether `RelayCast.createWorkspace()` without sign-in lands on `trial`. Test it Friday. When the cap is hit, the API returns `plan_limit_exceeded` carrying `metric`, `plan`, `limit`, `usage` and, where available, `upgrade_url` / `upgrade_action` (`sign_in` or `upgrade`) (Relaycast 11.1.0). Handle that error in your demo code so a quota hit shows a clear message instead of agents going silent. For multi-person rooms, the `connect` plan is 10 agents, 100k messages/month, 1,200 req/min, and 10M API calls/month after 10.6.2 (Oct 18).
- **Pin versions.** Stable is 14.0.0. Do not pull `@next` (15.x, currently `15.0.0-next.5`) unless you want account-less `relay init`, which is still unreleased. Majors arrive every 2-3 weeks, and v11.8.5 and v13.0.0 changed defaults (`failFast`, readiness timeouts).
- **No Python SDK.** Use TypeScript (or Swift, or raw REST).
- **PTY injection limits.** Tasks are capped at 14 KiB (16 KiB with the envelope). Pass a file pointer for anything larger. A message arrives only "between turns," so a busy agent replies late.
- **Registration is create-only (SDK).** `workspace.register()` on an existing name fails with `name_conflict` and keeps the old token; resume with `workspace.reconnect({ apiToken })`. Save `at_live_` tokens. Note: the "[Unreleased - Major]" section changes the *CLI* so that `relay agent rotate <name>` and `agent register` on an existing name issue a new token via owner takeover; on stable 14.0.0, assume the old fail-on-conflict behavior.
- **Windows desktop builds are unsigned.** Demo on macOS or Linux.
- **The Freestyle guide warns** that you must use `freestyle@latest` (the `/v5` API, since `/v1` returns 401). It also says to delete `machine-id` and node-token state before snapshotting, or clones fail with `provider_instance_conflict`.

**Setup to do before Oct 31:**
1. Install the CLI: `curl -fsSL https://raw.githubusercontent.com/AgentWorkforce/relay/main/install.sh | bash`, then confirm `agent-relay --version` shows 14.0.0.
2. Install the desktop app, sign in with Google or Microsoft, and confirm two sessions can DM each other.
3. `npm i @relaycast/sdk@12.2.1` (or `@agent-relay/sdk@14.0.0`). Run the README quick start: `RelayCast.createWorkspace` → `agents.register` → `as(token)` → `subscribe` → `send`/`dm`.
4. Mint an observer token (`agent-relay observer`) and check that the URL renders.
5. Optional: put a Freestyle VM snapshot together with the Relay client, and try `fleet spawn codex --sandbox`. That needs Cloud.

**What the judges and sponsor want (inference):** agents talking to agents *directly*, with no human relaying messages, preferably across vendors and machines, with a visible transcript. Adding Durable Actors earns the stated bonus. The Mac mini prize itself matches the homepage line "a Mac mini across the world."

---

### Added on re-verification (2026-10-29)
- **Launch copy says the hosted cloud is free to try.** Will Washburn's Oct 23 post: "Open source. Free to try our cloud." The YC launch also says you can self-host or use the hosted cloud. Pair this with the 100-message anonymous cap above: free means *signed-in* free, not anonymous. [X mirror](https://teapaw.org/agent_relay), [YC launch](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other)
- **The launch pitch is "Don't be a meat proxy."** The YC launch's closing line is "Don't be a meat proxy. Get your agents on the relay." The founders also say they "run 50+ agents in parallel ourselves". A demo where no human passes messages between agents matches that framing exactly.
- **The unreleased `relay init` also bundles push delivery into Codex's sandbox.** Codex sessions set up by `relay init` answer relayed messages inside Codex's default sandbox with no approval prompt (a rules file allows only the core's socket client). This matters if your demo uses Codex: on stable 14.0.0, expect MCP-inbox polling, not injection. [CHANGELOG, Unreleased](https://github.com/AgentWorkforce/relay/blob/main/CHANGELOG.md)
- *Background, Supabase link:* on Apr 29 2026 @agent_relay celebrated being listed in the OSSCAR index (Commit VC with Supabase) of fastest-growing open-source projects in Q1 2026. That is a small hook if you pitch for the Supabase "scale to millions" prize. [X mirror](https://teapaw.org/agent_relay)

## 6. Limits / could not verify

- I found no public changelog or blog page for the desktop app. "Shipping updates to our desktop app" (Oct 28 tweet) has no version notes; the last pin I saw was "desktop 1.1.10" (site commit, Oct 10).
- `agentrelay.com/pricing` and `/changelog` returned not-found. I found no formal pricing or plan-limit page beyond the Relaycast changelog.
- GitHub code search hit rate limits, so I could not check whether Agent Relay published hackathon-specific starters or a Terse integration. No such repo appears in the org repo list as of Oct 29.
- The launch tweet's 96.4k views come from a third-party mirror (Launch Archive), not from X directly. The X mirror (teapaw.org) is unofficial.
- `relay` stars: 1,059 (GitHub API, re-read late Oct 29; an earlier read the same day gave 1,057); the homepage badge shows "1.1k".
- I found no launch week, discount, or hackathon-specific announcement from Agent Relay for Haunted Hacks.

---

## Sources

- https://agentrelay.com, https://agentrelay.com/blog, https://agentrelay.com/download
- https://agentrelay.com/blog/trusting-an-agent-you-didnt-spawn (2026-08-05)
- https://agentrelay.com/blog/someone-elses-agent-in-your-repo (2026-08-25)
- https://agentrelay.com/blog/promptgramming (2026-09-12)
- https://agentrelay.com/docs/introduction, /docs/quickstart, /docs/sessions, /docs/relay-connect, /docs/forward-deployed-agents, /docs/flows, /docs/relaycast-api (MDX sources in https://github.com/AgentWorkforce/agentrelay.com/tree/main/web/content/docs)
- https://github.com/AgentWorkforce/relay/blob/main/CHANGELOG.md and https://github.com/AgentWorkforce/relay/releases
- https://github.com/AgentWorkforce/relaycast/blob/main/CHANGELOG.md
- https://github.com/AgentWorkforce/agentrelay.com/commits/main (site commit log, Aug-Oct 2026)
- https://github.com/AgentWorkforce/skills/tree/main/plugins/chatgpt
- https://github.com/AgentWorkforce/ratify-agent-relay-evidence
- npm: `agent-relay`, `@agent-relay/sdk`, `@agent-relay/connect`, `@agent-relay/session`, `@relaycast/sdk`, `@relaycast/engine`, `@relayflows/sdk`, `@relayflows/surface` (versions and dist-tags read 2026-10-29)
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other (2026-10-23)
- https://www.ycombinator.com/companies/agent-relay
- https://launcharchive.ai/companies/agent-relay
- https://teapaw.org/agent_relay (unofficial X mirror)

---

## Verification log (2026-10-29)

Adversarial re-check by a second pass, done the evening of Oct 29 using `gh api`, `npm view`, `curl` and Exa fetch. "Confirmed" means re-read from the primary source.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Public launch Oct 23 on Launch YC with title "Let your teams' coding agents message each other" | Fetched YC launch page | **Confirmed** (published 2026-10-23, author Will Washburn) |
| 2 | Launch tweet about 96.4k views | teapaw mirror and Launch Archive | **Confirmed, with a nuance:** mirror shows 96,474, Launch Archive 96.5k. Both are third-party and neither is X itself |
| 3 | About 70 relay releases v11.4.0 to v14.0.0 | GitHub releases API | **Corrected** to exactly 68 |
| 4 | npm `next` = `15.0.0-next.4` | `npm view agent-relay dist-tags` | **Corrected:** now `15.0.0-next.5`; `latest` 14.0.0 confirmed. `probe-v15.0.1` also appeared at 04:48 UTC Oct 30 |
| 5 | Relaycast went "9.x to 12.2.1 in October" | relaycast CHANGELOG | **Corrected:** 8.16.0 (Oct 1) to 12.2.1 (Oct 29) |
| 6 | Anonymous hosted `trial` = 100 messages, never resets (11.1.0, Oct 27); engine has no quotas and a 30k req/min ceiling (12.0.0); Python SDK dropped | relaycast CHANGELOG | **Confirmed** verbatim. Added the `plan_limit_exceeded` error shape |
| 7 | `connect` plan: 10 agents, 1,200 req/min; key rotation (10.6.0) | relaycast CHANGELOG | **Confirmed** (10.6.0 dated Oct 18). Added 100k msgs/month and 3M to 10M API calls (10.6.2) |
| 8 | Freestyle hosting guide on Oct 29 (#251), `/v5` API, `/v1` returns 401, delete machine-id or get `provider_instance_conflict` | site commit log and MDX source | **Confirmed.** Clarified that it is a section of `forward-deployed-agents.mdx`, not a standalone page |
| 9 | Docs rewritten around Sessions on Oct 21; "Sessions are the product" | site commits and `introduction.mdx` | Quote **confirmed**. Date **refined**: authored Oct 21, merged via PR #243 on Oct 26 |
| 10 | Relay Connect: guest needs no account, 8 participants, 60-minute default | `relay-connect.mdx` | **Confirmed** |
| 11 | Quickstart: unsigned Windows build, "between turns", `name@machine` | `quickstart.mdx` | **Confirmed** |
| 12 | v13.3.0 attachments up to 25 MiB; 14 KiB/16 KiB PTY cap; v11.8.1 `fleet spawn --sandbox` plus `observer`; v12.4.0 Muse/Devin; v12.4.1 Shared Sessions; v14.0.0 checkout-first sandbox | relay CHANGELOG | **Confirmed** for all of them |
| 13 | Unreleased: `relay init` with no account, push delivery via probe, Python SDK removed | relay CHANGELOG `[Unreleased - Major]` | **Confirmed.** Also found that the CLI `agent register`/`rotate` conflict behavior changes in Unreleased, so the gotcha was refined |
| 14 | ChatGPT plugin README: "not a published directory listing" | skills repo README | **Confirmed** (wrapped across lines 37-38) |
| 15 | Blog dates Aug 5 / Aug 25 / Sep 12; revocation "within seconds" | blog index and post | **Confirmed** |
| 16 | Promptgramming "flagship example is literally `flow(\"software-factory\")`" | post HTML | **Partly wrong:** the first sample is `social-post-pipeline`. A `software-factory` flow does appear later. Wording fixed |
| 17 | Homepage "Let Claude Code talk to Codex", frontend/backend and merge-conflict examples, "a Mac mini across the world", "Free to start" | homepage fetch | **Confirmed** |
| 18 | Sep 18 YC tweet and Oct 28 desktop tweet | teapaw mirror | **Confirmed** (unofficial mirror) |
| 19 | `/pricing` and `/changelog` not found | `curl` | **Confirmed** 404 on both |
| 20 | Prize facts: Agent Relay track = Mac mini, $100 OpenAI credits each, bonus for using both | EVENT_PAGE.md | **Confirmed.** A "4-minute demo" length is **not** in the event page, so that phrase was removed |
| 21 | Stars about 1,057 | GitHub API | **Updated** to 1,059 |
| 22 | `@relayflows/sdk` 2.0.14 to 2.0.55 in about six weeks | npm time | **Confirmed** (Sep 16 to Oct 26) |

Not re-checked (left as originally stated): site commit numbers for Sep 15-22 Flows onboarding and Oct 7-8 arelay.to work, the Oct 15 og-card text, and "desktop 1.1.10" (Oct 10).

