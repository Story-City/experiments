// Sticker Book: a passport that fills with die-cut stickers as quests finish.
// No streaks, no missed days: it only ever gains stickers.
// Every sticker is stamped with where and when you earned it, like a park passport.

const TEXT = {
  kicker: 'My passport',
  title: 'Sticker Book',
  of: (n, t) => `${n} of ${t}`,
  collected: 'stickers so far',
  prev: 'Previous page',
  next: 'Next page',
  swipe: 'Tap a sticker to see its postcard. Swipe to turn pages.',
  emptyLbl: 'Your next walk',
  emptyAria: 'Empty slot: play a quest to fill it',
  pcGreet: 'Greetings from',
  pcEarned: 'Earned by',
  pcFrom: 'Agent’s passport · Story City',
  pcWren: 'Stamped and filed. Nice work, agent. — W.',
  pcBack: 'Back to My Passport',
  finish: 'Finish a Quest',
  full: 'Every Slot Is Filled',
  questKicker: 'A tiny quest',
  done: 'Done',
  notNow: 'Not now',
  newKicker: 'New sticker',
  newTitle: (w) => `${w} is in your passport.`,
  newMore: (n, t) => `${n} of ${t} slots filled. Every quest you play leaves one.`,
  stampLine: (s) => `${s.place} · ${s.date}`,
  fullMore: 'Your whole passport is full. What a collection.',
  keep: 'Keep It',
  back: 'Back to Tools',
  reset: 'Reset Demo Stickers',
  resetDone: 'Back to the starting stickers',
};

const STORE = 'st-sticker-book';
const SLOTS = 8;
const PAGES = [
  { name: 'Oliver', note: 'Neighbourhood', spots: ['Oliver Park', '124 Street', 'Paul Kane Park', 'Jasper Ave', 'Grandin Station', 'Victoria Promenade'] },
  { name: 'River Valley', note: 'Neighbourhood', spots: ['Accidental Beach', 'Hawrelak Park', 'Kinsmen Trail', 'Louise McKinney', 'Funicular Steps', 'Dawson Bridge'] },
  { name: 'Halloween 2026', note: 'Season', spots: ['Whyte Ave', 'Old Strathcona', 'Garneau Lane', 'Ritchie Market', 'Mill Creek Ravine', 'Bonnie Doon'] },
];

// Stickers already in the book (pretend history).
const START = [
  { page: 0, glyph: 'leaf', word: 'Leafy', jewel: '#5BD380', place: 'Oliver Park', date: '6 Sep', quest: 'Find a leaf bigger than your hand.' },
  { page: 0, glyph: 'bird', word: 'Chirp', jewel: '#58B0F6', place: '124 Street', date: '13 Sep', quest: 'Count 5 birds before you get home.' },
  { page: 0, glyph: 'door', word: 'Doors', jewel: '#DA82ED', place: 'Paul Kane Park', date: '20 Sep', quest: 'Spot three doors in three different colours.' },
  { page: 1, glyph: 'wave', word: 'River', jewel: '#4CBFE9', place: 'Accidental Beach', date: '27 Sep', quest: 'Listen to the river for one whole minute.' },
  { page: 1, glyph: 'tree', word: 'Tall Tree', jewel: '#93DC5E', place: 'Hawrelak Park', date: '4 Oct', quest: 'Find the tallest tree you can see from the path.' },
  { page: 2, glyph: 'pumpkin', word: 'Pumpkin', jewel: '#FA7423', place: 'Whyte Ave', date: '12 Oct', quest: 'Find 3 pumpkins on one block.' },
  { page: 2, glyph: 'ghost', word: 'Boo', jewel: '#C9C6D3', place: 'Old Strathcona', date: '19 Oct', quest: 'Spot a ghost in a window.' },
];

const QUESTS = [
  { text: 'Find 3 orange things.', glyph: 'sun', word: 'Orange', jewel: '#ED8D00' },
  { text: 'Spot a door that looks like it has a face.', glyph: 'smile', word: 'Face', jewel: '#DA82ED' },
  { text: 'Count 5 birds before you get home.', glyph: 'bird', word: 'Five Birds', jewel: '#58B0F6' },
  { text: 'Find a leaf bigger than your hand.', glyph: 'leaf', word: 'Big Leaf', jewel: '#93DC5E' },
  { text: 'Find a star shape somewhere on your street.', glyph: 'star', word: 'Star', jewel: '#DEC523' },
  { text: 'Wave hello to the friendliest tree you see.', glyph: 'tree', word: 'Hello Tree', jewel: '#00CD9D' },
  { text: 'Find something shaped like a heart.', glyph: 'heart', word: 'Heart', jewel: '#FF4F79' },
  { text: 'Spot the moon, or a picture of one.', glyph: 'moon', word: 'Moon', jewel: '#9883F8' },
];

