# Agent frameworks' multi-agent support, Oct 2026: how each plugs into Agent Relay and Terse actor state

Researched **2026-10-29**, two days before Haunted Hacks (Oct 31, 11:00-16:00 build). Scope: the multi-agent primitives in the OpenAI Agents SDK, Mastra, LangGraph, CrewAI, AutoGen/AG2 (and Microsoft Agent Framework), Google ADK, Pydantic AI and the Vercel AI SDK. For each one: the releases from the last ~90 days (Aug-Oct 2026), and the concrete seam where it meets **Agent Relay** (messaging) and **Terse Durable Actors** (state).

Method: `gh release list/view` on every framework repo (dates below are GitHub release `publishedAt`), PyPI/npm registry metadata, official docs fetched through Exa/context7, and a read of the Relaycast `openapi.yaml` and `packages/engine/src/routes/a2a.ts` source (commit of 2026-10-29). Sibling files cover Relay itself (`../agent-relay/`), Terse (`../terse/`) and Mastra in depth (`../mastra/`). This file doesn't repeat them.

Labels: **[V]** means I checked it directly against a primary source (repo, registry, docs or source code). **[I]** means my inference. Anything older than Aug 2026 is marked *(background)*.

---

## TL;DR

1. **Every framework has converged on "agent-as-tool" delegation.** The old bespoke multi-agent APIs are being retired. Mastra deprecated `.network()` in favor of supervisor agents [V]. LangChain archived `langgraph-supervisor` and now recommends "the supervisor pattern directly via tools" [V]. ADK 2.x discourages direct `AgentTool` use in favor of `sub_agents` with `mode="single_turn"` [V]. AG2 v1.0 dropped `GroupChat`/`ConversableAgent` into "Classic" [V]. AutoGen's README now says "archived and no longer maintained" (docs commit 2026-10-16) [V]. **Implication:** inside one process, multi-agent is now a tool call. Real *agent-to-agent communication* across processes, vendors and people is the gap that Agent Relay fills. That is the pitch.
2. **No framework ships a TypeScript Agent Relay adapter.** `@agent-relay/sdk@14.0.0` exports only `actions`, `session`, `delivery`, `messaging` and `capabilities` [V]. The Python adapters (`on_relay()` for `openai-agents`, `crewai`, `google-adk` and `agno`) exist in `agent-relay-sdk==14.0.0`, but the unreleased major **removes the Python SDK** (sibling `../agent-relay/02-newest-features.md`). In TS you write the 4-5 relay tools yourself, which takes about 40 lines. The TS SDK is not going away: `@agent-relay/sdk@15.0.0-next.5` (npm `next` tag, published 2026-10-30T05:28Z) keeps the same six subpath exports as 14.0.0 [V, npm], so code against 14.0.0 subpaths should survive the next major (API-level compatibility not checked).
3. **Relaycast has a real A2A gateway, but it speaks A2A v0.3 method names only.** The engine handles `message/send`, `message/stream`, `task/get` and `task/cancel` [V, source]. Note the **singular** `task/`: the A2A v0.3.0 spec names these `tasks/get` and `tasks/cancel` [V, spec table line 217-219], so even a correct v0.3 client's task polling/cancel will hit the `default:` branch and get `-32601 Unsupported method` [V, source; behavior I]. Only `message/send` (and outbound `message/stream`) is safe to rely on. A2A **v1.0 renamed everything** to `SendMessage`, `SendStreamingMessage`, `GetTask` and so on [V, spec], so a v1.0-only client also gets `-32601`. Mastra serves v0.3 **and** v1.0 [V], and CrewAI pins `a2a-sdk~=0.3.10` [V], so those two are the safest A2A peers.
4. **The OpenAI Agents SDK is the most active and the best fit for actor state.** It shipped 13 Python releases (v0.19.2 to v0.24.0) and 12 JS releases (v0.14.2 to `@openai/agents@0.21.0`) since Aug 1 [V; counts corrected 2026-10-29 from an earlier "9 / 10"]. The headline items are **durable pending input on `RunState`** (py 0.20.0 Aug 11 / js 0.15.0 Aug 11), many handoff/session resume fixes, and pluggable `Session` storage. A `RunState` serializes to a string, which slots straight into a Terse `@Persisted` field. Terse even published a Python example that does exactly this (`TerseAI/durable-actors-openai-agents-sdk-python-example`, 2026-10-12) [V].
5. **For this event, the low-risk stack is TS: Terse actor per agent + (OpenAI Agents JS *or* Mastra supervisor) as the brain + `@agent-relay/sdk` as the bus.** Python frameworks (LangGraph, CrewAI, ADK, Pydantic AI, AG2) can join as **A2A peers** or through hand-rolled REST calls to Relaycast. They shouldn't be the backbone, because Relay's Python SDK is being deleted.

---

## 1. Comparison matrix (as of 2026-10-29)

