# Haunted Hacks 2026: public listings, announcements and pre-event logistics

Checked **29 Oct 2026** (two days before the event). Scope: every public listing or post about Haunted Hacks I could find outside the canonical YC page: Luma (two listings), Builderbase, aggregators (Hackathon Radar, CompeteHub, Manyfold, BuildJams, Hackface), X (read through teapawt.org mirrors) and LinkedIn. Also the practical setup each attendee should do before Saturday. Tools: Exa search/fetch, WebSearch, the Luma MCP, one Firecrawl search. The canonical YC page (`events.ycombinator.com/haunted-hacks-2026`) returned empty content to Exa; its text comes from the Firecrawl capture in `../../EVENT_PAGE.md`.

Labels: **[V]** = read in the cited source on 29 Oct. **[I]** = my inference. **[S]** = taken from a sibling research file in this repo, which carries its own primary citations. Everything here is from Oct 2026, so the "last 90 days" window covers all of it. No pre-August background was relevant.

---

## TL;DR

- **Venue: the YC office, 560 20th St, San Francisco, CA 94107 (Dogpatch).** [V] Several listings name the "YC office". The street address comes from CompeteHub's summary. The Luma API's `full_address` for an earlier YC-office hackathon (luma.com/hzwlapu0, 9 Aug 2025) is "Y Combinator, 560 20th St, San Francisco, CA 94107, USA". The official Luma page hides the location (`geo_address_info.mode: "obfuscated"`), and the YC page shows only "San Francisco, CA, USA".
- **The listing copy changed at least three times.** Early copy (Devpost-sourced) had judging on **Devpost**, only OpenAI, Mastra and Supabase as sponsors, and no Freestyle or Superserve prizes. Current copy has **Builderbase** judging ("Participant signup will occur on check-in"), five sponsors, four per-attendee credit grants, and a grand prize that adds **$10k Freestyle + $1k Superserve**. [V] Treat any aggregator page as stale.
- **No judges have been announced** in any listing I found. All versions still say "Judges will be announced soon" and "More prizes will be announced!" [V]
- **Team size: three different numbers are in circulation.** The Builderbase-run Luma listing says "Teams of up to 4". [V] The YC event page's own embedded page data (not the visible copy) has `"has_team_applications":true` and `"max_team_size":5`, so the YC RSVP form accepts team applications of up to 5 people. [V, fact-check 29 Oct] One aggregator (Manyfold) claims "2–4 members; solo entries are not allowed". That wording does not appear in any official copy, and the official page says "we're happy to help you form a team if you're coming on your own". [I] **Plan for 4 or fewer.** Four fits both official numbers. Solos are clearly welcome.
- **Capacity and RSVP (fact-check addition):** the YC page data shows `"capacity":225`, `"uses_qr_check_in":true`, `"registration_closes_at":null`, and one required RSVP question (LinkedIn). The YC-calendar Luma event reports `registration_availability: "sold-out"` with `require_approval: true`. [V] [I] Bring the QR code from the YC confirmation email. Expect about 225 people, or roughly 55–75 teams.
- **The code rule is short:** "All code must be created at the hackathon. Thinking of ideas before the hackathon is fine." [V] Nothing more specific (boilerplate, templates, AI-generated code) has been published. See section 4 for a safe reading.
- **Registration is through YC only.** Both Luma pages say registration is closed there and point to the YC page. Olivier Simard-Morissette (Terse) posted on 22 Oct: "Spots are filling really fast, apply quickly!" [V]

---

## 1. Inventory of public listings (as of 29 Oct)

