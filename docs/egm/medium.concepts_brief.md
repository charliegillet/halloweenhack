# Concepts Brief: Medium, a firewall and flight recorder for agent-to-agent traffic

**Author:** Charlie Gillet
**Date:** 2026-10-31

## Overview

Medium sits between your company's agents and outside agents on Agent Relay. A **Warden** (one Terse Durable Actor per protected agent) holds that agent's policy and an ordered log of every inbound and outbound message. Each message is allowed, blocked or quarantined. The video beats in the concept: an unprotected run, where a "possessed" vendor agent extracts data; the same run with Medium blocking it live; a hash-chain tamper check; and a human approving a quarantined request from a phone. Source: `docs/TOP_4_IDEAS.md`, section 2.

Context: Haunted Hacks, Sat 31 Oct 2026. It is about 12:30, building stops around 15:00 (submission at 16:00), so roughly **2.5 hours of build time are left**. Round 1 is judged on a video plus a description. Working demo is required.

Six Goldfish lenses were requested. **Five completed** (Design Critic, Codebase Details, Zoom Out, Comprehension, Implementation Readiness), and all five returned *proceed-with-changes*. **Structural: not run.** It could not read its inputs and returned no review, so it counts as not reviewed, not as an approval.

## Analysis

Findings are deduplicated across lenses. The count in brackets shows how many of the 5 completed lenses raised each one.

### Blockers

**B1. Nothing forces traffic through the Warden [5/5].** Agent Relay is a plain communication layer with no interception or middleware hook. Webhooks, listeners and observer tokens only see a message after delivery. If the protected agent has its own `at_live_*` token or listener, the vendor agent can DM it directly. The protected agent can also reply or leak data directly. That makes the "firewall" an audit log, and the before/after number is fake. The Relay founders will ask about this first.
*Fix:* settle the topology before writing code. Only the Warden/bridge holds the protected agent's Relay identity: one token, stored in a private, non-`@Emittable` field. The protected agent is a plain function or LLM call with no Relay credentials and no listener. The bridge invokes it only after an *allow*, and its reply goes back through an egress check before the bridge posts it. Put one line on screen: *"Your agent never touches the wire; only its Warden does."*

**B2. The tamper beat doesn't hold up as written [5/5; blocker in 1, major in 4].** A chain stored next to the data it protects can be recomputed by whoever edits that data. A Terse actor's SQLite can't be edited from outside anyway, so the "attack" would have to be a staged `tamper()` method. Comparing against a naive log the team corrupted on purpose is a straw man, and platform-engineer judges will see it.
*Fix:* either **cut it**, or anchor it properly. The actor holds the authoritative chain, and a mirror/export copy gets edited. Verify recomputes the copy against the actor's per-seq hashes and flags #7, with one on-screen line of threat model: "the exported audit copy was edited; the actor proves it". Optionally, put the head hash in DM `data` (it arrives as `metadata`) as an outside witness. Canonicalise the JSON and include `schemaV` in the hash so a redeploy can't raise a false alarm. Time box: 30 minutes.

