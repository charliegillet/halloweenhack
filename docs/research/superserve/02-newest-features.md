# Superserve: newest features, Aug-Oct 2026

Checked **2026-10-29 / 30 (UTC)** for Haunted Hacks (Sat 31 Oct 2026). Angle: what Superserve shipped or announced in the last ~90 days, with exact dates, maturity, and which features they most likely want to see demoed.

**Method.** Superserve has **no changelog page**: `superserve.ai/changelog` redirects to `www.superserve.ai/changelog/`, which returns **HTTP 404**, and `docs.superserve.ai/changelog.md` also 404s. I did not find a launch week either. So the timeline below is rebuilt from primary artifacts:
(a) GitHub merged-PR dates in `superserve-ai/superserve` (SDKs, CLI, console, docs, MCP) and `superserve-ai/sandbox` (backend: control plane, VM daemon, proxy), pulled with `gh pr list --search "merged:>=..."`;
(b) GitHub releases;
(c) npm and PyPI publish timestamps;
(d) first-commit dates of individual docs pages;
(e) the blog index (`www.superserve.ai/blog/`), which has 7 posts.
Dates are UTC merge or publish dates. A merge date is the date code landed, not necessarily the date it went live in production. **[BG]** marks items from before Aug 2026.

---

## 0. What the product is (verified, one paragraph)

Superserve sells **cloud sandboxes / VMs for AI agents**. Each sandbox is a Firecracker microVM booted from a template. A sandbox can be **paused with memory, processes and disk intact** (no compute billed while paused), **resumed** (the YC page says machines start "in under 50ms", and the 10-01 blog says a paused sandbox "resumes in under 50ms". Both are vendor claims, not benchmarked here), and **snapshotted and forked**. Around that sit a secrets broker (credentials never enter the VM), egress allow/deny rules, a network log kept outside the VM, preview URLs, and integrations for Claude Managed Agents, Cursor, the OpenAI Agents SDK, LangChain, Agno, MCP and others. Tagline: "Virtual machines for long-horizon agents." YC page: "Virtual machines for autonomous agents… We run over 100K machines (as of Oct 2026) every week for world-class teams, including Lindy, and Y Combinator itself." That figure is company-submitted. [1][2][3] It is **not** model serving. That was a pivot: the Oct 2025 announcement described a Ray-based compute platform. This is covered in `00-early-draft.md`.

---

## 1. Dated timeline, Aug 1 - Oct 29 2026 (customer-visible items only)

Purely internal PRs are omitted: billing plumbing, abuse controls, devbox, CI, signup fraud checks.

