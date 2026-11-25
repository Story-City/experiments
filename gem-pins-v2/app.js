/* GEM-PINS-V2-v26 — Disc: ridiculous glow bloom + extreme tight hug + size falloff. */
if (new URLSearchParams(location.search).get('embed') === '1') document.body.classList.add('is-embed');
import { CATS, COPY, LOVE, NAMES, OWNERS, PHOTOS, RARITY } from '../gem-pins/data.js';
import { pinSvg } from '../gem-pins/gems.js';
import { ART } from '../gem-pins/gem-art.js';

const $ = (id) => document.getElementById(id);
const DENSITY = 40;
/** V1 rarityBy none — every pin the same size; keep uploaded category gems */
const PIN_SIZE = 28;
const SHEETS = ['original', 'prompt', 'image', 'bar'];
/* Extreme: packed gems, huge selected, tiny sides, fat glowing tinted U */
const DISC_SPAN_X = 108;
const DISC_EAR_Y = 34;
const DISC_DIP = 46;
const DISC_STEP = 5;
const DISC_PX_PER_DEG = 4.2;
const DISC_SCALE_MIN = 0.28;
const DISC_SCALE_MAX = 1.65;
const DISC_FADE_DEG = 26;
const DISC_ANIM_MS = 520;
const PUBLIC_GEM_FILL = '#00c2ff';
const GEM_OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE = 'M9 7.5H15L12 20.5Z';
const GEM_FACETS = 'M9 7.5L12 20.5L15 7.5M1.5 7.5H22.5';
const GEM_STROKE = 1.5;
const GEM_FACET_STROKE = 1;
const HEART_PATH =
  'M15.0007 10.0002C16.2423 8.7835 17.5007 7.32516 17.5007 5.41683C17.5007 4.20125 17.0178 3.03547 16.1582 2.17592C15.2987 1.31638 14.1329 0.833496 12.9173 0.833496C11.4507 0.833496 10.4173 1.25016 9.16732 2.50016C7.91732 1.25016 6.88398 0.833496 5.41732 0.833496C4.20174 0.833496 3.03595 1.31638 2.17641 2.17592C1.31687 3.03547 0.833984 4.20125 0.833984 5.41683C0.833984 7.3335 2.08398 8.79183 3.33398 10.0002L9.16732 15.8335L15.0007 10.0002Z';
const LIKE_PINK_HOT = '#ff7aab';
/** Feather bookmark — wishlist / save-for-later mark */
const BOOKMARK_PATH = 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z';
const ICON = {
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.3-9.2C1.6 7.8 3.5 4.5 6.8 4.5c2 0 3.4 1.1 4.2 2.4h2c.8-1.3 2.2-2.4 4.2-2.4 3.3 0 5.2 3.3 4.1 6.3C19.5 15.4 12 20 12 20z"/></svg>',
  hide: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.6"/><path d="M4 20 20 4"/></svg>',
  bookmark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${BOOKMARK_PATH}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M7.8 12.4l2.8 2.8 5.6-5.8"/></svg>',
};
const TOAST_MS = 1600;
const GEM_SRC = {
  nature: 'assets/gems/nature.svg',
  eat: 'assets/gems/eat-drink.svg',
  shop: 'assets/gems/eat-drink.svg',
  culture: 'assets/gems/art.svg',
  play: 'assets/gems/play.svg',
  landmark: 'assets/gems/landmarks.svg',
  curio: 'assets/gems/curiosities.svg',
};
const GEM_COLOUR = {
  nature: '#00CD9D',
  eat: '#FF4F79',
  shop: '#FF7696',
  culture: '#41C7D8',
  play: '#F7C85C',
  landmark: '#F1A638',
  curio: '#B36BFF',
  mine: '#cdd6ea',
};
/** Filter cats — eat + shop combined into one stop */
const FILTER_CATS = [
  { id: 'nature', label: 'Nature', match: ['nature'], art: 'nature' },
  { id: 'eatshop', label: 'Eat & Drink', match: ['eat', 'shop'], art: 'eat' },
  { id: 'culture', label: 'Culture', match: ['culture'], art: 'culture' },
  { id: 'play', label: 'Play', match: ['play'], art: 'play' },
  { id: 'landmark', label: 'Landmarks', match: ['landmark'], art: 'landmark' },
  { id: 'curio', label: 'Curiosities', match: ['curio'], art: 'curio' },
];
const FILTER_LAYOUTS = ['always', 'classic', 'inline', 'disc'];
const EXPLAIN_DEFAULT = {
  all: '[every gem nearby]',
  nature: '[explain nature finds]',
  eatshop: '[explain eat, drink and shop finds]',
  culture: '[explain culture finds]',
  play: '[explain play finds]',
  landmark: '[explain landmark finds]',
  curio: '[explain curiosity finds]',
  liked: '[explain liked gems]',
  wishlist: '[explain saved for later]',
};
const SPOOF_LABELS = {
  nearby: 'Gems nearby',
  navigate: 'Navigate',
  save: 'Save for later',
  saved: 'Saved for later',
  liked: 'Liked',
  wishlist: 'Wishlist',
  all: 'All gems',
  explain: {
    all: 'Every gem nearby',
    nature: 'Nature finds',
    eatshop: 'Eat, drink and shop finds',
    culture: 'Culture finds',
    play: 'Play finds',
    landmark: 'Landmark finds',
    curio: 'Curiosity finds',
    liked: 'Gems you hearted',
    wishlist: 'Saved for later',
  },
};
const wording = {
  nearby: 'Gems nearby',
  navigate: '[navigate]',
  save: '[save for later]',
  saved: '[saved for later]',
  liked: 'Liked',
  wishlist: 'Wishlist',
  all: 'All gems',
  explain: { ...EXPLAIN_DEFAULT },
};

