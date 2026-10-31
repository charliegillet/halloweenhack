# Terse / Durable Actors: newest features (Aug to Oct 2026)

Researched 2026-10-29 (GitHub API clock read 2026-10-30 00:03 UTC at time of last call). Angle: changelog, releases, launches, blog posts and announcements, with exact dates and a GA/beta/announced-only split. Sources were GitHub releases and PRs (gh CLI), npm/PyPI registries, docs.useterse.ai raw Markdown, the useterse.ai RSS/sitemap, the YC launch JSON, HN Algolia, and X posts read through Nitter mirrors. Claude in Chrome was not used.

**Labels used below:** **[Verified]** means I read it directly in a primary source (release note, docs page, registry, repo). **[Inference]** means my reading of the evidence. **[Announced]** means the company said it, but I found no shipped code or docs for it.

---

## 1. TL;DR

- **The product is about 60 days old and changes several times a day.** The `TerseAI/durable-actors` repo was created on **2026-08-30**. It has published **103 GitHub releases**, running from v0.1.0 (2026-09-02 12:12 UTC) to **v0.14.4 (2026-10-29 12:44 UTC)**. Six releases (v0.13.0 to v0.14.4) came out between Oct 27 and Oct 29 UTC. **[Verified]** ([releases](https://github.com/TerseAI/durable-actors/releases))
- **Nothing is labelled "GA".** The versions are all 0.x, the release notes repeatedly say breaking wire-protocol changes need SDK and runtime upgraded together, and the founder calls the hosted service a **beta**: "We also released our cloud version in beta. bunx terse-cli@latest install" (tweet, **2026-10-29 07:25 UTC**). **[Verified]** ([mirror of status 2115706450454479170](https://teapawt.org/karatzas_thomas/status/2115706450454479170))
- **Launch timeline:** Show HN on **Oct 6** (53 points, 25 comments), "Introducing Durable Actors" tweet on **Oct 7**, comparison blog posts on **Oct 17**, hackathon announced on **Oct 19**, **Terse Cloud beta tweeted Oct 29 07:25 UTC**, and the **Launch YC post went live on 2026-10-29 19:30 UTC**, two days before the event. The Launch YC post body itself does **not** mention the Cloud beta or the install command; the founder's companion launch tweet (Oct 29 19:32 UTC) says "MIT Open Source + Cloud hosted version available". **[Verified]**
- **What the company most wants shown at the hackathon [Inference, supported by the sources below]:** (1) **multiplayer AI chat**, meaning one actor per room with streamed replies broadcast to everyone; (2) **coding agents and "software factories"**, meaning one actor that owns an agent loop plus a Modal sandbox through `@Resource`, as in their "mini-lovable" demo; (3) **agent coordination**, where the one-request-at-a-time mailbox protects shared state from many agents; (4) **deploying to Terse Cloud** with `terse deploy`.

---

## 2. Dated timeline (last ~90 days)

| Date (2026) | Event | Source |
|---|---|---|
| Jun 2 / Jun 24 / Jul 1 | *Background:* blog posts from the earlier "TypeScript-first workflow builder" product (Modal sandboxes, learning loops, typing). Terse pivoted from workflows to actors. | [RSS](https://www.useterse.ai/rss.xml), [Show HN Jun 2](https://news.ycombinator.com/item?id=48371847) |
| Aug 30 | `little-durable` (a 33 kB durable workflow SDK, 32 stars) and `durable-actors` repos created | gh API |
| Sep 2 to Sep 20 | v0.1.0 to v0.1.43 under the old name "little-actors": GCS-owned leases and snapshots, a `build` bundler, generated clients, signed WebSocket URLs | [v0.1.39 notes](https://github.com/TerseAI/durable-actors/releases/tag/v0.1.39) |
| Sep 21 | **v0.2.0**: project-scoped identities; "actor type" renamed to "actor name"; fresh DB required | [v0.2.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.2.0) |
| Sep 22 | `durable-actors` first published to npm; v0.2.5 renames env vars `DURABLE_OBJECT_*` to `DURABLE_ACTORS_*` | npm registry, [v0.2.5](https://github.com/TerseAI/durable-actors/releases/tag/v0.2.5) |
| Sep 23 | **v0.4.0**: actor calls move from gRPC to HTTP; generated clients become dependency-free | [v0.4.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.4.0) |
| Sep 27 | **v0.5.0**: new invocation protocol (`outcome_unknown`, no automatic replay), **project sessions** (`createActorSessionTransport`), prewarmed spares | [v0.5.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.5.0) |
| Sep 29 | **v0.6.0**: hosted actors move to Kubernetes with gVisor and a Rust control plane; Helm chart; 3 storage replicas; defaults of 0.25 vCPU / 256 MiB | [v0.6.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.6.0) |
| Sep 30 | **v0.7.0**: precompiled immutable bundles; Rapid append logs replace replica fleets (#126, #130); 5-minute actor sessions (#127) | [v0.7.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.7.0), PRs |
| Oct 3 | Gateway-owned WebSockets and actor **hibernation** (#153); `@Reentrant` renamed **`@Interleave`** (#154) | PRs |
| Oct 4 | Tracing support with metadata returned to the client (#160); embedded SQLite capture/restore (#156); invocation waterfall UI | PRs |
| Oct 5 | Python and TypeScript language guides plus runnable bank examples (#170) | PR #170 |
| Oct 6 | `@Sandbox` decorator renamed **`@Compute`** (v0.7.15, #172). **Show HN** posted 15:58 UTC (53 pts / 25 comments; it links a live latency counter at https://demo.useterse.ai/). "Terse is joining the YC F26 batch" tweet (15:56 UTC, about 23.9k views per mirror, the most-viewed Terse tweet found). | [HN 49980399](https://news.ycombinator.com/item?id=49980399), [tweet mirror](https://teapawt.org/karatzas_thomas/status/2107500256976085230) |
| Oct 7 | "Introducing Durable Actors" tweet (about 11.3k views per mirror on Oct 30); "DST coming soon" tweet; v0.7.16 **removes WebSocket reconnect** (#174) | [tweet mirror](https://xitter.cf/karatzas_thomas/status/2107872102829502622), [DST tweet](https://xitter.cf/karatzas_thomas/status/2107925182103068753) |
| Oct 8 / Oct 9 | `talkingAgent` agent-coordination demo ("almost won" a YC demo showcase); `whitechapel` multiplayer AI murder-mystery game (three.js; ElevenLabs speech-to-text and TTS via fal; Gemini dialogue; actors on Terse Cloud per its docs/deployment.md). It is the closest existing reference for a spooky voice-plus-actors Halloween demo. | [Oct 8 mirror](https://teapawt.org/karatzas_thomas/status/2108276198564638886), [@IncTerse replies](https://teapawt.org/IncTerse/with_replies) |
| Oct 10 | **v0.8.0**: separate control-plane/TS/Python images; **Bun 1.4.2+ required**; Python CLI via `uvx`; `this.db` in constructors; CRC32C validation | [v0.8.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.8.0) |
| Oct 12 to 14 | Sponsor-aligned example repos created: **OpenAI Agents SDK (Python)** (Oct 12 19:06 UTC), **background-agents (Open-Inspect)** (Oct 13 00:25 UTC, i.e. Oct 12 Pacific), **Mastra example** (Oct 14 00:32 UTC). | gh API |
| Oct 17 | Blog: "Terse vs Cloudflare Durable Objects" and "Terse vs Rivet Actors" | [blog](https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects), [RSS](https://www.useterse.ai/rss.xml) |
| Oct 18 | **v0.8.1**: async **Python** actors, **`@Atomic`**, **Alarms**, a **pi-durable adaptor**, the **`inspect` CLI**, and `Unchecked<>`. `Terse-Examples` repo created; commit "Moved these samples to be the hosted version". | [v0.8.1](https://github.com/TerseAI/durable-actors/releases/tag/v0.8.1), [Terse-Examples](https://github.com/TerseAI/Terse-Examples) |
| Oct 19 | Hackathon announced ("first (to our knowledge) Actor Hackathon"); "tiny Lovable" demo tweet; `mini-lovable` example added | [mirror](https://teapawt.org/karatzas_thomas/status/2112219511327965403), [mirror](https://teapawt.org/karatzas_thomas/status/2112273088759132217) |
| Oct 22 | **v0.9.0**: **Modal as a sandbox provider**; `@Compute` requests vs limits; single-zone GCS Rapid; **ClickHouse request telemetry** with a live dashboard; socket delivery over Redis pub/sub | [v0.9.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.9.0) |
| Oct 23 | v0.10.0: lifecycle and org usage tracking (billing groundwork); "Durable Objects are confusing" explainer video (about 12.8k views per mirror) | [v0.10.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.10.0), [mirror](https://teapawt.org/karatzas_thomas/status/2113686145225871790) |
| Oct 24 | v0.11.0: admin/billing suspension and runaway-start protection (multi-tenant SaaS hardening) | [v0.11.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.11.0) |
| Oct 25 | v0.12.0: nearest-zone Rapid placement; "first actor operation during spare assignment" (latency) | [v0.12.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.12.0) |
| Oct 26 | v0.12.3: **socket output publishes immediately; ordering is no longer guaranteed**. The founder **retweeted** a third-party post by @bensenescu: "here is a durable, horizontally scalable coding agent platform... Sandboxes, pi, Durable Actors" (not a Terse-authored tweet). | [v0.12.3](https://github.com/TerseAI/durable-actors/releases/tag/v0.12.3), [timeline mirror](https://teapawt.org/karatzas_thomas) |
| Oct 27 | **v0.13.0**: all calls go through the control plane; **clients generated with SDK ≤0.12.3 break**. v0.14.0: one warm-pool manager. | [v0.13.0](https://github.com/TerseAI/durable-actors/releases/tag/v0.13.0) |
| Oct 28 to 29 | v0.14.1 (Oct 28 19:59 UTC) to v0.14.4 (Oct 29 12:44 UTC): activation fix, an **actor browser with instance-residency visualization** (#337, merged Oct 28 23:45 UTC, released in v0.14.2 on Oct 29 00:11 UTC), history-range fix, stale admission-slot expiry. `terse-sdk` 0.14.7 (16:35 UTC) / `terse-cli` 0.14.7 (16:37 UTC) on Oct 29. | releases, npm |
| Oct 29 07:25 UTC | Founder tweet: "We also released our cloud version in beta. bunx terse-cli@latest install" | [mirror](https://teapawt.org/karatzas_thomas/status/2115706450454479170) |
| Oct 29 19:30 UTC | **Launch YC**: "Durable Actors: The perfect primitive for Multiplayer AI and Agent Coordination" (tagline "OSS alternative to Durable Objects"; links the whiteboard video and the mini-lovable demo video). Launch tweet at 19:32 UTC: "MIT Open Source + Cloud hosted version available". | [Launch YC](https://www.ycombinator.com/launches/WbG-durable-actors-the-perfect-primitive-for-multiplayer-ai-and-agent-coordination), [tweet mirror](https://teapawt.org/karatzas_thomas/status/2115889405642641730) |

---

## 3. Feature status matrix

Nothing here is GA in the formal sense: everything is pre-1.0. "Shipped" means it is in a tagged release or the live docs.

### Shipped and documented (safe to build on Saturday)

| Feature | Since | Notes / source |
|---|---|---|
| `@Persisted`, `@Ephemeral` fields, per-actor SQLite (`this.db`) | pre-Oct; constructor access in v0.8.0 | Each write is saved as it happens; a throw does not undo earlier writes. [TS reference](https://docs.useterse.ai/reference/typescript-sdk.md) |
| **`@Emittable`** state sync (`state` / `state_update` messages to sockets) | in docs | The headline real-time primitive and the basis of the quickstart counter. [quickstart](https://docs.useterse.ai/quickstart.md) |
| WebSockets: `onConnect/onMessage/onDisconnect`, tags, `broadcast` with `except`, auto ping/pong, `prepareWebsocket` grants with a `connectByMs` deadline | hibernation Oct 3 | The socket stays open while the actor is dormant. [concepts](https://docs.useterse.ai/concepts.md) |
| **`@Interleave`** (formerly `@Reentrant`) | renamed Oct 3 | Docs: use it for LLM calls or "Impact could be catastrophic". Using it on any method **disables rollback for the whole class**. |
| **`@Atomic`** | v0.8.1, Oct 18 | All-or-nothing writes for one method. |
| **Alarms** (`this.alarm.set`, `onAlarm`) | v0.8.1, Oct 18 | One alarm per actor; it fires while dormant. |
| **`@Resource`** (`ActorResource` with `onResume` / `onGracefulShutdown`) | in docs, Oct | Ties a Modal sandbox or harness to the actor lifecycle. The Pi example uses it. |
| **`@Compute({cpu, cpuLimit, memoryMiB, idleTimeoutMs})`** | renamed Oct 6; requests/limits Oct 22 | Non-default sizes skip the prewarmed pool, so expect slower cold starts. |
| `Unchecked<T>` | v0.8.1 | Opts complex types (AI SDK, pi-durable) out of client codegen. |
| Generated typed clients (`terse actor generate`) | v0.4.0+ | Dependency-free. Must be regenerated after any public API change. |
| **Python SDK** (async actors, generated clients, `uvx` CLI) | v0.8.0 / v0.8.1 | PyPI `durable-actors` 0.14.4 (Oct 29). The hosted Terse docs only cover TypeScript. |
| `inspect` / `observe` CLI and local observability UI | v0.8.1 / v0.11.1 | `inspect ActorName/id --json` prints the latest persisted state. [OSS CLI doc](https://github.com/TerseAI/durable-actors/blob/main/docs/reference/cli.md) |
| Project sessions (short-lived RPC tokens) | v0.5.0 | Not for WebSocket access. |
| `terse secrets add/import/list` | in docs | Use `SANDBOX_MODAL_TOKEN_*` names on Cloud; the plain `MODAL_TOKEN_*` names are reserved. ([mini-lovable README](https://github.com/TerseAI/Terse-Examples/tree/main/02_codingAgent/mini-lovable)) |
| Self-host via Helm on GCP | v0.6.0+ | [self-hosting.md](https://github.com/TerseAI/durable-actors/blob/main/docs/self-hosting.md) |

### Beta

| Feature | Evidence |
|---|---|
| **Terse Cloud** (managed hosting: `bunx terse-cli@latest install`, `terse deploy`, app.useterse.ai API keys, `https://api.useterse.ai/<project>/actors`) | Founder tweet, **Oct 29 07:25 UTC**: "We also released our cloud version in beta" ([mirror](https://teapawt.org/karatzas_thomas/status/2115706450454479170)). On Oct 6 a founder thread reply under the YC F26 tweet still said "(hosted version coming soon)"; examples were switched to hosted on Oct 18 ("Moved these samples to be the hosted version", Terse-Examples commit 2026-10-18 23:19 UTC), so some hosted access existed about 11 days before the public beta tweet. |
| Hosted dashboard features: ClickHouse request telemetry and live dashboard (v0.9.0, marked "optional"), actor browser and residency view (v0.14.2, Oct 28) | Release notes only, with no user docs. **[Inference]** These are what you see in the Cloud app. |
| Modal as a sandbox provider (v0.9.0) | Shipped in the runtime; no hosted-docs page. |

### Announced or in progress (do not rely on these)

| Item | Status | Source |
|---|---|---|
| **"Export SQLite table via CLI + MCP"** for agent debugging | Show HN (Oct 6) said "coming soon, like today"; the Oct 7 tweet listed it as a difference from DO. The `inspect` CLI shipped. **I found no MCP server or table-export command in the docs or CLI reference.** | [HN](https://news.ycombinator.com/item?id=49980399) |
| Deterministic simulation testing (DST), with Workers IO | Tweet "DST coming soon" on Oct 7 | [mirror](https://xitter.cf/karatzas_thomas/status/2107925182103068753) |
| `onWake` / `onSleep` lifecycle hooks | Open PR #212 (Oct 15); issue #203 "Lifecycle Re-vamp" | gh |
| AWS / S3 storage | Issue #193, open PR #273 (Oct 22) | gh |
| Deleting actor instances | Issue #228 (Oct 18), open | gh |
| OTLP export of host and control-plane logs; readable structured logs | Issues #197, #324 | gh |
| pi-durable re-awakes; `expose-pi-durable` npm package | Issues #233, #232 | gh |
| Bounded per-actor queues; request body limits | Issues #177, #178, PR #179 | gh |

---

## 4. Packaging gotcha: two SDK names

- **OSS:** npm `durable-actors` (MIT, repo `TerseAI/durable-actors`, CLI `bunx durable-actors dev`, import path per README). Latest 0.14.4.
- **Hosted:** npm **`terse-sdk`** (import `terse-sdk/actor`) and **`terse-cli`** (`terse actor dev`, `terse deploy`). Their repository field points at `TerseAI/Terse` (returns 404, so private) and the license is "SEE LICENSE IN LICENSE.md", not MIT. `terse-sdk` depends on `durable-actors`. Both are at 0.14.7, published 2026-10-29. **[Verified]** (npm registry)
- `terse-sdk`'s npm description still reads "TypeScript SDK for building workflows", left over from the workflow-builder era. The package versions date back to March 2026.
- **[Inference]** For the hackathon, follow **docs.useterse.ai plus `terse-cli`**, because that is the path the hosts own and can debug. Don't mix the `durable-actors` and `terse-sdk` imports in one project.

---

## 5. Breaking changes from the last 2 weeks

- **v0.13.0 (Oct 27):** clients generated with SDK 0.12.3 or earlier fail with `control-plane response did not contain a valid actor host target`. Fix: upgrade, then run `terse actor generate` again. The notes add that new clients also work against older control planes, so "upgrade clients first". ([notes](https://github.com/TerseAI/durable-actors/releases/tag/v0.13.0))
- **v0.12.3 (Oct 26):** socket messages **can arrive out of order**, and a send immediately followed by close **can be dropped**. For streamed LLM tokens, add a sequence number on each message and reorder on the client. ([notes](https://github.com/TerseAI/durable-actors/releases/tag/v0.12.3))
- **v0.7.16 (Oct 7):** WebSocket auto-reconnect was removed, so write your own client reconnect that requests a fresh grant.
- **v0.8.0 (Oct 10):** Bun **1.4.2+** is required.
- Versions are moving fast: on Oct 29 alone npm got 3 `durable-actors` releases (0.14.2 to 0.14.4) and 4 `terse-sdk`/`terse-cli` releases (0.14.4 to 0.14.7). **Pin exact versions** on hack day; the mini-lovable example pins `terse-sdk` 0.14.2.

---

## 6. What Terse most wants showcased (evidence-weighted)

1. **Multiplayer AI chat / shared agents.** This is the README's lead quickstart ("Multiplayer AI Chat", TeamAgent GIF), plus the Mastra example (split panes, a shared room per chat ID), the OpenAI Agents SDK example, and the Launch YC framing ("perfect primitive for Multiplayer AI"). **[Verified]**
2. **Coding agents and software factories.** Evidence: mini-lovable (Oct 19; the Launch YC post links its demo video), Open-Inspect background-agents (repo created Oct 13 UTC), the founder's Oct 19 tweet "Maybe it becomes a software factory", and an Oct 26 third-party post by @bensenescu (retweeted by the founder) calling it a "durable, horizontally scalable coding agent platform... Sandboxes, pi, Durable Actors". The event page also says "build your own Software Factory, long-running agent, multiplayer AI system". **[Verified]**
3. **Agent coordination and concurrency safety.** The talkingAgent demo (repo created Sep 8; demo tweeted Oct 8) and the HN pitch ("you can protect critical data such as a CRM and allow multiple agents to run concurrently without worrying about data races"). The Launch YC post repeats it: "Agents are becoming like threads now... they sometimes need to share a CRM record, a code base etc". **[Verified]**
3b. **Cost and scale story (relevant to the Supabase prize).** Launch YC: "Our actors go dormant and back up in S3 when not in use... Because each actor has its own database and websocket server, we remove a ton of pressure from your main DB as well as your websocket server". **[Inference]** "S3" here reads as shorthand for object storage: the shipped runtime persists to GCS (v0.6.0 to v0.12.0 notes), and AWS/S3 support is still an open PR (#273). **[Verified quote]**
4. **The newest primitives:** `@Resource` with Modal sandboxes, Alarms, `@Atomic`, `@Interleave`, `@Compute`, and Python actors, all shipped Oct 3 to Oct 22. **[Inference]** A demo that visibly uses Alarms (for long-running or scheduled agents) and `@Resource` shows the features the team just built.
5. **Terse Cloud deploy.** The beta launched days before the event and the CTA is `bunx terse-cli@latest install`. **[Inference]** A live URL on Terse Cloud, not localhost, is what the host wants to see.
6. **Sponsor fit:** the team has already built Mastra and OpenAI examples, so combining Terse with Mastra or OpenAI is pre-validated.

---

## 7. Limits / could not verify

- **No official changelog page exists.** `docs.useterse.ai/changelog` returns 404, and `useterse.ai/changelog` serves the homepage. GitHub Releases is the only changelog ("Follow development and release notes on GitHub Releases", README).
- **Terse Cloud beta date:** now pinned to the founder tweet at 2026-10-29 07:25 UTC (see verification log). **No pricing or free-tier info exists publicly:** `useterse.ai/pricing` serves the homepage and the docs never mention price, limits, or quotas. Assume beta quotas are whatever the hosts grant on the day (unverified).
- Teapawt/xitter mirrors were used for X. View and like counts come from those mirrors and may be stale. I did not fetch the original x.com URLs. `nitter.rdrama.net` returned a gateway error on Oct 30 and was replaced as a source.
- GitHub code search was rate-limited mid-research, so the "no MCP" finding is based on the docs and CLI reference, not a full code search.
- The `TerseAI/Terse` repo (hosted CLI/SDK source) is private or 404, so I could not inspect `terse-cli` internals.
- No Terse-specific hackathon judging rubric beyond the event page. I found no evidence of any Terse integration with Agent Relay (a `gh search code relay --owner TerseAI` on Oct 30 returned only unrelated socket-relay code), so a Durable Actors + Agent Relay bridge would be novel and would have to be built on the day.
- Performance numbers from the Show HN (p95: durable write 85.6 ms, stateful read 2.14 ms, warm-up 334 ms) are self-reported, and they predate the v0.9 to v0.14 latency work.

---

## 8. Hackathon implications

**What to build (aligned with what Terse is pushing):**
- A **multiplayer, real-time agent room**: one actor per room or session, `@Persisted` history, `@Emittable` state, and streamed LLM output broadcast to every connected client. Mark the LLM-calling method `@Interleave`.
- Better for the grand prize: a **mini software factory or haunted coding agent**. One actor owns a Pi or OpenAI agent plus a Modal/Freestyle/Superserve sandbox through **`@Resource`**, and **Alarms** drive long-running or scheduled work. Agents coordinate through actors and talk to each other over Agent Relay for the "both" bonus.
- Show **durability on stage**: kill the client or let the actor go dormant (10 s idle), reconnect, and the state and history come back. Use `inspect --json` or the Cloud actor browser to show live state.

**Gotchas:**
- Don't block the mailbox: an un-interleaved LLM call serializes every caller. Interleaving disables class-wide rollback, so use `@Atomic` where it matters.
- Socket ordering is not guaranteed (v0.12.3). Add sequence numbers.
- Reconnect logic is your job (v0.7.16).
- Regenerate clients after every public API change and after any SDK upgrade (v0.13.0 break).
- Only one example or dev server per machine, because port 7100 is fixed by default; use `--port` for a second.
- `@Compute` non-default sizes skip warm spares, so cold starts are slower. Keep the defaults for the demo.
- Never put `TERSE_API_KEY` in browser code. The backend issues `prepareWebsocket` grants.
- On Cloud, use `SANDBOX_MODAL_TOKEN_ID/SECRET`, not `MODAL_TOKEN_*`.

**Setup to do before Oct 31** (allowed: the rules say all code must be written at the event, but setup and ideas are fine):
1. Install Bun ≥1.4.2 and run `bunx terse-cli@latest install`, then `terse auth login`.
2. Run the quickstart counter locally and `terse deploy` once to validate Cloud beta access and get an API key.
3. Clone and run `Terse-Examples` (`bun run example mini-lovable`) and `durable-actors-mastra-example` to learn the patterns. Do not reuse that code in the submission.
4. Pre-create accounts and keys for OpenAI, Modal or Freestyle/Superserve, and Agent Relay, and store them with `terse secrets import .env`.
5. Re-check the GitHub releases on the morning of Oct 31 for new breaking changes, and pin versions.

**What judges and sponsors want:** visible use of Durable Actors as the stateful core (not a bolt-on), real-time multi-user or multi-agent interaction, and ideally Agent Relay as well. For the Supabase "scale to millions" prize, pitch the HN/YC argument that each actor has its own SQLite and goes dormant, which takes load off the central DB and WebSocket tier.

---

## Sources

- https://github.com/TerseAI/durable-actors (repo; created 2026-08-30, MIT; 279 stars / 21 forks on 2026-10-29, 290 stars / 22 forks on recheck 2026-10-30 ~05:30 UTC)
- https://github.com/TerseAI/durable-actors/releases (v0.1.3 to v0.14.4; tags cited inline)
- https://github.com/TerseAI/durable-actors/blob/main/docs/reference/cli.md
- https://github.com/TerseAI/durable-actors/blob/main/docs/self-hosting.md
- https://github.com/TerseAI/Terse-Examples
- https://github.com/TerseAI/durable-actors-mastra-example
- https://github.com/TerseAI/durable-actors-openai-agents-sdk-python-example
- https://github.com/TerseAI/background-agents
- https://github.com/TerseAI/talkingAgent
- https://github.com/TerseAI/whitechapel
- https://github.com/TerseAI/little-durable
- https://docs.useterse.ai/llms.txt
- https://docs.useterse.ai/quickstart.md
- https://docs.useterse.ai/concepts.md
- https://docs.useterse.ai/reference/cli.md
- https://docs.useterse.ai/reference/typescript-sdk.md
- https://www.useterse.ai/ and https://www.useterse.ai/rss.xml and https://www.useterse.ai/sitemap.xml
- https://www.useterse.ai/blog/terse-vs-cloudflare-durable-objects (2026-10-17)
- https://www.useterse.ai/blog/terse-vs-rivet-actors (2026-10-17)
- https://www.ycombinator.com/launches/WbG-durable-actors-the-perfect-primitive-for-multiplayer-ai-and-agent-coordination (created 2026-10-29T19:30Z)
- https://www.ycombinator.com/companies/useterse
- https://news.ycombinator.com/item?id=49980399 (Show HN, 2026-10-06)
- https://registry.npmjs.org/terse-sdk , https://registry.npmjs.org/terse-cli , https://registry.npmjs.org/durable-actors
- https://pypi.org/project/durable-actors/
- https://teapawt.org/karatzas_thomas (timeline mirror; replaces nitter.rdrama.net, which returned a gateway error on 2026-10-30)
- https://teapawt.org/karatzas_thomas/status/2115706450454479170 (Oct 29 07:25 UTC, cloud beta)
- https://teapawt.org/karatzas_thomas/status/2115889405642641730 (Oct 29 19:32 UTC, Launch YC tweet)
- https://demo.useterse.ai/ (counter demo linked from Show HN)
- https://teapawt.org/karatzas_thomas/status/2107500256976085230 (Oct 6)
- https://xitter.cf/karatzas_thomas/status/2107872102829502622 (Oct 7)
- https://xitter.cf/karatzas_thomas/status/2107925182103068753 (Oct 7, DST)
- https://teapawt.org/karatzas_thomas/status/2112219511327965403 (Oct 19, hackathon)
- https://teapawt.org/karatzas_thomas/status/2112273088759132217 (Oct 19, mini-lovable)
- https://teapawt.org/karatzas_thomas/status/2113686145225871790 (Oct 23)
- https://teapawt.org/IncTerse/with_replies
- https://deniz.in/terse-open-sources-durable-actors-a-self-hostable-alternative-to-cloudflare-dura (secondary coverage, 2026-10-07)

---

## Verification log (2026-10-29)

Adversarial re-check run late on 2026-10-29 Pacific (GitHub/npm clocks read 2026-10-30 ~05:30 UTC). Each claim was re-fetched from a primary source with the aim of refuting it.

| # | Claim checked | Method / source | Outcome |
|---|---|---|---|
| 1 | Repo created 2026-08-30; "100+ releases, v0.1.3 to v0.14.4" | `gh api repos/TerseAI/durable-actors` + paginated releases | **Corrected.** Created 2026-08-30 14:37 UTC (confirmed). 103 releases; the first is **v0.1.0** (2026-09-02 12:12 UTC), not v0.1.3. v0.14.4 at 2026-10-29 12:44 UTC confirmed. |
| 2 | "Five releases Oct 27 to 29" | release timestamps | **Corrected to six** (v0.13.0, v0.14.0, v0.14.1, v0.14.2, v0.14.3, v0.14.4). |
| 3 | Star/fork count 279 / 21 | gh API | Moving number: **290 stars / 22 forks** at recheck. Both values kept with dates. MIT license confirmed. |
| 4 | Cloud beta quote and "date could not be pinned" | teapawt mirror of @karatzas_thomas timeline (nitter.rdrama.net returned "Gateway Error") | **Quote verified; date now pinned**: status 2115706450454479170, **2026-10-29 07:25 UTC**. Limits section updated. |
| 5 | Launch YC "paired with the Terse Cloud beta (`bunx terse-cli@latest install`)" | Launch YC page JSON (`created_at` 2026-10-29T19:30:00.301Z) | **Partly refuted.** The timestamp and title are right, but the post body never mentions the beta or the install command. The pairing comes from separate founder tweets (07:25 UTC beta; 19:32 UTC "Cloud hosted version available"). Text corrected. Added the post's S3/dormancy cost quote. |
| 6 | Oct 26 "durable, horizontally scalable coding agent platform" tweet attributed to Terse | teapawt timeline | **Corrected.** It is a **retweet of @bensenescu** (third party), not a Terse-authored post. Fixed in the timeline and section 6. |
| 7 | Show HN Oct 6, 53 pts / 25 comments, perf numbers, "coming soon, like today" MCP export | HN Algolia item 49980399 | **Verified** (15:58:19 UTC, author thomask1995). Perf p95 numbers and the MCP quote match verbatim. Added the demo.useterse.ai link. |
| 8 | Tweet dates and view counts (Oct 6, 7, 8, 19, 23) | teapawt status pages | Dates verified. Oct 7 views corrected from ~10.5k to **11,346**. Oct 23 at 12,887 confirmed (~12.8k). Hackathon tweet text confirmed ("first (to our knowledge) Actor Hackathon", prizes: YC interview, iPhone duo, Mac mini). The Oct 6 "hosted version coming soon" is in a thread reply (confirmed). |
| 9 | Breaking changes v0.7.16, v0.8.0 (Bun 1.4.2+), v0.12.3 (out-of-order sockets), v0.13.0 (client break) | release bodies | **All verified.** Added the v0.13.0 note that new clients work with old control planes ("upgrade clients first"). |
| 10 | v0.8.1 features (async Python, @Atomic, Alarms, pi-durable adaptor, inspect CLI, Unchecked) and v0.9.0 (Modal provider, ClickHouse telemetry "optional", Redis pub/sub) | release bodies | **Verified.** |
| 11 | Docs claims: `bunx terse-cli@latest install`; @Interleave "Impact could be catastrophic"; class-wide no-rollback; 10 s dormancy; port 7100; `TERSE_API_KEY` stays out of browser; `connectByMs`; non-default @Compute skips prewarmed sandboxes | docs.useterse.ai quickstart/concepts/cli/typescript-sdk `.md` | **All verified verbatim.** `docs.useterse.ai/changelog` 404 confirmed. |
| 12 | npm: `terse-sdk`/`terse-cli` 0.14.7, private `TerseAI/Terse` repo, "SEE LICENSE IN LICENSE.md", depends on `durable-actors`, "3 npm releases Oct 29" | registry.npmjs.org | Verified (sdk 16:35 UTC, cli 16:37 UTC; packages created 2026-03-03). `durable-actors` npm first published 2026-09-22 confirmed. **Release count clarified:** 3 for `durable-actors`, 4 for `terse-sdk`/`terse-cli`. PyPI `durable-actors` 0.14.4 (2026-10-29 12:58 UTC) confirmed. |
| 13 | mini-lovable pins `terse-sdk` 0.14.2; `SANDBOX_MODAL_TOKEN_*` names; `bun run example mini-lovable` | Terse-Examples tree, `actor/package.json`, `actor/.env.example`, `client/README.md` | **Verified.** The `.env.example` also notes the platform injects `TERSE_PROJECT_KEY` into actor runs. |
| 14 | Example repo dates (OpenAI Oct 12, background-agents Oct 12, Mastra Oct 14, Terse-Examples Oct 18, whitechapel Oct 9) | gh API | background-agents is **Oct 13 00:25 UTC** (Oct 12 Pacific); clarified. The others are confirmed. talkingAgent repo dates from Sep 8 (the demo tweet was Oct 8). whitechapel uses three.js (package.json) and ElevenLabs Scribe v2 / Turbo v2.5 **via fal** (docs/deployment.md), with case, scene and conversation actors on **Terse Cloud**. Confirmed. |
| 15 | Open roadmap items (#212, #273, #228, #193, #203, #197, #324, #233, #232, #177, #178) still open; PR dates #153/#154/#160/#156/#170/#172/#174/#337 | gh API | **All verified** (all listed issues and PRs are still open; merge dates match). |
| 16 | Blog posts dated Oct 17; earlier blog posts Jun 2 / Jun 24 / Jul 1; Show HN Jun 2 (workflow builder) | RSS feed, HN item 48371847 | **Verified.** |
| 17 | Terse Cloud pricing | useterse.ai/pricing, docs | **Not found**: `/pricing` serves the homepage. Recorded as unverified in Limits. |

Not re-checked: the `deniz.in` secondary article; Python SDK coverage in the hosted docs beyond the four llms.txt pages (llms.txt lists only TypeScript pages, which is consistent with the claim).
