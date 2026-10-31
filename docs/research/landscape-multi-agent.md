# Multi-agent landscape: master brief for Haunted Hacks (Oct 31 2026)

> Consolidated 2026-10-29 (late PT). Merges the five sub-files in [`landscape-multi-agent/`](./landscape-multi-agent/), each already adversarially fact-checked. This brief resolves conflicts between them. New live checks are marked **[live]**: `gh api` on Relaycast `openapi.yaml` and `a2a.ts`, npm/PyPI dist-tags, the HN Algolia API, and `gh issue view` (2026-10-29/30 UTC).
> Labels: **[V]** = verified at a primary source or by live probe. **[I]** = inference. *bg* = background (before Aug 2026).
> Sub-files (for depth and full source lists): [01 protocols](./landscape-multi-agent/01-protocols.md) · [02 coding-agent teams](./landscape-multi-agent/02-coding-agent-teams.md) · [03 software factories / long-running](./landscape-multi-agent/03-software-factories-long-running.md) · [04 failure modes](./landscape-multi-agent/04-failure-modes-practitioners.md) · [05 frameworks](./landscape-multi-agent/05-agent-frameworks-multiagent.md). Related: [agent-relay.md](./agent-relay.md) · [terse.md](./terse.md) · [mastra.md](./mastra.md) · [openai.md](./openai.md)

---

## 1. Executive summary

- **Multi-agent inside one vendor is a solved product category. Across vendors it is not.** Every major coding agent shipped or extended a coordinator-plus-workers mode: Claude Code (agent teams, cross-session messaging, dynamic workflows), Codex (subagents, `/agents`), Cursor Projects (Sep 10), Devin, Factory Missions and Amp. So did both platform APIs: the OpenAI Agents API (Sep 10) and Claude Managed Agents dynamic workflows (Oct 9, up to 1,000 agents per run). In every case the workers are the vendor's own sessions. Claude's docs: "In every approach the workers are Claude sessions." [V] ([02](./landscape-multi-agent/02-coding-agent-teams.md), [03](./landscape-multi-agent/03-software-factories-long-running.md))
- **Frameworks have collapsed in-process multi-agent into a tool call.** Mastra deprecated `.network()`. LangChain archived `langgraph-supervisor`. ADK 2.x discourages direct `AgentTool` use. AG2 moved `GroupChat` to "Classic". AutoGen's README says "archived". No framework provides messaging across processes, vendors or people, and that is exactly Agent Relay's pitch. [V] ([05](./landscape-multi-agent/05-agent-frameworks-multiagent.md))
- **Two protocols won, and both sit in AAIF (Linux Foundation).** **MCP** `2026-07-28` is stateless: no `initialize`, no `Mcp-Session-Id`, MRTR replaces server-initiated requests, and Tasks moved to an extension. **A2A** v1.0 (Mar 12) uses PascalCase methods. It joined AAIF on Aug 17, and its SDKs are at 1.3.0. "ACP" now names three different protocols, and only Zed/JetBrains' Agent *Client* Protocol is still alive. [V] ([01](./landscape-multi-agent/01-protocols.md))
- **Agent Relay sits on top of both standards and is only partly conformant.** Its MCP server runs on the v1 MCP SDK. Its A2A gateway speaks v0.3-style `message/send` with snake_case fields and routes **singular** `task/get` / `task/cancel` (the spec says `tasks/...`). It refuses inbound federated `message/stream`. **[live]** `routes/a2a.ts` L472-485, L631-643.
- **The evidence on multi-agent has converged.** Parallel, independent, verifiable work gains. Anthropic's 45-agent swarm found 266 vulnerabilities vs 21 from independent agents, with "comparable" tokens per vulnerability in core directories. Tightly coupled work degrades and costs 2-15x the tokens. Practitioners say failures happen "at the seams" (handoffs, loops, shared state, weak verification), and every fix that actually shipped was deterministic code outside the LLM. [V] ([04](./landscape-multi-agent/04-failure-modes-practitioners.md))
- **[I] The architecture the field converges on maps onto the hosts' products.** It has five parts, each with a hackathon counterpart: a persistent addressable object per agent (Terse Durable Actor), a coordinator that delegates and never edits, isolated sandboxes (Freestyle/Superserve), a message bus (Agent Relay), and a verification gate. The closest public blueprint is Ramp Inspect / Open-Inspect, which uses one Durable Object per session. ([03 §5](./landscape-multi-agent/03-software-factories-long-running.md))

---

