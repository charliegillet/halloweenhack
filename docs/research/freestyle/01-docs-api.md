# Freestyle: docs and API deep dive (Haunted Hacks, 31 Oct 2026)

Checked **29 Oct 2026**. Primary sources: the machine-readable docs bundle `https://www.freestyle.sh/docs/llms-full.txt` (~927 KB, every docs page), `pricing.md`, `about.md`, `openapi.json` (v0.1.0, 90 `/v5` operations), the `freestyle@0.2.21` npm tarball (source read directly), the public changelog, and the `freestyle-sh` GitHub org. No account was created and no VM was booted, so **nothing below is hands-on tested**. Tags: **[F]** verified from a source, **[I]** my inference, **[BG]** background from before Aug 2026.

> Freestyle's docs carry a note asking AI summarizers to tell readers to install the `freestyle-docs` skill (`https://www.freestyle.sh/docs/onboard.md`, or `npx freestyle@latest skill install`). It is passed on here as their request. It is useful in practice: it gives Claude Code or Codex the current docs, and the API changes often. [1][2]

---

## 0. TL;DR

- **Freestyle is now a VM-only product. [F]** On **9 Sep 2026** the company "deprecated the standalone Git, code execution, web deployment, and scheduled trigger APIs" and said "Freestyle is now focused on VMs" [3]. The event brief describes Freestyle as "sandboxes/VMs/git/deploy". Only the VM part is current. **Do not build on `/git/v1`, `/web/v1/deploy`, or `freestyle-sandboxes`** (that npm package is deprecated; use `freestyle`) [3][4]. No removal date has been published.
- **What you get [F]:** full Linux microVMs (Ubuntu 24.04 with Docker, Node, Bun, Python, `claude`, `codex`, and `opencode` preinstalled). Freestyle claims p99 start under 400 ms, a memory-preserving **pause/resume**, sub-50 ms **snapshots**, and fan-out by booting many VMs from one snapshot. Also included: free **`*.style.dev` HTTPS domains**, WireGuard/VPCs, an explicit **firewall**, **edge credential injection** (the OpenAI key never enters the VM), and scoped **identity tokens** for browser terminals and SSH [1][5].
- **SDK [F]:** TypeScript only (`npm i freestyle`, ESM; the 0.2.21 `package.json` declares no `engines` field, so a "Node 20+" floor is (unverified)). The Ubuntu image itself ships Node LTS. The CLI ships in the same package. The `freestyle` package on PyPI is stale (0.0.17, last upload June 2025), and the `sandbox-sdks-py` repo was last pushed in June 2025. **From Python, call the REST API** at `https://api.freestyle.sh/v5` with `Authorization: Bearer <key>` [4][6].
- **Credits [F + I]:** list price for a default VM (4 vCPU, 8 GiB, 32 GB) is **about $0.267/hour**. **$100 buys about 374 default VM-hours, or about 748 on `ubuntu-sm`.** Every plan, including Free, also includes 200 vCPU-hours and 400 GiB-hours per month, which equals 50 default VM-hours [5]. A 5-hour hackathon is nowhere near either limit. The binding constraints are **plan limits**: Free allows 10 concurrent VMs and caps each VM at 4 vCPU / 8 GiB [5].
- **Two gotchas that will bite in the first 10 minutes [F]:** (1) `firewall` is a **required** field on VM create, and a VM with no rules reaches nothing. (2) `vm.exec()` **defaults to a 30 s timeout** (max 5 min, or 24 h on newer guest agents). Use PTY sessions or systemd for anything long-running [1][6][7].

---

## 1. Product surface, current (Oct 2026) versus deprecated

| Area | Status (29 Oct 2026) | Evidence |
|---|---|---|
| VMs (create/exec/pause/start/resize/delete, slugs, metadata, TTLs) | **Current** | docs `/vms`, OpenAPI `/v5/vms*` [1][6] |
| Snapshots (custom + public base images) | **Current** | `/vms/base-snapshots`, `/v5/snapshots*` |
| Files API (16 GiB/file, chunked, readable while paused) | **Current** | `/vms/files` |
| PTY sessions (named, reattachable, xterm.js adapter) | **Current**; browser terminals added **Oct 14** | `/vms/pty`, changelog [3] |
| Identities + access tokens (scoped exec/PTY/SSH, `expiresAt`) | **Current**; expiring tokens added **Oct 14** | `/vms/client-sessions` |
| Firewall (allow-only rules) | **Current**, required on create since Sep | `/vms/network/firewall` |
| TLS rules: inbound domains, outbound credential injection, JSON Patch, scoped S3, SOCKS5 | **Current**; method/path matching + S3 scoping added **Oct 14** | `/network/tls-*` |
| VPCs, WireGuard tunnels, forward auth, custom domains/wildcards | **Current** | `/network/*`, `/vms/domains*` |
| Customers API (`POST /v5/customers`), Hardware power API | Current, niche (multi-tenant bookkeeping; bare-metal colo) | OpenAPI |
| **Git repos, Web Deploy (`/web/v1/deploy`), code execution, scheduled triggers** | **Deprecated 9 Sep 2026** | changelog [3]; old docs.freestyle.sh pages now 404 (29 Oct) [8] |
| Dev Server API (`/ephemeral/v1/dev-servers`) | **Removed** (announced for 1 Mar 2026) [BG] | blog [9] |
| Unversioned paths (`/vms`, `/tls`, …) | Marked `deprecated: true` in OpenAPI; use `/v5/...` | OpenAPI [6] |

