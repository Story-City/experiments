// Face-Finder: stick googly eyes and a mouth on anything, then name it.
const TEXT = {
  kicker: 'Step 1 · Snap',
  title: 'Find something with a face',
  sub: 'A mailbox, a hydrant, a door, a knot in a tree. If it looks back at you, snap it.',
  snap: 'Snap a Face',
  editKicker: 'Step 2 · Stick',
  editTitle: 'Give it a face',
  editHint: 'Tap a sticker to add it. Drag to move. Tap a placed one to take it off.',
  stickers: { eyesBig: 'Big eyes', eyesSmall: 'Small eyes', smile: 'Smile', grumpy: 'Grumpy', surprised: 'Surprised', brows: 'Eyebrows', moustache: 'Moustache' },
  nameLabel: 'Name it',
  namePlaceholder: 'Sir Bolt of Elm Street',
  finish: 'Make the Card',
  needSticker: 'Add a sticker first',
  sheetKicker: 'New creature found',
  spotted: 'Spotted on a walk',
  save: 'Save',
  again: 'Find Another',
  saved: 'Saved to your downloads',
  addGuide: 'Add to Field Guide',
  added: 'Added to your Field Guide',
  addedBtn: 'In Your Field Guide',
  guideFail: 'Your Field Guide is full on this phone',
  guideHabitat: 'Spotted by Face-Finder on a walk',
  guideNotes: ['Caught on camera. It looked right at me.', 'Wears its new face well. Visit it again sometime.', 'The Society has opened a file on this one.'],
  oops: 'That photo would not open',
  fallbackNames: ['Mister Puddle', 'Captain Knot', 'Lady Hinge', 'Old Rusty', 'Professor Leaf', 'Little Latch'],
};

const MAX = 1000;
// Field Guide's storage, matched to tools/field-guide.js (key, entry shape, and its 2 seed entries for numbering).
const GUIDE_KEY = 'st-field-guide';
const GUIDE_SEEDS = 2;
const INK = '#0b0620', WHITE = '#fbf7ff', PINK = '#FF4F79', CARD = '#f4ebdd', GLOW = '#c49bff';

