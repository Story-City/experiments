import { register } from './more.js';
import { SECTIONS, MORE_WALKS, QUESTS, QUEST_WORDS } from './more-words.js';
import { HOME, WALKS, HERO, CAMERA, POSTCARD, BINGO, PUMPKIN, CAT, ROULETTE, SHARE } from './walks.js';

const screen = document.getElementById('screen');
const sheet = document.getElementById('sheet');
const scrim = document.getElementById('scrim');
const toastEl = document.getElementById('toast');
const camInput = document.getElementById('camInput');

let where = 'out';          // 'out' | 'home'
let leave = null;           // cleanup for the current walk (timers)
let current = null;         // the walk being played
const phone = document.getElementById('phone');

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
  screen.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));
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
    h('button', { class: 'back', onclick: goHome, 'aria-label': 'Back to walks' }, '‹'),
    current ? h('span', { class: 'walk-name' }, current.name) : null,
    right != null ? h('span', { class: 'count' }, right) : null);
}

/* ---------- sheet (closes on outside click + Esc) ---------- */
let onSheetClose = null;
function openSheet(kids, onClose, jewel) {
  sheet.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));
  if (jewel) sheet.style.setProperty('--jewel', jewel); else sheet.style.removeProperty('--jewel');
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
    h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => onPhoto(pretend()) }, CAMERA.pretend));
}

/* ---------- home: square text-only cards, tonight's walk as the hero ---------- */
const todayTheme = pick(POSTCARD.themes);
// every walk in display order (hero first, then by section); the number on each card follows that order
const ALL = [...WALKS, ...MORE_WALKS];
const ORDER = [ALL.find((w) => w.id === HERO), ...SECTIONS.flatMap((sec) => ALL.filter((w) => w.section === sec.id && w.id !== HERO))];
ORDER.forEach((w, i) => { w.no = i + 1; });
let more; // the board's walks and quests, wired up once the helpers below exist

function walkCard(w, hero) {
  return h('button', { class: `walk${hero ? ' hero' : ''}`, 'data-walk': w.id, style: `--jewel:${w.jewel}`, onclick: () => cardBack(w) },
    h('span', { class: 'ghost', 'aria-hidden': 'true' }, w.no),
    h('span', { class: 'mech' }, hero ? `${HOME.hero} · ${w.mech}` : w.mech),
    h('span', { class: 'star', 'aria-hidden': 'true' }, '✦'),
    h('span', { class: 'title' }, w.name),
    hero ? h('span', { class: 'hook' }, w.hook(todayTheme)) : null,
    h('span', { class: 'meta' }, w.tags.join(' · ')));
}

function questCard(q) {
  return h('button', { class: 'walk quest', 'data-walk': q.id, style: `--jewel:${q.jewel}`, onclick: () => questBack(q) },
    h('span', { class: 'mech' }, `${q.spooky ? QUEST_WORDS.spookyShort : QUEST_WORDS.kicker} · ${q.mins} min`),
    h('span', { class: 'star', 'aria-hidden': 'true' }, '✦'),
    h('span', { class: 'title' }, q.title));
}
function questBack(q) {
  openSheet([
    h('p', { class: 'kicker' }, `${q.spooky ? QUEST_WORDS.spooky : QUEST_WORDS.kicker} · ${q.mins} min`),
    h('h3', {}, q.title),
    h('p', { class: 'hook' }, q.line),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary', id: 'startWalk', onclick: () => start(q.id) }, QUEST_WORDS.go),
      h('button', { class: 'link', onclick: closeSheet }, HOME.notNow)),
  ], null, q.jewel);
}

// The card turns over into a sheet: the full pitch and the one button.
function cardBack(w) {
  openSheet([
    h('span', { class: 'ghost-no', 'aria-hidden': 'true' }, w.no),
    h('p', { class: 'kicker' }, `Walk no. ${w.no} · ${w.mech}`),
    h('h3', {}, w.name),
    h('p', { class: 'hook' }, w.hook(todayTheme)),
    h('p', { class: 'more' }, w.more),
    h('p', { class: 'how' }, w.how.flatMap((step, i) => (i ? [h('i', {}, '✦'), step] : [step]))),
    h('div', { class: 'tags' }, w.tags.map((t) => h('span', { class: 'tag' }, t))),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary', id: 'startWalk', onclick: () => start(w.id) }, w.go),
      h('button', { class: 'link', onclick: closeSheet }, HOME.notNow)),
  ], null, w.jewel);
}

