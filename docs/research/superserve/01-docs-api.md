# Superserve: docs and API deep dive (for Haunted Hacks, 31 Oct 2026)

Checked **29 Oct 2026 US Pacific time (29–30 Oct UTC)**; GitHub timestamps below are UTC. Every docs page listed in `docs.superserve.ai/llms.txt` that bears on the build was pulled as raw Mintlify `.md` with `curl`. So were the public OpenAPI spec (`superserve-ai/sandbox/api/openapi.yaml`, 225 KB) and two **unauthenticated live billing endpoints** on `api.superserve.ai`. Source code and PRs were read with `gh` from `superserve-ai/superserve` (SDKs, CLI, console) and `superserve-ai/sandbox` (backend, billing runbooks). This file builds on `00-early-draft.md` and **corrects** it in places. The biggest correction: **the plan and credit model changed this week**, and the marketing pricing page is stale. Bracketed numbers point to Sources. "Inference" marks my reasoning, not something a source states.

---

## 0. What changed vs the early draft (read this first)

| Draft said | Verified now | Source |
|---|---|---|
| Free = $5 + $95, **20 concurrent**, 2 GiB max | The live plan catalog API (`pricing_version: v2`) says Free = **1 running sandbox**, a **$0.13 compute allowance per 24 h** (7,200 s of 1 vCPU / 1 GiB), sandboxes **pause** when it runs out, **0 templates**, 2 vCPU / 4 GiB / 8 GiB max. The website pricing page still shows the old $5 + $95 / 20-concurrent copy | [P1][P2] |
| Pro = $1,000/mo | Catalog API: Pro = **$250/mo** with $250 usage included, 1,000 concurrent, 8 vCPU / 32 GiB. Launch runbook values: 2,000 concurrent, 16 vCPU / 64 GiB | [P1][B2] |
| Hackathon $100 delivery unknown | The backend has an **"event credit" operator script** (merged 29 Oct, extended 30 Oct). Staff grant credit **per team ID from a CSV**. Free-plan teams are **refused** ("upgrade to Developer first"); Starter and legacy PAYG are refused too. Trial teams get trial credit. Developer/Pro teams get a Stripe credit grant. The runbook mentions an **event 100%-off first-month Developer code** | [B1] |
| Storage price for paused VMs unknown | Public rate card: storage **$0.000108/GiB-hr, `billable: false`**. Paused sandboxes and snapshots currently cost nothing | [P2] |
| Default `superserve/base` shape | Docs say **2 vCPU · 4096 MiB · 8192 MiB** (changed 28 Oct). The OpenAPI description still says "1 vCPU, 1 GB". Trust the docs and `SandboxInfo.vcpuCount/memoryMib` | [D-tpl][O] |

---

## 1. What the product is (verified)

Superserve sells **Firecracker microVM sandboxes for agents**: "Virtual machines for long-horizon agents" [P3]. Every sandbox boots from a **template** and can **pause** (memory, processes and disk checkpointed, compute billing stopped), **resume**, **snapshot** and **fork**. It can also run commands and files, broker **secrets**, enforce **egress rules**, keep an out-of-VM **network log**, publish **preview URLs**, drive a **GUI desktop**, and run **Docker** inside the VM [D-intro][D-life][D-snap]. There is no model serving, hosting or queueing product. It is the agent's *computer*. The agent-facing homepage calls it "Open source and self-hostable" [P4]; `superserve-ai/superserve` (SDKs/CLI/console) is Apache-2.0 with **475 stars**, and `superserve-ai/sandbox` (backend) is public with 15 stars and no detected license (GitHub API, 29 Oct) [G-repo].

**Recent (last 90 days):** on **1 Oct 2026** Superserve became a listed sandbox provider for **Cursor Cloud Agents (Self-Hosted Machines)**. The integration's pitch is pause-between-turns ("resumes in under 50ms"), an egress allowlist, and the out-of-VM network log [S3][S4]. That is the same feature set to show on stage.

### Concept map

| Concept | One-line definition | Key limits |
|---|---|---|
| **Team** | Billing and ownership unit. API keys are team-scoped (`ss_live_...`) | Plan decides concurrency and shape |
| **Template** | OCI image + build steps + optional `startCmd`/`readyCmd`, snapshotted. Sets the VM shape | Free/trial: **0 team templates**. Shape cannot be overridden per sandbox |
| **Sandbox** | One microVM. States: `starting → active ↔ pausing/paused/resuming → deleted`, plus `failed` | Concurrency = plan's `max_concurrent` |
| **Snapshot** | Saved memory + disk. Outlives its sandbox. Fork it with `fromSnapshot` | 100/team, 20/sandbox, 4 in flight |
| **Secret** | Encrypted credential plus allowed hosts. The sandbox sees only a stand-in token | Delete = immediate break everywhere |
| **Network rules** | `allowOut` (IP/CIDR/domain, wildcards) + `denyOut` (IP/CIDR only). Allow wins | Update only while `active` |
| **Network log** | Platform-side log of HTTP(S) connections on ports 80/443, plus secret-bearing requests | 7-day retention |
| **Preview port** | `https://{port}-{id}.sandbox.superserve.ai`, published explicitly, `public` or `private` | Ports 1024–65535. 49983 reserved |
| **Access token / routing hint** | Per-sandbox data-plane credential (`X-Access-Token`), rotated on resume. Hint expires in 1 h | The SDK handles both |

