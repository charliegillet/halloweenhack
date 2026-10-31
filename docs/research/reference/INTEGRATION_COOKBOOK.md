# Integration cookbook: wiring Terse + Agent Relay + OpenAI Realtime + Supabase + Mastra + Freestyle/Superserve

Checked **29 Oct 2026 PT (30 Oct ~06:30 UTC)** for Haunted Hacks (Sat 31 Oct, 11:00 to 16:00 build window). This file covers **the seams between sponsors**. Each sponsor's own API is already documented in `../<sponsor>/01-docs-api.md`, and this file does not repeat those details. It answers one question: *can a team actually connect these pieces, and where do they break?*

**Method.** Primary sources only: `gh` reads of `TerseAI/durable-actors` (SDK source, tests, `docs/reference/*`), `TerseAI/Terse-Examples` (mini-lovable), `TerseAI/durable-actors-mastra-example`, `AgentWorkforce/relaycast` (`openapi.yaml`, `packages/types/src/subscription.ts`, engine `dm.ts`/`deliveryWire.ts`) and `AgentWorkforce/relay` (SDK README). I also unpacked the npm tarballs of `terse-sdk@0.14.7` and `terse-cli@0.14.7` (read only, not run) and read OpenAI's `.md` docs (`realtime.md`, `realtime-conversations.md`, `realtime-mcp.md`) plus the Agents JS `guides.txt`. On top of that I ran **three live probes against hosted Agent Relay**, each with a throwaway 300 s workspace (see the Verification log).

**Labels.** **[V-live]** = I executed it and saw the result. **[V-src]** = read in source code or tests. **[V-doc]** = read in official docs. **[I]** = my inference or composed code (not run). **[U]** = unverified, or a known open question.

---

## TL;DR: the seams that matter

1. **A dormant actor cannot hold an Agent Relay listener.** The Relay SDK delivers events over a long-lived WebSocket (`relay.addListener`) [R3]. A Terse actor is evicted after 10 s idle, and "Open WebSockets remain at the gateway and do not keep the sandbox alive" [T2]. So **inbound Relay traffic needs a bridge**: either a Relay *subscription* (an HTTPS webhook) or one always-on SDK listener process that turns events into actor RPCs. **[V-doc + V-src]**
2. **Relay subscriptions work and accept custom headers. [V-live]** `POST /v1/subscriptions {events, url, headers, secret}` delivered a `dm.received` webhook in **under 2 s** with my custom `Authorization` header and `X-Relay-Signature: sha256=<hex>`, which is HMAC-SHA256 of the raw body. I recomputed the signature locally and it matched. The payload shape is captured in §3.3.
3. **Relay callback URLs must be public HTTPS.** The spec says "Production callback URLs must use HTTPS and resolve only to globally routable addresses; redirects are not followed" [R1]. `localhost` will not work, so you need a deployed bridge (Freestyle `*.style.dev`, a Superserve preview URL, or a tunnel). **[V-doc]**
4. **Outbound from an actor to Relay is just `fetch`.** POST `/v1/dm` or `/v1/channels/{name}/messages` with the agent's `at_live_*` token. A `data` object on the DM comes back as `metadata` in the recipient's webhook [V-live], so you can use it for hop counters and room IDs.
5. **Actor-to-actor RPC exists and is tested** (`Other.get(id).method()` inside an actor method, through `/invoke`; `sdk/tests/host/actor-calls.test.ts`) [T4]. It is **not documented**. Hosted auth appears to come from the injected `TERSE_PROJECT_KEY` [T6], but I have not run it on Terse Cloud. **[V-src / U hosted]**
6. **Hosted actors can import arbitrary npm SDKs and reach the internet.** The official mini-lovable template deploys an actor that imports `modal` and calls OpenAI and Modal from inside the actor. Its `.env.example` says "Required when deployed" [T5]. So Supabase, Superserve, Freestyle and Relay clients inside actors are plausible. **[V-src; egress policy itself U]**
7. **OpenAI Realtime function tools run where the session runs.** "If the session runs in the browser, the tool runs in the browser too" [O3]. So the cleanest voice-to-actor seam is a browser tool that `fetch`es your backend, which calls the actor. Realtime also accepts **remote MCP tools** (`server_url`, `headers`, `require_approval`), but any secret headers must go into the server-side `client_secrets` call [O2][O3]. **[V-doc]**
8. **Mastra to Relay over MCP is a protocol risk.** `@mastra/mcp@2.x` is MCP 2026-07-28-only (legacy handshake removed, per `../mastra/03-github-code.md`). `agent-relay` depends on the **1.x** `@modelcontextprotocol/sdk` (`^1.23.0` in `packages/cli/package.json`), and in the TS SDK the 2026-07-28 spec support lives in the 2.x packages [M2]. Prefer a Mastra `createTool` that wraps Relay REST. **[V-src; actual handshake failure U]**

