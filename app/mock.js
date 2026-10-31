// ?mock=1 : fakes a full Afterlife demo run through window.afterlife.ingest, no backend needed.
// Options: &speed=2 (faster), &loop=0 (stop at the end), &zombie=0 (skip the fenced late write).
(() => {
  const q = new URLSearchParams(location.search);
  if (!q.has("mock") || !window.afterlife) return;
  const A = window.afterlife;
  const SPEED = Math.max(0.25, Number(q.get("speed")) || 1);
  const LOOP = q.get("loop") !== "0", ZOMBIE = q.get("zombie") !== "0";
  const LEASE = 8000 / SPEED, HB = 2000 / SPEED;

  const run = "7k2", W = "workergpt" + run, WB = "workergptb" + run, C = "standbyclaude" + run, D = "afterlife" + run;
  const taskId = "refund-hp1313", channel = "afterlife-" + taskId;
  const rid = () => "msg_" + Array.from({ length: 10 }, () => "0123456789abcdefghjkmnpqrstvwxyz"[(Math.random() * 32) | 0]).join("");

  const TEXT = [
    "Guest M. Hale, Room 13, Hollow Pines Hotel: reports cold spots, scratching inside the walls and 'a woman in the mirror' on the night of 30 Oct. Requests a full refund.",
    "Booking HP-1313: 2 nights (29-31 Oct), $412.00 total, card on file. Housekeeping log confirms a maintenance ticket for Room 13 on 30 Oct at 02:14. Night of 29 Oct: no reports.",
    "Decision: refund ONE night, $206.00, for 30 Oct only (the night with the logged maintenance ticket at 02:14). 29 Oct had no incident, so no refund for it.",
    "Per step 3 ('refund ONE night, $206.00, for 30 Oct only'): Dear M. Hale, we're truly sorry Room 13 kept you up on 30 Oct. We are refunding $206.00 for that night and have sealed the mirror.",
    "Policy §4.2: front desk may refund up to 1 night for a documented room issue without manager sign-off. $206.00 ≤ 1 night ($206.00), ticket 02:14 on file. PASS.",
    "ISSUE REFUND: $206.00 to booking HP-1313 (refund id rf_hp1313_01, idempotency key refund-hp1313:refund). Appended to outbox.jsonl.",
  ];

  let timers = [], task, hbTimer = null, hbSeq = 0;
  const at = (ms, fn) => timers.push(setTimeout(fn, ms / SPEED));
  const ledger = (kind, text) => A.ingest({ type: "ledger", taskId, kind, text, ts: Date.now() });
  const pushTask = () => A.ingest({ type: "task", task: JSON.parse(JSON.stringify(task)) });
  const relay = (from, text, data, extra = {}) => { const id = rid(); A.ingest({ type: "relay", msg: { id, from, channel, text, data, ts: Date.now(), ...extra } }); return id; };
  const proc = (name, status, pid) => A.ingest({ type: "proc", name, status, pid });

  function beat(who) {
    const now = Date.now();
    task.lastHeartbeatAt = now; task.leaseExpiresAt = now + LEASE; hbSeq++;
    pushTask();
    ledger("heartbeat", `${who} · epoch ${task.epoch} · step ${task.step} · seq ${hbSeq} · lease re-armed 8s`);
  }
  const startHb = (who) => { stopHb(); beat(who); hbTimer = setInterval(() => beat(who), HB); };
  const stopHb = () => { if (hbTimer) clearInterval(hbTimer); hbTimer = null; };

  function commit(step, author, vendor) {
    const text = TEXT[step - 1];
    ledger("commit", `commit ok · epoch ${task.epoch} · step ${step} · ${author}`);
    task.steps.push({ step, author, vendor, epoch: task.epoch, text, relayMsgId: null });
    task.step = step; pushTask();
    const mine = task;
    setTimeout(() => {
      if (task !== mine) return;
      const id = relay(author, `checkpoint step ${step}: ${text}`, { kind: "checkpoint", taskId, epoch: task.epoch, step, text });
      const s = task.steps.find((x) => x.step === step); if (s) { s.relayMsgId = id; pushTask(); }
    }, 260);
  }

  function play() {
    timers.forEach(clearTimeout); timers = []; stopHb(); hbSeq = 0;
    A.reset(); A.setConn("mock");
    task = { taskId, state: "RUNNING", epoch: 1, step: 0, owner: W, vendor: "openai", leaseExpiresAt: null, lastHeartbeatAt: null, detectLatencyMs: null, steps: [] };

    at(600, () => proc(W, "up", 41022));
    at(1200, () => { pushTask(); ledger("claim", `task/start ${taskId} · ${W} holds lease · epoch 1`); startHb(W); });
    at(3400, () => commit(1, W, "openai"));
    at(6200, () => commit(2, W, "openai"));
    at(9000, () => commit(3, W, "openai"));
    // kill -9 the worker, mid step 4. Heartbeats stop; the lease drains on its own.
    at(10600, () => { stopHb(); proc(W, "down", 41022); });
    // Alarm: the lease authority's own timer notices; the always-on dispatcher DMs the standby at once.
    at(10600, () => timers.push(setTimeout(() => {
      const now = Date.now();
      task.state = "LOST"; task.epoch = 2; task.detectLatencyMs = now - task.lastHeartbeatAt; pushTask();
      ledger("alarm", `lease expired · no heartbeat for ${(task.detectLatencyMs / 1000).toFixed(1)}s · ${W} presumed dead · epoch 1 -> 2`);
      timers.push(setTimeout(() => {
        relay(D, `resume ${taskId} at step 4 (epoch 2). Steps 1-3 committed; checkpoints in #${channel}.`,
          { kind: "dm", to: "standbyclaude", taskId, epoch: 2, resumeFromStep: 4, channel, summary: "steps 1-3 committed by workergpt" }, { channel: null });
        ledger("dm", `Relay DM -> standbyclaude (offline, queued) · idempotency key ${taskId}:2`);
      }, 450 / SPEED));
    }, task.leaseExpiresAt - Date.now() + 120)));
    const T = 17600;
    at(T + 3200, () => proc(C, "up", 41377));
    at(T + 4000, () => ledger("dm", `${C} drained queued DM · rebuilt steps 1-3 from #${channel} (3 checkpoints)`));
    at(T + 4700, () => {
      task.state = "RUNNING"; task.owner = C; task.vendor = "anthropic"; pushTask();
      ledger("claim", `claim ok · ${C} · epoch 2 (first claim wins) · resume at step 4`);
      startHb(C);
    });
    at(T + 7400, () => commit(4, C, "anthropic"));
    if (ZOMBIE) {
      at(T + 8600, () => proc(WB, "up", 41023));
      at(T + 9200, () => {
        relay(WB, `checkpoint step 4: Dear guest, we are refunding the full $412.00…`, { kind: "checkpoint", taskId, epoch: 1, step: 4 }, { stale: true });
        ledger("rejected", `REJECTED: epoch 1 < 2 · late write from ${WB} (step 4) fenced`);
      });
      at(T + 10400, () => proc(WB, "down", 41023));
    }
    at(T + 11000, () => commit(5, C, "anthropic"));
    at(T + 14000, () => {
      commit(6, C, "anthropic");
      A.ingest({ type: "outbox", taskId, text: `{"refund":"rf_hp1313_01","booking":"HP-1313","amount":206.00,"by":"${C}","epoch":2}`, ts: Date.now() });
    });
    at(T + 14800, () => {
      stopHb(); task.state = "DONE"; pushTask();
      ledger("done", `${taskId} DONE · 6/6 steps · refund issued exactly once · GPT died at step 3; Claude finished it`);
    });
    if (LOOP) at(T + 26000, play);
  }

  addEventListener("keydown", (e) => { if (e.key === "r") play(); });
  play();
})();
