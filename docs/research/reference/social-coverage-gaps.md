# Social and trend coverage gaps: Discord, Bluesky, YouTube, and this week's HN (gap-fill)

> Written 2026-10-29 PT (checks ran 2026-10-30 05:30-07:00 UTC). This is a completeness pass over `docs/research/`. It covers only what the existing files missed or left stale: Discord community sizes, Bluesky, YouTube (the existing files sampled only the hosts' own channels), the "multiplayer AI" category on HN, and HN stories from Oct 26-30. Everything already in the master briefs is left there and not repeated.
>
> Labels: **[V]** = verified by me against a live API or page, with the URL given. **[I]** = my inference. **[BG]** = background, older than Aug 2026.

## TL;DR

1. **Agent Relay's Discord has 18 members (3 online)** [V]. Freestyle's has 369, Mastra's 6,296, Supabase's 56,126 and OpenAI's 856,662. Terse and Superserve link no Discord from their sites, docs or README. If you get stuck on Saturday, ask the founders in the room. Don't expect a Discord channel to help.
2. **Bluesky doesn't matter for this event.** No host or sponsor except Supabase has an account I could find. Supabase's account (1,568 followers) has no original posts since Aug 1. The DO thought leaders (Boodman, Varda, Tane) are on Bluesky, but their posts there are personal [V]. The conversation is on X and HN, and the existing files already cover those.
3. **YouTube is the biggest platform the existing files under-sampled.** In October, the durable-agents explainer videos on YouTube got 8K-67K views each: Pi Durable with Zechner and Ronacher had 66.7K, and Cloudflare Connect's "Building durable agents with Durable Objects" had 12.5K. "Multiplayer agents" content is mostly creator-sponsored. Nate Herk's Kylon-sponsored "AI Agents Just Became Multiplayer" had 102K [V]. The local Halloween angle is already proven: KPIX's report on an Alameda girl's AI talking skeleton had 191.9K views and 625 comments in 4 days [V].
4. **"Multiplayer AI for agents" is a crowded, low-engagement category on HN, while multiplayer games do well.** Since Aug 1: Radio (21 pts), Type.com (14), Crew (12), Agor (10), Delta (8), Praxos (8), Amika (7). Playful multiplayer games got 80-138 (Mic Drop karaoke 93, Brickbrag 82) [V]. Terse launched with "You are probably building Multiplayer AI Wrong" on Oct 29, into a category where everyone else is pitching workspaces [I]. A demo that looks like a game will stand out. Another workspace won't.
5. **This week's HN stories that the existing files missed** (Oct 26-30): Martin Fowler's "LLM Voice" (411 pts, readers say LLM text is unreadable), "AI is ruining haunted houses" (48 pts / 111 comments, an anti-AI Halloween mood), "AI promised less work. I've never worked more" (677), "Show HN: Castellan, a real-time strategy game for agents" and "Show HN: HackerDome, real time PvP programming duels ft. spectating and sabotage" [V].
6. **The `last30days` engine run (Sep 30 to Oct 30) found almost nothing.** It returned 39 items, Reddit was blocked (403), and the top X post had 27 likes. That matches what the earlier files reported: outside the founders' own posts and one HN thread, almost nobody is talking about actors for AI [V].

---

## 1. Discord: community size and where help will come from

Method: the public invite endpoint `https://discord.com/api/v10/invites/{code}?with_counts=true` (no auth needed), queried 2026-10-30 06:28 UTC. Invite codes were scraped from each company's homepage, docs and README.

| Community | Invite (source page) | Members | Online | Notes |
|---|---|---|---|---|
| Agent Relay | `discord.gg/6E6CTxM8um` (agentrelay.com, agentrelay.com/docs, relay README) | **18** | 3 | Lands on `#general`, no expiry [V] |
| Freestyle | `discord.gg/v5WT4fbXhc` (freestyle.sh, docs.freestyle.sh) | 369 | 29 | Lands on `#general` [V] |
| Mastra | `discord.gg/mastra-ai` (mastra.ai, mastra README) | 6,296 | 641 | Lands on `#rules` [V] |
| Supabase | `discord.gg/supabase` (vanity) | 56,126 | 4,835 | [V] |
| OpenAI | `discord.gg/openai` (vanity) | 856,662 | 60,128 | Lands on `#openai-verification` [V] |
| Terse | none found on useterse.ai, docs.useterse.ai/quickstart or the `TerseAI/durable-actors` README | n/a | n/a | Their only community links are LinkedIn and X [V] |
| Superserve | none found on superserve.ai or docs.superserve.ai (X links only: `x.com/superserve_ai`, `x.com/superserve`) | n/a | n/a | [V] |

Reading [I]:
- 18 Discord members contrasts sharply with Agent Relay's other numbers: about 96.6K views on the launch tweet, about 1,059 GitHub stars and 147,910 `@agent-relay/sdk` npm downloads from Oct 1-28 (from `agent-relay/04-social-pulse.md`). The Discord is a placeholder. The npm count is probably inflated by the team's own CI, which that file also suspects. Treat Will, Khaliq and the Agent Relay staff in the room as the support channel.
- Freestyle has a small but staffed Discord. With 29 online at 11:30pm PT, someone might answer a question Saturday morning. Mastra's Discord is large enough that a question during the hackathon could get an answer from the community. Neither company is a host, so you probably won't need them.
- The existing `event-people/03-event-listings-logistics.md` says the Agent Relay and Freestyle Discords were "not inspected". This table fills that gap.

## 2. Bluesky: checked, mostly empty

Method: the Bluesky public AppView. `app.bsky.feed.searchPosts` returned **HTTP 403** without an app password, so I could not search posts. `app.bsky.actor.searchActors`, `getProfile` and `getAuthorFeed` work without auth, so I looked up accounts and read their timelines from Aug 1 onward.

| Account | Followers / posts | Aug-Oct 2026 posts (original, no replies) |
|---|---|---|
| `supabase.com` | 1,568 / 59 | None dated after Aug 1 among the 40 most recent [V] |
| `cloudflare.social` | 12,898 / 1,466 | Many Connect 2026 posts (Oct 17-27). The most-liked was "Introducing Clairic" (103 likes, Oct 19). Agent-themed posts like "Agents are already browsing, buying, and building for us" (Oct 21) got 7 likes [V] ([post](https://bsky.app/profile/cloudflare.social/post/3mye74b7m6s2p)) |
| `aaronboodman.com` (author of the event's "what are actors" thread) | 2,032 / 351 | Personal posts plus an Oct 27 jetstream outage report. Nothing on DOs or actors [V] ([post](https://bsky.app/profile/aaronboodman.com/post/3mytsayyfyc2l)) |
| `kentonvarda.com` (Workers/DO tech lead) | 2,232 / 220 | One personal post (Sep 27) [V] |
| `boristane.bsky.social` (author of the event's DO explainer blog) | 1,261 / 76 | None in the window [V] |
| Mastra, Freestyle, Terse, Agent Relay, OpenAI | not found | `searchActors` returned only unrelated people. For OpenAI it returned an unofficial mirror bot (`openai.xmirror.bot`). `superserve.bsky.social` is an unrelated "engagement agency" [V] |

Conclusion [I]: posting your demo on Bluesky will reach almost none of the judges or hosts. Post on X and tag the handles listed in `event-people.md`.

## 3. YouTube: what the existing files missed

The earlier files looked only at the hosts' own channels: Terse's 2 videos with single-digit views, and one Agent Relay podcast with 131 views. I searched YouTube for this month, sorted by views, and pulled metadata with `yt-dlp` on 2026-10-30.

| Upload | Video | Channel | Views / likes / comments | Why it matters |
|---|---|---|---|---|
| 2026-10-07 | [Pi Durable: Agents That Survive Crashes, Mario Zechner & Armin Ronacher](https://www.youtube.com/watch?v=ja_7AF54OtE) (57:41) | 0xSero | 66,699 / 664 / 50 | The biggest durable-agents explainer this month. It backs up the "everyone is converging on durable agents" point in `trends-ai-tech/03` [V] |
| 2026-10-01 | [Pi Durable on Cloudflare](https://www.youtube.com/watch?v=y0lykS_IIt4) (1:27) | Armin Ronacher | 8,184 / 85 / 8 | A 90-second demo works as the format [V] |
| 2026-10-21 | [Building durable agents with Durable Objects (Cloudflare Connect 2026)](https://www.youtube.com/watch?v=VBsqp3NutAE) (43:02) | Cloudflare Developers | 12,511 / 237 / 12 | Justin Schroeder (Standard Agents) on "an agent cloud entirely on Cloudflare, using Durable Objects for long-lived, stateful agents". This is the Cloudflare framing that Terse competes with. No existing file mentions it [V] |
| 2026-10-09 | [Deno Is Over (Cloudflare Shut It Down)](https://www.youtube.com/watch?v=W_g7WKMwNeo) (4:21) | Better Stack | 162,543 / 2,014 / 288 | The Deno-to-Cloudflare story, which also explains how DOs work. The acquisition itself is covered in `terse/04` and `landscape-actors`. The video's reach is new information [V] |
| 2026-10-17 | [RuneScape Bench: MMOs for Agents, Max Bittker](https://www.youtube.com/watch?v=cNm4zyUtWj0) (46:54) | Recurse Center | 475,710 / 6,574 / 375 | Agents playing a persistent multiplayer world. By far the biggest agent-in-a-shared-world video [V]. `trends-realtime` names RuneScape Bench but not its reach |
| 2026-10-15 | [AI Agents Just Became Multiplayer. Here's How to Build Them.](https://www.youtube.com/watch?v=KZiF2J83zaY) (22:24) | Nate Herk / AI Automation | 102,271 / 1,045 / 113 | The description says "Kylon sponsored this video". Kylon ([kylon.io](https://kylon.io/)) sells a "company harness" with rooms where Claude Code, Codex and Devin join as members. One handoff rule is notable: "A message from an agent wakes no one unless it names an agent, so agent chatter cannot snowball" ([kylon.io/product/workspace](https://kylon.io/product/workspace)) [V]. This is a direct product parallel to Agent Relay |
| 2026-10-16 | [Researchers Made "First Contact" With Rogue AI Agents…](https://www.youtube.com/watch?v=rb4CTZjHCNg) (12:10) | AI Copium | 819,597 / 8,419 / 1,600 | The rogue-agent / "haunted message board" story, at mass-audience scale. The story is covered in `trends-ai-tech/07`. This view count is new [V] |
| 2026-10-24 | [How I Connect Multiple Agent Teams Together (Hermes Agent Bots)](https://www.youtube.com/watch?v=nNxUtkQOSc4) (20:54) | Wanderloots | 24,802 / 374 / 39 | Hobbyists wiring agent teams across devices. This is the job Agent Relay does, without Relay [V] |
| 2026-10-08 / 10-15 | [Fix Your AI Voice Agent Before Users Break It](https://www.youtube.com/watch?v=ycSxhQTKX7Y) / [Cascade vs. speech-to-speech vs. full-duplex](https://www.youtube.com/watch?v=BZaWD9QPCME) | LiveKit | 686,356 views / **26 likes**; 89,392 / 28 | The view-to-like ratio suggests these views are paid promotion, not organic interest [I]. Useful content anyway: LiveKit Simulations (LLM-driven simulated callers that grade the voice agent) and the three voice architectures |
| 2026-10-26 | [Alameda girl uses AI to create talking skeleton for Halloween display](https://www.youtube.com/watch?v=9opmilWYBwk) (3:31) | KPIX / CBS News Bay Area | 191,911 / 3,327 / 625 | This is the "Uncle Murray" story (19th News; HN Oct 28, 3 pts). Local TV reach is new here. A real-time talking Halloween prop is a proven Bay Area news story [V] |
| 2026-10-03 | [Idiots Laugh At TERRIBLE AI Halloween Music](https://www.youtube.com/watch?v=yuFDGRyJlhE) | Dan Dingle | 650,943 / 15,377 / ~2,000 | Ridiculing low-effort AI Halloween content is popular. Several cozy Halloween lo-fi uploads this month put "No AI" in the title [V]. The anti-slop mood extends to Halloween |

Search noise to note: YouTube results for "actor model agents" were all talent-agency videos [V]. The term "actor" doesn't reach a general audience. Pitch the idea as "one live object per room/agent" (Boodman's framing), not as "actors".

## 4. "Multiplayer AI" on HN: a crowded category with little engagement

Terse's YC launch (Oct 29) is titled around **"Multiplayer AI"**. HN Algolia, all stories since 2026-08-01 with "multiplayer" in the text, top 20 by points [V]:

| Date | Story | Pts / comments |
|---|---|---|
| 09-14 | [Radio, a chatroom for multiplayer agent work](https://news.ycombinator.com/item?id=49702303) | 21 / 15 |
| 09-09 | [Show HN: Type.com, Multiplayer Codex/Claude in the cloud for non-tech use cases](https://news.ycombinator.com/item?id=49626148) | 14 / 10 |
| 08-12 | [Crew, a multiplayer workspace for humans and AI agents](https://news.ycombinator.com/item?id=49267362) | 12 / 2 |
| 10-13 | [Show HN: Agor, multiplayer AI, stop running agents alone](https://news.ycombinator.com/item?id=50073109) | 10 / 2 |
| 09-16 | [Delta, A Multiplayer Environment for Coding with Agents](https://news.ycombinator.com/item?id=49727648) | 8 / 1 |
| 09-21 | [Show HN: Praxos, Multiplayer AI](https://news.ycombinator.com/item?id=49793831) | 8 / 0 |
| 09-15 | [Show HN: Amika, Multiplayer cloud workstations for coding agents and humans](https://news.ycombinator.com/item?id=49716282) | 7 / 5 |
| 10-21 | Show HN: Multiplayer AI (synteny.vercel.app; surfaced by the `last30days` run) | 4 / - |
| *vs. games* | | |
| 08-16 | [Show HN: Mic Drop, a real-time multiplayer karaoke game](https://news.ycombinator.com/item?id=49315742) | 93 / 43 |
| 10-12 | [Show HN: Brickbrag, a multiplayer brick-building world in the browser](https://news.ycombinator.com/item?id=50063042) | 82 / 40 |
| 10-14 | [Game of Life, But Multiplayer, Hypermedia and Python](https://news.ycombinator.com/item?id=50085171) | 58 / 24 |
| 10-20 | [Battle Drones, a vibe coded RTS with audio-based multiplayer](https://news.ycombinator.com/item?id=50173389) (Simon Willison) | 8 / 3 |

Reading [I]: at least seven "multiplayer workspace for humans + agents" products launched on HN in 10 weeks, none above 21 points. Kylon raised the same pitch to 102K views on YouTube, but only through paid creator promotion (see §3). The audience is tired of agent workspaces and still enjoys multiplayer play. This agrees with the existing Show HN analysis ("one playful idea, a URL that opens immediately, no signup, strong visual"), and the multiplayer numbers add evidence for it.

## 5. HN, Oct 26-30: items the existing files missed

Coverage check: I grepped `docs/research/` for each title. Items already present are not listed: Anthropic S-1, Genie 4, Gemini 4 Carbon, Mistral Large 4, GPT-6.1 Terra, the Claude Code background-agent transcript gist, "OpenAI's agents talked to each other through the CPU cache", Simantic, Uncle Murray, and the Agent-relay name-collision Show HN.

| Date | Story | Pts / cmts | Relevance [I] |
|---|---|---|---|
| 10-27 | ["AI promised less work. I've never worked more"](https://news.ycombinator.com/item?id=50257325) | 677 / 660 | Pitch risk: "agents work while you sleep" claims will run into this mood. Show the work being reduced, not more of it |
| 10-29 | [LLM Voice (Martin Fowler)](https://news.ycombinator.com/item?id=50290177) | 411 / 215 | Top comment: "I've also noticed how awful everything is to read lately… everything sounding identical and everything being a rambling unconcise mess" ([BurritoKing](https://news.ycombinator.com/item?id=50293240)). Keep agent output short and on screen. This matches Khaliq's "Reading long blocks of text from AI is definitely not it" (`event-people.md`) |
| 10-27 | [AI is ruining haunted houses](https://news.ycombinator.com/item?id=50256230) (Plagiarism Today, Oct 26) | 48 / 111 | The author found AI art at a haunted attraction "so bad that it even included the Gemini diamond" ([article](https://www.plagiarismtoday.com/2026/10/26/ai-is-ruining-haunted-attractions/)). HN commenters split. Halloween demos built on generated images can draw this backlash. Real-time interaction is safer than AI art |
| 10-27 | [Show HN: Cryo, a language whose programs live forever](https://news.ycombinator.com/item?id=50261093) (Endothermic Labs) | 12 / 0 | "Programs freeze to disk when idle and can be thawed when new data arrives". Yet another durable-agent runtime launched this week, which adds weight to the durable-agents trend |
| 10-26 | [Show HN: Castellan, a real-time strategy game for agents](https://news.ycombinator.com/item?id=50246334) | 3 / 4 | "The game keeps running while the agent thinks". Agents join via MCP or CLI (Claude Code, Codex, Cursor). The only question asked: "do the upload unit scripts run sandboxed on your server?" A real-time game for agents fits the event's theme |
| 10-27 | [Show HN: HackerDome, real time PvP programming duels ft. spectating and sabotage](https://news.ycombinator.com/item?id=50264623) | 5 / 0 | Same "spectate and sabotage" idea that `trends-realtime` found works on streams |
| 10-27 | [Discord will soon let anyone find public server messages through Google](https://news.ycombinator.com/item?id=50263854) | 332 / 215 | Minor. If your demo runs in a public Discord, its messages may become searchable on Google |

## 6. `last30days` run (social engine), for the record

Topic: "durable objects actors for AI agents", run 2026-10-30 UTC, window Sep 30 to Oct 30. The plan file had three subqueries (DO/actors, multiplayer AI, agent-to-agent messaging), targeted the X handles of @IncTerse and the hosts, subreddits r/CloudFlare, r/AI_Agents, r/LocalLLaMA, r/ClaudeAI and r/LangChain, and the repos of both hosts.

Result [V]: 39 items. Reddit 13 (public search **403**, so the items came from fallback listings and were mostly off-topic), X 7 (76 likes total), YouTube 2 (99 views), HN 7 (33 pts), GitHub 2, Web 8. TikTok and Instagram were not configured (no ScrapeCreators key). Bluesky needs an app password. On-topic items: two tiny YouTube explainers on `celld` (Deno's DO-style runtime, 74 and 25 views), the Agor Show HN, and an [Agentborn](https://x.com/AgentBornGG/status/2106438423112278398) post about multiplayer agent-built games (27 likes, Oct 3). The engine flagged the result itself: "Recent evidence is thin: only 8 of 39 dated items are from the last 7 days."

Reading [I]: the community talking about actor-model AI is the hosts themselves, plus Cloudflare and Pi Durable. Judges won't have seen a dozen similar demos already. A clear visual explanation of what an actor is still has novelty value.

---

## Limits / could not verify

- **Reddit:** public search and RSS returned 403 for every tool, both direct curl and `last30days`. Reddit is still sampled only through digests, as in the earlier files.
- **Bluesky post search** needs an app password, so I checked accounts only. A non-host post about the event on Bluesky could exist and I wouldn't have found it.
- **TikTok, Instagram and Threads:** not searched (no ScrapeCreators key). Threads appears in only 2 citations across the corpus. Coverage on these platforms is zero, not "nothing found".
- **Discord counts** are approximate values from the invite API. They show size, not activity. I didn't join any server or read messages.
- **YouTube views** are a snapshot from 2026-10-30. The view-to-like ratio on LiveKit's videos suggests promoted views, but that's my inference.
- **Agentborn, Kylon and synteny** were not checked beyond their landing pages and posts.
- **No posts about the event between Oct 23 and 29** (from `event-people/03`). The founders' Oct 29 X timelines, read through the teapawt mirror, show the Terse launch and Agent Relay culture posts ("we're getting rid of PRs"). I read only the ~8 newest items on each timeline, and none of them was a new Haunted Hacks post, judge list or prize update [V, mirror only, partial].

## Hackathon implications

1. **Support plan:** Agent Relay's Discord has 18 members and Terse has none. Before Oct 31, read the Relay and Durable Actors quickstarts end to end (see `agent-relay.md` and `terse.md`), and at 11:00 find Will/Khaliq and Thomas/Olivier by face. Don't count on async help.
2. **Make it a game or a spectacle, not a workspace.** HN data since August: agent workspaces get 7-21 points, multiplayer games 80-93. Kylon already sells "rooms with Claude Code and Codex as members". Pitch "a room you can watch and interfere with" (Castellan, HackerDome, RuneScape Bench, YC's Minecraft agents) rather than "Slack for agents".
3. **Halloween hook that avoids the AI-art backlash:** a real-time voice prop or character. KPIX's Alameda skeleton story got 191.9K views. Avoid generated posters and art, given "AI is ruining haunted houses" and the "No AI" Halloween lo-fi titles. Draw the spooky visuals by hand or use plain CSS.
4. **Keep agent text to a minimum on stage.** Fowler's "LLM Voice" (411 pts) and Khaliq's "reading long blocks of text from AI is definitely not it" point the same way. Show state changes, presence and voice. Don't show paragraphs.
5. **Explain actors without the jargon.** "Actor" pulls in talent-agency results even on YouTube. Use Boodman's line: one live object per id, at a URL. Show the one-instance-per-room guarantee visually: two browsers, one room, one agent that never splits.
6. **Distribution after the demo:** post a ≤90-second clip on X tagging @IncTerse, @agent_relay and the founders. Armin Ronacher's 1:27 Pi Durable clip got 8K views from an expert audience. Skip Bluesky and Discord for reach.
7. **Pre-event setup:** join the Freestyle and Mastra Discords now if you plan to use them (invites above). Install the latest `yt-dlp` only if you'll pull YouTube references. The local copy is from 2026-03 and failed to fetch transcripts.

## Sources

Discord invite API (queried 2026-10-30 06:28 UTC):
- https://discord.com/api/v10/invites/6E6CTxM8um?with_counts=true
- https://discord.com/api/v10/invites/v5WT4fbXhc?with_counts=true
- https://discord.com/api/v10/invites/mastra-ai?with_counts=true
- https://discord.com/api/v10/invites/supabase?with_counts=true
- https://discord.com/api/v10/invites/openai?with_counts=true
- Link pages scraped: https://agentrelay.com, https://agentrelay.com/docs, https://www.freestyle.sh, https://docs.freestyle.sh, https://mastra.ai, https://www.useterse.ai, https://docs.useterse.ai/quickstart, https://superserve.ai, https://docs.superserve.ai, https://raw.githubusercontent.com/AgentWorkforce/relay/main/README.md, https://raw.githubusercontent.com/TerseAI/durable-actors/main/README.md

Bluesky (public AppView):
- https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts (403)
- https://bsky.app/profile/supabase.com · https://bsky.app/profile/cloudflare.social · https://bsky.app/profile/aaronboodman.com · https://bsky.app/profile/kentonvarda.com · https://bsky.app/profile/boristane.bsky.social
- https://bsky.app/profile/cloudflare.social/post/3mye74b7m6s2p · https://bsky.app/profile/cloudflare.social/post/3myapk3p4fv2f · https://bsky.app/profile/aaronboodman.com/post/3mytsayyfyc2l

YouTube:
- https://www.youtube.com/watch?v=ja_7AF54OtE · https://www.youtube.com/watch?v=y0lykS_IIt4 · https://www.youtube.com/watch?v=VBsqp3NutAE · https://www.youtube.com/watch?v=W_g7WKMwNeo · https://www.youtube.com/watch?v=cNm4zyUtWj0 · https://www.youtube.com/watch?v=KZiF2J83zaY · https://www.youtube.com/watch?v=rb4CTZjHCNg · https://www.youtube.com/watch?v=nNxUtkQOSc4 · https://www.youtube.com/watch?v=ycSxhQTKX7Y · https://www.youtube.com/watch?v=BZaWD9QPCME · https://www.youtube.com/watch?v=9opmilWYBwk · https://www.youtube.com/watch?v=yuFDGRyJlhE · https://www.youtube.com/watch?v=nbAMJAKx_ds · https://www.youtube.com/watch?v=kllIkWT1fWk

Kylon:
- https://kylon.io/ · https://kylon.io/product/workspace · https://kylon.io/bring-your-own-agent · https://docs.kylon.io/introduction

Hacker News (Algolia API, https://hn.algolia.com/api/v1/):
- https://news.ycombinator.com/item?id=50257325 · https://news.ycombinator.com/item?id=50290177 · https://news.ycombinator.com/item?id=50293240 · https://news.ycombinator.com/item?id=50256230 · https://news.ycombinator.com/item?id=50261093 · https://news.ycombinator.com/item?id=50246334 · https://news.ycombinator.com/item?id=50264623 · https://news.ycombinator.com/item?id=50263854
- https://news.ycombinator.com/item?id=49702303 · https://news.ycombinator.com/item?id=49626148 · https://news.ycombinator.com/item?id=49267362 · https://news.ycombinator.com/item?id=50073109 · https://news.ycombinator.com/item?id=49727648 · https://news.ycombinator.com/item?id=49793831 · https://news.ycombinator.com/item?id=49716282 · https://news.ycombinator.com/item?id=49315742 · https://news.ycombinator.com/item?id=50063042 · https://news.ycombinator.com/item?id=50085171 · https://news.ycombinator.com/item?id=50173389

Articles and posts:
- https://www.plagiarismtoday.com/2026/10/26/ai-is-ruining-haunted-attractions/
- https://martinfowler.com/bliki/LLM-Voice.html
- https://rts.emersoftware.cl/ · https://github.com/emersoftware/castellan
- https://x.com/AgentBornGG/status/2106438423112278398
- Founder timelines via mirror (2026-10-29): https://teapawt.org/karatzas_thomas · https://teapawt.org/willwashburn · https://teapawt.org/Khaliqgant · https://teapawt.org/IncTerse
- `last30days` raw output: /private/tmp/l30out/durable-objects-actors-for-ai-agents-raw-v3.md (local, ephemeral)
