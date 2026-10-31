# Freestyle (freestyle.sh): GitHub and code reality

Researched 2026-10-29/30 (times UTC) for Haunted Hacks, Oct 31 2026. Angle: what the public code, packages, issues and examples actually say, and what will bite a 5-hour team. Method: `gh` CLI against the `freestyle-sh` org and third-party repos, `npm view`/`npm pack` to read the published SDK source, the public OpenAPI spec, the docs' `llms.txt`/`.md` endpoints, and TLS/HTTP probes. Labels: **[verified]** means I read it in the source myself. **[inference]** means my interpretation. **[background]** means older than Aug 2026.

---

## TL;DR

1. **The platform was rebuilt in Aug 2026, and most public example code is now stale.** The `freestyle` npm SDK 0.2.0 (2026-08-21) targets a new `/v5` API that **only has VMs, snapshots, VPCs, firewall, TLS rules (domains), identities and customers**. Hosted Git repos, serverless deployments/runs and the `@freestyle-sh/with-*` runtime builders from 0.1.x do not exist in it. Freestyle's own Adorable source says it outright: *"VMs are the only primitive Adorable uses: there is no hosted git and no serverless deployment"* and *"`domains` on a VM and serverless deployments are both gone."* [verified]
2. **The core SDK is not open source on GitHub.** The npm package has no `repository` field, and none of the org's 49 public repos contains it. To read the code, run `npm pack freestyle` (MIT, ships `src/`). Its GitHub issue tracker is effectively empty, so the GitHub-issues signal about the current platform is thin. [verified]
3. **The SDK ships very fast.** There have been 30 publishes since 2026-08-07 (8 betas plus 0.2.0 to 0.2.21), and **0.2.21 went out 2026-10-29 23:02 UTC, two days before the hack.** Pin the exact version. [verified]
4. **Two defaults trip people up most:** `firewall` is **required** on `vms.create` and a VM gets **no outbound internet** unless you allow it, and `vm.exec` **times out after 30 s by default**. [verified in SDK source]
5. **Legacy hosts are dead.** `vm-api.freestyle.sh` / `*.vm.freestyle.sh` timed out on :443 from here on 2026-10-30. A third party (cmux) reported the legacy edge "hard-down" with an expired cert in late Aug. Any tutorial or repo that uses `*.vm.freestyle.sh` preview URLs or `freestyle-sandboxes` will not work. [verified probe + third-party report]

---

## 1. Org and repo inventory (as of 2026-10-30)

Org `freestyle-sh`: created 2024-04-15, 49 public repos, 103 followers. The org profile README is stale and still pitches "the cloud to manage AI Code", with deploy and git links to `docs.freestyle.sh` (that site now 308-redirects to `www.freestyle.sh/docs`). [verified]

| Repo | Stars / forks | Last push | What it is now |
|---|---|---|---|
| `Adorable` | 831 / 319 | 2026-08-25 | "Open Source Lovable". Moved to the v5 VM-only SDK on 2026-08-25 ("update to use new vms"). Next 16, AI SDK 6, `@mastra/mcp`. `adorable/package.json` declares `freestyle: ^0.2.2`; the **root** workspace `package-lock.json` pins **0.2.2**, but the nested `adorable/package-lock.json` is stale (still lists `freestyle-sandboxes ^0.1.28` and `@freestyle-sh/with-*`, no `freestyle` entry). The best official reference app. |
| `cloudstate` | 211 | 2026-03-15 | [background] Old JS object-persistence runtime. Its issues (2024) are about Map/Array gaps. Not part of the current product. |
| `freestyle-astro-template` | 46 | 2025-02 | [background] Deploy/cloudstate era. Obsolete. |
| `freestyle-auth` | 23 | 2024-06 | [background] Obsolete. |
| `rigkit` | 13 / 1 | 2026-09-03 | "Declarative dev environments, in TypeScript" (`rig` CLI) with a Freestyle VM provider. Releases v0.2.11 to v0.2.17 (May 2026), **v0.3.0 on 2026-09-02**. 246 commits by Ben2W. |
| `sandbox_sdks` | 11 | 2025-10-21 | [background] Old `freestyle-sandboxes` AI-framework adapters (Vercel AI SDK, LangGraph, Mastra). Pre-v5. |
| `freestyle-sh` | 10 | 2025-05 | [background] Old CLI. |
| `convex` | 1 | 2026-10-05 | `@freestyle-sh/convex`: manage Freestyle VMs from Convex actions (on `freestyle ^0.2.14`). Includes a "Workbench" agent demo with a persistent Jupyter VM and credential injection at the TLS edge. |
| `browser-bench` | 0 | 2026-09-08 | Hosted Chrome throughput demo on `freestyle 0.2.12`. Creates VMs, runs, and deletes them. Requires Node ≥ 22.22.2. |
| `freestyle-sync` | 1 | 2026-06-11 | Syncs cwd into a VM with snapshot diffing. Still on `freestyle ^0.1.60` (pre-v5). |
| `freestyle-with` | 1 | 2026-05-21 | Monorepo publish script for the `@freestyle-sh/with-*` packages. Pre-v5. |
| `freestyle-base-nextjs-shadcn` | 0 | 2025-09 | Template that Adorable clones into its base snapshot. |

