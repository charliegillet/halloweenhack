# OpenAI: docs, API surfaces, limits, pricing and setup for Haunted Hacks

Checked **29 October 2026** for Haunted Hacks (Sat 31 Oct 2026, SF, 11:00 to 16:00 build window). Every attendee gets **$100 in OpenAI API credits**. Sources: the Markdown versions of developers.openai.com pages (`/api/docs/<slug>.md`, `llms.txt`), fetched with curl. That covers pricing, changelog, deprecations, rate limits, model pages, the GPT-Live, Realtime, WebRTC, Responses WebSocket, steering, Multi-agent, Agents API, Agents SDK, ChatKit, Decisions and CLI guides, and the Plugins docs (which replaced the Apps SDK docs). I also read the Codex docs on learn.chatgpt.com, the DevDay 2026 recap via Exa, npm and PyPI registry metadata, and GitHub repo metadata via `gh`. Bracketed numbers point to the Sources list.

**Verified** = read in a primary source on 29 Oct. **Inference** = labelled as my own reasoning. **[BG]** = background from before Aug 2026. The sibling file `02-newest-features.md` has the dated launch timeline, so this file does not repeat it. It covers how to call each surface, what it costs, and what limits you will hit.

---

## TL;DR

- **Real-time voice now has two separate APIs, and they bill differently (verified).** **GPT-Live** (`gpt-live-1`, `POST /v1/live/sessions`, GA 10 Sep) is a full-duplex voice front end. It *delegates* reasoning and tools to a backend and costs **$0.05/min, billed per second**, plus whatever the backend uses [3][4][5]. The **Realtime API** (`gpt-realtime-2.1` / `-mini`, `/v1/realtime`) is one speech-to-speech model billed **per audio token** [1][6].
- **Big gotcha: GPT-Live is not available on the Free usage tier** ("Unsupported usage tiers: Free"). Build tier requires **$5 in total credit purchases** [4][8]. Promotional credits are not purchases. If your org holds only the hackathon credits, it may stay on Free (inference, see Limits). **Buy $5 of credits before Saturday.**
- **Current text models (verified, standard pricing, ≤272K input):** `gpt-6-astra` $10/$50, `gpt-6.1-sol` $2/$10, `gpt-6.1-terra` $1/$5, `gpt-6-luna` $0.10/$0.50 per 1M input/output tokens. All four have a 1.05M context window and 128K max output [1][9]. Tool calling on GPT-6 Astra, GPT-6.1 Sol and GPT-6.1 Terra **requires the Responses API**; Chat Completions works for them only without tools [9].
- **New primitives that fit "real-time":** Responses **WebSocket mode** (one socket, up to 32 named `stream_id` lanes but **at most 16 responses in flight at once**, 60-minute connections) [10]; **mid-turn steering** (`response.steer`, GPT-6 family only) [11]; **async tool calling** [2]; **Multi-agent** in Responses (beta, `multi_agent.enabled`) [12]; the **Decisions API** (`gpt-6-luna` only, $0.10/1M input, **output is free**, about 10x faster than Responses) [13]. Since 15 Oct, **GPT-Live can call Decisions natively** (no round trip through your app) [38].
- **Custom Halloween voice for free (verified):** since 16 Oct, **prompt-to-voice** creates a saved GPT-Live voice from a text description (`POST /v1/audio/voices`, `type: "prompt"`). Creating the voice is free; speech bills at normal GPT-Live rates [39][2].
- **Agents API** (public beta, 10 Sep) is a managed Codex harness with durable sessions, hosted sandboxes (1 to 4 vCPU), subagents and computer use. It requires the `OpenAI-Beta: agents=v1` header and a key with `api.agents.read/write` + `api.responses.write` scopes [14][15]. *Inference:* it overlaps conceptually with Terse Durable Actors, so use it as a worker *behind* actors, not as your state layer.
- **Deprecated or renamed:** Agent Builder shuts down **30 Nov 2026**. ChatKit stays, but new work should use the custom-server path [16][17]. The Apps SDK docs now live under **"Plugins"** (MCP server + optional MCP Apps UI) [18]. The Assistants API shut down 26 Aug 2026 [2].

---

## 1. API surface map (what to call, where, and its status)

