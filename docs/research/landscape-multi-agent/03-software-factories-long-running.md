# Software factories, long-running agents and agent swarms: landscape (Aug to Oct 2026)

> Researched 2026-10-29 for Haunted Hacks (Oct 31, 2026). Scope: who builds "software factories", long-running autonomous agents and agent swarms, the notable demos from Aug to Oct 2026, and the architectures they share. Host-specific detail (Terse Durable Actors API, Agent Relay SDK and Flows) lives in `../terse/` and `../agent-relay/`. This file covers the wider field and links back to those files where it matters.
>
> Tools: Exa search and fetch, one WebSearch, and `gh api` for GitHub stars and activity (pulled 2026-10-29/30 UTC). No Firecrawl credits spent. Labels: **[V]** verified from the cited source; **[I]** my inference; **[BG]** background, dated before Aug 2026.

## TL;DR

1. **"Software factory" is now an industry category.** It stopped being a meme. Factory raised $200M at a $5B valuation on Sep 15 to sell "self-improving software factories" [1]. 8090 (Chamath Palihapitiya) raised $135M for its "8090 Software Factory" in late June [2][BG]. A CIO Bulletin roundup on Oct 13 lists Port, GitLab, Harness, Factory, Cognition, GitHub and Tessl as "autonomous software factory platforms" [3]. **[V]**
2. **Every frontier vendor shipped a coordinator-plus-fleet product in September.** These are Cursor Projects (Sep 10: "delegates tasks to thousands of subagents") [4], OpenAI's Agents API (Sep 10: "keeps them running reliably for days") [5], Claude Code's redesigned Projects (Sep 17) [6], Claude Managed Agents dynamic workflows (Oct 9: up to 1,000 agents per run) [7][8], and Devin's managed-Devin trees and Dynamic Workflows (Oct 9-13) [9]. **[V]**
3. **The demos have moved from "it ran for a day" to "it ran 1,000 agents".** Nous Research's Hermes refactor dispatched 1,393 subagents (218 concurrent) over about 19 hours for about $19.3k [10]. Microsoft Research's open-source Agensh scaled one repo to 1,024 agents with no orchestrator [11][12]. Microsoft and SJTU's Argus (arXiv 2608.05144, Aug 5) reports 1,548 hours of autonomous research campaigns [13][52]. **[V]**
4. **The skeptical counter-narrative is just as strong, and judges will know it.** Yegge's own Gas Town was retired in August ("I only ever wound up using it to build itself") [14]. His Beads agent shipped an unplanned release that "broke everyone" [15][16]. Cognition says parallel-*writer* swarms still mostly don't work and that writes should stay single-threaded [17][BG]. **[V]**
5. **[I] The architecture everyone converges on maps one-to-one onto the hosts' products.** It has five parts: (a) a persistent, addressable *session/agent object* that holds state and streams events, (b) a *coordinator* that delegates rather than edits, (c) isolated *sandboxes/worktrees* for workers, (d) a *message bus or shared board* between agents, and (e) a *verification gate* before merge. Terse Durable Actors cover (a), and Alarms cover long-running and scheduled work. Agent Relay covers (d). Freestyle and Superserve cover (c).

---

## 1. Definitions as the field uses them (with sources)

