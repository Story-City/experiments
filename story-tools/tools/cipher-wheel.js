// Cipher Wheel: a Decoder Ring you keep across chapters. Find a public number, turn the ring to it, decode.
// Privacy: keys only ever come from public things (plaques, bus stops, library stairs), never homes.
const TEXT = {
  kicker: 'Your Decoder Ring',
  title: (n) => `Society message ${n}`,
  progress: (n, of) => `${n} of ${of} messages decoded`,
  allDone: 'All three decoded. The ring starts over with fresh eyes.',
  found: 'Pretend I Found It',
  atHome: 'Play at Home',
  homeGo: 'I Know the Number',
  keyIs: (n) => `Your key is ${n}`,
  turn: (n) => `Turn the inner ring until it says ${n}.`,
  turnHint: 'Drag the wheel or use the buttons.',
  set: 'The ring clicks into place. Now decode.',
  decodeHint: 'Find the glowing letter on the outer ring. Tap the inner letter right under it.',
  wrong: 'Look again: the inner ring, under the glow.',
  minus: 'Turn back one',
  plus: 'Turn forward one',
  doneKicker: 'Decoded',
  doneSub: 'Wren: “Good. Keep the ring safe. More messages are coming.”',
  shareLine: (n, of, slips) => `Cipher Wheel ✦ ${n} of ${of} decoded · ${slips} slip${slips === 1 ? '' : 's'}`,
  share: 'Share',
  copied: 'Copied. Paste it anywhere.',
  next: 'Decode the Next One',
  restart: 'Start the Ring Again',
  back: 'Back to Tools',
};

// Each message: a public thing to find outside, a stand-in to read at home, and the key.
const MESSAGES = [
  { plain: 'LOOK UP HIGH',
    walk: 'Find the year on the brass plaque by the library door. Its last digit is your key.',
    badge: { kind: 'plaque', text: '1923' }, key: 3, note: 'The plaque says 1923, so the key is 3.',
    home: 'How many days are in a week? That number is your key.', homeKey: 7, homeNote: 'Seven days, every week.' },
  { plain: 'FOLLOW THE CAT',
    walk: 'Find the number on the nearest bus stop sign. Its last digit is your key.',
    badge: { kind: 'bus', text: '5308' }, key: 8, note: 'Stop 5308, so the key is 8.',
    home: 'How many legs does a kitchen chair have? That number is your key.', homeKey: 4, homeNote: 'Most chairs have four legs.' },
  { plain: 'THE OWL KNOWS',
    walk: 'Count the steps up to the library’s front door. That number is your key.',
    badge: { kind: 'steps', text: '12' }, key: 12, note: 'Twelve steps up, so the key is 12.',
    home: 'How many months are in a year? That number is your key.', homeKey: 12, homeNote: 'Twelve months, every year.' },
];
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const STEP = 360 / 26;
const STORE = 'sc-cipher-ring';

