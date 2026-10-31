# Trends: Real-Time AI (master brief, Aug-Oct 2026)

> Consolidated 2026-10-29 for **Haunted Hacks: Real-Time AI Edition** (YC, SF, Sat 2026-10-31; build 11:00-16:00, demos after). This brief merges the five sub-files in [`trends-realtime/`](trends-realtime/) into one source of truth. Each sub-file was adversarially fact-checked against live pages on 2026-10-29. The editor then re-checked three cross-file contradictions live (see §4).
>
> Tags: **[V]** confirmed on a primary or vendor page. **[R]** reported by press, a mirror or a third party only. **[I]** inference by the researcher or editor. Anything dated before 2026-08-01 is marked *background*.

| Sub-file | Angle | Use it for |
|---|---|---|
| [01-voice-agents-stacks.md](trends-realtime/01-voice-agents-stacks.md) | Voice-agent stacks: latency, pricing, frameworks, platforms | Choosing a voice layer; latency budget; vendor deaths |
| [02-speech-video-models.md](trends-realtime/02-speech-video-models.md) | S2S models, live video understanding, realtime image/video generation, world models | "Can I call it today?" availability matrix |
| [03-multiplayer-ai-games.md](trends-realtime/03-multiplayer-ai-games.md) | Multiplayer AI apps and games; room/actor architectures | Social-deduction design; Terse/Relay mapping |
| [04-streaming-ui-browser-agents.md](trends-realtime/04-streaming-ui-browser-agents.md) | Generative UI, browser/computer-use agents, live views | "Mission control" visual layer; embed gotchas |
| [05-viral-realtime-demos.md](trends-realtime/05-viral-realtime-demos.md) | What went viral and why; 2-minute demo checklist | Demo script and stage rules |

---

## Executive summary

1. **The voice layer has split away from the agent.** OpenAI's **GPT-Live-1** went GA in the API on **2026-09-10** at **$0.05/min, billed per second**. It runs on a new endpoint, `v1/live/sessions`. The model is a full-duplex "speaker" that *delegates* reasoning to a backend. In **client delegation** mode that backend is *your* code, and OpenAI's forum post says "Your application controls permissions and durable task state" [V]. That one sentence makes the case for a Terse Durable Actor as the backend, with Agent Relay as the fan-out. Vapi built its GPT-Live beta (2026-10-02) around the same speaker/reasoner split [V].
2. **Caller-side latency is about 1-2 s in practice.** Vendor numbers of "75 ms" or "sub-90 ms" cover TTS first byte only. Endpointing is the biggest cost: no stack passed a 680 ms mid-sentence pause in 65+ attempts (Codebridge, 2026-08-10) [R]. Interruptions and barge-in, not model speed, are what users notice. kwindla (Pipecat) puts the state of the art at **500 ms** voice-to-voice, "3-4x faster than most" in production [V via LinkedIn copy].
3. **The leaderboard keeps moving.** Google claimed #1 on Sep 15, then xAI's Grok Voice 3.0 on Oct 14. Artificial Analysis now lists **Phonic 1 (High) at 87.1**, Grok Voice 3.0 at 86.9 and GPT-Live-1 Astra at 83.2. The editor re-checked this live on 2026-10-29 [V].
4. **Video in is still frame sampling, and video out needs a second vendor.** Gemini Live takes at most 1 FPS, and audio+video sessions are capped at 2 min. GPT-Live accepts audio and text only; `gpt-realtime-2.1` accepts images. **Sora 2 and the Videos API shut down on 2026-09-24** with no replacement [V]. For realtime pixels, the self-serve options are Decart Lucy 2.6 ($0.02/s) and fal H3 Max Director ($0.08/s, $4.80 minimum per session). None of the world models (Genie 4, Odyssey-3, GWM Worlds 2) has a public API [V].
5. **The AI hits make the AI a suspect, not a companion.** Mimesis, Suck Up!, Turing Games and Supernatural Action Team's traitor mode spread because of deception and because streamers clip them [V]. The new wave since Aug 2026 is **agents as players in persistent worlds**: SEED, Dominus Automa, Slow Vale, Agentic Kingdoms, and **YC Labs' own "Agents in Games"** (Oct 2026; HN 241 points / 82 comments) [V]. Every serious open-source example uses **one authoritative room actor per match**, the same shape Terse sells.
6. **Real-time agent UX now means visible agents.** Every browser and computer-use backend ships an embeddable live view, including sponsor Superserve (`getStreamUrl({viewOnly})`). OpenAI's hosted computer use is the exception: screenshots arrive inside events and no live URL is documented [V]. 2026 hackathon winners put several agents on one live stage (Browser Brawl, AgentUX) [V].
7. **Viral demos share a recipe:** a "wait, that's AI?" beat within 30 s (Dessa / Asmongold), the AI acting on visible state (Clicky, HeyGen overlays), and an audience that can join by link (Elderwood, the spawn heist). Single-player "talk to a ghost" apps are already crowded: at least four shipped the week of Oct 27 [R]. **Multiplayer plus multi-agent is the open gap** [I].

---

## What matters for Haunted Hacks (read this box if nothing else)

