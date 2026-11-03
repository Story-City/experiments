// Travelling Clue: a brass key carried gem to gem by many agents, on its way to the river. Carry it one hop.
const TEXT = {
  kicker: 'Clue courier',
  title: 'The brass key',
  sub: 'Passed hand to hand for weeks. It wants to reach the river.',
  journey: 'Its journey so far',
  carriers: (n) => `${n} agent${n === 1 ? '' : 's'} so far`,
  toRiver: (km) => `${km.toFixed(1)} km to the river`,
  here: (p) => `It’s waiting at ${p}`,
  pickUp: 'Pick It Up',
  again: 'Carry It Again',
  carryKicker: 'You’re carrying the key',
  carryTitle: (p) => `Take it to ${p}`,
  toNext: (km) => `${km.toFixed(1)} km to go`,
  walk: 'Pretend to Walk',
  walking: 'Walking…',
  atHome: 'Play at Home',
  homeHint: 'Walk to a door and back. Tap each time you finish a lap.',
  lap: 'I Did a Lap',
  laps: (n, of) => `Lap ${n} of ${of}`,
  walkHint: 'Out on a real walk, the key moves as you do.',
  arrived: (p) => `You made it to ${p}`,
  drop: 'Drop It Here',
  dropKicker: 'Key dropped',
  you: 'you',
  doneTitle: 'One hop closer',
  doneSub: (name, km) => `${name} carried the brass key ${km.toFixed(1)} km. The next agent will pick it up from here.`,
  doneNote: 'When it reaches the river, everyone who carried it unlocks the scene.',
  see: 'See the Journey',
  home: 'Back to Tools',
  skip: 'Skip to the End',
  skipHint: 'Mockup only: jump ahead to the day it reaches the river.',
  endKicker: 'Journey’s end',
  endTitle: 'The key reached the river',
  endSub: (n, km, days) => `${n} couriers carried it ${km.toFixed(1)} km over ${days} days.`,
  yourLeg: (km) => `Your leg: ${km.toFixed(1)} km`,
  replay: 'Fly It Again',
  scene: 'Unlock the Scene',
  sceneKicker: 'For every courier',
  sceneTitle: 'What the key opened',
  sceneText: 'At the water’s edge, the brass key turns in a lock no one had noticed: a little door in the old stone wall. Inside, a note in Wren’s handwriting: “You all got it here. The Society owes you one.”',
  share: 'Share the Route',
  shareText: (km, n) => `I helped carry a clue ${km.toFixed(1)} km across the city with ${n - 1} other couriers. ✈ Story City`,
  copied: 'Copied. Paste it anywhere.',
};

// The pretend city: gems on street corners (map units), previous hops, and the river.
const GEMS = [
  { name: 'Library Steps', x: 35, y: 250 },
  { name: 'Market Corner', x: 105, y: 250 },
  { name: 'The Bandstand', x: 105, y: 180 },
  { name: 'The Old Clock Tower', x: 175, y: 180 },
  { name: 'The Lantern Steps', x: 175, y: 110 },
];
const RIVER = { name: 'the river', x: 245, y: 30 };
const BRIDGE = { name: 'The Iron Bridge', x: 245, y: 110 };
const HOPS = [
  { agent: 'Agent Juniper', from: 0, to: 1, km: 0.6, when: '9 Oct' },
  { agent: 'Agent Pebble', from: 1, to: 2, km: 0.5, when: '17 Oct' },
  { agent: 'Agent Comet', from: 2, to: 3, km: 0.7, when: '26 Oct' },
];
const YOUR_HOP = { from: 3, to: 4, km: 0.8 };
// Pretend couriers who finish the journey after you (for the journey's-end preview).
const FUTURE = [
  { agent: 'Agent Wisp', from: 4, to: 'bridge', km: 0.9, when: '8 Nov' },
  { agent: 'Agent Bramble', from: 'bridge', to: 'river', km: 1.2, when: '14 Nov' },
];
const DAYS = 36;          // 9 Oct to 14 Nov
const LEFT_KM = 2.9;      // from where the key waits now to the river
const LAPS = 3;
const NAMES = ['Moth', 'Comet', 'Fern', 'Lantern', 'Otter', 'Quill', 'Sparrow', 'Velvet', 'Thistle', 'Ember'];
const STORE = 'storytools-travelling-clue';
const AGENT = 'storytools-agent';

