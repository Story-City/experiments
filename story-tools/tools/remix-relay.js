// Remix Relay: the photo is a baton on a mission. Catch it, add one remix,
// and pass it toward the Society's archive. Faces, plates and house numbers get blurred first.
const TEXT = {
  kicker: 'The baton',
  title: 'A photo on a mission',
  goal: 'Get this photo to the Society’s archive by the river.',
  progress: (done, left) => `${done} agents so far · ${left} more to the archive`,
  arrived: 'It reached the archive!',
  start: 'The first agent',
  original: 'Original',
  pick: 'Pick your remix',
  pickHint: 'One tap. The preview changes live.',
  blurTag: 'Blurred',
  safe: 'Faces, licence plates and house numbers are blurred before anyone else sees it.',
  pass: 'Pass It On',
  choose: 'Choose a Remix First',
  doneKicker: 'Baton passed',
  doneTitle: 'It’s on its way',
  doneSub: (n, left) => (left > 0
    ? `Your remix is link ${n} in the chain. ${left === 1 ? 'One more agent' : `${left} more agents`} and it reaches the archive.`
    : `Your remix is link ${n}, the last one. The archive has it now.`),
  passedCount: (n) => (n === 1 ? 'You’ve passed 1 baton' : `You’ve passed ${n} batons`),
  again: 'Catch Another',
  back: 'Back to Tools',
  you: 'You, just now',
};

// Pretend agents who touched the baton before you (code names only, never real names).
const PLAYERS = [
  { who: 'Agent Juniper', fx: 'posterize' },
  { who: 'Agent Otis', fx: 'hue' },
  { who: 'Agent Moth', fx: 'mirror' },
];
const GOAL = 6;   // agents needed to reach the archive (3 before you, you, 2 after)

const FX = {
  posterize: 'Poster',
  hue: 'Hue Shift',
  pixel: 'Pixels',
  mirror: 'Mirror',
  dots: 'Dots',
};

const W = 240, HT = 320;   // working size (portrait)
// The pretend "house number" on the street photo, blurred before anyone sees it.
const BLUR = { x: 78, y: 260, w: 40, h: 40 };   // kept left of centre so Mirror copies it cleanly
const KEY = 'st-remix-relay';

