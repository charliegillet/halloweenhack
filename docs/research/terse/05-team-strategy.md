# Terse (Durable Actors): team, strategy and competition

> Researched 2026-10-29 for Haunted Hacks (Sat 2026-10-31, YC SF). Angle: founders, YC/launch posts, funding, positioning, ICP, competitors, roadmap hints, and what the founders say they want built. Other files in this folder cover the SDK and docs in depth; this one only touches the API where it affects strategy.
> Method: Exa search/fetch, `gh` CLI (repo metadata, issues, releases), the HN Firebase API, the npm registry. X posts were read through Nitter/teapawt mirrors because x.com could not be fetched, so engagement counts are mirror snapshots. **[V]** = verified from a primary source; **[I]** = my inference.

## TL;DR

- **Two founders, NYC, YC F26, partner Aaron Epstein.** Thomas Karatzas (CEO) spent 7 years at Apple, ending as Staff Engineer on Siri / Apple Intelligence platform. Olivier Simard-Morissette (CTO) came from Pigeon (YC W23), Squarespace and NYT. They met at McGill. [V] Olivier wrote most of the runtime: 261 of the ~374 commits, against Thomas's 105. [V]
- **This is a pivot.** From March to July 2026 Terse sold an "AI workflow platform for coding agents" (typed SDK, Modal sandboxes). The `durable-actors` repo was created 2026-08-30 and became "our first product" for the YC launch. [V] The founders now describe the company as "the next Agent Infra company". [V]
- **Positioning:** "open-source alternative to Cloudflare Durable Objects", built for agent fleets and multiplayer AI. They lean on four points: configurable CPU/RAM/data residency per actor, persisted fields by default, no interleaving on `await` by default, and SQLite export plus o11y through CLI/MCP. [V]
- **Competitive pressure is real.** Rivet (6.5k stars) and denoland/celld (6.2k stars) are both further along as OSS Durable Objects alternatives. Cloudflare and Rivet both shipped Pi Durable harness integrations in early October, before Terse did. [V] Terse has 290 stars (re-checked 2026-10-29) and is shipping several releases a day this week. [V] Rivet's 3.0 preview (10-26) also publishes 0.69 ms p50 / 0.80 ms p99 SQLite writes and 6.9 ms cold starts, against Terse's self-reported 85.6 ms p95 durable write. The two are measured differently, but the gap is the obvious line of attack. [V: rivet changelog, HN]
- **What they want to see built** (their own words and demos): software factories, long-running agents, multiplayer AI, agent swarms that share state (CRM, codebase), and a "tiny Lovable". Their own showcase demos are a multiplayer murder-mystery game and a talking-agents sync demo. [V] That makes a spooky multiplayer AI game a strong fit for the theme. [I]

## 1. Founders

| | Thomas Elias Karatzas (CEO) | Olivier Simard-Morissette (CTO) |
|---|---|---|
| Prior | Apple 2018–2025, junior to Staff Engineer; "platform for Siri and Apple Intelligence" [V: YC page, thomaskaratzas.com] | Principal SWE at Pigeon (YC W23); Senior SWE / tech lead at Squarespace and The New York Times ("highly scalable data pipelines for marketing teams") [V: YC page] |
| Earlier | Founded Know Your VC (acquired by RateMyInvestor); McGill Software Eng [V: YC page] | McGill [V: X bio] |
| Public profile | Built **RustGPT**, a from-scratch transformer in Rust; his site claims "#1 on Hacker News, 3.2k GitHub stars" [V: claim on his site; stars not independently checked] | Wrote the June/July Terse blog posts on Modal sandboxes and typing [V] |
| Handles | X `@karatzas_thomas`, HN `thomask1995`, GH `tekaratzas` (plus `thomas-terse`) | X `@oliviersm199`, HN `olism`, GH `oliviersm199` |
| Role in repo | 105 commits; product, examples, o11y UI, Pi integration issues [V: gh] | 261 commits; runtime, storage (GCS Rapid, Litestream/LTX in Rust), sandbox pool, Python SDK [V: gh] |

