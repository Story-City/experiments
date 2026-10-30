// Variant 11 · Draw a card. A face-down deck drawn in CSS only. Draw one, or draw three.
// Imports nothing. Everything comes in through ctx (see app.js).

// Every token here is in TOKENS (stories.js).
const ONE = [
  { name: 'The Lantern',              glyph: '🏮', meaning: 'You’d rather carry the light than follow it.',               fortune: 'a night walk you lead yourself',                       w: { mysterious: 2, night: 2, walk: 1, cozy: 1 } },
  { name: 'The Locked Door',          glyph: '🚪', meaning: 'Something on the other side already knows your name.',      fortune: 'a mystery that opens one door at a time',               w: { mystery: 2, mysterious: 2, eerie: 1, solo: 1 } },
  { name: 'The Stranger at the Café', glyph: '☕', meaning: 'A conversation you didn’t plan, with someone who did.',      fortune: 'a warm table with something odd about the menu',        w: { cafe: 2, cozy: 1, funny: 1, date: 1, fantasy: 1 } },
  { name: 'The Telescope',            glyph: '🔭', meaning: 'You look further than most. Tonight that matters.',          fortune: 'a long look at a sky that is looking back',             w: { thoughtful: 2, scifi: 1, calm: 1, night: 1, epic: 1 } },
  { name: 'The Ticking Clock',        glyph: '⏱️', meaning: 'Time is the puzzle, and you are holding the pieces.',         fortune: 'a race through then and now',                           w: { history: 2, mystery: 1, lively: 1, downtown: 1 } },
  { name: 'The Fox',                  glyph: '🦊', meaning: 'Clever, quick and a little bit wild. Follow it.',             fortune: 'a chase with a grin in it',                             w: { playful: 2, adventure: 1, park: 1, kids: 1, fantasy: 1 } },
  { name: 'The Letter',               glyph: '✉️', meaning: 'Words meant for you, sent before you were ready.',            fortune: 'a quiet walk that turns out to be about someone',       w: { tender: 2, romance: 1, thoughtful: 1, calm: 1 } },
  { name: 'The Fog',                  glyph: '🌫️', meaning: 'Not everything wants to be seen yet.',                        fortune: 'a walk where the streets keep their secrets',           w: { eerie: 2, spooky: 1, night: 1, mysterious: 1 } },
  { name: 'The Key',                  glyph: '🗝️', meaning: 'You already have what opens it.',                             fortune: 'a job with a crew, a plan and a lock',                  w: { heist: 2, adventure: 1, playful: 1, friends: 1 } },
  { name: 'The Map',                  glyph: '🗺️', meaning: 'The route is drawn. The reason is not.',                      fortune: 'a long walk with an X on it',                           w: { adventure: 2, epic: 1, walk: 1, history: 1 } },
  { name: 'The Neon Sign',            glyph: '🌃', meaning: 'The city is awake and it is showing off.',                    fortune: 'a bright night downtown with the volume up',            w: { downtown: 2, night: 1, funny: 1, lively: 1 } },
  { name: 'The Garden Gate',          glyph: '🌿', meaning: 'Green on the other side, and something small and lost.',     fortune: 'a gentle wander with something worth finding',          w: { park: 2, cozy: 1, calm: 1, kids: 1 } },
];