function goHome() {
  leave?.(); leave = null; current = null;
  phone.style.removeProperty('--jewel');
  if (location.search) history.replaceState(null, '', location.pathname);
  const whereBtn = (key) => h('button', { class: 'chip', 'aria-pressed': String(where === key), onclick: () => { where = key; goHome(); } }, HOME.where[key]);
  const hero = WALKS.find((w) => w.id === HERO);
  show(
    h('div', { class: 'home-head' },
      h('p', { class: 'kicker' }, `Whimsy Walks · ${ALL.length} walks, ${QUESTS.length} quests`),
      h('h1', { class: 'display' }, HOME.title),
      h('p', { class: 'sub' }, HOME.sub[where]),
      h('div', { class: 'where', role: 'group', 'aria-label': 'Where are you?' }, whereBtn('out'), whereBtn('home'))),
    h('div', { class: 'cards' }, walkCard(hero, true)),
    SECTIONS.map((sec) => [
      h('p', { class: 'kicker section' }, sec.label),
      h('div', { class: 'cards' }, ORDER.filter((w) => w.section === sec.id && w !== hero).map((w) => walkCard(w))),
    ]),
    h('p', { class: 'kicker section' }, QUEST_WORDS.section),
    h('div', { class: 'cards' }, QUESTS.map(questCard)),
    h('div', { class: 'btns' }, h('button', { class: 'link', id: 'surprise', onclick: () => cardBack(pick(ALL)) }, `✦ ${HOME.surprise}`)),
  );
}

function start(id) {
  leave?.(); leave = null;
  const q = QUESTS.find((x) => x.id === id);
  current = q ? { name: q.spooky ? QUEST_WORDS.spooky : QUEST_WORDS.kicker, jewel: q.jewel } : ALL.find((w) => w.id === id);
  phone.style.setProperty('--jewel', current.jewel);
  if (q) return more.quest(q);
  ({ postcard: () => postcardIntro(todayTheme), bingo: bingoStart, pumpkin: pumpkinWalk, cat: catWalk, roulette: rouletteIntro, ...more.starts })[id]();
}

/* ---------- Postcard walk ---------- */
let pc;
function postcardIntro(theme = pick(POSTCARD.themes)) {
  pc = { theme, photos: [], picked: [] };
  show(
    bar(),
    h('p', { class: 'kicker' }, POSTCARD.todays),
    h('div', { class: 'theme-big', style: `--swatch:${theme.colour}` },
      h('div', { class: 'name', id: 'themeName' }, theme.label, h('span', { class: 'dot', 'aria-hidden': 'true' }))),
    h('p', { class: 'sub' }, POSTCARD.hint[where]),
    h('div', {}, h('button', { class: 'link pretend', id: 'shuffle', style: 'padding-left:0', onclick: () => {
      const others = POSTCARD.themes.filter((t) => t !== theme);
      postcardIntro(pick(others));
    } }, POSTCARD.shuffle)),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'go', onclick: postcardWalk }, POSTCARD.start)),
  );
  fitWord(document.getElementById('themeName'));
}

// Shrink the theme word until it fits on one line (after the font loads too).
function fitWord(el) {
  if (!el) return;
  const fit = () => {
    let size = 96;
    el.style.fontSize = `${size}px`;
    while (el.scrollWidth > el.parentElement.clientWidth && size > 36) el.style.fontSize = `${(size -= 4)}px`;
  };
  fit();
  document.fonts?.ready.then(fit);
}

