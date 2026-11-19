// Gem map pins: a real Edmonton map with gems on it, and the 15 options from the thread to flip
// through. The setup lives in the link (#…), so "send me what you're looking at" is one copy.

const V = window.CACHE_V || '';
const D = await import(`./data.js${V}`);
const { pinSvg } = await import(`./gems.js${V}`);
const { CATS, RARITY, RARITY_SETS, PALETTE, OPTIONS, NOTES, COPY, OWNERS, NAMES, PRESETS, PHOTOS, MATCHUP, GROUPS } = D;

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const LETTERS = 'ABCDEFGH';
const catOf = (id) => CATS.find((c) => c.id === id);

// If the browser kept an older copy of index.html (Pages caches it ~10 min), add the preset area here
// so the newer script never stops on a missing element.
(function ensurePresetArea() {
  if (!$('presets')) {
    const wrap = el('div', 'presets-wrap');
    wrap.append(Object.assign(el('p', 'presets-title'), { id: 'presetsTitle' }), Object.assign(el('div', 'presets'), { id: 'presets' }), Object.assign(el('p', 'preset-what'), { id: 'presetWhat' }));
    $('opts').before(wrap);
  }
  const wrap = $('presets').parentElement;
  if (!$('tryAt')) wrap.append(Object.assign(el('div', 'try-at'), { id: 'tryAt' }));
  if (!$('matchup')) { const m = el('button', 'matchup'); m.id = 'matchup'; m.type = 'button'; wrap.append(m); }
  for (const id of ['catch', 'pop', 'full', 'peek']) if (!$(id)) { const n = el(id === 'catch' ? 'div' : 'section', id); n.id = id; n.hidden = true; $('phone').append(n); }
})();