Recent cadence [F]: npm `freestyle` 0.2.10 (2 Sep) → 0.2.21 (**29 Oct, 23:02 UTC, two days before the event**). That is 11 releases after 0.2.10 in about 60 days (0.2.18-0.2.20 all landed on 14 Oct, the changelog day). **Pin `freestyle@0.2.21`** (or whatever is current Saturday morning) [4].

---

## 2. Core concepts

**VM states [F]:** `running` → `paused` (memory and disk saved, processes resume exactly; **no compute charge, storage only, does not count toward concurrency**) → `stopped` (disk kept, memory discarded; you can only get here by running `poweroff` inside the guest) → `deleted`. Ephemeral VMs (`autoDeleteSeconds: 0`) are deleted when they stop [1].

**Lifecycle policy fields [F]**, settable on create or with `vm.update()`. Use `-1` to clear a field:

| Field | Meaning |
|---|---|
| `idleTimeoutSeconds` | Pause after N s with no **network** activity. Incoming traffic to its domain wakes it. |
| `ttlSeconds` | Delete N s after **creation** (not from now). Enforced by a periodic sweep, so it is not exact. |
| `maxRunSeconds` | Pause after N s in a single run. |
| `maxRunTotalSeconds` | Lifetime run budget. Once spent, starts return 409. |
| `autoDeleteSeconds` | Delete after N s continuously paused/stopped. `0` means ephemeral. |
| `automaticRestart` | Reboot on crash or panic (default `true`). |

**Identifiers [F]:** slugs are `[a-z0-9-]`, 1-63 chars, unique per account, and accepted anywhere an ID is. `reassignSlug` moves a slug atomically. `metadata` allows up to 64 entries of at most 63 chars each [6]. `freestyle.vms.ref("slug")` returns a handle without a fetch.

**Snapshots [F]:** `vm.snapshot({slug})` captures memory and disk from a running or paused VM and returns when the snapshot is bootable. Boot it with `vms.create({ snapshotId })`. "Fork" means snapshot once, then create N VMs from it (the E2B migration guide maps `sandbox.fork()` this way) [1]. Snapshots keep their installed tool versions when base images update.

**Base images [F]:**