| Framework | Latest release [V] | Releases since Aug 1 [V] | In-process multi-agent primitive | State you'd persist in an actor | A2A support [V] | Best Agent Relay seam [I] |
|---|---|---|---|---|---|---|
| **OpenAI Agents SDK** (py / js) | py v0.24.0 (Oct 15); js 0.21.0 (Oct 20) | 13 py / 12 js | `handoffs=[...]` (`transfer_to_<agent>` tool), `Agent.as_tool()` | `result.to_input_list()` (py) / `RunState.toString()` → `RunState.fromString(agent, s)` (js); custom `Session` | none built-in | relay tools on the agent; relay listener → actor method → `Runner.run` |
| **Mastra** (TS) | `@mastra/core@1.80.0` (Oct 28) | ~weekly 1.6x→1.80 | supervisor: `agents: {a, b}` + `delegation` hooks; `.network()` **deprecated** | message history in actor; don't also enable Mastra Memory | serves v0.3 + v1.0; `A2AAgent` client | Mastra tool wrapping `@agent-relay/sdk`; or register Mastra's agent card with Relay |
| **LangGraph** (py / js) | 1.2.18 (Oct 26); `@langchain/langgraph@1.5.3` (Oct 26) | 8 py 1.2.x | `Command(goto=...)`, subgraphs; supervisor-via-tools; `langgraph-swarm` | checkpointer (`thread_id`) | none native (I found none) | graph node that posts to Relay; checkpointer owns state, so the actor holds the `thread_id` only |
| **CrewAI** (py) | 1.15.33 (Oct 29) | ~33 patch releases | Crews (sequential/hierarchical), Flows; conversational flows **stable** in 1.15.18 | Flow state (`persist` now exported, 1.15.33) | `crewai[a2a]` → `a2a-sdk~=0.3.10` | A2A peer (v0.3 matches Relay) |
| **AG2** (py) | v1.2.2 (Oct 27) | v1.0.2→v1.2.2 (~10) | v1 "protocol-driven" agents, subagents with bounded fan-out; `GroupChat` moved to `ag2-classic` | `ConversationContext`; ACP `session/load` | A2A server, multi-replica (v1.2.0), signed cards (v1.0.2); `a2a-sdk>=1.2.0` | A2A peer, but check v0.3 compatibility first |
| **AutoGen** (py) | python-v0.7.5 (2025-09-30) *(background)* | 0 | n/a | n/a | n/a | **Don't use.** README says archived; successor is Microsoft Agent Framework |
| **Microsoft Agent Framework** (py / .NET) | python-1.23.0 (Oct 22); dotnet-1.26.0 (Oct 23) | weekly | orchestrations: handoff, group chat, Magentic; graph workflows with checkpoints | workflow checkpoints | `agent-framework-a2a` (beta `1.0.0b261022`) → `a2a-sdk>=1.0.0,<2` | A2A peer (v1 SDK, so verify) |
| **Google ADK** (py / js / go) | py v2.13.0 (Oct 23); js 2.4.0 (Oct 28) | py v2.6→v2.13 | `sub_agents` + `mode` (`chat`/`task`/`single_turn`), graph `Workflow`, Sequential/Parallel/Loop | `SessionService` (Mongo added 2.13, SQLite memory 2.11) | `RemoteA2aAgent` (+`context_builder` 2.10); `a2a-sdk>=0.3.4,<2` | `RemoteA2aAgent` pointed at Relay, or A2A peer |
| **Pydantic AI** (py) | v2.63.0 (Oct 28) | ~35 (v2.2x→v2.63) | delegation via tools, output-function handoff, `pydantic_graph`, `SubAgents` capability | `message_history` (JSON-serializable) | `agent.to_a2a()` via `fasta2a` (v0.3 method names natively, plus a v1 translation layer) | tool that calls Relaycast REST; or A2A peer |
| **Vercel AI SDK** (TS) | `ai@7.0.157` (Oct 29) | daily patches; 7.0.0 GA 2026-06-25 *(background)* | `ToolLoopAgent`; subagents = a tool whose `execute` calls another agent | `UIMessage[]` / `ModelMessage[]` | none | AI SDK `tool()` wrapping `@agent-relay/sdk`; streams subagent progress via generator tools |

---

## 2. Per-framework detail (multi-agent only)

### 2.1 OpenAI Agents SDK (sponsor: OpenAI)