function gemSvg(fill) {
  return `<svg class="pin-gem" viewBox="0 0 24 22" aria-hidden="true">
    <path d="${GEM_OUTLINE}" fill="${fill}"/>
    <path d="${GEM_TABLE}" fill="#fff" fill-opacity="0.3"/>
    <path d="${GEM_SHADE}" fill="#000" fill-opacity="0.22"/>
    <path d="${GEM_FACETS}" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="${GEM_FACET_STROKE}" stroke-linejoin="round"/>
    <path d="${GEM_OUTLINE}" fill="none" stroke="#fff" stroke-width="${GEM_STROKE}" stroke-linejoin="round"/>
  </svg>`;
}

function heartMark() {
  return `<svg class="pin-gem is-heart" viewBox="0 0 19 17" aria-hidden="true">
    <path d="${HEART_PATH}" fill="${LIKE_PINK_HOT}"/>
    <path d="${HEART_PATH}" fill="none" stroke="#fff" stroke-width="${GEM_STROKE}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function bookmarkMark() {
  return `<svg class="pin-gem is-bookmark" viewBox="0 0 24 24" aria-hidden="true">
    <path d="${BOOKMARK_PATH}" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function stops() {
  return [
    { id: 'all', label: labelOf('all') },
    ...FILTER_CATS.map((c) => ({ id: c.id, label: c.label, match: c.match, art: c.art })),
    { id: 'liked', label: labelOf('liked') },
    { id: 'wishlist', label: labelOf('wishlist') },
  ];
}

function filterCat(id) {
  return FILTER_CATS.find((c) => c.id === id);
}

function labelOf(key) {
  if (spoofWording && SPOOF_LABELS[key]) return SPOOF_LABELS[key];
  if (key === 'liked') return wording.liked;
  if (key === 'wishlist') return wording.wishlist;
  if (key === 'all') return wording.all;
  return wording[key] || key;
}

function explainOf(id) {
  if (spoofWording && SPOOF_LABELS.explain[id]) return SPOOF_LABELS.explain[id];
  return wording.explain[id] || '';
}

function displayCopy(text) {
  if (text == null) return '';
  const s = String(text);
  if (!spoofWording) return s;
  if (/^\[.*\]$/.test(s.trim())) return s.replace(/^\[/, '').replace(/\]$/, '');
  return s;
}

function btnCopy(key) {
  if (spoofWording && SPOOF_LABELS[key]) return SPOOF_LABELS[key];
  return wording[key];
}

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
    hidden: false,
  };
});
GEMS.forEach((g) => { if (g.rarity === 'rare' && g.id % 2) g.rarity = 'epic'; });

const levels = ['common', 'rare', 'mythical'];
function rarityOf(g) {
  if (levels.includes(g.rarity)) return g.rarity;
  return g.rarity === 'mythical' ? 'mythical' : 'rare';
}
function sizeOf() {
  return PIN_SIZE;
}
function glowOf() {
  return null;
}
function colourOf(g) {
  if (g.seasonal) return '#9fe3ff';
  if (g.mine) return GEM_COLOUR.mine;
  return GEM_COLOUR[g.tags[0]] || GEM_COLOUR.nature;
}
function categoryMark(tagId, size) {
  const src = GEM_SRC[tagId] || GEM_SRC.nature;
  const s = size || 28;
  return `<img class="cat-gem-art" src="${src}" width="${s}" height="${s}" alt="" decoding="async">`;
}

