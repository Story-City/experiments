// Fog mode, home map: your own map from the home screen with no story running.
// Ground you've walked this week is already clear, gems glow through the fog,
// nearby stories sit on top as pins (a couple more hide under the fog), and
// "Go for a Wander" clears more as you walk. Same fog looks as the story view.

const { COPY, HOME, STORIES } = await import(`./copy.js${window.CACHE_V || ''}`);
const { LOOKS } = await import(`./fog-looks.js${window.CACHE_V || ''}`);

const params = new URLSearchParams(location.search);
const W = 390;
const H = 640;
const START = [195, 380];
const TRAIL_R = 30;
const STEP_PX = 1.4;
const PACE = 34;
// Walks from earlier this week, already cleared when you open the map.
const HISTORY = [
  [[195, 380], [195, 300], [120, 300], [120, 230]],
  [[195, 380], [195, 470], [120, 470]],
  [[195, 300], [195, 230]],
];
// Where "Go for a Wander" goes: a loop out east past Maple Park and back.
const WANDER = [[195, 380], [280, 380], [280, 230], [280, 160], [360, 160], [360, 380], [280, 380], [195, 380]];
const GEMS = [
  { at: [120, 250], color: '#00CD9D', found: true }, // emerald, found earlier this week
  { at: [282, 200], color: '#ED8D00' }, // amber, by Maple Park
  { at: [255, 470], color: '#35C6D7' }, // turquoise
];

const NS = 'http://www.w3.org/2000/svg';
const $ = (id) => document.getElementById(id);
const svg = $('map');
const over = $('overlay');
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.append(n);
  return n;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const pathLen = (pts) => pts.slice(1).reduce((s, p, i) => s + dist(pts[i], p), 0);
function pointAt(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const seg = dist(pts[i - 1], pts[i]);
    if (d <= seg) return [pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * d) / seg, pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * d) / seg];
    d -= seg;
  }
  return pts[pts.length - 1];
}

// --- base map (under the fog) --------------------------------------------------
(function drawStreets() {
  el('rect', { width: W, height: H, class: 'ground' }, svg);
  const xs = [0, 40, 120, 195, 280, 360, 390];
  const ys = [0, 90, 160, 230, 300, 380, 470, 560, 640];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      const park = (i === 4 && j === 1) || (i === 1 && j === 5);
      el('rect', { x: xs[i] + 8, y: ys[j] + 8, width: Math.max(0, xs[i + 1] - xs[i] - 16), height: Math.max(0, ys[j + 1] - ys[j] - 16), rx: 6, class: park ? 'park' : 'block' }, svg);
    }
  }
  xs.slice(1, -1).forEach((x) => el('line', { x1: x, y1: 0, x2: x, y2: H, class: x === 195 ? 'road main' : 'road' }, svg));
  ys.slice(1, -1).forEach((y) => el('line', { x1: 0, y1: y, x2: W, y2: y, class: y === 300 ? 'road main' : 'road' }, svg));
  [[300, 110], [330, 130], [312, 145], [345, 112], [70, 400], [95, 430], [62, 448]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 9, class: 'tree' }, svg));
  const t1 = el('text', { x: 320, y: 104, class: 'label', 'text-anchor': 'middle' }, svg);
  t1.textContent = 'Maple Park';
  const t2 = el('text', { x: 203, y: 294, class: 'label small' }, svg);
  t2.textContent = 'Main St';
})();
const gemEls = GEMS.map((g) => {
  const n = el('g', { transform: `translate(${g.at[0]} ${g.at[1]})`, class: 'gem' }, svg);
  el('path', { d: 'M0 -9 l8 7 -8 11 -8 -11z', style: `fill:${g.color}` }, n);
  return { ...g, found: !!g.found, n };
});

