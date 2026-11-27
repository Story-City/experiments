// Starting a Story: what happens when a player taps Start on a story.
// Three versions (?v=a|b|c) × four story kinds (?kind=), each playing through to the chapter 1 map.
const V = window.CACHE_V || '';
const W = await import(`./words.js${V}`);
const { VERSIONS, KINDS, NO_STEPS_TIP, MODES, STORY, A, B, C, LOADING, MAP, END, TESTER } = W;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const phone = $('#phone');
const screen = $('#screen');
const overlay = $('#overlay');
const fill = (t, o = {}) => String(t).replace(/\{(\w+)\}/g, (_, k) => (k in o ? o[k] : `{${k}}`));
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const VERSION_KEYS = Object.keys(VERSIONS);
const KIND_KEYS = Object.keys(KINDS);
const MODE_KEYS = Object.keys(MODES);
const LOAD_MS = { path: 900, hunt: 700 };
const TIP_MS = 2600;
const TOAST_MS = 2000;
const WALK_SECONDS = 4;          // a pretend walk always takes about this long
const DEFAULT_GOAL = 30;         // steps per walk (brief: about 30 steps ≈ 60 m)
const STEP_PX = 3;               // map pixels per step on the Steps trail

const qs = new URLSearchParams(location.search);
const S = {
  v: VERSION_KEYS.includes(qs.get('v')) ? qs.get('v') : 'a',
  kind: KIND_KEYS.includes(qs.get('kind')) ? qs.get('kind') : 'anywhere',
  saved: null,        // version A: the remembered choice
  bPick: null,        // version B: what Customize changed it to
  taps: 0,
  counting: false,
  mapTaps: null,
  play: null,         // { mode, how, goal, route, mins }
  screenName: '',
};
let run = 0;
const kind = () => KINDS[S.kind];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------ icons
const I = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  chev: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  steps: '<svg viewBox="0 0 24 24"><circle cx="13" cy="4" r="2"/><path d="M10 21l2-6 3 3v3M9 12l2-4 4 2 2 3M11 8l-3 2-1 3"/></svg>',
  path: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  hunt: '<svg viewBox="0 0 24 24"><path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3"/><circle cx="12" cy="12" r="3"/></svg>',
  route: '<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/></svg>',
  treadmill: '<svg viewBox="0 0 32 32"><path d="M4 24h21l3-4M7 27h18M22 20V8l4-2"/><circle cx="13" cy="6" r="2"/><path d="M13 9l-2 6 3 3v4M12 13l4 2 2-2M11 15l-3 2"/></svg>',
  home: '<svg viewBox="0 0 32 32"><path d="M5 15L16 6l11 9M8 13v13h16V13M13 26v-7h6v7"/></svg>',
  park: '<svg viewBox="0 0 24 24"><path d="M12 22v-6M12 3a6 6 0 0 0-6 6c0 3 2 5 6 7 4-2 6-4 6-7a6 6 0 0 0-6-6z"/></svg>',
  virtual: '<svg viewBox="0 0 24 24"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/></svg>',
};
I.walk = I.steps; I.door = I.home; I.here = I.path;

