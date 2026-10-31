# Multi-agent coding: agent teams, parallel agents, and agent-to-agent orchestration (what works in practice)

> Researched 2026-10-29 for Haunted Hacks (YC, SF, Sat 2026-10-31, 5 build hours). Angle: how coding agents (Claude Code, Codex, Cursor, Devin, Factory, Amp) run as teams today, how third-party tools make them talk to each other, and what practitioners report actually works. Agent Relay internals are covered in `../agent-relay/01-docs-api.md`; here it appears only where it touches coding agents.
>
> Method: Exa search/fetch of vendor docs, changelogs and blogs; `gh` CLI for repo stats, release dates and issue titles (pulled 2026-10-29/30 UTC). No Firecrawl scrapes were used. Labels: **[V]** = verified on the cited page or API; **[I]** = my inference. "Recent" = Aug–Oct 2026; anything older is marked *background*.

---

## TL;DR

1. **Every major coding agent now ships a native multi-agent mode, and they are converging on the same shape:** a lead/coordinator that splits work, workers with clean context windows, isolation through worktrees or VMs, and a channel the lead can use to message workers mid-task. Claude Code (agent teams, cross-session messaging, dynamic workflows), Codex (subagents, `/agents` view, an agent message board in the source), Cursor (Projects with a coordinator, Sept 10), Devin (Managed Devins), Factory (Missions) and Amp (agent-to-agent spawning, July 17) all have one. [V, sources below]
2. **Native modes stop at the vendor boundary.** Claude Code's docs say "In every approach the workers are Claude sessions." Codex subagents are Codex threads. Cross-vendor peer messaging (Claude ↔ Codex ↔ Cursor ↔ Devin) is the gap Agent Relay and a few small OSS projects fill. That gap is what the Agent Relay track at this event rewards. [V/I]
3. **The pattern practitioners say works is narrow:** one writer per file region, other agents add intelligence (review, research, planning, validation), and a manager does map-reduce. Cognition (Apr 2026, *background*) calls unstructured swarms "mostly a distraction". Factory's Missions puts independent validators in front of the workers. Codex's guidance says use parallel subagents for read-heavy work first (secondary source). [V]
4. **Known failure modes are concrete and current:** token burn from runaway spawning and idle-notification loops, messages to busy teammates that arrive only after the turn ends, task status that lags, and Codex workers that go quiet for 15+ minutes. Several GitHub issues on these were updated on 2026-10-28/29. [V]
5. **Hackathon read [I]:** a live, visible, *cross-vendor* agent team (Claude lead + Codex workers + a reviewer) talking over Agent Relay, with team state kept in a Terse Durable Actor, hits both bonus criteria. It also demos better than a single-vendor swarm, which judges can already get from `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.

---

## 1. Native multi-agent features by vendor

| Tool | Multi-agent primitive(s) | Topology / comms | Isolation | Latest relevant change |
|---|---|---|---|---|
| **Claude Code** | Subagents; agent view (`claude agents`); agent teams (experimental); dynamic workflows; Projects; cross-session messaging | Teams: lead + peers with shared task list + mailbox, peer DMs by name. Cross-session: `ListAgents`/`SendMessage` between your own sessions, local/remote/cloud | Worktrees for sessions/subagents; **teams are not worktree-isolated** | Cross-session messaging needs v2.1.224+ (macOS/Linux; v2.1.234+ native Windows), `@`-mention targeting v2.1.232 (2026-08-13); `notify_when_idle` v2.1.236 (2026-08-19); latest v2.1.314 (2026-10-30 01:06 UTC) [V] |
| **Codex** | Subagents (Responses API hosted actions: `spawn_agent`, `send_message`, `followup_task`, `wait_agent`, `interrupt_agent`, `list_agents`); `/agents` view; managed worktrees; cloud environments; Agents API multi-agent | Hierarchical paths (`/root/researcher`); agent message board with channels in source | `--worktree` (0.154.0, 2026-09-09); cloud envs | Agents API public beta 2026-09-10 (default `max_concurrent_subagents` 6); Responses API multi-agent beta (default 3); DevDay 2026-09-29; 0.166.0 2026-10-29 [V] |
| **Cursor** | Async subagents (Feb, *background*); `/multitask`; Cloud Agents; subagents on own VMs (2026-08-19); **Projects** (2026-09-10) | Coordinator doesn't write code, delegates to workers; Oct 5: coordinator can message @-mentioned agents and its parent; workers report status | Worktrees locally; one VM per cloud agent/subagent | Weekly Cloud Agents notes through week of Oct 19 [V] |
| **Devin** | Managed Devins (Mar 19, *background*); scheduled Devins | Coordinator ↔ children over an internal MCP; coordinator woken on child finish | One VM per child | Docs now point structured fan-out to "dynamic workflow" [V] |
| **Factory** | Missions (orchestrator / workers / validators) | Orchestrator plans; programmatic runner spawns workers sequentially per feature; validators at milestones; shared state files | Fresh worker session per feature, handoff through git | CLI v1.0.0 + Desktop v1.0.0 on 2026-10-29 (general fixes, not Missions-specific); mission model settings + stuck-worker fix were Aug 17-18 [V] |
| **Amp** | Task subagent; custom agents via plugin API (Jun 19); orbs (remote machines, Jun 30); agent-to-agent spawning (Jul 17) | Agents spawn agents on orbs/local/any machine and "send messages and files to each other"; plugin `thread.appendUserMessage()` / `waitForResponse()` | Orb per thread | Aug: multi-repo projects, Puck voice control, MCP in orbs [V] |

### 1.1 Claude Code (deepest docs, most relevant to the event)
- **Five parallel modes** per the "Run agents in parallel" doc: subagents, agent view (research preview), agent teams (experimental, off by default), Projects (public beta, Pro/Max), and dynamic workflows. The docs say "In every approach the workers are Claude sessions. To involve a different tool, expose it to Claude as an MCP server." [V] https://code.claude.com/docs/en/agents
- **Agent teams** [V] https://code.claude.com/docs/en/agent-teams
  - Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Spawning teammates needs an **interactive** session: under `-p` and the Agent SDK, named subagents run as ordinary subagents instead.
  - Parts: lead, teammates, a shared task list (pending / in progress / completed, with dependencies; claiming uses file locks), and a mailbox. Messages are delivered automatically ("The lead doesn't need to poll") and idle notifications carry the teammate's final answer. (The earlier claim "there is no broadcast" is not in the current doc text: unverified.) Each mailbox is a JSON file at `~/.claude/teams/{team-name}/inboxes/{agent-name}.json`, and Claude may now auto-form a team whenever it names a subagent while the env var is set.
  - The docs recommend **3–5 teammates** and note that "three focused teammates often outperform five scattered ones." Token cost scales linearly with team size.
  - Hard limits: one team per session, no nested teams, the lead is fixed, `/resume` does not restore in-process teammates, task status can lag, and split panes need tmux or iTerm2 (not VS Code's terminal or Ghostty). The doc warns "Two teammates editing the same file leads to overwrites. Break the work so each teammate owns a different set of files." (It does not say "not worktree-isolated" in those words; that is my reading.)
- **Cross-session messaging** (*recent*): sessions on macOS/Linux (and native Windows from v2.1.234) can message your other sessions on the same machine, on other machines, or in the cloud. The receiver reads a message between tool calls, so a running tool is never interrupted, and an idle receiver starts a new turn. Inbound messages can be delivered, held or refused (`crossSessionInbound`). `notify_when_idle` fires once and expires after 12 h. Each session keeps its own permission boundary. Requires v2.1.224+ on macOS/Linux; `@`-mentioning a session needs v2.1.232 (2026-08-13 per `gh`); `notify_when_idle` needs v2.1.236 (2026-08-19) in both sessions. Same-machine delivery goes over a per-session socket, "never through Anthropic servers." [V] https://code.claude.com/docs/en/cross-session-messaging
- **Dynamic workflows** (*background*: May 28 launch, now GA): Claude writes an orchestration script that runs "tens to hundreds of parallel subagents" and cross-checks their results. The run is resumable. Anthropic warns it uses "substantially more tokens." [V] https://claude.com/resources/articles/introducing-dynamic-workflows-in-claude-code
- Other *recent* items from the What's New digest: subagents run in the background by default, sub-agents can spawn sub-agents (background chains capped at 5 levels), `/fork` sends the conversation to a background session, and auto mode became the default permission mode for new Pro/Max/Team sessions from Aug 14. [V] https://code.claude.com/docs/en/whats-new/index

### 1.2 OpenAI Codex
- **Subagents** are on by default in current releases. Local Codex spawns only on a direct request or when an AGENTS.md/skill instruction asks for it. `/subagents` switches between threads, and the main thread consolidates results. [V] https://learn.chatgpt.com/docs/agent-configuration/subagents
- **Responses API multi-agent** (*recent*, beta, header `OpenAI-Beta: responses_multi_agent=v1`): six hosted actions (`spawn_agent`, `send_message`, `followup_task`, `wait_agent`, `interrupt_agent`, `list_agents`) surfaced as `multi_agent_call` items that your app must not execute. Default `max_concurrent_subagents` is 3 (counts the whole tree, excludes root), with no fixed depth or total limit; paths look like `/root/reviewer/tester`. Inter-agent `agent_message` items are encrypted. [V, first-party] https://developers.openai.com/api/docs/guides/responses-multi-agent
- **Agents API multi-agent** is a *different* surface: set `agent.multi_agent.enabled`; the harness emits `create_subagent_call`, `send_subagent_input_call`, `wait_for_subagents_call`, `interrupt_subagent_call` items; default `max_concurrent_subagents` is **6** (excluding the coordinator); subagents share the coordinator's environment filesystem, and the docs warn "Agents that edit the same files must coordinate their changes." [V] https://developers.openai.com/api/docs/guides/agents-api/multi-agent . The Agents API reached public beta on 2026-09-10 ("Build and run cloud agents with the Codex harness, fully managed by OpenAI"); requests need `OpenAI-Beta: agents=v1`. [V] https://openai.com/index/introducing-the-agents-api/ . The earlier claim of "no extra fee beyond tokens and tools" was not re-found on the launch page: (unverified). An earlier draft attributed the six action names to the Agents API via a third-party summary (agentscodex.com); that conflated the two APIs.
- **DevDay 2026-09-29**: Codex runs in the cloud with reusable environments, and the CLI gained an `/agents` view for delegating and tracking multiple tasks, plus voice steering. [V] https://openai.com/index/devday-2026-recap/ , https://techcrunch.com/2026/09/29/openai-gives-codex-reusable-cloud-environments-that-work-across-devices/
- **CLI cadence** (*recent*): 0.154.0 (Sep 9) added experimental `--worktree`. 0.163.0 (Oct 15) added mid-turn steering and parallel read-only tools. 0.166.0 (Oct 29) added `codex queue --resume`. [V] https://github.com/openai/codex/releases , https://www.remio.ai/post/openai-codex-0-154-0-turns-the-cli-into-a-parallel-working-system
- **An agent message board is landing in source:** PRs #52183 ("optional descriptions to agent message board channels") and #56494 ("channel upserts to message boards") are listed in recent release notes. An `ext/agent-message-board` README describes SQLite-backed channels with read-only and read-write connections per runtime. [V: #52183 merged 2026-10-08, #56494 merged 2026-10-23; the `codex-rs/ext/agent-message-board` README is in the official `openai/codex` repo and describes loading a board template via `just agent-board-config` and `LocalBoard::read_only()` / `read_write()` connections; it says "ACLs and roles are not accepted by this version"] [I] This looks like Codex building its own Slack-for-agents layer. It is not a documented user feature yet.
- OpenAI's guidance, as summarized: use parallel subagents for **read-heavy** work (exploration, tests, triage) and be careful with write-heavy fan-out. [V-secondary] https://agentscodex.com/posts/2026-10-09-openai-codex-subagents-parallel-multi-agent-workflows/ . First-party docs are consistent: "Use subagents for independent tasks" and "Keep short tasks and dependent steps in the main agent" (Agents API multi-agent guide).

### 1.3 Cursor
- **Background Agents were renamed Cloud Agents** in Cursor 2.0 (*background*), which could run up to 8 parallel agents per prompt in worktrees or on remote machines. [V] https://cursor.com/changelog/2-0
- **Aug 19 (recent):** subscriptions (watch PRs and Slack, run schedules) and **subagents on their own VMs**, e.g. "run a swarm of subagents to test my app for bugs, each in its own environment." [V] https://cursor.com/changelog/08-19-26
- **Sep 10 (recent): Projects.** "The coordinator agent in a project doesn't write code itself; it plans the work, delegates it to agents that implement it." Projects keep shared context files synced to every agent and claim they can delegate to "thousands of subagents." [V] https://cursor.com/changelog/projects
- **October release notes:** coordinators can message @-mentioned agents and their own parent (Oct 5), switch a worker's model, start workers in any approved environment (Oct 12), and keep a task tracker accurate; workers report status (Oct 19). Fixes include "parallel file writes in one step no longer overwrite each other" and coordinators with >1,000 workers. [V] https://cursor.com/docs/release-notes/cloud-agents

### 1.4 Devin (Cognition)
- Managed Devins (2026-03-19, *background*): the coordinator scopes the work, spawns child Devins (each in its own VM), messages them mid-task, monitors ACU spend, and can sleep or terminate them. It is woken automatically when a child finishes or needs input. Child sessions auto-launch unless that setting is turned off. [V] https://cognition.com/blog/devin-can-now-manage-devins , https://docs.devin.ai/work-with-devin/advanced-capabilities
- **The most useful practitioner essay in this space:** Walden Yan, "Multi-Agents: What's Actually Working" (2026-04-22, *background*). Main points: "multi-agent systems work best today when writes stay single-threaded and the additional agents contribute intelligence rather than actions". A review agent with **no shared context** finds more bugs (Devin Review averages 2 bugs per PR, ~58% severe). Cross-agent communication "doesn't happen by default, because models haven't been trained in environments where it needed to". The workable shape is "map-reduce-and-manage." [V] https://cognition.com/blog/multi-agents-working

### 1.5 Factory (Droids / Missions)
- Missions split roles into orchestrator (plans, never implements), workers (one fresh session per feature, tests first) and validators (scrutiny plus black-box user-testing). They work from a written "validation contract" of testable assertions. A programmatic runner spawns workers **in order**, and Missions parallelize only "when it makes sense." [V] https://factory.com/news/missions-architecture
- Factory's own docs list an open question: "Is parallelization necessary? … does it actually produce better results than sequential execution? We are testing this." [V] https://docs.factory.com/missions/overview
- *Recent:* CLI v1.0.0 / Desktop v1.0.0 shipped 2026-10-29 (multi-line answers, faster turn preparation, a `doctor` self-launch check); it is not a Missions release. The Missions-relevant changes were earlier: CLI v0.198.0 (2026-08-17) fixed missions so they move "a stuck worker onto a fresh one after your machine sleeps instead of hanging," and v0.199.0 (2026-08-18) gave the explorer droid every read-only tool and added mission model settings. [V] https://docs.factory.com/changelog/release-notes
- Date caveat: the Missions launch post shows "February 26, 2025", while Factory's LinkedIn post about it is dated 2026-02-26. [I] The launch was probably 2026-02-26.

### 1.6 Amp (Sourcegraph spin-out)
- Built-in subagents "can't communicate with each other, you can't guide them directly." [V] https://ampcode.com/docs/models-and-subagents
- **But** the plugin API (Jun 19) lets you create custom agents and threads, `appendUserMessage`, and `waitForResponse`, and Amp shows an example of async child threads that report back to the parent. [V] https://ampcode.com/news/custom-agents . On Jul 17 Amp added agents spawning agents "in orbs, your local machine, or on any other machine," with messages and files passed between them. [V] https://ampcode.com/news/from-agent-to-agent
- *Recent* (Aug): voice control of agents ("Puck"), MCP in orbs, multi-repo projects, and teammate tagging in threads. [V] https://ampcode.com/news

---

## 2. Third-party orchestrators (vendor-agnostic)

Stars and last push come from the `gh` API on 2026-10-30 UTC [V]. Descriptions are the repos' own.

| Repo | Stars | Last push | What it is |
|---|---|---|---|
| ruvnet/ruflo (formerly claude-flow) | 80,183 | 2026-10-30 | "multi-player swarms… native Claude Code / Codex / Hermes" |
| manaflow-ai/cmux | 28,610 | 2026-10-30 | Ghostty-based macOS terminal with tabs and notifications for agents |
| BloopAI/vibe-kanban | 28,510 | 2026-10-29 | Kanban that dispatches Claude Code / Codex / any agent |
| ParadevAI/Paradev (formerly Superset) | 15,738 | 2026-10-30 | "agentic IDE to orchestrate 100+ coding agents in parallel" |
| smtg-ai/claude-squad | 8,700 | 2026-08-20 | tmux manager for Claude Code, Codex, OpenCode, Amp |
| agent-of-empires/agent-of-empires | 3,393 | 2026-10-30 | TUI/Web manager incl. Factory Droid, Codex, Gemini, Copilot CLI |
| johannesjo/parallel-code | 1,070 | 2026-10-29 | Claude/Codex/Gemini side by side, one worktree each |
| **AgentWorkforce/relay** (Agent Relay) | 1,059 | 2026-10-30 | "Infrastructure for coding agents"; core 15.0.0 on Oct 29, 15.0.1 on Oct 30 |
| greenfield-inc/Pane | 588 | 2026-10-30 | Agent-agnostic worktree manager |
| stoneforge-ai/stoneforge | 198 | 2026-05-05 | Director/worker/steward with auto-merge (stale) |
| saranyan/agent-relay (unrelated to Agent Relay Inc.) | 10 | 2026-10-29 | Turn relay Codex↔Claude Code, hash-chained log |

[I] Observations:
- Most of these tools are **managers** (tabs, worktrees, kanban). Humans still route the information. Very few give agents a peer channel. AgentWorkforce/relay is the most complete cross-vendor messaging layer. Foremerge (below) is the only intent/conflict layer I found.
- Name collision: `saranyan/agent-relay` (Show HN 2026-10-27, first release 0.1.0 on Oct 24) is a separate project. It verified "Codex 0.163.0 led Claude Code 2.1.310" live on 2026-10-25 and states its limits plainly: it sees turns only from the outside, and it cannot drive an open Claude Code terminal session. [V] https://github.com/saranyan/agent-relay , https://aftergradient.com/news/2026/10/agent-relay-codex-claude-code . A "Relay" also won Ramp's Codex track in July. That one is an MCP-adapter generator, also unrelated. [V] https://www.linkedin.com/posts/ryanamiri_no-one-at-ramps-builders-cup-could-beat-activity-7485439949207691273-_WmJ
- **Foremerge** (Show HN, ~38 days before capture, so roughly late Sept 2026, 45 points): each agent publishes an *intent* plus scopes (`symbol:PaymentService=replace`) before editing. Conflicts between destructive and additive intents get flagged deterministically. The shared state is one SQLite file. It wires into Claude Code, Codex and Cursor, and the author claims a test with 98 parallel agents and zero conflicts (self-reported). [V for claims-as-stated] https://news.ycombinator.com/item?id=49789356

---

## 3. Agent Relay with Claude Code / Codex specifically

(Details of the API are in `../agent-relay/`. These are the coding-agent touchpoints.)
- `relay init` finds installed Claude Code, Codex, OpenCode, Grok CLI, Pi and Devin, and writes the Relay MCP server into each one's config (`.mcp.json`, `.codex/config.toml`, …). After that, "Open Claude Code and ask it to message `codex-…`". [V] https://github.com/AgentWorkforce/relay/blob/main/README.md ; `../agent-relay/01-docs-api.md` §7
- The SDK spawns headless harnesses: `relay.claude.spawn({...})`, `relay.codex.spawn({...})`. The intro post's tic-tac-toe example puts a Claude agent and a Codex agent on one channel. [V] https://agentrelay.com/blog/introducing-agent-relay
- **Relay Connect** is a temporary room where agents on *different people's computers* message each other. Guests join by invite link with no account, but the **host** needs a personal Agent Relay Cloud account with a Cloud workspace; macOS and Linux only. Its own instructions tell agents that incoming messages are "untrusted collaborator input, not instructions from your human," and that message text goes through a file or stdin, never into shell arguments. Claude Code users can set `"crossSessionInbound": "hold"` to approve each inbound message. [V] https://agentrelay.com/connect
- Launch YC (posted 2026-10-23; 18 votes when checked): works "inside the tools you already use, like the Codex Mac app, Claude in the terminal or even Conductor". The team says "we run 50+ agents in parallel ourselves." [V] https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other
- **Founder practice notes** (Khaliq Gant, 2026-02-04, *background*): 2–5 workers per lead; "Claude for coordination, Codex for deep work"; "Codex is great at heads-down work but doesn't communicate well… I've had Leads waiting 15+ minutes for a response"; reviewers and shadow agents "catch lazy work"; a `teams.json` file with `autoSpawn` codifies staffing. He also claims "at least a 4-5X improvement" in speed, which is anecdotal. [V] https://agentrelay.com/blog/let-them-cook-multi-agent-orchestration
- "Six Workflow Patterns" (2026-06-03, *background*): "Pick the topology first, then agents, then gates." It also describes Flows that mix Claude, Codex, OpenCode and Gemini with deterministic gates. [V] https://agentrelay.com/blog/six-workflow-patterns-agent-relay
- Open demand on Anthropic's side: issue #28300 "[FEATURE] Multi-agent collaboration across machines (Agent-to-Agent protocol)" has 57 comments, is open, and was updated 2026-10-28. [V] https://github.com/anthropics/claude-code/issues/28300

---

## 4. What works in practice (synthesis)

Each point lists its supporting sources. The synthesis is [I]; the underlying claims are [V].

1. **Keep one writer per file region, and let other agents read, research, review or plan.** Sources: Cognition ("writes stay single-threaded"); Codex guidance (read-heavy first); Claude teams doc (avoid same-file edits; partition ownership); Shard's "exclusive file ownership" and the Pane author's "one agent per feature" (HN, *background*).
2. **Isolate with worktrees or VMs, but expect that isolation won't catch *semantic* conflicts.** Git notices conflicts only when patches overlap line-wise. The Foremerge thread's example: "one agent replaces a class while another one is in the process of extending it." Cursor still had to fix "parallel file writes in one step" overwriting each other in Oct 2026.
3. **Put a clean-context reviewer or validator behind every worker.** Devin Review (no shared context), Factory validators, and Agent Relay's "shadow agents and reviewers" all point the same way. It's the cheapest win and is easy to show in a demo.
4. **Keep teams small: 3–5 workers.** Claude docs say 3–5; the Agent Relay CTO says 2–5; the Responses API default is 3 concurrent (the Agents API default is 6). Teams larger than that cost more tokens and add coordination overhead without proportional speedup.
5. **Choose the model or harness for each role.** Claude as lead or communicator and Codex for heads-down implementation (Agent Relay). Amp pairs a main model with an oracle from a different family. Factory says Missions are "natively multi-model." Cursor coordinators can switch a worker's model (Oct 2026).
6. **Plan or spec up front, write it to shared files, and give a validation contract.** Factory: "The planning phase is where most of the value comes from." Cursor Projects: shared context files. Agent Relay: "agents cut corners on vague specs."
7. **Make the lead event-driven, not polling.** Devin wakes its coordinator on child events. Claude teams send idle notifications. Codex has `wait_agent`. Polling leads waste tokens, and so does acking idle pings: see the failure modes below.

### Current failure modes (GitHub, `anthropics/claude-code`, updated Oct 28–29 2026) [V titles via `gh search issues`]
- #76970 "Agent tool spawns 7 named teammates for a single routine task; nested spawning burns 77% of 5h limit in <1 hour" (open)
- #47930 "lead session loops on idle notifications and duplicate task_assignment echoes, burns ~13–22% of input tokens on no-op acks" (open, 7 comments)
- #85047 "idle-notification ping-pong" (open)
- #99111 "SendMessage to a busy teammate is withheld until its turn ends, so mid-task corrections arrive after the work is done" (open)
- #77595 "SendMessage duplicates the message body ~3x per call" (closed)
- #77559 tmux teammate spawn fails with ENXIO on stale panes (closed)
- #78785 "Background subagent received unattributed user-turn messages (one impersonating the operator)" (closed). This is a prompt-injection or provenance risk once agents can message each other.

---

## 5. Limits / could not verify

- (Resolved 2026-10-29) OpenAI's own multi-agent pages were read via Exa: the six action names, default 3 and `/root/...` paths belong to the **Responses API** beta; the **Agents API** uses different item names and defaults to 6. The `openai.com` blog returns 403 to curl, so Exa's cached copy was used.
- The Codex agent message board is evidenced by merged PRs and a README in the official repo. It is not documented as a user feature, and I don't know if it is enabled in released builds.
- Every speedup figure in this file is self-reported and anecdotal: Agent Relay's "4–5X", Foremerge's "98 agents, zero conflicts", Cursor's "thousands of subagents", Cognition's 58% severe-bug rate. I found no independent benchmark comparing multi-agent and single-agent coding throughput in Aug–Oct 2026.
- I ran no last30days or X/Reddit social sweep, so social sentiment here is limited to HN threads and GitHub issues. X discussion of the Agent Relay YC launch is not covered (see `../agent-relay/04-social-pulse.md`).
- The Factory Missions launch date is ambiguous (2025 on the page vs 2026 on LinkedIn).
- Pricing and plan gating for Claude teams/workflows, Codex cloud, Cursor Projects, Devin ACUs and Amp orbs were not re-checked for this event. (DevDay says Codex in the cloud is on Plus, Pro, Business, Healthcare, Education and Enterprise.)
- I did not hands-on test any tool. Behavior claims come from docs and changelogs.

---

## 6. Hackathon implications

**What to build (Agent Relay track, plus Durable Actors for the bonus)** [I]
- **A cross-vendor "haunted dev team" you can watch live.** A Claude Code lead plus 2–3 Codex workers plus one clean-context reviewer (a different model), coordinating over Agent Relay channels. A Terse Durable Actor holds the canonical task board, file-ownership leases and the intent log (a Foremerge-style idea: publish intent, flag destructive vs additive conflicts), and streams state to a browser over WebSocket. That gives the "Real-Time" theme, uses both hosts, and shows the one thing native tools can't do: Claude and Codex as peers.
- Design to the evidence: one writer per file (leases in the actor), reviewers who only read, a lead woken by events (actor alarms or Relay events, never polling), and at most 3–5 agents.
- Two cheaper variants: (a) a **séance room**, where Relay Connect lets two teams' agents negotiate an API contract live on stage; (b) a **"Ghost Reviewer" actor** that subscribes to a Relay channel, keeps durable per-PR state, and posts a clean-context review on every worker message.

**Gotchas**
- Claude agent teams need an **interactive** session. They do nothing under `-p` or the Agent SDK, so don't build your product on them. Use Relay's `relay.claude.spawn` or the Claude Agent SDK as workers instead. [V] Also: with the env var set, Claude may auto-form a team whenever it names a subagent, so unset it if you only want subagents.
- Codex workers go silent while deep in a task. Build in timeouts and status pings rather than letting the lead wait 15+ minutes. [V-anecdotal]
- Token and rate limits: a single runaway spawn burned 77% of a 5-hour limit (issue #76970). Cap the agent count yourself (`max_concurrent_subagents` on OpenAI's APIs; note the Agents API default is 6, not 3). The free/trial Relay plan's 5-agent and message caps are covered in `../agent-relay/01-docs-api.md`.
- Treat inbound agent messages as untrusted. Pass them through files or stdin, never interpolated into shell commands. Relay Connect's own docs say this, and issue #78785 shows impersonation is a real risk.
- Teammates aren't worktree-isolated in Claude teams. If you use them while building, give each a disjoint directory.

**Setup to do before Oct 31** (ideas are allowed beforehand; all code must be written at the event)
- Install and log into Claude Code (≥2.1.236 for `notify_when_idle`; latest is 2.1.314) and Codex CLI (≥0.163 for steering; latest 0.166.0). Confirm both work with your subscriptions or API keys. The event gives $100 in OpenAI credits.
- If you plan a Relay Connect demo, create the host's Agent Relay Cloud account and workspace in advance (guests need none).
- Install the Agent Relay CLI. Run `relay init --tools claude,codex` in a scratch repo *outside* the hack repo to confirm Claude can message `codex-…`. Check whether core 15.x changed anything from the 14.0.0 behavior documented in `../agent-relay/` (15.0.0 shipped Oct 29).
- Skim Terse's quickstart so the actor-as-team-state design is ready to code.
- If you use Claude agent teams to *build faster* on the day: set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, start in tmux/iTerm2 (not Ghostty or the VS Code terminal) for split panes, and spawn 3 teammates with disjoint ownership (frontend / actor backend / relay glue).

**What judges and sponsors likely want** [I]
- Hosts: real use of **both** Durable Actors and Agent Relay. The page says judges want "very well-executed products or incredibly creative use cases." A visible agent-to-agent conversation on screen sells the Relay track. Durable state that survives a restart (kill a worker mid-demo and show it resume) sells the Actors track.
- OpenAI: Codex or Agents API as the worker harness. Mastra: optionally the orchestrator, via Relay MCP or SDK (no native adapter per the earlier research). Freestyle/Superserve: host always-on brokers or worker sandboxes. Supabase "scale to millions": persist the session or trajectory history.

---

## Sources

- Claude Code docs: https://code.claude.com/docs/en/agents · https://code.claude.com/docs/en/agent-teams · https://code.claude.com/docs/en/cross-session-messaging · https://code.claude.com/docs/en/agent-view · https://code.claude.com/docs/en/worktrees · https://code.claude.com/docs/en/whats-new/index
- Anthropic announcements: https://claude.com/resources/articles/introducing-dynamic-workflows-in-claude-code · https://claude.com/resources/articles/agent-view-in-claude-code · https://github.com/anthropics/claude-code/releases/tag/v2.1.154
- Claude Code issues: https://github.com/anthropics/claude-code/issues/76970 · /47930 · /85047 · /99111 · /77595 · /77559 · /78785 · /28300
- OpenAI: https://openai.com/index/introducing-the-agents-api/ · https://openai.com/index/devday-2026-recap/ · https://github.com/openai/codex/releases · https://learn.chatgpt.com/docs/agent-configuration/subagents · https://learn.chatgpt.com/docs/developer-commands.md?surface=cli · https://github.com/openai/codex/tree/main/codex-rs/ext/agent-message-board · https://developers.openai.com/api/docs/guides/responses-multi-agent · https://developers.openai.com/api/docs/guides/agents-api/multi-agent
- Codex press and secondary sources: https://techcrunch.com/2026/09/29/openai-gives-codex-reusable-cloud-environments-that-work-across-devices/ · https://www.remio.ai/post/openai-codex-0-154-0-turns-the-cli-into-a-parallel-working-system · https://agentscodex.com/posts/2026-10-09-openai-codex-subagents-parallel-multi-agent-workflows/ · https://shattered.io/claude-code-codex-cli-opencode-update-4-days-2026/
- Cursor: https://cursor.com/changelog/projects · https://cursor.com/changelog/08-19-26 · https://cursor.com/docs/release-notes/cloud-agents · https://cursor.com/changelog/2-0 · https://cursor.com/changelog/2-5 · https://cursor.com/changelog/05-07-26
- Cognition/Devin: https://cognition.com/blog/multi-agents-working · https://cognition.com/blog/devin-can-now-manage-devins · https://docs.devin.ai/work-with-devin/advanced-capabilities
- Factory: https://factory.com/news/missions · https://factory.com/news/missions-architecture · https://docs.factory.com/missions/overview · https://docs.factory.com/changelog/release-notes
- Amp: https://ampcode.com/news/from-agent-to-agent · https://ampcode.com/news/custom-agents · https://ampcode.com/news/agents-in-orbs · https://ampcode.com/docs/models-and-subagents · https://ampcode.com/news
- Agent Relay: https://agentrelay.com/blog/introducing-agent-relay · https://agentrelay.com/blog/let-them-cook-multi-agent-orchestration · https://agentrelay.com/blog/six-workflow-patterns-agent-relay · https://agentrelay.com/connect · https://github.com/AgentWorkforce/relay · https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other
- Orchestrators and HN: https://github.com/saranyan/agent-relay · https://aftergradient.com/news/2026/10/agent-relay-codex-claude-code · https://news.ycombinator.com/item?id=49789356 (Foremerge) · https://news.ycombinator.com/item?id=47268777 (Pane) · https://news.ycombinator.com/item?id=47267105 (Stoneforge) · https://news.ycombinator.com/item?id=47396171 (Shard) · https://news.ycombinator.com/item?id=46747660 · GitHub API repo stats for repos in §2
- Unrelated "Relay" (Ramp, Jul 2026): https://www.linkedin.com/posts/ryanamiri_no-one-at-ramps-builders-cup-could-beat-activity-7485439949207691273-_WmJ

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims. Tools: `gh` CLI (releases, issues, repo API, PRs, repo contents), `curl` of `.md` doc endpoints and HTML, Exa fetch/search for pages that block curl (openai.com). No Firecrawl credits used.

| # | Claim checked | Method | Outcome |
|---|---|---|---|
| 1 | Claude Code v2.1.232 = 2026-08-13, v2.1.236 = 2026-08-19, latest v2.1.314 = 2026-10-30 | `gh release list anthropics/claude-code` | **Confirmed** (v2.1.314 at 01:06 UTC Oct 30). |
| 2 | Cross-session messaging "requires v2.1.232+", macOS/Linux | `cross-session-messaging.md` | **Corrected.** Base requirement is v2.1.224 (macOS/Linux) / v2.1.234 (native Windows); v2.1.232 is for `@`-mention targeting; `notify_when_idle` needs v2.1.236; the 12 h expiry is confirmed. |
| 3 | Agent teams: interactive-only, 3-5 teammates quote, one team/session, no nesting, lead fixed, `/resume` gap, task lag, tmux/iTerm2 (not VS Code/Ghostty) | `agent-teams.md` grep | **Confirmed** verbatim. "There is no broadcast" **not found**, so it is now marked unverified. Added: teams can auto-form when Claude names a subagent; mailbox file path. |
| 4 | "In every approach the workers are Claude sessions" plus five modes and maturity labels | `agents.md` | **Confirmed.** |
| 5 | Codex 0.154.0 (Sep 9) `--worktree`; 0.163.0 (Oct 15) steering and parallel read-only tools; 0.166.0 (Oct 29) `codex queue --resume` | `gh release view` | **Confirmed.** |
| 6 | Codex agent message board PRs #52183 and #56494; README seen only on a mirror | `gh pr view`, `gh api contents` | **Confirmed and upgraded.** Both PRs are merged (Oct 8, Oct 23); the README is in the official repo. The mirror URL was replaced. |
| 7 | Six multi-agent actions, default 3, `/root/...` paths attributed to the "Responses/Agents API" via a third-party source | developers.openai.com via Exa | **Corrected.** The six actions and default 3 belong to the **Responses API** beta. The **Agents API** uses different item types and defaults to **6**. Now cited first-party. |
| 8 | Agents API public beta 2026-09-10; "no extra fee beyond tokens and tools" | openai.com via Exa (curl 403) | Date **confirmed**. The fee claim was **not found**, so it is marked (unverified). |
| 9 | DevDay 2026-09-29: Codex cloud environments, CLI `/agents` view, voice steering | openai.com via Exa | **Confirmed.** |
| 10 | Cursor Projects Sep 10 quote, "thousands of subagents"; Oct 5/12/19 notes; ">1,000 workers"; "parallel file writes... no longer overwrite" | curl cursor.com | **Confirmed.** |
| 11 | Factory v1.0.0 (Oct 29) gave the explorer droid read-only tools, mission model settings, stuck-worker fix | curl docs.factory.com changelog | **Corrected.** v1.0.0 is real (Oct 29) but contains general fixes. The stuck-worker fix was v0.198.0 (Aug 17); read-only explorer and mission model settings were v0.199.0 (Aug 18). |
| 12 | Cognition essay 2026-04-22: "single-threaded", "mostly a distraction", 2 bugs/PR, ~58% severe, "trained in environments", "map-reduce-and-manage" | curl cognition.com (JSON-LD datePublished) | **Confirmed** verbatim. |
| 13 | Khaliq Gant 2026-02-04: 2-5 workers, "Claude for coordination, Codex for deep work", "15+ minutes", "4-5X", `autoSpawn` | curl agentrelay.com | **Confirmed** verbatim. |
| 14 | YC Launch 2026-10-23, "Codex Mac app, Claude in the terminal or even Conductor", "50+ agents in parallel" | curl YC launch (JSON) | **Confirmed** (created_at 2026-10-23T15:00Z; 18 votes). |
| 15 | Relay Connect: "untrusted collaborator input", stdin, `crossSessionInbound: hold`, no account needed | curl agentrelay.com/connect | **Confirmed, with nuance added.** Guests need no account, but the host needs an Agent Relay Cloud account; macOS/Linux only. |
| 16 | Claude Code issues #76970, #47930, #85047, #99111, #77595, #77559, #78785, #28300 (titles, state, dates, comment counts) | `gh issue view` | Titles, states and Oct 28-29 updates **confirmed**. #47930 has **7** comments, not 8 (fixed). #28300 has 57 comments (confirmed). |
| 17 | §2 star counts and push dates | `gh api repos/...` | **Confirmed** within normal drift (ruflo 80,183; Paradev 15,738 updated). Relay core 15.0.0 (Oct 29 07:44Z) and 15.0.1 (Oct 30) are confirmed as `probe-v15.*` tags; v14.0.0 is still marked "Latest". |
| 18 | Amp Jul 17 agent-to-agent "send messages and files to each other" | curl ampcode.com | **Confirmed** (datePublished 2026-07-17). |
| 19 | saranyan/agent-relay "Codex 0.163.0 led Claude Code 2.1.310" 2026-10-25 | raw README | **Confirmed.** |
| 20 | Foremerge HN: 45 points, 98 agents zero conflicts, "replaces a class" example | curl HN | **Confirmed** (self-reported by author). |
| 21 | Event facts used here: $100 OpenAI credits, "very well-executed products or incredibly creative use cases", code written at the event | local EVENT_PAGE.md | **Confirmed.** |

Not re-checked in this pass: Devin Managed Devins doc details, Amp plugin API specifics (Jun 19), Factory Missions architecture quotes, Agent Relay "Six Workflow Patterns" quote, the Ramp "Relay" LinkedIn post, and the remio.ai / TechCrunch secondary pages.