// Each sticker: viewBox size, width as a share of the photo, and its SVG parts.
const STICKERS = {
  eyesBig: { vb: [120, 60], w: 0.34, draw: (h) => [eye(h, 30, 30, 26), eye(h, 90, 30, 26)] },
  eyesSmall: { vb: [120, 60], w: 0.18, draw: (h) => [eye(h, 30, 30, 24), eye(h, 90, 30, 24)] },
  smile: { vb: [100, 56], w: 0.26, draw: (h) => [
    h('path', { d: 'M8 10 Q50 66 92 10 Q50 30 8 10 Z', fill: INK, stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }),
    h('ellipse', { cx: 50, cy: 38, rx: 14, ry: 7, fill: PINK })] },
  grumpy: { vb: [100, 44], w: 0.24, draw: (h) => [
    h('path', { d: 'M12 38 Q50 2 88 38', fill: 'none', stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' })] },
  surprised: { vb: [60, 70], w: 0.13, draw: (h) => [
    h('ellipse', { cx: 30, cy: 35, rx: 24, ry: 30, fill: INK }),
    h('ellipse', { cx: 30, cy: 48, rx: 12, ry: 9, fill: PINK })] },
  brows: { vb: [120, 36], w: 0.32, draw: (h) => [
    h('path', { d: 'M8 26 Q28 4 50 18', fill: 'none', stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' }),
    h('path', { d: 'M70 18 Q92 4 112 26', fill: 'none', stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' })] },
  moustache: { vb: [120, 44], w: 0.3, draw: (h) => [
    h('path', { d: 'M60 14 C48 2 30 4 22 18 C16 28 6 30 2 22 C4 38 26 44 44 34 C52 30 57 24 60 20 C63 24 68 30 76 34 C94 44 116 38 118 22 C114 30 104 28 98 18 C90 4 72 2 60 14 Z', fill: INK })] },
};

// A googly eye: white ball, pupil rolled to a random spot.
function eye(h, cx, cy, r) {
  const a = Math.random() * Math.PI * 2, d = r * (0.25 + Math.random() * 0.25);
  return h('g', {},
    h('circle', { cx, cy, r, fill: WHITE, stroke: INK, 'stroke-width': 3 }),
    h('circle', { cx: cx + Math.cos(a) * d, cy: cy + Math.sin(a) * d, r: r * 0.42, fill: INK }),
    h('circle', { cx: cx + Math.cos(a) * d - r * 0.12, cy: cy + Math.sin(a) * d - r * 0.14, r: r * 0.1, fill: WHITE }));
}

export default function run(k) {
  const { h } = k;
  k.css('face-finder', `
    .ff-stage { position: relative; border-radius: 12px; overflow: hidden; user-select: none; touch-action: none; }
    .ff-stage canvas { display: block; width: 100%; height: auto; }
    .ff-st { position: absolute; transform: translate(-50%, -50%); cursor: grab; touch-action: none; filter: drop-shadow(0 2px 3px rgba(11, 6, 32, 0.45)); }
    .ff-st svg, .ff-tray svg { display: block; width: 100%; height: auto; pointer-events: none; }
    .ff-st.ff-pop { animation: ff-pop 0.3s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
    @keyframes ff-pop { from { scale: 0.4; } }
    .ff-tray { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
    .ff-tray button { min-height: 64px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--pearl); display: grid; place-items: center; padding: 10px; }
    .ff-tray button:active { transform: scale(0.95); }
    .ff-name { display: grid; gap: 6px; margin-top: 14px; }
    .ff-name span { font: 700 11px var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); }
    .ff-name input { min-height: 48px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--velvet); color: var(--starlight); font: 600 18px var(--f-head); padding: 0 14px; width: 100%; }
    .ff-card { max-width: 100%; max-height: 40vh; width: auto; border-radius: 8px; display: block; margin: 14px auto 4px; box-shadow: 0 18px 40px rgba(11, 6, 32, 0.5); rotate: -1.5deg; }
  `);

  snapScreen();

  function snapScreen() {
    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      h('p', { class: 'sub' }, TEXT.sub),
      h('div', { class: 'spacer' }),
      k.camera(TEXT.snap, async (url) => {
        try { edit(await k.loadImage(url)); } catch (e) { k.toast(TEXT.oops); }
      }, () => k.samplePhoto(1)),
    );
  }

  function edit(img) {
    const photo = fit(img);
    const placed = [];        // { id, x, y, el, svg } with x/y as shares of the photo
    const stage = h('div', { class: 'ff-stage' }, photo);

    function add(id) {
      const s = STICKERS[id];
      const svg = h('svg', { viewBox: `0 0 ${s.vb[0]} ${s.vb[1]}` }, s.draw(h));
      const el = h('div', { class: 'ff-st ff-pop', role: 'button', 'aria-label': TEXT.stickers[id], style: `width:${s.w * 100}%` }, svg);
      const item = { id, x: 0.5 + (Math.random() - 0.5) * 0.12, y: 0.42 + (Math.random() - 0.5) * 0.12, el, svg };
      place(item);
      grab(item);
      placed.push(item);
      stage.append(el);
    }
    const place = (it) => { it.el.style.left = `${it.x * 100}%`; it.el.style.top = `${it.y * 100}%`; };

    // drag to move; a tap with no movement removes it
    function grab(it) {
      let start = null, moved = false;
      it.el.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        it.el.setPointerCapture(e.pointerId);
        start = { cx: e.clientX, cy: e.clientY, x: it.x, y: it.y }; moved = false;
        stage.append(it.el);
      });
      it.el.addEventListener('pointermove', (e) => {
        if (!start) return;
        const r = stage.getBoundingClientRect();
        const dx = e.clientX - start.cx, dy = e.clientY - start.cy;
        if (Math.hypot(dx, dy) > 6) moved = true;
        it.x = Math.min(1, Math.max(0, start.x + dx / r.width));
        it.y = Math.min(1, Math.max(0, start.y + dy / r.height));
        place(it);
      });
      const end = () => {
        if (start && !moved) { it.el.remove(); placed.splice(placed.indexOf(it), 1); }
        start = null;
      };
      it.el.addEventListener('pointerup', end);
      it.el.addEventListener('pointercancel', () => { start = null; });
    }

    const tray = h('div', { class: 'ff-tray' }, Object.keys(STICKERS).map((id) => {
      const s = STICKERS[id];
      return h('button', { 'aria-label': TEXT.stickers[id], title: TEXT.stickers[id], onclick: () => add(id) },
        h('svg', { viewBox: `0 0 ${s.vb[0]} ${s.vb[1]}` }, s.draw(h)));
    }));
    const name = h('input', { type: 'text', maxlength: 28, placeholder: TEXT.namePlaceholder, autocomplete: 'off' });

    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.editKicker),
      h('h1', { class: 'display', style: 'font-size:28px' }, TEXT.editTitle),
      h('p', { class: 'hint' }, TEXT.editHint),
      stage,
      tray,
      h('label', { class: 'ff-name' }, h('span', {}, TEXT.nameLabel), name),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: async () => {
        if (!placed.length) return k.toast(TEXT.needSticker);
        card(await compose(photo, placed), name.value.trim() || k.pick(TEXT.fallbackNames));
      } }, TEXT.finish)),
    );
  }

  function card(face, label) {
    const url = cardImage(face, label);
    k.openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.sheetKicker),
        h('h3', {}, label),
        h('img', { class: 'ff-card', src: url, alt: label })),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: (e) => {
          if (!toGuide(face, label)) return k.toast(TEXT.guideFail);
          e.currentTarget.disabled = true; e.currentTarget.textContent = TEXT.addedBtn;
          k.toast(TEXT.added);
        } }, TEXT.addGuide),
        h('button', { class: 'btn ghost', onclick: () => { save(url, 'creature-card.jpg'); k.toast(TEXT.saved); } }, TEXT.save),
        h('button', { class: 'link', onclick: snapScreen }, TEXT.again)),
    ], null, k.tool.jewel);
  }
}