| Surface | Endpoint / namespace | Status (29 Oct) | Use at the hackathon for |
|---|---|---|---|
| Responses API | `POST /v1/responses`, `client.responses.create` | GA, the primary API | All text/vision/tool calls with GPT-6 [2][19] |
| Responses WebSocket mode | `wss://…/v1/responses`, `client.responses.connect()` (Py), `ResponsesWS` (JS) | GA | Long tool loops, parallel lanes, steering [10] |
| Mid-turn steering | `response.steer` event over the WS | GA, GPT-6 only | Letting a user or another agent redirect a running response [11] |
| Multi-agent (Responses) | `client.beta.responses`, header `OpenAI-Beta: responses_multi_agent=v1` | Beta | Server-side subagent fan-out [12] |
| GPT-Live | `POST /v1/live/sessions` (WebRTC SDP), `wss://api.openai.com/v1/live/sessions`, `client.live.create` | GA (10 Sep) | Full-duplex voice front end with a delegated backend [3][5][20] |
| Realtime API | `POST /v1/realtime/calls` (WebRTC), `POST /v1/realtime/client_secrets` (ephemeral key), `wss://api.openai.com/v1/realtime?model=…` | GA | Single-model speech-to-speech [6][20] |
| Realtime transcription / translation | `/v1/realtime/transcription_sessions`, `/v1/realtime/translations` | GA | Live captions ($0.017/min), live translation ($0.034/min) [1] |
| Decisions API | `POST /v1/decisions`, `client.decisions.create` | GA (22 Oct) | Fast typed classify/route/score [13] |
| Agents API | `/v1/agents/sessions`, `client.beta.agents.sessions.create`, header `agents=v1` | Public beta | Managed long-running coding/computer-use workers [14][15] |
| Agents SDK | `@openai/agents` (JS), `openai-agents` (Py) | Active | In-process agent loop, handoffs, `RealtimeAgent` [21][22] |
| ChatKit | `@openai/chatkit-react`, `openai-chatkit` (Py) | Available; Agent Builder-hosted path deprecated | Drop-in chat UI [16] |
| Plugins (formerly Apps SDK) | MCP server + `@modelcontextprotocol/ext-apps` UI | Active | ChatGPT/Codex integration demos [18] |
| Webhooks | `client.webhooks.unwrap` | GA | Background/agent completion callbacks [23] |
| OpenAI CLI | `brew install openai/tools/openai` | Active | Shell smoke tests [24] |

Every docs page has a `.md` twin, and `https://developers.openai.com/api/docs/llms.txt` is the index. There is also a docs MCP server at `https://developers.openai.com/mcp` (used in the Agents API example) [14]. **Point your coding agent at these.**

## 2. Pricing cheat sheet (verified from the pricing page, 29 Oct) [1]

**Flagship text models** (per 1M tokens, ≤272K input. Above 272K, input is 2x and output is 1.5x):

| Model | Input | Cached in | 30-min cache write | Output | Reasoning effort | Notes |
|---|---|---|---|---|---|---|
| gpt-6-astra | $10.00 | $1.00 | $12.50 | $50.00 | low…max (no `none`) | No temperature/top_p/logprobs [2] |
| gpt-6.1-sol | $2.00 | $0.10 | $2.50 | $10.00 | low…max | Multi-agent beta; "near-Astra" [9] |
| gpt-6.1-terra | $1.00 | $0.05 | $1.25 | $5.00 | none…max | Released 26 Oct; vision/computer use [2] |
| gpt-6-luna | $0.10 | $0.01 | $0.125 | $0.50 | none…max | The only Decisions model [13] |
| gpt-5.6-terra / luna | $2.00 / $0.20 | $0.20 / $0.02 | – | $12.00 / $1.20 | | Used in the GPT-Live sample [20] |

- **Tiers:** Batch and Flex are 50% off. **Fast** (renamed from Priority on 30 Jul) is 2x. **Ultrafast** is 6x for Astra and GPT-6.1 Sol. OpenAI strongly recommends WebSockets for it, but **HTTP requests are also supported** ("Ultrafast also supports HTTP requests through the SDK") [1][2][40]. Since 16 Oct it is also available in the Agents API via `agent.service_tier: "ultrafast"` [2].
- **Also on the list:** `gpt-6-sol` (22 Sep, $2/$10, cached $0.20) still exists alongside `gpt-6.1-sol` (cached $0.10); make sure you use the `6.1` ID [1][2].
- **Prompt caching:** writes are now billed. A 30-minute write costs 1.25x input and a 12-hour write costs 2.5x input (added 20 Oct) [1][2].

**Voice and audio:**

| Model | Unit price |
|---|---|
| gpt-live-1 | **$0.05 / min**, per second. A WebRTC session bills 15 s at creation, credited against the running time [4][7] |
| gpt-realtime-2.1 | Audio $32 in / $0.40 cached / $64 out; text $4 / $0.40 / $24; image in $5 (per 1M) |
| gpt-realtime-2.1-mini | Audio $10 / $0.30 / $20; text $0.60 / $0.06 / $2.40 |
| gpt-live-transcribe / gpt-realtime-whisper | $0.017 / min |
| gpt-realtime-translate | $0.034 / min |
| gpt-transcribe (file) | $0.0045 / min |

- **Audio tokens:** user audio = **1 token per 100 ms** (600 tokens/min). Assistant audio = **1 token per 50 ms** (1,200 tokens/min) [7].
- **Realtime context:** `gpt-realtime-2.1` has a 128K context window and 32K max output [6].
- **Realtime voices:** `marin` and `cedar` are recommended. `marin` is also the GPT-Live default [25][26].