function pinFor(g) {
  const size = sizeOf(g);
  const glow = glowOf(g);
  const glowClass = glow ? ` glow-${glow}` : '';
  if (g.roller === 'all') {
    return `<span class="pin-gem-wrap" style="width:${size}px;height:${size}px">${gemSvg(PUBLIC_GEM_FILL)}</span>`;
  }
  if (g.roller === 'liked') {
    return `<span class="pin-gem-wrap${glowClass}" style="width:${size}px;height:${size}px">${heartMark()}</span>`;
  }
  if (g.roller === 'wishlist') {
    return `<span class="pin-gem-wrap" style="width:${size}px;height:${size}px">${bookmarkMark()}</span>`;
  }
  if (g.mine || g.seasonal) {
    const hollow = g.mine && g.private;
    const markup = g.seasonal ? null : ART[hollow ? 'hollow' : 'victoria'].mine;
    return pinSvg({
      art: markup,
      shape: g.seasonal ? 'winter' : 'classic',
      size,
      fill: colourOf(g),
      heart: false,
      loveColour: LOVE,
      glow,
      clock: !!g.expiring,
    });
  }
  return categoryMark(g.tags[0], size).replace('cat-gem-art', `pin-gem${glowClass}`);
}

const saved = new Set();
let spoofWording = false;
let filterLayout = 'always';
let filterOn = true;
let stopId = 'all';
let openId = null;
let sheetFull = false;
let sheet = SHEETS.includes(new URLSearchParams(location.search).get('sheet'))
  ? new URLSearchParams(location.search).get('sheet')
  : 'prompt';
let toastTimer = 0;
let lockScroll = false;
let discAngle = 0;
let discAnim = 0;
let discDragAngle = null;

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

function layoutNeedsToggle() {
  return filterLayout === 'classic';
}

function stopDisc(id) {
  if (id === 'all') return PUBLIC_GEM_FILL;
  if (id === 'liked') return LIKE_PINK_HOT;
  if (id === 'wishlist') return '#e8e4ff';
  const cat = filterCat(id);
  if (cat) return GEM_COLOUR[cat.art] || GEM_COLOUR[cat.match[0]] || PUBLIC_GEM_FILL;
  return GEM_COLOUR[id] || PUBLIC_GEM_FILL;
}

