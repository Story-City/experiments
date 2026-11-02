// Path Drawer: pick a shape, it snaps to the streets as a faint guide,
// your (pretend) walk draws the line. Ends with the glowing shape.

const TEXT = {
  kicker: 'Walk a picture',
  title: 'Pick a shape.',
  sub: 'It lays a faint guide over your streets. Walk the guide and your path draws the picture.',
  shapes: { heart: 'Heart', star: 'Star', cat: 'Cat Face', bolt: 'Lightning' },
  traced: 'traced',
  hold: 'Hold to Walk',
  holdHint: 'Pretend to Walk: hold the button and the line follows the guide. Out on real streets, your steps do it.',
  doneKicker: 'You drew it',
  doneTitle: (s) => `A ${s.toLowerCase()} the size of a neighbourhood.`,
  km: 'km walked',
  steps: 'steps',
  save: 'Save',
  share: 'Share',
  saved: 'Saved to your drawings',
  shareText: (s, km) => `I walked a ${s.toLowerCase()} through my neighbourhood: ${km} km in Story City.`,
  shared: 'Copied, ready to paste',
  noShare: 'Sharing works on phones',
  again: 'Draw Another',
};

const CELL = 30;          // px per block in the SVG
const BLOCK_M = 80;       // metres per block
const STEP_M = 0.75;
const STORE = 'st-path-drawer';

// Corner points on a 12 x 12 street grid; joined by staircase moves along streets.
const SHAPES = {
  heart: [[6, 10], [3, 7], [2, 5], [2, 3], [3, 2], [5, 2], [6, 3], [7, 2], [9, 2], [10, 3], [10, 5], [9, 7], [6, 10]],
  star: [[6, 1], [7, 4], [11, 5], [8, 7], [9, 11], [6, 9], [3, 11], [4, 7], [1, 5], [5, 4], [6, 1]],
  cat: [[3, 11], [2, 9], [2, 5], [3, 1], [5, 4], [7, 4], [9, 1], [10, 5], [10, 9], [9, 11], [3, 11]],
  bolt: [[7, 1], [3, 7], [6, 7], [5, 11], [9, 5], [6, 5], [8, 1], [7, 1]],
};

