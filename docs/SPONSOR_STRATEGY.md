# Haunted Hacks sponsor strategy

Prepared **29 Oct 2026 (PT)**. Evidence-gated plan: **no integration has been run on the event stack, no credit has been redeemed, and no number below was measured by us.** Facts come from the master briefs in [`research/`](research/SOURCE_RESEARCH_INDEX.md); each row cites its brief. [V] = verified in that brief against a primary source; [I] = inference.

The organizing rule: **the hosts (Terse, Agent Relay) score the project; the credit sponsors (OpenAI, Supabase, Mastra, Freestyle, Superserve) are paying for usage.** Every sponsor we add must do a job a judge can see, and none may compete with the actor or the Relay channel for the hero beat ([research/reference/INTEGRATION_COOKBOOK.md](research/reference/INTEGRATION_COOKBOOK.md) §1).

## 1. Prize math

Face values from [reference/prize-stacking-and-ev.md](research/reference/prize-stacking-and-ev.md) §2 [V unless marked].

| Prize | What | Face value | Who likely picks [I] | Requirement |
|---|---|---:|---|---|
| Overall 1st | Guaranteed YC interview + $5k OpenAI + $10k Freestyle + $1k Superserve + 3 mo Mastra Platform | ~$16.75k credits + interview | Full panel from the top-8 live demos | "Very well-executed products or incredibly creative use cases using Durable Actors and Agent Relay" |
| Overall 2nd | $2.5k OpenAI + 2 mo Mastra | ~$3k | same | same |
| Overall 3rd | $1k OpenAI + 1 mo Mastra | ~$1.25k | same | same |
| Durable Actors track | iPhone Duo | **$1,999+** (256 GB base) | Terse (Karatzas, Simard-Morissette) | Best project using Durable Actors |
| Agent Relay track | Mac mini | **$899+** (M6 base) | Agent Relay (Washburn, Gant) | Best project built with Agent Relay |
| Supabase special | $1K credits | $1,000 | Supabase attendee or hosts (unknown) | "Most likely to scale to millions"; Supabase use not stated as required, assume expected |
| Costume contest | Bragging rights | $0 | — | Wear one |
| Per attendee | $100 OpenAI, $25 Supabase, $100 Freestyle, $100 Superserve | $325 face | — | Delivery mechanics vary (§4) |

**What the money really is [I]:**
- The **YC interview** is the prize; credits only pay off if we keep building on those vendors. The W27 on-time deadline is **Mon 2 Nov, 8pm PT** [V]; draft an application beforehand.
- The **iPhone Duo is the most valuable non-credit prize** (more than twice the Mac mini). It sold out at launch (23 Oct), so a winner may get a later shipment [V/I].
- **Freestyle's $10k** is 2/3 of the grand prize's dollar value but only matters if Freestyle is in the stack after Saturday.
- **Mastra Platform months** are ~$250/month if the Teams tier [I]; worthless if no one uses Mastra later.

**Stacking:** no rule is published. At the three most similar YC-office events (Bitrig 26 Sep, Select 3 Oct, MSAW 17-18 Oct), visible track winners were different teams from overall winners, which fits (but does not prove) a spread-the-prizes norm [V]. Plan stance: **one track prize is the floor; overall is upside; Supabase's $1K is the most likely to stack informally** because a sponsor attending usually picks its own winner [I]. Ask at check-in: "Can a project win overall *and* a track prize?"

**Illustrative expected value (pure guesswork, for ranking only).** With ~50-75 submissions and ~6 judged prizes [I], the base rate of winning anything is ~10%. Using both host technologies puts a team in every pool. If a strong both-hosts entry had, say, a 20% shot at the iPhone, 10% at the Mac mini, 10% at Supabase and 5% at overall 1st, the hardware/credit EV is roughly $400 + $90 + $100 + ~$840 in credits, and the interview dominates any of it. The point is relative, not absolute: **the iPhone Duo track and the overall prize reward the same hero beat, so build one moment that sells both.**

## 2. What each sponsor wants, and credible integration depth

"Credible" means a judge can see the sponsor doing load-bearing work in the 2-minute demo or the write-up. "Decorative" means the sponsor is named but replaceable by anything.

