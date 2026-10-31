<img src="assets/icon.svg" width="64" height="64" alt="">

# Afterlife

When an agent dies, its work doesn't. GPT starts a 6-step refund job, dies at step 3 (kill -9), the lease expires, the always-on dispatcher queues a Relay DM, and Claude boots, drains it, rebuilds steps 1-3 from the Relay channel, and finishes. The refund is issued exactly once.

## Runbook

1. `npm install` (Node >= 22). Put `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` in `.env` (see `.env.example`).
2. `npm run seed` creates the Relay workspace and agent tokens in `tokens/` (no-op if they exist; `npm run reset` makes a fresh run).
3. `npm run server` starts the always-on lease authority, dispatcher and board on http://localhost:4000. Leave it running.
4. `npm run demo` resets the board, opens it, starts workergpt (OpenAI), kills it with -9 after step 3 is checkpointed, waits for LOST (~8s), then starts standbyclaude (Claude), which drains the queued DM and finishes.
5. `npm run demo:zombie` does the same, but freezes the worker with SIGSTOP and wakes it with SIGCONT after Claude claims. Its late write is fenced (`REJECTED: epoch 1 < 2`) and shown as stale.
6. Drive a real run from the board (`/live`, or by curl): `POST /control/run {complaint?, zombie?}` -> `/control/kill` (or `/control/freeze` + `/control/thaw`) -> wait for LOST + DM -> `POST /control/standby`. `GET /control/state` shows pids. Logs: `logs/worker.log`, `logs/standby.log`.
7. Tune the video pace with `STEP_DELAY_MS=2500 STANDBY_DELAY=6 npm run demo`. Use `OPEN=0` to skip opening the browser.
7. Logs are in `logs/` (server, worker, standby, demo). The refund side effect goes to `outbox.jsonl`, which is truncated on each demo reset.
8. Manual mode: `npm run worker -- --task t1`, then `kill -9 <pid>`, then `npm run standby`.
9. Lease tests: `npm run test:lease`. Board mock with no backend: http://localhost:4000/?mock=1
10. If hosted Relay is overloaded, re-run `npm run demo`. The local engine fallback is `npm run relay:local` + `RELAY_BASE_URL=http://localhost:8787 npm run reset`.