Activity in the last 90 days is concentrated in Adorable (one migration burst on Aug 25), rigkit (Sept 2-3), convex (Sept 23 to Oct 5), browser-bench (Sept 8) and a `sqlx` fork. The real velocity is in the closed-source SDK. Contributors: Adorable is JacobZwang 149, theswerd 102, willothy 22. rigkit is Ben2W 246. The npm maintainers are jacobzwang, theswerd and ben2w. The contributor and maintainer counts are [verified]. Calling it a **three-founder codebase** is [inference]: willothy also contributes to Adorable.

## 2. The SDK: what actually ships

**`freestyle` (npm), the current SDK and CLI** [verified via `npm view` and `npm pack freestyle@0.2.21`]
- Description: "Freestyle SDK and CLI — manage VMs, snapshots, VPCs, domains, and identities". MIT, ESM-only (`"type":"module"`, import-only export map). Dependencies are just `ws`, `yargs`, `dotenv`. Node transport is HTTP/2 with a fetch fallback (browsers, Workers, Deno).
- Release cadence: 0.2.0-beta.0 on 2026-08-07, then **0.2.0 on 2026-08-21**, then 0.2.1 to 0.2.21. Gaps are often hours apart: 0.2.3 to 0.2.6 all shipped on 2026-08-27, and 0.2.18 to 0.2.20 within 70 min on 2026-10-14. The latest is **0.2.21 on 2026-10-29T23:02Z**.
- Downloads (npm API): 143,510 in the week of Oct 22-28. Monthly counts are Jul 89k, Aug 121k, Sep 190k, Oct (through the 28th) 353k. The deprecated `freestyle-sandboxes` still gets 32,671/week. Caveat: the `freestyle` package name dates from 2011, so a small share of those downloads may not be Freestyle's. [inference]
- `/v5` OpenAPI (`api.freestyle.sh/openapi.json`, 55 paths) has these resource families: `vms` (CRUD, `exec-await`, `fs/*` including chunked uploads, `pty` sessions, `pause`/`start`/`resize`/`snapshot`, `networks`), `snapshots`, `vpcs`, `tunnels`, `firewall/rules` (plus `evaluate`), `tls` (plus `forward-auth`), `domains`, `verifications`, `certificates`, `identities` (+tokens, +per-VM permissions), `customers`, `hardware`, `background-requests`. **There are no git, deploy, run or execute paths.** The `api.freestyle.sh` TLS cert CN is `beta-api.freestyle.sh`, so the v5 "beta platform" is now the main one.
- Docs index (`/docs/llms.txt`): Git now appears only as "use private Git repositories in a sandbox" (credentials injected at the edge) and "S3 as a Git remote". You run git inside the VM yourself. Relevant guides exist for OpenAI auth injection, Mastra sandboxes, Supabase in a sandbox, Next.js/Vite dev servers, Claude Code/Codex-style agents and web terminals.

