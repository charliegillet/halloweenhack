# Afterlife: submission pack

**One line:** When an agent dies, its work doesn't.

**Track:** Agent Relay

---

## (a) Builderbase project description

**Afterlife** lets a different agent finish a job when the first agent dies partway through. If the job ends in a side effect, such as issuing a refund, that side effect happens exactly once.

The demo job is "process a refund for a haunted-hotel guest" in 6 steps. The input is a short, fixed fact sheet.

1. Read the complaint.
2. Check the booking facts.
3. Decide the amount.
4. Draft the apology.
5. Run a policy check.
6. **Issue the refund**, which appends one line to `outbox.jsonl`.

Without Afterlife, an agent that dies mid-job leaves two bad options. Either the refund is lost, or a restart issues it twice. Afterlife avoids both.

GPT (`gpt-4.1-mini`, OpenAI API) does steps 1–3 and is then killed with `kill -9`. Eight seconds later its lease expires. The always-on dispatcher hands the task to a standby Claude agent (`claude-haiku-5-5`, Anthropic API) through Agent Relay, and the standby is offline at that point. When it comes up it reads the queued handoff, rebuilds steps 1–3 from the task's Relay channel and finishes steps 4–6. One refund is issued.

### Real-time AI usage via Agent Relay

Agent Relay carries the whole recovery. This uses `@agent-relay/sdk@14.0.0`, pinned exactly, against the hosted endpoint `cast.agentrelay.com/v1` with an anonymous workspace.

- **Each task has its own Relay channel, which holds the shared history.** After each step the worker commits to the lease authority and then posts a checkpoint message to the channel (`{kind:'checkpoint', taskId, epoch, step, text}`). That channel is the only memory the standby gets. It reads the channel history (`messages.list`), keeps only steps the lease authority has committed, and resumes at `max(committed)+1`. Step 4's text quotes step 3. In the last clean run it opened "Per step 3, the refund amount is $120…".
- **Handoffs are delivered even when the recipient is offline.** When the lease expires, the dispatcher posts "presumed dead" in the task channel. It also sends a Relay DM to the standby (`{taskId, epoch, resumeFromStep, channel, summary}`, with idempotency key `taskId:epoch`). The standby is not running when the DM is sent. It starts about 4s later, receives its queued DMs as `dm.received`, skips stale ones left over from earlier runs, and acts on the current one.
- **The handoff is cross-vendor.** OpenAI's GPT dies at step 3 and Anthropic's Claude finishes. Relay is the common layer between the two vendors' agents. Neither agent uses the other's API.
- **Each agent has its own Relay identity and credentials.** The identities are `workergpt`, `standbyclaude`, `afterlife` (the dispatcher) and `workergptb` (the zombie). Each name gets a run-ID suffix, for example `standbyclaudeea72`. Every agent is registered once with `strict:true` and reconnects with its own token. Each process loads only its own token from the gitignored `tokens/` directory.
- **The board shows real Relay messages.** The board's relay observer pane lists the Relay message IDs that the agents report back after each post.

**Terse:** not used in this build. The lease module can switch backends (`LEASE_BACKEND=terse|local`), but the Terse Durable Actor backend is still a stub that falls back to the local backend. The demo runs on the local backend, an in-process timer inside the always-on server.

### Originality

The demo shows recovery after an agent crash as something you can watch, instead of describing it as a retry policy.

- **Claim and fence.** The lease authority is the only place a step can be committed. The worker sends a heartbeat every 2s, and each heartbeat re-arms an 8s lease. Every heartbeat and every commit carries `{taskId, epoch, step, seq}`. When the lease expires, the epoch goes up (1 → 2). The first `claim()` at the new epoch wins.
  - A commit from an older epoch is rejected and logged in the ledger, for example `REJECTED: epoch 1 < 2`.
  - A repeat of an existing `(epoch, step)` is a no-op, so retries are safe.
  - This is how "exactly once" is enforced rather than hoped for.
- **Zombie writes are fenced.** In the stretch run the worker is frozen (`kill -STOP`) instead of killed. It is woken (`kill -CONT`) after Claude has claimed the task, and it tries to write step 4. The lease authority rejects that write. On the board, its late Relay post appears crossed out as "stale (attempt 1, superseded)". The outbox still holds one refund.
- **Relay holds the agent's working memory.** No hidden database is passed between the agents. The standby rebuilds its context only from messages in the channel, checked against the lease authority's committed steps.

An independent critic said this was the idea most likely to work, not the most original one. That still holds. The novelty here is the fencing combined with handoff to an offline agent, not the idea of a lease.

### Working demo

These runs used real LLM calls with no stubs.