> - **Score on the hosts, decorate with realtime.** Judges look for "very well-executed products or incredibly creative use cases using Durable Actors and Agent Relay", with bonus points for both (EVENT_PAGE.md). Voice and video are the theme multiplier, not the scoring core.
> - **Best-fit architecture [I]:** GPT-Live-1 in *client delegation* → each `session.delegation.created` goes to a **Terse Durable Actor** (room/ghost state, transcript, timers) → the actor fans work out over **Agent Relay** to specialist agents → results return through `session.thinking.append` (silent) or `session.commentary.append` (spoken) while the voice keeps talking.
> - **Strongest concept [I], from all five sub-files:** a **multiplayer Halloween séance / social-deduction game**. One actor per room, AI "ghost" players scheming on a private Relay channel, the audience joining by QR, one narrator voice, and a post-game reveal of the AI's private whispers.
> - **Do before Saturday:** buy **$5 of OpenAI credit** (GPT-Live does not run on the Free tier, and it is unclear whether event credits count toward Build). Install the Terse CLI and run the counter template. Run Agent Relay's tic-tac-toe example. Get a Gemini AI Studio key and a Deepgram account as fallbacks. Bring a headset mic and a phone hotspot.
> - **Do not plan on:** Hume (APIs die 2026-11-13), Cartesia Sonic-2/turbo (sunset after 2026-10-20), Sora (dead), GPT-Live-1.1 in the API ("coming soon"), Genie 4 / Odyssey-3 / GWM Worlds 2 / Tavus Griffin (not callable).
> - **On stage:** interrupt the AI on purpose, show every agent message as a card, refresh a tab to prove state survives, and keep a mic-on indicator visible.

---

## 1. Key facts tables

### 1a. Speech-to-speech models you can call today