### Terse (host; iPhone Duo; no credits)
- **Wants [I, from their demos and words]:** the actor as backbone, not a cache. Visible persisted + emitted state, serialized calls ("one request at a time"), WebSocket grants, alarms firing while dormant, kill-and-resume, a deployed **Terse Cloud URL** (not localhost), the actor browser on a second screen. Their vocabulary: "army of little servers", "per-actor SQLite", "configurable compute" ([terse.md](research/terse.md) §8, [event-people.md](research/event-people.md) §10).
- **Credible depth:** an authoritative actor with **no LLM inside** that makes a race impossible (the founding bug: "10 agents on shared Postgres state got stale snapshots", [terse.md](research/terse.md) §1.1), plus an alarm doing a job with every tab closed, plus `prepareWebsocket` grants to many phones. Copy Whitechapel's reserve → claim → commit pattern for anything that touches an LLM ([landscape-actors/04](research/landscape-actors/04-actor-patterns-for-ai.md) P3).
- **Decorative:** storing JSON in an actor; a single actor used as a key-value store.
- **Never:** pitch latency (85.6 ms p95 self-reported); clone the Victorian murder mystery; ship `TERSE_API_KEY` to the browser; pitch "open source vs closed Cloudflare" ([landscape-actors.md](research/landscape-actors.md) box #7).

### Agent Relay (host; Mac mini; no credits)
- **Wants:** real, visible, autonomous peer-to-peer traffic, ideally **heterogeneous** (OpenAI + Claude + Mastra), shown live through an **observer URL** (`ot_live_*`), with no faked messages ("both founders dogfood heavily and will spot fakes"). Something native Claude messaging cannot do: offline catch-up from durable messages, or two people's agents dealing. Least privilege shown explicitly. A deterministic gate or reviewer that cannot write (Khaliq's "narrow path") ([agent-relay.md](research/agent-relay.md) §8, [event-people.md](research/event-people.md) §2).
- **Credible depth:** DMs and group DMs carrying content the plot depends on; Zod-typed `registerAction` for the consequential verbs; durable delivery to an agent killed mid-demo; Relay history mined for a reveal. Say "messaging infrastructure", not "multi-agent framework".
- **Decorative:** one orchestrator calling workers in a loop ("judges see a for-loop"); agents that only chat; using Relay as a log pipe.
- **Never:** call the project "Relay" (three unrelated 2026 winners use it); depend on `relay init` (v15 only) or the broker/PTY spawn layer; put `rk_live_*` on screen.

### OpenAI (credit sponsor; $100/person + top-3 credits; no track)
- **Wants:** current APIs: GPT-Live client delegation, the Decisions API (GA 22 Oct), Responses-API tool use on Sol/Terra, the Agents SDK. Agent-safety signals: message provenance, scoped permissions, budget cap, kill switch ([openai.md](research/openai.md) §7).
- **Credible depth for us:** `gpt-6-luna` Decisions for sub-second typed choices (bid/no-bid, "is this whisper safe for the projector?", "is this claim consistent?"), output free, ~$0.0002/call; `gpt-6.1-sol` or `-terra` for the few agents that need strategy. Optional GPT-Live narrator (one session only).
- **Gotchas:** GPT-Live is unsupported on Free tier; the promo voucher very likely does not lift the tier; buy $5 on the demo org, **turn off auto-reload**, set a hard project limit; balances can go negative ([sponsor-coverage-audit](research/reference/sponsor-coverage-audit.md) §2.1). Never use Assistants, legacy realtime models, `gpt-4o*`.

### Supabase (credit sponsor; $25/person; $1K "scale to millions")
- **Wants:** builds that actually run with real auth and data; "Broadcast, not Postgres Changes" said out loud; RLS on every table; honest labelled numbers; a load readout and *where it breaks* (the only precedent winner explained "why it broke") ([supabase.md](research/supabase.md) §8, [past-winners.md](research/past-winners.md) §10).
- **Credible depth:** anonymous sign-in for audience phones; server-side `channel.httpSend()` Broadcast fan-out to a private RLS channel (servers never subscribe); a rollup/settlement table that answers "how do you query across actors?" (the HN critique of Terse); a 200-400-client load script within Pro limits.
- **Decorative / harmful:** a table nobody sees; **casting a Supabase row as the villain** in a race-condition split screen (the Supabase DevRel persona docked several ideas for this). If we show a naive baseline, run it on a plain in-process store with a labelled LLM-length delay and say "any store without a lock", not "Postgres".
- **Gotchas:** GRANT + RLS in migration #1 (Data API GRANT enforced 30 Oct); pin CLI 2.122.0 and supabase-js 2.118.0; one project only; redeem code *then* upgrade to Pro; spend cap on unless the load test needs >500 sockets (~$20 per 2,000).

