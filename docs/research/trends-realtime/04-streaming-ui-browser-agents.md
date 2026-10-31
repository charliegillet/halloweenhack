# Streaming / generative UI, browser and computer-use agents, and "watch the agents think" UX

Researched **2026-10-29** for Haunted Hacks (Sat Oct 31 2026, SF, 11:00 to 16:00 build window, then live demos). This file covers one narrow angle: what you put on screen so that judges can see real-time agents working. That means streaming and generative UI protocols, browser agents (Atlas, Comet, Claude in Chrome, Gemini auto browse), computer-use APIs with live views, multi-agent dashboards, and the UX patterns that demo well. It deliberately skips model rankings, voice and actor runtimes, which sibling files cover; it cites them where they connect.

Tags: **[V]** means verified on the cited page. **[R]** means reported by a third party (press, blog or aggregator) and not checked against a primary source. **[I]** means my own inference.

---

## TL;DR

1. **The standalone AI browser had a bad quarter. The browser agent itself did not.** OpenAI announced Atlas's retirement on Jul 9, and Atlas stopped working on **Aug 9, 2026** [V: OpenAI Help Center, Verge]. On **Oct 15-16**, OpenAI shipped the same "computer use" into its **ChatGPT Chrome extension**: it can read tabs, and Work mode can control tabs [R: Verge, Engadget, IBTimes; re-checked 2026-10-29]. Claude in Chrome went **GA on every paid plan on Aug 26**, with a classifier auto-approving actions it judges safe [V: claude.com]. Perplexity moved Comet's "Control browser" agent behind metered **Computer credits** in mid-September. The only source is press, which says Perplexity "has yet to officially document" the change [R]. The agent now lives inside the browser people already use.
2. **Every serious browser/computer-use backend now ships an embeddable live view.** Examples: Browserbase `debuggerFullscreenUrl`, Browser Use `live_view_url` with `readOnly=true`, Superserve `desktop.getStreamUrl({viewOnly})` (noVNC), and Mastra sandbox computer use `.streamUrl()`. One sponsor, **Superserve, has this built in** [V]. OpenAI's hosted Agents API computer use instead streams **screenshots inside events** and documents no live video URL [V].
3. **The generative UI stack settled into three layers this year:** **AG-UI** (event transport into your own app), **MCP Apps** (sandboxed `ui://` iframes inside hosts such as ChatGPT and Claude), and **A2UI** (declarative JSON rendered with native components). Google shipped **A2UI "Express"** on **Oct 27** and claims up to 3x lower latency [V]. AI SDK 7 (Jun 25) added MCP Apps rendering and `WorkflowAgent` [V].
4. **Demo winners in 2026 make agents *visible*, and often adversarial.** The YC x Browser Use hackathon winner (Feb 28) was **Browser Brawl**: two agents fighting in one live cloud browser [V: GitHub, LinkedIn]. DiamondHacks' winner showed **parallel persona agents in embedded live-browser iframes** [V]. Browserbase CEO Paul Klein IV posted that "107 of ~400 teams built on Browserbase" at the Berkeley AI Hackathon (June 2026) [V that he posted it; the figure itself is vendor-reported].
5. **[I] For this event,** the strongest "Real-Time AI" visual is a grid of live agent views. Each tile is a Terse actor's emitted state plus a Superserve/Browser Use live iframe. Agent Relay's read-only observer WebSocket drives a message timeline between the tiles. That one screen uses both host technologies.

---

## 1. Browser agents: what changed Aug-Oct 2026

### Timeline (last ~90 days, background marked)

