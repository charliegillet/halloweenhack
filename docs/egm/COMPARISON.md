# Concept Comparison: Haunted Hacks, 31 Oct 2026

Sources: the five `*.concepts_brief.md` files in this folder. Scores are copied from each brief's "Hackathon verdict" table. Total is the plain sum of the five dimensions (max 50).

## Scores

| Concept | Survives review | Feasibility | Video demo | Meaningfulness | Relay prize fit | **Total** | Go/no-go in brief |
|---|---|---|---|---|---|---|---|
| Hearsay Hollow (trace a lie across agents) | 6 | 5 | 8 | 7 | 8 | **34** | GO with changes |
| Ghost Ticket (cross-org agent debugging) | 6 | 5 | 7 | 7 | 8 | **33** | GO, conditional on frozen scope and restart spike |
| Medium (firewall/flight recorder for agent traffic) | 6 | 5 | 6 | 8 | 7 | **32** | GO, conditional on bypass-proof topology |
| Witching Hour (incident lock manager) | 5 | 5 | 5 | 8 | 5 | **28** | Conditional GO |
| Midnight Soul Exchange (race-free drop) | 4 | 3 | 6 | 4 | 4 | **21** | No-go as written |

Caveats on the numbers:
- The top three are within 2 points of each other. Those gaps are within the noise of a self-scored review. Read the top three as roughly tied on totals and decide on the specific dimensions that matter for each prize.
- Medium was reviewed by 5 lenses, not 6. The Structural lens did not run, so its score has had less scrutiny than the others.
- Every concept scores 5 or lower on feasibility. None of them is safe in the time left without the cuts listed in its brief.

## Ranking

1. **Hearsay Hollow.** Joint-highest Relay fit (8) and the highest video score (8). It uses Relay for several real jobs (DMs, metadata as the provenance carrier, durable catch-up, observer stream). Its blockers are missing decisions, and the brief already makes them. The core beats (inject, spread, graph, TRACE) do not depend on the risky kill/restart beat, so a fallback video exists even if that beat fails.
2. **Ghost Ticket.** Same Relay fit, slightly weaker video. It is the founders' own public roadmap item ("debug with customers, agent to agent"), which helps fit and hurts originality, because other teams are likely to build the same thing. It also depends on two LLM agents converging on a planted bug within about 90 seconds on every take, which is harder to make repeatable than Hearsay's scripted spread.
3. **Medium.** Best "why now" and buyer story (meaningfulness 8), but it overlaps with Relay's own Ratify demos, and on video it can look like a dashboard. Its hero number is circular unless the scoreboard is rebuilt as the brief describes.
4. **Witching Hour.** Strong problem and the best YC-interview story, but Relay is decorative unless claims are routed through it, and it is the least visual of the five.
5. **Midnight Soul Exchange.** The reason for picking it (an iPhone/Durable Actors track) was not announced. It has the most moving parts, the weakest Relay story, and the lowest feasibility. Drop it.

## Recommendation

**Agent Relay prize (Mac mini): Hearsay Hollow.** It ties Ghost Ticket on Relay fit, but its kill-and-catch-up beat is exactly what the Relay founders said they want to see, and it uses Relay metadata as the actual provenance mechanism rather than just as chat. It also carries less originality risk than Ghost Ticket.

**Grand prize: Hearsay Hollow.** It has the strongest video (8), and Round 1 is judged on a video plus a description. Its problem (prompt injection spreading through an agent fleet with no record of origin) is real and easy to explain in one sentence. Medium scores higher on meaningfulness, but a video judge sees the demo first, and Medium's demo is its weakest part.

There is only time to build one concept, so the same pick for both prizes is the right call. If the reconnect spike (below) fails badly and the Relay engine is unstable, the fallback is Ghost Ticket only if the team prefers its story; otherwise keep Hearsay and cut the kill beat, since the rest of Hearsay does not depend on it.

## Single biggest risk of each

| Concept | Biggest risk |
|---|---|
| Hearsay Hollow | The kill/catch-up beat assumes a reconnecting SDK listener receives the DMs queued while it was down. Nobody has checked this. If it is false and the team builds around it anyway, the headline Relay beat either fails on camera or gets faked, and the founders say they spot fakes. |
| Ghost Ticket | Scope: about nine moving parts, including two tool-using LLM agents that must find a split-evidence bug in under 90 seconds on every take. If any part is half-built at 15:15, the single recorded take breaks. |
| Medium | Credibility: unless the Warden owns the protected agent's only Relay token, it is an audit log, not a firewall, and the "10/10 to 0/10" number is the team's own rules beating the team's own attacks. Relay judges will ask about bypass first. |
| Witching Hour | Relay is decorative. If agents call the actor directly, removing Relay leaves the demo working, which fails the Relay judges' main test. |
| Midnight Soul Exchange | It does not fit any announced prize well, and with feasibility at 3 it is unlikely to produce a working demo by 15:00. |

## First 30 minutes for Hearsay Hollow

Goal for the half hour: prove or disprove the riskiest assumption before writing any product code, and lock the decisions that stop the build from drifting.

1. **Minutes 0-5: pin and seed.** Create the repo skeleton. Pin `@agent-relay/sdk@14.0.0`, `terse-sdk`/`terse-cli@0.14.7`, `durable-actors@0.14.4`, and commit the lockfile. Create a Relay workspace with `expires_in_seconds` of at least 172800. Call `GET /v1/workspace` and stop if the plan is `trial`.
2. **Minutes 5-10: seed script.** Register the five fixed agents once: `ghosta`, `ghostb`, `ghostc`, `corrector`, `outsider` (no hyphens). Save each `at_live_` token to `.tokens.json`. All later code calls `workspace.reconnect({apiToken})` and never `register` again.
3. **Minutes 10-25: reconnect spike, no LLM.** Two bare Node processes, `ghosta` and `ghostb`, each listening on `'*'` and logging `dm.received`. Stop `ghostb`. Have `ghosta` send it two DMs with `data: {hopId: 'test1'}` and `{hopId: 'test2'}`. Restart `ghostb` with `reconnect`. Record exactly what arrives and whether the metadata survives.
   - If both DMs arrive with metadata intact: the kill beat stays as designed.
   - If they do not: redefine the beat now as "the restarted ghost rebuilds its state from TownLedger and receives the correction", and write that down. Do not fake replay.
4. **Minutes 25-30: freeze the contract.** Write `prov.ts` with the shared type `Prov = {prov_v:1, runId, hopId, claimId|null, parentHopId|null, hop, kind:'inject'|'gossip'|'correction', origin}` and the loop-guard constants (one forward per claim per ghost, `hop < 3`, 25-message budget, corrections never reach the LLM). Put decisions D1-D6 from the brief in the README in five lines.

Next after that: the TownLedger actor (append-only rows, actor-assigned `seq`, idempotent insert on `hopId`, `trace`, `snapshot`), then the SVG graph immediately after it so the hero visual exists early. Record a safety take as soon as inject, spread and TRACE work.
