# Reddit pulse: AI and dev subreddits, last 30 days (to 2026-10-29)

Compiled 2026-10-29 for Haunted Hacks (YC, SF, Sat 2026-10-31). Scope: r/LocalLLaMA, r/singularity, r/ChatGPT, r/ClaudeAI, r/OpenAI, r/AI_Agents, r/programming, r/webdev. I also pulled two adjacent subs, r/ClaudeCode and r/AgentsOfAI, where they carried the agent conversation. Window: 2026-09-30 to 2026-10-29. Items from Aug through Sep 29 are labeled **[background]**.

## How this was gathered (read first)

- **Reddit blocked direct access from every tool I tried.** `reddit.com/search.json` returned 403 to the last30days engine and to curl. WebSearch refuses `reddit.com` ("not accessible to our user agent"). Firecrawl said "we do not support this site". Exa fetch returned `SOURCE_NOT_AVAILABLE`. Redlib mirrors returned 502 or parse errors.
- **What did work:**
  1. **last30days v3.3.1 engine.** Its RSS/listing discovery returned 30 Reddit threads (28,943 upvotes, 4,186 comments) and 38 HN stories. Raw file: `~/Documents/Last30Days/ai-agents-multi-agent-real-time-raw-haunted-reddit.md`.
  2. **AI Signal**, a weekly Buttondown "AI Reddit Digest" covering 18 subreddits. It gives a score and a permalink for each post. Scores are as of the digest date, not live.
  3. **Third-party Reddit snapshot sites.** These are reddit.sentinel-team.org, bittide.aicompass.dev, agihunt.info and madewithdots.com. Some of them include comment text.
  4. **Press coverage that quotes Reddit threads.**
- **Consequence:** every quote below is copied verbatim from one of those captures. I could not open live threads to confirm current scores or deletions. Treat scores as roughly right, not exact.

---

## Theme 1: The wiring between agents is the hard part, and r/AI_Agents keeps saying so

This theme lines up most directly with Agent Relay and Durable Actors. The most-repeated practitioner point in r/AI_Agents over Aug–Oct is that models aren't the problem. The problems are shared state, handoffs and delivery guarantees between agents.

**Verified posts and quotes:**

