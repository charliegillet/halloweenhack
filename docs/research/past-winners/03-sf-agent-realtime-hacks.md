# SF agent and realtime hackathons, Jul-Oct 2026: winners, patterns, judge commentary

Researched 2026-10-29 for Haunted Hacks (YC office, Oct 31 2026, 5-hour build). Sources: Exa search and fetch, plus WebSearch. Claude in Chrome was not available and Firecrawl was not used. Every claim links to a source. **[Inference]** marks my own reading. Items before July 2026 are labelled **background**. An adversarial verification pass on 2026-10-29 re-fetched the key sources; corrections are applied in place and logged at the end.

---

## TL;DR

1. **Verification won almost everything.** Three different hosts wrote recaps that summarise their winners the same way. Brainbase said the top projects had "agents doing the work, and there was something checking them." Runloop said all three Codex winners were "going after a real gap in how software gets verified." At the Recursive Agents hackathon, the winner's agents had to "prove the board works before it's allowed to say done."
2. **Durable state was the winning backend in agent events.** Accord took 1st at the Cloudflare-hosted Startup Speedrun (Sep 28). It kept auction state in a **Durable Object**, the closest public analogue to Terse Durable Actors. Dead Reckoning won a Long Horizon sponsor prize with crash-safe intent logging. Climatico won a track at Cloudflare SF and wrote "a durable receipt" for every action.
3. **Agent-to-agent negotiation shows up in many podium finishes.** Examples: brand agents bidding in an auction (Accord), personal agents negotiating calendars over email (Mutual, 2nd), a bank agent questioning a vendor agent (Attest, runner-up), "eight independently-addressable agents" negotiating over a live mesh (best demo), and two voice agents debating each other (Wagner, finalist). This maps straight onto the Agent Relay track.
4. **Judges explicitly scored honesty.** Brainbase's five criteria included "how honestly the demo showed what worked." Several winners wrote down what did *not* work.
5. **Winners solved small, concrete problems with numbers attached:** 231 passing tests (Accord), up to 2x decode speed (Nusa), and "catching all eight planted signals in a real fraud file" (TitleWise, Agent Natives External winner). Category claims did not carry demos on their own.

---

## 1. Event-by-event (Jul-Oct 2026, newest first)

