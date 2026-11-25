/* GEM-PINS-V2-v7 — V1 sizes, legend under roller, gbox, app tab bar. */
if (new URLSearchParams(location.search).get('embed') === '1') document.body.classList.add('is-embed');
import { CATS, COPY, LOVE, NAMES, OWNERS, PHOTOS, RARITY } from '../gem-pins/data.js';
import { pinSvg } from '../gem-pins/gems.js';
import { ART } from '../gem-pins/gem-art.js';

const $ = (id) => document.getElementById(id);
const DENSITY = 40;
const SIZES = [22, 28, 34];
const SHEETS = ['original', 'prompt', 'image', 'corner'];
const ICON = {
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.3-9.2C1.6 7.8 3.5 4.5 6.8 4.5c2 0 3.4 1.1 4.2 2.4h2c.8-1.3 2.2-2.4 4.2-2.4 3.3 0 5.2 3.3 4.1 6.3C19.5 15.4 12 20 12 20z"/></svg>',
  hide: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.6"/><path d="M4 20 20 4"/></svg>',
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
const HEART_MARK = `<svg class="pin-gem is-heart" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.3-9.2C1.6 7.8 3.5 4.5 6.8 4.5c2 0 3.4 1.1 4.2 2.4h2c.8-1.3 2.2-2.4 4.2-2.4 3.3 0 5.2 3.3 4.1 6.3C19.5 15.4 12 20 12 20z" fill="${LOVE}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const EXPLAIN_DEFAULT = {
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
const wording = {
  nearby: 'Gems nearby',
  navigate: '[navigate]',
  save: '[save for later]',
  saved: '[saved for later]',
  liked: 'Liked',
  wishlist: 'Wishlist',
  explain: { ...EXPLAIN_DEFAULT },
};
function stops() {
  return [
    ...CATS.map((c) => ({ id: c.id, label: c.label })),
    { id: 'liked', label: wording.liked },
    { id: 'wishlist', label: wording.wishlist },
  ];
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
  };
});
GEMS.forEach((g) => { if (g.rarity === 'rare' && g.id % 2) g.rarity = 'epic'; });

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
function colourOf(g) {
  if (g.seasonal) return '#9fe3ff';
  if (g.mine) return GEM_COLOUR.mine;
  return GEM_COLOUR[g.tags[0]] || GEM_COLOUR.nature;
}
function pinFor(g) {
  const size = sizeOf(g);
  const glow = glowOf(g);
  const glowClass = glow ? ` glow-${glow}` : '';
  if (g.roller === 'liked') {
    return `<span class="pin-gem-wrap${glowClass}" style="width:${size}px;height:${size}px">${HEART_MARK}</span>`;
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
  const src = GEM_SRC[g.tags[0]] || GEM_SRC.nature;
  return `<img class="pin-gem${glowClass}" src="${src}" width="${size}" height="${size}" alt="" decoding="async">`;
}

const saved = new Set();
let filterOn = false;
let stopId = 'nature';
let openId = null;
let sheetFull = false;
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
  if (id === 'liked') return { tags: ['culture'], roller: 'liked', liked: true, mine: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
  if (id === 'wishlist') return { tags: ['nature'], liked: false, mine: true, private: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
  return { tags: [id], liked: false, mine: false, rarity: 'common', visited: false, seasonal: false, expiring: null };
}

function paintBar() {
  const bar = $('mapBar');
  const legend = $('legend');
  const nearby = $('nearbyTitle');
  bar.classList.toggle('is-off', !filterOn);
  $('filterGbox').classList.toggle('is-filter-on', filterOn);
  $('filterBtn').setAttribute('aria-pressed', String(filterOn));
  nearby.textContent = wording.nearby;
  nearby.hidden = filterOn;
  legend.hidden = !filterOn;
  const list = stops();
  const stop = list.find((x) => x.id === stopId) || list[0];
  if (filterOn) {
    const ico = pinFor(sampleFor(stopId));
    const title = stop.label;
    const note = wording.explain[stopId] || '';
    const prev = legend.querySelector('.legend-title');
    const changed = !prev || prev.textContent !== title;
    legend.innerHTML = `<span class="legend-ico">${ico}</span><div class="legend-copy"><p class="legend-title">${title}</p><p class="legend-note">${note}</p></div>`;
    if (changed) {
      legend.classList.remove('is-swap');
      void legend.offsetWidth;
      legend.classList.add('is-swap');
    }
  }
  for (const b of $('roller').querySelectorAll('button')) {
    b.setAttribute('aria-selected', String(b.dataset.stop === stopId));
    const lab = list.find((x) => x.id === b.dataset.stop);
    if (lab) b.setAttribute('aria-label', lab.label);
  }
  $('navBtn').textContent = wording.navigate;
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
    b.addEventListener('click', () => {
      pickStop(stop.id);
      centerStop(stop.id, true);
    });
    roller.append(b);
  }
}

function bindRoller() {
  const roller = $('roller');
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
  let drag = null;
  roller.addEventListener('pointerdown', (e) => {
    if (!filterOn) return;
    drag = { id: e.pointerId, x: e.clientX, left: roller.scrollLeft, moved: false };
    roller.setPointerCapture(e.pointerId);
  });
  roller.addEventListener('pointermove', (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 3) drag.moved = true;
    roller.scrollLeft = drag.left - dx;
  });
  const endDrag = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const moved = drag.moved;
    drag = null;
    if (moved) {
      roller.dataset.dragged = '1';
      const mid = roller.getBoundingClientRect().left + roller.clientWidth / 2;
      let best = null;
      let dist = Infinity;
      for (const b of roller.querySelectorAll('button')) {
        const rct = b.getBoundingClientRect();
        const d = Math.abs(rct.left + rct.width / 2 - mid);
        if (d < dist) { dist = d; best = b; }
      }
      if (best) {
        pickStop(best.dataset.stop);
        centerStop(best.dataset.stop, true);
      }
    }
  };
  roller.addEventListener('pointerup', endDrag);
  roller.addEventListener('pointercancel', endDrag);
  roller.addEventListener('click', (e) => {
    if (roller.dataset.dragged === '1') {
      e.preventDefault();
      e.stopPropagation();
      roller.dataset.dragged = '0';
    }
  }, true);
  roller.addEventListener('wheel', (e) => {
    if (!filterOn) return;
    e.preventDefault();
    e.stopPropagation();
    roller.scrollLeft += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
  }, { passive: false });
}

function cornerHtml(g) {
  const tpl = window.LOCATION_GEMS_CORNER_RIBBON;
  if (!tpl) return '';
  const fill = colourOf(g);
  const uid = `v2-${g.id}`;
  const ribbon = tpl.split('{{GEM}}').join(fill).replace(/paint0_linear_0_4/g, `paint0_${uid}`).replace(/paint1_linear_0_4/g, `paint1_${uid}`);
  return `<div class="gem-card-corner" style="--gem-line:${fill}"><div class="gem-card-corner-art" aria-hidden="true">${ribbon}</div><div class="gem-card-corner-stack"><span class="gem-card-gem">${pinFor(g)}</span></div></div>`;
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

function paintActs(g) {
  const box = $('slideActs');
  box.replaceChildren();
  if (g.mine) return;
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
  box.append(
    mk('heart', ICON.heart, g.liked ? COPY.unlikeIt || 'Unlike' : COPY.likeIt || 'Like', g.liked, () => {
      g.liked = !g.liked;
      if (g.liked) g.visited = false;
      paintSlide();
      drawPins(filterOn && stopId === 'liked');
    }),
    mk('hide', ICON.hide, COPY.hideLong || 'Hide', null, () => {
      toast('[would hide from map]');
      closeSlide();
    }),
    mk('check', ICON.check, g.visited ? COPY.unmarkIt || 'Unmark' : COPY.markIt || 'Mark visited', g.visited, () => {
      g.visited = !g.visited;
      if (g.visited) g.liked = false;
      paintSlide();
      drawPins();
    }),
  );
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
  const isCorner = sheet === 'corner';
  slide.classList.toggle('is-original', isOriginal);
  slide.classList.toggle('is-prompt', isPrompt);
  slide.classList.toggle('is-image', isImage);
  slide.classList.toggle('is-corner', isCorner);
  slide.classList.toggle('is-full', isOriginal && sheetFull);

  const media = $('slideMedia');
  const showMedia = isImage || isCorner || (isOriginal && sheetFull);
  media.hidden = !showMedia;
  $('slidePhoto').style.backgroundImage = showMedia ? `url("${g.photo}")` : '';
  const corner = $('slideCorner');
  corner.hidden = !isCorner;
  corner.innerHTML = isCorner ? cornerHtml(g) : '';
  $('slideOverlay').hidden = !(isImage || isCorner);

  $('slideHead').hidden = !isOriginal;
  $('slideTags').hidden = !isOriginal;
  $('slideGlass').hidden = isOriginal || isImage || isCorner;
  $('slideMore').hidden = !(isOriginal && !sheetFull);
  $('slideStatus').hidden = !(isOriginal && sheetFull);
  $('slideActions').hidden = isOriginal && !sheetFull;

  if (isOriginal) {
    $('slideArt').innerHTML = pinFor(g);
    $('slideNameHead').textContent = g.name;
    $('slideLineHead').textContent = whoLine(g);
    paintActs(g);
    paintTags(g);
    $('slideStatus').textContent = `${COPY.likes(g.likes + (g.liked ? 1 : 0))} · ${g.mine || g.visited ? COPY.visited : COPY.notVisited}`;
  }

  const user = g.mine ? '' : `@${String(g.owner || '').toLowerCase()}`;
  const line = g.mine ? COPY.yours : COPY.by(g.owner);
  $('slideUser').textContent = user;
  $('slideName').textContent = g.name;
  $('slideLine').textContent = line;
  $('slideUserOv').textContent = user;
  $('slideNameOv').textContent = g.name;
  paintLike('likeBtn', 'likeHeart', 'likeCount', g);
  paintLike('likeBtnOv', 'likeHeartOv', 'likeCountOv', g);

  const save = $('saveBtn');
  const on = saved.has(g.id);
  save.setAttribute('aria-pressed', String(on));
  save.textContent = on ? wording.saved : wording.save;
  $('navBtn').textContent = wording.navigate;
}

function applyWording(next) {
  if (!next || typeof next !== 'object') return;
  if (typeof next.nearby === 'string') wording.nearby = next.nearby;
  if (typeof next.navigate === 'string') wording.navigate = next.navigate;
  if (typeof next.save === 'string') wording.save = next.save;
  if (typeof next.saved === 'string') wording.saved = next.saved;
  if (typeof next.liked === 'string') wording.liked = next.liked;
  if (typeof next.wishlist === 'string') wording.wishlist = next.wishlist;
  if (next.explain && typeof next.explain === 'object') {
    for (const [k, v] of Object.entries(next.explain)) {
      if (typeof v === 'string' && k in wording.explain) wording.explain[k] = v;
    }
  }
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
  stopId = stops()[0].id;
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
  filterOn = !filterOn;
  paintBar();
  if (openId != null && !shown(GEMS[openId])) {
    openId = null;
    sheetFull = false;
    $('slide').hidden = true;
  }
  drawPins(true);
  if (filterOn) requestAnimationFrame(() => centerStop(stopId, false));
});
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
$('navBtn').addEventListener('click', (e) => { e.stopPropagation(); toast('[would open navigate]'); });
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
  if (data.type === 'gem-pins-wording') applyWording(data.wording);
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

fillRoller();
bindRoller();
setSheet(sheet);
paintBar();
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
