// Compass Only: no map, just an arrow, a colour and "warmer / colder" toward a hidden gem.
// Real GPS + phone compass + vibration if allowed; "Pretend to Walk" buttons always work.

const TEXT = {
  kicker: 'Wren hid a gem near you',
  title: 'Find the hidden gem.',
  sub: 'No map. The arrow leans toward it, the screen warms up, and your phone buzzes faster as you close in.',
  safe: 'Stay on sidewalks and paths. If the arrow points into a yard or a building, walk around the block instead.',
  hide: 'Start the Hunt',
  home: 'Play at Home',
  barOut: 'Outside',
  barHome: 'At home',
  start: 'Start walking',
  warmer: 'Warmer!',
  colder: 'Colder',
  hot: 'Burning hot!',
  gpsOn: 'Walking for real works too. The arrow follows you.',
  gpsOff: 'No GPS here, so use the pretend buttons below.',
  homeHint: 'It is hidden somewhere in this room. Count real steps if you like.',
  turnTip: 'Wren: “Try turning around. Colder just means the other way.”',
  pretend: 'Pretend to Walk',
  stepsOut: 'Take 10 Steps',
  stepsHome: 'Take 1 Step',
  left: 'Turn Left',
  right: 'Turn Right',
  down: 'Phone Down Mode',
  downTip: 'Walk and feel the buzz. Tap anywhere to come back.',
  downNoBuzz: 'No buzz on this phone, so peek at the glow. Tap anywhere to come back.',
  foundKicker: 'Found it',
  foundTitle: 'Saved to your map',
  foundSub: (n) => `${n} steps, no map. Wren will be impressed.`,
  nameLabel: 'Name your gem',
  names: ['The Quiet Corner', 'Wren’s Secret Spot', 'The Hidden Bend', 'The Lucky Crossing', 'The Little Hideaway'],
  renamed: 'Gem renamed',
  again: 'Hide Another',
  back: 'Back to Tools',
};

const COLD = '#5b8cff';   // sapphire
const MID = '#F5B82E';    // citrine
const HOT = '#FA7423';    // carnelian
const GEMS = ['#35C6D7', '#9883F8', '#F5B82E', '#ED54B3', '#00CD9D'];   // jewel colours a gem can be
const STEP_M = 0.75;      // one pretend step in metres
const STORE = 'sc-compass-gems';
const canBuzz = () => typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function' && navigator.userActivation?.hasBeenActive !== false;

