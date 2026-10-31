# Past winners at YC-hosted hackathons (2025-2026): what won, the stack, and why

> Researched 2026-10-29 for Haunted Hacks (YC office, Sat 2026-10-31, 11:00-16:00 build). Angle: winners and finalists of hackathons held at or co-run by Y Combinator in SF. Emphasis on Aug-Oct 2026. Earlier events are labeled **[background]**.
>
> **How to read this.** "Verified" means a host or sponsor recap, a Devpost or official page, or the winner's own public post names the placement. Creator posts are first-person claims. I treat them as reliable for placement but did not check them against an official list unless I say so. **"Why it won" is my inference.** I found no judge scorecards, except published rubrics: Browser Use (weighted percentages), Bitrig (five unweighted criteria on Devpost), and the Cactus/DeepMind starter repo (two criteria). A fact-check pass (2026-10-29) is logged at the end. Repos were checked with `gh` for metadata and README only. Nothing was installed or run.

---

## 1. The event most like ours: Bitrig Hacks iPhone Duo Edition (Sep 26 2026, YC office)

This is the closest analog. It uses the same events.ycombinator.com template and is roughly the same length: hacking 11:30-15:30, then demos and judging 15:30-17:00 ([Luma](https://luma.com/yc-meetup-4378)). It has the same "top entries demo live, judges pick from demos" rule and the same "iPhone Duo" hardware prize. **Thomas Karatzas, co-founder and CEO of Terse (F26, our host) and previously an engineer on Apple Intelligence, was on the judging panel.** So were Brad Flora (YC GP), Ari Weinstein (OpenAI) and others ([Devpost](https://bitrig-hacks-duo-edition.devpost.com/)). Turnout: Devpost showed 157 participants on 2026-10-29; Notebookcheck reported 161 participants and 73 submitted projects ([Devpost](https://bitrig-hacks-duo-edition.devpost.com/), [Notebookcheck](https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html)).

**The prize ladder is nearly the same as ours.** Bitrig paid 1st: YC interview + $500 Apple gift card + $5k OpenAI; 2nd: $500 Supabase + $2.5k OpenAI; 3rd: $1k OpenAI; RevenueCat track: an iPhone Duo ([Devpost](https://bitrig-hacks-duo-edition.devpost.com/)). Haunted Hacks pays YC interview + $5k / $2.5k / $1k OpenAI and an iPhone Duo for its Durable Actors track ([Luma](https://luma.com/yc-meetup-7183-9316f87f)). Inference: the same YC events template, and possibly the same sponsor package.

**Bitrig published its judging criteria** on Devpost (unweighted): (1) use of iPhone Duo, meaning would it be "significantly less compelling, or impossible, on a traditional iPhone"; (2) originality and creativity; (3) execution and demo ("A complete production-ready app is not expected"); (4) UX and design; (5) potential and impact. Devpost also said: "The Devpost Writeup is your entry and is what will be judged." Submissions were due at 3:30pm and needed a demo video and at least one screenshot ([Devpost](https://bitrig-hacks-duo-edition.devpost.com/)).

| Place | Project | What it does | Stack / hook |
|---|---|---|---|
| 1st (YC interview, $500 Apple card, $5k OpenAI) | **Crate** (Steven Zhang, Mahin Bharathwaj, Aradhya Mishra; Notebookcheck renders the first name as "Shuhan-Zhang Zhang") | AI sampler. You type a vibe ("french jazz piano sample") and get a beat "in 0.3s" from your own sample library. Pads sit on the bottom screen and the sequencer on top. **The hinge is an FX knob, and snapping it open triggers the drop.** The back screen runs a light show. | iPhone Duo APIs, AI sample retrieval. The creator's framing: "every Duo feature does something musical" ([LinkedIn repost](https://www.linkedin.com/posts/mahin-bharathwaj-344b8a31b_incoming-activity-7510385152649502720-_KzG), [Notebookcheck](https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html)) |
| 2nd | **Duo-Man** (Vidit Bhargava) | Walkman. Pick the cassette with the phone open, close it to play. Uses recorded real Walkman sounds. | Hinge state used as the core interaction ([Notebookcheck](https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html)) |
| 3rd | **Saura** (Gergana Dragoeva Quievy, Prakash Acharya) | A half-open phone acts as a mirror on one side with beauty steps on the other. Routines are extracted from videos. | Stand posture plus AI ([same](https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html)) |
| RevenueCat track (prize: iPhone Duo) | **TranslateCat** (Vasanth Sreeram) | Face-to-face translator, one screen per person, 16 languages | Sponsor SDK as the paywall ([same](https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html)) |
| Finalist (top 6-8) | Hinge-angle CAPTCHA | "Fold the phone to a random angle to prove you're human" | Creator posts ([Nisevich](https://www.linkedin.com/posts/benjamin-nisevich_we-just-killed-captcha-at-ycs-hackathon-activity-7510100128687579136-mBqt), [Balusa](https://www.linkedin.com/posts/anshbalusa_what-if-proving-youre-human-required-a-physical-activity-7510004571235143681-jj0r)) |

**Why they won (inference).** Every podium project made the *new primitive itself* the interaction: the hinge or the two screens. None used it as a mere place to run code. Judges were asked for projects that "make creative, thoughtful use of iPhone Duo's new APIs and show something meaningfully new" ([Luma](https://luma.com/yc-meetup-4378)). Haunted Hacks says "very well-executed products or incredibly creative use cases using Durable Actors and Agent Relay." It's the same shape of rubric, and one of the same judges. All three podium projects were also **instantly legible on stage**: music, a Walkman, a mirror. The demos were physical and sensory, and none needed a slide to explain.

---

## 2. Make Something Agents Want (Oct 17-18 2026, YC HQ, overnight)

The event had 8 sponsor tracks and was hosted by Stripe, Manufact, primitive.dev, InsForge, Armature, Blaxel, Inkbox and Supabase, with YC's Nemil Dalal running it ([Pivot News summary of the YC listing](https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent), [YC LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7503831119956549634)). The listed schedule ran from hacking at 10:30am on day 1 to submissions and live demos at 10:00am on day 2, so roughly 24 hours of building; the winner called it a "48-hour hackathon" ([Pivot News](https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent), [Weber](https://www.linkedin.com/posts/konrad-weber_ycombinator-aiagents-x402-activity-7518042534678466560-fBEd)). The winner reported 70 submitted teams. Manufact reported 180+ builders and said 80% of them built an MCP with Manufact ([Pederzani](https://www.linkedin.com/posts/mcp-use_activity-7517991965741948928-1XHM)). Listed track prizes: Manufact $3k cash + $6k credits; primitive.dev $3k/$2k/$1k cash; Stripe $3k/$2k/$1k credits ([Pivot News](https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent)).

| Placement | Project | What / stack | Source |
|---|---|---|---|
| **Overall 1st (YC interview)** | **d402** (Konrad Weber, Fahim Ahmed, Muaaz Shafiq) | Agents pay for APIs with no wallet or card. Instead of paying USDC over x402, the agent **labels a small batch of data** and gets a voucher for up to 150 calls. The seller keeps the labeled dataset. Docs and playground: napoleon1313.github.io/d402-site (repo `napoleon1313/d402-site`, created 2026-10-20, after the event). | [Weber, LinkedIn](https://www.linkedin.com/posts/konrad-weber_ycombinator-aiagents-x402-activity-7518042534678466560-fBEd) |
| Manufact 1st | **Thump** | MCP app over helmet collision sensors, for football coaches | [Pederzani](https://www.linkedin.com/posts/mcp-use_activity-7517991965741948928-1XHM) |
| Manufact 2nd / 3rd | **Pareto** (escrow for agent-to-agent transactions via MCP). **Project Y** ("X for coding agents", a shared memory feed that posts pointers, not content) | | [same](https://www.linkedin.com/posts/mcp-use_activity-7517991965741948928-1XHM) |
| primitive.dev 1st ($3k) | **Continuity** (Samuel Choi, Dylan Nguyen, Aiden Guan) | Turns long email threads into **cited task state** so a fresh agent can resume where the last one stopped. The track judge, Ashley Ha, called it "the most primitive native & best engineered project we saw". | [Ashley Ha](https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF) |
| primitive.dev 2nd / 3rd | **gud** ("replaces git with an email thread for agent swarms; replaying the thread rebuilds exact state"). **Unicess** (six office agents run a university over email) | | [same](https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF) |
| Armature (AX) 1st | **Sell2Agents** | Selling agent that negotiates with buyer agents without leaking its floor price. Uses Manufact-hosted MCP, Stripe to charge the agreed price, and Inkbox for win-back email. | [Pradhan](https://www.linkedin.com/posts/ananyapradhan_makesomethingagentswant-activity-7518462153100591104-LpwM) |
| InsForge 2nd | **Cortex** | "Cursor for robot policies". Any agent can train a VLA model through MCP. | [Dantuluri](https://www.linkedin.com/posts/aneesh-dantuluri-78bb32288_my-team-and-i-just-won-2nd-place-at-y-combinator-activity-7517779936984637440-jVna) |
| Inkbox 1st | **Milo** | Permission layer for agents. It checks saved decisions first, then asks the owner's agent over A2A, then escalates Slack, then iMessage, then a voice call, within an "interrupt budget". | [Nisevich site](https://bennisevich.com/) |
| Inkbox 3rd | **Streward** | Agents get their own email addresses and phone numbers and coordinate with each other | [Uraish](https://teapawt.org/ali_uraish) |

**Why they won (inference).**
- **The overall winner put a clever economic twist on a hot protocol** (x402). It wasn't a wrapper. It was a mechanism with a two-sided "aha": the seller gets a dataset. You can explain it in one sentence.
- **Two track winners are effectively durable, replayable agent state.** Continuity (cited state recovered from a thread) and gud (replay the log to rebuild exact state) both do this. That is the event-sourcing and actor story Terse sells. Judges rewarded "a fresh agent picks up exactly where the last left off."
- **Agent-to-agent mechanics won repeatedly:** negotiation between agents, A2A escalation, escrow between agents, a shared memory feed for swarms. This is squarely the Agent Relay value proposition.

---

## 3. Supabase Select 2026 Hackathon (Oct 3 2026, YC HQ Dogpatch, one day)

The venue was 580 20th St, which is YC's Dogpatch HQ; Supabase later wrote "Select 26 Hackathon at the YC office last week" ([Luma](https://luma.com/select-2026-hackathon), [Supabase on X, via mirror](https://xitter.cf/supabase/status/2108580939173372142)). Listings give 9:00am-5:00pm PT. The hackathon site shows 15:00 UTC to 00:30 UTC, which is 8:00am-5:30pm PT ([hackathon.supabase.com](https://hackathon.supabase.com/)). The theme is **(unverified)**: the Luma page states none. A finalist reported 59 submissions, 9 on-stage finalists, and about 50 judges from Supabase, Anthropic, Google, Stripe, Vercel and YC ([finalist post](https://www.linkedin.com/posts/burkybang_supabaseselect-supabase-anthropic-activity-7512372936960483328-07t0)). The Supabase hackathon index shows **68** submissions, which may include drafts. Luma had planned for "the top six teams" to demo. The final panel was Ant Wilson (CTO), Paul Copplestone (CEO), Pratik Gupta (Stripe), John Robison (Anthropic) and George Fahmy (Vercel). The prize pool was 31K in credits for winning teams ([Luma](https://luma.com/select-2026-hackathon)).

- **1st: Fizz / Fizzlayer** (Nisarg, @noslopmaxima): "the physical layer for AI agents. Connect any sensor, ask about it in plain English, and get a call when something goes wrong." The source is the winner's own post: "Won first at the @supabase Select 2026 hackathon today with my project Fizz, a physical layer for agents!" Ant Wilson quote-posted it the next day as "Breakfast with @noslopmaxima" ([Ant Wilson, via mirror](https://nitter.rdrama.net/AntWilson/status/2106803568779088313)). I found no official Supabase winner announcement. Fizz is now a waitlist startup at fizzlayer.com ([nitter mirror](https://nitter.rdrama.net/noslopmaxima)). I could not find the stack beyond the hosted demo at fizz-zeta.vercel.app.
- **Best Use of Stripe:** Raha Zholdoshkanov and Karim Baba, a top-8 finalist. The project name was not given in the post I found ([LinkedIn](https://www.linkedin.com/posts/rakhatbek-zholdoshkanov_i-happy-to-announce-that-me-and-karim-baba-activity-7512378274354782208--izf)).

**Inference.** Supabase's founders, who run the "scale to millions" prize at our event, picked **real-world sensor data plus agent plus phone-call escalation**: a live, real-time loop. Thump (helmet sensors) won Manufact a fortnight later. Physical-world input reliably stands out in rooms full of browser and email agents.

---

## 4. YC "Own Your Intelligence" (Sep 27 2026, YC, 1 day)

There were 200+ participants, 91 submissions and 16 prizes across 14 projects. It was hosted by River AI, GBrain, Memorable, QM, Superset and UFO. This is the best-documented recent event because the c0mpiled writeup lists every winner with repo and video ([compiled.sh](https://www.compiled.sh/articles/yc-own-your-intelligence-hackathon)).

- **1st: QM Motion** (solo, Charles Conner). It gives a coding agent "a sense of time" for UI motion bugs. It records timestamped headless-Chromium captures, the agent inspects key frames, then re-records and pixel-diffs after the fix. Each case is stored in GBrain. The repo was created 2026-09-27, is primarily JavaScript, and had 11 stars on 2026-10-29 ([gh: charliec2004/qm-motion](https://github.com/charliec2004/qm-motion)).
- **2nd: The 49th Engineer** (solo). It fine-tunes a LoRA from reviewed engineering changes, with "weight pull requests" and **hard numbers: Qwen3.5-9B 0/30 → 29/30 on 30 held-out changes, a senior's rule 0/12 → 12/12, and a conflicting junior rule blocked in 1.8 s**. Python ([gh](https://github.com/OKKHALIL3/49th-labs)).
- **3rd: Support AGI.** A support agent that caches solved paths and compiles repeat ones into zero-LLM plans. **"Cost per ticket fell 66%" over 400 real tickets.** TypeScript ([gh](https://github.com/ToukoUrsin/own-your-intelligence-hack)).
- **Superset 1st: Swarm Solver.** "Agent swarms with SMT solvers and a fast message server."
- Organizer reflections: "90 of 91 submissions tagged at least one side quest". Sponsor usage was close to universal, and judging ran long ([compiled.sh](https://www.compiled.sh/articles/yc-own-your-intelligence-hackathon)).

**Inference.** The podium is all **measured** claims: a before/after pixel diff, 0/30 → 29/30, -66% cost. When every team uses the sponsor stack, a quantified result is what separates projects. Two of the top three were solo builders, so team size wasn't decisive.

---

## 5. Other 2026 YC-office events (shorter notes)

- **YC x Medplum Agentic Healthcare** (Aug 1 2026, 160+ hackers, judged by YC partner Diana Hu). 1st: **Lamina**, a physician network where agents surface clinical experience and draft physician-reviewed contributions that turn into referral relationships. 2nd: **CareLoop**, a pre-visit voice agent. 3rd: **LinkaChart Action Plan**. People's Choice: **MedTrace AI**. Sponsors: Deepgram, Moss, Stedi ([Medplum recap](https://www.medplum.com/blog/yc-medplum-hackathon-2026-recap), [Bell](https://www.linkedin.com/posts/ethan-bell-434a47260_really-grateful-that-our-team-took-1st-place-activity-7490229512429789184-E_6y)).
- **YC Voice Agents** (May 30 2026, Cekura + Daily; NVIDIA, AWS, Twilio; 85 submissions). 2nd: **City311**, a real phone number that files 311 tickets. Stack: Nemotron, Pipecat Cloud, Gradium, Twilio, vLLM on AWS. It was graded by Cekura across 5 scenarios on an 11-dimension rubric, then prompt-patched ([Pandey](https://www.linkedin.com/posts/mayureshpp_a-few-weeks-ago-i-built-city311-a-voice-activity-7469808880928317440-W7rl)). Runner-up: **Substrate**, a medical-intake eval harness ([Paleja](https://www.linkedin.com/posts/anish-paleja_ai-voiceagents-healthcareai-activity-7468372554097831937-sANh)). The starter repo said judges "want to showcase interesting projects rather than just pick winners" but want the sponsor tools used ([pipecat-ai/yc-voice-agents-hackathon](https://github.com/pipecat-ai/yc-voice-agents-hackathon)). **I could not find the 1st-place project.**
- **Call My Agent** (May 17 2026, AgentPhone, 91 teams). 1st: **Gavel**: text it what to sell, and it lists the item, negotiates with buyers and schedules pickup. You hear from it once. Built on DeepMind, Browser Use, AgentMail and AgentPhone. Also top 3: **JailCall** (a phone number to call from a police station that routes you to defense firms and remembers you across calls) and **Chief** (an "overhearing agent"). Chief's notable engineering: all expensive work runs on background threads, and only one cheap end-of-utterance decision with a hard timeout that "fails to silence" sits on the hot path ([agentphone.ai/callmyagent](https://agentphone.ai/callmyagent)).
- **Gemma 4 Voice Agents** (Apr 2026, Cactus + DeepMind). The best-overall winner, **Lookout**, gives each security camera its own local Gemma 4 instance on Cactus, so you can ask "what happened at checkout 10 minutes ago?" The same team won 3 of 4 prizes. The rubric was problem realness / VC appeal plus MVP correctness ([Ahmed](https://www.linkedin.com/posts/saalik-ahmed_alhamdulillahall-praise-be-to-allah-3x-activity-7452211929978286080-WWW1), [repo README](https://github.com/cactus-compute/voice-agents-hack)).
- **Browser Use Web Agents** (Feb 28-Mar 1 2026, 26h, 78 submissions, $180k+). **[background, but it has the only published rubric]** Impact 40%, Creativity 20%, Technical Difficulty 20%, Demo 20%. Each team got 4-minute demos in 6 parallel rooms, then the top 10 went to finals ([HackHQ](https://hackhq.io/customers/browser-use-hackathon)).
  - 1st: **Browser Brawl**. An attacker agent completes a task while a defender agent (Haiku plus CDP JS injection) sabotages it, and every match becomes SFT data. Traces were stored in **Convex** and used to fine-tune Qwen2.5-3B (Unsloth QLoRA on Modal). The README calls it a "24 hour" hackathon. TypeScript ([gh README](https://github.com/RichardHruby/browser-brawl), [Kalia](https://www.linkedin.com/posts/mehul-kalia_we-won-the-y-combinator-x-browser-use-activity-7436518049903493120-sDwo)).
  - 2nd: "Cursor for your browser" with an MCP server ([Kumar](https://www.linkedin.com/posts/ayushkumarcode_i-think-spending-close-to-a-grand-to-fly-activity-7435655468309438465-hkK-)).
  - 3rd plus Best Real-Time Data: **Slipstream**, a shared route cache for web agents (Laminar traces embedded into MongoDB vectors, ~300ms lookup) ([Wong](https://pipinstalleric.com/blog/yc-hackathon)).
- **First overnight YC Agents Hackathon** (Aug 2025, Dedalus, Browser Use, Convex, ~300 accepted of 900). **[background]** Track winners: **BetterWeb** (accessibility rewrite), **Bevin** (a "better Devin" orchestrating MCP agents plus browser-agent QA), **Rooki** (a social-media intern you reach on Telegram or email, with a "salary" slider), **Nara** (interrupt an audiobook narrator in real time) ([Hsu](https://www.linkedin.com/posts/reaganhsu_dedalusgivesyouragentswings-dedalusgivesyouwings-activity-7365805210167885824-fB_7), [Alshaikhusain](https://www.linkedin.com/posts/malshaik_alhamdulilah-we-won-big-at-the-first-24-activity-7365441640590729216-Zzih), [Jingles K.](https://www.linkedin.com/posts/jingles_excited-and-humbled-we-won-the-first-24-activity-7365729729817051136-VCRs), [Shahane](https://www.linkedin.com/posts/gayatrishahane_spent-a-straight-24-hours-with-some-cracked-activity-7365813073032437760-clLx)).

Adjacent, not at YC: the **Codex Community Hackathon** (late Aug 2026, with the recap post dated 2026-09-01; OpenAI + Runloop + Tenor, at PostHog in the Dogpatch, 100+ builders) was won by **Groundtruth**, and **the prize was a Mac mini**, the same as our Agent Relay track. 2nd was Antibody (rebuilds missing regression tests) and 3rd was Patchlet (compiles user sessions into agent-callable actions). It splits a PR description into claims and drives the running app to verify each one, using video and network logs as evidence. It was built in 6 hours ([Jazayeri](https://www.linkedin.com/posts/kjazayeri_thank-you-openai-runloop-ai-and-tenor-activity-7500389238996271104-Q7-w)). It's relevant because OpenAI co-ran it and OpenAI sponsors our event.

---

## 6. Cross-event patterns (inference, grounded in the above)

1. **The host's primitive drives the core mechanic.** Crate (hinge), Continuity and gud (email thread as durable state), Browser Brawl (two browser agents in one session), Lookout (one local model per camera). Losing pattern, inferred from finalist lists: generic "agent does X task" with the sponsor bolted on. Eric Wong's team at Browser Use explicitly avoided ideas "every team around us was gonna make" ([blog](https://pipinstalleric.com/blog/yc-hackathon)).
2. **Multi-agent dynamics win: adversarial, negotiating, escalating, or swarm.** Browser Brawl (attacker vs defender), Sell2Agents and Gavel (negotiation), Milo (A2A escalation ladder), gud and Swarm Solver (swarm coordination). These map directly to Agent Relay.
3. **Persistent per-entity state is a recurring winner.** JailCall "remembers the case across calls". Lookout runs one instance per camera. Continuity keeps resumable task state. That is literally "one Durable Actor per entity".
4. **Real-world I/O breaks the tie.** Phone calls (Gavel, JailCall, City311, Fizz's alert call), sensors (Fizz, Thump), cameras (Lookout), physical hinge gestures. A live phone ringing on stage is a recurring demo device.
5. **Numbers on stage.** 0/30 → 29/30, -66% cost/ticket, 0.3s beat generation, ~300ms route lookup, 11-dimension eval rubric.
6. **One-sentence pitch with a twist.** "Pay for APIs by labeling data." "Browser agents fight like a GAN." "Fold the phone to drop the beat."
7. **Team size doesn't matter.** Solo winners: QM Motion (1st), 49th Engineer (2nd), JailCall (top 3), Streward, Duo-Man (2nd).
8. **Short events reward polish over breadth.** Bitrig said a polished demo was enough, and entries did not need to be complete apps ([Luma](https://luma.com/yc-meetup-4378)).

---

## Limits / could not verify

- **No judge scorecards** were found for any event. All "why it won" claims are inference. Published rubrics: Browser Use (weighted, Feb 2026), Bitrig (five criteria, Sep 2026, the closest analog), Cactus/DeepMind (two criteria, Apr 2026).
- **events.ycombinator.com returned no content** to Exa (`CRAWL_EMPTY_CONTENT`). I couldn't see an official past-events index, so this list may miss YC-office events with no public recap.
- Make Something Agents Want: I found **only the overall 1st** (d402). Overall 2nd and 3rd and the Supabase, Blaxel and Stripe track winners were not found. d402 has a docs/playground repo (`napoleon1313/d402-site`) but no source repo that I could locate.
- Voice Agents (May 30): **the 1st-place project was not found.** Supabase Select: Fizz's stack and the other finalists are unknown.
- Most placements come from creator LinkedIn or X posts read through mirrors. These are first-person claims, not official lists. The Medplum, AgentPhone, Bitrig Devpost and c0mpiled pages are host or organizer sources.
- I found **no previous hackathon hosted by Terse or Agent Relay**, so there's no direct evidence of their own judging taste. The only datapoint is Karatzas judging Bitrig.
- Repo inspection covered metadata and README only. Current code may differ from what was judged.

---

## Hackathon implications (for Oct 31)

**What to build (ranked by fit with the winner patterns):**
1. **A multi-agent system where the agents are the spectacle**, for example an adversarial or negotiation arena (the Browser Brawl and Sell2Agents shape). Use **one Durable Actor per agent or per match**, so each has its own SQLite and a websocket stream to the audience. Agents talk over **Agent Relay**. This hits both bonuses, real-time, and Halloween. Possible framings: a "haunted house" where a ghost agent sabotages a guest agent, or a séance where several agents negotiate. Make the room watch it live.
2. **Durable, replayable agent state as the hero feature** (the Continuity and gud winners). Kill an agent mid-task on stage, start a fresh one, and show it resume from the actor's state. That demonstrates exactly what Durable Actors are for, in 10 seconds.
3. **Add one real-world I/O hook** if time allows: an incoming phone call, an SMS, or a live sensor or camera feed. It reliably distinguishes finalists. Keep it optional, because 5 hours is short.

**What judges and sponsors want (inferred):**
- Terse's CEO judged Bitrig, where the winners used the new primitive as the interaction. Expect him to reward projects where **actor semantics are visible**: single-writer, per-entity state, hibernation and resume, many concurrent actors. "We stored JSON in an actor" won't be enough.
- Supabase's founders picked Fizz (sensor, agent, escalation). For the "scale to millions" prize, show **a per-user or per-entity actor fan-out with Supabase as the system of record**, and put a number on it (actors spun up, messages per second).
- Bring **a number**: latency, agents running concurrently, a recovery time, a cost.

**Gotchas:**
- Five hours, with lunch included. Bitrig-style judging only lets the **top entries demo live**, and Bitrig said outright that "the Devpost Writeup is your entry and is what will be judged". Your Builderbase submission (title, one-liner, demo video, screenshot) has to earn the finalist slot on its own. Our deadline is **4:00pm**, so draft it by 3:30pm.
- Map Bitrig's published criteria onto ours. "Would this be impossible without the primitive?" becomes "would this be impossible without Durable Actors or Agent Relay?" Add originality, execution and demo, UX, and potential. Make the answer to criterion 1 explicit in the writeup.
- Earlier copies of the listing said judging would use Devpost; the current page says **Builderbase** ([hackathonradar snapshot](https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026) vs [Luma](https://luma.com/yc-meetup-7183-9316f87f)). Follow the check-in instructions.
- "All code must be created at the hackathon." Prepare the idea, accounts and keys, but write no code beforehand.
- Bitrig's judging ran 1.5h and Own Your Intelligence's ran long. Have a 60-90s demo that works offline, as a fallback recording.

**Setup before Oct 31:**
- Read the Terse Durable Actors quickstart and the Agent Relay docs. Confirm local dev works for both: CLI install, auth, and a hello-world run you then delete.
- Pre-create OpenAI, Supabase, Freestyle and Superserve accounts so credits can be applied at check-in.
- Script the demo arc first: problem in one sentence, live multi-agent run, a kill-and-resume or scale moment, a number, and a Halloween punchline.

---

## Sources

- https://luma.com/yc-meetup-4378
- https://bitrig-hacks-duo-edition.devpost.com/
- https://bitrig-hacks-duo-edition.devpost.com/project-gallery?page=1&ref_medium=email
- https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html
- https://www.digitaltrends.com/phones/the-iphone-duo-has-developers-going-wild-and-im-loving-their-creations/
- https://www.linkedin.com/posts/mahin-bharathwaj-344b8a31b_incoming-activity-7510385152649502720-_KzG
- https://www.linkedin.com/posts/benjamin-nisevich_we-just-killed-captcha-at-ycs-hackathon-activity-7510100128687579136-mBqt
- https://www.linkedin.com/posts/anshbalusa_what-if-proving-youre-human-required-a-physical-activity-7510004571235143681-jj0r
- https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent
- https://www.linkedin.com/feed/update/urn:li:activity:7503831119956549634
- https://www.linkedin.com/posts/konrad-weber_ycombinator-aiagents-x402-activity-7518042534678466560-fBEd
- https://www.linkedin.com/posts/mcp-use_activity-7517991965741948928-1XHM
- https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF
- https://www.linkedin.com/posts/ananyapradhan_makesomethingagentswant-activity-7518462153100591104-LpwM
- https://www.linkedin.com/posts/aneesh-dantuluri-78bb32288_my-team-and-i-just-won-2nd-place-at-y-combinator-activity-7517779936984637440-jVna
- https://bennisevich.com/
- https://teapawt.org/ali_uraish
- https://palaner.com/events/luma-61208c918c
- https://hackathon.supabase.com/supabase-select-2026-hackathon
- https://nitter.rdrama.net/noslopmaxima
- https://www.linkedin.com/posts/burkybang_supabaseselect-supabase-anthropic-activity-7512372936960483328-07t0
- https://www.linkedin.com/posts/rakhatbek-zholdoshkanov_i-happy-to-announce-that-me-and-karim-baba-activity-7512378274354782208--izf
- https://www.compiled.sh/articles/yc-own-your-intelligence-hackathon
- https://github.com/charliec2004/qm-motion
- https://github.com/OKKHALIL3/49th-labs
- https://github.com/ToukoUrsin/own-your-intelligence-hack
- https://www.medplum.com/blog/yc-medplum-hackathon-2026-recap
- https://www.linkedin.com/posts/ethan-bell-434a47260_really-grateful-that-our-team-took-1st-place-activity-7490229512429789184-E_6y
- https://github.com/pipecat-ai/yc-voice-agents-hackathon
- https://www.linkedin.com/posts/mayureshpp_a-few-weeks-ago-i-built-city311-a-voice-activity-7469808880928317440-W7rl
- https://www.linkedin.com/posts/anish-paleja_ai-voiceagents-healthcareai-activity-7468372554097831937-sANh
- https://agentphone.ai/callmyagent
- https://www.linkedin.com/posts/saalik-ahmed_alhamdulillahall-praise-be-to-allah-3x-activity-7452211929978286080-WWW1
- https://github.com/cactus-compute/voice-agents-hack
- https://hackhq.io/customers/browser-use-hackathon
- https://github.com/RichardHruby/browser-brawl
- https://www.linkedin.com/posts/mehul-kalia_we-won-the-y-combinator-x-browser-use-activity-7436518049903493120-sDwo
- https://www.linkedin.com/posts/ayushkumarcode_i-think-spending-close-to-a-grand-to-fly-activity-7435655468309438465-hkK-
- https://pipinstalleric.com/blog/yc-hackathon
- https://www.linkedin.com/posts/reaganhsu_dedalusgivesyouragentswings-dedalusgivesyouwings-activity-7365805210167885824-fB_7
- https://www.linkedin.com/posts/malshaik_alhamdulilah-we-won-big-at-the-first-24-activity-7365441640590729216-Zzih
- https://www.linkedin.com/posts/jingles_excited-and-humbled-we-won-the-first-24-activity-7365729729817051136-VCRs
- https://www.linkedin.com/posts/gayatrishahane_spent-a-straight-24-hours-with-some-cracked-activity-7365813073032437760-clLx
- https://www.linkedin.com/posts/kjazayeri_thank-you-openai-runloop-ai-and-tenor-activity-7500389238996271104-Q7-w
- https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026
- https://luma.com/yc-meetup-7183-9316f87f
- https://luma.com/select-2026-hackathon
- https://hackathon.supabase.com/
- https://xitter.cf/supabase/status/2108580939173372142
- https://nitter.rdrama.net/AntWilson/status/2106803568779088313
- https://github.com/napoleon1313/d402-site

---

## Verification log (2026-10-29)

Adversarial re-check of the claims that most affect decisions. Fetched live with Exa, plus `gh` for repos. LinkedIn post dates were decoded from activity IDs (the ID's upper bits are a millisecond timestamp).

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Karatzas (Terse CEO) judged Bitrig | Devpost and Luma judge lists | **Confirmed.** Both lists name him as "co-founder and CEO of Terse (F26). Previously engineer on Apple Intelligence." |
| 2 | Bitrig schedule: 11:30-15:30 hacking, 15:30-17:00 demos; top entries demo live | Luma | **Confirmed.** |
| 3 | Bitrig 1st prize = YC interview + $500 Apple + $5k OpenAI | Devpost and Notebookcheck | **Confirmed.** Added the 2nd and 3rd prizes and the RevenueCat iPhone Duo prize. |
| 4 | "Only published rubric is Browser Use" | Bitrig Devpost, Cactus README | **Refuted.** Bitrig published 5 criteria and Cactus published 2. Corrected in the header, Limits and Gotchas. |
| 5 | Bitrig turnout 157-161 / 73 projects | Devpost (157), Notebookcheck (161, 73) | **Confirmed.** Attributed each number to its source. |
| 6 | Crate team "Steven Zhang" | Steven Zhang's own post (reshared by Bharathwaj) vs Notebookcheck | **Confirmed** from the first-person post. Noted Notebookcheck's different spelling. The "0.3 seconds" and "every Duo feature does something musical" quotes match the post. |
| 7 | d402 overall 1st, YC interview, 70 teams | Weber's post (dated 2026-10-19) | **Confirmed.** Corrected the "no public repo" claim: a docs/playground repo exists. Changed "~2 days" to overnight (about 24h of build per the listed schedule). |
| 8 | Continuity: "Judges called it 'best engineered'" | Ashley Ha's post | **Partially confirmed.** The exact wording is "the most primitive native & best engineered project we saw", from one track judge. Rewrote. |
| 9 | Manufact winners Thump / Pareto / Project Y, 180+ builders | Pederzani's post | **Confirmed.** Added "80% built an MCP with Manufact". |
| 10 | Supabase announced "the winner of the Select 26 Hackathon … Fizz" | Searched Supabase's X posts and mirrors | **Not found. Quote deleted.** Replaced it with the winner's verbatim first-person post and Ant Wilson's quote-post. The Fizz win itself is confirmed. |
| 11 | Supabase Select: YC office, "about 6 hours", theme "make something agents want", 8-9 finalists | Luma, hackathon.supabase.com, Supabase X post, finalist post | **YC office confirmed** (580 20th St, and Supabase's own post). **Duration corrected** to an 8-9.5h day. **Theme marked (unverified).** Finalists: 9 per a finalist, though Luma planned 6. Submissions: 59 per the finalist vs 68 on the index; both are shown. |
| 12 | Own Your Intelligence: 91 submissions, QM Motion 1st, 49th 0/30→29/30, Support AGI -66% | compiled.sh (published 2026-10-16) and `gh` | **Confirmed.** Added 200+ participants. The repo language for qm-motion is JavaScript, not "JS/Python/Docker" (unverified beyond the primary language). Stars: 11 / 1 / 0. |
| 13 | Medplum: Aug 1, 160+ hackers, Lamina/CareLoop/LinkaChart/MedTrace, Diana Hu | Medplum recap (2026-08-03) | **Confirmed.** Diana Hu was one of 6 judges. |
| 14 | Browser Use rubric 40/20/20/20, 78 submissions, $180k+, 4-min demos, 6 rooms | HackHQ case study | **Confirmed.** Browser Brawl's stack (Convex, Haiku + CDP defender, Qwen2.5-3B on Modal) is confirmed from the README. The README says "24 hour" while HackHQ says 26h. |
| 15 | Call My Agent: 91 teams, Gavel 1st, Chief's "fails to silence" detail | agentphone.ai/callmyagent | **Confirmed** verbatim. |
| 16 | Codex Community Hackathon won by Groundtruth (Aug 2026) | Jazayeri post (decoded to 2026-09-01) | **Confirmed.** Added that the prize was a Mac mini, plus the 2nd and 3rd places. |
| 17 | Haunted Hacks listing once said Devpost, now Builderbase | hackathonradar snapshot vs Luma | **Confirmed.** Also confirmed the prize ladder: $5k/$2.5k/$1k OpenAI, $10k Freestyle, $1k Superserve, Mastra months. |

Not re-checked (low decision weight or LinkedIn-only): the hinge-CAPTCHA finalist, Milo/Streward/Cortex/Sell2Agents, City311/Substrate, the Lookout 3-of-4 prizes, and the Aug 2025 Dedalus track winners. Treat these as first-person claims.