Founder story, from the YC company page [V]: "In 2021, Swift released actors. It was game changing for my team where threads competing for resources/data races were our #1 source of bugs. Agents are becoming like threads now." The trigger was running 10 agents over a large CSV with shared state in Postgres, where "the snapshotting system was serving stale data to half of the agents causing duplicate work". He then found Durable Objects and decided that "Cloudflare forces you to go through there workers platform … and has insane lock in." They also say: "We won several hackathons together, and even worked on a project that had 15K MAU."

On HN [V], Thomas credits the API design to Swift: "I come from writing swift for 7 years (I was at apple) and really thought they nailed the actor model". What he liked was "the decorator syntax + opting into 'dangerous' things", and he wants to add something like Swift `@Sendable` "to flag when state data is about to leave the actor."

[I] Expect judges to respond to decorator-driven, type-safe, correctness-by-default design. They come from platform engineering and think about data races and durability boundaries, not UI polish alone.

## 2. Company, batch, funding

- **YC F26**, founded 2025, team of 2, NYC, B2B infrastructure, group partner **Aaron Epstein**, not hiring [V: YC page; mentionfox mirror of directory dated 2026-09-30].
- YC tagline: "Durable state for AI agents. We build infrastructure to power agentic systems such as software factories, multiplayer agent frameworks and agent coordination." [V]
- **Investors listed on useterse.ai: "Articulate and Y Combinator (F26)."** [V] Articulate is Helen Min's solo-GP pre-seed fund: $10M, launched 2026, standard **$500K check on a post-money YC SAFE**, thesis "backing technical founders pre-pitch deck". It lists Terse AI in its portfolio [V: f4.fund, Dealroom, Articulate LinkedIn]. Terse's actual round size is **not public** [could not verify]. [I] If the standard terms applied, Terse has roughly YC's standard deal plus ~$500K from Articulate, which suits a 2-person team.
- Legal name "Terse Inc. dba Terse AI"; X `@IncTerse` joined May 2026 [V].

## 3. The pivot: workflows to actors (background, Mar–Aug 2026)

- `terse-sdk` and `terse-cli` were first published on npm on **2026-03-03** [V: npm registry]. The earlier product was "the AI workflow platform for coding agents": a typed SDK generated from your workspace ("Context as Code"), Slack/GitHub/Attio triggers, scoped "skills" ACLs, and deploys onto Modal sandboxes [V: TerseAI docs and npm README, terse.mintlify.app].
- Blog posts from that era: "How we re-invented Workflow Builders using Modal Sandboxes" (2026-06-02, Thomas), "How we built secure automated learning loops in Modal and Claude Code" (2026-06-24, Olivier), and "Coding agents have settled the static vs. dynamic typing debate" (2026-07-01, Olivier) [V: blog index].
- 2026-08-30: `little-durable` ("Tiny Durable Workflow SDK", 32 stars) and `durable-actors` repos created [V: gh]. The `durable-actors` npm package was first published 2026-09-22 [V].
- The LinkedIn company blurb still lists "actors and durable workflows" and three beliefs: "agent infrastructure should be serverless, durability is paramount, and determinism should be used whenever possible" [V: LinkedIn mirror].
- [I] Some workflow DNA carries over: generated typed clients, CLI-first DX, and coding agents as the primary user (the quickstart opens with "Run curl … quickstart.md and follow every step", which is written for an agent). The `terse-sdk/actor` import path in the hosted quickstart suggests they reused the old SDK package name for the actor product.

## 4. Launch timeline (last 90 days)