export default function run(k) {
  const { h } = k;
  css(k);

  intro();

  function intro() {
    k.show(
      k.bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title),
      h('p', { class: 'sub' }, TEXT.sub),
      h('div', { class: 'cp-teaser', 'aria-hidden': 'true' }, arrowSvg()),
      h('p', { class: 'hint centre' }, TEXT.safe),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => { askCompass(); hunt(false); } }, TEXT.hide),
        h('button', { class: 'btn ghost', onclick: () => hunt(true) }, TEXT.home)));
  }

  // iOS only lets us read the compass after a tap.
  function askCompass() {
    try {
      const D = window.DeviceOrientationEvent;
      if (D && typeof D.requestPermission === 'function') D.requestPermission().catch(() => {});
    } catch (e) { /* no compass, fine */ }
  }

  function hunt(atHome) {
    // Positions in metres (outside) or steps (at home): x east, y north.
    const far = atHome ? 6 + Math.random() * 3 : 150;
    const found = atHome ? 1.5 : 10;
    const unit = atHome ? 1 : STEP_M * 10;
    const brg = Math.random() * Math.PI * 2;
    const target = { x: Math.sin(brg) * far, y: Math.cos(brg) * far };
    const pretend = { x: 0, y: 0 };
    let gps = { x: 0, y: 0 }, gpsOrigin = null;
    let turn = 0, device = null, steps = 0, done = false, colds = 0;
    let lastD = far, shown = 0, t0 = performance.now();
    let warmth = 0, colour = COLD, wordNow = TEXT.start, down = null;

    const word = h('p', { class: 'cp-word' }, TEXT.start);
    const g = h('g', {}, arrowShape());
    const stage = h('div', { class: 'cp-stage' }, h('svg', { class: 'cp-arrow', viewBox: '-100 -100 200 200', 'aria-hidden': 'true' }, g), word);
    const status = h('p', { class: 'hint centre cp-status' }, atHome ? TEXT.homeHint : TEXT.gpsOff);

    const fwd = h('button', { class: 'btn jewel cp-fwd' }, atHome ? TEXT.stepsHome : TEXT.stepsOut);
    holdRepeat(fwd, () => walk(1));

    k.show(
      k.bar(atHome ? TEXT.barHome : TEXT.barOut),
      stage,
      status,
      h('div', { class: 'centre' }, h('button', { class: 'link cp-downbtn', onclick: phoneDown }, `◐ ${TEXT.down}`)),
      h('div', { class: 'spacer' }),
      h('p', { class: 'kicker centre' }, TEXT.pretend),
      h('div', { class: 'cp-pad' },
        h('button', { class: 'btn ghost cp-turn', 'aria-label': TEXT.left, onclick: () => { turn -= 45; } }, '↺', h('span', {}, TEXT.left)),
        fwd,
        h('button', { class: 'btn ghost cp-turn', 'aria-label': TEXT.right, onclick: () => { turn += 45; } }, '↻', h('span', {}, TEXT.right))));

    const facing = () => ((device ?? 0) + turn) * Math.PI / 180;
    const here = () => ({ x: gps.x + pretend.x, y: gps.y + pretend.y });

    function walk(n) {
      if (done) return;
      const f = facing();
      pretend.x += Math.sin(f) * unit * n;
      pretend.y += Math.cos(f) * unit * n;
      steps += atHome ? n : n * 10;
      check();
    }

    function check() {
      const p = here();
      const d = Math.hypot(target.x - p.x, target.y - p.y);
      const gap = atHome ? 0.4 : 3;
      if (d <= found) return win();
      if (d < lastD - gap) { colds = 0; say(d < found * 2.2 ? TEXT.hot : TEXT.warmer, 'warm'); }
      else if (d > lastD + gap) {
        // fail forward: no penalty, just a friendly nudge after a few colders
        colds += 1;
        say(TEXT.colder, 'cold');
        if (colds >= 3) status.textContent = TEXT.turnTip;
      } else return paint(d);
      lastD = d;
      paint(d);
    }

    function say(txt, kind) {
      wordNow = txt;
      word.textContent = txt;
      word.className = `cp-word ${kind}`;
      word.style.animation = 'none'; void word.offsetWidth; word.style.animation = '';
      down?.say(txt, kind);
    }

    // cold sapphire -> citrine -> carnelian as you close in
    function paint(d) {
      warmth = Math.max(0, Math.min(1, 1 - d / (far * 1.1)));
      colour = warmth < 0.5
        ? `color-mix(in oklab, ${MID} ${Math.round(warmth * 200)}%, ${COLD})`
        : `color-mix(in oklab, ${HOT} ${Math.round((warmth - 0.5) * 200)}%, ${MID})`;
      stage.style.setProperty('--cp-bg', colour);
      down?.paint();
    }
    paint(far);

    // Heartbeat: one short buzz per beat, beats get closer as you warm up.
    const beatMs = () => Math.round(1600 - warmth * 1350);   // 1.6 s cold -> 0.25 s hot
    let beatT = 0;
    function beat() {
      if (done) return;
      if (canBuzz()) { try { navigator.vibrate(warmth > 0.8 ? 60 : 35); } catch (e) { /* ignore */ } }
      down?.pulse();
      beatT = setTimeout(beat, beatMs());
    }
    beatT = setTimeout(beat, 600);
    k.onLeave(() => { clearTimeout(beatT); if (canBuzz()) try { navigator.vibrate(0); } catch (e) { /* ignore */ } });

    // Phone Down Mode: near-black screen, one huge word, a soft glow. Tap or Esc to exit.
    function phoneDown() {
      if (down || done) return;
      const big = h('p', { class: 'cp-dword' }, wordNow);
      const glow = h('div', { class: 'cp-glow', 'aria-hidden': 'true' });
      const el = h('div', { class: 'cp-down', role: 'dialog', 'aria-label': TEXT.down, tabindex: '-1' },
        glow, big, h('p', { class: 'cp-dtip' }, canBuzz() ? TEXT.downTip : TEXT.downNoBuzz));
      const phone = document.getElementById('phone') || document.body;
      const exit = () => {
        el.remove();
        document.removeEventListener('keydown', onKey, true);
        down = null;
      };
      const onKey = (e) => {
        if (e.key === 'Escape') { e.stopPropagation(); exit(); }
        else if (e.key === 'ArrowUp' || e.key === ' ') { e.preventDefault(); walk(1); }   // testers can still walk
      };
      el.addEventListener('click', exit);
      document.addEventListener('keydown', onKey, true);
      phone.append(el);
      el.focus();
      down = {
        exit,
        say: (txt, kind) => { big.textContent = txt; big.className = `cp-dword ${kind}`; big.style.animation = 'none'; void big.offsetWidth; big.style.animation = ''; },
        paint: () => el.style.setProperty('--cp-bg', colour),
        pulse: () => { glow.style.animation = 'none'; void glow.offsetWidth; glow.style.animation = ''; },
      };
      down.paint();
      k.onLeave(exit);
    }

    // the arrow: smooth toward the true direction, plus a gentle wobble
    let raf = 0;
    function frame(now) {
      const p = here();
      const want = (Math.atan2(target.x - p.x, target.y - p.y) - facing()) * 180 / Math.PI;
      let diff = ((want - shown) % 360 + 540) % 360 - 180;
      shown += diff * 0.12;
      const t = (now - t0) / 1000;
      const wob = Math.sin(t * 2.1) * 5 + Math.sin(t * 5.3) * 1.6;
      g.setAttribute('transform', `rotate(${(shown + wob).toFixed(1)})`);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    k.onLeave(() => cancelAnimationFrame(raf));

    // phone compass, if there is one
    const onTurn = (e) => {
      if (e.webkitCompassHeading != null) device = e.webkitCompassHeading;
      else if (e.absolute && e.alpha != null) device = (360 - e.alpha) % 360;
    };
    window.addEventListener('deviceorientationabsolute', onTurn);
    window.addEventListener('deviceorientation', onTurn);
    k.onLeave(() => {
      window.removeEventListener('deviceorientationabsolute', onTurn);
      window.removeEventListener('deviceorientation', onTurn);
    });

    // real walking (outside only); never waits on permission
    if (!atHome && navigator.geolocation) {
      try {
        const id = navigator.geolocation.watchPosition((pos) => {
          const { latitude: la, longitude: lo } = pos.coords;
          if (!gpsOrigin) { gpsOrigin = { la, lo }; status.textContent = TEXT.gpsOn; return; }
          const next = {
            x: (lo - gpsOrigin.lo) * Math.cos(gpsOrigin.la * Math.PI / 180) * 111320,
            y: (la - gpsOrigin.la) * 110540,
          };
          steps += Math.round(Math.hypot(next.x - gps.x, next.y - gps.y) / STEP_M);
          gps = next;
          check();
        }, () => { status.textContent = TEXT.gpsOff; }, { enableHighAccuracy: true, maximumAge: 2000 });
        k.onLeave(() => navigator.geolocation.clearWatch(id));
      } catch (e) { /* keep pretending */ }
    }

    function win() {
      if (done) return;
      done = true;
      clearTimeout(beatT);
      if (canBuzz()) try { navigator.vibrate([80, 60, 80, 60, 200]); } catch (e) { /* ignore */ }
      down?.exit();
      stage.style.setProperty('--cp-bg', HOT);
      say(TEXT.hot, 'hot');
      const gem = saveGem(k.pick(TEXT.names), k.pick(GEMS), Math.max(1, steps));
      setTimeout(() => foundSheet(gem), 450);
    }

    function foundSheet(gem) {
      const name = h('input', { class: 'cp-name', value: gem.name, maxlength: '40', 'aria-label': TEXT.nameLabel, spellcheck: 'false',
        onchange: (e) => { gem.name = e.target.value.trim() || gem.name; e.target.value = gem.name; renameGem(gem); k.toast(TEXT.renamed); },
        onkeydown: (e) => { if (e.key === 'Enter') e.target.blur(); },
      });
      k.openSheet([
        h('div', { class: 'celebrate' },
          h('div', { class: 'cp-gem', style: `--gem:${gem.colour}` }, gemSvg()),
          h('p', { class: 'kicker' }, TEXT.foundKicker),
          h('h3', {}, TEXT.foundTitle),
          h('label', { class: 'cp-namewrap' }, h('span', {}, `✎ ${TEXT.nameLabel}`), name),
          h('p', { class: 'more' }, TEXT.foundSub(gem.steps))),
        h('div', { class: 'btns' },
          h('button', { class: 'btn jewel', onclick: () => hunt(atHome) }, TEXT.again),
          h('button', { class: 'link', onclick: k.home }, TEXT.back)),
      ], null, k.tool.jewel);
    }
  }

  // Found gems live in localStorage (the "map" in this mockup).
  function loadGems() {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) { return []; }
  }
  function saveGem(name, colour, steps) {
    const gem = { id: Date.now(), name, colour, steps };
    try { localStorage.setItem(STORE, JSON.stringify([...loadGems(), gem].slice(-30))); } catch (e) { /* keep going */ }
    return gem;
  }
  function renameGem(gem) {
    try { localStorage.setItem(STORE, JSON.stringify(loadGems().map((g) => (g.id === gem.id ? gem : g)))); } catch (e) { /* keep going */ }
  }

  // press and hold repeats the step
  function holdRepeat(btn, fn) {
    let timer = 0;
    const stop = () => { clearInterval(timer); timer = 0; };
    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); fn(); stop(); timer = setInterval(fn, 260); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
    k.onLeave(stop);
  }

  function arrowShape() {
    return [
      h('circle', { r: 92, class: 'cp-ring' }),
      h('path', { d: 'M0 -78 L34 22 L8 10 L8 64 L-8 64 L-8 10 L-34 22 Z', class: 'cp-head' }),
      h('circle', { r: 6, cy: 30, class: 'cp-pin' }),
    ];
  }
  function arrowSvg() {
    return h('svg', { viewBox: '-100 -100 200 200' }, h('g', { class: 'cp-spin' }, arrowShape()));
  }

  function gemSvg() {
    return h('svg', { viewBox: '0 0 120 110', 'aria-hidden': 'true' },
      h('polygon', { points: '30,10 90,10 115,40 60,105 5,40', style: 'fill: var(--gem, var(--jewel))' }),
      h('polygon', { points: '30,10 45,40 5,40', style: 'fill: var(--starlight)', opacity: '0.35' }),
      h('polygon', { points: '45,40 75,40 60,105', style: 'fill: var(--starlight)', opacity: '0.18' }),
      h('polygon', { points: '90,10 115,40 75,40', style: 'fill: var(--ink)', opacity: '0.18' }),
      h('polygon', { points: '30,10 90,10 75,40 45,40', style: 'fill: var(--starlight)', opacity: '0.25' }),
      h('polygon', { points: '75,40 115,40 60,105', style: 'fill: var(--ink)', opacity: '0.12' }));
  }
}

