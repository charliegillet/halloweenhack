# Local-first / sync engines meet actors: Boodman's DO thread, Zero, Electric, Jazz, PartyKit, Liveblocks, Convex

Researched 2026-10-29 for Haunted Hacks (Oct 31, 2026). Scope: the "Actor world is hot" line on the event page, the Aaron Boodman post the event links, and how sync engines relate to actors. Durable Objects internals, Terse, and Agent Relay are covered in other files. Here they appear only where they touch sync.

Labels: **[V]** = verified from the cited primary source. **[I]** = my inference. Items before Aug 2026 are marked *(background)*.

---

## TL;DR

- **The event's "what are actors" link is a Boodman explainer thread from Aug 14, 2026.** It is not a sync-engine post. It explains Durable Objects as "serverless objects": a stateful class at a URL with exactly one live instance per id. His core argument is that DOs fix the fact that "shared state server-side is not typically easy to come by. Basically it's database or nothing." The head post had about 127.9k views and about 813 likes in the mirror snapshot. **[V]** ([mirror](https://xitter.cf/aboodman/status/2088155104851657110), [mirror 2](https://nitter.rdrama.net/aboodman/status/2088155104851657110))
- **In the replies, the word "actors" wins.** Greg McKeon says the DO team's internal name was originally "Actors". Boodman replies "I think Actors would have been good", then "Yes but nobody knows what actors are", and then agrees "actors" is "probably honestly the best". This is most likely where the event page's framing comes from. **[V]** (same mirror) **[I on the connection]**
- **The sync-engine world is converging on actors from two directions:**
  - **Sync inside the actor.** Rocicorp's "Matt" (@tantaman) put Zero's next-gen IVM engine into a *single Durable Object*, serving live queries over a 100 GiB database in R2 (Oct 16). **[V]** ([tweet mirror](https://xitter.cf/tantaman/status/2110946680661287406), [demo](https://demo.r2db.dev))
  - **Sync instead of the actor.** Electric argues that actors "guard access to the log and trap it behind a predefined interface". Its answer is "the agent is the durable stream" *(background, Apr 2026)*. **[V]** ([YouTube](https://www.youtube.com/watch?v=OiTqcScOFgE), [blog](https://electric.ax/blog/2026/04/29/introducing-electric-agents))
- **Two hosted options people might reach for are gone:**
  - **Hosted PartyKit** shut down on **Oct 23, 2026**. Use PartyServer on your own Cloudflare account. **[V]** ([PartyKit blog](https://blog.partykit.io/posts/hosted-platform-shutdown/))
  - **Electric Cloud** is "winding down" after Databricks acquired Electric on **Aug 11, 2026**. Rivet's changelog dates the wind-down to **Sep 10**. **[V]** ([Electric](https://electric.ax/blog/2026/08/11/electric-joining-databricks), [The New Stack](https://thenewstack.io/databricks-electric-wasm-agentic-postgres/))
- **The rebrand pattern of 2026:** every sync vendor is now pitching agents as "users":
  - Liveblocks Sync calls itself "the sync engine for the agentic web" (Sep 1). **[V]** ([Liveblocks](https://liveblocks.io/blog/introducing-liveblocks-sync-the-sync-engine-for-the-agentic-web))
  - Electric's GitHub description reads "The agent platform built on sync". **[V]** (gh API)
  - Jazz 2 says it fits "agent-heavy" apps. **[V]** ([Jazz](https://jazz.tools/blog/what-is-jazz))
  - Convex raised a $57M Series B on the line "developers and their agents are writing software together" (Aug 4). **[V]** ([Convex News](https://news.convex.dev/))
- **Hackathon read [I]:** Terse's `@Emittable` state push already *is* a tiny sync engine, with `state` then `state_update` messages to sockets (see `../terse/01-docs-api.md`). The winning shape is "one actor per room/agent, state streamed to every browser and every agent". Pulling in a separate sync engine is not needed and would burn hours.

---

## 1. The linked Boodman post, reconstructed (Aug 14, 2026)

The thread was found through two Nitter-style mirrors. The X URL itself could not be fetched. Text is quoted from the mirrors **[V]**:

| Post | Content (verbatim excerpts) | Views (mirror snapshot) |
|---|---|---|
| Head | "Do you guys want to know what durable objects are? The name is awful but I can explain it to you. It's a really cool and unique architectural primitive, different than really anything else on the market." | ~127,883 |
| 2 | "A better (and much funnier) name might have been 'serverless objects'… The external interface is a *class*, not a function… If another request comes into same URL, CF routes it to the same running program and the same exact JavaScript object in memory… That's it, that's the whole pitch." Use cases named: "chatrooms, multiplayer games, etc." | ~50,598 |
| 3 | "In a DO, there is a *guarantee* there will only be one instance of each DO running… If you have a multiplayer ai chat, you'll never end up with different participants seeing different state… The app layer of all our common stacks is stateless… Instead of stateless functions reading and writing out of a persistent shared database (with lots of locking, contention, cost), you have a bunch of small programs running server-side just using in-memory state… they can batch saves every 5s or whatever." | ~16,498 |
| 4 | "This has been 'fixing cloudflare's marketing' with your host, Aaron." | ~11,515 |

Notable replies **[V]**:
- **@wegmckeon (Greg McKeon):** "Internal name was originally 'Actors' but didn't emphasize storage enough." Boodman: "I think Actors would have been good. To me the storage is not really a defining part of the arch."
- **@Skuiggly:** "Sooo actors?" Boodman: "Yes but nobody knows what actors are."
- **@ajoshhoward:** "The general consensus on the engineering team is to call them actors." Boodman: "Probably honestly the best… the erlang people stop dropping into your comments."
- **@Nexuist** asked how long a DO lingers in memory. Boodman: "AFAIK no guarantees on linger time but it's short, like minutes."
- **Skeptic @kushbhuwalka:** "durable objects seem like a niche primitive… largely not required imo."
- **@MatijaSosic** made a video explainer based on the thread. Boodman: "This is really well done!"

Why this matters for judging **[I]**: the hosts link this thread as the conceptual primer, and its examples are "multiplayer ai chat", chatrooms and games. Judges primed by it will reward demos that show the single-instance guarantee: two browsers, one agent, and state that never diverges.

**Credibility context [V]:** Boodman has hands-on DO experience. Rocicorp built Replicache/Reflect on Cloudflare. In 2023 he filed workerd issues about DO eviction dropping timers and fetches, and about shared global scope. Kenton Varda explained that each DO gets its own I/O context but may share an isolate. *(background)* ([workerd #1185](https://github.com/cloudflare/workerd/issues/1185), [#1256](https://github.com/cloudflare/workerd/issues/1256)). The practical lesson still applies to any actor runtime: **don't keep state in module-level globals; keep it on the instance.**

Other Boodman posts from the window **[V]**:
- Oct 11 "append-only software" post (~70k views) about agents layering workarounds. ([mirror](https://xitter.cf/aboodman/status/2109385465585684862))
- Oct 16 quote-post of the r2db demo: "A 100GB reactive relational database running out of a single durable object. And yeah, we could add followers to this and scale it out horizontally 😆." ([profile mirror](https://nitter.rdrama.net/aboodman))

---

## 2. Rocicorp: Replicache → Zero → "Zero IVM in a DO"

- **Zero 1.0** was declared stable after "nearly two years… 50+ releases". It was functionally a minor bump from 0.26.2 and added a Supabase publication-change hook. *(background: status page says Mar 2026; InfoQ covered it Jun 8, 2026)* **[V]** ([release notes](https://zero.rocicorp.dev/docs/release-notes/1.0), [InfoQ](https://www.infoq.com/news/2026/06/zero-version-1/))
- **Architecture:**
  - `zero-cache` keeps a read-only replica of your Postgres.
  - `zero-client` answers queries locally "in the next frame", and authoritative results sync in the background.
  - Writes go through your server-side mutators.
  - This is *not* actor-based: Postgres stays the source of truth. **[V]** ([zero.rocicorp.dev](https://zero.rocicorp.dev/))
- **Recent cadence:**
  - Release notes list 1.1 through **1.11**. 1.11 adds a `'cached'` result type, an `onStorageFailure` fallback to memory, Litestream v5 backups by default, and a claimed ~7x faster client cold start.
  - Tags show `zero/v1.12.0-canary.9`. `rocicorp/mono` has about 3,430 stars and was pushed 2026-10-29. **[V]** ([1.11 notes](https://zero.rocicorp.dev/docs/release-notes/1.11), gh API)
- **Roadmap (status page):** Cloud Zero to public availability, column permissions, "Terabugs". "Soon" items are aggregates, SSR and text search. **[V]** ([status](https://zero.rocicorp.dev/docs/status))
- **r2db (Oct 16, 2026), the strongest actor and sync crossover of the quarter [V]:**
  - The demo's link-preview text, as shown on Matt's post, reads "27.1 million issues in a 100.6 GB database of 64 KiB pages in R2, served through a single Durable Object. Every view on the page is a live query it maintains." The demo page body says "100 GiB, 27.1 million issues, 1,535,462 pages of 64 KiB", with R2 holding the base "as 23,992 immutable 4 MiB parts". It opens with "Open a second window.", so the demo is built around multi-window live updates.
  - Only the B+tree interior stays resident: "1,120 branch pages, 73.4 MB, 0.073% of the store".
  - Writes land in the DO's own storage and "go out as a delta to each live query watching them". ([demo.r2db.dev](https://demo.r2db.dev), [r2db.dev](https://r2db.dev))
  - In replies, Matt says it is "wasm in the DO", "We've rewritten the btree, dropped sqlite", and that what broke first was "Query planning, surprisingly!" ([mirror](https://nitter.rdrama.net/tantaman/status/2110946680661287406))
  - The HN submission got only 5 points and 0 comments ([hn.today](https://hn.today/s/100gib-db-served-from-a-durable-object)). The buzz was on X, not HN. **[V]**
- **Known limits of Zero (third-party, background) [V via InfoQ]:** Postgres only, no views, some column types unsupported, a 718 KB uncompressed client bundle, and no SSR.

**Interpretation [I]:** Rocicorp's message is that an actor is a good *host* for a reactive query engine. It is not a replacement for a database. That supports the event's "multiplayer AI" framing: an actor that owns a room can also maintain live views for every subscriber.

---

## 3. Electric: "agents are data", then acquired

- **Electric Agents** *(background, Apr 29, 2026)*: "Agents are not compute. Agents are data. Multi-agent is a sync problem." It is a three-layer stack: Durable Streams at the base, StreamDB/StreamFS state in the middle, and TanStack DB reactive queries on top. **[V]** ([blog](https://electric.ax/blog/2026/04/29/introducing-electric-agents))
- **The explicit anti-actor argument** (launch video transcript) **[V]**:
  - On sandboxes: they model "the agent as a compute node… if the node dies, the agent dies with it."
  - On actors and workflows: they "guard access to the log and trap it behind a predefined interface. So for actors like a durable object you have a web service interface… if you want to subscribe to it or monitor it that has to be allowed and exposed by the API."
  - ([YouTube, Apr 30](https://www.youtube.com/watch?v=OiTqcScOFgE))
- **Aug 11, 2026: Databricks acquires Electric.** The team joins Neon / Lakebase. Databricks' post says "PGlite has grown from 1M to 13M weekly downloads in just twelve months"; Electric's own post gives only the 13M/week figure. "Electric Cloud is winding down. Cloud users will need to self-host or move to another provider." The open-source pieces (Postgres Sync, PGlite, TanStack DB, Durable Streams) stay open. **[V]** ([Electric](https://electric.ax/blog/2026/08/11/electric-joining-databricks), [Databricks](https://www.databricks.com/blog/electric-joins-databricks-bring-wasm-postgres-ai-agent-sandboxes), [The New Stack](https://thenewstack.io/databricks-electric-wasm-agentic-postgres/))
- **Recent blog items** (exact dates not captured): "Electric Circuits: turn any database query live", "Durable Streams at kernel speed" (a Rust server, "nearly a million operations per second on a single 4vCPU machine"), and Electric Agents 0.6. **[V titles/claims]** ([blog index](https://electric.ax/blog))
- **Durable Streams is spreading to actor platforms:** Rivet added official support on Sep 3, saying "Until now, Cloudflare Durable Objects were the only practical way to run Durable Streams" and citing the 10 GB DO SQLite cap. The same post gives a concrete date: "Electric Cloud is winding down on September 10." Electric's and Databricks' posts give no date. Cloudflare's limits page confirms the cap: "Each SQLite-backed Durable Object has a storage limit of 10 GB on a Workers Paid plan." **[V]** ([CF DO limits](https://developers.cloudflare.com/durable-objects/platform/limits/)) ([Rivet changelog](https://rivet.dev/changelog/2026-09-03-durable-streams-now-supports-rivet-actors/))
- GitHub: `electric-sql/electric` has about 10.4k stars. The last push was 2026-10-06, much quieter than Zero, Liveblocks or Convex in late October. **[V]** (gh API) **[I: post-acquisition slowdown]**

**Interpretation [I]:** The "log vs actor" debate is real but reconcilable. An actor can expose its event log as a stream, and Terse broadcasts and DO WebSockets do roughly that. A demo where any observer, including another agent over Agent Relay, can subscribe to an actor's live log speaks directly to Electric's critique.

---

## 4. Jazz: local-first gets more conventional

- **Jazz v2 public alpha** *(background, Apr 17, 2026)*: "a local-first relational database". It has a Rust core, is TypeScript-first, and uses query-driven partial sync.
  - It moved *away* from cryptographic permissions toward "a trusted server applying richer policies at sync time".
  - It describes itself as best for apps that are "collaborative, real-time, local-first, agent-heavy" and calls itself "alpha-quality". **[V]** ([What is Jazz?](https://jazz.tools/blog/what-is-jazz), [classic lessons](https://jazz.tools/blog/what-we-learned-from-classic-jazz))
- **Last 90 days:** steady alpha releases (alpha.57 on Sep 26, alpha.58 on Sep 30, alpha.59 on Oct 4).
  - Upcoming alpha.60 is a **breaking** sync-protocol and storage change ("Row history becomes a single server-ordered sequence instead of a branching graph").
  - The alpha.60 milestone is 93 of 114 items closed (about 82%), so the breaking change is close to shipping and could land around the event. The 2.0-stable milestone is 21 of 71 closed (about 29%). Repo: about 220 stars, 319 open issues plus 63 open PRs (gh search API, 2026-10-29; an earlier draft said "605 open issues", which was wrong). **[V]** ([releases](https://github.com/garden-co/jazz/releases), [milestones](https://github.com/garden-co/jazz/milestones), gh API)
- **Interpretation [I]:** Jazz's own retreat to a trusted server and a single server-ordered history is a quiet endorsement of the single-writer authority model that actors provide. **Avoid it for a 5-hour build**: alpha churn and a breaking release are pending.

---

## 5. PartyKit: the original "actors for multiplayer" DX is now just PartyServer

- **Oct 9, 2026 (Sunil Pai):** hosted PartyKit shuts down. Deploys were turned off **Oct 16**. The platform and its room data were deleted **Oct 23**, and `npx partykit deploy` stopped working the same day. **[V]** ([blog](https://blog.partykit.io/posts/hosted-platform-shutdown/), [migration guide](https://docs.partykit.io/guides/migrate-to-partyserver/))
- PartyServer keeps the model ("rooms, connections, broadcasting, hibernation") as a plain Worker plus Durable Objects deployed with `wrangler`. It runs on the Workers free plan with SQLite-backed DOs. **[V]**
- **The Cloudflare Agents SDK is built on it.** The layering is `DurableObject > Server (partyserver) > Agent`, and `Agent.setState()` persists and broadcasts state to clients. **[V]** ([Agent internals](https://developers.cloudflare.com/agents/agent-class/internals/))
- `cloudflare/agents` released `agents@0.32.0` on 2026-10-29 (about 5.9k stars). `cloudflare/partykit` has about 1.3k stars; its last release was partyserver@0.5.10 on Aug 3. **[V]** (gh API)
- **Gotcha [V→I]:** any tutorial, template or LLM answer that says `npx partykit deploy` is now wrong. If a teammate's muscle memory is PartyKit, they need the PartyServer/wrangler path, and that is Cloudflare's own DO, not a host's product.

---

## 6. Liveblocks: rooms as actor-like units, agents as "native users"

- **Unveil Week** *(background, Apr 6-10, 2026)* added ephemeral agent presence, JSON Patch for Storage ("easier and quicker for a model to generate a set of targeted changes than to rewrite an entire object"), and a Feeds primitive for agent activity logs. **[V]** ([blog](https://liveblocks.io/blog/introducing-feeds-and-apis-for-agent-workflows))
- **Sep 1, 2026:** Storage was renamed **Liveblocks Sync**, "the sync engine for the agentic web", alongside **LiveText**, a Yjs alternative. The canonical agent pattern is server-side `mutateStorage` plus `setPresence` with a TTL, so users see "Thinking…" on the cell the agent is editing. **[V]** ([blog](https://liveblocks.io/blog/introducing-liveblocks-sync-the-sync-engine-for-the-agentic-web))
- Releases v3.24.2 to v3.24.5 shipped Sep 21 to Oct 23. About 4.8k stars. **[V]** (gh API)
- **Interpretation [I]:** "Agent presence + agent activity feed in a shared room" is the UX vocabulary vendors are now converging on. You can rebuild it in an afternoon on a Terse actor: an `@Emittable` presence map plus a persisted feed array. Steal the *UX idea*, not the dependency (it is not a sponsor).

---

## 7. Convex: the "reactive database, not actors" counterpoint

- **Aug 4, 2026:** $57M Series B led by Insight Partners ("Developers and their agents are writing software together"). Apr 2026: "nearly 10,000 paying teams" *(background)*. **[V]** ([Convex News](https://news.convex.dev/))
- **Sep 21:** Convex AI Gateway (model calls without provider keys, on paid plans).
- **Oct 15:** v1.47 (staged validators, `ctx.meta.getSnapshotTs()`).
- **Oct 23:** v1.48 (`ctx.auth.signJwt`; agent-detected `env list` hides values). **[V]** ([gateway](https://news.convex.dev/introducing-convex-ai-gateway/), [v1.47](https://ship.convex.dev/changelog/convex-v1-47-0), [v1.48](https://ship.convex.dev/changelog/convex-v1-48-0))
- **Agent Component (`@convex-dev/agent`):** threads persisted and "live-updates across all connected clients". **[V via secondary]** ([iMasters, Sep 14](https://imasters.com/inteligencia-artificial/convex-gets-official-agent-component-with-built-in-memory-and-rag))
- **Interpretation [I]:** Convex is exactly the "database or nothing" model Boodman contrasts with DOs: one transactional reactive store with OCC, not many single-writer objects. Its October changelog mentions OCC errors and an async rate limiter "that reduces OCC errors under high workloads". That is the contention cost actors avoid by design ([Sequenzy copy of Convex Oct changelog](https://www.sequenzy.com/email-examples/brands/convex/emails/convex-october-changelog-ai-gateway-scim-and-more)). Useful as a talking point in a demo pitch. Don't use Convex at this event; it is not a sponsor and it competes with Supabase.

---

## 8. What the "actor world is hot" discourse actually is (Aug-Oct 2026)

Evidence comes from targeted searches plus a `last30days` run (Sep 30 to Oct 30). X was searched via browser cookies. Reddit public search returned 403, so Reddit coverage is partial. Raw file: `~/Documents/Last30Days/durable-objects-actors-sync-engine-raw-v3.md`.

1. **"Agents need actors" is the main argument, not multiplayer.**
   - @IgorZIJ (Oct 4): "agents make it the standard, required pattern - build your agents any other way and they simply don't work". [V] ([x](https://x.com/IgorZIJ/status/2106535280576544933))
   - @bluequbit (Oct 8): "Durable objects are actually a really great primitive for building async agents." [V] ([x](https://x.com/bluequbit/status/2108072005769802145))
   - InfoQ talk "Actors for Agents" (Oct 22) covers task actors, write-through state and supervision. [V] ([InfoQ](https://www.infoq.com/presentations/actors-for-production-ai-agents/))
2. **The open-source DO-alternative race.**
   - Rivet's Nathan Flurry (Oct 3, ~376 likes): "so much of cloudflare is powered by durable objects… this is why we're building rivet actors". [V] ([x](https://x.com/NathanFlurry/status/2106504171008794660))
   - Rivet 3.0 Preview (Oct 26) puts every actor's SQLite on S3-backed "WarpDrive" storage. [V] ([Rivet](https://rivet.dev/changelog/2026-10-26-introducing-rivet-3-0-preview/))
   - Terse launched "Durable Actors" (Oct 7, @karatzas_thomas, 44 likes and ~11.3k views in the mirror snapshot). The pitch lists "configurable RAM, CPU and data residency per actor", "persist object properties durably by default", and "we don't interleave requests on await by default". The repo was created 2026-08-30 and has 291 stars as of today. [V] ([mirror](https://xitter.cf/karatzas_thomas/status/2107872102829502622), gh API). Terse also published "Terse vs Cloudflare Durable Objects" (Oct 17). It says Terse's self-hosting path is GCP-only (GKE Sandbox, Postgres, GCS) and that Terse is "an architectural alternative rather than an API-compatible replacement". [V] ([Terse blog](https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects))
   - For comparison, `rivet-dev/rivet` has about 6.5k stars (gh API, 2026-10-29).
3. **Durable agent harnesses landing on actors.**
   - Earendil's "Pi Durable" hit **515 points / 77 comments on HN** (Oct 1). [V] ([post](https://earendil.com/posts/pi-durable/))
   - Within weeks there was a Rivet `pi()` integration (Oct 7), a Pi harness in Cloudflare's Agents docs, and a Terse pi-durable adaptor (v0.8.1, Oct 18, per `../terse/02-newest-features.md`; the gh release v0.8.1 is dated 2026-10-18). On Oct 29 Earendil posted "Pi Durable on Cloudflare" (9 HN points that day; [post](https://earendil.com/posts/pi-durable-on-cloudflare/)). [V] (HN Algolia API) ([Rivet](https://rivet.dev/changelog/2026-10-07-introducing-pi-durable-for-rivet/), [CF Agents](https://developers.cloudflare.com/agents/))
4. **Sync engines converge on actors** (r2db in a DO; Durable Streams on DO and Rivet), or argue against them (Electric). See sections 2 and 3.
5. **Skeptic thread.**
   - @DominikTornow (Oct 21): "durable execution / objects / actors / agents require careful design… anyone promising exactly-once processing has their fingers crossed behind their back." [V] ([x](https://x.com/DominikTornow/status/2113042653063364779))
   - "Are Erlang actors the original Durable Objects?" (@yawaramin, Oct 9). [V]

**[I] Synthesis:** "Actor world is hot" means one stateful, addressable, single-writer object per agent, room or session. It persists its own state, wakes on messages and alarms, and streams changes to every subscriber. Sync engines are the client-side half of that same idea.

---

## Hackathon implications

**What to build (sync angle) [I]:**
- **Lead pick: a "Haunted séance room".** One Terse actor per room holds `@Persisted @Emittable` state: transcript, presence, and an agent "possession" status. Several OpenAI agents join as Agent Relay participants and write into the room through the actor's methods. Every browser gets `state_update` pushes. Demo beats:
  - (a) Two laptops plus a phone see identical state, which proves Boodman's "never different participants seeing different state".
  - (b) Kill every tab, reopen, and state plus a pending alarm-driven "haunting" are still there.
  - (c) A late-joining observer agent subscribes to the live event log. This directly answers Electric's "actors trap the log" critique.
- Borrow the Liveblocks UX vocabulary: agent presence with a status string and TTL, plus a persisted **activity feed** per room. It makes multi-agent work visible to judges in seconds.
- **Supabase "scale to millions" pitch:**
  - Hot, fast-moving state lives per actor (no contention, per Boodman).
  - Supabase holds cross-room queries and history, written in batches.
  - Cite r2db as proof a single actor can front very large data.

**Gotchas:**
- Do **not** use hosted PartyKit (dead since Oct 23) or Electric Cloud (winding down). Old tutorials and LLM answers will suggest both.
- Jazz 2 is alpha with a breaking alpha.60 pending. Zero needs Postgres plus a `zero-cache` server. Either one costs more than an hour. Skip a separate sync engine; Terse's emitted state is enough.
- Single-writer means a long LLM call blocks the actor unless the method is interleaved (Terse `@Interleave`; see the terse files). Stream tokens via broadcast and don't hold the mailbox.
- Keep state on the instance, not in module globals (Boodman's workerd issues). Terse evicts after 10 s idle by default (per the terse files; not re-checked in this pass), so persist anything that matters.
- Terse's documented production self-hosting path is GCP-only: GKE Sandbox, Postgres, GCS and Helm (Terse blog, Oct 17). For the demo, run locally or use whatever hosted sandbox the hosts provide on the day. Don't plan to stand up a GKE cluster on Saturday.
- Terse removed client WebSocket reconnect (v0.7.16, per `../terse/02-newest-features.md`). Write your own reconnect that fetches a fresh grant.

**Setup before Oct 31:**
- Prototype the emitted-state, multi-browser loop with `terse init --template counter` (an idea-only prototype is allowed; all event code must be written fresh).
- Prepare a 2-sentence "why an actor, not a DB" pitch quoting the Boodman thread, which the hosts themselves linked.
- Open demo.r2db.dev in two windows once so you can cite it accurately.

**What judges and sponsors likely want [I]:** Visible single-instance shared state across many clients *and* many agents, durability across disconnects, and agents as first-class room participants. That plus Agent Relay hits both host tracks.

---

## Limits / could not verify

- The X URL itself was not fetched. Thread text and view and like counts come from two independent Nitter-style mirrors that agree. Counts are snapshots.
- I could not confirm whether the event organizers have any affiliation with Boodman or Rocicorp. The link is most likely just the best-known plain-English DO explainer.
- I did not confirm Greg McKeon's or Josh Howard's current employers from primary sources. The thread implies Cloudflare DO team history; treat that as unverified.
- Exact publish dates for Electric's "Circuits", "Durable Streams at kernel speed" and "Agents 0.6" posts were not captured.
- The r2db demo is a Rocicorp experiment. It is not a shipped Zero product and pricing or availability is unknown.
- Social coverage is partial: Reddit public search returned 403, YouTube transcripts failed, and TikTok and Instagram were not configured. HN signal on r2db was tiny (5 points).
- The Convex Agent Component description comes via a secondary outlet (iMasters), not Convex docs fetched directly.

## Sources

- Boodman DO thread (Aug 14, 2026): https://xitter.cf/aboodman/status/2088155104851657110 · https://nitter.rdrama.net/aboodman/status/2088155104851657110
- Boodman profile/timeline: https://nitter.rdrama.net/aboodman · append-only post: https://xitter.cf/aboodman/status/2109385465585684862
- tantaman r2db post: https://xitter.cf/tantaman/status/2110946680661287406 · https://nitter.rdrama.net/tantaman/status/2110946680661287406 · https://demo.r2db.dev · https://r2db.dev · https://hn.today/s/100gib-db-served-from-a-durable-object
- workerd issues: https://github.com/cloudflare/workerd/issues/1185 · https://github.com/cloudflare/workerd/issues/1256
- Zero: https://zero.rocicorp.dev/ · https://zero.rocicorp.dev/docs/release-notes/1.0 · https://zero.rocicorp.dev/docs/release-notes/1.11 · https://zero.rocicorp.dev/docs/status · https://www.infoq.com/news/2026/06/zero-version-1/
- Electric: https://electric.ax/blog/2026/04/29/introducing-electric-agents · https://www.youtube.com/watch?v=OiTqcScOFgE · https://electric.ax/blog · https://electric.ax/blog/2026/08/11/electric-joining-databricks · https://www.databricks.com/blog/electric-joins-databricks-bring-wasm-postgres-ai-agent-sandboxes · https://thenewstack.io/databricks-electric-wasm-agentic-postgres/
- Jazz: https://jazz.tools/blog/what-is-jazz · https://jazz.tools/blog/what-we-learned-from-classic-jazz · https://github.com/garden-co/jazz/releases · https://github.com/garden-co/jazz/milestones
- PartyKit / Cloudflare: https://blog.partykit.io/posts/hosted-platform-shutdown/ · https://docs.partykit.io/guides/migrate-to-partyserver/ · https://github.com/cloudflare/partykit/blob/main/packages/partyserver/README.md · https://developers.cloudflare.com/agents/ · https://developers.cloudflare.com/agents/agent-class/internals/
- Liveblocks: https://liveblocks.io/blog/introducing-feeds-and-apis-for-agent-workflows · https://liveblocks.io/blog/ai-agents-are-becoming-native-users-of-software · https://liveblocks.io/blog/introducing-liveblocks-sync-the-sync-engine-for-the-agentic-web · https://liveblocks.io/docs/use-cases/agentic-users
- Convex: https://news.convex.dev/ · https://news.convex.dev/introducing-convex-ai-gateway/ · https://ship.convex.dev/changelog/convex-v1-47-0 · https://ship.convex.dev/changelog/convex-v1-48-0 · https://imasters.com/inteligencia-artificial/convex-gets-official-agent-component-with-built-in-memory-and-rag · https://www.sequenzy.com/email-examples/brands/convex/emails/convex-october-changelog-ai-gateway-scim-and-more
- Actor discourse: https://x.com/NathanFlurry/status/2106504171008794660 · https://x.com/IgorZIJ/status/2106535280576544933 · https://x.com/bluequbit/status/2108072005769802145 · https://x.com/DominikTornow/status/2113042653063364779 · https://x.com/yawaramin/status/2108602575922852305 · https://www.infoq.com/presentations/actors-for-production-ai-agents/ · https://earendil.com/posts/pi-durable/ · https://rivet.dev/changelog/2026-10-07-introducing-pi-durable-for-rivet/ · https://rivet.dev/changelog/2026-09-03-durable-streams-now-supports-rivet-actors/ · https://rivet.dev/changelog/2026-10-26-introducing-rivet-3-0-preview/
- GitHub API (stars, releases, push dates as of 2026-10-29): rocicorp/mono, electric-sql/electric, garden-co/jazz, cloudflare/partykit, cloudflare/agents, liveblocks/liveblocks, get-convex/convex-backend, rivet-dev/rivet, TerseAI/durable-actors
- Added in verification: https://developers.cloudflare.com/durable-objects/platform/limits/ · https://xitter.cf/karatzas_thomas/status/2107872102829502622 · https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects · https://earendil.com/posts/pi-durable-on-cloudflare/ · https://hn.algolia.com/api/v1/search?query=pi%20durable&tags=story
- Cross-reference: ../terse/01-docs-api.md, ../terse/02-newest-features.md (Terse `@Emittable`, reconnect removal, pi-durable adaptor)

## Verification log (2026-10-29)

Adversarial re-check of 15 decision-relevant claims against live sources. The X URLs themselves return SOURCE_NOT_AVAILABLE, so X claims were checked through the xitter.cf mirror.

| # | Claim | Method / source | Outcome |
|---|---|---|---|
| 1 | Boodman DO thread dated Aug 14, 2026; head post ~127.9k views and 813 likes; quoted text ("serverless objects", "database or nothing", "batch saves every 5s") | xitter.cf mirror re-fetched | **Confirmed.** Reply view counts drifted by 1 (50,597 / 16,497 / 11,514). These are snapshot noise, so no change was made. |
| 2 | McKeon "Internal name was originally 'Actors'..." and Boodman "I think Actors would have been good" | Same mirror | **Confirmed** verbatim. |
| 3 | Event page links this exact thread under "Don't Know What Actors/Durable Objects Are?" | `EVENT_PAGE.md` line 96 | **Confirmed.** |
| 4 | tantaman r2db post on Oct 16; "wasm in the DO"; "dropped sqlite"; "Query planning, surprisingly!" | nitter.rdrama.net mirror | **Confirmed.** |
| 5 | Demo page text "27.1 million issues in a 100.6 GB database..." | demo.r2db.dev fetched | **Corrected.** That sentence is the link-preview text quoted on the tweet, not the page body. The page body ("100 GiB, 27.1 million issues, 1,535,462 pages"; "1,120 branch pages, 73.4 MB, 0.073%") was added. |
| 6 | HN r2db submission had 5 points and 0 comments; Pi Durable had 515 points and 77 comments on Oct 1 | HN Algolia API | **Confirmed** for both. Added: "Pi Durable on Cloudflare" (Oct 29, 9 pts). |
| 7 | Hosted PartyKit shutdown timeline (Oct 9 / 16 / 23; `npx partykit deploy` stops Oct 23) | blog.partykit.io | **Confirmed** verbatim. |
| 8 | Databricks acquired Electric on Aug 11; Electric Cloud winding down; OSS stays open; PGlite went from 1M to 13M weekly downloads | Electric and Databricks blogs | **Confirmed, with an attribution fix.** The 1M-to-13M figure is in Databricks' post; Electric's post says only 13M/week. **Added** the Sep 10 wind-down date, which appears in Rivet's Sep 3 changelog. |
| 9 | Rivet Durable Streams support on Sep 3; "Until now, Cloudflare Durable Objects were the only practical way..."; 10 GB cap | rivet.dev changelog; CF DO limits page | **Confirmed.** CF limits page confirms 10 GB per SQLite-backed DO (Paid plan). |
| 10 | Liveblocks Sync launched Sep 1, "the sync engine for the agentic web", formerly Storage, with LiveText as a Yjs alternative | liveblocks.io blog | **Confirmed.** |
| 11 | Convex $57M Series B on Aug 4, led by Insight Partners; v1.48 on Oct 23 with `ctx.auth.signJwt` and agent-aware `env list` | news.convex.dev; ship.convex.dev | **Confirmed.** |
| 12 | Zero 1.11 features (`'cached'`, `onStorageFailure`, Litestream v5 default, ~7x cold start); tag `zero/v1.12.0-canary.9`; mono ~3,430 stars | Release notes; gh API | **Confirmed.** |
| 13 | Jazz alpha.57/58/59 dates; alpha.60 breaking; 2.0-stable 29%; ~220 stars; "605 open issues" | gh API (releases, milestones, search) | **Corrected.** Actual: 319 open issues plus 63 open PRs. Release dates and the 29% figure (21/71) are right. **Added** that alpha.60 is 93/114 closed, so it is imminent. |
| 14 | `agents@0.32.0` released 2026-10-29; partyserver@0.5.10 Aug 3; star counts (agents 5.9k, partykit 1.3k, liveblocks 4.8k, electric 10.4k with last push Oct 6); Electric description "The agent platform built on sync." | gh API | **Confirmed.** |
| 15 | Terse launch on Oct 7 with ~44 likes; ~290 stars; X quotes from IgorZIJ, bluequbit, NathanFlurry and DominikTornow; InfoQ "Actors for Agents" on Oct 22 | xitter.cf mirrors; gh API; InfoQ | **Confirmed.** 44 likes and 291 stars. All four X quotes match verbatim. The InfoQ talk is by Manju Rajashekhar (QCon AI), dated 2026-10-22. Added Terse's Oct 17 comparison post (GCP-only self-host). |

Not re-verified in this pass, so treat these as resting on the original research: the Electric launch-video transcript quotes (YouTube not fetched), the Liveblocks Unveil Week details, the Convex v1.47 and AI Gateway specifics beyond the headline, the iMasters Agent Component claim, the @yawaramin post, the Terse 10 s idle eviction and v0.7.16 reconnect removal (gh release v0.7.16 exists, dated Oct 7, but its contents were not re-read), and the Boodman Oct 11 and Oct 16 posts. No fabricated URLs or quotes were found among the items checked.
