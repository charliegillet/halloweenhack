# Terse / Durable Actors: GitHub and code reality

Checked 2026-10-29 (two days before Haunted Hacks, Oct 31 2026). Sources: `gh` CLI against the GitHub REST API, shallow clones of `TerseAI/durable-actors`, `TerseAI/Terse-Examples` and `TerseAI/whitechapel`, the npm and PyPI registries, the published `terse-cli@0.14.7` tarball (unpacked in an isolated temp directory and read, never executed), and `docs.useterse.ai/*.md`. This file covers only the GitHub and code angle: repos, activity, issues, examples, and the sharp edges a 5-hour team will hit. Positioning, pricing and social sentiment are covered in other files.

Labels used: **[verified]** means I read it directly from the API, the code or the docs. **[inference]** means my interpretation. Nearly everything here is from Aug-Oct 2026 because the main repo was created on 2026-08-30.

---

## 1. TL;DR

- **There are two layers with different names.** The open-source engine is `TerseAI/durable-actors` (MIT, Rust plus TS and Python SDKs, npm `durable-actors`, CLI `bunx durable-actors`). The hosted product Terse ships `terse-cli` and `terse-sdk` from a **private** repo, `TerseAI/Terse`, which returns 404 publicly. Those packages use the "Sustainable Use License", not MIT. `terse-sdk@0.14.7` pins `durable-actors@0.14.4` exactly. The official quickstart at docs.useterse.ai uses the hosted CLI (`terse init`, `terse actor dev`, `terse deploy`, `import ... from "terse-sdk/actor"`). The GitHub README uses the OSS CLI (`bunx durable-actors init/dev/generate`, `import ... from "durable-actors"`). **[verified]**
- **The project is very young and changes fast.** It has 290 stars and 22 forks (re-checked late Oct 29; it was 279/21 earlier that day), 103 releases between v0.1.0 (2026-09-02) and v0.14.4 (2026-10-29), and 5 releases on Oct 27-29 alone. v0.13.0 (Oct 27) broke clients generated with SDK <= 0.12.3. **[verified]**
- **Three people write almost all the code.** Of 374 commits, oliviersm199 has 261, tekaratzas 105 and thomas-terse 5. The other three contributors have one commit each. Of ~92 issues, 86 were filed by the team (or their Linear bot). On the first pass there were only 3 external issues, all security hardening, all still open. Late on Oct 29 (Pacific) an outside contributor, Will Washburn (`willwashburn`), opened #368, #369 and PR #370 (Drizzle ORM support), so there is now some outside interest in the SQLite API (section 7). GitHub Discussions is off. **[verified]**
- **Almost nobody else has built on it yet.** Code search finds no third-party repos importing `durable-actors` or `terse-sdk/actor`. The only hits are TerseAI's own repos. All 21 forks have 0-1 stars. **[verified]** For judges, a well-made project will stand out as one of the first real community builds. **[inference]**
- **The biggest gotchas:** you need Bun >= 1.4.2 (this machine has 1.3.14). The README's quickstart mutates a `@Persisted` array with `.push()`, but the SDK's own docs say nested mutations are *not saved*. Using `@Interleave` turns off rollback for the whole class. Default idle eviction is 10 s, and open WebSockets do not keep the actor alive. There are no Windows binaries. **[verified]**

---

## 2. Org and repo inventory