**Tools and other:**
- **Web search:** $10 / 1k calls + content tokens.
- **File search:** $2.50 / 1k calls; storage $0.10/GB-day after 1 GB free.
- **Hosted shell / Code Interpreter containers:** 1 GB $0.03, 4 GB $0.12, 16 GB $0.48, 64 GB $1.92 per 20-minute session. Billed per minute with a 5-minute minimum.
- **Images:** `gpt-image-2.5-flare` / `-sunburst` at $8 in / $30 out per 1M image tokens.
- **Embeddings:** `text-embedding-3-small` $0.02.
- **Moderation:** free.
- **Decisions:** $0.10/1M uncached input with **no output charge**. This rate is stated in the Decisions guide, not in the main pricing table; cache writes are charged at standard Luna rates [13].
- **Agents API:** model + tools + standard container rates [31]. Hosted sandbox compute is billed **only during active turns** (since 9 Oct) [2][14].

## 3. What $100 of credits buys (inference, from the verified prices above)

| Workload | Assumption | ≈ Cost per unit | ≈ Units per $100 |
|---|---|---|---|
| GPT-Live voice | Voice only; backend extra | $0.05 / min | **2,000 voice-minutes** (~33 h) |
| GPT-Live + Luna backend | 1 delegation/min, 4K in / 500 out | ~$0.051 / min | ~1,950 min |
| Realtime 2.1 (full) | 10-min call, 50/50 talk, 20 turns, context re-read mostly cached | ~$0.50 / 10 min | ~2,000 min |
| Realtime 2.1 mini | Same call | ~$0.18 / 10 min | ~5,500 min |
| gpt-6.1-sol agent step | 5K in / 1K out (reasoning counts as output) | $0.02 | ~5,000 calls |
| gpt-6-astra agent step | 5K in / 1K out | $0.10 | ~1,000 calls |
| gpt-6-luna step | 5K in / 1K out | $0.001 | ~100,000 calls |
| Decisions call | 2K input tokens, any number of questions ≤400 | $0.0002 | ~500,000 |
| Agents API hosted sandbox, `medium` (4 GB) | Container rate, active turns only | $0.006 / active min | ~16,000 active min (model tokens extra) |
| Web search | | $0.01 / call | 10,000 calls |

**Takeaway (inference):** $100 is more than a 5-hour team build will spend unless you loop `gpt-6-astra` at high reasoning, or run many parallel agents with `xhigh`/`max` effort. Use Sol or Terra for agents and Luna for high-frequency "tick" decisions. Keep Astra for one showcase call.

## 4. Usage tiers, rate limits and errors (verified) [8][4][6][9]

| Tier | Qualification | Monthly usage cap | Astra/Sol/Terra RPM / TPM | Luna RPM / TPM | Realtime 2.1 RPM / TPM | GPT-Live concurrent sessions |
|---|---|---|---|---|---|---|
| Free | Allowed geography | $100 | (not listed) | (not listed) | (not listed) | **Not supported** |
| Build | $5 total purchases | $500 | 5,000 / 1M | 5,000 / 2M | 400 / 200K | 50 |
| Launch | $100 purchases | $5,000 | 10,000 / 4M | 10,000 / 10M | 10,000 / 4M | 300 |
| Grow | $500 purchases | $200,000 | 15,000 / 40M | 30,000 / 180M | 20,000 / 15M | 500 |

Tiers were simplified from five to three on 6 Oct [2].

**Errors:**
- **`429 slow_down`** means traffic ramped too fast. It can fire even when you are under RPM/TPM.
- **`503 server_is_overloaded`** means the model is temporarily overloaded.
- Honour `Retry-After` on both. The SDKs auto-retry 429/503 [8].
- **`429 credit_balance_exhausted`** means credits ran out [27].

**Spend controls:** hard spend limits (since 22 Jul) return 429 at the cap. Project API keys can now carry expiry dates. Admins can restrict which service tiers a project may use [2].

**Realtime limits:**
- Realtime sessions truncate oldest-first once context is full. Configure `truncation: {type: "retention_ratio", retention_ratio: 0.8}` to keep the cache warm [7].
- GPT-Live sessions end with `session.closed`, whose `reason` is one of `close_requested | expired | content | remote_hangup | connection_lost` [26].

## 5. Voice: choosing and wiring (verified)

**Pick an architecture [5]:**
- **GPT-Live:** full duplex. You keep your existing text agent as the backend.
- **Realtime:** one model hears, reasons, calls tools and speaks.
- **Chained:** STT → agent → TTS. Note that `tts-1`, `tts-1-hd` and `gpt-4o-mini-tts` shut down 6 Jan 2027; the suggested replacement is `gpt-realtime-2.1-mini` [28].

**GPT-Live delegation modes** (fixed at session creation) [29]:
- **Responses delegation:** OpenAI calls a Responses model with the conversation context.
- **Client delegation:** you get `session.delegation.created`, which carries an ID but **no task text**. You rebuild intent from the `session.input_transcript.delta` / `session.output_transcript.delta` events, run any backend you like, and speak the result with `session.commentary.append { delegation_id, content }`.
- To suppress the automatic "let me check" filler, send `session.thinking.append` immediately. `acknowledgement_delay_ms` configures the delay before that filler.
- A **sideband** WebSocket lets your server watch and steer a session whose audio runs over WebRTC [3].