| Term | Working definition | Source |
|---|---|---|
| Software factory | "Signals from the outside world... get triaged and turned into planned changes. These changes are built, tested, reviewed, secured, shipped, and monitored. Monitoring... generates more signals." A continuous loop whose units are agents. | Factory 2.0 post, dated Jun 15 [18] (Factory's Sep 15 post says "In April we announced Factory 2.0"; the dates conflict) **[V][BG]** |
| Dark factory | Level 5 of Dan Shapiro's five-level ladder: no human writes or reviews code, and AI is evaluated against held-out scenarios it cannot see. StrongDM is the most-cited example ("Code must not be written by humans. Code must not be reviewed by humans.") | gethuman.sh [19], aipatternbook [20] **[V][BG]** |
| Light factory | Everything is automated except a human at the merge gate. | softwarefactory.company, Oct 2 [21] **[V]** |
| Long-running agent | A persistent objective attached to durable state that continues across turns, restarts and context windows until an evidence-based stop condition is met. | OpenAI Codex Goals cookbook [22] **[V]** |
| Agent swarm / fleet | Many agents working in parallel on one goal. Coordination comes from a lead (orchestrator) or is self-organized (peers claim work). | Agensh paper [12] **[V]** |

The term is being stretched: Factory's own messaging now says "self-improving". 8090 deliberately positions as a "governed, 'multiplayer' platform where human teams and coordinated AI agents build... together", in contrast to fully autonomous rivals [2]. **[V]** For the hackathon, "multiplayer software factory" is therefore an existing pitch frame that a funded company already uses. **[I]**

## 2. Commercial builders, newest moves (Aug to Oct 2026)

| Company / product | What shipped (date) | Architecture signal | Src |
|---|---|---|---|
| **Factory** (Droids, Missions) | $200M at $5B (Sep 15; Blackstone, Khosla, Sequoia, Insight and others; total funding over $400M; customers named include Nvidia, RBC, Adobe, T-Mobile). Earlier: Missions for "long-horizon, multi-step, multi-agent workflows" lasting "hours or days", Droid Computers for persistent execution, Factory Router (claims more than 60% token savings) | Spectrum of autonomy: skill, then Automation, then persistent Droid Computer, then Mission (parallel tracks) | [1][18][23] |
| **Cursor** Projects | Sep 10. A coordinator agent "doesn't write code itself but directs other agents". It runs on its own cloud computer, keeps shared context files synced across agents, and uses **Subscriptions** (watch Slack, cron, follow PRs). Cursor claims users who mainly use Projects merge 6x as many PRs | The coordinator never executes, so "it is never blocked". It does event-driven "gardening" of never-ending work | [4] |
| **Anthropic** Claude Code Projects | Sep 17 beta. "Each thread is a Claude Code cloud session working on its own branch and copy of the repo". The coordinator resolves overlaps as merge conflicts. Threads share memory | Coordinator, threads (branch each), and subagents/workflows inside each thread | [6][24] |
| **Anthropic** Managed Agents dynamic workflows | Oct 9 beta (`managed-agents-2026-04-01` header; agent `multiagent` field `{"type": "multiagent_20261001", "workflows": {"type": "enabled"}}` per the release note; Models at Work says workflows are on by default for that type, so set it explicitly). The agent *writes a program* that runs agents in phases, with up to 1,000 agents per run, 10 open runs per session and a 24h default lifetime. Progress arrives as `workflow_run.*` events. A session budget can only be set at session creation [8]. Sep 10 `auto` permission policy (unverified: not re-checked) | "Let Claude fully orchestrate... its own multi-agent topology" (AI Engineer NYC, Oct 12) | [7][8][25] |
| **OpenAI** Agents API | Sep 10 public beta. The hosted Codex harness gets automatic compaction, subagents and "infrastructure that keeps them running reliably for days", with OpenAI, BYO or partner sandboxes. Nash quote: "thousands of long-running AI agents" | Managed harness plus pluggable sandbox | [5] |
| **OpenAI** Codex `/goal` | A Goal is "persisted thread state": a SQLite row per thread with status (active/paused/budget_limited/complete), a token budget and usage counters. Continuation fires only when the thread is idle. A no-tool-call turn suppresses the next continuation ("so Codex does not spin") | Goal as a durable state machine | [22][26] |
| **Cognition** Devin | $2B+ Series E at $48B (Sep 8; led by a16z and Accel; run-rate revenue "almost $900M", up from $492M in May) [53]. Fusion lead+sidekick harness (Sep 11). Devins spawn managed Devins "several levels deep" (Oct 9; X mirror only, the Oct 9 post was not re-located on re-check, unverified). Dynamic Workflows: "the plan... lives in code instead of an agent's head" and resumes stopped runs (Oct 13). Oncall (Oct 15) | Lead and sidekick exchange only "briefs, results, and feedback", each keeping its own cached context | [9][27][28] |
| **Atlassian** Jira | Sep 10: *announced* ("upcoming") "Agent loops in Jira" that scan backlogs and produce merge requests, plus a standards system and a reviewer agent. Ship date not confirmed | Always-on background loop plus audit log | [29] |
| **Microsoft** Project Opal | Sep 7: M365 Copilot tasks that run "for hours or even days" on a dedicated Windows 365 Cloud PC | Long-running computer-use agent | [30] |
| Others marketing "software factory" | orq.ai (blog series dated Oct 20-24), Opsera Forge (Work Orders and checkpoint gates), Port (Context Lake), Harness, GitLab Duo | Governance and human gates are the main selling point | [3][31][32] |

## 3. Open source: orchestrators, harnesses and runtimes

Stars come from `gh api` on 2026-10-29/30. **[V]**

| Project | Stars | What it is | Last push | Notes |
|---|---|---|---|---|
| NousResearch/hermes-agent | 258,574 | Self-improving agent with `/goal`, skills it writes itself, and recursive subagents | Oct 30 | Ran the 1,393-agent refactor [10] |
| stablyai/orca | 110,356 | Desktop, mobile and remote "AI orchestrator": runs Codex, Claude Code, OpenCode and Pi side by side, one worktree each | Oct 30 | Very active (commits daily) [33] |
| gastownhall/beads | 28,295 | Git-backed (Dolt) issue tracker and memory for agents. The part of Gas Town that survived | Oct 29 | Beads 1.3 (Oct 7) added an ordered event journal [16] |
| gastownhall/gastown | 18,621 | Mayor, Polecats (workers), Witness, Refinery (merge queue) | Oct 28; last release v1.2.1, Jun 6 | Retired by its author in Aug [14] |
| gastownhall/gascity | 1,463 | "Gas Town rewritten as an SDK for building your own dark factories": composable "packs" | Oct 30 | v1.5 Oct 7; Oct 21 post on CI as the factory bottleneck [16][34] |
| kunchenguid/gnhf | 4,235 | "Good night, have fun": wraps any CLI agent in an overnight loop, one commit per step, and resumes after sleep | Oct 3 | [35] |
| ColeMurray/background-agents (Open-Inspect) | 3,406 | Ramp-Inspect clone: **Cloudflare Durable Objects per session** (SQLite, WebSocket hub, event stream) as the control plane, Modal/Daytona/E2B sandboxes as the data plane | Oct 30 | Terse already ported a version (see `../terse/`) [36][37] |
| awslabs/cli-agent-orchestrator | 1,490 | Supervisor delegates to provider CLIs in isolated terminal sessions | Oct 30 | [38] |
| open-mercato/cezar | 874 | "Orchestrate hundreds of AI coding agents, 24/7": worktree per task, children capped at 4 per parent, no DB | Oct 30 | [39] |
| microsoft/Agensh | 824 | Decentralized harness, scales to 1,024 agents, MIT | Oct 29 | Open-sourced Oct 24; Copilot is the default harness; Codex, Claude Code and Pi backends announced Oct 29 [11] |
| am-will/swarms | 247 | Claude Code/Codex skills: dependency-aware plan, then parallel "waves" | Apr 18 | [40][BG] |
| GavinGeizer/swarmforge-oss | 2 | MCP-driven coordinator that runs OpenCode workers **in Freestyle VMs** | Oct 11 | Tiny, but a direct precedent for sponsor-stack use [41] |

Not star-checked: LoopX ("long-horizon agent control plane", 5,615 stars per a Sep 6 article) [42]; Aira's Agent Workspace Fabric (claims 1,700+ agent PRs merged in Oct; vendor-reported) [43]; Argus (Microsoft/SJTU) [13].

## 4. Notable demos and data points, Aug to Oct 2026 (chronological)

- **Aug 20.** Beads incident report: "An autonomous Beads maintainer released v1.2.1 without explicit, release-specific human sign-off" [16]. **[V]**
- **Aug 24.** Yegge, "Fences, not Sandboxes". He runs 50-60 agents (18 long-lived Fable "officer" seats plus headless Sol/Opus fleets) on 21 Claude Max accounts, about $4,000/day API-equivalent, on one Mac Studio. Only Fable may talk to humans, via Slack and email. "Every morning... it has made at least one terrible decision" [15]. **[V]**
- **Aug.** In the same period Yegge retired Gas Town: "Gas Town was intended to be reusable, but I only ever wound up using it to build itself" (quoted in [14]; I could not open the original essay). **[V via secondary]**
- **Sep 2-4.** Hermes refactor: 36 non-overlapping groups, worktrees, a tree three levels deep, and an orchestrator "which handled coordination rather than editing source files". Interfaces were checked byte for byte (`--help` output, JSON schemas). It cut non-test Python by 34.4%; about $19.3k for the main run, about $25k all-in [10]. **[V]**
- **Aug 5 / Sep 7.** Argus (Microsoft/SJTU): the arXiv paper (2608.05144) was submitted Aug 5 and confirms the Manager/Planner/Engineer/Reviewer roles over "durable project state" plus about 78% on SWE-Bench Pro vs 59% for Direct Copilot at 1.41x tokens [52]. The 27 campaigns, 1,548 h and "one human intervention every 40.7 hours" figures come from a Sep 7 KuCoin/MarsBit mirror [13]; they are not in the abstract and the full report was not opened. Code: `lbx154/Argus` (329 stars, pushed Oct 30). **[V]** for roles/benchmarks, **[V via secondary]** for the hours.
- **Sep 10.** Cursor Projects (beta, rolling out) and OpenAI Agents API (public beta) launched; Atlassian announced upcoming agent loops [4][5][29]. **[V]**
- **Sep 17.** Claude Code Projects relaunched [6][24]. **[V]**
- **Sep 22.** Agensh preprint (arXiv 2609.26781): on pandoc, 1 agent reached 33.89% and 1,024 agents reached 55.06% of tests in 6 h. The 5-task mean went from 19.31% (1 agent) to 28.78% (128 agents). Going from 1 to 8 agents added only 1.37 points to the 5-task mean, although on pandoc alone 1→8 agents went from 33.89% to 41.75% (+7.86) [12][44]. The 1,024-agent run used 16 nodes of 64 agents [44]. **[V]**
- **Oct 9.** Managed Agents dynamic workflows (1,000-agent runs). Devins can spawn trees of Devins [7][9]. **[V]**
- **Oct 13.** Devin Dynamic Workflows: a Python script controls parallel sessions and resumes without redoing finished work [28]. **[V]**
- **Oct 21.** Gas City post by Julian Knutsen, "Rush Hour in Gas City": the factory's real bottleneck was CI, and fixing it "accidentally cut $220,000 a year in compute costs" [16]. **[V]** (blog index summary only; full post not read)
- **Oct 24.** Agensh code released. Coordination uses Gitea (shared repo), Mattermost (channel plus DMs) and a typed context board (OBSERVED, FACT, FAIL, CLAIM, PATCH_SUMMARY). "The loop lives in the prompt, not in runtime code" [11][44]. **[V]**
- **Oct 25.** "What Happened to Gas Town" (The Orchestrator). An early public trial (documented by DoltHub's Tim Sehn, early 2026, background) "burned about a hundred dollars of tokens in an hour" and "merged a pull request while its integration tests were failing" [14]. **[V]**

## 5. Architectures that recur

**A. Coordinator that delegates and never edits.** This is Cursor Projects ("never blocked"), Claude Code Projects, Hermes's root agent and Gas Town's Mayor [4][6][10]. **[V]** Why it works: the coordinator stays responsive to humans and to events while workers burn tokens.

**B. Planner → workers → judge, run in cycles.** Cursor's January research harness used recursive planners, workers that "just grind", and a judge that decides whether to continue. Each cycle starts fresh. It peaked around 1,000 commits/hour [45][46][BG]. Argus uses Manager/Planner/Engineer/Reviewer [13]. **[V]**

**C. Workflow-as-code written by the agent.** Anthropic dynamic workflows, Devin Dynamic Workflows, swarm-code's RLM `thread()`/`merge_threads()` [7][28][47]. The plan becomes an inspectable, resumable artifact instead of hidden context. **[V]**

**D. Leaderless claim board.** Agensh workers post CLAIM, settle overlaps by DM, verify, merge and repeat [11][44]. **[V]** **[I]** This is the most "actor-native" design: each worker is an addressable mailbox and the board is a shared actor.

**E. Lead plus cheap sidekick.** Devin Fusion: the frontier lead owns plan and review, and a cheaper model executes. They exchange only briefs and results [27]. **[V]** Useful for staying within $100 of OpenAI credits. **[I]**

**F. Control plane / data plane split with one stateful object per session.** Ramp Inspect and Open-Inspect give each session a Durable Object with its own SQLite, a WebSocket hub and an event stream. Ramp says hibernating WebSockets let "sockets... stay open without incurring compute costs during idle periods". The sandbox (Modal) runs the harness and bridges back [36][48]. **[V]** **[I]** This is the closest public blueprint for a Terse Durable Actors build.

**G. Goal as durable state plus an anti-spin rule.** Codex `/goal` stores the goal row, the budget and the status. It continues only when idle and suppresses continuation after a turn with no tool call [22][26]. **[V]**

**H. Isolation and merge discipline.** Worktree per worker is now the norm (Orca, cezar, ORCH, Hermes, Claude Code threads) [6][10][33][39]. On top of that comes a merge queue or "Refinery" (Gas Town) or a governed merge queue (AWF) [43]. **[V]**

**I. Verification separated from generation.** Devin Review finds about 2 bugs per Devin-written PR, about 58% of them severe [17][BG]. StrongDM uses held-out scenarios and a "Digital Twin Universe" of mocked SaaS [49][BG]. Hermes compared outputs byte for byte [10]. **[V]**

### What breaks (evidence)
- **Off-plan drift over long runs.** A Cursor forum user ran a "48 hours+" job. Its first 7 h were useful, then "30+ hours trying to refactor code base, which was never an ask" [50][BG]. **[V]**
- **Unauthorized consequential actions.** Beads v1.2.1 [15][16]. **[V]**
- **Cost blowouts.** About $100/h in the Gas Town trial [14]. Anthropic warns that runs bill every agent and "build for runs that end without finishing" [8]. **[V]**
- **Parallel writers make conflicting implicit decisions.** Cognition: "most of the sexy ideas in that space still don't see meaningful adoption" [17]. **[V]**
- **Model updates break harnesses.** Gas Town broke this way [14]. **[V]**
- **Diminishing returns at small N (task-dependent).** Agensh's 5-task mean gained only +1.37 points going from 1 to 8 agents, though pandoc gained +7.86 [44]. **[V]** **[I]** A 5-agent hackathon swarm should not pitch "more agents = better". It should pitch visibility, durability and coordination.
- **Credential/infra failures kill long runs.** About fifty minutes into the Hermes refactor, the provider's auth token expired and "the resulting failures killed the run"; it survived only because workers committed after each verified step and a second session wrote a handoff [10]. **[V]**

## 6. How the hosts position themselves here (pointer only)

- **Terse:** the founders' own demos are a "tiny Lovable" ("Maybe it becomes a software factory", Oct 19), an Open-Inspect port, and an Oct 26 tweet about a "durable, horizontally scalable coding agent platform... Sandboxes, pi, Durable Actors". Hosted cap: 500 active actors per project. See `../terse/04-social-pulse.md` and `../terse/03-github-code.md`. **[V per those files]**
- **Agent Relay:** CTO Khaliq Gant's Sep 12 "Promptgramming" post includes a `flow("software-factory", ...)` example (its first code sample is actually a `social-post-pipeline` flow, per the host fact-check). Flows add `.gate()` checks and `f.human` gates. Quotas: an *anonymous* hosted `trial` workspace gets 100 messages, one time (Relaycast 11.1.0, Oct 27). The published free tier lists a 5-agent cap, but a live anonymous probe on Oct 30 came back as plan `free` and accepted 7 agents. Treat 5 agents as a safe design ceiling, not a guarantee. See `../agent-relay/01-docs-api.md` and `../agent-relay/02-newest-features.md`. **[V per those files]**
- **[I] Positioning gap you can exploit:** Claude Code Projects and Cursor Projects keep agents inside one vendor. Agent Relay's pitch is cross-vendor agent talk ("Let Claude Code talk to Codex") [51]. A factory where an OpenAI agent, a Claude agent and a Mastra agent coordinate on Relay, each backed by a Durable Actor, is something the first-party products structurally don't show.

## 7. Limits / could not verify

- I could not open Yegge's August Gas Town retirement essay directly. The quote comes from The Orchestrator [14]. The Oct 21 Gas City CI post was read as a headline only.
- Argus campaign-hour figures (1,548 h, 40.7 h per intervention) come from a KuCoin/MarsBit mirror; the arXiv abstract [52] confirms roles and benchmarks but not those hours.
- Devin's Oct 9 "managed Devins several levels deep" claim rests on an X mirror [9]; the re-check could not find the original post. Codex `/goal` internals (SQLite row, anti-spin rule) come from a third-party gist [26], not OpenAI docs; the official cookbook [22] confirms only the lifecycle (pause/resume/clear, budget stop) and Codex 0.128.0+.
- Anthropic's Sep 10 `auto` permission policy was not re-checked. Whether dynamic workflows are on by default for `multiagent_20261001` is inconsistent between the release note and Models at Work [7][8].
- Cursor's "6x PRs", Factory's "60% token savings", AWF's PR counts and Nous's "$1.8M of value" are all self-reported.
- MarkTechPost's comparison table (Kimi Agent Swarm "up to 100 sub-agents", Claude Code agent teams "3 to 5 recommended") was not checked against primary sources [44].
- No Hacker News, Reddit or X sentiment was collected for this angle. One WebSearch for HN threads on Hermes and Cursor Projects returned nothing usable. The `last30days` skill was not run; the social files under `../terse/` and `../agent-relay/` cover host sentiment.
- The gnhf repo was matched by its description ("Before I go to bed, I tell my agents: good night, have fun"). The Sep 5 article [35] does not link it.
- Model names (Fable 5/5.1, Opus 5.5, GPT-6.1-sol, etc.) are as written in the sources. I did not check them.

---

## Hackathon implications

**What to build (ranked, [I]):**
1. **"Haunted Software Factory": a multi-vendor coding swarm where each agent is a Durable Actor and agents talk over Agent Relay.** It follows pattern F plus pattern A. The coordinator actor never edits code. Worker actors each own a sandbox (Freestyle VM or Superserve) and a git worktree. Relay carries the CLAIM, DONE and REVIEW messages between an OpenAI worker and a Claude or Mastra reviewer. Alarms give it a heartbeat that kills zombies and re-queues work. The live UI shows the message graph and per-agent state. This hits the Durable Actors and Agent Relay tracks, the "both" bonus, and the event page's literal ask ("Come build your own Software Factory, long-running agent, multiplayer AI system..." [0]). Hosting the always-on worker on a Freestyle VM also uses Agent Relay's Oct 29 Freestyle hosting guide (see `../agent-relay/02-newest-features.md`).
2. **A leaderless "séance board" (Agensh-style, pattern D) at Halloween scale.** Use 4-5 agents, one board actor holding typed notes (OBSERVED/FACT/FAIL/CLAIM), with peers DMing over Relay to settle collisions. It is more novel than another orchestrator and visually legible. The fit is good because the Agensh paper shows coordination emerging, which is the story you'd demo.
3. **Long-running "night shift" agent (gnhf/Codex `/goal` pattern G inside an actor).** The actor stores goal, budget, status and a progress log. Alarms wake it up. Kill the process on stage, then show it resume from actor state. A durability demo is the clearest way to show judges why actors matter.

**Gotchas:**
- Sign in to Agent Relay before the event: an anonymous hosted workspace may land on the 100-message one-time `trial`, which a chatty swarm burns in minutes. Design for 5 or fewer agents per workspace (the documented free cap, not enforced in an Oct 30 probe), handle `429 plan_limit_exceeded`, and pool or reuse agents. Self-hosted `relaycast-engine` has no quotas (12.0.0). Terse's hosted cap is 500 active actors per project with `429 actor_start_rate_limited`, so it is not the binding limit.
- Add a **hard token/time budget** and an **anti-spin rule** (stop when a turn makes no tool call), copying Codex [22]. A runaway loop during a 5-hour hack burns the $100 OpenAI credit fast (Gas Town: about $100/h [14]).
- Do **not** let parallel agents write the same files. Partition by path (Hermes used 36 non-overlapping groups) or keep writes single-threaded through the coordinator, per Cognition [10][17].
- Put a **verification gate** that judges can watch go red, then green: tests, a reviewer agent, or a byte-for-byte interface check. Factories without a gate read as toys.
- Non-interleaving actors block on slow LLM calls. `@Interleave` fixes that, but it disables automatic rollback for *all* methods in that class, and it must decorate the actual entry point. Prefer putting slow LLM calls in a separate actor class (see `../terse/05-team-strategy.md`).
- Pre-empt the skeptic. Judges will have seen the Gas Town retirement and the Beads incident. Show a human gate (`f.human` in Relay Flows) for consequential actions, and frame it as a "light factory" [21].

**Setup before Oct 31 (ideas are allowed; code must be written at the event):**
- Get accounts and keys working: OpenAI, Terse hosted project, Agent Relay workspace (sign in so you are not on anonymous trial), and Freestyle and/or Superserve sandbox credits.
- Read Open-Inspect's control/data-plane README [36] and the Agensh README loop [11] as reference designs. Read Ramp's post on Durable Objects for sessions [48].
- Decide the demo task before arriving. Pick something with a **simple verifiable success criterion** (Cognition notes that every famous swarm demo has one [17]), e.g., "make this failing test suite pass" or "build a pumpkin-carving web app to spec".
- Sketch the message protocol (CLAIM/DONE/FAIL/REVIEW) and the actor schema on paper.

**What judges and sponsors want [I]:** a visible, durable, multiplayer system where actors are the backbone and agents coordinate directly. They want the system to survive interruption, show its coordination live, and stop safely. "Scale to millions" (Supabase): pitch the per-session actor model, which Ramp chose because "no one session can impact another" [48], and keep durable history in Supabase Postgres.

---

## Sources

0. Event page (local copy). /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md
1. Factory, "Factory raises $200M at $5B valuation", 2026-09-15. https://factory.com/news/5-billion-valuation
2. Value Add VC, "8090 Labs raises $135M Series A", 2026-06-30. https://valueaddvc.com/pulse/8090-labs-135m-series-a-salesforce-ventures-2026
3. CIO Bulletin, "7 Enterprise-Grade Autonomous Software Factory Platforms", 2026-10-13. https://ciobulletin.com/artificial-intelligence/7-enterprise-grade-autonomous-software-factory-platforms
4. Cursor, "Introducing Projects", 2026-09-10. https://cursor.com/blog/projects
5. OpenAI, "Introducing the Agents API", 2026-09-10. https://openai.com/index/introducing-the-agents-api/
6. The Verge, "Claude Code relaunches Projects...", 2026-09-17. https://www.theverge.com/ai-artificial-intelligence/997134/anthropic-claude-code-projects
7. Claude Platform release notes (Oct 9, Sep 10 entries). https://platform.claude.com/docs/en/release-notes/overview
8. Models at Work, "Anthropic lets one Claude agent write and run a workflow of up to 1,000 agents", 2026-10-09. https://modelsatwork.news/article/anthropic-dynamic-workflows-managed-agents-beta
9. Cognition X posts via mirror (Oct 7-19, 2026). https://twiscan.com/en/x/Cognition
10. Nous Research (Teknium), "Refactoring Hermes with 1,393 agents", 2026-09-15. https://nousresearch.com/refactoring-hermes-with-1393-agents
11. microsoft/Agensh README. https://github.com/microsoft/Agensh/blob/main/README.md
12. Zhan et al., "Agensh: Scaling Organizational Intelligence to 1,024 Agents", arXiv 2609.26781, 2026-09-22. https://arxiv.org/abs/2609.26781
13. KuCoin/MarsBit, "Microsoft and SJTU open-source Argus", 2026-09-07. https://www.kucoin.com/news/flash/microsoft-and-shanghai-jiao-tong-university-open-source-argus-1548-hour-autonomous-research-system
14. Timothy O'Brien, "What Happened to Gas Town", The Orchestrator, 2026-10-25. https://readorchestrator.com/blog/what-happened-to-gas-town/
15. Steve Yegge, "Fences, not Sandboxes", 2026-08-24. https://yegge.ai/essays/fences-not-sandboxes/
16. The City Wire (Gas City blog) index. https://blog.gascity.com/
17. Walden Yan, "Multi-Agents: What's Actually Working", Cognition, 2026-04-22. https://cognition.com/blog/multi-agents-working
18. Factory, "Factory 2.0: From coding agents to software factories", 2026-06-15. https://factory.com/news/software-factory
19. gethuman.sh, "What is a Dark Software Factory?", 2026-04-08. https://gethuman.sh/dark-software-factory/
20. AI Pattern Book, "Dark Factory". https://www.aipatternbook.com/dark-factory.md
21. softwarefactory.company, "Light and Dark Software Factories", 2026-10-02. https://softwarefactory.company/blog/light-and-dark-software-factories
22. OpenAI Cookbook, "Using Goals in Codex". https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex
23. Factory, "Factory raises $150M Series C", 2026-04-16. https://factory.ai/news/series-c
24. Claude, "Projects redesigned: from folder to conversation", 2026-09-17. https://claude.com/resources/articles/projects-redesigned
25. Richard MacManus, "How Anthropic's Dynamic Workflows Coordinate Claude Agents", 2026-10-12. https://lspace.beehiiv.com/p/claude-dynamic-workflows
26. Gist, "How OpenAI Codex implements the /goal slash command". https://gist.github.com/erbanku/13c9a83b4a7f0223f0a4ec1a29475515
27. Cognition, "Introducing Fusion in Devin Desktop & CLI", 2026-09-11. https://cognition.com/blog/local-fusion
28. Impractical, "Cognition: Devin Dynamic Workflows", 2026-10-13. https://impractical.ai/launch-videos/cognition-dynamic-workflows
29. SiliconANGLE, "Atlassian upgrades AI coding agents for always-on software development", 2026-09-10. https://siliconangle.com/2026/09/10/atlassian-upgrades-ai-coding-agents-for-always-on-software-development/
30. AIBase, "Microsoft Releases Project Opal", 2026-09-08. https://news.aibase.com/news/30909
31. orq.ai, Software Factory page. https://orq.ai/platform/software-factory
32. Opsera, Software Factory page. https://opsera.ai/software-factory
33. stablyai/orca. https://github.com/stablyai/orca
34. Steve Yegge, "Welcome to Gas City", 2026-04-24. https://yegge.ai/essays/welcome-to-gas-city/
35. Cursor HQ, "gnhf lets coding agents run unattended overnight", 2026-09-05. https://cursorhq.ai/news/gnhf-lets-coding-agents-run-unattended-overnight-one-commit-at-a-time-aa8052/ ; repo https://github.com/kunchenguid/gnhf
36. ColeMurray/background-agents (Open-Inspect). https://github.com/ColeMurray/background-agents
37. Cole Murray, "OpenInspect" project page. https://murraycole.com/projects/openinspect
38. awslabs/cli-agent-orchestrator. https://github.com/awslabs/cli-agent-orchestrator
39. open-mercato/cezar. https://github.com/open-mercato/cezar
40. am-will/swarms. https://github.com/am-will/swarms
41. Gavin Geizer, "I Built an Open-Source Orchestrator for AI Coding Agents", 2026-10-09. https://dev.to/gavingeizer/i-built-an-open-source-orchestrator-for-ai-coding-agents-5g5e
42. Not a Tech Guy, "LoopX adds durable memory to Claude Code and Codex agents", 2026-09-06. https://www.notatechguy.com/loopx-adds-durable-memory-to-claude-code-and-codex-agents/
43. Aira, Agent Workspace Fabric. https://aira.pro/agent-workspace-fabric
44. MarkTechPost, "Microsoft Open-Sources Agensh", 2026-10-24. https://www.marktechpost.com/2026/10/24/microsoft-agensh-multi-agent-harness-1024-agents/
45. Cursor (Wilson Lin), "Scaling long-running autonomous coding", 2026-01-14. https://cursor.com/blog/scaling-agents
46. Cursor (Wilson Lin), "Towards self-driving codebases", 2026-02-05. https://cursor.com/blog/self-driving-codebases
47. kingjulio8238/swarm-code. https://github.com/kingjulio8238/swarm-code/
48. Ramp Engineering, "Why we built our background agent". https://engineering.ramp.com/post/why-we-built-our-background-agent
49. Thomas Klok Rohde, "The Dark Factory: 5 Lessons from Grown Software", 2026-02-19. https://thomasrohde.github.io/readme-pages/notes/2026-02-19-dark-factory-grown-software/
50. Cursor Forum, "Share your experience with Long-running Agents", 2026-02-12. https://forum.cursor.com/t/share-your-experience-with-long-running-agents/151697
51. Agent Relay homepage. https://agentrelay.com/
52. Argus paper, "Argus: A General-Purpose Agentic Reasoning Runtime for Long-Horizon Tasks", arXiv 2608.05144, submitted 2026-08-05. https://arxiv.org/abs/2608.05144 ; code https://github.com/lbx154/Argus
53. Cognition, "Do it all with Devin: Announcing our Series E", 2026-09-08. https://cognition.com/blog/series-e (corroborated by Reuters, https://www.reuters.com/technology/cognition-ai-raises-2-billion-48-billion-valuation-2026-09-08/)

## Verification log (2026-10-29)

Adversarial re-check by a second pass, using Exa fetch/search, `gh api` and curl (no Firecrawl). Outcome key: CONFIRMED, CORRECTED, NUANCED, UNVERIFIED.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Factory raised $200M at $5B on Sep 15; "self-improving software factories" | factory.com/news/5-billion-valuation | CONFIRMED. Added investors and $400M+ total. Router "more than 60%" token savings is in the same post (self-reported). Noted that this post dates Factory 2.0 to April while the 2.0 post is dated Jun 15 |
| 2 | Cursor Projects Sep 10: "thousands of subagents", coordinator "never blocked", Subscriptions, 6x PRs | cursor.com/blog/projects | CONFIRMED verbatim ("users who primarily use Projects merge six times as many"; also "new users merge 30% more PRs") |
| 3 | OpenAI Agents API Sep 10 public beta, "keeps them running reliably for days", Nash "thousands of long-running AI agents" | openai.com/index/introducing-the-agents-api | CONFIRMED. Sandbox partners include Cloudflare, Daytona, E2B, Modal, Vercel (not Freestyle/Superserve) |
| 4 | Claude Managed Agents dynamic workflows Oct 9: 1,000 agents/run, 10 runs/session, 24h, `workflow_run.*` | Claude release notes + Models at Work | CONFIRMED, NUANCED: release note shows workflows enabled via an explicit `workflows: {type: enabled}` field; Models at Work says on by default. Added: budget only settable at session creation |
| 5 | Claude Code Projects Sep 17: thread = cloud session on own branch; overlaps resolved as merge conflicts | The Verge | CONFIRMED verbatim. Beta for "select Claude Pro and Max subscribers" |
| 6 | Hermes: 1,393 subagents, 218 concurrent, ~19 h, ~$19.3k / ~$25k, 36 groups, 34.4% cut, coordinator doesn't edit | nousresearch.com post | CONFIRMED. Added the auth-token-expiry crash at ~50 min and resume-from-commits lesson |
| 7 | Agensh arXiv 2609.26781 (Sep 22): 19.31%→28.78% (1→128), pandoc 33.89%→55.06% (1→1,024), +1.37 for 1→8 | arXiv abstract, README, MarkTechPost | CONFIRMED, NUANCED: +1.37 is the 5-task mean only; pandoc 1→8 was +7.86. Copilot is the default harness. "Loop lives in the prompt" is MarkTechPost's wording, not a README quote |
| 8 | Gas Town retired in Aug; quote "I only ever wound up using it to build itself"; ~$100/h trial | readorchestrator.com | CONFIRMED as secondary (original essay still not opened). Trial attributed to DoltHub's Tim Sehn, early 2026 (background) |
| 9 | Yegge "Fences, not Sandboxes" Aug 24: 50-60 agents, 18 Fable officers, 21 Max accounts, ~$4,000/day, Mac Studio, "broke everyone" Beads release, "at least one terrible decision" | yegge.ai essay | CONFIRMED verbatim |
| 10 | Beads v1.2.1 incident report Aug 20; Beads 1.3 / Gas City 1.5 Oct 7; CI post Oct 21 (~$220k/yr) | blog.gascity.com index | CONFIRMED. Added CI post author (Julian Knutsen). Latest releases now beads v1.3.2 (Oct 24), gascity v1.5.1 (Oct 24); gastown last release v1.2.1 Jun 6 confirmed |
| 11 | Cognition $2B+ at $48B, Sep 8 | Cognition blog, Reuters, TechCrunch, Bloomberg | CONFIRMED. Added lead investors and run-rate |
| 12 | Devin Fusion Sep 11: lead + sidekick exchange only briefs | cognition.com/blog/local-fusion | CONFIRMED. Oct 9 "several levels deep" claim UNVERIFIED (mirror only) |
| 13 | Ramp quotes: hibernating WebSockets "stay open without incurring compute costs during idle periods"; "no one session can impact another" | Ramp engineering post (JS-rendered; read via Exa) | CONFIRMED verbatim. Note: Ramp says these come from Cloudflare's Agents SDK over the WebSockets Hibernation API |
| 14 | Argus Sep 7 open-sourced, 1,548 h, roles | arXiv 2608.05144 + KuCoin mirror | CORRECTED date (paper Aug 5; Sep 7 is the mirror). Roles CONFIRMED; hours remain secondary |
| 15 | Atlassian agent loops "launched" Sep 10 | SiliconANGLE | CORRECTED: announced as "upcoming" features |
| 16 | GitHub stars/push dates for 12 repos | `gh api` 2026-10-30 ~06:00 UTC | CONFIRMED within drift (e.g. hermes-agent 258,588; orca 110,381; beads 28,297) |
| 17 | Host pointers: Promptgramming "flagship" `software-factory` flow; Relay free tier 5 agents / ~100 messages; `@Interleave` fix | `../agent-relay/01-docs-api.md`, `02-newest-features.md`, `../terse/05-team-strategy.md` | CORRECTED: first sample is `social-post-pipeline`; 100 messages applies to anonymous `trial`; 5-agent cap not enforced in a live probe; `@Interleave` disables rollback class-wide |
| 18 | Event page asks for "Software Factory, long-running agent, multiplayer AI system" and gives $100 OpenAI credits | EVENT_PAGE.md | CONFIRMED |
| 19 | 8090 $135M Series A, "governed, 'multiplayer' platform" | Value Add VC | CONFIRMED (Jun 29-30, background) |
| 20 | Microsoft Project Opal Sep 7, "hours or even days", Windows 365 Cloud PC | AIBase | CONFIRMED (secondary source) |

