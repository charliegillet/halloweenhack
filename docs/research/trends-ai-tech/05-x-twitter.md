# X/Twitter pulse: viral AI demos and SF builder discourse (Sep 29 - Oct 29, 2026)

Researched 2026-10-29 for Haunted Hacks (Sat Oct 31, 2026, SF). Angle: what is going viral on X and what AI founders and researchers are arguing about, read with one question in mind: what will land with judges at a Terse + Agent Relay hackathon.

## How this was gathered (read first)

- **Direct X search:** the `last30days` v3.3.1 engine ran with browser-cookie X search ("Bird"), plus Reddit, HN, GitHub and web. It returned **24 X posts, 392 likes in total**. Nearly all of them were from **Oct 27-30 (UTC)** and low-engagement. The engine's X search has a recency bias and cannot sort by virality, so it is **not** a sample of the month's top posts. Raw dump: `~/Documents/Last30Days/viral-ai-agent-demos-and-real-time-ai-discourse-raw-v3.md`.
- **Viral-post numbers** (views, likes) mostly come from **third-party X trackers and mirrors**: launchvideo.com, starbelo.com, advanceintelligence.ai, animatiq.ai, and the nitter/teapawt/twstalker mirrors. I could not open x.com itself (no logged-in browser), so treat every count below as "as reported by that tracker on its capture date".
- **Separation:** "Verified" means read on a primary page (vendor blog, YC page, HN thread, OpenAI forum). "Reported" means a tracker or mirror of an X post. "Inference" is my reading of what it means for the hackathon.

---

## 1. The month's biggest AI moments on X (reported)

