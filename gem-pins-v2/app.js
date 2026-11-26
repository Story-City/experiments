/* GEM-PINS-V2-v36 — Category ids align with location-gems (eat). */
if (new URLSearchParams(location.search).get('embed') === '1') document.body.classList.add('is-embed');
import { CATS, COPY, LOVE, NAMES, OWNERS, PHOTOS, RARITY } from '../gem-pins/data.js';
import { pinSvg } from '../gem-pins/gems.js';
import { ART } from '../gem-pins/gem-art.js';

const $ = (id) => document.getElementById(id);
const DENSITY = 40;
/** V1 rarityBy none — every pin the same size; keep uploaded category gems */
const PIN_SIZE = 28;
const SHEETS = ['original', 'prompt', 'image', 'bar'];
/*
 * Lessons: gems must sample the same Q path as the SVG (not a free parabola);
 * unselected scale stays readable; fade = 2×step → 5 gems max.
 */
const DISC_PATH = { x0: 68, y0: 36, cx: 200, cy: 112, x1: 332, y1: 36 };
const DISC_VB_W = 400;
const DISC_VB_H = 100;
const DISC_STAGE_H = 104;
const DISC_STEP = 18;
const DISC_PX_PER_DEG = 2.6;
const DISC_SCALE_MIN = 0.82;
const DISC_SCALE_MAX = 1.12;
const DISC_FADE_DEG = 36;
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
  { id: 'eat', label: 'Eat & Drink', match: ['eat', 'shop'], art: 'eat' },
  { id: 'culture', label: 'Culture', match: ['culture'], art: 'culture' },
  { id: 'play', label: 'Play', match: ['play'], art: 'play' },
  { id: 'landmark', label: 'Landmarks', match: ['landmark'], art: 'landmark' },
  { id: 'curio', label: 'Curiosities', match: ['curio'], art: 'curio' },
];
const FILTER_LAYOUTS = ['always', 'classic', 'inline', 'disc', 'corner'];
const EXPLAIN_DEFAULT = {
  all: '[every gem nearby]',
  nature: '[explain nature finds]',
  eat: '[explain eat, drink and shop finds]',
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
    eat: 'Eat, drink and shop finds',
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
    <path d="${BOOKMARK_PATH}" fill="#e8e4ff" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
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
/* Keep hidden (private mine). Drop seasonal stars + public uncategorized mine pins. */
const SPECIAL = [
  { mine: true, private: true }, { liked: true }, { mythical: true },
  { mine: true, private: true }, { liked: true }, { liked: true },
  { expiring: '2h', left: '2 hours', from: 'Whimsy Walk' },
  { expiring: '1d', left: '1 day', from: 'challenge' },
];
const order = PTS.map((p, i) => i).sort((a, b) => {
  const d = ([x, y]) => Math.hypot(x - 195, (y - 330) * 0.8);
  return d(PTS[a]) - d(PTS[b]);
});
const centre = order.filter((i, j) => j % 4 === 0).slice(0, SPECIAL.length);
const rest = PTS.map((p, i) => i).filter((i) => !centre.includes(i));
const rv = rng(777);
const FIRST10 = ['eat', 'nature', 'shop', 'culture', 'shop', 'landmark', 'play', 'curio', 'eat', 'nature'];
/* Same enticing lines + minutes pattern as location-gems feed prompt chips */
const PROMPT_LINES = [
  'Paw print in the sidewalk concrete near the ravine.',
  'Bird-shaped cloud above Victoria Trail.',
  'Fox silhouette in the ivy on the mailbox.',
  'Chalk hopscotch still fresh on the alley asphalt.',
  'Tiny door tucked behind the lilac bush.',
  'Ghost sign half-hiding under the new paint.',
];
const PROMPT_MINUTES = [2, 4, 6, 1, 3, 5, 8, 7, 9, 11, 10, 12];
const GEMS = [...centre, ...rest].map((pi, i) => {
  const sp = SPECIAL[i] || {};
  const tags = [i < 10 ? FIRST10[i] : pickOne(CATS).id];
  const extra = r();
  if (extra > 0.45) tags.push(pickOne(CATS.filter((c) => !tags.includes(c.id))).id);
  if (extra > 0.85) tags.push(pickOne(CATS.filter((c) => !tags.includes(c.id))).id);
  const name = pickOne(NAMES[tags[0]]);
  const caption = PROMPT_LINES[i % PROMPT_LINES.length];
  return {
    id: i,
    at: [PTS[pi][0] / 390, PTS[pi][1] / 640],
    name,
    title: name,
    tagline: caption,
    caption,
    minutesAway: PROMPT_MINUTES[i % PROMPT_MINUTES.length],
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
  $('filterGbox').classList.toggle('is-layout-corner', filterLayout === 'corner');
  $('filterBtn').hidden = !showToggle;
  $('filterBtn').setAttribute('aria-pressed', String(filterOn));
  nearby.textContent = displayCopy(btnCopy('nearby'));
  nearbyRow.hidden = filterOn || !showToggle;
  $('nearbyIco').innerHTML = gemSvg(PUBLIC_GEM_FILL);
  const isDisc = filterLayout === 'disc';
  const isCorner = filterLayout === 'corner';
  $('rollerWrap').hidden = !rollerVisible || isDisc || isCorner;
  const discStage = $('discStage');
  if (discStage) discStage.hidden = !isDisc;
  const cornerStage = $('cornerStage');
  if (cornerStage) cornerStage.hidden = !isCorner;
  /* Disc: no separate legend — title sits under the selected gem on the arc */
  const showLegend = !isDisc && !isCorner && (filterOn || filterLayout === 'inline' || filterLayout === 'always');
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
  if (isCorner) paintCorner();
  $('navBtn').textContent = displayCopy(btnCopy('navigate'));
}

function centerStop(id, smooth) {
  if (filterLayout === 'disc') {
    snapDiscTo(id, !!smooth);
    return;
  }
  if (filterLayout === 'corner') {
    paintCorner();
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

/** Same quadratic as SVG `M 68 36 Q 200 112 332 36`; t −1…1 = ears → centre → ears. */
function discPointOnArc(t) {
  const u = (t + 1) / 2;
  const omu = 1 - u;
  const a = omu * omu;
  const b = 2 * omu * u;
  const c = u * u;
  const xSvg = a * DISC_PATH.x0 + b * DISC_PATH.cx + c * DISC_PATH.x1;
  const ySvg = a * DISC_PATH.y0 + b * DISC_PATH.cy + c * DISC_PATH.y1;
  return {
    leftPct: (xSvg / DISC_VB_W) * 100,
    topPx: (ySvg / DISC_VB_H) * DISC_STAGE_H,
  };
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
    const { leftPct, topPx } = discPointOnArc(t);
    const abs = Math.abs(deg);
    const stepsOut = Math.round(abs / DISC_STEP);
    const proximity = Math.max(0, 1 - abs / DISC_FADE_DEG);
    const scale = DISC_SCALE_MIN + (DISC_SCALE_MAX - DISC_SCALE_MIN) * proximity;
    const on = i === nearest;
    const visible = stepsOut <= 2;
    b.style.left = `${leftPct}%`;
    b.style.top = `${topPx}px`;
    b.style.transform = `translate(-50%, -50%) scale(${scale})`;
    b.style.opacity = visible ? String(0.45 + 0.55 * proximity) : '0';
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
  fillCornerWheel();
}

function fillCornerWheel() {
  const wheel = $('cornerWheel');
  if (!wheel) return;
  wheel.replaceChildren();
  for (const stop of stops()) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.stop = stop.id;
    b.setAttribute('role', 'option');
    b.setAttribute('aria-label', stop.label);
    b.innerHTML = pinFor(sampleFor(stop.id));
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      pickStop(stop.id);
    });
    wheel.append(b);
  }
  paintCorner();
}

function paintCorner() {
  const stage = $('cornerStage');
  const wheel = $('cornerWheel');
  const title = $('cornerTitle');
  if (!stage || !wheel) return;
  const list = stops();
  const stop = list.find((x) => x.id === stopId) || list[0];
  if (title) title.textContent = stop ? stop.label : '';
  const note = $('cornerNote');
  if (note) {
    const text = stop ? explainOf(stop.id) : '';
    note.textContent = text;
    note.hidden = !text;
  }
  for (const b of wheel.querySelectorAll('button')) {
    const on = b.dataset.stop === stopId;
    b.setAttribute('aria-selected', String(on));
    b.classList.toggle('is-on', on);
  }
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

/** Exact location-gems feedCornerHtml for prompt card */
function feedPromptCornerHtml(g) {
  const tagId = g.tags[0];
  const fill = GEM_COLOUR[tagId] || colourOf(g);
  const ribbon = cornerRibbonHtml(fill, `feed-${g.id}`);
  if (!ribbon) return '';
  return `
    <div class="feed-chip-corner-art">${ribbon}</div>
    <div class="feed-chip-corner-stack">
      <span class="feed-chip-corner-gem">${categoryMark(tagId, 38)}</span>
    </div>`;
}

function promptDist(g) {
  const minutes = Number(g.minutesAway);
  if (Number.isFinite(minutes) && minutes >= 0) return `${minutes} min away`;
  return spoofWording ? 'Nearby' : '[nearby]';
}

function promptLineOf(g) {
  return displayCopy(g.caption || g.tagline || g.title || g.name || '');
}

function nearbyPromptGems(g) {
  const list = GEMS.slice(0, DENSITY).filter(shown);
  return list
    .sort((a, b) => {
      const da = Math.hypot(a.at[0] - g.at[0], (a.at[1] - g.at[1]) * 1.6);
      const db = Math.hypot(b.at[0] - g.at[0], (b.at[1] - g.at[1]) * 1.6);
      return da - db;
    })
    .slice(0, 12);
}

/** Same markup as location-gems buildFeedChip('prompt') */
function buildPromptChip(g) {
  const fill = GEM_COLOUR[g.tags[0]] || colourOf(g);
  const rid = rarityOf(g);
  const rarity = RARITY[rid];
  const showRarity = rid !== 'common' && !!(rarity && rarity.label);
  const chip = document.createElement('article');
  chip.className = 'feed-chip is-prompt';
  chip.dataset.id = String(g.id);
  chip.style.setProperty('--gem-line', fill);
  chip.innerHTML = `
    <div class="feed-chip-prompt-panel">
      <p class="feed-chip-prompt-kicker">${promptDist(g)}</p>
      <p class="feed-chip-prompt">${promptLineOf(g)}</p>
      <div class="feed-chip-prompt-foot">
        <p class="feed-chip-rarity-word${showRarity ? ` is-${rid}` : ''}" ${showRarity ? '' : 'hidden'}>${showRarity ? rarity.label : ''}</p>
      </div>
      <div class="feed-chip-actions">
        <button type="button" class="icon-act bookmark-btn" aria-pressed="false" aria-label="${displayCopy(btnCopy('save'))}"></button>
        <button type="button" class="nav-btn is-compact">${displayCopy(btnCopy('navigate'))}</button>
      </div>
    </div>
    <div class="feed-chip-corner" aria-hidden="true">${feedPromptCornerHtml(g)}</div>`;
  const save = chip.querySelector('.bookmark-btn');
  const nav = chip.querySelector('.nav-btn');
  paintSaveButton(save, g);
  save.addEventListener('click', (e) => {
    e.stopPropagation();
    if (saved.has(g.id)) saved.delete(g.id);
    else saved.add(g.id);
    paintSaveButton(save, g);
    if (filterOn && stopId === 'wishlist') drawPins(true);
  });
  nav.addEventListener('click', (e) => {
    e.stopPropagation();
    toast(displayCopy('[would open navigate]'));
  });
  return chip;
}

let promptStripSilent = false;
let promptStripTimer = 0;

function scrollPromptStripTo(id, behavior) {
  const strip = $('slidePromptStrip');
  if (!strip) return;
  const chip = strip.querySelector(`.feed-chip[data-id="${id}"]`);
  if (!chip) return;
  promptStripSilent = true;
  chip.scrollIntoView({ inline: 'center', block: 'nearest', behavior: behavior || 'instant' });
  requestAnimationFrame(() => { promptStripSilent = false; });
}

function paintPromptStrip(centerGem) {
  const strip = $('slidePromptStrip');
  if (!strip || !centerGem) return;
  const near = nearbyPromptGems(centerGem);
  strip.replaceChildren();
  for (const g of near) strip.appendChild(buildPromptChip(g));
  requestAnimationFrame(() => scrollPromptStripTo(centerGem.id, 'instant'));
}

function syncPromptStripSelection() {
  const strip = $('slidePromptStrip');
  if (!strip || !strip.children.length) return;
  const mid = strip.scrollLeft + strip.clientWidth / 2;
  let best = null;
  let bestDist = Infinity;
  for (const chip of strip.children) {
    const center = chip.offsetLeft + chip.offsetWidth / 2;
    const d = Math.abs(center - mid);
    if (d < bestDist) {
      bestDist = d;
      best = chip;
    }
  }
  if (!best) return;
  const id = Number(best.dataset.id);
  if (id === openId) return;
  openId = id;
  drawPins();
  const g = GEMS[openId];
  if (!g) return;
  const fill = GEM_COLOUR[g.tags[0]] || colourOf(g);
  $('slide').style.setProperty('--gem-line', fill);
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
  /* Image/Bar/Prompt peek: bookmark+hide live in the action row — never over the corner */
  if (sheet !== 'original' && !(sheet === 'prompt' && sheetFull)) return;
  /* Melissa original / prompt full keeps heart / hide / visited */
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

function paintSaveButton(el, g) {
  if (!el) return;
  const on = saved.has(g.id);
  el.innerHTML = ICON.bookmark;
  el.setAttribute('aria-pressed', String(on));
  el.setAttribute('aria-label', displayCopy(btnCopy(on ? 'saved' : 'save')));
}

function paintActionIcons(g) {
  paintSaveButton($('saveBtn'), g);
  const hide = $('hideBtn');
  if (hide) {
    hide.innerHTML = ICON.hide;
    hide.setAttribute('aria-label', COPY.hideLong || 'Hide');
  }
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
  const promptPeek = isPrompt && !sheetFull;
  const promptFull = isPrompt && sheetFull;
  /* Image + Bar hold together: same small photo + corner; Image texts on photo, Bar texts under */
  const hasMedia = isImage || isBar || ((isOriginal || isPrompt) && sheetFull);
  slide.classList.toggle('is-original', isOriginal);
  slide.classList.toggle('is-prompt', isPrompt);
  slide.classList.toggle('is-image', isImage);
  slide.classList.toggle('is-bar', isBar);
  slide.classList.toggle('is-full', sheetFull && (isOriginal || isPrompt));

  const media = $('slideMedia');
  media.hidden = !hasMedia;
  $('slidePhoto').style.backgroundImage = hasMedia ? `url("${g.photo}")` : '';
  const corner = $('slideCorner');
  corner.hidden = !(isImage || isBar);
  corner.innerHTML = (isImage || isBar) ? cornerHtml(g) : '';
  /* Overlay only on Image — Bar keeps text in the glass bar under the photo */
  $('slideOverlay').hidden = !isImage;

  const promptDock = $('slidePromptDock');
  if (promptDock) promptDock.hidden = !promptPeek;
  const expandBtn = $('slideExpand');
  if (expandBtn) expandBtn.hidden = !promptPeek;
  $('slideHead').hidden = !(isOriginal || promptFull);
  $('slideTags').hidden = !(isOriginal || promptFull);
  $('slideGlass').hidden = !isBar;
  $('slideMore').hidden = !(isOriginal && !sheetFull);
  $('slideStatus').hidden = !((isOriginal || promptFull) && sheetFull);
  /* Bookmark + hide stay in the action row (beside navigate) — never over the corner */
  $('slideActions').hidden = promptPeek ? true : ((isOriginal || isPrompt) ? !sheetFull : false);
  $('hideBtn').hidden = false;
  $('slideActs').hidden = !(isOriginal || promptFull);
  $('slideActs').classList.toggle('is-on-media', false);
  $('slideActs').classList.toggle('is-on-prompt', false);
  $('slideActs').classList.toggle('is-on-head', isOriginal || promptFull);
  $('navBtn').classList.toggle('is-compact', false);

  const fill = GEM_COLOUR[g.tags[0]] || colourOf(g);
  slide.style.setProperty('--gem-line', fill);

  if (isOriginal || promptFull) {
    $('slideArt').innerHTML = pinFor(g);
    $('slideNameHead').textContent = g.name;
    $('slideLineHead').textContent = whoLine(g);
    paintTags(g);
    $('slideStatus').textContent = `${COPY.likes(g.likes + (g.liked ? 1 : 0))} · ${g.mine || g.visited ? COPY.visited : COPY.notVisited}`;
  }

  if (promptPeek) paintPromptStrip(g);
  paintActs(g);
  paintActionIcons(g);

  const user = g.mine ? '' : `@${String(g.owner || '').toLowerCase()}`;
  const line = g.mine ? COPY.yours : COPY.by(g.owner);
  $('slideUser').hidden = !user;
  $('slideLine').hidden = isBar;
  $('slideUser').textContent = user;
  $('slideName').textContent = g.name;
  $('slideLine').textContent = line;
  $('slideUserOv').textContent = user;
  $('slideNameOv').textContent = g.name;
  paintLike('likeBtn', 'likeHeart', 'likeCount', g);
  paintLike('likeBtnOv', 'likeHeartOv', 'likeCountOv', g);
  $('likeBtn').hidden = isPrompt && !sheetFull;
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
for (const b of document.querySelectorAll('#layoutSwitch [data-filter-layout]')) {
  b.addEventListener('click', () => setFilterLayout(b.dataset.filterLayout));
}
$('likeBtn').addEventListener('click', (e) => { e.stopPropagation(); toggleLike(); });
$('likeBtnOv').addEventListener('click', (e) => { e.stopPropagation(); toggleLike(); });
function toggleSave(e) {
  e.stopPropagation();
  if (openId == null) return;
  if (saved.has(openId)) saved.delete(openId);
  else saved.add(openId);
  paintSlide();
  if (filterOn && stopId === 'wishlist') drawPins(true);
}
$('saveBtn').addEventListener('click', toggleSave);
$('hideBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  if (openId == null) return;
  hideGem(GEMS[openId]);
});
function onNavigate(e) {
  e.stopPropagation();
  toast(displayCopy('[would open navigate]'));
}
$('navBtn').addEventListener('click', onNavigate);
$('slideExpand').addEventListener('click', (e) => {
  e.stopPropagation();
  if (openId == null || sheet !== 'prompt' || sheetFull) return;
  sheetFull = true;
  paintSlide();
});
const promptStripEl = $('slidePromptStrip');
if (promptStripEl) {
  promptStripEl.addEventListener('scroll', () => {
    if (promptStripSilent || sheet !== 'prompt' || sheetFull) return;
    clearTimeout(promptStripTimer);
    promptStripTimer = setTimeout(syncPromptStripSelection, 80);
  }, { passive: true });
  promptStripEl.addEventListener('pointerdown', (e) => e.stopPropagation());
}
document.querySelector('.map-top').addEventListener('pointerdown', (e) => e.stopPropagation());
$('slide').addEventListener('pointerdown', (e) => e.stopPropagation());
$('slide').addEventListener('click', (e) => {
  if (sheetFull || e.target.closest('button') || e.target.closest('.feed-chip')) return;
  if (sheet !== 'original') return;
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
  if (tab.dataset.tab === 'gems') {
    window.parent.postMessage({ type: 'gem-pins-open-gems' }, '*');
    return;
  }
  if (tab.dataset.tab === 'map') {
    for (const b of $('tabBar').querySelectorAll('[data-tab]')) {
      const on = b.dataset.tab === 'map';
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
      if (on) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    }
    return;
  }
  for (const b of $('tabBar').querySelectorAll('[data-tab]')) {
    const on = b === tab;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
    b.removeAttribute('aria-current');
  }
});
