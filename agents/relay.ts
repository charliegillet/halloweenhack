// Thin Agent Relay adapter for Afterlife. Pinned to @agent-relay/sdk@14.0.0.
// Usage (one identity per process):
//   import * as relay from './relay.ts';
//   await relay.connect('standbyclaude');          // role name; runId suffix resolved from tokens/run.json
//   await relay.ensureChannel('task-abc');
//   const { id } = await relay.post('task-abc', 'step 1 done', { kind: 'checkpoint', ... });
//   const history = await relay.listChannel('task-abc');
//   await relay.dm('standbyclaude', 'take over', { taskId, epoch }, `${taskId}:${epoch}`);
//   relay.onAny((m) => ...);                        // live channel + DM events, normalized
//   const queued = await relay.drainDms();           // DMs that arrived while this agent was offline
import { AgentRelay } from '@agent-relay/sdk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const TOKENS_DIR = join(ROOT, 'tokens');
export const ROLES = ['workergpt', 'workergptb', 'standbyclaude', 'afterlife'] as const;
export type Role = (typeof ROLES)[number];

// SDK wants the origin WITHOUT /v1 (it appends /v1/... itself). Accept either form.
export function baseUrl(): string {
  const raw = process.env.RELAY_BASE_URL || 'https://cast.agentrelay.com';
  return raw.replace(/\/+$/, '').replace(/\/v1$/, '');
}

export interface RelayMsg {
  id: string;
  type: 'channel' | 'dm' | 'thread' | 'other';
  from: string;
  channel?: string;
  conversationId?: string;
  text: string;
  data: Record<string, any> | null;
  ts: string;
}

// ---------- token files (gitignored tokens/) ----------
export function readJson<T = any>(file: string): T | null {
  const p = join(TOKENS_DIR, file);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8'));
}
export function writeJson(file: string, obj: unknown) {
  mkdirSync(TOKENS_DIR, { recursive: true });
  writeFileSync(join(TOKENS_DIR, file), JSON.stringify(obj, null, 2), { mode: 0o600 });
}
export interface RunInfo { runId: string; baseUrl: string; names: Record<Role, string>; createdAt: string }
export function runInfo(): RunInfo {
  const r = readJson<RunInfo>('run.json');
  if (!r) throw new Error('tokens/run.json missing: run `npm run seed` first');
  return r;
}
/** Role ('standbyclaude') -> full Relay name ('standbyclaude7k2'). Full names pass through. */
export function fullName(roleOrName: string): string {
  const r = readJson<RunInfo>('run.json');
  return (r?.names as any)?.[roleOrName] ?? roleOrName;
}
export function roleOf(name: string): string {
  const r = readJson<RunInfo>('run.json');
  if (!r) return name;
  for (const [role, n] of Object.entries(r.names)) if (n === name) return role;
  return name;
}

// ---------- normalization ----------
export function normalize(m: any, type: RelayMsg['type'] = 'other', channelHint?: string): RelayMsg {
  return {
    id: m?.id ?? m?.messageId,
    type,
    from: m?.from?.name ?? m?.agentName ?? 'unknown',
    channel: m?.channel?.name ?? channelHint,
    conversationId: m?.conversationId,
    text: m?.text ?? '',
    data: (m?.metadata as any) ?? null,
    ts: m?.createdAt ?? new Date().toISOString(),
  };
}

// ---------- connection ----------
export class RelayConn {
  constructor(public readonly name: string, public readonly role: string, public readonly relay: AgentRelay, public readonly client: any) {}

  async ensureChannel(channel: string, topic?: string) {
    try {
      await this.client.channels.create({ name: channel, topic });
    } catch (e: any) {
      if (!/exist|409|conflict|taken/i.test(String(e?.code ?? '') + String(e?.message ?? ''))) throw e;
    }
    try { await this.client.channels.join(channel); } catch (e: any) {
      if (!/already|member/i.test(String(e?.message ?? ''))) throw e;
    }
  }

  /** Post to #channel with structured data (stored as message metadata). Returns the Relay message id. */
  async post(channel: string, text: string, data?: Record<string, unknown>, idempotencyKey?: string) {
    const m = await this.client.sendMessage({ to: `#${channel}`, text, metadata: data ?? null, idempotencyKey });
    return { id: m.id ?? m.messageId, raw: m };
  }

  /** Channel history, oldest -> newest. */
  async listChannel(channel: string, limit = 100): Promise<RelayMsg[]> {
    const list = await this.client.messages.list(channel, { limit });
    const out = list.map((m: any) => normalize(m, 'channel', channel));
    out.sort((a: RelayMsg, b: RelayMsg) => String(a.ts).localeCompare(String(b.ts)));
    return out;
  }

  /** DM another agent by role or full name. Durable: queued if the recipient is offline. */
  async dm(to: string, text: string, data?: Record<string, unknown>, idempotencyKey?: string) {
    const m = await this.client.messages.dm({ to: fullName(to), text, metadata: data ?? null, idempotencyKey });
    return { id: m.id ?? m.messageId, raw: m };
  }

