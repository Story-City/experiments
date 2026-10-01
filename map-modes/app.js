// Map modes: one map, three ways to unlock the next chapter, switched from the
// chapter card. Steps walked always count, whichever mode you're in.
//   Walk -> dotted trail yellow -> green + thin ring that shrinks as you walk
//   Pin  -> solid blue route to a blue pin (a real place nearby)
//   Hunt -> purple viewfinder corners, search sweep, camera button

// Mode names live here so they're a one-line change.
const MODES = {
  walk: { label: 'Walk', chip: 'Walk to unlock' },
  pin: { label: 'Pin', chip: 'Pin nearby' },
  hunt: { label: 'Hunt', chip: 'Scavenger hunt' },
};
const GOAL = 240; // steps to unlock in Walk mode
const PIN = { at: [280, 230], name: 'Streetlight' };
const HUNT_FIND = 'the tallest tree nearby';
const START = [195, 380];
// Pretend streets the player wanders along in Walk and Hunt.
const TRACK = [[195, 380], [195, 300], [120, 300], [120, 230], [120, 160], [195, 160], [195, 90], [280, 90], [360, 90], [360, 230]];
const STEP_PX = 1.4; // map pixels per step
const PACE = 34; // steps per second while "walking"

const NS = 'http://www.w3.org/2000/svg';
const $ = (id) => document.getElementById(id);
const svg = $('map');
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

// --- base map --------------------------------------------------------------
const base = el('g', {}, svg);
(function drawStreets() {
  el('rect', { width: 390, height: 640, class: 'ground' }, base);
  const xs = [0, 40, 120, 195, 280, 360, 390];
  const ys = [0, 90, 160, 230, 300, 380, 470, 560, 640];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      const park = (i === 4 && j === 1) || (i === 1 && j === 5);
      el('rect', { x: xs[i] + 8, y: ys[j] + 8, width: Math.max(0, xs[i + 1] - xs[i] - 16), height: Math.max(0, ys[j + 1] - ys[j] - 16), rx: 6, class: park ? 'park' : 'block' }, base);
    }
  }
  xs.slice(1, -1).forEach((x) => el('line', { x1: x, y1: 0, x2: x, y2: 640, class: x === 195 ? 'road main' : 'road' }, base));
  ys.slice(1, -1).forEach((y) => el('line', { x1: 0, y1: y, x2: 390, y2: y, class: y === 300 ? 'road main' : 'road' }, base));
  [[300, 110], [330, 130], [312, 145], [345, 112], [70, 400], [95, 430], [62, 448]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 9, class: 'tree' }, base));
  const t1 = el('text', { x: 320, y: 104, class: 'label', 'text-anchor': 'middle' }, base);
  t1.textContent = 'Maple Park';
  const t2 = el('text', { x: 203, y: 294, class: 'label small' }, base);
  t2.textContent = 'Main St';
  // other stories and gems nearby, for context
  [[[48, 175], 'story'], [[352, 330], 'story'], [[110, 540], 'story'], [[255, 470], 'gem'], [[52, 300], 'gem']].forEach(([[x, y], kind]) => {
    const g = el('g', { transform: `translate(${x} ${y})`, class: kind }, base);
    if (kind === 'story') { el('circle', { r: 11 }, g); el('path', { d: 'M-5 -4 h4 a2 2 0 0 1 1 1 v8 a2 2 0 0 0 -1 -1 h-4z M5 -4 h-4 a2 2 0 0 0 -1 1 v8 a2 2 0 0 1 1 -1 h4z' }, g); }
    else el('path', { d: 'M0 -9 l8 7 -8 11 -8 -11z' }, g);
  });
  // the chapter destination (what the walk is "for")
  const dest = el('g', { transform: 'translate(195 90)', class: 'dest' }, base);
  el('circle', { r: 13 }, dest);
  el('path', { d: 'M0 -6 v6 l4 3' }, dest);
})();

const trails = el('g', {}, svg);
const live = el('g', {}, svg);
const me = el('g', { class: 'me' }, svg);
el('circle', { r: 16, class: 'pulse' }, me);
el('circle', { r: 7, class: 'dot' }, me);

// --- state -------------------------------------------------------------------
const params = new URLSearchParams(location.search);
const state = {
  mode: 'walk',
  pos: START.slice(),
  walked: 0, // steps, shared by every mode
  walking: false,
  unlocked: false,
  noPin: params.get('pin') === 'none',
  path: null, // current path being walked
  along: 0,
  lastDot: 0,
};

// --- rendering -----------------------------------------------------------------
function place() { me.setAttribute('transform', `translate(${state.pos[0]} ${state.pos[1]})`); }

function pinRoute(from) {
  // follow the street grid: move along whichever street you're on, then turn
  const onVertical = [40, 120, 195, 280, 360].some((x) => Math.abs(from[0] - x) < 1);
  return onVertical ? [from, [from[0], PIN.at[1]], PIN.at] : [from, [PIN.at[0], from[1]], PIN.at];
}