function shown(g) {
  if (g.hidden) return false;
  if (!filterOn || stopId === 'all') return true;
  if (stopId === 'liked') return g.liked;
  if (stopId === 'wishlist') return saved.has(g.id);
  const cat = filterCat(stopId);
  if (cat) return g.tags.some((t) => cat.match.includes(t));
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
    const size = sizeOf(g);
    b.style.left = `${p[0]}px`;
    b.style.top = `${p[1]}px`;
    b.style.width = `${size}px`;
    b.style.height = `${size}px`;
    b.style.marginLeft = `${-size / 2}px`;
    b.style.marginTop = `${-size / 2}px`;
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
  if (id === 'all') return { tags: ['nature'], roller: 'all', liked: false, mine: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
  if (id === 'liked') return { tags: ['culture'], roller: 'liked', liked: true, mine: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
  if (id === 'wishlist') return { tags: ['nature'], roller: 'wishlist', liked: false, mine: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
  const cat = filterCat(id);
  if (cat) return { tags: [cat.art], liked: false, mine: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
  return { tags: [id], liked: false, mine: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
}

function setFilterLayout(next) {
  if (!FILTER_LAYOUTS.includes(next)) return;
  filterLayout = next;
  $('phone').dataset.filterLayout = filterLayout;
  /* Every layout opens on all gems */
  filterOn = true;
  stopId = 'all';
  discAngle = 0;
  cancelAnimationFrame(discAnim);
  discAnim = 0;
  discDragAngle = null;
  paintBar();
  if (openId != null && !shown(GEMS[openId])) {
    openId = null;
    sheetFull = false;
    $('slide').hidden = true;
  }
  drawPins(true);
  requestAnimationFrame(() => centerStop(stopId, false));
  for (const b of document.querySelectorAll('[data-filter-layout]')) {
    b.setAttribute('aria-pressed', String(b.dataset.filterLayout === filterLayout));
  }
}

function paintBar() {
  const bar = $('mapBar');
  const legend = $('legend');
  const nearby = $('nearbyTitle');
  const nearbyRow = $('nearbyRow');
  const showToggle = layoutNeedsToggle();
  const rollerVisible = filterOn || !showToggle;
  bar.classList.toggle('is-off', !filterOn);
  $('filterGbox').classList.toggle('is-filter-on', filterOn);
  $('filterGbox').classList.toggle('is-layout-always', filterLayout === 'always');
  $('filterGbox').classList.toggle('is-layout-classic', filterLayout === 'classic');
  $('filterGbox').classList.toggle('is-layout-inline', filterLayout === 'inline');
  $('filterGbox').classList.toggle('is-layout-disc', filterLayout === 'disc');
  $('filterBtn').hidden = !showToggle;
  $('filterBtn').setAttribute('aria-pressed', String(filterOn));
  const resetBtn = $('filterReset');
  if (resetBtn) {
    resetBtn.hidden = filterLayout !== 'disc';
    resetBtn.disabled = stopId === 'all';
  }
  nearby.textContent = displayCopy(btnCopy('nearby'));
  nearbyRow.hidden = filterOn || !showToggle;
  $('nearbyIco').innerHTML = gemSvg(PUBLIC_GEM_FILL);
  const isDisc = filterLayout === 'disc';
  $('rollerWrap').hidden = !rollerVisible || isDisc;
  const discStage = $('discStage');
  if (discStage) discStage.hidden = !isDisc;
  /* Disc: no separate legend — title sits under the selected gem on the arc */
  const showLegend = !isDisc && (filterOn || filterLayout === 'inline' || filterLayout === 'always');
  legend.hidden = !showLegend;
  const list = stops();
  const stop = list.find((x) => x.id === stopId) || list[0];
  if (showLegend) {
    const ico = pinFor(sampleFor(stopId));
    const title = stop.label;
    const note = explainOf(stopId);
    const prev = legend.querySelector('.legend-title');
    const changed = !prev || prev.textContent !== title;
    legend.innerHTML = `<span class="legend-ico">${ico}</span><div class="legend-copy"><p class="legend-title">${title}</p>${note ? `<p class="legend-note">${note}</p>` : ''}</div>`;
    if (changed) {
      legend.classList.remove('is-swap');
      void legend.offsetWidth;
      legend.classList.add('is-swap');
    }
  }
  for (const b of $('roller').querySelectorAll('button')) {
    const on = b.dataset.stop === stopId;
    b.setAttribute('aria-selected', String(on));
    const lab = list.find((x) => x.id === b.dataset.stop);
    if (lab) b.setAttribute('aria-label', lab.label);
  }
  if (isDisc) paintDiscAngle(discAngle);
  $('navBtn').textContent = displayCopy(btnCopy('navigate'));
}

function centerStop(id, smooth) {
  if (filterLayout === 'disc') {
    snapDiscTo(id, !!smooth);
    return;
  }
  const b = $('roller').querySelector(`[data-stop="${id}"]`);
  if (!b) return;
  lockScroll = true;
  const left = b.offsetLeft - $('roller').clientWidth / 2 + b.offsetWidth / 2;
  $('roller').scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
  setTimeout(() => { lockScroll = false; }, smooth ? 480 : 40);
}

function discPeriod(n) {
  return (n || 1) * DISC_STEP;
}

function discAngleForIndex(index, n) {
  return -index * DISC_STEP;
}

function nearestDiscIndex(angle, n) {
  const count = n || 1;
  let idx = Math.round(-angle / DISC_STEP);
  idx %= count;
  if (idx < 0) idx += count;
  return idx;
}

function shortestDelta(from, to) {
  const period = discPeriod(stops().length);
  let d = to - from;
  d = ((d % period) + period * 1.5) % period - period / 2;
  return d;
}

function wrapDiscDeg(deg, n) {
  const period = discPeriod(n);
  return ((deg % period) + period * 1.5) % period - period / 2;
}

function paintDiscAngle(angle) {
  const wheel = $('discWheel');
  const stage = $('discStage');
  const titleEl = $('discTitle');
  const noteEl = $('discNote');
  if (!wheel) return;
  const list = stops();
  const n = list.length || 1;
  const nearest = nearestDiscIndex(angle, n);
  const buttons = [...wheel.querySelectorAll('button[data-stop]')];
  buttons.forEach((b, i) => {
    const deg = wrapDiscDeg(angle + i * DISC_STEP, n);
    const t = Math.max(-1, Math.min(1, deg / DISC_FADE_DEG));
    const x = t * DISC_SPAN_X;
    const y = DISC_EAR_Y + DISC_DIP * (1 - t * t);
    const abs = Math.abs(deg);
    const proximity = Math.max(0, 1 - abs / DISC_FADE_DEG);
    const scale = DISC_SCALE_MIN + (DISC_SCALE_MAX - DISC_SCALE_MIN) * (proximity ** 1.15);
    const on = i === nearest;
    const visible = abs <= DISC_FADE_DEG;
    b.style.left = `calc(50% + ${x}px)`;
    b.style.top = `${y}px`;
    b.style.transform = `translate(-50%, -50%) scale(${scale})`;
    b.style.opacity = visible ? String(0.22 + 0.78 * proximity) : '0';
    b.style.pointerEvents = visible ? 'auto' : 'none';
    b.style.zIndex = String(on ? 5 : 1 + Math.round(proximity * 3));
    b.setAttribute('aria-selected', String(on));
    b.classList.toggle('is-front', on);
    b.style.setProperty('--stop-disc', stopDisc(b.dataset.stop));
  });
  const front = list[nearest];
  if (front) {
    const tint = stopDisc(front.id);
    if (stage) {
      stage.style.setProperty('--disc-tint', tint);
      stage.style.color = tint;
    }
    const arc = $('discArc');
    if (arc) {
      arc.style.color = tint;
      arc.style.setProperty('--disc-tint', tint);
    }
    if (titleEl) titleEl.textContent = front.label;
    if (noteEl) noteEl.textContent = displayCopy(explainOf(front.id));
  }
}

function snapDiscTo(id, animate) {
  const list = stops();
  const n = list.length || 1;
  const idx = Math.max(0, list.findIndex((s) => s.id === id));
  const target = discAngleForIndex(idx, n);
  cancelAnimationFrame(discAnim);
  discAnim = 0;
  discDragAngle = null;
  if (!animate) {
    discAngle = target;
    paintDiscAngle(discAngle);
    return;
  }
  const from = discAngle;
  const delta = shortestDelta(from, target);
  const t0 = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - t0) / DISC_ANIM_MS);
    const eased = 1 - ((1 - t) ** 3);
    discAngle = from + delta * eased;
    paintDiscAngle(discAngle);
    if (t < 1) {
      discAnim = requestAnimationFrame(tick);
      return;
    }
    discAnim = 0;
    discAngle = wrapDiscDeg(target, n);
    paintDiscAngle(discAngle);
  };
  discAnim = requestAnimationFrame(tick);
}

function commitDiscNearest(animate) {
  const list = stops();
  const idx = nearestDiscIndex(discAngle, list.length);
  const next = list[idx];
  if (!next) return;
  if (next.id !== stopId) {
    stopId = next.id;
    if (openId != null && !shown(GEMS[openId])) {
      openId = null;
      $('slide').hidden = true;
    }
    drawPins(true);
    const resetBtn = $('filterReset');
    if (resetBtn) resetBtn.disabled = stopId === 'all';
  }
  snapDiscTo(next.id, animate);
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

function nearestStopButton() {
  const roller = $('roller');
  const mid = roller.getBoundingClientRect().left + roller.clientWidth / 2;
  let best = null;
  let dist = Infinity;
  for (const b of roller.querySelectorAll('button')) {
    const rct = b.getBoundingClientRect();
    const d = Math.abs(rct.left + rct.width / 2 - mid);
    if (d < dist) { dist = d; best = b; }
  }
  return best;
}

function fillRoller() {
  const roller = $('roller');
  roller.replaceChildren();
  for (const stop of stops()) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.stop = stop.id;
    b.setAttribute('role', 'option');
    b.setAttribute('aria-label', stop.label);
    b.innerHTML = pinFor(sampleFor(stop.id));
    roller.append(b);
  }
  fillDiscWheel();
}

function fillDiscWheel() {
  const wheel = $('discWheel');
  if (!wheel) return;
  wheel.replaceChildren();
  for (const stop of stops()) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.stop = stop.id;
    b.setAttribute('role', 'option');
    b.setAttribute('aria-label', stop.label);
    b.innerHTML = pinFor(sampleFor(stop.id));
    wheel.append(b);
  }
  discAngle = discAngleForIndex(Math.max(0, stops().findIndex((s) => s.id === stopId)), stops().length);
  paintDiscAngle(discAngle);
}

function bindDiscWheel() {
  const stage = $('discStage');
  if (!stage) return;
  let drag = null;
  stage.addEventListener('pointerdown', (e) => {
    if (filterLayout !== 'disc') return;
    cancelAnimationFrame(discAnim);
    discAnim = 0;
    const btn = e.target.closest('button[data-stop]');
    drag = {
      id: e.pointerId,
      x: e.clientX,
      startAngle: discAngle,
      moved: false,
      btn,
    };
    discDragAngle = discAngle;
    try { stage.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag || drag.id !== e.pointerId || filterLayout !== 'disc') return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) drag.moved = true;
    if (!drag.moved) return;
    discAngle = drag.startAngle - dx / DISC_PX_PER_DEG;
    discDragAngle = discAngle;
    paintDiscAngle(discAngle);
    const list = stops();
    const idx = nearestDiscIndex(discAngle, list.length);
    const next = list[idx];
    if (next && next.id !== stopId) {
      stopId = next.id;
      const resetBtn = $('filterReset');
      if (resetBtn) resetBtn.disabled = stopId === 'all';
      if (openId != null && !shown(GEMS[openId])) {
        openId = null;
        $('slide').hidden = true;
      }
      drawPins(true);
    }
  });
  const endDrag = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const { moved, btn } = drag;
    drag = null;
    discDragAngle = null;
    if (filterLayout !== 'disc') return;
    if (!moved && btn && btn.dataset.stop) {
      pickStop(btn.dataset.stop);
      snapDiscTo(btn.dataset.stop, true);
      return;
    }
    commitDiscNearest(true);
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('wheel', (e) => {
    if (filterLayout !== 'disc') return;
    e.preventDefault();
    cancelAnimationFrame(discAnim);
    discAnim = 0;
    const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
    discAngle -= delta / DISC_PX_PER_DEG;
    paintDiscAngle(discAngle);
    clearTimeout(stage._discWheelSnap);
    stage._discWheelSnap = setTimeout(() => commitDiscNearest(true), 90);
  }, { passive: false });
}

