const V_ = window.CACHE_V || '';
const { COPY, OPTIONS, DEFAULT_EXPLORE, BOOKERTON, EXPLORER, VERSIONS, STREET } = await import(`./data.js${V_}`);
const { icon } = await import(`./icons.js${V_}`);

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const byId = Object.fromEntries(OPTIONS.map(o => [o.id, o]));
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Glue the last two words so a line never ends with one word alone.
const nw = s => {
  const w = String(s).trim().split(/\s+/);
  if (w.length < 3) return `<span style="white-space:nowrap">${esc(w.join(' '))}</span>`;
  const tail = w.splice(-2).join(' ');
  return `${esc(w.join(' '))} <span style="white-space:nowrap">${esc(tail)}</span>`;
};
const CHEV = '<svg class="chev" viewBox="0 0 10 16" aria-hidden="true"><path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEV_L = '<svg class="chev" viewBox="0 0 10 16" aria-hidden="true"><path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const S = { v: 'a', h: 0, picked: [], screen: 'pick' };
const isPicked = id => S.picked.includes(id);
let cur = null;

// shown letters follow the order (A, B, C…), so they stay continuous when versions are removed
const LETTER = Object.fromEntries(VERSIONS.map((v, i) => [v.key, String.fromCharCode(65 + i)]));
const qv = (new URLSearchParams(location.search).get('v') || '').toUpperCase();
const fromUrl = VERSIONS.find(v => LETTER[v.key] === qv);
S.v = (fromUrl || VERSIONS[0]).key;
const qh = parseInt(new URLSearchParams(location.search).get('h'), 10);
if (qh >= 1 && qh <= COPY.titles.length) S.h = qh - 1;
const NARROW = matchMedia('(max-width:520px)');

/* ---------- shell ---------- */
document.title = 'Explore Picker';
$('#barTitle').textContent = COPY.pageTitle;
$('#switcher').innerHTML = VERSIONS.map(v =>
  `<button class="sw" data-v="${v.key}" title="${esc(v.name)}" aria-label="Version ${LETTER[v.key]}: ${esc(v.name)}">${LETTER[v.key]}</button>`).join('');
$('#switcher').addEventListener('click', e => {
  const b = e.target.closest('[data-v]'); if (!b) return;
  S.v = b.dataset.v; S.picked = []; S.screen = 'pick';
  const u = new URL(location.href); u.searchParams.set('v', LETTER[S.v].toLowerCase()); history.replaceState(null, '', u);
  render();
});
$('#heads').innerHTML = `<span class="heads-lab">${esc(COPY.headingLabel)}</span>` + COPY.titles.map((t, i) =>
  `<button class="sw hd" data-h="${i}" title="${esc(t)}" aria-label="Heading ${i + 1}: ${esc(t)}">${i + 1}</button>`).join('');
$('#heads').addEventListener('click', e => {
  const b = e.target.closest('[data-h]'); if (!b) return;
  // on a phone only the current number shows, so tapping it steps to the next heading
  S.h = NARROW.matches ? (S.h + 1) % COPY.titles.length : +b.dataset.h;
  const u = new URL(location.href); u.searchParams.set('h', S.h + 1); history.replaceState(null, '', u);
  render();
});
$('#noteToggle').addEventListener('click', () => {
  const open = document.body.classList.toggle('note-open');
  $('#noteToggle').setAttribute('aria-expanded', open);
});

