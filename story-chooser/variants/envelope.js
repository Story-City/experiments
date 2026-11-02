// Variant 18 · Walk to open the envelope. No choice screen: walking picks the story.
// One optional mood tap filters the pool, the story is picked secretly (score + a little luck among the top three),
// then a sealed envelope sits on a little street map. Thirty steps (real steps on a phone, taps indoors, or a demo walk)
// grow the yellow → green trail, shrink the ring, crack the seal and slide the story out.
// Teaches the step loop before chapter 1. Imports nothing; talks to the shell only through ctx.

const STEPS = 30;
const WALK_START = '#f2c230';
const WALK_END = '#3ddc84';

const MOODS = [
  { key: 'cosy',   label: 'Cosy',   sub: 'warm, calm, kind',   weights: { cozy: 3, calm: 2, tender: 1 },                   filter: ['cozy', 'calm', 'tender'] },
  { key: 'creepy', label: 'Creepy', sub: 'eerie, a bit spooky', weights: { eerie: 3, spooky: 3, mysterious: 1, night: 1 }, filter: ['eerie', 'spooky'] },
  { key: 'funny',  label: 'Funny',  sub: 'silly, playful',      weights: { funny: 3, playful: 3, comedy: 2 },               filter: ['funny', 'playful', 'comedy'] },
  { key: 'big',    label: 'Big',    sub: 'epic, a real quest',  weights: { epic: 3, adventure: 3, fantasy: 1 },             filter: ['epic', 'adventure'] },
];

// Three-word hint on the envelope: where · what · how long. Never the name.
const WHERE = { 'anywhere': 'any street', 'a café': 'a café', 'a park': 'a park', 'a downtown park': 'a park', 'downtown': 'downtown',
  'downtown Calgary': 'Calgary', 'the river valley': 'the river', 'the Legislature grounds': 'Legislature' };
const WHAT = { 'Mystery': 'secrets', 'Adventure': 'a quest', 'Urban Fantasy': 'fae', 'Dystopia': 'the future', 'Fantasy': 'magic',
  'Crime': 'a crime', 'Romance': 'romance', 'Sci-Fi': 'signals', 'Paranormal Mystery': 'ghosts', 'Comedy': 'laughs' };
const hintParts = (s) => [WHERE[s.where] || s.where.split(' ').pop(), WHAT[s.genre] || s.genre.toLowerCase(), `${s.minutes} min`];
const hintFor = (s) => hintParts(s).join(' · ');

// Map geometry (SVG viewBox 0 0 390 380). Roads sit on these lines; the trail follows them.
const VW = 390, VH = 380;
const XS = [-20, 60, 175, 290, 410];
const YS = [-20, 90, 195, 300, 400];
const ROUTE = [[60, 362], [60, 195], [290, 195], [290, 128]];
const ENV_AT = [290, 98];

