# Durable execution and actor runtimes for stateful AI agents: where Terse sits

Checked **29 October 2026** for Haunted Hacks (Sat 31 Oct 2026, SF, 11:00 to 16:00 build window). Scope: Rivet Actors, Restate, Temporal, Inngest, Trigger.dev, DBOS, and the classic virtual-actor runtimes (Orleans, Akka, Dapr), compared against Terse Durable Actors. Method: live `gh api` calls for stars, licences and releases (all numbers are as of 29 Oct); release notes read through `gh`; vendor blogs and changelogs fetched with Exa; HN stories since 1 Aug 2026 pulled through the Algolia API. Terse facts come from the sibling files in `../terse/`, which were checked against primary sources on the same day.

Legend: **[V]** means I read it in a primary source. **[I]** is my inference. **[BG]** is background dated before Aug 2026. Vendor performance numbers are vendor claims; none were reproduced here.

---

## TL;DR

- **There are two families, and Terse is in the smaller one.** *Durable execution* engines (Temporal, Restate, Inngest, Trigger.dev, DBOS) journal each step of a function so a crashed run resumes where it stopped. *Durable actor / virtual actor* runtimes (Rivet, Cloudflare DO, Orleans, Akka entities, Dapr actors, Terse) give each entity an identity, private state and a one-at-a-time mailbox. Terse's own co-founder draws the line this way on HN: "durable actors manages durable state, not durable execution" [V][T4]. Restate (Virtual Objects) and Rivet (Actors plus Workflows plus Pi Durable) are the two products that span both families.
- **The money and the news in Aug to Oct 2026 went to durable execution.** Temporal raised a $550M Series E at $12.55B on 14 Sep, co-led by Lightspeed [V][1]. Restate raised a $20M Series A on 30 Sep and named Replit Agent as a customer [V][7]. Inngest shipped microVM Sandboxes as durable steps on 6 Oct [V][10]. Trigger.dev shipped Slack and Linear agents plus hosted webhooks for `chat.agent` (v4.8.0, 23 Oct) [V][12]. DBOS shipped Supabase Edge Functions support (Sep) and claims 1M workflows/s on sharded Postgres (Oct) [V][14][15]. Every one of them now markets itself as agent infrastructure.
- **Rivet is Terse's direct competitor, and it is far ahead.** Rivet has 6,507 stars and an Apache-2.0 licence, against Terse's 291 stars and MIT (re-checked late 29 Oct PT) [V][gh]. It shipped Pi Durable on 7 Oct and a 3.0 preview on 26 Oct claiming 6.9 ms cold starts, 72 KB per actor and S3 as its only dependency [V][4][5]. Terse wins on a few things: configurable CPU/RAM per actor class, calls serialized across `await` by default, and class/decorator ergonomics [V][T1][T5].
- **Old virtual-actor runtimes are now pitching AI agents too.** The Orleans scenarios doc lists "AI agents and conversational sessions" as its first scenario [V][18] (the "updated Aug 2026" date is unverified). Dapr 1.19 (22 Oct) added an alpha MCP server and moved actor placement into its Scheduler [V][gh]. Akka launched an `AutonomousAgent` component in May [BG][20]. All three are JVM/.NET/K8s-heavy. **None is a realistic choice for a 5-hour TypeScript hackathon.**
- **Hackathon takeaway [I]:** do not bring a second durability engine. Pitch Terse as the per-agent "home" (identity, state, mailbox, sockets), let Agent Relay carry agent-to-agent messages, and borrow durable-execution *patterns* (idempotent request IDs, intent-then-effect-then-commit, resumable streams) inside actor methods. Judges are likely to ask "why not Temporal or Rivet?", so prepare a one-sentence answer for each.

---

## 1. The landscape at a glance (verified 29 Oct unless marked)