function postcardWalk() {
  const t = pc.theme;
  const n = pc.photos.length;
  const slots = Math.max(3, n);
  show(
    bar(POSTCARD.snapped(n)),
    h('div', {}, h('span', { class: 'theme-chip', style: `--swatch:${t.colour}` }, h('i'), `${POSTCARD.hunt} ${t.noun}`)),
    h('div', { class: 'strip' }, Array.from({ length: slots }, (_, i) =>
      pc.photos[i] ? h('img', { src: pc.photos[i], alt: '' }) : h('div', { class: 'slot' }))),
    n < 3 ? h('p', { class: 'progress' }, POSTCARD.needMore(n)) : null,
    h('div', { class: 'spacer' }),
    cameraControls(CAMERA.take, (u) => { pc.photos.push(u); postcardWalk(); }, () => pretendPhoto(pick(t.things), t.colour)),
    h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'finish', disabled: n < 3, onclick: () => {
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
    h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'make', disabled: k < 3, onclick: postcardShow }, POSTCARD.make)),
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
          h('div', { class: 'tag-line' }, SHARE.tag)),
        h('div', { class: 'stamp' }, h('i', {}, '✦'), POSTCARD.stamp))),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn jewel', onclick: () => share(t.title, `${POSTCARD.greeting[where]} ${SHARE.tag}`) }, POSTCARD.share),
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
    if (c.free) return h('div', { class: `sq free${onLine.has(i) ? ' line' : ''}` }, `✦ ${BINGO.free}`);
    const cls = `sq${c.photo ? ' got' : ''}${onLine.has(i) ? ' line' : ''}`;
    const kids = c.photo ? [h('img', { src: c.photo, alt: c.label })] : [c.label];
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
    h('p', { class: 'kicker' }, BINGO.spot),
    h('h3', {}, c.label),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary', onclick: async () => { closeSheet(); const u = await realPhoto(); if (u) got(u); } }, CAMERA.take),
      h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => { closeSheet(); got(pretendPhoto(c.em, pick(['#3a7d6b', '#4b3d8f', '#8a6a4f', '#2f6fc8']))); } }, CAMERA.pretend)),
  ]);
}

function celebrate(big, line, keepLabel, onFinish) {
  openSheet([
    h('div', { class: 'celebrate' }, h('div', { class: 'big' }, big), h('p', { class: 'sub' }, line)),
    h('div', { class: 'btns' },
      keepLabel ? h('button', { class: 'btn ghost', id: 'keep', onclick: closeSheet }, keepLabel) : null,
      h('button', { class: 'btn jewel', id: 'celebrateDone', onclick: onFinish }, BINGO.finish)),
  ]);
}

function bingoEnd() {
  const lines = bingoLines().length;
  const full = bg.cells.every((x, j) => bingoHas(j));
  show(
    bar(),
    h('h2', { class: 'display' }, BINGO.doneTitle(lines)),
    lines ? h('div', { class: 'stickers' },
      h('div', { class: 'sticker' }, h('div', { class: 's' }, '✦'), BINGO.stickerLine),
      full ? h('div', { class: 'sticker bonus' }, h('div', { class: 's' }, '✦'), BINGO.bonusLine) : null) : null,
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
    n ? h('div', { class: 'pumpkins' }, [...pk.list].reverse().map(pumpkinRow)) : h('div', { class: 'empty' }, PUMPKIN.empty),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn jewel', id: 'spotted', onclick: async () => { const u = await realPhoto(); if (u) pumpkinRate(u); } }, PUMPKIN.spotted),
      h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => pumpkinRate(pretendPhoto('🎃', pick(['#2a1a40', '#1d1430', '#33204a', '#24182f']))) }, CAMERA.pretend),
      h('button', { class: 'btn ghost', id: 'crown', disabled: n < 2, onclick: pumpkinEnd }, n < 2 ? PUMPKIN.needMore : PUMPKIN.crown)),
  );
}

