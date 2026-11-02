// Then and Now: an old photo floats over your camera; line them up, then slide between the two.
const TEXT = {
  kicker: 'From the archive',
  title: 'Stand where they stood',
  sub: 'Someone took this photo right here, long ago. Find the spot and line it up.',
  archive: 'Story City Archive · No. 0412',
  caption: 'Larkspur Lane, 1924',
  captionMore: 'The new elm, planted by the school’s Grade 3 class',
  pretendNote: 'A made-up archive photo for this prototype.',
  start: 'Find the Spot',
  liveKicker: 'Line it up',
  liveTitle: 'Match the old photo',
  liveHint: 'Move until the edges and the tree line up with the faded photo.',
  livePretend: 'No camera here, so this is a pretend live view.',
  fade: 'Old photo',
  lined: 'Lined Up',
  resultKicker: 'Then and now',
  resultTitle: 'Slide through time',
  resultHint: 'Drag the line to move between then and now.',
  then: 'Then',
  now: 'Now',
  keep: 'Keep It',
  sheetKicker: 'A hundred years apart',
  sheetTitle: 'Same spot, two times',
  save: 'Save',
  again: 'Line Up Again',
  saved: 'Saved to your downloads',
};

const OLD_SRC = 'img/tree-photo.jpg';
const LIVE_FALLBACK = 'img/tree-photo.jpg';
const W = 597, H = 900;     // working size, same shape as the archive photo