export default function run(k) {
  const { h, show, bar, openSheet, closeSheet, css, loadImage, samplePhoto, tool, home, onLeave } = k;
  css('remix-relay', CSS);

  let chain = [];      // [{ who, fx, canvas }]
  let mine = null;     // chosen fx id
  let timer = null;
  onLeave(() => clearTimeout(timer));

  // Build the seeded chain from the street photo (blurred once, so every link stays safe).
  async function catchBaton() {
    const img = await loadImage(samplePhoto(0));
    let c = blurRegion(fit(img), BLUR);
    chain = [{ who: TEXT.start, fx: null, canvas: c }];
    for (const p of k.shuffle(PLAYERS)) {
      c = apply(c, p.fx);
      chain.push({ who: p.who, fx: p.fx, canvas: c });
    }
    mine = null;
    remixScreen();
  }

  function remixScreen() {
    const last = chain[chain.length - 1].canvas;
    const agents = chain.length - 1;
    const mirrored = chain.some((s) => s.fx === 'mirror');
    const preview = h('div', { class: 'rr-preview' }, copy(last), ...blurTag(mirrored));
    const passBtn = h('button', { class: 'btn jewel', disabled: true, onclick: () => pass(preview) }, TEXT.choose);
    const fxBtns = Object.entries(FX).map(([id, label]) => h('button', {
      class: 'rr-fx', 'aria-pressed': 'false',
      onclick: (e) => {
        mine = id;
        fxRow.querySelectorAll('.rr-fx').forEach((b) => b.setAttribute('aria-pressed', 'false'));
        e.currentTarget.setAttribute('aria-pressed', 'true');
        preview.replaceChildren(apply(last, id), ...blurTag(mirrored || id === 'mirror'));
        passBtn.disabled = false; passBtn.textContent = TEXT.pass;
      },
    }, swatch(last, id), h('span', {}, label)));
    const fxRow = h('div', { class: 'rr-fxrow' }, fxBtns);

    show(
      bar(`${agents} remixes`),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      mission(agents, true),
      chainRow(chain),
      preview,
      h('p', { class: 'kicker rr-pick' }, TEXT.pick),
      fxRow,
      h('p', { class: 'hint centre' }, TEXT.pickHint),
      h('p', { class: 'rr-safe' }, h('span', { class: 'rr-shield', 'aria-hidden': 'true' }), TEXT.safe),
      h('div', { class: 'btns' }, passBtn),
    );
  }

  // The baton flies off toward the archive, then the sheet shows the full chain.
  function pass(preview) {
    const done = apply(chain[chain.length - 1].canvas, mine);
    const full = [...chain, { who: TEXT.you, fx: mine, canvas: done }];
    const n = savePass(mine);
    const agents = full.length - 1;
    preview.classList.add('rr-fly');
    timer = setTimeout(() => {
      openSheet([
        h('div', { class: 'celebrate' },
          h('p', { class: 'kicker' }, TEXT.doneKicker),
          h('h3', {}, TEXT.doneTitle),
          h('p', { class: 'more' }, TEXT.doneSub(agents, GOAL - agents))),
        mission(agents, false),
        chainRow(full, true),
        h('p', { class: 'hint centre' }, TEXT.passedCount(n)),
        h('div', { class: 'btns' },
          h('button', { class: 'btn jewel', onclick: () => { closeSheet(); catchBaton(); } }, TEXT.again),
          h('button', { class: 'link', onclick: home }, TEXT.back)),
      ], null, tool.jewel);
    }, 900);
  }

  catchBaton();

  /* ---------- pieces ---------- */
  // The goal card: one dot per agent on the way to the archive. youNext = you're the glowing next dot.
  function mission(agents, youNext) {
    const left = Math.max(0, GOAL - agents);
    const dots = Array.from({ length: GOAL }, (_, i) => {
      const state = i < agents ? (!youNext && i === agents - 1 ? 'you' : 'done') : (youNext && i === agents ? 'next' : 'todo');
      return h('i', { class: `rr-dot rr-${state}` });
    });
    return h('div', { class: 'frame rr-goal' },
      h('p', { class: 'rr-goal-text' }, TEXT.goal),
      h('div', { class: 'rr-track', role: 'img', 'aria-label': TEXT.progress(agents, left) },
        h('span', { class: 'rr-line' }, h('span', { class: 'rr-fill', style: `width:${(Math.min(agents, GOAL) / GOAL) * 100}%` })),
        dots,
        h('span', { class: 'rr-archive', 'aria-hidden': 'true' }, h('b'), h('em'))),
      h('p', { class: 'rr-prog' }, left ? TEXT.progress(agents, left) : TEXT.arrived));
  }
  // Dashed boxes over the blurred spot (Mirror copies it to the other half, so two boxes).
  function blurTag(mirrored) {
    const box = (x, label) => h('span', { class: 'rr-blur', style: `left:${(x / W) * 100}%; top:${(BLUR.y / HT) * 100}%; width:${(BLUR.w / W) * 100}%; height:${(BLUR.h / HT) * 100}%` },
      label ? h('span', {}, TEXT.blurTag) : null);
    return mirrored ? [box(BLUR.x, true), box(W - BLUR.x - BLUR.w, false)] : [box(BLUR.x, true)];
  }
  function chainRow(list, mineLast) {
    return h('ol', { class: 'rr-chain' }, list.map((s, i) => h('li', { class: mineLast && i === list.length - 1 ? 'rr-mine' : null },
      copy(s.canvas),
      h('b', {}, s.fx ? FX[s.fx] : TEXT.original),
      h('span', {}, s.who))));
  }
  function swatch(src, id) {
    const c = apply(src, id);
    c.className = 'rr-sw';
    return c;
  }
}

// Soft blur on one rectangle: shrink it to a few pixels, then smooth it back up (works in every browser).
function blurRegion(src, r) {
  const c = copy(src);
  const x = c.getContext('2d');
  const tiny = document.createElement('canvas');
  tiny.width = 5; tiny.height = 4;
  const t = tiny.getContext('2d');
  t.imageSmoothingEnabled = true;
  t.drawImage(src, r.x, r.y, r.w, r.h, 0, 0, tiny.width, tiny.height);
  x.save();
  x.beginPath(); x.roundRect ? x.roundRect(r.x, r.y, r.w, r.h, 6) : x.rect(r.x, r.y, r.w, r.h); x.clip();
  x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
  x.drawImage(tiny, r.x - 4, r.y - 4, r.w + 8, r.h + 8);
  x.restore();
  return c;
}