> ### What matters for Haunted Hacks (read this if nothing else)
> 1. **Pitch the cross-vendor, cross-process gap.** Claude, OpenAI/Codex and Mastra agents coordinating as peers over Agent Relay, each backed by a Durable Actor, is something no first-party product shows. It targets the Relay track (Mac mini), the Actors track (iPhone) and the "both" bonus. [I]
> 2. **Pitch visibility, durability and verification, not agent count.** Judges will know about Gas Town's retirement, the unauthorized Beads release, Cognition's "writes stay single-threaded" and Agensh's small-N result (+1.37 points from 1 to 8 agents on the 5-task mean). Use 3-6 agents. Show a gate going red, then green. Kill the process on stage and resume from actor state.
> 3. **Put every limit in code.** Each actor holds a budget, a step count, retries per tool and recent state hashes. Every Relay message carries a hop counter, and every send carries an `idempotencyKey`. Never let two agents verify each other in a loop.
> 4. **Against Relay's A2A gateway, use only `message/send`.** No inbound streaming, no task polling, and no "A2A v1.0 interop" claims on stage. The safest peers are Mastra (`A2AAgent` defaults to v0.3) and CrewAI (`a2a-sdk~=0.3.10`). Test the round trip on Friday.
> 5. **Build in TypeScript.** Pin `@agent-relay/sdk@14.0.0` (**[live]** npm `latest` = 14.0.0, `next` = 15.0.0-next.5), `@openai/agents@0.21.0` or `@mastra/core@1.80.0`, and `ai@7.0.157`. Relay's next major removes the Python SDK.
> 6. **Hosted Relay quotas change from day to day.** Sign in, design for 5 or fewer agents per workspace, handle `429 plan_limit_exceeded`, and keep `npx @relaycast/engine` (no quotas) as a fallback ([agent-relay.md](./agent-relay.md)).
> 7. **All code must be written at the event.** Ideas, accounts, installs and reading are fine beforehand. [V: EVENT_PAGE.md]

---

## 2. Key facts

### 2.1 Protocols

| Protocol | State as of 2026-10-29 [V] | Hack relevance |
|---|---|---|
| **A2A** | v1.0 2026-03-12 (bg), v1.0.1 05-28 (bg). Bindings: JSON-RPC, gRPC, REST. PascalCase methods (`SendMessage`, `GetTask`). An empty `A2A-Version` header means 0.3. Joined AAIF **08-17** ("Growth Stage"). `a2a` CLI announced **10-01** (v0.3.1, 10-16). Bloomberg joined the TSC **10-20**. a2a-python/js are at 1.3.0. 26,347 stars | Relay speaks v0.3 method names. Probe cards with `brew tap a2aproject/a2a-cli https://github.com/a2aproject/a2a-cli && brew install a2a` |
| **MCP `2026-07-28`** | Final **07-28**. Stateless, with a mandatory `server/discover`. MRTR (`resultType: input_required`) and `subscriptions/listen`. `Mcp-Method`/`Mcp-Name` headers. `ttlMs`/`cacheScope`. SSE resumability removed. Tasks moved to the `io.modelcontextprotocol/tasks` extension. Roots, Sampling and Logging deprecated (≥12-month window), as is DCR. Server Cards SEP-2127 became Final **10-06** | State must travel as explicit handles in tool arguments; a Durable Actor ID fits [I]. Stateless servers suit serverless hosts and support a "scale to millions" story |
| **MCP SDKs** | `npm i @modelcontextprotocol/sdk` still installs **v1** (1.32.2). v2 is `@modelcontextprotocol/server` + `client` at 2.4.0. PyPI `mcp` is 2.3.0, and openai-agents accepts `mcp>=1.19.0,<3` | Choose deliberately: online examples mix v1 and v2 APIs |
| **"ACP" ×3** | IBM's Agent Communication Protocol merged into A2A (2025, archived). AGNTCY's Agent Connect Protocol is archived and its objects are deprecated in OASF v1.1.0. **Zed/JetBrains Agent Client Protocol** (editor ↔ agent, stdio) shipped v1.13.0 on **10-27** (4,542 stars) | When someone says "ACP", ask which one |
| AGNTCY / discovery | SLIM v2.0 (08-04) → 3.4.6 (10-20). Directory v1.8.0 (10-15). app-sdk v0.6.0 moved to a2a-sdk 1.x. agents.json has been dormant since Feb 2025. AI Catalog and Google ARD v0.91 (08-26) are drafts | Ignore for the build |

Adoption figures are self-reported: "close to half-a-billion downloads a month" (MCP blog) and "400M monthly SDK downloads" (Anthropic). Cite each one separately. Axios reports AAIF grew "from fewer than 40 members to more than 250". [V]

### 2.2 Agent Relay's protocol surface

| Surface | Fact | Status |
|---|---|---|
| MCP server | `agent-relay mcp` (stdio) exposes `send_dm`, `post_message`, `check_inbox`, one tool per Zod action, and `get_observer_url`, which mints a scoped read-only audience link. It pushes `message.created`, `delivery.*` and `action.*` when the host supports streaming. `@relaycast/mcp` 12.2.1 depends on `@modelcontextprotocol/sdk ^1.26.0` | [V] |
| Routes | The card at `/.well-known/agent-card.json` (or `/{workspace}/…`), `/a2a/rpc` and `/a2a/webhook/{ws}/{name}` live at the **root**. `POST /v1/a2a/register` inherits the `/v1` server | **[live]** openapi L6719-6943 |
| Methods | The card advertises `message/send`, `message/stream`, `task/get`, `task/cancel`, with no `protocolVersion`. Inbound federated delivery accepts only `message/send`. Spec `tasks/get` returns -32601 | **[live]** |
| Fields | snake_case (`message_id`, `context_id`, `mime_type`), whereas official A2A JSON is camelCase. Untested whether this fails in one direction or both | [V code / I] |
| Delivery | Outbound A2A: "Delivery is at least once; preventing repeated receiver effects requires receiver deduplication", with a 24 h retry window. Inbound identities are deduplicated durably for 24 h | **[live]** openapi L35-62 |
| Ack | Durable `ack`/`fail`/`defer` are explicitly unsupported on the Relaycast backend | [V docs] |