- **Native Decisions delegation (15 Oct):** GPT-Live can call Decisions directly, either by delegating to a set of choices in `session.delegation` or by firing on input/output transcript deltas via `session.triggers`. Questions can change mid-session with `session.update` (wait for `session.updated`). The delegation *type* is still fixed at creation [38].
- **Custom voice:** `POST /v1/audio/voices` with `{"type":"prompt","prompt":"<description>"}` (optional `script_hint` up to 2,000 chars) returns a saved voice ID; set it in `audio.output.voice`. The default is `marin`, and changing voice requires a new session [39][26].

*Inference:* client delegation is the cleanest seam to put a **Terse Durable Actor or Agent Relay agent network behind a voice**. Native Decisions delegation is the cheap fast path for "scare now / don't" style ticks without an extra hop.

Minimal GPT-Live server (Node 22.6+, `npm i openai express`), trimmed from the official WebRTC quickstart [20]:

```js
import express from "express"; import OpenAI from "openai";
const app = express(); const client = new OpenAI({ maxRetries: 0 });
app.use(express.json({ limit: "64kb" }));
app.post("/api/session", async (req, res) => {
  const result = await client.live.create({
    session: {
      model: "gpt-live-1",
      instructions: "Be concise. Delegate anything needing facts or actions.",
      delegation: { type: "client" },          // or {type:"responses", responses:{model:"gpt-6-luna", tools:[{type:"web_search"}]}}
    },
    transport: { type: "webrtc", sdp: req.body.sdp },
  });
  res.status(201).json(result);                 // browser applies result's SDP answer
});
app.listen(3000);
```

The browser creates an `RTCPeerConnection`, adds the mic track, and creates the data channel `"oai-events"` **before** the offer. It POSTs `{sdp}` and waits for `session.started`. **Do not send `session.start` over WebRTC** [20]. The complete `index.html` client is in [20]. The sample app is `openai/openai-live-console` (34 stars, last pushed 12 Sep) [30].

Realtime via the Agents SDK in the browser, with your server minting an ephemeral key [6][20]:

```js
// server: POST https://api.openai.com/v1/realtime/client_secrets
//   body {session:{type:"realtime", model:"gpt-realtime-2.1", audio:{output:{voice:"marin"}}}}  -> returns {value:"ek_..."}
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";
const agent = new RealtimeAgent({ name: "Ghost", instructions: "You are a spooky concierge." });
const session = new RealtimeSession(agent, { model: "gpt-realtime-2.1" });
await session.connect({ apiKey: ek });          // WebRTC in browser
```

**Beta-to-GA reminders [6]:**
- Drop the `OpenAI-Beta: realtime=v1` header.
- Use `/v1/realtime/calls`.
- Set `session.type`.
- Audio config moves under `session.audio.output`.
- Event names are now `response.output_audio.delta`, etc.
- Turn detection: `semantic_vad` or `server_vad` [25].

## 6. Responses API primitives worth demoing (verified)

- **WebSocket mode [10]:**
  - Installs: `pip install "openai[realtime]>=3.8.0"` or `npm i openai@^7.10.0 ws`.
  - Each turn sends `response.create` plus `previous_response_id` with only the new input.
  - A connection accepts **up to 32 distinct named `stream_id`s**, but **only 16 responses can be in flight at once** across all lanes; extra `response.create` events queue. You can fork a lane from any completed response (with `store=false`, the parent must still be in the connection cache or you get `previous_response_not_found`).
  - Connections last **60 minutes** and the connection-local cache is lost on reconnect.
  - OpenAI reports up to ~40% faster runs for 20+ tool-call rollouts.
- **Steering [11]:** after `response.created`, send `{type:"response.steer", previous_response_id, input}`. You get `response.steer.accepted` back. It does not undo tools that have already started. **GPT-6 family only.**
- **Async tool calling [2]:** the model keeps working while your tools run and you return results later.
- **Multi-agent (beta) [12]:**
  - `multi_agent:{enabled:true, max_concurrent_subagents:3}` with `betas:["responses_multi_agent=v1"]` on `gpt-6.1-sol` or GPT-5.6.
  - There is no fixed depth or total-count limit. Subagents share the model and tools.
  - Read the final answer from items where `agent.agent_name === "/root"` and `phase === "final_answer"`.
- **Background mode + webhooks [23]:** fire long jobs and get `response.completed` webhooks.

```python
from openai import OpenAI
client = OpenAI()
with client.responses.connect() as ws:                      # WebSocket mode (openai>=3.8)
    ws.send({"type": "response.create", "stream_id": "ghost-1",
             "model": "gpt-6.1-sol", "store": False,
             "input": [{"type":"message","role":"user","content":[{"type":"input_text","text":"Plan a haunted house."}]}]})
    # after response.created, redirect mid-flight:
    # ws.send({"type":"response.steer","previous_response_id": rid, "input":"Make it kid-friendly."})
```

Decisions call (cheapest real-time "brain tick") [13]:

```python
d = client.decisions.create(model="gpt-6-luna",
      input="Transcript: 'I think someone is behind me...'",
      questions=[{"type":"choice","name":"mood","instructions":"Listener mood","choices":["calm","scared","bored"]},
                 {"type":"predicate","name":"escalate","instructions":"Should the ghost escalate the scare?"}])
print([(a.name, a) for a in d.answers])
```

