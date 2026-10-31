# Superserve: GitHub and code reality (angle 03)

Researched 2026-10-29 for Haunted Hacks (Sat 2026-10-31). Method: `gh` CLI against the `superserve-ai` org, shallow clones of `superserve-ai/superserve` and `superserve-ai/sandbox` read locally, npm/PyPI registry APIs, and `gh search code` for downstream users. Every claim cites a URL. **[Verified]** means I read it in the repo, registry, or API response. **[Inference]** means it is my reading of code or docs and has not been tested against the live service.

---

## 1. What Superserve actually is (checked against the code)

- **[Verified]** The org description is "Virtual machines for long-horizon agents". The main repo's GitHub description is "Sandbox infrastructure for AI Agents", and its README says "Persistent and secure sandboxes for AI Agents, powered by Firecracker microVMs." ([org](https://github.com/superserve-ai), [README](https://github.com/superserve-ai/superserve))
- **[Verified]** The product is a hosted **sandbox API**. You create a Firecracker microVM, run commands (sync, streaming, or interactive sessions), read and write files, pause and resume (memory, processes, and filesystem are checkpointed), snapshot and fork, build custom templates from OCI images, publish preview URLs for ports, set egress allow/deny rules, keep an HTTP(S) egress log, use brokered secrets (the real key never enters the VM), and drive a desktop for computer use (XFCE + noVNC + Chrome). ([docs/introduction.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/introduction.mdx), [docs/sandbox/](https://github.com/superserve-ai/superserve/tree/main/docs/sandbox))
- **[Verified] Background: it is a pivot.** The repo was created 2025-10-10 as a Ray-based agent-serving framework ("RayAI"). Closed issues from Nov 2025 to Feb 2026 are about `rayai serve`, Ray Serve workers, and LangGraph adapters ([issues #16–#76](https://github.com/superserve-ai/superserve/issues?q=is%3Aissue+is%3Aclosed)). On 2026-02-13, commit "refactor: remove legacy Ray/LangChain code and restructure for hosted platform (#109)" removed that code. The sandbox product arrived around 2026-04-03 ("CLI and SDK Updated for Sandbox (#157)"). A blog post or tutorial older than about April 2026 probably describes the old product.
- **[Verified]** It is not a Durable Objects or actor runtime, and it is not a messaging bus. Its closest competitors are E2B, Daytona, Vercel Sandbox, and **Freestyle, which is a co-sponsor of this same event**. The third-party `opencoredev/sandbox-sdk` README lists Superserve as one provider among E2B, Vercel, Daytona, Upstash, Freestyle, and others ([repo](https://github.com/opencoredev/sandbox-sdk)). **[Inference]** Two sandbox sponsors at one event means a project should give each a distinct job (for example Freestyle for one workload and Superserve VMs for desktop/computer use) rather than using them interchangeably.

## 2. Org and repo inventory (snapshot 2026-10-29)

| Repo | Stars | Forks | Last push | Lang | License | Notes |
|---|---|---|---|---|---|---|
| [superserve](https://github.com/superserve-ai/superserve) | 475 | 55 | 2026-10-30 (UTC) | TS | Apache-2.0 | Monorepo: TS SDK, Python SDK, CLI, Next.js console, Mintlify docs, e2e tests |
| [sandbox](https://github.com/superserve-ai/sandbox) | 15 | 7 | 2026-10-30 | Go | **OCVSAL 1.0 (source-available, production use needs a commercial agreement)** | Control plane, `vmd` (Firecracker orchestrator), `boxd` guest agent, Supabase/Postgres migrations |
| [langchain-superserve](https://github.com/superserve-ai/langchain-superserve) | 28 | 4 | 2026-06-26 | Py | MIT (PyPI badge) | Deep Agents/LangGraph backend; PyPI version is still **0.0.1** |
| [firecracker](https://github.com/superserve-ai/firecracker) (fork) | 7 | 1 | 2026-10-16 | Rust | | |
| [sandtrace](https://github.com/superserve-ai/sandtrace) | 4 | 2 | 2026-03-27 | Rust | | "Hypervisor-level audit trails" (stale) |
| [canaries](https://github.com/superserve-ai/canaries) | 1 | 1 | 2026-10-29 | Go | | Lifecycle canaries for `production/us-central1`, `us-east4`, `us-west2` |
| [reproducible-runs](https://github.com/superserve-ai/reproducible-runs) | 1 | 0 | 2026-10-06 | Py | | The only standalone official example repo |
| supervibe, qm, computesdk, harbor, openai-agents-python, ray (forks or experiments) | 0–1 | | | | | `supervibe` = Cloudflare vibesdk re-platformed onto "Vercel + Supabase + Superserve" (Jul 2026, Phase 1) |

Source: `gh repo list superserve-ai` output; [org page](https://github.com/superserve-ai). The org has 17 public repos and 21 followers.

**Contributors, main repo, all-time ([API](https://api.github.com/repos/superserve-ai/superserve/contributors)):** meAmitPatil 133, nirnejak 54, pavitrabhalla 43, awille-ai 39, mohamedsobhi777 16, replicas-connector[bot] 8, then single digits. The team is small and core. One external PR author was active in Sep–Oct (Prajwal2246: MCP fixes [#356](https://github.com/superserve-ai/superserve/pull/356), [#378](https://github.com/superserve-ai/superserve/pull/378)).

**Sandbox infra repo, commits since 2026-08-01:** 609. Authors: awille-ai/Alejandro Wille 333, Amit Patil 185, Pavitra Bhalla 50, replicas-connector[bot] 37 (from local `git log`). The engineering effort sits in the infra repo, not the public SDK repo.

## 3. Release cadence (last 90 days)

**[Verified]** Tags come from `git for-each-ref` in the clone. The TS and Python SDKs ship in lockstep with the same version numbers:

| Date | Release |
|---|---|
| 2026-08-21 | SDK 0.8.3 (`Sandbox.list` status/limit/offset) |
| 2026-09-14 | SDK 0.9.0: **breaking-ish**, `pause()` now waits for the 202 to settle ([#333](https://github.com/superserve-ai/superserve/pull/333)) |
| 2026-09-16 → 10-02 | 0.9.1–0.9.3 (retry self-clearing 409 on delete, pooled HTTP client in Python, snapshots + forks [#351](https://github.com/superserve-ai/superserve/pull/351)) |
| 2026-10-06 | 0.10.0 → 0.11.0 the same day: **desktop / computer-use namespace** + MCP computer tool ([#309](https://github.com/superserve-ai/superserve/pull/309), [#372](https://github.com/superserve-ai/superserve/pull/372)) |
| 2026-10-08 → 10-16 | 0.11.1–0.11.4 (desktop step tuning, JPEG frames, abort-safe spawn [#385](https://github.com/superserve-ai/superserve/pull/385)); MCP 0.3.3 tagged 10-16 |
| 2026-10-22 | **New TS CLI `@superserve/cli` 2.0.0** ([#409](https://github.com/superserve-ai/superserve/pull/409)), Homebrew tap |
| 2026-10-26 | CLI 2.1.0: browser device-code signup/login from the CLI ([#432](https://github.com/superserve-ai/superserve/pull/432)) |
| 2026-10-29 | SDK **0.11.5** (run commands as a specific `user`, [#455](https://github.com/superserve-ai/superserve/pull/455)), CLI 2.1.1 (MCP is still 0.3.3 from Oct 16) |

Registry check on 2026-10-29: npm `@superserve/sdk` 0.11.5, `@superserve/cli` 2.1.1, `@superserve/mcp` 0.3.3; PyPI `superserve` 0.11.5 (requires Python >=3.9). ([npm sdk](https://www.npmjs.com/package/@superserve/sdk), [PyPI](https://pypi.org/project/superserve/))

Downloads: npm `@superserve/sdk` had 39,056 in 2026-09-29..10-28 ([npm API](https://api.npmjs.org/downloads/point/last-month/@superserve/sdk)). PyPI `superserve` had 14,503 last month and 4,192 last week ([pypistats](https://pypistats.org/api/packages/superserve/recent)). `@superserve/cli` had 394 because it is a week old. The 39k npm figure is far larger than 475 stars would suggest. **[Inference]** It is likely driven by programmatic consumers such as YC's `qm` (section 6) and CI, not by many individual developers.

**What the cadence means:** a release lands every 1–3 days in October. The API surface moved during the month you will use it: desktop arrived Oct 6, the CLI was rewritten Oct 22, run-as-user came Oct 29. LLM coding assistants have essentially no training data on this SDK. Paste the docs into context; section 8 explains how.

## 4. What the last 90 days of commits say (Aug–Oct 2026)

Main repo: 108 commits since 2026-08-01, 74 of them in October ([commits](https://github.com/superserve-ai/superserve/commits/main)). Themes, roughly by volume:

1. **Billing and plans, the dominant theme in late October.** Stripe billing UI (Aug 20), Developer/Pro plans, a no-card trial, and low-credit banners ([#449](https://github.com/superserve-ai/superserve/pull/449), [#450](https://github.com/superserve-ai/superserve/pull/450), [#452](https://github.com/superserve-ai/superserve/pull/452), [#457](https://github.com/superserve-ai/superserve/pull/457) "hide Starter from new purchases", all Oct 27–29). There are **41 open PRs** (re-counted 2026-10-29 via `gh pr list`; an earlier draft said 21). About 22 of them are billing/console/pricing-v2 work opened Oct 23–29 by awille-ai or the replicas-connector bot; the rest are older docs/feature PRs back to June ([open PRs](https://github.com/superserve-ai/superserve/pulls)). In the infra repo, Oct 26–29 is almost entirely `fix(billing): …` commits plus a revert on Oct 27 ("Revert 'billing: raise Free and legacy pay-as-you-go caps…'").
2. **Signup abuse defenses.** reCAPTCHA Enterprise (Aug 27–28), Fingerprint device identity (Sep 1), Cloudflare Turnstile ephemeral IDs (Sep 8, Sep 17), "Block known abusive signup identities" (Sep 27). The infra repo also mentions crypto-mining containment: "fix(network): preserve host control replies during mining containment (#652)", Oct 7.
3. **YC-specific flows.** "add guarded YC acceptance and review journeys (#403)" and "configure YC verification website origin (#404)" (Oct 22). The Developer/Pro launch runbook describes a **YC coupon that makes a Pro first invoice $0** ([developer-pro-launch.md](https://github.com/superserve-ai/sandbox/blob/main/scripts/billing/developer-pro-launch.md)).
4. **Computer use / desktop** (Oct 5–16), in the SDK, MCP, and infra (`boxd` persistent X11 backend, Step RPC).
5. **Guest runtime fixes that changed behavior very recently** (infra repo):
   - Oct 17: "boxd: create /dev/fd and standard stream links at startup (#681)". Before this, process substitution and `/dev/stdin`-style paths could break.
   - Oct 19: "network: apply customer egress rules to TCP on non-proxy ports (#723)". Egress rules used to cover fewer ports.
   - Oct 21: "fix(builder): mount /dev/shm in the guest init (#778)". This matters for Chrome/Playwright and Python multiprocessing.
   - Oct 22: `superserve/base` now ships Python 3.12, Node 22, and build tools (#787).
   - Oct 27: proxy routing warmup and health-probe fixes (#831, #832).
   - **Oct 28: "guest: resolve localhost and the hostname, and keep what the image ships in /tmp and /run (#824)".** Until two days before the event, `localhost` resolution inside sandboxes was apparently broken or partial.
   - Oct 28: templates now honor the image's `USER`/`ENV`/`WORKDIR` (#846). Curated templates were standardized to 2 vCPU / 4 GiB / 8 GiB (#836).

## 5. Issues and discussions: bugs, sharp edges, missing features

The issue tracker is small: 5 open issues, about 27 closed. Discussions are enabled but nearly unused (1 discussion total via GraphQL). GitHub's `open_issues_count` (46 on re-check) counts PRs too ([issues](https://github.com/superserve-ai/superserve/issues)). The sandbox infra repo shows 84–85 "open issues" by the same API, but its listed issues are a few closed boxd bug reports (#289 nil-pointer panic in exec events, #291 ENOSPC swallowed on upload, both closed in Jul). The team tracks work internally, so **the public tracker is a weak signal of real bug volume**.

Open items relevant to a hack:
- [#327](https://github.com/superserve-ai/superserve/issues/327) (Sep 8) "Add Superserve sandbox support for OpenAI Agents SDK". A native `BaseSandboxClient` adapter is **not merged**. Community [PR #332](https://github.com/superserve-ai/superserve/pull/332) has been open since Sep 10. The docs' OpenAI Agents page wraps `sandbox.commands.run` as a plain function tool instead ([openai-agents-sdk.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/integrations/agent-harnesses/openai-agents-sdk.mdx)).
- [#377](https://github.com/superserve-ai/superserve/issues/377) (Oct 8) "MCP: reject malformed base64 before writing sandbox files". The fix PR #378 is unmerged, so file writes through the MCP with bad base64 can produce corrupt files.
- [#307](https://github.com/superserve-ai/superserve/issues/307) (Aug 6) the console exposes raw Next.js server errors (fix PR #323 is unmerged).
- Long-open PRs that signal missing features: [#233](https://github.com/superserve-ai/superserve/pull/233) `Sandbox.create({ image })` sugar (draft since Jun 22). Today you must build a **template** first. [#306](https://github.com/superserve-ai/superserve/pull/306) pre-warming the data-plane connection (open since Aug 5). [#286](https://github.com/superserve-ai/superserve/pull/286) Pi coding-agent extension (draft). [#302](https://github.com/superserve-ai/superserve/pull/302) computer-use cookbook (draft).
- Recently closed: [#355](https://github.com/superserve-ai/superserve/issues/355) MCP network-log pagination returned a cursor that could not fetch the next page (fixed Oct 5). [#329](https://github.com/superserve-ai/superserve/issues/329) MCP dev watcher deleted `dist/http.js` (fixed Sep 22). [#321](https://github.com/superserve-ai/superserve/issues/321) two setup gaps on a fresh clone.

**No Mastra, Supabase, Terse, Agent Relay, or Freestyle integration exists.** I grepped the docs and SDK sources for those names. The only Supabase link is that the infra stores its schema as `supabase/migrations` ([sandbox README](https://github.com/superserve-ai/sandbox)). `gh search code superserve --repo mastra-ai/mastra` returned nothing.

## 6. Official examples and community projects

**Official:**
- Docs cookbook and integration pages (in-repo Mintlify): Claude Code, Codex, OpenCode, KiloCode, Claude Agent SDK, OpenAI Agents SDK, LangChain, Agno, OpenClaw, Hermes, Cursor Cloud Agents, Claude Managed Agents, plus a "software-factory" cookbook. Storage guides cover Archil, Mesa, and cloud buckets ([docs tree](https://github.com/superserve-ai/superserve/tree/main/docs)).
- System templates: `superserve/base`, `python-3.11`, `node-22`, `python-ml`, `code-interpreter`, `claude-code`, `openclaw`, `hermes`, `omnara`, `desktop` ([templates/overview.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/templates/overview.mdx)).
- [reproducible-runs](https://github.com/superserve-ai/reproducible-runs): checkpoint, resume, and restore demo in Python.
- MCP server: `npx -y @superserve/mcp` or hosted at `https://mcp.superserve.ai` ([mcp.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/integrations/mcp.mdx)).

**Third-party code that imports the SDK** (`gh search code`, 2026-10-29):
- **[yc-software/qm](https://github.com/yc-software/qm)**, 15,576 stars, pushed 2026-10-30, "Multiplayer agent harness for work". It has `src/sandbox/superserve-client.ts`, `superserve/templates/qm-agent.ts`, and a [docs/superserve.md](https://github.com/yc-software/qm/blob/main/docs/superserve.md) ("using Superserve for agent sandboxes"). Superserve keeps a fork ([superserve-ai/qm](https://github.com/superserve-ai/qm)) and has open "QM Cloud" console PRs (#335, #336, #340). **[Inference]** This is the most important adoption signal. It is YC's own tooling, and it explains the YC-specific billing flows.
- [openma-ai/open-managed-agents](https://github.com/openma-ai/open-managed-agents), 344 stars: has a `packages/managed-runtime-superserve` package.
- [computesdk/computesdk](https://github.com/computesdk/computesdk), 285 stars: has a `packages/superserve` provider.
- [opencoredev/sandbox-sdk](https://github.com/opencoredev/sandbox-sdk), 78 stars: Superserve provider listed beside E2B, Daytona, Vercel Sandbox, and Freestyle.
- [agno-agi/agno](https://github.com/agno-agi/agno): `libs/agno/agno/tools/superserve.py` with a cookbook entry.
- I found no hackathon projects or indie demos built on Superserve on GitHub. `gh search repos superserve` returned only the org repos and unrelated "SuperServer" projects.

## 7. Plans, quotas and limits in code (these matter on Oct 31)

From the Developer/Pro launch runbook ([developer-pro-launch.md](https://github.com/superserve-ai/sandbox/blob/main/scripts/billing/developer-pro-launch.md)) and the event-credit runbook added **2026-10-29** ([event-credit.md](https://github.com/superserve-ai/sandbox/blob/main/scripts/billing/event-credit.md), [commit 4ca587f](https://github.com/superserve-ai/sandbox/commit/4ca587fc6a537fa067d2f6eaf40d26bcf23bab84)):

- **[Verified, runbook values; NOT what the public pricing page shows]** Developer: $20/mo with $20 included credit, prepaid, auto top-off, **max 100 concurrent sandboxes**, 4 vCPU / 16 GiB per sandbox. Pro: $250/mo, **2,000 concurrent**, 16 vCPU / 64 GiB.
- **[Verified, live page fetched 2026-10-29]** The public [pricing page](https://www.superserve.ai/pricing) still shows a different (older or current-production) catalog: **Free** $0, "$5 to start, plus $95 when you add billing", up to **20 concurrent** sandboxes, up to 2 vCPU / 2 GiB / 8 GiB; **Pro** $1,000/mo billed annually ($1,200 billed monthly per the page's structured data) with $1,000 metered usage included, up to 1,000 concurrent, 16 vCPU / 64 GiB / 64 GiB; **Enterprise** custom/self-host. Usage rates: **$0.0504 per vCPU-hour, $0.0162 per GiB-hour**, billed per second while running. **[Inference]** The Developer/Pro $20/$250 catalog is the "pricing v2" that the open console PRs (#411, #420, #424) put behind flags; which catalog a new signup sees on Oct 31 is unknown. At the curated 2 vCPU / 4 GiB shape, list rates come to about $0.166 per sandbox-hour, so $100 of credit is roughly 600 sandbox-hours, which is plenty for a 5-hour hack.
- **[Verified, runbook value; production config not observable]** New-signup **trial: `credit_usd` 0.05, `max_sandboxes` 1**. When trial credit runs out, sandboxes pause and the console shows a plan picker.
- **[Verified]** The event-credit script exists to grant per-team credits for an event. The doc's example is "100" per team, which matches the event's "$100 Superserve credits per attendee". Routing: **new-signup trial teams → extra trial credit; Developer/Pro teams → Stripe billing credit grant; Free → REFUSED ("upgrade to Developer first"); legacy pay-as-you-go/Starter → REFUSED ("Unverified, under test").** The input is a CSV of `team_id,amount_usd` run manually by staff, so **credits are applied by Superserve staff to specific team IDs, not by a code you redeem.** A team that reached Developer through "a 100%-off Developer checkout" gets 80, because the plan's $20 included credit makes it 100.
- **[Verified, added 2026-10-29 in [#857](https://github.com/superserve-ai/sandbox/commit/d9e65fa434773937a88fe1f9a7baf6a7e1d03f7e)] Upgrading during the trial forfeits leftover trial credit, including event credit.** Paid activation "zeroes `remaining_usd` on every signup trial grant, including event and manual top-up grants." The runbook says "the event copy tells participants that upgrading during the trial drops leftover trial credit and that staff restore it", and staff run `--report` / `--restore` "once a day during the event, and once after it ends". It also refers to "the event's 100%-off first-month code" for Developer, and notes that those participants "pay the 20 USD monthly fee from their second month". So: (a) an event Developer code apparently exists; (b) if you upgrade mid-hack, your credit disappears until staff restore it, which may be hours later; (c) cancel the Developer plan after the event unless you want to pay $20/mo. The doc does not name this event, so all of this is (unverified) for Haunted Hacks specifically.
- **[Inference, important]** A trial team that receives event credit keeps the trial's frozen limits ("A team's credit and limits are frozen when its trial starts"). That likely means **1 concurrent sandbox**; the trial top-up SQL adds a grant row and does not touch `max_sandboxes`. If your design needs several agent VMs at once, you probably need the Developer plan via the event's 100%-off first-month code. Upgrade **before** staff apply the $100 (or accept a forfeit-then-restore delay; see above). Ask the Superserve rep on the morning of the event.
- **[Verified, docs]** Template shape limits: Free max 2 vCPU / 4096 MiB / 8192 MiB disk; Pro max 16 / 65536 / 65536. Sandboxes inherit their shape from the template and **cannot override it per sandbox** ([build-spec.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/templates/build-spec.mdx)).
- **[Verified, docs]** Snapshots: 100 per team, 20 per sandbox, 4 in flight at once ([snapshots.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/snapshots.mdx)). Network and audit logs keep 7 days (#348).
- **[Verified, code]** Regions: API keys are `ss_live_<region>_<32 chars>`. `use` maps to `api.superserve.ai`/`sandbox.superserve.ai` and `usw` maps to `api-usw.superserve.ai`/`usw-sandbox.superserve.ai`. The SDK derives the region from the key ([config.ts](https://github.com/superserve-ai/superserve/blob/main/packages/sdk/src/config.ts)).

## 8. Concrete gotchas a 5-hour team will hit

Each is tied to a code or doc line. Code-reading items are marked [Inference].

1. **`commands.run()` without `timeoutMs` gets a 30 s client-side abort.** [Inference, code] `commands.ts` passes `timeoutMs: undefined` when you omit it, and `http.ts` destructures `timeoutMs = DEFAULT_TIMEOUT_MS` (30,000). A JS default applies when the value is `undefined`. `npm install`, `pip install`, or an agent loop inside `run()` will throw `TimeoutError` at 30 s. Always pass `timeoutMs` (TS, **milliseconds**) or `timeout_seconds` (Python, **seconds**). The docs warn about the unit mismatch ([commands/overview.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/commands/overview.mdx)). For long jobs, use streaming: its idle timer resets on every output chunk ([streaming.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/commands/streaming.mdx)).
2. **POST and PATCH are never retried by the SDK** (only GET and DELETE; see the comment in `http.ts`). A transient 502 on `Sandbox.create` or `commands.run` reaches your code, so wrap the calls in your own retry.
3. **Output has two caps.** The client buffers at most 10 MiB per non-streaming `run()` (`MAX_EXEC_RESPONSE_BYTES`, overridable with `maxOutputBytes`); exceeding it **throws `ValidationError`** (per `types.ts`/`http.ts`), and you do not get a partial result. Separately, the server sets `truncated: true` (and appends a notice to stderr) when combined output passed its own retention cap. Handle both: catch the error, check the flag, and stream or redirect to a file for large output.
4. **Python `spawn()` (interactive sessions) is async-only.** The sync `Sandbox.commands.spawn()` raises. TS `spawn()` needs Node 22+ or a `ws` polyfill because it uses WebSocket ([sessions.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/commands/sessions.mdx)).
5. **Preview ports must be published explicitly.** New sandboxes default to strict `public`, and only ports you publish are reachable. Call `publishPreviewPort(3000)` after starting the server, bind to `0.0.0.0`, and use ports 1024–65535 except 49983. Signed browser links default to **60 s**, so mint them just before the demo or pass `expiresInSeconds` ([preview-urls.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/preview-urls.mdx)).
6. **Deny-all egress also blocks DNS.** If you use `denyOut: ["0.0.0.0/0"]`, add `1.1.1.1/32` and `8.8.8.8/32` to `allowOut`. `*.example.com` does not match the apex domain. Network rules cannot be updated on a paused sandbox (`ConflictError`) ([networking.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/networking.mdx)).
7. **Auto-pause (`timeoutSeconds`) counts active time, not idle time.** A long agent run is paused mid-task when the window ends. Leave it unset during the demo, or size it generously. Pair it with `autoDeleteSeconds` so you do not leak VMs and burn credit ([lifecycle.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/lifecycle.mdx)).
8. **Custom images need a template build first.** `Sandbox.create({ image })` is not shipped (PR #233 is still a draft). Template builds must be `linux/amd64`, have `/bin/sh`, and can take minutes, with `readyCmd` polled for up to 10 min. Teams have concurrent-build and template-count caps (`too_many_builds`, `too_many_templates`). Free/Starter "zero-template" enforcement is in flight ([PR #435](https://github.com/superserve-ai/superserve/pull/435)). **Use a system template** such as `superserve/base` or `superserve/node-22` and install at runtime, or build your template before 11:00 if your plan allows templates.
9. **Forked or snapshotted processes keep stale secrets.** Restart any process that uses brokered secrets after a fork ([snapshots.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/snapshots.mdx)).
10. **Desktop input is not idempotent.** On a transport error the click or keypress may already have been delivered, so take a screenshot before retrying. The desktop stream URL on a `private` sandbox carries a 60 s credential ([desktop.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/desktop.mdx)).
11. **Non-Node runtimes.** [Inference, code] `resolveConfig` reads `process.env.SUPERSERVE_BASE_URL` with no guard unless you pass `baseUrl` explicitly. In a runtime without a `process` global (a Workers-style isolate without Node compat, which could include an actor runtime like Terse's; untested), pass **both `apiKey` and `baseUrl`**, or run the SDK in a plain Node server or route. Never ship the API key to the browser.
12. **Behavior changed this week.** The localhost/hostname fix (Oct 28), `/dev/shm` (Oct 21), image USER/ENV/WORKDIR now honored (Oct 28), and run-as-`user` (SDK 0.11.5, Oct 29) are all new. Pin `@superserve/sdk@0.11.5` / `superserve==0.11.5`. If something odd happens, check `git log` on the infra repo before debugging your own code.
13. **Signups from the venue may trip abuse checks.** [Inference] Signup runs through reCAPTCHA Enterprise, Fingerprint device signals, and Cloudflare Turnstile, plus "known abusive identity" blocking (Aug–Sep commits). Dozens of signups from one venue IP in an hour is the pattern those systems watch for. **Sign up from home before Saturday.**
14. **Billing code is in heavy flux.** About 22 open billing/console PRs, an Oct 27 revert ("billing: raise Free and legacy pay-as-you-go caps…"), a public pricing page that disagrees with the runbook catalog, and the trial launched Oct 28 (date from commit log, not re-verified). Expect odd console states (plan picker, low-credit banners). Have the API key in `.env` before the event so you do not depend on the console mid-hack.
15. **LLM assistants will hallucinate this API.** The SDK is about six months old and changed weekly. Use the docs MCP from the docs site menu ("add our docs as an MCP server", [introduction.mdx](https://github.com/superserve-ai/superserve/blob/main/docs/introduction.mdx)), or have the agent use `@superserve/mcp` directly.

## 9. Limits / could not verify

- **Production trial values.** The $0.05 trial credit and 1-sandbox cap come from a runbook's "public values" table. I cannot see the production DB, and the runbook says the values come from "the approved launch record".
- **How the event's $100 will be delivered.** The event-credit script is staff-run against team IDs. The page does not say whether attendees submit emails, team IDs, or a form. The example label `event-2026-11-01` is just an example and may not refer to this event.
- **Star history.** The GitHub stargazer timestamp API returned 404 and the GraphQL query returned nothing, so I could not chart stars by month. 475 is a point-in-time count.
- **Uptime and incidents.** The `canaries` repo shows monitored regions, but I found no public status page or incident history in the repos.
- **The 30 s `run()` timeout, the `process.env` crash, and the trial-credit-keeps-1-sandbox behavior** are code or doc readings and have not been tested live (no API key was used).
- Social sentiment, pricing pages, and founders are out of scope for this angle; other agents cover them.

---

## Hackathon implications

**What Superserve is good for in a "Real-Time AI + Halloween" build that must use Durable Actors and/or Agent Relay:**
- **Use Superserve as the "hands" and Terse or Agent Relay as the "brain and wiring".** A Durable Actor (one per agent or per room) holds state and decides actions. It calls Superserve (from a Node service if the actor runtime lacks Node globals) to run code, browse, or drive a desktop. Agent Relay carries the agent-to-agent chatter. That arrangement earns both host bonuses and makes Superserve visibly essential.
- **The most demo-able primitive is the desktop / computer-use stream** (`superserve/desktop` + `desktop.getStreamUrl({ viewOnly: true })`). Projecting a live noVNC view of a "possessed" Chrome while the agent drives it is real-time AI judges can see. A second option is **fork-on-snapshot**: "summon N clones of a haunted session" (`snapshot()` then fork). That is a strong visual, but the trial plan's single sandbox may block it (see below).
- **Supabase "scale to millions" angle:** pause/resume plus auto-delete is the cost story ("idle agents cost zero compute"). Pro allows 1,000 concurrent sandboxes on the public pricing page (2,000 in the unreleased v2 runbook). This is a talking point, not a proof.

**Setup to do before Oct 31:**
1. Each teammate signs up at console.superserve.ai **from home**, via the CLI (`@superserve/cli`, device-code login, CLI 2.1.0+) or the web. **Do not choose Free.** Free teams are refused event credit.
2. Create an API key (`ss_live_…`), put it in `.env`, and run the quickstart once: create, `run("echo hi")`, `kill`.
3. Pin `@superserve/sdk@0.11.5` or `superserve==0.11.5`. Wrap `run()` in a helper that always sets `timeoutMs` and retries POSTs.
4. Spike the exact path you will use: preview port publish plus a signed URL, or the desktop stream URL. Time `Sandbox.create` from the venue Wi-Fi if you can.
5. Add the Superserve docs MCP and/or `@superserve/mcp` to Claude Code or Cursor so codegen uses the real API.
6. On Saturday morning, ask the Superserve rep: (a) how the $100 is applied (team ID? email?), (b) whether trial teams stay capped at 1 concurrent sandbox, and (c) for the 100%-off first-month Developer code the runbook mentions. The answers decide single-VM vs multi-VM architecture. If you take the Developer code, **redeem it before your team ID is credited**, because upgrading during the trial zeroes the event credit until staff restore it. Afterwards, cancel before month 2 ($20/mo).

**Gotchas to design around:** the 30 s default `run()` timeout, ms vs s timeout units, POST calls not retried, strict preview publishing, DNS under deny-all, active-time auto-pause during long runs, no `create({ image })`, 60 s signed-link expiry, and possibly 1 concurrent sandbox on trial plus credit.

**What the sponsor likely wants to see (inference from the commit focus):** agent harnesses and coding agents running inside Superserve VMs, computer use, and snapshots/forks. Those are the features they shipped in Sep–Oct and keep adding templates for (Claude Code, OpenClaw, Hermes, Omnara, desktop). A project that makes one of those features central and visible fits their roadmap. They have no Mastra or OpenAI Agents SDK native adapter yet (issue #327 is open), so a small clean adapter used in your project is a credible bonus.

## Sources

- https://github.com/superserve-ai (org)
- https://github.com/superserve-ai/superserve (README, docs/, packages/sdk/src/{config,http,commands}.ts)
- https://github.com/superserve-ai/superserve/commits/main
- https://github.com/superserve-ai/superserve/releases
- https://github.com/superserve-ai/superserve/issues and /pulls (#233, #286, #302, #306, #307, #321, #323, #327, #329, #332, #333, #351, #355, #356, #377, #378, #409, #432, #435, #449–#457)
- https://github.com/superserve-ai/superserve/blob/main/docs/introduction.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/quickstart.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/lifecycle.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/create.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/preview-urls.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/networking.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/snapshots.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/sandbox/desktop.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/templates/overview.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/templates/build-spec.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/commands/overview.mdx, streaming.mdx, sessions.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/integrations/mcp.mdx
- https://github.com/superserve-ai/superserve/blob/main/docs/integrations/agent-harnesses/openai-agents-sdk.mdx
- https://github.com/superserve-ai/sandbox (README, LICENSE, commit log)
- https://github.com/superserve-ai/sandbox/blob/main/scripts/billing/event-credit.md
- https://github.com/superserve-ai/sandbox/blob/main/scripts/billing/developer-pro-launch.md
- https://github.com/superserve-ai/sandbox/commit/4ca587fc6a537fa067d2f6eaf40d26bcf23bab84
- https://github.com/superserve-ai/sandbox/commit/d9e65fa434773937a88fe1f9a7baf6a7e1d03f7e (#857, trial-credit forfeit/restore)
- https://www.superserve.ai/pricing (fetched 2026-10-29)
- https://github.com/superserve-ai/superserve/blob/main/packages/sdk/src/types.ts (maxOutputBytes / truncated semantics)
- https://github.com/superserve-ai/langchain-superserve
- https://github.com/superserve-ai/reproducible-runs
- https://github.com/superserve-ai/canaries
- https://github.com/superserve-ai/supervibe
- https://github.com/yc-software/qm and https://github.com/yc-software/qm/blob/main/docs/superserve.md
- https://github.com/openma-ai/open-managed-agents
- https://github.com/computesdk/computesdk
- https://github.com/opencoredev/sandbox-sdk
- https://github.com/agno-agi/agno (libs/agno/agno/tools/superserve.py)
- https://www.npmjs.com/package/@superserve/sdk ; https://api.npmjs.org/downloads/point/last-month/@superserve/sdk
- https://pypi.org/project/superserve/ ; https://pypistats.org/api/packages/superserve/recent
- /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md (credits: $100 Superserve per attendee; $1k in grand prize)

## Verification log (2026-10-29)

An adversarial re-check against live sources: `gh api` and fresh partial clones of both repos, the npm/PyPI/pypistats APIs, and a direct fetch of superserve.ai/pricing. Each item lists the claim and what was found.

1. **Repo stats (475 stars / 55 forks / Apache-2.0; sandbox 15 / 7 / OCVSAL 1.0; org 17 repos, 21 followers).** CONFIRMED. The main repo's last push is 2026-10-30 UTC, so the table was updated. The OCVSAL text reads "Using software ... in production requires a valid commercial agreement". Added the GitHub description "Sandbox infrastructure for AI Agents".
2. **Pivot dates (#109 on 2026-02-13, #157 on 2026-04-03, repo created 2025-10-10).** CONFIRMED from `git log` and the API `created_at`.
3. **Release tags and dates (0.8.3 Aug 21, 0.9.0 Sep 14, 0.10/0.11 Oct 6, CLI 2.0.0 Oct 22, 2.1.0 Oct 26, SDK 0.11.5 Oct 29).** CONFIRMED. **CORRECTED:** MCP 0.3.3 was tagged Oct 16, not Oct 29.
4. **Registry versions and downloads (sdk 0.11.5, cli 2.1.1, mcp 0.3.3, PyPI 0.11.5 >=3.9; 39,056 npm/month; 14,503 / 4,192 PyPI; langchain-superserve 0.0.1).** CONFIRMED, exact match.
5. **Commit counts (main 108 since Aug 1 / 74 in Oct; infra 609, awille-ai+Alejandro Wille 333, Patil 185, Bhalla 50, bot 37).** CONFIRMED.
6. **Open PRs "21, ~17 billing".** REFUTED. `gh pr list` shows 41 open, about 22 of them billing/console/pricing-v2 PRs from Oct 23–29. Fixed in sections 4 and 8.
7. **"Discussions are not used".** CORRECTED. Discussions are enabled and hold 1 discussion. `open_issues_count` is now 46.
8. **Issue/PR states (#327, #332, #377, #378, #307, #323 open; #233, #286, #302 draft; #306, #435 open; #355 closed; #409/#432/#455/#457 merged).** CONFIRMED.
9. **SDK code gotchas: 30 s default via `timeoutMs: undefined`, POST/PATCH never retried, `ss_live_<region>_<32>` with use/usw hosts, `process.env` read only when `apiKey`/`baseUrl` are omitted (`??` short-circuit).** CONFIRMED in `http.ts`, `commands.ts`, and `config.ts`.
10. **"Beyond 10 MiB you get `truncated: true`".** REFUTED. Exceeding the client cap throws `ValidationError`, and `truncated` is a separate server-side flag. Gotcha 3 was rewritten.
11. **Doc limits (preview ports 1024–65535 except 49983, 60 s signed links; snapshots 100/20/4; template Free 2/4096/8192, Pro 16/65536/65536, no per-sandbox override; Python spawn async-only; DNS under deny-all; wildcard excludes apex; active-time auto-pause).** CONFIRMED in the docs .mdx files.
12. **Infra commits (#681 Oct 17, #723 Oct 19, #778 Oct 21, #787 Oct 22, #824/#836/#846 Oct 28, #652 Oct 7, the billing revert on Oct 27).** CONFIRMED.
13. **Plan values (Developer $20 / 100 concurrent; Pro $250 / 2,000; trial $0.05 / 1 sandbox; YC coupon $0 first invoice).** The values match the runbook. **But the live pricing page contradicts them** (Free with $5+$95 and 20 concurrent; Pro $1,000/mo annual or $1,200 monthly with 1,000 concurrent). Both are now labeled, and the 2,000 figure in the implications section was corrected.
14. **Event-credit mechanics (staff-run CSV, Free refused, 100%-off Developer path).** CONFIRMED, plus a detail: 100%-off Developer teams get 80. **ADDED (missing and decision-relevant):** #857 (Oct 29) documents that upgrading during the trial forfeits event credit, with a daily staff restore, an "event's 100%-off first-month code", and the $20 fee from month 2. The runbook does not name Haunted Hacks, so applying this to the event is (unverified).
15. **Third-party adopters (yc-software/qm 15,576 stars with `docs/superserve.md` and `src/sandbox/superserve-client.ts`; open-managed-agents 344; computesdk 285; sandbox-sdk 78; agno `tools/superserve.py`).** CONFIRMED (qm now shows 15,577). Added that the sandbox-sdk README lists **Freestyle**, a co-sponsor, as a sibling provider.
16. **Event-page facts ($100 Superserve credits per attendee; $1,000 Superserve credits in the grand prize).** CONFIRMED in EVENT_PAGE.md.

Not re-verified: the trial-launch date (Oct 28), the npm-download driver inference, and whether any of the runbook flows will be live for this event.