### 2.3 Native multi-agent modes (vendor-locked)

| Tool | Key facts [V] |
|---|---|
| **Claude Code** | Agent teams: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. **Interactive only** (nothing under `-p` or the Agent SDK). 3-5 teammates, one team per session, no nesting, fixed lead, tmux/iTerm2 only, no worktree isolation. Teams may auto-form when Claude names a subagent. Mailbox at `~/.claude/teams/{team}/inboxes/{agent}.json`. Cross-session messaging needs v2.1.224+ (Windows v2.1.234+); @-mention needs v2.1.232 (08-13); `notify_when_idle` needs v2.1.236 (08-19). Latest is v2.1.314 (10-30 UTC). Same-machine messages travel over a local socket, "never through Anthropic servers" |
| **OpenAI Responses API multi-agent** (beta, `OpenAI-Beta: responses_multi_agent=v1`) | Six hosted actions: `spawn_agent`, `send_message`, `followup_task`, `wait_agent`, `interrupt_agent`, `list_agents`. Default `max_concurrent_subagents` is **3**. Paths look like `/root/reviewer`. `agent_message` items are encrypted |
| **OpenAI Agents API** (public beta 09-10, `OpenAI-Beta: agents=v1`) | Items: `create_subagent_call`, `send_subagent_input_call`, `wait_for_subagents_call`, `interrupt_subagent_call`. Default concurrency is **6**, and agents share one filesystem. Sandbox partners are Cloudflare, Daytona, E2B, Modal and Vercel (not Freestyle or Superserve) |
| **Codex CLI** | 0.154 (09-09) `--worktree`; 0.163 (10-15) mid-turn steering; 0.166 (10-29) `codex queue --resume`. An agent message board (SQLite channels) is in source: PRs #52183 (10-08) and #56494 (10-23). Its README says "ACLs and roles are not accepted by this version". Not a documented feature yet |
| **Cursor** | Projects (09-10): the coordinator "doesn't write code itself" and the launch claims "thousands of subagents". Oct 5: the coordinator can message @-mentioned agents. A fix notes "parallel file writes in one step no longer overwrite each other" |
| **Claude Managed Agents** | Dynamic workflows (10-09): 1,000 agents per run, 10 open runs per session, 24 h default lifetime. Budget can only be set at creation. Set `workflows: {type: enabled}` explicitly |
| **Devin / Factory / Amp** | Devin: Fusion (lead plus cheap sidekick, 09-11), Dynamic Workflows (10-13). Factory Missions: orchestrator, workers, validators; Factory asks itself whether parallel beats sequential. Amp: agent-to-agent on orbs (07-17, bg) |

### 2.4 Frameworks: primitive and Relay/actor seam

| Framework | Latest [V] | Primitive | A2A | Seam [I] |
|---|---|---|---|---|
| OpenAI Agents SDK | py 0.24.0 (10-15), js 0.21.0 (10-20); 13 py / 12 js releases since Aug 1 | handoffs (`transfer_to_<x>`), `as_tool()` | — | Relay tools on the agent. `RunState.toString()` goes in a `@Persisted` field. Terse has a Python example (10-12) |
| Mastra | core 1.80.0 (10-28) | supervisor `agents:{}` plus `delegation` hooks (`.network()` deprecated) | serves v0.3 and v1.0; `A2AAgent` (default v0.3); needs ≥1.33.1 | `createTool()` over the Relay SDK. Terse Mastra example (10-14 to 10-18) |
| Vercel AI SDK | `ai@7.0.157` (10-29) | `ToolLoopAgent`, subagent-as-tool | — | `tool()` over the Relay SDK |
| LangGraph | 1.2.18 (10-26) | `Command(goto)`, subgraphs, `deepagents` | — | The checkpointer owns state, so the actor keeps only the `thread_id` |
| CrewAI | 1.15.33 (10-29) | Crews, Flows | `a2a-sdk~=0.3.10` | A2A peer (best match) |
| Google ADK | py 2.13.0 (10-23) | `sub_agents` + `mode` | `RemoteA2aAgent`, `a2a-sdk>=0.3.4,<2` | Pin a2a-sdk 0.3.x |
| Pydantic AI | 2.63.0 (10-28), with `DetectLoops` | tools, `SubAgents` | `fasta2a` (v0.3 native) | Relaycast REST |
| AG2 / MS Agent Framework | 1.2.2 / py-1.23.0 | v1 agents / Magentic | a2a-sdk ≥1.x (MAF A2A package still beta) | Only if already known. May not route through Relay |
| AutoGen | v0.7.5 (2025-09) | — | — | Don't use |

### 2.5 Numbers safe to quote on stage