  /** Live events: channel messages, thread replies, DMs. Returns unsubscribe. */
  onAny(cb: (m: RelayMsg, raw: any) => void) {
    return this.relay.addListener('*', (evt: any) => {
      const t = evt?.type as string;
      if (!evt?.message) return;
      const kind: RelayMsg['type'] = t === 'dm.received' || t === 'group_dm.received' ? 'dm'
        : t === 'thread.reply' ? 'thread' : t === 'message.created' ? 'channel' : 'other';
      const m = normalize(evt.message, kind, evt.envelope?.channel?.name);
      if (evt.envelope?.from?.name) m.from = evt.envelope.from.name;
      const deliver = () => { try { cb(m, evt); } catch (e) { console.error('[relay] listener error', e); } };
      // DM events/inbox items arrive WITHOUT metadata; hydrate from GET /v1/messages/:id.
      if (kind === 'dm' && !m.data) this.hydrate(m).then(deliver, deliver); else deliver();
    });
  }

  /** Pull DMs that queued while this agent was offline (durable delivery). Acks them. */
  async drainDms(): Promise<RelayMsg[]> {
    const res = await this.client.inbox.list({ agentName: this.name, limit: 50 });
    const items = (res?.items ?? []).filter((it: any) => it.state !== 'read');
    const out: RelayMsg[] = [];
    for (const it of items) {
      const m = normalize(it.message, 'dm');
      m.channel = undefined; // inbox reports DMs as kind:'channel' with a dmch_ id (#1987)
      await this.hydrate(m);
      out.push(m);
      try { await this.client.inbox.ack({ inboxItemId: it.id, state: 'read' }); } catch {}
    }
    return out;
  }

  /** Fill m.data from the stored message (DM metadata is dropped from events and inbox items). */
  async hydrate(m: RelayMsg): Promise<RelayMsg> {
    try {
      const full = await this.client.messages.get(m.id);
      m.data = (full?.metadata as any) ?? m.data;
    } catch (e: any) { console.warn('[relay] hydrate failed', m.id, e?.message); }
    return m;
  }

  async workspaceInfo() { return this.client.workspace?.info ? this.client.workspace.info() : this.relay.workspace.info(); }
}

let current: RelayConn | null = null;

/** Connect as a seeded identity (role like 'workergpt' or full name). Never re-registers. */
export async function connect(roleOrName: string): Promise<RelayConn> {
  const run = runInfo();
  const role = roleOf(fullName(roleOrName));
  const tok = readJson<{ name: string; token: string }>(`${role}.token.json`);
  if (!tok) throw new Error(`tokens/${role}.token.json missing: run \`npm run seed\``);
  process.env.RELAY_BASE_URL ||= run.baseUrl;
  // No workspace key in agent processes: the at_live_ token is enough.
  const relay = new AgentRelay({ baseUrl: baseUrl(), agentToken: tok.token });
  const client = await relay.workspace.reconnect({ apiToken: tok.token });
  current = new RelayConn(tok.name, role, relay, client);
  return current;
}

function cur(): RelayConn {
  if (!current) throw new Error('relay.connect(name) first');
  return current;
}
export const ensureChannel = (c: string, topic?: string) => cur().ensureChannel(c, topic);
export const post = (c: string, text: string, data?: Record<string, unknown>, key?: string) => cur().post(c, text, data, key);
export const listChannel = (c: string, limit?: number) => cur().listChannel(c, limit);
export const dm = (to: string, text: string, data?: Record<string, unknown>, key?: string) => cur().dm(to, text, data, key);
export const onAny = (cb: (m: RelayMsg, raw: any) => void) => cur().onAny(cb);
export const drainDms = () => cur().drainDms();

// ---------- admin / observer (workspace key lives only in tokens/workspace.json) ----------
async function rest(path: string, init: RequestInit & { key: string }) {
  const res = await fetch(`${baseUrl()}/v1${path}`, { signal: AbortSignal.timeout(15000),
    ...init,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${init.key}`, ...(init.headers ?? {}) },
  });
  const body: any = await res.json().catch(() => ({}));
  if (!res.ok || body?.ok === false) throw new Error(`${path} ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body?.data ?? body;
}
export function workspaceKey(): string {
  const w = readJson<{ workspaceKey: string }>('workspace.json');
  if (!w?.workspaceKey) throw new Error('tokens/workspace.json missing');
  return w.workspaceKey;
}
/** GET /v1/workspace (plan etc.). */
export const getWorkspace = () => rest('/workspace', { method: 'GET', key: workspaceKey() });
/** Mint a read-only observer token (ot_live_). */
export const createObserverToken = (name = 'afterlife-board', hours = 12) =>
  rest('/observer-tokens', {
    method: 'POST',
    key: workspaceKey(),
    body: JSON.stringify({
      name,
      scopes: ['stream:read', 'messages:read', 'channels:read', 'dms:read', 'agents:read'],
      filters: { include_dms: true },
      expires_at: new Date(Date.now() + hours * 3600_000).toISOString(),
    }),
  });
/** Browser-side read-only WebSocket URL for an observer token. */
export function observerWsUrl(ot: string) {
  return `${baseUrl().replace(/^http/, 'ws')}/v1/ws?token=${encodeURIComponent(ot)}`;
}