**Legacy surface (do not use)** [verified]
- `freestyle-sandboxes` (145 versions, last 0.1.46 on 2026-04-12) is now **deprecated: "Please use freestyle instead."**
- `freestyle` 0.1.44 to 0.1.63 (last on 2026-06-05) was the bridge release. Its README still shows `freestyle.git.repos.create`, `freestyle.serverless.deployments.create`, `freestyle.serverless.runs.create`, `freestyle.domains.mappings.create`, `new VmSpec().with("node", new VmNodeJs())` and `gitRepos: [...]` on VM create. None of that is in 0.2.x.
- The `@freestyle-sh/with-*` family (nodejs, bun, deno, python, uv, ruby, postgres, opencode, dev-server, pty, ttyd, …) was last published 2026-04-21 and **depends on `freestyle ^0.1.46`**. Installing one next to `freestyle@0.2.x` pulls in a second, incompatible 0.1.x copy. [inference from the dependency ranges]
- Python: PyPI `freestyle` is at 0.0.17 (2025-06-29) and `sandbox-sdks-py` was last pushed 2025-06. **There is no maintained Python SDK for v5.** Python teams should call the REST/OpenAPI directly or drive VMs from a TS controller. [verified registry metadata]

## 3. Breaking-change drift, even inside 0.2.x

- `persistence: { type: "persistent" | "ephemeral" }` was in 0.2.2's `CreateVmOptions` and is used by Adorable (`lib/project-vm.ts`). **It is gone in 0.2.21**, replaced by `autoDeleteSeconds` (0 = ephemeral), `ttlSeconds`, `maxRunSeconds`, `maxRunTotalSeconds` and `idleTimeoutSeconds`. Adorable is safe only when installed from the **repo root**, where the workspace lockfile pins 0.2.2. Running `npm install` inside `adorable/` uses the stale nested lockfile. That lockfile has no `freestyle` entry, so the caret range `^0.2.2` resolves to 0.2.21 and the build breaks on `persistence` (`lib/project-vm.ts:121,152`, `lib/publish.ts:196`). The same happens if you copy its VM code into a fresh project on `freestyle@latest`, because TypeScript rejects the object literal. [verified by reading both lockfiles; build failure is inference from the type diff] [verified by diffing the `src/vms/types.ts` of both tarballs]
- The README's first SDK example calls `freestyle.vms.create()` with no arguments. The same package's `validateFirewallSpec` throws *"firewall is required on a VM create…"*. **The README example fails as written.** [verified]
- `networks` is deprecated in favour of `vpcs`, and only one VPC per VM is accepted "today". [verified type comments]
- The docs onboard page tells agents to run `npx -y freestyle@latest tokens create "agent work" --output json`. The command exists in source (`cli/commands/tokens.ts`) but is missing from the README's command list. [verified]

## 4. Issues and incident signals

Public issue volume is tiny. Most org repos have zero open issues, and the main SDK has no public tracker. The signals that exist:

