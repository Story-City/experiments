// Riddle Lock: a padlock that opens with a word only found at a real spot.
const TEXT = {
  kicker: 'A locked box',
  title: 'The answer is written there',
  riddle: 'Walk to the oldest bench in the park. Its little brass plaque tells you what it’s made from. That word opens the lock.',
  away: 'You’re 120 m away',
  awayHint: 'Keep walking: the lock wakes up when you’re standing at the bench.',
  there: 'Pretend I’m There',
  atHome: 'Play at Home',
  arrived: 'You found the bench',
  lookTitle: 'Find the little brass plaque',
  look: 'Tap the plaque when you spot it.',
  cantFind: 'Can’t Find It?',
  nudge: 'Wren: “It’s on the back of the bench, near the ground.”',
  stillCant: 'Still Can’t Find It?',
  plaqueHint: 'Read the plaque. Spin the dials to spell the word.',
  homeKicker: 'At home',
  homeTitle: 'Answer the riddle',
  homeRiddle: 'I have keys but I can’t open a single door. I have a lid but I’m not a pot. What am I?',
  homeHint: 'Spin the dials to spell the answer.',
  showHint: 'Show a Hint',
  hint: 'Tap me and I make music.',
  tryIt: 'Try the Lock',
  wrong: 'Not quite. Try again.',
  openKicker: 'Click',
  openTitle: 'It’s open',
  openSub: 'Inside, folded small: a torn scrap of a Society letter.',
  scrap: '…by the time you read this, the clock tower will already be ticking backwards. Find me under the',
  scrapSign: '— W.',
  shareLine: (n) => `Riddle Lock ✦ opened · ${n} hint${n === 1 ? '' : 's'}`,
  share: 'Share',
  copied: 'Copied. Paste it anywhere.',
  again: 'Lock It Again',
  back: 'Back to Tools',
  up: 'Next letter',
  down: 'Previous letter',
};