## 7. Agents API and Agents SDK (verified) [14][15][31][21]

**Agents API concepts:** Agent (model, instructions, tools, MCP), Environment (optional sandbox), **Session** (durable instance), and Events/Items.

**Hosted sandbox:**
- Sizes: `small` 1 vCPU/1 GB, `medium` 2/4 GB (default), `large` 4/16 GB.
- `network.access`: `enabled` (default), `disabled`, or `restricted` with 1 to 100 exact hosts.
- Files in `/workspace/outputs` become immutable artifacts.
- The sandbox **can be deleted after 1 hour without activity/keep-alives** (not configurable).
- Closing the event stream does **not** cancel the task.
- Pre-warm a sandbox before the user's message arrives (9 Oct) [2].

**Other capabilities:** computer use (29 Sep), `multi_agent:{enabled, max_concurrent_subagents}`, `programmatic_tool_calling`, and MCP over HTTP or stdio. Webhooks report session lifecycle events.

```python
from openai import OpenAI
with OpenAI() as client:
    with client.beta.agents.sessions.create(
        agent={"model": "gpt-6.1-sol", "instructions": "Write code, run it, report real output."},
        environment={"type": "openai_hosted"},
        input="Create tree.py and run it.", stream=True,
    ).with_result_collection() as stream:
        for ev in stream: print(ev.to_json(indent=None))
        print(stream.get_final_result().output_text)
```

**Agents SDK:**
- Install: `npm i @openai/agents zod` or `pip install openai-agents`.
- Core loop: `new Agent({name, instructions, model, tools})` then `run(agent, input)` → `result.finalOutput`. In Python: `Runner.run(agent, input)` → `result.final_output`.
- Tools come from `tool({parameters: z.object(...)})` / `@function_tool`.
- State options: `result.history`, sessions, a server-managed continuation ID, or `result.state` for approval resumes [21].

## 8. ChatKit, Plugins (ex-Apps SDK), Codex (verified)

**ChatKit [16]:**
- Use the **custom-server integration** (ChatKit Python SDK, any backend).
- The hosted-workflow path depends on Agent Builder, which shuts down 30 Nov [17].
- You must pass a unique `user` per end user when creating a session.
- Upload storage costs $0.10/GB-day after 1 GB free [1].

**Plugins [18]:**
- Build an MCP server (`npm i @modelcontextprotocol/sdk @modelcontextprotocol/ext-apps zod`), with optional HTML UI rendered in an iframe through the open **MCP Apps** standard.
- Expose it with ngrok at `https://…/mcp`, then go to chatgpt.com/plugins → **Add custom MCP server** → **Create as a plugin** → `@`-mention it in chat.
- Refresh the connection after every tool change.
- DevDay added Plugin extensions (sidebar panels) and MCP Events [32].

**Codex [33][34][35]:**
- Install with `curl -fsSL https://chatgpt.com/codex/install.sh | sh` or `npm i -g @openai/codex` (v0.166.0, published 29 Oct).
- Sign in with ChatGPT, or use `printenv OPENAI_API_KEY | codex login --with-api-key`. API-key usage bills at standard API rates.
- The Codex SDK (`npm i @openai/codex-sdk`, Node 18+) provides `new Codex().startThread().run(prompt)`.
- `codex mcp-server` has been removed; use the app server instead.

*Inference:* Codex is your build tool, not your demo. API-key Codex usage would draw down the same $100.

## 9. SDK versions to pin (registry data, 29 Oct) [36]

| Package | Latest | Published |
|---|---|---|
| `openai` (npm) | 7.45.1 | 27 Oct |
| `openai` (PyPI) | 3.41.0 | 28 Oct |
| `@openai/agents` / `@openai/agents-realtime` | 0.21.0 | 20 Oct |
| `openai-agents` (PyPI) | 0.24.0 | 15 Oct |
| `@openai/chatkit-react` | 1.6.1 | 13 Aug |
| `@openai/codex` | 0.166.0 | 29 Oct |
| `@modelcontextprotocol/ext-apps` | 2.0.4 | 27 Oct |

- **Other SDKs:** Go `github.com/openai/openai-go/v3` (Live and WebSocket support from v3.85.1); Java `com.openai:openai-java` 4.94.0 in the docs; .NET `OpenAI`; Ruby `openai` [24][20].
- **CLI:** `brew install openai/tools/openai` or `go install github.com/openai/openai-cli/cmd/openai@latest`. The CLI has `--format`, `--transform` (GJSON) and `--debug`. An old Python-SDK `openai` binary can shadow it [24].
- **GitHub activity (29 Oct):**
  - openai-agents-python: 30.4k stars, pushed 27 Oct.
  - openai-agents-js: 4.0k stars, pushed 29 Oct.
  - openai-realtime-agents: 7.0k stars, last pushed **7 Jan 2026**, so treat it as stale [BG].

## 10. First 30 minutes checklist (Saturday 11:00)

Do 0 and 1 **before Oct 31**.