export default function run(k) {
  const { h } = k;
  let oldPhoto = null;
  k.css('then-now', `
    .tn-print { background: var(--pearl); padding: 12px 12px 14px; border-radius: 4px; rotate: -1.2deg; box-shadow: 0 22px 46px rgba(11, 6, 32, 0.55); margin: 16px auto 0; width: min(100%, calc(44dvh * 0.663 + 24px)); }
    .tn-print canvas { width: 100%; height: auto; display: block; }
    .tn-print .cap { font: italic 500 18px/1.2 var(--f-head); color: var(--midnight); margin: 10px 0 0; }
    .tn-print .more { font-size: 13px; color: var(--velvet); margin: 2px 0 0; }
    .tn-print .no { font: 700 9.5px var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; color: var(--line); margin: 8px 0 0; }
    .tn-frame { position: relative; width: min(100%, calc(50dvh * 0.663)); aspect-ratio: 597 / 900; margin: 6px auto 0; border-radius: 12px; overflow: hidden; background: var(--ink); user-select: none; touch-action: none; }
    .tn-frame > video, .tn-frame > img, .tn-frame > canvas { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
    .tn-ghost { pointer-events: none; }
    .tn-c { position: absolute; width: 28px; height: 28px; border: 3px solid var(--jewel); pointer-events: none; filter: drop-shadow(0 0 4px rgba(11, 6, 32, 0.7)); }
    .tn-c.tl { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
    .tn-c.tr { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
    .tn-c.bl { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
    .tn-c.br { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }
    .tn-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
    .tn-row label { font: 700 11px var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); white-space: nowrap; }
    .tn-row .slider { margin: 0; }
    .tn-split { position: absolute; top: 0; bottom: 0; width: 0; border-left: 2px solid var(--starlight); pointer-events: none; }
    .tn-split::after { content: "‹ ›"; position: absolute; top: 50%; left: -23px; width: 44px; height: 44px; margin-top: -22px; border-radius: 50%; background: var(--jewel); color: var(--midnight); display: grid; place-items: center; font: 700 16px var(--f-body); box-shadow: 0 4px 14px rgba(11, 6, 32, 0.5); }
    .tn-lab { position: absolute; top: 10px; font: 700 10.5px var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; color: var(--starlight); background: rgba(11, 6, 32, 0.55); padding: 4px 8px; border-radius: 999px; pointer-events: none; }
    .tn-result { width: 100%; border-radius: 10px; display: block; margin: 14px 0 4px; box-shadow: 0 0 0 1px var(--jewel), 0 0 40px color-mix(in srgb, var(--jewel) 30%, transparent); }
  `);

  intro();

  async function intro() {
    if (!oldPhoto) oldPhoto = agePhoto(await k.loadImage(OLD_SRC));
    const shown = h('canvas', { width: W, height: H });
    shown.getContext('2d').drawImage(oldPhoto, 0, 0);
    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display', style: 'font-size:30px' }, TEXT.title),
      h('p', { class: 'sub' }, TEXT.sub),
      h('figure', { class: 'tn-print' }, shown,
        h('p', { class: 'cap' }, TEXT.caption),
        h('p', { class: 'more' }, TEXT.captionMore),
        h('p', { class: 'no' }, TEXT.archive)),
      h('p', { class: 'hint centre' }, TEXT.pretendNote),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: live }, TEXT.start)),
    );
  }

  function live() {
    let stream = null, video = null;
    const stop = () => { stream?.getTracks().forEach((t) => t.stop()); stream = null; };
    k.onLeave(stop);

    // start with the pretend view, swap to the real camera if it says yes
    const fallback = h('img', { src: LIVE_FALLBACK, alt: '' });
    const ghostImg = h('canvas', { class: 'tn-ghost', width: W, height: H, style: 'opacity:0.5' });
    ghostImg.getContext('2d').drawImage(oldPhoto, 0, 0);
    const frame = h('div', { class: 'tn-frame' }, fallback, ghostImg,
      ['tl', 'tr', 'bl', 'br'].map((c) => h('span', { class: `tn-c ${c}` })));
    const note = h('p', { class: 'hint centre', style: 'margin:6px 0 0' }, TEXT.livePretend);
    const slider = h('input', { class: 'slider', type: 'range', min: 10, max: 90, value: 50, 'aria-label': TEXT.fade,
      oninput: (e) => { ghostImg.style.opacity = e.target.value / 100; } });

    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.liveKicker),
      h('h1', { class: 'display', style: 'font-size:28px' }, TEXT.liveTitle),
      h('p', { class: 'hint', style: 'margin:4px 0 6px' }, TEXT.liveHint),
      frame,
      note,
      h('div', { class: 'tn-row' }, h('label', {}, TEXT.fade), slider),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: () => {
        const now = grab(video && video.videoWidth ? video : fallback);
        stop();
        result(now);
      } }, TEXT.lined)),
    );

    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
        .then((s) => {
          if (!frame.isConnected) { s.getTracks().forEach((t) => t.stop()); return; }
          stream = s;
          video = h('video', { autoplay: true, muted: true, playsinline: true });
          video.muted = true; video.srcObject = s;
          video.play?.().catch(() => {});
          fallback.replaceWith(video);
          note.remove();
        })
        .catch(() => {});
    }
  }

  function result(now) {
    const thenC = h('canvas', { width: W, height: H });
    thenC.getContext('2d').drawImage(oldPhoto, 0, 0);
    const nowC = h('canvas', { width: W, height: H });
    nowC.getContext('2d').drawImage(now, 0, 0);
    const line = h('div', { class: 'tn-split' });
    const frame = h('div', { class: 'tn-frame' }, nowC, thenC, line,
      h('span', { class: 'tn-lab', style: 'left:10px' }, TEXT.then),
      h('span', { class: 'tn-lab', style: 'right:10px' }, TEXT.now));
    let pos = 0.5;
    const set = (p) => {
      pos = Math.min(1, Math.max(0, p));
      thenC.style.clipPath = `inset(0 ${(1 - pos) * 100}% 0 0)`;
      line.style.left = `${pos * 100}%`;
      slider.value = Math.round(pos * 100);
    };
    const slider = h('input', { class: 'slider', type: 'range', min: 0, max: 100, value: 50, 'aria-label': TEXT.resultHint,
      oninput: (e) => set(e.target.value / 100) });
    const follow = (e) => { const r = frame.getBoundingClientRect(); set((e.clientX - r.left) / r.width); };
    frame.addEventListener('pointerdown', (e) => { frame.setPointerCapture(e.pointerId); follow(e); });
    frame.addEventListener('pointermove', (e) => { if (frame.hasPointerCapture(e.pointerId)) follow(e); });

    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.resultKicker),
      h('h1', { class: 'display', style: 'font-size:28px' }, TEXT.resultTitle),
      h('p', { class: 'hint', style: 'margin:4px 0 6px' }, TEXT.resultHint),
      frame,
      slider,
      h('div', { class: 'btns', style: 'margin-top:0' }, h('button', { class: 'btn jewel', onclick: () => keep(thenC, nowC, pos) }, TEXT.keep)),
    );
    set(0.5);
  }

  function keep(thenC, nowC, pos) {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.drawImage(nowC, 0, 0);
    x.save(); x.beginPath(); x.rect(0, 0, W * pos, H); x.clip(); x.drawImage(thenC, 0, 0); x.restore();
    x.fillStyle = '#fbf7ff'; x.fillRect(W * pos - 2, 0, 4, H);
    const url = c.toDataURL('image/jpeg', 0.9);
    k.openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.sheetKicker),
        h('h3', {}, TEXT.sheetTitle),
        h('img', { class: 'tn-result', src: url, alt: TEXT.sheetTitle }),
        h('p', { class: 'hint' }, `${TEXT.caption} · ${new Date().getFullYear()}`)),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => { save(url, 'then-and-now.jpg'); k.toast(TEXT.saved); } }, TEXT.save),
        h('button', { class: 'btn ghost', onclick: live }, TEXT.again)),
    ], null, k.tool.jewel);
  }
}

