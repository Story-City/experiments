// Map tab: the cleaned-up story map (and a "Today" look to compare).
export function createMapView(root, ctx) {
  const { icon, layout, findIssues, nodeHeight, NODE_W, HEAD_H, ROW_H, toast, prepare, storyStats } = ctx;
  const esc = ctx.esc;
  const FAR_AT = 0.62;
  const UNDO_MAX = 60;
  const HIGHLIGHTS = [
    ['', 'Highlight…'], ['loc', 'Location on'], ['off', 'Location off'], ['puzzle', 'Puzzles'], ['video', 'Video'],
    ['audio', 'Sound'], ['image', 'Images'], ['chat', 'Chat'], ['needs', 'Locked choices'], ['score', 'Score'],
    ['frmiss', 'Needs French'], ['issues', 'Things to fix'],
  ];

  root.innerHTML = `
    <div class="mapwrap" id="mw">
      <div class="world" id="world"><svg class="edges" id="edges"></svg><div id="nodes"></div><svg class="ghost" id="ghost" width="1" height="1"></svg></div>
      <div class="toolbar" id="tb"></div>
      <div class="stops" id="stops"></div>
      <div class="zoom">
        <button class="iconbtn" data-z="in" aria-label="Zoom in" title="Zoom in">${icon('plus')}</button>
        <button class="iconbtn" data-z="out" aria-label="Zoom out" title="Zoom out">${icon('minus')}</button>
        <button class="iconbtn" data-z="fit" aria-label="Fit to screen" title="Fit (F)">${icon('fit')}</button>
      </div>
      <div class="zoomlvl" id="zl"></div>
      <div class="mini" id="mini"><button class="mini__bar" id="miniBar">${icon('layers', 14)} Overview <span style="flex:1"></span>${icon('chevron', 14)}</button><canvas id="miniC" width="440" height="260" style="width:220px;height:130px"></canvas></div>
      <aside class="panel" id="panel" hidden></aside>
    </div>`;
  const $ = (s) => root.querySelector(s);
  const mw = $('#mw'); const world = $('#world'); const edgesEl = $('#edges'); const nodesEl = $('#nodes');
  const panel = $('#panel'); const tb = $('#tb'); const ghost = $('#ghost');

  let model = null; let pos = new Map(); let back = new Set(); let rows = [];
  let view = { x: 40, y: 120, s: 1 };
  let sel = null; let compare = 'clean'; let lang = 'en'; let onlyMissing = false; let far = false;
  let panelMode = null; let newCount = 0;
  let query = ''; let hl = ''; let matches = null; let matchIdx = -1;
  let trail = null;
  let undo = []; let redo = [];
  const kept = new Map(); // story id -> { model, pos, undo, redo } so edits survive switching stories

  const today = () => compare === 'today';
  const colourOf = (c) => (c.stop >= 0 && model.stops[c.stop] ? model.stops[c.stop].colour : { c: '#B0B7C6', bg: '#F6F7F9' });
  const issues = () => findIssues(model, lang).filter((i) => !today() || i.kind === 'block');
  const titleOf = (c) => (today() ? c.name : c.title);
  const frMissing = (c) => c.fr == null;
  const posKey = () => 'ct-pos-' + model.id;

  function relayout() { const L = layout(model, { rows: !today() }); pos = L.xy; back = L.back; rows = L.rows; }
  function loadSavedPos() {
    if (today()) return;
    try {
      const saved = JSON.parse(localStorage.getItem(posKey()) || 'null'); if (!saved) return;
      for (const [id, p] of Object.entries(saved)) if (pos.has(id)) Object.assign(pos.get(id), p);
    } catch (e) { /* storage unavailable */ }
  }
  function savePos() {
    if (today()) return;
    try { localStorage.setItem(posKey(), JSON.stringify(Object.fromEntries([...pos].map(([id, p]) => [id, { x: Math.round(p.x), y: Math.round(p.y) }])))); } catch (e) { /* storage unavailable */ }
  }

  // ---------- edits + undo ----------
  function snapshot() { return { chapters: structuredClone(model.chapters.map(({ blocks, frBlocks, ...c }) => ({ ...c, _b: blocks, _fb: frBlocks }))), pos: [...pos].map(([id, p]) => [id, { ...p }]) }; }
  function restore(s) {
    const chapters = s.chapters.map(({ _b, _fb, ...c }) => ({ ...c, blocks: _b, frBlocks: _fb }));
    model = prepare({ ...model, chapters }); pos = new Map(s.pos.map(([id, p]) => [id, { ...p }]));
    if (sel && !model.byId.has(sel)) closePanel();
    renderAll(); reopen(); savePos(); ctx.onEdit && ctx.onEdit(model);
  }
  function change(label, fn) {
    undo.push({ label, s: snapshot() }); if (undo.length > UNDO_MAX) undo.shift(); redo = [];
    fn();
    model = prepare({ ...model, chapters: model.chapters });
    for (const c of model.chapters) if (!pos.has(c.id)) pos.set(c.id, { x: 0, y: 0, h: nodeHeight(c), row: -1 });
    for (const c of model.chapters) { const p = pos.get(c.id); p.h = nodeHeight(c); }
    renderAll(); reopen(); savePos(); ctx.onEdit && ctx.onEdit(model);
    toast(label, { action: 'Undo', fn: doUndo });
  }
  function doUndo() { const u = undo.pop(); if (!u) return toast('Nothing to undo.'); redo.push({ label: u.label, s: snapshot() }); restore(u.s); toast('Undone: ' + u.label.replace(/\.$/, '').toLowerCase()); }
  function doRedo() { const r = redo.pop(); if (!r) return toast('Nothing to redo.'); undo.push({ label: r.label, s: snapshot() }); restore(r.s); toast('Redone: ' + r.label.replace(/\.$/, '').toLowerCase()); }
  function reopen() { if (panelMode === 'chapter' && sel && model.byId.has(sel)) openChapter(sel, true); else if (panelMode === 'issues') openIssues(); }

  // ---------- render ----------
  function nodeHTML(c) {
    const p = pos.get(c.id); const col = colourOf(c);
    const iss = findIssues({ ...model, chapters: [c] }, 'en').filter((i) => i.kind !== 'fr' && (!today() || i.kind === 'block')).length;
    const badges = [
      c.start ? `<span class="node__badge b-start">${icon('play', 10)} START</span>` : '',
      c.end ? `<span class="node__badge b-end">${icon('flag', 10)} END</span>` : '',
      c.score ? `<span class="node__badge b-score" title="Score-based">${icon('score', 10)} ${esc(c.score === 'pts' ? 'points' : c.score)}</span>` : '',
      iss ? `<span class="node__badge b-issue" title="${iss} to fix">${icon('alert', 10)} ${iss}</span>` : '',
      lang === 'fr' && !today() ? (frMissing(c) ? '<span class="node__badge b-frmiss">FR missing</span>' : '<span class="node__badge b-fr">FR ✓</span>') : '',
    ].join('');
    const icons = [
      c.loc ? `<span class="loc" title="Location on${c.place ? ': ' + esc(c.place) : ''}">${icon('pin', 14)}</span>` : `<span class="off" title="Location off">${icon('pinOff', 14)}</span>`,
      c.video ? `<span class="on" title="Video">${icon('video', 14)}</span>${c.video > 1 ? `<small>${c.video}</small>` : ''}` : '',
      c.audio ? `<span class="on" title="Sound">${icon('sound', 14)}</span>${c.audio > 1 ? `<small>${c.audio}</small>` : ''}` : '',
      c.image ? `<span class="on" title="Image">${icon('image', 14)}</span>${c.image > 1 ? `<small>${c.image}</small>` : ''}` : '',
      c.puzzle ? `<span class="on" title="Puzzle or riddle">${icon('puzzle', 14)}</span>` : '',
      c.chat ? `<span class="on" title="Chat lines">${icon('chat', 14)}</span>` : '',
    ].join('');
    const choices = c.choices.length
      ? c.choices.map((k, i) => `<div class="choice ${k.to ? '' : 'broken'}" data-ci="${i}">${icon(k.to ? 'arrow' : 'alert', 13)}<span>${esc((lang === 'fr' && k.fr) || k.label || '(no label)')}</span>${k.needs ? `<i class="lk" title="Locked: ${esc(k.needs)}">${icon('lock', 11)}</i>` : ''}<b class="handle" data-ci="${i}" title="Drag to a chapter to change where this goes"></b></div>`).join('')
      : `<div class="choice none">${icon(c.end ? 'flag' : 'alert', 13)}<span>${c.end ? 'Story ends here' : 'No choices yet'}</span></div>`;
    const add = `<div class="choice add" data-add="1">${icon('plus', 13)}<span>Add choice</span><b class="handle new" data-ci="new" title="Drag to a chapter, or onto empty space for a new chapter"></b></div>`;
    const dim = lang === 'fr' && onlyMissing && !frMissing(c);
    const cls = [sel === c.id ? 'sel' : '', dim ? 'dim' : '', matches && matches.has(c.id) ? 'match' : '',
      trail && trail.includes(c.id) ? 'trail' : '', trail && trail[trail.length - 1] === c.id ? 'now' : ''].join(' ');
    return `<div class="node ${cls}" data-id="${c.id}" style="left:${p.x}px;top:${p.y}px;height:${nodeHeight(c)}px;--sc:${col.c};--sbg:${col.bg}">
      <div class="node__head" style="height:${far ? '100%' : HEAD_H + 'px'}">
        <div class="node__top">${badges}<span class="node__code">${esc(c.code || '')}</span></div>
        <div class="node__title ${c.untitled && !today() ? 'untitled' : ''}" title="${esc(c.name)} (double-click to rename)">${esc(titleOf(c))}</div>
        <div class="node__icons">${icons}</div>
      </div>
      <div class="node__choices">${choices}${today() ? '' : add}</div>
    </div>`;
  }

  function stopLabels() {
    if (today()) return '';
    return model.stops.map((s, i) => {
      const p = pos.get(s.first); if (!p) return '';
      return `<div class="stoplabel" style="left:${p.x}px;top:${(rows[p.row] ? rows[p.row].top : p.y) - 12}px;transform:translateY(-100%);--sc:${s.colour.c}">${i + 1}. ${esc(s.name)}</div>`;
    }).join('');
  }

  function renderNodes() { nodesEl.innerHTML = model.chapters.map(nodeHTML).join('') + stopLabels(); renderEdges(); }

  function elbow(pts, r = 12) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px, py] = pts[i - 1]; const [x, y] = pts[i]; const [nx, ny] = pts[i + 1];
      const r1 = Math.min(r, Math.hypot(x - px, y - py) / 2); const r2 = Math.min(r, Math.hypot(nx - x, ny - y) / 2);
      const ax = x - Math.sign(x - px) * r1; const ay = y - Math.sign(y - py) * r1;
      const bx = x + Math.sign(nx - x) * r2; const by = y + Math.sign(ny - y) * r2;
      d += ` L${ax},${ay} Q${x},${y} ${bx},${by}`;
    }
    const last = pts[pts.length - 1];
    return d + ` L${last[0]},${last[1]}`;
  }

  // Lines go forward as curves. A jump to the next stop's row runs along the gap under the row.
  function edgePath(a, b, x1, y1, x2, y2) {
    if (x2 > x1 + 10 || a.row == null || a.row < 0 || b.row == null || b.row < 0 || !rows[a.row] || !rows[b.row]) {
      if (x2 > x1 + 10) {
        const dx = Math.max(40, (x2 - x1) / 2);
        return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
      }
      const top = Math.min(y1, y2) - (90 + Math.abs(y2 - y1) * 0.15);
      return `M${x1},${y1} C${x1 + 90},${top} ${x2 - 90},${top} ${x2},${y2}`;
    }
    const gy = b.row > a.row ? rows[a.row].bottom + 56 : rows[b.row].top - 40;
    return elbow([[x1, y1], [x1 + 26, y1], [x1 + 26, gy], [x2 - 30, gy], [x2 - 30, y2], [x2, y2]]);
  }
  const choiceY = (a, i) => a.y + HEAD_H + 4 + i * ROW_H + ROW_H / 2;

  function renderEdges() {
    let minX = 0; let minY = 0; let maxX = 0; let maxY = 0;
    for (const p of pos.values()) { minX = Math.min(minX, p.x - 300); maxX = Math.max(maxX, p.x + NODE_W + 200); maxY = Math.max(maxY, p.y + p.h + 200); minY = Math.min(minY, p.y - 300); }
    edgesEl.setAttribute('width', maxX - minX); edgesEl.setAttribute('height', maxY - minY);
    edgesEl.style.left = minX + 'px'; edgesEl.style.top = minY + 'px';
    edgesEl.setAttribute('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
    const out = []; const labels = []; const done = new Set();
    const walked = new Set();
    if (trail) for (let i = 1; i < trail.length; i++) walked.add(trail[i - 1] + '>' + trail[i]);
    for (const c of model.chapters) {
      const a = pos.get(c.id); if (!a) continue;
      const col = today() ? '#9CCBEF' : colourOf(c).c;
      c.choices.forEach((k, i) => {
        if (!k.to || !pos.has(k.to)) return;
        const b = pos.get(k.to);
        const key = c.id + '>' + k.to;
        if (far && done.has(key)) return;
        done.add(key);
        const x1 = a.x + NODE_W; const y1 = far ? a.y + a.h / 2 : choiceY(a, i);
        const x2 = b.x; const y2 = far ? b.y + b.h / 2 : b.y + HEAD_H / 2;
        const isBack = back.has(key) || (x2 <= x1 + 10 && !(b.row > a.row));
        const hot = sel && (sel === c.id || sel === k.to);
        out.push(`<path class="edge ${isBack ? 'back' : ''} ${hot ? 'hot' : ''} ${walked.has(key) ? 'walked' : ''}" data-from="${c.id}" data-to="${k.to}" data-ci="${i}" stroke="${col}" d="${edgePath(a, b, x1, y1, x2, y2)}"/>`);
        if (today() && k.label) {
          const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2 - 4;
          labels.push(`<text class="edge-label" x="${mx}" y="${my}" text-anchor="middle">${esc(k.label.length > 26 ? k.label.slice(0, 25) + '…' : k.label)}</text>`);
        }
      });
    }
    edgesEl.innerHTML = out.join('') + labels.join('');
  }

  function renderToolbar() {
    const all = issues();
    const list = all.filter((i) => i.kind !== 'fr');
    const frN = all.length - list.length;
    const blocks = list.filter((i) => i.kind === 'block').length;
    const cls = !list.length ? 'btn--ok' : blocks ? 'btn--bad' : 'btn--warn';
    const label = !list.length ? 'Nothing to fix' : `${list.length} to fix`;
    const hasQ = document.activeElement && document.activeElement.id === 'q';
    tb.innerHTML = `
      <button class="btn btn--fill" id="play" title="Test play from the start (P)">${icon('play')}<span class="txt">Play</span></button>
      <button class="btn" id="tidy" title="Line chapters up again">${icon('wand')}<span class="txt">Tidy up</span></button>
      <button class="btn" id="add" title="New chapter (N)">${icon('plus')}<span class="txt">Chapter</span></button>
      <button class="btn ${cls}" id="iss">${icon(list.length ? 'alert' : 'check')}<span class="txt keep">${label}</span></button>
      ${today() ? '' : `<span class="search">${icon('search', 15)}<input id="q" type="search" placeholder="Find a chapter" aria-label="Find a chapter (/)" value="${esc(query)}" autocomplete="off">${matches && query ? `<em>${matches.size}</em>` : '<kbd>/</kbd>'}</span>
      <select class="hlsel ${hl ? 'on' : ''}" id="hl" aria-label="Highlight chapters">${HIGHLIGHTS.map(([v, t]) => `<option value="${v}" ${v === hl ? 'selected' : ''}>${t}</option>`).join('')}</select>`}
      ${lang === 'fr' && !today() ? `<button class="chipbtn" id="onlyFr" aria-pressed="${onlyMissing}">${frN ? `Only missing French · ${frN}` : 'French done ✓'}</button>` : ''}
      <span class="tb__end">
        <button class="iconbtn" id="undo" aria-label="Undo" title="Undo (⌘Z)" ${undo.length ? '' : 'disabled'}>${icon('undo', 17)}</button>
        <button class="iconbtn" id="redo" aria-label="Redo" title="Redo (⇧⌘Z)" ${redo.length ? '' : 'disabled'}>${icon('redo', 17)}</button>
        <button class="iconbtn" id="help" aria-label="How the map works" title="How the map works (?)">${icon('help', 18)}</button>
      </span>`;
    if (hasQ) { const q = $('#q'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
    requestAnimationFrame(() => { $('#stops').style.top = (tb.offsetTop + tb.offsetHeight + 8) + 'px'; });
  }

  function renderStops() {
    $('#stops').innerHTML = today() ? '' : model.stops.map((s, i) =>
      `<button class="stopchip" data-stop="${i}" title="Show stop ${i + 1}: ${esc(s.name)}"><i style="background:${s.colour.c}"></i><span>${i + 1}. ${esc(s.name)}</span></button>`).join('');
  }

  function applyView(animate) {
    world.classList.toggle('anim', !!animate);
    world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.s})`;
    mw.style.setProperty('--inv', (1 / view.s).toFixed(3));
    const nowFar = !today() && view.s < FAR_AT;
    if (nowFar !== far) { far = nowFar; mw.classList.toggle('far', far); renderNodes(); }
    $('#zl').textContent = Math.round(view.s * 100) + '%';
    drawMini();
  }

  // ---------- search + highlight ----------
  function testHL(c) {
    switch (hl) {
      case 'loc': return c.loc; case 'off': return !c.loc; case 'puzzle': return c.puzzle; case 'video': return c.video > 0;
      case 'audio': return c.audio > 0; case 'image': return c.image > 0; case 'chat': return c.chat > 0;
      case 'needs': return c.choices.some((k) => k.needs); case 'score': return !!c.score; case 'frmiss': return frMissing(c);
      case 'issues': return findIssues({ ...model, chapters: [c] }, 'en').some((i) => i.kind !== 'fr');
      default: return true;
    }
  }
  function computeMatches() {
    const q = query.trim().toLowerCase();
    if (!q && !hl) { matches = null; mw.classList.remove('filtering'); return; }
    matches = new Set(model.chapters.filter((c) => testHL(c) && (!q || [c.name, c.title, c.code, c.text, c.place, c.fr, ...c.choices.map((k) => k.label)]
      .some((s) => s && String(s).toLowerCase().includes(q)))).map((c) => c.id));
    mw.classList.add('filtering');
  }
  function markMatches() {
    nodesEl.querySelectorAll('.node').forEach((n) => n.classList.toggle('match', !!matches && matches.has(n.dataset.id)));
    const em = tb.querySelector('.search em, .search kbd');
    if (em) em.outerHTML = matches && query ? `<em>${matches.size}</em>` : '<kbd>/</kbd>';
    const s = $('#hl'); if (s) s.classList.toggle('on', !!hl);
    drawMini();
  }
  function nextMatch(dir = 1) {
    if (!matches || !matches.size) return;
    const ids = model.chapters.filter((c) => matches.has(c.id)).map((c) => c.id);
    matchIdx = (matchIdx + dir + ids.length) % ids.length;
    centerOn(ids[matchIdx]); flashNode(ids[matchIdx]);
  }
  function flashNode(id) { const n = nodesEl.querySelector(`.node[data-id="${id}"]`); if (n) { n.classList.remove('ping'); void n.offsetWidth; n.classList.add('ping'); } }

  // ---------- geometry ----------
  function sideW(r) {
    if (r.width < 760) return 0;
    if (document.body.classList.contains('playing')) return 410;
    return panel.hidden ? 0 : 360;
  }
  function bounds(ids) {
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    for (const id of ids || pos.keys()) {
      const p = pos.get(id); if (!p) continue;
      x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x + NODE_W); y1 = Math.max(y1, p.y + p.h);
    }
    return { x0, y0, x1, y1 };
  }
  function topPad() { return tb.offsetHeight + 70; }
  function fit(ids, animate = true, maxS = 1.1) {
    const b = bounds(ids); const r = mw.getBoundingClientRect();
    const tp = topPad(); const side = 30; const panelW = sideW(r);
    const w = r.width - side * 2 - panelW; const h = r.height - tp - 30;
    const s = Math.max(0.06, Math.min(maxS, w / (b.x1 - b.x0), h / (b.y1 - b.y0)));
    view = { s, x: side + (w - (b.x1 - b.x0) * s) / 2 - b.x0 * s, y: tp + (h - (b.y1 - b.y0) * s) / 2 - b.y0 * s };
    applyView(animate);
  }
  // Opening view: whole story if it's readable, otherwise full width from the top
  function fitStart(animate) {
    const b = bounds(); const r = mw.getBoundingClientRect();
    const tp = topPad(); const side = 30;
    const w = r.width - side * 2; const h = r.height - tp - 30;
    const all = Math.min(1.1, w / (b.x1 - b.x0), h / (b.y1 - b.y0));
    if (all >= 0.42 || today()) return fit(null, animate);
    const s = Math.max(all, Math.min(0.58, w / (b.x1 - b.x0)));
    view = { s, x: side + Math.max(0, (w - (b.x1 - b.x0) * s) / 2) - b.x0 * s, y: tp + 30 - b.y0 * s };
    applyView(animate);
  }
  function centerOn(id, s) {
    const p = pos.get(id); if (!p) return;
    const r = mw.getBoundingClientRect(); const panelW = sideW(r);
    view.s = s || Math.max(view.s, 0.85);
    const vh = r.width < 760 ? r.height * 0.38 : r.height;
    view.x = (r.width - panelW) / 2 - (p.x + NODE_W / 2) * view.s;
    view.y = vh / 2 + (r.width < 760 ? 40 : 0) - (p.y + p.h / 2) * view.s;
    applyView(true);
  }
  function zoomAt(f, cx, cy) {
    const s = Math.max(0.06, Math.min(2, view.s * f));
    const k = s / view.s;
    view.x = cx - (cx - view.x) * k; view.y = cy - (cy - view.y) * k; view.s = s;
    applyView(false);
  }
  function toWorld(clientX, clientY) { const r = mw.getBoundingClientRect(); return { x: (clientX - r.left - view.x) / view.s, y: (clientY - r.top - view.y) / view.s }; }

  // ---------- minimap ----------
  const miniC = $('#miniC');
  function miniScale() {
    const b = bounds(); const W = miniC.width; const H = miniC.height;
    const s = Math.min((W - 20) / (b.x1 - b.x0), (H - 20) / (b.y1 - b.y0));
    return { b, s, ox: 10 - b.x0 * s + (W - 20 - (b.x1 - b.x0) * s) / 2, oy: 10 - b.y0 * s + (H - 20 - (b.y1 - b.y0) * s) / 2 };
  }
  function drawMini() {
    if (!model || ($('#mini').classList.contains('folded') && !today())) return;
    const g = miniC.getContext('2d'); const { s, ox, oy } = miniScale();
    g.clearRect(0, 0, miniC.width, miniC.height);
    g.fillStyle = '#F7F8FB'; g.fillRect(0, 0, miniC.width, miniC.height);
    for (const c of model.chapters) {
      const p = pos.get(c.id); if (!p) continue;
      g.globalAlpha = matches && !matches.has(c.id) ? 0.18 : 1;
      g.fillStyle = today() ? '#5DA9E9' : colourOf(c).c;
      g.fillRect(ox + p.x * s, oy + p.y * s, Math.max(2, NODE_W * s), Math.max(2, p.h * s));
    }
    g.globalAlpha = 1;
    const r = mw.getBoundingClientRect();
    g.strokeStyle = '#1D2433'; g.lineWidth = 2;
    g.strokeRect(ox + (-view.x / view.s) * s, oy + (-view.y / view.s) * s, (r.width / view.s) * s, (r.height / view.s) * s);
  }
  miniC.addEventListener('click', (e) => {
    const { s, ox, oy } = miniScale(); const rr = miniC.getBoundingClientRect();
    const wx = ((e.clientX - rr.left) * (miniC.width / rr.width) - ox) / s;
    const wy = ((e.clientY - rr.top) * (miniC.height / rr.height) - oy) / s;
    const r = mw.getBoundingClientRect();
    view.x = r.width / 2 - wx * view.s; view.y = r.height / 2 - wy * view.s; applyView(true);
  });
  $('#miniBar').addEventListener('click', () => { $('#mini').classList.toggle('folded'); drawMini(); });

  // ---------- panel ----------
  function preds(id) { return model.chapters.filter((c) => c.choices.some((k) => k.to === id)); }
  function targetOptions(k, selfId) {
    const opts = model.chapters.filter((t) => t.id !== selfId).slice().sort((a, b) => (a.stop < 0) - (b.stop < 0) || a.stop - b.stop);
    return `<option value="">Goes nowhere yet</option>` + opts.map((t) => `<option value="${t.id}" ${t.id === k.to ? 'selected' : ''}>${t.stop >= 0 ? t.stop + 1 + '. ' : ''}${esc(t.title)}${t.code ? ' (' + esc(t.code) + ')' : ''}</option>`).join('');
  }
  function openChapter(id, keepScroll) {
    const scroll = keepScroll ? (panel.querySelector('.panel__body') || {}).scrollTop : 0;
    sel = id; panelMode = 'chapter';
    const c = model.byId.get(id); const col = colourOf(c);
    const stop = c.stop >= 0 ? model.stops[c.stop] : null;
    const from = preds(id);
    const facts = [
      c.video ? `<span class="fact">${icon('video', 14)} Video ×${c.video}</span>` : '',
      c.audio ? `<span class="fact">${icon('sound', 14)} Sound ×${c.audio}</span>` : '',
      c.image ? `<span class="fact">${icon('image', 14)} Image ×${c.image}</span>` : '',
      c.puzzle ? `<span class="fact">${icon('puzzle', 14)} Puzzle</span>` : '',
      c.chat ? `<span class="fact">${icon('chat', 14)} ${c.chat} chat line${c.chat > 1 ? 's' : ''}</span>` : '',
      c.score ? `<span class="fact">${icon('score', 14)} Score: ${esc(c.score)}</span>` : '',
    ].join('');
    const myIssues = findIssues({ ...model, chapters: [c] }, lang).filter((i) => !today() || i.kind === 'block');
    panel.style.setProperty('--sbg', col.bg);
    panel.innerHTML = `
      <div class="panel__head">
        <div style="flex:1;min-width:0">
          <div class="small muted">${esc(c.code || 'Chapter')}${stop ? ` · Stop ${c.stop + 1}: ${esc(stop.name)}` : ' · Not reached yet'}</div>
          <h2 id="pTitle">${esc(titleOf(c))}</h2>
        </div>
        <button class="iconbtn" id="pRename" aria-label="Rename" title="Rename (Enter)">${icon('pencil')}</button>
        <button class="iconbtn" id="pDelete" aria-label="Delete chapter" title="Delete chapter">${icon('trash')}</button>
        <button class="iconbtn" id="pClose" aria-label="Close" title="Close (Esc)">${icon('close')}</button>
      </div>
      <div class="panel__body">
        ${myIssues.length ? `<h3>To fix</h3>${myIssues.map((i) => `<div class="issue ${i.kind} small">${icon('alert', 15)}<span>${esc(i.text)}</span></div>`).join('')}` : ''}
        <div class="toggles">
          <button class="chipbtn tog" data-tog="start" aria-pressed="${!!c.start}">${icon('play', 12)} Start</button>
          <button class="chipbtn tog" data-tog="end" aria-pressed="${!!c.end}">${icon('flag', 12)} Ending</button>
          <button class="chipbtn tog" data-tog="loc" aria-pressed="${!!c.loc}">${icon(c.loc ? 'pin' : 'pinOff', 12)} ${c.loc ? 'Location on' : 'Location off'}</button>
        </div>
        ${c.loc ? `<div class="small muted placeline">${icon('pin', 13)} ${c.place ? esc(c.place) : 'No place set yet'} · starts a new stop on the map</div>` : ''}
        ${facts ? `<h3>In this chapter</h3><div class="facts">${facts}</div>` : ''}
        <h3>Opening lines</h3><div class="quote">${esc(c.text || '(no text yet)')}</div>
        <h3>French</h3>${c.fr == null ? '<div class="quote missing">No French yet.</div>' : `<div class="quote fr">${esc(c.fr)}</div>`}
        <h3>Choices <span class="h3note">what the player taps</span></h3>
        <div class="cedit">${c.choices.map((k, i) => `
          <div class="crow ${k.to ? '' : 'broken'}" data-ci="${i}">
            <input class="clabel" data-ci="${i}" value="${esc(k.label)}" aria-label="Choice wording" placeholder="What the player taps">
            <div class="crow__go">${icon('arrow', 14)}<select data-ci="${i}" aria-label="Where this choice goes">${targetOptions(k, c.id)}</select>
              ${k.to ? `<button class="iconbtn sm" data-go="${k.to}" aria-label="Go to that chapter" title="Go there">${icon('open', 14)}</button>` : ''}
              <button class="iconbtn sm" data-del="${i}" aria-label="Delete choice" title="Delete choice">${icon('trash', 14)}</button></div>
            ${k.needs ? `<span class="needs">${icon('lock', 11)} Locked until ${esc(k.needs === 'MATCH_NUMBER' ? 'the number matches' : k.needs.toLowerCase().replace(/_/g, ' '))}</span>` : ''}
          </div>`).join('') || `<span class="muted small">${c.end ? 'This is an ending.' : 'No choices yet.'}</span>`}
          <button class="btn btn--ghost sm" id="pAddChoice">${icon('plus', 14)} Add choice</button>
        </div>
        <h3>Comes from</h3><div class="golist">${from.length ? from.map((f) => `<button data-go="${f.id}">${icon('arrow', 15)}<span class="lbl">${esc(titleOf(f))}</span></button>`).join('') : `<span class="muted small">${c.start ? 'This is where the story starts.' : 'Nothing leads here yet. Drag a choice’s dot onto this chapter.'}</span>`}</div>
      </div>
      <div class="panel__foot">
        <button class="btn btn--fill" id="pPlay">${icon('play')} Play from here</button>
        <button class="btn" id="pOpen" title="Opens the full chapter editor in Creator Tools">Edit</button>
        <button class="btn" id="pScript" title="Show this chapter in the script">Script</button>
      </div>`;
    panel.hidden = false;
    mw.classList.add('has-sel');
    if (scroll) panel.querySelector('.panel__body').scrollTop = scroll;
    markSelection();
  }

  function openIssues() {
    sel = null; panelMode = 'issues'; markSelection(); mw.classList.remove('has-sel');
    const list = issues();
    const fr = list.filter((i) => i.kind === 'fr');
    const blocks = list.filter((i) => i.kind === 'block'); const checks = list.filter((i) => i.kind === 'check');
    const st = storyStats(model);
    const group = (title, items) => items.length ? `<h3>${title} · ${items.length}</h3><div class="golist">${items.map((i) => `<button data-go="${i.id}" class="issue ${i.kind}">${icon('alert', 15)}<span class="lbl">${esc(i.text)}</span></button>`).join('')}</div>` : '';
    panel.style.setProperty('--sbg', '#fff');
    panel.innerHTML = `
      <div class="panel__head"><h2>${blocks.length + checks.length ? 'Things to fix' : 'Nothing to fix'}</h2><button class="iconbtn" id="pClose" aria-label="Close">${icon('close')}</button></div>
      <div class="panel__body">
        <h3>Story at a glance</h3>
        <div class="glance">
          <span><b>${st.chapters}</b> chapters</span><span><b>${st.choices}</b> choices</span><span><b>${st.stops}</b> stops</span><span><b>${st.endings}</b> endings</span>
          <span class="wide"><b>${st.shortest ?? '–'}</b> chapters on the shortest way to an ending, <b>${st.longest || '–'}</b> on the longest</span>
        </div>
        ${!blocks.length && !checks.length ? '<p class="muted small">Every chapter can be reached, every choice goes somewhere, and every chapter has a readable name.</p>' : ''}
        ${group('Blocks publishing', blocks)}
        ${group('Worth checking', checks)}
        ${fr.length ? `<h3>French · ${fr.length}</h3><p class="small">${fr.length} of ${model.chapters.length} chapters need French.</p><button class="chipbtn" id="pOnlyFr" aria-pressed="${onlyMissing}">Show only those</button>` : ''}
      </div>`;
    panel.hidden = false;
  }

  function closePanel() { panel.hidden = true; sel = null; panelMode = null; mw.classList.remove('has-sel'); markSelection(); }

  function markSelection() {
    nodesEl.querySelectorAll('.node').forEach((n) => { n.classList.toggle('sel', n.dataset.id === sel); n.classList.remove('near'); });
    edgesEl.querySelectorAll('.edge').forEach((e) => {
      const hot = !!sel && (e.dataset.from === sel || e.dataset.to === sel);
      e.classList.toggle('hot', hot);
      if (hot) {
        const other = e.dataset.from === sel ? e.dataset.to : e.dataset.from;
        const n = nodesEl.querySelector(`.node[data-id="${other}"]`); if (n) n.classList.add('near');
      }
    });
  }

  function startRename(id) {
    if (today()) return;
    if (sel !== id || panel.hidden) openChapter(id);
    const c = model.byId.get(id); const h = panel.querySelector('#pTitle');
    h.innerHTML = `<input class="rename" id="pIn" value="${esc(c.title)}" maxlength="60" aria-label="Chapter name">`;
    const inp = panel.querySelector('#pIn'); inp.focus(); inp.select();
    let finished = false;
    const done = (save) => {
      if (finished) return; finished = true;
      const v = inp.value.trim();
      if (save && v && v !== c.title) change(`Renamed to “${v}”.`, () => { c.customTitle = v; });
      else openChapter(c.id, true);
    };
    inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') done(true); if (ev.key === 'Escape') { ev.stopPropagation(); done(false); } });
    inp.addEventListener('blur', () => done(true));
  }

  function addChoice(c, to) {
    const t = to && model.byId.get(to);
    change(t ? `Choice added: ${c.title} → ${t.title}.` : 'Choice added. Pick where it goes.', () => {
      c.choices.push({ label: t ? `Go to ${t.title}` : 'New choice', to: to || null, needs: null });
      if (c.end && t) c.end = false;
    });
  }
  function deleteChapter(id) {
    const c = model.byId.get(id);
    closePanel();
    change(`Deleted “${c.title}”.`, () => {
      model.chapters = model.chapters.filter((x) => x.id !== id);
      for (const x of model.chapters) for (const k of x.choices) if (k.to === id) k.to = null;
      pos.delete(id);
    });
  }

  panel.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    const c = sel && model.byId.get(sel);
    if (t.id === 'pClose') return closePanel();
    if (t.dataset.go) { openChapter(t.dataset.go); centerOn(t.dataset.go); return; }
    if (t.id === 'pOpen') return toast('In Creator Tools this opens the full chapter editor (text, media, location, requirements, score).');
    if (t.id === 'pScript') return ctx.showInScript(sel);
    if (t.id === 'pPlay') return ctx.play(model, sel, lang);
    if (t.id === 'pOnlyFr') { onlyMissing = !onlyMissing; renderAll(); openIssues(); return; }
    if (t.id === 'pRename') return startRename(sel);
    if (t.id === 'pDelete') return deleteChapter(sel);
    if (t.id === 'pAddChoice') { addChoice(c, null); requestAnimationFrame(() => { const ins = panel.querySelectorAll('.clabel'); const last = ins[ins.length - 1]; if (last) { last.focus(); last.select(); } }); return; }
    if (t.dataset.del != null) { const k = c.choices[+t.dataset.del]; return change(`Deleted choice “${k.label}”.`, () => { c.choices.splice(+t.dataset.del, 1); }); }
    if (t.dataset.tog) {
      const f = t.dataset.tog;
      if (f === 'start') return change(c.start ? `“${c.title}” is no longer the start.` : `“${c.title}” is now the start.`, () => { const v = !c.start; model.chapters.forEach((x) => { x.start = false; }); c.start = v; });
      if (f === 'end') return change(c.end ? `“${c.title}” is no longer an ending.` : `“${c.title}” is now an ending.`, () => { c.end = !c.end; });
      if (f === 'loc') return change(c.loc ? `Location off for “${c.title}”.` : `Location on for “${c.title}”. It starts a new stop.`, () => { c.loc = !c.loc; });
    }
  });
  panel.addEventListener('change', (e) => {
    const t = e.target; const c = sel && model.byId.get(sel); if (!c) return;
    if (t.matches('select[data-ci]')) {
      const k = c.choices[+t.dataset.ci]; const to = t.value || null; const dest = to && model.byId.get(to);
      change(dest ? `“${k.label}” now goes to ${dest.title}.` : `“${k.label}” goes nowhere now.`, () => { k.to = to; });
    }
    if (t.matches('input.clabel')) {
      const k = c.choices[+t.dataset.ci]; const v = t.value.trim();
      if (v && v !== k.label) change(`Choice renamed to “${v}”.`, () => { k.label = v; });
    }
  });
  panel.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input.clabel')) e.target.blur(); });

  // ---------- toolbar ----------
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || !root.contains(b) || panel.contains(b)) return;
    if (b.id === 'tidy') {
      const before = snapshot();
      relayout(); try { localStorage.removeItem(posKey()); } catch (er) { /* storage unavailable */ }
      world.classList.add('anim'); renderNodes(); fitStart(true);
      undo.push({ label: 'Tidied up.', s: before }); redo = []; renderToolbar();
      toast('Tidied: one row per stop, endings in one column.', { action: 'Undo', fn: doUndo });
    }
    if (b.dataset.z === 'fit') fit(null, true);
    if (b.dataset.z === 'in' || b.dataset.z === 'out') { const r = mw.getBoundingClientRect(); zoomAt(b.dataset.z === 'in' ? 1.25 : 0.8, r.width / 2, r.height / 2); }
    if (b.id === 'add') addChapter();
    if (b.id === 'iss') { if (panelMode === 'issues' && !panel.hidden) closePanel(); else openIssues(); }
    if (b.id === 'onlyFr') { onlyMissing = !onlyMissing; renderAll(); }
    if (b.id === 'help') ctx.openAbout('map');
    if (b.id === 'undo') doUndo();
    if (b.id === 'redo') doRedo();
    if (b.id === 'play') ctx.play(model, null, lang);
    if (b.dataset.stop) { const i = +b.dataset.stop; fit(model.chapters.filter((c) => c.stop === i).map((c) => c.id), true, 1); }
  });
  tb.addEventListener('input', (e) => {
    if (e.target.id !== 'q') return;
    query = e.target.value; matchIdx = -1; computeMatches(); markMatches();
  });
  tb.addEventListener('keydown', (e) => {
    if (e.target.id !== 'q') return;
    if (e.key === 'Enter') { e.preventDefault(); nextMatch(e.shiftKey ? -1 : 1); }
    if (e.key === 'Escape') { e.stopPropagation(); query = ''; e.target.value = ''; computeMatches(); markMatches(); e.target.blur(); }
  });
  tb.addEventListener('change', (e) => {
    if (e.target.id !== 'hl') return;
    hl = e.target.value; matchIdx = -1; computeMatches(); markMatches();
    if (hl && matches) toast(matches.size ? `${matches.size} chapter${matches.size > 1 ? 's' : ''} lit up.` : 'No chapters match.');
  });

  function addChapter(at, linkFrom) {
    newCount++;
    const r = mw.getBoundingClientRect();
    const id = 'n' + newCount + '-' + Date.now().toString(36);
    const c = { id, name: 'New chapter', code: '', choices: [], start: false, end: false, loc: false, audio: 0, video: 0, image: 0, puzzle: false, chat: 0, text: '', fr: null };
    const wx = at ? at.x : (r.width / 2 - view.x) / view.s - NODE_W / 2; const wy = at ? at.y : (r.height / 2 - view.y) / view.s - 60;
    change(linkFrom ? 'New chapter added and linked.' : 'New chapter added. Drag a choice’s dot onto it to link it.', () => {
      model.chapters.push(c);
      pos.set(id, { x: wx, y: wy, h: nodeHeight(c), row: -1 });
      if (linkFrom) {
        const from = model.byId.get(linkFrom.from);
        if (linkFrom.ci === 'new') from.choices.push({ label: 'New choice', to: id, needs: null });
        else from.choices[linkFrom.ci].to = id;
      }
    });
    openChapter(id); setTimeout(() => startRename(id), 30);
  }

  // ---------- pointer: pan, drag nodes, connect, pinch ----------
  const pts = new Map(); let drag = null; let pinch = null; let link = null;
  mw.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.toolbar, .zoom, .mini, .panel, .stops')) return;
    mw.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: view.s }; drag = null; link = null; return;
    }
    const handle = !today() && !far && e.target.closest('.handle');
    if (handle) {
      const id = handle.closest('.node').dataset.id; const p = pos.get(id);
      const ci = handle.dataset.ci === 'new' ? 'new' : +handle.dataset.ci;
      const row = ci === 'new' ? Math.max(1, model.byId.get(id).choices.length) : ci;
      link = { from: id, ci, x0: p.x + NODE_W, y0: choiceY(p, row), moved: false, over: null };
      mw.classList.add('linking'); return;
    }
    const node = e.target.closest('.node');
    drag = { node: node ? node.dataset.id : null, sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y, moved: false, p0: node ? { ...pos.get(node.dataset.id) } : null, add: !!e.target.closest('.choice.add'), snap: null };
    world.classList.remove('anim');
  });
  mw.addEventListener('pointermove', (e) => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pts.size === 2) {
      const [a, b] = [...pts.values()]; const r = mw.getBoundingClientRect();
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((pinch.s * d / pinch.d) / view.s, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); return;
    }
    if (link) {
      const w = toWorld(e.clientX, e.clientY); link.moved = true;
      const dx = Math.max(40, Math.abs(w.x - link.x0) / 2);
      ghost.innerHTML = `<path d="M${link.x0},${link.y0} C${link.x0 + dx},${link.y0} ${w.x - dx},${w.y} ${w.x},${w.y}"/><circle cx="${w.x}" cy="${w.y}" r="6"/>`;
      const under = document.elementFromPoint(e.clientX, e.clientY); const n = under && under.closest('.node');
      const over = n && n.dataset.id !== link.from ? n.dataset.id : null;
      if (over !== link.over) { nodesEl.querySelectorAll('.droptarget').forEach((x) => x.classList.remove('droptarget')); if (over) n.classList.add('droptarget'); link.over = over; }
      return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.sx; const dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    if (!drag.moved && drag.node) drag.snap = snapshot();
    drag.moved = true;
    if (drag.node && !today()) {
      const p = pos.get(drag.node); p.x = drag.p0.x + dx / view.s; p.y = drag.p0.y + dy / view.s;
      const el = nodesEl.querySelector(`.node[data-id="${drag.node}"]`); el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
      renderEdges(); markSelection();
    } else {
      mw.classList.add('panning'); view.x = drag.vx + dx; view.y = drag.vy + dy; applyView(false);
    }
  });
  const end = (e) => {
    pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
    mw.classList.remove('panning');
    if (link) {
      const L = link; link = null; ghost.innerHTML = ''; mw.classList.remove('linking');
      nodesEl.querySelectorAll('.droptarget').forEach((x) => x.classList.remove('droptarget'));
      const from = model.byId.get(L.from);
      if (L.over) {
        const t = model.byId.get(L.over);
        if (L.ci === 'new') addChoice(from, t.id);
        else { const k = from.choices[L.ci]; change(`“${k.label}” now goes to ${t.title}.`, () => { k.to = t.id; }); }
        flashNode(t.id);
        return;
      }
      const w = toWorld(e.clientX, e.clientY); const fp = pos.get(L.from);
      const farEnough = L.moved && e.type === 'pointerup' && Math.hypot(w.x - L.x0, w.y - L.y0) > 60
        && !(w.x > fp.x && w.x < fp.x + NODE_W && w.y > fp.y && w.y < fp.y + fp.h);
      if (farEnough) addChapter({ x: w.x, y: w.y - HEAD_H / 2 }, { from: L.from, ci: L.ci });
      else if (L.ci === 'new') { openChapter(L.from); addChoice(from, null); }
      else openChapter(L.from);
      return;
    }
    if (drag && !drag.moved) {
      if (drag.add && drag.node) { openChapter(drag.node); addChoice(model.byId.get(drag.node), null); }
      else if (drag.node) openChapter(drag.node);
      else if (!panel.hidden && panelMode === 'chapter') closePanel();
    }
    if (drag && drag.moved && drag.node) {
      undo.push({ label: 'Moved a chapter.', s: drag.snap }); redo = []; savePos(); drawMini(); renderToolbar();
    }
    drag = null;
  };
  mw.addEventListener('pointerup', end); mw.addEventListener('pointercancel', end);
  mw.addEventListener('dblclick', (e) => { const n = e.target.closest('.node'); if (n && !e.target.closest('.choice')) startRename(n.dataset.id); });
  mw.addEventListener('wheel', (e) => {
    if (e.target.closest('.panel')) return;
    e.preventDefault(); const r = mw.getBoundingClientRect();
    zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  nodesEl.addEventListener('pointerover', (e) => {
    const row = e.target.closest('.choice'); if (!row || row.dataset.ci == null) return;
    const id = row.closest('.node').dataset.id;
    edgesEl.querySelectorAll(`.edge[data-from="${id}"][data-ci="${row.dataset.ci}"]`).forEach((p) => p.classList.add('hot'));
  });
  nodesEl.addEventListener('pointerout', (e) => { if (e.target.closest('.choice')) markSelection(); });
  window.addEventListener('resize', () => drawMini());

  // ---------- keyboard ----------
  document.addEventListener('keydown', (e) => {
    if (root.hidden || !model || document.querySelector('.about:not([hidden])')) return;
    const typing = e.target.closest && e.target.closest('input, textarea, select, [contenteditable]');
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); if (e.shiftKey) doRedo(); else doUndo(); return; }
    if (mod && e.key.toLowerCase() === 'y' && !typing) { e.preventDefault(); doRedo(); return; }
    if (mod && e.key.toLowerCase() === 'f' && !today()) { e.preventDefault(); $('#q').focus(); return; }
    if (typing || mod || e.altKey) return;
    if (e.key === '/' && !today()) { e.preventDefault(); $('#q').focus(); }
    else if (e.key === 'p' || e.key === 'P') ctx.play(model, sel, lang);
    else if (e.key === 'f' || e.key === 'F') fit(null, true);
    else if (e.key === 'n' || e.key === 'N') { if (!today()) addChapter(); }
    else if (e.key === '?') ctx.openAbout('keys');
    else if (e.key === 'Escape') { if (!panel.hidden) closePanel(); else if (query || hl) { query = ''; hl = ''; computeMatches(); renderToolbar(); markMatches(); } }
    else if ((e.key === 'Enter' || e.key === 'F2') && sel) { e.preventDefault(); startRename(sel); }
  });

  function renderAll() { computeMatches(); renderToolbar(); renderStops(); renderNodes(); markSelection(); drawMini(); }
  function keep() { if (model) kept.set(model.id, { model, pos, undo, redo }); }

  return {
    show(m, opts = {}) {
      keep();
      const k = !opts.fresh && kept.get(m.id);
      sel = null; panel.hidden = true; panelMode = null; mw.classList.remove('has-sel'); onlyMissing = false;
      query = ''; hl = ''; trail = null;
      if (k && !today()) { model = k.model; undo = k.undo; redo = k.redo; relayout(); pos = k.pos; }
      else { model = m; undo = []; redo = []; relayout(); loadSavedPos(); }
      far = false; mw.classList.remove('far');
      renderAll(); requestAnimationFrame(() => fitStart(false));
    },
    setLang(l) { lang = l; if (model) { renderAll(); reopen(); } },
    setCompare(c) {
      compare = c; mw.classList.toggle('today', c === 'today');
      if (c === 'today') { far = false; mw.classList.remove('far'); $('#mini').classList.remove('folded'); query = ''; hl = ''; closePanel(); }
      if (model) { relayout(); loadSavedPos(); renderAll(); fitStart(false); }
    },
    focus(id) { if (model && model.byId.has(id)) { openChapter(id); centerOn(id); } },
    refit() { if (model) fit(null, false); },
    model() { return model; },
    closePanel() { if (!panel.hidden) closePanel(); },
    showTrail(t) {
      trail = t && t.length ? t : null;
      nodesEl.querySelectorAll('.node').forEach((n) => { n.classList.toggle('trail', !!trail && trail.includes(n.dataset.id)); n.classList.toggle('now', !!trail && trail[trail.length - 1] === n.dataset.id); });
      mw.classList.toggle('tracing', !!trail);
      renderEdges(); markSelection();
      if (trail && window.innerWidth >= 760) centerOn(trail[trail.length - 1], Math.max(view.s, 0.7));
    },
  };
}