- **Primitives [V]:** handoffs are tools named `transfer_to_<agent_name>`. `handoff()` takes `onHandoff`, `inputType` (a schema for model-chosen routing metadata), `inputFilter` (trims the history the next agent sees) and `isEnabled`. The docs warn that `isEnabled` "cannot authorize values inside an argument-bearing handoff", so you should authorize at the start of `onHandoff` and throw [openai-agents-js handoffs guide]. If the specialist should *not* take over, use agents-as-tools instead.
- **State [V]:** "serialize the state using `result.state.toString()` … resume later … `RunState.fromString(agent, serializedState)`". The `Session` interface has five async methods (`getItems`, `addItems`, `popItem`, `clear`, `snapshot`). Built-ins are `MemorySession`, `OpenAIConversationsSession` and `OpenAIResponsesCompactionSession` [context7: docs/guides/sessions.mdx, human-in-the-loop.mdx].
- **Last 90 days [V]:**
  - py v0.20.0 (Aug 11) and js 0.15.0 (Aug 11): `RunState.add_input()` / "durable pending input to RunState"; sessions receive run context.
  - py v0.22.0 (Aug 19): handoff targets expanded in agent graph visualization.
  - py v0.22.1 (Sep 8): "recover resumed handoffs after session append failures". js 0.17.1 (Sep 8): "preserve approvals before handoffs and recover resumed writes".
  - js 0.16.0 (Aug 15): handoffs accept Standard Schema; deterministic `ScriptedModel` testing utilities (py equivalent `agents.testing` in v0.21.0, Aug 15).
  - js 0.19.0 (Oct 5): selected handoff `inputFilter` is now **rejected** when combined with server-managed `conversationId`/`previousResponseId`; agent-tool streaming callbacks are bounded to 1024 pending events.
  - py v0.23.0 (Oct 1): "isolate nested agent tool state across fresh runs".
  - js 0.20.0 (Oct 8): model calls after approval resumes now **count toward `maxTurns`**.
  - js 0.21.0 (Oct 20): Runloop sandbox provider removed.
- **Terse fit [V]:** `TerseAI/durable-actors-openai-agents-sdk-python-example` keeps `_items_json = persisted("[]")` in a `ChatHistory(AsyncActor)`. It calls `Runner.run_streamed`, broadcasts `ResponseTextDeltaEvent` deltas to sockets, and persists `json.dumps(result.to_input_list())` only after success ("Serialize before changing persisted fields so a failed run leaves history intact"). The TS equivalent is a `@Persisted` string holding `RunState`/input items.
- **Gotchas [I from V notes]:** the realtime/voice agents (`@openai/agents-realtime`) also do handoffs, but voice adds risk in 5 hours. If you hand off between agents on different processes over Relay, you lose the SDK's tracing continuity, so log relay message IDs into your own trace.

### 2.2 Mastra (sponsor: Mastra)

- **`.network()` is deprecated [V]:** "Agent networks are deprecated and will be removed in a future major release. Replace them with supervisor agents that use `agent.stream()` or `agent.generate()`" (mastra.ai/docs/agents/networks). Don't build on `.network()` even though older tutorials use it.
- **Supervisor/subagents [V]:** `agents: { researchAgent, writingAgent }` on a parent `Agent` (added `@mastra/core@1.8.0`, *background*). Each subagent needs a `description`. `delegation.onDelegationStart` can reject a delegation, rewrite the prompt, set `modifiedMaxSteps` or attach `threadMetadata`. `onDelegationComplete` can `bail()`, return `feedback`, or replace `resultText`. Request-context values "must be JSON-serializable to work with durable agents" (mastra.ai/docs/subagents).
- **A2A [V via sibling]:** Mastra Server auto-exposes `/api/.well-known/<id>/agent-card.json` and `/api/a2a/<id>`, and selects v0.3 or v1.0 by the `A2A-Version` header. Since Relaycast only routes v0.3 method names, **Mastra is the one framework I'd expect to interoperate with Relay's A2A gateway without shims** [I, not tested].
- **Terse fit [V via sibling]:** `TerseAI/durable-actors-mastra-example` (Oct 14-18) runs `@mastra/core@1.76.0` as a plain library inside an actor. Siblings recommend letting the actor own state and not enabling Mastra Memory too. Mastra Durable Agents are still **Beta**, with 10+ open issues filed Oct 24-29 (`../mastra/03-github-code.md`).

### 2.3 LangGraph / LangChain

- **Direction [V]:** `langgraph-supervisor-py` is **archived** (last release 0.0.31, 2025-11-19). Its README says "We now recommend using the supervisor pattern directly via tools". `langgraph-swarm-py` is still alive but its last release was 0.1.0 (2025-12-04) *(background)*. The batteries-included multi-agent harness is now `deepagents` (30.8k stars; `deepagents@1.16.2` JS published 2026-10-30T00:44Z, i.e. the evening of Oct 29 Pacific) [V].
- **Last 90 days [V]:** these are mostly durability fixes for subgraphs and resume. 1.2.12 (Sep 21) added `response_schema` to `interrupt()`. 1.2.16 (Oct 16): "stop a subgraph from rerunning its finished tasks on resume" and "apply a resumed Command's update once"; checkpoint-postgres 3.2.0 adds `prune`. 1.2.17 (Oct 24) keeps the namespace in `RemoteGraph.stream(subgraphs=True)`. 1.2.18 (Oct 26) changes the `DeltaChannel` snapshot default to every 100 updates.
- **Relay/actor seam [I]:** LangGraph wants to own persistence through its checkpointer. Two sources of truth (checkpointer + actor) is the classic trap. Either keep only the `thread_id` in the actor and let the checkpointer hold state, or skip LangGraph. A Relay cross-framework demo, `relay-cross-framework-demo` (LangGraph ↔ CrewAI, last push 2026-03-15, *background*), uses the Python SDK that's being removed (sibling `../agent-relay/03-github-code.md`).