/* ---------- options (kept in the link) ---------- */
const START = Object.fromEntries(OPTIONS.map((o) => [o.id, o.start]));
let opt = { ...START };
let myColour = PALETTE[0].id;
let filterOn = new Set(CATS.map((c) => c.id));
let ideas = []; // new attributes people add: { id, label, on: [thing ids] }
function readHash() {
  const q = new URLSearchParams(location.hash.slice(1));
  for (const o of OPTIONS) {
    if (!q.has(o.id)) continue;
    const v = q.get(o.id);
    if (o.multi) opt[o.id] = v ? v.split('.').filter((x) => o.opts.some(([k]) => k === x)) : [];
    else if (o.opts.some(([k]) => k === v)) opt[o.id] = v;
  }
  if (PALETTE.some((p) => p.id === q.get('my'))) myColour = q.get('my');
  // new attributes: "Bounce:rarity.liked|Halo:" (name, then the rows it's on)
  ideas = (q.get('na') || '').split('|').filter(Boolean).map((part) => {
    const [label, on = ''] = part.split(':');
    return { id: 'c-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label, on: on.split('.').filter((t) => D.THINGS.some((x) => x.id === t)) };
  }).filter((a) => a.label);
}
function writeHash() {
  const q = new URLSearchParams();
  for (const o of OPTIONS) {
    const v = opt[o.id];
    if (JSON.stringify(v) === JSON.stringify(START[o.id])) continue;
    q.set(o.id, o.multi ? v.join('.') : v);
  }
  if (myColour !== PALETTE[0].id) q.set('my', myColour);
  if (ideas.length) q.set('na', ideas.map((a) => `${a.label}:${a.on.join('.')}`).join('|'));
  history.replaceState(null, '', q.toString() ? `#${q}` : location.pathname + location.search);
}
readHash();

/* ---------- the gems (same every load) ---------- */
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const r = rng(4242);
const pickOne = (arr) => arr[Math.floor(r() * arr.length)];
// Positions: spread out over a 390 × 640 map, kept as fractions so any screen size works.
const PTS = [];
for (let tries = 0; PTS.length < 100 && tries < 20000; tries++) {
  const x = 26 + r() * 338; const y = 30 + r() * 580;
  if (PTS.every(([a, b]) => Math.hypot(a - x, b - y) > 31)) PTS.push([x, y]);
}
// The first 8 are the special ones, so every density shows the mix: 4 mine (2 private, 2 public),
// 3 liked, 1 mythical. Spread them over the middle of the map.
const SPECIAL = [
  { mine: true, private: true }, { mine: true, private: false }, { liked: true }, { mythical: true },
  { mine: true, private: true }, { liked: true }, { mine: true, private: false }, { liked: true },
  // temporary gems: expiring soon (from a Whimsy Walk or a challenge) and seasonal
  { expiring: '2h', left: '2 hours', from: 'Whimsy Walk' }, { seasonal: true },
  { expiring: '1d', left: '1 day', from: 'challenge' }, { seasonal: true },
];
const order = PTS.map((p, i) => i).sort((a, b) => {
  const d = ([x, y]) => Math.hypot(x - 195, (y - 330) * 0.8);
  return d(PTS[a]) - d(PTS[b]);
});
const centre = order.filter((i, j) => j % 4 === 0).slice(0, SPECIAL.length); // spaced picks near the middle
const rest = PTS.map((p, i) => i).filter((i) => !centre.includes(i));
// Visited: about a third of others' gems, one liked one, never yours or the mythical one.
// (Its own random stream, so the layout above doesn't move.)
const rv = rng(777);
const GEMS = [...centre, ...rest].map((pi, i) => {
  const sp = SPECIAL[i] || {};
  const tags = [pickOne(CATS).id];
  const extra = r();
  if (extra > 0.45) tags.push(pickOne(CATS.filter((c) => !tags.includes(c.id))).id);
  if (extra > 0.85) tags.push(pickOne(CATS.filter((c) => !tags.includes(c.id))).id);
  const owner = sp.mine ? null : OWNERS[i % OWNERS.length];
  return {
    id: i,
    at: [PTS[pi][0] / 390, PTS[pi][1] / 640],
    name: pickOne(NAMES[tags[0]]),
    tags,
    rarity: sp.mythical ? 'mythical' : sp.mine || sp.liked ? (i % 3 === 0 ? 'rare' : 'common') : r() < 0.22 ? 'rare' : 'common',
    mine: !!sp.mine,
    private: !!sp.private,
    liked: !!sp.liked,
    owner,
    ownerColour: PALETTE[(i * 3 + 1) % PALETTE.length].colour,
    likes: sp.liked ? 3 + (i % 9) : Math.floor(r() * 12),
    visited: !sp.mine && !sp.mythical && (i === 2 || (!sp.liked && rv() < 0.33)) && !sp.expiring && !sp.seasonal,
    expiring: sp.expiring || null,
    left: sp.left,
    from: sp.from,
    seasonal: !!sp.seasonal,
  };
});

// Half the rare gems are "epic", which only shows with 4 rarity levels (4C).
GEMS.forEach((g) => { if (g.rarity === 'rare' && g.id % 2) g.rarity = 'epic'; });

/* ---------- how one gem looks, from the options ---------- */
const mineColour = () => (opt.pick === 'off' ? D.APP_ACCENT : PALETTE.find((p) => p.id === myColour).colour);
const levelsList = () => ({ 2: ['common', 'rare'], 3: ['common', 'rare', 'mythical'], 4: ['common', 'rare', 'epic', 'mythical'] }[opt.levels]);
function rarityOf(g) {
  const lv = levelsList();
  if (lv.includes(g.rarity)) return g.rarity;
  return g.rarity === 'mythical' ? lv[lv.length - 1] : 'rare'; // epic folds into rare; mythical into the top level
}
const rarityColour = (lv) => RARITY_SETS[opt.rarityColours][lv];
const SIZE_BY = ['size', 'sizeGlow', 'sizeGlowSparkle', 'sizeSparkle'];
const GLOW_BY = ['glow', 'sizeGlow', 'sizeGlowSparkle', 'glowSparkle'];
const SPARKLE_BY = ['sizeGlowSparkle', 'sparkle', 'sizeSparkle', 'glowSparkle'];
const tagsOf = (g) => {
  const on = g.tags.filter((t) => opt.tags.includes(t));
  return opt.tagMode === 'one' ? on.slice(0, 1) : on;
};
function colourOf(g) {
  if (g.liked && !g.mine && opt.liked === 'colour') return D.LOVE;
  if (opt.rarityBy === 'colour' || opt.colour === 'rarity') return rarityColour(rarityOf(g));
  if (opt.colour === 'none') return D.BASE; // nothing owns colour: every gem the same
  if (opt.colour === 'category') return catOf(tagsOf(g)[0])?.colour || D.BASE;
  if (g.mine) return mineColour();
  // others. 1D: each gem in its owner's picked colour, if owners' colours are shown to everyone (10B).
  if (opt.colour === 'picked' && opt.sees === 'all' && opt.pick !== 'off') return g.ownerColour;
  // 1A (or 1D with colours private): yours vs everyone else's, in one shared colour
  return opt.others === 'quiet' ? D.BASE : D.OTHERS_FULL;
}
function sizeOf(g) {
  const shrink = g.visited && opt.visited === 'small' ? 0.7 : 1;
  return Math.round(baseSize(g) * shrink);
}
function baseSize(g) {
  const [s1, s2, s3] = opt.sizes.split('-').map(Number);
  if (!SIZE_BY.includes(opt.rarityBy)) return s2;
  const lv = levelsList();
  const i = lv.indexOf(rarityOf(g));
  return Math.round(s1 + ((s3 - s1) * i) / (lv.length - 1)); // smallest to largest, evenly
}
function glowOf(g) {
  if (!GLOW_BY.includes(opt.rarityBy)) return null;
  const lv = rarityOf(g);
  if (lv === 'common') return null;
  if (opt.glowOn === 'mythical' && lv !== 'mythical') return null;
  return lv;
}
function pinFor(g, overrides = {}) {
  const fill = g.seasonal && opt.seasonal === 'colour' ? D.SEASONS[opt.season].colour : colourOf(g);
  const mineStyle = g.mine ? opt.mine : null;
  return pinSvg({
    shape: g.seasonal && opt.seasonal === 'shape' ? opt.season : opt.shape === 'category' ? catOf(tagsOf(g)[0])?.shape || 'classic' : opt.shape === 'crystal' ? catOf(tagsOf(g)[0])?.crystal || 'leaf' : 'classic',
    size: sizeOf(g),
    fill,
    hollow: mineStyle === 'hollow' && g.private,
    ring: mineStyle === 'dashed' ? (g.private ? 'dashed' : 'solid') : null,
    ringColour: fill,
    lock: mineStyle === 'lock' && g.private,
    heart: g.liked && opt.liked === 'heart',
    outline: g.liked && opt.liked === 'outline' ? D.LOVE : null,
    double: g.liked && opt.liked === 'ring',
    loveColour: D.LOVE,
    glow: glowOf(g),
    clock: !!g.expiring && opt.expiring === 'clock',
    countdown: g.expiring && opt.expiring === 'countdown' ? g.expiring : null,
    expireRing: !!g.expiring && opt.expiring === 'ring',
    seasonBadge: g.seasonal && opt.seasonal === 'badge' ? D.SEASONS[opt.season].colour : null,
    sparkle: SPARKLE_BY.includes(opt.rarityBy) ? { common: 0, rare: 2, epic: 3, mythical: 4 }[rarityOf(g)] : 0,
    check: g.visited && opt.visited === 'check',
    // others' gems in "quiet" fade back a little when colour shows something else
    ...overrides,
  });
}
const quietFade = (g) => !g.mine && opt.others === 'quiet' && (opt.colour === 'rarity' || opt.colour === 'category' || opt.rarityBy === 'colour');

/* ---------- map ---------- */
const pinsEl = $('pins');
function drawPins() {
  const n = Number(opt.density);
  pinsEl.replaceChildren();
  let shown = 0;
  // draw ordinary gems first so yours, liked and mythical sit on top
  const rank = (g) => (g.rarity === 'mythical' ? 3 : g.mine ? 2 : g.liked ? 1 : 0);
  const list = GEMS.slice(0, n).filter((g) => tagsOf(g).length && tagsOf(g).some((t) => filterOn.has(t)) && !(opt.show === 'unvisited' && g.visited));
  for (const g of [...list].sort((a, b) => rank(a) - rank(b))) {
    const b = el('button', 'pin');
    b.type = 'button';
    b.style.left = `${g.at[0] * 100}%`;
    b.style.top = `${g.at[1] * 100}%`;
    b.dataset.id = g.id;
    if (quietFade(g)) b.classList.add('quiet');
    if (g.visited && opt.visited === 'fade') b.classList.add('visited');
    b.innerHTML = pinFor(g);
    b.setAttribute('aria-label', `${g.name}: ${RARITY[rarityOf(g)].label}${g.mine ? `, yours, ${g.private ? 'private' : 'public'}` : `, by ${g.owner}`}${g.liked ? ', liked' : ''}${g.visited ? ', visited' : ''}${g.expiring ? ', expiring' : ''}${g.seasonal ? ', seasonal' : ''}`);
    b.addEventListener('click', () => openGem(g));
    pinsEl.append(b);
    shown++;
  }
  $('count').textContent = opt.show === 'unvisited' ? COPY.shownUnvisited(shown) : COPY.shown(shown);
}

/* ---------- top of the map: filter chips / filter button / your colour ---------- */
function drawTop() {
  const chips = $('chips');
  chips.replaceChildren();
  chips.hidden = opt.filter !== 'chips';
  const cats = CATS.filter((c) => opt.tags.includes(c.id));
  if (opt.filter === 'chips') {
    const all = el('button', 'chip', COPY.all);
    all.setAttribute('aria-pressed', String(cats.every((c) => filterOn.has(c.id))));
    all.addEventListener('click', () => { cats.forEach((c) => filterOn.add(c.id)); drawAll(); });
    chips.append(all);
    for (const c of cats) {
      const b = el('button', 'chip');
      b.append(Object.assign(el('i', 'dot'), { style: `background:${c.colour}` }), c.label);
      const allOn = cats.every((x) => filterOn.has(x.id));
      b.setAttribute('aria-pressed', String(!allOn && filterOn.has(c.id)));
      b.addEventListener('click', () => {
        // first tap shows just this one; later taps add / remove
        if (cats.every((x) => filterOn.has(x.id))) { filterOn = new Set([c.id]); }
        else if (filterOn.has(c.id)) { filterOn.delete(c.id); if (!cats.some((x) => filterOn.has(x.id))) cats.forEach((x) => filterOn.add(x.id)); }
        else filterOn.add(c.id);
        drawAll();
      });
      chips.append(b);
    }
  }
  const fb = $('filterBtn');
  fb.hidden = opt.filter !== 'sheet';
  fb.textContent = COPY.filter(cats.filter((c) => filterOn.has(c.id)).length, cats.length);
  const sw = $('colourBtn');
  sw.hidden = opt.pick === 'off';
  sw.style.setProperty('--c', mineColour());
  sw.setAttribute('aria-label', `${COPY.yourColour}: ${PALETTE.find((p) => p.id === myColour).label}`);
}

/* ---------- sheets ---------- */
const sheet = $('sheet');
function openSheet(build) {
  sheet.replaceChildren();
  build(sheet);
  const done = el('button', 'btn ghost', COPY.close);
  done.addEventListener('click', closeSheet);
  sheet.append(done);
  sheet.hidden = false;
  $('scrim').hidden = false;
}
function closeSheet() { sheet.hidden = true; $('scrim').hidden = true; }
$('scrim').addEventListener('click', closeSheet);

/* ---------- gem details: four ways (option 18) ---------- */
const photoOf = (g) => PHOTOS[g.id % PHOTOS.length];
const whoLine = (g) => (g.mine ? `${COPY.yours} · ${g.private ? COPY.private : COPY.public}` : COPY.by(g.owner))
  + (g.expiring ? ` · ${COPY.ends(g.left, g.from)}` : '')
  + (g.seasonal ? ` · ${COPY.seasonal(D.SEASONS[opt.season].label, D.SEASONS[opt.season].until)}` : '');
function tagRow(g) {
  const tags = el('div', 'tags');
  const rc = el('span', 'tag rarity', RARITY[rarityOf(g)].label);
  rc.style.setProperty('--c', rarityColour(rarityOf(g)));
  tags.append(rc);
  for (const id of tagsOf(g)) { const c = catOf(id); const x = el('span', 'tag', c.label); x.style.setProperty('--c', c.colour); tags.append(x); }
  return tags;
}
function actionRow(g, reopen = openGem) {
  const row = el('div', 'gem-row');
  row.append(el('span', 'muted', `${COPY.likes(g.likes + (g.liked ? 1 : 0))} · ${g.mine || g.visited ? COPY.visited : COPY.notVisited}`));
  const btns = el('div', 'gem-btns');
  if (!g.mine && !g.visited) {
    const mv = el('button', 'btn', COPY.markVisited);
    mv.addEventListener('click', () => { g.visited = true; drawAll(); reopen(g); });
    btns.append(mv);
  }
  if (!g.mine) {
    const like = el('button', 'btn like', g.liked ? `♥ ${COPY.unlike}` : `♡ ${COPY.like}`);
    like.setAttribute('aria-pressed', String(g.liked));
    like.addEventListener('click', () => { g.liked = !g.liked; drawAll(); reopen(g); });
    btns.append(like);
  }
  row.append(btns);
  return row;
}
function closeDetails() {
  for (const id of ['pop', 'full', 'peek', 'catch']) $(id).hidden = true;
  document.querySelectorAll('.pin.selected').forEach((p) => p.classList.remove('selected'));
}
$('catch').addEventListener('click', closeDetails);
function selectPin(g) {
  document.querySelectorAll('.pin.selected').forEach((p) => p.classList.remove('selected'));
  document.querySelector(`.pin[data-id="${g.id}"]`)?.classList.add('selected');
}
const closeBtn = (cls = 'x') => { const b = el('button', cls, '×'); b.type = 'button'; b.setAttribute('aria-label', COPY.close); b.addEventListener('click', closeDetails); return b; };

function openGem(g) {
  closeDetails();
  if (opt.details === 'pop') return openPop(g);
  if (opt.details === 'full') return openFull(g);
  if (opt.details === 'peek') return openPeek(g);
  openSheetGem(g);
}

// B: a small card right by the gem, pointing at it
function openPop(g) {
  const pop = $('pop');
  pop.replaceChildren();
  const head = el('div', 'gem-head');
  const art = el('span', 'gem-art small'); art.innerHTML = pinFor(g);
  const t = el('div'); t.append(el('h3', null, g.name), el('p', 'muted', whoLine(g)));
  head.append(art, t, closeBtn());
  pop.append(head, tagRow(g), actionRow(g), el('i', 'arrow'));
  pop.hidden = false; $('catch').hidden = false;
  selectPin(g);
  const ph = $('phone').getBoundingClientRect();
  const pin = document.querySelector(`.pin[data-id="${g.id}"]`).getBoundingClientRect();
  const cx = pin.left + 22 - ph.left; const cy = pin.top + 22 - ph.top;
  const w = pop.offsetWidth; const h = pop.offsetHeight;
  const below = cy - h - 30 < 90; // not enough room above: open under the gem
  pop.classList.toggle('below', below);
  pop.style.left = `${Math.max(10, Math.min(ph.width - w - 10, cx - w / 2))}px`;
  pop.style.top = `${below ? cy + 28 : cy - h - 28}px`;
  pop.style.setProperty('--ax', `${cx - parseFloat(pop.style.left)}px`);
}

// C: the photo takes the whole screen
function openFull(g) {
  const f = $('full');
  f.replaceChildren();
  const hero = el('div', 'hero');
  hero.style.backgroundImage = `url(${photoOf(g)})`;
  const art = el('span', 'gem-art'); art.innerHTML = pinFor(g);
  hero.append(closeBtn('x on-photo'), art);
  const body = el('div', 'full-body');
  body.append(el('h2', null, g.name), el('p', 'muted', whoLine(g)), tagRow(g), actionRow(g));
  f.append(hero, body);
  f.hidden = false;
}

// D: a strip of nearby gems along the bottom; swipe and the map follows
function openPeek(g) {
  const strip = $('peek');
  strip.replaceChildren();
  const shown = [...document.querySelectorAll('.pin')].map((p) => GEMS[Number(p.dataset.id)]);
  const near = shown.sort((a, b) => Math.hypot(a.at[0] - g.at[0], (a.at[1] - g.at[1]) * 1.6) - Math.hypot(b.at[0] - g.at[0], (b.at[1] - g.at[1]) * 1.6)).slice(0, 12);
  const top = el('div', 'peek-top');
  top.append(el('span', 'muted', COPY.nearby(near.length)), closeBtn());
  const list = el('div', 'peek-list');
  for (const x of near) {
    const c = el('button', 'peek-card');
    c.type = 'button';
    c.dataset.id = x.id;
    const ph = el('span', 'peek-photo'); ph.style.backgroundImage = `url(${photoOf(x)})`;
    const art = el('span', 'gem-art tiny'); art.innerHTML = pinFor(x); ph.append(art);
    const t = el('span', 'peek-text');
    t.append(el('b', null, x.name), el('span', 'muted', `${RARITY[rarityOf(x)].label} · ${x.mine ? COPY.yours : x.owner}${x.visited ? ` · ${COPY.visited}` : ''}`), el('span', 'more', COPY.more));
    c.append(ph, t);
    c.addEventListener('click', () => { closeDetails(); openSheetGem(x); });
    list.append(c);
  }
  strip.append(top, list);
  strip.hidden = false;
  selectPin(g);
  let tmr = 0;
  list.addEventListener('scroll', () => {
    clearTimeout(tmr);
    tmr = setTimeout(() => {
      const i = Math.round(list.scrollLeft / (list.firstElementChild.offsetWidth + 10));
      const x = near[Math.max(0, Math.min(near.length - 1, i))];
      if (x) selectPin(x);
    }, 80);
  });
}

// A: bottom sheet
function openSheetGem(g) {
  openSheet((s) => {
    const head = el('div', 'gem-head');
    const art = el('span', 'gem-art');
    art.innerHTML = pinFor(g);
    const t = el('div');
    t.append(el('h2', null, g.name), el('p', 'muted', whoLine(g)));
    head.append(art, t);
    s.append(head, tagRow(g), actionRow(g, openSheetGem));
  });
}

$('filterBtn').addEventListener('click', () => openSheet((s) => {
  s.append(el('h2', null, COPY.filterTitle));
  const list = el('div', 'checks');
  for (const c of CATS.filter((x) => opt.tags.includes(x.id))) {
    const l = el('label', 'check');
    const i = Object.assign(document.createElement('input'), { type: 'checkbox', checked: filterOn.has(c.id) });
    i.addEventListener('change', () => { if (i.checked) filterOn.add(c.id); else filterOn.delete(c.id); drawAll(); });
    l.append(i, Object.assign(el('i', 'dot'), { style: `background:${c.colour}` }), c.label);
    list.append(l);
  }
  s.append(list);
}));

$('colourBtn').addEventListener('click', () => openSheet((s) => {
  s.append(el('h2', null, COPY.yourColour));
  const grid = el('div', 'swatches');
  PALETTE.forEach((p, i) => {
    const locked = opt.pick === 'two' && i >= D.FREE_COLOURS;
    const b = el('button', 'swatch');
    b.style.setProperty('--c', p.colour);
    b.setAttribute('aria-pressed', String(p.id === myColour));
    b.setAttribute('aria-label', p.label + (locked ? ` (${COPY.locked})` : ''));
    b.append(el('i'), el('span', null, p.label));
    if (locked) { b.classList.add('locked'); b.append(el('em', null, `🔒 ${COPY.locked}`)); }
    b.addEventListener('click', () => {
      if (locked) { toast(COPY.lockedToast); return; }
      myColour = p.id; writeHash(); drawAll(); closeSheet();
    });
    grid.append(b);
  });
  s.append(grid, el('p', 'muted', opt.sees === 'me' ? COPY.seesMe : COPY.seesAll));
}));

let toastTimer = 0;
function toast(text) {
  const t = $('toast');
  t.textContent = text; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

/* ---------- key (what the pins mean right now) ---------- */
function drawKey() {
  const k = $('keyBody');
  k.replaceChildren();
  // samples explaining a colour or shape are shown at full strength, so the key stays readable
  const sample = (g, label, full = false, faded = false) => { const s = el('span', 'k'); const a = el('span', 'k-art'); a.innerHTML = pinFor(g); if (!full && quietFade(g)) a.classList.add('quiet'); if (faded) a.classList.add('visited'); s.append(a, el('span', null, label)); return s; };
  const base = { tags: ['nature'], rarity: 'common', mine: false, private: false, liked: false, owner: 'Sam', ownerColour: PALETTE[2].colour };
  const row = (title, items) => { const r1 = el('div', 'k-row'); r1.append(el('b', null, title), ...items); k.append(r1); };
  if (opt.rarityBy !== 'colour' && opt.colour === 'whose') row('Colour', [sample({ ...base, mine: true }, COPY.yours), sample(base, COPY.others)]);
  if (opt.rarityBy !== 'colour' && opt.colour === 'picked') row('Colour', [sample({ ...base, mine: true }, 'Your colour'), sample(base, opt.sees === 'all' ? 'Their colour' : COPY.others)]);
  if (opt.rarityBy !== 'colour' && opt.colour === 'category') row('Colour', CATS.filter((c) => opt.tags.includes(c.id)).map((c) => sample({ ...base, tags: [c.id] }, c.label, true)));
  const levels = levelsList();
  row('Rarity', levels.map((lv) => sample({ ...base, rarity: lv }, RARITY[lv].label, true)));
  if (opt.shape === 'crystal') row('Shape', D.CRYSTALS.map((cr) => { const c = CATS.find((x) => x.crystal === cr.id && opt.tags.includes(x.id)); return c && sample({ ...base, tags: [c.id] }, `${cr.label} (${CATS.filter((x) => x.crystal === cr.id).map((x) => x.label).join(', ')})`, true); }).filter(Boolean));
  if (opt.shape === 'category') row('Shape', CATS.filter((c) => opt.tags.includes(c.id)).map((c) => sample({ ...base, tags: [c.id] }, c.label, true)));
  row('Yours', [sample({ ...base, mine: true, private: true }, 'Private'), sample({ ...base, mine: true }, 'Public')]);
  row('Liked', [sample({ ...base, liked: true }, 'Liked', true)]);
  const tl = [];
  if (opt.expiring !== 'none') tl.push(sample({ ...base, expiring: '2h' }, 'Expiring soon', true));
  if (opt.seasonal !== 'none') tl.push(sample({ ...base, seasonal: true }, `${D.SEASONS[opt.season].label} gem`, true));
  if (tl.length) row('Time', tl);
  if (opt.visited !== 'none' && opt.show !== 'unvisited') row('Visited', [sample({ ...base }, COPY.notVisited), sample({ ...base, visited: true }, COPY.visited, false, opt.visited === 'fade')]);
}
$('keyBtn').addEventListener('click', () => {
  const open = $('key').classList.toggle('open');
  $('keyBtn').setAttribute('aria-expanded', String(open));
});

/* ---------- the options panel ---------- */
function noteFor(id) {
  if (id === 'colour' && opt.rarityBy === 'colour' && opt.colour !== 'rarity') return NOTES.colourTaken;
  if (id === 'colour' && opt.colour === 'picked' && (opt.sees === 'me' || opt.pick === 'off')) return NOTES.pickedSame;
  if (id === 'visited' && opt.show === 'unvisited') return NOTES.visitedHidden;
  if (id === 'sizes' && !SIZE_BY.includes(opt.rarityBy)) return NOTES.sizesUnused;
  if (id === 'glowOn' && !GLOW_BY.includes(opt.rarityBy)) return NOTES.glowUnused;
  if (id === 'rarityColours' && opt.colour !== 'rarity' && opt.rarityBy !== 'colour') return NOTES.coloursUnused;
  if (id === 'sees' && opt.pick === 'off') return NOTES.seesUnused;
  if (id === 'sees' && opt.colour !== 'picked') return NOTES.seesNotShown;
  return '';
}
function optionRow(o, short) {
  const row = el('div', 'opt');
  row.dataset.n = o.n;
  const note = noteFor(o.id);
  row.classList.toggle('idle', !!note && o.id !== 'colour');
  const head = el('div', 'opt-head');
  const lab = el('label', 'opt-label', short);
  head.append(el('span', 'num', String(o.n)), lab);
  row.append(head);
  if (!o.multi) {
    const sel = el('select', 'opt-select');
    sel.id = `opt-${o.id}`;
    lab.htmlFor = sel.id;
    sel.setAttribute('aria-label', `${o.n}. ${o.label}`);
    o.opts.forEach(([v, label], i) => {
      const op = el('option', null, `${LETTERS[i]} · ${label}${v === o.start ? ' •' : ''}`);
      op.value = v;
      op.selected = opt[o.id] === v;
      sel.append(op);
    });
    sel.addEventListener('change', () => { opt[o.id] = sel.value; writeHash(); closeDetails(); drawAll(); });
    row.append(sel);
  } else {
    // category tags: several at once, so chips
    const segs = el('div', 'segs');
    segs.setAttribute('role', 'group');
    segs.setAttribute('aria-label', `${o.n}. ${o.label}`);
    o.opts.forEach(([v, label], i) => {
      const b = el('button', 'seg');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(opt[o.id].includes(v)));
      b.append(el('b', null, LETTERS[i]), label);
      b.addEventListener('click', () => {
        const set = new Set(opt[o.id]);
        if (set.has(v)) { if (set.size > 1) set.delete(v); } else set.add(v);
        opt[o.id] = CATS.map((c) => c.id).filter((x) => set.has(x));
        if (set.has(v)) filterOn.add(v);
        writeHash(); closeDetails(); drawAll();
      });
      segs.append(b);
    });
    row.append(segs);
  }
  if (note) row.append(el('p', 'opt-note', note));
  return row;
}
function drawPanel() {
  const list = $('opts');
  list.replaceChildren();
  for (const [name, rows] of GROUPS) {
    const li = el('li', 'group');
    const body = el('div', 'group-rows');
    for (const [id, short] of rows) body.append(optionRow(OPTIONS.find((o) => o.id === id), short));
    li.append(el('h3', 'group-name', name), body);
    list.append(li);
  }
}
$('resetBtn').addEventListener('click', () => { ideas = []; opt = { ...START }; myColour = PALETTE[0].id; filterOn = new Set(CATS.map((c) => c.id)); writeHash(); drawAll(); });
$('shareBtn').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); toast(COPY.copied); } catch (e) { toast(location.href); }
});
$('optionsBtn').addEventListener('click', () => document.body.classList.add('panel-open'));
$('panelClose').addEventListener('click', () => document.body.classList.remove('panel-open'));