| Claim [V at source] | Source |
|---|---|
| Swarm: 266 vulnerabilities / 27M tokens vs 21 / 6.5M; 12 overlapped; tokens per vulnerability "comparable" in core directories | Anthropic, 08-13 |
| 3-agent team used 2.2-2.4x the tokens for ≤0.02 change in balanced accuracy, with more false alarms | GWU arXiv 2610.27488, 10-20 |
| Retrieval cut failures from 74.6% to 36.4%; 3→7 agents "does not significantly reduce failures" | arXiv 2610.32060, 10-23 |
| Context-bearing handoffs cut prompt tokens 42-63% | Handoff Debt, EMNLP 2026 |
| Hermes: 1,393 subagents, 218 concurrent, about 19 h, about $19.3k ($25k all-in). An auth-token expiry killed the run at about 50 min, and it survived only through per-step commits | Nous, 09-15 |
| Claude Code's background summarizer measured at 16.4% of spend (author-measured) | Flamerix gist; HN 565 pts **[live]** |
| **Anecdote only:** "$4,700 overnight on a $400 plan" | Reddit, via the AGI Hunt mirror only |

---

## 3. Newest features and events (Aug-Oct 2026)

- **Aug:** SLIM v2.0 (08-04). Argus paper (08-05). OpenAI Agents durable pending input on `RunState` (08-11). Anthropic's multi-agent systems research (08-13; HN 200 pts). Claude Code v2.1.232 / v2.1.236 (08-13 / 08-19). A2A joins AAIF (08-17). Factory Missions fixes (08-17/18). Cursor subagents on their own VMs (08-19). Beads incident report (08-20). Yegge's "Fences, not Sandboxes" (08-24); he retired Gas Town that month (known only via a secondary source).
- **Sep:** Hermes 1,393-agent refactor (run 09-02 to 09-04, post 09-15). Cognition raises $2B+ at $48B (09-08). Codex `--worktree` (09-09). **09-10:** Cursor Projects, OpenAI Agents API public beta, Atlassian *announces* Jira agent loops. Devin Fusion (09-11). Factory raises $200M at $5B (09-15). Claude Code Projects relaunch (09-17). Foremerge Show HN (09-21, 45 pts **[live]**). Agensh preprint (09-22). OpenAI DevDay: Codex cloud environments and `/agents` (09-29).
- **Oct:** A2A CLI (10-01). OpenAI Agents js 0.19 / 0.20 / 0.21 (10-05 / 10-08 / 10-20). MCP Server Cards Final (10-06). Managed Agents dynamic workflows (10-09). Devin Dynamic Workflows (10-13). Codex mid-turn steering (10-15). Bloomberg joins the A2A TSC (10-20). Gas City CI post, about $220k/yr saved (10-21). **Agent Relay Launch YC (10-23).** Agensh code released (10-24). Agent Client Protocol v1.13.0, a2a-python 1.3.0, AG2 1.2.2 (10-27). Mastra 1.80.0 and Pydantic AI `DetectLoops` (10-28). **10-29:** Flamerix gist on HN, YC Labs Minecraft swarms (241 pts **[live]**), Codex 0.166.0, Factory v1.0.0, Relay core `probe-v15.0.0`. **10-30 UTC:** `@agent-relay/sdk@15.0.0-next.5`, Claude Code v2.1.314.

---

## 4. Social sentiment (Aug-Oct 2026)

Coverage: HN and GitHub are strong. Reddit was reachable only through snapshot mirrors (the API returned 403/429). X had only low-engagement posts, so no X debate is claimed. ([04 Limits](./landscape-multi-agent/04-failure-modes-practitioners.md))

- **The loudest topic is cost and harness overhead.** The Flamerix gist reached 565 points and 50 top-level comments **[live]**. Claude Code #76970 ("burns 77% of 5h limit in <1 hour") and #47930 (idle-notification loops burning ~13-22% of input tokens) were open and updated on 10-28/29. [V]
- **Demand for cross-machine and cross-vendor agent talk is real.** Claude Code #28300 ("Multi-agent collaboration across machines (Agent-to-Agent protocol)") is open with 57 comments and was updated 10-28 **[live]**. Small bridges keep appearing, such as `saranyan/agent-relay` (Show HN 10-27; unrelated to Agent Relay Inc.). [V]
- **People like the swarm spectacle and stay skeptical of it.** YC Labs' 50-agent Minecraft run drew attention for its "tendency toward bureaucracy": four agents spent 11 minutes appointing a "sole fertilizer operator". The most-cited "it's all hype" Ask HN thread (09-13) has only **3 points and 7 comments** **[live]**, so it is not consensus. [V]
- **Practitioners favor small teams with hard guards.** Real deployments run "3 to 6 specialized agents with a coordinator" (André Silva, 09-29). In madsalt's 3,315 subagent runs, none of the seven incidents was a model failing at its own task; the failures were at the seams. Role-play swarms (CEO/PM/engineer) are read as a hype marker. [V]
- **Agent Relay itself** drew low-volume, positive, shallow reaction in launch week. The main critique is "it's only a communication layer" ([agent-relay.md §4](./agent-relay.md)). A verification and orchestration layer on top of Relay answers that critique. [I]

---

## 5. Contradictions resolved or flagged