| Product | Family | Per-agent state primitive | Concurrency per agent | Realtime to browser | Licence (server) | GitHub stars | Latest release |
|---|---|---|---|---|---|---|---|
| **Terse Durable Actors** | Actor | Actor class, `@Persisted` fields + per-actor SQLite | Serialized across `await` by default; `@Interleave` opt-out | Native WebSockets held at a gateway while actor sleeps | MIT | 291 | v0.14.4, 29 Oct |
| **Rivet** | Actor (+ workflows) | `actor({state, actions})` + per-actor SQLite/KV | One actor per key; state saves throttled (1 s default) per Terse's reading [T6] | Native WebSockets, events, React hooks | Apache-2.0 | 6,507 | v3.0.0-preview.4, 29 Oct |
| **Restate** | Durable execution + keyed objects | Virtual Object keyed K/V (`ctx.get/set`) | One write handler per key at a time; others queue durably | Not a core primitive [I] | BSL 1.1 | 4,624 | v1.8.1 (21 Oct), v1.7.14 (22 Oct) |
| **Temporal** | Durable execution | Workflow state ("Entity Workflow" pattern) | Per-workflow deterministic replay | Workflow Streams, public preview since May [BG] | MIT | 24,076 | server v1.32.1 (8 Oct); TS SDK v1.25.0 (27 Oct) |
| **Inngest** | Durable execution (step functions) | Step memoization; no keyed entity | Flow control (concurrency, bursty) | Built-in realtime channels, `useRealtime`, `useAgent` | SSPL with Apache-2.0 future licence | 6,000 | v1.49.0 (23 Oct); 1.50.0-beta.1 (28 Oct) |
| **Trigger.dev** | Durable execution (tasks) | `chat.agent` durable sessions | Per run/session | Realtime streams; chat survives refresh | Apache-2.0 | 16,658 | v4.8.2, 29 Oct |
| **DBOS** | Durable execution (library on Postgres) | Workflow checkpoints in your Postgres | Per workflow; queues | Durable streams (Vercel AI SDK integration) | MIT | 1,656 (py) / 1,421 (ts) | py 3.4.0 / ts v5.4, 28 Oct |
| **Orleans** | Virtual actor (.NET) | Grain + storage provider | Turn-based, one request at a time by default | Response streaming during an invocation | MIT | 10,918 | v10.4.2, 30 Oct (UTC) |
| **Akka** | Actor/entities (JVM) | Key-value or event-sourced entity, one instance cluster-wide | One command at a time | Akka Streaming | BSL 1.1 | 13,283 | v2.10.24, 9 Oct |
| **Dapr** | Virtual actor sidecar (+ workflows) | Actor state in 30+ stores | Turn-based actors | Not a core primitive [I] | Apache-2.0 | 26,169 (+768 dapr-agents) | v1.19.0 (22 Oct); dapr-agents v1.1.0 (27 Oct) |

Sources: `gh api repos/...` for stars, licence field and releases [gh]. I read the LICENSE files directly for Restate (BSL 1.1 with a "Public Restate Platform Service" restriction), Akka (BSL 1.1, Lightbend) and Inngest (SSPL 1.0 with an "Apache 2.0 Future License" header), because the GitHub API reports `NOASSERTION` for all three [V].

---

## 2. Product by product

### 2.1 Rivet Actors (rivet-dev/rivet, YC W23): the closest analogue

**What it offers for stateful agents [V][6]:** "Create one Actor per agent, per session, per user, or per tenant." Each actor gets durable state, its own SQLite database, a queue, realtime connections, and cron/self-scheduling, all addressed by key. Actors run on plain Node.js, Bun or Rust and connect to the control plane over WebSocket. The README lists five actor types: Actors, Agents, Workflows ("replay instead of starting over"), Sandboxes (agentOS) and Dynamic Apps (preview). Rivet positions itself explicitly as an "open-source alternative to Cloudflare Durable Objects", with no 128 MB cap and bottomless storage [V][6].

**Company:** YC W23; originally pitched in 2023 as "Heroku for multiplayer games", now "the orchestrator for agentic workloads" [V][6b].

**Recent news (all Aug to Oct 2026) [V]:**
- **1 Oct, Pi 1.0 for Rivet; 7 Oct, Pi Durable for Rivet.** `pi()` runs Earendil's Pi Durable harness in an actor. "Every model request and tool call is checkpointed to SQLite", at about 1.3 MB of RAM per session. A `requestId` gives "exactly-once input", and any number of clients can watch one conversation live (multiplayer streaming). Pi Durable is labelled beta [4].
- **5 Oct blog post:** Rivet replaced NATS with S3 as part of the 3.0 work [3].
- **12 Oct:** agentOS 0.4 and Hosted VMs, plus a Rivet MCP for Claude Code, Codex and Cursor (blog index) [2]. I could not fetch the agentOS 0.4 post itself.
- **26 Oct, Rivet 3.0 preview on the "WarpDrive" storage engine** [5]. Vendor claims: SQLite write 0.69 ms p50; new-actor cold start 6.9 ms; wake from SSD about 5 ms; wake from S3 689 ms p50 for a 47 MiB database. "3.0 requires no code changes" from 2.x. **Not yet in 3.0:** multi-region, serverless and ACLs. A third-party tracker reports about 47K views for the launch post on X (unverified; I could not confirm the view count at the source) [5b]. The GitHub tags are v3.0.0-preview.2 (26 Oct) through preview.4 (29 Oct), with v2.3.31 still shipping in parallel (27 Oct) [V][gh].

**Relative to Terse [V][T6]:** Terse's own 17 Oct comparison post frames the difference as classes plus `@Persisted` against Rivet's state/actions, and method-boundary commits against Rivet's "throttled" saves (1 s default, with `c.saveState({immediate:true})` to wait). The post also notes Terse's self-hosting doc covers GCP only, while Rivet documents managed, own-worker, BYOC and self-host options. Note a conflict: the current Terse TS reference says writes are saved "as it happens", not at method boundaries [T1]. The Rivet README separately claims a 4.37 ms p50 wake from hibernation and a 6.92 ms p50 cold start, both its own benchmarks [V][6]. **[I]** Rivet has caught up on Terse's "agent fleets" story (Pi Durable, agentOS sandboxes, MCP) and has a broader product. Terse's defensible points are per-class compute sizing (`@Compute`), serialize-by-default semantics, and a smaller, more opinionated API.

