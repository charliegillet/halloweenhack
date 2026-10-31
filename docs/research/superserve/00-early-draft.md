# Sponsor research: Superserve (superserve.ai, YC F26)

Checked **29 October 2026** for Haunted Hacks (Sat 31 Oct 2026, SF, 11:00–16:00 build window). Sources were the live superserve.ai homepage and pricing page (Firecrawl, `maxAge: 0`), docs.superserve.ai (Mintlify `.md` endpoints and `llms.txt`), the agent-facing setup file `superserve.ai/SKILL.md`, the GitHub API via `gh` (repos, releases, commits), npm and PyPI registry lookups, the YC company page, LinkedIn posts, a Nitter mirror of X, Hacker News, and the ComputeSDK benchmark site. Bracketed numbers point to the Sources list. **[BG]** marks anything dated before Aug 2026, which is background only.

---

## TL;DR

- **What it is (verified):** Superserve is **not** model serving and not agent hosting in the PaaS sense. It sells **cloud sandboxes for AI agents**: Firecracker microVMs that boot from templates, can **pause indefinitely with memory, processes and disk intact** (no compute billed while paused), **resume** (claimed <50ms), and **snapshot/fork** into parallel copies. Around that it adds a **credential broker** (the real API keys never enter the VM), **egress allow/deny rules**, a **network log** kept outside the VM, **preview URLs**, **computer-use desktops**, and Docker-in-VM. Tagline: "Virtual machines for long-horizon agents." [1][2][3]
- **Interfaces:** CLI (`superserve`, v2.1.1 released 29 Oct 2026), TypeScript SDK `@superserve/sdk` and Python SDK `superserve` (both 0.11.5 as of 29 Oct), REST API at `api.superserve.ai`, and an MCP server (`@superserve/mcp` 0.3.3, also hosted at `mcp.superserve.ai`). [2][4][5][6]
- **$100 of credits:** usage costs $0.0504 per vCPU-hour and $0.0162 per GiB-hour, billed per second while the sandbox is running. The default 2 vCPU / 4 GiB template therefore costs about **$0.166/hr**, so $100 buys roughly **600 sandbox-hours**. A 20-sandbox swarm running for the whole 5-hour hackathon costs about $17. **Credits will not be the constraint. The Free plan's 20-concurrent-sandbox cap will.** [7] (arithmetic below)
- **Fit with the hosts:** Superserve gives an agent a *computer*. Terse Durable Actors gives it *durable identity and state*. Agent Relay gives it *messaging*. The strongest combined story: **each Durable Actor owns one Superserve sandbox ID**, pauses the VM when idle and resumes it on demand, and actors coordinate over Agent Relay. One caveat: Agent Relay's own provider-agnostic `@agent-relay/sandbox` package ships adapters for E2B, Daytona, Modal, Vercel, Freestyle and others, but **no Superserve adapter** (checked 29 Oct). [8][9]
- **Info density:** good for a 3-person company. Docs are thorough and current, and the GitHub repo is very active (dozens of commits in October). Third-party or social signal is thin: a 9-point Show HN, a few hundred X followers, and LinkedIn posts mostly by the team.

---

## 1. Company and founders

| Fact | Value | Source |
|---|---|---|
| YC batch | Fall 2026 (F26), status Active, primary partner Max Kolysh | [3] |
| Founded / team | 2025, team size 3, San Francisco | [3] |
| Founder/CEO | **Pavitra Bhalla**. Previously Staff SWE at Dosu (code-reasoning agents), and Founding Engineer / Director of Engineering at Long-Term Stock Exchange (YC S17) | [3] |
| Other visible team (GitHub/LinkedIn) | Amit Patil (`meAmitPatil`, top contributor, 133 commits), `nirnejak` (blog byline "Jeet"), `awille-ai`, `mohamedsobhi777` | [4][10][11] |
| Funding [BG] | Pre-seed from **Open Core Ventures**, announced Oct 2025. PitchBook lists a $500K accelerator deal (YC) dated Jan 2026 | [12][13] |
| Pivot history [BG] | The Oct 2025 announcement said "the first Agentic AI compute platform on **Ray**". PitchBook records "Formerly Known As Ray AI", and the org still has a `ray` fork. The product has since moved to Firecracker sandboxes | [12][13][4] |
| Traction claim | "We run over 100K machines (as of Oct 2026) every week for world-class teams, including Lindy, and Y Combinator itself." **Company-submitted and unaudited.** Founderland (28 Oct) could not independently confirm YC as a user | [3][14] |
| Handles | X: `@superserve_ai` (company), `@pavitrabhalla` (founder). LinkedIn: `super-serve-ai`. Email: engineering@superserve.ai | [1][10][15] |

