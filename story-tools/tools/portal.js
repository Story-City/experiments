// Portal: cut a shape out of one photo and drop it into another.
const TEXT = {
  aKicker: 'Step 1 · The far side',
  aTitle: 'Snap where the portal leads',
  aSub: 'This is the place you will peek through to.',
  aSnap: 'Snap the Far Side',
  shapeKicker: 'Step 2 · Cut',
  shapeTitle: 'Pick a portal shape',
  shapes: { circle: 'Circle', star: 'Star', keyhole: 'Keyhole', heart: 'Heart' },
  cut: 'Cut It Out',
  bKicker: 'Step 3 · Right here',
  bTitle: 'Now snap where you are',
  bSub: 'The portal opens in this photo.',
  bSnap: 'Snap Right Here',
  dropKicker: 'Step 4 · Drop',
  dropTitle: 'Place your portal',
  dropHint: 'Drag it where you like. Pinch or slide to resize.',
  size: 'Size',
  finish: 'Open the Portal',
  sheetKicker: 'Portal open',
  sheetTitle: 'A door to somewhere else',
  sheetSub: 'Two places, one photo.',
  save: 'Save',
  again: 'Try Another',
  saved: 'Saved to your downloads',
  oops: 'That photo would not open',
};

const SHAPES = ['circle', 'star', 'keyhole', 'heart'];
const MAX = 1000;
const RIM = '#9883F8';      // portal jewel
const SPARK = '#fbf7ff';    // starlight

export default function run(k) {
  const { h } = k;
  const pick = { a: null, shape: 'circle', b: null };
  k.css('portal', `
    .pt-shapes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px; }
    .pt-shape { min-height: 120px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--velvet); display: grid; place-items: center; gap: 6px; padding: 14px 8px 10px; font: 600 14px var(--f-body); color: var(--mist); }
    .pt-shape canvas { width: 64px; height: 64px; }
    .pt-shape[aria-pressed="true"] { border-color: var(--jewel); box-shadow: 0 0 0 1px var(--jewel), 0 0 24px color-mix(in srgb, var(--jewel) 35%, transparent); color: var(--starlight); }
    .pt-thumb { width: 72px; height: 72px; object-fit: cover; border-radius: 10px; display: block; margin-top: 14px; border: 1.5px solid var(--line); }
    .pt-stage { position: relative; border-radius: 12px; overflow: hidden; touch-action: none; user-select: none; cursor: grab; }
    .pt-stage canvas { display: block; width: 100%; height: auto; }
    .pt-row { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
    .pt-row label { font: 700 11px var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); }
    .pt-row .slider { margin: 0; }
    .pt-result { width: 100%; border-radius: 10px; display: block; margin: 14px 0 4px; box-shadow: 0 0 0 1px var(--jewel), 0 0 40px color-mix(in srgb, var(--jewel) 35%, transparent); }
  `);

  stepA();

  function stepA() {
    k.show(
      k.bar('1 / 4'),
      h('p', { class: 'kicker' }, TEXT.aKicker),
      h('h1', { class: 'display' }, TEXT.aTitle),
      h('p', { class: 'sub' }, TEXT.aSub),
      h('div', { class: 'spacer' }),
      k.camera(TEXT.aSnap, async (url) => {
        try { pick.a = await k.loadImage(url); stepShape(); } catch (e) { k.toast(TEXT.oops); }
      }, () => k.samplePhoto(0)),
    );
  }

  function stepShape() {
    const buttons = SHAPES.map((s) => {
      const c = h('canvas', { width: 128, height: 128 });
      const x = c.getContext('2d');
      x.fillStyle = RIM; x.fill(shapePath(s, 64, 64, 50));
      return h('button', { class: 'pt-shape', 'aria-pressed': String(pick.shape === s), onclick: (e) => {
        pick.shape = s;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
      } }, c, TEXT.shapes[s]);
    });
    k.show(
      k.bar('2 / 4'),
      h('p', { class: 'kicker' }, TEXT.shapeKicker),
      h('h1', { class: 'display' }, TEXT.shapeTitle),
      h('div', { class: 'pt-shapes' }, buttons),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: stepB }, TEXT.cut)),
    );
  }

  function stepB() {
    k.show(
      k.bar('3 / 4'),
      h('p', { class: 'kicker' }, TEXT.bKicker),
      h('h1', { class: 'display' }, TEXT.bTitle),
      h('p', { class: 'sub' }, TEXT.bSub),
      h('img', { class: 'pt-thumb', src: pick.a.src, alt: '' }),
      h('div', { class: 'spacer' }),
      k.camera(TEXT.bSnap, async (url) => {
        try { pick.b = await k.loadImage(url); drop(); } catch (e) { k.toast(TEXT.oops); }
      }, () => k.samplePhoto(1 + Math.floor(Math.random() * 3))),
    );
  }

  function drop() {
    const base = fit(pick.b);
    const out = h('canvas', { width: base.width, height: base.height });
    const ctx = out.getContext('2d');
    const W = out.width, H = out.height;
    const minR = W * 0.12, maxR = W * 0.48;
    const p = { x: W / 2, y: H * 0.45, r: W * 0.26 };

    const draw = () => render(ctx, base, pick.a, pick.shape, p);
    const slider = h('input', { class: 'slider', type: 'range', min: Math.round(minR), max: Math.round(maxR), value: Math.round(p.r), 'aria-label': TEXT.size,
      oninput: (e) => { p.r = +e.target.value; draw(); } });
    const stage = h('div', { class: 'pt-stage' }, out);

    // drag with one finger, pinch with two
    const pts = new Map();
    let last = null, pinch = null;
    const toCanvas = (e) => { const b = out.getBoundingClientRect(); return { x: (e.clientX - b.left) * (W / b.width), y: (e.clientY - b.top) * (H / b.height) }; };
    stage.addEventListener('pointerdown', (e) => {
      stage.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, toCanvas(e));
      last = toCanvas(e);
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), r: p.r }; }
    });
    stage.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return;
      const now = toCanvas(e);
      pts.set(e.pointerId, now);
      if (pts.size >= 2 && pinch) {
        const [a, b] = [...pts.values()];
        p.r = Math.min(maxR, Math.max(minR, pinch.r * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.d)));
        slider.value = Math.round(p.r);
      } else if (last) {
        p.x = Math.min(W, Math.max(0, p.x + now.x - last.x));
        p.y = Math.min(H, Math.max(0, p.y + now.y - last.y));
        last = now;
      }
      draw();
    });
    const up = (e) => { pts.delete(e.pointerId); pinch = null; last = pts.size ? [...pts.values()][0] : null; };
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);

    k.show(
      k.bar('4 / 4'),
      h('p', { class: 'kicker' }, TEXT.dropKicker),
      h('h1', { class: 'display', style: 'font-size:28px' }, TEXT.dropTitle),
      h('p', { class: 'hint' }, TEXT.dropHint),
      stage,
      h('div', { class: 'pt-row' }, h('label', {}, TEXT.size), slider),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: () => finish(out) }, TEXT.finish)),
    );
    draw();
  }

  function finish(canvas) {
    const url = canvas.toDataURL('image/jpeg', 0.9);
    k.openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.sheetKicker),
        h('h3', {}, TEXT.sheetTitle),
        h('img', { class: 'pt-result', src: url, alt: TEXT.sheetTitle }),
        h('p', { class: 'hint' }, TEXT.sheetSub)),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => { save(url, 'portal.jpg'); k.toast(TEXT.saved); } }, TEXT.save),
        h('button', { class: 'btn ghost', onclick: stepA }, TEXT.again)),
    ], null, k.tool.jewel);
  }
}

