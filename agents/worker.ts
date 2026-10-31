// workergpt: OpenAI worker. Starts the refund task, heartbeats every 2s, commits each step, posts checkpoints to Relay.
// Usage: node --import tsx agents/worker.ts --name workergpt [--task <id>]
import { api, arg, log, openaiStep } from './common.ts';
import { connect } from './relay.ts';
import { runSteps, startHeartbeat } from './runner.ts';

const role = arg('name', 'workergpt')!;
const taskId = arg('task', process.env.TASK_ID || `t${Date.now().toString(36).slice(-5)}`)!;

const conn = await connect(role);
const name = conn.name;
await api('/proc', { name, status: 'up', pid: process.pid });
log(name, `pid ${process.pid}; starting task ${taskId}`);

const st = await api('/task/start', { taskId, owner: name, vendor: 'openai' });
if (!st.ok) { log(name, 'start failed', st); process.exit(1); }
const channel: string = st.channel;
let step = 0;
const stopHb = startHeartbeat(name, taskId, () => 1, () => step); // own timer, starts with the lease
await conn.ensureChannel(channel, `afterlife task ${taskId}`);
log(name, `lease epoch 1; checkpoints -> #${channel}`);
const r = await runSteps({ name, vendor: 'openai', taskId, channel, epoch: 1, fromStep: 1, prior: [], conn, llm: openaiStep, onStep: (n) => (step = n) });
stopHb();
log(name, `finished: ${r}`);
await api('/proc', { name, status: 'down', pid: process.pid }).catch(() => {});
process.exit(0);
