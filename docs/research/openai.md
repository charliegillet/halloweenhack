# OpenAI: master brief for Haunted Hacks (Real-Time AI Edition)

> Consolidated **2026-10-29** for Haunted Hacks (YC, San Francisco, Sat 2026-10-31; hacking 11:00, **submissions close 16:00**, judging 16:00-17:00, awards 17:00-18:00 [E]).
> This file merges five angle files, each with its own verification log. Go to them for depth:
> [01 docs and API](openai/01-docs-api.md) · [02 newest features](openai/02-newest-features.md) · [03 GitHub and code](openai/03-github-code.md) · [04 social pulse](openai/04-social-pulse.md) · [05 team and strategy](openai/05-team-strategy.md)
>
> Labels: **[V]** = verified on a primary source (OpenAI docs or changelog, GitHub, event page) by a sub-file or by this editor on 2026-10-29. **[S]** = secondary (press, forum, third-party blog). **[I]** = inference. **[BG]** = background from before Aug 2026. Numbered citations such as [3] point to the Sources list at the end.

---

## Executive summary

1. **OpenAI's real-time story this quarter is GPT-Live-1.** It is a full-duplex voice model (`gpt-live-1`, `POST /v1/live/sessions`, GA 2026-09-10, $0.05/min billed per second) that **delegates** reasoning and tools to a backend. The backend is either an OpenAI Responses model ("Responses delegation") or **your own code** ("client delegation") [V][3][4][5]. OpenAI's guide says your application "owns permissions, confirmations, business records, and task state" [V][6]. That is the slot a **Terse Durable Actor** fills, with **Agent Relay** carrying work to specialist agents.
2. **The Decisions API is the newest GA surface (GA 2026-10-22).** It runs only on `gpt-6-luna` and returns typed predicate, choice or score answers "about 10x faster than the Responses API". Uncached input costs $0.10 per 1M tokens and output is **free** [V][9]. Since 2026-10-15, **GPT-Live can call Decisions natively** on transcript deltas, with no hop through your app [V][10].
3. **Models (all GA, Responses API):** `gpt-6-astra` $10/$50, `gpt-6.1-sol` $2/$10, `gpt-6.1-terra` $1/$5 (released 2026-10-26), and `gpt-6-luna` $0.10/$0.50 per 1M input/output tokens [V][1][2]. Tool calling on Astra, 6.1 Sol and 6.1 Terra **requires the Responses API** [V][11].
4. **Biggest blocker: GPT-Live does not run on the Free usage tier.** The model page says "Unsupported usage tiers: Free" [V][4, re-fetched by editor]. Reaching the Build tier takes **$5 in total credit purchases** [V][12]. No source says whether the event's $100 promo credits count. **Buy $5 of credits before Saturday.**
5. **OpenAI is a credit sponsor, not a host or a judge.** It has no prize track of its own. Its stake is $100 of credits per participant plus $5k/$2.5k/$1k in credits for the top three [V][E]. Judges score Durable Actors and Agent Relay. OpenAI's role in a winning project is the real-time voice and reflex layer [I].
6. **Sentiment [S]:** builders praise GPT-Live's naturalness but report latency and dropped-frame problems since Oct 20. They are tired of reservation-bot demos and of OpenAI's product sprawl. Agents covertly signalling to each other is the month's top agent story, which suits Agent Relay's "observable messaging" pitch (§3).

---

## What matters for Haunted Hacks (the box)

> **Build:** a browser **GPT-Live** "ghost" using **client delegation**, so each delegation goes to a **Terse Durable Actor** for the room or ghost. The actor holds the state and fans work out to specialist agents (lore, puzzle, scare director) over **Agent Relay**. **Decisions** (`gpt-6-luna`), fired natively from GPT-Live transcript deltas, makes the sub-second "scare now?" or "who handles this?" calls. Give the ghost a **free prompt-to-voice** spooky voice.
>
> **Before Friday night:**
> 1. Buy $5 of credits so the org reaches the Build tier.
> 2. Set a project hard spend limit and service-tier restrictions.
> 3. Create a scoped, expiring key.
> 4. Run one real GPT-Live call end to end. Seeing the model listed in metadata is not proof of access.
> 5. Pre-create the custom voice.
> 6. Pin SDK versions.
>
> **Never:** Agent Builder, Evals (read-only **on hackathon day**), the Assistants API (dead), `gpt-4o*`/`gpt-4.1*` snapshots, `tts-1`, legacy realtime models, `gpt-image-1` (shut down), or forks of `openai-realtime-agents`.
>
> **Demo line [I]:** "GPT-Live is the mouth, Decisions is the reflex, Sol is the brain, Terse is the memory, Agent Relay is the nervous system." Show four things: an interruption, a sub-second action, a task that survives a page refresh, and a guardrail firing.