| Slug | vCPU / RAM / disk | Plan floor |
|---|---|---|
| `freestyle/busybox` | 1 / 128 MiB / 1 GB | Free |
| `freestyle/ubuntu-sm` | 2 / 4 GiB / 16 GB | Free |
| `freestyle/ubuntu` (default) | 4 / 8 GiB / 32 GB | Free (Free's max) |
| `freestyle/ubuntu-lg` | 8 / 16 GiB / 64 GB | Hobby |
| `freestyle/ubuntu-xl` / `-2xl` | 16/32 GiB/128 GB; 32/64 GiB/128 GB | Pro |
| `freestyle/ubuntu-3xl` | 64 / 128 GiB / 256 GB | Enterprise |
| `freestyle/kali` | 4 / 8 GiB / 32 GB (Kali 2026.3) | Free |

The Ubuntu image ships with Node LTS, Bun, TypeScript, `claude`, `codex`, `opencode`, `openclaw`, Python with `uv`, the `openai`, `openai-agents`, `anthropic`, `claude-agent-sdk`, `pydantic-ai`, and `langchain` packages, Docker Engine and Compose (daemon running at boot), `git`, `tmux`, `wg`, and systemd as PID 1. Default exec user is `ubuntu` (passwordless sudo). Use `vm.linuxUser("root")` for root [1].

**Networking model [F]:** default-deny. Firewall rules are **allow-only** and need an explicit `action: "allow"`. Matchers are `vmId`, `vpcId`, `tunnelId`, `cidr`, `public: true`, plus `port` (which **requires** `protocol`: tcp, udp, or icmp). Inside a `vms.create` firewall block, an empty matcher `{}` means "this VM" [1]. Note that the CLI's `vm create` gives Internet access by default (`--no-internet` removes it). The SDK does not do this: you must pass the rule yourself.

**TLS rules [F]** come in two flavors:
- **Inbound:** `{ domain: "x.style.dev", source: { public: true }, destination: { vmId, port } }`. Any unused one-label `*.style.dev` name is **first-come, first-served**, with no DNS setup and an automatic certificate. Custom domains need a TXT verification, a CNAME to `beta-web.freestyle.sh`, and `_acme-challenge` delegated to `beta-dns.freestyle.sh` [1].
- **Outbound:** `{ domain: "api.openai.com", source: { vmId }, destination: { public: true }, transform: [{ headers: { authorization: "Bearer sk-…" } }] }`. The edge injects the header, so the VM uses a placeholder key. The VM must trust the Freestyle CA, which is installed in the system store. For Node, set `NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt`. `jsonPatch` can force `/model`. **Unmatched requests are forwarded without injection, not denied.** Docker containers do not inherit the CA or the DNS steering. Header values read back as `"***"` [1].

**Identities [F]:** your server creates an identity, grants it specific VMs (and optionally Linux users), and mints a token (with optional `expiresAt`). The browser then calls `new Freestyle({ identityAccessToken })`, sent as the `x-freestyle-identity-access-token` header. A token holder can reach **only the exec and PTY routes** of granted VMs. SSH uses `ssh <vm>[+user]:<token>@beta-ssh.freestyle.sh` [1][6].

**Background requests [F]:** send the header `x-freestyle-background-after-secs: N`. After N s you get a 202 with a `requestId`. Poll `GET /v5/background-requests/{id}`. Results are kept for 10 min. This is what enables exec timeouts longer than 5 min [6].

---

## 3. API surface (OpenAPI, `/v5`, 90 operations)

Base URL `https://api.freestyle.sh` (`DEFAULT_BASE_URL` in `src/client.ts`). Auth is `Authorization: Bearer <FREESTYLE_API_KEY>` or an identity token. Errors look like `{"code":"SCREAMING_SNAKE","message":"…"}` and you should branch on `code`. The SDK throws `FreestyleApiError` (with `.code` and `.status`) or `FreestyleTransportError` [6]. Verified unauthenticated response: `401 {"code":"MISSING_CREDENTIALS",…}` (curl, 29 Oct).

| Tag | Endpoints |
|---|---|
| VMs | `GET/POST /vms`, `GET/PATCH/DELETE /vms/{id}`, `POST /vms/{id}/exec-await`, `/start`, `/pause`, `/resize`, `/snapshot`, `PUT /vms/{id}/networks`, `GET /vms/{id}/pty` (WS), `/pty/sessions[/{sid}]` |
| Filesystem | `/vms/{id}/fs/{read,write,dir,exists,stat,mkdir,remove}`, chunked `/fs/uploads[/{uid}[/commit]]` |
| Snapshots | `GET /snapshots`, `GET/PATCH/DELETE /snapshots/{idOrSlug}` |
| Firewall | `GET/POST /firewall/rules`, `GET/DELETE /firewall/rules/{id}`, `POST /firewall/evaluate` (dry-run "would this be allowed?") |
| TLS | `GET/POST /tls`, `GET/PUT/DELETE /tls/{id}`, `/tls/forward-auth[/{id}]` |
| VPCs / Tunnels | `/vpcs[/{id}[/ips,/tunnels]]`, `/tunnels[/{id}[/rotate-key, /vpcs/{vpc}]]` |
| Domains | `/verifications[/{d}]`, `/domains`, `/domains/placeholder`, `/certificates[/wildcard]` |
| Identities | `/identities[/{id}[/permissions/vm[/{vm}], /tokens[/{tid}]]]` |
| Other | `/customers`, `/hardware[/{id}/power]`, `/background-requests/{id}` |

`exec-await` body: `command` (run through the guest shell), `env`, `linuxUser`, `stdin` (base64, ≤1 MiB), `timeoutMs` (**default 30000**; at most 300000 unless you use background requests with a native-exec agent, which allows up to 86 400 000). **A non-zero exit still returns HTTP 200.** Read `statusCode`, which is `null` when the timeout killed the command [6].

**Rate limits:** the only documented `RATE_LIMITED` 429 is on the bare-metal hardware power API. **No general API rate limit is published** [6]. **Plan-limit violations also come back as HTTP 429**, but with code `LIMIT_EXCEEDED`, on `POST /v5/vms` and `POST /v5/vms/{id}/resize` (OpenAPI, re-checked 29 Oct). Branch on `code`, not status: retrying a `LIMIT_EXCEEDED` with backoff will never succeed until you pause or delete a VM. `exec-await` on a VM that is not running returns **409 CONFLICT** (and `VM_NON_RESPONSIVE` mid-command means it may already have run, so do not blindly retry) [6].

---

## 4. CLI (`freestyle`, same npm package)

Auth: `freestyle login` (browser, Stack Auth, stored in `~/.freestyle/config.json` mode 0600) or `--no-browser`. Then `whoami`, `team list|current|use`, and `logout`. **Login does not mint an API key**: run `freestyle tokens create "<name>" [--output json]` (the key is shown once), and use `tokens list` / `tokens revoke` to manage keys. Credential precedence is `--api-key`, then the `FREESTYLE_API_KEY` env var, then `./.env`, then the stored login [1][4].

Command groups: `vm`, `snapshot`, `vpc`, `tunnels`, `firewall`, `tls`, `domain`, `identity`, `tokens`, `billing`, and `skill install`. Hidden commands found in the source: `signup` (anonymous free-tier account via a **Linux x86-64-only** attestation binary, so it will not work on a Mac) and `claim` [4].

Most useful commands:
```bash
freestyle vm create --slug ghost --no-ssh                 # SDK-equivalent record; at a TTY it drops you in a shell
freestyle vm exec ghost --timeout-ms 60000 -- npm test     # streams output, exits with guest status
freestyle vm exec -it ghost -- bash                        # interactive PTY
freestyle vm ssh ghost                                     # PTY API, no local SSH key needed
freestyle vm pause ghost && freestyle vm start ghost
freestyle snapshot create --script ./setup.sh --slug haunted-base   # boot→run→capture→delete
freestyle snapshot --slug haunted-base -- npm i -g some-tool        # capture after one command
freestyle vm scp ./app ghost:/srv/app                      # files land root-owned; chown for ubuntu
freestyle tls create --domain spooky-yourteam.style.dev --from public --to vm=ghost,port=3000
freestyle --output json vm list | jq '.vms[] | {id,state}' # --json flag was removed
freestyle billing redeem FS-XXXXXXXXXX [--replace-sponsorship]
```
In CI or under a coding agent, `snapshot create` **requires** a command or `--script` unless you pass `--interactive`. A script that exits non-zero deletes the VM and takes no snapshot, unless you pass `--keep-vm` [1].

---

## 5. Pricing, limits, and what the credits buy

**Plans [F] [5]:**

| | Free | Hobby | Pro |
|---|---|---|---|
| Price | $0, **never bills usage** | $50/mo minimum (counts as usage) | $500/mo minimum (counts as usage) |
| Concurrent VMs (running/starting/pausing) | **10** | 40 | 400 |
| Saved VMs / snapshots | 10 / 10 | 200 / 1,000 | 4,000 / 12,000 |
| Max per VM | **4 vCPU, 8 GiB, 32 GB** | 8 / 16 GiB / 64 GB | 32 / 64 GiB / 256 GB |
| Data transfer included | 50 GB | 500 GB | 500 GB |

Usage rates (metered per second, on *allocated* resources): **vCPU-hour $0.04032; GiB-RAM-hour $0.0129; GiB-disk-hour $0.000086; data transfer $0.02/GB**. Traffic inside a VPC is free. **Every plan includes 200 vCPU-hours, 400 GiB-hours, and 60,000 GiB-disk-hours per month.** On Free these are hard caps: when you exhaust them, affected VMs are paused and you must resume them yourself after the allowance resets (they do not auto-resume). Free also **cannot resize a VM up**; resize is Hobby/Pro only [5]. Adding a card to a Free account makes a $1 charge that is refunded [5].

**Credit math [I, from list prices]:**

| Shape | $/hour running | VM-hours per **$100** | Free-tier VM-hours/month | Paused cost/hour |
|---|---|---|---|---|
| `busybox` 1/0.125/1 | $0.042 | ~2,380 | 200 (vCPU-bound) | ~$0.0001 |
| `ubuntu-sm` 2/4/16 | $0.134 | ~748 | 100 | $0.0014 |
| `ubuntu` 4/8/32 (default) | $0.267 | ~374 | 50 | $0.0028 |
| `ubuntu-lg` 8/16/64 (Hobby+) | $0.535 | ~187 | 25 | $0.0055 |

- A 4-person team using all **10 concurrent default VMs for 5 hours uses 50 VM-hours, about $13.40 at list price**. That is exactly one Free month's included compute. **Money is not the constraint; the 10-VM concurrency cap and the 4 vCPU per-VM cap are.**
- If the event code also grants a plan (Freestyle's promo codes can carry a `planGrant`, as the YC code grants Hobby for 6 months), you get 40 concurrent VMs and `ubuntu-lg`. I could not determine whether the $100 attendee code includes a plan grant [4][10].
- **$10k grand prize:** about 37,000 default VM-hours, or about 20 months of Pro minimums [I]. For comparison, the public YC deal is $5k in credits (valid 12 months) plus a 1:1 match on up to $25k of spend and 6 months of Hobby [10]. The prize is twice the YC deal's *upfront* credit, but the YC deal's match can be worth more in total [I].
- How credits arrive [F]: a single-use `FS-XXXXXXXXXX` code redeemed with `freestyle billing redeem <code>` (the docs use this same flow for credit codes). **Credits land on whichever team is active**, so run `freestyle team current` first. A plan-bearing code conflicts with an already-running sponsorship (error `promoPlanConflict`; override with `--replace-sponsorship`). That matters if a YC-founder teammate already has the YC Hobby grant [4][10].

---

## 6. Copy-paste setup

**TypeScript (Node 20+ / Bun):**
```bash
npm i freestyle@0.2.21 && npx freestyle@latest login && npx freestyle@latest tokens create "haunted" --output json
export FREESTYLE_API_KEY=...   # SDK reads it automatically
```
```ts
import { Freestyle } from "freestyle";
const fs = new Freestyle();

// 1. Boot (firewall REQUIRED; this rule = outbound Internet only)
const { vm, vmId } = await fs.vms.create({
  snapshotId: "freestyle/ubuntu-sm",
  slug: "ghost-1",
  firewall: { rules: [{ action: "allow", source: {}, destination: { public: true } }] },
  idleTimeoutSeconds: 600,          // auto-pause when quiet; traffic wakes it
  ttlSeconds: 8 * 3600,             // hackathon safety net
});

// 2. Run (raise timeout: default is 30 s)
const r = await vm.exec({ command: "node -v && docker ps", timeoutMs: 120_000 });
console.log(r.statusCode, r.stdout);

// 3. Long-running service → systemd, then publish on a free HTTPS name
await vm.fs.writeTextFile("/etc/systemd/system/app.service",
  `[Service]\nExecStart=/usr/local/bin/node /home/ubuntu/server.js\nRestart=always\n[Install]\nWantedBy=multi-user.target`);
await vm.linuxUser("root").exec("systemctl daemon-reload && systemctl enable --now app");
await fs.tls.rules.create({ action: "allow", domain: "ghost-yourteam.style.dev",
  source: { public: true }, destination: { vmId, port: 3000 } });

// 4. Branch: snapshot once, fan out N "possessed" copies
const { snapshotId } = await vm.snapshot({ slug: "ghost-base" });
const forks = await Promise.all([1, 2, 3].map(i => fs.vms.create({ snapshotId, slug: `ghost-fork-${i}`,
  firewall: { rules: [{ action: "allow", source: {}, destination: { public: true } }] } })));

// 5. Pause (storage-only billing) / resume with memory intact
await vm.pause(); await vm.start();
```

**OpenAI key stays outside the VM** (agent code runs inside the VM) [1]:
```ts
await fs.tls.rules.create({ action: "allow", domain: "api.openai.com", source: { vmId },
  destination: { public: true },
  match: { method: ["POST"], path: { exact: "/v1/responses" } },
  transform: [{ headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}` } },
              { jsonPatch: [{ op: "add", path: "/model", value: "gpt-..." }] }] });
