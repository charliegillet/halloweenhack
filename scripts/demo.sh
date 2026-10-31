#!/usr/bin/env bash
# Afterlife demo: GPT worker dies at step 3 (kill -9), lease expires, Relay DM queued, Claude standby boots and finishes.
# Env: STEP_DELAY_MS (default 1500), STANDBY_DELAY (s, default 4), OPEN=0 to skip opening the board, ZOMBIE=1 for the zombie beat.
set -euo pipefail
cd "$(dirname "$0")/.."
S=${AFTERLIFE_SERVER:-http://localhost:4000}
export STEP_DELAY_MS=${STEP_DELAY_MS:-1500}
STANDBY_DELAY=${STANDBY_DELAY:-4}
mkdir -p logs
[ -f tokens/run.json ] || npm run seed
if ! curl -sf "$S/health" >/dev/null; then
  echo "[demo] starting always-on server"
  nohup node --import tsx server/index.ts > logs/server.log 2>&1 &
  for i in $(seq 1 60); do curl -sf "$S/health" >/dev/null && break; sleep 0.5; done
fi
curl -sf -XPOST "$S/reset" >/dev/null
[ "${OPEN:-1}" = "1" ] && (open "$S" 2>/dev/null || true) && sleep 3
TASK=refund$(date +%H%M%S)
if [ "${ZOMBIE:-0}" = "1" ]; then ROLE=workergptb; else ROLE=workergpt; fi
echo "[demo] task $TASK: starting $ROLE (OpenAI)"
node --import tsx agents/worker.ts --name $ROLE --task "$TASK" > logs/worker.log 2>&1 &
WPID=$!
WATCH_PID=$WPID node scripts/wait.mjs "$TASK" step3 120 || { echo "[demo] worker failed, see logs/worker.log"; tail -5 logs/worker.log; exit 1; }
if [ "${ZOMBIE:-0}" = "1" ]; then
  echo "[demo] kill -STOP $WPID (worker frozen mid step 4)"; kill -STOP $WPID
else
  echo "[demo] kill -9 $WPID (worker dies after step 3)"; kill -9 $WPID
fi
node scripts/wait.mjs "$TASK" lost 30
node scripts/wait.mjs "$TASK" dm 120 || echo "[demo] WARNING: handoff DM not confirmed yet; standby will pick it up live"
sleep "$STANDBY_DELAY"
echo "[demo] starting standbyclaude (Claude); it was offline when the DM was sent"
node --import tsx agents/standby.ts --name standbyclaude > logs/standby.log 2>&1 &
SPID=$!
if [ "${ZOMBIE:-0}" = "1" ]; then
  node scripts/wait.mjs "$TASK" claimed 60; sleep 3
  echo "[demo] kill -CONT $WPID (zombie wakes, tries its late write)"; kill -CONT $WPID
fi
wait $SPID || true
node scripts/wait.mjs "$TASK" done 10
[ "${ZOMBIE:-0}" = "1" ] && (wait $WPID 2>/dev/null || true)
echo "[demo] outbox.jsonl refunds: $(grep -c . outbox.jsonl || true)"
tail -n 1 outbox.jsonl
