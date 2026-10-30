import { HOME, WALKS, CAMERA, POSTCARD, BINGO, PUMPKIN, CAT, SHARE } from './walks.js';

const screen = document.getElementById('screen');
const sheet = document.getElementById('sheet');
const scrim = document.getElementById('scrim');
const toastEl = document.getElementById('toast');
const camInput = document.getElementById('camInput');

let where = 'out';          // 'out' | 'home'
let leave = null;           // cleanup for the current walk (timers)

/* ---------- tiny helpers ---------- */
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
  return el;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);

function show(...kids) {
  closeSheet();
  screen.replaceChildren(...kids.filter((k) => k != null && k !== false));
  screen.style.animation = 'none'; void screen.offsetWidth; screen.style.animation = '';
  screen.scrollTop = 0;
}

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { toastEl.hidden = true; }, 1800);
}

function bar(right) {
  return h('div', { class: 'bar' },
    h('button', { class: 'back', onclick: goHome, 'aria-label': 'Back to walks' }, '‹ Walks'),
    right != null ? h('span', { class: 'count' }, right) : null);
}

/* ---------- sheet (closes on outside click + Esc) ---------- */
let onSheetClose = null;
function openSheet(kids, onClose) {
  sheet.replaceChildren(...kids.filter((k) => k != null && k !== false));
  sheet.hidden = false; scrim.hidden = false;
  onSheetClose = onClose || null;
}
function closeSheet() {
  if (sheet.hidden) return;
  sheet.hidden = true; scrim.hidden = true;
  const cb = onSheetClose; onSheetClose = null;
  cb?.();
}
scrim.addEventListener('click', closeSheet);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

/* ---------- camera: real phone camera, or a pretend snap ---------- */
function realPhoto() {
  return new Promise((resolve) => {
    camInput.value = '';
    const done = (url) => { camInput.onchange = camInput.oncancel = null; resolve(url); };
    camInput.onchange = () => { const f = camInput.files[0]; done(f ? URL.createObjectURL(f) : null); };
    camInput.oncancel = () => done(null);
    camInput.click();
  });
}

