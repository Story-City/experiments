// Lock screen experiment: the active Story City chapter on the lock screen
// (Live Activity / Android Live Update), Dynamic Island (or Android status chip),
// home-screen widgets (story in progress / nothing planned) and a watch glance.
// One shared "walk" drives every surface. All text lives in copy.js.

const { PAGE, SURFACES, STORY, LOCK, ISLAND, GEMS, WIDGETS, WATCH, APPS, DOCK } = await import(`./copy.js${window.CACHE_V || ''}`);

const $ = s => document.querySelector(s);
const params = new URLSearchParams(location.search);
const STEP_M = 0.75;          // metres per step
const WALK_SECS = 11;         // seconds for one pretend leg
const LAST = STORY.legs.length - 1;

const state = {
  surface: SURFACES.some(s => s.key === params.get('s')) ? params.get('s') : 'lock',
  platform: params.get('p') === 'android' ? 'android' : 'ios',
  leg: 0, steps: 0, walking: false, arrived: false,
  islandOpen: false, islandAuto: false, shadeOpen: false,
  touring: false, speed: 1,
};

/* ---------- little SVG helpers ---------- */
const SPARK = '<svg class="spark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z"/></svg>';
const GEM_PATHS = {
  nature: '<path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z"/><path class="vein" d="M5 19L15 9"/>',
  art: '<path d="M4.5 13.5c0-5 3.8-8.5 8.3-8.5 4.4 0 7.4 3 6.6 7.2-.8 4.4-4.4 7.3-8.5 7.3-3.9 0-6.4-2-6.4-6z"/>',
  landmark: '<path d="M10 2l6.5 5L14 22l-6-3.5L6.5 7.5z"/>',
  eat: '<path d="M6.5 7h11l3.5 3.2v3.6L17.5 17h-11L3 13.8v-3.6z"/>',
  curio: '<path d="M6 21l.8-10L9 6l2.2 5 .3 10z"/><path d="M11.5 21l.9-14L15 2l2.4 5 .4 14z"/><path d="M17.3 21l.4-6 1.6-3 1.5 3-.2 6z"/>',
};
const gem = (type, cls = '') => `<svg class="gem gem-${type} ${cls}" viewBox="0 0 24 24" aria-hidden="true">${GEM_PATHS[type]}</svg>`;
const WALKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="4" r="2"/><path d="M10 22l2-7 3 3v5M8 12l3-4 3 1 2 3 3 1M11 8l-2 5"/></svg>';

const ICONS = {
  signal: '<svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>',
  wifi: '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.5l2.4-2.6a3.4 3.4 0 00-4.8 0zM3.4 6.7a6.6 6.6 0 019.2 0l1.6-1.7a9 9 0 00-12.4 0zM.4 3.5a10.9 10.9 0 0115.2 0L16 3.1"/></svg>',
  battery: '<svg viewBox="0 0 27 12" aria-hidden="true"><rect x=".5" y=".5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="17" height="8" rx="2"/><rect x="24.5" y="4" width="2" height="4" rx="1" opacity=".5"/></svg>',
  torch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2h8v4l-2 4v12h-4V10L8 6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l2-2.5h6L17 7h3v12H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};

// A tiny pretend map: streets, a park, an optional route, the player and glowing gems.
function miniMap(gems, { route = false, you = true, id = 'm' } = {}) {
  const spots = [[42, 30], [118, 62], [92, 22], [130, 28], [30, 74]];
  const g = gems.map((x, i) => `<g class="mgem f-${x.type}" style="--d:${i * .7}s" transform="translate(${spots[i][0] - 7} ${spots[i][1] - 7}) scale(.58)">${GEM_PATHS[x.type]}</g>`).join('');
  return `<svg class="minimap" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="160" height="100" class="mm-bg"/>
    <path class="mm-park" d="M96 70h40v34H96z"/>
    <g class="mm-st"><path d="M-5 48H165M-5 86H165M24-5v110M70-5v110M112-5v110"/><path class="thin" d="M-5 16H165M48 48v52M140-5v53"/></g>
    ${route ? '<path class="mm-route" d="M70 86V48h42V16"/><circle class="mm-end" cx="112" cy="16" r="3.2"/>' : ''}
    ${g}
    ${you ? '<circle class="mm-you-ring" cx="70" cy="86" r="7"/><circle class="mm-you" cx="70" cy="86" r="3.6"/>' : ''}
  </svg>`;
}