| Date | Event | Source |
|---|---|---|
| 2026-08-30 | `durable-actors` repo created | gh [V] |
| 2026-09-30 | Appears in YC F26 directory | mentionfox [V] |
| 2026-10-06 | YC launch tweet ("Terse is joining the YC F26 batch!", ~23.9k views on mirror) and **Show HN** posted 15:58 UTC (53 points, 25 comments) | X mirror, HN API [V] |
| 2026-10-07 | "Introducing Durable Actors" tweet; promises a benchmark.md and DST (deterministic simulation testing, shout-out to Workers IO) | X mirror [V] |
| 2026-10-08 | Agent-coordination demo "almost won me the @ycombinator demo showcase. lost in the finals to a robotic arm playing Doom" (repo `talkingAgent`, created 2026-09-08, so the demo predates the launch) | X mirror, gh [V] |
| 2026-10-09 | `whitechapel` multiplayer Victorian murder-mystery game, built "to stress test our infra" with ElevenLabs TTS | X mirrors, gh [V] |
| 2026-10-12 | Python SDK ("one of the most requested features"); OpenAI Agents SDK Python example | X mirror, gh [V] |
| 2026-10-13/14 | `background-agents` (an Open-Inspect clone of Ramp Inspect) and `durable-actors-mastra-example` (multiplayer chat with Mastra) | gh [V] |
| 2026-10-16 | Olivier at the SF "durable objects popup" ("great to see the actor model becoming so mainstream") | X mirror [V] |
| 2026-10-17 | Comparison posts: Terse vs Cloudflare DO, Terse vs Rivet | blog [V] |
| 2026-10-19 | Hackathon announced ("the first (to our knowledge) Actor Hackathon at @ycombinator"; prizes listed as YC interview, iPhone duo, Mac mini; the embedded event card did not yet name Superserve, which was added later); Thomas's "tiny Lovable" demo; Olivier asks "what product should we build next?" | X / LinkedIn [V] |
| 2026-10-18 | 0.8.1: async Python actors, `@Atomic`, Pi Durable adaptor, Alarms, `durable-actors inspect` CLI | gh release v0.8.1 [V] |
| 10-22 → 10-29 | 0.9.0 → 0.14.4, 15 GitHub releases (v0.9.0 on 10-22 through v0.14.4 on 10-29 12:44 UTC). Modal as a sandbox provider, ClickHouse telemetry, usage metering, runaway-actor protection, org suspension, warm-pool spares, o11y UI fixes | gh releases/issues [V] |
| 2026-10-26 | "durable, horizontally scalable coding agent platform … Sandboxes, pi, Durable Actors" | X mirror [V] |

[I] The metering, abuse-protection and org-suspension work from Oct 23–24, plus the homepage now offering "Terse Cloud … managed hosting" (the Oct 17 blog still said "Self-host; documented GCP path"), points to the hosted multi-tenant cloud being readied for this hackathon's traffic. Hackers will be among its first real load.

## 5. Positioning and ICP

**Their words [V]:**
- "A Durable Actor is a tiny server that handles one request at a time and has its own SQLite database." (homepage, HN)
- Target apps: "chat systems (e.g. ChatGPT, Codex), collaboration tools (e.g. Notion), and agent swarms (e.g. Devin)" (README, YC launch)
- Value: actors "go dormant and back up in S3 when not in use"; "You no longer need to store JSONB in your Postgres DB, no more complicated websocket logic, it handles race conditions elegantly and helps keeps your REST API fully stateless." (YC launch)
- Two headline patterns (homepage): (1) **one actor per agent, users connect over WebSocket**, so "Your users can deploy and share agents at will without putting pressure on a central DB or websocket server"; (2) **actor as a lock around shared data**, so you can "protect critical data such as a CRM and allow multiple agents to run concurrently without worrying about data races."
- They name DO-built projects as targets to replicate: "RampInspect, OpenInspect … Liveblocks and PartyKit." (HN)
- Docs say when **not** to use it: cross-entity queries/analytics (use a DB), big scans (batch), and no cross-actor transactions (docs FAQ).

