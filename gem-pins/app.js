// Gem map pins: a real Edmonton map with gems on it, and the 15 options from the thread to flip
// through. The setup lives in the link (#…), so "send me what you're looking at" is one copy.

const V = window.CACHE_V || '';
const D = await import(`./data.js${V}`);
const { pinSvg } = await import(`./gems.js${V}`);
const { CATS, RARITY, PALETTE, OPTIONS, NOTES, COPY, OWNERS, NAMES } = D;

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const LETTERS = 'ABCDEFGH';
const catOf = (id) => CATS.find((c) => c.id === id);

/* ---------- options (kept in the link) ---------- */
const START = Object.fromEntries(OPTIONS.map((o) => [o.id, o.start]));
let opt = { ...START };
let myColour = PALETTE[0].id;
let filterOn = new Set(CATS.map((c) => c.id));
function readHash() {
  const q = new URLSearchParams(location.hash.slice(1));
  for (const o of OPTIONS) {
    if (!q.has(o.id)) continue;
    const v = q.get(o.id);
    if (o.multi) opt[o.id] = v ? v.split('.').filter((x) => o.opts.some(([k]) => k === x)) : [];
    else if (o.opts.some(([k]) => k === v)) opt[o.id] = v;
  }
  if (PALETTE.some((p) => p.id === q.get('my'))) myColour = q.get('my');
}
function writeHash() {
  const q = new URLSearchParams();
  for (const o of OPTIONS) {
    const v = opt[o.id];
    if (JSON.stringify(v) === JSON.stringify(START[o.id])) continue;
    q.set(o.id, o.multi ? v.join('.') : v);
  }
  if (myColour !== PALETTE[0].id) q.set('my', myColour);
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
];
const order = PTS.map((p, i) => i).sort((a, b) => {
  const d = ([x, y]) => Math.hypot(x - 195, (y - 330) * 0.8);
  return d(PTS[a]) - d(PTS[b]);
});
const centre = order.filter((i, j) => j % 4 === 0).slice(0, 8); // spaced picks near the middle
const rest = PTS.map((p, i) => i).filter((i) => !centre.includes(i));
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
  };
});