### Mastra (credit sponsor; Platform months for top 3; no attendee credit)
- **Wants:** named agents, tools, Studio traces on a second screen; GA names (Agent Controller, Signals, Goals); Bhagwat's framing "a relay of processes passing a record between them" ([mastra.md](research/mastra.md) §9).
- **Credible depth for us:** at most **one** heterogeneous agent built as a Mastra `Agent` with a `createTool` wrapper around the Relay SDK (not the MCP bridge), so the Relay channel shows OpenAI-SDK + Mastra + Claude peers. State stays in the actor, never Mastra Memory.
- **Cut first** if behind. Pin `@mastra/core@1.80.0`.

### Freestyle (credit sponsor; $100/person + $10k in grand prize; no track)
- **Wants:** long-running stateful VMs, snapshot-and-branch, edge-injected secrets, live terminals, `*.style.dev` URLs. Will not reward "a 2-second code runner or a web host" ([freestyle.md](research/freestyle.md) §11).
- **Honest fit for our top ideas:** weak. Its one natural job is hosting a **public HTTPS bridge** for Relay subscription webhooks, which is exactly what Freestyle says not to use it for (production hosting). Our default bridge is an SDK listener process that needs no public URL. **Recommendation: skip unless a chosen idea needs sandboxes** (software-factory ideas). If used: YC **S24** (never say F24), firewall required, 30 s exec timeout, Free = 10 VMs.

### Superserve (credit sponsor; $100/person + $1k in grand prize; no track)
- **Wants:** VMs not containers; pause-with-memory, fork, secrets broker, egress block + out-of-VM log, live desktop stream; acting agent separate from verifying agent (TalosAI) ([superserve.md](research/superserve.md) §11).
- **Honest fit:** none of our top three needs a sandbox. Billing is mid-relaunch (Free = 1 VM; event-credit script refuses Free teams; do not buy Starter). **Recommendation: skip**; create the account and record the team ID so credits land if we pivot. Never pit against Freestyle.

## 3. Stackable combinations

| Combo | Prizes in reach | Sponsors that must be load-bearing | Fits which ideas | Verdict |
|---|---|---|---|---|
| **A. Both hosts + Supabase fan-out** | iPhone + Mac mini pools, overall (bonus points), Supabase $1K | Terse, Agent Relay, Supabase, OpenAI (as brains) | Midnight Soul Exchange, The Curse, Hearsay Hollow, Trick-or-Trade, Familiars | **Default.** Covers every judged pool; Supabase does a real job (phones), OpenAI does a real job (agents) |
| B. Both hosts + GPT-Live voice | iPhone, Mac mini, overall; OpenAI goodwill | + GPT-Live client delegation | Haunted Switchboard, Phantom Switchboard, Possessed mirror | Higher wow, highest failure rate (skeptic scored all ≤3); voice alone did not win at Build Personal Agents |
| C. Both hosts + Freestyle/Superserve sandboxes | iPhone, Mac mini, overall; Freestyle's $10k matters | + VMs per agent | Night Shift, Reanimator, Lazarus Shift, Multiverse PR | Matches "Software Factory" wording but every variant scored ≤4.4 avg; codegen latency kills the 2-minute slot |
| D. Relay-first B2B | Mac mini, overall via YC story | Agent Relay, Terse lighter | Ghost Ticket (Relay 8.5), Medium (Relay 8, YC 7.5), Witching Hour (YC 8) | Best "startup" stories; weak crowd energy and Terse aha |