export default function run(k) {
  const { h } = k;
  css(k);
  choose();

  function choose() {
    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      h('p', { class: 'sub' }, TEXT.sub),
      h('div', { class: 'pd-pick' }, Object.keys(SHAPES).map((id) =>
        h('button', { class: 'pd-shape', onclick: () => draw(id) },
          h('svg', { viewBox: '0 0 360 360', 'aria-hidden': 'true' },
            h('polyline', { points: pts(SHAPES[id]), class: 'pd-mini' })),
          h('span', {}, TEXT.shapes[id])))));
  }

  function draw(id) {
    const route = staircase(SHAPES[id]);
    const total = route.length - 1;           // blocks
    let at = 0;                               // blocks walked (fractional)
    let holding = false, raf = 0, last = 0, done = false;

    const walked = h('polyline', { class: 'pd-walk', points: '' });
    const me = h('circle', { class: 'pd-me', r: 7, cx: route[0][0] * CELL, cy: route[0][1] * CELL });
    const svg = h('svg', { class: 'pd-map', viewBox: '-15 -15 390 390', role: 'img', 'aria-label': TEXT.shapes[id] },
      streets(),
      h('polyline', { class: 'pd-guide', points: pts(route) }),
      walked, me);
    const pct = h('b', {}, '0%');
    const btn = h('button', { class: 'btn jewel pd-hold' }, TEXT.hold);

    k.show(
      k.bar(TEXT.shapes[id]),
      svg,
      h('p', { class: 'pd-pct' }, pct, ` ${TEXT.traced}`),
      h('p', { class: 'hint centre' }, TEXT.holdHint),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, btn));

    const go = (e) => { e.preventDefault(); holding = true; btn.classList.add('on'); };
    const stop = () => { holding = false; btn.classList.remove('on'); };
    btn.addEventListener('pointerdown', go);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); step(0.6); } });

    function tick(now) {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      if (holding) step(dt * 6);              // about 6 blocks a second
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    k.onLeave(() => cancelAnimationFrame(raf));

    function step(n) {
      if (done) return;
      at = Math.min(total, at + n);
      const i = Math.floor(at), f = at - i;
      const line = route.slice(0, i + 1);
      if (f > 0 && route[i + 1]) {
        const a = route[i], b = route[i + 1];
        line.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
      }
      const head = line[line.length - 1];
      walked.setAttribute('points', pts(line));
      me.setAttribute('cx', head[0] * CELL); me.setAttribute('cy', head[1] * CELL);
      pct.textContent = `${Math.floor((at / total) * 100)}%`;
      if (at >= total) finish();
    }

    function finish() {
      done = true; stop();
      pct.textContent = '100%';
      svg.classList.add('pd-done');
      const metres = total * BLOCK_M;
      const km = (metres / 1000).toFixed(1);
      const steps = Math.round(metres / STEP_M).toLocaleString('en-CA');
      setTimeout(() => k.openSheet([
        h('div', { class: 'celebrate' },
          h('svg', { class: 'pd-glow', viewBox: '-15 -15 390 390', 'aria-hidden': 'true' },
            h('polyline', { points: pts(route), class: 'pd-final' })),
          h('p', { class: 'kicker' }, TEXT.doneKicker),
          h('h3', {}, TEXT.doneTitle(TEXT.shapes[id])),
          h('div', { class: 'pd-stats' },
            h('div', {}, h('b', {}, km), h('span', {}, TEXT.km)),
            h('div', {}, h('b', {}, steps), h('span', {}, TEXT.steps)))),
        h('div', { class: 'btns pd-two' },
          h('button', { class: 'btn jewel', onclick: () => save(id, km) }, TEXT.save),
          h('button', { class: 'btn ghost', onclick: () => share(TEXT.shareText(TEXT.shapes[id], km)) }, TEXT.share)),
        h('div', { class: 'btns' }, h('button', { class: 'link', onclick: choose }, TEXT.again)),
      ], null, k.tool.jewel), 700);
    }
  }

  function save(id, km) {
    try {
      const list = JSON.parse(localStorage.getItem(STORE) || '[]');
      list.push({ shape: id, km, when: Date.now() });
      localStorage.setItem(STORE, JSON.stringify(list));
    } catch (e) { /* private mode: still say saved for the demo */ }
    k.toast(TEXT.saved);
  }

  async function share(text) {
    try {
      if (navigator.share) { await navigator.share({ title: k.tool.name, text }); return; }
      await navigator.clipboard.writeText(text);
      k.toast(TEXT.shared);
    } catch (e) { k.toast(TEXT.noShare); }
  }

  // A pretend night street grid: blocks between streets, a river, a park.
  function streets() {
    const g = [h('rect', { x: -15, y: -15, width: 390, height: 390, fill: '#1a0b3d' })];
    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 12; y++) {
        const park = (x === 8 && y === 8) || (x === 3 && y === 9) || (x === 9 && y === 9);
        g.push(h('rect', { x: x * CELL + 4, y: y * CELL + 4, width: CELL - 8, height: CELL - 8, rx: 2,
          style: `fill: ${park ? 'color-mix(in srgb, #5BD380 22%, #2a1658)' : '#2a1658'}` }));
      }
    }
    for (let i = 0; i <= 12; i++) {
      g.push(h('line', { x1: i * CELL, y1: -15, x2: i * CELL, y2: 375, class: 'pd-st' }));
      g.push(h('line', { x1: -15, y1: i * CELL, x2: 375, y2: i * CELL, class: 'pd-st' }));
    }
    g.push(h('path', { d: 'M-15 352 C 80 340, 160 372, 240 356 S 340 345, 375 352', class: 'pd-river' }));
    return h('g', {}, g);
  }
}

