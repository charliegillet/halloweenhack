# Freestyle (freestyle.sh): master brief for Haunted Hacks (31 Oct 2026)

Consolidated **29 Oct 2026** from five sub-reports in [`freestyle/`](freestyle/). Each sub-report was adversarially re-checked against live sources on 29 Oct. The editor re-checked the contradictions listed in §7 live on 29 Oct: npm registry, `api.freestyle.sh/openapi.json`, `www.freestyle.sh/openapi.json`, `pricing.md`, `/changelog`, `/products/vms`, `/status`, and both YC directory pages. **Nobody on the team has created a Freestyle account or booted a VM**, so every latency figure and every behavior below comes from docs, source code, or a third party.

Tags: **[F]** verified fact with a source. **[I]** inference. **[BG]** background, before Aug 2026.

| Sub-report | Angle | Use it for |
|---|---|---|
| [01-docs-api.md](freestyle/01-docs-api.md) | Docs, API, CLI, pricing | Copy-paste setup, lifecycle fields, error codes, credit math |
| [02-newest-features.md](freestyle/02-newest-features.md) | Aug-Oct 2026 releases | Dated timeline, feature status (GA/early/deprecated) |
| [03-github-code.md](freestyle/03-github-code.md) | Code reality | SDK source facts, Adorable patterns, incidents, version drift |
| [04-social-pulse.md](freestyle/04-social-pulse.md) | Social sentiment | X/HN/YouTube posts, praise, complaints, boat.dev pricing fight |
| [05-team-strategy.md](freestyle/05-team-strategy.md) | Team, strategy, competition | Founders, pivots, what impresses them, Superserve overlap |

---

## 1. Executive summary