| Date | Where | Signal |
|---|---|---|
| 2026-04-14 [background] | `freestyle-sh/freestyle-sh#1` (open) | "All existing VM snapshots became unrestorable (INTERNAL_ERROR / FAILED_TO_SPAWN_UFFD)". 18 snapshots failed, fresh ones worked. SDK 0.1.46. No public response. |
| 2026-05-30 [background] | `lawrencecchen/freestyle-suspend-repro` | Repro repo: on 0.1.46, `vm.suspend()` returned HTTP 500 `SUSPEND_FAILED_AND_STOPPED` in 19/37 calls, which **hard-stops the VM**, and `vm.snapshot()` returned 500 in roughly 43-50% of calls (retries usually worked). It also confirms snapshot restore brings back **RAM plus disk**. Pre-v5, so I could not check whether it is fixed. |
| 2026-08-29 to 09-02 | `manaflow-ai/cmux#11617` (filed and closed 2026-09-02) | cmux disabled Freestyle creates on 2026-08-29 because "Freestyle's legacy VM edge is hard-down upstream… `*.vm.freestyle.sh` hosts still serve a `CN=*.freestyle.sh` certificate that expired 2026-07-27". The issue was closed after cmux moved to the "beta platform + per-user VPC" (create took 3.5 s). (An earlier draft also blamed a ~2 h outage that day on a cmux migration mistake. That is not in this issue or its comment, so it is (unverified) and has been dropped.) |
| 2026-01-30 [background] | `Adorable#28` (open) | Self-hoster got a 500 from `vm-api.freestyle.sh/vms/{id}/mcp`, which is the legacy MCP endpoint. |
| 2025-06 to 09 [background] | `Adorable#8, #9, #11, #13, #20` (open, unanswered) | Local-setup failures: Anthropic rate limits on first prompt, Redis `NOAUTH`. These predate the v2 rewrite. |
| 2026-10-11 | `rigkit#45` (open) | Billing support request (accidental $50 Hobby signup) filed on a code repo. This suggests support goes through Discord or email, not GitHub. [inference] |
| 2026-07-06 | `openclaw/crabbox#955, #965` (closed) | Security bugs in a *third-party* Freestyle provider: repo config could redirect the inherited `FREESTYLE_API_KEY` to an attacker-chosen endpoint. The lesson: never let untrusted repo config set the API base URL (`--proxy`/`FREESTYLE_PROXY`). |

My probes on 2026-10-30 ~04:50Z: `vm-api.freestyle.sh` and `test.vm.freestyle.sh` resolve to 34.94.30.208 and **time out on :443**. `api.freestyle.sh` serves a valid cert (to 2027-01-24), as does `*.style.dev` (to 2027-01-13). `GET /v5/free-tier/binary` returned **503**, so anonymous signup was unavailable at that moment. [verified, point in time]

## 5. Official examples worth copying (all v5)

- **Adorable** (`adorable/lib/*`) has the patterns that matter for a demo:
  - The firewall `{ rules: [{ action: "allow", source: {}, destination: { public: true } }] }` gives open egress for npm, git and LLM calls. Inbound needs no rule, because "traffic arriving through a mapped domain is delivered by the platform itself, ahead of the firewall."
  - Public URLs come from `freestyle.tls.rules.create({ action:"allow", domain, source:{public:true}, destination:{ vmId, port } })`. Any unused `*.style.dev` subdomain is free with no DNS setup (SDK `tls.ts` doc comment).
  - The dev server runs as a **named PTY session**: `vm.pty.open({ slug:"dev", exec:"cd /workspace && npm run dev", replaceOnExit:true })` then `session.detach()`. Get-or-create semantics mean it outlives your connection.
  - A **warm base snapshot**: `scripts/bootstrap-base-snapshot.mjs` boots `freestyle/ubuntu` with `ttlSeconds: 3600` as a safety net, clones the template, `npm install`s, starts and curls the dev server, then snapshots. Because snapshots capture memory, new VMs serve "in well under a second" instead of ~10 s cold. Rebuilding requires first releasing the old slug (`snapshots.update(id, { slug: "" })`).
  - **No database**: projects are indexed by VM `metadata` (`vms.list({ metadata: "k:v,k2:v2" })`), and state is JSON on the VM disk via `vm.fs`.
  - **Publish** = tar on the dev VM, `fs.readFile`/`writeFile` to the prod VM, rsync, then poll `curl localhost:3000` until 200.