**YC deal (context, inference about motivation):** Superserve offers YC companies 1 year of Pro free plus up to $90K in compute credits, and F26 companies get "$30K a month for your first 3 months" [16]. The company is aggressively buying adoption, so a hackathon sponsorship fits the same pattern. Expect the team to care most about **new signups and visible usage**.

---

## 2. Product: what it actually is (verified from docs)

### Core primitives
- **Sandbox = Firecracker microVM.** "Every agent and tool call runs in its own microVM. No shared kernels." Containers are explicitly not offered as sandboxes; per the founder on X, Sep 19: "We don't even have an option to run containers as sandboxes." [1][15]
- **Lifecycle:** `active ↔ paused → deleted`. `pause()` checkpoints memory, processes and filesystem and stops compute billing. `resume()` restores it. `Sandbox.connect()` and `commands.run()` auto-resume a paused sandbox. [17]
- **Auto-pause:** `timeoutSeconds` caps **active** time, not idle time, so running work does not reset it and a long task can be paused mid-run. **Auto-delete:** `autoDeleteSeconds` deletes a sandbox after continuous pause (max 30 days). By default a paused sandbox is kept forever. [17]
- **Snapshots and forks** (shipped late Sep 2026): `sandbox.snapshot()` saves memory and disk. `Sandbox.create({ fromSnapshot })` starts a fork "with its files, installed packages and running processes in place." Limits: **100 snapshots/team, 20/sandbox, 4 in flight**. Forks inherit network rules, timeout and secrets. Processes that were running at snapshot time keep their old secret tokens and must be restarted. [18][19]
- **Templates:** system templates include `superserve/base` (Ubuntu 24.04, Python 3.12, Node 22), `python-3.11`, `node-22`, `python-ml`, `code-interpreter`, `claude-code`, `openclaw`, `hermes`, `omnara`, and `desktop`. All are 2 vCPU · 4 GiB · 8 GiB disk. **The VM shape comes from the template and cannot be overridden at create time.** Team templates are built from OCI images plus build steps. [20]
- **Commands:** `commands.run()` (sync, or streaming via SSE callbacks) and `commands.spawn()` (full-duplex session over WebSocket with stdin, signals and `wait()`). If the socket drops, the process keeps running. In Python, `spawn` is **async-only** (`AsyncSandbox`). In TS it needs **Node 22+** or a `ws` polyfill. New on 29 Oct: a `user` option to run as a specific user. [21][11]
- **Files:** `sandbox.files.write/readText`. External mounts: S3/GCS/R2 via FUSE, plus Mesa (versioned git-compatible FS) and Archil. [2][22]