const SEG = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
const LEN = SEG.reduce((a, b) => a + b, 0);
function pointAt(d) {
  d = Math.max(0, Math.min(LEN, d));
  for (let i = 0; i < SEG.length; i++) {
    if (d <= SEG[i] || i === SEG.length - 1) {
      const t = SEG[i] ? Math.min(1, d / SEG[i]) : 0;
      return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * t, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * t];
    }
    d -= SEG[i];
  }
  return ROUTE[ROUTE.length - 1];
}
const hex = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(',')})`;

const CSS = `
.v-envelope { --road: #3a2f66; --park: #1f3a3a; --walk-start: ${WALK_START}; --walk-end: ${WALK_END}; --paper: #efe3c6; --paper-2: #e2d0a8; --ink: #5d4a2a; padding-top: 10px; }
.v-envelope .eyebrow { font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--story); font-weight: 800; }
.v-envelope h2 { font-size: 30px; line-height: 1; font-weight: 900; margin: 6px 0 12px; text-wrap: balance; }
.v-envelope .lead { color: var(--muted); font-size: 18px; line-height: 1.25; margin: 0 0 4px; text-wrap: pretty; }
.v-envelope .q { margin: 18px 0 10px; font-size: 26px; }
.v-envelope .moods { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.v-envelope .mood { text-align: left; background: var(--raised); border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; min-height: 64px; color: var(--text); }
.v-envelope .mood b { display: block; font-size: 22px; font-weight: 900; line-height: 1; }
.v-envelope .mood span { display: block; color: var(--muted); font-size: 15px; margin-top: 3px; }
.v-envelope .mood:active { background: var(--raised-2); border-color: var(--walk-start); }
.v-envelope .skip { margin-top: 10px; }
.v-envelope .reel { font-size: 15px; text-align: center; margin: 18px 0 0; text-wrap: balance; }
.v-envelope .preview { position: relative; width: 168px; margin: 18px auto 16px; }

/* ---- the envelope ---- */
.v-envelope .env { position: absolute; width: 34%; aspect-ratio: 3 / 2; translate: -50% -50%; container-type: inline-size; perspective: 700px; z-index: 3;
  transition: left 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
  animation: env-bob 2.6s ease-in-out infinite; }
.v-envelope .preview .env { position: relative; width: 100%; translate: none; left: auto; top: auto; }
@keyframes env-bob { 50% { transform: translateY(-4%); } }
.v-envelope .env::before { content: ''; position: absolute; inset: -18%; border-radius: 50%; background: radial-gradient(closest-side, rgba(61, 220, 132, 0.55), transparent);
  opacity: calc(0.15 + var(--t, 0) * 0.85); z-index: -1; pointer-events: none; }
.v-envelope .env .back, .v-envelope .env .front, .v-envelope .env .flap { position: absolute; border-radius: 3cqw; }
.v-envelope .env .back { inset: 0; background: #b39d70; box-shadow: 0 2.5cqw 6cqw rgba(0, 0, 0, 0.45); }
.v-envelope .env .card { position: absolute; left: 6%; right: 6%; top: 5%; height: 90%; z-index: 2; background: #fbf6ea; border-radius: 2.4cqw; overflow: hidden;
  display: flex; flex-direction: column; box-shadow: 0 1cqw 3cqw rgba(0, 0, 0, 0.3); transition: transform 0.85s cubic-bezier(0.2, 0.9, 0.25, 1.08); }
.v-envelope .env .card .cv { position: relative; flex: 1; min-height: 0; background: linear-gradient(135deg, #352a66, #170c35 70%); display: grid; place-items: center; color: rgba(255, 255, 255, 0.7);
  font: 900 7cqw/1 "Darker Grotesque", sans-serif; letter-spacing: 0.1em; text-transform: uppercase; }
.v-envelope .env .card .cv img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.v-envelope .env .card .nm { flex: none; padding: 3cqw 4cqw 2.6cqw; font: 900 8.4cqw/0.95 "Darker Grotesque", sans-serif; color: #1c1240; text-wrap: balance; }
.v-envelope .env .front { inset: 0; z-index: 3; background: linear-gradient(170deg, var(--paper), var(--paper-2));
  clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%); }
.v-envelope .env .hint { position: absolute; left: 3%; right: 3%; top: 69%; text-align: center; font: 800 9cqw/1 "Darker Grotesque", sans-serif; color: var(--ink); }
.v-envelope .env .hint span { display: block; white-space: nowrap; }
.v-envelope .env .flap { left: 0; right: 0; top: 0; height: 58%; z-index: 4; transform-origin: 50% 0; border-radius: 3cqw 3cqw 0 0;
  background: linear-gradient(180deg, #e8d8b4, #d6c193); clip-path: polygon(0 0, 100% 0, 50% 100%); transition: transform 0.55s ease-in, background 0.55s; }
.v-envelope .env .seal { position: absolute; left: 50%; top: 57%; width: 22cqw; aspect-ratio: 1; translate: -50% -50%; z-index: 5; }
.v-envelope .env .seal i { position: absolute; inset: 0; border-radius: 50%;
  background: radial-gradient(circle at 34% 30%, #6ccbff, var(--accent) 45%, var(--accent-deep) 100%);
  box-shadow: 0 0.8cqw 1.6cqw rgba(0, 0, 0, 0.4), inset 0 0 0 1.5cqw rgba(255, 255, 255, 0.14);
  transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1), opacity 0.4s 0.3s; }
.v-envelope .env .seal i::after { content: '✦'; position: absolute; inset: 0; display: grid; place-items: center; font-size: 11cqw; color: rgba(255, 255, 255, 0.6); font-style: normal; }
.v-envelope .env .seal i:first-child { clip-path: polygon(0 0, 54% 0, 44% 38%, 58% 60%, 47% 100%, 0 100%); }
.v-envelope .env .seal i:last-child { clip-path: polygon(54% 0, 100% 0, 100% 100%, 47% 100%, 58% 60%, 44% 38%); }
.v-envelope .env.cracked .seal i:first-child { transform: translate(-22%, 18%) rotate(-26deg); opacity: 0; }
.v-envelope .env.cracked .seal i:last-child { transform: translate(24%, 24%) rotate(22deg); opacity: 0; }
.v-envelope .env.opened .flap { transform: rotateX(180deg); background: linear-gradient(0deg, #cdb788, #bba46f); }
.v-envelope .env.out .flap { z-index: 1; }
.v-envelope .env.out .card { transform: translateY(-74%); }
.v-envelope .env.arrive { left: 50% !important; top: 63% !important; width: 66%; animation: none; }
.v-envelope .env.arrive::before { opacity: 0.9; }

/* ---- the map ---- */
.v-envelope .map { position: relative; aspect-ratio: ${VW} / ${VH}; border-radius: 18px; overflow: hidden; background: var(--bg); border: 1px solid var(--line); margin: 0 -4px; }
.v-envelope .map svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.v-envelope .map .block { fill: var(--raised); }
.v-envelope .map .park { fill: var(--park); }
.v-envelope .map .tree { fill: #2d6b4a; }
.v-envelope .map .road { stroke: var(--road); stroke-width: 14; }
.v-envelope .map .road.main { stroke-width: 22; }
.v-envelope .map .label { fill: var(--muted); font: 600 10px -apple-system, system-ui, sans-serif; letter-spacing: 0.06em; }
.v-envelope .map .hintroute { fill: none; stroke: rgba(255, 255, 255, 0.28); stroke-width: 3; stroke-dasharray: 1 9; stroke-linecap: round; }
.v-envelope .map .crumb { transition: opacity 0.25s; }
.v-envelope .map .ring { fill: none; stroke-width: 1.4; }
.v-envelope .map .me .dot { fill: #fff; stroke: var(--accent); stroke-width: 4; }
.v-envelope .map .me .pulse { fill: var(--accent); opacity: 0.25; animation: env-pulse 1.8s ease-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes env-pulse { from { transform: scale(0.5); opacity: 0.5; } to { transform: scale(1.9); opacity: 0; } }
.v-envelope .map .scrim { position: absolute; inset: 0; background: rgba(10, 6, 28, 0.7); opacity: 0; transition: opacity 0.6s; pointer-events: none; z-index: 2; }
.v-envelope .map.revealed .scrim { opacity: 1; }
.v-envelope .map .you { position: absolute; left: 10px; top: 10px; z-index: 1; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
  background: rgba(7, 8, 15, 0.6); border-radius: 999px; padding: 3px 10px; color: var(--muted); }

/* ---- step panel ---- */
.v-envelope .panel { position: relative; margin-top: 12px; }
.v-envelope .count { display: flex; align-items: baseline; gap: 6px; font-weight: 800; color: var(--muted); font-size: 18px; }
.v-envelope .count b { font-size: 34px; line-height: 1; font-weight: 900; color: var(--text); font-variant-numeric: tabular-nums; }
.v-envelope .count .tip { margin-left: auto; font-size: 15px; text-align: right; }
.v-envelope .bar { height: 6px; border-radius: 3px; background: rgba(255, 255, 255, 0.1); overflow: hidden; margin: 8px 0 10px; }
.v-envelope .bar i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--walk-start), var(--walk-end)); transition: width 0.2s; }
.v-envelope .inside { margin: 0 0 12px; font-size: 17px; color: var(--muted); text-wrap: pretty; }
.v-envelope .inside b { color: var(--text); }
.v-envelope .btn.walk { background: linear-gradient(90deg, var(--walk-start), var(--walk-end)); color: var(--bg); }
.v-envelope .btn.walk[aria-pressed="true"] { background: rgba(61, 220, 132, 0.16); color: var(--walk-end); border: 1px solid rgba(61, 220, 132, 0.5); }
.v-envelope .tapstep { flex-direction: column; gap: 0; min-height: 64px; margin-top: 10px; background: var(--raised-2); border: 1px solid rgba(242, 194, 48, 0.4);
  user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; touch-action: manipulation; }
.v-envelope .tapstep small { font-size: 14px; font-weight: 700; color: var(--muted); }
.v-envelope .tapstep:active, .v-envelope .tapstep.holding { background: #3a2f6e; border-color: var(--walk-start); }
.v-envelope .demo { display: block; margin: 8px auto 0; background: none; border: 0; color: var(--accent); font-weight: 800; font-size: 16px; padding: 10px 12px; text-decoration: underline; text-underline-offset: 3px; }
.v-envelope .demo:disabled { color: var(--muted); text-decoration: none; cursor: default; }
.v-envelope .live { position: absolute; width: 1px; height: 1px; clip-path: inset(50%); white-space: nowrap; }
.v-envelope .done { text-align: center; animation: env-rise 0.5s ease-out both; }
.v-envelope .done .walked { font-size: 26px; font-weight: 900; margin: 4px 0 12px; }
@keyframes env-rise { from { opacity: 0; transform: translateY(10px); } }

@media (prefers-reduced-motion: reduce) {
  .v-envelope *, .v-envelope *::before, .v-envelope *::after { animation: none !important; transition: none !important; }
}
`;

let teardown = [];
function cleanup() { teardown.splice(0).forEach(f => { try { f(); } catch (e) { /* already gone */ } }); }

export default {
  slug: 'envelope',
  title: 'Walk to open the envelope',
  short: 'Walk to open the envelope',
  channel: 'app',
  blurb: 'No choosing. Walk thirty steps and the seal breaks.',

  mount(ctx) {
    const { el } = ctx;
    cleanup();
    ctx.style(CSS);
    ctx.root.innerHTML = '';
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const later = (fn, ms) => { const t = setTimeout(fn, reduced ? 0 : ms); teardown.push(() => clearTimeout(t)); return t; };
    const known = new Set(Object.values(ctx.tokens).flat());
    const clean = (w) => Object.fromEntries(Object.entries(w).filter(([t]) => known.has(t)));
    const wrap = el('div', { class: 'v-envelope' });
    ctx.root.append(wrap);

    // ---------- envelope builder ----------
    function envelope(hint, story) {
      const cover = story && story.cover
        ? el('img', { src: story.cover, alt: '', draggable: 'false' })
        : el('span', { text: 'Story City' });
      if (cover.tagName === 'IMG') cover.addEventListener('error', () => cover.replaceWith(el('span', { text: 'Story City' })), { once: true });
      return el('div', { class: 'env', role: 'img', 'aria-label': story ? `A sealed envelope. On it: ${hint.join(' ')}` : 'A sealed envelope' },
        el('div', { class: 'back' }),
        el('div', { class: 'card', 'aria-hidden': 'true' }, el('div', { class: 'nm', text: story ? story.name : '' }), el('div', { class: 'cv' }, cover)),
        el('div', { class: 'front' }, el('div', { class: 'hint', 'aria-hidden': 'true' }, hint.map(line => el('span', { text: line })))),
        el('div', { class: 'flap' }),
        el('div', { class: 'seal', 'aria-hidden': 'true' }, el('i'), el('i')));
    }

    // ---------- secret pick ----------
    function pick(mood) {
      const weights = mood ? clean(mood.weights) : {};
      let pool = mood ? ctx.stories.filter(s => s.tags.some(t => mood.filter.includes(t))) : ctx.stories;
      if (pool.length < 3) pool = ctx.stories;
      const top = ctx.score(weights, pool).slice(0, 3);
      const r = Math.random();
      const i = Math.min(top.length - 1, r < 0.5 ? 0 : r < 0.8 ? 1 : 2);
      return { story: top[i].story, weights };
    }

    // ---------- screen 1: one optional tap ----------
    function moodScreen() {
      wrap.innerHTML = '';
      wrap.append(
        el('div', { class: 'eyebrow', text: 'One story, sealed' }),
        el('h2', { text: 'A story is waiting in an envelope near you' }),
        el('div', { class: 'preview' }, envelope(['? · ? · ?'], null)),
        el('p', { class: 'lead', text: 'Walk thirty steps and the seal breaks. First, one optional tap.' }),
        el('div', { class: 'q', text: 'Tonight feels…' }),
        el('div', { class: 'moods', role: 'group', 'aria-label': 'Tonight feels' },
          MOODS.map(m => el('button', { type: 'button', class: 'mood', onClick: () => walkScreen(m) }, el('b', { text: m.label }), el('span', { text: m.sub })))),
        el('button', { type: 'button', class: 'btn ghost block skip', text: 'Don’t ask me', onClick: () => walkScreen(null) }),
        el('p', { class: 'muted reel', text: 'Reel version: film the walk, the seal breaks on step 30.' }),
      );
    }

    // ---------- screen 2: walk to the envelope ----------
    function walkScreen(mood) {
      const { story, weights } = pick(mood);
      const hint = hintFor(story);
      let steps = 0, done = false, holdT = null, holdI = null, demoI = null, motionOff = null;
      wrap.innerHTML = '';
      window.scrollTo(0, 0);

      // map
      const NS = 'http://www.w3.org/2000/svg';
      const s = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); parent && parent.append(n); return n; };
      const svg = s('svg', { viewBox: `0 0 ${VW} ${VH}`, 'aria-hidden': 'true', preserveAspectRatio: 'xMidYMid slice' });
      for (let i = 0; i < XS.length - 1; i++) for (let j = 0; j < YS.length - 1; j++) {
        const park = (i === 2 && j === 0) || (i === 0 && j === 2);
        s('rect', { x: XS[i] + 9, y: YS[j] + 9, width: XS[i + 1] - XS[i] - 18, height: YS[j + 1] - YS[j] - 18, rx: 6, class: park ? 'park' : 'block' }, svg);
      }
      [[200, 30], [228, 52], [262, 26], [250, 68], [8, 228], [30, 262], [14, 278]].forEach(([cx, cy]) => s('circle', { cx, cy, r: 6, class: 'tree' }, svg));
      XS.slice(1, -1).forEach(x => s('line', { x1: x, y1: -20, x2: x, y2: VH + 20, class: x === 175 ? 'road main' : 'road' }, svg));
      YS.slice(1, -1).forEach(y => s('line', { x1: -20, y1: y, x2: VW + 20, y2: y, class: y === 195 ? 'road main' : 'road' }, svg));
      s('text', { x: 72, y: 94, class: 'label' }, svg).textContent = 'LANTERN AVE';
      s('text', { x: 300, y: 296, class: 'label' }, svg).textContent = 'ELM ST';
      s('path', { d: 'M' + ROUTE.map(p => p.join(',')).join(' L'), class: 'hintroute' }, svg);
      const crumbs = [];
      for (let d = 6; d < LEN - 4; d += 11) {
        const [cx, cy] = pointAt(d);
        crumbs.push({ d, n: s('circle', { cx, cy, r: 3, class: 'crumb', fill: mix(WALK_START, WALK_END, d / LEN), opacity: 0 }, svg) });
      }
      const ring = s('circle', { class: 'ring', cx: ROUTE[0][0], cy: ROUTE[0][1], r: 0 }, svg);
      const me = s('g', { class: 'me' }, svg);
      const pulse = s('circle', { class: 'pulse', r: 14 }, me);
      const dot = s('circle', { class: 'dot', r: 7 }, me);

      const parts = hintParts(story);
      const env = envelope([`${parts[0]} · ${parts[1]}`, parts[2]], story);
      env.style.left = (ENV_AT[0] / VW * 100) + '%';
      env.style.top = (ENV_AT[1] / VH * 100) + '%';
      const map = el('div', { class: 'map' }, svg, el('span', { class: 'you', text: mood ? `Tonight feels ${mood.label.toLowerCase()}` : 'Surprise me' }), el('div', { class: 'scrim' }), env);

      // panel
      const num = el('b', { text: '0' });
      const barFill = el('i');
      const live = el('div', { class: 'live', 'aria-live': 'polite' });
      const canSense = typeof DeviceMotionEvent !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);
      const sensorBtn = canSense ? el('button', { type: 'button', class: 'btn walk block', 'aria-pressed': 'false', text: 'Count my real steps', onClick: startSensor }) : null;
      const tapBtn = el('button', { type: 'button', class: 'btn block tapstep' }, 'I’m indoors · tap to step', el('small', { text: 'hold to keep walking' }));
      const demoBtn = el('button', { type: 'button', class: 'demo', text: 'Demo: walk for me', onClick: demo });
      const controls = el('div', {}, sensorBtn, tapBtn, demoBtn);
      const panel = el('div', { class: 'panel' },
        el('div', { class: 'count' }, num, el('span', { text: `/ ${STEPS} steps` }), el('span', { class: 'tip', text: 'walking around the room is fine' })),
        el('div', { class: 'bar', role: 'progressbar', 'aria-label': 'Steps', 'aria-valuemin': '0', 'aria-valuemax': String(STEPS), 'aria-valuenow': '0' }, barFill),
        el('p', { class: 'inside' }, 'On the envelope: ', el('b', { text: hint }), '. Thirty steps breaks the seal.'),
        controls, live);

      wrap.append(
        el('div', { class: 'eyebrow', text: 'Walk to open it' }),
        el('h2', { text: 'Thirty steps to open tonight’s story' }),
        map, panel,
        el('p', { class: 'muted reel', text: 'Reel version: film the walk, the seal breaks on step 30.' }),
      );

      function draw() {
        const t = steps / STEPS;
        const [x, y] = pointAt(t * LEN);
        [dot, pulse].forEach(c => { c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); });
        ring.setAttribute('cx', x.toFixed(1)); ring.setAttribute('cy', y.toFixed(1));
        ring.setAttribute('r', done ? 0 : (14 + (STEPS - steps) * 2.3).toFixed(1));
        ring.setAttribute('stroke', mix(WALK_START, WALK_END, t));
        crumbs.forEach(c => c.n.setAttribute('opacity', c.d <= t * LEN ? 0.95 : 0));
        num.textContent = steps;
        barFill.style.width = (t * 100) + '%';
        panel.querySelector('.bar').setAttribute('aria-valuenow', String(steps));
        env.style.setProperty('--t', t.toFixed(2));
      }

      function step() {
        if (done) return;
        steps = Math.min(STEPS, steps + 1);
        draw();
        if (steps === 10 || steps === 20) live.textContent = `${steps} of ${STEPS} steps.`;
        if (steps >= STEPS) reveal();
      }

      function stopInputs() {
        clearTimeout(holdT); clearInterval(holdI); clearInterval(demoI);
        holdT = holdI = demoI = null;
        tapBtn.classList.remove('holding');
        if (motionOff) { motionOff(); motionOff = null; }
      }
      teardown.push(stopInputs);

      // tap to step, hold to auto-step
      const endHold = () => { clearTimeout(holdT); clearInterval(holdI); holdT = holdI = null; tapBtn.classList.remove('holding'); };
      tapBtn.addEventListener('pointerdown', (e) => {
        if (e.button > 0) return;
        step();
        endHold();
        holdT = setTimeout(() => { tapBtn.classList.add('holding'); holdI = setInterval(step, 160); }, 450);
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => tapBtn.addEventListener(ev, endHold));
      tapBtn.addEventListener('click', (e) => { if (e.detail === 0) step(); }); // keyboard
      tapBtn.addEventListener('contextmenu', (e) => e.preventDefault());

      function demo() {
        if (demoI || done) return;
        demoBtn.disabled = true; demoBtn.textContent = 'Walking…';
        demoI = setInterval(step, reduced ? 30 : 110);
      }

      async function startSensor() {
        if (motionOff || done) return;
        try {
          if (typeof DeviceMotionEvent.requestPermission === 'function') {
            const res = await DeviceMotionEvent.requestPermission();
            if (res !== 'granted') { ctx.toast('No motion access. Tap to step instead.'); return; }
          }
        } catch (e) { ctx.toast('No motion access. Tap to step instead.'); return; }
        let avg = 0, armed = true, last = 0, heard = false;
        const onMotion = (e) => {
          const a = e.accelerationIncludingGravity || e.acceleration;
          if (!a || a.x == null) return;
          const m = Math.hypot(a.x, a.y || 0, a.z || 0);
          if (!heard) { heard = true; avg = m; }
          avg = avg * 0.9 + m * 0.1;
          const d = m - avg, now = performance.now();
          if (armed && d > 1.3 && now - last > 300) { armed = false; last = now; step(); }
          else if (d < 0.3) armed = true;
        };
        window.addEventListener('devicemotion', onMotion);
        const resetBtn = () => { sensorBtn.setAttribute('aria-pressed', 'false'); sensorBtn.textContent = 'Count my real steps'; };
        motionOff = () => { window.removeEventListener('devicemotion', onMotion); resetBtn(); };
        sensorBtn.setAttribute('aria-pressed', 'true');
        sensorBtn.textContent = 'Counting · walk around';
        const check = setTimeout(() => {
          if (!heard && motionOff) { motionOff(); motionOff = null; ctx.toast('No step sensor here. Tap to step instead.', 2600); }
        }, 4000);
        teardown.push(() => clearTimeout(check));
      }

      function reveal() {
        done = true;
        stopInputs();
        draw();
        controls.remove();
        map.classList.add('revealed');
        env.setAttribute('aria-label', `The envelope is open. Inside: ${story.name}`);
        env.classList.add('arrive');
        later(() => env.classList.add('cracked'), 750);
        later(() => env.classList.add('opened'), 1250);
        later(() => env.classList.add('out'), 1800);
        later(() => {
          panel.querySelector('.inside').remove();
          panel.append(el('div', { class: 'done' },
            el('p', { class: 'walked', text: 'You walked it open.' }),
            el('button', { type: 'button', class: 'btn primary block', text: 'Read the first chapter', onClick: () => {
              cleanup();
              ctx.finish({ story, weights, headline: 'You walked it open', why: 'Thirty steps, one seal, and this is the story that was inside.' });
            } })));
          live.textContent = `The seal broke. Inside: ${story.name}.`;
        }, 2500);
      }

      draw();
    }

    moodScreen();
  },
};
