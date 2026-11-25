/* GEM-PINS-V2-v4 — Brett’s pick on Melissa’s map, plus the legend roller and three slide-outs. */
if (new URLSearchParams(location.search).get('embed') === '1') document.body.classList.add('is-embed');
import { CATS, COPY, LOVE, NAMES, OWNERS, PHOTOS, RARITY } from '../gem-pins/data.js';
import { pinSvg } from '../gem-pins/gems.js';
import { ART } from '../gem-pins/gem-art.js';

const $ = (id) => document.getElementById(id);
const DENSITY = 40;
const SIZES = [22, 28, 34];
const SHEETS = ['prompt', 'image', 'corner'];
const TOAST_MS = 1600;
const ART_KEY = { nature: 'nature', eat: 'eatshop', shop: 'eatshop', culture: 'art', play: 'activities', landmark: 'landmarks' };
const ART_COLOUR = { nature: '#2fd6a2', eatshop: '#ff5c7a', art: '#41c7d8', activities: '#f5c44a', nugget: '#b36bff', fan: '#b36bff', landmarks: '#f29b2e', mine: '#cdd6ea' };
const EXPLAIN = {
  nature: '[explain nature finds]',
  eat: '[explain eat and drink finds]',
  shop: '[explain shop finds]',
  culture: '[explain culture finds]',
  play: '[explain play finds]',
  landmark: '[explain landmark finds]',
  curio: '[explain curiosity finds]',
  liked: '[explain liked gems]',
  wishlist: '[explain saved for later]',
};
const STOPS = [
  ...CATS.map((c) => ({ id: c.id, label: c.label })),
  { id: 'liked', label: 'Liked' },
  { id: 'wishlist', label: 'Wishlist' },
];

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const r = rng(4242);
const pickOne = (arr) => arr[Math.floor(r() * arr.length)];
const PTS = [];
for (let tries = 0; PTS.length < 100 && tries < 20000; tries++) {
  const x = 26 + r() * 338;
  const y = 30 + r() * 580;
  if (PTS.every(([a, b]) => Math.hypot(a - x, b - y) > 31)) PTS.push([x, y]);
}
const SPECIAL = [
  { mine: true, private: true }, { mine: true, private: false }, { liked: true }, { mythical: true },
  { mine: true, private: true }, { liked: true }, { mine: true, private: false }, { liked: true },
  { expiring: '2h', left: '2 hours', from: 'Whimsy Walk' }, { seasonal: true },
  { expiring: '1d', left: '1 day', from: 'challenge' }, { seasonal: true },
];
const order = PTS.map((p, i) => i).sort((a, b) => {
  const d = ([x, y]) => Math.hypot(x - 195, (y - 330) * 0.8);
  return d(PTS[a]) - d(PTS[b]);
});
const centre = order.filter((i, j) => j % 4 === 0).slice(0, SPECIAL.length);
const rest = PTS.map((p, i) => i).filter((i) => !centre.includes(i));
const rv = rng(777);
const FIRST10 = ['eat', 'nature', 'shop', 'culture', 'shop', 'landmark', 'play', 'curio', 'eat', 'nature'];
const GEMS = [...centre, ...rest].map((pi, i) => {
  const sp = SPECIAL[i] || {};
  const tags = [i < 10 ? FIRST10[i] : pickOne(CATS).id];
  const extra = r();
  if (extra > 0.45) tags.push(pickOne(CATS.filter((c) => !tags.includes(c.id))).id);
  if (extra > 0.85) tags.push(pickOne(CATS.filter((c) => !tags.includes(c.id))).id);
  return {
    id: i,
    at: [PTS[pi][0] / 390, PTS[pi][1] / 640],
    name: pickOne(NAMES[tags[0]]),
    tags,
    rarity: sp.mythical ? 'mythical' : sp.mine || sp.liked ? (i % 3 === 0 ? 'rare' : 'common') : r() < 0.22 ? 'rare' : 'common',
    mine: !!sp.mine,
    private: !!sp.private,
    liked: !!sp.liked,
    owner: sp.mine ? null : OWNERS[i % OWNERS.length],
    likes: sp.liked ? 3 + (i % 9) : Math.floor(r() * 12),
    visited: !sp.mine && !sp.mythical && !sp.liked && rv() < 0.33 && !sp.expiring && !sp.seasonal,
    expiring: sp.expiring || null,
    seasonal: !!sp.seasonal,
    photo: `../gem-pins/${PHOTOS[i % PHOTOS.length]}`,
  };
});
GEMS.forEach((g) => { if (g.rarity === 'rare' && g.id % 2) g.rarity = 'epic'; });