0. **Thu/Fri:**
   - Create a dedicated API **project** and redeem the hackathon credits into that org.
   - **Buy $5 of credits** to leave the Free tier, which GPT-Live needs. Check Settings → Limits shows Build.
   - Set a project **hard spend limit** (for example $90).
   - Create a project key with an expiry. Add the `api.agents.*` scopes if you plan to use the Agents API.
1. **Fri:**
   - `npm i openai@7.45.1 @openai/agents@0.21.0 zod express ws` and/or `pip install "openai[realtime]==3.41.0" openai-agents==0.24.0`.
   - `brew install openai/tools/openai`.
   - Run `openai responses create --model gpt-6-luna --input ping`.
2. **11:00:** export `OPENAI_API_KEY`. Confirm one Responses call each on `gpt-6.1-sol` and `gpt-6-luna`, and read the `x-ratelimit-*` headers.
3. **11:05:** clone the GPT-Live WebRTC quickstart (server + `index.html`) [20] and run it on `localhost:3000`. Hear a reply and get `session.started`.
4. **11:15:** switch to `delegation:{type:"client"}`. Log `session.delegation.created` and the transcript deltas, then send a hard-coded `session.commentary.append`. That proves the round trip to your own backend (an actor or agent).
5. **11:20:** wire the backend call (a Terse actor method or Agent Relay message) and return its result as commentary.
6. **11:25:** add a Decisions or Luna call for cheap per-utterance classification. Check the Usage dashboard filtered by API key.
7. **11:30:** commit, and pin versions in `package.json` / `requirements.txt`.

---

## Limits / could not verify

- **How the $100 hackathon credits are issued** (code, grant to org ID, expiry date) is not on the event page. I could not verify it.
- **Whether promotional grants lift an org off the Free tier.** Docs say tiers depend on "total credit purchases" [8]. Promo-credit treatment is not stated for this event. The ChatGPT-subscriber grant FAQ says only that the tier "will update automatically as you qualify" [27]. 2025 community posts claim tier recalculation happens only on a new purchase and needs a waiting period [BG][37]. These are unofficial. **Treat the $5 purchase as a necessary hedge.** Note also that the subscriber-credit guide states an organization "uses free API credits before purchased API credits" [27], so a $5 purchase should not be consumed before the free grant (that statement is written for subscriber credits; applying it to hackathon credits is inference).
- **New 28 Oct: ChatGPT Pro/Business subscribers can claim $100 to $500/month in free API credits** by linking an API org (Pro $100/$200/$500 tiers; Business $20 or $100 per paid seat, capped at $500 per workspace). Credits expire at the end of the billing cycle [2][27]. If a teammate has Pro, that is a second free budget. Whether it changes usage tier is not stated (unverified).
- **Maximum Realtime/GPT-Live session duration:** the docs list an `expired` close reason but do not state the limit on the pages I read.
- **The cost estimates in §3 are my arithmetic.** Real Realtime cost depends on turn count, instructions length, reasoning tokens and caching. Measure with `session.closed.usage`.
- **Not read in full:** per-model rate limits for the Agents API, computer-use pricing, and the Plugins Checkout API.
- **Exa/WebSearch surfaced pre-DevDay rumor articles** (for example, about "GPT-6o"). I ignored them; every model name here comes from the official pricing page or changelog.

## Hackathon implications

- **What to build (inference):**
  - A **voice-fronted, multi-agent haunted experience**. GPT-Live (client delegation) is the always-listening "ghost".
  - Each delegation is routed to a **Terse Durable Actor** that holds room/game state.
  - Actors talk to specialist agents through **Agent Relay**, which hits both host tracks.
  - Specialist agents run on `gpt-6.1-sol` (or Responses Multi-agent), with Luna/Decisions for sub-second "should I scare now?" ticks.
  - The real-time story is full duplex, steering and parallel lanes. That is exactly the "Real-Time AI" theme.
- **Use OpenAI as the model layer, not the state layer (inference).** The Agents API's durable sessions and Responses `store` compete with the hosts' pitch. Keep durable state in actors so judges see Terse and Agent Relay doing the stateful and coordination work.
- **Gotchas:**
  - Free tier blocks GPT-Live.
  - GPT-6 Astra, 6.1 Sol and 6.1 Terra need Responses for tools. Astra and 6.1 Sol reject `reasoning: none`, and `temperature`/`top_p` must be removed whenever effort is not `none` [9].
  - Steering is GPT-6-only and WebSocket-only.
  - WebSocket connections die at 60 minutes, so reconnect during long demos.
  - Only 16 responses can be in flight per WebSocket, even with 32 named lanes. Design fan-out for 16 or open a second socket.
  - Do not send `session.start` over WebRTC.
  - Client delegation events carry no task text.
  - Hosted sandboxes can vanish after an idle hour.
  - Agent Builder is a dead end.
  - Realtime beta headers break GA calls.
  - Browser mic access needs HTTPS or localhost. Plan the demo laptop accordingly.
