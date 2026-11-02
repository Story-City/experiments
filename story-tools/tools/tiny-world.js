// Tiny World: tilt-shift a photo so the street looks like a tabletop model.
const TEXT = {
  kicker: 'Step 1 · Snap',
  title: 'Find something wide',
  sub: 'A street, a park, a row of houses. Wide and a little from above works best.',
  snap: 'Snap Something Wide',
  editKicker: 'Step 2 · Slide',
  editTitle: 'Drag the sharp band',
  editHint: 'Drag on the photo to move the sharp strip. Put it on the thing you want to shrink.',
  band: 'Band size',
  before: 'Before',
  after: 'After',
  finish: 'Make It Tiny',
  findKicker: 'Step 3 · Look closer',
  findTitle: 'Someone is in your model',
  findHint: 'A tiny Society agent snuck into your street. Tap them.',
  giveUp: 'Show Me Where',
  missed: 'Not there. Look in the sharp part.',
  found: 'Found the agent',
  foundIn: (n) => (n ? `Found after ${n} ${n === 1 ? 'try' : 'tries'}` : 'Found on the first try'),
  sheetKicker: 'Shrunk',
  sheetTitle: 'Your tiny world',
  sheetSub: 'Looks small enough to fit on a table.',
  save: 'Save',
  again: 'Try Another',
  saved: 'Saved to your downloads',
  oops: 'That photo would not open',
};

const MAX = 1000;          // longest side of the working canvas