- **`freestyle-sh/convex`**: idempotent VM creation with retry recovery, tenant `ownerId`, and slug-adoption protection. The Workbench pattern is a persistent Jupyter VM with no project key, plus a single-use relay VM, with the credential injected at the TLS edge. It is a good template for a "safe agent with secrets" story.
- **Docs guides**: "Select OpenAI Models and Inject Authentication" uses a TLS rule on `api.openai.com` with `transform: [{ headers: { authorization: "Bearer …" } }, { jsonPatch: [{ op:"add", path:"/model", value }] }]`, so the VM uses a placeholder key and runs with `firewall: { rules: [] }`. "Give Your Mastra Agent a Sandbox" has you subclass `MastraSandbox` from `@mastra/core/workspace` (`start`/`destroy`/`executeCommand`) over `vms.create`/`vm.exec` yourself. No packaged adapter is shown, and the guide notes that background processes (`get_process_output`/`kill_process`) are unsupported unless you add a process manager or use PTY. "How to Give Your OpenAI Agent a Sandbox" (missing from an earlier draft) implements the **OpenAI Agents SDK `SandboxClient`** (`backendId` + `create()` returning a session with `execCommand()`/`close()`) on a Freestyle VM. This is the shortest path to using two sponsors (OpenAI + Freestyle) together. [verified]

## 6. Community projects (from GitHub code search; mostly stale)

Code search for `freestyle-sandboxes` in `package.json` returned ~50 repos, including `onlook-dev/onlook`, `rivet-dev/rivet` (example `ai-and-user-generated-actors-freestyle`, still on `freestyle-sandboxes ^0.0.95`, which is serverless-deploy era), `assrt-ai/assrt-mcp`, `canyonroad/agentsh-freestyle`, `andrelandgraf/aileen`, `dexhorthy/email-inbox`, Mastra coagent demos, and several earlier YC hackathon repos (`jyizheng/YCAIAgentHack`, `hexclave/agents-hackathon`, `twhetzel/data-agent-hub-mini_hackathon`). **Nearly all of them use the pre-v5 API.** Treat them as idea references, not copy-paste sources. The Rivet example matters most here: it is an *actor framework* deploying AI-generated actor code onto Freestyle, the same shape as "Durable Actors + Freestyle", but its deploy mechanism no longer exists. Code search for `from "freestyle"` returned no indexed hits, which fits v5 adoption still being young. [verified search output; the "young" reading is inference]

## 7. Concrete gotchas for a 5-hour team

1. **Do not follow pre-August-2026 material.** Ignore anything that uses `freestyle-sandboxes`, `freestyle.git`, `freestyle.serverless`, `VmSpec().with(...)`, `@freestyle-sh/with-*`, `gitRepos`, `domains.mappings`, `*.vm.freestyle.sh` or `vm-api.freestyle.sh`. LLM coding agents will happily generate this, because it dominates the training data and GitHub. Run `npx freestyle@0.2.21 skill install` so Claude Code/Codex reads current docs.
2. **`firewall` is required, and egress is closed by default.** Without an allow rule, `npm install`, `git clone` and OpenAI calls from inside the VM fail. This failure looks like a network hang, not an auth error.
3. **`exec` defaults to a 30 s timeout.** Pass `timeoutMs` (up to 300,000 normally, 86,400,000 with the native agent). Create-time execs are capped at 5 min. Check `statusCode` yourself, because a non-zero exit does not throw.
4. **Free plan compute is a hard monthly allowance, and default-size VMs burn it fast.** Free includes 200 vCPU-hours and 400 GiB-hours of memory per month. It does not run into overage, it just stops. One default VM (4 vCPU / 8 GiB) uses 4 vCPU-h and 8 GiB-h per wall-clock hour, so **10 default VMs exhaust the whole month's Free allowance in about 5 hours**, which is exactly the length of the hack. Pass a smaller size on create (e.g. 1 vCPU / 1-2 GiB), pause idle VMs (a paused VM holds no compute), or get the $100 attendee credit onto a paid plan. [verified from pricing-and-limits.md; arithmetic is mine]
5. **Free plan limits:** 10 concurrent VMs, 10 saved VMs, 10 snapshots, max 4 vCPU / 8 GiB / 32 GB per VM. The default VM size is already the Free max, so you cannot resize up. A "fan out 20 agent VMs" demo needs Hobby or attendee credits applied. Adding a card costs a refunded $1 verification.
6. **Leaked VMs eat the 10-VM cap.** Set `ttlSeconds`/`autoDeleteSeconds` on every scratch VM and `idleTimeoutSeconds` on long-lived ones. A paused VM bills storage only.
7. **The SDK does not read `.env`.** The CLI does, and the SDK constructor only sees the real `FREESTYLE_API_KEY` env var, so load dotenv yourself. The package is ESM-only.
8. **CLI vs dashboard team mismatch.** `freestyle login` stores its own team selection, independent of the dashboard. If you have several teams (personal plus a hackathon credit team), check `freestyle team current`.
9. **Anonymous signup** only runs on Linux x64 and returned 503 when probed. Sign up at dash.freestyle.sh before the event.
10. **Snapshot slugs are unique.** Rebuilding a base snapshot requires releasing the old slug first. Boot from `snapshotId`, not the slug, if you need stability.
11. **Version churn.** Pin `freestyle@0.2.21` in `package.json` with an exact version and commit the lockfile. A release on Oct 30 or 31 could change types under you (precedent: `persistence` was removed between 0.2.2 and 0.2.21).
12. **Snapshot/suspend reliability** had public 40-50% failure reports on the legacy platform in May 2026 [background]. Wrap `snapshot()` in retries and keep the demo path free of fragile suspend/resume steps unless you have tested them on v5.
13. **No Python SDK for v5.** Drive Freestyle from TypeScript.

