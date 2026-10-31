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
// Only act on a handoff the lease authority still considers open (LOST at that epoch); ignore stale ones from old runs.
async function live(m: RelayMsg) {
  const r = await api(`/task/${m.data!.taskId}`).catch(() => null);
  return !!r?.task && r.task.state === 'LOST' && r.task.epoch === m.data!.epoch;
}
const queued = (await conn.drainDms()).filter(isHandoff).sort((a, b) => String(b.ts).localeCompare(String(a.ts)));
log(name, `drained ${queued.length} queued handoff DM(s)`);
let dm: RelayMsg | undefined;
for (const m of queued) { if (await live(m)) { dm = m; break; } log(name, `ignoring stale handoff ${m.id} (task ${m.data!.taskId} e${m.data!.epoch})`); }
if (!dm) {
  log(name, 'no open handoff queued; listening live');
  dm = await new Promise<RelayMsg>((resolve) => {
    conn.onAny(async (m) => { if (m.type === 'dm' && isHandoff(m) && (await live(m))) resolve(m); });
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
const [task, history] = await Promise.all([
  api(`/task/${taskId}`),
  conn.ensureChannel(channel).catch(() => {}).then(() => conn.listChannel(channel, 100)),
]);
const committed: { step: number; epoch: number }[] = task.task.steps;
const prior: { step: number; text: string }[] = [];
for (const s of committed) {
  const m = history.find((h) => h.data?.kind === 'checkpoint' && h.data.step === s.step && h.data.epoch === s.epoch && !h.data.late);
  if (m) prior.push({ step: s.step, text: m.data!.text });
  else log(name, `WARN step ${s.step} committed but no checkpoint in Relay history`);
}
const maxCommitted = Math.max(0, ...prior.map((p) => p.step));
log(name, `rebuilt steps [${prior.map((p) => p.step).join(',')}] from ${history.length} Relay messages; resuming at step ${maxCommitted + 1}`);
conn.post(channel, `${name} (Claude) took over task ${taskId} at epoch ${epoch}: rebuilt steps 1-${maxCommitted} from this channel, resuming at step ${maxCommitted + 1}.`,
    { kind: 'takeover', taskId, epoch, resumeFromStep: maxCommitted + 1 })
  .then((m) => api('/relay/seen', { msg: { id: m.id, from: name, channel, text: `${name} took over at epoch ${epoch}; resuming at step ${maxCommitted + 1}`, data: { kind: 'takeover', taskId, epoch }, ts: Date.now() } }))
  .catch((e: any) => log(name, 'takeover post failed', e.message));

const r = await runSteps({ name, vendor: 'anthropic', taskId, channel, epoch, fromStep: maxCommitted + 1, prior, conn, llm: claudeStep, onStep: (n) => (step = n), asyncPosts: true });
stopHb();
log(name, `finished: ${r}`);
await sleep(200);
await api('/proc', { name, status: 'down', pid: process.pid }).catch(() => {});
process.exit(0);
