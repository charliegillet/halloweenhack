# Freestyle (freestyle.sh): social media pulse

Captured 2026-10-29 for Haunted Hacks (Oct 31, 2026). Angle: what people outside Freestyle say about it, how much they say, and in what tone. Freestyle's own marketing is cited only where it explains something people are reacting to.

Method: I ran the last30days engine (v3.3.1, window 2026-09-30 to 2026-10-30) with handles `@freestyle_dev` and `@benswerd`, five subreddits and two repos. I also ran Hacker News Algolia queries (posts and comments since Jun 2025), YouTube via yt-dlp (search, metadata and one auto-transcript), and Exa/WebSearch for LinkedIn, blogs, comparison sites and Nitter mirrors of X. I used `gh` for GitHub. Raw engine dump: `~/Documents/Last30Days/freestyle-freestyle-sh-vms-for-ai-agents-raw-v3.md`.

Labels: **[V]** means verified from the cited page. **[I]** means my inference.

---

## TL;DR

- **Volume is low and mostly founder-driven.** In the last 30 days the engine found 5 X posts that matched Freestyle, with 51 likes in total, and all of them came from CEO Ben Swerdlow or a reply thread. It found 0 relevant Reddit threads, 0 relevant HN stories and 0 YouTube videos inside the window. The only spike Freestyle has had on social was the April 6, 2026 Launch HN (322 points, 158 comments). That is background, not recent. [V]
- **The main public conversation right now is a pricing fight.** On Oct 27-28, boat.dev's comparison chart showed Freestyle at 7x boat's hourly price. Swerdlow replied publicly that the chart is "fairly misleading" and that "Freestyle doesn't claim to be the cheapest sandbox; we aren't." [V]
- **The praised feature is live memory forking and snapshotting, every time.** Third parties talk about "Fork a running VM", "memory included" and "full Linux, not containers". Nobody praises price or raw CPU throughput. [V] Caveat added in re-check: forking a running machine is no longer unique to Freestyle. Databricks' Oct 28 comparison says "the E2B CLI can fork a running sandbox into new ones", and boat.dev's landscape table lists Modal and E2B (not Freestyle) under "Process fork (memory + running processes)". [V] So pitch Freestyle on full-VM power, memory snapshots and long-running persistence, not on "only we can fork". [I]
- **Complaints, mostly from April:** it's unclear how Freestyle differs from E2B, Daytona, Sprites and exe.dev. Networking breaks after a fork ("remote Postgres can break in the forks"). It was B2B-oriented with thin docs on pricing and use cases. In 2026-04 the AX audit found it was hard for agents to discover. In one vendor-run benchmark (boat, Aug 24) it was the slowest on a CPU-bound Node build loop. [V]
- **Freestyle is missing from most Oct 2026 third-party comparisons** (Lizard, UseAgent, Infragap, Databricks, c17). Those pages compare E2B, Daytona and Modal. [V] So mindshare lags the product. [I]
- **Strategy pivot that matters on Oct 31:** the Sep 9, 2026 changelog says "Freestyle is now focused on VMs. We've deprecated the standalone Git, code execution, web deployment, and scheduled trigger APIs." The event page still describes Freestyle as "sandboxes/VMs/git/deploy". Older blog posts and the Adorable template may rely on deprecated APIs. [V for the changelog; I for the risk]
- **Ties to the hosts and sponsors are visible on social.** Swerdlow quote-tweeted Terse's YC launch with "terse terse". He asked `@IncTerse` and others "how do we get some freestyle.sh vms in there?" (Oct 19). He did a full episode on Mastra's "Agents Hour" (Aug 4). Freestyle has guides for Mastra, the OpenAI Agents SDK and Supabase. [V]

---

## 1. Volume by source (honest counts)

