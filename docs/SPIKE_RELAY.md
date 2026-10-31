# Relay spike results (31 Oct 2026, ~14:15)

Target: hosted `https://cast.agentrelay.com` (anonymous workspace, `plan: free`). Package: `@agent-relay/sdk@14.0.0` (pulls `@relaycast/sdk@8.16.0`), `zod@4.6.7`, `tsx@4.23.15`, Node 25.8.0. The hosted path worked, so the local engine fallback was not needed and was not run.

Re-run: `npm run spike`. It uses its own throwaway workspace and `spike<rand>` names, so it never uses up the seeded identities.

## Results

| Check | Result |
|---|---|
| `AgentRelay.createWorkspace({name, baseUrl})` | PASS (260-730 ms) |
| `GET /v1/workspace` → `plan` | PASS, `free` |
| `workspace.register({name,type:'agent'},{strict:true})` | PASS. Re-registering throws `Agent "x" already exists` |
| `new AgentRelay({baseUrl, agentToken}).workspace.reconnect({apiToken})` with no workspace key | PASS |
| `channels.create` + `channels.join` (idempotent through the adapter) | PASS |
| `sendMessage({to:'#ch', text, metadata})`, then `messages.list(ch)` returns `metadata` | PASS |
| DM to an agent that has never connected | PASS (the message is queued) |
| DM `idempotencyKey` with the same payload | PASS: the same message id comes back. A different payload with the same key **throws** "Idempotency-Key was reused with a different request payload" |
| Queued DM pushed to `addListener('*')` on connect | **FAIL (by design)**. The WS only carries live events. Drain with `inbox.list` |
| `inbox.list({agentName})` drains the queued DM, then `inbox.ack` | PASS. A second drain is empty |
| Live `message.created` and `dm.received` through `addListener('*')` | PASS. The sender is `envelope.from.name` |
| DM metadata | **Gotcha.** It is stored, but `dm.received` events and inbox items arrive with **no metadata**. The adapter hydrates it via `messages.get(id)` (+1 RTT, live DM about 3 s end to end on hosted today) |
| `POST /v1/observer-tokens` (rk key) → `ot_live_` | PASS (201) |
| Observer REST `GET /v1/channels/:ch/messages` | PASS |
| Observer WS `wss://cast.agentrelay.com/v1/ws?token=ot_live_` | PASS. It sees `message.created`, `dm.received`, `channel.created` (JSON with `type`, `seq`, `message`) |

## Adapter: `agents/relay.ts`

```ts
import * as relay from './relay.ts';
await relay.connect('standbyclaude');                 // role or full name; reads tokens/<role>.token.json, never re-registers
await relay.ensureChannel('task42');                   // create-or-ignore, then join
const { id } = await relay.post('task42', text, { kind:'checkpoint', taskId, epoch, step, text });
const hist = await relay.listChannel('task42');        // RelayMsg[] oldest→newest, .data = metadata
await relay.dm('standbyclaude', text, { taskId, epoch, resumeFromStep, channel, summary }, `${taskId}:${epoch}`);
relay.onAny((m, raw) => {});                           // live: m.type 'channel'|'dm'|'thread', m.from, m.data (DMs hydrated)
const queued = await relay.drainDms();                 // MUST call on startup: offline DMs are not pushed
// RelayMsg = { id, type, from, channel?, conversationId?, text, data, ts }
// helpers: fullName(role), roleOf(name), runInfo(), getWorkspace(), createObserverToken(), observerWsUrl(ot)
// class RelayConn has the same methods if a process needs >1 identity (the spike does this).
```

- Base URL: `RELAY_BASE_URL` (either `https://cast.agentrelay.com` or `.../v1` works, because the adapter strips `/v1`). Default is hosted. Local: `RELAY_BASE_URL=http://localhost:8787` plus `npm run relay:local`, then `npm run reset`, because tokens are per engine.
- Agent processes need only their `at_live_` token. The `rk_live_` key stays in `tokens/workspace.json` and is used only by seed and observer-minting.

## Seeding

- `npm run seed`: if `tokens/run.json` exists for the same base URL it does nothing. Otherwise it creates the workspace `afterlife<runId>` and registers `workergpt<runId>`, `workergptb<runId>`, `standbyclaude<runId>`, `afterlife<runId>` with `strict:true`. It writes `tokens/{workspace,run,observer}.json` and `tokens/<role>.token.json`.
- `npm run reset`: new workspace and new runId (hosted caps about 5 agents per workspace, so each run gets its own workspace).
- Current seeded run: `ea72` (names `workergptea72`, `workergptbea72`, `standbyclaudeea72`, `afterlifeea72`). Observer token in `tokens/observer.token.json` (`.token`).

## Gotchas

1. `new AgentRelay({baseUrl})` without `agentToken` or `workspaceKey` throws "requires workspaceKey or agentToken". Pass `agentToken` before `reconnect`.
2. **Offline DMs are not replayed to listeners.** The standby must call `drainDms()` (`inbox.list` + `inbox.ack`) at boot, then `onAny` for live traffic.
3. DM `metadata` is dropped from events and inbox items. Hydrate with `messages.get(id)` (the adapter does this). Inbox items report a DM as `kind:'channel'` with a `dmch_` channel id (#1987), so don't branch on it.
4. The server adds `injection_mode` to DM metadata. Ignore extra keys.
5. An idempotency key must be reused with an identical payload. Build the handoff payload deterministically from `(taskId, epoch)`, or the retry throws.
6. Hosted returned `503 database_overloaded` (`retryAfterMs: 5000`) once during register. `seed.ts` retries, and if a retried create already landed it rotates (`strict:false`) to recover a token. Hosted latency today is up to a few seconds per call, so build in slack (the lease is 8 s; do not put Relay calls on the heartbeat path).
7. Channel message ids are snowflake strings, ordered by time. `listChannel` sorts by `createdAt`.
8. The Node SDK observer stream sends the token in a header. A browser must use `?token=ot_live_` (that is read-only and acceptable, but never put `rk_`/`at_` in a URL).