**ICP [I]:** small agent-infra and AI-app teams building multiplayer or long-running agents who want DO semantics without Workers lock-in, need more than 128 MB per object, or need data residency (GPAgent's profile reads the same way). Distribution is OSS-first, with no sales process.

## 6. Competitive landscape

| Competitor | Stars (2026-10-29) | How Terse says it differs | Notes / recent moves |
|---|---|---|---|
| **Cloudflare Durable Objects + Agents SDK** | cloudflare/agents 5.9k | Lock-in ("pull you into D1, R2 + workers") and "wasn't originally built for agentic workfloads" [sic] [V: HN]; "No more crashing at 128MiB" [V: Thomas, X 10-06 via mirror; the number is not in the HN thread or blog]. Terse serializes across awaits by default; DO uses storage gates [V: blog]. Note: Terse's own 10-17 blog concedes DO "does not inherently require you to adopt D1 or R2", which softens the HN lock-in line [V: blog] | Cloudflare is shipping fast for agents: Sandbox SDK 1.0 (09-30), Pi Durable `PiHarness` (10-02), OpenCode harness (10-12), persistent browser (10-13), Agent Skills (10-29) [V: CF changelog] |
| **Rivet Actors** | rivet-dev/rivet 6.5k | "very different API … Closer to Cloudflare"; biggest differentiator is "configurable compute"; class + `@Persisted` vs state/actions; method-boundary commits vs Rivet's 1 s throttled saves [V: HN, blog] | Pi Durable for Rivet (10-07), Durable Streams (09-03), **Rivet 3.0 preview (10-26): claims 6.9 ms cold start, single binary on S3** [V: rivet changelog]. Compare Terse's published p95 actor warm-up of 334 ms [V: HN] |
| **denoland/celld** ("self-hosted, distributed Durable Objects") | 6.2k | "a direct port of Durable Objects. We are actually a different API"; durable-write latency argued on HN [V] | The sharpest HN criticism came from a celld proponent ("100ms for a write - not usable for anything beyond toys"). Thomas replied that he wants to "allow you to tweak the durability guarantees" [V] |
| Temporal / Azure / AWS durable functions, Restate | restate 4.6k | "durable actors manages durable state, not durable execution" (Olivier) [V: HN] | Terse's own `little-durable` covers durable workflows |
| Orleans, Dapr, Azure Durable Entities | 10.9k / 26.2k | Closest conceptually ("more similar to cf durable objects or orleans"); Durable Entities "don't support websocket handling" [V: HN] | |
| PartyKit, Liveblocks, Convex | partykit 5.7k, convex 12.8k | Pitched as things you could build on Terse [V: HN] | [I] Convex/Supabase realtime overlap with the "multiplayer state" pitch |

**Open weaknesses the founders acknowledged [V]:** state query across actors ("We actually get this a lot … I think we need something you can set up to sync to a data lake … I really want to nail this part"); write latency (85.6 ms p95 durable write) and the benchmark methodology they still owe; GCP-only self-hosting (an "AWS Support" issue is open).

## 7. Roadmap hints (open issues, posts)

From GitHub open issues and posts [V]: AWS support (#193); "fleet proof support" (#192); export actor host and control-plane logs via OTLP, titled "OLTP" in the issue (#197); observability UI latency (#195); lifecycle revamp (#203); deleting instances (#228); Pi Durable re-awakes and an `expose-pi-durable` npm package (#232, #233); erroring if generated code is used in a frontend (#224); cheaper compaction and faster restores (#330); DST "coming soon"; configurable durability guarantees; data-lake sync for querying. Thomas floated "make it a series? Maybe it becomes a software factory" (10-19).

[I] Their strategic bets are (a) owning the **actor + sandbox + agent harness** stack (Pi Durable, Modal and GKE sandboxes, the `@Resource` decorator for tying a sandbox's lifecycle to an actor), and (b) **observability for agents** (SQLite export, CLI/MCP inspect, o11y UI). A hack that leans on either is on-roadmap and will interest them.

## 8. What the founders publicly want developers to build

Quoted [V]:
- Event page: "build your own Software Factory, long-running agent, multiplayer AI system or something super creative you've been itching to try out." Judges want "either very well-executed products or incredibly creative use cases".
- Thomas, 10-19: "build same scary good agents".
- `@IncTerse` on the Whitechapel game: "Every conversation is a durable Actor. This allows: only one person to be able to talk a time; make the conversation go idle, and when you talk to character again, bring up the history as it was; fan out speech to all characters".
- Thomas, 10-26: "Insane how easy it is once you have all of the right primitives. Sandboxes, pi, Durable Actors".
- Their reference repos show the patterns they care about: multiplayer AI chat (Mastra and OpenAI Agents SDK, i.e. two hackathon sponsors), background coding agents (Open-Inspect), collaborative documents, a voice/talking-agents sync demo, and a multiplayer mystery game.

## 9. What would impress them as judges [all I]

1. **Make the actor do work you can see.** Show the one-at-a-time guarantee live: many agents and humans hitting the same actor with no duplicate work. That is Thomas's origin-story bug. A side-by-side "naive Postgres vs actor" race would land.
2. **Survive a kill.** Kill the process or let the actor go idle mid-demo, then reconnect, and the state and conversation resume. "Durable" is the product name.
3. **Multiplayer and real-time.** Several browsers or phones on one actor over WebSocket with broadcast. That fits the "Real-Time AI" theme and their own examples.
4. **Use their newest features.** `@Compute`/resource decorators (big-RAM actor), `@Resource` with a sandbox, Pi Durable inside an actor, Alarms, the Python SDK, the o11y UI or inspect commands. Founders tend to reward people who validate the latest release.
5. **Pair with Agent Relay** for agent-to-agent messaging, with Durable Actors as shared state or a lock. The event page explicitly gives bonus points for using both.
6. **A software-factory or "tiny Lovable" angle.** Thomas has publicly mused about building exactly this.
7. **Honest DX feedback.** A team this small, shipping 15 releases in a week, will value a clean bug report or PR. Contributing a fix is credible signal.

## Limits / could not verify

- Round size or valuation beyond "Articulate and YC" is not public. Articulate's $500K standard check is the fund's norm, not a Terse-specific figure.
- Judges are still not announced: a live fetch of the event page on 2026-10-29 still reads "Judges will be announced soon". It is unconfirmed whether Thomas, Olivier, or both will judge, and whether any DevRel staff exist (team size is 2).
- X engagement numbers come from third-party mirrors (teapawt, nitter) and may lag. The aboodman tweet linked on the event page could not be fetched.
- The RustGPT "#1 on HN / 3.2k stars" claim is self-reported on thomaskaratzas.com and was not checked.
- HN comments refer to "celld" and link to `denoland/celld`. That repo exists (6.2k stars, "self-hosted, distributed Durable Objects"), but I did not research it further.
- "Terse Cloud" readiness for hackathon-scale load is inferred from issue titles, not tested.
- The YC Launch (launches page) could not be fetched. The founder launch text quoted here is from the YC company page.

## Hackathon implications

**What to build (ranked) [I]:**
1. **Haunted multiplayer AI game or séance.** One Durable Actor per room or "haunted house". Several players join over WebSocket, an LLM ghost/NPC lives in the actor, turn-taking comes from serialized calls, and state persists through idle and reconnect. This mirrors their own Whitechapel demo, fits Halloween and real-time, and is easy to demo live. Add Agent Relay so the NPC agents can coordinate or gossip between rooms for the double bonus.
2. **Agent swarm on shared state ("ghost workers").** N agents (Mastra or OpenAI Agents SDK) split a task through Agent Relay, while a Durable Actor guards the shared ledger or CRM/codebase index. Show that work is never duplicated. This is literally Thomas's founding pain.
3. **Mini software factory or background coding agent.** Actor per session, sandbox via `@Resource` (Freestyle/Superserve could stand in for Modal), Pi Durable inside. Riskier in 5 hours, but it sits on their stated roadmap.

**Gotchas:**
- **Two CLIs and two package names exist.** The README and blog use `bunx durable-actors init` / `import from "durable-actors"`. The hosted docs quickstart uses `bunx terse-cli@latest install`, `terse init`, `terse actor dev` and `import from "terse-sdk/actor"`. Pick one path (the docs quickstart if deploying to Terse Cloud) and don't mix them.
- **Churn:** 15 GitHub releases from 10-22 to 10-29, and terse-cli went 0.14.3 to 0.14.7 in under 19 hours (10-28 21:42 to 10-29 16:37 UTC, npm registry). Pin versions the morning of the event and regenerate clients after every actor change (`terse actor generate`).
- `@Interleave` disables automatic rollback for **all** methods in that class [V: both 10-17 blog posts]. The docs FAQ adds that it applies per method (mark the actual entry point, since decorating a helper does nothing), and that ordinary calls still serialize with each other [V: docs FAQ]. Keep slow LLM calls in a separate actor class, or accept that status calls will block during generation.
- Default idle timeout is 10 s; default resources are 0.25 CPU / 256 MiB [V: docs FAQ]. Store everything that must survive in `@Persisted` fields or SQLite.
- No cross-actor transactions. Use a DB (Supabase) for cross-entity queries. This also gives you a clean story for the Supabase "scale to millions" prize.
- Requires **Bun ≥ 1.4.2**.
- All code must be written at the event. Ideas and setup are fine; pre-written app code is not.

**Before Oct 31:**
- Install Bun 1.4.2+ and run the docs quickstart end to end, including `terse deploy` and creating an API key, so auth and hosted-URL setup isn't burning hackathon time.
- Run one example locally (`ai-chat` or the Mastra example) to learn the WebSocket and broadcast flow, then delete it.
- Have OpenAI API keys ready, and set up a Builderbase account (the Luma listing recommends doing it ahead; the YC page says signup happens at check-in). Teams of up to 4 [V: Builderbase Luma].
- Skim the Agent Relay quickstart (covered elsewhere) so wiring both takes under 30 minutes.

**What judges and sponsors want [I, grounded in §8]:** a live, multi-device demo where the actor's guarantees are visible (serialization, durability, real-time fan-out). Use both Terse and Agent Relay. Use Mastra or OpenAI Agents SDK, since Terse has already published examples for both. A short line in the pitch on why the project needs an actor rather than Postgres plus a WebSocket server will help, because that framing is the founders' own pitch.

## Sources

- https://www.useterse.ai/ (homepage: positioning, founders, investors)
- https://www.ycombinator.com/companies/useterse (YC page: batch, partner, founder bios, launch text)
- https://news.ycombinator.com/item?id=49980399 and https://hacker-news.firebaseio.com/v0/item/49980399.json (Show HN, 2026-10-06)
- https://www.useterse.ai/blog (blog index)
- https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects
- https://www.useterse.ai/blog/terse-vs-rivet-actors
- https://docs.useterse.ai/quickstart, https://docs.useterse.ai/faqs, https://docs.useterse.ai/reference/cli
- https://github.com/TerseAI/durable-actors (README, releases, issues, contributors via `gh`)
- https://github.com/TerseAI/whitechapel, /talkingAgent, /background-agents, /durable-actors-mastra-example, /durable-actors-openai-agents-sdk-python-example, /little-durable
- https://www.npmjs.com/package/terse-sdk, https://registry.npmjs.org/terse-cli, https://registry.npmjs.org/durable-actors
- https://terse.mintlify.app/ and TerseAI/Terse docs (prior workflow product; GitHub repo now unresolvable via `gh`)
- https://thomaskaratzas.com/
- X mirrors: https://teapawt.org/karatzas_thomas/status/2107500256976085230, https://xitter.cf/karatzas_thomas/status/2107872102829502622, https://teapawt.org/karatzas_thomas/status/2108276198564638886, https://teapawt.org/karatzas_thomas/status/2112219511327965403, https://teapawt.org/karatzas_thomas/status/2112273088759132217, https://xitter.cf/karatzas_thomas/status/2107925182103068753, https://nitter.rdrama.net/karatzas_thomas, https://nitter.rdrama.net/IncTerse, https://teapawt.net/oliviersm199
- https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0
- https://linkedin.com/company/terse-inc (mirror text)
- https://www.gpagent.ai/yc/company/useterse, https://mentionfox.com/funding/yc-useterse
- https://f4.fund/firms/articulate, https://app.dealroom.co/companies/articulate_4, https://blog.joinodin.com/p/from-facebooks-early-days-to-a-solo
- https://rivet.dev/changelog/2026-10-26-introducing-rivet-3-0-preview/, https://rivet.dev/changelog/2026-10-07-introducing-pi-durable-for-rivet/, https://rivet.dev/changelog/2026-09-03-durable-streams-now-supports-rivet-actors/
- https://developers.cloudflare.com/changelog/product/agents/, https://developers.cloudflare.com/changelog/post/2026-10-02-pi-harness/, https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/
- https://luma.com/builde-oxba (Builderbase listing: teams up to 4), https://luma.com/yc-meetup-7183-9316f87f
- GitHub star counts via `gh repo view` on 2026-10-29: rivet-dev/rivet, cloudflare/agents, denoland/celld, partykit/partykit, dotnet/orleans, dapr/dapr, restatedev/restate, get-convex/convex-backend

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live sources. Each line gives the claim, the check, and the outcome.

1. **Founders, bios, YC F26, NYC, team of 2, partner Aaron Epstein, Swift/CSV/"insane lock in" founder story.** Re-fetched ycombinator.com/companies/useterse. **Confirmed**, quotes verbatim (including the "there" typo).
2. **Investors "Articulate and Y Combinator (F26)", Terse Cloud managed hosting, Helm self-host.** Re-fetched useterse.ai. **Confirmed.**
3. **Articulate: $10M solo-GP fund, $500K on post-money YC SAFE.** f4.fund. **Confirmed** as the fund's norm. Terse's own round size is still not public.
4. **Commit split 261 / 105 (~374 total).** `gh api .../contributors`: oliviersm199 261, tekaratzas 105, thomas-terse 5, three others with 1 each, 374 total. **Confirmed.**
5. **Repo creation 2026-08-30; npm terse-sdk/terse-cli first published 2026-03-03; durable-actors npm 2026-09-22.** gh + npm registry. **Confirmed.**
6. **Star counts.** gh on 2026-10-29: durable-actors **290** (doc said 279, **corrected**), rivet 6,506, celld 6,174, cloudflare/agents 5,916, restate 4,624, partykit 5,742, convex-backend 12,769, orleans 10,918, dapr 26,169. Everything except Terse **confirmed**.
7. **Show HN 2026-10-06 15:58 UTC, 53 points, 25 comments, by thomask1995.** HN Firebase API. **Confirmed.**
8. **HN quotes** (Swift "nailed the actor model", decorator + "dangerous" things, @sendable, celld "direct port", anilgulecha "100ms for a write - not usable for anything beyond toys", "tweak the durability guarantees", data-lake "really want to nail this part", olism "durable state, not durable execution", Orleans/Durable Entities websocket, RampInspect/OpenInspect/Liveblocks/PartyKit, p95 numbers 85.6 ms / 2.14 ms / 334 ms). Searched the Algolia item JSON. **All confirmed verbatim.** The original typo is "workfloads", now marked [sic].
9. **"128 MiB memory" attributed to HN/blog.** **Not found** in the HN thread or either blog post. It comes from Thomas's 10-06 X reply ("No more crashing at 128MiB"). **Attribution corrected.** Cloudflare's DO limits page says Workers limits apply but does not itself list memory.
10. **0.8.1 release date "~10-20".** `gh release view v0.8.1`: published **2026-10-18**, and it also shipped the `inspect` CLI. **Corrected.**
11. **"About 14 releases" 10-22→10-29.** gh release list shows **15** (v0.9.0 through v0.14.4). **Corrected.** "terse-cli 0.14.3 to 0.14.7 in two days": npm timestamps show **under 19 hours**. **Corrected.**
12. **`@Interleave` disables rollback for all methods in the class.** Both 10-17 blog posts. **Confirmed**, with the per-method FAQ nuance added.
13. **Defaults: 10 s idle, 0.25 CPU / 256 MiB; Bun ≥ 1.4.2; `terse-sdk/actor` import; `bunx terse-cli@latest install`.** docs FAQ + quickstart. **Confirmed.** The blog still uses `bunx durable-actors init` and `from "durable-actors"`, so the two-path gotcha stands.
14. **Rivet 3.0 preview (10-26) 6.9 ms cold start, single binary on S3; Pi Durable for Rivet 10-07; Cloudflare PiHarness 10-02; CF Agent Skills 10-29.** Changelogs. **Confirmed.** **Added** Rivet's 0.69 ms p50 SQLite write figure. Rivet 3.0 is still preview (no multi-region, serverless or ACLs yet).
15. **X posts** (10-06 YC launch ~23.9k views, 10-08 Doom demo, 10-19 hackathon tweet with "build same scary good agents"). teapawt mirror. **Confirmed**: 23,852 views on the launch post. Mirror counts may lag.
16. **Example repos' dates** (whitechapel 10-09, OpenAI Agents Python 10-12, background-agents 10-13, Mastra example 10-14). gh. **Confirmed.** talkingAgent was created **09-08**, so that note was **added**.
17. **Event facts** (judges TBA, iPhone duo / Mac mini / $1K Supabase, Superserve sponsor, Builderbase signup at check-in). Live Firecrawl fetch of events.ycombinator.com/haunted-hacks-2026 (maxAge 0). **Confirmed**, and judges are **still not announced**.

Not re-checked on this pass and left as-is: the thomaskaratzas.com RustGPT claims, the Dealroom and LinkedIn mirrors, the mentionfox directory date, the Olivier SF-popup tweet, and the Builderbase Luma "teams up to 4" listing.