/* ---------- canvas remixes ---------- */
function canvas() {
  const c = document.createElement('canvas');
  c.width = W; c.height = HT;
  return c;
}
function copy(src) {
  const c = canvas();
  c.getContext('2d').drawImage(src, 0, 0);
  return c;
}
// Cover-crop the photo into the working canvas.
function fit(img) {
  const c = canvas();
  const s = Math.max(W / img.width, HT / img.height);
  const w = img.width * s, ht = img.height * s;
  c.getContext('2d').drawImage(img, (W - w) / 2, (HT - ht) / 2, w, ht);
  return c;
}

function apply(src, fx) {
  const c = copy(src);
  const x = c.getContext('2d');
  if (fx === 'pixel') {
    const s = document.createElement('canvas');
    s.width = W / 12; s.height = HT / 12;
    s.getContext('2d').drawImage(src, 0, 0, s.width, s.height);
    x.imageSmoothingEnabled = false;
    x.drawImage(s, 0, 0, W, HT);
    return c;
  }
  if (fx === 'mirror') {
    x.save(); x.translate(W, 0); x.scale(-1, 1);
    x.drawImage(src, 0, 0, W / 2, HT, 0, 0, W / 2, HT);
    x.restore();
    return c;
  }
  if (fx === 'dots') return dots(src);
  const d = x.getImageData(0, 0, W, HT);
  const p = d.data;
  if (fx === 'posterize') {
    const step = 255 / 3;
    for (let i = 0; i < p.length; i += 4) for (let j = 0; j < 3; j++) p[i + j] = Math.round(p[i + j] / step) * step;
  } else if (fx === 'hue') {
    const m = hueMatrix(140);
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i], g = p[i + 1], b = p[i + 2];
      p[i] = m[0] * r + m[1] * g + m[2] * b;
      p[i + 1] = m[3] * r + m[4] * g + m[5] * b;
      p[i + 2] = m[6] * r + m[7] * g + m[8] * b;
    }
  }
  x.putImageData(d, 0, 0);
  return c;
}

// Standard hue-rotate colour matrix (same as the CSS filter).
function hueMatrix(deg) {
  const a = deg * Math.PI / 180, cos = Math.cos(a), sin = Math.sin(a);
  return [
    0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928,
    0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.140, 0.072 - cos * 0.072 - sin * 0.283,
    0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072,
  ];
}

// Colour-dot halftone: each cell becomes a dot of its average colour, sized by brightness.
function dots(src) {
  const c = canvas();
  const x = c.getContext('2d');
  const d = src.getContext('2d').getImageData(0, 0, W, HT).data;
  x.fillStyle = '#1a0b3d';
  x.fillRect(0, 0, W, HT);
  const cell = 8;
  for (let y = 0; y < HT; y += cell) for (let xx = 0; xx < W; xx += cell) {
    const i = ((y + cell / 2) * W + xx + cell / 2) * 4;
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
    x.fillStyle = `rgb(${r},${g},${b})`;
    x.beginPath();
    x.arc(xx + cell / 2, y + cell / 2, 1 + lum * (cell / 2), 0, Math.PI * 2);
    x.fill();
  }
  return c;
}

function savePass(fx) {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    list.push({ fx, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(-50)));
    return list.length;
  } catch (e) { return 1; }
}

