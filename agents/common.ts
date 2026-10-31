// Shared bits for worker + standby: env, lease-server HTTP client, the refund job, LLM calls.
import { join } from 'node:path';
import { ROOT } from './relay.ts';

export function loadEnv() {
  try { (process as any).loadEnvFile(join(ROOT, '.env')); } catch {}
}
loadEnv();

export const SERVER = process.env.AFTERLIFE_SERVER || 'http://localhost:4000';
export const STEP_DELAY_MS = Number(process.env.STEP_DELAY_MS || 0);
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function arg(name: string, def?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : def;
}

export async function api<T = any>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(SERVER + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  return (await res.json()) as T;
}

export const log = (who: string, ...a: unknown[]) => console.log(`[${new Date().toISOString().slice(11, 23)}] [${who}]`, ...a);

// ---------------------------------------------------------------- the job
export const FACTS = `FACT SHEET (Hollow Pines Hotel, refund desk)
Guest: Mina Okafor. Booking HH-1031. Room 13. 2 nights, 29-31 Oct, $240/night, total $480 paid on card.
Complaint (received 31 Oct 07:12): "${process.env.COMPLAINT?.trim() || 'Something in room 13 knocked on the wardrobe from inside every night at 3:03am and the room went ice cold. I barely slept. Front desk moved me to room 7 at 1:40am on the second night. I want my money back.'}"
Night log: 29 Oct - disturbance logged by night porter at 03:03, no fix. 30 Oct - disturbance at 03:03, guest moved to room 7 at 01:40 (before it started).
Policy HP-7 "Unresolved disturbance": refund 50% of each affected night. A night counts as affected only if the guest stayed in the disturbed room past 03:00. Refund cap $300 per booking. Refunds over $200 need a manager note. A refund is issued exactly once per booking.`;

export const STEPS = [
  { n: 1, name: 'read complaint', ask: 'Read the guest complaint. State in 2-3 sentences what the guest is asking for and what happened.' },
  { n: 2, name: 'check booking facts', ask: 'Check the booking facts against the night log. List which nights count as affected under policy HP-7 and why.' },
  { n: 3, name: 'decide amount', ask: 'Decide the refund amount in dollars. Show the arithmetic in one line, then state the final amount as "REFUND AMOUNT: $X".' },
  { n: 4, name: 'draft apology', ask: 'Draft a short apology email to the guest (under 90 words). It must state the exact refund amount and the reason decided in step 3.' },
  { n: 5, name: 'policy check', ask: 'Policy check: confirm the amount is within the HP-7 cap, say whether a manager note is needed, and write that note in one sentence if so. End with "POLICY: PASS" or "POLICY: FAIL".' },
  { n: 6, name: 'ISSUE REFUND', ask: 'Issue the refund. Output exactly one line: "REFUND ISSUED: $X to booking HH-1031 (Mina Okafor), reason: <5-10 words>". Nothing else.' },
];

export function buildPrompt(stepN: number, prior: { step: number; text: string }[], agent: string) {
  const s = STEPS[stepN - 1];
  const priorTxt = prior.filter((p) => p.step < stepN).sort((a, b) => a.step - b.step)
    .map((p) => `--- step ${p.step} (${STEPS[p.step - 1].name}) output ---\n${p.text}`).join('\n');
  const cite = stepN > 1
    ? `\nBegin your answer with "Per step ${stepN - 1}," and quote one concrete fact (a number, time or amount) from the step ${stepN - 1} output above.`
    : '';
  const system = `You are ${agent}, a refund agent at Hollow Pines Hotel working a 6-step refund job. Be terse and factual: 40-110 words, plain text, no markdown headings.`;
  const user = `${FACTS}\n\n${priorTxt ? 'COMMITTED STEPS SO FAR:\n' + priorTxt + '\n\n' : ''}NOW DO STEP ${stepN} of 6 (${s.name}): ${s.ask}${cite}`;
  return { system, user };
}

// ---------------------------------------------------------------- LLMs (fetch, no SDK deps)
function stub(vendor: string, stepN: number, prior: { step: number; text: string }[]) {
  const p = prior.find((x) => x.step === stepN - 1);
  return `[stub ${vendor}] ${stepN > 1 ? `Per step ${stepN - 1}, "${(p?.text ?? '').slice(0, 60)}". ` : ''}${STEPS[stepN - 1].name}: refund $240 for booking HH-1031.`;
}

export async function openaiStep(stepN: number, prior: { step: number; text: string }[], agent: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) { log(agent, 'OPENAI_API_KEY missing -> [stub]'); return stub('openai', stepN, prior); }
  const { system, user } = buildPrompt(stepN, prior, agent);
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, temperature: 0, max_tokens: 260, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
        signal: AbortSignal.timeout(30000),
      });
      const j: any = await res.json();
      if (!res.ok) throw new Error(`openai ${res.status} ${j?.error?.message}`);
      return String(j.choices[0].message.content).trim();
    } catch (e: any) {
      log(agent, 'openai error', e.message);
      if (attempt >= 3) throw e;
      await sleep(1000 * attempt);
    }
  }
}

export async function claudeStep(stepN: number, prior: { step: number; text: string }[], agent: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { log(agent, 'ANTHROPIC_API_KEY missing -> [stub]'); return stub('claude', stepN, prior); }
  const { system, user } = buildPrompt(stepN, prior, agent);
  const model = process.env.CLAUDE_MODEL || 'claude-haiku-5-5';
  const base = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
  let withTemp = process.env.CLAUDE_TEMPERATURE !== 'off' && !/haiku-5|sonnet-5|opus-5/.test(model); // 5.x models reject temperature
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`${base}/v1/messages`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model, max_tokens: 260, thinking: { type: 'disabled' }, ...(withTemp ? { temperature: 0 } : {}), system, messages: [{ role: 'user', content: user }] }),
        signal: AbortSignal.timeout(30000),
      });
      const j: any = await res.json();
      if (!res.ok) {
        if (res.status === 400 && /temperature/i.test(JSON.stringify(j)) && withTemp) { withTemp = false; continue; }
        throw new Error(`anthropic ${res.status} ${j?.error?.message}`);
      }
      return (j.content ?? []).filter((c: any) => c.type === 'text').map((c: any) => c.text).join('').trim();
    } catch (e: any) {
      log(agent, 'claude error', e.message);
      if (attempt >= 3) throw e;
      await sleep(1000 * attempt);
    }
  }
}