### 2.2 Restate: durable execution with actor-like Virtual Objects

**What it offers [V][8]:** a single-binary server that sits in front of your handlers "like a proxy" and journals every step. For agents, the relevant primitive is the **Virtual Object**: keyed state that "survives crashes and restarts", is isolated per key, and allows "only one write handler [to run] at a time per key", with concurrent requests to the same key queued durably. Restate's docs ship session examples for Vercel AI, OpenAI Agents, Google ADK, Pydantic AI and LangChain. LLM responses are persisted through `durableCalls(ctx)` middleware, so a recovery does not re-pay for model calls [V][8]. **[I]** Conceptually this is the nearest thing to a Terse actor in the durable-execution family, but Restate uses push-based HTTP invocation and has no native client WebSockets.

**Recent news [V]:**
- **30 Sep, $20M Series A** (Singular lead; Redpoint, Capital One Ventures; $27M total per TNW). Ahmed Farghal (ex-Stripe, Meta) joined as fourth co-founder. Customers named: Replit Agent (its new design uses "over 10 times as many durable actions"), DOSS, Bilt Rewards [7][7b]. On the Temporal funding HN thread, Restate co-founder `sewen` wrote that "Replit migrated their whole coding agent from Temporal over to Restate" [V][HN1].
- **14 Oct, Restate 1.8** [9]: the VQueues scheduler is now on by default (flow control by scope and limit key). The CLI was rebuilt "for Scripts, CI and AI Agents" (`--json`, `--dry-run`). Service protocol v7 is now the default. Breaking change: protocol v3 and older are rejected.
- Earlier [BG]: BYOC (7 Jul), and "Agent checkpointing is far from production-grade resiliency" (15 Jun) [7c].

### 2.3 Temporal: the incumbent

**What it offers [V]:** deterministic workflow replay. Model calls run as Activities, so they "retry durably and are not repeated during Workflow replay" [V][1c]. The OpenAI Agents SDK integration has been GA since 23 Mar 2026, in Python and TypeScript [BG][1c]. **Workflow Streams** (token streaming over Signals and Updates) has been in public preview since Replay in May [BG][1b]. OpenAI's growth on Temporal is also quoted in the 14 Sep funding post ("60-fold in under a year") [V][1]; the earlier Replay talk citation [1d] was not re-checked (unverified).

**Recent news [V]:**
- **14 Sep, $550M Series E at $12.55B** (co-led by Lightspeed, with Wellington, Goldman Sachs Alternatives and Tiger Global). The post claims 1.9 trillion billable actions in August, more than 4,300 paying customers, a team of 570, and that "OpenAI's use of Temporal has grown 60-fold in under a year" [V][1]. The HN thread had 84 points and 62 comments; one comment asks "why people prefer temporal over something like https://restate.dev ?", which drew replies from Restate and Temporal co-founders [V][HN1].
- **30 Sep digest:** Standalone Activities GA, Rust SDK GA, and **no monthly base fee on Temporal Cloud** plus $150 in credits for the first 90 days [1e].
- **6 Oct:** the Oso team joined Temporal to work on agent authorization [1f]. **8 Oct:** "The immortal life of Pi", running the Pi coding agent on Temporal workers, which explicitly contrasts with Pi Durable's single-process SQLite ownership [1g]. **13 Oct:** AWS partnership update, with Serverless Workers on Lambda in public preview [1h].

### 2.4 Inngest: event-driven step functions plus realtime

**What it offers [V][10][11]:** `step.run` memoization, `step.waitForEvent` / `waitForSignal` for human-in-the-loop, and `step.ai.infer`. Realtime has been first-class in the TS SDK since March 2026 [BG]. AgentKit adds `useAgent` / `useChat` hooks [BG]. A third-party Oct 15 explainer quotes the docs' warning that `inngest.realtime.publish()` "isn't memoized", so a UI should tolerate repeated tokens after a retry [V][11]. There is **no keyed-entity primitive**. Per-agent serialization comes from concurrency keys [I: from my background knowledge of Inngest, not re-verified today].

**Recent news [V]:** Sep: Replit Agent 3 uses Inngest for user-built agents, and official Claude Code / Codex plugins shipped [11b]. **6 Oct:** Sandboxes public beta (`step.sandbox.create`, microVMs, under a second to start; CPU $0.000011/s plus RAM $0.000003/GB-s; 1/2/4 vCPU sizes; one hour active runtime each; **Pro plan and above, TS SDK `inngest` >= 4.21.1, via `inngest/experimental`**) and bursty concurrency (3x the account limit for up to 60 min a month, Pro and above) [V][10]. **21 to 23 Oct:** v1.47 to v1.49 added replays and function resume through the API, CLI and MCP [gh].