---

## 1. Key facts tables

### 1a. API surfaces (status as of 2026-10-29) [V][01]

| Surface | Endpoint / SDK | Status | Use it for |
|---|---|---|---|
| **GPT-Live** | `POST /v1/live/sessions` (WebRTC SDP), WS, sideband; `client.live.create` | GA 09-10 | Full-duplex voice front end with a delegated backend |
| Realtime | `/v1/realtime/calls`, `/v1/realtime/client_secrets`, WS | GA | Single-model speech-to-speech (fallback) |
| Responses | `POST /v1/responses` | GA | All GPT-6 text, vision and tool calls |
| Responses WebSocket mode | `client.responses.connect()` / `ResponsesWS` | GA | Long tool loops, parallel lanes, steering |
| **Decisions** | `POST /v1/decisions`, `client.decisions.create` | **GA 10-22** | Fast typed classify, route and score |
| Agents API | `client.beta.agents.sessions.create`, header `OpenAI-Beta: agents=v1` | Public beta 09-10 | Managed Codex-harness workers with sandboxes |
| Agents SDK | `@openai/agents` 0.21.0 / `openai-agents` 0.24.0 | OSS, pre-1.0 | In-process agent loop |

### 1b. Prices (pricing page and guides, 2026-10-29) [V][1][4][9]

| Item | Price |
|---|---|
| gpt-6-astra | $10 in / $1 cached / $50 out per 1M (reasoning low to max, **no `none`**) |
| gpt-6.1-sol | $2 / $0.10 / $10 (no `none`). Do not confuse with older `gpt-6-sol` ($2 / $0.20 / $10) |
| gpt-6.1-terra | $1 / $0.05 / $5 (none to max). **Not available on `v1/live` or `v1/realtime`** |
| gpt-6-luna | $0.10 / $0.01 / $0.50 (none to max). The only Decisions model |
| Ultrafast tier | **6x standard** ("Ultrafast mode prices are 6x Standard" on the 6.1 Sol model page, re-fetched by editor). Astra $60/$6/$300; 6.1 Sol $12/$0.60/$60. Works over HTTP; WebSockets recommended |
| Other tiers | Batch/Flex 50% off; Fast 2x. Above 272K input tokens, input is 2x and output 1.5x |
| Cache writes (since 10-20) | 30-min write 1.25x input; 12-hour write 2.5x input |
| **gpt-live-1** | **$0.05/min, billed per second**, not rounded up. Each WebRTC create bills 15 s up front, credited against run time. Backend model billed separately |
| gpt-realtime-2.1 / -mini | Audio $32 in / $64 out (mini $10 / $20); text $4 / $24 (mini $0.60 / $2.40). 128K context, 32K max output |
| Transcribe / translate | $0.017/min / $0.034/min |
| **Decisions** | $0.10/1M uncached input; **output not charged** |
| Prompt-to-voice voice creation | Free; speech bills at normal GPT-Live rates |
| Agents API | No platform fee: tokens + tools + container rates, sandbox billed **only during active turns** (since 10-09) |

### 1c. Usage tiers (re-tiered 2026-10-06) [V][12][4]

| Tier | Qualifies at | Monthly cap | Sol/Terra RPM / TPM | Luna RPM / TPM | Realtime 2.1 RPM / TPM | GPT-Live concurrent sessions |
|---|---|---|---|---|---|---|
| Free | — | $100 | n/a | n/a | n/a | **Not supported** |
| Build | $5 purchased | $500 | 5,000 / 1M | 5,000 / 2M | 400 / 200K | 50 |
| Launch | $100 purchased | $5,000 | 10,000 / 4M | 10,000 / 10M | 10,000 / 4M | 300 |
| Grow | $500 purchased | $200,000 | 15,000 / 40M | 30,000 / 180M | 20,000 / 15M | 500 |