function bindRoller() {
  const roller = $('roller');
  let tick = 0;
  let drag = null;
  roller.addEventListener('scroll', () => {
    if (lockScroll || (!filterOn && layoutNeedsToggle())) return;
    cancelAnimationFrame(tick);
    tick = requestAnimationFrame(() => {
      const best = nearestStopButton();
      if (best && best.dataset.stop !== stopId) pickStop(best.dataset.stop);
    });
  });
  roller.addEventListener('pointerdown', (e) => {
    if (!filterOn && layoutNeedsToggle()) return;
    const btn = e.target.closest('button[data-stop]');
    drag = {
      id: e.pointerId,
      x: e.clientX,
      left: roller.scrollLeft,
      moved: false,
      btn,
    };
    try { roller.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  });
  roller.addEventListener('pointermove', (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 6) drag.moved = true;
    if (drag.moved) roller.scrollLeft = drag.left - dx;
  });
  const endDrag = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const { moved, btn } = drag;
    drag = null;
    if (!moved && btn && btn.dataset.stop) {
      pickStop(btn.dataset.stop);
      centerStop(btn.dataset.stop, true);
      return;
    }
    if (moved) {
      const best = nearestStopButton();
      if (best) {
        pickStop(best.dataset.stop);
        centerStop(best.dataset.stop, true);
      }
    }
  };
  roller.addEventListener('pointerup', endDrag);
  roller.addEventListener('pointercancel', endDrag);
  roller.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, true);
  roller.addEventListener('wheel', (e) => {
    if (!filterOn && layoutNeedsToggle()) return;
    e.preventDefault();
    e.stopPropagation();
    roller.scrollLeft += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
    const best = nearestStopButton();
    if (best && best.dataset.stop !== stopId) pickStop(best.dataset.stop);
  }, { passive: false });
}

