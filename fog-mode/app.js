// Fog mode: the map starts under a foggy, topographic-paper layer and clears
// wherever the player has walked: a band of fog lifts behind you as you walk.
// Cleared ground stays clear the next day.
// Walk / Pin / Hunt reuse the map-modes mockup; every mode clears fog.

const { MODES, COPY } = await import(`./copy.js${window.CACHE_V || ''}`);

const params = new URLSearchParams(location.search + location.hash.replace('#', '&'));

const GOAL = 240; // steps to unlock a chapter in Walk mode
const RING_R = 110; // Walk ring radius at the start of a chapter (map px)
const TRAIL_R = 30; // half-width of the band cleared as you walk (A)
const STEP_PX = 1.4; // map pixels per step
const PACE = 34; // steps per second while "walking"
const W = 390;
const H = 640;
const START = [195, 380];
// Pretend streets for each day's walk.
const TRACKS = [
  [[195, 380], [195, 300], [120, 300], [120, 230], [120, 160], [195, 160], [195, 90], [280, 90]],
  [[195, 380], [280, 380], [280, 300], [280, 230], [280, 160], [360, 160], [360, 90]],
];
const PINS = [
  { at: [195, 90], name: 'Clock tower' },
  { at: [280, 200], name: 'The glint' },
];
// Things on the map. Gems glow through the fog in their own colour; stories hide under it.
const HIDDEN = [
  { at: [120, 250], kind: 'gem', color: '#3ddc84' }, // emerald (nature)
  { at: [282, 200], kind: 'gem', color: '#ffb347' }, // amber (landmark)
  { at: [48, 175], kind: 'story' },
  { at: [352, 330], kind: 'story' },
  { at: [110, 540], kind: 'story' },
  { at: [255, 470], kind: 'gem', color: '#33c7d1' }, // turquoise (art)
];
const CLOCK = [195, 90];

