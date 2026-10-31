# Actor patterns for AI: a design catalogue for Haunted Hacks

Checked **29 Oct 2026** for Haunted Hacks (Sat 31 Oct 2026, SF, 11:00 to 16:00 build window). **Angle:** how to map AI systems onto actors: an actor per agent, session, room or document; alarms for long-running loops; single-writer state; fan-out; supervision; human-in-the-loop. Each pattern comes with a Terse Durable Actors sketch and a demo beat. Other files in this folder cover Cloudflare DO internals (01) and durable execution (02), so I do not repeat them here.

**Method.** I shallow-cloned `TerseAI/durable-actors` (HEAD `20d2899`, 29 Oct), `TerseAI/whitechapel` (HEAD 9 Oct) and `TerseAI/talkingAgent`, and read the actor source directly. I read the README of every TerseAI showcase repo with `gh`. I read the Cloudflare Agents docs, the Rivet actor and agent design-pattern docs, the InfoQ/QCon AI talk "Actors for Agents" (22 Oct 2026), and 2026 hackathon-winner write-ups (via Exa). I ran none of the code. Labels: **[V]** = verified in a primary source (URL in Sources). **[I]** = my inference or design. **[BG]** = background material dated before Aug 2026. The code sketches are **untested designs** built on the documented Terse API.

---

## TL;DR

- **The actor model fits agents almost one-to-one, and the industry is now saying so.** An actor is an addressable unit with a mailbox, private state, single-threaded handling and supervision. An LLM agent has identity, memory, a receive → reason → act loop and failure modes. The QCon AI talk (Oct 22) lists five patterns: task actors, write-through state, indirect continuations, mutable execution graphs, and supervision boundaries [11]. Cloudflare's docs call agents "durable identities, not always-on processes" [4]. Rivet's pitch is "One Actor per agent, per session, per user" [8]. [V]
- **Terse gives you a narrower primitive set than Cloudflare or Rivet.** You get one alarm per actor, no built-in scheduler table, no monitor or link, no workflow engine, no `waitForApproval`, and actor-to-actor calls only through an HTTP stub with an API key. The patterns below are therefore **built from `@Persisted` + SQLite + one alarm + broadcast**. That is a feature for judges: you visibly build the supervision tree or approval gate yourself. [V for the API surface, I for the framing]
- **The most important Terse-specific pattern is "single writer, slow LLM."** A default method holds the mailbox across `await`, so a 20-second LLM call freezes the room. `@Interleave` fixes the freeze but removes rollback for the **whole class** [3] (and the guide is inconsistent about whether default calls roll back at all; see section 5). The Terse team's own Whitechapel game solves this with a **reserve → claim (lease) → save draft → commit** protocol keyed by request ID, and it is the best pattern to copy (section 2, P3). [V]
- **Durability claims are judged by the "kill it" moment.** The wow beats that work on stage: (1) kill the process or close every tab, reopen, and state and conversation are intact; (2) two or more screens, or audience phones via QR, all update live; (3) an agent goes offline, its messages queue, and it resumes. Each needs a pattern deliberately designed for it. [I, grounded in demo evidence in section 4]

---

## 1. Primitive map: Terse feature to AI concept [V unless marked]