export default function run(k) {
  const { h, show, bar, openSheet, closeSheet, css, tool, home, onLeave } = k;
  css('travelling-clue', CSS);
  let raf = 0;
  const timers = [];
  onLeave(() => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); });

  /* ---------- 1. the key and its journey ---------- */
  function intro() {
    const mine = loadHop();
    const hops = mine ? [...HOPS, { ...YOUR_HOP, agent: mine.agent, when: mine.when, mine: true }] : HOPS;
    const at = mine ? YOUR_HOP.to : YOUR_HOP.from;
    const left = mine ? LEFT_KM - YOUR_HOP.km : LEFT_KM;
    show(
      bar(TEXT.carriers(hops.length)),
      h('div', { class: 'tc-keywrap' }, brassKey()),
      h('p', { class: 'kicker centre' }, TEXT.kicker),
      h('h1', { class: 'display centre' }, TEXT.title),
      h('p', { class: 'sub centre' }, TEXT.sub),
      map({ hops, keyAt: at }).el,
      h('div', { class: 'tc-stat' }, h('b', {}, TEXT.toRiver(left)), h('span', {}, TEXT.here(GEMS[at].name))),
      h('p', { class: 'tc-label' }, TEXT.journey),
      h('ol', { class: 'tc-list' }, hops.map((hp) => h('li', { class: hp.mine ? 'mine' : null },
        h('span', { class: 'tc-dot', 'aria-hidden': 'true' }),
        h('div', {}, h('b', {}, hp.agent), hp.mine ? ` (${TEXT.you})` : null,
          h('small', {}, `${GEMS[hp.from].name} → ${GEMS[hp.to].name} · ${hp.km} km · ${hp.when}`))))),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', id: 'tcPick', onclick: () => { if (mine) clearHop(); carry(); } }, mine ? TEXT.again : TEXT.pickUp),
        mine ? h('button', { class: 'link', onclick: home }, TEXT.home) : null),
    );
  }

  /* ---------- 2. carry it: pretend walk, or laps at home ---------- */
  function carry(atHome = false) {
    const m = map({ hops: HOPS, keyAt: null, you: YOUR_HOP.from });
    const from = GEMS[YOUR_HOP.from], to = GEMS[YOUR_HOP.to];
    const left = h('b', {}, TEXT.toNext(YOUR_HOP.km));
    const hint = h('p', { class: 'hint centre' }, atHome ? TEXT.homeHint : TEXT.walkHint);
    const meter = h('i', {});
    let p = 0;
    let lap = 0;
    let done = false;

    const setP = (v) => {
      p = Math.min(1, v);
      m.moveYou(from.x + (to.x - from.x) * p, from.y + (to.y - from.y) * p, p);
      left.textContent = TEXT.toNext(YOUR_HOP.km * (1 - p));
      meter.style.width = `${p * 100}%`;
      if (p >= 1 && !done) { done = true; arrived(); }
    };
    let action = atHome ? doLap : walk;
    const main = h('button', { class: 'btn jewel', id: 'tcWalk', onclick: () => action() }, atHome ? TEXT.lap : TEXT.walk);
    const swap = h('button', { class: 'link', id: 'tcHome', onclick: () => carry(!atHome) }, atHome ? TEXT.walk : TEXT.atHome);

    function walk() {
      main.disabled = true; main.textContent = TEXT.walking; swap.hidden = true;
      const t0 = performance.now(), dur = 3200;
      const tick = (t) => { setP((t - t0) / dur); if (p < 1) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }
    function doLap() {
      lap++; swap.hidden = true;
      hint.textContent = TEXT.laps(lap, LAPS);
      const start = p, goal = lap / LAPS, t0 = performance.now();
      cancelAnimationFrame(raf);
      const tick = (t) => { const f = Math.min(1, (t - t0) / 600); setP(start + (goal - start) * f); if (f < 1) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
      if (lap >= LAPS) main.disabled = true;
    }
    function arrived() {
      hint.textContent = TEXT.arrived(to.name);
      main.disabled = false;
      main.textContent = TEXT.drop;
      main.id = 'tcDrop';
      action = () => { action = () => {}; drop(); };
    }

    show(
      bar(),
      h('p', { class: 'kicker' }, TEXT.carryKicker),
      h('h1', { class: 'display tc-small' }, TEXT.carryTitle(to.name)),
      m.el,
      h('div', { class: 'tc-stat' }, left, h('span', { class: 'tc-meter', 'aria-hidden': 'true' }, meter)),
      hint,
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, main, swap),
    );
    setP(0);
  }

  /* ---------- 3. drop it: your hop joins the map, then the payoff ---------- */
  function drop() {
    const name = agentName();
    const when = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    saveHop({ agent: name, when });
    const hops = [...HOPS, { ...YOUR_HOP, agent: name, when, mine: true }];
    const left = LEFT_KM - YOUR_HOP.km;
    const total = hops.reduce((s, hp) => s + hp.km, 0);
    show(
      bar(TEXT.carriers(hops.length)),
      h('p', { class: 'kicker' }, TEXT.dropKicker),
      h('h1', { class: 'display tc-small' }, TEXT.toRiver(left)),
      map({ hops, keyAt: YOUR_HOP.to, drawLast: true }).el,
      h('div', { class: 'tc-stat' }, h('b', {}, `${name} (${TEXT.you})`), h('span', {}, `${GEMS[YOUR_HOP.from].name} → ${GEMS[YOUR_HOP.to].name}`)),
      h('div', { class: 'spacer' }),
    );
    timers.push(setTimeout(() => openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.dropKicker),
        h('div', { class: 'tc-sheetkey' }, brassKey()),
        h('h3', {}, TEXT.doneTitle),
        h('p', { class: 'more' }, TEXT.doneSub(name, YOUR_HOP.km)),
        h('div', { class: 'tc-progress', 'aria-hidden': 'true' }, h('i', { style: `--w:${(total / (total + left)) * 100}%` })),
        h('p', { class: 'hint' }, `${TEXT.toRiver(left)} · ${TEXT.carriers(hops.length)}`),
        h('p', { class: 'more' }, TEXT.doneNote)),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => { closeSheet(); intro(); } }, TEXT.see),
        h('button', { class: 'btn ghost', id: 'tcEnd', onclick: () => journeyEnd(name, when) }, TEXT.skip),
        h('p', { class: 'hint centre' }, TEXT.skipHint)),
    ], null, tool.jewel), 1500));
  }

  /* ---------- 4. journey's end: everyone who carried it sees the whole route ---------- */
  function journeyEnd(name, when) {
    const hops = [...HOPS, { ...YOUR_HOP, agent: name, when, mine: true }, ...FUTURE];
    const total = hops.reduce((s2, hp) => s2 + hp.km, 0);
    const m = map({ hops, finale: true });
    show(
      bar(TEXT.carriers(hops.length)),
      h('p', { class: 'kicker' }, TEXT.endKicker),
      h('h1', { class: 'display tc-small' }, TEXT.endTitle),
      h('p', { class: 'sub' }, TEXT.endSub(hops.length, total, DAYS)),
      m.el,
      h('div', { class: 'tc-stat' }, h('b', {}, TEXT.yourLeg(YOUR_HOP.km)), h('button', { class: 'link', onclick: () => m.fly() }, TEXT.replay)),
      h('ol', { class: 'tc-list' }, hops.map((hp) => h('li', { class: hp.mine ? 'mine' : null },
        h('span', { class: 'tc-dot', 'aria-hidden': 'true' }),
        h('div', {}, h('b', {}, hp.agent), hp.mine ? ` (${TEXT.you})` : null,
          h('small', {}, `${spot(hp.from).name} → ${spot(hp.to).name} · ${hp.km} km · ${hp.when}`))))),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'tcScene', onclick: () => scene(total, hops.length) }, TEXT.scene)),
    );
    m.fly();
  }

  function scene(total, n) {
    openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.sceneKicker),
        h('div', { class: 'tc-sheetkey' }, brassKey()),
        h('h3', {}, TEXT.sceneTitle),
        h('p', { class: 'more' }, TEXT.sceneText)),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => shareRoute(total, n) }, TEXT.share),
        h('button', { class: 'link', onclick: home }, TEXT.home)),
    ], null, tool.jewel);
  }

  async function shareRoute(total, n) {
    const text = TEXT.shareText(total, n);
    try { if (navigator.share) { await navigator.share({ text }); return; } } catch (e) { return; }
    try { await navigator.clipboard.writeText(text); } catch (e) { /* ignore */ }
    k.toast(TEXT.copied);
  }

  /* ---------- the night map ---------- */
  // hops: dotted lines with agent names. keyAt: gem where the key waits. you: start of the walker dot.
  function map({ hops, keyAt, you, drawLast, finale }) {
    const streetsV = [35, 105, 175, 245, 315], streetsH = [40, 110, 180, 250];
    const blocks = [];
    const xs = [0, ...streetsV, 340], ys = [0, ...streetsH, 280];
    for (let i = 0; i < xs.length - 1; i++) {
      for (let j = 0; j < ys.length - 1; j++) {
        const x = xs[i] + 8, y = ys[j] + 8, w = xs[i + 1] - xs[i] - 16, hh = ys[j + 1] - ys[j] - 16;
        if (w > 4 && hh > 4) blocks.push(h('rect', { x, y, width: w, height: hh, rx: '3', fill: '#2a1658' }));
      }
    }
    const hopLines = hops.map((hp, i) => {
      const a = spot(hp.from), b = spot(hp.to);
      const last = drawLast && i === hops.length - 1;
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const vertical = a.x === b.x;
      return h('g', { class: `tc-hop${hp.mine ? ' mine' : ''}${last ? ' draw' : ''}${finale ? ' done' : ''}` },
        h('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y }),
        h('text', { x: vertical ? mx + 8 : mx, y: vertical ? my + 3 : my - 9, 'text-anchor': vertical ? 'start' : 'middle' },
          hp.mine ? `${hp.agent} (${TEXT.you})` : hp.agent));
    });
    const gems = (finale ? [...GEMS, BRIDGE] : GEMS).map((g) => h('g', { transform: `translate(${g.x} ${g.y})` },
      h('polygon', { points: '0,-7 6,0 0,7 -6,0', class: 'tc-gem' })));
    // A clue courier shows on the map as a little paper airplane (Melissa's idea, 3 Nov).
    const keyMark = keyAt != null ? h('g', { class: 'tc-keymark', transform: `translate(${GEMS[keyAt].x} ${GEMS[keyAt].y})` },
      h('circle', { r: '13', class: 'tc-halo' }), plane()) : null;
    const youDot = you != null ? h('g', { class: 'tc-you' },
      h('circle', { r: '14', class: 'tc-halo' }), plane()) : null;
    const flyer = finale ? h('g', { class: 'tc-flyer', transform: `translate(${GEMS[0].x} ${GEMS[0].y})` }, plane()) : null;
    const trail = you != null ? h('line', { class: 'tc-trail', x1: GEMS[you].x, y1: GEMS[you].y, x2: GEMS[you].x, y2: GEMS[you].y }) : null;

    const el = h('div', { class: 'tc-map', role: 'img', 'aria-label': `Map of the key’s journey toward ${RIVER.name}` },
      h('svg', { viewBox: '0 0 340 280' },
        h('rect', { width: '340', height: '280', fill: '#1a0b3d' }),
        blocks,
        streetsV.map((x) => h('line', { x1: x, y1: 0, x2: x, y2: 280, class: 'tc-street' })),
        streetsH.map((y) => h('line', { x1: 0, y1: y, x2: 340, y2: y, class: 'tc-street' })),
        h('path', { class: 'tc-river', d: 'M0 0 H340 V22 C300 34 270 14 230 24 C190 34 150 12 110 22 C70 32 40 14 0 24 Z' }),
        h('g', { transform: `translate(${RIVER.x} ${RIVER.y})` },
          h('circle', { r: '9', class: 'tc-goal' }),
          h('text', { class: 'tc-goaltext', x: '14', y: '4' }, 'The river')),
        finale ? null : h('line', { class: 'tc-ahead', x1: GEMS[4].x, y1: GEMS[4].y, x2: RIVER.x, y2: GEMS[4].y }),
        finale ? null : h('line', { class: 'tc-ahead', x1: RIVER.x, y1: GEMS[4].y, x2: RIVER.x, y2: RIVER.y }),
        hopLines, trail, gems, keyMark, youDot, flyer));

    // Move the walker (and stretch its trail) to x, y.
    const moveYou = (x, y) => {
      youDot?.setAttribute('transform', `translate(${x} ${y})`);
      trail?.setAttribute('x2', x); trail?.setAttribute('y2', y);
    };
    // The paper airplane flies the whole route, leg by leg.
    const fly = () => {
      if (!flyer) return;
      cancelAnimationFrame(raf);
      const pts = [spot(hops[0].from), ...hops.map((hp) => spot(hp.to))];
      const legs = pts.slice(1).map((b, i) => ({ a: pts[i], b, len: Math.hypot(b.x - pts[i].x, b.y - pts[i].y) }));
      const all = legs.reduce((s2, l) => s2 + l.len, 0), dur = 4200, t0 = performance.now();
      const tick = (t) => {
        let d = Math.min(1, (t - t0) / dur) * all;
        const leg = legs.find((l) => (d -= l.len) <= 0) || legs[legs.length - 1];
        const f = leg.len ? 1 + d / leg.len : 1;
        const x = leg.a.x + (leg.b.x - leg.a.x) * Math.min(1, f), y = leg.a.y + (leg.b.y - leg.a.y) * Math.min(1, f);
        const deg = Math.atan2(leg.b.y - leg.a.y, leg.b.x - leg.a.x) * 180 / Math.PI + 39;
        flyer.setAttribute('transform', `translate(${x} ${y}) rotate(${deg})`);
        if (t - t0 < dur) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    return { el, moveYou, fly };
  }

  function plane() {
    return h('g', { class: 'tc-plane' },
      h('path', { d: 'M-10 1 L10 -8 L1 10 Z', fill: '#fbf7ff', stroke: '#1a0b3d', 'stroke-width': '1.5', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M10 -8 L-2 4 L1 10 Z', fill: '#d9cef5', stroke: '#1a0b3d', 'stroke-width': '1.5', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M10 -8 L-2 4', stroke: '#DEC523', 'stroke-width': '1.2' }));
  }

  function brassKey() {
    return h('svg', { class: 'tc-key', viewBox: '0 0 160 70', 'aria-hidden': 'true' },
      h('circle', { cx: '34', cy: '35', r: '24', fill: 'none', stroke: '#DEC523', 'stroke-width': '10' }),
      h('circle', { cx: '34', cy: '35', r: '9', fill: 'none', stroke: '#F5B82E', 'stroke-width': '4' }),
      h('rect', { x: '56', y: '30', width: '96', height: '10', rx: '4', fill: '#DEC523' }),
      h('rect', { x: '58', y: '30', width: '94', height: '3', rx: '1.5', fill: '#F5B82E' }),
      h('rect', { x: '118', y: '40', width: '9', height: '14', rx: '1', fill: '#DEC523' }),
      h('rect', { x: '133', y: '40', width: '9', height: '20', rx: '1', fill: '#DEC523' }),
      h('rect', { x: '146', y: '40', width: '6', height: '10', rx: '1', fill: '#ED8D00' }));
  }

  function agentName() {
    try {
      let n = localStorage.getItem(AGENT);
      if (!n) { n = `Agent ${NAMES[Math.floor(Math.random() * NAMES.length)]}`; localStorage.setItem(AGENT, n); }
      return n;
    } catch (e) { return 'Agent Moth'; }
  }

  intro();
}

// A hop end can be a gem index or a named spot past the gems.
function spot(at) { return at === 'bridge' ? BRIDGE : at === 'river' ? RIVER : GEMS[at]; }

function loadHop() { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { return null; } }
function saveHop(hop) { try { localStorage.setItem(STORE, JSON.stringify(hop)); } catch (e) { /* ignore */ } }
function clearHop() { try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ } }

const CSS = `
.tc-keywrap { width: 150px; margin: 0 auto 10px; }
.tc-key { display: block; width: 100%; height: auto; filter: drop-shadow(0 8px 18px color-mix(in srgb, #DEC523 35%, transparent)); animation: tc-bob 3s ease-in-out infinite; }
@keyframes tc-bob { 50% { transform: translateY(-4px) rotate(-3deg); } }
.tc-map { flex-shrink: 0; margin-top: 16px; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); }
.tc-map svg { display: block; width: 100%; height: auto; }
.tc-street { stroke: #46337e; stroke-width: 8; }
.tc-river { fill: color-mix(in srgb, #4CBFE9 45%, #1a0b3d); }
.tc-goal { fill: none; stroke: #4CBFE9; stroke-width: 2.5; stroke-dasharray: 3 3; animation: tc-spin 8s linear infinite; transform-box: fill-box; transform-origin: center; }
@keyframes tc-spin { to { transform: rotate(360deg); } }
.tc-goaltext { font: italic 600 11px var(--f-head); fill: #fbf7ff; }
.tc-ahead { stroke: #a493d6; stroke-width: 1.5; stroke-dasharray: 2 5; opacity: 0.6; }
.tc-hop line { stroke: var(--jewel); stroke-width: 3; stroke-dasharray: 2 6; stroke-linecap: round; }
.tc-hop text { font: 700 8.5px var(--f-body); fill: #d9cef5; paint-order: stroke; stroke: #1a0b3d; stroke-width: 3px; }
.tc-hop.mine line { stroke: #fbf7ff; stroke-dasharray: 2 6; }
.tc-hop.mine text { fill: #fbf7ff; }
.tc-hop.draw line { animation: tc-draw 1.2s ease-out both; }
.tc-hop.draw text { animation: fade 0.4s 1s both; }
@keyframes tc-draw { from { stroke-dasharray: 0 200; } }
.tc-gem { fill: var(--jewel); stroke: #1a0b3d; stroke-width: 2; }
.tc-halo { fill: color-mix(in srgb, #DEC523 25%, transparent); animation: tc-pulse 1.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.tc-you .tc-halo { fill: color-mix(in srgb, #fbf7ff 22%, transparent); }
@keyframes tc-pulse { 50% { transform: scale(1.35); opacity: 0.4; } }
.tc-plane { animation: tc-glide 2.4s ease-in-out infinite; }
@keyframes tc-glide { 50% { transform: translate(1.5px, -2px) rotate(-4deg); } }
.tc-hop.done line { stroke-dasharray: none; stroke-width: 3.5; opacity: 0.9; }
.tc-hop.done.mine line { stroke: #fbf7ff; }
.tc-trail { stroke: #fbf7ff; stroke-width: 3; stroke-linecap: round; }
.tc-stat { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 12px; font-size: 14px; color: var(--lilac); }
.tc-stat b { font: 600 20px var(--f-head); color: var(--starlight); white-space: nowrap; }
.tc-stat span { text-align: right; min-width: 0; }
.tc-meter { flex: 1; max-width: 160px; height: 8px; border-radius: 99px; background: var(--line); overflow: hidden; }
.tc-meter i { display: block; height: 100%; width: 0; background: var(--jewel); border-radius: 99px; }
.tc-label { margin: 18px 0 6px; font: 700 12px var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; color: var(--glow); }
.tc-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.tc-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; color: var(--mist); }
.tc-list b { color: var(--starlight); }
.tc-list small { display: block; color: var(--lilac); font-size: 12.5px; }
.tc-dot { flex: none; width: 10px; height: 10px; margin-top: 5px; rotate: 45deg; background: var(--jewel); }
.tc-list li.mine .tc-dot { background: var(--starlight); }
.display.tc-small { font-size: 30px; }
.tc-sheetkey { width: 110px; margin: 2px auto 10px; }
.tc-progress { height: 10px; border-radius: 99px; background: var(--line); overflow: hidden; margin: 16px 0 6px; }
.tc-progress i { display: block; height: 100%; width: var(--w); background: linear-gradient(90deg, var(--jewel), #4CBFE9); border-radius: 99px; animation: tc-fill 1s ease-out both; }
@keyframes tc-fill { from { width: 0; } }
`;
