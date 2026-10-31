// Seed Relay identities ONCE per run. `npm run seed` (idempotent: no-op if tokens/run.json exists)
// `npm run reset` -> fresh workspace + fresh runId (hosted caps ~5 agents/workspace, so a new run = new workspace).
// Writes (gitignored): tokens/workspace.json, tokens/<role>.token.json, tokens/run.json, tokens/observer.token.json
import { AgentRelay } from '@agent-relay/sdk';
import { randomBytes } from 'node:crypto';
import { ROLES, baseUrl, readJson, writeJson, createObserverToken, getWorkspace, type RunInfo } from './relay.ts';

const reset = process.argv.includes('--reset');

export async function seed(opts: { reset?: boolean } = {}): Promise<RunInfo> {
  const existing = readJson<RunInfo>('run.json');
  if (existing && !opts.reset && existing.baseUrl === baseUrl()) {
    console.log(`[seed] reusing run ${existing.runId} on ${existing.baseUrl}`);
    return existing;
  }
  const runId = randomBytes(3).toString('hex').replace(/[^a-z0-9]/g, '').slice(0, 4) || 'r1';
  const url = baseUrl();
  console.log(`[seed] creating workspace on ${url} (runId ${runId})`);
  const ws = await AgentRelay.createWorkspace({ name: `afterlife${runId}`, baseUrl: url });
  if (!ws.workspaceKey) throw new Error('no workspace key returned');
  writeJson('workspace.json', { workspaceKey: ws.workspaceKey, baseUrl: url, runId });

  const names = {} as RunInfo['names'];
  for (const role of ROLES) {
    const name = `${role}${runId}`; // NO hyphens in agent names
    const client: any = await ws.workspace.register({ name, type: 'agent' }, { strict: true });
    const token = client.token ?? client.identity?.token ?? client.apiToken;
    if (!token) throw new Error(`no token for ${name}; keys: ${Object.keys(client)}`);
    writeJson(`${role}.token.json`, { role, name, id: client.id, token });
    names[role] = name;
    console.log(`[seed] registered ${name}`);
  }
  const run: RunInfo = { runId, baseUrl: url, names, createdAt: new Date().toISOString() };
  writeJson('run.json', run);

  try {
    const ot: any = await createObserverToken();
    writeJson('observer.token.json', { id: ot.id, token: ot.token ?? ot.secret, raw: ot });
    console.log('[seed] observer token minted (tokens/observer.token.json)');
  } catch (e: any) {
    console.warn('[seed] observer token failed:', e.message);
  }
  try {
    const info: any = await getWorkspace();
    console.log(`[seed] workspace plan: ${info?.plan}`);
  } catch (e: any) {
    console.warn('[seed] GET /workspace failed:', e.message);
  }
  return run;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed({ reset }).then((r) => console.log(JSON.stringify({ runId: r.runId, baseUrl: r.baseUrl, names: r.names })))
    .catch((e) => { console.error('[seed] FAILED', e); process.exit(1); });
}
