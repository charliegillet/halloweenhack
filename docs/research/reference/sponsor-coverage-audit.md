# Sponsor coverage audit: credits, pricing, setup and freshness (all 7 sponsors)

> **Checked 2026-10-30, 06:20-06:45 UTC (Thu 29 Oct night, Pacific).** This is a completeness pass over the seven sponsor master briefs (`terse.md`, `agent-relay.md`, `openai.md`, `supabase.md`, `mastra.md`, `freestyle.md`, `superserve.md`), their 35 sub-files, and the per-sponsor setup table in `event-people/03-event-listings-logistics.md` §5. The benchmark was the scopewatch layout (`docs/sponsors/SPONSOR_STRATEGY.md` plus dated raw snapshots in `references/`).
> Method: grep every sponsor's "Limits / could not verify" list, then try to close each item with primary sources: `npm view`, `gh api`, `curl` on public billing endpoints, Exa fetches of docs and help-center pages, and precedent from other 2026 hackathons. **[V]** = verified on a primary source in this pass. **[P]** = precedent from another event, which shows how a sponsor *usually* does it but is not proof for Haunted Hacks. **[I]** = inference. **[BG]** = background from before Aug 2026.

---

## 1. Verdict: what was already covered and what was missing

The per-sponsor research is deep and current. Every master brief has product surfaces, a pricing table, dated features from Aug-Oct, setup steps, gotchas and a limits section. Version data was refreshed as late as 30 Oct 05:30 UTC. **Only one sponsor area was thin: how each credit is actually delivered and what it pays for.** All four credit sponsors had "credit mechanics unverified" in their limits section, and nothing tied the pieces together. This file closes most of that gap. It does not repeat the briefs.

| Sponsor | Surfaces | Pricing | Credit delivery | Newest features | Setup | Gap closed here |
|---|---|---|---|---|---|---|
| Terse | ✔ | **None published** (re-checked) | No credits | ✔ to 30 Oct 05:30Z | ✔ | Re-check only (§2.5) |
| Agent Relay | ✔ | Plan table from source; no pricing page (404 re-checked) | No credits | ✔ | ✔ | Re-check only (§2.6) |
| OpenAI | ✔ | ✔ | **Was unverified** | ✔ | ✔ | **Redemption path, tier rule, negative balance (§2.1)** |
| Supabase | ✔ | ✔ | **Was unverified** | ✔ | ✔ | **Credits-to-invoice mechanics, $25 maths, code-preview flow (§2.2)** |
| Mastra | ✔ | ✔ | Prize tier unknown | ✔ | ✔ | **Credit-pool precedent, prize value (§2.3)** |
| Freestyle | ✔ | ✔ (re-checked, unchanged) | ✔ (`FS-` code, CLI source) | ✔ | ✔ | Re-check only (§2.7) |
| Superserve | ✔ | ✔ (3 catalogs) | ✔ runbook, event not named | ✔ | ✔ | **Live catalog re-check at 06:29Z, new commit #860 (§2.4)** |

---

## 2. Findings from this pass

### 2.1 OpenAI: how the $100 arrives and why it still won't unlock GPT-Live