function walkPath(from) {
  let best = 0;
  TRACK.forEach((p, i) => { if (dist(p, from) < dist(TRACK[best], from)) best = i; });
  const ahead = TRACK.slice(best + (dist(TRACK[best], from) < 1 ? 1 : 0));
  // at the end of the streets, turn round and head back
  return ahead.length ? [from, ...ahead] : [from, ...TRACK.slice(0, -1).reverse()];
}

let ring;
let sweep;
let searchRing;
function drawMode() {
  live.innerHTML = '';
  ring = sweep = searchRing = null;
  const { mode } = state;
  document.body.dataset.mode = mode;
  $('viewfinder').hidden = mode !== 'hunt';
  $('chip').textContent = MODES[mode].chip;
  if (mode === 'walk') {
    ring = el('circle', { class: 'ring', r: 0 }, live);
  } else if (mode === 'pin') {
    if (state.noPin) {
      searchRing = el('circle', { class: 'search', cx: state.pos[0], cy: state.pos[1], r: 150 }, live);
    } else {
      const route = pinRoute(state.pos);
      el('path', { d: poly(route), class: 'route' }, live);
      const pin = el('g', { class: 'pin', transform: `translate(${PIN.at[0]} ${PIN.at[1]})` }, live);
      el('path', { d: 'M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z', class: 'pin-body' }, pin);
      el('path', { d: 'M-4 -30 h8 M0 -30 v10 M-5 -20 h10', class: 'pin-icon' }, pin);
      const t = el('text', { x: 0, y: -44, class: 'label pin-label', 'text-anchor': 'middle' }, pin);
      t.textContent = PIN.name;
    }
  } else {
    const zone = el('g', { class: 'zone', transform: `translate(${state.pos[0]} ${state.pos[1]})` }, live);
    el('circle', { r: 130, class: 'zone-fill' }, zone);
    el('circle', { r: 130, class: 'zone-edge' }, zone);
    sweep = el('path', { d: 'M0 0 L130 0 A130 130 0 0 0 92 -92 Z', class: 'sweep' }, zone);
    sweep.parentNode.dataset.follow = '1';
  }
  update();
}

function stepsToPin() { return Math.round(pathLen(pinRoute(state.pos)) / STEP_PX); }

function update() {
  const { mode, walked } = state;
  const left = Math.max(0, GOAL - Math.round(walked));
  const t = Math.min(1, walked / GOAL);
  if (ring) {
    ring.setAttribute('cx', state.pos[0]);
    ring.setAttribute('cy', state.pos[1]);
    ring.setAttribute('r', (left * STEP_PX * 0.9).toFixed(1));
    ring.setAttribute('stroke', mix(css('--walk-start'), css('--walk-end'), t));
  }
  live.querySelectorAll('[data-follow]').forEach((g) => g.setAttribute('transform', `translate(${state.pos[0]} ${state.pos[1]})`));
  if (searchRing) { searchRing.setAttribute('cx', state.pos[0]); searchRing.setAttribute('cy', state.pos[1]); }

  // HUD
  let title = '';
  if (state.unlocked) title = 'Chapter unlocked';
  else if (mode === 'walk') title = `${left} steps to go`;
  else if (mode === 'pin') title = state.noPin ? 'Looking for a place nearby…' : `${PIN.name} · ${stepsToPin()} steps away`;
  else title = `Find ${HUNT_FIND}`;
  $('hudTitle').textContent = title;

  renderSwitch();
  renderCard();
}

// Rebuild the switch and buttons only when something they show changes, so
// taps aren't lost while the numbers tick during a walk.
let switchKey = '';
let cardKey = '';
function renderSwitch() {
  const key = [state.mode, state.noPin, state.unlocked].join();
  if (key === switchKey) return;
  switchKey = key;
  const sw = $('switch');
  sw.innerHTML = '';
  Object.entries(MODES).forEach(([key, m]) => {
    const b = document.createElement('button');
    b.className = `seg seg-${key}`;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(state.mode === key));
    b.innerHTML = `<span class="seg-icon">${ICONS[key]}</span><span>${m.label}</span>`;
    if (key === 'pin' && state.noPin) b.classList.add('none');
    b.disabled = state.unlocked;
    b.addEventListener('click', () => switchTo(key));
    sw.append(b);
  });
}

const ICONS = {
  walk: '<svg viewBox="0 0 24 24"><circle cx="13" cy="4" r="2"/><path d="M10 21l2-6 3 3v3M9 12l2-4 4 2 2 3M11 8l-3 2-1 3"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  hunt: '<svg viewBox="0 0 24 24"><path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3"/><circle cx="12" cy="12" r="3"/></svg>',
};

