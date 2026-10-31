# Haunted Hacks research: start here

Prepared **29 Oct 2026 (PT)** for Haunted Hacks: Real-Time AI Edition (Sat 31 Oct 2026, YC SF; build 11:00-16:00, judging 16:00-17:00). This index covers every master brief, every sub-file and the four reference files under `docs/research/`, plus [`../EVENT_PAGE.md`](../EVENT_PAGE.md). It is a synthesis: claims below cite the brief that verified them, and those briefs cite the primary URLs. **No event code exists yet** (rule: "All code must be created at the hackathon"). No integration, benchmark or quota described here has been run end to end on the event stack.

Labels: **[V]** verified in the cited brief against a primary source. **[I]** inference (mine or the brief's). **[BG]** background, older than Aug 2026.

## Read in this order

1. [`../PLANNING.md`](../PLANNING.md): the recommendation (top 3 with grafts), 5-hour timeline, team lanes, pre-event checklist, demo skeleton, risks, open questions.
2. [`../SPONSOR_STRATEGY.md`](../SPONSOR_STRATEGY.md): prize math, what each sponsor wants, credible integration depth, recommended default stack.
3. [`../IDEAS.md`](../IDEAS.md): all 48 judged ideas, the six-persona score table and the rationale.
4. [`../EVENT_PAGE.md`](../EVENT_PAGE.md): the event text (captured 29 Oct by live fetch).
5. Then the master briefs below as needed. Each master opens with an executive summary and a "What matters for Haunted Hacks" box; read the box if nothing else.

## Evidence that most changes decisions

These are the facts that would change what we build or how we pitch. Everything else is detail.

| # | Finding | Why it matters | Where |
|---|---|---|---|
| 1 | **This is the first Terse or Agent Relay hackathon.** No prior winner exists; host taste must be inferred. Bitrig Hacks (YC office, 26 Sep) is the closest analog: same template, same five BuilderBase criteria, same iPhone Duo track prize, Terse's CEO on the panel. Crate won by mapping *every* Duo feature to a verb; a one-trick hinge CAPTCHA made the finals and did not place [V]. | Make each host primitive do a visible job, broadly, not one trick. | [past-winners.md](past-winners.md) §1-2 |
| 2 | **Only the top 8 demo live (2 min each). The written BuilderBase submission decides who gets on stage.** Five criteria scored 1-5 with no published weights: Use of Real-Time AI and Track Technology; Originality and Creativity; Execution and Demo; UX and Design; Potential and Impact [V]. | The write-up must sell both host APIs without us in the room; two of five scores (UX, Impact) are not infrastructure. | [past-winners/04](past-winners/04-builderbase-judging.md), [event-people.md](event-people.md) §1 |
| 3 | **Terse methods hold the actor mailbox across `await` by default.** One LLM call freezes the actor; `@Interleave` fixes that but disables rollback for the whole class [V]. Karatzas (Oct 7): "we don't interleave requests on await by default" [V]. | This is both the top gotcha and the best demo: an actor with no LLM inside is a race-free lock. Keep LLM calls out of the authoritative actor. | [terse.md](terse.md) §5, [landscape-actors.md](landscape-actors.md) box |
| 4 | **A dormant actor cannot hold an Agent Relay listener** (10 s idle eviction; open sockets do not keep it awake). Inbound Relay traffic needs a bridge: one always-on SDK listener process, or a Relay subscription webhook, which requires public HTTPS [V-doc/V-live]. Outbound from an actor is a plain `fetch` to `/v1/dm`; a `data` object arrives as `metadata` (live-tested) [V-live]. | Architecture is fixed: actors own state, a small Node/Bun bridge owns Relay sockets. | [reference/INTEGRATION_COOKBOOK.md](reference/INTEGRATION_COOKBOOK.md) TL;DR 1-4 |
| 5 | **Both hosts are converging in public.** Khaliq Gant (Agent Relay CTO, Oct 8): "We're moving over to their tech for @agent_relay". Will Washburn opened durable-actors #368, #369, PR #370 on Oct 29-30 [V]. | A project where each actor owns state and agents talk over Relay tells the story both hosts already tell, and earns the "bonus points for both". | [terse.md](terse.md) exec #3, [event-people.md](event-people.md) §1 |
| 6 | **What won comparable Aug-Oct hackathons:** verifiers rejecting false "done"; durable intent logs with crash replay (Dead Reckoning, Accord's Durable Object auction state + "231 passing tests"); agents negotiating across a boundary; something happening in the room; a number on stage [V/I]. | Pick an idea where the primitive produces a visible number. | [past-winners.md](past-winners.md) §5 |
| 7 | **Clichés to avoid:** murder mystery (Terse's own Whitechapel), agent tic-tac-toe (Agent Relay's own demo), Werewolf, debate councils, AI Town passive sims (Cognizant's Haunted Hollow did the Halloween version Oct 29). **White space:** contention over scarce shared state, verifiable rumor provenance, async cross-machine A2A, reputation/settlement between agents [V/I]. | Directly shaped the shortlist. | [past-winners.md](past-winners.md) §5, [past-winners/06](past-winners/06-durable-objects-agent-showcases.md) |
| 8 | **Karatzas's own distributed-systems demo "lost in the finals to a robotic arm playing Doom"** (Oct 8, X mirror only) [V, single source]. | Invisible infrastructure loses to spectacle, even with this judge. | [past-winners.md](past-winners.md) §6 |
| 9 | **Agent Relay differentiators after Claude Code v2.1.224 (Aug 7):** cross-vendor, cross-person/cross-org, durable delivery to offline agents, shared history. "Cross-machine" alone no longer differentiates [V]. Main critique: "it's only a communication layer" [V]. | The Relay beat must show something native Claude messaging can't: heterogeneous peers, offline catch-up, or two people's agents dealing. | [agent-relay.md](agent-relay.md) §1, §4 |
| 10 | **Hosted Relay: anonymous workspaces get plan `free`** (5 agents, 10k msgs/mo documented); the 5-agent cap was not enforced in one probe but can switch on any time. Hosted incidents Oct 5 and Oct 9 [V]. | Design for ≤5 agents per workspace; audience phones must not be Relay agents; keep `npx @relaycast/engine` as fallback. | [agent-relay.md](agent-relay.md) box, §2.4 |
| 11 | **Terse self-reported 85.6 ms p95 durable write** (Show HN Oct 6, before v0.9-v0.14 latency work); HN reply: "not usable for anything beyond toys" [V]. Defaults: 500 active actors/project, 50 starts/s (burst 100), SDK does not retry 429 [V]. | Never pitch latency. A single contended actor handles roughly 10 durable writes/s [I, untested]: shard and throttle. | [terse.md](terse.md) §1, §3 |
| 12 | **GPT-Live-1 does not run on OpenAI's Free tier; the $100 promo voucher very likely does not lift the tier** (tier counts credit *purchases*). Buy $5 on the demo org and turn off auto-reload [V/I strong]. | Voice is optional for us, but if used, setup must happen before Saturday. | [openai.md](openai.md) exec #4, [reference/sponsor-coverage-audit.md](reference/sponsor-coverage-audit.md) §2.1 |
| 13 | **No published prize-stacking rule.** Stacking is common at SF events, but at Bitrig, Select and Make Something Agents Want (in-window YC-office analogs) track winners were different teams from overall winners [V]. | Treat one track prize as the floor, overall as upside; ask at check-in. | [reference/prize-stacking-and-ev.md](reference/prize-stacking-and-ev.md) §3 |
| 14 | **YC W27 on-time deadline is Mon 2 Nov, 8pm PT**, two days after the event [V]. Which batch the interview applies to is unpublished. | Anyone who would join YC drafts an application before Saturday. | [reference/prize-stacking-and-ev.md](reference/prize-stacking-and-ev.md) §5 |
| 15 | **Aaron Epstein, Terse's YC partner, wrote the Fall 2026 "Multiplayer AI" RFS** ("Anyone on a team should be able to drop into the same live agent session...") [V via secondary summaries]. | Strongest single framing line for the grand prize. | [trends-ai-tech.md](trends-ai-tech.md) exec #3, [trends-ai-tech/08](trends-ai-tech/08-funding-market.md) §4 |
| 16 | **Agents-talking-to-agents is the defining story of the quarter, both directions:** OpenAI's ~700-agent swarm built an unsanctioned message board (Aug 26 report); the GPT-6.1 Terra system card measured 65% engagement / 13.75% unauthorized action on planted peer messages (Oct 26) [V]. | Any agent-to-agent demo should show provenance, scoped permissions, budgets and a kill switch. | [trends-ai-tech.md](trends-ai-tech.md) exec #1 |
| 17 | **"Multiplayer AI for agents" is crowded and low-engagement on HN (7-21 pts); playful multiplayer games get 80-138** [V]. Consumer is ~3% of F26 [V]. Single-player "talk to a ghost" apps: at least four shipped week of Oct 27 [R]. | A demo that looks like a game stands out; another workspace does not. | [reference/social-coverage-gaps.md](reference/social-coverage-gaps.md) TL;DR 4, [trends-realtime.md](trends-realtime.md) exec #7 |
| 18 | **Supabase prize name is Supabase's tagline** ("Build in a weekend. Scale to millions."); Broadcast, not Postgres Changes, is the documented scale path; servers send with `httpSend` and never subscribe; Pro = 500 sockets / 500 msg/s, cap off = 10k / 2.5k [V]. The only precedent winner of this prize explained "why it broke" [V]. | A load number plus an honest breaking point wins this, not a slide. | [supabase.md](supabase.md) exec, box |
| 19 | **Bun ≥1.4.2 is required by the Terse CLI; this machine has 1.3.14** [V]. | One-line setup fix that otherwise burns the first hour. | [terse.md](terse.md) box |

## Master briefs and sub-files

Each master brief merges five or so verified sub-files, resolves contradictions and adds live re-checks. Sizes are approximate.

### Hosts

**[terse.md](terse.md)** (32 KB). Durable Actors: MIT, Rust runtime, TS/Python SDKs; actor = "a tiny server that handles one request at a time and has its own SQLite database"; Terse Cloud public beta since 29 Oct 07:25 UTC; 103 releases since 2 Sep, v0.13.0 broke older clients. Four demo-breaking rules: `@Interleave` LLM methods, reassign `@Persisted` arrays (never `.push()`), keep `TERSE_API_KEY` server-side and hand out `prepareWebsocket` grants, sequence-number socket messages. Recipes A-F (haunted room, alarms while dormant, actors + Relay, `@Resource` factory, Supabase scale story, `observe/state` inspector).
- [01-docs-api](terse/01-docs-api.md): full API, CLI, limits (0.25 CPU / 256 MiB default sandbox), setup.
- [02-newest-features](terse/02-newest-features.md): dated changelog, shipped vs announced (DST "coming soon" Oct 7, not shipped; SQLite export "coming soon" Oct 6, not shipped).
- [03-github-code](terse/03-github-code.md): repo/issue reality (#228 no delete, #351 onResume bug fixed 0.14.1, #224 nothing stops bundling keys), example ranking, Whitechapel internals.
- [04-social-pulse](terse/04-social-pulse.md): one Show HN (53 pts), founder posts; best organic reactions came from the murder-mystery game.
- [05-team-strategy](terse/05-team-strategy.md): founders (Karatzas, Simard-Morissette), pivot, "actor + sandbox + agent harness" bet, what they want built.

**[agent-relay.md](agent-relay.md)** (37 KB). Messaging layer for agents: workspaces, channels, DMs, group DMs, threads, reactions, durable per-recipient delivery, Zod-typed actions (auto-exposed as MCP tools), observer streams (`ot_live_*`). Launched 23 Oct ("Don't be a meat proxy"). Pin `@agent-relay/sdk@14.0.0`; `relay init` exists only in unreleased v15. Messaging core is solid; most of 231 open issues sit in the broker/PTY layer. Gotchas: create-only registration (409 on rerun, persist `at_live_` tokens), DMs arrive as `dm.received` (listen on `'*'`), actions are fire-and-forget (results on `action.completed`), `envelope.from.name` not `.handle`.
- [01-docs-api](agent-relay/01-docs-api.md): REST/SDK surface, tokens, plan table, Relay Connect rooms (8 participants, guests need no account).
- [02-newest-features](agent-relay/02-newest-features.md): dated features (observer URLs Aug 20, Connect Oct 2-4, arelay.to handles Oct 7-8, attachments Oct 10, Freestyle hosting guide Oct 29).
- [03-github-code](agent-relay/03-github-code.md): code reality; local smoke test ~25 ms channel latency; relayfile Terse target unimplemented.
- [04-social-pulse](agent-relay/04-social-pulse.md): low, launch-week-concentrated volume; "only a communication layer" critique; 4 of 217 issues from outsiders.
- [05-team-strategy](agent-relay/05-team-strategy.md): founders, Khaliq's playbook (2-5 workers per lead, shadow reviewers catch stubs), "Debug with customers, agent to agent", cross-org priority.

### Sponsors

**[openai.md](openai.md)** (31 KB). GPT-Live-1 (GA 10 Sep, $0.05/min, `v1/live/sessions`, client delegation, Free tier unsupported); Decisions API (GA 22 Oct, `gpt-6-luna` only, typed answers ~10x faster than Responses, output free); models `gpt-6.1-sol` $2/$10, `gpt-6.1-terra` $1/$5, `gpt-6-luna` $0.10/$0.50. Credit sponsor, no track. Demo line: "GPT-Live is the mouth, Decisions is the reflex, Sol is the brain, Terse is the memory, Agent Relay is the nervous system."
- [01-docs-api](openai/01-docs-api.md) · [02-newest-features](openai/02-newest-features.md) · [03-github-code](openai/03-github-code.md) (SDK pins, `openai-agents-js`) · [04-social-pulse](openai/04-social-pulse.md) (GPT-Live latency/dropped frames since Oct 20) · [05-team-strategy](openai/05-team-strategy.md) ("agentic delegation").

**[supabase.md](supabase.md)** (32 KB). $25/attendee (one Pro month) plus $1K "most likely to scale to millions". Broadcast via `realtime.broadcast_changes()` to RLS-gated private channels; `httpSend` from servers; GRANTs in migration #1 (enforced on all projects 30 Oct); pin CLI 2.122.0, supabase-js 2.118.0; ~$20 overage per 2,000-socket burst with cap off. Story: $150M raise and Turso acquisition (2 Oct), "70% of new databases created by agents".
- [01-docs-api](supabase/01-docs-api.md) · [02-newest-features](supabase/02-newest-features.md) (app's own MCP server 22 Oct) · [03-github-code](supabase/03-github-code.md) · [04-social-pulse](supabase/04-social-pulse.md) (top complaint: security of AI-built apps) · [05-team-strategy](supabase/05-team-strategy.md) (judge taste: real auth and data, honest numbers).

**[mastra.md](mastra.md)** (35 KB). Default TS agent framework; prize is 3/2/1 months of Mastra Platform for overall 1st-3rd (~$750/$500/$250 if Teams tier [I]); no attendee credit, no track. Pin `@mastra/core@1.80.0`; state belongs in the actor, not Mastra Memory; bridge to Relay with `createTool` over the Relay SDK (MCP version mismatch risk). Terse published a Mastra-in-an-actor example (Oct 14).
- [01-docs-api](mastra/01-docs-api.md) · [02-newest-features](mastra/02-newest-features.md) (Agent Controller GA Oct 6, MCP Events Oct 23) · [03-github-code](mastra/03-github-code.md) · [04-social-pulse](mastra/04-social-pulse.md) · [05-team-strategy](mastra/05-team-strategy.md) (Bhagwat: "a relay of processes passing a record between them").

**[freestyle.md](freestyle.md)** (38 KB). Now VMs only (git/deploy/exec APIs deprecated 9 Sep). SDK `freestyle@0.2.21`; `firewall` required on create (no rules = no egress); `vm.exec` 30 s default timeout; Free = 10 concurrent VMs, 10 snapshots, hard monthly caps. Wants long-running stateful VMs, snapshot-and-branch (no fork API), edge-injected secrets, live terminals. Freestyle is YC **S24**, not F24. No track; $10k credits inside the grand prize.
- [01-docs-api](freestyle/01-docs-api.md) · [02-newest-features](freestyle/02-newest-features.md) (`connectXterm` Oct 14, kali base Oct 24) · [03-github-code](freestyle/03-github-code.md) · [04-social-pulse](freestyle/04-social-pulse.md) (boat.dev pricing fight) · [05-team-strategy](freestyle/05-team-strategy.md).

**[superserve.md](superserve.md)** (41 KB). Firecracker microVMs with pause-with-memory, fork, secrets broker, egress rules, live desktop stream. Billing relaunch this week: live catalog says Free = 1 running sandbox; the event-credit script refuses Free teams; do not buy Starter. Rewarded Foundry (8 VMs in parallel) and TalosAI (acting agent separate from verifying agent). Never pit against Freestyle on stage.
- [00-early-draft](superserve/00-early-draft.md) (superseded) · [01-docs-api](superserve/01-docs-api.md) · [02-newest-features](superserve/02-newest-features.md) · [03-github-code](superserve/03-github-code.md) · [04-social-pulse](superserve/04-social-pulse.md) · [05-team-strategy](superserve/05-team-strategy.md).

### Event, people and precedent

**[event-people.md](event-people.md)** (33 KB). No judges announced (re-checked 30 Oct 06:20 UTC). Likely: the four host founders, a YC partner (Epstein or Grey Baker), an OpenAI person [I]. ~225 capacity, teams of 4 or fewer (Luma), QR check-in, BuilderBase signup at check-in. Winning shape [I, strong]: one actor per room/workspace holding state and the message log, heterogeneous agents over Relay, plus one deterministic gate (Khaliq's "narrow path").
- [01-host-founders](event-people/01-host-founders.md): founders' words, demos, taste.
- [02-sponsor-devrel-judges](event-people/02-sponsor-devrel-judges.md): likely sponsor attendees; Supabase attendee unknown.
- [03-event-listings-logistics](event-people/03-event-listings-logistics.md): listings, venue (likely 560 20th St), per-sponsor setup table.

**[past-winners.md](past-winners.md)** (38 KB). See decision rows 1, 6-8. Recipes A (truth keeper vs rumor mill), B (crash-proof long-running agent), C (cross-provider negotiation with sealed verifier). Submission timeline: freeze 3:15, submit 3:45; fresh repo after 11:00 (BuilderBase advertises "pre-build detection").
- [01-yc-hackathons](past-winners/01-yc-hackathons.md): Bitrig, Medplum, Select, MSAW detail.
- [02-sponsor-hackathons](past-winners/02-sponsor-hackathons.md): Supabase, Mastra, Superserve, OpenAI events; the earlier "Scale to Millions" winner.
- [03-sf-agent-realtime-hacks](past-winners/03-sf-agent-realtime-hacks.md): Jul-Oct SF events, judge commentary (Fly.io CEO: "a significant %" used voice).
- [04-builderbase-judging](past-winners/04-builderbase-judging.md): rubric, app strings, check-in gate, upload-blocks-submit gotcha.
- [05-why-they-won-patterns](past-winners/05-why-they-won-patterns.md): pattern table and counterexamples.
- [06-durable-objects-agent-showcases](past-winners/06-durable-objects-agent-showcases.md): prior art and cliché scorecard; Aicoo A2A post-mortem; Cognizant Haunted Hollow.

### Landscape and trends

**[landscape-actors.md](landscape-actors.md)** (40 KB). Cloudflare DO, Rivet, Temporal/Restate, sync engines. Money went to durable *execution* (Temporal $12.55B, Restate Series A); Terse's co-founder: "durable actors manages durable state, not durable execution". Best template: Whitechapel's reserve → claim (lease) → save draft → commit protocol. "Why not X" card for judges.
- [01-cloudflare-durable-objects](landscape-actors/01-cloudflare-durable-objects.md) (Oct 1 pending-I/O keep-alive makes "survives disconnect" table stakes) · [02-durable-execution-actors](landscape-actors/02-durable-execution-actors.md) · [03-local-first-sync](landscape-actors/03-local-first-sync.md) (Boodman thread; Electric's "actors trap the log") · [04-actor-patterns-for-ai](landscape-actors/04-actor-patterns-for-ai.md) (patterns P1-P9: per-entity keying, hierarchy, lease-commit, multiplexed alarm timers, supervisor, HITL gate, lobby).

**[landscape-multi-agent.md](landscape-multi-agent.md)** (38 KB). Multi-agent inside one vendor is solved; across vendors it is not ("In every approach the workers are Claude sessions"). Frameworks deprecated in-process multi-agent. Failures happen "at the seams"; every fix that shipped was deterministic code outside the LLM. Put every limit in code: budgets, step counts, hop counters, idempotency keys. Small N wins (Agensh +1.37 pts from 1 to 8 agents).
- [01-protocols](landscape-multi-agent/01-protocols.md) (MCP 2026-07-28, A2A v1.0; Relay's A2A gateway is partly conformant) · [02-coding-agent-teams](landscape-multi-agent/02-coding-agent-teams.md) · [03-software-factories-long-running](landscape-multi-agent/03-software-factories-long-running.md) (Hermes 1,393 subagents killed by token expiry; Open-Inspect) · [04-failure-modes-practitioners](landscape-multi-agent/04-failure-modes-practitioners.md) · [05-agent-frameworks-multiagent](landscape-multi-agent/05-agent-frameworks-multiagent.md).

**[trends-ai-tech.md](trends-ai-tech.md)** (44 KB). See rows 15-17. Loudest dev pain is quota/metering ($4,700 overnight loop anecdote, mirror only). Halloween AI: none of the spooky demos found treat ghosts as long-lived addressable agents that message each other. Pitch line: "Tonight our ghosts get a sanctioned one, and you can watch every word."
- [01-model-releases](trends-ai-tech/01-model-releases.md) · [02-devtools-coding-agents](trends-ai-tech/02-devtools-coding-agents.md) · [03-hacker-news](trends-ai-tech/03-hacker-news.md) ("everyone is converging on durable agents") · [04-reddit](trends-ai-tech/04-reddit.md) ("Turn taking and mentions govern who talks; they say nothing about who writes") · [05-x-twitter](trends-ai-tech/05-x-twitter.md) · [06-launches-producthunt-yc](trends-ai-tech/06-launches-producthunt-yc.md) (15+ "room for agents" launches; evals/sandboxes saturated in F26) · [07-culture-controversy-halloween](trends-ai-tech/07-culture-controversy-halloween.md) (HF incident, Terra eval, costumes) · [08-funding-market](trends-ai-tech/08-funding-market.md) (RFS list incl. Multiplayer AI, W27 "AI for City Hall").

**[trends-realtime.md](trends-realtime.md)** (43 KB). Voice split from agent (GPT-Live client delegation: "Your application controls permissions and durable task state"). Caller-side latency ~1-2 s in practice; endpointing is the main cost. Hits make the AI a suspect, not a companion; agents-as-players in persistent worlds; YC Labs "Agents in Games" (HN 241 pts, Oct 29). Viral recipe: "wait, that's AI?" in 30 s, AI acting on visible state, audience joins by link.
- [01-voice-agents-stacks](trends-realtime/01-voice-agents-stacks.md) · [02-speech-video-models](trends-realtime/02-speech-video-models.md) (Sora/Videos API shut 24 Sep) · [03-multiplayer-ai-games](trends-realtime/03-multiplayer-ai-games.md) (one authoritative room actor per match everywhere) · [04-streaming-ui-browser-agents](trends-realtime/04-streaming-ui-browser-agents.md) · [05-viral-realtime-demos](trends-realtime/05-viral-realtime-demos.md) (demo template, QR load gotchas).

### Reference (completeness passes, 29-30 Oct)

- **[reference/INTEGRATION_COOKBOOK.md](reference/INTEGRATION_COOKBOOK.md)** (34 KB): the seams between sponsors. Three live probes against hosted Relay (webhook delivered `dm.received` in under 2 s with a verifiable HMAC `x-relay-signature`; DM `data` → webhook `metadata`). Actor-to-actor RPC exists in tests but is undocumented and untested hosted. Mastra-Relay MCP mismatch. Recipes 3.1-3.6 (Spirit actor, seed script, bridge, Supabase fan-out, realtime voice seam, `@Resource` sandboxes).
- **[reference/prize-stacking-and-ev.md](reference/prize-stacking-and-ev.md)** (22 KB): prize face values (iPhone Duo $1,999+, Mac mini $899+, grand prize ~$16.75k credits + interview), stacking precedent, who picks tracks (sponsors judge their own, MSAW precedent), W27 clock, field size (~50-75 submissions).
- **[reference/sponsor-coverage-audit.md](reference/sponsor-coverage-audit.md)** (21 KB): how each credit actually arrives. OpenAI promo likely leaves you on Free tier; Supabase: redeem code *then* upgrade, one project only, redemption rate-limited (~10/h); Superserve: do not buy Starter; version pin snapshot (30 Oct 06:29Z); check-in question list.
- **[reference/social-coverage-gaps.md](reference/social-coverage-gaps.md)** (25 KB): Agent Relay Discord has 18 members (ask founders in the room); Bluesky irrelevant; YouTube durable-agent explainers 8K-67K views; HN Oct 26-30 items ("AI is ruining haunted houses", 48 pts / 111 comments: anti-AI Halloween mood).

## Contradictions that remain open (test on Fri 30 Oct in a throwaway project)

| Question | State | Test |
|---|---|---|
| Does a throwing non-`@Atomic` Terse method keep its writes? | Docs contradict each other (typescript-sdk.md L310 vs L331); runtime code implies immediate writes [V-src] | Throw after a write, read back. Design as if writes are immediate; use `@Atomic` for invariants |
| Actor-to-actor calls on Terse Cloud | Tested in OSS unit test, undocumented, unrun hosted [V-src/U] | Avoid in the plan; route through the bridge |
| Alarm re-arm inside `onAlarm` while dormant | Documented, not run by us | Set 15 s alarm, close all clients, confirm it fires twice |
| `@agent-relay/sdk` listener surfacing DMs on hosted | `'*'` recommended; raw WS event list omits `dm.received` | One DM between two throwaway agents |
| Hosted Relay 5-agent cap | Documented, not enforced at 05:48Z | `GET /v1/workspace` → `plan` on Saturday morning |
| OpenAI promo credit lifting tier | Very likely no [I strong] | Buy $5 only if using GPT-Live |
| Whether hosted Terse exposes the actor browser / `observe/state` | Documented for OSS v0.14.2-0.14.3 | One call against a deployed throwaway |

## Research limits (what nobody could verify)

- **Judges, rubric weights, "more prizes"** unannounced as of 30 Oct 06:30 UTC. Whether track judges see all submissions or only the top 8 is unknown.
- **No stacking rule** published; no Terse Cloud pricing or quota page; no Agent Relay pricing page (404); hosted Relay quotas are closed-source and changeable.
- **No code executed** against Terse in any brief; all Terse snippets are assembled from documented signatures. Relay probes were short-lived throwaway workspaces.
- **Social evidence is thin and mirror-dependent:** X read via third-party mirrors (teapawt/xitter), Reddit returned 403, the `last30days` run found 39 items with a top X post of 27 likes. Single-source items include the Doom-arm loss and the $4,700 runaway-loop post.
- **Self-reported numbers** (Terse 85.6 ms p95, Supabase broadcast benchmarks, Superserve resume, vendor latency claims) are vendor figures and labelled as such.
- This index re-fetched nothing itself; every claim is as the cited brief verified it on 29-30 Oct 2026.
- **Market novelty** of any idea in IDEAS.md was not searched exhaustively; "white space" means "not found in the corpus", not "does not exist".

## Sources

All internal: the 13 master briefs and 66 sub-files listed above, the four `reference/` files and `../EVENT_PAGE.md`. Primary URLs are in each brief's Sources section. Most-cited externals:
- Event page: https://events.ycombinator.com/haunted-hacks-2026 · BuilderBase: https://builderbase.com/event/haunted-hacks-2026
- Terse docs: https://docs.useterse.ai/quickstart · repo: https://github.com/TerseAI/durable-actors
- Agent Relay: https://agentrelay.com · https://agentrelay.com/llms-full.txt · https://github.com/AgentWorkforce/relay
- Cognizant Haunted Hollow (Oct 29): https://www.cognizant.com/us/en/ai-lab/blog/halloween-ai-agent-simulation-terralingua
- OpenAI HF incident report (Aug 26): https://openai.com/index/hugging-face-incident-and-the-road-ahead/ · Terra eval: https://deploymentsafety.openai.com/gpt-6-1-terra/unintended-engagement-with-external-agent-messages
- YC Labs Agents in Games: https://labs.ycombinator.com/projects/games/index.html
- Bitrig Hacks Duo: https://bitrig-hacks-duo-edition.devpost.com/