Error codes: `429 slow_down` (traffic ramped too fast; can fire even under the limits), `503 server_is_overloaded`, and `429 credit_balance_exhausted`. Honour `Retry-After` [V][12][13].

### 1d. What $100 per person buys [I][01]

Editor's arithmetic from the verified prices: about **2,000 GPT-Live voice-minutes** (~33 h, before backend), ~5,000 6.1 Sol agent steps (5K in / 1K out), ~1,000 Astra steps, or ~500,000 Decisions calls (2K input tokens). A 5-hour team build will not exhaust it unless Astra runs at `xhigh`/`max` in loops.

### 1e. SDK versions to pin (registry, 2026-10-29) [V][01][03]

`openai` npm **7.45.1** (Live resources since 7.14.0; requires **Node 22+**) · `openai` PyPI **3.41.0** (HTTPX2 by default since 3.0.0; Decisions needs `>=3.26.0,<4`) · `@openai/agents` / `@openai/agents-realtime` **0.21.0** · `openai-agents` **0.24.0** · `@openai/codex` **0.166.0** (published 10-29) · `@openai/chatkit-react` 1.6.1 · `@modelcontextprotocol/ext-apps` 2.0.4. Node **≥22.18** for the agents-js Live example; **24.15.0** for `openai-live-console`.

---

## 2. Newest features, dated (Aug 1 to Oct 29 2026) [V][2 changelog unless noted][02]

| Date | Shipped | Status |
|---|---|---|
| Aug 26 | **Assistants API shut down**; whisper-1 / gpt-4o-transcribe deprecated (shutdown 2027-02-26) | — |
| Sep 3 | **GPT-6 Astra**; Responses gains async tool calling, mid-turn steering over WS, and mid-conversation effort changes | GA |
| Sep 10 | **GPT-Live-1 in the API**; **Agents API** + hosted sandboxes; API key expiry | GA / public beta |
| Sep 29 (DevDay) | **GPT-6.1 Sol**; Multi-agent in Responses (beta); Astra Ultrafast; computer use in the Agents API; Decisions "limited preview"; plugin extensions; MCP Events; Sign in with ChatGPT | Mixed |
| Oct 6 | **Decisions API public beta**; usage tiers cut to Build/Launch/Grow | Beta |
| Oct 14 | GPT-4o, 4o mini, 4.1 and 4.1 mini snapshots deprecated (shutdown 2027-01-14) [16] | Deprecated |
| **Oct 15** | **Native Decisions inside GPT-Live** (`session.delegation` choices or `session.triggers` on transcript deltas) [10] | GA |
| **Oct 16** | **Prompt-to-voice** custom voices (free to create) + 9 new voices; Agents API Artifact SDK; Agents API Ultrafast | GA / beta |
| Oct 21 | Per-project service-tier restrictions | GA |
| **Oct 22** | **Decisions GA**: caching, `input_json`, images per question, 400 questions/request (up from 200) | GA |
| Oct 23 | `gpt-image-1` shut down; use `gpt-image-2.5-sunburst`/`-flare` (or the default `gpt-image-2`) [V][03 node CHANGELOG] | — |
| Oct 26 | **GPT-6.1 Terra** | GA |
| Oct 28 | ChatGPT Pro/Business subscribers can claim $100-$500/mo in API credits [13] | GA |
| **Oct 31** | **Evals become read-only**, on hackathon day [16] | — |
| Nov 30 | Agent Builder, Evals and `v1/prompts` shut down (ChatKit stays) [16] | — |

**Announced but not yet available:** GPT-Live-1.1 is in ChatGPT, Codex and Dots, and is "Coming soon to the API" per @OpenAI on Oct 15 [V][04]. Also pending: Private Inference preview ("this fall"), and plugin extensions on web for Free/Go users [02].
**Cancelled:** GPT-6.1 Astra. CNBC says OpenAI pulled it the day before DevDay for not meeting safety standards. The Batch, citing WSJ's report dated Sep 28, says internal tests found it more deceptive. The exact cancellation date is unverified [S][02][05].
Also: Sep 22 GPT-6 Sol/Luna; Oct 8 Ultrafast for 6.1 Sol; Oct 9 Agents API pre-warm + active-turn billing; Oct 20 12-hour caching. **[BG]:** GPT-Live in ChatGPT 07-08; `gpt-realtime-2.1` 07-06; Apps SDK became "plugins" 07-09.

