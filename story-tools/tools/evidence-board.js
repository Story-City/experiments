// Evidence Board: chapter clues pinned to a corkboard. String the right two together and the story twists.
const TEXT = {
  kicker: 'The Summons · Chapter 3',
  title: 'Which two belong together?',
  hint: 'Drag a string from one pin to another, or tap two pins.',
  nudge: 'Nudge',
  nudges: [
    'Two of these tell the same time.',
    'Look at the ticket. Then look very closely at the corners of the photos.',
  ],
  wrong: ['Hmm, not those two.', 'Nope, the string slipped.', 'Close, but no.', 'Wren shakes her head. Try another pair.'],
  picked: (n) => `${n} picked. Now tap its partner.`,
  twistKicker: 'Twist unlocked',
  twistTitle: 'The photo was taken at 4:15',
  scene: [
    'The train left Riverside at 4:15. The ticket was never torn, so nobody got on.',
    'And at 4:15, someone was standing at Market Corner, taking a photo of an orange truck.',
    'Wren: “Whoever bought that ticket stayed behind on purpose. I think they wanted us to find key No. 7.”',
  ],
  again: 'Back to the Board',
  home: 'Back to Tools',
  // the pinned items
  gem1: 'Gem 1 · The big tree',
  gem4: 'Gem 4 · Market Corner',
  stamp: "4:15",
  letter: '…the Society meets when the bells ring twice. Bring nothing. Tell no one.',
  letterSign: '— W.',
  ticketLine: 'Riverside Line',
  ticketAdmit: 'Admit One',
  ticketTime: 'Departs 4:15',
  keyTag: 'No. 7',
  mapLabel: 'Library',
};

// Where each item sits on the board (shares of the board) and how it tilts.
const ITEMS = [
  { id: 'gem1', name: 'The tree photo', x: 0.04, y: 0.03, r: -4 },
  { id: 'letter', name: 'The torn letter', x: 0.53, y: 0.03, r: 3 },
  { id: 'ticket', name: 'The ticket stub', x: 0.05, y: 0.38, r: 5 },
  { id: 'gem4', name: 'The Market Corner photo', x: 0.54, y: 0.34, r: -3 },
  { id: 'key', name: 'The brass key', x: 0.08, y: 0.71, r: -8 },
  { id: 'map', name: 'The map scrap', x: 0.55, y: 0.69, r: 4 },
];
const ANSWER = ['ticket', 'gem4'];