/* ---------- derived walk values ---------- */
const leg = () => STORY.legs[state.leg];
const totalSteps = () => Math.round(leg().metres / STEP_M);
const progress = () => Math.min(1, state.steps / totalSteps());
const metresLeft = () => Math.max(0, Math.ceil(leg().metres * (1 - progress()) / 5) * 5);
const stepsLeft = () => Math.max(0, totalSteps() - Math.floor(state.steps));
const lineIdx = () => Math.min(leg().lines.length - 1, Math.floor(progress() * leg().lines.length));

/* ---------- phone building ---------- */
const statusBar = (opts = {}) => {
  const time = opts.noTime ? '' : `<span class="sb-time">${LOCK.time}</span>`;
  const chip = opts.chip ? `<button class="live-chip" type="button" data-act="shade" aria-label="Story City live walk">${WALKER}<b data-k="distBig"></b></button>` : '';
  return `<div class="status">${time}${chip}<span class="sb-icons">${ICONS.signal}${ICONS.wifi}${ICONS.battery}</span></div>`;
};

// The Live Activity (iOS) / Live Update notification (Android), shared by lock screen and shade.
function liveCard() {
  const android = state.platform === 'android';
  return `<div class="la ${android ? 'la-android' : ''}" data-act="read" role="button" tabindex="0" aria-label="Story City walk">
    <div class="la-head">
      <span class="app-ico">${SPARK}</span>
      <span class="la-label">${android ? `${LOCK.androidApp} · ${LOCK.androidWhen}` : LOCK.liveLabel}</span>
      <span class="la-chap" data-k="chapNum"></span>
    </div>
    <div class="la-title" data-k="chapter"></div>
    <div class="la-walking">
      <div class="la-dist"><b data-k="distBig"></b> <span data-k="distTo"></span></div>
      <div class="la-steps" data-k="steps"></div>
    </div>
    <div class="la-done"><b>${STORY.unlocked}</b></div>
    <div class="bar"><i data-fill></i><span class="walker" data-walker>${WALKER}</span><span class="dest" data-k="destEmoji"></span></div>
    <p class="la-line" data-k="line"></p>
  </div>`;
}

function readerSheet() {
  return `<div class="scrim" id="scrim" hidden><div class="reader" role="dialog" aria-modal="true" aria-labelledby="readerTitle">
    <p class="eyebrow" data-k="readerKicker"></p>
    <h3 id="readerTitle" data-k="readerTitle"></h3>
    <p class="reader-body" data-k="readerBody"></p>
    <button class="btn" type="button" data-act="closeReader">${STORY.close}</button>
  </div></div><div class="toast" id="toast" role="status" hidden></div>`;
}

function lockScreen() {
  const android = state.platform === 'android';
  const clock = android
    ? `<div class="a-clock"><span>${LOCK.time.split(':')[0].padStart(2, '0')}</span><span>${LOCK.time.split(':')[1]}</span></div><div class="a-date">${LOCK.androidDate}</div>`
    : `<div class="i-date">${LOCK.date}</div><div class="i-clock">${LOCK.time}</div>`;
  return `<div class="surface lock">
    ${statusBar({ noTime: !android })}
    <div class="lock-top">${clock}</div>
    <div class="lock-live">${liveCard()}</div>
    ${android ? '<div class="a-unlock">🔓</div>' : `<div class="lock-btns"><span>${ICONS.torch}</span><span>${ICONS.camera}</span></div>`}
  </div>`;
}

const appGrid = () => `<div class="apps">${APPS.map(([e, n]) => `<div class="app"><span class="tile">${e}</span><small>${n}</small></div>`).join('')}</div>`;
const dock = () => `<div class="dock">${DOCK.map(([e, n]) => `<span class="tile ${n === 'Story City' ? 'sc' : ''}" title="${n}">${n === 'Story City' ? SPARK : e}</span>`).join('')}</div>`;