const WALK = { answer: 'MAPLE' };
const HOME = { answer: 'PIANO' };
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function run(k) {
  const { h, show, bar, openSheet, closeSheet, css, tool, home, onLeave } = k;
  css('riddle-lock', CSS);
  let timer = null;
  let hints = 0;
  onLeave(() => clearTimeout(timer));

  function intro() {
    show(
      bar(),
      h('div', { class: 'rl-lockwrap' }, padlock()),
      h('p', { class: 'kicker centre' }, TEXT.kicker),
      h('h1', { class: 'display centre' }, TEXT.title),
      h('div', { class: 'frame rl-riddle' }, h('p', {}, TEXT.riddle)),
      h('div', { class: 'rl-away' }, h('span', { class: 'rl-ping', 'aria-hidden': 'true' }), TEXT.away),
      h('p', { class: 'hint centre' }, TEXT.awayHint),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: atSpot }, TEXT.there),
        h('button', { class: 'link', onclick: atHome }, TEXT.atHome)),
    );
  }

  // At the bench: the plaque (drawn in CSS), then the dials.
  function atSpot() {
    hints = 0;
    const plaque = h('div', { class: 'rl-plaque', role: 'img', 'aria-label': 'Brass plaque: This bench was carved from the old MAPLE that shaded this path, 1923' },
      h('span', { class: 'rl-screw a' }), h('span', { class: 'rl-screw b' }), h('span', { class: 'rl-screw c' }), h('span', { class: 'rl-screw d' }),
      h('small', {}, 'Rest a while'),
      h('p', {}, 'This bench was carved from the old ', h('b', {}, 'MAPLE'), ' that shaded this path'),
      h('small', {}, '1923'));
    // The plaque starts tucked away; tap the glint, or ask for help twice.
    const help = h('p', { class: 'hint centre rl-help' }, TEXT.look);
    const glint = h('button', { class: 'rl-glint', 'aria-label': 'Brass plaque', onclick: () => reveal() });
    const scene = h('div', { class: 'rl-scene' }, benchArt(), glint);
    const holder = h('div', { class: 'rl-bench' }, scene);
    const ask = h('button', { class: 'link rl-cant', onclick: cant }, TEXT.cantFind);
    let asks = 0;
    function cant() {
      asks += 1; hints += 1;
      if (asks === 1) { help.textContent = TEXT.nudge; glint.classList.add('rl-hot'); ask.textContent = TEXT.stillCant; return; }
      reveal();
    }
    function reveal() {
      holder.replaceChildren(plaque);
      plaque.classList.add('rl-zoomin');
      help.textContent = TEXT.plaqueHint;
      ask.remove();
    }
    lockScreen({
      head: [h('p', { class: 'kicker' }, TEXT.arrived), h('h1', { class: 'display rl-h' }, TEXT.lookTitle), holder, help, h('div', { class: 'centre' }, ask)],
      hint: '',
      answer: WALK.answer,
    });
  }

  // A park bench from behind, drawn in SVG; the plaque glints near the ground.
  function benchArt() {
    const wood = 'color-mix(in srgb, #ED8D00 55%, var(--ink))';
    const dark = 'color-mix(in srgb, #ED8D00 25%, var(--ink))';
    return h('svg', { class: 'rl-benchart', viewBox: '0 0 300 150', 'aria-hidden': 'true' },
      h('rect', { x: '0', y: '128', width: '300', height: '22', fill: 'color-mix(in srgb, #5BD380 22%, var(--ink))' }),
      h('rect', { x: '30', y: '22', width: '240', height: '16', rx: '4', fill: wood }),
      h('rect', { x: '30', y: '44', width: '240', height: '16', rx: '4', fill: wood }),
      h('rect', { x: '22', y: '70', width: '256', height: '12', rx: '4', fill: dark }),
      h('rect', { x: '44', y: '22', width: '12', height: '110', rx: '3', fill: dark }),
      h('rect', { x: '244', y: '22', width: '12', height: '110', rx: '3', fill: dark }),
      h('rect', { x: '60', y: '96', width: '180', height: '8', rx: '3', fill: dark }));
  }

  function atHome() {
    hints = 0;
    const hintEl = h('p', { class: 'hint centre', hidden: true }, TEXT.hint);
    lockScreen({
      head: [
        h('p', { class: 'kicker' }, TEXT.homeKicker),
        h('h1', { class: 'display' }, TEXT.homeTitle),
        h('div', { class: 'frame rl-riddle' }, h('p', {}, TEXT.homeRiddle)),
        h('button', { class: 'link', onclick: (e) => { hints += 1; hintEl.hidden = false; e.currentTarget.remove(); } }, TEXT.showHint),
        hintEl,
      ],
      hint: TEXT.homeHint,
      answer: HOME.answer,
    });
  }

  function lockScreen({ head, hint, answer }) {
    const lock = padlock();
    const dials = answer.split('').map((ch) => dial(ABC.indexOf(ch)));
    show(
      bar(),
      head,
      h('div', { class: 'rl-small' }, lock),
      h('div', { class: 'rl-dials' }, dials.map((d) => d.el)),
      hint ? h('p', { class: 'hint centre' }, hint) : null,
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: check }, TEXT.tryIt)),
    );

    function check() {
      const word = dials.map((d) => ABC[d.value()]).join('');
      if (word !== answer) {
        lock.classList.remove('rl-shake'); void lock.getBoundingClientRect(); lock.classList.add('rl-shake');
        k.toast(TEXT.wrong);
        return;
      }
      lock.classList.add('rl-open');
      const line = TEXT.shareLine(hints);   // never includes the answer
      timer = setTimeout(() => openSheet([
        h('div', { class: 'celebrate' },
          h('p', { class: 'kicker' }, TEXT.openKicker),
          h('div', { class: 'rl-sheetlock' }, padlock(true)),
          h('h3', {}, TEXT.openTitle),
          h('p', { class: 'more' }, TEXT.openSub)),
        h('div', { class: 'rl-scrap', role: 'note' }, h('p', {}, TEXT.scrap), h('span', {}, TEXT.scrapSign)),
        h('div', { class: 'rl-share' }, h('span', {}, line), h('button', { class: 'btn ghost', onclick: () => share(line) }, TEXT.share)),
        h('div', { class: 'btns' },
          h('button', { class: 'btn jewel', onclick: () => { closeSheet(); intro(); } }, TEXT.again),
          h('button', { class: 'link', onclick: home }, TEXT.back)),
      ], null, tool.jewel), 900);
    }
  }

  // Spoiler-free share: the phone's share sheet, else copy, else just a toast.
  async function share(text) {
    try { if (navigator.share) { await navigator.share({ text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text); } catch (e) { /* no clipboard */ }
    k.toast(TEXT.copied);
  }

  // One letter dial: tap the arrows, swipe up/down, or use arrow keys.
  function dial(avoid) {
    let v = (avoid + 3 + Math.floor(Math.random() * 20)) % 26;
    const prev = h('span', { class: 'rl-ghost' });
    const cur = h('span', { class: 'rl-cur' });
    const next = h('span', { class: 'rl-ghost' });
    const draw = () => {
      prev.textContent = ABC[(v + 25) % 26];
      cur.textContent = ABC[v];
      next.textContent = ABC[(v + 1) % 26];
    };
    const step = (n) => { v = (v + n + 26) % 26; draw(); win.classList.remove('rl-tick'); void win.offsetWidth; win.classList.add('rl-tick'); };
    const win = h('div', { class: 'rl-win', tabindex: '0', role: 'spinbutton', 'aria-label': 'Letter dial',
      onkeydown: (e) => { if (e.key === 'ArrowUp') { step(-1); e.preventDefault(); } if (e.key === 'ArrowDown') { step(1); e.preventDefault(); } },
    }, prev, cur, next);
    // Swipe: every 28 px of drag turns one letter.
    let y0 = null;
    win.addEventListener('pointerdown', (e) => { y0 = e.clientY; win.setPointerCapture(e.pointerId); });
    win.addEventListener('pointermove', (e) => {
      if (y0 == null) return;
      const d = e.clientY - y0;
      if (Math.abs(d) >= 28) { step(d > 0 ? -1 : 1); y0 = e.clientY; }
    });
    const end = () => { y0 = null; };
    win.addEventListener('pointerup', end);
    win.addEventListener('pointercancel', end);
    draw();
    const el = h('div', { class: 'rl-dial' },
      h('button', { class: 'rl-arrow', 'aria-label': TEXT.down, onclick: () => step(-1) }, '▲'),
      win,
      h('button', { class: 'rl-arrow', 'aria-label': TEXT.up, onclick: () => step(1) }, '▼'));
    return { el, value: () => v };
  }

  // SVG padlock: the shackle group lifts when .rl-open is added.
  function padlock(open) {
    return h('svg', { class: `rl-lock${open ? ' rl-open' : ''}`, viewBox: '0 0 120 140', 'aria-hidden': 'true' },
      h('g', { class: 'rl-shackle' },
        h('path', { d: 'M32 66 V42 a28 28 0 0 1 56 0 V66', fill: 'none', stroke: 'var(--mist)', 'stroke-width': '12', 'stroke-linecap': 'round' })),
      h('rect', { x: '14', y: '62', width: '92', height: '72', rx: '14', fill: 'var(--jewel)' }),
      h('rect', { x: '20', y: '68', width: '80', height: '60', rx: '10', fill: 'none', stroke: 'var(--midnight)', 'stroke-opacity': '0.25', 'stroke-width': '2' }),
      h('circle', { cx: '60', cy: '92', r: '9', fill: 'var(--midnight)' }),
      h('rect', { x: '56', y: '96', width: '8', height: '18', rx: '3', fill: 'var(--midnight)' }));
  }

  intro();
}

const CSS = `
.rl-lockwrap { width: 110px; margin: 0 auto 14px; }
.rl-lock { width: 100%; display: block; overflow: visible; filter: drop-shadow(0 10px 24px color-mix(in srgb, var(--jewel) 40%, transparent)); }
.rl-shackle { transition: transform 0.5s cubic-bezier(0.2, 1.6, 0.4, 1); transform-origin: 88px 66px; }
.rl-lock.rl-open .rl-shackle { transform: translateY(-16px) rotate(-24deg); }
.rl-shake { animation: rl-shake 0.45s; }
@keyframes rl-shake { 20%, 60% { translate: -8px 0; } 40%, 80% { translate: 8px 0; } }
.rl-riddle { margin-top: 18px; padding: 20px; }
.rl-riddle p { margin: 0; font: italic 500 20px/1.3 var(--f-head); color: var(--starlight); text-wrap: pretty; }
.rl-away { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 18px; font: 700 13px var(--f-body); letter-spacing: 0.08em; text-transform: uppercase; color: var(--starlight); }
.rl-ping { width: 10px; height: 10px; border-radius: 50%; background: var(--jewel); box-shadow: 0 0 0 0 var(--jewel); animation: rl-ping 1.6s infinite; }
@keyframes rl-ping { to { box-shadow: 0 0 0 14px transparent; } }
.rl-bench { padding: 22px 16px 26px; border-radius: 12px; background: linear-gradient(color-mix(in srgb, #ED8D00 40%, var(--ink)), color-mix(in srgb, #ED8D00 22%, var(--ink))); box-shadow: inset 0 -10px 0 color-mix(in srgb, #ED8D00 12%, var(--ink)); }
.rl-plaque { position: relative; margin: 0 auto; max-width: 290px; padding: 16px 22px; border-radius: 8px; text-align: center; color: var(--midnight);
  background: linear-gradient(135deg, color-mix(in srgb, #F5B82E 70%, var(--pearl)), #DEC523 45%, color-mix(in srgb, #ED8D00 70%, #F5B82E)); box-shadow: 0 8px 18px rgba(0, 0, 0, 0.45), inset 0 0 0 2px color-mix(in srgb, #ED8D00 60%, transparent); rotate: -1.5deg; }
.rl-plaque p { margin: 4px 0; font: 600 18px/1.2 var(--f-head); }
.rl-plaque b { letter-spacing: 0.12em; }
.rl-plaque small { font: 700 10px var(--f-body); letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.7; }
.rl-screw { position: absolute; width: 7px; height: 7px; border-radius: 50%; background: color-mix(in srgb, #ED8D00 60%, var(--ink)); }
.rl-screw.a { top: 6px; left: 6px; } .rl-screw.b { top: 6px; right: 6px; } .rl-screw.c { bottom: 6px; left: 6px; } .rl-screw.d { bottom: 6px; right: 6px; }
.rl-small { width: 64px; margin: 18px auto 6px; }
.rl-dials { display: flex; justify-content: center; gap: 8px; margin-top: 8px; }
.rl-dial { display: flex; flex-direction: column; align-items: center; width: 54px; }
.rl-arrow { width: 54px; height: 44px; border: 0; background: none; color: var(--jewel); font-size: 14px; }
.rl-win { width: 54px; height: 116px; border-radius: 10px; background: linear-gradient(var(--ink), var(--velvet) 30%, var(--velvet) 70%, var(--ink)); border: 1.5px solid var(--line);
  display: flex; flex-direction: column; align-items: center; justify-content: center; touch-action: none; user-select: none; cursor: ns-resize; }
.rl-cur { font: 600 34px/1.15 var(--f-head); color: var(--starlight); }
.rl-ghost { font: 600 18px/1.2 var(--f-head); color: var(--lilac); opacity: 0.45; }
.rl-tick .rl-cur { animation: pop 0.25s both; }
.rl-sheetlock { width: 80px; margin: 6px auto 10px; }
.rl-sheetlock .rl-shackle { transform: translateY(-16px) rotate(-24deg); }
.rl-h { font-size: 28px; margin-bottom: 12px; }
.rl-scene { position: relative; }
.rl-benchart { width: 100%; display: block; }
.rl-glint { position: absolute; left: 44%; top: 62%; width: 44px; height: 44px; border: 0; padding: 0; background: none; cursor: pointer; }
.rl-glint::after { content: ""; position: absolute; left: 12px; top: 18px; width: 20px; height: 9px; border-radius: 2px; background: #DEC523; opacity: 0.55; box-shadow: 0 0 6px #F5B82E; }
.rl-glint.rl-hot::after { opacity: 1; animation: rl-glint 1s ease-in-out infinite; }
@keyframes rl-glint { 50% { box-shadow: 0 0 18px 6px #F5B82E; } }
.rl-help { margin: 10px 0 0; }
.rl-cant { color: var(--jewel); }
.rl-zoomin { animation: rl-zoomin 0.5s cubic-bezier(0.2, 1.3, 0.4, 1) both; }
@keyframes rl-zoomin { from { scale: 0.25; opacity: 0; translate: -20px 30px; } }
.rl-scrap { position: relative; margin: 16px auto 0; max-width: 310px; padding: 18px 20px 14px; color: var(--midnight); background: var(--pearl); rotate: -2deg;
  clip-path: polygon(0 4%, 9% 0, 22% 3%, 37% 0, 52% 2%, 68% 0, 83% 3%, 100% 1%, 98% 30%, 100% 62%, 97% 100%, 82% 96%, 64% 100%, 47% 95%, 30% 99%, 14% 95%, 0 98%, 2% 60%);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4); animation: land 0.6s 0.2s cubic-bezier(0.2, 1.3, 0.4, 1) both; }
.rl-scrap p { margin: 0; font: italic 500 17px/1.35 var(--f-head); text-wrap: pretty; }
.rl-scrap span { display: block; text-align: right; margin-top: 6px; font: italic 600 15px var(--f-head); }
.rl-share { display: flex; align-items: center; gap: 10px; margin: 18px 0 4px; padding: 8px 8px 8px 14px; border-radius: 999px; border: 1px solid var(--line); }
.rl-share span { flex: 1; font: 700 13px var(--f-body); color: var(--starlight); min-width: 0; }
.rl-share .btn { width: auto; min-height: 44px; padding: 8px 18px; }
`