/* ---------- how one gem looks, from the options ---------- */
const mineColour = () => (opt.pick === 'off' ? D.APP_ACCENT : PALETTE.find((p) => p.id === myColour).colour);
const rarityOf = (g) => (opt.levels === '2' && g.rarity === 'mythical' ? 'rare' : g.rarity);
const tagsOf = (g) => {
  const on = g.tags.filter((t) => opt.tags.includes(t));
  return opt.tagMode === 'one' ? on.slice(0, 1) : on;
};
function colourOf(g) {
  if (g.liked && !g.mine && opt.liked === 'colour') return D.LOVE;
  if (opt.rarityBy === 'colour' || opt.colour === 'rarity') return RARITY[rarityOf(g)].colour;
  if (opt.colour === 'category') return catOf(tagsOf(g)[0])?.colour || D.BASE;
  if (g.mine) return mineColour();
  // others. 1D: each gem in its owner's picked colour, if owners' colours are shown to everyone (10B).
  if (opt.colour === 'picked' && opt.sees === 'all' && opt.pick !== 'off') return g.ownerColour;
  // 1A (or 1D with colours private): yours vs everyone else's, in one shared colour
  return opt.others === 'quiet' ? D.BASE : D.OTHERS_FULL;
}
function sizeOf(g) {
  const [s1, s2, s3] = opt.sizes.split('-').map(Number);
  if (!['size', 'sizeGlow'].includes(opt.rarityBy)) return s2;
  const lv = rarityOf(g);
  if (opt.levels === '2') return lv === 'common' ? s1 : s3;
  return { common: s1, rare: s2, mythical: s3 }[lv];
}
function glowOf(g) {
  if (!['glow', 'sizeGlow'].includes(opt.rarityBy)) return null;
  const lv = rarityOf(g);
  return lv === 'common' ? null : lv === 'rare' ? 'rare' : 'mythical';
}
function pinFor(g, overrides = {}) {
  const fill = colourOf(g);
  const mineStyle = g.mine ? opt.mine : null;
  return pinSvg({
    shape: opt.shape === 'category' ? catOf(tagsOf(g)[0])?.shape || 'classic' : 'classic',
    size: sizeOf(g),
    fill,
    hollow: mineStyle === 'hollow' && g.private,
    ring: mineStyle === 'dashed' ? (g.private ? 'dashed' : 'solid') : null,
    ringColour: fill,
    lock: mineStyle === 'lock' && g.private,
    heart: g.liked && opt.liked === 'heart',
    double: g.liked && opt.liked === 'ring',
    loveColour: D.LOVE,
    glow: glowOf(g),
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
  const list = GEMS.slice(0, n).filter((g) => tagsOf(g).length && tagsOf(g).some((t) => filterOn.has(t)));
  for (const g of [...list].sort((a, b) => rank(a) - rank(b))) {
    const b = el('button', 'pin');
    b.type = 'button';
    b.style.left = `${g.at[0] * 100}%`;
    b.style.top = `${g.at[1] * 100}%`;
    b.dataset.id = g.id;
    if (quietFade(g)) b.classList.add('quiet');
    b.innerHTML = pinFor(g);
    b.setAttribute('aria-label', `${g.name}: ${RARITY[rarityOf(g)].label}${g.mine ? `, yours, ${g.private ? 'private' : 'public'}` : `, by ${g.owner}`}${g.liked ? ', liked' : ''}`);
    b.addEventListener('click', () => openGem(g));
    pinsEl.append(b);
    shown++;
  }
  $('count').textContent = COPY.shown(shown);
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

function openGem(g) {
  openSheet((s) => {
    const head = el('div', 'gem-head');
    const art = el('span', 'gem-art');
    art.innerHTML = pinFor(g);
    const t = el('div');
    t.append(el('h2', null, g.name), el('p', 'muted', g.mine ? `${COPY.yours} · ${g.private ? COPY.private : COPY.public}` : COPY.by(g.owner)));
    head.append(art, t);
    const tags = el('div', 'tags');
    const rc = el('span', 'tag rarity', RARITY[rarityOf(g)].label);
    rc.style.setProperty('--c', RARITY[rarityOf(g)].colour);
    tags.append(rc);
    for (const id of tagsOf(g)) { const c = catOf(id); const x = el('span', 'tag', c.label); x.style.setProperty('--c', c.colour); tags.append(x); }
    const row = el('div', 'gem-row');
    row.append(el('span', 'muted', COPY.likes(g.likes + (g.liked ? 1 : 0))));
    if (!g.mine) {
      const like = el('button', 'btn like', g.liked ? `♥ ${COPY.unlike}` : `♡ ${COPY.like}`);
      like.setAttribute('aria-pressed', String(g.liked));
      like.addEventListener('click', () => { g.liked = !g.liked; drawAll(); openGem(g); });
      row.append(like);
    }
    s.append(head, tags, row);
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
  const sample = (g, label, full = false) => { const s = el('span', 'k'); const a = el('span', 'k-art'); a.innerHTML = pinFor(g); if (!full && quietFade(g)) a.classList.add('quiet'); s.append(a, el('span', null, label)); return s; };
  const base = { tags: ['nature'], rarity: 'common', mine: false, private: false, liked: false, owner: 'Sam', ownerColour: PALETTE[2].colour };
  const row = (title, items) => { const r1 = el('div', 'k-row'); r1.append(el('b', null, title), ...items); k.append(r1); };
  if (opt.rarityBy !== 'colour' && opt.colour === 'whose') row('Colour', [sample({ ...base, mine: true }, COPY.yours), sample(base, COPY.others)]);
  if (opt.rarityBy !== 'colour' && opt.colour === 'picked') row('Colour', [sample({ ...base, mine: true }, 'Your colour'), sample(base, opt.sees === 'all' ? 'Their colour' : COPY.others)]);
  if (opt.rarityBy !== 'colour' && opt.colour === 'category') row('Colour', CATS.filter((c) => opt.tags.includes(c.id)).map((c) => sample({ ...base, tags: [c.id] }, c.label, true)));
  const levels = opt.levels === '2' ? ['common', 'rare'] : ['common', 'rare', 'mythical'];
  row('Rarity', levels.map((lv) => sample({ ...base, rarity: lv }, RARITY[lv].label, true)));
  if (opt.shape === 'category') row('Shape', CATS.filter((c) => opt.tags.includes(c.id)).map((c) => sample({ ...base, tags: [c.id] }, c.label, true)));
  row('Yours', [sample({ ...base, mine: true, private: true }, 'Private'), sample({ ...base, mine: true }, 'Public')]);
  row('Liked', [sample({ ...base, liked: true }, 'Liked')]);
}
$('keyBtn').addEventListener('click', () => {
  const open = $('key').classList.toggle('open');
  $('keyBtn').setAttribute('aria-expanded', String(open));
});

/* ---------- the options panel ---------- */
function noteFor(id) {
  if (id === 'colour' && opt.rarityBy === 'colour' && opt.colour !== 'rarity') return NOTES.colourTaken;
  if (id === 'colour' && opt.colour === 'picked' && (opt.sees === 'me' || opt.pick === 'off')) return NOTES.pickedSame;
  if (id === 'sizes' && !['size', 'sizeGlow'].includes(opt.rarityBy)) return NOTES.sizesUnused;
  if (id === 'sees' && opt.pick === 'off') return NOTES.seesUnused;
  if (id === 'sees' && opt.colour !== 'picked') return NOTES.seesNotShown;
  return '';
}
function drawPanel() {
  const list = $('opts');
  list.replaceChildren();
  for (const o of OPTIONS) {
    const li = el('li', 'opt');
    const note = noteFor(o.id);
    li.classList.toggle('idle', !!note && o.id !== 'colour');
    const head = el('div', 'opt-head');
    head.append(el('span', 'num', String(o.n)), el('span', 'opt-label', o.label));
    const segs = el('div', 'segs');
    segs.setAttribute('role', 'group');
    segs.setAttribute('aria-label', `${o.n}. ${o.label}`);
    o.opts.forEach(([v, label], i) => {
      const b = el('button', 'seg');
      b.type = 'button';
      const on = o.multi ? opt[o.id].includes(v) : opt[o.id] === v;
      b.setAttribute('aria-pressed', String(on));
      b.append(el('b', null, LETTERS[i]), label);
      if (!o.multi && v === o.start) { b.title = 'Start with'; b.classList.add('start'); }
      b.addEventListener('click', () => {
        if (o.multi) {
          const set = new Set(opt[o.id]);
          if (set.has(v)) { if (set.size > 1) set.delete(v); } else set.add(v);
          opt[o.id] = CATS.map((c) => c.id).filter((x) => set.has(x));
          if (set.has(v)) filterOn.add(v);
        } else opt[o.id] = v;
        writeHash();
        drawAll();
      });
      segs.append(b);
    });
    li.append(head, segs);
    if (note) li.append(el('p', 'opt-note', note));
    list.append(li);
  }
}
$('resetBtn').addEventListener('click', () => { opt = { ...START }; myColour = PALETTE[0].id; filterOn = new Set(CATS.map((c) => c.id)); writeHash(); drawAll(); });
$('shareBtn').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); toast(COPY.copied); } catch (e) { toast(location.href); }
});
$('optionsBtn').addEventListener('click', () => document.body.classList.add('panel-open'));
$('panelClose').addEventListener('click', () => document.body.classList.remove('panel-open'));

/* ---------- everything ---------- */
function drawAll() {
  document.body.classList.toggle('cb-rg', opt.cb === 'rg');
  drawTop();
  drawPins();
  drawKey();
  drawPanel();
}
for (const [id, text] of [['kicker', COPY.kicker], ['title', COPY.title], ['lead', COPY.lead], ['resetBtn', COPY.reset], ['shareBtn', COPY.share], ['optionsBtn', COPY.options], ['panelClose', COPY.close], ['mapTitle', COPY.mapTitle], ['keyLabel', COPY.key]]) $(id).textContent = text;
addEventListener('hashchange', () => { readHash(); drawAll(); });
drawAll();
