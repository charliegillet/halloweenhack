# Concepts Brief: Possession, swap the brain and keep the soul

**Author:** Charlie Gillet
**Date:** 2026-10-31

## Overview

Possession's claim is that an agent's identity and working memory live in Agent Relay, not in one model vendor's session. `scribe` is one Relay identity. Brain A, a Claude-backed Node process, answers requests 1-3 from `pm` in a `#work` thread. It is killed with `kill -9`. Requests 4 and 5 arrive while no brain is running. Brain B, an OpenAI-backed process with empty memory, reconnects with the same `at_live_` token, rebuilds context from `messages.list`, skips handled items, posts a lease line and answers 4 and 5. When Brain A returns, it reads the lease, reacts with a ghost and exits. A soul card and a step timeline on the projector show the brain flipping from Claude to OpenAI. Source: [2-possession-swap-the-brain-keep-the-soul.concept.md](./2-possession-swap-the-brain-keep-the-soul.concept.md).

Context: Haunted Hacks: Real-Time AI Edition, YC SF, Sat 31 Oct 2026. It is about 13:00 and building stops at 16:00, so **about 2.5-3 hours of build time are left**. Round 1 is judged from a demo video plus a description, and a working demo is required. **The target is the Agent Relay track (Mac mini) only.** Terse is a bonus.

Six Goldfish lenses ran in BRAINSTORM mode: Design Critic, Codebase Details, Zoom Out, Comprehension, Implementation Readiness and Structural. **All six completed and all six returned *proceed-with-changes*.** They agree on the shape of the problem. The idea is cheaper than Afterlife (no Terse, 3 identities, one thread) and fits the Relay track well. But it rests on three unverified API behaviours (two sockets on one token, reactions in list results, `data` surviving the round trip). As written it runs on one laptop for one owner, which a model-fallback router could replace. And if it works, nothing visibly changes on screen.

## Analysis

Findings are deduplicated across lenses. The count in brackets shows how many of the 6 lenses raised each one.

### Blockers

**B1. Nobody knows what Relay does with two live connections on one token [6/6].** The whole concept is "same `at_live_` token, two vendor processes". The hosted server might drop the older socket, so a returning Brain A knocks Brain B offline. It might send events to both sockets, so both brains answer the next request. Or it might hand the per-recipient queue to one socket at random. `kill -9` can also leave Brain A's socket looking connected for a few seconds while Brain B boots. On top of that, the sources disagree about `register`. One says it adopts an existing name and rotates the token, which would silently kill the old token. The other says it is create-only and throws. One stray setup call could break the returning brain with an auth error mid-demo.
*Fix:* run a 15-minute spike **before any LLM code**. Two `node` processes reconnect with the same token. Post one message and log which process receives it and whether either is disconnected. Kill one and confirm the other keeps working. Guard registration in code: if `.tokens.json` exists, never call `register`, and keep a backup copy of the file. If two sockets break each other, take cut item 5 at once (end on Brain B finishing) and do not build around it.

**B2. The "handled" checkpoint depends on reactions nobody has read back, and the state lives in four places [6/6].** Brain B skips requests that carry `scribe`'s checkmark. Nobody has confirmed that `messages.list` on 14.0.0 returns reactions per message, or accepts a thread filter. "Handled" is also recorded four ways: the checkmark, the lease message, `data:{step, brain, epoch}`, and the optional SoulVault. Brain A, Brain B and the UI would each merge these their own way. Posting the answer and adding the checkmark are two calls, so a kill between them leaves an answered request with no checkmark, and Brain B answers it again. Live replay of queued requests 4 and 5 can also overlap the history read, so the same request reaches Brain B twice.
*Fix:* write one pure function, `deriveState(threadMessages) -> {epoch, owner, handledRequestIds, pendingRequestIds, sourceIds}`, imported by both brains and the UI. **The only authority for "handled" is a `scribe` reply whose `data.requestId` names the request.** That reply is an ordinary message, so if `messages.list` returns anything, it returns it. Reactions are decoration only. Keep one in-process `seen` set keyed by request messageId, seeded from history before the listener is attached, and drop any replayed event already in it. Test `deriveState` against a JSON fixture of a recorded thread before writing LLM code.