/* ---------- drawing ---------- */

// Make the archive print: sepia, faded, grainy, vignetted, a few scratches.
function agePhoto(img) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  cover(x, img, img.naturalWidth, img.naturalHeight);
  const d = x.getImageData(0, 0, W, H), p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const l = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
    const f = l * 0.82 + 30;                       // lift the blacks, soften the whites
    const n = (Math.random() - 0.5) * 34;          // film grain
    p[i] = f * 1.07 + n; p[i + 1] = f * 0.92 + n; p[i + 2] = f * 0.72 + n;
  }
  x.putImageData(d, 0, 0);
  // vignette
  const g = x.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.95);
  g.addColorStop(0, 'rgba(11, 6, 32, 0)'); g.addColorStop(1, 'rgba(11, 6, 32, 0.62)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // scratches and dust
  x.strokeStyle = 'rgba(244, 235, 221, 0.55)';
  for (let i = 0; i < 6; i++) {
    const sx = Math.random() * W;
    x.lineWidth = 0.6 + Math.random();
    x.beginPath(); x.moveTo(sx, Math.random() * H * 0.3);
    x.quadraticCurveTo(sx + (Math.random() - 0.5) * 40, H * 0.5, sx + (Math.random() - 0.5) * 30, H * (0.6 + Math.random() * 0.4));
    x.stroke();
  }
  x.fillStyle = 'rgba(244, 235, 221, 0.6)';
  for (let i = 0; i < 40; i++) { x.beginPath(); x.arc(Math.random() * W, Math.random() * H, Math.random() * 1.8, 0, Math.PI * 2); x.fill(); }
  return c;
}

// Grab the live view (video or pretend image) at the archive photo's shape.
function grab(src) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const sw = src.videoWidth || src.naturalWidth, sh = src.videoHeight || src.naturalHeight;
  cover(c.getContext('2d'), src, sw, sh);
  return c;
}

function cover(x, src, sw, sh) {
  const s = Math.max(W / sw, H / sh);
  const w = sw * s, hh = sh * s;
  x.drawImage(src, (W - w) / 2, (H - hh) / 2, w, hh);
}

function save(url, name) {
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
}