### Security layer (Superserve's differentiator)
- **Secrets / credential broker:** `Secret.create({ name, value, provider: "openai" })`, then bind it with `Sandbox.create({ secrets: { OPENAI_API_KEY: "openai-prod" } })`. The VM sees only a stand-in token, and the platform swaps in the real key on outbound requests **only to that provider's hosts**. Built-in providers include Anthropic, OpenAI, Gemini, OpenRouter, GitHub, GitLab, Vercel, Cloudflare, Stripe, Notion and Resend. [23]
- **Network rules:** `allowOut` (IPs, CIDRs, domains with wildcards) and `denyOut` (IPs/CIDRs only). Allow beats deny. Private, link-local and loopback ranges are always blocked. **Gotcha:** deny-all also blocks DNS, so you must allow `1.1.1.1/32` and/or `8.8.8.8/32`. Rules can only be updated on an **active** sandbox. [24]
- **Network log:** every HTTP/HTTPS connection to public addresses on ports 80 and 443, whether allowed, blocked or failed, plus every secret-bearing request. It is stored outside the VM and retained for 7 days. [2][11]
- Compliance claims: SOC 2 Type 2, HIPAA and GDPR, via a Vanta trust center. Not independently verified. [1]

### Other capabilities
- **Preview URLs:** `https://{port}-{sandbox-id}.sandbox.superserve.ai`. New sandboxes default to strict `public` mode, so you must call `publishPreviewPort(port)` explicitly. Private ports use header tokens or signed URLs (for browsers, iframes and WebSockets). Ports must be 1024–65535, and 49983 is reserved. [25]
- **Computer use** (shipped 5–16 Oct 2026): use the `superserve/desktop` template (xfce, Chrome, noVNC). `sandbox.desktop.step(actions, { waitForChange, format: "jpeg" })` runs a model turn's actions and returns the next frame in one request. `getStreamUrl()` gives a live browser viewer on port 6080. [26][11]
- **Docker inside the sandbox** (docs added 23 Oct 2026). [11]
- **MCP server:** tools such as `sandbox_create` and `sandbox_exec`. Run it locally with `npx -y @superserve/mcp` or remotely at `https://mcp.superserve.ai` with a bearer token. The hosted endpoint has **no OAuth yet**, so the Claude.ai and ChatGPT custom-connector UIs cannot use it. [6]
- **Self-host:** the infra repo `superserve-ai/sandbox` is written in Go (control plane, `vmd` VM daemon on bare metal, `boxd` guest agent over vsock, COW snapshot pools). It requires a Linux KVM host and Postgres. Its license field reads `NOASSERTION`, while the main monorepo is Apache-2.0. [4][27]

---

## 3. Newest features (Aug–Oct 2026, from commits, releases and posts)

| Date | What shipped | Source |
|---|---|---|
| 10 Aug | LangChain **deepagents** supports Superserve sandboxes (`langchain-superserve` repo) | [28][4] |
| 22 Aug | Launchpad listing | [29] |
| 11 Sep | Cursor Self-Hosted Machines partner guide plus reference implementation | [11] |
| 14–16 Sep | SDK 0.9.0: `pause()` waits for the paused state, held-request waits | [11] |
| 22 Sep | Network and audit logs keep 7 days | [11] |
| 28–29 Sep | **Snapshots and forks** in the SDK and console (SDK 0.9.2) | [11][18] |
| 1 Oct | Blog post: **Cursor Cloud Agents run on Superserve** (pause while waiting for review, egress allowlist, out-of-VM network log) | [30] |
| 5–16 Oct | **Computer use / `sandbox.desktop`** plus an MCP computer tool. SDK 0.10.0 → 0.11.4, MCP 0.2.0 → 0.3.3. JPEG frames, `quietMs`, step timings | [11] |
| 9–11 Oct | Benchmark claims: fastest burst TTI on ComputeSDK, and "#1 sandbox, #2 devtool" on devtoolarena (Codex). **See the caveat in §5** | [15][31] |
| 16 Oct | `superserve/omnara` template added | [11] |
| 23 Oct | **CLI 2.0.0** (new TS/Bun CLI published to npm and Homebrew). Docker-in-sandbox docs. `superserve/base` ships Python 3.12 and Node 22 | [4][11] |
| 26 Oct | **CLI 2.1.0**: sign up and log in from the CLI via a browser device code | [4] |
| 27–29 Oct | **CLI 2.1.1**: the installer signs you in and adds the CLI to PATH. Curated templates become 2 vCPU / 4 GiB / 8 GiB. Run-as-user option. SDKs 0.11.5. **Billing and plan rework in progress** (console commits mention "Developer" and "Pro" plans from a catalog, trial banners, and hiding "Starter") | [4][11] |