### 2.5 Trigger.dev: durable chat agents as a product surface

**What it offers [V][12]:** `chat.agent` durable sessions that "survive refreshes and resume if the connection drops mid-turn", with realtime streams, approvals and sub-agents.

**Recent news [V]:** 5 Oct, "Ask Trigger", their own dashboard agent built on `chat.agent` [12c]. 6 Oct, v4.7.3: session creation now needs explicit trigger permissions (breaking). **23 Oct, v4.8.0:** hosted webhooks and native Slack and Linear agents, where each thread is a durable session [12]. **29 Oct, v4.8.2:** a `bun-1.4` runtime, an experimental Convex component, and sub-agent streaming via `chat.forwardSubAgent` [12b]. Release cadence is several a week [gh].

### 2.6 DBOS: durable workflows as a Postgres library

**What it offers [V][13][14]:** no separate orchestrator. Checkpoints live in your own Postgres. Integrations include Pydantic AI, OpenAI Agents SDK, LlamaIndex and Google ADK in Python, and the Vercel AI SDK in TS [V][13b].

**Recent news [V]:** **Sep:** Python 3.0 / TS 5.0 (schema split), improved Vercel AI SDK support (durable streams, durable tools, sub-agents as child workflows), and **Supabase Edge Functions support** (a DBOS worker in an Edge Function, started by `pg_cron`) [14]. **9 Oct:** a Stonebraker essay, "Applications are Dead. Long Live Workflows" [13c]. **29 Oct:** workflow rewind to any step, ownership tokens against "zombie" executors, and a commercial Enterprise Extension with sharded Postgres "linear scaling to over 1 million workflows per second" (vendor benchmark) [15].

### 2.7 Orleans, Akka, Dapr: the virtual-actor lineage

- **Orleans (Microsoft, .NET):** the virtual-actor originator. Its scenarios doc (last-updated date unverified) leads with AI agent sessions as grains that "process turns one at a time by default" and stream tokens during a live invocation [V][18]. **v10.4.0 (3 Oct):** SQLite persistence fixes under contention, and expanded preview "journaling and Durable Jobs" [V][gh]. Microsoft's durable agent story mostly runs through the **Agent Framework Durable Extension** on Durable Task entities, not Orleans [V][19].
- **Akka (Lightbend, JVM, BSL 1.1):** key-value entities with "exactly one instance of each entity across the whole cluster" [V][20b]. `AutonomousAgent` launched 27 May [BG][20], and Manulife adopted Akka in March [BG]. In-window activity: only core patch releases (2.10.22 to 2.10.24) [gh]. I found no Aug to Oct agent launch.
- **Dapr (CNCF):** Dapr Agents builds on Dapr Workflows, "which leverage Dapr's virtual actors underneath" [BG][21]. Dapr Agents 1.0 went GA in March [BG]. **Dapr 1.19 (22 Oct):** up to 40% higher workflow throughput (nightly tests), multi-app workflows, actor placement in the Scheduler (opt-in), and an alpha **Dapr MCP server** [V][gh]. dapr-agents v1.1.0 shipped 27 Oct [gh].

### 2.8 Related signals (in window)

- HN: "Celld: Self-hosted, distributed Durable Objects" got 286 points (5 Aug). "Open Source Durable Objects for Postgres" got 41 (8 Sep). Terse's "Show HN: Durable Actors" got 53 points and 25 comments (6 Oct). "Durable execution without history replay" got 41 points (9 Sep). "Show HN: Durable Actor Session Protocol" got 18 (28 Sep) [V][HN]. **[I]** The "OSS Durable Objects" niche filled up fast in Aug to Oct, so Terse is differentiating inside a crowded category.
- The sponsor Mastra already ships Inngest and Temporal workflow runners and a `createInngestAgent` [V][M]. **[I]** That is a possible conflict point if a team uses Mastra's durable agents alongside Terse.

---

## 3. Where Terse sits

**Position map [I, grounded in §1 and §2]:**

```
                 durable STATE (entity/actor)                durable EXECUTION (journal)
 heavy/enterprise   Orleans · Akka entities · Dapr actors     Temporal · Dapr Workflows
 lightweight/dev    Rivet · Cloudflare DO · celld · Terse     Restate (Virtual Objects bridge) · Inngest · Trigger.dev · DBOS
```

**What Terse uniquely claims [V][T1][T5]:**
1. Calls are **serialized across `await` by default**. Rivet, DO and Orleans have different defaults. Orleans is turn-based but interleaves at awaits only with reentrancy enabled [BG, my background knowledge].
2. **Per-class compute sizing** via `@Compute` (CPU/RAM/region). Terse co-founder `thomask1995` called configurable compute "our biggest differentiator" when asked to compare with Rivet on the Show HN thread [V][HN]. (Correction: this is from HN, not from the 17 Oct comparison post, whose at-a-glance table does not list compute sizing.)
3. Actor-owned sandboxes through `@Resource`, plus the `observe/state` API, which reads a snapshot without waking the actor [T1].