function renderCard() {
  const { mode, walked } = state;
  const st = $('status');
  const act = $('actions');
  const key = [mode, state.walking, state.unlocked, state.noPin, walked > 0].join();
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

  if (state.unlocked) {
    st.innerHTML = '<div class="done">✓ Chapter unlocked</div>';
    btn('Read chapter 2', 'primary', reset);
    return;
  }
  if (mode === 'walk') {
    st.innerHTML = `<div class="row"><b>${left} steps</b> to unlock</div><div class="bar"><i style="width:${Math.min(100, (walked / GOAL) * 100)}%"></i></div>`;
    btn(state.walking ? 'Pause' : walked ? 'Keep walking' : 'Start walking', 'primary walk', toggleWalk);
  } else if (mode === 'pin') {
    if (state.noPin) {
      st.innerHTML = '<div class="row"><b>No pins near you right now.</b> Nothing on the map fits this chapter within a short walk.</div>';
      btn(MODES.walk.label + ' instead', 'ghost', () => switchTo('walk'));
      btn(MODES.hunt.label + ' instead', 'ghost', () => switchTo('hunt'));
      return;
    }
    const pinSteps = stepsToPin();
    const quicker = walked > 0 && pinSteps < left ? ` · quicker than ${left} more` : '';
    st.innerHTML = `<div class="row"><b>${PIN.name}</b>, ${pinSteps} steps away${quicker}</div>`;
    btn(state.walking ? 'Pause' : `Go to the ${PIN.name.toLowerCase()}`, 'primary pin', toggleWalk);
  } else {
    st.innerHTML = `<div class="row">Find <b>${HUNT_FIND}</b>. It might take a short walk. Snap it when you find it.</div>`;
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
  if (state.walked >= 1) toast(`You've walked ${Math.round(state.walked)} steps. They still count.`);
  if (wasWalking && mode !== 'hunt' && !(mode === 'pin' && state.noPin)) toggleWalk();
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
  // Hunt: you drift around while searching
  state.walking = true;
  state.path = walkPath(state.pos);
  state.along = 0;
  last = performance.now();
  raf = requestAnimationFrame(tick);
}

function dropDot() {
  const t = Math.min(1, state.walked / GOAL);
  const fill = state.mode === 'walk' ? mix(css('--walk-start'), css('--walk-end'), t) : state.mode === 'pin' ? css('--pin') : css('--hunt');
  el('circle', { cx: state.pos[0], cy: state.pos[1], r: state.mode === 'pin' ? 3.2 : 2.6, fill, class: `crumb crumb-${state.mode}` }, trails);
}

function tick(now) {
  if (!state.walking) return;
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const pace = state.mode === 'hunt' ? PACE * 0.45 : PACE;
  const stepPx = pace * dt * STEP_PX;
  const len = pathLen(state.path);
  state.along = Math.min(len, state.along + stepPx);
  state.pos = pointAt(state.path, state.along);
  state.walked += stepPx / STEP_PX;
  if (state.walked - state.lastDot >= 6) { dropDot(); state.lastDot = state.walked; }
  place();
  // unlock conditions
  if (state.mode === 'walk' && state.walked >= GOAL) return unlock();
  if (state.mode === 'pin' && state.along >= len - 0.5) return unlock();
  if (state.along >= len - 0.5) { state.path = walkPath(state.pos); state.along = 0; }
  update();
  raf = requestAnimationFrame(tick);
}

function burst() {
  const g = el('g', { class: 'burst', transform: `translate(${state.pos[0]} ${state.pos[1]})` }, svg);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    el('line', { x1: Math.cos(a) * 12, y1: Math.sin(a) * 12, x2: Math.cos(a) * 30, y2: Math.sin(a) * 30 }, g);
  }
  setTimeout(() => g.remove(), 900);
}

function unlock() {
  stopWalking();
  state.unlocked = true;
  live.innerHTML = '';
  ring = sweep = searchRing = null;
  $('viewfinder').hidden = true;
  burst();
  update();
}

// --- pretend camera (Hunt) ---------------------------------------------------
function snap() {
  const cam = document.createElement('div');
  cam.className = 'cam';
  cam.innerHTML = `<div class="cam-view"><img src="img/tree-photo.jpg" alt=""></div>
    <div class="cam-top">Pointing at ${HUNT_FIND}…</div><div class="cam-focus"></div>
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

// --- controls ----------------------------------------------------------------
function reset() {
  stopWalking();
  trails.innerHTML = '';
  Object.assign(state, { mode: 'walk', pos: START.slice(), walked: 0, unlocked: false, lastDot: 0 });
  place();
  drawMode();
}

$('resetBtn').addEventListener('click', reset);
$('noneBtn').addEventListener('click', () => {
  state.noPin = !state.noPin;
  $('noneBtn').setAttribute('aria-pressed', String(state.noPin));
  if (state.mode === 'pin') { stopWalking(); drawMode(); } else update();
});
$('noneBtn').setAttribute('aria-pressed', String(state.noPin));

// hunt sweep animation
(function spin() {
  const zone = live.querySelector('.zone .sweep');
  if (zone) zone.setAttribute('transform', `rotate(${-((performance.now() / 12) % 360)})`);
  requestAnimationFrame(spin);
})();

const startMode = params.get('mode');
if (MODES[startMode]) state.mode = startMode;
place();
drawMode();
if (state.mode === 'hunt') startWander();
