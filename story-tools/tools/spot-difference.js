// Spot the Difference, framed as "Something changed since you left": the gem you saved
// yesterday (or a fresh snap) quietly changes in 3 places. Tap what changed, get a title.
const TEXT = {
  kicker: 'Something changed since you left',
  title: 'Remember this spot?',
  sub: 'Wren swears it looked different this morning. Study your gem, then find what moved.',
  gemLabel: 'Gem saved yesterday · The tall tree',
  useGem: 'Use Yesterday’s Gem',
  orSnap: 'Or snap somewhere new',
  snap: 'Snap a Fresh Spot',
  studyKicker: 'Step 1 · Study',
  studyTitle: 'Memorise it',
  studyTitleGem: 'How you left it',
  studyHint: 'Look closely. In a moment, three things will change.',
  ready: 'I’m Ready',
  spotKicker: 'Step 2 · Spot',
  spotTitle: 'What changed?',
  spotHint: 'Tap each spot that looks different.',
  found: (n) => `${n} of 3`,
  giveUp: 'Give Up and Show Me',
  resultKicker: 'Field report',
  statFound: 'Found',
  statMiss: 'Misses',
  statTime: 'Time',
  score: (p) => `${p} pts`,
  changed: 'What changed',
  share: 'Share My Result',
  shareLine: (n, t, m, title) => `Something changed on my street. I spotted ${n} of 3 in ${t} with ${m} ${m === 1 ? 'miss' : 'misses'}. Title: ${title}. Can you beat it? (Story City)`,
  copied: 'Share line copied',
  noShare: 'Couldn’t share, but here it is',
  kinds: { hue: 'A colour shifted', clone: 'A piece was copied', blob: 'A spot appeared', nudge: 'A piece slid over' },
  again: 'Play Again',
  home: 'Back to Tools',
  oops: 'That photo would not open',
};

const MAX = 900;
const STUDY = 5;            // seconds to memorise
const KINDS = ['hue', 'clone', 'blob', 'nudge'];
const GEM = 'img/tree-photo.jpg';

// Light, learnable judging (Pokémon Snap style): a few visible rules, a fun title.
const TITLES = [
  { title: 'Sees Through Walls', wren: 'Three for three, no misses, barely a blink. Are you sure you’re not one of us?', ok: (f, m, s) => f === 3 && m === 0 && s <= 20 },
  { title: 'Sharp-Eyed Agent', wren: 'Nothing gets past you. The Society noticed.', ok: (f, m) => f === 3 && m <= 2 },
  { title: 'Patient Watcher', wren: 'You found every one. Slow and sure is still sure.', ok: (f) => f === 3 },
  { title: 'Nearly Uncanny', wren: 'Two out of three. That last one was sneaky.', ok: (f) => f === 2 },
  { title: 'Good Hunch', wren: 'You caught one. Your instincts are warming up.', ok: (f) => f === 1 },
  { title: 'Fresh Eyes Tomorrow', wren: 'This street is good at hiding things. Come back and try again.', ok: () => true },
];
function judge(found, misses, secs, won) {
  const pts = Math.max(0, found * 100 + (won ? Math.max(0, 60 - secs) * 3 : 0) - misses * 15);
  return { pts, ...TITLES.find((t) => t.ok(found, misses, secs)) };
}

