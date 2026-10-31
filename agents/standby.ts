// standbyclaude: Claude standby. Started AFTER the worker died. Drains the queued Relay DM, claims the lease,
// rebuilds committed steps from the Relay channel history, resumes at max(committed)+1.
// Usage: node --import tsx agents/standby.ts --name standbyclaude
import { api, arg, claudeStep, log, sleep } from './common.ts';
import { connect, type RelayMsg } from './relay.ts';
import { runSteps, startHeartbeat } from './runner.ts';

const role = arg('name', 'standbyclaude')!;
const conn = await connect(role);
const name = conn.name;
await api('/proc', { name, status: 'up', pid: process.pid });
log(name, `pid ${process.pid}; online. draining queued DMs...`);

const isHandoff = (m: RelayMsg) => m?.data?.kind === 'handoff' && m.data.taskId;
let dm: RelayMsg | undefined = (await conn.drainDms()).filter(isHandoff).pop();
if (!dm) {
  log(name, 'no queued handoff; listening live');
  dm = await new Promise<RelayMsg>((resolve) => {
    conn.onAny((m) => { if (m.type === 'dm' && isHandoff(m)) resolve(m); });
  });
}
const { taskId, epoch: dmEpoch, resumeFromStep, channel } = dm.data as any;
log(name, `handoff DM ${dm.id} from ${dm.from}: task ${taskId}, epoch ${dmEpoch}, resume ${resumeFromStep}, #${channel}`);
await api('/relay/seen', { msg: { id: dm.id, from: dm.from, channel: '', text: dm.text, data: { ...dm.data, drainedBy: name }, ts: Date.now() } });

const c = await api('/lease/claim', { name, taskId, agent: name, vendor: 'anthropic' });
if (!c.ok) { log(name, `claim refused: ${c.reason}`); await api('/proc', { name, status: 'down' }); process.exit(0); }
const epoch: number = c.epoch;
let step = (c.resumeFromStep ?? 1) - 1;
const stopHb = startHeartbeat(name, taskId, () => epoch, () => step);
log(name, `CLAIMED epoch ${epoch}; lease says resume at ${c.resumeFromStep}`);

// Rebuild from Relay: checkpoint posts in the task channel, kept only if the lease says that (step, epoch) committed.
await conn.ensureChannel(channel);
const task = await api(`/task/${taskId}`);
const committed: { step: number; epoch: number }[] = task.task.steps;
const history = await conn.listChannel(channel, 100);
const prior: { step: number; text: string }[] = [];
for (const s of committed) {
  const m = history.find((h) => h.data?.kind === 'checkpoint' && h.data.step === s.step && h.data.epoch === s.epoch && !h.data.late);
  if (m) prior.push({ step: s.step, text: m.data!.text });
  else log(name, `WARN step ${s.step} committed but no checkpoint in Relay history`);
}
const maxCommitted = Math.max(0, ...prior.map((p) => p.step));
log(name, `rebuilt steps [${prior.map((p) => p.step).join(',')}] from ${history.length} Relay messages; resuming at step ${maxCommitted + 1}`);
try {
  await conn.post(channel, `${name} (Claude) took over task ${taskId} at epoch ${epoch}: rebuilt steps 1-${maxCommitted} from this channel, resuming at step ${maxCommitted + 1}.`,
    { kind: 'takeover', taskId, epoch, resumeFromStep: maxCommitted + 1 });
} catch (e: any) { log(name, 'takeover post failed', e.message); }

const r = await runSteps({ name, vendor: 'anthropic', taskId, channel, epoch, fromStep: maxCommitted + 1, prior, conn, llm: claudeStep, onStep: (n) => (step = n) });
stopHb();
log(name, `finished: ${r}`);
await sleep(200);
await api('/proc', { name, status: 'down', pid: process.pid }).catch(() => {});
process.exit(0);