const NS = 'http://www.w3.org/2000/svg';
const $ = (id) => document.getElementById(id);
const svg = $('map');
const over = $('overlay');
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.append(n);
  return n;
};
const lerp = (a, b, t) => a + (b - a) * t;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], t))).join(',')})`;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const pathLen = (pts) => pts.slice(1).reduce((s, p, i) => s + dist(pts[i], p), 0);
function pointAt(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const seg = dist(pts[i - 1], pts[i]);
    if (d <= seg) return [lerp(pts[i - 1][0], pts[i][0], d / seg), lerp(pts[i - 1][1], pts[i][1], d / seg)];
    d -= seg;
  }
  return pts[pts.length - 1];
}
const poly = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

// --- base map (under the fog) ------------------------------------------------
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
  const dest = el('g', { transform: `translate(${CLOCK[0]} ${CLOCK[1]})`, class: 'dest' }, svg);
  el('circle', { r: 13 }, dest);
  el('path', { d: 'M0 -6 v6 l4 3' }, dest);
})();

const hiddenEls = HIDDEN.map((h) => {
  const g = el('g', { transform: `translate(${h.at[0]} ${h.at[1]})`, class: h.kind }, svg);
  if (h.kind === 'story') { el('circle', { r: 11 }, g); el('path', { d: 'M-5 -4 h4 a2 2 0 0 1 1 1 v8 a2 2 0 0 0 -1 -1 h-4z M5 -4 h-4 a2 2 0 0 0 -1 1 v8 a2 2 0 0 1 1 -1 h4z' }, g); }
  else el('path', { d: 'M0 -9 l8 7 -8 11 -8 -11z', style: `fill:${h.color}` }, g);
  return { ...h, found: false, g };
});

// --- the fog -----------------------------------------------------------------
// layer: the fog itself, painted by the chosen look (fog-looks.js).
// mask: everywhere that's been cleared (white), at RES pixels per map unit.
const { LOOKS } = await import(`./fog-looks.js${window.CACHE_V || ''}`);
let look = LOOKS[params.get('fog')] ? params.get('fog') : 'swirl';
const RES = 2;
const canvas = $('fog');
const ctx = canvas.getContext('2d');
const layer = document.createElement('canvas');
const lctx = layer.getContext('2d');
const mask = document.createElement('canvas');
mask.width = W * RES;
mask.height = H * RES;
const mctx = mask.getContext('2d');
let rimVersion = 0; // bumps whenever the mask changes, so the edge glow is re-tinted
let layerRes = 1;
const t0 = performance.now();

// Animated looks repaint every frame at 1 px per map unit (soft anyway);
// still looks paint once, sharper.
function paintLayer() {
  const L = LOOKS[look];
  layerRes = L.animated ? 1 : RES;
  if (layer.width !== W * layerRes) { layer.width = W * layerRes; layer.height = H * layerRes; }
  lctx.setTransform(layerRes, 0, 0, layerRes, 0, 0);
  lctx.clearRect(0, 0, W, H);
  L.paint(lctx, (performance.now() - t0) / 1000);
}
function setLook(k) {
  look = k;
  document.querySelectorAll('select.look').forEach((s) => { s.value = k; });
  const u = new URL(location.href);
  u.searchParams.set('fog', k);
  history.replaceState(null, '', u);
  document.body.dataset.look = k;
  paintLayer();
  fogDirty = true;
}
const lookPicker = () => `<select class="look" aria-label="${COPY.intro.look}">${Object.entries(LOOKS).map(([k, l]) => `<option value="${k}"${k === look ? ' selected' : ''}>${COPY.intro.look}: ${l.name}</option>`).join('')}</select>`;

// Coverage grid for the "% uncovered" number and for finding hidden things.
const CELL = 5;
const GX = W / CELL;
const GY = H / CELL;
let grid = new Uint8Array(GX * GY);
const cleared = () => Math.round((grid.reduce((s, v) => s + v, 0) / grid.length) * 100);
const isClear = ([x, y]) => grid[Math.min(GY - 1, Math.floor(y / CELL)) * GX + Math.min(GX - 1, Math.floor(x / CELL))] === 1;

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

let fogDirty = true;
let view = { s: 1, ox: 0 };
function sizeFog() {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(r.width * dpr);
  canvas.height = Math.round(r.height * dpr);
  // match the SVG's xMidYMin slice
  const s = Math.max(r.width / W, r.height / H);
  view = { s: s * dpr, ox: ((r.width - W * s) / 2) * dpr };
  fogDirty = true;
}
function drawFog() {
  const animated = LOOKS[look].animated;
  if (!fogDirty && !animated) return;
  fogDirty = false;
  if (animated) paintLayer();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';
  ctx.setTransform(view.s / layerRes, 0, 0, view.s / layerRes, view.ox, 0);
  ctx.drawImage(layer, 0, 0);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.setTransform(view.s / RES, 0, 0, view.s / RES, view.ox, 0);
  ctx.drawImage(mask, 0, 0);
  const tint = LOOKS[look].rim;
  if (tint) {
    // light the soft edge left between fog and cleared ground
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = 0.9;
    ctx.drawImage(rimTinted(tint), 0, 0);
    ctx.globalAlpha = 1;
  }
  ctx.globalCompositeOperation = 'source-over';
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
window.addEventListener('resize', sizeFog);

// --- overlay (above the fog) -------------------------------------------------
const defs = el('defs', {}, over);
defs.innerHTML = '<filter id="gemGlow" x="-2" y="-2" width="5" height="5"><feGaussianBlur stdDeviation="9"/></filter><filter id="fogBlur" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="2.6"/></filter>';
const glints = el('g', {}, over);
const trails = el('g', {}, over);
const live = el('g', {}, over);
const me = el('g', { class: 'me' }, over);
el('circle', { r: 16, class: 'pulse' }, me);
el('circle', { r: 7, class: 'dot' }, me);

function drawGlints() {
  glints.innerHTML = '';
  hiddenEls.filter((h) => h.kind === 'gem' && !h.found).forEach((h) => {
    // a gem under the fog: its colour glows through, soft and blurred, so you
    // know something's there before you can see what it is
    const g = el('g', { class: 'fog-gem', transform: `translate(${h.at[0]} ${h.at[1]})`, style: `color:${h.color}` }, glints);
    el('circle', { r: 15, class: 'fog-gem-glow' }, g);
    el('path', { d: 'M0 -9 l8 7 -8 11 -8 -11z', class: 'fog-gem-ghost' }, g);
  });
}

// --- state -------------------------------------------------------------------
const state = {
  day: 0,
  mode: 'walk',
  pos: START.slice(),
  walked: 0,
  walking: false,
  indoor: false,
  unlocked: false,
  chapterStart: START.slice(),
  path: null,
  along: 0,
  lastDot: 0,
  lastClear: [-99, -99],
  todayStart: 0,
};
const day = () => COPY.days[state.day];
const PIN = () => PINS[state.day];

function place() { me.setAttribute('transform', `translate(${state.pos[0]} ${state.pos[1]})`); }

function pinRoute(from) {
  const at = PIN().at;
  const onVertical = [40, 120, 195, 280, 360].some((x) => Math.abs(from[0] - x) < 1);
  return onVertical ? [from, [from[0], at[1]], at] : [from, [at[0], from[1]], at];
}
function walkPath(from) {
  const track = TRACKS[state.day];
  let best = 0;
  track.forEach((p, i) => { if (dist(p, from) < dist(track[best], from)) best = i; });
  const ahead = track.slice(best + (dist(track[best], from) < 1 ? 1 : 0));
  return ahead.length ? [from, ...ahead] : [from, ...track.slice(0, -1).reverse()];
}

let ring;
let routeEl;
function drawMode() {
  live.innerHTML = '';
  ring = routeEl = null;
  const { mode } = state;
  document.body.dataset.mode = mode;
  $('viewfinder').hidden = mode !== 'hunt' || state.unlocked;
  $('chip').textContent = MODES[mode].chip;
  if (!state.unlocked) {
    if (mode === 'walk') {
      ring = el('circle', { class: 'ring', r: 0 }, live);
    } else if (mode === 'pin') {
      routeEl = el('path', { d: poly(pinRoute(state.pos)), class: 'route' }, live);
      const pin = el('g', { class: 'pin', transform: `translate(${PIN().at[0]} ${PIN().at[1]})` }, live);
      el('path', { d: 'M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z', class: 'pin-body' }, pin);
      el('circle', { cy: -24, r: 4, class: 'pin-icon' }, pin);
      const t = el('text', { x: 0, y: -44, class: 'label pin-label', 'text-anchor': 'middle' }, pin);
      t.textContent = PIN().name;
    } else {
      const zone = el('g', { class: 'zone', 'data-follow': '1', transform: `translate(${state.pos[0]} ${state.pos[1]})` }, live);
      el('circle', { r: 110, class: 'zone-fill' }, zone);
      el('circle', { r: 110, class: 'zone-edge' }, zone);
      el('path', { d: 'M0 0 L110 0 A110 110 0 0 0 78 -78 Z', class: 'sweep' }, zone);
    }
  }
  update();
}

const stepsToPin = () => Math.round(pathLen(pinRoute(state.pos)) / STEP_PX);

function update() {
  const left = Math.max(0, GOAL - Math.round(state.walked));
  const t = Math.min(1, state.walked / GOAL);
  if (ring) {
    ring.setAttribute('cx', state.pos[0]);
    ring.setAttribute('cy', state.pos[1]);
    ring.setAttribute('r', ((left / GOAL) * RING_R).toFixed(1));
    ring.setAttribute('stroke', mix(css('--walk-start'), css('--walk-end'), t));
  }
  live.querySelectorAll('[data-follow]').forEach((g) => g.setAttribute('transform', `translate(${state.pos[0]} ${state.pos[1]})`));
  if (routeEl && !state.unlocked) routeEl.setAttribute('d', poly(state.mode === 'pin' && state.path ? [state.pos, ...state.path.filter((p, i) => i > 0 && pathLen(state.path.slice(0, i + 1)) > state.along)] : pinRoute(state.pos)));

  $('uncovered').textContent = COPY.uncovered(cleared());
  let title = '';
  if (state.unlocked) title = COPY.unlocked;
  else if (state.mode === 'walk') title = `${left} steps to go`;
  else if (state.mode === 'pin') title = COPY.pinTitle(PIN().name, stepsToPin());
  else title = `Find ${day().huntFind}`;
  $('hudTitle').textContent = title;
  renderSwitch();
  renderCard();
}

let switchKey = '';
let cardKey = '';
const ICONS = {
  walk: '<svg viewBox="0 0 24 24"><circle cx="13" cy="4" r="2"/><path d="M10 21l2-6 3 3v3M9 12l2-4 4 2 2 3M11 8l-3 2-1 3"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  hunt: '<svg viewBox="0 0 24 24"><path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3"/><circle cx="12" cy="12" r="3"/></svg>',
};
function renderSwitch() {
  const key = [state.mode, state.unlocked, state.indoor].join();
  if (key === switchKey) return;
  switchKey = key;
  const sw = $('switch');
  sw.innerHTML = '';
  Object.entries(MODES).forEach(([k, m]) => {
    const b = document.createElement('button');
    b.className = `seg seg-${k}`;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(state.mode === k));
    b.innerHTML = `<span class="seg-icon">${ICONS[k]}</span><span>${m.label}</span>`;
    b.disabled = state.unlocked || (state.indoor && k !== 'walk');
    b.addEventListener('click', () => switchTo(k));
    sw.append(b);
  });
}

function renderCard() {
  const { mode, walked } = state;
  $('storyName').textContent = `${COPY.storyName} · ${day().chapter}`;
  $('next').innerHTML = `Next: <b>${day().next}</b>`;
  $('hint').textContent = state.indoor ? COPY.hint.indoor : COPY.hint.walk;
  const st = $('status');
  const act = $('actions');
  const key = [mode, state.walking, state.unlocked, state.indoor, walked > 0, state.day].join();
  const rebuild = key !== cardKey;
  cardKey = key;
  if (rebuild) act.innerHTML = '';
  const left = Math.max(0, GOAL - Math.round(walked));
  const btn = (text, cls, fn) => {
    if (!rebuild) return document.createElement('button');
    const b = document.createElement('button');
    b.className = `btn ${cls}`;
    b.textContent = text;
    b.addEventListener('click', fn);
    act.append(b);
    return b;
  };
  const walkLabel = state.walking ? COPY.walkBtn.pause : walked ? COPY.walkBtn.keep : COPY.walkBtn.start;

  if (state.unlocked) {
    st.innerHTML = `<div class="done">✓ ${COPY.unlocked}</div><div class="row">${COPY.unlockedToday(Math.max(0, cleared() - state.todayStart))}</div>`;
    if (state.day === 0) { btn(COPY.read, 'ghost', () => toast('(Chapter 2 plays here)')); btn(COPY.tomorrow, 'primary', dayTwo); }
    else btn(COPY.read, 'primary', showEnd);
    return;
  }
  if (mode === 'walk') {
    st.innerHTML = `<div class="row">${state.indoor ? COPY.indoorStatus(left) : COPY.walkStatus(left)}</div><div class="bar"><i style="width:${Math.min(100, (walked / GOAL) * 100)}%"></i></div>`;
    btn(walkLabel, 'primary walk', toggleWalk);
    if (!state.indoor && state.day === 0) btn(COPY.indoorBtn, 'ghost', goIndoor);
  } else if (mode === 'pin') {
    st.innerHTML = `<div class="row">${COPY.pinStatus(PIN().name, stepsToPin())}</div>`;
    btn(walkLabel, 'primary pin', toggleWalk);
  } else {
    st.innerHTML = `<div class="row">${COPY.huntStatus(day().huntFind)}</div>`;
    btn('', 'shutter', snap).setAttribute('aria-label', 'Take photo');
  }
}

function toast(text) {
  const t = $('toast');
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, 2600);
}

function switchTo(mode) {
  if (mode === state.mode || state.unlocked) return;
  const wasWalking = state.walking;
  stopWalking();
  state.mode = mode;
  drawMode();
  if (state.walked >= 1) toast(COPY.switchToast(Math.round(state.walked)));
  if (wasWalking && mode === 'pin') toggleWalk();
  if (mode === 'hunt') startWander();
}

// --- walking -----------------------------------------------------------------
let raf = 0;
let last = 0;
function stopWalking() {
  state.walking = false;
  cancelAnimationFrame(raf);
}
function toggleWalk() {
  if (state.walking) { stopWalking(); renderCard(); return; }
  state.walking = true;
  state.path = state.mode === 'pin' ? pinRoute(state.pos) : walkPath(state.pos);
  state.along = 0;
  last = performance.now();
  raf = requestAnimationFrame(tick);
  renderCard();
}
function startWander() {
  state.walking = true;
  state.path = walkPath(state.pos);
  state.along = 0;
  last = performance.now();
  raf = requestAnimationFrame(tick);
}
function goIndoor() {
  stopWalking();
  state.indoor = true;
  document.body.classList.add('indoor');
  toast(COPY.indoorOn);
  drawMode();
}

function dropDot() {
  const t = Math.min(1, state.walked / GOAL);
  const fill = state.mode === 'walk' ? mix(css('--walk-start'), css('--walk-end'), t) : state.mode === 'pin' ? css('--pin') : css('--hunt');
  el('circle', { cx: state.pos[0], cy: state.pos[1], r: 2.6, fill, class: 'crumb' }, trails);
}

function checkFinds() {
  hiddenEls.forEach((h) => {
    if (h.found || !isClear(h.at)) return;
    h.found = true;
    h.g.classList.add('found');
    toast(h.kind === 'gem' ? COPY.gemFound : COPY.storyFound);
    sparkle(h.at, h.kind === 'gem' ? css('--gem') : css('--story'));
  });
  drawGlints();
}

function tick(now) {
  if (!state.walking) return;
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const pace = state.mode === 'hunt' ? PACE * 0.45 : PACE;
  const stepPx = pace * dt * STEP_PX;
  state.walked += stepPx / STEP_PX;
  if (state.indoor) {
    // indoor steps: you stay put; the fog lifts in a slow spiral round the
    // place the chapter is headed
    const a = state.walked * 0.11;
    const r = 8 + state.walked * 0.22;
    clearAt(CLOCK[0] + Math.cos(a) * r, CLOCK[1] + Math.sin(a) * r * 0.8, 26);
    checkFinds();
    if (state.walked >= GOAL) return unlock();
    update();
    raf = requestAnimationFrame(tick);
    return;
  }
  const len = pathLen(state.path);
  state.along = Math.min(len, state.along + stepPx);
  state.pos = pointAt(state.path, state.along);
  if (state.walked - state.lastDot >= 6) { dropDot(); state.lastDot = state.walked; }
  if (dist(state.pos, state.lastClear) > 4) {
    clearAt(state.pos[0], state.pos[1], TRAIL_R);
    state.lastClear = state.pos.slice();
    checkFinds();
  }
  place();
  if (state.mode === 'walk' && state.walked >= GOAL) return unlock();
  if (state.mode === 'pin' && state.along >= len - 0.5) return unlock();
  if (state.along >= len - 0.5) { state.path = walkPath(state.pos); state.along = 0; }
  update();
  raf = requestAnimationFrame(tick);
}

function sparkle(at, color) {
  const g = el('g', { class: 'burst', transform: `translate(${at[0]} ${at[1]})` }, over);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    el('line', { x1: Math.cos(a) * 10, y1: Math.sin(a) * 10, x2: Math.cos(a) * 24, y2: Math.sin(a) * 24, stroke: color }, g);
  }
  setTimeout(() => g.remove(), 900);
}

function unlock() {
  stopWalking();
  state.unlocked = true;
  $('viewfinder').hidden = true;
  sparkle(state.pos, css('--walk-end'));
  drawMode();
}

// --- pretend camera (Hunt) ---------------------------------------------------
function snap() {
  stopWalking();
  const cam = document.createElement('div');
  cam.className = 'cam';
  cam.innerHTML = `<div class="cam-view"><img src="img/tree-photo.jpg" alt=""></div>
    <div class="cam-top">Pointing at ${day().huntFind}…</div><div class="cam-focus"></div>
    <div class="cam-bottom"><span>PHOTO</span><button class="cam-shutter" aria-label="Take photo"></button></div><div class="cam-flash"></div>`;
  $('phone').append(cam);
  let done = false;
  const shoot = () => {
    if (done) return;
    done = true;
    cam.classList.add('snapped');
    setTimeout(() => { cam.remove(); unlock(); }, 380);
  };
  cam.querySelector('.cam-shutter').addEventListener('click', shoot);
  setTimeout(shoot, 1700);
}

// --- sheets: intro, next day, end --------------------------------------------
function sheet(html, wire) {
  const s = $('sheet');
  s.innerHTML = `<div class="sheet-card">${html}</div>`;
  s.hidden = false;
  document.body.classList.add('sheet-open');
  wire(s);
}
function closeSheet() {
  $('sheet').hidden = true;
  document.body.classList.remove('sheet-open');
}

function showIntro() {
  document.body.classList.add('asking'); // no dot or ring until location is on
  sheet(`<div class="kicker">${COPY.intro.kicker}</div><h1>${COPY.intro.title}</h1><p>${COPY.intro.body}</p>
    ${lookPicker()}
    <button class="btn primary" id="go">${COPY.intro.start}</button>`, (s) => {
    s.querySelector('select.look').addEventListener('change', (e) => setLook(e.target.value));
    s.querySelector('#go').addEventListener('click', () => { closeSheet(); askLocation(); });
  });
}

// Opening: the map is all fog while the app asks for location. Allow and it
// lifts around you; say no and you play from home.
function askLocation() {
  document.body.classList.add('asking');
  const c = $('chat');
  const A = COPY.ask;
  c.hidden = false;
  c.innerHTML = `<div class="bubble-from">${A.from}</div>${A.lines.map((l, i) => `<div class="bubble" style="animation-delay:${0.2 + i * 0.7}s">${l}</div>`).join('')}<button class="bubble me-reply" style="animation-delay:${0.4 + A.lines.length * 0.7}s">${A.reply}</button>`;
  c.querySelector('.me-reply').addEventListener('click', () => {
    sheet(`<div class="os"><h2>${A.osTitle}</h2><p>${A.osBody}</p><button class="os-btn" id="allow">${A.allow}</button><button class="os-btn" id="deny">${A.deny}</button></div>`, (s) => {
      s.querySelector('#allow').addEventListener('click', () => answer(true));
      s.querySelector('#deny').addEventListener('click', () => answer(false));
    });
  });
}
function answer(allowed) {
  closeSheet();
  $('chat').hidden = true;
  document.body.classList.remove('asking');
  if (allowed) {
    const t0 = performance.now();
    (function lift(now) {
      const k = Math.min(1, (now - t0) / 900);
      clearAt(START[0], START[1], 12 + 50 * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(lift);
      else { state.todayStart = cleared(); update(); }
    })(t0);
    toast(COPY.ask.allowed);
    drawMode();
  } else {
    goIndoor();
    toast(COPY.ask.denied);
  }
}

function startDay(n) {
  stopWalking();
  Object.assign(state, { day: n, mode: 'walk', pos: START.slice(), walked: 0, unlocked: false, indoor: false, lastDot: 0, chapterStart: START.slice(), lastClear: [-99, -99], todayStart: cleared() });
  trails.innerHTML = '';
  document.body.classList.remove('indoor');
  place();
  drawMode();
}

function dayTwo() {
  const pct = cleared();
  startDay(1);
  sheet(`<div class="kicker">${COPY.dayTwo.kicker}</div><h1>${COPY.dayTwo.title}</h1><p>${COPY.dayTwo.body(pct)}</p>
    <button class="btn primary" id="go">${COPY.dayTwo.start}</button>`, (s) => {
    s.querySelector('#go').addEventListener('click', () => { closeSheet(); toast(COPY.glint); });
  });
}

function showEnd() {
  sheet(`<div class="kicker">${COPY.end.kicker}</div><h1>${COPY.end.title(cleared())}</h1><p>${COPY.end.body}</p>
    <button class="btn primary" id="remind">${COPY.end.remind}</button><button class="btn ghost" id="again">${COPY.end.again}</button>`, (s) => {
    s.querySelector('#remind').addEventListener('click', () => { closeSheet(); toast('(The reminder picker opens here)'); });
    s.querySelector('#again').addEventListener('click', () => { closeSheet(); reset(true); });
  });
}

function reset(intro) {
  grid = new Uint8Array(GX * GY);
  mctx.clearRect(0, 0, mask.width, mask.height);
  hiddenEls.forEach((h) => { h.found = false; h.g.classList.remove('found'); });
  if (!intro) clearAt(START[0], START[1], 46); // skipping the opening: start in a small clearing
  drawGlints();
  startDay(0);
  if (intro) showIntro();
}

$('resetBtn').addEventListener('click', () => reset(true));
// Esc or a tap outside the card closes a sheet
// (not the location ask, which needs an answer)
const closable = () => !$('sheet').hidden && !$('sheet').querySelector('.os');
$('sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet' && closable()) $('sheet').querySelector('.btn.primary')?.click(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && closable()) $('sheet').querySelector('.btn.primary')?.click(); });

(function frame() {
  const sw = live.querySelector('.zone .sweep');
  if (sw) sw.setAttribute('transform', `rotate(${-((performance.now() / 12) % 360)})`);
  drawFog();
  requestAnimationFrame(frame);
})();

$('lookSlot').innerHTML = lookPicker();
$('lookSlot').querySelector('select').addEventListener('change', (e) => setLook(e.target.value));
document.body.dataset.look = look;
paintLayer();
sizeFog();
reset(!params.has('skip'));