**B3. Takeover and stand-down have no written rule [5/6].** Brain B and the returning Brain A are in the same position: a fresh process that finds someone else's lease. Relay cannot say whether the lease holder is alive. A naive "highest epoch wins, new boot claims max+1" rule makes Brain A take the identity back at epoch 3. Nothing says Brain A posts an epoch-1 lease when it starts. And if a brain attaches `addListener('*')` before its history read finishes, a `pm` message can be answered before the lease check.
*Fix:* one script, `scribe.ts --brain claude|openai --mode start|takeover|return`. `start` posts lease epoch 1. `takeover` posts epoch max+1. `return` only reads; if the latest lease is not its own, it reacts with the ghost and exits. Fixed boot order: reconnect, `messages.list`, `deriveState`, decide, and only then attach the listener. Re-read the lease right before every post and abort if a newer epoch exists. Each decision prints one line, e.g. `lease epoch 2 held by gpt; I am epoch 1; standing down`. The swap is started by the operator, and the concept already admits that, so a CLI flag is honest.

**B4. The vendor swap is self-reported and invisible [4/6].** The brain badge comes from `data:{brain}`, which any process can write. In the raw observer stream, one Node process switching a string from "claude" to "gpt" looks the same as a real swap. And when the demo works, `pm` "never notices", so a video viewer sees five answers in a thread and a terminal restart, which looks like an ordinary chatbot. "Soul", "epoch", "lease" and "fencing" are internal words and do not explain it.
*Fix:* make the swap the loudest thing on screen, and make it provable. (1) Put the brain in the message text itself, e.g. a `[claude-opus]` / `[gpt]` prefix on every reply and on the lease line, so it shows in any Relay client. (2) Put provider evidence in each step's `data`: provider, exact model string, the provider's response ID (`msg_...` or `chatcmpl-...`/`resp_...`), pid and hostname, and show the response ID on the timeline. (3) Brain B's terminal boots with `memory: 0 messages` and counts up as it reads Relay. (4) Make request 4 depend on a detail only Brain A's step 2 contains ("use the root cause you named in step 2"), so Brain B visibly proves it recovered context. Captions use plain words: "Claude process killed", "OpenAI process, empty memory", "read 9 messages from Relay".

**B5. Relay is not essential while both brains run on one laptop for one owner [4/6].** "If the Claude call fails, send the same messages array to OpenAI" is about 10 lines with OpenRouter, LiteLLM or a local SQLite transcript. Same machine, same owner and a scripted `pm` put every Relay differentiator except cross-vendor into a setting where it isn't needed. The obvious judge question is "why not just a fallback model?", and the concept has no answer.
*Fix:* **put Brain B on a teammate's laptop**, ideally with their own OpenAI key, and have it never see the task before. The pitch becomes "my agent went offline; my teammate's agent picked up its identity and memory from Relay alone, with no shared database". Run `pm` (or a human typing at least one request) from a third machine and label each pane with the machine and owner. The answer to "why not a file?" goes in the description and the closing slide: the memory is the conversation the other parties already see, there is no extra sync layer, requests that arrive while no brain runs are held, and the handle people address (`@scribe`) never changes. This costs almost no build time.

**B6. Rehearsal runs will pollute the demo run [4/6].** Relay keeps history forever, and the team will record 5-10 takes and then run live once more as a finalist. Old checkmarks, leases and replies leak into the "handled" set, the lease lookup and the "rebuilt from N" counter. A stale epoch-2 lease from take 3 makes a fresh Brain A stand down at once. A reused `taskId:step` idempotency key may make the server dedupe the new take's posts and return old IDs, so nothing new appears.
*Fix:* a `reset` script gives every run a fresh `runId`. `taskId = runId`, keys are `runId:step`, every run has a new thread root, and every read filters on that root and `runId`. Never register agents per take (the 5-agent cap, token rotation); reuse the 3 identities.