### VibeCon SF (Emergent at YC, Oct 24-25)
- 200 builders (per Emergent's own pre-event posts). Winner: MANCEPS ($10k plus YC interview). FLOORLINE took $5k and KAZZA $3k, per a TipRanks summary of Emergent's LinkedIn post ([TipRanks](https://blog.tipranks.com/emergent-backed-vibecon-sf-2026-highlights-startup-award-winners/)). I could not find descriptions of the winning projects.
- Six judges: Mukund Jha and Madhav Jha (Emergent), Sachin Malhotra (Anthropic MTS), **Nicolas Dessaigne (YC GP)**, Balaji NJL (AWS) and Pratik Gupta (Stripe) ([Emergent LinkedIn](https://www.linkedin.com/posts/emergentlabs_meet-the-judges-for-vibecon-sf-2026-with-activity-7519338724485292033-gk22)). Emergent pitched it as emphasising "real product viability over demos" ([Emergent news](https://emergent.sh/news/vibecon-sf-oct-24-25-build-ship-win-10k-yc)).

### The Recursive Agents Hackathon (Crusoe x Cerebral Valley, SHACK15, Oct 17)
- 215 attendees, 109 submissions and $25k cash, built over "nearly 12 hours" ([TipRanks summary of Crusoe's LinkedIn post](https://www.tipranks.com/news/private-companies/crusoe-highlights-developer-engagement-with-agentic-ai-hackathon)). The prize list also included an NVIDIA RTX 5090 ([CV event page](https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon)); TipRanks only says "high-end NVIDIA hardware". The brief: "Build a team of agents you can walk away from" that "spin up sub-agents, delegate work, communicate with each other, check their own progress, recover when things break" ([CV event page](https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon)).
- **1st overall: Etch** (Pranav Achar, Nithin), $14,000 ([pranavachar.com](https://pranavachar.com/etch)). Etch is a voice-to-circuit-board agent team. A model's only job is to map each spoken requirement to a check. "Plain code measures every value" from KiCad, ERC, DRC and ngspice outputs. A requirement that cannot be measured is reported as "cannot measure", never guessed. A watchdog stops silent or looping runs "with an honest message instead of a fake success" ([gallery entry](https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon/hackathon/gallery/58)).
- Crusoe's post names automated circuit design, self-improving task agents and digital-twin robot maintenance among the winners ([TipRanks](https://www.tipranks.com/news/private-companies/crusoe-highlights-developer-engagement-with-agentic-ai-hackathon)). **[Inference]** The gallery lists SPARKLETEAM and AGI Factory right after Etch, so they are probably those winners. I did not confirm their placings.
- The gallery has a track literally named "Done Means Done". Entries called Traceback, DoneDone, Unfoolable, HOLDOUT/"Proof of Done", "No free wins" and "Done" all attack agents that "confidently report 'done'" ([gallery](https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon/hackathon/gallery)). The theme was crowded, so verification alone did not differentiate. Etch won by verifying against *physical artifacts*.

### Multi Model Hackathon (Builderbase, Frontier Tower, Oct 11)
- This one is relevant because **Haunted Hacks also judges on Builderbase**. Judge/mentor Jayavelu Balaji posted his criteria in advance: "Thoughtful model selection and orchestration", "Real-world usefulness, not just novelty", and "A clear path from prototype to production" ([LinkedIn](https://www.linkedin.com/posts/jayavelubalaji_sftechweek-hackathon-generativeai-activity-7514881278358372352-5uOX)). I found no winners list.
- Another Builderbase-run event, Pax Silica (Oct 7, a 4:00pm hard stop like ours), was won by **Bastion**, which finds scam ads that fake a founder's face and voice ([LinkedIn](https://www.linkedin.com/posts/shanmukhsain_sftechweek-sftechweek-paxsilica-activity-7514732008430833664-_rmc)).

### Build Personal Agents Hack (Neon + **Mastra** + Exa + Fly.io + others, Oct 4)
- 250 hackers, about $280k in prizes ([Andre Landgraf via mirror](https://teapawt.org/andrelandgraf/status/2111141974686540196); Neon's pre-event post gives $279,500). The Luma page's pre-event copy said 200 hackers ([Luma](https://luma.com/build-agents)), so treat 250 as the host's post-event count. A Korean-language post by a 2nd-place teammate says there were 120 teams ([LinkedIn](https://www.linkedin.com/posts/harshapps_aiagents-hackathon-buildpersonalagents-activity-7513392732476747776-rwGV)). Format: the top 6 gave 2-minute demos plus 1 minute of Q&A ([Luma](https://luma.com/build-agents)). Haunted Hacks will probably use a similar "top entries demo live" funnel.
- **1st: Kevin**, "an AI roommate agent that lives right in your group chat". It splits expenses, schedules chores and emails the leasing office. The two-person team reports "$180K+ in prizes and credits" ([LinkedIn](https://www.linkedin.com/posts/sudhersankv_techcrunchdisrupt-aiagents-buildinpublic-activity-7516973039293517824-mbt4)).
- **2nd: Mutual.** A team that met that morning built it in about 4 hours. "Your agent negotiates with the other people's agents over email, shares only free/busy times, gets everyone's one-tap yes" ([LinkedIn](https://www.linkedin.com/posts/harshapps_aiagents-hackathon-buildpersonalagents-activity-7513392732476747776-rwGV)). Teammate Hansol Lee (translated from Korean) said they aimed to fold *all* the sponsors' stacks naturally into the product, and that this "seemed to work" ([same post](https://www.linkedin.com/posts/harshapps_aiagents-hackathon-buildpersonalagents-activity-7513392732476747776-rwGV)).
- Eleven judges, including **Abhi Aiyer (Mastra CTO)**, Nikita Shamgunov (listed on Luma as VP Eng, Databricks), Scott Johnston (Fly.io CEO), Jeff Wang (Exa), Haakam Aujla (AgentMail) and James da Costa (a16z) ([Luma](https://luma.com/build-agents); [Kevin post](https://www.linkedin.com/posts/sudhersankv_techcrunchdisrupt-aiagents-buildinpublic-activity-7516973039293517824-mbt4)). Luma lists no scoring criteria. Abhi Aiyer may well judge or mentor on Oct 31 as well, but that is unconfirmed.

### The Multiplayer Coding Hackathon (Coshell, Oct 3; Freestyle a sponsor)
- 170+ builders, all coding in shared live agent sessions. Winners: Chargebee prize to War Room, assistant-ui prize to Square One, **Freestyle prize to Kudos** ([Michael Ogundare via mirror](https://teapawt.org/coshellhq)). The grand prize was judged "on the replay itself" ([coshell.ai/hack](https://coshell.ai/hack)).
- Judge Kenechukwu Uche: "When everyone has access to powerful AI tools, the differentiator shifts from how fast you can build to how well you can collaborate, identify meaningful problems, and create something people actually need" ([LinkedIn](https://www.linkedin.com/posts/uchekene_i-recently-had-the-opportunity-to-serve-as-activity-7515682930933960705-HfAQ)).

### Startup Speedrun Hackathon (Brainbase + Anthropic + **Cloudflare** + Stripe, Cloudflare SF, Sep 28)
This is the most relevant precedent: a Durable-Objects-adjacent agent hackathon billed as "eight hours" (actual hacking ran 9:30 to 3:30, about 6 hours) with published criteria ([recap](https://brainbaselabs.com/blog/startup-speedrun-hackathon-recap/index.md)).
- 29 submissions; teams of 1-6; each needed a 2-3 minute on-camera demo, a write-up, code and a public post. Prizes were $2,000 / $1,000 / $500 cash plus credits. **Judging criteria:** "how far it got in eight hours, how much the agents did on their own, technical execution, startup potential, and how honestly the demo showed what worked." The brief added that "agents doing real work end to end score higher than a chatbot with a nice interface."
- **1st: Accord** (solo, Gautam Jajoo). An AI ad exchange where brand agents bid ad money *and* user discounts over up to 5 rounds. It "shipped as four Cloudflare Workers with auction state in a Durable Object, Stripe Connect ... and 231 passing tests."
- **2nd: Bountyloop.** It replays each exploit 3 times in an offline sandbox, has Claude write a block that a Worker enforces live, and authorizes a bounty only after 4 checks pass, issuing an Ed25519-signed receipt. It also runs as a six-agent orchestration.
- **3rd: WEMINE** (robot tasks turned into playable sims that produce training data). The top 5 also included **Proofline** (spreadsheet models rewritten as code and proved with formal methods) and **Browser Brain**, whose "model judge ... failed three agents that confidently reported success on the wrong page" in the demo.
- Brainbase's summary: "Auctions with fixed rules, exploits that had to reproduce, models verified with formal methods, a judge that overruled agents claiming success."
- At the same event's panel, Cloudflare's Jon Bunting predicted "multi-agent systems that negotiate against each other rather than collaborate." Stripe's Lauren Dai said "Agents just don't buy the way that humans do" ([panel recap](https://brainbaselabs.com/blog/panel-agents-that-act-in-the-real-world)).

### Agent Arena Hackathon (Vultr x Cerebral Valley, Sep 26-27)
- Winners: **Nusa** (an unattended agent that rewrites the slowest inference kernel inside a no-network microVM for "up to twice-as-fast decode"), **Skeleton Key** (turns API-less sites such as Luma into MCP/REST operations verified in a sandbox), and **RL Forge** (paper to RL environment; "2/20 to 5/20" on a math eval) ([Vultr blog, Oct 8](https://blogs.vultr.com/agent-arena-hackathon-cerebral-valley-2026)).

### Long Horizon Agents Hackathon (tokens& at AWS Loft, Sep 25; OpenAI co-host)
- About 120 builders ([Nimble](https://www.linkedin.com/posts/nimble-search_aiagents-hackathon-activity-7511059572682412033-eIs8)). The schedule had kickoff at 11:00 and submissions at 4:30, almost the same window as ours ([Somo listing](https://somo.social/e/ship-from-zero-hackathon-25-september-2026)).
- **Overall winner: NurserAI**, built by two people who met that day. It is a baby-monitor agent with a local vision model. Its memory "even after a restart ... checks for changes before acting. An instruction from two hours ago shouldn't override what a parent just told it" ([LinkedIn](https://www.linkedin.com/posts/martin-ezequiel-pulitano_last-friday-arthur-cao-and-i-won-the-activity-7510749006034083840-O1AU)).
- **Best Use of Tinybird: Dead Reckoning.** It is the clearest durable-actor-style demo of the season. The agent "writes actions it's about to take, then waits for [the store] to confirm it before acting." In the demo, the baseline agent crashes after paying for a ferry and then "paid for the ferry twice," while their agent restarts with zero memory, rebuilds state and replaces only the closed campsite ([LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7511077975543533568)).
- Stated judging criterion (Nimble): "How well does the agent act on the web using real-time data without manual intervention?" ([Nimble](https://www.linkedin.com/posts/nimble-search_aiagents-hackathon-activity-7511059572682412033-eIs8)). Liquid AI prize winner: "solving a real, specific problem instead of overengineering" ([LinkedIn](https://www.linkedin.com/posts/akshat-manral-1a84b5323_ai-hackathon-aiagents-activity-7510828140039114752-LbZL)).

### Agents, Everywhere (AI Tinkerers x OpenAI, global incl. SF, Sep 12; results Sep 22)
- 687 projects from 3,800+ builders in 50 cities ([Atai Barkai, CopilotKit CEO](https://www.linkedin.com/posts/atai-barkai_agents-everywhere-winning-projects-activity-7508216079681396737-lDwz)). **1st: Sidekick**, "an AI meeting teammate that researches questions and creates documents, slides, and spreadsheets while the team talks." **2nd: Arto**, where agents run a simulated Paris Metro line and respond to faults. **3rd: ScreenMate**, a browser agent that pauses for approval on sensitive actions ([AI Tinkerers](https://www.linkedin.com/posts/ai-tinkerers_agents-everywhere-global-winners-activity-7508048635058720769-8KQf)).
- SF entries included **1000lines**, a fork of openai/symphony that fans out "one small pull request per node" with author-cannot-approve enforcement, and **AgentTalkie**, where a voice session has Codex inspect a repository and Claude Code independently review the result ([SF showcase](https://sf.aitinkerers.org/hackathons/h_XWWQL5eKfJM/showcase)). These are close to the "software factory" prompt in the Haunted Hacks brief. Their placements are not published (the SF results page said "Results Coming Soon").

### Codex Community Hackathon (Runloop + Tenor (YC S26) + OpenAI, PostHog Dogpatch, Aug 29)
- 100+ builders, 6-hour build. **1st: Groundtruth**, which "breaks [a PR description] into claims and drives the running app to check each one, with video and network logs as evidence." **2nd: Antibody**, which rebuilds missing regression tests and proves they fail before the fix and pass after. **3rd: Patchlet** ([Runloop](https://www.linkedin.com/posts/runloopai_aiagents-codex-devtools-activity-7500321526815256577-OLCV)). The 1st prize was a Mac mini, the same prize as the Agent Relay track. The winners built "in a cramped phone booth" and iterated by asking the sponsor team for critiques ([Leo Wu-Hacohen](https://www.linkedin.com/posts/leo-wu-hacohen_thank-you-openai-runloop-ai-and-tenor-activity-7500389238434168832-9daO)).

### Agent Native Builders Hackathon (Immersive Commons/Cotal/Runtype at Cloudflare SF, Aug 26-27)
- The stack included Cloudflare Workers, **Durable Objects** and the Agents SDK, plus Cotal ("agent-to-agent presence, multicast and durable delivery"), which is effectively an Agent Relay competitor ([event page](https://www.immersivecommons.com/events/hackathon)).
- 50 builder seats, 22 teams submitted ([Immersive Commons post](https://www.linkedin.com/posts/immersivecommons_agentnatives-aiagents-sanfrancisco-activity-7501166025955270656-9Hir)). External track winner **TitleWise** (Patrick Mitchell): a title-packet fraud agent "catching all eight planted signals in a real fraud file while refusing to cry wolf on a clean one," sold over MCP with x402 payments ([event page](https://www.immersivecommons.com/events/hackathon)).
- Internal track winner **Climatico**: "An eight-agent fleet ... with every finding a durable receipt and no human asked first." Another post adds "sixteen tools over MCP where nine are writes and every write persists a receipt, including the writes it refuses" ([Immersive Commons](https://www.linkedin.com/posts/immersivecommons_agentnatives-aiagents-sanfrancisco-activity-7501166025955270656-9Hir)).
- Best demo: **Surf, Skate, or Bike**. Eight agents negotiate over a live A2A mesh, "each holding its own credential," and the coordination is "auditable from outside the process, not an orchestration function wearing a costume" ([event page](https://www.immersivecommons.com/events/hackathon)).
- External runner-up **Attest** (solo, built on Cotal + Runtype): a Bank Agent connects directly to a Vendor Agent "and asks for proof instead of exchanging endless documents" ([Zubair Zafar](https://www.linkedin.com/posts/zubair480_i-solo-won-a-hackathon-at-cloudflares-san-activity-7499677283000057856-V9ob)).

### Agent Memory Hack Night (Mastra x Elastic, Aug 19)
- 36 participants, 2 hours. 1st place added a *structural* decay term, `score = relevance x time_decay x structural`: memory is trusted less when the function fingerprint it refers to has changed ([Nanonets](https://www.linkedin.com/posts/nanonets_structural-decay-for-context-graphs-with-activity-7496693197230800897-H_Lb); [Devpost](https://agent-memory-hack-night.devpost.com/)). **[Inference]** Mastra's DevRel team values memory correctness ("is it still true?") over memory size.

### YC x Medplum Agentic Healthcare Hackathon (YC office, Aug 1)
- 160+ hackers. 1st was Lamina, 2nd CareLoop (a pre-visit voice agent) ([Medplum recap](https://www.medplum.com/blog/yc-medplum-hackathon-2026-recap)). It had two criteria, potential impact and "effective use of the provided technologies". **YC partner Diana Hu** judged ([Medplum](https://www.medplum.com/blog/yc-medplum-hackathon-2026)). This is the only Jul-Oct event I found at the YC office with a YC-interview prize and published criteria.

### Others (briefly)
- AlphaSignal pizza hack (Aug 6): agents had 90 minutes to order a real pizza, and the winners grounded them with real-time search ([Brave](https://brave.com/blog/alphasignal-hackathon/)).
- Aicoo A2A hackathon (about 100 hackers, 24 submissions; venue/format unverified; writeup dated Jul 9): champion **Relay** (an Aicoo-built project, unrelated to Agent Relay) used an `ESCALATE` sentinel so that "refusal-to-guess is enforced in code," and the team built it with 4 parallel Claude Code sessions coordinating via the product itself ([Aicoo blog](https://www.aicoo.io/blog/our-own-agent-hackathon)). The writeup also observes that "true peer-to-peer A2A is still aspirational" across 24 submissions.

### Background (pre-July, useful context)
- **OpenAI Voice Hack Night** (Cerebral Valley, May 27): winner "Agentic OS for a Phone," a voice-first OS built with Codex in about 6 hours that "generates a UI on the fly" ([OpenAI Devs](https://www.linkedin.com/posts/openai-devs_the-votes-are-in-isa-usmanovs-agentic-activity-7467324638499467264-atMQ)). A Chinese write-up notes visible lag and bugs during the demo, and it still won ([Zhidx](https://zhidx.com/p/562533.html)). Finalist **Wagner** put two gpt-realtime-2 agents (DevOps Lead and CFO) in a live voice call debating each other and surfacing artifacts by tool calls ([gallery](https://cerebralvalley.ai/e/openai-voice-hack-night/hackathon/gallery/50)). The gallery also had **Clue**, "five gpt-realtime-2 agents — each a Clue suspect with private knowledge" ([gallery](https://cerebralvalley.ai/e/openai-voice-hack-night/hackathon/gallery)). That format would suit Halloween well.
- **Claude Opus 4.8 Build Day** (Anthropic x CV, Jun 13): 1st Tekton, which used "independent verifier sub-agents" and an "evidence chain." 2nd Sim Francisco, where "a critic agent even caught Claude smuggling an answer into the prompt" ([Anthropic](https://claude.com/resources/articles/meet-the-winners-of-our-claude-opus-4-8-build-day-hackathon); [SparkOne](https://sparkone.nl/en/blog/claude-builder-day-san-francisco/)).

---

## 2. Cross-event patterns

| Pattern | Evidence (winners/placers) | Relevance to Oct 31 |
|---|---|---|
| **Verifier separate from the doer** | Etch, Groundtruth, Antibody, Bountyloop, Browser Brain, Tekton, Robot-Agent-Lab's "sealed verifier" ([gallery/24](https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon/hackathon/gallery/24)) | Make the verifier its own actor or agent with its own Relay channel |
| **Durable intent/receipt log, crash and replay demo** | Accord (DO), Dead Reckoning, Climatico, NurserAI | This *is* the Durable Actors pitch; plan to kill the process live |
| **Agents negotiating across a boundary** | Accord, Mutual, Attest, Surf/Skate/Bike, Wagner | This *is* the Agent Relay pitch |
| **Agent inside an existing social surface** (group chat, meeting, PR page) | Kevin, Sidekick, 1000lines, LetsGo/Mato | Multiplayer AI without building a new app |
| **Honest scoping and numbers** | Brainbase criterion; Robot-Agent-Lab "README says so"; Measured "gate rejected every proposed change" ([gallery/45](https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon/hackathon/gallery/45)) | Show a metric and a known limitation on one slide |
| **Small or day-of teams win** | Accord and Attest solo; Mutual, NurserAI and Custom Universe met that day | Team size is not the constraint; scope is |
| **Use the sponsor stack natively** | Mutual (all sponsors), Medplum criterion, Codex winners on Runloop | Use Terse + Relay as load-bearing parts, not bolt-ons |

**[Inference] What did *not* win:** I found no generic chat wrappers, RAG-over-docs bots or dashboards among the winners. The Brainbase brief says this outright ("score higher than a chatbot with a nice interface"). Pure "agents say done" verification was crowded at Recursive Agents (6+ entries), so it needs a concrete artifact to stand out.

---

## 3. Judge commentary collected (verbatim, sourced)

- Brainbase criteria: "how honestly the demo showed what worked" ([recap](https://brainbaselabs.com/blog/startup-speedrun-hackathon-recap/index.md)).
- Nimble: "How well does the agent act ... using real-time data without manual intervention?" ([post](https://www.linkedin.com/posts/nimble-search_aiagents-hackathon-activity-7511059572682412033-eIs8)).
- Builderbase judge: "Real-world usefulness, not just novelty" and "A clear path from prototype to production" ([post](https://www.linkedin.com/posts/jayavelubalaji_sftechweek-hackathon-generativeai-activity-7514881278358372352-5uOX)).
- Coshell judge: the differentiator is "how well you can collaborate, identify meaningful problems, and create something people actually need" ([post](https://www.linkedin.com/posts/uchekene_i-recently-had-the-opportunity-to-serve-as-activity-7515682930933960705-HfAQ)).
- Immersive Commons on the best demo: real coordination "auditable from outside the process, not an orchestration function wearing a costume" ([page](https://www.immersivecommons.com/events/hackathon)).
- Cloudflare's Jon Bunting: "Human in the loop is not just a feature. It is the intended purpose of the models" ([panel](https://brainbaselabs.com/blog/panel-agents-that-act-in-the-real-world)).

---

## 4. Limits / could not verify

- **Haunted Hacks judges are not announced.** The event page says "Judges will be announced soon." A LinkedIn post by Thomas Karatzas says "We are hosting a Hackathon at the YC Office on October 31st" ([post](https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0)). The post (about Oct 19-22) lists "Guaranteed YC Interview - iPhone duo - Mac mini". I did not verify his company.
- An older aggregator listing said Haunted Hacks would use **Devpost** and listed fewer sponsors ([HackathonRadar](https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026)). The current YC page says Builderbase. Trust the YC page.
- I found **no prior hackathon winners built on Terse Durable Actors or Agent Relay**. Both are YC F26 companies, and Agent Relay's Launch YC is dated Oct 23 ([Launch YC](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other)). The closest analogues are Cloudflare Durable Objects (Accord) and Cotal/Aicoo A2A meshes.
- No AGI House winners for Jul-Oct 2026 turned up in search. No OpenAI- or Cloudflare-*branded* realtime hackathon in Jul-Oct with published winners was found; the OpenAI Voice Hack Night is May, so background only. Placings for SPARKLETEAM/AGI Factory, the Multi Model Hackathon winners, VibeCon project descriptions and AI Tinkerers SF local results are unconfirmed.
- Several winner lists come from participant LinkedIn posts or TipRanks auto-summaries rather than organizer pages. Two X posts were read through a mirror (teapawt.org), not x.com.
- I did not watch the demo videos. Descriptions come from text write-ups.

---

## 5. Hackathon implications

**What to build (ranked by fit to the evidence):**
1. **A multi-agent negotiation or game where each agent is a Durable Actor and they talk over Agent Relay.** This covers both bonus conditions. Halloween option: a **realtime "Clue/haunted mansion" murder mystery**. Each suspect is a stateful actor with private knowledge, the suspects whisper to each other over Relay channels, and players interrogate them live. A sealed "detective verifier" actor checks accusations against ground truth. The design combines Clue (voice night), Wagner (agents debating), Surf/Skate/Bike (an auditable mesh) and the verifier pattern.
2. **A crash-proof long-running agent (the "Dead Reckoning" demo applied to Durable Actors).** The agent writes intent before acting. Kill the process on stage, it rehydrates from actor state and does not double-charge or double-send. Pair it with Relay so a second agent gets notified when the first resumes. This is the strongest single "why actors" proof.
3. **A small software factory** (1000lines/Groundtruth style). A planner, coder and reviewer each run in their own Freestyle VM and coordinate over Relay. The reviewer may not approve its own work, and the factory state lives in an actor. Expect this lane to be crowded with Terse and Relay's natural audience, so it needs a sharp verifier hook.

**Demo rules from the winners:**
- Put a **separate verifier** on screen, and show it rejecting a false "done" at least once (Browser Brain, Etch).
- Show a **number**: tests passing, duplicates prevented, messages exchanged, recovery time.
- Make the A2A traffic **visible and auditable**, for example a live Relay message log pane. Judges rewarded coordination that is "not an orchestration function wearing a costume."
- State one **known limitation** out loud (the Brainbase honesty criterion).
- Use OpenAI Realtime for the "Real-Time AI" theme only if voice is core. The Voice Hack Night winner shows that judges forgive lag when the concept lands.
- Budget for a 2-3 minute demo plus Q&A. The Oct 4 Mastra-judged event used 2 minutes plus 1 minute of Q&A for the top 6.

**Prize targeting:**
- **Grand prize / YC interview:** YC-office events used "impact" plus "effective use of the provided technologies" (Medplum, with a YC partner judging). Frame the project as a startup wedge, not a toy.
- **iPhone Duo (Durable Actors track, per the event page):** the crash/replay demo.
- **Mac mini (Agent Relay):** two or more agents from *different providers* negotiating peer-to-peer. That is Relay's stated differentiator versus subagents ([Agent Relay blog](https://agentrelay.com/blog/introducing-agent-relay)). The Feb 27 2026 launch post shows a Claude agent and a Codex agent playing tic-tac-toe on one channel via `@agent-relay/sdk` (`relay.claude.spawn`, `relay.codex.spawn`). The repo [AgentWorkforce/relay](https://github.com/AgentWorkforce/relay) had 1,059 stars, Apache-2.0, as of the 2026-10-29 `gh api` check. Its last stable tag was v14.0.0 (Oct 13), and `probe-v15.0.x` tags were cut Oct 29-30, so **pin the SDK version** before Saturday because the API may churn. The Aicoo writeup notes that true peer-to-peer A2A was the gap nobody shipped.
- **Supabase "scale to millions":** keep Postgres or Realtime as the persistence and fan-out layer behind the actors, and say how it shards (one actor per room or user).

**Setup before Oct 31** (ideas are allowed, code is not): sign up for Builderbase, Terse, Agent Relay, Freestyle, Superserve, OpenAI and Supabase, then verify API keys and credits. Run each quickstart once in a throwaway dir and delete it, so the first 30 minutes on the day are not spent on auth. Pre-write the demo script, the "kill the process" moment and the metric to display. Prepare a fallback recorded video, since Wi-Fi was "dying" at the Oct 4 event.

**Gotchas:** Avoid a lone "agents say done" verifier with no artifact (overcrowded on Oct 17). Avoid chat UIs with no autonomous action. Don't over-scope: 5 hours is shorter than every comparable event found (Long Horizon about 5.5h, Codex Community and Brainbase about 6h, Recursive Agents about 12h). Do not reuse pre-written code.

---

## Sources

- https://events.ycombinator.com/haunted-hacks-2026 (via local EVENT_PAGE.md)
- https://brainbaselabs.com/blog/startup-speedrun-hackathon-recap/index.md
- https://brainbaselabs.com/blog/panel-agents-that-act-in-the-real-world
- https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon
- https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon/hackathon/gallery
- https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon/hackathon/gallery/58
- https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon/hackathon/gallery/24
- https://cerebralvalley.ai/e/crusoe-recursive-agents-hackathon/hackathon/gallery/45
- https://pranavachar.com/etch
- https://www.tipranks.com/news/private-companies/crusoe-highlights-developer-engagement-with-agentic-ai-hackathon
- https://blogs.vultr.com/agent-arena-hackathon-cerebral-valley-2026
- https://luma.com/build-agents
- https://teapawt.org/andrelandgraf/status/2111141974686540196
- https://www.linkedin.com/posts/sudhersankv_techcrunchdisrupt-aiagents-buildinpublic-activity-7516973039293517824-mbt4
- https://www.linkedin.com/posts/harshapps_aiagents-hackathon-buildpersonalagents-activity-7513392732476747776-rwGV
- https://www.linkedin.com/posts/bonganha_we-won-2nd-place-at-the-build-personal-agents-activity-7512752536915701760-UucV
- https://coshell.ai/hack
- https://teapawt.org/coshellhq
- https://www.linkedin.com/posts/uchekene_i-recently-had-the-opportunity-to-serve-as-activity-7515682930933960705-HfAQ
- https://www.linkedin.com/posts/jayavelubalaji_sftechweek-hackathon-generativeai-activity-7514881278358372352-5uOX
- https://www.linkedin.com/posts/shanmukhsain_sftechweek-sftechweek-paxsilica-activity-7514732008430833664-_rmc
- https://www.linkedin.com/posts/martin-ezequiel-pulitano_last-friday-arthur-cao-and-i-won-the-activity-7510749006034083840-O1AU
- https://www.linkedin.com/feed/update/urn:li:activity:7511077975543533568
- https://www.linkedin.com/posts/nimble-search_aiagents-hackathon-activity-7511059572682412033-eIs8
- https://www.linkedin.com/posts/akshat-manral-1a84b5323_ai-hackathon-aiagents-activity-7510828140039114752-LbZL
- https://somo.social/e/ship-from-zero-hackathon-25-september-2026
- https://www.linkedin.com/posts/ai-tinkerers_agents-everywhere-global-winners-activity-7508048635058720769-8KQf
- https://www.linkedin.com/posts/atai-barkai_agents-everywhere-winning-projects-activity-7508216079681396737-lDwz
- https://sf.aitinkerers.org/hackathons/h_XWWQL5eKfJM/showcase
- https://sf.aitinkerers.org/hackathons/h_XWWQL5eKfJM/results
- https://www.linkedin.com/posts/runloopai_aiagents-codex-devtools-activity-7500321526815256577-OLCV
- https://www.linkedin.com/posts/leo-wu-hacohen_thank-you-openai-runloop-ai-and-tenor-activity-7500389238434168832-9daO
- https://www.immersivecommons.com/events/hackathon
- https://www.linkedin.com/posts/immersivecommons_agentnatives-aiagents-sanfrancisco-activity-7501166025955270656-9Hir
- https://www.linkedin.com/posts/zubair480_i-solo-won-a-hackathon-at-cloudflares-san-activity-7499677283000057856-V9ob
- https://www.linkedin.com/posts/nanonets_structural-decay-for-context-graphs-with-activity-7496693197230800897-H_Lb
- https://agent-memory-hack-night.devpost.com/
- https://www.medplum.com/blog/yc-medplum-hackathon-2026
- https://www.medplum.com/blog/yc-medplum-hackathon-2026-recap
- https://brave.com/blog/alphasignal-hackathon/
- https://www.aicoo.io/blog/our-own-agent-hackathon
- https://blog.tipranks.com/emergent-backed-vibecon-sf-2026-highlights-startup-award-winners/
- https://www.linkedin.com/posts/emergentlabs_meet-the-judges-for-vibecon-sf-2026-with-activity-7519338724485292033-gk22
- https://emergent.sh/news/vibecon-sf-oct-24-25-build-ship-win-10k-yc
- https://www.linkedin.com/posts/openai-devs_the-votes-are-in-isa-usmanovs-agentic-activity-7467324638499467264-atMQ (background)
- https://cerebralvalley.ai/e/openai-voice-hack-night/hackathon/gallery (background)
- https://cerebralvalley.ai/e/openai-voice-hack-night/hackathon/gallery/50 (background)
- https://zhidx.com/p/562533.html (background)
- https://claude.com/resources/articles/meet-the-winners-of-our-claude-opus-4-8-build-day-hackathon (background)
- https://sparkone.nl/en/blog/claude-builder-day-san-francisco/ (background)
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other
- https://agentrelay.com/blog/introducing-agent-relay
- https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0
- https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026
- https://github.com/AgentWorkforce/relay (gh api, 2026-10-29)

---

## Verification log (2026-10-29)

Each claim was re-fetched live (Exa fetch, WebFetch, `gh api`) with the aim of refuting it.

| # | Claim checked | Source re-read | Outcome |
|---|---|---|---|
| 1 | Brainbase Startup Speedrun: 29 submissions, five criteria incl. "how honestly the demo showed what worked", Accord 1st with "auction state in a Durable Object ... 231 passing tests" | brainbaselabs.com recap | **Confirmed** verbatim. **Corrected** "8-hour": the brief says eight hours, but hacking ran 9:30-3:30 (about 6h). **Added** prize amounts and Proofline (top-5). |
| 2 | Jon Bunting quotes ("Human in the loop is not just a feature..."; multi-agent systems negotiating) and Lauren Dai quote | brainbaselabs.com panel recap | **Confirmed** verbatim. |
| 3 | Etch 1st overall, $14,000; "cannot measure"; watchdog "honest message instead of a fake success" | pranavachar.com/etch; CV gallery/58 | **Confirmed.** |
| 4 | Recursive Agents: 215 attendees, 109 submissions, $25k + RTX 5090 | TipRanks; CV event page | **Partly corrected:** TipRanks gives 215/109/$25k but says only "high-end NVIDIA hardware". RTX 5090 is now cited to the CV event page. **Added** "nearly 12 hours". |
| 5 | "Done Means Done" track; Traceback, DoneDone, Unfoolable, HOLDOUT, No free wins | CV gallery | **Confirmed** (Traceback names the track explicitly). Placings for SPARKLETEAM/AGI Factory are still unconfirmed. |
| 6 | Build Personal Agents: 250 hackers, ~$280k, top 6 with 2-min demo + 1-min Q&A, Abhi Aiyer judged, Kevin 1st | teapawt mirror; Luma; Kevin winner post | **Confirmed**, with a caveat: Luma pre-event copy says 200 hackers, Landgraf's post-event post says 250. **Added** the full judges list and Kevin's "$180K+" haul. |
| 7 | Codex Community Hackathon: Groundtruth 1st with Mac mini, Antibody 2nd, Patchlet 3rd; "cramped phone booth"; 6-hour build | Runloop LinkedIn; Leo Wu-Hacohen LinkedIn | **Confirmed** verbatim. |
| 8 | Agent Natives: Climatico "durable receipt"; Surf/Skate/Bike "not an orchestration function wearing a costume"; Attest runner-up | immersivecommons.com; IC LinkedIn; Zubair Zafar LinkedIn | **Confirmed.** **Missing item added:** TitleWise won the External track. The TL;DR's "caught all eight planted signals" came from TitleWise and was unattributed; it is now attributed. Added 50 seats / 22 teams. |
| 9 | YC x Medplum: 160+ hackers, Lamina 1st, CareLoop 2nd, two criteria, Diana Hu judged | medplum.com recap + announcement | **Confirmed.** |
| 10 | Long Horizon: ~120 builders, Nimble criterion quote, 11:00 kickoff / 4:30 submission, NurserAI quote, Dead Reckoning "paid for the ferry twice" | Nimble LinkedIn; Somo; Pulitano LinkedIn; Dead Reckoning LinkedIn | **Confirmed** verbatim. |
| 11 | Agent Relay Launch YC dated Oct 23; cross-provider differentiator vs subagents | ycombinator.com/launches; agentrelay.com blog | **Confirmed.** The blog is dated Feb 27 2026 (background). **Added** SDK and repo facts. |
| 12 | Aicoo: `ESCALATE` sentinel, "refusal-to-guess is enforced in code", 4 parallel Claude Code sessions, "true peer-to-peer A2A is still aspirational" | aicoo.io blog (raw HTML grep) | **Confirmed.** "Online" is **not** stated in the source, so it is now marked unverified. **Added** a note that Aicoo's "Relay" is unrelated to Agent Relay. |
| 13 | VibeCon: MANCEPS $10k + YC interview, FLOORLINE $5k, KAZZA $3k; Dessaigne and Malhotra judged; 200 builders | TipRanks; Emergent LinkedIn; emergent.sh | **Confirmed** (all from secondary or Emergent sources). The emergent.sh article reads as auto-generated: it mentions a "Friday evening kickoff" for a Sat-Sun event, so treat its format claims cautiously. |
| 14 | Haunted Hacks: Builderbase judging, judges TBA, Thomas Karatzas post, HackathonRadar says Devpost | EVENT_PAGE.md; Karatzas LinkedIn; HackathonRadar | **Confirmed.** **Corrected** the Durable Actors prize to "iPhone Duo" (event page and Karatzas post). |
| 15 | Builderbase Multi Model judge criteria (Jayavelu Balaji) | LinkedIn | **Confirmed** verbatim. The post tags BuilderBase. It is a pre-event statement, not a post-hoc one. |
| 16 | Vultr Agent Arena winners Nusa / Skeleton Key / RL Forge with stated metrics | blogs.vultr.com (Oct 8) | **Confirmed.** The Sep 26-27 event date is **not** in the Vultr post and was not re-verified. |

Not re-checked in this pass (left as originally sourced): Coshell winners and judge quote, Pax Silica/Bastion, Mastra x Elastic hack night, AlphaSignal, the AI Tinkerers global results, and the background (pre-July) items. No fabricated quotes or URLs were found among the claims checked.

