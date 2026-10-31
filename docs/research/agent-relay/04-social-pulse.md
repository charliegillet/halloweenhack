# Agent Relay: social media pulse

> Researched 2026-10-29 for Haunted Hacks (Oct 31 2026). Angle: what people publicly say about Agent Relay (agentrelay.com, YC F26, GitHub `AgentWorkforce/relay`). Window: Aug 1 to Oct 29 2026, weighted to the Oct 23 Launch YC week. Anything older is labeled **background**.
> Method: one `last30days` v3.3.1 engine run (Reddit, X, YouTube, HN, GitHub, Polymarket, web; raw dump at `~/Documents/Last30Days/agent-relay-raw-v3.md`), direct HN Algolia queries, `gh` API pulls, `yt-dlp` metadata, npm download API, and Exa/WebFetch for LinkedIn, Product Hunt mirrors, blogs, and X reply threads (read through the `teapawt.org` X mirror).
> Notation: **[V]** = verified from the cited page or API on 2026-10-29. **[I]** = my inference.

---

## 1. Bottom line

- **The volume is small and concentrated in launch week.** The real conversation is one founder launch tweet (Oct 23), one Chinese-language explainer thread (Oct 24), a few LinkedIn reshares, and two blog write-ups. Reddit shows nothing and HN almost nothing. I found no organic Reddit thread naming Agent Relay in the window. [V]
- **Sentiment is positive but shallow.** Most replies are congratulations. The substantive replies are skeptical about architecture, not hostile: "you are doing it wrong", "too heavy, just use herdr", "it's a communication layer, not the ultimate multi-agent solution". [V]
- **The feature that gets attention is cross-vendor handoff.** The demo people repeat is "Claude Code writes code, then calls Codex to review it, with no human relay". Shared or readable sessions come second. Flows, Relayfile, and forward-deployed agents get almost no social mention. [V]
- **The space is crowded and the name collides with other projects.** At least 6 other open-source projects call themselves "agent-relay" or "AgentRelay". In the same weeks, a rival tool (Buzz) got far more YouTube views. Commenters often answer "I already built this". [V]
- **Engineering velocity is high but outside usage looks thin.** The repo has 1,059 stars and 95 forks (re-checked 2026-10-30 05:xx UTC), and shipped 15 tagged releases in October alone (v13.0.1 on Oct 2 through probe-v15.0.1 on Oct 30 UTC). Of the 217 issues opened since Aug 1, 213 come from a founder, a team agent account, or a team bot; only 4 come from outsiders (3 from `coygeek`, 1 OrcaRouter request). [V for the counts; I for what they mean]

---

## 2. Volume by source (window Aug 1 to Oct 29 2026)

