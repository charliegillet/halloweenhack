<div align="center">

<img src="assets/icon.svg" width="96" height="96" alt="Afterlife">

# 👻 Afterlife

### *When an agent dies, its work doesn't.*

Crash-proof handoff for long-running AI agents. When an agent dies mid-job, its lease runs out on a **Terse Durable Actor**, and a different vendor's agent picks the work up over **Agent Relay**. Any side effect at the end, such as a refund, happens **exactly once**.

<br>

[![Agent Relay](https://img.shields.io/badge/Agent_Relay-agent--to--agent_messaging-f59a3b?style=for-the-badge&labelColor=1a0b24)](https://agentrelay.com)
[![Terse Durable Actors](https://img.shields.io/badge/Terse-Durable_Actors-de4b2c?style=for-the-badge&labelColor=1a0b24)](https://docs.useterse.ai/quickstart)
[![OpenAI](https://img.shields.io/badge/OpenAI-gpt--4.1--mini-7CFC9A?style=for-the-badge&labelColor=1a0b24&logo=openai&logoColor=7CFC9A)](https://platform.openai.com)
[![Claude](https://img.shields.io/badge/Anthropic-Claude-c79bff?style=for-the-badge&labelColor=1a0b24&logo=anthropic&logoColor=c79bff)](https://www.anthropic.com)

[![Haunted Hacks 2026](https://img.shields.io/badge/🎃_Haunted_Hacks-YC_SF_·_31_Oct_2026-ff7518?style=flat-square&labelColor=0b0710)](#-built-at-haunted-hacks-2026)
[![Track](https://img.shields.io/badge/track-Agent_Relay_+_Durable_Actors-9b5de5?style=flat-square&labelColor=0b0710)](#-built-at-haunted-hacks-2026)
[![TypeScript](https://img.shields.io/badge/TypeScript-Node_≥22-f59a3b?style=flat-square&labelColor=0b0710&logo=typescript&logoColor=f59a3b)](#-run-it)
[![Exactly once](https://img.shields.io/badge/refunds_issued-exactly_1-7CFC9A?style=flat-square&labelColor=0b0710)](#-exactly-once-claim-and-fence)
[![Vibe](https://img.shields.io/badge/vibe-spooky-de4b2c?style=flat-square&labelColor=0b0710)](#)

<br>

<img src="docs/screenshots/6-exactly-once.png" alt="Afterlife board: finished by Claude, refund issued exactly once" width="100%">

<sub>The live board at the end of a run. GPT died at step 3, Claude finished, a late write from a frozen zombie was blocked, and one refund was issued.</sub>

</div>

---

## 🕯️ The problem

Long-running agents die all the time: a laptop sleeps, a process runs out of memory, a rate limit kills the loop, a deploy restarts the box. When one dies **at step 4 of 6**, you get one of two bad outcomes:

- 💀 **The work is lost.** Someone has to notice, then copy and paste the context into another tool by hand (*"don't be a meat proxy"*).
- 🔁 **The work is done twice.** A naive restart re-runs everything, and the customer gets **two refunds**, two emails or two charges.

Afterlife takes care of crash recovery for agents:

| | Without Afterlife | With Afterlife |
|---|---|---|
| Agent dies mid-job | Job silently stalls | The lease runs out on its own, *with nothing supervising*, and the job is marked **presumed dead** |
| Who picks it up | A human, by hand | An agent from another vendor, through a **Relay DM that waits even while it's offline** |
| Context | Lost, or pasted in by hand | Rebuilt from the task's **Relay channel history**, the shared memory |
| The old agent wakes up | Overwrites the new one's work | Its writes are **fenced**: `REJECTED: epoch 1 < 2` |
| Side effect | 0 or 2 refunds | **Exactly 1** |

---

## 🦇 How it works

```mermaid
%%{init: {"theme":"base","flowchart":{"curve":"basis","nodeSpacing":40,"rankSpacing":55,"wrappingWidth":330},"themeVariables":{"primaryColor":"#2a1238","primaryTextColor":"#ffe8cc","primaryBorderColor":"#f59a3b","lineColor":"#f59a3b","fontFamily":"ui-monospace, SF Mono, Menlo, monospace","fontSize":"15px","clusterBkg":"#12081a","clusterBorder":"#9b5de5","edgeLabelBackground":"#1a0b24","titleColor":"#f59a3b"}}}%%
flowchart TB
    W["👻 <b>workergpt</b><br/>OpenAI · gpt-4.1-mini<br/><i>heartbeat every 2s</i>"]:::gpt
    C["👁️ <b>standbyclaude</b><br/>Anthropic · Claude<br/><i>offline until needed</i>"]:::claude

    subgraph TERSE["⚰️ Terse"]
        A["<b>LeaseTask</b> · Durable Actor, one per task<br/>@Persisted ledger · epoch fence<br/>⏰ alarm = 8s lease"]:::terse
    end

    subgraph RELAY["🕸️ Agent Relay"]
        direction LR
        CH["📜 <b>#task channel</b><br/>checkpoints · shared history"]:::relay
        DM["📬 <b>DM inbox</b><br/>waits while offline"]:::relay
    end

    D["🎃 <b>Afterlife dispatcher</b><br/>alarm → handoff DM<br/>idempotency key taskId:epoch"]:::server
    OUT[("💸 <b>refund</b><br/>exactly once")]:::outbox
    B["🖥️ <b>board</b> · live SSE + controls"]:::board

    W == "① heartbeat · commit {epoch, step}" ==> A
    W -- "② checkpoint after each commit" --> CH
    A == "③ ⏰ onAlarm → LOST · epoch++" ==> D
    D -- "④ HANDOFF: resume at step 4" --> DM
    DM -- "⑤ drain on boot" --> C
    CH -- "⑤ rebuild steps 1-3" --> C
    C == "⑥ claim epoch 2 · commit steps 4-6" ==> A
    A == "step 6 commits once" ==> OUT
    RELAY -. "observer stream" .-> B
    TERSE -. "ledger" .-> B

    classDef gpt fill:#0f2a1c,stroke:#7CFC9A,color:#d8ffe6,stroke-width:2px
    classDef claude fill:#24133a,stroke:#c79bff,color:#f1e4ff,stroke-width:2px
    classDef terse fill:#3a0f0a,stroke:#de4b2c,color:#ffd9cc,stroke-width:3px
    classDef relay fill:#3a2208,stroke:#f59a3b,color:#ffe8cc,stroke-width:2px
    classDef server fill:#1a0b24,stroke:#9b5de5,color:#ead9ff,stroke-width:2px
    classDef board fill:#12081a,stroke:#9b5de5,color:#ead9ff,stroke-dasharray:4 3
    classDef outbox fill:#0b0710,stroke:#7CFC9A,color:#7CFC9A,stroke-width:3px
```

Each part has one job:

- **⚰️ The Terse Durable Actor is the single commit authority.** It owns the clock (its own alarm), the epoch fence and the ledger. A step only counts once the actor accepts it.
- **🕸️ Agent Relay is the shared record and the delivery network.** Checkpoints live in a channel per task. Handoffs are DMs that wait in Relay while the recipient is offline. The board watches it all through an observer token.
- **🎃 The Afterlife server is a thin dispatcher.** It turns an actor alarm into a Relay DM and streams everything to the board. It never decides who owns a task; the actor does.
- **🧟 Agents only hold their own credentials.** Each process loads one Relay token and talks to other agents only through Relay. No shared database, no shared memory.

---

## 🪦 The death and the handoff

```mermaid
%%{init: {"theme":"base","themeVariables":{"background":"#0b0710","actorBkg":"#2a1238","actorBorder":"#f59a3b","actorTextColor":"#ffe8cc","actorLineColor":"#9b5de5","signalColor":"#f59a3b","signalTextColor":"#e8590c","labelBoxBkgColor":"#3a0f0a","labelBoxBorderColor":"#de4b2c","labelTextColor":"#ffd9cc","loopTextColor":"#9b5de5","noteBkgColor":"#1a0b24","noteBorderColor":"#9b5de5","noteTextColor":"#ead9ff","activationBkgColor":"#3a2208","activationBorderColor":"#f59a3b","sequenceNumberColor":"#0b0710","fontFamily":"ui-monospace, SF Mono, Menlo, monospace"}}}%%
sequenceDiagram
    autonumber
    participant W as 👻 workergpt<br/>(OpenAI)
    participant A as ⚰️ LeaseTask<br/>(Terse actor)
    participant R as 🕸️ Agent Relay
    participant D as 🎃 dispatcher
    participant C as 👁️ standbyclaude<br/>(Claude)

    rect rgba(124, 252, 154, 0.08)
    W->>A: start(task) → RUNNING, epoch 1
    loop steps 1 → 3
        W->>A: heartbeat {epoch 1, step, seq} every 2s
        W->>A: commit step n ✅
        W->>R: post checkpoint to #task-refund…
    end
    end

    Note over W: ☠️ kill -9 at step 4
    rect rgba(222, 75, 44, 0.12)
    Note over A: no heartbeat for 8s<br/>⏰ onAlarm fires inside the actor<br/>with nothing supervising
    A->>A: LOST · epoch 1 → 2
    A-->>D: ledger: alarm
    D->>R: "presumed dead" → #task-refund…
    D->>R: 📬 DM standbyclaude {resumeFromStep 4}<br/>idempotency key taskId:2
    Note over R,C: Claude is OFFLINE<br/>the DM waits in Relay
    end

    rect rgba(199, 155, 255, 0.10)
    C->>R: boot · drain inbox → HANDOFF
    C->>A: claim(epoch 2) → first claim wins
    C->>R: messages.list(#task-refund…) → steps 1-3
    loop steps 4 → 6
        C->>A: commit step n (epoch 2) ✅
        C->>R: post checkpoint
    end
    A->>A: step 6 → 💸 refund written once → DONE
    end
```

Step 4 is written by Claude and opens by citing step 3, for example *"Per step 3, the refund amount is $120…"*. That shows the context really came from the dead agent's checkpoints.

---

## 🔒 Exactly once: claim and fence

Every heartbeat and every commit carries `{taskId, epoch, step, seq}`. The actor processes calls one at a time and is the only place a step can be committed.

```mermaid
%%{init: {"theme":"base","themeVariables":{"background":"#0b0710","primaryColor":"#2a1238","primaryTextColor":"#ffe8cc","primaryBorderColor":"#f59a3b","lineColor":"#f59a3b","secondaryColor":"#3a0f0a","tertiaryColor":"#12081a","fontFamily":"ui-monospace, SF Mono, Menlo, monospace","labelBackgroundColor":"#1a0b24"}}}%%
stateDiagram-v2
    direction LR
    [*] --> RUNNING_1: start()
    RUNNING_1: 👻 RUNNING · epoch 1<br/>owner workergpt
    LOST: 🪦 LOST · epoch 2<br/>presumed dead
    RUNNING_2: 👁️ RUNNING · epoch 2<br/>owner standbyclaude
    DONE: 💸 DONE<br/>refund issued once

    RUNNING_1 --> RUNNING_1: heartbeat re-arms ⏰
    RUNNING_1 --> LOST: ⏰ onAlarm (8s silence)
    LOST --> RUNNING_2: claim(), first one wins
    RUNNING_2 --> RUNNING_2: commit steps 4-6
    RUNNING_2 --> DONE: step 6
    DONE --> [*]

    note right of RUNNING_2
        🧟 zombie wakes (kill -CONT)
        commit {epoch 1, step 4}
        → REJECTED: epoch 1 < 2
        late write from the old agent blocked
    end note
```

| Rule | Why it matters |
|---|---|
| `commit` with `epoch < current` → `{ok:false, reason:'fenced'}` + ledger row `REJECTED` | A frozen agent that wakes up can't overwrite its replacement |
| A repeat of an existing `(epoch, step)` is a no-op | Retries after `outcome_unknown` are safe |
| A step already committed by an earlier epoch is a duplicate | The refund step can never run twice |
| Only `onAlarm()` moves a task to `LOST` | Death is detected by the actor's own clock, not a supervisor that can also die |
| Handoff DMs use idempotency key `taskId:epoch` | Retrying the dispatcher against an overloaded Relay never delivers twice |
| Late Relay posts stay visible, marked `stale (attempt 1, superseded)` | Nothing is hidden; stale traffic is shown and refused |

---

## 🖥️ What you see

The board is a single page lit like dusk turning to midnight. Ghost eyes **follow your cursor**, the cursor is a 🎃, and a caption strip walks a judge through the story as real events stream in.

| | |
|---|---|
| <img src="docs/screenshots/1-working.png" alt="GPT working"><br>**① GPT agent working the refund.** Heartbeats every 2s keep the lease bar full. Each committed step shows its author, vendor, epoch and Relay message ID. | <img src="docs/screenshots/2-killed.png" alt="GPT killed"><br>**② GPT killed mid-task (`kill -9`).** Heartbeats stop and the worker's eye goes dark. The lease bar drains on its own: *"silent · no heartbeat"*. |
| <img src="docs/screenshots/3-presumed-dead.png" alt="Presumed dead"><br>**③ → ④ Lease expired, presumed dead, attempt 2.** The actor's alarm fires after 8.1s and the handoff DM lands in Relay while Claude is still **offline · DM queued**. | <img src="docs/screenshots/4-claude-resumes.png" alt="Claude resumes"><br>**⑤ Claude boots, drains the DM, rebuilds steps 1–3 from Relay history.** A soul orb travels from the dead ghost to Claude's, and step 4 *cites step 3*. |
| <img src="docs/screenshots/5-zombie-fenced.png" alt="Zombie fenced"><br>**🧟 Late write from the old agent blocked.** A frozen worker wakes and tries to write step 4 at epoch 1. The ledger shows `REJECTED: epoch 1 < 2` and its Relay post is struck through as *superseded*. | <img src="docs/screenshots/6-exactly-once.png" alt="Exactly once"><br>**⑥ Finished by Claude, refund issued exactly once.** The outbox glows green: `refund issued: 1 time ✓ exactly once`. |

**Board labels:**

| Label | Meaning |
|---|---|
| `heartbeat` | The owner is alive and re-arming its lease every 2s |
| `silent · no heartbeat` | The process is gone; the lease is draining |
| `presumed dead · handing to attempt 2` | The actor's alarm fired; the epoch was bumped |
| `offline · DM queued` | The handoff is waiting in Agent Relay for an agent that isn't running yet |
| `taken over by Claude` | The standby claimed the next epoch and is resuming |
| `late write from the old agent blocked` | A fenced write from a superseded epoch was refused |
| `stale (attempt 1, superseded)` | A Relay post from the old agent, kept visible but ignored |
| `refund issued: 1 time · exactly once` | The side effect ran once, whatever happened |

**🎛️ Live controls.** On the live board you drive real agents: **▶ Start run** (optionally with your own guest complaint) → **☠ Kill GPT** → wait for the DM → **👻 Wake Claude**. Tick **zombie** and use **❄ Freeze** / **☀ Thaw** to raise the dead.

---

## 🎃 Run it

> **Needs:** Node ≥ 22, Bun (for the Terse runtime), an OpenAI key and an Anthropic key.

```bash
npm install
cp .env.example .env            # add OPENAI_API_KEY and ANTHROPIC_API_KEY
npm run seed                    # creates the Relay workspace and one token per agent in tokens/
npm run actor:install           # once: installs the Terse Durable Actors runtime
```

```bash
npm run actor:dev               # terminal 1 · Terse actor runtime on :7100
```

```bash
npm run server:terse            # terminal 2 · Afterlife server + board on http://localhost:4000
```

Open **http://localhost:4000** and press **▶ Start run**. Or let the script do the whole story hands-free:

```bash
STEP_DELAY_MS=2500 STANDBY_DELAY=6 OPEN=0 npm run demo
```

| Command | What it does |
|---|---|
| `npm run demo` | Start GPT, `kill -9` it after step 3, wait for LOST and the DM, boot Claude, finish |
| `npm run demo:zombie` | The same, but freeze the worker (`SIGSTOP`) and wake it (`SIGCONT`) after Claude claims, so you see the fence |
| `npm run server` | Run on the in-process lease backend instead of Terse (same contract, no runtime needed) |
| `npm run test:lease` / `test:lease:terse` | Lease state machine and fencing tests (local / against the real actor) |
| `npm run spike` | Agent Relay smoke test: register, reconnect, channel metadata, offline DM drain, observer |
| `npm run reset` | Fresh Relay workspace and run ID |
| `npm run relay:local` | Local Relay engine fallback (`RELAY_BASE_URL=http://localhost:8787 npm run reset`) |
| `npm run relay -- <tool> [--arg v]` | 🔮 `relaycast` CLI against the hosted workspace (`npm run relay -- tools` lists them; `AS=afterlife` acts as an agent) |
| `npm run relay:agents` | 👻 List every agent haunting the workspace |
| `npm run relay:channels` | 🕯️ List channels (as `afterlife`) |
| `npm run relay:observer` | 👁️ List observer tokens via the official `agent-relay` CLI (read-only, never prints the link secret) |

**Control API** (what the board's buttons call): `POST /control/run {complaint?, zombie?}` · `POST /control/kill` · `POST /control/freeze` · `POST /control/thaw` · `POST /control/standby` · `GET /control/state`. Board feed: `GET /events` (SSE). Logs: `logs/`. Side effect: `outbox.jsonl`.

### 🤖 Your coding agent can join the séance

The repo ships Agent Relay tooling for coding agents, so Claude Code, Codex or Cursor can sit in the same workspace as the ghosts. They can read the task channels, watch handoff DMs land and post into them.

| Tool | What it gives you | How |
|---|---|---|
| **`agent-relay` MCP** (`.mcp.json` → `@relaycast/mcp@12.3.0`) | 49 Relaycast tools: `message.list`, `message.dm.send`, `channel.list`, `message.inbox.check`, … Joins as the human `operator<runId>` | Opens automatically in Claude Code (approve the project MCP server once) |
| **`agent-relay-official` MCP** (`agent-relay@15.0.1 mcp`) | The official server: `post_message`, `send_dm`, `check_inbox`, `get_observer_url` (mints a shareable live watch link), `spawn` | Same; register your own identity with `register_agent` |
| **`using-agent-relay` skill** (`.claude/skills/`) | Teaches a coding agent the Relay MCP tools and the ACK/DONE conventions | Loaded automatically in this repo |
| **`relaycast` + `agent-relay` CLIs** | Every Relay call from your terminal (`npm run relay -- message.list --channel task-…`) | `npm run relay`, `relay:agents`, `relay:channels`, `relay:observer` |

All of them read keys from the gitignored `tokens/` folder through `scripts/relay-mcp.sh`, `scripts/relaycast.sh` and `scripts/agent-relay.sh`. Nothing secret is committed, and telemetry is off.

---

## 🗺️ Where it's going

Afterlife is built to become the crash-recovery layer for any agent fleet. The table shows what works today.

| | Capability | Status |
|---|---|---|
| ⚰️ | Lease, epoch fence and ledger in a **Terse Durable Actor**, death detected by the actor's own alarm | ✅ live |
| 🕸️ | Checkpoints in a **Relay channel per task**; context rebuilt from shared history | ✅ live |
| 📬 | **Offline handoff**: a DM waits in Relay and is drained when the standby boots | ✅ live |
| 🔀 | **Cross-vendor**: GPT dies, Claude finishes | ✅ live |
| 🧟 | **Zombie fencing**: late writes refused and shown as superseded | ✅ live |
| 💸 | **Exactly-once side effects** through the fenced commit | ✅ live |
| 🎛️ | **Live board controls**: start, kill, freeze/thaw, wake, custom input | ✅ live |
| 👥 | **Cross-person handoff**: my agent dies, a teammate's agent in their own workspace takes over | 🕯️ next |
| 🗣️ | **Human steering**: a person DMs instructions to the current owner, carried through the handoff | 🕯️ next |
| 🦇 | **Fleets**: many tasks, a pool of standbys, the first claim wins | 🕯️ next |
| 🧩 | **Drop-in SDK** for agent frameworks (Mastra, the Vercel AI SDK), so a lease is `withAfterlife(agent)` | 🕯️ next |
| 🗄️ | Durable audit export of every ledger row (Supabase) for scale-to-millions history | 🕯️ next |
| 🌐 | Hosted Afterlife: actors on Terse Cloud, workers in sandboxed VMs (Freestyle) that respawn on death | 🕯️ next |

---

## 🧰 Built with

| Sponsor tech | Role in Afterlife |
|---|---|
| [**Agent Relay**](https://agentrelay.com) · `@agent-relay/sdk@14.0.0`, `agent-relay@15.0.1`, `@relaycast/mcp@12.3.0`, `relaycast@12.3.0` | All agent-to-agent traffic: checkpoint channels, offline-queued handoff DMs with idempotency keys, inbox drain, observer tokens. Each agent has its own identity (`register({strict:true})` once, then `reconnect`). Two MCP servers, the `using-agent-relay` skill and both CLIs let coding agents join the same workspace. |
| [**Terse Durable Actors**](https://docs.useterse.ai/quickstart) · `durable-actors@0.14.6` | The `LeaseTask` actor: `@Persisted` task state and ledger, `alarm.set()` as the lease, `onAlarm()` as the only path to LOST, serialized calls for first-claim-wins and fenced commits. |
| [**OpenAI**](https://platform.openai.com) · `gpt-4.1-mini` | The worker agent that starts the job, and dies. |

Also: **Anthropic Claude** (`claude-haiku-5-5`) as the standby agent, Node + TypeScript (`tsx`), Bun for the actor runtime, and a vanilla HTML/CSS/JS board with canvas and SVG, no framework and no build step.

---

## 🗂️ Repo layout

```
actor/           ⚰️  Terse Durable Actor: LeaseTask (lease alarm, epoch fence, ledger)
lease/           🔒  Lease contract + backends: terse.ts (actor adapter), index.ts (in-process fallback)
agents/          🧟  worker.ts (OpenAI), standby.ts (Claude), runner.ts (heartbeat + step loop),
                     relay.ts (Agent Relay adapter), seed.ts (identities), spike.ts (Relay smoke test)
server/          🎃  always-on dispatcher: alarm → Relay DM, control API, SSE /events, static board
app/             🖥️  the board: index.html, app.js, style.css (sky, ghosts, 🎃 cursor), mock.js
scripts/         📜  demo.sh (hands-free story), wait.mjs
docs/            📚  SUBMISSION.md, LEASE.md, SPIKE_RELAY.md, screenshots/
```

---

## 🎃 Built at Haunted Hacks 2026

Built at **Haunted Hacks: Real-Time AI Edition** (YC, San Francisco, 31 October 2026) by [**Charlie Gillet**](https://github.com/charliegillet) and [**Nihal**](https://github.com/nihalnihalani). All code was written at the event; Nihal's Terse `Task` actor is the basis of `actor/src/task.ts`. Tracks: **Agent Relay** (agent-to-agent communication) and **Terse Durable Actors** (stateful apps).

The guest, the hotel and its ghosts are made up. The agents, the Relay messages and the actor alarms are real.

<div align="center">
<br>

**👻 Agents die. Their work lives on. 👻**

</div>
