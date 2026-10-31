# Freestyle: team, strategy and competition (Haunted Hacks, 31 Oct 2026)

Checked **29 Oct 2026**. Sources: YC company page, the Launch HN thread (HN Firebase and Algolia APIs, including every founder comment), freestyle.sh blog/changelog/about/careers pages (fetched raw with curl), `gh` for the `freestyle-sh` org, Exa and WebSearch for funding, LinkedIn post mirrors and third-party benchmarks. Nothing was tested hands-on. Tags: **[F]** verified fact with source, **[I]** my inference, **[BG]** background from before Aug 2026. Docs and API details are in `01-docs-api.md`. This file covers who Freestyle are, what they want, and who they compete with.

---

## 0. TL;DR

- **The event page has the batch wrong. [F]** freestyle.sh is **YC Summer 2024 (S24)**, primary partner Diana Hu [1]. "Freestyle (YC F24)" is a different company: freestyle.ai, an AI email assistant founded by Allen Naliath [2]. Do not say "F24" to the Freestyle team.
- **Two founders, both ex-Apple and both college dropouts. [F]** **Ben Swerdlow** (CEO) and **Jacob Zwang** (CTO) met in 10th-grade calculus. Jacob was a senior full-stack engineer in Apple Conversational Engineering at 19; Ben took "a job as a consultant for Apple" and says he "became a senior" within 3 months (YC page does not put Ben in Conversational Engineering) [1][21]. The team is about 4 to 5 people, in person in SF, on their own bare-metal racks with their own Rust KVM hypervisor [1][4][5].
- **Funding: only the YC money is visible. [F]** Aggregators show about $500K to $625K [6][7]. A widely indexed "$10M Series A led by Silas Capital" belongs to **Freestyle the diaper brand** (freestyle.world), not freestyle.sh [8]. Do not repeat it.
- **They pivot hard and often. [F]** Mid-2024 "TypeScript for EVERYTHING" (Cloudstate) [9] → 2025 serverless deploys, Git, and a Dev Server API for AI app builders → Feb 2026 Dev Servers deprecated [10] → Apr 2026 Launch HN "Sandboxes for Coding Agents" (322 points) [11] → **9 Sep 2026: "Freestyle is now focused on VMs"**, with the Git, code-exec, web-deploy, and cron APIs deprecated [12].
- **Positioning: "the most powerful" VMs, sold to *platforms*, not individuals. [F]** Ben said on HN: "Its designed for platforms building coding agents that want to take the place of Github all together" [11]. The signature features are **live memory forking/snapshots**, **memory-preserving pause**, **edge credential injection**, and **default-deny networking/VPCs** [12][13].
- **Competitors are named and attacked in public. [F]** In Aug to Oct 2026 the blog compared Freestyle with E2B, Daytona, Blaxel, Fly Sprites, Modal, exe.dev, Boat.dev, Vercel and Cloudflare. That includes a CEO post calling Sprites Connectors "Terrible API Design" [14][15][16]. **Superserve (F26), a co-sponsor of this event, is a direct competitor** (Firecracker VMs with pause, fork, and credential injection) [17].
- **What impresses them [I]:** projects that use **fork/snapshot of a live running computer** for parallel exploration, and that keep the **agent loop outside the VM** with credentials kept out of the guest. Ben's own side projects are agent benchmarks run on many parallel VMs (Brood War Bench) and a "Cursor for X" app (Jacob's Blendmux) [18][19].

---

## 1. Identity and name collisions [F]

| Entity | What it is | Relevance |
|---|---|---|
| **Freestyle / freestyle.sh** ("Freestyle Cloud" on LinkedIn) | VMs for AI agents, YC **S24**, SF, team size 5 on YC | The sponsor [1][7] |
| Freestyle / freestyle.ai | AI Gmail assistant, YC **F24**, Allen Naliath. Its YC page is also titled just "Freestyle" and also lists Diana Hu as primary partner, which makes the mix-up easy | Likely source of the event page's "F24" [2] |
| Freestyle / freestyle.world | Diaper and wipes brand, $10M Series A in Mar 2026 led by Silas Capital | Source of the bogus funding figure [8] |

Social handles: the company X account is **@freestyle_dev** ("Computers for coding agents.", joined Apr 2026, about 418 followers as seen on a Nitter mirror) [20]. Ben posts on HN and X as **benswerd** [11][20]. Ben's personal site is swerdlow.dev [21]. Jacob appears as **@theshortjacob** in a retweet on the same Nitter mirror (Jul 2026, racking servers) [20]; the account itself was not opened.

## 2. Founders and team