**[BG] earlier milestones:** repo created 10 Oct 2025; v1.0.0 Feb 2026; infra repo Apr 2026; blog post on OpenAI Agents SDK sandbox providers (19 May 2026); an open PR adding a Superserve backend to `openai/openai-agents-python` (#3502, opened 25 May, later marked stale, still open); **Claude Managed Agents** integration with Anthropic (12 Jun 2026); Mesa partnership (18 Jun); Phaser game-agent case study (15 Jul). [32][33][34][35]

---

## 4. Pricing and what $100 buys

**Published plans (live page, 29 Oct 2026)** [7]:

| Plan | Price | Included | Limits |
|---|---|---|---|
| Free | $0, PAYG after credit | "$5 to start, plus $95 when you add billing" | **20 concurrent sandboxes**, no time limit, **max 2 vCPU / 2 GiB memory / 8 GiB disk per sandbox** |
| Pro | $1,000/mo billed annually ($12K/yr) | $1,000 metered usage/month, priority support | 1,000 concurrent, up to 16 vCPU / 64 GiB / 64 GiB |
| Enterprise | Custom | BYOC self-host in AWS/GCP/Azure | Custom |

Usage rates: **vCPU $0.0504/hr** and **memory $0.0162/GiB-hr**, billed per second while the sandbox is running.

**Credit math (my arithmetic from the published rates):**
- 2 vCPU + 4 GiB (the default template shape): 0.1008 + 0.0648 = **$0.1656/hr**. $100 ≈ **604 hours**.
- 2 vCPU + 2 GiB: $0.1332/hr. $100 ≈ 750 hours.
- A 20-sandbox swarm (the Free cap) at 2/4 for the full 5-hour build: 20 × 5 × 0.1656 ≈ **$16.56**.
- A paused sandbox bills **no compute**. The console code mentions "hourly storage" billing, but **no public storage rate for paused VMs or snapshots could be found**.

**Inconsistencies to watch:**
1. The pricing page body says Pro is $1,000/mo, but its `og:description` meta tag says "Pro: $1,200/month or $12,000/year". This probably means $1,200 monthly or $1,000/mo annual. [7]
2. The Free plan caps memory at **2 GiB per sandbox**, while every curated template is now **4 GiB** (docs change, 28 Oct). It is unclear whether a Free account can boot `superserve/base` or `superserve/claude-code` unchanged. **Test this before Saturday.** [7][20]
3. Billing UI and plans were being reworked on 27–29 Oct ("Developer" plan, hiding "Starter", trial banners) [11]. Expect the signup flow to look different from these docs.
4. **How the hackathon's "$100 in Superserve.ai credits per attendee" is delivered is not stated** on the event page or anywhere we could find. It may be a promo code or `?offer=` link, or it may be the standard $5 + $95 Free offer. Ask a Superserve rep at check-in.

---

## 5. Benchmarks, competition and social pulse

- **ComputeSDK burst TTI (current leaderboard, fetched 29 Oct):** Superserve has a **410 ms median** (p95 560 ms) at **7th of 30**, behind miosa, isorun, promigence, gravixlayer, archil and arker. It is ahead of Vercel (718), Modal (1071), Daytona (1095), E2B (1439) and **Freestyle (3237)**. The founder's Oct 9 "fastest TTI on burst workloads amongst major sandbox providers" claim is scoped to "Modal, Vercel, Daytona, E2B, and Cloudflare", which holds on this board but is not "fastest overall". Note that the "<50ms" marketing figure is a VM cold-start claim, not end-to-end TTI. [31][36][15]
- devtoolarena "#1 sandbox, #2 devtool" claim (Oct 11): the source page was not fetched or verified. [15][37]
- **Fellow sponsor overlap:** Freestyle (F24, also a sponsor) also sells VMs and sandboxes for agents. Both sponsors are pitching "computers for agents", so pick one as the primary execution layer, or use them for different roles.
- **Social:** Show HN "Superserve – Firecracker microVM sandboxes for long-running AI agents" got **9 points, 1 comment** (about 3 months before 29 Oct, so ~Jul/Aug 2026). The one question was "How does it handle chron jobs or waking from a messaging app?" and it went unanswered in-thread. That is exactly the gap that Durable Actors and Agent Relay fill (inference). The founder's X account showed ~299 followers on the Nitter mirror. LinkedIn company page: ~362 followers. Engagement is low (single-digit to tens of reactions). We found **no independent Reddit or X discussion** and no critical coverage beyond a general Tom's Hardware item (24 Oct, via Founderland) about red-team agents escaping microVM sandboxes through cache-timing side channels, which is not Superserve-specific. [34][10][38][14]
- Public customer and partner names: Lindy (Teammate runs on Superserve, per Superserve's LinkedIn), Phaser, Mesa, sprag.ai, Cursor (as an integration), Anthropic (Managed Agents integration). [14][35][10]

---

## 6. How Superserve fits a Terse / Agent Relay project (inference unless cited)

| Layer | Owner | Role in a combined design |
|---|---|---|
| Identity, durable state, scheduling, wake-ups | **Terse Durable Actors** | One actor per agent or task. Persists `sandboxId`, `snapshotId`, transcript, and status |
| Agent-to-agent messages | **Agent Relay** | Actors and agents DM, broadcast and hand off work |
| The agent's computer | **Superserve** | Per-actor Firecracker VM: run code, Claude Code/Codex, browser/desktop, Docker; pause when idle |
| LLM | OpenAI | Key held as a Superserve **Secret** so it never enters the VM |

Concrete patterns:
1. **Actor-owned VM ("hibernating agents"):** the actor stores `sandboxId`. When a message arrives, `Sandbox.connect(id)` auto-resumes, the agent runs, then `pause()`. The demo moment is showing the VM's memory and processes survive (a running dev server or REPL comes back with the same state) while compute billing stops. This directly answers the unanswered HN question about waking from a message.
2. **Fork-and-race swarm:** a coordinator actor snapshots a prepared sandbox, forks N children (≤20 on Free, ≤4 snapshots in flight), assigns each child agent a strategy over Agent Relay, and picks the winner by test results. This uses Superserve's headline primitive (fork) plus Relay (coordination) plus Actors (tracking the race state).
3. **Haunted computer-use demo:** a `superserve/desktop` sandbox with `getStreamUrl({ viewOnly: true })` embedded live on the demo screen while agents "possess" the desktop. Visually strong for a 2-minute live demo.
4. **Security narrative:** egress allowlist plus secret broker plus network log. Show a prompt-injected agent trying to exfiltrate data, getting blocked, and the block appearing in the out-of-VM log. This is probably the most sponsor-aligned story, mirroring Superserve's own Cursor blog post. [30]

**Integration gap:** `@agent-relay/sandbox` 0.1.16 (npm, last modified 16 Sep 2026) supports `agent37, agentcore, daytona, e2b, freestyle, local, microsandbox, modal, vercel`, with **no Superserve adapter** [8][9]. Use the Superserve SDK directly. Writing a small Superserve adapter for Relay's runtime port could be a stretch goal that would resonate with both teams, but it must be written at the event under the "all code created at the hackathon" rule.

---

## Limits / what we could not verify

- The mechanism for delivering the **$100 hackathon credit** (promo code vs standard Free offer).
- Whether **Free-plan memory caps (2 GiB) block the 4 GiB curated templates**.
- **Storage pricing** for paused sandboxes and snapshots.
- Real end-to-end resume latency (<50ms is a vendor claim; independent TTI is ~250–410 ms for *create*, not resume).
- The "100K machines/week" and "Y Combinator itself" customer claims (company-submitted).
- The devtoolarena ranking page itself. X posts after the Nitter capture (the mirror returned HTTP 429 on the company feed).
- Whether a Superserve rep will be at the event, or whether there is a Superserve-specific prize beyond the $1,000 credits in the grand prize.
- Whether the Terse Durable Actors runtime is Node 22+ (needed for `commands.spawn` WebSockets without a polyfill). Check the Terse research doc.

---

## Hackathon implications

**What to build with it**
- Use Superserve as the **execution layer** under Durable Actors (state and wake-ups) and Agent Relay (messaging). Lead with **pause/resume plus fork**, because those are the features Superserve differentiates on against E2B, Modal and Freestyle. A sandbox that only runs `python -c` will read as generic.
- Best demo beats: (a) "the agent slept and woke with its running process intact", (b) "we forked 8 agents from one snapshot and the Relay-coordinated winner merged", (c) a live desktop viewer, and (d) an exfil attempt blocked by egress rules and shown in the network log.

**Setup to do before Oct 31 (thinking and setup are allowed; project code must be written at the event)**
1. Install the CLI: `curl -fsSL https://superserve.ai/install | sh`. Check `superserve --version` ≥ 2.1.0. Then `superserve login --no-wait` (device-code flow). [5]
2. Create an API key in the console (`console.superserve.ai/api-keys`). Keys look like `ss_live_...`; export `SUPERSERVE_API_KEY`. Never paste it into an agent chat. [2][5]
3. Smoke test: `superserve sandbox create --name t --template superserve/base --json`, then `superserve exec <id> -- python3 --version`, then `sandbox pause` / `resume`. Confirm whether the Free plan's 2 GiB cap rejects the 4 GiB template. If it does, plan a team template with smaller memory, or add billing to unlock the $95.
4. Install the SDK in a scratch dir to check versions: `npm i @superserve/sdk` (0.11.5) or `pip install superserve` (0.11.5).
5. Optionally add the MCP server to Claude Code so your coding agent can create sandboxes during the build: `claude mcp add superserve --env SUPERSERVE_API_KEY=... -- npx -y @superserve/mcp`. [6]
6. Pre-create a Secret for the OpenAI key (`provider: "openai"`) so in-VM agents never hold it. [23]

**Gotchas**
- Use the sandbox **ID, not the name**. Names are not unique and the CLI refuses ambiguous names. [5]
- `timeoutSeconds` is an **active-time cap**: it will pause a long task mid-run. Leave it unset during the demo, or size it generously. [17]
- Deny-all egress **breaks DNS** unless you allow `1.1.1.1/32` and `8.8.8.8/32`. Network rules can't be changed while the sandbox is paused. [24]
- Preview ports must be **published explicitly** (strict public by default). Port 49983 is reserved. [25]
- Python `spawn` is async-only. TS `spawn` needs Node 22+.
- Snapshot limits are 4 in flight and 20 per sandbox, and Free allows 20 concurrent sandboxes. Size the swarm demo to fit.
- Restart secret-using processes in forks: tokens captured at snapshot time only work in the original sandbox. [18]
- Billing and plan UI changed this week, so screenshots in docs may not match.
- Delete or auto-delete sandboxes afterwards (`autoDeleteSeconds`). Paused sandboxes are kept forever by default.

**What the sponsor likely wants (inference)**
- Visible, meaningful use of the **long-horizon primitives** (pause, resume, fork, secrets, egress), ideally narrated on stage with the product name. Their positioning is "agents need their own computers", so judges from Superserve will reward agents that *live* in VMs over agents that make one-off `exec` calls.
- Signups and usage: they are in the middle of a growth push (YC deals, CLI device-code signup shipped 26 Oct).
- The Superserve-specific upside is inside the grand prize ($1,000 Superserve credits). There is no separate Superserve track listed, so treat Superserve as a force multiplier for the Durable Actors and Agent Relay tracks, not as a target in its own right.

---

## Sources

1. Superserve homepage (live fetch 29 Oct 2026): https://www.superserve.ai/
2. Superserve agent-facing page and docs index: https://superserve.ai (agent view) and https://docs.superserve.ai/llms.txt
3. YC company page: https://www.ycombinator.com/companies/superserve
4. GitHub: https://github.com/superserve-ai/superserve (releases cli-v2.0.0 to cli-v2.1.1; 475 stars, 55 forks, Apache-2.0, checked via `gh api` 29 Oct 2026). Org repos: https://github.com/superserve-ai
5. Setup skill: https://superserve.ai/SKILL.md
6. MCP docs: https://docs.superserve.ai/integrations/mcp.md
7. Pricing (live fetch 29 Oct 2026): https://www.superserve.ai/pricing
8. `@agent-relay/sandbox` on Libraries.io: https://libraries.io/npm/@agent-relay%2Fsandbox (npm `version 0.1.16`, modified 2026-09-16)
9. AgentWorkforce/sandbox repo `src/` listing (via `gh api`): https://github.com/AgentWorkforce/sandbox
10. Pavitra Bhalla on X (Nitter mirror): https://nitter.rdrama.net/pavitrabhalla
11. Commit history, superserve monorepo (Sep–Oct 2026): https://github.com/superserve-ai/superserve/commits/main
12. Pavitra Bhalla LinkedIn, founding / pre-seed post [BG]: https://www.linkedin.com/posts/pavitrabhalla_careers-superserve-building-sandbox-infra-activity-7384310361862131712-yqC2
13. PitchBook profile: https://pitchbook.com/profiles/company/1318815-46
14. Founderland, 28 Oct 2026: https://www.founderland.ai/articles/superserve-launches-vms-for-ai-agents-now-at-100k-weekly-run-mvshtedg
15. Founder X posts Sep 19, Oct 9, Oct 11 (same Nitter mirror as [10])
16. YC deal page: https://www.superserve.ai/yc/
17. Lifecycle docs: https://docs.superserve.ai/sandbox/lifecycle.md
18. Snapshots and forks docs: https://docs.superserve.ai/sandbox/snapshots.md
19. Create docs: https://docs.superserve.ai/sandbox/create.md
20. Templates docs: https://docs.superserve.ai/templates/overview.md
21. Interactive processes docs: https://docs.superserve.ai/commands/sessions.md
22. Cloud buckets docs: https://docs.superserve.ai/storage/cloud-buckets
23. Secrets docs: https://docs.superserve.ai/secrets/overview.md
24. Network rules docs: https://docs.superserve.ai/sandbox/networking.md
25. Preview URLs docs: https://docs.superserve.ai/sandbox/preview-urls.md
26. Computer use docs: https://docs.superserve.ai/sandbox/desktop.md
27. Infra repo: https://github.com/superserve-ai/sandbox
28. LangChain integration post (10 Aug 2026): https://www.linkedin.com/posts/pavitrabhalla_github-superserve-ailangchain-superserve-activity-7492685253539635200-x9XI
29. Launchpad listing: https://launchpad.ms/projects/superserve
30. Blog, Cursor Cloud Agents on Superserve (1 Oct 2026): https://www.superserve.ai/blog/cursor-cloud-agents-on-superserve/
31. ComputeSDK burst TTI leaderboard: https://www.computesdk.com/benchmarks/sandboxes/burst-tti and https://www.computesdk.com/benchmarks/sandboxes/burst-tti/superserve
32. Blog index: https://www.superserve.ai/blog/
33. OpenAI Agents SDK PR #3502 [BG]: https://github.com/openai/openai-agents-python/pull/3502
34. Show HN: https://news.ycombinator.com/item?id=48999489
35. Claude Managed Agents announcement [BG]: https://www.superserve.ai/blog/claude-managed-agents-on-superserve/
36. ComputeSDK docs: https://docs.computesdk.com/
37. devtoolarena (cited by Superserve, not fetched): https://devtoolarena.com/codex/api
38. Superserve LinkedIn company page: https://linkedin.com/company/super-serve-ai
