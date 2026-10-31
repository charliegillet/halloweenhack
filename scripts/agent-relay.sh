#!/usr/bin/env bash
# Run the official agent-relay CLI against the workspace in tokens/workspace.json (no init, no daemons).
set -euo pipefail
cd "$(dirname "$0")/.."
eval "$(node -e '
const w=require("./tokens/workspace.json");
const q=s=>"\x27"+String(s).replace(/\x27/g,"\x27\\\x27\x27")+"\x27";
console.log("export RELAY_WORKSPACE_KEY="+q(w.workspaceKey));
console.log("export RELAY_API_KEY="+q(w.workspaceKey));
console.log("export RELAY_BASE_URL="+q(w.baseUrl));')"
export RELAYCAST_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1 AGENT_RELAY_TELEMETRY_DISABLED=1
exec npx agent-relay "$@"
