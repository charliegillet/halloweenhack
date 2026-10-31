# OpenAI: GitHub and code reality (angle 03)

Prepared 2026-10-29 for Haunted Hacks (Sat 2026-10-31, 11:00-16:00 build). This angle covers what the code says, not what the marketing says: repos, stars, release cadence, open issues, official examples, and the sharp edges a 5-hour team will hit. All numbers come from `gh api` / `gh release list` / `gh issue list` / GitHub search, pulled on 2026-10-29 (UTC). Star and issue counts move daily.

Labels: **[Verified]** means read directly from a repo, release, issue, or OpenAI docs page on 2026-10-29. **[Inference]** means my reading of that evidence. Items before 2026-08-01 are marked **(background)**.

---

## 1. Summary

- **[Verified]** OpenAI's real-time voice surface has split in two. The **Realtime API** (`gpt-realtime-2.1`, `gpt-realtime-2.1-mini`, etc.) still exists. Next to it is a newer **Live API** with the model **`gpt-live-1`**: a full-duplex voice model that hands reasoning and tools off ("delegates") to a Responses model or to your own agent. Live was added to `openai-python` in v3.12.0 on 2026-09-10 ([changelog](https://github.com/openai/openai-python/blob/main/CHANGELOG.md)). gpt-live-1 is priced at **$0.05/min billed per second**, accounts on the **Free tier are not supported**, and the limit is **50 concurrent sessions at the Build tier** ([model page](https://developers.openai.com/api/docs/models/gpt-live-1)).
- **[Verified]** OpenAI now offers a hosted **Agents API** (`client.beta.agents.sessions.create(...)`) with server-side sessions, environments, vaults, automations, subagents, and traces. It was added in openai-python v3.13.0 on 2026-09-10 ([changelog](https://github.com/openai/openai-python/blob/main/CHANGELOG.md); [config guide](https://developers.openai.com/api/docs/guides/agents-api/configuration)). **[Inference]** It is a managed "durable agent session". That makes it a conceptual competitor to Terse Durable Actors, so if you use it, put your durable state in Terse, not in OpenAI.
- **[Verified]** There is also a new **Decisions API** (`client.decisions.create`) for classifier, router, and gate questions (predicate, choice, score). It was added in openai-python v3.26.0 on 2026-10-06, and openai-agents-python has recipes for it ([examples/decisions](https://github.com/openai/openai-agents-python/tree/main/examples/decisions)).
- **[Verified]** Both major SDKs shipped breaking majors this summer. **openai-node 7.0.0 (2026-07-27) requires Node.js 22**. **openai-python 3.0.0 (2026-08-12) replaced `httpx` with HTTPX2**, and `httpx` is no longer installed by default. The changelog mentions a "temporary, runtime-only legacy HTTPX escape hatch". Several official starter repos still pin `openai@^4`.
- **[Verified]** Release cadence is very fast. openai-python has shipped 7 releases since 10-21, openai-node 8 since 10-18, Codex ships alphas several times a day, and the Agents SDKs release about every 1-2 weeks. Pin your versions on Friday.

---

## 2. Repo scoreboard (pulled 2026-10-29)

| Repo | Stars | Forks | Open issues* | Last push | Latest release |
|---|---:|---:|---:|---|---|
| [openai/codex](https://github.com/openai/codex) | 131,569 | 20,788 | 25,399 issues + 164 PRs | 10-29 | 0.166.0 (10-29) |
| [openai/openai-cookbook](https://github.com/openai/openai-cookbook) | 76,866 | 13,024 | 346 | 10-29 | n/a |
| [openai/openai-python](https://github.com/openai/openai-python) | 31,977 | 7,296 | 40 issues | 10-29 | v3.41.0 (10-28) |
| [openai/openai-agents-python](https://github.com/openai/openai-agents-python) | 30,381 | 4,958 | 12 issues, 3 PRs | 10-27 | v0.24.0 (10-15) |
| [openai/skills](https://github.com/openai/skills) | 28,398 | 1,968 | 295 | 10-28 | n/a |
| [openai/symphony](https://github.com/openai/symphony) | 27,860 | n/a | n/a | 09-15 | n/a |
| [openai/openai-node](https://github.com/openai/openai-node) | 11,243 | 1,628 | 7 | 10-29 | v7.45.1 (10-27) |
| [openai/openai-realtime-agents](https://github.com/openai/openai-realtime-agents) | 7,010 | 1,102 | 34 | **01-07** | n/a |
| [openai/openai-cs-agents-demo](https://github.com/openai/openai-cs-agents-demo) | 6,597 | 1,018 | 28 | 2025-12-18 | n/a |
| [openai/openai-agents-js](https://github.com/openai/openai-agents-js) | 3,955 | 994 | 18 | 10-29 | 0.21.0 (10-20) |
| [openai/openai-realtime-console](https://github.com/openai/openai-realtime-console) | 3,617 | 1,407 | 54 | **2025-08-28** | n/a |
| [openai/openai-apps-sdk-examples](https://github.com/openai/openai-apps-sdk-examples) | 2,382 | 534 | 125 issues | **04-15** | n/a |
| [openai/chatkit-js](https://github.com/openai/chatkit-js) | 1,968 | 193 | 61 issues | 07-31 | chatkit 1.9.0 / react 1.6.1 (07-31) |
| [openai/mcp-extensions](https://github.com/openai/mcp-extensions) | 1,113 | n/a | 18 total | 10-30 | n/a (created 09-29) |
| [openai/openai-cli](https://github.com/openai/openai-cli) | 1,142 | n/a | n/a | 10-29 | n/a (created 2026-05-01) |
| [openai/realtime-voice-component](https://github.com/openai/realtime-voice-component) | 886 | n/a | n/a | 04-27 | not on npm |
| [openai/openai-responses-starter-app](https://github.com/openai/openai-responses-starter-app) | 881 | 304 | 8 | 2025-12-15 | n/a |
| [openai/openai-chatkit-starter-app](https://github.com/openai/openai-chatkit-starter-app) | 889 | 1,163 | 51 | 03-27 | n/a |
| [openai/openai-live-console](https://github.com/openai/openai-live-console) | 34 | n/a | n/a | 09-12 | n/a (created 09-10) |

\*GitHub's `open_issues_count` lumps issues and PRs together. The split numbers come from the search API.

Activity since 2026-08-01, from commit-list pagination **[Verified]**: codex about 4,084 commits, openai-node about 935, openai-agents-python about 699, openai-python about 416, openai-agents-js about 387. Contributor counts, including anonymous ones: codex about 696, agents-python about 408, agents-js about 128.

**[Inference]** The Agents SDKs are well maintained. Each has only about 12-18 open issues, and in agents-python 259 issues were filed since Aug 1 while just 12 remain open. Bugs get fixed fast, but you can still land on a fresh regression. Codex is the opposite: about 17,159 issues filed since Aug 1 and about 25.4k open, so its tracker is effectively a firehose.

---

## 3. What actually shipped, Aug-Oct 2026, read from the code

### 3.1 SDKs (openai-python / openai-node)
**[Verified]** from [openai-python CHANGELOG](https://github.com/openai/openai-python/blob/main/CHANGELOG.md) and [openai-node CHANGELOG](https://github.com/openai/openai-node/blob/master/CHANGELOG.md):
- 08-12 python **3.0.0**: HTTPX2 becomes the default client. This is breaking for anyone passing custom `httpx` clients or transports.
- 09-10 python 3.12.0 **adds the Live API**. 3.13.0 **adds the Agents API**. Later releases add agent session model settings (3.15), env-var vault credentials (3.17), computer use in beta agents (3.22), custom voice creation plus agent session events (3.24), **standalone Decisions** (3.26, 10-06), prewarmed hosted environments (3.27), and environment suspension/expiration (3.28).
- 10-21 python 3.36.0: Vertex AI support for Responses, custom voice consent management, compaction trigger IDs.
- 10-22 python **3.37.0 is a breaking change inside a minor release**. Live Decisions `question.instructions` can now be a string *or* a list of parts. Node 7.4x made the same kind of change, and `DecisionItemCreatedEvent.item` became a union.
- 10-26 python 3.39.0 adds the model id `gpt-6.1-terra`. 3.40/3.41 (10-27/28) add prompt-cache breakpoint TTLs, typed references in Realtime response inputs, and agent sessions filterable by metadata.
- Node changelog: **`gpt-image-1` was shut down on 2026-10-23**. Use `gpt-image-2.5-sunburst` / `gpt-image-2.5-flare`. The default for the Responses image tool is now `gpt-image-2`.

Resource modules in openai-python today **[Verified]** via the tree: `admin audio batches beta(agents) chat completions containers content_provenance_checks conversations decisions embeddings evals files fine_tuning images live models moderations realtime responses safety skills uploads vector_stores videos webhooks`.

### 3.2 Model identifiers in the SDK type literals [Verified]
- `ChatModel` begins with `gpt-6-astra, gpt-6.1-sol, gpt-6.1-terra, gpt-6-sol, gpt-6-luna, gpt-5.6-sol/terra/luna, gpt-5.5, gpt-5.4(-mini/-nano)...` ([chat_model.py](https://github.com/openai/openai-python/blob/main/src/openai/types/shared/chat_model.py)). The official Agents API docs example uses `gpt-6-astra`.
- The Realtime session `model` literal includes `gpt-realtime-2`, `gpt-realtime-2.1`, `gpt-realtime-2.1-mini`, `gpt-realtime-mini-2025-12-15`, `gpt-audio-1.5`, and older entries ([realtime_session_create_request_param.py](https://github.com/openai/openai-python/blob/main/src/openai/types/realtime/realtime_session_create_request_param.py)). `gpt-realtime-2.1` costs $4/$24 per 1M text tokens and $32/$64 per 1M audio tokens, with a 128k context window ([model page](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)).
- `gpt-live-1` is **only** served on `v1/live/sessions`. It does not work on Responses or Realtime. It supports function calling but not structured outputs ([model page](https://developers.openai.com/api/docs/models/gpt-live-1)).

### 3.3 Agents SDK (Python) [Verified]
Cadence since Aug: v0.19.2 (08-01) through v0.24.0 (10-15), about 14 releases ([releases](https://github.com/openai/openai-agents-python/releases)). Highlights:
- **v0.22.0 (08-19)**: if you pass an explicit `openai_client` together with `organization`/`project` to `OpenAIProvider`, it now **raises**. Non-streaming Responses with status `failed`/`incomplete` now raise `ModelBehaviorError`.
- **v0.23.0 (10-02)**: MCP listing page limits, Docker removal protection for the sandbox, and a scan budget for encrypted session history.
- **v0.24.0 (10-15)**: MCP tool annotations are exposed (`readOnlyHint`, `destructiveHint`) and run-wide tool exception formatting is supported. Many fixes to RunState resume, approvals, and Redis sessions.
- The package now ships a **sandbox agents** layer (`src/agents/sandbox`) with provider extensions for **blaxel, cloudflare, daytona, e2b, modal, vercel**, plus `examples/live` and `examples/decisions`. **Freestyle and Superserve are not in the provider list**, so a hackathon sponsor sandbox would need a custom adapter **[Verified by tree listing; Inference on effort]**.

### 3.4 Agents SDK (JS) [Verified]
- Packages: `agents`, `agents-core`, `agents-openai`, `agents-realtime`, `agents-extensions`. Releases 0.20.0 (10-08) and 0.21.0 (10-20).
- `agents-extensions` contains **`CloudflareRealtimeTransport`** (workerd cannot open outbound WebSockets with the global `WebSocket`, so the adapter upgrades through `fetch()`; it is labelled **beta**), `TwilioRealtimeTransport`, AI SDK adapters, and sandbox adapters for blaxel/cloudflare/daytona/e2b/modal/vercel ([cloudflare.mdx](https://github.com/openai/openai-agents-js/blob/main/docs/src/content/docs/extensions/cloudflare.mdx)).
- `examples/live` README: "GPT Live → managed Responses model → ask_order_agent → Agents SDK Agent". It **calls the Live HTTP/WebSocket endpoints directly because "the repository's OpenAI JS SDK 7.2.0 does not expose Live resource helpers"** (note that openai-node itself has had Live resources since 7.14.0 on 09-10; see §4 item 2), requires Node ≥22.18, and needs "a project API key with access to GPT Live" ([README](https://github.com/openai/openai-agents-js/blob/main/examples/live/README.md)).
- Realtime fixes in 0.20/0.21: audio interruption buffer clearing; WebRTC connections are rejected when the server errors before the session config is acknowledged (#466); the Twilio default audio format was preserved (#2072, a 0.20.0 regression that sent 24 kHz PCM to the model).

### 3.5 ChatGPT Apps: the Apps SDK is giving way to "MCP Extensions"
- **[Verified]** `openai-apps-sdk-examples` has had no push since 2026-04-15 and has 125 open issues. A new repo, [openai/mcp-extensions](https://github.com/openai/mcp-extensions) (created 09-29, 1.1k stars), ships `@openai/mcp-extensions` (TS) and `openai-mcp-extensions` (Py). It adds sidebar entrypoints, file-extension handlers, composer @-mentions, and extended forms. It tells you to use "`@Plugin Creator` in Codex" to scaffold.
- **[Verified]** ChatKit (`chatkit-js`) has not released since 07-31. Open issues include a domain-verification timeout that can remove the iframe (#216) and a broken Python quickstart in the README (#219, 10-28).

### 3.6 Codex
- **[Verified]** 0.165.0 (10-27) added a Vertex AI provider, GPT-6.1 Terra, experimental attached thread forks in the app-server API, and memory v2 on by default *for fresh profiles* ([release](https://github.com/openai/codex/releases/tag/rust-v0.165.0)). `sdk/` contains `python`, `python-runtime`, `typescript`.
- **[Verified]** The most-reacted issues since Aug are all about the client, not the API: daemon auto-start should be opt-in (#48195, 206 reactions, open), a macOS app "Cannot serialize value" error on the first message (#55744, closed), Windows terminal windows flashing (#48074), and **"unexpected status 401 Unauthorized"** (#48237, open, 97 comments) plus #48235 (401 across Desktop and CLI, now closed). Both 401 issues were filed on 09-25.

---

## 4. Gotchas a 5-hour team will hit (ranked)

1. **Live vs Realtime confusion.** `gpt-live-1` does not work on `/v1/realtime`, and `gpt-realtime-*` does not work on `/v1/live/sessions`. Live requires a project with Live access, and Free-tier projects are rejected. The official live-console README says "Model metadata access alone does not establish transport access" and "this repository is not a public-release approval" ([README](https://github.com/openai/openai-live-console)). **[Verified]** Run a real end-to-end voice call with the hackathon credit key on Friday. If it fails, fall back to `gpt-realtime-2.1` with `@openai/agents-realtime`.
2. **The agents-js Live example uses raw HTTP/WebSocket, but current openai-node does not need to.** *(Corrected 2026-10-29.)* The example README says it calls the endpoints directly because "the repository's OpenAI JS SDK 7.2.0 does not expose Live resource helpers" (§3.4). That statement is stale. **openai-node added the Live API in 7.14.0 (2026-09-10)** ([CHANGELOG](https://github.com/openai/openai-node/blob/master/CHANGELOG.md)), and current `src/resources/live/` ships `sessions.ts`, `sideband.ts`, `ws.ts`, and `forks.ts`. The example's `package.json` declares `"openai": "^7.2.0"`. The Python SDK also has `client.live`. **[Verified]** For a JS Live build, use `openai@7.45.x` Live resources and treat `examples/live/server.ts` as a reference for the delegation flow, not for the transport code.
3. **Stale official templates.** `openai-realtime-agents` (7k stars) pins `"@openai/agents": "^0.0.5"` and `"openai": "^4.77.3"`. A caret on 0.0.x locks you to exactly 0.0.5, versus 0.21.0 current. `openai-responses-starter-app` and the ChatKit-based `openai-cs-agents-demo` UI pin `openai@^4.87`, while current is 7.45. **[Verified]** Forking these brings in pre-GA APIs. Start from the Agents SDK `examples/` folders instead.
4. **SDK majors.** openai-node 7 needs **Node 22+** (the Live example wants 22.18; live-console wants 24.15.0). openai-python 3 uses **HTTPX2**, so any library that hands `httpx.AsyncClient` to `OpenAI(http_client=...)` breaks. **[Verified]**
5. **Breaking changes inside minor releases** to Decisions/Live types (python 3.37.0, node 7.4x). Pin exact versions in your lockfile. **[Verified]**
6. **Interruption and async tool edge cases in Realtime.** Open: agents-python #5416, where with `async_tool_calls=True` an interruption mid-tool leaves no pending marker. Recently fixed: #5190 (a barge-in truncates the previous item), #5068 (reconnect on the same model keeps stale state), #5070 (a failed `close()` blocks iterators forever), agents-js #2035 (overlapping audio playback ownership). **[Verified]** Expect demo glitches when judges talk over the agent. Use headphones; the live-console README warns about acoustic feedback.
7. **Billing does not stop on mute.** "Muting the microphone or speaker does not stop billing" (live-console). Live costs $0.05/min **plus** the backend Responses model **[Verified]**. **[Inference]** The $100 of OpenAI credits per participant (confirmed on the event page) is about 33 hours of pure gpt-live-1 voice time at $0.05/min, before backend model costs, so it covers hours of voice, but leaked sessions left open in tabs add up. Always call End or close.
8. **Delegation context is not the transcript.** With client delegation, "the delegation event contains metadata, not task text". The delegation mode is fixed at session creation ([live-delegation guide](https://developers.openai.com/api/docs/guides/live-delegation)). With Responses delegation the specialist "receives that request string, not the full voice transcript" (agents-js live README). **[Verified]** *(Added 2026-10-29.)* The guide's Responses-delegation sample sets `delegation.responses.model: "gpt-6-luna"` and suggests `gpt-6-sol` for harder backend tasks. That backend model is billed on top of the $0.05/min voice charge. The guide also says that in both modes "your application owns permissions, confirmations, business records, and task state", which is the opening for a durable actor. **[Verified]**
9. **Structured outputs sharp edges.** agents-python #5448 (Pydantic strict-mode Enum/date/UUID args rejected), #5412 (no arbitrary JSON in strict mode), agents-js #2095 (structured output fails when commentary and final JSON are concatenated). gpt-live-1 has no structured outputs at all. **[Verified]**
10. **Cloudflare/workerd runtimes.** You need `CloudflareRealtimeTransport` (beta) because global `WebSocket` will not connect outbound. **[Verified]** **[Inference]** If Terse Durable Actors run on a workerd-like runtime, the same constraint may apply. Check Terse docs; I did not verify this.
11. **MCP streamable HTTP**: agents-js #2047, where overlapping `listTools()` against a session-less server fails with "MCP tool listing became stale". **[Verified]** Call `listTools` once and cache it.
12. **Model retirements**: `gpt-image-1` shut down on 10-23, and `gpt-4o-transcribe` retirement was flagged in agents-python #5275 (10-01). **[Verified]** Code generated by tools with older training data will reference dead models.
13. **Codex auth flakiness**: open 401 issues (#48237). If you use Codex as your coding agent during the hack, log in and test on Friday. A self-updating daemon is the default (#48195). **[Verified]**
14. **Apps SDK / ChatGPT surface instability**: tools intermittently hidden (#240), `_meta` replaced on web (#231), file params missing on about 10% of calls (#237). **[Verified]** Avoid building the demo inside ChatGPT. A 5-hour demo should run in your own UI.

---

## 5. Community projects since Aug (GitHub search, by stars) [Verified existence; not code-reviewed]
- [rasonyang/ai-native-callcenter](https://github.com/rasonyang/ai-native-callcenter) ★477 (08-11): "AI talks, code controls the call."
- [heygen-com/liveavatar-gpt-live-demos](https://github.com/heygen-com/liveavatar-gpt-live-demos) ★247 (created 08-28): avatar plus GPT-Live. The repo was created about two weeks before Live reached the public SDKs on 09-10, which suggests a launch partner with early access **[Inference]**.
- [openspline/openspline](https://github.com/openspline/openspline) ★330 (09-29): realtime avatar video for voice AI.
- [davidmokos/expo-gpt-live](https://github.com/davidmokos/expo-gpt-live) ★138 (09-15): an Expo app with GPT-Live 1.
- [rehan-remade/open-annie](https://github.com/rehan-remade/open-annie) ★58 (10-07): a voice-driven 3D browser character; "the model that talks is not the model that moves", which is the delegation pattern.
- [wak31415/keryx](https://github.com/wak31415/keryx) ★2: a phone-callable agent with OpenAI Realtime for conversation and another agent SDK behind it.
- [temporal-community/durable-banking-agent-workshop](https://github.com/temporal-community/durable-banking-agent-workshop) ★2 (08-24): Temporal plus OpenAI Agents SDK, the nearest "durable + Agents SDK" prior art. GitHub search for "openai agents cloudflare durable objects" returned **no** repos.

**[Inference]** The popular pattern since August is a voice front end that delegates to a backend agent. Durable, multiplayer versions of that pattern are largely unexplored on GitHub.

---

## Hackathon implications

**What to build (OpenAI side) [Inference]:**
- **Voice front end → durable back end.** Use GPT-Live (or `gpt-realtime-2.1` as fallback) as the "haunted" voice, with **client delegation** into a Terse Durable Actor per room, ghost, or user. The actor holds state and dispatches to multiple specialist agents over Agent Relay. Client delegation is the mode where *your* app owns context and results, which is exactly where durable actors and agent-to-agent messaging fit. That covers both host tracks plus the Real-Time theme.
- Multiplayer: one actor per haunted house, with several browsers each holding their own Live/Realtime session (Build tier allows 50 concurrent sessions). The actor broadcasts state.
- Use the **Decisions API** as a cheap, legible gate or router, e.g. "is this a scare or a question?" or a tool-risk gate. It makes a nice visible "AI decision" panel in a demo.
- Avoid making OpenAI's hosted `beta.agents.sessions` the system of record. It duplicates what the host sponsor sells.

**Setup to do before Oct 31:**
1. Install Node 22.18+ (ideally 24.x) and Python 3.11+. Run `npm i openai@7.45.1 @openai/agents@0.21.0` / `pip install "openai==3.41.0" "openai-agents==0.24.0"` and **lock them**.
2. Clone `openai-agents-js` and from the repo root run `pnpm install && pnpm build && pnpm -F live start` with your credit key (these are the README's commands; verified 10-29). Separately run `examples/realtime-next` or `realtime-demo`. Confirm which voice path works for your project.
3. Confirm the account is not on the Free tier, and check that the gpt-live-1 and gpt-realtime-2.1 models list for your project (`openai models list`).
4. Pre-read: the [Live delegation guide](https://developers.openai.com/api/docs/guides/live-delegation), openai-node `src/resources/live/` (SDK Live helpers since 7.14.0), agents-js `examples/live/server.ts` (for the delegation flow), and agents-js `CloudflareRealtimeTransport` if your actor runtime is workerd-like.
5. Log in to Codex now; there are open 401 issues.

**What judges and sponsors likely want [Inference]:** the judging text rewards Durable Actors plus Agent Relay. OpenAI is a credit sponsor, so a live, interruptible voice demo that visibly delegates to stateful agents shows off its newest surface (GPT-Live delegation). Keep a fallback recording in case venue Wi-Fi or mic feedback breaks the live call.

---

## Limits / could not verify
- I did not run any code, so whether gpt-live-1 is reachable with hackathon-issued credits is **unverified**. The repo text itself says access is gated by project.
- I did not verify the DevDay 2026 date or announcements; that belongs to another angle. Model names come only from SDK literals and docs pages.
- Stars, forks, and issue counts are point-in-time snapshots. Commit and contributor counts come from pagination headers and are approximate.
- Community repos were not code-reviewed, and their star counts may include inorganic activity.
- I did not confirm whether Terse's runtime is workerd-compatible.
- Forks and stars for some newer repos were not pulled (n/a in the table).

## Sources
- https://github.com/openai/openai-python/blob/main/CHANGELOG.md
- https://github.com/openai/openai-python/blob/main/src/openai/types/shared/chat_model.py
- https://github.com/openai/openai-python/blob/main/src/openai/types/realtime/realtime_session_create_request_param.py
- https://github.com/openai/openai-python/blob/main/src/openai/resources/live/live.py
- https://github.com/openai/openai-node/blob/master/CHANGELOG.md
- https://github.com/openai/openai-agents-python/releases (v0.22.0, v0.23.0, v0.24.0)
- https://github.com/openai/openai-agents-python/tree/main/examples/decisions
- https://github.com/openai/openai-agents-python/issues/5416 , /5448 , /5412 , /5190 , /5068 , /5070 , /5275
- https://github.com/openai/openai-agents-js/releases (0.20.0, 0.21.0)
- https://github.com/openai/openai-agents-js/blob/main/examples/live/README.md
- https://github.com/openai/openai-agents-js/blob/main/docs/src/content/docs/extensions/cloudflare.mdx
- https://github.com/openai/openai-agents-js/issues/2095 , /2047 , /2035 , /2072 , /466
- https://github.com/openai/openai-live-console
- https://github.com/openai/realtime-voice-component
- https://github.com/openai/mcp-extensions
- https://github.com/openai/openai-apps-sdk-examples/issues (#231, #237, #240)
- https://github.com/openai/chatkit-js/issues (#216, #219)
- https://github.com/openai/openai-realtime-agents (package.json)
- https://github.com/openai/openai-responses-starter-app (package.json)
- https://github.com/openai/codex/releases/tag/rust-v0.165.0
- https://github.com/openai/codex/issues/48195 , /48237 , /48235 , /55744
- https://github.com/openai/openai-cli
- https://developers.openai.com/api/docs/models/gpt-live-1
- https://developers.openai.com/api/docs/models/gpt-realtime-2.1
- https://developers.openai.com/api/docs/guides/live
- https://developers.openai.com/api/docs/guides/live-delegation
- https://developers.openai.com/api/docs/guides/agents-api/configuration
- https://github.com/openai/openai-node/tree/master/src/resources/live
- https://github.com/openai/openai-agents-js/blob/main/examples/live/package.json
- /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md (credit amounts)

## Verification log (2026-10-29)

An adversarial re-check against live sources (gh api, gh release list, raw CHANGELOG files, developers.openai.com via Exa fetch). Outcomes: **Confirmed**, **Corrected**, **Nuanced**, or **Unverified**.

1. **Repo stars/forks/push dates** (codex 131.6k, openai-python 31.98k, agents-python 30.38k, openai-node 11.2k, agents-js 3.96k, realtime-agents 7,010 with last push 2026-01-07, mcp-extensions created 09-29, openai-cli created 2026-05-01, live-console created 09-10): **Confirmed** within normal daily drift. Raw `open_issues_count` for openai-python is 98 (issues plus PRs), consistent with the table footnote.
2. **Latest releases** (python v3.41.0 on 10-28, node v7.45.1 on 10-27, agents-python v0.24.0 on 10-15, agents-js 0.21.0 on 10-20, codex 0.166.0 on 10-29): **Confirmed**. Python has 7 releases from 10-21 through 10-28 (3.36.0 to 3.41.0): **Confirmed**.
3. **openai-python 3.12.0 adds Live, 3.13.0 adds Agents API (both 09-10), 3.26.0 standalone Decisions (10-06)**: **Confirmed** from CHANGELOG.
4. **openai-python 3.0.0 (08-12) HTTPX2 default, httpx not installed**: **Confirmed**. **Nuanced**: added the changelog's "temporary, runtime-only legacy HTTPX escape hatch".
5. **python 3.37.0 (10-22) breaking change in a minor release to Decisions `instructions`**: **Confirmed** (the changelog's own "BREAKING CHANGES" heading).
6. **openai-node 7.0.0 (07-27) requires Node.js 22; `gpt-image-1` shut down 10-23; replacements `gpt-image-2.5-sunburst`/`-flare`; `DecisionItemCreatedEvent.item` union**: **Confirmed** from the node CHANGELOG. 7.0.0 is pre-Aug **(background)**.
7. **"JS SDK has no Live helpers"** (old Gotcha #2): **Corrected**. openai-node added the Live API in **7.14.0 (2026-09-10)**, and `src/resources/live/` exists in the current tree. Only the agents-js example (pinned `^7.2.0`) lacks it. Gotcha #2 and §3.4 were updated.
8. **gpt-live-1: $0.05/min billed per second, Free tier unsupported, Build 50 concurrent sessions, only `v1/live/sessions`, function calling yes, structured outputs no**: **Confirmed** on the model page. Also confirmed Launch 300 and Grow 500 concurrent sessions.
9. **gpt-realtime-2.1 $4/$24 text and $32/$64 audio per 1M, 128k context**: **Confirmed** (plus 32k max output; Build tier 400 RPM / 200k TPM).
10. **Agents API `client.beta.agents.sessions.create`, docs example uses `gpt-6-astra`**: **Confirmed** on the configuration guide.
11. **Live delegation quotes** ("delegation event contains metadata, not task text"; mode fixed at session creation): **Confirmed**. Added the guide's backend model recommendation (`gpt-6-luna`, or `gpt-6-sol` for harder tasks).
12. **live-console README quotes** ("Model metadata access alone does not establish transport access", "not a public-release approval", "Muting the microphone or speaker does not stop billing", Node 24.15.0, headphones): **Confirmed** verbatim.
13. **agents-js live README** (Node ≥22.18, "project API key with access to GPT Live", "receives that request string, not the full voice transcript", `pnpm -F live start`): **Confirmed**.
14. **Stale template pins** (`@openai/agents ^0.0.5`, `openai ^4.77.3` in realtime-agents; `openai ^4.87.3` in responses-starter-app): **Confirmed**.
15. **Agents-python sandbox providers = blaxel, cloudflare, daytona, e2b, modal, vercel (no Freestyle/Superserve); `examples/live` and `examples/decisions` exist**: **Confirmed** by tree listing.
16. **CloudflareRealtimeTransport is beta and upgrades via `fetch()`**: **Confirmed** in cloudflare.mdx.
17. **Codex issues**: #48237 open, 97 comments; #48195 open, 206 reactions; #55744 closed; agents-python #5416/#5448/#5412 open and #5275 closed; agents-js #2095/#2047 open and #2072 closed. **Confirmed**. **Nuanced**: #48235 is closed (now stated).
18. **Codex 0.165.0 contents**: **Nuanced**. Memory v2 is default "for fresh profiles", and thread forks are "experimental".
19. **Community repo stars**: **Corrected** ai-native-callcenter from 471 to 477 (drift). Added the durable-banking-agent-workshop star count (2). Other counts **Confirmed**.
20. **$100 OpenAI credits per participant**: **Confirmed** on EVENT_PAGE.md.
21. **Not re-checked / Unverified**: commit and contributor counts since Aug 1 (pagination estimates), symphony star significance, the ChatKit and Apps SDK issue numbers (#216, #219, #231, #237, #240), and whether gpt-live-1 transport access works with hackathon-issued keys. Terse runtime workerd-compatibility remains **(unverified)**.