---

## 2. Interfaces and versions (as of 29–30 Oct)

| Surface | Package / endpoint | Version | Notes |
|---|---|---|---|
| TS SDK | `@superserve/sdk` | **0.11.5** (29 Oct) | ESM + CJS, **zero runtime deps** (uses global `fetch`; `commands.spawn` needs a global `WebSocket`: "Node 22+, a browser, or a polyfill") [G-sdk] |
| Python SDK | `superserve` (PyPI) | **0.11.5**, Python ≥3.9 | Sync `Sandbox` + `AsyncSandbox`. `spawn` is async-only [D-cmd] |
| CLI | `@superserve/cli` / curl installer / Homebrew | **2.1.1** (29 Oct) | npm build needs Node ≥22.4. Installer drops a binary in `~/.superserve/bin` [D-cli] |
| MCP | `@superserve/mcp` (stdio) or `https://mcp.superserve.ai` (Streamable HTTP, bearer) | **0.3.3** | 20 tools. No OAuth, so no Claude.ai or ChatGPT connector UI [D-mcp] |
| REST control plane | `https://api.superserve.ai` (region `use`), `https://api-usw.superserve.ai` (region `usw`) | OpenAPI 0.1.0 | Header `X-API-Key` [O][G-cfg] |
| REST data plane | `https://sandbox.superserve.ai` + `X-Superserve-Sandbox-Id`, or `https://boxd-{id}.sandbox.superserve.ai` | n/a | Header `X-Access-Token` (from create/resume/activate) [O] |

**Region gotcha (verified in SDK source):** keys look like `ss_live_<region>_<32 chars>`. The SDK maps `use` to `api.superserve.ai` and `usw` to `api-usw.superserve.ai` / `usw-sandbox.superserve.ai`. If you call raw REST with a `usw` key, use the `usw` hosts. The SDK and CLI pick the host for you [G-cfg].

---

## 3. API surface, complete

**Control plane (`X-API-Key`)** [llms][O]
- Sandboxes: `GET/POST /sandboxes`, `GET/PATCH/DELETE /sandboxes/{id}`, `POST .../pause`, `.../resume`, `.../activate` (resumes if paused and returns a fresh token; idempotent), `GET .../network` (egress log). List filters: `limit` (1–200), `offset`, `status`, `q`, `metadata.<k>=<v>`, and an `X-Total-Count` header.
- Snapshots: `POST /sandboxes/{id}/snapshot`, `GET /sandboxes/{id}/snapshots`, `GET/PATCH/DELETE /snapshots/{id}`.
- Preview: `GET/POST/DELETE /sandboxes/{id}/preview-ports[/{port}]`, `POST .../{port}/token`, `POST .../{port}/token/rotate`.
- Secrets: `POST/GET /secrets`, `GET/PATCH/DELETE /secrets/{name}`, `GET /secrets/{name}/audit`, `GET /secrets/{name}/sandboxes`, `POST/DELETE /sandboxes/{id}/secrets[/{env_key}]`, `GET /providers`.
- Templates: `GET/POST /templates`, `GET/DELETE /templates/{id}`, `GET/POST /templates/{id}/builds`, `GET .../builds/{bid}`, cancel, and `GET .../builds/{bid}/logs` (SSE replay + live).
- Teams/RBAC, `/activity` audit log, and `/billing/*` (including `GET /billing/free-allowance`, plus the **unauthenticated** `/billing/pricing/public` and `/billing/plans/public`).

**Data plane (`X-Access-Token`)** [O]
- `POST /exec`: sync. Body `{command, args?, env?, working_dir?, timeout_s (default 30), user?}`. A non-zero exit code comes back in the body. Output capped at **8 MiB** (`truncated: true`).
- `POST /exec/stream`: SSE frames `{"stdout":..}` / `{"stderr":..}` / `{"exit_code":N,"finished":true}`.
- `GET /exec/connect`: WebSocket. Subprotocols `superserve.exec.v1` + `token.<access_token>` (+ `route.<hint>`).
- `GET/POST /files?path=...` (raw bytes; `format=zip` for directories), plus a control-plane directory listing that **auto-resumes** a paused box.

**Errors** (SDK classes; every one has `statusCode` + `code`) [D-err]: `AuthenticationError` 401, `ValidationError` 400, `NotFoundError` 404, `ConflictError` 409 (e.g. `sandbox_pausing` with `Retry-After`, or a network patch while paused), `RateLimitError` 429 with codes `rate_limited` / `too_many_sandboxes` / `too_many_builds` / `too_many_templates`, `TimeoutError` (Python: `SandboxTimeoutError`), `ServerError` 5xx, `BuildError` (`step_failed`, `image_pull_failed`, `image_too_large`, `ready_cmd_failed`, `capacity_unavailable`, ...). The SDK auto-retries GET/DELETE on 429/5xx/network errors (3 attempts). It **never retries POST/PATCH**. The docs warn: "Never replay a command after an ambiguous connection loss or timeout: it may already have executed" [D-conn]. Snapshot quota errors: `too_many_snapshots`, `too_many_snapshots_in_flight`. Free exhaustion: `free_allowance_exhausted` [O].

---

## 4. SDK reference, condensed (TS names; Python is snake_case)

