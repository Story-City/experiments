// Variant 8 · Swipe deck. Like or pass on ten images; likes add up to a story.
// Imports nothing. Everything comes in through ctx (see app.js).

const CARDS = [
  { key: 'deck.fog',       label: 'Fog',       said: 'fog',            tokens: ['eerie', 'mysterious', 'night'] },
  { key: 'deck.lantern',   label: 'Lantern',   said: 'lanterns',       tokens: ['cozy', 'mysterious', 'walk'] },
  { key: 'deck.clockwork', label: 'Clockwork', said: 'clockwork',      tokens: ['scifi', 'thoughtful', 'mystery'] },
  { key: 'deck.teacup',    label: 'Teacup',    said: 'a warm teacup',  tokens: ['cozy', 'calm', 'cafe'] },
  { key: 'deck.forest',    label: 'Forest',    said: 'the forest',     tokens: ['park', 'calm', 'fantasy'] },
  { key: 'deck.chest',     label: 'Chest',     said: 'a locked chest', tokens: ['heist', 'adventure', 'playful'] },
  { key: 'deck.map',       label: 'Map',       said: 'old maps',       tokens: ['adventure', 'epic', 'history'] },
  { key: 'deck.neon',      label: 'Neon',      said: 'neon',           tokens: ['downtown', 'night', 'funny'] },
  { key: 'deck.books',     label: 'Books',     said: 'old books',      tokens: ['mystery', 'thoughtful', 'history'] },
  { key: 'deck.rain',      label: 'Rain',      said: 'rain',           tokens: ['eerie', 'downtown', 'night'] },
];

// The tail of the why-line, picked from the strongest token. Order matters: first match wins.
const TAILS = [
  ['eerie',      'a night walk with secrets in it'],
  ['night',      'a night walk with secrets in it'],
  ['cozy',       'a slow, warm wander with a twist near the end'],
  ['calm',       'a slow, warm wander with a twist near the end'],
  ['adventure',  'a proper adventure with a map in it'],
  ['epic',       'a proper adventure with a map in it'],
  ['mystery',    'an old mystery that never quite went to sleep'],
  ['thoughtful', 'an old mystery that never quite went to sleep'],
  ['downtown',   'a bright night out with the city showing off'],
  ['funny',      'a bright night out with the city showing off'],
  ['fantasy',    'a walk where the trees know something you don’t'],
  ['park',       'a walk where the trees know something you don’t'],
  ['mysterious', 'a walk with more questions than streetlights'],
];

const THRESHOLD = 80;

const CSS = `
.v-swipe .sub { margin: -6px 0 0; font-size: 18px; }
.v-swipe .stack { position: relative; width: 100%; aspect-ratio: 4 / 5; max-height: 50dvh; margin: 6px 0 26px; touch-action: none; user-select: none; -webkit-user-select: none; }
.v-swipe .card { position: absolute; inset: 0; border-radius: 20px; overflow: hidden; background: var(--raised); box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45); transform-origin: 50% 110%; will-change: transform; touch-action: none; }
.v-swipe .card img, .v-swipe .card .ph { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.v-swipe .card .ph { font-size: 24px; }
.v-swipe .card .lbl { position: absolute; left: 0; right: 0; bottom: 0; padding: 70px 18px 18px; font-size: 34px; line-height: 1; font-weight: 900; background: linear-gradient(transparent, rgba(0, 0, 0, 0.78)); pointer-events: none; }
.v-swipe .card .stamp { position: absolute; top: 18px; padding: 6px 14px; border: 3px solid currentColor; border-radius: 10px; font-size: 26px; line-height: 1; font-weight: 900; letter-spacing: 0.08em; opacity: 0; pointer-events: none; background: rgba(0, 0, 0, 0.35); }
.v-swipe .card .stamp.yes { left: 18px; color: var(--gem); transform: rotate(-12deg); }
.v-swipe .card .stamp.no { right: 18px; color: #ff8c8c; transform: rotate(12deg); }
.v-swipe .card.n1 { transform: translateY(10px) scale(0.96); }
.v-swipe .card.n2 { transform: translateY(20px) scale(0.92); }
.v-swipe .card.n3, .v-swipe .card.deep { transform: translateY(20px) scale(0.92); opacity: 0; }
.v-swipe .card.settle { transition: transform 0.25s ease; }
.v-swipe .card.fly { transition: transform 0.38s cubic-bezier(0.2, 0.7, 0.3, 1), opacity 0.38s ease; }
.v-swipe .card.top { cursor: grab; }
.v-swipe .card.top:active { cursor: grabbing; }
.v-swipe .empty { display: none; position: absolute; inset: 0; place-items: center; border-radius: 20px; border: 1px dashed var(--line); color: var(--muted); font-weight: 800; font-size: 20px; }
.v-swipe .stack.done .empty { display: grid; }
.v-swipe .acts { display: flex; justify-content: center; align-items: center; gap: 28px; margin: 4px 0 6px; }
.v-swipe .act { width: 72px; height: 72px; border-radius: 50%; border: 2px solid var(--line); background: var(--raised); display: grid; place-items: center; font-size: 30px; line-height: 1; font-weight: 900; padding: 0; transition: transform 0.12s ease; }
.v-swipe .act:active { transform: scale(0.92); }
.v-swipe .act.pass { color: #ff8c8c; }
.v-swipe .act.like { color: var(--gem); border-color: rgba(61, 220, 132, 0.45); background: rgba(61, 220, 132, 0.1); font-size: 32px; }
.v-swipe .act .sr { position: absolute; }
.v-swipe .hint { text-align: center; font-size: 15px; margin: 0 0 14px; }
.v-swipe .ig-note { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; line-height: 1.25; padding: 10px 12px; border-radius: 12px; background: rgba(255, 107, 170, 0.1); color: #ffb3d3; margin-top: 4px; }
.v-swipe .ig-note b { flex: none; color: #ff8fc0; }
@media (prefers-reduced-motion: reduce) {
  .v-swipe .card.fly, .v-swipe .card.settle { transition: none; }
}
`;

