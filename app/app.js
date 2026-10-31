// Afterlife board. Consumes SSE /events (or ?mock=1 via mock.js) and renders the lease authority's view.
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const toMs = (ts) => { if (ts == null) return Date.now(); if (typeof ts === "number") return ts < 1e12 ? ts * 1000 : ts; const n = Date.parse(ts); return isNaN(n) ? Date.now() : n; };
  const hms = (ts) => new Date(toMs(ts)).toLocaleTimeString("en-GB", { hour12: false });
  const short = (id, n = 14) => { id = String(id ?? ""); return id.length > n ? id.slice(0, n - 1) + "…" : id; };

  const STEP_NAMES = ["read complaint", "check booking facts", "decide amount", "draft apology", "policy check", "ISSUE REFUND"];
  const LEASE_MS = 8000;

  const role = (name) => {
    const n = String(name || "").toLowerCase();
    if (n.startsWith("standbyclaude")) return "claude";
    if (n.startsWith("workergptb")) return "zombie";
    if (n.startsWith("workergpt")) return "worker";
    if (n.startsWith("afterlife")) return "afterlife";
    return "other";
  };
  const vend = (v, name) => {
    const s = `${v || ""} ${name || ""}`.toLowerCase();
    if (/claude|anthropic/.test(s)) return "claude";
    if (/openai|gpt/.test(s)) return "openai";
    if (/afterlife|dispatch/.test(s)) return "afterlife";
    return "";
  };
  const vendLabel = (v, name) => ({ claude: "Claude", openai: "OpenAI", afterlife: "dispatcher" })[vend(v, name)] || v || "?";

  // ---------------------------------------------------------------- state
  const S = {
    tasks: new Map(), ledger: [], relay: new Map(), outbox: [], procs: new Map(),
    everUp: new Set(), fenced: new Set(), freshAt: new Map(), conn: "connecting",
  };
  const els = { relay: new Map(), ledger: new Map(), outbox: new Map() };
  let seq = 0, dirty = false;

  function reset() {
    S.tasks.clear(); S.ledger = []; S.relay.clear(); S.outbox = []; S.procs.clear();
    S.everUp.clear(); S.fenced.clear(); S.freshAt.clear();
    for (const m of Object.values(els)) m.clear();
    $("#relay").innerHTML = ""; $("#ledger").innerHTML = ""; $("#outbox").innerHTML = "";
    schedule();
  }

  function ingest(e) {
    if (!e || typeof e !== "object") return;
    switch (e.type) {
      case "task": {
        const t = e.task; if (!t || !t.taskId) return;
        const prev = S.tasks.get(t.taskId);
        const had = new Set((prev?.steps || []).map((s) => s.step));
        for (const s of t.steps || []) if (!had.has(s.step) && prev) S.freshAt.set(`${t.taskId}:${s.step}`, Date.now());
        S.tasks.set(t.taskId, { ...t, steps: t.steps || [] });
        break;
      }
      case "ledger": {
        const last = S.ledger[S.ledger.length - 1];
        const key = `${e.kind}|${e.taskId}|${String(e.text ?? "").replace(/\d+(\.\d+)?/g, "#")}`;
        let dup = -1;
        if (!["heartbeat", "commit", "claim", "done", "dm"].includes(e.kind)) for (let i = S.ledger.length - 1; i >= Math.max(0, S.ledger.length - 10); i--) if (S.ledger[i].key === key) { dup = i; break; }
        if (e.kind === "heartbeat" && last && last.kind === "heartbeat" && last.taskId === e.taskId) {
          Object.assign(last, { text: e.text, ts: e.ts, count: last.count + 1, upd: true });
        } else if (dup >= 0) {
          const r = S.ledger.splice(dup, 1)[0];
          Object.assign(r, { text: e.text, ts: e.ts, count: r.count + 1, upd: true, move: true });
          S.ledger.push(r);
        } else {
          S.ledger.push({ id: ++seq, key, kind: e.kind, taskId: e.taskId, text: e.text, ts: e.ts, count: 1 });
          if (S.ledger.length > 300) S.ledger.shift();
        }
        if (e.kind === "rejected") S.fenced.add(e.taskId);
        break;
      }
      case "relay": {
        const m = e.msg; if (!m) return;
        const id = m.id ?? `local-${++seq}`;
        S.relay.set(id, { ...(S.relay.get(id) || {}), ...m, id, upd: true });
        break;
      }
      case "outbox": S.outbox.push({ id: ++seq, taskId: e.taskId, text: e.text, ts: e.ts }); break;
      case "proc":
        S.procs.set(e.name, { name: e.name, status: e.status, pid: e.pid });
        if (e.status === "up") S.everUp.add(e.name);
        break;
      case "reset": reset(); return;
      default: return;
    }
    schedule();
  }

  function schedule() { if (!dirty) { dirty = true; requestAnimationFrame(render); } }

  // ---------------------------------------------------------------- render
  function render() {
    dirty = false;
    renderTasks(); renderRelay(); renderLedger(); renderOutbox(); renderProcs(); updateGhostStates(); renderStory();
  }

  function badgeFor(t) {
    if (t.state === "LOST") return `<span class="badge lost">presumed dead · handing to attempt ${esc(t.epoch)}</span>`;
    if (t.state === "DONE") return `<span class="badge done">done · ${t.epoch > 1 ? "finished by " + esc(vendLabel(t.vendor, t.owner)) : "completed"}</span>`;
    if (t.epoch > 1 && vend(t.vendor, t.owner) === "claude") return `<span class="badge took"><i class="hb"></i>taken over by Claude · heartbeat</span>`;
    return `<span class="badge run"><i class="hb"></i>heartbeat</span>`;
  }

  function stepRow(t, i, committed, maxDone) {
    const s = committed.get(i), name = STEP_NAMES[i - 1] || `step ${i}`;
    const fin = i === 6 ? " final" : "";
    if (s) {
      const v = vend(s.vendor, s.author);
      const fresh = Date.now() - (S.freshAt.get(`${t.taskId}:${i}`) || 0) < 900 ? " fresh" : "";
      const cites = i > 1 && new RegExp(`step ${i - 1}`, "i").test(s.text || "") ? `<span class="tag mid">cites step ${i - 1}</span>` : "";
      return `<li class="step done${v === "claude" ? " by-claude" : ""}${fin}${fresh}"><span class="n">${i}</span><div>
        <span class="name">${esc(name)}</span><span class="tags">
        <span class="tag ${v}">${esc(s.author)} · ${esc(vendLabel(s.vendor, s.author))}</span>
        <span class="tag">epoch ${esc(s.epoch)}</span>
        <span class="tag mid">relay ${s.relayMsgId ? esc(short(s.relayMsgId)) : "pending"}</span>${cites}</span>
        <div class="txt">${esc(s.text)}</div></div></li>`;
    }
    let cls = "", txt = "&nbsp;";
    if (i === maxDone + 1 && t.state === "RUNNING") cls = " now", txt = "";
    if (i === maxDone + 1 && t.state === "LOST") cls = " stuck", txt = `abandoned mid-step · resumes here (step ${i})`;
    return `<li class="step${cls}${fin}"><span class="n">${i}</span><div><span class="name">${esc(name)}</span><div class="txt">${txt}</div></div></li>`;
  }

  function renderTasks() {
    const box = $("#tasks");
    if (!S.tasks.size) { if (!box.querySelector(".empty")) box.innerHTML = `<div class="empty">no task yet. waiting for <code>/task/start</code>…</div>`; return; }
    const html = [];
    for (const t of S.tasks.values()) {
      const committed = new Map();
      for (const s of t.steps) { const p = committed.get(s.step); if (!p || s.epoch > p.epoch) committed.set(s.step, s); }
      const maxDone = committed.size ? Math.max(...committed.keys()) : 0;
      const fence = S.fenced.has(t.taskId) ? `<span class="badge fence">late write from the old agent blocked</span>` : "";
      const det = t.detectLatencyMs != null ? `<span>detect latency <b>${(t.detectLatencyMs / 1000).toFixed(1)}s</b></span>` : "";
      const v = vend(t.vendor, t.owner);
      html.push(`<article class="card" data-task="${esc(t.taskId)}">
        <div class="cardhead"><span class="tid">${esc(t.taskId)}</span>${badgeFor(t)}${fence}
          <span class="owner">owner <span class="tag ${v}">${esc(t.owner)} · ${esc(vendLabel(t.vendor, t.owner))}</span></span></div>
        <div class="lease"><span class="lbl">lease</span><div class="bar"><i></i></div><span class="val">–</span></div>
        <div class="stats"><span>attempt <b>${esc(t.epoch)}</b> (epoch)</span><span>step <b>${maxDone}/6</b> committed</span>
          <span>last heartbeat <b class="hbago">–</b></span>${det}</div>
        <ol class="steps">${STEP_NAMES.map((_, k) => stepRow(t, k + 1, committed, maxDone)).join("")}</ol></article>`);
    }
    box.innerHTML = html.join("");
    tickLease(true);
  }

  // Live lease bar + "last heartbeat ago", every frame.
  function tickLease(justRendered) {
    const now = Date.now();
    for (const card of document.querySelectorAll(".card")) {
      const t = S.tasks.get(card.dataset.task); if (!t) continue;
      const bar = card.querySelector(".bar"), fill = bar.firstElementChild, val = card.querySelector(".val");
      const exp = toMs(t.leaseExpiresAt ?? now), hb = toMs(t.lastHeartbeatAt ?? now);
      const total = Math.max(1000, t.leaseExpiresAt && t.lastHeartbeatAt ? exp - hb : LEASE_MS);
      let frac = 0, label;
      if (t.state === "RUNNING") {
        const rem = Math.max(0, exp - now); frac = rem / total;
        label = rem > 0 ? `${(rem / 1000).toFixed(1)}s left` : "expired · alarm firing";
      } else if (t.state === "LOST") label = "expired · DM sent";
      else label = "released";
      fill.style.transform = `scaleX(${frac.toFixed(4)})`;
      bar.className = "bar" + (frac < 0.25 ? " low" : frac < 0.5 ? " mid" : "");
      val.textContent = label;
      const ago = card.querySelector(".hbago");
      if (ago) ago.textContent = t.lastHeartbeatAt ? `${((now - hb) / 1000).toFixed(1)}s ago` : "–";
      if (justRendered && now - hb < 450 && t.state === "RUNNING") card.querySelector(".hb")?.classList.add("beat");
    }
  }

  function renderRelay() {
    const list = $("#relay");
    for (const m of S.relay.values()) {
      if (!m.upd) continue; m.upd = false;
      let li = els.relay.get(m.id);
      if (!li) { li = document.createElement("li"); els.relay.set(m.id, li); list.prepend(li); }
      const d = m.data || {};
      const isDm = d.kind === "dm" || d.resumeFromStep != null || !m.channel || /^dm/i.test(m.channel);
      const v = vend("", m.from);
      const ch = isDm ? `DM → ${esc(d.to || m.to || "standbyclaude")}` : `#${esc(String(m.channel).replace(/^#/, ""))}`;
      let kind = `<span class="kind">${esc(d.kind || "message")}</span>`;
      if (isDm) kind = `<span class="kind dm">dm · resume from step ${esc(d.resumeFromStep ?? "?")} · key ${esc(d.taskId ?? "")}:${esc(d.epoch ?? "")}</span>`;
      else if (d.step != null) kind = `<span class="kind">${esc(d.kind || "checkpoint")} · step ${esc(d.step)} · epoch ${esc(d.epoch)}</span>`;
      const stale = m.stale ? `<span class="kind stale">stale (attempt ${esc(d.epoch ?? 1)}, superseded)</span>` : "";
      li.className = `msg${isDm ? " dm" : ""}${m.stale ? " stale" : ""}`;
      li.innerHTML = `<div class="mh"><span class="from ${v}">${esc(m.from)}</span><span class="ch">${ch}</span>${kind}${stale}
        <span class="ts">${hms(m.ts)}</span></div><div class="mt">${esc(m.text)}</div><div class="mh"><span class="mid">id ${esc(m.id)}</span></div>`;
    }
    $("#relay-count").textContent = `${S.relay.size} message${S.relay.size === 1 ? "" : "s"} · live from Agent Relay`;
  }

  function renderLedger() {
    const list = $("#ledger");
    for (const r of S.ledger) {
      let li = els.ledger.get(r.id);
      if (li && !r.upd) continue;
      r.upd = false;
      if (!li) { li = document.createElement("li"); els.ledger.set(r.id, li); list.prepend(li); }
      else if (r.move) { r.move = false; list.prepend(li); }
      li.className = r.kind + (r.count > 1 && r.kind !== "heartbeat" ? " bump" : "");
      li.innerHTML = `<span class="t">${hms(r.ts)}</span><span class="k ${esc(r.kind)}">${esc(r.kind)}</span><span class="x" title="${esc(r.text)}">${r.count > 1 ? `<span class="xn">×${r.count}</span> ` : ""}${esc(r.text)}</span>`;
      if (r.count > 1 && r.kind !== "heartbeat") { li.style.animation = "none"; void li.offsetWidth; li.style.animation = ""; }
    }
    while (list.children.length > 120) { const last = list.lastElementChild; for (const [k, v] of els.ledger) if (v === last) els.ledger.delete(k); last.remove(); }
  }

  function renderOutbox() {
    const list = $("#outbox");
    for (const o of S.outbox) {
      if (els.outbox.has(o.id)) continue;
      const li = document.createElement("li");
      li.innerHTML = `<span class="t">${hms(o.ts)}</span><span class="x" title="${esc(o.text)}">${esc(o.text)}</span>`;
      els.outbox.set(o.id, li); list.prepend(li);
    }
    const n = S.outbox.length, c = $("#outbox-count");
    c.className = "bigcount " + (n === 0 ? "zero" : n === 1 ? "one" : "many");
    const done = [...S.tasks.values()].some((t) => t.state === "DONE");
    $(".panel.outbox").classList.toggle("final", done && n === 1);
    c.innerHTML = n > 1 ? `refund issued: <b>${n}</b> times · DOUBLE REFUND` : `refund issued: <b>${n}</b> time${n === 1 ? "" : "s"}${n === 1 ? " <small>✓ exactly once</small>" : ""}`;
  }

  function renderProcs() {
    const items = [...S.procs.values()];
    if (!items.some((p) => role(p.name) === "worker")) items.unshift({ name: "workergpt", status: "offline", ph: true });
    if (!items.some((p) => role(p.name) === "claude")) items.push({ name: "standbyclaude", status: "offline", ph: true });
    const srv = S.conn === "live" || S.conn === "mock";
    const chip = (name, cls, st, sub) => `<div class="chip ${cls}"><i class="dot"></i><span>${esc(name)}${sub ? ` <span style="color:var(--dim)">${esc(sub)}</span>` : ""}</span><span class="st">${esc(st)}</span></div>`;
    const html = [chip("afterlife", srv ? "up" : "down", srv ? "always-on" : "unreachable", "lease+dispatch")];
    for (const p of items) {
      const r = role(p.name);
      const sub = { worker: "OpenAI", claude: "Claude", zombie: "zombie" }[r] || "";
      let cls = p.status, st = p.status;
      if (p.status === "up") st = p.pid ? `up · pid ${p.pid}` : "up";
      else if (p.status === "down" && S.everUp.has(p.name)) st = r === "worker" ? "down · killed" : "down";
      else { cls = "offline"; st = "offline"; }
      html.push(chip(p.name, cls, st, sub));
    }
    $("#procs").innerHTML = html.join("");
  }

  // ---------------------------------------------------------------- story caption (derived from state)
  const STORY = [
    "waiting for a task…",
    "① GPT agent working the refund <span class=\"v openai\">(OpenAI)</span>",
    "② GPT killed mid-task <code>kill -9</code>",
    "③ lease expired — presumed dead, attempt 2",
    "④ handoff DM waiting in Agent Relay — Claude is offline",
    "⑤ Claude boots, drains the DM, rebuilds steps 1–3 from Relay history",
    "⑥ finished by <span class=\"v claude\">Claude</span> — refund issued exactly once",
  ];
  let storyStage = -1;
  function storyState() {
    const t = [...S.tasks.values()].pop();
    if (!t) return { stage: 0 };
    const procs = [...S.procs.values()];
    const wDown = procs.some((p) => role(p.name) === "worker" && p.status === "down" && S.everUp.has(p.name));
    const cUp = procs.some((p) => role(p.name) === "claude" && p.status === "up");
    const cOwns = vend(t.vendor, t.owner) === "claude";
    const dm = [...S.relay.values()].some((m) => (m.data || {}).kind === "dm" || (m.data || {}).resumeFromStep != null);
    const committed = new Set(t.steps.map((s) => s.step)).size;
    const fenced = S.fenced.has(t.taskId);
    let stage, sub = "";
    if (t.state === "DONE") { stage = 6; sub = `6/6 steps · ${S.outbox.length === 1 ? "outbox: 1 refund" : `outbox: ${S.outbox.length} refunds`}`; }
    else if (cUp || cOwns) { stage = 5; sub = cOwns ? `attempt ${t.epoch} · resumed at step ${Math.min(6, (Math.max(0, ...t.steps.filter((s) => s.epoch < t.epoch).map((s) => s.step)) || 0) + 1)} · ${committed}/6 committed` : "draining queued DM…"; }
    else if (t.state === "LOST" && dm) { stage = 4; sub = `${committed}/6 steps committed · checkpoints safe in Relay`; }
    else if (t.state === "LOST" || t.epoch > 1) { stage = 3; sub = t.detectLatencyMs != null ? `no heartbeat for ${(t.detectLatencyMs / 1000).toFixed(1)}s` : ""; }
    else if (wDown) { stage = 2; sub = "heartbeats stopped · lease draining"; }
    else { stage = 1; sub = `${committed}/6 steps committed · heartbeat every 2s`; }
    return { stage, sub, fenced: fenced && stage >= 5 };
  }
  function renderStory() {
    const st = storyState(), box = $("#story"), cap = $("#story-cap");
    if (st.stage !== storyStage) {
      storyStage = st.stage;
      cap.innerHTML = STORY[st.stage];
      box.dataset.stage = st.stage;
      cap.classList.remove("in"); void cap.offsetWidth; cap.classList.add("in");
    }
    $("#story-sub").innerHTML = (st.fenced ? `<span class="zb">✕ late write from the old agent blocked</span> ` : "") + esc(st.sub || "");
    [...$("#story-pips").children].forEach((li, i) => { li.className = i + 1 < st.stage ? "past" : i + 1 === st.stage ? "cur" : ""; });
  }

  // ---------------------------------------------------------------- handoff fx
  for (const [sel, cls] of [["#ghost-worker", "souldrift"], ["#ghost-claude", "ensouled"], [".panel.tasks", "redflash"]])
    $(sel).addEventListener("animationend", (e) => { if (/^(drift|ensoul|redflash)$/.test(e.animationName)) $(sel).classList.remove(cls); });
  function fxDeath() {
    const g = $("#ghost-worker");
    g.classList.remove("souldrift"); void g.offsetWidth; g.classList.add("souldrift");
    const p = $(".panel.tasks"); p.classList.remove("redflash"); void p.offsetWidth; p.classList.add("redflash");
  }
  function fxSoul() {
    const a = $("#ghost-worker svg").getBoundingClientRect(), b = $("#ghost-claude svg").getBoundingClientRect();
    const x0 = a.left + a.width / 2, y0 = a.top + a.height * 0.4, x1 = b.left + b.width / 2, y1 = b.top + b.height * 0.4;
    const orb = document.createElement("div"); orb.className = "soul";
    document.body.appendChild(orb);
    const kf = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12, x = lerp(x0, x1, t), y = lerp(y0, y1, t) - Math.sin(t * Math.PI) * 70;
      kf.push({ transform: `translate(${x - 12}px, ${y - 12}px) scale(${(0.6 + Math.sin(t * Math.PI) * 0.7).toFixed(2)})`, opacity: t < 0.9 ? 1 : 0, offset: t });
    }
    const anim = orb.animate(kf, { duration: 1100, easing: "ease-in-out" });
    anim.onfinish = () => {
      orb.remove();
      const c = $("#ghost-claude"); c.classList.remove("ensouled"); void c.offsetWidth; c.classList.add("ensouled");
    };
  }

  function setConn(s) {
    S.conn = s;
    const el = $("#conn");
    el.className = "pill " + s;
    el.lastElementChild.textContent = { live: "live · /events", mock: "scripted replay", down: "reconnecting…", connecting: "connecting" }[s] || s;
    schedule();
  }

  // ---------------------------------------------------------------- ghosts
  const GHOST_BODY = "M14 74C14 34 36 10 60 10C84 10 106 34 106 74L106 128Q99 118 92 128Q85 138 78 128Q71 118 64 128Q57 138 50 128Q43 118 36 128Q29 138 22 128Q16 120 14 128Z";
  const LASH_X = [4.55, 8.26, 12, 15.74, 19.45];
  const bez = (t, a, b, c, d) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
  const ghosts = [
    { id: "worker", el: $("#ghost-worker"), color: "#74e0b4", body: "rgba(226,255,243,0.93)", open: 0.15, target: 1, px: 0, py: 0, blinkAt: 0 },
    { id: "claude", el: $("#ghost-claude"), color: "#ef8f63", body: "rgba(255,232,220,0.93)", open: 0, target: 0, px: 0, py: 0, blinkAt: 0 },
  ];
  for (const g of ghosts) {
    const svg = g.el.querySelector("svg");
    svg.style.filter = `drop-shadow(0 0 16px ${g.color}88)`;
    svg.innerHTML = `<defs><clipPath id="clip-${g.id}"><path class="lensclip"/></clipPath></defs>
      <path class="body" d="${GHOST_BODY}" fill="${g.body}"/>
      <g transform="translate(31.2 27.2) scale(2.4)">
        <path class="lens" fill="#170c26"/>
        <g clip-path="url(#clip-${g.id})"><circle class="pupil" cx="12" cy="12" r="4.3" fill="${g.color}"/><circle class="glint" cx="13.4" cy="10.6" r="1.1" fill="#fff"/></g>
        <path class="lid" fill="none" stroke="#170c26" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <ellipse class="mouth" cx="60" cy="98" rx="5" ry="6" fill="#170c26"/>`;
    g.lens = svg.querySelector(".lens"); g.clip = svg.querySelector(".lensclip"); g.lid = svg.querySelector(".lid");
    g.pupil = svg.querySelector(".pupil"); g.glint = svg.querySelector(".glint"); g.mouth = svg.querySelector(".mouth"); g.svg = svg;
  }

  let mx = innerWidth / 2, my = innerHeight / 2;
  addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function eyePaths(open) {
    const f = (n) => n.toFixed(2);
    const yU = lerp(15, 4.5, open), yL = lerp(15, 19.5, open);
    const lens = `M1.5 12C7 ${f(yU)} 17 ${f(yU)} 22.5 12C17 ${f(yL)} 7 ${f(yL)} 1.5 12Z`;
    const lp = clamp01((open - 0.1) / 0.9);
    let lashes = "";
    for (const x of LASH_X) {
      const k = (x - 12) * 4.1, y = bez((x - 1.5) / 21, 12, yU, yU, 12);
      const a = (lerp(k < 0 ? -270 - k : 90 - k, -90 + k, lp) * Math.PI) / 180;
      lashes += `M${f(x)} ${f(y)}L${f(x + Math.cos(a) * 2.75)} ${f(y + Math.sin(a) * 2.75)}`;
    }
    return { lens, lashes, pupil: clamp01((open - 0.08) / 0.8) };
  }

  function updateGhostStates() {
    const tasks = [...S.tasks.values()];
    const procOf = (r) => [...S.procs.values()].filter((p) => role(p.name) === r);
    const wUp = procOf("worker").some((p) => p.status === "up");
    const wEver = procOf("worker").some((p) => S.everUp.has(p.name));
    const cUp = procOf("claude").some((p) => p.status === "up");
    const lostOrTaken = tasks.some((t) => t.state === "LOST" || t.epoch > 1);
    const cOwns = tasks.some((t) => vend(t.vendor, t.owner) === "claude");
    const done = tasks.some((t) => t.state === "DONE");
    const set = (g, state, label, target) => { g.el.dataset.state = state; g.el.querySelector(".gstate").textContent = label; g.target = target; g.state = state; };
    const [w, c] = ghosts;
    if (wUp && !lostOrTaken) set(w, "alive", "heartbeat", 1);
    else if (lostOrTaken) set(w, "dead", "presumed dead", 0);
    else if (wEver) set(w, "dying", "silent · no heartbeat", 0.45);
    else set(w, "idle", "waiting", 0.7);
    if (!cUp && !S.everUp.has(procOf("claude")[0]?.name)) set(c, "offline", lostOrTaken ? "offline · DM queued" : "offline", 0);
    else if (!cUp) set(c, "offline", "down", 0);
    else if (done && cOwns) set(c, "alive", "finished it", 1);
    else if (cOwns) set(c, "alive", "taken over", 1);
    else set(c, "alive", "draining DM", 1);
    if (w.state === "dead" && w.prevState && w.prevState !== "dead") fxDeath();
    if (cOwns && !done && !c.ownedFx) { c.ownedFx = true; fxSoul(); }
    if (!cOwns) c.ownedFx = false;
    w.prevState = w.state;
  }

  function tickGhosts(now) {
    for (const g of ghosts) {
      let target = g.target;
      if (g.state === "alive") {
        if (now > g.blinkAt + 4200 + Math.random() * 3000) g.blinkAt = now;
        if (now - g.blinkAt < 140) target = 0.05;
      }
      g.open += (target - g.open) * (target > g.open ? 0.07 : 0.16);
      const r = g.svg.getBoundingClientRect();
      const cx = r.left + r.width * 0.5, cy = r.top + r.height * (56 / 140);
      let dx = mx - cx, dy = my - cy; const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(d / 260, 1) * 3.3;
      let tx = (dx / d) * k, ty = (dy / d) * k * 0.75;
      if (g.state === "dying" || g.state === "dead") { tx = 0; ty = 2.2; }
      g.px += (tx - g.px) * 0.15; g.py += (ty - g.py) * 0.15;
      const p = eyePaths(g.open);
      g.lens.setAttribute("d", p.lens); g.clip.setAttribute("d", p.lens);
      g.lid.setAttribute("d", p.lens + p.lashes);
      g.pupil.setAttribute("r", (4.3 * p.pupil).toFixed(2));
      g.pupil.setAttribute("cx", (12 + g.px).toFixed(2)); g.pupil.setAttribute("cy", (12 + g.py).toFixed(2));
      g.glint.setAttribute("r", (1.1 * p.pupil).toFixed(2));
      g.glint.setAttribute("cx", (13.4 + g.px).toFixed(2)); g.glint.setAttribute("cy", (10.6 + g.py).toFixed(2));
      g.mouth.setAttribute("ry", (1.4 + 4.8 * g.open).toFixed(2));
    }
  }

  // ---------------------------------------------------------------- sky
  const sky = $("#sky"), cx2 = sky.getContext("2d");
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const DUSK = ["#3b1d6e", "#de4b2c", "#f59a3b"].map(hex), NIGHT = ["#04020a", "#150a2c", "#34124a"].map(hex);
  const mix = (a, b, t) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;
  let W = 0, H = 0, phase = 0.1;
  const stars = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random() * 0.9, r: Math.random() * 1.3 + 0.3, s: Math.random() * 2 + 0.5, p: Math.random() * 6.3 }));
  const fogs = Array.from({ length: 6 }, (_, i) => ({ x: Math.random(), y: 0.12 + Math.random() * 0.3, w: 0.25 + Math.random() * 0.3, v: (0.004 + Math.random() * 0.006) * (i % 2 ? 1 : -1) }));
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; sky.width = W * dpr; sky.height = H * dpr; cx2.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", resize); resize();

  function skyTarget() {
    let p = 0.12;
    for (const t of S.tasks.values()) {
      const n = t.steps.length;
      p = Math.max(p, t.state === "DONE" ? 1 : t.state === "LOST" ? 0.78 : t.epoch > 1 ? 0.86 + n * 0.015 : 0.2 + n * 0.1);
    }
    return p;
  }

  function drawSky(now) {
    const t = now / 1000;
    phase += (skyTarget() - phase) * 0.012;
    const g = cx2.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mix(DUSK[0], NIGHT[0], phase)); g.addColorStop(0.58, mix(DUSK[1], NIGHT[1], phase)); g.addColorStop(1, mix(DUSK[2], NIGHT[2], phase));
    cx2.fillStyle = g; cx2.fillRect(0, 0, W, H);
    for (const s of stars) {
      const a = (0.12 + 0.88 * phase) * (0.55 + 0.45 * Math.sin(t * s.s + s.p)) * (1 - s.y * 0.8);
      if (a < 0.02) continue;
      cx2.globalAlpha = a; cx2.fillStyle = "#fff6e6";
      cx2.beginPath(); cx2.arc(s.x * W, s.y * H, s.r, 0, 6.283); cx2.fill();
    }
    cx2.globalAlpha = 1;
    const mxp = W * 0.58, myp = lerp(H * 0.7, H * 0.13, clamp01(phase * 1.15)), mr = 30;
    const glow = cx2.createRadialGradient(mxp, myp, mr * 0.6, mxp, myp, mr * 5);
    glow.addColorStop(0, `rgba(255,236,200,${0.3 * phase + 0.08})`); glow.addColorStop(1, "rgba(255,236,200,0)");
    cx2.fillStyle = glow; cx2.fillRect(mxp - mr * 5, myp - mr * 5, mr * 10, mr * 10);
    cx2.fillStyle = "#fff1d6"; cx2.beginPath(); cx2.arc(mxp, myp, mr, 0, 6.283); cx2.fill();
    cx2.fillStyle = "rgba(200,170,140,.35)";
    for (const [ox, oy, rr] of [[-9, -6, 6], [8, 5, 8], [-4, 12, 4], [11, -11, 3.5]]) { cx2.beginPath(); cx2.arc(mxp + ox, myp + oy, rr, 0, 6.283); cx2.fill(); }
    for (const f of fogs) {
      f.x += f.v / 60; if (f.x > 1.4) f.x = -0.4; if (f.x < -0.4) f.x = 1.4;
      const fx = f.x * W, fy = f.y * H, fw = f.w * W;
      const fg = cx2.createRadialGradient(fx, fy, 0, fx, fy, fw / 2);
      fg.addColorStop(0, phase < 0.5 ? "rgba(255,205,160,0.10)" : "rgba(170,140,220,0.07)"); fg.addColorStop(1, "rgba(0,0,0,0)");
      cx2.fillStyle = fg; cx2.fillRect(fx - fw / 2, fy - fw / 2, fw, fw);
    }
  }

  function frame(now) {
    drawSky(now); tickGhosts(now); tickLease(false);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ---------------------------------------------------------------- wiring
  const MODE_DEMO = !!window.AL_DEMO;
  // ---- mode badge + controls
  {
    const mp = $("#modepill"), mt = $("#modetext");
    mp.classList.add(MODE_DEMO ? "demo" : "livemode");
    mt.textContent = MODE_DEMO ? "SIMULATED REPLAY — scripted events, no live agents" : "LIVE — real GPT · Claude · Agent Relay · Terse";
    $(MODE_DEMO ? "#nav-demo" : "#nav-live")?.classList.add("on");
  }
  window.afterlife = { ingest, reset, setConn, state: S };
  render();

  const MOCK = !!window.AL_DEMO;
  const showBackend = (b) => { if (b === "terse") { const el = $("#backend"); el.textContent = "Terse Durable Actor · lease 8s · alarm-driven"; el.classList.add("terse"); } };
  if (MOCK) showBackend("terse");
  else fetch("/health").then((r) => (r.ok ? r.json() : null)).then((h) => h && showBackend(h.backend)).catch(() => {});
  if (!MOCK && typeof EventSource !== "undefined") {
    const es = new EventSource("/events");
    const on = (ev) => { try { ingest(JSON.parse(ev.data)); } catch (err) { console.warn("bad event", err); } };
    es.onopen = () => { reset(); setConn("live"); };
    es.onerror = () => setConn("down");
    es.onmessage = on;
    for (const n of ["task", "ledger", "relay", "outbox", "proc"]) es.addEventListener(n, on);
  }

  // ---------------------------------------------------------------- live controls
  if (!MODE_DEMO) {
    const box = $("#controls"), toastEl = $("#toast");
    box.hidden = false;
    let tt, st = null, off = false, busy = false;
    const toast = (msg, bad = true) => { toastEl.textContent = msg; toastEl.className = "toast" + (bad ? " bad" : ""); toastEl.hidden = false; clearTimeout(tt); tt = setTimeout(() => (toastEl.hidden = true), 4000); };
    const post = async (path, body) => {
      if (busy) return; busy = true; paint();
      try {
        const r = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body || {}) });
        if (r.status === 404) { off = true; toast("controls unavailable (server has no " + path + ")"); }
        else if (!r.ok) { let m = ""; try { const j = await r.json(); m = j.error || j.message || JSON.stringify(j); } catch (e) {} toast(r.status + " " + path + (m ? ": " + m : "")); }
        else poll();
      } catch (e) { toast("request failed: " + e.message); }
      busy = false; paint();
    };
    const taskStatus = () => { const l = [...S.tasks.values()]; const t = (st && l.find((x) => x.taskId === st.taskId)) || l[l.length - 1]; return (t && t.state) || ""; };
    function paint() {
      const w = st && st.worker, sb = st && st.standby;
      const alive = !!(w && w.alive), ts = String(taskStatus()).toUpperCase();
      const done = ts === "DONE", lost = ts === "LOST";
      const en = (id, on) => { $(id).disabled = off || busy || !st || !on; };
      en("#b-run", !alive || done); en("#b-kill", alive);
      en("#b-freeze", alive && !w.frozen && !!(st && st.zombie !== false)); en("#b-thaw", alive && !!w.frozen);
      const dmIn = [...S.relay.values()].some((m) => (m.data || {}).kind === "dm" || (m.data || {}).resumeFromStep != null);
      en("#b-standby", lost && dmIn && !(sb && sb.alive)); // wake Claude only once the handoff DM is queued in Relay
      $("#c-hint").textContent = off ? "controls unavailable"
        : lost && !dmIn ? "handoff DM on its way to Relay… (Wake Claude unlocks when it lands)"
        : "Start → wait for step 3 → Kill → wait for DM → Wake Claude";
      box.classList.toggle("off", off);
    }
    async function poll() {
      try {
        const r = await fetch("/control/state", { cache: "no-store" });
        if (r.status === 404) { off = true; st = st || {}; } else if (r.ok) { st = await r.json(); off = false; }
      } catch (e) { /* server restarting */ }
      paint();
    }
    $("#b-run").onclick = () => { const c = $("#c-complaint").value.trim(), b = {}; if (c) b.complaint = c; if ($("#c-zombie").checked) b.zombie = true; post("/control/run", b); };
    $("#b-kill").onclick = () => post("/control/kill");
    $("#b-freeze").onclick = () => post("/control/freeze");
    $("#b-thaw").onclick = () => post("/control/thaw");
    $("#b-standby").onclick = () => post("/control/standby");
    paint(); poll(); setInterval(poll, 1000);
  }
})();
