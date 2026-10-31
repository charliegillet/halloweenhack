// Shared step loop: heartbeat on its own timer; per step: LLM -> lease commit -> Relay checkpoint -> report msg id.
import type { RelayConn } from './relay.ts';
import { api, log, sleep, STEP_DELAY_MS, STEPS } from './common.ts';

export function startHeartbeat(name: string, taskId: string, getEpoch: () => number, getStep: () => number) {
  let seq = 0;
  const h = setInterval(async () => {
    try {
      const r = await api('/lease/heartbeat', { name, taskId, epoch: getEpoch(), step: getStep(), seq: ++seq });
      if (!r.ok) {
        log(name, `heartbeat refused: ${r.reason} (current epoch ${r.currentEpoch})`); // a zombie doesn't know it's dead
        if (r.reason === 'done' || r.reason === 'fenced') clearInterval(h); // one refusal is enough; stop spamming the ledger
      }
    } catch (e: any) { log(name, 'heartbeat error', e.message); }
  }, 2000);
  return () => clearInterval(h);
}

export async function runSteps(o: {
  name: string; vendor: 'openai' | 'anthropic'; taskId: string; channel: string; epoch: number;
  fromStep: number; prior: { step: number; text: string }[]; conn: RelayConn;
  llm: (stepN: number, prior: { step: number; text: string }[], agent: string) => Promise<string>;
  onStep?: (n: number) => void;
  asyncPosts?: boolean; // post checkpoints in the background (still strictly after each commit, in order)
}): Promise<'done' | 'fenced' | 'stopped'> {
  const prior = [...o.prior];
  let postQ: Promise<void> = Promise.resolve();
  for (let n = o.fromStep; n <= STEPS.length; n++) {
    if (STEP_DELAY_MS) await sleep(STEP_DELAY_MS);
    log(o.name, `step ${n} (${STEPS[n - 1].name}) -> ${o.vendor}`);
    const text = await o.llm(n, prior, o.name);
    log(o.name, `step ${n} text: ${text.replace(/\s+/g, ' ').slice(0, 160)}`);
    const c = await api('/lease/commit', { name: o.name, taskId: o.taskId, epoch: o.epoch, step: n, author: o.name, vendor: o.vendor, text });
    const data = { kind: 'checkpoint', taskId: o.taskId, epoch: o.epoch, step: n, text };
    if (!c.ok) {
      log(o.name, `COMMIT REFUSED step ${n}: ${c.reason} ${c.text ?? ''}`);
      if (c.reason === 'fenced') {
        // Late write from a superseded attempt: it lands in Relay, but the board/standby mark it stale.
        try {
          const m = await o.conn.post(o.channel, `[late] step ${n} (${STEPS[n - 1].name}) from attempt ${o.epoch}: ${text}`, { ...data, late: true });
          await api('/relay/seen', { msg: { id: m.id, from: o.conn.name, channel: o.channel, text: `[late] step ${n}: ${text}`, data: { ...data, late: true }, ts: Date.now() } });
        } catch (e: any) { log(o.name, 'late post failed', e.message); }
        return 'fenced';
      }
      return 'stopped';
    }
    if (c.duplicate) { log(o.name, `step ${n} already committed; skipping post`); prior.push({ step: n, text }); continue; }
    o.onStep?.(n);
    prior.push({ step: n, text });
    // checkpoint goes to Relay AFTER the commit; then tell the server the real message id
    const postIt = async () => { for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const m = await o.conn.post(o.channel, `step ${n} (${STEPS[n - 1].name}) by ${o.name}: ${text}`, data, `${o.taskId}:${o.epoch}:${n}`);
        await api('/lease/relaymsg', { taskId: o.taskId, step: n, epoch: o.epoch, msg: { id: m.id, from: o.conn.name, channel: o.channel, text: `step ${n} (${STEPS[n - 1].name}) by ${o.name}: ${text}`, data, ts: Date.now() } });
        log(o.name, `checkpoint step ${n} posted to #${o.channel} as ${m.id}`);
        break;
      } catch (e: any) { log(o.name, `relay post failed (try ${attempt})`, e.message); await sleep(800); }
    } };
    postQ = postQ.then(postIt);
    if (!o.asyncPosts || c.done) await postQ;
    if (c.done) { log(o.name, 'DONE: refund issued (outbox written once by the lease)'); return 'done'; }
  }
  return 'done';
}
