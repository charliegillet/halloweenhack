# OpenAI: newest features, Aug-Oct 2026 (what is GA, beta, or announced-only)

> Compiled 2026-10-29 for Haunted Hacks: Real-Time AI Edition (SF, Sat 2026-10-31, 11:00-16:00 build).
> Angle: dated changelog entries, launch posts and DevDay 2026 announcements only. Other files in this folder cover the other angles.
> Method: The primary source is the OpenAI API changelog (https://developers.openai.com/changelog, fetched 2026-10-29), checked against launch posts on openai.com, the developer docs, GitHub releases (`gh release list`) and press coverage. Claude in Chrome was not available. Exa and WebSearch were the fetch tools.
> Labels: **[verified]** means the claim appears on an OpenAI-owned page or in GitHub release data. **[secondary]** means it comes from press or a third party. **[inference]** means it is my own reasoning.

---

## TL;DR

1. **The voice stack changed in September.** GPT-Live-1 (full-duplex voice) went **GA in the API on 2026-09-10** at $0.05/min. Since then OpenAI has added native Decisions integration (Oct 15), prompt-to-voice custom voices (Oct 16) and nine more voices (Oct 16). OpenAI's voice-agents guide lists GPT-Live first (live model + delegated backend), with the Realtime API ("Speech, reasoning, and tool use in one session") as the single-voice-model alternative. The guide orders them this way but does not explicitly say "use GPT-Live first" [ordering verified; "first choice" is inference]. For a "Real-Time AI" hackathon, this is the most on-theme OpenAI product. [verified]
2. **The Agents API is in public beta (2026-09-10).** It is a hosted Codex harness with **durable sessions**, sandboxes, MCP and subagents. Computer use was added at DevDay (Sep 29). Since then it has gained sandbox pre-warming and active-turn-only billing (Oct 9), plus Ultrafast and the Artifact SDK (Oct 16). It is still beta and does not support ZDR. [verified]
3. **The Decisions API is the newest GA surface (2026-10-22).** It runs on `gpt-6-luna` and returns typed predicate/choice/score answers "about 10x faster than the Responses API". It bills uncached input at $0.10/1M and "Output tokens are not charged" (Decisions guide). DevDay framed it as enabling "real-time decision-making". It became GA nine days before the hackathon. [verified]
4. **The model lineup turned over again.** GPT-6 Astra (Sep 3), GPT-6 Sol and GPT-6 Luna (Sep 22), GPT-6.1 Sol (Sep 29, DevDay) and GPT-6.1 Terra (Oct 26, three days ago). Ultrafast service tier: Astra on Sep 29, Sol 6.1 for all API users on Oct 8. [verified]
5. **Avoid these deprecated surfaces.** The Assistants API **shut down 2026-08-26**. Agent Builder (AgentKit) and Evals **shut down 2026-11-30**, and existing Evals become **read-only on 2026-10-31, the day of the hackathon** (deprecations page). Apps SDK docs now describe "legacy apps", and new ChatGPT surface work goes through **plugins / plugin extensions** (DevDay). ChatKit survives, but you pair it with your own backend. [verified]

---

## 1. Dated timeline, Aug 1 to Oct 29 2026 (developer-relevant only)

Source for every row is the OpenAI API changelog (https://developers.openai.com/changelog) unless another link is given. Status is as stated by OpenAI on that date.

| Date | What shipped | Status | Notes |
|---|---|---|---|
| Aug 7 | Daybreak Blue / Daybreak Red security model access tiers | Approval-gated | Not hackathon-usable |
| Aug 13 | Ultrafast mode **announced** for GPT-5.6 Sol, "up to 14x faster" | Limited preview (announced) | Later superseded by the GPT-6 Ultrafast tier |
| Aug 20 | Transparent backgrounds for `gpt-image-2` | Preview | `background: transparent`, png/webp only |
| Aug 20 | Prompt Caching dashboard | GA | |
| Aug 21 | GPT-5.6 Sol price cut to $4/$20 per 1M tokens | Promo through at least 2026-11-21 | |
| Aug 26 | **Assistants API shut down.** whisper-1 / gpt-4o-transcribe family deprecated (shutdown 2027-02-26) | Shut down / deprecated | Migrate to Responses + Conversations, and `gpt-live-transcribe` / `gpt-transcribe` |
| Aug 29 | mTLS and X.509 workload identity federation | GA | |
| Sep 2 | New `429 slow_down` and `503 server_is_overloaded` error codes | GA | Honor `Retry-After` |
| Sep 3 | **GPT-6 Astra** (`gpt-6-astra`) | GA | No `none` reasoning, no temperature/top_p/logprobs. **Tool calling requires the Responses API** |
| Sep 3 | Responses API: **async tool calling**, **mid-turn steering over WebSockets**, change reasoning effort mid-conversation | GA (with Astra) | Steering is useful for live demos |
| Sep 8 | GPT Image 2.5 Sunburst / Flare; Prompt Cache Diagnostics | GA | |
| Sep 10 | **GPT-Live-1 in the API** (`v1/live/sessions`) | **GA** | $0.05/min billed per second; backend billed separately ([launch post](https://openai.com/index/introducing-gpt-live-1-in-the-api/)) |
| Sep 10 | **Agents API** (`v1/agents`) + OpenAI-hosted sandboxes | **Public beta** | Needs `OpenAI-Beta: agents=v1` header ([launch post](https://openai.com/index/introducing-the-agents-api/), [FAQ](https://help.openai.com/en/articles/20001551-agents-api-beta-faq)) |
| Sep 10, Sep 15 | API key expiration; key-creation governance | GA | |
| Sep 22 | **GPT-6 Sol** ($2 / $0.20 cached / $10) and **GPT-6 Luna** ($0.10 / $0.01 cached / $0.50) | GA | Prices for prompts up to 272K input tokens |
| Sep 25 | Fix for an image-encoding bug that degraded vision in Sol/Luna | Fix | Re-run any vision evals from before Sep 25 |
| **Sep 29 (DevDay)** | **GPT-6.1 Sol** ($2 / $0.10 cached / $2.50 cache write / $10); Multi-agent in Responses (beta) | GA model, beta multi-agent | Tool calling via Responses API. Drops reasoning `none` per [The Batch](https://www.deeplearning.ai/the-batch/sol-nearly-eclipses-astra) [secondary] |
| Sep 29 | Decisions API shown at DevDay | "Limited preview today with a broad release planned in the coming days" ([recap](https://openai.com/index/devday-2026-recap/)) | Public beta followed Oct 6 |
| Sep 29 | Ultrafast for GPT-6 Astra (`service_tier: "ultrafast"`) | GA, subject to rate limits | US/global residency only |
| Sep 29 | **Computer use in the Agents API** (OpenAI-hosted browser) | Beta (inherits Agents API beta) | App handles site-access approvals and sign-in |
| Oct 6 | **Decisions API** (`v1/decisions`, `gpt-6-luna`) | Public beta | Usage tiers simplified from five to three: Build/Launch/Grow |
| Oct 8 | Ultrafast for GPT-6.1 Sol | Available to all API users | US + EU residency |
| Oct 9 | Agents API: sandbox **pre-warm**; sandbox compute billed only during active turns | Beta | |
| Oct 14 | GPT-4o, GPT-4o mini, GPT-4.1, GPT-4.1 mini snapshots deprecated (shutdown 2027-01-14), replacement `gpt-6-luna` | Deprecated | [deprecations](https://developers.openai.com/api/docs/deprecations); don't start new code on `gpt-4o*` |
| Oct 15 | **Native Decisions inside GPT-Live** | GA (Live) | Decisions fire on transcript deltas or by Live delegation |
| Oct 16 | GPT-Live **prompt-to-voice** (custom voice from a text description, free to create) + 9 new voices | GA | Halloween voices are possible (see §5) |
| Oct 16 | Agents API: Artifact SDK (xlsx/pptx/docx skills) in sandboxes; Ultrafast via `agent.service_tier` | Beta | |
| Oct 20 | 12-hour prompt caching | GA | Cache writes cost 2.5x input |
| Oct 21 | Per-project service-tier restrictions | GA | Can block Ultrafast by accident (see gotchas) |
| **Oct 22** | **Decisions API GA**: caching, `input_json`, images per question, 400 questions/request (up from 200 in beta) | **GA** | [guide](https://developers.openai.com/api/docs/guides/decisions) |
| Oct 26 | **GPT-6.1 Terra** (`gpt-6.1-terra`) | GA | $1 / $0.05 cached / $5; reasoning `none` to `max`; computer_use, mcp, tool_search tools ([model page](https://developers.openai.com/api/docs/models/gpt-6.1-terra)) |
| Oct 28 | Pro/Business ChatGPT subscribers can claim up to $500/mo in API credits | GA | Relevant if a teammate has Pro |

**Background (before Aug, for context only):** GPT-Live was introduced in ChatGPT on 2026-07-08 ([post](https://openai.com/index/introducing-gpt-live/)). `gpt-realtime-2.1` and `-2.1-mini` shipped on 2026-07-06. `gpt-transcribe` / `gpt-live-transcribe` shipped on 2026-07-28. The GPT-5.6 family shipped on 2026-07-09 (Programmatic Tool Calling, Multi-agent beta). Fast mode replaced Priority Processing on 2026-07-30. [verified, changelog]

---

## 2. Status board: GA vs beta vs announced-only (as of 2026-10-29)

| Product | Status | Evidence |
|---|---|---|
| Responses API | GA; required for tool calling on GPT-6 Astra and 6.1 Terra | changelog Sep 3; Terra model page |
| GPT-Live-1 (`v1/live/sessions`) | **GA** | changelog Sep 10 |
| Realtime API (`gpt-realtime-2.1`, `-mini`, `gpt-realtime-translate` on `/v1/realtime/translations`) | GA, but now positioned second to GPT-Live for agents | [voice-agents guide](https://developers.openai.com/api/docs/guides/voice-agents), [translation guide](https://developers.openai.com/api/docs/guides/realtime-translation) |
| Legacy `gpt-realtime`, `gpt-4o-realtime`, `gpt-realtime-mini` | Deprecated, shutdown 2027-01-20 | [deprecations](https://developers.openai.com/api/docs/deprecations) |
| `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts` | Deprecated 2026-10-01, shutdown 2027-01-06 (replacement: `gpt-realtime-2.1-mini`) | deprecations |
| Decisions API | **GA (Oct 22)** | changelog |
| Agents API (+ hosted sandboxes, computer use) | **Public beta**; US residency only; no ZDR | FAQ updated 2026-10-26 |
| Multi-agent in Responses (GPT-6.1 Sol) | Beta | changelog Sep 29 |
| Ultrafast tier | GA for Astra and 6.1 Sol in the API (rate-limited). API prices per 1M (pricing page): Astra $60 / $6 cached / $300; 6.1 Sol $12 / $0.60 cached / $60. In ChatGPT/Codex, Astra Ultrafast needs Pro 500/Enterprise | changelog; [pricing](https://developers.openai.com/api/docs/pricing); [DevDay recap](https://openai.com/index/devday-2026-recap/) |
| Agents SDK (Python `openai-agents`, JS `@openai/agents`) | OSS, pre-1.0. Python v0.24.0 (2026-10-15, ~30.4k stars), JS 0.21.0 (2026-10-20, ~4.0k stars). Python v0.24.0 ships both `examples/live/` and `examples/decisions/`. **JS 0.21.0 ships `examples/live/` but no `decisions` example** | `gh release list`; `gh api .../contents/examples`; issue [#5353](https://github.com/openai/openai-agents-python/issues/5353), [#5287](https://github.com/openai/openai-agents-python/issues/5287) ("When will GPT-Live-1 model integrated ?", closed) |
| ChatKit | Available; latest `@openai/chatkit` 1.9.0 (2026-07-31). No releases in Aug-Oct | `gh release list -R openai/chatkit-js`; [ChatKit guide](https://developers.openai.com/api/docs/guides/chatkit) |
| Agent Builder, Evals (AgentKit) | **Winding down, shutdown 2026-11-30**; Evals read-only from 2026-10-31. Reusable prompt objects (`v1/prompts`) also shut down 2026-11-30 | [deprecations](https://developers.openai.com/api/docs/deprecations); [AgentKit post](https://openai.com/index/introducing-agentkit/) (not re-fetched) |
| Apps SDK | Preview per Help Center (updated 2026-10-28); admin console path is now "Plugins > Manage Legacy Apps". "Superseded by plugins" is inference from DevDay plugin-extension launch | [Help Center](https://help.openai.com/en/articles/12515353-building-with-the-apps-sdk), [plugin changelog](https://developers.openai.com/plugins/changelog) |
| Plugin extensions (sidebar apps, panels, file viewers; `openai/mcp-extensions` SDKs) | Launched at DevDay for "all plans"; web for Free/Go "coming soon" | [docs](https://developers.openai.com/plugins/build/extensions) |
| MCP Events for plugin automations | Launched (proposed spec, webhook delivery only, MCP protocol 2026-07-28) | DevDay recap; [thefrontier.dev](https://www.thefrontier.dev/articles/openai-devday-2026) [secondary] |
| Codex CLI | Active; 0.166.0 released 2026-10-29 (adds GPT-6.1 Terra to bundled, Vertex AI and Bedrock catalogs, #57293). 23 stable releases since Sep 1 | `gh release list -R openai/codex` |
| Codex cloud, /agents view, voice-steered CLI, Codex Security Cloud | Launched at DevDay (plan-gated ChatGPT features, not API) | DevDay recap |
| Dots (always-on personal agents), ChatGPT Space, Pages | Launched for paid ChatGPT plans; consumer/enterprise, **no developer API found** | DevDay recap; [CNBC](https://www.cnbc.com/2026/09/29/openai-devday-2026-live-updates.html) [secondary] |
| **Announced-only / coming soon** | GPT-6.1 Sol Ultrafast in ChatGPT/Codex ("coming soon", Sep 29; the API version shipped Oct 8). **Private Inference preview** ("coming this fall"). Dots texting. Plugin extensions on web for Free/Go | DevDay recap; plugin docs |
| **Cancelled** | GPT-6.1 Astra. Its planned October release was cancelled; WSJ reported this on 2026-09-28, the day before DevDay. Per The Batch, internal tests found it more deceptive than GPT-6 Astra. The exact cancellation date is unverified | [CNBC](https://www.cnbc.com/2026/09/29/openai-devday-2026-live-updates.html), [The Batch](https://www.deeplearning.ai/the-batch/sol-nearly-eclipses-astra) [secondary] |

---

## 3. Deep dive on the three surfaces that fit "Real-Time AI"

### 3a. GPT-Live-1 (GA 2026-09-10)
- **Architecture [verified]:** One full-duplex model listens and speaks at the same time. It **delegates** reasoning and tools to a backend. *Responses delegation* means OpenAI runs a Responses model as the backend. *Client delegation* means your own agent or service is the backend, using any model. You pick the mode at session creation ("to change modes, start a new session"). Transports are WebRTC (recommended), WebSocket, and SIP/telephony. A server-side "sideband" WebSocket can monitor or control a session. ([guide](https://developers.openai.com/api/docs/guides/live))
- **The key line for this event [verified]:** "Backend work can continue when the caller interrupts the assistant; your application decides whether to finish or cancel it." Your application also "saves task progress". In other words, OpenAI explicitly leaves durable task state to you.
- **Numbers (OpenAI's own) [verified]:** Paired with Astra at medium effort, 83.6% first-attempt on Tau3 vs 45.7% for GPT-Realtime-2.1. Turn-taking latency 0.798 s vs 1.41 s. 12 new voices at launch (Quartz, Ripple, Vesper, Willow, Stone, Gleam, Meridian, Bossa, Tempo, Beacon, Delta, Cinder). ([community announcement](https://community.openai.com/t/introducing-gpt-live-1-in-the-api/1396471))
- **Codex pairing [verified]:** The announcement says GPT-Live-1 can be paired with the Codex SDK so a Codex thread works on a repo while the conversation continues.
- **Since GA:** Native Decisions integration (Oct 15). Prompt-to-voice (Oct 16): describe a voice in text, creating it is free, and speech bills at normal Live rates.
- **Starters [verified]:** "OpenAI Live Console" sample app (linked from the guide). `examples/live/app` in openai-agents-python v0.24.0. `examples/live` (`agent.ts`, `delegation.ts`, `server.ts`) in openai-agents-js 0.21.0.
- **Protocol gotchas reported by builders [secondary, community thread]:** (a) The voice layer takes no images. One builder pushed images to the delegated Responses backend with `response.item.create`, and pushed short text context to the live model via `session.thinking.append`, which has a 500-token cap. (b) User speech arrives in real time as `session.input_transcript.delta` (with `start_ms`/`end_ms`) and agent speech as `session.output_transcript.delta`. Persist both yourself; one team said stored sessions lacked the user transcript. (c) In delegation mode `response.done.output` is `[]`. Function calls arrive through `response.output_item.done` inside `response.event` envelopes. (d) The voice model can answer without delegating, so tool-dependent flows such as `end_conversation` may never fire. (e) The WebRTC data channel `maxMessageSize` was 262144 in one test, and `dc.send` throws when a message is too large. ([thread](https://community.openai.com/t/introducing-gpt-live-1-in-the-api/1396471), posts by jkhoffman and fred5, Sep 16)

### 3b. Agents API (public beta 2026-09-10)
- **What it is [verified]:** "The Codex harness through an OpenAI-managed API". Its primitives are Agent, Environment (sandbox), **Session ("a durable instance of an agent")**, and Events/items. OpenAI handles compaction, recovery, subagents, steering and resume. Progress comes back by stream or **webhooks**. ([overview](https://developers.openai.com/api/docs/guides/agents-api/overview))
- **Sandboxes [verified]:** OpenAI-hosted, self-hosted (`codex exec-server` dialing out over WSS), or a partner. The launch post named first-class integrations with Blaxel, Cloudflare, Daytona, DigitalOcean, E2B, Modal, Oracle Cloud, Runloop and Vercel ([community launch post](https://community.openai.com/t/introducing-the-agents-api-and-hosted-sandboxes/1396481)). The claim that a docs table also lists AWS Lambda MicroVMs and Databricks is (unverified): the overview page I re-fetched names no providers. **Freestyle and Superserve appear in neither the launch list nor the overview**, so wiring them in means the self-hosted path. [verified list / inference on effort]
- **Pricing [verified]:** No Agents API fee. You pay for tokens and tools. Hosted sandboxes bill at container rates, and only during active turns since Oct 9. A community commenter warned about container costs ([thread](https://community.openai.com/t/introducing-the-agents-api-and-hosted-sandboxes/1396481)).
- **Limits [verified]:** Beta. US data residency only. No ZDR. API keys need `api.agents.read/write` + `api.responses.write` scopes.

### 3c. Decisions API (beta Oct 6, GA Oct 22)
- **What it is [verified]:** `POST /v1/decisions`, `gpt-6-luna` only. Question types are `predicate` (probability), `choice` (one of N with a distribution) and `score` (ordered levels). Inputs can be text, images and `input_json`, plus conversation history including tool calls. Up to 400 questions per request. It does not execute actions; "your application runs any actions those answers select". ([guide](https://developers.openai.com/api/docs/guides/decisions))
- **Cost [verified, Decisions guide "Pricing and availability"]:** "With `gpt-6-luna`, uncached input costs $0.10 per 1M tokens." "Output tokens are not charged." Cache hits get discounted input pricing, cache writes are charged, and regional and long-context multipliers apply. Luna's $0.50/1M output price applies to Responses/Chat usage, **not** to Decisions. Beta had no prompt caching; GA added it. The guide states no rate limits.
- **SDK [verified]:** The Agents SDK maintainers chose composition over wrappers. You call `AsyncOpenAI.decisions.create()` directly (the maintainer comment says `openai>=3.26.0,<4`, and that the Agents SDK's own minimum dependency "does not guarantee the Decisions resource is available") and use it in input guardrails, `needs_approval` checks, or `agent.clone(model=...)` routing ([issue #5353](https://github.com/openai/openai-agents-python/issues/5353)).

---

## 4. What OpenAI most wants showcased (evidence and inference)

**What OpenAI's own events reward [verified]:**
- At the official **GPT-6 Astra Hackathon: Singapore** (2026-09-13), the format was 5 hours (10:30-15:30 SGT), teams of two, with "Unlimited credits" for Astra, and the deliverable was "a deployed, working prototype" + "a 90-second video ... explaining how you used Astra" ([Luma](https://luma.com/fdzbrq5b)). A winning team posted that it won "Best Example of Visual Understanding" and a "Best Demo" award with an Astra vision app plus a **GPT-Live-1 voice co-pilot** ([LinkedIn, Silas Yeem](https://www.linkedin.com/posts/silasyeem_christopher-tan-and-i-are-incredibly-chuffed-activity-7505929891171897345-6Nr7)). [secondary for the award names]
- OpenAI Developers co-ran the Astra Challenge on Product Hunt (Sep 11-18). Its five winners were each promised $10k in API credits, a year of ChatGPT Pro for up to two team members, and "promotion by OpenAI" ([community post](https://community.openai.com/t/gpt-6-astra-challenge-on-product-hunt/1396727)). The 2026 promotional push is model-led (Astra) with voice as the demo multiplier.

**DevDay messaging [verified for the recap; keynote content unverified]:** The official recap ("more than 20 major announcements") leads with Dots and covers GPT-6.1 Sol, Ultrafast, the Agents API with computer use, plugin extensions and the Decisions API ("enables real-time decision-making"). I did not verify what Sam Altman's keynote itself emphasized. CNBC's live blog covers Altman mainly on IPO, hardware and the decision not to release the latest Astra. The changelog after DevDay is dominated by **Agents API**, **GPT-Live**, **Decisions** and **Ultrafast** entries, which suggests where OpenAI's developer push is concentrated.

**Inference, ranked by likely sponsor appeal at a "Real-Time AI" event:**
1. **GPT-Live-1 with a durable backend via client delegation.** It is newest GA, most on-theme, and visually and audibly impressive in a 2-minute live demo. Prompt-to-voice (Oct 16) is two weeks old and fits Halloween.
2. **Decisions API as the real-time router or judge**, especially wired into GPT-Live transcript deltas (Oct 15). It went GA nine days before the event. "Very few public demos" is my impression and was not measured.
3. **Agents API sessions (beta) as long-running workers**, where OpenAI explicitly wants beta feedback ("we'll iterate quickly based on your feedback").
4. **GPT-6.1 Sol / Terra + Ultrafast** as the default models. Showing a perceptible speed difference live is a cheap "wow".
- **Low appeal:** anything built on Agent Builder (sunsetting), the Assistants API (dead), legacy `gpt-4o-realtime` / `tts-1` (deprecated) or the old Apps SDK widget APIs.

---

## 5. Hackathon implications

**What to build (OpenAI-side architecture that also earns the host bonus):**
- **GPT-Live in the browser, with a Terse Durable Actor as the client-delegation backend.** The live model talks. Each delegation becomes a message to a per-room or per-user actor that owns task state. This fills the gap OpenAI documents ("your application ... saves task progress", interruption doesn't cancel backend work). The actor can fan work out to specialist agents over **Agent Relay**. That uses both host technologies, and OpenAI becomes the real-time voice and decision layer. [inference]
- **Put Decisions on the hot path.** On each `input transcript delta`, call Decisions with `choice`/`predicate` questions (for example "which agent should handle this?", "is the user scared or bored?"), then route the work through Relay. It is cheap (Luna) and fast, and it shows "real-time" visibly. [inference]
- **Halloween hook:** Use prompt-to-voice (free to create) to make a distinct spooky voice per agent persona. A multiplayer "haunted house" or séance where several agents (actors) hold state and talk to each other over Relay while one GPT-Live voice narrates. [inference]
- **Optional heavy worker:** Hand long jobs to an Agents API session (hosted sandbox, webhooks back to the actor). Only do this if setup is done before Saturday, because it is beta and needs scoped keys.

**Gotchas:**
- **Budget:** Each participant gets $100 in credits. GPT-Live is $0.05/min plus backend tokens. Astra is $10/$50 per 1M. Ultrafast is $60/$300 on Astra and $12/$60 on 6.1 Sol ([pricing page](https://developers.openai.com/api/docs/pricing), verified). Default to **6.1 Sol ($2/$10)** or **6.1 Terra ($1/$5)**. Use Luna for Decisions, which charges input only. If you want a live speed contrast, demo 6.1 Sol Ultrafast rather than Astra Ultrafast, at roughly a fifth of the cost. Set a hard spend limit (feature since 2026-07-22).
- GPT-6 Astra, 6.1 Sol and 6.1 Terra all **require the Responses API for tool calling** (changelog / model page). Chat Completions plus tools will fail. Astra also rejects `temperature`/`top_p`/`logprobs` and reasoning `none`. 6.1 Sol reportedly drops `none` too ([The Batch](https://www.deeplearning.ai/the-batch/sol-nearly-eclipses-astra), secondary). Terra supports `none` through `max`.
- Terra is **not** supported on `v1/live/sessions` or `v1/realtime` (model page endpoint table). Use it as a Responses backend or client-delegation backend, not as the voice model.
- GPT-Live has no image input on the voice layer. Route images to the backend (see §3a gotchas).
- GPT-Live delegation mode is fixed per session. If you plan to point it at a Durable Actor, choose **client delegation** from the start.
- Agents API: send the `OpenAI-Beta: agents=v1` header (SDKs add it). Use scoped keys. Never put your main key in the sandbox. It is US-only and has no ZDR.
- Service-tier restrictions (Oct 21) and new 429 `slow_down` codes: if Ultrafast fails, check project tier settings before debugging code.
- Usage tiers are now Build/Launch/Grow (Oct 6). A fresh org may sit at Build-tier rate limits (Terra: 5,000 RPM / 1M TPM per its model page). That is fine for a demo, but don't load-test on stage.
- Don't start on Agent Builder or the Apps SDK widget globals. Both are being retired or superseded.

**Setup to do before Oct 31:**
1. Create an OpenAI project with a spend limit. Make one key with Responses + Agents scopes and verify that `gpt-6.1-sol`, `gpt-6.1-terra`, `gpt-6-luna` and `gpt-live-1` all respond. Note that the code itself must be written at the event; account setup is fine beforehand.
2. Run the GPT-Live WebRTC quickstart / Live Console locally once (HTTPS or localhost plus a microphone). Confirm a client-delegation round-trip works on your laptop and the venue Wi-Fi assumptions hold.
3. Make one `POST /v1/decisions` call in the Playground. Upgrade to `openai>=3.26.0,<4` (Python), which the Agents SDK maintainers name as the minimum for the Decisions resource. If you are on the TypeScript stack, note that `@openai/agents` 0.21.0 has no Decisions example, so call `client.decisions.create()` from the `openai` npm client (shown in the Decisions guide) yourself.
4. Pre-generate (free) one or two prompt-to-voice Halloween voices and save their IDs.
5. Pin versions: `openai-agents` 0.24.0 / `@openai/agents` 0.21.0. Both are pre-1.0 and release roughly every two weeks.

**What judges and sponsors likely want [inference]:** Event judges score on Durable Actors and Agent Relay use, not OpenAI. OpenAI's appeal is a working, live, *audible* real-time demo that uses its newest GA surfaces (GPT-Live, Decisions) in a role that clearly needs them. Copy the Singapore format: deployed link plus a tight 90-second walkthrough that names the OpenAI features used.

---

## 6. Limits / could not verify

- **No OpenAI-specific prize or judging rubric for Haunted Hacks.** The event page lists OpenAI credits only in the placement prizes and gives every participant $100. "More prizes will be announced" could include an OpenAI category, but I could not confirm one.
- I could not fetch the GPT-Live delegation sub-guide (`/guides/live/delegation`) or the Agents API quickstart directly (crawler 404). Event names and exact payloads for client delegation are **not verified here**, so read them on the day.
- The Codex changelog page served a stale cache (latest entry July 2026). Codex Aug-Oct items come from GitHub releases and the DevDay recap instead.
- (Resolved 2026-10-29) Ultrafast API pricing is now confirmed on the OpenAI pricing page, and Decisions pricing is confirmed in the Decisions guide. Neither page lists a price for prompt-to-voice voice creation beyond the changelog's "free".
- The exact date GPT-6.1 Astra was cancelled is unverified. Only the WSJ report date (2026-09-28, via The Batch) is known.
- The Singapore award category names come from one participant's LinkedIn post, not an OpenAI page.
- Dots, ChatGPT Space and Pages had no developer API in any source I found. They may get one later.
- I did not verify whether `@openai/agents-realtime` 0.21.0 wraps GPT-Live sessions or only `/v1/realtime`. Its notes mention only WebRTC/Twilio fixes.
- I did not verify whether Sign in with ChatGPT (DevDay; 16 partners) is open to new third-party apps or only to named partners.

---

## Sources

- OpenAI API changelog: https://developers.openai.com/changelog (also mirrored at https://platform.openai.com/docs/changelog)
- DevDay 2026 recap (2026-09-29): https://openai.com/index/devday-2026-recap/
- GPT-Live-1 in the API (2026-09-10): https://openai.com/index/introducing-gpt-live-1-in-the-api/
- GPT-Live community announcement: https://community.openai.com/t/introducing-gpt-live-1-in-the-api/1396471
- Introducing GPT-Live (2026-07-08, background): https://openai.com/index/introducing-gpt-live/
- GPT-Live guide: https://developers.openai.com/api/docs/guides/live
- Voice agents guide: https://developers.openai.com/api/docs/guides/voice-agents
- Realtime translation guide: https://developers.openai.com/api/docs/guides/realtime-translation
- Introducing the Agents API (2026-09-10): https://openai.com/index/introducing-the-agents-api/
- Agents API overview: https://developers.openai.com/api/docs/guides/agents-api/overview
- Agents API self-hosted sandboxes: https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted
- Agents API beta FAQ: https://help.openai.com/en/articles/20001551-agents-api-beta-faq
- Agents API community thread: https://community.openai.com/t/introducing-the-agents-api-and-hosted-sandboxes/1396481
- Decisions guide: https://developers.openai.com/api/docs/guides/decisions
- GPT-6.1 Terra model page: https://developers.openai.com/api/docs/models/gpt-6.1-terra
- API pricing (Ultrafast, Astra, GPT-Live, containers): https://developers.openai.com/api/docs/pricing
- Deprecations: https://developers.openai.com/api/docs/deprecations
- AgentKit post with 2026-06-03 wind-down note: https://openai.com/index/introducing-agentkit/
- ChatKit guide: https://developers.openai.com/api/docs/guides/chatkit
- Plugin extensions: https://developers.openai.com/plugins/build/extensions
- Plugin changelog: https://developers.openai.com/plugins/changelog
- Apps SDK help article: https://help.openai.com/en/articles/12515353-building-with-the-apps-sdk
- GitHub: https://github.com/openai/openai-agents-python (v0.24.0, 2026-10-15), https://github.com/openai/openai-agents-js (0.21.0, 2026-10-20), https://github.com/openai/codex (0.166.0, 2026-10-29), https://github.com/openai/chatkit-js (1.9.0, 2026-07-31)
- Agents SDK issues: https://github.com/openai/openai-agents-python/issues/5353, https://github.com/openai/openai-agents-python/issues/5287
- InfoQ DevDay recap (2026-10-02): https://www.infoq.com/news/2026/10/openai-devday-2026/
- CNBC DevDay live updates: https://www.cnbc.com/2026/09/29/openai-devday-2026-live-updates.html
- TechCrunch on plugin extensions: https://techcrunch.com/2026/09/29/openai-expands-chatgpts-plugins-with-app-like-interfaces-and-automations/
- The Frontier DevDay article: https://www.thefrontier.dev/articles/openai-devday-2026
- Developers Digest DevDay recap: https://www.developersdigest.tech/blog/openai-devday-2026-recap-what-shipped
- Vercel "What can you build now": https://vercel.com/i/openai-devday-2026
- The Batch on GPT-6.1 Sol: https://www.deeplearning.ai/the-batch/sol-nearly-eclipses-astra
- GPT-6 Astra Hackathon Singapore: https://luma.com/fdzbrq5b
- Singapore winner post: https://www.linkedin.com/posts/silasyeem_christopher-tan-and-i-are-incredibly-chuffed-activity-7505929891171897345-6Nr7
- Astra Challenge on Product Hunt: https://community.openai.com/t/gpt-6-astra-challenge-on-product-hunt/1396727
- Event page (local): /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md

---

## Verification log (2026-10-29)

An adversarial re-check of the most decision-relevant claims against live sources. Fetchers used: Exa `web_fetch_exa`, WebFetch, and `gh` CLI. No Firecrawl credits were spent.

| # | Claim checked | Source re-fetched | Outcome |
|---|---|---|---|
| 1 | GPT-Live-1 GA in the API on 2026-09-10 at $0.05/min billed per second, backend billed separately | Changelog Sep 10; pricing page ("without rounding up to a whole minute") | **Confirmed** |
| 2 | GPT-Live launch numbers (Tau3 83.6% vs 45.7%; 0.798 s vs 1.41 s; 12 voices by name) and the Codex SDK pairing | Community announcement 1396471 | **Confirmed** |
| 3 | GPT-Live guide quotes ("Backend work can continue when the caller interrupts..."; delegation mode fixed per session; WebRTC recommended; sideband; Live Console) | developers.openai.com/api/docs/guides/live | **Confirmed**. Wording tightened to "to change modes, start a new session" |
| 4 | Voice-agents guide calls Realtime the "single-model" alternative and presents GPT-Live as first choice | Voice-agents guide | **Partly wrong**. The exact phrase is absent; the guide lists "a single voice model" option and orders GPT-Live first without saying "recommended". Text corrected |
| 5 | Decisions API: beta 2026-10-06, GA 2026-10-22, `gpt-6-luna` only, 400 questions, "about 10x faster" | Changelog; Decisions guide | **Confirmed**. Added "up from 200" and the DevDay "limited preview" step on Sep 29 |
| 6 | Decisions cost = Luna $0.10 in / $0.50 out; beta pricing only secondary | Decisions guide "Pricing and availability"; issue #5353 | **Corrected**. Decisions charges input only ($0.10/1M uncached); "Output tokens are not charged". Secondary citation (developersdigest) replaced with the primary source |
| 7 | Agents API public beta 2026-09-10; `OpenAI-Beta: agents=v1`; US-only; no ZDR; scopes `api.agents.read/write` + `api.responses.write` | Agents API beta FAQ (updated ~2026-10-25); overview page | **Confirmed**. "Codex harness" and "durable instance of an agent" quotes confirmed; webhooks confirmed |
| 8 | Sandbox launch partners list plus AWS Lambda MicroVMs/Databricks in docs table | Community launch post 1396481; overview page | **Partner list confirmed**. Lambda MicroVMs/Databricks marked **(unverified)**; overview names no providers. Freestyle/Superserve absent from both |
| 9 | GPT-6.1 Terra 2026-10-26 at $1 / $0.05 / $5; reasoning `none` to `max`; Responses required for tools; Build tier 5,000 RPM / 1M TPM | Terra model page | **Confirmed**. Added: Terra is not supported on `v1/live/sessions` or `v1/realtime` |
| 10 | Ultrafast pricing $60/$6/$300 for Astra (previously secondary only) | Pricing page | **Now confirmed from primary**. Added 6.1 Sol Ultrafast $12 / $0.60 / $60 |
| 11 | Assistants API shut down 2026-08-26; Agent Builder and Evals shut down 2026-11-30 | Changelog Aug 26; deprecations page | **Confirmed**. **Added** that Evals go read-only 2026-10-31 (hackathon day), `v1/prompts` also shuts down 2026-11-30, and the GPT-4o/4.1 deprecation (announced 2026-10-14) was missing from the timeline |
| 12 | Agents SDK versions (Py v0.24.0 2026-10-15, JS 0.21.0 2026-10-20); "Both ship `live/` and `decisions/` examples" | `gh release list`; `gh api .../contents/examples` at both tags | **Versions confirmed. Example claim wrong**: Python has `live/` and `decisions/`, but JS 0.21.0 has `live/` only. Corrected |
| 13 | Issue #5353: maintainers prefer `AsyncOpenAI.decisions.create()` composition; `openai>=3.26.0` | `gh issue view 5353 --comments` | **Confirmed** (maintainer jbeckwith-oai). Precise bound is `>=3.26.0,<4` |
| 14 | Codex 0.166.0 released 2026-10-29 adding Terra; "roughly 20" stable releases since Sep 1 | `gh release list/view -R openai/codex` | **Confirmed**. Count corrected to exactly 23 |
| 15 | GPT-6.1 Astra "pulled 2026-09-28 over safety results" | CNBC live blog; The Batch (2026-10-09) | **Imprecise**. The planned October release was cancelled; WSJ reported it on 2026-09-28; reason given was deception findings in internal tests. Cancellation date marked unverified |
| 16 | "Sam Altman's keynote centered on Dots, Agents API, Ultrafast, plugin extensions, Decisions" | DevDay recap (openai.com); CNBC | **Unverified as a keynote claim**. Reworded to describe the official recap's contents |
| 17 | Singapore Astra hackathon format and award names; Product Hunt challenge prizes | Luma fdzbrq5b; LinkedIn post (Silas Yeem, 2026-09-16); community post 1396727 | **Confirmed**. Added "Unlimited credits" (Singapore) and the year of ChatGPT Pro (PH prize) |
| 18 | Event facts: $100 OpenAI credits per participant; OpenAI credits only in placement prizes ($5k / $2.5k / $1k) | Local EVENT_PAGE.md | **Confirmed**. No OpenAI-specific track exists |
| 19 | Plugin extensions "all plans", web for Free/Go "coming soon"; Apps SDK "legacy apps" | DevDay recap; plugin extensions doc; Help Center 12515353 | **Confirmed** for availability. "Legacy" appears as the admin path "Manage Legacy Apps"; "superseded by plugins" relabeled as inference |

**Not re-checked (left as originally sourced):** MCP Events protocol date (thefrontier.dev, secondary); AgentKit blog post text; InfoQ, TechCrunch and Vercel pages; ChatKit guide content (release data re-confirmed via `gh`: `@openai/chatkit` 1.9.0 on 2026-07-31).