export default function run(k) {
  const { h } = k;
  k.css('tiny-world', `
    .tw-stage { position: relative; border-radius: 12px; overflow: hidden; touch-action: none; user-select: none; cursor: ns-resize; }
    .tw-stage canvas { display: block; width: 100%; height: auto; }
    .tw-line { position: absolute; left: 0; right: 0; height: 0; border-top: 1.5px dashed color-mix(in srgb, var(--jewel) 85%, transparent); pointer-events: none; transition: opacity 0.2s; }
    .tw-grip { position: absolute; right: 10px; width: 32px; height: 32px; margin-top: -16px; border-radius: 50%; background: var(--jewel); color: var(--midnight); display: grid; place-items: center; font: 700 14px var(--f-body); pointer-events: none; box-shadow: 0 4px 14px rgba(11, 6, 32, 0.5); }
    .tw-stage.tw-off .tw-line, .tw-stage.tw-off .tw-grip { opacity: 0; }
    .tw-row { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
    .tw-row label { font: 700 11px var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); white-space: nowrap; }
    .tw-row .slider { margin: 0; }
    .tw-seg { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 4px; border-radius: 999px; border: 1.5px solid var(--line); margin-top: 12px; }
    .tw-seg button { min-height: 44px; border: 0; border-radius: 999px; background: none; font: 600 14px var(--f-body); color: var(--mist); }
    .tw-seg button[aria-pressed="true"] { background: var(--starlight); color: var(--midnight); }
    .tw-find { position: relative; border-radius: 12px; overflow: hidden; margin-top: 12px; }
    .tw-find img { display: block; width: 100%; height: auto; }
    .tw-ring { position: absolute; width: 54px; height: 54px; margin: -27px 0 0 -27px; border-radius: 50%; border: 2px solid var(--jewel); box-shadow: 0 0 0 4px color-mix(in srgb, var(--jewel) 30%, transparent), 0 0 24px var(--jewel); pointer-events: none; animation: pop 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
    .tw-miss { position: absolute; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%; border: 1.5px solid var(--starlight); opacity: 0.8; pointer-events: none; animation: fade 0.25s both; }
    .tw-result { width: 100%; border-radius: 10px; display: block; margin: 14px 0 4px; box-shadow: 0 0 0 1px var(--jewel), 0 0 40px color-mix(in srgb, var(--jewel) 35%, transparent); }
  `);

  snapScreen();

  function snapScreen() {
    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      h('p', { class: 'sub' }, TEXT.sub),
      h('div', { class: 'spacer' }),
      k.camera(TEXT.snap, open, () => k.samplePhoto(0)),
    );
  }

  async function open(url) {
    try { edit(await k.loadImage(url)); } catch (e) { k.toast(TEXT.oops); }
  }

  function edit(img) {
    const sharp = boosted(img);
    const soft = blurred(sharp);
    const out = h('canvas', { width: sharp.width, height: sharp.height });
    const ctx = out.getContext('2d');
    const state = { centre: 0.55, size: 0.28, after: true };

    const lineA = h('div', { class: 'tw-line' });
    const lineB = h('div', { class: 'tw-line' });
    const grip = h('div', { class: 'tw-grip', 'aria-hidden': 'true' }, '↕');
    const stage = h('div', { class: 'tw-stage' }, out, lineA, lineB, grip);

    function draw() {
      const { width: W, height: H } = out;
      ctx.clearRect(0, 0, W, H);
      if (!state.after) { ctx.drawImage(img, 0, 0, W, H); stage.classList.add('tw-off'); return; }
      stage.classList.remove('tw-off');
      ctx.drawImage(soft, 0, 0, W, H);
      ctx.drawImage(bandOf(sharp, state.centre, state.size), 0, 0);
      const top = (state.centre - state.size / 2) * 100;
      const bot = (state.centre + state.size / 2) * 100;
      lineA.style.top = `${top}%`; lineB.style.top = `${bot}%`; grip.style.top = `${state.centre * 100}%`;
    }

    // drag anywhere on the photo to move the sharp band
    const moveTo = (e) => {
      const r = stage.getBoundingClientRect();
      state.centre = Math.min(0.92, Math.max(0.08, (e.clientY - r.top) / r.height));
      draw();
    };
    stage.addEventListener('pointerdown', (e) => { if (!state.after) return; stage.setPointerCapture(e.pointerId); moveTo(e); });
    stage.addEventListener('pointermove', (e) => { if (stage.hasPointerCapture(e.pointerId)) moveTo(e); });

    const slider = h('input', { class: 'slider', type: 'range', min: 10, max: 55, value: state.size * 100, 'aria-label': TEXT.band,
      oninput: (e) => { state.size = e.target.value / 100; draw(); } });
    const segBtn = (label, val) => h('button', { 'aria-pressed': String(state.after === val), onclick: (e) => {
      state.after = val;
      e.currentTarget.parentNode.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
      draw();
    } }, label);

    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.editKicker),
      h('h1', { class: 'display', style: 'font-size:28px' }, TEXT.editTitle),
      h('p', { class: 'hint' }, TEXT.editHint),
      stage,
      h('div', { class: 'tw-row' }, h('label', {}, TEXT.band), slider),
      h('div', { class: 'tw-seg' }, segBtn(TEXT.before, false), segBtn(TEXT.after, true)),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: () => finish() }, TEXT.finish)),
    );
    draw();

    function finish() {
      const final = h('canvas', { width: out.width, height: out.height });
      const fctx = final.getContext('2d');
      fctx.drawImage(soft, 0, 0);
      fctx.drawImage(bandOf(sharp, state.centre, state.size), 0, 0);
      const spot = hideAgent(fctx, final.width, final.height, state.centre, state.size, k.tool.jewel);
      findScreen(final.toDataURL('image/jpeg', 0.9), spot);
    }

    // The twist: a tiny Society agent hides in the sharp strip. Find them.
    function findScreen(url, spot) {
      let misses = 0;
      const pic = h('img', { src: url, alt: '' });
      const box = h('div', { class: 'tw-find', onclick: (e) => {
        const r = box.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        const dx = (x - spot.x) * r.width, dy = (y - spot.y) * r.height;
        if (Math.hypot(dx, dy) < 34) return reveal(true);
        misses++;
        const m = h('div', { class: 'tw-miss', style: `left:${x * 100}%;top:${y * 100}%` });
        box.append(m); setTimeout(() => m.remove(), 700);
        k.toast(TEXT.missed);
      } }, pic);
      const reveal = (won) => {
        box.append(h('div', { class: 'tw-ring', style: `left:${spot.x * 100}%;top:${spot.y * 100}%` }));
        setTimeout(() => done(url, won ? TEXT.foundIn(misses) : null), 900);
      };
      k.show(
        k.bar(),
        h('p', { class: 'kicker' }, TEXT.findKicker),
        h('h1', { class: 'display', style: 'font-size:28px' }, TEXT.findTitle),
        h('p', { class: 'hint' }, TEXT.findHint),
        box,
        h('div', { class: 'btns' }, h('button', { class: 'link', onclick: () => reveal(false) }, TEXT.giveUp)),
      );
    }

    function done(url, foundLine) {
      k.openSheet([
        h('div', { class: 'celebrate' },
          h('p', { class: 'kicker' }, TEXT.sheetKicker),
          h('h3', {}, TEXT.sheetTitle),
          h('img', { class: 'tw-result', src: url, alt: TEXT.sheetTitle }),
          h('p', { class: 'hint' }, foundLine ? `${TEXT.found} · ${foundLine}` : TEXT.sheetSub)),
        h('div', { class: 'btns' },
          h('button', { class: 'btn jewel', onclick: () => { save(url, 'tiny-world.jpg'); k.toast(TEXT.saved); } }, TEXT.save),
          h('button', { class: 'btn ghost', onclick: snapScreen }, TEXT.again)),
      ], null, k.tool.jewel);
    }
  }
}