// ------------------------------------------------ shell
function go(name, html, cls = '') {
  run++;
  closeSheet(true);
  hideTip();
  S.screenName = name;
  screen.className = 'screen ' + cls;
  screen.innerHTML = html;
  screen.scrollTop = 0;
  noWidows(screen);
  syncChrome();
  return run;
}
function sheet(html, onClose) {
  overlay.innerHTML = `<div class="scrim"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  overlay.hidden = false;
  overlay.onclose = onClose || null;
  noWidows(overlay);
  requestAnimationFrame(() => overlay.classList.add('on'));
  return $('.sheet', overlay);
}
function closeSheet(silent = false) {
  if (overlay.hidden) return;
  const cb = overlay.onclose;
  overlay.classList.remove('on'); overlay.hidden = true; overlay.innerHTML = ''; overlay.onclose = null;
  if (!silent && cb) cb();
}
overlay.addEventListener('click', (e) => { if (e.target.classList.contains('scrim')) closeSheet(); });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!$('#tpanel').hidden) return togglePanel(false);
  closeSheet();
});

let toastT;
function toast(text) {
  const t = $('#toast');
  t.textContent = text; t.hidden = false;
  requestAnimationFrame(() => t.classList.add('on'));
  clearTimeout(toastT);
  toastT = setTimeout(() => { t.classList.remove('on'); setTimeout(() => { t.hidden = true; }, 200); }, TOAST_MS);
}

// tooltip above a greyed option
let tipT;
function tip(el, text) {
  hideTip();
  const zoom = parseFloat(getComputedStyle(phone).zoom) || 1;
  const p = phone.getBoundingClientRect(), r = el.getBoundingClientRect();
  const t = document.createElement('div');
  t.className = 'tip'; t.id = 'tip'; t.textContent = text;
  phone.append(t);
  const w = t.offsetWidth, h = t.offsetHeight;
  const cx = (r.left + r.width / 2 - p.left) / zoom;
  const left = Math.max(10, Math.min(phone.clientWidth - w - 10, cx - w / 2));
  t.style.left = left + 'px';
  t.style.top = Math.max(10, (r.top - p.top) / zoom - h - 10) + 'px';
  t.style.setProperty('--ax', (cx - left) + 'px');
  tipT = setTimeout(hideTip, TIP_MS);
}
function hideTip() { clearTimeout(tipT); $('#tip')?.remove(); }

// Count every tap on a live control from Start Story until the chapter 1 map shows.
phone.addEventListener('click', (e) => {
  const el = e.target.closest('[data-tap]');
  if (!el || el.disabled || el.classList.contains('off')) return;
  if (S.counting) { S.taps++; syncChrome(); }
}, true);

// ------------------------------------------------ the story page (everyone starts here)
function storyPage() {
  const k = kind();
  S.taps = 0; S.mapTaps = null; S.play = null;
  const howRow = S.v === 'b' ? bRow() : '';
  go('story', `<div class="story">
      <div class="hero" style="background-image:url(${k.img})"></div>
      <button class="backbtn" data-back aria-label="Back">${I.back}</button>
      <div class="sbody">
        <span class="kind">${k.label}</span>
        <h1>${k.title}</h1>
        <p class="meta"><span>${fill(STORY.mins, { n: k.mins })}</span><span>${fill(STORY.chapters, { n: k.chapters })}</span><span>${k.genre}</span><span>${STORY.free}</span></p>
        <p class="summary">${k.summary}</p>
        <div class="grow"></div>
        ${howRow}
        <button class="btn primary" data-tap="start" id="startBtn">${STORY.start}</button>
      </div>
    </div>`);
  S.counting = true;
  $('[data-back]', screen).addEventListener('click', () => toast('This mockup starts on the story page.'));
  $('#startBtn').addEventListener('click', () => ({ a: aStart, b: bStart, c: cStart }[S.v])());
  $('#customize')?.addEventListener('click', bCustomize);
}

// ------------------------------------------------ version A: four-option pop-up
function aOptions() {
  const k = kind();
  const first = k.onlyHere
    ? ['here', A.hereLabel, fill(A.hereLine, { place: k.pin.toLowerCase() }), I.here]
    : ['route', A.opts.route.label, A.opts.route.line, I.route];
  return [first, ...['walk', 'treadmill', 'home'].map((key) => [key, A.opts[key].label, A.opts[key].line, I[key]])];
}
function aStart() {
  if (S.saved) {
    if (!kind().onlyHere || S.saved === 'here') toast(fill(A.remembered, { how: aLabel(S.saved) }));
    return aGo(S.saved);
  }
  const k = kind();
  const sh = sheet(`<h2>${A.title}</h2><p class="sub">${A.sub}</p>
    <div class="opts" role="radiogroup">${aOptions().map(([key, label, line, icon]) => {
      const off = k.onlyHere && key !== 'here';
      return `<button class="opt${off ? ' off' : ''}" role="radio" aria-checked="false" data-tap data-k="${key}"${off ? ' aria-disabled="true"' : ''}>
        <span class="oi">${icon}</span><span class="ot"><b>${label}</b><small>${line}</small></span></button>`;
    }).join('')}</div>
    <label class="check"><input type="checkbox" id="remember" data-tap><span>${A.remember}<small>${A.rememberFine}</small></span></label>
    <button class="btn primary" id="aGo" data-tap disabled>${A.go}</button>`, storyPage);
  let pick = null;
  sh.addEventListener('click', (e) => {
    const o = e.target.closest('.opt');
    if (!o) return;
    if (o.classList.contains('off')) return tip(o, NO_STEPS_TIP);
    pick = o.dataset.k;
    $$('.opt', sh).forEach((b) => b.setAttribute('aria-checked', String(b === o)));
    $('#aGo').disabled = false;
  });
  $('#aGo').addEventListener('click', () => {
    if (!pick) return;
    if ($('#remember').checked) S.saved = pick;
    closeSheet(true);
    aGo(pick);
  });
}
function aLabel(key) {
  if (key === 'here') return A.hereLabel.toLowerCase();
  return A.opts[key].label.toLowerCase();
}
function aGo(key) {
  const k = kind();
  if (key === 'route') return aRoutes();
  if (key === 'here') return load({ mode: 'path', how: 'here' });
  if (k.onlyHere) return load({ mode: 'path', how: 'here' }); // a saved steps choice can't apply here
  if (key === 'walk') return load({ mode: k.best, how: 'door' });
  return load({ mode: 'steps', how: key });
}
function aRoutes() {
  const sh = sheet(`<h2>${A.routesTitle}</h2><p class="sub">${A.routesSub}</p>
    <div class="opts">${A.routes.map((r, i) => `<button class="opt mi-path" data-tap data-i="${i}">
      <span class="oi">${I.route}</span><span class="ot"><b>${r.name}</b><small>${r.far} · ${r.len}</small></span></button>`).join('')}</div>`, storyPage);
  sh.addEventListener('click', (e) => {
    const o = e.target.closest('.opt');
    if (!o) return;
    closeSheet(true);
    load({ mode: 'path', how: 'route', route: A.routes[+o.dataset.i].name });
  });
}

// ------------------------------------------------ version B: smart default + Customize
function bDefault() {
  const k = kind();
  if (k.onlyHere) return { mode: 'path', how: 'here' };
  return { mode: k.best, how: 'door' };
}
function bChoice() { return S.bPick || bDefault(); }
function bHowText(c) {
  const k = kind();
  if (c.how === 'here') return fill(B.how.here, { place: k.pin.toLowerCase() });
  if (c.how === 'treadmill' || c.how === 'home') return B.how[c.how];
  return fill(B.how[c.mode], { place: k.pin.toLowerCase() });
}
function bRow() {
  const c = bChoice();
  const dot = c.how === 'home' ? 'steps' : c.mode;
  const icon = c.how === 'treadmill' || c.how === 'home' ? I[c.how] : I[c.mode];
  return `<div class="howrow">
    <span class="dot m-${dot}">${icon}</span>
    <span class="ht"><small>${B.kick}</small><b>${bHowText(c)}</b><span>${B.why[S.kind]}</span></span>
    <button class="link" id="customize" data-tap>${B.customize}${I.chev}</button>
  </div>`;
}
function bStart() { load(bChoice()); }
function bCustomize() {
  const k = kind();
  const c = bChoice();
  const offTip = (m) => (m === 'steps' ? NO_STEPS_TIP : 'Hunt only works in Play Anywhere and Passport stories.');
  const sh = sheet(`<h2>${B.sheetTitle}</h2>
    <div class="opts" role="radiogroup">${MODE_KEYS.map((m) => {
      const off = !k.modes.includes(m);
      const label = m === 'path' && k.onlyHere ? fill(B.how.here, { place: k.pin.toLowerCase() }) : MODES[m].label;
      const on = c.mode === m && c.how !== 'treadmill' && c.how !== 'home';
      return `<button class="opt mi-${m}${off ? ' off' : ''}" role="radio" aria-checked="${on}" data-tap data-m="${m}" data-tip="${off ? offTip(m) : ''}">
        ${m === k.best ? `<span class="tag">${B.best}</span>` : ''}
        <span class="oi">${I[m]}</span><span class="ot"><b>${label}</b><small>${MODES[m].line}</small></span></button>`;
    }).join('')}</div>
    <div class="mini"><span>${B.indoors}</span>${['treadmill', 'home'].map((h) => `<button class="pill${k.onlyHere ? ' off' : ''}" role="radio" aria-checked="${c.how === h}" data-tap data-h="${h}" data-tip="${k.onlyHere ? NO_STEPS_TIP : ''}">${B[h]}</button>`).join('')}</div>`);
  sh.addEventListener('click', (e) => {
    const o = e.target.closest('[data-m], [data-h]');
    if (!o) return;
    if (o.classList.contains('off')) return tip(o, o.dataset.tip);
    S.bPick = o.dataset.m ? { mode: o.dataset.m, how: k.onlyHere ? 'here' : 'door' } : { mode: 'steps', how: o.dataset.h };
    closeSheet(true);
    const row = $('.howrow', screen);
    row.outerHTML = bRow();
    $('#customize').addEventListener('click', bCustomize);
    noWidows($('.howrow', screen));
  });
}

// ------------------------------------------------ version C: time first
function cStart() {
  if (kind().onlyHere) return cWhere(null);
  cTime();
}
function cHeader() {
  const k = kind();
  return `<button class="backbtn" data-tap data-back aria-label="Back">${I.back}</button>
    <div class="asktop"><img src="${k.img}" alt=""><span>${k.title}</span></div>`;
}
function cTime() {
  go('time', `<div class="ask">${cHeader()}
      <h1>${C.timeTitle}</h1><p class="sub">${C.timeSub}</p>
      <div class="opts">${C.times.map((t, i) => `<button class="opt time" data-tap data-i="${i}">
        <span class="ot"><b>${t.label}</b><small>${t.line}</small></span><span class="ghostnum" aria-hidden="true">${t.m}</span></button>`).join('')}</div>
    </div>`);
  $('[data-back]', screen).addEventListener('click', storyPage);
  $('.ask', screen).addEventListener('click', (e) => {
    const o = e.target.closest('.opt');
    if (!o) return;
    cWhere(C.times[+o.dataset.i]);
  });
}
function cWhere(time) {
  const k = kind();
  const opts = k.onlyHere
    ? [['here', fill(C.hereLabel, { place: k.pin.toLowerCase() }), C.hereLine, false], ['door', C.where.door.label, C.where.door.line, true], ['park', C.where.park.label, C.where.park.line, true], ['virtual', C.where.virtual.label, C.where.virtual.line, true]]
    : [['door', C.where.door.label, C.where.door.line, false], ['park', C.where.park.label, C.where.park.line, false],
      k.city ? ['virtual', fill(C.where.virtualCity.label, { city: k.city }), fill(C.where.virtualCity.line, { city: k.city }), false] : ['virtual', C.where.virtual.label, C.where.virtual.line, false]];
  const sub = time ? `${time.label} · ${C.timeSub.replace(/\.$/, '')}` : fill(C.noTime, { mins: k.mins, place: k.pin.toLowerCase() });
  go('where', `<div class="ask">${cHeader()}
      <h1>${C.whereTitle}</h1><p class="sub">${time ? time.label : sub}</p>
      <div class="opts">${opts.map(([key, label, line, off]) => `<button class="opt${off ? ' off' : ''}" data-tap data-k="${key}">
        <span class="oi">${I[key]}</span><span class="ot"><b>${label}</b><small>${line}</small></span></button>`).join('')}</div>
    </div>`);
  $('[data-back]', screen).addEventListener('click', time ? cTime : storyPage);
  const goal = time ? time.goal : DEFAULT_GOAL;
  $('.ask', screen).addEventListener('click', (e) => {
    const o = e.target.closest('.opt');
    if (!o) return;
    if (o.classList.contains('off')) return tip(o, NO_STEPS_TIP);
    const key = o.dataset.k;
    const mins = time?.m;
    if (key === 'here') return load({ mode: 'path', how: 'here', goal });
    if (key === 'park') return load({ mode: 'path', how: 'park', goal, mins });
    if (key === 'virtual') return load({ mode: 'steps', how: 'virtual', goal, mins });
    load({ mode: k.best, how: 'door', goal, mins });
  });
}

// ------------------------------------------------ loading, then the map
async function load(play) {
  S.play = { goal: DEFAULT_GOAL, ...play };
  const ms = LOAD_MS[play.mode];
  if (!ms) return mapScreen();
  const my = go('loading', `<div class="loading"><div><div class="spinner"></div><p>${fill(LOADING[play.mode], { find: kind().find })}</p></div></div>`);
  await wait(ms);
  if (my === run) mapScreen();
}

// map geometry: a simple street grid
const NS = 'http://www.w3.org/2000/svg';
const XS = [0, 40, 120, 195, 280, 360, 390];
const YS = [0, 90, 160, 230, 300, 380, 470, 560, 640, 720, 800];
const START = [195, 470];
const TRACK = [[195, 470], [195, 380], [120, 380], [120, 300], [120, 230], [195, 230], [195, 160], [280, 160], [360, 160]];
const PINS = {
  near: { at: [280, 300], route: [[195, 470], [195, 380], [280, 380], [280, 300]] },
  far: { at: [360, 230], route: [[195, 470], [195, 300], [280, 300], [280, 230], [360, 230]] },
  park: { at: [280, 160], route: [[195, 470], [195, 380], [280, 380], [280, 160]] },
  route: { at: [120, 300], route: [[195, 470], [195, 380], [120, 380], [120, 300]], loop: [[120, 300], [120, 160], [280, 160], [280, 300], [360, 300], [360, 470], [195, 470]] },
};
const lerp = (a, b, t) => a + (b - a) * t;
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
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], t))).join(',')})`;
const CITRINE = '#f5b82e', EMERALD = '#00cd9d';

function streets() {
  let s = `<rect width="390" height="800" class="ground"/>`;
  for (let i = 0; i < XS.length - 1; i++) for (let j = 0; j < YS.length - 1; j++) {
    const park = (i === 4 && j === 1) || (i === 1 && j === 6);
    s += `<rect x="${XS[i] + 8}" y="${YS[j] + 8}" width="${Math.max(0, XS[i + 1] - XS[i] - 16)}" height="${Math.max(0, YS[j + 1] - YS[j] - 16)}" rx="6" class="${park ? 'park' : 'block'}"/>`;
  }
  XS.slice(1, -1).forEach((x) => { s += `<line x1="${x}" y1="0" x2="${x}" y2="800" class="road${x === 195 ? ' main' : ''}"/>`; });
  YS.slice(1, -1).forEach((y) => { s += `<line x1="0" y1="${y}" x2="390" y2="${y}" class="road${y === 380 ? ' main' : ''}"/>`; });
  [[300, 110], [330, 128], [312, 142], [70, 500], [92, 528], [62, 540]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="9" class="tree"/>`; });
  s += `<text x="320" y="104" class="label" text-anchor="middle">${C.park}</text>`;
  return s;
}

const M = {}; // live map state
let lastCrumb = 0;
function pinFor() {
  const h = S.play.how;
  if (h === 'here') return { ...PINS.far, name: kind().pin, steps: kind().pinSteps };
  if (h === 'park') return { ...PINS.park, name: C.park, steps: 520 };
  if (h === 'route') return { ...PINS.route, name: kind().pin, steps: 150 };
  return { ...PINS.near, name: kind().pin, steps: kind().pinSteps };
}
function target() {
  const p = S.play;
  if (p.mode === 'steps') return p.goal;
  if (p.mode === 'path') return pinFor().steps;
  return p.goal * 2;
}

function mapScreen() {
  if (S.counting) { S.counting = false; S.mapTaps = S.taps; }
  M.walked = 0; M.walking = false; M.arrived = false; M.raf = 0;
  go('map', `<div class="mapscreen">
      <svg class="map" id="map" viewBox="0 0 390 800" preserveAspectRatio="xMidYMin slice" aria-label="Map of your area">
        <g id="base">${streets()}</g><g id="trails"></g><g id="live"></g>
        <g class="me" id="me"><circle r="16" class="pulse"/><circle r="7" class="dot"/></g>
      </svg>
      <div class="haze" id="haze" hidden></div>
      <div class="viewfinder" id="vf" hidden><i></i><i></i><i></i><i></i></div>
      <div class="hud"><button class="backbtn" id="mapBack" aria-label="Back">${I.back}</button><span class="mchip" id="chip"></span><div class="hudt" id="hudt"></div></div>
      <section class="card" id="card"></section>
    </div>`);
  $('#mapBack').addEventListener('click', storyPage);
  drawMode();
}

function drawMode() {
  cancelAnimationFrame(M.raf); M.walking = false;
  const p = S.play;
  const live = $('#live'); live.innerHTML = '';
  $('#trails').innerHTML = '';
  M.pos = START.slice(); lastCrumb = 0;
  $('#vf').hidden = p.mode !== 'hunt';
  $('#haze').hidden = !['treadmill', 'virtual'].includes(p.how);
  const chip = $('#chip');
  chip.className = `mchip m-${p.mode}`;
  chip.textContent = MODES[p.mode].label;
  if (p.mode === 'steps') {
    M.path = TRACK;
    live.innerHTML = `<defs><linearGradient id="trailGrad" gradientUnits="userSpaceOnUse" x1="${START[0]}" y1="${START[1]}" x2="${TRACK.at(-1)[0]}" y2="${TRACK.at(-1)[1]}"><stop offset="0" stop-color="${CITRINE}"/><stop offset="1" stop-color="${EMERALD}"/></linearGradient></defs>
      <path d="${poly(TRACK.slice(0, 6))}" class="trail"/><circle id="ring" class="ring"/>`;
  } else if (p.mode === 'path') {
    const pin = pinFor();
    M.path = pin.route;
    const loop = pin.loop ? `<path d="${poly(pin.loop)}" class="route long"/>` : '';
    live.innerHTML = `${loop}<path id="routeEl" class="route${p.how === 'here' ? ' long' : ''}"/>
      <circle cx="${pin.at[0]}" cy="${pin.at[1]}" r="30" class="fence"/>
      <g class="pin" transform="translate(${pin.at[0]} ${pin.at[1]})"><path d="M0 0 C-12 -14 -14 -20 -14 -26 a14 14 0 0 1 28 0 c0 6 -2 12 -14 26z" class="pin-body"/><circle cy="-26" r="4.5" fill="var(--midnight)"/>
      <text y="-48" x="${pin.at[0] > 330 ? 14 : 0}" text-anchor="${pin.at[0] > 330 ? 'end' : 'middle'}" class="pin-label">${pin.name}</text></g>`;
  } else {
    M.path = TRACK;
    live.innerHTML = `<g id="zone"><circle r="120" class="zone-fill"/><circle r="120" class="zone-edge"/><path d="M0 0 L120 0 A120 120 0 0 0 85 -85 Z" class="sweep"/></g>`;
  }
  update(true);
}

function update(rebuild = false) {
  const p = S.play, k = kind();
  const tgt = target();
  const left = Math.max(0, Math.round(tgt - M.walked));
  const t = Math.min(1, M.walked / tgt);
  M.pos = p.mode === 'steps' || p.mode === 'hunt' ? pointAt(M.path, M.walked * STEP_PX) : pointAt(M.path, pathLen(M.path) * t);
  $('#me').setAttribute('transform', `translate(${M.pos[0]} ${M.pos[1]})`);
  const ring = $('#ring');
  if (ring) {
    ring.setAttribute('cx', M.pos[0]); ring.setAttribute('cy', M.pos[1]);
    ring.setAttribute('r', (16 + 104 * (1 - t)).toFixed(1));
    ring.setAttribute('stroke', mix(CITRINE, EMERALD, t));
  }
  const routeEl = $('#routeEl');
  if (routeEl) {
    const rest = M.path.filter((pt, i) => i > 0 && pathLen(M.path.slice(0, i + 1)) > pathLen(M.path) * t);
    routeEl.setAttribute('d', poly([M.pos, ...rest]));
  }
  $('#zone')?.setAttribute('transform', `translate(${M.pos[0]} ${M.pos[1]})`);

  // HUD
  const hud = $('#hudt');
  let title, small = '';
  if (M.arrived) title = M.arrivedText;
  else if (p.mode === 'steps') title = fill(MAP.stepsLeft, { n: left });
  else if (p.mode === 'path') title = fill(MAP.pathAway, { pin: pinFor().name, n: left });
  else title = cap(fill(MAP.huntTitle, { find: k.find }));
  if (p.how === 'treadmill') small = MAP.treadmill;
  else if (p.how === 'home') small = MAP.home;
  else if (p.how === 'virtual') small = k.city ? fill(MAP.virtualOf, { city: k.city }) : MAP.virtual;
  else if (p.how === 'route') small = p.route;
  else if (p.mins) small = `${p.mins} min`;
  hud.innerHTML = `${title}${small ? `<small>${small}</small>` : ''}`;
  if (rebuild || M.cardKey !== cardKey()) renderCard();
  else refreshRow();
}

const cardKey = () => [S.play.mode, S.play.how, M.walking, M.arrived].join();
function statusRow() {
  const p = S.play, k = kind();
  const left = Math.max(0, Math.round(target() - M.walked));
  if (p.mode === 'steps') {
    if (p.how === 'home') return `<div class="row">${MAP.homeRow}</div>`;
    const row = p.how === 'treadmill' ? fill(MAP.treadRow, { n: left }) : fill(MAP.stepsRow, { n: left });
    return `<div class="row">${row}</div><div class="bar"><i style="width:${Math.min(100, (M.walked / target()) * 100)}%"></i></div>`;
  }
  if (p.mode === 'path') {
    if (p.how === 'route') return `<div class="row">${fill(MAP.routeRow, { route: p.route, n: left })}</div>`;
    if (p.how === 'park') return `<div class="row">${MAP.parkRow}</div>`;
    return `<div class="row">${fill(MAP.pathRow, { pin: pinFor().name, n: left })}</div>`;
  }
  return `<div class="row">${fill(MAP.huntRow, { find: k.find })}</div>`;
}
function refreshRow() { const s = $('#status'); if (s) s.innerHTML = statusRow(); }

function renderCard() {
  M.cardKey = cardKey();
  const p = S.play, k = kind();
  const card = $('#card');
  const head = `<div class="chead"><img src="${k.img}" alt=""><div><small>${k.title} · ${MAP.chapter}</small><b>${cap(k.chapter)}</b></div></div>`;
  if (M.arrived) {
    card.innerHTML = `${head}<div class="done" style="margin-top:14px">${I.check}<span>${M.arrivedText}</span></div>
      <div class="acts"><button class="btn primary" id="readBtn">${MAP.read}</button></div><p class="hint">${MAP.arriveNote}</p>`;
    $('#readBtn').addEventListener('click', endSheet);
    noWidows(card);
    return;
  }
  const sw = `<div class="switch" role="tablist" aria-label="How to begin this chapter">${MODE_KEYS.map((m) => {
    const off = !k.modes.includes(m);
    return `<button class="seg seg-${m}${off ? ' off' : ''}" role="tab" aria-selected="${p.mode === m}" data-m="${m}">${I[m]}<span>${MODES[m].label}</span></button>`;
  }).join('')}</div>`;
  let acts = '';
  if (p.mode === 'hunt') acts = `<div class="acts two"><button class="btn tester" id="walkBtn">${M.walking ? MAP.pause : MAP.pretend}</button><button class="shutter" id="shutter" aria-label="${MAP.shutter}"></button></div>`;
  else if (p.how === 'home') acts = `<div class="acts two"><button class="btn tester" id="walkBtn">${M.walking ? MAP.pause : MAP.pretend}</button><button class="btn ghost" id="skipBtn">${MAP.homeBtn}</button></div>`;
  else acts = `<div class="acts"><button class="btn tester" id="walkBtn">${M.walking ? MAP.pause : MAP.pretend}</button></div>`;
  const hint = k.onlyHere ? NO_STEPS_TIP : MAP.hint;
  card.innerHTML = `${head}${sw}<div id="status">${statusRow()}</div>${acts}<p class="hint">${hint}</p>`;
  noWidows(card);
  $$('.seg', card).forEach((b) => b.addEventListener('click', () => {
    if (b.classList.contains('off')) return tip(b, b.dataset.m === 'steps' ? NO_STEPS_TIP : 'Hunt only works in Play Anywhere and Passport stories.');
    if (b.dataset.m === p.mode) return;
    p.mode = b.dataset.m;
    if (p.how !== 'here') p.how = 'door';
    M.walked = 0;
    toast(fill(MAP.switched, { mode: MODES[p.mode].label }));
    drawMode();
  }));
  $('#walkBtn').addEventListener('click', toggleWalk);
  $('#shutter')?.addEventListener('click', snap);
  $('#skipBtn')?.addEventListener('click', () => arrive(MAP.arrivedHome));
}

function toggleWalk() {
  M.walking = !M.walking;
  if (M.walking) {
    M.last = performance.now();
    const my = run;
    const pace = target() / WALK_SECONDS;
    const tick = (now) => {
      if (my !== run || !M.walking) return;
      M.walked = Math.min(target(), M.walked + ((now - M.last) / 1000) * pace);
      M.last = now;
      if (S.play.mode === 'steps') dropCrumb();
      update();
      if (M.walked >= target() && S.play.mode !== 'hunt') {
        const p = S.play;
        return arrive(p.mode === 'steps' ? MAP.arrivedSteps : fill(MAP.arrivedPath, { pin: pinFor().name.toLowerCase() }));
      }
      if (M.walked >= target()) { M.walking = false; update(true); return; }
      M.raf = requestAnimationFrame(tick);
    };
    M.raf = requestAnimationFrame(tick);
  } else cancelAnimationFrame(M.raf);
  update(true);
}
function dropCrumb() {
  if (M.walked - lastCrumb < 1.5 && M.walked > lastCrumb) return;
  lastCrumb = M.walked;
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', M.pos[0]); c.setAttribute('cy', M.pos[1]); c.setAttribute('r', 3.2);
  c.setAttribute('class', 'crumb'); c.setAttribute('fill', mix(CITRINE, EMERALD, Math.min(1, M.walked / target())));
  $('#trails').append(c);
}
function snap() {
  const f = document.createElement('div'); f.className = 'snap';
  $('.mapscreen').append(f);
  setTimeout(() => f.remove(), 500);
  arrive(cap(fill(MAP.arrivedHunt, { find: kind().find })));
}
function arrive(text) {
  cancelAnimationFrame(M.raf);
  M.walking = false; M.arrived = true; M.arrivedText = text;
  update(true);
}

// ------------------------------------------------ end: chapter 1 begins
function howText() {
  const p = S.play, k = kind();
  if (!p) return '';
  if (p.how === 'here') return fill(B.how.here, { place: k.pin.toLowerCase() });
  if (p.how === 'route') return `Path, on the ${p.route}`;
  if (p.how === 'park') return `Path, to ${C.park}`;
  if (p.how === 'treadmill') return B.how.treadmill;
  if (p.how === 'home') return B.how.home;
  if (p.how === 'virtual') return k.city ? `Steps, a virtual walk of ${k.city}` : 'Steps, a virtual walk';
  return p.mode === 'steps' ? B.how.steps : p.mode === 'hunt' ? B.how.hunt : fill(B.how.path, { place: k.pin.toLowerCase() });
}
function endSheet() {
  const k = kind();
  const n = S.mapTaps ?? 0;
  const nextV = VERSION_KEYS[(VERSION_KEYS.indexOf(S.v) + 1) % VERSION_KEYS.length];
  const sh = sheet(`<div class="endsheet"><p class="kick">${END.kick}</p><h2>${cap(k.chapter)}</h2>
      <div class="bubble">${k.first}</div>
      <div class="tapsbig"><b>${n === 1 ? END.tapsOne : fill(END.taps, { n })}</b><span>${END.tapsLine}</span></div>
      <p class="endmeta">Version ${VERSIONS[S.v].letter} · ${k.label} · ${fill(END.how, { how: howText() })}</p>
      <button class="btn primary" id="nextKind">${END.again}</button>
      <button class="btn ghost" id="nextV">${fill(END.next, { v: VERSIONS[nextV].letter })}</button></div>`);
  $('#nextKind', sh).addEventListener('click', () => { S.kind = KIND_KEYS[(KIND_KEYS.indexOf(S.kind) + 1) % KIND_KEYS.length]; S.bPick = null; storyPage(); });
  $('#nextV', sh).addEventListener('click', () => { S.v = nextV; S.bPick = null; storyPage(); });
}

// ------------------------------------------------ tester panel + side note
function syncChrome() {
  $('#tbtnV').textContent = VERSIONS[S.v].letter;
  const n = S.mapTaps ?? S.taps;
  $('#tbtnN').textContent = n === 1 ? END.tapsOne : fill(END.taps, { n });
  const ver = VERSIONS[S.v];
  const where = { story: 'The story page. Tap Start Story.', loading: 'Getting chapter 1 ready.', time: 'Question 1 of 2.', where: S.kind === 'onespot' ? 'One question: where.' : 'Question 2 of 2.', map: 'The chapter 1 map.' }[S.screenName] || '';
  const tapLine = S.mapTaps != null ? `${S.mapTaps === 1 ? END.tapsOne : fill(END.taps, { n: S.mapTaps })} from the story page to this map.` : S.counting ? `${fill(TESTER.tapsNow, { n: S.taps })}.` : '';
  $('#note').innerHTML = `<p class="nk">${fill(TESTER.noteKick, { v: ver.letter, who: ver.who })}</p><h2>${ver.name}</h2><p>${ver.note}</p>
    <p class="taps">${kind().label}: ${kind().title}. ${where} ${tapLine}</p>`;
  noWidows($('#note'));
  const url = new URL(location.href);
  url.searchParams.set('v', S.v); url.searchParams.set('kind', S.kind);
  history.replaceState(null, '', url);
  if (!$('#tpanel').hidden) buildPanel();
}
function buildPanel() {
  const p = $('#tpanel');
  p.innerHTML = `<p class="tl">${TESTER.version}</p>
    <div class="tlist">${VERSION_KEYS.map((v) => `<button class="titem" data-v="${v}" aria-pressed="${v === S.v}"><b>${VERSIONS[v].letter} · ${VERSIONS[v].name}</b><small>${VERSIONS[v].who}</small></button>`).join('')}</div>
    <p class="tl">${TESTER.kind}</p>
    <div class="tlist">${KIND_KEYS.map((k) => `<button class="titem" data-kind="${k}" aria-pressed="${k === S.kind}"><b>${KINDS[k].label}</b><small>${KINDS[k].title} · ${KINDS[k].line}</small></button>`).join('')}</div>
    <div class="trow">${S.v === 'a' && S.saved ? `<button class="tsmall" data-forget>${TESTER.forget}</button>` : ''}<button class="tsmall" data-restart>${TESTER.restart}</button></div>`;
}
$('#tpanel').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.v) S.v = b.dataset.v;
  if (b.dataset.kind) S.kind = b.dataset.kind;
  if ('forget' in b.dataset) { S.saved = null; toast('Saved choice forgotten.'); }
  S.bPick = null;
  togglePanel(false);
  storyPage();
});
function togglePanel(open) {
  const p = $('#tpanel'), b = $('#tbtn');
  const on = open ?? p.hidden;
  if (on) buildPanel();
  p.hidden = !on; b.setAttribute('aria-expanded', String(on));
}
$('#tbtn').addEventListener('click', () => togglePanel());
document.addEventListener('click', (e) => {
  if (!$('#tpanel').hidden && !e.target.closest('#tpanel, #tbtn')) togglePanel(false);
  if ($('#tip') && !e.target.closest('.off')) hideTip();
});

// keep the last two words together (no lone last word)
function noWidows(root) {
  if (!root) return;
  const SEL = 'h1, h2, p, small, .ot b, .ht span, .bubble, .hudt, .done span';
  [...(root.matches?.(SEL) ? [root] : []), ...root.querySelectorAll(SEL)].forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let last = null;
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) last = walker.currentNode;
    if (!last || el.textContent.trim().split(/\s+/).length < 3) return;
    const m = last.nodeValue.match(/^([\s\S]*\S)( +)(\S+\s*)$/);
    if (m) last.nodeValue = m[1] + '\u00a0' + m[3];
  });
}

function fit() { document.documentElement.style.setProperty('--s', Math.min(1, (innerHeight - 40) / 866, (innerWidth - 32) / 412).toFixed(3)); }
fit(); addEventListener('resize', fit);
storyPage();
