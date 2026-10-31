# Realtime speech, live video, realtime generation and world models (Aug-Oct 2026)

> Compiled 2026-10-29 for Haunted Hacks (Sat 2026-10-31, 11:00-16:00 build window). Scope covers four things: (1) speech-to-speech (S2S) models, (2) live video understanding, (3) realtime image and video generation, (4) interactive world models. For each, the question is what you can call from an API **today**. Method: Exa search and fetch of vendor docs, changelogs and launch posts, plus trade press for corroboration. No code was run against any API. **Verified** means stated on a vendor doc or changelog page. **Reported** means press or third-party only. **Inference** means my own judgement.

## TL;DR availability matrix (as of 2026-10-29)

| Capability | Model (release) | Self-serve API today? | Price (vendor-stated) | Source |
|---|---|---|---|---|
| Full-duplex S2S | OpenAI `gpt-live-1` (API GA 2026-09-10) | **Yes**, `v1/live/sessions`, WebRTC. Not on the Free tier | $0.05/min voice layer, backend model billed separately | [model page](https://developers.openai.com/api/docs/models/gpt-live-1), [changelog](https://developers.openai.com/api/docs/changelog) |
| Full-duplex S2S | `gpt-live-1.1` (ChatGPT 2026-10-15) | **No.** "Coming soon to the API" | n/a | [forum](https://community.openai.com/t/gpt-live-1-1-is-rolling-out-with-new-voices-and-better-accents/1406704) |
| Turn-based S2S + image in | `gpt-realtime-2.1` / `-mini` (2026-07-06) | **Yes**, `v1/realtime` | $32/$64 per 1M audio in/out; mini $10/$20; image in $5/1M | [model page](https://developers.openai.com/api/docs/models/gpt-realtime-2.1), [forum](https://community.openai.com/t/new-realtime-models-on-the-api-gpt-realtime-2-1-and-gpt-realtime-2-1-mini/1385896) |
| S2S + live video in | Google `gemini-3.8-live` and `-extended-thinking` (2026-09-15) | **Yes**, Gemini Live API (stable). Extended Thinking is "private preview" on Google Cloud's Agent Platform | $0.005/min audio in, $0.018/min audio out (Google's per-minute estimate from $3/$12 per 1M tokens) | [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/), [model doc](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live) |
| S2S | xAI `grok-voice-3.0` (2026-10-14) | **Yes**, `wss://api.x.ai/v1/realtime` | $0.08/min | [xAI](https://x.ai/news/grok-voice-3), [docs](https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech) |
| S2S / omni | Alibaba `qwen-audio-3.1-realtime-plus`, `qwen3.8-omni-flash-realtime` (Sep 20-21) | Yes on Alibaba Model Studio (reported) | not listed | [cdnping summary](https://cdnping.org/en/blog/qwen-bailian-new-models-sep-oct-2026) |
| Talking-head avatar | Gemini 3.8 Live with Live Avatar (2026-09-24) | **Google Cloud only.** GA in Gemini Enterprise, and prebuilt avatars are configurable through the Agent Platform (ex-Vertex) Live API with `response_modalities: ["VIDEO"]` + `avatar_config`. Custom avatars need an allowlist. I did not find it on the AI Studio / Gemini Developer API | ~$0.39/speaking-min (third-party estimate, unverified) | [Google blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-with-live-avatar/), [Cloud doc](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/live-api/configure-live-avatars), [HeyGen post](https://www.heygen.com/blog/best-real-time-ai-avatar-platforms) |
| Talking-head avatar | HeyGen LiveAvatar (can drive GPT-Live/Gemini Live) | **Yes** | credits; free tier 10 credits/mo, 2-min sessions | [changelog](https://docs.liveavatar.com/changelog) |
| Realtime video-to-video | Decart `lucy-2.6` (Oct 2026), `lucy-restyle-2` | **Yes**, WebRTC, free starter credits | $0.02/s (fast $0.04/s); restyle $0.01/s | [pricing](https://docs.platform.decart.ai/getting-started/pricing), [changelog](https://docs.platform.decart.ai/changelog) |
| Realtime text-to-video stream | fal `minimax/h3-max/director` (2026-09-03) | **Yes**, alpha client | $0.08/s list, **$4.80 minimum per session**; 35% promo "through October 31"; 1080p is 2x | [fal page](https://fal.ai/h3-max-director), [model page](https://fal.ai/models/minimax/h3-max/director) |
| Realtime image-to-image | fal `krea/v3/realtime`, `fal-ai/flux-2/klein/realtime` | **Yes**, WebSocket | Krea $0.013/s session; Klein $0.00194/compute-s | [Krea](https://fal.ai/models/krea/v3/realtime), [Klein](https://fal.ai/models/fal-ai/flux-2/klein/realtime) |
| World model (driving) | Decart `oasis-3-preview` (2026-06-10, background) | **Yes** | $0.02/s | [Decart pricing](https://docs.platform.decart.ai/getting-started/pricing) |
| World model (general) | Odyssey-2 Pro / 2 Max | **Request access.** New sign-ups go to a form | no public price | [dev portal](https://developer.odyssey.ml/dashboard) |
| World model | Odyssey-3 (2026-10-08) | **No.** Web research preview (Odyssey-3 and Flash, free per The Decoder); no API text on the launch page, "get in touch" for physical-AI developers | n/a | [Odyssey](https://odyssey.systems/meet-odyssey-3) |
| World model | Runway GWM Worlds 2 (2026-09-03) | **No.** Research preview, contact form | n/a | [Runway](https://runway.com/research/introducing-gwm-worlds-2) |
| World model | Google Genie 4 (2026-10-27) | **No.** Trusted testers; Gemini API early-access partners "coming soon" | n/a | [DeepMind](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/) |
| Video understanding + talking face | Tavus Griffin-Lite (2026-10-01) | **No.** Research preview | n/a | [Tavus](https://www.tavus.io/griffin) |
| Offline video gen | OpenAI Sora 2 | **Shut down 2026-09-24**, no replacement | n/a | [OpenAI deprecations](https://developers.openai.com/api/docs/deprecations) |

**The headline for this event:** the $100 OpenAI credits cover voice (GPT-Live-1, GPT-Realtime-2.1) and still images (`gpt-image-2`, or `gpt-image-2.5-sunburst` / `-flare`, released 2026-09-08; `gpt-image-1` was shut down 2026-10-23 per the [deprecations page](https://developers.openai.com/api/docs/deprecations)). One caveat: GPT-Live is **unsupported on the Free tier**, and the tier docs count only "total credit purchases" ($5 buys Build). They do not say whether event-granted credits count, so buy $5 before Saturday ([rate limits guide](https://developers.openai.com/api/docs/guides/rate-limits)). They cover **no video generation**, because the Sora API is gone. OpenAI also has **no native video-stream input**; you send frames as images. Any realtime video output means a second vendor (Decart, fal) with its own key and billing.

---

## 1. Speech-to-speech

### OpenAI: two separate stacks (verified)

- **GPT-Live** launched in ChatGPT on 2026-07-08 as a full-duplex model: it "can listen and speak at the same time", backchannels, and "delegates to our latest frontier model behind the scenes" ([OpenAI, Jul 8](https://openai.com/index/introducing-gpt-live/)).
- **`gpt-live-1` went GA in the API on 2026-09-10** on a **new endpoint**, `v1/live/sessions`. That is not `v1/realtime`. It costs "$0.05 per minute, billed per second; backend model and tool usage is charged separately" ([changelog](https://developers.openai.com/api/docs/changelog)).
- The model page lists **input: audio, text**, and **image and video are unsupported**. It supports streaming and function calling but not structured outputs. Free tier: unsupported. Concurrency starts at 50 sessions ("Build" tier) ([model page](https://developers.openai.com/api/docs/models/gpt-live-1)).
- Architecture is a **speaker plus a delegated backend**. "Responses delegation" uses an OpenAI model. "Client delegation" connects *your own* backend: "connect any model, agent harness, or service your application runs" ([guide](https://developers.openai.com/api/docs/guides/live)). The launch post shows delegation to Codex via `@openai/codex-sdk` ([OpenAI, Sep 10](https://openai.com/index/introducing-gpt-live-1-in-the-api/)).
- **Client delegation mechanics** (verified, [delegation guide](https://developers.openai.com/api/docs/guides/live-delegation)): you set `delegation: { type: "client" }` at session creation, and switching modes requires a new session. GPT-Live emits `session.delegation.created` with a `delegation.id`, but the event "does not contain the user's utterance or task text". Your app rebuilds intent from `session.input_transcript.delta` / `session.output_transcript.delta`. It returns results with `session.commentary.append` (spoken, paraphrased) or `session.thinking.append` (silent context), and several updates can share one delegation ID. OpenAI's forum launch post says: "Your application controls permissions and durable task state; interrupting speech does not automatically cancel backend work" ([forum](https://community.openai.com/t/introducing-gpt-live-1-in-the-api/1396471)).
- `openai-python` 3.12.0 added Live API WebSocket helpers for "primary, sideband and fork connections" (reported, [MindPattern](https://mindpattern.ai/f/24870)).
- **Oct 15:** native Decisions integration, which lets your app act "while your user is speaking". **Oct 16:** prompt-to-voice (`/v1/audio/voices`, free to create, GPT-Live only) plus 9 new voices ([changelog](https://developers.openai.com/api/docs/changelog), [TechTimes](https://www.techtimes.com/articles/329184/20261019/gpt-live-adds-prompt-voice-real-time-action-selection-no-recording-required.htm)).
- **Oct 6:** usage tiers collapsed from five to three (Build, Launch, Grow). **Oct 28:** eligible ChatGPT Pro and Business subscribers can claim up to $500/month in API credits by linking an API org they own ([changelog](https://developers.openai.com/api/docs/changelog)). This could top up the $100 event credits.
- **GPT-Live-1.1** (Oct 15) is ChatGPT/Codex/"dots" only. In the official forum: "Rolling out today to all users. Coming soon to the API" ([forum](https://community.openai.com/t/gpt-live-1-1-is-rolling-out-with-new-voices-and-better-accents/1406704)). The forum thread was still active on Oct 29, and I found no API release.
- **GPT-Realtime-2.1 / 2.1-mini** (2026-07-06, background) are the turn-based `v1/realtime` models with configurable reasoning, and they **accept image input** ([model page](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)). The forum account "OpenAI_Support" (no staff badge visible) said on 2026-09-09: "The Realtime API already accepts image inputs, so an app can send captured screen frames… Native video streaming is a separate capability; we don't have a release timeline" ([forum](https://community.openai.com/t/when-will-gpt-realtime-2-1-with-live-video-input-be-released-in-the-api/1392430/3)).
- Also in `v1/realtime` (May, background): `gpt-realtime-translate` ($0.034/min, 70+ input to 13 output languages) and `gpt-realtime-whisper` ($0.017/min, streaming STT) ([OpenAI, May 7](https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/)).
- OpenAI says GPT-Live audio carries **SynthID** watermarking (Jul 31 update on the [GPT-Live post](https://openai.com/index/introducing-gpt-live/)).

**Inference:** for a voice demo you can choose between GPT-Live-1, which feels most natural but is audio-only and delegates thinking, and GPT-Realtime-2.1, which can "see" frames and call tools inline. GPT-Live's "client delegation" maps cleanly onto an Agent Relay or Durable Actor backend. The voice front-end hands a task to *your* agent network, and the network's answer is spoken back.

### Google Gemini 3.8 Live (verified)

- Released 2026-09-15 as **stable** `gemini-3.8-live` and `gemini-3.8-live-extended-thinking`. The model doc lists inputs as text, images and audio, with video sent as image frames. Input limit is 131,072 tokens, and structured outputs and caching are not supported. Async (NON_BLOCKING) function calling is the default. 97 languages. Priced at "$0.005/min for audio input and $0.018/min for audio output" ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/), [model doc](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live)).
- Migration gotchas from 3.1 Flash Live: drop `thinking_level`. `proactive_audio: false` now **errors**. `enable_affective_dialog` is removed. Video frames are sent by default (`TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO`). Audio is the only response modality, so enable output transcription for text ([model doc](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live)). **Doc conflict:** Google Cloud's Agent Platform guide describes 3.8 Live with "default-enabled affective dialogue" and adds a `VIDEO` response modality for Live Avatar ([Cloud guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/guides/gemini-3-8-live)). The two surfaces differ, so follow the doc for the surface you actually call.
- Google's cookbook quickstart sets `MODEL = "gemini-3.8-live"` with `api_version: "v1alpha"` and warns "**Use headphones**", because no echo cancellation is applied ([cookbook](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI_NativeAudio.py)).
- Partners listed: Agora, Fishjam, LiveKit, LangChain, Pipecat, Vercel, Vision Agents.

### xAI Grok Voice 3.0 (verified)

- 2026-10-14, `grok-voice-3.0` (and the `grok-voice-latest` alias), $0.08/min. xAI claims "under one second" to first audio ([xAI](https://x.ai/news/grok-voice-3)).
- The API is OpenAI-Realtime-shaped (`session.update`, `conversation.item.create`). It has built-in `file_search`, `web_search`, `x_search` and `mcp` (server-side) plus a client-side `function` tool. Session resumption is off by default (`resumption.enabled: true`), and history is dropped after 30 minutes of inactivity ([docs](https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech)). Reported limits: 10 concurrent sessions at base tier and 120-min sessions ([9to5AI](https://9to5ai.tech/gpt-live-1-1-chatgpt-voice-grok-voice-3)). These are **(unverified)**, since xAI's docs state no session or concurrency limits.
- Leaderboard: Artificial Analysis S2S Index puts Grok Voice 3.0 at 86.9, GPT-Live-1 (with GPT-6 Astra) at 83.2 and Gemini 3.8 Live at 82.6 ([xAI table, "Source: Artificial Analysis, October 13, 2026"](https://x.ai/news/grok-voice-3); [SiliconANGLE](https://siliconangle.com/2026/10/14/grok-voice-3-0-from-spacexsi-outscores-openai-and-google-on-speech-to-speech-index/)). The comparison rows are GPT-Live-1 (Astra, Medium) and Gemini 3.8 Live (Ext. Thinking, High). Google had said on Sep 15 that 3.8 Live *Extended Thinking* ranked #1. Both claims are point-in-time, and the leaderboard has since moved.

### Open weights (verified, from aggregators)

- Full-duplex open models: NVIDIA **NemotronLabs VoiceChat 11B** (OpenMDW 1.1, tool calling, 448 ms turn-taking per NVIDIA), **PersonaPlex 7B** (gated), and Kyutai **Moshi** (CC-BY weights) ([Digital Applied, Oct 1](https://www.digitalapplied.com/blog/full-duplex-voice-models-compared-2026), [Realtime Voice index](https://realtime.mahimai.ca/research-and-open-weights/)).
- Qwen3.8-Omni-Flash (paper 2026-09-22) ships a **Qwen-Live-Harness** open-source framework, but the model itself is hosted-only, with no weights ([arXiv](https://arxiv.org/abs/2609.25611), [OrcaRouter](https://www.orcarouter.ai/blog/nemotron-3-5-super-vl-vs-qwen-3-8-omni-flash)).
- **Inference:** self-hosting a GPU S2S model in a 5-hour hackathon is a poor trade. Use hosted APIs.

---

## 2. Live video understanding

There is still **no frontier API that ingests a true video stream at high frame rates**. Everyone samples frames.

- **Gemini Live API:** "Video frames are sent as individual images… (max 1 frame per second)". Recommended size is 768x768, with `media_resolution` LOW/MEDIUM/HIGH to trade tokens against detail ([capabilities guide](https://ai.google.dev/gemini-api/docs/live-api/capabilities), [Cloud guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/guides/gemini-3-8-live)). **Session caps:** audio-only sessions are 15 min and audio+video sessions are **2 min** unless you use session management. Connections last about 10 min, with a GoAway notice 60 s before the end. Firebase's docs say 1 FPS makes it "unsuitable for… fast-changing video, such as play-by-play in high-speed sports" ([Firebase limits](https://firebase.google.com/docs/ai-logic/live-api/limits-and-specs)).
- **OpenAI:** `gpt-realtime-2.1` accepts `input_image` items mid-conversation. GPT-Live-1 accepts none. Native video is "a separate capability" with no timeline (see §1).
- **Qwen3.8-Omni-Flash:** up to an hour of audio+video per call, but as **offline** analysis that returns text ([OrcaRouter](https://www.orcarouter.ai/blog/nemotron-3-5-super-vl-vs-qwen-3-8-omni-flash)). `qwen3.8-omni-flash-realtime` (Sep 21) is listed with WebSocket/WebRTC access and remote MCP tools (reported, [cdnping](https://cdnping.org/en/blog/qwen-bailian-new-models-sep-oct-2026)). I could not verify its frame rate.
- **Video-native "see + respond with a face":** Tavus Griffin-Lite (Oct 1) is a "full-duplex video-to-video model". It is not available to customers ([Tavus](https://www.tavus.io/griffin)). Tavus's shipping stack (Raven perception, Phoenix-4 face) is self-serve from $22/mo (reported, [HeyGen comparison](https://www.heygen.com/blog/best-real-time-ai-avatar-platforms)).
- Fast segmentation and tracking as a non-LLM complement: SAM 3 / 3.1 are listed among fal's realtime models ([fal realtime](https://fal.ai/realtime)).

**Inference:** "the AI watches your webcam" demos work if the trigger is slow, such as a costume reveal, an object held up to the camera, or a scene change. They fail on fast motion. Plan around 1 FPS with a 2-minute session budget on Gemini, or send frames on demand to `gpt-realtime-2.1`.

---

## 3. Realtime image and video generation

### Realtime video-to-video (camera in, transformed camera out)

- **Decart Lucy 2.6** (Oct 2026 changelog) is now `lucy-latest`. It does character swap, add/replace/remove objects, background swap and VFX ("fire, explosions, smoke, particles") on live 720p WebRTC video, with text and/or a reference image ([Lucy 2.6 doc](https://docs.platform.decart.ai/models/realtime/lucy-2.6), [changelog](https://docs.platform.decart.ai/changelog)). It costs $0.02/s, or $0.04/s in fast mode. `lucy-restyle-2` costs $0.01/s. "New accounts receive free credits", at $1 = 100 credits ([pricing](https://docs.platform.decart.ai/getting-started/pricing)). JS SDK `@decartai/sdk` v0.2.6+ adds `apiKeyProvider` because **client tokens expire 60 s after minting**. A token minted on page load was often already expired by the time the user pressed start ([changelog](https://docs.platform.decart.ai/changelog)).
- **fal-hosted alternatives:** VAST Eden Live 5B (webcam restyle via `fal.realtime.open`, alpha) ([fal](https://fal.ai/models/vast/eden-live-5b-video/api)). fal also has a self-deploy StreamDiffusionV2 example at 512x512, 16 fps on one H100, with roughly a **7-minute cold start** and a 300 s session limit ([fal docs](https://fal.ai/docs/examples/video-generation/deploy-realtime-video-restyle)).

### Realtime generated video streams (prompt in, continuous video out)

- **fal / MiniMax H3 Max Director** (announced 2026-09-03) streams one continuous video *with audio* over WebRTC, steered by `prompt` messages with a strictly increasing `prompt_version`. Output is 24 fps, 480p or 768p, with memory of 1-50 prior prompts ([fal learn](https://fal.ai/learn/tools/what-is-minimax-h3-max-director), [API page](https://fal.ai/models/minimax/h3-max/director/api)). It costs **$0.08/s list with a $4.80 minimum per session**, so every connect costs at least $4.80. The model page says "The promotional rate is 35% off through October 31", which puts the effective rate near $0.052/s on Oct 31 if the promo is inclusive, and 1080p costs 2x ([model page](https://fal.ai/models/minimax/h3-max/director)). The learn page lists only 480p/768p. The client is `@fal-ai/client@alpha` and "may change in a minor version", so pin it. Sources disagree on default session length: fal's learn page says 2 min, and the product page says public sessions run up to 15 min. Test both.
- **Vivix W1** (Oct 11) is in limited preview. Its realtime "Streaming World API" is marked "coming soon" (reported, [AICoder](https://aicoder.com/news/news-20261011-vivix-w1-streaming-realtime-video-model)).
- **Visko Orbis** has had a public demo since 2026-09-01 and is served on TPUs at 1.07x playback speed. I found no public API ([Google Cloud blog](https://cloud.google.com/blog/products/media-entertainment/how-visko-streams-real-time-world-models-on-google-cloud-tpus)).
- PixVerse R1 (Jan, background) offers API access to "qualified partners" only ([PixVerse](https://pixverse.ai/en/blog/pixverse-r1-720p-real-time-video-api-partner-program)).

### Realtime image generation

- fal's realtime WebSocket path is "sub-100ms" and skips the queue. **Only models with an explicit realtime endpoint** support it ([fal docs](https://fal.ai/docs/documentation/model-apis/inference/real-time)).
- `krea/v3/realtime` is a 768x768 frame edit with a fixed seed for frame consistency. It costs $0.013/s, and "final Krea 3 pricing has not been set" ([fal Krea](https://fal.ai/models/krea/v3/realtime)).
- `fal-ai/flux-2/klein/realtime` defaults to 3 steps. It takes base64 input only ("CDN URLs are not supported for realtime"), has optional RIFE interpolation, and costs $0.00194 per compute-second ([fal Klein](https://fal.ai/models/fal-ai/flux-2/klein/realtime/api)).
- Browser auth goes through a `tokenProvider` that returns a short-lived JWT, so never ship `FAL_KEY` to the browser.

### Offline video (not realtime, but relevant to the credits)

- **Sora 2 / Videos API were shut down 2026-09-24**, and the deprecation table names no replacement ([OpenAI](https://developers.openai.com/api/docs/deprecations)).
- Google's current video model is `gemini-omni-1.1-flash` (GA 2026-08-27, 3-10 s clips, conversational editing). Veo 3.1 Preview in the Gemini API shut down on 2026-10-22 ([Gemini changelog](https://ai.google.dev/gemini-api/docs/changelog), [video guide](https://ai.google.dev/gemini-api/docs/video)).

---

## 4. World models

| Model | Date | Specs (vendor) | Access |
|---|---|---|---|
| Google **Genie 4** | 2026-10-27 | Native audio including dialogue, steering by text mid-simulation, about 2 min of coherence (2x Genie 3, per TechCrunch) | Trusted testers. AI Ultra (Project Genie) and Gemini API / AI Studio early-access partners "in the coming weeks" (TechCrunch); waitlist only ([DeepMind](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/), [TechCrunch](https://techcrunch.com/2026/10/27/googles-genie-4-world-model-adds-audio-more-realistic-worlds-and-real-time-steering/)) |
| **Odyssey-3** | Shown 2026-09-15, launched 2026-10-08 | Autoregressive diffusion transformer, first/third-person, Physics-IQ 66.1 (Pro, video-to-video; 54.7 image-to-video) | Web research preview (Odyssey-3 and Flash). No API text on the launch page; "get in touch" is aimed at physical-AI developers ([Odyssey](https://odyssey.systems/meet-odyssey-3), [Decoder](https://the-decoder.com/odyssey-3-is-a-new-generative-world-model-that-you-can-try-for-free/)) |
| Odyssey-2 Pro / 2 Max | Jan 2026 (background) | 720p at 22 fps, 150 s per stream, JS/Python SDK (`@odysseyml/odyssey`) | Existing users only. New developers "request priority access" ([portal](https://developer.odyssey.ml/dashboard), [Recaply](https://recaply.co/tools/odyssey-2-pro)) |
| Runway **GWM Worlds 2** | 2026-09-03 | 720p at 24 fps plus 48 kHz audio, free-form text actions, no preset length | Research preview, contact form, no API ([Runway](https://runway.com/research/introducing-gwm-worlds-2), [Atlas](https://atlasworldmodel.com/gwm-worlds-2)) |
| Decart **Oasis 3** | 2026-06-10 (background) | 22 fps at 512x768, under 200 ms, multi-camera driving | **Self-serve API**, `oasis-3-preview`, $0.02/s ([Decart](https://decart.ai/oasis)) |
| World Labs Marble 1.1 | World API since 2026-01-21 (background) | Gaussian splats and GLB export, not realtime streaming | Public API, about $1.20 per world (reported, [Atlas comparison](https://atlasworldmodel.com/blog/world-model-api-comparison)) |
| Overworld Waypoint-1 | Jan 2026 (background) | Open weights. 2.3B model runs at 30-60 fps on an RTX 5090 | Local GPU ([HF blog](https://huggingface.co/blog/waypoint-1)) |

Industry context, reported by TechCrunch on Oct 27 and unverified beyond that: "World Labs is being acquired by AMD, Amazon is in talks to buy Decart" ([TechCrunch](https://techcrunch.com/2026/10/27/googles-genie-4-world-model-adds-audio-more-realistic-worlds-and-real-time-steering/)).

Useful quotes from vendor limitation sections:
- Runway: "fully leveraging it can require an external real-time harness that tracks the state of the world". The same sentence continues with the example of NPC dialogue in an NPC-player interaction ([Runway](https://runway.com/research/introducing-gwm-worlds-2)).
- Genie 4: "visual details and object permanence can still shift or drift over time" ([DeepMind](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/)).
- TechCrunch on Oasis 3: when the reviewer turned around to go back, "it was gone, replaced by an entirely new environment" ([TechCrunch, Jun 10](https://techcrunch.com/2026/06/10/decarts-new-world-model-can-simulate-hours-of-photorealistic-driving-with-some-caveats/)).

**Inference:** world models are realtime pixel generators with **no durable memory**. External state is exactly what Durable Actors provide, and the Runway quote above effectively asks for that harness. The only general world-ish stream you can call self-serve on Oct 31 is fal's H3 Max Director (a steerable continuous video, which is not action-conditioned). For an action-conditioned world, only Decart Oasis 3 is self-serve, and it is limited to driving.

---

## Limits / could not verify

- **No API calls were made.** Latency, cold starts and whether free credits suffice are untested. Decart does not state the size of its free credit grant.
- Whether **GPT-Live-1.1 reaches the API before Oct 31** is unknown. As of Oct 29 the forum still says "coming soon".
- The H3 Max Director default session length conflicts between sources (2 min vs 15 min). Whether the 35% promo applies on Oct 31 itself is not stated precisely.
- Third-party price claims are unverified against the vendors: Gemini Live Avatar at ~$0.39/min, and Grok session and concurrency limits. xAI's own docs state neither.
- I did not confirm whether Live Avatar (prebuilt avatars) works on an ordinary pay-as-you-go Google Cloud project, as opposed to Gemini Enterprise contracts. The Cloud doc shows the API config with no gating except for custom avatars.
- I could not confirm whether OpenAI event credits count toward the Build tier.
- I could not read the Odyssey developer portal directly because it is JS-rendered. The "request priority access" wording comes from Exa's index of developer.odyssey.ml and a QUASA article updated Aug 14.
- I did not verify Qwen realtime model frame rates, pricing, or US availability for an SF hackathon account.
- Meta Muse Realtime Avatar (Sep 23) is cited only via [Mintec](https://mintec.co/blog/realtime-interactive-avatars-2026/). I did not confirm whether a public API exists.
- AA leaderboard positions change. The Grok #1 claim (Oct 14) supersedes Google's Sep 15 claim, but I did not re-check the live leaderboard.
- I did not search social sentiment (X/Reddit) for this angle.

---

## Hackathon implications

**What judges and sponsors want:** the theme is "Real-Time AI", and the bonus goes to Durable Actors (Terse) plus Agent Relay. A realtime-media model is the *sensory surface*. The actor and relay layer has to carry the state and the coordination, or the project reads as an API wrapper. OpenAI is a sponsor, so a GPT-Live or GPT-Realtime front end is the natural default.

**Three concrete builds, ranked by risk:**

1. **Lowest risk: "Séance" voice agent network.** GPT-Live-1 is the spoken front end. **Client delegation** forwards each task to an Agent Relay network of specialist "spirit" agents (medium, skeptic, historian). Each spirit is a Durable Actor holding persistent memory of the séance. GPT-Live keeps talking while the agents deliberate, which is the exact pattern OpenAI designed for ([guide](https://developers.openai.com/api/docs/guides/live)). Everything runs on the $100 OpenAI credits at $0.05/min.
2. **Medium risk: "Haunted Mirror".** Webcam goes to Decart `lucy-2.6` (live costume, ghost-ify, add VFX, about $1.20 per minute) while `gemini-3.8-live` or `gpt-realtime-2.1` watches 1 FPS frames and talks. A Durable Actor owns the "haunting state": which curse is active and how possessed the user is. The actor rewrites Lucy prompts via `realtimeClient.set()`. Agent Relay lets a "director" agent and a "narrator" agent negotiate the next scare. Easily the most visual live demo.
3. **Highest wow and cost: "Persistent haunted world".** fal H3 Max Director is the pixel stream. A Durable Actor is the world-state and memory harness Runway says these models need: characters, inventory, what's behind the door. Multiple viewers or agents propose actions over Agent Relay, and the actor serializes them into `prompt_version` updates. Budget **≥$4.80 per session** and keep sessions short.

**Gotchas:**
- GPT-Live-1 is **audio+text only**, on `v1/live/sessions`, and needs WebRTC served over HTTPS or localhost with the key on the server ([guide](https://developers.openai.com/api/docs/guides/live)). For vision, use `gpt-realtime-2.1` with `input_image`.
- Gemini Live audio+video sessions cap at **2 min**. `proactive_audio:false` errors on 3.8. Use headphones on stage because the quickstart has no echo cancellation.
- Decart client tokens die after **60 s**. Use `apiKeyProvider` (SDK ≥0.2.6).
- fal realtime clients are **alpha**. Pin `@fal-ai/client@alpha` and keep `FAL_KEY` behind a proxy with auth. H3 Director bills a **60 s minimum** every connect, so do not hot-reload into new sessions.
- No OpenAI video generation exists (Sora is dead). Do not pitch "Sora-powered" anything.
- Genie 4, Odyssey-3, GWM Worlds 2 and Griffin are **not callable**. Do not plan on them. Odyssey-2 access needs approval, so request it today if you want it, and assume it won't arrive.
- Venue Wi-Fi plus WebRTC is a demo risk. Record a fallback video of the realtime path.

**Setup before Oct 31** (allowed: "thinking of ideas before the hackathon is fine"; code must be written at the event):
- Verify the OpenAI org is above the Free tier, because GPT-Live is unsupported on Free. Build requires "$5 in total credit purchases", and it is unclear whether event-granted credits count, so **buy $5 of credit now**. Confirm `gpt-live-1` and `gpt-realtime-2.1` show up in the Playground. If you have ChatGPT Pro or Business, claim the Oct 28 API-credit benefit (up to $500/mo) on the same org.
- Read the GPT-Live [delegation guide](https://developers.openai.com/api/docs/guides/live-delegation). Client delegation gives you only an ID, not the task text, so your backend (a Durable Actor) has to keep the transcript. That is a natural reason for the actor to exist, and you can say so to the Terse judges.
- Create Decart and fal accounts, claim Decart's free credits, and load a small fal balance (≥$10 if you plan to use H3 Director).
- Get a Gemini API key from AI Studio as a vision fallback.
- Read, but don't code: the GPT-Live WebRTC quickstart, Decart Lucy 2.6 prompting guide, and fal WMA realtime docs. Bring headphones and a USB mic.

---

## Sources

- OpenAI: [Introducing GPT-Live (Jul 8)](https://openai.com/index/introducing-gpt-live/) · [GPT-Live-1 in the API (Sep 10)](https://openai.com/index/introducing-gpt-live-1-in-the-api/) · [gpt-live-1 model page](https://developers.openai.com/api/docs/models/gpt-live-1) · [GPT-Live guide](https://developers.openai.com/api/docs/guides/live) · [API changelog](https://developers.openai.com/api/docs/changelog) · [gpt-realtime-2.1 model page](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) · [Realtime conversations (image input)](https://developers.openai.com/api/docs/guides/realtime-conversations) · [Forum: GPT-Live-1.1](https://community.openai.com/t/gpt-live-1-1-is-rolling-out-with-new-voices-and-better-accents/1406704) · [Forum: realtime 2.1 launch](https://community.openai.com/t/new-realtime-models-on-the-api-gpt-realtime-2-1-and-gpt-realtime-2-1-mini/1385896) · [Forum: video input reply](https://community.openai.com/t/when-will-gpt-realtime-2-1-with-live-video-input-be-released-in-the-api/1392430/3) · [GPT-Live-1.1 system card](https://deploymentsafety.openai.com/gpt-live-1-1/introduction) · [Voice models (May 7)](https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/) · [Deprecations](https://developers.openai.com/api/docs/deprecations) · [Sora guide (shutdown note)](https://developers.openai.com/api/docs/guides/video-generation)
- Google: [Gemini Audio models blog (Sep 15)](https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/) · [Gemini 3.8 Live model doc](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live) · [Live API capabilities](https://ai.google.dev/gemini-api/docs/live-api/capabilities) · [Cloud dev guide 3.8 Live](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/guides/gemini-3-8-live) · [Firebase Live limits](https://firebase.google.com/docs/ai-logic/live-api/limits-and-specs) · [Model card](https://deepmind.google/models/model-cards/gemini-3-8-audio/) · [Live Avatar (Sep 24)](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-with-live-avatar/) · [Cookbook quickstart](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI_NativeAudio.py) · [Gemini changelog](https://ai.google.dev/gemini-api/docs/changelog) · [Video guide](https://ai.google.dev/gemini-api/docs/video) · [Genie 4 (DeepMind)](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/) · [Genie 4 (Keyword)](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/introducing-genie-4/) · [Visko on TPUs](https://cloud.google.com/blog/products/media-entertainment/how-visko-streams-real-time-world-models-on-google-cloud-tpus)
- xAI: [Grok Voice 3.0](https://x.ai/news/grok-voice-3) · [S2S docs](https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech) · [SiliconANGLE](https://siliconangle.com/2026/10/14/grok-voice-3-0-from-spacexsi-outscores-openai-and-google-on-speech-to-speech-index/) · [9to5AI](https://9to5ai.tech/gpt-live-1-1-chatgpt-voice-grok-voice-3)
- Decart: [Pricing](https://docs.platform.decart.ai/getting-started/pricing) · [Changelog](https://docs.platform.decart.ai/changelog) · [Models](https://docs.platform.decart.ai/getting-started/models) · [Lucy 2.6](https://docs.platform.decart.ai/models/realtime/lucy-2.6) · [Python realtime](https://docs.platform.decart.ai/sdks/python-realtime) · [Oasis](https://decart.ai/oasis) · [Oasis 3 post](https://decart.ai/publications/introducing-oasis-3-first-interactive-world-model-for-physical-ai) · [TechCrunch Oasis 3](https://techcrunch.com/2026/06/10/decarts-new-world-model-can-simulate-hours-of-photorealistic-driving-with-some-caveats/)
- fal: [H3 Max Director](https://fal.ai/h3-max-director) · [Director model page](https://fal.ai/models/minimax/h3-max/director) · [Director API](https://fal.ai/models/minimax/h3-max/director/api) · [Director explainer](https://fal.ai/learn/tools/what-is-minimax-h3-max-director) · [Realtime WebSockets](https://fal.ai/docs/documentation/model-apis/inference/real-time) · [Krea v3 realtime](https://fal.ai/models/krea/v3/realtime) · [FLUX.2 klein realtime](https://fal.ai/models/fal-ai/flux-2/klein/realtime/api) · [Eden Live 5B](https://fal.ai/models/vast/eden-live-5b-video/api) · [StreamDiffusionV2 example](https://fal.ai/docs/examples/video-generation/deploy-realtime-video-restyle) · [fal realtime catalog](https://fal.ai/realtime) · [RuntimeWire](https://runtimewire.com/article/fal-h3-max-director-continuous-interactive-ai-video)
- World models: [Odyssey-3](https://odyssey.systems/meet-odyssey-3) · [Odyssey API launch](https://odyssey.systems/the-gpt-2-moment-for-world-models) · [Odyssey docs](https://documentation.api.odyssey.ml/api-quick-start) · [Odyssey portal](https://developer.odyssey.ml/dashboard) · [Recaply on Odyssey-2 Pro](https://recaply.co/tools/odyssey-2-pro) · [The Decoder](https://the-decoder.com/odyssey-3-is-a-new-generative-world-model-that-you-can-try-for-free/) · [Runway GWM Worlds 2](https://runway.com/research/introducing-gwm-worlds-2) · [Atlas: GWM Worlds 2](https://atlasworldmodel.com/gwm-worlds-2) · [Atlas: API comparison](https://atlasworldmodel.com/blog/world-model-api-comparison) · [TechCrunch Genie 4](https://techcrunch.com/2026/10/27/googles-genie-4-world-model-adds-audio-more-realistic-worlds-and-real-time-steering/) · [Waypoint-1](https://huggingface.co/blog/waypoint-1)
- Avatars / other: [Tavus Griffin](https://www.tavus.io/griffin) · [LiveAvatar changelog](https://docs.liveavatar.com/changelog) · [HeyGen comparison](https://www.heygen.com/blog/best-real-time-ai-avatar-platforms) · [Mintec avatars](https://mintec.co/blog/realtime-interactive-avatars-2026/) · [Vapi GPT-Live beta](https://vapi.ai/blog/gpt-live-beta) · [Twilio + GPT-Live](https://www.twilio.com/en-us/blog/developers/twilio-openai-gpt-live-1-api-resources) · [Digital Applied full-duplex](https://www.digitalapplied.com/blog/full-duplex-voice-models-compared-2026) · [Realtime Voice open weights](https://realtime.mahimai.ca/research-and-open-weights/) · [Qwen3.8-Omni paper](https://arxiv.org/abs/2609.25611) · [cdnping Qwen](https://cdnping.org/en/blog/qwen-bailian-new-models-sep-oct-2026) · [OrcaRouter](https://www.orcarouter.ai/blog/nemotron-3-5-super-vl-vs-qwen-3-8-omni-flash) · [AICoder Vivix](https://aicoder.com/news/news-20261011-vivix-w1-streaming-realtime-video-model) · [PixVerse R1 API](https://pixverse.ai/en/blog/pixverse-r1-720p-real-time-video-api-partner-program) · [TechTimes](https://www.techtimes.com/articles/329184/20261019/gpt-live-adds-prompt-voice-real-time-action-selection-no-recording-required.htm) · [MindPattern](https://mindpattern.ai/f/24870)

Sources added during verification: [GPT-Live delegation guide](https://developers.openai.com/api/docs/guides/live-delegation) · [Forum: Introducing GPT-Live-1 in the API](https://community.openai.com/t/introducing-gpt-live-1-in-the-api/1396471) · [OpenAI rate limits / usage tiers](https://developers.openai.com/api/docs/guides/rate-limits) · [Cloud: Configure live avatars](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/live-api/configure-live-avatars) · [Cloud blog: Live Avatar GA](https://cloud.google.com/blog/products/ai-machine-learning/gemini-3-8-live-with-live-avatar-is-now-generally-available) · [Odyssey developer portal](https://developer.odyssey.ml/) · [QUASA on Odyssey access gate](https://quasa.io/media/odyssey-2-pro-pioneering-real-time-interactive-video-generation-with-open-api-access)

---

## Verification log (2026-10-29)

An adversarial re-check against live vendor pages (Exa fetch, WebFetch, curl). Outcome key: **Confirmed**, **Corrected**, **Qualified** (true, with added caveat), **Unverified**.

| # | Claim | Checked against | Outcome |
|---|---|---|---|
| 1 | `gpt-live-1` GA 2026-09-10 on `v1/live/sessions`, $0.05/min billed per second, audio+text in, image/video unsupported, no Free tier, Build 50 concurrent | Model page + changelog Sep 10 entry | **Confirmed** verbatim. |
| 2 | GPT-Live-1.1 "Coming soon to the API" and not yet in the API | Forum thread (Oct 15), changelog through Oct 28 | **Confirmed**. No 1.1 API entry. The update also covers "dots", which I added. |
| 3 | Oct 15 Decisions integration; Oct 16 prompt-to-voice, free to create, plus 9 voices | Changelog | **Confirmed**. |
| 4 | `gpt-realtime-2.1` pricing $32/$64 audio and $5 image per 1M; image input; `v1/realtime` | Model page | **Confirmed**. Text is $4/$24. |
| 5 | OpenAI "support" quote on native video having no timeline | Forum reply #3 | **Qualified**. The quote is accurate, but it comes from a forum account named OpenAI_Support with no visible staff badge. Wording changed. |
| 6 | Sora 2 / Videos API shut down 2026-09-24 with no replacement | Deprecations page | **Confirmed**. Every replacement cell is "---". |
| 7 | GPT-Live SynthID watermarking (Jul 31 update) | GPT-Live launch post | **Confirmed** verbatim, despite SynthID being Google-branded. |
| 8 | Gemini 3.8 Live stable 2026-09-15; $0.005/$0.018 per min; migration gotchas (`proactive_audio:false` errors, affective dialog removed) | Google blog, model doc, Gemini changelog | **Confirmed**, with qualifications. Per-minute prices are Google's estimate from token prices. The model doc lists inputs as text/images/audio, not "video" (corrected). The Agent Platform guide contradicts the affective-dialogue claim (doc conflict added). |
| 9 | Gemini Live: 1 FPS, 768x768, audio+video sessions 2 min, ~10 min connections, 60 s GoAway | Firebase limits page | **Confirmed**. |
| 10 | Cookbook quickstart uses `gemini-3.8-live`, `v1alpha`, "Use headphones" | Raw GitHub file | **Confirmed** (lines 19, 74, 83). |
| 11 | Live Avatar is "Enterprise only" | Google blog, Cloud blog, Cloud config doc | **Corrected**. GA in Gemini Enterprise, but prebuilt avatars are documented on the Agent Platform Live API (`avatar_config`). Only custom avatars are allowlisted. Price is not on any Google page I read. |
| 12 | Grok Voice 3.0: 2026-10-14, $0.08/min, AA index 86.9 vs 83.2 vs 82.6, tools | xAI news + docs | **Confirmed**, and `file_search` was added. The 10-concurrent / 120-min limits are **Unverified** because the docs state no limits. |
| 13 | Decart Lucy 2.6 $0.02/s ($0.04 fast), restyle $0.01/s, Oasis 3 $0.02/s, free credits, $1 = 100 credits, 60 s client tokens, `apiKeyProvider` in JS SDK v0.2.6 | Decart pricing + changelog | **Confirmed** verbatim. The free-credit amount is still unstated. |
| 14 | fal H3 Max Director $0.08/s, $4.80 minimum, 35% promo through Oct 31, session length 2 vs 15 min | fal model page + learn page | **Confirmed**, and the conflict is real (learn page says 2 min, model page says 15). Added that 1080p is 2x. |
| 15 | fal Krea $0.013/s ("final… not set"); Klein $0.00194/compute-s, 3 steps default, base64 only, RIFE | fal pages (curl of API page JSON) | **Confirmed**. |
| 16 | Genie 4 2026-10-27, trusted testers, drift quote, ~2 min coherence, TechCrunch AMD/Decart consolidation quote | DeepMind blog + TechCrunch | **Confirmed**. The 2-min figure is TechCrunch's, not DeepMind's. Rollout "in the coming weeks". |
| 17 | Runway GWM Worlds 2 (Sep 3), 720p/24 fps/48 kHz, research preview, "external real-time harness" quote | Runway page | **Corrected**. The quote was partly paraphrased inside quotation marks and has been trimmed to verified wording. |
| 18 | Odyssey-3 Oct 8, Physics-IQ 66.1, "free web demo of Flash only; API by contact" | Odyssey launch page | **Qualified**. 66.1 is Pro video-to-video. The page offers Odyssey-3 and Flash previews and says nothing about the API. "Free" rests on The Decoder. |
| 19 | Odyssey-2 new sign-ups must request access | Exa index of developer.odyssey.ml, QUASA (Aug 14) | **Confirmed** indirectly, since the portal page itself would not render. |
| 20 | Tavus Griffin-Lite is not available to customers | Tavus page | **Confirmed** ("will not be available for use for customers at this time"). |
| 21 | Gemini Veo 3.1 Preview shut down 2026-10-22; `gemini-omni-1.1-flash` GA 2026-08-27 | Gemini video guide + changelog | **Confirmed**. The 3-10 s clip length comes from the June preview entry (background). |
| 22 | TechCrunch Oasis 3 quote "replaced by an entirely new environment" | TechCrunch Jun 10 | **Confirmed**. |
| 23 | Event facts: $100 OpenAI credits per participant; code written at the event | EVENT_PAGE.md | **Confirmed**. |

**Added (missing and decision-relevant):** the Free-tier / $5 Build gotcha; Oct 6 tier simplification; Oct 28 ChatGPT Pro/Business API-credit benefit; GPT-Live client-delegation event model and the "durable task state" quote (strongest hook for Durable Actors); `gpt-image-2.5` and the `gpt-image-1` shutdown; the Gemini doc conflict between surfaces.

**Not re-checked (left as originally sourced):** NVIDIA/Kyutai open-weight claims, Qwen realtime models (cdnping), Vivix W1, Visko Orbis, PixVerse R1, Meta Muse, `openai-python` 3.12.0 Live helpers (MindPattern), World Labs Marble pricing. Treat these as reported.
