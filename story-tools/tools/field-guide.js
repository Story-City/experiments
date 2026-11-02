// Field Guide: a little naturalist's book of the "creatures" on your street.
// Critterpedia-style: every category has a fixed page of slots. Found ones are filled,
// unfound ones wait as dark silhouettes with a teasing hint. No streaks, no guilt.

const TEXT = {
  kicker: 'Volume one · Society field notes',
  title: 'Creatures of My Street',
  sub: 'Every page has room for six. The dark ones are still out there.',
  all: 'All',
  cats: ['Faces', 'Grumpy Doors', 'Suspicious Objects', 'Tiny Monsters'],
  tempers: ['friendly', 'grumpy', 'shy', 'mischievous'],
  progress: (cat, n, t) => `${cat} ${n} of ${t}`,
  found: (n, t) => `${n} of ${t} found`,
  unknown: '???',
  extra: 'Extra specimens',
  newEntry: 'New Entry',
  // silhouette sheet
  hintKicker: 'Not catalogued yet',
  hintMore: 'Wren has heard rumours. Keep an eye out on your next walk.',
  findIt: 'I Found One',
  notYet: 'Not yet',
  // snap
  snapKicker: 'New entry',
  snapTitle: 'Spot something with a personality.',
  snapSub: 'A face in a fence, a door in a bad mood, a very suspicious bin. Things only, not people.',
  snapFor: (hint) => `Wren’s tip: it ${hint}.`,
  snap: 'Snap the Specimen',
  // face step
  faceKicker: 'Optional · Give it a face',
  faceTitle: 'Does it need eyes?',
  faceHint: 'Tap a sticker to add it. Drag to move. Tap a placed one to peel it off.',
  stickers: { eyesBig: 'Big eyes', eyesSmall: 'Small eyes', smile: 'Smile', grumpy: 'Grumpy mouth' },
  faceDone: 'Keep This Face',
  faceSkip: 'Skip, it’s fine as it is',
  // form
  formKicker: (no) => `Specimen ${no}`,
  formTitle: 'Write its entry.',
  cat: 'Category',
  name: 'Name',
  namePh: 'Sir Grumbleton',
  habitat: 'Habitat',
  habitatPh: 'Lurks by the blue mailbox',
  temper: 'Temperament',
  add: 'Add to the Guide',
  habitatLbl: 'Habitat',
  temperLbl: 'Temperament',
  noteLbl: 'Wren’s note',
  sign: '— W.',
  // payoff
  payKicker: 'A new specimen',
  payMore: 'Kept forever, right here on this phone.',
  keep: 'Back to the Guide',
  another: 'Find Another',
  close: 'Close',
};

// Wren's handwritten notes, by temperament. One is picked when a find is saved.
const NOTES = {
  friendly: ['Waved at me, I’m almost sure. Say hi next time you pass.', 'Kind face. The Society approves.', 'Would trust it with a secret. A small one.'],
  grumpy: ['Grumpy, but loyal. Visit it again sometime.', 'Do not mention the weather to this one.', 'It frowned at me. I frowned back. We understand each other.'],
  shy: ['Only shows its face in the right light. Lucky you.', 'Walk past slowly. It hates a fuss.', 'Blink and it’s just a wall again.'],
  mischievous: ['Definitely up to something. Keep watching.', 'I think it moved when I looked away.', 'Knows more than it lets on. Classic agent.'],
};

const STORE = 'st-field-guide';
const SLOTS = 6;            // fixed slots per category page

