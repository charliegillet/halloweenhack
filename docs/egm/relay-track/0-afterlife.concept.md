# Afterlife: durable task leases and context handoff for long-running AI agents

> Concept submitted by the user, Sat 31 Oct 2026, captured as given. Context: [../../EVENT_KICKOFF_NOTES.md](../../EVENT_KICKOFF_NOTES.md), [../../research/agent-relay.md](../../research/agent-relay.md), [../../research/terse.md](../../research/terse.md). Target under evaluation: the Agent Relay track (Mac mini), with Terse as a bonus.

**One line:** "When an agent dies, its work doesn't."

## What you build

- Each AI agent task (a 6-step LLM job, such as writing a report from a fixed fact sheet) is a Terse Durable Actor. The actor holds a lease alarm, an attempt counter and a checkpoint ledger.
- Worker agents run as separate processes. They send heartbeats straight to their task actor and post checkpoints over Agent Relay.
- A board page shows every task card updating live over the actor's WebSocket.

## The 2-minute demo

1. Three tasks are running, with each card streaming its step outputs.
2. You `kill -9` a worker and the bridge together. With nothing supervising, the lease alarm fires on its own and the card turns red: "lost, attempt 2".
3. A standby agent receives a Relay DM with the checkpoint notes. Its step 4 visibly continues from steps 1–3 written by the dead worker.
4. You pause another worker and resume it (`kill -STOP` / `kill -CONT`). Its stale "zombie" write is rejected on screen.

## Fallbacks

| Situation | Switch to |
|---|---|
| Relay smoke test fails by 13:30 | Afterlife-solo: Durable Actors only, no Relay |
| Alarm test fails by 13:15 | TREATY: an agent API-contract ledger that doesn't need alarms |
| Want something more creative after the event | The Séance Room |

## Still to confirm

- Today's toolchain gates (`durable-actors dev` showing Ready, the Relay local server, and the alarm test) are what make it buildable.
- An "Opus final audit" was still running when this was submitted. It may adjust wording or details, not the choice, unless it finds a real blocker.
- An independent critic's dissent stands: this is the option most likely to work, not the most original one.
