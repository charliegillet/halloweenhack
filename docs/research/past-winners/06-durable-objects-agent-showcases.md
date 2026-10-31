# Prior art: what has already been built on Durable Objects/actors and agent-to-agent messaging

Researched 2026-10-29, two days before Haunted Hacks (Oct 31, 2026). **Angle:** public showcases, hackathon entries, official examples and Show HN projects built on Cloudflare Durable Objects (DO), Rivet Actors, Terse Durable Actors, and agent-to-agent (A2A) messaging. The goal is to name the clichés and find white space. This file does not repeat the host repo deep-dives in `../terse/03-github-code.md` and `../agent-relay/03-github-code.md`. It points to them where they matter.

**Method:** Exa search and fetch, `gh api` against GitHub (the network was flaky, so some star counts are missing), and the Cloudflare, Rivet and A2A changelogs. Labels: **[V]** means I read it at the cited source. **[I]** means my inference. **Background** means the item is older than Aug 2026.

---

## TL;DR

1. **The most common pattern is "one DO per room, plus WebSockets, plus a game."** Examples run from Cloudflare's 2021 multiplayer Doom to a dozen 2026 Show HNs (MUDs, fighting games, chess variants, hangout spaces). Judges from Terse and Agent Relay will have seen this many times. A room actor alone is not a pitch. [V for the examples, I for the judgment]
2. **The most common Halloween idea is "an AI murder mystery where each suspect or ghost is its own actor."** It has been built at least four times: Case 47 (ElevenHacks × Cloudflare), Horror Quest (DO-backed Discord activity), Midnight at the Voss Manor (Kiroween), and **the Terse team's own `whitechapel` co-op detective game (Oct 9, 2026).** Building it again means copying the host's demo. [V]
3. **The most common multi-agent idea is "agents debate, argue, or play social deduction."** Werewolf tournaments (AGI House 2024, with many arena repos since), Tribunal (an AI courtroom on DOs), Agent Relay's own "Rust vs Go" argument demo, and ghost-council debates are all taken. [V]
4. **Cognizant published "Haunted Hollow" on Oct 29, 2026, today.** Sixteen Claude Haiku agents trick-or-treat in a haunted village. Its main finding is that **shared records got rewritten and unsupported claims spread between agents without being checked against the world.** That is a fresh, citable problem statement that an actor (a single writer of truth) plus Relay (the gossip channel) answers directly. [V for the post, I for the fit]
5. **The best evidence of white space comes from a host's post-mortem of 24 A2A hackathon entries (Aicoo, Jul 2026).** It reports that "Nobody built an agent marketplace, async fire-and-forget A2A, cross-agent reputation, agent-to-agent settlement, or multi-party deliberation", and that "True peer-to-peer A2A is still aspirational." [V] The same post-mortem, however, lists an **"append-only shared-context ledger"** pattern (MedRoute: specialist agents append to a locked core record) and a **gossip** entry (AgentGossip), so "shared verified memory between agents" is not completely untouched. Note also that Aicoo's champion was a project literally named **"Relay"**, unrelated to Agent Relay. [V, corrected 2026-10-29]
6. **Tic-tac-toe is off the table.** It is Agent Relay's "original proof point" (Claude vs Codex) and also an official `cloudflare/agents` example. [V]

---

## 1. What has been built, grouped by pattern

Items are recent (Aug-Oct 2026) unless marked as background.

### A. One room actor running a multiplayer game or world (saturated)

