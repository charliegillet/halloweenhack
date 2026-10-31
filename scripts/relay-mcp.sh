#!/usr/bin/env bash
# Agent Relay MCP servers for coding agents (Claude Code, Codex, Cursor) in this repo.
#   relay-mcp.sh            -> @relaycast/mcp (hosted Relaycast tools: message.post, message.dm.send, channel.list, ...)
#   relay-mcp.sh official   -> agent-relay mcp (official CLI server: post_message, send_dm, get_observer_url, spawn, ...)
# Joins the demo's Relay workspace as a human "operator" so a coding session can read the task
# channels, watch handoff DMs and post into them. Secrets come from the gitignored tokens/ folder.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WS="$ROOT/tokens/workspace.json"
[ -f "$WS" ] || { echo "relay-mcp: run 'npm run seed' first (no $WS)" >&2; exit 1; }
read_json() { node -e "const j=require(process.argv[1]); process.stdout.write(String(j[process.argv[2]] ?? ''))" "$WS" "$1"; }
export RELAY_API_KEY="$(read_json workspaceKey)"
export RELAY_BASE_URL="$(read_json baseUrl)"
export RELAY_AGENT_NAME="${RELAY_AGENT_NAME:-operator$(read_json runId)}"
export RELAY_AGENT_TYPE="${RELAY_AGENT_TYPE:-human}"
export RELAYCAST_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1
if [ "${1:-}" = "official" ]; then
  export RELAY_WORKSPACE_KEY="$RELAY_API_KEY"
  exec npx -y agent-relay@15.0.1 mcp
fi
exec npx -y @relaycast/mcp@12.3.0