### Majors

**M1. The "durable delivery" claim may never be exercised [2/6].** If Brain B learns about requests 4 and 5 from `messages.list`, that is channel history, which is stored anyway, not per-recipient delivery to an offline agent. The Relay founders built the delivery layer and will notice. *Fix:* spike whether requests 4 and 5 arrive as delivered events on Brain B's listener after reconnect (or through `inbox.get`, delivery receipts or `messages.readers`). If they do, show it: "stored at T, delivered to scribe at T+n, brain gpt". If not, drop the claim and pitch shared history plus portable identity only.

**M2. "Duplicates: 0" is undefined, and the idempotency key can hide the failure it is meant to show [4/6].** If a returning Brain A ignores the lease and re-posts step 4, the server dedupes it and the counter still reads 0. The local engine's idempotency is in memory and per process, and cross-process dedupe on hosted is not confirmed. A hard-coded counter would be a faked metric. *Fix:* each brain logs every send with its result (new messageId or deduped). Show two computed numbers: "posts attempted / deduped" and "duplicate steps in history" (more than one `scribe` reply per `runId:step`). A stand-down shows as 0 attempts; a server dedupe shows as "attempted 1, deduped 1". Both are honest. If hosted dedupes across connections, say so: Relay itself makes the claim true.

**M3. The lease is advisory, not enforced [3/6].** Brain A stands down only because its own code checks. Relay does nothing to stop a stale brain posting, and the only real fencing (SoulVault) is cut first. "What stops the old brain writing?" answered with "politeness" invites the founders' "orchestration is still on you" critique. *Fix:* call it an advisory lease on the limits slide, not a lock. Optional cheap enforcement in about 20 lines of Node: `pm` (or a small watcher) reacts with a cross to any `scribe` message whose `data.epoch` is below the latest lease, so the fencing is visible Relay traffic.

**M4. Too much protocol and UI for the time left [5/6].** Checkmarks, a lease message, epochs, ghost stand-down, idempotency keys and readers, plus a colour-flipping soul card, a timeline, hover tooltips with message IDs, and a staged ChatGPT copy-paste "before" scene. Two LLM integrations, a `pm` driver, the lease logic, the UI and a 90-second edited video all have to fit by 16:00. Message IDs in a tooltip mean nothing in a video, and a tiny ghost emoji plus a vanished process does not read at a glance. *Fix:* the core needs one rule ("handled = a `scribe` reply with that `requestId`"). Build one page: the observer stream plus one status line (`brain: claude | none (2 waiting) | gpt, context from N msgs`). Swap the ID tooltip for an always-visible "built from" strip of short quotes from steps 1-3. Replace the "before" scene with a caption card. Show Brain A's stand-down line in its terminal next to the ghost reaction. LLM cost is trivial (under $1 for all rehearsals); time is the budget.

**M5. It overlaps Afterlife and the obvious "kill and resume" demo [5/6].** The repo's own Relay research lists "kill one agent mid-task, messages queue, resume" as its top idea, Afterlife is already in the repo, and other teams read the same public docs. "One identity across vendors" vs "failover between agents" is too subtle for 90 seconds. Rebuilding Relayhistory handoffs in app code can look like reinventing the sponsor's feature. *Fix:* **decide Possession vs Afterlife by 13:15**; do not split effort. If Possession, the headline is what Afterlife lacks: the counterpart never re-addresses (`pm` keeps talking to `@scribe`) while a different person's machine and a different vendor take over underneath. Show `pm`'s view next to the swap. Spend 10 minutes checking whether Relayhistory handoffs can be called from SDK 14.0.0; use it as the resume pointer if it can, and name it as the productised version if not.

**M6. A human starts the takeover [2/6].** Someone types `kill -9`, starts Brain B and restarts Brain A. A judge will ask who noticed the outage; the answer is a person at a terminal, which sits badly with "no meat proxy". *Fix:* keep the honest `--mode takeover` flag as the floor. Stretch: a standby watchdog that watches the thread with the **observer token** (read-only, so no second `scribe` socket) and runs takeover when a `pm` request has had no `scribe` reply for 10 s. The screen then shows "request 4 unanswered for 10 s, taking over" with no human input after the kill.