**Benjamin Swerdlow, co-founder and CEO [F].** He learned to code in elementary school. As a teenager he was a code owner and technical lead on the WHO COVID-19 App Collective. He did a year at UChicago ("student dropout from the University of Chicago" per swerdlow.dev), then "took a job as a consultant for Apple. In 3 months I became a senior," and left to found Freestyle [1][21]. His LinkedIn "About" still carries the 2024 thesis: "kill traditional databases, and merge the stack into true fullstack TypeScript" [3]. He is the company's main public voice: he writes the launch posts, the changelogs, the comparison posts, and the opinion pieces.

**Jacob Zwang, co-founder and CTO [F].** He dropped out of college and became a senior full-stack engineer in Apple Conversational Engineering at 19 [1]. Most recently he wrote "How I built Blendmux, Cursor for Blender" (30 Sep 2026), a personal agent-for-a-creative-tool project built "when the GPT-6 models came out" [19].

**Others [F].** Ben Werner is a software engineer and author of "You're starving your agent" (Apr 2026) [22]. YC lists team size 5 (re-checked 29 Oct) [1]; the LinkedIn "4 employees" figure was not re-checked (unverified).

**Hiring signal [F].** The careers page lists a Systems Engineer ("We write our own KVM hypervisor in Rust, built around layered copy-on-write memory"), a Platform Engineer (Rust APIs, React dashboard, TS and Python SDKs), and an Infra/Reliability engineer. The page says "We buy our own hardware and run on bare metal" [5]. **[I]** This is a deep-infra team. They will appreciate demos that stress the VM primitives, not demos that use Freestyle as a generic container.

**Founder side projects in the window [F].**
- **Brood War Bench** (launched mid-Sep 2026, by Ben; on 21 Sep he posted "Last week I launched Brood War Bench" [20]): 19 model/effort configurations played StarCraft: Brood War through agents in a round robin, with matches "in parallel across Freestyle VMs". Codex Astra/xhigh went 18-0. Ben's verdict: "None of the models played beyond a beginner level." His observation: Codex's subagents "didn't communicate much with one another" [18]. GIGAZINE covered it on 25 Sep [23].
- **Cursed Agents Demo Night**, hosted by Freestyle for SF Tech Week with co-hosts (post dated 6 Oct 2026, event "this Thursday", i.e. about 8 Oct; 15 reactions) [24]. **[I]** "Cursed agents" is exactly the Halloween register this event wants.

## 3. Funding [F]

- Aventure: Seed of $500,000 (June 2024), Y Combinator only, updated Oct 2026 [6]. LinkedIn: $625K total ($125K Aug 2024 plus $500K Sep 2024) [7] (not re-checked on 29 Oct; unverified). These match the standard YC deal. No priced round was found.
- The "$10M Series A, Silas Capital, Mar 11 2026" listing on StartupIntros attaches to "Freestyle". Its own blurb mentions "consumer products designed for modern parenting", and other coverage identifies the company as the Santa Monica diaper brand [8][25]. **Not freestyle.sh.**
- Freestyle runs a YC-founder deal: "$5k credits + $25k match" (freestyle.sh/yc) [26].

## 4. Strategy timeline

| Date | Event | Tag |
|---|---|---|
| Jun 25 2024 | Launch YC "TypeScript for EVERYTHING": `@cloudstate` classes, `npx freestyle deploy` | [BG][F] [9] |
| Aug 2025 | Hosted the YC "AI Coding Agents Hackathon" with Anthropic, Same and Morph. Billed as "Infra for App Builders". Ben judged alongside Diana Hu | [BG][F] [27][28] |
| Aug 29 2025 | Ben: "The Future of AI Coding Agents". Builders will "generate a couple variants for every single request"; humans become "generals" spinning up "thousands of variant sandboxes" | [BG][F] [29] |
| Feb 18 2026 | Dev Server API deprecated in favor of VMs | [BG][F] [10] |
| Apr 6 2026 | Launch HN: "Freestyle – Sandboxes for Coding Agents", 322 points, 158 comments | [BG][F] [11] |
| Jul 9 2026 | Ben: "Designing APIs for Agents" (HN 79 points) | [BG][F] [30] |
| Sep 1 2026 | Rigkit ("Terraform for development environments") and the "16 questions" buyer checklist | [F] [31] |
| **Sep 9 2026** | **VM-only pivot.** Git, code-exec, web-deploy and scheduled-trigger APIs deprecated. Added dual-stack VPCs, WireGuard tunnels, firewall API, live resize (grow-only), Ubuntu 24.04 and 128 MiB BusyBox base snapshots, and 32 vCPU/64 GiB/256 GB on Pro | [F] [12] |
| Sep 14-16 2026 | Comparison posts: networking, pause semantics, "adaptability" across 8 providers | [F] [14] |
| Sep 23 2026 | Ben: "Sprites Connectors is a great example of Terrible API Design" | [F] [15] |
| Oct 4 2026 | Ben: "Boat.dev vs Freestyle" ("Boat.dev is cheaper") | [F] [16] |
| Oct 14 2026 | Changelog: browser terminals with scoped identity tokens, 24h `vm.exec`, faster snapshots, S3 signing at the edge, domain-scoped egress, JSON-Patch request transforms, and migration guides from E2B and OpenShell | [F] [12][32] |
| Oct 24 2026 | `freestyle/kali` (Kali 2026.3) for security and pentest agents | [F] [33] |

