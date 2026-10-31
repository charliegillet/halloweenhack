# BuilderBase judging at Haunted Hacks: how submission and scoring work, and how to score well

Checked 29 October 2026 (PT). Sources: the live BuilderBase event page for this hackathon (Firecrawl render), the BuilderBase External API docs, the BuilderBase Intercom help center, and the public BuilderBase web-app JavaScript bundle (`builderbase.com/assets/*.js`, read 29 Oct 2026; UI strings are quoted verbatim). Recent BuilderBase-run and YC-office events from Aug–Oct 2026 are used as comparables. Items before Aug 2026 are marked **background**.

Labels used below: **[V]** means verified directly from a cited source. **[I]** means my inference. **[B]** means background (older than ~90 days, or generic guidance).

---

## TL;DR

1. **The rubric is published, and it is the real one.** The BuilderBase event page for Haunted Hacks lists five criteria, each "scored 1 to 5": *Use of Real-Time AI and Track Technology*, *Originality and Creativity*, *Execution and Demo*, *User Experience and Design*, *Potential and Impact*. "The top 8 finalists demo live for 2 minutes each, and judges select winners from those demos." [V] ([event page](https://builderbase.com/event/haunted-hacks-2026))
2. **Teams can have up to 4 people.** [V] (event page; [Luma mirror](https://luma.com/builde-oxba))
3. **Judging probably runs in two stages.** Stage 1 is a BuilderBase rubric pass over all submissions between 4:00 and ~4:40pm, which picks the top 8. Stage 2 is 8 × 2-minute live demos and then deliberation. [I] This rests on the published schedule (4:00 deadline, 4:00–5:00 judging, 5:00 awards), the "top 8" language, and BuilderBase's multi-round judging features. **Your written submission is what gets you into the top 8. The live demo is what wins.**
4. **The rubric is adapted from the YC/Bitrig template.** All five criterion *names* follow Bitrig Hacks (YC office, 26 Sep 2026): four are identical (*Originality and Creativity*, *Execution and Demo*, *User Experience and Design*, *Potential and Impact*) and the first swaps "Use of iPhone Duo" for "Use of Real-Time AI and Track Technology". The *descriptions* were rewritten, not copied: only the first UX sentence ("Is the experience intuitive, cohesive, and thoughtfully designed?") is identical. Bitrig had 73 submissions and 8 finalists, and Terse's CEO Thomas Karatzas was one of its judges. [V] ([Bitrig Devpost](https://bitrig-hacks-duo-edition.devpost.com/), [finalist post](https://www.linkedin.com/posts/gergana-dragoeva-quievy_yesterday-i-literally-moved-into-a-coat-activity-7510474243281793024-Qq50))
5. **Gotchas from the app code.** Submission may require **check-in first**. The final submit **locks** the entry. Any team member can "Submit on behalf of team". Edits are blocked after the deadline. If the organizer enables the GitHub integration, **repos freeze at the deadline**. [V] (bundle strings, GitHub help articles)

---

## 1. What we know about *this* event's setup

| Fact | Status | Source |
|---|---|---|
| BuilderBase manages judging; "Participant signup will occur on check-in." | V | [YC event page](https://events.ycombinator.com/haunted-hacks-2026) (local copy `docs/EVENT_PAGE.md`) |
| The BuilderBase event page exists, with a "Dashboard" button for approved attendees; "Spots are requested and approved on the YC event page." | V | [builderbase.com/event/haunted-hacks-2026](https://builderbase.com/event/haunted-hacks-2026) |
| BuilderBase JSON-LD lists the organizer as "Agent Relay". The Luma mirror lists the organizer as "Builderbase Hackathons" | V | page `<script type="application/ld+json">`; [Luma](https://luma.com/builde-oxba) |
| Each of the 5 criteria is scored 1–5. Top 8 demo live for 2 minutes each | V | event page |
| Venue: the YC office, San Francisco | V | Luma lists location "Y Combinator"; Karatzas post "at the YC Office" ([LinkedIn, 19 Oct](https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0)) |
| **The platform changed from Devpost to BuilderBase.** An earlier copy of the YC page said "We will be using devpost! We recommend setting up your account ahead of time." The live page now names Builderbase | V | stale copy at [HackathonRadar](https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026) vs live YC page. Ignore any Devpost listing for this event |
| Criterion weights | **Not published** | event page shows none |
| Teams of up to 4 ("Teams are up to 4 people"); in person; 16+; all code written at the event | V | event page, Luma. One aggregator ([Manyfold](https://data.manyfold.ai/ai-hackathons/r/rec_01m5gbs14057m4p16f9azveak8)) claims "Teams must have 2–4 members; solo entries are not allowed". No official page says that, and the YC page offers to help solo attendees find a team (unverified; treat as aggregator error) |
| Schedule: 16:00 submission deadline, 16:00–17:00 judging, 17:00–18:00 awards | V | both pages |
| Judges | "Judges will be announced soon" (still empty on 29 Oct) | event page |
| Track prizes: Stateful Apps (Terse Durable Actors) → iPhone Duo; Agent to agent (Agent Relay) → Mac mini; "Most likely to scale to millions" → $1K Supabase | V | event page |

Verbatim criterion text from the BuilderBase page ([source](https://builderbase.com/event/haunted-hacks-2026)):

- **Use of Real-Time AI and Track Technology.** "How meaningfully does the project use AI in real time? For the Terse and Agent Relay track prizes, how effectively does it use the corresponding technology?"
- **Originality and Creativity.** "How fresh and inventive is the idea? Does it demonstrate an unexpected or creative use of real-time AI?"
- **Execution and Demo.** "How well does the project work? Consider functionality, polish, and how clearly and convincingly the demo communicates the concept."
- **User Experience and Design.** "Is the experience intuitive, cohesive, and thoughtfully designed? Does the design support the project's intended use?"
- **Potential and Impact.** "Does the project address a meaningful problem or demonstrate a compelling use case? Could the idea be developed further into something useful?"

[I] Criterion 1 does double duty. The same score probably feeds both the overall ranking and the track-prize decisions. A project that uses neither Durable Actors nor Agent Relay can still score on "real-time AI", but it gives up the track wording.

---

## 2. How BuilderBase submission works (participant side)

### 2.1 Fields are set by the organizer; there is no fixed schema
- The Terms say: "Submission requirements (video demos, code repositories, documentation) are defined by organizers. Late submissions may not be accepted." [V] ([terms §6.3](https://builderbase.com/terms/))
- The app shows "No submission requirements have been set up for this event yet." when the organizer has not built a form. [V] (bundle `SubmissionModal-*.js`)
- Field types the organizer can choose from: Short Text, Long Text (Markdown), Email, URL, Phone, Date, Dropdown, Multi-Select, Radio, Checkbox, Agreement/Consent, Single File Upload, Multiple File Upload. [V] (bundle `fieldTypes-*.js`)
- BuilderBase's organizer playbook lists these as typical fields: project name, team name/members, challenge/track category, description, **demo video URL (YouTube, Loom, Vimeo)**, **code repo URL**, live demo URL, slides, technologies used. It also tells organizers to "Consider requiring a demo video." [V/B] ([Playbook Ch.08, Apr 30 2026](https://intercom.help/builderbase/en/articles/14831460-hackathon-playbook-ch-08-setting-up-builderbase))
- **The exact Haunted Hacks form is not visible until you log in on the day.** [I] Expect most or all of: name, one-liner/description, track selection (Terse / Agent Relay / both), GitHub URL, demo or video link, tech used. This is consistent with the Bitrig template, which required name, demo video link, technologies, APIs used, and description, plus at least one screenshot ([Bitrig Devpost](https://bitrig-hacks-duo-edition.devpost.com/)).

### 2.1b Anti-cheating clause (missing from the first draft) [V]
- BuilderBase Terms §3.3 (last updated 12 Oct 2026): "BuilderBase employs automated systems to detect cheating, including code comparison across events globally, submission timestamp verification, and pre-build detection." §3.1 bans "resubmitting old projects or building before event start times". ([terms](https://builderbase.com/terms/))
- [I] Put together with the event rule "All code must be created at the hackathon", this means: do not paste in a pre-written repo. Start a fresh repo after 11:00am so the first commit timestamp is clean. Scaffolding with `npx create-*` or a sponsor quickstart on the day is the safe path. Whether BuilderBase actually scans repos for this event is unknown.

### 2.2 Submission mechanics (from the app's own UI strings) [V]
- **Draft → final.** A submission has `status` `draft` or `final`. The team/judge view labels a finalized entry "Final Submission" with status "Finalized" (bundle `index-DON92hRU.js`). (An earlier version of this file quoted a "Draft · ready to submit" label; that string is not in the current bundle and has been removed. Judge *assignments* separately show "Not started" / "Draft" / "Finalized".)
- **Anyone on the team can submit.** The button reads "Submit on behalf of team".
- **The pre-submit checklist** shown to users: "All required fields are filled out", "All required files are uploaded", "Your demo/video links are working", "Your repository URL is correct". The confirm dialog warns: "This action cannot be undone."
- **Check-in gate.** "You need to check in at "${name}" before submitting your project." There is a milestone gate too, if configured: "You need to submit the milestone for "${name}" before submitting your final project." Make sure every teammate has checked in (QR code at the door) before 4pm.
- **Deadline behavior.** A live countdown runs off `submission_deadline_effective`, falling back to the event end. After it passes: "The submission deadline has passed. You can no longer submit your project." / "Contact an organizer if you need to make changes."
- **Uploads block submit.** "Files are uploading… submission will be available once uploads finish." A large video upload at 3:59pm is a real risk. Use a link instead.
- **Judging does not strictly require a final submission.** The organizer UI says "A team without a final submission can still be judged." [V] (bundle `routes-Cs8mGpxg.js`) Do not rely on this. Contrast Bitrig on Devpost: "Any un-submitted, or draft entry not submitted by the hackathon deadline will not be considered by the Judges."

### 2.3 GitHub integration (only if the organizer turns it on) [V]
- The organizer connects a GitHub org, and BuilderBase creates **one private repo per team** (e.g. `team-aurora-cd5f6ece-submission-repo`). You need your **GitHub username on your BuilderBase profile** and you must **accept the org invite**, which goes to your GitHub account's email.
- "Repositories freeze when submissions close, so judges see the version you submitted." Judges get read access to the teams they are assigned. The organizer article adds that repos freeze "once its last track's submission deadline passes". GitHub org invites "expire after 7 days"; the card has a "Get access" button to re-send. ([participant article](https://intercom.help/builderbase/en/articles/17718615-github-getting-into-your-team-repository), [organizer article](https://intercom.help/builderbase/en/articles/17718616-github-set-up-team-repositories))
- [I] It is unknown whether Haunted Hacks uses this. If it does, pushing to your own repo and porting at 3:50pm costs time. Accept the invite as soon as you are on a team.

---

## 3. How BuilderBase judging works (judge and organizer side)

### 3.1 Rubric model [V]
- Criteria have a name, description, `weight` (0–1, "Total weight cannot exceed 100%"), and order. The maximum is 20 criteria. Criteria can be cloned between tracks ("Clone existing judging criteria from another track."). The UI enforces "Cannot have more than 20 criteria". ([API: Judging](https://developers.builderbase.com/reference/judging/); bundle `index-CWN0o_of.js`)
- **Scoring input** is set per event. Option 1 is "Slider (1 – 5)", described as "Judges drag a slider from 1 to 5; the exact value is stored." Option 2 is "Dropdown (0 / 1 / 2)", described as "Three levels mapped onto the 1–5 scale (0→1, 1→3, 2→5)." The API example shows `super_event_scoring_mode: "slider"`. Haunted Hacks says "scored 1 to 5", which fits either mode.
- **Aggregation.** `calculate-results` "Aggregates submitted scores against criteria weights to produce the final leaderboard. Teams with no scores are skipped." The judge UI shows "Weighted overall across the N of M criteria scored". Results carry `overall_score` (e.g. 4.1234) and `rank`. (API docs)
- **Per-score fields.** `value`, a private `comment` ("Private note · only you & organizers"), and team-visible `feedback` ("Feedback · shared with the team"). Participants later see a per-criterion breakdown with feedback only, never the private comment. (API `GET /teams/:teamId/results`; bundle `index-DON92hRU.js`)
- **Locking.** Judges' scores autosave, and "Submit to lock them in and count toward the results." A judge must "Score all N criteria to submit."
- **Organizers can score on behalf of judges.** The UI shows "You're scoring as {judge}" and "Anything you enter is recorded as their evaluation and counts toward the results under their name." (bundle `index-DON92hRU.js`; an earlier paraphrased quote here was corrected) [V] [I] This lets organizers transcribe paper or verbal scores from the live demo session into BuilderBase.
- **"Blind judging"** in BuilderBase means **hiding scores and results from participants until they are published**, not anonymising teams. The UI text is "Hide scores and results from participants and public pages until you publish them." [V] (The marketing site's "blind scoring" claim refers to this toggle.)

### 3.2 Multi-round judging, which explains how "top 8" gets chosen [V]
- "Run judging in sequential rounds: winners advance to the next round with its own criteria and judges. Leave empty for a single judging pass."
- Advancement modes are `manual`, `top_n` ("How many teams advance"), and `threshold` ("Minimum score to advance"). Cross-track rounds are also available ("A cross-track round judges the winners advanced out of an earlier round"), along with "Change finalists" and "Close round & calculate results" ("judges can no longer change scores in this round. Teams nobody has scored are not ranked and cannot advance").
- [I] The likely Haunted Hacks configuration: Round 1 assigns judges to subsets of teams, who score from the submission (description, video, repo) and possibly a quick table visit, with `top_n = 8`. Round 2 is a cross-track final with live demos. Track prizes (Terse, Agent Relay, Supabase) are then picked by the sponsor judges from the scored field. **One consequence matters a lot: in Round 1, "Teams nobody has scored are not ranked and cannot advance."** If your submission is empty or late, judges have nothing to score.

### 3.3 Timing math for 4:00–5:00 [I]
8 finalists × (2 min demo + ~1 min Q&A/switch) ≈ 25 min. Deliberation takes ~10 min. That leaves roughly **35–40 minutes for Round 1** across every submission. With ~5–10 judges and 30–70 teams, each judge sees perhaps 5–10 projects for ~3–5 minutes each, or skims them on screen. **Your submission text and a 60–90s video will be judged in that skim.**

---

## 4. How live-demo judging has run at comparable recent events

| Event (date) | Platform | Field → finalists | Demo format | Rubric | Source |
|---|---|---|---|---|---|
| **Bitrig Hacks, YC office (26 Sep 2026)** | Devpost | ~157–300 people, **73 submissions → 8 finalists → 3 winners + RevenueCat prize** | Same YC template text: "top entries will demo live… judges will select winners from those demos." Hacking 11:30–3:30, demos and judging 3:30–5:00. Devpost writeup "is what will be judged" | Use of iPhone Duo / Originality & Creativity / Execution & Demo / UX & Design / Potential & Impact | [Devpost](https://bitrig-hacks-duo-edition.devpost.com/), [Notebookcheck](https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html), [finalist LinkedIn](https://www.linkedin.com/posts/gergana-dragoeva-quievy_yesterday-i-literally-moved-into-a-coat-activity-7510474243281793024-Qq50) |
| Dell × NVIDIA tour, BuilderBase-run (Jul–Oct 2026; Seattle, NYC, Boston, SF) | BuilderBase | ~40 teams → **top 8 pitch on stage** (repeatedly) | "Top 8 teams demo live to the judges" | not published | [BuilderBase post, 19 Oct](https://www.linkedin.com/posts/builderbase-labs_sanfrancisco-activity-7518035788543168514-Rm8e), [Boston finalist](https://www.linkedin.com/posts/salvatore-ambrosino-_agenticai-healthcareai-nvidia-activity-7512960343481061377-Y-lu), [Seattle recap](https://www.linkedin.com/posts/simon-lefort_seattle-ai-builders-this-ones-for-you-activity-7484113354832334848-snwg) (343 apps → 29 teams → 19 working demos, SF debut) |
| Pax Silica, BuilderBase-run, SF Tech Week (7 Oct 2026) | BuilderBase | finalists then overall + sponsor-tool prize | "ship a working product by 4:00 sharp" | sponsor-tool rule | [Sam Karri post](https://www.linkedin.com/posts/shanmukhsain_sftechweek-sftechweek-paxsilica-activity-7514732008430833664-_rmc) |
| YC × Medplum (1 Aug 2026) | — | — | presentations at dinner | 2 criteria: impact; effective use of sponsor tech | [Medplum blog](https://www.medplum.com/blog/yc-medplum-hackathon-2026) |
| Vercel + Meta "Fast Forward" (14 Oct 2026) | — | first-round review → 9 finalists | 3 min live per finalist | — | [Palaner listing](https://palaner.com/events/luma-a37abac974) |
| **Background:** Browser Use Web Agents, YC HQ (28 Feb 2026) | HackHQ | 78 → 6 parallel rooms → top 10 finals | "four minutes to show their project and answer questions" in semis; 2-min final pitches (unverified) | Impact 40 / Creativity 20 / Tech 20 / Demo 20 | [HackHQ case study](https://hackhq.io/customers/browser-use-hackathon), [participant blog](https://pipinstalleric.com/blog/yc-hackathon) |

Patterns [I]:
- **"Top 8" is a BuilderBase and YC-afternoon norm.** It is confirmed for the Dell tour's Boston stop (150 builders, 40 teams) and its SF announcement, and for Bitrig. "Every stop" is not verified. Expect roughly 10–20% of teams to reach the stage.
- **YC-office judging panels mix a YC partner, the host founders, and sponsor reps.** Bitrig had YC GP Brad Flora plus OpenAI, RevenueCat, and Terse. [V for Bitrig; I for Haunted Hacks]
- **What winners had in common at Bitrig:** every winner made the event's *new primitive* (the hinge) the core of the interaction, not a bolt-on. For example, in the Crate team's post (by Steven Zhang, reshared by Mahin Bharathwaj) "The hinge becomes an FX knob" ([winner post](https://www.linkedin.com/posts/mahin-bharathwaj-344b8a31b_incoming-activity-7510385152649502720-_KzG)). The direct analogue here: Durable Actor state and agent-to-agent messages should *be* the product, and visibly so.

---

## 5. BuilderBase's own advice to builders (background, generic) [B]

From the BuilderBase Builder's Guide (Nate Rundberg, Apr 30 2026):
- Judges ask five things: is it a real problem, does it work, can you explain it, is there a "wow" moment, and did you use the time well. They "genuinely do not care about" perfect code, complete features, or purposeless animation. ([Ch.15](https://intercom.help/builderbase/en/articles/14836129-builder-s-guide-ch-15-how-judging-works))
- "Reverse-engineer from the rubric," and treat category prizes as "your secret weapon": "Mention the sponsor's tool in your demo." (Ch.15)
- 2-minute structure: **Problem 15–20s → Solution 15–20s → Live demo 60–90s → Impact 10–15s → Ask 5–10s**. Rehearse 3×, record a backup video, and take screenshots. ([Ch.14](https://intercom.help/builderbase/en/articles/14836128-builder-s-guide-ch-14-crafting-a-demo-that-lands))
- Organizer-side guidance: presentation format suits under 15 teams, science-fair format 15–30, two-stage format 30+. Judges are told "Score against the rubric, not against each other" and warned about bias toward "flashy UIs". ([Playbook Ch.15](https://intercom.help/builderbase/en/articles/14831464-hackathon-playbook-ch-15-judging-rubrics))

---

## 6. Limits and what I could not verify

- **The criterion weights for Haunted Hacks** are not published. Treat them as equal unless announced.
- **Who judges Round 1 vs the final, and whether Round 1 includes table visits**, is unannounced. The judge list was empty on 29 Oct.
- **The exact submission form fields** are only visible after login and check-in on the day. The Saltfish interactive demos linked from the help center ("How to Set Up Final Submission Form", "Judging Demo") are JS-only and could not be read.
- **Whether the GitHub repo integration is enabled** for this event is unknown.
- **The sponsor-track decision process** (whether Terse, Agent Relay, and Supabase pick from all submissions or only the finalists) is unknown.
- Bundle strings reflect the **current deployed build** as of 29 Oct 2026. Behavior could change before Saturday.
- The app's "AI Evaluation" feature scores **applicants/registrations**, not project submissions, according to its UI text. I found no evidence of AI-scored submissions.
- There is a small discrepancy: the YC page lists Freestyle ($100) and Superserve ($100) per-attendee credits and Freestyle ($10k) / Superserve ($1k) grand-prize credits, but the BuilderBase page text lists only OpenAI and Supabase credits and omits both from the grand prize. Its About paragraph also omits Superserve, though the Superserve logo appears in its sponsor strip. Treat the YC page as authoritative. Out of scope here; another file should reconcile it.

---

## Hackathon implications

**What to build (rubric-driven)**
- Make one thing that **visibly happens in real time** and is **powered by Durable Actors *and* Agent Relay**. Example: multiple agents coordinate over Agent Relay while each agent's state lives in a Terse actor, and the UI updates live as messages arrive. Criterion 1 explicitly scores "how effectively" each track technology is used, and both host pages promise bonus points for using both.
- Use one new primitive as the centerpiece, as Bitrig's winners did with the hinge. Something like "kill the tab, the actor keeps going, reconnect and the state is intact" is a 10-second wow moment that maps onto Execution *and* Track Tech.
- Give it a Halloween skin. That costs nothing and helps Originality and UX. Keep the UI clean and simple, because UX & Design is a full 1/5 of the score.
- For the Supabase "scale to millions" prize, say one sentence about why actors and Supabase scale horizontally. It is a separate award with no rubric line.

**Submission playbook (to make the top 8)**
- **3:15pm feature freeze. 3:30pm start the submission. 3:45pm final submit.** The final submit locks the entry, uploads block the button, and the deadline is enforced by the app.
- Write the description to the five criteria, using the criterion names as headings: *Real-time AI + Terse + Agent Relay* (name the exact APIs), *What's new*, *Does it work* (link a live URL), *UX*, *Impact*. Judges in Round 1 have about 3–5 minutes per project.
- Include a **60–90s demo video link** (Loom or unlisted YouTube) and screenshots, even if they are not required. The video is the Round 1 judge's best evidence. Bitrig, built on the same YC template, required a video and a screenshot.
- Select **both** track options if the form allows it.
- Create the repo **after 11:00am** and commit early. BuilderBase's Terms describe timestamp checks and "pre-build detection", and the event requires all code to be written on site. Ideas, sketches, and accounts made beforehand are fine.
- Every teammate checks in at the door, because the submit button can be gated on check-in. Add your GitHub username to your BuilderBase profile early, and accept any org invite right away.

**Live demo (2 minutes, finalists)**
- Hook (one sentence, spooky + real problem) → live demo of the real-time moment by ~0:25 → call out on screen the Durable Actors and Agent Relay pieces → impact and why it scales → stop at 1:50.
- Keep a recorded backup video and a pre-seeded state ready. Bring a phone hotspot in case YC wifi drops.
- Prepare answers to "how would this scale", "who is the user", and "how is this different from X". BuilderBase's own guide lists these as the most common questions.

**Setup to do before Oct 31**
- Create or verify your BuilderBase account with the same email as your YC RSVP. Fill your profile with a GitHub username. Bookmark `builderbase.com/dashboard`.
- Ignore any Devpost or aggregator listing for this event. An earlier version of the YC page said Devpost, but judging is now on BuilderBase.
- Pre-make a Loom account, a submission-text template with the five headings, and a deploy target. Code must be written at the event, but templates and accounts are fine.
- Record a timed 2-minute script skeleton now, and fill in the specifics on the day.

---

## Sources

- Haunted Hacks on BuilderBase (rubric, top-8 format, team size): https://builderbase.com/event/haunted-hacks-2026
- Haunted Hacks YC event page: https://events.ycombinator.com/haunted-hacks-2026 (local: `/Users/charlie/.t3/projects/halloweenhack/docs/EVENT_PAGE.md`)
- Haunted Hacks Luma mirror: https://luma.com/builde-oxba
- BuilderBase homepage / features: https://builderbase.com/
- BuilderBase Terms §6.3: https://builderbase.com/terms/
- BuilderBase API, Judging: https://developers.builderbase.com/reference/judging/
- BuilderBase API, Submissions: https://developers.builderbase.com/reference/submissions/
- BuilderBase API, Teams: https://developers.builderbase.com/reference/teams/
- BuilderBase API, Super Events: https://developers.builderbase.com/reference/super-events/
- Help: Playbook Ch.08 Setting Up BuilderBase: https://intercom.help/builderbase/en/articles/14831460-hackathon-playbook-ch-08-setting-up-builderbase
- Help: Playbook Ch.15 Judging & Rubrics: https://intercom.help/builderbase/en/articles/14831464-hackathon-playbook-ch-15-judging-rubrics
- Help: Builder's Guide Ch.14 Demo: https://intercom.help/builderbase/en/articles/14836128-builder-s-guide-ch-14-crafting-a-demo-that-lands
- Help: Builder's Guide Ch.15 How Judging Works: https://intercom.help/builderbase/en/articles/14836129-builder-s-guide-ch-15-how-judging-works
- Help: Running events FAQ: https://intercom.help/builderbase/en/articles/15589614-running-events
- Help: GitHub team repo (participant): https://intercom.help/builderbase/en/articles/17718615-github-getting-into-your-team-repository
- Help: GitHub team repos (organizer): https://intercom.help/builderbase/en/articles/17718616-github-set-up-team-repositories
- Help: demo links (Saltfish, JS-only): https://intercom.help/builderbase/en/articles/14812393-demo-links-all-roles
- BuilderBase web-app bundle (UI strings; read 29 Oct 2026): https://builderbase.com/assets/SubmissionModal-42WpYFmq.js, https://builderbase.com/assets/SubmitConfirmationModal-BsQ78nPO.js, https://builderbase.com/assets/fieldTypes-SwG6kuKE.js, https://builderbase.com/assets/deadlines-CFHhB-3V.js, https://builderbase.com/assets/routes-Cs8mGpxg.js, https://builderbase.com/assets/index-DON92hRU.js, https://builderbase.com/assets/index-IRkTW4BN.js, https://builderbase.com/assets/queries-CTKiVf0m.js
- Thomas Karatzas announcement (19 Oct 2026): https://www.linkedin.com/posts/thomas-karatzas-a3015a94_haunted-hacks-real-time-ai-edition-activity-7517988351019245568-ygO0
- Stale pre-switch copy of the YC page ("using devpost"): https://www.hackathonradar.com/database/hackathon/haunted-hacks-realtime-ai-edition-2026
- Aggregator with unverified team-size claim: https://data.manyfold.ai/ai-hackathons/r/rec_01m5gbs14057m4p16f9azveak8
- BuilderBase launch post (Mar 2026, background): https://www.linkedin.com/posts/builderbase-labs_meet-builderbase-the-infrastructure-for-activity-7442886201893670912-dsTX
- Bitrig Hacks Devpost (rubric, requirements, judges): https://bitrig-hacks-duo-edition.devpost.com/
- Bitrig results coverage: https://www.notebookcheck.net/Made-for-iPhone-Duo-These-apps-show-what-Apple-s-foldable-can-do.1416967.0.html
- Bitrig finalist account (73 → 8 finalists): https://www.linkedin.com/posts/gergana-dragoeva-quievy_yesterday-i-literally-moved-into-a-coat-activity-7510474243281793024-Qq50
- Bitrig winner post (Crate): https://www.linkedin.com/posts/mahin-bharathwaj-344b8a31b_incoming-activity-7510385152649502720-_KzG
- Bitrig Luma (YC template text): https://luma.com/yc-meetup-4378
- BuilderBase Dell × NVIDIA SF announcement (top 8 demo live): https://www.linkedin.com/posts/builderbase-labs_sanfrancisco-activity-7518035788543168514-Rm8e
- Dell × NVIDIA Boston finalist (top 8 of 40): https://www.linkedin.com/posts/salvatore-ambrosino-_agenticai-healthcareai-nvidia-activity-7512960343481061377-Y-lu
- Dell × NVIDIA Seattle announcement (SF debut stats): https://www.linkedin.com/posts/simon-lefort_seattle-ai-builders-this-ones-for-you-activity-7484113354832334848-snwg
- Pax Silica (BuilderBase-run, SF Tech Week): https://www.linkedin.com/posts/shanmukhsain_sftechweek-sftechweek-paxsilica-activity-7514732008430833664-_rmc
- YC × Medplum: https://www.medplum.com/blog/yc-medplum-hackathon-2026
- Vercel + Meta Fast Forward: https://palaner.com/events/luma-a37abac974
- Browser Use at YC (background): https://hackhq.io/customers/browser-use-hackathon and https://pipinstalleric.com/blog/yc-hackathon

---

## Verification log (2026-10-29)

An adversarial re-check of the most decision-relevant claims. Method: a live Firecrawl render of the BuilderBase event page (maxAge 0); curl of its JSON-LD; download of all 44 current JS chunks listed by `assets/index-Db8eI1Aj.js`, plus the cited chunk files (all still return HTTP 200 with JS), then grep for every quoted UI string; Exa fetches of the help-center articles, API docs, Terms, Devpost, Luma, and LinkedIn posts.

| # | Claim | Outcome |
|---|---|---|
| 1 | Five criteria, "Each criterion is scored 1 to 5", "top 8 finalists demo live for 2 minutes each" | **Confirmed** verbatim on the live BuilderBase page. All five criterion descriptions match the doc word for word |
| 2 | Teams up to 4 | **Confirmed** (BuilderBase "Teams are up to 4 people"; Luma "Teams of up to 4"). Manyfold's "2–4, no solo" claim is flagged unverified |
| 3 | JSON-LD organizer "Agent Relay"; Luma organizer "Builderbase Hackathons" | **Confirmed** |
| 4 | Schedule 16:00 deadline, 16–17 judging, 17–18 awards; judges "announced soon" | **Confirmed** on both pages; the judge list is still empty |
| 5 | Rubric is a "word for word" copy of Bitrig for four criteria | **Refuted / corrected.** The names match, but the descriptions were rewritten. Only the first UX sentence is identical |
| 6 | Bitrig: 73 submissions, 8 finalists, ~300 attendees; Karatzas and Brad Flora judged; video + screenshot required | **Confirmed** (Devpost: 157 registered participants, judges list, requirements; Dragoeva post: "Around 300 participated, 73 teams… 8 became finalists") |
| 7 | Submission UI strings (check-in gate, "Submit on behalf of team", checklist, "This action cannot be undone", upload block, deadline messages, `submission_deadline_effective`) | **Confirmed** in the cited chunks |
| 8 | "Draft · ready to submit" label | **Not found** in any current chunk. Removed and replaced with the actual labels |
| 9 | Organizer score-on-behalf quote "Scores you enter here are saved under the judge each row names…" | **Not found verbatim.** The behavior is confirmed, so the quote was replaced with the actual strings |
| 10 | Scoring modes Slider (1–5) / Dropdown (0/1/2 → 1/3/5); weight sum ≤100%; max 20 criteria; multi-round `top_n`/threshold/cross-track; "Teams nobody has scored are not ranked and cannot advance"; blind-judging text; "A team without a final submission can still be judged" | **Confirmed**, mostly in `routes-Cs8mGpxg.js` and `index-CWN0o_of.js` |
| 11 | API `calculate-results` "Aggregates submitted scores against criteria weights…", "Teams with no scores are skipped"; `overall_score` 4.1234; private comment excluded from team results | **Confirmed** on the API Judging page |
| 12 | GitHub integration: repos freeze at close, judges get read access, invite goes to the GitHub email | **Confirmed**. Added the 7-day invite expiry and the "last track's deadline" detail |
| 13 | Builder's Guide Ch.14/15 and Playbook Ch.08/15 quotes, timings, dates, author | **Confirmed** (Nate Rundberg; Ch.15 Playbook is dated 29 Apr 2026, the others 30 Apr) |
| 14 | Dell tour "top 8 at every stop"; Boston 150 builders / 40 teams; SF debut 343 apps / 29 teams / 19 demos | **Partly confirmed.** The figures are confirmed, but "every stop" is not, so the wording was softened |
| 15 | Browser Use (background): 78 submissions, 6 rooms, top 10, Impact 40/Creativity 20/Tech 20/Demo 20, 4-min semis | **Confirmed** on HackHQ. "2-min final pitches" could not be found in the participant blog, so it is marked unverified |
| 16 | Crate quote "an FX knob" | **Confirmed** as "The hinge becomes an FX knob", in Steven Zhang's post reshared by Mahin Bharathwaj. Attribution was clarified |
| 17 | Medplum 2 criteria; Fast Forward 9 finalists, 3 min; Pax Silica "by 4:00 sharp", Lovable/ElevenLabs rule | **Confirmed** |
| 18 | YC vs BuilderBase prize discrepancy | **Confirmed and expanded.** BuilderBase text also omits Superserve, though its logo is shown |

**Added (missing before):** the BuilderBase anti-cheating terms (§3.3); the earlier Devpost→BuilderBase platform switch; the YC office venue; the milestone-gate string; the GitHub invite expiry.