function cornerRibbonHtml(fill, uid) {
  const tpl = window.LOCATION_GEMS_CORNER_RIBBON;
  if (!tpl) return '';
  const safe = String(uid || 'x').replace(/[^a-zA-Z0-9_-]/g, '');
  return tpl
    .split('{{GEM}}')
    .join(fill)
    .replace(/paint0_linear_0_4/g, `paint0_${safe}`)
    .replace(/paint1_linear_0_4/g, `paint1_${safe}`);
}

/** Same corner stack as location-gems buildGemCard — ribbon 58% + category art */
function cornerHtml(g) {
  const tagId = g.tags[0];
  const fill = GEM_COLOUR[tagId] || colourOf(g);
  const ribbon = cornerRibbonHtml(fill, `v2-${g.id}`);
  if (!ribbon) return '';
  return `<div class="gem-card-corner" style="--gem-line:${fill}"><div class="gem-card-corner-art" aria-hidden="true">${ribbon}</div><div class="gem-card-corner-stack"><span class="gem-card-gem">${categoryMark(tagId, 46)}</span></div></div>`;
}

function whoLine(g) {
  return (g.mine ? `${COPY.yours} · ${g.private ? COPY.private : COPY.public}` : COPY.by(g.owner))
    + (g.visited ? ` · ${COPY.visited}` : '');
}

function paintLike(btnId, heartId, countId, g) {
  const like = $(btnId);
  like.classList.toggle('is-liked', g.liked);
  $(heartId).textContent = g.liked ? '♥' : '♡';
  $(countId).textContent = String(g.likes);
}

function hideGem(g) {
  g.hidden = true;
  toast(displayCopy('[would hide from map]'));
  closeSlide();
  drawPins(true);
}