- **Main run (`refund142212`).**
  - GPT did steps 1–3, posting a Relay checkpoint after each commit, and step 3 decided $120.
  - The worker got `kill -9` as soon as step 3's checkpoint had a Relay message ID.
  - The lease expired 8.0s after the last heartbeat, and the epoch went 1 → 2.
  - The dispatcher posted "presumed dead" and sent the handoff DM while the standby was offline.
  - The standby started about 4s later, drained 3 queued DMs (skipping 2 stale ones), claimed epoch 2 and rebuilt steps 1–3 from the channel.
  - Claude did steps 4–6, the task reached DONE, and `outbox.jsonl` holds one refund.
- **Zombie run (`refund142409`).** The worker was frozen, then woken after Claude claimed the task. Its late step 4 commit was rejected with `REJECTED: epoch 1 < 2`, its late Relay post shows as stale, and `outbox.jsonl` holds one refund.
- **To reproduce:** run `npm install`, put the OpenAI and Anthropic keys in `.env`, then run `npm run seed`, `npm run server` and `npm run demo`. Use `npm run demo:zombie` for the zombie run. One run takes about 90–100s.

**Limits:**

- Everything runs on one laptop: the server, the worker, the standby and the board.
- Hosted Relay is slow under hackathon load. Each post takes 4–7s, and the standby takes about 25s from boot to step 4. Creating channels concurrently sometimes returned 500 errors, so the worker now creates its channel up front, with retries.
- Claude runs with thinking turned off and without `temperature: 0`, because `claude-haiku-5-5` rejects that parameter. GPT runs at temperature 0. Each step is capped at 260 output tokens.
- Each demo run empties `outbox.jsonl` first, so every take starts at zero refunds.

### UX / design

The board is one vanilla HTML/JS page at `http://localhost:4000`. It needs no build step and gets live updates over server-sent events (`/events`). It has five panels:

- **Task card:** the current state (RUNNING, LOST or DONE), the epoch, the owner and vendor, and the lease countdown. Each step shows who wrote it. The card shows a "presumed dead" badge when the lease expires and "finished by Claude" at the end.
- **Relay observer:** the real Relay messages with their IDs. Stale posts are crossed out and labelled "stale (attempt 1, superseded)".
- **Ledger:** the lease authority's log of heartbeats, commits, the alarm, the DM, the claim, any `REJECTED` row, and done.
- **outbox.jsonl:** the side effect itself, with a counter reading "refund issued: 1 time".
- **Processes:** a chip for each process that goes up and down as the worker dies and the standby starts.

A viewer can see the important facts directly: who died, how long detection took, who took over, what was rejected and how many refunds went out.

### Meaningfulness

Long-running agent jobs end in actions that cost money or can't be undone, such as refunds, payouts, emails, orders and deploys. Agents crash, get preempted, run out of budget or hang, and model vendors have outages. If the work is lost, a human redoes it. If a restart repeats the action, a customer gets paid twice. Afterlife's pattern needs four pieces:

- a lease that detects the death,
- an epoch that fences the dead agent,
- a shared Relay channel as the checkpoint history,
- a queued DM, so the replacement doesn't have to be running yet.

With those, a job can survive the death of its agent, and even a switch to another model vendor, without duplicating its side effect. It works across vendors because the recovery state lives in Relay and the lease authority, not inside one vendor's runtime.

---

## (b) Demo video script (~90s)

Record with `STEP_DELAY_MS=2500 STANDBY_DELAY=6 OPEN=0 npm run demo` and keep the board full screen. The real run takes 90–100s. Most of the standby's ~25s from boot to step 4 is Relay latency, so speed up or cut that stretch and label it on screen.