**Where it is weaker [V]:**
- Ecosystem: 291 stars against Rivet's 6.5k [gh].
- No journal: an LLM call in flight during a crash is simply lost, and `@Interleave` disables rollback for the whole class [T1].
- Self-hosting docs cover GCP only [T6].
- Hosted quota defaults: 500 active actors per project and 50 starts/s [T1].
- Benchmarks: Terse's Show HN post lists p95 numbers of 85.6 ms durable write, 2.14 ms stateful read and 334 ms actor warm-up [V][HN]. Rivet claims 0.69 ms p50 SQLite write (3.0 preview) and 4.37 ms p50 wake [V][5][6]. Different percentiles, setups and durability guarantees, so these are **not comparable**, but expect a judge to have seen the HN thread, where one commenter called ~100 ms writes "not usable for anything beyond toys" and pointed to celld's ~1 ms writes [V][HN].

**[I] The honest one-liner for judges:** "Temporal and Restate make a *function* finish. Terse makes an *agent* exist: one addressable thing with its own state, compute and live sockets, which other agents (through Agent Relay) and humans can talk to."

---

## 4. Patterns worth borrowing inside a Terse actor [I]

All of these are design ideas, and all code must be written at the event.

| Pattern | Seen in | How it maps to Terse |
|---|---|---|
| Idempotent `requestId` on every inbound prompt | Pi Durable on Rivet [4], Terse invoke API `requestId` [T1] | Store processed IDs in a `@Persisted` set or SQLite table; return the cached result on a duplicate |
| Intent, then effect, then commit ("effect sandwich") | Pi Durable, as described by Temporal [1g] | Persist `{phase:"calling_llm", reqId}` before the call and the result after; on wake or alarm, resume any job still in a pending phase |
| Resumable token stream with offsets | DBOS durable streams [14], Trigger.dev chat [12], Mastra `observe` [M] | Append chunks to actor SQLite and broadcast over the socket; reconnecting clients replay from an offset |
| Human approval as a durable wait | Temporal, Restate durable promises [8], Inngest `waitForEvent` [11] | Store a pending approval and set an alarm for the timeout; the approve method resolves it |
| One write at a time, many reads | Restate shared vs exclusive handlers [8] | Keep mutations serialized and serve reads from `observe/state` or a separate method |

---

## 5. Limits / could not verify