/* ---------- drawing ---------- */

// Photo B, then photo A seen through the shape, then a glowing jewel rim.
function render(ctx, base, far, shape, p) {
  const { width: W, height: H } = ctx.canvas;
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(base, 0, 0, W, H);
  const path = shapePath(shape, p.x, p.y, p.r);

  // soft shadow so the hole sits "in" the scene
  ctx.save();
  ctx.shadowColor = 'rgba(11, 6, 32, 0.6)'; ctx.shadowBlur = p.r * 0.25;
  ctx.fillStyle = '#1a0b3d'; ctx.fill(path);
  ctx.restore();

  ctx.save();
  ctx.clip(path);
  const box = p.r * 2.2;
  const s = Math.max(box / far.naturalWidth, box / far.naturalHeight);
  const w = far.naturalWidth * s, h = far.naturalHeight * s;
  ctx.drawImage(far, p.x - w / 2, p.y - h / 2, w, h);
  ctx.restore();

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.shadowColor = RIM; ctx.shadowBlur = p.r * 0.35;
  ctx.strokeStyle = RIM; ctx.lineWidth = Math.max(5, p.r * 0.09); ctx.stroke(path);
  ctx.shadowBlur = p.r * 0.12;
  ctx.strokeStyle = SPARK; ctx.lineWidth = Math.max(1.5, p.r * 0.02); ctx.stroke(path);
  ctx.restore();
}

// One closed outline per shape, centred on (cx, cy) with "radius" r.
function shapePath(shape, cx, cy, r) {
  const p = new Path2D();
  if (shape === 'circle') {
    p.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (shape === 'star') {
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.46 : r;
      i ? p.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : p.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    p.closePath();
  } else if (shape === 'keyhole') {
    const R = r * 0.5, w = r * 0.2, oy = cy - r * 0.3;
    const dy = Math.sqrt(R * R - w * w);
    p.moveTo(cx - r * 0.45, cy + r);
    p.lineTo(cx - w, oy + dy);
    p.arc(cx, oy, R, Math.atan2(dy, -w), Math.atan2(dy, w), false);
    p.lineTo(cx + r * 0.45, cy + r);
    p.closePath();
  } else {
    p.moveTo(cx, cy + r * 0.9);
    p.bezierCurveTo(cx - r * 1.35, cy + r * 0.05, cx - r * 0.85, cy - r * 1.05, cx, cy - r * 0.42);
    p.bezierCurveTo(cx + r * 0.85, cy - r * 1.05, cx + r * 1.35, cy + r * 0.05, cx, cy + r * 0.9);
    p.closePath();
  }
  return p;
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