function paintActs(g) {
  const box = $('slideActs');
  box.replaceChildren();
  const mk = (cls, html, label, on, fn) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cact ' + cls;
    b.innerHTML = html;
    b.setAttribute('aria-label', label);
    if (on != null) b.setAttribute('aria-pressed', String(on));
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    return b;
  };
  /* Image/Bar/Prompt: bookmark+hide live in the action row — never over the corner */
  if (sheet !== 'original') return;
  /* Melissa original keeps heart / hide / visited */
  if (g.mine) {
    box.append(mk('hide', ICON.hide, COPY.hideLong || 'Hide', null, () => hideGem(g)));
    return;
  }
  box.append(
    mk('heart', ICON.heart, g.liked ? COPY.unlikeIt || 'Unlike' : COPY.likeIt || 'Like', g.liked, () => {
      g.liked = !g.liked;
      if (g.liked) g.visited = false;
      paintSlide();
      drawPins(filterOn && stopId === 'liked');
    }),
    mk('hide', ICON.hide, COPY.hideLong || 'Hide', null, () => hideGem(g)),
    mk('check', ICON.check, g.visited ? COPY.unmarkIt || 'Unmark' : COPY.markIt || 'Mark visited', g.visited, () => {
      g.visited = !g.visited;
      if (g.visited) g.liked = false;
      paintSlide();
      drawPins();
    }),
  );
}

function paintActionIcons(g) {
  const save = $('saveBtn');
  const hide = $('hideBtn');
  const on = saved.has(g.id);
  save.innerHTML = ICON.bookmark;
  save.setAttribute('aria-pressed', String(on));
  save.setAttribute('aria-label', displayCopy(btnCopy(on ? 'saved' : 'save')));
  hide.innerHTML = ICON.hide;
  hide.setAttribute('aria-label', COPY.hideLong || 'Hide');
}

function paintTags(g) {
  const tags = $('slideTags');
  tags.replaceChildren();
  const rarity = document.createElement('span');
  rarity.className = 'tag rarity';
  rarity.textContent = RARITY[rarityOf(g)].label;
  rarity.style.setProperty('--c', rarityOf(g) === 'mythical' ? '#c49bff' : rarityOf(g) === 'rare' || rarityOf(g) === 'epic' ? '#7ad7ff' : '#9fe3ff');
  tags.append(rarity);
  for (const id of g.tags) {
    const c = CATS.find((x) => x.id === id);
    if (!c) continue;
    const x = document.createElement('span');
    x.className = 'tag';
    x.textContent = c.label;
    x.style.setProperty('--c', GEM_COLOUR[id] || GEM_COLOUR.nature);
    tags.append(x);
  }
}

function paintSlide() {
  const g = GEMS[openId];
  if (!g) return;
  const slide = $('slide');
  const isOriginal = sheet === 'original';
  const isPrompt = sheet === 'prompt';
  const isImage = sheet === 'image';
  const isBar = sheet === 'bar';
  /* Image + Bar hold together: same small photo + corner; Image texts on photo, Bar texts under */
  const hasMedia = isImage || isBar || (isOriginal && sheetFull);
  slide.classList.toggle('is-original', isOriginal);
  slide.classList.toggle('is-prompt', isPrompt);
  slide.classList.toggle('is-image', isImage);
  slide.classList.toggle('is-bar', isBar);
  slide.classList.toggle('is-full', isOriginal && sheetFull);

  const media = $('slideMedia');
  media.hidden = !hasMedia;
  $('slidePhoto').style.backgroundImage = hasMedia ? `url("${g.photo}")` : '';
  const corner = $('slideCorner');
  corner.hidden = !(isImage || isBar);
  corner.innerHTML = (isImage || isBar) ? cornerHtml(g) : '';
  /* Overlay only on Image — Bar keeps text in the glass bar under the photo */
  $('slideOverlay').hidden = !isImage;

  $('slideHead').hidden = !isOriginal;
  $('slideTags').hidden = !isOriginal;
  $('slideGlass').hidden = !(isPrompt || isBar);
  $('slideMore').hidden = !(isOriginal && !sheetFull);
  $('slideStatus').hidden = !(isOriginal && sheetFull);
  /* Bookmark + hide stay in the action row (beside navigate) — never over the corner */
  $('slideActions').hidden = isOriginal ? !sheetFull : false;
  $('slideActs').hidden = !isOriginal;
  $('slideActs').classList.toggle('is-on-media', false);
  $('slideActs').classList.toggle('is-on-prompt', false);
  $('slideActs').classList.toggle('is-on-head', isOriginal);

  if (isOriginal) {
    $('slideArt').innerHTML = pinFor(g);
    $('slideNameHead').textContent = g.name;
    $('slideLineHead').textContent = whoLine(g);
    paintTags(g);
    $('slideStatus').textContent = `${COPY.likes(g.likes + (g.liked ? 1 : 0))} · ${g.mine || g.visited ? COPY.visited : COPY.notVisited}`;
  }
  paintActs(g);
  paintActionIcons(g);

  const user = g.mine ? '' : `@${String(g.owner || '').toLowerCase()}`;
  const line = g.mine ? COPY.yours : COPY.by(g.owner);
  /* Prompt = least language: name + like only */
  $('slideUser').hidden = isPrompt || !user;
  $('slideLine').hidden = isPrompt || isBar;
  $('slideUser').textContent = user;
  $('slideName').textContent = g.name;
  $('slideLine').textContent = line;
  $('slideUserOv').textContent = user;
  $('slideNameOv').textContent = g.name;
  paintLike('likeBtn', 'likeHeart', 'likeCount', g);
  paintLike('likeBtnOv', 'likeHeartOv', 'likeCountOv', g);
  $('navBtn').textContent = displayCopy(btnCopy('navigate'));
}