---

## 1. Reference architecture (one that uses every sponsor without overlap)

```
 Browser (React)                     Backend "bridge" (Bun, public HTTPS on Freestyle *.style.dev)
 ├─ RealtimeSession (WebRTC→OpenAI)  ├─ POST /api/realtime-token  → OpenAI /v1/realtime/client_secrets
 │   tool summon_spirit ──fetch──────┼─ POST /api/spirit/:id/ask  → actors.Spirit.get(id).ask()
 ├─ actor WebSocket (grant) ◀────────┼─ POST /api/socket/:id      → actors.Spirit.prepareWebsocket()
 └─ Supabase Realtime (private ch.)  └─ POST /relay  (Relay subscription webhook, HMAC-checked)
        ▲                                         → actors.Spirit.get(data.to).onRelayDm()
        │ broadcast_changes trigger
 Supabase Postgres  ◀── insert ──  Terse actor "Spirit" (one per agent): @Persisted memory, alarms,
 (cross-actor table)               @Interleave LLM loop (Mastra Agent → OpenAI), fetch → Relay /v1/dm,
                                   @Resource → Superserve/Freestyle sandbox for code/tools
                    Agent Relay workspace: one Relay agent identity per Spirit (at_live_* token)
```

| Concern | Owner | Why not the others |
|---|---|---|
| Per-agent state, mailbox serialization, wake-on-alarm, browser sockets | **Terse actor** | The Terse track judges this. Mastra Memory would be a second source of truth (`../mastra/01-docs-api.md` §5) |
| Agent-to-agent messages, channels, observer view | **Agent Relay** | The Mac mini track judges this. Actor-to-actor RPC is not "agent communication" in the judges' sense [I] |
| Model loop, tools, fallbacks, tracing | **Mastra `Agent`** inside the actor | Pattern published by Terse itself [T3] |
| Voice | **OpenAI Realtime** in the browser | Ephemeral key; the tools are browser fetches [O1][O3] |
| Cross-actor queries, leaderboard, fan-out to many viewers | **Supabase** table + `broadcast_changes` | Actors are not transactional across each other [T1]. This also feeds the "scale to millions" pitch |
| Untrusted code / long jobs | **Superserve** or **Freestyle** via `@Resource` | Actor sandboxes are 0.25 CPU / 256 MiB by default (`../terse/01-docs-api.md` §7) |
| Public HTTPS for the bridge | **Freestyle VM + `*.style.dev`** (or a Superserve preview port) | Relay needs public HTTPS (TL;DR #3) |

---

## 2. Integration matrix

| Pair | Evidence | Status |
|---|---|---|
| Terse ↔ OpenAI (text) | README/examples use `gpt-5-mini` in actors [T3] | Works (official examples) |
| Terse ↔ Mastra | `TerseAI/durable-actors-mastra-example` [T3] | Works. Pins `durable-actors 0.8.0` / `@mastra/core 1.76.0`, both old; re-pin to current |
| Terse ↔ external sandbox via `@Resource` | mini-lovable `SandboxResource.ts` (Modal) [T5] | Works with Modal. Superserve/Freestyle are a port [I] |
| Relay → Terse (inbound) | Subscription live-tested; actor RPC from a Bun backend is the documented client path [T6] | Composed: bridge required |
| Terse → Relay (outbound) | `POST /v1/dm` live-tested with curl | Composed: raw `fetch` inside the actor [I] |
| Terse ↔ Terse | Unit test [T4] | Undocumented; test it on hosted |
| Terse → Supabase | `httpSend` / insert from servers is documented (`../supabase/01-docs-api.md` §8.3) | Composed [I] |
| Realtime voice → Terse | Browser tools run in the browser [O3] | Composed [I] |
| Realtime → remote MCP | `realtime-mcp.md` [O2] | Documented; candidate servers are a Supabase or Mastra MCP over HTTPS [U] |
| Mastra ↔ Relay | No adapter (`../mastra/03-github-code.md`); MCP version mismatch [M2] | Use `createTool` + REST |
| Relay broker on Freestyle | Official Relay recipe (`../agent-relay/01-docs-api.md` §9.6) | Documented |

---

## 3. Recipes

### 3.1 Spirit actor: memory + Mastra brain + Relay out + Supabase fan-out  [I, composed from V-src APIs]

```ts
// actor/src/actors.ts   deps: terse-sdk (pin exact), @mastra/core, @supabase/supabase-js
import { Actor, Persisted, Emittable, Interleave, type ActorSocket } from "terse-sdk/actor"
import { Agent } from "@mastra/core/agent"
import { createClient } from "@supabase/supabase-js"

type Line = { from: string; text: string; at: number }
type Out = { type: "line"; line: Line } | { type: "delta"; text: string }
const RELAY = "https://cast.agentrelay.com/v1"
const brain = new Agent({ id: "spirit", name: "Spirit", instructions: "You are a restless spirit. Reply in <=2 sentences.",
  model: `openai/${process.env.OPENAI_MODEL ?? "gpt-6.1-terra"}` })     // check the model ID against your org
const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } })

export class Spirit extends Actor<{ viewer: string }, string, Out> {
  @Persisted private relayToken: string | undefined = undefined    // private, NOT @Emittable
  @Persisted @Emittable log: Line[] = []

  async bindRelay(token: string) { this.relayToken = token }       // called once by the setup script

  @Interleave                                                       // LLM call: keep the mailbox open
  async onRelayDm(msg: { id: string; from: string; text: string; hops: number }) {
    this.db.exec("CREATE TABLE IF NOT EXISTS seen (id TEXT PRIMARY KEY)")
    if (this.db.exec("SELECT id FROM seen WHERE id = ?", msg.id).length) return   // webhook retries
    this.db.exec("INSERT INTO seen (id) VALUES (?)", msg.id)          // sync, before any await
    this.append({ from: msg.from, text: msg.text, at: Date.now() })
    if (msg.hops >= 3) return                                          // stop agent ping-pong
    const r = await brain.generate(this.log.slice(-20).map(l => ({ role: "user" as const, content: `${l.from}: ${l.text}` })))
    await fetch(`${RELAY}/dm`, { method: "POST",
      headers: { authorization: `Bearer ${this.relayToken}`, "content-type": "application/json" },
      body: JSON.stringify({ to: msg.from, text: r.text, data: { hops: msg.hops + 1 } }) })
    this.append({ from: this.id, text: r.text, at: Date.now() })
    await sb.from("events").insert({ room: this.id, kind: "said", body: { to: msg.from, text: r.text } })
  }

  private append(line: Line) {
    this.log = [...this.log, line].slice(-200)                         // reassign; .push() does not persist
    this.broadcast({ type: "line", line })
  }
}
```
Notes:
- **Reassign, never `.push()`.** Terse's own Mastra example and its README chat sample both call `.push()` on a `@Persisted` array [T3]. The TS reference says nested mutation is not persisted (`../terse/01-docs-api.md` §2). Don't copy that line.
- **Dedupe in the actor.** Relay retries carry a stable `webhook-id` [R1]. Terse's `requestId` "does not deduplicate execution" (`../terse/01-docs-api.md` §3). Check then insert, with no write when the row already exists: issue #351 (closed 28 Oct) was a bug where "immediate writes that leave SQLite unchanged stop the actor database service". That argues against `INSERT OR IGNORE` no-ops on older pins [I].
- **Loop guard.** Two spirits that each reply to every DM will burn OpenAI credits and Relay quota in seconds. The `data.hops` field travels as `metadata` [V-live].
- **Secrets:** `terse secrets add OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (`sb_secret_…`; legacy `service_role` keys are deprecated by end of 2026 per `../supabase/01-docs-api.md` §0). Do **not** use the names `MODAL_TOKEN_ID/SECRET`, which the runtime reserves [T5].
- The `events` table plus the `broadcast_changes` trigger is `../supabase/01-docs-api.md` §8.2 verbatim. One insert gives you a durable cross-actor log *and* a fan-out to every viewer, with no extra socket.

### 3.2 Setup script: one Relay identity per actor  [V-live REST shapes]

```ts
// scripts/seed.ts  (run with bun, in the backend that has TERSE_ACTOR_URL + TERSE_API_KEY)
import { actors } from "../generated/index.js"
const B = "https://cast.agentrelay.com/v1", K = process.env.RELAY_WORKSPACE_KEY!
for (const name of ["banshee", "poltergeist", "medium"]) {
  const r = await fetch(`${B}/agents`, { method: "POST", headers: { authorization: `Bearer ${K}`, "content-type": "application/json" },
    body: JSON.stringify({ name, type: "agent" }) }).then(r => r.json())
  if (!r.ok) { console.warn(name, r.error.code); continue }            // 409 agent_already_exists on re-run
  await actors.Spirit.get(name).bindRelay(r.data.token)                 // token shown once
}
await fetch(`${B}/subscriptions`, { method: "POST", headers: { authorization: `Bearer ${K}`, "content-type": "application/json" },
  body: JSON.stringify({ events: ["dm.received"], url: `${process.env.PUBLIC_URL}/relay`,
    headers: { "x-bridge-key": process.env.BRIDGE_KEY! }, secret: process.env.RELAY_SUB_SECRET! }) })
```
Re-running after a 409 leaves the actor without a token. Rotate with `POST /agents/{name}/rotate-token`, then call `bindRelay` again (route listed in `../agent-relay/01-docs-api.md` §4; I did not run rotate).

### 3.3 Bridge: Relay webhook to actor RPC  [payload V-live, code I]

The live `dm.received` delivery, trimmed (IDs shortened). Headers seen: `x-relay-signature: sha256=…`, `x-relay-event: dm.received`, `x-relay-timestamp`, `webhook-id: whd_…`, plus my custom `authorization`:
```json
{"type":"dm.received","workspace_id":"2418…","timestamp":"2026-10-30T06:34:19.000Z",
 "data":{"conversation_id":"dm_3c42…","id":"2418…","from_agent_id":"2418…","from_name":"ghost","to":"witch",
  "text":"boo","injection_mode":"wait","attachments":[],"metadata":{"room":"crypt","injection_mode":"wait"},
  "message":{"id":"2418…","agent_name":"ghost","agent_address":"ghost@direct","text":"boo","metadata":{…}},
  "created_at":"2026-10-30T06:34:19.000Z"}}
```
```ts
// backend/src/bridge.ts  (Bun)
import { createHmac, timingSafeEqual } from "node:crypto"
import { actors } from "../generated/index.js"
Bun.serve({ port: Number(process.env.PORT ?? 8000), async fetch(req) {
  const { pathname } = new URL(req.url)
  if (req.method === "POST" && pathname === "/relay") {
    const raw = await req.text()                                        // sign over the EXACT bytes
    const got = Buffer.from(req.headers.get("x-relay-signature") ?? "")
    const want = Buffer.from("sha256=" + createHmac("sha256", process.env.RELAY_SUB_SECRET!).update(raw).digest("hex"))
    if (got.length !== want.length || !timingSafeEqual(got, want)) return new Response("bad signature", { status: 401 })
    const e = JSON.parse(raw)
    if (e.type === "dm.received")
      actors.Spirit.get(e.data.to).onRelayDm({ id: e.data.id, from: e.data.from_name, text: e.data.text,
        hops: Number(e.data.metadata?.hops ?? 0) }).catch(err => console.error("actor", err))  // don't block the ack
    return new Response(null, { status: 204 })
  }
  return new Response("not found", { status: 404 })
}})
```
- Ack fast and let the actor work in the background. Relay records `attempts`, `last_status` and `next_attempt_at` per delivery and supports replay: `GET /subscriptions/{id}/deliveries`, `POST …/deliveries/{delivery_id}/replay` [R1, V-live list]. That list is your debugging screen when "the agent didn't answer".
- Actor IDs allow 1 to 128 chars of `[A-Za-z0-9._-]` (`../terse/01-docs-api.md` §2). Relay agent names map onto them directly if you keep names in that alphabet.
- Do not use port 8787: that is the local Relay engine's default (`../agent-relay/01-docs-api.md` §4).
- **No public URL? Use a listener bridge instead.** Run one Node ≥22 process with `@agent-relay/sdk` and `relay.addListener('message.created', …)` that calls `actors.Spirit.get(...)` [R3]. It works from a laptop behind NAT. The cost: it dies with your laptop, and I did not verify whether DMs surface through `message.created` in the SDK (the subscription event is `dm.received`) [U].

### 3.4 Hosting the bridge on Freestyle (public HTTPS for free)  [V-doc, `../freestyle/01-docs-api.md` §6]

Boot `freestyle/ubuntu-sm` with an outbound-allow firewall rule, write a systemd unit for `bun /home/ubuntu/bridge.ts`, then `fs.tls.rules.create({ domain: "<team>-haunt.style.dev", source: { public: true }, destination: { vmId, port: 8000 } })`. Then `PUBLIC_URL=https://<team>-haunt.style.dev`. Gotchas from that doc: `firewall` is **required**, and `vm.exec` defaults to a **30 s timeout**. This also gives Freestyle a real role ("our agent network's ingress runs on Freestyle"). Alternative: Superserve `publishPreviewPort(8000, { access: "public" })` (`../superserve/01-docs-api.md` §4) [I: whether Relay accepts that host as globally routable is untested].

### 3.5 Voice: OpenAI Realtime in the browser, tools call actors  [V-doc APIs, composed]

```ts
// server: mint an ephemeral key (shape from ../openai/01-docs-api.md §5)
app.post("/api/realtime-token", async (_req, res) => {
  const r = await fetch("https://api.openai.com/v1/realtime/client_secrets", { method: "POST",
    headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ session: { type: "realtime", model: "gpt-realtime-2.1", audio: { output: { voice: "marin" } } } }) })
  res.json(await r.json())                                              // { value: "ek_…", … }
})
// browser
import { RealtimeAgent, RealtimeSession, tool } from "@openai/agents/realtime"
import { z } from "zod"
const summon = tool({ name: "ask_spirit", description: "Ask a named spirit a question and hear its reply.",
  parameters: z.object({ spirit: z.enum(["banshee", "poltergeist", "medium"]), question: z.string() }),
  execute: async ({ spirit, question }) =>
    (await fetch(`/api/spirit/${spirit}/ask`, { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ question }) })).text() })
const session = new RealtimeSession(new RealtimeAgent({ name: "Medium", instructions: "You channel spirits.", tools: [summon] }),
  { model: "gpt-realtime-2.1" })
const { value } = await (await fetch("/api/realtime-token", { method: "POST" })).json()
await session.connect({ apiKey: value })
```
- `tool` is exported from `@openai/agents/realtime` [O3]. If you skip the SDK, the raw protocol is: read `response.done` for `output[].type === "function_call"` with `call_id`, send `conversation.item.create {type:"function_call_output", call_id, output}`, then `response.create` [O1].
- **Latency:** the voice waits on your tool. Have `ask` call a *fast* actor method (or a Decisions call). Let slower multi-agent work stream into the actor socket and the Supabase channel instead of blocking speech. The SDK supports function-tool timeouts that abort `details.signal` [O3].
- **Remote MCP alternative:** add `{ type: "mcp", server_url, headers, require_approval: "never" }` to `session.tools` in the **server-side** `client_secrets` body, because "long-lived credentials" must not be added from the browser later [O2][O3]. Pointing it at a Supabase "own MCP server" Edge Function or a Mastra MCP server is plausible but unverified [U].
- **GPT-Live instead?** Client delegation is the cleaner seam for a backend agent network, but it is **not available on the Free usage tier** (buy $5 of credits first): see `../openai/01-docs-api.md` TL;DR and §5.

### 3.6 Actor-owned sandbox via `@Resource` (Superserve port of mini-lovable)  [I; pattern V-src]

```ts
import { type ActorDatabase, type ActorResource } from "terse-sdk/actor"   // mini-lovable imports these from "durable-actors"
import { Sandbox } from "@superserve/sdk"                                  // reads SUPERSERVE_API_KEY

export class SuperserveBox implements ActorResource {
  private _sb: Sandbox | undefined
  constructor(private readonly db: ActorDatabase, private readonly owner: string) {
    db.exec("CREATE TABLE IF NOT EXISTS resource_kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)")  // idempotent: reruns on restore
  }
  get sandbox(): Sandbox { if (!this._sb) throw new Error("sandbox not ready"); return this._sb }
  async onResume() {
    const id = this.db.exec<{ value: string }>("SELECT value FROM resource_kv WHERE key = 'sandbox_id'")[0]?.value
    if (id) { try { this._sb = await Sandbox.connect(id); return } catch { /* deleted: recreate */ } }  // connect auto-resumes
    this._sb = await Sandbox.create({ name: `${this.owner}-${Date.now()}`, timeoutSeconds: 1800, autoDeleteSeconds: 86400,
      metadata: { actor: this.owner } })
    this.db.exec("INSERT INTO resource_kv (key, value) VALUES ('sandbox_id', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", this._sb.id)
  }
  async onGracefulShutdown() { await this._sb?.pause({ wait: false }) }   // not called on crash
}
// in the actor:  @Resource private box = new SuperserveBox(this.db, this.id)   (this.id is available in field initializers [T4])
// usage:         const r = await this.box.sandbox.commands.run("python3 -c 'print(13)'", { timeoutMs: 120_000 })
```
- The structure copies mini-lovable's `ModalSandbox` + `ResourceKV` [T5]. The Superserve calls come from `../superserve/01-docs-api.md` §4/§8.
- **Plan trap:** the Superserve **Free plan allows 1 running sandbox**, and the event credit is **refused for Free teams** ("upgrade to Developer first") (`../superserve/01-docs-api.md` §0). One sandbox per actor needs a Developer plan before Saturday.
- **Always pass `timeoutMs`.** A sync `run()` defaults to a 30 s kill, which shows up as exit 124.
- **Freestyle variant:** store `vmId` and boot with `fs.vms.create({ snapshotId, firewall, idleTimeoutSeconds })`. Re-attach by ID (the identity snippet uses `vms.ref(vmId)`, but I did not verify it for server keys [U]). Free tier: 10 concurrent VMs (`../freestyle/01-docs-api.md` §0). Freestyle is the better fit for **many** actor-owned boxes.
- `onResume` runs whenever the actor wakes (after each 10 s idle eviction), so keep it cheap: `connect` on an already-running sandbox, not `create`.

### 3.7 Mastra ↔ Relay without MCP  [I]

```ts
import { createTool } from "@mastra/core/tools"; import { z } from "zod"
export const relayDm = (token: string) => createTool({ id: "relay-dm", description: "DM another agent on Agent Relay",
  inputSchema: z.object({ to: z.string(), text: z.string() }), outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ to, text }) => ({ ok: (await fetch("https://cast.agentrelay.com/v1/dm", { method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ to, text }) })).ok }) })
```
This lets the LLM decide *whom* to message, which makes the agent-to-agent story legible to Relay judges. Build the tool per actor (with that actor's token) and pass it in `brain.generate(…, { toolsets })`, or construct the Agent inside the method [U: exact per-call tool API; see `../mastra/01-docs-api.md` §4b]. Note that Mastra's `execute(inputData, context)` signature takes the input directly.

### 3.8 Demo surfaces (each one gives a sponsor something to see)

| Screen | Source | Sponsor |
|---|---|---|
| Live agent chatter | Relay observer token, `wss://cast.agentrelay.com/v1/ws?token=ot_live_…` (`../agent-relay/01-docs-api.md` §9.7) | Agent Relay |
| Actor wake/sleep + state | `durable-actors observe` / Terse dashboard; `observe/state` reads without waking (`../terse/01-docs-api.md` §6) | Terse |
| Kill-and-restart survives | `process.exit(1)` method, as in Terse's own "meteorHitsDatacenter" [T3] | Terse |
| Viewer fan-out | Supabase private channel + Presence (`../supabase/01-docs-api.md` §8.1) | Supabase |
| Webhook retries/replay | `GET /subscriptions/{id}/deliveries` | Agent Relay (reliability) |

---

## 4. Secrets map (where each key may live)

| Secret | Lives in | Never in |
|---|---|---|
| `OPENAI_API_KEY` | actor (`terse secrets add`), bridge (mints `ek_`) | browser (use `ek_…` only) |
| `TERSE_API_KEY`, `TERSE_ACTOR_URL` | bridge/backend `.env` [T6] | actor code, browser |
| `TERSE_PROJECT_KEY` | injected into hosted runs automatically [T6] | don't set it yourself |
| `RELAY_WORKSPACE_KEY` (`rk_live_`) | seed script / bridge | URLs, the observer link, actors |
| agent tokens (`at_live_`) | actor `@Persisted` private field | `@Emittable` fields (they are pushed to every socket) |
| `RELAY_SUB_SECRET`, `BRIDGE_KEY` | bridge + subscription create | logs (Relay redacts headers in responses [R1]) |
| `SUPABASE_SECRET_KEY` (`sb_secret_`) | actor, bridge | browser (use `sb_publishable_`) |
| `SUPERSERVE_API_KEY` / `FREESTYLE_API_KEY` | actor secrets (for `@Resource`), bridge | sandbox env (Freestyle can inject keys at the edge instead) |

`TERSE_ACTOR_SETUP_TIMEOUT_MS=120000` on the backend gives grants and proxies up to 2 minutes for actor startup (default 10 s for Terse Cloud grants; range 1,000 to 600,000 ms) [T6]. Set it if you use custom `@Compute` sizes, which skip the warm pool.

---

## 5. Lifecycle conflicts and gotchas

| Conflict | Symptom | Fix |
|---|---|---|
| Relay listener inside an actor | Messages stop after 10 s idle | Subscription webhook or an external listener bridge (§3.3) |
| Long `await` without `@Interleave` | Every other caller and socket stalls | `@Interleave` on LLM/sandbox/Relay calls. This disables rollback for the whole class |
| A Realtime tool waits on a multi-agent chain | Dead air in the voice | Fast method plus async streaming over the actor socket/Supabase (§3.5) |
| Agent ping-pong | Credits drain; Relay quota | Hop counter in DM `data`/`metadata` (§3.1) |
| Webhook retry | Duplicate replies | Dedupe on `data.id` in actor SQLite |
| `localhost` subscription URL | Rejected or never delivered | Public HTTPS (Freestyle `style.dev`) |
| Mastra `MCPClient` → `agent-relay mcp` | Possible handshake failure (2026-07-28 vs 1.x SDK) | `createTool` + REST (§3.7) |
| Version skew | Terse v0.13 changed client/control-plane compatibility; `terse-cli` shipped 4 releases on 29 Oct; Relay `relay init` only on `main` | Pin exact versions Saturday 11:00; regenerate clients after every actor API change |
| Superserve Free = 1 sandbox | Second actor's `create` fails | Developer plan, or Freestyle for fan-out |
| Bun < 1.4.2 locally | Terse CLI refuses | `bun upgrade` (this machine had 1.3.14 per `../terse/01-docs-api.md`) |

---

## Verification log (30 Oct 2026 ~06:30 UTC)

| # | Check | Method | Result |
|---|---|---|---|
| 1 | Subscription create accepts `headers` + `secret`; headers redacted | Live `POST /v1/subscriptions` | Confirmed: `{"headers":{"Authorization":"[redacted]"},"signature_scheme":"legacy","is_active":true}` |
| 2 | Deliveries fire for `dm.received`, `channel.created`, `message.created` | Live, `events:["*"]`, httpbin target, `GET …/deliveries` | Confirmed: 3 deliveries, `status:"succeeded"`, `attempts:1`, `last_status:200`, about 1 s after the send. A first probe with an explicit list polled once at 6 s and saw 0; probe 3 with an explicit `["dm.received"]` delivered within 4 s, so I read probe 1 as timing |
| 3 | Payload shape and headers | Live, webhook.site bin | Confirmed (§3.3). DM `data:{room}` surfaces as `metadata.room` |
| 4 | Signature = HMAC-SHA256(secret, raw body), hex, `sha256=` prefix | `openssl dgst -hmac` on the captured body | Matched exactly |
| 5 | Actor-to-actor calls | `sdk/tests/host/actor-calls.test.ts` | Invoke, broadcast and connect from inside an actor method all pass through `/invoke`, `/socket-effects`, `/find-websocket` |
| 6 | Hosted actors import npm SDKs and need egress | mini-lovable `package.json` (`modal`, `terse-sdk 0.14.2`) + `.env.example` | Confirmed pattern; network policy itself not documented |
| 7 | Backend env names `TERSE_ACTOR_URL`/`TERSE_API_KEY`, `TERSE_PROJECT_KEY` injected | `terse-cli@0.14.7` README, `terse-sdk/dist/actors.js` | Confirmed |
| 8 | Realtime tools run in the browser; `tool` export; MCP secrets server-side | Agents JS `guides.txt`; `realtime-mcp.md` | Confirmed |
| 9 | Realtime function-call event loop | `realtime-conversations.md` §Function calling | Confirmed |
| 10 | MCP SDK mismatch | `relay/packages/cli/package.json` (`@modelcontextprotocol/sdk ^1.23.0`); MCP TS SDK v2.4.0 release notes ("Works on 2025-11-25 and 2026-07-28") | Version facts confirmed; handshake not run |

The throwaway workspaces expired after 300 s, and no keys were saved to disk.

## Limits / could not verify

- **I did not run any Terse code.** The local Bun is below 1.4.2, and I had no Terse account. Every actor snippet is composed from verified signatures.
- **Hosted actor-to-actor auth**, the **egress policy** for hosted actor sandboxes, and whether `fetch` to `cast.agentrelay.com`/`*.supabase.co` is allowed. Inferred from mini-lovable reaching Modal and OpenAI.
- **Maximum duration of a single actor method.** Config says "running handlers defer eviction" [T2], but I found no documented cap. Don't hold one method open for a whole voice session.
- Whether Relay accepts Superserve preview hosts or Freestyle `style.dev` as "globally routable". Very likely, but untested.
- Whether the Relay SDK's `message.created` listener includes DMs.
- Mastra per-call toolsets API; Mastra ↔ `agent-relay mcp` handshake under `@mastra/mcp` 2.x.
- Supabase, Superserve and Freestyle calls were not executed (no accounts). Their shapes come from the sibling docs, which were themselves partly unexecuted.
- No sponsor publishes an integration between any two of them except Terse+Mastra (example repo) and Relay+Freestyle (docs recipe).

## Hackathon implications

- **What to build:** a "séance" of 3 to 5 spirit agents. Each is a **Terse actor** (memory, alarms for unprompted haunting, a browser socket) holding a **Relay identity** that DMs the others. A **Realtime voice** "medium" in the browser asks spirits questions through tools, every utterance lands in **Supabase** for a live wall, and one spirit owns a **Superserve/Freestyle** sandbox to "possess" code. That hits both host tracks and gives every sponsor a visible role. Keep the Relay agent count at or below 5 per workspace in case caps switch on (`../agent-relay/01-docs-api.md` §8).
- **Build order:** (1) hosted actor + socket; (2) seed script + outbound DM; (3) bridge on a public URL + subscription; (4) Realtime tool; (5) Supabase fan-out; (6) sandbox resource. Steps 1 to 3 are the judged core. Cut 6 first.
- **Before 31 Oct (setup only, no project code):** `bun upgrade` (1.4.2 or later); log in to Terse and deploy a throwaway counter once; create a Freestyle VM and prove that a `style.dev` URL serves HTTPS; move Superserve to Developer plan if you plan per-actor sandboxes; buy $5 of OpenAI credit (GPT-Live tier); run the curl in §3.2 against a 300 s workspace to confirm Relay from the venue network.
- **What judges see:** the Relay observer stream and webhook delivery log (reliability), the actor kill-restart, an alarm firing while dormant, and voice-driven agent-to-agent chatter. For the Supabase prize: per-actor sharding plus Broadcast-from-DB fan-out, which is the documented scale pattern.
- **Gotchas to rehearse:** loop guard, dedupe, `@Interleave`, `.push()`, `TERSE_ACTOR_SETUP_TIMEOUT_MS`, exact version pins, a 30 s sandbox exec default, and secrets never in `@Emittable` fields or URLs.

## Sources

- [T1] https://docs.useterse.ai (Concepts/FAQ via `../terse/01-docs-api.md`)
- [T2] https://github.com/TerseAI/durable-actors/blob/main/docs/reference/configuration.md (`DURABLE_ACTORS_HOST_IDLE_TIMEOUT_MS`)
- [T3] https://github.com/TerseAI/durable-actors-mastra-example (`src/actors.ts`, `package.json`, pushed 18 Oct 2026)
- [T4] https://github.com/TerseAI/durable-actors/blob/main/sdk/tests/host/actor-calls.test.ts and `sdk/src/actor/actor.ts`, `sdk/src/client/client.ts`
- [T5] https://github.com/TerseAI/Terse-Examples/tree/HEAD/02_codingAgent/mini-lovable (`actor/src/modal/SandboxResource.ts`, `actor/.env.example`, `actor/package.json`, `client/src/backend.ts`)
- [T6] npm `terse-cli@0.14.7` README and `terse-sdk@0.14.7` README + `dist/actors.js` (https://www.npmjs.com/package/terse-cli, https://www.npmjs.com/package/terse-sdk)
- [R1] https://github.com/AgentWorkforce/relaycast/blob/main/openapi.yaml (`/subscriptions`, `/subscriptions/{id}/deliveries`, `/dm`)
- [R2] https://github.com/AgentWorkforce/relaycast/blob/main/packages/types/src/subscription.ts; `packages/engine/src/engine/deliveryWire.ts` (`buildDmReceivedEventData`)
- [R3] https://github.com/AgentWorkforce/relay/blob/main/packages/sdk/README.md
- [O1] https://developers.openai.com/api/docs/guides/realtime-conversations.md (Function calling)
- [O2] https://developers.openai.com/api/docs/guides/realtime-mcp.md
- [O3] https://openai.github.io/openai-agents-js/_llms-txt/guides.txt (voice agents: "Function tools run wherever the `RealtimeSession` runs"; tool timeouts; client_secrets guidance); https://developers.openai.com/api/docs/guides/realtime.md
- [M2] https://github.com/AgentWorkforce/relay/blob/main/packages/cli/package.json; https://github.com/modelcontextprotocol/typescript-sdk/releases (v2.4.0, 23 Oct 2026)
- Live probes: https://cast.agentrelay.com/v1 (30 Oct 2026 06:32 to 06:35 UTC), https://httpbin.org/post, https://webhook.site
- Sibling docs: `../terse/01-docs-api.md`, `../agent-relay/01-docs-api.md`, `../openai/01-docs-api.md`, `../supabase/01-docs-api.md`, `../mastra/01-docs-api.md`, `../mastra/03-github-code.md`, `../freestyle/01-docs-api.md`, `../superserve/01-docs-api.md`, `../../EVENT_PAGE.md`