function css(k) {
  k.css('compass', `
.cp-teaser { width: 150px; margin: 22px auto 6px; }
.cp-teaser svg { width: 100%; display: block; }
.cp-spin { animation: cp-sway 3s ease-in-out infinite; transform-origin: 0 0; }
@keyframes cp-sway { 50% { transform: rotate(18deg); } }
.cp-ring { fill: none; stroke: var(--line); stroke-width: 2; stroke-dasharray: 2 8; }
.cp-head { fill: var(--jewel); }
.cp-pin { fill: var(--midnight); }
.cp-stage { --cp-bg: #5b8cff; position: relative; border-radius: 24px; padding: 22px 16px 18px; text-align: center; overflow: hidden;
  background: radial-gradient(90% 80% at 50% 40%, color-mix(in srgb, #fbf7ff 30%, transparent), transparent 70%), var(--cp-bg);
  transition: background 0.8s ease; box-shadow: 0 18px 50px color-mix(in srgb, var(--cp-bg) 45%, transparent); }
.cp-stage .cp-arrow { width: min(70vw, 250px); display: block; margin: 0 auto; }
.cp-stage .cp-ring { stroke: var(--midnight); opacity: 0.35; }
.cp-stage .cp-head { fill: var(--midnight); }
.cp-stage .cp-pin { fill: var(--starlight); }
.cp-word { margin: 10px 0 0; font: 600 34px/1.05 var(--f-head); color: var(--midnight); min-height: 1.1em; animation: pop 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
.cp-word.cold { font-style: italic; opacity: 0.8; }
.cp-status { margin: 12px 0 0; }
.cp-downbtn { color: var(--glow); }
.cp-pad { display: grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 8px; align-items: stretch; }
.cp-pad .btn { padding: 10px 8px; min-height: 60px; }
.cp-turn { display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 22px; line-height: 1; gap: 4px; }
.cp-turn span { font-size: 12px; font-weight: 700; }
.cp-fwd { touch-action: none; user-select: none; -webkit-user-select: none; }
.cp-down { --cp-bg: #5b8cff; position: absolute; inset: 0; z-index: 15; background: var(--ink); display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 24px 16px; text-align: center; cursor: pointer; outline: none; animation: fade 0.3s ease both; overflow: hidden; }
.cp-glow { position: absolute; left: 50%; top: 50%; width: 120vmin; height: 120vmin; max-width: 560px; max-height: 560px; translate: -50% -50%; border-radius: 50%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--cp-bg) 38%, transparent), transparent); transition: background 0.8s ease; animation: cp-beat 0.9s ease-out both; }
@keyframes cp-beat { 0% { scale: 0.8; opacity: 0.4; } 25% { scale: 1.05; opacity: 1; } 100% { scale: 0.92; opacity: 0.55; } }
.cp-dword { position: relative; margin: 0; font: 600 76px/1 var(--f-head); color: var(--cp-bg); text-wrap: balance; transition: color 0.8s ease; animation: pop 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
.cp-dword.cold { font-style: italic; }
.cp-dtip { position: absolute; bottom: max(28px, env(safe-area-inset-bottom)); left: 16px; right: 16px; margin: 0; color: var(--lilac); font-size: 14px; opacity: 0.7; }
.cp-gem { width: 110px; margin: 0 auto 10px; animation: land 0.6s cubic-bezier(0.2, 1.3, 0.4, 1) both; filter: drop-shadow(0 8px 24px color-mix(in srgb, var(--gem, var(--jewel)) 55%, transparent)); }
.cp-gem svg { width: 100%; display: block; }
.cp-namewrap { display: block; margin: 14px auto 0; max-width: 300px; }
.cp-namewrap span { display: block; font: 700 11px var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; color: var(--lilac); margin-bottom: 4px; }
.cp-name { width: 100%; min-height: 48px; box-sizing: border-box; border: 0; border-bottom: 1.5px dashed var(--line); background: none; text-align: center;
  font: 600 24px/1.2 var(--f-head); color: var(--starlight); padding: 6px 4px; }
.cp-name:focus { outline: none; border-bottom-color: var(--jewel); }
`);
}
