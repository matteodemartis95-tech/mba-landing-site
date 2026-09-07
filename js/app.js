/* Jahizoun MBA Tracker — application logic (no build step, no dependencies). */
(function () {
  "use strict";

  const BASE = window.MBA_DATA;
  const STORAGE_KEY = "jahizoun-mba-tracker:v1";
  const STATUSES = BASE.STATUSES;
  const SCHOOLS = BASE.SCHOOLS;
  const DEADLINES = BASE.DEADLINES;
  const STAGE_LABELS = ["Plan", "Draft", "Essays", "Submitted", "Invited", "Interview", "Decision"];

  /* ---------- state ---------- */
  let candidates = load();
  let editMode = false;
  let filters = { q: "", programme: "all", school: "all", stage: "all", team: "all", sort: "next" };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return deepClone(BASE.CANDIDATES);
  }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates)); } catch (e) { toast("Could not save locally: " + e.message); }
  }
  function hasLocalChanges() { try { return !!localStorage.getItem(STORAGE_KEY); } catch (e) { return false; } }
  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- helpers ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function parseDate(s) {
    if (!s) return null;
    const m = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3]);
  }
  function parseDates(s) {
    return String(s || "").split(/[,;/]|\s+and\s+/).map(x => parseDate(x.trim())).filter(Boolean).sort((a, b) => a - b);
  }
  function fmt(d, withDay) {
    if (!d) return "";
    return (withDay ? DAYS[d.getDay()] + " " : "") + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }
  function fmtList(s) {
    const ds = parseDates(s);
    if (!ds.length) return s ? esc(s) : "";
    if (ds.length === 1) return fmt(ds[0], true);
    const sameMonth = ds.every(d => d.getMonth() === ds[0].getMonth() && d.getFullYear() === ds[0].getFullYear());
    if (sameMonth) return ds.map(d => d.getDate()).join(" & ") + " " + MONTHS[ds[0].getMonth()] + " " + ds[0].getFullYear();
    return ds.map(d => fmt(d)).join(", ");
  }
  function daysFrom(d) { return Math.round((d - today) / 86400000); }
  function relative(d) {
    const n = daysFrom(d);
    if (n === 0) return "today";
    if (n === 1) return "tomorrow";
    if (n === -1) return "yesterday";
    if (n < 0) return Math.abs(n) + " days ago";
    return "in " + n + " days";
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function initials(name) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join(""); }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function school(k) { return SCHOOLS[k] || { name: k, short: k, logo: "" }; }
  function status(k) { return STATUSES[k] || { label: k, stage: 0, tone: "muted" }; }
  function nextInterview(c) {
    let best = null;
    c.applications.forEach(a => {
      parseDates(a.interview && a.interview.date).forEach(d => {
        if (daysFrom(d) >= 0 && (!best || d < best.date)) best = { date: d, school: a.school };
      });
    });
    return best;
  }
  function pendingInterviews(c) { return c.applications.filter(a => (a.status === "invited" || a.status === "scheduled") && !parseDates(a.interview && a.interview.date).length); }
  function teams() { return [...new Set(candidates.filter(c => c.programme === "Jahizoun" && c.team).map(c => c.team))].sort(); }
  const MONTH_INDEX = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  function intakeKey(s) {
    const y = (s || "").match(/\d{4}/), m = (s || "").toLowerCase().match(/[a-z]{3}/);
    return { year: y ? +y[0] : null, month: m && MONTH_INDEX[m[0]] != null ? MONTH_INDEX[m[0]] : null };
  }
  function intakeForDeadlines(c, schoolKey) {
    const blocks = DEADLINES.filter(d => d.school === schoolKey);
    if (!blocks.length) return null;
    const want = intakeKey(c.intake);
    if (want.year == null) return blocks[0];
    // nearest intake in time (e.g. a "September 2027" target maps to INSEAD's "August 2027" intake)
    let best = null, bestDist = Infinity;
    blocks.forEach(b => {
      const k = intakeKey(b.intake);
      if (k.year == null) return;
      const dist = Math.abs((k.year * 12 + (k.month || 0)) - (want.year * 12 + (want.month || 0)));
      if (dist < bestDist) { best = b; bestDist = dist; }
    });
    return best || blocks[0];
  }
  function nextRound(block) {
    const rs = block.rounds;
    // the round whose application deadline has passed most recently (the one candidates are in), else the next upcoming
    let current = null;
    rs.forEach(r => {
      const app = parseDate(r.application);
      const fin = parseDate(r.finalDecision);
      const end = fin || (app && new Date(app.getTime() + 70 * 86400000));
      if (app && daysFrom(app) <= 0 && end && daysFrom(end) >= 0 && !current) current = r;
    });
    if (current) return current;
    return rs.find(r => parseDate(r.application) && daysFrom(parseDate(r.application)) >= 0) || rs[rs.length - 1];
  }

  /* ---------- rendering: shared ---------- */
  function avatar(c, large) {
    const cls = "avatar" + (large ? " large" : "") + (c.photo ? "" : " placeholder");
    const inner = c.photo ? `<img src="${esc(c.photo)}" alt="${esc(c.name)}" onerror="this.parentNode.classList.add('placeholder');this.outerHTML='<span class=initials>${esc(initials(c.name))}</span>'">`
                          : `<span class="initials" title="Photo to be added">${esc(initials(c.name))}</span>`;
    return `<div class="${cls}">${inner}</div>`;
  }
  function programmeBadge(c) { return `<span class="badge ${c.programme === "EDGE" ? "edge" : "jahizoun"}">${esc(c.programme)}</span>`; }
  function teamBadge(c) { return c.programme === "Jahizoun" && c.team ? `<span class="badge team">${esc(c.team)}</span>` : ""; }
  function statusPill(a) { const s = status(a.status); return `<span class="status ${s.tone}"><span class="st ${s.tone}"></span>${esc(s.label)}</span>`; }

  /* ---------- rendering: home ---------- */
  function renderHome() {
    const total = candidates.length;
    const scheduled = candidates.reduce((n, c) => n + c.applications.filter(a => parseDates(a.interview && a.interview.date).some(d => daysFrom(d) >= 0)).length, 0);
    const pending = candidates.reduce((n, c) => n + pendingInterviews(c).length, 0);
    const submitted = candidates.reduce((n, c) => n + c.applications.filter(a => status(a.status).stage >= 3).length, 0);
    const drafting = candidates.reduce((n, c) => n + c.applications.filter(a => status(a.status).stage < 3).length, 0);
    const admitted = candidates.reduce((n, c) => n + c.applications.filter(a => a.status === "admitted").length, 0);

    const tile = (key, label, value, sub, dot) =>
      `<button class="tile ${filters.stage === key ? "active" : ""}" data-stage="${key}"><div class="label"><span class="dot ${dot}"></span>${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></button>`;

    const list = filtered();
    const teamOpts = teams().map(t => `<option value="${esc(t)}" ${filters.team === t ? "selected" : ""}>${esc(t)}</option>`).join("");
    const schoolOpts = Object.keys(SCHOOLS).map(k => `<option value="${k}" ${filters.school === k ? "selected" : ""}>${esc(SCHOOLS[k].short)}</option>`).join("");

    return `
      <div class="page-head">
        <div><h1>Candidates</h1><p>MBA application status for the Jahizoun and EDGE candidates on EO secondment. Click a card to open the profile.</p></div>
        <div class="muted small">Updated ${fmt(today, true)}</div>
      </div>
      <div class="tiles">
        ${tile("all", "Candidates", total, `${candidates.filter(c => c.programme === "Jahizoun").length} Jahizoun · ${candidates.filter(c => c.programme === "EDGE").length} EDGE`, "accent")}
        ${tile("scheduled", "Interviews scheduled", scheduled, "with a confirmed date", "warning")}
        ${tile("invited", "Interview date pending", pending, "invited, date not yet set", "serious")}
        ${tile("submitted", "Applications submitted", submitted, "awaiting a decision", "accent")}
        ${tile("drafting", "In preparation", drafting, "drafting or finalising essays", "violet")}
        ${tile("admitted", "Admitted", admitted, "offers received", "good")}
      </div>
      <div class="overview">
        <div>
          <div class="filters">
            <input class="search" id="q" type="search" placeholder="Search by name…" value="${esc(filters.q)}">
            <div class="seg" id="progSeg">
              ${["all", "Jahizoun", "EDGE"].map(p => `<button data-p="${p}" class="${filters.programme === p ? "on" : ""}">${p === "all" ? "All" : p}</button>`).join("")}
            </div>
            <select id="schoolSel"><option value="all">All schools</option>${schoolOpts}</select>
            <select id="teamSel"><option value="all">All teams</option>${teamOpts}</select>
            <select id="sortSel">
              <option value="next" ${filters.sort === "next" ? "selected" : ""}>Sort: next interview</option>
              <option value="name" ${filters.sort === "name" ? "selected" : ""}>Sort: name</option>
              <option value="stage" ${filters.sort === "stage" ? "selected" : ""}>Sort: furthest stage</option>
            </select>
            <span class="count">${list.length} of ${total}</span>
          </div>
          ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<div class="empty">No candidates match these filters.</div>`}
        </div>
        <aside>${agenda()}</aside>
      </div>`;
  }

  function filtered() {
    let list = candidates.filter(c => {
      if (filters.q && !c.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
      if (filters.programme !== "all" && c.programme !== filters.programme) return false;
      if (filters.school !== "all" && !c.applications.some(a => a.school === filters.school)) return false;
      if (filters.team !== "all" && c.team !== filters.team) return false;
      if (filters.stage === "scheduled" && !c.applications.some(a => parseDates(a.interview && a.interview.date).some(d => daysFrom(d) >= 0))) return false;
      if (filters.stage === "invited" && !pendingInterviews(c).length) return false;
      if (filters.stage === "submitted" && !c.applications.some(a => status(a.status).stage >= 3)) return false;
      if (filters.stage === "drafting" && !c.applications.some(a => status(a.status).stage < 3)) return false;
      if (filters.stage === "admitted" && !c.applications.some(a => a.status === "admitted")) return false;
      return true;
    });
    const maxStage = c => Math.max(0, ...c.applications.map(a => status(a.status).stage));
    if (filters.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (filters.sort === "stage") list.sort((a, b) => maxStage(b) - maxStage(a) || a.name.localeCompare(b.name));
    else list.sort((a, b) => {
      const na = nextInterview(a), nb = nextInterview(b);
      if (na && nb) return na.date - nb.date;
      if (na) return -1; if (nb) return 1;
      const pa = pendingInterviews(a).length, pb = pendingInterviews(b).length;
      if (pa !== pb) return pb - pa;
      return maxStage(b) - maxStage(a) || a.name.localeCompare(b.name);
    });
    return list;
  }

  function card(c) {
    const ni = nextInterview(c);
    const pend = pendingInterviews(c);
    let footK, footV;
    if (ni) { footK = "Next interview"; footV = `<strong class="${daysFrom(ni.date) <= 7 ? "soon" : ""}">${fmt(ni.date, true)}</strong> · ${esc(school(ni.school).short)}`; }
    else if (pend.length) { footK = "Interview date"; footV = `<strong class="pending">Pending</strong> · ${pend.map(a => esc(school(a.school).short)).join(", ")}`; }
    else {
      const top = c.applications.slice().sort((a, b) => status(b.status).stage - status(a.status).stage)[0];
      footK = "Latest stage";
      footV = top ? `<strong>${esc(status(top.status).label)}</strong> · ${esc(school(top.school).short)}` : `<span class="muted">No applications yet</span>`;
    }
    return `
      <a class="card ${c.programme === "EDGE" ? "edge" : "jahizoun"}" href="#/candidate/${esc(c.id)}">
        <div class="card-top">
          ${avatar(c)}
          <div>
            <div class="card-name">${esc(c.name)}</div>
            <div class="card-meta">${programmeBadge(c)}${teamBadge(c)}${c.intake && c.intake !== "January 2027" ? `<span class="badge intake">${esc(c.intake)}</span>` : ""}</div>
          </div>
        </div>
        <div class="card-schools">
          ${c.applications.map(a => `<span class="school-chip" title="${esc(school(a.school).name)}: ${esc(status(a.status).label)}"><img class="logo" src="${esc(school(a.school).logo)}" alt=""><span>${esc(school(a.school).short)}</span><span class="st ${status(a.status).tone}"></span></span>`).join("") || `<span class="muted small">No schools yet</span>`}
        </div>
        <div class="card-foot"><div><div class="foot-k">${footK}</div><div class="foot-v">${footV}</div></div><span class="muted">${c.applications.length} school${c.applications.length === 1 ? "" : "s"}</span></div>
      </a>`;
  }

  function agenda() {
    const items = [];
    candidates.forEach(c => c.applications.forEach(a => {
      parseDates(a.interview && a.interview.date).forEach(d => {
        if (daysFrom(d) >= -3) items.push({ date: d, type: "interview", title: `${c.name}`, sub: `${school(a.school).short} interview`, href: `#/candidate/${c.id}` });
      });
    }));
    const usedSchools = new Set(candidates.flatMap(c => c.applications.map(a => a.school)));
    DEADLINES.forEach(b => {
      if (!usedSchools.has(b.school)) return;
      b.rounds.forEach(r => {
        [["interviewDecision", "Interview decisions", r.interviewDecisionApprox], ["finalDecision", "Final decisions", r.finalDecisionApprox], ["application", "Application deadline", false]].forEach(([k, label, approx]) => {
          const d = parseDate(r[k]);
          if (d && daysFrom(d) >= -3 && daysFrom(d) <= 120) items.push({ date: d, type: "deadline", title: `${school(b.school).short} · ${label}${approx ? " (approx.)" : ""}`, sub: `${r.round}, ${b.intake} intake`, href: "#/deadlines" });
        });
      });
    });
    items.sort((a, b) => a.date - b.date);
    const shown = items.slice(0, 14);
    return `
      <div class="panel">
        <div class="panel-head"><h2>Coming up</h2><span class="muted small">next 120 days</span></div>
        <div class="panel-body">
          ${shown.length ? shown.map(i => `
            <a class="agenda-item ${i.type} ${daysFrom(i.date) < 0 ? "past" : ""}" href="${i.href}">
              <div class="agenda-date"><b>${i.date.getDate()}</b><span>${MONTHS[i.date.getMonth()]}</span></div>
              <div class="agenda-text"><b>${esc(i.title)}</b><span class="small">${esc(i.sub)} · ${relative(i.date)}</span></div>
            </a>`).join("") : `<div class="muted" style="padding:16px">Nothing scheduled.</div>`}
        </div>
      </div>`;
  }

  /* ---------- rendering: profile ---------- */
  function renderProfile(id) {
    const c = candidates.find(x => x.id === id);
    if (!c) return `<a class="back" href="#/">← All candidates</a><div class="empty">Candidate not found.</div>`;
    const ni = nextInterview(c);
    return `
      <a class="back" href="#/">← All candidates</a>
      <div class="panel profile-head">
        ${avatar(c, true)}
        <div>
          <h1>${esc(c.name)}</h1>
          <div class="meta">${programmeBadge(c)}${teamBadge(c)}<span class="badge intake">Target intake: ${esc(c.intake || "—")}</span></div>
          ${c.notes ? `<div class="notes">${esc(c.notes)}</div>` : ""}
        </div>
        <div class="actions">
          ${editMode ? `<button class="btn" data-edit="${esc(c.id)}">Edit</button><button class="btn danger" data-del="${esc(c.id)}">Delete</button>` : ""}
        </div>
      </div>
      <div class="profile-grid">
        <div class="apps">
          ${c.applications.length ? c.applications.map(a => appCard(c, a)).join("") : `<div class="empty">No applications recorded yet.</div>`}
        </div>
        <div class="side">
          <div class="panel">
            <div class="panel-head"><h2>Summary</h2></div>
            <dl class="kv">
              <dt>Schools</dt><dd>${c.applications.map(a => esc(school(a.school).short)).join(", ") || "—"}</dd>
              <dt>Next interview</dt><dd>${ni ? `${fmt(ni.date, true)} · ${esc(school(ni.school).short)}` : (pendingInterviews(c).length ? "Pending" : "—")}</dd>
              <dt>Programme</dt><dd>${esc(c.programme)}</dd>
              ${c.programme === "Jahizoun" ? `<dt>EO team</dt><dd>${esc(c.team || "—")}</dd>` : ""}
              <dt>Intake</dt><dd>${esc(c.intake || "—")}</dd>
            </dl>
          </div>
          <div class="panel">
            <div class="panel-head"><h2>Key dates</h2><a class="small" href="#/deadlines" style="color:var(--accent-ink)">All deadlines →</a></div>
            <div class="panel-body">${keyDates(c)}</div>
          </div>
        </div>
      </div>`;
  }

  function appCard(c, a) {
    const s = status(a.status);
    const sch = school(a.school);
    const dates = parseDates(a.interview && a.interview.date);
    const hasDate = dates.length > 0;
    const stageBars = STAGE_LABELS.map((l, i) => {
      let cls = "stage";
      if (s.stage === 7 && i === 6) cls += " " + (s.tone === "good" ? "good" : s.tone === "critical" ? "critical" : "done");
      else if (i < s.stage) cls += " done";
      else if (i === s.stage) cls += " current";
      return `<div class="${cls}" title="${esc(l)}"></div>`;
    }).join("");
    const block = intakeForDeadlines(c, a.school);
    const r = block ? nextRound(block) : null;
    const dl = (key, approxKey) => {
      if (!r) return `<span class="muted">Not published</span>`;
      const d = parseDate(r[key]);
      if (!d) return `<span class="muted">Not published</span>`;
      return `${fmt(d)}${r[approxKey] ? `<span class="approx">approx.</span>` : ""}`;
    };
    let interviewVal, interviewCls = "";
    if (hasDate) interviewVal = fmtList(a.interview.date);
    else if (s.stage >= 4 && s.stage < 7) { interviewVal = "Pending"; interviewCls = "pending"; }
    else if (s.stage >= 7) interviewVal = a.status === "admitted" || a.status === "interviewed" ? "Completed" : "—";
    else { interviewVal = "Pending"; interviewCls = "pending"; }
    return `
      <div class="panel app">
        <div class="app-head">
          <img class="app-logo" src="${esc(sch.logo)}" alt="${esc(sch.name)}">
          <div class="app-title"><h3>${esc(sch.name)}</h3><div class="small muted">${block ? esc(block.intake) + " intake" + (r ? " · " + esc(r.round) : "") : esc(c.intake || "")}</div></div>
          ${statusPill(a)}
        </div>
        <div class="stages">${stageBars}</div>
        <div class="stage-labels">${STAGE_LABELS.map(l => `<span>${l}</span>`).join("")}</div>
        <div class="app-facts">
          <div class="fact"><div class="k">Interview</div><div class="v ${interviewCls}">${interviewVal}</div>${a.interview && a.interview.note ? `<div class="n">${esc(a.interview.note)}</div>` : ""}</div>
          <div class="fact"><div class="k">Interview decision deadline</div><div class="v">${dl("interviewDecision", "interviewDecisionApprox")}</div></div>
          <div class="fact"><div class="k">Final decision deadline</div><div class="v">${dl("finalDecision", "finalDecisionApprox")}</div></div>
        </div>
        ${a.notes ? `<div class="app-notes">${esc(a.notes)}</div>` : ""}
      </div>`;
  }

  function keyDates(c) {
    const items = [];
    c.applications.forEach(a => {
      parseDates(a.interview && a.interview.date).forEach(d => items.push({ date: d, type: "interview", title: `${school(a.school).short} interview`, sub: a.interview.note || "" }));
      const block = intakeForDeadlines(c, a.school);
      if (!block) return;
      const r = nextRound(block);
      if (!r) return;
      const idd = parseDate(r.interviewDecision), fdd = parseDate(r.finalDecision), add = parseDate(r.application);
      if (add && daysFrom(add) >= 0 && status(a.status).stage < 3) items.push({ date: add, type: "deadline", title: `${school(a.school).short} application deadline`, sub: r.round });
      if (idd) items.push({ date: idd, type: "deadline", title: `${school(a.school).short} interview decisions${r.interviewDecisionApprox ? " (approx.)" : ""}`, sub: r.round });
      if (fdd) items.push({ date: fdd, type: "deadline", title: `${school(a.school).short} final decisions${r.finalDecisionApprox ? " (approx.)" : ""}`, sub: r.round });
    });
    items.sort((a, b) => a.date - b.date);
    if (!items.length) return `<div class="muted" style="padding:12px 16px">No published dates for these schools.</div>`;
    return items.map(i => `
      <div class="agenda-item ${i.type} ${daysFrom(i.date) < 0 ? "past" : ""}">
        <div class="agenda-date"><b>${i.date.getDate()}</b><span>${MONTHS[i.date.getMonth()]}</span></div>
        <div class="agenda-text"><b>${esc(i.title)}</b><span class="small">${esc(i.sub)}${i.sub ? " · " : ""}${relative(i.date)}</span></div>
      </div>`).join("");
  }

  /* ---------- rendering: deadlines ---------- */
  function renderDeadlines() {
    const usedSchools = new Set(candidates.flatMap(c => c.applications.map(a => a.school)));
    const blocks = DEADLINES.slice().sort((a, b) => (usedSchools.has(b.school) - usedSchools.has(a.school)) || a.school.localeCompare(b.school));
    const cell = (v, approx) => {
      const d = parseDate(v);
      if (!d) return `<span class="muted">Not published</span>`;
      const n = daysFrom(d);
      return `<span class="pill-date">${fmt(d)}${approx ? `<span class="approx">approx.</span>` : ""}${n >= 0 && n <= 14 ? `<span class="soon">${relative(d)}</span>` : ""}</span>`;
    };
    return `
      <div class="page-head">
        <div><h1>Published deadlines</h1><p>Application, interview-decision and final-decision dates per school and intake, as published by the schools (collected 7 Sep 2026). “approx.” means the school publishes a rule rather than a date. The highlighted row is the round the candidates are currently in.</p></div>
      </div>
      ${blocks.map(b => {
        const nr = nextRound(b);
        const who = candidates.filter(c => c.applications.some(a => a.school === b.school) && intakeForDeadlines(c, b.school) === b);
        return `
        <div class="panel dl-school">
          <div class="panel-head">
            <img class="app-logo" src="${esc(school(b.school).logo)}" alt="">
            <div><h2>${esc(school(b.school).name)}</h2><div class="small muted">${esc(b.intake)} intake · <a href="${esc(school(b.school).url)}" target="_blank" rel="noopener" style="color:var(--accent-ink)">school website ↗</a></div></div>
          </div>
          <div class="table-wrap"><table>
            <thead><tr><th>Round</th><th>Application deadline</th><th>Interview decision</th><th>Final decision</th></tr></thead>
            <tbody>${b.rounds.map(r => {
              const fin = parseDate(r.finalDecision) || parseDate(r.application);
              const past = fin && daysFrom(fin) < 0 && r !== nr;
              return `<tr class="${r === nr ? "current-round" : ""} ${past ? "past" : ""}"><td>${esc(r.round)}</td><td class="num">${cell(r.application)}</td><td class="num">${cell(r.interviewDecision, r.interviewDecisionApprox)}</td><td class="num">${cell(r.finalDecision, r.finalDecisionApprox)}</td></tr>`;
            }).join("")}</tbody>
          </table></div>
          ${who.length ? `<div class="dl-who">Candidates: ${who.map(c => `<a href="#/candidate/${esc(c.id)}">${esc(c.name)}</a>`).join("")}</div>` : ""}
          ${b.note ? `<div class="dl-note">${esc(b.note)}</div>` : ""}
        </div>`;
      }).join("")}`;
  }

  /* ---------- editing ---------- */
  function openEditor(id) {
    const isNew = !id;
    const c = isNew ? { id: "", name: "", programme: "Jahizoun", team: "", photo: "", intake: "January 2027", notes: "", applications: [] } : deepClone(candidates.find(x => x.id === id));
    const bg = document.createElement("div");
    bg.className = "modal-bg";
    const statusOpts = sel => Object.keys(STATUSES).map(k => `<option value="${k}" ${sel === k ? "selected" : ""}>${esc(STATUSES[k].label)}</option>`).join("");
    const schoolOpts = sel => Object.keys(SCHOOLS).map(k => `<option value="${k}" ${sel === k ? "selected" : ""}>${esc(SCHOOLS[k].name)}</option>`).join("");
    const appRow = (a, i) => `
      <div class="app-edit" data-i="${i}">
        <div class="app-edit-head"><strong>School ${i + 1}</strong><button type="button" class="btn small danger" data-remove="${i}">Remove</button></div>
        <div class="form-grid">
          <div class="field"><label>School</label><select name="school">${schoolOpts(a.school)}</select></div>
          <div class="field"><label>Status</label><select name="status">${statusOpts(a.status)}</select></div>
          <div class="field"><label>Interview date(s) — YYYY-MM-DD, comma-separated; empty = pending</label><input name="idate" value="${esc(a.interview && a.interview.date)}" placeholder="e.g. 2026-09-15"></div>
          <div class="field"><label>Interview note</label><input name="inote" value="${esc(a.interview && a.interview.note)}"></div>
          <div class="field wide"><label>Notes</label><input name="notes" value="${esc(a.notes)}"></div>
        </div>
      </div>`;
    const render = () => {
      bg.innerHTML = `
        <form class="modal" id="editForm">
          <div class="modal-head"><h2>${isNew ? "Add candidate" : "Edit " + esc(c.name)}</h2><button type="button" class="btn ghost" data-close>✕</button></div>
          <div class="modal-body">
            <div class="photo-edit">
              ${avatar(c, true)}
              <div class="field"><label>Photo</label>
                <input type="file" accept="image/*" name="photoFile">
                <input name="photo" value="${esc(c.photo)}" placeholder="photos/firstname-lastname.jpg">
                <span class="hint">Either pick a file (it is embedded, resized to 320px) or type a path to a file you added to the <code>photos</code> folder.</span>
              </div>
            </div>
            <div class="form-grid">
              <div class="field"><label>Full name</label><input name="name" value="${esc(c.name)}" required></div>
              <div class="field"><label>Programme</label><select name="programme"><option ${c.programme === "Jahizoun" ? "selected" : ""}>Jahizoun</option><option ${c.programme === "EDGE" ? "selected" : ""}>EDGE</option></select></div>
              <div class="field"><label>EO team (Jahizoun only)</label><input name="team" value="${esc(c.team)}" list="teamList"><datalist id="teamList">${teams().map(t => `<option value="${esc(t)}">`).join("")}</datalist></div>
              <div class="field"><label>Target intake</label><input name="intake" value="${esc(c.intake)}" list="intakeList"><datalist id="intakeList"><option value="January 2027"><option value="September 2027"><option value="January 2028"></datalist></div>
              <div class="field wide"><label>General notes</label><textarea name="notes">${esc(c.notes)}</textarea></div>
            </div>
            <div><div class="app-edit-head" style="margin-bottom:8px"><h3>Schools</h3><button type="button" class="btn small" data-add-app>+ Add school</button></div>
              <div style="display:grid;gap:10px" id="appRows">${c.applications.map(appRow).join("") || `<div class="hint">No schools yet. Add one above.</div>`}</div>
            </div>
          </div>
          <div class="modal-foot"><span class="hint" style="margin-right:auto">Saved in this browser. Export data.js to publish.</span><button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">Save</button></div>
        </form>`;
    };
    const readForm = () => {
      const f = bg.querySelector("#editForm");
      c.name = f.name.value.trim(); c.programme = f.programme.value; c.team = f.team.value.trim();
      c.intake = f.intake.value.trim(); c.notes = f.notes.value.trim(); c.photo = f.photo.value.trim();
      c.applications = [...bg.querySelectorAll(".app-edit")].map(row => ({
        school: row.querySelector("[name=school]").value, status: row.querySelector("[name=status]").value,
        interview: { date: row.querySelector("[name=idate]").value.trim(), note: row.querySelector("[name=inote]").value.trim() },
        notes: row.querySelector("[name=notes]").value.trim()
      }));
    };
    render();
    document.body.appendChild(bg);
    bg.addEventListener("click", e => {
      if (e.target === bg || e.target.closest("[data-close]")) { bg.remove(); return; }
      if (e.target.closest("[data-add-app]")) { readForm(); c.applications.push({ school: "INSEAD", status: "considering", interview: { date: "", note: "" }, notes: "" }); render(); }
      const rm = e.target.closest("[data-remove]");
      if (rm) { readForm(); c.applications.splice(+rm.dataset.remove, 1); render(); }
    });
    bg.addEventListener("change", e => {
      if (e.target.name === "photoFile" && e.target.files[0]) {
        readForm();
        shrinkImage(e.target.files[0], 320).then(url => { c.photo = url; render(); });
      }
    });
    bg.addEventListener("submit", e => {
      e.preventDefault();
      readForm();
      if (!c.name) return;
      if (isNew) {
        let base = slug(c.name) || "candidate", id2 = base, n = 2;
        while (candidates.some(x => x.id === id2)) id2 = base + "-" + n++;
        c.id = id2; candidates.push(c);
      } else {
        const i = candidates.findIndex(x => x.id === c.id); candidates[i] = c;
      }
      persist(); bg.remove(); toast("Saved locally"); route();
      if (isNew) location.hash = "#/candidate/" + c.id;
    });
  }

  function shrinkImage(file, size) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => {
        const s = Math.min(img.width, img.height);
        const cv = document.createElement("canvas"); cv.width = size; cv.height = size;
        cv.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        res(cv.toDataURL("image/jpeg", 0.85));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  function exportData() {
    // Rebuild data.js from the original source text, replacing only the CANDIDATES block.
    fetch("js/data.js").then(r => r.text()).then(src => {
      const start = src.indexOf("const CANDIDATES = [");
      const end = src.indexOf("/* Do not edit below this line. */");
      const body = "const CANDIDATES = " + JSON.stringify(candidates, null, 2) + ";\n\n";
      const out = start >= 0 && end > start ? src.slice(0, start) + body + src.slice(end) : "const CANDIDATES = " + JSON.stringify(candidates, null, 2) + ";";
      const blob = new Blob([out], { type: "text/javascript" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "data.js"; a.click();
      toast("data.js downloaded. Replace js/data.js in the repository and commit.");
    }).catch(() => {
      // file:// fallback: copy to clipboard
      const out = "const CANDIDATES = " + JSON.stringify(candidates, null, 2) + ";";
      navigator.clipboard && navigator.clipboard.writeText(out);
      toast("Copied the CANDIDATES block to the clipboard. Paste it into js/data.js.");
    });
  }

  let toastTimer;
  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 3500);
  }

  /* ---------- routing & events ---------- */
  const app = document.getElementById("app");
  function route() {
    const h = location.hash || "#/";
    let view = "home", html;
    const m = h.match(/^#\/candidate\/([^/]+)/);
    if (m) { view = "profile"; html = renderProfile(decodeURIComponent(m[1])); }
    else if (h.startsWith("#/deadlines")) { view = "deadlines"; html = renderDeadlines(); }
    else html = renderHome();
    app.innerHTML = html;
    document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("active", a.dataset.route === (view === "profile" ? "home" : view)));
    if (view !== "profile") window.scrollTo(0, 0);
    if (view === "home") bindHome();
  }
  function bindHome() {
    const q = document.getElementById("q");
    q.addEventListener("input", () => { filters.q = q.value; refreshHomeList(); });
    document.getElementById("progSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { filters.programme = b.dataset.p; route(); } });
    document.getElementById("schoolSel").addEventListener("change", e => { filters.school = e.target.value; route(); });
    document.getElementById("teamSel").addEventListener("change", e => { filters.team = e.target.value; route(); });
    document.getElementById("sortSel").addEventListener("change", e => { filters.sort = e.target.value; route(); });
    document.querySelectorAll(".tile").forEach(t => t.addEventListener("click", () => { filters.stage = filters.stage === t.dataset.stage ? "all" : t.dataset.stage; route(); }));
  }
  function refreshHomeList() {
    const list = filtered();
    const grid = document.querySelector(".grid, .empty");
    const html = list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<div class="empty">No candidates match these filters.</div>`;
    if (grid) grid.outerHTML = html;
    const count = document.querySelector(".filters .count"); if (count) count.textContent = `${list.length} of ${candidates.length}`;
  }

  document.getElementById("editToggle").addEventListener("click", () => {
    editMode = !editMode;
    document.getElementById("editBanner").classList.toggle("hidden", !editMode);
    document.getElementById("editToggle").textContent = editMode ? "Exit edit mode" : "Edit mode";
    document.getElementById("editToggle").classList.toggle("primary", editMode);
    route();
  });
  document.getElementById("addBtn").addEventListener("click", () => openEditor(null));
  document.getElementById("exportBtn").addEventListener("click", exportData);
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!hasLocalChanges()) { toast("No local changes to discard."); return; }
    if (confirm("Discard all changes saved in this browser and reload the data from data.js?")) {
      localStorage.removeItem(STORAGE_KEY); candidates = deepClone(BASE.CANDIDATES); route(); toast("Local changes discarded.");
    }
  });
  app.addEventListener("click", e => {
    const ed = e.target.closest("[data-edit]"); if (ed) { openEditor(ed.dataset.edit); return; }
    const del = e.target.closest("[data-del]");
    if (del) {
      const c = candidates.find(x => x.id === del.dataset.del);
      if (c && confirm(`Delete ${c.name} from the tracker?`)) { candidates = candidates.filter(x => x.id !== c.id); persist(); location.hash = "#/"; }
    }
  });

  // theme toggle (light / dark / system)
  const themeBtn = document.getElementById("themeBtn");
  const savedTheme = (() => { try { return localStorage.getItem(STORAGE_KEY + ":theme"); } catch (e) { return null; } })();
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme;
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = cur ? (cur === "dark" ? "light" : "dark") : (sysDark ? "light" : "dark");
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(STORAGE_KEY + ":theme", next); } catch (e) { /* ignore */ }
  });

  window.addEventListener("hashchange", route);
  route();
  if (hasLocalChanges()) toast("Showing changes saved in this browser. Export data.js to publish them.");
})();
