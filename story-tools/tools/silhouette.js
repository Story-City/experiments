// Silhouette Match: a black shadow outline; find the real thing, line it up in the camera, get a fit score.
const TEXT = {
  kicker: 'Incoming transmission',
  title: 'What cast this shadow?',
  another: 'Another Shadow',
  atHome: 'Play at Home',
  outside: 'Play Outside',
  findIt: 'Go Find It',
  huntKicker: 'Line it up',
  huntTitle: (n) => `Find ${n}`,
  huntHint: 'Fit the real thing inside the shadow, then snap.',
  snap: 'Snap It',
  alignKicker: 'Almost there',
  alignTitle: 'Nudge the shadow onto it',
  alignHint: 'Drag the shadow, or use the sliders, until it sits on your find.',
  sideways: 'Left and right',
  upDown: 'Up and down',
  size: 'Size',
  score: 'Score My Fit',
  scoring: 'Checking the fit…',
  doneKicker: 'Shadow matched',
  rows: { fit: 'Fit', centred: 'Centred', size: 'Size' },
  total: 'Total',
  titles: [[90, 'Perfect Shadow'], [75, 'Sharp Eye'], [55, 'Good Match'], [0, 'Shadow Spotted']],
  wren: (t) => (t >= 75 ? 'Wren: “That’s it. That’s what cast it.”' : 'Wren: “Close enough for the Society. Want to try for a sharper fit?”'),
  again: 'Try Another Shadow',
  retry: 'Snap Again',
  home: 'Back to Tools',
};

// Each shadow is one SVG path in a 100 × 160 box, standing on the ground near y = 148.
const OUTSIDE = [
  { id: 'hydrant', name: 'a fire hydrant', hint: 'Bright, stubby, and found near the curb.', colour: '#FF6050',
    d: 'M47 16 L53 16 L53 22 L47 22 Z M38 32 Q50 18 62 32 L62 36 L66 36 L66 42 L62 42 L62 60 L72 60 L72 72 L62 72 L62 132 L68 132 L68 146 L32 146 L32 132 L38 132 L38 72 L28 72 L28 60 L38 60 L38 42 L34 42 L34 36 L38 36 Z' },
  { id: 'lamp', name: 'a street lamp', hint: 'Tall and thin. It wakes up at dusk.', colour: '#46337e',
    d: 'M44 8 L56 8 L58 14 L42 14 Z M40 14 L60 14 L64 22 L60 40 L40 40 L36 22 Z M47 40 L53 40 L53 136 L47 136 Z M40 136 L60 136 L62 148 L38 148 Z' },
  { id: 'mailbox', name: 'a mailbox', hint: 'It eats letters. It has a little flag.', colour: '#58B0F6',
    d: 'M24 80 L24 54 A26 22 0 0 1 76 54 L76 80 Z M76 52 L86 52 L86 34 L94 34 L94 42 L90 42 L90 60 L76 60 Z M45 80 L55 80 L55 144 L45 144 Z M36 142 L64 142 L64 148 L36 148 Z' },
  { id: 'bench', name: 'a park bench', hint: 'Somewhere to rest. Often near trees.', colour: '#ED8D00',
    d: 'M12 64 L88 64 L88 72 L12 72 Z M12 78 L88 78 L88 84 L12 84 Z M16 64 L22 64 L22 96 L16 96 Z M78 64 L84 64 L84 96 L78 96 Z M8 96 L92 96 L92 104 L8 104 Z M8 88 L24 88 L24 92 L8 92 Z M76 88 L92 88 L92 92 L76 92 Z M14 104 L20 104 L20 146 L14 146 Z M80 104 L86 104 L86 146 L80 146 Z' },
];
const INSIDE = [
  { id: 'tlamp', name: 'a lamp', hint: 'It has a hat and lights up a corner.', colour: '#35C6D7',
    d: 'M30 30 L70 30 L80 72 L20 72 Z M47 72 L53 72 L53 128 L47 128 Z M30 130 Q50 120 70 130 L72 142 L28 142 Z' },
  { id: 'mug', name: 'a mug', hint: 'Warm in the morning. It has one ear.', colour: '#FF4F79',
    d: 'M22 60 L68 60 L68 130 Q68 142 56 142 L34 142 Q22 142 22 130 Z M68 76 Q94 76 94 99 Q94 122 68 122 L68 112 Q84 112 84 99 Q84 86 68 86 Z' },
  { id: 'chair', name: 'a chair', hint: 'Four legs, one back, no arms.', colour: '#ED8D00',
    d: 'M26 10 L74 10 L74 20 L26 20 Z M26 10 L34 10 L34 88 L26 88 Z M66 10 L74 10 L74 88 L66 88 Z M34 40 L66 40 L66 48 L34 48 Z M20 84 L80 84 L80 96 L20 96 Z M24 96 L32 96 L32 148 L24 148 Z M68 96 L76 96 L76 148 L68 148 Z' },
];
const BOX = { w: 100, h: 160 };

