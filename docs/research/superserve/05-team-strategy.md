# Superserve: team, strategy and competition

Checked **29 October 2026** for Haunted Hacks (Sat 31 Oct 2026, SF). Scope: who runs Superserve, what they say in public, how they position against rivals, and what is likely to impress them as judges. Product mechanics, pricing and setup are in `00-early-draft.md` and are only repeated here where they bear on strategy. Every claim carries a source number. **[BG]** marks items dated before Aug 2026, which are background only. **Inference** is labelled.

Method: YC company page; superserve.ai blog posts (fetched); founder and company posts on LinkedIn (via Exa); X posts read through Nitter, teapawt and zamantika mirrors (x.com was not fetched directly); the GitHub API via `gh` for the org, its forks and YC's `qm` repo; aisandboxbench `results.md` fetched with curl; funding coverage of competitors.

---

## TL;DR

- **The product, verified:** Firecracker-microVM sandboxes for AI agents. They pause with memory and disk intact (no compute billed while paused), resume, and snapshot or fork. Around the VM sit a credential broker, egress rules and an out-of-VM network log. YC tagline: "Virtual machines for autonomous agents". Site tagline: "Virtual machines for long-horizon agents". This is **not** model serving. [1][2]
- **The team is three people, led by one founder.** **Pavitra Bhalla** is the only listed founder (CEO). Before this he was Staff SWE at Dosu (code-reasoning agents) and founding engineer, later Director of Engineering, at LTSE (YC S17). **Amit Patil** (Founding Engineer since Nov 2025) is the top committer and writes the integration posts. "Jeet" (`nirnejak`) writes setup guides. YC primary partner: Max Kolysh. [1][3][4][5]
- **They pivoted.** The Oct 2025 pre-seed (Open Core Ventures, amount undisclosed) was pitched as "the first Agentic AI compute platform on Ray". By mid-2026 the product had become Firecracker VMs. [6][7][5]
- **Their go-to-market runs through harnesses.** They want to be the default "hands" under other companies' agent loops: Claude Managed Agents (12 Jun), Agno (5 Aug), LangChain deepagents (9–10 Aug), Lindy Teammate (10 Aug), Cursor Cloud Agents (1 Oct), Omnara (23–24 Oct), and **YC's own `qm` harness**, which ships a Superserve backend. [8][9][10][11][12][13]
- **The founder's competitive story** is VMs, not containers; pause/resume/fork as first-class features; speed benchmarks; and "taste". Main foils he names: **Daytona** (just raised a $60M Series B at a $1B valuation), Modal, E2B, Vercel, Cloudflare and **AWS**. He has praised **Freestyle**, a co-sponsor, as one of the companies "innovating on the tech of what a programmable computer is". [14][15][16]
- **Best hackathon precedent:** Superserve ran its own prize track at Terac's Zero-Human Company Hackathon (15 Aug 2026, SF). Bhalla attended, and the 2nd-place team said he chatted with them afterwards. **1st place ($1,000): Foundry** (Nithin Aruswamy and Pranav Achar), an agent "holding company" that boots **eight Superserve VMs**, one per prospect, and the company replied "Great use case and solid implementation". **2nd place ($500): TalosAI** used Superserve for **isolated repair sandboxes with independent verification**. [15][17][18][19][35]
- **Freestyle has the bigger stake at this event.** The grand prize includes $10,000 in Freestyle credits against $1,000 from Superserve. Per-attendee credits are equal at $100 each. [34]

---

## 1. People