---

## Hackathon implications

**What to build (Freestyle as the "body" for actors and agents):**
- **One VM per Durable Actor, keyed by slug.** Each actor (or each Agent Relay agent) gets a persistent VM `slug: "ghost-<actorId>"`, `idleTimeoutSeconds` pauses it between turns, and `start()` resumes it with memory intact. Actor state lives in Terse, while the agent's workbench (files, running processes) lives in the VM. This covers the "long-running agent / software factory" brief from the event page.
- **"Possession" via snapshot forks.** Snapshot a working agent VM and fork N children (`create({ snapshotId })`, which restores RAM plus disk) to try competing strategies. Agent Relay carries messages between the forks, the best one wins, and the losers are deleted. This shows off the most distinctive Freestyle feature (memory snapshots) in a live demo. Keep N ≤ 8 on Free.
- **Live URL per spawned app.** An agent builds a Halloween mini-app in its VM, a named PTY session runs `npm run dev`, and a TLS rule maps `<name>.style.dev`, so judges open the URL on their phones. Copy the Adorable patterns.
- **"Secrets never enter the haunted house."** Use an empty firewall plus a TLS rule injecting the OpenAI key on `api.openai.com`. The agent code runs with a placeholder key. This is a clean security story that fits Freestyle's own docs.

**Setup to finish before Oct 31:**
1. Create a dash.freestyle.sh account, generate an API key, and find out how the $100 attendee credit is applied (I could not verify this from code; ask a Freestyle rep at check-in).
2. `npm i freestyle@0.2.21` (exact), `npx freestyle@0.2.21 login`, `freestyle team current`, `npx freestyle@0.2.21 skill install`.
3. Smoke-test once: create a VM with an egress-allow firewall, run `exec` with `timeoutMs: 120000`, `fs.writeTextFile`, add a TLS rule on a `*.style.dev` subdomain, curl it, then delete. Build and save a **warm base snapshot** (Node, your template, `node_modules`, warmed dev server) so demo VMs boot in under a second.
4. Size demo VMs small (1 vCPU / 1-2 GiB) and budget compute: Free's 200 vCPU-h/month is gone in about 5 h at 10 default-size VMs.
5. Write a teardown script (`vms.list` by metadata, then delete) to free the 10-VM cap between test runs.

**What the sponsor likely wants to see [inference]:** recent Freestyle code (Adorable v2, convex Workbench, browser-bench, the OpenAI/Mastra guides) all centres on **persistent, snapshottable, networked VMs for agents**, with VPCs, identities and edge credential injection. It does not centre on one-shot code execution, which the onboard doc explicitly lists under "when not to use". A grand-prize demo that uses memory snapshots/forks, persistent agent VMs and edge-injected secrets matches what they are investing in.

## Limits / could not verify