GitHub org: [TerseAI](https://github.com/TerseAI). Bio "Durable Agent Infrastructure", created 2025-09-03, 19 public repos, 8 followers. The useterse.ai homepage links to both `github.com/TerseAI/durable-actors` and `github.com/TerseAI/Terse`, and the second one 404s. **[verified]**

| Repo | Stars / forks | Created | Last push | What it is |
|---|---|---|---|---|
| [durable-actors](https://github.com/TerseAI/durable-actors) | 290 / 22 (late Oct 29) | 2026-08-30 | 2026-10-30 05:02 UTC | The OSS engine. MIT. Rust 2.0 MB, TS 1.17 MB, Python 0.34 MB of source. Topics: actor-model, durable-objects, sqlite. |
| [Terse-Examples](https://github.com/TerseAI/Terse-Examples) | 0 / 0 | 2026-10-18 | 2026-10-28 | Hosted-version templates (helloWorld, counter, mini-lovable). Source for `terse init --template`. No license file. |
| [durable-actors-mastra-example](https://github.com/TerseAI/durable-actors-mastra-example) | 0 / 0 | 2026-10-14 | 2026-10-18 | Multiplayer chat: Elysia + Mastra + Durable Actors, tmux-style split panes. |
| [durable-actors-openai-agents-sdk-python-example](https://github.com/TerseAI/durable-actors-openai-agents-sdk-python-example) | 0 / 0 | 2026-10-12 | 2026-10-12 | Python chat using the OpenAI Agents SDK + FastAPI. |
| [background-agents](https://github.com/TerseAI/background-agents) | 0 / 0 | 2026-10-13 | 2026-10-12 | "Open-Inspect", a background coding-agent system modelled on Ramp's Inspect. Single-tenant. |
| [whitechapel](https://github.com/TerseAI/whitechapel) | 0 / 1 | 2026-10-09 | 2026-10-09 | Two-player co-op AI detective game with `case-actor` and `scene-actor`. Hosted at whitechapel-rho.vercel.app per its README. |
| [talkingAgent](https://github.com/TerseAI/talkingAgent) | 0 / 0 | 2026-09-08 | 2026-10-08 | "Tik Tok Talk Demo": agents kept in sync via actors. |
| [MultiplayerAI-Backend](https://github.com/TerseAI/MultiplayerAI-Backend) | 0 / 0 | 2026-09-09 | 2026-09-22 | Gateway with both Cloudflare Durable Object and Terse adapters. Useful as a side-by-side migration reference. |
| [little-durable](https://github.com/TerseAI/little-durable) | 32 / 1 | 2026-08-30 | 2026-09-17 | Separate 33 kB durable-workflow SDK. Its README links a "tersecommunity" Slack. |
| terse-litestream, terse-ltx, terse-substrate, modal-rs | 0 | Oct 2026 | Oct 2026 | Rust infrastructure ports (Litestream LTX replication, Agent Substrate gRPC, Modal sandbox client). They show what the storage layer is built on. |
| TerseKit, SampleProjects, terse-data-plane-starter, docs (archived) | 0-1 | Mar-Sep 2026 | older | Background and legacy material, from before the actors pivot. |

**Star timeline:** I could not check this. The REST stargazers list endpoint returns 404 (re-checked Oct 29), so there is no per-star timestamp history. On the first pass GraphQL returned 0 while REST `stargazers_count` returned 279. On re-check, GraphQL `stargazerCount` and REST both return 290, so the count itself is now consistent. **[verified]**

**Packages:**

| Package | Latest | Notes |
|---|---|---|
| npm `durable-actors` | 0.14.4 | 53 versions since 2026-09-22. 9,661 downloads Sep 29 - Oct 28. |
| npm `terse-cli` | 0.14.7 | 167 versions since 2026-03-03. 8,071 downloads in the same window. Repo field points at the private `TerseAI/Terse`. |
| npm `terse-sdk` | 0.14.7 | 8,765 downloads. Exports `./actor`, `./proxy`, `./actors`, `./dev`. |
| PyPI `durable-actors` | 0.14.4 | 37 releases. Requires Python >= 3.11. |

Release cadence probably inflates the download counts (CI and bots re-install every version). **[inference]**

---

## 3. Activity and cadence (Aug-Oct 2026)

- **Commits:** about 374 total on `main` (first commit 2026-09-01). Weekly totals from GitHub's commit_activity: Aug 30 = 45, Sep 6 = 27, Sep 13 = 50, Sep 20 = 87, Sep 27 = 56, Oct 4 = 22, Oct 11 = 12, Oct 18 = 33, Oct 25 = 26 (partial week). Since Oct 22: Olivier Simard Morissette 30 commits, Thomas Karatzas 8. **[verified]**
- **Releases:** 103 releases in 58 days, about 1.8 per day. The latest run is v0.12.0 to v0.12.3 (Oct 25-26), v0.13.0 and v0.14.0 (Oct 27), then v0.14.1-v0.14.4 (Oct 28-29). Each release ships darwin-arm64, darwin-x64, linux-arm64 and linux-x64 runtime tarballs. **No Windows build.** [v0.14.4 assets](https://github.com/TerseAI/durable-actors/releases/tag/v0.14.4) **[verified]**
- **Where recent work went:** almost entirely into the hosted platform. That means warm-spare pools on GKE, Modal as a sandbox provider (v0.9.0), ClickHouse request telemetry, usage metering, org suspension, per-project activation limits (v0.11.0), Redis routing, and cold-start latency. SDK and developer-experience work was limited to `Unchecked<>` (#222), the `inspect` CLI (#219, #306), alarms (#196/#207), `@Atomic` (#200), the Pi-durable adapter (#202, #206), and the observability UI (#354, #358). **[verified from issue and PR titles]** So the managed cloud is actively hardened, but some developer-experience problems still remain (section 5). **[inference]**
- **Process:** issues are mostly auto-synced from Linear (`app/linear-code` author, branch-tracking rules in #190), and PRs often open in pairs next to their tickets. There is a CLA (`CLA.md`). Discussions is disabled, so community chat is Slack (link in the little-durable README) or GitHub Issues. **[verified]**

---

## 4. Issues and PRs that reveal sharp edges

### Open issues worth knowing about **[verified]**

There were 14 open issues on the first pass and 17 open issues plus 5 open PRs on re-check. The 3 new ones are #367-#369 (ORM and transactions, section 7).

| # | Title | Why it matters on Oct 31 |
|---|---|---|
| [#228](https://github.com/TerseAI/durable-actors/issues/228) | Support for Deleting instances | You **cannot delete an actor instance** or its SQLite DB through the API. Test instances pile up and clutter `inspect` / the observer. Use fresh actor IDs per demo run, e.g. `room-${Date.now()}`. |
| [#224](https://github.com/TerseAI/durable-actors/issues/224) | Error out if user tries to use generated code in frontend | The generated client is backend-only. Nothing yet stops you from bundling it, and the key that client carries (`TERSE_API_KEY` in hosted mode) would leak. The browser should get only a `websocketUrl` grant from your backend. |
| [#203](https://github.com/TerseAI/durable-actors/issues/203) | Lifecycle Re-vamp ("a monumental task") | Lifecycle semantics are known to be in flux. |
| PR [#212](https://github.com/TerseAI/durable-actors/pull/212) (open, external) | Add onWake and onSleep actor lifecycle hooks | There are **no `onWake`/`onSleep` hooks** today. The workarounds are `@Resource` with `onResume`/`onGracefulShutdown`, or constructor code (which reruns on every restore). |
| [#232](https://github.com/TerseAI/durable-actors/issues/232), [#233](https://github.com/TerseAI/durable-actors/issues/233) | expose pi-durable npm package; Pi-durable re-awakes | The Pi coding-agent integration is unfinished. The mini-lovable example brings in `@earendil-works/pi-durable` directly. |
| [#195](https://github.com/TerseAI/durable-actors/issues/195) | observability UI latency | The observer can lag. |
| [#193](https://github.com/TerseAI/durable-actors/issues/193) (15 comments), PR [#273](https://github.com/TerseAI/durable-actors/pull/273) | AWS / S3 support | Self-hosting is **GCP/GKE + GCS only** today. Not a hackathon concern if you use hosted or local. |
| [#177](https://github.com/TerseAI/durable-actors/issues/177) | Bound per-actor invocation queues | The per-actor mailbox is unbounded. A slow actor hit by a burst (e.g. an LLM call per message from many clients) queues work without backpressure. |
| [#178](https://github.com/TerseAI/durable-actors/issues/178), PR [#179](https://github.com/TerseAI/durable-actors/pull/179) | No request body cap on public control plane | Security hardening only. Irrelevant for a demo. |
| [#330](https://github.com/TerseAI/durable-actors/issues/330), [#324](https://github.com/TerseAI/durable-actors/issues/324), [#197](https://github.com/TerseAI/durable-actors/issues/197) | Faster restores; readable structured logs; OTLP export | Logs are not yet comfortable to read, and there is no OTLP export. |

### Recently closed bugs that show where it breaks **[verified]**

- [#351](https://github.com/TerseAI/durable-actors/issues/351) (fixed in 0.14.1, Oct 28): an immediate `db.exec` that rewrote a row with identical bytes (for example the same upsert twice in a resource's `onResume`) killed the actor's DatabaseService. The first activation failed with `actor activation was not completed: channel closed`, and **the JS code never saw an exception.** The team found it in its own mini-lovable demo. *If you are on < 0.14.1, upgrade.*
- [#359](https://github.com/TerseAI/durable-actors/issues/359) (fixed in 0.14.3): the observability timeline showed only 500 events, so after a burst you saw only the second half.
- [#362](https://github.com/TerseAI/durable-actors/issues/362) (fixed in 0.14.4, Oct 29): stale actor admission slots did not expire. Related to the hosted 500-active-actor quota.
- [#321](https://github.com/TerseAI/durable-actors/issues/321) (Oct 25): routing when a spare lost a cold-activation race.
- [#218](https://github.com/TerseAI/durable-actors/issues/218) (Oct 18): invocation JWTs with mismatched principal and capability actors were accepted. Fixed. Production issuance was not affected.
- [#222](https://github.com/TerseAI/durable-actors/issues/222) (Oct 18): "it's a huge pain to deal with ai-sdk, pi etc... chat messages. They don't play nice with our Type-safe generator." The fix is `Unchecked<T>` / `unchecked()`, which makes those fields `unknown` in the generated client.
- **Breaking change in v0.13.0** ([release notes](https://github.com/TerseAI/durable-actors/releases/tag/v0.13.0)): "clients generated with SDK 0.12.3 or earlier fail with 'control-plane response did not contain a valid actor host target'". Regenerate clients after any upgrade.

---

## 5. Gotchas from reading the code and docs

All of these are **[verified]** from the files cited. The "do this" advice is **[inference]**.

1. **Bun 1.4.2+ is required** by `durable-actors`, `terse-cli` and the monorepo `engines`. This machine reports `bun --version` = **1.3.14**, so `bunx durable-actors` / `terse` will refuse or misbehave. Run `bun upgrade` before Oct 31. Python actors need Python >= 3.11 and Pydantic >=2.12,<2.14 (v0.8.0 notes).
2. **The README quickstart's persistence bug.** The [README](https://github.com/TerseAI/durable-actors#quickstart-multiplayer-ai-chat) `ChatHistory` does `this.messages.push(...)` and `reply.content += chunk` on a `@Persisted` field. The [TypeScript guide](https://github.com/TerseAI/durable-actors/blob/main/docs/reference/typescript-guide.md) and the decorator JSDoc in `sdk/src/actor/decorators.ts` ("reassign objects and arrays to save changes") say nested mutations "only change memory; they are not saved, even at method completion". The `examples/ai-chat` actor does it correctly: `this.messages = [...this.messages, ...messages]`. **Always reassign**, and also reassign once after streaming finishes. Otherwise the demo loses history on reload or eviction, which is exactly the "durability" moment judges will test.
3. **`@Interleave` turns off rollback for the whole class.** Without it, a call holds the actor across every `await`, so a 20 s LLM stream blocks every other caller. With it on any method, "no call in that class rolls back". Writes are saved immediately by default anyway: progress survives a crash, and a throw does not undo earlier writes unless the method is `@Atomic` (typescript-guide.md line ~318). **Note that the guide contradicts itself:** line ~298 says "A failed call normally rolls back its field and SQLite changes." Do not rely on rollback unless you use `@Atomic`, and test it if your demo depends on it. **[verified contradiction; actual runtime behavior not tested]** Put streaming LLM methods in `@Interleave` actors, and keep money or score style invariants in a separate non-interleaved actor.
4. **Python `@interleave` is stricter.** Python methods run in worker threads, so an interleaved method can be preempted at any point, not only at `await`. The guide tells you to use a `threading.Lock` held in an `ephemeral()` field.
5. **Idle eviction defaults to 10 s** (`DURABLE_ACTORS_HOST_IDLE_TIMEOUT_MS=10000`, applies locally too). "Open WebSockets remain at the gateway and do not keep the sandbox alive." `@Ephemeral` fields reset on eviction. Running handlers delay eviction, but anything you meant to keep in memory between messages disappears after 10 s idle. Use `@Compute({ idleTimeoutMs: ... })` per class, or persist the state. Also: using any `@Compute` size other than the default skips the prewarmed sandbox pool and starts a fresh sandbox, which means slower cold starts.
6. **One alarm per actor.** `this.alarm.set(ts)` replaces the previous one. A "haunting every N seconds" loop has to re-arm inside `onAlarm`. `@Cron` was promised as a follow-up in #196 and is not shipped (not in the docs).
7. **SQLite restrictions.** `BEGIN/COMMIT/ROLLBACK/SAVEPOINT/ATTACH/VACUUM` are rejected. Only about 10 introspection PRAGMAs are allowed. Names starting with `__terse_` / `_litestream_` are reserved. Constructor and field-initializer SQL reruns on every restore, so make it idempotent (`CREATE TABLE IF NOT EXISTS`). In Python, `self.db` exists only inside a method or hook.
8. **Regenerate the client after every change to an actor's method signature** (`bunx durable-actors generate` or `terse actor generate`), and do it while `dev` is running, because generation fetches the contract from the server. A stale client gives confusing type or runtime errors.
9. **WebSocket auth is grant-based.** The backend calls `actors.X.prepareWebsocket({ actorId, metadata })`, and the browser must connect before `connectByMs`. Reconnects need a *new* grant, so the frontend reconnect logic has to call your backend again. The gateway answers raw-text `ping` with `pong` without waking the actor (and without resetting idle time).
10. **Actor-to-actor calls are not a first-class API.** The `Actor` base class exposes only `db`, `alarm`, `id`, `getConnections`, `getConnectionCount`, `setWebSocketAutoResponse` and `broadcast` (`sdk/src/actor/actor.ts`). I found no documented way for one actor to call another. The hosted `.env.example` says `TERSE_PROJECT_KEY` is injected into every run, which suggests calls go through a generated client over HTTP. **[inference, not verified]** For multi-agent designs, test this pattern on Oct 30 or route coordination through Agent Relay.
11. **Two CLIs, two import paths, conflicting docs.** Hosted quickstart: `bunx terse-cli@latest install` → `terse init counter --template counter` → `terse actor dev` → `terse deploy`, with code in `src/actor.ts` importing `terse-sdk/actor`. But the counter and helloWorld templates in Terse-Examples actually use `src/actors.ts`, and mini-lovable imports from `"durable-actors"` even though its package.json lists only `terse-sdk` (it works because the dependency is pulled in transitively). The `terse-cli` npm README still documents commands such as `terse test`, `replay`, `history` and `integrate` that are absent from the shipped `dist/index.js` command list. The shipped commands are `init, actor dev/generate, deploy, secrets list/add/remove/import, auth login/logout/status, org switch, target, dashboard, docs, install, update`. Pick one path, hosted or OSS, and stay on it.
12. **Deployed secrets go in `terse secrets add/import`.** Your local `.env` does not ship with `terse deploy` automatically. `terse secrets import` reads a `.env`. In the mini-lovable example, `MODAL_TOKEN_ID`/`MODAL_TOKEN_SECRET` "are reserved by the actor runtime", so it uses `SANDBOX_MODAL_*` names instead.
13. **Copied templates carry the Terse team's project ID.** `Terse-Examples/02_codingAgent/mini-lovable/actor/terse.config.json` has a hard-coded `projectId`. Delete or re-init it before `terse deploy`.
14. **Ports.** Local `dev` defaults to 7100, and Terse-Examples says "you can only run one example at a time" under `terse actor dev`. For two actor projects, set different `DURABLE_ACTORS_PORT` values and separate `.durable-actors/` data directories.
15. **Hosted quotas** ([configuration.md](https://github.com/TerseAI/durable-actors/blob/main/docs/reference/configuration.md)): at most 500 active actors per project, with start-rate limiting that returns `429 actor_start_rate_limited` and a `Retry-After` header. An "agent swarm with 1,000 actors" demo would hit this. Locally, limits are off by default.
16. **Windows:** no prebuilt runtime. Teammates on Windows need WSL or a Mac/Linux machine.
17. **No delete (see #228) and an observer capped at 500 events before 0.14.3.** Pin `durable-actors`/`terse-sdk` to **0.14.4/0.14.7 or later** on Oct 30, then **freeze**. With releases landing 2-4 times a day, don't run `bun update` mid-hack.

---

## 6. Official examples ranked for a 5-hour hack

| Example | Starts with | Fit for "Real-Time AI + Halloween" | Notes |
|---|---|---|---|
| `examples/ai-chat` (OSS) / `--template ai-chat` | `bunx durable-actors init x --template ai-chat` | High: streaming multiplayer LLM chat | Needs `OPENAI_API_KEY`. Two processes (`dev:actors`, `dev`). Gets persistence right. |
| `examples/chat`, `examples/documents` | `--template chat` / `documents` | Medium: shared room or collaborative doc base | Browser grant flow shown in chat's `backend.ts`. |
| durable-actors-mastra-example | clone | High: Mastra is a sponsor | Elysia + Vite. One actor per chat owns history and Mastra turns. Split panes are a nice demo visual. |
| Terse-Examples mini-lovable | `terse init x --template mini-lovable` | High wow-factor, high risk | Needs Modal credentials (sandbox), pi-durable 1.2.0, chord. It was the source of bug #351. Only use it if a teammate has Modal set up. |
| whitechapel | clone | High theme fit (gothic detective, co-op) | Large framework, Node 22.19, fal and Typesafe keys. Better as inspiration than as a base. All code must be written at the event anyway. |
| examples/background, examples/persistence | repo checkout | Low demo value | Good for learning `@Atomic` and background writes in 15 minutes. |

---

## 7. Community projects

- **None found outside TerseAI.** `gh search code` for `from "durable-actors"` and `"terse-sdk/actor"` returned only TerseAI/Terse-Examples and TerseAI/whitechapel. **[verified]**
- Forks: 21, nearly all created Oct 1-29, with 0-1 stars. They are mostly snapshots. Notable: `whatif-dev/devtools-db-oss-cloudflare-durable-actors` (1 star, pushed Oct 28) and `Aryan1718/durable-actors` (S3 work for #193). The 5 external PRs are GabrielBianconi, Kathircpe, mvanhorn x2 (one being the open lifecycle hooks PR), ANSHSINGH050404 and Aryan1718. **[verified]**
- **New outside activity (Oct 30 UTC, which is late Oct 29 Pacific):** `willwashburn` (Will Washburn) opened [#368](https://github.com/TerseAI/durable-actors/issues/368) (return rows in column order), [#369](https://github.com/TerseAI/durable-actors/issues/369) (nested transaction scope with rollback inside a call), and open PR [#370](https://github.com/TerseAI/durable-actors/pull/370), "Add Drizzle ORM support with db.query and db.transaction", which adds a `durable-actors/drizzle` entry point. Tekaratzas filed the matching [#367](https://github.com/TerseAI/durable-actors/issues/367) ("Support for SQLite ORM to be added into exec api") a few minutes earlier, so the team seems to be engaging with it. His GitHub profile gives no company. Whether he is connected to a host or sponsor is **(unverified)**. #370 is unmerged, so do not plan around Drizzle on Oct 31. **[verified]**
- No Agent Relay, Supabase or Mastra integration exists in the durable-actors repo itself. The Mastra example is a separate TerseAI repo. **[verified by grep of docs/examples]**

---

## 8. Limits / could not verify

- The star history and growth curve could not be retrieved because the stargazers list API returns 404. (The GraphQL/REST count mismatch seen on the first pass is now resolved: both say 290.)
- The private `TerseAI/Terse` repo (hosted CLI, SDK and control plane) cannot be inspected. Hosted-only behavior (deploy packaging, secrets sync, free-tier limits, cold-start latency on api.useterse.ai) is not verified here.
- I did not run the runtime. Local Bun is 1.3.14, and the task scope was research. The gotchas above come from docs, code and issues, not from hitting them myself.
- I did not confirm whether `terse init --template` accepts `helloWorld`/`counter`/`mini-lovable` exactly as named. The CLI help says templates come "from an example in github.com/TerseAI/Terse-Examples".
- The actor-to-actor invocation pattern is undocumented in the OSS guides, so the inference in gotcha 10 needs a hands-on test.
- npm download counts are probably inflated by the release cadence and CI.

---

## Hackathon implications

**What to build** (aimed at the Durable Actors iPhone track plus the grand prize):
- One actor per haunted "room", "séance" or "case". It holds `@Persisted @Emittable` state that every connected browser receives as `state`/`state_update`. LLM replies stream through `broadcast` from an `@Interleave` method. Use the alarm for timed hauntings that **keep running while every tab is closed**. Show the durability in the demo: kill the dev server or close every tab, reopen, and the state and the scheduled scare are still there. That is the one thing a plain Next.js + Supabase app can't fake, and it is what the Terse team keeps demoing (README GIF: "conversation state is durably persisted").
- For the both-sponsors bonus, use actors as each agent's durable brain and state, and Agent Relay for agent-to-agent messaging. This also works around the fact that actor-to-actor calls are not first-class (gotcha 10).
- Since no community projects exist yet, a clean, well-documented repo is itself a differentiator. The team ships about 2 releases a day and visibly reads issues, so filing one real, reproducible issue or PR found during the hack would be credible with the host judges. **[inference]**

**Setup to do before Oct 31 (Oct 29-30):**
1. `bun upgrade` to >= 1.4.2 on every teammate's laptop. Windows teammates set up WSL.
2. `bunx terse-cli@latest install` then `terse auth login`. Create an API key at app.useterse.ai. Do one full `terse init counter --template counter` → `terse actor dev` → `terse actor generate` → `terse deploy` round-trip so login, deploy and secrets problems surface early. Pre-thinking and setup are allowed. Event code must be written on the day.
3. Also run the OSS path once (`bunx durable-actors init t --template ai-chat`) so you can fall back to local-only if the hosted service misbehaves during the demo.
4. Note the working versions (`durable-actors@0.14.4`, `terse-sdk@0.14.7` as of Oct 29) and pin them exactly in package.json on the day.
5. Prepare `.env` with `OPENAI_API_KEY` (the $100 credits) and plan to run `terse secrets import .env` before deploying.
6. Test the actor-to-actor or actor-to-Agent-Relay call pattern in a throwaway project.

**Gotchas to keep in mind on the day:**
- Reassign persisted arrays and objects; never `.push()`.
- Regenerate the client after every signature change.
- Never import the generated client in the browser; serve WebSocket grants from a backend route.
- Fresh actor IDs per demo run (no delete).
- Remember the 10 s idle eviction when using `@Ephemeral`.
- One alarm per actor, so re-arm it in `onAlarm`.
- Don't use `BEGIN`/`COMMIT` in SQL.
- Stay under 500 active actors.
- Run `durable-actors observe` (or `terse dashboard`) on a second screen during the demo. Built-in observability is a selling point the team wants seen, and the 500-event cap is fixed in 0.14.3.

**What judges and the sponsor want** (from repo emphasis; **[inference]**): stateful, multiplayer, long-running AI where the actor is the backbone and not a cache. That covers the README's own framing ("chat systems... collaboration tools... agent swarms") and the event's "Software Factory, long-running agent, multiplayer AI". The team's own showcase repos (mini-lovable coding agent, Mastra multiplayer chat, background agents, co-op detective game) show what they think looks good.

---

## Sources

- https://github.com/TerseAI (org metadata via `gh api users/TerseAI`)
- https://github.com/TerseAI/durable-actors (README, `docs/reference/typescript-guide.md`, `python-guide.md`, `cli.md`, `configuration.md`, `examples/README.md`, `sdk/src/actor/actor.ts`, `sdk/src/actor/decorators.ts`, `package.json`, `sdk/package.json`)
- https://github.com/TerseAI/durable-actors/releases (v0.1.0 to v0.14.4; notes for v0.8.0, v0.9.0, v0.10.0, v0.11.0, v0.12.0, v0.13.0, v0.14.0, v0.14.4)
- Issues: https://github.com/TerseAI/durable-actors/issues/176, /177, /178, /193, /195, /196, /197, /203, /218, /222, /224, /228, /232, /233, /324, /330, /351, /359, /362
- PRs: https://github.com/TerseAI/durable-actors/pull/212, /273, /179, /163, /340
- https://github.com/TerseAI/Terse-Examples (README, `02_codingAgent/mini-lovable/actor/{src/actor.ts,package.json,terse.config.json,.env.example}`, `01_gettingStarted/counter`)
- https://github.com/TerseAI/durable-actors-mastra-example, https://github.com/TerseAI/durable-actors-openai-agents-sdk-python-example, https://github.com/TerseAI/background-agents, https://github.com/TerseAI/whitechapel, https://github.com/TerseAI/talkingAgent, https://github.com/TerseAI/MultiplayerAI-Backend, https://github.com/TerseAI/little-durable (READMEs)
- https://github.com/TerseAI/Terse (linked from useterse.ai, returns 404)
- https://docs.useterse.ai/llms.txt, https://docs.useterse.ai/quickstart.md, https://docs.useterse.ai/reference/typescript-sdk.md
- https://registry.npmjs.org/durable-actors, https://registry.npmjs.org/terse-cli, https://registry.npmjs.org/terse-sdk, https://registry.npmjs.org/@earendil-works/pi-durable; https://api.npmjs.org/downloads/point/last-month/{durable-actors,terse-cli,terse-sdk}
- https://pypi.org/pypi/durable-actors/json
- Added in verification: https://github.com/TerseAI/durable-actors/issues/367, /368, /369, https://github.com/TerseAI/durable-actors/pull/370, https://api.github.com/users/willwashburn, https://useterse.ai (raw HTML, for the GitHub links)
- `terse-cli@0.14.7` tarball (`package/README.md`, `package/LICENSE.md`, `package/dist/index.js` command and option strings)

---

## Verification log (2026-10-29)

Adversarial re-check run late on Oct 29 (Pacific) with `gh api`, a fresh shallow clone of `durable-actors` at commit `20d2899` (Oct 29 08:40 -0400), the npm/PyPI registries, `npm pack terse-sdk@0.14.7` (read only), and curl of docs.useterse.ai and useterse.ai.

| # | Claim | Outcome |
|---|---|---|
| 1 | durable-actors has 279 stars and 21 forks; created 2026-08-30; MIT; Discussions off | **Corrected.** The repo now has 290 stars and 22 forks, and its last push was 2026-10-30 05:02 UTC. Creation date, MIT license and Discussions being off are confirmed. |
| 2 | Star anomaly: GraphQL 0 vs REST 279 | **Corrected.** GraphQL and REST now both return 290. The stargazers list still returns 404. |
| 3 | 103 releases, v0.1.0 on 2026-09-02, v0.14.4 on 2026-10-29, nothing newer | **Confirmed.** There are exactly 103 releases. v0.1.0 was published 2026-09-02 12:12 UTC and v0.14.4 on 2026-10-29 12:44 UTC. |
| 4 | Contributors: oliviersm199 261, tekaratzas 105, thomas-terse 5, plus three with 1 commit each | **Confirmed** (GabrielBianconi, Kathircpe, mvanhorn). |
| 5 | `TerseAI/Terse` is private (404) and linked from useterse.ai; org bio, 19 repos, 8 followers | **Confirmed.** The raw homepage HTML contains both `github.com/TerseAI/Terse` and `github.com/TerseAI/durable-actors`. |
| 6 | v0.13.0 breaking-change quote | **Confirmed** word for word in the v0.13.0 release body (PR #340). |
| 7 | No Windows build; four OS/arch tarballs in v0.14.4 | **Confirmed** from the asset list. |
| 8 | Bun >= 1.4.2 required; local Bun is 1.3.14 | **Confirmed.** Both `package.json` and `sdk/package.json` engines and the npm `durable-actors`/`terse-cli` engines say this. `bun --version` returns 1.3.14. |
| 9 | README quickstart `.push()` / `+=` on a persisted field contradicts the docs; ai-chat example reassigns | **Confirmed.** See README lines 63-69, typescript-guide.md line 322, decorators.ts line 21, and examples/ai-chat/src/actors.ts line 12. |
| 10 | `@Interleave` disables rollback; writes persist on throw unless `@Atomic` | **Confirmed, with a caveat added.** The guide contradicts itself (line ~298 vs ~318), and gotcha 3 now flags this. |
| 11 | Idle eviction 10 s; open WebSockets do not keep the sandbox alive | **Confirmed** word for word in configuration.md line 42. |
| 12 | 500 active actors per project; `429 actor_start_rate_limited` with `Retry-After` | **Confirmed** (configuration.md lines 71 and 75). There is also an `actor_quota_exceeded` 429. |
| 13 | One alarm per actor; `BEGIN/COMMIT/...` rejected; `__terse_`/`_litestream_` reserved | **Confirmed** (typescript-guide.md lines 248, 340 and 342). |
| 14 | Issue states and titles: #228, #224, #203, #177, #193 open; PR #212 open by mvanhorn; #351, #359, #362, #222 closed on the stated dates | **Confirmed.** #351 closed Oct 28, #359 and #362 closed Oct 29, #222 closed Oct 18. |
| 15 | npm `durable-actors` 0.14.4 (53 versions, 9,661 downloads); `terse-cli` 0.14.7 (167 versions, 8,071); `terse-sdk` 0.14.7 (8,765), pins `durable-actors` 0.14.4; PyPI 0.14.4 (37 releases, Python >= 3.11) | **Confirmed.** `terse-cli` also pins `durable-actors` 0.14.4. |
| 16 | `terse-sdk` is under the "Sustainable Use License", not MIT | **Confirmed** from `LICENSE.md` in the 0.14.7 tarball. It is a mixed license header; the main body is the Sustainable Use License. |
| 17 | Hosted quickstart uses `bunx terse-cli@latest install`, `terse init counter --template counter`, `src/actor.ts`, `terse-sdk/actor`, `terse actor dev/generate`, `terse deploy`; Terse-Examples counter/helloWorld use `src/actors.ts` | **Confirmed.** |
| 18 | mini-lovable `terse.config.json` hard-codes a `projectId` | **Confirmed** (the ID is present). |
| 19 | No third-party code importing `durable-actors` / `terse-sdk/actor` | **Confirmed for code search.** `gh search code` hits only TerseAI/whitechapel, Terse-Examples and MultiplayerAI-Backend, and a package.json search hits only TerseAI repos. **Added:** new outside issues and PR from `willwashburn` (#368-#370). Any affiliation of his with a host is unverified. |
| 20 | No documented actor-to-actor call API | **Confirmed (absence).** No doc or README mentions one. The mechanism stays inferred and untested. |

Not re-checked in this pass: weekly commit_activity totals, the "86 of ~92 issues filed by team" split, fork creation dates, the `terse-cli` README vs `dist/index.js` command mismatch, and the claim that whitechapel is hosted on Vercel. Treat these as reported on the first pass, not independently re-verified. No fabricated quotes or URLs were found. Every quoted string checked appears in the cited source.