| Date | Event | Status | Source |
|---|---|---|---|
| 2025-10-21 (background) | ChatGPT Atlas launched (macOS) with agent mode | Retired | [V] openai.com/index/introducing-chatgpt-atlas |
| 2026-07-09 (background) | OpenAI announces Atlas sunset as part of the ChatGPT Work launch | — | [V] Verge; help.openai.com |
| **2026-08-04** | Ninth Circuit vacates the CFAA injunction against Comet (Amazon case). It holds that the *user*, not Perplexity, "accesses" the site when the agent acts at the user's direction | First appellate ruling on agentic AI under the CFAA (Judge Milan D. Smith Jr.; the court limited the holding to the current record) | [V] Jones Day alert (Sep 2026), a law-firm summary; I did not read the opinion itself |
| **2026-08-09** | Atlas stops working. Users are pointed to the ChatGPT desktop app and the Chrome extension | Dead | [V] community.openai.com, help.openai.com |
| 2026-08-12 | Claude in Chrome side panel becomes a Claude Cowork session | Shipped | [R] pasqualepillitteri.it citing Anthropic help center |
| 2026-08-18 | Gemini in Chrome reaches all US Android users. Auto browse for AI Pro/Ultra | Rolling | [R] tech-insider.org, presenc.ai |
| **2026-08-26** | **Claude in Chrome GA on all paid plans**. Autonomous actions with a safety classifier (same mechanism as Claude Code auto mode); can be switched off | GA | [V] claude.com/resources/articles/claude-in-chrome-generally-available |
| 2026-09-15 | Comet's "Control browser" agent moves to **Computer credits** (Pro: one-time 4,000; Max: 35,000 plus 10,000/mo) | Paywalled | [R] theroboticsmedia.com (Sep 21, updated Oct 28) says the change was "surfaced" on Sep 15 and is not officially documented by Perplexity; NudgeScout cites Perplexity's credit docs |
| 2026-09-16 | **BragJack** disclosure by Gal Weizman (Forever Security). A malicious extension with page-modification plus `declarativeNetRequest` permissions hijacks the agents in Gemini Live in Chrome, Comet, Edge, Opera Neon and Claude in Chrome. The technique is called "Prompt Forcing": it replaces the agent's command flow rather than hiding text in page content. CVE-2026-0628 (Chrome, CVSS 8.8) and CVE-2026-55945 (Edge, CVSS 4.2) | Disclosed | [R] deafnews.it (Sep 19), citing BleepingComputer |
| **2026-10-15/16** | **ChatGPT Chrome extension** can read open tabs (tag `@chrome`). **ChatGPT Work** can control tabs (send messages, fill forms, download files, group tabs). Available on all plans. IBTimes says the Chrome Web Store listing shows "about 7 million users". Setup goes through the ChatGPT desktop app: install the extension under computer-use settings, then select it in a Work or Codex chat (IBTimes, citing OpenAI's extension guide). Also works in Edge, Brave and Opera | Shipped | [R] Verge (Oct 15), Engadget (Oct 16), IBTimes (Oct 16), all re-read 2026-10-29 |
| 2026-10-20 | Comet iOS 26.40.0 (iPhone Duo layouts). Desktop Comet voice mode on GPT Realtime 1.5 | Shipped | [R] piunikaweb; TechSpot listing |

**Conflict to flag:** tech-insider.org (Oct 28) says Claude in Chrome is "Beta since 6.10.2026, Max only". That contradicts Anthropic's own Aug 26 GA post. Trust the primary source.

### What the consumer products teach about UX [V unless marked]

- **Gemini auto browse** shows a **plan before starting** ("Review the plan… click Start Task"). It puts an **auto browse icon on the tab** it is using, sends a notification when it needs you, and supports **take over** and hand-back. Limits: "up to 20 requests per day" on AI Pro and up to 200 on Ultra. Eligibility: US only, 18+, English device language, a personal Google account, and a "gradual" rollout (support.google.com/chrome/answer/16821166, re-read 2026-10-29).
- **Claude in Chrome** moved from approving every action to **classifier-gated auto-approval** that checks each action "against what you originally asked for."
- **Atlas (background)** paused on sensitive sites "to ensure you're watching it." Its post-mortem coverage blames reliability, speed, prompt injection and the cost of maintaining a full browser [R: HTX].
- **[I] Takeaway:** the industry converged on *plan preview, visible activity marker, interrupt/take-over, gate on sensitive actions*. A hackathon demo that shows those four on screen will look current.

---

## 2. Computer-use APIs and live views you can embed

| Backend | How you watch it live | Read-only option | Notes | Source |
|---|---|---|---|---|
| **Superserve** (sponsor) | `sandbox.desktop.getStreamUrl()` returns a noVNC viewer on port 6080 | `{ viewOnly: true }` (UI-only; use a `private` preview policy, signed for 60 s) | `superserve/desktop` template: xfce, Chrome, 1280x800. `desktop.step(actions,{waitForChange:true, format:"jpeg"})` runs one model turn plus the next frame in one request and returns `timings`. The desktop survives pause/resume. An MCP `sandbox_computer` tool uses CUA-style action names | [V] docs.superserve.ai/sandbox/desktop; PyPI 0.11.5 |
| **Browser Use Cloud v4** | `browser.ready` event returns `live_view_url` (`live.browser-use.com`). Embed in an iframe | `?readOnly=true&ui=false`, or wrap the iframe in `inert` plus `pointer-events:none` | Treat the URL as a credential. The browser stays open about 2 min after the run (`keepAlive` 120-14400 s). Session queue with an `interrupt` flag. New projects get 10 concurrent browsers at $0; a one-time $100 top-up unlocks 50. If you omit `model`, V4 uses `gpt-6-luna` with High reasoning. Note that the docs' own code samples pass `gpt-5.6-luna` explicitly. Free-plan projects are limited to a short model list |  [V] docs.browser-use.com/cloud/browser/live-preview; llms-full.txt; changelog Jul 17 |
| **Browserbase / Stagehand** | `bb.sessions.debug(id).debuggerFullscreenUrl`; one URL per tab in `pages` | `style="pointer-events:none"` on the iframe | Posts a `browserbase-disconnected` message. Stagehand v4 (Aug 10) runs as an in-browser extension and claims "2x faster than Playwright, ~80% more token efficient". Agent runs can `pauseWhen` (natural-language condition) for human review | [V] docs.browserbase.com live view; [R] Browserbase LinkedIn; releases.sh |
| **Mastra sandbox computer use** (sponsor) | `.streamUrl()` on E2B Desktop / Daytona sandboxes; 11 `computer_*` tools | — | Shipped Sep 2 in `@mastra/core@1.62.0`. Needs third-party sandbox keys | [V via sibling] mastra/02-newest-features.md; mastra.ai/blog/introducing-sandbox-computer-use |
| **OpenAI Agents API computer use** (sponsor) | **No live URL documented.** Set `include_screenshots: true` and read base64 JPEG `computer_screenshot` from `agent.session.turn.item.done` events | n/a | Hosted browser (`environment.type: "openai_hosted"` **plus `environment.desktop.enabled: true`**; tool `{type:"computer_use", include_screenshots:true}`). **Every new origin needs an approval event, including public sites** (`agent.session.requires_action` → `computer_use_approval_request`, `browser_origin_access`; decide with `approve`/`deny`/`cancel`). The docs warn that origin approval "does not enforce confirmation before individual actions". Beta header `OpenAI-Beta: agents=v1`. Key scopes: `api.agents.read`, `api.agents.write`, `api.responses.write`. Agents API public beta Sep 10 ("no additional fees" beyond tokens and tools); computer use added Sep 29 (API changelog) | [V] developers.openai.com/api/docs/guides/agents-api/tools/computer-use |
| **OpenAI Responses `computer` tool** | You own the environment (pair it with Superserve or Browser Use) | — | Batched `actions[]` per `computer_call`. OpenAI recommends *code execution* (Playwright/PyAutoGUI) over the `computer` tool for GPT-6 Astra. SDK `ComputerToolset` / `BrowserToolset` with `confirm`, `urlPolicy`, `maxSteps` (default 20) | [V] developers.openai.com/api/docs/guides/tools-computer-use; tools-computer-use-sdk-drivers |

**Capability context, all vendor-reported:** on **OSWorld 2.0** (108 long-horizon tasks, median about 1.6 h of human time, an average of 318 tool calls per task measured with Claude Opus 4.7 at maximum thinking), the best run, Claude Opus 4.8 with maximum thinking and batched tool calls, completes only **20.6%** of tasks on the binary metric at 500 steps (54.8% partial score). GPT-5.5 plateaus near 13% [V: arXiv 2606.29537 abstract, v2 Jul 13]. Newer launch claims are higher, e.g. GPT-6 Astra 72.6% *partial* score, but these are self-reported and not comparable across harnesses [R: leaderboard.steel.dev]. **[I] For a 5-hour demo:** keep browser tasks short (under 20 steps), on a known site, and scripted. Long unsupervised runs will fail on stage.

---

## 3. Streaming and generative UI protocols

| Layer | What it is | 2026 status | Source |
|---|---|---|---|
| **AG-UI** (CopilotKit) | Event protocol, agent to *your* frontend. About 16 event types (`TEXT_MESSAGE_CONTENT`, `TOOL_CALL_START`, `STATE_DELTA`…). Bidirectional, over SSE/WS | Integrations listed for Mastra, LangGraph, CrewAI, Google ADK, Claude Agent SDK and others. OpenAI Agents SDK and Cloudflare Agents "in progress" (as of Jun) | [R] openui.com state-of-genUI report (Jun 10) |
| **MCP Apps** (SEP-1865) | Tool result references a `ui://` HTML resource. The host renders it in a sandboxed iframe and talks over `postMessage` | First official MCP extension (Jan 2026). Hosts: Claude, ChatGPT Apps, VS Code Copilot, Goose, Postman. **AI SDK 7 renders MCP Apps** | [R] openui.com; [V] vercel.com/changelog/ai-sdk-7 |
| **A2UI** (Google) | Agent emits declarative JSON drawn from a client-advertised component catalog. The client renders natively (React, Flutter, Lit, Angular) | v0.9 Apr 17. A2UI+MCP Apps patterns Jun 17. **Oct 27: "A2UI Express" inference format, "up to 3x" lower latency and 3x fewer tokens than direct JSON** | [V] developers.googleblog.com (three posts) |
| **Vercel AI SDK 7** | `useChat` typed tool parts, `DirectChatTransport({agent})`, tool approvals in UI, `WorkflowAgent`, realtime voice (experimental) | GA Jun 25. `fullStream` renamed `stream`. Server errors now redacted from UI streams by default | [V] vercel.com/changelog/ai-sdk-7; GitHub ai@7.0.0 |
| **Mastra Agent Controller** (sponsor) | Per-session live pub/sub state to every subscribed client, `steer()`, follow-up queue | GA Oct 6. API broke Oct 21 (sessionId) | [V via sibling] mastra/02-newest-features.md |

**Host-native streams that already do the job** (from sibling files, verified there):
- **Terse Durable Actors:** `@Emittable` on a `@Persisted` field pushes `{type:"state"}` on connect, then `{type:"state_update", changes}` after each mutating call. `broadcast()` handles token deltas. Browser sockets connect via `prepareWebsocket()` grants. `observe/state` reads a snapshot without waking the actor (terse/01-docs-api.md).
- **Agent Relay:** an **observer token** (`ot_live_*`, `stream:read`) gives a read-only `GET /v1/ws` stream "meant for a human-facing live view". The MCP tool `get_observer_url` mints one (1-2160 h). Never put `rk_live_*` in a URL (agent-relay/01-docs-api.md).

**[I]** You probably do not need AG-UI or A2UI to win here. The host primitives (Terse emitted state plus Relay observer WS) already give you a typed live stream. Generative UI is worth adding only if the *agent choosing the UI* is part of the demo, e.g. the "haunted" agent rewrites the dashboard. If you do, A2UI JSON rendered by your own React components is the lowest-risk path: no iframe and no host dependency.

---

## 4. "Watch the agents think": UX patterns that demo well

These are drawn from 2026 pattern write-ups. Treat them as practitioner opinion, not measured results.

| Pattern | What it looks like | Evidence |
|---|---|---|
| **Plan preview, then gate** | Show steps, scope and an estimate; one "Start" click | Northbase audit: 7 of 9 systems show an upfront plan, 2 gate on approval (Perplexity, Copilot) [R: northbase.design]. Gemini auto browse does this [V] |
| **Progress ledger + live status line** | Step list (pending/active/done/failed) plus one sentence on "what's happening now" | agentic-ux.com framework [R]; makeyouragent.ai advises named phases over fake percentages [R] |
| **Stream lifecycle events, not raw tokens** | Render `STEP_STARTED / TOOL_CALLED / STEP_FINISHED` as UI | tianpan.co (Mar) [R]; Turitto: "Do not stream hidden reasoning as the primary progress signal" [R] |
| **Reasoning display: pick a pole** | Full trace, summary, duration chip, or nothing. v0 pairs a duration chip with expandable content | Northbase [R] |
| **Pause vs steer vs abort** | Three separate controls. A steer input that applies at the next step boundary without stopping the run | menuagentic.com playbook [R]. Maps directly to Relay `mode:"steer"` and Mastra `steer()` [I] |
| **Stopped is a state** | Name it, keep partial work, offer Continue | Northbase: ChatGPT discards the partial response; Perplexity labels an abort "Completed 14 steps" [R] |
| **Background run visibility** | List-row spinner with live step text when the run outlives the tab | Northbase: 6 of 9 show nothing; Perplexity and Manus are the exceptions [R] |
| **Mission-control grid** | Tiles per agent, colored status badges, live terminal/iframe, focus mode | Many OSS examples in Sep-Oct (Orquesta Agent Grid Oct 21, stapler-squad, Hermes Studio, OpenClaw dashboards) [R: dev.to, GitHub] |
| **Externalized shared state** | Goal, plan, progress and artifacts live in an object that both human and agent read and write | menuagentic.com [R]. This is literally a durable actor's persisted state [I] |
| **Execution visibility + intervention gate** | Academic naming of the same patterns | ACM ICMI '26 companion paper (Oct 5) [V abstract] |

### Hackathon precedents (2026)

- **Browser Brawl**, winner of YC x Browser Use (Feb 28-Mar 1). An attacker agent completes a task while a defender agent injects JS popups and fake buttons into the same cloud browser. Traces are streamed via SSE into Convex, with a Browser Use cloud live view and replayable history. Built in 24 h. Prize pool was $100k [V: github.com/RichardHruby/browser-brawl README (21 stars as of 2026-10-29); V: Mehul Kalia's LinkedIn post (Mar 8) "We won the Y Combinator x Browser Use Hackathon"].
- **AgentUX**, winner of DiamondHacks (Apr). Parallel persona agents on Browser Use cloud, embedded live-browser iframes, a WebSocket log color-coded per persona, and a confusion heatmap [V: GitHub].
- **trAIde**, Berkeley AI Hackathon sponsor winner (Jun). A Browserbase + Stagehand persistent context, plus an AgentSpan durable workflow that pauses at the approval step. The user-facing UI was SMS via Poke; the visual dashboard was AgentSpan's local one, not custom-built [V: GitHub README].
- **[I] Common thread:** each one shows more than one agent at once, uses a live browser *as the stage*, and has a clear human approval or interference moment.

---

## 5. Gotchas (verified constraints)

- **Live view URLs are credentials.** Browser Use: "anyone with it can interact." `readOnly` and `viewOnly` are UI-only, not server permissions. Superserve `private` URLs expire in 60 s, so mint a fresh one per viewer [V].
- **OpenAI hosted computer use asks for origin approval on every new site, including public ones.** Without a handler for `requires_action`, the run stalls on stage. Pre-approve or script the decision [V].
- **Browser Use v4** frees the browser about 2 min after a run unless `keepAlive` is set. A follow-up emits `browser.reattached`, not `browser.ready`. A client timeout does not cancel the server-side run [V].
- **Iframe CSP:** add `live.browser-use.com` (or the Superserve preview host) to `frame-src` [V].
- **Prompt injection is unsolved.** Superserve's desktop docs say everything on screen "is untrusted input to the model" [V]. BragJack (Sep) is a related but different vector: a malicious *extension* forcing prompts into the browser agent [R]. Keep demo agents on sites you control, or on read-only tasks.
- **OpenAI origin approval is not action approval.** If you want a visible "gate on dangerous action" moment with OpenAI hosted computer use, build it yourself or use a browser you control (Superserve, Browser Use) [V: OpenAI computer-use guide].
- **AI SDK 7 renames** (`fullStream`→`stream`, `onToolExecutionStart`). Snippets copied from older tutorials will throw deprecation warnings or break [V].
- **Comet's agent now costs credits** and cannot be scripted from your app. It is not a building block [R/I].

---

## Limits / could not verify

- Claude in Chrome's exact status is disputed: GA on all paid plans per Anthropic Aug 26 [V], versus "Beta, Max only" per tech-insider.org Oct 28 [R].
- The Comet credit amounts come from third-party reports. NudgeScout cites Perplexity's credit docs, but I did not open Perplexity's page myself.
- The ChatGPT Chrome extension's Oct 15 feature list comes from press coverage (Verge, Engadget, IBTimes, all consistent). I did not read OpenAI's own post or the extension guide. The "about 7 million users" figure is IBTimes reading the Chrome Web Store listing (unverified by me).
- Browser Use's "default model" depends on how you call it: omitting `model` gives `gpt-6-luna`, but every code sample in the docs passes `gpt-5.6-luna`.
- The rest of the OpenAI Agents API computer-use page (about 27 KB past the 100 KB point) was not read. A live-view feature or pricing could be documented there.
- All OSWorld 2.0 numbers except the authors' runs are vendor self-reports.
- The Northbase "N of 9 systems" counts come from a design-pattern site with an unstated sampling date.
- I did not run any of the SDK snippets. I did not test whether Superserve's noVNC or Browser Use iframes load inside a page served from a Terse/Freestyle preview domain (CSP, cookies).
- Social sentiment (X, Reddit) on browser agents was not sampled for this file. The only discussion data is the HN threads cited, and the Atlas shutdown thread drew just 4 points, which says little.

---

## Hackathon implications

**What to build. [I] One concrete shape scores on both host tracks:**
- **"Haunted Mission Control."** 3-5 agents, each backed by a **Terse Durable Actor** (`@Persisted @Emittable` status, plan and step ledger). Each agent drives a **Superserve desktop** or a **Browser Use** browser.
  - The web UI is a grid. Each tile shows the actor's emitted state (status badge, current step line, ledger) above a **read-only live iframe** (`getStreamUrl({viewOnly:true})` or `live_view_url?readOnly=true`).
  - Agents coordinate over **Agent Relay**. A side timeline subscribes to the Relay **observer WS** (`ot_live_*`), so judges see the messages that make agents react.
  - The Halloween twist, Browser-Brawl style: a **poltergeist agent** uses Relay `steer` to sabotage the others mid-task, or injects JS into their pages. Humans hit **Pause / Steer / Abort** per tile.
- **Variant with a lighter browser dependency:** a generative-UI "séance board". The agent emits A2UI-style JSON rendered by your own React components, streamed through actor state. No external browser, lower demo risk.
- **For Supabase "scale to millions" [I]:** the story is per-agent actors with sharded state, plus Supabase for cross-agent queries and replay history. Show a "replay this run" button backed by stored step events.

**Demo rules [I, grounded in the patterns above]:**
- Open on the plan preview and the Start click.
- Keep every browser task under ~20 steps, on a site you control or a stable public one.
- Show one human intervention (steer or take-over) and one gate on a "dangerous" action.
- Name the stopped state. Never let a tile sit silent; the status line must keep moving.
- Pre-record a fallback video of the grid in case venue Wi-Fi kills the live streams.

**Setup before Oct 31 (ideas and setup only; all code must be written at the event):**
- Create accounts and keys:
  - Superserve: redeem credits. Check that the `superserve/desktop` template is available on your plan; free/trial teams get 0 custom templates, but system templates work.
  - Browser Use: 10 free concurrent browsers.
  - Optionally Browserbase.
  - Agent Relay workspace (`POST /workspaces`): save `rk_live_*` and practice minting an observer token.
  - Terse CLI login and `terse deploy` smoke test.
  - OpenAI key with Agents API scopes if you plan to use hosted computer use.
- Open a Superserve desktop viewer and a Browser Use live view **inside an iframe on a test page**. This confirms CSP and cookie behavior from your planned hosting domain.
- Decide which model drives computer use (cost per step matters). Read the current AI SDK 7 or Mastra docs, not older tutorials.
- If you plan to use AI SDK 7, install Node 22+ and use an ESM project (`"type": "module"`); v7 rejects CommonJS. If you plan to use OpenAI hosted computer use, create a key with `api.agents.read`, `api.agents.write` and `api.responses.write`, and write the origin-approval handler first.
- Pick 2-3 demo websites and rehearse the exact tasks by hand.

**What judges and sponsors likely want [I]:**
- **Terse:** visible `@Emittable` state, WebSocket grants and hosted deploy.
- **Agent Relay:** agents messaging each other *on screen* via the observer stream, ideally with `steer`.
- **Superserve:** desktop stream, pause/resume with live state, snapshot/fork. Name these on stage.
- **OpenAI:** current APIs (Agents API, GPT-6.x, computer use), not deprecated Assistants or legacy realtime.
- **Mastra:** Agent Controller and sandbox computer use.

Per the event page, judges overall (not only for the grand prize) look for "very well-executed products or incredibly creative use cases using Durable Actors and Agent Relay", with "bonus points if you can do both". Only the top entries demo live. A live multi-agent stage hits "creative." Polish of the status/ledger UI hits "well-executed."

---

## Sources

Browser agents
- https://community.openai.com/t/atlas-is-scheduled-to-stop-working-on-august-9-2026/1389473
- https://help.openai.com/en/articles/20001371-chatgpt-atlas-retirement
- https://www.theverge.com/ai-artificial-intelligence/963654/openai-chatgpt-atlas-ai-browser-shut-down-sunset (Jul 9)
- https://www.theverge.com/ai-artificial-intelligence/1012510/openai-chatgpt-google-chrome-tabs (Oct 15)
- https://www.engadget.com/2288580/open-ai-updates-chatgpt-extension-for-chrome/ (Oct 16)
- https://www.ibtimes.com.au/openai-chatgpt-chrome-extension-computer-use-1876917 (Oct 16)
- https://www.htx.com/news/Research%20&%20Analysis-HIp5gztb/ (Aug 10)
- https://openai.com/index/introducing-chatgpt-atlas/ (background)
- https://claude.com/resources/articles/claude-in-chrome-generally-available (Aug 26)
- https://tech-insider.org/de/claude-in-chrome-vs-gemini-in-chrome-ki-browser-agent-2026/ (Oct 28; conflicting claim)
- https://support.google.com/chrome/answer/16821166
- https://pasqualepillitteri.it/en/news/21970/gemini-chrome-reads-open-tab-by-default (Oct 9)
- https://cyborb.ai/blog/ai-browser-agents (Sep 23)
- https://presenc.ai/research/ai-browser-agent-install-base-2026 (Sep 21)
- https://theroboticsmedia.com/article/perplexity-comet-browser-control-computer-credits-paywall-pro-max-september-15-2026
- https://nudgescout.com/guides/perplexity-september-2026-finance-search-comet (Oct 5)
- https://piunikaweb.com/2026/10/20/perplexity-updates-comet-browser-iphone-duo/
- https://www.techspot.com/downloads/7794-comet.html
- https://www.jonesday.com/en/insights/2026/09/ninth-circuit-vacates-cfaa-injunction-against-perplexitys-comet-ai-agent
- https://deafnews.it/en/news/ai/bragjack-a-malicious-extension-hijacks-five-ai-agents-in-chromium-browsers (Sep 19)
- https://news.ycombinator.com/item?id=48861557 ; https://news.ycombinator.com/item?id=45658479 (background)

Computer use and live views
- https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use
- https://developers.openai.com/api/docs/changelog (Sep 10 Agents API beta; Sep 29 computer use)
- https://openai.com/index/introducing-the-agents-api/ (Sep 10)
- https://help.openai.com/en/articles/20001551-agents-api-beta-faq (scopes, beta header)
- https://developers.openai.com/api/docs/guides/tools-computer-use
- https://developers.openai.com/api/docs/guides/tools-computer-use-sdk-drivers
- https://docs.superserve.ai/sandbox/desktop ; https://docs.superserve.ai/sdk-reference/sandbox ; https://docs.superserve.ai/sandbox/preview-urls ; https://pypi.org/project/superserve/0.11.5/
- https://docs.browser-use.com/cloud/browser/live-preview ; https://docs.browser-use.com/llms-full.txt ; https://browser-use.com/changelog
- https://docs.browserbase.com/platform/browser/observability/session-live-view
- https://www.linkedin.com/posts/browserbasehq_introducing-stagehand-v4-the-sdk-for-browser-activity-7492612137748672512-gGAa (Aug 10)
- https://releases.sh/browserbase ; https://github.com/browserbase/stagehand/releases
- https://mastra.ai/blog/introducing-sandbox-computer-use (via sibling file)
- https://arxiv.org/html/2606.29537v2 (OSWorld 2.0) ; https://leaderboard.steel.dev/leaderboards/osworld-2/
- https://www.simular.ai/alternatives/computer-use-apis (Oct 5)

Generative UI
- https://developers.googleblog.com/fast-reliable-a2ui/ (Oct 27)
- https://developers.googleblog.com/a2ui-and-mcp-apps/ (Jun 17)
- https://developers.googleblog.com/a2ui-v0-9-generative-ui/ (Apr 17)
- https://a2ui.org/introduction/agent-ui-ecosystem/
- https://www.openui.com/blog/state-of-generative-ui-report (Jun 10)
- https://www.copilotkit.ai/blog/bring-mcp-apps-into-your-own-app-with-copilotkit-and-ag-ui (background)
- https://vercel.com/changelog/ai-sdk-7 ; https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0 ; https://github.com/vercel/ai/releases/tag/ai%407.0.0

UX patterns and dashboards
- https://www.northbase.design/patterns/agentic-interface
- https://agentic-ux.com/framework
- https://menuagentic.com/playbooks/agent-ux-and-human-interaction/interruption-and-handoff/
- https://gturitto.github.io/Agentic-Systems-Patterns/book/agent-engineering-practice/agent-ux-and-human-trust/
- https://makeyouragent.ai/blog/agent-ux-patterns-visible-reversible-workflows (Jul 23)
- https://tianpan.co/blog/2026-03-15-designing-the-human-agent-interaction-layer
- https://dl.acm.org/doi/10.1145/3776591.3832499 (Oct 5)
- https://dev.to/orquesta_live/agent-grid-monitor-dozens-of-ai-agents-from-one-screen-4fl6 (Oct 21)
- https://github.com/richdr/stapler-squad ; https://github.com/BKjones83/Hermes-Studio ; https://clawmetry.com/blog/openclaw-mission-control

Hackathon precedents
- https://github.com/RichardHruby/browser-brawl ; https://www.minimax.io/news/minimax-ycombinator-hackathon-building-the-future-of-web
- https://www.linkedin.com/posts/mehul-kalia_we-won-the-y-combinator-x-browser-use-activity-7436518049903493120-sDwo
- https://github.com/jadenseangmany/diamondhacks-2026
- https://github.com/rishabhroyy/traide ; https://www.linkedin.com/posts/paulkleiniv_we-sponsored-uc-berkeleys-ai-hackathon-this-activity-7476310900166062082-RU0j (Jun 26, "107 of ~400 teams")

Sibling research (verified there): `../terse/01-docs-api.md`, `../agent-relay/01-docs-api.md`, `../mastra/02-newest-features.md`, `../superserve/01-docs-api.md`, `../openai/02-newest-features.md`, `../freestyle/01-docs-api.md`.

---

## Verification log (2026-10-29)

An adversarial re-check. Each claim below was re-fetched from a live source while I tried to refute it.

| # | Claim | Source re-checked | Outcome |
|---|---|---|---|
| 1 | Atlas retired; stopped working Aug 9, 2026 | help.openai.com/en/articles/20001371 (says "has been retired", no date shown); Engadget Oct 16 ("retired the product on August 9") | **Confirmed.** The date comes from Engadget plus the community thread; the help page omits it |
| 2 | Claude in Chrome GA on all paid plans, Aug 26, classifier auto-approval as in Claude Code auto mode, can be switched off | claude.com GA article (published 2026-08-26) | **Confirmed** word for word |
| 3 | ChatGPT Chrome extension reads tabs, Work controls tabs, Oct 15-16, all plans, ~7M | Verge (Oct 15), Engadget (Oct 16), IBTimes (Oct 16) | **Confirmed** (press). Added the setup path (desktop app, Work/Codex chat) and Chromium-browser support. The 7M figure is IBTimes reading the store listing |
| 4 | Comet Control-browser moved to Computer credits (4,000 Pro; 35,000 + 10,000/mo Max), Sep 15 | theroboticsmedia.com (Sep 21, updated Oct 28) | **Numbers confirmed in the source**, but the source says Perplexity "has yet to officially document" the change. Caveat added; still [R] |
| 5 | Ninth Circuit vacated the Comet CFAA injunction on Aug 4; the user, not Perplexity, "accesses" | Jones Day alert (Sep 2026) | **Confirmed.** Upgraded R to V (law-firm summary). Added the judge and the record-limited holding |
| 6 | BragJack details | deafnews.it (Sep 19, updated Oct 15) | **Mostly confirmed. Corrected:** "Gemini/Chrome" is Gemini Live in Chrome; the attack is extension-based "Prompt Forcing", not classic page injection; added the Edge CVE-2026-55945. The Gotchas line was reworded so it no longer equates BragJack with prompt injection |
| 7 | Gemini auto browse plan review, Start Task, tab icon, take over, 20/200 per day | support.google.com/chrome/answer/16821166 | **Confirmed.** Wording fixed ("requests", not "tasks"). Added eligibility: US only, 18+, English, gradual rollout |
| 8 | Superserve `getStreamUrl({viewOnly})`, noVNC on port 6080, private URLs signed for 60 s, `step(... waitForChange, format:"jpeg")`, 1280x800 xfce + Chrome | docs.superserve.ai/sandbox/desktop; PyPI JSON (latest 0.11.5) | **Confirmed.** viewOnly is UI-only, per the docs |
| 9 | Browser Use `live_view_url`, `readOnly=true`, `ui=false`, URL is a credential, ~2 min keepAlive 120-14400, 10 free concurrent, default `gpt-6-luna` | live-preview page; llms-full.txt | **Confirmed.** Added the $100 → 50-concurrent tier and the note that samples use `gpt-5.6-luna` |
| 10 | OpenAI Agents API computer use: no live URL, screenshots in `agent.session.turn.item.done`, per-origin approval, beta header, added Sep 29 | developers.openai.com computer-use guide (first 100 KB); API changelog; openai.com Agents API post; Help FAQ | **Confirmed.** Added: `environment.desktop.enabled: true` is required; approval covers public sites too; origin approval does NOT gate individual actions; required key scopes; Agents API beta Sep 10 with no extra fee |
| 11 | Mastra sandbox computer use Sep 2, `@mastra/core@1.62.0`, 11 `computer_*` tools, `.streamUrl()`, E2B Desktop/Daytona | mastra.ai/blog/introducing-sandbox-computer-use | **Confirmed** (upgraded from "via sibling" to direct) |
| 12 | A2UI Express Oct 27, "up to 3x" latency and up to 3x fewer tokens; v0.9 Apr 17; A2UI+MCP Apps Jun 17 | developers.googleblog.com (three posts) | **Confirmed.** Also in the post: decision models (e.g. Jev) claim "up-to 80x"; Express ships in a2ui-agent-sdk 0.9.0 (PyPI), @a2ui/agent (npm) and Dart |
| 13 | AI SDK 7 GA Jun 25 with MCP Apps, tool approvals, `WorkflowAgent`, experimental realtime voice, `stream` rename | vercel.com/changelog/ai-sdk-7 | **Confirmed.** Also: AI SDK 7 requires Node 22 and ESM only, which matters for any scaffold |
| 14 | OSWorld 2.0: 108 tasks, 1.6 h, 318 tool calls, Opus 4.8 at 20.6% | arXiv 2606.29537 abstract | **Confirmed with precision fixes:** 318 is measured on Opus 4.7; 20.6% is at 500 steps with 54.8% partial; GPT-5.5 is ~13% |
| 15 | Browser Brawl won YC x Browser Use (Feb 28-Mar 1), live cloud browser, SSE to Convex | GitHub README + API (21 stars); Mehul Kalia LinkedIn (Mar 8) | **Confirmed.** Added the $100k prize pool. The MiniMax citation was not re-checked |
| 16 | AgentUX won DiamondHacks; trAIde won a Berkeley sponsor prize; Browserbase "107 of ~400 teams" | GitHub READMEs; Paul Klein IV LinkedIn (Jun 26) | **Confirmed.** trAIde corrected: the dashboard was AgentSpan's, and the UI was SMS via Poke |
| 17 | Judging quote attributed to the "grand prize" | EVENT_PAGE.md line 70 | **Corrected:** the quote is the general judging criteria and continues "using Durable Actors and Agent Relay" |
| 18 | Stagehand v4 Aug 10, "2x faster than Playwright, ~80% more token efficient", extension-based | Browserbase LinkedIn post (Aug 10) | **Confirmed** as a vendor claim |

Not re-checked (left as tagged): Claude in Chrome / Cowork (Aug 12), Gemini Android rollout (Aug 18), Comet iOS (Oct 20), AG-UI event count, the Northbase "N of 9" counts, ACM ICMI paper, mission-control dashboard repos, Stagehand `pauseWhen`, and the tech-insider "Beta, Max only" claim (which remains contradicted by the primary source). No fabricated URLs or quotes were found among the items checked.