function listSaid(items) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

export default {
  slug: 'swipe',
  title: 'Like it or leave it',
  short: 'Swipe deck',
  channel: 'app',
  blurb: 'Like or pass on ten images. Your likes add up to a story.',

  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    ctx.root.innerHTML = '';

    const deck = CARDS.slice();           // fixed order so the mock-up is predictable; shuffle later if wanted
    const weights = {};
    const liked = [];
    let i = 0;                            // index of the current top card
    let busy = false;
    let done = false;

    const progress = el('div', { class: 'progress', 'aria-hidden': 'true' }, deck.map(() => el('i')));
    const stack = el('div', { class: 'stack', role: 'group', 'aria-label': 'Card stack' });
    const hint = el('p', { class: 'hint muted', text: 'Swipe right to like, left to pass.' });

    const nodes = deck.map((c, idx) => {
      const node = el('div', { class: 'card', dataset: { i: idx }, 'aria-label': c.label },
        ctx.photoEl(c.key, c.label),
        el('div', { class: 'stamp yes', text: 'LIKE' }),
        el('div', { class: 'stamp no', text: 'PASS' }),
        el('div', { class: 'lbl', text: c.label }));
      return node;
    });
    // bottom of the stack first so the current card is painted on top
    nodes.slice().reverse().forEach(n => stack.append(n));
    stack.append(el('div', { class: 'empty', text: 'Counting your likes…', 'aria-hidden': 'true' }));

    const paint = () => {
      nodes.forEach((n, idx) => {
        n.classList.remove('top', 'n1', 'n2', 'n3', 'deep');
        const d = idx - i;
        if (d < 0) return;
        n.classList.add(d === 0 ? 'top' : d === 1 ? 'n1' : d === 2 ? 'n2' : d === 3 ? 'n3' : 'deep');
        n.style.zIndex = String(deck.length - d);
      });
      [...progress.children].forEach((p, idx) => p.classList.toggle('on', idx < i));
      hint.textContent = i < deck.length ? `${i + 1} of ${deck.length} · swipe right to like, left to pass` : 'That’s the deck.';
    };

    const finish = () => {
      done = true;
      const said = liked.map(c => c.said);
      let why;
      const strongest = [...Object.entries(weights)].sort((a, b) => b[1] - a[1]).map(e => e[0]);
      const tail = (TAILS.find(([t]) => strongest.includes(t) && weights[t] > 0) || [null, 'a walk you’ll want to finish'])[1];
      if (liked.length === 0) {
        why = 'You passed on all ten. Fair enough: you are hard to impress, so here is the story that impresses most people first.';
      } else if (liked.length < 3) {
        why = `You only liked ${listSaid(said)}, and that is plenty to go on, so your story is ${tail}.`;
      } else {
        why = `You liked ${listSaid(said.slice(0, 3))}, so your story is ${tail}.`;
      }
      ctx.finish({ weights, why });
    };

    const commit = (card, dir) => {
      // dir: 1 like, -1 pass
      if (dir > 0) { liked.push(card); card.tokens.forEach(t => { weights[t] = (weights[t] || 0) + 2; }); }
      else { const t = card.tokens[0]; weights[t] = (weights[t] || 0) - 1; }
    };

    const flyOff = (dir, fromX = 0, fromY = 0) => {
      if (busy || done || i >= deck.length) return;
      busy = true;
      const node = nodes[i];
      const card = deck[i];
      node.classList.remove('settle');
      node.classList.add('fly');
      const w = stack.clientWidth || 360;
      node.style.transform = `translate(${dir * (w * 1.6)}px, ${fromY + 40}px) rotate(${dir * 24}deg)`;
      node.style.opacity = '0';
      node.querySelector(dir > 0 ? '.stamp.yes' : '.stamp.no').style.opacity = '1';
      let advanced = false;
      const advance = () => {
        if (advanced) return; advanced = true;
        node.remove();
        commit(card, dir);
        i += 1;
        busy = false;
        paint();
        if (i >= deck.length) { stack.classList.add('done'); setTimeout(finish, 260); }
      };
      node.addEventListener('transitionend', advance, { once: true });
      setTimeout(advance, 450);
    };

    // drag-to-swipe with pointer events on the whole stack (so the top card is always the target)
    let drag = null;
    const topNode = () => nodes[i];
    const onDown = (e) => {
      if (busy || done || i >= deck.length) return;
      if (e.button != null && e.button !== 0) return;
      const node = topNode();
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, dy: 0, node };
      node.classList.remove('settle');
      try { stack.setPointerCapture(e.pointerId); } catch (_) { /* fine */ }
    };
    const onMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag.dx = e.clientX - drag.x; drag.dy = e.clientY - drag.y;
      const rot = Math.max(-18, Math.min(18, drag.dx / 12));
      drag.node.style.transform = `translate(${drag.dx}px, ${drag.dy * 0.5}px) rotate(${rot}deg)`;
      const k = Math.min(1, Math.abs(drag.dx) / THRESHOLD);
      drag.node.querySelector('.stamp.yes').style.opacity = drag.dx > 0 ? String(k) : '0';
      drag.node.querySelector('.stamp.no').style.opacity = drag.dx < 0 ? String(k) : '0';
    };
    const onUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const { dx, dy, node } = drag; drag = null;
      try { stack.releasePointerCapture(e.pointerId); } catch (_) { /* fine */ }
      if (Math.abs(dx) >= THRESHOLD) { flyOff(dx > 0 ? 1 : -1, dx, dy * 0.5); return; }
      node.classList.add('settle');
      node.style.transform = '';
      node.querySelector('.stamp.yes').style.opacity = '0';
      node.querySelector('.stamp.no').style.opacity = '0';
    };
    stack.addEventListener('pointerdown', onDown);
    stack.addEventListener('pointermove', onMove);
    stack.addEventListener('pointerup', onUp);
    stack.addEventListener('pointercancel', onUp);

    const passBtn = el('button', { class: 'act pass', type: 'button', 'aria-label': 'Pass', onClick: () => flyOff(-1) }, '✕');
    const likeBtn = el('button', { class: 'act like', type: 'button', 'aria-label': 'Like', onClick: () => flyOff(1) }, '♥');

    const onKey = (e) => {
      if (!document.body.contains(stack)) { window.removeEventListener('keydown', onKey); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); flyOff(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); flyOff(-1); }
    };
    window.addEventListener('keydown', onKey);

    ctx.root.append(el('section', { class: 'v-swipe' },
      el('h2', { class: 'q', text: 'Like it or leave it' }),
      el('p', { class: 'sub muted', text: 'Ten cards. Go with your gut.' }),
      progress,
      stack,
      el('div', { class: 'acts' }, passBtn, likeBtn),
      hint,
      el('p', { class: 'ig-note' }, el('b', { text: 'Instagram version:' }), el('span', { text: 'post the ten cards as a carousel and ask people to comment their three favourites. Reply with their story.' })),
    ));
    paint();
  },
};