| Person | Role | Background and public footprint | Source |
|---|---|---|---|
| **Pavitra Bhalla** | Founder/CEO (sole listed founder) | Staff SWE at Dosu, building code-reasoning agents "used by 200K engineers" (HashiCorp, Datadog, LlamaIndex). Before that, founding engineer and then Director of Engineering at Long-Term Stock Exchange (YC S17), where his LinkedIn says he led "3 teams and 16 engineers". 13+ years' experience. LinkedIn ~2,376 followers and X `@pavitrabhalla` ~299 followers, 399 tweets (follower counts unverified in the 29 Oct re-check). 43 commits to `superserve-ai/superserve`, the third-highest count. GitHub bio: "Building virtual machines for agents" | [1][3][14] |
| **Amit Patil** | Founding Engineer, Nov 2025 to present | Top contributor to `superserve-ai/superserve` (133 commits). Author of the Secrets post (19 Jun) and the Cursor post (1 Oct). Wrote the Superserve backend fixes in the `qm` fork (10–13 Oct) | [4][9][20] |
| "Jeet" (`nirnejak`) | Engineer / content | 54 commits. Wrote the OpenClaw and Hermes Slack setup guides (May) [BG] | [20][21] |
| `awille-ai`, `mohamedsobhi777` | Contributors | 39 and 16 commits respectively. Roles not confirmed | [20] |
| Max Kolysh | YC primary partner | Listed on the YC page | [1] |

- The LinkedIn company page shows **3 employees** and **1 active job posting** [5]. The YC page independently confirms a team size of 3. The job posting is unverified in the 29 Oct re-check. [1] The founding post [BG] thanked Sid Sijbrandij (GitLab co-founder, Open Core Ventures), Richard Aberman, Eric Ries (LTSE founder) and others [6].
- A secondary aggregator (getclera, "Superserve (ex. Ray AI)") claims the founders co-created the Open Cap Table Format. This is **unverified**, and the page's wording is garbled [22].

## 2. Funding and company facts

| Item | Value | Confidence | Source |
|---|---|---|---|
| Pre-seed | Open Core Ventures, Oct 2025, amount undisclosed | Founder post | [6] |
| YC | Fall 2026 batch. Dealroom lists $125K in Sep 2026. PitchBook lists a $500K accelerator deal | Aggregators only, not confirmed by the company | [7][23] |
| Former name | "Ray AI", built on the Ray compute engine. The org still has a `ray` fork, last pushed Dec 2025 | PitchBook and GitHub | [7][20] |
| Traction claim | "over 100K machines (as of Oct 2026) every week… including Lindy, and Y Combinator itself" | Company-submitted. Founderland could not confirm YC as a user [23]. **Partial corroboration:** YC's own `yc-software/qm` repo (15.6k stars) ships a `superserve` sandbox backend and Superserve agent templates (see §4) | [1][13] |
| Growth spend | YC deal: 1 year of Pro free plus up to $90K in credits. F26 companies get "$30K a month for your first 3 months" | Company page | [24] |

## 3. What the founder and team say in public (Aug–Oct 2026)

Verbatim quotes, taken from X mirrors and LinkedIn:

- **On VMs vs containers (X, 19 Sep):** "Superserve sandboxes are VMs, not containers. We don't even have an option to run containers as sandboxes. This is simply because containers don't give you the right level of isolation required for agent execution environments." [14]
- **On speed (X, 9 Oct):** "fastest TTI on burst workloads amongst major sandbox providers, including Modal, Vercel, Daytona, E2B, and Cloudflare." The post links to the ComputeSDK benchmark (computesdk.com/benchmarks), which explains why the org keeps a `computesdk` fork. [14][15]
- **On aisandboxbench (X, 23 Oct):** "Great sandbox benchmark work by @leodev. @superserve_ai has the fastest cold starts, snapshot starts and fan-out burst creates. Zero failures. microVM isolation." [15]
- **On agent experience (company X/LinkedIn, 11 Oct):** "#1 Sandbox and #2 DevTool overall. That's how Claude and Codex see us. We wanted to make something agents want." Bhalla quote-tweeted it with: "We made something agents want 💜". The source is Jun Liang Lee's DevToolArena run. He congratulated Superserve "for tying #1 for claude codex sandbox category and #2 for codex overall". The roundup's category-leader list itself names only Daytona for Sandbox. [15][25]
- **On AWS (X, 26 Oct):** "Most customers evaluating @superserve_ai are comparing us with AWS… Faster starts. Faster disks. More control. Fewer limits. An SDK you'll actually enjoy using. Support from the people who built it. Taste in the details. Oh, and AWS costs ~52% more." [14][15]
- **On computer use vs Daytona (X, 29 Oct; the date comes from the mirror's post ID):** "18× faster desktop startup: 0.3s vs. 5.4s - 17× faster typing 1,000 characters… 3.7× faster click → screenshot: 142ms vs. 522ms - 20% faster human takeover". This was a reply to a user complaining about takeover latency in Devin and Daytona. [15]
- **On market structure (X, exact date not visible in the mirror):** "I'm a believer that 'run ai code' is already a commodity. There are 6+ YC companies this batch that just run cloud hypervisor on hetzner… There is a second group including @freestyle_dev, @tensorlake @archildata @indexablehq and others who are innovating on the tech of what a programmable computer is." [16]
- **On long-running agents (LinkedIn, 21 Jul) [BG]:** "Most AI agent frameworks have a dirty secret. They run on sandboxes that die after 24 hours… pause an agent mid-task, snapshot exactly where it is, fork it into parallel branches… resume any version… Bring your own agent harness (Claude Code, Codex, whatever)." [26]
- **Mission line, repeated on 12 Jun [BG] and since:** "We are building Superserve for a world where software is run by agents. That shift needs a new kind of cloud, one that's programmable to the core." [8]
- **Their own buyer's-guide framing (blog, 19 May) [BG]:** a comparison of OpenAI Agents SDK sandbox providers. It calls E2B the "safest starting bet" for untrusted code, Modal best for GPU, and Daytona good for stateful workspaces whose isolation is "less clearly documented". It positions Superserve on **persistent-by-default**: "Persistent-by-default is genuinely hard, which is part of why the native list mostly punts on it." [27]

**Recurring themes (inference from the above):** (1) isolation purity, meaning microVM only; (2) state that survives, through pause/resume/fork, plus the absence of a 24h session cap; (3) security outside the VM, through the secret broker, egress rules and network log; (4) speed claims backed by third-party benchmarks; (5) being easy for *agents* to use (SKILL.md, MCP, DevToolArena).

## 4. Strategy: distribution through harnesses (verified list)

| Date | Integration / customer | What Superserve plays | Source |
|---|---|---|---|
| 12 Jun [BG] | **Claude Managed Agents** (Anthropic) | Tool-execution sandbox. "decouples the brain from the hands". ClaudeDevs listed Superserve with Blaxel, E2B, Google Cloud and Namespace | [8][15] |
| 15 Jul [BG] | Phaser game agent | Every game build runs in a sandbox | [21] |
| 31 Jul | openclaw/crabbox provider (community-built) | Provider adapter | [15] |
| 5 Aug | **Agno** AgentOS | Persistent sandboxes. Secrets through a proxy token | [10] |
| 9–10 Aug | **LangChain deepagents** (`langchain-superserve`, 28 stars) | Backend. Sydney Runkle (LangChain) highlighted "no session limits" | [11][20] |
| 10 Aug | **Lindy Teammate** | "Superserve powers the computers behind Lindy Teammates" | [23] |
| 1 Oct | **Cursor Cloud Agents** (Self-Hosted Machines) | Per-request microVM, hibernate on idle, egress allowlist, out-of-VM log | [9] |
| 10–13 Oct | **YC `qm`** ("multiplayer agent harness for work") | `SANDBOX_BACKEND=superserve`, one persistent sandbox per scope, "Paused sandboxes resume on use". The other backends in `cli/src/providers.ts` are local Docker, Fly Sprites, E2B, agent37 and (on the AWS target) `aws` | [13][28] |
| 23–24 Oct | **Omnara** | Superserve is a "machine provider". A `superserve/omnara` template exists | [12][15] |

Roadmap hints from GitHub (inference, not announcements). The org forked `harbor-framework/harbor` (the Terminal-Bench eval harness) on 26 Oct. Harbor's README lists Daytona, Modal and others but **not yet Superserve**, which points to an RL/eval provider push. The YC page explicitly names "eval and training environments" and "RL rollout" as ICP. A `reproducible-runs` example (2 Oct) shows checkpoint, restore and export for deterministic runs. There is also `sandtrace` ("hypervisor-level audit trails", Mar) and a `computesdk` fork (created 9 May, last pushed 5 Oct). That fork backs the ComputeSDK benchmark the founder cites (see §3). [1][15][20]

**ICP, as the company states it:** "teams building coding agents, autonomous workers, or eval and training environments" [1]. In practice the buyers are harness and agent-platform builders, not end users.

## 5. Competition

| Competitor | Funding / scale (verified) | Isolation and positioning | How Superserve differs (their claim or evidence) |
|---|---|---|---|
| **Daytona** | $60M Series B at $1B valuation, 20 Oct 2026, led by FirstMark Growth, $91M total. Revenue up ~25× since January (company claim). Fortune names Anthropic, OpenAI, Nvidia, Cursor, Cognition, Meta and Cohere as customers | "Agent Cloud". Linux, Windows, macOS and GPU sandboxes. Pause, fork, snapshot | Superserve picks Daytona as its direct foil on computer-use latency (29 Oct). aisandboxbench says Daytona "has no pause" for its container sandboxes. Daytona wins tool-replay and reconnect [29][30][15][31] |
| **E2B** | $21M Series A, Jul 2025 (Insight) [BG] | Firecracker, open source | Superserve's own guide calls E2B the safe default and argues it is weaker on persistence [27][29] |
| **Modal** | $750M Series D at $15.75B post-money, 14 Oct 2026, led by Accel. Over $1B annualized run rate. Accel says sandboxes account for $300M of it [36] | gVisor. Strong on GPU | Superserve argues gVisor is weaker isolation than microVMs and that Modal is slow with heavy images [27][29] |
| **Vercel Sandbox** | GA 30 Jan 2026. Cursor Cloud Agents support 3 Sep 2026 | Firecracker. Runtime caps (45 min Hobby / 5 h Pro, per Superserve's guide) | Persistence and no session cap [23][27] |
| **AWS (Lambda MicroVMs, EC2)** | Lambda MicroVMs launched 22 Jun 2026. Follow-up posts on 10 Jul position them as Claude Managed Agents sandboxes, with sessions of up to 8 h [37] | Firecracker VM isolation, suspend/resume | Founder: AWS "costs ~52% more". Better SDK, support and "taste" [23][14] |
| **Cloudflare Sandbox** | Beta | Container isolation | VMs vs containers [27] |
| **Freestyle** (co-sponsor, F24) | Funding not researched here | "Full Linux VMs for AI agents", 65 ms ready, live cloning of running VMs with memory, nested virtualization | Founder publicly groups Freestyle with the "innovators", not the commodity tier [16][32] |
| Long tail | Blaxel (joined Baseten), Runloop, Tensorlake, Upstash Box, boxd, Tenki, Boat, many Hetzner-based YC entrants | Varied | "'run ai code' is already a commodity" [16][23] |

**Third-party benchmark context (aisandboxbench same-spec track, run 22–23 Oct 2026, 4 vCPU/8 GB):** Superserve was **first** on cold start (0.52 s median), 25-sandbox fan-out (0.79 s), take-snapshot (0.39 s) and start-from-snapshot (0.55 s). It was 2nd on tool replay (behind Daytona) and **3rd on pause+resume (0.93 s median)**, behind boxd (0.53 s) and **Freestyle (0.72 s)**. Its reliability was 100%. Note that the field is narrow (9 providers, with no Modal or Vercel) and that the page says it was built around its own SDK. Its "Every provider asked for Boat's machine" wording suggests a provider-affiliated author. Bhalla credits the work to "@leodev", and the page times everything through "Sandbox SDK, built by us". Treat it as directional. Freestyle, the co-sponsor, came 2nd on take-snapshot (0.43 s) and start-from-snapshot (0.75 s), so the two sponsors are close on the fork primitives. **Measured pause+resume (~0.9 s end to end) is far above the "<50 ms resume" marketing figure.** [31]

**Inference:** Superserve is a 3-person company competing against a newly minted unicorn (Daytona) and well-funded incumbents. Its levers are speed, integration breadth and agent-experience polish. A hackathon that shows a *new kind of agent only practical on pausable/forkable VMs* gives the founder exactly the story he tells in public.

## 6. Hackathon track record (most relevant precedent)

- **Zero-Human Company Hackathon** (Terac, Humanmade SF, 15 Aug 2026; 200 builders; challenge: "an agent that can run a business on its own"). The company LinkedIn post said: "Superserve is powering… I will be there in person, and we will be giving away prizes for the best use of Superserve." [17][33]
  - **1st, Superserve track ($1,000): Foundry**, by Nithin Aruswamy (`@nithinaru`) and Pranav Achar. In the demo video it is "a holding company with no humans" that clusters the user's X followers into prospects. For each prospect it "boots up eight super server virtual machines that run in Ubuntu server", hires a human specialist through Terac, and bills the customer. Superserve's account replied (20 Aug): "Great use case and solid implementation". Pattern: **one VM per customer/business, spun up in parallel.** [15][19][35]
  - **2nd, Superserve track ($500): TalosAI**, "a software repair company with no employees". Its design point was that "the AI can't grade its own work". Repair ran in isolated Superserve sandboxes, Replay.io did independent QA, and Terac supplied human verification. The team said Bhalla took "the time to chat with us afterward". [18]
- **WorkOS demo night, 6 Aug:** Bhalla demoed "secure agent sandboxes". [15]
- An organiser's recap (Sarthak, 20 Aug) put attendance at 200+ and cash prizes at $12,000. Terac's pre-event blog said "more than $10,000 in prizes". [15][33]
- No Superserve-specific track is listed for Haunted Hacks. Its money there is $100/attendee in credits plus $1,000 inside the grand prize. Freestyle puts $10,000 into the grand prize. [34]

## Limits / could not verify

- Whether Bhalla or anyone else from Superserve is **judging or attending** Haunted Hacks. We found no post about Haunted Hacks, Halloween, Terse or Agent Relay from Superserve accounts.
- Exact dates of the "commodity/Hetzner" tweet and the @zeeg reply (mirrors show relative dates only).
- Funding amounts: Open Core pre-seed undisclosed. YC figures exist only in aggregators ($125K Dealroom vs $500K PitchBook).
- The 100K machines/week claim. YC usage is only indirectly supported, via `qm`'s backend, not via a statement from YC.
- Any **relationship between Superserve and the hosts**. No Superserve code turned up in the AgentWorkforce (Agent Relay) org search, and Agent Relay's sandbox package has no Superserve adapter (see 00-early-draft).
- Bhalla's direct X timeline: x.com was not fetched directly, mirrors returned 403 or partial content, and posts may be missing.
- The authorship and independence of aisandboxbench and DevToolArena (the latter runs "powered by Lightsage" infrastructure).

---

## Hackathon implications

**What would impress Superserve judges (inference, grounded in §3–§6):**
1. **An agent that lives in a VM over time, not one `exec` call.** Show it pausing (billing stops), then waking on an event with a **running process still in memory**. This is the "closing your laptop's lid" line from their own posts [8]. Durable Actors is the natural waker: one actor per agent stores the `sandboxId` and calls `connect()` on a message. Agent Relay delivers that message.
2. **Fork-and-race.** Snapshot one prepared VM, fork N children, let agents coordinate over Relay, keep the winner. Fork is a headline primitive in every Superserve launch post [8][26].
3. **Verification separated from action, plus one VM per entity.** Both placing projects in their own track used these patterns. TalosAI (2nd): the agent that acts cannot approve its own work, so one sandbox acts and another, isolated one verifies [18]. Foundry (1st): a fleet of VMs spun up in parallel, one per customer [35]. Both map onto Agent Relay (agents coordinating) and Durable Actors (one actor per VM).
4. **The security narrative.** A prompt injection tries to exfiltrate, the egress allowlist blocks it, and the out-of-VM network log shows it on screen. This mirrors their Cursor post almost exactly [9].
5. **Speed you can see.** A live `superserve/desktop` stream with a fast agent "possessing" it. The founder is pushing computer-use latency right now (29 Oct) [15]. This also fits the "Real-Time AI" theme and Halloween ("haunted computer").

**Gotchas from the strategy angle:**
- **Freestyle is a co-sponsor selling nearly the same thing** (VMs, live cloning, pause), and it is the larger grand-prize sponsor ($10k credits vs $1k). Don't pit them against each other on stage. Give each a distinct role (for example, Superserve for agent VMs and Freestyle for something else), or pick one and say why. The founder respects Freestyle publicly [16].
- Don't call it "serverless" or "containers". The founder corrects that framing ("VMs, not containers").
- Don't quote "<50 ms resume" as fact in your demo narration. Independent measurements put pause+resume at ~0.9 s [31]. Saying "sub-second resume" is safe.
- The Superserve payoff here is the grand prize plus credits, not a track. Use it as a force multiplier for the Durable Actors and Agent Relay tracks.

**Setup before 31 Oct (no project code):** follow the CLI, login, key and smoke-test steps in `00-early-draft.md`. Have 2–3 founder-quote talking points ready (the persistent-by-default thesis, the brain/hands split). If Bhalla is present, ask at check-in whether Superserve has its own judging criteria or bonus.

**Pitch line that maps onto their worldview (suggestion):** "Every ghost gets its own computer. It sleeps for free, wakes when summoned, forks to haunt in parallel, and can't phone home." Pause, resume, fork, egress.

---

## Sources

1. YC company page: https://www.ycombinator.com/companies/superserve
2. Superserve homepage (agent view, fetched 29 Oct): https://www.superserve.ai/
3. Pavitra Bhalla LinkedIn: https://linkedin.com/in/pavitrabhalla
4. Amit Patil LinkedIn: https://linkedin.com/in/amitpatil010
5. Superserve LinkedIn company page: https://linkedin.com/company/super-serve-ai
6. Founding / pre-seed post, 15 Oct 2025 [BG]: https://www.linkedin.com/posts/pavitrabhalla_careers-superserve-building-sandbox-infra-activity-7384310361862131712-yqC2
7. PitchBook: https://pitchbook.com/profiles/company/1318815-46
8. Claude Managed Agents on Superserve, 12 Jun 2026 [BG]: https://www.superserve.ai/blog/claude-managed-agents-on-superserve/ and LinkedIn https://www.linkedin.com/posts/pavitrabhalla_excited-to-announce-that-weve-partnered-activity-7471338174552645632-Nvqo
9. Cursor Cloud Agents on Superserve, 1 Oct 2026: https://www.superserve.ai/blog/cursor-cloud-agents-on-superserve/ and Amit Patil post https://www.linkedin.com/posts/amitpatil010_cursor-cloud-agents-now-run-on-superserve-activity-7511644227701911552-i8My
10. Agno integration, 5 Aug 2026: https://www.linkedin.com/posts/pavitrabhalla_new-banger-integration-alert-agno-agents-activity-7490890538338967552-pNQP
11. LangChain deepagents, 10 Aug 2026: https://www.linkedin.com/posts/pavitrabhalla_github-superserve-ailangchain-superserve-activity-7492685253539635200-x9XI
12. Omnara (X, 23–24 Oct, via mirror [14])
13. YC `qm` repo and Superserve backend doc: https://github.com/yc-software/qm and https://github.com/yc-software/qm/blob/main/docs/superserve.md
14. Pavitra Bhalla X via Nitter mirror: https://nitter.rdrama.net/pavitrabhalla (also https://twstalker.com/pavitrabhalla)
15. Superserve X via teapawt mirror: https://teapawt.org/superserve_ai
16. Founder X via zamantika mirror (commodity/Hetzner quote): https://zamantika.com/profile/pavitrabhalla
17. Superserve LinkedIn, Zero-Human hackathon sponsorship, 30 Jul 2026: https://www.linkedin.com/posts/super-serve-ai_activity-7488676422224551937-f1zo
18. TalosAI 2nd place, Superserve track: https://www.linkedin.com/posts/girikratna-sharma_ai-agenticai-hackathon-activity-7494970932126523393-JfXL and https://www.linkedin.com/posts/abhinav-garg-12b9343b5_my-team-and-i-just-won-500-at-the-zero-human-activity-7494806275881459712-Pp3C
19. Nithin Aruswamy LinkedIn (1st place, Superserve track): https://linkedin.com/in/aruswamy
20. GitHub org and contributors (via `gh api`, 29 Oct): https://github.com/superserve-ai
21. Superserve blog index: https://www.superserve.ai/blog/
22. getclera profile (low confidence): https://www.getclera.com/companies/superserve-ex-ray-ai
23. Founderland, 28 Oct 2026: https://www.founderland.ai/articles/superserve-launches-vms-for-ai-agents-now-at-100k-weekly-run-mvshtedg
24. YC deal page: https://www.superserve.ai/yc/
25. DevToolArena roundup reshared by Superserve, 11 Oct: https://www.linkedin.com/posts/super-serve-ai_activity-7514895783184252929-jani
26. "Dirty secret" post, 21 Jul 2026 [BG]: https://www.linkedin.com/posts/pavitrabhalla_most-ai-agent-frameworks-have-a-dirty-secret-activity-7485481136706441216-nkEn
27. OpenAI Agents SDK sandbox guide, 19 May 2026 [BG]: https://superserve.ai/blog/openai-agents-sdk-sandboxes-which-provider-should-you-actually-use/
28. `superserve-ai/qm` fork commits (Oct 10–13): https://github.com/superserve-ai/qm/commits
29. TFN on Daytona and peer rounds (Modal, E2B): https://techfundingnews.com/daytona-raises-60m-at-1b-valuation-to-build-a-cloud-for-ai-agents/
30. Daytona Series B post, 20 Oct 2026: https://www.daytona.io/dotfiles/daytona-raises-60m-series-b-to-build-the-agent-cloud and Fortune https://fortune.com/2026/10/20/daytona-startup-building-the-agentic-cloud-valued-at-1-billion-in-latest-funding-round/
31. aisandboxbench results (run 22–23 Oct 2026): https://aisandboxbench.com/results.md and https://aisandboxbench.com/llms.txt
32. Freestyle homepage: https://www.freestyle.sh/
33. Terac hackathon announcement: https://terac.com/blog/zero-human-company-hackathon and Luma https://luma.com/d7vavxhk
34. Event page (local): /Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md
35. Foundry demo video (1st place, Superserve track, Zero-Human Hack): https://www.youtube.com/watch?v=U_DDFVnhtD0, plus Nithin Aruswamy's X post (17 Aug) and Superserve's reply (20 Aug), both seen via the teapawt mirror [15]
36. Modal Series D, 14 Oct 2026: https://modal.com/blog/1-billion-annualized-run-rate-series-d and Accel https://www.accel.com/news/our-investment-in-modal
37. AWS Lambda MicroVMs launch, 22 Jun 2026: https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/ and 10 Jul follow-ups https://aws.amazon.com/blogs/compute/announcing-lambda-microvms-serverless-compute-environments-with-vm-level-isolation-and-near-instant-startup/ and https://aws.amazon.com/blogs/compute/secure-code-execution-for-ai-agents-with-aws-lambda-microvms/
38. Vercel Sandbox GA changelog, 30 Jan 2026: https://vercel.com/changelog/vercel-sandboxes-ga
39. E2B Series A, 28 Jul 2025 [BG]: https://e2b.dev/resources/series-a

---

## Verification log (2026-10-29)

Adversarial re-check of 16 decision-relevant claims against live sources. Outcomes: **OK** = confirmed, **FIXED** = corrected in place, **ADDED** = new material, **UNVERIFIED** = could not confirm.

1. **YC page facts** (tagline "Virtual machines for autonomous agents", sole founder Bhalla, team size 3, partner Max Kolysh, the "100K machines… Lindy, and Y Combinator itself" line, the ICP quote). Re-fetched via Exa. **OK.** The YC page also states the "starts in under 50ms" figure.
2. **YC deal** (1 year Pro, $90K credits, F26 gets "$30K a month for your first 3 months"). Re-fetched superserve.ai/yc. **OK.** The page also lists $1,000 of compute a month and up to 1,000 concurrent sandboxes on Pro.
3. **Event prizes** (no Superserve track; $100/attendee; $1k in grand prize). Checked EVENT_PAGE.md. **OK.** **ADDED** that Freestyle puts $10k into the grand prize.
4. **`yc-software/qm`** (15.6k stars, `docs/superserve.md`, "Paused sandboxes resume on use"). Checked with `gh api`: 15,577 stars and the doc text matches. **OK.** **FIXED** the backend list to add `aws` and name local Docker, per `cli/src/providers.ts`.
5. **`superserve-ai/qm` fork commits by Amit Patil, 10–13 Oct.** Checked with `gh api`. **OK.**
6. **Contributor counts** (133 / 54 / 39 / 16). Checked with `gh api`. **OK.** **ADDED** pavitrabhalla's 43 commits, which the earlier table omitted.
7. **`computesdk` fork "5 Oct".** **FIXED.** It was created 9 May and last pushed 5 Oct. It is tied to the ComputeSDK benchmark the founder cited on 9 Oct.
8. **`harbor` fork 26 Oct, and Harbor's README not listing Superserve.** Checked with `gh api`: fork created 2026-10-26, and the README provider list is Daytona, Modal, LangSmith, Blaxel, Novita, Tensorlake, Runta and Sail. **OK.**
9. **Founder X quotes** (VMs not containers, 19 Sep; TTI, 9 Oct; AWS ~52%, 26 Oct; computer-use vs Daytona, 29 Oct; "commodity / Hetzner"; "#1 Sandbox and #2 DevTool"). Re-read through the teapawt mirror and Exa's cached nitter/zamantika/twstalker pages. **OK**, with verbatim text matching. The commodity tweet is still undated.
10. **DevToolArena characterization.** **FIXED.** The precise claim is "tying #1 for claude codex sandbox category and #2 for codex overall". The roundup's own category-leader list names only Daytona for Sandbox.
11. **aisandboxbench numbers** (cold start 0.52 s, fan-out 0.79 s, snapshot 0.39 s / 0.55 s, pause+resume 0.93 s in 3rd behind boxd 0.53 s and Freestyle 0.72 s, run 22–23 Oct, Daytona "has no pause"). Fetched with curl. **OK.** **ADDED** the "built by us" SDK caveat, the @leodev attribution, and Freestyle's 2nd place on the snapshot tests.
12. **Daytona round** ($60M, $1B, FirstMark, $91M, 20 Oct). Checked the Daytona blog, Fortune, TechCrunch and Tech.eu. **OK.** **FIXED** the lead to FirstMark Growth and completed Fortune's customer list.
13. **Modal round** ($750M at $15.75B, 14 Oct). Checked the Modal blog and SiliconANGLE. **OK.** **ADDED** the Accel lead, the >$1B run rate and the $300M sandbox figure.
14. **E2B $21M Series A, Jul 2025, Insight.** Checked E2B and PRNewswire (28 Jul 2025). **OK.**
15. **AWS Lambda MicroVMs "announced 10 Jul 2026".** **FIXED.** The launch was 22 Jun 2026 (AWS News Blog). The 10 Jul posts are follow-ups that pitch MicroVMs as Claude Managed Agents sandboxes with 8 h sessions.
16. **Vercel Sandbox GA 30 Jan 2026.** Checked the Vercel changelog. **OK.**
17. **Zero-Human hackathon** (15 Aug, Humanmade SF, TalosAI 2nd/$500, Bhalla chatted with the team). Checked the Terac blog and both TalosAI LinkedIn posts. **OK.** **FIXED** the "1st place project not found" claim: it was **Foundry**, which won $1,000 and used eight Superserve VMs (video and X post).
18. **Cursor post, 1 Oct, by Amit Patil** (per-request Firecracker VM, hibernate, egress allowlist, out-of-VM log, "resumes in under 50ms"). Re-fetched. **OK.**
19. **Freestyle homepage** (65 ms, live cloning with memory, pause, nested virtualization). Re-fetched. **OK.**
20. **UNVERIFIED:** LinkedIn follower counts and the job posting; the Dealroom ($125K) and PitchBook ($500K) YC figures (Founderland repeats only Dealroom's); the getclera Open Cap Table claim; the Omnara 23–24 Oct date (mirror only).