function islandScreen() {
  const android = state.platform === 'android';
  if (android) {
    return `<div class="surface home island-s">
      ${statusBar({ chip: true })}
      ${appGrid()}${dock()}
      <div class="shade" id="shade" aria-hidden="true">
        <div class="shade-in">
          <div class="qs">${['📶', '🔦', '🔕', '✈️'].map(e => `<span>${e}</span>`).join('')}</div>
          <p class="shade-title">${ISLAND.shadeTitle}</p>
          ${liveCard()}
        </div>
      </div>
      <p class="hint-bubble">${ISLAND.androidHint}</p>
    </div>`;
  }
  return `<div class="surface home island-s">
    ${statusBar()}
    ${appGrid()}${dock()}
    <p class="hint-bubble">${ISLAND.hint}</p>
  </div>`;
}

// The island lives on the hardware layer so it sits over the camera on every iOS screen.
function islandEl() {
  return `<button class="island" id="island" type="button" data-act="island" aria-label="Story City live walk">
    <span class="isl-compact">
      <span class="isl-l">${SPARK}</span>
      <span class="isl-r"><svg class="ring" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8"/><circle class="ring-fill" cx="10" cy="10" r="8" pathLength="100" data-ring/></svg><b data-k="distBig"></b></span>
    </span>
    <span class="isl-full">
      <span class="isl-top"><span class="app-ico">${SPARK}</span><span class="isl-chap"><small data-k="chapShort"></small><b data-k="chapName"></b></span><span class="isl-big"><b data-k="distBig"></b><small data-k="stepsShort"></small></span></span>
      <span class="bar"><i data-fill></i><span class="walker" data-walker>${WALKER}</span><span class="dest" data-k="destEmoji"></span></span>
      <span class="isl-line" data-k="line"></span>
      <span class="isl-done">${STORY.unlocked}</span>
    </span>
  </button>`;
}

function widgetScreen(quiet) {
  const gems = quiet ? GEMS.quiet : GEMS.nearby;
  const gemRow = gems.map(g => gem(g.type)).join('');
  const list = gems.map(g => `<li data-act="toast" data-msg="gem">${gem(g.type)}<span>${g.name}<small>${g.label}</small></span><em>${g.dist}</em></li>`).join('');
  const W = WIDGETS;
  const medium = quiet
    ? `<div class="w w-m" data-act="toast" data-msg="pick"><div class="w-col"><p class="w-kick">${W.quietKicker}</p><h3>${W.quietTitle}</h3><span class="w-btn">${W.pick}</span></div><div class="w-map">${miniMap(gems)}</div></div>`
    : `<div class="w w-m" data-act="toast" data-msg="open"><div class="w-col"><p class="w-kick">${W.next}</p><h3>${W.when}</h3><p class="w-sub">${W.what}</p><p class="w-gems">${gemRow}<span>${W.gemsShort(gems.length)}</span></p></div><div class="w-map">${miniMap(gems, { route: true })}</div></div>`;
  const small = quiet
    ? `<div class="w w-s" data-act="toast" data-msg="pick">${miniMap(gems)}<div class="w-s-in"><p class="w-kick">${W.gemsShort(gems.length)}</p><span class="w-btn sm">${W.pick}</span></div></div>`
    : `<div class="w w-s" data-act="toast" data-msg="open">${miniMap(gems, { route: true })}<div class="w-s-in"><p class="w-kick">${W.next}</p><b>${W.when}</b><small>${W.what}</small></div></div>`;
  const large = quiet
    ? `<div class="w w-l"><p class="w-kick">${W.quietKicker}</p><h3>${W.gemsNear(gems.length)}</h3><p class="w-sub">${W.quietBody}</p><div class="w-map wide">${miniMap(gems)}</div><ul class="w-list">${list}</ul><p class="w-line">${W.quietLine}</p><div class="w-foot"><span><small>${W.idea}</small>${W.ideaWhat}</span><span class="w-btn" data-act="toast" data-msg="pick">${W.pick}</span></div></div>`
    : `<div class="w w-l"><p class="w-kick">${STORY.title} · ${W.next}</p><h3 data-act="toast" data-msg="open">${W.when}</h3><p class="w-sub">${W.whatLong}</p><div class="w-map wide">${miniMap(gems, { route: true })}</div><ul class="w-list">${list}</ul><div class="w-badges"><small>${W.badges}</small>${W.badgeList.map(b => `<span title="${b.name}">${b.icon}</span>`).join('')}</div></div>`;
  return `<div class="surface home widgets ${quiet ? 'quiet' : ''}">
    ${statusBar()}
    <div class="wgrid">${medium}<div class="w-row">${small}<div class="mini-apps">${APPS.slice(0, 4).map(([e, n]) => `<div class="app"><span class="tile">${e}</span><small>${n}</small></div>`).join('')}</div></div>${large}</div>
    <div class="dots"><i></i><i class="on"></i><i></i></div>
  </div>`;
}

