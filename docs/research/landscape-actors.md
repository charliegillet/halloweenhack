# Landscape: actors, Durable Objects, durable execution and sync, as they bear on Haunted Hacks

Consolidated **29 October 2026** for Haunted Hacks: Real-Time AI Edition (Sat 31 Oct 2026, SF; build window 11:00 to 16:00, then live demos). This brief merges four verified sub-files (linked below) and adds one live re-check of the main contradiction between them: Terse's rollback semantics, checked against the `TerseAI/durable-actors` source at HEAD `20d2899` and the hosted docs. Each sub-file has its own verification log, so for depth and exact quotes go to the sub-file.

Labels: **[V]** = verified in a primary source (by a sub-file or in this pass). **[I]** = inference. **[BG]** = background, dated before Aug 2026. Vendor benchmark numbers are vendor claims and none were reproduced.

---

> ### What matters for Haunted Hacks (read this if nothing else)
> 1. **Build on Terse Durable Actors, not on Cloudflare, Rivet, Temporal or a sync engine.** None of those is a sponsor, and each would compete with Terse for the "durability" credit. Use them as **vocabulary and patterns** only. Judges primed by the event's own links (Boris Tane's DO explainer, Aaron Boodman's DO thread) will expect you to know the Durable Object model.
> 2. **The single most important Terse gotcha:** a default method **holds the actor's mailbox across `await`**, so one 20 s LLM call freezes the room. Cloudflare does the opposite: `fetch()` interleaves. Fix it with `@Interleave` (which turns off rollback for the whole class), floor control, or Whitechapel-style leases.
> 3. **Assume every write is saved immediately.** A failed call only rolls back if it is `@Atomic`. The docs contradict themselves on this, but the runtime code implements immediate writes (see §6).
> 4. **Gotchas that will bite:** one alarm per actor (multiplex it with a timers table); nested `.push()` on `@Persisted` fields is **not saved**; `requestId` does **not** deduplicate; instances cannot be deleted; an open WebSocket does not keep an actor awake (10 s idle default).
> 5. **The demo formula that wins:** many screens (ideally audience phones), something that happens while nobody is watching (alarms), and a visible **kill, then resume** with memory intact. Add Agent Relay between agent actors for the "both" bonus.
> 6. **Before Saturday:** `bun upgrade` (this machine has 1.3.14; Terse needs ≥1.4.2). Pin `durable-actors` ≥0.14.1 (fixes bug #351) and do not upgrade on the day, because 12 releases shipped between 24 and 29 Oct. Smoke-test `terse init → dev → deploy`, alarm re-arm, kill-and-resume, and rollback behaviour on Oct 30.
> 7. **Don't pitch "open source vs closed Cloudflare"** (the Deno/celld team joined Cloudflare on 9 Oct to build self-hosted distributed DOs), and **don't lead on latency** (Terse's own published p95 durable write is 85.6 ms). Pitch semantics instead: serialized-by-default, `@Compute`-sized sandboxes, typed clients, emitted state, and per-entity sharding for Supabase's "scale to millions" prize.

---

## Sub-files

| File | Angle | Size |
|---|---|---|
| [`landscape-actors/01-cloudflare-durable-objects.md`](landscape-actors/01-cloudflare-durable-objects.md) | Cloudflare DO and the Agents SDK as the reference Terse is measured against: semantics, limits, pricing, Aug-Oct changelog, DO vs Terse comparison table | 30 KB |
| [`landscape-actors/02-durable-execution-actors.md`](landscape-actors/02-durable-execution-actors.md) | Rivet, Restate, Temporal, Inngest, Trigger.dev, DBOS, Orleans/Akka/Dapr against Terse; funding and launches; "why not X" answers | 36 KB |
| [`landscape-actors/03-local-first-sync.md`](landscape-actors/03-local-first-sync.md) | The Boodman DO thread the event links; Zero/r2db, Electric, Jazz, PartyKit, Liveblocks, Convex; "actor world is hot" discourse | 36 KB |
| [`landscape-actors/04-actor-patterns-for-ai.md`](landscape-actors/04-actor-patterns-for-ai.md) | Pattern catalogue P1-P9 with Terse sketches, Whitechapel/talkingAgent source reading, demo table, anti-patterns, 5-hour build order | 38 KB |

Related areas: `terse/`, `agent-relay/`, `supabase/`, `mastra/`.

---

## 1. Executive summary

- **The concept the hosts are selling is "one stateful, addressable, single-writer object per agent, room or session".** It persists its own state, wakes on messages and alarms, and streams changes to every subscriber. The event's primers say exactly this: Boris Tane calls a DO "a tiny, long-lived server that is guaranteed to be unique for a specific ID" [BG, Nov 2025] [V][CF1], and Boodman's 14 Aug 2026 thread says DOs fix the fact that "shared state server-side is not typically easy to come by. Basically it's database or nothing" (head post about 127.9k views in a mirror snapshot) [V][SY1]. In that thread's replies, a former DO team member says the internal name was originally "Actors" [V][SY1].
- **Terse is a small entrant in a crowded, fast-moving niche.** `TerseAI/durable-actors` has 291 stars, an MIT licence, was created 30 Aug 2026, and gets about 3.7k npm downloads a week. Compare Rivet at 6,507 stars and Cloudflare's `agents` package at 3.4M downloads a week [V][gh][npm]. Between Aug and Oct: Deno's `celld` ("self-hosted, distributed Durable Objects", 6,174 stars) launched in August and joined Cloudflare on 9 Oct; Rivet shipped Pi Durable (7 Oct) and a 3.0 preview (26 Oct); and HN carried several "OSS Durable Objects" posts [V][CF11][DE4][DE5][HN].
- **The money in Aug to Oct went to durable *execution*, not durable actors.** Temporal raised $550M at $12.55B (14 Sep, co-led by Lightspeed), Restate raised a $20M Series A (30 Sep, Replit as a customer), and Inngest, Trigger.dev and DBOS all shipped agent features [V][DE1][DE7]. Terse's co-founder draws the line himself: "durable actors manages durable state, not durable execution" [V][HN Show].
- **Sync engines are converging on actors.** Rocicorp served a 100 GiB reactive database from a single DO (r2db, 16 Oct), and Durable Streams now runs on DO and Rivet. Electric argues the other side ("actors… trap [the log] behind a predefined interface") and was acquired by Databricks on 11 Aug. Hosted PartyKit was deleted on 23 Oct [V][SY2][SY3][SY5].
- **For the build, Terse's primitive set is narrow:** one alarm, no scheduler, no monitor or link, no cross-actor transactions, and an undocumented actor-to-actor stub. You therefore build supervision, schedules and approval gates yourself, which is visible and judge-friendly. The best template is the Terse team's own Whitechapel game: a room → scene → NPC actor hierarchy plus a reserve → claim lease → save draft → commit protocol for LLM turns [V][P5].

---

## 2. Key facts tables

### 2.1 Terse vs Cloudflare DO vs Rivet (as of 29 Oct 2026)

| | **Terse Durable Actors** | **Cloudflare DO + Agents SDK** | **Rivet Actors** |
|---|---|---|---|
| Sponsor or host here? | **Host** | No | No |
| Licence / stars | MIT / 291 [gh] | `agents` MIT / 5,916; `workerd` DO is single-instance; `celld` Apache-2.0 / 6,174 [gh] | Apache-2.0 / 6,507 [gh] |
| Latest | v0.14.4 (29 Oct); npm `durable-actors` 0.14.4, `terse-sdk`/`terse-cli` 0.14.7 [V this pass] | `agents@0.32.0` (29 Oct) [V] | v3.0.0-preview.4 (29 Oct); v2.3.31 in parallel [V] |
| Compute unit | Per-actor sandbox, 0.25 CPU / 256 MiB default, up to 4 CPU / 4 GiB via `@Compute` [T] | V8 isolate, billed on 128 MB, can share an isolate [CF3] | Node/Bun/Rust process; "no 128 MB cap" [DE6] |
| Default concurrency | **Mailbox held across `await`**; `@Interleave` opts out and disables rollback class-wide [V] | Single thread with input/output gates; **non-storage I/O (`fetch`, R2) interleaves** [V][CF5] | One actor per key; state saves throttled at 1 s by default, per Terse's comparison post [DE-T6] |
| Durable state | `@Persisted` fields (reassignment only) + `this.db` SQLite; writes immediate; `@Atomic` gives all-or-nothing [V] | Explicit `ctx.storage` KV + synchronous SQLite; 10 GB per object; 30-day PITR [CF2] | `actor({state, actions})` + per-actor SQLite/KV [DE6] |
| Timers | **1 alarm per actor**, fires while dormant, polled every 100 ms [T] | 1 alarm per object, at-least-once, 6 retries; the Agents SDK multiplexes schedules in SQL [CF4][P4b] | Cron and self-scheduling built in [DE6] |
| Idle | Dormant after 10 s (configurable 1 ms to 24 h); open sockets **don't** keep it awake [V][P1] | Hibernate after 10 s; evicted after 70-140 s; since 1 Oct, pending I/O holds an object up to 15 min [CF6] | 4.37 ms p50 wake (vendor) [DE6] |
| Client sync | `@Emittable` → `state` then `state_update` frames; generated typed client [T] | `setState()` → all clients; `useAgent` hook [CF15] | Events, React hooks [DE6] |
| Scale ceiling | **500 active actors per project, 50 starts/s** (OSS defaults; hosted overrides unknown) [T] | Unlimited objects; ~1,000 req/s soft limit per object [CF2] | 3.0: no multi-region, serverless or ACLs yet [DE5] |
| Published perf | p95: 85.6 ms durable write, 2.14 ms read, 334 ms warm-up (Show HN) [HN Show] | none comparable | 0.69 ms p50 write, 6.9 ms cold start (3.0 preview, vendor) [DE5] |
| Pricing | **None published** [T] | Free 100k req/day + 13,000 GB-s/day; $0.15/M requests, $12.50/M GB-s [CF3] | Managed / BYOC / self-host [DE-T6] |
| Self-host | Documented path is **GCP only** (GKE Sandbox, Postgres, GCS, Helm) [SY-T] | Distributed self-host coming via celld; no timeline [CF11] | Documented [DE-T6] |

The benchmark rows use different percentiles, setups and durability guarantees, so they are **not comparable**. They are listed because a judge may have seen the HN thread.

### 2.2 Durable-execution and virtual-actor landscape (condensed from 02)

| Product | Family | Stars (29 Oct) | In-window news | Relevance on Saturday |
|---|---|---|---|---|
| Temporal | Durable execution | 24,077 | $550M Series E at $12.55B (14 Sep); no Cloud base fee (30 Sep); "Immortal life of Pi" (8 Oct) | Pitch contrast only |
| Restate | Durable execution + keyed Virtual Objects | 4,624 (BSL 1.1) | $20M Series A (30 Sep); 1.8 (14 Oct) | Nearest durable-execution analogue of an actor; don't use |
| Inngest | Step functions + realtime | 6,000 (SSPL) | Sandboxes beta (6 Oct; **Pro plan and above**, `inngest` ≥ 4.21.1) | Use Freestyle or Superserve for sandboxes instead |
| Trigger.dev | Durable tasks, `chat.agent` | 16,658 | v4.8.0 Slack/Linear agents (23 Oct); v4.8.2 (29 Oct) | Don't use |
| DBOS | Postgres-library workflows | 1,656 / 1,422 | Supabase Edge Functions support (Sep); >1M workflows/s on sharded Postgres (paid Enterprise Extension, 29 Oct) | Analogy for the Supabase pitch only |
| Orleans / Akka / Dapr | Virtual actors (.NET / JVM / sidecar) | 10,918 / 13,283 / 26,169 | Dapr 1.19 alpha MCP server (22 Oct); Orleans 10.4 | Not viable in 5 h of TypeScript |

Sources: [DE1]-[DE21], [gh]. Mastra (a sponsor) ships Inngest and Temporal runners. Avoid those runners alongside Terse [DE-M].

### 2.3 Terse primitive → AI concept (from 04, verified at `20d2899`)

| AI need | Primitive | Hard constraint |
|---|---|---|
| Identity | `actors.X.get(id)`, 1 to 128 chars `[A-Za-z0-9._-]` | **Cannot delete instances** (issue #228, open since 18 Oct). Use `room-${Date.now()}` per run |
| Memory | `@Persisted` + `this.db` | Nested mutation **not saved**; always reassign |
| Live UI | `@Emittable`, `broadcast(msg,{tags,except})` | A client-side `.broadcast()` skips actor code and is not persisted |
| Turns / locks | Default mailbox | Held across `await` |
| LLM concurrency | `@Interleave` | Disables rollback for the whole class |
| Loops | `this.alarm.set(ms)` + `onAlarm` | One alarm; setting it again replaces it |
| Background work | `@Resource` with `onResume` / `onGracefulShutdown` | Shutdown hook is skipped on a crash; unhandled rejections crash the worker |
| All-or-nothing | `@Atomic` | Per method only; no cross-actor transactions |
| Actor → actor | `createActorStub` + `ActorAccessTransport` | **Undocumented**; Whitechapel deep-imports `terse-sdk/dist/actorAccess.js` on pinned 0.7.16 / 0.9.15 |
| Exactly-once | none | `requestId` "identifies an attempt; it does not deduplicate execution" (OpenAPI) |

### 2.4 Cloudflare numbers worth quoting (pricing page 18 Oct, limits page 29 Oct) [V][CF2][CF3]

10 GB SQLite per object (1 GB on Free) · ~1,000 req/s soft limit per object · 30 s CPU (configurable to 5 min) · 32 MiB incoming WS message · 15 min alarm wall time · `serializeAttachment` 16,384 B · batch outbound WS "every 50-100ms or every 50-100 messages, whichever comes first" · the pricing page's own examples: **$419.30/mo without hibernation vs $20.65/mo hibernated**. Sharding rule from Rules of DOs: required DOs = total rps / per-DO rps.

---

## 3. Newest features and events, dated (Aug to Oct 2026)

| Date | Event | Src |
|---|---|---|
| 3-4 Aug | CF `@cloudflare/computer` preview (v0.8.0 on 26 Oct); Agents dashboard with tracing | CF10 |
| 4 Aug | Convex $57M Series B (Insight) | SY7 |
| 5 Aug | "Celld: Self-hosted, distributed Durable Objects" gets 286 points on HN | HN |
| 11 Aug | Databricks acquires Electric; Electric Cloud winding down (Rivet dates it to 10 Sep) | SY3 |
| 14 Aug | Boodman DO explainer thread (the event links it) | SY1 |
| 25 Aug | DO `ctx.abort(reason,{retryAlarm:false})` (Wrangler ≥4.126.0) | CF6 |
| 30 Aug | `TerseAI/durable-actors` repo created | gh |
| 1 Sep | Liveblocks Sync, "the sync engine for the agentic web" | SY6 |
| 3 Sep | Durable Streams runs on Rivet Actors | SY4 |
| 14 Sep | Temporal $550M at $12.55B | DE1 |
| 17 Sep | Workers traces follow RPC into DOs | CF6 |
| 30 Sep | Restate $20M Series A | DE7 |
| 1 Oct | DO pending I/O prevents eviction (compat date 2026-10-01, up to 15 min); Earendil Pi Durable gets 515 points on HN | CF6, SY8 |
| 6 Oct | Terse Show HN (53 points / 25 comments); Inngest Sandboxes beta | HN, DE10 |
| 7 Oct | Terse launch tweet (44 likes, ~11.3k views in mirror); Rivet Pi Durable; Terse v0.7.16 removes client WS reconnect | SY-X, DE4 |
| 9 Oct | **Deno joins Cloudflare; workerd and celld merging**; PartyKit announces hosted shutdown | CF11, SY5 |
| 14 Oct | Restate 1.8 | DE9 |
| 16 Oct | Rocicorp r2db: 100 GiB reactive DB in one DO | SY2 |
| 17 Oct | Terse blog posts "vs Cloudflare DO" and "vs Rivet" | T-CF, T-RV |
| 18 Oct | Terse Mastra example; Terse pi-durable adaptor v0.8.1; issue #228 (no deletion) opened | P6 |
| 20-22 Oct | CF Agents breaking changes: `@cloudflare/shell` deprecated (20th); Pi 1.4 with no rollback (22nd); CF MCP servers drop `/sse` (22nd); QCon AI "Actors for Agents" talk (22nd); Dapr 1.19 (22nd) | CF18, P11 |
| 23 Oct | Hosted PartyKit deleted, `npx partykit deploy` dead; Trigger.dev v4.8.0; Convex v1.48 | SY5 |
| 26 Oct | Rivet 3.0 preview ("WarpDrive", S3 only dependency) | DE5 |
| 27 Oct | CF HITL and long-running agent docs updated | P4c |
| 28 Oct | Terse bug #351 (first activation fails on a duplicate upsert in `onResume`) fixed in v0.14.1 | P-351 |
| 29 Oct | Terse v0.14.2, v0.14.3, v0.14.4 (3 tags in one UTC day); `agents@0.32.0` (skills become files, breaking); Earendil "Pi Durable on Cloudflare" | gh |

**Background still worth knowing:** McpAgent was deprecated on 27 Jul (just before the window). SQLite became mandatory for new DO namespaces on accounts without KV-backed ones (24 Jul). Project Think fibers/sub-agents date from Apr 2026, Zero 1.0 from Mar/Jun 2026, Jazz 2 alpha from Apr 2026.

---

## 4. Social sentiment (Aug to Oct 2026)

- **The dominant claim is that agents need actors.** @IgorZIJ (4 Oct): "agents make it the standard, required pattern". @bluequbit (8 Oct): "Durable objects are actually a really great primitive for building async agents." The QCon AI talk (22 Oct, Manju Rajashekhar) gives five patterns: task actors, write-through state, indirect continuations, mutable execution graph, supervision boundaries [V][SY-X][P11].
- **There is an open-source DO-alternative race.** Rivet's Nathan Flurry (3 Oct, ~376 likes): "this is why we're building rivet actors". celld got 286 points on HN. Terse got 53 points on Show HN [V].
- **Durable agent harnesses are landing on every actor platform.** Pi Durable got 515 points on HN (1 Oct). Within weeks it had Rivet, Cloudflare and Terse adaptors [V][SY8].
- **Criticism aimed at Terse specifically:** one Show HN commenter called ~100 ms writes "not usable for anything beyond toys" and pointed to celld's ~1 ms [V][HN Show]. In general: @DominikTornow (21 Oct): "anyone promising exactly-once processing has their fingers crossed behind their back." @kushbhuwalka on Boodman's thread: DOs "seem like a niche primitive" [V].
- **Terse team signals:** Karatzas (8 Oct): an agent-coordination demo "almost won me the @ycombinator demo showcase". "Tiny Lovable" with Pi Durable + Modal + Durable Actors (19 Oct; date and ~3.3K views only from a sibling file). "Why you should host your agents on Actors" video (14 Oct, ~1.3K views) [V via mirror][P20].
- **Coverage limits:** X was read through xitter.cf and nitter mirrors (counts are snapshots). Reddit search returned 403. HN coverage comes from Algolia keyword search. Social reach is modest overall: the buzz is mostly on X in a small infra crowd, and r2db got only 5 points on HN.

---

## 5. Contradictions between sub-files: resolved or flagged

| # | Contradiction | Resolution |
|---|---|---|
| C1 | **Does a failed default Terse call roll back?** The 17 Oct "vs Cloudflare" blog and the guide (line 298: "A failed call normally rolls back its field and SQLite changes") say yes. The same guide (line 319: "saved as it happens… writes made before the error stay saved") and the Rivet comparison post ("method-boundary commits") say otherwise. Files 01, 02 and 04 all flag this. | **Resolved at code level in this pass, not yet run.** At HEAD `20d2899`, `sdk/src/host/actor-runtime.ts` runs non-`@Atomic` methods in `"immediate"` mode, and `src/host/actor_database/sqlite.rs` commits each changed write immediately (`immediate && … && self.commit()`). On a throw, a non-interleaved actor calls `restoreInstance` → `rollback()`, which only issues `ROLLBACK` if a transaction is still open, then rebuilds the instance from saved fields. So **writes already made stay saved; only in-memory changes are discarded; only `@Atomic` is all-or-nothing.** The `@Atomic` JSDoc agrees ("Saves all of the method's writes together when it succeeds, or none if it throws"). The hosted docs page carries both contradictory sentences (curl, 29 Oct). Still run the Oct 30 test. |
| C2 | Boodman X post content: 04 says "SOURCE_NOT_AVAILABLE, content unknown"; 03 reconstructs it in full. | **Resolved:** 03 read it through two agreeing mirrors (xitter.cf, nitter.rdrama.net) and checked it against `EVENT_PAGE.md` line 96. 04 tried x.com and nitter.net directly. Use 03's text. |
| C3 | Where hosted Terse sandboxes run: older sibling text said "hosted on Modal"; 01 says the runtime defaults to GKE Sandbox with Modal opt-in. | **Flagged.** Runtime default is GKE Sandbox; the provider behind hosted Terse Cloud is unverified. Ask on site. |
| C4 | `@Compute` as Terse's "biggest differentiator" vs Rivet: attributed to the comparison post. | **Resolved by 02:** it is co-founder `thomask1995` on the Show HN thread, not the post. |
| C5 | Release cadence: "4 releases on 29 Oct". | **Resolved:** 3 tags dated 29 Oct UTC (v0.14.2-v0.14.4), 12 between 24 and 29 Oct (re-confirmed with `gh release list` this pass). |
| C6 | Terse stars 279 / 290 / 291 across drafts. | Drift. **291** on 29 Oct (re-confirmed this pass). |
| C7 | Code imports: `terse-sdk/actor` vs `durable-actors`. | **Resolved:** import from `durable-actors`. `terse-sdk/actors` appears only in Whitechapel's pinned stub path. |
| C8 | Boris Tane's "a slow API blocks the 10th request for 50 s" vs Cloudflare's rule that `fetch()` interleaves. | **Flagged as low stakes:** his example uses `setTimeout`. Treat the CF docs as authoritative. On Terse the blocking story *is* true by default. |
| C9 | Terse hosted scale quotas (500 active / 50 starts/s). | **Flagged:** these are OSS config defaults from `../terse/`; whether hosted Terse overrides them is unknown. |

---

## 6. Gotchas (merged, deduplicated)

**Terse runtime**
1. LLM `await` in a default method blocks the mailbox, and the docs call the impact "catastrophic". `@Interleave` turns off rollback for **every** method in the class [V].
2. Writes are immediate (C1). Put `@Atomic` on any commit step that must be all-or-nothing. `BEGIN`/`COMMIT`/`SAVEPOINT` are rejected [T].
3. `this.arr.push()` / `this.obj[k] = v` on `@Persisted` is not saved, "even at method completion". The repo README's own OpenAI sample does `.push`, so don't copy it [V].
4. One alarm per actor, and re-setting it replaces the old one. `setTimeout` loops die with eviction (Boodman's 2023 workerd #1185 documents the same failure on DOs) [V].
5. 10 s idle default, and open WebSockets don't keep the sandbox alive. It is unverified whether a detached `@Resource` loop survives idle, so pair it with an alarm heartbeat [V/I].
6. `requestId` does not dedupe. Store `seen(id)` rows. Agent Relay channel posts accept an `Idempotency-Key` header [V].
7. Instances can't be deleted (#228). Use fresh IDs per demo run [V].
8. Bug #351 (duplicate upsert in `onResume` breaks first activation) is fixed in ≥0.14.1. Keep `onResume` and constructor SQL idempotent anyway [V].
9. Client WebSocket reconnect was removed in v0.7.16. Write your own reconnect that fetches a fresh grant [V via sibling].
10. The actor-to-actor stub is undocumented and relies on a deep import pinned to old versions. **Fan out from the backend or through Agent Relay** [V].
11. Bun ≥1.4.2 is required; this machine has 1.3.14 [V].
12. Self-hosting is documented only for GCP. Demo locally or on hosted Terse; don't stand up GKE [V].

**Ecosystem traps (old tutorials and LLM answers will suggest these)**
13. `npx partykit deploy` has been dead since 23 Oct. Electric Cloud was wound down around 10 Sep [V].
14. CF Agents SDK: breaking releases on 20, 22 (no rollback possible) and 29 Oct. `McpAgent` is deprecated. CF MCP servers no longer serve `/sse` [V].
15. Jazz 2's breaking alpha.60 is 93 of 114 items done and may land around the event. Zero needs Postgres plus `zero-cache`. Skip separate sync engines [V].
16. Inngest Sandboxes need the Pro plan. Mastra's Inngest/Temporal runners duplicate Terse's role [V].
17. Don't paste RivetKit snippets (`actor({state, actions})`, `c.state`). They look similar but are a different API [V].

**Pitch traps**
18. Leading on latency (85.6 ms p95 write is already criticised). Leading on "open vs closed Cloudflare" (celld). Claiming "rollback by default" (C1). Claiming exactly-once.

---

## 7. Integration recipes (untested designs on the documented API)

**R1. Multiplexed timers on one alarm** (CF's Agents SDK does the same: "managing multiple schedules in SQL and using a single alarm" [P4b]):
```ts
async onAlarm() {
  const due = this.db.exec<{id:number;kind:string}>("SELECT id, kind FROM timers WHERE due <= ? ORDER BY due", Date.now())
  for (const t of due) { await this.step(t.kind); this.db.exec("DELETE FROM timers WHERE id = ?", t.id) }
  const [next] = this.db.exec<{due:number}>("SELECT min(due) AS due FROM timers")
  if (next?.due) this.alarm.set(next.due)
}
```
Keep handlers idempotent: at-least-once delivery is the norm on DOs, and Terse alarms fire while dormant.

**R2. Slow LLM against a single writer**, cheapest first [P3]:
- (a) `@Interleave` on the chat method, with reassign-only writes. Good for chat.
- (b) **Floor control** (talkingAgent): persist `count`; `speakerId = sorted[count % n]`; broadcast `{state, speakerId}`. Agents call the LLM *outside* the actor. Good for séances, debates and games.
- (c) **Lease and commit** (Whitechapel `ConversationActor`): `prepare(id)` returns the cached result if `id` has been seen, or "Waiting for a response." if a turn is pending, otherwise reserves the turn. Then `claim(id, worker)` → `saveDraft` → `commit` checks `worker` and `workerUntil > now`, and throws "Generation ownership expired." if the lease ran out. Use this whenever AI output mutates shared truth (votes, money, files).

**R3. Kill → resume, the "durable execution" answer** [DE §4]: persist `{phase:"calling_llm", reqId}` *before* the call and the result *after* it, wrapping the commit in `@Atomic`. On wake or alarm, resume any row still in `calling_llm`. Buffer tokens in memory and broadcast them with a chunk index; persist at turn end. Clients dedupe on the index.

**R4. Actor-as-agent on Agent Relay (the "both" bonus)** [P8]: each agent actor `POST /agents` once and stores the `at_live_*` token, which is returned only once, in `@Persisted`. Relay webhooks or subscriptions hit your backend, which calls `actors.Ghost.get(name).onRelayMessage(msg)`. The actor replies over Relay REST (`mode: wait` by default, `steer` for interrupts) with an `Idempotency-Key`. Register the human approver as `type: "human"`. Nobody has published a Terse + Relay bridge yet, so this is a design, not a documented pattern [V primitives / I bridge].

**R5. Supervision without monitor or link** [P6]: a `Supervisor` actor holds `children:{id,lastBeat,restarts,status}[]`. An alarm every 5 s applies the policy: restart if `lastBeat` is older than 15 s and restarts < 3 (one_for_one), park and broadcast at 3 or more (circuit breaker), escalate to a human on semantic failure. Show "restarts 2/3" on screen.

**R6. Human-in-the-loop that survives disconnects** [P7]: `@Persisted @Emittable pending = {id, tool, args, expiresAt}`, a timers row at `expiresAt`, and idempotent `approve(id)` / `reject(id)` methods that write to an audit table. This matches Cloudflare's guidance to "Store pending approvals in agent state so they survive disconnections" (updated 27 Oct).

**R7. Scale-to-millions split (Supabase)** [CF5][P9][SY]: hot state lives per entity actor, never in one global "Application" actor. A `Lobby`/registry actor (parent-child) lists children without waking them. Batch summaries and history into Supabase Postgres for cross-entity queries. Cite required actors = total rps / per-actor rps, the 10 GB per-DO cap as the reason to offload history, r2db as proof one actor can front huge data, and DBOS's sharded Postgres as an analogy. Be honest about the 500-active / 50-starts/s defaults, and note that dormant actors don't count.

---

## 8. Hackathon implications

**What to build.** Architecture A, the "Séance" [P §3], is the best risk/reward:
- **Room and agents:** a `HauntedRoom` actor (emitted transcript, phase, votes, floor control, a 30 s alarm round timer) plus one `GhostActor` per AI ghost (persona, memory, Relay token).
- **Coordination:** a `Lobby` actor, and a `Supervisor` actor that checks ghost heartbeats.
- **Display and join:** the Relay channel `#seance` shown as an observer stream on the big screen, and the audience joining by QR.
- **Stretch:** a HITL gate where a ghost wants to *do* something and the audience votes on it.

The Séance hits both tracks, the "multiplayer AI" and "long-running agent" prompts on the event page, and the Halloween theme. It also mirrors the hosts' own showcases (Whitechapel, talkingAgent, the Mastra two-tab demo). Alternatives: B "Ghost workers" (fan-out onto a single-writer ledger, showing "0 conflicting writes") or C "Software factory with a crypt-keeper gate" (riskier, because it needs sandbox credentials and the template is the one that hit #351).

**Demo beats judges will reward.**
1. Two laptops and the audience's phones show identical state, which is Boodman's "never different participants seeing different state".
2. `kill -9` mid-turn, restart, and the state is intact while the interrupted turn resumes (R3).
3. A ghost process dies, the supervisor restarts it, and it returns with memory (Terse) and queued messages (Relay).
4. An alarm fires while no one is connected.
5. A late-joining observer agent subscribes to the live log, which answers Electric's "actors trap the log" critique.

Say the pattern names out loud: "each ghost is its own actor, the room is the single writer, the supervisor restarts crashed agents."

**Build order (5 h) [P].** 0:00-0:45: room actor with two tabs syncing. 0:45-1:45: ghosts with `@Interleave` turns plus floor control. 1:45-2:30: alarm timer and heartbeats. 2:30-3:15: Relay channel and observer view. 3:15-4:00: supervisor kill/restart and QR join. 4:00-5:00: rehearse and freeze the code. (Lunch at 1 pm falls inside the window.)

**Setup before Oct 31 (ideas only; all event code must be written fresh).**
- `bun upgrade` to ≥1.4.2. Pin `durable-actors` (≥0.14.1; 0.14.4 is current) and `terse-cli` (0.14.7).
- Run one full `terse init → actor dev → generate → deploy` in a scratch repo.
- **Oct 30 tests:** (a) alarm re-arm inside `onAlarm`; (b) reassign-only persistence across a kill; (c) whether a throwing non-`@Atomic` method keeps its writes (C1 predicts it does); (d) whether a `@Resource` loop survives idle; (e) the actor-to-actor stub, if you want it at all.
- Create the Relay workspace and an observer token. Have the OpenAI key ready.
- Read Boris Tane's post and Cloudflare's "Rules of Durable Objects". Skim Terse's two comparison posts. Open demo.r2db.dev in two windows.
- Write the 3-row "why not X" card. **Temporal/Restate:** "they make a *function* finish; we need an addressable *agent* with live sockets." **Rivet:** "same family; Terse gives serialize-by-default and per-class `@Compute`" (attribute the latter to the founder's HN comment). **Cloudflare DO:** "isolate-sized (128 MB) and operator-managed; Terse actors are sandbox-sized and open source."

**What each judge wants [I].**
- **Terse:** the actor is the backbone, not a cache. Show its distinctive primitives (persisted and emitted state, serialized calls, sockets, alarms, `@Compute`/`@Resource`) and a crisp contrast with DO and Rivet.
- **Agent Relay:** no human copy-paste, visible agent-to-agent traffic, and durable catch-up after going offline.
- **Supabase "scale to millions":** per-entity sharding plus Postgres for cross-entity queries (R7).
- **Grand prize:** a creative, working multiplayer or long-running agent demo. The current zeitgeist is "agents that live where people already are" (Rivet Pi Durable, Trigger.dev Slack and Linear agents).

---

## 9. Limits / could not verify

- **No SDK code was executed** by any sub-file or by this pass. C1 is resolved from reading the source, not from a run.
- Which sandbox provider runs hosted Terse Cloud, whether hosted quotas exceed 500 active / 50 starts/s, and whether Terse plans tunable durability for faster writes (promised only in an HN comment).
- Whether a detached `@Resource` loop survives `idleTimeoutMs`. Whether Agent Relay Flows support "gates / human steps". Whether the Relay SDK has a `reconnect` call. The Terse docs FAQ quote on cross-actor transactions (not re-found on 29 Oct).
- The Free-plan CPU cap for DOs. The exact day of the SQLite-mandatory change (it sits under the 24 Jul heading). celld merge timeline. The Agents SDK scheduler internals.
- Rivet's "~47K views" on X, the Orleans doc update date, the Replay talk claim, the Electric launch-video quotes, the Convex Agent Component (secondary source only), and the date and views of the Tiny Lovable post.
- Social data comes from mirror snapshots. Reddit returned 403 and YouTube transcripts failed.
- No head-to-head Terse vs Cloudflare or Rivet benchmark exists. Terse's own post says it is "not a performance benchmark".

---

## Sources

Merged and deduplicated. Tags in the text map to the sub-file that verified the source (CF = 01, DE = 02, SY = 03, P = 04, T = `../terse/`).

**Event and Terse**
- Event page: https://events.ycombinator.com/haunted-hacks-2026 (captured in `../EVENT_PAGE.md`)
- TerseAI/durable-actors @ `20d2899` (docs/reference/typescript-guide.md lines 248, 298, 319-322; configuration.md; openapi.yaml; sdk/src/host/actor-runtime.ts; sdk/src/host/database.ts; sdk/src/actor/decorators.ts; src/host/actor_database/sqlite.rs): https://github.com/TerseAI/durable-actors · issues https://github.com/TerseAI/durable-actors/issues/228 , https://github.com/TerseAI/durable-actors/issues/351
- Terse docs: https://docs.useterse.ai/quickstart · https://docs.useterse.ai/concepts · https://docs.useterse.ai/reference/typescript-sdk · homepage https://www.useterse.ai/
- Terse blog, 17 Oct 2026: https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects (T-CF) · https://www.useterse.ai/blog/terse-vs-rivet-actors (T-RV)
- Terse showcases: https://github.com/TerseAI/whitechapel · https://github.com/TerseAI/talkingAgent · https://github.com/TerseAI/durable-actors-mastra-example · https://github.com/TerseAI/MultiplayerAI-Backend · https://github.com/TerseAI/little-durable
- Show HN "Durable Actors" (6 Oct): https://news.ycombinator.com/item?id=49980399 (HN Show)
- Karatzas posts (mirrors): https://xitter.cf/karatzas_thomas/status/2107872102829502622 · https://nitter.rdrama.net/karatzas_thomas/status/2110466203303170181 · https://nitter.rdrama.net/karatzas_thomas/media
- npm registry (versions and 22-28 Oct downloads for `durable-actors`, `terse-sdk`, `terse-cli`, `agents`, `wrangler`, `@cloudflare/computer`): https://api.npmjs.org/downloads/point/last-week/durable-actors

**Cloudflare**
- Boris Tane, 5 Nov 2025 [BG]: https://boristane.com/blog/what-are-cloudflare-durable-objects/
- DO docs: https://developers.cloudflare.com/durable-objects/platform/limits/ · https://developers.cloudflare.com/durable-objects/platform/pricing/ · https://developers.cloudflare.com/durable-objects/api/alarms/ · https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/ · https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/ · https://developers.cloudflare.com/durable-objects/best-practices/websockets/ · https://developers.cloudflare.com/changelog/product/durable-objects/
- Agents: https://developers.cloudflare.com/agents/ · https://developers.cloudflare.com/agents/api-reference/agents-api/ · https://developers.cloudflare.com/agents/api-reference/schedule-tasks/ · https://developers.cloudflare.com/agents/agent-class/schedule-tasks/ · https://developers.cloudflare.com/agents/agent-class/internals/ · https://developers.cloudflare.com/agents/concepts/agentic-patterns/long-running-agents/ · https://developers.cloudflare.com/agents/concepts/agentic-patterns/human-in-the-loop/ · https://developers.cloudflare.com/changelog/product/agents/ · https://github.com/cloudflare/agents
- Blog: https://blog.cloudflare.com/deno-joins-cloudflare/ · https://deno.com/blog/cloudflare · https://simonwillison.net/2026/Oct/9/deno-is-joining-cloudflare/ · https://blog.cloudflare.com/agents-week-review-august-2026/ · https://blog.cloudflare.com/cloudflare-computer/ · https://blog.cloudflare.com/agents-on-cloudflare/ · https://blog.cloudflare.com/project-think/ [BG] · https://blog.cloudflare.com/tag/durable-objects/
- https://github.com/denoland/celld · workerd issues [BG]: https://github.com/cloudflare/workerd/issues/1185 · https://github.com/cloudflare/workerd/issues/1256

**Durable execution and actor runtimes**
- Rivet: https://github.com/rivet-dev/rivet · https://rivet.dev/blog/ · https://rivet.dev/blog/2026-10-04-replacing-our-message-broker-with-s3/ · https://rivet.dev/changelog/2026-10-07-introducing-pi-durable-for-rivet/ · https://rivet.dev/changelog/2026-10-26-introducing-rivet-3-0-preview/ · https://rivet.dev/changelog/2026-09-03-durable-streams-now-supports-rivet-actors/ · https://rivet.dev/actors/docs/design-patterns/ · https://rivet.dev/agents/docs/design-patterns/ · https://rivet.dev/guides/multi-agent-system/ · https://www.ycombinator.com/companies/rivet · https://www.launchvideo.com/directory/rivet
- Temporal: https://temporal.io/blog/temporal-raises-usd550m-series-e-at-usd12-55b-valuation-ai · https://www.reuters.com/business/temporals-valuation-spikes-126-billion-lightspeed-led-funding-round-2026-09-14/ · https://temporal.io/blog/durable-digest-september-2026 · https://temporal.io/blog/the-immortal-life-of-pi-running-the-pi-coding-agent-on-temporal · https://temporal.io/blog/oso-security-joins-temporal-accelerate-ai-agent-security · https://temporal.io/blog/temporal-and-aws-a-partnership-built-for-production-grade-ai · https://temporal.io/blog/replay-2026-product-announcements [BG] · https://docs.temporal.io/develop/typescript/integrations/openai-agents
- Restate: https://techcrunch.com/2026/09/30/restate-lands-20m-as-the-need-for-durable-infrastructure-increases-with-ai-agents/ · https://thenextweb.com/news/restate-20m-series-a-singular-durable-execution-ai-agents · https://github.com/restatedev/restate/releases/tag/v1.8.0 · https://docs.restate.dev/ai/patterns/sessions · https://docs.restate.dev/ai/patterns/durable-agents
- Inngest: https://www.inngest.com/changelog · https://cadenya.com/other-content/inngest-agentkit-for-ai-agents · Trigger.dev: https://trigger.dev/changelog/v4-8-0 · https://trigger.dev/changelog/v4-8-2 · DBOS: https://www.dbos.dev/blog/whats-new-in-dbos-september-2026 · https://www.dbos.dev/blog/whats-new-in-dbos-october-2026
- Orleans/Akka/Dapr: https://dotnet.github.io/orleans/docs/scenarios/ · https://github.com/dotnet/orleans/releases/tag/v10.4.0 · https://akka.io/platform/overview · https://github.com/dapr/dapr/releases/tag/v1.19.0 · https://learn.microsoft.com/en-us/agent-framework/hosting/durable-extension
- HN items: https://news.ycombinator.com/item?id=49696335 · https://news.ycombinator.com/item?id=49185430 · https://news.ycombinator.com/item?id=49612223 · https://news.ycombinator.com/item?id=49635621 · https://news.ycombinator.com/item?id=49877270 · https://news.ycombinator.com/item?id=50011940

**Sync and local-first**
- Boodman thread, 14 Aug 2026 (event-linked https://x.com/aboodman/status/2088155104851657110, read via https://xitter.cf/aboodman/status/2088155104851657110 and https://nitter.rdrama.net/aboodman/status/2088155104851657110)
- r2db: https://xitter.cf/tantaman/status/2110946680661287406 · https://demo.r2db.dev · https://r2db.dev · https://hn.today/s/100gib-db-served-from-a-durable-object
- Zero: https://zero.rocicorp.dev/docs/release-notes/1.11 · https://zero.rocicorp.dev/docs/status · https://www.infoq.com/news/2026/06/zero-version-1/
- Electric: https://electric.ax/blog/2026/04/29/introducing-electric-agents [BG] · https://electric.ax/blog/2026/08/11/electric-joining-databricks · https://www.databricks.com/blog/electric-joins-databricks-bring-wasm-postgres-ai-agent-sandboxes · https://thenewstack.io/databricks-electric-wasm-agentic-postgres/
- Jazz: https://jazz.tools/blog/what-is-jazz · https://github.com/garden-co/jazz/milestones · PartyKit: https://blog.partykit.io/posts/hosted-platform-shutdown/ · https://docs.partykit.io/guides/migrate-to-partyserver/
- Liveblocks: https://liveblocks.io/blog/introducing-liveblocks-sync-the-sync-engine-for-the-agentic-web · Convex: https://news.convex.dev/ · https://ship.convex.dev/changelog/convex-v1-48-0
- Discourse: https://x.com/IgorZIJ/status/2106535280576544933 · https://x.com/bluequbit/status/2108072005769802145 · https://x.com/NathanFlurry/status/2106504171008794660 · https://x.com/DominikTornow/status/2113042653063364779 · https://earendil.com/posts/pi-durable/ · https://earendil.com/posts/pi-durable-on-cloudflare/

**Patterns and demos**
- QCon AI "Actors for Agents", 22 Oct 2026: https://www.infoq.com/presentations/actors-for-production-ai-agents/
- Agent Relay docs: https://agentrelay.com/llms-full.txt · https://agentrelay.com/docs/markdown/relaycast-api.md · https://agentrelay.com/docs/markdown/flows.md
- Demo references [BG]: https://www.metabase.com/blog/metabase-ai-hackathon-winners · https://github.com/qiuethan/UofTHacks-Project · https://www.linkedin.com/posts/arnabb1998_nytechweek-spacetimedb-hackathon-activity-7470101568009220097-T_Bk · https://zylos.ai/research/2026-03-10-actor-model-communicating-agent-patterns/

**Sibling research cross-referenced:** `terse/01-docs-api.md`, `terse/02-newest-features.md`, `terse/03-github-code.md`, `terse/04-social-pulse.md`, `terse/05-team-strategy.md`, `agent-relay/01-docs-api.md`, `agent-relay/05-team-strategy.md`, `mastra/01-docs-api.md`.