| AI need | Terse primitive | Hard constraint to design around |
|---|---|---|
| Agent / session identity | `actors.X.get(id)`, IDs of 1 to 128 chars `[A-Za-z0-9._-]` | A new ID means fresh empty state. **Instances cannot be deleted** (issue #228), so use `room-${Date.now()}` per demo run [2] |
| Memory / transcript | `@Persisted` fields + `this.db` SQLite | **Nested mutation is not saved.** Write `this.msgs = [...this.msgs, m]`, never `.push` [3] |
| Live UI | `@Emittable` (initial `state`, then `state_update` diffs), `broadcast(msg, {tags, except})`, `socket.setTags` | Client `.broadcast()` skips actor code and is not persisted [3] |
| Serialised turns / locks | Default mailbox: one call at a time, **held across `await`** | One slow LLM call blocks everyone [3] |
| Concurrency during LLM I/O | `@Interleave` | Any `@Interleave` in a class disables rollback for **every** call in that class [3] |
| Timers / loops | `this.alarm.set(epochMs)` + `onAlarm()` | **One alarm per actor.** Setting it again replaces the old one. It fires while the actor is dormant [3][1] |
| Background work after return | `@Resource` implementing `ActorResource.onResume / onGracefulShutdown` | The shutdown hook is skipped on a crash. An unhandled rejection "would crash the actor Worker and fail every running invocation" (comment in `background-gym`) [1] |
| Idle lifecycle | 10 s idle default, `@Compute({ idleTimeoutMs })` (1 ms to 24 h) | "Open WebSockets remain at the gateway and do not keep the sandbox alive" [1 configuration.md] |
| All-or-nothing step | `@Atomic` | Applies to the method only. There is no cross-actor transaction [3] |
| Actor → actor | `createActorStub(name, id, methods, transport)` from `terse-sdk/actors` with `ActorAccessTransport(credentials)` | Not documented in the HEAD docs. Whitechapel deep-imports `terse-sdk/dist/actorAccess.js` and passes an actor URL + API key from env [5]. Whitechapel pins `durable-actors@0.7.16` and `terse-sdk@0.9.15`; current npm is `durable-actors@0.14.4`, `terse-sdk@0.14.7`, so this path may have moved. The documented backend entry point is `createActorTransport` from `durable-actors/backend` |
| Exactly-once | none | **`requestId` does not deduplicate**, and the SDK never auto-replays. Store your own idempotency keys [2] |

---

## 2. The pattern catalogue

### P1. Actor per agent / session / task (the keying decision)

**What.** The actor ID is the agent's memory boundary. Rivet's guidance names three choices: **per user** (an assistant that remembers everything), **per thread** (each chat tab or ticket is separate), **per task** (fresh context per job, destroyed when done). It also names the anti-pattern: one key for everyone means "a prompt from one user waits in the queue while another user's prompt runs" [9]. Rivet's general rule is the same: `ChatRoom` or `Document` is a good actor, while `Application` is too broad and `DocumentWordCount` too granular [8]. [V]

**Terse evidence.** The Mastra example README: "Each chat has one durable actor that owns its conversation history, connected clients, and Mastra agent turns" [6]. The Terse homepage (scraped 29 Oct): "Each agent can have its own Durable Actor, and each user can connect to that Actor via websocket. This is fully horizontally scalable" [23]. [V]

**Choose for the demo.** Per-room for multiplayer. Per-agent when agents must survive independently, which supervision needs. Per-task for software-factory jobs. [I]

### P2. Actor per room / document (multiplayer AI)

**What.** All humans and AI participants in one space talk to one actor. It owns the transcript, the game state and the socket list, and it fans every change out with `broadcast`. This is the core Durable Objects insight: "a tiny, long-lived server that is guaranteed to be unique for a specific ID" [12] **[BG, Nov 2025]**. [V]

**Terse evidence.** Whitechapel uses a **three-level hierarchy**: `CaseActor` (the room or game, ~20 `@Persisted` fields: phase, votes, log, members), `SceneActor` (one per location, ID `entityActorId(caseId, location)`), and `ConversationActor` (one per NPC per case) [5]. All three set `@Compute({ idleTimeoutMs: 5000 })`. NPC chats scale independently of the room, and the room stays the authority. [V]

```ts
// Sketch [I]: haunted room. Terse API names from [3].
import { Actor, Persisted, Emittable, Interleave } from "durable-actors" // package name in README/examples at 20d2899
type Msg = { who: string; text: string; at: number }
export class HauntedRoom extends Actor<{ player: string }, { say: string }, { type: "token"; t: string }> {
  @Persisted @Emittable transcript: Msg[] = []
  @Persisted @Emittable phase: "lobby" | "seance" | "reveal" = "lobby"
  async say(player: string, text: string) {
    this.transcript = [...this.transcript, { who: player, text, at: Date.now() }] // reassign, never push
  }
}
```

### P3. Single-writer authority with a slow LLM (the Terse-specific core)

**Problem.** The actor's value is single-writer state: no races on a CRM, ledger, scoreboard or codebase index. Terse's homepage pitches it directly: "Since only one request is handled at a time, you can protect critical data such as a CRM and allow multiple agents to run concurrently without worrying about data races" [23]. (Earlier drafts paraphrased this as "actor as a lock around shared data"; that exact phrase is not on the page.) An LLM call inside a default method holds that lock for its full duration, and the docs warn that the "Impact could be catastrophic" [2]. [V]

**Three solutions, cheapest first:**

1. **`@Interleave` on the LLM method** (Mastra example, Pi example [1]). Simple. You lose rollback class-wide, so keep invariants simple and use reassign-only writes. [V]
2. **Floor control / turn token.** `talkingAgent`'s `CountingRoom` keeps `count` and `running` persisted and computes `speakerId = sortedParticipants[count % n]`. On each `increment` it broadcasts `{state, speakerId}`, so the actor referees **which agent may speak next**, and agents run their LLM calls outside the actor [7]. Ideal for an AI séance or debate where turns are the point. [V]
3. **Lease-and-commit (Whitechapel).** `ConversationActor.prepareInterview(identity, id, action)` returns the saved result if `id` was seen before, which is an idempotency check. It returns "Waiting for a response" if another turn is pending. Otherwise it asks the authority `CaseActor.prepareInterview` for context and **reserves** the turn. A worker then calls `claimInterview(id, worker)` and `saveInterview(id, worker, draft)` while generating. `commitInterview` checks `turn.worker === worker && turn.workerUntil > Date.now()`, throws "Generation ownership expired." if not, and only then calls `CaseActor.commitInterview` [5]. The LLM never runs while the authority's mailbox is held, a crashed worker's lease just expires, and retries are safe. [V]

**Recommendation.** Use (1) for chat, (2) for turn-based games, and (3) whenever an AI action mutates shared truth such as votes, money or files. [I]

### P4. Alarms for long-running loops (the "agent that keeps going while you're gone")

**What.** An agent loop must outlive any single request. Terse offers two mechanisms. [V]

- **Alarm tick.** `onAlarm()` does one bounded step (one LLM call, one tool), persists progress, then calls `this.alarm.set(Date.now() + interval)` to re-arm. The alarm clears after firing unless `onAlarm` sets a new one [3]. One step per wake makes it crash-safe: a dead step is simply retried on the next tick. [V mechanics, I design]
- **Resource loop.** `background-gym`'s `JobRunner` stores jobs in SQLite. `start()` returns **before any step runs**, and `onResume()` restarts every job `WHERE done < steps` on each activation [1]. That is the Pi-harness model: "jobs live in SQLite and resume in the background after each activation." [V]

**Gotchas.** (a) **One alarm per actor.** For several timers (heartbeat + deadline + reminder), keep a `timers(due, kind, payload)` table and always `alarm.set(min(due))`. Cloudflare's Agents SDK does exactly this: "Durable Objects only allow one alarm at a time, the `Agent` class works around this by managing multiple schedules in SQL and using a single alarm" [4b]. (b) The docs do not say whether a `@Resource` loop keeps the actor past `idleTimeoutMs`. "Running handlers defer eviction" [1], but a detached promise is not a handler. **Pair a resource loop with an alarm heartbeat**, so that if the actor is evicted, the alarm wakes it and `onResume` restarts the loop. [I, unverified] (c) Cloudflare's version of the same lesson: "A heartbeat only prevents idle eviction. A deploy or crash still stops the work, so schedule a job" [4b]. [V]

```ts
// Sketch [I]: alarm-driven agent loop with a multiplexed timer table.
async onAlarm() {
  const due = this.db.exec<{id:number;kind:string}>("SELECT id, kind FROM timers WHERE due <= ? ORDER BY due", Date.now())
  for (const t of due) { await this.step(t.kind); this.db.exec("DELETE FROM timers WHERE id = ?", t.id) }
  const [next] = this.db.exec<{due:number}>("SELECT min(due) AS due FROM timers")
  if (next?.due) this.alarm.set(next.due)
}
```

### P5. Fan-out / fan-in (orchestrator + workers)

**What.** A coordinator actor splits a job into N subtasks, starts one worker actor per subtask, and aggregates their reports. Rivet's map-reduce example has workers call back into `coordinator.reportResult` [8]. Rivet's multi-agent guide adds the **crash-safe** details: worker IDs are memoised with the tool call, so a rerun after a crash "reaches the same researchers instead of starting new ones", and "a researcher that already answered returns its saved answer for the same `requestId`" [10]. [V]

**Terse translation.** Workers are `actors.Worker.get(\`${jobId}.${i}\`)`. Deterministic IDs are the memo. The coordinator stores `results(i, output)` and is "done" when `count = N`. Because Terse `requestId` does not deduplicate [2], every worker method must check its own `done` row first, which is the Whitechapel pattern again. In-actor fan-out needs the undocumented stub transport (section 1), so **for the hackathon, fan out from your backend or through Agent Relay** and let each actor fan in. [I]

**Agent Relay variant (double-bonus).** The coordinator posts subtasks to a channel. Worker agents (each backed by its own actor holding its `at_live_*` token) claim and reply in threads. A Relay action (`haunt.spawn_ghost`-style, fire-and-forget, result delivered as `action.completed`) gives typed dispatch. See `../agent-relay/01-docs-api.md`. [V for the Relay primitives, I for the composition]

### P6. Supervision tree (let it crash, then restart by policy)

**What.** The Erlang/OTP strategies map onto agents. `one_for_one` restarts only the failed subagent, `one_for_all` restarts a group whose shared context is corrupt, escalation sends the failure up to the orchestrator to re-plan, and max restart intensity acts as a circuit breaker [13]. The QCon talk frames supervision as "a part of this system failed, what policy should I use it for this boundary? Should I restart it? ... Should I ask the user what to do?" [11]. [V]

**Terse translation.** Terse has **no monitor or link primitives**, so you build supervision from heartbeats. [I]

```
          Supervisor actor (id: swarm-<run>)
          @Persisted children: {id, lastBeat, restarts, status}[]
          onAlarm every 5s: any child with now - lastBeat > 15s → policy
             ├─ restarts < 3 → reset child's lease, re-dispatch its task (one_for_one)
             ├─ restarts ≥ 3 → status="parked", broadcast to UI (circuit breaker)
             └─ semantic failure (bad JSON, policy refusal) → escalate to human (P7)
     ┌──────────────┬──────────────┬──────────────┐
  Worker actor   Worker actor   Worker actor     (each: task row, checkpoint, beat())
```

Encode **non-retryable** errors explicitly. A malformed model response can be retried, but a compliance rejection should not be. This advice comes from a low-provenance blog [16], but it matches OTP practice. The visible "restarts: 2/3" counter on screen *is* the demo. [I]

### P7. Human-in-the-loop (approval gates that survive disconnects)

**What.** Cloudflare's HITL guide sorts approvals by layer (MCP elicitation, Workflow `waitForApproval()`, Code Mode `requiresApproval`). It recommends timeouts with `schedule()` escalation, an SQL audit trail, and to "Store pending approvals in agent state so they survive disconnections" (page updated **Oct 27, 2026**) [4c]. Its long-running guide notes that agent-internal approval means "Build it yourself (state + WebSocket)" [4]. That is exactly the Terse situation. [V]

**Terse translation.** [I]
1. The agent reaches a risky tool call and writes `@Persisted @Emittable pending = {id, tool, args, reason, expiresAt}`. That pushes it to every connected client.
2. It adds a `timers` row at `expiresAt` (P4) for auto-reject or escalation.
3. `approve(id, user)` / `reject(id, user)` are ordinary methods. They check `pending.id === id` (idempotent), append to an `approvals` audit table, and resume the plan.
4. With Agent Relay, register the human as an agent with `type: "human"` and DM the approval request, so the "agent escalates to a human" moment is visible in the observer stream. Agent Relay's own pitch includes this (`../agent-relay/05-team-strategy.md`, "an agent that escalates to a human"). Relay docs confirm `POST /agents` registers "an agent, human, or system identity" [24]. Flows "can resume if it stops halfway" [24]; the "gates" and "human steps" / `flows answer` claims from sibling research were **(unverified)**: not found in the flows or relaycast-api pages fetched 29 Oct. [V for human identity and resume]

### P8. Actor-as-agent on the Relay bus (the bonus-points composition)

**What.** Durable Actors provide *state, lifecycle, single-writer*. Agent Relay provides *addressing, durable delivery, channels, presence, observer stream*. Each actor holds one Relay identity (`at_live_*` stored in `@Persisted`, created once with `POST /agents`; the token is "returned once", so persist it. A `reconnect` SDK call is (unverified); the docs say reconnecting nodes "replay unacked work through `GET /deliveries`" [24]). Relay webhooks or subscriptions deliver inbound messages to your backend, which calls `actors.Agent.get(name).onRelayMessage(msg)`. The actor decides and replies via Relay REST. Use `mode: steer` for interrupts and `mode: wait` (the default) for normal turns; channel posts also accept an `Idempotency-Key` header, useful because Terse `requestId` does not dedupe [24]. [V for Relay primitives; I for the bridge, which nobody has published]

**Why judges care.** Agent Relay's sweet spot is "an agent going offline and catching up from durable messages" [`../agent-relay/05-team-strategy.md`]. With Terse behind each agent, the agent comes back **with its memory intact**, not just its inbox. [I]

### P9. Coordinator / index actor (the lobby)

Data actors can't be queried across, so keep a single `Lobby` actor that lists rooms or agents (Rivet "coordinator & data actors" [8]). Terse's docs FAQ (as cited in `../terse/01-docs-api.md`; not re-found in the 29 Oct docs pages I fetched, so treat as (unverified) today): "Actor calls do not create a transaction across several actors. Coordinate cross-actor work explicitly." The "use a database for cross-entity queries" part is a paraphrase, not a quote. For the "scale to millions" Supabase prize, mirror room summaries to Supabase Postgres instead of a hot lobby actor. [V for the guidance, I for Supabase]

---

## 3. Architecture sketches for a 5-hour build [I]

**A. "Séance" (multiplayer room + NPC agents + supervisor): the safest strong demo**
```
 phones (QR) ─ws─┐                              ┌─ Relay channel #seance (observer on big screen)
 big screen ─ws──┤→ HauntedRoom actor ──────────┤
                 │   transcript, phase, votes   └─ Ghost agents (OpenAI / Mastra), each = GhostActor
                 │   floor control (P3.2)            memory, persona, at_live token (P8)
                 │   alarm: 30s round timer (P4)
                 └→ Lobby actor (P9)            Supervisor actor: ghost heartbeats (P6)
```
Demo beats: audience joins by QR. Ghosts take turns via speakerId. Kill a ghost process and the supervisor restarts it, and it resumes with memory (Terse) and with queued messages (Relay).

**B. "Ghost workers" (fan-out on guarded shared state)**
```
 backend → Coordinator actor (plan, results table) ─fan-out─→ Worker actors ×N (lease, checkpoint)
                 ↑ fan-in reportResult (idempotent by subtask id)        │ LLM outside mailbox (P3.3)
           Ledger actor = single writer for the shared CRM/codebase index ← commit(lease)
```
Demo beat: 8 agents hammer one ledger while a live counter shows "0 conflicting writes, 0 duplicated tasks".

**C. "Software factory with a crypt-keeper gate" (long-running + HITL)**
Per-task `Job` actor with an alarm-driven loop (P4) over plan steps, running in a Freestyle/Superserve sandbox through `@Resource`. Risky steps (deploy, delete) stop at `pending` (P7) and a human approves from a phone. A timeout escalates. Riskier: the mini-lovable template needs sandbox credentials and caused bug #351 (`../terse/03-github-code.md`).

---

## 4. Canonical demos that wow, and the beat each proves

| Demo (source) | Date | What made it land | Pattern it proves |
|---|---|---|---|
| **DoodleDash**, SpacetimeDB hackathon grand prize [14] | Jun 2026 [BG] | "live demo with 16 people from the audience all playing at once"; the AI roasting each drawing; QR join | P2 room actor + broadcast; audience participation |
| **Identity Matrix**, UofTHacks 13 1st place [15] | Jan 2026 [BG] | "When a player disconnects, their avatar becomes an AI-controlled robot" | P1 + P4: agent continues when the human leaves |
| **Meta Chess**, Metabase AI Hackathon winner [17] | May 2026 [BG] | Claude vs Codex, with the shared state acting as "a chessboard, a referee, and a livestream all at once" | P3 floor control; P8 (agents sync through one source of truth) |
| **Mistralverse**, Mistral London winner [18] | Mar 2026 [BG] | "Every citizen is an AI agent which has the ability to vote, build on land, trade and communicate" | P1 at scale, P5 |
| **Whitechapel** (Terse team) [5] | Oct 2026 | Co-op voice murder mystery, NPCs "with individual goals and persistent memory" | P2 hierarchy, P3 leases |
| **Tiny Lovable** (Terse cofounder Thomas Karatzas) | Oct 19 (date and ~3.3K views per `../terse/04-social-pulse.md`, unverified here) | "I built a tiny Lovable with @pidotdev durable, @modal and @IncTerse Durable Actors ... Maybe it becomes a software factory" (text confirmed via Nitter mirror [20b]) | P4 + `@Resource` sandbox |
| **Agent-coordination demo** (Karatzas) [20b] | Oct 8 | "Demo showing how you can coordinate agents with Durable Actors! This almost won me the @ycombinator demo showcase" (which repo it shows is unverified; talkingAgent was pushed the same day) | P3 floor control |
| **Mastra split panes** (Terse) [6] | Oct 18 | "Open the same chat ID in two browser tabs to see shared replies. Reload after a reply finishes to restore the saved history." | Two-tab + reload durability beat |

**Inference: the repeatable formula.** (1) Many screens, ideally the audience's. (2) Something that happens while nobody is watching (alarm loop, offline takeover). (3) A visible kill → resume. (4) An AI personality with a reaction-getting output (the roast). The Halloween theme gives (4) for free with ghosts, séances and a crypt-keeper.

---

## 5. Anti-patterns that will bite on Saturday

- `this.arr.push()` on `@Persisted`. The repo README's OpenAI sample does it (`this.messages.push(...)` inside an `@Interleave` method), and Whitechapel's `ConversationActor.configure` writes `this.members[member.playerId] = ...` [5]. The guide says nested mutations "only change memory; they are not saved, even at method completion" [3]. Inference: Whitechapel pins `durable-actors@0.7.16`, so it may predate the rule, or it is a latent bug. **Always reassign.** [V for the docs rule]
- **Assuming default rollback.** At `20d2899` the TypeScript guide contradicts itself: the Interleave section says "A failed call normally rolls back its field and SQLite changes", while the SQLite section says "Each SQL write and each `@Persisted` assignment is saved as it happens ... If the method throws, writes made before the error stay saved" and that only `@Atomic` gives all-or-nothing [3]. Design as if writes are immediate, and use `@Atomic` on the commit step when it matters. [V for the contradiction]
- **Duplicate upserts in `onResume`.** Issue #351 (opened and closed 28 Oct): an immediate `db.exec` that rewrites a row with identical bytes made the first activation of each new actor fail (`actor activation was not completed: channel closed`). Found in the mini-lovable demo. Fixed in #352, shipped in v0.14.1+. Pin ≥0.14.1 if you use the P4 resource-loop pattern. [V]
- Awaiting an LLM in a non-interleaved method of a room actor freezes the room (P3).
- Using `setTimeout` or a `setInterval` loop for agent ticks. Timers die with eviction. Aaron Boodman's 2023 workerd issue documents exactly this failure mode on DOs ("If you set a timer from a DO and the DO is evicted, the callback for the timer is not called") [19] **[BG]**. Use the alarm.
- Trusting `requestId` for dedupe [2]. Store a `seen(id)` row.
- One global "Application" actor [8]. It becomes the bottleneck and the opposite of the "scale to millions" story.
- Relying on undocumented actor-to-actor stubs without testing on Oct 30.

---

## Limits / could not verify

- **No code was executed.** All sketches are untested. The `createActorStub` + `ActorAccessTransport` path is read from Whitechapel source only. It deep-imports `terse-sdk/dist/actorAccess.js`, which may break across the very frequent releases.
- Whether a detached `@Resource` loop survives past `idleTimeoutMs` is **unverified**. The docs cover handlers, not background promises.
- The aboodman X post linked on the event page (status 2088155104851657110) **could not be fetched** (Exa returned SOURCE_NOT_AVAILABLE). I do not know its content.
- The Terse TypeScript guide at `20d2899` is internally inconsistent on default rollback (section 5). Only a test on Oct 30 settles it.
- The cross-actor transaction FAQ quote and the Relay Flows "gates / human steps" claim come from sibling research and were not re-found in the live pages on 29 Oct.
- I found **no published Terse + Agent Relay integration** (consistent with `../terse/03-github-code.md`). P8 is a design, not a documented pattern.
- The hackathon-winner examples are from other events and stacks (SpacetimeDB, Supabase, Metabase). They show what audiences respond to, not what these judges will reward.
- The luxarastore playbook [16] has unclear provenance. I cite it only for a point that also matches OTP practice.

---

## Hackathon implications

**What to build.** Architecture A (Séance) is the best risk/reward. It uses P1, P2, P3.2, P4, P6 and P8, hits both tracks plus "Real-Time AI", and mirrors the Terse team's own showcase (Whitechapel, talkingAgent). Add P7 as a 30-minute stretch: "the ghost wants to *do* something; the audience votes to allow it".

**Build order (5 h).** 0:00 to 0:45: room actor with emitted transcript, two tabs syncing. 0:45 to 1:45: ghost agents with `@Interleave` LLM turns and floor control. 1:45 to 2:30: alarm round timer and heartbeats. 2:30 to 3:15: Relay channel and observer stream on the big screen. 3:15 to 4:00: supervisor kill/restart beat, QR join. 4:00 to 5:00: rehearse the demo and freeze the code.

**Setup before Oct 31 (allowed: no event code).** `bun upgrade` to ≥1.4.2 (README: "Install Bun 1.4.2+"). Pin `terse-cli` and `durable-actors` versions: 12 tagged releases shipped 24 to 29 Oct (v0.11.0 to v0.14.4), three of them on 29 Oct UTC (v0.14.2, v0.14.3, v0.14.4). Do one full `terse init → actor dev → generate → deploy`. **Test on Oct 30, in a scratch repo:** (a) alarm re-arm inside `onAlarm`, (b) reassign-only persistence across a kill, (c) the actor-to-actor stub, (d) whether a `@Resource` loop survives idle, (e) whether a throwing default (non-`@Atomic`) method rolls back its writes, since the guide contradicts itself. Pin `durable-actors` ≥0.14.1 (fix for #351). Create a Relay workspace and an observer token. Have the OpenAI key ready.

**What judges and sponsors want** [I, based on `../terse/05-team-strategy.md` and `../agent-relay/05-team-strategy.md`]. Terse wants the actor to be the backbone, not a cache: show state surviving a kill and many clients on one actor. Agent Relay wants no human copy-paste, visible agent-to-agent traffic, and durable catch-up. Supabase "scale to millions" wants per-entity actors (no global actor) with Postgres for cross-entity queries (P9). Say the pattern names out loud in the demo ("each ghost is its own actor, the room is the single writer, the supervisor restarts crashed agents"), because judges score both execution and the creative use of the primitive.

---

## Sources

1. TerseAI/durable-actors @ `20d2899` (29 Oct 2026): `docs/reference/typescript-guide.md`, `docs/reference/configuration.md`, `examples/background/background-gym/src/actors.ts`, `examples/pi/pi-durable/src/actors.ts`, `sdk/src/backend.ts`: https://github.com/TerseAI/durable-actors
2. Terse docs (concepts, reference, OpenAPI) as summarised and cited in `../terse/01-docs-api.md`: https://docs.useterse.ai/concepts
3. Terse TypeScript reference: https://docs.useterse.ai/reference/typescript-sdk (the earlier `/typescript-reference` URL returns 404) ; repo `docs/reference/typescript-guide.md` (alarms, interleave, broadcast tags)
4. Cloudflare, Long-running agents: https://developers.cloudflare.com/agents/concepts/agentic-patterns/long-running-agents/ ; 4b. Schedule tasks / Agent internals: https://developers.cloudflare.com/agents/agent-class/schedule-tasks/ , https://developers.cloudflare.com/agents/agent-class/internals/ ; 4c. Human-in-the-loop patterns (updated 27 Oct 2026): https://developers.cloudflare.com/agents/concepts/agentic-patterns/human-in-the-loop/
5. TerseAI/whitechapel (HEAD 9 Oct 2026): `backend/src/actors/{case-actor,scene-actor,conversation-actor,conversation-connections,case-repository,case-scenes}.ts`, README: https://github.com/TerseAI/whitechapel
6. TerseAI/durable-actors-mastra-example README (pushed 18 Oct 2026): https://github.com/TerseAI/durable-actors-mastra-example
7. TerseAI/talkingAgent `src/counting-room.ts` (pushed 8 Oct 2026): https://github.com/TerseAI/talkingAgent
8. Rivet, Actor design patterns: https://rivet.dev/actors/docs/design-patterns/ ; Rivet Actors overview: https://rivet.dev/actors/docs/
9. Rivet, Agent design patterns: https://rivet.dev/agents/docs/design-patterns/
10. Rivet, Multi-agent systems guide: https://rivet.dev/guides/multi-agent-system/
11. Manju Rajashekhar, "Actors for Agents: Patterns for Production AI", InfoQ/QCon AI, 22 Oct 2026: https://www.infoq.com/presentations/actors-for-production-ai-agents/
12. Boris Tane, "What even are Cloudflare Durable Objects?", 5 Nov 2025 [BG]: https://boristane.com/blog/what-are-cloudflare-durable-objects/
13. Zylos Research, "Actor Model and Communicating Agent Patterns", 10 Mar 2026 [BG]: https://zylos.ai/research/2026-03-10-actor-model-communicating-agent-patterns/
14. Arnab Bhowal, DoodleDash grand prize post, 9 Jun 2026 [BG]: https://www.linkedin.com/posts/arnabb1998_nytechweek-spacetimedb-hackathon-activity-7470101568009220097-T_Bk
15. qiuethan, Identity Matrix (UofTHacks 13): https://github.com/qiuethan/UofTHacks-Project
16. "Actors for Agents: A Production Playbook" (low provenance), 21 Oct 2026: https://luxarastore.com/blog/actors-for-agents-a-production-playbook-for-ai-workflows-that-dont-fall--20261023
17. Metabase AI Hackathon winners, 13 May 2026 [BG]: https://www.metabase.com/blog/metabase-ai-hackathon-winners
18. George Jefferson, Mistral London hackathon win, 2 Mar 2026 [BG]: https://www.linkedin.com/posts/georgejeffers_we-won-the-mistral-ai-london-hackathon-activity-7434257174245040128-N73k
19. aboodman, workerd issue #1185, Sep 2023 [BG]: https://github.com/cloudflare/workerd/issues/1185
20. Thomas Karatzas, "Why you should host your agents on Actors. Preferably Durable Actors", X, 14 Oct 2026 (2:48 video, ~1.3K views; via Nitter mirror, Exa-indexed copy since the mirror returned a gateway error on 29 Oct): https://nitter.rdrama.net/karatzas_thomas/status/2110466203303170181 ; 20b. Karatzas media timeline (Oct 6 to 19 posts): https://nitter.rdrama.net/karatzas_thomas/media
21. Shahzad Bhatti, "20+ Production Patterns for Distributed AI Agents Using Actors and TupleSpaces", 26 Apr 2026 [BG], background on supervision, monitor and link: https://weblog.plexobject.com/archives/7465
23. Terse homepage, scraped 29 Oct 2026: https://www.useterse.ai/
24. Agent Relay docs: https://agentrelay.com/llms-full.txt , https://agentrelay.com/docs/markdown/relaycast-api.md , https://agentrelay.com/docs/markdown/flows.md
22. Sibling research in this repo: `../terse/01-docs-api.md`, `../terse/03-github-code.md`, `../terse/04-social-pulse.md`, `../terse/05-team-strategy.md`, `../agent-relay/01-docs-api.md`, `../agent-relay/05-team-strategy.md`

---

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live sources (gh clones at the stated HEADs, curl of docs `.md` endpoints, Exa, one Firecrawl scrape).

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | `durable-actors` HEAD `20d2899` on 29 Oct; "4 releases on Oct 29 alone" | `git log`, `gh release list` | HEAD **confirmed** (0.14.4 prep, 29 Oct 08:40 EDT). Release count **corrected**: 3 tagged releases dated 29 Oct UTC (v0.14.2 to v0.14.4), 12 from 24 to 29 Oct. Repo has 291 stars, 22 forks |
| 2 | Instances cannot be deleted (issue #228) | `gh issue view 228` | **Confirmed**: "Support for Deleting instances", open since 18 Oct |
| 3 | One alarm per actor; re-set replaces | `typescript-guide.md:248` | **Confirmed** verbatim |
| 4 | `@Interleave` disables rollback class-wide | `typescript-guide.md:298` | **Confirmed**, but the same guide (l.319) says writes are saved immediately and survive a throw. **Added** this contradiction as a gotcha |
| 5 | Nested mutation not saved; README uses `.push` | guide l.322; README l.63 to 66 | **Confirmed** both |
| 6 | 10 s idle default, 1 ms to 24 h; "Open WebSockets remain at the gateway..." | `configuration.md:42` | **Confirmed** (`10000`, 1 to 86400000 ms) |
| 7 | `requestId` does not deduplicate; no auto-replay | `openapi.yaml:248-249` | **Confirmed**: "requestId identifies an attempt; it does not deduplicate execution" |
| 8 | Whitechapel lease protocol strings | `conversation-actor.ts:65,95` | **Confirmed**: "Waiting for a response." and "Generation ownership expired." with the `worker`/`workerUntil` check. Idle-timeout detail corrected (all three actor classes use 5000 ms) |
| 9 | talkingAgent `speakerId = participants[count % n]` | `counting-room.ts:44-54` | **Confirmed** |
| 10 | Sketch import `terse-sdk/actor` | README/examples imports | **Corrected** to `durable-actors`. `terse-sdk/actors` is only used by Whitechapel for `createActorStub`; it pins `durable-actors@0.7.16` / `terse-sdk@0.9.15` vs current 0.14.4 / 0.14.7 |
| 11 | Terse homepage quotes "one actor per agent, users connect over WebSocket" and "actor as a lock around shared data" | Firecrawl scrape of useterse.ai | **Corrected**: neither phrase is verbatim on the page. Replaced with the actual text |
| 12 | Terse docs FAQ quote on cross-actor transactions | `concepts.md`, `typescript-sdk.md`, repo docs | **Not found** on 29 Oct; marked (unverified) and split the paraphrase from the quote. "Impact could be catastrophic" **confirmed** in `concepts.md:37` |
| 13 | Source URL `docs.useterse.ai/typescript-reference` | curl | **404**; replaced with `/reference/typescript-sdk` |
| 14 | QCon AI talk (Rajashekhar, 22 Oct) five patterns + supervision quote | InfoQ transcript | Date, speaker and quote **confirmed**. Fourth pattern **corrected** from "mutable child graphs" to "mutable execution graph" |
| 15 | Cloudflare quotes ("durable identities", one-alarm workaround, heartbeat, "Build it yourself", HITL "survive disconnections", updated 27 Oct) | `index.md` endpoints | **All confirmed**. Long-running and HITL pages "Last updated Oct 27, 2026"; schedule and internals pages updated Oct 29 |
| 16 | Rivet quotes (per agent/session/user; queue anti-pattern; same researchers; saved answer; DocumentWordCount) | curl of the four Rivet pages | **All confirmed** |
| 17 | Relay primitives (`at_live_*`, human type, `steer`, `action.completed`, flows gates, `reconnect`) | agentrelay.com llms-full + relaycast-api + flows | `at_live_*`, human identity, `mode: wait\|steer`, `action.completed`, `Idempotency-Key` **confirmed**. "gates / human steps / flows answer" and a `reconnect` call **not found**; marked (unverified) |
| 18 | Demo table (DoodleDash, Identity Matrix, Meta Chess, Mistralverse) | LinkedIn via Exa, Devpost, GitHub, metabase.com | **All quotes and placements confirmed** (Identity Matrix: Devpost "Winner Overall 1st place") |
| 19 | workerd #1185 quote by aboodman, Sep 2023 | `gh issue view` | **Confirmed** (opened 15 Sep 2023) |
| 20 | Bug #351 tied to mini-lovable | `gh issue view 351` | **Confirmed** and expanded: closed 28 Oct, fix #352 in v0.14.1+ |
| 21 | Karatzas X posts (Oct 14 "host your agents on Actors"; tiny Lovable) | Exa index of Nitter mirror (live mirror returned 502) | Text **confirmed**. Tiny Lovable date and view count still rely on sibling file. Added Oct 8 "almost won me the YC demo showcase" post |
| 22 | aboodman X post linked on event page | Exa fetch x.com + nitter.net | Still **SOURCE_NOT_AVAILABLE**; unchanged |
| 23 | Bun ≥1.4.2 | README l.32, quickstart.md | **Confirmed**. Note: this machine has Bun 1.3.14, so `bun upgrade` is required before Saturday |