const pumpkinRow = (p) => h('div', { class: 'pk' },
  h('img', { src: p.photo, alt: '' }),
  h('div', {}, h('b', {}, PUMPKIN.scores[p.score - 1]), h('span', { class: 'stars', 'aria-label': PUMPKIN.outOf(p.score) }, '✦'.repeat(p.score), h('s', {}, '✦'.repeat(5 - p.score)))));

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
  }, String(s)));
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
    h('div', { class: 'winner' }, h('img', { src: best.photo, alt: '' }), h('span', { class: 'crown' }, '✦')),
    h('h2', { class: 'display centre' }, PUMPKIN.scores[best.score - 1]),
    h('p', { class: 'sub centre' }, PUMPKIN.rated(pk.list.length)),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', onclick: goHome }, PUMPKIN.again)),
  );
}

/* ---------- Turn left at every cat ---------- */
let ct;
function catWalk() {
  ct = { cats: 0, lefts: 0, rights: 0, heading: -90, pts: [[0, 0], [0, -30]], marks: [] };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'doodle');
  const arrow = h('div', { class: 'arrow', id: 'arrow' }, CAT.walking);
  const count = h('span', { class: 'count' }, CAT.count(0));
  const top = bar(); top.append(count);
  const rule = h('div', { class: 'frame', id: 'rule' }, h('p', { class: 'kicker' }, CAT.ruleLabel), h('p', { class: 'big' }, CAT.rule[where]));
  show(
    top,
    rule,
    svg,
    arrow,
    h('div', { class: 'btns' },
      h('button', { class: 'btn jewel', id: 'sawCat', onclick: () => {
        rule.hidden = true;
        ct.cats++;
        const rebel = ct.cats % 4 === 0;
        rebel ? ct.rights++ : ct.lefts++;
        turn(rebel ? 90 : -90, '✦');
        count.textContent = CAT.count(ct.cats);
        arrow.textContent = rebel ? `↱ ${CAT.rebel}` : `↰ ${pick(CAT.lefts)}`;
        arrow.classList.remove('flash'); void arrow.offsetWidth; arrow.classList.add('flash');
        drawDoodle(svg, true);
      } }, CAT.saw),
      h('button', { class: 'btn ghost', id: 'catDone', onclick: catEnd }, CAT.done)),
  );
  walkDoodle(svg);
}

// The cat walk's route doodle: it keeps growing while you walk.
function walkDoodle(svg) {
  drawDoodle(svg, true);
  const tick = setInterval(() => {
    const last = ct.pts.at(-1);
    const r = (ct.heading * Math.PI) / 180;
    last[0] += Math.cos(r) * 1.4; last[1] += Math.sin(r) * 1.4;
    drawDoodle(svg, true);
  }, 120);
  leave = () => clearInterval(tick);
}

// Drop a marker where you are and change direction (deg: -90 left, 90 right, 0 straight).
function turn(deg, emoji) {
  const last = ct.pts.at(-1);
  stretch(last, 40); // quick taps still leave a readable zig-zag
  ct.marks.push([...last, emoji]);
  ct.pts.push([...last]);
  ct.heading += deg + (deg ? (Math.random() - 0.5) * 24 : 0);
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
    + `<circle class="home" cx="0" cy="0" r="${8 * s}" style="stroke-width:${3 * s}"/>`
    + ct.marks.map((m) => `<text class="mark" x="${m[0]}" y="${m[1]}" text-anchor="middle" dominant-baseline="central" style="font-size:${18 * s}px">${m[2]}</text>`).join('')
    + (live === 'loop' ? ''
      : live
      ? `<circle class="me" cx="${end[0]}" cy="${end[1]}" r="${7 * s}" style="stroke-width:${4 * s}"/>`
      : `<text class="mark" x="${end[0]}" y="${end[1]}" text-anchor="middle" dominant-baseline="central" style="font-size:${30 * s}px">✦</text>`);
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

/* ---------- Route Roulette ---------- */
const BLOCK_MIN = 1.2;      // minutes to walk one block (about 100 m)
const STEPS_PER_UNIT = 10;  // at home, one "block" = 10 steps
let rr;

function rouletteIntro() {
  let mins = 20;
  const label = h('div', { class: 'theme-big' }, h('div', { class: 'name', id: 'mins' }, ROULETTE.mins(mins)));
  show(
    bar(),
    h('p', { class: 'kicker' }, ROULETTE.howLong),
    label,
    h('input', { type: 'range', class: 'slider', id: 'length', min: 10, max: 60, step: 5, value: mins, 'aria-label': ROULETTE.howLong,
      oninput: (e) => { mins = +e.target.value; label.firstChild.textContent = ROULETTE.mins(mins); } }),
    h('p', { class: 'sub' }, ROULETTE.rule[where]),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'go', onclick: () => rouletteWalk(mins) }, ROULETTE.start)),
  );
}