function setSpoofWording(on) {
  spoofWording = !!on;
  fillRoller();
  paintBar();
  if (openId != null) paintSlide();
  if (filterOn) requestAnimationFrame(() => centerStop(stopId, false));
}

function openGem(g) {
  openId = g.id;
  sheetFull = false;
  $('slide').hidden = false;
  paintSlide();
  drawPins();
}
function closeSlide() {
  openId = null;
  sheetFull = false;
  $('slide').hidden = true;
  drawPins();
}

function resetFilter() {
  filterOn = true;
  stopId = 'all';
  discAngle = 0;
  cancelAnimationFrame(discAnim);
  discAnim = 0;
  discDragAngle = null;
  paintBar();
  if (openId != null && !shown(GEMS[openId])) {
    openId = null;
    sheetFull = false;
    $('slide').hidden = true;
  }
  drawPins(true);
  requestAnimationFrame(() => centerStop(stopId, true));
}

function setSheet(next) {
  sheet = next;
  sheetFull = false;
  const url = new URL(location.href);
  url.searchParams.set('sheet', next);
  history.replaceState(null, '', url);
  for (const b of $('sheetSwitch').querySelectorAll('button')) {
    b.setAttribute('aria-pressed', String(b.dataset.sheet === sheet));
  }
  if (openId != null) paintSlide();
}

function toggleLike() {
  const g = GEMS[openId];
  if (!g) return;
  g.liked = !g.liked;
  g.likes = Math.max(0, g.likes + (g.liked ? 1 : -1));
  paintSlide();
  paintBar();
  drawPins(filterOn && stopId === 'liked');
}

function toast(text) {
  const n = $('toast');
  n.hidden = false;
  n.textContent = text;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { n.hidden = true; }, TOAST_MS);
}

$('filterBtn').addEventListener('click', () => {
  if (!layoutNeedsToggle()) return;
  filterOn = !filterOn;
  if (filterOn) stopId = 'all';
  paintBar();
  if (openId != null && !shown(GEMS[openId])) {
    openId = null;
    sheetFull = false;
    $('slide').hidden = true;
  }
  drawPins(true);
  if (filterOn) requestAnimationFrame(() => centerStop(stopId, true));
});
$('filterReset').addEventListener('click', () => {
  if (filterLayout !== 'disc') return;
  resetFilter();
});
for (const b of document.querySelectorAll('#layoutSwitch [data-filter-layout]')) {
  b.addEventListener('click', () => setFilterLayout(b.dataset.filterLayout));
}
$('likeBtn').addEventListener('click', (e) => { e.stopPropagation(); toggleLike(); });
$('likeBtnOv').addEventListener('click', (e) => { e.stopPropagation(); toggleLike(); });
$('saveBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  if (openId == null) return;
  if (saved.has(openId)) saved.delete(openId);
  else saved.add(openId);
  paintSlide();
  if (filterOn && stopId === 'wishlist') drawPins(true);
});
$('hideBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  if (openId == null) return;
  hideGem(GEMS[openId]);
});
$('navBtn').addEventListener('click', (e) => { e.stopPropagation(); toast(displayCopy('[would open navigate]')); });
document.querySelector('.map-top').addEventListener('pointerdown', (e) => e.stopPropagation());
$('slide').addEventListener('click', (e) => {
  if (sheet !== 'original' || sheetFull || e.target.closest('button')) return;
  sheetFull = true;
  paintSlide();
});
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
  if (data.type === 'gem-pins-reset-filter') resetFilter();
  if (data.type === 'gem-pins-spoof') setSpoofWording(!!data.spoof);
  if (data.type === 'gem-pins-filter-layout') setFilterLayout(data.layout);
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

$('phone').dataset.filterLayout = filterLayout;
fillRoller();
bindRoller();
bindDiscWheel();
setSheet(sheet);
setFilterLayout(filterLayout);
drawPins();
window.addEventListener('resize', drawPins);
$('tabBar').addEventListener('click', (e) => {
  const tab = e.target.closest('[data-tab]');
  if (!tab) return;
  for (const b of $('tabBar').querySelectorAll('[data-tab]')) {
    const on = b === tab;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  }
});