// The unfound ones: a silhouette shape and a teasing hint for each slot.
const SPECIES = {
  'Faces': ['lives near drainpipes', 'peeks out through fence slats', 'hides in old tree bark', 'smiles up from a drain cover', 'is two windows and a door mouth', 'sits very still on a bike rack'],
  'Grumpy Doors': ['frowns at the mail carrier', 'has a knocker for a nose', 'is painted a very cross red', 'sags at one corner, sulking', 'refuses to open on Mondays', 'glares from behind a screen door'],
  'Suspicious Objects': ['pretends to be a hydrant', 'is a bin that seems to listen', 'is a cone left somewhere odd', 'is a mailbox full of secrets', 'is a lamp post that blinks twice', 'is a bench that saves seats'],
  'Tiny Monsters': ['lives in a crack in the sidewalk', 'is a pinecone with too many legs', 'is a puddle that stares back', 'is a patch of moss that waves', 'is a blob of gum with opinions', 'is a leaf pile that breathes'],
};
const SHAPE = { 'Faces': 'face', 'Grumpy Doors': 'door', 'Suspicious Objects': 'hydrant', 'Tiny Monsters': 'blob' };

// Two pretend entries, drawn rather than photographed.
const SEEDS = [
  { no: 1, name: 'Sir Grumbleton', cat: 'Grumpy Doors', habitat: 'A blue door on a quiet corner of 104th Street', temper: 'grumpy', art: 'door', note: 'Grumpy, but loyal. Visit it again sometime.' },
  { no: 2, name: 'Agent Hydrant', cat: 'Suspicious Objects', habitat: 'Pretends to be a hydrant outside the library', temper: 'mischievous', art: 'hydrant', note: 'Definitely up to something. Keep watching.' },
];

