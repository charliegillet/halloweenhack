# Realtime voice agent stacks: latency, pricing, and what ships (as of 2026-10-29)

Researched 2026-10-29 for Haunted Hacks (Sat 2026-10-31, 5 build hours). Angle: the voice layer only. I used Exa search/fetch, WebFetch, and `gh api`. Claude in Chrome was not used. Each claim links to its source. **[V]** means I read it on a primary or vendor page. **[3P]** means a third-party writeup I could not check against the primary. **[INF]** means my own inference. Anything dated before 2026-08-01 is labelled *background*.

---

## TL;DR

1. **The big change this quarter is that the voice layer is now split from the agent.** OpenAI shipped **GPT-Live-1** to the API on 2026-09-10 at **$0.05/min**, billed per second. It is a full-duplex "speaker" model that *delegates* reasoning and tool calls to a backend: either an OpenAI Responses model or, in **client delegation** mode, any agent or service your app runs [V]. Vapi built its GPT-Live beta around the same speaker/reasoner split [V]. For this hackathon, that backend can be a Terse Durable Actor or a group of Agent Relay agents. [INF]
2. **Real caller-side latency is about 1–2 s, whatever the vendor pages say.** Openbenchmarks measured five managed phone platforms at **1,296–1,740 ms median** time to first audio byte (TTFAB), and none came in under 1 s [3P]. Vendor figures like "~75 ms" or "sub-90 ms" only cover TTS first byte. Endpointing (deciding the user has finished speaking) is the largest single cost [3P].
3. **Raw speech-to-speech TTFA, from Artificial Analysis (retrieved 2026-10-17)** [3P summary of AA]: Grok Voice 3.0 0.81 s, GPT-Realtime-2.1 Minimal 0.97 s, Gemini 3.8 Live 1.18 s, GPT-Live-1 (Astra, medium) 1.34 s. **Correction (verified on AA's live page 2026-10-29):** AA's Speech-to-Speech Index is now topped by **Phonic 1 (High) at 87.1** (TTFA 0.61 s), with Grok Voice 3.0 second (86.9) and GPT-Live-1 Astra third (83.2) [V AA]. The secondary summaries that put Grok first are out of date.
4. **Cheapest speech-to-speech per minute is Gemini 3.8 Live**, at $0.005/min audio in and $0.018/min audio out [V]. The catch is that the whole context is re-billed every turn [3P]. OpenAI `gpt-realtime-2.1` is still $32/$64 per 1M audio tokens. `gpt-realtime-2.1-mini` is $10/$20 [V].
5. **Do not build on Hume.** Hume is shutting down its EVI and TTS APIs on **2026-11-13**, announced 2026-10-02 [V].
6. **Durable Objects already host voice agents.** Cloudflare's `@cloudflare/voice` runs STT→LLM→TTS inside a DO over a single WebSocket, with SQLite memory [V]. That is the same pattern Terse's open-source DO alternative is selling. [INF]

---

## 1. Speech-to-speech model APIs

### OpenAI: two product lines now

| Model | Price | Notes | Src |
|---|---|---|---|
| `gpt-live-1` | **$0.05/min**, billed per second; backend model and tools billed separately | Full duplex, delegation, endpoint `v1/live/sessions` (**not** `v1/realtime`). Concurrency: Build 50 / Launch 300 / Grow 500 sessions. **No free tier.** | [V] model page |
| `gpt-realtime-2.1` | Audio $32 in / $64 out / $0.40 cached per 1M; text $4/$24 | Turn-based with configurable reasoning effort. 128k context. Improves on gpt-realtime-2's alphanumerics, noise handling, and interruptions | [V] |
| `gpt-realtime-2.1-mini` | Audio $10/$20/$0.30 per 1M | Cheap tier | [V] |
| `gpt-realtime-translate` / `-whisper` | $0.034/min, $0.017/min | Launched with gpt-realtime-2 on 2026-05-07 (*background*) | [V] Reuters |

**What the GPT-Live-1 launch post says (2026-09-10) [V]:**
- Full Duplex Bench is **+30 pp over GPT-Realtime-2.1**. Paired with GPT-6 Astra (medium), it is "#1 on Tau3".
- Customer quotes: Yelp (CTO Alex Levy) reports "meaningful improvements in call handling rates" for Yelp Host. Speak (CTO Andrew Hsu) says it "cut interruptions during thinking pauses by almost 80%". Tony Stoyanov, Co-Founder & CTO (the post's text does not name his company), says it "simplified our code base by 80% and removed 23K lines of code" compared with their cascaded build. Intercom Fin (COO Jordan Neill) and Cognition's Devin (CPO Walden Yan) are also quoted.
- Supports telephony/SIP, keyword biasing, and native turn detection.

**How delegation works** ([live-delegation guide](https://developers.openai.com/api/docs/guides/live-delegation)) [V]:
- **Responses delegation:** `delegation: {type: "responses", responses: {model: "gpt-6-luna", instructions, tools}}`. OpenAI runs the backend for you.
- **Client delegation:** GPT-Live emits `session.delegation.created`, which carries an `id` and **no task text**. Your app rebuilds the request from `session.input_transcript.delta`. It replies with `session.commentary.append` (GPT-Live says it aloud) or `session.thinking.append` (quiet progress). Each append (`instructions`, `thinking`, `commentary`) is limited to **500 tokens**. Any thinking or commentary append cancels *all* pending automatic acknowledgments in the session, including those for other delegations; `acknowledgement_delay_ms` controls when the auto-ack fires. No timeout is documented. (The phrase "Live speech and delegated work continue independently" appears in the guide's Responses-delegation section, not the client section.) Your app has to keep conversation history itself.
- Over WebRTC, `POST /v1/live/sessions` bills 15 s up front at init. Per the guide, that amount "is credited against duration charges once the session starts running", so it is not an extra 15 s [V]. **The GPT-Live WebRTC flow documents no ephemeral client secret:** the browser posts its SDP offer to *your* server, which calls `POST /v1/live/sessions` with the project API key. The `/v1/realtime/client_secrets` ephemeral flow belongs to the older Realtime API [V].

### Google Gemini Live

- **Gemini 3.8 Live** and **3.8 Live Extended Thinking** launched **2026-09-15**. Google says Extended Thinking ranks "#1 on Artificial Analysis' Speech-to-Speech leaderboard" as of launch. As of 2026-10-29, AA's live index lists Phonic 1 (High) first (87.1), Grok Voice 3.0 second (86.9), and Gemini 3.8 Live Extended Thinking (High) fourth (82.6, TTFA 1.35 s) [V Google blog; V AA page].
- Paid tier [V pricing page]: audio **$3/1M in (≈$0.005/min)**, **$12/1M out (≈$0.018/min)**. Text is $0.75/$4.50. **The AI Studio free tier is "free of charge"**, which helps with a hackathon budget.
- The gotcha, per Duplex Compute (2026-10-13) [3P]: the Live API "charges you per turn for all tokens present in the session context window". Past audio is re-billed every turn. Audio-only sessions without compression end at 15 min. The worked example gives $0.05–$0.093/min with compression, against the $0.011/min headline.
- Protocol [V Vertex docs]: stateful WSS, 16 kHz PCM in and 24 kHz PCM out, default 10-min conversation.

### Others worth knowing (from the AA leaderboard)

| Model | TTFA (s) | Big Bench Audio | Note |
|---|---|---|---|
| Phonic 1 (High) | 0.61 | n/a | Current #1 on AA's S2S Index (87.1) [V AA]. I did not research Phonic's pricing or API |
| Grok Voice 3.0 (xAI, now branded "SpaceXSI") | 0.81 | 98.5% | Released 2026-10-14. **$0.08/min ($4.80/hr)**, same as Grok Voice 2.0; `grok-voice-latest` auto-migrated [V [x.ai/news/grok-voice-3](https://x.ai/news/grok-voice-3)] |
| Gemini 3.1 Flash Live Minimal | 0.96 | 71.3% | Fast but weak on τ-Voice (26.2%) |
| GPT-Realtime-2.1 Minimal / High | 0.97 / 1.21 | 86.8 / 95.8% | Reasoning effort trades latency for accuracy |
| Gemini 3.8 Live | 1.18 | 91.7% | Cheapest per hour of input in AA's table ($0.84) |
| GPT-Live-1 Sol low / Astra med | 1.24 / 1.34 | 89.0 / 90.1% | Best τ-Voice score (74.5%) |
| Nova 2.0 Sonic (AWS) | 1.14 | 88.1% | |
| ElevenLabs "Realtime v1 Mini" / "v1 Max" | 0.57 (Max, per AA) | n/a | ElevenLabs API pricing page lists Mini at 620 ms and Max at 570 ms TTFA, both $0.08/min + LLM, "OpenAI Realtime-compatible" [V elevenlabs.io/pricing/api]. AA lists Max as its third-fastest model |

Source: [metaprompt.ai summary of AA, retrieved 2026-10-17](https://metaprompt.ai/posts/fastest-speech-to-speech-models) and [aiaulis.com on the Grok Voice 3.0 index](https://aiaulis.com/en/juttu/artificial-analysis-grok-voice-3-0-leads-its-speech-to-speech-index-e8187c46a517/) [3P]. AA's own page confirms the top-3 fastest ordering (Raon SpeechChat 0.04 s, Deepslate Opal 0.44 s) [V]. AA measures model TTFA over raw APIs, so these numbers are **not** caller-experienced latency.

---

## 2. Orchestration frameworks (open source)

| | LiveKit Agents | Pipecat (Daily) |
|---|---|---|
| GitHub (2026-10-29, `gh api`) | `livekit/agents` 15,003★. Latest release `livekit-agents@1.8.10` on 2026-10-29. Seven releases in October (1.8.4–1.8.10). `agents-js` 953★, `@livekit/agents@1.9.5` on 10-28 | `pipecat-ai/pipecat` 16,930★. `v1.15.0` on 2026-10-29, `v1.14.0` on 10-24, `v1.13.0` on 10-19. `v1.0.0` on 2026-04-14 (*background*) |
| Language | Python (primary), with a younger Node/TS port | Python. Web/React clients updated 10-29 |
| Hosting price | LiveKit Cloud **agent session $0.01/min**. Build plan: 1,000 min free, 5 concurrent. Ship $50/mo [V] | Pipecat Cloud **agent-1x $0.01/min active**. Daily WebRTC 1:1 voice **free** on Pipecat Cloud. 0–10k session min/mo free [V] |
| Extras | LiveKit Inference (one key for STT/LLM/TTS). Turn detection and adaptive interruption are free on Cloud. Pricing calculator example: about **$0.041–0.048/min** all-in [V] | 80+ provider integrations. GA 2026-01-08 with "P99 agent start < 1 s" (vendor claim, *background*) |

Recent independent results: in one March 2026 LinkedIn test using the same Deepgram Nova-3, GPT-4.1-nano, and Cartesia Sonic 3 stack everywhere, LiveKit had 948 ms median TTFB, Retell 962, Vapi 1,018, and Pipecat 1,038 (*background*, [3P], author is a competitor, Rapida). Effloow (2026-09-15) saw desynchronization when Pipecat ran on **LiveKit transport with multiple active audio tracks**, but it had no verified p95 numbers [3P].

Hackathon winners in 2026 favoured LiveKit Agents for "agent-as-participant" builds and telephony (London AI Hack "Best Use of LiveKit", Amazon Nova hackathon phone agent, ListenHacks Steerio) [3P, *background*].

---

## 3. Managed voice-agent platforms

| Platform | Published price | What it covers | Src |
|---|---|---|---|
| **Vapi** | $0.05/min platform fee (prepaid) | Hosting only. Models "pass-through at cost". Included concurrency: 4 lines with no package, 10 on Core ($29/mo), 30 on Pro; extra lines $10/mo each. HIPAA add-on $2k/mo | [V] vapi.ai/pricing (fetched 2026-10-29) |
| **Retell** | $0.07–$0.31/min | $0.055 voice infra + TTS ($0.015 platform voices up to $0.10 for ElevenLabs v4) + LLM. US telephony $0.015/min. 20 concurrent free. Default calculator shows $0.11/min | [V] retellai.com/pricing |
| **ElevenLabs Agents** | $0.08/min (overage), LLM billed on top | Price cut from $0.10 on 2026-05-07 (*background*). Free tier: 15 min, 4 concurrent. Burst pricing $0.16/min. Telephony included (carrier billed separately) | [V] |
| **Cartesia agents** | $0.06/min + $0.014/min telephony | Free plan: $1 agent credit, 8 concurrent calls | [3P] frontdeskreview, thetoolsverse |
| **Hume EVI** | (EVI 4-mini overage was $0.02–0.03/min) | **API shuts down 2026-11-13** | [V] Hume changelog |

**Measured cost per minute, from Openbenchmarks' invoices** [3P]: Telnyx $0.050, ElevenLabs $0.079, Vapi $0.084, Retell $0.134, Bland $0.141.

**Vapi activity in the last 90 days** [V Vapi blog/changelog]:
- GPT-Live beta opened to all customers on 2026-10-02. It uses separate "speaker prompt" and "reasoner prompt", and squads become reasoner skills.
- Personal Agent Calling beta on 2026-10-07. This covers agent-to-business calls and checking who an agent is acting for.
- Traffic splitting / canary versions shipped in the week-of-2026-10-12 changelog; the explainer blog post followed on 2026-10-26. The same changelog added GPT-Live DTMF (keypad) input and Google Calendar/Sheets/Slack tools on the GPT-Live reasoner.

**Reliability versus speed.** In Cekura's archived v0 benchmark (July 2026, 1,062 calls), ElevenLabs had the fastest median (1.73 s) but the lowest pass³ (76.3%). Retell was 1.96 s with 96.6% pass³ [3P, vendor-adjacent evaluator].

---

## 4. Component vendors (cascade: STT → LLM → TTS)

**Deepgram** [V pricing + docs]
- **Flux** streaming STT costs **$0.0077/min** PAYG, the same as Nova-3. It has built-in end-of-turn detection: `StartOfTurn` and `EndOfTurn`, plus `EagerEndOfTurn` and `TurnResumed` for speculative LLM calls. Docs claim "~260 ms end-of-turn detection". Defaults are `eot_threshold` 0.7 and `eot_timeout_ms` 5000.
- New accounts get **$200 free credit**. Flux TTS costs $0.045/1k chars. Aura-2 costs $0.030/1k chars.
- Flux also runs on Cloudflare Workers AI as `@cf/deepgram/flux` [V].

**Cartesia**
- **Sonic-3.6** went GA on 2026-08-27. Cartesia claims "under 90 ms" and 132 chars/s generation, and the blind-test preference over 3.5 was about 2:1 [V blog/changelog].
- The only third-party latency figure is for Sonic 3.5: a **128 ms median TTFA** (Vapi Humanness Index, June 2026) [3P].
- **Sonic-2, Sonic-turbo, and the Sonic-3-2025-10-27 snapshot are sunset after 2026-10-20** [V changelog]. Old tutorials will break.
- Ink-2 STT went multilingual in September 2026 [V].

**ElevenLabs** [V]
- **Eleven v4 Turbo** is the default for "Expressive mode". It has ~100 ms median inference, 90+ languages, and supports `[laughs]` / `[whispers]` / `[sighs]` tags. It comes with a new turn-taking system driven by Scribe v2 Realtime prosody signals.
- API TTS is $0.04/1k chars for Flash/Turbo/v4 Turbo (after a launch promo ended 2026-10-12) and $0.08 for v3/v4 [3P micdrop, consistent with the V pricing page].
- Flash is about 75 ms.
- The v3/v4 dialogue WebSocket holds one concurrency slot for the whole call [3P].

**Hume:** dead after 2026-11-13 (see above). Its configurable turn-detection settings (800 ms default silence) are moot now.

---

## 5. Where the latency actually goes

- **Codebridge (2026-08-10, 499 live calls)** [3P]:
  - With endpointing handed to the stack ("Clock A"), the best stack was 707 ms.
  - With the stack doing its own endpointing ("Clock B"), results were **758 ms – 2.4 s**.
  - A 680 ms mid-sentence pause got **0 clean passes in 65+ attempts across OpenAI, Google, Deepgram, ElevenLabs, and LiveKit**.
  - Stage medians for LiveKit with nova-3 defaults: endpoint 584 ms, STT 307, LLM first token 322, TTS 134.
  - The fastest config (Qwen3-4B, 758 ms) got the confirmation code wrong 7 out of 7 times.
- **Openbenchmarks** [3P] found vendor-reported latency about **490 ms lower** than what was audible in recordings. Note that it pins endpointing to a fixed 0.1 s and runs anonymously, per Codebridge's critique, so its numbers understate semantic-endpointing delay rather than overstate it. Joinoasis's advice: "add roughly 500 ms" to any vendor number.
- **Practitioner consensus.** The OpenAI forum (`conversation.item.truncate` is needed on WebSocket after barge-in; WebRTC/SIP handle it automatically) [V], a DEV.to harness post from 2026-10-21 [3P], and Reddit threads quoted by Codebridge all agree: **interruptions and endpointing hurt UX more than model latency**. I could not open the Reddit threads directly.

---

## 6. What people actually ship

**Background (pre-August 2026):**
- Phone agents: booking, insurance claims, IVR navigation with DTMF.
- Meeting "agent-as-participant" (EchoGuard, LiveKit).
- Voice "OS" demos. A gpt-realtime-2 phone OS won a Cerebral Valley/OpenAI hack night, per Teri Yu's LinkedIn post (June 2026).
- Compliance guard layers on LiveKit (Steerio).

**Last 90 days:**
- Production references for GPT-Live are customer support and scheduling: Yelp Host, Intercom Fin (per the quoted COO), Speak tutoring [V].
- Vapi's roadmap is about canary rollouts and **agent-to-business calls** [V].
- Cloudflare is pushing voice-in-a-Durable-Object (`withVoice(Agent)`, the `useVoiceAgent` hook from `agents/voice/react`), with a voice-agent example updated 2026-10-29 [V]. Voice now ships inside the `agents` package (v0.23.0+, import `agents/voice`); the standalone `@cloudflare/voice` package is deprecated but still works [V CF docs].

---

## Limits / could not verify

- I did not run any latency tests myself. All numbers are vendor claims or third-party benchmarks with different clocks, so do not compare across tables.
- I read the AA leaderboard through two secondary summaries plus AA's own top-3 FAQ line. I did not render AA's full table.
- Vapi pricing was re-fetched first-hand on 2026-10-29 during verification (see log).
- I did not fetch Cartesia pricing first-hand.
- I did not research Phonic (the current AA #1) at all.
- **Daily standalone pricing**, apart from Pipecat Cloud's transport and telephony lines, was not checked.
- I did not run the `last30days` social sweep, so social sentiment here is secondhand, mainly Reddit and HN quotes inside Codebridge's article.
- Tested Media's study (680–920 ms) has no published methodology, according to Codebridge.
- The "Rapida" comparison comes from a competitor.
- I found no Terse or Agent Relay voice integrations. The adjacent sections of this research cover those products.

---

## Hackathon implications

**What to build (voice as the Halloween hook, actors and relay as the scoring core):**
1. **"Haunted house switchboard."** Use GPT-Live-1 as the ghost's voice in **client delegation** mode. Each `session.delegation.created` goes to a **Terse Durable Actor** (one actor per room or per ghost, holding state and memory). That actor fans work out over **Agent Relay** to specialist agents (a lore agent, a scare-director agent, a "séance tool" agent). Results come back through `session.thinking.append` while the ghost keeps talking, then `session.commentary.append` for the reveal. This hits both bonus criteria and the "Real-Time AI" theme. The demo story is that the voice never blocks while agents collaborate. [INF]
2. **Multiplayer séance.** Several browsers join one Durable Actor room. The actor owns the shared transcript and turn arbitration, and one realtime voice speaks to the group. Persistent actor state is the "scale to millions" pitch: one actor per session, scaling horizontally. [INF]
3. **Cheaper fallback:** a cascade inside the actor (Deepgram Flux STT, any LLM, Cartesia or ElevenLabs TTS). This copies Cloudflare's `withVoice` design: one WebSocket, 16 kHz mono 16-bit PCM up, sentence-chunked TTS down (Cloudflare defaults to MP3 downstream). You must pick the STT and TTS providers yourself because there are no defaults.

**Gotchas:**
- GPT-Live has **no free tier**. It uses `v1/live/sessions`, not `v1/realtime`, so Realtime SDK samples will not work unchanged. Browser WebRTC must go through your own server (project key, no documented ephemeral token), so a backend endpoint is required from minute one. A Terse actor or Supabase Edge Function can do the job. Each append is capped at 500 tokens. The delegation event contains **no task text**, so rebuild it from transcript deltas.
- Over WebSocket you must call `conversation.item.truncate` after barge-in. With WebRTC this happens automatically. **Use WebRTC in the browser.**
- Gemini Live re-bills context every turn and has a 15-min audio session cap without compression. It is fine for a demo and free on AI Studio.
- Cartesia Sonic-2 and Sonic-turbo are gone after 2026-10-20. Hume shuts down on 2026-11-13. Old code examples for either will fail.
- On-stage Wi-Fi and room noise will cause false barge-ins. Bring a headset mic and consider push-to-talk for the live demo.
- Mid-sentence pauses beat every endpointer in Codebridge's test, so script the demo lines.

**Setup to do before Oct 31** (writing code at the event is required, but account setup ahead of time is fine):
- OpenAI: confirm your org can create `gpt-live-1` sessions. The model page lists Free as an unsupported usage tier, so you need a paid tier. The event page promises $100 OpenAI credits per participant, which will most likely be handed out on the day, so do not count on them for pre-event testing. Run the WebRTC quickstart once, including the server-side SDP exchange.
- Get a Gemini AI Studio key as a free fallback.
- Deepgram account ($200 credit). Cartesia or ElevenLabs free key.
- LiveKit Cloud Build plan (1,000 free agent minutes) *only if* you need telephony or multi-participant rooms.
- Read the Terse quickstart and work out how WebSockets attach to an actor, because the actor needs to hold or bridge the audio session.

**What judges and sponsors want:**
- The hosts score use of Durable Actors and Agent Relay, not voice quality. Voice is the theme multiplier and the demo hook.
- OpenAI is a sponsor, so a GPT-Live client-delegation build uses their newest API in a way few people will have tried. [INF]
- For the Supabase prize, persist transcripts and actor events to Supabase.
- Keep the voice loop to one model hop, and show a live latency or agent-activity panel so the "real-time" claim is visible.

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live primary pages (WebFetch, Exa fetch, `gh api`). Outcomes: **OK** = confirmed, **FIXED** = corrected in place above, **ADDED** = new material.

| # | Claim | Checked against | Outcome |
|---|---|---|---|
| 1 | GPT-Live-1 is $0.05/min billed per second, uses `v1/live/sessions` (not `v1/realtime`), has no Free tier, and allows Build 50 / Launch 300 / Grow 500 concurrent sessions | developers.openai.com/api/docs/models/gpt-live-1 | OK |
| 2 | GPT-Live launched in the API 2026-09-10; +30 pp Full Duplex Bench; #1 on Tau3 with GPT-6 Astra (medium) | openai.com/index/introducing-gpt-live-1-in-the-api/ | OK |
| 3 | The "23K lines" quote came from an "unnamed company's CTO" | same launch post | FIXED. It is attributed to Tony Stoyanov, Co-Founder & CTO (company not named in the text), and also says "simplified our code base by 80%". Yelp, Speak, Intercom and Devin quotes are now attributed by name |
| 4 | Client delegation: `session.delegation.created` carries no task text; commentary/thinking appends are capped at 500 tokens; "Live speech and delegated work continue independently" | live-delegation guide (.md) | Partly FIXED. The 500-token cap and the no-task-text rule are confirmed. The quoted phrase belongs to the Responses-delegation section. ADDED: appends cancel all pending auto-acks |
| 5 | WebRTC bills 15 s at init and "credits it back" | voice-webrtc guide | FIXED wording ("credited against duration charges"). ADDED: GPT-Live WebRTC goes through a server-side SDP exchange using the project key, with no documented ephemeral client secret |
| 6 | `gpt-realtime-2.1` audio $32/$64/$0.40 cached, 128k context; `-mini` $10/$20/$0.30; translate $0.034/min and whisper $0.017/min | model page + developers.openai.com/api/docs/pricing | OK |
| 7 | Gemini 3.8 Live launched 2026-09-15; audio $3/$12 per 1M (~$0.005/$0.018 per min); free tier "Free of charge" | blog.google post + ai.google.dev pricing | OK. The price block is shared with 3.8 Live Extended Thinking and 3.1 Flash Live preview |
| 8 | Grok Voice 3.0 tops AA's S2S Index (86.9) with GPT-Live Astra second | artificialanalysis.ai/speech-to-speech (live) | **FIXED.** Phonic 1 (High) is #1 at 87.1, Grok second, GPT-Live Astra third. AA shows no last-updated date |
| 9 | Grok Voice 3.0 at $0.08/min (marked one secondary source) | x.ai/news/grok-voice-3 (2026-10-14) | Upgraded to [V]: $0.08/min, $4.80/hr, same price as 2.0 |
| 10 | Hume shuts down EVI and TTS APIs on 2026-11-13, announced 2026-10-02 | dev.hume.ai/voice/changelog | OK. Access ends 12:01 a.m. EST on Nov 13, and account data is deleted afterwards |
| 11 | LiveKit `agents` has 15,001★ and four October releases; Pipecat has 16,930★ with v1.13–1.15 | `gh api` | FIXED. LiveKit has 15,003★ and **seven** October releases (1.8.4–1.8.10). Pipecat OK. agents-js 953★ and 1.9.5 on 10-28 OK |
| 12 | LiveKit Cloud is $0.01/min per agent session, Build plan includes 1,000 min and 5 concurrent, Ship is $50/mo, turn detection is free on Cloud | livekit.com/pricing.md | OK |
| 13 | Vapi is $0.05/min with 10 concurrent lines included (from 3P sources) | vapi.ai/pricing (first-hand) | FIXED. 4 lines with no package, 10 on Core ($29/mo), 30 on Pro. The $0.05 fee, at-cost pass-through and $2k HIPAA add-on are confirmed |
| 14 | Vapi GPT-Live beta opened to all customers 2026-10-02; traffic splitting 2026-10-26; Personal Agent Calling 2026-10-07 | Vapi blog posts + docs.vapi.ai/whats-new/2026/10/12 | OK, with a nuance. Traffic splitting first appears in the week-of-10-12 changelog, and the blog post is dated 10-26 |
| 15 | Retell: $0.055 infra, TTS $0.015–$0.10, US telephony $0.015, 20 concurrent free, calculator $0.11/min | retellai.com/pricing | OK |
| 16 | ElevenLabs Agents: $0.08/min overage, 15 free minutes, 4 concurrent, burst $0.16; Realtime v1 Mini 620 ms at $0.08/min | elevenlabs.io/pricing/agents + /pricing/api | OK. Realtime v1 Mini appears on the **API** pricing page, not the Agents page. ADDED: Realtime v1 Max at 570 ms |
| 17 | Deepgram Flux at $0.0077/min, $200 free credit, Aura-2 $0.030/1k, Flux TTS $0.045/1k | deepgram.com/pricing | OK. Multilingual Flux is $0.0078 |
| 18 | Cartesia Sonic-3.6 GA 2026-08-27; Sonic-2, Sonic-turbo and Sonic-3-2025-10-27 sunset after 2026-10-20; Ink-2 multilingual in Sept | docs.cartesia.ai/changelog/2026 | OK |
| 19 | Cloudflare `@cloudflare/voice` runs STT→LLM→TTS in a DO over one WebSocket with SQLite memory | developers.cloudflare.com/agents/communication-channels/voice/ | FIXED. It now ships in `agents` v0.23.0+ as `agents/voice`, and `@cloudflare/voice` is deprecated. Downstream audio defaults to MP3, and STT/TTS providers are required (no defaults) |
| 20 | Codebridge benchmark (2026-08-10, 499 calls, 707 ms best, 758 ms–2.4 s, 0/65+ on 680 ms pause); Openbenchmarks 1,296–1,740 ms medians and invoice costs | codebridge.tech article; openbenchmarks.com/voice-agent-latency/vapi | OK. The Codebridge article was updated 2026-08-27. ADDED caveat: Openbenchmarks pins endpointing at 0.1 s |
| 21 | Setup item to "load the $100 credit" | EVENT_PAGE.md | Clarified. The event page lists $100 OpenAI credits per participant. Timing of the grant is not stated, so it is probably not usable before the event (inference) |

**Not re-verified (left as originally sourced):** the per-model TTFA and Big Bench Audio figures for non-top models in the Section 1 table (3P via MetaPrompt), Effloow, Cekura, Rapida, the DEV.to harness, background hackathon winners, ElevenLabs v4 Turbo specs, and Cartesia/Pipecat Cloud pricing.

---

## Sources

**Primary / vendor [V]**
- OpenAI API pricing: https://developers.openai.com/api/docs/pricing
- GPT-Realtime-2.1 model page: https://developers.openai.com/api/docs/models/gpt-realtime-2.1
- GPT-Live-1 model page: https://developers.openai.com/api/docs/models/gpt-live-1
- GPT-Live launch post (2026-09-10): https://openai.com/index/introducing-gpt-live-1-in-the-api/
- GPT-Live getting started: https://developers.openai.com/api/docs/guides/live
- GPT-Live delegation: https://developers.openai.com/api/docs/guides/live-delegation
- GPT-Live WebRTC: https://developers.openai.com/api/docs/guides/voice-webrtc
- Reuters via StreetInsider (2026-05-07): https://www.streetinsider.com/Reuters/OpenAI+unveils+three+audio+models+for+real-time+voice+tasks/26451805.html
- OpenAI forum, transient-noise interruptions: https://community.openai.com/t/short-background-noises-transients-interrupting-realtime-voice-agents-and-breaking-the-conversation-how-are-you-handling-this/1408109
- Gemini pricing: https://ai.google.dev/gemini-api/docs/pricing
- Google blog, Gemini 3.8 Live (2026-09-15): https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/
- Vertex Live API docs: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api
- Artificial Analysis S2S: https://artificialanalysis.ai/speech-to-speech
- LiveKit pricing: https://livekit.com/pricing.md
- LiveKit inference pricing: https://livekit.com/pricing/inference
- LiveKit billing docs: https://docs.livekit.io/deploy/admin/billing/
- Pipecat Cloud pricing: https://www.daily.co/pricing/pipecat-cloud/
- Pipecat Cloud GA: https://www.daily.co/blog/pipecat-cloud-is-now-generally-available/
- Pipecat v1.0.0: https://github.com/pipecat-ai/pipecat/releases/tag/v1.0.0
- GitHub (`gh api`, 2026-10-29): https://github.com/livekit/agents
- GitHub: https://github.com/pipecat-ai/pipecat
- GitHub: https://github.com/livekit/agents-js
- GitHub: https://github.com/openai/openai-agents-js
- Retell pricing: https://www.retellai.com/pricing
- Vapi pricing (fetched 2026-10-29): https://vapi.ai/pricing
- xAI Grok Voice 3.0 announcement (2026-10-14): https://x.ai/news/grok-voice-3
- xAI voice API pricing: https://x.ai/api/voice
- ElevenLabs Agents pricing: https://elevenlabs.io/pricing/agents
- ElevenLabs API pricing: https://elevenlabs.io/pricing/api
- ElevenLabs price cut (2026-05-07): https://elevenlabs.io/blog/weve-lowered-api-agents-pricing-and-introduced-pay-as-you-go
- ElevenLabs Expressive mode: https://elevenlabs.io/docs/eleven-agents/customization/voice/expressive-mode.mdx
- Deepgram pricing: https://deepgram.com/pricing
- Flux config: https://developers.deepgram.com/docs/flux/configuration
- Flux quickstart: https://developers.deepgram.com/docs/flux/quickstart
- Cartesia Sonic-3.6: https://www.cartesia.ai/blog/sonic-3.6
- Cartesia changelog: https://docs.cartesia.ai/changelog/2026
- Hume changelog (sunset): https://dev.hume.ai/voice/changelog
- Hume EVI overview: https://dev.hume.ai/voice/docs/speech-to-speech-evi/overview
- Vapi GPT-Live beta: https://vapi.ai/blog/gpt-live-beta
- Vapi traffic splitting: https://vapi.ai/blog/traffic-splitting-is-live
- Vapi personal agents: https://vapi.ai/blog/your-next-customer-call-may-come-from-a-personal-agent
- Vapi changelog, week of 2026-10-12: https://docs.vapi.ai/whats-new/2026/10/12
- Cloudflare voice agents blog: https://blog.cloudflare.com/voice-agents/
- Cloudflare voice docs: https://developers.cloudflare.com/agents/communication-channels/voice/
- Cloudflare voice example: https://github.com/cloudflare/agents/blob/main/examples/voice-agent/README.md
- OpenAI Agents SDK Cloudflare transport: https://openai.github.io/openai-agents-js/extensions/cloudflare/
- Mastra OpenAI realtime voice: https://mastra.ai/integrations/voice/openai

**Third-party [3P]**
- Codebridge benchmark (2026-08-10): https://www.codebridge.tech/articles/voice-ai-phone-agents-latency-benchmark
- Openbenchmarks, Vapi page: https://openbenchmarks.com/voice-agent-latency/vapi
- Joinoasis (2026-08-24): https://joinoasis.com/blog/best-ai-voice-agents
- Cekura v0 benchmark: https://benchmarks.cekura.ai/experiments/fixed-stack-v0
- Effloow (2026-09-15): https://effloow.com/articles/pipecat-livekit-realtime-voice-latency-benchmark-2026
- Rapida LinkedIn post (2026-03-24): https://www.linkedin.com/feed/update/urn:li:activity:7442140835971829760
- MetaPrompt AA summary: https://metaprompt.ai/posts/fastest-speech-to-speech-models
- AI Aulis on Grok Voice 3.0: https://aiaulis.com/en/juttu/artificial-analysis-grok-voice-3-0-leads-its-speech-to-speech-index-e8187c46a517/
- Duplex Compute, Gemini Live pricing: https://duplexcompute.com/research/gemini-live-api-pricing/
- aireiter, Realtime pricing: https://aireiter.com/blog/openai-realtime-api-pricing
- AI/TLDR, GPT-Live-1: https://ai-tldr.dev/releases/openai-gpt-live-1-api/
- micdrop, ElevenLabs pricing: https://micdrop.dev/blog/elevenlabs-api-pricing-voice-agent
- Front Desk Review, Cartesia pricing: https://frontdeskreview.com/software/ai-voice-agents/cartesia/
- Front Desk Review, per-minute cost guide: https://frontdeskreview.com/guides/developer-voice-platform-per-minute-cost/
- OndaLabs, Cartesia review: https://ondalabs.app/blog/cartesia-sonic-review
- centricallai, Vapi vs Retell: https://www.centricallai.com/compare/vapi-vs-retell
- CloudTalk, Retell vs Vapi: https://www.cloudtalk.io/retell-ai-vs-vapi-ai/
- Burki, Hume migration: https://burki.dev/blog/hume-api-shutdown-migration-guide
- DEV.to turn-taking harness (2026-10-21): https://dev.to/isabelle_dubuis_d858453d7/a-voice-agent-that-sounds-natural-can-still-fail-a-turn-taking-acceptance-harness-3114
- Background winners, London AI Hack: https://www.linkedin.com/posts/dwiteekrishnapanda_londonaihack-livekit-realtimeai-activity-7423851910803144704-dMdZ
- Background winners, Devpost AI Telephone Agent: https://devpost.com/software/ai-telephone-agent
- Background winners, Devpost Steerio: https://devpost.com/software/steerio
- Background winners, Teri Yu LinkedIn: https://www.linkedin.com/posts/teriyu_voice-driven-phone-with-gpt-realtime-2-congrats-activity-7467666460732174336-HmI-
- Background winners, AI Tinkerers NYC: https://nyc.aitinkerers.org/hackathons/h_q2ugc3T5gts/results
