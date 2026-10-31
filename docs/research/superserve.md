# Superserve: master brief for Haunted Hacks (Sat 31 Oct 2026)

**Compiled 29 Oct 2026 (US Pacific).** This brief merges five verified sub-files plus an early draft (links in §13). I re-checked the main contradictions live on 29 Oct, in the evening Pacific time (30 Oct UTC). Those checks were: `curl` against the unauthenticated plan catalog and rate card, a fetch of the marketing pricing page, `gh` reads of the event-credit runbook, the SDK `http.ts`/`commands.ts` source, the release list, OpenAI Agents PR #3502, and repo stats, plus a grep of `EVENT_PAGE.md`. **[V]** means verified against a primary source. **[Inf]** means my inference. **[BG]** marks background from before Aug 2026. GitHub times are UTC.

---

## 1. Executive summary

- **What it is [V]:** Superserve (YC F26, 3 people, founder/CEO Pavitra Bhalla) sells **Firecracker microVM sandboxes for AI agents**. A sandbox can **pause with memory, processes and disk intact** (no compute is billed while paused), **resume**, and be **snapshotted and forked** into parallel copies. Around the VM sit a **secrets broker** (the real key never enters the VM), **egress allow/deny rules**, a **network log kept outside the VM**, **preview URLs**, a **computer-use desktop** (xfce + Chrome + noVNC), and Docker-in-VM. Tagline: "Virtual machines for long-horizon agents". It is **not** model serving. The company pivoted from a Ray-based serving framework in Feb–Apr 2026 [BG]. [YC][docs][gh]
- **Event stake [V]:** each attendee gets **$100 of Superserve credit**, and the grand prize includes **$1,000 of Superserve credit**. **There is no Superserve track.** Co-sponsor **Freestyle** sells a near-identical product and puts **$10,000** into the grand prize. [EVENT]
- **The biggest practical risk is billing, not the API.** Superserve is relaunching its plans *this week*. The marketing page (Free = 20 concurrent, $5+$95) is stale. The live checkout catalog says **Free = 1 running sandbox and $0.13 of compute per day**. A staff-run **event-credit script refuses Free teams** ("upgrade to Developer first"). A **Developer** plan ($20/mo, 100 concurrent) and a no-card trial exist in code but were **still not published at 29 Oct evening** (re-checked). How Haunted Hacks credit will actually be delivered is unconfirmed. **Ask the Superserve rep first thing.**
- **Credit is not the limit; concurrency is.** At $0.1656/h for the standard 2 vCPU / 4 GiB box, $100 buys about 600 sandbox-hours. On Free or a trial you get **one** running VM, which kills a fork-swarm demo unless you upgrade.
- **Fit with the hosts [Inf]:** Terse Durable Actor = durable identity and state. Agent Relay = messaging. Superserve = each agent's *computer*. "One actor owns one sandbox ID, resumes it on message, pauses it when idle" uses all three. Neither host has a Superserve adapter: Agent Relay's `@agent-relay/sandbox` supports E2B, Daytona, Freestyle and others, but not Superserve. Call the SDK directly.
- **What Superserve rewards [V, precedent]:** at its own Aug 15 hackathon track, 1st place (Foundry) booted **eight VMs in parallel, one per prospect**. 2nd place (TalosAI) kept **the agent that acts separate from the one that verifies**, each in an isolated sandbox. The founder's public story is VMs-not-containers, pause/resume/fork, security outside the VM, speed, and "made something agents want".

---

## 2. What matters for Haunted Hacks

> **Before Saturday**
> 1. Install CLI 2.1.1 (`curl -fsSL https://superserve.ai/install | sh`) and pin `@superserve/sdk@0.11.5` / `superserve==0.11.5`. The npm CLI needs Node ≥ 22.4.
> 2. **Account strategy is unresolved.** Signing up now lands you on **Free** (1 VM, refused for event credit). Either sign up from home (venue-IP signups may trip reCAPTCHA/Turnstile/Fingerprint abuse checks) and expect to be told to upgrade, or wait for event instructions. Do **not** pay for anything yet.
> 3. If you have an account, run the smoke test (§10.1). It shows your real plan shape, whether snapshots are enabled, and whether 4 GiB curated templates boot.
> 4. Add `@superserve/mcp` or the docs `llms.txt` to your coding agent. The SDK changes weekly and LLMs will hallucinate it.
>
> **Saturday 11:00, first 5 minutes**
> - Ask the Superserve rep: *"Trial credit or a 100%-off Developer code? Where do we send our team ID? Do trial teams stay at 1 concurrent sandbox?"*
> - If taking a Developer code, **redeem it BEFORE staff credit your team ID**. Upgrading during a trial zeroes trial/event credit, and staff only restore it "once a day during the event".
>
> **Build**: Superserve is the actors' body, and Durable Actors + Agent Relay are the brain and wiring. Name the primitives on stage: *pause with live memory, fork from snapshot, secret broker, egress block + out-of-VM log, live desktop stream.*
>
> **Never say**: "containers", "fastest resume", or "<50 ms resume" as fact (independent pause+resume ≈ 0.9 s). **Never** pit Superserve against Freestyle on stage.
>
> **After**: delete every sandbox. If you took Developer, **cancel via support** before month 2 ($20/mo).

---

## 3. Key facts

### 3.1 Company [V unless noted]