**[I] Reading:** each pivot has dropped higher-level conveniences and gone deeper on a single primitive, the VM. The current marketing push targets three segments: **security agents** (posts on 7 Sep and 24 Oct), **RL/eval environments** (named as "Emerging Use Cases" on the about page), and **platforms running fleets of coding agents**.

## 5. Positioning and ICP

**What they say they are [F]:** "Full Linux VMs for AI agents. Built for complex tasks that run for hours, days, or weeks" [13]. The CTA prompt on the homepage is aimed at coding agents: "Onboard onto Freestyle.sh, build an integration with it on a branch, tell me how it did" [13]. Logos and alt text on the homepage (re-checked 29 Oct): Bloom, OpenWork, cmux, Onlook, Wordware, a0 [13]. The customer relationships behind those logos were not verified.

**ICP [F]:** platforms, not individual developers. "Our users are platforms, and many of the best already build on us." "Exe.dev is a individual developer oriented service. Freestyle is more oriented at platforms building the next exe.dev" [11]. The about page lists "Multi Tenant Usage Patterns" (slugs per user, identities, VPC isolation) [34].

**Where they say *not* to use Freestyle [F]** [34]:
- short "Run AI Code" Python snippets
- CPU-heavy CI
- tasks averaging under 15 minutes
- "Sole Application Hosting": "we do not offer autoscaling, load balancers or CDNs and we don't plan to."

**[I]** Do not pitch Freestyle as your production host. Pitch it as the agent's workbench.

**Enterprise upsell [F]:** private GPU sandboxes, colocated bare metal, spot or CPU-time pricing, custom virtualization [34].

## 6. Competition

### 6a. How Freestyle frames rivals (their own words) [F]

| Rival | Freestyle's claimed difference | Source |
|---|---|---|
| E2B, Daytona | "don't really feel like VMs/you can't run everything you can in an EC2". Freestyle is "full Debian ... sysd, docker in docker". Daytona "boot[s] faster" but Freestyle's "first response is an order of magnitude ahead" | HN [11] |
| exe.dev | individual-developer product vs Freestyle's platform API | HN [11] |
| Boat.dev | "Boat is cheaper". Freestyle wins on memory snapshots, VPC/firewall, edge secrets, consistent hardware, and 32 vCPU/64 GiB vs 16/32 | [16] |
| Fly Sprites | Connectors API is "human first (and kinda human only)" and over-specialized. Freestyle transforms are "inspired by Vercel" but generalize to Postgres, S3 SigV4 and JSON Patch | [15] |
| Vercel just-bash, Cloudflare isolates | "a weird half-computer". "If you need a real shell, use a real shell" | [35][22] |
| E2B, Blaxel, Daytona, Sprites, Modal, exe.dev, Boat | "Adaptability" review: Freestyle ranges from 128 MiB BusyBox to 64 GiB. Only Freestyle is marked as preserving memory, processes, and a reusable branch on snapshot | [14] |

### 6b. Independent signals (Oct 2026) [F]

- **aisandboxbench.com** ("measured Oct 22-26, 2026 · 8 providers (9 configs)", callers in Florida and Frankfurt, 100 runs per main test): "Fastest resume" is Freestyle in both panels (0.35s on the same 4 vCPU/8 GB machine, 0.32s on default machines). "Fastest cold start" is **Superserve** (0.52s) on the same-machine panel and E2B (0.50s) on default machines; the split is by machine configuration, not caller location. Freestyle's median cold start was 0.69s and 0.72s in those panels (3rd and 4th) [36]. The operator of the site was not identified.
- **gobare.hashnode.dev** benchmark (all runs 5 Oct 2026, 9 providers; post updated 7 Oct): Freestyle cost $4.44 per 1,000 sixty-second sessions at every idle level. Vercel was higher at 0% idle ($5.71), so Freestyle was the most expensive only at 50%, 90% and 95% idle. Freestyle ran at 4 vCPU/8 GB while most others ran 2 vCPU/4 GB, because the author found its free tier "won't go below 4 vCPU / 8 GB". Freestyle's docs instead say 4 vCPU/8 GiB/32 GB is the *default* size and per-plan sizes are "upper bounds, not fixed sizes" [42]. Freestyle was among the four whose pause "Kept memory and running processes" (resume 1.2s). The old `freestyle-sandboxes` SDK returned 401 with a valid key while the current `freestyle` package worked [37].