/* ---------- everything ---------- */
/* ---------- preset combos ---------- */
// A preset sets everything except density and colour-blind, so you can run it at 10 / 40 / 100 and with CB.
const KEEP = ['density', 'cb'];
const presetOpts = (p) => ({ ...START, ...p.set, density: opt.density, cb: opt.cb });
const same = (a, b) => OPTIONS.every((o) => KEEP.includes(o.id) || JSON.stringify(a[o.id]) === JSON.stringify(b[o.id]));
const usePreset = (p) => { opt = presetOpts(p); filterOn = new Set(CATS.map((c) => c.id)); closeDetails(); writeHash(); drawAll(); };
// "Colour = …, Size = …" for a setup, read straight from its options so it can't drift
const optLabel = (id, v) => OPTIONS.find((o) => o.id === id).opts.find(([k]) => k === v)?.[1] || v;
function specOf(o) {
  const lv = { 2: 'Common, Rare', 3: 'Common, Rare, Mythical', 4: 'Common, Rare, Epic, Mythical' }[o.levels];
  const sized = SIZE_BY.includes(o.rarityBy);
  const glows = GLOW_BY.includes(o.rarityBy);
  const colourIsRarity = o.colour === 'rarity' || o.rarityBy === 'colour';
  const rows = [
    ['Colour', colourIsRarity ? `Rarity (${o.rarityColours === 'treasure' ? 'quartz, sapphire, amethyst, gold' : 'moonstone, aquamarine, topaz'})` : optLabel('colour', o.colour)],
    ['Shape', optLabel('shape', o.shape)],
    ['Size', sized ? `Rarity (${o.sizes.replace(/-/g, ' / ')} px)` : 'Same for all'],
    ['Glow', glows ? (o.glowOn === 'mythical' ? 'Mythical only' : 'Rare and up') : 'None'],
  ];
  if (SPARKLE_BY.includes(o.rarityBy)) rows.push(['Sparkle', 'Rare and up']);
  rows.push(['Rarity levels', lv], ['Private vs public', optLabel('mine', o.mine)], ['Liked', optLabel('liked', o.liked)],
    ['Your colour', optLabel('pick', o.pick)], ['Expiring soon', optLabel('expiring', o.expiring)], ['Seasonal', optLabel('seasonal', o.seasonal)], ['Categories', `${optLabel('tagMode', o.tagMode)} · ${optLabel('filter', o.filter)}`]);
  return rows;
}