**M7. `pm` on a 90-second timer couples the beats to the operator's reflexes [3/6].** Kill a few seconds late and Brain A answers request 4; early, and "2 waiting" shows 1 or 3. A video can be retaken; the live final cannot. *Fix:* drive `pm` by keypress (`pm next`), or gate it on state (post 4 and 5 once no `scribe` reply has appeared for N seconds). Better still, a human types at least one request live. If `pm` is scripted, say so: the traffic is real, the requester is scripted.

**M8. The soul card shows states Relay does not carry [3/6].** "No brain, 2 waiting" needs liveness, and the observer stream carries messages, not presence. "The exact message IDs its prompt was built from" exists only inside the brain process. Filling these from a side channel, or computing "handled" differently from the brains, makes the screen partly faked and shows numbers that disagree with what the brains did. *Fix:* the UI feeds observer events into the same `deriveState`. "Waiting" = `pm` requests with no `scribe` reply; "no brain" = no `scribe` lease or step since the kill, labelled "no reply yet". Put prompt sources into Relay as `data.sourceIds` on each step, and compute "rebuilt from N" as `sourceIds.length`.

**M9. Nothing on screen explains a stall [1/6].** If a provider call is slow or rate-limited, or reconnect fails during the judged 20-second window, the timeline just stops and nobody can tell a Relay problem from a provider or token problem. *Fix:* each brain prints one structured line per phase (`reconnect ok as scribe`, `listed N msgs (thread X)`, `skipped [1,2,3]`, `provider=openai model=... req=... 1.8s`, `posted step 4 msgId=...`). A 30-second `preflight` script checks the `at_live_` token, observer scopes, both provider keys and SDK 14.0.0, before every take and before the live slot.

**M10. Two brains invite two codebases and two output styles [2/6].** Separate processes that must keep "the same numbering and template" will drift within the hour, and one may fail to parse the other's lease or answers. If GPT renumbers step 4, the resume looks broken even though Relay worked. *Fix:* one program, `scribe.ts --brain=claude|openai`. The only per-vendor code is `complete(prompt): Promise<string>`, about 15 lines each. The program writes the step header (`Step 4/5`, title, brain tag) and the LLM writes only the body, at temperature 0. Say on screen that it is the same binary with a different flag; that is the proof that the brain is swappable.

**M11. Message metadata may not survive the round trip [1/6].** DM `data` reportedly comes back as `metadata`, and nobody has confirmed that `messages.list` returns either for channel thread replies. Lease parsing, skip logic, badges and the timeline all read it. *Fix:* fix one versioned envelope now: `{v:1, runId, step, requestId, brain, model, providerReqId, epoch, kind:'answer'|'lease'|'standdown', sourceIds}`. Read `data ?? metadata`. Also write a trailing text tag (`[scribe v1 step=4 brain=gpt epoch=2]`) and parse it if metadata is missing. Validate with Zod in `deriveState`.

**M12. Quota and plan are unchecked [1/6].** One run is about 20-25 writes. Fine on the 10k-message `free` plan; on the 100-message `trial` plan that is about 4 takes before `429 plan_limit_exceeded`. *Fix:* call `GET /v1/workspace` now and check `plan`. Keep a spare workspace with the same 3 identities registered and tokens stored, switchable by env flag. The local engine (`npx @relaycast/engine`) is for development and a finals fallback only; it removes the cross-person story, so do not record the video on it.

### Minors (grouped)