const GLYPHS = {
  leaf: 'M12 28 C12 16 20 10 30 10 C30 22 24 28 12 28 Z M12 28 L24 16',
  bird: 'M6 22 q6 -7 12 0 q6 -7 12 0 M22 13 q3 -3 6 0 q3 -3 6 0',
  door: 'M13 32 V15 a7 7 0 0 1 14 0 V32 Z M23 24 h0.1',
  wave: 'M6 16 q4 -5 8 0 t8 0 t8 0 t8 0 M6 25 q4 -5 8 0 t8 0 t8 0 t8 0',
  tree: 'M20 33 V24 M20 7 l10 17 h-20 Z',
  pumpkin: 'M20 13 q-13 0 -13 10 q0 10 13 10 q13 0 13 -10 q0 -10 -13 -10 Z M20 13 q-5 10 0 20 M20 13 q5 10 0 20 M20 13 q1 -5 5 -6',
  ghost: 'M12 33 V18 a8 8 0 0 1 16 0 V33 l-4 -3 l-4 3 l-4 -3 Z M17 19 h0.1 M23 19 h0.1',
  sun: 'M20 14 a6 6 0 1 0 0.1 0 Z M20 4 v4 M20 32 v4 M4 20 h4 M32 20 h4 M9 9 l3 3 M28 28 l3 3 M31 9 l-3 3 M12 28 l-3 3',
  smile: 'M20 7 a13 13 0 1 0 0.1 0 Z M15 17 h0.1 M25 17 h0.1 M14 24 q6 6 12 0',
  star: 'M20 6 l4 9 l10 1 l-7.5 6.5 l2.5 9.5 l-9 -5 l-9 5 l2.5 -9.5 l-7.5 -6.5 l10 -1 Z',
  heart: 'M20 31 C8 23 8 12 15 12 C18 12 20 15 20 15 C20 15 22 12 25 12 C32 12 32 23 20 31 Z',
  moon: 'M24 8 a12 12 0 1 0 8 20 a10 10 0 0 1 -8 -20 Z',
};