/* ---------- image helpers ---------- */

// Paints a tiny agent (hat, coat, glowing lantern) somewhere in the sharp strip. Returns where, as 0–1.
function hideAgent(ctx, W, H, centre, size, jewel) {
  const x = 0.15 + Math.random() * 0.7;
  const y = Math.min(0.9, Math.max(0.1, centre + (Math.random() - 0.3) * size * 0.6));
  const s = W / 110;                       // about 1% of the width per unit
  ctx.save();
  ctx.translate(x * W, y * H);
  ctx.fillStyle = 'rgba(11, 6, 32, 0.35)';
  ctx.beginPath(); ctx.ellipse(0, 4.2 * s, 2.6 * s, 0.7 * s, 0, 0, Math.PI * 2); ctx.fill();   // shadow
  ctx.fillStyle = '#1a0b3d';
  ctx.beginPath(); ctx.moveTo(-1.6 * s, 4 * s); ctx.lineTo(-1.1 * s, -0.6 * s); ctx.lineTo(1.1 * s, -0.6 * s); ctx.lineTo(1.6 * s, 4 * s); ctx.closePath(); ctx.fill(); // coat
  ctx.beginPath(); ctx.arc(0, -1.6 * s, 1 * s, 0, Math.PI * 2); ctx.fill();                   // head
  ctx.fillRect(-1.9 * s, -2.5 * s, 3.8 * s, 0.5 * s); ctx.fillRect(-1 * s, -3.8 * s, 2 * s, 1.4 * s); // hat
  ctx.shadowColor = jewel; ctx.shadowBlur = 3 * s;
  ctx.fillStyle = jewel;
  ctx.beginPath(); ctx.arc(2.4 * s, 1.4 * s, 0.75 * s, 0, Math.PI * 2); ctx.fill();          // lantern
  ctx.restore();
  return { x, y };
}

// Photo scaled to MAX with saturation + contrast pushed (manual, works in every browser).
function boosted(img) {
  const s = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, c.width, c.height);
  const d = ctx.getImageData(0, 0, c.width, c.height);
  const p = d.data, sat = 1.55, con = 1.18;
  for (let i = 0; i < p.length; i += 4) {
    const r = p[i], g = p[i + 1], b = p[i + 2];
    const grey = 0.299 * r + 0.587 * g + 0.114 * b;
    p[i] = clamp(((grey + (r - grey) * sat) - 128) * con + 128);
    p[i + 1] = clamp(((grey + (g - grey) * sat) - 128) * con + 128);
    p[i + 2] = clamp(((grey + (b - grey) * sat) - 128) * con + 128);
  }
  ctx.putImageData(d, 0, 0);
  return c;
}

// Soft blur by shrinking then growing in steps (smooth, no filter support needed).
function blurred(src) {
  let cur = src;
  for (const f of [0.5, 0.25, 0.12, 0.06]) {
    const c = document.createElement('canvas');
    c.width = Math.max(4, Math.round(src.width * f)); c.height = Math.max(4, Math.round(src.height * f));
    const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
    x.drawImage(cur, 0, 0, c.width, c.height);
    cur = c;
  }
  const out = document.createElement('canvas');
  out.width = src.width; out.height = src.height;
  const o = out.getContext('2d'); o.imageSmoothingQuality = 'high';
  o.drawImage(cur, 0, 0, out.width, out.height);
  return out;
}

// The sharp strip with feathered edges, ready to lay over the blurred copy.
function bandOf(sharp, centre, size) {
  const c = document.createElement('canvas');
  c.width = sharp.width; c.height = sharp.height;
  const x = c.getContext('2d');
  x.drawImage(sharp, 0, 0);
  const H = c.height, half = (size / 2) * H, feather = Math.max(12, half * 0.9), mid = centre * H;
  const g = x.createLinearGradient(0, mid - half - feather, 0, mid + half + feather);
  const span = 2 * (half + feather);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(feather / span, 'rgba(0,0,0,1)');
  g.addColorStop(1 - feather / span, 'rgba(0,0,0,1)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.globalCompositeOperation = 'destination-in';
  x.fillStyle = g;
  x.fillRect(0, 0, c.width, H);
  return c;
}

function save(url, name) {
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
}

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