export default function run(k) {
  const { h, show, bar, toast, openSheet, closeSheet, camera, loadImage, css, tool, home, onLeave } = k;
  css('silhouette', CSS);
  let atHome = false;
  let turn = 0;
  let shape = OUTSIDE[0];
  const timers = [];
  onLeave(() => timers.forEach(clearTimeout));

  const set = () => atHome ? INSIDE : OUTSIDE;
  function nextShape() { shape = set()[turn++ % set().length]; }

  // A shadow as SVG: solid ink, or translucent with a glowing outline for lining up.
  function shadow(s, ghost) {
    return h('svg', { class: `sm-shadow${ghost ? ' ghost' : ''}`, viewBox: `0 0 ${BOX.w} ${BOX.h}`, 'aria-hidden': 'true' },
      h('path', { d: s.d }));
  }

  /* ---------- 1. study the shadow ---------- */
  function study() {
    show(
      bar(atHome ? TEXT.atHome : null),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      h('div', { class: 'frame sm-study' }, h('div', { class: 'sm-static', 'aria-hidden': 'true' }), shadow(shape)),
      h('p', { class: 'hint centre' }, shape.hint),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', id: 'smFind', onclick: hunt }, TEXT.findIt),
        h('div', { class: 'sm-row' },
          h('button', { class: 'link', onclick: () => { nextShape(); study(); } }, TEXT.another),
          h('button', { class: 'link', id: 'smMode', onclick: () => { atHome = !atHome; turn = 0; nextShape(); study(); } }, atHome ? TEXT.outside : TEXT.atHome))),
    );
  }

  /* ---------- 2. hunt: the camera with the shadow laid over it ---------- */
  function hunt() {
    show(
      bar(),
      h('p', { class: 'kicker' }, TEXT.huntKicker),
      h('h1', { class: 'display' }, TEXT.huntTitle(shape.name)),
      h('div', { class: 'sm-finder' }, h('span', { class: 'sm-corner' }), shadow(shape, true)),
      h('p', { class: 'hint centre' }, TEXT.huntHint),
      camera(TEXT.snap, align, samplePhoto),
    );
  }

  // Sample photo for desktop testers: the real object painted on a street (or a room), slightly off from the shadow.
  function samplePhoto() {
    const W = 500, H = 800;
    const c = h('canvas', { width: W, height: H }).getContext('2d');
    c.fillStyle = atHome ? '#f4ebdd' : '#9AAEC4'; c.fillRect(0, 0, W, H * 0.72);
    c.fillStyle = atHome ? '#C9C6D3' : '#C9C6D3'; c.fillRect(0, H * 0.72, W, H);
    // a little scenery so it reads as a place
    c.fillStyle = atHome ? '#DA82ED' : '#58B0F6';
    c.globalAlpha = 0.35; c.fillRect(30, 70, 110, 150); c.fillRect(360, 70, 110, 150); c.globalAlpha = 1;
    c.fillStyle = '#46337e'; c.globalAlpha = 0.25; c.fillRect(0, H * 0.72, W, 6); c.globalAlpha = 1;
    const wide = shape.id === 'bench';
    const s = 0.86 + Math.random() * 0.2;
    const dx = (Math.random() - 0.5) * (wide ? 30 : 90);
    const dy = (Math.random() - 0.5) * 70;
    c.save();
    c.translate(W / 2 + dx, H / 2 + dy); c.scale(s * W / BOX.w, s * H / BOX.h); c.translate(-BOX.w / 2, -BOX.h / 2);
    c.fillStyle = shape.colour; c.fill(new Path2D(shape.d));
    c.restore();
    return c.canvas.toDataURL('image/jpeg', 0.9);
  }

  /* ---------- 3. align: nudge the shadow onto the find, then score ---------- */
  function align(url) {
    const pos = { x: 0, y: 0, s: 100 };
    const ghost = shadow(shape, true);
    const finder = h('div', { class: 'sm-finder photo-on' }, h('img', { src: url, alt: '' }), ghost);
    const sliders = {
      x: slider(TEXT.sideways, -30, 30, 0),
      y: slider(TEXT.upDown, -25, 25, 0),
      s: slider(TEXT.size, 70, 130, 100),
    };
    const place = () => { ghost.style.transform = `translate(${pos.x}%, ${pos.y}%) scale(${pos.s / 100})`; };
    Object.entries(sliders).forEach(([key, el]) => el.input.addEventListener('input', () => { pos[key] = Number(el.input.value); place(); }));

    // Drag the shadow straight on the photo too.
    let from = null;
    finder.addEventListener('pointerdown', (e) => { from = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }; finder.setPointerCapture(e.pointerId); });
    finder.addEventListener('pointermove', (e) => {
      if (!from) return;
      const r = finder.getBoundingClientRect();
      pos.x = clamp(from.px + ((e.clientX - from.x) / r.width) * 100, -30, 30);
      pos.y = clamp(from.py + ((e.clientY - from.y) / r.height) * 100, -25, 25);
      sliders.x.input.value = pos.x; sliders.y.input.value = pos.y; place();
    });
    const up = () => { from = null; };
    finder.addEventListener('pointerup', up); finder.addEventListener('pointercancel', up);

    const btn = h('button', { class: 'btn jewel', id: 'smScore', onclick: async () => {
      btn.disabled = true; btn.textContent = TEXT.scoring;
      finder.classList.add('sm-scan');
      const img = await loadImage(url).catch(() => null);
      const result = score(img, pos);
      timers.push(setTimeout(() => payoff(url, pos, result), 900));
    } }, TEXT.score);

    show(
      bar(),
      h('p', { class: 'kicker' }, TEXT.alignKicker),
      h('h1', { class: 'display sm-small' }, TEXT.alignTitle),
      finder,
      h('div', { class: 'sm-sliders' }, Object.values(sliders).map((s) => s.el)),
      h('p', { class: 'hint centre' }, TEXT.alignHint),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, btn),
    );
    place();
  }

  function slider(label, min, max, value) {
    const input = h('input', { type: 'range', min, max, value, step: '0.5', 'aria-label': label });
    return { input, el: h('label', { class: 'sm-slider' }, h('span', {}, label), input) };
  }

  /* ---------- scoring: compare the shadow's mask with the find's mask ---------- */
  // The find's mask = pixels that stand out from the background at the left and right edges of their row.
  function score(img, pos) {
    const W = BOX.w, H = BOX.h;
    const shadowMask = maskOf((c) => {
      c.translate(W / 2 + (pos.x / 100) * W, H / 2 + (pos.y / 100) * H);
      c.scale(pos.s / 100, pos.s / 100); c.translate(-W / 2, -H / 2);
      c.fillStyle = '#0b0620'; c.fill(new Path2D(shape.d));
    }, (d, i) => d[i + 3] > 128);
    let fit = 50;
    if (img) {
      const photo = maskOf((c) => coverDraw(c, img, W, H), null);
      let inter = 0, union = 0;
      for (let i = 0; i < photo.length; i++) { inter += photo[i] && shadowMask[i]; union += photo[i] || shadowMask[i]; }
      const iou = union ? inter / union : 0;
      fit = clamp(Math.round(35 + iou * 78), 35, 100);
    }
    const centred = clamp(Math.round(100 - 50 * Math.hypot(pos.x / 30, pos.y / 25)), 40, 100);
    const size = clamp(Math.round(100 - Math.abs(pos.s / 100 - 1) * 150), 40, 100);
    const total = Math.round(fit * 0.5 + centred * 0.25 + size * 0.25);
    return { fit, centred, size, total };
  }

  // Draw into a small canvas and return a 0/1 mask. test(data, i) decides each pixel; null = "stands out from the row's edges".
  function maskOf(paint, test) {
    const W = BOX.w, H = BOX.h;
    const c = h('canvas', { width: W, height: H }).getContext('2d', { willReadFrequently: true });
    paint(c);
    const d = c.getImageData(0, 0, W, H).data;
    const out = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      let bg = null;
      if (!test) {
        const edge = [];
        for (let x = 0; x < 5; x++) { edge.push(px(d, (y * W + x) * 4)); edge.push(px(d, (y * W + W - 1 - x) * 4)); }
        bg = median(edge);
      }
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        out[y * W + x] = test ? (test(d, i) ? 1 : 0) : (dist(px(d, i), bg) > 55 ? 1 : 0);
      }
    }
    return out;
  }

  /* ---------- 4. payoff: Pokémon-Snap-style breakdown ---------- */
  function payoff(url, pos, r) {
    const title = TEXT.titles.find(([min]) => r.total >= min)[1];
    const thumb = h('div', { class: 'sm-thumb' }, h('img', { src: url, alt: '' }),
      (() => { const g = shadow(shape, true); g.style.transform = `translate(${pos.x}%, ${pos.y}%) scale(${pos.s / 100})`; return g; })());
    const row = (key) => h('div', { class: 'sm-bar' },
      h('span', {}, TEXT.rows[key]),
      h('i', {}, h('b', { style: `--w:${r[key]}%` })),
      h('em', {}, r[key]));
    openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.doneKicker),
        h('div', { class: 'sm-result' }, thumb,
          h('div', { class: 'sm-bars' }, row('fit'), row('centred'), row('size'),
            h('div', { class: 'sm-total' }, h('span', {}, TEXT.total), h('strong', { id: 'smTotal' }, r.total)))),
        h('h3', {}, title),
        h('p', { class: 'more' }, TEXT.wren(r.total))),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => { closeSheet(); nextShape(); study(); } }, TEXT.again),
        h('div', { class: 'sm-row' },
          h('button', { class: 'link', onclick: () => { closeSheet(); hunt(); } }, TEXT.retry),
          h('button', { class: 'link', onclick: home }, TEXT.home))),
    ], null, tool.jewel);
    if (r.total >= 90) toast('✦ ' + title);
  }

  nextShape();
  study();
}