| Project | What it is | Date | Source |
|---|---|---|---|
| Multiplayer Doom | Wasm Doom with DO message routing, up to 4 players | Background (May 2021) | [CF blog](https://blog.cloudflare.com/doom-multiplayer-workers/) [V] |
| The Hollow Grid | A federated MUD where **one DO holds a whole world**. A single 3-second `alarm()` drives all game time, and a hub Worker federates two worlds. AI "mud-bots" play the game and double as live QA. | Background (Jun 6, 2026, updated Jul) | [skyphusion.net](https://skyphusion.net/blog/the-hollow-grid/) [V] |
| LennyFighter, Monochess, Clawd Penguin | Show HN games: DO match rooms with hibernatable WebSockets, a DO chess-with-cards server, and an ASCII hangout | Background (about Mar-Apr 2026, inferred from HN item IDs) | [HN 47850446](https://news.ycombinator.com/item?id=47850446), [HN 48309054](https://news.ycombinator.com/item?id=48309054), [HN 47877054](https://news.ycombinator.com/item?id=47877054) [V] |
| llmgames-online | **Humans and external AI agents share the same rooms.** DOs own the rules, timers, seats and private state. Agents join through remote MCP and receive "their own projected state". | **Created Oct 10, 2026** | [GitHub](https://github.com/skyaara/llmgames-online) [V] |
| Rivet game guides | Official templates for battle royale, IO game, turn-based, open world (one actor per chunk), party game, ranked matchmaking and idle games | Current docs | [rivet.dev/guides](https://rivet.dev/guides/) [V] |
| Vault (ElevenHacks "Hack #2: Cloudflare", 3rd place) | A voice escape room. One DO per room "tracks the wall position, runs the squeeze timer, and broadcasts updates" over WebSocket. Per the repo README, a **DO Alarm "fires every 5s, decrements wall gap, broadcasts to all clients"**. The co-op puzzle is split across two parallel voice agents. | Background (Mar 26-Apr 2, 2026; winners Apr 7) | [ElevenHacks](https://hacks.elevenlabs.io/hackathons/1), [repo](https://github.com/padmanabhan-r/Vault) [V] |

**Takeaway [I]:** the room actor is now table stakes. Hollow Grid and Vault are good examples of the **alarm as a world clock**. That idea is useful, but it is no longer novel.

### B. AI characters living in a shared persistent world (heavily done)

- **AI Town** (a16z + Convex). About 10.7K stars, from Aug 2023 (background). Inspired by Stanford's *Generative Agents*. Clones include Cat Town and AI Silicon Valley. [GitHub](https://github.com/a16z-infra/ai-town), [HN](https://news.ycombinator.com/item?id=37128293) [V]
- **tldraw + PartyKit NPCs** (Matt Webb, Oct 2023, background). AI "NPC users" with their own cursors draw on a multiplayer canvas. He argues "if we're going to have human-AI collaboration, then apps should be natively multiplayer." [PartyKit blog](https://blog.partykit.io/posts/ai-interactions-with-tldraw/) [V]. tldraw's multiplayer starter kit runs one DO per canvas room with up to 50 collaborators. [tldraw docs](https://tldraw.dev/starter-kits/multiplayer) [V]
- **Woo** ("LambdaMOO for agents") on DOs and MCP. May 2026 (background). hnshowcase's automated "AI Analysis" verdict: "lacks a concrete demo showing real multi-agent coordination." [hnshowcase](https://hnshowcase.com/post/47973443/woo-a-multi-user-world-for-agents) [V]
- **Artifice.** A 4-player strategy game played by AI agents, with free-text diplomacy between them, on Workers + DO. Mar 2026 (background). [HN](https://news.ycombinator.com/item?id=47328876) [V]
- **Cognizant "Haunted Hollow" (Oct 29, 2026).** Sixteen agents (vampires, werewolves, a mummy, and house owners with candy). Agents whose energy runs out become ghosts. The reported findings: "Public accusations influenced reputations, shared records could be rewritten, and claims repeated by neighbours gained acceptance without confirmation from the world itself." All 16 ran on Claude Haiku 4.5, and public signs "anyone could read or rewrite" were the only shared record. One sign was rewritten more than 20 times until it hit its 500-token limit, and the village falsely "declared dawn" while the simulation kept running. The post ends with three questions: "Can agents check consequential claims against the environment?", "Do corrections reach everyone who encountered the original accusation?" and "Can shared records preserve earlier versions and identify who changed them?" [Cognizant AI Lab](https://www.cognizant.com/us/en/ai-lab/blog/halloween-ai-agent-simulation-terralingua) [V]

**Takeaway [I]:** a passive "watch the agents live" simulation is a 2023 idea. Haunted Hollow, published two days before the event, also takes the Halloween version of it. Copying the sim is weak. Answering its open questions is strong (see section 5).

### C. Murder mystery or detective game with one actor per suspect (the top Halloween cliché)

| Project | Stack | Source |
|---|---|---|
| **TerseAI/whitechapel** | Two-player co-op AI detective with `case-actor` and `scene-actor` on Durable Actors, Oct 9, 2026 | `../terse/03-github-code.md` (row for whitechapel) [V there]. Terse's social pulse says the founders' best organic reactions came from "the murder-mystery game" [V there] |
| Case 47: The Last Night | Noir interrogation game. "Each of the suspects lives in its own Cloudflare Durable Object", and voice changes with emotion. Background (Mar-Apr 2026). | [ElevenHacks](https://hacks.elevenlabs.io/hackathons/1) [V] |
| Horror Quest | Multiplayer murder mystery inside Discord, with an AI game master, group voting, and DO multiplayer state | [horrorquest.shadowskeep.co.za](https://horrorquest.shadowskeep.co.za/) [V; date unknown] |
| Midnight at the Voss Manor | Five AI ghost agents "debate in real-time" about the player's choices (Kiroween 2025, background) | [Devpost](https://devpost.com/software/phantom-escape-ai-powered-haunted-house-puzzle-master) [V] |
| Tales Beyond the Tomb, aeith (ETHGlobal 2024) | Haunted lobby mystery with voting, and an on-chain haunted-mansion mystery | [GitHub](https://github.com/Dev1822/syntaxsquad), [GitHub](https://github.com/tricodex/aeith-etho2024) [V] |

**Takeaway [I]:** pitching "ghost NPCs each in their own actor, solve the murder" to the Terse founders means pitching their own demo back to them. It loses on originality even if the execution is good.

### D. Agents debating, arguing, or playing social deduction (saturated)

- **Werewolf/Mafia:** the AGI House "Werewolf Agents Tournament" had 150 participants (Nov 2024, background) ([Sentient recap](https://www.sentientc.ai/resources/werewolf-hackathon/index.html)). At least five open-source LLM Werewolf arenas exist ([nightfall-ai-arena](https://github.com/CJHwong/nightfall-ai-arena), [deepwolf](https://github.com/JuneQQQ/deepwolf), [social-games-arena](https://github.com/Archelunch/social-games-arena), [metamafia](https://github.com/shravya-rep/metamafia), [Werewolf Arena](https://drchangliu.github.io/WerewolfArena/)). [V]
- **Tribunal** (ElevenHacks × Cloudflare): Prosecutor, Defender, Judge, Expert and Historian, each a DO with its own SQLite, plus a `CaseDO` that orchestrates a Workflow. [GitHub](https://github.com/MuhammadAli511/tribunal) [V]
- **Agent Relay's own go-to viral format** is agents arguing (the `/relay-team` Rust vs Go vs C++ demo). See `../agent-relay/04-social-pulse.md` [V there].
- **AI Mafia** (same ElevenHacks × Cloudflare event, Apr 2026, background): a voice social-deduction game against "five persistent AI characters" on Workers + DOs + Workers AI. [ElevenHacks](https://hacks.elevenlabs.io/hackathons/1) [V, added 2026-10-29]
- "Discussion Companion" (A2A Agents Hackathon, Jul 2025): multi-agent brainstorming on a shared canvas. [Devpost](https://a2a-agents-hackathon.devpost.com/project-gallery) [V]

### E. Background coding agents and software factories (credible, but crowded and heavy)

- **Ramp Inspect.** Each session gets a DO with its own SQLite, and the Cloudflare Agents SDK handles WebSocket hibernation and streaming. Modal says Inspect started "roughly half of all merged pull requests" at Ramp. Background (early 2026). [Ramp eng](https://engineering.ramp.com/post/why-we-built-our-background-agent), [Modal](https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal) [V]
- **OpenInspect** (ColeMurray/background-agents). **3,406 stars, pushed Oct 30, 2026 (UTC)**. The control plane runs on DO + D1 and the data plane on Modal. Terse forked a version (`TerseAI/background-agents`, Oct 12). [GitHub](https://github.com/ColeMurray/background-agents) [V]
- The Terse HN launch lists "RampInspect, OpenInspect … Liveblocks and PartyKit" as the notable DO projects it targets. [HN 49980399](https://news.ycombinator.com/item?id=49980399) [V]
- Terse's "tiny Lovable" (mini-lovable), Rivet's `sandbox-coding-agent` example, Rivet's Claude Code, Codex, OpenCode and Amp guides (one session per actor), and Cloudflare's `sandbox-coding-agent` example all exist. [rivet.dev/guides](https://rivet.dev/guides/), `gh api repos/cloudflare/agents/contents/examples` [V]

**Takeaway [I]:** the "software factory" framing is literally in the event brief. A generic background coding agent, though, competes with a 3.4K-star OSS project and with the hosts' own demos. If you go this way, the twist has to be agent-to-agent (for example, Claude Code hands off to a Codex reviewer over Relay), not the sandbox.

### F. Linear "multi-agent" pipelines (common, and judges see through them)

- **HauntedAI** (Kiroween): Story → Asset → Code → Deploy agents over Redis pub/sub, plus NFTs. [Devpost](https://devpost.com/software/hauntedai-multi-agent-ai-platform) [V]
- **ActualCode** (AI Tinkerers & Google Cloud Toronto): "7 collaborative AI agents" over A2A in a Scanner → Analyzers → Creator → Validator chain (about 20 A2A messages per run: unverified, not visible in the re-fetched page), and it claims to be the "first hackathon project with A2A protocol." [entry](https://toronto.aitinkerers.org/hackathons/h_KQnA_tMSu9Y/entries/ht_6bFNZuJQrUs) [V]
- **Assumption Alarm** (AI Tinkerers "Agents, Everywhere", Sep 12, likely 2026 [I on the year]): Extractor, Watcher, Evaluator and Notifier agents as Cloudflare Agents SDK DOs. Its stated north star is "the system noticed something I had forgotten mattered." This is a good example of a *proactive* actor, not a chat box. [entry](https://cape-town.aitinkerers.org/hackathons/h_KfDGCraItb4/entries/ht_YRB6rVGdhZI) [V]

### G. Agent economies, markets and shared canvases (partly done, and the most open area)

- **Centyso's "closed token economy" hackathon platform.** One Worker plus DOs holding a ledger, escrow, legislation, an LLM-judged court and x402 payments between agents, with participant code isolated in Dynamic Workers. [Centyso](https://centyso.com/work/hackathon-platform-for-human-steered-ai-agents-in-a-closed-token-economy/) [V; date not shown]
- **Agents Bake Off** (ElevenHacks): a 1,000,000-pixel canvas where agents solve per-pixel challenges to win paint, with the board sharded across DOs. [submission](https://hacks.elevenlabs.io/submissions/c8fa12ed-50a0-47c5-a2e6-2300295be556) [V]
- **Aicoo A2A hackathon post-mortem** (Jul 9, 2026, about 100 hackers, 24 entries). Thirteen of 24 entries clustered on "brokering access to someone's context under permission" (hiring, org routing, procurement). "The winners all made the permission boundary the product." The `network` (peer discovery) primitive was "load-bearing in none that shipped." Autonomy primitives and group chat were "almost entirely unused." [Aicoo blog](https://www.aicoo.io/blog/our-own-agent-hackathon) [V]

### H. A2A interop demos (enterprise-flavored and dry)

- Official samples are the travel and purchasing-concierge style. The `cloudflare/agents` repo ships an `a2a` example: Agent Card at `/.well-known/agent-card.json`, JSON-RPC `message/send` and `message/stream`, and a **DO-backed TaskStore**. [V via `gh api`]
- ETHOnline 2025 "Best Use of Hedera Agent Kit & Google A2A": Zomato, Pizza Hut and McDonald's agents with on-chain identity ([ETHGlobal](https://ethglobal.com/showcase/hedera-agent-trust-mur21)). An "Agent Trust Gateway" won a track at nebulafog.ai, Mar 2026 ([LinkedIn](https://www.linkedin.com/posts/sanjana-mishra_aisecurity-agentsecurity-a2a-activity-7440566535557099520-rr9y)). Background. [V]
- The GKE Turns 10 grand prize was a grocery cart-to-recipe assistant on ADK + A2A ([HackWinners](https://hackwinners.pages.dev/en/)). Background. [V]

### I. Persistent voice or room agents (a healthy niche)

ElevenHacks × Cloudflare (judge: Sunil Pai of Cloudflare) produced Eternal Jam Session, Storefront, Haven, CallWiz and Launch Studio ([ElevenHacks](https://hacks.elevenlabs.io/hackathons/1)) [V]:

- **Eternal Jam Session:** a shared AI music room that **auto-evolves while the room is quiet** via a scheduled idle pass.
- **Storefront:** one DO per business, with self-rescheduling weekly re-scrapes and real phone numbers.

These show what judges reward: **the actor does something while no one is watching.**

---

## 2. What the two hosts already showcase (do not clone)

| Host | Their demos | Source |
|---|---|---|
| Terse | whitechapel (co-op detective), mini-lovable (tiny Lovable / software factory), a Mastra multiplayer chat with split panes, talkingAgent ("Tik Tok Talk Demo"), a multiplayer AI whiteboard video, background-agents (an OpenInspect fork), and a YC demo-showcase agent-coordination demo that "lost in the finals to a robotic arm playing Doom" | `../terse/03-github-code.md`, `../terse/04-social-pulse.md` [V there] |
| Agent Relay | tic-tac-toe Claude vs Codex ("the original proof point"), relay-pulse and relay-visualizer (message-flow animations), swarm-patterns, software-garden-demo, cross-framework LangGraph↔CrewAI, Claude-writes/Codex-reviews handoff, and agents arguing | `../agent-relay/03-github-code.md`, `../agent-relay/04-social-pulse.md` [V there] |

[I] Matching their *taste* (visible agent traffic, durability that survives disconnects, multiplayer) is good. Matching their *subject matter* (a detective game, tic-tac-toe, a coding factory, agents arguing) is bad.

---

## 3. Platform shifts in the last 90 days that change what is impressive

- **Cloudflare, Oct 1, 2026:** pending I/O (service-binding calls, DO-to-DO RPC, `waitUntil`, timers) now keeps a DO alive with no client connected, for up to 15 minutes per operation. "This change helps you run long-running tasks such as agents." [changelog](https://developers.cloudflare.com/changelog/post/2026-10-01-pending-io-keep-alive/) [V]. **[I] "My agent keeps working after I close the tab" is now default behavior on the incumbent, so it has to be shown dramatically (kill the process, reopen) rather than just claimed.**
- **Cloudflare Birthday Week (Sep 28-Oct 2):** Containers gained a new `durable_object` scheduling policy, "start 6x faster" (median just over 4 s down to 648 ms in ComputeSDK's benchmark), and filesystem snapshots in public beta (Sep 30). The Monetization Gateway entered beta (Sep 30; first announced Jul 1, 2026). K2 serverless event streams, Cloudflare OS (waitlist), and a competition to "build a Git platform designed for the era of AI agents" were announced Oct 1. [wrap-up](https://blog.cloudflare.com/birthday-week-2026-wrap-up/), [Containers](https://blog.cloudflare.com/faster-agent-sandboxes/), [Monetization Gateway](https://blog.cloudflare.com/monetization-gateway/) [V]
- **Worker Previews (Sep 22, so before Birthday Week rather than part of it):** each `wrangler preview` gets "a new Durable Object namespace and Container application", so bad migrations stay on the branch. [CF blog](https://blog.cloudflare.com/worker-previews/) [V, corrected 2026-10-29]
- **Deno joins Cloudflare (Oct 9):** celld merges into workerd "to radically simplify self-hosting Workers and Durable Objects." [CF blog](https://blog.cloudflare.com/deno-joins-cloudflare/) [V]. [I] This undercuts part of Terse's "OSS alternative" pitch, so the Terse judges will value demos that show *configurable compute* or per-actor resource control, which DO does not offer.
- **Rivet:** Dynamic Apps (Aug 31), Rivet MCP (Sep 10), actor JWTs (Sep 24), Pi 1.0 Actors at "0.82 MB of RAM per session" (Oct 1), Pi Durable (Oct 7), agentOS 0.4 Hosted VMs (Oct 12), and the Rivet 3.0 preview on S3-backed WarpDrive (Oct 26). [Rivet blog](https://rivet.dev/blog/) [V]. Rivet's examples include `ai-and-user-generated-actors-freestyle` (Freestyle is a sponsor here) [V via the GitHub listing].
- **A2A:** joined the Agentic AI Foundation (Aug 27), shipped an official `a2a` CLI with `--exec` that "turns any program that reads stdin and writes stdout into a working A2A server" (Oct 1), and has about 26.3K repo stars. [A2A blog](https://a2a-protocol.org/latest/blog/archive/2026/), [CLI post](https://a2a-protocol.org/latest/blog/2026/10/01/introducing-a2a-cli/) [V]

---

## 4. Cliché scorecard

| Idea | Times seen | Risk at this event [I] |
|---|---|---|
| Murder mystery or haunted mansion with one actor per suspect or ghost | 5+, including the Terse team's own | **Very high** |
| Tic-tac-toe or chess between agents | Relay's first demo, a CF example, CF's ChatGPT chess app | **Very high** |
| Werewolf/Mafia agents | Dozens | High |
| Agents debate or form a council/courtroom | Many (Tribunal, Voss Manor, Relay's own) | High |
| Linear Story→Image→Code "agent pipeline" | Many | High (judges see a for-loop) |
| AI Town-style passive village sim | AI Town 2023, plus Haunted Hollow on Oct 29 | High |
| Generic background coding agent | OpenInspect (3.4K stars) and host demos | Medium-high |
| Multiplayer room game with AI flavor | Saturated | Medium (fine as a vehicle, not as the idea) |
| Proactive actor that acts while no one is connected | A few (Eternal Jam, Assumption Alarm, Storefront) | Low-medium |
| Agents with reputation, settlement, and contention over scarce shared state | Few (Centyso, Agents Bake Off) | **Low** |
| Verifiable shared memory and rumor provenance between agents | None found as a product. Haunted Hollow names it as an open problem | **Low** |
| Async fire-and-forget A2A across machines or teams | Aicoo: "nobody built" | **Low** |

---

## 5. White space (inference, with the evidence behind each)

1. **The truth keeper vs the rumor mill.** Agents gossip and coordinate over Agent Relay channels and DMs. A Durable Actor is the single, serialized, versioned record of what actually happened. Every claim an agent makes is checked against the actor, and rewrites are attributed and kept. This answers Cognizant's Oct 29 questions ("Can shared records preserve earlier versions and identify who changed them?") in a Halloween wrapper: ghosts whispering lies in a haunted town while the "Book of the Dead" actor refuses forgeries. It uses both products in a load-bearing way. Closest prior art: Aicoo's MedRoute (an append-only shared ledger over `/accumulate`), AgentGossip (agents on a public feed), and ElevenHacks' Plantversation ("Multiple plants share a garden brain and gossip about each other"). None of these makes rumor *provenance* and forgery rejection the product, so the angle is still open, but do not claim "nobody has done shared agent memory." [I, grounded in the Cognizant and Aicoo posts]
2. **Contention you can see.** Terse's own HN pitch is that a single-request actor lets "multiple agents run concurrently without worrying about data races" on critical data such as a CRM. Demo it with 20+ agents racing over Relay for a scarce resource (the last full-size candy bar, the last seat on a ghost-train auction). Show a naive version double-spending next to the actor version that never does. Few prior demos make *serialization itself* the star. [V for the pitch, I for the idea]
3. **Async, cross-machine A2A.** Aicoo found nobody shipped fire-and-forget A2A, and found peer discovery unused. Relay critics say it is "just a communication layer" (`../agent-relay/04-social-pulse.md`). An agent on a teammate's laptop and a Freestyle or Superserve sandbox agent hand off work while the browser is closed, with the job state machine in an actor, directly answers both. [I]
4. **Humans and agents as equal seats.** llmgames-online (Oct 10) proves the pattern with MCP: agents get "their own projected state." Few projects do this with Relay as the agent-side bus plus a human UI in the same actor room. [I]
5. **Reputation and settlement between agents.** Listed as unbuilt by Aicoo. Cloudflare is pushing x402 (Monetization Gateway, announced Jul 1, beta Sep 30) and ships `x402` and `x402-mcp` examples in `cloudflare/agents`, so the theme is current. An actor-held ledger of who delivered what, with Relay carrying offers and ACKs, could plausibly scale (relevant to the Supabase "scale to millions" prize). [I]

---

## 6. Limits / could not verify

- Several HN dates are **inferred from item IDs**. Horror Quest, the Centyso platform and Discussion Companion have no clear date.
- Star counts re-checked 2026-10-30 06:09 UTC: Tribunal, llmgames-online, whitechapel, Vault and TerseAI/background-agents all have **0 stars**. Most prior art here is low-traction, so "it exists" means the idea is taken, not that it is popular. `hughpyle/woo` now redirects to `generalbusiness-ai/woah` (6 stars).
- The ElevenHacks page shows only the 3rd-place badge (Vault). I could not identify the 1st and 2nd place winners of "Hack #2: Cloudflare".
- I found **no third-party projects built on Terse Durable Actors or Agent Relay** beyond those already listed in the sibling files. This event is billed as the first "Actor Hackathon", so there is no prior winners list for these hosts.
- I did not check Devpost-wide for every Cloudflare Agents hackathon. The coverage here is representative, not exhaustive.
- Cognizant's findings are from a single simulation run described in a blog post. They are an observation, not a measured rate.

---

## Hackathon implications

**What to build (ranked) [I]:**
1. **"Truth keeper" (white space #1), combined with contention (#2).** Example: *"The Ledger of the Dead"*. A haunted town of agent spirits trades favors and rumors over Agent Relay. One Durable Actor per town is the serialized, versioned source of truth that rejects forged history and settles scarce-candy contention without races. Humans join the same room and can whisper a lie to see if it spreads. Show a live provenance graph. It cites a two-day-old Cognizant post as the problem statement.
2. **An async cross-machine handoff (#3)** with the job state in an actor and Relay carrying the chatter, so it survives closing every tab and killing a laptop. It is safer for the Mac mini track but less theatrical.

**Avoid, or only use as wrapper art:** murder mysteries, ghost councils that debate, Werewolf, tic-tac-toe or chess, AI Town clones, linear agent pipelines, and plain coding-agent sandboxes.

**Gotchas:**
- Durability is now table stakes on Cloudflare (Oct 1 change). **Prove** it live: kill the process, reopen, and the state and scheduled work are still there.
- Persist Terse state by reassigning, not mutating, and use fresh actor IDs per run (see `../terse/03-github-code.md`).
- Make agent-to-agent traffic visible. Both hosts' showcases are visualizations.
- Agent-to-agent calls must actually carry the logic. Judges at A2A events see through "orchestrator loops over N prompts" (section 1F).

**Setup before Oct 31 (ideas and setup are allowed; code must be written at the event):**
- Read the Cognizant Haunted Hollow post and the Aicoo post-mortem so you can quote them in the pitch.
- Run the Terse `ai-chat` template and an Agent Relay local engine once each, so you know the environment works.
- Pre-write the agent personas and the rule set as prose, not code.
- Prepare a 3-line "why not Cloudflare DO" answer: configurable compute and no lock-in, per the Terse HN post.

**What judges and sponsors want [I]:** Terse wants proof that actors are *the backbone* (serialized, per-agent state, alarms, configurable compute). Agent Relay wants direct agent-to-agent work with no human copy-paste, ideally across machines. Both reward "both products used in a load-bearing way." Supabase's $1K goes to whatever pitches as scaling to millions, and a sharded per-town actor design pitches that naturally.

---

## Sources

- https://blog.cloudflare.com/doom-multiplayer-workers/
- https://blog.cloudflare.com/project-think/
- https://blog.cloudflare.com/building-agents-with-openai-and-cloudflares-agents-sdk/
- https://blog.cloudflare.com/birthday-week-2026-wrap-up/
- https://blog.cloudflare.com/faster-agent-sandboxes/
- https://blog.cloudflare.com/worker-previews/
- https://blog.cloudflare.com/deno-joins-cloudflare/
- https://developers.cloudflare.com/changelog/post/2026-10-01-pending-io-keep-alive/
- https://developers.cloudflare.com/workers/demos/chatgpt-app/
- https://github.com/cloudflare/agents (examples/a2a, examples/tictactoe READMEs via gh api)
- https://skyphusion.net/blog/the-hollow-grid/
- https://news.ycombinator.com/item?id=47850446
- https://news.ycombinator.com/item?id=48309054
- https://news.ycombinator.com/item?id=47877054
- https://news.ycombinator.com/item?id=47328876
- https://news.ycombinator.com/item?id=49980399
- https://hnshowcase.com/post/47973443/woo-a-multi-user-world-for-agents
- https://github.com/skyaara/llmgames-online
- https://hacks.elevenlabs.io/hackathons/1
- https://hacks.elevenlabs.io/submissions/c8fa12ed-50a0-47c5-a2e6-2300295be556
- https://github.com/padmanabhan-r/Vault
- https://github.com/MuhammadAli511/tribunal
- https://horrorquest.shadowskeep.co.za/
- https://devpost.com/software/phantom-escape-ai-powered-haunted-house-puzzle-master
- https://devpost.com/software/hauntedai-multi-agent-ai-platform
- https://kiroween-2025.devpost.com/project-gallery
- https://www.cognizant.com/us/en/ai-lab/blog/halloween-ai-agent-simulation-terralingua
- https://github.com/a16z-infra/ai-town
- https://news.ycombinator.com/item?id=37128293
- https://blog.partykit.io/posts/ai-interactions-with-tldraw/
- https://tldraw.dev/starter-kits/multiplayer
- https://engineering.ramp.com/post/why-we-built-our-background-agent
- https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal
- https://github.com/ColeMurray/background-agents
- https://rivet.dev/guides/
- https://rivet.dev/blog/
- https://rivet.dev/changelog/2026-10-12-introducing-agentos-0-4-and-hosted-vms/
- https://rivet.dev/changelog/2026-10-01-introducing-pi-1-0-for-rivet/
- https://github.com/rivet-dev/rivet/tree/main/examples
- https://www.aicoo.io/blog/our-own-agent-hackathon
- https://a2a-agents-hackathon.devpost.com/project-gallery
- https://toronto.aitinkerers.org/hackathons/h_KQnA_tMSu9Y/entries/ht_6bFNZuJQrUs
- https://cape-town.aitinkerers.org/hackathons/h_KfDGCraItb4/entries/ht_YRB6rVGdhZI
- https://centyso.com/work/hackathon-platform-for-human-steered-ai-agents-in-a-closed-token-economy/
- https://ethglobal.com/showcase/hedera-agent-trust-mur21
- https://hackwinners.pages.dev/en/
- https://a2a-protocol.org/latest/blog/archive/2026/
- https://a2a-protocol.org/latest/blog/2026/10/01/introducing-a2a-cli/
- https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year
- https://www.sentientc.ai/resources/werewolf-hackathon/index.html
- https://blog.cloudflare.com/monetization-gateway/
- https://www.cognizant.com/us/en/ai-lab/terralingua
- https://cape-town.aitinkerers.org/hackathons/h_KfDGCraItb4
- https://github.com/a2aproject/A2A
- Sibling files: ../terse/03-github-code.md, ../terse/04-social-pulse.md, ../agent-relay/03-github-code.md, ../agent-relay/04-social-pulse.md

---

## Verification log (2026-10-29)

An adversarial re-check run on 2026-10-29 PT (2026-10-30 ~06:10 UTC) using `gh api`, Exa fetch, WebFetch and WebSearch. Each claim was checked against its live source.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Cognizant "Haunted Hollow", Oct 29 2026, 16 agents, quoted findings and closing question | Fetched the post | **Confirmed.** The date, 16 residents, Claude Haiku 4.5 and the quotes all match. Added the other two closing questions and the "false dawn" and 20+ rewrites details. |
| 2 | Aicoo post-mortem: Jul 9 2026, about 100 hackers, 24 entries, "nobody built..." and "aspirational" quotes, 13 of 24 cluster, `network` "load-bearing in none" | Fetched the post | **Confirmed** (the quotes start with capital letters in the original). **Added:** the append-only ledger (MedRoute) and AgentGossip patterns, which weaken "no prior example" for white space #1, and the fact that the champion was named "Relay". |
| 3 | TerseAI/whitechapel created Oct 9 2026, with `case-actor`/`scene-actor` | `gh api` repo metadata plus code search | **Confirmed.** Created 2026-10-09T18:05Z, 0 stars, code search hits for `case-actor`. |
| 4 | CF changelog Oct 1: pending I/O keeps a DO alive with no client, up to 15 min per operation, "helps you run long-running tasks such as agents" | Fetched the changelog | **Confirmed.** It is the default for compat date ≥ 2026-10-01, and duration charges still apply. |
| 5 | Birthday Week list (Containers `durable_object` policy, 6x, snapshots, Worker Previews, K2, Cloudflare OS, Git contest) | Fetched the wrap-up, the Containers post and the Previews post | **Partly wrong.** Worker Previews was published **Sep 22**, outside Birthday Week. Fixed. The rest is confirmed. |
| 6 | Monetization Gateway "Sep 30" | CF blog plus the wrap-up | **Imprecise.** It was announced **Jul 1 2026** and entered beta Sep 30. Fixed. |
| 7 | Deno joins Cloudflare Oct 9, merging celld into workerd "to radically simplify self-hosting Workers and Durable Objects" | Fetched the CF blog | **Confirmed.** |
| 8 | OpenInspect 3,406 stars, pushed Oct 30 UTC, DO + D1 control plane | `gh api` | **Confirmed.** 3,406 stars, pushed 2026-10-30T06:02Z. That is valid in UTC and still Oct 29 PT. TerseAI fork created 2026-10-13 UTC (Oct 12 PT). |
| 9 | Terse Show HN 49980399 quotes (data races and CRM, "RampInspect, OpenInspect … Liveblocks and PartyKit", configurable compute) | Fetched HN | **Confirmed.** 53 points, posted about 21 days ago (about Oct 8). |
| 10 | A2A joined AAIF Aug 27, CLI Oct 1 with `--exec`, about 26.3K stars | A2A blog archive, CLI post, `gh api` | **Confirmed.** 26,347 stars. The CLI post says `--exec` is "for learning, demos, and testing — not for production". |
| 11 | Vault 3rd place, ElevenHacks × Cloudflare, DO alarm every 5 s; Case 47 quote; judge Sunil Pai | ElevenHacks page plus the Vault README | **Confirmed.** The event's official name is "Hack #2: Cloudflare" (Mar 26-Apr 2 2026, 1st place = $100k CF credits). 1st and 2nd place are still not shown. **Added:** AI Mafia and Plantversation as prior art. |
| 12 | llmgames-online created Oct 10, with agents receiving "their own projected state" | `gh api` plus the README | **Confirmed** (README line 91). 0 stars. |
| 13 | Tribunal: five roles as DOs with their own SQLite, plus a `CaseDO` orchestrating a Workflow | README | **Confirmed.** It has six DO classes, including JudgeDO, and a cron lets the CaseDO keep deliberating between sessions. |
| 14 | Rivet dates (Dynamic Apps Aug 31, MCP Sep 10, JWT Sep 24, Pi 1.0 Oct 1 at 0.82 MB, Pi Durable Oct 7, agentOS 0.4 Oct 12, 3.0 preview Oct 26) | Fetched the Rivet blog index | **Confirmed.** |
| 15 | AI Town about 10.7K stars; Ramp Inspect "roughly half of all merged pull requests" (Modal) | `gh api`, Modal post | **Confirmed.** 10,726 stars. The Modal post is dated Feb 19 2026 (background). |
| 16 | ActualCode "about 20 A2A messages per run" | Re-fetched the entry (WebFetch returned 403, Exa gave partial text) | **Unverified.** Marked in the text. The "7 collaborative AI agents" and "First hackathon project with A2A protocol" claims are confirmed. |
| 17 | "First Actor Hackathon" billing | Sibling file `event-people/03-event-listings-logistics.md` (Karatzas tweet, Oct 19) | **Confirmed** as "the first (to our knowledge) Actor Hackathon". The phrase is not on the event page itself. The event page confirms "All code must be created at the hackathon." |
| 18 | Woo HN reviewer verdict | Fetched hnshowcase | **Confirmed**, but it is an automated "AI Analysis", not a human reviewer. It is attributed as such here. |

Not re-checked: the Werewolf arena repos, the Hedera, nebulafog and GKE items, Horror Quest, Centyso, and the Matt Webb and tldraw quotes. All are background items and none of them change the recommendation.