### 6c. Co-sponsor overlap: Superserve (F26) [F]

YC's page for Superserve: "Virtual machines for autonomous agents". Under 50ms start, pause with memory intact, fork, "API keys stay outside the machine", ">100K machines ... every week", customers include Lindy and YC [17]. The core is open source (Apache-2.0, 475 stars on 29 Oct, README: "powered by Firecracker microVMs"), with TS and Python (`superserve` on PyPI) SDKs [17]. An MCP server is not mentioned in the README (unverified). Superserve also won "fastest cold start" and "fastest snapshot start" on aisandboxbench [36]. **[I]** That is almost exactly Freestyle's pitch. Freestyle's differentiators left are full-VM depth (nested virt, Docker, systemd, Kali, 64 GiB), VPC/WireGuard networking, and a richer transform API. Superserve's are Python SDK parity, open source, and cold start.

### 6d. Ecosystem hooks with the hosts and sponsors [F]

- **Agent Relay** ships `@agent-relay/sandbox` (v0.1.16, npm modified 16 Sep 2026) with a `freestyle` provider entrypoint. Per its README, the adapter supports buffered exec, file transfer, reattachment, listing and deletion. It does **not** advertise snapshots, fork, PTY or streaming logs "without the required live proof" [38].
- Freestyle docs have guides for the **OpenAI Agents SDK** (`SandboxClient` on a VM), **Mastra** (Workspace sandbox interface), **Supabase** (run the stack in a VM), and OpenAI model selection with edge-injected keys [39]. Freestyle's blog ranks itself #1 for OpenAI Agents SDK sandboxes (19 Jun 2026) [40].
- No Freestyle integration with **Terse Durable Actors** was found.

## 7. Founder philosophy (public statements) [F]

All quotes are from Ben on Launch HN [11] unless another source is cited.
- **Keep the agent outside the VM.** "I'm a big believer in agent chat running outside of the VM ... I would treat the VM as a tool the agent is using rather than the agent's environment." Also: "the computer is a tool the agent is using, and anything in the computer is untrusted."
- **Forking is for parallel exploration.** "When your coding agent has 10 ideas ... it needs to be able to evaluate them in isolation." "AI forks the environment 10 times ... then takes the best option." "branch per fork, merge what you like."
- **Snapshots are for deterministic reproduction.** "A QA agent ... could run for hours to trigger an edge case." Snapshotting it lets you replay it.
- **Credentials.** "If you put your gmail credentials into a VM that an AI Agent dealing with untrusted prompts has access to they should be treated as leaked." This shipped as edge secret injection [12].
- **Agents need computers, not tools.** "the next generation of agents is much more autonomous and just needs a computer."
- **APIs for agents** [30]: "Defaults are bad." "Errors are not bad." Prefer specific names (`displayName`, `slug`) over `name`. "Facts, not feelings": an API's value is a fact the agent cannot fake, such as "a virtual machine provisioned."

## 8. Roadmap hints

| Hint (date) | Status by Oct 2026 | Tag |
|---|---|---|
| "500ms. Less than 1 second. We're aiming to get that down to 200ms in the next 3 months" (Apr) | Homepage now says "A full Linux machine, ready in 65 ms" [13]. The third-party harness measures 0.69-0.72s median cold start from the client side [36] | [F] |
| Secrets API "starting with HTTP Headers, HTTP Git Authentication and Postgres. That'll land in a few weeks" (Apr) | Shipped, and extended to S3 signing and JSON Patch (Sep-Oct) [12][32] | [F] |
| "Hot pluggable ram ... backburner" (Apr) | Shipped as live CPU/memory resize, grow-only (Sep) [12] | [F] |
| Fork "O(N) behaviors ... remove those in the next 6 months" (Apr) | No public confirmation found | [F]/unverified |
| "researching systems of hot moving VMs across VMs" (Apr) | No public confirmation found | [F]/unverified |
| Security, RL, and auto-research segments | Kali image (24 Oct), RL and eval guides, about-page "Emerging Use Cases" | [F] [33][34] |

**[I] Likely next:** more vertical base images (after Kali), more framework adapters (Convex component repo pushed 5 Oct [4]), and more comparison content. Expect Ben to be very interested in anything showing **fork at scale**.