function render() {
  const V = VERSIONS.find(v => v.key === S.v);
  document.querySelectorAll('.sw[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === S.v));
  document.querySelectorAll('.sw[data-h]').forEach(b => b.classList.toggle('on', +b.dataset.h === S.h));
  $('#note').innerHTML = `<b>${LETTER[V.key]} · ${esc(V.name)}.</b> <span class="why">Why it might work:</span> ${nw(V.why)} <span class="dot">·</span> <span class="risk">Risk:</span> ${nw(V.risk)}`;
  if (S.screen === 'pick') renderPick(V); else renderUnlock(S.screen === 'skip');
}

function renderPick(V) {
  const scr = $('#scr');
  const sub = V.hint === false ? '' : V.hint || COPY.sub;
  scr.innerHTML = `
  <div class="pk">
    <div class="pk-top"><span class="pk-step">${esc(COPY.stepLabel)}</span><button class="sbtn ghost" id="skip">${esc(COPY.skip)}</button></div>
    <h1 class="pk-h">${nw(COPY.titles[S.h])}</h1>
    ${sub ? `<p class="pk-sub">${nw(sub)}</p>` : ''}
    <div class="picker v-${V.key}" id="picker"></div>
    <div class="pk-foot"><button class="btn-primary" id="continue" disabled></button></div>
  </div>`;
  const picker = $('#picker');
  picker.addEventListener('click', e => {
    const b = e.target.closest('[data-opt]');
    if (b && picker.contains(b)) toggle(b.dataset.opt);
  });
  $('#skip').addEventListener('click', () => { S.screen = 'skip'; render(); });
  $('#continue').addEventListener('click', () => { if (S.picked.length) { S.screen = 'unlock'; render(); } });
  cur = MOUNTS[V.key](picker) || {};
  refreshFoot();
  if (FIT.has(V.key)) requestAnimationFrame(() => fit(picker));
}

function refreshFoot() {
  const b = $('#continue'); if (!b) return;
  const n = S.picked.length;
  b.disabled = !n;
  b.innerHTML = n ? `${esc(COPY.continue)} <span class="cnt">${n}</span>` : esc(COPY.continueHint);
}

function toggle(id, force) {
  const has = isPicked(id);
  const want = force === undefined ? !has : force;
  if (want === has) return;
  if (want) S.picked.push(id); else S.picked = S.picked.filter(x => x !== id);
  refreshFoot();
  cur.update && cur.update(id, want);
}

function renderUnlock(skipped) {
  const items = skipped
    ? DEFAULT_EXPLORE.map(d => ({ ...d, ico: icon(d.icon), color: '#b9b2d9' }))
    : S.picked.map(id => ({ id, ico: icon(id), title: byId[id].unlock, note: byId[id].note, color: byId[id].color }));
  const scr = $('#scr');
  scr.innerHTML = `
  <div class="ul">
    <div class="pk-top"><button class="sbtn ghost" id="back">${CHEV_L} ${esc(COPY.change)}</button></div>
    <p class="ul-kick">${esc(skipped ? COPY.defaultKicker : COPY.unlockKicker)}</p>
    <h1 class="pk-h">${nw(skipped ? COPY.defaultTitle : COPY.unlockTitle)}</h1>
    <p class="pk-sub">${nw(skipped ? COPY.defaultSub : COPY.unlockSub)}</p>
    <ul class="ul-list ${skipped ? 'is-default' : ''}" id="ulList">
      ${items.map((it, i) => `<li class="ul-card" ${skipped ? 'data-default' : `data-unlock="${it.id}"`} style="--i:${i};--c:${it.color}">
        <span class="ul-emo">${it.ico}</span>
        <span class="ul-txt"><b>${nw(it.title)}</b><span>${nw(it.note)}</span></span>${CHEV}</li>`).join('')}
    </ul>
    <div class="pk-foot"><button class="btn-primary" id="start">${esc(COPY.start)}</button></div>
    <div class="toast" id="toast" role="status"></div>
  </div>`;
  $('#back').addEventListener('click', () => { S.screen = 'pick'; render(); });
  $('#start').addEventListener('click', () => {
    const t = $('#toast'); t.innerHTML = nw(COPY.startToast); t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
  });
}

/* ---------- helpers ---------- */
// Tall phones: grow the picker's art (via --k) until it fills the space, capped so it never looks blown up.
const FIT = new Set(['b', 'j']);
const FIT_MAX = 1.5, FIT_STEP = 0.05;
function fit(picker) {
  picker.classList.add('fit-measure');
  let k = 1;
  picker.style.setProperty('--k', k);
  while (k < FIT_MAX) {
    picker.style.setProperty('--k', k + FIT_STEP);
    if (picker.scrollHeight > picker.clientHeight) break;
    k += FIT_STEP;
  }
  picker.style.setProperty('--k', k.toFixed(2));
  picker.classList.remove('fit-measure');
}
addEventListener('resize', () => { const p = $('#picker'); if (p && FIT.has(S.v)) fit(p); });
function syncPressed(root) {
  root.querySelectorAll('[data-opt]').forEach(b => {
    const on = isPicked(b.dataset.opt);
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
}
function pulse(el, cls = 'pop') {
  if (!el || RM) return;
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
}
// Fly a small element from one rect to another (used for flicks and drops).
function fly(from, to, html, { arc = 40, rot = -10, dur = 520, cls = '' } = {}) {
  if (RM || !from || !to) return Promise.resolve();
  const d = document.createElement('div');
  d.className = 'fly ' + cls;
  d.innerHTML = html;
  Object.assign(d.style, { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px' });
  document.body.appendChild(d);
  const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
  const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
  const s = Math.min(to.width / from.width, to.height / from.height);
  const a = d.animate([
    { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
    { transform: `translate(${dx * 0.5}px,${dy * 0.5 - arc}px) scale(${(1 + s) / 2}) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.5 },
    { transform: `translate(${dx}px,${dy}px) scale(${s}) rotate(${rot}deg)`, opacity: 0.9 },
  ], { duration: dur, easing: 'cubic-bezier(.3,.7,.3,1)' });
  return a.finished.catch(() => {}).then(() => d.remove());
}
const rectOf = el => el ? el.getBoundingClientRect() : null;
const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

/* ---------- A · Card shuffle ---------- */
function mountA(el) {
  el.innerHTML = `<div class="a-pilebox"><div class="a-pile" id="aPile"></div><div class="a-cap" id="aCap"></div></div><div class="a-grid" id="aGrid"></div>`;
  const grid = $('#aGrid', el), pile = $('#aPile', el), cap = $('#aCap', el);
  const draw = () => {
    grid.innerHTML = OPTIONS.map(o => isPicked(o.id)
      ? `<div class="a-slot" data-slot="${o.id}" aria-hidden="true"><span>${icon(o.id)}</span></div>`
      : `<button class="a-card" data-opt="${o.id}" aria-pressed="false" style="--c:${o.color}"><span class="a-emo">${icon(o.id)}</span><span class="a-lab">${nw(o.label)}</span></button>`).join('');
    pile.innerHTML = S.picked.length
      ? S.picked.map((id, i) => `<button class="a-mini" data-opt="${id}" aria-pressed="true" aria-label="Put back: ${esc(byId[id].label)}" style="--r:${((i * 37) % 13) - 6}deg;--c:${byId[id].color}">${icon(id)}</button>`).join('')
      : `<div class="a-empty">${nw('Your hand · tap cards to add them')}</div>`;
    cap.innerHTML = S.picked.length ? nw(`${S.picked.length} in your hand · tap one to put it back`) : '';
  };
  draw();
  return {
    update(id, added) {
      const from = rectOf(added ? grid.querySelector(`[data-opt="${id}"]`) : pile.querySelector(`[data-opt="${id}"]`));
      draw();
      if (added) {
        const t = pile.querySelector(`[data-opt="${id}"]`);
        if (t && !RM) { t.style.visibility = 'hidden'; fly(from, rectOf(t), `<div class="a-flycard"><span>${icon(id)}</span></div>`, { rot: 8 }).then(() => { t.style.visibility = ''; pulse(t, 'land'); }); }
      } else pulse(grid.querySelector(`[data-opt="${id}"]`));
    },
  };
}

/* ---------- B · Gems light up ---------- */
const gemSVG = c => `<svg class="gem" viewBox="0 0 60 52" aria-hidden="true">
  <polygon class="g-body" points="12,2 48,2 58,17 30,50 2,17" style="fill:${c}"/>
  <polygon points="12,2 20,17 2,17" fill="#fff" opacity=".28"/><polygon points="12,2 30,2 20,17" fill="#fff" opacity=".42"/>
  <polygon points="30,2 48,2 40,17" fill="#fff" opacity=".18"/><polygon points="48,2 58,17 40,17" fill="#000" opacity=".1"/>
  <polygon points="2,17 20,17 30,50" fill="#fff" opacity=".12"/><polygon points="40,17 58,17 30,50" fill="#000" opacity=".22"/>
  <polygon points="20,17 40,17 30,50" fill="#fff" opacity=".05"/><polygon points="20,17 30,2 40,17" fill="#fff" opacity=".1"/>
  <polygon points="12,2 48,2 58,17 30,50 2,17" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1"/></svg>`;
function mountB(el) {
  el.innerHTML = `<div class="b-grid">${OPTIONS.map(o => `<button class="b-gem" data-opt="${o.id}" style="--c:${o.color}">
    <span class="b-gemwrap">${gemSVG(o.color)}<i class="b-spark">✦</i><i class="b-spark s2">✦</i></span>
    <span class="b-lab">${nw(o.label)}</span></button>`).join('')}</div>
    <p class="b-count" id="bCount"></p>`;
  const count = () => { $('#bCount', el).innerHTML = nw(S.picked.length ? `${S.picked.length} of 9 gems glowing` : 'Your gems are waiting in the dark'); };
  syncPressed(el); count();
  return { update(id, added) { syncPressed(el); count(); if (added) pulse(el.querySelector(`[data-opt="${id}"]`), 'shine'); } };
}

/* ---------- C · Map tiles unfog ---------- */
// The 3×3 grid of cleared squares is blurred, then sharpened back (a "goo" filter): the fog edge follows a smooth curve,
// so leftover fog shrinks to round puffs and clearings never show corners. Border squares extend past the edge so clearings reach it.
// A real street map (OpenStreetMap tiles, darkened and tinted to the app's dark map palette) under one continuous fog bank.
// Centred on the player only if location is already allowed (never prompts), otherwise the app's own default, downtown Edmonton.
const MAP_HOME = { lat: 53.5461, lon: -113.4938 };
const MAP_ZOOM = 16, TILE_PX = 256;
const TILE_URL = (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
const worldPx = ({ lat, lon }, z) => {
  const n = TILE_PX * 2 ** z, r = lat * Math.PI / 180;
  return [(lon + 180) / 360 * n, (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n];
};
function drawTiles(box, where) {
  const w = box.clientWidth, h = box.clientHeight; if (!w) return;
  const [cx, cy] = worldPx(where, MAP_ZOOM), left = cx - w / 2, top = cy - h / 2;
  let out = '';
  for (let tx = Math.floor(left / TILE_PX); tx * TILE_PX < left + w; tx++)
    for (let ty = Math.floor(top / TILE_PX); ty * TILE_PX < top + h; ty++)
      out += `<img src="${TILE_URL(MAP_ZOOM, tx, ty)}" alt="" draggable="false" style="left:${Math.round(tx * TILE_PX - left)}px;top:${Math.round(ty * TILE_PX - top)}px">`;
  box.innerHTML = out;
}
const FOG_SVG = `<svg class="c-fogsvg" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <filter id="cWisp" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".014" numOctaves="4" seed="11"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 .97  0 0 0 0 1  0 0 0 1.5 -.55"/></filter>
    <filter id="cGoo" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="32"/>
      <feComponentTransfer><feFuncR type="linear" slope="3.2" intercept="-1.35"/><feFuncG type="linear" slope="3.2" intercept="-1.35"/><feFuncB type="linear" slope="3.2" intercept="-1.35"/></feComponentTransfer>
      <feGaussianBlur stdDeviation="2"/></filter>
    <mask id="cMask" maskUnits="userSpaceOnUse" x="-60" y="-60" width="420" height="420"><g filter="url(#cGoo)"><rect x="-60" y="-60" width="420" height="420" fill="#fff"/>
      ${OPTIONS.map((o, i) => { const c = i % 3, r = Math.floor(i / 3), x0 = c ? c * 100 : -60, y0 = r ? r * 100 : -60, x1 = c < 2 ? (c + 1) * 100 : 360, y1 = r < 2 ? (r + 1) * 100 : 360;
        return `<rect class="c-hole" data-hole="${o.id}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#000"/>`; }).join('')}</g></mask>
  </defs>
  <g mask="url(#cMask)"><rect width="300" height="300" fill="#a99ed6"/><rect class="c-wisp" x="-60" y="-60" width="420" height="420" filter="url(#cWisp)"/>
    <rect width="300" height="300" fill="url(#cShade)"/></g>
  <defs><radialGradient id="cShade" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#d9d0f6" stop-opacity=".35"/><stop offset="1" stop-color="#6f62a8" stop-opacity=".45"/></radialGradient></defs>
</svg>`;
function mountC(el) {
  el.innerHTML = `<div class="c-map" id="cMap"><div class="c-tiles" id="cTiles"></div><div class="c-tint"></div>${FOG_SVG}
    <div class="c-grid">${OPTIONS.map(o => `<button class="c-tile" data-opt="${o.id}" style="--c:${o.color}">
      <span class="c-pin">${icon(o.id)}</span><span class="c-lab">${esc(o.label)}</span><span class="c-short">${esc(o.short)}</span></button>`).join('')}</div>
    <span class="c-credit">© OpenStreetMap contributors</span></div>
    <p class="c-count" id="cCount"></p>`;
  const tiles = $('#cTiles', el);
  let where = MAP_HOME;
  const redraw = () => drawTiles(tiles, where);
  requestAnimationFrame(redraw);
  new ResizeObserver(redraw).observe(tiles);
  navigator.permissions?.query({ name: 'geolocation' }).then(p => {
    if (p.state === 'granted') navigator.geolocation.getCurrentPosition(pos => { where = { lat: pos.coords.latitude, lon: pos.coords.longitude }; redraw(); });
  }).catch(() => {});
  const draw = () => {
    el.querySelectorAll('.c-hole').forEach(h => h.classList.toggle('on', isPicked(h.dataset.hole)));
    $('#cCount', el).innerHTML = nw(S.picked.length ? `${S.picked.length} of 9 squares cleared` : 'Your map is under fog. Tap to clear it.');
  };
  syncPressed(el); draw();
  return { update() { syncPressed(el); draw(); } };
}

/* ---------- D · Constellation ---------- */
const STARS = [[18, 18], [50, 10], [82, 20], [30, 44], [66, 40], [14, 70], [48, 66], [84, 64], [62, 90]];
function mountD(el) {
  el.innerHTML = `<div class="d-sky" id="dSky"><svg class="d-lines" id="dLines" aria-hidden="true"></svg>
    ${OPTIONS.map((o, i) => `<button class="d-star" data-opt="${o.id}" aria-label="${esc(o.label)}" style="left:${STARS[i][0]}%;top:${STARS[i][1]}%;--d:${(i * 0.37) % 2}s">
      <span class="d-dot"></span><span class="d-lab">${esc(o.short)}</span></button>`).join('')}</div>
    <p class="d-name" id="dName"></p>`;
  const sky = $('#dSky', el), svg = $('#dLines', el);
  const drawLines = animateLast => {
    const w = sky.clientWidth, h = sky.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const pts = S.picked.map(id => { const i = OPTIONS.findIndex(o => o.id === id); return [STARS[i][0] / 100 * w, STARS[i][1] / 100 * h]; });
    let out = '';
    for (let k = 1; k < pts.length; k++) {
      const [x1, y1] = pts[k - 1], [x2, y2] = pts[k]; const len = Math.hypot(x2 - x1, y2 - y1);
      const draw = animateLast && k === pts.length - 1 && !RM;
      out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${draw ? `class="draw" style="--len:${len}" stroke-dasharray="${len}" stroke-dashoffset="${len}"` : ''}/>`;
    }
    svg.innerHTML = out;
  };
  const name = () => {
    $('#dName', el).innerHTML = S.picked.length
      ? `<span class="d-nk">Your constellation</span> ${nw(S.picked.map(id => byId[id].short).join(' · '))}`
      : `<span class="d-nk">Your constellation</span> ${nw('Light a star to begin')}`;
  };
  syncPressed(el); name(); requestAnimationFrame(() => drawLines(false));
  return { update(id, added) { syncPressed(el); name(); drawLines(added); if (added) pulse(el.querySelector(`[data-opt="${id}"]`), 'twinkle'); } };
}

/* ---------- E · Pack your bag ---------- */
function mountE(el) {
  el.innerHTML = `<div class="e-items">${OPTIONS.map(o => `<button class="e-item" data-opt="${o.id}" style="--c:${o.color}">
      <span class="e-ico">${o.item}<i class="e-tick">✓</i></span><span class="e-lab">${nw(o.label)}</span></button>`).join('')}</div>
    <div class="e-bagbox"><div class="e-bag" id="eBag">
      <div class="e-peek" id="ePeek"></div>
      <svg viewBox="0 0 200 120" aria-hidden="true">
        <defs><clipPath id="eClip"><path d="M18 30 Q18 22 28 22 H172 Q182 22 182 30 L174 108 Q173 116 164 116 H36 Q27 116 26 108 Z"/></clipPath>
        <linearGradient id="eFillG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b36bff" stop-opacity=".75"/><stop offset="1" stop-color="#33c7d1" stop-opacity=".5"/></linearGradient></defs>
        <path d="M58 24 Q100 -14 142 24" fill="none" stroke="#8a62d6" stroke-width="7" stroke-linecap="round"/>
        <path d="M18 30 Q18 22 28 22 H172 Q182 22 182 30 L174 108 Q173 116 164 116 H36 Q27 116 26 108 Z" fill="#33255f" stroke="#b36bff" stroke-width="2"/>
        <rect id="eFill" clip-path="url(#eClip)" x="0" y="116" width="200" height="0" fill="url(#eFillG)"/>
        <path d="M22 26 H178 L164 54 Q100 70 36 54 Z" fill="#4a3585" stroke="#c49bff" stroke-width="1.5"/>
        <rect x="92" y="52" width="16" height="14" rx="3" fill="#ffc861"/>
        <g stroke="#c49bff" stroke-opacity=".35" stroke-dasharray="3 4" fill="none"><path d="M30 104 H170"/></g>
      </svg>
      <div class="e-bagtxt" id="eTxt"></div></div></div>`;
  const peek = $('#ePeek', el), fill = $('#eFill', el), txt = $('#eTxt', el), bag = $('#eBag', el);
  const drawBag = () => {
    const n = S.picked.length;
    peek.innerHTML = S.picked.map((id, i) => `<span data-p="${id}" style="--x:${(i - (n - 1) / 2) * 22}px;--r:${((i * 29) % 21) - 10}deg">${byId[id].item}</span>`).join('');
    const h = 88 * n / OPTIONS.length;
    fill.setAttribute('y', 116 - h); fill.setAttribute('height', h);
    txt.innerHTML = n ? nw(`${n} packed for tomorrow`) : nw('Your bag is empty');
  };
  syncPressed(el); drawBag();
  return {
    update(id, added) {
      const src = rectOf(el.querySelector(`[data-opt="${id}"] .e-ico`));
      syncPressed(el); drawBag();
      if (added) {
        const t = peek.querySelector(`[data-p="${id}"]`);
        if (t && !RM) { t.style.visibility = 'hidden'; fly(src, rectOf(t), `<span class="e-flyico">${byId[id].item}</span>`, { arc: 60, rot: 20 }).then(() => { t.style.visibility = ''; pulse(bag, 'wiggle'); }); }
      }
    },
  };
}

/* ---------- F · Swipe deck ---------- */
function mountF(el) {
  let idx = 0; const seen = {};
  el.innerHTML = `<div class="f-deck" id="fDeck"></div>
    <div class="f-btns"><button class="sbtn f-no" data-act="no">✕ Not for me</button><button class="sbtn f-yes" data-act="yes">✓ Yes</button></div>
    <div class="f-dots" id="fDots"></div>
    <div class="f-yeses"><span class="f-ylab">Your yeses</span><div class="chips" id="fChips"></div></div>`;
  const deck = $('#fDeck', el), dots = $('#fDots', el), chips = $('#fChips', el), btns = el.querySelector('.f-btns');
  const drawDeck = () => {
    if (idx >= OPTIONS.length) {
      deck.innerHTML = `<div class="f-done"><span class="f-demo">✨</span><b>${nw("That's the whole deck")}</b><button class="sbtn ghost" data-act="again">Go through again</button></div>`;
      btns.classList.add('off');
    } else {
      btns.classList.remove('off');
      deck.innerHTML = OPTIONS.slice(idx, idx + 3).map((o, k) => `<div class="f-card ${k === 0 ? 'top' : ''}" style="--k:${k};--c:${o.color}" ${k === 0 ? 'id="fTop"' : ''}>
        <span class="f-stamp yes">YES</span><span class="f-stamp no">NOPE</span>
        <span class="f-n">${idx + k + 1} of ${OPTIONS.length}</span><span class="f-emo">${icon(o.id)}</span><b class="f-lab">${nw(o.label)}</b>
        <span class="f-un">Unlocks · ${nw(o.unlock)}</span></div>`).reverse().join('');
      bindSwipe($('#fTop', el));
    }
    dots.innerHTML = OPTIONS.map((o, i) => `<i class="${i === idx ? 'cur' : ''} ${seen[o.id] === 'yes' && isPicked(o.id) ? 'yes' : seen[o.id] ? 'no' : ''}"></i>`).join('');
  };
  const drawChips = () => {
    chips.innerHTML = S.picked.length
      ? S.picked.map(id => `<button class="chip on" data-opt="${id}" aria-pressed="true" aria-label="Remove ${esc(byId[id].label)}"><span>${icon(id)}</span><span>${esc(byId[id].short)}</span><span class="x">✕</span></button>`).join('')
      : `<span class="f-none">${nw('None yet. Swipe right on what sounds like you.')}</span>`;
  };
  let busy = false;
  const decide = (yes, fromDrag) => {
    if (busy || idx >= OPTIONS.length) return;
    const o = OPTIONS[idx], top = $('#fTop', el);
    seen[o.id] = yes ? 'yes' : 'no';
    toggle(o.id, yes);
    const finish = () => { idx++; busy = false; drawDeck(); };
    if (RM || !top) return finish();
    busy = true;
    const cs = getComputedStyle(top).transform;
    top.animate([{ transform: cs === 'none' ? 'none' : cs }, { transform: `translateX(${yes ? 420 : -420}px) rotate(${yes ? 24 : -24}deg)`, opacity: 0 }],
      { duration: fromDrag ? 220 : 340, easing: 'ease-in', fill: 'forwards' }).finished.then(finish, finish);
  };
  function bindSwipe(card) {
    if (!card) return;
    let x0 = null, dx = 0;
    card.addEventListener('pointerdown', e => { x0 = e.clientX; dx = 0; card.setPointerCapture(e.pointerId); card.classList.add('drag'); });
    card.addEventListener('pointermove', e => {
      if (x0 === null) return; dx = e.clientX - x0;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      card.style.setProperty('--yes', Math.max(0, Math.min(1, dx / 90)));
      card.style.setProperty('--no', Math.max(0, Math.min(1, -dx / 90)));
    });
    const end = () => {
      if (x0 === null) return; x0 = null; card.classList.remove('drag');
      if (Math.abs(dx) > 80) decide(dx > 0, true);
      else { card.style.transform = ''; card.style.setProperty('--yes', 0); card.style.setProperty('--no', 0); }
    };
    card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
  }
  el.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'again') { idx = 0; drawDeck(); } else decide(a.dataset.act === 'yes');
  });
  drawDeck(); drawChips();
  return { update() { drawChips(); dots.innerHTML = OPTIONS.map((o, i) => `<i class="${i === idx ? 'cur' : ''} ${isPicked(o.id) ? 'yes' : seen[o.id] ? 'no' : ''}"></i>`).join(''); } };
}

/* ---------- G · Bubbles ---------- */
const BUB = [[58, 62, 98], [168, 50, 88], [280, 68, 100], [62, 178, 92], [172, 166, 106], [286, 184, 90], [70, 292, 96], [182, 284, 90], [284, 298, 100]];
function mountG(el) {
  el.innerHTML = `<div class="g-field">${OPTIONS.map((o, i) => `<button class="g-bub" data-opt="${o.id}" aria-label="${esc(o.label)}"
      style="left:${BUB[i][0]}px;top:${BUB[i][1]}px;--s:${BUB[i][2]}px;--c:${o.color};--d:${(i * 0.53) % 3}s;--t:${5 + (i % 3)}s">
      <span class="g-in"><span class="g-emo">${icon(o.id)}</span><span class="g-lab">${esc(o.short)}</span><i class="g-tick">✓</i></span></button>`).join('')}</div>`;
  syncPressed(el);
  return { update(id, added) { syncPressed(el); if (added) pulse(el.querySelector(`[data-opt="${id}"] .g-in`), 'boing'); } };
}

/* ---------- H · Trail of lanterns ---------- */
const LANTERN = `<svg class="lan" viewBox="0 0 30 44" aria-hidden="true">
  <path d="M15 1 V6" stroke="#8f86b8" stroke-width="2"/><rect x="9" y="5" width="12" height="4" rx="1.5" fill="#6b5fa0"/>
  <path class="lan-glass" d="M8 10 H22 Q26 22 22 34 H8 Q4 22 8 10Z"/><path class="lan-flame" d="M15 15 Q19 22 15 28 Q11 22 15 15Z"/>
  <rect x="7" y="34" width="16" height="5" rx="2" fill="#6b5fa0"/><path d="M8 10 H22 Q26 22 22 34 H8 Q4 22 8 10Z" fill="none" stroke="#a79bd8" stroke-width="1.4"/></svg>`;
function mountH(el) {
  const top = 110, step = 64, H = top + step * OPTIONS.length + 50;
  const pts = OPTIONS.map((o, i) => [i % 2 ? 78 : 22, top + i * step + 20]);
  const all = [[50, 78], ...pts, [50, H - 14]];
  let d = `M ${all[0][0]} ${all[0][1]}`;
  for (let i = 1; i < all.length; i++) { const [x0, y0] = all[i - 1], [x1, y1] = all[i]; const my = (y0 + y1) / 2; d += ` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`; }
  el.innerHTML = `<div class="h-trail" style="height:${H}px">
    <svg class="h-path" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" class="h-base"/><path d="${d}" class="h-dash"/></svg>
    <div class="h-door" id="hDoor"><svg viewBox="0 0 60 76" aria-hidden="true"><defs><radialGradient id="hGlow"><stop offset="0" stop-color="#ffe7a8"/><stop offset="1" stop-color="#ffc861" stop-opacity="0"/></radialGradient></defs>
      <circle cx="30" cy="44" r="34" fill="url(#hGlow)" class="h-halo"/>
      <path d="M8 74 V30 Q8 6 30 6 Q52 6 52 30 V74Z" fill="#2c2158" stroke="#c49bff" stroke-width="2"/>
      <path class="h-light" d="M12 74 V31 Q12 10 30 10 Q48 10 48 31 V74Z"/><circle cx="43" cy="46" r="2.4" fill="#ffc861"/></svg>
      <span class="h-dlab">Tomorrow</span></div>
    ${OPTIONS.map((o, i) => `<button class="h-lan ${i % 2 ? 'r' : 'l'}" data-opt="${o.id}" style="${i % 2 ? `right:${100 - pts[i][0]}%` : `left:${pts[i][0]}%`};top:${pts[i][1]}px">
      <span class="h-pool"></span>${LANTERN}<span class="h-lab">${icon(o.id)} ${nw(o.label)}</span></button>`).join('')}
    <span class="h-you" style="top:${H - 30}px">👣 You, tonight</span></div>`;
  const door = $('#hDoor', el);
  const glow = () => door.style.setProperty('--g', S.picked.length / OPTIONS.length);
  syncPressed(el); glow();
  return { update(id, added) { syncPressed(el); glow(); if (added) pulse(el.querySelector(`[data-opt="${id}"] .lan`), 'flare'); } };
}

/* ---------- I · Bookerton chat ---------- */
const BOOK_AV = `<span class="i-av" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#3a2a72" stroke="#b36bff" stroke-width="1.5"/>
  <rect x="10" y="12" width="20" height="16" rx="3" fill="#c49bff"/><path d="M20 12 V28" stroke="#3a2a72" stroke-width="1.5"/>
  <circle cx="15" cy="19" r="2" fill="#170c35"/><circle cx="25" cy="19" r="2" fill="#170c35"/><path d="M15 24 Q20 27 25 24" stroke="#170c35" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M20 12 V7" stroke="#33c7d1" stroke-width="1.5"/><circle cx="20" cy="6" r="2" fill="#33c7d1"/></svg></span>`;
function mountI(el) {
  el.innerHTML = `<div class="i-chat" id="iChat">
      <div class="i-row bot"><div class="i-col"><span class="i-name">${esc(BOOKERTON.name)}</span>
        <div class="i-b bot" style="--d:0s">${nw(BOOKERTON.intro1)}</div><div class="i-b bot" style="--d:.5s">${nw(BOOKERTON.intro2)}</div></div>${BOOK_AV}</div>
      <div class="i-row me" id="iMeRow" hidden><div class="i-b me" id="iMe"></div></div>
      <div class="i-row bot" id="iReactRow" hidden>${BOOK_AV}<div class="i-b bot" id="iReact"></div></div>
    </div>
    <div class="i-chips chips">${OPTIONS.map(o => `<button class="chip" data-opt="${o.id}" aria-label="${esc(o.label)}"><span>${icon(o.id)}</span><span>${esc(o.short)}</span></button>`).join('')}</div>`;
  const chat = $('#iChat', el), me = $('#iMe', el), meRow = $('#iMeRow', el), react = $('#iReact', el), reactRow = $('#iReactRow', el);
  let timer;
  const drawMe = () => {
    meRow.hidden = !S.picked.length;
    me.innerHTML = S.picked.map(id => `<span class="i-pk">${icon(id)} ${esc(byId[id].short)}</span>`).join('');
  };
  syncPressed(el); drawMe();
  if (S.picked.length) { reactRow.hidden = false; react.innerHTML = nw(byId[S.picked[S.picked.length - 1]].bookerton); }
  return {
    update(id, added) {
      syncPressed(el); drawMe();
      const line = !S.picked.length ? BOOKERTON.empty : !added ? BOOKERTON.removed : S.picked.length >= 6 ? BOOKERTON.many : byId[id].bookerton;
      reactRow.hidden = false; clearTimeout(timer);
      const say = () => { react.innerHTML = nw(line); react.classList.remove('typing'); chat.scrollTop = chat.scrollHeight; };
      if (RM) say(); else { react.classList.add('typing'); react.innerHTML = '<i></i><i></i><i></i>'; timer = setTimeout(say, 420); }
      chat.scrollTop = chat.scrollHeight;
    },
  };
}

/* ---------- J · Passport stamps ---------- */
function mountJ(el) {
  el.innerHTML = `<div class="j-pass"><div class="j-head"><span>Story City</span><span class="j-hc">Explorer passport</span></div>
    <div class="j-grid">${OPTIONS.map((o, i) => `<button class="j-slot" data-opt="${o.id}" style="--c:${o.color};--r:${((i * 41) % 25) - 12}deg">
      <span class="j-ring"><span class="j-ghost">${icon(o.id)}</span>
        <span class="j-stamp"><span class="j-se">${icon(o.id)}</span><span class="j-sl">${esc(o.short)}</span><span class="j-sd">Today</span></span></span>
      <span class="j-lab">${nw(o.label)}</span></button>`).join('')}</div>
    <p class="j-count" id="jCount"></p></div>`;
  const count = () => { $('#jCount', el).innerHTML = nw(S.picked.length ? `${S.picked.length} ${S.picked.length === 1 ? 'stamp' : 'stamps'} on your first page` : 'A blank page, waiting for stamps'); };
  syncPressed(el); count();
  return { update() { syncPressed(el); count(); } };
}

/* ---------- K · Potion brew ---------- */
function mountK(el) {
  el.innerHTML = `<div class="k-pot" id="kPot">
      <svg viewBox="0 0 200 150" aria-hidden="true">
        <defs><radialGradient id="kLiq" cx=".5" cy=".4"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
        <ellipse cx="100" cy="146" rx="62" ry="4" fill="#000" opacity=".35"/>
        <path d="M34 58 Q26 120 70 138 H130 Q174 120 166 58Z" fill="#2a2150" stroke="#6b5fa0" stroke-width="2"/>
        <path d="M60 138 L52 148 M140 138 L148 148" stroke="#6b5fa0" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="100" cy="58" rx="70" ry="15" fill="#382c6a" stroke="#8a7fc0" stroke-width="2"/>
        <ellipse id="kLiquid" cx="100" cy="60" rx="62" ry="11" fill="#4a4270"/>
        <ellipse cx="100" cy="60" rx="62" ry="11" fill="url(#kLiq)"/>
      </svg>
      <div class="k-bubbles" id="kBub"></div><div class="k-splash" id="kSplash"></div>
    </div>
    <p class="k-name" id="kName"></p>
    <div class="k-shelf">${OPTIONS.map(o => `<button class="k-ing" data-opt="${o.id}" style="--c:${o.color}"><span class="k-jar">${o.ingredient}</span><span class="k-lab">${nw(o.label)}</span></button>`).join('')}</div>`;
  const liq = $('#kLiquid', el), bub = $('#kBub', el), nameEl = $('#kName', el), pot = $('#kPot', el), splash = $('#kSplash', el);
  const draw = () => {
    const n = S.picked.length;
    let col = '#4a4270';
    if (n) { const rgb = S.picked.map(id => hexToRgb(byId[id].color)).reduce((a, c) => a.map((v, i) => v + c[i]), [0, 0, 0]).map(v => Math.round(v / n)); col = `rgb(${rgb.join(',')})`; }
    liq.setAttribute('fill', col); pot.style.setProperty('--brew', col); pot.classList.toggle('lit', n > 0);
    const count = n ? Math.min(3 + n * 2, 16) : 2;
    bub.innerHTML = Array.from({ length: count }, (_, i) => `<i style="left:${22 + ((i * 37) % 56)}%;--d:${((i * 0.41) % 2).toFixed(2)}s;--s:${6 + (i * 5) % 9}px"></i>`).join('');
    nameEl.innerHTML = n ? `<span class="k-nk">Your brew</span> ${nw(S.picked.map(id => byId[id].short).join(' + '))}` : `<span class="k-nk">Empty cauldron</span> ${nw('Drop something in')}`;
  };
  syncPressed(el); draw();
  return {
    update(id, added) {
      const src = rectOf(el.querySelector(`[data-opt="${id}"] .k-jar`));
      syncPressed(el);
      if (added && !RM) {
        const r = rectOf(pot), tgt = { left: r.left + r.width / 2 - 14, top: r.top + r.height * 0.32, width: 28, height: 28 };
        fly(src, tgt, `<span class="k-flyico">${byId[id].ingredient}</span>`, { arc: 70, rot: 160, dur: 600 }).then(() => { draw(); pulse(splash, 'go'); });
      } else draw();
    },
  };
}

/* ---------- L · Explorer card ---------- */
function explorerTitle() {
  const n = S.picked.length;
  if (!n) return EXPLORER.emptyTitle;
  const words = S.picked.slice(0, 2).map(id => byId[id]).sort((a, b) => a.titleRank - b.titleRank).map(o => o.titleWord);
  return `${words.join(' ')} ${n >= 5 ? EXPLORER.nounMany : n >= 3 ? EXPLORER.nounSome : EXPLORER.nounFew}`;
}
function mountL(el) {
  el.innerHTML = `<div class="l-card" id="lCard"><div class="l-shine"></div>
      <div class="l-head"><span class="l-kick">${esc(EXPLORER.cardLabel)}</span><span class="l-no">No. 0001</span></div>
      <div class="l-main"><span class="l-av" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#2c2158" stroke="#c49bff" stroke-width="1.5"/>
        <circle cx="24" cy="18" r="7" fill="#c49bff"/><path d="M11 40 Q12 28 24 28 Q36 28 37 40" fill="#c49bff"/></svg></span>
        <span class="l-who"><span class="l-name">${esc(EXPLORER.name)}</span><b class="l-title" id="lTitle"></b><span class="l-meta">${esc(EXPLORER.meta)}</span></span></div>
      <div class="l-badges" id="lBadges"></div></div>
    <p class="l-add">${esc(EXPLORER.addLabel)}</p>
    <div class="chips l-chips">${OPTIONS.map(o => `<button class="chip" data-opt="${o.id}" aria-label="${esc(o.label)}"><span>${icon(o.id)}</span><span>${esc(o.short)}</span></button>`).join('')}</div>`;
  const title = $('#lTitle', el), badges = $('#lBadges', el), card = $('#lCard', el);
  const drawBadges = newId => {
    badges.innerHTML = S.picked.length
      ? S.picked.map(id => `<span class="l-badge ${id === newId && !RM ? 'new' : ''}" style="--c:${byId[id].color}" title="${esc(byId[id].label)}">${icon(id)}</span>`).join('')
      : `<span class="l-empty">${nw(EXPLORER.emptyBadges)}</span>`;
  };
  title.innerHTML = nw(explorerTitle()); syncPressed(el); drawBadges();
  return {
    update(id, added) {
      syncPressed(el); drawBadges(added ? id : null);
      const t = explorerTitle();
      if (RM) title.innerHTML = nw(t);
      else { title.classList.add('swap'); setTimeout(() => { title.innerHTML = nw(t); title.classList.remove('swap'); pulse(card, 'glint'); }, 160); }
    },
  };
}

/* ---------- M · Living street ---------- */
// Flat vector street in the app's illustration style: night sky with the FTUE's rainbow rings, flat buildings, dashed trail.
const WALKER = (c, s = '#ffd9b8') => `<svg viewBox="0 0 24 48" aria-hidden="true"><circle cx="12" cy="7" r="5" fill="${s}"/><path d="M6 14h12l2 16h-4l-1 16h-3l-1-12-1 12H7L6 30H4z" fill="${c}"/><path d="M6 14h4l-2 16H4z" fill="#fff" opacity=".18"/></svg>`;
// The FTUE background's thin rainbow rings, drawn from one corner
const RINGS = `<svg class="rings" viewBox="0 0 140 140" aria-hidden="true"><g fill="none" stroke-width="1.3"><circle r="70" stroke="#E62828"/><circle r="84" stroke="#F5792F"/><circle r="98" stroke="#F5C907"/><circle r="112" stroke="#64C849"/><circle r="126" stroke="#1FA4F4"/></g></svg>`;
const STREET_SVG = `<svg class="m-bg" viewBox="0 0 360 300" aria-hidden="true">
  <defs><linearGradient id="mTrail" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#F5D007"/><stop offset="1" stop-color="#55D85A"/></linearGradient></defs>
  <g class="m-sky-home" fill="#1d1546"><rect x="0" y="120" width="48" height="110"/><rect x="44" y="96" width="36" height="134"/><rect x="150" y="110" width="60" height="120"/><rect x="250" y="88" width="40" height="142"/><rect x="286" y="124" width="74" height="106"/></g>
  <g class="m-sky-city" fill="#1d1546"><path d="M24 230V60l6-22 6 22v170z"/><rect x="12" y="120" width="36" height="110"/><path d="M150 230l18-110h4l18 110z"/><rect x="160" y="150" width="20" height="4" fill="#2a1f5c"/><circle cx="268" cy="104" r="22"/><rect x="246" y="104" width="44" height="126"/><path d="M262 82h12l-6-22z"/><rect x="300" y="130" width="60" height="100"/></g>
  <g fill="#2e2458"><rect x="10" y="150" width="70" height="90" rx="3"/><path d="M8 152l37-24 37 24z"/><rect x="230" y="140" width="80" height="100" rx="3"/><rect x="310" y="168" width="50" height="72" rx="3"/><rect x="86" y="176" width="54" height="64" rx="3"/></g>
  <g fill="#3b3070"><rect x="22" y="170" width="14" height="16" rx="2"/><rect x="54" y="170" width="14" height="16" rx="2"/><rect x="22" y="200" width="14" height="16" rx="2"/>
    <rect x="244" y="156" width="16" height="18" rx="2"/><rect x="276" y="156" width="16" height="18" rx="2"/><rect x="244" y="190" width="16" height="18" rx="2"/><rect x="322" y="184" width="12" height="14" rx="2"/><rect x="98" y="190" width="12" height="14" rx="2"/><rect x="118" y="190" width="12" height="14" rx="2"/></g>
  <rect class="m-window" x="276" y="190" width="16" height="18" rx="2" fill="#5ee0c2"/>
  <rect x="48" y="214" width="16" height="26" rx="2" fill="#1d1546"/><rect class="m-door" x="48" y="214" width="16" height="26" rx="2" fill="#ff9f6b"/>
  <rect x="0" y="238" width="360" height="62" fill="#1f1748"/><rect x="0" y="238" width="360" height="4" fill="#3b3070"/>
  <path class="m-trail" d="M180 300 C 170 272, 120 268, 118 252 S 200 240, 262 244" fill="none" stroke="#6b5fa0" stroke-width="3" stroke-dasharray="5 6" stroke-linecap="round"/>
  <path class="m-trail-on" d="M180 300 C 170 272, 120 268, 118 252 S 200 240, 262 244" fill="none" stroke="url(#mTrail)" stroke-width="4" stroke-dasharray="5 6" stroke-linecap="round"/>
</svg>`;
// where each pick shows up, as % of the 360×300 street drawing
const STREET_SPOTS = { stories: [12.5, 36], gems: [55, 62], puzzles: [24, 64], daily: [76, 14], treadmill: [80, 56] };
function mountM(el) {
  el.innerHTML = `<div class="m-scene" id="mScene">${RINGS}<span class="m-moon"></span><div class="m-stage">${STREET_SVG}
      ${['stories', 'gems', 'puzzles', 'treadmill'].map(id => `<span class="m-pin" data-el="${id}" style="left:${STREET_SPOTS[id][0]}%;top:${STREET_SPOTS[id][1]}%;--c:${byId[id].color}">${icon(id)}</span>`).join('')}
      <span class="m-gem2" data-el="gems">${icon('gems')}</span>
      <span class="m-balloon" data-el="daily" style="left:${STREET_SPOTS.daily[0]}%;top:${STREET_SPOTS.daily[1]}%">${icon('daily')}</span>
      <span class="m-walkers"><span class="m-friend" data-el="together">${WALKER('#ff8fb1', '#f2c39b')}</span><span class="m-you">${WALKER('#b36bff')}</span></span></div>
      <div class="m-fog" data-el="fog"></div>
      <span class="m-steps" data-el="steps">${icon('steps')} ${esc(STREET.stepGoal)}</span>
      <span class="m-passport" data-el="city">${icon('city')}</span>
    </div>
    <p class="m-cap" id="mCap"></p>
    <div class="chips m-chips">${OPTIONS.map(o => `<button class="chip" data-opt="${o.id}" style="--c:${o.color}">${icon(o.id)}<span>${esc(o.short)}</span></button>`).join('')}</div>`;
  const scene = $('#mScene', el), cap = $('#mCap', el);
  const draw = () => {
    OPTIONS.forEach(o => scene.classList.toggle('has-' + o.id, isPicked(o.id)));
    cap.innerHTML = S.picked.length
      ? `<span class="d-nk">${esc(STREET.label)}</span> ${S.picked.map(id => `<span style="white-space:nowrap">${esc(byId[id].short)}</span>`).join(' · ')}`
      : `<span class="d-nk">${esc(STREET.label)}</span> ${nw(STREET.empty)}`;
  };
  syncPressed(el); draw();
  return { update(id, added) { syncPressed(el); draw(); if (added) scene.querySelectorAll(`[data-el="${id}"]`).forEach(e => pulse(e, 'arrive')); } };
}

const MOUNTS = { a: mountA, b: mountB, c: mountC, d: mountD, e: mountE, f: mountF, g: mountG, h: mountH, i: mountI, j: mountJ, k: mountK, l: mountL, m: mountM };
window.__explore = { S, toggle };
render();