const SLATE = [104, 99, 150];
function slateTones(markup) {
  return markup.replace(/#([0-9a-f]{6})\b/gi, (m, h) => {
    const [rr, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    if (Math.max(rr, g, b) - Math.min(rr, g, b) < 24 && rr > 200) return '#b7b3d6';
    if (Math.max(rr, g, b) - Math.min(rr, g, b) < 24) return m;
    const l = (0.299 * rr + 0.587 * g + 0.114 * b) / 255;
    const mixTo = l > 0.55 ? 255 : 0;
    const t = l > 0.55 ? (l - 0.55) / 0.45 * 0.45 : (0.55 - l) / 0.55 * 0.55;
    return '#' + SLATE.map((c) => Math.round(c + (mixTo - c) * t).toString(16).padStart(2, '0')).join('');
  }).replace(/stroke="#fff"/gi, 'stroke="#b7b3d6"').replace(/stroke="#FFFFFF"/g, 'stroke="#b7b3d6"');
}
const levels = ['common', 'rare', 'mythical'];
function rarityOf(g) {
  if (levels.includes(g.rarity)) return g.rarity;
  return g.rarity === 'mythical' ? 'mythical' : 'rare';
}
function sizeOf(g) {
  const i = levels.indexOf(rarityOf(g));
  return Math.round(SIZES[0] + ((SIZES[2] - SIZES[0]) * i) / (levels.length - 1));
}
function glowOf(g) {
  const lv = rarityOf(g);
  return lv === 'common' ? null : lv;
}
function artFor(g) {
  if (g.seasonal) return null;
  const tag = g.tags[0];
  const key = g.mine ? 'mine' : tag === 'curio' ? 'nugget' : ART_KEY[tag] || 'nature';
  const hollow = g.mine && g.private;
  const markup = ART[hollow ? 'hollow' : 'victoria'][key];
  if (g.visited) return { markup: slateTones(markup), colour: '#6863a0' };
  return { markup, colour: ART_COLOUR[key] };
}
function colourOf(g) {
  return artFor(g)?.colour || '#9fe3ff';
}
function pinFor(g) {
  const art = artFor(g);
  const fill = colourOf(g);
  return pinSvg({
    art: art?.markup,
    shape: g.mine ? 'classic' : g.seasonal ? 'winter' : 'classic',
    size: sizeOf(g),
    fill,
    heart: g.liked && !g.mine,
    loveColour: LOVE,
    glow: glowOf(g),
    clock: !!g.expiring,
  });
}

const saved = new Set();
let filterOn = false;
let stopId = 'nature';
let openId = null;
let sheet = SHEETS.includes(new URLSearchParams(location.search).get('sheet'))
  ? new URLSearchParams(location.search).get('sheet')
  : 'prompt';
let toastTimer = 0;
let lockScroll = false;