// --- the fog (same engine as the story view) -----------------------------------
let look = LOOKS[params.get('fog')] ? params.get('fog') : 'clouds';
const RES = 2;
const canvas = $('fog');
const ctx = canvas.getContext('2d');
const layer = document.createElement('canvas');
const lctx = layer.getContext('2d');
const mask = document.createElement('canvas');
mask.width = W * RES;
mask.height = H * RES;
const mctx = mask.getContext('2d');
let layerRes = 1;
let rimVersion = 0;
let fogDirty = true;
let view = { s: 1, ox: 0 };
const t0 = performance.now();
const CELL = 5;
const GX = W / CELL;
const GY = H / CELL;
let grid = new Uint8Array(GX * GY);
const cleared = () => Math.round((grid.reduce((s, v) => s + v, 0) / grid.length) * 100);
const isClear = ([x, y]) => grid[Math.min(GY - 1, Math.floor(y / CELL)) * GX + Math.min(GX - 1, Math.floor(x / CELL))] === 1;

function paintLayer() {
  const L = LOOKS[look];
  layerRes = L.animated ? 1 : RES;
  if (layer.width !== W * layerRes) { layer.width = W * layerRes; layer.height = H * layerRes; }
  lctx.setTransform(layerRes, 0, 0, layerRes, 0, 0);
  lctx.clearRect(0, 0, W, H);
  L.paint(lctx, (performance.now() - t0) / 1000);
}
function clearAt(x, y, r) {
  mctx.save();
  mctx.scale(RES, RES);
  const g = mctx.createRadialGradient(x, y, r * 0.45, x, y, r);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  mctx.fillStyle = g;
  mctx.beginPath();
  mctx.arc(x, y, r, 0, Math.PI * 2);
  mctx.fill();
  mctx.restore();
  rimVersion++;
  const inner = r * 0.75;
  for (let gy = Math.max(0, Math.floor((y - inner) / CELL)); gy <= Math.min(GY - 1, Math.floor((y + inner) / CELL)); gy++) {
    for (let gx = Math.max(0, Math.floor((x - inner) / CELL)); gx <= Math.min(GX - 1, Math.floor((x + inner) / CELL)); gx++) {
      if (Math.hypot(gx * CELL + CELL / 2 - x, gy * CELL + CELL / 2 - y) <= inner) grid[gy * GX + gx] = 1;
    }
  }
  fogDirty = true;
}
function clearPath(pts, r) {
  const len = pathLen(pts);
  for (let d = 0; d <= len; d += 4) { const [x, y] = pointAt(pts, d); clearAt(x, y, r); }
}
function sizeFog() {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(r.width * dpr);
  canvas.height = Math.round(r.height * dpr);
  const s = Math.max(r.width / W, r.height / H);
  view = { s: s * dpr, ox: ((r.width - W * s) / 2) * dpr };
  fogDirty = true;
}
let rimKey = '';
const rimOut = document.createElement('canvas');
function rimTinted(c) {
  const key = c.join() + '/' + rimVersion;
  if (key === rimKey) return rimOut;
  rimKey = key;
  rimOut.width = mask.width;
  rimOut.height = mask.height;
  const r = rimOut.getContext('2d');
  r.drawImage(mask, 0, 0);
  r.globalCompositeOperation = 'source-in';
  r.fillStyle = `rgb(${c.join()})`;
  r.fillRect(0, 0, rimOut.width, rimOut.height);
  return rimOut;
}
function drawFog() {
  const animated = LOOKS[look].animated;
  if (!fogDirty && !animated) return;
  fogDirty = false;
  if (animated) paintLayer();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(view.s / layerRes, 0, 0, view.s / layerRes, view.ox, 0);
  ctx.drawImage(layer, 0, 0);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.setTransform(view.s / RES, 0, 0, view.s / RES, view.ox, 0);
  ctx.drawImage(mask, 0, 0);
  const tint = LOOKS[look].rim;
  if (tint) {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = 0.9;
    ctx.drawImage(rimTinted(tint), 0, 0);
    ctx.globalAlpha = 1;
  }
  ctx.globalCompositeOperation = 'source-over';
}
window.addEventListener('resize', sizeFog);
function setLook(k) {
  look = k;
  const u = new URL(location.href);
  u.searchParams.set('fog', k);
  history.replaceState(null, '', u);
  document.body.dataset.look = k;
  paintLayer();
  fogDirty = true;
}