- **Observer scopes and reaction events [4/6].** `stream:read` alone does not deliver message or thread payloads. Mint the observer token with `messages:read` and `threads:read` in the setup script and confirm in the first spike that a reaction event and a message's `data` reach the browser. If reactions do not stream, poll `GET /messages/{id}/reactions` or render them from step and lease `data`.
- **The numbers in the script don't add up [3/6].** 6 requests vs 5 used; "rebuilt from 11 messages" vs about 9 listed. Compute every counter from real API responses, never type a number into the UI or the script. Drop request 6, or use it for the stand-down beat.
- **SoulVault is a second source of truth [4/6].** It contradicts the core claim that Relay history alone is enough, and Terse's alarm API conflict makes it a time sink. Do not open the Terse code unless the core demo is recorded by 15:15. If it returns, it is a read-only mirror that only rejects stale `commitStep`, never what the brains read.
- **Token exposure on camera [1/6].** Load tokens from a file that is never printed, show only process names and PIDs, and review the video before upload.
- **Task content is arbitrary [1/6].** A 6-section postmortem from a scripted `pm` has no stakes. Use something the audience cares about, such as the team's own submission description, posted by a teammate.
- **Long-run maintenance [1/6].** A hand-built lease protocol over chat messages with no schema breaks silently if Relay changes reactions or metadata. Write the one-paragraph protocol schema and say in the description that it is meant to be replaced by native Relay handoffs.

## Goals vs. Non-Goals

**Goals**
- Show one Relay identity (`@scribe`) surviving a vendor change: Claude brain dies, OpenAI brain resumes, `pm` never re-addresses.
- Resume using **only** Relay thread history, provably: response IDs, `sourceIds`, a step-4 answer that depends on step 2.
- Make it cross-person: Brain B on a teammate's laptop, `pm` or a human on a third machine.
- Show real, unedited Relay traffic: observer stream plus brain tags in message text; every number computed from API responses.
- No duplicate work, measured honestly (attempted / deduped / duplicates in history).
- A repeatable take: fresh `runId`, keypress-driven `pm`, preflight script.

**Non-Goals**
- Enforced fencing or a real distributed lock. The lease is advisory and says so.
- Resuming a half-generated reply in flight (it is lost and redone).
- Automatic outage detection by Relay (the watchdog is a stretch, built on our code).
- Terse SoulVault, token vault, alarms.
- Hover tooltips, the "before" scene, colour polish beyond one status line.
- Claiming per-recipient durable delivery unless the spike shows it.
- Building both Possession and Afterlife.

## Alternatives Weighed

| Option | Verdict | Why |
| --- | --- | --- |
| As written (one laptop, scripted `pm`, reaction checkpoints, soul card) | Reject | Fails B2, B4, B5: unverified API, invisible swap, replaceable by a model router |
| **Cross-machine Possession, reply-as-checkpoint, one binary with `--brain`/`--mode`** | **Adopt** | Same build cost, makes Relay load-bearing (identity plus memory across people and vendors), one source of truth |
| Watchdog-triggered takeover via observer token | Stretch | Answers "who noticed?" without a second `scribe` socket; only after core is recorded |
| End on Brain B (cut stand-down beat) | Fallback, pre-agreed | Take at once if the two-socket spike fails or by 14:45 the return beat is flaky |
| Relayhistory handoffs as the resume pointer | Check for 10 min | Reuse beats rebuilding, if callable from 14.0.0; otherwise name it on the slide |
| Terse SoulVault fencing | Cut | Second source of truth, alarm API conflict, not judged on this track |
| Local engine for the recorded video | Reject | Removes the cross-person story; keep for development and as a finals fallback |
| Afterlife instead | Decide by 13:15 | Afterlife is heavier (Terse alarms, 4+ identities, untested actor fetch); Possession is cheaper and more Relay-centred once B5 is fixed |

## Key Decisions & Staging for Next Steps

**Decide now (before any code):** Possession, not Afterlife (M5). Three fixed identities, `scribe`, `pm`, `charlie`, registered once with a guard (B1). Which teammate's laptop runs Brain B, and with whose OpenAI key (B5). The envelope schema and the rule "handled = `scribe` reply with `requestId`" (B2, M11). The `--mode start|takeover|return` rules and boot order (B3). The task content, with request 4 depending on step 2 (B4).