| Model (release) | Endpoint / protocol | Price | Inputs | Key limits | Src |
|---|---|---|---|---|---|
| OpenAI `gpt-live-1` (API GA 2026-09-10) | `v1/live/sessions`, WebRTC/WS (**not** `v1/realtime`) | $0.05/min billed per second; backend model and tools extra | audio, text | **No Free tier.** Concurrency: Build 50 / Launch 300 / Grow 500. Appends capped at 500 tokens | [V] [model page](https://developers.openai.com/api/docs/models/gpt-live-1) |
| OpenAI `gpt-realtime-2.1` / `-mini` (2026-07-06, *background*) | `v1/realtime` | Audio $32 in / $64 out / $0.40 cached per 1M; mini $10/$20/$0.30; image $5/1M; text $4/$24 | audio, text, **image** | 128k context; configurable reasoning | [V] [model page](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) |
| Google `gemini-3.8-live` (stable 2026-09-15) | Gemini Live API, stateful WSS | $3/$12 per 1M audio (≈$0.005 / $0.018 per min); **AI Studio free tier** | text, images, audio (video as ≤1 FPS frames) | Audio-only session 15 min, audio+video **2 min**, connection ~10 min with 60 s GoAway; whole context re-billed every turn [R]; `proactive_audio:false` errors | [V] [model doc](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live), [Firebase limits](https://firebase.google.com/docs/ai-logic/live-api/limits-and-specs) |
| xAI `grok-voice-3.0` (2026-10-14) | `wss://api.x.ai/v1/realtime` (OpenAI-Realtime-shaped) | $0.08/min ($4.80/hr) | audio, text | Built-in `web_search`/`x_search`/`file_search`/`mcp`; history dropped after 30 min idle. "10 concurrent / 120 min" limits are **unverified** | [V] [x.ai](https://x.ai/news/grok-voice-3), [docs](https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech) |
| ElevenLabs Realtime v1 Mini / Max | "OpenAI Realtime-compatible" | $0.08/min + LLM | audio | 620 ms / 570 ms TTFA (vendor) | [V] [pricing/api](https://elevenlabs.io/pricing/api) |
| Phonic 1 (current AA #1) | not researched | not researched | n/a | Pricing and API access not checked | [V] AA rank only |

### 1b. Artificial Analysis Speech-to-Speech Index (re-checked live by the editor 2026-10-29; the page shows no last-updated date)

| Rank | Model | Index | TTFA |
|---|---|---|---|
| 1 | Phonic 1 (High) | 87.1 | 0.61 s |
| 2 | Grok Voice 3.0 | 86.9 | 0.81 s |
| 3 | GPT-Live-1 (Astra, medium) | 83.2 | 1.34 s |
| 4 | Gemini 3.8 Live Extended Thinking (High) | 82.6 | 1.35 s |
| 5 | GPT-Live-1 (Sol, low) | 80.1 | 1.24 s |

Source: [artificialanalysis.ai/speech-to-speech](https://artificialanalysis.ai/speech-to-speech) [V]. AA measures raw-API TTFA, **not** what a caller hears.

### 1c. Voice frameworks, platforms and components

| Item | Price / status | Notable | Src |
|---|---|---|---|
| LiveKit Agents | 15,003★; seven October releases (1.8.4→1.8.10, latest 10-29). Cloud $0.01/agent-min, 1,000 free min on Build | Free turn detection on Cloud; best fit for telephony and multi-participant rooms | [V] gh, [pricing](https://livekit.com/pricing.md) |
| Pipecat | 16,930★; v1.15.0 on 10-29. Pipecat Cloud $0.01/min active | 80+ integrations | [V] gh |
| Vapi | $0.05/min platform fee; 4 lines with no package, 10 on Core, 30 on Pro | GPT-Live beta (10-02), traffic splitting (wk of 10-12) | [V] [pricing](https://vapi.ai/pricing) |
| Retell | $0.07-0.31/min; 20 concurrent free | | [V] |
| ElevenLabs Agents | $0.08/min overage; 15 free min, 4 concurrent | v4 Turbo expressive tags `[laughs]`/`[whispers]` | [V] |
| Deepgram Flux STT | $0.0077/min; **$200 new-account credit** | Built-in `EndOfTurn`/`EagerEndOfTurn` events, ~260 ms EoT (vendor) | [V] [pricing](https://deepgram.com/pricing) |
| Cartesia Sonic-3.6 | GA 2026-08-27, "under 90 ms" (vendor) | **Sonic-2, Sonic-turbo, Sonic-3-2025-10-27 sunset after 2026-10-20** | [V] [changelog](https://docs.cartesia.ai/changelog/2026) |
| Hume EVI / TTS | **Shuts down 2026-11-13** (announced 10-02); account data deleted | Do not use | [V] [changelog](https://dev.hume.ai/voice/changelog) |
| Cloudflare voice-in-a-DO | Now `agents/voice` (agents ≥0.23.0); `@cloudflare/voice` deprecated | You must pick STT and TTS (no defaults); MP3 downstream by default. Same pattern Terse targets | [V] [CF docs](https://developers.cloudflare.com/agents/communication-channels/voice/) |

**Measured cost per minute** (Openbenchmarks invoices) [R]: Telnyx $0.050, ElevenLabs $0.079, Vapi $0.084, Retell $0.134, Bland $0.141. Openbenchmarks medians run 1,296-1,740 ms TTFAB, and its endpointing is pinned at 0.1 s, so real semantic-endpointing delay is higher.

### 1d. Realtime pixels: image, video and world models

| Capability | Option | Self-serve today? | Price | Gotcha | Src |
|---|---|---|---|---|---|
| Camera in → transformed camera out | Decart `lucy-2.6` (`lucy-latest`) | Yes, WebRTC, free starter credits (amount unstated) | $0.02/s ($0.04 fast); `lucy-restyle-2` $0.01/s | Client tokens expire after **60 s**: use `apiKeyProvider` (`@decartai/sdk` ≥0.2.6) | [V] [pricing](https://docs.platform.decart.ai/getting-started/pricing) |
| Prompt-steered continuous video + audio | fal `minimax/h3-max/director` | Yes, alpha client | $0.08/s list, **$4.80 minimum per session**, 35% promo "through October 31", 1080p 2x | Session length conflict (2 vs 15 min, see §6); pin `@fal-ai/client@alpha` | [V] [model page](https://fal.ai/models/minimax/h3-max/director) |
| Realtime image-to-image | fal `krea/v3/realtime`, `flux-2/klein/realtime` | Yes, WebSocket | Krea $0.013/s; Klein $0.00194/compute-s | Klein takes base64 only; never ship `FAL_KEY` to the browser (use a `tokenProvider` JWT) | [V] |
| Talking avatar | HeyGen LiveAvatar | Yes; free tier 10 credits/mo, 2-min sessions | credits | | [V] [changelog](https://docs.liveavatar.com/changelog) |
| Talking avatar | Gemini 3.8 Live + Live Avatar | Google Cloud Agent Platform only (prebuilt avatars; custom avatars need an allowlist) | ~$0.39/min (**unverified**, third-party) | PAYG access not confirmed | [V] [Cloud doc](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/live-api/configure-live-avatars) |
| Driving world model | Decart `oasis-3-preview` (*background*, Jun) | Yes | $0.02/s | Driving only; no object permanence | [V] |
| World models | Genie 4 (10-27), Odyssey-3 (10-08), Runway GWM Worlds 2 (09-03), Tavus Griffin-Lite (10-01) | **No** (trusted testers, research previews, contact forms) | n/a | Do not plan on them | [V] |
| OpenAI video gen | Sora 2 / Videos API | **Shut down 2026-09-24**; no replacement named | n/a | `gpt-image-1` also shut down 10-23; use `gpt-image-2` / `-2.5-sunburst` / `-flare` (09-08) for stills | [V] [deprecations](https://developers.openai.com/api/docs/deprecations) |

### 1e. Live-view and computer-use backends (for a "watch the agents" screen)

| Backend | Live view | Read-only | Notes | Src |
|---|---|---|---|---|
| **Superserve** (sponsor) | `sandbox.desktop.getStreamUrl()` → noVNC on port 6080 | `{viewOnly:true}` (UI-only); private URLs signed for 60 s | `superserve/desktop` template (xfce + Chrome, 1280x800); `desktop.step(...)` returns the action and the next frame; PyPI 0.11.5 | [V] [docs](https://docs.superserve.ai/sandbox/desktop) |
| Browser Use Cloud v4 | `live_view_url` on `browser.ready` | `?readOnly=true&ui=false` | 10 free concurrent browsers; a one-time $100 top-up unlocks 50; keepAlive about 2 min by default | [V] [docs](https://docs.browser-use.com/cloud/browser/live-preview) |
| Browserbase | `debuggerFullscreenUrl` | `pointer-events:none` | Stagehand v4 (08-10) | [V] |
| **Mastra** (sponsor) | `.streamUrl()` on E2B / Daytona sandboxes | n/a | 11 `computer_*` tools, `@mastra/core@1.62.0` (09-02) | [V] [blog](https://mastra.ai/blog/introducing-sandbox-computer-use) |
| **OpenAI Agents API** (sponsor) | **None documented**: base64 JPEGs in `agent.session.turn.item.done` | n/a | Beta 09-10, computer use 09-29. Every new origin needs approval, public sites included; origin approval does not gate individual actions | [V] [guide](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use) |

---

## 2. Newest features, dated (last ~90 days, oldest first)

| Date | What shipped | Why it matters here | Src |
|---|---|---|---|
| 2026-08-04 | Ninth Circuit vacates CFAA injunction against Comet: the *user* "accesses" the site | Legal backdrop for browser agents | [V] Jones Day |
| 2026-08-09 | ChatGPT Atlas stops working | The standalone AI browser is dead; agents moved into existing browsers | [V] |
| 2026-08-26 | Claude in Chrome GA on all paid plans (classifier auto-approval) | | [V] claude.com |
| 2026-08-27 | Cartesia Sonic-3.6 GA | | [V] |
| 2026-08-30 | Terse `durable-actors` repo created (291★ by 10-29) | Host product is two months old | [V] gh |
| 2026-09-01 / 09-29 | Liveblocks Sync; tldraw ChatGPT/Codex multiplayer-agent canvas | Multiplayer human+agent editing is mainstream | [V] |
| 2026-09-02 | Mastra sandbox computer use | Sponsor feature | [V] |
| 2026-09-03 | fal H3 Max Director; Runway GWM Worlds 2 (preview) | | [V] |
| 2026-09-08 | `gpt-image-2.5-sunburst` / `-flare` | Stills on OpenAI credits | [V] |
| **2026-09-10** | **GPT-Live-1 in API**; OpenAI Agents API public beta; HeyGen LiveAvatar + GPT-Live open-source stack | Core voice primitive for this event | [V] |
| 2026-09-15 | Gemini 3.8 Live stable (free AI Studio tier) | Free fallback | [V] |
| 2026-09-16 | BragJack ("Prompt Forcing" via malicious extension; CVE-2026-0628) | Browser-agent security | [R] |
| 2026-09-24 | Sora 2 / Videos API shut down; Gemini Live Avatar | | [V] |
| 2026-09-29 | OpenAI Agents API computer use | | [V] |
| 2026-10-02 | Vapi GPT-Live beta for all customers; Hume announces shutdown | | [V] |
| 2026-10-06 | OpenAI usage tiers collapsed to Build / Launch / Grow; Mastra Agent Controller GA | Tier gating for GPT-Live | [V] |
| 2026-10-14 | Grok Voice 3.0 | | [V] |
| 2026-10-15/16 | GPT-Live Decisions integration; prompt-to-voice `/v1/audio/voices` + 9 voices; GPT-Live-1.1 in ChatGPT only; ChatGPT Chrome extension tab control | Custom ghost voices are free to create (GPT-Live only) | [V]/[R] |
| 2026-10-20 | Cartesia legacy Sonic models sunset | Old tutorials break | [V] |
| 2026-10-23 | Block "Dessa" full-duplex demo; Agentic Kingdoms open beta; `gpt-image-1` shut down | | [R]/[V] |
| 2026-10-27 | Google A2UI Express ("up to 3x" lower latency); Genie 4 (testers only) | | [V] |
| 2026-10-28 | ChatGPT Pro/Business subscribers can claim up to **$500/mo API credits** | Top-up for the $100 event credit | [V] changelog |
| 2026-10-29 | YC Labs "Agents in Games" hits HN (241 pts); `yc-software/minecraft-agent-harness` open-sourced | YC-adjacent judges care about emergent multi-agent behaviour | [V] |

---

## 3. Social sentiment (Aug-Oct 2026)

Coverage is **thin**, and that is stated plainly in every sub-file. `last30days` runs (window Sep 30-Oct 30) hit Reddit 403s, X returned few posts, and TikTok/Instagram were not configured.

- **Biggest real-time demo reaction: Block's Dessa (Oct 23).** Dorsey's post reached about 13.4M views, and an Asmongold reaction clip passed about 1.66M with the line "That's AI?" at 0:29. The Verge called Dessa "occasionally a little awkward and uncanny" [R via postcutoff/Trari]. The audience rewards uncanny, human-like turn-taking.
- **Top real-time AI thread overall was about privacy, not a demo.** A Samsung TV "always-listening" reverse-engineering post on r/singularity (Oct 24) was covered by Tom's Hardware (Oct 25) and Malwarebytes (Oct 27), both of which say the claims are not independently verified. The Reddit score (17.8k) is **unverified** [R]. Always-on mic demos read as creepy without a visible indicator.
- **YC's own interest:** YC Labs' "Agents in Games" (50 GPT-6.1 Sol agents in Minecraft; a leader named "Ada" emerged by directory order, with 616 DMs and no election; plus Bed Wars, Opus 5.5 vs GPT-6.1 Sol) drew 241 points / 82 comments on HN on Oct 29 [V].
- **Practitioner pain** (OpenAI forum, a DEV.to harness post, Reddit quoted via Codebridge): interruptions, false barge-ins from background noise, and endpointing hurt UX more than model latency [V/R].
- **Novelty fades.** Suck Up!'s Steam reviews: 62% of 225 all-time, **47% of 17** in the last 30 days [V]. Feature-announcement videos underperform demos: OpenAI's prompt-to-voice launch got 122K views, 0.5x the directory median [V launchvideo.com].
- **Browser-agent chatter is muted.** The Atlas shutdown HN thread drew 4 points [V]. Sentiment for browser agents was not sampled beyond that.

- **Gap-fill (2026-10-30):** KPIX's "Alameda girl uses AI to create talking skeleton" got 191.9K views and 625 comments on YouTube in 4 days. LiveKit's voice-agent videos show about 686K views but only 26 likes (likely promoted). Two new real-time agent Show HNs: Castellan (an RTS for agents) and HackerDome (PvP with spectating and sabotage). See `reference/social-coverage-gaps.md`.

---

## 4. Contradictions between sub-files: resolved or flagged

| # | Conflict | Resolution | Status |
|---|---|---|---|
| 1 | **AA #1:** 02 cites Grok Voice 3.0 #1 (xAI table "as of Oct 13"); 01 says Phonic 1 | Editor re-fetched AA live on 2026-10-29: **Phonic 1 (High) 87.1 > Grok 86.9 > GPT-Live Astra 83.2 > Gemini 3.8 Ext. Thinking 82.6**. No last-updated date on the page | **Resolved**: Phonic leads. Do not claim "Grok is #1" on stage |
| 2 | **GPT-Live turn events:** HeyGen README says "the API has no turn events"; OpenAI's launch post says GPT-Live "natively supports turn detection" (05) | Editor fetched the Live and Live-delegation guides on 2026-10-29. The guides name `session.started`, `session.updated`, `session.delegation.created`, `session.input_transcript.delta`, `session.output_transcript.delta`, `session.*.appended` and `response.event`, and **no turn-start/end or speech-started/stopped event**. The delegation guide warns: "A transcript fragment is not a complete user turn." | **Mostly resolved [I]:** detection happens inside the model, and the guides document no explicit turn-boundary events. Plan to project turns from transcript deltas as HeyGen does. The full event reference page was not read |
| 3 | **fal H3 Director default session length** (02) | Editor re-fetched both pages 2026-10-29. The model page says "Default session length is up to 15 minutes"; the learn page says "Sessions run up to 2 minutes by default". Both agree on a 60 s minimum ($4.80) | **Still conflicting.** Design for 2 min and treat longer as a bonus |
| 4 | **Gemini 3.8 Live affective dialogue**: AI Studio doc says `enable_affective_dialog` was removed; the Cloud Agent Platform guide says it is "default-enabled" (02) | The two surfaces differ | **Flagged.** Follow the doc for the surface you actually call |
| 5 | **HeyGen demo count**: HeyGen's Sept blog says three demos | Repo tree plus HeyGen's own reply: only the Japanese tutor shipped (05) | **Resolved**: one demo |
| 6 | **Claude in Chrome status**: tech-insider (Oct 28) says "Beta, Max only" | Anthropic's Aug 26 post says GA on all paid plans (04) | **Resolved** in favour of the primary source |
| 7 | **Terse package naming**: README `durable-actors` / `bunx durable-actors dev` vs docs `terse-sdk/actor` / `terse actor dev` (03) | Both live on 2026-10-29 | **Flagged.** Check which one the CLI template emits before the event |
| 8 | **Browser Use default model**: omitting `model` gives `gpt-6-luna`, but the doc samples pass `gpt-5.6-luna` (04) | | **Flagged.** Set `model` explicitly |
| 9 | **Durable Actors prize name**: some notes say "iPhone" | EVENT_PAGE.md says "**iPhone Duo**" (track list) and "iPhone duo" (prizes) | **Resolved** |
| 10 | **Gemini Live cost**: headline $0.005/$0.018 per min vs Duplex Compute's worked $0.05-0.093/min (01) | Both are true: per-turn re-billing of the context window raises the effective cost [R] | **Reconciled**. Use compression and short sessions |
| 11 | **Mimesis and Supernatural Action Team dates** (03) | Mimesis update was June 2026 and the Traitor mode launched Jan 2026, both *background* | **Resolved** in 03 |

---

## 5. Gotchas (cross-cutting, deduplicated)

**OpenAI / GPT-Live**
- **Free tier is unsupported.** Build requires "$5 in total credit purchases", and it is unclear whether event credits count. **Buy $5 before Saturday** [V rate-limits guide].
- `v1/live/sessions` is not `v1/realtime`. Realtime SDK samples and `openai/realtime-voice-component` (gpt-realtime-1.5, last pushed Apr 27) will not drive GPT-Live unchanged [V].
- **No ephemeral client secret is documented for GPT-Live WebRTC.** The browser posts its SDP to *your* server, which calls `POST /v1/live/sessions` with the project key. You need a backend endpoint from minute one (a Terse actor or a Supabase Edge Function). The 15 s billed at init is credited against duration charges [V].
- Client delegation: `session.delegation.created` carries only an ID, with **no task text**. Rebuild intent from transcript deltas. Appends are capped at **500 tokens**, and any append **cancels all pending auto-acks** in the session. Switching delegation mode needs a new session. Interrupting speech does not cancel backend work [V].
- Over WebSocket you must call `conversation.item.truncate` after barge-in; WebRTC handles it. **Use WebRTC in the browser** [V forum].
- GPT-Live takes audio and text only. For vision use `gpt-realtime-2.1` with `input_image`. Impersonating real people with voice cloning is prohibited [R].
- Agents API hosted computer use stalls on every new origin without a `requires_action` handler. Key scopes needed: `api.agents.read/write`, `api.responses.write` [V].

**Other vendors**
- Gemini: put headphones on stage (no echo cancellation in the quickstart). Audio+video sessions are capped at 2 min. `proactive_audio:false` errors on 3.8 [V].
- Decart tokens die after 60 s. fal clients are alpha, and each connect costs at least $4.80, so do not hot-reload into new sessions [V].
- Hume (Nov 13) and old Cartesia models (after Oct 20) are dead ends [V].

**Terse / Agent Relay**
- Terse: put `@Interleave` on the **entry-point** method that streams LLM output ("a decorated helper does not change its caller's policy"), or the room freezes. There are **no cross-actor transactions**. Limits: 10 s idle timeout (open sockets keep it alive), **0.25 CPU / 256 MiB per actor**. Bun ≥1.4.2; dev port 7100 [V Terse FAQ/README].
- Hidden roles: per-socket `setTags`, `broadcast(msg,{tags})`, `except`, `socket.send`. **Never give an agent the full room state**; send a per-seat projection, and validate every agent intent [V/I].
- Relay agents are full CLI harness processes (Claude, Codex) that take seconds per turn. Keep them in turn-based phases with a timeout and a deterministic fallback such as "abstain". The official example caps a game at 5 min with `waitForAny` [V]. Never put `rk_live_*` in a URL; use an observer token (`ot_live_*`) for live views [V via sibling].

**Stage**
- Live-view URLs are credentials (`viewOnly`/`readOnly` are UI-only). Mint fresh signed URLs and add the hosts to `frame-src` [V].
- Mid-sentence pauses beat every endpointer [R]. Script your lines, use a headset or push-to-talk, and bring a hotspot.
- Load-test 50+ fake clients before any QR-join. Astra Attack's server kept falling over under its first spike [R].
- Transcripts lead the audio by seconds, so do not sync visuals to transcript timestamps [V HeyGen].
- Keep browser tasks under ~20 steps. The best agent finishes only 20.6% of long OSWorld 2.0 tasks [V arXiv].

---

## 6. Integration recipes [I unless noted; APIs per sub-files]

**R1. Voice front end → Durable Actor → Agent Relay (the bonus-points spine)**
1. Browser opens WebRTC; its SDP goes to a Terse actor HTTP method (or a Supabase Edge Function), which calls `POST /v1/live/sessions` with `delegation:{type:"client"}`.
2. The actor subscribes to the session's events. It appends `session.input_transcript.delta` to a `@Persisted` transcript. On `session.delegation.created`, it builds the task from the transcript tail.
3. The actor posts the task to an Agent Relay channel (e.g. `#seance`) where specialist agents work (lore, scare-director, skeptic).
4. Partial progress goes back as `session.thinking.append` (≤500 tokens) and the reveal as `session.commentary.append`. The voice keeps talking meanwhile.
5. An `@Emittable` state field and the Relay observer WS feed a projector panel that shows agents talking.

**R2. Social-deduction room ("Who's the Ghost")** (03)
- One Terse actor per room holds roles, phase, timers (alarms), votes and the transcript (`@Persisted`). Humans connect via `prepareWebsocket()` and join from phones.
- AI players are Relay agents with a private ghost channel. A small bridge turns actor phase events into Relay posts and Relay messages into validated actor method calls.
- Post-game "dramatic irony" reveal of the AI's whispers, the proven spectator hook (HowlHouse, AI Werewolf Live, Fireside).

**R3. Haunted Mission Control** (04)
- A grid of 3-5 tiles. Each shows an actor's emitted status and step ledger above a read-only Superserve `getStreamUrl({viewOnly:true})` or Browser Use `live_view_url?readOnly=true` iframe.
- A Relay observer timeline runs alongside. A "poltergeist" agent sabotages via Relay `steer`, and each tile has Pause / Steer / Abort buttons.

**R4. Haunted Mirror (highest visual wow)** (02)
- Webcam → Decart `lucy-2.6` (about $1.20/min). `gemini-3.8-live` or `gpt-realtime-2.1` watches 1 FPS frames.
- A Durable Actor owns the "possession state" and rewrites Lucy prompts. A director agent and a narrator agent negotiate the next scare over Relay.
- Use slow triggers (costume reveal), not fast motion.

**R5. Cheap cascade fallback** (01)
- Deepgram Flux STT ($200 credit, `EagerEndOfTurn`) → any LLM → Cartesia Sonic-3.6 or ElevenLabs TTS, over one WebSocket into the actor, copying Cloudflare's `withVoice` shape.
- Free S2S alternative: Gemini 3.8 Live on an AI Studio key.

**Supabase "scale to millions" angle:** one actor per room scales horizontally, and Supabase holds accounts, leaderboards and replayable event logs. Precedent: Gradient Bang uses Supabase Postgres functions plus Edge Functions as its game server [V].

---

## 7. Hackathon implications

**What to build (consensus ranking across sub-files) [I]**
1. **Multiplayer séance / "Who's the Ghost?" social deduction.** Recipes R2 + R1. Covers both host tracks, the "multiplayer AI system" idea named on the event page, YC Labs' current interest, and the gap left by single-player ghost apps.
2. **Haunted Mission Control** (R3). The best "well-executed product" story; uses the Superserve and Mastra sponsors.
3. **Haunted Mirror** (R4). Most visual, but a second vendor and more cost risk.
4. Lower priority: a Clicky-style ghost cursor (seen as derivative); an "exorcise the codebase" agent relay in Freestyle sandboxes (the Etch pattern, weak on audience).

**Demo script (≈120 s, from 05):** start by talking to it, with no preamble (0-10 s). Interrupt it on purpose (10-40 s). Every agent action appears as a card (40-75 s). The audience joins by QR and changes the world (75-100 s). **Refresh or kill a tab and show the state survives**, with Relay messages scrolling (100-115 s). Close by naming both primitives and the live URL. Bind risky actions to buttons with pre-written prompts. Record a backup video by 3:30pm.

**Setup before Oct 31 (accounts and reading only; all code must be written at the event)**
- OpenAI: buy $5 of credit, confirm `gpt-live-1` and `gpt-realtime-2.1` appear in the Playground, and read the [delegation guide](https://developers.openai.com/api/docs/guides/live-delegation) and the WebRTC guide. If you have ChatGPT Pro or Business, claim the Oct 28 API-credit benefit on the same org. Don't count on the $100 event credit for pre-event testing.
- Terse: `bunx terse-cli@latest install`, then `terse init counter --template counter` and `terse actor dev` (Bun ≥1.4.2). Note which package name the template emits.
- Agent Relay: install `@agent-relay/sdk`, run the tic-tac-toe example, confirm Claude and Codex harness auth, and practise minting an observer token.
- Fallbacks: Gemini AI Studio key; Deepgram ($200); Cartesia or ElevenLabs free key. If you plan R4, set up Decart and fal accounts (≥$10 fal balance for H3). For R3, Superserve and Browser Use keys plus an iframe test page served from your planned hosting domain.
- Hardware: headset mic, phone hotspot, QR generator, a k6/ws load-test plan.
- Pre-write *ideas* (allowed): role cards, phase state machine, prompt archetypes, the narrator script, the "interrupt it" line, 4-6 button prompts.

**What judges and sponsors want**
- **Terse (iPhone Duo):** visible `@Emittable` state, WebSocket grants, hosted deploy, a durability flex. The "durable task state" quote from OpenAI's GPT-Live docs is a ready-made justification.
- **Agent Relay (Mac mini):** agents messaging each other *on screen* via the observer stream, ideally with `steer`.
- **OpenAI:** current APIs (GPT-Live client delegation, Agents API), not legacy realtime or Assistants. At $0.05/min, $100 covers about 2,000 voice-layer minutes; the **50 concurrent sessions on Build** is the real limit, so use one narrator session.
- **Supabase ($1k):** many concurrent joiners shown on a live counter, plus persisted replays.
- **YC (grand prize):** measurable emergent multi-agent behaviour (deception rate, vote accuracy, who led), per YC Labs' framing.

---

## Limits / could not verify

- No API calls, latency tests or SDK runs were made by any researcher or the editor. All latency figures are vendor or third-party, measured on different clocks.
- **Phonic 1** (AA #1) pricing and API were not researched. AA rankings have no date and may change before Oct 31.
- Whether OpenAI event credits count toward Build tier, and when they arrive, is unknown. Whether GPT-Live-1.1 reaches the API before Oct 31 is unknown.
- The GPT-Live full server-event reference page was not read. The turn-event resolution (§4 #2) rests on the guides only.
- fal H3 session length remains contradictory. Decart's free-credit amount is unstated. Gemini Live Avatar PAYG access and price are unverified. Grok concurrency and session limits are unverified.
- X and Reddit could not be read directly. View counts for Dessa, HeyGen, Clicky and the spawn heist come via mirrors or press. The Brockman "real magic" quote, the Samsung thread score, the chasm transcript quote and the Liveblocks agent API names are unverified.
- Many traffic figures are self-reported (AI Slop, Clankland, Sky Reach, Supernatural Action Team's 25M matches, Dominus Automa).
- Not tested: whether Superserve noVNC and Browser Use iframes load from Terse or Freestyle preview domains; whether Terse alarms fit 60-90 s phase timers after idle eviction; whether Relay agents can run on a plain OpenAI API loop rather than CLI harnesses.
- No public example combines Terse Durable Actors with Agent Relay. Every combined recipe here is inference.
- Not re-checked anywhere: open-weight S2S models (NVIDIA, Kyutai, Qwen), Vivix W1, Visko, Meta Muse, the Halloween precedent apps, and most background hackathon winners.

---

## Sources (merged, deduplicated; full lists in each sub-file)

**Event:** [EVENT_PAGE.md](../EVENT_PAGE.md) (https://events.ycombinator.com/haunted-hacks-2026)

**OpenAI:** https://developers.openai.com/api/docs/models/gpt-live-1 · https://openai.com/index/introducing-gpt-live-1-in-the-api/ · https://openai.com/index/introducing-gpt-live/ · https://developers.openai.com/api/docs/guides/live · https://developers.openai.com/api/docs/guides/live-delegation · https://developers.openai.com/api/docs/guides/voice-webrtc · https://developers.openai.com/api/docs/changelog · https://developers.openai.com/api/docs/pricing · https://developers.openai.com/api/docs/models/gpt-realtime-2.1 · https://developers.openai.com/api/docs/guides/realtime-conversations · https://developers.openai.com/api/docs/deprecations · https://developers.openai.com/api/docs/guides/rate-limits · https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use · https://developers.openai.com/api/docs/guides/tools-computer-use · https://openai.com/index/introducing-the-agents-api/ · https://help.openai.com/en/articles/20001551-agents-api-beta-faq · https://help.openai.com/en/articles/20001371-chatgpt-atlas-retirement · https://community.openai.com/t/introducing-gpt-live-1-in-the-api/1396471 · https://community.openai.com/t/gpt-live-1-1-is-rolling-out-with-new-voices-and-better-accents/1406704 · https://community.openai.com/t/when-will-gpt-realtime-2-1-with-live-video-input-be-released-in-the-api/1392430/3 · https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/ · https://github.com/openai/realtime-voice-component · https://www.youtube.com/watch?v=OSaP6bJoU44

**Google:** https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/ · https://ai.google.dev/gemini-api/docs/models/gemini-3.8-live · https://ai.google.dev/gemini-api/docs/pricing · https://ai.google.dev/gemini-api/docs/live-api/capabilities · https://firebase.google.com/docs/ai-logic/live-api/limits-and-specs · https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/guides/gemini-3-8-live · https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/live-api/configure-live-avatars · https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-with-live-avatar/ · https://github.com/google-gemini/cookbook/blob/main/quickstarts/Get_started_LiveAPI_NativeAudio.py · https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/ · https://developers.googleblog.com/fast-reliable-a2ui/ · https://support.google.com/chrome/answer/16821166

**Other voice:** https://artificialanalysis.ai/speech-to-speech · https://x.ai/news/grok-voice-3 · https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech · https://livekit.com/pricing.md · https://github.com/livekit/agents · https://github.com/pipecat-ai/pipecat · https://www.daily.co/pricing/pipecat-cloud/ · https://vapi.ai/pricing · https://vapi.ai/blog/gpt-live-beta · https://docs.vapi.ai/whats-new/2026/10/12 · https://www.retellai.com/pricing · https://elevenlabs.io/pricing/agents · https://elevenlabs.io/pricing/api · https://deepgram.com/pricing · https://developers.deepgram.com/docs/flux/configuration · https://docs.cartesia.ai/changelog/2026 · https://www.cartesia.ai/blog/sonic-3.6 · https://dev.hume.ai/voice/changelog · https://developers.cloudflare.com/agents/communication-channels/voice/ · https://www.codebridge.tech/articles/voice-ai-phone-agents-latency-benchmark · https://openbenchmarks.com/voice-agent-latency/vapi · https://duplexcompute.com/research/gemini-live-api-pricing/ · https://metaprompt.ai/posts/fastest-speech-to-speech-models · https://www.linkedin.com/posts/kwkramer_our-friends-at-modal-shipped-a-new-sticky-activity-7518710443616481280-rg6m

**Realtime pixels / world models:** https://docs.platform.decart.ai/getting-started/pricing · https://docs.platform.decart.ai/changelog · https://docs.platform.decart.ai/models/realtime/lucy-2.6 · https://fal.ai/models/minimax/h3-max/director · https://fal.ai/learn/tools/what-is-minimax-h3-max-director · https://fal.ai/docs/documentation/model-apis/inference/real-time · https://fal.ai/models/krea/v3/realtime · https://fal.ai/models/fal-ai/flux-2/klein/realtime/api · https://docs.liveavatar.com/changelog · https://odyssey.systems/meet-odyssey-3 · https://runway.com/research/introducing-gwm-worlds-2 · https://www.tavus.io/griffin · https://techcrunch.com/2026/10/27/googles-genie-4-world-model-adds-audio-more-realistic-worlds-and-real-time-steering/

**Games / multiplayer:** https://labs.ycombinator.com/projects/games/index.html · https://github.com/yc-software/minecraft-agent-harness · https://www.digitaltoday.co.kr/en/view/80856/relugames-mimesis-global-cumulative-sales-top-2-million · https://technode.com/2026/08/03/giant-networks-supernatural-action-team-reimagines-horror-through-chinese-folklore-and-modern-gameplay/ · https://www.dualshockers.com/seed-ai-npc-new-mmo-alive-after-you-log-off/ · https://metashiftlabs.com/insights/dominus-automa-automated-mmorpg · https://prismix.dev/news/482ba69b14a4 · https://www.indiedb.com/news/agentic-kingdoms-is-open-a-browser-strategy-mmo-with-people-and-ai-agents-in-one-world · https://clankland.io/blog/1000-llm-agents-run-a-real-economy · https://naavik.co/podcast/finding-success-with-ai-agents-and-content-creators/ · https://store.steampowered.com/app/2726370/Suck_Up/ · https://www.youraislopbores.com/blog/going-viral · https://github.com/pipecat-ai/gradient-bang · https://github.com/a16z-infra/ai-town · https://github.com/skyaara/llmgames-online · https://github.com/sujal-maheshwari2004/mafia-a2a · https://github.com/616xold/howlhouse · https://github.com/AI-Lab-CZ/ai-werewolf-live · https://tldraw.dev/blog/introducing-tldraw-for-chatgpt-and-codex · https://liveblocks.io/blog/introducing-liveblocks-sync-the-sync-engine-for-the-agentic-web · https://tesana.com/game/sky-reach

**Hosts:** https://www.useterse.ai/ · https://github.com/TerseAI/durable-actors · https://docs.useterse.ai/quickstart · https://docs.useterse.ai/faqs · https://docs.useterse.ai/reference/typescript-sdk · https://agentrelay.com/blog/introducing-agent-relay · https://github.com/AgentWorkforce/relay

**Browser agents / UI:** https://claude.com/resources/articles/claude-in-chrome-generally-available · https://www.theverge.com/ai-artificial-intelligence/1012510/openai-chatgpt-google-chrome-tabs · https://www.engadget.com/2288580/open-ai-updates-chatgpt-extension-for-chrome/ · https://theroboticsmedia.com/article/perplexity-comet-browser-control-computer-credits-paywall-pro-max-september-15-2026 · https://www.jonesday.com/en/insights/2026/09/ninth-circuit-vacates-cfaa-injunction-against-perplexitys-comet-ai-agent · https://deafnews.it/en/news/ai/bragjack-a-malicious-extension-hijacks-five-ai-agents-in-chromium-browsers · https://docs.superserve.ai/sandbox/desktop · https://docs.browser-use.com/cloud/browser/live-preview · https://docs.browserbase.com/platform/browser/observability/session-live-view · https://mastra.ai/blog/introducing-sandbox-computer-use · https://vercel.com/changelog/ai-sdk-7 · https://arxiv.org/html/2606.29537v2 · https://www.northbase.design/patterns/agentic-interface · https://github.com/RichardHruby/browser-brawl · https://github.com/jadenseangmany/diamondhacks-2026

**Viral demos / sentiment:** https://postcutoff.com/e/2026-10-23-block-dessa-speech-only-full-duplex-model/ · https://trari.com/en/story/asmongoldclips-18996/ · https://github.com/heygen-com/liveavatar-gpt-live-demos · https://github.com/heygen-com/liveavatar-hyperframes-demo · https://www.heygen.com/blog/heygen-september-2026-release · https://github.com/farzaa/clicky · https://www.xda-developers.com/someone-built-tiny-ai-that-lives-next-to-your-cursor-the-most-useful-thing-ive-tried-this-year/ · https://www.dexerto.com/gaming/ai-made-runescape-clone-goes-viral-with-playable-browser-version-3406698/ · https://www.terapep.com/blog/astra-attack-ai-browser-fps-2026/ · https://www.launchvideo.com/directory/openai-gpt-live-voices · https://www.tomshardware.com/tech-industry/cyber-security/hacker-finds-own-samsung-tv-collecting-scary-amounts-of-user-information-and-gets-banned-by-openai-for-cyber-abuse-tv-runs-an-ai-model-that-collects-audio-screenshots-and-plenty-of-other-user-data-for-ad-targeting · https://www.malwarebytes.com/blog/privacy/2026/10/samsung-tvs-without-mics-may-listen-through-soundbars-researcher-says · https://world-zero-viral-001.world-zero-viral-001-089.workers.dev/control/ · https://pranavachar.com/etch · https://aicrier.com/post/zh9ok2vknqwifpvr8no1 · https://dev.to/prabu_sp/the-haunted-ai-mirror-2h4m