**Do not try to tick every sponsor.** At Own Your Intelligence, 90 of 91 submissions tagged a sponsor side quest; ticking sponsors does not separate projects ([past-winners.md](research/past-winners.md) §1 #5).

## 4. Credit logistics (do before 11:00 Saturday)

From [reference/sponsor-coverage-audit.md](research/reference/sponsor-coverage-audit.md) §2, §5.

| Sponsor | Action | Billing captain |
|---|---|---|
| OpenAI | One shared org; redeem every teammate's voucher into it (one-time target choice). Buy $5 only if using GPT-Live; turn off auto-reload; set hard limit ~$90 | Lane D |
| Supabase | One org, **one** project. Redeem code first, then upgrade to Pro. Don't retry redemption repeatedly (hCaptcha, ~10/h limit) | Lane C |
| Agent Relay | Signed-in workspace; check `GET /v1/workspace` → `plan`; ask at the table whether workspaces get upgraded from `free` for the day | Lane B |
| Terse | Account + API key; ask whether hosted quotas (500 active actors, 50 starts/s) are raised for teams | Lane A |
| Mastra | Create Platform account (`mastra auth login`) so a prize can land | anyone |
| Freestyle / Superserve | Create accounts, note team IDs; do not pay; ask whether codes carry a plan grant | anyone |

## 5. Recommended default stack

| Layer | Choice | Pin | Job on stage |
|---|---|---|---|
| Authoritative state | **Terse Durable Actors** on Terse Cloud | `terse-cli`/`terse-sdk` 0.14.7, `durable-actors` 0.14.4 | The lock, the timer that fires while dormant, the per-entity SQLite ledger, sockets to the projector |
| Agent bus | **Agent Relay** hosted, local engine behind an env flag | `@agent-relay/sdk@14.0.0`, `@relaycast/engine@12.2.1` | DMs/group DMs between ≤5 agents, typed actions, observer stream on screen, durable catch-up after a kill |
| Bridge | One Bun process: `relay.addListener('*')` → generated actor client; outbound `fetch` to `/v1/dm` | — | Not shown; say it exists |
| Agent brains | OpenAI Responses + Decisions | `openai@7.45.1`, `@openai/agents@0.21.0` | Luna Decisions for fast typed calls; Sol/Terra for 1-2 strategic agents |
| Audience fan-out | **Supabase** anon auth + `httpSend` Broadcast to a private channel + one rollup table | CLI 2.122.0, `supabase-js` 2.118.0 | Phones join with no signup; live client counter; load readout |
| Heterogeneity (stretch) | One Mastra agent or one Claude-API agent on the same Relay workspace | `@mastra/core@1.80.0` | "Three vendors, one bus" line for the Relay judges |
| Skip by default | Freestyle, Superserve, GPT-Live, Relay broker/PTY spawning | — | Add only if the chosen idea makes them load-bearing |

One-line architecture for the pitch: **"Each scarce thing is a Durable Actor; agents deal over Agent Relay; Supabase fans it out to the room."**

## Limits / could not verify

- No judges, rubric weights, stacking rule or "more prizes" announced (re-checked 30 Oct 06:30 UTC).
- Supabase prize criteria and whether it requires Supabase are unstated.
- Credit delivery for Haunted Hacks specifically is unconfirmed for every sponsor; the flows above come from precedent events [P] and docs.
- Mastra prize tier, iPhone/Mac mini configurations and credit expiry dates are unpublished.
- Whether hosted Relay caps or Terse Cloud quotas will be raised on the day is unknown.
- The EV paragraph uses invented probabilities for ranking only; no win rate is evidenced.

## Hackathon implications

1. Build Combo A. Make Terse and Agent Relay load-bearing; make Supabase do the phones; let OpenAI be the brains. Skip VM sponsors unless the idea needs them.
2. Write the BuilderBase submission so a track judge can award it from the text alone: name exact APIs under criterion 1 (`@Persisted`, `@Emittable`, `@Atomic`, `this.alarm.set`, `prepareWebsocket`; Relay DMs, `registerAction`, observer token, durable delivery).
3. Never use Supabase as the villain of a race demo; never name Freestyle "F24"; never pit Freestyle against Superserve; never pitch Terse latency.
4. Billing setup takes ~20 minutes on Friday and prevents the most common morning failures.

## Sources

Internal: [terse.md](research/terse.md), [agent-relay.md](research/agent-relay.md), [openai.md](research/openai.md), [supabase.md](research/supabase.md), [mastra.md](research/mastra.md), [freestyle.md](research/freestyle.md), [superserve.md](research/superserve.md), [past-winners.md](research/past-winners.md), [event-people.md](research/event-people.md), [reference/prize-stacking-and-ev.md](research/reference/prize-stacking-and-ev.md), [reference/sponsor-coverage-audit.md](research/reference/sponsor-coverage-audit.md), [reference/INTEGRATION_COOKBOOK.md](research/reference/INTEGRATION_COOKBOOK.md).
External (as cited in those briefs): https://events.ycombinator.com/haunted-hacks-2026 · https://builderbase.com/terms/ · https://mastra.ai/pricing · https://www.apple.com/newsroom/2026/09/the-new-mac-mini-and-mac-studio-are-available-today/ · https://www.macrumors.com/2026/09/09/iphone-duo-pricing-pre-orders-release-date/ · https://developers.openai.com/api/docs/guides/rate-limits · https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing · https://supabase.com/docs/guides/platform/credits · https://www.freestyle.sh/pricing.md · https://api.superserve.ai/billing/plans/public · https://www.ycombinator.com/apply/
