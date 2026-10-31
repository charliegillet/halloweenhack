# Freestyle: newest features, Aug-Oct 2026

> Checked 29 October 2026. Sources: Freestyle's changelog, blog, and docs (`llms.txt` index) read with Exa/WebFetch; the npm registry (`npm view`, plus `npm pack` of `freestyle@0.1.63`, `0.2.20`, and `0.2.21`, inspected by grep only); and GitHub repo and commit metadata through `gh api`. No Firecrawl credits used. Nothing below comes from running a Freestyle account: no VM was created and no API was called. I only cover the "what is new and what is the company pushing" angle. Docs/API depth, GitHub code, social sentiment, and team strategy are in the other files of this folder.

## TL;DR

1. **Freestyle is now a VM company and nothing else.** The 9 Sep 2026 changelog says: "We've deprecated the standalone Git, code execution, web deployment, and scheduled trigger APIs. The current platform covers VMs, snapshots, networking, domains, and identities." ([changelog Sep 9](https://www.freestyle.sh/changelog/changelog-september-9)). The organizer's one-line summary ("sandboxes/VMs/git/deploy") is therefore **out of date**. Git and deploy are no longer products, and the current SDK (`freestyle@0.2.x`) has no `git` or deploy namespaces (verified by grepping the package; see §4).
2. **There have been two changelogs in the window:** 9 Sep (a catch-up covering everything since April: VPCs, WireGuard, firewall, edge credential injection, forward auth, persistent PTYs, scoped tokens, 64 GiB VMs) and 14 Oct (browser terminals through `connectXterm`, expiring client tokens, 24-hour `vm.exec`, scoped S3 signing, domain-allowlist egress, faster snapshots).
3. **There are three launch-style blog posts in the window:** Rigkit (1 Sep), the Kali Linux base snapshot `freestyle/kali` (24 Oct), and a run of competitor comparison posts in September and October (E2B, Daytona, Blaxel, Fly Sprites, Modal, exe.dev, Boat.dev).
4. **Unannounced but shipped:** `@freestyle-sh/convex` 0.1.0 (23 Sep) with a "Workbench" agent demo (5 Oct), and today's SDK `0.2.21` (published 2026-10-29 23:02 UTC), which adds a `customers` namespace and a `customerId` on VMs.
5. **What Freestyle most wants shown off (inference):** a long-running agent that owns a **real Linux VM**, snapshots, pauses, and branches it, keeps **credentials outside the VM** (edge injection), and puts the VM's work in front of humans through a **browser terminal or a `style.dev` URL**. Their own docs ship ready-made guides for **OpenAI Agents SDK** and **Mastra**, both sponsors of this event.

## 1. Dated timeline (Aug 1 to Oct 29, 2026)

| Date | Item | Type | Source |
|---|---|---|---|
| 2026-08-07 → 08-19 | `freestyle@0.2.0-beta.0` through `beta.7` published | SDK prerelease | `npm view freestyle time` |
| 2026-08-21 | `freestyle@0.2.0` becomes `latest`. The README says "As of 0.2.0 this package is the `latest` dist-tag — `freestyle@beta` is now only the prerelease channel" | SDK major rewrite | npm; README inside the 0.2.21 tarball |
| 2026-08-25 | Adorable ("Open Source Lovable", 831★) commit "update to use new vms" | Reference app migrated to VMs | [github.com/freestyle-sh/Adorable](https://github.com/freestyle-sh/Adorable) |
| 2026-09-01 | Blog: "Introducing Rigkit — Define your development environment as code" | Launch post (OSS tool) | [blog](https://www.freestyle.sh/blog/product/introducing-rigkit) |
| 2026-09-01 | Blog: "16 questions you should ask before choosing a sandbox provider" | Marketing | [blog index](https://www.freestyle.sh/blog) |
| 2026-09-02 | `@rigkit/sdk` and `@rigkit/provider-freestyle` 0.3.0 | Release | npm |
| 2026-09-07 | Blog: "AI Security Agents Need a Lab They Can Break" and "Run AI-Generated Python Without Production Credentials" | Opinion/engineering | [blog index](https://www.freestyle.sh/blog) |
| 2026-09-08 | `browser-bench` repo ("One-key hosted Chrome throughput demos") | Demo repo | `gh` |
| **2026-09-09** | **Changelog: legacy API deprecations plus VM updates since April** | **Changelog** | [changelog Sep 9](https://www.freestyle.sh/changelog/changelog-september-9) |
| 2026-09-14 | Blog: "Your agent is waiting for approval. What happens to its computer?" and "Sandbox networking APIs: Freestyle, E2B, Daytona, Blaxel, and Box" | Comparison | [blog](https://www.freestyle.sh/blog/product/ai-agent-waiting-for-approval-sandbox-state) |
| 2026-09-16 | Blog: "A review of the adaptability of sandboxes" (8 providers) | Comparison | [blog index](https://www.freestyle.sh/blog) |
| 2026-09-22 | Five "Freestyle Team" posts on dedicated vs shared LLM inference | Engineering content (see §5) | [example](https://www.freestyle.sh/blog/engineering/dedicated-vs-shared-llm-inference) |
| 2026-09-23 | Blog: "Sprites Connectors is a great example of Terrible API Design" (Ben Swerdlow) | Opinion | [blog index](https://www.freestyle.sh/blog) |
| 2026-09-23 | `@freestyle-sh/convex` 0.1.0 on npm; `freestyle-sh/convex` repo created | Integration (no blog post found) | npm; [repo](https://github.com/freestyle-sh/convex) |
| 2026-09-23 | Podcast: Fondo START episode with Ben Swerdlow ("Full Linux VMs for AI Agents… run for hours, days, or weeks") | Press | [castro.fm](https://castro.fm/episode/L9klaC) |
| 2026-09-30 | Blog: "How I built Blendmux, Cursor for Blender" (Jacob Zwang, CTO) | Showcase | [blog index](https://www.freestyle.sh/blog) |
| 2026-10-03 | Coshell "Multiplayer Coding Hackathon", SF: Freestyle track "Run on Freestyle" with "$500 in credits, redeemed on the day" (coshell.ai/hack). The Luma page adds "Each winner also gets $10,000 in Freestyle credits plus 6 months of Freestyle Pro" (that line is on Luma only, not on coshell.ai/hack) | Hackathon sponsorship | [luma](https://luma.com/hacs1uig), [coshell.ai/hack](https://coshell.ai/hack) |
| 2026-10-04 | Blog: "Boat.dev vs Freestyle" (Ben Swerdlow) | Comparison | [blog index](https://www.freestyle.sh/blog) |
| 2026-10-05 | `freestyle-sh/convex` commit "add Convex agent workbench with scoped Freestyle notebooks" | Demo | `gh api` commits |
| **2026-10-14** | **Changelog: browser terminals, faster snapshots, scoped S3, 24h commands, outbound controls, new guides** | **Changelog** | [changelog Oct 14](https://www.freestyle.sh/changelog/changelog-october-14) |
| 2026-10-14 | SDK 0.2.18 → 0.2.20 (three publishes that day, the same day as the changelog) | SDK | npm |
| ~2026-10-21 | c0mpiled-14 (UC Berkeley) write-up: first prize "$1,500 + $10,000 in Freestyle credits"; Freestyle on the judging panel | Hackathon sponsorship | [compiled.sh](https://www.compiled.sh/articles/c0mpiled-14-uc-berkeley) |
| **2026-10-24** | **Blog: "Give Your AI Security Agent a Kali VM": `freestyle/kali` (Kali 2026.3) base snapshot** | **Launch post** | [blog](https://www.freestyle.sh/blog/product/give-your-ai-security-agent-a-kali-vm) |
| 2026-10-29 23:02 UTC | `freestyle@0.2.21`: adds `customers` namespace and safe-method retry with backoff | SDK (unannounced) | npm; tarball diff vs 0.2.20 |

Background (before the window, for context only): Launch HN on 2026-04-06, 322 points ([HN](https://news.ycombinator.com/item?id=47663147)); the package was renamed from `freestyle-sandboxes` to `freestyle` the week of 11 Apr ([changelog Apr 11](https://www.freestyle.sh/changelog/changelog-april-11)); custom VM sizes up to 32 vCPU in about 400 ms on 15–17 Apr ([changelog Apr 17](https://www.freestyle.sh/changelog/changelog-april-17)); Dev Server API removed on 1 Mar 2026 ([blog Feb 18](https://www.freestyle.sh/blog/product/deprecating-dev-servers)).

## 2. Feature status: GA, early, announced-only, deprecated

**How I classified features.** Freestyle does not use "beta" or "preview" labels anywhere in its docs index. A keyword pass over `llms.txt` found no "beta", "preview" (except for "preview VMs" in auth guides), or "deprecated" on any page. So "GA" below is my inference and means: listed in a changelog, documented in `/docs`, and present in the `latest` SDK. It is not an official SLA tier.

### GA (in a changelog, documented, and in the `freestyle@0.2.21` SDK)

| Feature | First announced | Notes relevant to a 5-hour build |
|---|---|---|
| VMs: Ubuntu 24.04 base (systemd, Docker, Node, Python), BusyBox 128 MiB base | Sep 9 | Default size 4 vCPU / 8 GiB / 32 GB ([pricing](https://www.freestyle.sh/docs/vms/pricing-and-limits)) |
| Pause / start with memory preserved; paused VMs stop counting against vCPU/RAM budget | Sep 9 | Blog claims pause and resume take "low tens of milliseconds even in slow cases" ([Sep 14 post](https://www.freestyle.sh/blog/product/ai-agent-waiting-for-approval-sandbox-state)). Vendor claim, not verified |
| Snapshots (memory and disk), "faster snapshots" | Sep 9 / Oct 14 | No `fork()` method in the 0.2.21 SDK (grep found none), and the live v5 OpenAPI (`api.freestyle.sh/openapi.json`, 55 paths) has no fork endpoint, only `/v5/vms/{id}/snapshot`. Branching = `vm.snapshot()` then `vms.create({snapshotId})`, which is the pattern in the Kali post. **Contradiction:** the [products/vms](https://www.freestyle.sh/products/vms) page still advertises "live forking" ("Clone a running VM without pausing it — get full copies in milliseconds"), and the Kali post's closing banner mentions "live forking". Neither documents a method for it. Don't promise judges a live fork; demo snapshot-then-create |
| Live resize (CPU/RAM/disk without reboot) | Sep 9 | Pro allows up to 32 vCPU / 64 GiB / 256 GB. **Free tier caps at 4 vCPU / 8 GiB / 32 GB and 10 concurrent VMs** ([pricing](https://www.freestyle.sh/docs/vms/pricing-and-limits)) |
| Firewall API (**required on VM creation**) | Sep 9 | Every code sample passes `firewall: { rules: [...] }`. Leaving it out is the obvious first error |
| Dual-stack VPCs, WireGuard tunnels, custom egress (router VM / WireGuard exit / SOCKS5) | Sep 9 | Intra-VPC traffic is free |
| Free `style.dev` domains and verified custom domains with managed HTTPS/wildcards | Sep 9 | The quickest way to give a VM's app a public URL for a demo |
| Edge credential injection (HTTP headers, Postgres auth, private Git over HTTPS) | Sep 9 | Freestyle's main security message. Guides exist for OpenAI, Anthropic, OpenRouter, Neon, Firecrawl, Exa, and others ([docs index](https://www.freestyle.sh/docs/llms.txt)) |
| Request-specific transforms (method/path match, JSON Patch on body) | Oct 14 | Lets you pin the model or fields at the edge |
| Domain-specific outbound access (TLS allowlist, end-to-end TLS kept) | Oct 14 | |
| Scoped S3 signing at the edge (bucket / prefix / ops, multipart) | Oct 14 | |
| Forward auth (your own authz endpoint in front of VM services) | Sep 9 | |
| Persistent named PTY sessions (reattach by name) | Sep 9 | |
| Identities and scoped client tokens (per-VM, per-Linux-user) | Sep 9 | [Client Sessions docs](https://www.freestyle.sh/docs/vms/client-sessions) |
| Expiring client tokens | Oct 14 | |
| **Browser terminals via `connectXterm`** (scoped token, reconnect, output replay) | **Oct 14** | Exported from `dist/vms/xterm.d.ts`, signature `connectXterm({ pty, terminal, ...options })` returns `{ session, dispose() }` |
| `vm.exec()` timeouts up to 24 h, recoverable after interruption | Oct 14 | **Only "on VMs with an updated guest agent"; older agents keep the five-minute limit** ([Oct 14](https://www.freestyle.sh/changelog/changelog-october-14)). The Mastra guide still caps at 300 000 ms |
| 16 GiB chunked file transfers, ranged reads | Sep 9 | |
| CLI (`freestyle` bin in the same package; browser login; JSON output) | Sep 9 | README: `npx freestyle@latest vm list`, `freestyle login` |
| `freestyle/kali` base snapshot (4 vCPU / 8 GiB / 32 GB; Nmap, sqlmap, Metasploit, radare2) | Oct 24 | [Kali docs](https://www.freestyle.sh/docs/vms/base-snapshots/kali) |

### Shipped but early or unannounced

- **Rigkit** (announced 1 Sep): "Terraform for development environments" with `rig plan / apply / create / run`, written in TypeScript, using `@rigkit/provider-freestyle`. The repo has 13★ and its last push was 2026-09-03. The repo itself was created on 2026-05-02, and `@rigkit/provider-freestyle` has been on npm since 13 May. So the 1 Sep post publicly launched a tool that had been around since May, together with its 0.3.0 release. It is lightly used ([blog](https://www.freestyle.sh/blog/product/introducing-rigkit), [repo](https://github.com/freestyle-sh/rigkit)).
- **`@freestyle-sh/convex` 0.1.0** (23 Sep) and **Workbench** (5 Oct): a Convex component for "idempotent VM creation… create, refresh, start, pause, resize, update, exec, snapshot, and delete helpers" with tenant `ownerId`. The demo is a Convex Agent plus a persistent Python notebook VM where Freestyle "injects the scoped Convex credential at the TLS edge" (README). I found no blog or changelog entry. 1★.
- **`customers` namespace** (SDK 0.2.21, published today): `customers.upsert/get` with emails, OAuth identities, githubId, IP, and country, attachable to VMs through `customer` / `customerId`. The typings describe it as an "End-user identity… No billing semantics." It is not in any changelog yet. Treat it as unstable.

### Announced-only / unclear

- **Dedicated LLM inference**: five posts on 22 Sep cover sizing, benchmarking, and an "OpenAI-compatible API" migration. I found **no product page, pricing, or changelog entry** saying Freestyle sells inference. These may be SEO content. **Not verified as a product.**
- **Sub-300 ms median startup** was a stated goal in April ("hope to get that to <300ms by the end of this month", [changelog Apr 11](https://www.freestyle.sh/changelog/changelog-april-11)). The products page now says "VMs provision in about 65ms" ([products/vms](https://www.freestyle.sh/products/vms)). That figure is a vendor claim with no published benchmark method.

### Deprecated (do not build on these)

- **Standalone Git API, code-execution API, web-deploy API, scheduled-trigger API**: deprecated on 9 Sep ([changelog](https://www.freestyle.sh/changelog/changelog-september-9)). I did not find a shutdown date. The 0.1.63 SDK referenced `deploy`, `execute`, and `schedule` in 11, 7, and 9 files. In 0.2.21 the only top-level namespaces are `customers, vms, vpc, tunnels, firewall, tls, domains, identities`, and `runCode`/`execute` do not appear at all. **Any tutorial, older blog post, or LLM memory that uses `freestyle.git.*`, `deployWeb`, or `executeScript` targets the old SDK.**
- The `@freestyle-sh/with-*` helper packages (`with-nodejs`, `with-postgres`, `with-pty`, and others) were last published 12–21 Apr 2026 and have had no release since the 0.2.0 rewrite. `@freestyle-sh/with-nodejs` declares `"freestyle": "^0.1.46"` as a peer dependency (`npm view`). On a 0.x caret range that means `<0.2.0`, so **these helpers target the old 0.1 SDK and will conflict with `freestyle@0.2.x`.** Avoid them. (I did not run them, so the actual failure mode is not verified.)
- Background: the Dev Server API was removed on 1 Mar 2026.

## 3. Which features Freestyle most wants showcased (inference, with evidence)

Ranked by how much recent content each theme gets:

1. **Credentials stay outside the sandbox.** This appears in both changelogs (injection, S3 signing, transforms, domain allowlists), in the 7 Sep "Run AI-Generated Python Without Production Credentials" post, in more than a dozen credential-injection guides in `llms.txt` (OpenAI, Anthropic, Claude Code OAuth, OpenRouter, Hugging Face, Neon, Tigris, Firecrawl, Exa, PostHog, Keycard, private Git, DoorDash CLI), in the Convex Workbench design, and in the 4 Oct Boat.dev comparison, which highlights "credentials held outside the sandbox". The guide "[Select OpenAI Models and Inject Authentication](https://www.freestyle.sh/docs/guides/select-openai-models-and-inject-auth)" was listed in the **Oct 14** changelog's "New guides" section. (An earlier draft said Sep 9. That was wrong: the Sep 9 changelog has no guides section.)
2. **Pause, snapshot, and branch a long-running agent's whole machine.** The approval-wait post (14 Sep), the Kali "branch the hypothesis" section (24 Oct), the podcast ("Clone a running machine, memory included, and let agents pursue different approaches from the same starting point", [castro.fm](https://castro.fm/episode/L9klaC)), and the HN launch's memory-fork pitch all push this.
3. **Humans watching or sharing the agent's computer live.** Browser terminals (`connectXterm`) and expiring scoped tokens (14 Oct) were built so an end user can open the VM's terminal without your API key. There are also noVNC/Chromium/GNOME and audio-streaming guides. This is the strongest match for the "Real-Time AI" theme.
4. **"Most powerful VM" positioning.** Full Linux, Docker, systemd, nested virtualization, 64 GiB. It is repeated in every comparison post. A demo that runs something a container sandbox can't (Docker-in-VM, a desktop, a game server, Kali) plays to this.
5. **Framework integrations with this event's other sponsors.** The docs ship "[How to Give Your OpenAI Agent a Sandbox](https://www.freestyle.sh/docs/guides/give-your-openai-agent-a-sandbox)" (implements `SandboxClient` from `@openai/agents/sandbox`, maps ports to `style.dev` HTTPS), "[How to Give Your Mastra Agent a Sandbox](https://www.freestyle.sh/docs/guides/give-your-mastra-agent-a-sandbox)" (extends `MastraSandbox`), and "How to Run Supabase in a Sandbox". I found **no Freestyle content on Terse Durable Actors or Agent Relay** (keyword pass on the docs index for durable, actor, multiplayer, and realtime returned nothing).

How Freestyle pitched itself at the hackathon it co-sponsored on 3 Oct: "Real Linux VMs for AI agents. Run your team's drive on one instead of the captain's laptop, so the build keeps going when the lid closes" ([coshell.ai/hack](https://coshell.ai/hack)). At Berkeley c0mpiled-14, two documented projects ran on Freestyle: "API Patchbay" ("test the fix in a clean Freestyle VM, and open a pull request") and "Relay" (Architect/Builder/Reviewer agents "inside a Freestyle VM, with the running app published to a public URL for everyone in the room") ([compiled.sh](https://www.compiled.sh/articles/c0mpiled-14-uc-berkeley)). The second is very close to this event's "multiplayer AI / software factory" brief.

## 4. Verified SDK facts (from the npm tarballs, no code executed)

- `freestyle@0.2.21`: description "Freestyle SDK and CLI — manage VMs, snapshots, VPCs, domains, and identities". MIT license, ESM only, dependencies `dotenv`, `ws`, `yargs`. The API base is `https://api.freestyle.sh/v5`, with OpenAPI at `https://api.freestyle.sh/openapi.json` (README).
- VM lifecycle options in `dist/vms/types.d.ts` include `idleTimeoutSeconds` ("-1 (or omitting this) means it is never paused for being idle") and a run deadline ("A deadline, not an idle window: nothing resets it"). The Kali post uses `maxRunSeconds: 3600` and says the budget "pauses the VM rather than deleting the work."
- The 0.2.21 diff vs 0.2.20 adds GET/HEAD/OPTIONS-only retry on 502/503/504 with backoff. The source comment reads: "a 503 or a lost response never grants permission to repeat create/exec". So **your own code must handle create/exec retries idempotently.**
- Release cadence: 30 versions between 7 Aug and 29 Oct (8 betas plus 0.2.0 → 0.2.21). It is moving fast, so **pin a version** for the hackathon.

## 5. Limits / could not verify

- **YC batch mismatch:** the event page says Freestyle is F24, while the c0mpiled write-up says "Freestyle (YC S24)" (re-checked). The "Luma judge bio" said to say S24 is **(unverified)**: the Coshell Luma page I re-read has no YC label for Freestyle. I did not resolve this.
- **Undocumented API surface:** the live OpenAPI includes `/v5/hardware` ("List the physical machines attached to your private networks") and `/v5/hardware/{id}/power`. These are not in `llms.txt` or any changelog. They may point to a bare-metal or BYO-hardware feature that hasn't launched. Do not build on them.
- I could not confirm whether the deprecated Git/deploy/exec APIs still respond, or when they shut off.
- The 24-hour exec depends on the guest-agent version. I could not determine which base snapshots ship the updated agent.
- Performance numbers (65 ms provision, tens-of-ms pause/resume, "faster snapshots") are vendor statements with no published methodology.
- I don't know whether the $100 per-attendee credit applies on the Free plan (which "never bills for usage" and has hard allowances) or upgrades accounts to Hobby. That determines whether 10 concurrent VMs and 4 vCPU are your ceiling. Ask at check-in.
- Publication dates for individual docs guides (OpenAI, Mastra, Supabase) are not exposed. Only the Sep 9 "New guides" note dates a subset.
- The X account @freestyle_dev appeared (through Nitter mirrors) to have about 8 tweets, and the only in-window post seen was on 22 Sep, so there is little social launch signal. Social sentiment belongs to the 04 file.

## Hackathon implications

**What to build (aligned with what Freestyle is pushing).**
- Combine a Terse Durable Actor (state and coordination) or Agent Relay agents (messaging) with **one Freestyle VM per agent or per task**. Have the actor keep the VM ID and snapshot IDs as durable state, and have agents snapshot, branch, and compare approaches. This hits Freestyle themes 2 and 5 and still centers on the required host tech.
- For the "Real-Time" theme, embed a **live browser terminal** of each agent's VM (`connectXterm` plus an identity token with an expiry) and a **`style.dev` preview URL** of whatever the agent is building, so judges watch agents work live. This is the 14 Oct feature and the newest thing you can show.
- Hold the OpenAI key at the **edge with credential injection**, not in the VM, and say so on stage. That is Freestyle's top message.
- Halloween-flavored options: a "haunted house" of branching VM timelines (snapshot = a ghost of a past state), or a red-team "exorcist" agent on `freestyle/kali` attacking a deliberately vulnerable app inside a private VPC. The Kali snapshot launched 24 Oct and will be fresh to Freestyle judges. Keep it scoped to targets you own.

**Gotchas.**
- `firewall` is **required** on `vms.create`. Copy the allow-public rule from the docs.
- Do not use any `git`, `deploy`, `execute`, or scheduled-trigger API. They are deprecated, and Claude, Codex, and older tutorials will happily generate them. Use plain `git` inside the VM and `style.dev` domains for hosting.
- There is no `fork()` in the SDK or the v5 OpenAPI, even though the marketing page says "live forking". Branch with `vm.snapshot()` then `vms.create({ snapshotId })`.
- Don't install `@freestyle-sh/with-*` helpers. They peer-depend on `freestyle@^0.1.46`.
- Exec may still be capped at five minutes on older guest agents. Use PTY sessions for long processes.
- Create and exec are not auto-retried. Make them idempotent, for example with a `slug`, as the Convex component does.
- The Free plan allows 10 concurrent VMs at 4 vCPU / 8 GiB max each, so a "50-agent swarm" demo will hit limits. Pause idle VMs, since paused VMs release budget.

**Setup before Oct 31.**
- Create the account, generate an API key, run `npx freestyle@latest login` and `vm list`, and pin `freestyle@0.2.21` (or whatever is `latest` that morning) in `package.json`.
- Read these three docs: OpenAI Agents SDK sandbox guide, Mastra sandbox guide, Client Sessions. Also skim the `connectXterm` typings in `dist/vms/xterm.d.ts`.
- Planning is allowed but code must be written at the event, so decide on the snapshot-branching data model, not the code.

**What judges and sponsors want.** Freestyle has put "$10,000 in credits" into the grand prize here and at two other Bay Area hackathons this month (Coshell Oct 3, c0mpiled-14 at Berkeley). It is sponsoring, not running a separate track, so it will reward a grand-prize-quality project where the VM is **load-bearing**: agents doing real work on real machines, state preserved across pauses or branches, secrets kept out, and the result visible live. Using Freestyle only as a code runner wastes the angle.

## Sources

- https://www.freestyle.sh/changelog
- https://www.freestyle.sh/changelog/changelog-october-14
- https://www.freestyle.sh/changelog/changelog-september-9
- https://www.freestyle.sh/changelog/changelog-april-17 (background)
- https://www.freestyle.sh/changelog/changelog-april-11 (background)
- https://www.freestyle.sh/blog
- https://www.freestyle.sh/blog/product/introducing-rigkit
- https://www.freestyle.sh/blog/product/give-your-ai-security-agent-a-kali-vm
- https://www.freestyle.sh/blog/product/ai-agent-waiting-for-approval-sandbox-state
- https://www.freestyle.sh/blog/engineering/dedicated-vs-shared-llm-inference
- https://www.freestyle.sh/blog/product/deprecating-dev-servers (background)
- https://www.freestyle.sh/docs/llms.txt
- https://www.freestyle.sh/docs/vms/pricing-and-limits
- https://www.freestyle.sh/docs/vms/client-sessions
- https://www.freestyle.sh/docs/guides/give-your-mastra-agent-a-sandbox
- https://www.freestyle.sh/docs/guides/give-your-openai-agent-a-sandbox
- https://www.freestyle.sh/products/vms
- https://api.freestyle.sh/openapi.json (live v5 API spec, 55 paths, fetched 2026-10-29)
- https://www.npmjs.com/package/@freestyle-sh/with-nodejs (peer dependency check)
- https://github.com/freestyle-sh/convex
- https://github.com/freestyle-sh/rigkit
- https://github.com/freestyle-sh/Adorable
- https://www.npmjs.com/package/freestyle (versions 0.1.63, 0.2.20, 0.2.21 inspected)
- https://www.npmjs.com/package/@freestyle-sh/convex
- https://news.ycombinator.com/item?id=47663147 (background)
- https://castro.fm/episode/L9klaC
- https://luma.com/hacs1uig and https://coshell.ai/hack
- https://www.compiled.sh/articles/c0mpiled-14-uc-berkeley

## Verification log (2026-10-29)

An adversarial re-check of the 15 most decision-relevant claims against live sources: Exa/WebFetch on freestyle.sh, compiled.sh, coshell.ai, Luma, castro.fm, and the HN Firebase API; `npm view`/`npm pack` against the registry; `gh api`; and the live `api.freestyle.sh/openapi.json`. No Firecrawl credits used.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Sep 9 changelog deprecates standalone Git, code-exec, web-deploy, scheduled-trigger APIs (exact quote) | Fetched changelog-september-9 | **Confirmed** verbatim (author Ben Swerdlow) |
| 2 | Sep 9 contents: 64 GiB on Pro, 32 vCPU/256 GB, firewall required on VM creation, style.dev domains, credential injection, persistent PTYs, scoped tokens, 16 GiB transfers | Same page | **Confirmed** |
| 3 | Oct 14 changelog: `connectXterm` browser terminals, expiring tokens, 24 h `vm.exec` only on updated guest agent (older agents keep 5 min), scoped S3, domain allowlist, request transforms, faster snapshots | Fetched changelog-october-14 | **Confirmed** |
| 4 | "Select OpenAI Models and Inject Authentication" guide listed in the **Sep 9** "New guides" section | Both changelogs | **Refuted, fixed.** It is in the **Oct 14** "New guides" section. Sep 9 has no guides section |
| 5 | `freestyle@0.2.21` published 2026-10-29 23:02 UTC; `latest`; 0.2.0 GA on 21 Aug; 30 versions since 7 Aug | `npm view freestyle time` / dist-tags | **Confirmed** (8 betas + 22 releases = 30; `latest`=0.2.21, `beta`=0.2.0-beta.7) |
| 6 | 0.2.21 top-level namespaces are `customers, vms, vpc, tunnels, firewall, tls, domains, identities`; no `runCode`/`execute`/`deployWeb`; `customers` is "No billing semantics"; `connectXterm` exported; safe-method-only retry comment | `npm pack` + grep of `dist/` | **Confirmed** (comment is in `dist/client.js:146`) |
| 7 | No `fork()` | Grep of 0.2.21 `dist/` + live OpenAPI path list | **Confirmed for SDK/API**, but **added** a contradiction: products page and Kali banner still advertise "live forking" |
| 8 | Free tier: 10 concurrent VMs, 4 vCPU / 8 GiB / 32 GB max, default size same; "Free never bills for usage" | Fetched docs/vms/pricing-and-limits | **Confirmed.** Also Hobby $50/mo (40 VMs, 8 vCPU/16 GiB), Pro $500/mo (400 VMs); vCPU $0.04032/h, memory $0.0129/GiB-h |
| 9 | "VMs provision in about 65ms"; pause/resume "low tens of milliseconds even in slow cases" (Sep 14 post) | Fetched products/vms and the Sep 14 post | **Confirmed as vendor claims** (no methodology published) |
| 10 | Kali post 24 Oct: `freestyle/kali`, Kali 2026.3, 4 vCPU/8 GiB/32 GB, Nmap/sqlmap/Metasploit/radare2, `maxRunSeconds: 3600`, "pauses the VM rather than deleting the work", snapshot-then-create branching | Fetched the post | **Confirmed** |
| 11 | Blog dates (Rigkit 1 Sep, 16 questions 1 Sep, Sep 7 pair, Sep 14 pair, Sep 16, five inference posts Sep 22, Sprites Sep 23, Blendmux Sep 30, Boat.dev Oct 4, Kali Oct 24); nothing after Oct 24 | Blog index + Rigkit `article:published_time` | **Confirmed.** Rigkit is 2026-09-01 per page metadata. **Added:** the Rigkit repo was created 2026-05-02 and the provider package has been on npm since 13 May |
| 12 | Coshell Oct 3: $500 day-of credits plus "$10,000 in Freestyle credits plus 6 months of Freestyle Pro" per winner | coshell.ai/hack and luma.com/hacs1uig | **Confirmed, with a source split:** the $10k + 6 mo Pro line appears only on Luma. The coshell.ai track card says "$500 in credits, redeemed on the day". Row corrected |
| 13 | c0mpiled-14: 1st prize "$1,500 + $10,000 in Freestyle credits"; Freestyle judged; "API Patchbay" and "Relay" quotes; "YC S24" | Fetched compiled.sh (raw HTML for Relay text) | **Confirmed** verbatim, including "with the running app published to a public URL for everyone in the room". Article dated 2026-10-21 |
| 14 | Event page: Freestyle (F24), $100 Freestyle credits per attendee, $10,000 Freestyle credits in grand prize | Local EVENT_PAGE.md lines 9, 15, 76 | **Confirmed** against the event page. F24 vs S24 is still unresolved. The "Luma judge bio says S24" claim is marked **(unverified)** |
| 15 | GitHub/npm: Adorable 831★, "update to use new vms" 2026-08-25; Rigkit 13★ last push 2026-09-03; `freestyle-sh/convex` 1★, created 23 Sep, Workbench commit 5 Oct; README quotes (idempotent creation, `ownerId`, scoped credential at TLS edge); `@freestyle-sh/convex` 0.1.0 on 23 Sep; `@rigkit/*` 0.3.0 on 2 Sep; `browser-bench` created 8 Sep | `gh api`, `npm view` | **Confirmed** |
| 16 | OpenAI guide implements `SandboxClient` from `@openai/agents/sandbox` and maps ports to `style.dev` HTTPS; Mastra guide extends `MastraSandbox` and caps at 300 000 ms | Fetched both guides | **Confirmed** (Mastra: `Math.min(options.timeout, 300_000)`) |
| 17 | HN Launch 2026-04-06, 322 points; podcast 23 Sep with quoted taglines | HN Firebase item 47663147; castro.fm | **Confirmed** (322 points, 158 comments, by benswerd; podcast quotes match show notes) |
| 18 | No Freestyle docs content on durable actors / Agent Relay / realtime / multiplayer | Grep of live `llms.txt` (23.6 KB) | **Confirmed** (zero matches) |
| 19 | `with-*` helpers last published 12–21 Apr; 0.2.x compatibility unverified | `npm view` | **Confirmed dates; strengthened:** `with-nodejs` peer-depends on `freestyle ^0.1.46` (`<0.2.0`) |

Not re-checked (left as-is): the Nitter-based X-account observation, and the claim that docs guide publication dates are not exposed.