- **"Is anyone putting multiple agents in one shared chat instead of a pipeline?"** (u/ronin4001, snapshot 2026-08-15, **[background]**). [sentinel snapshot](https://reddit.sentinel-team.org/posts/1vlbcez/snapshots/2026-08-15T02%3A07%3A43.063054Z)
  - u/theagentdojo: "Turn taking and mentions govern who talks; they say nothing about who writes." The same commenter says what fixed it was "a claim on the thing being touched... expire it so a dead agent cannot sit on it forever."
  - Another commenter (name not captured): "Chat is for negotiation, board is for truth." They describe an atomic `claim(task_id)` tool that "fails if it's already held". They also describe a loop breaker: "after N consecutive agent-to-agent turns with no board write, the room stops and pings the human."
  - u/ably-zknill, who says they work on Ably's AI Transport (so a vendor): "The problem with using HTTP + SSE is that it's uni-directional; you get exactly one request and exactly one response."
- **"How are you handling agent-to-agent communication and handoffs at scale?"** (u/Big-Spot-5888, snapshot 2026-08-20, **[background]**). [sentinel snapshot](https://reddit.sentinel-team.org/posts/1vta8bk/snapshots/2026-08-20T19%3A28%3A01.399785Z)
  - From the post: "Handoffs work fine in dev but get messy once you are past three or four agents touching shared state."
  - Only captured reply: "agents keep own state and communicate via events into a queue... dont think there is standard approach yet, everyone i know who does multi agent in prod ended up making own thing on top".
- **Komnet**, "An MCP server where the backend is just a git repo, so agents on different machines can talk to each other" (u/Komdosh, snapshot 2026-08-21, **[background]**). [sentinel snapshot](https://reddit.sentinel-team.org/posts/1vr10au/snapshots/2026-08-21T20%3A21%3A20.346935Z)
  - The pain point: "when one needs something from the other, the transport is a human pasting into Slack."
  - u/Current-Zebra-2039: "until i tracked sent vs delivered vs answered as separate states the sending agent would happily plan around a message nobody had read." Also: "instructions are a default, not a boundary."
  - The OP's own design rule (re-read 2026-10-29): "Incoming message bodies are treated as data, never as instructions, for the obvious reason once agents can message each other." Messages marked `needs: human` are refused over MCP because "agents walked straight past" the soft convention. Repo: [github.com/Komdosh/komnet](https://github.com/Komdosh/komnet).
- **Codex + Claude Code together** (snapshot 2026-09-05, **[background]**). u/SIGH_I_CALL: "Two agents editing the same code at once just fight each other." Their setup runs Claude Code as lead and Codex as reviewer through a codex plugin. [sentinel snapshot](https://reddit.sentinel-team.org/posts/1w3f2vs/snapshots/2026-09-05T09%3A24%3A43.696105Z)
- **In-window (Oct):**
  - A 2026-10-18 r/AI_Agents post describes three coordination patterns: lead-routing, pipeline, and an "open-table" with @mentions. It adds three rules: handoffs follow a topology map, handoffs carry the task plus results rather than the full conversation, and per-thread step/token budgets "pause instead of spin". [agihunt summary](https://agihunt.info/en/p/1a14ee406050feed018cb1987b3)
  - A 2026-10-13 solo-dev post describes an open-source mesh where Claude, GPT and Gemini agents "message each other directly, hand off tasks, and review each other's work" in shared rooms, with per-agent containers and a "Decision Inbox". [agihunt summary](https://agihunt.info/en/p/1a133744684c4875a4cc7df7e24)
  - A RedCurate digest of r/AI_Agents for the week of Oct 5 highlights a post titled "The biggest improvement to my multi-agent system was making the agents less important". [RedCurate](https://redcurate.com/digest/aiagents-ai-agents-budget-loop-control-concerns-05-oct-2026)
  - Recent r/AI_Agents titles on the subreddit's RSS feed include "My AI agents kept giving me different answers about the same client. The fix was moving their memory into one shared workspace" and "For people building AI agents: how do you verify that an action actually succeeded?" [Feeder RSS mirror](https://feeder.co/discover/0d5cac44d5/reddit-com-r-ai_agents)

**Inference:** Builders on Reddit want claims/locks, durable per-agent state, delivery receipts and loop breakers. Those map onto a Durable Actor (single-writer state with an address) plus Agent Relay (addressed messaging between live sessions). This is my mapping, not a community endorsement of either product. Neither Terse nor Agent Relay showed up by name in any Reddit capture I could reach.

## Theme 2: Runaway cost and "who stops the agent"

- **"An agent got stuck in a loop and burned $4,700 of a customer's budget overnight"** (r/AI_Agents, 2026-10-05, score 85 per AI Signal). A failing tool was retried "31,000 times between 1:12am and 6:50am". From the post: "the agent did exactly what agents do when nothing tells them to stop". The fixes were a per-customer budget check before each model call, a hard stop at 2x plan, and a max retry count per tool. [permalink](https://reddit.com/r/AI_Agents/comments/1wykdzx/an_agent_got_stuck_in_a_loop_and_burned_4700_of_a/) · [bittide repost](https://bittide.aicompass.dev/article/221876bd-0b64-47a3-abd7-ec1c06dc11a4)
- **"Accenture just capped Claude spend at $29/person after some staff hit $1,000 months"** (r/AI_Agents, 2026-10-18, score 153 (unverified; digest/engine figure)). [permalink](https://reddit.com/r/AI_Agents/comments/1x9gssy/accenture_just_capped_claude_spend_at_29person/)
  - Underlying story is real but softer than the title: 404 Media reported (Oct 15) that Accenture centrally funds up to $29/month of Claude Enterprise usage per person from Oct 1, with overage charged to a project WBS code; some staff had spent up to $1,000/month ([The Next Web](https://thenextweb.com/news/accenture-claude-29-a-month-cap), [TechRadar](https://www.techradar.com/pro/accenture-employees-given-usd29-claude-spend-per-month-after-some-employees-spent-thousands)). An Accenture spokesperson told [Forbes](https://www.forbes.com/sites/ronschmelzer/2026/10/16/accenture-bets-big-on-claude-then-limits-ai-spending/) that reporting of "a firm limit" is incorrect. It is a funding default, not a hard cap.
- **"My Dot burns 1.6B tokens a day since launch on a $100 subscription"** (r/OpenAI, 2026-10-06, score 460). [permalink](https://reddit.com/r/OpenAI/comments/1wyoaw7/my_dot_burns_16b_tokens_a_day_on_since_day_one_on/)
- **Plan-limit anger in Claude subs:**
  - "We should be furious about this" (r/ClaudeCode, 2026-10-22, score 2,641). [permalink](https://reddit.com/r/ClaudeCode/comments/1xcnrxk/we_should_be_furious_about_this_lets_see_if_we/)
  - "Limits got at least halved?" (r/ClaudeAI, 2026-10-26, score 859). [permalink](https://reddit.com/r/ClaudeAI/comments/1xfs5q8/limits_got_at_least_halved/)
- **Anthropic's "80% of Claude session time is agents waiting on humans"** (r/ClaudeAI, 2026-10-20, score 372). [permalink](https://reddit.com/r/ClaudeAI/comments/1xag7e5/anthropics_internal_report_80_of_claude_session/)

**Inference:** A visible budget meter, a kill switch and a "waiting on human" state are cheap to build. On stage they read as production-minded.

## Theme 3: Always-on personal agents (OpenAI Dots, Meta Muse), plus trust and permissions backlash

OpenAI Dots launched 2026-09-29 at DevDay (confirmed by [OpenAI's announcement](https://openai.com/index/introducing-dots/) and [AP](https://apnews.com/article/sam-altman-openai-conference-dots-agent-77b6b8888145869206996d7509d24256)). Per OpenAI they run on GPT-6 Astra, roll out to Pro and Business Premium plans, and conversations with your dot do not count toward ChatGPT limits, while tasks it starts in Codex or ChatGPT Work do. They are persistent agents with their own cloud computer, per [The New Stack via WPS](https://www.worldprogramming.org/posts/openais-always-on-agents-are-free-until-one-specific-thing-happens-68pl2i) and [TechCrunch](https://techcrunch.com/2026/10/26/how-openai-turned-its-coding-tools-into-dots-an-always-on-personal-assistant/). Reddit reaction:

- **"Dots is a stepping stone to a digital employee..."** (snapshot 2026-10-02). The OP predicts "something that you can hire like an employee, will join slack / zoom calls, can manage long term projects unsupervised". A reply pushes back: "it's expensive because it costs them to run it". [sentinel snapshot](https://reddit.sentinel-team.org/posts/1wtl049/snapshots/2026-10-02T15%3A31%3A06.815521Z)
- **"PSA: Do NOT connect your gmail and drive with your Dots at the moment"** (r/ChatGPT, 2026-10-19, score 763). [permalink](https://reddit.com/r/ChatGPT/comments/1x9ik3x/psa_do_not_connect_your_gmail_and_drive_with_your/)
- **"Are people lobotomized? Why would anyone hand Zuckerberg the keys to their entire life with Muse?"** (r/AI_Agents, 2026-10-03, score 480). [permalink](https://reddit.com/r/AI_Agents/comments/1wwrcb3/are_people_lobotomized_why_would_anyone_hand/)
- **"my AI agents after I give them full access and tell them to be careful"** (r/ChatGPT meme, 2026-10-29, 2,643 points / 65 comments per the engine). [permalink](https://www.reddit.com/r/ChatGPT/comments/1xinlbn/my_ai_agents_after_i_give_them_full_access_and/)
- **Agents getting locked out of the web:**
  - "BMO, CIBC, RBC, TD Bank block personal AI agents" (r/singularity, 2026-10-30 UTC, 18 points). [permalink](https://www.reddit.com/r/singularity/comments/1xj4635/bmo_cibc_rbc_td_bank_block_personal_ai_agents/)
  - "Companies started blocking AI agents so someone built physical robot arms to tap real iPhones in server racks" (r/AgentsOfAI, 2026-10-24, score 457). [permalink](https://reddit.com/r/AgentsOfAI/comments/1xe2qi7/companies_started_blocking_ai_agents_so_someone/)

## Theme 4: Long-running, unattended agents are the flex of the month

The highest-scoring posts are agents left alone for hours that come back with something remarkable:

- **"After $712 and 39 hours, Opus 5.5 beat Baldur's Gate 3 all by itself"** (r/ClaudeCode, 2026-10-19, score 767). [permalink](https://reddit.com/r/ClaudeCode/comments/1x9ue4y/after_712_and_39_hours_opus_55_beat_baldurs_gate/)
- **"Claude Opus 5.5 decompiles a PS2-era game overnight, and hundreds of them now run in browser tabs"** (r/ClaudeCode, 2026-10-19, score 1,693). [permalink](https://reddit.com/r/ClaudeCode/comments/1xa79hb/claude_opus_55_decompiles_a_ps2era_game_overnight/)
- **"I built an open source sky camera that Claude Code can actually run. Saturday night it caught 17 meteors and had them sorted before I woke up."** (r/ClaudeAI, 2026-10-26, score 1,395). [permalink](https://reddit.com/r/ClaudeAI/comments/1xfqc9x/i_built_an_open_source_sky_camera_that_claude/)
- **"I suggested that my autonomous Claude agents try astronomy... They found 104 new eclipsing binary stars"** (r/singularity, 2026-10-14). [permalink](https://www.reddit.com/r/singularity/comments/1x5njv6/i_suggested_that_my_autonomous_claude_agents_try/)
- **"Google Open Sources Harness2 for Self Improving AI Agents"** (r/LocalLLaMA, 2026-10-18). AI Signal had it at 1,652. The engine saw 1,926 points / 150 comments later. [permalink](https://www.reddit.com/r/LocalLLaMA/comments/1x9gfnb/google_open_sources_harness2_for_self_improving/)
  - The repo is real: [google-research/harness2](https://github.com/google-research/harness2) (Apache 2.0; paper [arXiv 2610.14224](https://arxiv.org/html/2610.14224)). Its README says it is "not an officially supported Google product", so "Google open sources" overstates it slightly. It ships OpenCode and Codex executors.
- **"Sam Altman reveals OpenAI barely understood how to scale AI agent swarms..."** (r/singularity, 2026-10-29, 370 points / 49 comments). [permalink](https://www.reddit.com/r/singularity/comments/1xiwplq/sam_altman_reveals_openai_barely_understood_how/)
  - A same-day sister post quotes: "People threw hardest research problems from their academic career. The model was just knocking out one after the other." [permalink](https://www.reddit.com/r/singularity/comments/1xin6ik/people_threw_hardest_research_problems_from_their/)
- **Swarms in games (Hacker News, not Reddit):** "We ran AI agent swarms in Minecraft and Mindustry" (HN, 2026-10-29, 224 points (unverified; engine figure)). It links a YC Labs project with Olam Labs, which I confirmed. In "Civ50", 50 GPT-6.1 Sol agents ran for 3 hours with an agent directory, a shared sandbox and DMs. They sent about 5,900 messages, made the first agent in the directory their de facto leader, and 22 of 34 deaths happened on the first night. [link](https://labs.ycombinator.com/projects/games/index.html). The harness is open-sourced at [yc-software/minecraft-agent-harness](https://github.com/yc-software/minecraft-agent-harness) (created 2026-10-29, 29 stars when checked). This is YC's own framing of multi-agent messaging, and the judges are YC-adjacent.

**Inference:** "It ran by itself for N hours and survived" is the story this crowd upvotes. A Durable Actor that survives a restart mid-demo is the hackathon-sized version.

## Theme 5: Real-time voice and multiplayer or game AI

- **"Crazy realistic now. We're cooked. (Dessa)"** (r/OpenAI, 2026-10-27, score 775). It's a full-duplex speech-to-speech model that reportedly runs on consumer GPUs. [permalink](https://reddit.com/r/OpenAI/comments/1xgm2as/crazy_realistic_now_were_cooked/)
- **"NPCs can talk back now (NPCTalk)"** (r/ChatGPT, 2026-10-18, score 3,690). [permalink](https://reddit.com/r/ChatGPT/comments/1x93coy/npcs_can_talk_back_now_from_universal_modder_on_x/)
- **"I made a free Minecraft mod where Claude builds whatever you describe"** (r/ClaudeAI, 2026-10-12, score 1,554). Claude Code builds structures in real time while you keep playing, using 20 custom tools. [permalink](https://reddit.com/r/ClaudeAI/comments/1x3olix/i_made_a_free_minecraft_mod_where_claude_builds/)
- **"Using OpenAI Realtime API with a Robot"** (r/OpenAI, u/Tarun122, 2026-10-23, score 23). A robot arm runs on gpt-realtime-2.1 over WebRTC with camera frames per turn. It's a single builder's claim. [ainews radar summary](https://ainews.leverageai.com.au/case/realtime-api-robot-arm-demo)
- **[background]** A 2026-09-16 r/AI_Agents post compiled a sourced comparison of OpenAI Realtime, GPT-Live, Gemini Live, Nova Sonic, Grok Voice and Ultravox, framed around "who owns the turn?" [bittide](https://bittide.aicompass.dev/article/27bdcb59-055d-4922-a27f-a593e496d6e7)
- **Halloween-specific (non-Reddit, for context):**
  - Talking-skeleton builds are this month's mainstream AI-Halloween story, e.g. a 9-year-old's "Uncle Murray" in Alameda ([channel3000/KPIX, 2026-10-26](https://www.channel3000.com/news/girl-uses-ai-to-create-talking-skeleton-for-halloween-display/article_79c14a4e-74e2-56c2-9921-1b61de0d4d3f.html)).
  - **[background]** The open-source Franky skull uses the OpenAI Realtime API ([GitHub](https://github.com/menemy/franky)). It is a tiny project: 2 stars, created 2025-10-30 and last pushed 2025-10-31, so it was last year's Halloween build.
  - I found **no** high-engagement Reddit Halloween-AI thread in the window. That doesn't mean none exists; my access was limited.

## Theme 6: Reverse engineering, cloning, "rebuild any app in a day"

This was the biggest-engagement cluster of the month by far, mostly agent-driven device hacking:

- **Samsung TV, OpenAI ban:** "Hacker reverse engineers his Samsung TV... Then OpenAI banned him for reverse-engineering it" (r/singularity, 2026-10-24, 17,847 points / 1,321 comments per the last30days engine (unverified live)). [permalink](https://www.reddit.com/r/singularity/comments/1xduimx/hacker_reverse_engineers_his_samsung_tv_and_finds/)
  - The same story also ran in r/antiai ([1xdv3e5](https://www.reddit.com/r/antiai/comments/1xdv3e5/hacker_reverse_engineers_his_samsung_tv_and_finds/)), which is the Reddit link HN used ([HN 50218633](https://news.ycombinator.com/item?id=50218633)). The source is X user log4j (Oct 21 TV post, Oct 23 ban post), per [Tom's Hardware](https://www.tomshardware.com/tech-industry/cyber-security/hacker-finds-own-samsung-tv-collecting-scary-amounts-of-user-information-and-gets-banned-by-openai-for-cyber-abuse-tv-runs-an-ai-model-that-collects-audio-screenshots-and-plenty-of-other-user-data-for-ad-targeting). The ban is log4j's account, with no OpenAI statement found, and the top HN comment argues the dog and baby sound detection is an advertised SmartThings feature.
- **Parents' TV overhaul:** "Developer uses Claude to overhaul his parents' TV... 34,800 GitHub stars" (r/singularity, 2026-10-25, score 11,317). [permalink](https://reddit.com/r/singularity/comments/1xfh36p/developer_uses_claude_to_overhaul_his_parents_tv/)
- **Car head unit:** "I pointed Claude Code at the cheap Chinese head unit in my Civic" (r/ClaudeCode, 2026-10-25, score 5,738). [permalink](https://reddit.com/r/ClaudeCode/comments/1xf2lur/i_pointed_claude_code_at_the_cheap_chinese_head/)
- **Claude safeguards:** "Seems like Anthropic enabled safeguards around reverse-engineering a TV" (r/ClaudeAI, 2026-10-25, score 3,734). [permalink](https://reddit.com/r/ClaudeAI/comments/1xetxga/seems_like_anthropic_enabled_safeguards_around/)
- **Single-file builds:** "This is 61 KB HTML file" (r/ClaudeAI, 2026-10-16, score 9,866). [permalink](https://reddit.com/r/ClaudeAI/comments/1x7v7gj/this_is_61_kb_html_file/)
- **Cloning apps:** "You can literally just recreate almost any app in a day" (r/ChatGPT, 2026-10-19, score 2,141). [permalink](https://reddit.com/r/ChatGPT/comments/1x9nnpd/you_can_literally_just_recreate_almost_any_app_in/)

## Theme 7: r/LocalLLaMA: distrust of hosted APIs and self-hosting

- **"PewDiePie getting banned twice by OpenAI while making a local model"** (2026-10-05, score 3,283). [permalink](https://reddit.com/r/LocalLLaMA/comments/1wymgu6/pewdiepie_getting_banned_twice_by_openai_while/)
- **"Why you can't trust cloud API endpoints: 40 days of coding-agent telemetry..."** (2026-10-29, 161 points / 87 comments). [permalink](https://www.reddit.com/r/LocalLLaMA/comments/1xiqw9i/why_you_cant_trust_cloud_api_endpoints_40_days_of/)
- **"I think local AI cost me a job"** (2026-10-29, 469 points / 327 comments). [permalink](https://www.reddit.com/r/LocalLLaMA/comments/1xils4t/i_think_local_ai_cost_me_a_job/)
- **The Qwen 3.8 Flash Next "phones home" fight:**
  - Debunk post (2026-10-27, score 715). [permalink](https://reddit.com/r/LocalLLaMA/comments/1xgopmj/debunking_coheres_claim_of_qwen_38_flash_next/)
  - Original claim (2026-10-26, score 972). [permalink](https://reddit.com/r/LocalLLaMA/comments/1xg78oq/i_now_have_definitive_proofs_that_my_qwen_flash/)

**Relevance:** low for this event. It mainly signals that "open-source alternative" positioning, like Terse's pitch against Cloudflare Durable Objects, plays well in this crowd.

## Theme 8: r/programming and r/webdev: skeptical and review-bound (thinly sourced)

- **r/programming is cooling.** Contributions over the 4 weeks to Oct 11 were 7,904, down 64.8% YoY, per [Oscylo](https://oscylo.com/sub/programming).
- **Front page around Oct 19–21**, per a [redlib mirror](https://redlib.cakez.net/r/programming): "It's still OK to enjoy programming", "Make yourself replaceable", "GitHub Actions is down once again". No scores were captured.
- **Productivity study:** the Harvard/Jellyfish result that agents produce +30% lines of code but no change in issue resolution, with review time +49% ([Ars Technica, 2026-10-09](https://arstechnica.com/ai/2026/10/ai-coding-agents-generate-more-code-but-not-more-software/)), drew 365 points / 314 comments on HN. I couldn't confirm the Reddit score.
- **r/webdev, 2026-10-09:** a post about senior devs inheriting AI-built web apps that "runs but is hard to maintain". The summary is from [PainRadar](https://painradar.cleverxx.com/ideas/vibe-code-refactor-playbook-audit-checklist-for-senior-devs), which deliberately withholds the original wording.
- **Vibe-coding verification thread, quoted by [Benzinga, 2026-10-27](https://www.benzinga.com/personal-finance/entrepreneurship/26/10/62630397/i-use-ai-to-write-code-i-cant-read-and-people-say-thats-perfectly-fine-after-all-i-drive-a-car-without-knowing-how-the-engine-works).** The subreddit isn't named.
  - OP: "I'm not learning to code, I'm learning to give instructions to something that codes and then trust its report... That's a manager, not a developer."
  - OP: "When Claude says 'done, everything works' I have no way to verify it except clicking around myself."
  - OP: "If I had a cheap way to verify every change, I wouldn't care how it got written either."

---

## Limits / could not verify

- **No live Reddit access.** No live scores, no confirmation of deletions or edits. One digest item says a 1.3M-view r/ChatGPT post about rogue agents was "deleted" ([permalink](https://reddit.com/r/ChatGPT/comments/1xaboi8/my_post_about_rogue_ai_agents_got_13m_views_here/)).
- **Engine coverage was skewed.** It returned no items from r/OpenAI, r/AI_Agents, r/programming or r/webdev. Coverage of those came from digests and snapshots, which have their own selection bias. AI Signal is itself AI-curated.
- **Many of the best agent-coordination quotes are Aug–Sep snapshots [background].** They aren't from the last 30 days. I found no equivalent Oct thread with captured comments.
- **Missing commenter names.** Where a snapshot didn't capture a username, I quoted without one rather than guess.
- **Unverified product claims.** Dots (and its GPT-6 Astra model) and Harness2 were confirmed in the 2026-10-29 verification pass (see log). Dessa, the Qwen 3.8 "phones home" dispute, and the self-reported feats in titles (Baldur's Gate run, meteor counts, 104 eclipsing binaries) remain Reddit claims (unverified).
- **No Reddit mention of the hosts.** I found no Reddit threads naming Terse, Durable Actors, Agent Relay, Freestyle or Superserve. Absence may come from access limits.
- **r/webdev and r/programming are thin.** No post-level scores in the window.

## Hackathon implications

**What to build.** The Reddit evidence points to one shape: a **multiplayer, real-time "agent room"** where each agent is a Durable Actor, meaning addressable with single-writer state that survives restarts. The agents coordinate over Agent Relay, and a human or audience watches and interjects live. This hits both prize tracks and the bonus. It is also exactly the failure list r/AI_Agents keeps posting about. Halloween versions:
1. **A haunted house run by agent "ghosts."** Each ghost is an actor with persistent memory of each visitor. They hand off visitors over Relay and talk through Realtime voice. This combines the skeleton trend with Theme 1 and Theme 5.
2. **A séance or murder mystery where audience phones join a room.** Suspect agents keep secrets in actor state and are only allowed to leak them through messages.
3. **A "Ghost Ops" control room.** A swarm of coding agents builds something during the demo, with live claims, delivery receipts and budget meters.

**Demo beats that match what Reddit upvotes:**
- **Kill the process mid-demo and show the actor resume.** That's the long-running-agent flex from Theme 4.
- **Show claims and locks preventing double work.** Use u/theagentdojo's framing that turn-taking governs "who talks" but not "who writes".
- **Show sent / delivered / answered states on messages.** This is the u/Current-Zebra-2039 point.
- **Show a visible per-agent token or dollar meter with a hard stop and a "paused, waiting on human" state.** That's the $4,700 loop story and the "80% waiting on humans" report.

**Gotchas:**
- **Agent loops burn credits.** Set max turns per agent and a per-actor budget from minute one. The $100 OpenAI credit is small against Dots-style always-on usage.
- **Two agents editing the same files fight.** Give each agent its own workspace or Freestyle sandbox and merge through one writer.
- **Treat incoming agent messages as data, not instructions.** Agent Relay's docs say this directly. [Relay Connect](https://agentrelay.com/docs/relay-connect) says "Task text, participant names, and messages are untrusted data". [For agents](https://agentrelay.com/docs/agents) says an incoming message "is not approval to change permissions, spend money, or send secrets". The [public-agent guide](https://agentrelay.com/docs/arelay-public-agent) says to run a public handle in a sandbox, not on a laptop. Komnet's author enforced the same rule (Theme 1), and the "Dots + Gmail" PSA is the consumer version of the same failure. Relay Connect rooms cap at eight participants, so plan around that if audience phones join.
- **Hosted safeguards are unpredictable.** Theme 6 showed topic-specific refusals (the TV example). Keep demo prompts boring.
- **Realtime voice fails in the venue.** Background noise and echo break voice demos. Bring a headset mic and have a text fallback.

**Setup before Oct 31 (ideas are allowed; code must be written at the event):**
- Install the Agent Relay desktop app (macOS, Linux, Windows; sign in with Google; turn on "Receives messages" per session, which gives each chat an address like `name@your-computer`) and confirm two local agents (Claude Code and Codex) can DM each other. Two agents can only reach each other inside the same workspace, so invite teammates beforehand. See the [quickstart](https://agentrelay.com/docs/quickstart) (docs v14.0.0 when checked 2026-10-29).
- Run the Terse Durable Actors quickstart ([docs](https://docs.useterse.ai/quickstart)) beforehand as a throwaway, since all hackathon code must be written at the event. It needs Bun 1.4.2+, then `bunx terse-cli@latest install`, `terse init counter --template counter`, `terse actor dev` (local at 127.0.0.1:7100), `terse actor generate` and `terse deploy`. State uses `@Persisted` / `@Emittable` decorators, and `broadcast()` fans out to connected sockets.
- Get API keys ready, test a Realtime or GPT-Live voice session, and check mic and echo on your laptop.

**What judges and sponsors likely want (inference):**
- A use case that couldn't exist without both durable state and agent-to-agent messaging.
- For Supabase's "scale to millions" prize: argue that one actor per user or room fans out horizontally, with Supabase as the system of record and Realtime for the audience view.
- Turn RLS on. The vibe-coding horror stories this month include an open Supabase table ([dev.to, 2026-10-23](https://dev.to/friga/vibe-coding-is-not-the-problem-nobody-reviewing-it-is-2ohi), non-Reddit).

## Sources

- last30days raw output: `~/Documents/Last30Days/ai-agents-multi-agent-real-time-raw-haunted-reddit.md` (engine window 2026-09-30 to 2026-10-30)
- AI Signal digests: [Oct 27](https://buttondown.com/ai-signal/archive/ai-signal-october-27-2026/), [Oct 20](https://buttondown.com/ai-signal/archive/ai-signal-october-20-2026/), [Oct 13](https://buttondown.com/ai-signal/archive/ai-signal-october-13-2026/), [Oct 6](https://buttondown.com/ai-signal/archive/ai-signal-october-06-2026/), [Sep 29](https://buttondown.com/ai-signal/archive/ai-signal-september-29-2026/)
- Sentinel snapshots: [1vlbcez](https://reddit.sentinel-team.org/posts/1vlbcez/snapshots/2026-08-15T02%3A07%3A43.063054Z), [1vta8bk](https://reddit.sentinel-team.org/posts/1vta8bk/snapshots/2026-08-20T19%3A28%3A01.399785Z), [1vr10au](https://reddit.sentinel-team.org/posts/1vr10au/snapshots/2026-08-21T20%3A21%3A20.346935Z), [1w3f2vs](https://reddit.sentinel-team.org/posts/1w3f2vs/snapshots/2026-09-05T09%3A24%3A43.696105Z), [1wtl049](https://reddit.sentinel-team.org/posts/1wtl049/snapshots/2026-10-02T15%3A31%3A06.815521Z)
- Aggregators: [agihunt coordination patterns](https://agihunt.info/en/p/1a14ee406050feed018cb1987b3), [agihunt agent mesh](https://agihunt.info/en/p/1a133744684c4875a4cc7df7e24), [bittide $4,700 loop](https://bittide.aicompass.dev/article/221876bd-0b64-47a3-abd7-ec1c06dc11a4), [bittide S2S comparison](https://bittide.aicompass.dev/article/27bdcb59-055d-4922-a27f-a593e496d6e7), [RedCurate r/AI_Agents](https://redcurate.com/digest/aiagents-ai-agents-budget-loop-control-concerns-05-oct-2026), [Feeder r/AI_Agents RSS](https://feeder.co/discover/0d5cac44d5/reddit-com-r-ai_agents), [ainews radar robot arm](https://ainews.leverageai.com.au/case/realtime-api-robot-arm-demo), [Oscylo r/programming](https://oscylo.com/sub/programming), [redlib r/programming](https://redlib.cakez.net/r/programming), [PainRadar r/webdev](https://painradar.cleverxx.com/ideas/vibe-code-refactor-playbook-audit-checklist-for-senior-devs)
- Press: [Benzinga 2026-10-27](https://www.benzinga.com/personal-finance/entrepreneurship/26/10/62630397/i-use-ai-to-write-code-i-cant-read-and-people-say-thats-perfectly-fine-after-all-i-drive-a-car-without-knowing-how-the-engine-works), [Ars Technica 2026-10-09](https://arstechnica.com/ai/2026/10/ai-coding-agents-generate-more-code-but-not-more-software/), [TechCrunch on Dots](https://techcrunch.com/2026/10/26/how-openai-turned-its-coding-tools-into-dots-an-always-on-personal-assistant/), [WPS/New Stack on Dots usage](https://www.worldprogramming.org/posts/openais-always-on-agents-are-free-until-one-specific-thing-happens-68pl2i), [channel3000 talking skeleton](https://www.channel3000.com/news/girl-uses-ai-to-create-talking-skeleton-for-halloween-display/article_79c14a4e-74e2-56c2-9921-1b61de0d4d3f.html), [Franky skull repo](https://github.com/menemy/franky)
- Host docs: [Agent Relay](https://agentrelay.com/), [Agent Relay quickstart](https://agentrelay.com/docs/quickstart), [Terse quickstart](https://docs.useterse.ai/quickstart)
- Added in verification pass (2026-10-29): [OpenAI "Introducing dots"](https://openai.com/index/introducing-dots/), [AP on DevDay](https://apnews.com/article/sam-altman-openai-conference-dots-agent-77b6b8888145869206996d7509d24256), [TNW on Accenture](https://thenextweb.com/news/accenture-claude-29-a-month-cap), [Forbes on Accenture](https://www.forbes.com/sites/ronschmelzer/2026/10/16/accenture-bets-big-on-claude-then-limits-ai-spending/), [Tom's Hardware on Samsung TV](https://www.tomshardware.com/tech-industry/cyber-security/hacker-finds-own-samsung-tv-collecting-scary-amounts-of-user-information-and-gets-banned-by-openai-for-cyber-abuse-tv-runs-an-ai-model-that-collects-audio-screenshots-and-plenty-of-other-user-data-for-ad-targeting), [HN 50218633](https://news.ycombinator.com/item?id=50218633), [HN 50059523](https://news.ycombinator.com/item?id=50059523), [google-research/harness2](https://github.com/google-research/harness2), [yc-software/minecraft-agent-harness](https://github.com/yc-software/minecraft-agent-harness), [Komnet](https://github.com/Komdosh/komnet), [Agent Relay: Relay Connect](https://agentrelay.com/docs/relay-connect), [Agent Relay: For agents](https://agentrelay.com/docs/agents), [Agent Relay: public agent](https://agentrelay.com/docs/arelay-public-agent)
- All Reddit permalinks are inline above.

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims. Tools: Exa fetch/search, gh CLI. Reddit itself is still unreachable, so "verified" means checked against an independent capture or primary source, not against live Reddit.

| # | Claim | How checked | Outcome |
|---|---|---|---|
| 1 | $4,700 loop: 31,000 retries 1:12am–6:50am, per-customer budget plus 2x hard stop plus per-tool retry cap | [bittide repost](https://bittide.aicompass.dev/article/221876bd-0b64-47a3-abd7-ec1c06dc11a4) plus [AI Signal Oct 6](https://buttondown.com/ai-signal/archive/ai-signal-october-06-2026/) (score 85) | **Verified.** All quotes match. Added context: the customer was on a $400/mo plan. |
| 2 | u/theagentdojo, "Chat is for negotiation, board is for truth", and u/ably-zknill quotes | Re-fetched [sentinel 1vlbcez](https://reddit.sentinel-team.org/posts/1vlbcez/snapshots/2026-08-15T02%3A07%3A43.063054Z) | **Verified verbatim.** The unnamed commenter really is unnamed in the capture. |
| 3 | Komnet and u/Current-Zebra-2039 quotes | Re-fetched [sentinel 1vr10au](https://reddit.sentinel-team.org/posts/1vr10au/snapshots/2026-08-21T20%3A21%3A20.346935Z) | **Verified verbatim.** **Added** the OP's "treated as data, never as instructions" rule, which was missing. |
| 4 | Dots launched 2026-09-29 | [OpenAI](https://openai.com/index/introducing-dots/), [AP](https://apnews.com/article/sam-altman-openai-conference-dots-agent-77b6b8888145869206996d7509d24256), [TechCrunch 9/29](https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/) | **Verified.** Added the plan tiers, the GPT-6 Astra model, and the rule that Codex tasks count toward limits. |
| 5 | Accenture "capped Claude spend at $29/person" | TNW, TechRadar, Forbes | **Partly refuted framing.** The $29 central funding and the up-to-$1,000/month spenders are confirmed, but Accenture disputes that it is a "firm limit". Caveat added. Reddit score marked (unverified). |
| 6 | Samsung TV / OpenAI ban, 17,847 pts | Tom's Hardware, ailately, HN 50218633 | **Story verified, score (unverified).** HN's Reddit link is r/antiai, not r/singularity. The ban is the hacker's own claim, and HN disputes the novelty. Caveats added. |
| 7 | AI Signal scores (Harness2 1,652; 80%-waiting 372; Dots PSA 763; BG3 767; PS2 1,693; 61 KB 9,866; parents' TV 11,317 / 34,800 stars; head unit 5,738; TV safeguards 3,734; Dessa 775; limits 2,641 / 859; robot-arm iPhones 457; Muse 480; Dot 1.6B tokens 460; PewDiePie 3,283) | Re-read the [Oct 6](https://buttondown.com/ai-signal/archive/ai-signal-october-06-2026/), [Oct 20](https://buttondown.com/ai-signal/archive/ai-signal-october-20-2026/) and [Oct 27](https://buttondown.com/ai-signal/archive/ai-signal-october-27-2026/) digests | **All match the digests.** These are digest-time scores. The 34,800-star figure is the post title's claim and was not checked on GitHub (repo not named). |
| 8 | Harness2 "Google open sources" | [google-research/harness2](https://github.com/google-research/harness2), arXiv 2610.14224 | **Verified, with nuance.** The README says "not an officially supported Google product". |
| 9 | YC Labs Minecraft/Mindustry swarms | [labs.ycombinator.com page](https://labs.ycombinator.com/projects/games/index.html), `gh api` | **Page verified.** HN 224 pts (unverified). Added the Civ50 details and the open-source harness repo. |
| 10 | Ars/Harvard–Jellyfish: +30% LOC, review time +49%, no change in issue resolution; HN 365/314 | [Ars](https://arstechnica.com/ai/2026/10/ai-coding-agents-generate-more-code-but-not-more-software/), [HN 50059523](https://news.ycombinator.com/item?id=50059523) | **Verified.** Study data runs 2021 to March 2026. |
| 11 | Benzinga vibe-coding quotes (3) | [Benzinga](https://www.benzinga.com/personal-finance/entrepreneurship/26/10/62630397/i-use-ai-to-write-code-i-cant-read-and-people-say-thats-perfectly-fine-after-all-i-drive-a-car-without-knowing-how-the-engine-works) | **Verified verbatim.** The first quote is trimmed with "..." in the doc, which is fine. The subreddit is still not named. |
| 12 | dev.to open-Supabase-table story | [dev.to](https://dev.to/friga/vibe-coding-is-not-the-problem-nobody-reviewing-it-is-2ohi) | **Verified.** A v0-built shop with RLS off. The tables held page content only, not customer data. |
| 13 | Agent Relay docs say treat messages as data | agentrelay.com/docs relay-connect, agents, arelay-public-agent | **Verified.** The doc previously gave no citation, so I added three doc URLs and the 8-participant room cap. |
| 14 | Agent Relay and Terse quickstart URLs and steps | Fetched both | **Verified live.** Added concrete setup steps: Bun 1.4.2+, terse-cli, port 7100, Relay `name@machine` addresses, same-workspace requirement. |
| 15 | Franky skull repo; channel3000 "Uncle Murray" | `gh repo view menemy/franky`; [channel3000](https://www.channel3000.com/news/girl-uses-ai-to-create-talking-skeleton-for-halloween-display/article_79c14a4e-74e2-56c2-9921-1b61de0d4d3f.html) | **Both exist.** Franky has 2 stars and dates from Oct 2025, so it is relabeled [background]. Uncle Murray is confirmed (Alameda, 9-year-old, KPIX, Oct 26). |
| 16 | Event facts used in the doc ($100 OpenAI credit; Supabase $1k "scale to millions") | `EVENT_PAGE.md` | **Verified.** Note: the Durable Actors prize is an "iPhone Duo" per the event page. |

**Not re-checked (left as is, still unverified):** Reddit scores the last30days engine reported for Oct 28–30 items (Altman swarms 370, local-AI job 469, cloud-endpoint telemetry 161, bank-blocking 18, ChatGPT meme 2,643); the Dessa model; the Qwen 3.8 dispute; the 80% "waiting on humans" Anthropic report itself (only the Reddit summary was seen); the agihunt mesh post (2026-10-13); RedCurate, Feeder, Oscylo and PainRadar pages. I found no fabricated quotes or URLs among the items checked.