**Staging (time boxes):**
1. **13:00-13:20, spike (blocks everything).** S1: two processes on one `at_live_` token, who receives, who is dropped. S2: thread-filtered `messages.list`, and whether `data` (or `metadata`) and reactions come back. S3: does reconnect deliver queued messages to the listener (M1). S4: does hosted dedupe `idempotencyKey` across processes. S5: observer token with message and thread scopes shows a message, its `data` and a reaction in the browser. S6: `GET /v1/workspace` plan. Only S1 and S2 block the build; S1 failing means cut the stand-down beat now.
2. **13:20-14:15, core.** `reset`, `preflight`, `deriveState` with a fixture test, `scribe.ts --brain --mode` with the shared template and per-phase log lines, keypress `pm`. Brain A answers 1-3; kill; 4 and 5 posted; Brain B on the teammate's laptop takes over and answers from history only. **Record a backup take as soon as this works.**
3. **14:15-14:45, return beat and honesty.** `--mode return` stand-down, re-read lease before every post, attempted/deduped/duplicates counters, provider response IDs in `data`.
4. **14:45-15:15, screen.** Observer stream plus one status line and the "built from" strip, all fed by `deriveState`. Brain tags in message text. Stretch only if time remains: observer-token watchdog, `pm` cross on stale epochs.
5. **15:15, code freeze.** 15:15-15:45 record on hosted with a fresh `runId`, three machines labelled on screen, tokens hidden. 15:45-16:00 description: cross-vendor, cross-person, shared history as memory, offline delivery only if S3 passed, advisory lease and its limits, Relayhistory handoffs as the productised path. For finals, keep the recorded video, the spare workspace and the local engine ready.

**Open items:** S1 decides whether the return beat exists. S3 decides whether "durable delivery" is in the pitch. Confirm `register` behaviour on 14.0.0 before anyone runs setup again.

## Hackathon verdict

| Dimension | Score (0-10) | Note |
| --- | --- | --- |
| Survives review | 5 | Six blockers, but all are design decisions or a 20-minute spike; all six lenses said proceed-with-changes |
| Feasibility in remaining time | 6 | Cheaper than Afterlife (no Terse, 3 identities, one thread) once protocol and UI are cut to one rule and one status line; S1 is the one real unknown |
| Video-demo strength | 5 | As written the swap is invisible; about 7 with brain tags in message text, Brain B's memory counter, a step-4 answer that depends on step 2, and three labelled machines |
| Meaningfulness | 5 | Vendor lock-in of agent context is real, but on one laptop a model router solves it; rises with the cross-person framing and a real task |
| Relay prize fit | 6 | About 4 as written (one owner, history read only); about 8 with cross-machine Brain B, the same handle, shared history as memory, and visible delivery if S3 passes |

**Go/no-go:** GO, conditional on choosing Possession over Afterlife by 13:15, passing spike S1/S2 by 13:20 (or cutting the stand-down beat at once), and running Brain B on a teammate's laptop. Do not record the final video on one machine or on the local engine.

**Top 3 changes that would most improve the idea:**
1. **Make Relay load-bearing across people.** Brain B runs on a teammate's laptop with their own OpenAI key and has never seen the task; `pm` or a human posts from a third machine. Pitch it as "my agent went offline, my teammate's agent took over its identity and memory from Relay alone", and answer "why not a fallback model?" on the closing slide.
2. **One source of truth, one binary, spike first.** A 15-minute spike on two sockets per token and thread-filtered `messages.list` with `data`. Then `scribe.ts --brain claude|openai --mode start|takeover|return` with a fixed boot order, and a shared `deriveState` where "handled" means a `scribe` reply carrying `requestId`. Reactions are decoration, every run gets a fresh `runId`, every number is computed.
3. **Make the swap visible and provable.** Brain tag in every message's text, provider response IDs in `data`, Brain B booting with "memory: 0" and counting up from Relay, and request 4 that only makes sense with Brain A's step 2. Cut the soul card to one status line and a "built from" strip.
