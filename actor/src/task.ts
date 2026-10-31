// Adapted from teammate Nihal's Task actor (github.com/nihalnihalani/afterlife actor/src/task.ts):
// same alarm-owned lease + fencing-token design, reshaped to Afterlife's lease contract
// (his `attempt` == our `epoch`; his ledger == our steps; his timeline == our ledger rows).
// The LOST transition (epoch++) happens ONLY in onAlarm(), driven by the actor runtime's alarm.
// Objects/arrays are always reassigned: mutating a persisted value in place is not saved.
import { Actor, Persisted } from "durable-actors"

type State = "RUNNING" | "LOST" | "DONE"
type Step = { step: number; author: string; vendor: string; epoch: number; text: string; relayMsgId?: string | null; ts: number }
type Owner = { epoch: number; owner: string; vendor: string; since: number }
export type T = {
    taskId: string; state: State; epoch: number; step: number; totalSteps: number; owner: string; vendor: string
    leaseMs: number; leaseExpiresAt: number; lastHeartbeatAt: number; lastSeq: number
    alarmFiredAt: number | null; detectLatencyMs: number | null; alarmLagMs: number | null
    owners: Owner[]; steps: Step[]; startedAt: number; doneAt: number | null
}
export type Row = { type: "ledger"; taskId: string; kind: string; text: string; ts: number; epoch?: number; step?: number }
type Outbox = { taskId: string; epoch: number; step: number; author: string; vendor: string; text: string; relayMsgId: string | null; ts: number }

const CAP = 500

export class LeaseTask extends Actor {
    @Persisted t: T | null = null
    @Persisted rows: Row[] = []
    @Persisted seq = 0 // total rows ever appended (cursor for the adapter)
    @Persisted outbox: Outbox | null = null

    private async row(kind: string, text: string, extra: { epoch?: number; step?: number } = {}, persist = true): Promise<Row> {
        const r: Row = { type: "ledger", taskId: this.t?.taskId ?? "", kind, text, ts: Date.now(), ...extra }
        if (persist) {
            this.rows = [...this.rows, r].slice(-CAP)
            this.seq = this.seq + 1
        }
        return r
    }
    private async save(t: T) { this.t = JSON.parse(JSON.stringify(t)) }
    private async arm(t: T) { this.alarm.set(t.leaseExpiresAt) }
    private async view(extra: Record<string, unknown> = {}) { return { task: this.t, seq: this.seq, ...extra } }

    async start(input: { taskId: string; owner: string; vendor: string; totalSteps?: number; leaseMs: number }) {
        const now = Date.now()
        const t: T = {
            taskId: input.taskId, state: "RUNNING", epoch: 1, step: 0, totalSteps: input.totalSteps ?? 6,
            owner: input.owner, vendor: input.vendor, leaseMs: input.leaseMs, leaseExpiresAt: now + input.leaseMs,
            lastHeartbeatAt: now, lastSeq: 0, alarmFiredAt: null, detectLatencyMs: null, alarmLagMs: null,
            owners: [{ epoch: 1, owner: input.owner, vendor: input.vendor, since: now }], steps: [], startedAt: now, doneAt: null,
        }
        this.t = t
        this.rows = []
        this.outbox = null
        await this.arm(t)
        await this.row("start", `task started: owner ${input.owner} (${input.vendor}), epoch 1, lease ${input.leaseMs / 1000}s [terse actor]`, { epoch: 1, step: 0 })
        return this.view()
    }

    async heartbeat(input: { epoch: number; step: number; seq: number }) {
        const t = this.t
        if (!t) return this.view({ res: { ok: false, reason: "unknown_task" } })
        if (input.epoch < t.epoch) {
            await this.row("rejected", `REJECTED: heartbeat epoch ${input.epoch} < ${t.epoch} (stale owner, seq ${input.seq}, step ${input.step})`, { epoch: input.epoch, step: input.step })
            return this.view({ res: { ok: false, reason: "fenced", currentEpoch: t.epoch } })
        }
        if (t.state === "DONE") return this.view({ res: { ok: false, reason: "done", currentEpoch: t.epoch } })
        if (t.state === "LOST") return this.view({ res: { ok: false, reason: "lost", currentEpoch: t.epoch } })
        const now = Date.now()
        t.lastHeartbeatAt = now
        t.leaseExpiresAt = now + t.leaseMs
        t.lastSeq = Math.max(t.lastSeq, input.seq)
        await this.save(t)
        await this.arm(t)
        const hb = await this.row("heartbeat", `heartbeat e${input.epoch} s${input.step} #${input.seq} from ${t.owner}; lease to +${t.leaseMs / 1000}s`, { epoch: input.epoch, step: input.step }, false)
        return this.view({ res: { ok: true, leaseExpiresAt: t.leaseExpiresAt, epoch: t.epoch }, hb })
    }

