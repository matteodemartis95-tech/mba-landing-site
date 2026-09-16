/* Jahizoun MBA Tracker — application logic (no build step, no dependencies). */
(function () {
  "use strict";

  const BASE = window.MBA_DATA;
  const EV = window.MBA_EVAL || { EVAL_META: { competencies: [], quarters: [], ratings: {}, phases: [] }, EXTRA_CANDIDATES: [], NAME_OVERRIDES: {}, EVALUATIONS: {} };
  const META = EV.EVAL_META;
  const EVAL_KEY = "jahizoun-mba-tracker:v2-eval";
  const nameOf = c => EV.NAME_OVERRIDES[c.id] || c.name;
  const TLD = window.TLD_DATA || { COURSES: [] };
  const TLD_KEY = "jahizoun-mba-tracker:v3-tld";
  const TLD_HASH = hashString(JSON.stringify(TLD.COURSES));
  let courses = loadCourses();
  function loadCourses() {
    try {
      const raw = localStorage.getItem(TLD_KEY);
      if (raw) {
        if (localStorage.getItem(TLD_KEY + ":base") === TLD_HASH) return JSON.parse(raw);
        localStorage.removeItem(TLD_KEY); localStorage.removeItem(TLD_KEY + ":base");
      }
    } catch (e) { /* ignore */ }
    return deepClone(TLD.COURSES);
  }
  function persistCourses() {
    try { localStorage.setItem(TLD_KEY, JSON.stringify(courses)); localStorage.setItem(TLD_KEY + ":base", TLD_HASH); } catch (e) { toast("Could not save locally: " + e.message); }
  }
  function hasLocalCourses() { try { return !!localStorage.getItem(TLD_KEY); } catch (e) { return false; } }
  const evalOf = c => evalState.evaluations[c.id] || null;
  const ASSET_BASE = window.ASSET_BASE || "";   // "" for the main page, "../" for the V2 preview in /v2
  const asset = p => (p && !/^(data:|https?:)/.test(p) ? ASSET_BASE + p : p);
  const STORAGE_KEY = "jahizoun-mba-tracker:v1";
  const STATUSES = BASE.STATUSES;
  const SCHOOLS = BASE.SCHOOLS;
  const DEADLINES = BASE.DEADLINES;
  const STAGE_LABELS = ["Applying", "Submitted", "Interview", "Interviewed", "Decision"];
  const FINAL_STAGE = STAGE_LABELS.length - 1;

  /* ---------- state ---------- */
  // Fingerprint of the published data.js. Local edits are only kept while the published data
  // is unchanged; once a new data.js is published (normally: your own edits, committed on GitHub),
  // the dashboard switches back to the published version automatically.
  const BASE_HASH = hashString(JSON.stringify(BASE.CANDIDATES));
  let staleLocalDiscarded = false;
  function hashString(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return String(h >>> 0);
  }
  let shared = load();                 // MBA data from the shared ../js/data.js (plus local edits)
  let evalState = loadEval();          // V2-only: extra candidates + evaluations (plus local edits)
  let candidates = merge();
  let editMode = false;
  function merge() { return shared.concat(evalState.extras); }
  function isExtra(id) { return evalState.extras.some(x => x.id === id); }
  let filters = { q: "", programme: "all", school: "all", stage: "all", team: "all" };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        if (localStorage.getItem(STORAGE_KEY + ":base") === BASE_HASH) return JSON.parse(raw);
        localStorage.setItem(STORAGE_KEY + ":backup", raw);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY + ":base");
        staleLocalDiscarded = true;
      }
    } catch (e) { /* ignore */ }
    return deepClone(BASE.CANDIDATES);
  }
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shared));
      localStorage.setItem(STORAGE_KEY + ":base", BASE_HASH);
    } catch (e) { toast("Could not save locally: " + e.message); }
  }
  const EVAL_HASH = hashString(JSON.stringify([EV.EXTRA_CANDIDATES, EV.EVALUATIONS]));
  function loadEval() {
    try {
      const raw = localStorage.getItem(EVAL_KEY);
      if (raw) {
        if (localStorage.getItem(EVAL_KEY + ":base") === EVAL_HASH) return JSON.parse(raw);
        localStorage.removeItem(EVAL_KEY); localStorage.removeItem(EVAL_KEY + ":base");
      localStorage.removeItem(TLD_KEY); localStorage.removeItem(TLD_KEY + ":base"); courses = deepClone(TLD.COURSES);
      }
    } catch (e) { /* ignore */ }
    return { extras: deepClone(EV.EXTRA_CANDIDATES), evaluations: deepClone(EV.EVALUATIONS) };
  }
  function persistEval() {
    try {
      localStorage.setItem(EVAL_KEY, JSON.stringify(evalState));
      localStorage.setItem(EVAL_KEY + ":base", EVAL_HASH);
    } catch (e) { toast("Could not save locally: " + e.message); }
  }
  function hasLocalEval() { try { return !!localStorage.getItem(EVAL_KEY); } catch (e) { return false; } }
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
  // effective status: a scheduled interview whose dates have all passed counts as "interviewed" without editing the data
  function eff(a) {
    if (a.status !== "scheduled") return a.status;
    const ds = parseDates(a.interview && a.interview.date);
    return ds.length && ds.every(d => daysFrom(d) < 0) ? "interviewed" : "scheduled";
  }
  function pendingInterviews(c) { return c.applications.filter(a => eff(a) === "scheduled" && !parseDates(a.interview && a.interview.date).length); }
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
    const inner = c.photo ? `<img src="${esc(asset(c.photo))}" alt="${esc(nameOf(c))}" onerror="this.parentNode.classList.add('placeholder');this.outerHTML='<span class=initials>${esc(initials(nameOf(c)))}</span>'">`
                          : `<span class="initials" title="Photo to be added">${esc(initials(nameOf(c)))}</span>`;
    return `<div class="${cls}">${inner}</div>`;
  }
  function testBadge(c) {
    if (!c.test) return "";
    const m = String(c.test).match(/(GMAT|EA)\D*(\d{3})/i);
    let cls = "";
    if (m) { const kind = m[1].toUpperCase(), n = +m[2]; cls = (kind === "GMAT" ? n >= 600 : n >= 150) ? "score-good" : "score-low"; }
    return `<span class="badge test ${cls}">${esc(c.test)}</span>`;
  }
  function noMba(c) { return !c.applications.length && c.mbaPlanned === false; }
  function programmeBadge(c) { return `<span class="badge ${c.programme === "EDGE" ? "edge" : "jahizoun"}">${esc(c.programme)}</span>`; }
  function teamBadge(c) { return c.programme === "Jahizoun" && c.team ? `<span class="badge team">${esc(c.team)}</span>` : ""; }
  function statusPill(a) { const s = status(eff(a)); return `<span class="status ${s.tone}"><span class="st ${s.tone}"></span>${esc(s.label)}</span>`; }

  /* ---------- rendering: home ---------- */
  function renderHome() {
    const total = candidates.length;
    const scheduledApps = candidates.reduce((n, c) => n + c.applications.filter(a => eff(a) === "scheduled").length, 0);
    const withDate = candidates.reduce((n, c) => n + c.applications.filter(a => eff(a) === "scheduled" && parseDates(a.interview && a.interview.date).length).length, 0);
    const submitted = candidates.reduce((n, c) => n + c.applications.filter(a => status(a.status).stage >= 1).length, 0);
    const admitted = candidates.reduce((n, c) => n + c.applications.filter(a => a.status === "admitted").length, 0);

    const tile = (key, label, value, sub, dot) =>
      `<button class="tile ${filters.stage === key ? "active" : ""}" data-stage="${key}"><div class="label"><span class="dot ${dot}"></span>${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></button>`;
    const QE = META.quarterlyEvaluations || [];
    const doneQE = QE.filter(q => q.status === "completed"); const lastQE = doneQE[doneQE.length - 1];
    const nextQE = QE.find(q => q.status !== "completed" && parseDate(q.date) && daysFrom(parseDate(q.date)) >= 0);
    const qeTile = `<div class="tile static"><div class="label"><span class="dot violet"></span>Quarterly evaluation</div><div class="value">${lastQE ? esc(lastQE.label) + " <span class=\"value-sub\">completed</span>" : "—"}</div><div class="sub">${nextQE ? `Next: ${esc(nextQE.label)} evaluation by ${fmt(parseDate(nextQE.date))}` : "No further evaluation planned"}</div></div>`;

    const list = filtered();
    const teamOpts = teams().map(t => `<option value="${esc(t)}" ${filters.team === t ? "selected" : ""}>${esc(t)}</option>`).join("");
    const schoolOpts = Object.keys(SCHOOLS).map(k => `<option value="${k}" ${filters.school === k ? "selected" : ""}>${esc(SCHOOLS[k].short)}</option>`).join("");

    return `
      <div class="page-head">
        <div><h1>Candidates</h1><p>Quarterly evaluations and MBA applications of the Jahizoun and EDGE candidates. Click a card to open a profile.</p></div>
        <div class="muted small">Updated ${fmt(today, true)}</div>
      </div>
      <div class="tiles">
        ${tile("all", "Candidates", total, `${candidates.filter(c => c.programme === "Jahizoun").length} Jahizoun · ${candidates.filter(c => c.programme === "EDGE").length} EDGE`, "accent")}
        ${tile("submitted", "Applications submitted", submitted, "across all schools", "accent")}
        ${tile("scheduled", "Interviews scheduled", scheduledApps, `${withDate} with a confirmed date`, "warning")}
        ${tile("admitted", "Admitted", admitted, "offers received", "good")}
        ${qeTile}
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
            <span class="count">${list.length} of ${total}</span>
          </div>
          ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<div class="empty">No candidates match these filters.</div>`}
        </div>
        <aside>${agenda()}</aside>
      </div>`;
  }

  function filtered() {
    let list = candidates.filter(c => {
      if (filters.q && !nameOf(c).toLowerCase().includes(filters.q.toLowerCase())) return false;
      if (filters.programme !== "all" && c.programme !== filters.programme) return false;
      if (filters.school !== "all" && !c.applications.some(a => a.school === filters.school)) return false;
      if (filters.team !== "all" && c.team !== filters.team) return false;
      if (filters.stage === "scheduled" && !c.applications.some(a => eff(a) === "scheduled")) return false;
      if (filters.stage === "submitted" && !c.applications.some(a => status(a.status).stage >= 1)) return false;
      if (filters.stage === "admitted" && !c.applications.some(a => a.status === "admitted")) return false;
      return true;
    });
    list.sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
    return list;
  }

  function card(c) {
    const ni = nextInterview(c);
    const pend = pendingInterviews(c);
    let footK = "Interview", footV;
    if (ni) { footK = "Next interview"; footV = `<strong class="${daysFrom(ni.date) <= 7 ? "soon" : ""}">${fmt(ni.date, true)}</strong> · ${esc(school(ni.school).short)}`; }
    else if (pend.length) footV = `<strong class="pending">Date pending</strong> · ${pend.map(a => esc(school(a.school).short)).join(", ")}`;
    else footV = `<span class="muted">None scheduled yet</span>`;
    return `
      <a class="card ${c.programme === "EDGE" ? "edge" : "jahizoun"}" href="#/candidate/${esc(c.id)}">
        <div class="card-top">
          ${avatar(c)}
          <div>
            <div class="card-name">${esc(nameOf(c))}</div>
            <div class="card-meta">${programmeBadge(c)}${teamBadge(c)}${testBadge(c)}${c.intake && c.intake !== "January 2027" ? `<span class="badge intake">${esc(c.intake)}</span>` : ""}${noMba(c) ? `<span class="badge nomba">No MBA planned</span>` : ""}</div>
          </div>
        </div>
        <div class="card-schools">
          ${c.applications.map(a => `<span class="school-chip" title="${esc(school(a.school).name)}: ${esc(status(eff(a)).label)}"><img class="logo" src="${esc(asset(school(a.school).logo))}" alt=""><span>${esc(school(a.school).short)}</span><span class="st ${status(eff(a)).tone}"></span></span>`).join("") || (noMba(c) ? "" : `<span class="muted small">No schools yet</span>`)}
        </div>
        <div class="card-foot"><div><div class="foot-k">${footK}</div><div class="foot-v">${footV}</div></div>${noMba(c) ? "" : `<span class="muted">${c.applications.length} school${c.applications.length === 1 ? "" : "s"}</span>`}</div>
      </a>`;
  }

  function agenda() {
    const items = [];
    candidates.forEach(c => c.applications.forEach(a => {
      parseDates(a.interview && a.interview.date).forEach(d => {
        if (daysFrom(d) >= -3) items.push({ date: d, type: "interview", title: `${nameOf(c)}`, sub: `${school(a.school).short} interview`, href: `#/candidate/${c.id}` });
      });
    }));
    const usedSchools = new Set(candidates.flatMap(c => c.applications.map(a => a.school)));
    DEADLINES.forEach(b => {
      if (!usedSchools.has(b.school)) return;
      b.rounds.forEach(r => {
        [["interviewDecision", "Interview decisions", r.interviewDecisionApprox], ["finalDecision", "Final decisions", r.finalDecisionApprox], ["application", "Application deadline", false]].forEach(([k, label, approx]) => {
          const d = parseDate(r[k]);
          if (d && daysFrom(d) >= -3 && daysFrom(d) <= 120) items.push({ date: d, type: "deadline", title: `${school(b.school).short} · ${label}${approx ? " (approx.)" : ""}`, sub: `${r.round}, ${b.intake} intake${k === "interviewDecision" && r.interviewDecisionLabel ? " · " + r.interviewDecisionLabel : ""}`, href: "#/deadlines" });
        });
      });
    });
    (META.quarterlyEvaluations || []).forEach(q => {
      const d = parseDate(q.date);
      if (d && q.status !== "completed" && daysFrom(d) >= -3 && daysFrom(d) <= 120) items.push({ date: d, type: "evaluation", title: `${q.label} quarterly evaluation`, sub: "all candidates on EO secondment", href: "#/jahizoun" });
    });
    items.sort((a, b) => a.date - b.date);
    const shown = items.slice(0, 16);
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

  /* ---------- rendering: T&LD ---------- */
  function nextCohort(k) {
    const cs = (k.cohorts || []).filter(c => parseDate(c.start)).sort((a, b) => parseDate(a.start) - parseDate(b.start));
    return cs.find(c => c.status === "running") || cs.find(c => c.status !== "completed" && daysFrom(parseDate(c.start)) >= 0) || null;
  }
  const PALETTE = ["#2a78d6", "#eb6834", "#1baf7a", "#4a3aa7", "#e87ba4", "#eda100", "#008300", "#e34948"];
  function courseColor(k) { const i = courses.indexOf(k); return k.color || PALETTE[(i < 0 ? 0 : i) % PALETTE.length]; }
  function courseStyle(k) { return `--c: ${courseColor(k)}; --c-soft: color-mix(in srgb, ${courseColor(k)} 14%, var(--surface));`; }
  function fmtNum(n) { return (n == null || n === "") ? "—" : Number(n).toLocaleString("en-GB"); }
  function courseCard(k) {
    const hasTarget = k.target != null && k.target !== "";
    const pct = hasTarget && k.target > 0 ? Math.min(100, Math.round(100 * (k.trained || 0) / k.target)) : null;
    const nc = nextCohort(k);
    const nd = nc ? parseDate(nc.start) : parseDate(k.nextDate);
    const ndLabel = nc ? `${nc.label}${nc.participants ? " · " + fmtNum(nc.participants) + " participants" : ""}` : (k.nextLabel || k.status || "next milestone");
    if ((k.subProgrammes || []).length) return `
      <a class="card course" href="#/course/${esc(k.id)}" style="${courseStyle(k)}">
        <div class="course-head">
          <div><div class="card-name">${esc(k.name)}</div>${k.fullName ? `<div class="small muted">${esc(k.fullName)}</div>` : ""}</div>
        </div>
        <div class="subs">
          ${k.subProgrammes.map(sp => { const ht = sp.target != null && sp.target !== ""; const p = ht && sp.target > 0 ? Math.min(100, Math.round(100 * (sp.trained || 0) / sp.target)) : null; return `
            <div class="sub">
              <div class="sub-head"><span class="sub-name">${esc(sp.name)}</span><span class="sub-num"><b>${fmtNum(sp.trained)}</b>${ht ? " / " + fmtNum(sp.target) : ""}</span></div>
              <div class="small muted">${esc(sp.unit || "participants")}${sp.completed != null ? ` · <b>${fmtNum(sp.completed)}</b> completed` : ""}${sp.format ? " · " + esc(sp.format) : ""}</div>
              ${p != null ? `<div class="meter"><div class="fill" style="width:${p}%"></div></div>` : ""}
            </div>`; }).join("")}
        </div>
        <div class="course-foot"><span class="muted">${k.subProgrammes.length} programmes · ${fmtNum(k.trained)} ${esc(k.unit || "participants")}</span></div>
      </a>`;
    return `
      <a class="card course" href="#/course/${esc(k.id)}" style="${courseStyle(k)}">
        <div class="course-head">
          <div><div class="card-name">${esc(k.name)}</div>${k.fullName ? `<div class="small muted">${esc(k.fullName)}</div>` : ""}</div>
        </div>
        <div class="course-num"><span class="big">${fmtNum(k.trained)}</span><span class="of">/ ${hasTarget ? fmtNum(k.target) + (k.targetPeriod ? " " + esc(k.targetPeriod) : "") : "<span class=tbc>target TBC</span>"}</span></div>
        <div class="small muted">${esc(k.unit || "people trained")}</div>
        <div class="meter"><div class="fill" style="width:${pct == null ? 0 : pct}%"></div></div>
        <div class="course-foot">
          ${pct != null ? `<span><strong>${pct}%</strong> of target</span>` : `<span class="muted">Progress shown once the target is set</span>`}
          ${nd ? `<span class="next ${daysFrom(nd) <= 7 ? "soon" : ""}"><strong>${fmt(nd)}</strong> · ${esc(ndLabel)}</span>` : (k.status ? `<span>${esc(k.status)}</span>` : "")}
        </div>
      </a>`;
  }
  function courseSections() {
    const cats = [...new Set(courses.map(k => k.category || ""))];
    if (cats.length <= 1) return `<div class="grid courses">${courses.map(courseCard).join("")}</div>`;
    return cats.map(cat => `
      <div class="cat-head"><h2>${esc(cat || "Other programmes")}</h2><span class="muted small">${courses.filter(k => (k.category || "") === cat).length} programme${courses.filter(k => (k.category || "") === cat).length === 1 ? "" : "s"}</span></div>
      <div class="grid courses">${courses.filter(k => (k.category || "") === cat).map(courseCard).join("")}</div>`).join("");
  }
  function tldAgenda() {
    const items = [];
    courses.forEach(k => {
      const cs = (k.cohorts || []).filter(c => parseDate(c.start));
      if (cs.length) cs.forEach(c => { const d = parseDate(c.start); if (c.status !== "completed" && daysFrom(d) >= -3 && daysFrom(d) <= 120) items.push({ date: d, title: `${k.name} · ${c.label}`, sub: (parseDate(c.end) ? fmt(d) + " – " + fmt(parseDate(c.end)) : fmt(d)) + (c.participants ? " · " + fmtNum(c.participants) + " participants" : ""), href: "#/course/" + k.id, color: courseColor(k) }); });
      else { const d = parseDate(k.nextDate); if (d && daysFrom(d) >= -3) items.push({ date: d, title: k.name, sub: k.nextLabel || k.status || "Milestone", href: "#/course/" + k.id, color: courseColor(k) }); }
    });
    (META.quarterlyEvaluations || []).forEach(q => { const d = parseDate(q.date); if (d && q.status !== "completed" && daysFrom(d) >= -3 && daysFrom(d) <= 120) items.push({ date: d, title: `${q.label} quarterly evaluation`, sub: "Jahizoun / EDGE candidates", href: "#/jahizoun", type: "evaluation" }); });
    items.sort((a, b) => a.date - b.date);
    return `
      <div class="panel">
        <div class="panel-head"><h2>Coming up</h2><span class="muted small">T&amp;LD milestones</span></div>
        <div class="panel-body">
          ${items.length ? items.slice(0, 12).map(i => `
            <a class="agenda-item ${i.type || "deadline"} ${i.color ? "coloured" : ""} ${daysFrom(i.date) < 0 ? "past" : ""}" href="${i.href}" ${i.color ? `style="--c: ${i.color}; --c-soft: color-mix(in srgb, ${i.color} 14%, var(--surface));"` : ""}>
              <div class="agenda-date"><b>${i.date.getDate()}</b><span>${MONTHS[i.date.getMonth()]}</span></div>
              <div class="agenda-text"><b>${esc(i.title)}</b><span class="small">${esc(i.sub)} · ${relative(i.date)}</span></div>
            </a>`).join("") : `<div class="muted" style="padding:16px">Nothing scheduled.</div>`}
        </div>
      </div>`;
  }
  function renderTld() {
    const totalTrained = courses.reduce((n, k) => n + (Number(k.trained) || 0), 0);
    const withTarget = courses.filter(k => k.target != null && k.target !== "");
    const jahizoun = candidates.filter(c => c.programme === "Jahizoun").length, edge = candidates.filter(c => c.programme === "EDGE").length;
    const tile = (label, value, sub, dot, href) => `<a class="tile ${href ? "" : "static"}" ${href ? `href="${href}"` : ""}><div class="label"><span class="dot ${dot}"></span>${label}</div><div class="value">${value}</div><div class="sub">${sub}</div></a>`;
    return `
      <div class="page-head">
        <div><h1>T&amp;LD practice</h1><p>Courses and programmes run by the Talent &amp; Leadership Development practice. Click a box to open its PMO page.</p></div>
        <div class="muted small">Updated ${fmt(today, true)}</div>
      </div>
      <div class="tiles">
        ${tile("Programmes", courses.length, `${withTarget.length} with a confirmed target`, "accent")}
        ${tile("People trained", fmtNum(totalTrained), "across all programmes", "good")}
        ${tile("Jahizoun / EDGE", jahizoun + edge, `${jahizoun} Jahizoun · ${edge} EDGE`, "violet", "#/jahizoun")}
      </div>
      <div class="overview">
        <div>${courses.length ? courseSections() : `<div class="empty">No courses yet.</div>`}</div>
        <aside>${tldAgenda()}</aside>
      </div>`;
  }
  function renderCourse(id) {
    const k = courses.find(x => x.id === id) || (id === "mbzuai-ai-for-all" ? courses.find(x => x.id === "mbzuai") : null);
    if (!k) return `<a class="back" href="#/">← T&amp;LD</a><div class="empty">Course not found.</div>`;
    const hasTarget = k.target != null && k.target !== "";
    const pct = hasTarget && k.target > 0 ? Math.min(100, Math.round(100 * (k.trained || 0) / k.target)) : null;
    const cohorts = (k.cohorts || []).slice().sort((a, b) => (parseDate(a.start) || 0) - (parseDate(b.start) || 0));
    const next = nextCohort(k);
    const nd = next ? parseDate(next.start) : parseDate(k.nextDate);
    const hasDesc = k.description || k.audience || (k.objectives || []).length || (k.modules || []).length;
    const cohortRow = c => { const sd = parseDate(c.start), ed = parseDate(c.end); return `
      <div class="agenda-item deadline ${c.status === "completed" ? "past" : ""}">
        <div class="agenda-date">${sd ? `<b>${sd.getDate()}</b><span>${MONTHS[sd.getMonth()]}</span>` : `<b>—</b><span>TBC</span>`}</div>
        <div class="agenda-text"><b>${esc(c.label)}</b>${c.participants ? ` · ${fmtNum(c.participants)} participants` : ""}<span class="small">${sd ? fmt(sd) : "Date TBC"}${ed ? " – " + fmt(ed) : ""} · ${esc(c.status || "planned")}${c.note ? " · " + esc(c.note) : ""}</span></div>
      </div>`; };
    return `
      <a class="back" href="#/">← T&amp;LD</a>
      <div class="panel profile-head course-page" style="${courseStyle(k)}">
        <div class="course-icon">${esc((k.name.split(/\s+/).length > 1 ? k.name.split(/\s+/).map(w => w[0]).join("") : k.name).slice(0, 3).toUpperCase())}</div>
        <div>
          <h1>${esc(k.name)}</h1>
          <div class="meta">${k.fullName ? `<span class="badge intake">${esc(k.fullName)}</span>` : ""}${k.programmeFormat ? `<span class="badge intake">${esc(k.programmeFormat)}</span>` : ""}</div>
          ${k.notes ? `<div class="notes">${esc(k.notes)}</div>` : ""}
        </div>
        <div class="actions">${(k.docs || []).filter(d => d.url).map(d => `<a class="btn doc-link" href="${esc(d.url)}" target="_blank" rel="noopener">📄 ${esc(d.label || "Document")}</a>`).join("")}${editMode ? `<button class="btn" data-edit-course="${esc(k.id)}">Edit course</button><button class="btn danger" data-del-course="${esc(k.id)}">Delete</button>` : ""}</div>
        <div class="snapshot">
          <div class="snap"><div class="k">${esc(k.unit || "People trained")}</div><div class="v">${fmtNum(k.trained)}</div></div>
          ${(k.subProgrammes || []).length ? `<div class="snap"><div class="k">Programmes</div><div class="v">${k.subProgrammes.length}</div></div>` : `<div class="snap"><div class="k">Target${k.targetPeriod ? " " + esc(k.targetPeriod) : ""}</div><div class="v ${hasTarget ? "" : "muted"}">${hasTarget ? fmtNum(k.target) : "TBC"}</div></div>`}
          ${(k.subProgrammes || []).length || (!nd && (k.steps || []).length) ? "" : `<div class="snap"><div class="k">${next && next.status === "running" ? "Current session" : "Next session"}</div><div class="v ${nd ? "" : "muted"}">${next ? `${fmt(nd, true)} · ${esc(next.label)}${next.participants ? " · " + fmtNum(next.participants) + " participants" : ""}` : (nd ? fmt(nd, true) + (k.nextLabel ? " · " + esc(k.nextLabel) : "") : "Not scheduled")}</div></div>`}
          ${k.status ? `<div class="snap"><div class="k">Status</div><div class="v">${esc(k.status)}</div></div>` : ""}
          ${k.cohortsTotal ? `<div class="snap"><div class="k">Cohorts delivered</div><div class="v">${fmtNum(k.cohortsDone || 0)} of ${fmtNum(k.cohortsTotal)}</div></div>` : ""}
          ${(k.kpis || []).map(x => `<div class="snap"><div class="k">${esc(x.label)}</div><div class="v">${esc(x.value)}</div></div>`).join("")}
        </div>
      </div>
      ${(k.subProgrammes || []).length ? (k.description ? `<p class="partner-intro">${esc(k.description)}</p>` : "") + subProgrammePanels(k) : ""}
      ${pmoSections(k)}
      ${cohortTimeline(k, cohorts)}
      ${(k.subProgrammes || []).length ? "" : `<div class="profile-grid">
        <div>
          ${hasDesc ? `
          <div class="panel">
            <div class="panel-head"><h2>About the programme</h2></div>
            <div class="about">
              ${k.description ? `<p>${esc(k.description)}</p>` : ""}
              ${k.audience ? `<div class="about-row"><div class="k">Target audience</div><div>${esc(k.audience)}</div></div>` : ""}
              ${(k.objectives || []).length ? `<div class="about-row"><div class="k">Objectives</div><ul class="comm-list ic-plus">${k.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul></div>` : ""}
            </div>
          </div>` : ""}
          ${(k.modules || []).length ? `
          <div class="panel" style="margin-top:16px">
            <div class="panel-head"><h2>Curriculum</h2><span class="small muted">${esc(k.programmeFormat || (k.modules.length + " modules"))}</span></div>
            <div class="modules">
              ${k.modules.map((m, i) => `<div class="module"><div class="module-n">${i + 1}</div><div><div class="module-t">${esc(m.title)}</div>${m.summary ? `<div class="module-s">${esc(m.summary)}</div>` : ""}</div></div>`).join("")}
            </div>
          </div>` : ""}
          ${!hasDesc && !(k.modules || []).length ? `<div class="empty">Programme description still to be added.</div>` : ""}
        </div>
        <div class="side">
          ${!cohorts.length && (k.steps || []).length ? "" : `<div class="panel">
            <div class="panel-head"><h2>Cohorts</h2><span class="small muted">${cohorts.length ? cohorts.length + " planned" : ""}</span></div>
            <div class="panel-body">${cohorts.length ? cohorts.map(cohortRow).join("") : `<div class="muted" style="padding:12px 16px">No cohorts scheduled yet.</div>`}</div>
          </div>`}
        </div>
      </div>`}`;
  }
  function pmoSections(k) {
    const has = (k.steps || []).length || (k.budget || []).length || (k.vendors && ((k.vendors.issued || []).length || (k.vendors.received || []).length)) || (k.ownership || []).length;
    if (!has) return "";
    const steps = k.steps || [], budget = k.budget || [], v = k.vendors || {}, own = k.ownership || [];
    return `
      <div class="pmo-grid" style="${courseStyle(k)}">
        ${budget.length ? `
        <div class="panel"><div class="panel-head"><h2>Scope &amp; budget</h2>${k.programmeFormat ? `<span class="small muted">${esc(k.programmeFormat)}</span>` : ""}</div>
          <div class="budget">${budget.map(b => `<div class="budget-row ${b.total ? "total" : ""}"><span>${esc(b.label)}</span><b>${esc(b.amount)}</b></div>`).join("")}</div>
        </div>` : ""}
        ${steps.length ? `
        <div class="panel"><div class="panel-head"><h2>Status update</h2><span class="small muted">${steps.filter(x => x.status === "done").length} of ${steps.length} steps done</span></div>
          <div class="steps">${steps.map((x, i) => `<div class="step ${esc(x.status || "pending")}"><div class="step-n">${x.status === "done" ? "✓" : i + 1}</div><div><div class="step-t">${esc(x.label)}</div>${x.note ? `<div class="step-s">${esc(x.note)}</div>` : ""}</div></div>`).join("")}</div>
        </div>` : ""}
        ${(v.issued || []).length || (v.received || []).length ? `
        <div class="panel"><div class="panel-head"><h2>Vendors</h2></div>
          <div class="vendors">
            ${(v.issued || []).length ? `<div class="vendor-row"><div class="k">RFPs issued</div><div class="chips">${v.issued.map(x => `<span class="chip">${esc(x)}</span>`).join("")}</div></div>` : ""}
            ${(v.received || []).length ? `<div class="vendor-row"><div class="k">Proposals received</div><div class="chips">${v.received.map(x => `<span class="chip on">${esc(x)}</span>`).join("")}</div></div>` : ""}
            ${(v.selected || []).length ? `<div class="vendor-row"><div class="k">Selected</div><div class="chips">${v.selected.map(x => `<span class="chip sel">✓ ${esc(x)}</span>`).join("")}</div></div>` : ""}
            ${v.note ? `<div class="vendor-note">⚠ ${esc(v.note)}</div>` : ""}
          </div>
        </div>` : ""}
        ${own.length ? `
        <div class="panel"><div class="panel-head"><h2>Ownership</h2></div>
          <div class="own">${own.map(o => `<div class="own-row"><span class="own-who">${esc(o.owner)}</span><span class="own-what">${esc(o.item)}</span></div>`).join("")}</div>
        </div>` : ""}
      </div>`;
  }
  function subProgrammePanels(k) {
    return `
      <div class="sub-grid">
        ${k.subProgrammes.map(sp => { const ht = sp.target != null && sp.target !== ""; const p = ht && sp.target > 0 ? Math.min(100, Math.round(100 * (sp.trained || 0) / sp.target)) : null;
          const ms = (sp.milestones || []).map(x => ({ ...x, d: parseDate(x.date) })).filter(x => x.d).sort((a, b) => a.d - b.d);
          return `
          <div class="panel sub-panel">
            <div class="panel-head"><div><h2>${esc(sp.name)}</h2>${sp.format ? `<div class="small muted">${esc(sp.format)}</div>` : ""}</div><span class="badge pmo">Programme</span></div>
            <div class="sub-body">
              <div class="bignums">
                <div><div class="course-num"><span class="big">${fmtNum(sp.trained)}</span><span class="of">${ht ? "/ " + fmtNum(sp.target) : ""}</span></div><div class="small muted">${esc(sp.unit || "participants")}</div></div>
                ${sp.completed != null ? `<div><div class="course-num"><span class="big">${fmtNum(sp.completed)}</span></div><div class="small muted">completed the course</div></div>` : ""}
              </div>
              ${p != null ? `<div class="meter"><div class="fill" style="width:${p}%"></div></div><div class="small muted" style="margin-top:4px">${p}% of target</div>` : ""}
              ${sp.description ? `<p class="sub-desc">${esc(sp.description)}</p>` : ""}
              ${(sp.kpis || []).length ? `<dl class="kv sub-kv">${sp.kpis.map(x => `<dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd>`).join("")}</dl>` : ""}
              ${ms.length ? `<div class="sub-ms">${ms.map(x => `<div class="agenda-item deadline ${daysFrom(x.d) < 0 ? "past" : ""}"><div class="agenda-date"><b>${x.d.getDate()}</b><span>${MONTHS[x.d.getMonth()]}</span></div><div class="agenda-text"><b>${esc(x.label)}</b><span class="small">${fmt(x.d)} · ${relative(x.d)}</span></div></div>`).join("")}</div>` : ""}
            </div>
          </div>`; }).join("")}
      </div>`;
  }
  function cohortTimeline(k, cohorts) {
    const dated = cohorts.filter(c => parseDate(c.start));
    if (!dated.length && !k.cohortsTotal) return "";
    const months = [];
    dated.forEach(c => { const d = parseDate(c.start); const key = d.getFullYear() + "-" + d.getMonth(); let m = months.find(x => x.key === key); if (!m) { m = { key, year: d.getFullYear(), month: d.getMonth(), items: [] }; months.push(m); } m.items.push(c); });
    months.sort((a, b) => a.year - b.year || a.month - b.month);
    const undated = cohorts.filter(c => !parseDate(c.start) && c.status !== "completed");
    const done = k.cohortsDone != null ? k.cohortsDone : cohorts.filter(c => c.status === "completed").length;
    const total = k.cohortsTotal || cohorts.length;
    return `
      <div class="panel timeline-panel">
        <div class="panel-head"><h2>Cohort timeline</h2><span class="small muted">${done ? `${fmtNum(done)} of ${fmtNum(total)} cohorts delivered` : `${fmtNum(total)} cohorts`}</span></div>
        ${total ? `<div class="cohort-meter"><div class="fill" style="width:${Math.min(100, Math.round(100 * done / total))}%"></div></div>` : ""}
        <div class="timeline">
          ${done ? `<div class="tl-month done"><div class="tl-head">Delivered</div><div class="tl-pill done">${fmtNum(done)} cohort${done === 1 ? "" : "s"} completed</div></div>` : ""}
          ${undated.length ? `<div class="tl-month"><div class="tl-head">Date TBC</div>${undated.map(c => `<div class="tl-pill tbc">${esc(c.label)}</div>`).join("")}</div>` : ""}
          ${months.map(m => `<div class="tl-month ${m.year === today.getFullYear() && m.month === today.getMonth() ? "now" : ""}"><div class="tl-head">${MONTHS[m.month]} ${m.year}</div>${m.items.sort((a, b) => parseDate(a.start) - parseDate(b.start)).map(c => { const sd = parseDate(c.start), ed = parseDate(c.end); const past = ed ? daysFrom(ed) < 0 : daysFrom(sd) < 0; return `<div class="tl-pill ${c.status === "completed" || past ? "past" : ""} ${daysFrom(sd) >= 0 && daysFrom(sd) <= 14 ? "soon" : ""}" title="${esc(c.note || "")}"><b>${esc(c.label)}</b><span>${sd.getDate()}${ed ? "–" + ed.getDate() : ""} ${MONTHS[sd.getMonth()]}${c.participants ? " · " + fmtNum(c.participants) : ""}</span></div>`; }).join("")}</div>`).join("")}
        </div>
      </div>`;
  }
  function openCourseEditor(id) {
    const isNew = !id;
    const k = isNew ? { id: "", name: "", fullName: "", trained: 0, target: null, targetPeriod: "", unit: "people trained", status: "", nextDate: "", nextLabel: "", description: "", audience: "", programmeFormat: "", objectives: [], modules: [], cohorts: [], cohortsDone: null, cohortsTotal: null, kpis: [], notes: "" } : deepClone(courses.find(x => x.id === id));
    const lines = (arr, f) => (arr || []).map(f).join("\n");
    const bg = document.createElement("div"); bg.className = "modal-bg";
    const field = (label, name, val, type, ph) => `<div class="field"><label>${esc(label)}</label><input name="${name}" type="${type || "text"}" value="${esc(val == null ? "" : val)}" placeholder="${esc(ph || "")}"></div>`;
    bg.innerHTML = `
      <form class="modal wide" id="courseForm">
        <div class="modal-head"><h2>${isNew ? "Add course" : "Edit " + esc(k.name)}</h2><button type="button" class="btn ghost" data-close>✕</button></div>
        <div class="modal-body">
          <div class="form-grid">
            ${field("Course name", "name", k.name)}
            ${field("Full name (optional)", "fullName", k.fullName)}
            <div class="field"><label>Colour</label><input name="color" type="color" value="${esc(k.color || courseColor(k))}"></div>
            <div class="field"><label>Category</label><input name="category" value="${esc(k.category || "")}" list="catList"><datalist id="catList">${[...new Set(courses.map(x => x.category).filter(Boolean))].map(x => `<option value="${esc(x)}">`).join("")}</datalist></div>
            ${field("Trained so far", "trained", k.trained, "number")}
            ${field("Target (leave empty if not confirmed)", "target", k.target, "number")}
            ${field("Target period", "targetPeriod", k.targetPeriod, "text", "per year")}
            ${field("What is counted", "unit", k.unit, "text", "people trained / users activated")}
            ${field("Status line", "status", k.status, "text", "e.g. First training starts 21 Sep 2026")}
            ${field("Next milestone date (YYYY-MM-DD)", "nextDate", k.nextDate, "text", "2026-09-21")}
            ${field("Next milestone label", "nextLabel", k.nextLabel)}
            ${field("Programme format", "programmeFormat", k.programmeFormat, "text", "e.g. Progressive five-day programme")}
            ${field("Cohorts delivered so far", "cohortsDone", k.cohortsDone, "number")}
            ${field("Cohorts planned in total", "cohortsTotal", k.cohortsTotal, "number")}
            <div class="field wide"><label>Extra figures (one per line: Label: value, e.g. Attendance rate: 39%)</label><textarea name="kpis" rows="2">${esc(lines(k.kpis, x => x.label + ": " + x.value))}</textarea></div>
            <div class="field wide"><label>Quick description</label><textarea name="description" rows="4">${esc(k.description || "")}</textarea></div>
            <div class="field wide"><label>Target audience</label><textarea name="audience" rows="2">${esc(k.audience || "")}</textarea></div>
            <div class="field wide"><label>Objectives (one per line)</label><textarea name="objectives" rows="4">${esc(lines(k.objectives, o => o))}</textarea></div>
            <div class="field wide"><label>Curriculum modules (one per line: Title: summary)</label><textarea name="modules" rows="5">${esc(lines(k.modules, m => m.summary ? m.title + ": " + m.summary : m.title))}</textarea></div>
            <div class="field wide"><label>Cohorts (one per line: Label | start YYYY-MM-DD | end YYYY-MM-DD | participants | status | note)</label><textarea name="cohorts" rows="3">${esc(lines(k.cohorts, c => [c.label, c.start, c.end, c.participants, c.status, c.note].map(x => x == null ? "" : x).join(" | ")))}</textarea></div>
            <div class="field wide"><label>Documents (one per line: Label | https://link)</label><textarea name="docs" rows="2">${esc(lines(k.docs, d => (d.label || "") + " | " + (d.url || "")))}</textarea></div>
            <div class="field wide"><label>Notes</label><textarea name="notes">${esc(k.notes)}</textarea></div>
          </div>
        </div>
        <div class="modal-foot"><span class="hint" style="margin-right:auto">Saved in this browser. Use “Copy tld.js” to publish.</span><button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">Save</button></div>
      </form>`;
    document.body.appendChild(bg);
    bg.addEventListener("click", e => { if (e.target === bg || e.target.closest("[data-close]")) bg.remove(); });
    bg.addEventListener("submit", e => {
      e.preventDefault();
      const f = bg.querySelector("#courseForm");
      ["name", "fullName", "unit", "status", "nextDate", "nextLabel", "notes", "targetPeriod", "programmeFormat", "description", "audience", "color", "category"].forEach(x => k[x] = f[x].value.trim());
      const ln = x => f[x].value.split("\n").map(t => t.trim()).filter(Boolean);
      k.objectives = ln("objectives");
      k.docs = ln("docs").map(t => { const p = t.split("|").map(x => x.trim()); return { label: p[0] || "Document", url: p[1] || "" }; });
      k.cohortsDone = f.cohortsDone.value === "" ? null : +f.cohortsDone.value;
      k.cohortsTotal = f.cohortsTotal.value === "" ? null : +f.cohortsTotal.value;
      k.kpis = ln("kpis").map(t => { const i = t.indexOf(":"); return i > 0 ? { label: t.slice(0, i).trim(), value: t.slice(i + 1).trim() } : { label: t, value: "" }; });
      k.modules = ln("modules").map(t => { const i = t.indexOf(":"); return i > 0 ? { title: t.slice(0, i).trim(), summary: t.slice(i + 1).trim() } : { title: t, summary: "" }; });
      k.cohorts = ln("cohorts").map(t => { const p = t.split("|").map(x => x.trim()); return { label: p[0] || "Cohort", start: p[1] || "", end: p[2] || "", participants: p[3] ? +p[3] : null, status: p[4] || "planned", note: p[5] || "" }; });
      k.trained = f.trained.value === "" ? 0 : +f.trained.value;
      k.target = f.target.value === "" ? null : +f.target.value;
      if (!k.name) return;
      if (isNew) { let base = slug(k.name) || "course", id2 = base, n = 2; while (courses.some(x => x.id === id2)) id2 = base + "-" + n++; k.id = id2; courses.push(k); }
      else { const i = courses.findIndex(x => x.id === k.id); courses[i] = k; }
      persistCourses(); bg.remove(); toast("Saved locally"); route();
      if (isNew) location.hash = "#/course/" + k.id;
    });
  }
  function buildTldJs() {
    return fetch("js/tld.js?v=" + Date.now(), { cache: "no-store" }).then(r => r.text()).then(src => {
      const start = src.indexOf("const COURSES = ["), end = src.indexOf("/* Do not edit below this line. */");
      const body = "const COURSES = " + JSON.stringify(courses, null, 2) + ";\n\n";
      return start >= 0 && end > start ? src.slice(0, start) + body + src.slice(end) : body;
    });
  }
  function copyTld() {
    buildTldJs().then(out => {
      const done = () => toast("Copied. Now open v3/js/tld.js on GitHub, click the pencil, select all, paste, and commit.");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out).then(done, () => fallbackCopy(out, done));
      else fallbackCopy(out, done);
    });
  }

  /* ---------- rendering: profile ---------- */
  function renderProfile(id, tab) {
    const c = candidates.find(x => x.id === id);
    if (!c) return `<a class="back" href="#/jahizoun">← All candidates</a><div class="empty">Candidate not found.</div>`;
    const ev = evalOf(c);
    tab = tab === "mba" ? "mba" : "evaluation";
    // always the same six fields in the same order, so every profile lines up identically (EDGE: function and education only)
    const snap = ev && c.programme === "EDGE" ? [["Function at EDGE", ev.function], ["Academic qualifications", ev.academicQualifications]] : ev ? [
      ["Line manager", ev.lineManager], ["Function at the Executive Office", ev.function || c.team], ["Academic qualifications", ev.academicQualifications],
      ["Previous MOD function", ev.previousFunction], ["Corporate Exchange company", ev.reportFirm], ["Corporate Exchange project", ev.corporateExchangeProject]
    ] : [];
    return `
      <a class="back" href="#/jahizoun">← All candidates</a>
      <div class="panel profile-head">
        ${avatar(c, true)}
        <div>
          <h1>${esc(nameOf(c))}</h1>
          <div class="meta">${programmeBadge(c)}${teamBadge(c)}${testBadge(c)}${noMba(c) ? `<span class="badge nomba">No MBA planned</span>` : `<span class="badge intake">Target intake: ${esc(c.intake || "—")}</span>`}</div>
          ${c.notes ? `<div class="notes">${esc(c.notes)}</div>` : ""}
        </div>
        <div class="actions">
          ${ev && (ev.docs || []).filter(d => d.url).map(d => `<a class="btn doc-link" href="${esc(asset(d.url))}" target="_blank" rel="noopener">📄 ${esc(d.label || "Document")}</a>`).join("") || ""}
          ${editMode ? `<button class="btn" data-edit-eval="${esc(c.id)}">Edit evaluation</button><button class="btn" data-edit="${esc(c.id)}">Edit MBA</button><button class="btn danger" data-del="${esc(c.id)}">Delete</button>` : ""}
        </div>
        ${snap.length ? `<div class="snapshot">${snap.map(([k, v]) => `<div class="snap"><div class="k">${esc(k)}</div><div class="v ${v ? "" : "muted"}">${esc(v || "—")}</div></div>`).join("")}</div>` : ""}
      </div>
      <div class="tabs">
        <a class="tab ${tab === "evaluation" ? "on" : ""}" href="#/candidate/${esc(c.id)}">Evaluation</a>
        <a class="tab ${tab === "mba" ? "on" : ""}" href="#/candidate/${esc(c.id)}/mba">MBA</a>
      </div>
      ${tab === "mba" ? renderMba(c) : renderEvaluation(c, ev)}`;
  }

  function renderMba(c) {
    const ni = nextInterview(c);
    return `
      <div class="profile-grid">
        <div class="apps">
          ${c.applications.length ? c.applications.map(a => appCard(c, a)).join("") : `<div class="empty">${noMba(c) ? "No MBA planned at the moment." : "No applications recorded yet."}</div>`}
        </div>
        <div class="side">
          <div class="panel">
            <div class="panel-head"><h2>Summary</h2></div>
            <dl class="kv">
              <dt>Schools</dt><dd>${c.applications.map(a => esc(school(a.school).short)).join(", ") || "—"}</dd>
              <dt>Next interview</dt><dd>${ni ? `${fmt(ni.date, true)} · ${esc(school(ni.school).short)}` : (pendingInterviews(c).length ? "Pending" : "—")}</dd>
              <dt>Programme</dt><dd>${esc(c.programme)}</dd>
              ${c.programme === "Jahizoun" ? `<dt>EO function</dt><dd>${esc(c.team || "—")}</dd>` : ""}
              <dt>Intake</dt><dd>${esc(c.intake || "—")}</dd>
              <dt>Test score</dt><dd>${esc(c.test || "—")}</dd>
            </dl>
          </div>
          <div class="panel">
            <div class="panel-head"><h2>Key dates</h2><a class="small" href="#/deadlines" style="color:var(--accent-ink)">All deadlines →</a></div>
            <div class="panel-body">${keyDates(c)}</div>
          </div>
        </div>
      </div>`;
  }

  /* ---------- evaluation view (V2) ---------- */
  const CURRENT_Q = (() => { const d = today; return d.getFullYear() + " Q" + (Math.floor(d.getMonth() / 3) + 1); })();
  function renderEvaluation(c, ev) {
    if (!ev || (!Object.keys(ev.phases || {}).length && !META.competencies.some(cp => Object.keys((ev.ratings || {})[cp] || {}).length))) return `<div class="empty">No evaluation data for this candidate yet.${editMode ? " Use “Edit evaluation” to add it." : ""}</div>`;
    const comps = META.competencies;
    // show quarters only up to the last one that has a phase or a rating for this person (never before the current quarter)
    const lastIdx = Math.max(META.quarters.indexOf(CURRENT_Q), ...META.quarters.map((q, k) => (ev.phases[q] || comps.some(cp => (ev.ratings[cp] || {})[q])) ? k : -1));
    const Q = META.quarters.slice(0, lastIdx + 1);
    // phase spans
    const spans = []; let i = 0;
    while (i < Q.length) { const ph = ev.phases[Q[i]] || ""; let j = i; while (j + 1 < Q.length && (ev.phases[Q[j + 1]] || "") === ph) j++; spans.push({ phase: ph, from: i, to: j }); i = j + 1; }
    const years = []; Q.forEach((q, k) => { const y = q.slice(0, 4); const last = years[years.length - 1]; if (last && last.year === y) last.to = k; else years.push({ year: y, from: k, to: k }); });
    const assessed = Q.filter(q => comps.some(cp => (ev.ratings[cp] || {})[q]));
    const latest = assessed[assessed.length - 1];
    const cols = `grid-template-columns: 190px repeat(${Q.length}, minmax(34px, 1fr));`;
    const cell = (cp, q) => {
      const r = (ev.ratings[cp] || {})[q]; const lbl = r ? META.ratings[r] : "";
      const note = ev.quarterly && ev.quarterly[q] && ev.quarterly[q].competencies && ev.quarterly[q].competencies[cp];
      if (note && note.comment) return `<div class="ev-cell has-note ${r ? "r-" + r : "r-empty"} ${q === latest ? "latest" : ""}" tabindex="0" data-cp="${esc(cp)}" data-q="${esc(q)}" data-rating="${esc(lbl)}" data-tone="${esc(r || "")}" data-manager="${esc((ev.quarterly[q].manager || ev.lineManager || ""))}" data-note="${esc(note.comment)}"></div>`;
      return `<div class="ev-cell ${r ? "r-" + r : "r-empty"} ${q === latest ? "latest" : ""}" title="${esc(cp)} · ${esc(q)}${lbl ? ": " + esc(lbl) : ""}"></div>`;
    };
    return `
      <div class="profile-grid">
        <div>
          <div class="panel ev-panel">
            <div class="panel-head"><h2>Competency evaluation</h2><span class="small muted">${latest ? "Latest assessment: " + esc(latest) : "No assessment yet"}</span></div>
            <div class="ev-scroll"><div class="ev-grid" style="${cols}">
              <div class="ev-corner"></div>
              ${spans.map(sp => `<div class="ev-phase ${sp.phase ? "ph-" + slug(sp.phase) : "ph-none"}" style="grid-column: ${sp.from + 2} / ${sp.to + 3}">${esc(sp.phase)}</div>`).join("")}
              <div class="ev-corner"></div>
              ${years.map(y => `<div class="ev-year" style="grid-column: ${y.from + 2} / ${y.to + 3}">${y.year}</div>`).join("")}
              <div class="ev-corner"></div>
              ${Q.map(q => `<div class="ev-q ${q === CURRENT_Q ? "now" : ""} ${q === latest ? "latest" : ""}" title="${esc(q)}">${q.slice(5)}</div>`).join("")}
              ${comps.map(cp => `<div class="ev-label">${esc(cp)}</div>${Q.map(q => cell(cp, q)).join("")}`).join("")}
            </div></div>
            <div class="ev-legend">
              <span><i class="sw r-strong"></i>Strong</span><span><i class="sw r-effective"></i>Effective</span><span><i class="sw r-developing"></i>Developing</span><span><i class="sw r-na"></i>Not assessed</span>
              <span class="sep"></span>
              <span><i class="sw ph-corporate-exchange"></i>Corporate Exchange</span><span><i class="sw ph-eo-secondment"></i>EO Secondment</span>${Object.values(ev.phases || {}).includes("MBA") ? `<span><i class="sw ph-mba"></i>MBA</span>` : ""}
            </div>
            <div class="ev-foot">${Object.keys(ev.quarterly || {}).length ? "Cells with a dot carry the line manager’s comment: hover or tap to read it. " : ""}${ev.reportFirm ? `Corporate Exchange at ${esc(ev.reportFirm)}, assessed in its final report; ` : ""}EO Secondment assessed through the quarterly evaluations. The outlined column is the current quarter.</div>
          </div>
        </div>
        <div class="side">
          <div class="panel">
            <div class="panel-head"><div><h2>${esc(META.commentaryTitle || "Commentary")}</h2>${META.commentaryDate ? `<div class="small muted">${esc(META.commentaryDate)}</div>` : ""}</div></div>
            <div class="comm">
              ${commBlock("Strengths", ev.strengths, "ic-plus")}
              ${commBlock("Areas of improvement", ev.improvements, "ic-arrow")}
              ${commBlock("Masters situation", ev.masters, "ic-dot")}
              ${summaryBlock(ev)}
            </div>
          </div>
        </div>
      </div>`;
  }
  function summaryBlock(ev) {
    const qs = Object.keys(ev.quarterly || {}).filter(q => ev.quarterly[q].summary).sort();
    if (!qs.length) return "";
    const q = qs[qs.length - 1], r = ev.quarterly[q];
    return `<div class="comm-block"><h3 class="comm-title ic-dot">Line manager summary · ${esc(q)}</h3><p class="comm-text">${esc(r.summary)}${r.manager ? ` <span class="muted">— ${esc(r.manager)}</span>` : ""}</p></div>`;
  }
  function commBlock(title, items, icon) {
    if (!items || !items.length) return "";
    return `<div class="comm-block"><h3 class="comm-title ${icon}">${esc(title)}</h3><ul class="comm-list ${icon}">${items.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>`;
  }

  function appCard(c, a) {
    const s = status(eff(a));
    const sch = school(a.school);
    const dates = parseDates(a.interview && a.interview.date);
    const hasDate = dates.length > 0;
    const stageBars = STAGE_LABELS.map((l, i) => {
      let cls = "stage";
      if (s.stage === FINAL_STAGE && i === FINAL_STAGE) cls += " " + (s.tone === "good" ? "good" : s.tone === "critical" ? "critical" : "done");
      else if (i < s.stage) cls += " done";
      else if (i === s.stage) cls += " current";
      return `<div class="${cls}" title="${esc(l)}"></div>`;
    }).join("");
    const block = intakeForDeadlines(c, a.school);
    const r = block ? nextRound(block) : null;
    const dl = (key, approxKey, labelKey) => {
      if (!r) return `<span class="muted">Not published</span>`;
      const d = parseDate(r[key]);
      if (!d) return `<span class="muted">Not published</span>`;
      return `${labelKey && r[labelKey] ? esc(r[labelKey]) : fmt(d)}${r[approxKey] ? `<span class="approx">approx.</span>` : ""}`;
    };
    let interviewVal, interviewCls = "";
    if (hasDate) interviewVal = (eff(a) === "interviewed" ? "Completed · " : "") + fmtList(a.interview.date);
    else if (a.status === "interviewed") interviewVal = "Completed";
    else if (s.stage >= FINAL_STAGE) interviewVal = "—";
    else { interviewVal = "Pending"; interviewCls = "pending"; }
    return `
      <div class="panel app">
        <div class="app-head">
          <img class="app-logo" src="${esc(asset(sch.logo))}" alt="${esc(sch.name)}">
          <div class="app-title"><h3>${esc(sch.name)}</h3><div class="small muted">${block ? esc(block.intake) + " intake" + (r ? " · " + esc(r.round) : "") : esc(c.intake || "")}</div></div>
          ${statusPill(a)}
        </div>
        <div class="stages">${stageBars}</div>
        <div class="stage-labels">${STAGE_LABELS.map(l => `<span>${l}</span>`).join("")}</div>
        <div class="app-facts">
          <div class="fact"><div class="k">Interview</div><div class="v ${interviewCls}">${interviewVal}</div>${a.interview && a.interview.note ? `<div class="n">${esc(a.interview.note)}</div>` : ""}</div>
          <div class="fact"><div class="k">Interview decision deadline</div><div class="v">${dl("interviewDecision", "interviewDecisionApprox", "interviewDecisionLabel")}</div></div>
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
      if (add && daysFrom(add) >= 0 && status(a.status).stage < 1) items.push({ date: add, type: "deadline", title: `${school(a.school).short} application deadline`, sub: r.round });
      if (idd) items.push({ date: idd, type: "deadline", title: `${school(a.school).short} interview decisions${r.interviewDecisionApprox ? " (approx.)" : ""}`, sub: r.interviewDecisionLabel ? `${r.round} · ${r.interviewDecisionLabel}` : r.round });
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
    const cell = (v, approx, label) => {
      const d = parseDate(v);
      if (!d) return `<span class="muted">Not published</span>`;
      const n = daysFrom(d);
      return `<span class="pill-date">${label ? esc(label) : fmt(d)}${approx ? `<span class="approx">approx.</span>` : ""}${n >= 0 && n <= 14 ? `<span class="soon">${relative(d)}</span>` : ""}</span>`;
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
            <img class="app-logo" src="${esc(asset(school(b.school).logo))}" alt="">
            <div><h2>${esc(school(b.school).name)}</h2><div class="small muted">${esc(b.intake)} intake · <a href="${esc(school(b.school).url)}" target="_blank" rel="noopener" style="color:var(--accent-ink)">school website ↗</a></div></div>
          </div>
          <div class="table-wrap"><table>
            <thead><tr><th>Round</th><th>Application deadline</th><th>Interview decision</th><th>Final decision</th></tr></thead>
            <tbody>${b.rounds.map(r => {
              const fin = parseDate(r.finalDecision) || parseDate(r.application);
              const past = fin && daysFrom(fin) < 0 && r !== nr;
              return `<tr class="${r === nr ? "current-round" : ""} ${past ? "past" : ""}"><td>${esc(r.round)}</td><td class="num">${cell(r.application)}</td><td class="num">${cell(r.interviewDecision, r.interviewDecisionApprox, r.interviewDecisionLabel)}</td><td class="num">${cell(r.finalDecision, r.finalDecisionApprox)}</td></tr>`;
            }).join("")}</tbody>
          </table></div>
          ${who.length ? `<div class="dl-who">Candidates: ${who.map(c => `<a href="#/candidate/${esc(c.id)}">${esc(nameOf(c))}</a>`).join("")}</div>` : ""}
          ${b.note ? `<div class="dl-note">${esc(b.note)}</div>` : ""}
        </div>`;
      }).join("")}`;
  }

  /* ---------- editing ---------- */
  function openEditor(id) {
    const isNew = !id;
    const c = isNew ? { id: "", name: "", programme: "Jahizoun", team: "", photo: "", intake: "January 2027", test: "", notes: "", applications: [] } : deepClone(candidates.find(x => x.id === id));
    const extra = !isNew && isExtra(id);
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
              <div class="field"><label>GMAT / EA score</label><input name="test" value="${esc(c.test || "")}" placeholder="e.g. GMAT 665 or EA 160"></div>
              <div class="field"><label>Target intake</label><input name="intake" value="${esc(c.intake)}" list="intakeList"><datalist id="intakeList"><option value="January 2027"><option value="September 2027"><option value="January 2028"></datalist></div>
              <div class="field wide"><label>General notes</label><textarea name="notes">${esc(c.notes)}</textarea></div>
            </div>
            <div><div class="app-edit-head" style="margin-bottom:8px"><h3>Schools</h3><button type="button" class="btn small" data-add-app>+ Add school</button></div>
              <div style="display:grid;gap:10px" id="appRows">${c.applications.map(appRow).join("") || `<div class="hint">No schools yet. Add one above.</div>`}</div>
            </div>
          </div>
          <div class="modal-foot"><span class="hint" style="margin-right:auto">${isNew ? "New people added in V2 are stored in evaluation.js (V2 only)." : extra ? "This person exists only in V2 (evaluation.js)." : "Saved in this browser. Copy data.js to publish."}</span><button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">Save</button></div>
        </form>`;
    };
    const readForm = () => {
      const f = bg.querySelector("#editForm");
      c.name = f.name.value.trim(); c.programme = f.programme.value; c.team = f.team.value.trim();
      c.intake = f.intake.value.trim(); c.test = f.test.value.trim(); c.notes = f.notes.value.trim(); c.photo = f.photo.value.trim();
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
      if (e.target.closest("[data-add-app]")) { readForm(); c.applications.push({ school: "INSEAD", status: "applying", interview: { date: "", note: "" }, notes: "" }); render(); }
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
        c.id = id2; c.mbaPlanned = c.applications.length > 0; evalState.extras.push(c); persistEval();
      } else if (extra) {
        const i = evalState.extras.findIndex(x => x.id === c.id); evalState.extras[i] = c; persistEval();
      } else {
        const i = shared.findIndex(x => x.id === c.id); shared[i] = c; persist();
      }
      candidates = merge(); bg.remove(); toast("Saved locally"); route();
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

  function buildDataJs() {
    // Rebuild data.js from the original source text, replacing only the CANDIDATES block.
    return fetch(ASSET_BASE + "js/data.js?v=" + Date.now(), { cache: "no-store" }).then(r => r.text()).then(src => {
      const start = src.indexOf("const CANDIDATES = [");
      const end = src.indexOf("/* Do not edit below this line. */");
      const body = "const CANDIDATES = " + JSON.stringify(shared, null, 2) + ";\n\n";
      return start >= 0 && end > start ? src.slice(0, start) + body + src.slice(end) : "const CANDIDATES = " + JSON.stringify(shared, null, 2) + ";";
    }).catch(() => "const CANDIDATES = " + JSON.stringify(shared, null, 2) + ";");
  }
  function buildEvalJs() {
    return fetch((window.EVAL_PATH || "js/evaluation.js") + "?v=" + Date.now(), { cache: "no-store" }).then(r => r.text()).then(src => {
      const start = src.indexOf("const EXTRA_CANDIDATES = [");
      const end = src.indexOf("/* Do not edit below this line. */");
      const body = "const EXTRA_CANDIDATES = " + JSON.stringify(evalState.extras, null, 2) + ";\n\nconst NAME_OVERRIDES = " + JSON.stringify(EV.NAME_OVERRIDES, null, 2) + ";\n\nconst EVALUATIONS = " + JSON.stringify(evalState.evaluations, null, 2) + ";\n\n";
      return start >= 0 && end > start ? src.slice(0, start) + body + src.slice(end) : body;
    });
  }
  function copyEval() {
    buildEvalJs().then(out => {
      const done = () => toast("Copied. Now open v2/js/evaluation.js on GitHub, click the pencil, select all, paste, and commit.");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out).then(done, () => fallbackCopy(out, done));
      else fallbackCopy(out, done);
    });
  }

  /* ---------- evaluation editor (V2) ---------- */
  function openEvalEditor(id) {
    const c = candidates.find(x => x.id === id); if (!c) return;
    const ev = deepClone(evalState.evaluations[id] || { lineManager: "", function: c.team || "", corporateExchangeProject: "", previousFunction: "", academicQualifications: "", reportFirm: "", phases: {}, ratings: {}, strengths: [], improvements: [], masters: [] });
    const Q = META.quarters, comps = META.competencies;
    const bg = document.createElement("div"); bg.className = "modal-bg";
    const field = (label, name, val) => `<div class="field"><label>${esc(label)}</label><input name="${name}" value="${esc(val || "")}"></div>`;
    const ratingSel = (cp, q) => `<select data-cp="${esc(cp)}" data-q="${q}" class="r-sel ${(ev.ratings[cp] || {})[q] ? "r-" + (ev.ratings[cp] || {})[q] : ""}"><option value="">–</option>${Object.keys(META.ratings).map(k => `<option value="${k}" ${(ev.ratings[cp] || {})[q] === k ? "selected" : ""}>${esc(META.ratings[k])}</option>`).join("")}</select>`;
    const phaseSel = q => `<select data-phase="${q}" class="ph-sel"><option value="">–</option>${META.phases.map(ph => `<option ${ev.phases[q] === ph ? "selected" : ""}>${esc(ph)}</option>`).join("")}</select>`;
    bg.innerHTML = `
      <form class="modal wide" id="evalForm">
        <div class="modal-head"><h2>Edit evaluation · ${esc(nameOf(c))}</h2><button type="button" class="btn ghost" data-close>✕</button></div>
        <div class="modal-body">
          <div class="form-grid">
            ${field("Line manager", "lineManager", ev.lineManager)}
            ${field("Function at the Executive Office", "function", ev.function)}
            ${field("Corporate Exchange project", "corporateExchangeProject", ev.corporateExchangeProject)}
            ${field("Previous MOD function", "previousFunction", ev.previousFunction)}
            ${field("Academic qualifications", "academicQualifications", ev.academicQualifications)}
            ${field("Corporate Exchange company", "reportFirm", ev.reportFirm)}
            ${field("Documents (Label | link, separated by ;)", "docs", (ev.docs || []).map(d => (d.label || "") + " | " + (d.url || "")).join("; "))}
          </div>
          <div>
            <h3 style="margin-bottom:8px">Timeline and ratings</h3>
            <div class="ev-scroll"><table class="ev-edit"><thead><tr><th></th>${Q.map(q => `<th>${q}</th>`).join("")}</tr></thead><tbody>
              <tr><td>Phase</td>${Q.map(q => `<td>${phaseSel(q)}</td>`).join("")}</tr>
              ${comps.map(cp => `<tr><td>${esc(cp)}</td>${Q.map(q => `<td>${ratingSel(cp, q)}</td>`).join("")}</tr>`).join("")}
            </tbody></table></div>
            <div class="hint">Leave a quarter as “–” when it has not been assessed yet.</div>
          </div>
          <div class="form-grid">
            <div class="field"><label>Strengths (one per line)</label><textarea name="strengths" rows="5">${esc((ev.strengths || []).join("\n"))}</textarea></div>
            <div class="field"><label>Areas of improvement (one per line)</label><textarea name="improvements" rows="5">${esc((ev.improvements || []).join("\n"))}</textarea></div>
            <div class="field"><label>Masters situation (one per line)</label><textarea name="masters" rows="5">${esc((ev.masters || []).join("\n"))}</textarea></div>
          </div>
        </div>
        <div class="modal-foot"><span class="hint" style="margin-right:auto">Saved in this browser. Use “Copy evaluation.js” to publish.</span><button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">Save</button></div>
      </form>`;
    document.body.appendChild(bg);
    bg.addEventListener("click", e => { if (e.target === bg || e.target.closest("[data-close]")) bg.remove(); });
    bg.addEventListener("change", e => { if (e.target.classList.contains("r-sel")) e.target.className = "r-sel " + (e.target.value ? "r-" + e.target.value : ""); });
    bg.addEventListener("submit", e => {
      e.preventDefault();
      const f = bg.querySelector("#evalForm");
      ["lineManager", "function", "corporateExchangeProject", "previousFunction", "academicQualifications", "reportFirm"].forEach(k => ev[k] = f[k].value.trim());
      ev.docs = f.docs.value.split(";").map(t => t.trim()).filter(Boolean).map(t => { const p = t.split("|").map(x => x.trim()); return { label: p[0] || "Document", url: p[1] || "" }; });
      const lines = k => f[k].value.split("\n").map(x => x.trim()).filter(Boolean);
      ev.strengths = lines("strengths"); ev.improvements = lines("improvements"); ev.masters = lines("masters");
      ev.phases = {}; bg.querySelectorAll(".ph-sel").forEach(sel => { if (sel.value) ev.phases[sel.dataset.phase] = sel.value; });
      ev.ratings = {}; comps.forEach(cp => ev.ratings[cp] = {});
      bg.querySelectorAll(".r-sel").forEach(sel => { if (sel.value) ev.ratings[sel.dataset.cp][sel.dataset.q] = sel.value; });
      evalState.evaluations[id] = ev;
      if (ev.function && isExtra(id)) { const x = evalState.extras.find(y => y.id === id); if (x) x.team = ev.function; candidates = merge(); }
      persistEval(); bg.remove(); toast("Evaluation saved locally"); route();
    });
  }
  function exportData() {
    buildDataJs().then(out => {
      const blob = new Blob([out], { type: "text/plain" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "data.js"; a.click();
      toast("data.js downloaded. Open it with Notepad (right-click → Open with), copy everything, and paste into js/data.js on GitHub.");
    });
  }
  function copyData() {
    buildDataJs().then(out => {
      const done = () => toast("Copied. Now open js/data.js on GitHub, click the pencil, select all, paste, and commit.");
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out).then(done, () => fallbackCopy(out, done));
      else fallbackCopy(out, done);
    });
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { toast("Could not copy automatically. Use Export data.js instead."); }
    ta.remove();
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
    let view = "tld", html;
    const m = h.match(/^#\/candidate\/([^/]+)(?:\/(mba|evaluation))?/);
    const mc = h.match(/^#\/course\/([^/]+)/);
    if (m) { view = "profile"; html = renderProfile(decodeURIComponent(m[1]), m[2]); }
    else if (mc) { view = "course"; html = renderCourse(decodeURIComponent(mc[1])); }
    else if (h.startsWith("#/deadlines")) { view = "deadlines"; html = renderDeadlines(); }
    else if (h.startsWith("#/jahizoun")) { view = "home"; html = renderHome(); }
    else html = renderTld();
    app.innerHTML = html;
    document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("active", a.dataset.route === (view === "profile" ? "home" : view === "course" ? "tld" : view)));
    if (view !== "profile") window.scrollTo(0, 0);
    if (view === "home") bindHome();
  }
  function bindHome() {
    const q = document.getElementById("q");
    q.addEventListener("input", () => { filters.q = q.value; refreshHomeList(); });
    document.getElementById("progSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { filters.programme = b.dataset.p; route(); } });
    document.getElementById("schoolSel").addEventListener("change", e => { filters.school = e.target.value; route(); });
    document.getElementById("teamSel").addEventListener("change", e => { filters.team = e.target.value; route(); });
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
  document.getElementById("copyBtn").addEventListener("click", copyData);
  document.getElementById("copyEvalBtn").addEventListener("click", copyEval);
  document.getElementById("copyTldBtn").addEventListener("click", copyTld);
  document.getElementById("addCourseBtn").addEventListener("click", () => openCourseEditor(null));
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!hasLocalChanges() && !hasLocalEval() && !hasLocalCourses()) { toast("No local changes to discard."); return; }
    if (confirm("Discard all changes saved in this browser and reload the published data?")) {
      localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(STORAGE_KEY + ":base");
      localStorage.removeItem(EVAL_KEY); localStorage.removeItem(EVAL_KEY + ":base");
      localStorage.removeItem(TLD_KEY); localStorage.removeItem(TLD_KEY + ":base"); courses = deepClone(TLD.COURSES);
      shared = deepClone(BASE.CANDIDATES); evalState = { extras: deepClone(EV.EXTRA_CANDIDATES), evaluations: deepClone(EV.EVALUATIONS) }; candidates = merge(); route(); toast("Local changes discarded.");
    }
  });
  app.addEventListener("click", e => {
    const ec = e.target.closest("[data-edit-course]"); if (ec) { openCourseEditor(ec.dataset.editCourse); return; }
    const dc = e.target.closest("[data-del-course]");
    if (dc) { const k = courses.find(x => x.id === dc.dataset.delCourse); if (k && confirm(`Delete ${k.name}?`)) { courses = courses.filter(x => x.id !== k.id); persistCourses(); location.hash = "#/"; } return; }
    const ee = e.target.closest("[data-edit-eval]"); if (ee) { openEvalEditor(ee.dataset.editEval); return; }
    const ed = e.target.closest("[data-edit]"); if (ed) { openEditor(ed.dataset.edit); return; }
    const del = e.target.closest("[data-del]");
    if (del) {
      const c = candidates.find(x => x.id === del.dataset.del);
      if (c && confirm(`Delete ${nameOf(c)} from the tracker?`)) {
        if (isExtra(c.id)) { evalState.extras = evalState.extras.filter(x => x.id !== c.id); persistEval(); }
        else { shared = shared.filter(x => x.id !== c.id); persist(); }
        candidates = merge(); location.hash = "#/";
      }
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

  // ---- comment bubble on rated cells (line manager's comment per competency and quarter) ----
  const bubble = document.createElement("div"); bubble.className = "ev-bubble hidden"; document.body.appendChild(bubble);
  let bubbleCell = null;
  function showBubble(cell) {
    bubbleCell = cell;
    bubble.innerHTML = `<div class="ev-bubble-head"><b>${esc(cell.dataset.cp)}</b><span class="muted small">${esc(cell.dataset.q)}</span></div>
      ${cell.dataset.rating ? `<div class="ev-bubble-rating"><i class="sw r-${esc(cell.dataset.tone)}"></i>${esc(cell.dataset.rating)}${cell.dataset.manager ? ` <span class="muted">· ${esc(cell.dataset.manager)}</span>` : ""}</div>` : ""}
      <div class="ev-bubble-text">${esc(cell.dataset.note)}</div>`;
    bubble.classList.remove("hidden");
    const r = cell.getBoundingClientRect(), bw = Math.min(360, window.innerWidth - 24); bubble.style.width = bw + "px";
    let left = r.left + r.width / 2 - bw / 2; left = Math.max(12, Math.min(left, window.innerWidth - bw - 12));
    const bh = bubble.offsetHeight; let top = r.bottom + 8; if (top + bh > window.innerHeight - 12) top = r.top - bh - 8;
    bubble.style.left = left + window.scrollX + "px"; bubble.style.top = top + window.scrollY + "px";
  }
  function hideBubble() { bubble.classList.add("hidden"); bubbleCell = null; }
  app.addEventListener("mouseover", e => { const c = e.target.closest(".ev-cell.has-note"); if (c && c !== bubbleCell) showBubble(c); });
  app.addEventListener("mouseout", e => { const c = e.target.closest(".ev-cell.has-note"); if (c && !bubble.contains(e.relatedTarget)) hideBubble(); });
  app.addEventListener("click", e => { const c = e.target.closest(".ev-cell.has-note"); if (c) { e.preventDefault(); if (bubbleCell === c && !bubble.classList.contains("hidden")) hideBubble(); else showBubble(c); } else if (!bubble.contains(e.target)) hideBubble(); });
  app.addEventListener("focusin", e => { const c = e.target.closest(".ev-cell.has-note"); if (c) showBubble(c); });
  window.addEventListener("scroll", () => { if (bubbleCell) showBubble(bubbleCell); }, { passive: true });
  window.addEventListener("hashchange", route);
  route();
  if (staleLocalDiscarded) toast("The published dashboard was updated on GitHub, so it replaced the copy saved in this browser.");
  else if (hasLocalChanges() || hasLocalEval() || hasLocalCourses()) toast("Showing unpublished changes saved in this browser. Use the Copy buttons to publish them.");
})();
