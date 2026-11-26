// Figma-light studio as a drop-in add-on: a Move panel in an experiment's tool rail that selects, drags,
// resizes, centres and locks pieces inside the phone, with undo / redo and autosave in this browser.
// Same idea as Victoria's location-gems tools, packaged so any experiment can load it with one script:
//
//   <script src="../shared/figma-light-studio/studio.js"></script>
//   <script>FigmaLightStudio.mount({ rail: '.debug-rail', storage: 'my-experiment', target: () => ({ key: 'v1', root: document.getElementById('phone') }) });</script>
//
// target() is asked again every half second, so it can point into an iframe (same site) and follow a
// version switch. Each target key gets its own saved moves. `look` (optional) is a selector for the
// rail's Look inputs, saved and restored too. Moves use the CSS translate and scale properties, which
// add to whatever transform the page already sets instead of replacing it.
(function () {
  const DRAG_PX = 5;
  const HISTORY_MAX = 40;
  const SIZE_MIN = 40, SIZE_MAX = 220;
  // what a first click selects: the nearest of these around the hit (an icon alone needs Alt-click)
  const BLOCK_SEL = 'button, a, li, section, header, footer, article, aside, nav, label, [role="button"], [role="group"], .pin, .chip';
  const STYLE_ID = 'fls-style';
  const TARGET_CSS = `
    .fls-move { cursor: crosshair; user-select: none; -webkit-user-select: none; }
    .fls-move .fls-hover { outline: 1px dashed rgba(0, 194, 255, .6); outline-offset: 2px; }
    .fls-move .fls-sel { outline: 2px solid #00c2ff; outline-offset: 3px; box-shadow: 0 0 0 4px rgba(0, 194, 255, .25); cursor: grab; }
    .fls-move .fls-sel.fls-dragging { cursor: grabbing; }
    .fls-move .fls-locked { outline: 2px dashed rgba(255, 180, 80, .9); outline-offset: 3px; cursor: not-allowed; }`;
  const RAIL_CSS = `
    .fls-block .fls-label { margin: 2px 0 8px; font-size: 12px; opacity: .8; overflow-wrap: anywhere; }
    .fls-block .fls-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0; }
    .fls-block .fls-row button { flex: 1 1 auto; min-height: 30px; padding: 0 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.06); color: inherit; font: inherit; font-size: 12px; cursor: pointer; }
    .fls-block .fls-row button:disabled { opacity: .4; cursor: default; }
    .fls-block .fls-note { margin: 6px 0 0; font-size: 11px; opacity: .65; }`;

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private window: session only */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* fine */ } },
  };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  function mount(opts) {
    const rail = typeof opts.rail === 'string' ? document.querySelector(opts.rail) : opts.rail;
    if (!rail) return null;
    if (!document.getElementById(STYLE_ID + '-rail')) { const s = el('style'); s.id = STYLE_ID + '-rail'; s.textContent = RAIL_CSS; document.head.append(s); }

    let on = false;
    let cur = null; // { key, root, doc }
    let moves = {}; // key path -> { x, y, s, locked }
    let sel = new Set();
    let hist = [], at = -1;
    let drag = null, pending = null, hover = null, observer = null, reapplyQueued = false;
    const movesKey = () => `${opts.storage}:moves:${cur ? cur.key : ''}`;
    const lookKey = () => `${opts.storage}:look`;

    /* ---------- the panel ---------- */
    const block = el('section', 'tool-block fls-block');
    block.append(el('h2', 'tool-title', 'Move'));
    const toggle = el('div', 'tool-toggle');
    const sw = el('button', 'switch'); sw.type = 'button'; sw.setAttribute('role', 'switch'); sw.setAttribute('aria-checked', 'false'); sw.setAttribute('aria-label', 'Select and drag');
    sw.append(Object.assign(el('span', 'switch-knob'), { ariaHidden: 'true' }));
    toggle.append(el('span', null, 'Select & drag'), sw);
    const label = el('p', 'fls-label', 'Off');
    const sizeRow = el('label', 'accent-pick is-rail');
    const size = Object.assign(el('input'), { type: 'range', min: SIZE_MIN, max: SIZE_MAX, value: 100 });
    size.setAttribute('aria-label', 'Size of the selected piece');
    const sizeVal = el('span', 'tool-value', '100%');
    sizeRow.append(el('span', null, 'Size'), size, sizeVal);
    const btn = (text, title, fn) => { const b = el('button', null, text); b.type = 'button'; b.title = title; b.addEventListener('click', fn); return b; };
    const rowSel = el('div', 'fls-row');
    rowSel.append(btn('Parent', 'Select the piece around this one', () => pickParent()), btn('↔ Centre', 'Centre across the phone', () => centre('x')), btn('↕ Centre', 'Centre down the phone', () => centre('y')));
    const lockBtn = btn('Lock', 'Lock or unlock the selected pieces', () => toggleLock());
    const rowEdit = el('div', 'fls-row');
    rowEdit.append(lockBtn, btn('Reset piece', 'Put the selected pieces back', () => resetSel()));
    const undoBtn = btn('← Undo', 'Undo', () => step(-1));
    const redoBtn = btn('Redo →', 'Redo', () => step(1));
    const rowHist = el('div', 'fls-row');
    rowHist.append(undoBtn, redoBtn, btn('Reset all', 'Put every piece in this version back', () => resetAll()));
    const note = el('p', 'fls-note', 'Click a piece, click again to go deeper. Alt-click picks the smallest piece, Shift adds. Arrows nudge. Saves in this browser, per version.');
    block.append(toggle, label, sizeRow, rowSel, rowEdit, rowHist, note);
    rail.append(block);

    /* ---------- keys and moves ---------- */
    function keyOf(node) {
      const parts = [];
      for (let n = node; n && n !== cur.root; n = n.parentElement) {
        if (n.id) { parts.unshift('#' + n.id); break; }
        const sibs = n.parentElement ? [...n.parentElement.children].filter((c) => c.tagName === n.tagName) : [n];
        parts.unshift(n.tagName.toLowerCase() + ':' + sibs.indexOf(n));
      }
      return parts.join('>');
    }
    function nodeOf(key) {
      let n = cur.root;
      for (const part of key.split('>')) {
        if (!n) return null;
        if (part.startsWith('#')) { n = cur.doc.getElementById(part.slice(1)); if (n && !cur.root.contains(n)) return null; continue; }
        const [tag, i] = part.split(':');
        n = [...n.children].filter((c) => c.tagName.toLowerCase() === tag)[Number(i)] || null;
      }
      return n;
    }
    function paint(node, m) {
      const x = m && m.x ? m.x : 0, y = m && m.y ? m.y : 0, s = m && m.s ? m.s : 100;
      const t = x || y ? `${x}px ${y}px` : '';
      const sc = s !== 100 ? String(s / 100) : '';
      if (node.style.translate !== t) node.style.translate = t;
      if (node.style.scale !== sc) node.style.scale = sc;
      node.classList.toggle('fls-locked', !!(m && m.locked) && on);
    }
    function reapply() {
      reapplyQueued = false;
      if (!cur) return;
      for (const [k, m] of Object.entries(moves)) { const n = nodeOf(k); if (n) paint(n, m); }
    }
    const queueReapply = () => { if (!reapplyQueued && cur) { reapplyQueued = true; cur.doc.defaultView.requestAnimationFrame(reapply); } };
    const moveOf = (n) => moves[keyOf(n)] || {};
    function setMove(n, patch) {
      const k = keyOf(n);
      const m = { ...moves[k], ...patch };
      if (!m.x && !m.y && (!m.s || m.s === 100) && !m.locked) delete moves[k]; else moves[k] = m;
      paint(n, moves[k]);
    }
    function save() { store.set(movesKey(), moves); saveLook(); remember(); }

    /* ---------- undo / redo (this tab only) ---------- */
    function remember() {
      const snap = JSON.stringify(moves);
      if (hist[at] === snap) return syncButtons();
      hist = hist.slice(0, at + 1); hist.push(snap);
      if (hist.length > HISTORY_MAX) hist.shift();
      at = hist.length - 1; syncButtons();
    }
    function step(d) {
      const i = at + d;
      if (i < 0 || i >= hist.length) return;
      at = i;
      const before = Object.keys(moves);
      moves = JSON.parse(hist[at]);
      for (const k of before) if (!moves[k]) { const n = nodeOf(k); if (n) paint(n, null); }
      reapply(); store.set(movesKey(), moves); syncButtons(); syncPanel();
    }
    function syncButtons() { undoBtn.disabled = at <= 0; redoBtn.disabled = at < 0 || at >= hist.length - 1; }

    /* ---------- Look inputs (shared by every version) ---------- */
    const lookInputs = () => (opts.look ? [...document.querySelectorAll(opts.look)] : []);
    function saveLook() { const v = {}; for (const i of lookInputs()) if (i.id) v[i.id] = i.value; if (Object.keys(v).length) store.set(lookKey(), v); }
    function loadLook() {
      const v = store.get(lookKey());
      if (!v) return;
      for (const i of lookInputs()) if (i.id in v && i.value !== v[i.id]) { i.value = v[i.id]; i.dispatchEvent(new Event('input', { bubbles: true })); }
    }
    for (const i of lookInputs()) i.addEventListener('change', saveLook);

    /* ---------- selection ---------- */
    function nameOf(n) {
      const cls = [...n.classList].find((c) => !c.startsWith('fls-') && !c.startsWith('is-'));
      const text = (n.getAttribute('aria-label') || n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28);
      return (n.id ? '#' + n.id : n.tagName.toLowerCase() + (cls ? '.' + cls : '')) + (text ? ` "${text}"` : '');
    }
    function syncPanel() {
      const list = [...sel].filter((n) => n.isConnected);
      label.textContent = !on ? 'Off' : !list.length ? 'Nothing selected' : list.length === 1 ? nameOf(list[0]) : `${list.length} selected · edits all`;
      const sizes = list.map((n) => moveOf(n).s || 100);
      const same = sizes.length && sizes.every((s) => s === sizes[0]);
      size.value = same ? sizes[0] : 100; sizeVal.textContent = !list.length ? '–' : same ? `${sizes[0]}%` : 'mix';
      const locked = list.length && list.every((n) => moveOf(n).locked);
      lockBtn.textContent = locked ? 'Unlock' : 'Lock';
      for (const b of [...rowSel.children, lockBtn, rowEdit.lastChild]) b.disabled = !list.length;
      size.disabled = !list.length;
    }
    function select(n, add) {
      if (!add) { sel.forEach((x) => x.classList.remove('fls-sel')); sel.clear(); }
      if (add && sel.has(n)) { sel.delete(n); n.classList.remove('fls-sel'); } else if (n) { sel.add(n); n.classList.add('fls-sel'); }
      syncPanel();
    }
    function clearSel() { sel.forEach((x) => x.classList.remove('fls-sel', 'fls-dragging')); sel.clear(); syncPanel(); }
    function hitNode(t) {
      let n = t && t.nodeType === 1 ? t : t && t.parentElement;
      while (n && n.ownerSVGElement) n = n.ownerSVGElement; // inside an icon: the whole svg
      return n && cur.root.contains(n) && n !== cur.root ? n : null;
    }
    function blockOf(n) { const b = n.closest(BLOCK_SEL); return b && cur.root.contains(b) && b !== cur.root ? b : n; }
    function digFrom(selected, hit) { let n = hit; while (n.parentElement && n.parentElement !== selected) n = n.parentElement; return n.parentElement === selected ? n : null; }
    function pickParent() { const [n] = sel; if (n && n.parentElement && n.parentElement !== cur.root && cur.root.contains(n.parentElement)) select(n.parentElement, false); }

    /* ---------- edits ---------- */
    function centre(axis) {
      const pr = cur.root.getBoundingClientRect();
      sel.forEach((n) => {
        const m = moveOf(n); if (m.locked) return;
        const r = n.getBoundingClientRect();
        const patch = {};
        if (axis === 'x') patch.x = Math.round((m.x || 0) + pr.left + pr.width / 2 - (r.left + r.width / 2));
        if (axis === 'y') patch.y = Math.round((m.y || 0) + pr.top + pr.height / 2 - (r.top + r.height / 2));
        setMove(n, patch);
      });
      save();
    }
    function toggleLock() { const lock = ![...sel].every((n) => moveOf(n).locked); sel.forEach((n) => setMove(n, { locked: lock || undefined })); save(); syncPanel(); }
    function resetSel() { sel.forEach((n) => { if (!moveOf(n).locked) setMove(n, { x: 0, y: 0, s: 100 }); }); save(); syncPanel(); }
    function resetAll() {
      for (const k of Object.keys(moves)) { const n = nodeOf(k); if (n) paint(n, null); }
      moves = {}; store.del(movesKey()); remember(); syncPanel();
    }
    size.addEventListener('input', () => { const s = Number(size.value); sel.forEach((n) => { if (!moveOf(n).locked) setMove(n, { s }); }); sizeVal.textContent = `${s}%`; });
    size.addEventListener('change', save);

    /* ---------- pointer and keys inside the phone ---------- */
    const inPhone = (e) => cur && cur.root.contains(e.target);
    function onDown(e) {
      if (!on || !inPhone(e) || e.button > 0) return;
      e.preventDefault(); e.stopPropagation();
      const hit = hitNode(e.target); if (!hit) return;
      const [only] = sel;
      let n;
      if (e.altKey) n = hit;
      else if (sel.size === 1 && only.contains(hit) && only !== hit) n = digFrom(only, hit) || only;
      else if (sel.has(hit) || [...sel].some((s) => s.contains(hit))) n = [...sel].find((s) => s.contains(hit));
      else n = blockOf(hit);
      if (!sel.has(n) || e.shiftKey) select(n, e.shiftKey);
      pending = { x: e.clientX, y: e.clientY };
    }
    function onMove(e) {
      if (!on || !cur) return;
      if (pending && !drag && Math.hypot(e.clientX - pending.x, e.clientY - pending.y) >= DRAG_PX) {
        drag = { x: pending.x, y: pending.y, from: [...sel].filter((n) => !moveOf(n).locked).map((n) => ({ n, ...moveOf(n) })) };
        drag.from.forEach(({ n }) => n.classList.add('fls-dragging'));
      }
      if (drag) {
        e.preventDefault();
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        drag.from.forEach(({ n, x = 0, y = 0 }) => setMove(n, { x: Math.round(x + dx), y: Math.round(y + dy) }));
        return;
      }
      if (inPhone(e)) {
        const h = hitNode(e.target); const b = h && (e.altKey ? h : blockOf(h));
        if (hover !== b) { if (hover) hover.classList.remove('fls-hover'); hover = b; if (b && !sel.has(b)) b.classList.add('fls-hover'); }
      }
    }
    function onUp() {
      pending = null;
      if (!drag) return;
      drag.from.forEach(({ n }) => n.classList.remove('fls-dragging'));
      drag = null; save();
    }
    const swallow = (e) => { if (on && inPhone(e)) { e.preventDefault(); e.stopPropagation(); } };
    function onKey(e) {
      if (!on || !sel.size || /input|textarea|select/i.test(e.target.tagName || '')) return;
      if (e.key === 'Escape') { clearSel(); return; }
      const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (!d) return;
      e.preventDefault();
      const k = e.shiftKey ? 10 : 1;
      sel.forEach((n) => { const m = moveOf(n); if (!m.locked) setMove(n, { x: (m.x || 0) + d[0] * k, y: (m.y || 0) + d[1] * k }); });
      clearTimeout(onKey.t); onKey.t = setTimeout(save, 400);
    }
    const EVENTS = [['pointerdown', onDown], ['pointermove', onMove], ['pointerup', onUp], ['pointercancel', onUp], ['click', swallow], ['dblclick', swallow], ['mousedown', swallow], ['touchstart', swallow], ['keydown', onKey]];
    // keydown on the rail's page too, so arrows still nudge after clicking a panel button.
    // Adding the same listener twice to one page is a no-op, so this is safe when the phone is on it.
    document.addEventListener('keydown', onKey, true);
    function listen(doc, add) {
      for (const [t, fn] of EVENTS) {
        if (!add && doc === document && t === 'keydown') continue;
        doc[add ? 'addEventListener' : 'removeEventListener'](t, fn, { capture: true, passive: false });
      }
    }

    /* ---------- following the target (version switch, iframe reloads) ---------- */
    function attach(t) {
      if (cur) { listen(cur.doc, false); if (observer) observer.disconnect(); cur.root.classList.remove('fls-move'); if (hover) hover.classList.remove('fls-hover'); }
      clearSel(); hover = null; drag = null; pending = null;
      cur = t ? { ...t, doc: t.root.ownerDocument } : null;
      if (!cur) return syncPanel();
      if (!cur.doc.getElementById(STYLE_ID)) { const s = cur.doc.createElement('style'); s.id = STYLE_ID; s.textContent = TARGET_CSS; cur.doc.head.append(s); }
      listen(cur.doc, true);
      cur.root.classList.toggle('fls-move', on);
      moves = store.get(movesKey()) || {};
      hist = []; at = -1; remember();
      observer = new cur.doc.defaultView.MutationObserver(queueReapply);
      observer.observe(cur.root, { childList: true, subtree: true });
      reapply(); syncPanel();
    }
    function check() {
      let t = null;
      try { t = opts.target(); } catch (e) { t = null; }
      if (t && !t.root) t = null;
      if ((t && t.root) !== (cur && cur.root) || (t && t.key) !== (cur && cur.key)) attach(t);
    }
    sw.addEventListener('click', () => {
      on = !on; sw.setAttribute('aria-checked', String(on));
      if (cur) cur.root.classList.toggle('fls-move', on);
      if (!on) { clearSel(); if (hover) hover.classList.remove('fls-hover'); }
      reapply(); syncPanel();
    });
    loadLook();
    check();
    setInterval(check, 500);
    return { check };
  }
  window.FigmaLightStudio = { mount };
})();