function drawPresets() {
  const box = $('presets');
  box.replaceChildren();
  const on = PRESETS.find((p) => same(opt, presetOpts(p)));
  PRESETS.forEach((p, i) => {
    const b = el('button', 'preset');
    b.type = 'button';
    b.setAttribute('aria-pressed', String(on === p));
    b.append(el('b', null, `P${i + 1}`), p.label);
    if (p.star) { b.append(el('span', 'star', '★')); b.title = COPY.myPick; }
    b.addEventListener('click', () => usePreset(p));
    box.append(b);
  });
  const what = $('presetWhat');
  what.replaceChildren();
  if (on) {
    const dl = el('dl', 'p-spec');
    for (const [k, v] of specOf(presetOpts(on))) dl.append(el('dt', null, k), el('dd', null, v));
    what.append(el('span', 'p-desc', on.desc), el('b', 'p-tests', COPY.tests + on.tests), dl);
  }
  else what.textContent = COPY.custom;
  // run it at 10 / 40 / 100 gems and with the colour-blind view
  const tr = $('tryAt');
  tr.replaceChildren(el('span', 'try-label', COPY.tryAt));
  for (const n of ['10', '40', '100']) {
    const b = el('button', 'preset small', n);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(opt.density === n));
    b.addEventListener('click', () => { opt.density = n; writeHash(); drawAll(); });
    tr.append(b);
  }
  const cb = el('button', 'preset small', COPY.cbShort);
  cb.type = 'button';
  cb.setAttribute('aria-pressed', String(opt.cb === 'rg'));
  cb.addEventListener('click', () => { opt.cb = opt.cb === 'rg' ? 'off' : 'rg'; writeHash(); drawAll(); });
  tr.append(cb);
  // the head-to-head
  const m = $('matchup');
  const [a, b2] = MATCHUP.map((id) => PRESETS.find((p) => p.id === id));
  m.textContent = COPY.matchup;
  m.title = COPY.matchupWhat;
  m.setAttribute('aria-pressed', String(on === a || on === b2));
  m.onclick = () => usePreset(on === a ? b2 : a);
}