---

## 3. Social sentiment (Aug to Oct, weighted to the last 30 days) [S][04]

- **Volume:** On Hacker News, the biggest threads touching these features were: Codex CLI background daemon (610 pts), **Decisions API beta (393 pts / 233 comments)**, agents-through-CPU-cache (356), OpenAI CLI (244), a Show HN voice murder mystery on gpt-realtime-2.1 (215), and GPT-Live-1 in the API (only 54). X: high first-party reach (@OpenAIDevs credits post 8,910 likes), shallow third-party talk. Reddit returned 403.
- **GPT-Live praise:** ThunderPhone called it "the most natural-sounding conversationalist we have put on a phone line", with ~1.3 s median time to first audio on the phone and ~0.7 s without the phone leg. Forum builders said it is better at tool calling than realtime-2.1 and liked the per-second billing.
- **GPT-Live complaints:** ThunderPhone said it "does not reliably follow instructions" on scripted behaviours, makes alphanumeric errors and sometimes thinks out loud. Silence streams continuously, so audio stopping does not mark turn end. **Since Oct 20**, an operator reports time to first sound rising from ~2.1 s to 2.5-2.8 s. **Oct 28**: a report of output audio frames being dropped over both WebRTC and WS. OpenAI had not responded as of Oct 29.
- **Realtime:** mature but grumbled about (instruction leakage, narrating its own behaviour). Apptycoons (measured Oct 26) found **default semantic VAD waits ~4.5 s** versus 0.9-1.0 s for server VAD and 2.4 s for eagerness `high`. Cost was ~$0.078/min for 2.1 and ~$0.023/min for mini.
- **Sprawl fatigue:** "they end up deprecating almost everything in under two years" (HN). Agents SDK vs Agents API vs AgentKit confuses people; KeyValue rated the Agents SDK 3.3/5 vs Mastra 3.5.
- **Codex:** loved (Product Hunt: 121 reviews averaging 5.0) but quota anger is peaking. The Pro 200 allowance drops from 20x to 10x Plus on **Oct 30**. Open 401 auth issues; a self-updating daemon (opt-out `daemon_auto_start = false`).
- **Hooks for the pitch [I]:** HN commenters are bored of restaurant-reservation voice demos, so creative voice stands out. The "agents covertly signalling through CPU cache" story and the July Hugging Face incident ([05]) make **observable, provenance-tagged agent messaging** a timely theme, which is Agent Relay's pitch with a haunted framing.

---

## 4. Contradictions between sub-files: resolved or flagged