- **Redemption path [P, OpenAI-authored guide].** A participant guide for MunichTech EXPO (20-22 Sep 2026), authored by OpenAI and "Official links checked 17 September 2026", gives the 2026 voucher flow. Sign in to the Platform, **select the API organization that should receive the credits**, then open **Settings > Billing > Promotions**, enter the voucher and confirm. Codes are **single-use** and have a **7-day redemption window from creation**. At that event the API credit was "valid for 60 days after redemption". That event also handed out a separate ChatGPT/Codex code (`chatgpt.com/codex/p/CODE`), which "do[es] not upgrade your subscription or unlock additional model access". If Haunted Hacks gives you two codes, the ChatGPT one does nothing for your API key.
- **Promo credit does not count toward a usage tier [V].** The rate-limits guide says "Your organization's usage tier upgrades automatically as its total credit **purchases** reach each threshold": Build at $5, Launch at $100, Grow at $500. The help article "Troubleshooting API usage and spend limits" says the same ("total credit purchases reach $5, $100, and $500"). No OpenAI page says a promotional grant counts. On the developer forum, regulars report that the tier is only recalculated **when a new purchase is made** [S, forum, single regular plus a staff acknowledgment that "some accounts only refresh on a later successful credit purchase"]. **Conclusion [I, strong]:** the $100 voucher alone leaves the org on **Free**, where `gpt-live-1` is listed as unsupported (openai.md §Executive summary #4). **Buy $5 with a card on the same org before Saturday.** If you already bought credits earlier and the tier still shows Free, a fresh $5 purchase forces the recalculation.
- **No card is needed to spend a promo grant [V].** OpenAI's help article on the ChatGPT-subscriber API benefit says: "You do not need to add an API payment method to use an active promotional grant." It also says "Promotional credits are used before purchased API credits." So the $5 you buy is not burned first. It sits behind the $100.
- **The prepaid balance is not a hard stop [V].** The prepaid-billing help article says: "API access may not stop immediately after your credits run out. Usage processed during this delay can appear as a negative credit balance… Do not rely on the prepaid balance as an instantaneous spending cutoff." Auto-reload is **on by default** during the first purchase. **Turn it off** when you buy the $5, and set a project hard spend limit (openai.md "Before Friday night" #2).
- **Per-person vs per-team [P].** At OpenAI Build Week (Devpost), "$100 in free credits" was ruled to be per *Entrant*, meaning per team, not per member. Haunted Hacks explicitly says "$100 in OpenAI API credits **per participant**" [V, event page], so expect one code per person. Pool them by redeeming everyone's code into **one shared org** [I]. The guide's rule of "select the organization that should receive the credits" makes the target org a one-time choice per code.
- **ChatGPT Pro shortcut [V].** A teammate who has paid for ChatGPT Pro for at least 7 days can link it to an API org they own and get **$100-$500 per month** of API credit. That credit covers GPT-Live, Realtime, Decisions and the Agents API. It is a legitimate pre-event top-up if the vouchers are late.

### 2.2 Supabase: what the $25 actually pays for

- **Credits pay future invoices, not current ones [V, docs `platform/credits`].** "Credits are applied to future invoices… As long as the credit balance is greater than $0, credits will be used before charging your payment method on file." Credit top-ups "cannot be used to pay or adjust outstanding invoices." The Billing FAQ adds that the plan fee is **charged upfront at the start of each billing cycle** and usage is charged in arrears.
- **Order matters [I from the above].** Redeem the code **first** and upgrade to Pro **second**. Then the $25 Pro fee should come out of the credit balance and not your card. If you upgrade first, the first Pro invoice is already issued and the credit only applies to next month.
- **$25 = exactly one Pro month for one project [V, Billing FAQ].** "Each paid organization comes with $10 in Compute Credits to cover one project on the default compute size. Additional projects start at ~$10 a month (billed hourly)." So one Pro org with **one** Micro project costs $25, which the credit covers in full. A second project (for example a "staging" or load-test project) adds about $10 that the credit does not cover. **Keep the hackathon to one project** [I].
- **The redemption UI previews before charging [V, PR #42377, merged 4 Feb 2026].** The billing-settings modal previews "credit amount, expiration date, and potential charges before redemption". It uses invisible **hCaptcha**, and the redeem/preview API has "pretty hard rate limits (10ish per hour)" (maintainer comment on the PR). **Do not fat-finger the code repeatedly at the venue**, and avoid sharing one IP-heavy hotspot across 4 people all retrying [I]. The `/redeem` → `/dashboard/redeem` route answered 200 again at 06:29Z.
- **How codes reach attendees [P].** Supabase's own hackathon platform (hackathon.supabase.com, used for Select 2026 at YC on 3 Oct) has an admin "Promo codes" feature: a sponsor uploads a CSV of codes, and each participant gets **their own code by email** through a `{{shortcut}}` in a message. At PowerSync's March 2026 hackathon, "$25 Supabase credits" for every participant were handed out on request by email. **Expect a per-person code by email or at check-in, not an automatic grant** [I]. Haunted Hacks uses Builderbase, not Supabase's platform, so the delivery channel is unconfirmed.
- **Cards and transfers [V, Billing FAQ].** Only credit cards are accepted. Credits can be moved between orgs only by **support ticket**, which is too slow on the day. Redeem into the org that will host the demo.

### 2.3 Mastra: what "N months of Mastra Platform" is likely worth

- **The platform bills from one credit pool [V, blog 17 Jul 2026, BG].** "Everything runs on a single pool of credits, including model and token spend… Top up on credits whenever you need, or set an auto-top-up." Starter is free, with allowances. Teams is $250/month (pricing page re-fetched 06:30Z; unchanged from mastra.md §2c).
- **Mastra does give dollar credits at SF hackathons [P].** At "Build Personal Agents Hack" (SF, 4 Oct 2026, co-hosted by Mastra with Neon, Exa, Fly.io and others), every attendee could claim "**$25 Mastra credits**", and 1st/2nd/3rd place won "**$5k / $3k / $1k Mastra credits**". Haunted Hacks words its prize differently ("3/2/1 months free of Mastra Platform"). The likeliest reading is Teams months: **$750 / $500 / $250 face value** [I]. Haunted Hacks offers **no** attendee Mastra credit [V, event page].
- **Sign-up bonus [unconfirmed].** Exa's index of `gateway.mastra.ai/sign-up` shows "Sign up with any email. Get $5 in credits with a work email." A live fetch at 06:35Z got only the title (the page is a JS app), so this is **not live-verified**. If it's true, sign up with a work email so the Memory Gateway or hosted LibSQL has a cushion. mastra.md already says to keep model spend on your own `OPENAI_API_KEY` and not the `mastra/` gateway prefix (+5.5%).
- **Action:** create the Platform account before Saturday (`mastra auth login`) so the prize has somewhere to land. Ask the Mastra rep whether the prize is Teams or a credit equivalent.

### 2.4 Superserve: the live catalog at 06:29Z, 30 Oct

- `GET api.superserve.ai/billing/plans/public` [V, 06:29Z] still returns **Free / Starter / Pro / Enterprise**. **No Developer plan** and no trial card yet. Free: `max_concurrent 1`, $0.1332/day allowance, `on_exhausted: pause`, 0 templates. **Starter** (prepaid from $5): 100 concurrent, 2 vCPU / 4 GiB / 50 GiB, 10 templates, `display_only: false`. Pro: $250/month including $250, 1,000 concurrent, 8 vCPU / 32 GiB. `signup_admission.entry_open: true`. Rate card unchanged: vCPU $0.0504/h, GiB $0.0162/h, storage `billable: false`.
- **Contradiction to note [V]:** console PR #457 (29 Oct 23:27Z) "hide[s] Starter from new purchases and send[s] Starter links to Developer", but the public catalog API still lists Starter as purchasable. The event-credit runbook **refuses Starter teams** ("Unverified, under test"; superserve.md §3.4). **Don't buy Starter to dodge the 1-VM cap.** It may make your team ineligible for the $100.
- New backend commit since the brief: `superserve-ai/sandbox` #860 (30 Oct 04:23Z), "settle checkouts while invoice enrollment is still recording its rounding item". This is billing plumbing for the Developer launch, which suggests checkout changes are still landing the night before [I].

### 2.5 Terse: still no pricing, docs unchanged

- `useterse.ai/pricing` renders the homepage (Exa, 06:30Z). The only plan language is "Terse Cloud: managed hosting" plus `bunx terse-cli@latest install`. `docs.useterse.ai/llms.txt` still lists **4 pages** (Quickstart, Concepts, CLI, TypeScript Reference). There is still no pricing, quota or Python page [V].
- Versions [V, 06:29Z]: `terse-cli` / `terse-sdk` **0.14.7**, `durable-actors` npm and PyPI **0.14.4**, GitHub Latest **v0.14.4** (29 Oct 12:44Z). PR #370 (Drizzle ORM, `db.query`/`db.transaction`) is **open**. PR #371 (nested transactions) was **closed without merging** at 05:01Z. Do not code against either.

### 2.6 Agent Relay

- npm [V, 06:29Z]: `agent-relay` / `@agent-relay/sdk` `latest` = **14.0.0**, `next` = **15.0.0-next.5** (published 05:30Z). `@relaycast/sdk` 12.2.1. GitHub: `probe-v15.0.1` "Agent Relay core" (04:48Z) is a binary that `relay init` downloads and checks against `.sha256` sidecars. It ships for darwin, linux **and windows-x64**. GitHub "Latest" is still v14.0.0. `agentrelay.com/pricing` → **404** (re-checked). This matches agent-relay.md, so no edits were needed.

### 2.7 Freestyle

- `freestyle.sh/pricing.md` re-fetched at 06:31Z: unchanged from freestyle.md §3.3. That covers plans, rates, the free allowances that act as hard caps on Free, the refunded $1 card verification, and the provisioned-resource budget table (Free: 40 vCPU / 80 GiB / 320 GB across 10 saved VMs). `freestyle` npm is still **0.2.21** (29 Oct 23:02Z).

---

## 3. Version snapshot to pin (npm and gh, 2026-10-30 06:29Z)

| Package | `latest` | Avoid |
|---|---|---|
| `terse-cli` / `terse-sdk` | 0.14.7 | mixing in `durable-actors` imports |
| `durable-actors` (npm, PyPI) | 0.14.4 | — |
| `agent-relay`, `@agent-relay/sdk` | 14.0.0 | `@next` 15.0.0-next.5 |
| `@relaycast/sdk` | 12.2.1 | — |
| `openai` (npm) | 7.45.1 | `next`/`beta` tags (stale 4.x/5.x prereleases) |
| `@openai/agents`, `@openai/agents-realtime` | 0.21.0 | — |
| `supabase` CLI | 2.122.0 | `beta` 3.0.0-beta.15, `next` 3.0.0-next.27 |
| `@supabase/supabase-js` | 2.118.0 | `canary` 2.119.0-canary.4, `next` 3.0.0-next.29 |
| `@mastra/core` / `mastra` | 1.80.0 / 1.36.0 | 1.81.0-alpha.x (29 Oct) |
| `@mastra/voice-openai-realtime` | 0.14.8 | — |
| `freestyle` | 0.2.21 | `freestyle-sandboxes` (deprecated) |
| `@superserve/sdk` | 0.11.5 | — |

Re-run `npm view <pkg> dist-tags` on Saturday at 10:30. Terse shipped 4 CLI releases on 29 Oct alone.

---

## 4. Still unverifiable: one consolidated list to ask at check-in (10:00-10:45)

| Sponsor | Question | Why it matters |
|---|---|---|
| OpenAI | Voucher per person? Redemption deadline and expiry? | 7-day redemption windows are normal [P]; redeem on Saturday, not later |
| Supabase | Code by email or at the desk? Does redeeming need a card on file? | Redeem before upgrading (§2.2) |
| Freestyle | Does the `FS-` code carry a `planGrant` (Hobby)? | Free never bills, so credits only matter on a paid plan or with a grant (freestyle.md §10) |
| Superserve | Trial credit or a 100%-off Developer code? Where do team IDs go? Do trial teams stay at 1 VM? | Upgrading after the credit lands zeroes it (superserve.md §3.4) |
| Mastra | Is the prize Teams months or a credit equivalent? | $750 vs ~$0 of real value |
| Terse | Will hosted quotas (500 actors, 50 starts/s) be raised for teams? Is there any Terse Cloud credit or limit? | No pricing or quota page exists |
| Agent Relay | Will workspaces be upgraded from `free` (5 agents, 10k msgs/mo) for the day? | Swarm demos can hit 5 agents |
| All | Judges and "more prizes" are still unannounced (event page CRAWL_EMPTY to Exa at 06:30Z; Builderbase JSON-LD unchanged and still omits Superserve) | Re-check Friday night |

---

## 5. Hackathon implications

1. **Thursday/Friday billing setup (about 20 minutes, worth it):**
   - **OpenAI:** buy **$5** on the org you will redeem vouchers into, **turn off auto-reload**, and set a project hard limit. Confirm the Limits page shows **Build** and make one real `gpt-live-1` call. The $100 voucher alone very likely keeps you on Free.
   - **Supabase:** one org and **one** project. On Saturday, **redeem the code, then upgrade to Pro**, never the other way round. Don't create a second project.
   - **Mastra:** create the Platform account (work email if you have one).
   - **Freestyle:** create the shared team.
   - **Superserve:** note the team ID and **do not buy Starter**.
2. **Pool credits deliberately.** Choose one "billing captain" org or team per sponsor (OpenAI org, Supabase org, Freestyle team, Superserve team) and redeem everyone's codes into it. OpenAI voucher targets and Supabase credits can't be moved quickly afterwards (Supabase transfers need a support ticket).
3. **Real budget ≠ face value.** OpenAI $100 per person is real. Supabase $25 is one Pro month, not usage. Freestyle $100 may be useless on Free without a plan grant. Superserve $100 depends on plan state. Mastra and Terse give nothing at entry. Design the demo so that **Free tiers alone could run it** (Freestyle Free = 10 VMs; Superserve Free = 1 VM; Agent Relay free = 5 agents), and treat credits as headroom.
4. **What judges and sponsors see:** the hosts score Durable Actors + Agent Relay. Credit sponsors are paying for usage, so a visible OpenAI GPT-Live front end, one Freestyle *or* Superserve VM per agent, and a Supabase "scale" story each make a sponsor's rep happy without diluting the host story. Don't pit Freestyle against Superserve on stage (superserve.md §2).
5. **Gotcha reminders surfaced by this pass:**
   - OpenAI balances can go negative.
   - Supabase redemption is rate limited (~10/h) behind hCaptcha.
   - Superserve checkout code was still changing at 04:23Z on 30 Oct.
   - Terse PR #371 was closed, so nested transactions are not coming.
   - Agent Relay `next` moved again at 05:30Z.

---

## 6. Sources

Primary, fetched 2026-10-30 UTC unless noted:
- OpenAI rate limits / usage tiers: https://developers.openai.com/api/docs/guides/rate-limits
- OpenAI Help, troubleshooting usage and spend limits: https://help.openai.com/en/articles/6614457-troubleshooting-api-usage-and-spend-limits
- OpenAI Help, prepaid API billing (negative balance, auto-reload default): https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing
- OpenAI Help, API credits for ChatGPT subscriptions ("no API payment method", promo before purchased): https://help.openai.com/en/articles/20001626-api-credits-benefit-for-eligible-chatgpt-subscriptions and https://developers.openai.com/api/docs/guides/chatgpt-api-credits
- OpenAI-authored MunichTech participant guide (Sep 2026) [P]: https://munichtechexpo.com/downloads/openai-hackathon-credits-guide.pdf
- OpenAI Build Week rules and per-team credit ruling [P]: https://openai.devpost.com/rules and https://openai.devpost.com/forum_topics/44351-are-the-100-openai-credits-provided-per-team-member-or-per-team
- OpenAI forum on tier recalculation [S]: https://community.openai.com/t/api-account-active-for-two-months-but-still-tier-1/1377973 and https://community.openai.com/t/how-can-i-upgrade-from-tier-1-to-tier-2/1368671
- Supabase credits doc: https://supabase.com/docs/guides/platform/credits
- Supabase Billing FAQ: https://supabase.com/docs/guides/platform/billing-faq
- Supabase credit-code redemption PR #42377: https://github.com/supabase/supabase/pull/42377
- Supabase hackathon platform docs (promo codes) [P]: https://hackathon.supabase.com/docs · index: https://hackathon.supabase.com/
- PowerSync AI Hackathon ($25 Supabase credits on request) [P]: https://powersync.com/blog/powersync-ai-hackathon-8k-in-prizes
- Mastra pricing: https://mastra.ai/pricing · pricing blog (17 Jul 2026) [BG]: https://mastra.ai/blog/mastra-platform-pricing · sign-up (Exa index only): https://gateway.mastra.ai/sign-up
- Build Personal Agents Hack, SF, 4 Oct 2026 (Mastra credits) [P]: https://luma.com/build-agents
- Superserve live catalog: https://api.superserve.ai/billing/plans/public · rate card: https://api.superserve.ai/billing/pricing/public · marketing: https://superserve.ai/pricing
- Superserve commits: https://github.com/superserve-ai/sandbox (#857, #860) · https://github.com/superserve-ai/superserve (#452, #457)
- Terse: https://www.useterse.ai/pricing · https://docs.useterse.ai/llms.txt · https://github.com/TerseAI/durable-actors/releases · PRs https://github.com/TerseAI/durable-actors/pull/370 and /371
- Agent Relay: https://github.com/AgentWorkforce/relay/releases/tag/probe-v15.0.1 · https://agentrelay.com/pricing (404)
- Freestyle pricing: https://www.freestyle.sh/pricing.md
- Builderbase event page: https://builderbase.com/event/haunted-hacks-2026 · YC event page: https://events.ycombinator.com/haunted-hacks-2026 (empty to Exa)
- npm registry: `npm view <pkg> version dist-tags time` for every package in §3

## Limits / could not verify

- No code was redeemed and no account was charged. The "redeem before upgrading" order for Supabase is an inference from documented invoice behaviour and was not tested.
- The OpenAI redemption path comes from a different event's OpenAI-authored guide (Sep 2026). Haunted Hacks could use org-ID grants instead (the Codex Community Hackathon in Hyderabad collected `org-` IDs on a form) [P].
- That promo credit does not lift the usage tier is inferred from the "purchases" wording plus forum reports. No OpenAI page says so in as many words.
- The Mastra "$5 with a work email" text is from Exa's index only.
- Judges and added prizes: still unannounced as of 06:45Z on 30 Oct.