// inside VM: new OpenAI({ apiKey: "unused" }); run with NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
```

**Browser terminal for judges/users** (server mints the token, browser attaches) [1]:
```ts
const { identity } = await fs.identities.create();
await identity.permissions.vm.grant({ vmId });
const { token } = await identity.tokens.create({ expiresAt: new Date(Date.now() + 3600e3).toISOString() });
// browser: new Freestyle({ identityAccessToken: token }).vms.ref(vmId).pty  +  connectXterm(...) from "freestyle"
```

**Python or any language: raw REST** [6]:
```bash
curl -s https://api.freestyle.sh/v5/vms -H "Authorization: Bearer $FREESTYLE_API_KEY" -H 'content-type: application/json' \
  -d '{"slug":"py-ghost","snapshotId":"freestyle/ubuntu-sm","firewall":{"rules":[{"action":"allow","source":{},"destination":{"public":true}}]}}'
curl -s https://api.freestyle.sh/v5/vms/py-ghost/exec-await -H "Authorization: Bearer $FREESTYLE_API_KEY" \
  -H 'content-type: application/json' -d '{"command":"uname -a","timeoutMs":60000}'
```

**Framework adapters (official guides, not packages) [F]:** OpenAI Agents SDK, by implementing `SandboxClient` from `@openai/agents/sandbox` (about 100 lines, including `resolveExposedPort` that mints `style.dev` names). Mastra, by extending `MastraSandbox` from `@mastra/core/workspace` and passing it to `new Workspace({ sandbox })`. Both are sponsor-aligned and copy-pasteable from the guides [1]. There is also an official **Convex component** (`freestyle-sh/convex`, pushed 5 Oct) [11]. The Freestyle docs also include "Run Supabase in a Sandbox", Chromium/noVNC (computer use), Docker, and Claude Code guides [1]. Agent Relay's docs include a "Run the answering agent on a Freestyle VM" recipe (in `agentrelay.com/llms-full.txt`, re-checked 29 Oct; publication date (unverified)). See `../agent-relay/01-docs-api.md` §9.6.

---

## 7. First 30 minutes checklist (do it **Thursday or Friday**, not Saturday)

1. `npx freestyle@latest login`, then `whoami` and `team current`. Create one shared **team** for your hackathon group so everyone's keys and VMs live in the same place.
2. `freestyle tokens create "haunted-dev" --output json` and put the key in `.env` (git-ignored) as `FREESTYLE_API_KEY`. For Terse, also run `terse secrets import .env` (per `../terse/03-github-code.md`, not re-verified here).
3. `npx freestyle@latest skill install` so Claude Code and Codex read current docs.
4. Smoke test: `freestyle vm create --slug smoke --no-ssh`, then `freestyle vm exec smoke -- docker run --rm hello-world`, then `freestyle vm delete smoke`.
5. Bake a **golden snapshot** with your stack: `freestyle snapshot create --base freestyle/ubuntu-sm --script ./setup.sh --slug haunted-base`. Keep app code out of it, because the rules say all code must be written at the event. Only put tooling in it.
6. Claim a `style.dev` name now and verify a hello-world loads over HTTPS. Names are first-come, so pick something team-unique, not `haunted`.
7. Run the edge-injection OpenAI test above once. CA trust and Docker are the usual failure points.
8. Saturday: redeem the attendee `FS-…` code onto the **shared team** (`freestyle billing redeem`), then check the dashboard wallet (dash.freestyle.sh), which charts daily spend before credits [3].
9. Pin `freestyle@<version>` in `package.json`.

---

## 8. Limits / could not verify

- **Not hands-on.** All latency numbers (p99 < 400 ms boot, < 50 ms snapshot, < 1 ms interruption) are vendor claims [2]. A third-party agent-readiness assessment grades Freestyle "C, 58.8/100" (#12 in Sandboxes, "from public evidence checked 8 October"); it is a docs/evidence review, not a benchmark [12].
- **How the $100 attendee credit interacts with the Free plan.** The pricing page says Free "never bills for usage" and hard-caps allowances, which suggests credits only matter past Free allowances on a paid plan, or come with a `planGrant`. The redemption mechanics are confirmed from CLI source; **this specific code's contents are not.** Ask the Freestyle table.
- **Exec timeout docs conflict.** `/vms` and `/vms/pty` say 5 min max. The 14 Oct changelog and OpenAPI say up to 24 h with an updated guest agent plus background requests. I could not verify which agent version base images ship.
- **Deprecated Git/Web Deploy APIs:** I could not determine whether they still answer requests, or a removal date. Treat them as gone.
- **No published general API rate limits.** (Corrected: a status page *does* exist at https://www.freestyle.sh/status; on 29 Oct it showed "All Systems Operational" for VMs, API, and Dashboard, "Last updated: October 25, 2026". It appears to be a static page, so it is not proof of live health.)
- **No official Python SDK** is current. The PyPI `freestyle` package's ownership and version (0.0.17, 2025) were not verified as Freestyle's.
- Concurrency counts *pausing* VMs. Whether a burst of N creates beyond 10 queues or fails was not tested (docs say "rejected").

---

## 9. Hackathon implications

**What to build (Freestyle as the hands of a stateful agent system):**
- **One Terse Durable Actor per agent, owning one Freestyle VM** (`@Resource`). The actor stores the `vmId`/slug and lifecycle. Alarms call `vm.pause()` and `start()`, so the agent "sleeps in its coffin" and wakes with memory intact. Agents coordinate over **Agent Relay**. That combination hits both host tracks and makes Freestyle the execution layer [I].
- **"Possession / multiverse" demo:** snapshot a live VM mid-task and fork 3-5 copies that try different strategies in parallel. Agents report over Relay and the winner's branch survives. Snapshot and branch is Freestyle's headline differentiator, and it shows well live [I][2].
- **Live viewable sandboxes:** serve each agent's dev server on `name.style.dev` and give judges a **browser terminal** (identity token plus `connectXterm`) into the haunted VM. This is the "Real-Time AI" visual [I].
- Keep the OpenAI key **at the edge** (TLS transform), not in VMs. It is a cheap, credible security story if a judge asks "what if the agent goes rogue?" [1].

**Gotchas:** required `firewall`. 30 s default exec timeout (use systemd or PTY for servers and agents). `scp` and `fs` write root-owned files. Docker containers do not inherit the CA or DNS steering for edge injection. Unmatched TLS `match` requests pass through **without** the key, not blocked. Free allows 10 concurrent VMs and max 4 vCPU (`ubuntu-lg` fails), and pausing VMs still count toward concurrency. `ttlSeconds` counts from creation. Snapshots require the VM to be running or paused. Anonymous `freestyle signup` does not work on macOS (the CLI source checks `process.platform === "linux"` and `arch === "x64"`). Hitting the 10-VM cap returns **429 `LIMIT_EXCEEDED`**, which naive retry wrappers will loop on. `exec` against a paused VM returns 409, so `start()` first (or let inbound domain traffic wake it). Use `freestyle@latest` only, because legacy packages hit the old API (Agent Relay's guide notes the `/v1` 401).

**What Freestyle (the sponsor) likely wants [I]:** projects that show what it says sets it apart: **long-running persistent agents, pause/resume with memory, snapshot branching, VPC/networking, credential injection**. Its own `about.md` lists "When not to use it": **"Run AI Code"** (short-lived Python scripts), CPU-intensive CI/CD, tasks averaging under 15 minutes, and **"Sole Application Hosting"** ("Not for hosting production applications ... we do not offer autoscaling, load balancers or CDNs and we don't plan to") [2]. So do not pitch Freestyle VMs as the thing that "scales to millions" for the Supabase prize; pitch Supabase as the scalable state layer and Freestyle as per-agent workbenches. A demo that only runs a 2-second Python snippet uses it the way its docs advise against. The $10k credit only comes with the grand prize, so Freestyle is a means to the main win, not its own track.

---

## Sources

- [1] Freestyle full docs bundle: https://www.freestyle.sh/docs/llms-full.txt (pages: /docs/quickstart, /docs/vms, /docs/vms/lifecycle, /docs/vms/files, /docs/vms/base-snapshots, /docs/vms/ssh, /docs/vms/client-sessions, /docs/vms/pty, /docs/vms/domains, /docs/vms/network/firewall, /docs/vms/network/tls-outbound, /docs/cli, /docs/vms/cli, /docs/vms/domains-cli, /docs/guides/give-your-openai-agent-a-sandbox, /docs/guides/give-your-mastra-agent-a-sandbox, /docs/guides/select-openai-models-and-inject-auth, /docs/guides/migrate-from-e2b). Index: https://www.freestyle.sh/docs/llms.txt. Fetched 29 Oct 2026.
- [2] About / site index: https://www.freestyle.sh/about.md, https://www.freestyle.sh/llms.txt, onboarding skill https://www.freestyle.sh/docs/onboard.md
- [3] Changelog (14 Oct 2026, 9 Sep 2026, Apr 2026 [BG]): https://www.freestyle.sh/changelog
- [4] npm `freestyle` 0.2.21 (published 2026-10-29), tarball source `src/client.ts`, `src/cli/commands/billing.ts`, `src/cli/anonymous.ts`, `README.md`: https://www.npmjs.com/package/freestyle. `freestyle-sandboxes` deprecation: https://www.npmjs.com/package/freestyle-sandboxes
- [5] Pricing and limits: https://www.freestyle.sh/pricing.md (= https://www.freestyle.sh/docs/vms/pricing-and-limits)
- [6] OpenAPI: https://www.freestyle.sh/openapi.json (also https://api.freestyle.sh/openapi.json). PyPI check: https://pypi.org/pypi/freestyle/json
- [7] SDK type docs for `timeoutMs` (default 30000) in `src/vms/types.ts` of freestyle@0.2.21
- [8] Deprecated Web Deploy reference [BG]: https://docs.freestyle.sh/API-Reference/deprecated/handle_deploy_web and https://docs.freestyle.sh/web/overview. Both returned **HTTP 404** on 29 Oct 2026; they may survive only in search caches.
- [9] Dev Server API deprecation, 18 Feb 2026 [BG]: https://www.freestyle.sh/blog/product/deprecating-dev-servers
- [10] YC deal runbook: https://www.freestyle.sh/yc.md
- [11] GitHub org: https://github.com/freestyle-sh (convex component https://github.com/freestyle-sh/convex, rigkit, Adorable)
- [12] Third-party review (unverified methodology): https://www.anchorterminal.com/tools/freestyle
- [13] Status page: https://www.freestyle.sh/status (fetched 29 Oct 2026)
- Event page: /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md. Sibling notes: ../agent-relay/01-docs-api.md §9.6, ../terse/01-docs-api.md

---

## Verification log (2026-10-29)

Adversarial re-check by curl/`npm pack`/`gh api` against live sources on 29 Oct 2026. Outcome key: **Confirmed**, **Corrected**, **Unverified**.

| # | Claim | Source re-checked | Outcome |
|---|---|---|---|
| 1 | 9 Sep 2026 changelog: "Freestyle is now focused on VMs. We've deprecated the standalone Git, code execution, web deployment, and scheduled trigger APIs." | freestyle.sh/changelog | **Confirmed**, verbatim. Newest entry is still 14 Oct 2026. |
| 2 | 14 Oct changelog: browser terminals, expiring identity tokens, scoped S3, exec up to 24 h on updated guest agents (older agents keep 5 min), wallet daily usage | freestyle.sh/changelog | **Confirmed.** |
| 3 | npm `freestyle` latest 0.2.21 published 29 Oct 23:02 UTC; "12 releases in ~60 days"; "eve of the event" | registry.npmjs.org/freestyle | **Corrected.** Timestamp confirmed (2026-10-29T23:02:52Z), but that is two days before the Saturday event, not the eve. 11 releases after 0.2.10. |
| 4 | `freestyle-sandboxes` deprecated in favour of `freestyle` | npm registry (0.1.46) | **Confirmed**: "This package has been deprecated. Please use freestyle instead." |
| 5 | PyPI `freestyle` is 0.0.17, last upload June 2025; `sandbox-sdks-py` last pushed June 2025 | pypi.org JSON; gh api | **Confirmed** (upload 2025-06-29; repo pushed 2025-06-29, not archived). PyPI metadata names no author/homepage, so ownership stays **unverified**. |
| 6 | "Node 20+" SDK requirement | `package.json` in 0.2.21 tarball | **Unverified**: no `engines` field. Marked in text. |
| 7 | Prices: vCPU-h $0.04032, GiB-h $0.0129, disk GiB-h $0.000086, transfer $0.02/GB; included 200 vCPU-h / 400 GiB-h / 60,000 disk-GiB-h; plan limits 10/40/400 concurrent; Free max 4 vCPU / 8 GiB / 32 GB | freestyle.sh/pricing.md | **Confirmed.** Recomputed: default VM = $0.2672/h, so $100 is about 374 h; `ubuntu-sm` $0.1336/h, about 748 h. 10 VMs x 5 h = 50 VM-h = $13.36. |
| 8 | Free plan: allowances exhausted means "VMs pause until monthly reset" | pricing.md | **Corrected**: VMs pause and must be resumed manually after reset. Added: Free cannot resize up. |
| 9 | YC deal: $5k + 1:1 match up to $25k + 6 months Hobby; "prize is about twice the standard YC offer" | freestyle.sh/yc.md | Terms **confirmed** (plus credits last 12 months). "Twice the YC offer" **corrected** to "twice the upfront credit". |
| 10 | Event credits: $100 Freestyle per attendee; $10k Freestyle credits only in grand prize | EVENT_PAGE.md | **Confirmed.** Whether the attendee code carries a `planGrant` is still **unverified**. |
| 11 | `promoPlanConflict` / `--replace-sponsorship` / `planGrant` in CLI billing code; anonymous signup is Linux x86-64 only | `dist/cli/commands/billing.js`, `src/cli/anonymous.ts` in tarball | **Confirmed.** |
| 12 | `exec-await`: default `timeoutMs` 30000, max 300000 inline, 86,400,000 backgrounded; non-zero exit is HTTP 200; `statusCode` null on timeout; stdin 1 MiB | openapi.json `ExecRequest` + SDK `src/vms/types.ts` | **Confirmed.** |
| 13 | OpenAPI v0.1.0 with 90 `/v5` operations; unversioned paths deprecated | openapi.json | **Confirmed** (180 ops total, 90 `/v5`, 90 deprecated unversioned). |
| 14 | Only documented 429 is on hardware power API | openapi.json | **Corrected**: `POST /v5/vms` and `/resize` also return 429 with `LIMIT_EXCEEDED` for plan limits. Added 409 behaviour on exec. |
| 15 | Background requests: header `x-freestyle-background-after-secs`, results kept 10 min; identity header `x-freestyle-identity-access-token` limited to exec/terminal routes | openapi.json | **Confirmed** ("Results expire ten minutes after completion"; inline-delivered results not kept). |
| 16 | Unauthenticated call returns `401 MISSING_CREDENTIALS` | `curl https://api.freestyle.sh/v5/vms` | **Confirmed.** |
| 17 | Vendor claims p99 < 400 ms start, sub-1 ms interruption, sub-50 ms snapshot-ready | freestyle.sh/llms.txt, about.md | **Confirmed as vendor claims only**; not measured. |
| 18 | "Not for Run AI Code / production hosting" | about.md "When not to use it" | **Confirmed**; expanded with the 15-minute and CI/CD caveats. |
| 19 | `firewall` required on `vms.create`; CLI `vm create` gives Internet by default, `--no-internet` removes; Docker containers need their own CA; unmatched `match` requests keep client headers | llms-full.txt | **Confirmed.** |
| 20 | Base images incl. `ubuntu-3xl` 64/128 GiB/256 GB and `kali` (Kali 2026.3) | llms-full.txt base-snapshots table | **Confirmed.** |
| 21 | Dev Server API removal announced for 1 Mar 2026 | blog post dated 2026-02-18 | **Confirmed** ("officially removing ... on March 1st, 2026"). |
| 22 | Old docs "still indexed" at docs.freestyle.sh | curl | **Corrected**: both cited URLs return 404. |
| 23 | "No status page was found" | freestyle.sh/status | **Corrected**: a status page exists. |
| 24 | Agent Relay "published a Freestyle agent hosting guide on 29 Oct" | agentrelay.com/llms-full.txt | Recipe **confirmed**; the 29 Oct publication date is **unverified** and was removed. |
| 25 | Convex component pushed 5 Oct; third-party "C" grade | gh api; anchorterminal.com | **Confirmed** (pushed 2026-10-05, 1 star; grade "C, 58.8/100", evidence checked 8 Oct). Org activity: Adorable 831 stars (pushed 25 Aug), rigkit 13 stars. |

Not re-checked this pass: the CLI command flags in section 4 beyond `--no-internet`/`--keep-vm`, the exact TLS rule JSON shapes in section 6, and the Mastra/OpenAI adapter line counts.