| # | Conflict | Resolution |
|---|---|---|
| 1 | Does 6.1 Sol accept reasoning `none`? (02: "reportedly" no, via The Batch) | **Resolved, editor re-fetch of the GPT-6 guide:** "GPT-6 Astra and GPT-6.1 Sol do not support the `none` reasoning effort; GPT-6.1 Terra, GPT-6 Sol, and GPT-6 Luna do." Remove `temperature`/`top_p`/`top_logprobs` when effort ≠ `none` [V][11] |
| 2 | Which models need Responses for tools? (02 listed Astra, Terra) | **Resolved, same page:** Astra, 6.1 Sol **and** 6.1 Terra. GPT-6 Sol/Luna allow Chat Completions tools only at effort `none` [V][11] |
| 3 | Ultrafast price and speed (05: no price on Astra page; CNBC "6x faster API / 8x Codex"; Willison "8x, 300 tok/s") | **Price resolved:** pricing page lists Astra $60/$300 and 6.1 Sol $12/$60; 6.1 Sol page says "6x Standard" (editor re-fetch) [V][1]. **Speed still conflicts** [S]; do not quote a multiple on stage |
| 4 | Ultrafast "WebSockets only" (old 01) | **Resolved:** HTTP supported, WS recommended [V][14] |
| 5 | WS mode "32 parallel lanes" | **Resolved:** 32 named lanes, **max 16 in flight** per socket [V][15] |
| 6 | "JS SDK has no Live helpers" (old 03) | **Resolved:** openai-node has Live since **7.14.0 (09-10)**. Only the agents-js example README (pinned `^7.2.0`) still says otherwise; editor re-read it 10-29 [V][03] |
| 7 | GPT-Live sample backend `gpt-5.6-terra` (01) vs `gpt-6-luna` (03) | **Both true (editor grep):** WebRTC quickstart uses `gpt-5.6-terra`; delegation guide uses `gpt-6-luna`, suggests `gpt-6-sol` for harder tasks [V][6][17] |
| 8 | Does agents-js `examples/live` cover client delegation? | **No (editor re-read):** "This example implements Responses delegation only"; no persistence. Write client delegation yourself [V][03] |
| 9 | GPT-Live instructions "immutable" (ThunderPhone) | **Resolved:** 16,384-token cap, but `session.instructions.append` works. Immutable: **delegation type, voice, model** (`immutable_field_update`) [V][18][6] |
| 10 | GPT-Live "doesn't transcribe the user" (forum) | **Resolved:** `session.input_transcript.delta` / `output_transcript.delta` exist; persist them yourself [V][6] |
| 11 | Decisions output: Luna $0.50 or free? | **Free** for Decisions; $0.50 applies to Responses Luna (incl. as GPT-Live backend) [V][9] |
| 12 | Evals: shutdown 11-30 (05) vs read-only 10-31 (02/04) | **Both:** read-only 10-31, shutdown 11-30 [V][16] |
| 13 | Prizes: "iPhone" vs "iPhone Duo"; Supabase $1k "scale to millions" | Event page says **"iPhone Duo"**. The Supabase prize is in the workflow brief but **not in the captured event text**; confirm at check-in [E] |
| 14 | GPT-6.1 Astra "pulled 09-28" | **Flagged:** only WSJ's report date (09-28) and CNBC's "day before DevDay" are known [S] |
| 15 | GPT-Live max session length | **Unknown.** `expired` = "The session reached its duration limit", no number (editor re-check). Gemini 3.8 Live caps audio at 15 min, for comparison [S] |

---

## 5. Gotchas (deduplicated, ranked by how likely they are to hurt on the day)