| Listing | URL | What it adds or differs on | Status |
|---|---|---|---|
| YC events (canonical) | events.ycombinator.com/haunted-hacks-2026 | Full copy; RSVP needs a YC account. Raw HTML from `curl` (29 Oct) includes the page data: capacity 225, `max_team_size` 5, team applications on, QR check-in, LinkedIn required, `registration_frontdoor: "bookface"`, starts 17:00Z, ends 01:00Z | Current [V via EVENT_PAGE.md + curl] |
| Luma, YC calendar | luma.com/yc-meetup-7183-9316f87f (evt-mXzvj4hJK4jkhRG) | Same text as YC, prefixed "To register, go here: [YC]". Host "Y Combinator", free, approval required, `registration_availability: "sold-out"`, location obfuscated | Current. Shows Superserve and Builderbase [V via Luma MCP] |
| Luma, Builderbase Hackathons | luma.com/builde-oxba | Sat 31 Oct, 10:00–18:00 PT, "Y Combinator, San Francisco". **"Teams of up to 4."** "Registration happens there [YC], not on Luma." Sponsor line names OpenAI, Mastra, Supabase and Freestyle (no Superserve). Credits listed are only $100 OpenAI + $25 Supabase. Says "awards are at 5pm" | Partly stale (no Superserve; no Freestyle or Superserve credits). The Luma MCP `lookup_entity` returns null for this slug, but Exa reads the page [V] |
| Builderbase event page | builderbase.com/event/haunted-hacks-2026 | schema.org data: start 17:00Z, end 01:00Z (10:00–18:00 PT), organizer "Agent Relay", price 0, register path `/event/haunted-hacks-2026/register` | The register path currently renders Builderbase marketing copy, not a form [V] |
| Hackathon Radar (Devpost-sourced) | hackathonradar.com/…/haunted-hacks-realtime-ai-edition-2026 | Older copy: "October 31, 2026 · **YC Office**", "We will be using **devpost**! We recommend setting up your account ahead of time." Grand prize without Freestyle or Superserve | Stale [V] |
| Hackathon Radar (Builderbase-sourced) | hackathonradar.com/…/haunted-hacks-real-time-ai-edition-2026 | "USD5,000" prize pool (probably just the OpenAI line) | Aggregator estimate [V] |
| BuildJams | jams.shippedby.app/events/haunted-hacks-realtime-ai-edition/ | "Listed on Devpost", organizer "Terse", location "Y Combinator", themes ML/AI, Serverless, Web | Stale [V] |
| CompeteHub (×2) | competehub.dev/…/lumab9b15b9…, …/luma5817b43… | One gives the address **560 20th St, SF 94107** and "Teams of up to 4". It also claims "Experts from OpenAI, Mastra, Supabase, and Freestyle will be present". That line is AI-written summary text with no source; do not rely on it | Aggregator [V] |
| Manyfold Data | data.manyfold.ai/ai-hackathons/r/rec_01m5gbs… | "Teams must have 2–4 members; solo entries are not allowed." Credited to events.ycombinator.com, read 22 Oct | **Conflicts with the official copy; unverified** [V] |
| Hackface | hackface.dev/hack/552086475580286752 | Placeholder, 0 attendees, no projects | Empty [V] |
| HackList SF (Luma calendar) | luma.com/hacklist-sf | Lists the event next to "STRANGER BUILDS" (a different Halloween hackathon, 31 Oct) | Discovery only [V] |

**Devpost:** aggregators cite a Devpost page, but `haunted-hacks-realtime-ai-edition.devpost.com` returned not-found to Exa, and a Firecrawl `site:devpost.com` search found only an unrelated 2025 "Haunted Hacks" Godot project. [V] [I] The Devpost page was probably unpublished when judging moved to Builderbase.

## 2. Social announcements (X and LinkedIn)

All posts date from 19–22 Oct 2026. I found none from 23–29 Oct about the event. The Agent Relay Launch YC post (23 Oct), Will Washburn's launch tweet (23 Oct, about 96k views on the mirror) and @agent_relay's 28 Oct desktop-app post do not mention it. The @IncTerse timeline's newest item is from 19 Oct. [V, re-checked on the teapawt mirrors 29 Oct]