`Sandbox.create({ name*, fromTemplate | fromSnapshot, timeoutSeconds (auto-pause on ACTIVE time, 1–604800), autoDeleteSeconds (after continuous pause, 0–2592000, 0 = on pause), metadata, envVars, secrets: {ENV: secretName}, network: {allowOut, denyOut}, previewAccess: "public"|"private", apiKey, baseUrl, signal })`. It resolves once the VM is `active` [D-sdk].

| Static | Instance |
|---|---|
| `Sandbox.connect(id)`: **auto-resumes** and returns a fresh token | `commands.run(cmd, {cwd, user, env, timeoutMs, onStdout, onStderr})` → `{stdout, stderr, exitCode}` |
| `Sandbox.list({metadata, status, limit, offset})` → `SandboxInfo[]` | `commands.spawn(cmd, opts)` → session with `stdin.write/close`, `kill(sig)`, `wait()`, `close()` |
| `Sandbox.killById(id)` (idempotent) | `files.write(path, string|Uint8Array|ArrayBuffer|Blob)`, `read`, `readText`, `downloadDir` (zip, 30 s default timeout) |
| `Sandbox.updateById(id, {...})`: **does not resume** | `pause({wait})`, `resume()`, `kill()`, `update({...})`, `getInfo()` |
| `Snapshot.get/list(sandboxId)`, `.rename`, `.delete` | `snapshot({name, idempotencyKey, wait=true, timeoutMs=15min})`, `snapshots()` |
| `Secret.create/get/list/deleteByName`, `.rotate`, `Provider.list()` | `attachSecret(env, name)`, `detachSecret(env)`, `getNetworkLog({verdict, since, before, limit})` |
| `Template.create({name, vcpu, memoryMib, diskMib, from, steps, startCmd, readyCmd})`, `.waitUntilReady({onLog})` | Preview: `publishPreviewPort(p,{access})`, `getPreviewUrl`, `getPreviewToken`, `getSignedPreviewUrl` (60 s default), `rotatePreviewToken`, `unpublishPreviewPort`, `listPreviewPorts` |
| | `desktop.*`: `screenshot`, `click`, `drag`, `scroll`, `write`, `press`, `actions`, `step(actions,{waitForChange, settleMs≤2000, quietMs, format:"jpeg"})`, `resize`, `getStreamUrl({viewOnly})` (viewer on :6080) |

**Behaviours worth knowing (verified in docs/source):**
- **Default exec timeout is 30 s on raw REST and on sync `run()` unless you pass one.** The OpenAPI `timeout_s` default is 30. The TS SDK only sends `timeout_s` when `timeoutMs` is set (`commands.ts` L93) [O][G-sdk]. So `npm install` or `pip install` through sync `run()` with no `timeoutMs` will probably be killed at 30 s (inference from spec + source, not tested). Streaming `run()` uses an **idle** timeout that resets on each chunk [D-cmd]. The spec says `timeout_s` is a hard limit: the command "is killed after that many seconds regardless of output, exiting with code 124". So a sync `run()` that returns `exitCode: 124` usually means you hit the timeout. On the WebSocket `/exec/connect` path, leaving out `timeout_s` "runs with no per-command timeout" [O].
- `run()` never throws on a non-zero exit. Check `exitCode`.
- `commands.run()`, file ops, `connect()` and desktop calls all **auto-resume** a paused sandbox. `updateById` and `getNetworkLog` do not [D-life][D-sdk][D-mcp].
- Sandbox properties (`status`, `metadata`) are snapshots taken when the object was built. Call `getInfo()` for live state.
- `secrets` and `envVars` must not share a key name (rejected) [D-bind].
- Files: paths must be absolute and must not contain `..` [D-files].
- Python async: wrap multi-call flows in `async with async_connection_pool():` [D-sdk].

**Templates** [D-tpl][D-spec]: system templates `superserve/base` (Ubuntu 24.04, Py 3.12, Node 22, build-essential), `python-3.11`, `node-22` (pnpm, tsc), `python-ml`, `code-interpreter`, `claude-code`, `openclaw`, `hermes`, `omnara` (Node 24, Go, Playwright, Postgres 16, Redis), and `desktop` (xfce, Chrome, noVNC). All are **2 vCPU · 4 GiB · 8 GiB** and all ship curl, git and ca-certificates. BuildSpec: `from` must be **linux/amd64** with `/bin/sh` + `mkdir/mount/chmod/sync` (no distroless or scratch). Steps are `run | env | workdir | user{name,sudo}`. `startCmd` is captured live in the snapshot. `readyCmd` is polled every 2 s for up to 10 min. Docs limits: vCPU 1 / 2 (Free) / 16 (Pro), memory 256 / 4096 / 65536 MiB, disk 1024 / 8192 / 65536 MiB. **Free and trial teams get 0 team templates** (Free: [P1]; trial: `team_effective_limits()` in migration `20261027233000_paid_first_new_team.sql`, "it builds no templates" [B4]), so on those plans use `superserve/*` plus a snapshot instead of a custom template.

---

## 5. CLI reference (v2.1.x) [D-cli]