function buildPhone() {
  const phone = $('#phone');
  phone.className = `phone ${state.platform} s-${state.surface}`;
  let body = '';
  if (state.surface === 'lock') body = lockScreen();
  else if (state.surface === 'island') body = islandScreen();
  else if (state.surface === 'widgets') body = widgetScreen(false);
  else if (state.surface === 'quiet') body = widgetScreen(true);
  phone.innerHTML = `<div class="screen"><div class="wall"></div>${body}
    ${state.platform === 'ios' ? islandEl() : '<span class="punch"></span>'}
    ${readerSheet()}<span class="homebar"></span></div>`;
  state.islandOpen = false; state.shadeOpen = false;
}

function buildWatch() {
  const round = state.platform === 'android';
  $('#watch').className = `watch ${round ? 'round' : 'square'}`;
  $('#watch').innerHTML = `<div class="w-case"><span class="crown"></span><div class="w-screen" data-act="read" role="button" tabindex="0" aria-label="Story City walk">
    <div class="wt-top"><span class="app-ico">${SPARK}</span><span class="wt-time">${WATCH.time}</span></div>
    <div class="wt-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--walk-start)"/><stop offset="1" style="stop-color:var(--walk-end)"/></linearGradient></defs><circle cx="50" cy="50" r="42"/><circle class="ring-fill" cx="50" cy="50" r="42" pathLength="100" data-ring stroke="url(#wg)"/></svg>
      <div class="wt-mid"><b data-k="distBig"></b><small data-k="toPlace"></small></div>
      <div class="wt-done"><b>${WATCH.arrived}</b><small>${STORY.readOnPhone}</small></div>
    </div>
    <p class="wt-line" data-k="line"></p>
  </div></div><p class="watch-hint">${WATCH.tapHint}</p>`;
}

/* ---------- updating the live bits ---------- */
const DEST = ['🚏', '💡', '📮'];
let lastLine = -1, lastLeg = -1;
function update() {
  const L = leg(), p = progress(), arrived = state.arrived;
  const vals = {
    chapter: L.name, chapShort: `${STORY.title} · ${L.chapter}`, chapName: L.name, chapNum: L.chapter,
    distBig: arrived ? STORY.unlockedShort : `${metresLeft()} m`,
    distTo: `to ${L.to}`, toPlace: arrived ? '' : `to ${L.to}`,
    steps: arrived ? STORY.arrivedAt(L.place) : STORY.stepsToGo(stepsLeft()),
    stepsShort: arrived ? '' : STORY.stepsToGo(stepsLeft()),
    line: arrived ? STORY.arrivedAt(L.place) : L.lines[lineIdx()],
    destEmoji: DEST[state.leg] || '📍',
    readerKicker: `${STORY.title} · ${L.chapter}`, readerTitle: L.opens, readerBody: L.preview,
  };
  document.querySelectorAll('[data-k]').forEach(el => {
    const v = vals[el.dataset.k]; if (v === undefined || el.textContent === v) return;
    el.textContent = v;
    if (el.dataset.k === 'line') { el.classList.remove('fade'); void el.offsetWidth; el.classList.add('fade'); }
  });
  document.querySelectorAll('[data-fill]').forEach(el => el.style.clipPath = `inset(0 ${(100 - p * 100).toFixed(1)}% 0 0 round 99px)`);
  document.querySelectorAll('[data-walker]').forEach(el => el.style.left = (p * 100).toFixed(1) + '%');
  document.querySelectorAll('[data-ring]').forEach(el => el.style.strokeDashoffset = (100 - p * 100).toFixed(1));
  for (const el of [$('#phone'), $('#watch')]) { el.classList.toggle('arrived', arrived); el.classList.toggle('walking', state.walking); }

  // story moved on: island pops open for a moment, watch gives a tap
  const li = arrived ? 99 : lineIdx();
  if (li !== lastLine && lastLeg === state.leg && state.walking || (arrived && lastLine !== 99)) storyMoved(arrived);
  lastLine = li; lastLeg = state.leg;

  const island = $('#island');
  if (island) island.classList.toggle('open', state.islandOpen || state.islandAuto);
  const shade = $('#shade');
  if (shade) { shade.classList.toggle('open', state.shadeOpen); shade.setAttribute('aria-hidden', String(!state.shadeOpen)); }

  const wb = $('#walkBtn');
  wb.textContent = arrived ? (state.leg < LAST ? `Walk to the ${STORY.legs[state.leg + 1].place}` : PAGE.again)
    : state.walking ? PAGE.pause : state.steps > 0 ? PAGE.resume : PAGE.walk;
  wb.hidden = state.surface === 'widgets' || state.surface === 'quiet';
}

