// node scripts/wait.mjs <taskId> <step3|lost|done|claimed> [timeoutSec]
const [taskId, cond, to = '180'] = process.argv.slice(2);
const S = process.env.AFTERLIFE_SERVER || 'http://localhost:4000';
const end = Date.now() + Number(to) * 1000;
const ok = (t) => {
  if (!t) return false;
  if (cond === 'step3') return t.steps.some((s) => s.step === 3 && s.relayMsgId);
  if (cond === 'lost') return t.state === 'LOST';
  if (cond === 'done') return t.state === 'DONE';
  if (cond === 'claimed') return t.state === 'RUNNING' && t.epoch > 1;
  return false;
};
const pid = Number(process.env.WATCH_PID || 0);
while (Date.now() < end) {
  if (pid) { try { process.kill(pid, 0); } catch { console.error(`[wait] watched pid ${pid} exited before ${cond}`); process.exit(2); } }
  try { const r = await (await fetch(`${S}/task/${taskId}`)).json(); if (ok(r.task)) { console.log(`[wait] ${cond} ok (state ${r.task.state}, epoch ${r.task.epoch}, step ${r.task.step})`); process.exit(0); } } catch {}
  await new Promise((r) => setTimeout(r, 200));
}
console.error(`[wait] timeout waiting for ${cond}`); process.exit(1);