| Date (UTC) | Who | Channel | Content (verbatim excerpts) | Source |
|---|---|---|---|---|
| 19 Oct 16:28 | Khaliq Gant (Agent Relay cofounder), @Khaliqgant | X | "HAUNTED HACKS: Real time edition … Hosted by @ycombinator and run by @agent_relay and @IncTerse. Want to dig into agent to agent communication? This hackathon is for you." | teapawt.org/Khaliqgant/status/2112219340422721818 |
| 19 Oct 16:29 | Thomas Karatzas (Terse cofounder/CEO), @karatzas_thomas | X | "@IncTerse is throwing the first (to our knowledge) Actor Hackathon at @ycombinator! … Prizes include: - Guaranteed YC Interview - iPhone duo - Mac mini - more to be announced soon!" (mirror shows about 2,471 views. @IncTerse quoted it: "The age of the Actor is upon us. Come build some great demos with Durable Actors!") | teapawt.org/karatzas_thomas/status/2112219511327965403 |
| 19 Oct 16:41 | Thomas Karatzas | LinkedIn | "We are hosting a Hackathon at the YC Office on October 31st! … drink some coffee made by me" (reaction count unverified: the 29 Oct fetch did not show one. Exa's published time is 16:41:40Z) | linkedin.com/posts/thomas-karatzas-a3015a94_…-7517988351019245568-ygO0 |
| 20 Oct | Paul Jump (Uber engineer) | LinkedIn | "if there's only one thing i know about the Agent Relay (YC F26) hackathon, it's that Y Combinator (and the world?) will be talking about it for years to come." | linkedin.com/posts/paul-jump_…-7518313439392387074-oiYp |
| 20 Oct | Will Washburn (Agent Relay founder/CEO) | LinkedIn | "50% of Paul Jump's linkedIn posts are about this hackathon. Seems like a strong signal you should come to it." | linkedin.com/posts/willwashburn_…-7518360737891725312-jOLX |
| 22 Oct 00:48 | Olivier Simard-Morissette (Terse), @oliviersm199 | X | "with sponsorship from @OpenAI, @supabase and @mastra. Spots are filling really fast, apply quickly! … a costume contest" (mirror shows about 1,105 views) | teapawt.org/oliviersm199/status/2113069849341767743 |

The X link-card previews on 19 and 22 Oct already list Freestyle (F24) as a sponsor, but not Superserve. [V] [I] So Superserve and the per-attendee Freestyle/Superserve credits were probably added after 22 Oct.

**Sponsor accounts:** I found no Haunted Hacks posts from OpenAI, Supabase, Mastra, Freestyle or Superserve. The only related sponsor item was Superserve's LinkedIn post (30 Jul 2026) about the "Zero Human Company Hackathon" in SF on 15 Aug: "we will be giving away prizes for the best use of Superserve" (linkedin.com/posts/super-serve-ai_activity-7488676422224551937-f1zo). One attendee later posted that his team "won $500 … second place for Superserve" (linkedin.com/posts/abhinav-garg-12b9343b5_…-7494806275881459712-Pp3C, 16 Aug). That is background, not a prize for this event. [V]

**Discord:** I found no event Discord. Agent Relay links a community server (`discord.gg/6E6CTxM8um`) from agentrelay.com [S: agent-relay/04-social-pulse.md]. Freestyle has a community Discord [S: freestyle/04]. **Update (2026-10-30 UTC, Discord invite API):** Agent Relay has 18 members (3 online) and Freestyle 369 (29 online). Terse and Superserve link no Discord. See `reference/social-coverage-gaps.md` §1. [V]

## 3. Reconstructed changelog of the listing

| Phase | Evidence | Sponsors | Judging | Grand prize |
|---|---|---|---|---|
| A (before 19 Oct) | Devpost-sourced copy on Hackathon Radar and BuildJams | OpenAI, Mastra, Supabase | Devpost, "set up your account ahead" | YC interview + $5k OpenAI + 3 mo Mastra |
| B (19–22 Oct) | X link cards | + Freestyle | ? | ? |
| C (current, by 29 Oct) | YC page + YC Luma | + Freestyle, Superserve; per-attendee $100 OpenAI / $25 Supabase / $100 Freestyle / $100 Superserve | **Builderbase**, signup at check-in | + $10k Freestyle + $1k Superserve |

Unchanged across all phases: the schedule, the 16+ age limit, in-person only, the code rule, the track prizes (iPhone Duo for Durable Actors, Mac mini for Agent Relay), the Supabase "most likely to scale to millions" $1k, and the costume contest. [V]

## 4. Rules and their practical meaning

- **Verbatim:** "All code must be created at the hackathon. Thinking of ideas before the hackathon is fine." [V]
- [I] A conservative reading of the rule, consistent with earlier YC-office hackathons. The Freestyle-sponsored "AI Coding Agents Hackathon @ YC Office" spelled it out: "You may not use any code written before the event," and "Teams are encouraged to pre-plan … design, architecture, and resource allocation". That event also had teams of up to 4 and all members on-site (luma.com/hzwlapu0, 9 Aug 2025, co-hosted by Anthropic, Freestyle, Same.new and Morph; background).
  - **Allowed beforehand:** idea docs, architecture diagrams, pitch outline, demo script, accounts, API keys, CLI installs, a warm package cache, reading docs, and running sponsors' official quickstarts in a throwaway folder that you **delete**.
  - **Not allowed:** a pre-built repo, pre-written prompts-as-code, schema files, or components you then paste in. Do not copy from a practice folder.
  - **Grey zone, ask at check-in:** unmodified official templates such as `terse init --template …` and `npm create mastra`. Scaffolding is normally tolerated, but this event has not said so. Generating code with AI agents during the event is fine. Prompting them from a prepared spec is "ideas".
- **Eligibility:** 16+, in person, RSVP must be confirmed by YC ("We'll reach out with details if we're able to confirm your attendance"). [V]
- **Judging mechanics:** Builderbase, signup at check-in. "The top entries will demo live at the end of the event, and judges will select winners from those demos." So there is a Builderbase-scored first round between 16:00 and 17:00, and only finalists demo. [V] [I] Your Builderbase submission (description, repo, video or screenshots) has to sell the project **without you in the room**.
- **What judges want (verbatim):** "either very well-executed products or incredibly creative use cases using Durable Actors and Agent Relay … bonus points if you can do both." [V]

## 5. Accounts, keys and installs per sponsor

Condensed from sibling deep dives (each cites its primary sources). Do all of this before Saturday. **Write no project code.**

| Sponsor | Account / key to create | Install and pin | Credit delivery and gotcha |
|---|---|---|---|
| **Terse** (Durable Actors) | Sign in at app.useterse.ai. Create an API key under **API keys** (`TERSE_API_KEY`) [S: terse/01] | `bun upgrade` to **Bun ≥ 1.4.2** (this machine had 1.3.14). `bunx terse-cli@latest install`. `terse auth status` [S] | No Terse credits. Release churn is very high (4 CLI releases on 29 Oct, breaking change on 27 Oct), so **pin versions Saturday morning** [S] |
| **Agent Relay** | Sign in to Relay Cloud with Google so the workspace is `free`, not `trial`. The workspace key `rk_live_*` is shown **once**; save it [S: agent-relay/01] | `curl -fsSL https://raw.githubusercontent.com/AgentWorkforce/relay/main/install.sh \| bash`. Pin `agent-relay@14.0.0` and `@agent-relay/sdk@14.0.0`. Use ≥ 11.3.1 (older versions print the key) [S] | Never put `rk_live_*` in a URL or browser. Use an observer token `ot_live_*` for live views [S] |
| **OpenAI** | Create a dedicated API project and key [S: openai/01] | `npm i openai` / `pip install openai`. Optional Codex CLI | **GPT-Live is not available on the Free tier.** Tier depends on purchased credit, and promo credits may not count. **Buy $5 of credit before Saturday** if you want GPT-Live [S] |
| **Supabase** | Create an org and a project in a US-West region on Thu or Fri. Save the URL plus the `sb_publishable_…` and `sb_secret_…` keys [S: supabase/01] | Supabase CLI **v2.122.0** (avoid the v3 betas that started 29 Oct). supabase-js 2.118.0 [S] | How the $25 code is redeemed is unverified. Bring a card. Realtime caps (Pro 500 connections) will hurt a "scale to millions" demo unless the spend cap is off [S] |
| **Freestyle** | `npx freestyle@latest login`, then `freestyle tokens create "haunted" --output json`. **Login does not mint a key** [S: freestyle/01] | `npm i freestyle@0.2.21` (Node 20+). Do not use the deprecated `freestyle-sandboxes` package [S] | Credit is a single-use `FS-…` code, redeemed with `freestyle billing redeem`. It lands on the **active team**, so create a shared team first. `firewall` is required on VM create. `exec` times out after 30 s by default [S] |
| **Superserve** | Sign up at the console and note your **team ID** (Settings) [S: superserve/01] | `curl -fsSL https://superserve.ai/install \| sh`, CLI ≥ 2.1.0. Run `superserve whoami --json` | Staff grant credit **per team ID from a CSV**, and **Free-plan teams are refused**. Ask the rep "trial credit or Developer code?" before upgrading [S] |
| **Mastra** | `mastra auth login` (only needed to deploy to the platform) [S: mastra/01] | **Node ≥ 22.13** (22.18 to run `.ts` directly). Pin `@mastra/core@1.80.0`. Warm the cache with a throwaway `npm create mastra@latest` and delete it [S] | The prize is platform months, not attendee credits. Studio is login-protected, but API routes are open unless you set `server.auth` [S] |
| **Builderbase** | Make an account at builderbase.com. Official copy says signup happens at check-in, but an earlier copy (written for Devpost) said to set up ahead [V] | none | Have the project blurb, repo URL and demo video plan ready |
| **YC** | YC account for the RSVP. Check email for the confirmation [V] | none | No confirmation means no entry |

## 6. Pre-event checklist

| # | When | Task | Owner | Done-check |
|---|---|---|---|---|
| 1 | Now (Thu) | Confirm the YC RSVP email. Check that every teammate is confirmed too | each person | Confirmation email in inbox |
| 2 | Now | Lock the team (≤ 4 is safe under both the Builderbase "up to 4" and the YC form's max of 5). If short, post in Agent Relay or Terse community channels, or plan to match at 10:00 | lead | Names and roles written down |
| 3 | Thu | Write a 1-page idea doc: problem, which **actors** and which **relay agents**, the "real-time" moment, a Halloween hook, a 90-second demo script, and 2 fallback ideas. **Prose only, no code** | team | Doc shared |
| 4 | Thu | Choose a stack to cover both bonus primitives: Terse actors (state) + Agent Relay (agent messaging) + one sponsor (Freestyle or Superserve VMs, or Supabase Realtime) | team | Stack line in the doc |
| 5 | Thu | Upgrade toolchains: Bun ≥ 1.4.2, Node ≥ 22.18, git, gh, Python if needed | each | `bun -v`, `node -v` |
| 6 | Thu | Install CLIs: terse, agent-relay, freestyle, superserve, supabase (v2), mastra (via npm cache) | each | `--version` on each |
| 7 | Thu–Fri | Create accounts and keys per section 5. Save them in a **team password manager**, never in chat | each | Key list complete |
| 8 | Fri | OpenAI: create the project and key. Buy $5 of credit if you plan to use GPT-Live | lead | Usage tier shows Build or higher |
| 9 | Fri | Supabase: create the org and project (US-West). Record the keys | backend | Dashboard reachable |
| 10 | Fri | Freestyle: create a shared team. Superserve: note the team ID | infra | `freestyle team current`, Superserve Settings |
| 11 | Fri | Read docs only: Terse quickstart, Agent Relay SDK README, Freestyle and Superserve gotchas. Running a quickstart in a throwaway folder and **deleting it** is fine | each | Folder deleted |
| 12 | Fri | Prepare non-code assets: logo, Halloween art, slide outline, demo-video shot list. [I] Assets are not code, but ask if unsure | design | Files ready |
| 13 | Fri | Join the Agent Relay Discord (discord.gg/6E6CTxM8um) and follow @IncTerse and @agent_relay for judge or prize announcements | each | Joined |
| 14 | Fri night | Pack: laptop + charger, power strip, phone hotspot, headphones (for voice demos), ID, costume (there is a contest) | each | Bag packed |
| 15 | Sat 10:00 | Arrive at 560 20th St. Check in with the QR code from the YC email (the page data has QR check-in on). Do the Builderbase signup. Collect credit codes. Ask: (a) are official templates OK, (b) final team-size rule, (c) Superserve credit path, (d) is there a judging rubric | lead | Answers noted |
| 16 | Sat 10:30 | Redeem codes onto the **shared** team or org accounts. `git init` a fresh repo (timestamps show the code is new). Pin package versions | infra | First commit after 11:00 |
| 17 | Sat 15:30 | Code freeze. Record a backup demo video. Write the Builderbase submission | team | Submitted before 16:00 |

---

## Hackathon implications

1. **Build for both bonuses and make each visible.** Show at least one Terse Durable Actor holding live state and at least one Agent Relay channel or DM between agents. The judging copy rewards "both" twice. Visible means a live panel of agent messages (Relay observer token) next to actor state.
2. **Two-stage judging means the written submission matters.** Builderbase screens before the live demo. Write a crisp title, a one-line pitch that names "Durable Actors + Agent Relay", a 60–90 s video and a working URL.
3. **Grand-prize sponsors are Freestyle ($10k) and Superserve ($1k), plus OpenAI and Mastra.** [I] Using one VM sponsor for the agents' "computers" helps the grand prize story and aligns with three of the sponsors.
4. **Supabase's "scale to millions" prize** needs an explicit scaling story (Broadcast channels, RLS, a load number). Pro Realtime defaults cap at 500 connections, so do not run a "1,000 bots" demo without checking limits [S].
5. **Expect late changes.** Judges and "more prizes" are still unannounced. Re-check the YC page and the hosts' X accounts Friday night and Saturday morning.
6. **Code rule gotcha:** a repo whose first commit predates 11:00 Saturday will look bad. Start a fresh repo at the event. Keep prep in prose.
7. **Credit-delivery gotchas:** Superserve refuses Free-plan teams. Freestyle codes land on the active team. OpenAI promo credit may not unlock GPT-Live. Each of these can cost 15+ minutes at 11:00, so ask sponsor reps during check-in.

## Limits / could not verify

- The canonical YC page returned empty content to Exa on 29 Oct. I relied on the Firecrawl capture and the YC-calendar Luma copy, which matches it.
- **Exact address:** 560 20th St comes from CompeteHub's summary and from other YC-office events. The official Luma page hides it until registration. It is very likely right, but I did not see it on an official Haunted Hacks page.
- **Team-size rule:** "up to 4" (Builderbase Luma) versus "2–4, no solos" (Manyfold) versus "we'll help you form a team" (YC visible copy) versus `max_team_size: 5` (YC page data, which governs the RSVP form, not necessarily the judging rules). No max appears in the visible YC copy.
- Section 5 (per-sponsor setup) comes from sibling files and was **not** re-verified in this fact-check pass.
- **No judges, rubric, added prizes or event Discord found.** X posts were read through a third-party mirror (teapawt.org), not x.com. View counts come from that mirror.
- Whether official templates or scaffolds count as "code created at the hackathon" has not been addressed publicly.
- How the Supabase, OpenAI and Superserve credits are redeemed is not documented for this event [S].
  - *Update 2026-10-30:* the documented mechanics and precedents for all credit sponsors are consolidated in [reference/sponsor-coverage-audit.md](../reference/sponsor-coverage-audit.md): OpenAI Promotions path and tier rule, Supabase redeem-before-upgrade, Mastra prize value, and the Superserve catalog re-check.
- I did not run the last30days skill. The social footprint is small (six posts over 19–22 Oct), and the direct searches above covered it.

## Sources

- YC event page (canonical): https://events.ycombinator.com/haunted-hacks-2026 (via ../../EVENT_PAGE.md)
- Luma, YC calendar: https://luma.com/yc-meetup-7183-9316f87f
- Luma, Builderbase Hackathons: https://luma.com/builde-oxba
- Builderbase event: https://builderbase.com/event/haunted-hacks-2026 ; register path https://builderbase.com/event/haunted-hacks-2026/register
- Hackathon Radar (Devpost-sourced): https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026
- Hackathon Radar (Builderbase-sourced): https://www.hackathonradar.com/database/hackathon/haunted-hacks-real-time-ai-edition-2026
- BuildJams: https://jams.shippedby.app/events/haunted-hacks-realtime-ai-edition/
- CompeteHub: https://www.competehub.dev/en/competitions/luma5817b434236ee51fb67bb836e92f8ac6 ; https://www.competehub.dev/en/competitions/lumab9b15b9eb9cf3521b8c9d05e0ab34cbe
- Manyfold: https://data.manyfold.ai/ai-hackathons/r/rec_01m5gbs14057m4p16f9azveak8
- Hackface: https://hackface.dev/hack/552086475580286752
- HackList SF: https://luma.com/hacklist-sf
- Khaliq Gant on X (mirror): https://teapawt.org/Khaliqgant/status/2112219340422721818
- Thomas Karatzas on X (mirror): https://teapawt.org/karatzas_thomas/status/2112219511327965403
- Olivier Simard-Morissette on X (mirror): https://teapawt.org/oliviersm199/status/2113069849341767743
- Thomas Karatzas, LinkedIn: https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0
- Paul Jump, LinkedIn: https://www.linkedin.com/posts/paul-jump_haunted-hacks-real-time-ai-edition-activity-7518313439392387074-oiYp
- Will Washburn, LinkedIn: https://www.linkedin.com/posts/willwashburn_haunted-hacks-real-time-ai-edition-activity-7518360737891725312-jOLX
- Agent Relay Launch YC (23 Oct): https://www.ycombinator.com/launches/WI4-agent-relay-let-your-teams-coding-agents-message-each-other
- Background, YC-office hackathon rules precedent: https://luma.com/hzwlapu0
- Superserve LinkedIn post, 30 Jul 2026 (background): https://www.linkedin.com/posts/super-serve-ai_activity-7488676422224551937-f1zo
- Abhinav Garg LinkedIn, 16 Aug 2026 (background, Superserve $500 2nd place): https://www.linkedin.com/posts/abhinav-garg-12b9343b5_my-team-and-i-just-won-500-at-the-zero-human-activity-7494806275881459712-Pp3C
- Terse and Agent Relay X timelines (mirror): https://teapawt.org/IncTerse ; https://teapawt.org/agent_relay
- Sibling files (setup details with primary citations): ../terse/01-docs-api.md, ../agent-relay/01-docs-api.md, ../agent-relay/04-social-pulse.md, ../openai/01-docs-api.md, ../supabase/01-docs-api.md, ../freestyle/01-docs-api.md, ../superserve/01-docs-api.md, ../mastra/01-docs-api.md

## Verification log (2026-10-29)

Adversarial re-check of the most decision-relevant claims against live sources. Tools: Luma MCP (`lookup_entity`, `get_event`), Exa fetch/search, `curl` of the raw YC page HTML.

| # | Claim | Check | Outcome |
|---|---|---|---|
| 1 | Official copy: 5 sponsors, 4 credit grants, grand prize + $10k Freestyle + $1k Superserve, Builderbase judging, "Judges will be announced soon" | Luma MCP `get_event` evt-mXzvj4hJK4jkhRG (`description_md`) + `curl` of the YC page | **Confirmed**, word for word |
| 2 | Venue is 560 20th St, SF 94107 | CompeteHub luma5817… page; Luma API `full_address` on the 2025 YC-office event hzwlapu0 | **Confirmed as very likely.** Not printed on any official Haunted Hacks page (Luma location obfuscated, YC shows "San Francisco, CA, USA") |
| 3 | Team size "up to 4" | Exa fetch of luma.com/builde-oxba | **Confirmed** on that listing. **Correction added:** the YC page data has `max_team_size: 5` and `has_team_applications: true` |
| 4 | Manyfold "2–4, no solos" | Exa fetch of the Manyfold record | **Confirmed it exists** (read 22 Oct, credited to events.ycombinator.com). Still not in any official copy, so it stays unverified as a rule |
| 5 | Builderbase schema.org: 17:00Z–01:00Z, organizer "Agent Relay", price 0; register path is marketing copy | Exa fetch of both URLs | **Confirmed** |
| 6 | Hackathon Radar Devpost copy says "We will be using devpost! … set up your account ahead" and the grand prize had no Freestyle or Superserve | Exa fetch | **Confirmed.** It also lists the Supabase $1k, consistent with "unchanged across phases" |
| 7 | Devpost page is gone | `curl -I` haunted-hacks-realtime-ai-edition.devpost.com | **Confirmed**: HTTP 404 |
| 8 | Khaliq Gant, Thomas Karatzas, Olivier S-M X quotes and timestamps | teapawt mirror fetches | **Confirmed** verbatim. Olivier's post shows 1,105 views. Added Karatzas' 2,471 |
| 9 | LinkedIn quotes (Karatzas, Paul Jump, Will Washburn) | Exa fetch | **Quotes confirmed.** Karatzas' "18 reactions" could not be re-seen and is marked unverified (Paul Jump 12 reactions, Washburn 5) |
| 10 | No event posts from 23–29 Oct; Launch YC on 23 Oct doesn't mention it | Exa fetch of Launch YC (published 2026-10-23T15:00Z); teapawt @IncTerse and @agent_relay timelines | **Confirmed** |
| 11 | Agent Relay Discord discord.gg/6E6CTxM8um | `curl` agentrelay.com and grep | **Confirmed**: the link is on the homepage |
| 12 | Precedent rules quotes from luma.com/hzwlapu0 ("You may not use any code written before the event", pre-planning, up to 4) | Luma MCP `get_event` | **Confirmed.** Event date (9 Aug 2025) and co-hosts added |
| 13 | Superserve 30 Jul LinkedIn "prizes for the best use of Superserve" | Exa search | **Confirmed.** The vague company-page URL was replaced with the exact post URL |
| 14 | YC-calendar Luma "Registration Closed" | Luma MCP | **Confirmed in substance**: `registration_availability: "sold-out"`, approval required |
| 15 | No judges or extra prizes announced | YC HTML grep + Luma description | **Confirmed** as of 29 Oct |

New facts added: YC capacity 225, QR check-in, LinkedIn required on the RSVP, `max_team_size` 5. No fabricated quotes or URLs were found. All quoted text matched its live source.