let autoTimer;
function storyMoved(arrived) {
  if (state.surface === 'island' && !state.islandOpen) {
    state.islandAuto = true; clearTimeout(autoTimer);
    autoTimer = setTimeout(() => { state.islandAuto = false; update(); }, arrived ? 3200 : 2400);
  }
  const w = $('#watch .w-case');
  if (w) { w.classList.remove('buzz', 'buzz-big'); void w.offsetWidth; w.classList.add(arrived ? 'buzz-big' : 'buzz'); }
}

/* ---------- the walk loop ---------- */
let raf, lastT;
function tick(t) {
  if (!state.walking) return;
  const dt = lastT ? Math.min(.5, (t - lastT) / 1000) : 0; lastT = t;
  state.steps += dt * totalSteps() / WALK_SECS * state.speed;
  if (state.steps >= totalSteps()) { state.steps = totalSteps(); state.walking = false; state.arrived = true; }
  update();
  if (state.walking) raf = requestAnimationFrame(tick);
}
function startWalk() { state.walking = true; lastT = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); update(); }
function pauseWalk() { state.walking = false; cancelAnimationFrame(raf); update(); }
function setLeg(i) { state.leg = i; state.steps = 0; state.arrived = false; state.walking = false; lastLeg = -1; cancelAnimationFrame(raf); }

function onWalkBtn() {
  if (state.arrived) { setLeg(state.leg < LAST ? state.leg + 1 : 0); if (state.leg) startWalk(); else update(); return; }
  state.walking ? pauseWalk() : startWalk();
}

/* ---------- surfaces, caption, sizing ---------- */
function setSurface(key) {
  state.surface = key; $('#surface').value = key;
  const s = SURFACES.find(x => x.key === key);
  const cap = (state.platform === 'android' && s.androidCaption) || s.caption;
  $('#capKicker').textContent = cap.kicker; $('#capTitle').textContent = cap.title; $('#capBody').textContent = cap.body;
  const watch = key === 'watch';
  $('#phone').hidden = watch; $('#watch').hidden = !watch;
  if (watch) buildWatch(); else buildPhone();
  closeAll(); update(); fit();
}
function setPlatform(p) {
  state.platform = p;
  document.querySelectorAll('#platform button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === p)));
  setSurface(state.surface);
}

function fit() {
  const stage = $('#stage').getBoundingClientRect();
  const narrow = innerWidth < 700;
  const watch = state.surface === 'watch';
  const phone = $('#phone');
  phone.classList.toggle('bare', narrow);
  const el = watch ? $('#watch') : phone;
  const w = watch ? 300 : narrow ? 390 : 414, h = watch ? 380 : narrow ? 844 : 868;
  const s = Math.min(watch ? 1.5 : 1, (stage.width - (narrow ? 0 : 32)) / w, (stage.height - (narrow ? 8 : 48)) / h);
  el.style.transform = `scale(${s})`;
  const box = $('#deviceBox'); box.style.width = w * s + 'px'; box.style.height = h * s + 'px';
}

/* ---------- open things: reader sheet, toast, island, shade ---------- */
let toastTimer;
function openReader() { const s = $('#scrim'); if (s) s.hidden = false; }
function showToast(msg) {
  const t = $('#toast'); if (!t) return;
  t.textContent = WIDGETS.tapToast[msg] || ''; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
}
function anyOpen() { return (!$('#scrim')?.hidden) || (!$('#toast')?.hidden) || state.islandOpen || state.shadeOpen; }
function closeAll() {
  const s = $('#scrim'); if (s) s.hidden = true;
  const t = $('#toast'); if (t) t.hidden = true;
  state.islandOpen = false; state.shadeOpen = false; state.islandAuto = false;
}

document.addEventListener('click', e => {
  const act = e.target.closest('[data-act]');
  const a = act && act.dataset.act;
  const insideReader = e.target.closest('.reader');
  if (a === 'closeReader') { closeAll(); update(); return; }
  if (insideReader) return;
  if (anyOpen() && a !== 'island' && a !== 'shade') {
    const wasOpen = !$('#scrim')?.hidden || state.islandOpen || state.shadeOpen;
    closeAll(); update();
    if (wasOpen && !e.target.closest('.shade-in')) return; // outside tap just closes
  }
  if (!a) return;
  if (a === 'island') { state.islandOpen = !(state.islandOpen || state.islandAuto); state.islandAuto = false; update(); }
  else if (a === 'shade') { state.shadeOpen = !state.shadeOpen; update(); }
  else if (a === 'read') { if (state.arrived) openReader(); else if (state.surface !== 'watch') { state.islandOpen = false; update(); } }
  else if (a === 'toast') showToast(act.dataset.msg);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (anyOpen()) { closeAll(); update(); } else if (state.touring) stopTour(); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-act="read"]')) { e.preventDefault(); e.target.click(); }
});