| Item | Value | Source |
|---|---|---|
| Batch / team | YC Fall 2026, team of 3, SF. Primary partner Max Kolysh | [YC] |
| People | **Pavitra Bhalla** (sole listed founder; ex-Staff SWE Dosu, ex-founding eng / Dir. Eng LTSE). **Amit Patil** (founding engineer, 133 commits, writes the integration posts). `nirnejak` ("Jeet", 54), `awille-ai` (39; top author in the infra repo, ~333 commits since Aug 1) | [YC][gh-contrib] |
| Funding | Pre-seed from Open Core Ventures, Oct 2025, amount undisclosed [BG]. YC amount only in aggregators: Dealroom $125K vs PitchBook $500K (conflicting, unconfirmed) | [LI-found][PB][Founderland] |
| Traction claim | "over 100K machines (as of Oct 2026) every week… including Lindy, and Y Combinator itself". **Company-submitted.** Partly corroborated: YC's `yc-software/qm` (15.6k stars) ships a Superserve sandbox backend (`docs/superserve.md`: "Paused sandboxes resume on use") | [YC][qm] |
| Repos | `superserve-ai/superserve` (SDKs/CLI/console/docs): **475★, 55 forks, Apache-2.0**. `superserve-ai/sandbox` (Go backend): 15★, **OCVSAL 1.0 source-available** (GitHub shows `NOASSERTION`; production use needs a commercial agreement) | [gh] |
| Adoption signals | npm `@superserve/sdk` 39,056 downloads (30 d to 28 Oct). PyPI 14,503/month. Integrations: Claude Managed Agents (Jun) [BG], Agno (Aug), LangChain deepagents (Aug), Lindy (Aug), Cursor Cloud Agents (1 Oct), Omnara (~23 Oct), YC qm (Oct) | [npm][pypistats][blog] |

### 3.2 Interfaces and versions (29 Oct)

| Surface | Version | Notes |
|---|---|---|
| TS SDK `@superserve/sdk` | **0.11.5** (29 Oct) | Zero runtime deps, uses global `fetch`. `commands.spawn` needs a global `WebSocket` (Node 22+ / browser / polyfill) |
| Python `superserve` | **0.11.5**, Py ≥ 3.9 | Sync `Sandbox` + `AsyncSandbox`. `spawn` is **async-only** |
| CLI `@superserve/cli` | **2.1.1** (29 Oct) | Rewritten TS CLI. 2.0.0 tagged 2026-10-23T03:26Z (= 22 Oct Pacific). Device-code login. `--json` everywhere. Exit codes 3 auth / 4 not-found / 5 conflict / 6 rate-limit / 7 timeout |
| MCP `@superserve/mcp` | **0.3.3** (16 Oct) | 20 tools, stdio or hosted `https://mcp.superserve.ai` (bearer, **no OAuth**). 32 KiB stdout/stderr caps, 1 MiB file-read limit, 60 s default / 10 min max exec |
| REST | OpenAPI 0.1.0 | Control plane `api.superserve.ai` (`X-API-Key`). Data plane `sandbox.superserve.ai` (`X-Access-Token`, rotated on resume). Keys look like `ss_live_<use|usw>_<32>`; `usw` keys use the `-usw` hosts. The SDK picks the host for you |

### 3.3 Pricing: three catalogs in play (re-fetched 29 Oct evening)

Rate card [V, live `/billing/pricing/public`, effective 2026-06-17]: **vCPU $0.0504/h, memory $0.0162/GiB-h**, billed per second while `active`. Storage is listed at $0.000108/GiB-h but **`billable: false`**, so paused VMs and snapshots currently cost nothing.