| # | Conflict | Resolution |
|---|---|---|
| 1 | Relay A2A "at least once": 01 marks it unverified, 05 asserts it | **Resolved [live].** openapi L38-39 says *outbound* A2A is at least once, with receiver dedup required and a 24 h retry window. *Inbound* identities are deduplicated for 24 h. 01 had only searched the inbound text. |
| 2 | `/a2a/register` (openapi) vs `/v1/a2a/register` (README/SDK) | **Resolved [live].** The route has no server override, so it inherits `/v1`. The card, `/a2a/rpc` and the webhooks override to root. |
| 3 | Card advertises `message/stream` (01) vs streaming refused (05) | **Both true [live].** The card and RPC switch list it, but inbound federated delivery rejects anything except `message/send`. |
| 4 | Does `relay` install core 15.x or v14? (02) | **Resolved [live].** npm `agent-relay` and `@agent-relay/sdk` have `latest` = 14.0.0 and `next` = 15.0.0-next.5. The `probe-v15.*` Rust tags exist, but GitHub "Latest" is still v14.0.0. |
| 5 | Python SDK "removed" (sibling) vs PyPI 14.0.0 (05) | **Both true.** PyPI shows 14.0.0 with no pre-release **[live]**. The relay CHANGELOG `[Unreleased - Major]` removes it, and Relaycast stopped publishing its Python SDK at 12.0.0 ([agent-relay/02](./agent-relay/02-newest-features.md)). |
| 6 | `@Interleave` agent turns (05) vs "disables rollback, isolate" (03) | **Compatible.** Use `@Interleave` on LLM entry points; without it the mailbox blocks ("Impact could be catastrophic"). Keep those methods in their own actor class, and keep invariants in non-interleaved or `@Atomic` actors ([terse.md](./terse.md) row 11). |
| 7 | Relay caps: 100-message trial and 5 agents (03, 05) | **Flagged as moving.** On Oct 30, anonymous workspaces probed as plan `free` and 7 agents were accepted ([agent-relay.md](./agent-relay.md)). Treat 5 agents as the ceiling. |
| 8 | OpenAI concurrency default 3 vs 6 | **Resolved (02).** Responses API = 3, Agents API = 6. They are different APIs. |
| 9 | Are Managed Agents workflows on by default? | **Flagged.** Set the flag explicitly. |
| 10 | Foremerge "late Sept"; Ask HN "~Sep 18, dozens of replies" | **Resolved [live].** Foremerge: 09-21. Ask HN: 09-13, 3 pts, 7 comments. |
| 11 | "Mythos 5 truce in 98% of runs" | **Removed (04).** The figure is not in the article text. |
| 12 | Factory 2.0 date (Jun 15 vs "April"); Missions launch year | **Flagged.** Irrelevant to the build. |

---

## 6. Gotchas (ranked by demo risk)

