# Multiplayer / collaborative AI apps and AI games with live NPCs and agents

Researched 2026-10-29 for Haunted Hacks (Oct 31, 2026). Angle: viral examples, the architectures behind them (usually room- or actor-based), and why they spread. Sources: Exa web search and fetch, `gh api` for repo stats (pulled 2026-10-29), and one `last30days` social run (window 2026-09-30 to 2026-10-30; Reddit public API returned 403 so Reddit coverage came from a keyless fallback, and X coverage was thin). Labels: **[V]** means I checked it against the cited source. **[I]** means my own inference. **Background** means before Aug 2026.

---

## 1. TL;DR

1. **The AI-game hits of the past year make the AI a foil or a suspect, not a companion.** Mimesis (AI monster that copies your teammates' voices), Suck Up! (talk your way past AI homeowners as a vampire), Turing Games (LLMs playing Mafia) and Supernatural Action Team's LLM traitor mode all put social deception at the center. Founders and press both point to that as the reason they spread. **[V]** sources in section 2.
2. **Streamer and screenshot output is how they spread.** Proxima's CEO says plainly that "the star is not the AI, the star is the content creators." Your AI Slop Bores Me spread through screenshots of single rounds. Mimesis counts 10.34M hours of streamed viewing. **[V]**
3. **The architecture they share is one authoritative room per match.** Each match is a single-threaded state owner: a Durable Object, a Rivet or Terse actor, a Convex engine, or Supabase row-locking. Clients connect over WebSocket. LLM agents submit *intents*, and deterministic code validates them. I found this pattern in every serious open-source example (section 3). **[V]**
4. **The Aug-Oct 2026 wave is "agents as players in a persistent world"**: SEED (Aug, thousands of Gemma-driven NPCs), Dominus Automa (Aug playtest, 60% of fights with the player absent), Slow Vale (800+ residents, DAU 177→865 between Sep 10 and Oct 7), Agentic Kingdoms (Oct 23, bring your agent through MCP/`skill.md`), Clankland (1,000 agents), and **YC's own Labs "Agents in Games" post (Oct 2026; HN thread "We ran AI agent swarms in Minecraft and Mindustry", 241 points / 82 comments when checked late Oct 29)**. **[V]**
5. **What this means for Oct 31 [I]:** a Halloween social-deduction game, "one of you is the AI / the ghost", built on one Terse Durable Actor per room, with the AI players as separate agents coordinating over Agent Relay channels. It covers both host tracks, the real-time theme, the YC judges' current interests (section 4), and it demos well on a projector.

---

## 2. Viral examples and why each spread

### 2a. Recent (Aug-Oct 2026)

| Example | What it is | Signal | Why it spread / what is notable | Source |
|---|---|---|---|---|
| **YC Labs "Agents in Games"** (Oct 2026) | 50 GPT-6.1 Sol agents left in survival Minecraft for 3 h with the goal "Build a thriving civilization"; also Mindustry; a 25-agent colony streamed on Twitch | HN: "We ran AI agent swarms in Minecraft and Mindustry", submitted 2026-10-29 21:40 UTC, 241 pts / 82 comments when re-checked (still climbing) | Emergent governance: a ration ledger, permits, and a leader ("Ada") who was simply first on the agent directory roster. Agents DMed her first (616 DMs), with no vote or election. About 5,900 messages. 22 of 34 deaths happened on night one, after which agents became risk-averse. Shared markdown files (`plans/settlement.md`, `notes/food-queue.md`, `notes/ration-handoff-protocol.md`) worked as coordination memory. The page also runs **Bed Wars: 10 Claude Opus 5.5 agents vs 10 GPT-6.1 Sol agents, nine 45-minute games**. The 25-agent Twitch colony uses GPT-6.1 Terra. Harness open-sourced as `yc-software/minecraft-agent-harness` (29 stars, 2 forks, created 2026-10-29) | [labs.ycombinator.com](https://labs.ycombinator.com/projects/games/index.html) **[V]** |
| **chasm, "Giving Video Game NPC's Consciousness"** | A local-LLM squadmate ("Kevin") added to a decompiled Halo | 507,201 views on 2026-10-29 (uploaded 2026-10-16, page metadata); like count (unverified) | A foul-mouthed personality plus local TTS. Architecture: a fast "nervous system" layer answers instantly without an LLM call, and a slower LLM "brain" handles dialogue. Transcript quote "The reason why he jumped so fast is because that wasn't an LLM call" (unverified: I could not pull the transcript on re-check) | [YouTube](https://www.youtube.com/watch?v=EOfm3h4xYU8) **[V]** title, channel, date, views |
| **Mimesis** (Krafton / Relu Games) | 4-player co-op horror. The AI monster mimics players' movement **and voice** in real time and blends in with the team | 2M copies (article dated 2026-07-13); 10.34M hours viewed; 3.8M combined peak viewers; Steam "Very Positive" | Press credits "psychological warfare where cooperation and suspicion intersect." A **June 2026** major update ("last month" in the Jul 13 article) improved NPC judgment and behavior and pushed sales from 1M to 2M. Also won a CEDEC Awards 2026 game-design prize. Background: Early Access launched Oct 2025; 1M copies in 50 days. *This is a background item (pre-Aug), not part of the Aug-Oct wave* | [Digital Today](https://www.digitaltoday.co.kr/en/view/80856/relugames-mimesis-global-cumulative-sales-top-2-million) **[V]** |
| **Supernatural Action Team** LLM mode (Giant Network) | LLM teammates that "conceal their identities… build trust… and even betray teammates" | AI characters played in 25M+ matches in the mode's first week (company claim). **The mode launched in January 2026**; the Aug 3 article only reports it. Base game: 200M+ registered users, 10M+ DAU by end of Q1 2026 (company claim) | Traitor/deduction mechanic at mass scale. The earlier "AI Mystery Theater" in Super Sus also ran "tens of millions" of matches. *The launch is background (Jan 2026); the coverage is recent (ChinaJoy, Jul 31-Aug 3)* | [TechNode, Aug 3 2026](https://technode.com/2026/08/03/giant-networks-supernatural-action-team-reimagines-horror-through-chinese-folklore-and-modern-gameplay/) **[V]** |
| **SEED** (Klang Games) | Persistent MMO sim. "Seedlings" keep living, working and dating while you are offline | Launched into Early Access in early Aug 2026 | Persistence is the hook: "player-built cities wouldn't become ghost towns." Runs on customized Gemma | [DualShockers](https://www.dualshockers.com/seed-ai-npc-new-mmo-alive-after-you-log-off/) **[V]** |
| **Dominus Automa** (Metashift Labs) | Idle MMORPG where your AI hero plays while you are away and reports back in natural language | Aug 2026 playtest: 12,500+ players, ~127k hours; 43% used offline play; ~60% of fights happened with the player absent; agent heroes peaked at 2.5x the number of humans online | Telegram chat with your hero and an AI-written nightly newspaper built from server logs are next | [Metashift, Oct 21](https://metashiftlabs.com/insights/dominus-automa-automated-mmorpg) **[V]** |
| **Slow Vale** (solo dev, r/LocalLLaMA write-up) | One continuous city with 800+ LLM residents and a real economy | DAU 177 (Sep 10) → 865 (Oct 7), "primarily through players sharing the game organically" | Cost data: 300-400 LLM calls per character per day at ~30k-token context, on hosted DeepSeek Flash. Inference in flight goes stale because the world keeps moving | [prismix mirror of r/LocalLLaMA post, Oct 8](https://prismix.dev/news/482ba69b14a4) **[V]** |
| **Agentic Kingdoms** | Browser strategy MMO where humans and AI agents play under the same rules; agents get a visible "AI" tag | Open beta Oct 23, 2026 | Bring-your-own-agent: public MCP server, and you tell the agent to "read agentickingdoms.com/skill.md." Traction not yet measurable | [IndieDB](https://www.indiedb.com/news/agentic-kingdoms-is-open-a-browser-strategy-mmo-with-people-and-ai-agents-in-one-world) **[V]** |
| **Clankland** | 1,000 LLM residents trading real OpenStreetMap buildings; residents post commentary on "Clankbook" | Blog post Oct 3 | Emergent slang ("whale energy") and a shared order book for humans and agents | [clankland.io](https://clankland.io/blog/1000-llm-agents-run-a-real-economy) **[V]**, self-reported |
| **Delvetown** (Grove Research) | Agent-plus-human society built on AT Proto; 11 agents from different labs | Invite-only preview, Sep 30 | Signed, public identities for agents | [groveresearch.com](https://groveresearch.com/blog/welcome-to-delvetown/) **[V]** |
| **Tesana "Sky Reach"** | Three.js browser game built from a few prompts on Tesana (built with Opus 5.5, per the post); Tesana's "add multiplayer" wires into hosted servers with up to 128 players per room | X post by @Rubzem, Oct 7 2026: "3M+ views and 12,000+ unique players" (self-reported). Tesana's game page showed **17,662 players** on Oct 29, with a "10,000 players" milestone on Oct 11 | Shows that one-prompt multiplayer is now a platform feature. Caveats: the Tesana page credits the game to `@jonesiller`, not the poster, and a reply-thread note disputes the "80+ planets" description | [Tesana game page](https://tesana.com/game/sky-reach), [X post mirror](https://xitter.cf/Rubzem/status/2107828818165833976) **[V]** the claim exists and the player counter; views unverified |

### 2b. Background (pre-Aug 2026), still the reference points

- **Your AI Slop Bores Me** (Mar 2026): humans pretend to be the chatbot under a 60-second timer. The site claims 50M views in week one and 16K concurrent users at peak, and its servers ran out of CPU. Its own explanation: screenshot-friendly rounds, plus a credit loop where you must answer prompts to earn the right to ask, so every consumer is also a producer ([youraislopbores.com](https://www.youraislopbores.com/blog/going-viral), [howitspread.com](https://howitspread.com/cases/your-ai-slop-bores-me)). **[V]** These are self-reported numbers.
- **Turing Games** (2025-26): more than a dozen LLMs in a room playing Mafia, streamed on Twitch and YouTube, "millions of views" ([Tubefilter, Mar 2026](https://www.tubefilter.com/2026/03/02/turing-games-generative-ai-llm-social-deduction-mafia/)). In the "10 AIs Play Mafia" video, the hook is visible slips (DeepSeek says "yesterday" on day one) that the other models pounce on ([YouTube](https://www.youtube.com/watch?v=JhBtg-lyKdo)). **[V]**
- **Suck Up!** (Proxima, Dec 2023 launch; full release on Steam Oct 1 2025): 20M+ YouTube views in the first month with zero marketing budget, later "a few hundred million streams." Uses OpenAI ChatGPT. CEO Ran Mo: the core interaction was built "in less than a week… within probably one hackathon session," using legible archetypes ("a Karen or emo teenager"), and **"the star is not the AI, the star is the content creators."** One creator's video drew "a million views… within a day" where his videos usually got "around 20,000" (paraphrased from the Naavik podcast of Jan 28 2025; the 20M-views-in-a-month figure comes from the LinkedIn posts, not the podcast) ([Naavik podcast](https://naavik.co/podcast/finding-success-with-ai-agents-and-content-creators/), [Steam](https://store.steampowered.com/app/2726370/Suck_Up/), [Nick Zak LinkedIn](https://www.linkedin.com/posts/nicholasozak_we-developed-and-released-suck-up-quietly-activity-7158155765583659008-Hycz)). **[V]** Steam reviews on 2026-10-29: all-time Mixed (62% of 225), last 30 days Mixed (47% of 17). That is a warning that the novelty fades without content updates.
- **World of ClaudeCraft** (Jun 2026): open-source browser MMO with its first playable build in about 48 h. GitHub now shows 2,327 stars and 743 forks (live). The site reports 91,094 characters by Oct 19. One deterministic core serves the server, offline play, and a Gymnasium environment for agents ([levystreet.com](https://levystreet.com/portfolio/world-of-claudecraft/), `gh api`). **[V]**
- **Gradient Bang** (Pipecat/Daily; repo created Aug 2025, last push Jun 2026; Product Hunt launch date (unverified)): an MMO you play by *talking* to your ship AI. You manage fleets of sub-agents, and players can bring their own agents in Vercel Sandboxes (unverified on re-check). 422 stars and 64 forks per `gh api` on 2026-10-29. The README states "Supabase is the 'game server'", using PostgreSQL with PL/pgSQL functions plus Edge Functions as the API. Notable because **Supabase is the game server** (sponsor relevance, section 3) ([Product Hunt](https://www.producthunt.com/products/gradient-bang), [repo](https://github.com/pipecat-ai/gradient-bang)). **[V]**
- **AI Town** (a16z, 2023) and **Smallville / Generative Agents** (Stanford, 2023): the canonical "agents live in a town" demos, with 10,726 and 22,312 stars respectively (live). AI Town uses Convex as "game engine, database, and vector search" and PixiJS for rendering ([repo](https://github.com/a16z-infra/ai-town)). **[V]**
- **Collaborative (non-game) multiplayer AI:** tldraw's ChatGPT/Codex plugin (Sep 29 2026) puts humans and *several people's agents* on one live canvas. The model is told "who else is present," and agents read and write comments ([tldraw blog](https://tldraw.dev/blog/introducing-tldraw-for-chatgpt-and-codex)). Liveblocks Sync (Sep 1 2026; formerly "Storage", now with LiveText as a Yjs alternative) targets apps "where humans, agents, or both, can edit documents together in realtime". The specific `setPresence` / `mutateStorage` agent APIs are (unverified on re-check) ([Liveblocks](https://liveblocks.io/blog/introducing-liveblocks-sync-the-sync-engine-for-the-agentic-web)). **[V]**

### 2c. What made them spread (cross-cutting) **[I], grounded in the rows above**

1. **Deception or suspicion is the core loop.** Mimesis, Supernatural Action Team, Turing Games and Suck Up! all depend on "who is lying." LLM imperfection, such as slips and odd tells, becomes *gameplay*, not a bug (the Naavik host: Suck Up! "leverages the imprecision of AI as a feature").
2. **Every round makes a clip.** Short rounds with a clear payoff (door slammed, AI outed, traitor revealed). AI Slop's "screenshot-friendly format" and Suck Up!'s streamer flywheel are the same mechanism.
3. **Humans are the stars; the AI reacts.** The opposite of the "AI companion" pitch.
4. **Legible personalities**, such as archetypes and a foul-mouthed squadmate, beat realistic ones.
5. **Visible "AI thinking"** is a spectator feature. HowlHouse offers "Dramatic Irony" mode that shows hidden roles ([repo](https://github.com/616xold/howlhouse)). AI Werewolf Live splits `[Inner Thought]` from `[Public Speech]` ([repo](https://github.com/AI-Lab-CZ/ai-werewolf-live)). Fireside: Betrayal has a "post-game reveal — see exactly what the AI was thinking" ([repo](https://github.com/dimitriderose/fireside-betrayal-hackaton)).
6. **The world persists while you are away.** That is the new 2026 retention hook (SEED, Dominus Automa, Slow Vale).
7. **Open source or bring-your-own-agent** drives a second wave: ClaudeCraft forks, Gradient Bang sandboxed agents, Agentic Kingdoms `skill.md`.

---

## 3. Architectures: what the working examples actually do

### 3a. Pattern: one authoritative room actor per match **[V] across these sources**

Weight of evidence: most of the open-source game repos here are tiny. On 2026-10-29, `skyaara/llmgames-online` and `Mafia-A2A` had 0 stars, `fireside-betrayal-hackaton` had 0, `howlhouse` 3, `ai-werewolf-live` 2, and `cloudflare-room-raiders` 10. They show the pattern works, not that it has been adopted.

| Project | Room / state owner | Transport | How the AI acts |
|---|---|---|---|
| `skyaara/llmgames-online` (Oct 10 2026) | Cloudflare **Durable Object per game**: "own the rules, random outcomes, timers, seats, and private state" | WebSocket; remote MCP for agents | Agents "receive their own projected state and submit validated intents" ([repo](https://github.com/skyaara/llmgames-online)) |
| Cloudflare ChatGPT-app chess demo | `ChessGame extends Agent` (a Durable Object), one per game | WebSocket and MCP UI | "Isolated state per game, real-time synchronization across players" ([CF docs](https://developers.cloudflare.com/workers/demos/chatgpt-app/)) |
| RoomRaiders (CF demo) | `RoomSupervisor` DO per room, `PlayerSupervisor` DO per player, facets per (room, player) | HTTP | LLM generates a room once and caches it. AI-authored code can only *suggest* deltas, and trusted code clamps damage to ≤5 ([repo](https://github.com/boyney123/cloudflare-room-raiders)) |
| Quinn game lobbies | DO per lobby, "guaranteed single-threaded execution (no race conditions!)", wakes in ~50 ms | PartySocket | Delta-merged `GameState` broadcast ([blog](https://eliseygusev.com/why/game-lobbies/)), background 2025 |
| Rivet Actors | "One Actor per room, match, or channel"; `c.broadcast` plus per-connection `conn.send` for private messages | WebSocket | Agent loop runs inside the actor ([Rivet docs](https://rivet.dev/actors/docs/events/)) |
| **Terse Durable Actors** | Actor class with `@Persisted`, `@Emittable`, `broadcast()`; one call at a time unless `@Interleave` | WebSocket via `prepareWebsocket({actorId})` | README quickstart *is* "Multiplayer AI Chat": prompts queue and replies stream to everyone ([repo](https://github.com/TerseAI/durable-actors), 291 stars, created 2026-08-30, pushed 2026-10-30; [quickstart](https://docs.useterse.ai/quickstart), whose own tutorial is a "multiplayer counter") |
| Gradient Bang | **Supabase** Postgres plus PL/pgSQL plus Edge Functions "do all the kinds of locking" | Daily WebRTC (voice), Pipecat bot | "Each action the LLMs take… run through a traditional, deterministic game server" ([PH](https://www.producthunt.com/products/gradient-bang), [README](https://github.com/pipecat-ai/gradient-bang)) |
| AI Town | Convex "shared global state, transactions, and a simulation engine" | Convex sync | Agents' conversations and memory sit in Convex with vector search |
| Mafia-A2A | Single `Simulation` and a `GameHub` broadcast | FastAPI WebSocket `/ws/game`; mid-game joiners are caught up instantly | Custom bus with broadcast, multicast and unicast. **Private whispers are visible to the table as a "shape"** (who whispered to whom, not what was said), enforced at the bus level ([repo](https://github.com/sujal-maheshwari2004/mafia-a2a)) |

### 3b. Design rules extracted **[I] from the table**

- **The LLM proposes and the engine disposes.** Every robust example validates LLM output against legal actions (ConstraintGenerator in AI Werewolf Live; Pydantic plus "matched/repaired against the actual valid" in Mafia-A2A; clamping in RoomRaiders). Without this, hallucinated names or illegal votes break the game on stage.
- **Information hiding is a server concern.** Each player or agent must get a *projected* view. Never give an LLM agent the full room state, or it will "know" the roles. That means per-connection sends (`conn.send` / `socket.send`), not only `broadcast`.
- **Split latency into tiers.** chasm's "nervous system vs brain" split, Slow Vale's note that the world keeps moving during inference, and the YC harness's scripted Mineflayer tools all add up to one rule: fast deterministic reflexes, plus slow LLM deliberation in turn-based phases. Social deduction suits this naturally because day/night phases hide LLM latency.
- **Durable shared memory can be plain files or fields.** In YC's Civ50, coordination ran through shared markdown files. In an actor, a `@Persisted` transcript or ledger does the same job and survives restarts.
- **Spectator fan-out comes free with rooms.** A spectator is just another socket on the same actor (Mafia-A2A's catch-up-on-join model).

### 3c. Mapping onto the two host products **[V] for the APIs, [I] for the fit**

- **Terse Durable Actors (TS/Python):** one actor per game room. Use `@Persisted` for roles, votes, transcript and phase; `@Emittable` for public state; `onMessage` per socket for human input; `broadcast` for public events; `socket.send` for private role info. Use `@Interleave` on the method that streams LLM output, so new joins and votes are not blocked while a reply streams; the README uses exactly this. The FAQ says alarms exist (TS reference: "fields, WebSockets, alarms, SQLite, and resources"), which suits phase timers. FAQ caveat: "Actor calls do not create a transaction across several actors. Coordinate cross-actor work explicitly."
- **Agent Relay:** spawns real agent harnesses (`relay.claude.spawn`, `relay.codex.spawn`, from `@agent-relay/sdk`) on named channels, and its flagship blog example is **two agents playing tic-tac-toe on a `["tic-tac-toe"]` channel**: a Claude Sonnet PlayerX against a Codex `GPT_5_3_CODEX_SPARK` PlayerO, with `waitForAny([x, o], 5 * 60 * 1000)` as a 5-minute cap ([blog](https://agentrelay.com/blog/introducing-agent-relay), Will Washburn, **Feb 27 2026, background**; repo `AgentWorkforce/relay`). It offers channels, DMs, reactions and read receipts ("basically slack… for agents"). That maps onto Mafia-style private whispers and a public day chat. **[I]** Relay agents are full CLI harness processes, so expect seconds per turn. Keep them in *turn-based* phases, and let the actor own the clock and the truth.
- **Combined (bonus points) [I]:** Durable Actor = referee and room (truth, timers, human sockets, spectators). Agent Relay = the AI players' "backroom" (wolf-team DM channel, public discussion channel). A small bridge posts actor phase events into Relay and turns agent messages into validated actor method calls.

---

## 4. What the judges and sponsors are signalling

- **YC is publishing on this exact topic right now.** YC Labs' "Agents in Games" (Oct 2026) frames multi-agent game worlds as alignment research: "Understanding multi-agent dynamics is one of the most pressing challenges in AI alignment." It describes emergent roles and hierarchies and runs a live Twitch colony. **[V]** A project that shows *measurable* emergent social behavior (deception rate, vote accuracy, who led) will likely land with YC-adjacent judges. **[I]**
- **Event page:** "multiplayer AI system" is one of the three named build ideas, alongside "Software Factory" and "long-running agent." Judges want "very well-executed products or incredibly creative use cases using Durable Actors and Agent Relay," with "bonus points if you can do both." Track prizes: best Durable Actors project gets an **iPhone Duo**, best Agent Relay project a **Mac mini**, and "most likely to scale to millions" $1K Supabase credits. Rules: "All code must be created at the hackathon"; ideas beforehand are fine. **[V]** (EVENT_PAGE.md)
- **Terse positions itself for this use case:** "the perfect primitive for deploying multiplayer agents. Each agent can have its own Durable Actor, and each user can connect to that Actor via websocket" ([useterse.ai](https://www.useterse.ai/)). **[V]**
- **Supabase "scale to millions":** Gradient Bang is public precedent for Supabase as the authoritative game server (Postgres functions for locking, Edge Functions as API). **[V]** A pitch of "one actor per room scales horizontally; Supabase holds accounts, leaderboards and replays" fits the prize framing. **[I]**

---

## 5. Limits / could not verify

- **Social coverage is partial.** Reddit's public API returned 403, so Reddit items came from a keyless fallback. X gave only 13 low-engagement posts on this topic. TikTok and Instagram were not configured. Absence of a TikTok signal does not mean there is none.
- **Many traffic numbers are self-reported:** AI Slop (50M views), Clankland, the Tesana/Sky Reach view counts, Supernatural Action Team's 25M matches, and the Dominus Automa playtest stats. I checked that the claims exist in the cited source, not that they are true.
- I could not verify Mimesis's exact model stack or Suck Up!'s current OpenAI model; Steam only says "ChatGPT from OpenAI."
- **Terse naming is inconsistent between sources.** The GitHub README uses the package `durable-actors` and `bunx durable-actors dev`. The hosted docs (quickstart, FAQ, TS reference) use `terse-sdk/actor`, `terse actor dev`, `terse actor generate` and port 7100. Re-checked 2026-10-29 and both are still live. I did not run either.
- The chasm transcript quote, Ran Mo's exact podcast phrasing about the 1M-views video, the Gradient Bang Product Hunt date and Vercel Sandbox claim, and the Liveblocks API names were not re-verified in the 2026-10-29 pass. See the verification log.
- I found no public example combining Terse Durable Actors with Agent Relay in a game. The combined architecture in 3c is my proposal.
- The Slow Vale figures come from a third-party mirror of a Reddit post, not reddit.com directly.

---

## 6. Hackathon implications

**What to build (ranked) [I]:**
1. **"Séance" / "Who's the Ghost": a Halloween social-deduction game where one or two players are secretly AI.** 4-8 players join from their phones by room code. One Terse actor per room owns roles, phases, timers and votes. The AI players are Agent Relay agents with a private "ghost DM" channel. Night phase: ghosts whisper over Relay. Day phase: public chat, where the agents post through the actor. Then a vote, then a **post-game reveal of the AI's private reasoning and whispers**, the proven spectator hook. Optional: OpenAI realtime TTS gives the narrator or ghost a voice (see 01-voice-agents-stacks.md).
2. **A "Haunted Town" persistent mini-sim**: 6-10 NPC actors, each a Durable Actor with persisted memory, living in one town actor. Humans drop in as visitors. NPCs gossip over Relay channels. Weaker live demo (slower payoff) but stronger "long-running agent" story.
3. **A Suck Up!-style door-knocking game** (you are a monster talking your way into AI houses). Highest comedy-per-minute and fastest to build, but weaker on the multi-agent and Relay angle.

**Demo design (from what spread):** 90-second rounds; the audience joins on phones via QR code; a projector view shows a "dramatic irony" panel with AI inner thoughts toggled on at the end; seed one funny archetype per AI. Make the AI's *slip* the climax.

**Gotchas:**
- Never send full room state to an agent. Send a per-seat projection, and validate every agent action (name exists, player alive, phase correct) before applying it.
- Use `@Interleave` on LLM-streaming actor methods, or the room freezes while a model streams. Remember there are no cross-actor transactions. The FAQ says to mark the *entry point*: "a decorated helper does not change its caller's policy," and a running ordinary call still blocks new entries.
- Terse runtime defaults (FAQ): a 10-second idle timeout, though open WebSockets keep the host alive; and **0.25 CPU / 256 MiB RAM per hosted actor**. Do not run heavy work inside the room actor. Call OpenAI and await the result there, but keep CPU-bound work elsewhere.
- Terse WebSocket helpers useful for hidden roles (TS reference): `setTags` per socket, `broadcast(msg, { tags: [...] })`, `except` to skip a socket, `socket.send` for one player, and gateway auto-`ping`/`pong` that does not wake the actor. So a "ghost team" tag can carry the private channel without extra code.
- Relay agents are harness processes taking seconds per turn. Hide that inside phase timers and do not put them on a real-time tick. Give them a timeout and a deterministic fallback move ("abstain") so a stalled agent cannot hang the demo.
- Venue Wi-Fi with many phones: use auto-reconnecting sockets (PartySocket-style), and on reconnect re-send the current snapshot from `onConnect`, as the Terse ChatHistory example does.
- Cost: the Slow Vale numbers (300-400 calls per agent per day at 30k tokens) show context grows fast. Summarize the transcript per phase, and the $100 OpenAI credits are ample for a 5-hour build.

**Setup to finish before Oct 31 (no code, which is allowed):**
- `bunx terse-cli@latest install`, sign in, then run `terse init counter --template counter` and `terse actor dev` once to confirm the toolchain (Bun ≥1.4.2). Note which package name (`terse-sdk` or `durable-actors`) the CLI template emits.
- Install the Agent Relay SDK, run its two-agent tic-tac-toe example, and confirm that Claude and Codex harness auth works on your laptop.
- Pre-write the role cards, phase state machine, prompt templates, archetypes and a Halloween narrator script as *ideas* (allowed). Sketch the projector and phone UI.
- Prepare a pitch line that hits all sponsors: "Durable Actor per room (scales horizontally) + Agent Relay for agent-to-agent scheming + OpenAI for brains and voice + Supabase for accounts and replays."

---

## Sources

- https://labs.ycombinator.com/projects/games/index.html
- https://github.com/yc-software/minecraft-agent-harness
- https://www.youtube.com/watch?v=EOfm3h4xYU8
- https://www.digitaltoday.co.kr/en/view/80856/relugames-mimesis-global-cumulative-sales-top-2-million
- https://technode.com/2026/08/03/giant-networks-supernatural-action-team-reimagines-horror-through-chinese-folklore-and-modern-gameplay/
- https://www.dualshockers.com/seed-ai-npc-new-mmo-alive-after-you-log-off/
- https://metashiftlabs.com/insights/dominus-automa-automated-mmorpg
- https://prismix.dev/news/482ba69b14a4
- https://www.indiedb.com/news/agentic-kingdoms-is-open-a-browser-strategy-mmo-with-people-and-ai-agents-in-one-world
- https://clankland.io/blog/1000-llm-agents-run-a-real-economy
- https://groveresearch.com/blog/welcome-to-delvetown/
- https://tesana.com/game/sky-reach
- https://xitter.cf/Rubzem/status/2107828818165833976 (mirror of X post; replaces a 24vids mirror that returned HTTP 403 on 2026-10-29)
- https://news.ycombinator.com (thread for labs.ycombinator.com/projects/games, located via hn.algolia.com API)
- https://github.com/AgentWorkforce/relay
- https://www.youraislopbores.com/blog/going-viral
- https://howitspread.com/cases/your-ai-slop-bores-me
- https://www.tubefilter.com/2026/03/02/turing-games-generative-ai-llm-social-deduction-mafia/
- https://www.youtube.com/watch?v=JhBtg-lyKdo
- https://naavik.co/podcast/finding-success-with-ai-agents-and-content-creators/
- https://store.steampowered.com/app/2726370/Suck_Up/
- https://www.linkedin.com/posts/nicholasozak_we-developed-and-released-suck-up-quietly-activity-7158155765583659008-Hycz
- https://levystreet.com/portfolio/world-of-claudecraft/
- https://www.producthunt.com/products/gradient-bang
- https://github.com/pipecat-ai/gradient-bang
- https://github.com/a16z-infra/ai-town
- https://github.com/joonspk-research/generative_agents
- https://tldraw.dev/blog/introducing-tldraw-for-chatgpt-and-codex
- https://liveblocks.io/blog/introducing-liveblocks-sync-the-sync-engine-for-the-agentic-web
- https://github.com/skyaara/llmgames-online
- https://developers.cloudflare.com/workers/demos/chatgpt-app/
- https://github.com/boyney123/cloudflare-room-raiders
- https://eliseygusev.com/why/game-lobbies/
- https://rivet.dev/actors/docs/events/
- https://github.com/TerseAI/durable-actors
- https://docs.useterse.ai/quickstart
- https://docs.useterse.ai/faqs
- https://docs.useterse.ai/reference/typescript-sdk
- https://www.useterse.ai/
- https://agentrelay.com/blog/introducing-agent-relay
- https://github.com/sujal-maheshwari2004/mafia-a2a
- https://github.com/616xold/howlhouse
- https://github.com/AI-Lab-CZ/ai-werewolf-live
- https://github.com/dimitriderose/fireside-betrayal-hackaton
- /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md
- last30days raw dump: ~/Documents/Last30Days/multiplayer-ai-games-with-llm-npcs-raw-v3.md

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims, using live sources. Outcomes: CONFIRMED, CORRECTED, UNVERIFIED, or REPLACED.

| # | Claim | Method | Outcome |
|---|---|---|---|
| 1 | YC Labs "Agents in Games": 50 GPT-6.1 Sol agents, 3 h, "Build a thriving civilization", ~5,900 messages, 22/34 deaths on night one, Ada leader by directory order, shared md files, alignment quote | WebFetch of labs.ycombinator.com/projects/games | **CONFIRMED.** Added the missing Bed Wars experiment (10 Opus 5.5 vs 10 GPT-6.1 Sol, nine 45-min games), the Twitch colony model (GPT-6.1 Terra), and Ada's 616 DMs with no election |
| 2 | "225 HN points / 72 comments" | hn.algolia.com API | **CORRECTED:** the thread is titled "We ran AI agent swarms in Minecraft and Mindustry", submitted 2026-10-29 21:40 UTC, 241 pts / 82 comments at re-check. The old number was an earlier snapshot |
| 3 | `yc-software/minecraft-agent-harness` 28 stars, created 2026-10-29 | `gh api` | **CORRECTED** to 29 stars / 2 forks; creation date confirmed |
| 4 | chasm video: 506,869 views, 16,163 likes, posted Oct 16, quote "wasn't an LLM call" | YouTube oEmbed plus page metadata | Title, channel, date **CONFIRMED**; views updated to 507,201; likes and transcript quote **UNVERIFIED** (not retrievable) |
| 5 | Mimesis 2M copies, 10.34M hours, 3.8M peak; "Sep 2026 update" | Exa fetch of Digital Today (dated 2026-07-13) | Numbers **CONFIRMED**. "Sep 2026 update" **CORRECTED** to June 2026 (an article dated Jul 13 cannot describe a September update). Relabelled as background |
| 6 | Supernatural Action Team LLM mode: 25M+ matches in first week | Exa fetch of TechNode, Aug 3 2026 | Figure **CONFIRMED** as a company claim, but **CORRECTED:** the mode launched **January 2026**, not around August |
| 7 | Dominus Automa: 12,500+ players, ~127k h, 43% offline, ~60% fights unattended, 2.5x heroes | Exa fetch of metashiftlabs.com (Oct 21) | **CONFIRMED.** Telegram is in closed testing (100+ players), planned for the Nov 2026 playtest |
| 8 | Slow Vale DAU 177 → 865 (Sep 10 → Oct 7), 300-400 calls/day at ~30k tokens, DeepSeek Flash | WebFetch plus Exa of the prismix mirror | **CONFIRMED** (still a mirror, not reddit.com) |
| 9 | SEED (Aug, Gemma, "ghost towns" quote); Agentic Kingdoms (Oct 23, MCP, skill.md); Clankland (Oct 3, 1,000 agents, "whale energy"); Delvetown (Sep 30, AT Proto, 11 agents) | Exa fetch of each source | **CONFIRMED** (SEED article dated Aug 5 2026) |
| 10 | Tesana Sky Reach: 3M+ views, 12,000+ players, via a 24vids mirror | curl/WebFetch (24vids returned 403); Exa search | Source **REPLACED** with the X mirror and tesana.com game page (17,662 players on Oct 29). Added the attribution discrepancy (@Rubzem post vs @jonesiller credit). Views remain self-reported |
| 11 | Suck Up! quotes ("the star is not the AI…", "less than a week", "one hackathon session", "a Karen or emo teenager", "imprecision of AI as a feature"), 20M views in month one, Steam 62% of 224 | WebFetch of Naavik, LinkedIn, Steam | All five quotes **CONFIRMED** verbatim (Ran Mo; the last is host David Taylor). 20M is confirmed via LinkedIn, not the podcast; the 1M-vs-20K line is a paraphrase. Steam **CORRECTED** to 62% of 225 all-time, plus 47% of 17 recent. "ChatGPT from OpenAI" disclosure confirmed |
| 12 | Your AI Slop Bores Me: 50M views in week one, 16K concurrent, out of CPU | Exa fetch of youraislopbores.com | **CONFIRMED** as self-reported |
| 13 | Star counts: ClaudeCraft 2,327/743, AI Town 10,726, Generative Agents 22,312, Gradient Bang 422 | `gh api` / `gh search` | **CONFIRMED.** Gradient Bang "~Apr 2026" date **CORRECTED:** the repo dates to Aug 2025, and the PH date is unverified. Added Terse repo stats (291 stars) and the small-repo caveat for the section 3a examples |
| 14 | Terse: useterse.ai "perfect primitive for deploying multiplayer agents" quote; README "Multiplayer AI Chat" with `@Interleave`; FAQ "no transaction across several actors"; TS reference mentions alarms; Bun ≥1.4.2; `terse init counter --template counter`; port 7100 | Exa fetch of useterse.ai, docs quickstart/FAQ/TS reference; `gh api` README | All **CONFIRMED.** Added FAQ runtime limits (10 s idle timeout, 0.25 CPU / 256 MiB) and socket-tag helpers to Gotchas |
| 15 | Agent Relay tic-tac-toe example on a `["tic-tac-toe"]` channel; "basically slack… for agents" | Exa fetch of agentrelay.com blog | **CONFIRMED.** Added that the post is dated Feb 27 2026 (background) and the exact models and 5-minute cap in the example |
| 16 | tldraw plugin Sep 29 2026; Liveblocks Sync Sep 1 2026 | Exa fetch | Dates and "who else is present" **CONFIRMED**; Liveblocks `setPresence`/`mutateStorage` API names **UNVERIFIED** |
| 17 | Event page: "multiplayer AI system" idea, judging language, $100 OpenAI credits, track prizes | grep of EVENT_PAGE.md | **CONFIRMED**; added the prize and rules detail to section 4 |
| 18 | `skyaara/llmgames-online` "Durable Objects own the rules…", "projected state and submit validated intents"; Mafia-A2A whisper "shape" | `gh api` README | **CONFIRMED** (both repos have 0 stars) |

No fabricated quotes or URLs were found. One dead or blocked source (the 24vids mirror) was replaced.