const PLACES = [
  { name: 'The Café',          glyph: '☕', frag: 'set at a warm table',               w: { cafe: 2, cozy: 1, calm: 1 } },
  { name: 'The Park',          glyph: '🌳', frag: 'set among the trees',               w: { park: 2, calm: 1, day: 1 } },
  { name: 'The Downtown Alley', glyph: '🏙️', frag: 'set in the loud heart of the city', w: { downtown: 2, night: 1, lively: 1 } },
  { name: 'Anywhere You Are',  glyph: '📍', frag: 'set wherever you happen to stand',  w: { anywhere: 2, walk: 1, neighbourhood: 1 } },
];
const COMPANIONS = [
  { name: 'The Fox',        glyph: '🦊', frag: 'with something clever at your heel',       w: { playful: 2, fantasy: 1, kids: 1 } },
  { name: 'The Detective',  glyph: '🕵️', frag: 'with a sharp eye beside you',              w: { mystery: 2, mysterious: 1, history: 1 } },
  { name: 'The Knight',     glyph: '⚔️', frag: 'with a knight who needs a squire',         w: { epic: 2, fantasy: 1, adventure: 1, kids: 1 } },
  { name: 'The Stranger',   glyph: '🎭', frag: 'with someone you can’t quite place',       w: { romance: 1, tender: 1, mysterious: 1, date: 1 } },
  { name: 'A Kid With a Map', glyph: '🗺️', frag: 'with a small guide who is very sure',    w: { adventure: 2, playful: 1, kids: 1, friends: 1 } },
];
const TROUBLES = [
  { name: 'A Locked Door',           glyph: '🚪', frag: 'and a door that wants a plan',            w: { heist: 2, mystery: 1, playful: 1 } },
  { name: 'A Missing Toy',           glyph: '🧸', frag: 'and something small to bring home',       w: { cozy: 2, kids: 1, playful: 1, neighbourhood: 1 } },
  { name: 'A Voice From the Art',    glyph: '🗿', frag: 'and a voice coming out of the sculpture', w: { art: 2, thoughtful: 1, fantasy: 1, mysterious: 1 } },
  { name: 'A Body at the Protest',   glyph: '🕯️', frag: 'and a crime nobody else has noticed yet', w: { eerie: 2, mystery: 2, night: 1 } },
  { name: 'A Ghost on Its First Day', glyph: '👻', frag: 'and a ghost who is new at this',         w: { spooky: 2, eerie: 1, funny: 1, night: 1 } },
];
const PILES = [
  { label: 'A place',     cards: PLACES },
  { label: 'A companion', cards: COMPANIONS },
  { label: 'A trouble',   cards: TROUBLES },
];