`sandbox create|list|get|update|pause|resume|delete|network-log`, `exec <id> -- <cmd>` (exits with the remote exit code), `shell <id>`, `files ls|cat|write|upload|download`, `cp ./src <id>:/path`, `preview list|publish|unpublish|url|token|rotate`, `snapshot create|list|get|rename|delete|wait`, `template ... logs|wait`, `secret create|list|get|rotate|delete|audit|sandboxes|attach|detach`, `provider list`, `login [--no-browser|--no-wait|--with-key]`, `logout`, `whoami [--json]`, `completion`.
`create` flags: `-t/--template`, `--snapshot`, `--timeout 30m` (max 7d), `--auto-delete 7d`, `-m k=v`, `-e k=v`, `-s ENV=secret`, `--allow-out`, `--deny-out`, preview access [G-cli].
Use `--json` everywhere. Errors print as `{"error":{message,code,status}}`. Exit codes: 3 = auth, 4 = not found, 5 = conflict, 6 = rate limited, 7 = timeout. Destructive commands need `--yes` outside a TTY. Env vars: `SUPERSERVE_API_KEY` (overrides the saved key), `SUPERSERVE_BASE_URL`, `SUPERSERVE_CONFIG_DIR`, `SUPERSERVE_TELEMETRY=0`. The credential is saved to `~/.superserve/credentials.json` and shows up as "CLI · hostname" in the console.

## 6. MCP server [D-mcp]

Tools: `sandbox_create/update/list/info/exec/pause/resume/kill`, `sandbox_files_read/write/list/download_dir`, `sandbox_preview_url`, `sandbox_network_log`, `sandbox_computer` (one action per call; returns a screenshot), `sandbox_template_list/create`, `secret_list`, `sandbox_attach_secret/detach_secret`. **Not in MCP:** secret creation (deliberately), streaming, `spawn`, large transfers. Limits: exec stdout and stderr capped at **32 KiB each**, file read rejected above **1 MiB**, inline write capped at 8 MiB, directory zip capped at 10 MiB, exec default **60 s** and max **10 min**. Local mode needs Node 18+. MCP clients **do not inherit** your shell env, so put the key in the server `env` block.

---

## 7. Pricing, plans, quotas, and what "$100" means

**Rate card** (live `GET /billing/pricing/public`, effective 2026-06-17) [P2]: vCPU **$0.000014/s ($0.0504/h)**, memory **$0.0000045/GiB-s ($0.0162/GiB-h)**, storage $0.000108/GiB-h with **`billable: false`**. Billed per second while `active` only.

**Live plan catalog** (`GET /billing/plans/public`, fetched 30 Oct) [P1]:

| Plan | Price | Usage | Concurrent | Max per sandbox | Templates |
|---|---|---|---|---|---|
| Free (v3) | $0 | $0.1332 per 24 h window ("2 h of 1 vCPU/1 GiB"); **pauses** when used up | **1** | 2 vCPU / 4 GiB / 8 GiB | **0** |
| Starter | prepaid from $5 | credit never expires | 100 | 2 / 4 GiB / 50 GiB | 10 |
| Pro (v2) | **$250/mo** | $250 included, then PAYG | 1,000 | 8 / 32 GiB / 100 GiB | 10 |
| Enterprise | call | BYOC AWS/GCP/Azure | custom | custom | custom |