| Source | What exists about *this* Agent Relay | Engagement | Coverage quality |
|---|---|---|---|
| X / Twitter | Launch tweet by @willwashburn (Oct 23); @longhaiqwe123 Chinese explainer (Oct 24); @agent_relay update (Oct 28); @Khaliqgant Grok-bot skill post (Oct 29); a handful of aggregator bots | Launch: 506 likes, 62 RT, 33 quotes, 93 replies, ~96.6K views. Chinese thread: 492 likes, 71 RT, 70 replies, ~51K views. Others: 0 to 4 likes | Good for the two big posts (full reply threads read via mirror). Search was not exhaustive |
| LinkedIn | Founders' YC acceptance posts (Sep 18); YC company-page launch post (Oct 23); reshares | YC launch post: 307 reactions, 150 comments (Exa-indexed copy). Will's acceptance post shows "38 comments" | Partial. Only posts Exa indexed |
| Hacker News | No Launch HN. Older background submissions only; one Oct 21 founder link post (khaliqgant, forward-deployed agents wiki) with 2 points | Window total for this product: about 2 points, 0 comments. Adjacent Show HNs in the same weeks got more: Omnara (Oct 21, 114 pts) | Strong. Algolia API, full-text |
| Reddit | None found naming this product | n/a | Weak. Reddit public search returned 403. The engine's 14 "Reddit" hits were unrelated r/ClaudeAI posts |
| YouTube | One podcast episode (The Parameter #57, Khaliq Gant, Sep 30) | 131 views, 2 likes | Moderate. `yt-dlp` search, English only |
| Product Hunt | Listing "Real-time channels, DMs, and searchable history for agents", hunted by Will Washburn | 8 upvotes, 1 comment, #67 for the day, "not featured" (per hunted.space mirror) | Mirror only. Launch date not shown |
| Blogs / press | IBTimes profile (Sep 30); explainx.ai explainer (Oct 23); heysynapse.dev comparison guide (Oct 16, updated Oct 24) | n/a | Good |
| GitHub | `AgentWorkforce/relay`: 1,059 stars, 95 forks, 294 open items (231 issues + 63 PRs; the API's `open_issues_count` includes PRs), Rust, Apache-2.0 | 0 reactions on any recent issue | Strong (API). Star history endpoint returned 404, so the star growth curve is unknown |
| npm | Latest published `@agent-relay/sdk` and `agent-relay` = 14.0.0 (core 15.x is a GitHub-only "probe" release so far). `@agent-relay/sdk` downloads: Aug 63,717 / Sep 230,288 / Oct 1 to 28 147,910. `agent-relay` CLI: 15,526 / 44,300 / 25,438 | n/a | Raw API numbers. Likely inflated by the team's own CI and release cadence [I] |
| Polymarket | "Relay" token markets are about the unrelated Relay crypto protocol | n/a | Noise. Exclude |

---

## 3. Notable posts (verbatim, linked)

### 3.1 The launch tweet (Oct 23)
[@willwashburn](https://x.com/willwashburn/status/2113646682001101151): "Today we're launching @agent_relay Your team's agents shouldn't need YOU to copy-paste their conversations. Agent Relay lets them read each other's sessions, ask questions, and hand off work across the tools your team already uses. Keep using the Codex mac app, Claude in the terminal or even tools like Conductor. Open source. Free to try our cloud." 506 likes, 62 reposts, 33 quotes, 93 replies, 96,603 views on re-check (counts from the [teapawt mirror](https://teapawt.org/willwashburn/status/2113646682001101151); the first pass saw 96,454). [V]

The useful replies:
- **Pushback on architecture.** [@madarco](https://teapawt.org/willwashburn/status/2113646682001101151): "sorry but you are doing it wrong, the right pattern is a coordinator with a fleet of agents in cloud VMs created and destroyed when needed". He was promoting his own `madarco/agentbox`. Will replied: "That's a good pattern too. Not the only pattern, though."
- **Too many harnesses.** @matyasstoch: "No way am I checking 5 different apps for my sessions". Will replied: "Agent Relay works well single harness across machines and importantly teammates".
- **Session readability.** @anishekkamal: "do the sessions stay readable or still a wall of logs". Will replied: "We provide a few levels of summaries for both humans and agents but you can also still get the full session."
- **Integration.** @dbmikus asked how to plug it into Codex apps. Will replied: "Codex apps work natively, nothing to change".
- **Platform.** A Windows user was disappointed. Will replied: "We have a windows app!"
- **"I built this too."** @be_arsh: "bruh i was literally working on the exact same thing and open sourced it". @swkkadjo (Serge Kadjo, `Wearer-Lab/agent-relay`): "We release ours weeks ago." @Lucasdickey: "Gonna play soon. Can throw aside my own duct tape and bailing wire version."
- **Inside joke.** @paulljump wrote "Free Barry!" and Will answered "we DO still have permissions so barry is more... open range". Barry appears to be Will's agent: GitHub user `barryollama` has the bio "I'm usually doing Will's work for him." [V]

### 3.2 The Chinese explainer (Oct 24), the biggest independent post
[@longhaiqwe123](https://x.com/longhaiqwe123/status/2114031712430948410) (龙海): "我终于不用在两个终端之间当人肉复制粘贴机了！ 实测 YC 刚发布的开源神器 Agent Relay：我只发了一句话，Claude Code 写完代码直接呼叫 Codex 审查，俩 AI 自己在后台 battle 两轮，最终把产品完整交付。" (Roughly: "I no longer have to be a human copy-paste machine between two terminals. I sent one sentence; Claude Code finished the code, called Codex to review, they battled two rounds in the background and delivered the product.") 492 likes, 71 RT, ~51K views via [mirror](https://teapawt.org/longhaiqwe123/status/2114031712430948410). [V]

Replies are the best critique corpus I found:
- @YDeng55525: "它是很好的工程工具，但算不上 '多 Agent 终极解'。 Agent Relay 解决的是模型之间消息互通，是通信层。真正难的其实是任务拆解、角色边界、结果校验、失败回滚，这些依然要自己在上层编排。" (Roughly: a good engineering tool but not the "ultimate multi-agent solution". It solves message passing, the communication layer. The hard parts are task decomposition, role boundaries, result verification, and rollback, and you still orchestrate those yourself.) The author conceded the headline was exaggerated.
- @rxa3c: "有点太笨重了，用herdr就可以了吧" (a bit too heavy, herdr is enough). @liucl: "直接用herdr就行,还能跨机器远程调用别的agent" (just use herdr, which can also call agents across machines).
- @ElderRaysonMeng pointed to his AgentBridge, which is native in-agent and needs "no extra app, the CLI handles it". @tudou_v: "我一直让opus5.5安排codex干活" (I just have Opus 5.5 assign work to Codex).
- @ajs6888 (the funny one): "终于从复制粘贴员升级成围观吵架的了" ("finally promoted from copy-paste clerk to spectator of the argument").
- @loomuai001 noticed many replies looked AI-written. The author agreed: "竟然基本都是" (basically all of them are). Take reply volume with salt. [V]

### 3.3 Aggregator echo (Oct 27)
[@AIQuickFindings](https://x.com/AIQuickFindings/status/2114942189340110929) posted three auto-generated-looking summaries, for example "Agent Relay has Claude Code call Codex to review its code. The shift: value moves from model output to orchestration." They cite @longhaiqwe123 and have 0 to 1 likes. This shows the Chinese thread, not the launch tweet, seeded the derivative coverage. [V for posts; I for the causal read]

### 3.3b Team posts after launch (Oct 28-29)
- [@agent_relay, Oct 28](https://x.com/agent_relay/status/2115264276445450347): "We just launched and are already shipping updates to our desktop app. Get your agents on the relay @ agentrelay.com". Low engagement (mirror shows ~483 views). One reply, from @shreyasnivas, suggested asking ChatGPT which multi-agent desktop tools it recommends, "that list is who you launched against". [V via mirror]
- [@Khaliqgant, Oct 29](https://x.com/Khaliqgant/status/2115836049624887759): in a thread about running multiple Grok agents, he says he connects them to Claude and Codex agents "on my local and in the cloud" with an `agent-relay-grok-bot` skill in `AgentWorkforce/skills`. This signals that the founders treat non-Claude/Codex harnesses (Grok, plus Cursor and Devin hooks visible in the repo) as first-class. [V for post; I for meaning]

### 3.4 LinkedIn
- [Y Combinator page, Oct 23](https://www.linkedin.com/posts/y-combinator_agent-relay-yc-f26-lets-your-teams-coding-activity-7519414526870589440-andg): "Nobody has to be the message bus." It names Claude Code, Codex, Cursor, and Conductor. 307 reactions and 150 comments in the Exa-indexed copy, by far the largest LinkedIn engagement found. [V]
- [Will Washburn, Sep 18](https://www.linkedin.com/posts/willwashburn_on-joining-y-combinator-activity-7506769056285450240-HM17): "On our YC application in 2012, we listed Google+ as the competitor we feared most. Happy to report we outlasted them." This post is background, before the window's peak. [V]
- A reshare with the line "You had me at 'stop copy/pasting between your agents.'" ([post](https://www.linkedin.com/posts/maryewashburn_you-had-me-at-stop-copypasting-between-activity-7519423152616300545-gqwD)) is from a family-name account, not independent. [V for text; I for the relationship]

### 3.5 Blogs and press
- **[heysynapse.dev comparison](https://heysynapse.dev/blog/claude-code-and-codex-talk-to-each-other/)** (Oct 16, updated Oct 24). This was written by a competitor (Synapse) but is the most useful third-party assessment. Its table entry for Agent Relay: "Broker launches agents, or MCP plus workspace key | Push for broker-launched agents, else pull | Hosted engine by default, self-hostable". The cons: push works only for broker-launched agents, agents you start yourself poll over MCP, and it defaults to the hosted engine. It recommends Agent Relay for "Push delivery, channels, or agents on several machines". [V]
- **[explainx.ai](https://explainx.ai/blog/agent-relay-open-source-shared-sessions-flows-coding-agents-handoff-apache-2026)** (Oct 23, Yash Thakker). Neutral README summary that discloses "We did not run it ourselves". [V]
- **[IBTimes](https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082)** (Sep 30). A founder profile; reads as sponsored or PR. Quotes Gant on teams that "built the same feature twice" and a design partner calling it "indispensable". These claims are unverified. [V for quotes]

---

## 4. Praise, complaints, comparisons

**Praise (recurring):**
- It names a real pain: the human acting as the "message bus" between agents. Pain is the most-echoed idea across X, LinkedIn, and the Chinese thread.
- It is cross-vendor. Claude Code and Codex talk without glue code.
- It is open source (Apache-2.0) with a hosted free tier.
- It works inside existing tools (Codex app, Claude in the terminal, Conductor).

**Complaints and doubts:**
1. **Too heavy.** A desktop app plus a workspace plus sign-in, compared with herdr, AgentBridge, or "just have Opus call Codex" (Chinese thread).
2. **Wrong abstraction.** One view says messaging is not orchestration: decomposition, verification, and rollback stay unsolved (@YDeng55525). Another says an ephemeral VM fleet with a coordinator is the right pattern (@madarco).
3. **Push only for broker-launched agents.** Agents you start yourself poll over MCP (heysynapse).
4. **Hosted by default.** Self-hosting exists but is not the default path (heysynapse).
5. **File locking is unclear.** @saikatx asked "Does Agent Relay handle locking, like one agent claiming a file, or is it more a shared chat between them?" He was replying to the *other* Agent Relay (Serge's), but the question applies here too. MCP Agent Mail and `arumwu/agentrelay` market advisory file leases. AgentWorkforce's public docs that I read emphasize messaging and sessions instead.
6. **No public bug complaints.** None of the latest 400 GitHub issues has a reaction, and almost none are from outside users (see section 5).

**Comparisons people actually make:**
- **Buzz.** A Slack-like platform for agent teams. It got far more YouTube attention: [Riley Brown, Jul 29](https://www.youtube.com/watch?v=P1KpxzLVg7c), "Claude Code + Codex Can FINALLY Work Together (Buzz AI)", 74.7K views; [Keith AI, Aug 8](https://www.youtube.com/watch?v=JDiAQp63WB4), 35.5K views. That is 2 to 3 orders of magnitude more than any Agent Relay video. Buzz is the closest consumer-facing rival. [V for views; I for "closest rival"]
- **Traycer.** [WorldofAI, Aug 23](https://www.youtube.com/watch?v=oBuWXUy7stw), "Claude Code + Codex = AI GOD MODE! (Open source + Free)", 31.9K views. The title does not name Traycer; the Traycer attribution and the "open-source workspace for coding agents" framing come from the first pass and were not re-checked (unverified). [V for title/views]
- **Others.** herdr, AgentBridge, MCP Agent Mail, claude-peers-mcp, OpenAI's `codex-plugin-cc`, and Claude Code agent teams (listed by heysynapse and the X replies). [V]
- **Name collisions.** These are *other* projects, not this one: `Wearer-Lab/agent-relay` (Serge Kadjo, repo created Oct 5, open-sourced Oct 25, 6 stars; it markets cooperative file *claims*, [thread](https://x.com/swkkadjo/status/2114228519442190598)); a Mac app also called "Relay" that adds a `/relay` command to Claude, Codex, and Cursor ([Show HN Oct 15](https://news.ycombinator.com/item?id=50106258), 1 pt); Toli, "Let Claude Code on one computer work with Codex on another" ([Show HN Oct 22](https://news.ycombinator.com/item?id=50194681), 1 pt), a direct cross-machine rival; `saranyan/agent-relay` ([Show HN Oct 27](https://news.ycombinator.com/item?id=50262407), 8 pts, 10 stars); `arumwu/agentrelay` (33 stars); `mnemox-ai/AgentRelay` (67 stars); `srijansk/agent-relay` (7); `robbin/agent-relay` (24, created Oct 19); and a real-estate SaaS called "AgentRelay" whose YouTube channel dominates the "agentrelay.com" video search. [V]

---

## 5. GitHub and engineering signal (the hard data)

- `AgentWorkforce/relay` was created 2025-12-17 and last pushed 2026-10-30 05:05 UTC. It has 1,059 stars, 95 forks, 7 watchers, and 294 open items (231 issues, 63 PRs). It is mostly Rust, with a TypeScript SDK, under Apache-2.0. [V]
- **Release cadence:** 15 tagged releases in October: v13.0.1 (Oct 2) through v14.0.0 (Oct 13, still GitHub's "latest" and the latest npm version), then "Agent Relay core 15.0.0" (probe-v15.0.0, Oct 29 07:44 UTC) and core 15.0.1 (Oct 30 04:48 UTC). Major versions v13 (Sep 30), v14 (Oct 13), and v15 (Oct 29) landed within a month. Expect breaking changes on hack day. [V]
- **Weekly commits:** 26, 47, 19, 16, 128 (week of Oct 4), 33, 1, 68 (week of Oct 25). [V]
- **Who files issues.** GitHub search finds 217 true issues (PRs excluded) opened since Aug 1. Authors: khaliqgant (155), miyaontherelay (21, bio "Operating on the relay"), kjgbot (17, same bio), AgentRelayBot (9), willwashburn (6), barryollama (4, bio "I'm usually doing Will's work for him. He's aight."), coygeek (3, all Oct 23-24 SDK/CLI bug reports, #1986-1988), agent-relay-code[bot] (1), and nissrin2020ali-ux (1, "OrcaRouter provider support", #1674). None has a reaction. Top contributors by commits: khaliqgant 2,273, willwashburn 1,032, `claude` 538. [V] (The first draft's counts, such as willwashburn 144, mixed PRs into the issue tally; corrected here.) **Inference:** the issue tracker is mostly the team and its own agents dogfooding the product. External bug reports are close to zero, which fits a product one week past public launch.
- **Recent issue themes** from dogfooding: PTY input truncation ("Codex PTY initial input stalls at 1024-byte boundary", #1781), messages to PTY agents "arrive truncated to their tail (silent)" (#1890), spawn reporting failure on success (#1838, #1899), subscription recipients that "never wake" (#1794), and the broker wedging behind a receipt gap (#1837). [V] These map directly to hack-day risk.

---

## 6. Background (pre-Aug 2026, for context only)

- [Feb 27 2026 blog](https://agentrelay.com/blog/introducing-agent-relay): SDK launch with a tic-tac-toe demo (Claude vs Codex) and the line "basically slack, but for headless and built FOR agents". [V]
- [HN, Mar 1](https://news.ycombinator.com/item?id=47208242): "Agent Relay – open-source rails to have agents communicate", 3 points. [HN, Apr 28](https://news.ycombinator.com/item?id=47934957): "Show HN: Simple SDK for agent-to-agent communication", 2 points, 0 comments. [V]
- Feb 5: Khaliq promoted the repo in the comments of the HN "Orchestrate teams of Claude Code sessions" thread. [V]
- Mar 2026: Khaliq's `/relay-team` Claude plugin demo, where three subagents argue Rust vs Go vs C++ ([LinkedIn](https://www.linkedin.com/posts/khaliqgant_we-recently-pushed-out-the-agent-relay-sdk-activity-7443329202424274945-1NzN)). Quote: "Building a storage engine in Go is like building a Formula 1 car out of LEGO." Agents arguing with each other is their go-to viral demo format. [V]
- Product positioning has drifted. Earlier it was an SDK, "Slack for agents", spawning via PTY. At the Oct launch it became a desktop app with shared sessions, Flows, Connect rooms, and forward-deployed agents. Older tutorials may not match today's quickstart. [V/I]

---

## 7. Limits / could not verify

- **X:** Search went through the engine's cookie-based client plus a third-party mirror (`teapawt.org`). Engagement and view counts come from that mirror on 2026-10-29 and may differ from x.com. I could not see quote-tweets or the full reply tree ("Load more replies" was not expanded).
- **Reddit:** Public search returned HTTP 403, and WebSearch blocks reddit.com. "No Reddit discussion found" is a coverage gap, not proof that none exists.
- **TikTok and Instagram:** Not searched (no ScrapeCreators key).
- **Product Hunt:** Seen only through the hunted.space mirror. Launch date and comment text beyond the maker comment are not verified.
- **LinkedIn:** Only posts Exa indexed. Reaction counts mostly unavailable.
- **GitHub star history:** The stargazers-with-timestamps API returned 404, so I cannot say how many of the 1,059 stars arrived in launch week (explainx reported "about 900" on Oct 23, which suggests roughly 150 since then [I]).
- **npm downloads:** Raw totals that include CI and bots. Not a user count.
- **Discord:** A server is linked from agentrelay.com (discord.gg/6E6CTxM8um) but was not inspected.
- **Customer quotes:** The "indispensable" design-partner quote (IBTimes) is unattributed and (unverified). On the [Launch YC page](https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other) the "What our customers say:" heading has no visible text in the fetched copy (it may be an embedded widget). The same page does verify the founder claims "we run 50+ agents in parallel ourselves" and "Messaging is where we're starting."
- **Disambiguation risk:** Several hits about other "agent relay" projects were excluded by hand. A few aggregator posts may conflate them.

---

## 8. Hackathon implications

**What judges and sponsors visibly want (inferred from their own social posts):**
- The founders' pitch, repeated everywhere, is "stop being the message bus" and **cross-vendor agents (Claude Code and Codex) handing off directly**. A demo where you never copy-paste between agents lands squarely on message.
- The viral formats they and the community already use: **agents arguing or reviewing each other** (the Rust/Go/C++ debate, Claude writes and Codex reviews for "two rounds"). Halloween fit: a "séance" or "haunted code review", or a multiplayer horror game where AI characters on different models coordinate over Relay channels and humans can watch the channel live.
- **Answer the top critique in your demo.** Skeptics say Relay is "just a communication layer". Show the layer *on top*: task decomposition, verification, retry. Durable Actors (Terse) are the natural place to keep that state, which earns the "both sponsors" bonus. Example: a Durable Actor owns the job state machine, and Relay channels carry agent chatter, ACK, and DONE.
- **Show the observer view.** Relay's `get_observer_url` / `agent-relay observer` gives a read-only live link. Put it on the projector so judges watch agents talk in real time ("Real-Time AI" theme).

**Gotchas from the social and engineering record:**
1. **Version churn.** v14.0.0 shipped Oct 13, core 15.0.0 on Oct 29, and core 15.0.1 a day later. npm still serves 14.0.0 for both `@agent-relay/sdk` and `agent-relay`. Pin `@agent-relay/sdk@14.0.0` (or whatever you test on Friday night) and don't upgrade on Saturday.
2. **Push vs pull.** Only broker-launched agents get push injection. Self-started agents over MCP poll. For a live demo, spawn agents through the broker or SDK (`relay.claude.spawn` / `relay.codex.spawn`, or `agent-relay` CLI), not hand-opened terminals.
3. **Known PTY bug classes.** Long initial tasks to Codex stalled at 1,024 bytes (#1781), and injected messages were silently truncated (#1890). Both issues are now closed, but #1781's title says "safe full-body verification remains unresolved", and in a fast-moving codebase regressions are likely. Keep spawn prompts short and send long context as files or attachments.
4. **"Spawn failed" may be a lie** (#1838/#1899, both closed but recent). Check the agent list before retrying.
5. **One relay team per checkout** (from the relay-team skill docs as mirrored on skillsmp; not found in the current repo checkout, so (unverified)). Concurrent leads in one directory fight over the workspace pin. Use git worktrees if teammates share a repo.
6. **Claude Code delivery setting.** Relay's direct delivery into Claude Code maps to Claude Code's `crossSessionInbound` setting; `hold` is a confirmed value, and an organization-managed value overrides the user setting (per `crates/probe/contract/CoreContract.swift`). The other values ("accept" / "refuse") are (unverified). Set it deliberately so demo messages don't wait for approval.
7. **Name collision.** When you search or install, make sure you are on `AgentWorkforce/relay` / `@agent-relay/sdk`, not `@wearer-haitch/agent-relay` or `saranyan/agent-relay`.

**Setup to do before Oct 31:**
- Install the CLI (`curl -fsSL https://raw.githubusercontent.com/AgentWorkforce/relay/main/install.sh | bash`) and the desktop app. Sign in with Google. Create a Cloud workspace and invite teammates so the workspace already exists.
- Run the Feb-blog tic-tac-toe SDK sample end to end (caution: it was written for the Feb SDK and hard-codes model enums such as `Models.Codex.GPT_5_3_CODEX_SPARK`; check it against the v14 SDK, where `relay.claude.spawn` / `relay.codex.spawn` still appear in `scripts/spawn-reviewers.ts`) with Claude plus Codex keys and subscriptions. Confirm push delivery and the observer URL work on your laptops and on venue Wi-Fi (fall back to Local Mode if the network is flaky).
- Confirm Codex and Claude Code auth both work headless. The $100 OpenAI credits cover Codex models.
- Optional: install the `using-agent-relay` skill (`npx skills add https://github.com/agentworkforce/relay --skill using-agent-relay`) so your coding agent knows the current MCP tool names.

**Positioning for the Agent Relay track (Mac mini):** On the evidence, the founders care about *team or multi-machine* handoff and *shared sessions*, not only same-laptop chatter. That is what separates them from herdr and AgentBridge. A demo spanning two teammates' laptops, or a laptop plus a cloud box (Superserve or Freestyle sandbox), shows the differentiator the critics say is missing. [I]

---

## Sources

- https://x.com/willwashburn/status/2113646682001101151 (mirror: https://teapawt.org/willwashburn/status/2113646682001101151)
- https://x.com/longhaiqwe123/status/2114031712430948410 (mirror: https://teapawt.org/longhaiqwe123/status/2114031712430948410)
- https://x.com/AIQuickFindings/status/2114942189340110929
- https://x.com/agent_relay/status/2115264276445450347
- https://x.com/swkkadjo/status/2114228519442190598
- https://x.com/saikatx/status/2114260537974349856
- https://x.com/Khaliqgant/status/2115836049624887759 (mirror: https://teapawt.org/Khaliqgant/status/2115836049624887759)
- https://news.ycombinator.com/item?id=50106258 ; https://news.ycombinator.com/item?id=50194681 ; https://news.ycombinator.com/item?id=50183892
- https://api.github.com/search/issues?q=repo:AgentWorkforce/relay+is:issue+created:>=2026-08-01
- https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other
- https://www.ycombinator.com/companies/agent-relay
- https://www.linkedin.com/posts/y-combinator_agent-relay-yc-f26-lets-your-teams-coding-activity-7519414526870589440-andg
- https://www.linkedin.com/posts/willwashburn_on-joining-y-combinator-activity-7506769056285450240-HM17
- https://www.linkedin.com/posts/maryewashburn_you-had-me-at-stop-copypasting-between-activity-7519423152616300545-gqwD
- https://www.linkedin.com/posts/khaliqgant_we-recently-pushed-out-the-agent-relay-sdk-activity-7443329202424274945-1NzN
- https://www.linkedin.com/posts/khaliqgant_agent-relay-headless-slack-for-agents-activity-7452629104144838657-eb-4
- https://www.hunted.space/product/agent-relay-2
- https://www.nicheloom.com/launches/65587/
- https://heysynapse.dev/blog/claude-code-and-codex-talk-to-each-other/
- https://explainx.ai/blog/agent-relay-open-source-shared-sessions-flows-coding-agents-handoff-apache-2026
- https://www.ibtimes.com/agent-relay-building-missing-communication-layer-ai-agents-3808082
- https://www.youtube.com/watch?v=Ksg1Gxoeprs (The Parameter #57)
- https://www.youtube.com/watch?v=P1KpxzLVg7c (Riley Brown, Buzz)
- https://www.youtube.com/watch?v=JDiAQp63WB4 (Keith AI, Buzz)
- https://www.youtube.com/watch?v=oBuWXUy7stw (WorldofAI, Traycer)
- https://news.ycombinator.com/item?id=47208242 ; https://news.ycombinator.com/item?id=47934957 ; https://news.ycombinator.com/item?id=50182360 ; https://news.ycombinator.com/item?id=50262407 ; https://news.ycombinator.com/item?id=46905494
- https://github.com/AgentWorkforce/relay (API: repo, releases, issues, contributors, commit_activity)
- https://api.npmjs.org/downloads/range/2026-08-01:2026-10-28/@agent-relay/sdk
- https://agentrelay.com/blog/introducing-agent-relay ; https://agentrelay.com/docs/agents ; https://agentrelay.com/docs/quickstart ; https://agentrelay.com/connect
- https://skillsmp.com/creators/agentworkforce/skills/plugins-claude-relay-plugin-skills-relay-team
- https://github.com/Wearer-Lab/agent-relay ; https://github.com/saranyan/agent-relay ; https://github.com/arumwu/agentrelay

---

## Verification log (2026-10-29)

Adversarial re-check run late on 2026-10-29 PT (some API timestamps are already Oct 30 UTC). Method: `gh api`, HN Firebase + Algolia APIs, npm registry and downloads API, `yt-dlp`, a shallow clone of `AgentWorkforce/relay` for grepping, Exa/WebFetch for blogs, LinkedIn, Launch YC, hunted.space, and the teapawt X mirror.

| # | Claim checked | Outcome |
|---|---|---|
| 1 | Repo stats: 1,057 stars, 95 forks, 7 watchers, 295 open issues, Rust, Apache-2.0, created 2025-12-17 | **Corrected.** Now 1,059 stars. "295 open issues" was GitHub's `open_issues_count`, which includes PRs: actually 231 issues + 63 PRs (294 total at re-check). Rest confirmed. |
| 2 | Release cadence "v13.1.4 to v15.0.0, 8 releases in 3 weeks" | **Confirmed but understated.** 15 releases in October (v13.0.1 to probe-v15.0.1). Core 15.0.1 added Oct 30 UTC. v14.0.0 is still GitHub "latest" and npm latest. |
| 3 | Issue authorship counts (khaliqgant 185, willwashburn 144, kjgbot 28...) | **Corrected.** Those counts mixed PRs in. True issues since Aug 1 = 217 (confirmed), split khaliqgant 155, miyaontherelay 21, kjgbot 17, AgentRelayBot 9, willwashburn 6, barryollama 4, coygeek 3, bot 1, OrcaRouter requester 1. Zero reactions confirmed. Conclusion (dogfooding-dominated tracker) holds and is stronger. |
| 4 | Issue titles #1781, #1890, #1838, #1899, #1794, #1837 | **Confirmed** verbatim; all are now closed (filed by team bots Sep 17-Oct 4). Treat them as fixed-but-indicative risks, not open bugs. |
| 5 | Launch tweet text and counts (506 likes, 62 RT, 93 replies, 96,454 views) and quoted replies | **Confirmed** via mirror; views now 96,603, plus 33 quotes. All quoted replies (madarco, matyasstoch, anishekkamal, dbmikus, be_arsh, swkkadjo, Lucasdickey, paulljump) and Will's answers match verbatim. |
| 6 | Chinese thread text, counts (492 likes, 71 RT, 70 replies, ~51K views) and replies | **Confirmed** (51,364 views). All quoted replies, including the author's "竟然基本都是", match. The author's concession reply to YDeng55525 is "标题不稍微夸张一点没人读呀" (no exaggeration, no readers). |
| 7 | HN items 47208242 (3 pts), 47934957 (2 pts, 0 comments), 50182360 (Oct 21, 2 pts), 50262407 (8 pts) and "no Launch HN" | **Confirmed.** Algolia window search also found the same-name Mac app "Relay" (Oct 15) and Toli (Oct 22), now added. |
| 8 | npm monthly downloads (SDK 63,717 / 230,288 / 147,910; CLI 15,526 / 44,300 / 25,438) | **Confirmed** exactly. Added that npm latest is 14.0.0. |
| 9 | Product Hunt: 8 upvotes, 1 comment, #67, not featured, hunted by Will | **Confirmed** via hunted.space. Launch date still not shown (unverified). |
| 10 | heysynapse table row, cons, and "Push delivery, channels, or agents on several machines" recommendation; Oct 16 / updated Oct 24 | **Confirmed.** |
| 11 | explainx (Oct 23, Yash Thakker, "We did not run it ourselves", ~900 stars) and IBTimes (Sep 30, "built the same feature twice", "indispensable") | **Confirmed** text. IBTimes byline is Callum Turner. The "indispensable" claim itself stays unverified. |
| 12 | YouTube: Riley Brown Buzz 74.7K (Jul 29), Keith AI 35.5K (Aug 8), WorldofAI 31.9K (Aug 23), The Parameter #57 131 views / 2 likes (Sep 30) | **Confirmed** by `yt-dlp`. Riley Brown and Keith AI predate the window (background). WorldofAI title does not mention Traycer, so the Traycer attribution is now marked (unverified). |
| 13 | LinkedIn: YC "Nobody has to be the message bus."; Will's Google+ line; 38 comments | **Confirmed.** Added YC post engagement (307 reactions / 150 comments). |
| 14 | Hackathon technical claims: install.sh path, `get_observer_url` / `agent-relay observer`, `relay.claude.spawn`/`codex.spawn`, `using-agent-relay` skill, `crossSessionInbound` accept/hold/refuse, "one relay team per checkout" | **Mostly confirmed** in repo source. `crossSessionInbound` exists and `hold` is a value, but "accept"/"refuse" were not found: marked (unverified). The "one team per checkout" rule was not found in the current checkout: marked (unverified). Added the caveat that the Feb tic-tac-toe sample hard-codes old model enums. |
| 15 | Collision repos and star counts; Serge's open-sourcing date; @saikatx locking question | **Confirmed**, with star counts added. Serge's repo was created Oct 5 and announced Oct 25, and it pitches file claims, which Saikat's question was about. |
| 16 | Feb 27 blog "basically slack, but for headless and built FOR agents" + tic-tac-toe | **Confirmed** (datePublished 2026-02-27). |

Not re-checked (left as originally sourced): the AIQuickFindings causal read (the post text itself is confirmed, and it cites @longhaiqwe123), the Maryewashburn reshare relationship, the Discord server, and the Sep 18 date of the founders' LinkedIn posts (the Exa copy only shows "1mo").