const view = { z: 1, x: 0, y: 0 };
const ZMIN = 1;
const ZMAX = 3.2;
function clampView() {
  view.z = Math.min(ZMAX, Math.max(ZMIN, view.z));
  const ph = $('phone').getBoundingClientRect();
  const mx = ((view.z - 1) * ph.width) / 2;
  const my = ((view.z - 1) * ph.height) / 2;
  view.x = Math.min(mx, Math.max(-mx, view.x));
  view.y = Math.min(my, Math.max(-my, view.y));
}
function applyView() {
  clampView();
  $('map').style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.z})`;
}
function placeOf(g, box, phone) {
  const cx = phone.width / 2 - (box.left - phone.left);
  const cy = phone.height / 2 - (box.top - phone.top);
  const px = g.at[0] * box.width;
  const py = g.at[1] * box.height;
  return [cx + (px - cx) * view.z + view.x, cy + (py - cy) * view.z + view.y];
}

function shown(g) {
  if (!filterOn) return true;
  if (stopId === 'liked') return g.liked;
  if (stopId === 'wishlist') return saved.has(g.id);
  return g.tags.includes(stopId);
}

function drawPins(animate) {
  const pins = $('pins');
  applyView();
  const box = pins.getBoundingClientRect();
  const phone = $('phone').getBoundingClientRect();
  const rank = (g) => (g.rarity === 'mythical' ? 3 : g.mine ? 2 : g.liked ? 1 : 0);
  const list = GEMS.slice(0, DENSITY).filter(shown).sort((a, b) => rank(a) - rank(b));
  const keep = new Set();
  for (const g of list) {
    const p = placeOf(g, box, phone);
    if (p[0] < -22 || p[0] > box.width + 22 || p[1] < -22 || p[1] > box.height + 22) continue;
    keep.add(String(g.id));
    let b = pins.querySelector(`.pin[data-id="${g.id}"]`);
    if (!b) {
      b = document.createElement('button');
      b.type = 'button';
      b.className = 'pin' + (animate ? ' is-enter' : '');
      b.dataset.id = String(g.id);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panMoved) return;
        openGem(GEMS[Number(b.dataset.id)]);
      });
      pins.append(b);
    }
    b.style.left = `${p[0]}px`;
    b.style.top = `${p[1]}px`;
    b.classList.toggle('selected', g.id === openId);
    b.classList.remove('is-out');
    const html = pinFor(g);
    if (b.innerHTML !== html) b.innerHTML = html;
    b.setAttribute('aria-label', `${g.name}, ${RARITY[rarityOf(g)].label}`);
  }
  for (const b of [...pins.querySelectorAll('.pin')]) {
    if (keep.has(b.dataset.id)) continue;
    if (animate && !b.classList.contains('is-out')) {
      b.classList.add('is-out');
      b.classList.remove('is-enter');
      const gone = b;
      setTimeout(() => { if (gone.isConnected && gone.classList.contains('is-out')) gone.remove(); }, 480);
    } else if (!animate) b.remove();
  }
}

function sampleFor(id) {
  if (id === 'liked') return { tags: ['culture'], liked: true, mine: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
  if (id === 'wishlist') return { tags: ['nature'], liked: false, mine: true, private: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
  return { tags: [id], liked: false, mine: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
}

function paintBar() {
  const bar = $('mapBar');
  const legend = $('legend');
  bar.classList.toggle('is-off', !filterOn);
  $('filterBtn').setAttribute('aria-pressed', String(filterOn));
  const stop = STOPS.find((s) => s.id === stopId);
  const ico = filterOn ? pinFor(sampleFor(stopId)) : pinFor(sampleFor('wishlist'));
  const title = filterOn ? stop.label : 'Gems nearby';
  const note = filterOn ? `<p class="legend-note">${EXPLAIN[stopId]}</p>` : '';
  const prev = legend.querySelector('.legend-title');
  const changed = !prev || prev.textContent !== title;
  legend.innerHTML = `<span class="legend-ico">${ico}</span><div class="legend-copy"><p class="legend-title">${title}</p>${note}</div>`;
  if (changed) {
    legend.classList.remove('is-swap');
    void legend.offsetWidth;
    legend.classList.add('is-swap');
  }
  for (const b of $('roller').querySelectorAll('button')) {
    b.setAttribute('aria-selected', String(b.dataset.stop === stopId));
  }
}

function centerStop(id, smooth) {
  const b = $('roller').querySelector(`[data-stop="${id}"]`);
  if (!b) return;
  lockScroll = true;
  const left = b.offsetLeft - $('roller').clientWidth / 2 + b.offsetWidth / 2;
  $('roller').scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
  setTimeout(() => { lockScroll = false; }, smooth ? 480 : 40);
}

function pickStop(id) {
  stopId = id;
  paintBar();
  if (openId != null && !shown(GEMS[openId])) {
    openId = null;
    $('slide').hidden = true;
  }
  drawPins(true);
}

function buildRoller() {
  const roller = $('roller');
  for (const stop of STOPS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.stop = stop.id;
    b.setAttribute('role', 'option');
    b.setAttribute('aria-label', stop.label);
    b.innerHTML = pinFor(sampleFor(stop.id));
    b.addEventListener('click', () => {
      pickStop(stop.id);
      centerStop(stop.id, true);
    });
    roller.append(b);
  }
  let tick = 0;
  roller.addEventListener('scroll', () => {
    if (lockScroll || !filterOn) return;
    cancelAnimationFrame(tick);
    tick = requestAnimationFrame(() => {
      const mid = roller.getBoundingClientRect().left + roller.clientWidth / 2;
      let best = null;
      let dist = Infinity;
      for (const b of roller.querySelectorAll('button')) {
        const rct = b.getBoundingClientRect();
        const d = Math.abs(rct.left + rct.width / 2 - mid);
        if (d < dist) { dist = d; best = b; }
      }
      if (best && best.dataset.stop !== stopId) pickStop(best.dataset.stop);
    });
  });
}

function cornerHtml(g) {
  const tpl = window.LOCATION_GEMS_CORNER_RIBBON;
  if (!tpl) return '';
  const fill = colourOf(g);
  const uid = `v2-${g.id}`;
  const ribbon = tpl.split('{{GEM}}').join(fill).replace(/paint0_linear_0_4/g, `paint0_${uid}`).replace(/paint1_linear_0_4/g, `paint1_${uid}`);
  return `<div class="gem-card-corner" style="--gem-line:${fill}"><div class="gem-card-corner-art" aria-hidden="true">${ribbon}</div><div class="gem-card-corner-stack"><span class="gem-card-gem">${pinFor(g)}</span></div></div>`;
}

function paintSlide() {
  const g = GEMS[openId];
  if (!g) return;
  const slide = $('slide');
  slide.classList.toggle('is-image', sheet === 'image');
  slide.classList.toggle('is-corner', sheet === 'corner');
  slide.classList.toggle('is-prompt', sheet === 'prompt');
  const photo = $('slidePhoto');
  photo.hidden = sheet === 'prompt';
  photo.style.backgroundImage = sheet === 'prompt' ? '' : `url("${g.photo}")`;
  photo.innerHTML = sheet === 'corner' ? cornerHtml(g) : '';
  $('slideUser').textContent = g.mine ? '' : `@${g.owner.toLowerCase()}`;
  $('slideName').textContent = g.name;
  $('slideLine').textContent = g.mine ? COPY.yours : COPY.by(g.owner);
  const like = $('likeBtn');
  like.classList.toggle('is-liked', g.liked);
  $('likeHeart').textContent = g.liked ? '♥' : '♡';
  $('likeCount').textContent = String(g.likes);
  const save = $('saveBtn');
  const on = saved.has(g.id);
  save.setAttribute('aria-pressed', String(on));
  save.textContent = on ? '[saved for later]' : '[save for later]';
}

function openGem(g) {
  openId = g.id;
  $('slide').hidden = false;
  paintSlide();
  drawPins();
}
function closeSlide() {
  openId = null;
  $('slide').hidden = true;
  drawPins();
}

function setSheet(next) {
  sheet = next;
  const url = new URL(location.href);
  url.searchParams.set('sheet', next);
  history.replaceState(null, '', url);
  for (const b of $('sheetSwitch').querySelectorAll('button')) {
    b.setAttribute('aria-pressed', String(b.dataset.sheet === sheet));
  }
  if (openId != null) paintSlide();
}

function toast(text) {
  const n = $('toast');
  n.hidden = false;
  n.textContent = text;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { n.hidden = true; }, TOAST_MS);
}

$('filterBtn').addEventListener('click', () => {
  filterOn = !filterOn;
  paintBar();
  if (openId != null && !shown(GEMS[openId])) {
    openId = null;
    $('slide').hidden = true;
  }
  drawPins(true);
  if (filterOn) requestAnimationFrame(() => centerStop(stopId, false));
});
$('likeBtn').addEventListener('click', () => {
  const g = GEMS[openId];
  if (!g) return;
  g.liked = !g.liked;
  g.likes = Math.max(0, g.likes + (g.liked ? 1 : -1));
  paintSlide();
  paintBar();
  drawPins(filterOn && stopId === 'liked');
});
$('saveBtn').addEventListener('click', () => {
  if (openId == null) return;
  if (saved.has(openId)) saved.delete(openId);
  else saved.add(openId);
  paintSlide();
  if (filterOn && stopId === 'wishlist') drawPins(true);
});
$('navBtn').addEventListener('click', () => toast('[would open navigate]'));
$('screen').addEventListener('click', () => {
  if (panMoved) { panMoved = false; return; }
  if (openId != null) closeSlide();
});
for (const b of $('sheetSwitch').querySelectorAll('button')) {
  b.addEventListener('click', () => setSheet(b.dataset.sheet));
}
window.addEventListener('message', (e) => {
  const data = e.data || {};
  if (data.type === 'gem-pins-sheet' && SHEETS.includes(data.sheet)) setSheet(data.sheet);
  if (data.type === 'gem-pins-look' && data.vars) {
    for (const [key, value] of Object.entries(data.vars)) document.documentElement.style.setProperty(key, value);
  }
});

let panMoved = false;
let dragging = false;
let last = null;
$('screen').addEventListener('pointerdown', (e) => {
  if (e.target.closest('.pin')) return;
  dragging = true;
  panMoved = false;
  last = [e.clientX, e.clientY];
  $('screen').setPointerCapture(e.pointerId);
});
$('screen').addEventListener('pointermove', (e) => {
  if (!dragging || !last) return;
  const dx = e.clientX - last[0];
  const dy = e.clientY - last[1];
  if (Math.hypot(dx, dy) > 4) panMoved = true;
  view.x += dx;
  view.y += dy;
  last = [e.clientX, e.clientY];
  drawPins();
});
$('screen').addEventListener('pointerup', () => { dragging = false; last = null; });
$('phone').addEventListener('wheel', (e) => {
  e.preventDefault();
  const z0 = view.z;
  view.z *= e.deltaY < 0 ? 1.12 : 0.9;
  view.x *= view.z / z0;
  view.y *= view.z / z0;
  drawPins();
}, { passive: false });

buildRoller();
setSheet(sheet);
paintBar();
drawPins();
window.addEventListener('resize', drawPins);