### 2.4 CrewAI

- **Last 90 days [V]:** conversational flows were promoted to **stable** in 1.15.18 ("Let a chat flow declare its own state shape"). 1.15.29: `AgentExecutor` promoted out of experimental, and conversation routes are traced. 1.15.31: conversational flow context compaction. 1.15.33 (Oct 29): `persist` exported from `crewai.flow.flow`, and `crewai run --inputs` passed to Python flows. Most other features are about `crewai eval` and the AMP platform.
- **A2A [V]:** the `crewai[a2a]` extra pins `a2a-sdk~=0.3.10`, which **matches Relaycast's v0.3 method names**.
- **Seam [I]:** run a Crew behind an A2A server and register it with Relay via `POST /v1/a2a/register {agent_card_url}`. It then appears as a DM-able proxy agent in the workspace.

### 2.5 AutoGen → AG2 and Microsoft Agent Framework

- **AutoGen is dead for new work [V]:** the README carries "Project archived and no longer maintained … New users should start with Microsoft Agent Framework" (docs commits 2026-10-16 and 2026-10-28). Its last release was python-v0.7.5 (2025-09-30). GitHub's `archived` flag is still `false`, but the README is explicit.
- **AG2 v1.0 (2026-07-27, *background*) [V]:** "`pip install ag2` … `pip install autogen` → AG2 Classic, maintenance mode … v1.0 is not a drop-in upgrade". `GroupChat`, `ConversableAgent` and nested chats live in `ag2-classic`. Since Aug: ACP serve + resume (`session/load`, v1.0.4 Sep 7), bounded subagent fan-out (v1.0.4), `MessageEnqueued` events for live sessions (v1.1.0 Sep 24), A2A multi-replica servers and cacheable cards (v1.2.0 Oct 11), Mistral realtime voice for `ag2.live` (v1.2.1 Oct 21), and A2A empty-artifact fixes (v1.2.2 Oct 27). It pins `a2a-sdk>=1.2.0`.
- **Microsoft Agent Framework [V]:** 1.0 GA was 2026-04-02 *(background)*. Recent work: python-1.21.0 (Oct 8) rejects unknown group-chat participants and sanitizes handoff tool names; 1.22.0 (Oct 15) resets Magentic participants on replan and has a **[BREAKING]** AG-UI trust-boundary change; 1.23.0 (Oct 22) forwards allowlisted A2A metadata. `agent-framework-a2a` requires `a2a-sdk>=1.0.0,<2`, and the package itself is still a **beta** on PyPI (`1.0.0b261022`) even though core MAF is GA [V].
- **Seam [I]:** both are Python- or .NET-first enterprise stacks. Use them at this hackathon only if a teammate already knows them, and only as an A2A peer.

### 2.6 Google ADK

- **2.0 model [V]:** "The ADK 2.0 release introduces the Workflow Runtime, transitioning ADK from a hierarchical agent executor to a graph-based execution engine" (v2.0.0, 2026-05-19, *background*). Coordinator agents list `sub_agents`. Each subagent gets a `mode`: `chat` (manual `transfer_to_agent` back), `task` (auto-return via `finish_task`) or `single_turn` (no user interaction, **can run in parallel**). ADK "auto-injects delegation tools named after each subagent". `AgentTool`'s docstring says "Direct usage of `AgentTool` is discouraged" (adk.dev/workflows/collaboration; `agent_tool.py`).
- **Last 90 days [V]:** v2.10.0 (Sep 25) added `context_builder` to `RemoteA2aAgent`. v2.11.0 (Oct 2) added workflow tool confirmation, `abort_signal`, and a SQLite memory service. v2.12.0 (Oct 13) cut time to first model request by 40% in long sessions and added `require_confirmation` on workflow nodes. v2.13.0 (Oct 23) added `ClassifierNode` for routing, a MongoDB session service, live barge-in, and "promote 12 mature experimental features to stable". ADK JS reached 2.4.0 on Oct 28.
- **Caveat [V]:** "The collaborative mode `task` behavior is disabled for use in graph-based workflows in ADK Python v2.0.0."
- **Seam [I]:** `RemoteA2aAgent` as a `sub_agent` whose URL is Relay's workspace agent card could, in principle, let a Gemini coordinator "transfer" into the relay. ADK's `a2a-sdk>=0.3.4,<2` range spans both protocol generations, so pin `a2a-sdk` 0.3.x to be safe. This is untested.

### 2.7 Pydantic AI