/* ---------- small helpers ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const px = (d, i) => [d[i], d[i + 1], d[i + 2]];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
function median(list) {
  const m = (ch) => list.map((p) => p[ch]).sort((a, b) => a - b)[Math.floor(list.length / 2)];
  return [m(0), m(1), m(2)];
}
// Draw an image to fill W × H, cropping the overflow (like object-fit: cover).
function coverDraw(c, img, W, H) {
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const w = img.naturalWidth * s, hh = img.naturalHeight * s;
  c.drawImage(img, (W - w) / 2, (H - hh) / 2, w, hh);
}

const CSS = `
.sm-study { margin-top: 18px; padding: 18px; display: flex; justify-content: center; background: radial-gradient(80% 70% at 50% 45%, var(--pearl), color-mix(in srgb, var(--pearl) 60%, #C9C6D3)); }
.sm-study .sm-shadow { width: 46%; max-width: 160px; }
.sm-static { position: absolute; inset: 0; opacity: 0.18; pointer-events: none; background: repeating-linear-gradient(0deg, var(--ink) 0 1px, transparent 1px 4px); animation: sm-roll 4s linear infinite; }
@keyframes sm-roll { to { background-position: 0 40px; } }
.sm-shadow { display: block; width: 100%; height: auto; overflow: visible; }
.sm-shadow path { fill: var(--ink); }
.sm-shadow.ghost path { fill: color-mix(in srgb, var(--ink) 55%, transparent); stroke: var(--jewel); stroke-width: 1.2; stroke-dasharray: 3 2; }
.sm-row { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
.sm-finder { position: relative; margin: 16px auto 0; width: min(62%, 230px); aspect-ratio: 5 / 8; border-radius: 14px; overflow: hidden; border: 1.5px solid var(--line);
  background: linear-gradient(var(--velvet), var(--ink)); touch-action: none; }
.sm-finder .sm-shadow { position: absolute; inset: 0; height: 100%; transform-origin: 50% 50%; }
.sm-finder img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.sm-finder.photo-on { width: min(56%, 210px); cursor: grab; }
.sm-corner { position: absolute; inset: 10px; border: 2px solid transparent; border-image: linear-gradient(var(--jewel), var(--jewel)) 1; opacity: 0.5;
  mask: conic-gradient(at 18px 18px, transparent 75%, #000 0) 0 0 / calc(100% - 18px) calc(100% - 18px); }
.sm-scan::after { content: ""; position: absolute; left: 0; right: 0; height: 30%; background: linear-gradient(transparent, color-mix(in srgb, var(--jewel) 55%, transparent)); animation: sm-scan 0.9s ease-in-out infinite alternate; }
@keyframes sm-scan { from { top: -30%; } to { top: 100%; } }
.display.sm-small { font-size: 28px; }
.sm-sliders { display: grid; gap: 2px; margin-top: 10px; }
.sm-slider { display: grid; grid-template-columns: 104px 1fr; align-items: center; gap: 10px; min-height: 44px; font: 600 13px var(--f-body); color: var(--mist); }
.sm-slider input { width: 100%; min-width: 0; height: 44px; accent-color: var(--jewel); }
.sm-result { display: grid; grid-template-columns: 96px 1fr; gap: 14px; align-items: center; margin: 4px 0 14px; text-align: left; }
.sm-thumb { position: relative; width: 96px; aspect-ratio: 5 / 8; border-radius: 10px; overflow: hidden; }
.sm-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sm-thumb .sm-shadow { position: absolute; inset: 0; height: 100%; }
.sm-bars { display: grid; gap: 8px; }
.sm-bar { display: grid; grid-template-columns: 62px 1fr 28px; align-items: center; gap: 8px; font: 700 12px var(--f-body); letter-spacing: 0.08em; text-transform: uppercase; color: var(--mist); }
.sm-bar i { height: 8px; border-radius: 99px; background: var(--line); overflow: hidden; }
.sm-bar b { display: block; height: 100%; width: var(--w); background: var(--jewel); border-radius: 99px; animation: sm-grow 0.8s ease-out both; }
@keyframes sm-grow { from { width: 0; } }
.sm-bar em { font-style: normal; text-align: right; color: var(--starlight); }
.sm-total { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid var(--line); padding-top: 6px; font: 700 12px var(--f-body); letter-spacing: 0.08em; text-transform: uppercase; color: var(--mist); }
.sm-total strong { font: 600 32px/1 var(--f-head); color: var(--jewel); letter-spacing: 0; }
`;
