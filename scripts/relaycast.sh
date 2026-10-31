#!/usr/bin/env bash
# Run the relaycast CLI against the hosted Relay workspace in tokens/workspace.json.
# Usage: bash scripts/relaycast.sh <tool> [--arg value]   (AS=<role> to act as an agent)
set -euo pipefail
cd "$(dirname "$0")/.."
eval "$(node -e '
const w=require("./tokens/workspace.json");
const q=s=>"\x27"+String(s).replace(/\x27/g,"\x27\\\x27\x27")+"\x27";
console.log("export RELAY_API_KEY="+q(w.workspaceKey));
console.log("export RELAY_BASE_URL="+q(w.baseUrl));
const as=process.env.AS;
if(as){const t=require("./tokens/"+as+".token.json");
 const tok=t.token||t.agentToken;
 if(tok)console.log("export RELAY_AGENT_TOKEN="+q(tok));
 console.log("export RELAY_AGENT_NAME="+q(t.name||as));}
')"
export RELAYCAST_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1
exec npx relaycast "$@"