/* ---------- hand-off to Field Guide ---------- */

// Write one entry in Field Guide's exact format: { no, name, cat, habitat, temper, img, note, face }.
function toGuide(face, label) {
  try {
    const list = JSON.parse(localStorage.getItem(GUIDE_KEY) || '[]');
    const entries = Array.isArray(list) ? list : [];
    const s = Math.min(1, 260 / Math.max(face.width, face.height));
    const c = document.createElement('canvas');
    c.width = Math.round(face.width * s); c.height = Math.round(face.height * s);
    c.getContext('2d').drawImage(face, 0, 0, c.width, c.height);
    entries.push({
      no: GUIDE_SEEDS + entries.length + 1, name: label, cat: 'Faces', habitat: TEXT.guideHabitat, temper: 'friendly',
      img: c.toDataURL('image/jpeg', 0.72),
      note: TEXT.guideNotes[Math.floor(Math.random() * TEXT.guideNotes.length)], face: true,
    });
    localStorage.setItem(GUIDE_KEY, JSON.stringify(entries));
    return true;
  } catch (e) { return false; }
}

/* ---------- drawing ---------- */

// Flatten the photo and every sticker onto one canvas.
async function compose(photo, placed) {
  const c = document.createElement('canvas');
  c.width = photo.width; c.height = photo.height;
  const x = c.getContext('2d');
  x.drawImage(photo, 0, 0);
  for (const it of placed) {
    const s = STICKERS[it.id];
    const w = s.w * c.width, hgt = w * (s.vb[1] / s.vb[0]);
    const svg = it.svg.cloneNode(true);
    svg.setAttribute('width', Math.round(w)); svg.setAttribute('height', Math.round(hgt));
    const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
    const img = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
    if (img) x.drawImage(img, it.x * c.width - w / 2, it.y * c.height - hgt / 2, w, hgt);
  }
  return c;
}

// The creature card: photo on pearl, name in Erode underneath.
function cardImage(face, label) {
  const pad = 28, foot = 150;
  const c = document.createElement('canvas');
  c.width = face.width + pad * 2; c.height = face.height + pad + foot;
  const x = c.getContext('2d');
  x.fillStyle = CARD; x.fillRect(0, 0, c.width, c.height);
  x.drawImage(face, pad, pad);
  x.fillStyle = INK; x.textBaseline = 'alphabetic';
  let size = 56;
  do { x.font = `600 ${size}px Erode, Georgia, serif`; size -= 2; } while (x.measureText(label).width > c.width - pad * 2 && size > 20);
  x.fillText(label, pad, face.height + pad + 76);
  x.fillStyle = GLOW; x.font = '700 22px Karla, system-ui, sans-serif';
  x.fillText(TEXT.spotted.toUpperCase(), pad, face.height + pad + 116);
  return c.toDataURL('image/jpeg', 0.9);
}

function fit(img) {
  const s = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c;
}

function save(url, name) {
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
}