const CSS = `
.v-cards { --cw: 196px; --ch: 290px; }
.v-cards .sub { margin: -6px 0 10px; font-size: 18px; }
.v-cards .seg { display: flex; padding: 3px; border-radius: 999px; background: var(--raised); border: 1px solid var(--line); margin: 0 0 14px; }
.v-cards .seg button { flex: 1; min-height: 40px; border: 0; border-radius: 999px; background: transparent; color: var(--muted); font-weight: 800; font-size: 16px; }
.v-cards .seg button[aria-pressed="true"] { background: var(--raised-2); color: var(--text); box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); }

/* a card: a 3D flipper with a patterned back and a plain face */
.v-cards .card { position: relative; width: var(--cw); height: var(--ch); perspective: 1000px; }
.v-cards .card .in { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform 0.75s cubic-bezier(0.3, 0.8, 0.3, 1); }
.v-cards .card.flipped .in { transform: rotateY(180deg); }
.v-cards .side { position: absolute; inset: 0; border-radius: 16px; backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: hidden; }
.v-cards .back { background:
    radial-gradient(circle at 50% 50%, rgba(0, 158, 255, 0.28) 0, rgba(0, 158, 255, 0) 38%),
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 12px),
    repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 12px),
    linear-gradient(160deg, #2e2458, #170c35);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 0 0 6px var(--bg), inset 0 0 0 7px rgba(255, 255, 255, 0.16), 0 12px 28px rgba(0, 0, 0, 0.45); }
.v-cards .back::before { content: ''; position: absolute; inset: 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.14); }
.v-cards .back::after { content: '✦'; position: absolute; left: 50%; top: 50%; translate: -50% -50%; width: 46%; aspect-ratio: 1; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.3); display: grid; place-items: center; font-size: 30px; color: #cfe9ff; background: rgba(23, 12, 53, 0.6); text-shadow: 0 0 14px rgba(0, 158, 255, 0.9); }
.v-cards .face { transform: rotateY(180deg); background: linear-gradient(170deg, #fff8e8, #efe3c8); color: #1c1540; border: 1px solid rgba(0, 0, 0, 0.15); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 14px 12px; gap: 6px; }
.v-cards .face::before { content: ''; position: absolute; inset: 8px; border-radius: 11px; border: 1px solid rgba(28, 21, 64, 0.25); pointer-events: none; }
.v-cards .face .g { font-size: 56px; line-height: 1; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)); }
.v-cards .face .nm { font-size: 24px; line-height: 1; font-weight: 900; text-wrap: balance; margin-top: 4px; }
.v-cards .face .mn { font-size: 15px; line-height: 1.2; font-weight: 700; color: #4a4270; text-wrap: balance; }
.v-cards .face .rank { position: absolute; top: 10px; left: 12px; font-size: 13px; font-weight: 900; color: #4a4270; letter-spacing: 0.08em; }

/* draw one: a fanned pile */
.v-cards .one { position: relative; height: calc(var(--ch) + 58px); display: grid; place-items: end center; margin-bottom: 10px; }
.v-cards .pile { position: relative; width: var(--cw); height: var(--ch); cursor: pointer; border: 0; padding: 0; background: none; border-radius: 16px; margin-bottom: 10px; }
.v-cards .pile .card { position: absolute; inset: 0; transform-origin: 50% 120%; transition: transform 0.45s ease, opacity 0.45s ease; }
.v-cards .pile .card:nth-child(1) { transform: rotate(-12deg); }
.v-cards .pile .card:nth-child(2) { transform: rotate(-8deg); }
.v-cards .pile .card:nth-child(3) { transform: rotate(-4deg); }
.v-cards .pile .card:nth-child(4) { transform: rotate(0deg); }
.v-cards .pile .card:nth-child(5) { transform: rotate(4deg); }
.v-cards .pile .card:nth-child(6) { transform: rotate(8deg); }
.v-cards .pile .card:nth-child(7) { transform: rotate(0deg); }
.v-cards .pile.shuffling .card { animation: v-cards-shuf 1.3s ease-in-out both; }
.v-cards .pile.shuffling .card:nth-child(2) { animation-delay: 0.08s; }
.v-cards .pile.shuffling .card:nth-child(3) { animation-delay: 0.16s; }
.v-cards .pile.shuffling .card:nth-child(4) { animation-delay: 0.24s; }
.v-cards .pile.shuffling .card:nth-child(5) { animation-delay: 0.32s; }
.v-cards .pile.shuffling .card:nth-child(6) { animation-delay: 0.4s; }
.v-cards .pile.shuffling .card:nth-child(7) { animation-delay: 0.48s; }
@keyframes v-cards-shuf {
  0%   { transform: rotate(0deg) translate(0, 0); }
  30%  { transform: rotate(-10deg) translate(-24px, -22px); }
  55%  { transform: rotate(8deg) translate(22px, -8px); }
  100% { transform: rotate(0deg) translate(0, 0); }
}
.v-cards .pile.drawn .card:not(:last-child) { opacity: 0; transform: translateY(30px) scale(0.9); }
.v-cards .pile.drawn .card:last-child { transform: translateY(-20px) scale(1.06); }
.v-cards .pile.ready:not(.drawn) .card:last-child { animation: v-cards-breathe 2.2s ease-in-out infinite; }
@keyframes v-cards-breathe { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(0deg); } }
.v-cards .cue { text-align: center; font-size: 17px; font-weight: 800; margin: 4px 0 14px; min-height: 22px; }

/* draw three: three small piles side by side */
.v-cards .three { --cw: 104px; --ch: 154px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 6px 0 14px; }
.v-cards .slot { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.v-cards .slot .lab { font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.v-cards .slot .pile3 { position: relative; width: var(--cw); height: var(--ch); border: 0; padding: 0; background: none; border-radius: 12px; }
.v-cards .slot .pile3 .card { position: absolute; inset: 0; transition: transform 0.4s ease, opacity 0.4s ease; }
.v-cards .slot .pile3 .card:nth-child(1) { transform: translate(-3px, 4px) rotate(-3deg); }
.v-cards .slot .pile3 .card:nth-child(2) { transform: translate(3px, 2px) rotate(2deg); }
.v-cards .slot .pile3 .card:nth-child(3) { transform: translate(0, 0); }
.v-cards .slot .pile3.drawn .card:not(:last-child) { opacity: 0; }
.v-cards .slot .pile3.next .card:last-child { animation: v-cards-breathe 2s ease-in-out infinite; box-shadow: 0 0 0 3px rgba(0, 158, 255, 0.55), 0 12px 28px rgba(0, 0, 0, 0.45); border-radius: 12px; }
.v-cards .three .side { border-radius: 12px; }
.v-cards .three .back { box-shadow: inset 0 0 0 4px var(--bg), inset 0 0 0 5px rgba(255, 255, 255, 0.16), 0 10px 22px rgba(0, 0, 0, 0.45); }
.v-cards .three .back::before { inset: 9px; border-radius: 7px; }
.v-cards .three .back::after { font-size: 20px; }
.v-cards .three .face { padding: 10px 6px; gap: 4px; }
.v-cards .three .face::before { inset: 5px; border-radius: 8px; }
.v-cards .three .face .g { font-size: 34px; }
.v-cards .three .face .nm { font-size: 14px; line-height: 1.02; }
.v-cards .three .face .rank { display: none; }
.v-cards .three .face .mn { display: none; }

.v-cards .go { margin: 2px 0 14px; }
.v-cards .go[hidden] { display: none; }
.v-cards .reel { font-size: 14px; text-align: center; margin: 0; }
@media (max-width: 359px) { .v-cards .three { --cw: 92px; --ch: 138px; gap: 8px; } }
@media (prefers-reduced-motion: reduce) {
  .v-cards .pile.shuffling .card, .v-cards .pile.ready .card, .v-cards .slot .pile3.next .card:last-child { animation: none; }
  .v-cards .card .in { transition-duration: 0.2s; }
}
`;