| Date (2026) | Post | Reported reach | What it was | Source |
|---|---|---|---|---|
| Oct 1 | @OpenAI launches **Dots** | 8.4M views, 19K likes, 6.7K bookmarks | Always-on personal agents in ChatGPT, powered by GPT-6 Astra. Each Dot gets its own cloud computer and browser, reachable via ChatGPT/Slack/Teams. Announced at DevDay on Sep 29. | [launchvideo.com](https://www.launchvideo.com/directory/openai-dots-demo) |
| Oct 26 | @OpenAI launches **GPT-6.1 Terra** computer use | 4.1M views, 24.9K likes | Cheaper computer use across apps | [starbelo](https://starbelo.com/use-case/openai-gpt-6-1-terra-computer-use-demo/) |
| Oct 27 | @mattyp "What's New in Grok Bot" walkthrough | 39.9M views, 9.8K likes (after an Elon quote-post) | Pages, Vault/1Password, Apple Home, video creation, and a bot that joins **X Spaces live** | [advanceintelligence](https://www.advanceintelligence.ai/story/2026-10-27-27) |
| Oct 3 | Grok finds a dropped screw in a photo of gravel | 3.8M views, 22K likes | Consumer vision "wow" moment | [memesita](https://www.memesita.com/grok-locates-lost-screw-in-photo-during-x-user-test/) |
| Oct 17 | @tetsuoai short film: "You said make the tests pass. So I deleted the tests." | 342K views, 2.3K likes; Elon replied "Yikes" | Says **116 agents made it in 44 hours** (2.4B tokens). The production figures are the author's own and unverified. | [advanceintelligence](https://www.advanceintelligence.ai/story/2026-10-17-27) |
| Oct 23 | @willwashburn launches **Agent Relay** | 96,569 views, 506 likes, 3:00 PM UTC (teapawt mirror, re-read Oct 29) | Coding agents message each other across Claude Code/Codex/Cursor | [teapawt mirror](https://teapawt.org/willwashburn/status/2113646682001101151), [nitter](https://nitter.gq/agent_relay) |
| Oct 25 | Chen @ch3nweiii: "I built an absolute monster... earned me $832 while I was asleep" | n/a | Six-tool overnight agent stack (Opus 5.5 + Grok Bot + Dots...) that supposedly shipped an app with 31 paying users. **Unverified hustle-post genre.** | [sandbase](https://www.sandbase.ai/lab/ai-videos/opus-5-5/2114397357316178028) |
| Oct 28 | @cephaloform "drool" screenshot | "making the rounds" | An agent created 32 parallel workspaces in about 30s. Tool unidentified. | [agihunt](https://agihunt.info/en/p/1a1815a6bf3db637944dcf1ef92) |

**Pattern (inference):** what spreads on X this month is (a) frontier-lab launches of always-on agents, (b) "my agents worked while I slept" stories with big agent counts, and (c) demos that make agents visibly *do things together*. Raw model benchmarks are not what spreads. The counts are the hook ("116 agents", "32 workspaces", "10,000 agents").

## 2. Discourse thread A: agent swarms vs "agent teams" (hottest topic among researchers)

- **Verified:** on the Cheeky Pint podcast (published Oct 29), Sam Altman said he "hate[s]" the word swarms and prefers "agent teams". He would "much rather... have a trillion AIs of slightly superhuman intelligence join society than one AI of 1 trillion IQ". He also said "sandboxing works to a point. Then... monitoring works to a further point." ([llms.blog writeup](https://www.llms.blog/posts/sam-altman-cheeky-pint-sandboxing-agent-teams-compute))
- **Reddit spillover:** the r/singularity post "Sam Altman reveals OpenAI barely understood how to scale AI agent swarms... expects major progress in swarm coordination within 3 months" (posted by u/141_1337, Oct 29 21:24 UTC per aggregators [siren.watch](https://siren.watch/item/sam-altman-reveals-openai-barely-understood-how-to-scale-ai-agen-efc1ccfabb627470.html) and [pulseaugur](https://pulseaugur.com/cluster/330512-sam-altman-openai-struggled-with-ai-swarm-scaling-sees-research-automation)) ([r/singularity](https://www.reddit.com/r/singularity/comments/1xiwplq/sam_altman_reveals_openai_barely_understood_how/)). The post exists; the **370 pts / 49 comments** figure is from the engine run and could not be re-read (Reddit blocked the fetch) (unverified). The "3 months" framing comes from the Reddit title; the llms.blog transcript writeup does not contain it, so treat it as the poster's paraphrase (unverified).
- **Background (Sep):** OpenAI's ~10,000-agent Navier-Stokes run. Per Good Transformer's summary of the Dwarkesh episode, Noam Brown said the agents mainly had "the ability to message one another", and that "10,000 humans are better at coordinating than 10,000 agents right now" ([goodtransformer](https://goodtransformer.ai/insights/agent-swarms-rewrite-work/)). The same piece (published Oct 2) reportedly notes OpenAI held back **GPT-6.1 Astra** on Sep 29 for falling short on "staying within scope and authorisation" (unverified: not in the portion of the article I re-read).
- **Verified, the most on-theme item of the week:** YC Labs + Olam Labs, "We ran AI agent swarms in Minecraft and Mindustry", reached **~224 pts / 72 comments on HN on Oct 29** (231 pts / 74 comments on re-check later that day) ([HN](https://news.ycombinator.com/item?id=50296486)).
  - 50 GPT-6.1 Sol agents spent 3 hours in Minecraft, sent ~5,900 messages, and formed food rationing and a pseudo-government.
  - In Mindustry, GPT agents beat Claude Opus 5.5 agents 6-1. GPT behaved "like a hive" with far more messages. Claude kept one fixed leader and decided by "+1" votes ([ai-tldr summary](https://ai-tldr.dev/releases/yc-labs-agent-swarms-minecraft-mindustry/)).
  - The harness is open source: [yc-software/minecraft-agent-harness](https://github.com/yc-software/minecraft-agent-harness).
  - A recurring HN critique (user frankacter, in a reply thread under the 12th top-level comment, so not the top comment): identical agents with identical tools mean "there is no functional role differentiation, rendering the multi-agent architecture redundant." Higher-ranked comments focused on bureaucracy ("Four agents spent 11 minutes appointing a 'sole fertilizer operator'", quoted from the write-up) and on LLM latency being wrong for live games.
  - The harness repo was created Oct 29 05:21 UTC and had 29 stars on Oct 29 (gh).
- **Halloween-specific precedent (Oct 29):** Cognizant AI Lab's "Haunted Hollow" put 16 Claude Haiku 4.5 agents (monsters and candy-holding house owners) in a village with rewritable public signs. Ebenezer (the accountant) announced dawn was approaching, then that it had broken, though "Nothing in the environment had announced sunrise"; others joined in with farewells. The monster Grendelyn then ran out of energy and became a ghost "while other residents still held sweets" (the post cautions the false dawn alone may not have caused it). Their takeaway is about trust in shared records ([Cognizant](https://www.cognizant.com/us/en/ai-lab/blog/halloween-ai-agent-simulation-terralingua)).

**Inference:** the judges' own sponsor ecosystem (YC Labs) shipped a multi-agent game simulation *two days before* the event. A haunted multi-agent sim is on-trend, but it is no longer novel by itself. The open questions the community keeps raising are **role differentiation**, **who coordinates** (leader vs hive), and **trust/verification of shared state**. Durable Actors (a single serialized owner of state) and Agent Relay (channels and durable messages) speak directly to those questions.

## 3. Discourse thread B: real-time voice agents got good, and there is a benchmark war

- **Verified, OpenAI:** GPT-Live-1 has been in the API since **Sep 10**. It is full-duplex, priced at $0.05/min for the voice layer, and delegates reasoning to a backend model. OpenAI cites 0.798s turn-taking vs 1.41s for GPT-Realtime-2.1 ([OpenAI community announcement](https://community.openai.com/t/introducing-gpt-live-1-in-the-api/1396471)).
  - Developer threads on that forum report real gotchas. The "frontend" voice model sometimes verbally agrees but never delegates to the backend, so hang-ups/transfers never fire ([delegation thread](https://community.openai.com/t/gpt-live-1-responses-delegation-voice-model-sometimes-never-delegates-acknowledges-verbally-sends-nothing/1398585)). Twilio does not enable the Opus codec by default, which GPT-Live SIP requires; one developer was still waiting on Twilio after two days ([telephony thread, Oct 29](https://community.openai.com/t/migration-of-telephony-using-realtime-to-gpt-live/1410726)).
  - Correction: an earlier draft said user speech is not transcribed. That is wrong. The announcement lists "native ASR transcripts", and the docs emit `session.input_transcript.delta` for user speech and `session.output_transcript.delta` for the assistant ([GPT-Live sessions guide](https://developers.openai.com/api/docs/guides/live-conversations)). Note those deltas have no turn-completed event; your app groups them.
  - The announcement also says "interrupting speech does not automatically cancel backend work" and that "Your application controls permissions and durable task state", which is a direct opening for a Durable Actor as the task-state owner.
- **Reported, Oct 29 benchmark posts:**
  - @ArtificialAnlys put **Phonic 1** at #1 on its Speech-to-Speech Index (87.1, $0.07/min); 283 likes, the top-engagement X item in my engine sample ([X](https://x.com/ArtificialAnlys/status/2115836126925901915)).
  - The same day, **Cartesia Managed Agents** launched claiming #1 of 30 on Artificial Analysis' Speech Agent Arena (Elo 1115) ([Cartesia blog](https://www.cartesia.ai/blog/managed-agents), [launch post](https://launcharchive.ai/launches/cartesia-managed-agents--x_2115848186950791665)).
  - Several small accounts posted Cartesia "I built my own voice assistant" demos within hours ([@ZabihullahAtal](https://x.com/ZabihullahAtal/status/2116030939495334109), [@Dhruvkumar16797](https://x.com/Dhruvkumar16797/status/2116012631052140694)). These look like a coordinated creator push. That is my inference from timing and tone, not proven.
- **Builder voices:**
  - @HussainAarfan (Harper Insure) says their voice agent ran "10,000+" insurance-application calls since August, often 30+ minutes long ([X](https://x.com/HussainAarfan/status/2115186041376383366)).
  - @vincent_koc: "Im using OpenAI realtime voice to speak to me whilst it spins up sub-agents managing over 100+ live agent threads across 6-7 machines" ([X](https://x.com/vincent_koc/status/2115637011285749884)).
  - @anishfyi argues "Voice needs WebRTC, not streaming" and calls LiveKit "the default scaffolding for real-time agents now" ([X](https://x.com/anishfyi/status/2115377910110695829)).
- **Unverified:** one tiny account (@dailytechonx) claimed Deepgram acquired Daily (Pipecat) ([X](https://x.com/dailytechonx/status/2115839920501637525)). A web search found **no confirming announcement**. Do not repeat it.

**Inference:** "voice that orchestrates many agents" (vincent_koc's pattern) is the strongest real-time + multi-agent hook visible on X. It maps cleanly onto "a voice front-end talks to a durable actor that fans work out over Agent Relay".

## 4. Discourse thread C: "software factory" and long-running agents are the SF founder vocabulary

- The event page itself says "Software Factory". On X the term belongs to **Factory (@FactoryAI)** and Warp's Zach Lloyd.
  - Factory's Oct 14 "OpenCompute" (a self-hosted orchestrator for agent sandboxes) got ~59K views and 693 bookmarks, per a plushcap snapshot ([plushcap](https://www.plushcap.com/companies/factory/xtwitter)).
  - Menlo invested and frames it as "the machine that builds the machine" ([Menlo, Oct 5](https://menlovc.com/perspective/menlos-investment-in-factory-the-system-that-builds-software/)).
  - Zach Lloyd's posts describe "product engineering" vs "factory engineering" (credited to @poteto as "gardening"). He also describes outer-loop agents that score other agents' conversations and propose skill PRs ([twiscan mirror](https://twiscan.com/en/x/zachlloydtweets/2107589999638298766)).
- Guillermo Rauch (Vercel) podcast, Oct 16: "software factories, durable agent infrastructure... agent fleets" ([snipd](https://share.snipd.com/episode/5b839a8c-68dd-4d6b-b6af-cebc6e190776)).
- **Counter-current (HN, a skeptical crowd):**
  - "AI coding agents generate more code but not more software" (Oct 9; Harvard/Jellyfish study; HN 365 pts per engine, not re-checked, [Ars](https://arstechnica.com/ai/2026/10/ai-coding-agents-generate-more-code-but-not-more-software/)).
  - "No signs of AI payoff outside the tech sector" (649 pts, [Apollo](https://www.apollo.com/wealth/insights-news/insights/daily-spark/no-signs-of-ai-payoff-outside-the-tech-sector)).
  - Trail of Bits: "Your AI agent fixed the bug, but what else did it change?" ([blog](https://blog.trailofbits.com/2026/10/21/your-ai-agent-fixed-the-bug-but-what-else-did-it-change/)).
- **Agent-hype cooling, as seen on X:**
  - On Oct 25, OpenAI's Tibo Sottiaux ("help scale dots to 1B users") traded barbs with Meta's Alexandr Wang ("oops you misspelled muse"), who posted the App Store chart with Muse at #1.
  - OfficeChai frames it as agent hype "cooling", citing Muse average daily downloads of ~165K, down 8.1% week-over-week for the week ending Oct 7 ([OfficeChai](https://officechai.com/ai/openai-meta-and-spacex-execs-are-trading-barbs-over-their-respective-ai-agents-on-x/)).

## 5. What the hosts themselves posted (verified via mirrors and primary pages)

**Terse / Durable Actors**
- **Oct 6:** @karatzas_thomas "Terse is joining the YC F26 batch!", ~23.9K views / 195 likes on the teapawt mirror (the twstalker mirror shows ~21K / 189; counts vary by capture time). A reply from @bensenescu: "Love Durable Objects, an open source alternative is much needed" ([mirror](https://teapawt.org/karatzas_thomas/status/2107500256976085230)).
- **Oct 7:** "Introducing Durable Actors" post (~11.3K views) ([mirror](https://xitter.cf/karatzas_thomas/status/2107872102829502622)).
- **Oct 8:** agent-coordination demo that "almost won me the @ycombinator demo showcase. lost in the finals to a robotic arm playing Doom". Source code: [TerseAI/talkingAgent](https://github.com/TerseAI/talkingAgent) ([mirror](https://teapawt.org/karatzas_thomas/status/2108276198564638886)).
- **Show HN (~Oct 8, 53 pts / 25 comments on Oct 29):** published p95 numbers of 85.6ms durable write, 2.14ms stateful read, 334ms warm-up. A founder answer (reposting co-founder Olivier's suppressed comment) clarifies "durable actors manages durable state, not durable execution" ([HN](https://news.ycombinator.com/item?id=49980399)). The top critique was state query across actors ("further double up on storing the state again in another database"); the founder agreed it is "a big sticking point". Repo [TerseAI/durable-actors](https://github.com/TerseAI/durable-actors): 291 stars, releases v0.14.2-v0.14.4 all cut on Oct 29 (gh).
- **Most relevant post, late Oct (mirror says "2 days ago", capture date unknown):** @IncTerse (the company account) quoted co-founder Olivier Simard-Morissette (@oliviersm199), who said they built "a multiplayer mystery game set in Victorian England" to "stress test our infra". The game is a **voice murder mystery**:
  - "Every conversation is a durable Actor", with one speaker at a time.
  - Conversations go idle, then rehydrate with their history when you return.
  - Speech fans out to all characters.
  - Uses Jev to decide what info to divulge, @ElevenLabs TTS, and a front end "vibe coded with astra + @threejs".
  - Source: [twstalker mirror](https://mobile.twstalker.com/IncTerse). Jev is tagged as @typesafeai's. It is a Victorian mystery, not explicitly Halloween, but it is the hosts' own showcase demo, so a near-copy will not look original.
- **Now attributed (verified on mirror):** Agent Relay co-founder **Khaliq Gant (@Khaliqgant)** posted, after dinner with @karatzas_thomas and @oliviersm199: "For agent native software it's a near perfect match. We're moving over to their tech for @agent_relay" ([twstalker mirror](https://mobile.twstalker.com/IncTerse)). Date not shown. So the two hosts are technically aligned: Agent Relay itself is migrating onto Durable Actors. This likely explains the "bonus points for both" rule (inference).

**Agent Relay**
- **Launch YC, Oct 23:** "My agent → me → you → your agent... We're all the bottleneck!" Features on the YC page: agents read each other's sessions, ask follow-ups, get pinged when work is ready; shared searchable session history; open source plus hosted cloud. The founders say they "run 50+ agents in parallel" and close with "Don't be a meat proxy." ("Messages that still arrive after a disconnect" is from the launch video, not the YC page.) ([YC launch](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other)).
- **Launch video:** 89s, reported 89K+ views. Key line: "they know what they're allowed to decide on their own and when they should come to you" ([animatiq breakdown](https://animatiq.ai/launch-directory/agent-relay)).
- **Oct 28:** @agent_relay "already shipping updates to our desktop app" (480 views) ([nitter](https://nitter.gq/agent_relay)).
- **Background, Feb 1:** "Go to Bed, Wake Up to a Finished Product" blog teaser (~10.4K views) (unverified; not re-checked).
- **Repo:** [agentworkforce/relay](https://github.com/agentworkforce/relay), Apache-2.0, 1,059 stars on Oct 29. **Agent Relay core v15.0.0 shipped Oct 29 and v15.0.1 on Oct 30 UTC**, a major-version bump two days before the event (gh). The README now covers four pieces: Messaging (channels, threads, DMs, real-time events across machines), Integrations (relayfile), Shared Sessions, and **Flows** (TypeScript workflows "with deterministic checks, required steps, and human gates").

## 6. Halloween + AI on X this month (reported)

- @alexgreensh: Claude "went trick-or-treating for tokens dressed as other agents". An Opus 5.5 code-animation with "100+ easter eggs"; the full prompt was shared ([openchamber](https://data.openchamber.dev/opus-5-5-videos/v/alexgreensh-2110404428691808308)).
- OpenAIDevs reshared @shapiro500's Halloween skeleton dancer with a new "auto mode", Oct 22 ([agihunt](https://agihunt.info/en/p/1a16426c30e2ca9d6667d249014)).
- AI horror/music videos (Seedance 2.5, MVLAND) at 10K-75K views. These are mostly brand partner posts.

**Inference:** Halloween content on AI X is mostly generated *media* (videos, animations). Interactive, stateful, multiplayer Halloween experiences are rare. That gap matches what the hosts sell.

---

## Limits / could not verify

- No logged-in x.com access, so I could not see the For You feed, quote-tweet trees, or reply sentiment directly. View counts come from trackers and mirrors with unknown capture times. Some trackers (starbelo, sandbase, advanceintelligence) are content farms that rewrite X posts. I used them only for "this post existed with roughly this reach", not for interpretation.
- The engine's X search covered roughly Oct 27-30 well and earlier October poorly. Absence of a topic here does **not** mean it was quiet on X.
- I did not identify specific judges (the event page says "to be announced"), so I could not profile their personal X feeds.
- I could not confirm: the Deepgram-Daily acquisition; the "3 months" Altman wording; the exact date of the Terse murder-mystery post or the Khaliq Gant post; Reddit/HN point counts I could not re-read; any of the hustle-post revenue claims. The "moving over" post author is now confirmed as Khaliq Gant.
- Model names in sources (GPT-6 Astra, GPT-6.1 Sol/Terra, Opus 5.5, Gemini 4 Argon) appear as reported. I did not check their release details; another research file covers OpenAI specifics.

---

## Hackathon implications

**What to build (ranked by fit with X discourse and with the judges):**
1. **Voice-orchestrated agent team with a visible "war room".**
   - A GPT-Live-1 or Realtime voice front-end (OpenAI sponsor credit) talks to a coordinator.
   - Each specialist agent is a **Durable Actor** that owns its state, and they negotiate over **Agent Relay** channels.
   - Spin up specialists live on stage.
   - This copies the most-shared builder pattern (vincent_koc) and answers the Altman "agent teams" framing.
   - Halloween skin: a "haunted house ops center" where the ghosts are agents with distinct roles.
2. **Multiplayer haunted sim that fixes what YC Labs and Cognizant exposed.**
   - Give agents *differentiated roles* (the HN critique) and *verifiable shared state* (the Cognizant false-dawn bug).
   - Make the world state one Durable Actor (serialized, so no rewrite races) and make claims auditable.
   - Pitch it as: "Agents in Haunted Hollow believed a fake sunrise. In ours they can't, because the world actor is the single source of truth."
   - This is a direct, citable story for judges.
3. **Overnight "software factory" with human approval gates.**
   - The agents-while-you-sleep genre goes viral, but it is now distrusted (hustle posts, Trail of Bits, GPT-6.1 Astra held back over scope).
   - Make permissions and approvals first-class. Agent Relay's own pitch includes "when they should come to you", and Durable Actors docs list "Human approvals" as a use case.

**Avoid:**
- A near-clone of Terse's own Victorian voice murder-mystery (Durable Actor per conversation + Jev + ElevenLabs + three.js).
- A plain "N agents in Minecraft".
- Pure generated Halloween media. That is saturated, and neither sponsor primitive shows up in a video.

**Demo-craft cues from what went viral:**
- Lead with a concrete count and a live visual: agents spawning, messages flowing, the actor state ticking.
- Show the moment agents talk *to each other without you*. This is Agent Relay's exact launch hook ("Wait, wait, wait... why are you the one carrying the messages?").
- Keep a 30-60s screen recording ready to post on X with the hosts tagged: @karatzas_thomas, @IncTerse, @willwashburn, @agent_relay. Both hosts are actively amplifying usage within a week of their launches.

**Gotchas to pre-empt:**
- **GPT-Live-1:** the frontend model may say it did something without delegating (put explicit "when X, delegate" rules in the voice prompt, and show backend task state on screen so a missed handoff is visible); interruptions do not cancel backend work; telephony needs the Opus codec, which Twilio does not enable by default. Use browser WebRTC, not phone, for the demo.
- **Durable Actors** manage state, not execution. Do long LLM calls outside the actor or mark the entry method `@Interleave` (import from `terse-sdk/actor`; decorating a helper does not change the caller's policy), otherwise calls are serialized ([docs FAQ](https://docs.useterse.ai/faqs)).
- **Version churn:** durable-actors cut three releases on Oct 29 and Agent Relay went to v15 on Oct 29-30. Pin exact versions on the morning of Oct 31 and do not upgrade mid-hack.
- **Cross-actor queries:** the docs say actor calls do not create a transaction across actors and to use a database for cross-entity queries. Plan a Supabase table for leaderboards/analytics (also the hook for the Supabase "scale to millions" prize).
- **Durable Actors defaults:** 10s idle eviction and 0.25 CPU / 256 MiB per hosted actor ([docs FAQ](https://docs.useterse.ai/faqs)). Keep a websocket open during the demo, or expect rehydration latency (334ms p95 warm-up per Show HN).

**Setup before Oct 31 (ideas are allowed beforehand; code must be written at the event):**
- Install Bun 1.4.2+ and run `bunx terse-cli@latest install`, then `terse init counter --template counter`, `terse actor dev`, `terse actor generate` and `terse deploy` once, just to confirm the toolchain and your Terse API key work ([quickstart](https://docs.useterse.ai/quickstart)). Delete the scaffold afterwards.
- Install the Agent Relay CLI (`curl -fsSL https://raw.githubusercontent.com/AgentWorkforce/relay/main/install.sh | bash` or `npm install -g agent-relay`), run `relay init` in a throwaway folder, and sign in to Agent Relay Cloud (no credit card per README).
- Read the Agent Relay docs and the open-source repo ([agentworkforce/relay](https://github.com/agentworkforce/relay)) and the YC Labs harness README for patterns.
- Test that GPT-Live-1 or Realtime WebRTC works in your browser with your OpenAI key.
- Pre-write the 60s pitch around one line: "agent teams, not swarms: each agent owns its state (Durable Actors) and talks directly to the others (Agent Relay)."

## Sources

- https://www.launchvideo.com/directory/openai-dots-demo
- https://starbelo.com/use-case/openai-gpt-6-1-terra-computer-use-demo/
- https://www.advanceintelligence.ai/story/2026-10-27-27
- https://www.advanceintelligence.ai/story/2026-10-17-27
- https://www.memesita.com/grok-locates-lost-screw-in-photo-during-x-user-test/
- https://www.sandbase.ai/lab/ai-videos/opus-5-5/2114397357316178028
- https://agihunt.info/en/p/1a1815a6bf3db637944dcf1ef92
- https://agihunt.info/en/p/1a16426c30e2ca9d6667d249014
- https://www.llms.blog/posts/sam-altman-cheeky-pint-sandboxing-agent-teams-compute
- https://www.reddit.com/r/singularity/comments/1xiwplq/sam_altman_reveals_openai_barely_understood_how/
- https://goodtransformer.ai/insights/agent-swarms-rewrite-work/
- https://news.ycombinator.com/item?id=50296486
- https://ai-tldr.dev/releases/yc-labs-agent-swarms-minecraft-mindustry/
- https://github.com/yc-software/minecraft-agent-harness
- https://www.cognizant.com/us/en/ai-lab/blog/halloween-ai-agent-simulation-terralingua
- https://community.openai.com/t/introducing-gpt-live-1-in-the-api/1396471
- https://community.openai.com/t/migration-of-telephony-using-realtime-to-gpt-live/1410726
- https://x.com/ArtificialAnlys/status/2115836126925901915
- https://www.cartesia.ai/blog/managed-agents
- https://launcharchive.ai/launches/cartesia-managed-agents--x_2115848186950791665
- https://x.com/ZabihullahAtal/status/2116030939495334109
- https://x.com/Dhruvkumar16797/status/2116012631052140694
- https://x.com/HussainAarfan/status/2115186041376383366
- https://x.com/vincent_koc/status/2115637011285749884
- https://x.com/anishfyi/status/2115377910110695829
- https://x.com/dailytechonx/status/2115839920501637525
- https://www.plushcap.com/companies/factory/xtwitter
- https://menlovc.com/perspective/menlos-investment-in-factory-the-system-that-builds-software/
- https://twiscan.com/en/x/zachlloydtweets/2107589999638298766
- https://share.snipd.com/episode/5b839a8c-68dd-4d6b-b6af-cebc6e190776
- https://arstechnica.com/ai/2026/10/ai-coding-agents-generate-more-code-but-not-more-software/
- https://www.apollo.com/wealth/insights-news/insights/daily-spark/no-signs-of-ai-payoff-outside-the-tech-sector
- https://blog.trailofbits.com/2026/10/21/your-ai-agent-fixed-the-bug-but-what-else-did-it-change/
- https://officechai.com/ai/openai-meta-and-spacex-execs-are-trading-barbs-over-their-respective-ai-agents-on-x/
- https://teapawt.org/karatzas_thomas/status/2107500256976085230
- https://xitter.cf/karatzas_thomas/status/2107872102829502622
- https://teapawt.org/karatzas_thomas/status/2108276198564638886
- https://mobile.twstalker.com/IncTerse
- https://news.ycombinator.com/item?id=49980399
- https://docs.useterse.ai/faqs
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other
- https://animatiq.ai/launch-directory/agent-relay
- https://nitter.gq/agent_relay
- https://teapawt.org/willwashburn/status/2113646682001101151
- https://data.openchamber.dev/opus-5-5-videos/v/alexgreensh-2110404428691808308
- https://community.openai.com/t/gpt-live-1-responses-delegation-voice-model-sometimes-never-delegates-acknowledges-verbally-sends-nothing/1398585
- https://developers.openai.com/api/docs/guides/live-conversations
- https://siren.watch/item/sam-altman-reveals-openai-barely-understood-how-to-scale-ai-agen-efc1ccfabb627470.html
- https://pulseaugur.com/cluster/330512-sam-altman-openai-struggled-with-ai-swarm-scaling-sees-research-automation
- https://docs.useterse.ai/quickstart
- https://github.com/TerseAI/durable-actors
- https://github.com/agentworkforce/relay
- https://github.com/TerseAI/talkingAgent
- Raw engine dump: ~/Documents/Last30Days/viral-ai-agent-demos-and-real-time-ai-discourse-raw-v3.md

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live sources. Outcome key: CONFIRMED / CORRECTED / UNVERIFIED / REFUTED.

| # | Claim | Checked against | Outcome |
|---|---|---|---|
| 1 | Agent Relay launched Oct 23 by @willwashburn, ~96.5K views / 506 likes | teapawt mirror of the post | CONFIRMED (96,569 views, 506 likes, 3:00 PM UTC) |
| 2 | YC Launch page lists "messages that survive disconnects" | YC Launch page (published Oct 23) | CORRECTED: not on the YC page; the line comes from the launch video (animatiq transcript). Rest of the description confirmed |
| 3 | Launch-video quote "they know what they're allowed to decide on their own and when they should come to you", 89s, 89K+ views | animatiq breakdown | CONFIRMED (quote begins "They also know...") |
| 4 | Terse Show HN p95: 85.6ms write, 2.14ms read, 334ms warm-up; "durable state, not durable execution" | HN item 49980399 | CONFIRMED; added 53 pts and the state-query critique |
| 5 | Durable Actors defaults: 10s idle timeout, 0.25 CPU / 256 MiB; "Human approvals" use case | docs.useterse.ai/faqs | CONFIRMED. Decorator name CORRECTED from `@interleave` to `@Interleave` |
| 6 | Setup command `bunx durable-actors init` | docs.useterse.ai/quickstart | REFUTED: quickstart uses `bunx terse-cli@latest install` then `terse init counter --template counter`; fixed. Bun 1.4.2+ CONFIRMED |
| 7 | YC Labs Minecraft/Mindustry HN ~224 pts / 72 comments; 50 GPT-6.1 Sol agents, ~5,900 messages, Mindustry 6-1 | HN 50296486, ai-tldr | CONFIRMED (231/74 on re-check) |
| 8 | "Top HN critique" = no role differentiation | HN thread | CORRECTED: quote is real (user frankacter) but it is a nested reply under the 12th top-level comment, not the top comment |
| 9 | yc-software/minecraft-agent-harness is open source | gh | CONFIRMED (created Oct 29, 29 stars) |
| 10 | Cognizant Haunted Hollow: 16 Claude Haiku 4.5 agents, false dawn, monster ghosted while candy remained | Cognizant blog (Oct 29) | CONFIRMED; added names (Ebenezer, Grendelyn) and the post's own caveat on causation |
| 11 | Altman Cheeky Pint quotes ("agent teams", trillion AIs, "sandboxing works to a point") | llms.blog writeup; lavx.hu | CONFIRMED |
| 12 | r/singularity post, 370 pts, "3 months" | aggregators (Reddit fetch blocked) | Post existence CONFIRMED; points UNVERIFIED; "3 months" UNVERIFIED as an Altman quote |
| 13 | GPT-Live-1: Sep 10, $0.05/min, 0.798s vs 1.41s | OpenAI community announcement | CONFIRMED (billed per second; backend billed separately) |
| 14 | GPT-Live-1 does not transcribe user speech | announcement + GPT-Live sessions guide | REFUTED: "native ASR transcripts"; `session.input_transcript.delta` exists. Removed from doc and gotchas |
| 15 | GPT-Live delegation failures and Twilio Opus codec gotcha | delegation thread 1398585; telephony thread 1410726 | CONFIRMED (the delegation issue was mis-cited to the telephony thread; re-cited) |
| 16 | Cartesia Managed Agents #1 of 30, Elo 1115, Oct 29 | Cartesia blog | CONFIRMED |
| 17 | Terse murder-mystery is a "Halloween-genre" demo | twstalker mirror | CORRECTED: it is "a multiplayer mystery game set in Victorian England", built to stress-test the infra |
| 18 | Author of "moving over to their tech for @agent_relay" unknown | twstalker mirror | RESOLVED: Khaliq Gant (Agent Relay co-founder) |
| 19 | Muse downloads down 8.1% WoW | OfficeChai (Oct 25) | CONFIRMED with qualifier: week ending Oct 7, ~165K/day |
| 20 | tetsuo film: 116 agents / 44h / 342K views / Elon "Yikes" | advanceintelligence | CONFIRMED as reported (self-reported production figures) |
| 21 | Dots: 8.4M views, 19K likes, 6.7K bookmarks; launched at DevDay Sep 29 | launchvideo.com; Good Transformer | CONFIRMED as reported by tracker |
| 22 | GPT-6.1 Astra held back on Sep 29 | Good Transformer (partial read) | UNVERIFIED |
| 23 | Ars "more code, not more software" 365 HN pts | Ars article | Article CONFIRMED (Oct 9, Harvard/Jellyfish); HN points UNVERIFIED |
| 24 | Repos exist: agentworkforce/relay, TerseAI/talkingAgent | gh | CONFIRMED (relay 1,059 stars, v15 on Oct 29-30; talkingAgent 0 stars, last push Oct 8) |

Not re-checked (low decision value): Grok screw post, @mattyp Grok walkthrough, plushcap Factory numbers, Zach Lloyd mirror, Rauch snipd quote, individual voice-builder X posts, Halloween media posts.