- **Levels [V]:** the docs list "(1) single agent … (2) Agent delegation, agents using another agent via tools; (3) Programmatic agent hand-off; (4) Graph based control flow; (5) Deep Agents". For delegation, pass `usage=ctx.usage`. "Cancellation is run-scoped … a shared `CancellationToken` cancels a whole tree of runs." Inside Temporal, "`usage=ctx.usage` does not carry the delegate's usage back" (ai.pydantic.dev/multi-agent-applications).
- **Last 90 days [V]:** the pace is very high (v2.30.0 Aug 14 to v2.63.0 Oct 28). Multi-agent-relevant items: `DecisionHandOff` / `UnfillableRoute` routing (v2.50.0 Sep 25); `SubAgents` background task output framed as `<task_output>` (v2.60.0 Oct 23); `DetectLoops` capability (v2.63.0 Oct 28); durable-execution fixes (stable `run_id` on re-execution, v2.55.0); and lots of realtime work (`RealtimeSession.enqueue()` for out-of-band prompts, v2.40.0 Sep 5; GPT-Live/Gemini Live).
- **Seam [I]:** `RealtimeSession.enqueue()` is a natural sink for incoming Relay DMs (a voice agent that "hears" messages from other agents). It's Python, though, so you'd call Relaycast REST directly.

### 2.8 Vercel AI SDK

- **Model [V]:** `ToolLoopAgent`. "A subagent is an agent that a parent agent can invoke. The parent delegates work via a tool". You pass `abortSignal` through, use `convertToModelMessages(..., { ignoreIncompleteToolCalls: true })` after aborts, and stream subagent progress with `async function*` `execute`, where "each `yield` replaces the previous output entirely" and `readUIMessageStream` accumulates it (ai-sdk.dev/docs/agents/subagents). There's no handoff primitive. Control always returns to the parent.
- **Versions [V]:** `latest` = 7.0.157 (Oct 29). 7.0.0 went GA on 2026-06-25 *(background)*, and the 6.x line is still patched (`ai-v6` = 6.0.319).
- **Relay ecosystem [V]:** `@relayfile/agents@0.10.75` ships `./vercel`, `./openai` and `./langchain` adapters. They are for **Relayfile** (shared filesystem/writeback), not messaging. A Relay internal trajectory (2026-07-15, *background*) planned a "relay-native ToolLoopAgent harness", but I found no shipped package.

---

## 3. Integration patterns for "both hosts" (Relay + Durable Actors)

**Pattern A: Relay as tools (fastest; works with every framework) [I, from V APIs].** Give each agent 4 tools that wrap `@agent-relay/sdk`: `relay_send(to, text)` (→ `sendMessage({to:'#ch'|'@name'})`), `relay_inbox()`, `relay_agents()`, `relay_post(channel, text)`. These mirror the Python `on_relay()` tool names, so judges from Relay will recognize them. In TS, build them as an OpenAI Agents `tool()`, a Mastra `createTool()` or an AI SDK `tool()`. Mind sibling gotchas: DMs arrive as `dm.received`, not `message.created`; `register()` rejects existing names; the hosted free tier caps at 5 agents.