export default function run(k) {
  const { h } = k;
  css(k);
  let page = 0;
  let queue = k.shuffle(QUESTS);

  function load() {
    try { const v = JSON.parse(localStorage.getItem(STORE) || 'null'); if (Array.isArray(v)) return v.map(stamp); } catch (e) { /* fall back */ }
    return START.map((s, i) => ({ ...s, slot: START.filter((x, j) => j < i && x.page === s.page).length }));
  }
  // Older saved stickers had no stamp: give them a place, a date and a quest.
  function stamp(s) {
    if (s.place && s.date) return s;
    const seed = START.find((x) => x.page === s.page && x.word === s.word);
    const q = QUESTS.find((x) => x.word === s.word);
    return { ...s, place: seed?.place || spot(s.page), date: seed?.date || today(), quest: seed?.quest || q?.text || '' };
  }
  let stickers = [];
  stickers = load();
  function save() { try { localStorage.setItem(STORE, JSON.stringify(stickers)); } catch (e) { /* demo still works */ } }
  const total = PAGES.length * SLOTS;
  function today() { return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).replace('.', ''); }
  // A pretend nearby spot on that page, preferring one not stamped yet.
  function spot(pg) {
    const used = stickers.filter((x) => x.page === pg).map((x) => x.place);
    const free = PAGES[pg].spots.filter((p) => !used.includes(p));
    return k.pick(free.length ? free : PAGES[pg].spots);
  }

  render();

  function render(fresh) {
    const p = PAGES[page];
    const onPage = stickers.filter((s) => s.page === page);
    const grid = h('div', { class: 'sb-grid' }, Array.from({ length: SLOTS }, (_, i) => {
      const s = onPage.find((x) => x.slot === i);
      const isNew = s && fresh && s === fresh;
      return s
        ? h('button', { class: `sb-slot got${isNew ? ' sb-new' : ''}`, style: `--sj:${s.jewel}`, 'aria-label': `${s.word}, ${TEXT.stampLine(s)}`, onclick: () => postcard(s) },
          sticker(s),
          h('span', { class: 'sb-stamp' }, h('b', {}, s.place), h('i', {}, s.date)))
        : h('button', { class: 'sb-slot sb-open', 'aria-label': TEXT.emptyAria, onclick: quest },
          h('span', { class: 'sb-empty' }, '+'),
          h('span', { class: 'sb-invite' }, TEXT.emptyLbl));
    }));

    const spread = h('div', { class: 'sb-book' },
      h('div', { class: 'sb-head' },
        h('button', { class: 'sb-arrow', 'aria-label': TEXT.prev, disabled: page === 0, onclick: () => turn(-1) }, '‹'),
        h('div', { class: 'sb-title' }, h('span', {}, p.note), h('b', {}, p.name)),
        h('button', { class: 'sb-arrow', 'aria-label': TEXT.next, disabled: page === PAGES.length - 1, onclick: () => turn(1) }, '›')),
      grid,
      h('div', { class: 'sb-dots' }, PAGES.map((_, i) => h('i', { class: i === page ? 'on' : '' }))));
    swipe(spread);

    const full = stickers.length >= total;
    k.show(
      k.bar(TEXT.of(stickers.length, total)),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      h('p', { class: 'sub' }, h('b', { class: 'sb-count' }, TEXT.of(stickers.length, total)), ` ${TEXT.collected}`),
      spread,
      h('p', { class: 'hint centre' }, TEXT.swipe),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', disabled: full, onclick: quest }, full ? TEXT.full : TEXT.finish)));
  }

  function turn(d) {
    const n = Math.max(0, Math.min(PAGES.length - 1, page + d));
    if (n !== page) { page = n; render(); }
  }

  function swipe(el) {
    let x0 = null;
    el.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    el.addEventListener('pointerup', (e) => {
      if (x0 == null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) turn(dx < 0 ? 1 : -1);
    });
  }

  function quest() {
    if (!queue.length) queue = k.shuffle(QUESTS);
    const q = queue.pop();
    k.openSheet([
      h('div', { class: 'frame sb-quest', style: `--jewel:${q.jewel}` },
        h('p', { class: 'kicker' }, TEXT.questKicker),
        h('p', { class: 'big' }, q.text)),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => { k.closeSheet(); earn(q); } }, TEXT.done),
        h('button', { class: 'link', onclick: k.closeSheet }, TEXT.notNow)),
    ], null, q.jewel);
  }

  // Next empty slot: this page first, then any page with room.
  function earn(q) {
    const order = [page, ...PAGES.map((_, i) => i).filter((i) => i !== page)];
    for (const pg of order) {
      const used = stickers.filter((s) => s.page === pg).map((s) => s.slot);
      const slot = Array.from({ length: SLOTS }, (_, i) => i).find((i) => !used.includes(i));
      if (slot == null) continue;
      const s = { page: pg, slot, glyph: q.glyph, word: q.word, jewel: q.jewel, place: spot(pg), date: today(), quest: q.text };
      stickers.push(s); save();
      page = pg;
      render(s);
      const t = setTimeout(() => payoff(s), 1300);
      k.onLeave(() => clearTimeout(t));
      return;
    }
  }

  function payoff(s) {
    const full = stickers.length >= total;
    k.openSheet([
      h('div', { class: 'celebrate' },
        h('div', { class: 'sb-hero' }, sticker(s)),
        h('p', { class: 'kicker' }, TEXT.newKicker),
        h('h3', {}, TEXT.newTitle(s.word)),
        h('p', { class: 'sb-pay-stamp' }, TEXT.stampLine(s)),
        h('p', { class: 'more' }, full ? TEXT.fullMore : TEXT.newMore(stickers.length, total))),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: k.closeSheet }, TEXT.keep),
        full ? h('button', { class: 'link', onclick: reset }, TEXT.reset) : h('button', { class: 'link', onclick: k.home }, TEXT.back)),
    ], null, s.jewel);
  }

  function reset() {
    try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ }
    stickers = load(); page = 0;
    render();
    k.toast(TEXT.resetDone);
  }

  // The sticker's postcard: where, when, and the quest that earned it.
  function postcard(s) {
    const pg = PAGES[s.page];
    k.openSheet([
      h('div', { class: 'sb-card', style: `--sj:${s.jewel}` },
        h('div', { class: 'sb-card-top' },
          h('div', {}, h('p', { class: 'sb-greet' }, TEXT.pcGreet), h('p', { class: 'sb-place' }, s.place)),
          h('div', { class: 'sb-postmark', 'aria-hidden': 'true' }, h('b', {}, s.date), h('span', {}, pg.name))),
        h('div', { class: 'sb-card-body' },
          h('div', { class: 'sb-card-st' }, sticker(s)),
          h('div', { class: 'sb-card-txt' },
            h('p', { class: 'sb-earned' }, TEXT.pcEarned),
            h('p', { class: 'sb-quest-txt' }, s.quest || '—'),
            h('p', { class: 'sb-wren' }, TEXT.pcWren))),
        h('p', { class: 'sb-from' }, TEXT.pcFrom)),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: k.closeSheet }, TEXT.pcBack)),
    ], null, s.jewel);
  }

  // Round die-cut sticker: pearl edge, jewel face, glyph and a word.
  function sticker(s) {
    return h('svg', { class: 'sb-sticker', viewBox: '0 0 100 100', style: `--sj:${s.jewel}`, 'aria-label': s.word, role: 'img' },
      h('circle', { cx: 50, cy: 50, r: 48, class: 'sb-edge' }),
      h('circle', { cx: 50, cy: 50, r: 42, class: 'sb-face' }),
      h('circle', { cx: 50, cy: 50, r: 36, class: 'sb-ring' }),
      h('path', { d: 'M22 34 a32 32 0 0 1 30 -26', class: 'sb-shine' }),
      h('g', { transform: 'translate(30 16)' }, h('path', { d: GLYPHS[s.glyph] || GLYPHS.star, class: 'sb-glyph' })),
      h('text', { x: 50, y: 74, 'text-anchor': 'middle', class: 'sb-text' }, s.word.toUpperCase()));
  }
}