- **Cost control:** `gpt-live-1` at $0.05/min lets you leave a demo session open all afternoon for about $15. Close idle sessions anyway, and note that each WebRTC create bills 15 s. Avoid Astra plus `max` effort in loops. Set a hard spend limit.
- **Supabase "scale to millions" angle (inference):** cite the per-unit economics. Decisions costs about $0.0002 per call, and Luna or the Realtime-mini models make per-user costs credible.
- **Cheap Halloween polish (verified feature, inference on value):** generate a spooky narrator with prompt-to-voice on Friday so the voice ID is ready Saturday. It costs nothing to create [39].
- **What OpenAI likely wants to see (inference):** newly launched surfaces (GPT-Live, Decisions, Agents API, GPT-6.1). `02-newest-features.md` covers this angle.

## Sources

1. OpenAI API pricing (md), fetched 29 Oct 2026 — https://developers.openai.com/api/docs/pricing.md
2. OpenAI API changelog — https://developers.openai.com/api/docs/changelog.md
3. Getting started with GPT-Live — https://developers.openai.com/api/docs/guides/live.md
4. GPT-Live 1 model page — https://developers.openai.com/api/docs/models/gpt-live-1.md
5. Voice agents (architecture chooser) — https://developers.openai.com/api/docs/guides/voice-agents.md
6. Getting started with the Realtime API — https://developers.openai.com/api/docs/guides/realtime.md ; model page https://developers.openai.com/api/docs/models/gpt-realtime-2.1.md
7. Voice cost optimization — https://developers.openai.com/api/docs/guides/voice-latency-cost.md
8. Rate limits — https://developers.openai.com/api/docs/guides/rate-limits.md
9. Model pages — https://developers.openai.com/api/docs/models/gpt-6.1-sol.md , /gpt-6-luna.md , /gpt-6.1-terra.md , /gpt-6-astra.md ; GPT-6 guide https://developers.openai.com/api/docs/guides/latest-model/gpt-6-astra.md
10. WebSocket Mode — https://developers.openai.com/api/docs/guides/websocket-mode.md
11. Mid-turn steering — https://developers.openai.com/api/docs/guides/steering.md
12. Responses Multi-agent — https://developers.openai.com/api/docs/guides/responses-multi-agent.md
13. Decisions API — https://developers.openai.com/api/docs/guides/decisions.md
14. Agents API overview — https://developers.openai.com/api/docs/guides/agents-api/overview.md
15. Agents API quickstart — https://developers.openai.com/api/docs/guides/agents-api/quickstart.md
16. ChatKit — https://developers.openai.com/api/docs/guides/chatkit.md
17. Deprecations — https://developers.openai.com/api/docs/deprecations.md
18. Plugins: MCP server and UI quickstart — https://developers.openai.com/plugins/build/app-quickstart.md ; index https://developers.openai.com/apps-sdk/llms.txt
19. Agents chooser — https://developers.openai.com/api/docs/guides/agents.md
20. WebRTC (GPT-Live + Realtime) — https://developers.openai.com/api/docs/guides/voice-webrtc.md ; WebSockets https://developers.openai.com/api/docs/guides/voice-websockets.md
21. Agents SDK quickstart — https://developers.openai.com/api/docs/guides/agents/quickstart.md
22. Agents SDK overview — https://developers.openai.com/api/docs/guides/agents/sdk.md
23. Webhooks — https://developers.openai.com/api/docs/guides/webhooks.md
24. SDKs and CLI — https://developers.openai.com/api/docs/libraries.md ; OpenAI CLI https://developers.openai.com/api/docs/libraries/openai-cli.md
25. Realtime conversations — https://developers.openai.com/api/docs/guides/realtime-conversations.md
26. Managing GPT-Live sessions — https://developers.openai.com/api/docs/guides/live-conversations.md
27. API credits for ChatGPT subscribers — https://developers.openai.com/api/docs/guides/chatgpt-api-credits.md ; Help Center https://help.openai.com/en/articles/20001626-api-credits-benefit-for-eligible-chatgpt-subscriptions
28. Deprecations, TTS entry (2026-10-01) — https://developers.openai.com/api/docs/deprecations.md
29. Delegation and tools in GPT-Live — https://developers.openai.com/api/docs/guides/live-delegation.md
30. GitHub metadata via `gh api` — https://github.com/openai/openai-live-console , https://github.com/openai/openai-agents-python , https://github.com/openai/openai-agents-js , https://github.com/openai/openai-realtime-agents , https://github.com/openai/openai-cli , https://github.com/openai/codex
31. OpenAI-hosted sandboxes — https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted.md
32. DevDay 2026 Recap (29 Sep 2026) — https://openai.com/index/devday-2026-recap/
33. Codex CLI — https://learn.chatgpt.com/docs/codex/cli.md
34. Codex authentication — https://learn.chatgpt.com/docs/auth.md
35. Codex SDK — https://learn.chatgpt.com/docs/codex-sdk.md
36. npm registry (`npm view`) and PyPI JSON API for openai, @openai/agents, @openai/agents-realtime, @openai/chatkit-react, @openai/codex, @modelcontextprotocol/ext-apps, openai-agents, openai-chatkit — https://www.npmjs.com/package/openai , https://pypi.org/project/openai/
37. [BG] OpenAI Developer Community, "Usage Tier Not Upgrading From Free Tier" (Sep 2025) — https://community.openai.com/t/usage-tier-not-upgrading-from-free-tier/1360606 ; prepaid billing Help Center https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing
38. Connect voice to Decisions (GPT-Live native Decisions) — https://developers.openai.com/api/docs/guides/decisions-voice.md
39. Custom voices / prompt-to-voice — https://developers.openai.com/api/docs/guides/custom-voices.md
40. Ultrafast mode — https://developers.openai.com/api/docs/guides/ultrafast-mode.md

