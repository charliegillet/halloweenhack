# Host founders as likely judges: Terse and Agent Relay

> Researched 2026-10-29 (late evening PT) for Haunted Hacks, Sat 2026-10-31, YC SF.
> Angle: the four host founders (Thomas Karatzas, Olivier Simard-Morissette, Will Washburn, Khaliq Gant). Covers their backgrounds, posts from the last ~90 days, talks and videos, stated vision, and what they have said they want built. Read it as a guide to how each will judge.
> Scope note: company strategy, competitors and funding are already in `../terse/05-team-strategy.md` and `../agent-relay/05-team-strategy.md`, and social reach is in the two `04-social-pulse.md` files. This file does not repeat those. It adds video transcripts, founder posts from Oct 22-29, GitHub evidence of how the two hosts work together, and a per-person judging lens.
> Method: `yt-dlp` auto-captions for three founder videos, Exa fetch of YC Launch pages, founder blogs and LinkedIn posts, X timelines read through the teapawt.org mirror (x.com is not fetchable), and `gh` API calls on founder accounts and on the TerseAI and AgentWorkforce orgs. No Firecrawl credits used.
> Labels: **[V]** verified in the linked primary source. **[I]** my inference. *(background)* means before Aug 2026. Mirror timestamps such as "1h" were converted using the capture time and are approximate.

---

## 1. TL;DR

1. **Judges have not been announced.** The YC event page, Luma and Builderbase all still say "Judges will be announced soon" or name nobody [V]. The four founders are the most likely judges, since both teams are only two people [I]. The YC primary partners are Aaron Epstein for Terse and Grey Baker for Agent Relay [V: YC pages]. They may also appear, but nothing ties them to judging [I].
2. **The two hosts are building on each other right now, and this is verifiable in code.** Khaliq posted on Oct 8 that Agent Relay is "moving over to their tech". In code: Agent Relay's `relayfile` repo gained a conformance harness with a `terse-durable-actors` target on Oct 2-4. On Oct 29 PT (Oct 30 04:35-05:02 UTC), Will Washburn opened Terse issues #368/#369 and PRs #370/#371 adding Drizzle ORM and nested transactions; #371 was closed unmerged the same night and "folded into #370", which is still open and unmerged. Minutes earlier Thomas himself opened #367, "Support for SQLite ORM to be added into exec api" [V: gh]. Will's stated reason: "We hit this running the relaycast engine (Drizzle, 148 joins) inside a workspace actor." [V: gh]. So the "use both" bonus reflects the hosts' own architecture: **Agent Relay's messaging engine running inside a Terse Durable Actor per workspace** [I].
3. **Terse launched on YC on Oct 29**, two days before the event. Title: "Durable Actors: The perfect primitive for Multiplayer AI and Agent Coordination". Thomas's tweet: "You are probably building Multiplayer AI Wrong." [V]. The launch has two videos, a 2:08 whiteboard explainer titled "How to build Multiplayer AI into your product" ("an army of little servers") and a 2:41 "Durable Actors Launch YC Demo Video" (mini lovable) [V: yt-dlp metadata]. Both transcripts are quoted below. That framing is what Terse will want reflected back at them on Saturday [I].
4. **Agent Relay's founders talk about trust and gates as much as messaging.** On a Sep 30 podcast, Khaliq named identity, ledgers, "a narrow path" and memory as the open problems. His Sep 12 essay "Promptgramming" argues for deterministic gates over prompts. Will's recent posts are about sharing sessions and getting rid of PRs [V]. Ad-hoc agent chatter will impress them less than **gated, auditable** agent-to-agent work [I].
5. **What they explicitly asked hackers for:** Khaliq: "Want to dig into agent to agent communication? ... Interested in playing with real time AI? This hackathon is for you." Thomas: "build same scary good agents". Olivier: "Come enjoy some scary fast AI apps". The event page asks for a software factory, long-running agent or multiplayer AI [V].

---

## 2. Who is likely in the judging room

| Person | Role | Base | Likelihood of judging [I] | Primary lens [I] |
|---|---|---|---|---|
| Thomas Elias Karatzas | Terse CEO | NYC, in SF for the batch | Very high (he is the public face and organized the event) | Multiplayer and real-time UX, with a clear "aha" for actors |
| Olivier Simard-Morissette | Terse CTO | NYC / SF | High | Correctness, runtime semantics, DX friction |
| Will Washburn | Agent Relay CEO | Boston per GitHub and LinkedIn; X bio says SF | Very high | Team workflows, sessions, polish and showmanship |
| Khaliq Gant | Agent Relay CTO | Oslo, Norway | Uncertain. He posted about the event, but I found nothing confirming he will be in SF on Oct 31 | Gated multi-agent flows, trust, cross-harness |
| Aaron Epstein / Grey Baker | YC group partners | SF | Unknown | YC-style "would this be a company" lens |