| Date (UTC) | What shipped | Where | Evidence |
|---|---|---|---|
| 2026-08-21 | `Sandbox.list` gains `status`, `limit`, `offset` filters. SDK 0.8.3 published | SDK | PR superserve#310; npm/PyPI 0.8.3 on 08-21 [4][5] |
| 2026-08-21 | Metadata-tags doc updated (feature itself dates from Apr 2026 **[BG]**) | Docs | docs commit history [6] |
| 2026-09-03 | Cookbook nav reorganized, LangChain agent-harness page | Docs | PR superserve#319 [4] |
| 2026-09-09 | Egress rules **fail closed** if they cannot be applied. Bare IPs normalized to /32 | Backend | PR sandbox#481 [7] |
| 2026-09-11/12 | **Cursor Self-Hosted Machines** guide plus reference implementation (TS + Python) | Docs | PR superserve#320. The docs page was first committed 09-11 [4][6] |
| 2026-09-14/16 | `pause()` now waits until the sandbox is actually paused (follows the API's 202). Polls every 50ms for the first 2s. Delete retries a self-clearing 409. SDK 0.9.0 and 0.9.1 | SDK | PRs #333, #344, #308. npm 0.9.0 on 09-14, 0.9.1 on 09-16 [4][5] |
| 2026-09-14 | Durable pause operations plus a background reconciler for abandoned pauses | Backend | PR sandbox#493 [7] |
| 2026-09-19 | Template disk ceiling raised to 64 GiB | Backend | PR sandbox#543 [7] |
| 2026-09-22 | Network log and audit logs now **retain the last 7 days** (documented) | Docs/console | PR superserve#348 [4] |
| 2026-09-22 | Resume a paused sandbox from its bucket backup when the host-local artifacts are gone (durability) | Backend | PR sandbox#540 [7] |
| 2026-09-23 to 09-29 | **Saved snapshots and forks**: DB table and quotas (09-23), capture (09-24), create/list/rename/delete (09-25), create-from-snapshot (09-27), fork pre-copy (09-28), cold boot of a fork from backup (09-29) | Backend | PRs sandbox#549, #554, #561, #576, #581, #592 [7] |
| 2026-09-28 / 29 / 30 | **Snapshots and forks in the SDKs** (09-28), **console** (09-29), docs page (09-28 to 09-30). SDK 0.9.2 on 09-29 | SDK/console/docs | PRs superserve#351, #352, #357 [4][5][6] |
| 2026-10-01 | **Blog: "Cursor Cloud Agents now run on Superserve"** (Amit Patil). Pitches pause instead of delete (`CURSOR_WORKER_HIBERNATE=true`), an egress allowlist (`CURSOR_WORKER_ALLOW_OUT`), and the network log as a defense against prompt-injection exfiltration | Blog | [8] |
| 2026-10-01 | SDK sends signed routing hints to the proxy (latency/routing). SDK 0.9.3 on 10-02 | SDK/backend | PRs superserve#358, sandbox#601 [4][7] |
| 2026-10-02 | New example repo `superserve-ai/reproducible-runs`: reset, checkpoint/resume processes, restore an earlier checkpoint, export a run | Example | repo created 10-02 [9] |
| 2026-10-05 | MCP: network-log pagination | MCP | PR superserve#356 [4] |
| 2026-10-05 / 06 | **Computer use (desktop)**: guest desktop service plus persistent X11 backend (backend, 10-05). `sandbox.desktop` namespace and MCP `sandbox_computer` tool (10-05). Docs guide (10-06). `desktop.step()` runs an action batch and returns the next frame in one request (10-06). SDK 0.10.0 and `@superserve/mcp` 0.2.0/0.3.0 published 10-06 | Backend/SDK/MCP/docs | PRs sandbox#337, #338; superserve#309, #368, #372. npm dates [4][5][7] |
| 2026-10-06 | Template builds mount cgroup v1 controllers that container runtimes expect (groundwork for Docker-in-VM) | Backend | PR sandbox#640 [7] |
| 2026-10-07 / 08 | `Sandbox.list` accepts multiple statuses (SDK 0.11.0, 10-07). `desktop.step()` can wait for the first changed frame (0.11.1, 10-08) | SDK | PRs #369, #376 [4][5] |
| 2026-10-13 | `activate` waits out an in-flight pause and resumes. The SDK's waited pause is now one server-held request | Backend/SDK | PRs sandbox#682, superserve#384 [4][7] |
| 2026-10-15 | Template platform ceilings raised to **32 vCPU / 128 GiB memory / 128 GiB disk** (platform max, not plan max) | Backend | PR sandbox#691 [7] |
| 2026-10-15 / 16 | Desktop: JPEG frames, step timings, `quietMs` settle. MCP requests JPEG frames. SDK 0.11.3 and 0.11.4, MCP 0.3.2 and 0.3.3 | SDK/MCP | PRs #394, #398. npm dates [4][5] |
| 2026-10-15 / 16 | New curated template **`superserve/omnara`** | Backend/docs | PRs sandbox#680, superserve#383 [4][7] |
| 2026-10-19 | Customer egress rules now apply to **TCP on non-proxy ports** (previously HTTP/HTTPS-focused) | Backend | PR sandbox#723 [7] |
| 2026-10-23 | **Superserve CLI v2.0.0** released (rewritten TS CLI `@superserve/cli`, PR #409). v2.0.1 the same day (npm trusted publishing). Homebrew tap | CLI | GitHub releases cli-v2.0.0 / 2.0.1 [10] |
| 2026-10-23 | **Docker inside a sandbox** docs page | Docs | PR superserve#413. Docs page first committed 10-23 [4][6] |
| 2026-10-23 | `superserve/base` now ships **Python 3.12, Node.js 22, and build tools** | Template | PRs sandbox#787, superserve#410 [4][7] |
| 2026-10-26 | **CLI v2.1.0**: sign up / log in from the CLI with a browser device code | CLI | release cli-v2.1.0, PR #432 [10] |
| 2026-10-26 | New plan structure in billing code: "Free, Starter and configurable Pro" | Backend | PR sandbox#810 [7] |
| 2026-10-27 | Template builder keeps file owners and setuid/setgid/sticky bits from image layers. Base images judged by contents (Alpine/distroless no longer rejected by name) | Backend/docs | PRs sandbox#817, #823; superserve#443 [4][7] |
| 2026-10-28 | Docs: curated templates now **2 vCPU / 4 GiB / 8 GiB**. Image `ENV`, `WORKDIR`, `USER` become template defaults | Docs | PRs superserve#451, #453 [4] |
| 2026-10-29 | **CLI v2.1.1**: install signs you in right away and adds `superserve` to PATH. SDK option to **run commands as a specific user**. SDK 0.11.5 (TS + Python). Console renders **Developer and Pro** plans, **Starter hidden from new purchases** | CLI/SDK/console | release cli-v2.1.1. PRs #455, #452, #457. npm/PyPI 0.11.5 on 10-29 [4][5][10] |

**Release cadence (verified):** 13 TS SDK releases between 08-21 and 10-29, 0.8.3 to 0.11.5. PyPI mirrors them from 0.8.3 onward. MCP went 0.2.0 to 0.3.3 between 10-06 and 10-16. CLI went 2.0.0 to 2.1.1 between 10-23 and 10-29. [5][10]

**Blog cadence:** only **one** post in the window, Cursor on 10-01. Earlier posts **[BG]**: Phaser case study (07-15), "Introducing Secrets" (06-19), Claude Managed Agents (06-12), plus three May guides. [8]

---

## 2. Maturity: GA vs beta vs announced-only

**Important caveat:** Superserve's docs carry **no beta/preview/experimental labels at all**. I grepped the 319 KB `llms-full.txt`, and every "beta" hit belongs to Anthropic's `client.beta.*` APIs inside the Claude Managed Agents guide. There is also no published GA announcement for any feature. So the categories below are my inference from where each feature appears (public docs + SDK + CLI + MCP = "shipped") and from code that sits behind switches.

### Shipped: in public docs, SDKs, and (mostly) CLI/MCP
- **Snapshots and forks** (SDK 09-28, console 09-29, CLI `snapshot create|list|get|rename|delete|wait`). Limits: 100 snapshots per team, 20 per sandbox, 4 in flight per team. A running sandbox pauses "usually for under a second" during capture. Forks inherit network rules, timeout and secrets. Processes already running keep their old secret stand-ins, so restart them. [11]
  - *Caveat:* the `reproducible-runs` example README (10-02) says it "Requires… saved snapshots enabled on the deployment you use". The original backend PR (sandbox#221, opened 07-16 and **closed unmerged** 07-30 **[BG]**) proposed the feature as "disabled globally by default and… intended for a team-scoped staging canary", with an explicit per-team storage quota. The design that actually merged (sandbox#549 onward, Sep) may differ, but the README caveat suggests gating still exists. I could not verify whether it is now on for every new Free team. **Test it before Saturday.** [9][12]
- **Computer use / desktop** (10-05/06): template `superserve/desktop` (xfce, Chrome, browser viewer on port 6080, 1280x800 default). `desktop.step()` takes a whole model turn and returns the next frame in one request. `getStreamUrl({viewOnly})` gives a live viewer. The desktop survives pause/resume. MCP `sandbox_computer` uses the action vocabulary computer-use models are trained on. **Not in the CLI command table.** [13][14]
- **CLI v2** (10-23 to 10-29): `sandbox`, `exec`, `shell`, `files`, `cp`, `preview`, `snapshot`, `template`, `secret`, `provider`, plus `--json` everywhere. Browser device-code login. [14]
- **Docker in a sandbox** (docs 10-23): bake `dockerd` into a template with `startCmd` and `readyCmd`. Running containers survive pause/resume. Gotcha from the docs: commands run without `HOME`, so prefix with `HOME=/root`. [15]
- **New `superserve/base` contents** (10-23), the `superserve/omnara` template (10-16), and run-as-user (10-29).
- **Egress hardening**: fail-closed (09-09), TCP non-proxy ports (10-19). Network/audit log retention is 7 days (09-22).
- **Cursor Self-Hosted Machines integration** (guide 09-11, blog 10-01). Needs Cursor Enterprise, so it is irrelevant for the hackathon except as messaging. [8]

### Older, still-current features **[BG]** (shipped before Aug 2026; listed so nobody calls them "new")
Secrets broker and audit (docs 06-17, blog 06-19). Network log (docs 06-17). Mesa / Archil / S3-GCS-R2 storage mounts (06-25). MCP server docs (06-26). Preview URLs with per-port auth (07-28). Metadata tags (04-23). Claude Managed Agents integration (06-12). [6]

### In code but switched off or internal (not customer features yet)
- "Freeze on pause… behind the switches nothing sets" and "activation of frozen templates behind two switches, both off" (sandbox#499, #535, 09-18). [7]
- Upgrade page and scheduled plan changes "behind the pricing switch" (superserve#422, 10-23). [4]
- Cross-host peer data-plane forwarding and mTLS peer ingress (09-10 to 09-15). This is infrastructure. [7]
- **QM**: backend PRs add a "narrow QM authorization interface" (10-07) and "provision and meter dedicated QM organization teams" (10-16). Superserve forked `yc-software/qm` (GitHub description "Multiplayer agent harness for work.", homepage field `https://x.com/qm__dev`) on 08-01. The fork has branches `fix/superserve-sandbox-capacity`, `upstream/superserve-sandbox-capacity`, `pavitra/ss-507-superserve-sandbox-backend` and `pavitra/superserve-backend-upstream`. (sandbox#627 merged 10-07, sandbox#690 merged 10-16.) **Inference:** this is likely the "Y Combinator itself" customer claim, with QM sessions running on Superserve sandboxes. It is not announced publicly by Superserve as far as I found. [7][16]
- **Harbor** (Terminal-Bench eval framework, parent `harbor-framework/harbor`) forked 10-26. Upstream's README provider list does not include Superserve, and I found no upstream PR. **Inference only:** an eval/RL provider may be coming, which fits the YC blurb's "eval and training environments". [17]

### Announced-only
Nothing found. No roadmap page, no "coming soon" in the docs, no launch-week teaser.

---

## 3. Pricing changes in flux (directly affects the $100 attendee credits)

- **Live pricing page (fetched 10-29):** Free ($0, "$5 to start, plus $95 when you add billing", up to **20 concurrent sandboxes**, per-sandbox max **2 vCPU / 2 GiB memory / 8 GiB disk**). Pro ($1,000/mo or $12,000/yr, 1,000 concurrent, 16 vCPU / 64 GiB / 64 GiB). Enterprise (custom, self-host in AWS/GCP/Azure). Rates: $0.0504 per vCPU-hour and $0.0162 per GiB-hour, billed per second while running. [18]
- **The code says the plan set is changing this week.** 10-26: "Free, Starter and configurable Pro" (sandbox#810). 10-29: "render Developer and Pro from the catalog and add trial and low-credit banners" (superserve#452) and "hide Starter from new purchases and send Starter links to Developer" (superserve#457). Expect the pricing page to show a **Developer** tier soon. Limits may differ from the table above. [4][7]
- **Conflict to watch (sources disagree):** 10-28 docs say curated templates are now **2 vCPU / 4 GiB / 8 GiB** (superserve#451), and the docs' template resource-limits table (`templates/build-spec.md`, fetched 10-29) gives **Free max 2 vCPU / 4096 MiB memory / 8192 MiB disk** (Pro max 16 / 65536 / 65536). The marketing pricing page still says Free is "Up to 2 vCPU, **2 GiB** memory, 8 GiB disk". The docs table matches the new curated size, so the pricing page is probably stale (inference). Sandboxes inherit their template's shape and "cannot override them per-sandbox", so if the 2 GiB cap is what is enforced, use a team template of ≤2 GiB. **Test it on the event account.** [4][18][21]
- **Trial flow landed in the same release window:** cli-v2.1.1's notes include superserve#449 ("deliver plan signup and account billing flows") and #450 ("open the console for trial signups and send used-up trials to a plan picker"). New signups around Oct 31 may land in a trial/plan-picker flow rather than the $5+$95 Free flow described on the pricing page. [10]
- Storage billing code landed 08-26 ("Bill storage from referenced rootfs/template artifacts and sandbox overlays"), and the console shows storage billing status (10-03). The pricing page lists only compute and memory, so it is unclear whether paused/snapshot storage draws down credits. [7][4]
- YC-claim flows (10-16 to 10-22) and $5/$95 promotion-farming guards (09-29) exist (unverified in this pass; not re-checked). How the event's "$100 in Superserve.ai credits per attendee" gets applied (coupon vs promotion vs staff grant) is **not documented publicly**.
- **Prize stake (event page):** the grand prize includes "**$1000 in Superserve.ai credits**" alongside the YC interview, $5k OpenAI credits, $10,000 Freestyle credits and 3 months of Mastra. Superserve has no track prize of its own. [22]

---

## 4. Which new features Superserve most wants showcased (inference, ranked)

The basis for the ranking: what they wrote marketing copy about recently (the 10-01 blog and the Oct 2026 YC blurb), what they shipped the most engineering into in Sep-Oct, and what fits a "Real-Time AI" demo.

1. **Pause/resume as the core primitive** ("pause… at zero compute cost, and resume or fork from that exact state"). This is the headline in every recent artifact: the YC page, the 10-01 blog ("resumes in under 50ms"), and the Sep-Oct engineering on durable pauses, backup-backed resume, and activate-waits-out-pause. [1][8][7] A demo that visibly pauses an agent's machine mid-task and resumes it with in-memory state intact is the most on-message thing you can show.
2. **Snapshots and forks** (newest headline primitive, end of Sep). "Fork a running sandbox and explore multiple paths… keep the one that works" is repeated in the YC copy and the docs. A visual N-way fork race is the strongest showcase of something competitors market less. [1][11]
3. **Computer use / desktop with the live viewer** (newest SDK surface, 10-05 to 10-16, five SDK/MCP releases of polish in 10 days). It is visual, real-time, and fits Halloween well (an agent driving a spooky browser task while judges watch the stream URL). It also shows heavy recent investment, so the team will notice it. [13]
4. **Security story: egress allowlist + network log + secrets broker** (the 10-01 blog's whole second half is about prompt-injection exfiltration being blocked and logged). A "haunted prompt injection tries to exfiltrate, Superserve blocks it, and the log shows the attempt" demo maps directly onto their own marketing. [8]
5. **CLI v2 / agent-first onboarding** (`superserve.ai/SKILL.md`, the agent-facing homepage, `--json`, device-code login, shipped in the final week). They are clearly optimizing for "your coding agent sets up Superserve", so mentioning that you onboarded via the skill file or the MCP server is a small plus. [2][14]

---

## 5. Limits / could not verify

- **No official changelog, release notes page, or launch week exists.** All dates are reconstructed from GitHub/npm. Production rollout may lag merge dates. Some backend features land behind flags.
- No beta/GA labels exist anywhere. The maturity classification in §2 is inference.
- Could not confirm that saved snapshots are enabled by default for new Free teams (see the `reproducible-runs` caveat).
- Could not verify X/Twitter posts from `x.com/superserve` in Aug-Oct. Exa and WebSearch surfaced no dated posts, and no social sentiment run was done (out of scope for this angle). LinkedIn posts found were all **[BG]** (May-June).
- A Founderland article dated 2026-10-28 restates the YC claims and says independent confirmation of YC as a user "was not found". It is secondary only. [19]
- GitHub API rate limits blocked a code search of `yc-software/qm` for Superserve references, so the QM link rests on the branch name and backend PR titles.
- Pricing tiers were changing in code on 10-29. The live page may differ by Saturday.

---

## Hackathon implications

**What to build (on-message for Superserve while satisfying the hosts):**
- **"Séance fork race"**: one Terse Durable Actor per agent owns a Superserve sandbox ID. When it is stuck, it **snapshots** the sandbox and **forks N copies**. Each fork tries a different approach, and the forks report progress over **Agent Relay**. The winner is kept and the losers are deleted. The UI shows the forks racing in real time. This combines Superserve's two newest-marketed primitives with both host technologies.
- **"Haunted desktop"**: a computer-use agent in `superserve/desktop` driven by an OpenAI computer-use model through `desktop.step(..., {waitForChange: true, format: "jpeg"})`, with `getStreamUrl({viewOnly: true})` embedded live for judges. Pause the sandbox between turns while waiting on a human or another agent, then resume with the desktop intact. Shows the newest SDK surface plus pause/resume.
- **"Possession defense"**: a prompt-injected "cursed" README tries to exfiltrate a key. The key is bound as a Superserve **secret** (never in the VM), egress is allowlisted, and the dashboard streams `getNetworkLog({verdict: "blocked"})` entries live. This mirrors their 10-01 blog exactly.

**Gotchas:**
- The Free plan allows 20 concurrent sandboxes. Size N-way forks accordingly. Snapshot limits are 4 in flight and 20 per sandbox.
- Possible Free-plan conflict: the pricing page's 2 GiB memory cap vs the curated templates' new 4 GiB default (the docs list Free max as 4096 MiB). Size is set per template and cannot be overridden per sandbox, so if create fails, build your own template at ≤2 GiB.
- Pause returns on acceptance unless you use the waited form (SDK >= 0.9.0 waits). Use SDK **0.11.5**.
- Forked processes keep stale secret stand-ins, so restart secret-using processes in each fork.
- Commands run without `HOME`. Prefix `HOME=/root` for Docker and some CLIs.
- Desktop: resize to the model's native resolution first (width must be a multiple of 8). Treat everything on screen as untrusted.
- Auto-pause is **off by default** (`timeoutSeconds` unset). Set it so a forgotten swarm doesn't drain credits.
- Agent Relay's sandbox package has no Superserve adapter (per `00-early-draft.md`). Call the Superserve SDK directly.

**Setup to do before Oct 31:**
1. `curl -fsSL https://superserve.ai/install | sh` (CLI 2.1.1, signs you in by device code). Run `superserve whoami`.
2. `npm i @superserve/sdk@0.11.5` / `pip install superserve==0.11.5`. Optionally add the hosted MCP at `https://mcp.superserve.ai`.
3. Smoke-test on your actual account: create from `superserve/base`, pause, resume, `snapshot create`, create from snapshot, and create from `superserve/desktop`. This confirms snapshots are enabled and the template sizes fit your plan.
4. Pre-build any custom template (builds stream logs and take time). Snapshot a "golden" ready state so Saturday's boots are instant.
5. Ask the Superserve rep at check-in how the $100 credits are applied, and whether snapshots/desktop are enabled on event accounts.

**What judges/sponsor likely want:** visible use of pause/resume and snapshot/fork (their differentiators), computer use with a live viewer (their newest surface), and the egress/secrets security story. Name the primitives explicitly in the demo ("we forked a running VM, memory included"). Mention that onboarding went through their CLI or MCP.

---

## Sources

1. YC company page, Superserve: https://www.ycombinator.com/companies/superserve
2. Superserve homepage (agent-facing text) and SKILL.md: https://www.superserve.ai/ , https://superserve.ai/SKILL.md
3. Docs index: https://docs.superserve.ai/llms.txt
4. `superserve-ai/superserve` merged PRs (e.g. #310, #320, #333, #348, #351, #352, #368, #372, #409, #413, #432, #451, #452, #455, #457): https://github.com/superserve-ai/superserve/pulls?q=is%3Apr+is%3Amerged
5. npm `@superserve/sdk`, `@superserve/mcp`, `@superserve/cli`, and PyPI `superserve`: https://www.npmjs.com/package/@superserve/sdk , https://www.npmjs.com/package/@superserve/mcp , https://www.npmjs.com/package/@superserve/cli , https://pypi.org/project/superserve/
6. Docs page commit history (GitHub API `commits?path=docs/...`): https://github.com/superserve-ai/superserve/commits/main/docs
7. `superserve-ai/sandbox` merged PRs (e.g. #481, #493, #499, #535, #540, #543, #549-#592, #601, #627, #640, #680, #682, #690, #691, #723, #787, #810, #817, #823): https://github.com/superserve-ai/sandbox/pulls?q=is%3Apr+is%3Amerged
8. Blog, "Cursor Cloud Agents now run on Superserve" (2026-10-01): https://www.superserve.ai/blog/cursor-cloud-agents-on-superserve/ ; blog index: https://www.superserve.ai/blog/
9. Example repo `reproducible-runs`: https://github.com/superserve-ai/reproducible-runs
10. GitHub releases cli-v2.0.0 to cli-v2.1.1: https://github.com/superserve-ai/superserve/releases
11. Snapshots and forks docs: https://docs.superserve.ai/sandbox/snapshots.md
12. Draft PR sandbox#221, "Sandboxes: add saved snapshots and independent forks" (Jul 2026, BG): https://github.com/superserve-ai/sandbox/pull/221
13. Computer use docs: https://docs.superserve.ai/sandbox/desktop.md
14. CLI docs and MCP docs: https://docs.superserve.ai/cli.md , https://docs.superserve.ai/integrations/mcp.md
15. Docker docs: https://docs.superserve.ai/sandbox/docker.md
16. QM fork (parent `yc-software/qm`): https://github.com/superserve-ai/qm
17. Harbor fork: https://github.com/superserve-ai/harbor
18. Pricing page: https://www.superserve.ai/pricing
19. Founderland, "Superserve launches VMs for AI agents, now at 100K+ weekly runs" (2026-10-28): https://founderland.ai/articles/superserve-launches-vms-for-ai-agents-now-at-100k-weekly-run-mvshtedg
20. Lifecycle (auto-pause) docs: https://docs.superserve.ai/sandbox/lifecycle.md
21. Template build spec, resource limits table: https://docs.superserve.ai/templates/build-spec.md
22. Event page (local copy): /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md
23. Homebrew tap repo: https://github.com/superserve-ai/homebrew-tap

---

## Verification log (2026-10-29)

Adversarial re-check by an independent pass using `gh` (PR/release/repo metadata), `npm view`, the PyPI JSON API, `curl` against docs `.md` pages, and Exa fetch of the pricing, YC and blog pages. **Outcomes:** CONFIRMED / CORRECTED / ADDED / UNVERIFIED.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | No changelog page | `superserve.ai/changelog`, `www.superserve.ai/changelog/` and `docs.superserve.ai/changelog.md` all return HTTP 404 | CONFIRMED |
| 2 | 13 TS SDK releases 0.8.3 to 0.11.5 (08-21 to 10-29), PyPI mirrors them | `npm view @superserve/sdk time`: 0.8.3 (08-21) … 0.11.5 (10-29T20:35Z), 13 versions. PyPI latest is 0.11.5. 0.8.3 to 0.9.3 dates match | CONFIRMED |
| 3 | MCP 0.2.0 to 0.3.3 between 10-06 and 10-16 | npm: 0.2.0 and 0.3.0 on 10-06, 0.3.1 on 10-08, 0.3.2 on 10-15, 0.3.3 on 10-16 | CONFIRMED |
| 4 | CLI 2.0.0/2.0.1 (10-23), 2.1.0 (10-26), 2.1.1 (10-29); Homebrew tap; trusted publishing | GitHub releases match to the day. `superserve-ai/homebrew-tap` repo exists. 2.0.1 notes cite PR #412 "publish to npm with Trusted Publishing". The 2.1.1 notes list PRs #438/#440 (sign in after install, add to PATH) | CONFIRMED |
| 5 | ~40 cited PR numbers, titles and merge dates (superserve #308-#457, sandbox #337-#823) | `gh pr view` on every cited number. Every title and UTC merge date matches the table (e.g. #351 09-28, #352 09-29, #691 10-15, #723 10-19, #810 10-26, #457 10-29T23:27Z) | CONFIRMED |
| 6 | sandbox#221 "shipped" snapshots disabled by default | PR is **CLOSED, not merged** (opened 07-16, closed 07-30). Body says "disabled globally by default" | CORRECTED (wording changed to "proposed") |
| 7 | Snapshot limits 100/team, 20/sandbox, 4 in flight; pause "usually for under a second"; forks inherit network, timeout and secrets; restart secret-using processes | Exact text in `sandbox/snapshots.md` | CONFIRMED |
| 8 | `reproducible-runs` created 10-02 and requires saved snapshots enabled | Repo createdAt 2026-10-02T21:10Z. README line 14 quoted correctly | CONFIRMED |
| 9 | Desktop: xfce, Chrome, port 6080, 1280x800, width multiple of 8, survives pause, untrusted-screen warning, `waitForChange`/`jpeg` | All present in `sandbox/desktop.md` | CONFIRMED |
| 10 | Docker docs: `startCmd`/`readyCmd`, containers survive pause, `HOME=/root` | All present in `sandbox/docker.md` | CONFIRMED |
| 11 | Auto-pause off by default | lifecycle.md: "Leave it unset (the default) to disable auto-pause" | CONFIRMED |
| 12 | Pricing: Free $0, $5+$95, 20 concurrent, 2 vCPU/2 GiB/8 GiB; Pro $1,000/mo or $12,000/yr, 1,000 concurrent, 16/64/64; $0.0504 vCPU-h and $0.0162 GiB-h | Live pricing page matches exactly | CONFIRMED. The 2 GiB figure **conflicts** with the docs build-spec table (Free max 4096 MiB) | ADDED conflict detail |
| 13 | YC blurb quotes ("Virtual machines for autonomous agents", "over 100K machines (as of Oct 2026) every week… Lindy, and Y Combinator itself", "pause… at zero compute cost, and resume or fork from that exact state") | YC page text matches verbatim. Batch Fall 2026, team size 3 | CONFIRMED (company-submitted figures) |
| 14 | 10-01 blog by Amit Patil: `CURSOR_WORKER_HIBERNATE`, `CURSOR_WORKER_ALLOW_OUT`, "resumes in under 50ms", network log outside VM, Cursor Enterprise required | Blog text matches | CONFIRMED |
| 15 | Blog index has 7 posts | 7 distinct `/blog/<slug>/` links | CONFIRMED |
| 16 | QM fork: description "A multiplayer agent harness for work", homepage qm.ycombinator.com | Upstream description is "Multiplayer agent harness for work." and the homepage field is `https://x.com/qm__dev`. Fork created 08-01. Branch exists, plus three more Superserve branches. PRs #627/#690 titles confirmed | CORRECTED |
| 17 | Harbor fork 10-26 | Created 2026-10-26T03:25Z, parent `harbor-framework/harbor` | CONFIRMED (parent added) |
| 18 | Founderland 10-28 article says YC-as-user confirmation "was not found" | Article text confirmed. Dated 10-28 | CONFIRMED |
| 19 | Storage billing code 08-26 | sandbox#431 merged 08-26 "Bill storage from referenced rootfs/template artifacts and sandbox overlays" | CONFIRMED |
| 20 | Superserve event credits | EVENT_PAGE.md: "$100 in Superserve.ai credits per attendee". The grand prize also includes "$1000 in Superserve.ai credits" (missing from the earlier draft) | CONFIRMED + ADDED |
| 21 | Install URL / MCP URL | `superserve.ai/install` 200 (script supports `SUPERSERVE_NO_LOGIN`, `SUPERSERVE_NO_MODIFY_PATH`). `mcp.superserve.ai` answers 405 to GET, so the endpoint exists and expects MCP POST | CONFIRMED |
| 22 | YC-claim flows 10-16 to 10-22 and promo-farming guards 09-29 | Not re-checked in this pass | UNVERIFIED (marked) |

No fabricated quotes or dead URLs were found. All 20 original source URLs resolved or were checked through `gh`.