## 9. What Freestyle has said it wants built, and how it judges

- **Stated use cases [F]:** long-running agents, failure-prone exploration with branching and "time travel", complex coding, multi-tenant agent platforms, RL environments, "Auto Research Climbing", security/pentest labs, and agents reaching private VPCs [34].
- **Past judging behavior [F, BG]:** at the Aug 2025 YC AI Coding Agents Hackathon, Ben reshared the 2nd-place "Lovable for video games" team with: "I love this project. Its my favorite of the hackathon. This is something I've tried to build myself and failed at repeatedly. These guys have a finger on the pulse of entertainment" [28]. Another finalist built merge-conflict resolution on GitHub [27].
- **Their most-starred repo is an app builder [F]:** `freestyle-sh/Adorable` ("Open Source Lovable", 831 stars, last push 25 Aug 2026) dwarfs everything else in the org (next: `cloudstate` at 211) [4]. **[I]** Combined with the "Lovable for video games" reshare, an agent that builds and live-previews something inside forked VMs is squarely in their taste.
- **Recent sponsorship pattern [F]:** at Coshell's Multiplayer Coding Hackathon (3 Oct 2026, SF), Freestyle gave each winner "$10,000 in credits plus 6 months of Freestyle Pro" and pitched running the shared drive "on a Freestyle VM instead of a laptop" [41]. Its hackathon prize is consistently credits. Here the $10k sits inside the grand prize, and there is **no separate Freestyle track** at Haunted Hacks.

**[I] What would impress Ben and Jacob as judges:**
1. **Live fork of a running computer as the core mechanic.** For example, fork a VM mid-game, mid-browser-session, or mid-exploit 5-10 times, let parallel agents race, then keep the winner. This is the feature they built the hypervisor for, and almost no one else at the event can show it.
2. **Correct architecture:** agent loop and state *outside* the VM, the VM as a tool, keys injected at the edge. That maps directly onto **Terse Durable Actors as the controller** and **Agent Relay as the inter-agent bus**.
3. **Games, creative tools, benchmarks.** Brood War Bench, Blendmux, and the "Lovable for games" reshare all point to this taste.
4. **Agent-native polish:** explicit config, precise errors, no magic defaults.
5. Things that will **not** land: using Freestyle as a web host, short Python snippets, or anything on the deprecated Git or deploy APIs.

---

## Hackathon implications