// Plans a closed loop on a street grid: grow a blob of city blocks until its outline
// is about the right length, then walk its outline. Returns legs of {turn, len}.
function planLoop(target) {
  for (let tries = 0; tries < 200; tries++) {
    const cells = new Set(['0,0']);
    while (perimeter(cells) < target) {
      const k = grow(cells);
      cells.add(k);
      if (!outlineOk(cells)) cells.delete(k);
    }
    const loop = outline(cells);
    if (loop && Math.abs(loop.length - target) <= 2) return toLegs(loop);
  }
  return toLegs(outline(new Set(['0,0'])));
}
// Next block to add. Mostly fills a nook (touches 2+ blocks) so loops stay chunky
// with a few fun jogs, instead of zig-zagging every block.
function grow(cells) {
  const around = new Map();
  for (const c of cells) {
    const [x, y] = c.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${x + dx},${y + dy}`;
      if (!cells.has(k)) around.set(k, (around.get(k) || 0) + 1);
    }
  }
  const nooks = [...around].filter(([, n]) => n >= 2).map(([k]) => k);
  return nooks.length && Math.random() < 0.8 ? pick(nooks) : pick([...around.keys()]);
}
function perimeter(cells) {
  let p = 0;
  for (const c of cells) { const [x, y] = c.split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!cells.has(`${x + dx},${y + dy}`)) p++; }
  return p;
}
// Directed unit edges round each cell (counter-clockwise), keeping only the outer ones.
function edges(cells) {
  const out = [];
  for (const c of cells) {
    const [x, y] = c.split(',').map(Number);
    if (!cells.has(`${x},${y - 1}`)) out.push([[x, y], [x + 1, y]]);
    if (!cells.has(`${x + 1},${y}`)) out.push([[x + 1, y], [x + 1, y + 1]]);
    if (!cells.has(`${x},${y + 1}`)) out.push([[x + 1, y + 1], [x, y + 1]]);
    if (!cells.has(`${x - 1},${y}`)) out.push([[x, y + 1], [x, y]]);
  }
  return out;
}
// One clean outline: no corner touching itself and no courtyards (holes).
function outlineOk(cells) {
  const es = edges(cells);
  const starts = new Set();
  for (const [a] of es) { const k = `${a}`; if (starts.has(k)) return false; starts.add(k); }
  return outline(cells)?.length === es.length;
}
function outline(cells) {
  const es = edges(cells);
  const from = new Map(es.map((e) => [`${e[0]}`, e]));
  const loop = [];
  let e = es[0];
  do { loop.push(e[0]); e = from.get(`${e[1]}`); if (!e) return null; } while (e !== es[0] && loop.length <= es.length);
  return loop;
}
// Turn a list of grid points into legs, starting mid-street where possible (your door).
function toLegs(loop) {
  const n = loop.length;
  const dir = (i) => { const a = loop[i % n], b = loop[(i + 1) % n]; return [b[0] - a[0], b[1] - a[1]]; };
  const straight = [...Array(n).keys()].filter((i) => `${dir(i)}` === `${dir((i + n - 1) % n)}`);
  const start = straight.length ? pick(straight) : 0;
  const legs = [];
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n, d = dir(i);
    const last = legs.at(-1);
    if (last && `${last.d}` === `${d}`) { last.len++; continue; }
    const prev = last ? last.d : null;
    // cross product sign tells left vs right (y grows downward on screen)
    const turn = prev ? (prev[0] * d[1] - prev[1] * d[0] > 0 ? 'right' : 'left') : pick(['left', 'right']);
    legs.push({ d, len: 1, turn });
  }
  // if the walk ends heading the same way it started, the last leg is really the first one's start
  if (legs.length > 1 && `${legs.at(-1).d}` === `${legs[0].d}`) { const tail = legs.pop(); legs.push({ ...tail, home: true }); }
  legs.at(-1).home = true;
  return { legs, pts: loop.map((p) => [...p]), start };
}

function rouletteWalk(mins) {
  // Longer walks plan on a coarser grid so turns stay a few minutes apart.
  const blocks = mins / BLOCK_MIN;
  const scale = Math.max(1, Math.round(blocks / 16));
  const plan = planLoop(Math.max(4, Math.round(blocks / scale / 2) * 2));
  plan.legs.forEach((l) => { l.len *= scale; });
  rr = { mins, legs: plan.legs, at: 0 };
  // ct drives the shared doodle: walked legs only, scaled up to doodle units
  ct = { heading: 0, pts: [[0, 0]], marks: [] };
  const unit = ROULETTE.unit[where];
  const k = where === 'home' ? STEPS_PER_UNIT : 1;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'doodle');
  const wheel = h('div', { class: 'arrow', id: 'arrow' });
  const then = h('p', { class: 'leg', id: 'leg' });
  const twist = h('p', { class: 'sub centre twist', id: 'twist' });
  const togo = h('span', { class: 'count', id: 'togo' });
  const top = bar(); top.append(togo);
  const nextBtn = h('button', { class: 'btn jewel', id: 'corner' });

  const blocksLeft = () => rr.legs.slice(rr.at).reduce((t, l) => t + l.len, 0);
  const showLeg = () => {
    const leg = rr.legs[rr.at];
    wheel.textContent = rr.at === 0 ? `${ROULETTE.door[where]} ${leg.turn}` : ROULETTE.dirs[leg.turn];
    then.textContent = leg.home && rr.at > 0 ? ROULETTE.homeAhead(leg.len * k, unit) : ROULETTE.walk(leg.len * k, unit);
    twist.textContent = rr.at && Math.random() < 0.3 ? pick(ROULETTE.twists) : '';
    togo.textContent = ROULETTE.toGo(Math.round(blocksLeft() * BLOCK_MIN));
    nextBtn.textContent = leg.home ? ROULETTE.arrived : ROULETTE.next;
    wheel.classList.remove('flash'); void wheel.offsetWidth; wheel.classList.add('flash');
    drawDoodle(svg, true);
  };
  nextBtn.addEventListener('click', () => {
    const leg = rr.legs[rr.at];
    const last = ct.pts.at(-1);
    ct.pts.push([last[0] + leg.d[0] * 40 * leg.len, last[1] + leg.d[1] * 40 * leg.len]);
    rr.at++;
    if (rr.at >= rr.legs.length) return rouletteEnd(true);
    showLeg();
  });
  show(
    top,
    svg,
    wheel,
    then,
    twist,
    h('div', { class: 'btns' }, nextBtn, h('button', { class: 'btn ghost', id: 'rouletteDone', onclick: () => rouletteEnd(false) }, ROULETTE.done)),
  );
  showLeg();
}

function rouletteEnd(home) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'doodle');
  const turns = rr.legs.length - 1;
  show(
    bar(),
    h('h2', { class: 'display' }, home ? ROULETTE.endTitle : ROULETTE.title),
    h('p', { class: 'sub' }, home ? ROULETTE.endLine(turns, rr.mins) : ROULETTE.stopped),
    svg,
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', onclick: goHome }, ROULETTE.again)),
  );
  drawDoodle(svg, home ? 'loop' : false);
}

/* ---------- boot: ?v=<walk or quest> opens it straight away ---------- */
more = register({ h, show, bar, openSheet, closeSheet, cameraControls, realPhoto, pretendPhoto, pick, shuffle, goHome, where: () => where, setLeave: (f) => { leave = f; } });
window.__ww = more; // lets the headless test reach the fog walk's shortcut
const v = new URLSearchParams(location.search).get('v') || location.hash.slice(1);
if (v === 'home') where = 'home';
if (ALL.some((w) => w.id === v) || QUESTS.some((q) => q.id === v)) start(v); else goHome();