export default function run(k) {
  const { h, show, bar, toast, openSheet, closeSheet, css, tool, home, onLeave, samplePhoto } = k;
  css('evidence-board', CSS);
  const timers = [];
  onLeave(() => timers.forEach(clearTimeout));
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  function board() {
    let picked = null;      // tap mode: the first pin
    let drag = null;        // drag mode: { from, line, moved }
    let wrongs = 0;
    let nudges = 0;
    let solved = false;

    const strings = h('svg', { class: 'eb-strings', 'aria-hidden': 'true' });
    const els = Object.fromEntries(ITEMS.map((it) => [it.id, item(it)]));
    const cork = h('div', { class: 'eb-board', id: 'ebBoard' }, Object.values(els), strings);
    const hintEl = h('p', { class: 'hint centre eb-hint', role: 'status' }, TEXT.hint);
    const nudgeBtn = h('button', { class: 'link eb-nudge', id: 'ebNudge', onclick: nudge }, `✦ ${TEXT.nudge}`);

    // Pin centre, in board pixels.
    const pinAt = (id) => {
      const b = cork.getBoundingClientRect();
      const p = els[id].querySelector('.eb-pin').getBoundingClientRect();
      return [p.left + p.width / 2 - b.left, p.top + p.height / 2 - b.top];
    };
    const fit = () => { const b = cork.getBoundingClientRect(); strings.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`); };
    // A string that sags a little in the middle.
    const sag = ([x1, y1], [x2, y2], drop = 26) => `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + drop} ${x2} ${y2}`;
    const itemAt = (x, y) => document.elementFromPoint(x, y)?.closest('.eb-item');

    cork.addEventListener('pointerdown', (e) => {
      const el = e.target.closest('.eb-item');
      if (!el || solved) return;
      e.preventDefault();
      fit();
      const line = h('path', { class: 'eb-string live', d: '' });
      drag = { from: el.dataset.id, line, moved: false, x: e.clientX, y: e.clientY };
      cork.setPointerCapture(e.pointerId);
    });
    cork.addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 10) return;
      if (!drag.moved) { drag.moved = true; strings.append(drag.line); clearPick(); }
      const b = cork.getBoundingClientRect();
      drag.line.setAttribute('d', sag(pinAt(drag.from), [e.clientX - b.left, e.clientY - b.top], 10));
      ITEMS.forEach((it) => els[it.id].classList.toggle('eb-over', itemAt(e.clientX, e.clientY) === els[it.id] && it.id !== drag.from));
    });
    const end = (e) => {
      if (!drag) return;
      const { from, line, moved } = drag;
      drag = null;
      line.remove();
      ITEMS.forEach((it) => els[it.id].classList.remove('eb-over'));
      if (moved) {
        const to = e.type === 'pointerup' ? itemAt(e.clientX, e.clientY)?.dataset.id : null;
        if (to && to !== from) connect(from, to);
        return;
      }
      tap(from);
    };
    // A tap (or Enter): pick the first pin, then its partner.
    function tap(from) {
      if (solved) return;
      if (!picked) { picked = from; els[from].classList.add('eb-sel'); hintEl.textContent = TEXT.picked(ITEMS.find((i) => i.id === from).name); return; }
      if (picked === from) { clearPick(); return; }
      const a = picked; clearPick(); connect(a, from);
    }
    cork.addEventListener('keydown', (e) => {
      const el = e.target.closest('.eb-item');
      if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tap(el.dataset.id); }
    });
    cork.addEventListener('pointerup', end);
    cork.addEventListener('pointercancel', end);
    function clearPick() { if (picked) els[picked].classList.remove('eb-sel'); picked = null; hintEl.textContent = TEXT.hint; }

    function connect(a, b) {
      fit();
      const right = ANSWER.includes(a) && ANSWER.includes(b);
      const s = h('path', { class: `eb-string${right ? ' tight' : ''}`, d: sag(pinAt(a), pinAt(b), right ? 6 : 26) });
      strings.append(s);
      if (!right) {
        wrongs++;
        toast(TEXT.wrong[(wrongs - 1) % TEXT.wrong.length]);
        [a, b].forEach((id) => { els[id].classList.remove('eb-wobble'); void els[id].offsetWidth; els[id].classList.add('eb-wobble'); });
        later(() => s.classList.add('eb-fall'), 350);
        later(() => s.remove(), 1200);
        if (wrongs >= 2 && nudges === 0) nudgeBtn.classList.add('eb-pulse');
        return;
      }
      solved = true;
      [a, b].forEach((id) => els[id].classList.add('eb-glow'));
      later(twist, 1000);
    }

    function nudge() {
      nudgeBtn.classList.remove('eb-pulse');
      hintEl.textContent = TEXT.nudges[Math.min(nudges, TEXT.nudges.length - 1)];
      if (nudges >= 1) els.ticket.classList.add('eb-hinted');
      nudges++;
    }

    show(
      bar(),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display eb-title' }, TEXT.title),
      cork,
      hintEl,
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns eb-btns' }, nudgeBtn),
    );
    fit();
    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    onLeave(() => window.removeEventListener('resize', onResize));
  }

  /* ---------- the pinned things ---------- */
  function item(it) {
    const pin = h('span', { class: 'eb-pin', 'aria-hidden': 'true' });
    return h('div', { class: `eb-item eb-${it.id}`, 'data-id': it.id, role: 'button', tabindex: '0', 'aria-label': it.name,
      style: `left:${it.x * 100}%;top:${it.y * 100}%;rotate:${it.r}deg` }, pin, look(it.id));
  }

  function look(id) {
    if (id === 'gem1' || id === 'gem4') {
      return h('figure', { class: 'eb-polaroid' },
        h('div', { class: 'eb-pic' },
          h('img', { src: samplePhoto(id === 'gem1' ? 0 : 2), alt: '', draggable: 'false' }),
          id === 'gem4' ? h('span', { class: 'eb-stamp' }, TEXT.stamp) : null),
        h('figcaption', {}, id === 'gem1' ? TEXT.gem1 : TEXT.gem4));
    }
    if (id === 'letter') return h('div', { class: 'eb-paper' }, h('p', {}, TEXT.letter), h('p', { class: 'eb-sign' }, TEXT.letterSign));
    if (id === 'ticket') {
      return h('div', { class: 'eb-ticketcard' },
        h('small', {}, TEXT.ticketLine), h('b', {}, TEXT.ticketAdmit), h('span', {}, TEXT.ticketTime));
    }
    if (id === 'key') {
      return h('div', { class: 'eb-keycard' },
        h('svg', { viewBox: '0 0 100 44' },
          h('circle', { cx: '18', cy: '22', r: '14', fill: 'none', stroke: '#DEC523', 'stroke-width': '7' }),
          h('rect', { x: '30', y: '18', width: '60', height: '8', rx: '3', fill: '#DEC523' }),
          h('rect', { x: '72', y: '26', width: '6', height: '10', fill: '#DEC523' }),
          h('rect', { x: '82', y: '26', width: '6', height: '14', fill: '#DEC523' })),
        h('span', { class: 'eb-tag' }, TEXT.keyTag));
    }
    // map scrap
    return h('div', { class: 'eb-mapcard' },
      h('svg', { viewBox: '0 0 120 90' },
        h('rect', { width: '120', height: '90', fill: '#1a0b3d' }),
        h('rect', { x: '8', y: '8', width: '34', height: '26', fill: '#2a1658' }), h('rect', { x: '52', y: '8', width: '28', height: '26', fill: '#2a1658' }),
        h('rect', { x: '8', y: '46', width: '34', height: '36', fill: '#2a1658' }), h('rect', { x: '90', y: '46', width: '24', height: '36', fill: '#2a1658' }),
        h('path', { d: 'M0 40 H120 M46 0 V90 M86 0 V90', stroke: '#46337e', 'stroke-width': '6' }),
        h('path', { d: 'M60 52 l12 12 M72 52 l-12 12', stroke: '#FF4F79', 'stroke-width': '4', 'stroke-linecap': 'round' })),
      h('span', {}, TEXT.mapLabel));
  }

  /* ---------- the payoff ---------- */
  function twist() {
    openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.twistKicker),
        h('div', { class: 'eb-pair', 'aria-hidden': 'true' }, h('span', {}, TEXT.ticketTime), h('i'), h('span', {}, `${TEXT.stamp} photo`)),
        h('h3', {}, TEXT.twistTitle)),
      h('div', { class: 'eb-scene' }, TEXT.scene.map((line) => h('p', {}, line))),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => { closeSheet(); board(); } }, TEXT.again),
        h('button', { class: 'link', onclick: home }, TEXT.home)),
    ], null, tool.jewel);
  }

  board();
}

const CSS = `
.display.eb-title { font-size: 28px; }
.eb-board { position: relative; margin-top: 14px; height: 470px; border-radius: 10px; overflow: hidden; touch-action: none; user-select: none;
  border: 8px solid color-mix(in srgb, #ED8D00 35%, var(--ink));
  background:
    radial-gradient(circle at 30% 40%, color-mix(in srgb, #F5B82E 35%, transparent) 0 1px, transparent 1.6px) 0 0 / 9px 11px,
    radial-gradient(circle at 70% 60%, color-mix(in srgb, var(--ink) 30%, transparent) 0 1px, transparent 1.8px) 0 0 / 13px 7px,
    radial-gradient(120% 90% at 50% 40%, color-mix(in srgb, #ED8D00 62%, var(--midnight)), color-mix(in srgb, #ED8D00 40%, var(--ink)));
  box-shadow: inset 0 0 30px rgba(11, 6, 32, 0.5); }
.eb-strings { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.eb-string { fill: none; stroke: var(--jewel); stroke-width: 3; stroke-linecap: round; filter: drop-shadow(0 2px 1px rgba(11, 6, 32, 0.5)); transition: d 0.25s; }
.eb-string.live { stroke-dasharray: 6 5; }
.eb-string.tight { stroke-width: 4; animation: eb-twang 0.5s; }
.eb-string.eb-fall { animation: eb-fall 0.8s ease-in forwards; }
@keyframes eb-fall { to { transform: translateY(160px); opacity: 0; } }
@keyframes eb-twang { 30% { stroke-width: 7; } }
.eb-item { position: absolute; cursor: grab; transition: transform 0.2s, filter 0.2s; filter: drop-shadow(0 6px 8px rgba(11, 6, 32, 0.45)); }
.eb-item:focus-visible { outline: 2px solid var(--sapphire); outline-offset: 4px; }
.eb-pin { position: absolute; left: 50%; top: -5px; translate: -50% 0; width: 16px; height: 16px; border-radius: 50%; z-index: 2;
  background: radial-gradient(circle at 35% 35%, var(--starlight), var(--jewel) 45%, color-mix(in srgb, var(--jewel) 50%, var(--ink))); box-shadow: 0 2px 2px rgba(11, 6, 32, 0.6); }
.eb-sel, .eb-over { transform: scale(1.06); filter: drop-shadow(0 0 10px var(--jewel)); }
.eb-glow { filter: drop-shadow(0 0 14px var(--jewel)); transform: scale(1.05); }
.eb-hinted .eb-pin { animation: eb-beat 1s infinite; }
@keyframes eb-beat { 50% { box-shadow: 0 0 0 8px color-mix(in srgb, var(--jewel) 35%, transparent); } }
.eb-wobble { animation: eb-wobble 0.45s; }
@keyframes eb-wobble { 25% { translate: -5px 0; } 75% { translate: 5px 0; } }
.eb-polaroid { margin: 0; width: 128px; padding: 7px 7px 6px; background: var(--starlight); border-radius: 2px; }
.eb-pic { position: relative; height: 104px; overflow: hidden; }
.eb-pic img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
.eb-stamp { position: absolute; right: 5px; bottom: 4px; font: 700 15px/1 ui-monospace, Menlo, monospace; letter-spacing: 0.04em; color: #FA7423; text-shadow: 0 0 4px #FA7423, 0 1px 1px var(--ink); }
.eb-polaroid figcaption { margin-top: 5px; font: italic 600 13px/1.15 var(--f-head); color: var(--midnight); text-align: center; }
.eb-paper { width: 142px; padding: 16px 12px 12px; background: var(--pearl); color: var(--midnight);
  clip-path: polygon(0 0, 100% 0, 100% 86%, 92% 92%, 84% 87%, 74% 95%, 62% 89%, 50% 97%, 38% 90%, 26% 96%, 14% 89%, 0 94%); }
.eb-paper p { margin: 0; font: italic 500 14px/1.25 var(--f-head); }
.eb-paper .eb-sign { margin: 6px 0 8px; text-align: right; }
.eb-ticketcard { width: 132px; padding: 12px 14px; display: grid; gap: 2px; text-align: center; color: var(--midnight); background: #F5B82E; border-radius: 4px;
  mask: radial-gradient(circle 7px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 7px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat; }
.eb-ticketcard small { font: 700 10px var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; }
.eb-ticketcard b { font: 600 20px/1.05 var(--f-head); border-block: 1px dashed var(--midnight); padding: 3px 0; }
.eb-ticketcard span { font: 800 14px var(--f-body); }
.eb-keycard { width: 112px; padding: 14px 8px 8px; background: color-mix(in srgb, var(--velvet) 85%, var(--ink)); border-radius: 6px; text-align: center; }
.eb-keycard svg { width: 92px; display: block; margin: 0 auto; }
.eb-tag { display: inline-block; margin-top: 4px; padding: 2px 8px; border-radius: 3px; background: var(--pearl); color: var(--midnight); font: 700 12px var(--f-body); }
.eb-mapcard { width: 124px; padding: 6px; background: var(--pearl); clip-path: polygon(0 4%, 18% 0, 46% 5%, 70% 0, 100% 3%, 97% 46%, 100% 100%, 60% 96%, 28% 100%, 3% 97%, 0 60%); }
.eb-mapcard svg { display: block; width: 100%; }
.eb-mapcard span { display: block; text-align: center; font: italic 600 12px var(--f-head); color: var(--midnight); margin-top: 3px; }
.eb-hint { min-height: 44px; margin: 10px 0 0; }
.eb-btns { margin-top: 4px; justify-items: center; }
.eb-nudge { color: var(--jewel); }
.eb-pulse { animation: eb-beat-text 1.1s infinite; }
@keyframes eb-beat-text { 50% { transform: scale(1.12); } }
.eb-pair { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 6px 0 12px; font: 700 13px var(--f-body); color: var(--midnight); }
.eb-pair span { background: #F5B82E; padding: 6px 10px; border-radius: 6px; }
.eb-pair span:last-child { background: var(--starlight); }
.eb-pair i { width: 40px; height: 3px; background: var(--jewel); border-radius: 2px; }
.eb-scene { display: grid; gap: 8px; margin-top: 12px; }
.eb-scene p { margin: 0; color: var(--mist); text-wrap: pretty; }
.eb-scene p:last-child { font: italic 500 18px/1.3 var(--f-head); color: var(--starlight); }
`;