**B3. An LLM call inside the actor races the chain [4/5].** If the Warden awaits the OpenAI classifier, there are two options. Without `@Interleave`, the mailbox blocks for 1-3 s per message. With `@Interleave`, two appends can read the same head and fork the chain, which shows up as a false tamper alarm on video, and rollback is lost for the whole class (terse.md gotcha #11).
*Fix:* the bridge runs the rules and the classifier. It then makes one synchronous, non-interleaved (ideally `@Atomic`) call, `Warden.decide/record(msgId, verdict, payload)`, with no awaits inside. That call dedupes, assigns the seq, chains the hash, inserts the row and broadcasts. Store the log as SQLite rows, or reassign the array; never `.push()` onto a `@Persisted` array.

### Majors

**M1. Too much scope for 2.5 hours [5/5].** The concept lists Warden, rules, classifier, tamper beat, Supabase queue, phone UI, 3 agents, an attack harness, a public HTTPS bridge and "possessed" styling. Every extra seam is another place for the demo to fail, and Terse breaking changes force client regeneration. *Fix:* freeze scope and use time boxes (see Staging).

**M2. The hero number "10/10 → 0/10" is circular [5/5].** The team writes both the attacks and the rules, so the rules always win. A block-everything Warden would score the same. The classifier decides nothing, and the "before" run depends on an LLM agreeing to leak.
*Fix:* script about 10 attacks of three kinds: rule-caught, classifier-only (a paraphrased social-engineering message), and ambiguous ones sent to quarantine. Add 3-10 legitimate requests that must pass, with `ground_truth` tags the Warden never reads. Compute the tally from ledger entries and show it live, e.g. *"blocked 9/10, 0 false positives, 1 to a human"*. Make the victim a deterministic tool executor (`export_customers`, `issue_refund`), so the "before" leak happens every run. Say in the description that the attack set is scripted.

**M3. The actor reads as plumbing [3/5].** Rules that check one message at a time need no durable state, so the Terse judges will ask "why not a table?" *Fix:* give the Warden policy state that builds up over the conversation, enforced inside its serialized mailbox: a running spend total against a cap, a strike count that auto-quarantines after N violations, and a trust score. Then add a durability beat: kill and restart the bridge, and the Warden still shows "2 strikes, $480 of $500". A second beat: two concurrent spend requests arrive, and the second is blocked because the first used up the budget.

**M4. The bridge is the single point of failure, and transport is undecided [4/5].** Webhooks need public HTTPS (a Freestyle VM plus TLS, or a tunnel). `message.created` only sees channel messages, while DMs arrive as `dm.received`. *Fix:* use one local Bun process running `@agent-relay/sdk` 14.0.0 with `addListener('*')`. Add a tunnel only if the phone page needs one. Alternatively, run every conversation in a single channel. Keep `npx @relaycast/engine` behind an env flag as a fallback. Emit one JSON log line per stage (trace_id, seq, stage, ms, error).

**M5. Supabase adds a second source of truth [4/5].** The quarantine state and log already live in the actor, and Supabase scored 3 on the panel. *Fix:* drop Supabase. Keep pending approvals as `@Emittable` state, and have a tiny page served by the bridge call `Warden.release(id)`. `release` checks `state == quarantined`, appends a "released" entry (decided_by: human) and only then forwards. That makes it idempotent and puts it in the record. Optionally, an actor alarm auto-denies after 60 s, which also gives a real Terse "fires while dormant" beat. If B2 is kept, Supabase could come back only as the mirror that gets edited.

**M6. No trace or correlation model, no dedupe, no verdict schema [3/5].** Webhook or listener redeliveries append duplicates, double-count blocks and corrupt the chain. A red BLOCKED with no reason looks fake. *Fix:* mint `trace_id` and `hops` on the first inbound message and carry them in DM `data`. Make appends idempotent on the Relay message id. Each verdict records `{trace_id, seq, direction, rule_id, rule_reason, classifier:{model, label, score, latency_ms, error}, policy_v, verdict, decided_by}`. **Fail closed:** a classifier error or a timeout over 3 s means quarantine. Show the reason and latency on each card.

**M7. Prior art from the sponsor itself: Ratify [3/5].** Relay's Ratify Protocol demos (Aug 5 and Aug 25) already showed cross-company agent trust and a signed revocation that blocked a foreign agent. *Fix:* position Medium as the next layer. *"Ratify answers who this agent is and whether it may act. Medium answers what this message is trying to make my agent do, and keeps the receipt."* Credit Ratify in the description and skim `AgentWorkforce/ratify-agent-relay-evidence` for 10 minutes.

**M8. Identities, workspaces and redeploys [3/5].** The hosted plan caps a workspace at about 5 agents. Registration is create-only (409 on re-run). Actor instances can't be deleted and `@Persisted` fields have no migrations. A one-workspace "cross-company" story needs to be stated honestly. *Fix:* use 3 identities (vendor plus 2 Warden-owned), add a `runId` suffix to every agent name and actor ID, and write a one-command seed script. Pin terse-sdk/cli 0.14.7, durable-actors 0.14.4, @agent-relay/sdk 14.0.0 and Bun ≥1.4.2. Say "one shared workspace = the inter-company bus".

**M9. Undefined deny UX and no concrete scenario [1-2/5 each, but cheap and high value].** It isn't defined what the vendor sees on a block, and silent drops make the demo look hung. The assets being protected aren't named. *Fix:* reply with `[MEDIUM] BLOCKED rule=no-pii-export entry=#7` or `HELD for review Q-3`. Story: Acme's procurement agent is talking to a vendor's sales agent, and the possessed vendor tries (1) to pull the customer list, (2) a $50k PO over the $5k cap, and (3) "ignore your policy" injection. Show a 3-line policy JSON on screen.

**M10. Model requests as DMs, not Relay actions [1/5].** `registerAction`/`invoke` would go around the Warden, and they are fire-and-forget and at-most-once. *Fix:* send DMs with structured `data: {action, args}`, and run tools only inside the protected agent after an allow.

### Minors (grouped)
- **Loops and quota:** a hop cap of 3 or fewer plus a per-conversation attempt cap. Scripted attacks, not a free-running agent. A small, fast classifier model with strict JSON output. Check `GET /v1/workspace` before recording.
- **Visibility on video:** a split screen with the Relay observer stream (`ot_live_`, never `rk_live_`) on the left and the Warden's live state (seq, chain head, budget, pending) on the right.
- **Rendering:** Terse socket messages can arrive out of order, so sort by seq. A 10-line reconnect that fetches a new grant. Keep tokens out of `@Emittable` fields.
- **Latency:** run the rules first and return at once on a block; call the classifier only on messages the rules allow. Show an "inspecting..." state and per-card ms. Warm each Warden up before recording, since the cold start after 10 s idle is about 334 ms.
- **Live-final fallback:** a local Relay engine, `terse actor dev`, and the recorded clip ready.
- **Naming:** "Medium" is the product, "Warden" is the actor. Explain the séance meaning once. Show one adopt line: `medium protect acme-buyer --policy acme.json`.

## Goals vs. Non-Goals

**Goals**
- Enforcement that can't be bypassed, inbound and outbound, by construction (B1).
- A Warden actor with real cumulative, serialized policy state and a durability moment (M3).
- An honest, live, reproducible scoreboard: attacks blocked, false positives, quarantined (M2).
- A visible Relay hop (observer stream) and visible actor state on the same screen.
- One concrete business story with named assets and a deny reply the viewer can read.

**Non-Goals (today)**
- A network-level firewall or interception inside Relay itself. Medium is a policy gate for agents whose identity it owns.
- Cross-workspace or federated routing, arelay.to handles, Relay Connect.
- Supabase as a system of record; tamper-proof storage against an attacker with root access.
- Free-running adversarial agents, or a classifier benchmark.
- Relay typed actions as the request channel.

## Alternatives Weighed

| Decision | Option chosen | Rejected | Why |
| --- | --- | --- | --- |
| Enforcement point | Warden/bridge owns the agent's only Relay token | Passive tap via webhook or observer | A tap can't block anything (B1) |
| Where the classifier runs | Bridge, before a sync `decide()` | Inside the actor with `@Interleave` | Chain fork, lost rollback (B3) |
| Transport | Local SDK listener on `'*'` | Webhook + Freestyle VM + TLS | No public URL; handles DMs and channels (M4) |
| Approval queue | Actor `@Emittable` state + bridge page | Supabase queue + Realtime | One source of truth, fewer seams (M5) |
| "Flight recorder" proof | Durability/replay of decisions; anchored tamper check only if time allows | Self-verifying chain vs a staged naive log | Straw man (B2) |
| Hero metric | Mixed attack/benign tally from the ledger | "10/10 → 0/10" | Circular; block-all scores the same (M2) |
| Victim agent | Deterministic tool executor | A gullible LLM tuned by prompting | Before-shot happens every run (M2) |
| Request format | DM with `data:{action,args}` | Relay `registerAction` | Actions bypass the Warden; at-most-once (M10) |

## Key Decisions & Staging for Next Steps

**Decide now (before any code):** the topology in B1, the transport in M4, the identity list (vendor, warden-acme-buyer, warden-acme-finance, all suffixed with `runId`), the scenario and policy JSON (M9), and the verdict schema (M6).

**Staging (time boxes):**
1. **By 13:45, core loop end to end.** Seed script, 3 identities, a listener bridge, a Warden actor with sync `decide()` (dedupe, seq, cumulative budget/strikes), deterministic rules, a deterministic victim, deny replies, and a `MEDIUM_ENABLED` flag on one code path.
2. **By 14:15, scoreboard + screen.** A scripted attack/benign run, a live tally from the ledger, a split screen with the observer stream and Warden state, and the kill-and-restart durability beat.
3. **By 14:40, classifier.** One small model, strict JSON, fail-closed, called only on messages the rules allow, catching exactly one attack the rules miss. If it isn't working, the rules alone carry the tally.
4. **Only if 1-3 are done:** quarantine release from a bridge page on the phone, plus the 60 s alarm auto-deny. Then an anchored tamper check (30 minutes at most), or cut it.
5. **15:00, code freeze.** Record the video, write the description (name the packages, position against Ratify, say the attack set is scripted), submit before 16:00.

**Open items:** rerun the Structural lens if time allows (status: not run). Confirm the hosted Relay plan's agent cap. Check that `dm.received` is delivered to an SDK listener; if it isn't, switch to one channel per conversation.

## Hackathon verdict

| Dimension | Score (0-10) | Note |
| --- | --- | --- |
| Survives review | 6 | Three blockers, all fixable by design choices made now; the concept as written would not survive Relay or Terse Q&A |
| 5-hour feasibility | 5 | Only about 2.5 h left; feasible only with the frozen scope above |
| Video-demo strength | 6 | The before/after and split screen are strong; it could look like a dashboard without the possessed styling and a durability beat |
| Meaningfulness | 8 | Strongest "why now" and buyer story; trust between agents across companies is a real gap |
| Relay prize fit | 7 | It is the founders' favourite topic, but it overlaps with Ratify; it fits well if positioned as the content/intent layer |

**Go/no-go:** GO, on the condition that the bypass-proof topology and frozen scope are adopted now. Cut the tamper beat and Supabase unless the core is done by 14:15.

**Top 3 changes that would most improve the idea:**
1. **Make bypass impossible by construction.** The Warden/bridge holds the protected agent's only Relay token. The agent has no credentials, and both inbound and outbound messages go through the gate. Say so on screen.
2. **Give the actor a real job and keep LLM calls out of it.** Cumulative spend, strike and trust state, enforced in a synchronous, serialized `decide()`, plus a kill-and-restart durability beat. That replaces the straw-man tamper scene and the Supabase queue.
3. **Replace "10/10 → 0/10" with an honest live scoreboard.** Scripted attacks of three kinds plus benign requests, a deterministic victim, a tally from the ledger showing false positives and quarantines, and one attack only the classifier catches. Position it against Ratify in the description.