**In flight right now (29–30 Oct commits):**
- Starter is being **hidden from new purchases** and replaced by **Developer** (#457, 23:27Z 29 Oct) [G-457].
- New signups move to a **no-card trial** once Developer is published (#834) [B3].
- Launch runbook values [B2]: **Developer $20/mo with $20 credit, prepaid, Auto Topoff $5 at a $2 threshold (default on), 100 concurrent, 4 vCPU / 16 GiB.** Pro $250/mo with $250 credit, 2,000 concurrent, 16 vCPU / 64 GiB. **Trial: `credit_usd 0.05`, `max_sandboxes 1`** (the 0-template cap for trial teams comes from the migration [B4], not the runbook). Cancellation at launch is **support-only**.
- At fetch time the public catalog showed **no Developer card yet**. So Developer may or may not be live by Saturday. A re-fetch on 29 Oct (US time) still shows only Free / Starter / Pro / Enterprise, with `signup_admission.source: new_team` [P1].
- **YC code for Pro:** the launch checklist includes "Pro checkout with the YC code activates with a $0 first invoice". It also warns that a Free team which already paid a $0 invoice may be rejected by Stripe as `first_time_transaction` [B2]. The OpenAPI lists a managed offer `yc_2026` [O]. Inference: YC-company perks exist. Whether hackathon attendees get them is **unverified**.

**How the $100 event credit is probably delivered (inference grounded in [B1]):** the backend runbook `scripts/billing/event-credit.md` (#850 on 29 Oct, #857 on 30 Oct) describes exactly this flow. Staff collect `team_id,amount_usd` rows (max $1,000 per team) and run `event_credit.py --label event-...`:
- **Trial team (no plan yet):** gets a `signup trial credit` grant. The team then has $100, but **trial limits stay frozen: 1 running sandbox, 0 templates.**
- **Developer/Pro team:** gets a Stripe "promotional" credit grant on metered usage. Example from the runbook: a team that took the **event's 100%-off first-month Developer code** gets **$80**, because its $20 included credit makes it $100.
- **Free:** **refused** ("upgrade to Developer first"). **Starter / legacy PAYG:** refused, listed as "Unverified, under test". Enterprise, canceled/unpaid subscriptions and teams with no billing customer are also refused.
- **Upgrading during the trial forfeits leftover trial credit.** The runbook has a report-and-restore routine that staff run "once a day during the event", so it is recoverable but slow.
- After the free first month, Developer bills **$20 per month**.

**What $100 buys** (my arithmetic, at the published rates):

| Shape | $/hour | Hours per $100 | 5-h build, N boxes |
|---|---|---|---|
| 2 vCPU / 4 GiB (all curated templates) | $0.1656 | ~604 h | 10 boxes ≈ $8.28 |
| 1 vCPU / 1 GiB (custom template) | $0.0666 | ~1,500 h | 20 boxes ≈ $6.66 |
| 4 vCPU / 16 GiB (Developer max) | $0.4608 | ~217 h | 5 boxes ≈ $11.52 |

Paused sandboxes and snapshots cost nothing today (storage not billable). **Credits are not the constraint. Concurrency, and which plan your team lands on, are.** For comparison, Free's whole daily allowance runs one 2 vCPU / 4 GiB sandbox for only **~48 min** before every sandbox pauses.

---

## 8. Copy-paste setup

**Install + auth (CLI, for agents or SSH):**
```bash
curl -fsSL https://superserve.ai/install | SUPERSERVE_NO_LOGIN=1 sh
~/.superserve/bin/superserve whoami --json || ~/.superserve/bin/superserve login --no-wait --json
# open the printed url, match user_code, approve, then re-run login --no-wait --json → "logged_in": true
```

**Smoke test (CLI):**
```bash
ID=$(superserve sandbox create --name smoke --template superserve/base --timeout 30m --auto-delete 1d --json | jq -r .id)
superserve exec "$ID" -- sh -c 'nproc; free -m; python3 --version; node --version'
superserve sandbox pause "$ID" && superserve sandbox resume "$ID"
superserve sandbox delete "$ID" --yes
```

**TypeScript (works in Node 22+ / Bun; zero deps):**
```ts
import { Sandbox, Secret } from "@superserve/sdk"   // reads SUPERSERVE_API_KEY
await Secret.create({ name: "openai", value: process.env.OPENAI_API_KEY!, provider: "openai" }) // once
const sb = await Sandbox.create({
  name: "ghost-1", timeoutSeconds: 1800, autoDeleteSeconds: 86400,
  metadata: { app: "haunted", actor: "ghost-1" },
  secrets: { OPENAI_API_KEY: "openai" },
})
const r = await sb.commands.run("pip install -q openai && python3 -c 'print(42)'", { timeoutMs: 180_000 })
console.log(r.exitCode, r.stdout)
await sb.pause({ wait: true })
const again = await Sandbox.connect(sb.id)            // auto-resumes, same memory/processes
const snap = await again.snapshot({ name: "warm" })
const fork = await Sandbox.create({ name: "ghost-2", fromSnapshot: snap })
```

**Python:**
```python
from superserve import Sandbox
sb = Sandbox.create(name="py-smoke", timeout_seconds=1800)
print(sb.commands.run("echo boo", timeout_seconds=30).stdout)
sb.pause(wait=True); sb = Sandbox.connect(sb.id); sb.kill()
```

**Raw REST (from the OpenAPI spec; not executed):**
```bash
curl -s https://api.superserve.ai/sandboxes -H "X-API-Key: $SUPERSERVE_API_KEY" \
  -H 'content-type: application/json' -d '{"name":"rest","from_template":"superserve/base"}' > sb.json
curl -s https://sandbox.superserve.ai/exec -H "X-Access-Token: $(jq -r .access_token sb.json)" \
  -H "X-Superserve-Sandbox-Id: $(jq -r .id sb.json)" -H 'content-type: application/json' \
  -d '{"command":"uname -a","timeout_s":30}'
```

**MCP in your coding agent:**
```bash
claude mcp add superserve --env SUPERSERVE_API_KEY=$SUPERSERVE_API_KEY -- npx -y @superserve/mcp
# Codex ~/.codex/config.toml:  [mcp_servers.superserve] command="npx" args=["-y","@superserve/mcp"] env_vars=["SUPERSERVE_API_KEY"]
```

**Locked-down agent box (security-demo shape):**
```ts
network: { allowOut: ["api.openai.com", "1.1.1.1/32", "8.8.8.8/32"], denyOut: ["0.0.0.0/0"] }
// later: (await sb.getNetworkLog({ verdict: "blocked" })).events → show exfil attempts + matchRule
```

---

## 9. First 30 minutes on Saturday (checklist)

1. **(0–5 min)** Get the official instructions for the $100 from the Superserve rep. Ask directly: "Trial credit or Developer code? Where do I send my team ID?" Find the team ID in console Settings. **Do not** click upgrade on a trial team before credit lands unless told to.
2. **(5–8)** `superserve --version` ≥ 2.1.0 and `whoami --json` → `valid: true`. Export `SUPERSERVE_API_KEY` for SDK code (the CLI-minted key works).
3. **(8–12)** Smoke test above. Read `vcpuCount` / `memoryMib` from `sandbox get --json` to confirm the real shape on your plan.
4. **(12–15)** Concurrency probe: create two sandboxes. If the second fails with `too_many_sandboxes`, you are on a 1-box plan (Free/trial). Redesign around pause/resume and snapshots, or get the Developer code.
5. **(15–18)** `Secret.create` for OpenAI (`provider: "openai"`), then bind with `secrets: {OPENAI_API_KEY: "openai"}`. Test with a `curl api.openai.com/v1/models` inside the VM.
6. **(18–22)** Pause/resume proof: start `python3 -m http.server 8000 &`, pause, resume, then `curl localhost:8000`. That is your demo beat. Publish with `superserve preview publish <id> 8000`.
7. **(22–26)** Warm snapshot: install deps once, run `snapshot({name:"warm"})`, and fork from it for every agent. This replaces team templates on Free/trial plans.
8. **(26–30)** Verify the SDK runs inside your actor runtime (Terse actors run on Bun per the Terse research): run one `Sandbox.create` + `commands.run` from an actor and check egress to `api.superserve.ai`. Pin `@superserve/sdk@0.11.5`.

---

## Limits / could not verify

- **Whether Developer and the trial go live before 31 Oct.** At fetch time the public catalog still showed Free/Starter/Pro, and the runbook gates go-live on staff configuration. Signups before go-live land on **Free**, which the event script refuses until the team upgrades.
- **The real event mechanics.** `event-2026-11-01` in the runbook is an example label. I found no Haunted Hacks-specific Superserve page or code. The "100%-off Developer code" is mentioned in the runbook but its value was not found (it is correctly kept out of Git).
- Trial `max_vcpu/memory/disk`, and Developer/Pro **snapshot and template caps**, are "internal" and unpublished [B2].
- Website pricing ($1,000 Pro, 20 concurrent) contradicts the API catalog ($250 Pro, 1 concurrent on Free). I treat the API as authoritative because it is "the same plan catalog used by checkout" [O].
- The 30 s default exec timeout comes from spec + SDK source and was **not** run live. Nothing in sections 8–9 was executed against a live account (no key on this machine).
- Resume latency (<50 ms marketing claim) and auto-resume cost on first call were not measured.
- Whether the SDK's WebSocket `spawn` works inside Terse/Modal actor sandboxes (subprotocol auth) is untested.

---

## Hackathon implications

**What to build.** Make Superserve the actors' *body*. One Durable Actor owns one `sandboxId` and `snapshotId`: it `connect()`s (auto-resume) on each message, runs work, then `pause({wait:true})`. Agent Relay carries messages between actors. The features that set Superserve apart, and that its judges will want named on stage, are **pause with live processes intact, fork from snapshot, the secret broker, the egress allowlist plus a tamper-proof network log, and the desktop stream**. A box that only runs `python -c` reads as generic.

**Design to the plan you actually get.**
- On a **1-sandbox plan (Free/trial)**, the swarm-of-forks idea fails. Instead, demo **time-sharing**: one VM per active ghost, others snapshotted. Snapshots outlive sandboxes and cost $0 storage. Resume or fork on demand.
- With **Developer (100 concurrent, 4 vCPU / 16 GiB)**, the fork-and-race swarm is viable. Remember the 4-snapshots-in-flight cap: take one snapshot and fork it N times.

**Gotchas.**
- Pass `timeoutMs` on every sync `run()` (default 30 s).
- `timeoutSeconds` caps *active* time and will pause a running agent mid-task.
- Deny-all egress needs `1.1.1.1/32` and `8.8.8.8/32` or DNS dies. Network rules can't be changed while paused.
- Preview ports must be published explicitly. Private viewer links expire in 60 s.
- Restart secret-using processes in forks.
- Use IDs, not names.
- Python `spawn` is async-only.
- MCP output is truncated at 32 KiB.
- POSTs aren't retried. Don't blindly replay `exec` after a timeout.
- Free/trial have **0 templates**, so use snapshots.
- **Delete or auto-delete everything Saturday night.**
- If you take Developer, **cancel via support** before month 2 ($20/mo).

**Before 31 Oct (setup is allowed; project code must be written at the event).**
- Install CLI ≥2.1.1 and Node ≥22.4 (for the npm CLI). Upgrade Bun per the Terse doc.
- **Hold off on account creation until event instructions, or sign up and expect to need the Developer code.** Signing up now lands you on Free. The agent homepage says outright "new accounts start on the Free plan" [P4], and the launch runbook says "Until Developer is published, signups keep getting Free" [B2]. Free teams are refused by the event-credit script.
- Pre-read this file's snippets. Bookmark `docs.superserve.ai/llms.txt` for your coding agent.
- Optionally add the MCP server to Claude Code/Codex so your coding agent can spin up scratch boxes during the build.

**What the sponsor wants (inference).** Signups and real usage during a billing relaunch that is literally shipping this week. Show visible, narrated use of the long-horizon primitives. The Superserve upside here is the $1,000 credits inside the grand prize; there is no Superserve-specific track on the event page. Background: at Terac's Aug 15 Zero-Human Company Hackathon, Superserve ran its own track ($1,000 first, $500 second) [S1][S2][S5]. The 1st-place project was "Foundry" ("a holding company that finds customers, builds products & hires exp..." per its YouTube title; how it used Superserve is unverified). The 2nd-place project, TalosAI, used "Superserve with the isolated sandbox environments for repair workflow", with QA kept separate [S5]. Inference: sandboxes as the isolated work environment inside a larger autonomous system is a pattern Superserve has already rewarded, and it maps cleanly onto actor-owns-a-VM.

---

## Sources

- [llms] Docs index: https://docs.superserve.ai/llms.txt
- [D-intro] https://docs.superserve.ai/introduction.md · [D-cli] https://docs.superserve.ai/cli.md · [D-sdk] https://docs.superserve.ai/sdk-reference/sandbox.md
- [D-life] https://docs.superserve.ai/sandbox/lifecycle.md · [D-snap] https://docs.superserve.ai/sandbox/snapshots.md · [D-conn] https://docs.superserve.ai/sandbox/connect.md
- [D-cmd] https://docs.superserve.ai/sdk-reference/commands.md and https://docs.superserve.ai/commands/streaming.md · [D-files] https://docs.superserve.ai/sdk-reference/files.md
- [D-err] https://docs.superserve.ai/errors.md · [D-tpl] https://docs.superserve.ai/templates/overview.md · [D-spec] https://docs.superserve.ai/templates/build-spec.md
- [D-bind] https://docs.superserve.ai/secrets/binding.md and https://docs.superserve.ai/secrets/create.md · networking: https://docs.superserve.ai/sandbox/networking.md · network log: https://docs.superserve.ai/sandbox/network-log.md · preview: https://docs.superserve.ai/sandbox/preview-urls.md · desktop: https://docs.superserve.ai/sandbox/desktop.md · docker: https://docs.superserve.ai/sandbox/docker.md
- [D-mcp] https://docs.superserve.ai/integrations/mcp.md · OpenAI Agents SDK guide: https://docs.superserve.ai/integrations/agent-harnesses/openai-agents-sdk.md · Codex guide: https://docs.superserve.ai/integrations/coding-agents/codex.md
- Agent setup file: https://superserve.ai/SKILL.md
- [O] OpenAPI: https://raw.githubusercontent.com/superserve-ai/sandbox/refs/heads/main/api/openapi.yaml
- [P1] Live plan catalog (unauthenticated JSON, fetched 30 Oct): https://api.superserve.ai/billing/plans/public
- [P2] Live rate card: https://api.superserve.ai/billing/pricing/public
- [P3] Marketing pricing page (stale copy, fetched 29–30 Oct): https://www.superserve.ai/pricing
- [B1] Event credit runbook: https://github.com/superserve-ai/sandbox/blob/main/scripts/billing/event-credit.md (PRs #850 on 29 Oct, #857 on 30 Oct)
- [B2] Developer/Pro launch runbook: https://github.com/superserve-ai/sandbox/blob/main/scripts/billing/developer-pro-launch.md
- [B4] Trial limits SQL: https://github.com/superserve-ai/sandbox/blob/main/supabase/migrations/20261027233000_paid_first_new_team.sql
- [P4] Agent-facing homepage: https://www.superserve.ai/
- [G-repo] https://github.com/superserve-ai/superserve · https://github.com/superserve-ai/sandbox
- [S3] Superserve blog, "Cursor Cloud Agents now run on Superserve", 1 Oct 2026: https://www.superserve.ai/blog/cursor-cloud-agents-on-superserve/ · guide: https://docs.superserve.ai/integrations/managed-agents/cursor-cloud-agents
- [S4] Cursor partner list: https://cursor.com/docs/cloud-agent/self-hosted/integrations
- [S5] Terac Zero-Human Company Hackathon page (Aug 15, 2026, Superserve track $1,000 / $500): https://terac.com/events/hackathon · Girikratna Sharma, LinkedIn, Aug 17: https://www.linkedin.com/posts/girikratna-sharma_ai-agenticai-hackathon-activity-7494970932126523393-JfXL
- [B3] Trial PR: https://github.com/superserve-ai/sandbox/pull/834 · low-credit PR: https://github.com/superserve-ai/sandbox/pull/838
- [G-457] https://github.com/superserve-ai/superserve/pull/457 · #452 https://github.com/superserve-ai/superserve/pull/452 · #450 https://github.com/superserve-ai/superserve/pull/450
- [G-sdk] TS SDK source: https://github.com/superserve-ai/superserve/tree/main/packages/sdk/src (`commands.ts`, `commandSession.ts`, `package.json`)
- [G-cfg] https://github.com/superserve-ai/superserve/blob/main/packages/sdk/src/config.ts · [G-cli] https://github.com/superserve-ai/superserve/blob/main/packages/cli/src/commands/sandbox.ts
- Releases: https://github.com/superserve-ai/superserve/releases (cli-v2.1.1, 29 Oct) · npm `@superserve/sdk` 0.11.5, `@superserve/cli` 2.1.1, `@superserve/mcp` 0.3.3 · PyPI `superserve` 0.11.5
- [S1] Abhinav Garg, LinkedIn, 16 Aug 2026 (2nd place, Superserve track): https://www.linkedin.com/posts/abhinav-garg-12b9343b5_my-team-and-i-just-won-500-at-the-zero-human-activity-7494806275881459712-Pp3C
- [S2] Third-party X mirror of @superserve_ai (shows Nithin Aruswamy's Aug 17 post: "Won 1st & $1000 in @superserve_ai track at No-Human Hack by @tryterac", plus Superserve's Aug 20 congrats). Unofficial mirror, re-checked 29 Oct: https://teapaw.org/superserve_ai
- Terse runtime note (sibling research): /Users/charlie/.t3/projects/halloweenhack/docs/research/terse/01-docs-api.md

---

## Verification log (2026-10-29)

Adversarial re-check, done on 29 Oct 2026 US time (30 Oct UTC) with `curl`, `gh`, `npm view`, PyPI JSON and Exa. "Confirmed" means a live source matched and nothing contradicted it.

| # | Claim checked | Method | Outcome |
|---|---|---|---|
| 1 | Plan catalog: Free = 1 concurrent, $0.1332/24 h (7,200 s of 1 vCPU/1 GiB), pause on exhaustion, 0 templates, 2/4096/8192; Starter 100 conc / 50 GiB disk / 10 templates; Pro $250 incl. $250, 1,000 conc, 8 vCPU/32 GiB/100 GiB; no Developer card | `curl api.superserve.ai/billing/plans/public` | **Confirmed**, every field. Developer still absent |
| 2 | Rate card: vCPU $0.000014/s ($0.0504/h), memory $0.0000045/GiB-s ($0.0162/h), storage $0.000108/GiB-h `billable:false`, effective 2026-06-17 | `curl .../billing/pricing/public` | **Confirmed** |
| 3 | Marketing pricing page is stale ($5+$95, 20 concurrent, Pro $1,000) | Exa fetch of /pricing | **Confirmed** (Exa may serve a cached copy). The page also lists Pro at 16 vCPU / 64 GiB / 64 GiB disk |
| 4 | Event-credit runbook: CSV `team_id,amount_usd`, ≤$1,000/team, trial route, Stripe route, Free refused with "upgrade to Developer first", $80 example for the 100%-off Developer code, forfeit on upgrade, restore "once a day during the event" | `gh api` raw file + commit history | **Confirmed**, with one **correction**: the quoted refusal text applies to Free only. Starter/legacy PAYG are refused as "Unverified, under test". Fixed in §0 and §7 |
| 5 | PR dates: #850 merged 29 Oct, #857 "30 Oct", #834 trial, #457 Starter hidden 23:27Z 29 Oct | `gh pr view` | **Confirmed**: #850 2026-10-29T23:45Z, #857 2026-10-30T00:26Z (still 29 Oct US time), #834 2026-10-28T17:56Z, #457 2026-10-29T23:27Z. Header date wording fixed |
| 6 | Launch runbook: Developer $20/mo + $20 credit, prepaid, topoff $5 at $2 default-on, 100 conc, 4/16 GiB; Pro 2,000 conc, 16/64 GiB; trial $0.05, 1 sandbox; cancellation support-only | `gh api` raw file | **Confirmed**. **Correction**: "trial 0 templates" is not in the runbook. It comes from `team_effective_limits()` in a migration ("it builds no templates"). Re-cited as [B4]. **Added**: the YC code gives Pro a $0 first invoice (not attendee-relevant, unverified for the event) |
| 7 | Versions: SDK 0.11.5 (29 Oct), CLI 2.1.1 (29 Oct), MCP 0.3.3, PyPI 0.11.5 py≥3.9, CLI needs Node ≥22.4, SDK zero deps | `npm view`, PyPI JSON, `gh release list` | **Confirmed**. MCP 0.3.3 was published 16 Oct. SDK `dependencies` is empty |
| 8 | Default exec timeout 30 s; TS SDK sends `timeout_s` only when `timeoutMs` set (commands.ts L93) | OpenAPI grep + `gh api` source | **Confirmed** (default 30, L93 exact). **Added**: timeout kill exits 124; the WebSocket path has no timeout when `timeout_s` is omitted |
| 9 | All curated templates are 2 vCPU · 4096 MiB · 8192 MiB; OpenAPI still says "1 vCPU, 1 GB" | docs `templates/overview.md`, OpenAPI L28 | **Confirmed** |
| 10 | MCP: 20 tools, 32 KiB stdout/stderr caps, 1 MiB read reject, 8 MiB inline write, 10 MiB zip, 60 s default / 10 min max, Node 18+, no OAuth on hosted endpoint | docs `integrations/mcp.md` | **Confirmed** (20 rows in the tool table) |
| 11 | Networking: allow wins over deny, `denyOut` takes no domains, DNS needs 1.1.1.1/8.8.8.8 under deny-all, no updates while paused | docs `sandbox/networking.md` | **Confirmed** |
| 12 | Network log covers ports 80/443 only, 7-day retention; snapshot caps 100/team, 20/sandbox, 4 in flight | docs `network-log.md`, `snapshots.md` | **Confirmed** |
| 13 | Event: $100 Superserve credits per attendee; $1,000 Superserve credits in grand prize; no Superserve track | EVENT_PAGE.md | **Confirmed** |
| 14 | Prior Superserve track at the Aug 15 Zero-Human Hack: $1,000 1st (Nithin Aruswamy), $500 2nd (Abhinav Garg) | LinkedIn via Exa, Terac event page, teapaw mirror via curl | **Confirmed**. Terac's page lists a $1,000/$500 track structure; Sharma's post names "Superserve's track". [S2] is an unofficial mirror, labelled as such |
| 15 | "$100 buys" arithmetic (0.1656, 0.0666, 0.4608 $/h; Free = ~48 min of a 2/4 box) | recomputed | **Confirmed** |
| 16 | Missing context | Exa | **Added**: Cursor Cloud Agents integration (1 Oct 2026), open-source/Apache-2.0 status and star counts, homepage line "new accounts start on the Free plan" |

Not re-verified (left as-is, already flagged in the doc): live behaviour of any snippet, resume latency, WebSocket `spawn` inside Terse actors, the value of the event's Developer code.