export default function run(k) {
  const { h } = k;
  k.css('spot-difference', `
    .sd-stage { position: relative; border-radius: 12px; overflow: hidden; user-select: none; touch-action: manipulation; }
    .sd-stage canvas { display: block; width: 100%; height: auto; }
    .sd-over { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .sd-over .ring { fill: none; stroke: var(--jewel); filter: drop-shadow(0 0 6px var(--jewel)); animation: sd-ring 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) both; transform-box: fill-box; transform-origin: center; }
    .sd-over .reveal { fill: none; stroke: var(--starlight); stroke-dasharray: 10 8; }
    .sd-over .miss { fill: var(--starlight); opacity: 0.8; animation: sd-fade 0.6s ease both; }
    @keyframes sd-ring { from { scale: 0.3; opacity: 0; } }
    @keyframes sd-fade { to { opacity: 0; scale: 2; } }
    .sd-shake { animation: sd-shake 0.35s ease; }
    @keyframes sd-shake { 20%, 60% { translate: -8px 0; } 40%, 80% { translate: 8px 0; } }
    .sd-head { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
    .sd-clock { width: 64px; height: 64px; flex: 0 0 auto; position: relative; }
    .sd-clock svg { width: 100%; height: 100%; rotate: -90deg; }
    .sd-clock .track { fill: none; stroke: var(--line); stroke-width: 6; }
    .sd-clock .arc { fill: none; stroke: var(--jewel); stroke-width: 6; stroke-linecap: round; stroke-dasharray: 176; animation: sd-tick ${STUDY}s linear both; }
    @keyframes sd-tick { to { stroke-dashoffset: 176; } }
    .sd-clock b { position: absolute; inset: 0; display: grid; place-items: center; font: 600 26px var(--f-head); color: var(--starlight); }
    .sd-list { margin: 12px 0 0; padding: 0; list-style: none; color: var(--mist); font-size: 15px; }
    .sd-list li::before { content: "✦ "; color: var(--jewel); }
    .sd-gem { display: flex; gap: 14px; align-items: center; margin-top: 18px; padding: 12px; border-radius: 14px; background: var(--velvet); border: 1px solid var(--line); }
    .sd-gem img { width: 84px; height: 104px; object-fit: cover; border-radius: 8px; border: 3px solid var(--pearl); rotate: -3deg; flex: 0 0 auto; }
    .sd-gem p { margin: 0; font: 700 11px/1.35 var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--glow); }
    .sd-gem i { display: block; margin-top: 6px; font: italic 500 16px/1.3 var(--f-head); color: var(--mist); letter-spacing: 0; text-transform: none; }
    .sd-alt { margin-top: 18px; text-align: center; border-top: 1px solid var(--line); padding-top: 10px; }
    .sd-alt > p { margin: 0; font: 700 11px var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); }
    .sd-alt .cam { margin-top: 6px; }
    .sd-alt .shutter { width: 56px; height: 56px; box-shadow: none; border-width: 2px; }
    .sd-alt .shutter::after { inset: 5px; }
    .sd-alt .cam .lbl { margin-top: 4px; font-size: 13px; }
    .sd-card { margin-top: 4px; padding: 18px 16px 16px; border-radius: 14px; text-align: center; position: relative;
      background: radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--jewel) 28%, transparent), transparent 70%), var(--velvet); border: 1px solid var(--line); }
    .sd-card .kicker { margin: 0; }
    .sd-title { margin: 6px 0 0; font: 600 32px/1.02 var(--f-head); color: var(--starlight); text-wrap: balance; }
    .sd-pts { display: inline-block; margin-top: 8px; padding: 3px 12px; border-radius: 999px; background: var(--jewel); color: var(--midnight); font: 800 13px/1.5 var(--f-body); letter-spacing: 0.06em; }
    .sd-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; }
    .sd-stats div { border: 1px solid var(--line); border-radius: 10px; padding: 8px 4px; }
    .sd-stats b { display: block; font: 600 24px/1.1 var(--f-head); color: var(--starlight); }
    .sd-stats span { font: 700 10px/1.3 var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); }
    .sd-wren { margin: 12px 0 0; font: italic 500 16px/1.35 var(--f-head); color: var(--mist); text-wrap: pretty; }
    .sd-wren span { color: var(--glow); font-style: normal; }
    .sd-share { margin: 12px 0 0; padding: 10px 12px; border-radius: 10px; border: 1.5px dashed var(--line); font-size: 14px; color: var(--mist); text-align: left; }
    .sd-changed { margin: 12px 0 0; font: 700 11px var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); }
  `);

  snapScreen();

  // Default: yesterday's gem. The camera (with its sample-photo fallback) is the quieter option.
  function snapScreen() {
    const open = (gem) => async (url) => {
      try { study(await k.loadImage(url), gem); } catch (e) { k.toast(TEXT.oops); }
    };
    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      h('p', { class: 'sub' }, TEXT.sub),
      h('div', { class: 'sd-gem' },
        h('img', { src: GEM, alt: '' }),
        h('p', {}, TEXT.gemLabel.split(' · ')[0], h('i', {}, TEXT.gemLabel.split(' · ')[1]))),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'sdGem', onclick: () => open(true)(GEM) }, TEXT.useGem)),
      h('div', { class: 'spacer' }),
      h('div', { class: 'sd-alt' },
        h('p', {}, TEXT.orSnap),
        k.camera(TEXT.snap, open(false), () => k.samplePhoto(1 + Math.floor(Math.random() * 3)))),
    );
  }

  function study(img, gem) {
    const orig = fit(img);
    const shown = h('canvas', { width: orig.width, height: orig.height });
    shown.getContext('2d').drawImage(orig, 0, 0);
    const num = h('b', {}, STUDY);
    let left = STUDY;
    const tick = setInterval(() => { left -= 1; num.textContent = Math.max(0, left); if (left <= 0) go(); }, 1000);
    k.onLeave(() => clearInterval(tick));
    let gone = false;
    const go = () => { if (gone) return; gone = true; clearInterval(tick); spot(orig); };

    k.show(
      k.bar(),
      h('div', { class: 'sd-head' },
        h('div', { class: 'sd-clock', 'aria-hidden': 'true' },
          h('svg', { viewBox: '0 0 64 64' }, h('circle', { class: 'track', cx: 32, cy: 32, r: 28 }), h('circle', { class: 'arc', cx: 32, cy: 32, r: 28 })),
          num),
        h('div', {}, h('p', { class: 'kicker', style: 'margin:0 0 4px' }, TEXT.studyKicker), h('h1', { class: 'display', style: 'font-size:30px' }, gem ? TEXT.studyTitleGem : TEXT.studyTitle))),
      h('p', { class: 'hint', style: 'margin-top:0' }, TEXT.studyHint),
      h('div', { class: 'sd-stage' }, shown),
      h('div', { class: 'btns' }, h('button', { class: 'link', onclick: go }, TEXT.ready)),
    );
  }

  function spot(orig) {
    const { canvas, diffs } = makeChanges(orig);
    const W = canvas.width, H = canvas.height;
    const over = h('svg', { class: 'sd-over', viewBox: `0 0 ${W} ${H}` });
    const stage = h('div', { class: 'sd-stage' }, canvas, over);
    const count = h('span', { class: 'count' }, TEXT.found(0));
    const t0 = Date.now();
    let done = false, misses = 0;

    stage.addEventListener('click', (e) => {
      if (done) return;
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) * (W / r.width), y = (e.clientY - r.top) * (H / r.height);
      const hit = diffs.find((d) => !d.found && Math.hypot(d.x - x, d.y - y) < d.r * 1.5);
      if (hit) {
        hit.found = true;
        over.append(h('circle', { class: 'ring', cx: hit.x, cy: hit.y, r: hit.r * 1.15, 'stroke-width': W / 90 }));
        const n = diffs.filter((d) => d.found).length;
        count.textContent = TEXT.found(n);
        if (n === diffs.length) { done = true; const ms = Date.now() - t0; setTimeout(() => finish(diffs, ms, true, misses), 700); }
      } else {
        misses += 1;
        over.append(h('circle', { class: 'miss', cx: x, cy: y, r: W / 60 }));
        stage.classList.remove('sd-shake'); void stage.offsetWidth; stage.classList.add('sd-shake');
      }
    });

    const giveUp = () => {
      if (done) return;
      done = true;
      diffs.filter((d) => !d.found).forEach((d) => over.append(h('circle', { class: 'reveal', cx: d.x, cy: d.y, r: d.r * 1.15, 'stroke-width': W / 120 })));
      const ms = Date.now() - t0;
      setTimeout(() => finish(diffs, ms, false, misses), 1400);
    };

    const head = k.bar();
    head.append(count);
    k.show(
      head,
      h('p', { class: 'kicker' }, TEXT.spotKicker),
      h('h1', { class: 'display', style: 'font-size:30px' }, TEXT.spotTitle),
      h('p', { class: 'hint' }, TEXT.spotHint),
      stage,
      h('div', { class: 'btns' }, h('button', { class: 'link', onclick: giveUp }, TEXT.giveUp)),
    );
  }

  // The payoff: a small result card with a title and a spoiler-free share line.
  function finish(diffs, ms, won, misses) {
    const n = diffs.filter((d) => d.found).length;
    const s = Math.round(ms / 1000);
    const time = s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
    const r = judge(n, misses, s, won);
    const line = TEXT.shareLine(n, time, misses, r.title);
    const stat = (v, lbl) => h('div', {}, h('b', {}, v), h('span', {}, lbl));
    k.openSheet([
      h('div', { class: 'sd-card', id: 'sdResult' },
        h('p', { class: 'kicker' }, TEXT.resultKicker),
        h('p', { class: 'sd-title' }, r.title),
        h('span', { class: 'sd-pts' }, TEXT.score(r.pts)),
        h('div', { class: 'sd-stats' }, stat(`${n}/3`, TEXT.statFound), stat(misses, TEXT.statMiss), stat(time, TEXT.statTime)),
        h('p', { class: 'sd-wren' }, h('span', {}, 'Wren: '), r.wren),
        h('p', { class: 'sd-share' }, line)),
      h('p', { class: 'sd-changed' }, TEXT.changed),
      h('ul', { class: 'sd-list' }, diffs.map((d) => h('li', {}, TEXT.kinds[d.kind]))),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => share(line) }, TEXT.share),
        h('button', { class: 'btn ghost', onclick: snapScreen }, TEXT.again),
        h('button', { class: 'link', onclick: k.home }, TEXT.home)),
    ], null, k.tool.jewel);
  }

  async function share(text) {
    try { if (navigator.share) { await navigator.share({ text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text); k.toast(TEXT.copied); } catch (e) { k.toast(TEXT.noShare); }
  }
}

/* ---------- the quiet changes ---------- */

// Copy the photo and change 3 spots, each a different kind, in busy places, spread apart.
function makeChanges(orig) {
  const W = orig.width, H = orig.height;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.drawImage(orig, 0, 0);
  const busy = busyness(orig);
  const r = Math.round(Math.min(W, H) * 0.075);
  const kinds = KINDS.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).slice(0, 3).map((p) => p[1]);
  const diffs = [];
  for (const kind of kinds) {
    let best = null;
    for (let i = 0; i < 40; i++) {
      const cx = W * (0.14 + Math.random() * 0.72), cy = H * (0.12 + Math.random() * 0.76);
      if (diffs.some((d) => Math.hypot(d.x - cx, d.y - cy) < r * 4)) continue;
      const score = busy(cx / W, cy / H, kind) + Math.random() * 0.1;
      if (!best || score > best.score) best = { x: cx, y: cy, score };
    }
    if (!best) continue;
    const d = { kind, x: best.x, y: best.y, r, found: false };
    CHANGE[kind](x, orig, d);
    diffs.push(d);
  }
  return { canvas: c, diffs };
}

