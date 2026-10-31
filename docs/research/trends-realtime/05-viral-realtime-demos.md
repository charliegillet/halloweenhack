# Viral real-time AI demos, 2026: what spread, why, how it was built

> Compiled 2026-10-29 for Haunted Hacks (Sat 2026-10-31, 11:00-16:00 build, then live demos). Narrow angle: the real-time AI demos that went viral in 2026, weighted toward Aug-Oct 2026, distilled into a checklist for a 2-minute live demo. Sibling files in this folder cover voice stacks (01), speech/video models (02), and streaming UI / browser agents (04). This file does not repeat their stack comparisons.
>
> Method: Exa search and fetch, WebSearch, `gh api` for live repo stats (fetched 2026-10-29), and one `last30days` run (Sep 30-Oct 30 window). Firecrawl was not used. View counts are as reported by the cited page on its publish date unless marked "gh live". **Verified** means a primary source or live API confirms it. **Reported** means a secondary source states it and I could not open the primary. **Inference** is my own reasoning.

---

## 1. Ranked case studies

### A. Block "Dessa": full-duplex speech-only model (Oct 23, 2026). Biggest reach in the window
- **What it was:** a speech-to-speech model that Block says was trained "from scratch on nothing but human conversation", with no text and no pretrained LM. It listens and talks at the same time, backchannels ("yeah!", "got it!"), and runs faster than real time on an M4 Max MacBook. The demo page is about a dozen live recordings with subtitles added afterward. One clip has Dessa talking to OpenAI's GPT-Live-1. Block also says it was trained on a single NVIDIA GB200 NVL72 rack, and notes OpenAI has not reviewed or endorsed Dessa. (Reported, via [postcutoff.com summary](https://postcutoff.com/e/2026-10-23-block-dessa-speech-only-full-duplex-model/), filed Oct 24, last verified Oct 26, which cites Block's page, The Verge and TechCrunch; re-checked 2026-10-29.)
- **Reach (reported):** Jack Dorsey's launch post had 13.4M views by Oct 26, and Block's own post about 225k in a day ([postcutoff](https://postcutoff.com/e/2026-10-23-block-dessa-speech-only-full-duplex-model/)). An Asmongold reaction clip passed about 1.66M views in 17 hours. In it he stops 29 seconds in to ask "That's AI?" ([Trari](https://trari.com/en/story/asmongoldclips-18996/), 1,661,184 views at time of writing). Note the clip reacts to Dessa lead Ragavan Thurairatnam's X post, not Dorsey's.
- **Why it spread (inference, supported by the reaction clip):** it passes a Turing-style "is that a human?" moment within 30 seconds. The persona has invented life details (a newborn son born October 20th, per [Trari](https://trari.com/en/story/asmongoldclips-18996/)), and those details make it feel uncanny rather than impressive. AI-talks-to-AI is shown as one of the clips. The Verge called it "occasionally a little awkward and uncanny" (quoted via postcutoff).
- **How it was built:** not reproducible. There's a waitlist only, with no weights, paper or benchmarks (reported).
- **Demo lesson:** the hook is that a viewer briefly can't tell it's AI. Natural turn-taking, interruptions and backchannels sell "real-time" better than any latency number.

### B. HeyGen x OpenAI: LiveAvatar + GPT-Live-1 + HyperFrames (Sep 10, 2026)
- **What it was:** an open-source reference stack where a full-duplex GPT-Live-1 voice drives a HeyGen LiveAvatar face, and **each model tool call shows up on screen as an animated overlay**. The default demo is a Japanese tutor: term cards appear as it says each word, and every few words it shrinks to the corner and shows a recap panel built "from the server's own record of the session, not the model's memory" ([repo README](https://github.com/heygen-com/liveavatar-gpt-live-demos)). **Correction:** HeyGen's [Sept blog](https://www.heygen.com/blog/heygen-september-2026-release) says "the repo ships three demos" (tutor, poker coach, support agent), but the repo tree (gh, 2026-10-29) contains only one persona (`server/prompts/greeting.md`, `instructions.md`), and HeyGen's own reply on the launch post says: "Framework plus one demo. Out of the box it's the Japanese tutor. The poker coach and support agent were the same pattern with a different persona and tools, and they didn't ship" ([24vids mirror](https://www.24vids.com/video/realtime-ai-experiences-are-now-solved-and-open-sourcedwe-worked-closely-with-p-tw-2098108031276134776)). Expect only the tutor.
- **Reach (reported):** the HeyGen launch post shows 804,232 views on an X mirror ([24vids](https://www.24vids.com/video/realtime-ai-experiences-are-now-solved-and-open-sourcedwe-worked-closely-with-p-tw-2098108031276134776)). The repo has 247 stars, was created 2026-08-28, and its last push was 2026-09-10 (gh live). The overlay library, `heygen-com/hyperframes` (Apache-2.0, "Write HTML. Render video. Built for agents."), has 75,593 stars and was pushed 2026-10-30 UTC (gh live, re-checked 2026-10-29). The repo is MIT.
- **How it was built (verified, README and AGENTS.md):** a Node + `ws` orchestrator sits between the browser and GPT-Live (v3 contract, `gpt-live-1`). Avatar audio and video go over LiveKit, and the browser never holds an API key. Mic capture is an AudioWorklet producing 24kHz PCM16 with **no client VAD, because the model owns turn-taking**. A turn projector groups transcript deltas because "the API has no turn events" (README; AGENTS.md: "Turns are projected, not received"). **Caveat:** OpenAI's API launch post says GPT-Live-1 "natively supports turn detection, so developers can continue to build around explicit turn boundaries" ([OpenAI](https://openai.com/index/introducing-gpt-live-1-in-the-api/)). The two may describe different layers (detection vs. emitted events); check the current Live API reference before copying HeyGen's projector. Overlays are self-contained animated HTML pages (GSAP) layered over the video, not composited into it.
- **Honest gaps the authors document:** transcripts arrive seconds ahead of the avatar's voice, so visuals timed to a heard word need a playback-position estimate that "we haven't built". Auth, rate limiting and reconnect/resume are "deliberately left out of the starter" (`docs/ARCHITECTURE.md` "Production hardening" list, verified; the "we haven't built" quote is a HeyGen reply on the [24vids mirror](https://www.24vids.com/video/realtime-ai-experiences-are-now-solved-and-open-sourcedwe-worked-closely-with-p-tw-2098108031276134776)). The tutor's memory is session-only: "Nothing survives the session ending" (same thread). That is exactly the gap a Durable Actor fills.
- **Sibling repo:** [liveavatar-hyperframes-demo](https://github.com/heygen-com/liveavatar-hyperframes-demo). You say "animate three orange cats" and a Haiku classifier passes the request to a background Claude Code job that writes `composition.html`, which then fades in over the avatar. It takes **30s-2min** (README: Claude Code reads the skill's reference files first), so the pipeline calls `session.repeat("On it…")` only when a generate job actually fires, and the avatar keeps chatting. That pattern is the useful part. Note this sibling repo uses LiveAvatar's own voice, not GPT-Live, needs a local authenticated Claude Code install, has 2 stars, and LiveAvatar sessions time out at 5 min (README).
- **Demo lesson:** **make tool calls visible.** A voice agent alone is audio-only and hard to judge in a loud room. Showing every action as an on-screen card turns it into something the audience can watch.

### C. Farza's Clicky / HeyClicky (Apr 2026 original, May 30 sequel). Background but canonical
- **What it was:** a small blue animated companion that sits next to your Mac cursor, sees your screen, listens, talks back, and **physically points at the button you need**. The launch demo showed it teaching DaVinci Resolve ([XDA, Apr 19](https://www.xda-developers.com/someone-built-tiny-ai-that-lives-next-to-your-cursor-the-most-useful-thing-ive-tried-this-year/)).
- **Reach (reported):** about 15k likes and nearly 3M views ([XDA](https://www.xda-developers.com/someone-built-tiny-ai-that-lives-next-to-your-cursor-the-most-useful-thing-ive-tried-this-year/)). The May 30 follow-up was a 104-second hands-free voice-control demo on GPT-Realtime 2.0, also reported near 3M views, with Greg Brockman calling it "real magic" ([explainx](https://www.explainx.ai/blog/heyclicky-voice-control-mac-gpt-realtime-2-demo-2026); secondary, quotes not verified at the primary).
- **How it was built:** Claude for reasoning, AssemblyAI for STT, ElevenLabs for TTS (XDA). It was open-sourced as [farzaa/clicky](https://github.com/farzaa/clicky) (MIT; 7,826 stars, created 2026-04-07, pushed 2026-10-28, gh live 2026-10-29). The "next day" timing is (unverified): the repo creation date is known, but I could not open the original X post to date it.
- **Why it spread:** the founder just uses the product for under 2 minutes, with no slides and no feature list. The AI has a body (a cursor-buddy that points). The code was open-sourced soon after (the "24 hours" figure is unverified), which set off a second wave of community ports (inference).

### D. OpenAI `realtime-voice-component`: voice-controlled chess (Apr 28, 2026). Background
- **What it was:** a two-minute demo of playing chess on a webpage by voice only, released with an Apache-2.0 React toolkit. In it, **voice drives app state directly** rather than sitting on top of a chat UI. Reported at 1.3M views in under 24 hours ([Analytics Drift](https://analyticsdrift.com/openai-realtime-voice-component-os-interface/), which also says it is built on gpt-realtime-1.5 and is a reference implementation, not a product). The repo [openai/realtime-voice-component](https://github.com/openai/realtime-voice-component) has 886 stars; last push 2026-04-27, so it is effectively unmaintained since launch (gh live).
- **Demo lesson:** voice is more convincing when it changes something visible on screen (a board, a map, a canvas) than when it produces a transcript.

### E. Multiplayer "one-shot" games on GPT-6 Astra / Opus 5.5 (Sep 2026)
- **Elderwood Realms** (Rohan Varma, Sep 6). He asked GPT-6 Astra in Codex to "build RuneScape" and deploy it to a ChatGPT Site. It reported 3,000 accounts and 1,000+ player-hours in 24 hours, then "accidentally went viral" on r/2007scape, where it drew cease-and-desist calls ([Dexerto](https://www.dexerto.com/gaming/ai-made-runescape-clone-goes-viral-with-playable-browser-version-3406698/)).
- **Astra Attack** (Korean 4v4 browser FPS, Sep 8). An FMKorea repost reached 252,584 views. **The server kept falling over** under the traffic; the creator wrote "too many concurrent players, the server keeps falling over". The "~40 players" figure is only a commenter's "40 concurrent players, seriously?", posted about two minutes before the creator's crash post. Terapep does not report a measured peak. The most-reported complaint was the client waiting on the server for every input instead of predicting locally. An ESP was "reportedly built within a day", and the game has no anti-cheat ([Terapep](https://www.terapep.com/blog/astra-attack-ai-browser-fps-2026/)). Terapep also argues it was not a one-shot (its credits file documents ported open-source maps).
- **"26 Opus 5.5 agents built a game overnight"** (jacob, about Sep 23, built on "spawn"). A multiplayer heist through nested worlds, reported at 231,942 views. The hook in the replies: "say 'add go-karts' mid-game and they roll in while your friends are still running around." jacob's own reply: "Play it in your browser with your friends, on a phone or a computer. No download, no account". A reply from another user: "Multiplayer turns agent coordination from a toy into the actual product" ([24vids mirror](https://www.24vids.com/video/i-had-26-opus-55-agents-build-a-game-overnightits-a-heist-through-five-nested-p-tw-2102862008467194151)).
- **Why it spread (inference):** a link the audience can join right now, with no login, plus the shared-world feeling. The failures (server crashes, cheats) became part of the story, but they would sink a live demo.
- **Demo lesson:** "**scan the QR and join**" is the strongest audience hook in this set, but only if your state layer survives 30-100 people joining at once. That is the case for Durable Actors.

### F. Real-time world models: watch the AI generate a world you steer (May-Oct 2026)
- **Reactor** real-time world model demo (red car in an alien desert), reported at 7.8M views (May 11, background; [Gate News](https://www.gate.com/news/detail/reactor-launches-real-time-world-model-demo-garnering-78-million-views-21000407)).
- **Runway GWM Worlds 2** (Sep 3): 720p, 24fps video plus 48kHz audio generated live and steered by text actions bound to keys. Runway's demo binds "key and mouse inputs to premade prompts" and says "the ahead-of-time method produces better quality, because the text prompts can describe much more of the scene". It is a research preview with a contact form and no public API on the page ([Runway](https://runway.com/research/introducing-gwm-worlds-2), verified).
- **Helix World** (Oct 12): audio-visual world model at 24fps on one H800, where input takes effect from the next chunk of about 1.3s ([noiz.ai](https://noiz.ai/lp/blog/meet-helix-world)). **AlayaWorld** browser demo (Aug 20 date unverified; [GitHub](https://github.com/AlayaLab/AlayaWorld) repo created 2026-07-07, 802 stars, pushed 2026-10-28, gh live). Solo builder lucidml shipped a ~960M-param model with "add a pond" prompt switching mid-rollout on an RTX 5090 (Oct 6, [HF blog](https://huggingface.co/blog/lucidml/jointmodel)).
- **Hackathon fit:** low. These need GPUs and the APIs are not public. The transferable trick is **text actions bound to keys or buttons**, with presets scripted ahead of time because they look better live.

### G. Agents-in-public experiments (Sep-Oct 2026)
- **World Zero:** five agents (two Claudes, three GPTs) got an empty folder, a Bluesky account and an inbox, and were told to get 10,000 people to spend 30 seconds on a site. The live page shows each agent's panel synced from "their shared message board and Git history". After the first 24-hour window it had **two qualified visitors**, and the deadline was extended to Oct 4 ([live page](https://world-zero-viral-001.world-zero-viral-001-089.workers.dev/control/)).
- **Rooted Echo Dot to a "Chief of Staff" agent** (Oct 23). Grok realtime voice on a hacked Echo Dot asks a fleet of 30+ sub-agents for a sit-rep and reads it back aloud. It had only 1,614 views on the repost, but it is close to the hackathon's Agent Relay theme ([note](https://ralmodiel.github.io/ai-study-library/notes/07-agents/2026-10-23-using-a-rooted-echo-dot-as-a-realtime-voice-interface-to-an.html)).
- **Lesson (inference):** a visible board of agents talking to each other is a strong format. An outcome that depends on strangers showing up is risky. World Zero's honest "2 visitors" counter is a cautionary tale.

### H. Platform launch reference points (context for the OpenAI sponsor)
- **GPT-Live** launched Jul 8 in ChatGPT ([OpenAI](https://openai.com/index/introducing-gpt-live/); SynthID audio watermarking added Jul 31) and reached the API on **Sep 10** at **$0.05/min**, billed per second, for the voice layer (endpoint `v1/live/sessions`; it is *not* on `v1/realtime`; no image/video input; Free tier unsupported). Reasoning and tools are delegated to a backend model, and smooth interruption is the headline feature, with Speak reporting interruptions cut "by almost 80%" ([OpenAI](https://openai.com/index/introducing-gpt-live-1-in-the-api/); [model page](https://developers.openai.com/api/docs/models/gpt-live-1): concurrent-session limits are Build 50 / Launch 300 / Grow 500, verified 2026-10-29). OpenAI's own launch video is a scripted interruption gag ("Wait, you were saying I don't have to worry about interruptions anymore?") plus a robot arm and display driven via delegation ([YouTube transcript](https://www.youtube.com/watch?v=OSaP6bJoU44)).
- The Oct 16 prompt-to-voice launch (nine new preset voices, voices from a text prompt; adult voices only) did comparatively poorly: 122K views (121,675), 0.5x the 233K directory median ([launchvideo.com](https://www.launchvideo.com/directory/openai-gpt-live-voices)). **Inference:** feature announcements spread less than demos of someone using the product.

---

## 2. Cross-cutting patterns: why these spread

| Pattern | Evidence | Strength |
|---|---|---|
| "Wait, that's AI?" moment in the first 30s | Dessa / Asmongold "That's AI?" at 0:29 | Verified via reaction clip |
| Founder just uses it for under 2 min, no slides | Clicky (104s), OpenAI chess (2 min) | Reported, multiple |
| AI acts on visible state (cursor points, board moves, cards appear) | Clicky, chess, HeyGen overlays | Verified (repos) |
| Interruption / barge-in shown on purpose | OpenAI GPT-Live launch script; Speak's ~80% fewer interruptions claim | Verified (OpenAI) |
| Audience can join live (link or QR, no login) | Elderwood 3k accounts/24h, Astra Attack, spawn heist | Reported |
| Change the world mid-session by voice or text ("add go-karts", "add a pond") | spawn heist, lucidml, GWM Worlds 2 | Reported |
| Open-source within 24h makes a second wave | Clicky (7.8k stars), HeyGen stack | Verified (gh) |
| Uncanny / slightly creepy beats polished | Dessa invented persona; Verge "uncanny" | Reported |
| Honest failure is fine on X, fatal on stage | Astra Attack server falls over; World Zero 2 visitors | Reported |

**Anti-signal (Sep 30-Oct 30 social pulse):** the highest-engagement real-time AI thread in the `last30days` window was about privacy, not a demo. On [r/singularity](https://www.reddit.com/r/singularity/comments/1xduimx/hacker_reverse_engineers_his_samsung_tv_and_finds/) (Oct 24), a post relayed researcher log4j's claim of an always-on listening service in a 2025 Samsung TV; log4j also said OpenAI banned his account over the reverse-engineering work, which is why OpenAI appears in the thread. The 17.8k score and the 2,056-upvote top comment are (unverified): Reddit returned errors on re-check. The story was covered by [Tom's Hardware](https://www.tomshardware.com/tech-industry/cyber-security/hacker-finds-own-samsung-tv-collecting-scary-amounts-of-user-information-and-gets-banned-by-openai-for-cyber-abuse-tv-runs-an-ai-model-that-collects-audio-screenshots-and-plenty-of-other-user-data-for-ad-targeting) (Oct 25) and [Malwarebytes](https://www.malwarebytes.com/blog/privacy/2026/10/samsung-tvs-without-mics-may-listen-through-soundbars-researcher-says) (Oct 27). Both note the claims are not independently verified and that Samsung openly markets mic-based Pet Care / Family Care sound detection. **Implication:** an always-on mic or camera demo needs a visible consent and indicator affordance, or the room's first reaction will be "creepy" in the bad sense.

**Latency bar:** [@kwindla](https://x.com/kwindla/status/2112943539214803218) (Pipecat, Oct 21; X unreadable, text verified via [LinkedIn copy](https://www.linkedin.com/posts/kwkramer_our-friends-at-modal-shipped-a-new-sticky-activity-7518710443616481280-rg6m)) says you can build voice agents with **500ms voice-to-voice** response times, "But this is 3-4x faster than most of the voice agents we see in production." The demo was a cascaded stack (Qwen 3 ASR, PhoneLLM Mini, Gradium Phonon TTS on CPU, Pipecat, Modal Sticky Sessions), repo `modal-projects/modal-phonon-voice-bot`. Anything near 2s will feel broken next to GPT-Live-class demos.

---

## 3. Halloween-specific precedent (this week)
- **SpookyKit** (Oct 27): LiveKit voice agents plus Fish Audio Drama 3 multi-speaker voices for an interactive seance with fictional spirits ([AICrier](https://aicrier.com/post/zh9ok2vknqwifpvr8no1)).
- **The Haunted AI Mirror** (Oct 27): webcam shader effects plus multimodal mood reading plus spoken gothic prophecies ([dev.to](https://dev.to/prabu_sp/the-haunted-ai-mirror-2h4m)). **Spooky Spirit Board** uses in-browser Transformers.js ([dev.to](https://dev.to/yash_oberio_dd70b64b7f609/i-built-a-haunted-spirit-board-that-talks-back-hacktoberfest-week-4-ied)). **Frustrated Box** is an offline Pipecat Halloween prop with a volume-gated barge-in mic ([GitHub](https://github.com/podstawek/frustratedbox)).
- **Inference:** a single-player "talk to a ghost" app is already a crowded idea, with at least four this week. What none of them have is multiplayer and multi-agent: several ghost agents that talk to each other, remember the room, and react to what the whole audience does.

## 4. Recent hackathon winners in the same space (Oct 2026)
- Anthropic x Cresta "Voice Mode On" (SF Tech Week): "Most Creative Voice Agent" went to a multilingual agent that switches languages mid-conversation. The team validated the idea live with a real business owner ([LinkedIn](https://www.linkedin.com/posts/divya-chandana-75b27438_sftechweek-anthropic-cresta-activity-7514220792017063936-RmK0)).
- Crusoe x Cerebral Valley Recursive Agents: 1st place ($14k) went to **Etch**. You say one sentence, agents produce a routed KiCad board, and it is verified with ERC/DRC/ngspice before it is called done ([pranavachar.com](https://pranavachar.com/etch)). The pattern: voice in, agents work, and a verifiable artifact comes out.
- Alebex Vancouver: the winner was a voice game with six office characters. Their write-up: "The strongest ideas gave people a reason to speak" ([Alebex](https://www.alebex.ai/blog/vancouver-voice-ai-hackathon-2026)).
- AssemblyAI lablab: 501 submissions, and the top community vote was an emotional-companion voice app ([lablab](https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon/live)). Voice-only apps are common, so differentiation matters.

---

## 5. The "demo wow" checklist (2-minute live demo)

**Structure (about 120s):**
1. **0-10s, hook with no explanation.** Start talking to the thing. The first sentence the audience hears should be the AI responding, not you describing it. (Clicky, Dessa)
2. **10-40s, one "is that real?" beat.** Interrupt it mid-sentence on purpose and let it recover naturally. Interruption is the defining real-time move of 2026. (GPT-Live launch script)
3. **40-75s, visible action.** Every tool call or agent message shows up on screen as a card, overlay or board update. Judges should be able to follow with the sound off. (HeyGen overlays, chess)
4. **75-100s, audience participation.** Put a QR or short URL on screen and have the room join a shared session. Show the counter going up and their inputs changing the world. (Elderwood, spawn "add go-karts")
5. **100-115s, the durability flex.** Kill a tab or refresh the server and show the state survives and the agents pick up where they left off. That is the Durable Actors pitch in one gesture. Show agent-to-agent messages scrolling in a side panel for Agent Relay.
6. **115-120s, one-line close.** Say what it is, the two sponsor primitives it uses, and that it's live at the URL.

**Hard rules:**
- [ ] Voice-to-voice latency under about 1s, measured on venue Wi-Fi. Bring a phone hotspot. (500ms is the stated bar, per @kwindla)
- [ ] Any slow job (over 3s) has a spoken or visual "on it..." filler, and the conversation keeps going. (HeyGen hyperframes pattern, GPT-Live delegation)
- [ ] Bind the risky actions to buttons with pre-written prompts. Live free-text is a fallback, not the main path. (Runway's ahead-of-time note)
- [ ] Use a headset or a directional mic. Noisy-room barge-in fails with laptop mics (Frustrated Box needed a volume gate).
- [ ] Load-test with 50+ fake clients beforehand. Astra Attack's server kept falling over under its first traffic spike (a commenter cited ~40 concurrent players; no measured peak).
- [ ] Rate-limit and moderate audience input. Elderwood needed "lots of content moderation" on day 2.
- [ ] Show a visible mic-on / camera-on indicator. Avoid the Samsung-TV "creepy" reaction.
- [ ] Record a 2-minute backup video before 3:30pm in case the venue network dies.
- [ ] Get the uncanny moment in early. A persona with a backstory (Dessa's "newborn son") gets a stronger reaction than a neutral assistant.

---

## Hackathon implications

**What to build (inference, ranked):**
1. **Multiplayer haunted house / seance run by a coven of agents.** Each ghost is a Durable Actor with persistent memory of the room. The ghosts gossip and coordinate through Agent Relay, shown in a live side panel. The audience joins by QR and speaks or taps, and one GPT-Live voice narrates. This hits both sponsor primitives, is real-time, fits Halloween, and supports the audience-join hook. It covers the multiplayer gap the four single-player ghost apps miss (section 3).
2. **"Exorcise the codebase."** You speak a request, a relay of agents (inspector, fixer, verifier) work in Freestyle sandboxes, every step shows as an animated card, and the result is a verified artifact. This is the Etch pattern with a Halloween theme. Better for judges who prefer "well-executed product", weaker on audience participation.
3. **Ghost-in-the-cursor companion (Clicky-style) that summons sub-agents.** It has a strong precedent but is single-user, and judges may see it as derivative of Clicky.

**What judges and sponsors want (from the event page plus this research):** use of both Durable Actors and Agent Relay (stated bonus). The durability needs to be visible, not just claimed, so do the refresh/kill demo. Supabase's "scale to millions" prize suggests showing many concurrent joiners with a live counter. OpenAI credits ($100 each) cover about 2,000 GPT-Live voice-layer minutes per person at $0.05/min, with backend tokens extra, so cost is not the constraint. The Build tier's **50 concurrent GPT-Live sessions** is the constraint. **Use one narrator voice session, not one per audience member.**

**Setup before Oct 31 (ideas are allowed beforehand; code must be written at the event):**
- Confirm OpenAI org access to `gpt-live-1` and run the HeyGen `liveavatar-gpt-live-demos` quickstart once to learn the v3 wire format. Don't fork it on the day: code must be new. Read `server/src/gptlive.ts` and `turns.ts` for the patterns (HeyGen projects turns from transcript deltas; the model owns VAD). The repo ships only the Japanese tutor persona, not the poker or support demos.
- Pick a fallback voice path (gpt-realtime or STT-LLM-TTS) in case GPT-Live access fails. GPT-Live-1 lives on `v1/live/sessions` and is listed as *not supported* on `v1/realtime`, so existing Realtime-API code and `openai/realtime-voice-component` (built on gpt-realtime-1.5) will not drive it unchanged. The Free usage tier is unsupported, so confirm your org is at least on the Build tier before Saturday.
- Prepare headset, hotspot, a QR code generator, and a load-test script plan (k6 or a simple ws spammer).
- Write the 2-minute script and the "interrupt it" line in advance, and pick 4-6 button-bound prompts.
- Read the Terse Durable Actors quickstart and Agent Relay docs (covered by other research files).

**Gotchas:** transcripts lead audio by seconds (HeyGen), so don't sync visuals to transcript timestamps. Expect browser autoplay and mic permission prompts on audience phones, so make audience input tap-first and voice optional. Don't use voice cloning of real people (GPT-Live usage policy prohibits impersonation, per [launchvideo.com summary](https://www.launchvideo.com/directory/openai-gpt-live-voices)).

---

## Limits / could not verify
- X/Twitter could not be read directly. Every X view count here comes from mirrors (24vids, fxtwitter via postcutoff, launchvideo.com) or press. I did not open the original X posts for Dessa, HeyGen, Clicky or the spawn heist.
- Dessa claims are entirely Block's own, relayed through one secondary aggregator. I did not open Block's page, The Verge or TechCrunch directly.
- Quotes attributed to Greg Brockman and YC partners about HeyClicky come from one secondary blog (explainx) and are unverified.
- The `last30days` run was thin: 6 Reddit threads, 1 X post, 0 YouTube, 0 HN (Reddit public API returned 403). TikTok and Instagram were not configured. Social sentiment coverage for Oct 2026 is therefore weak, and short-video platforms may hold viral demos this file misses.
- I could not find a Terse- or Agent-Relay-specific viral demo in the window. Other files cover the hosts.
- Hackathon-winner details come from self-reports on LinkedIn and personal sites.

## Sources
- https://postcutoff.com/e/2026-10-23-block-dessa-speech-only-full-duplex-model/
- https://trari.com/en/story/asmongoldclips-18996/
- https://github.com/heygen-com/liveavatar-gpt-live-demos (+ AGENTS.md)
- https://github.com/heygen-com/liveavatar-hyperframes-demo
- https://www.heygen.com/blog/heygen-september-2026-release
- https://docs.liveavatar.com/docs/guides/gpt-live-language-tutor
- https://www.24vids.com/video/realtime-ai-experiences-are-now-solved-and-open-sourcedwe-worked-closely-with-p-tw-2098108031276134776
- https://www.xda-developers.com/someone-built-tiny-ai-that-lives-next-to-your-cursor-the-most-useful-thing-ive-tried-this-year/
- https://www.explainx.ai/blog/heyclicky-voice-control-mac-gpt-realtime-2-demo-2026
- https://github.com/farzaa/clicky
- https://analyticsdrift.com/openai-realtime-voice-component-os-interface/
- https://github.com/openai/realtime-voice-component
- https://www.dexerto.com/gaming/ai-made-runescape-clone-goes-viral-with-playable-browser-version-3406698/
- https://www.terapep.com/blog/astra-attack-ai-browser-fps-2026/
- https://www.24vids.com/video/i-had-26-opus-55-agents-build-a-game-overnightits-a-heist-through-five-nested-p-tw-2102862008467194151
- https://www.gate.com/news/detail/reactor-launches-real-time-world-model-demo-garnering-78-million-views-21000407
- https://runway.com/research/introducing-gwm-worlds-2
- https://noiz.ai/lp/blog/meet-helix-world
- https://github.com/AlayaLab/AlayaWorld
- https://huggingface.co/blog/lucidml/jointmodel
- https://world-zero-viral-001.world-zero-viral-001-089.workers.dev/control/
- https://ralmodiel.github.io/ai-study-library/notes/07-agents/2026-10-23-using-a-rooted-echo-dot-as-a-realtime-voice-interface-to-an.html
- https://openai.com/index/introducing-gpt-live/
- https://openai.com/index/introducing-gpt-live-1-in-the-api/
- https://developers.openai.com/api/docs/models/gpt-live-1
- https://www.youtube.com/watch?v=OSaP6bJoU44
- https://www.launchvideo.com/directory/openai-gpt-live-voices
- https://www.reddit.com/r/singularity/comments/1xduimx/hacker_reverse_engineers_his_samsung_tv_and_finds/
- https://x.com/kwindla/status/2112943539214803218
- https://aicrier.com/post/zh9ok2vknqwifpvr8no1
- https://dev.to/prabu_sp/the-haunted-ai-mirror-2h4m
- https://dev.to/yash_oberio_dd70b64b7f609/i-built-a-haunted-spirit-board-that-talks-back-hacktoberfest-week-4-ied
- https://github.com/podstawek/frustratedbox
- https://www.linkedin.com/posts/divya-chandana-75b27438_sftechweek-anthropic-cresta-activity-7514220792017063936-RmK0
- https://pranavachar.com/etch
- https://www.alebex.ai/blog/vancouver-voice-ai-hackathon-2026
- https://lablab.ai/ai-hackathons/assemblyai-voice-agent-hackathon/live
- https://www.linkedin.com/posts/kwkramer_our-friends-at-modal-shipped-a-new-sticky-activity-7518710443616481280-rg6m
- https://www.tomshardware.com/tech-industry/cyber-security/hacker-finds-own-samsung-tv-collecting-scary-amounts-of-user-information-and-gets-banned-by-openai-for-cyber-abuse-tv-runs-an-ai-model-that-collects-audio-screenshots-and-plenty-of-other-user-data-for-ad-targeting
- https://www.malwarebytes.com/blog/privacy/2026/10/samsung-tvs-without-mics-may-listen-through-soundbars-researcher-says
- https://github.com/heygen-com/liveavatar-gpt-live-demos/blob/main/docs/ARCHITECTURE.md
- /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md

## Verification log (2026-10-29)

Adversarial re-check of the claims most likely to affect build decisions. Methods: `gh api` (live), Exa fetch, WebFetch, Exa search. Outcomes: **Confirmed**, **Corrected**, **Unverified**.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | GPT-Live-1 in API Sep 10, $0.05/min, Build tier 50 concurrent sessions | OpenAI API post + model page fetched | **Confirmed**. Added: billed per second, endpoint `v1/live/sessions` (not `v1/realtime`), Free tier unsupported, Launch 300 / Grow 500 |
| 2 | GPT-Live launched in ChatGPT Jul 8 | openai.com/index/introducing-gpt-live | **Confirmed** (plus Jul 31 SynthID update) |
| 3 | Speak "~80% fewer interruptions" | OpenAI API post | **Confirmed** ("by almost 80%") |
| 4 | HeyGen repo stars/dates (247, created 2026-08-28, pushed 2026-09-10) | gh api | **Confirmed**; license MIT |
| 5 | HeyGen repo ships three demos (tutor, poker, support) | Repo tree + HeyGen reply on launch post | **Corrected**: only the tutor ships; HeyGen's own blog overstates it |
| 6 | README quotes ("not the model's memory", "no turn events", 24kHz PCM16, no VAD, Node + ws, LiveKit, no API key in browser) | README + AGENTS.md via gh | **Confirmed**. Added caveat that OpenAI says GPT-Live "natively supports turn detection" |
| 7 | Transcripts lead audio; auth/rate-limit/reconnect left out; "haven't built" quote | ARCHITECTURE.md + 24vids replies | **Confirmed**; attribution sharpened |
| 8 | hyperframes 75,562 stars | gh api | **Corrected** to 75,593 (drift); Apache-2.0 |
| 9 | Sibling hyperframes demo: Haiku classifier, Claude Code, 30s-2min, "On it..." | Sibling README via gh | **Confirmed**; added that it uses no GPT-Live, has 2 stars, 5-min session timeout |
| 10 | farzaa/clicky 7,823 stars, created 2026-04-07; open-sourced "next day" | gh api; XDA | Stars **corrected** to 7,826 (drift); creation date confirmed; "next day / 24h" **Unverified** |
| 11 | Clicky ~15k likes, ~3M views (XDA) | XDA fetched | **Confirmed** as reported by XDA |
| 12 | Brockman "real magic" quote | explainx only | **Unverified** (secondary only, as already flagged) |
| 13 | openai/realtime-voice-component 886 stars, 1.3M views in 24h | gh api; Analytics Drift | **Confirmed** (views as reported); added last push 2026-04-27 |
| 14 | Dessa Oct 23, Dorsey post 13.4M views, Block post ~225k, Verge "uncanny" quote, no weights/paper | postcutoff fetched | **Confirmed as reported** (primary X/Block/Verge not opened) |
| 15 | Asmongold clip ~1.66M views, "That's AI?" at 0:29, newborn son Oct 20 | Trari fetched | **Confirmed** (1,661,184); noted the clip reacts to Thurairatnam's post |
| 16 | HeyGen launch post 804,232 views | 24vids mirror | **Confirmed as reported by mirror** |
| 17 | Spawn heist 231,942 views, "add go-karts" quote, "Multiplayer turns..." reply | 24vids mirror | **Confirmed**; clarified the go-karts line is jacob's, the "Multiplayer" line is a third-party reply |
| 18 | Elderwood 3,000 accounts / 1,000+ hours in 24h, r/2007scape, "lots of content moderation" | Dexerto | **Confirmed** (Varma's self-report via Dexerto) |
| 19 | Astra Attack 252,584 views; server died at ~40 players; netcode complaint; ESP within a day | Terapep | Views and complaints **confirmed**; "~40" **corrected** to a commenter's remark, not a measured peak |
| 20 | Runway GWM Worlds 2 Sep 3, 720p/24fps/48kHz, key-bound prompts, ahead-of-time looks better | Runway page | **Confirmed**; added research-preview / no public API |
| 21 | kwindla 500ms, "3-4x faster" | LinkedIn + X mirror (X itself unreadable) | **Confirmed**; wording tightened to the exact quote |
| 22 | r/singularity Samsung thread 17.8k points, 2,056-upvote comment quote | Reddit fetch failed; press coverage found | Score and comment **Unverified**; underlying story confirmed via Tom's Hardware / Malwarebytes, with "claims not independently verified" caveat added |
| 23 | World Zero: 5 agents, 2 qualified visitors, deadline Oct 4 | Live page | **Confirmed** |
| 24 | Etch 1st place, $14k, Crusoe x Cerebral Valley, ERC/DRC/ngspice | pranavachar.com | **Confirmed** (self-reported) |
| 25 | Event facts used in implications ($100 OpenAI credits, code written at event, track prizes) | EVENT_PAGE.md | **Confirmed**. Note the Durable Actors prize is listed as an "iPhone Duo" |
| 26 | launchvideo.com 122K views, 0.5x median; impersonation prohibited | launchvideo.com | **Confirmed** |

Not re-checked (lower decision weight): SpookyKit, Haunted AI Mirror, Spirit Board, Echo Dot note, Helix World, lucidml, Reactor 7.8M, Alebex, lablab, LinkedIn Cresta post. `podstawek/frustratedbox` exists (gh: MIT, 3 stars, created 2026-08-20, described as an offline Raspberry Pi 5 Halloween prop). The AlayaWorld "Aug 20" date is unverified; the repo was created 2026-07-07.