function css(k) {
  k.css('sticker-book', `
.sb-count { font: 600 22px/1 var(--f-head); color: var(--jewel); }
.sb-book { margin-top: 16px; border-radius: 14px; padding: 14px 12px 12px; background: color-mix(in srgb, var(--jewel) 10%, var(--velvet)); border: 1px solid var(--line);
  box-shadow: inset 0 0 0 5px var(--velvet), inset 0 0 0 6px color-mix(in srgb, var(--jewel) 35%, transparent); touch-action: pan-y; user-select: none; -webkit-user-select: none; overflow-x: clip; }
.sb-head { display: flex; align-items: center; gap: 8px; }
.sb-arrow { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--line); background: var(--midnight); font-size: 22px; line-height: 1; color: var(--starlight); flex: 0 0 auto; padding: 0 0 3px; }
.sb-arrow[disabled] { opacity: 0.3; cursor: default; }
.sb-title { flex: 1; text-align: center; display: flex; flex-direction: column; min-width: 0; }
.sb-title span { font: 700 10.5px/1.3 var(--f-body); letter-spacing: 0.16em; text-transform: uppercase; color: var(--glow); }
.sb-title b { font: 600 24px/1.05 var(--f-head); color: var(--starlight); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px 8px; margin-top: 14px; }
.sb-slot { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; border: 0; background: none; padding: 0; min-width: 0; min-height: 44px; color: inherit; }
.sb-empty { width: 86%; aspect-ratio: 1; border-radius: 50%; border: 2px dashed var(--line); display: grid; place-items: center; font: 400 26px/1 var(--f-head); color: var(--lilac); transition: border-color 0.2s; }
.sb-open:hover .sb-empty, .sb-open:focus-visible .sb-empty { border-color: var(--jewel); color: var(--jewel); }
.sb-invite { font: italic 500 11px/1.15 var(--f-head); color: var(--lilac); text-align: center; }
.sb-stamp { max-width: 100%; display: flex; flex-direction: column; align-items: center; padding: 2px 4px; border: 1.2px solid color-mix(in srgb, var(--sj, var(--jewel)) 70%, var(--starlight));
  border-radius: 3px; rotate: -3deg; color: color-mix(in srgb, var(--jewel) 55%, var(--starlight)); opacity: 0.9; }
.sb-slot:nth-child(even) .sb-stamp { rotate: 3deg; }
.sb-stamp b { font: 800 8px/1.2 var(--f-body); letter-spacing: 0.06em; text-transform: uppercase; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-stamp i { font: italic 600 10px/1.1 var(--f-head); }
.sb-pay-stamp { display: inline-block; margin: 10px 0 0; padding: 4px 10px; border: 1.5px dashed var(--jewel); border-radius: 4px; rotate: -2deg;
  font: 800 11px/1.3 var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--jewel); }
.sb-card { background: var(--pearl); color: var(--midnight); border-radius: 6px; padding: 16px; rotate: -1deg; box-shadow: 0 18px 40px rgba(11, 6, 32, 0.5);
  animation: land 0.55s cubic-bezier(0.2, 1.3, 0.4, 1) both; border-top: 6px solid var(--sj); position: relative; }
.sb-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.sb-greet { margin: 0; font: 700 10.5px/1.2 var(--f-body); letter-spacing: 0.16em; text-transform: uppercase; color: #46337e; }
.sb-place { margin: 2px 0 0; font: 600 28px/1.02 var(--f-head); color: var(--midnight); overflow-wrap: anywhere; }
.sb-postmark { width: 72px; height: 72px; flex: 0 0 auto; border-radius: 50%; border: 2px solid color-mix(in srgb, var(--sj) 70%, #1a0b3d); display: flex; flex-direction: column;
  align-items: center; justify-content: center; rotate: 12deg; color: color-mix(in srgb, var(--sj) 60%, #1a0b3d); text-align: center; padding: 6px; box-shadow: inset 0 0 0 4px var(--pearl), inset 0 0 0 5px color-mix(in srgb, var(--sj) 50%, transparent); }
.sb-postmark b { font: 600 15px/1 var(--f-head); }
.sb-postmark span { font: 800 7.5px/1.15 var(--f-body); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 3px; }
.sb-card-body { display: flex; gap: 14px; align-items: center; margin-top: 12px; border-top: 1.5px dashed color-mix(in srgb, #46337e 30%, transparent); padding-top: 12px; }
.sb-card-st { width: 96px; flex: 0 0 auto; }
.sb-card-st .sb-sticker { rotate: -8deg; }
.sb-card-txt { min-width: 0; }
.sb-earned { margin: 0; font: 700 10.5px/1.2 var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; color: #46337e; }
.sb-quest-txt { margin: 3px 0 0; font: 600 18px/1.2 var(--f-head); color: var(--midnight); text-wrap: pretty; }
.sb-wren { margin: 8px 0 0; font: italic 500 14px/1.3 var(--f-head); color: #46337e; }
.sb-from { margin: 12px 0 0; text-align: right; font: 700 9.5px/1.2 var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; color: color-mix(in srgb, #46337e 70%, transparent); }
.sb-sticker { width: 100%; display: block; filter: drop-shadow(0 3px 4px rgba(11, 6, 32, 0.5)); }
.sb-slot.got .sb-sticker { rotate: -5deg; width: 92%; }
.sb-slot.got:nth-child(even) .sb-sticker { rotate: 6deg; }
.sb-edge { fill: var(--pearl); }
.sb-face { fill: var(--sj); }
.sb-ring { fill: none; stroke: var(--midnight); stroke-opacity: 0.25; stroke-width: 1.2; stroke-dasharray: 2 3; }
.sb-shine { fill: none; stroke: var(--starlight); stroke-opacity: 0.55; stroke-width: 3; stroke-linecap: round; }
.sb-glyph { fill: none; stroke: var(--midnight); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.sb-text { font: 800 9.5px var(--f-body); letter-spacing: 0.06em; fill: var(--midnight); }
.sb-new .sb-sticker { animation: sb-peel 1.1s cubic-bezier(0.2, 1.1, 0.35, 1) both; }
@keyframes sb-peel {
  0% { transform: translate(0, -110px) rotate(-35deg) scale(1.6); opacity: 0; clip-path: polygon(0 0, 0 0, 0 0, 0 0); filter: drop-shadow(0 30px 18px rgba(11, 6, 32, 0.6)); }
  25% { opacity: 1; clip-path: polygon(0 0, 100% 0, 100% 0, 0 100%); }
  55% { transform: translate(0, -8px) rotate(8deg) scale(1.12); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); filter: drop-shadow(0 14px 10px rgba(11, 6, 32, 0.5)); }
  75% { transform: translate(0, 0) rotate(-4deg) scale(0.94); }
  100% { transform: none; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); filter: drop-shadow(0 3px 4px rgba(11, 6, 32, 0.5)); }
}
.sb-new::after { content: ""; position: absolute; inset: -10% -10% auto; aspect-ratio: 1; border-radius: 50%; pointer-events: none; animation: sb-burst 0.9s 0.5s ease-out both;
  box-shadow: 0 0 0 3px var(--jewel); opacity: 0; }
@keyframes sb-burst { 0% { opacity: 0.9; transform: scale(0.7); } 100% { opacity: 0; transform: scale(1.5); } }
.sb-dots { display: flex; justify-content: center; gap: 8px; margin-top: 12px; }
.sb-dots i { width: 8px; height: 8px; border-radius: 50%; background: var(--line); }
.sb-dots i.on { background: var(--jewel); }
.sb-quest .big { font-size: 30px; }
.sb-hero { width: 140px; margin: 0 auto 12px; animation: land 0.6s cubic-bezier(0.2, 1.3, 0.4, 1) both; }
.sb-hero .sb-sticker { rotate: -6deg; filter: drop-shadow(0 12px 24px rgba(11, 6, 32, 0.6)); }
`);
}