- Vendor performance claims (Rivet's 6.9 ms and 0.69 ms, DBOS's 1M workflows/s, Dapr's +40%) were **not reproduced**. Cross-vendor numbers use different hardware and methods.
- I did not run any of these SDKs. The concurrency semantics come from docs and vendor posts. Rivet's save-throttle behaviour is as described by **Terse's** comparison post, which I did not cross-check against Rivet's docs.
- The Rivet agentOS 0.4 post (12 Oct) returned CRAWL_NOT_FOUND. I only have its title from the blog index.
- Inngest's per-key concurrency and singleton details, and Orleans reentrancy defaults, come from my background knowledge, not from a page read today.
- No Akka agent news surfaced in Aug to Oct beyond patch releases. That absence of evidence is not proof of inactivity.
- There is no social-sentiment sweep (the last30days skill was not run) because this angle is product and technical. HN coverage relies on Algolia keyword search, which misses posts whose titles don't contain the keyword (for example, the Restate funding post did not surface).
- Star counts move daily. Terse showed 279 in earlier research, 290 at the first check and 291 at re-verification.

---

## 6. Hackathon implications

**What to build [I]:**
- **One Terse actor per agent and per shared world object, with Agent Relay between agents.** Example: a "haunted house" game master actor plus N ghost-agent actors. Each ghost's memory and mood are `@Persisted`, and they whisper through Agent Relay while players connect over actor WebSockets. This fits both tracks, and it is a "multiplayer AI system", which the event page explicitly asks for.
- **Make durability visible.** On stage, `kill -9` the dev server mid-turn. On restart, show that (a) persisted state survived and (b) the interrupted LLM call resumed because you stored a pending phase and an alarm picked it up. Point (b) is the answer to the "Terse isn't durable execution" critique raised on its own HN thread [T4].
- **Don't add Temporal, Restate, Inngest, Trigger.dev or DBOS.** They would compete with Terse for the "durability" credit, add setup time, and none is a sponsor. If you use Mastra, avoid its Inngest/Temporal runners for the same reason.

**Gotchas carried over from the landscape:**
- LLM calls inside a default (serialized) Terse method block the mailbox. With `@Interleave` you lose rollback, so use the intent-then-effect-then-commit pattern explicitly [T1].
- Tokens published outside a durable step can repeat after a retry (Inngest says this outright [11], and the same logic applies to a Terse broadcast before a crash). Make the client dedupe on chunk index.
- Don't lead the pitch with latency. Terse's own published p95 durable write is 85.6 ms, and its Show HN thread already drew a "not usable for anything beyond toys" comment against celld and Rivet numbers [HN]. Lead with semantics (serialize-by-default, per-class compute, sockets) instead, and keep per-token writes off the durable path: buffer them in memory and persist at turn boundaries.
- Rivet's API looks similar but is not the same. Do not paste RivetKit snippets (`actor({state, actions})`, `c.state`) into a Terse project [T6].

**Setup before 31 Oct (planning only, no code):**
- Write a 3-row "why not X" card: **Temporal/Restate** (they make a function finish; we need an addressable agent with live sockets), **Rivet** (same family; we use Terse for serialize-by-default and per-agent compute sizing), **Cloudflare DO** (lock-in and the 128 MB cap, in Terse's own framing [T5]).
- Skim Terse's two comparison posts [T6] so the pitch uses the hosts' vocabulary.
- Pre-sketch the state schema: which fields are `@Persisted`, which go in SQLite, the pending-job table, and the request-ID table.

**What judges and sponsors likely want [I]:**
- **Terse:** visible use of its distinctive primitives (persisted fields, serialized calls, sockets, alarms, `@Compute`/`@Resource`) on hosted Terse, plus a crisp contrast with Rivet and DO.
- **Supabase "scale to millions":** the story is that sharding is natural per actor, with Supabase Postgres holding cross-actor queries and history. DBOS's sharded-Postgres claim [15] shows the "shard by entity key" argument is current, but cite it as an analogy only.
- **Grand prize:** a creative, working multiplayer or long-running agent demo. The recent agent-infra launches (Rivet Pi Durable, Trigger.dev Slack/Linear agents) suggest "agents that live in the places people already are" is the zeitgeist.

---

## Sources

Terse internal (checked 29 Oct, primary sources cited inside):
- [T1] `../terse/01-docs-api.md` · [T4] `../terse/04-social-pulse.md` (includes the HN Show thread https://news.ycombinator.com/item?id=49980399) · [T5] `../terse/05-team-strategy.md`
- [T6] https://www.useterse.ai/blog/terse-vs-rivet-actors (17 Oct 2026)
- [M] `../mastra/01-docs-api.md`, `../mastra/02-newest-features.md`, `../mastra/03-github-code.md`

GitHub (live `gh api`, 29 Oct) [gh]: https://github.com/rivet-dev/rivet · https://github.com/restatedev/restate · https://github.com/temporalio/temporal · https://github.com/temporalio/sdk-typescript · https://github.com/inngest/inngest · https://github.com/triggerdotdev/trigger.dev · https://github.com/dbos-inc/dbos-transact-py · https://github.com/dbos-inc/dbos-transact-ts · https://github.com/dotnet/orleans · https://github.com/akka/akka-core · https://github.com/dapr/dapr · https://github.com/dapr/dapr-agents · https://github.com/TerseAI/durable-actors · https://github.com/TerseAI/little-durable · Release pages: https://github.com/dapr/dapr/releases/tag/v1.19.0 · https://github.com/restatedev/restate/releases/tag/v1.8.0 · https://github.com/dotnet/orleans/releases/tag/v10.4.0

Temporal:
- [1] https://temporal.io/blog/temporal-raises-usd550m-series-e-at-usd12-55b-valuation-ai (14 Sep) · Reuters: https://www.reuters.com/business/temporals-valuation-spikes-126-billion-lightspeed-led-funding-round-2026-09-14/
- [1b] https://temporal.io/blog/replay-2026-product-announcements (6 May) [BG] · [1c] https://docs.temporal.io/develop/typescript/integrations/openai-agents ; https://temporal.io/blog/announcing-openai-agents-sdk-integration · [1d] https://www.youtube.com/watch?v=BxEB7Y2U9oU [BG]
- [1e] https://temporal.io/blog/durable-digest-september-2026 · [1f] https://temporal.io/blog/oso-security-joins-temporal-accelerate-ai-agent-security · [1g] https://temporal.io/blog/the-immortal-life-of-pi-running-the-pi-coding-agent-on-temporal · [1h] https://temporal.io/blog/temporal-and-aws-a-partnership-built-for-production-grade-ai

Rivet:
- [2] https://rivet.dev/blog/ · [6b] https://www.ycombinator.com/companies/rivet · [3] https://rivet.dev/blog/2026-10-04-replacing-our-message-broker-with-s3/ · [4] https://rivet.dev/changelog/2026-10-07-introducing-pi-durable-for-rivet/ · [5] https://rivet.dev/changelog/2026-10-26-introducing-rivet-3-0-preview/ · [5b] https://www.launchvideo.com/directory/rivet · [6] https://github.com/rivet-dev/rivet (README, 28 Oct)

Restate:
- [7] https://techcrunch.com/2026/09/30/restate-lands-20m-as-the-need-for-durable-infrastructure-increases-with-ai-agents/ · [7b] https://thenextweb.com/news/restate-20m-series-a-singular-durable-execution-ai-agents · [7c] https://www.plushcap.com/companies/restate/blog/2026
- [8] https://docs.restate.dev/ai/patterns/sessions ; https://docs.restate.dev/ai/patterns/durable-agents ; https://restate.dev/blog/durable-ai-loops-fault-tolerance-across-frameworks-and-without-handcuffs
- [9] https://www.plushcap.com/companies/restate/blog/summaries/2026/10 (summary of "Restate 1.8: Mind the Queue")

Inngest:
- [10] https://www.inngest.com/changelog · https://www.inngest.com/blog/category/product-updates · [11] https://cadenya.com/other-content/inngest-agentkit-for-ai-agents (third party, 15 Oct) · [11b] https://daily.dev/posts/announcing-inngest-replit-vibe-code-your-agents-b4tdqx4wx ; https://daily.dev/posts/inngest-meet-your-coding-agent-x8plhb5se

Trigger.dev:
- [12] https://trigger.dev/changelog/v4-8-0 · [12b] https://trigger.dev/changelog/v4-8-2 · [12c] https://trigger.dev/changelog/dashboard-agent-beta · https://trigger.dev/changelog/v4-7-3

DBOS:
- [13b] https://www.bayis.co.uk/library/112-dbos.html (third party) ; https://pydantic.dev/docs/ai/capabilities/durable_execution/dbos · [13c] https://www.dbos.dev/blog/applications-are-dead-long-live-workflows · [14] https://www.dbos.dev/blog/whats-new-in-dbos-september-2026 · [15] https://www.dbos.dev/blog/whats-new-in-dbos-october-2026

Virtual actors:
- [18] https://dotnet.github.io/orleans/docs/scenarios/ ; https://dotnet.github.io/orleans/docs/overview/ · [19] https://learn.microsoft.com/en-us/agent-framework/hosting/durable-extension · [20] https://akka.io/blog/the-autonomous-operating-environment [BG] · [20b] https://akka.io/platform/overview · [21] https://www.cncf.io/blog/2025/03/12/announcing-dapr-ai-agents/ [BG] ; https://www.cncf.io/announcements/2026/03/23/general-availability-of-dapr-agents-delivers-production-reliability-for-enterprise-ai/ [BG]

HN (Algolia API, stories since 1 Aug 2026) [HN]:
- [HN1] https://news.ycombinator.com/item?id=49696335 · https://news.ycombinator.com/item?id=49185430 · https://news.ycombinator.com/item?id=49612223 · https://news.ycombinator.com/item?id=49980399 · https://news.ycombinator.com/item?id=49635621 · https://news.ycombinator.com/item?id=49877270 · https://news.ycombinator.com/item?id=50011940

---

## Verification log (2026-10-29)

Adversarial re-check, run late on 29 Oct PT. Method: `gh api` (repos, releases, LICENSE files, README), HN Firebase and Algolia item APIs (scores, comment text), Exa fetch of primary pages. Each claim was checked by trying to refute it.

| # | Claim checked | Source used | Outcome |
|---|---|---|---|
| 1 | Star counts and licences for all 12 repos in §1 | `gh api repos/...` | **Confirmed, with small drift.** Rivet 6,507 (was 6,506), Terse 291 (was 290), DBOS-ts 1,422 (was 1,421), Temporal 24,077 (was 24,076). All others matched exactly. Restate, Inngest and Akka report `NOASSERTION`; LICENSE files re-read: Restate BSL 1.1 with the "Public Restate Platform Service" restriction, Inngest SSPL 1.0 plus an "Apache 2.0 Future License" header. Updated Rivet and Terse figures in place. |
| 2 | Latest-release column (tags and dates) | `gh api .../releases` | **Confirmed** for all 11 repos checked (Terse v0.14.4, Rivet v3.0.0-preview.4, Restate v1.8.1/v1.7.14, Temporal v1.32.1 plus TS SDK v1.25.0, Inngest v1.49.0/v1.50.0-beta.1, Trigger v4.8.2, DBOS 3.4.0/v5.4, Orleans v10.4.2, Akka v2.10.24, Dapr v1.19.0, dapr-agents v1.1.0). |
| 3 | Temporal $550M Series E at $12.55B on 14 Sep, "Lightspeed lead", 1.9T actions, 4,300 customers | temporal.io funding post | **Mostly confirmed; corrected.** The round was *co-led* by Lightspeed. Added the post's own "60-fold in under a year" OpenAI quote, which replaces the weaker Replay-video citation (the video itself is unverified). |
| 4 | Temporal Sep digest: no monthly base fee, $150 credits, Rust SDK and Standalone Activities GA | temporal.io durable-digest-september-2026 | **Confirmed.** |
| 5 | Restate $20M Series A, 30 Sep; Singular lead; Redpoint, Capital One; $27M total; Replit, DOSS, Bilt; "over 10 times as many durable actions" | TechCrunch (30 Sep), TNW (1 Oct) | **Confirmed.** "$27M total" and the 10x line come from TNW, not TechCrunch. Added the fourth co-founder and the Replit migrated-from-Temporal HN comment. |
| 6 | Restate 1.8 (14 Oct): VQueues on by default, CLI for scripts/CI/agents, protocol v7 default, v3 and older rejected | GitHub release v1.8.0 | **Confirmed** against the primary release notes; the plushcap summary [9] is no longer the only source. |
| 7 | Rivet 3.0 preview (26 Oct): 6.9 ms cold start, 72 KB per actor, S3 only dependency, 0.69 ms p50 write, 689 ms S3 wake, no code changes, no multi-region/serverless/ACLs yet | rivet.dev changelog | **Confirmed** word for word. |
| 8 | Rivet "~47K views on X" | third-party tracker [5b] | **Unverified.** Could not check at the source; marked as such. |
| 9 | Pi Durable (7 Oct): SQLite checkpoints, ~1.3 MB per session, `requestId` exactly-once, multiplayer streaming, beta | rivet.dev changelog | **Confirmed.** |
| 10 | Rivet is YC W23; "open-source alternative to Cloudflare DO", no 128 MB cap; 4.4 ms wake | YC company page; Rivet README | **Confirmed** (README: 4.37 ms p50 wake, 6.92 ms p50 cold start). |
| 11 | Terse co-founder HN quote "durable actors manages durable state, not durable execution" | HN Algolia item 49980399 | **Confirmed.** Written by `olism` (Olivier) and reposted by `thomask1995` because the original was suppressed. |
| 12 | Terse comparison post calls `@Compute` its biggest differentiator vs Rivet | useterse.ai/blog/terse-vs-rivet-actors; HN thread | **Misattributed; corrected.** The "biggest differentiator is the configurable compute" line is `thomask1995` on HN. The 17 Oct post's table covers API style, save boundary, SQLite, typed client and deployment, and does not mention compute. The post's other claims checked here (Rivet 1 s throttled saves, `saveState({immediate:true})`, GCP-only Terse self-host doc, `@Interleave` disables rollback for the class) are **confirmed**. |
| 13 | Terse HN p95 warm-up 334 ms | Show HN post body | **Confirmed.** Added the other two p95 numbers from the same post (85.6 ms durable write, 2.14 ms read) and the "not usable beyond toys" critique from the thread. |
| 14 | HN scores: Temporal 84, Celld 286, OSS DO for Postgres 41, Terse Show HN 53 pts / 25 comments, durable exec w/o replay 41, DASP 18 | HN Firebase API | **Confirmed**, dates too. "Immortal life of Pi" got 15 points. The Temporal-thread comment was described as a "top comment"; ranking unverified, so it is now "one comment", quoted exactly. |
| 15 | Inngest Sandboxes and bursty concurrency (6 Oct), with pricing | inngest.com/changelog | **Confirmed but incomplete.** Added the RAM price, sizes, 1 h runtime cap, and the **Pro-and-above** and `inngest >= 4.21.1` requirements. |
| 16 | Trigger.dev v4.8.0 (23 Oct) hosted webhooks plus Slack/Linear agents; v4.8.2 bun-1.4, Convex, `chat.forwardSubAgent` | trigger.dev changelog; GitHub release | **Confirmed.** |
| 17 | DBOS Sep (Supabase Edge Functions, Py 3.0/TS 5.0) and Oct (rewind, ownership tokens, Enterprise Extension, >1M workflows/s sharded Postgres) | dbos.dev blog posts (29 Sep, 29 Oct) | **Confirmed.** Sharded Postgres is a *paid* Enterprise Extension feature. |
| 18 | Dapr 1.19 (22 Oct): up to 40% workflow throughput, multi-app workflows, opt-in Scheduler placement, alpha MCP server | GitHub release v1.19.0 | **Confirmed.** The MCP server ships as a separate binary. |
| 19 | Orleans scenarios doc leads with AI agent sessions; v10.4.0 SQLite fixes and preview journaling/Durable Jobs | Orleans docs page; GitHub release v10.4.0 | **Confirmed.** The "updated 17 Aug 2026" doc date could not be verified and is now marked so. |

**Not re-checked (left as originally sourced):** Terse internal claims from `../terse/` ([T1] quotas of 500 active actors and 50 starts/s, `observe/state`), Akka `AutonomousAgent` (May, [BG]), Mastra runners [M], the Restate BYOC and checkpointing posts [7c], the Inngest third-party realtime explainer [11], and the Oso/AWS Temporal posts [1f][1h].