**What to build (concrete, ranked) [I]:**
1. **"Haunted Multiverse" fork-race.** A Terse Durable Actor owns the game or task state and orchestrates. On a spooky trigger it snapshots a running Freestyle VM (a browser game, a haunted-house text MUD, a Minecraft server: Ben's own HN example) and forks it N ways. N agents coordinate over Agent Relay, each takes a different path in its fork, and the actor streams all forks live to the audience and "collapses" to the best timeline. This hits the Durable Actors track, the Agent Relay track, the grand prize ($10k Freestyle credits), and the "real-time" theme. Echo Ben's Brood War finding that subagents "didn't communicate" by showing Agent Relay fixing exactly that.
2. **"Cursed pentest" red team.** Spin up `freestyle/kali` plus a deliberately vulnerable target VM on a private VPC. Agents coordinate the attack over Agent Relay. Snapshot before each exploit and fork to test hypotheses. A Durable Actor holds the evidence log. This matches Freestyle's newest push (24 Oct) [33].
3. **Agent benchmark arena.** A small real-time game benchmark in the spirit of Brood War Bench, with matches in parallel VMs and a live leaderboard.

**Gotchas [F→I]:**
- Say **S24**, not F24. Don't cite the $10M Series A.
- The API surface is **VM-only**. Do not use `freestyle-sandboxes`, `/git/v1` or `/web/v1/deploy` [12][37].
- **Free plan caps are the real constraint for a fork demo [F]:** 10 concurrent VMs, **10 saved VMs total (stopped ones count)**, **10 snapshots**, max 4 vCPU/8 GiB/32 GB per VM, 40 vCPU/80 GiB total; Hobby ($50/mo, all usage credit) raises this to 40 concurrent / 200 saved / 1,000 snapshots [42]. A 1-to-8 fork race fits on Free only if you delete forks and snapshots between runs. The default VM size is 4 vCPU/8 GiB; set a smaller size to save budget. Free never bills usage and includes 200 vCPU-hours/month, so cost is not the issue; how the $100 event credit interacts with the Free plan's hard limits is unknown (ask the Freestyle team on the day, or redeem onto Hobby).
- The SDK is TS-first. The PyPI package is stale (see 01-docs-api.md).
- The Agent Relay Freestyle adapter does **not** advertise snapshot or fork [38]. Call the `freestyle` SDK directly for fork and use Relay only for messaging.
- Superserve is a co-sponsor and a competitor. If you use both, give each a distinct role (for example, Superserve for cheap ephemeral Python runs, Freestyle for the forkable heavyweight world), or pick one. Don't run them as interchangeable twins in front of either team.
- Network is **default-deny [F]**: "`firewall` is required on `vms.create`. A VM gets nothing implicitly — no outbound Internet, no inbound." Without an allow rule to `{ public: true }` there are no package installs and no OpenAI calls. VMs on the same VPC also cannot talk until a rule allows it ("Membership is not permission"). Only allow rules exist today [43].

**Setup before Oct 31 [I]:**
- Install the docs skill: `npx freestyle@latest skill install` (or follow `freestyle.sh/docs/onboard.md`).
- Run `npx freestyle@latest login` and create a token.
- Boot one Ubuntu VM and one `freestyle/kali` VM, and time a snapshot→fork round trip. Pre-script the fork-and-compare helper (the idea is allowed; the code must be written at the event).
- Read the Mastra and OpenAI Agents SDK sandbox guides [39].

**Demo framing for these judges [I]:** show the fork happening live, with memory state visibly identical across forks (same animation frame, same game tick). Then show divergence. Say explicitly: "agent loop lives in a Durable Actor; the VM is an untrusted tool; the OpenAI key never enters the VM."

---

## Limits / could not verify

- No interview or direct statement from Freestyle about *this* event's judging. Whether a Freestyle founder will be a judge is unknown (the event page says "Judges will be announced soon").
- I did not read Jacob Zwang's own X or LinkedIn feeds; his handle (@theshortjacob) is inferred from a retweet on the @freestyle_dev Nitter mirror. The @freestyle_dev count (8 tweets, 418 followers) also comes from that mirror.
- The customer list comes from homepage logos and alt text only. Usage, ARR, and revenue are unknown.
- Fork O(1) progress and cross-node VM migration status are unconfirmed.
- Funding beyond the YC-standard amounts is not public. An undisclosed round cannot be ruled out.
- I did not identify who runs aisandboxbench.com. Its callers are in Florida and Frankfurt; where Freestyle's racks physically sit was not verified.
- I did not check for a Freestyle presence at other Oct 2026 events beyond those cited.

## Sources

1. YC company page, Freestyle (S24): https://www.ycombinator.com/companies/freestyle
2. YC company page, Freestyle AI (F24, email): https://www.ycombinator.com/companies/freestyle-ai ; https://www.linkedin.com/in/allennaliath
3. Ben Swerdlow LinkedIn (mirror, crawled 22 Oct 2026): https://linkedin.com/in/benswerdlow
4. GitHub org: https://github.com/freestyle-sh (via `gh repo list`, 29 Oct 2026)
5. Careers: https://www.freestyle.sh/careers
6. Aventure funding page: https://aventure.vc/companies/freestyle-san-francisco-ca-us/fundraising
7. LinkedIn company "Freestyle Cloud": https://linkedin.com/company/freestylecloud
8. Diaper-brand Series A: https://parsers.vc/news/260315-freestyle-secures-10m--revolutionizing-baby/ ; https://www.pulse.bot/entrepreneurship/news/freestyle-closes-10m-series-a-c61bc027-c072-4c8c-943e-de529476ffb3/ ; https://raising.fi/company/freestyle.world
9. Launch YC, "TypeScript for EVERYTHING": https://www.ycombinator.com/launches/LGW-freestyle-typescript-for-everything
10. Deprecating the Dev Server API (18 Feb 2026): https://www.freestyle.sh/blog/product/deprecating-dev-servers
11. Launch HN (6 Apr 2026): https://news.ycombinator.com/item?id=47663147
12. Changelog (9 Sep 2026 entry): https://www.freestyle.sh/changelog
13. Homepage: https://www.freestyle.sh/
14. A review of the adaptability of sandboxes (16 Sep 2026): https://www.freestyle.sh/blog/product/adaptability-of-sandboxes
15. Sprites Connectors ... Terrible API Design (23 Sep 2026): https://www.freestyle.sh/blog/opinion/sprites-connectors-terrible-api-design
16. Boat.dev vs Freestyle (4 Oct 2026): https://www.freestyle.sh/blog/product/boat-dev-vs-freestyle
17. Superserve YC page and repo: https://www.ycombinator.com/companies/superserve ; https://github.com/superserve-ai/superserve ; https://www.superserve.ai/
18. Brood War Bench report: https://bw.swerdlow.dev/report
19. How I built Blendmux (30 Sep 2026): https://www.freestyle.sh/blog/engineering/how-i-built-blendmux
20. @freestyle_dev (Nitter mirror): https://nitter.rdrama.net/freestyle_dev
21. Ben's site: https://www.swerdlow.dev/
22. You're starving your agent (Apr 2026): https://www.freestyle.sh/blog/opinion/youre-starving-your-agent
23. GIGAZINE (25 Sep 2026): https://gigazine.net/gsc_news/en/20260925-starcraft-brood-war-bench/
24. Cursed Agents Demo Night post (6 Oct 2026): https://www.linkedin.com/posts/benswerdlow_freestyle-is-hosting-the-cursed-agents-demo-activity-7513053162589769728-LAPg
25. StartupIntros (misattributed): https://startupintros.com/news/2026-03-11-freestyle-series-a
26. YC deal: https://www.freestyle.sh/yc ; https://www.freestyle.sh/yc.md
27. AI Coding Agents Hackathon (Luma): https://luma.com/hzwlapu0 ; finalist post: https://www.linkedin.com/posts/jmunevar_yippee-jia-chen-legend-in-the-making-activity-7360308620317675520-9Q7t
28. Ben's reshare (Aug 2025): https://www.linkedin.com/posts/benswerdlow_i-love-this-project-its-my-favorite-of-the-activity-7360900805811425283-IK8L
29. The Future of AI Coding Agents (29 Aug 2025): https://www.freestyle.sh/blog/engineering/next-gen-app-builder
30. Designing APIs for Agents (9 Jul 2026): https://www.freestyle.sh/blog/opinion/designing-apis-for-agents ; HN: https://news.ycombinator.com/item?id=48894874
31. Introducing Rigkit: https://www.freestyle.sh/blog/product/introducing-rigkit ; 16 questions: https://www.freestyle.sh/blog/product/questions-to-ask-before-choosing-a-sandbox-provider
32. Changelog, 14 Oct 2026: https://www.freestyle.sh/changelog/changelog-october-14
33. Give Your AI Security Agent a Kali VM (24 Oct 2026): https://www.freestyle.sh/blog/product/give-your-ai-security-agent-a-kali-vm
34. About: https://www.freestyle.sh/about.md
35. Why AI sandboxes Suck (15 May 2026): https://www.freestyle.sh/blog/opinion/why-ai-sandboxes-suck
36. Sandbox bench (22-26 Oct 2026): https://aisandboxbench.com/
37. "I Benchmarked 9 Agent Sandboxes" (5 Oct 2026 runs): https://gobare.hashnode.dev/i-benchmarked-9-agent-sandboxes-2-vcpu-was-off-by-3-2
38. @agent-relay/sandbox: https://github.com/AgentWorkforce/sandbox ; https://libraries.io/npm/@agent-relay%2Fsandbox
39. Docs index (guides for OpenAI, Mastra, Supabase): https://www.freestyle.sh/docs/llms.txt
40. Top 5 Sandboxes for OpenAI Agents SDK (19 Jun 2026): https://www.freestyle.sh/blog/product/top-5-openai-agents-sdk-sandboxes
41. Multiplayer Coding Hackathon (3 Oct 2026): https://luma.com/hacs1uig
42. Pricing and Limits (docs): https://www.freestyle.sh/docs/vms/pricing-and-limits.md
43. Firewall (docs): https://www.freestyle.sh/docs/vms/network/firewall.md

## Verification log (2026-10-29)

Adversarial re-check by a second pass. Method: raw `curl` of each page (YC, freestyle.sh, docs `.md`, Luma, benchmark sites), HN Firebase and Algolia APIs, `gh api` and the npm registry, Exa fetch for LinkedIn, aVenture and Nitter.

| # | Claim | Outcome |
|---|---|---|
| 1 | freestyle.sh is YC S24, primary partner Diana Hu, team size 5 | **Confirmed** on YC page [1]. freestyle.ai is F24 (Allen Naliath), also Diana Hu, also titled "Freestyle" on YC [2]. Event page's "F24" is wrong for freestyle.sh. |
| 2 | Both founders were senior engineers in Apple Conversational Engineering | **Corrected.** Only Jacob is placed in Conversational Engineering; Ben describes a consultant role where he "became a senior" [1]. UChicago confirmed via swerdlow.dev [21]. |
| 3 | Launch HN 6 Apr 2026, 322 points, 158 comments, by benswerd | **Confirmed** via Firebase API (item 47663147). Designing APIs for Agents: 79 points confirmed [30]. |
| 4 | Ben's HN quotes in sec. 7 and sec. 6a (platforms, agent outside VM, 10 forks, branch per fork, gmail credentials, exe.dev, "order of magnitude", sysd, O(N), hot moving, hot pluggable RAM, 200ms) | **Confirmed verbatim** in Algolia's 57 benswerd comments. Minecraft example **confirmed** in the Launch HN post body. |
| 5 | 9 Sep 2026 "Freestyle is now focused on VMs" with Git/code-exec/web-deploy/trigger deprecations | **Confirmed** [12]. **Corrected:** E2B and OpenShell migration guides belong to the 14 Oct entry, not 9 Sep. |
| 6 | Default-deny networking | **Confirmed and strengthened** from firewall docs: `firewall` required on create; no implicit egress or inbound; VPC membership grants nothing [43]. |
| 7 | "Free tier minimum VM is 4 vCPU/8 GB" | **Refuted as stated.** 4/8/32 is the default and the Free *maximum*; smaller sizes are allowed [42]. Added Free plan caps (10 concurrent, 10 saved, 10 snapshots), which were missing and matter for a fork demo. |
| 8 | gobare: Freestyle most expensive at $4.44 | **Corrected.** $4.44 confirmed, but Vercel was dearer at 0% idle ($5.71); Freestyle tops only the 50-95% idle columns, and ran at double the resources [37]. 401 with `freestyle-sandboxes` confirmed. |
| 9 | aisandboxbench: fastest resume Freestyle; cold start Superserve/E2B "depending on caller location"; Freestyle cold start 0.81-1.1s | **Partly corrected.** Resume 0.35s/0.32s confirmed; the split is by machine config (same 4/8 vs default), not location; Freestyle medians are 0.69s/0.72s. Dates 22-26 Oct and 8 providers confirmed [36]. |
| 10 | Superserve YC copy (<50ms, pause/fork, keys outside, >100K machines/week, Lindy, YC), Apache-2.0, ~467 stars, MCP server | **Confirmed** except: stars now 475; Firecracker confirmed in README; MCP server **unverified** (not in README) [17]. Superserve is YC Fall 2026, team size 3. |
| 11 | `@agent-relay/sandbox` v0.1.16 (npm modified 16 Sep) with `freestyle` entrypoint; no snapshots/fork/PTY "without the required live proof" | **Confirmed** from npm registry and README; README also says lifecycle is undeclared because "the live validation account could not create a persistent VM" [38]. |
| 12 | Coshell Multiplayer Coding Hackathon 3 Oct 2026: "$10,000 in credits plus 6 months of Freestyle Pro" | **Confirmed** (Luma start_at 2026-10-03); also $500 day-of credits there [41]. Haunted Hacks $10k Freestyle credits are inside the grand prize: **confirmed** on the event page; no Freestyle track. |
| 13 | Brood War Bench: 19 configs, parallel across Freestyle VMs, Codex Astra/xhigh 18-0, "None of the models played beyond a beginner level", subagents "didn't communicate much" | **Confirmed** on the report (Astra/xhigh row is all W across 18 opponents) [18]. Launch date refined to mid-Sep. |
| 14 | Sprites post 23 Sep, Boat post 4 Oct ("Boat.dev is cheaper", 16/32 vs 32/64), Blendmux 30 Sep by Jacob ("when the GPT-6 models came out"), Kali 24 Oct (Kali 2026.3, `freestyle/kali`) | **All confirmed** on the live pages. Kali snapshot is 4 vCPU/8 GiB/32 GB, i.e. the full Free per-VM maximum. |
| 15 | YC deal "$5k credits + $25k match" | **Confirmed** on yc.md: $5,000 credits plus 1:1 match up to $25,000, 12 months, includes Hobby for 6 months [26]. |
| 16 | Homepage "ready in 65 ms", CTA prompt, logos | **Confirmed**; added cmux to the logo list [13]. |
| 17 | Funding: aVenture $500K seed, YC only | **Confirmed** (page updated Oct 2026) [6]. LinkedIn $625K and the diaper-brand Series A sources were **not re-fetched**; left as originally reported. |
| 18 | @freestyle_dev: joined Apr 2026, ~418 followers | **Confirmed** on Nitter mirror (joined 15 Apr 2026, 418 followers, 8 tweets) [20]. |
| 19 | Cursed Agents Demo Night post 6 Oct 2026 | **Confirmed** via Exa fetch of the LinkedIn post [24]. |
| - | Aug 2025 YC AI Coding Agents Hackathon details and Ben's "favorite of the hackathon" reshare [27][28]; "You're starving your agent" authorship [22]; Rigkit/16 questions [31]; OpenAI SDK ranking post [40] | **Not re-checked** in this pass (background or low decision weight). |