| Plan | **A. Live checkout catalog** (`/billing/plans/public`) [V] | **B. Marketing page** `/pricing` [V, stale] | **C. Launch runbook "v2"** (in Git, unreleased) [V as text] |
|---|---|---|---|
| Free | $0. **1 running sandbox**. $0.1332 per 24 h (7,200 s of 1 vCPU / 1 GiB), **pauses** when used up. 2 vCPU / 4 GiB / 8 GiB. **0 templates** | $5 + $95 on adding billing. **20 concurrent**. 2 vCPU / **2 GiB** / 8 GiB | Signups stay on Free until Developer is published |
| Trial | not shown | not shown | `credit_usd 0.05`, `max_sandboxes 1`, 0 templates (from migration `…27233000_paid_first_new_team.sql`) |
| Starter | Prepaid from $5, 100 concurrent, 2 / 4 GiB / 50 GiB, 10 templates | not shown | Being hidden from new purchases (#457, 29 Oct) |
| Developer | **not published** | not shown | **$20/mo incl. $20 credit**, prepaid, auto top-off $5 at $2, **100 concurrent, 4 vCPU / 16 GiB**. Cancellation support-only |
| Pro | **$250/mo** incl. $250, 1,000 concurrent, 8 vCPU / 32 GiB / 100 GiB | **$1,000/mo** annual ($12k/yr), 1,000 concurrent, 16 / 64 / 64 | $250/mo, **2,000 concurrent, 16 vCPU / 64 GiB**. YC code → $0 first invoice (OpenAPI offer `yc_2026`) |

**Resolution:** treat **A** as authoritative, because the OpenAPI calls it "the same plan catalog used by checkout". Treat **C** as what is about to ship. **B** is marketing copy that hasn't been updated.

**What $100 buys** (arithmetic from the rate card): 2 vCPU / 4 GiB (all curated templates) = $0.1656/h ≈ 604 h; 10 boxes × 5 h ≈ $8.28. At 4 vCPU / 16 GiB (Developer max) = $0.4608/h ≈ 217 h. Free's daily allowance runs one 2/4 box for **~48 min**.

### 3.4 Event-credit mechanics [V: runbook text; Inf: that it applies to this event]

From `scripts/billing/event-credit.md` (PR #850 merged 29 Oct 23:45Z; #857 at 30 Oct 00:26Z adds report/restore):
- Staff run `event_credit.py` on a private CSV of `team_id,amount_usd` (≤ $1,000 per team). The label is the idempotency key. **You do not redeem a code for the credit itself.**
- **Trial team** → a `signup trial credit` grant. **Trial limits stay frozen** (1 sandbox, 0 templates) [Inf from the SQL, which leaves `max_sandboxes` alone].
- **Developer/Pro** → a Stripe credit grant. A team that came in through "a 100%-off Developer checkout" gets **$80** (+$20 included = $100).
- **Free → refused, "upgrade to Developer first".** Starter / legacy PAYG → refused ("Unverified, under test"). Enterprise, canceled or no-customer teams → refused.
- **Paid activation zeroes every trial grant, including event credit.** Staff `--report` / `--restore` it "once a day during the event, and once after it ends". The runbook also mentions "the event's 100%-off first-month code", with $20/mo charged from month 2.
- The example label is `event-2026-11-01`. **Haunted Hacks is never named**, so all of this is unverified for our event.

### 3.5 Hard limits worth memorising [V, docs]

| Thing | Limit |
|---|---|
| Snapshots | 100 per team, 20 per sandbox, **4 in flight per team**. Capture pauses the VM "usually for under a second" |
| Forks | Inherit network rules, timeout and secrets. **Processes running at snapshot time keep stale secret stand-ins, so restart them** |
| Template shape | Free 2 vCPU / 4096 MiB / 8192 MiB; Pro 16 / 65536 / 65536 (docs). **Cannot override per sandbox.** Curated templates are 2 / 4 GiB / 8 GiB since 28 Oct |
| Auto-pause | `timeoutSeconds` 1–604800, counts **active** time, **off by default**. `autoDeleteSeconds` 0–2,592,000 after continuous pause |
| Network | `allowOut` (IP/CIDR/domain, wildcards; `*.x.com` excludes the apex) beats `denyOut` (IP/CIDR only). Updates only while `active`. Log covers ports 80/443 + secret-bearing requests, 7-day retention |

---

## 4. Newest features (Aug–Oct 2026, from merge/publish dates; no changelog exists)

| Date (UTC) | Shipped | Evidence |
|---|---|---|
| 08-21→09-22 | SDK 0.8.3 list filters (#310). Egress **fails closed** (sandbox#481, 09-09). Cursor Self-Hosted guide (#320, 09-11). SDK 0.9.0 `pause()` waits until paused (#333, 09-14). 7-day log retention, resume from bucket backup (#348, sandbox#540, 09-22) | gh |
| 09-23→09-30 | **Snapshots and forks**: backend (sandbox#549–#592), SDK 09-28 (#351), console 09-29 (#352), SDK 0.9.2 | gh |
| 10-01 | **Blog: Cursor Cloud Agents now run on Superserve** (pause between turns, "resumes in under 50ms", egress allowlist, out-of-VM log) | blog |
| 10-02 | Example repo `reproducible-runs` (checkpoint/restore; README says it "Requires… saved snapshots enabled") | gh |
| 10-05/06 | **Computer use**: `sandbox.desktop`, `desktop.step()`, MCP `sandbox_computer`. SDK 0.10.0→0.11.0, MCP 0.2.0/0.3.0 | sandbox#337/#338, #309/#368/#372 |
| 10-15/16 | Desktop JPEG frames + `quietMs`; `superserve/omnara` template; platform ceilings 32 vCPU / 128 GiB | #394/#398, sandbox#680/#691 |
| 10-17→10-21 | Guest fixes: `/dev/fd` links (#681), **egress for TCP on non-proxy ports** (#723), `/dev/shm` mounted (#778) | sandbox |
| 10-23 | **CLI v2.0.0/2.0.1**, Homebrew tap. Docker-in-sandbox docs. `superserve/base` = Py 3.12 + Node 22 + build tools | releases, #413, #787 |
| 10-26 | CLI 2.1.0 device-code signup. Billing code: "Free, Starter and configurable Pro" | #432, sandbox#810 |
| 10-28 | **`localhost`/hostname resolution fixed in guests** (#824). Image USER/ENV/WORKDIR honored (#846). Curated templates → 2/4/8 (#836) | sandbox |
| 10-29 | **CLI 2.1.1, SDK 0.11.5 (run-as-`user`)**. Console renders Developer/Pro, **Starter hidden** (#457). Event-credit runbook (#850, #857) | releases, gh |

Maturity [Inf]: the docs carry no beta/GA labels anywhere. Behind switches and not customer-facing: freeze-on-pause, upgrade page "behind the pricing switch", QM org metering. Roadmap hints: a fork of `harbor-framework/harbor` (Terminal-Bench eval harness, 26 Oct) points to an eval/RL push. The open `Sandbox.create({image})` PR #233 has been a draft since June, so custom images still need a template build.

Most-wanted showcase [Inf, ranked from what they market and where engineering went]: (1) pause/resume with memory intact, (2) snapshot + N-way fork, (3) computer use with a live viewer (the newest surface; the founder posted a Daytona comparison on 28–29 Oct), (4) egress + network log + secrets against exfiltration (the second half of the Cursor blog), (5) agent-first onboarding (SKILL.md, MCP, CLI `--json`).

---

## 5. Social sentiment and benchmarks

- **Volume is low and mostly company- or partner-driven [V].** @superserve_ai has ~259 followers (mirror). Show HN (21 Jul) [BG] got 9 points and 1 comment, and that comment ("How does it handle chron jobs or waking from a messaging app?") was never answered. Reddit: 0 threads found. YouTube: none except the Foundry hackathon demo. No Product Hunt launch. **No negative first-person posts found**, which is a sign of thin coverage, not proof of satisfaction.
- **Last 30 days on X [V, fxtwitter]:** @leodev's benchmark (22 Oct, 104 likes, 7.3k views); @dewyashtwts's sandbox list (24 Oct, 247 likes, 18k views, which misspells it "Superverse" and lists Freestyle next to it); @jaykhan (26 Oct), which groups "Agent Relay passes work between agent sessions" with "Boat, Agent37, Superserve give agents a sandbox" as the F26 infra trend.
- **Most substantive third-party praise [V, mirror] (Aug 9):** Sydney Runkle (LangChain): "automatic checkpointing, near instant init/teardown (<50ms)… no session limits, which is great for long running or ambient tasks."
- **aisandboxbench (run 22–23 Oct, 9 providers) [V, results.md]:** same-machine track, Superserve **1st** on cold start (0.52 s), take-snapshot (0.39 s), start-from-snapshot (0.55 s) and 25-sandbox fan-out (0.79 s); 2nd on tool replay (13 s vs Daytona 12 s); 100% reliable. **Pause+resume: 3rd/4th at 0.92–0.93 s**, behind boxd (~0.53 s) and **Freestyle (0.64–0.72 s)**. Freestyle is 2nd on both snapshot tests. Caveats: the bench uses "Sandbox SDK, built by us", Bhalla credits "@leodev", and authorship and independence are unverified.
- **ComputeSDK burst TTI (fetched 29 Oct, early draft) [V]:** Superserve 410 ms median, 7th of 30, ahead of Vercel, Modal, Daytona, E2B and Freestyle (3,237 ms). The founder's "fastest TTI" claim (9 Oct) holds only against the named majors.
- **DevToolArena [V]:** 88 (B) on Codex, 86 (B) on Claude Code, discovery score 100 on both. Superserve markets this as "#1 Sandbox"; the precise source wording is "tying #1 for claude codex sandbox category". The original 9 Oct X version named only Daytona as the sandbox leader. Takeaway: coding agents find its docs easily.
- **Company-sourced, unreproduced claims:** computer use vs Daytona (28–29 Oct: desktop startup 0.3 s vs 5.4 s, click→screenshot 142 ms vs 522 ms); "AWS costs ~52% more" (26 Oct).
- **Friction found:** no native OpenAI Agents SDK client (PR openai/openai-agents-python#3502 **closed unmerged 2026-07-02**, re-checked; issue #327 open). Unmerged MCP base64 fix (#377/#378). Console leaks raw Next.js errors (#307). Brand collisions (SuperServer, "Superverse"). Missing from mainstream round-ups (Northflank 6 Oct, Agent Infra Weekly 29 Oct).

---

## 6. Team strategy and competition (condensed)

- **Go-to-market is "be the hands under other people's harnesses"** [V]: Claude Managed Agents, Agno, LangChain, Lindy, Cursor, Omnara and YC qm. The stated ICP is "teams building coding agents, autonomous workers, or eval and training environments".
- **Founder quotes worth echoing [V, mirrors]:** "Superserve sandboxes are VMs, not containers" (19 Sep). "We made something agents want" (11 Oct). On market structure (undated): "'run ai code' is already a commodity… a second group including @freestyle_dev… innovating on the tech of what a programmable computer is". **He publicly respects Freestyle.**
- **Competitors [V]:** Daytona ($60M B at $1B, 20 Oct; the founder's direct foil), Modal ($750M D, 14 Oct), E2B [BG], Vercel Sandbox, AWS Lambda MicroVMs (22 Jun), and **Freestyle** (co-sponsor: full Linux VMs, live cloning with memory). Detail in 05.
- **Precedent [V]:** Zero-Human Company Hackathon (Terac, 15 Aug, SF, 200+ builders). Superserve track: **1st Foundry ($1,000)**, an agent "holding company" booting eight Superserve VMs, one per prospect; the company replied "Great use case and solid implementation". **2nd TalosAI ($500)**: repair in isolated sandboxes, independent QA, "the AI can't grade its own work". Bhalla attended and chatted with teams. Whether anyone from Superserve judges Haunted Hacks: **unknown** (judges TBA).

---

## 7. Contradictions between sub-files: resolved or flagged

| # | Conflict | Resolution (how) |
|---|---|---|
| 1 | Free = 20 concurrent / 2 GiB / $5+$95 (02, 04, 00) vs 1 concurrent / 4 GiB / $0.13 per day (01) | **Both exist.** The marketing page still says 20/2 GiB and the checkout API says 1/4 GiB (both re-fetched 29 Oct evening). **Plan for 1 running sandbox on Free**; the API is what checkout uses. Gotchas in 02/04 that say "20 concurrent on Free" are superseded |
| 2 | Pro $1,000 (page) vs $250 (API) vs 2,000 concurrent / 16 / 64 (runbook) | Three catalogs, see §3.3. API shows $250, 1,000 concurrent, 8/32 |
| 3 | Is Developer live? | **No** (API re-fetch 29 Oct evening: Free/Starter/Pro/Enterprise only). Could appear by Saturday |
| 4 | 03: "sign up and don't choose Free" vs 01: "hold off, new accounts land on Free" | Compatible. You cannot avoid Free at signup until Developer/trial is published. Sign up to get a key and smoke-test, but **expect to need the event Developer code** or trial routing. Don't self-upgrade to paid Pro |
| 5 | 30 s exec timeout: server default (01) vs client abort (03) | **Both are true** (re-read source). OpenAPI `timeout_s` defaults to 30 and the SDK only sends it when `timeoutMs` is set (`commands.ts` L93). `http.ts` `DEFAULT_TIMEOUT_MS = 30_000` applies when `timeoutMs` is undefined. When you set it, the SDK adds a 5 s buffer so the server's kill (exit 124) fires first. **Always pass `timeoutMs`** |
| 6 | Output > 10 MiB → `truncated: true` (early) | Refuted (03): the client throws `ValidationError`, and `truncated` is a separate server flag |
| 7 | Sandbox repo license: "no detected license" (01), `NOASSERTION` (00), OCVSAL 1.0 (03) | GitHub API = `Other`/`NOASSERTION` (re-checked). The LICENSE file is OCVSAL 1.0 (source-available). Main repo is Apache-2.0 |
| 8 | OpenAI Agents PR #3502 "still open" (00) | **Closed unmerged 2026-07-02T02:16Z** (re-checked) |
| 9 | "Freestyle wins resume 0.35 s" (early 04) | Corrected: boxd ~0.53, Freestyle 0.64–0.72, Superserve 0.92–0.93 s |
| 10–15 | Minor date/ID/count drift | CLI 2.0.0 tagged 2026-10-23T03:26Z (= 22 Oct Pacific; both right). Daytona computer-use post: mirror shows relative time only, so 28–29 Oct. Boxyard now says Superserve max 16/64 vs E2B 8/8 (Pro ceiling). QM upstream homepage is `x.com/qm__dev`, not qm.ycombinator.com. sandbox#221 (snapshots "disabled by default") was closed unmerged [BG], so **snapshot enablement for new teams is still unverified**. Open PRs: 41 (~22 billing), not 21 |

---

## 8. Gotchas (deduplicated, ranked by likelihood of biting a 5-hour team)

1. **Plan/credit trap:** Free = 1 VM + refused event credit. Upgrading during a trial zeroes credit until staff restore it (daily). Get the rep's instructions before clicking anything.
2. **`commands.run()` without `timeoutMs` dies at 30 s** (`npm install`, `pip install`, agent loops). TS uses **ms**, Python `timeout_seconds` uses **s**. Exit code **124** means the command was killed by the timeout. Use streaming for long jobs: its idle timer resets on each chunk. The WebSocket path has no timeout when `timeout_s` is omitted.
3. **POST/PATCH are never retried** by the SDK (only GET/DELETE on 429/5xx). Wrap `create`/`run` yourself, but **don't blindly replay `exec`** after an ambiguous timeout, because it may already have run.
4. **Auto-pause is off by default** and `timeoutSeconds` counts *active* time, so a too-small value pauses a running agent mid-task. Set it generously, plus `autoDeleteSeconds`, so a forgotten swarm doesn't leak.
5. **Free/trial = 0 templates.** Use `superserve/*` system templates, install once, then **snapshot "warm" and fork from it**. Template builds (if your plan allows them) need `linux/amd64` + `/bin/sh` and can take minutes.
6. **4 snapshots in flight per team:** take one snapshot and fork it N times rather than snapshotting N boxes.
7. **Restart secret-using processes in every fork.** `secrets` and `envVars` can't share a key name.
8. **Deny-all egress kills DNS.** Allow `1.1.1.1/32` and `8.8.8.8/32`. Network rules can't be changed while paused (`ConflictError`).
9. **Preview ports must be published explicitly.** Bind to `0.0.0.0`. Signed/private viewer links expire in 60 s, so mint them right before the demo.
10. **Python `spawn` is async-only. TS `spawn` needs a global WebSocket.** In non-Node runtimes (Workers-style isolates; possibly actor runtimes) pass **both `apiKey` and `baseUrl`**, because `resolveConfig` reads `process.env` otherwise [Inf, code]. Terse runs on **Bun ≥ 1.4.2** (see terse research), which has `fetch`/`WebSocket`/`process`, but this is untested.
11. **Terse actors go dormant after 10 s idle** (per terse research). Keep long Superserve work inside an awaited method call, or move it to a backend route. Persist `sandboxId`/`snapshotId` in actor SQLite, not in memory [Inf].
12. **Status/metadata on a `Sandbox` object are stale snapshots.** Call `getInfo()`. Use IDs, not names (names aren't unique). `updateById` and `getNetworkLog` don't auto-resume; `run`, file ops, `connect` and desktop calls do.
13. **MCP caps** (32 KiB output, 1 MiB reads). MCP clients don't inherit shell env, so put the key in the server `env` block.
14. **Behaviour changed this week** (localhost fix 28 Oct, image USER/ENV/WORKDIR 28 Oct, run-as-user 29 Oct). Pin 0.11.5. If something is weird, check the infra repo's `git log` before debugging your own code.
15. **Desktop:** resize to the model's native resolution (width a multiple of 8). Treat on-screen text as untrusted. Screenshot before retrying input.
16. **Output limits:** sync `run()` over 10 MiB (client `maxOutputBytes`) throws `ValidationError` with no partial result, and the server flags `truncated: true` past its own cap. Redirect big output to a file. Preview ports 1024–65535, except reserved 49983.
17. Commands run without `HOME`, so prefix `HOME=/root` for Docker and some CLIs.

---

## 9. Two sponsors selling VMs: Superserve vs Freestyle

Both are on the sponsor list. Freestyle's grand-prize credits are 10× larger. They compete head to head in every public list, and Freestyle beats Superserve on pause+resume while Superserve wins cold start, snapshot start and fan-out. **Give each a distinct job [Inf]**: for example, Superserve for long-lived per-agent worker VMs, desktop/computer use, and the egress/network-log security beat, and Freestyle for the app/dev-server or a separate workload. Alternatively, pick one and state why. Don't claim either is "faster" without citing aisandboxbench.

---

## 10. Integration recipes

### 10.1 Smoke test (CLI; run from home)
```bash
curl -fsSL https://superserve.ai/install | sh            # CLI 2.1.1, device-code sign-in
superserve whoami --json
ID=$(superserve sandbox create --name smoke --template superserve/base --timeout 30m --auto-delete 1d --json | jq -r .id)
superserve sandbox get "$ID" --json | jq '.vcpu_count, .memory_mib'   # real shape on your plan (field names per SandboxInfo; verify)
superserve exec "$ID" -- sh -c 'nproc; free -m; python3 --version; node --version'
superserve exec "$ID" -- sh -c 'nohup python3 -m http.server 8000 >/dev/null 2>&1 &'
superserve sandbox pause "$ID" && superserve sandbox resume "$ID"
superserve exec "$ID" -- curl -s localhost:8000 | head -3     # process survived pause = the demo beat
superserve snapshot create "$ID" --json                       # confirms snapshots enabled on your team
superserve sandbox create --name probe2 --template superserve/base --json   # 2nd box: too_many_sandboxes => 1-VM plan
superserve sandbox delete "$ID" --yes
```

### 10.2 Actor-owned VM ("hibernating ghost"): TS, Superserve calls exact, actor wrapper is a sketch
```ts
import { Sandbox, Secret } from "@superserve/sdk"           // pin 0.11.5
// once, outside the actor: key never enters any VM
await Secret.create({ name: "openai", value: process.env.OPENAI_API_KEY!, provider: "openai" })

// inside a Durable Actor method (persist ids in this.db; see terse research for the actor API)
async function handleMessage(state: { sandboxId?: string }, task: string) {
  const sb = state.sandboxId
    ? await Sandbox.connect(state.sandboxId)                // auto-resumes, same memory/processes
    : await Sandbox.create({
        name: "ghost-1", fromTemplate: "superserve/base",
        timeoutSeconds: 3600, autoDeleteSeconds: 86400,
        metadata: { app: "haunted", actor: "ghost-1" },
        secrets: { OPENAI_API_KEY: "openai" },
        network: { allowOut: ["api.openai.com", "1.1.1.1/32", "8.8.8.8/32"], denyOut: ["0.0.0.0/0"] },
      })
  state.sandboxId = sb.id
  const r = await sb.commands.run(`python3 agent.py ${JSON.stringify(task)}`, { timeoutMs: 180_000 })
  await sb.pause({ wait: true })                            // compute billing stops
  return { exitCode: r.exitCode, out: r.stdout }            // relay result over Agent Relay
}
```
This answers the unanswered Show HN question ("waking from a messaging app"): an Agent Relay message wakes the actor, and the actor `connect()`s, which wakes the VM.

### 10.3 Séance fork race (needs Developer-level concurrency)
Coordinator actor: prepare one box → `const snap = await sb.snapshot({ name: "warm" })` → `Sandbox.create({ name: \`ghost-${i}\`, fromSnapshot: snap })` × N. Each fork gets a strategy over Agent Relay and reports progress. Keep the winner, `kill()` the rest. Remember to restart secret-using processes in each fork. **On a 1-VM plan,** demo *time-sharing* instead: snapshot, pause, fork on demand, one live ghost at a time. Snapshots outlive their sandbox and cost $0 storage today.

### 10.4 Haunted desktop (computer use, real-time)
`Sandbox.create({ fromTemplate: "superserve/desktop" })` (xfce + Chrome, viewer on :6080, 1280×800 default) → `desktop.resize(...)` → loop `desktop.step(actions, { waitForChange: true, format: "jpeg" })` driven by an OpenAI computer-use model → embed `desktop.getStreamUrl({ viewOnly: true })` for judges. Pause between turns while waiting on a human or another agent; the desktop survives. Human takeover is a visible beat.

### 10.5 Possession defense (security beat)
Put a cursed README with a prompt injection in the VM. The key is bound as a secret (only a stand-in token is inside), egress is allowlisted, and the UI streams `(await sb.getNetworkLog({ verdict: "blocked" })).events` live. This mirrors Superserve's own 1 Oct blog.

### 10.6 Coding-agent setup
```bash
claude mcp add superserve --env SUPERSERVE_API_KEY=$SUPERSERVE_API_KEY -- npx -y @superserve/mcp
# docs for context: https://docs.superserve.ai/llms.txt  ·  agent setup: https://superserve.ai/SKILL.md
```

---

## 11. Hackathon implications

**What to build.** Superserve should be the actors' *body*, essential and visible, never a generic `python -c` runner. The best fits, in order:
- (a) **"Every ghost gets its own computer"**: one Durable Actor owns one VM, wakes on Relay messages, pauses when idle, and shows a live process surviving pause. This hits both host tracks.
- (b) **Fork race**, if you get Developer concurrency.
- (c) **Haunted desktop** with a live viewer, which is the most "Real-Time AI" option and on-message with the founder's current push.
- (d) Add the **exfil-blocked beat** to any of them.

Borrow from Superserve's past winners: one VM per entity spun up in parallel (Foundry), and an acting agent separated from an isolated verifying agent (TalosAI).

**Prize math.** Superserve's only upside here is the $1k of credit inside the grand prize. Aim at **Durable Actors (iPhone) + Agent Relay (Mac mini) + the grand prize**, and use Superserve as a multiplier. For Supabase's "scale to millions", the pitch is that idle agents cost zero compute (paused) and the plan scales to 1,000 concurrent on Pro. That is a talking point, not proof.

**Judges/sponsor want [Inf]:** signups and real usage during their billing relaunch; named primitives on stage ("we forked a running VM, memory included"); a mention that onboarding went through their CLI/MCP; VMs not containers; and "sub-second resume", not "<50 ms".

**Setup / Saturday checklist / teardown:** see §2 and §10.1. One addition: write down your team ID (console Settings) before you arrive.


---

## 12. Limits / could not verify

- **Re-checked 2026-10-30 06:29Z ([sponsor-coverage-audit §2.4](reference/sponsor-coverage-audit.md)):** the live catalog still has no Developer plan or trial. It still lists **Starter as purchasable**, even though console #457 hides it, and the event-credit runbook refuses Starter teams, so **do not buy Starter**. New billing commit: sandbox #860 (04:23Z).

- **How Haunted Hacks credit is delivered** (trial grant vs Developer code vs other), the code itself, and where team IDs go. The runbook never names this event.
- **Whether Developer and the trial go live before 31 Oct.** As of 29 Oct evening, the catalog had neither.
- **Whether a credited trial team stays at 1 concurrent sandbox** (SQL reading, not tested). Trial vCPU/RAM caps and Developer snapshot/template caps are internal.
- **Whether saved snapshots are enabled by default** for new teams (the `reproducible-runs` README implies gating).
- **Whether the YC `yc_2026` offer / $0 Pro first invoice is available to attendees** (very unlikely to apply; unverified).
- Nothing in §10 was run against a live account: no API key was available to any sub-agent. Resume latency, the 30 s timeout behaviour, `spawn` inside Terse/Bun and actor-idle interaction are all untested.
- Company claims are unaudited: 100K machines/week, YC as a production customer, computer-use vs Daytona numbers, "AWS ~52% more".
- aisandboxbench and DevToolArena authorship and independence. LinkedIn reaction counts come from aggregator snippets only. X was read through mirrors (teapawt, nitter, zamantika), not x.com.
- Whether anyone from Superserve judges or attends.

---

## 13. Sub-files (depth)

- [00-early-draft.md](superserve/00-early-draft.md): first pass. Company, product primitives, ComputeSDK board, host-fit table. *Pricing section superseded by 01.*
- [01-docs-api.md](superserve/01-docs-api.md): full API surface, SDK/CLI/MCP reference, live plan catalog, event-credit runbook, copy-paste setup, Saturday checklist.
- [02-newest-features.md](superserve/02-newest-features.md): dated Aug–Oct timeline (~40 PRs verified), maturity, QM/Harbor hints, showcase ranking.
- [03-github-code.md](superserve/03-github-code.md): repo inventory, cadence, commits, issues, adopters, 15 code-level gotchas, forfeit/restore detail.
- [04-social-pulse.md](superserve/04-social-pulse.md): X/HN/Reddit/YouTube/LinkedIn volume, quotes, benchmarks, comparisons.
- [05-team-strategy.md](superserve/05-team-strategy.md): people, funding, founder quotes, harness strategy, competitor table, Zero-Human hackathon precedent.

---

## 14. Sources (merged, deduplicated)

**Event and sibling research**
- [EVENT] /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md
- Terse research: /Users/charlie/.t3/projects/halloweenhack/docs/research/terse/01-docs-api.md

**Superserve primary (web, live)**
- Homepage / agent view: https://www.superserve.ai/ · SKILL.md: https://superserve.ai/SKILL.md · Installer: https://superserve.ai/install
- Pricing (stale marketing): https://www.superserve.ai/pricing · YC deal: https://www.superserve.ai/yc/
- Live plan catalog: https://api.superserve.ai/billing/plans/public · Live rate card: https://api.superserve.ai/billing/pricing/public
- Blog index: https://www.superserve.ai/blog/ · Cursor Cloud Agents (1 Oct 2026): https://www.superserve.ai/blog/cursor-cloud-agents-on-superserve/ · Claude Managed Agents [BG]: https://www.superserve.ai/blog/claude-managed-agents-on-superserve/ · OpenAI Agents SDK provider guide [BG]: https://www.superserve.ai/blog/openai-agents-sdk-sandboxes-which-provider-should-you-actually-use/
- Docs (prefix `https://docs.superserve.ai/`): `llms.txt`, `introduction.md`, `cli.md`, `sdk-reference/{sandbox,commands,files}.md`, `commands/{streaming,sessions}.md`, `sandbox/{lifecycle,create,connect,snapshots,networking,network-log,preview-urls,desktop,docker}.md`, `templates/{overview,build-spec}.md`, `secrets/{overview,binding}.md`, `errors.md`, `integrations/mcp.md`, `integrations/agent-harnesses/openai-agents-sdk.md`, `integrations/managed-agents/cursor-cloud-agents`
- OpenAPI: https://raw.githubusercontent.com/superserve-ai/sandbox/refs/heads/main/api/openapi.yaml

**GitHub**
- Org https://github.com/superserve-ai · monorepo https://github.com/superserve-ai/superserve (releases https://github.com/superserve-ai/superserve/releases , commits https://github.com/superserve-ai/superserve/commits/main , SDK src https://github.com/superserve-ai/superserve/tree/main/packages/sdk/src , contributors https://api.github.com/repos/superserve-ai/superserve/contributors)
- PRs/issues cited (under https://github.com/superserve-ai/superserve/): pull/457, 452, 450, 432, 409, 372, 351, 233, 332; issues/327, 377, 307. Backend PRs under https://github.com/superserve-ai/sandbox/pull/: 481, 549–592, 691, 723, 778, 787, 810, 824, 836, 846
- Backend https://github.com/superserve-ai/sandbox · event-credit runbook https://github.com/superserve-ai/sandbox/blob/main/scripts/billing/event-credit.md · launch runbook https://github.com/superserve-ai/sandbox/blob/main/scripts/billing/developer-pro-launch.md · trial migration https://github.com/superserve-ai/sandbox/blob/main/supabase/migrations/20261027233000_paid_first_new_team.sql · #857 https://github.com/superserve-ai/sandbox/commit/d9e65fa434773937a88fe1f9a7baf6a7e1d03f7e · #850 commit https://github.com/superserve-ai/sandbox/commit/4ca587fc6a537fa067d2f6eaf40d26bcf23bab84 · trial PR https://github.com/superserve-ai/sandbox/pull/834 · sandbox#221 [BG] https://github.com/superserve-ai/sandbox/pull/221
- Examples/forks: https://github.com/superserve-ai/reproducible-runs · https://github.com/superserve-ai/qm · https://github.com/superserve-ai/harbor · https://github.com/superserve-ai/langchain-superserve · https://github.com/superserve-ai/homebrew-tap
- Adopters: https://github.com/yc-software/qm (+ /blob/main/docs/superserve.md) · https://github.com/openma-ai/open-managed-agents · https://github.com/computesdk/computesdk · https://github.com/opencoredev/sandbox-sdk · https://github.com/agno-agi/agno (PR https://github.com/agno-agi/agno/pull/8584)
- OpenAI Agents PR (closed unmerged): https://github.com/openai/openai-agents-python/pull/3502
- Agent Relay sandbox package (no Superserve adapter): https://github.com/AgentWorkforce/sandbox · https://libraries.io/npm/@agent-relay%2Fsandbox

**Registries**
- https://www.npmjs.com/package/@superserve/sdk · https://www.npmjs.com/package/@superserve/cli · https://www.npmjs.com/package/@superserve/mcp · https://pypi.org/project/superserve/ · https://api.npmjs.org/downloads/point/last-month/@superserve/sdk · https://pypistats.org/api/packages/superserve/recent

**Company, people, funding**
- [YC] https://www.ycombinator.com/companies/superserve · https://linkedin.com/in/pavitrabhalla · https://linkedin.com/in/amitpatil010 · https://linkedin.com/company/super-serve-ai · founding post [BG] https://www.linkedin.com/posts/pavitrabhalla_careers-superserve-building-sandbox-infra-activity-7384310361862131712-yqC2 · [PB] https://pitchbook.com/profiles/company/1318815-46 · [Founderland] https://www.founderland.ai/articles/superserve-launches-vms-for-ai-agents-now-at-100k-weekly-run-mvshtedg
- Integration posts: Agno https://www.linkedin.com/posts/pavitrabhalla_new-banger-integration-alert-agno-agents-activity-7490890538338967552-pNQP · LangChain https://www.linkedin.com/posts/pavitrabhalla_github-superserve-ailangchain-superserve-activity-7492685253539635200-x9XI · Cursor (Patil) https://www.linkedin.com/posts/amitpatil010_cursor-cloud-agents-now-run-on-superserve-activity-7511644227701911552-i8My · DevToolArena reshare https://www.linkedin.com/posts/super-serve-ai_activity-7514895783184252929-jani · "dirty secret" [BG] https://www.linkedin.com/posts/pavitrabhalla_most-ai-agent-frameworks-have-a-dirty-secret-activity-7485481136706441216-nkEn

**Social and benchmarks**
- X: https://x.com/leodev/status/2113363220190945638 · https://x.com/dewyashtwts/status/2113858709193372107 · https://x.com/jaykhan/status/2114743857095332212
- X mirrors (unofficial): https://teapawt.org/superserve_ai · https://nitter.rdrama.net/pavitrabhalla · https://zamantika.com/profile/pavitrabhalla
- HN: Show HN https://news.ycombinator.com/item?id=48999489 · https://news.ycombinator.com/item?id=48211198 · https://news.ycombinator.com/item?id=48624100 · https://news.ycombinator.com/item?id=48688989
- https://aisandboxbench.com/results.md · https://aisandboxbench.com/llms.txt · https://www.computesdk.com/benchmarks/sandboxes/burst-tti · https://devtoolarena.com/codex/api/superserve · https://devtoolarena.com/claudecode/api/superserve · https://boxyard.dev/compare/e2b-vs-superserve · https://northflank.com/blog/best-microvm-sandboxes-for-ai-coding-agents · https://agentinfraweekly.beehiiv.com/p/we-timed-8-agent-infrastructure-providers-here-s-the-first-baseline

**Hackathon precedent**
- https://terac.com/events/hackathon · https://terac.com/blog/zero-human-company-hackathon · https://luma.com/d7vavxhk · Sponsorship post https://www.linkedin.com/posts/super-serve-ai_activity-7488676422224551937-f1zo · TalosAI https://www.linkedin.com/posts/girikratna-sharma_ai-agenticai-hackathon-activity-7494970932126523393-JfXL , https://www.linkedin.com/posts/abhinav-garg-12b9343b5_my-team-and-i-just-won-500-at-the-zero-human-activity-7494806275881459712-Pp3C · Foundry https://www.youtube.com/watch?v=U_DDFVnhtD0 , https://linkedin.com/in/aruswamy

**Competitors**
- Daytona https://www.daytona.io/dotfiles/daytona-raises-60m-series-b-to-build-the-agent-cloud , https://fortune.com/2026/10/20/daytona-startup-building-the-agentic-cloud-valued-at-1-billion-in-latest-funding-round/ · Modal https://modal.com/blog/1-billion-annualized-run-rate-series-d , https://www.accel.com/news/our-investment-in-modal · E2B [BG] https://e2b.dev/resources/series-a · Vercel https://vercel.com/changelog/vercel-sandboxes-ga · AWS https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/ · Freestyle https://www.freestyle.sh/