/* ---------- drag & drop settings ---------- */
// Read which qualities each thing uses from the options, and write them back. Both panel modes
// (dropdowns, drag & drop) share the same options, so presets and links keep working.
const rarityParts = (v) => ({ size: SIZE_BY.includes(v), glow: GLOW_BY.includes(v), sparkle: SPARKLE_BY.includes(v) });
function qualitiesOf(o) {
  const r = rarityParts(o.rarityBy);
  return {
    creator: ['whose', 'picked'].includes(o.colour) && o.rarityBy !== 'colour' ? ['colour'] : [],
    rarity: [...(o.colour === 'rarity' || o.rarityBy === 'colour' ? ['colour'] : []), ...['size', 'glow', 'sparkle'].filter((k) => r[k])],
    category: [...(o.colour === 'category' && o.rarityBy !== 'colour' ? ['colour'] : []), ...(['category', 'crystal'].includes(o.shape) ? ['shape'] : [])],
    mine: { hollow: ['hollow'], dashed: ['frame'], lock: ['badge'] }[o.mine] || [],
    liked: { heart: ['badge'], outline: ['outline'], ring: ['ring'], colour: ['tint'] }[o.liked] || [],
    visited: { fade: ['fade'], check: ['badge'], small: ['size'] }[o.visited] || [],
    expiring: { clock: ['badge'], countdown: ['label'], ring: ['ring'] }[o.expiring] || [],
    seasonal: { shape: ['shape'], badge: ['badge'], colour: ['tint'] }[o.seasonal] || [],
  };
}
function setQualities(thing, qs) {
  const has = (q) => qs.includes(q);
  const rarityValue = (r) => (r.size && r.glow && r.sparkle ? 'sizeGlowSparkle' : r.size && r.glow ? 'sizeGlow' : r.size && r.sparkle ? 'sizeSparkle' : r.glow && r.sparkle ? 'glowSparkle' : r.size ? 'size' : r.glow ? 'glow' : r.sparkle ? 'sparkle' : 'none');
  if (opt.rarityBy === 'colour') { opt.rarityBy = 'none'; if (opt.colour !== 'rarity') opt.colour = 'rarity'; }
  if (thing === 'creator') { if (has('colour')) opt.colour = opt.colour === 'picked' ? 'picked' : 'whose'; else if (['whose', 'picked'].includes(opt.colour)) opt.colour = 'none'; }
  if (thing === 'rarity') {
    if (has('colour')) opt.colour = 'rarity'; else if (opt.colour === 'rarity') opt.colour = 'none';
    opt.rarityBy = rarityValue({ size: has('size'), glow: has('glow'), sparkle: has('sparkle') });
  }
  if (thing === 'category') {
    if (has('colour')) opt.colour = 'category'; else if (opt.colour === 'category') opt.colour = 'none';
    opt.shape = has('shape') ? (opt.shape === 'crystal' ? 'crystal' : 'category') : 'one';
  }
  if (thing === 'mine') opt.mine = has('hollow') ? 'hollow' : has('frame') ? 'dashed' : has('badge') ? 'lock' : 'none';
  if (thing === 'liked') opt.liked = has('badge') ? 'heart' : has('outline') ? 'outline' : has('ring') ? 'ring' : has('tint') ? 'colour' : 'none';
  if (thing === 'visited') opt.visited = has('fade') ? 'fade' : has('badge') ? 'check' : has('size') ? 'small' : 'none';
  if (thing === 'expiring') opt.expiring = has('badge') ? 'clock' : has('label') ? 'countdown' : has('ring') ? 'ring' : 'none';
  if (thing === 'seasonal') opt.seasonal = has('shape') ? 'shape' : has('badge') ? 'badge' : has('tint') ? 'colour' : 'none';
}
const isIdea = (id) => id.startsWith('c-');
const qLabel = (id) => (isIdea(id) ? ideas.find((a) => a.id === id)?.label || id : D.QUALITIES.find((q) => q.id === id).label);
const tLabel = (id) => D.THINGS.find((t) => t.id === id).label;
function dropIdea(id, thingId, fromThing) {
  const a = ideas.find((x) => x.id === id);
  if (!a) return;
  a.on = [...new Set([...a.on.filter((t) => t !== fromThing), thingId])];
  writeHash(); drawDnd();
}
function dropQuality(q, thingId, fromThing) {
  if (isIdea(q)) return dropIdea(q, thingId, fromThing);
  const t = D.THINGS.find((x) => x.id === thingId);
  if (!t.uses.includes(q)) { toast(COPY.cantUse(t.label, qLabel(q))); return false; }
  const now = qualitiesOf(opt);
  if (fromThing && fromThing !== thingId) setQualities(fromThing, now[fromThing].filter((x) => x !== q));
  let msg = '';
  if (q === 'colour') { // colour belongs to one thing: take it from whoever has it
    const owner = Object.keys(now).find((k) => ['creator', 'rarity', 'category'].includes(k) && now[k].includes('colour') && k !== thingId);
    if (owner) { setQualities(owner, qualitiesOf(opt)[owner].filter((x) => x !== 'colour')); msg = COPY.colourMoved(tLabel(owner), t.label); }
  }
  const cur = qualitiesOf(opt)[thingId];
  setQualities(thingId, t.many ? [...new Set([...cur, q])] : [q]);
  writeHash(); closeDetails(); drawAll();
  if (msg) toast(msg);
  return true;
}
function removeQuality(q, thingId) {
  if (isIdea(q)) { const a = ideas.find((x) => x.id === q); if (a) a.on = a.on.filter((t) => t !== thingId); writeHash(); drawDnd(); return; } setQualities(thingId, qualitiesOf(opt)[thingId].filter((x) => x !== q)); writeHash(); drawAll(); }