const CSS = `
.rr-chain { list-style: none; margin: 18px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); gap: 6px; position: relative; }
.rr-chain li { position: relative; min-width: 0; text-align: center; }
.rr-chain li + li::before { content: "›"; position: absolute; left: -7px; top: 22px; color: var(--jewel); font-size: 14px; }
.rr-chain canvas { width: 100%; aspect-ratio: 3 / 4; border-radius: 6px; display: block; border: 1px solid var(--line); }
.rr-chain b { display: block; font: 700 9.5px/1.2 var(--f-body); letter-spacing: 0.08em; text-transform: uppercase; color: var(--starlight); margin-top: 5px; }
.rr-chain span { display: block; font-size: 10.5px; line-height: 1.2; color: var(--lilac); overflow-wrap: anywhere; }
.rr-chain .rr-mine canvas { border-color: var(--jewel); box-shadow: 0 0 0 2px var(--jewel), 0 0 18px color-mix(in srgb, var(--jewel) 50%, transparent); }
.rr-preview { position: relative; margin: 18px auto 0; width: 62%; transition: transform 0.9s cubic-bezier(0.5, 0, 0.8, 0.4), opacity 0.9s; }
.rr-preview canvas { width: 100%; aspect-ratio: 3 / 4; border-radius: 10px; display: block; box-shadow: 0 0 0 1px var(--jewel), 0 18px 40px rgba(0, 0, 0, 0.45); }
.rr-preview.rr-fly { transform: translate(140px, -520px) rotate(28deg) scale(0.4); opacity: 0; }
.rr-pick { margin: 20px 0 8px; text-align: center; }
.rr-fxrow { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.rr-fx { border: 1.5px solid var(--line); background: var(--velvet); border-radius: 10px; padding: 5px 3px 6px; min-height: 44px; display: flex; flex-direction: column; align-items: center; gap: 4px; font: 700 10.5px/1.1 var(--f-body); color: var(--mist); }
.rr-fx[aria-pressed="true"] { border-color: var(--jewel); color: var(--starlight); background: color-mix(in srgb, var(--jewel) 22%, var(--velvet)); }
.rr-sw { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; display: block; }
.rr-goal, .rr-chain, .rr-preview, .rr-safe, .rr-fxrow { flex-shrink: 0; }
.rr-goal { padding: 16px 18px 12px; margin-top: 12px; }
.rr-goal-text { margin: 0 0 12px; font: 600 19px/1.2 var(--f-head); color: var(--starlight); text-wrap: balance; }
.rr-track { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 4px; padding-right: 2px; height: 34px; }
.rr-line { position: absolute; left: 6px; right: 26px; top: 50%; height: 2px; translate: 0 -50%; background: var(--line); border-radius: 2px; }
.rr-fill { display: block; height: 100%; background: var(--jewel); border-radius: 2px; transition: width 0.6s; }
.rr-dot { position: relative; flex: 0 0 auto; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--line); background: var(--velvet); }
.rr-dot.rr-done { background: var(--jewel); border-color: var(--jewel); }
.rr-dot.rr-next, .rr-dot.rr-you { width: 18px; height: 18px; border-color: var(--jewel); background: var(--starlight); box-shadow: 0 0 0 4px color-mix(in srgb, var(--jewel) 30%, transparent); animation: rr-pulse 1.4s ease-in-out infinite alternate; }
.rr-dot.rr-you { background: var(--jewel); }
@keyframes rr-pulse { to { box-shadow: 0 0 0 7px color-mix(in srgb, var(--jewel) 12%, transparent); } }
.rr-archive { position: relative; flex: 0 0 auto; width: 26px; height: 24px; }
.rr-archive b { position: absolute; left: 0; right: 0; top: 0; height: 9px; background: var(--pearl); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.rr-archive em { position: absolute; left: 3px; right: 3px; top: 10px; bottom: 0; border-radius: 1px; background: repeating-linear-gradient(90deg, var(--pearl) 0 3px, transparent 3px 6px); }
.rr-prog { margin: 8px 0 0; font: 700 11px/1.3 var(--f-body); letter-spacing: 0.1em; text-transform: uppercase; color: var(--glow); }
.rr-blur { position: absolute; border: 1.5px dashed var(--starlight); border-radius: 6px; pointer-events: none; }
.rr-blur span { position: absolute; left: 50%; bottom: calc(100% + 3px); translate: -50% 0; white-space: nowrap; padding: 1px 6px; border-radius: 999px; background: var(--starlight); color: var(--midnight); font: 800 9px/1.4 var(--f-body); letter-spacing: 0.08em; text-transform: uppercase; }
.rr-safe { display: flex; gap: 10px; align-items: flex-start; margin: 14px 0 12px; padding: 10px 12px; border-radius: 12px; background: color-mix(in srgb, var(--jewel) 12%, var(--velvet)); border: 1px solid color-mix(in srgb, var(--jewel) 40%, var(--line)); font-size: 13.5px; line-height: 1.35; color: var(--mist); }
.rr-shield { flex: 0 0 auto; width: 16px; height: 18px; margin-top: 1px; background: var(--jewel); clip-path: polygon(50% 0, 100% 18%, 100% 55%, 50% 100%, 0 55%, 0 18%); }
`;