// --- overlay (above the fog) ---------------------------------------------------
const defs = el('defs', {}, over);
defs.innerHTML = '<filter id="gemGlow" x="-2" y="-2" width="5" height="5"><feGaussianBlur stdDeviation="9"/></filter><filter id="fogBlur" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="2.6"/></filter>';
const historyG = el('g', { class: 'history' }, over);
const glints = el('g', {}, over);
const trails = el('g', {}, over);
const pins = el('g', {}, over);
const me = el('g', { class: 'me' }, over);
el('circle', { r: 16, class: 'pulse' }, me);
el('circle', { r: 7, class: 'dot' }, me);

function drawGlints() {
  glints.innerHTML = '';
  gemEls.filter((g) => !g.found).forEach((g) => {
    const n = el('g', { class: 'fog-gem', transform: `translate(${g.at[0]} ${g.at[1]})`, style: `color:${g.color}` }, glints);
    el('circle', { r: 15, class: 'fog-gem-glow' }, n);
    el('path', { d: 'M0 -9 l8 7 -8 11 -8 -11z', class: 'fog-gem-ghost' }, n);
  });
}
const BOOK = 'M-5 -4 h4 a2 2 0 0 1 1 1 v8 a2 2 0 0 0 -1 -1 h-4z M5 -4 h-4 a2 2 0 0 0 -1 1 v8 a2 2 0 0 1 1 -1 h4z';
const storyState = STORIES.map((s) => ({ ...s, shown: !s.hidden }));
function drawPins() {
  pins.innerHTML = '';
  storyState.filter((s) => s.shown).forEach((s) => {
    const g = el('g', { class: `story-pin${s.id === selected ? ' on' : ''}`, transform: `translate(${s.at[0]} ${s.at[1]})`, 'data-id': s.id }, pins);
    el('circle', { r: 20, class: 'hit' }, g);
    el('circle', { r: 13, class: 'pin-ring' }, g);
    el('path', { d: BOOK, class: 'pin-book' }, g);
    g.addEventListener('click', () => openStory(s.id));
  });
}

// --- state + UI --------------------------------------------------------------------
const state = { pos: START.slice(), walking: false, along: 0, walks: 3, lastClear: [-99, -99], lastDot: 0, stepped: 0 };
let selected = null;
function place() { me.setAttribute('transform', `translate(${state.pos[0]} ${state.pos[1]})`); }

function toast(text) {
  const t = $('toast');
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, 2600);
}

function renderHud() {
  $('chip').textContent = HOME.chip;
  $('hudTitle').textContent = HOME.title;
  $('uncovered').textContent = COPY.uncovered(cleared());
  $('week').textContent = HOME.week(state.walks, gemEls.filter((g) => g.found).length);
}
function renderCard() {
  $('hint').textContent = HOME.hint;
  $('nearLabel').textContent = HOME.nearLabel;
  const near = $('near');
  near.innerHTML = '';
  storyState.filter((s) => s.shown).forEach((s) => {
    const b = document.createElement('button');
    b.className = `near-story${s.id === selected ? ' on' : ''}`;
    b.innerHTML = `<span class="ns-name">${s.name}</span><span class="ns-meta">${s.meta}</span>`;
    b.addEventListener('click', () => openStory(s.id));
    near.append(b);
  });
  renderActions();
}
function renderActions() {
  const act = $('actions');
  act.innerHTML = '';
  const b = document.createElement('button');
  b.className = 'btn primary walk';
  b.textContent = state.walking ? HOME.pause : state.stepped ? HOME.keep : HOME.wander;
  b.addEventListener('click', toggleWander);
  act.append(b);
}