| Source | Window | Freestyle-relevant items | Notes |
|---|---|---|---|
| X / Twitter | last 30 d (engine) | 5 posts, 51 likes, 15 replies | All from `@benswerd` or replies to him. `@freestyle_dev` has 8 lifetime tweets and about 420 followers (Nitter mirror, captured 2026-10-29). |
| X (manual, Nitter mirrors) | Aug-Oct | about 10 Freestyle-related founder posts | Pricing fight, Minecraft demo, events, Terse quote. Few independent users. |
| Reddit | last 30 d | 0 relevant | The engine returned 26 threads (15.6K upvotes) from r/LocalLLaMA, r/AI_Agents and r/webdev. Every one was an entity miss: generic agent threads with no Freestyle mention. reddit.com JSON returned 403 and WebSearch blocks reddit.com, so this count is a lower bound. |
| Hacker News | Aug-Oct | 2 Freestyle-blog submissions | "Sprites Connectors is a great example of Terrible API Design" got 4 pts and 1 pt (Sep 24-25), 0 comments. In July, "Designing APIs for Agents" got 79 pts and about 48 comments. |
| Hacker News | all-time | Launch HN: 322 pts, 158 comments (2026-04-06) | Background. This is still the richest body of third-party opinion. |
| YouTube | Aug-Oct | 2 founder interviews | Mastra "Agents Hour" (Aug 4, 249 views, 7 likes). Fondo START (Sep 23, 123 views). No independent reviews or tutorials found. |
| LinkedIn | Aug-Oct | about 4 posts | Fondo START clip (Sep 23), Swerdlow's reshare, "Cursed Agents Demo Night" for SF Tech Week (Oct 6). |
| Product Hunt | n/a | none found | `producthunt.com/products/freestyle-sh` returns 404. No PH launch surfaced in search. |
| GitHub | Aug-Oct | Adorable at 831 stars, 319 forks | Last push 2026-08-25. 1 new issue since Aug (#36, Aug 27). rigkit has 13 stars. A few tiny third-party repos reference Freestyle (for example `Workstation-ai/lab-freestyle-omniroute-hermes`, 0 stars). |
| Polymarket | n/a | 0 | The engine's 5 markets were "Real American Freestyle" wrestling and a swimming race. Name collision noise. |

**Name collision is a real problem for search.** "Freestyle" matches wrestling, rap, swimming, Freestyle Libre, Kinesis keyboards, and a different YC F24 "Freestyle" AI email assistant (linkedin.com/company/freestyle-ai, `@freestyledotai`). Queries need "freestyle.sh" or "Freestyle VMs". [V]

**Batch-label correction (re-check).** The event page lists "Freestyle (F24)", but YC's directory lists Freestyle.sh (Swerdlow and Zwang) as **Summer 2024**, and Swerdlow's X bio says "@freestyle_dev (YC S24)". The **F24** Freestyle is the Gmail assistant (Friday, Inc.), which renamed itself from Friday to Freestyle in July 2026 and moved to freestyle.ai. [V] So the event page's "F24" is most likely a mix-up with the email company. [I] Say "S24" if you name Freestyle's batch on stage, and never link freestyle.ai.

---

## 2. Notable posts (last ~90 days)

### The boat.dev pricing fight (Oct 27-28): the most active Freestyle thread right now
- `@zack_overflow` (Oct 27) praised boat.dev: "if you're not using boat you are literally lighting money on fire for zero reason." [V, via Nitter on benswerd's timeline]
- `@benswerd` (Oct 28) replied: "Is this coordinated? It doesn't make sense. Freestyle list prices were designed to be 20% less than Daytona's. There is no scenario where this is possible." [V]
- `@benswerd` (Oct 28), longer post: "For 50 VMs Freestyle requires pro tier, so we show as 10x more expensive. However, the actual usage/if u scale with this is $52, which would make us the second cheapest company for actual usage. Freestyle doesn't claim to be the cheapest sandbox; we aren't. Freestyle does offer the most powerful and best value sandbox and I think the boat homepage chart is fairly misleading in this way." [V]
- Swerdlow retweeted `@konstiwohlwend` (Oct 28): "the sandbox pricing wars are getting dirty". [V]
- Context [V]: boat.dev/compare and docs.boat.dev/pricing list Freestyle at $0.264/h for 4 vCPU / 8 GB (7x boat's $0.036/h), with prices "verified 2026-09-26". In boat's own benchmark (Node build/test loop, Freestyle measured 2026-08-24), Freestyle did 9.6 runs/s against boat's 27.7, Daytona's 18.6 and E2B's 11.2, tied with Modal's 9.6. boat's footnote calls the cross-date rows "indicative, not a like-for-like race". Treat it as a competitor's benchmark. (Correction: an earlier draft quoted boat as saying "We sell..."; that disclosure is actually on Lizard's Oct 12 benchmark page, "We sell Lizard Sandboxes", not on boat's pages.) Note also that boat's live 50-VM fleet chart shows Freestyle at $3,174/mo, "7x", not the "10x" Swerdlow describes; boat may have changed the chart after his post, or he was describing a different view. [V for the current chart; cause unknown]
- [I] Freestyle's own docs (`about.md`) already say not to use it for "CPU Intensive CI/CD" because it oversubscribes host CPUs. So the benchmark result matches Freestyle's own positioning more than it refutes it.

### Founder posts carrying the brand
- `@benswerd` (Oct 1): "God I wish someone would provide stable VMs I could run my agents on. *said no freestyle.sh user ever". 31 likes, 11 replies (engine). [V in original engine run; x.com status page not re-fetchable on Oct 29] https://x.com/benswerd/status/2105464635122221500
- `@benswerd` (Oct 19), replying to `@karatzas_thomas`, `@pidotdev`, `@modal` and `@IncTerse`: "how do we get some freestyle.sh vms in there?" (unverified in the Oct 29 re-check: x.com is unfetchable and the Nitter replies tab returned 429; the text comes from the original engine run) https://x.com/benswerd/status/2112326078408876087. Karatzas is a Terse founder, the hackathon host.
- `@benswerd` (Oct 25) quote-tweeted Karatzas's Haunted Hacks announcement ("@IncTerse is throwing the first (to our knowledge) Actor Hackathon at @ycombinator! Join us October 31st... Prizes include: - Guaranteed YC Interview - iPhone duo - Mac mini") with "Lets get freaky (hacker style)!" [V, Nitter timeline]. The Freestyle CEO is publicly promoting this exact event.
- `@benswerd` quote-tweeted Karatzas's "This is our YC launch. I talk about armies of tiny servers." with "terse terse". The Nitter mirror showed a relative time of "21h" at capture, so roughly Oct 28. [V for the text; the date is approximate]
- `@benswerd` (Oct 27): "I have AI building all of SF in Minecraft... It's gonna be sick". Later posts: "AI + Freestyle + Minecraft is progressing" and "SF AI Minecraft is moving forward". [V] This is the founder's current showcase demo.
- `@benswerd` (Oct 25): "I'm really excited for the next set of sandboxing improvements we've been working on. This is gonna be a really fun next 3 weeks." [V] [I] So expect releases around or after Oct 31.
- `@freestyle_dev` (Sep 22) reposted Swerdlow's "Brood War Bench" (StarCraft agent benchmark): "Codex plays cheese and confuses the opponents". Caption: "Powered by yours truly". [V]
- Events: "Cursed Agents Demo Night" for SF Tech Week (LinkedIn, Oct 6). "Better Call Claude" with Vector Legal and `@rivet_dev`, announced about Oct 28 for "next week" (luma.com/freestyle-yh5k). The Luma page gives Thursday Nov 5, 2026, 7-9 PM PT at 475 Sansome St (8th floor), speakers Mitch Duncombe (Vector Legal), Ben Swerdlow and Nathan Flurry (Rivet), 109 going at capture. [V] A good follow-up venue to show a Freestyle hackathon project.

### Blog posts that drew (little) discussion
- "Designing APIs for Agents" (HN 48894874, Jul 13, 79 pts). Background, just outside the window. Commenters pushed back hard on Swerdlow's "Defaults are bad" thesis. `mohamedkoubaa`: "for the love of God and all that is holy do not force agents to read the entire documentation and pass a value for every possible parameter". `tyre`: "LLMs degrade with context length". `ventana`: "I don't like the idea of making APIs effectively unusable for a human developer." `simonw` added a constructive tip: give agents a "feedback" tool. [V]
- "Sprites Connectors is a great example of Terrible API Design" (Sep 24). It is an attack on Fly.io Sprites' credential-injection API ("Reading this API, I feel like I'm reading the work of a 2nd year college student..."). It got 0 comments on HN. [V] [I] This is founder-voice combativeness that so far gets little traction.
- "Give Your AI Security Agent a Kali VM" (Oct 24). Kali Linux images are now on Freestyle. No social pickup found. [V]

### Podcasts and video (founder voice; useful for what the team values)
- Mastra "Agents Hour", Aug 4: "Freestyle's CEO Runs His Cloud From a House". Title, date, 249 views and 7 likes re-verified via yt-dlp on Oct 29. The quotes below come from the first pass's auto-transcript. The Oct 29 re-pull of subtitles failed, so the exact wording was not re-checked (unverified in re-check):
  - "I hate the word sandbox. I think it's a word invented to... Cover up bad VMs. But I think the sandbox wars are just starting."
  - "If you're doing run Python code, don't use me. If you are doing things that have an average execution time of less than 15 minutes, don't use Freestyle."
  - Stress test he recommends: "just try to run Supabase on these sandboxing platforms. When you start running something with 11 services, Redis breaks here, everything breaks there."
  - He demoed a memory snapshot of a running counter with a "300 millisecond" pause and said the pause is the same "for 8 gigabytes of RAM as it is for 64".
  - They run bare metal out of a house the founders own, with "a Powerwall followed by a backup kerosene generator". Hardest problem: "networking... Our worst issues in the past three months have been somehow DDoSing ourselves."
  - Closing advice: "build to be virtualized, build to be tested. Build for long running."
- Fondo START (Aug 27 article, Sep 23 YouTube and LinkedIn): "I don't believe Claude Code will exist in its current form in six months". The thesis: 20+ cloud agents per task, each with a full copy of the stack. Swerdlow calls the practice "goal engineering": inside Freestyle, agents get "a week to find improvements" measured against about 700 tests and 90 metrics. [V]

---

## 3. Praise (what third parties actually like)

- **Live memory forking.** At launch, AI Beat called forking a "meaningful primitive" and the whole launch "technically credible" (2026-04-07). The Agent Post said "The VM forking is genuinely impressive technology". [V, background]
- **Full Linux, not a container.** The TechStackups AX audit (2026-04-08): "Full Linux with root access and nested virtualisation is the right positioning against E2B and Daytona"; "Live VM forking and multi-tenant Git are features no other audited platform offers." [V, background] (Multi-tenant Git has since been deprecated.)
- **Agent-friendly docs.** TechStackups: "The docs MCP is hosted, simple to install, and made a measurable difference." `@heymikasagi` (Agent Arena, Feb 26) graded Freestyle B for AX alongside E2B, Vercel and Daytona, and gave a "Shoutout to @benswerd who took action from our AX report and improving the freestyle score in <24 hrs". [V, background]
- **Founder responsiveness.** Swerdlow answered dozens of Launch HN comments. HN user `Areibman` (Aug 2025) wrote: "Played with https://www.freestyle.sh this weekend, really solid". `etse` (Apr 7): "I like Freestyle's cool UI that shows off the unique technical approach and developer friendliness." [V, background] That comment is mostly a plug for etse's own tool, Dexbox, so it is weak as independent praise.
- **Open-source app builder.** Adorable ("Open Source Lovable") has 831 stars and 319 forks. It is Freestyle's most-starred community artifact. [V]

## 4. Complaints and skepticism

- **"How is this different from X?"** It was the most repeated reaction at launch. `orliesaurus`: "it would be super nice to see a huge competitor analysis: Cloudflare vs e2b vs daytona vs freestyle". `benatkin`: "It's hard to tell what this is or how it compares". `brap`, on multi-tenant Git: "Maybe I'm just stupid, but I don't know what this means." [V, background] In June 2026, `dbmikus` listed Freestyle as one of "the many providers out there", alongside Daytona, E2B, OpenComputer, Blaxel, Vercel, Modal, Cloudflare, Tensorlake and Superserve. [V] That list includes Superserve, a fellow hackathon sponsor.
- **Networking after fork.** Swerdlow on HN: "complex protocol connections like remote Postgres can break in the forks, stuff like Websockets just automatically reconnects" (corrected wording, verified via HN API). The cause is that forked VMs share a network namespace setup, so "they all think they are the same IP". He called it "an ongoing optimization point". [V, background]
- **Not for individual devs (at launch).** Swerdlow: "Freestyle isn't designed for an individual engineer working on their Github repos. Its designed for platforms building coding agents". The Agent Post: "If you're an individual developer looking for somewhere to deploy your Next.js app, keep walking." [V, background]
- **Discoverability.** TechStackups: Freestyle "appeared in two of nineteen organic conditions" and "never surfaced for generic AI sandbox queries". [V, background] It still holds in October: Lizard (Oct 12), UseAgent (Oct 14), Infragap (Oct 5), Databricks (Oct 28) and c17 (Oct 16) compare E2B, Daytona and Modal and leave Freestyle out. [V] boat.dev does include it.
- **Price and throughput.** See the boat.dev fight in Section 2. Freestyle's own reply concedes it isn't the cheapest. [V]
- **Combative tone.** Product posts such as "mogging the competition" (the Apr 15 ALT text), "Thats tiny" about E2B and Daytona limits, and the Sprites takedown. [V] [I] Fun in a hackathon setting, but some readers will see it as abrasive.
- **Self-hosted alternatives exist.** "Show HN: Agentjail – Self Hosted Freestyle.sh" (Apr 19, 2 pts) shows that people treat Freestyle as a reference design worth cloning. [V]

## 5. Comparisons people make

| Comparison | Who / where | Gist |
|---|---|---|
| vs E2B, Daytona | HN launch, TechStackups, Swerdlow | Freestyle pitches itself as "more powerful". Swerdlow: Daytona and E2B "don't really feel like VMs". He also concedes "Daytona sandboxes boot faster than Freestyle ones" but says first response from a Next.js app is "an order of magnitude ahead". [V] |
| vs boat.dev | boat.dev/compare, X (Oct 27-28) | boat is far cheaper per hour and faster in boat's own benchmark. Freestyle argues the chart is misleading for real usage. [V] |
| vs Fly.io Sprites | Freestyle blog (Sep 24) | Freestyle attacks the Sprites credential-injection API design. [V] |
| vs Morph Cloud | TechStackups | "Morph Cloud's "infinibranch" feature is a direct analogue of Freestyle's VM forking, but Freestyle was not mentioned." [V; corrected to the verbatim sentence, the earlier draft paraphrased it as a quote] |
| vs E2B (forking) | Databricks answers page (Oct 28), boat.dev landscape | E2B's CLI "can fork a running sandbox into new ones"; boat credits Modal and E2B with process fork. Freestyle's "only we fork live VMs" claim no longer holds in third-party framing. [V] |
| Rivet sandbox adapter | rivet.dev docs (engine hit) | Rivet Actors' sandbox adapter lists "agentOS, E2B, Daytona, or Freestyle" (page still TODO). [V] [I] So Freestyle is already being wired into actor frameworks, which is exactly the Durable Actors pattern. |
| Freestyle's own "Top 6 most powerful sandboxes" | freestyle.sh blog (May 17) | It ranks itself #1 ahead of Upstash Box, Daytona, E2B, Vercel and Modal. That is vendor content, not third-party opinion. [V] |

---

## 6. Features getting attention (ranked by how often third parties mention them) [I, from the sources above]

1. Live forking and memory snapshots ("fork a running VM", "Minecraft blocks in the same place").
2. Full Linux: root, systemd, nested virtualization, Docker-in-VM, eBPF/FUSE.
3. Startup speed claims. These drift over time: "~500ms" at launch, "p99s under 400ms" on YC/about.md, "65 ms" on the current homepage. People quote whichever number they saw.
4. Pause and resume with storage-only billing, for long-running agents.
5. Newer features with almost no social discussion yet: edge credential injection, VPCs and WireGuard, firewall API, browser terminals (`connectXterm`), `vm.exec()` up to 24h (changelogs from Sep 9 and Oct 14), and Kali images (from the Oct 24 blog post, not the changelog). The 24h exec limit needs an updated guest agent; older agents keep the five-minute limit.

---

## Limits / could not verify

- **Reddit:** reddit.com JSON returned 403, and RSS feeds failed inside the engine. WebSearch refuses reddit.com. I found no Freestyle-specific Reddit thread, but that is not proof none exist.
- **X:** the engine used browser-cookie search and returned only 5 in-window posts. Nitter mirrors show founder timelines, but Nitter search was rate limited (429), so I could not systematically count independent mentions. Engagement numbers from Nitter are column-ambiguous, so I only cite engine-reported likes. The "terse terse" date is approximate (relative timestamp).
- **x.com status pages** could not be fetched directly. The text comes from engine output and Nitter mirrors.
- **YouTube:** only one auto-transcript was retrievable (Mastra). The Fondo transcript got a 429 on subtitles. No independent creator reviews found.
- **Product Hunt:** no listing found (404). TikTok and Instagram were not searched (no ScrapeCreators key).
- **Discord:** Freestyle mentions a community Discord (Apr changelog). I could not access it, and that is likely where most real user feedback lives.
- **Pricing claims** (Freestyle "20% less than Daytona", boat's 7x) are competing vendor statements. I did not independently price-check them.
- **The boat benchmark** is a competitor's measurement from different dates.

---

## Hackathon implications

**What to build (social-signal-backed):**
- **Lean on fork and snapshot, the one thing people praise.** For example: a "haunted house" or "multiverse" agent demo where a Durable Actor (Terse) orchestrates N agents. Each agent gets a forked Freestyle VM from the same warm snapshot, and the agents report progress over Agent Relay. The judges and sponsors pick the best branch live. This matches Swerdlow's "run 10 copies instead of just one" thesis and Freestyle's Rivet-style actor integration. It also hits both host tracks.
- **Long-running or stateful demos beat "run a Python snippet".** Swerdlow says outright that sub-15-minute code execution is not Freestyle's use case. A demo that pauses a VM mid-task and resumes it with memory intact during judging is on-message.
- **A Supabase-in-a-VM angle aims at two sponsors at once.** Swerdlow's favorite stress test is running Supabase's 11 services, and Freestyle has a "How to Run Supabase in a Sandbox" guide. Supabase's own prize is "most likely to scale to millions".
- **Mastra and OpenAI Agents SDK both have official Freestyle sandbox guides.** Using either one is sponsor-stacking with little integration risk.
- **Founder taste:** Minecraft and StarCraft agent demos, playful "cursed agents" energy, and APIs designed for agents. A Halloween-themed Minecraft or game-world agent demo on Freestyle would land with Swerdlow personally. [I]

**Gotchas:**
- **Do not build on Freestyle Git, code execution, web deploy or scheduled triggers.** All four were deprecated on Sep 9, 2026. Old blog posts and the Adorable template (last pushed Aug 25) may still use the older `freestyle-sandboxes` patterns. Use the `freestyle` npm package and VM APIs only.
- **Networking across forks:** long-lived TCP connections (for example remote Postgres) can break in forked VMs. Reconnect after a fork, or keep DB connections outside the VM. WebSockets reconnect automatically per Swerdlow, so expect a brief reconnect rather than a seamless survival. Forks also start out believing they share the parent's IP.
- **VM creation requires a firewall configuration** (Sep changelog). Default deny will bite you if you skip it.
- **Don't store secrets in VMs.** Use edge credential injection (OpenAI and Anthropic guides exist). It is also a good security story for judges.
- **CPU-heavy builds inside VMs will be slow** (oversubscribed hosts; boat's benchmark). Pre-bake dependencies into a snapshot instead of building during the demo.
- **Startup-speed claims vary (65 ms to ~500 ms).** Don't promise a number on stage. Show it live.

**Setup before Oct 31:**
- Claim the $100 attendee credit early if possible. Run `npx -y freestyle@latest login`, then `npx -y freestyle@latest tokens create "agent work" --output json`, the agent-friendly flow from about.md.
- Build and snapshot a base VM (Node or Python, your agent harness, any deps) the night before, while still writing all project code at the event. Test fork, pause and resume once, and confirm the firewall config and a `style.dev` preview domain work.
- Install the Freestyle docs MCP in your coding agent. Third-party audits say it measurably improves integration quality.

**Prize stakes for Freestyle specifically (from EVENT_PAGE.md):** each attendee gets $100 in Freestyle credits, and the grand prize includes **$10,000 in Freestyle credits** on top of the YC interview, $5k OpenAI, $1k Superserve and 3 months of Mastra. Freestyle has no separate track prize, so Freestyle usage pays off through the grand prize and the host tracks.

**What judges and sponsors want (inferred):**
- Freestyle wants to be seen as "VMs, not sandboxes", for long-running, evaluable, parallel agent work. A demo that would fail on an 8 GB container and works on Freestyle is the ideal pitch.
- Freestyle's biggest public weakness is discoverability. A polished, shareable demo that names Freestyle is worth more to them than usual. Expect Swerdlow to amplify it on X. [I]
- Swerdlow is visibly friendly with Terse (the "terse terse" quote, the Oct 19 "freestyle.sh vms in there?" ask). A Terse Durable Actors + Freestyle VM integration is the combination the founders have publicly said they want.

---

## Sources

- Launch HN (2026-04-06): https://news.ycombinator.com/item?id=47663147 ; comments cited: https://news.ycombinator.com/item?id=47664428 , https://news.ycombinator.com/item?id=47667611 , https://news.ycombinator.com/item?id=47671671 , https://news.ycombinator.com/item?id=47671728 , https://news.ycombinator.com/item?id=47674891 , https://news.ycombinator.com/item?id=47665454 , https://news.ycombinator.com/item?id=47671104 , https://news.ycombinator.com/item?id=47679269
- HN "Designing APIs for Agents" (Jul 2026): https://news.ycombinator.com/item?id=48894874
- HN Sprites post (Sep 2026): https://news.ycombinator.com/item?id=49847310 ; https://news.ycombinator.com/item?id=49829062
- HN Agentjail: https://news.ycombinator.com/item?id=47827862 ; HN Areibman: https://news.ycombinator.com/item?id=44856540 ; HN dbmikus: https://news.ycombinator.com/item?id=48688989
- Freestyle changelog (Sep 9 and Oct 14, 2026): https://www.freestyle.sh/changelog
- Freestyle about.md: https://www.freestyle.sh/about.md ; homepage: https://www.freestyle.sh/ ; guides: https://www.freestyle.sh/docs/guides
- Freestyle blog: https://www.freestyle.sh/blog/opinion/sprites-connectors-terrible-api-design ; https://www.freestyle.sh/blog/opinion/designing-apis-for-agents ; https://www.freestyle.sh/blog/product/give-your-ai-security-agent-a-kali-vm ; https://www.freestyle.sh/blog/product/top-5-most-powerful-sandboxes ; https://www.freestyle.sh/blog/opinion/why-ai-sandboxes-suck
- X (via engine and Nitter mirrors): https://x.com/benswerd/status/2105464635122221500 ; https://x.com/benswerd/status/2112326078408876087 ; https://nitter.rdrama.net/benswerd ; https://nitter.rdrama.net/freestyle_dev/with_replies
- Agent Arena tweet (Feb 2026): https://tweets.vercel.fyi/x/heymikasagi/2027081173223313799
- YouTube, Mastra Agents Hour (2026-08-04): https://www.youtube.com/watch?v=eBbnshMZOuI ; Fondo START (2026-09-23): https://www.youtube.com/watch?v=Z74SJOkHAPI ; Fondo article: https://fondo.com/blog/start-benjamin-swerdlow
- LinkedIn: https://www.linkedin.com/posts/davjphillips_i-dont-believe-claude-code-will-exist-in-activity-7508647414191398913-zyS9 ; https://www.linkedin.com/posts/benswerdlow_great-conversation-future-is-moving-fast-activity-7508683495146385410-qZYu ; https://www.linkedin.com/posts/benswerdlow_freestyle-is-hosting-the-cursed-agents-demo-activity-7513053162589769728-LAPg
- Third-party reviews (background): https://techstackups.com/articles/freestyle-ax-audit/ ; https://theagentpost.co/posts/review-freestyle ; https://ai-beat.github.io/news/2026/04/freestyle-agent-vms/
- Pricing and benchmarks: https://boat.dev/compare ; https://docs.boat.dev/pricing ; https://c17.io/compare/agent-sandboxes ; https://dbggr.dev/articles/agent-sandboxes-compared/
- Oct 2026 comparisons that omit Freestyle: https://lizard.build/blog/e2b-vs-daytona-vs-modal ; https://useagent.org/blog/e2b-vs-daytona-agent-sandboxes ; https://infragap.com/compare/e2b-vs-daytona/ ; https://answers.databricks.com/e2b-daytona-modal-sandbox-ai-agents
- Rivet sandbox adapter: https://rivet.dev/agents/docs/sandbox-adapter/
- GitHub: https://github.com/freestyle-sh ; https://github.com/freestyle-sh/Adorable ; https://github.com/freestyle-sh/rigkit
- Name-collision company: https://linkedin.com/company/freestyle-ai
- Added in re-check: YC directory (Freestyle.sh, Summer 2024): https://www.ycombinator.com/companies/freestyle ; YC directory (Freestyle Gmail assistant, Fall 2024): https://www.ycombinator.com/companies/freestyle-ai ; rename notice: https://freestyle.ai/friday ; Better Call Claude: https://luma.com/freestyle-yh5k ; Lizard benchmark (source of "We sell Lizard Sandboxes"): https://lizard.build/blog/e2b-vs-daytona-vs-modal

---

## Verification log (2026-10-29)

An adversarial re-check of the most decision-relevant claims, using the gh API, the HN Firebase API, yt-dlp, Exa fetch, WebFetch and curl.

| # | Claim | Method | Outcome |
|---|---|---|---|
| 1 | Sep 9, 2026 changelog: "Freestyle is now focused on VMs. We've deprecated the standalone Git, code execution, web deployment, and scheduled trigger APIs." | freestyle.sh/changelog (Exa + WebFetch) | **Confirmed** verbatim. The entry dates on the page are Oct 14, Sep 9, Apr 17 and Apr 11. "VM creation requires a firewall configuration" and 64 GiB on Pro were also confirmed. |
| 2 | Oct 14 changelog: connectXterm, `vm.exec()` up to 24h | Same | **Confirmed.** The 24h limit requires an updated guest agent (added). Kali is **not** in the changelog; it comes from the Oct 24 blog post (fixed). |
| 3 | Launch HN 47663147: 322 pts, 158 comments, 2026-04-06 | HN API | **Confirmed.** |
| 4 | HN "Designing APIs for Agents" 79 pts, 48 comments, Jul 13; Sprites post 4 pts and 1 pt, 0 comments, Sep 24-25 | HN API | **Confirmed.** |
| 5 | Launch HN comment quotes (networking, Daytona boots faster, not for individual devs, orliesaurus, benatkin, brap, etse) | HN API | **Confirmed**, with one **wording fix**: WebSockets "just automatically reconnects", not "just [work]". The etse comment is a plug for a competitor (noted). |
| 6 | Adorable 831 stars, 319 forks, last push 2026-08-25, 1 new issue (#36, Aug 27); rigkit 13 stars | gh api | **Confirmed.** |
| 7 | boat.dev: Freestyle $0.264/h (7x), prices verified 2026-09-26; benchmark 9.6 vs 27.7 / 18.6 / 11.2 / 9.6; "indicative, not a like-for-like race" | boat.dev/compare, docs.boat.dev/pricing (Exa + curl) | **Confirmed.** The **"We sell..." quote attributed to boat is wrong**: that phrase is on Lizard's page (deleted and corrected). Boat's current 50-VM chart shows Freestyle at 7x, not the 10x Swerdlow cites (noted). |
| 8 | Swerdlow's Oct 28 pricing posts ("Is this coordinated?...", "fairly misleading"); zack_overflow quote; konstiwohlwend RT | Nitter timeline | **Confirmed** verbatim. |
| 9 | "terse terse" quote-tweet, Minecraft posts, Oct 25 "next 3 weeks" post | Nitter timeline | **Confirmed.** The "terse terse" date is still relative (21h before capture). |
| 10 | Oct 19 "how do we get some freestyle.sh vms in there?" and the Oct 1 "said no freestyle.sh user ever" | x.com (unavailable), Nitter replies (429) | **Unverified** in re-check. Marked. |
| 11 | Missing item: Swerdlow promoting Haunted Hacks | Nitter timeline | **Added**: Oct 25 quote-tweet of Karatzas's announcement, "Lets get freaky (hacker style)!" |
| 12 | Better Call Claude event | luma.com/freestyle-yh5k | **Confirmed, details added**: Nov 5, 7-9 PM PT, 475 Sansome St, 109 going. |
| 13 | YouTube: Mastra Agents Hour Aug 4 (249 views, 7 likes); Fondo Sep 23 (123 views) | yt-dlp metadata | **Confirmed.** The transcript re-pull failed, so the Mastra quotes are marked unverified in re-check. |
| 14 | TechStackups quotes | WebFetch | Four quotes **confirmed** ("two of nineteen organic conditions", "right positioning", "Live VM forking and multi-tenant Git", "hosted, simple to install"). The **Morph Cloud "quote" was a paraphrase** and has been replaced with the verbatim sentence. |
| 15 | The Agent Post quotes ("genuinely impressive technology", "keep walking"); AI Beat "meaningful primitive", "technically credible" | WebFetch / Exa | **Confirmed.** |
| 16 | Agent Arena tweet (Feb 26): grade B, "Shoutout to @benswerd ... <24 hrs" | tweets.vercel.fyi mirror | **Confirmed.** |
| 17 | Oct comparisons omit Freestyle (Lizard Oct 12, Databricks Oct 28) | Exa fetch | **Confirmed** for the two checked; UseAgent, Infragap and c17 were not re-checked. Databricks' page adds that E2B's CLI forks running sandboxes, which **undercuts the "forking is unique" framing** (added). |
| 18 | Rivet sandbox adapter lists "agentOS, E2B, Daytona, or Freestyle"; page is TODO | rivet.dev | **Confirmed.** |
| 19 | about.md: "CPU Intensive CI/CD" anti-use case, p99 < 400ms, `tokens create` CLI flow; homepage "65 ms" | Exa fetch | **Confirmed.** |
| 20 | Freestyle's YC batch "F24" (event page) | YC directory, Swerdlow X bio | **Refuted for Freestyle.sh**: it is **S24**. F24 is the unrelated freestyle.ai Gmail assistant (renamed from Friday in July 2026). Added. |
| 21 | $100 attendee Freestyle credit | EVENT_PAGE.md | **Confirmed.** Also added: $10,000 in Freestyle credits in the grand prize. |
| 22 | @freestyle_dev: 8 tweets, about 420 followers | Nitter profile | **Confirmed** (8 tweets, 418 followers). |
