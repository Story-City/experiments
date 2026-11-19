// Map tab: the cleaned-up story map (and a "Today" look to compare).
export function createMapView(root, ctx) {
  const { icon, layout, findIssues, nodeHeight, NODE_W, HEAD_H, toast } = ctx;
  const esc = ctx.esc;
  const FAR_AT = 0.62;

  root.innerHTML = `
    <div class="mapwrap" id="mw">
      <div class="world" id="world"><svg class="edges" id="edges"></svg><div id="nodes"></div></div>
      <div class="toolbar" id="tb"></div>
      <div class="stops" id="stops"></div>
      <div class="zoom">
        <button class="iconbtn" data-z="in" aria-label="Zoom in">${icon('plus')}</button>
        <button class="iconbtn" data-z="out" aria-label="Zoom out">${icon('minus')}</button>
        <button class="iconbtn" data-z="fit" aria-label="Fit to screen">${icon('fit')}</button>
      </div>
      <div class="zoomlvl" id="zl"></div>
      <div class="mini" id="mini"><button class="mini__bar" id="miniBar">${icon('layers', 14)} Overview <span style="flex:1"></span>${icon('chevron', 14)}</button><canvas id="miniC" width="440" height="260" style="width:220px;height:130px"></canvas></div>
      <aside class="panel" id="panel" hidden></aside>
    </div>`;
  const $ = (s) => root.querySelector(s);
  const mw = $('#mw'); const world = $('#world'); const edgesEl = $('#edges'); const nodesEl = $('#nodes');
  const panel = $('#panel'); const tb = $('#tb');

  let model = null; let pos = new Map(); let back = new Set(); let rows = [];
  function relayout() { const L = layout(model, { rows: compare !== 'today' }); pos = L.xy; back = L.back; rows = L.rows; }
  let view = { x: 40, y: 120, s: 1 };
  let sel = null; let compare = 'clean'; let lang = 'en'; let onlyMissing = false; let far = false;
  let panelMode = null; let newCount = 0;

  const today = () => compare === 'today';
  const colourOf = (c) => (c.stop >= 0 && model.stops[c.stop] ? model.stops[c.stop].colour : { c: '#B0B7C6', bg: '#F6F7F9' });
  const issues = () => findIssues(model, lang).filter((i) => !today() || i.kind === 'block');
  const titleOf = (c) => (today() ? c.name : c.title);
  const frMissing = (c) => c.fr == null;

  // ---------- render ----------
  function nodeHTML(c) {
    const p = pos.get(c.id); const col = colourOf(c);
    const iss = findIssues({ ...model, chapters: [c] }, 'en').filter((i) => i.kind !== 'fr' && (!today() || i.kind === 'block')).length;
    const badges = [
      c.start ? `<span class="node__badge b-start">${icon('play', 10)} START</span>` : '',
      c.end ? `<span class="node__badge b-end">${icon('flag', 10)} END</span>` : '',
      c.score ? `<span class="node__badge b-score" title="Score-based">${icon('score', 10)} ${esc(c.score === 'pts' ? 'points' : c.score)}</span>` : '',
      iss ? `<span class="node__badge b-issue">${icon('alert', 10)} ${iss}</span>` : '',
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
      ? c.choices.map((k, i) => `<div class="choice ${k.to ? '' : 'broken'}" data-ci="${i}">${icon(k.to ? 'arrow' : 'alert', 13)}<span>${esc(k.label || '(no label)')}</span></div>`).join('')
      : `<div class="choice none">${icon(c.end ? 'flag' : 'alert', 13)}<span>${c.end ? 'Story ends here' : 'No choices yet'}</span></div>`;
    const dim = lang === 'fr' && onlyMissing && !frMissing(c);
    return `<div class="node ${sel === c.id ? 'sel' : ''} ${dim ? 'dim' : ''}" data-id="${c.id}" style="left:${p.x}px;top:${p.y}px;height:${nodeHeight(c)}px;--sc:${col.c};--sbg:${col.bg}">
      <div class="node__head" style="height:${far ? '100%' : HEAD_H + 'px'}">
        <div class="node__top">${badges}<span class="node__code">${esc(c.code || '')}</span></div>
        <div class="node__title ${c.untitled && !today() ? 'untitled' : ''}" title="${esc(c.name)}">${esc(titleOf(c))}</div>
        <div class="node__icons">${icons}</div>
      </div>
      <div class="node__choices">${choices}</div>
    </div>`;
  }

  function stopLabels() {
    if (today()) return '';
    return model.stops.map((s, i) => {
      const p = pos.get(s.first); if (!p) return '';
      return `<div class="stoplabel" style="left:${p.x}px;top:${(rows[p.row] ? rows[p.row].top : p.y) - 12}px;transform:translateY(-100%);--sc:${s.colour.c}">${i + 1}. ${esc(s.name)}</div>`;
    }).join('');
  }

  function renderNodes() {
    nodesEl.innerHTML = model.chapters.map(nodeHTML).join('') + stopLabels();
    renderEdges();
  }

  // Rounded elbow path through a list of points
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
    if (x2 > x1 + 10 || a.row == null || a.row < 0 || b.row < 0 || !rows.length) {
      if (x2 > x1 + 10) {
        const dx = Math.max(40, (x2 - x1) / 2);
        return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
      }
      const top = Math.min(y1, y2) - (90 + Math.abs(y2 - y1) * 0.15);
      return `M${x1},${y1} C${x1 + 90},${top} ${x2 - 90},${top} ${x2},${y2}`;
    }
    const gy = b.row > a.row
      ? rows[a.row].bottom + 46
      : rows[b.row].top - 34;
    return elbow([[x1, y1], [x1 + 26, y1], [x1 + 26, gy], [x2 - 30, gy], [x2 - 30, y2], [x2, y2]]);
  }

  function renderEdges() {
    let minX = 0; let minY = 0; let maxX = 0; let maxY = 0;
    for (const p of pos.values()) { maxX = Math.max(maxX, p.x + NODE_W + 200); maxY = Math.max(maxY, p.y + p.h + 200); minY = Math.min(minY, p.y - 300); }
    edgesEl.setAttribute('width', maxX - minX); edgesEl.setAttribute('height', maxY - minY);
    edgesEl.style.left = minX + 'px'; edgesEl.style.top = minY + 'px';
    edgesEl.setAttribute('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
    const out = []; const labels = [];
    const done = new Set();
    for (const c of model.chapters) {
      const a = pos.get(c.id); if (!a) continue;
      const col = today() ? '#9CCBEF' : colourOf(c).c;
      c.choices.forEach((k, i) => {
        if (!k.to || !pos.has(k.to)) return;
        const b = pos.get(k.to);
        const key = c.id + '>' + k.to;
        if (far && done.has(key)) return;
        done.add(key);
        const x1 = a.x + NODE_W; const y1 = far ? a.y + a.h / 2 : a.y + HEAD_H + 4 + i * 24 + 12;
        const x2 = b.x; const y2 = far ? b.y + b.h / 2 : b.y + HEAD_H / 2;
        const isBack = back.has(key) || (x2 <= x1 + 10 && !(b.row > a.row));
        out.push(`<path class="edge ${isBack ? 'back' : ''} ${sel && (sel === c.id || sel === k.to) ? 'hot' : ''}" data-from="${c.id}" data-to="${k.to}" data-ci="${i}" stroke="${col}" d="${edgePath(a, b, x1, y1, x2, y2)}"/>`);
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
    const label = !list.length ? 'Nothing to fix' : `${list.length} to check`;
    tb.innerHTML = `
      <button class="btn btn--fill" id="tidy">${icon('wand')}<span class="txt">Tidy up</span></button>
      <button class="btn" id="fit">${icon('fit')}<span class="txt">Fit</span></button>
      <button class="btn" id="add">${icon('plus')}<span class="txt">Chapter</span></button>
      <button class="btn ${cls}" id="iss">${icon(list.length ? 'alert' : 'check')}<span class="txt keep">${label}</span></button>
      ${lang === 'fr' && !today() ? `<button class="chipbtn" id="onlyFr" aria-pressed="${onlyMissing}">${frN ? `Only missing French · ${frN}` : 'French done ✓'}</button>` : ''}
      <button class="iconbtn" id="help" aria-label="What changed">${icon('help', 18)}</button>`;
  }

  function renderStops() {
    $('#stops').innerHTML = today() ? '' : model.stops.map((s, i) =>
      `<button class="stopchip" data-stop="${i}" title="Show this stop">${'<i style="background:' + s.colour.c + '"></i>'}<span>${i + 1}. ${esc(s.name)}</span></button>`).join('');
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

  // ---------- geometry ----------
  function bounds(ids) {
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    for (const id of ids || pos.keys()) {
      const p = pos.get(id); if (!p) continue;
      x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x + NODE_W); y1 = Math.max(y1, p.y + p.h);
    }
    return { x0, y0, x1, y1 };
  }
  function fit(ids, animate = true, maxS = 1.1) {
    const b = bounds(ids); const r = mw.getBoundingClientRect();
    const topPad = r.width < 760 ? 110 : 140; const side = 30;
    const panelW = !panel.hidden && r.width >= 760 ? 360 : 0;
    const w = r.width - side * 2 - panelW; const h = r.height - topPad - 30;
    const s = Math.max(0.06, Math.min(maxS, w / (b.x1 - b.x0), h / (b.y1 - b.y0)));
    view = { s, x: side + (w - (b.x1 - b.x0) * s) / 2 - b.x0 * s, y: topPad + (h - (b.y1 - b.y0) * s) / 2 - b.y0 * s };
    applyView(animate);
  }
  // Opening view: whole story if it's readable, otherwise full width from the top
  function fitStart(animate) {
    const b = bounds(); const r = mw.getBoundingClientRect();
    const topPad = r.width < 760 ? 110 : 130; const side = 30;
    const w = r.width - side * 2; const h = r.height - topPad - 30;
    const all = Math.min(1.1, w / (b.x1 - b.x0), h / (b.y1 - b.y0));
    if (all >= 0.42 || today()) return fit(null, animate);
    const s = Math.max(all, Math.min(0.58, w / (b.x1 - b.x0)));
    view = { s, x: side + Math.max(0, (w - (b.x1 - b.x0) * s) / 2) - b.x0 * s, y: topPad + 20 - b.y0 * s };
    applyView(animate);
  }
  function centerOn(id, s) {
    const p = pos.get(id); const r = mw.getBoundingClientRect();
    const panelW = !panel.hidden && r.width >= 760 ? 360 : 0;
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

  // ---------- minimap ----------
  const miniC = $('#miniC');
  function miniScale() {
    const b = bounds(); const W = miniC.width; const H = miniC.height;
    const s = Math.min((W - 20) / (b.x1 - b.x0), (H - 20) / (b.y1 - b.y0));
    return { b, s, ox: 10 - b.x0 * s + (W - 20 - (b.x1 - b.x0) * s) / 2, oy: 10 - b.y0 * s + (H - 20 - (b.y1 - b.y0) * s) / 2 };
  }
  function drawMini() {
    if (!model || $('#mini').classList.contains('folded') && !today()) return;
    const g = miniC.getContext('2d'); const { s, ox, oy } = miniScale();
    g.clearRect(0, 0, miniC.width, miniC.height);
    g.fillStyle = '#F7F8FB'; g.fillRect(0, 0, miniC.width, miniC.height);
    for (const c of model.chapters) {
      const p = pos.get(c.id); if (!p) continue;
      g.fillStyle = today() ? '#5DA9E9' : colourOf(c).c;
      g.fillRect(ox + p.x * s, oy + p.y * s, Math.max(2, NODE_W * s), Math.max(2, p.h * s));
    }
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
  function openChapter(id) {
    sel = id; panelMode = 'chapter';
    const c = model.byId.get(id); const col = colourOf(c);
    const stop = c.stop >= 0 ? model.stops[c.stop] : null;
    const from = preds(id);
    const facts = [
      c.loc ? `<span class="fact">${icon('pin', 14)} Location on${c.place ? ': ' + esc(c.place) : ''}</span>` : `<span class="fact">${icon('pinOff', 14)} Location off</span>`,
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
          <div class="small muted">${esc(c.code || 'Chapter')}${stop ? ` · Stop ${c.stop + 1}: ${esc(stop.name)}` : ''}</div>
          <h2 id="pTitle">${esc(titleOf(c))}</h2>
        </div>
        <button class="iconbtn" id="pRename" aria-label="Rename">${icon('pencil')}</button>
        <button class="iconbtn" id="pClose" aria-label="Close">${icon('close')}</button>
      </div>
      <div class="panel__body">
        ${myIssues.length ? `<h3>To check</h3>${myIssues.map((i) => `<div class="issue ${i.kind} small">${icon('alert', 15)}<span>${esc(i.text)}</span></div>`).join('')}` : ''}
        <h3>In this chapter</h3><div class="facts">${facts}</div>
        <h3>Opening lines</h3><div class="quote">${esc(c.text || '(no text yet)')}</div>
        <h3>French</h3>${c.fr == null ? '<div class="quote missing">No French yet.</div>' : `<div class="quote fr">${esc(c.fr)}</div>`}
        <h3>Choices</h3><div class="golist">${c.choices.length ? c.choices.map((k) => {
          const t = k.to && model.byId.get(k.to);
          return `<button data-go="${k.to || ''}" ${t ? '' : 'disabled'}>${icon(t ? 'arrow' : 'alert', 15)}<span class="lbl">${esc(k.label || '(no label)')}${k.needs ? ` <span class="needs">${icon('lock', 11)} ${esc(k.needs)}</span>` : ''}<br><span class="to">${t ? esc(titleOf(t)) : 'Goes nowhere yet'}</span></span></button>`;
        }).join('') : `<span class="muted small">${c.end ? 'This is an ending.' : 'No choices yet.'}</span>`}</div>
        <h3>Comes from</h3><div class="golist">${from.length ? from.map((f) => `<button data-go="${f.id}">${icon('arrow', 15)}<span class="lbl">${esc(titleOf(f))}</span></button>`).join('') : `<span class="muted small">${c.start ? 'This is where the story starts.' : 'Nothing leads here yet.'}</span>`}</div>
      </div>
      <div class="panel__foot">
        <button class="btn btn--fill" id="pOpen">${icon('open')} Open chapter</button>
        <button class="btn" id="pScript">${icon('script')} In script</button>
      </div>`;
    panel.hidden = false;
    mw.classList.add('has-sel');
    markSelection();
  }

  function openIssues() {
    sel = null; panelMode = 'issues'; markSelection(); mw.classList.remove('has-sel');
    const list = issues();
    const fr = list.filter((i) => i.kind === 'fr'); const rest = list.filter((i) => i.kind !== 'fr');
    panel.style.setProperty('--sbg', '#fff');
    panel.innerHTML = `
      <div class="panel__head"><h2>${rest.length ? `${rest.length} to check` : 'Nothing to fix'}</h2><button class="iconbtn" id="pClose" aria-label="Close">${icon('close')}</button></div>
      <div class="panel__body">
        ${!rest.length ? '<p class="muted">Every chapter can be reached, every choice goes somewhere, and every chapter has a readable name.</p>' : ''}
        ${rest.length ? `<h3>Story</h3><div class="golist">${rest.map((i) => `<button data-go="${i.id}" class="issue ${i.kind}">${icon('alert', 15)}<span class="lbl">${esc(i.text)}</span></button>`).join('')}</div>` : ''}
        ${fr.length ? `<h3>French</h3><p class="small">${fr.length} of ${model.chapters.length} chapters need French.</p><button class="chipbtn" id="pOnlyFr" aria-pressed="${onlyMissing}">Show only those</button>` : ''}
        <h3>Key</h3>
        <div class="small" style="line-height:1.7">${icon('alert', 14, '')} <b style="color:var(--bad)">Red</b> stops the story publishing.<br>${icon('alert', 14)} <b style="color:#A66B00">Amber</b> is worth checking (new in this mockup: chapters with only a code for a name).</div>
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

  panel.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.id === 'pClose') return closePanel();
    if (t.dataset.go) { openChapter(t.dataset.go); centerOn(t.dataset.go); return; }
    if (t.id === 'pOpen') return toast('In Creator Tools this opens the chapter editor.');
    if (t.id === 'pScript') return ctx.showInScript(sel);
    if (t.id === 'pOnlyFr') { onlyMissing = !onlyMissing; renderAll(); openIssues(); return; }
    if (t.id === 'pRename') {
      const c = model.byId.get(sel); const h = panel.querySelector('#pTitle');
      h.innerHTML = `<input class="rename" id="pIn" value="${esc(c.title)}" maxlength="60">`;
      const inp = panel.querySelector('#pIn'); inp.focus(); inp.select();
      const done = () => { const v = inp.value.trim(); if (v) { c.title = v; c.untitled = false; } renderAll(); openChapter(c.id); };
      inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') done(); if (ev.key === 'Escape') openChapter(c.id); });
      inp.addEventListener('blur', done);
    }
  });

  // ---------- toolbar ----------
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || !root.contains(b) || panel.contains(b)) return;
    if (b.id === 'tidy') {
      relayout();
      world.classList.add("anim"); renderNodes(); fitStart(true);
      toast('Tidied: chapters lined up by step from the start, endings in one column.');
    }
    if (b.id === 'fit' || b.dataset.z === 'fit') fit(null, true);
    if (b.dataset.z === 'in' || b.dataset.z === 'out') { const r = mw.getBoundingClientRect(); zoomAt(b.dataset.z === 'in' ? 1.25 : 0.8, r.width / 2, r.height / 2); }
    if (b.id === 'add') addChapter();
    if (b.id === 'iss') openIssues();
    if (b.id === 'onlyFr') { onlyMissing = !onlyMissing; renderAll(); }
    if (b.id === 'help') ctx.openAbout();
    if (b.dataset.stop) {
      const i = +b.dataset.stop;
      fit(model.chapters.filter((c) => c.stop === i).map((c) => c.id), true, 1);
    }
  });

  function addChapter() {
    newCount++;
    const r = mw.getBoundingClientRect();
    const c = { id: 'n' + newCount, name: 'New chapter', title: 'New chapter', code: '', choices: [], start: false, end: false, loc: false, audio: 0, video: 0, image: 0, puzzle: false, chat: 0, text: '', fr: null, reached: false, stop: -1, untitled: false };
    model.chapters.push(c); model.byId.set(c.id, c);
    const wx = (r.width / 2 - view.x) / view.s - NODE_W / 2; const wy = (r.height / 2 - view.y) / view.s - 60;
    pos.set(c.id, { x: wx, y: wy, h: nodeHeight(c) });
    renderAll(); openChapter(c.id);
    toast('New chapter added. Drag it where you like, then add a choice that leads to it.');
  }

  // ---------- pointer: pan, drag nodes, pinch ----------
  const pts = new Map(); let drag = null; let pinch = null;
  mw.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.toolbar, .zoom, .mini, .panel, .stops')) return;
    mw.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: view.s }; drag = null; return;
    }
    const node = e.target.closest('.node');
    drag = { node: node ? node.dataset.id : null, sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y, moved: false, p0: node ? { ...pos.get(node.dataset.id) } : null };
    world.classList.remove('anim');
  });
  mw.addEventListener('pointermove', (e) => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pts.size === 2) {
      const [a, b] = [...pts.values()]; const r = mw.getBoundingClientRect();
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((pinch.s * d / pinch.d) / view.s, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); return;
    }
    if (!drag) return;
    const dx = e.clientX - drag.sx; const dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
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
    if (drag && !drag.moved) {
      if (drag.node) { openChapter(drag.node); } else if (!panel.hidden && panelMode === 'chapter') closePanel();
    }
    if (drag && drag.moved && drag.node) drawMini();
    drag = null;
  };
  mw.addEventListener('pointerup', end); mw.addEventListener('pointercancel', end);
  mw.addEventListener('wheel', (e) => {
    if (e.target.closest('.panel')) return;
    e.preventDefault(); const r = mw.getBoundingClientRect();
    zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  // Hover a choice row: light up its line
  nodesEl.addEventListener('pointerover', (e) => {
    const row = e.target.closest('.choice'); if (!row) return;
    const id = row.closest('.node').dataset.id;
    edgesEl.querySelectorAll(`.edge[data-from="${id}"][data-ci="${row.dataset.ci}"]`).forEach((p) => p.classList.add('hot'));
  });
  nodesEl.addEventListener('pointerout', (e) => { if (e.target.closest('.choice')) markSelection(); });
  window.addEventListener('resize', () => drawMini());

  function renderAll() { renderToolbar(); renderStops(); renderNodes(); markSelection(); drawMini(); }

  return {
    show(m) {
      model = m; sel = null; panel.hidden = true; mw.classList.remove('has-sel'); onlyMissing = false;
      relayout();
      far = false; mw.classList.remove('far');
      renderAll(); requestAnimationFrame(() => fitStart(false));
    },
    setLang(l) { lang = l; if (model) { renderAll(); if (panelMode === 'chapter' && sel) openChapter(sel); if (panelMode === 'issues') openIssues(); } },
    setCompare(c) {
      compare = c; mw.classList.toggle('today', c === 'today');
      if (c === 'today') { far = false; mw.classList.remove('far'); $('#mini').classList.remove('folded'); }
      if (model) { relayout(); renderAll(); fitStart(false); if (panelMode === 'chapter' && sel) openChapter(sel); }
    },
    focus(id) { if (model && model.byId.has(id)) { openChapter(id); centerOn(id); } },
    refit() { if (model) fit(null, false); },
  };
}