const sum = (...ws) => { const o = {}; for (const w of ws) for (const [k, v] of Object.entries(w)) o[k] = (o[k] || 0) + v; return o; };
const listSaid = (a) => a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
const lower = (s) => s.replace(/^(The|A)\b/, (m) => m.toLowerCase());

export default {
  slug: 'cards',
  title: 'Draw a card',
  short: 'Draw a card',
  channel: 'instagram',
  blurb: 'A face-down deck. Draw one, or draw three.',

  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    ctx.root.innerHTML = '';

    const cardEl = (c, rank) => el('div', { class: 'card', 'aria-hidden': c ? null : 'true' },
      el('div', { class: 'in' },
        el('div', { class: 'side back' }),
        el('div', { class: 'side face' },
          rank ? el('span', { class: 'rank', text: rank }) : null,
          el('div', { class: 'g', 'aria-hidden': 'true', text: c ? c.glyph : '' }),
          el('div', { class: 'nm', text: c ? c.name : '' }),
          el('div', { class: 'mn', text: c ? c.meaning : '' }))));

    const area = el('div');
    let mode = 'one';
    const seg = el('div', { class: 'seg', role: 'group', 'aria-label': 'How many cards' },
      el('button', { type: 'button', 'aria-pressed': 'true', dataset: { mode: 'one' }, text: 'Draw one', onClick: () => setMode('one') }),
      el('button', { type: 'button', 'aria-pressed': 'false', dataset: { mode: 'three' }, text: 'Draw three', onClick: () => setMode('three') }));
    const setMode = (m) => {
      mode = m;
      [...seg.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
      area.innerHTML = '';
      area.append(m === 'one' ? drawOne() : drawThree());
    };

    /* ---- draw one ---- */
    function drawOne() {
      const chosen = ctx.shuffle(ONE)[0];
      const pile = el('button', { class: 'pile shuffling', type: 'button', 'aria-label': 'Tap the deck to draw a card' });
      for (let k = 0; k < 6; k++) pile.append(cardEl(null));
      const top = cardEl(chosen, 'ONE OF TWELVE');
      pile.append(top);
      const cue = el('p', { class: 'cue muted', text: 'Shuffling…' });
      const go = el('button', { class: 'btn primary block go', type: 'button', text: 'Read my fortune', hidden: true });
      let state = 'shuffling';
      setTimeout(() => { pile.classList.remove('shuffling'); pile.classList.add('ready'); cue.textContent = 'Tap the deck.'; cue.classList.remove('muted'); state = 'ready'; }, 1350);
      pile.addEventListener('click', () => {
        if (state !== 'ready') return;
        state = 'drawn';
        pile.classList.remove('ready'); pile.classList.add('drawn');
        top.classList.add('flipped');
        pile.setAttribute('aria-label', `You drew ${chosen.name}`);
        cue.textContent = chosen.name;
        setTimeout(() => { go.hidden = false; }, 650);
      });
      go.addEventListener('click', () => {
        ctx.finish({
          weights: chosen.w,
          headline: 'The deck says…',
          why: `${chosen.name}: ${chosen.meaning.charAt(0).toLowerCase() + chosen.meaning.slice(1).replace(/\.$/, '')}, so your story is ${chosen.fortune}.`,
        });
      });
      return el('div', {},
        el('div', { class: 'one' }, pile),
        cue,
        go,
        el('p', { class: 'reel muted', text: 'Reel version: screenshot to stop the shuffle.' }));
    }

    /* ---- draw three ---- */
    function drawThree() {
      const picks = PILES.map(p => ctx.shuffle(p.cards)[0]);
      let next = 0;
      const cue = el('p', { class: 'cue', text: 'Tap the first pile.' });
      const go = el('button', { class: 'btn primary block go', type: 'button', text: 'Read my fortune', hidden: true });
      const piles = PILES.map((p, idx) => {
        const top = cardEl(picks[idx]);
        const pile = el('button', { class: 'pile3' + (idx === 0 ? ' next' : ''), type: 'button', 'aria-label': `${p.label}: tap to draw` }, cardEl(null), cardEl(null), top);
        pile.addEventListener('click', () => {
          if (idx !== next) { if (idx > next) ctx.toast('One at a time. Tap the glowing pile.'); return; }
          pile.classList.remove('next'); pile.classList.add('drawn');
          top.classList.add('flipped');
          pile.setAttribute('aria-label', `${p.label}: ${picks[idx].name}`);
          next += 1;
          if (next < PILES.length) {
            piles[next].classList.add('next');
            cue.textContent = next === 1 ? 'Now a companion.' : 'And finally, the trouble.';
          } else {
            cue.textContent = listSaid(picks.map(c => c.name)) + '.';
            setTimeout(() => { go.hidden = false; }, 650);
          }
        });
        return pile;
      });
      go.addEventListener('click', () => {
        const [pl, co, tr] = picks;
        ctx.finish({
          weights: sum(pl.w, co.w, tr.w),
          headline: 'The deck says…',
          why: `You drew ${lower(pl.name)}, ${lower(co.name)} and ${lower(tr.name)}, so your story is ${pl.frag}, ${co.frag}, ${tr.frag}.`,
        });
      });
      return el('div', {},
        el('div', { class: 'three' }, PILES.map((p, idx) => el('div', { class: 'slot' }, el('div', { class: 'lab', text: p.label }), piles[idx]))),
        cue,
        go,
        el('p', { class: 'reel muted', text: 'Reel version: screenshot to stop the shuffle.' }));
    }

    ctx.root.append(el('section', { class: 'v-cards' },
      el('h2', { class: 'q', text: 'Let the deck decide' }),
      el('p', { class: 'sub muted', text: 'Shuffle, tap, and see what you’re in for.' }),
      seg,
      area));
    setMode('one');
  },
};