// Expand corner points into one-block moves along the grid.
function staircase(points) {
  const out = [points[0].slice()];
  for (let p = 1; p < points.length; p++) {
    let [x, y] = out[out.length - 1];
    const [tx, ty] = points[p];
    const dx = Math.abs(tx - x), dy = Math.abs(ty - y);
    const sx = Math.sign(tx - x), sy = Math.sign(ty - y);
    let cx = 0, cy = 0;
    while (cx < dx || cy < dy) {
      const takeX = cy >= dy || (cx < dx && (cx + 1) / dx <= (cy + 1) / dy);
      if (takeX) { x += sx; cx++; } else { y += sy; cy++; }
      out.push([x, y]);
    }
  }
  return out;
}

const pts = (list) => list.map(([x, y]) => `${(x * CELL).toFixed(1)},${(y * CELL).toFixed(1)}`).join(' ');

function css(k) {
  k.css('path-drawer', `
.pd-pick { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 22px; }
.pd-shape { border: 1px solid var(--line); background: radial-gradient(110% 110% at 100% 100%, color-mix(in srgb, var(--jewel) 22%, transparent), transparent 70%), var(--velvet);
  border-radius: 12px; padding: 14px 12px 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; min-height: 44px; }
.pd-shape svg { width: 76%; display: block; }
.pd-shape span { font: 600 20px/1 var(--f-head); color: var(--starlight); }
.pd-shape:active { transform: scale(0.97); }
.pd-mini { fill: none; stroke: var(--jewel); stroke-width: 14; stroke-linejoin: round; stroke-linecap: round; }
.pd-map { width: 100%; display: block; border-radius: 14px; border: 1px solid var(--line); }
.pd-st { stroke: #46337e; stroke-width: 6; }
.pd-river { fill: none; stroke: color-mix(in srgb, #58B0F6 35%, #1a0b3d); stroke-width: 9; stroke-linecap: round; }
.pd-guide { fill: none; stroke: var(--starlight); stroke-opacity: 0.55; stroke-width: 3.5; stroke-dasharray: 0.1 9; stroke-linecap: round; stroke-linejoin: round; }
.pd-walk { fill: none; stroke: var(--jewel); stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 0 4px var(--jewel)); }
.pd-me { fill: var(--starlight); stroke: var(--jewel); stroke-width: 3; }
.pd-done .pd-walk { animation: pd-pulse 1.2s ease-in-out infinite; }
.pd-done .pd-guide, .pd-done .pd-me { opacity: 0; transition: opacity 0.5s; }
@keyframes pd-pulse { 50% { filter: drop-shadow(0 0 10px var(--jewel)); } }
.pd-pct { text-align: center; margin: 12px 0 0; color: var(--lilac); font: 600 15px var(--f-body); }
.pd-pct b { font: 600 30px/1 var(--f-head); color: var(--starlight); }
.pd-hold { touch-action: none; user-select: none; -webkit-user-select: none; }
.pd-hold.on { filter: brightness(1.12); transform: scale(0.98); box-shadow: 0 0 24px color-mix(in srgb, var(--jewel) 55%, transparent); }
.pd-glow { width: 150px; display: block; margin: 0 auto 12px; animation: land 0.6s cubic-bezier(0.2, 1.3, 0.4, 1) both; }
.pd-final { fill: color-mix(in srgb, var(--jewel) 16%, transparent); stroke: var(--jewel); stroke-width: 9; stroke-linejoin: round; stroke-linecap: round;
  filter: drop-shadow(0 0 8px var(--jewel)) drop-shadow(0 0 18px var(--jewel)); }
.pd-stats { display: flex; justify-content: center; gap: 28px; margin-top: 16px; }
.pd-stats div { display: flex; flex-direction: column; }
.pd-stats b { font: 600 34px/1 var(--f-head); color: var(--jewel); }
.pd-stats span { font: 700 11px/1.4 var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); }
.pd-two { grid-template-columns: 1fr 1fr; }
`);
}
