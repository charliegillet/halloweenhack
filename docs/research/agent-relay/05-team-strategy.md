# Agent Relay: team, strategy and competition

> Research date: 2026-10-29. The event is Sat 2026-10-31. Angle: who the founders are, what they have said in public, funding, positioning and ICP, competitors, roadmap hints, and what they say they want developers to build. Product features and changelog are in `02-newest-features.md`, so this file does not repeat them.
> Method: Exa search and fetch (YC company and launch pages, agentrelay.com, blog, proactiveagents.dev, IBTimes, LinkedIn snippets, the teapawt.org X mirror), plus `gh api` against the `AgentWorkforce` GitHub org. No Firecrawl credits were used.
> Labels: **Fact** means read directly from the cited source. **Inference** is my reading and is labeled as such. Items dated before Aug 2026 are marked *(background)*.

---

## 1. TL;DR

- **Two founders, both technical, who have played together since high school.** Will Washburn (CEO) spent 13-14 years as founding engineer and then VP Engineering at Tailwind (the YC bio says "14 years"; the LinkedIn dates, May 2013 to Feb 2026, work out to just under 13), the SMB marketing SaaS. Khaliq Gant (CTO) was founding engineer at Nango (W23) and lead engineer at Overview (W19). YC Fall 2026, primary partner Grey Baker. Team size is 2. [YC company page](https://www.ycombinator.com/companies/agent-relay)
- **Funding is accelerator-stage only.** Caplight records one "Accelerator" round dated Sep 1, 2026, with $500K total raised, and lists Y Combinator, Cortical Ventures, Yonder Ventures, Hustle Fund and Active Capital as investors. Shumer Capital appears only on Will's LinkedIn. *Inference:* $500K matches YC's standard deal, so the angel amounts are probably not included or not disclosed. No priced seed has been announced. [Will's LinkedIn](https://linkedin.com/in/willwashburn), [Caplight](https://www.caplight.com/company/agentrelay), [Fundraising Fox](https://fundraisingfox.com/companies/agent-relay)
- **The positioning has moved three times in 2026.** Feb: "SDK for agent-to-agent comms". May: "a runtime for proactive agents" (clock, listener, inbox). Oct 23 launch: "let your teams' coding agents message each other", with sessions as the product. The common thread is that **humans should stop being the message bus.**
- **ICP:** software teams already running several coding agents (Claude Code, Codex, Cursor, Conductor) across people, machines and timezones. The founders claim the pain appears at "40-50 agents across their organization". [IBTimes](https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082)
- **The biggest competitive threat is the platforms, not other startups.** Claude Code now ships Agent Teams and native cross-session messaging (v2.1.224, Aug 7 2026). That messaging already reaches a user's own sessions on other machines through Remote Control, and Google's A2A is the open standard. So "cross-machine" alone no longer sets Relay apart. Its real edge is cross-harness (Codex, Cursor, OpenCode), **cross-person/cross-org**, durable delivery to offline agents, and shared session history. A hackathon project should show exactly that boundary.
- **What they asked hackathon builders for** (Khaliq, Oct 19): "Want to dig into agent to agent communication? This hackathon is for you. Interested in playing with real time AI? This hackathon is for you." [X mirror](https://teapawt.org/Khaliqgant/status/2112219340422721818)

---

## 2. Founders

### Will Washburn, co-founder and CEO

| Fact | Source |
|---|---|
| YC bio: "Previously built Tailwind, where I spent 14 years scaling a marketing SaaS for small businesses to eight-figure ARR, 50K+ paying customers, 1M+ users, 60+ people, and a Series A... We run 50+ agents in parallel ourselves." | [YC founder page](https://www.ycombinator.com/founders/will-washburn) |
| LinkedIn: VP of Engineering at Tailwind from May 2013 to Feb 2026. "Joined as a founding engineer and helped scale it from co-founder's couch to Series B". He says he worked with the CEO on fundraising, growth strategy and M&A. Before that he was co-founder and CTO of Social Blendr (2011-12), a pre-Tinder IRL social app. He studied at Stetson University. | [LinkedIn](https://linkedin.com/in/willwashburn), [YC founder page](https://www.ycombinator.com/founders/will-washburn) |
| He is quoted as Tailwind VP Engineering on the Replier.ai acquisition (2022), so he has applied-AI product history *(background)*. | [PR Newswire](https://www.prnewswire.com/news-releases/tailwind-acquires-replierai-adding-ai-capability-to-help-marketers-break-writers-block--write-better-copy-301514233.html) |
| He is based in Boston per LinkedIn and IBTimes. The YC page lists the company in San Francisco, and his X bio says San Francisco. | [IBTimes](https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082), [X mirror](https://teapawt.org/willwashburn) |
| X: @willwashburn, about 2.7K followers. Bio: "All thoughts my own or AI generated (ok fine most thoughts AI generated)." | [X mirror](https://teapawt.org/willwashburn) |

**Discrepancy:** the YC bio says Tailwind reached a "Series A". His LinkedIn and the Fundraising Fox summary say "Series B". I could not resolve which is correct.

### Khaliq Gant, co-founder and CTO

| Fact | Source |
|---|---|
| YC bio: "Previously Founding Engineer at Nango (W23) and Lead Engineer at Overview (W19). Cornell & Columbia grad. Former collegiate basketball player. Was paralyzed from neck down, fought way back to be able to walk again." | [YC company page](https://www.ycombinator.com/companies/agent-relay) |
| He was Nango's first engineering hire for three years and says that webhook work led to the "listener" primitive (Relayfile). | [proactiveagents.dev](https://proactiveagents.dev/posts/the-genesis/) *(background, May 2026)* |
| He is based in Oslo, Norway, six hours from Will. They use their own agents across that gap. | [IBTimes](https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082), [LinkedIn](https://no.linkedin.com/in/khaliqgant) |
| He is the dominant committer: `khaliqgant` has 2,273 contributions to `AgentWorkforce/relay` against 1,032 for `willwashburn`. Bot or agent accounts are also listed: `claude` 538, `miyaontherelay` 89, `kjgbot` 45, `AgentRelayBot` 24, plus `barryonthecape` 22 and `agent-relay-code[bot]` 7. | `gh api repos/AgentWorkforce/relay/contributors`, re-run 2026-10-29 |
| X: @Khaliqgant, about 1.5K followers. His personal OpenClaw bot is named "kjgbot". | [X mirror](https://teapawt.org/Khaliqgant), [genesis post](https://proactiveagents.dev/posts/the-genesis/) |

**Shared history (fact):** "We met on the basketball court in high school and have been teammates ever since." [Launch YC](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other). Will's LinkedIn also lists a "WilliGant Web Agency" freelance stint ([LinkedIn post snippet](https://www.linkedin.com/posts/willwashburn_the-tip-of-the-iceberg-of-what-weve-been-activity-7246666880701067264-uNyG)). *Inference:* the name combines theirs, so they have shipped together before.

**Inference on judging style:** both founders are hands-on engineers who dogfood heavily. Will says "We run 50+ agents in parallel ourselves", and agent accounts commit to their repo. Expect them to open your repo or terminal, and to spot faked agent-to-agent traffic quickly.

---

## 3. Company timeline

| Date | Event | Source |
|---|---|---|
| 2025-12-17 | `AgentWorkforce/relay` repo created *(background)* | `gh api repos/AgentWorkforce/relay` |
| Jan 2026 | @agent_relay X account joined. Feb 1 pinned post: "Go to Bed, Wake Up to a Finished Product" *(background)* | [X mirror](https://teapawt.org/agent_relay) |
| 2026-02-04 | Khaliq's blog post "Let Them Cook: Lessons from 6 Weeks of Multi-Agent Orchestration" *(background)* | [blog](https://agentrelay.com/blog/let-them-cook-multi-agent-orchestration) |
| 2026-02-27 | Agent Relay SDK launch. Will's blog post "Introducing Agent Relay"; Khaliq's LinkedIn post "Build the 5x team. Not the 10x agent." *(background)* | [blog](https://agentrelay.com/blog/introducing-agent-relay), [LinkedIn](https://www.linkedin.com/posts/khaliqgant_every-ai-company-is-racing-to-build-the-smartest-activity-7433281449396580352-x54X) |
| 2026-04-28 | Listed in the OSSCAR index from **Supabase** and Commit VC as one of the fastest-growing OSS projects of Q1 *(background)* | [X mirror](https://teapawt.org/agent_relay) |
| 2026-05-10 | Reframed as "a runtime for proactive agents" (clock, listener, inbox) *(background)* | [proactiveagents.dev](https://proactiveagents.dev/posts/the-genesis/) |
| 2026-08-05, 08-25 | Ratify Protocol cross-company trust demos, parts 1 and 2 | [blog](https://agentrelay.com/blog/trusting-an-agent-you-didnt-spawn) |
| ~2026-09-01 | Accelerator round recorded, $500K total | [Caplight](https://www.caplight.com/company/agentrelay) |
| 2026-09-18 | YC F26 announced publicly, with a "Try flows today" call to action; Khaliq publishes an X article "On Joining Y Combinator" | [X mirror](https://teapawt.org/agent_relay), [Mentionfox](https://mentionfox.com/funding/yc-agent-relay) |
| 2026-09-30 | IBTimes profile, with Khaliq quotes | [IBTimes](https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082) |
| 2026-10-16 | Site serves an OpenAI apps domain challenge (`/.well-known/openai-apps-challenge`) | `AgentWorkforce/agentrelay.com` commit log |
| 2026-10-19 | Haunted Hacks announced by Khaliq and Terse | [X mirror](https://teapawt.org/Khaliqgant/status/2112219340422721818) |
| 2026-10-21/26 | Docs rewritten "around sessions" | site commit log |
| 2026-10-23 | **Launch YC plus a launch video.** Will's X post shows about 96.4K views | [Launch YC](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other), [X mirror](https://teapawt.org/agent_relay/with_replies) |
| 2026-10-26/27 | Microsoft sign-in, `/download` desktop-app page, `/open-source` repo catalog | site commit log |
| 2026-10-29 | Freestyle agent hosting guide merged (PR #251, 20:17 UTC). It is a section called "Run the answering agent on a Freestyle VM" in `/docs/forward-deployed-agents`, and it targets the current `freestyle@latest` SDK and `/v5` API. Freestyle sponsors this event | `gh api repos/AgentWorkforce/agentrelay.com/pulls/251/files` |

Traction signals (fact, 2026-10-29): `relay` has 1,059 stars and 95 forks under Apache-2.0 (`gh api`, re-checked). The npm downloads API shows `agent-relay` at **3,325** downloads and `@agent-relay/sdk` at **26,277** for Oct 22-28, which is launch week ([npm API](https://api.npmjs.org/downloads/point/last-week/agent-relay)). An earlier draft said "about 1.0K", which was wrong or stale. @agent_relay has about 1K followers. LinkedIn lists 307 followers. There is one unnamed "design partner" who called it "indispensable" ([IBTimes](https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082)). The X mirror shows an actual user, Alan Ma, saying "we use agent relay so much the only way I get [a colleague] to read my texts is to tell his agent to bother him about it over relay" ([X mirror](https://teapawt.org/willwashburn)).

---

## 4. Positioning and ICP, and how it has shifted

| Period | Framing (verbatim where quoted) | Source |
|---|---|---|
| Feb 2026 | "an open-source SDK that gives agents real-time, cross-provider communication — so you stop being the message bus in the middle"; "basically slack, but for headless and built FOR agents" | [Introducing Agent Relay](https://agentrelay.com/blog/introducing-agent-relay) |
| May 2026 | "The thing was a runtime. A runtime for proactive agents." They name three primitives: clock (relaycron), listener (relayfile), inbox (relaycast). "We're betting that proactive becomes a category the way frontend cloud became a category." | [genesis](https://proactiveagents.dev/posts/the-genesis/), [Just Give the Agent Files](https://agentrelay.com/blog/just-give-the-agent-files) |
| Sep 2026 | YC directory one-liner: "The infrastructure to run coding agents for your team." Sectors: Developer Tools, Swarm AI | [Mentionfox](https://mentionfox.com/funding/yc-agent-relay) |
| Oct 2026 (now) | "Let your teams' coding agents message each other." Docs say: "Sessions are the product." Surfaces: Sessions, Forward deployed agents (public address), Flows, For agents | [YC](https://www.ycombinator.com/companies/agent-relay), [docs intro](https://agentrelay.com/docs/introduction) |

**Stated ICP (fact):** software teams where "every person on the team can have agents producing work faster, while the team still waits on people to pass questions, context, and updates between them" ([Launch YC](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other)). The homepage use cases are: frontend agent queries backend agent; two agents resolve a merge conflict; "Flatten timezones"; "Debug with customers, agent to agent" ([agentrelay.com](https://agentrelay.com/)).

**Business model (fact):** open-source self-host, plus a hosted cloud that is "Free to start" ([agentrelay.com](https://agentrelay.com/)). I found no paid pricing page: `/pricing` returned not-found to the fetcher.

**Inference:** the narrowing from "proactive runtime" to "team coding-agent messaging" is a classic YC wedge move. They are selling the simplest painful thing (copy-paste between agents) and keeping the broader runtime (files, auth, cron, flows) in the repos. Judges will probably value projects that demo the wedge clearly but hint at the broader platform.

---

## 5. Public statements that reveal what they value

All quotes are verbatim from the linked source. Dates are as shown in the source.

**On the thesis:**
- "Soon, agents will outnumber people on the internet. We think they should be able to find each other, talk to each other, and work together." "Messaging is where we're starting." Will, Oct 23, [Launch YC](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other)
- "My company's agent should be able to communicate with your company's agent. Not only should they be able to communicate, but they should be able to work together to accomplish a task." Khaliq, Aug 5, [blog](https://agentrelay.com/blog/trusting-an-agent-you-didnt-spawn)
- "Every AI company is racing to build the smartest single agent. That's the wrong race." "Build the 5x team. Not the 10x agent." Khaliq, Feb 27 *(background)*, [LinkedIn](https://www.linkedin.com/posts/khaliqgant_every-ai-company-is-racing-to-build-the-smartest-activity-7433281449396580352-x54X)

**On design principles:**
- "Don't be a meat proxy. Get your agents on the relay." Will, Oct 23, [Launch YC](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other). This is the closing line of the launch and a ready-made demo hook.
- "Goal with Agent Relay is not to take over the way you work and instead meet you where you are." And: "If your agent goes offline the messages are durable so when the agent comes back it'll get it. If it never does the sender at least knows it wasn't delivered (not just not read)". Will, Oct 24, [X mirror](https://teapawt.org/willwashburn/status/2113834761110319374)
- "You can choose which sessions are on the relay vs which ones stay local and private". Will, Oct 23, [X mirror](https://teapawt.org/willwashburn/status/2113753053191131581)
- "Agent Relay works well single harness across machines and importantly teammates". Will, Oct 24, [X mirror](https://teapawt.org/willwashburn/status/2113834761110319374)
- "Without a push mechanism, agents would poll — and polling agents inevitably forget". Khaliq *(background)*, [genesis](https://proactiveagents.dev/posts/the-genesis/)
- "'Multi-agent coordination' made developers reach for frameworks — LangGraph, CrewAI, AutoGen — when what we'd built was infrastructure." Khaliq *(background)*, same source
- "You give the agent the least amount of access possible so that it literally can't give away some of the data because it doesn't have access to it." Khaliq, Sep 30, [IBTimes](https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082)
- Launch video narration, as transcribed by a third party: "They also know what they're allowed to decide on their own and when they should come to you." [animatiQ breakdown](https://animatiq.ai/launch-directory/agent-relay) (secondary transcript, not checked against the video)

**On how they work this week** (these appear in the mirror as relative timestamps, roughly Oct 27-29):
- "imo very soon it will be weird NOT to share your sessions in a professional setting in the same way it'd be weird not to share the code you wrote"
- "we're getting rid of PRs on a lot of our repos"
- "a good measure for your dev setup is the rate at which you make important decisions. spending most of your time saying 'yes, do it' or 'fix that' is a signal you might need to level it up" (Oct 27)
- Khaliq: "My grok bot talks to my dot which interacts with my instinct. A true team of personal agents. Then my dot can spawn Claude or codex or even opencode agents." All four from the [X mirrors](https://teapawt.org/willwashburn) and [X mirror](https://teapawt.org/Khaliqgant).
- Khaliq, about Oct 23-24 (a quote-tweet of the launch post, about 7 hours after it): "A lot of people have been telling me that they built a crappy version of this. Build with us, it's open source!" [X mirror](https://teapawt.org/Khaliqgant)

**Orchestration playbook (Khaliq, Feb 4, background but still how they think):** "2-5 worker agents per Lead is the sweet spot"; "Claude for coordination, Codex for deep work"; "Shadow agents and reviewers catch lazy work"; "Store trajectories so future agents have context". The failure modes he names are a Lead that "excitedly declares everything done" with stubs, and Leads that get flooded and die. [blog](https://agentrelay.com/blog/let-them-cook-multi-agent-orchestration)

---

## 6. Competitive landscape

| Competitor / adjacent | What it is | How Agent Relay differs (per their own framing or the source) |
|---|---|---|
| **Claude Code Agent Teams** (experimental) and **native cross-session messaging** (`ListAgents`/`SendMessage`, Claude Code v2.1.224, released 2026-08-07) | One lead spawns Claude teammates with a shared task list. Native messaging sends plain-text messages between **one user's** Claude sessions. On the same machine it goes over a per-session socket. It also reaches that user's cloud sessions and sessions on other machines through Remote Control, which needs a claude.ai sign-in ([changelog](https://github.com/anthropics/claude-code/releases/tag/v2.1.224), [docs](https://code.claude.com/docs/en/cross-session-messaging)). An earlier draft said "same machine" only, which was wrong | Relay works across vendors (Codex, Cursor, OpenCode, Grok) and across **people and orgs**, with durable delivery to offline agents and shared session history. Claude's native feature is Claude-only and scoped to one account, and its messages carry "never your conversation history or files". Sources: [agent-loom README](https://github.com/osteele/agent-loom), [AgentCouch compare](https://agentcouch.dev/compare). Since Feb Khaliq has argued "Subagents don't work cross provider" ([blog](https://agentrelay.com/blog/introducing-agent-relay)) and admitted being "a little bit" worried about first-party Claude swarms ([blog](https://agentrelay.com/blog/let-them-cook-multi-agent-orchestration)) |
| **Claude Duet** (Anthropic, early access per Riley Brown) | Personal agent with Slack-like channels and tasks | Adjacent and platform-owned. Khaliq quote-tweeted that comparison and pitched Relay as the layer joining personal agents (Grokbot, dots, Instinct) to coding agents. [X mirror](https://teapawt.org/Khaliqgant) |
| **Google A2A** (Linux Foundation; A2A 1.0) | Open agent-to-agent protocol: Agent Cards, JSON-RPC, SSE | A2A is per-request. Relay is a hosted, persistent workspace (channels, DMs, history, observer). I found no Agent Relay A2A bridge in docs. Some rivals ship one: [a2abridge](https://github.com/vbcherepanov/a2abridge), [Murmur](https://github.com/alexfrmn/murmur) |
| **MCP Agent Mail**, **agent-loom**, **agmsg** | Open-source self-hosted or local inboxes for coding agents, some with file leases | Mostly single-machine or self-hosted. Relay adds a managed cloud, desktop app, and cross-company "forward deployed" addresses. [AgentCouch compare](https://agentcouch.dev/compare), [agmsg](https://github.com/kpab/agmsg) |
| **AgentCouch**, **agent-room.com**, **AgentDM**, **Roomcomm**, **join.cloud**, **crumple.dev** | Hosted agent chat rooms. AgentCouch is $5/person/mo Pro | Relay is open source plus free cloud, and bundles sessions history, files, auth and flows. The comparison table is [vendor-authored by AgentCouch](https://agentcouch.dev/compare) and does not list Agent Relay |
| **Buzz (Block)** | OSS community messaging used by agents | Same space, from a large company. [AgentCouch compare](https://agentcouch.dev/compare) |
| **Conductor, Paseo, Superset** | Single-UI multi-agent workspaces | Positioned as **complements**: "you can also use a tool like conductor or paseo if you want a single interface" (Will, Oct 24, [X mirror](https://teapawt.org/willwashburn/status/2113834761110319374)). Relay promoted a Superset integration on Mar 26 *(background)*, [X mirror](https://teapawt.org/agent_relay) |
| **LangGraph, CrewAI, AutoGen, Mastra** | In-process multi-agent frameworks | Relay calls itself "infrastructure", not a framework ([genesis](https://proactiveagents.dev/posts/the-genesis/)). *Inference:* a Mastra agent (Mastra is a sponsor) can be one participant on the relay, which is a natural sponsor-stacking story |
| **Mintive** (launched with $11M, retweeted by Will) and **Ratify Protocol** (partner) | Agent identity and permission, delegated authority | Complements for the cross-org trust story. [X mirror](https://teapawt.org/willwashburn), [blog](https://agentrelay.com/blog/trusting-an-agent-you-didnt-spawn) |
| **Terse Durable Actors** (co-host) | Stateful actors, an open-source Durable Objects alternative | Not a competitor. Actors give state and lifecycle; Relay gives cross-agent messaging. The event explicitly rewards using both |

**Inference on moat:** with only a 2-person team against Anthropic and Google, the defensible pieces are (1) vendor neutrality, (2) cross-person and cross-org identity and permissions (Relayauth, Ratify), and (3) shared session history as a team knowledge base. Projects that make those three visible will match the founders' own pitch.

---

## 7. Roadmap hints (inference unless noted)

- **Cross-company agents are a priority** (fact): forward deployed agents with public `agentrelay.com/u/<handle>`-style addresses, "Debug with customers, agent to agent", and the Ratify demos. [agentrelay.com](https://agentrelay.com/)
- **Personal agents as orchestrators.** Khaliq's grok bot to dot to Claude/Codex chain suggests Relay wants to connect consumer personal agents to engineering agents.
- **ChatGPT / OpenAI surface.** The Oct 16 OpenAI apps domain challenge suggests an OpenAI Apps (ChatGPT app) integration is coming. OpenAI is a sponsor here. Unverified beyond the commit.
- **Sessions replacing PRs and code review** (Will: "getting rid of PRs"). Shared sessions as the unit of review and audit.
- **Hosted always-on agents:** the Freestyle hosting guide (Oct 29), the `software-garden` "Always on AgentWorkforce" repo, and Daytona sandboxes in releases.
- **Fast breaking change** (fact): npm `agent-relay@latest` is 14.0.0 (Oct 13). The `next` tag is at `15.0.0-next.5` after five prereleases between Oct 27 and Oct 30 UTC. The GitHub tags `probe-v15.0.0` (Oct 29) and `probe-v15.0.1` (Oct 30 UTC) are the Rust "Agent Relay core" binary (`agent-relay-probe`), which `relay init` downloads and checks against a sha256. They are not the npm CLI. v15 is imminent, so pin versions.

---

## 8. What they want developers to build, and what will impress them as judges

**Stated (fact):**
- The event page asks for "your own Software Factory, long-running agent, multiplayer AI system", "agent to agent communication built with Agent Relay", and judges want "very well-executed products or incredibly creative use cases". [EVENT_PAGE](../../EVENT_PAGE.md)
- Khaliq's announcement: "Want to dig into agent to agent communication? ... Interested in playing with real time AI? ..." [X mirror](https://teapawt.org/Khaliqgant/status/2112219340422721818)
- Their own demo repos show the kind of thing they find fun: `swarm-patterns` ("built entirely by AI agents talking to each other"), `software-garden-demo` ("A tiny garden simulator, tended by agents"), and `vibe-city-game`. [GitHub org](https://github.com/AgentWorkforce)

**Inferred judging preferences** (inference, ranked by confidence):
1. **Real agent-to-agent traffic, visible live.** Messages flowing between heterogeneous agents (Claude plus Codex plus an OpenAI-API agent) on screen, ideally in the Relay observer or dashboard. No human copy-paste anywhere in the demo, because that is their entire pitch.
2. **Peer coordination, not just a parent and its subagents.** Khaliq contrasts Relay with hierarchical subagents: "peer conversations back and forth... more creative and emergent solutions."
3. **The things native tools can't do:** cross-vendor, an agent going offline and catching up from durable messages, two *different humans'* agents negotiating, and a non-Claude agent on a Freestyle VM. Since Claude Code v2.1.224, "cross-machine" alone is not unique: Claude can already message the same user's sessions on other machines.
4. **Least-privilege and trust shown explicitly**: scoped permissions, an agent that escalates to a human ("when they should come to you").
5. **Durable Actors and Relay together**: Terse actors hold per-agent or per-room state while Relay carries the messages. The event offers bonus points for this, and it is the "real-time plus stateful" story both hosts share.
6. **Polish beats breadth.** They just shipped a desktop app and a 90-second launch video with a strong hook. A tight 2-minute demo with a clear "before (human bus) / after" beat will land.

---

## 9. Limits / could not verify

- I could not read Khaliq's X article "On Joining Y Combinator" (Sep 18) or his "My Superpower Is Perspective" (Aug 31). X articles are not exposed by the mirror.
- **Judges are not announced.** The event page says "Judges will be announced soon." I could not confirm whether Will, Khaliq or Grey Baker will judge.
- The funding amounts come from aggregators (Caplight, Fundraising Fox), not company announcements. Shumer Capital appears only on Will's LinkedIn.
- The Tailwind "Series A" vs "Series B" conflict is unresolved.
- Customer names, revenue and paid tiers were not found. The "design partner" is anonymous.
- X post dates in the third-party mirror sometimes show as relative times ("2h"). I have given approximate dates and labeled them.
- Claude Duet and the "personal agents" landscape come from a single quote-tweeted post (Riley Brown) and were not independently verified.
- The AgentCouch comparison table is vendor-authored and omits Agent Relay.

---

## 10. Hackathon implications

**What to build** (aligned with the founders' thesis):
- **"Haunted handoff": a multiplayer, cross-vendor agent team that keeps working while the humans leave.** For example, a Codex "builder", a Claude "reviewer/lead", and an OpenAI-API "ghost" agent on a Freestyle VM coordinate over Relay channels. Each agent's state (task claims, memory, retries) lives in a Terse Durable Actor. In the demo, kill one agent mid-task. Show its messages queuing durably and the agent resuming from actor state. That one moment covers both hosts, durable delivery, and "real-time".
- **Cross-org variant:** two teams' agents (yours and a "customer's") debugging together through a forward deployed address, with scoped permissions and a human-escalation step. This is close to their "debug with customers, agent to agent" roadmap.
- Keep 2-5 workers per lead (Khaliq's sweet spot), and add a reviewer or "shadow" agent that catches stubbed work.

**Gotchas:**
- Releases are moving fast: npm `next` is `15.0.0-next.5`, and the core binary is already at probe 15.0.1. A v15 `latest` could ship on Oct 30 or 31. Pin `agent-relay` and `@agent-relay/sdk` to exact versions on Friday and don't take `next`. `relay init` fetches the core binary separately, so record which probe version it pulled.
- The docs were rewritten Oct 21-26 and the older SDK docs live under `/docs/7.1.1/`. Check which API surface your code targets.
- Don't pitch "multi-agent framework". They explicitly distance themselves from LangGraph and CrewAI framing. Say "infrastructure / messaging layer".
- Don't rely only on Claude Code's built-in Agent Teams for the coordination. Judges will ask what Relay added.

**Setup before Oct 31** (ideas and setup are allowed; code must be written at the event):
- Create a hosted Relay account and install the desktop app. Run the "give the link to your agent" setup once on each laptop, then verify a Claude Code to Codex DM works.
- Read the Freestyle section of https://agentrelay.com/docs/forward-deployed-agents (merged Oct 29). It uses `npm install freestyle@latest` and the `/v5` API and warns that older `freestyle` packages differ. Claim your Freestyle credits so an always-on remote agent is ready. Keep `FREESTYLE_API_KEY` and the Relay workspace key out of the repo.
- Run `/list-agents` in Claude Code (v2.1.224 or later) so you know what native messaging already does. Then you can say exactly what Relay adds when the judges ask.
- Skim the Terse Durable Actors quickstart so the state layer isn't new on the day.
- Join the Agent Relay Discord (linked from agentrelay.com). Founders answering questions there in real time is likely.
- Have Builderbase signup ready.

**What judges and sponsors want** (inference):
- Agent Relay: visible, autonomous, peer-to-peer agent messaging across vendors and machines; durable and offline delivery; least-privilege; a crisp before/after story.
- Terse: real statefulness. Combining both earns the stated bonus.
- Supabase "scale to millions": tie session history and messages to Postgres/Realtime and say how it scales. Supabase already rated Relay a fast-growing OSS project (OSSCAR).
- Freestyle and OpenAI: run at least one agent on a Freestyle VM and one on the OpenAI API. Agent Relay itself just documented Freestyle hosting and appears to be preparing an OpenAI Apps surface.

---

## Sources

- https://www.ycombinator.com/companies/agent-relay
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other
- https://www.ycombinator.com/founders/will-washburn
- https://agentrelay.com/
- https://agentrelay.com/docs/introduction
- https://agentrelay.com/blog/introducing-agent-relay
- https://agentrelay.com/blog/let-them-cook-multi-agent-orchestration
- https://agentrelay.com/blog/just-give-the-agent-files
- https://agentrelay.com/blog/trusting-an-agent-you-didnt-spawn
- https://proactiveagents.dev/posts/the-genesis/
- https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082
- https://linkedin.com/in/willwashburn
- https://no.linkedin.com/in/khaliqgant
- https://linkedin.com/company/agent-relay
- https://www.linkedin.com/posts/khaliqgant_every-ai-company-is-racing-to-build-the-smartest-activity-7433281449396580352-x54X
- https://www.linkedin.com/posts/maryewashburn_you-had-me-at-stop-copypasting-between-activity-7519423152616300545-gqwD
- https://www.prnewswire.com/news-releases/tailwind-acquires-replierai-adding-ai-capability-to-help-marketers-break-writers-block--write-better-copy-301514233.html
- https://www.caplight.com/company/agentrelay
- https://fundraisingfox.com/companies/agent-relay
- https://mentionfox.com/funding/yc-agent-relay
- https://teapawt.org/agent_relay and https://teapawt.org/agent_relay/with_replies
- https://teapawt.org/willwashburn, https://teapawt.org/willwashburn/status/2113753053191131581, https://teapawt.org/willwashburn/status/2113834761110319374
- https://teapawt.org/Khaliqgant, https://teapawt.org/Khaliqgant/status/2112219340422721818
- https://teapawt.org/karatzas_thomas/status/2112219511327965403
- https://animatiq.ai/launch-directory/agent-relay
- https://luma.com/yc-meetup-7183-9316f87f
- https://builderbase.com/event/haunted-hacks-2026
- https://registry.npmjs.org/agent-relay
- https://github.com/AgentWorkforce (org, plus `gh api` on `relay` and the `agentrelay.com` commit log)
- https://github.com/anthropics/claude-code/releases/tag/v2.1.224
- https://code.claude.com/docs/en/cross-session-messaging
- https://agentrelay.com/docs/forward-deployed-agents
- https://api.npmjs.org/downloads/point/last-week/agent-relay and https://api.npmjs.org/downloads/point/last-week/@agent-relay/sdk
- https://agentcouch.dev/compare
- https://github.com/osteele/agent-loom
- https://github.com/vbcherepanov/a2abridge
- https://github.com/alexfrmn/murmur
- https://github.com/kpab/agmsg
- https://agent-talk.github.io/

---

## Verification log (2026-10-29)

An adversarial re-check against live sources, run late on Oct 29 PT (Oct 30 UTC). "Confirmed" means the source text matched. "Corrected" means the doc was edited.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Founders, F26, team size 2, partner Grey Baker, SF | Exa fetch of the YC company and founder pages | **Confirmed** |
| 2 | Will "about 13 years" at Tailwind | The YC page says "14 years". The LinkedIn dates in the doc give about 12.75 | **Corrected** to "13-14 years" with both sources. The Series A vs B conflict remains (YC still says "Series A") |
| 3 | Khaliq's YC bio quote, Oslo base, 6-hour gap, "40-50 agents" quote, "least amount of access" quote | YC page and IBTimes (Sep 30, Callum Turner) | **Confirmed** verbatim |
| 4 | Launch YC on Oct 23, with "Soon, agents will outnumber people..." and "Messaging is where we're starting" | Launch YC page (published 2026-10-23, by Will) | **Confirmed**. Added the "Don't be a meat proxy" line |
| 5 | $500K accelerator round, investor list | Caplight: Accelerator, Sep 1 2026, $500K, with YC, Cortical, Yonder, Hustle Fund and Active Capital | **Confirmed**, but reworded: $500K is Caplight's *total*, not a confirmed "YC deal plus angels". Shumer Capital is not on Caplight |
| 6 | 1,057 stars, 95 forks, Apache-2.0, repo created 2025-12-17 | `gh api repos/AgentWorkforce/relay` | **Corrected** to 1,059 stars (growth). Forks, license and creation date confirmed |
| 7 | Contributor counts | `gh api .../contributors` | **Confirmed**, except `kjgbot` is now 45 (was 43) |
| 8 | npm `agent-relay` about 1.0K weekly downloads | npm downloads API, Oct 22-28 | **Refuted**: 3,325, plus 26,277 for `@agent-relay/sdk`. Corrected |
| 9 | "v14.0.0 Oct 13, probe-v15.0.0 Oct 29" and "v15 prerelease" | `gh api releases`, npm dist-tags | **Partly corrected**: probe tags are the Rust core binary, not a prerelease of the npm package. npm `next` = 15.0.0-next.5, `latest` = 14.0.0. probe-v15.0.1 is also out |
| 10 | Freestyle hosting guide merged Oct 29 (#251) | `gh api .../pulls/251` | **Confirmed** (merged 20:17 UTC). Added the location (`/docs/forward-deployed-agents`) and the SDK/v5 detail |
| 11 | OpenAI apps domain challenge commit Oct 16; docs rewritten around sessions Oct 21-26; Microsoft sign-in, /download and /open-source on Oct 26-27 | `agentrelay.com` commit log | **Confirmed** (the OpenAI change merged Oct 18 as PR #230) |
| 12 | Claude Code native messaging is "same machine" only | Claude Code v2.1.224 changelog (Aug 7 2026) and cross-session docs | **Refuted**: it reaches the same user's sessions "on any of your machines" via Remote Control. Corrected in the TL;DR, the competitor table and the judging section |
| 13 | Khaliq's Oct 19 hackathon announcement quote | teapawt mirror | **Confirmed** verbatim. Note that it says "Hosted by @ycombinator and run by @agent_relay and @IncTerse" |
| 14 | Will's Oct 23/24 replies ("meet you where you are", durable delivery, "conductor or paseo", "local and private") and the 96.4K launch views | teapawt status mirrors | **Confirmed**. The view count is now about 96.6K. The "conductor or paseo" source was re-pointed to Will's status page (it was cited to the @agent_relay page) |
| 15 | Khaliq "Build with us, it's open source!" dated Oct 27-29 | Mirror shows it as a quote-tweet of the launch, about 7 hours after the Oct 23 post | **Corrected** the date to about Oct 23-24 |
| 16 | Mintive $11M (retweeted by Will); OSSCAR index by Supabase and Commit VC | Mirrors: Jiquan Ngiam's launch post (Cowboy VC led); Supabase post Apr 28, Agent Relay post Apr 29 | **Confirmed** |
| 17 | Homepage strings ("Free to start", "Flatten timezones", "Debug with customers, agent to agent", forward deployed `/u/` address, Discord), `/pricing` 404, `/docs/7.1.1` | `curl` of agentrelay.com | **Confirmed**. The Discord invite is `discord.gg/6E6CTxM8um` |
| 18 | Quotes "Sessions are the product", "basically slack...", "Subagents don't work cross provider", "My company's agent..." | `curl` of the docs and blog pages | **Confirmed** verbatim |

Not re-checked (left as originally labeled): the LinkedIn-only claims (Social Blendr, WilliGant, Shumer Capital), the animatiQ transcript, Claude Duet (from a single Riley Brown post), and the AgentCouch table. The exact dates for the mirror's relative timestamps ("2h", "43m") are still approximate.