export default function run(k) {
  const { h, show, bar, openSheet, closeSheet, css, tool, home, toast, shuffle, onLeave } = k;
  css('cipher-wheel', CSS);

  // How many messages this ring has decoded (kept between visits).
  const loadRing = () => { try { return Number(localStorage.getItem(STORE)) || 0; } catch (e) { return 0; } };
  const saveRing = (n) => { try { localStorage.setItem(STORE, String(n)); } catch (e) { /* keep going */ } };

  function progressDots(n) {
    return h('div', { class: 'cw-ring' },
      h('div', { class: 'cw-dots' }, MESSAGES.map((m, i) => h('span', { class: `cw-dot${i < n ? ' on' : ''}${i === n ? ' now' : ''}` }))),
      h('span', {}, TEXT.progress(n, MESSAGES.length)));
  }

  function intro() {
    let done = loadRing();
    const fresh = done >= MESSAGES.length;   // a full ring starts over
    if (fresh) { done = 0; saveRing(0); }
    const n = done;
    const m = MESSAGES[n];
    show(
      bar(`${done} / ${MESSAGES.length}`),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title(n + 1)),
      progressDots(n),
      fresh ? h('p', { class: 'hint centre' }, TEXT.allDone) : null,
      h('div', { class: 'frame cw-ask' }, h('p', { class: 'big' }, m.walk)),
      h('div', { class: 'cw-mini' }, wheelArt(0).svg),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => keyScreen(n, m.key, badgeEl(m.badge), m.note) }, TEXT.found),
        h('button', { class: 'link', onclick: () => homeAsk(n) }, TEXT.atHome)),
    );
  }

  function homeAsk(n) {
    const m = MESSAGES[n];
    show(
      bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.title(n + 1)),
      h('div', { class: 'frame cw-ask' }, h('p', { class: 'big' }, m.home)),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => keyScreen(n, m.homeKey, h('div', { class: 'cw-plate cw-chair' }, String(m.homeKey)), m.homeNote) }, TEXT.homeGo)),
    );
  }

  // Little picture of the public thing the key came from.
  function badgeEl(b) {
    if (b.kind === 'bus') return h('div', { class: 'cw-plate cw-bus' }, h('small', {}, 'Stop'), b.text);
    if (b.kind === 'steps') return h('div', { class: 'cw-plate cw-steps' }, h('i'), h('i'), h('i'), h('b', {}, b.text));
    return h('div', { class: 'cw-plate cw-brass' }, b.text);
  }

  // Turn the wheel to the key, then decode letter by letter.
  function keyScreen(n, key, badge, note) {
    const plain = MESSAGES[n].plain;
    const cipher = encode(plain, key);
    const wheel = wheelArt(0, true);
    const keyOut = h('span', { class: 'cw-keynow' }, '0');
    const status = h('p', { class: 'hint centre' }, TEXT.turn(key));
    const decodeBox = h('div', { class: 'cw-decode', hidden: true });
    let unlocked = false, slips = 0;

    wheel.onTurn = (v) => {
      keyOut.textContent = v;
      if (!unlocked && v === key % 26) {
        unlocked = true;
        status.textContent = TEXT.set;
        status.classList.add('cw-ok');
        decodeBox.hidden = false;
        startDecode();
        decodeBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };
    onLeave(wheel.stop);

    show(
      bar(),
      h('div', { class: 'cw-keyrow' }, badge, h('div', {}, h('b', {}, TEXT.keyIs(key)), h('span', {}, note))),
      h('div', { class: 'cw-wheel' }, wheel.svg),
      h('div', { class: 'cw-turn' },
        h('button', { class: 'cw-pm', 'aria-label': TEXT.minus, onclick: () => wheel.nudge(-1) }, '−'),
        keyOut,
        h('button', { class: 'cw-pm', 'aria-label': TEXT.plus, onclick: () => wheel.nudge(1) }, '+')),
      status,
      h('p', { class: 'hint centre' }, TEXT.turnHint),
      decodeBox,
    );

    function startDecode() {
      let at = cipher.search(/[A-Z]/);
      const tiles = cipher.split('').map((ch) => (ch === ' '
        ? h('span', { class: 'cw-gap' })
        : h('span', { class: 'cw-tile' }, h('i', {}, ch), h('b', {}, ''))));
      const choices = h('div', { class: 'cw-choices' });
      decodeBox.replaceChildren(
        h('div', { class: 'cw-tiles' }, tiles),
        h('p', { class: 'hint centre' }, TEXT.decodeHint),
        choices);

      function next() {
        tiles.forEach((t, i) => t.classList.toggle('on', i === at));
        wheel.glow(cipher[at]);
        const right = plain[at];
        const wrong = shuffle(ABC.split('').filter((c) => c !== right)).slice(0, 2);
        choices.replaceChildren(...shuffle([right, ...wrong]).map((c) => h('button', {
          class: 'cw-choice',
          onclick: (e) => {
            if (c !== right) { slips += 1; const b = e.currentTarget; b.classList.remove('cw-no'); void b.offsetWidth; b.classList.add('cw-no'); toast(TEXT.wrong); return; }
            tiles[at].querySelector('b').textContent = c;
            tiles[at].classList.add('got');
            at = nextIndex(cipher, tiles);
            if (at < 0) return finish();
            next();
          },
        }, c)));
      }
      next();

      function finish() {
        wheel.glow(null);
        choices.replaceChildren();
        tiles.forEach((t) => t.classList.remove('on'));
        // Save progress: this ring has now decoded one more message.
        const before = loadRing();
        const count = Math.min(MESSAGES.length, (before % MESSAGES.length) + 1);
        saveRing(count);
        const complete = count >= MESSAGES.length;
        const line = TEXT.shareLine(count, MESSAGES.length, slips);   // never includes the message
        openSheet([
          h('div', { class: 'celebrate' },
            h('p', { class: 'kicker' }, TEXT.doneKicker),
            h('h3', { class: 'cw-msg' }, plain),
            progressDots(count),
            h('p', { class: 'more' }, complete ? TEXT.allDone : TEXT.doneSub)),
          h('div', { class: 'cw-share' }, h('span', {}, line), h('button', { class: 'btn ghost', onclick: () => share(line) }, TEXT.share)),
          h('div', { class: 'btns' },
            h('button', { class: 'btn jewel', onclick: () => { closeSheet(); intro(); } }, complete ? TEXT.restart : TEXT.next),
            h('button', { class: 'link', onclick: home }, TEXT.back)),
        ], null, tool.jewel);
      }
    }
  }

  // Spoiler-free share: the phone's share sheet, else copy, else just a toast.
  async function share(text) {
    try { if (navigator.share) { await navigator.share({ text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text); } catch (e) { /* no clipboard */ }
    toast(TEXT.copied);
  }

  /* ---------- the wheel (SVG) ---------- */
  function wheelArt(start, live) {
    const cx = 150, cy = 150;
    const ring = (r, cls) => ABC.split('').map((ch, i) => {
      const a = i * STEP * Math.PI / 180;
      const x = cx + r * Math.sin(a), y = cy - r * Math.cos(a);
      return h('text', { class: cls, x, y, 'data-ch': ch, 'text-anchor': 'middle', 'dominant-baseline': 'central', transform: `rotate(${i * STEP} ${x} ${y})` }, ch);
    });
    const outer = ring(128, 'cw-out');
    const inner = h('g', { class: 'cw-inner' },
      h('circle', { cx, cy, r: '110', class: 'cw-innerbg' }),
      ring(94, 'cw-in'),
      h('circle', { cx, cy, r: '70', class: 'cw-hub' }),
      h('text', { x: cx, y: cy, class: 'cw-hubtxt', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, '✦'));
    const svg = h('svg', { viewBox: '0 0 300 300', class: 'cw-svg', role: 'img', 'aria-label': 'Cipher wheel' },
      h('circle', { cx, cy, r: '146', class: 'cw-outerbg' }),
      outer,
      inner,
      h('polygon', { points: '150,4 143,-8 157,-8', class: 'cw-pointer', transform: 'translate(0 10)' }));

    let rot = start * STEP;
    const set = (deg, snap) => {
      rot = deg;
      inner.style.transition = snap ? 'transform 0.25s ease' : 'none';
      inner.setAttribute('transform', `rotate(${rot} ${cx} ${cy})`);
    };
    const keyNow = () => ((Math.round(rot / STEP) % 26) + 26) % 26;
    const api = { svg, onTurn: null, stop: () => {} };
    api.nudge = (n) => { set((Math.round(rot / STEP) + n) * STEP, true); api.onTurn?.(keyNow()); };
    api.glow = (ch) => outer.forEach((t) => t.classList.toggle('glow', t.getAttribute('data-ch') === ch));
    set(rot);
    if (!live) return api;

    // Drag to turn: follow the pointer's angle around the centre, snap on release.
    let last = null;
    const angle = (e) => {
      const b = svg.getBoundingClientRect();
      return Math.atan2(e.clientX - (b.left + b.width / 2), -(e.clientY - (b.top + b.height / 2))) * 180 / Math.PI;
    };
    svg.addEventListener('pointerdown', (e) => { last = angle(e); svg.setPointerCapture(e.pointerId); });
    svg.addEventListener('pointermove', (e) => {
      if (last == null) return;
      const a = angle(e);
      let d = a - last;
      if (d > 180) d -= 360; if (d < -180) d += 360;
      last = a;
      set(rot + d);
      api.onTurn?.(keyNow());
    });
    const end = () => { if (last == null) return; last = null; set(Math.round(rot / STEP) * STEP, true); api.onTurn?.(keyNow()); };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
    return api;
  }

  intro();
}

// Caesar shift: each letter moves forward by the key.
function encode(text, key) {
  return text.replace(/[A-Z]/g, (c) => ABC[(ABC.indexOf(c) + key) % 26]);
}
// The first tile not yet solved.
function nextIndex(cipher, tiles) {
  for (let i = 0; i < cipher.length; i++) if (cipher[i] !== ' ' && !tiles[i].classList.contains('got')) return i;
  return -1;
}

const CSS = `
.cw-ask { margin-top: 18px; padding: 22px 20px; }
.cw-ask .big { font-size: 24px; }
.cw-mini { width: 170px; margin: 22px auto 0; opacity: 0.85; }
.cw-svg { width: 100%; display: block; overflow: visible; touch-action: none; user-select: none; }
.cw-outerbg { fill: var(--velvet); stroke: var(--line); stroke-width: 1.5; }
.cw-innerbg { fill: color-mix(in srgb, var(--jewel) 18%, var(--midnight)); stroke: var(--jewel); stroke-width: 1.5; }
.cw-hub { fill: var(--midnight); stroke: var(--line); }
.cw-hubtxt { fill: var(--jewel); font-size: 22px; }
.cw-out { fill: var(--mist); font: 600 17px var(--f-head); }
.cw-out.glow { fill: var(--midnight); paint-order: stroke; stroke: var(--jewel); stroke-width: 9px; stroke-linejoin: round; }
.cw-in { fill: var(--starlight); font: 700 15px var(--f-body); }
.cw-pointer { fill: var(--jewel); }
.cw-wheel { width: min(300px, 100%); margin: 14px auto 0; cursor: grab; }
.cw-keyrow { display: flex; align-items: center; gap: 14px; }
.cw-keyrow b { display: block; font: 600 22px/1.1 var(--f-head); color: var(--starlight); }
.cw-keyrow span { font-size: 14px; color: var(--lilac); }
.cw-plate { flex: 0 0 auto; min-width: 64px; height: 44px; padding: 0 10px; border-radius: 6px; display: grid; place-items: center; background: var(--pearl); color: var(--midnight);
  font: 700 22px var(--f-head); letter-spacing: 0.06em; box-shadow: inset 0 0 0 3px color-mix(in srgb, var(--jewel) 60%, var(--midnight)); }
.cw-chair { min-width: 44px; border-radius: 50%; }
.cw-turn { display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 8px; }
.cw-pm { width: 48px; height: 48px; border-radius: 50%; border: 1.5px solid var(--line); background: var(--velvet); color: var(--starlight); font-size: 24px; line-height: 1; }
.cw-keynow { min-width: 44px; text-align: center; font: 600 34px var(--f-head); color: var(--jewel); }
.cw-ok { color: var(--jewel); font-weight: 700; }
.cw-decode { margin-top: 10px; padding-bottom: 8px; }
.cw-tiles { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; }
.cw-tile { width: 30px; display: flex; flex-direction: column; align-items: center; border-radius: 6px; padding: 4px 0; background: var(--velvet); border: 1.5px solid var(--line); }
.cw-tile i { font: 700 11px var(--f-body); font-style: normal; color: var(--lilac); }
.cw-tile b { font: 600 20px/1.1 var(--f-head); color: var(--starlight); min-height: 22px; }
.cw-tile.on { border-color: var(--jewel); box-shadow: 0 0 14px color-mix(in srgb, var(--jewel) 45%, transparent); }
.cw-tile.got b { color: var(--jewel); animation: pop 0.3s both; }
.cw-gap { width: 10px; }
.cw-choices { display: flex; justify-content: center; gap: 12px; margin-top: 4px; }
.cw-choice { width: 64px; height: 64px; border-radius: 50%; border: 1.5px solid var(--jewel); background: none; font: 600 28px var(--f-head); color: var(--starlight); }
.cw-choice:active { background: var(--jewel); color: var(--midnight); }
.cw-no { animation: cw-no 0.4s; }
@keyframes cw-no { 25%, 75% { translate: -6px 0; } 50% { translate: 6px 0; } }
.sheet .cw-msg { color: var(--jewel); letter-spacing: 0.04em; }
.cw-ring { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 10px 0 0; font: 700 12px var(--f-body); letter-spacing: 0.1em; text-transform: uppercase; color: var(--lilac); }
.cw-dots { display: flex; gap: 6px; }
.cw-dot { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid var(--jewel); }
.cw-dot.on { background: var(--jewel); box-shadow: 0 0 10px color-mix(in srgb, var(--jewel) 60%, transparent); }
.cw-dot.now { border-style: dashed; }
.cw-brass { background: linear-gradient(135deg, color-mix(in srgb, #F5B82E 70%, var(--pearl)), #DEC523 45%, color-mix(in srgb, #ED8D00 70%, #F5B82E)); box-shadow: none; }
.cw-bus { flex-direction: column; gap: 0; min-width: 64px; height: 56px; border-radius: 10px; background: #58B0F6; color: var(--midnight); line-height: 1; display: flex; justify-content: center; }
.cw-bus small { font: 700 10px var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; }
.cw-steps { position: relative; width: 64px; height: 56px; padding: 0; background: none; box-shadow: none; }
.cw-steps i { position: absolute; left: 0; height: 12px; background: var(--mist); border-radius: 2px; }
.cw-steps i:nth-child(1) { bottom: 0; width: 64px; } .cw-steps i:nth-child(2) { bottom: 14px; width: 46px; } .cw-steps i:nth-child(3) { bottom: 28px; width: 28px; }
.cw-steps b { position: absolute; right: 0; top: 0; font: 700 22px var(--f-head); color: var(--jewel); }
.cw-share { display: flex; align-items: center; gap: 10px; margin: 16px 0 4px; padding: 8px 8px 8px 14px; border-radius: 999px; border: 1px solid var(--line); }
.cw-share span { flex: 1; font: 700 13px var(--f-body); color: var(--starlight); min-width: 0; }
.cw-share .btn { width: auto; min-height: 44px; padding: 8px 18px; }
`