let panelMode = 'dropdowns';
try { panelMode = localStorage.getItem('sc-gem-panel') || 'dropdowns'; } catch (e) { /* fine */ }
let picked = null; // tap-to-place: { q, from }
function drawDnd() {
  const box = $('dnd');
  box.replaceChildren();
  box.append(el('p', 'dnd-help', COPY.dndHelp));
  const q = qualitiesOf(opt);
  const rows = el('div', 'dnd-rows');
  for (const t of D.THINGS) {
    const row = el('div', 'dnd-row');
    const zone = el('div', 'drop');
    zone.dataset.thing = t.id;
    zone.tabIndex = 0;
    zone.setAttribute('role', 'button');
    zone.setAttribute('aria-label', `${t.label}: ${q[t.id].map(qLabel).join(', ') || 'nothing'}. ${COPY.dropHere}`);
    if (picked) zone.classList.toggle('can', isIdea(picked.q) || t.uses.includes(picked.q));
    for (const id of q[t.id]) zone.append(chip(id, t.id));
    const placedIdeas = ideas.filter((a) => a.on.includes(t.id));
    for (const a of placedIdeas) zone.append(chip(a.id, t.id));
    if (!q[t.id].length && !placedIdeas.length) zone.append(el('span', 'drop-empty', COPY.dropHere));
    const place = () => { if (picked) { const p = picked; picked = null; dropQuality(p.q, t.id, p.from); } };
    zone.addEventListener('click', (e) => { if (e.target === zone || e.target.classList.contains('drop-empty')) place(); });
    zone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); place(); } });
    row.append(el('span', 'dnd-thing', t.label), zone);
    rows.append(row);
  }
  const cloud = el('div', 'cloud');
  cloud.dataset.cloud = '1';
  cloud.append(el('p', 'cloud-title', COPY.cloud));
  const wrap = el('div', 'cloud-chips');
  for (const x of D.QUALITIES) wrap.append(chip(x.id, null, x.only && Object.values(q).some((l) => l.includes(x.id))));
  for (const a of ideas) wrap.append(chip(a.id, null));
  wrap.append(newAttrControl());
  cloud.append(wrap);
  if (ideas.length) cloud.append(el('p', 'idea-note', COPY.ideaNote));
  box.append(rows, cloud);
}
let addingAttr = false;
function newAttrControl() {
  if (!addingAttr) {
    const b = el('button', 'qchip new-attr', COPY.newAttr);
    b.type = 'button';
    b.id = 'newAttrBtn';
    b.addEventListener('click', () => { addingAttr = true; drawDnd(); $('newAttrName')?.focus(); });
    return b;
  }
  const f = el('form', 'new-attr-form');
  const i = el('input');
  i.id = 'newAttrName'; i.maxLength = 24; i.placeholder = COPY.newAttrPlaceholder; i.setAttribute('aria-label', COPY.newAttr);
  const ok = el('button', 'qchip', COPY.add); ok.type = 'submit';
  const no = el('button', 'qchip ghosty', COPY.cancel); no.type = 'button';
  no.addEventListener('click', () => { addingAttr = false; drawDnd(); });
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const label = i.value.trim().replace(/[|:.]/g, ' ').replace(/\s+/g, ' ').slice(0, 24);
    if (!label) return;
    const id = 'c-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (ideas.some((a) => a.id === id) || D.QUALITIES.some((x) => x.label.toLowerCase() === label.toLowerCase())) { toast(COPY.attrExists(label)); return; }
    ideas.push({ id, label, on: [] });
    addingAttr = false; writeHash(); drawDnd();
  });
  f.append(i, ok, no);
  return f;
}
function chip(qid, thing, inUse = false) {
  const c = el('button', 'qchip');
  c.type = 'button';
  c.dataset.q = qid;
  if (thing) c.dataset.from = thing;
  c.classList.toggle('in-use', inUse);
  c.classList.toggle('idea', isIdea(qid));
  c.classList.toggle('picked', !!picked && picked.q === qid && (picked.from || null) === (thing || null));
  c.append(el('span', null, qLabel(qid)));
  if (!thing && isIdea(qid)) {
    const x = el('i', 'qx', '×');
    x.setAttribute('aria-hidden', 'true');
    c.append(x);
    c.title = COPY.deleteAttr(qLabel(qid));
  }
  if (thing) {
    const x = el('i', 'qx', '×');
    x.setAttribute('aria-hidden', 'true');
    c.append(x);
    c.setAttribute('aria-label', COPY.remove(qLabel(qid), tLabel(thing)));
  }
  c.addEventListener('pointerdown', (e) => startDrag(e, qid, thing));
  return c;
}
// pointer drag (mouse and touch); a tap without moving = pick up / put down
function startDrag(e, qid, from) {
  if (e.button !== undefined && e.button !== 0) return;
  const src = e.currentTarget;
  const x0 = e.clientX; const y0 = e.clientY;
  let ghost = null;
  const move = (ev) => {
    if (!ghost && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
    if (!ghost) {
      ghost = src.cloneNode(true); ghost.classList.add('ghost'); document.body.append(ghost);
      document.body.classList.add('dragging');
      document.querySelectorAll('#dnd .drop').forEach((z) => z.classList.toggle('can', isIdea(qid) || D.THINGS.find((t) => t.id === z.dataset.thing).uses.includes(qid)));
    }
    ghost.style.left = `${ev.clientX}px`; ghost.style.top = `${ev.clientY}px`;
    document.querySelectorAll('#dnd .drop.over').forEach((z) => z.classList.remove('over'));
    document.elementFromPoint(ev.clientX, ev.clientY)?.closest('#dnd .drop')?.classList.add('over');
    ev.preventDefault();
  };
  const up = (ev) => {
    removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
    document.body.classList.remove('dragging');
    if (!ghost) { // a tap
      if (from && ev.target.closest('.qx')) { removeQuality(qid, from); return; }
      if (!from && isIdea(qid) && ev.target.closest('.qx')) { ideas = ideas.filter((a) => a.id !== qid); writeHash(); drawDnd(); return; }
      picked = picked && picked.q === qid && picked.from === (from || null) ? null : { q: qid, from: from || null };
      drawDnd();
      return;
    }
    ghost.remove();
    const at = document.elementFromPoint(ev.clientX, ev.clientY);
    const zone = at?.closest('#dnd .drop');
    picked = null;
    if (zone) dropQuality(qid, zone.dataset.thing, from);
    else if (from && at?.closest('#dnd [data-cloud]')) removeQuality(qid, from);
    else drawDnd();
  };
  addEventListener('pointermove', move, { passive: false });
  addEventListener('pointerup', up);
  addEventListener('pointercancel', up);
}
function drawMode() {
  $('opts').hidden = panelMode !== 'dropdowns';
  $('dnd').hidden = panelMode !== 'drag';
  document.querySelectorAll('#panelMode button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === panelMode)));
}
(function ensureDndArea() {
  if (!$('dnd')) { const d = el('div', 'dnd'); d.id = 'dnd'; d.hidden = true; $('opts').after(d); }
  if (!$('panelMode')) {
    const m = el('div', 'panel-mode'); m.id = 'panelMode'; m.setAttribute('role', 'group'); m.setAttribute('aria-label', 'Settings view');
    for (const [k, label] of [['dropdowns', COPY.modeDropdowns], ['drag', COPY.modeDrag]]) {
      const b = el('button', null, label); b.type = 'button'; b.dataset.mode = k;
      b.addEventListener('click', () => { panelMode = k; picked = null; try { localStorage.setItem('sc-gem-panel', k); } catch (e) { /* fine */ } drawMode(); drawDnd(); });
      m.append(b);
    }
    $('opts').before(m);
  }
})();

function drawAll() {
  document.body.classList.toggle('cb-rg', opt.cb === 'rg');
  drawTop();
  drawPins();
  drawKey();
  drawPanel();
  drawPresets();
  drawDnd();
  drawMode();
}
for (const [id, text] of [['kicker', COPY.kicker], ['title', COPY.title], ['lead', COPY.lead], ['resetBtn', COPY.reset], ['shareBtn', COPY.share], ['optionsBtn', COPY.options], ['panelClose', COPY.close], ['mapTitle', COPY.mapTitle], ['keyLabel', COPY.key], ['presetsTitle', COPY.presets]]) $(id).textContent = text;
addEventListener('hashchange', () => { readHash(); drawAll(); });
drawAll();
