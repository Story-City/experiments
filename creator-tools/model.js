// Shared story model: readable titles, stops (colour groups), checks and the map layout.

export const STOP_COLOURS = [
  { c: '#1E88E5', bg: '#E3F0FC' }, // blue
  { c: '#00897B', bg: '#E0F2EF' }, // teal
  { c: '#E08600', bg: '#FDF0DC' }, // amber
  { c: '#D81B60', bg: '#FBE4EC' }, // rose
  { c: '#7E57C2', bg: '#EEE8F7' }, // violet
  { c: '#43A047', bg: '#E5F3E6' }, // green
  { c: '#F4511E', bg: '#FDE8E1' }, // orange
  { c: '#3949AB', bg: '#E5E8F6' }, // indigo
];

// "INCORRECT MOVE 3 Sacrifice Rabbit" -> "Incorrect move 3 sacrifice rabbit"
const sentence = (s) => {
  const words = s.split(' ');
  const caps = words.filter((w) => /[A-Z]{2}/.test(w) && w === w.toUpperCase()).length;
  if (caps < Math.max(1, words.length / 2)) return s;
  const low = s.toLowerCase();
  return low.charAt(0).toUpperCase() + low.slice(1);
};

// "NM 2.4 (Park tables) - 0.2_RIDDLE TWO" -> { code: 'NM 2.4', title: 'Riddle two' }
export function splitName(rawName, text) {
  let s = (rawName || '').trim();
  let score = null;
  const sc = s.match(/^(.*?)\s*\bBeat\s+/i);
  if (sc) { score = sc[1] || null; s = s.slice(sc[0].length); }
  let code = '';
  const m = s.match(/^([A-Z]{1,3}\s?\d+(?:[.-]\d+)*[a-z]*|L\d+-\d+[a-z]*|\d+[a-z]+)(?=$|\s|:|-)/);
  if (m) { code = m[1]; s = s.slice(m[0].length); }
  s = s.replace(/^\s*[:\-–]\s*/, '').trim();
  let paren = '';
  const pm = s.match(/\(([^)]+)\)/);
  if (pm) { paren = pm[1]; }
  if (s.includes(' - ')) s = s.split(' - ').pop();
  s = s.replace(/\([^)]*\)/g, '').trim().replace(/^[\d.]+_/, '').replace(/_/g, ' ')
    .replace(/\b(START|END)\b\s*$/, '').replace(/\s+/g, ' ').trim();
  let untitled = false;
  if (!s && paren) s = paren;
  if (!s) {
    untitled = true;
    const words = (text || '').replace(/[“”"]/g, '').split(/\s+/).filter(Boolean).slice(0, 5).join(' ');
    s = words ? `“${words}…”` : 'Untitled chapter';
  }
  return { code, title: sentence(s), score, untitled, paren };
}

export function prepare(story) {
  const chapters = story.chapters.map((c) => ({ ...c, choices: (c.choices || []).map((k) => ({ ...k })) }));
  const byId = new Map(chapters.map((c) => [c.id, c]));
  for (const c of chapters) {
    const n = splitName(c.name, c.text);
    Object.assign(c, n);
    if (c.customTitle) { c.title = c.customTitle; c.untitled = false; }
    if (c.loc && !c.place && n.paren && n.paren !== c.title) c.place = n.paren;
    const upper = c.name.toUpperCase();
    if (c.puzzle == null) {
      c.puzzle = /RIDDLE|PUZZLE|DECRYPT|REMIX|CHECKMATE|MOVE \d/.test(upper)
        || c.choices.some((k) => /^answer$/i.test(k.label));
    }
    if (!c.score && /\bPTS\b|POINTS|PT CALC/.test(upper)) c.score = 'pts';
    c.chat = c.chat || 0;
  }
  const start = chapters.find((c) => c.start) || chapters[0];

  // Stops: every chapter with location on starts a new stop; others belong to the stop they're reached from.
  const stopOf = new Map();
  const stops = [];
  const queue = [];
  if (start) {
    stops.push({ id: 0, name: start.place || start.title, first: start.id });
    stopOf.set(start.id, 0); queue.push(start.id);
  }
  while (queue.length) {
    const id = queue.shift();
    for (const k of byId.get(id).choices) {
      if (!k.to || stopOf.has(k.to) || !byId.has(k.to)) continue;
      const t = byId.get(k.to);
      if (t.loc) {
        stops.push({ id: stops.length, name: t.place || t.title, first: t.id });
        stopOf.set(t.id, stops.length - 1);
      } else stopOf.set(t.id, stopOf.get(id));
      queue.push(t.id);
    }
  }
  for (const c of chapters) {
    c.reached = stopOf.has(c.id);
    c.stop = stopOf.has(c.id) ? stopOf.get(c.id) : -1;
  }
  stops.forEach((s, i) => { s.colour = STOP_COLOURS[i % STOP_COLOURS.length]; });
  return { ...story, chapters, byId, start, stops };
}

// Checks shown under "N to check". lang = 'en' | 'fr'.
export function findIssues(model, lang) {
  const out = [];
  const starts = model.chapters.filter((c) => c.start);
  if (model.chapters.length > 1 && !starts.length) out.push({ id: model.chapters[0].id, kind: 'block', text: 'No chapter is marked as the start.' });
  if (starts.length > 1) out.push({ id: starts[1].id, kind: 'block', text: `${starts.length} chapters are marked as the start. Keep one.` });
  for (const c of model.chapters) {
    if (!c.reached) out.push({ id: c.id, kind: 'block', text: `“${c.title}” can't be reached from the start.` });
    if (!c.end && c.choices.length === 0) out.push({ id: c.id, kind: 'block', text: `“${c.title}” has no choices and isn't an ending.` });
    if (c.choices.some((k) => !k.to)) out.push({ id: c.id, kind: 'block', text: `“${c.title}” has a choice that goes nowhere.` });
    if (c.end && c.choices.length) out.push({ id: c.id, kind: 'check', text: `“${c.title}” is an ending but still has choices.` });
    if (c.untitled) out.push({ id: c.id, kind: 'check', text: `${c.code || 'A chapter'} has no readable name. Players see it in Hunt mode.` });
    if (lang === 'fr' && c.fr == null) out.push({ id: c.id, kind: 'fr', text: `“${c.title}” needs French.` });
  }
  return out;
}

// ---- Layout: columns by step from the start, endings share the last column ----
export const NODE_W = 230;
const COL_GAP = 90;
const ROW_GAP = 22;
const BAND_GAP = 150;

export const HEAD_H = 92;
export const ROW_H = 24;
export function nodeHeight(c) {
  return HEAD_H + 8 + (Math.max(1, c.choices.length) + 1) * ROW_H;
}

// Story at a glance: endings reached, shortest and longest way through (in chapters).
export function storyStats(model) {
  const { byId, start } = model;
  const endings = model.chapters.filter((c) => c.end);
  let shortest = null; let longest = 0;
  if (start) {
    const dist = new Map([[start.id, 1]]); const q = [start.id];
    while (q.length) {
      const id = q.shift();
      for (const k of byId.get(id).choices) if (k.to && byId.has(k.to) && !dist.has(k.to)) { dist.set(k.to, dist.get(id) + 1); q.push(k.to); }
    }
    const reachedEnds = endings.filter((e) => dist.has(e.id));
    if (reachedEnds.length) shortest = Math.min(...reachedEnds.map((e) => dist.get(e.id)));
    const memo = new Map(); const onPath = new Set();
    const deep = (id) => {
      if (memo.has(id)) return memo.get(id);
      onPath.add(id);
      let best = byId.get(id).end ? 1 : -Infinity;
      for (const k of byId.get(id).choices) if (k.to && byId.has(k.to) && !onPath.has(k.to)) best = Math.max(best, 1 + deep(k.to));
      onPath.delete(id); memo.set(id, best); return best;
    };
    longest = Math.max(0, deep(start.id));
  }
  const choices = model.chapters.reduce((s, c) => s + c.choices.length, 0);
  const words = model.chapters.reduce((s, c) => s + (c.blocks ? c.blocks.reduce((w, b) => w + (b.text ? b.text.split(/\s+/).length : 0), 0) : 0), 0);
  return { chapters: model.chapters.length, choices, endings: endings.length, stops: model.stops.length, shortest, longest, words };
}

export function layout(model, opts = {}) {
  const { chapters, byId, start } = model;
  const ids = chapters.map((c) => c.id);
  const succ = new Map(ids.map((id) => [id, []]));
  const pred = new Map(ids.map((id) => [id, []]));
  const back = new Set();

  // DFS to find loop-backs
  const state = new Map();
  const visit = (id) => {
    state.set(id, 1);
    for (const k of byId.get(id).choices) {
      if (!k.to || !byId.has(k.to)) continue;
      const s = state.get(k.to);
      if (s === 1) { back.add(id + '>' + k.to); continue; }
      if (!succ.get(id).includes(k.to)) { succ.get(id).push(k.to); pred.get(k.to).push(id); }
      if (!s) visit(k.to);
    }
    state.set(id, 2);
  };
  if (start) visit(start.id);
  for (const id of ids) if (!state.get(id)) visit(id);

  // Longest-path layers
  const layer = new Map();
  const order = [];
  const seen = new Set();
  const topo = (id) => { if (seen.has(id)) return; seen.add(id); succ.get(id).forEach(topo); order.unshift(id); };
  ids.forEach(topo);
  for (const id of order) {
    const ps = pred.get(id);
    layer.set(id, ps.length ? Math.max(...ps.map((p) => layer.get(p) + 1)) : 0);
  }
  for (const c of chapters) if (!c.reached && !pred.get(c.id).length) layer.set(c.id, 0);
  for (const c of chapters) if (!c.reached && !pred.get(c.id).length) layer.set(c.id, 0);

  // Where each chapter goes: rows = one row per stop (cleaned up), or one long line (today)
  const cell = new Map(); // id -> { row, col }
  const reached = chapters.filter((c) => c.reached);
  let endCol;
  if (opts.rows) {
    for (const c of reached) {
      if (c.end) continue;
      const base = layer.get(model.stops[c.stop].first);
      cell.set(c.id, { row: c.stop, col: Math.max(0, layer.get(c.id) - base) });
    }
    endCol = Math.max(0, ...[...cell.values()].map((p) => p.col)) + 1;
    for (const c of reached) if (c.end) cell.set(c.id, { row: c.stop, col: endCol });
  } else {
    const nonEnd = reached.filter((c) => !c.end).map((c) => layer.get(c.id));
    endCol = Math.max(0, ...nonEnd) + 1;
    for (const c of reached) cell.set(c.id, { row: 0, col: c.end ? endCol : layer.get(c.id) });
  }

  // Order inside each cell: by stop, then barycentre sweeps
  const groups = new Map();
  for (const c of reached) {
    const { row, col } = cell.get(c.id); const k = row * 1000 + col;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(c.id);
  }
  const keys = [...groups.keys()].sort((a, b) => a - b);
  const pos = new Map();
  for (const k of keys) groups.get(k).sort((a, b) => byId.get(a).stop - byId.get(b).stop).forEach((id, i) => pos.set(id, i));
  const bary = (id, nbrs) => {
    const ns = nbrs.get(id).filter((n) => pos.has(n));
    return ns.length ? ns.reduce((s, n) => s + pos.get(n), 0) / ns.length : pos.get(id);
  };
  for (let sweep = 0; sweep < 8; sweep++) {
    const down = sweep % 2 === 0;
    for (const k of down ? keys : [...keys].reverse()) {
      const g = groups.get(k); const nb = down ? pred : succ;
      const key = new Map(g.map((id) => [id, bary(id, nb)]));
      g.sort((a, b) => key.get(a) - key.get(b));
      g.forEach((id, i) => pos.set(id, i));
    }
  }

  // Coordinates: row by row; sit level with parents in the same row, never overlap
  const xy = new Map();
  const rows = [];
  let rowTop = 0;
  const rowIds = [...new Set(keys.map((k) => Math.floor(k / 1000)))];
  for (const r of rowIds) {
    let rowBottom = rowTop;
    for (const k of keys.filter((kk) => Math.floor(kk / 1000) === r)) {
      const col = k % 1000;
      const x = col * (NODE_W + COL_GAP);
      let bottom = -Infinity;
      for (const id of groups.get(k)) {
        const h = nodeHeight(byId.get(id));
        const ps = pred.get(id).filter((p) => xy.has(p) && xy.get(p).row === r);
        const want = ps.length ? ps.reduce((s, p) => s + xy.get(p).y + xy.get(p).h / 2, 0) / ps.length - h / 2 : rowTop;
        const y = Math.max(want, bottom + ROW_GAP, rowTop);
        xy.set(id, { x, y, h, row: r });
        bottom = y + h;
        rowBottom = Math.max(rowBottom, bottom);
      }
    }
    rows[r] = { top: rowTop, bottom: rowBottom };
    rowTop = rowBottom + BAND_GAP;
  }
  // Unreached chapters go in a row underneath
  let ux = 0;
  for (const c of chapters) {
    if (c.reached) continue;
    xy.set(c.id, { x: ux, y: rowTop + 20, h: nodeHeight(c), row: -1 });
    ux += NODE_W + 40;
  }
  return { xy, back, endCol, rows };
}