const CHANGE = {
  // rotate the colour channels inside a soft circle
  hue(x, orig, d) {
    const { x: cx, y: cy, r } = d;
    const x0 = Math.max(0, Math.round(cx - r)), y0 = Math.max(0, Math.round(cy - r));
    const w = Math.min(orig.width - x0, r * 2), hh = Math.min(orig.height - y0, r * 2);
    const img = x.getImageData(x0, y0, w, hh), p = img.data;
    for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) {
      const dist = Math.hypot(x0 + i - cx, y0 + j - cy) / r;
      if (dist > 1) continue;
      const a = dist < 0.7 ? 1 : (1 - dist) / 0.3;
      const q = (j * w + i) * 4, R = p[q], G = p[q + 1], B = p[q + 2];
      p[q] = R + (B - R) * a; p[q + 1] = G + (R - G) * a; p[q + 2] = B + (G - B) * a;
    }
    x.putImageData(img, x0, y0);
  },
  // copy a mirrored piece from elsewhere over this spot
  clone(x, orig, d) {
    const { x: cx, y: cy, r } = d;
    const sx = cx + (cx < orig.width / 2 ? r * 3 : -r * 3), sy = cy;
    x.save();
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
    x.translate(sx + cx, cy - sy); x.scale(-1, 1);
    x.drawImage(orig, 0, 0);
    x.restore();
  },
  // a new soft dot in a colour that stands out from its surroundings
  blob(x, orig, d) {
    const { x: cx, y: cy, r } = d;
    const o = orig.getContext('2d');
    const here = o.getImageData(Math.round(cx), Math.round(cy), 1, 1).data;
    let best = null;
    for (let i = 0; i < 12; i++) {
      const p = o.getImageData(Math.floor(Math.random() * orig.width), Math.floor(Math.random() * orig.height), 1, 1).data;
      const dist = Math.abs(p[0] - here[0]) + Math.abs(p[1] - here[1]) + Math.abs(p[2] - here[2]);
      if (!best || dist > best.dist) best = { p, dist };
    }
    x.save();
    x.fillStyle = `rgb(${best.p[0]},${best.p[1]},${best.p[2]})`;
    x.shadowColor = x.fillStyle; x.shadowBlur = r * 0.3;
    x.beginPath(); x.ellipse(cx, cy, r * 0.5, r * 0.4, Math.random() * Math.PI, 0, Math.PI * 2); x.fill();
    x.restore();
  },
  // slide the contents of this spot sideways
  nudge(x, orig, d) {
    const { x: cx, y: cy, r } = d;
    x.save();
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
    x.drawImage(orig, r * 0.7, r * 0.2);
    x.restore();
  },
};

