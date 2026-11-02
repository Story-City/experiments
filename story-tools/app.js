import { HOME, FAMILIES, TOOLS, ALREADY, CAMERA, GUIDE } from './tools.js';

const screen = document.getElementById('screen');
const sheet = document.getElementById('sheet');
const scrim = document.getElementById('scrim');
const toastEl = document.getElementById('toast');
const camInput = document.getElementById('camInput');
const phone = document.getElementById('phone');

let leave = [];             // cleanups for the open tool (timers, mic, listeners)
let current = null;         // the tool being tried
TOOLS.forEach((t, i) => { t.no = i + 1; });

/* ---------- tiny helpers ---------- */
function h(tag, attrs = {}, ...kids) {
  const svg = ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'text', 'ellipse', 'defs', 'clipPath', 'radialGradient', 'linearGradient', 'stop'].includes(tag);
  const el = svg ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.setAttribute('class', v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) if (kid != null && kid !== false) el.append(kid);
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
    h('button', { class: 'back', onclick: goHome, 'aria-label': HOME.back }, '‹'),
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

/* ---------- camera: real phone camera, or a sample photo ---------- */
const SAMPLES = ['img/tree-photo.jpg', 'img/snap-green.jpg', 'img/snap-orange.jpg', 'img/snap-yellow.jpg'];
let sampleTurn = 0;
function samplePhoto(i) { return SAMPLES[(i ?? sampleTurn++) % SAMPLES.length]; }

function realPhoto() {
  return new Promise((resolve) => {
    camInput.value = '';
    const done = (url) => { camInput.onchange = camInput.oncancel = null; resolve(url); };
    camInput.onchange = () => { const f = camInput.files[0]; done(f ? URL.createObjectURL(f) : null); };
    camInput.oncancel = () => done(null);
    camInput.click();
  });
}

// Big shutter + "or use a sample photo" link. onPhoto(url) gets the photo.
function camera(label, onPhoto, sample) {
  return h('div', { class: 'cam' },
    h('button', { class: 'shutter', 'aria-label': label, onclick: async () => { const u = await realPhoto(); if (u) onPhoto(u); } }),
    h('span', { class: 'lbl' }, label),
    h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => onPhoto(sample ? sample() : samplePhoto()) }, CAMERA.pretend));
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Each tool can add its own styles once.
function css(id, text) {
  if (document.getElementById(`css-${id}`)) return;
  document.head.append(h('style', { id: `css-${id}` }, text));
}

/* ---------- home: square text-only cards in families ---------- */
function toolCard(t) {
  return h('button', { class: 'walk', 'data-tool': t.id, style: `--jewel:${t.jewel}`, onclick: () => cardBack(t) },
    h('span', { class: 'ghost', 'aria-hidden': 'true' }, t.no),
    h('span', { class: 'mech' }, t.mech),
    h('span', { class: 'star', 'aria-hidden': 'true' }, '✦'),
    h('span', { class: 'title' }, t.name),
    h('span', { class: 'meta' }, t.tags.join(' · ')));
}

// The card turns over into a sheet: the full pitch and the one button.
function cardBack(t) {
  openSheet([
    h('span', { class: 'ghost-no', 'aria-hidden': 'true' }, t.no),
    h('p', { class: 'kicker' }, `Tool no. ${t.no} · ${t.mech}`),
    h('h3', {}, t.name),
    h('p', { class: 'hook' }, t.hook),
    h('p', { class: 'more' }, t.more),
    h('p', { class: 'how' }, t.how.flatMap((step, i) => (i ? [h('i', {}, '✦'), step] : [step]))),
    h('div', { class: 'tags' }, t.tags.map((x) => h('span', { class: 'tag' }, x))),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary', id: 'startTool', onclick: () => start(t.id) }, t.go),
      h('button', { class: 'link', onclick: closeSheet }, HOME.notNow)),
  ], null, t.jewel);
}

function cleanup() {
  for (const fn of leave.splice(0)) { try { fn(); } catch (e) { console.warn(e); } }
}

function goHome() {
  cleanup(); current = null;
  phone.style.removeProperty('--jewel');
  if (location.search) history.replaceState(null, '', location.pathname);
  show(
    h('div', { class: 'home-head' },
      h('p', { class: 'kicker' }, HOME.kicker),
      h('h1', { class: 'display' }, HOME.title),
      h('p', { class: 'sub' }, HOME.sub)),
    FAMILIES.map((f) => [
      h('h2', { class: 'family' }, f.label),
      h('div', { class: 'cards' }, TOOLS.filter((t) => t.family === f.id).map(toolCard)),
    ]),
    h('div', { class: 'btns' }, h('button', { class: 'link', id: 'surprise', onclick: () => cardBack(pick(TOOLS)) }, `✦ ${HOME.surprise}`)),
    h('p', { class: 'already' }, 'Already on the experiments site: ', ALREADY.map((a) => a.board).join(' · ')),
  );
}

async function start(id) {
  cleanup();
  current = TOOLS.find((t) => t.id === id);
  if (!current) return goHome();
  phone.style.setProperty('--jewel', current.jewel);
  history.replaceState(null, '', `?v=${id}`);
  const mod = await import(`./tools/${id}.js${window.CACHE_V || ''}`);
  const kit = {
    h, pick, shuffle, show, bar, toast, openSheet, closeSheet, camera, samplePhoto, loadImage, css,
    tool: current, home: goHome,
    onLeave: (fn) => leave.push(fn),
  };
  if (current.ask) briefing(current, () => mod.default(kit)); else mod.default(kit);
}

// Wren hands over the tool: a couple of chat lines, then the tool's own button.
function briefing(t, go) {
  const thread = h('div', { class: 'thread' });
  const btn = h('button', { class: 'btn jewel', id: 'goTool', onclick: go, hidden: true }, t.go);
  show(
    bar(),
    h('div', { class: 'guide' },
      h('img', { class: 'avatar', src: GUIDE.avatar, alt: '' }),
      h('div', {}, h('b', {}, GUIDE.name), h('span', {}, GUIDE.status))),
    thread,
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, btn),
  );
  let i = 0;
  const next = () => {
    if (i >= t.ask.length) { btn.hidden = false; return; }
    const dots = h('div', { class: 'bubble typing' }, h('i'), h('i'), h('i'));
    thread.append(dots);
    const id = setTimeout(() => {
      dots.replaceWith(h('div', { class: 'bubble' }, t.ask[i++]));
      const after = setTimeout(next, 250);
      leave.push(() => clearTimeout(after));
    }, 650);
    leave.push(() => clearTimeout(id));
  };
  next();
}

const asked = new URLSearchParams(location.search).get('v') || location.hash.slice(1);
if (asked && TOOLS.some((t) => t.id === asked)) start(asked); else goHome();