/* ---------- a tiny sticker tray (a pared-down copy of Face-Finder's idea) ---------- */
const INK = '#0b0620', WHITE = '#fbf7ff', PINK = '#FF4F79';
const STICKERS = {
  eyesBig: { vb: [120, 60], w: 0.36, draw: (h) => [eye(h, 30, 30, 26), eye(h, 90, 30, 26)] },
  eyesSmall: { vb: [120, 60], w: 0.2, draw: (h) => [eye(h, 30, 30, 24), eye(h, 90, 30, 24)] },
  smile: { vb: [100, 56], w: 0.28, draw: (h) => [
    h('path', { d: 'M8 10 Q50 66 92 10 Q50 30 8 10 Z', fill: INK, stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }),
    h('ellipse', { cx: 50, cy: 38, rx: 14, ry: 7, fill: PINK })] },
  grumpy: { vb: [100, 44], w: 0.26, draw: (h) => [
    h('path', { d: 'M12 38 Q50 2 88 38', fill: 'none', stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' })] },
};
function eye(h, cx, cy, r) {
  const a = Math.random() * Math.PI * 2, d = r * (0.25 + Math.random() * 0.25);
  return h('g', {},
    h('circle', { cx, cy, r, fill: WHITE, stroke: INK, 'stroke-width': 3 }),
    h('circle', { cx: cx + Math.cos(a) * d, cy: cy + Math.sin(a) * d, r: r * 0.42, fill: INK }),
    h('circle', { cx: cx + Math.cos(a) * d - r * 0.12, cy: cy + Math.sin(a) * d - r * 0.14, r: r * 0.1, fill: WHITE }));
}

export default function run(k) {
  const { h } = k;
  css(k);
  let filter = TEXT.all;

  function load() {
    try { const v = JSON.parse(localStorage.getItem(STORE) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  }
  function keep(list) {
    try { localStorage.setItem(STORE, JSON.stringify(list)); return true; } catch (e) { return false; }
  }
  const all = () => [...SEEDS, ...load()];
  const num = (n) => `No. ${String(n).padStart(3, '0')}`;
  const inCat = (cat) => all().filter((e) => e.cat === cat);
  const totalFound = () => TEXT.cats.reduce((n, c) => n + Math.min(SLOTS, inCat(c).length), 0);
  const nextNo = () => SEEDS.length + load().length + 1;
  book();

  /* ---------- the book ---------- */
  function book(fresh) {
    const cats = filter === TEXT.all ? TEXT.cats : [filter];
    k.show(
      k.bar(TEXT.found(totalFound(), TEXT.cats.length * SLOTS)),
      h('div', { class: 'fg-book' },
        h('div', { class: 'fg-page' },
          h('p', { class: 'fg-kick' }, TEXT.kicker),
          h('h1', { class: 'fg-title' }, TEXT.title),
          h('p', { class: 'fg-sub' }, TEXT.sub),
          h('div', { class: 'fg-chips' }, [TEXT.all, ...TEXT.cats].map((c) =>
            h('button', { class: 'fg-chip', 'aria-pressed': String(c === filter), onclick: () => { filter = c; book(); } }, c))),
          cats.map((c) => section(c, fresh)))),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: () => snap() }, TEXT.newEntry)));
  }

  // One category page: N fixed slots, then any extras beyond the page.
  function section(cat, fresh) {
    const found = inCat(cat);
    const n = Math.min(SLOTS, found.length);
    return h('section', { class: 'fg-sec' },
      h('div', { class: 'fg-sec-head' },
        h('h2', {}, cat),
        h('span', { class: 'fg-meter', 'aria-label': TEXT.progress(cat, n, SLOTS) },
          h('b', {}, TEXT.progress('', n, SLOTS).trim()),
          h('i', { style: `--p:${n / SLOTS}` }))),
      h('div', { class: 'fg-grid' }, Array.from({ length: SLOTS }, (_, i) =>
        found[i] ? card(found[i], found[i].no === fresh) : silhouette(cat, i))),
      found.length > SLOTS
        ? [h('p', { class: 'fg-extra' }, TEXT.extra), h('div', { class: 'fg-grid' }, found.slice(SLOTS).map((e) => card(e, e.no === fresh)))]
        : null);
  }

  function card(e, fresh) {
    return h('button', { class: `fg-card${fresh ? ' fresh' : ''}`, onclick: () => detail(e) },
      art(e),
      h('span', { class: 'fg-no' }, num(e.no)),
      h('span', { class: 'fg-name' }, e.name));
  }

  // An unfound slot: dark shape, ??? and a hint. Tapping it starts a hunt for that one.
  function silhouette(cat, i) {
    const hint = SPECIES[cat][i];
    return h('button', { class: 'fg-card fg-sil', 'aria-label': `${TEXT.unknown} ${hint}`, onclick: () => rumour(cat, hint) },
      h('div', { class: 'fg-img fg-shade' }, shadow(SHAPE[cat])),
      h('span', { class: 'fg-no' }, TEXT.unknown),
      h('span', { class: 'fg-hint' }, hint));
  }

  function rumour(cat, hint) {
    k.openSheet([
      h('div', { class: 'fg-spec fg-spec-dark' },
        h('div', { class: 'fg-img fg-shade' }, shadow(SHAPE[cat])),
        h('p', { class: 'fg-no' }, `${TEXT.hintKicker} · ${cat}`),
        h('h3', { class: 'fg-spec-name' }, TEXT.unknown),
        h('p', { class: 'fg-note' }, `It ${hint}.`)),
      h('p', { class: 'more centre' }, TEXT.hintMore),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => snap(cat, hint) }, TEXT.findIt),
        h('button', { class: 'link', onclick: k.closeSheet }, TEXT.notYet)),
    ], null, k.tool.jewel);
  }

  function art(e) {
    if (e.img) return h('img', { class: 'fg-img', src: e.img, alt: '' });
    return h('div', { class: 'fg-img fg-drawn' }, e.art === 'door' ? doorSvg() : hydrantSvg());
  }

  // A specimen page in the sheet, with Wren's handwritten note.
  function specimen(e) {
    return h('div', { class: 'fg-spec' },
      art(e),
      h('p', { class: 'fg-no' }, `${num(e.no)} · ${e.cat}`),
      h('h3', { class: 'fg-spec-name' }, e.name),
      h('dl', {},
        h('dt', {}, TEXT.habitatLbl), h('dd', {}, e.habitat || '—'),
        h('dt', {}, TEXT.temperLbl), h('dd', {}, e.temper || '—')),
      e.note ? h('p', { class: 'fg-note', 'aria-label': TEXT.noteLbl }, e.note, h('span', {}, TEXT.sign)) : null);
  }

  function detail(e) {
    k.openSheet([specimen(e), h('div', { class: 'btns' }, h('button', { class: 'link', onclick: k.closeSheet }, TEXT.close))], null, k.tool.jewel);
  }

  /* ---------- new entry: snap, (optional) face, then write ---------- */
  function snap(cat, hint) {
    k.show(
      k.bar(num(nextNo())),
      h('p', { class: 'kicker' }, TEXT.snapKicker),
      h('h1', { class: 'display' }, TEXT.snapTitle),
      h('p', { class: 'sub' }, TEXT.snapSub),
      hint ? h('p', { class: 'fg-tip' }, TEXT.snapFor(hint)) : null,
      h('div', { class: 'spacer' }),
      k.camera(TEXT.snap, async (url) => {
        try { face(await k.loadImage(url), cat); } catch (e) { write(null, cat); }
      }));
  }

  // Optional step: stick on eyes or a mouth, baked into the saved picture.
  function face(img, cat) {
    const photo = fit(img, 520);
    const placed = [];
    const stage = h('div', { class: 'fg-stage' }, photo);

    function add(id) {
      const s = STICKERS[id];
      const svg = h('svg', { viewBox: `0 0 ${s.vb[0]} ${s.vb[1]}` }, s.draw(h));
      const el = h('div', { class: 'fg-st', role: 'button', 'aria-label': TEXT.stickers[id], style: `width:${s.w * 100}%` }, svg);
      const it = { id, x: 0.5 + (Math.random() - 0.5) * 0.12, y: 0.42 + (Math.random() - 0.5) * 0.12, el, svg };
      place(it); grab(it, stage, placed); placed.push(it); stage.append(el);
    }
    const place = (it) => { it.el.style.left = `${it.x * 100}%`; it.el.style.top = `${it.y * 100}%`; };
    function grab(it) {
      let start = null, moved = false;
      it.el.addEventListener('pointerdown', (e) => {
        e.stopPropagation(); it.el.setPointerCapture?.(e.pointerId);
        start = { cx: e.clientX, cy: e.clientY, x: it.x, y: it.y }; moved = false; stage.append(it.el);
      });
      it.el.addEventListener('pointermove', (e) => {
        if (!start) return;
        const r = stage.getBoundingClientRect(), dx = e.clientX - start.cx, dy = e.clientY - start.cy;
        if (Math.hypot(dx, dy) > 6) moved = true;
        it.x = Math.min(1, Math.max(0, start.x + dx / r.width));
        it.y = Math.min(1, Math.max(0, start.y + dy / r.height));
        place(it);
      });
      it.el.addEventListener('pointerup', () => {
        if (start && !moved) { it.el.remove(); placed.splice(placed.indexOf(it), 1); }
        start = null;
      });
      it.el.addEventListener('pointercancel', () => { start = null; });
    }

    const tray = h('div', { class: 'fg-tray' }, Object.keys(STICKERS).map((id) => {
      const s = STICKERS[id];
      return h('button', { 'aria-label': TEXT.stickers[id], title: TEXT.stickers[id], onclick: () => add(id) },
        h('svg', { viewBox: `0 0 ${s.vb[0]} ${s.vb[1]}` }, s.draw(h)));
    }));

    k.show(
      k.bar(num(nextNo())),
      h('p', { class: 'kicker' }, TEXT.faceKicker),
      h('h1', { class: 'display fg-h' }, TEXT.faceTitle),
      h('p', { class: 'hint' }, TEXT.faceHint),
      stage,
      tray,
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: async () => write(shrink(await bake(photo, placed)), cat, placed.length > 0) }, TEXT.faceDone),
        h('button', { class: 'link', onclick: () => write(shrink(photo), cat, false) }, TEXT.faceSkip)));
  }

  function write(img, preCat, hasFace) {
    const no = nextNo();
    const cat = h('select', { id: 'fgCat' }, TEXT.cats.map((c) => h('option', { value: c, selected: c === (preCat || (hasFace ? 'Faces' : null)) }, c)));
    const name = h('input', { id: 'fgName', maxlength: 40, placeholder: TEXT.namePh, autocomplete: 'off' });
    const hab = h('input', { id: 'fgHab', maxlength: 70, placeholder: TEXT.habitatPh, autocomplete: 'off' });
    const temper = h('select', { id: 'fgTemper' }, TEXT.tempers.map((t) => h('option', { value: t }, t)));
    const add = h('button', { class: 'btn jewel', disabled: true, onclick: () => save() }, TEXT.add);
    name.addEventListener('input', () => { add.disabled = !name.value.trim(); });

    k.show(
      k.bar(num(no)),
      h('div', { class: 'fg-top' },
        img ? h('img', { class: 'fg-thumb', src: img, alt: '' }) : h('div', { class: 'fg-thumb fg-drawn' }, hydrantSvg()),
        h('div', {}, h('p', { class: 'kicker' }, TEXT.formKicker(num(no))), h('h1', { class: 'display fg-h' }, TEXT.formTitle))),
      h('div', { class: 'fg-form' },
        field(TEXT.cat, cat), field(TEXT.name, name), field(TEXT.habitat, hab), field(TEXT.temper, temper)),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, add));

    function save() {
      const entry = { no, name: name.value.trim(), cat: cat.value, habitat: hab.value.trim(), temper: temper.value,
        img, note: k.pick(NOTES[temper.value] || NOTES.friendly), face: !!hasFace };
      if (!img) entry.art = 'hydrant';
      const list = load(); list.push(entry);
      if (!keep(list)) { entry.img = null; entry.art = 'hydrant'; keep(list.map((e) => (e.no === no ? entry : e))); }
      filter = TEXT.all;
      book(no);
      const n = Math.min(SLOTS, inCat(entry.cat).length);
      k.openSheet([
        h('p', { class: 'kicker centre' }, TEXT.payKicker),
        specimen({ ...entry, img: img || entry.img }),
        h('p', { class: 'fg-pay-count' }, TEXT.progress(entry.cat, n, SLOTS)),
        h('p', { class: 'more centre' }, TEXT.payMore),
        h('div', { class: 'btns' },
          h('button', { class: 'btn jewel', onclick: k.closeSheet }, TEXT.keep),
          h('button', { class: 'link', onclick: () => snap() }, TEXT.another)),
      ], null, k.tool.jewel);
    }
  }

  function field(label, el) {
    return h('label', { class: 'fg-field' }, h('span', {}, label), el);
  }

  /* ---------- drawing ---------- */
  function fit(img, max) {
    const s = Math.min(1, max / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
    const c = document.createElement('canvas');
    c.width = Math.round((img.naturalWidth || img.width) * s); c.height = Math.round((img.naturalHeight || img.height) * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  }

  // Flatten the photo and the stickers onto one canvas.
  async function bake(photo, placed) {
    const c = document.createElement('canvas');
    c.width = photo.width; c.height = photo.height;
    const x = c.getContext('2d');
    x.drawImage(photo, 0, 0);
    for (const it of placed) {
      const s = STICKERS[it.id];
      const w = s.w * c.width, hgt = w * (s.vb[1] / s.vb[0]);
      const svg = it.svg.cloneNode(true);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', Math.round(w)); svg.setAttribute('height', Math.round(hgt));
      const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
      const img = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
      if (img) x.drawImage(img, it.x * c.width - w / 2, it.y * c.height - hgt / 2, w, hgt);
    }
    return c;
  }

  // Downscale to a small JPEG so localStorage stays happy.
  function shrink(canvas) {
    try {
      const s = Math.min(1, 260 / Math.max(canvas.width, canvas.height));
      const c = document.createElement('canvas');
      c.width = Math.round(canvas.width * s); c.height = Math.round(canvas.height * s);
      c.getContext('2d').drawImage(canvas, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', 0.72);
    } catch (e) { return null; }
  }

  // Dark silhouettes for unfound slots.
  function shadow(kind) {
    const s = { class: 'fg-shape' };
    const parts = {
      face: [h('circle', { ...s, cx: 50, cy: 52, r: 30 }), h('rect', { ...s, x: 44, y: 14, width: 12, height: 10, rx: 3 })],
      door: [h('path', { ...s, d: 'M28 92 V38 a22 22 0 0 1 44 0 V92 Z' })],
      hydrant: [h('rect', { ...s, x: 34, y: 40, width: 32, height: 46, rx: 5 }), h('path', { ...s, d: 'M32 42 a18 15 0 0 1 36 0 Z' }),
        h('rect', { ...s, x: 24, y: 54, width: 12, height: 10, rx: 3 }), h('rect', { ...s, x: 64, y: 54, width: 12, height: 10, rx: 3 })],
      blob: [h('path', { ...s, d: 'M22 78 C14 56 30 30 52 32 C74 34 86 54 78 76 C74 86 62 84 58 78 C54 86 44 86 40 78 C34 86 26 86 22 78 Z' })],
    };
    return h('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true' }, parts[kind] || parts.blob,
      h('text', { x: 50, y: 64, 'text-anchor': 'middle', class: 'fg-q' }, '?'));
  }

  function doorSvg() {
    return h('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true' },
      h('rect', { x: 0, y: 0, width: 100, height: 100, style: 'fill: color-mix(in srgb, #9AAEC4 35%, #f4ebdd)' }),
      h('path', { d: 'M24 96 V34 a26 26 0 0 1 52 0 V96 Z', style: 'fill: #58B0F6' }),
      h('path', { d: 'M30 92 V36 a20 20 0 0 1 40 0 V92 Z', style: 'fill: none; stroke: #1a0b3d; stroke-width: 2; opacity: .35' }),
      h('path', { d: 'M36 40 l10 4 M64 40 l-10 4', style: 'stroke: #1a0b3d; stroke-width: 3; stroke-linecap: round' }),
      h('circle', { cx: 42, cy: 50, r: 3, style: 'fill: #1a0b3d' }),
      h('circle', { cx: 58, cy: 50, r: 3, style: 'fill: #1a0b3d' }),
      h('path', { d: 'M40 70 q10 -8 20 0', style: 'fill: none; stroke: #1a0b3d; stroke-width: 3; stroke-linecap: round' }),
      h('circle', { cx: 66, cy: 66, r: 3, style: 'fill: #F5B82E' }),
      h('rect', { x: 18, y: 94, width: 64, height: 6, style: 'fill: #46337e' }));
  }
  function hydrantSvg() {
    return h('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true' },
      h('rect', { x: 0, y: 0, width: 100, height: 100, style: 'fill: color-mix(in srgb, #93DC5E 30%, #f4ebdd)' }),
      h('rect', { x: 30, y: 36, width: 40, height: 52, rx: 6, style: 'fill: #FF6050' }),
      h('path', { d: 'M28 38 a22 18 0 0 1 44 0 Z', style: 'fill: #FF6050' }),
      h('rect', { x: 44, y: 14, width: 12, height: 8, rx: 2, style: 'fill: #FF6050' }),
      h('rect', { x: 20, y: 52, width: 12, height: 12, rx: 3, style: 'fill: #FA7423' }),
      h('rect', { x: 68, y: 52, width: 12, height: 12, rx: 3, style: 'fill: #FA7423' }),
      h('rect', { x: 26, y: 86, width: 48, height: 8, rx: 2, style: 'fill: #FA7423' }),
      h('ellipse', { cx: 42, cy: 48, rx: 6, ry: 5, style: 'fill: #fbf7ff' }),
      h('ellipse', { cx: 58, cy: 48, rx: 6, ry: 5, style: 'fill: #fbf7ff' }),
      h('circle', { cx: 45, cy: 49, r: 2.6, style: 'fill: #1a0b3d' }),
      h('circle', { cx: 61, cy: 49, r: 2.6, style: 'fill: #1a0b3d' }),
      h('path', { d: 'M44 66 h12', style: 'stroke: #1a0b3d; stroke-width: 3; stroke-linecap: round' }));
  }
}