| Time | On screen | Caption | Voice-over |
|---|---|---|---|
| 0:00–0:10 | **Before shot.** A title card illustrating the problem (not a feature of the app): one agent dies during step 4 of a refund job. A restart either never issues the refund or, in the second version, `outbox.jsonl` shows two refund lines. | "Agent dies mid-job → refund lost… or issued twice." | "Agents die mid-job. Restart them blindly and the refund is lost, or you pay the guest twice." |
| 0:10–0:15 | Title: **Afterlife**, with the tagline. | "When an agent dies, its work doesn't." | "This is Afterlife, built on Agent Relay." |
| 0:15–0:30 | The board. The task card is RUNNING at epoch 1, owned by workergpt (OpenAI). Steps 1–3 appear one by one, and each gets a checkpoint with a message ID in the relay observer. Heartbeat rows scroll in the ledger. | "GPT (OpenAI) · 6-step refund job · checkpoint to Relay after each commit" | "GPT is processing a refund for a haunted-hotel guest. After each step it commits to the lease authority and posts a checkpoint to the task's Relay channel. Step 3 decides $120." |
| 0:30–0:35 | The terminal shows `kill -9`, and the workergpt chip goes down. | "kill -9 workergpt" | "Now we kill it. No goodbye." |
| 0:35–0:45 | The lease countdown runs out. The card turns LOST with the "presumed dead" badge and the epoch goes 1 → 2. The ledger shows the alarm row with the detection time (~8s). | "Lease expired after 8.0s → epoch 2" | "Eight seconds without a heartbeat and the lease expires. The epoch goes up, so nothing from the old agent can commit again." |
| 0:45–0:52 | A DM row appears in the ledger. The processes panel shows standbyclaude is **down**. | "Handoff DM queued, recipient offline" | "The always-on dispatcher DMs a standby Claude agent over Relay. That agent isn't even running yet." |
| 0:52–1:05 | The standbyclaude chip comes up, and there is a sped-up cut. Ledger rows show the DM drained, stale DMs skipped, the claim at epoch 2 and steps 1–3 rebuilt from the channel. | "Claude boots → drains DM → claims epoch 2 → rebuilds steps 1–3 from Relay history" *(sped up)* | "Claude starts, picks up the queued DM, claims the task and rebuilds the first three steps from the Relay channel history." |
| 1:05–1:15 | Step 4 appears and is attributed to Claude (Anthropic). Zoom in on "Per step 3, the refund amount is $120…". | "Step 4 continues from GPT's step 3" | "Step 4 picks up exactly where GPT left off. GPT died at step 3, and Claude finished it." |
| 1:15–1:25 | Steps 5 and 6. The card shows DONE and "finished by Claude". The outbox panel shows one line, and the counter reads "refund issued: 1 time". | "DONE · refund issued: 1 time" | "Policy check, then the refund, issued exactly once." |
| 1:25–1:30 | Optional quick cut from the zombie run: the `REJECTED: epoch 1 < 2` ledger row and the crossed-out "stale (attempt 1, superseded)" post. End card. | "Zombie writes are fenced · Afterlife · Agent Relay track" | "And if the old agent wakes up as a zombie, its late write is fenced. When an agent dies, its work doesn't." |

---

## (c) 2-minute live demo script

**Before going on stage:**

- `npm run server` is already running.
- The board is open at `http://localhost:4000`.
- A terminal is ready in the repo.
- A backup recording of `refund142212` is queued in case hosted Relay is overloaded.

One run takes about 90–100s, so start it first and talk while it runs.

**0:00–0:15. The problem.**
"Agents doing real work end in real side effects. This one issues a refund. If the agent dies halfway, a blind restart either loses the refund or pays the guest twice. Afterlife makes sure neither happens."
*Type `OPEN=0 npm run demo` and press Enter.*

**0:15–0:40. GPT works.** *Point at the task card and the relay observer.*
"workergpt is on the OpenAI API. It's doing a six-step refund job. After each step it commits to a lease authority, the only thing allowed to commit, and then posts a checkpoint to this task's Relay channel. You can see the real Relay message IDs here. It heartbeats every 2 seconds on an 8-second lease. Step 3 just decided $120."

**0:40–0:50. The kill.** *The demo script sends `kill -9` once step 3 is checkpointed. Point at the processes panel.*
"It just got kill -9. No cleanup, no last words."

**0:50–1:05. Detection and handoff.** *Point at the countdown, the LOST badge and the ledger.*
"No heartbeat for 8 seconds. The lease expires, the card says presumed dead, and the epoch goes from 1 to 2. The always-on dispatcher sends a Relay DM to standbyclaude, and look, standbyclaude is down. Relay holds the message until it's up."

**1:05–1:30. Claude takes over.** *Point at the standby chip coming up and the ledger rows.*
"Now Claude starts on the Anthropic API. It drains its queued DMs, skips stale ones from earlier runs, claims epoch 2 and rebuilds steps 1 to 3 from the channel history. That history is the only memory it gets. This part is a little slow because hosted Relay is under load today."

**1:30–1:45. Continuity.** *Point at step 4.*
"Step 4: 'Per step 3, the refund amount is $120.' Claude is continuing GPT's work. GPT died at step 3 and Claude finished it."

**1:45–2:00. Exactly once.** *Point at the outbox panel.*
"Steps 5 and 6, DONE, refund issued one time. If the old worker had only been frozen and woke up later, its write would be rejected as epoch 1 below 2. We have that run too. It's all on one laptop, each process holds only its own Relay credentials, and Relay carries the whole recovery. When an agent dies, its work doesn't."

**If you get extra time or a question about zombies:** run `npm run demo:zombie` and point at the `REJECTED: epoch 1 < 2` ledger row and the crossed-out "stale (attempt 1, superseded)" post. The outbox still shows one refund.

**If Relay is overloaded:** re-run `npm run demo` once. If that also fails, play the backup recording and narrate the same beats.