- I could not read the core SDK's git history, changelog or private issues, because no public repo exists. The cadence comes from npm publish timestamps only.
- I did not authenticate against the API, so I could not test whether legacy `/git/v1` or `/web/v1` endpoints still serve requests. They return 401 with a different error shape than `/v5`, which hints at a separate legacy gateway. [inference]
- I could not confirm whether the April snapshot-restore and May suspend/snapshot 500 issues affect the v5 platform.
- I could not determine how hackathon credits map to plan limits (whether they lift the Free 10-VM cap).
- Download numbers for `freestyle` may include some traffic from the name's pre-2025 owner.
- GitHub code search hit its rate limit mid-run, so the community list is a sample, not a census.

## Sources

- Org and repos: https://github.com/freestyle-sh · https://github.com/freestyle-sh/Adorable · https://github.com/freestyle-sh/rigkit (releases: https://github.com/freestyle-sh/rigkit/releases) · https://github.com/freestyle-sh/convex · https://github.com/freestyle-sh/browser-bench · https://github.com/freestyle-sh/freestyle-sync · https://github.com/freestyle-sh/sandbox_sdks · https://github.com/freestyle-sh/cloudstate
- Adorable source: https://github.com/freestyle-sh/Adorable/blob/main/adorable/lib/freestyle.ts · https://github.com/freestyle-sh/Adorable/blob/main/adorable/lib/project-vm.ts · https://github.com/freestyle-sh/Adorable/blob/main/adorable/lib/publish.ts · https://github.com/freestyle-sh/Adorable/blob/main/adorable/lib/vars.ts · https://github.com/freestyle-sh/Adorable/blob/main/adorable/scripts/bootstrap-base-snapshot.mjs
- npm: https://www.npmjs.com/package/freestyle · https://www.npmjs.com/package/freestyle-sandboxes · https://www.npmjs.com/package/@freestyle-sh/with-nodejs · https://www.npmjs.com/package/@freestyle-sh/convex · downloads API https://api.npmjs.org/downloads/point/last-week/freestyle
- PyPI: https://pypi.org/project/freestyle/
- API/docs: https://api.freestyle.sh/openapi.json · https://www.freestyle.sh/docs/llms.txt · https://www.freestyle.sh/docs/onboard.md · https://www.freestyle.sh/docs/vms/pricing-and-limits · https://www.freestyle.sh/docs/guides/select-openai-models-and-inject-auth · https://www.freestyle.sh/docs/guides/give-your-mastra-agent-a-sandbox · https://www.freestyle.sh/docs/guides/give-your-openai-agent-a-sandbox · https://github.com/freestyle-sh/Adorable/blob/main/package-lock.json
- Issues: https://github.com/freestyle-sh/freestyle-sh/issues/1 · https://github.com/lawrencecchen/freestyle-suspend-repro · https://github.com/manaflow-ai/cmux/issues/11617 · https://github.com/freestyle-sh/Adorable/issues/28 · https://github.com/freestyle-sh/Adorable/issues/8 · https://github.com/freestyle-sh/rigkit/issues/45 · https://github.com/openclaw/crabbox/issues/955 · https://github.com/openclaw/crabbox/issues/965 · https://github.com/denoland/celld/issues/206
- Community: https://github.com/rivet-dev/rivet/tree/main/examples/ai-and-user-generated-actors-freestyle · https://github.com/onlook-dev/onlook
- Event: /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md (https://events.ycombinator.com/haunted-hacks-2026)

## Verification log (2026-10-29)

Adversarial re-check run 2026-10-29 PT (2026-10-30 UTC) with `gh api`, `npm view`/`npm pack`, the npm downloads API, PyPI JSON, `curl`/`openssl` and the docs' `.md` endpoints.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Org: created 2024-04-15, 49 public repos, 103 followers | `gh api orgs/freestyle-sh` | Confirmed |
| 2 | Repo stars and pushes (Adorable 831/319 on 08-25, cloudstate 211, rigkit 13/1 on 09-03, convex 10-05, browser-bench 09-08, sqlx fork 10-14) | `gh repo list` | Confirmed |
| 3 | 30 publishes since 2026-08-07; 0.2.0 on 08-21; 0.2.21 on 2026-10-29T23:02Z; 0.1.63 on 06-05; no `repository` field; MIT; deps `ws`/`yargs`/`dotenv` | `npm view freestyle time/repository` | Confirmed |
| 4 | Downloads: 143,510/wk (Oct 22-28); Jul 89k / Aug 121k / Sep 190k / Oct 353k; `freestyle-sandboxes` 32,671/wk | npm downloads API point and range | Confirmed (exact: 89,224 / 121,055 / 189,526 / 353,067) |
| 5 | `firewall` required on `vms.create`; README's no-arg `vms.create()` fails | 0.2.21 `src/firewall.ts:386`, `src/vms/index.ts:163-173`, README line 138 | Confirmed: `create(options)` is non-optional and calls `validateFirewallSpec`, which throws on undefined |
| 6 | `exec` defaults to 30 s, up to 300,000 / 86,400,000 ms; non-zero exit does not throw | `src/vms/types.ts:418`, `src/vms/index.ts:97` | Confirmed |
| 7 | `persistence` removed between 0.2.2 and 0.2.21 | grep both tarballs | Confirmed (0 occurrences in 0.2.21 `src`) |
| 8 | "Adorable is safe because its lockfile pins 0.2.2" | Read root and nested lockfiles | **Corrected**: true only from the repo root; nested `adorable/package-lock.json` is stale and `package.json` uses `^0.2.2` |
| 9 | Adorable quotes ("VMs are the only primitive…", "`domains` on a VM and serverless deployments are both gone") | `lib/freestyle.ts:4-5`, `lib/project-vm.ts:29-32` | Confirmed verbatim (second quote spans a line break) |
| 10 | `/v5` OpenAPI has 55 paths, no git/deploy/run/execute; cert CN `beta-api.freestyle.sh` valid to 2027-01-24 | Fetched `openapi.json`; `openssl s_client` | Confirmed |
| 11 | Legacy `vm-api.freestyle.sh` times out; `/v5/free-tier/binary` 503 | `curl` re-probe | Confirmed again (timeout / 503) at time of check |
| 12 | cmux#11617 dates, expired cert 2026-07-27, 3.5 s create on beta + VPC | `gh api` issue and comments | Dates **corrected** (disabled 08-29; issue filed and closed 09-02). "~2 h outage was cmux's mistake" not found, so **removed as unverified** |
| 13 | `freestyle-sandboxes` deprecated (0.1.46, 2026-04-12); `@freestyle-sh/with-*` last published 2026-04-21 on `freestyle ^0.1.46` | `npm view` | Confirmed |
| 14 | PyPI `freestyle` 0.0.17 (2025-06-29) | PyPI JSON | Confirmed |
| 15 | Free limits 10/10/10, 4 vCPU / 8 GiB / 32 GB, $1 refunded card check; paused VM bills storage only | `pricing-and-limits.md` | Confirmed. **Added** the missed 200 vCPU-h / 400 GiB-h monthly hard allowance and its 5-hour burn-down |
| 16 | Suspend repro 19/37, snapshot ~43-50%, RAM+disk restore; freestyle-sh#1 (0 comments); crabbox #955/#965 (2026-07-06, closed); rigkit#45 (2026-10-11); rigkit v0.3.0 2026-09-02 | `gh api` | Confirmed |
| 17 | OpenAI auth-injection guide (`transform` headers + `jsonPatch`, `firewall: { rules: [] }`); Mastra guide | `.md` endpoints | Confirmed. **Added** the OpenAI Agents SDK `SandboxClient` guide and the Mastra background-process limitation |
| 18 | "Three-founder codebase" | npm maintainers (3) and gh contributors | Downgraded to [inference] |

Not re-checked: org README wording, the `freestyle-sh` code-search counts (~50 repos), the `rivet-dev` example version, and the `$100` Freestyle attendee credit mechanics (the event page lists the credit, but how it is applied is still (unverified)).