function css(k) {
  k.css('field-guide', `
.fg-book { background: var(--velvet); border: 1px solid var(--line); border-radius: 16px; padding: 10px; box-shadow: inset 0 0 40px rgba(11, 6, 32, 0.6); }
.fg-page { background: var(--pearl); color: var(--midnight); border-radius: 6px 10px 10px 6px; padding: 20px 14px 18px; position: relative;
  box-shadow: inset 10px 0 18px -12px rgba(11, 6, 32, 0.45), 0 10px 30px rgba(11, 6, 32, 0.45); }
.fg-kick { font: 700 11px/1.2 var(--f-body); letter-spacing: 0.16em; text-transform: uppercase; color: #46337e; margin: 0 0 6px; }
.fg-title { font: 600 30px/1.02 var(--f-head); margin: 0; color: var(--midnight); text-wrap: balance; }
.fg-sub { margin: 8px 0 0; font: italic 500 16px/1.3 var(--f-head); color: #46337e; text-wrap: pretty; }
.fg-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.fg-chip { min-height: 36px; padding: 0 12px; border-radius: 999px; border: 1.5px solid color-mix(in srgb, #46337e 40%, transparent); background: none; font: 600 13px var(--f-body); color: var(--midnight); }
.fg-chip[aria-pressed="true"] { background: var(--midnight); border-color: var(--midnight); color: var(--pearl); }
.fg-sec { margin-top: 20px; }
.fg-sec-head { display: flex; align-items: baseline; gap: 10px; border-bottom: 1.5px solid color-mix(in srgb, #46337e 30%, transparent); padding-bottom: 6px; }
.fg-sec-head h2 { margin: 0; font: 600 21px/1.1 var(--f-head); color: var(--midnight); flex: 1; min-width: 0; }
.fg-meter { display: flex; align-items: center; gap: 6px; flex: 0 0 auto; }
.fg-meter b { font: 700 11px/1 var(--f-body); letter-spacing: 0.08em; text-transform: uppercase; color: #46337e; }
.fg-meter i { width: 40px; height: 6px; border-radius: 3px; background: color-mix(in srgb, #46337e 18%, transparent); position: relative; overflow: hidden; }
.fg-meter i::after { content: ""; position: absolute; inset: 0; width: calc(var(--p) * 100%); background: color-mix(in srgb, var(--jewel) 75%, #1a0b3d); border-radius: 3px; }
.fg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
.fg-card { display: flex; flex-direction: column; text-align: left; border: 0; padding: 6px 6px 8px; border-radius: 4px; background: color-mix(in srgb, #fbf7ff 65%, var(--pearl));
  box-shadow: 0 2px 6px rgba(11, 6, 32, 0.18); rotate: -0.8deg; min-width: 0; min-height: 44px; }
.fg-card:nth-child(even) { rotate: 1deg; }
.fg-card.fresh { animation: land 0.6s cubic-bezier(0.2, 1.3, 0.4, 1) both; box-shadow: 0 0 0 2px var(--jewel), 0 6px 18px rgba(11, 6, 32, 0.25); }
.fg-sil { background: color-mix(in srgb, #46337e 10%, var(--pearl)); box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #46337e 25%, transparent); rotate: none !important; }
.fg-img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; border-radius: 2px; }
.fg-drawn svg, .fg-shade svg { width: 100%; height: 100%; display: block; border-radius: 2px; }
.fg-shade { background: color-mix(in srgb, #46337e 16%, var(--pearl)); }
.fg-shape { fill: var(--midnight); opacity: 0.85; }
.fg-q { font: 600 30px var(--f-head); fill: color-mix(in srgb, var(--pearl) 70%, transparent); }
.fg-no { font: italic 600 12px/1.2 var(--f-head); color: #46337e; margin-top: 6px; }
.fg-name { font: 600 15px/1.05 var(--f-head); color: var(--midnight); margin-top: 2px; overflow-wrap: anywhere; }
.fg-hint { font: italic 500 12px/1.2 var(--f-head); color: #46337e; margin-top: 2px; overflow-wrap: anywhere; }
.fg-extra { font: 700 10.5px/1.3 var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: #46337e; margin: 12px 0 0; }
.fg-spec { background: var(--pearl); color: var(--midnight); border-radius: 6px; padding: 14px; rotate: -1deg; box-shadow: 0 18px 40px rgba(11, 6, 32, 0.5); animation: land 0.55s cubic-bezier(0.2, 1.3, 0.4, 1) both; margin: 4px 4px 0; }
.fg-spec .fg-img { width: 56%; margin: 0 auto; }
.fg-spec .fg-no { text-align: center; margin: 10px 0 0; display: block; }
.fg-spec-name { font: 600 28px/1.02 var(--f-head) !important; color: var(--midnight) !important; text-align: center; margin: 2px 0 0; }
.fg-spec dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; margin: 12px 0 0; font-size: 14px; }
.fg-spec dt { font: 700 10.5px/1.6 var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: #46337e; }
.fg-spec dd { margin: 0; font: italic 500 16px/1.3 var(--f-head); }
.fg-note { margin: 12px 4px 0; padding: 10px 12px; rotate: 1.2deg; background: color-mix(in srgb, #DEC523 22%, var(--pearl)); border-radius: 2px;
  box-shadow: 0 2px 5px rgba(11, 6, 32, 0.2); font: italic 500 17px/1.3 var(--f-head); color: var(--midnight); letter-spacing: 0.01em; text-wrap: pretty; }
.fg-note span { display: block; text-align: right; margin-top: 2px; font-size: 15px; color: #46337e; }
.fg-spec-dark .fg-note { text-align: center; }
.fg-tip { margin: 14px 0 0; padding: 10px 14px; border-radius: 12px; border: 1.5px dashed color-mix(in srgb, var(--jewel) 55%, transparent); font: italic 500 17px/1.3 var(--f-head); color: var(--mist); }
.fg-pay-count { text-align: center; margin: 14px 0 0; font: 700 12px/1.2 var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; color: var(--jewel); }
.fg-top { display: flex; gap: 14px; align-items: center; }
.fg-thumb { width: 92px; height: 92px; object-fit: cover; border-radius: 8px; flex: 0 0 auto; border: 3px solid var(--pearl); rotate: -3deg; overflow: hidden; }
.fg-thumb svg { width: 100%; height: 100%; display: block; }
.fg-h { font-size: 28px; }
.fg-stage { position: relative; border-radius: 12px; overflow: hidden; user-select: none; touch-action: none; }
.fg-stage canvas { display: block; width: 100%; height: auto; }
.fg-st { position: absolute; transform: translate(-50%, -50%); cursor: grab; touch-action: none; filter: drop-shadow(0 2px 3px rgba(11, 6, 32, 0.45)); animation: land 0.3s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
.fg-st svg, .fg-tray svg { display: block; width: 100%; height: auto; pointer-events: none; }
.fg-tray { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
.fg-tray button { min-height: 56px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--pearl); display: grid; place-items: center; padding: 10px; }
.fg-tray button:active { transform: scale(0.95); }
.fg-form { display: grid; gap: 12px; margin-top: 18px; }
.fg-field { display: grid; gap: 6px; }
.fg-field span { font: 700 11px/1.2 var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; color: var(--glow); }
.fg-field input, .fg-field select { width: 100%; min-height: 48px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--velvet); color: var(--starlight); font: 500 16px var(--f-body); padding: 0 14px; }
.fg-field select { appearance: none; -webkit-appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--lilac) 50%), linear-gradient(135deg, var(--lilac) 50%, transparent 50%);
  background-position: calc(100% - 20px) 50%, calc(100% - 14px) 50%; background-size: 6px 6px; background-repeat: no-repeat; }
.fg-field input::placeholder { color: var(--lilac); opacity: 0.7; }
`);
}