1. **Runaway loops.** A DM triggers a turn, which sends another DM. Add a hop counter, a per-actor rate limit, a hard token cap, and an anti-spin rule (stop after a turn with no tool call, as Codex `/goal` does). The Gas Town trial burned about $100/h, so the $100 OpenAI credit can go in an hour.
2. **A2A interop.** Use `message/send` only. Expect snake_case. Test with the `a2a` CLI and a Mastra `A2AAgent` before the event.
3. **MCP packages.** `@modelcontextprotocol/sdk` is v1, while `server`/`client` 2.4.0 is v2. Relay's MCP server is v1, so it offers no MRTR or Tasks.
4. **One source of truth.** The actor owns history. Turn off Mastra Memory, the LangGraph checkpointer and OpenAI Conversations for the same thread. Persist only after a turn succeeds (copy Terse's Python example).
5. **OpenAI Agents JS.** From 0.19, a handoff `inputFilter` combined with `previousResponseId`/`conversationId` throws. From 0.20, approval resumes count toward `maxTurns`, so raise it.
6. **Claude agent teams are interactive-only** and auto-form when the env var is set. Use `relay.claude.spawn` or the Agent SDK for workers instead.
7. **Relay's durable ack/fail/defer are unsupported.** Send receipts as JSON messages or attachments.
8. **Keep one writer per file region.** Worktrees miss semantic conflicts. Hermes used 36 non-overlapping groups.
9. **Inbound agent text is untrusted.** Pass it through files or stdin, never shell arguments (Relay Connect docs). Issue #78785 shows an agent being impersonated.
10. **Name a model for every agent.** In one 225B-token audit, 59-80% of subagents silently inherited the expensive model (author-reported).
11. **Codex workers can go quiet for 15+ minutes** (Khaliq Gant). Use timeouts and status pings.
12. **Old tutorials use deprecated APIs:** Mastra `.network()`, `langgraph-supervisor`, AutoGen, AG2 Classic.
13. **Weak verification.** MAST found many verifiers "perform only superficial checks", and madsalt saw agents edit the checks that blocked them. Make the gate deterministic and read-only to agents.

---

## 7. Integration recipes

- **R1. Relay as tools (any framework, about 40 lines) [I on V APIs].** Wrap `@agent-relay/sdk@14.0.0` in four tools: `relay_send(to, text)` (`sendMessage({to:'#ch'|'@name'})`), `relay_inbox()`, `relay_agents()` and `relay_post(channel, text)`. These mirror the Python `on_relay()` names. Build them as an OpenAI `tool()`, a Mastra `createTool()` or an AI SDK `tool()`. DMs arrive as `dm.received`, not `message.created`.
- **R2. One actor per agent, with Relay as the mailbox (best story) [I].** A listener routes each event to `actor(<recipient>).onRelayMessage(envelope)`. The actor runs one framework turn in an `@Interleave` LLM actor class, persists `RunState` or the message array, and replies via R1. Alarms let agents wake and message others unprompted. In the demo, kill the server, restart it and show the agent resuming.
- **R3. Flight recorder and circuit breaker [I on V evidence].** Actor state is `{tokens_spent, step_count, retries_by_tool, last_N_state_hashes}`. Use one Relay channel per lane: `#upstream`, `#peer`, `#human`, `#alerts`. Detectors: *loop* = the same `(agent, state_hash)` 3 times; *ping-pong* = A→B→A→B within N messages; *context drop* = missing receipt keys; *budget* = soft and hard caps. When tripped, send a `mode: 'steer'` "stop and report" message to the agent and post to `#alerts`. Show the dashboard via Supabase Realtime.
- **R4. A2A guest (stretch goal).** `registerA2a({agent_card_url, auth_scheme, target_agent})` calls `POST /v1/a2a/register`. Point it at a Mastra card (`/api/.well-known/<id>/agent-card.json`) or a CrewAI A2A server. The guest becomes a DM-able proxy. It must answer synchronously, and receivers must dedupe.
- **R5. Cross-vendor coding team.** Use `relay.claude.spawn` / `relay.codex.spawn` (or `relay init`) for a Claude lead, 2-3 Codex workers and a clean-context reviewer on a different model. An actor holds the task board, file leases and a Foremerge-style intent log (publish intent and scope; flag destructive vs additive conflicts). Get the audience link from `get_observer_url` (`ot_live_*`, never `rk_live_*`).
- **R6. Night-shift agent.** Keep Codex `/goal`-style state in an actor: goal, budget, status and log. An Alarm heartbeat wakes it, and it commits after each verified step. Optionally host it on a Freestyle VM, following Agent Relay's 10-29 Freestyle guide.

---

## 8. Hackathon implications

**What to build (ranked) [I]:**
1. **"Ghost in the Swarm" / "Haunted Software Factory"** (R2 + R3 + R5). A small cross-vendor team where each agent is an actor and all traffic goes over Relay channels. The coordinator never edits. A deterministic gate goes red, then green. A breaker quarantines a "possessed" agent live. This matches the event page's literal ask ("Software Factory, long-running agent, multiplayer AI system"), both tracks, the bonus and the field's main pain point. Frame it as a "light factory" with a human gate (Relay Flows `f.human`).
2. **"Séance"** (R2 + R4). 3-5 ghost personas in OpenAI Agents JS or Mastra. Show in-process handoff next to cross-process Relay DMs ("framework = brain, Relay = nervous system, actor = memory"). A foreign A2A spirit is the stretch goal.
3. **A leaderless séance board** (Agensh-style). A board actor holds typed notes (OBSERVED/FACT/FAIL/CLAIM), and peers settle collisions by DM.

**90-second demo:** start a 4-agent task. Flip a deterministic fault toggle (two mutual verifiers, or a tool that always errors). Spend climbs and the LOOP badge appears. The breaker trips and posts to `#alerts`. Kill the server and show it resume. Close with one number from §2.5.

**Setup before Oct 31 (no project code):**
- **Accounts:** OpenAI ($100 credit each), a hosted Terse project, a **signed-in** Relay workspace (check `GET /v1/workspace` → `plan`), Supabase, Freestyle/Superserve. For a Relay Connect demo, the host needs an Agent Relay Cloud account; it runs on macOS/Linux only.
- **Cache installs:** `@agent-relay/sdk@14.0.0 @openai/agents@0.21.0 @mastra/core@1.80.0 ai@7.0.157 @relaycast/engine@12.2.1 @a2a-js/sdk@1.3.0 zod`, the Terse SDK (Bun ≥1.4.2, per [terse.md](./terse.md)), and the `a2a` CLI.
- **Tools:** Claude Code ≥2.1.236 (latest 2.1.314) and Codex ≥0.163 (latest 0.166.0). Run `relay init --tools claude,codex` in a scratch repo.
- **15-minute interop probe, then throw the code away:** fetch `/{workspace}/.well-known/agent-card.json` and try registering a Mastra card.
- **Read:** the Terse quickstart, the Relay messaging, channels and sending docs, Open-Inspect's README, Ramp's background-agent post, and Terse's OpenAI and Mastra examples.
- **On paper:** the message protocol (CLAIM/DONE/FAIL/REVIEW), the actor schema, detector thresholds, one healthy task and one fault scenario.

**What judges and sponsors want [I]:**
- **Relay:** visible traffic between heterogeneous agents, not one process calling tools.
- **Terse:** persisted state, sockets and Alarms that survive a restart.
- **OpenAI:** the Agents SDK, Agents API or Codex.
- **Mastra:** supervisor delegation hooks, Studio, or A2A. Podium tiers also win Mastra Platform months (3, 2 and 1).
- **Supabase "scale to millions":** per-agent actor sharding (Ramp: "no one session can impact another"), a stateless MCP tool surface, and a spend and trajectory ledger in Postgres.
- **YC interview:** "multi-agent fails at the seams; we made the seams observable and enforceable" beats "we made 20 agents talk."

---

## 9. Limits / could not verify

- No end-to-end A2A round trip has been run against a Relay workspace, here or in any sub-file. The incompatibilities come from reading the source.
- This pass's live checks covered only openapi.yaml, a2a.ts, npm/PyPI tags, and HN/GitHub counts. Everything else rests on the sub-files' verification logs.
- Still unverified: Argus 1,548 h (mirror), Devin's 10-09 "several levels deep" (X mirror), Codex `/goal` internals (third-party gist), the $4,700 loop (mirror), Paul & Nandy injection stats (secondary), Google's success-per-1K-tokens table and MAST category percentages (not in abstracts), Claude teams broadcast, Agents API pricing beyond tokens, OpenAI's hosted MCP tool and the 2026-07-28 spec, and the A2A v1.0 TSC list (LinkedIn).
- All speedup claims ("4-5X", "6x PRs", "98 agents zero conflicts", "thousands of subagents") are self-reported. No independent Aug-Oct 2026 benchmark compares multi-agent and single-agent coding throughput.
- Hosted Relay caps change; re-check on the morning of Oct 31.

---

## Sources (merged, deduplicated; decision-relevant only; the full lists are in each sub-file)

**Event:** ../EVENT_PAGE.md · https://events.ycombinator.com/haunted-hacks-2026

**Protocols:** A2A spec https://a2a-protocol.org/latest/specification/ · v0.3.0 spec https://github.com/a2aproject/A2A/blob/v0.3.0/docs/specification.md · v1.0 post https://a2a-protocol.org/latest/blog/2026/03/12/a2a-protocol-ships-v10-production-ready-standard-for-agent-to-agent-communication/ · releases https://github.com/a2aproject/A2A/releases · TSC https://github.com/a2aproject/A2A/pull/2308 · announcements https://a2a-protocol.org/latest/blog/category/announcements/ · AAIF https://aaif.io/blog/a2a-joins-aaif · https://a2a-protocol.org/latest/blog/2026/08/27/a-new-chapter-for-a2a-joining-the-agentic-ai-foundation/ · Axios https://www.axios.com/2026/08/17/a2a-agentic-ai-foundation-open-ai-standards · CLI https://github.com/a2aproject/a2a-cli · MCP changelog https://modelcontextprotocol.io/specification/2026-07-28/changelog · MCP blog https://blog.modelcontextprotocol.io/posts/2026-07-28/ · RC https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/ · Tasks https://modelcontextprotocol.io/extensions/tasks/overview · SEP-2127 https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127 · TS SDK https://github.com/modelcontextprotocol/typescript-sdk · Anthropic https://claude.com/blog/bringing-mcp-2026-07-28-to-claude · OpenAI MCP https://developers.openai.com/api/docs/guides/tools-connectors-mcp · Agent Client Protocol https://github.com/agentclientprotocol/agent-client-protocol · IBM ACP merge https://lfaidata.foundation/communityblog/2025/08/29/acp-joins-forces-with-a2a-under-the-linux-foundations-lf-ai-data/ · OASF https://github.com/agntcy/oasf/releases · AGNTCY https://agntcy.org/changelog · ARD https://github.com/ards-project/ard-spec/blob/main/spec/ard.md · AI Catalog https://ai-catalog.io/spec/

**Agent Relay:** https://agentrelay.com/docs/agent-relay-mcp · https://agentrelay.com/docs/markdown/relaycast-api.md · https://agentrelay.com/docs/messaging · https://agentrelay.com/docs/channels · https://agentrelay.com/docs/sending-messages · https://agentrelay.com/connect · https://agentrelay.com/blog/introducing-agent-relay · https://agentrelay.com/blog/let-them-cook-multi-agent-orchestration · https://agentrelay.com/blog/six-workflow-patterns-agent-relay · https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other · https://github.com/AgentWorkforce/relay · https://github.com/AgentWorkforce/relaycast/blob/main/openapi.yaml · https://github.com/AgentWorkforce/relaycast/blob/main/packages/engine/src/routes/a2a.ts · https://github.com/AgentWorkforce/relaycast/blob/main/packages/engine/src/engine/a2a.ts · https://github.com/AgentWorkforce/relaycast/blob/main/packages/a2a/src/index.ts · https://github.com/AgentWorkforce/relaycast/blob/main/packages/sdk-typescript/src/relay.ts · https://github.com/AgentWorkforce/relaycast/blob/main/packages/mcp/package.json · https://www.npmjs.com/package/@agent-relay/sdk · https://pypi.org/pypi/agent-relay-sdk/json

**Coding agents:** https://code.claude.com/docs/en/agents · https://code.claude.com/docs/en/agent-teams · https://code.claude.com/docs/en/cross-session-messaging · https://code.claude.com/docs/en/whats-new/index · https://claude.com/resources/articles/introducing-dynamic-workflows-in-claude-code · Claude Code issues https://github.com/anthropics/claude-code/issues/28300 · /76970 · /47930 · /99111 · /78785 · Claude release notes https://platform.claude.com/docs/en/release-notes/overview · https://modelsatwork.news/article/anthropic-dynamic-workflows-managed-agents-beta · https://www.theverge.com/ai-artificial-intelligence/997134/anthropic-claude-code-projects · https://openai.com/index/introducing-the-agents-api/ · https://openai.com/index/devday-2026-recap/ · https://developers.openai.com/api/docs/guides/responses-multi-agent · https://developers.openai.com/api/docs/guides/agents-api/multi-agent · https://github.com/openai/codex/releases · https://github.com/openai/codex/tree/main/codex-rs/ext/agent-message-board · https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex · https://gist.github.com/erbanku/13c9a83b4a7f0223f0a4ec1a29475515 · https://cursor.com/blog/projects · https://cursor.com/docs/release-notes/cloud-agents · https://cursor.com/changelog/08-19-26 · https://cognition.com/blog/multi-agents-working · https://cognition.com/blog/local-fusion · https://cognition.com/blog/series-e · https://impractical.ai/launch-videos/cognition-dynamic-workflows · https://factory.com/news/missions-architecture · https://docs.factory.com/missions/overview · https://docs.factory.com/changelog/release-notes · https://factory.com/news/5-billion-valuation · https://ampcode.com/news/from-agent-to-agent · https://ampcode.com/docs/models-and-subagents

**Factories and swarms:** https://nousresearch.com/refactoring-hermes-with-1393-agents · https://arxiv.org/abs/2609.26781 · https://github.com/microsoft/Agensh/blob/main/README.md · https://www.marktechpost.com/2026/10/24/microsoft-agensh-multi-agent-harness-1024-agents/ · https://arxiv.org/abs/2608.05144 · https://www.kucoin.com/news/flash/microsoft-and-shanghai-jiao-tong-university-open-source-argus-1548-hour-autonomous-research-system · https://readorchestrator.com/blog/what-happened-to-gas-town/ · https://yegge.ai/essays/fences-not-sandboxes/ · https://blog.gascity.com/ · https://softwarefactory.company/blog/light-and-dark-software-factories · https://github.com/ColeMurray/background-agents · https://engineering.ramp.com/post/why-we-built-our-background-agent · https://siliconangle.com/2026/09/10/atlassian-upgrades-ai-coding-agents-for-always-on-software-development/ · https://github.com/saranyan/agent-relay · Foremerge https://news.ycombinator.com/item?id=49789356

**Failure modes and evidence:** https://www.anthropic.com/research/multiagent-systems (HN https://news.ycombinator.com/item?id=49316271) · https://labs.ycombinator.com/projects/games/index.html (HN https://news.ycombinator.com/item?id=50296486) · Ask HN https://news.ycombinator.com/item?id=49689454 · https://andresilvalab.com/en/blog/multi-agent-workflows-in-production/ · https://gist.github.com/flamerix-ai/c3905705cc4205e5de3011fa2e74efce (HN https://news.ycombinator.com/item?id=50284255) · https://madsalt.tech/blog/multi-agent-orchestration-what-broke/ · https://dev.to/anasbuilds997/how-we-cut-70-of-multi-agent-token-waste-by-replacing-supervisor-llms-with-typed-state-machines-4alk · https://dev.to/jacksonxly/225-billion-claude-code-tokens-in-30-days-and-the-subagents-that-never-named-a-model-487 · https://github.com/talas9/anti-hall/issues/270 · https://agihunt.info/en/p/1a10dee9afbdfad6841455f20c3 · https://harshalgajjar.com/blog/multi-agent-harnesses-need-separate-message-channels · https://arxiv.org/html/2610.27488 · https://arxiv.org/html/2610.32060 · https://aclanthology.org/2026.emnlp-main.738/ · https://arxiv.org/html/2503.13657 (bg) · https://arxiv.org/abs/2512.08296v2 (bg) · https://www.fiddler.ai/blog/trace-agent-handoffs-multi-agent-llm-systems (bg)

**Frameworks:** https://github.com/openai/openai-agents-python/releases · https://github.com/openai/openai-agents-js/releases · https://openai.github.io/openai-agents-js/guides/handoffs/ · https://github.com/TerseAI/durable-actors-openai-agents-sdk-python-example · https://github.com/TerseAI/durable-actors-mastra-example · https://docs.useterse.ai/quickstart · https://mastra.ai/docs/subagents · https://mastra.ai/docs/agents/networks · https://mastra.ai/docs/connections/a2a · https://mastra.ai/docs/connections/mcp · https://github.com/langchain-ai/langgraph-supervisor-py · https://github.com/crewAIInc/crewAI/releases · https://github.com/microsoft/autogen · https://github.com/ag2ai/ag2/releases · https://github.com/microsoft/agent-framework/releases · https://github.com/google/adk-python/releases · https://adk.dev/workflows/collaboration/ · https://ai.pydantic.dev/multi-agent-applications/ · https://github.com/datalayer/fasta2a/blob/main/fasta2a/jsonrpc_v1.py · https://ai-sdk.dev/docs/agents/subagents

**Live checks this pass (2026-10-29/30 UTC):** `gh api` on relaycast `openapi.yaml` and `packages/engine/src/routes/a2a.ts` (repo pushed 2026-10-29T17:42Z) · `npm view @agent-relay/sdk dist-tags` / `npm view agent-relay dist-tags` · PyPI `agent-relay-sdk` JSON · HN Algolia items 50284255, 50296486, 49316271, 49689454, 49789356 · `gh issue view 28300 -R anthropics/claude-code`.