    async commit(input: { epoch: number; step: number; author: string; vendor: string; text: string; relayMsgId?: string | null }) {
        const t = this.t
        const { epoch, step, author, vendor, text } = input
        const relayMsgId = input.relayMsgId ?? null
        if (!t) return this.view({ res: { ok: false, reason: "unknown_task" } })
        if (epoch < t.epoch) {
            const msg = `REJECTED: epoch ${epoch} < ${t.epoch} (step ${step} by ${author}${relayMsgId ? `, relay msg ${relayMsgId}` : ""}; late write from the old agent blocked)`
            await this.row("rejected", msg, { epoch, step })
            return this.view({ res: { ok: false, reason: "fenced", currentEpoch: t.epoch, text: msg } })
        }
        const existing = t.steps.find(s => s.step === step)
        if (existing) {
            await this.row("commit", `duplicate commit e${epoch} s${step} by ${author}: no-op (already committed by ${existing.author} e${existing.epoch})`, { epoch, step })
            return this.view({ res: { ok: true, duplicate: true, epoch: t.epoch, step } })
        }
        if (t.state === "DONE") return this.view({ res: { ok: false, reason: "done", currentEpoch: t.epoch } })
        if (t.state === "LOST") return this.view({ res: { ok: false, reason: "lost", currentEpoch: t.epoch } })
        if (!Number.isInteger(step) || step < 1 || step > t.totalSteps) return this.view({ res: { ok: false, reason: "bad_step", currentEpoch: t.epoch } })
        const now = Date.now()
        t.steps = [...t.steps, { step, author, vendor, epoch, text, relayMsgId, ts: now }].sort((a, b) => a.step - b.step)
        t.step = Math.max(t.step, step)
        t.lastHeartbeatAt = now
        t.leaseExpiresAt = now + t.leaseMs
        await this.row("commit", `COMMITTED step ${step} e${epoch} by ${author} (${vendor})${relayMsgId ? ` relay msg ${relayMsgId}` : ""}`, { epoch, step })
        let done = false
        if (step >= t.totalSteps) {
            done = true
            t.state = "DONE"
            t.doneAt = now
            this.alarm.delete()
            this.outbox = { taskId: t.taskId, epoch, step, author, vendor, text, relayMsgId, ts: now }
            await this.row("done", `DONE: refund issued exactly once by ${author} (${vendor}) at epoch ${epoch}`, { epoch, step })
        }
        await this.save(t)
        if (!done) await this.arm(t)
        return this.view({ res: { ok: true, done, epoch: t.epoch, step }, outbox: done ? this.outbox : null })
    }

    async claim(input: { agent: string; vendor: string }) {
        const t = this.t
        if (!t) return this.view({ res: { ok: false, epoch: 0, reason: "unknown_task" } })
        if (t.state === "DONE") return this.view({ res: { ok: false, epoch: t.epoch, reason: "done" } })
        if (t.state === "RUNNING") {
            if (t.owner === input.agent) return this.view({ res: { ok: true, epoch: t.epoch, resumeFromStep: t.step + 1 } })
            return this.view({ res: { ok: false, epoch: t.epoch, reason: "held" } })
        }
        // LOST: first claim wins (actor calls are serialized)
        const now = Date.now()
        const prevOwner = t.owner
        t.state = "RUNNING"
        t.owner = input.agent
        t.vendor = input.vendor
        t.lastHeartbeatAt = now
        t.leaseExpiresAt = now + t.leaseMs
        t.lastSeq = 0
        t.owners = [...t.owners, { epoch: t.epoch, owner: input.agent, vendor: input.vendor, since: now }]
        await this.save(t)
        await this.arm(t)
        await this.row("claim", `CLAIMED by ${input.agent} (${input.vendor}) at epoch ${t.epoch}; taken over from ${prevOwner}; resume from step ${t.step + 1}`, { epoch: t.epoch, step: t.step })
        return this.view({ res: { ok: true, epoch: t.epoch, resumeFromStep: t.step + 1 } })
    }

    async attachRelay(input: { step: number; epoch: number; relayMsgId: string }) {
        const t = this.t
        const s = t?.steps.find(x => x.step === input.step && x.epoch === input.epoch)
        if (!t || !s) return this.view({ res: false })
        t.steps = t.steps.map(x => (x === s ? { ...x, relayMsgId: input.relayMsgId } : x))
        await this.save(t)
        return this.view({ res: true })
    }

    async log(input: { kind: string; text: string }) {
        await this.row(input.kind, input.text)
        return this.view()
    }

    // Poll target for the adapter: task + ledger rows after cursor `since`.
    async state(input: { since: number }) {
        const n = Math.max(0, Math.min(this.rows.length, this.seq - input.since))
        return this.view({ rows: n > 0 ? this.rows.slice(-n) : [] })
    }

    async reset() {
        this.alarm.delete()
        this.t = null
        this.rows = []
        this.outbox = null
        return this.view()
    }

    // The lease authority: fired by the actor runtime, not by any client timer.
    async onAlarm() {
        const t = this.t
        if (!t || t.state !== "RUNNING") return
        const now = Date.now()
        if (now < t.leaseExpiresAt - 50) { await this.arm(t); return }
        const prev = t.epoch
        t.state = "LOST"
        t.epoch = prev + 1
        t.alarmFiredAt = now
        t.detectLatencyMs = now - t.lastHeartbeatAt
        t.alarmLagMs = now - t.leaseExpiresAt
        await this.save(t)
        await this.row("alarm",
            `lease expired: no heartbeat from ${t.owner} for ${(t.detectLatencyMs / 1000).toFixed(1)}s; presumed dead (terse actor alarm). epoch ${prev} -> ${t.epoch}; resume from step ${t.step + 1}`,
            { epoch: t.epoch, step: t.step })
    }
}