// Draws a stand-in "photo" (an emoji on a soft backdrop) so desktop testers can play.
function pretendPhoto(emoji, colour) {
  const c = document.createElement('canvas');
  c.width = c.height = 480;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(170, 140, 30, 240, 240, 380);
  g.addColorStop(0, shade(colour, 40)); g.addColorStop(1, shade(colour, -50));
  x.fillStyle = g; x.fillRect(0, 0, 480, 480);
  x.translate(240 + (Math.random() - 0.5) * 60, 250 + (Math.random() - 0.5) * 40);
  x.rotate((Math.random() - 0.5) * 0.5);
  x.font = `${200 + Math.random() * 60}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.shadowColor = 'rgba(0,0,0,0.35)'; x.shadowBlur = 24; x.shadowOffsetY = 10;
  x.fillText(emoji, 0, 0);
  return c.toDataURL('image/jpeg', 0.8);
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

// Big shutter + "or pretend" link. onPhoto(url) gets the photo.
function cameraControls(label, onPhoto, pretend) {
  return h('div', { class: 'cam' },
    h('button', { class: 'shutter', 'aria-label': label, onclick: async () => { const u = await realPhoto(); if (u) onPhoto(u); } }),
    h('span', { class: 'lbl' }, label),
    h('button', { class: 'link', 'data-pretend': '', onclick: () => onPhoto(pretend()) }, CAMERA.pretend));
}

/* ---------- home ---------- */
function goHome() {
  leave?.(); leave = null;
  if (location.search) history.replaceState(null, '', location.pathname);
  const whereBtn = (key) => h('button', { 'aria-pressed': String(where === key), onclick: () => { where = key; goHome(); } }, HOME.where[key]);
  show(
    h('p', { class: 'kicker' }, HOME.kicker),
    h('h1', { class: 'display' }, HOME.title),
    h('p', { class: 'sub' }, HOME.sub[where]),
    h('div', { class: 'where', role: 'group', 'aria-label': 'Where are you?' }, whereBtn('out'), whereBtn('home')),
    h('div', { class: 'walks' }, WALKS.map((w) =>
      h('button', { class: 'walk-card', 'data-walk': w.id, onclick: () => start(w.id) },
        h('span', { class: 'em' }, w.emoji),
        h('span', {}, h('b', {}, w.name), h('span', { class: 'line' }, w.line))))),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', id: 'surprise', onclick: () => start(pick(WALKS).id) }, `🎲 ${HOME.surprise}`)),
  );
}

function start(id) {
  leave?.(); leave = null;
  ({ postcard: postcardIntro, bingo: bingoStart, pumpkin: pumpkinWalk, cat: catIntro })[id]();
}

/* ---------- Postcard walk ---------- */
let pc;
function postcardIntro(theme = pick(POSTCARD.themes)) {
  pc = { theme, photos: [], picked: [] };
  show(
    bar(),
    h('p', { class: 'kicker' }, WALKS[0].name),
    h('div', { class: 'theme-big' },
      h('p', { class: 'sub' }, POSTCARD.todays),
      h('span', { class: 'em' }, theme.emoji),
      h('div', { class: 'name' }, theme.label),
      h('button', { class: 'link', id: 'shuffle', onclick: () => {
        const others = POSTCARD.themes.filter((t) => t !== theme);
        postcardIntro(pick(others));
      } }, `🔀 ${POSTCARD.shuffle}`)),
    h('p', { class: 'sub centre' }, POSTCARD.hint[where]),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn primary', id: 'go', onclick: postcardWalk }, POSTCARD.start)),
  );
}

function postcardWalk() {
  const t = pc.theme;
  const n = pc.photos.length;
  const slots = Math.max(3, n);
  show(
    bar(POSTCARD.snapped(n)),
    h('div', {}, h('span', { class: 'theme-chip' }, t.emoji, ' ', t.label)),
    h('div', { class: 'strip' }, Array.from({ length: slots }, (_, i) =>
      pc.photos[i] ? h('img', { src: pc.photos[i], alt: '' }) : h('div', { class: 'slot' }))),
    n < 3 ? h('p', { class: 'progress' }, POSTCARD.needMore(n)) : null,
    h('div', { class: 'spacer' }),
    cameraControls(CAMERA.take, (u) => { pc.photos.push(u); postcardWalk(); }, () => pretendPhoto(pick(t.things), t.colour)),
    h('div', { class: 'btns' }, h('button', { class: 'btn primary', id: 'finish', disabled: n < 3, onclick: () => {
      if (n === 3) { pc.picked = [0, 1, 2]; postcardShow(); } else postcardPick();
    } }, POSTCARD.finish)),
  );
}

function postcardPick() {
  const k = pc.picked.length;
  show(
    bar(),
    h('h2', { class: 'display' }, POSTCARD.pick),
    h('div', { class: 'strip' }, pc.photos.map((src, i) =>
      h('button', { 'aria-pressed': String(pc.picked.includes(i)), onclick: () => {
        if (pc.picked.includes(i)) pc.picked = pc.picked.filter((j) => j !== i);
        else if (pc.picked.length < 3) pc.picked.push(i);
        postcardPick();
      } }, h('img', { src, alt: '' })))),
    h('p', { class: 'progress' }, POSTCARD.picked(k)),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn primary', id: 'make', disabled: k < 3, onclick: postcardShow }, POSTCARD.make)),
  );
}

function postcardShow() {
  const t = pc.theme;
  const date = new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  show(
    bar(),
    h('div', { class: 'postcard', id: 'postcard' },
      h('div', { class: 'photos' }, pc.picked.map((i) => h('img', { src: pc.photos[i], alt: '' }))),
      h('div', { class: 'foot' },
        h('div', {},
          h('div', { class: 'title' }, t.title),
          h('div', { class: 'msg' }, `${date} · ${POSTCARD.greeting[where]}`),
          h('div', { class: 'tag' }, SHARE.tag)),
        h('div', { class: 'stamp' }, h('i', {}, t.emoji), POSTCARD.stamp))),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary', onclick: () => share(t.title, `${POSTCARD.greeting[where]} ${SHARE.tag}`) }, POSTCARD.share),
      h('button', { class: 'btn ghost', onclick: goHome }, POSTCARD.again)),
  );
}

async function share(title, text) {
  if (!navigator.share) return toast(SHARE.unsupported);
  try { await navigator.share({ title, text }); } catch { /* closed the share sheet */ }
}

/* ---------- Neighbourhood bingo ---------- */
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let bg;
function bingoStart() {
  const items = shuffle(BINGO[where]).slice(0, 8).map(([label, em]) => ({ label, em, photo: null }));
  items.splice(4, 0, { free: true });
  bg = { cells: items, celebrated: false };
  bingoBoard();
}
const bingoHas = (i) => bg.cells[i].free || bg.cells[i].photo;
const bingoLines = () => LINES.filter((l) => l.every(bingoHas));

function bingoGrid(tap) {
  const onLine = new Set(bingoLines().flat());
  return h('div', { class: 'grid' }, bg.cells.map((c, i) => {
    if (c.free) return h('div', { class: `sq free${onLine.has(i) ? ' line' : ''}` }, '✦', BINGO.free);
    const cls = `sq${c.photo ? ' got' : ''}${onLine.has(i) ? ' line' : ''}`;
    const kids = c.photo ? [h('img', { src: c.photo, alt: c.label })] : [h('span', { class: 'em' }, c.em), c.label];
    return tap ? h('button', { class: cls, 'data-sq': i, onclick: () => !c.photo && bingoSnap(i) }, kids) : h('div', { class: cls }, kids);
  }));
}

function bingoBoard() {
  const got = bg.cells.filter((c) => c.photo).length;
  show(
    bar(`${got} / 8`),
    h('h2', { class: 'display' }, BINGO.title[where]),
    h('p', { class: 'sub' }, BINGO.hint),
    bingoGrid(true),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', id: 'bingoDone', onclick: bingoEnd }, BINGO.finish)),
  );
}

function bingoSnap(i) {
  const c = bg.cells[i];
  const got = (u) => {
    c.photo = u;
    bingoBoard();
    const full = bg.cells.every((x, j) => bingoHas(j));
    if (full) return celebrate(BINGO.blackout, BINGO.blackoutLine, null, bingoEnd);
    if (!bg.celebrated && bingoLines().length) {
      bg.celebrated = true;
      celebrate(BINGO.bingo, BINGO.bingoLine, BINGO.keepGoing, bingoEnd);
    }
  };
  openSheet([
    h('span', { class: 'em' }, c.em),
    h('h3', {}, c.label),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary', onclick: async () => { closeSheet(); const u = await realPhoto(); if (u) got(u); } }, CAMERA.take),
      h('button', { class: 'link', 'data-pretend': '', onclick: () => { closeSheet(); got(pretendPhoto(c.em, pick(['#3a7d6b', '#4b3d8f', '#8a6a4f', '#2f6fc8']))); } }, CAMERA.pretend)),
  ]);
}

function celebrate(big, line, keepLabel, onFinish) {
  openSheet([
    h('div', { class: 'celebrate' }, h('div', { class: 'big' }, big), h('p', { class: 'sub' }, line)),
    h('div', { class: 'btns' },
      keepLabel ? h('button', { class: 'btn ghost', id: 'keep', onclick: closeSheet }, keepLabel) : null,
      h('button', { class: 'btn primary', id: 'celebrateDone', onclick: onFinish }, BINGO.finish)),
  ]);
}

function bingoEnd() {
  const lines = bingoLines().length;
  const full = bg.cells.every((x, j) => bingoHas(j));
  show(
    bar(),
    h('h2', { class: 'display' }, BINGO.doneTitle(lines)),
    lines ? h('div', { class: 'stickers' },
      h('div', { class: 'sticker' }, h('div', { class: 's' }, '🔲'), BINGO.stickerLine),
      full ? h('div', { class: 'sticker bonus' }, h('div', { class: 's' }, '🌟'), BINGO.bonusLine) : null) : null,
    bingoGrid(false),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', onclick: goHome }, BINGO.again)),
  );
}

/* ---------- Pumpkin Patrol ---------- */
let pk = { list: [] };
function pumpkinWalk(fresh = true) {
  if (fresh) pk = { list: [] };
  const n = pk.list.length;
  show(
    bar(PUMPKIN.rated(n)),
    h('h2', { class: 'display' }, PUMPKIN.title),
    h('p', { class: 'sub' }, PUMPKIN.hint[where]),
    n ? h('div', { class: 'pumpkins' }, [...pk.list].reverse().map(pumpkinRow)) : h('div', { class: 'empty' }, '🎃', h('br'), PUMPKIN.empty),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn pumpkin', id: 'spotted', onclick: async () => { const u = await realPhoto(); if (u) pumpkinRate(u); } }, `🎃 ${PUMPKIN.spotted}`),
      h('button', { class: 'link', 'data-pretend': '', onclick: () => pumpkinRate(pretendPhoto('🎃', pick(['#2a1a40', '#1d1430', '#33204a', '#24182f']))) }, CAMERA.pretend),
      h('button', { class: 'btn ghost', id: 'crown', disabled: n < 2, onclick: pumpkinEnd }, n < 2 ? PUMPKIN.needMore : `👑 ${PUMPKIN.crown}`)),
  );
}

const pumpkinRow = (p) => h('div', { class: 'pk' },
  h('img', { src: p.photo, alt: '' }),
  h('div', {}, h('b', {}, PUMPKIN.scores[p.score - 1]), h('span', { class: 'stars' }, '🎃'.repeat(p.score))));

function pumpkinRate(photo) {
  const label = h('div', { class: 'rate-label' });
  let chosen = false;
  const btns = [1, 2, 3, 4, 5].map((s) => h('button', {
    'aria-label': `${s} of 5`, 'data-score': s,
    onpointerenter: () => { if (!chosen) light(s); },
    onclick: () => {
      if (chosen) return;
      chosen = true; light(s);
      setTimeout(() => { pk.list.push({ photo, score: s }); closeSheet(); pumpkinWalk(false); }, 550);
    },
  }, '🎃'));
  const light = (s) => { btns.forEach((b, i) => b.classList.toggle('on', i < s)); label.textContent = PUMPKIN.scores[s - 1]; };
  openSheet([
    h('img', { class: 'preview', src: photo, alt: '' }),
    h('h3', {}, PUMPKIN.rateIt),
    h('div', { class: 'rate' }, btns),
    label,
  ]);
}

function pumpkinEnd() {
  let best = pk.list[0];
  for (const p of pk.list) if (p.score >= best.score) best = p;
  show(
    bar(),
    h('p', { class: 'kicker centre' }, PUMPKIN.winnerKicker),
    h('div', { class: 'winner' }, h('img', { src: best.photo, alt: '' }), h('span', { class: 'crown' }, '👑')),
    h('h2', { class: 'display centre' }, PUMPKIN.scores[best.score - 1]),
    h('p', { class: 'sub centre' }, PUMPKIN.rated(pk.list.length)),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', onclick: goHome }, PUMPKIN.again)),
  );
}

/* ---------- Turn left at every cat ---------- */
let ct;
function catIntro() {
  show(
    bar(),
    h('p', { class: 'kicker' }, CAT.title),
    h('div', { class: 'rule' }, h('span', { class: 'em' }, '🐈'), h('p', {}, CAT.rule[where])),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn primary', id: 'go', onclick: catWalk }, CAT.start)),
  );
}

function catWalk() {
  ct = { cats: 0, lefts: 0, rights: 0, heading: -90, pts: [[0, 0], [0, -30]], marks: [] };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'doodle');
  const arrow = h('div', { class: 'arrow', id: 'arrow' }, CAT.walking);
  const count = h('span', { class: 'count' }, CAT.count(0));
  const top = bar(); top.append(count);
  show(
    top,
    svg,
    arrow,
    h('div', { class: 'btns' },
      h('button', { class: 'btn cat', id: 'sawCat', onclick: () => {
        ct.cats++;
        const rebel = ct.cats % 4 === 0;
        rebel ? ct.rights++ : ct.lefts++;
        const last = ct.pts.at(-1);
        stretch(last, 40); // quick taps still leave a readable zig-zag
        ct.marks.push([...last]);
        ct.pts.push([...last]);
        ct.heading += (rebel ? 90 : -90) + (Math.random() - 0.5) * 24;
        count.textContent = CAT.count(ct.cats);
        arrow.textContent = rebel ? `↱ ${CAT.rebel}` : `↰ ${pick(CAT.lefts)}`;
        arrow.classList.remove('flash'); void arrow.offsetWidth; arrow.classList.add('flash');
        drawDoodle(svg, true);
      } }, `🐈 ${CAT.saw}`),
      h('button', { class: 'btn ghost', id: 'catDone', onclick: catEnd }, CAT.done)),
  );
  drawDoodle(svg, true);
  const tick = setInterval(() => {
    const last = ct.pts.at(-1);
    const r = (ct.heading * Math.PI) / 180;
    last[0] += Math.cos(r) * 1.4; last[1] += Math.sin(r) * 1.4;
    drawDoodle(svg, true);
  }, 120);
  leave = () => clearInterval(tick);
}

// Make sure the segment ending at `last` is at least `min` long, along the current heading.
function stretch(last, min) {
  const prev = ct.pts.at(-2);
  const len = Math.hypot(last[0] - prev[0], last[1] - prev[1]);
  if (len >= min) return;
  const r = (ct.heading * Math.PI) / 180;
  last[0] = prev[0] + Math.cos(r) * min; last[1] = prev[1] + Math.sin(r) * min;
}

function drawDoodle(svg, live) {
  const all = [...ct.pts, ...ct.marks];
  const xs = all.map((p) => p[0]); const ys = all.map((p) => p[1]);
  const pad = 30;
  let minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad, minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
  const w = Math.max(maxX - minX, 160), hgt = Math.max(maxY - minY, 160);
  minX -= (w - (maxX - minX)) / 2; minY -= (hgt - (maxY - minY)) / 2;
  svg.setAttribute('viewBox', `${minX} ${minY} ${w} ${hgt}`);
  const s = w / 300; // keep marks the same size as the drawing grows
  const d = ct.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const end = ct.pts.at(-1);
  svg.innerHTML = `<path d="${d}" style="stroke-width:${3.5 * s};stroke-dasharray:${1 * s} ${9 * s}"/>`
    + `<text x="0" y="0" text-anchor="middle" dominant-baseline="central" style="font-size:${18 * s}px">🏠</text>`
    + ct.marks.map((m) => `<text x="${m[0]}" y="${m[1]}" text-anchor="middle" dominant-baseline="central" style="font-size:${20 * s}px">🐈</text>`).join('')
    + (live
      ? `<circle class="me" cx="${end[0]}" cy="${end[1]}" r="${7 * s}" style="stroke-width:${4 * s}"/>`
      : `<text x="${end[0]}" y="${end[1]}" text-anchor="middle" dominant-baseline="central" style="font-size:${20 * s}px">🏁</text>`);
}

function catEnd() {
  leave?.(); leave = null;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'doodle');
  show(
    bar(),
    h('h2', { class: 'display' }, CAT.endTitle),
    h('p', { class: 'sub' }, ct.cats ? CAT.endLine(ct.cats, ct.lefts, ct.rights) : CAT.noCats),
    svg,
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', onclick: goHome }, CAT.again)),
  );
  drawDoodle(svg, false);
}

/* ---------- boot: ?v=<walk> opens a walk straight away ---------- */
const v = new URLSearchParams(location.search).get('v') || location.hash.slice(1);
if (v === 'home') where = 'home';
if (WALKS.some((w) => w.id === v)) start(v); else goHome();