**Pattern B: one Terse actor per agent, Relay as its mailbox (best story) [I].** Each persona is an actor holding `@Persisted` framework state (OpenAI `RunState` string or input-item list; Mastra/AI SDK message array). A single relay listener process routes each `dm.received` or `message.created` to `actor(<recipient>).onRelayMessage(envelope)`. The actor runs one framework turn (marked `@Interleave` so it doesn't block, per `../terse/01-docs-api.md`), persists, and replies via Pattern A tools. Alarms let an agent "wake" and DM others unprompted, which suits Halloween hauntings. Kill the server mid-conversation, restart, and the agent resumes with its memory. That one demo hits both tracks.

**Pattern C: A2A federation (most "interop", least tested) [V API, I behavior].** Relaycast's `POST /v1/a2a/register` takes `{agent_card_url | agent_card, auth_scheme: bearer|api_key|none, auth_credential, target_agent}` and creates a local proxy address. DMs to it are forwarded to the external agent, and inbound calls hit `POST /a2a/rpc` (root, no `/v1`). The TS SDK exposes `registerA2a`, `listA2aAgents`, `getA2aAgentCard` and `removeA2aAgent` (`packages/sdk-typescript/src/relay.ts`). Delivery is **at least once** with 24 h idempotency, so receivers must dedupe. **Inbound federated delivery refuses `message/stream`** ("use message/send"), and only v0.3 send/stream names plus the non-standard singular `task/get`/`task/cancel` are routed. Spec-conformant `tasks/get` polling will fail. Hook up a Mastra- or CrewAI-served agent and you get "a Python Crew and a TS Mastra agent in the same Relay channel".

---

## 4. Limits / could not verify

- **I did not run** Pattern C end to end. A2A interop with any framework is inferred from source and specs. Relaycast's A2A JSON uses snake_case fields (`context_id`, `message_id`) in responses. Whether a strict camelCase v0.3 client parses them is untested.
- The Relaycast README lists `POST /v1/a2a/register`, while `openapi.yaml` lists `/a2a/register` at root. The TS SDK uses `/v1/a2a/register`.
- I didn't check whether `a2a-sdk` 1.x clients (AG2, MAF) fall back to v0.3 method names when an agent card advertises 0.3.
- Pydantic AI's `fasta2a` (2.1.1) maps v1 names to v0.3 ones internally (`'SendMessage': 'message/send'`, `'GetTask': 'tasks/get'` in `fasta2a/jsonrpc_v1.py`), so it speaks v0.3 natively [V, source]. The PyPI `Source` link still says `pydantic/fasta2a`, but GitHub resolves that to `datalayer/fasta2a` [V]. Its `tasks/get` would still miss Relaycast's singular `task/get`.
- I found no LangGraph-native A2A server (LangGraph Platform may expose one). I didn't verify.
- Release counts are from `gh release list` and exclude tags without GitHub releases.
- I did no social-sentiment sweep. This angle is technical.

---

## Hackathon implications

**What to build (ranked) [I]:**
1. **"Séance": Pattern B in TypeScript.** Use 3-5 ghost personas, each a Terse actor running **OpenAI Agents JS** (sponsor, $100 credits each) or a **Mastra supervisor** (sponsor), talking over one Relay workspace with a live observer view. Show the in-process handoff (`transfer_to_<ghost>` or Mastra delegation) *and* the cross-process Relay DM side by side, and explain why each is used where it is. That shows you understand the framework/infrastructure split Relay's founder keeps drawing ("we'd built was infrastructure", sibling `../agent-relay/05-team-strategy.md`).
2. **Stretch goal: an A2A guest.** Register one external agent (a Mastra agent card, or a CrewAI A2A server) via `registerA2a` so a "foreign spirit" joins the channel. Do this only once item 1 works.

**Gotchas:**
- Don't use Mastra `.network()` (deprecated), `langgraph-supervisor` (archived), AutoGen (archived) or AG2 Classic APIs from old tutorials.
- Don't make Python the backbone: Relay's Python SDK is being removed. If you must, pin `agent-relay-sdk==14.0.0`.
- One source of truth for state. The actor owns history. Disable Mastra Memory, the LangGraph checkpointer and the OpenAI Conversations session for the same conversation, and persist only after a turn succeeds (copy Terse's py example).
- OpenAI JS ≥0.19: handoff `inputFilter` plus `previousResponseId`/`conversationId` throws. Use client-managed history.
- OpenAI JS ≥0.20: approval resumes count toward `maxTurns`, so raise it for multi-agent loops.
- Relay A2A routes v0.3 `message/send`/`message/stream` only (its task methods are spelled `task/get`/`task/cancel`, not the spec's `tasks/...`), has no inbound streaming, and delivers at least once. Design A2A peers to answer synchronously from `message/send` and don't poll tasks.
- Guard against agent ping-pong loops (each DM triggers a turn, which triggers a DM). Pydantic AI added `DetectLoops` for this exact reason. In TS, add a hop counter in message metadata and a per-actor rate limit, and remember the hosted free tier's 100-message trial budget (sibling note).

**Setup to do before Oct 31 (ideas and installs are allowed; code must be written at the event):**
- Cache `npm i @openai/agents@0.21.0 @mastra/core@1.80.0 ai@7.0.157 @agent-relay/sdk@14.0.0 @relaycast/engine@12.2.1 zod`, and the Terse `durable-actors` package per `../terse/`.
- Read (don't copy) `TerseAI/durable-actors-openai-agents-sdk-python-example/src/actors.py` and `TerseAI/durable-actors-mastra-example` to internalize the persist-after-success pattern.
- Decide the framework: OpenAI Agents JS if the demo is about handoffs and voice; Mastra if you want Studio traces and the Mastra-platform prize months.
- Prepare a 30-second architecture slide: "framework = brain (in-process delegation); Relay = nervous system (cross-agent messages); Actor = memory (durable state)."

**What judges and sponsors likely want [I]:** Relay wants visible, real agent-to-agent traffic, not a supervisor calling tools in one process. Terse wants persisted state, sockets and alarms on hosted Terse. OpenAI wants the Agents SDK or Realtime API used meaningfully. Mastra wants primitives beyond a single `generate()` (supervisor, delegation hooks, Studio). Supabase's "scale to millions" angle: state sharded per actor, Supabase for cross-agent queries and logs.

---

## Sources

- OpenAI Agents SDK releases: https://github.com/openai/openai-agents-python/releases (v0.19.2-v0.24.0); https://github.com/openai/openai-agents-js/releases (v0.14.2-0.21.0)
- OpenAI handoffs guide: https://openai.github.io/openai-agents-js/guides/handoffs/
- OpenAI sessions / HITL docs (via context7): https://github.com/openai/openai-agents-js/blob/main/docs/src/content/docs/guides/sessions.mdx ; https://github.com/openai/openai-agents-js/blob/main/docs/src/content/docs/guides/human-in-the-loop.mdx
- Terse + OpenAI Agents example: https://github.com/TerseAI/durable-actors-openai-agents-sdk-python-example (README, src/actors.py)
- Terse + Mastra example: https://github.com/TerseAI/durable-actors-mastra-example
- Mastra subagents: https://mastra.ai/docs/subagents ; networks (deprecated): https://mastra.ai/docs/agents/networks ; releases: https://github.com/mastra-ai/mastra/releases
- LangGraph releases: https://github.com/langchain-ai/langgraph/releases ; https://github.com/langchain-ai/langgraphjs/releases
- langgraph-supervisor (archived): https://github.com/langchain-ai/langgraph-supervisor-py ; swarm: https://github.com/langchain-ai/langgraph-swarm-py ; deepagents: https://github.com/langchain-ai/deepagents
- CrewAI releases: https://github.com/crewAIInc/crewAI/releases ; PyPI metadata: https://pypi.org/pypi/crewai/json
- AutoGen README (archived notice): https://github.com/microsoft/autogen
- AG2 releases (v1.0.0 notes, v1.0.2-v1.2.2): https://github.com/ag2ai/ag2/releases
- Microsoft Agent Framework releases: https://github.com/microsoft/agent-framework/releases
- Google ADK releases: https://github.com/google/adk-python/releases ; https://github.com/google/adk-js/releases
- ADK collaboration / patterns / graphs docs: https://adk.dev/workflows/collaboration/ ; https://adk.dev/workflows/patterns/ ; https://adk.dev/graphs/ ; https://github.com/google/adk-docs/blob/main/docs/2.0/index.md ; https://github.com/google/adk-python/blob/main/src/google/adk/tools/agent_tool.py
- Pydantic AI releases: https://github.com/pydantic/pydantic-ai/releases ; multi-agent docs: https://ai.pydantic.dev/multi-agent-applications/
- Vercel AI SDK subagents: https://ai-sdk.dev/docs/agents/subagents ; releases: https://github.com/vercel/ai/releases ; npm dist-tags for `ai`
- A2A spec v1.0 method mapping: https://github.com/a2aproject/A2A/blob/v1.0.1/docs/specification.md ; https://a2a-protocol.org/latest/whats-new-v1/
- A2A spec v0.3.0 method table (`tasks/get`, `tasks/cancel`): https://github.com/a2aproject/A2A/blob/v0.3.0/docs/specification.md
- fasta2a v1 mapping: https://github.com/datalayer/fasta2a/blob/main/fasta2a/jsonrpc_v1.py ; PyPI: https://pypi.org/pypi/fasta2a/json
- `@agent-relay/sdk` next tag: `npm view @agent-relay/sdk@15.0.0-next.5 exports`
- Relaycast A2A: https://github.com/AgentWorkforce/relaycast/blob/main/openapi.yaml ; https://github.com/AgentWorkforce/relaycast/blob/main/packages/engine/src/routes/a2a.ts ; https://github.com/AgentWorkforce/relaycast/blob/main/packages/sdk-typescript/src/relay.ts ; README; https://agentrelay.com/docs/markdown/relaycast-api.md
- `@agent-relay/sdk` exports: https://www.npmjs.com/package/@agent-relay/sdk ; `@relayfile/agents`: https://github.com/AgentWorkforce/relayfile/tree/main/packages/agents
- PyPI A2A dependency pins: https://pypi.org/pypi/google-adk/json , /ag2/json , /agent-framework-a2a/json
- Sibling research: `../agent-relay/01-docs-api.md`, `../agent-relay/02-newest-features.md`, `../agent-relay/03-github-code.md`, `../agent-relay/05-team-strategy.md`, `../mastra/01-docs-api.md`, `../mastra/03-github-code.md`, `../terse/01-docs-api.md`, `../terse/03-github-code.md`

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live sources (`gh release list/view`, `gh api`, npm registry, PyPI JSON, Exa fetch of docs). Outcome key: CONFIRMED / CORRECTED / ADDED / QUALIFIED.

| # | Claim | How checked | Outcome |
|---|---|---|---|
| 1 | OpenAI Agents py latest v0.24.0 (Oct 15), js 0.21.0 (Oct 20) | `gh release list` both repos; `npm view @openai/agents` (0.21.0, published 2026-10-20T22:14Z) | CONFIRMED |
| 2 | "9 py / 10 js releases since Aug 1" | `gh release list` filtered `publishedAt > 2026-08-01` | **CORRECTED** to 13 py (v0.19.2-v0.24.0) and 12 js (v0.14.2-0.21.0; js tags switched from `vX` to `@openai/agents@X` at 0.19.0, which likely caused the undercount) |
| 3 | py v0.20.0 (Aug 11) adds durable pending input to `RunState`; py v0.23.0 "isolate nested agent tool state" | release bodies (PR #4325; #5123) | CONFIRMED (v0.20.0 also switched the default model to `gpt-5.6-luna`) |
| 4 | js 0.19.0 rejects handoff `inputFilter` with `conversationId`/`previousResponseId`; 1024-event bound; 0.20.0 approval resumes count toward `maxTurns`; 0.21.0 removes Runloop | `@openai/agents-core@0.19.0/0.20.0/0.21.0` release bodies (changesets 00eef0c, 39d5e9e, 8567e09, 7b05470) | CONFIRMED (notes live on the `agents-core` release, not `@openai/agents`) |
| 5 | `@mastra/core@1.80.0` (Oct 28); `.network()` deprecated with quoted text | npm time (2026-10-28T13:39Z); Exa fetch of mastra.ai/docs/agents/networks | CONFIRMED, quote verbatim |
| 6 | Mastra serves A2A v0.3 + v1.0 by `A2A-Version` header | `gh search code` finds `A2A-Version` in `packages/core/src/a2a/compat/v1.ts`, `packages/server/src/server/handlers/a2a.ts` | QUALIFIED: header handling and a v1 compat module exist; end-to-end behavior not run |
| 7 | Relaycast routes only `message/send`, `message/stream`, `task/get`, `task/cancel`; inbound refuses streaming | `a2a.ts` on main (repo pushed 2026-10-29T17:42Z), lines 472-485 and 631-643 | CONFIRMED, and **ADDED**: `task/get`/`task/cancel` are singular, while the A2A v0.3.0 spec says `tasks/get`/`tasks/cancel`. Standard v0.3 task polling will get -32601 |
| 8 | A2A v1.0 renamed methods to `SendMessage`, `SendStreamingMessage`, ... | A2A spec at tag v1.0.1, binding table line 1164-1166 | CONFIRMED |
| 9 | CrewAI 1.15.33 (Oct 29) exports `persist`; `crewai[a2a]` pins `a2a-sdk~=0.3.10`; conversational flows stable in 1.15.18 | `gh release view`; PyPI `requires_dist` | CONFIRMED (1.15.18 was 2026-08-27) |
| 10 | AG2 v1.2.2 (Oct 27), multi-replica A2A in v1.2.0, `a2a-sdk>=1.2.0` | releases; PyPI | CONFIRMED (pin is `>=1.2.0,<2`) |
| 11 | MAF python-1.23.0 (Oct 22), `agent-framework-a2a` needs `a2a-sdk>=1.0.0` | releases; PyPI | CONFIRMED, and **ADDED** that `agent-framework-a2a` is still beta (`1.0.0b261022`); 1.22.0 has several [BREAKING] items, not only AG-UI |
| 12 | Google ADK py v2.13.0 (Oct 23) with `ClassifierNode`, MongoDB sessions, barge-in, 12 features to stable; `AgentTool` direct use discouraged; `a2a-sdk>=0.3.4,<2` | release body; `agent_tool.py` line 166; PyPI | CONFIRMED (MongoDB services are marked experimental) |
| 13 | Pydantic AI v2.63.0 (Oct 28) `DetectLoops`; v2.60.0 `<task_output>` | release bodies | CONFIRMED |
| 14 | AutoGen archived notice; last release python-v0.7.5 (2025-09-30); GitHub `archived=false` | README via `gh api`; `gh api repos/microsoft/autogen` | CONFIRMED |
| 15 | `langgraph-supervisor-py` archived, last 0.0.31 (2025-11-19), "supervisor pattern directly via tools" quote; swarm 0.1.0 (2025-12-04); deepagents 30.8k stars, JS 1.16.2 "Oct 30" | `gh api`, `gh release list`, npm time | CONFIRMED; deepagents date **QUALIFIED** (2026-10-30T00:44Z UTC = Oct 29 Pacific) |
| 16 | `ai@7.0.157` latest (Oct 29), 7.0.0 GA 2026-06-25, `ai-v6`=6.0.319; subagent doc quote | npm dist-tags and time; Exa fetch ai-sdk.dev | CONFIRMED |
| 17 | `@agent-relay/sdk@14.0.0` exports only actions/session/delivery/messaging/capabilities | `npm view ... exports` | CONFIRMED; **ADDED** that `15.0.0-next.5` keeps the same exports |
| 18 | Terse OpenAI-Agents Python example created 2026-10-12; Mastra example Oct 14-18 | `gh api` created_at/pushed_at | CONFIRMED |
| 19 | $100 OpenAI credits each; Mastra platform months as prizes | EVENT_PAGE.md | CONFIRMED (Mastra months go to 1st/2nd/3rd: 3/2/1 months) |
| 20 | `fasta2a` protocol version (previously "not checked") | `fasta2a/jsonrpc_v1.py` source | RESOLVED: v0.3 native with v1 translation; repo now at `datalayer/fasta2a` |

Not re-verified (left as originally labeled): Python `on_relay()` adapters and the claim that the next Relay major removes the Python SDK (sibling-sourced; PyPI `agent-relay-sdk` is still 14.0.0 with no pre-release visible), the hosted free tier's 5-agent / 100-message caps, LangGraph 1.2.12-1.2.17 item details, ADK `task`-mode caveat quote, and Pydantic AI docs quotes. No quotes or URLs were found to be fabricated.