1. **Freestyle now sells Linux microVMs and nothing else. [F]** The 9 Sep 2026 changelog says: "Freestyle is now focused on VMs. We've deprecated the standalone Git, code execution, web deployment, and scheduled trigger APIs." The current platform is VMs, snapshots, networking (firewall, VPCs, WireGuard, TLS rules), domains and identities ([changelog Sep 9](https://www.freestyle.sh/changelog/changelog-september-9)). The organizer's description of Freestyle as "sandboxes/VMs/git/deploy" is out of date. Most public example code and most of what LLMs remember (`freestyle-sandboxes`, `freestyle.git`, `freestyle.serverless`, `@freestyle-sh/with-*`) target the dead API.
2. **The SDK is `freestyle` on npm, latest `0.2.21`, published 2026-10-29T23:02Z. [F]** It is TypeScript and ESM only, with the CLI in the same package. It has had 30 publishes since 7 Aug, and fields were removed even within 0.2.x (`persistence` is gone). Pin the exact version. There is no maintained Python SDK; from Python, call REST `/v5`.
3. **Two settings break most first attempts. [F]** `firewall` is **required** on `vms.create`, and with no rules the VM has no egress. `vm.exec` **times out after 30 s by default**, and a non-zero exit returns normally rather than throwing.
4. **Free-plan limits constrain a demo more than money does. [F]** Free allows 10 concurrent VMs, 10 saved VMs, 10 snapshots, at most 4 vCPU / 8 GiB / 32 GB per VM, and 200 vCPU-h plus 400 GiB-h per month as a **hard** cap. Ten default-size VMs running for the 5-hour build use exactly one month's allowance. Nobody has published how the $100 attendee credit interacts with the Free caps. Ask at check-in.
5. **What Freestyle pushes [F] and so what it will reward [I]:** long-running agents on a real VM; memory-preserving pause/resume; snapshot-then-branch; credentials injected at the edge so they never enter the VM; humans watching live through a browser terminal (`connectXterm`, 14 Oct) or a `*.style.dev` URL. Its own docs say not to use it for short Python snippets, CPU-heavy CI, tasks under 15 minutes, or production hosting.
6. **People and politics. [F]** Freestyle is YC **S24** (the event page's "F24" belongs to freestyle.ai, an unrelated email assistant). It has two ex-Apple dropout founders, Ben Swerdlow (CEO) and Jacob Zwang (CTO), runs on its own bare metal with its own Rust KVM hypervisor, and has about 5 people. On 25 Oct Swerdlow publicly promoted this event and he is friendly with Terse. **Superserve, a co-sponsor, is a direct competitor:** in an Oct benchmark it beat Freestyle on cold start, while Freestyle won resume.
7. **Social volume is low and mostly comes from the founder. [F]** The live thread is a 27-28 Oct pricing fight with boat.dev, in which Swerdlow conceded "we aren't" the cheapest. The feature third parties praise is memory snapshot and fork, but E2B and Modal are now credited with forking running sandboxes too.

---

## 2. What matters for Haunted Hacks

> - **There is no Freestyle track.** Freestyle's prize is the **$10,000 in credits inside the grand prize**, plus $100 per attendee. Freestyle pays off only if it is load-bearing in a project that wins the grand prize or a host track (Durable Actors: iPhone; Agent Relay: Mac mini).
> - **Recommended architecture [I]:** one Terse Durable Actor per agent is the controller and owns one Freestyle VM (slug, snapshot IDs, lifecycle). Agents talk over Agent Relay. The VM is an untrusted tool, and the OpenAI key is injected at the edge. This matches Swerdlow's stated philosophy ("treat the VM as a tool the agent is using") and counts for both host tracks.
> - **Demo moment:** snapshot a running VM, boot N copies from it with memory intact, let agents race, keep the winner. Show it live in browser terminals and on `style.dev` URLs. **Call it "snapshot-and-branch", not "live fork"**, because no fork API exists.
> - **Do before Saturday:** create an account and a shared team, mint an API key, `npx freestyle@0.2.21 skill install`, run a smoke test (create, exec, style.dev, delete), bake a tools-only golden snapshot (all code must be written at the event), and test edge injection of the OpenAI key.
> - **Ask at the Freestyle table:** does the `FS-` attendee code carry a plan grant (Hobby: 40 VMs, 1,000 snapshots), or does it stay inside the Free caps?
> - **Do not:** say "F24", cite a "$10M Series A" (that was a diaper brand), pitch Freestyle VMs as what "scales to millions" (its docs rule out production hosting), or use any git/deploy/execute API.

---

## 3. Key facts

### 3.1 Company

| Item | Value | Source |
|---|---|---|
| YC batch | **S24** (Summer 2024), primary partner Diana Hu, team size 5. Re-checked live 29 Oct | [YC](https://www.ycombinator.com/companies/freestyle) |
| Event page label | "Freestyle (F24)" is wrong. F24 is freestyle.ai (Gmail assistant, Allen Naliath, renamed from Friday in Jul 2026). Re-checked live: that YC page shows Fall 2024 | [YC freestyle-ai](https://www.ycombinator.com/companies/freestyle-ai) |
| Founders | Ben Swerdlow (CEO, UChicago dropout, Apple consultant), Jacob Zwang (CTO, senior engineer in Apple Conversational Engineering at 19) | [YC](https://www.ycombinator.com/companies/freestyle), [swerdlow.dev](https://www.swerdlow.dev/) |
| Handles | @freestyle_dev (8 tweets, 418 followers), benswerd (X/HN), @theshortjacob (seen only via a retweet) | Nitter mirror, 05 |
| Infra | Own hardware, bare metal, KVM hypervisor written in Rust with "layered copy-on-write memory" | [careers](https://www.freestyle.sh/careers) |
| Funding | Only YC-standard money is visible ($500K on aVenture; LinkedIn's $625K not re-checked). A "$10M Series A, Silas Capital" belongs to freestyle.world (diapers) | [aVenture](https://aventure.vc/companies/freestyle-san-francisco-ca-us/fundraising), 05 §3 |
| ICP | Platforms building coding agents, not individual developers ("Our users are platforms") | [Launch HN](https://news.ycombinator.com/item?id=47663147) [BG] |
| Pivots | 2024 Cloudstate "TypeScript for EVERYTHING", then 2025 serverless/Git/Dev Servers, Feb 2026 Dev Servers removed, Apr 2026 Launch HN "Sandboxes for Coding Agents" (322 pts), **9 Sep 2026 VM-only** | 05 §4 |

### 3.2 Product and SDK

| Item | Value | Source |
|---|---|---|
| npm package | `freestyle` **0.2.21** (`latest`), 2026-10-29T23:02:52Z, re-checked live. MIT, ESM, dependencies `ws`/`yargs`/`dotenv`, no `repository` field, core SDK not on GitHub | npm |
| Cadence | 0.2.0-beta.0 on 7 Aug, then 0.2.0 GA on 21 Aug, then 0.2.21. 30 publishes; 0.2.18-0.2.20 all on 14 Oct | npm `time` |
| Downloads | 143,510 in the week of Oct 22-28. Monthly: Jul 89,224 / Aug 121,055 / Sep 189,526 / Oct 353,067 (through the 28th). Deprecated `freestyle-sandboxes` still gets 32,671/wk | npm downloads API |
| SDK namespaces (0.2.21) | `customers, vms, vpc, tunnels, firewall, tls, domains, identities`. **No** git/deploy/execute/fork | tarball grep (02, 03) |
| API | `https://api.freestyle.sh/v5`, Bearer auth. **55 paths = 90 operations**, re-counted live 29 Oct. `www.freestyle.sh/openapi.json` also lists 55 deprecated unversioned paths. No path for fork, git or deploy | live OpenAPI |
| Base images | `busybox` 1/128 MiB; `ubuntu-sm` 2/4 GiB/16 GB; `ubuntu` (default) 4/8/32; `ubuntu-lg` 8/16/64 (Hobby); `-xl`/`-2xl` (Pro); `-3xl` (Enterprise); `kali` 4/8/32 (Kali 2026.3) | docs base-snapshots |
| Ubuntu image ships | Node LTS, Bun, Python+uv, Docker (daemon running), systemd, git, tmux, `claude`, `codex`, `opencode`, `openai`/`openai-agents`/`anthropic` Python packages | docs |
| Python | PyPI `freestyle` 0.0.17 (Jun 2025, owner unverified). Treat it as nonexistent | PyPI |
| Status page | [freestyle.sh/status](https://www.freestyle.sh/status), "All Systems Operational", looks static (last updated 25 Oct) | 01 |

### 3.3 Pricing and plan limits ([pricing.md](https://www.freestyle.sh/pricing.md), re-checked live)

| | Free | Hobby | Pro |
|---|---|---|---|
| Price | $0, never bills usage | $50/mo minimum (counts as usage) | $500/mo minimum |
| Concurrent VMs (running, starting or **pausing**) | **10** | 40 | 400 |
| Saved VMs / snapshots | **10 / 10** | 200 / 1,000 | 4,000 / 12,000 |
| Per-VM max (an upper bound; smaller sizes allowed) | **4 vCPU / 8 GiB / 32 GB** | 8 / 16 / 64 | 32 / 64 / 256 |
| Resize up | No | Yes | Yes |

- Rates: vCPU-h $0.04032; GiB-RAM-h $0.0129; disk GiB-h $0.000086; egress $0.02/GB; intra-VPC traffic free. Every plan includes 200 vCPU-h, 400 GiB-h and 60,000 disk-GiB-h per month. **On Free these are hard caps: VMs pause when the allowance runs out and stay paused until you resume them by hand after the monthly reset.** A paused VM holds no compute and bills storage only.
- Credit math [I]: a default VM costs about $0.267/h, so $100 buys about 374 h (about 748 h on `ubuntu-sm`). Ten default VMs for 5 h = 50 VM-h, about $13.40 list price, and exactly the Free month's 200 vCPU-h.
- Credits arrive as a single-use code redeemed with `freestyle billing redeem FS-XXXXXXXXXX`. They land on the **active team**. A code that carries a plan conflicts with an existing sponsorship (`promoPlanConflict`, overridden by `--replace-sponsorship`) [F, CLI source].
- YC founder deal: $5k credits (12 months) + 1:1 match up to $25k + 6 months of Hobby ([yc.md](https://www.freestyle.sh/yc.md)). The $10k prize is twice the deal's upfront credit.

---

## 4. Newest features (Aug-Oct 2026, dated)

| Date | Item | Notes |
|---|---|---|
| 21 Aug | `freestyle@0.2.0` becomes `latest` (v5 rewrite) | 8 betas from 7 Aug |
| 25 Aug | Adorable ("Open Source Lovable", 831 stars) moves to VMs | Last push. Best official reference app |
| 1 Sep | Rigkit launch post ("Terraform for dev environments") | Repo dates from 2 May; 13 stars; v0.3.0 on 2 Sep |
| **9 Sep** | **Changelog: VM-only pivot.** Git/code-exec/web-deploy/trigger APIs deprecated. Firewall API (required on create), dual-stack VPCs, WireGuard, custom egress, `style.dev` domains, edge credential injection (headers, Postgres, private Git), forward auth, persistent named PTYs, scoped identity tokens, 16 GiB file transfers, live resize (grow-only), 32 vCPU/64 GiB/256 GB on Pro, Ubuntu 24.04 + BusyBox images | No removal date for the deprecated APIs |
| 14-23 Sep | Comparison posts (approval-wait/pause, networking, adaptability), Sprites takedown (23 Sep) | Pause/resume claimed at "low tens of milliseconds" |
| 23 Sep / 5 Oct | `@freestyle-sh/convex` 0.1.0 + "Workbench" demo (edge-injected Convex credential) | Unannounced; 1 star |
| 4 Oct | "Boat.dev vs Freestyle" ("Boat.dev is cheaper") | |
| **14 Oct** | **Changelog:** browser terminals via `connectXterm`, expiring client tokens, `vm.exec` up to 24 h (**only on VMs with an updated guest agent**; older agents stay at 5 min), scoped S3 signing, domain-allowlist egress, method/path match + JSON Patch transforms, faster snapshots, wallet daily estimates. New guides: OpenAI model selection + auth injection, E2B and OpenShell migration | Newest changelog entry as of 29 Oct (re-checked) |
| **24 Oct** | Blog: `freestyle/kali` base snapshot (Nmap, sqlmap, Metasploit, radare2) | Blog only, not in the changelog. Uses the whole Free per-VM max |
| 29 Oct | `freestyle@0.2.21`: `customers` namespace ("No billing semantics"), GET/HEAD/OPTIONS-only retry on 502/503/504 | Unannounced. Create and exec are **never** auto-retried |
| Undocumented | `/v5/hardware` ("physical machines attached to your private networks") in the live OpenAPI | Not in docs or changelog. Do not use |
| Teased | Swerdlow, 25 Oct: "really fun next 3 weeks" of sandboxing improvements | A release could land around 31 Oct |

Announced-only or unclear: five posts on dedicated LLM inference (22 Sep) with no product page or pricing, so it is not verified as a product. Startup claims drift: "~500ms" (Apr), "p99 under 400 ms" (about.md), "about 65ms" (homepage/products). A third-party harness measured median cold start at 0.69-0.72 s from the client side ([aisandboxbench](https://aisandboxbench.com/), 22-26 Oct).

---

## 5. Social sentiment (detail in [04](freestyle/04-social-pulse.md))

- **Volume:** in 30 days, 5 matching X posts (51 likes), all from Swerdlow or replies to him; 0 relevant Reddit, HN or YouTube items in the window. The last real spike was Launch HN on 6 Apr (322 pts, 158 comments) [BG]. Searching is hard because the name collides with wrestling, swimming, Freestyle Libre, freestyle.ai and freestyle.world.
- **Pricing fight (27-28 Oct):** boat.dev lists Freestyle at $0.264/h, 7x boat's price, and its benchmark ran 9.6 runs/s for Freestyle against boat's 27.7 (a competitor's benchmark; boat's own footnote calls it "indicative, not a like-for-like race"). Swerdlow: "Is this coordinated?" and "Freestyle doesn't claim to be the cheapest sandbox; we aren't ... the boat homepage chart is fairly misleading." He said "10x"; boat's live chart shows 7x.
- **Praise [BG mostly]:** memory fork/snapshot ("genuinely impressive technology", The Agent Post; "meaningful primitive", AI Beat), full Linux with root and nested virtualization (TechStackups), a hosted docs MCP, and a responsive founder.
- **Complaints:** "how is this different from E2B/Daytona?"; long-lived TCP breaks in forks (Swerdlow: "remote Postgres can break in the forks, stuff like Websockets just automatically reconnects"; forks "all think they are the same IP"); poor discoverability (left out of Oct comparisons by Lizard, UseAgent, Infragap, Databricks and c17); a combative blog tone; slow on CPU-bound loops, which matches its own "not for CPU-heavy CI" note.
- **Ties to hosts and sponsors:** Swerdlow quote-tweeted Terse's YC launch ("terse terse"), promoted Haunted Hacks on 25 Oct ("Lets get freaky (hacker style)!"), did a Mastra "Agents Hour" episode (4 Aug), and Rivet's actor sandbox adapter lists Freestyle. The Oct 19 reply asking `@IncTerse` "how do we get some freestyle.sh vms in there?" is **unverified** in re-check (x.com could not be fetched).
- **Founder taste [I]:** games and benchmarks (Brood War Bench, mid-Sep: StarCraft agents "in parallel across Freestyle VMs"; finding: Codex subagents "didn't communicate much with one another"), Minecraft "AI building all of SF" (27 Oct), creative tools (Jacob's Blendmux), "cursed agents" demo nights. Follow-up venue: "Better Call Claude", Thu 5 Nov, 7-9 PM, 475 Sansome St ([luma](https://luma.com/freestyle-yh5k)).

---

## 6. Competitive context

| Rival | Relationship | Fact [F] |
|---|---|---|
| **Superserve (F26, co-sponsor)** | Near-identical pitch: Firecracker VMs, <50 ms start, pause with memory, fork, keys outside the machine | Won "fastest cold start" (0.52 s) and snapshot start on aisandboxbench. Freestyle won "fastest resume" (0.35 s / 0.32 s). Open source, with a Python SDK |
| E2B / Modal | Now credited with forking running sandboxes | Databricks (28 Oct): E2B CLI "can fork a running sandbox into new ones" |
| boat.dev | Much cheaper per hour | See pricing fight |
| Daytona | "boot[s] faster" (Swerdlow concedes) | Launch HN [BG] |
| gobare benchmark (5 Oct) | $4.44 per 1,000 sessions; most expensive only at 50-95% idle; kept memory and processes on pause | Ran at 4/8 because the author believed Free "won't go below" that, which contradicts the docs (see §7) |

[I] What sets Freestyle apart: full-VM depth (Docker, systemd, nested virtualization, Kali, 64 GiB), VPC/WireGuard networking, and a richer edge-transform API. If you use both Superserve and Freestyle, give them different roles, for example Superserve for cheap ephemeral runs and Freestyle for the heavyweight, branchable world.

---

## 7. Contradictions resolved or flagged

| # | Conflict | Resolution |
|---|---|---|
| 1 | Event page says **F24**; 02 left it open; 04/05 say S24 | **Resolved: S24.** YC pages re-fetched 29 Oct: `/companies/freestyle` shows Summer 2024, `/companies/freestyle-ai` shows Fall 2024 |
| 2 | 01 says OpenAPI has "90 /v5 operations"; 02/03 say "55 paths" | **Both right.** Live count: 55 `/v5` paths = 90 operations. `www.freestyle.sh/openapi.json` has 110 paths in total (55 deprecated unversioned) |
| 3 | `products/vms` advertises "live forking" (re-checked live in page meta); 05 calls "live fork of a running computer" the core judge-pleaser | **No fork method exists** in SDK 0.2.21 or the live API. Branching = `vm.snapshot()` then `vms.create({ snapshotId })`, which captures memory and disk from a running or paused VM. Pitch "memory-preserving snapshot-and-branch". Do not claim it is unique (E2B, Modal and Superserve claim fork too) |
| 4 | 01 TL;DR: "a 5-hour hackathon is nowhere near either limit"; 03: "10 default VMs exhaust the month in ~5 h" | **03 is right at maximum use.** 10 × 4 vCPU × 5 h = 200 vCPU-h = the Free month (01's own table says the same). Fine for normal use, but size VMs down and pause idle ones |
| 5 | 01: "pausing VMs still count toward concurrency"; 02: "paused VMs release budget" | **Both right.** pricing.md (live): concurrency counts VMs "running (or starting or pausing)", and "stopping or pausing releases its share". *Paused* VMs do not count; VMs in the middle of *pausing* do |
| 6 | Exec max is 5 min (`/vms`, `/vms/pty` docs, Mastra guide caps at 300,000 ms) vs 24 h (14 Oct changelog, OpenAPI) | **Flagged.** 24 h needs an updated guest agent plus background requests. Nobody knows which base images ship the new agent. Run long work in named PTY sessions or systemd |
| 7 | gobare: Free "won't go below 4 vCPU / 8 GB"; 05 originally said "Free minimum 4/8" | **Refuted by docs** (re-checked): per-VM maximums "are upper bounds, not fixed sizes", and `ubuntu-sm` (2/4) and `busybox` are Free images. 4/8/32 is the default and the Free maximum |
| 8 | Coshell (3 Oct) prize: 05 "$10k + 6 mo Pro per winner"; 02 notes a source split | **Both sources exist:** the Luma page has the $10k + 6 mo Pro line; coshell.ai/hack shows only "$500 in credits, redeemed on the day" |
| 9 | Apple roles | **Corrected in 05:** only Jacob was in Conversational Engineering; Ben was a consultant who "became a senior" |
| 10 | Changelog vs blog provenance | Kali is from the 24 Oct blog post, not the changelog. The E2B/OpenShell migration guides and the OpenAI injection guide are in the **14 Oct** changelog, not 9 Sep |
| 11 | Price: Freestyle list $0.267/h vs boat's listing $0.264/h | Minor. Freestyle's own rates give $0.2672/h for 4/8/32 including disk; boat's figure likely leaves out disk [I] |
| 12 | Agent Relay's Freestyle recipe "published 29 Oct" | Recipe exists in `agentrelay.com/llms-full.txt`; **date unverified** |

---

## 8. Gotchas (merged, ranked by how early they bite)

1. **Stale material everywhere.** Ignore `freestyle-sandboxes`, `freestyle.git`, `freestyle.serverless`, `VmSpec().with(...)`, `gitRepos`, `domains.mappings`, `@freestyle-sh/with-*` (peer-depends on `freestyle ^0.1.46`), `*.vm.freestyle.sh`, and `vm-api.freestyle.sh` (times out; its cert expired 27 Jul). LLM coding agents generate these by default, so install the docs skill.
2. **`firewall` is required, and egress is default-deny.** Without `{ action: "allow", source: {}, destination: { public: true } }` there is no npm, git or OpenAI access, and the failure looks like a network hang. The README's no-argument `vms.create()` throws. VMs on the same VPC also need an explicit allow ("Membership is not permission"). The CLI `vm create` gives internet by default; the SDK does not.
3. **`exec` defaults to 30 s.** Pass `timeoutMs` (≤300,000 inline). A non-zero exit returns HTTP 200; check `statusCode`, which is `null` on timeout. Exec on a paused VM returns **409**, so `start()` first. `VM_NON_RESPONSIVE` mid-command means the command may already have run.
4. **Plan limits return HTTP 429 with `LIMIT_EXCEEDED`** on `POST /v5/vms` and `/resize`. Branch on `code`. Backoff-retry will loop forever, so pause or delete a VM instead. Create and exec are never auto-retried; use a `slug` to make them idempotent.
5. **Free caps for a fork demo:** 10 concurrent, 10 saved (stopped VMs count), 10 snapshots. One base plus up to 8 branches is the practical ceiling. Delete forks and snapshots between rehearsals, and write a teardown script (`vms.list` by metadata, then delete).
6. **Version churn:** `persistence` was removed between 0.2.2 and 0.2.21. Pin exactly and commit the lockfile. For Adorable, run `npm install` from the **repo root**; the nested `adorable/package-lock.json` is stale, and `^0.2.2` resolves to 0.2.21 and breaks.
7. **Edge injection details:** the VM must trust the Freestyle CA (`NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt`). **Docker containers do not inherit the CA or DNS steering.** Requests that don't match a rule pass through **without** the key; they are not blocked.
8. **Forks share the parent's network identity.** Remote Postgres and other long-lived TCP connections can break, and WebSockets reconnect. Keep the database outside the VM (Supabase) and add reconnect logic.
9. **Files written via `scp`/`fs` are root-owned**, and the default exec user is `ubuntu`, so `chown` them or use `vm.linuxUser("root")`.
10. **The SDK does not read `.env`** (the CLI does), so load dotenv yourself. CLI team selection is independent of the dashboard; check `freestyle team current` before you redeem credits.
11. **`ttlSeconds` counts from creation**, not from now. Snapshot slugs are unique, so release the old slug before rebuilding a base.
12. **Anonymous `freestyle signup` is Linux x64 only**, and `/v5/free-tier/binary` returned 503 when probed. Sign up at dash.freestyle.sh.
13. **Reliability history [BG]:** in May 2026, on the legacy platform, suspend failed 19/37 times and snapshot failed about 43-50% of the time (retries usually worked). Nobody knows whether v5 has the same problem, so wrap `snapshot()` in a retry and rehearse.
14. **Don't do CPU-heavy builds live.** Hosts are oversubscribed, so bake dependencies into the snapshot.
15. **Agent Relay's `@agent-relay/sandbox` Freestyle adapter** (v0.1.16) supports exec and file transfer only. It does not offer snapshot, fork or PTY "without the required live proof", so call the `freestyle` SDK directly for lifecycle.

---

## 9. Integration recipes

All snippets target `freestyle@0.2.21` and come from the docs and SDK source. None were run (full versions in [01 §6](freestyle/01-docs-api.md) and [03 §5](freestyle/03-github-code.md)).

**A. Boot, run, publish, branch**
```ts
import { Freestyle } from "freestyle";
const fs = new Freestyle();                        // reads FREESTYLE_API_KEY from the real env
const egress = { rules: [{ action: "allow", source: {}, destination: { public: true } }] };
const { vm, vmId } = await fs.vms.create({ snapshotId: "freestyle/ubuntu-sm", slug: "ghost-1",
  firewall: egress, idleTimeoutSeconds: 600, ttlSeconds: 8 * 3600 });
const r = await vm.exec({ command: "node -v && docker ps", timeoutMs: 120_000 });   // check r.statusCode
await vm.pty.open({ slug: "dev", exec: "cd /workspace && npm run dev", replaceOnExit: true }); // then session.detach()
await fs.tls.rules.create({ action: "allow", domain: "ghost-yourteam.style.dev",
  source: { public: true }, destination: { vmId, port: 3000 } });                   // free HTTPS, first-come
const { snapshotId } = await vm.snapshot({ slug: "ghost-base" });                   // memory + disk
const forks = await Promise.all([1, 2, 3].map(i =>
  fs.vms.create({ snapshotId, slug: `ghost-fork-${i}`, firewall: egress })));
await vm.pause(); await vm.start();                                                 // memory intact
```

**B. OpenAI key never enters the VM** (14 Oct guide): create a TLS rule with `domain: "api.openai.com"`, `source: { vmId }`, `destination: { public: true }`, and `match: { method: ["POST"], path: { exact: "/v1/responses" } }`. Give it `transform: [{ headers: { authorization: "Bearer <real key>" } }, { jsonPatch: [{ op: "add", path: "/model", value: "<model>" }] }]`. Inside the VM, use `new OpenAI({ apiKey: "unused" })` together with `NODE_EXTRA_CA_CERTS`. For a locked-down VM, use `firewall: { rules: [] }`.

**C. Live browser terminal for judges** (14 Oct): on the server, `identities.create()`, then `identity.permissions.vm.grant({ vmId })`, then `identity.tokens.create({ expiresAt })`. In the browser, `new Freestyle({ identityAccessToken })` plus `connectXterm({ pty, terminal })`. Token holders can reach only the exec and PTY routes of the granted VMs.

**D. Terse Durable Actor as the VM owner [I]:** actor state = `{ vmSlug, baseSnapshotId, forkIds[], phase }`. Use the slug for idempotent create. Actor alarms call `pause()`/`start()` ("agent sleeps in its coffin"). The actor streams fork status to the UI in real time. The agent loop runs in the actor, outside the VM. See `../terse/` for the actor API.

**E. Agent Relay between forks [I]:** each fork's agent posts progress and results to a Relay channel, and a judge agent picks the winner. This directly answers Swerdlow's Brood War finding that subagents "didn't communicate much". Use Relay for messaging only.

**F. Pairing with other sponsors [F]:** official guides cover the OpenAI Agents SDK (`SandboxClient` from `@openai/agents/sandbox`, about 100 lines, ports mapped to `style.dev`), Mastra (`MastraSandbox` subclass; foreground commands only, background processes need PTY), and "Run Supabase in a Sandbox" (Swerdlow's favorite stress test: 11 services). There is also an official Convex component.

**G. Python:** use raw REST. `POST https://api.freestyle.sh/v5/vms` with `Authorization: Bearer $FREESTYLE_API_KEY` and a JSON body that includes `firewall`, then `POST /v5/vms/{id}/exec-await`. For longer than 5 min, add the header `x-freestyle-background-after-secs: N` and poll `/v5/background-requests/{id}`; results are kept for 10 min.

---

## 10. Limits / could not verify

- **No hands-on test.** Boot time (65 ms / p99 <400 ms), snapshot (<50 ms) and pause (tens of ms) are vendor claims. The only independent latency data is aisandboxbench, whose operator was not identified.
- **What the $100 attendee `FS-` code contains**, including whether it carries a plan grant, and whether credits matter at all on a Free plan that never bills.
- **Which base images ship the updated guest agent** that allows 24 h exec.
- **Whether the deprecated Git/deploy/exec APIs still respond**, and when they will be removed (the legacy paths return a 401 with a different shape, which hints at a separate gateway [I]).
- **Whether v5 still has the legacy snapshot/suspend failures.**
- **Burst behavior past 10 VMs.** The docs say such requests are "rejected"; nobody has tested whether they queue.
- **Social:** Reddit was blocked (403), Nitter search was rate-limited, and the Oct 1 and Oct 19 Swerdlow posts and the Mastra podcast quotes could not be re-verified. The Discord, where most real user feedback probably lives, was not accessed.
- **Judges are TBA.** No evidence yet that a Freestyle founder will judge.
- LinkedIn's $625K funding figure and its 4-employee count were not re-fetched. The PyPI `freestyle` owner is unknown.

---

## 11. Hackathon implications

**What to build (ranked) [I]:**
1. **"Haunted Multiverse" branch race.** A Terse Durable Actor owns the task or game state. On a trigger it snapshots a running Freestyle VM (a browser game, a text MUD, or a Minecraft server, which is Swerdlow's own HN example and current obsession) and boots 3-8 branches. Agents on Agent Relay each take a different path, the UI streams every branch's terminal and `style.dev` preview live, and the actor "collapses" to the best timeline. This covers both host tracks, the grand prize and the real-time theme. Show memory being identical across branches (same game tick), then show them diverge.
2. **"Cursed pentest" red team.** `freestyle/kali` plus a deliberately vulnerable target on a private VPC (needs an explicit firewall allow). Agents coordinate over Relay, each exploit hypothesis is snapshotted and branched, and an actor holds the evidence log. This builds on Freestyle's newest launch (24 Oct). Kali uses the full 4/8/32 Free maximum, so budget for it.
3. **Agent benchmark arena.** Real-time game matches in parallel VMs with a live leaderboard, in the spirit of Brood War Bench.

**How to pitch it to judges:** say "The agent loop lives in a Durable Actor; the VM is an untrusted tool; the OpenAI key never enters the VM; agents coordinate over Agent Relay." For the Supabase "scale to millions" prize, put state in Supabase and present Freestyle as per-agent workbenches, not as hosting.

**Setup before Oct 31:**
1. Sign up at dash.freestyle.sh. Run `npx freestyle@0.2.21 login`, `team current`, and create a shared team. Run `freestyle tokens create "haunted" --output json` and put the key in a git-ignored `.env`.
2. `npx freestyle@0.2.21 skill install` so Claude Code and Codex read current docs.
3. Smoke test: create with an egress firewall, exec with `timeoutMs`, Docker hello-world, a `style.dev` rule, curl it, delete.
4. Bake a tools-only golden snapshot (`freestyle snapshot create --base freestyle/ubuntu-sm --script ./setup.sh --slug <team>-base`). Time one snapshot-to-create round trip and one pause/resume.
5. Test edge injection of the OpenAI key once; CA trust and Docker are where it usually fails.
6. On Saturday morning, check `npm view freestyle version` and pin it. Redeem the `FS-` code onto the shared team and ask about a plan grant.

**What Freestyle wants to see:** VMs that are load-bearing, meaning long-running, stateful, branched, secrets kept out, and visible live. It will not reward Freestyle used as a 2-second code runner or a web host. A polished, shareable demo that names Freestyle is worth extra, because its weak spot is discoverability, and Swerdlow amplifies projects on X [I].

---

## Sources (merged, deduplicated)

**Freestyle first-party**
- Changelog: https://www.freestyle.sh/changelog · https://www.freestyle.sh/changelog/changelog-september-9 · https://www.freestyle.sh/changelog/changelog-october-14 · [BG] https://www.freestyle.sh/changelog/changelog-april-11 · https://www.freestyle.sh/changelog/changelog-april-17
- Docs: https://www.freestyle.sh/docs/llms.txt · https://www.freestyle.sh/docs/llms-full.txt · https://www.freestyle.sh/docs/onboard.md · https://www.freestyle.sh/docs/vms/pricing-and-limits · https://www.freestyle.sh/pricing.md · https://www.freestyle.sh/docs/vms/network/firewall.md · https://www.freestyle.sh/docs/vms/client-sessions · https://www.freestyle.sh/docs/vms/base-snapshots/kali · https://www.freestyle.sh/docs/guides/give-your-openai-agent-a-sandbox · https://www.freestyle.sh/docs/guides/give-your-mastra-agent-a-sandbox · https://www.freestyle.sh/docs/guides/select-openai-models-and-inject-auth · https://www.freestyle.sh/docs/guides/migrate-from-e2b
- Site: https://www.freestyle.sh/ · https://www.freestyle.sh/about.md · https://www.freestyle.sh/llms.txt · https://www.freestyle.sh/products/vms · https://www.freestyle.sh/careers · https://www.freestyle.sh/yc.md · https://www.freestyle.sh/status
- API: https://api.freestyle.sh/openapi.json · https://www.freestyle.sh/openapi.json
- Blog: https://www.freestyle.sh/blog · https://www.freestyle.sh/blog/product/introducing-rigkit · https://www.freestyle.sh/blog/product/ai-agent-waiting-for-approval-sandbox-state · https://www.freestyle.sh/blog/product/adaptability-of-sandboxes · https://www.freestyle.sh/blog/opinion/sprites-connectors-terrible-api-design · https://www.freestyle.sh/blog/product/boat-dev-vs-freestyle · https://www.freestyle.sh/blog/engineering/how-i-built-blendmux · https://www.freestyle.sh/blog/product/give-your-ai-security-agent-a-kali-vm · https://www.freestyle.sh/blog/engineering/dedicated-vs-shared-llm-inference · https://www.freestyle.sh/blog/opinion/designing-apis-for-agents · https://www.freestyle.sh/blog/opinion/why-ai-sandboxes-suck · https://www.freestyle.sh/blog/opinion/youre-starving-your-agent · https://www.freestyle.sh/blog/product/top-5-openai-agents-sdk-sandboxes · https://www.freestyle.sh/blog/product/top-5-most-powerful-sandboxes · https://www.freestyle.sh/blog/product/questions-to-ask-before-choosing-a-sandbox-provider · https://www.freestyle.sh/blog/engineering/next-gen-app-builder [BG] · https://www.freestyle.sh/blog/product/deprecating-dev-servers [BG]

**Packages and code**
- npm: https://www.npmjs.com/package/freestyle · https://www.npmjs.com/package/freestyle-sandboxes · https://www.npmjs.com/package/@freestyle-sh/with-nodejs · https://www.npmjs.com/package/@freestyle-sh/convex · https://api.npmjs.org/downloads/point/last-week/freestyle · PyPI https://pypi.org/project/freestyle/
- GitHub: https://github.com/freestyle-sh · https://github.com/freestyle-sh/Adorable (incl. `adorable/lib/project-vm.ts`, `scripts/bootstrap-base-snapshot.mjs`, root `package-lock.json`) · https://github.com/freestyle-sh/rigkit · https://github.com/freestyle-sh/convex · https://github.com/freestyle-sh/browser-bench · https://github.com/freestyle-sh/freestyle-sync · https://github.com/freestyle-sh/sandbox_sdks · https://github.com/freestyle-sh/cloudstate
- Issues: https://github.com/freestyle-sh/freestyle-sh/issues/1 · https://github.com/lawrencecchen/freestyle-suspend-repro · https://github.com/manaflow-ai/cmux/issues/11617 · https://github.com/freestyle-sh/Adorable/issues/28 · https://github.com/freestyle-sh/rigkit/issues/45 · https://github.com/openclaw/crabbox/issues/955 · https://github.com/openclaw/crabbox/issues/965
- Ecosystem: https://github.com/AgentWorkforce/sandbox · https://rivet.dev/agents/docs/sandbox-adapter/ · https://github.com/rivet-dev/rivet/tree/main/examples/ai-and-user-generated-actors-freestyle

**Company, people, funding**
- https://www.ycombinator.com/companies/freestyle · https://www.ycombinator.com/companies/freestyle-ai · https://freestyle.ai/friday · https://www.swerdlow.dev/ · https://linkedin.com/in/benswerdlow · https://linkedin.com/company/freestylecloud · https://aventure.vc/companies/freestyle-san-francisco-ca-us/fundraising · https://www.ycombinator.com/launches/LGW-freestyle-typescript-for-everything [BG] · misattributed Series A: https://startupintros.com/news/2026-03-11-freestyle-series-a · https://parsers.vc/news/260315-freestyle-secures-10m--revolutionizing-baby/

**Social and press**
- HN: https://news.ycombinator.com/item?id=47663147 [BG] · https://news.ycombinator.com/item?id=48894874 · https://news.ycombinator.com/item?id=49847310 · https://news.ycombinator.com/item?id=47827862
- X (via Nitter/engine): https://nitter.rdrama.net/benswerd · https://nitter.rdrama.net/freestyle_dev · https://x.com/benswerd/status/2105464635122221500 (unverified) · https://x.com/benswerd/status/2112326078408876087 (unverified)
- Video/podcast: https://www.youtube.com/watch?v=eBbnshMZOuI · https://www.youtube.com/watch?v=Z74SJOkHAPI · https://fondo.com/blog/start-benjamin-swerdlow · https://castro.fm/episode/L9klaC
- LinkedIn: https://www.linkedin.com/posts/benswerdlow_freestyle-is-hosting-the-cursed-agents-demo-activity-7513053162589769728-LAPg
- Reviews [BG]: https://techstackups.com/articles/freestyle-ax-audit/ · https://theagentpost.co/posts/review-freestyle · https://ai-beat.github.io/news/2026/04/freestyle-agent-vms/ · https://www.anchorterminal.com/tools/freestyle
- Founder projects: https://bw.swerdlow.dev/report · https://gigazine.net/gsc_news/en/20260925-starcraft-brood-war-bench/

**Benchmarks and competitors**
- https://aisandboxbench.com/ · https://gobare.hashnode.dev/i-benchmarked-9-agent-sandboxes-2-vcpu-was-off-by-3-2 · https://boat.dev/compare · https://docs.boat.dev/pricing · https://answers.databricks.com/e2b-daytona-modal-sandbox-ai-agents · https://lizard.build/blog/e2b-vs-daytona-vs-modal · https://useagent.org/blog/e2b-vs-daytona-agent-sandboxes · https://infragap.com/compare/e2b-vs-daytona/ · https://c17.io/compare/agent-sandboxes · https://www.ycombinator.com/companies/superserve · https://github.com/superserve-ai/superserve

**Events**
- https://events.ycombinator.com/haunted-hacks-2026 (local copy: `../EVENT_PAGE.md`) · https://luma.com/hacs1uig · https://coshell.ai/hack · https://www.compiled.sh/articles/c0mpiled-14-uc-berkeley · https://luma.com/freestyle-yh5k · https://luma.com/hzwlapu0 [BG]
