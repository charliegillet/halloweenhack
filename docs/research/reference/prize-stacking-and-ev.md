# Prize stacking, prize value, and the YC-interview clock (Haunted Hacks, Oct 31 2026)

Compiled **29 Oct 2026** (US Pacific) by a completeness pass over `docs/research/`. The existing briefs (`past-winners.md`, `event-people.md`, `past-winners/04-builderbase-judging.md`) already cover the rubric, the BuilderBase mechanics, the likely judges and past winners. **They did not cover four things that decide how to aim for prizes:**

1. Can one project win the overall prize *and* one or more track prizes?
2. What is each prize worth in dollars, and which prizes are worth bending the build for?
3. Who picks the track winners, and from which pool?
4. When is the YC interview actually useful? The W27 deadline falls **two days after** the event.

Labels: **[V]** verified against the cited source on 29 Oct 2026. **[I]** inference. **[BG]** background, meaning older than the Aug-Oct 2026 window.

---

## 1. Live re-check of the event page (29 Oct 2026)

- **[V]** A live Firecrawl fetch of the YC event page (`maxAge: 0`, 29 Oct) still reads "Judges will be announced soon." and "More prizes will be announced!" The prize text matches `docs/EVENT_PAGE.md` word for word. No judges and no new prizes had been posted. ([YC event page](https://events.ycombinator.com/haunted-hacks-2026))
- **[V]** **Neither the YC page nor the Luma mirror says anything about stacking.** Neither mentions "one prize per team", "eligible for multiple prizes" or anything similar. ([YC](https://events.ycombinator.com/haunted-hacks-2026), [Luma](https://luma.com/yc-meetup-7183-9316f87f))
- **[V]** BuilderBase's public event page serves only JSON-LD to fetchers: name, date, "Hosted by Terse and Agent Relay, sponsored by OpenAI, Supabase, Mastra and Freestyle", organizer "Agent Relay". It shows no rules text. ([BuilderBase](https://builderbase.com/event/haunted-hacks-2026)) Note that the JSON-LD still omits Superserve, the latest sponsor added.
- **[V]** BuilderBase's own Terms §9 say "Prizes are awarded by event organizers according to event rules. BuilderBase facilitates prize distribution but is not responsible for fulfillment". Winners must give payout and tax details, and "Prizes are typically processed within 30–60 days." ([BuilderBase terms](https://builderbase.com/terms/))

**Bottom line:** no published rule allows or forbids stacking. The organizers (Terse and Agent Relay) will decide on the day.

---

## 2. What each prize is worth (list prices, verified)

| Prize | What it is | List value | Source / note |
|---|---|---:|---|
| Overall 1st | Guaranteed YC interview, $5k OpenAI credits, $10k Freestyle credits, $1k Superserve credits, 3 months of Mastra Platform | **~$16.75k in credits** plus the interview | Mastra Teams costs $250/team/month, so 3 months is about $750 [V: [Mastra pricing](https://mastra.ai/pricing), [pricing blog, 17 Jul](https://mastra.ai/blog/mastra-platform-pricing)]. That assumes "Mastra Platform" means the Teams tier [I]. The event page does not name a tier |
| Overall 2nd | $2.5k OpenAI credits, 2 months of Mastra | ~$3k | same |
| Overall 3rd | $1k OpenAI credits, 1 month of Mastra | ~$1.25k | same |
| Durable Actors track | "iPhone duo" | **$1,999** (256 GB base) up to $3,199 (2 TB) | [V] Apple's first foldable. US release was 23 Oct 2026. Preorders reportedly sold out "within minutes" ([MacRumors, 9 Sep](https://www.macrumors.com/2026/09/09/iphone-duo-pricing-pre-orders-release-date/), [USA Today, 23 Oct](https://www.usatoday.com/story/tech/2026/10/23/iphone-duo-availability-price-colors-features/92367797007/), [Apple Store](https://www.apple.com/shop/buy-iphone/iphone-duo)) |
| Agent Relay track | "Mac mini" | **$899** (M6, 16 GB/256 GB) or $1,699 (M5 Pro) | [V] Apple newsroom, available 22 Sep 2026 ([Apple](https://www.apple.com/newsroom/2026/09/the-new-mac-mini-and-mac-studio-are-available-today/), [MacRumors, 25 Aug](https://www.macrumors.com/2026/08/25/apples-mac-mini-mac-studio-available-pre-order/)). The configuration is not stated, so assume the base model [I] |
| Supabase special | "$1K in credits" for "most likely to scale to millions" | $1,000 in credits | event page |
| Costume contest | "Bragging rights" | $0 | event page |
| Every attendee | $100 OpenAI, $25 Supabase, $100 Freestyle, $100 Superserve | $325 per person in credits | event page |

**Reading the table [I]:**
- **The two hardware prizes are the only prizes that are not credits.** The iPhone Duo ($1,999+) is worth more than twice the base Mac mini ($899).
- Hardware goes to one team, so a team of four has to decide who keeps the device. BuilderBase-style rules say splitting is the team's job (see the Serverpod rules in §3.2).
- The grand prize's dollar value is mostly **Freestyle credits** ($10k). At Freestyle's list rate of about $0.267 per default VM-hour, that is roughly 37k VM-hours (rate from `freestyle.md` §3.3). The credits only matter if you will keep building on Freestyle. Credits generally expire and do not transfer: the Serverpod/BuilderBase rules give one year for its own credits. **Freestyle's expiry terms for prize credits are not published.**
- **The real prize is the YC interview** (§4). The credits are a bonus.

**Supply risk [I]:** the iPhone Duo sold out at launch (USA Today, 23 Oct). If the sponsor had not bought one before the event, the winner might get an IOU or a later shipment. You cannot do anything about this. Just do not plan on carrying the phone home that evening.

---

## 3. Can one project win more than one prize? Precedent

### 3.1 Events where one team stacked (this pattern is common)

| Event | Date | Window | What stacked | Source |
|---|---|---|---|---|
| YC Startup School Hackathon (run by The Hackathon Company at Soma Capital's SF office, *not* by YC) | 24 Jul 2026 | just before the window | One team won **Most Technically Impressive + Best Use of Dynamic**. A teammate's profile lists "$1k in cash and $1k in cursor credits" for the first and "$750" for the Dynamic track | [V] [Anvay T.](https://www.linkedin.com/posts/anvayt_im-proud-to-announce-that-my-team-and-i-activity-7487495389055459328-1TEZ), [James Li](https://www.linkedin.com/posts/james-li-962219239_on-july-24-our-team-took-first-place-in-activity-7490262416249970688-nZFg), [Umang Sharma profile](https://www.linkedin.com/in/umangssharma) |
| Running Hackathon (Europe) | ~29-30 Aug 2026 | in window | "We won FIRST PLACE overall and then ALSO won the GTM Track" | [V] [Anshul Yadav](https://www.linkedin.com/posts/anshulyadav1976_this-weekend-i-went-to-the-craziest-hackathon-activity-7499932802885509120-_coq) |
| GTM Hackathon Berlin | ~Oct 2026 (post dated 6 Oct) | in window | "the Apify track and the overall prize" | [V] [LinkedIn](https://www.linkedin.com/posts/vinaynaik432_activity-7513217624378494976-U4aC) |
| Hack the Valley 11 (Toronto) | Oct 2026 (post 20 Oct) | in window | 3rd overall + 1st in a prize track | [V] [LinkedIn](https://www.linkedin.com/posts/vedant-kansara-381330221_hackthevalley-hackathon-robotics-activity-7518456278353010688-A5N9) |
| Conversational AI hackathon, hosted by YC and Moss | Jun 2026 | [BG] | "On top of the main prize, we also won 2 sponsor tracks: TrueFoundry and MiniMax" | [V] [Nasim Nosirov](https://www.linkedin.com/posts/nasimnosirov_we-won-the-y-combinator-hackathon-and-activity-7472541651287076865-r2xr) |
| Cactus x Google DeepMind x YC Gemma 4 Voice Agents, YC HQ | Apr 2026 | [BG] | One team won "3 of the 4 prizes", including **Best Overall** | [V] [Saalik Ahmed](https://www.linkedin.com/posts/saalik-ahmed_alhamdulillahall-praise-be-to-allah-3x-activity-7452211929978286080-WWW1) |
| Browser Use Web Agents Hackathon, YC HQ | 28 Feb 2026 | [BG] | Best Use of Real-Time Data, "Then somehow, someway — we placed 3rd" | [V] [Eric Wong](https://pipinstalleric.com/blog/yc-hackathon). The organizer (HackHQ) says judges scored once and the platform "produc[ed] a ranked list for each prize track and one for the overall competition" ([HackHQ](https://hackhq.io/customers/browser-use-hackathon)) |

### 3.2 Events where the prizes went to different teams, or stacking was restricted

| Event | Date | What happened | Source |
|---|---|---|---|
| **Bitrig Hacks iPhone Duo Edition, YC office** (closest analog: same template, same iPhone Duo prize, Terse's CEO judged) | 26 Sep 2026 | The 1st, 2nd and 3rd place teams (Crate, Duo-Man, Saura) and the RevenueCat track winner (TranslateCat) were **four different teams**. That fits a no-stacking rule, but it does not prove one. Nothing found shows that stacking was forbidden | [V] see `past-winners/01-yc-hackathons.md` §1 ([Devpost](https://bitrig-hacks-duo-edition.devpost.com/), [Notebookcheck](https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html)) |
| Supabase Select hackathon, YC office | 3 Oct 2026 | Fizz won 1st. **Best Use of Stripe went to a different team**, which reached the top 8 and pitched to Supabase's co-founders | [V] [Select recap](https://select.supabase.com/), [Zholdoshkanov](https://www.linkedin.com/posts/rakhatbek-zholdoshkanov_i-happy-to-announce-that-me-and-karim-baba-activity-7512378274354782208--izf) |
| Make Something Agents Want, YC HQ | 17-18 Oct 2026 | Overall 1st was d402 (70 teams submitted). In every sponsor-track post found, the track winners were *other* teams. Whether d402 also entered or won a track could not be verified | [V] [Konrad Weber](https://www.linkedin.com/posts/konrad-weber_ycombinator-aiagents-x402-activity-7518042534678466560-fBEd), [Ashley Ha](https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF) |
| YC x Medplum, YC office | 1 Aug 2026 | 1st, 2nd, 3rd and People's Choice went to four different teams | [V] [Medplum recap](https://www.medplum.com/blog/yc-medplum-hackathon-2026-recap) |
| BuilderBase-administered Serverpod hackathon (online) | Sep-Oct 2026 | The written rules say "A Project can win only one (1) overall Prize. Winning an overall Prize does not prevent the same Entrant from winning the Best Hackathon Post Prize." That restricts stacking *among placements*. Side prizes still stack | [V] [rules, GitHub copy](https://github.com/Daniel-Escamilla/Hackathon_Serverpod/blob/develop/docs/hackathon-rules.md) |

### 3.3 What this means for Oct 31 [I]

- **Stacking is a normal pattern** at SF and YC-adjacent hackathons. The BuilderBase template that has been seen restricts only "overall" placements, not side or track prizes.
- **However, at the three most similar in-window YC-office events** (Bitrig, Select, Make Something Agents Want), the visible track winners were **not** the overall winners. A plausible reason is that the organizers spread hardware prizes across teams. That reason is inferred, not documented.
- **Planning stance:** aim at **one track prize as the floor** and treat the overall prize as upside. Do not count on winning both. Ask an organizer at check-in, in one sentence: "Can a project win overall and a track prize?" (see §6). If a stacking rule exists, it will most likely be stated aloud at kickoff.
- Using both technologies still pays even with no stacking. It makes you eligible for **both** track pools, so you have two chances at the floor, and the event page promises "bonus points" in the overall ranking.

---

## 4. Who picks the track winners

- **[V] At Make Something Agents Want (YC HQ, 17-18 Oct), each sponsor track named its own judges.** Examples: Manufact (Pederzani, Toniato, Khadder), primitive.dev (Byrd, Ha, Poile) and Armature (Otzenberger, Scremin) ([Pivot News summary of the YC page, 13 Oct](https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent)). Ashley Ha thanked "Ethan Byrd for co-judging with me" on the primitive.dev track ([LinkedIn](https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF)).
- **[V] At Bitrig (26 Sep)** the RevenueCat track used the sponsor SDK as the criterion (`past-winners/01` §1).
- **[I]** At Haunted Hacks, the hosts *are* the track sponsors. So the iPhone Duo will very likely be picked by Terse (Karatzas and Simard-Morissette) and the Mac mini by Agent Relay (Washburn and Gant). Supabase's $1K will be picked by whichever Supabase person attends, or by the hosts on Supabase's behalf; the attendee's identity is unknown (`event-people/02` §3f).
- **[I] Track judges may look beyond the top 8 live demos.** At MSAW, sponsors judged teams at their tables during the 2-hour window. If Haunted Hacks works the same way, a team that misses the final 8 can still win a track. That means the **BuilderBase write-up and the table demo** have to sell the track technology on their own, without the stage. `past-winners/04` §6 lists this as unverified for Haunted Hacks.
- **[I] Criterion 1** ("For the Terse and Agent Relay track prizes, how effectively does it use the corresponding technology?") is the only rubric line that mentions tracks. Track judges will mostly read that one line. So name the exact host APIs in the submission (actor keys, `sleep`/wake, Relay channels/DMs) instead of just saying "uses Terse".

---

## 5. The YC-interview clock (not covered elsewhere)

- **[V] The YC Winter 2027 on-time deadline is Mon 2 Nov 2026, 8pm PT.** That is **two days after the event**. Decisions come by 11 Dec, interviews run in Nov-Dec, mostly by video, and the batch runs Jan-Mar 2027 in SF. YC also accepts applications now for Spring, Summer and Fall through Early Decision. ([YC apply](https://www.ycombinator.com/apply/), [TractionWire, 5 Oct](https://tractionwire.com/startups/yc-winter-2027-application-deadline)). Note that US daylight saving time ends 1 Nov, so the deadline is in PST.
- **[V]** At least one 2026 YC-hackathon winner described the prize as "a YC interview with a General Partner (upcoming batch)" ([Ayaan Gazali, Feb 2026, BG](https://www.linkedin.com/posts/ayaangazali_we-just-won-120000-at-the-y-combinator-activity-7431861605900111872-c0rS)). In YC's own 2014 framing, top teams got "guaranteed YC interviews for the next batch" ([YC blog, 2014, BG](https://www.ycombinator.com/blog/yc-hacks-august-2-3-2014)).
- **[I]** If "upcoming batch" applies here, the winning team's interview would fall in the **W27 cycle**, and the team would have to submit a YC application around the 2 Nov deadline. **Which batch the Haunted Hacks interview applies to is not published.** Ask the YC staffer on site.
- **[I] Practical step:** before Saturday, any teammate who would actually go to YC should draft a W27 application (founders, a one-line idea, and a placeholder for "what have you built"). If you win, you can then submit Sunday or Monday with the hackathon demo video as the product. This costs about an hour and keeps the grand prize from going to waste.
- **[I] What the YC partner on the panel rewards** (from `past-winners/01` §2 and the Medplum criteria) is a startup wedge: a clear user, a number, and a reason to exist after Halloween. This is the "Potential and Impact" criterion. It counts much more for the overall prize than for the hardware tracks.

---

## 6. Field size and odds (rough)

- **[V]** Capacity is 225 (YC page data). `max_team_size` is 5 on the YC page, but the Luma copy says "Teams of up to 4" (`event-people/03`). The top 8 demo live (BuilderBase page, `past-winners/04`).
- **[V] Comparable turnout:** Bitrig had about 157-161 participants and 73 submissions. MSAW had 70 teams. Select had 68 submissions (`past-winners/01`, [Supabase hackathon index](https://hackathon.supabase.com/)).
- **[I]** Expect about **50-75 submissions**. Top 8 is roughly the top 11-16%. There are 6 judged prizes: overall 1-3, two tracks and Supabase. If they all go to different teams, about 6 of roughly 60 teams win something, so the base rate is about 10%. Using **both** host technologies puts a team in every pool. Using neither leaves it competing only for overall 1-3 and the Supabase prize.

---

## 7. Supabase "most likely to scale to millions" and the costume contest

- **[V]** The event page does not say whether the Supabase prize requires using Supabase. Supabase's slogan is "Build in a weekend. Scale to millions." Its earlier prize with this name went to a project that explained "why it broke" (`supabase.md`, `past-winners.md` §10).
- **[I]** Assume Supabase use is expected. Show Supabase doing real work, such as Postgres history or Realtime Broadcast, and do not just name it. This prize is the one most likely to stack informally, because a sponsor who attends usually picks its own winner.
- **[V] The costume contest** is listed as a track with the prize "Bragging rights".
- **[I]** It costs nothing to enter. A costume that ties into the project's Halloween character also helps judges remember you on stage, where the demos run back to back. Keep it cheap and keep it from slowing down your hands.

---

## Limits / could not verify

- **No stacking rule is published** for Haunted Hacks. It was not on the YC page, the Luma pages, or the BuilderBase public JSON-LD as of 29 Oct. The logged-in BuilderBase dashboard may show rules, but it could not be accessed.
- Bitrig, Select and MSAW are evidence that prizes were *spread*. They are not evidence of a ban, and no rule text was found for any of them.
- Not published: the iPhone Duo storage tier, the Mac mini configuration, the Mastra tier, and expiry dates for Freestyle, Superserve and OpenAI prize credits.
- Not published: which YC batch the interview applies to, and whether it is with a General Partner.
- Not known: whether track judges consider only the top 8 or all submissions (also flagged in `past-winners/04`).
- No judges had been announced as of the 29 Oct live fetch.

## Hackathon implications

1. **Build to qualify for both tracks** (Durable Actors *and* Agent Relay), plus visible Supabase use. That keeps you in all three special-prize pools and earns the "bonus points" in the overall ranking. Do this even if prizes do not stack, because it doubles your chances at the floor prize.
2. **Rank the targets** (by value times plausibility) [I]: (a) the iPhone Duo ($1,999+) through a Durable Actors centerpiece; (b) the overall prize and YC interview, through a startup framing; (c) the Mac mini ($899); (d) Supabase's $1k. Shape the demo so the one moment that sells Terse also sells the overall story. One example is the existing "kill it, it keeps going, reconnect" beat (`past-winners/04`).
3. **Write the BuilderBase submission so a track judge can award it without seeing the stage.** Put Terse and Agent Relay API names under criterion 1, plus a 60-90 s video link. Track judges may only read the write-up or see the table demo.
4. **At check-in, ask an organizer two questions:** "Can a project win overall *and* a track prize?" and "Which YC batch is the interview for?" Write down the answers. If stacking is off, decide by 2pm whether to pitch for overall or for the track.
5. **Before Oct 31:** any teammate who would actually go to YC drafts a **W27 application**, due Mon 2 Nov at 8pm PT. Agree on who keeps a hardware prize, and that sponsor credits go into the team account of whoever keeps building.
6. **Don't over-optimize for credits.** $16.75k of grand-prize credits only pay off if you keep building on Freestyle, OpenAI and Mastra. The interview is what counts.

## Sources

- YC event page (live fetch, 29 Oct): https://events.ycombinator.com/haunted-hacks-2026
- Luma mirror: https://luma.com/yc-meetup-7183-9316f87f
- BuilderBase event: https://builderbase.com/event/haunted-hacks-2026 · Terms: https://builderbase.com/terms/
- BuilderBase/Serverpod official rules (copy): https://github.com/Daniel-Escamilla/Hackathon_Serverpod/blob/develop/docs/hackathon-rules.md
- iPhone Duo pricing: https://www.macrumors.com/2026/09/09/iphone-duo-pricing-pre-orders-release-date/ · https://www.usatoday.com/story/tech/2026/10/23/iphone-duo-availability-price-colors-features/92367797007/ · https://www.apple.com/shop/buy-iphone/iphone-duo · https://www.theverge.com/gadgets/988582/apple-iphone-duo-preorder-buy-foldable
- Mac mini pricing: https://www.apple.com/newsroom/2026/09/the-new-mac-mini-and-mac-studio-are-available-today/ · https://www.macrumors.com/2026/08/25/apples-mac-mini-mac-studio-available-pre-order/
- Mastra pricing: https://mastra.ai/pricing · https://mastra.ai/blog/mastra-platform-pricing
- YC apply / W27: https://www.ycombinator.com/apply/ · https://tractionwire.com/startups/yc-winter-2027-application-deadline · https://www.ycombinator.com/blog/yc-hacks-august-2-3-2014
- Stacking precedents: https://www.linkedin.com/posts/anvayt_im-proud-to-announce-that-my-team-and-i-activity-7487495389055459328-1TEZ · https://www.linkedin.com/posts/james-li-962219239_on-july-24-our-team-took-first-place-in-activity-7490262416249970688-nZFg · https://www.linkedin.com/in/umangssharma · https://www.linkedin.com/posts/anshulyadav1976_this-weekend-i-went-to-the-craziest-hackathon-activity-7499932802885509120-_coq · https://www.linkedin.com/posts/vinaynaik432_activity-7513217624378494976-U4aC · https://www.linkedin.com/posts/vedant-kansara-381330221_hackthevalley-hackathon-robotics-activity-7518456278353010688-A5N9 · https://www.linkedin.com/posts/nasimnosirov_we-won-the-y-combinator-hackathon-and-activity-7472541651287076865-r2xr · https://www.linkedin.com/posts/saalik-ahmed_alhamdulillahall-praise-be-to-allah-3x-activity-7452211929978286080-WWW1 · https://pipinstalleric.com/blog/yc-hackathon · https://hackhq.io/customers/browser-use-hackathon · https://www.linkedin.com/posts/ayaangazali_we-just-won-120000-at-the-y-combinator-activity-7431861605900111872-c0rS
- Prizes spread across teams: https://bitrig-hacks-duo-edition.devpost.com/ · https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html · https://select.supabase.com/ · https://www.linkedin.com/posts/rakhatbek-zholdoshkanov_i-happy-to-announce-that-me-and-karim-baba-activity-7512378274354782208--izf · https://www.linkedin.com/posts/konrad-weber_ycombinator-aiagents-x402-activity-7518042534678466560-fBEd · https://www.linkedin.com/posts/ashleyha_makesomethingagentswant-activity-7518396250161860610-TCbF · https://pivotnews.ai/five/y-combinator-s-events-page-details-a-hackathon-for-agent · https://www.medplum.com/blog/yc-medplum-hackathon-2026-recap · https://hackathon.supabase.com/