## Verification log (2026-10-29)

An adversarial re-check against live sources (curl of the `.md` docs, `npm view`, PyPI JSON, `gh api`, and Exa for the DevDay recap, which returns 403 to curl). Outcomes: **OK** = confirmed; **FIXED** = the doc was wrong or imprecise and has been corrected; **ADDED** = an important omission, now added.

1. **$100 OpenAI credits per attendee:** OK. EVENT_PAGE.md line 13.
2. **Flagship text prices (Astra $10/$50, 6.1 Sol $2/$10, 6.1 Terra $1/$5, Luna $0.10/$0.50; cache-write columns; long context 2x input / 1.5x output; Batch/Flex 50%, Fast 2x, Ultrafast 6x):** OK, pricing.md [1].
3. **"Ultrafast works over WebSockets only":** FIXED. The Ultrafast guide says HTTP through the SDK is supported and WebSockets are recommended [40].
4. **GPT-Live $0.05/min billed per second, 15 s billed at WebRTC creation and credited, "Unsupported usage tiers: Free", 50/300/500 concurrent sessions:** OK [4][7][20].
5. **Usage tiers (Free/Build $5/Launch $100/Grow $500; caps $100/$500/$5k/$200k; simplified from five to three on 6 Oct) and per-model RPM/TPM rows for Sol, Luna and Realtime 2.1:** OK [8][9][2].
6. **WebSocket mode "up to 32 parallel stream_id lanes":** FIXED. The limit is 32 distinct *named* lanes, but at most **16 in-flight responses** per connection. The 60-minute limit, ~40% figure and install pins are OK [10].
7. **Steering is GPT-6 only and WebSocket only, and returns `response.steer.accepted`:** OK [11].
8. **Decisions: GA 22 Oct, `gpt-6-luna` only, up to 400 questions, ~10x faster, $0.10/1M input, output free:** OK, but the citation was FIXED. The price is in the Decisions guide [13], not on the pricing page [1].
9. **"Tool calling on GPT-6 Astra requires the Responses API [2]":** FIXED. The rule is in the GPT-6 guide [9] and also covers 6.1 Sol and 6.1 Terra; Astra and 6.1 Sol do not support `none` effort. Context 1.05M / 128K output is OK [9].
10. **Agents API: public beta 10 Sep, `OpenAI-Beta: agents=v1`, scopes `api.agents.read/write` + `api.responses.write`, sandbox sizes, 1 to 100 restricted hosts, deletion after an idle hour, stream close doesn't cancel, active-turn billing since 9 Oct, container rates:** OK [14][15][31][2].
11. **Agent Builder shutdown 30 Nov 2026, ChatKit stays; TTS models removed 6 Jan 2027 → `gpt-realtime-2.1-mini`; Assistants API shut down 26 Aug:** OK [17][16][2].
12. **GPT-Live client delegation carries no task text; `session.commentary.append` / `thinking.append`; do not send `session.start` over WebRTC; `client.live.create`; `oai-events` channel; default voice `marin`:** OK [29][20][26].
13. **SDK versions (openai npm 7.45.1, PyPI 3.41.0, @openai/agents 0.21.0, openai-agents 0.24.0, chatkit-react 1.6.1, codex 0.166.0 published 29 Oct, ext-apps 2.0.4):** OK, registry data on 29 Oct.
14. **GitHub: openai-live-console 34★ / pushed 12 Sep; agents-python 30,384★; agents-js 3,956★ (rounded to "4.0k"); realtime-agents 7,010★ / pushed 7 Jan 2026:** OK via `gh api`.
15. **DevDay 2026 recap (29 Sep): GPT-6.1 Sol "near-Astra intelligence … at a fifth of its standard input and output token prices", Plugin extensions, MCP Events:** OK via Exa. Decisions was "limited preview" at DevDay, with beta on 6 Oct and GA on 22 Oct per the changelog.
16. **Codex install script, `npm i -g @openai/codex`, `codex mcp-server` removed, Codex SDK `startThread`:** OK [33][35].
17. **Missing items:** ADDED native Decisions in GPT-Live (15 Oct) [38], prompt-to-voice custom voices (16 Oct) [39], ChatGPT Pro/Business subscriber API credits (28 Oct) [27], Ultrafast in the Agents API (16 Oct), the "free credits are consumed before purchased credits" rule, and the note that `gpt-6-sol` coexists with `gpt-6.1-sol`.
18. **Still unverified:** how the hackathon credits are issued, and whether promo or subscriber credits lift an org off the Free tier. The maximum GPT-Live session duration has a documented `expired` reason ("reached its duration limit") but no number. Help Center URL 20001626 returned 403 to curl, so it was not re-read.