Sources for bases: [GitHub `willwashburn`](https://github.com/willwashburn) ("Boston, MA"), [X mirror](https://teapawt.org/willwashburn) ("San Francisco, CA"), [X mirror Khaliq](https://teapawt.org/Khaliqgant) ("Oslo, Norway"), [YC Terse](https://www.ycombinator.com/companies/useterse), [YC Agent Relay](https://www.ycombinator.com/companies/agent-relay).

---

## 3. Terse

### 3.1 Thomas Karatzas (CEO)

**Background [V]:** Apple 2018-2025, from junior engineer to Staff, "working on platforms and Apple Intelligence" (his site); the YC page and launch say "Staff Engineer at Apple for 7 years, working on Siri and Apple Intelligence". McGill Software Engineering, and later a mentor at McGill Engine. He founded Know Your VC (acquired by RateMyInvestor). He built RustGPT, a from-scratch transformer in Rust; his own site claims "#1 on Hacker News, 3.2k GitHub stars". Re-checked: `tekaratzas/RustGPT` has 3,192 stars, and the HN story "RustGPT: A pure-Rust transformer LLM built from scratch" (Sep 15 2025) reached 369 points [V: gh, HN Algolia]; the "#1" rank itself is (unverified). His side projects include GuitarGPT and ReSkin AI. He describes himself as someone who loves "building APIs and infrastructure" and wants to help developers "build collaborative apps and multi-agent systems without having to manage all that concurrency themselves." ([thomaskaratzas.com](https://thomaskaratzas.com/), [YC](https://www.ycombinator.com/companies/useterse))

**Founding story, verbatim from the Oct 29 YC Launch [V]:** "In 2021, Swift released actors. It was game changing for my team where threads competing for resources/data races were our #1 source of bugs. Agents are becoming like threads now. ... they sometimes need to share a CRM record, a code base etc." The trigger was 10 agents on a large CSV, where Postgres snapshotting "was serving stale data to half of the agents causing duplicate work". On the workaround: "locks in front of Postgres, which is essentially System-R." On Cloudflare: "insane lock in." The launch also says: "We won several hackathons together, and even worked on a project that had 15K MAU." ([Launch YC](https://www.ycombinator.com/launches/WbG-durable-actors-the-perfect-primitive-for-multiplayer-ai-and-agent-coordination))

**Talk 1: whiteboard explainer, "How to build Multiplayer AI into your product" (YouTube, Terse AI channel, uploaded Oct 29, 2:08, linked from the launch) [V, auto-caption transcript; the captions render "Terse" as "Turso"]:**
- "Multiplayer's always been really hard... With AI agents, it's even worse. They type 90 times faster than humans do. That's 90 times more web socket events and database writes that your infra has to deal with and it just can't keep up."
- "Our solution, an army of little servers. ... each one can only process one request at a time. It has a SQLite database inside of it ... and it has compute. So, you can easily host an harness here."
- Example: "a multiplayer word document like app thing ... Each word document has its own mini server."
- "When they go idle, it goes to sleep into object storage and costs you nothing. And then, when you need it, it pulls back into memory exactly as it was."
- "This is how we think you should build multiplayer AI apps." ([video](https://youtu.be/UNaG-PLw17s))

**Talk 2: "Durable Actors Launch YC Demo Video" (mini lovable; YouTube, Oct 29, 2:41) [V, transcript]:** `terse init` with the mini-lovable template; "OpenAI for inference, and then Modal in order to securely execute uh bash commands"; `terse deploy` "upload[s] your secrets securely into Terse Cloud directly from your .env file". On the agent design: "it's like wrapped in an actor class, and the actor class has this resource which manages the life cycle of both the Modal sandbox and the durable Pi agent ... stores your session history durably. It also manages web sockets for you, so it streams the output." Demo prompt: "build me a website for a petting zoo that has only armadillos." ([video](https://www.youtube.com/watch?v=wpF3VTmljqM)). The armadillo is the new mascot "Arnie the Armadillo" (Oct 24 tweet) [V].

**Recent posts, Aug-Oct 2026 [V, X mirror unless noted]:**
- Oct 29: "You are probably building Multiplayer AI Wrong. We are launching on YC to fix it. MIT Open Source + Cloud hosted version available" (pinned; ~6.1K views at first capture, 16,207 on the Oct 29 late-evening re-check). Also: "This is our YC launch. I talk about armies of tiny servers. you should watch it." And: "get started with the cloud version: bunx terse-cli@latest install". He also endorsed Jessie Frazelle's "pi durable is ... awesome" with "This is correct."
- Oct 23 (approx.): "Durable Objects are confusing. here is what made it click for me." (link target not visible in mirror)
- Oct 19: "I built a tiny Lovable with @pidotdev durable, @modal and @IncTerse Durable Actors. Should I keep building this and make it a series? Maybe it becomes a software factory"
- Oct 19 (X, replying to @IncTerse): "@IncTerse is throwing the first (to our knowledge) Actor Hackathon at @ycombinator ! Join us October 31st and build same scary good agents, drink some coffee made by me ... Prizes include: - Guaranteed YC Interview - iPhone duo - Mac mini". Note the framing as an *Actor* hackathon. Same "scary good agents" line on LinkedIn ([LinkedIn](https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0))
- Oct 21: "We are happy blacksmith customers! A masterclass in dev tool onboarding as well." He also retweeted "Waaay underrated founder quality: Optimism" with "Many people are saying this".
- Oct 8 (LinkedIn): "Explaining what Terse Inc does has been one of the greatest challenges I have faced. I have heard that this demo has gotten people the 'aha' moment" ([LinkedIn](https://www.linkedin.com/posts/thomas-karatzas-a3015a94_explaining-what-terse-inc-does-has-been-one-activity-7514076987481735168-MpTa))
- Oct 8: his agent-coordination demo "almost won me the @ycombinator demo showcase. lost in the finals to a robotic arm playing Doom" ([@IncTerse mirror](https://teapawt.org/IncTerse))
- Sep 11 *(edge of window)*: demoed "something new" at the Presidio Theatre, telling Kevin Rose "this will for sure be open source!"

**What Thomas wants [I, from the above]:** (a) demos that make the actor model *obvious* to a lay audience, because he says explaining it is his hardest problem and he markets through demos; (b) multiplayer AI where many humans and agents share one state; (c) the "actor + sandbox + Pi harness" coding-agent stack he just demoed; (d) showmanship, since he competed in YC's demo showcase and lost to a Doom-playing robot arm. He also praises good dev-tool onboarding (Blacksmith).

### 3.2 Olivier Simard-Morissette (CTO)

**Background [V]:** Principal SWE at Pigeon (YC W23); senior SWE / tech lead at Squarespace and The New York Times ("highly scalable data pipelines for marketing teams"); McGill. X bio: "CTO / Founder @IncTerse (YCF26) former tech lead at Squarespace and New York Times". He is the main runtime author: on re-check (Oct 30 ~06:00 UTC) he had 285 public GitHub events on `TerseAI/durable-actors` since Oct 23 (his feed hits GitHub's 300-event cap at Oct 23, so the true count may be higher), against Thomas's 60 [V: `gh api users/*/events/public`]. The earlier draft's "91" was an undercount. *(background)* He wrote the Jun/Jul Terse blog posts on secure Claude Code learning loops in Modal and on agents settling the static vs. dynamic typing debate ([blog index](https://www.useterse.ai/blog)).

**Recent posts [V, X mirror / LinkedIn]:**
- Oct 6 (LinkedIn): "we are releasing our open source project that helps users manage concurrency and persistence for AI Agents ... help us break our infra at: https://demo.useterse.ai/" ([LinkedIn](https://www.linkedin.com/posts/olism_work-update-thomas-karatzas-and-i-got-into-activity-7513251967154995203-k6ux))
- Oct 9: built the Whitechapel murder-mystery game "to stress test our infra". Oct 12: Python SDK, "one of the most requested features".
- Oct 14: demoed at the Omnara demo night. @IncTerse's reply: "A groundbreaking 3 people knew what an actor was! (new record)".
- Oct 16: "just got back from the durable objects popup here in SF. it's really great to see the actor model becoming so mainstream."
- Oct 17-18: a DX complaint about how hard it is to create a Linear API key (a 7-step path), followed by "fyi @WorkOS cmd + K --> API Keys --> Create Key 😃😃😃".
- Oct 19: "what product should we build next?" and "don't forget the COSTUME CONTEST!"
- Oct 22: "Come enjoy some scary fast AI apps, a costume contest and overall just a great time!"
- Oct 28: commits to `TerseAI/Terse-Examples` polishing the mini-lovable demo [V: gh].

**What Olivier wants [I]:** someone to stress the runtime with real concurrency and to report bugs; clean, low-friction DX (he publicly calls out bad key-creation flows); and he openly asks "what product should we build next?", so a hack that points to a product on top of actors will interest him. He cares about the costume contest, so wear one.

---

## 4. Agent Relay

### 4.1 Will Washburn (CEO)

**Background [V]:** Tailwind from founding engineer to VP Engineering. LinkedIn dates (May 2013 to Feb 2026) imply about 13 years, but the YC bio and Launch YC both say "14 years". The YC bio says "eight-figure ARR, 50K+ paying customers, 1M+ users, 60+ people, and a Series A" ([YC founder page](https://www.ycombinator.com/founders/will-washburn)); his LinkedIn says Series B (unresolved). *(background)* Co-founder and CTO of Social Blendr. Stetson University. His Sessionize profile says he "now builds the same tools for agents that made those teams work" and calls himself "a well-known rec hooper" ([Sessionize](https://sessionize.com/will-washburn/)); no sessions are listed there.

**Launch voice (Oct 23 Launch YC) [V]:** "Soon, agents will outnumber people on the internet." "My agent → me → you → your agent. ... We're all the bottleneck!" "Don't be a meat proxy. Get your agents on the relay." The ask: "If you're running coding agents on your team and still have a backlog, we'd love to ... buy you lunch." ([Launch YC](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other))

**Vision essay *(background, Jun 1)*, "The agent-centered world is almost here" [V]:** "Most AI products still assume the human is the only durable actor in the system." His list of what agents need: "persistent identity", "scoped access", "inboxes, not just prompts", the ability to "coordinate with each other", and "durable records of what they decided and why". Also: "A single general agent with access to every tool is not the end state. It is a very powerful bottleneck." "Power and trust are different things." ([blog](https://agentrelay.com/blog/the-agent-centered-world-is-almost-here)). Note the phrase "durable actor", used four months before the Terse partnership [V].

**Recent posts, Oct 27-29 [V, X mirror]:**
- "a good measure for your dev setup is the rate at which you make important decisions. spending most of your time saying 'yes, do it' or 'fix that' is a signal you might need to level it up"
- "With shared team sessions I'm finding I'm often reading @Khaliqgant's prompts. Grokbot finds them for me from the relay"
- "imo very soon it will be weird NOT to share your sessions in a professional setting"
- "we're getting rid of PRs on a lot of our repos" / "Code is still important. But only code that's important is important."
- "I also think DMs should be banned in healthy slack organizations" (approx. Oct 29)
- Oct 28: "The rate of deploys is accelerating, KJG is cooking"

**GitHub, Oct 29 PT (very recent) [V]:** opened [#368](https://github.com/TerseAI/durable-actors/issues/368) and #369 on Terse's `ActorDatabase`, and PRs #370 (Drizzle ORM via `durable-actors/drizzle`) and #371 (nested transactions). From #368: "We hit this running the relaycast engine (Drizzle, 148 joins) inside a workspace actor. With positional rows everything else worked: all migrations (triggers, FTS5)". Since Oct 23 he had 134 public events on `AgentWorkforce/relaycast` (re-check Oct 30 UTC; the earlier draft said 70) [V: gh]. PR #370's head is his fork `willwashburn/durable-actors`; GitHub reports it as blocked pending review, and he signed Terse's CLA on the PR.

**Third-party read [V]:** Paul Jump, Oct 20: "If there's only one thing I know about @willwashburn, it's that he knows how to put on a show (I've got receipts)". Khaliq replied "Facts".

**What Will wants [I]:** visible team-scale workflows, with sessions as shared artifacts; a strong demo (he is described as a showman); and builders who can use Relay alongside the tools they already use ("meet you where you are"). He is hands-on in Terse's codebase this week, so expect him to understand and ask about the Durable Actors side too.

### 4.2 Khaliq Gant (CTO)

**Background [V]:** Founding engineer and first hire at Nango, May 2023 to Feb 2026 ("from two initial customers to over 150"). Lead engineer at Overview (YC W19). Cornell and Columbia. Collegiate basketball; LinkedIn: "Hoped to play basketball professionally until I dislocated my neck and was paralyzed from the neck down. Recovered 100%" ([LinkedIn](https://no.linkedin.com/in/khaliqgant)). He is the dominant committer on `AgentWorkforce/relay` (see sibling file). In the last week he was active across relayhistory, helm-charts, relayauth, relaycast and relay [V: gh].

**Talk: The Parameter #57, Sep 30 (39 min, YouTube) [V, auto-caption transcript]:**
- Origin: at Nango "I had a lot of agents ... in different terminal windows and different uh GUIs and I needed a way to actually get those agents to work together so I could ... focus on talking to customers".
- Customer value: "looking for more deterministic outcomes ... We allow them to have rules and gates around their agents and ... share session history across their agents and their team."
- Future: "having focused agents is what will be the future. You have a a finance agent and a mortgage agent and a entertainment agent."
- Reliability: "giving it a narrow path to accomplish it task. If we give it that narrow path then it can do it reliably. But if you give it too big of a scope or too wide of a permission set, then you're going to get into troubles."
- Scale: "giving identity to agents ... traceable uh obser observable ... some system record or some you know ledger that says this agent does this".
- Most interesting unsolved problem: "memory. So, every time you start an agent session, it has, you know, amnesia."
- On himself: "writing code is is not something I do anymore. Whereas for 15 years that's exactly what I was doing."
- Positioning: "what I want to position [Agent Relay] as is ... a really strong way to get trust because we're providing communication. We're providing guardrails. providing gates and checks for agents." ([video](https://www.youtube.com/watch?v=Ksg1Gxoeprs); host Henry Osborn's summary mentions agents that "stack pull requests, and even dynamically spin up merge queues" ([LinkedIn](https://www.linkedin.com/posts/henry-osborn_57-agent-relay-yc-f26-turning-ai-agents-activity-7511141169720938496-KDUI)))

**Essay "Promptgramming" (Sep 12) [V]:** "STOP BABYSITTING YOUR AGENTS and stop using glued together systems. Instead script your agents." "A skill is a suggestion ... A hard line, a gate is a mandatory requirement". "why prompt and pray? Promptgram and profit". The examples use `@relayflows/surface` `flow()` with `.agent(...)` roles across `claude` and `codex` CLIs, per-agent `permissions.fileGlobs`, `budget: "$5/run"`, and `.gate()` checks against real filesystem artifacts. One worked example is literally named `"software-factory"` (`budget: "$8/run"`: planner → implementer → a deterministic `f.run(... npm test)` step → an "adversary" agent on a different model whose "only job is to break the PR" → `f.github.createPullRequest`). Another quote: "The gate is a runtime verification against the actual filesystem." ([blog](https://agentrelay.com/blog/promptgramming)).

**Other in-window essays (titles only re-verified from the agentrelay.com blog index) [V]:** "Trusting an agent you didn't spawn" (Aug 5) and "Someone else's agent, in your repo" (Aug 25), both by Khaliq. The titles fit his trust/identity theme; I did not read their bodies in this pass, so no quotes.

**Recent posts [V, X mirror]:**
- Oct 19 (event announcement): "Want to dig into agent to agent communication? This hackathon is for you. Interested in playing with real time AI? This hackathon is for you. Like candy and/or Halloween. THIS HACKATHON IS FOR YOU."
- Oct 8: "Had dinner with the @IncTerse guys ... For agent native software it's a near perfect match. We're moving over to their tech for @agent_relay ... Terse can't miss!"
- Oct 15: "I have five machines + cloud and I can at a glance list all agents running by machine. MORE IMPORTANTLY my agents have a roster of all agents across the entire team"
- Oct 15: "The future is absolutely using your voice with a bot about all the tasks in flight ... Reading long blocks of text from AI is definitely not it."
- Oct 17: "Proactive agents are annoying especially if there are a lot of doing different things and after a while start to get ignored. We have a lot of Agent Relay agents sending digests etc, and we've kind of stopped reading them."
- Oct 19: "Burden of knowledge for me! ... I forget how cool it actually is to see the agent to agent communication for the first time" (replying to a user who watched their agents chat).
- Oct 19: "My personal AI assistant arsenal: 7 grok bots, 1 dot, 1 openclaw, 1 Hermes, 1 instinct".
- Oct 23-28: "A lot of people have been telling me that they built a crappy version of this. Build with us, it's open source!" and the grok bot → dot → Claude/Codex/opencode "team of personal agents" post.
- Aug 31 and Sep 18 X articles ("My Superpower Is Perspective", "On Joining Y Combinator") could not be read through the mirror.

**What Khaliq wants [I]:** deterministic, gated multi-agent flows across vendors; least privilege; agent identity and audit; a fix for memory/amnesia; voice as the interface. He is tired of noisy proactive agents. He came from integrations (Nango), so he values real external triggers and webhooks over demo stubs.

---

## 5. How the two hosts connect

| Date | Evidence | Source |
|---|---|---|
| Jun 1 *(background)* | Will writes that agents should become first-class "durable actors" with persistent identity and inboxes | [blog](https://agentrelay.com/blog/the-agent-centered-world-is-almost-here) [V] |
| Oct 2-4 | Agent Relay bot lands a backend-neutral Relayfile conformance harness with targets `go-oracle`, `cloudflare-do` and `terse-durable-actors`. The doc notes the Terse target "is a qualification contract, not an implemented or qualified adapter", partly because v0.7.9 had no alarm API | `AgentWorkforce/relayfile` #523, `docs/vendor-compatibility-matrix.md` [V: gh] |
| Oct 8 | Khaliq: "We're moving over to their tech" | [@IncTerse mirror](https://teapawt.org/IncTerse) [V] |
| Oct 19 | Both teams announce Haunted Hacks the same minute (16:28-16:29 UTC) | X mirrors [V] |
| Oct 18 (release), Oct 20 (Thomas's tweet) | Terse v0.8.1 ships "Support for Alarms (#207)", plus the Pi durable adaptor (#204) and the `inspect` CLI (#213) | [release](https://github.com/TerseAI/durable-actors/releases/tag/v0.8.1) [V]. That it unblocks Relayfile's gap is [I]; the relayfile matrix still lists Terse queue/timer cases as "expected FAIL until actor alarms ship" |
| Oct 29 PT | Thomas opens #367 (ORM support in `exec`); Will opens #368/#369 and Drizzle/transactions PRs #370/#371 after running relaycast "inside a workspace actor"; #371 folded into #370 | gh #367-#371 [V] |

[I] The bonus for using both products is the hosts' own production pattern: **one Durable Actor per workspace or room holds the Relay-style message log in SQLite, and agents talk through it.** A hack built that way lets both teams say "that's our stack". The relationship looks real and recent, so expect both founders to be fluent in each other's product.

---

## 6. Vocabulary that will resonate [V phrases, I advice]

Use these phrases, which the founders use themselves: "army of little servers / tiny servers", "one request at a time", "multiplayer AI", "agent coordination", "software factory", "durable", "goes to sleep ... pulls back into memory exactly as it was"; "don't be a meat proxy", "stop copy/pasting between agents", "on the relay", "shared sessions", "gates", "narrow path", "promptgram".
Avoid: calling Relay a "multi-agent framework" (they contrast themselves with LangGraph/CrewAI), and calling Durable Actors "a database" or "workflows" (Olivier: they manage "durable state, not durable execution" — see sibling file).

---

## 7. Limits / could not verify

- **Judges are unannounced.** Every judging statement here is inference from host roles.
- Whether Khaliq (Oslo) will attend in person is unknown.
- X content was read through teapawt.org. Relative timestamps were converted approximately, view counts are mirror snapshots, and some linked media (Thomas's "what made it click" post) were not visible.
- Khaliq's two X articles (Aug 31, Sep 18) are not readable through the mirror. The LinkedIn copy of "My Superpower Is Perspective" showed only its title.
- Olivier's typing-debate blog URL now redirects to the Terse homepage. I could not re-read the essay and quote nothing from it.
- Video quotes come from YouTube auto-captions, lightly cleaned. Wording may differ slightly from the audio (for example, captions render "Terse" as "Turs"/"Turso"). Khaliq's "position a ble as" is a caption garble, rendered here as [Agent Relay].
- I found no conference talks by any of the four beyond the podcast, the two Terse videos, the YC demo showcase mention, and the Omnara demo night mention. Will's Sessionize profile lists no sessions.
- That Terse's Alarms feature was prioritized for Agent Relay is inference from timing only.
- Tailwind Series A vs Series B remains unresolved.

---

## 8. Hackathon implications

**What to build (aligned with all four founders):**
1. **"Haunted workspace actor" (best fit for both tracks).** Use one Terse Durable Actor per haunted house, room or workspace. It holds the shared state and an append-only log of agent messages in its SQLite. Agents from different harnesses (OpenAI Agents SDK / Mastra / Codex) coordinate over Agent Relay, and humans join over WebSocket to watch live. This mirrors Will's relaycast-in-a-workspace-actor work (§5), Thomas's "army of little servers", and Khaliq's "agents as a team".
2. **Gate the agents (Khaliq's test).** Put at least one deterministic `.gate()` / check step in the flow: a reviewer agent that cannot write, a planner limited to `plan/**`, and a budget cap. Say "narrow path" on stage.
3. **Make the actor guarantee visible (Thomas's test).** Show several players and agents hitting one actor with no duplicate work, a kill or idle cycle, then a resume with the conversation intact. Thomas says the "aha" moment is his hardest problem, so a demo that produces it is valuable to him.
4. **Voice or real-time angle (Khaliq, Oct 15; theme).** A voice front end to "tasks in flight", or ghost NPCs speaking via TTS (as in Terse's Whitechapel game), fits "Real-Time AI".
5. **Mini software factory (Thomas Oct 19 and Khaliq's "software-factory" flow).** Riskier in 5 hours. Only attempt it if you start from the `02_codingAgent` / mini-lovable template pattern, and write the code at the event.

**Gotchas:**
- Don't build a noisy "proactive digest" agent. Khaliq says they stopped reading their own.
- Don't fake agent-to-agent traffic or route it through yourself. "Meat proxy" is the anti-pattern they literally pitch against.
- Drizzle support exists only in Will's *open, unmerged* PR (#370, Oct 29 PT, status "blocked"; #371 was closed into it). Do not depend on `durable-actors/drizzle` unless it merges and releases before Saturday. Use raw `this.db.exec`, and note #368: duplicate column names in joins collapse, so alias your columns.
- Both products shipped breaking releases this week (see sibling files). Pin versions on Friday.
- Wear a costume. Olivier and the event page both push the costume contest, and it costs nothing.

**Setup before Oct 31 (ideas and setup allowed; code must be written at the event):**
- Watch the two Terse launch videos (2:08 and 2:41) and skim the Promptgramming essay. They describe exactly the architectures the judges think in.
- Run `bunx terse-cli@latest install` (the exact command Thomas tweeted on launch day), then `terse init` → `terse deploy` once on a throwaway project. Also connect two agents on Agent Relay so auth isn't new on the day.
- Prepare a 2-minute demo script with a clear before/after: "human copy-paste / Postgres locks" vs "agents on the relay / one actor per room".

**What judges and sponsors want (summary) [I]:** a live, multi-device demo where (a) actor guarantees are visible, (b) heterogeneous agents talk directly with gates and scoped permissions, (c) state survives idle or crash, and (d) the story uses the founders' own words. Use both products the way the hosts themselves are combining them (Relay messages living in a workspace actor) for the stated bonus.

---

## Sources

- https://events.ycombinator.com/haunted-hacks-2026 (via ../../EVENT_PAGE.md); https://luma.com/yc-meetup-7183-9316f87f; https://builderbase.com/event/haunted-hacks-2026
- https://www.ycombinator.com/launches/WbG-durable-actors-the-perfect-primitive-for-multiplayer-ai-and-agent-coordination (Terse Launch YC, 2026-10-29)
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other (Agent Relay Launch YC, 2026-10-23)
- https://www.ycombinator.com/companies/useterse; https://www.ycombinator.com/companies/agent-relay; https://www.ycombinator.com/founders/will-washburn
- https://youtu.be/UNaG-PLw17s (Terse whiteboard); https://www.youtube.com/watch?v=wpF3VTmljqM (mini lovable demo); https://www.youtube.com/watch?v=Ksg1Gxoeprs (The Parameter #57, Khaliq Gant, 2026-09-30)
- https://www.linkedin.com/posts/henry-osborn_57-agent-relay-yc-f26-turning-ai-agents-activity-7511141169720938496-KDUI
- https://thomaskaratzas.com/
- https://www.useterse.ai/blog; https://www.useterse.ai/
- https://agentrelay.com/blog; https://agentrelay.com/blog/promptgramming; https://agentrelay.com/blog/the-agent-centered-world-is-almost-here
- https://sessionize.com/will-washburn/
- https://no.linkedin.com/in/khaliqgant; https://www.linkedin.com/posts/khaliqgant_my-superpower-is-perspective-activity-7500229301766668288-Hm5o
- https://www.linkedin.com/posts/olism_work-update-thomas-karatzas-and-i-got-into-activity-7513251967154995203-k6ux
- https://www.linkedin.com/posts/thomas-karatzas-a3015a94_explaining-what-terse-inc-does-has-been-one-activity-7514076987481735168-MpTa
- https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0
- https://www.linkedin.com/posts/thomasgrauwin_another-talk-talk-session-with-thomas-karatzas-activity-7511962460489240576-N0Rv
- X mirrors: https://teapawt.org/karatzas_thomas, https://teapawt.org/oliviersm199, https://teapawt.org/willwashburn, https://teapawt.org/Khaliqgant, https://teapawt.org/IncTerse, https://teapawt.org/agent_relay, https://teapawt.org/Khaliqgant/status/2112219340422721818, https://teapawt.org/karatzas_thomas/status/2112219511327965403
- https://teapawt.org/aboodman/status/2088155104851657110 (Aaron Boodman DO explainer, Aug 14, linked from the event page)
- GitHub via `gh`: https://github.com/TerseAI/durable-actors/issues/368, /issues/369, /pull/370, /pull/371; https://github.com/TerseAI/Terse-Examples; https://github.com/AgentWorkforce/relayfile (`docs/vendor-compatibility-matrix.md`, `docs/backend-neutral-conformance.md`, `test/conformance/targets/terse.json`, `.trajectories/completed/2026-10/traj_60dloiqfxbjn.md`); `gh api users/{tekaratzas,oliviersm199,willwashburn,khaliqgant}` and their `/events/public`
- https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082
- Added in verification pass: https://github.com/TerseAI/durable-actors/issues/367; https://github.com/TerseAI/durable-actors/releases/tag/v0.8.1; https://github.com/AgentWorkforce/relayfile/pull/523; https://github.com/tekaratzas/RustGPT; https://news.ycombinator.com/item?id=45247890 (RustGPT HN story, 369 points)

---

## Verification log (2026-10-29)

Adversarial re-check run late on Oct 29 PT (about Oct 30 06:00 UTC). Each claim was tested against a live primary source and an attempt was made to refute it.

| # | Claim | Method | Outcome |
|---|---|---|---|
| 1 | Judges not announced | Live curl of the Luma page; YC events page returned an empty JS shell; Builderbase JSON-LD | **Confirmed.** Luma still reads "Judges will be announced soon." Builderbase lists Agent Relay as organizer and names no judges. |
| 2 | Will opened Terse #368/#369 and PRs #370/#371; "148 joins" quote | `gh api repos/TerseAI/durable-actors/issues/{368..371}` | **Confirmed, with correction.** The quote matches #368 verbatim. Created Oct 30 04:35-05:02 UTC, i.e. Oct 29 PT. #371 is **closed unmerged** ("Folded into #370"). #370 is open and blocked. Added Thomas's companion issue #367. |
| 3 | Relayfile conformance harness with a Terse target, Oct 2-4; "qualification contract" quote; v0.7.9 had no alarm API | `gh` on relayfile PR #523 and `docs/vendor-compatibility-matrix.md` | **Confirmed.** PR by AgentRelayBot, opened Oct 3 06:35 UTC and merged Oct 4. The quote is verbatim. `terse.json` target exists. |
| 4 | Terse 0.8.1 with Alarms shipped "~Oct 20" | `gh api .../releases` | **Corrected.** The GitHub release was published **Oct 18** (19:49 UTC). Thomas tweeted it on Oct 20. Notes confirm "Support for Alarms (#207)". |
| 5 | Terse Launch YC on Oct 29: title, founding-story quotes, "15K MAU", "insane lock in" | Exa fetch of the Launch YC page | **Confirmed.** All quoted passages are verbatim. |
| 6 | Agent Relay Launch YC on Oct 23: "meat proxy", "We're all the bottleneck!", lunch ask | Exa fetch | **Confirmed** verbatim. The launch also says Will spent "14 years" at Tailwind and that the founders "run 50+ agents in parallel". |
| 7 | YC primary partners Aaron Epstein (Terse) and Grey Baker (Agent Relay) | curl of YC company pages | **Confirmed.** |
| 8 | Will's YC bio: "eight-figure ARR, 50K+ paying customers, 1M+ users, 60+ people, and a Series A" | Exa fetch of the YC founder page | **Confirmed** verbatim. Tenure "about 13 years" is **corrected** to note that YC says 14. |
| 9 | Videos UNaG-PLw17s, wpF3VTmljqM (Oct 29) and Ksg1Gxoeprs (Sep 30, 39 min) | `yt-dlp` metadata and auto-captions | **Confirmed**, with corrections. The videos run 2:08 and 2:41 (the doc had said "about 3 minutes each"), and the real titles are now in the doc. The podcast runs 2,354 s. Spot-checked quotes ("90 times faster", "army of little servers", "goes to sleep into object storage", "narrow path", "amnesia", "not something I do anymore", "gates and checks") all appear in the captions. |
| 10 | Will's "agent-centered world" essay (Jun 1) quotes | Exa fetch | **Confirmed** verbatim, including the list of agent needs, "very powerful bottleneck" and "Power and trust are different things". |
| 11 | "Promptgramming" (Sep 12) quotes and the `software-factory` flow | Exa fetch | **Confirmed. Pipeline description corrected**: the flow is planner → implementer → test run → adversary → PR, not "planner → implement → review". Its budget is $8/run. |
| 12 | Khaliq's Oct 8 "moving over to their tech" tweet; Thomas's Oct 8 Doom-arm tweet; Olivier's Oct 9/12/14 posts | teapawt.org mirror via Exa and curl | **Confirmed** verbatim. |
| 13 | Thomas's Oct 29 launch tweet (~6.1K views) | Live mirror curl | **Confirmed.** The text matches and the tweet is pinned. Views were 16,207 at re-check, so the doc now gives both figures. The `bunx terse-cli@latest install` command is confirmed from his same-day tweet. |
| 14 | Will's Oct 27-29 posts (sharing sessions, getting rid of PRs, DMs banned, "KJG is cooking", Grokbot) and X bio "San Francisco" | Live mirror curl | **Confirmed.** |
| 15 | GitHub bases: Will "Boston, MA", Khaliq "Oslo, Norway" | `gh api users/*` | **Confirmed.** Thomas's GitHub says "New York". Olivier's profile has no location. |
| 16 | Olivier had 91 events vs Thomas's 60 on durable-actors in 7 days; Will had 70 on relaycast | `gh api users/*/events/public` | **Corrected.** Re-check found Olivier 285 since Oct 23 (his feed is capped there), Thomas 60, and Will 134 on relaycast. These counts move hour to hour, but the earlier numbers were undercounts. |
| 17 | RustGPT "#1 on HN, 3.2k stars" | `gh`, HN Algolia | **Partly confirmed.** The repo has 3,192 stars and the HN story reached 369 points. The "#1" rank is (unverified). |
| 18 | Olivier's Oct 28 commits to Terse-Examples (mini-lovable polish) | `gh api .../commits` | **Confirmed.** Two commits on Oct 28: "Spin the mini-lovable loading mascot in place (#2)" and "Omorissette/updates to demo (#1)". |

**Not re-checked in this pass (left as originally sourced):** LinkedIn post quotes (Oct 6, Oct 8, Oct 19), Khaliq's Oct 15/17/19 X posts beyond the Oct 19 announcement, the Paul Jump reply, Sessionize wording, Khaliq's LinkedIn injury quote (the YC bio independently confirms "Was paralyzed from neck down, fought way back to be able to walk again"), and Olivier's Oct 16-19 posts. No fabricated quotes or dead URLs were found among the claims that were checked.

**Context worth knowing (verified this pass):** `TerseAI/durable-actors` is MIT and had 291 stars at re-check. Terse shipped releases v0.11.0 through v0.14.4 between Oct 24 and Oct 29, roughly one or more a day, so pin a version on Friday. `AgentWorkforce/relay` had 1,059 stars. Luma lists "Y Combinator" as the host and the track prizes as "Stateful Apps: Build with Durable Actors from Terse - iPhone Duo" and "Agent to agent communication built with Agent Relay: Mac Mini".