// Returns a scorer: how much is going on near a point (so changes land somewhere visible).
function busyness(orig) {
  const w = 48, hgt = Math.round(48 * orig.height / orig.width);
  const c = document.createElement('canvas');
  c.width = w; c.height = hgt;
  const x = c.getContext('2d');
  x.drawImage(orig, 0, 0, w, hgt);
  const p = x.getImageData(0, 0, w, hgt).data;
  const px = (i, j) => { const q = (Math.min(hgt - 1, Math.max(0, j)) * w + Math.min(w - 1, Math.max(0, i))) * 4; return [p[q], p[q + 1], p[q + 2]]; };
  return (fx, fy, kind) => {
    const ci = Math.round(fx * w), cj = Math.round(fy * hgt);
    let sum = 0, sum2 = 0, sat = 0, n = 0;
    for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) {
      const [r, g, b] = px(ci + i, cj + j);
      const l = (r + g + b) / 3;
      sum += l; sum2 += l * l; sat += Math.max(r, g, b) - Math.min(r, g, b); n++;
    }
    const sd = Math.sqrt(Math.max(0, sum2 / n - (sum / n) ** 2)) / 128;
    return kind === 'hue' ? sat / n / 255 + sd * 0.3 : kind === 'blob' ? 0.5 - sd * 0.3 : sd;
  };
}

function fit(img) {
  const s = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
  c.getContext('2d', { willReadFrequently: true }).drawImage(img, 0, 0, c.width, c.height);
  return c;
}