/* ---------- Tour: plays every surface in order ---------- */
let tourId = 0;
const wait = (ms, id) => new Promise(r => setTimeout(r, ms)).then(() => { if (id !== tourId) throw 0; });
const untilArrived = async id => { while (!state.arrived) await wait(150, id); };
async function tour() {
  const id = ++tourId; state.touring = true; state.speed = 1.6; tourUi();
  const steps = SURFACES.length; let n = 0;
  const mark = () => { $('#tourFill').style.width = (++n / steps * 100) + '%'; };
  try {
    $('#tourFill').style.width = '0%';
    setLeg(0); setSurface('lock'); await wait(1400, id); startWalk(); await untilArrived(id); await wait(2600, id); mark();
    setLeg(1); setSurface('island'); await wait(1600, id); startWalk(); await untilArrived(id); await wait(3400, id); mark();
    setSurface('widgets'); await wait(4800, id); mark();
    setSurface('quiet'); await wait(4800, id); mark();
    setLeg(2); setSurface('watch'); await wait(1200, id); startWalk(); await untilArrived(id); await wait(2600, id); mark();
    stopTour(); setSurface('lock');
  } catch (e) { if (e !== 0) throw e; }
}
function stopTour() { tourId++; state.touring = false; state.speed = 1; tourUi(); }
function tourUi() { $('#tourBtn').textContent = state.touring ? PAGE.stopTour : PAGE.tour; $('#tourBar').hidden = !state.touring; $('#tourBtn').setAttribute('aria-pressed', String(state.touring)); }

/* ---------- boot ---------- */
$('#pageKicker').textContent = PAGE.kicker; $('#pageTitle').textContent = PAGE.title; $('#pageBody').textContent = PAGE.body;
$('#surfaceLabel').textContent = PAGE.surfaceLabel; $('#draft').textContent = PAGE.draft;
$('#surface').innerHTML = SURFACES.map(s => `<option value="${s.key}">${s.label}</option>`).join('');
$('#platform').setAttribute('aria-label', PAGE.platformLabel);
$('#platform').innerHTML = ['ios', 'android'].map(p => `<button type="button" class="chip" data-p="${p}" aria-pressed="false">${PAGE[p]}</button>`).join('');
$('#surface').addEventListener('change', e => { stopTour(); setSurface(e.target.value); });
$('#platform').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { stopTour(); setPlatform(b.dataset.p); } });
$('#walkBtn').addEventListener('click', e => { e.stopPropagation(); stopTour(); onWalkBtn(); });
$('#tourBtn').addEventListener('click', e => { e.stopPropagation(); state.touring ? stopTour() : tour(); });
addEventListener('resize', fit);
tourUi(); setPlatform(state.platform);
if (params.has('tour')) tour();

// for headless checks
window.__lock = { state, setSurface, setPlatform, setLeg, startWalk, tour, stopTour, update };