function openStory(id) {
  const s = storyState.find((x) => x.id === id);
  selected = id;
  drawPins();
  renderCard();
  const sh = $('sheet');
  sh.innerHTML = `<div class="sheet-card"><div class="kicker">${s.meta}</div><h1>${s.name}</h1><p>${s.blurb}</p>
    <button class="btn primary" id="go">${HOME.start}</button><button class="btn ghost" id="no">${HOME.close}</button></div>`;
  sh.hidden = false;
  document.body.classList.add('sheet-open');
  sh.querySelector('#go').addEventListener('click', () => { closeSheet(); toast(HOME.starting(s.name)); });
  sh.querySelector('#no').addEventListener('click', closeSheet);
}
function closeSheet() {
  $('sheet').hidden = true;
  document.body.classList.remove('sheet-open');
  selected = null;
  drawPins();
  renderCard();
}
$('sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') closeSheet(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('sheet').hidden) closeSheet(); });

// --- wandering -----------------------------------------------------------------------
let raf = 0;
let last = 0;
function toggleWander() {
  if (state.walking) { state.walking = false; cancelAnimationFrame(raf); renderActions(); return; }
  if (!state.stepped) toast(HOME.wanderToast);
  state.walking = true;
  last = performance.now();
  raf = requestAnimationFrame(tick);
  renderActions();
}
function checkFinds() {
  gemEls.forEach((g) => {
    if (g.found || !isClear(g.at)) return;
    g.found = true;
    g.n.classList.add('found');
    toast(HOME.gemFound);
  });
  storyState.forEach((s) => {
    if (s.shown || !isClear(s.at)) return;
    s.shown = true;
    toast(HOME.storyFound(s.name));
    drawPins();
    renderCard();
  });
  drawGlints();
}
function tick(now) {
  if (!state.walking) return;
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const px = PACE * dt * STEP_PX;
  const len = pathLen(WANDER);
  state.along = (state.along + px) % len;
  state.stepped += px / STEP_PX;
  state.pos = pointAt(WANDER, state.along);
  if (state.stepped - state.lastDot >= 6) {
    el('circle', { cx: state.pos[0], cy: state.pos[1], r: 2.6, class: 'crumb', fill: '#F5B82E' }, trails);
    state.lastDot = state.stepped;
  }
  if (dist(state.pos, state.lastClear) > 4) { clearAt(state.pos[0], state.pos[1], TRAIL_R); state.lastClear = state.pos.slice(); checkFinds(); }
  place();
  renderHud();
  raf = requestAnimationFrame(tick);
}

function reset() {
  state.walking = false;
  cancelAnimationFrame(raf);
  Object.assign(state, { pos: START.slice(), along: 0, walks: 3, lastClear: [-99, -99], lastDot: 0, stepped: 0 });
  grid = new Uint8Array(GX * GY);
  mctx.clearRect(0, 0, mask.width, mask.height);
  trails.innerHTML = '';
  historyG.innerHTML = '';
  gemEls.forEach((g) => { g.found = !!GEMS.find((x) => x.at === g.at).found; g.n.classList.remove('found'); });
  storyState.forEach((s) => { s.shown = !s.hidden; });
  // earlier walks: cleared, with a faint dotted line so you can see where you went
  HISTORY.forEach((p) => {
    clearPath(p, TRAIL_R);
    el('path', { d: p.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' '), class: 'history-line' }, historyG);
  });
  selected = null;
  place();
  drawGlints();
  drawPins();
  renderHud();
  renderCard();
}

$('lookSlot').innerHTML = `<select class="look" aria-label="${COPY.intro.look}">${Object.entries(LOOKS).map(([k, l]) => `<option value="${k}"${k === look ? ' selected' : ''}>${COPY.intro.look}: ${l.name}</option>`).join('')}</select>`;
$('lookSlot').querySelector('select').addEventListener('change', (e) => setLook(e.target.value));
$('resetBtn').addEventListener('click', reset);
document.body.dataset.look = look;
paintLayer();
sizeFog();
reset();
(function frame() { drawFog(); requestAnimationFrame(frame); })();