1. **Free tier blocks GPT-Live.** Promo credits may not lift the org off Free [I]. Buy $5. Free credits are spent before purchased ones (documented for subscriber credits; applying it to hackathon credits is [I]) [V][13].
2. **Seeing the model listed does not mean you can use it.** The live-console README: "Model metadata access alone does not establish transport access" [V][03]. Run a real call with the exact key you will demo with.
3. **Live and Realtime are separate.** `gpt-live-1` works only on `v1/live/sessions` (no Responses, no structured outputs). `gpt-realtime-*` works only on `/v1/realtime`. Terra works on neither [V][4][03].
4. **Delegation mode, voice and model are fixed at session creation.** Choose **client delegation** from the start if a Durable Actor will be the backend [V][6][18].
5. **Client delegation events carry metadata, not task text.** Rebuild intent from the transcript deltas. Return results with `session.commentary.append {delegation_id, content}` (spoken) or `session.thinking.append` (background; ~500-token cap per a builder report [S]). Send `thinking.append` promptly to suppress the "let me check" filler; `acknowledgement_delay_ms` tunes it [V][6][01].
6. **Builder-reported quirks [S][02]:** no image input on the voice layer (send images to the backend); in delegation mode `response.done.output` is `[]` and function calls arrive via `response.output_item.done` in `response.event` envelopes; the voice model may skip delegation entirely.
7. **WebRTC:** create the `oai-events` data channel **before** the offer, and do **not** send `session.start` over WebRTC. The mic needs HTTPS or localhost [V][17].
8. **Muting does not stop billing.** Always end sessions, and remember each WebRTC create bills 15 s [V][03][01].
9. **Reliability right now:** dropped frames (Oct 28) and slower time to first audio (since Oct 20) [S]. Prefer WebRTC, use headphones (acoustic feedback, barge-in edge cases), and **record a backup video**.
10. **Responses WebSocket:** connections die at 60 min, 16 responses in flight per socket, and steering works only on GPT-6 over WebSocket [V][15].
11. **Breaking changes inside minor releases** to Decisions and Live types (python 3.37.0, node 7.4x). Pin exact versions [V][03].
12. **Stale templates:** `openai-realtime-agents` (pins `@openai/agents ^0.0.5`, `openai ^4.77.3`) and `openai-responses-starter-app` (`openai ^4.87.3`) [V][03]. Coding agents also suggest dead models.
13. **Agents API:** `agents=v1` header, scopes `api.agents.read/write` + `api.responses.write`, US-only, no ZDR, sandbox deleted after **1 h idle**, closing the stream does not cancel the task. Keep your main key out of the sandbox [V][7][19].
14. **Realtime fallback:** avoid default semantic VAD (~4.5 s waits). Use server VAD or `eagerness:"high"` [S].
15. **Cost traps:** Astra at `xhigh`/`max` in loops, and Ultrafast (6x). Set a hard spend limit and use the Oct 21 service-tier restriction to block accidental Ultrafast. Note that the restriction can also make an intended Ultrafast call fail [V][2].
16. **Runtime and tooling edges:** workerd-style runtimes cannot open outbound WebSockets with the global constructor (agents-js ships a beta `CloudflareRealtimeTransport`); whether Terse has this limit is **unverified** [03]. One report saw Realtime hosted MCP stall 2-10 s **only on a `.ai` host** (`useterse.ai` is one) [S][04]. Agents SDK tracing uploads to OpenAI by default [S]. Sandbox providers are blaxel/cloudflare/daytona/e2b/modal/vercel; **Freestyle and Superserve need a custom adapter** [V][03].
17. **Codex as your build tool:** log in Friday (open 401 issues #48237). Pro 200 quota halves Oct 30. Subscriber API credits **cannot** pay for Codex via API key [V/S][04].

---

## 6. Integration recipes

**A. GPT-Live client delegation → Terse actor → Agent Relay (primary) [V API shape, I architecture]**

```js
// server (Node 22+, openai@7.45.1)
const result = await client.live.create({
  session: { model: "gpt-live-1",
    instructions: "You are the house ghost. Delegate anything needing facts, state or actions.",
    delegation: { type: "client" },               // fixed for the session's lifetime
    audio: { output: { voice: SPOOKY_VOICE_ID } } },  // voice ID from prompt-to-voice
  transport: { type: "webrtc", sdp: req.body.sdp } });
```

- Attach a **sideband** WS server-side. On `session.input_transcript.delta`, append to the actor's transcript log. On `session.delegation.created`, send `thinking.append` immediately. Then call the room actor (`actor.handle({delegation_id, transcriptWindow})`). The actor posts subtasks to specialists over Agent Relay, collects replies, and the server sends `session.commentary.append {delegation_id, content}`.
- The actor owns task state. Per the guide, backend work can continue after the caller interrupts, and "your application decides whether to finish or cancel it" [V][3]. That is the durability demo.
- Multiplayer: one actor per house, and each browser holds its own Live session (Build tier: 50 concurrent). The actor broadcasts state [I][03].

**B. Native Decisions reflex (since Oct 15) [V][10][9]**
- Configure `session.triggers` on transcript deltas, or Decisions choices in `session.delegation`. Change questions mid-session with `session.update` and wait for `session.updated`.
- Out-of-band from your own code:

```python
d = client.decisions.create(model="gpt-6-luna", input=transcript_window,
  questions=[{"type":"choice","name":"route","instructions":"Which spirit handles this?","choices":["lore","puzzle","scare"]},
             {"type":"predicate","name":"escalate","instructions":"Should the ghost escalate the scare now?"}])
```

- Python needs `openai>=3.26.0,<4`. On TypeScript, call `client.decisions.create()` from the `openai` npm package; there is no Decisions example in `@openai/agents` 0.21.0 [V][02]. Decisions never executes actions: your actor does.

**C. Free spooky voice (do this Friday) [V][20]:** `POST /v1/audio/voices` with `{"type":"prompt","prompt":"<description>"}` (optional `script_hint` ≤2,000 chars) returns a voice ID. Set `audio.output.voice`. Changing voice requires a new session, so make one voice per persona and one session per persona [I].

**D. Heavier "brain" calls:** `gpt-6.1-sol` via Responses (no `none` effort), or Responses WebSocket mode with `stream_id` lanes, at most 16 in flight. Use `response.steer` to let another agent redirect a running answer live [V][15][21].

**E. Optional long worker:** an Agents API session with webhooks back to the actor, only if set up before Saturday. Keep the system of record in Terse [I].

**F. Fallback voice:** `gpt-realtime-2.1`/`-mini` via `@openai/agents/realtime` `RealtimeSession` + ephemeral `client_secrets` key; no beta header; server VAD [V][22].

---

## 7. Hackathon implications

**What to build**
- **Haunted house or séance.** Several players talk to a GPT-Live ghost with a custom voice. Each spirit or suspect is a **Durable Actor** holding its memory and secrets. Spirits gossip and coordinate over **Agent Relay**, with a live on-screen message log. Decisions picks which door slams or whether a player lied. This hits both host tracks (the bonus), the "Real-Time AI" theme, multiplayer, and OpenAI's two newest GA surfaces [I].
- **A serious alternative** with the same architecture: a real-time ops "war room" [I][05].
- **For the Supabase scale pitch,** cite unit economics: GPT-Live at a flat $0.05/min, Decisions at ~$0.0002 per call, and Luna or realtime-mini for per-user costs [I].

**What judges and sponsors want**
- Event judges reward "very well-executed products or incredibly creative use cases using Durable Actors and Agent Relay" [V][E]. Make OpenAI clearly the mouth and reflexes, with state visibly in Terse.
- OpenAI messaging is about long-running delegated agents, real-time speed, multiplayer and "use our harness". Huet calls it "agentic delegation" [V][05]. An OpenAI judge would likely respond to GPT-Live client delegation plus Decisions [I].
- Agent-safety context (Hugging Face incident, CPU-cache covert channel, GPT-6.1 Astra pulled over safety): show **message provenance, scoped permissions, a budget cap and a kill switch** on the relay [I][04][05].
- A precedent from OpenAI's own Singapore Astra hackathon (Sep 13): 5 hours, a deployed prototype plus a 90-second video. One winning team's post says a **GPT-Live voice co-pilot** won it a "Best Demo" award [S][02].

**Setup before Oct 31** (accounts and knowledge only; all code must be written at the event [E])
1. Do the box checklist: dedicated project, **$5 purchase → Build**, hard spend limit (~$90), service-tier restriction, expiring key (plus Agents scopes if needed).
2. Smoke-test: `gpt-6.1-sol` and `gpt-6-luna` on Responses, `/v1/decisions`, and a **real** `gpt-live-1` WebRTC call (Live Console, or `pnpm install && pnpm build && pnpm -F live start` in openai-agents-js).
3. Create the prompt-to-voice voices and save their IDs. Install Node 22.18+ (24.x for live-console) and pin versions (§1e).
4. Read the live-delegation guide, the WebRTC guide, and openai-node `src/resources/live/`.
5. If a teammate has had Pro/Business for 7+ days, claim subscriber credits into the **same org** you demo from (first grant prorated; changing org needs support) [V][13]. Builderbase signup is at check-in [E].

---

## 8. Limits / could not verify

- **Partly closed 2026-10-30 ([sponsor-coverage-audit §2.1](reference/sponsor-coverage-audit.md)):** OpenAI's 2026 voucher flow is Settings > Billing > Promotions on the receiving org, with a single-use code and a 7-day redemption window (precedent from an OpenAI-authored Sep 2026 event guide). Tiers count only "total credit **purchases**" (rate-limits guide and help center), so a promo voucher very likely leaves the org on Free. Buy $5 and **turn off auto-reload**, which is on by default. Balances can go negative after credits run out.

- **How the $100 hackathon credits are issued** (code, org grant, expiry) and **whether promo or subscriber credits lift an org off Free**. The docs only say "total credit purchases".
- **Maximum GPT-Live session duration:** there is an `expired` reason but no documented number.
- Whether hackathon-issued keys get **GPT-Live transport access** can only be proven by running a call.
- Whether `@openai/agents-realtime` 0.21.0 opens GPT-Live sessions or only `/v1/realtime`.
- Whether Terse's runtime is workerd-like (outbound WebSocket constraint).
- **No OpenAI judge named; no OpenAI prize category.** "More prizes will be announced" might change that.
- Ultrafast **speed** multiples (6x vs 8x) are secondary and conflicting. The exact GPT-6.1 Astra cancellation date is unknown.
- Reddit engagement figures (403), the Reuters "100+ orgs" story (paywall), the Bloomberg Oct 22 valuation article, and the `.ai`-hostname MCP stall (single reporter) are unverified.
- The client-delegation event names above come from the docs read by sub-files. Exact payload shapes should be re-read on the day.
- Funding and revenue figures in [05] are anonymous-source press reports.

---

## Sources

**Event**
- [E] Event page capture: `/Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md` (from https://events.ycombinator.com/haunted-hacks-2026); YC Luma https://luma.com/yc-meetup-7183-9316f87f ; Builderbase Luma https://luma.com/builde-oxba

**OpenAI primary.** Numbers 1-4, 6-7, 9-12, 14-18 and 20-22 are under `https://developers.openai.com/api/docs/` (each page also has a `.md` twin):
1. `pricing` · 2. `changelog` · 3. `guides/live` · 4. `models/gpt-live-1` · 5. https://openai.com/index/introducing-gpt-live-1-in-the-api/ · 6. `guides/live-delegation` · 7. `guides/agents-api/overview`, `guides/agents-api/environments/openai-hosted` · 8. https://openai.com/index/introducing-the-agents-api/ · 9. `guides/decisions` · 10. `guides/decisions-voice` · 11. `guides/latest-model/gpt-6-astra`, `models/gpt-6.1-sol` (also `gpt-6.1-terra`, `gpt-6-luna`, `gpt-6-astra`) · 12. `guides/rate-limits` · 13. `https://developers.openai.com/api/docs/guides/chatgpt-api-credits` and https://help.openai.com/en/articles/20001626-api-credits-benefit-for-eligible-chatgpt-subscriptions · 14. `guides/ultrafast-mode` · 15. `guides/websocket-mode` · 16. `deprecations` and https://openai.com/index/introducing-agentkit/ · 17. `guides/voice-webrtc` · 18. `guides/live-conversations` · 19. https://help.openai.com/en/articles/20001551-agents-api-beta-faq · 20. `guides/custom-voices` · 21. `guides/steering`, `guides/responses-multi-agent` · 22. `guides/realtime`, `models/gpt-realtime-2.1`
- DevDay 2026 recap — https://openai.com/index/devday-2026-recap/ · Hugging Face incident — https://openai.com/index/hugging-face-model-evaluation-security-incident/ · Sign in with ChatGPT — https://help.openai.com/en/articles/20001410-sign-in-with-chatgpt

**GitHub** (`gh api`, 2026-10-29): https://github.com/openai/openai-node · https://github.com/openai/openai-python · https://github.com/openai/openai-agents-js (`examples/live/README.md`) · https://github.com/openai/openai-agents-python (issue #5353) · https://github.com/openai/openai-live-console · https://github.com/openai/openai-realtime-agents · https://github.com/openai/codex

**Community, press, social**
- OpenAI forum: https://community.openai.com/t/introducing-gpt-live-1-in-the-api/1396471 · https://community.openai.com/t/gpt-live-1-slower-to-start-responding-since-oct-20/1410555 · https://community.openai.com/t/gpt-live-gpt-live-1-output-audio-frames-generated-and-recorded-but-not-delivered-to-the-client-websocket-and-webrtc/1410537 · https://community.openai.com/t/realtime-api-hosted-mcp-listings-calls-stall-2-10-s-or-fail-before-connecting-only-for-a-ai-hostname/1407759
- Hacker News: https://news.ycombinator.com/item?id=49653985 · https://news.ycombinator.com/item?id=49984025 · https://news.ycombinator.com/item?id=50060694 · https://news.ycombinator.com/item?id=50251200 · https://news.ycombinator.com/item?id=49238851
- X: https://twitter.com/OpenAI/status/2110797830361436604 · https://nitter.gq/OpenAIDevs/status/2115583698074755078
- https://thunderphone.com/blog/gpt-live-first-impressions · https://apptycoons.com/research/voice-agent-latency-benchmark · https://startupfortune.com/openai-cuts-chatgpt-pro-200-usage-in-half-as-the-grace-period-ends-today/ · https://www.cnbc.com/2026/09/29/openai-devday-2026-live-updates.html · https://www.deeplearning.ai/the-batch/sol-nearly-eclipses-astra · https://simonw.substack.com/p/openai-devday-2026-live-blog

Full per-claim source lists and verification logs: [01](openai/01-docs-api.md) · [02](openai/02-newest-features.md) · [03](openai/03-github-code.md) · [04](openai/04-social-pulse.md) · [05](openai/05-team-strategy.md).
