// #17 Poll-sticker chain. An Instagram STORY (9:16): five slides, each a native-style poll sticker,
// then a reveal slide ("mostly left → A, mostly right → B") and a "See mine" button for the player's own mix.
// Imports nothing; talks to the shell only through ctx.

const POLLS = [
  { q: 'Tonight you’d rather…',
    a: { t: 'Get lost',  w: ['adventure', 'lively'], did: 'got lost' },
    b: { t: 'Get found', w: ['cozy', 'calm'],        did: 'got found' },
    pct: 61, bg: 'linear-gradient(165deg, #0b2a7a 0%, #170c35 58%, #2b1050 100%)' },
  { q: 'The note says “don’t open the door.”',
    a: { t: 'Open it',     w: ['eerie', 'spooky', 'mystery'],  did: 'opened the door' },
    b: { t: 'Knock first', w: ['playful', 'funny', 'kids'],    did: 'knocked first' },
    pct: 72, bg: 'linear-gradient(170deg, #050314 0%, #170c35 45%, #4a1d7a 100%)' },
  { q: 'Pick a light',
    a: { t: 'Candle', w: ['cozy', 'mysterious', 'night'],     did: 'picked the candle' },
    b: { t: 'Neon',   w: ['downtown', 'funny', 'romance'],    did: 'went neon' },
    pct: 54, bg: 'linear-gradient(160deg, #2a0f3a 0%, #170c35 50%, #7a3a12 100%)' },
  { q: 'Your walk is…',
    a: { t: 'Twenty minutes',      w: ['quick'],          did: 'kept it to twenty minutes' },
    b: { t: 'As long as it takes', w: ['long', 'epic'],   did: 'walked as long as it takes' },
    pct: 45, bg: 'linear-gradient(165deg, #3b1a7a 0%, #170c35 55%, #0b3a6b 100%)' },
  { q: 'Who’s coming?',
    a: { t: 'Nobody',    w: ['solo', 'thoughtful'],  did: 'came alone' },
    b: { t: 'Everybody', w: ['friends', 'date'],     did: 'brought everybody' },
    pct: 58, bg: 'linear-gradient(160deg, #0d4a3a 0%, #170c35 55%, #1a0b3d 100%)' },
];
const REVEAL_BG = 'linear-gradient(165deg, #241b46 0%, #170c35 50%, #0b1f4d 100%)';

const CSS = `
.v-poll-chain .ig-story { user-select: none; -webkit-user-select: none; }
.v-poll-chain .ig-story .bars i.cur { background: rgba(255,255,255,0.35); position: relative; overflow: hidden; }
.v-poll-chain .ig-story .bars i.cur::after { content: ""; position: absolute; inset: 0; width: 0; background: #fff; animation: v-pc-fill 6s linear forwards; }
@keyframes v-pc-fill { to { width: 100%; } }
.v-poll-chain .ig-story .who .ago { color: rgba(255,255,255,0.75); font-weight: 400; }
.v-poll-chain .slide { position: absolute; inset: 0; }
.v-poll-chain .slide::before { content: ""; position: absolute; inset: 0; background: radial-gradient(60% 45% at 50% 62%, rgba(255,255,255,0.10), transparent 70%); pointer-events: none; }
.v-poll-chain .zone { position: absolute; top: 0; bottom: 0; width: 50%; border: 0; background: transparent; padding: 0; z-index: 1; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.v-poll-chain .zone.l { left: 0; } .v-poll-chain .zone.r { right: 0; }
.v-poll-chain .zone:focus-visible { outline: none; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.6); }
.v-poll-chain .ask { position: absolute; left: 22px; right: 22px; top: 21%; margin: 0; font-family: "Darker Grotesque", sans-serif; font-size: 44px; line-height: 0.96; font-weight: 900; text-wrap: balance; text-shadow: 0 2px 14px rgba(0,0,0,0.45); pointer-events: none; z-index: 2; }
.v-poll-chain .ask small { display: block; font-size: 15px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.72); margin-bottom: 10px; font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
.v-poll-chain .poll { position: absolute; left: 11%; right: 11%; top: 53%; z-index: 3; background: #fff; color: #111; border-radius: 18px; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; box-shadow: 0 14px 40px rgba(0,0,0,0.35); font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
.v-poll-chain .poll.voted { transform: scale(1.02); transition: transform 0.25s ease; }
.v-poll-chain .opt { position: relative; min-height: 60px; border: 0; background: transparent; padding: 10px 8px; font-size: 17px; font-weight: 800; line-height: 1.1; display: grid; place-items: center; text-align: center; overflow: hidden; color: #111; -webkit-tap-highlight-color: transparent; }
.v-poll-chain .opt + .opt { border-left: 1px solid #e3e3e3; }
.v-poll-chain .opt .lbl { position: relative; z-index: 1; display: block; max-width: 100%; }
.v-poll-chain .poll:not(.voted) .opt[data-side="a"] .lbl { background: linear-gradient(90deg, #5b3df5, #2f8bff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.v-poll-chain .poll:not(.voted) .opt[data-side="b"] .lbl { background: linear-gradient(90deg, #ee2a7b, #f9a23a); -webkit-background-clip: text; background-clip: text; color: transparent; }
.v-poll-chain .opt .fill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: #ededed; transition: width 0.55s cubic-bezier(.2,.8,.2,1); }
.v-poll-chain .opt.mine .fill { background: #dcd6ff; }
.v-poll-chain .opt .pct { position: relative; z-index: 1; display: block; font-size: 14px; font-weight: 700; color: #6b6b6b; margin-top: 2px; }
.v-poll-chain .opt.mine .pct { color: #3b2bb5; }
.v-poll-chain .poll.voted .opt:not(.mine) .lbl { color: #8a8a8a; font-weight: 700; }
.v-poll-chain .poll.voted .opt { cursor: default; }
.v-poll-chain .hint { position: absolute; left: 0; right: 0; bottom: 16px; text-align: center; font-size: 12px; color: rgba(255,255,255,0.6); pointer-events: none; z-index: 2; }
.v-poll-chain .reveal { position: absolute; inset: 0; padding: 60px 20px 20px; display: flex; flex-direction: column; justify-content: center; gap: 10px; z-index: 2; font-family: "Darker Grotesque", sans-serif; }
.v-poll-chain .reveal .eyebrow { font-size: 13px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--story); }
.v-poll-chain .reveal h3 { margin: 0 0 6px; font-size: 36px; line-height: 0.98; font-weight: 900; text-wrap: balance; }
.v-poll-chain .mini { background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.16); border-radius: 14px; padding: 12px 14px; backdrop-filter: blur(6px); }
.v-poll-chain .mini .side { font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #cfc6ff; }
.v-poll-chain .mini.b .side { color: #ffc3dc; }
.v-poll-chain .mini b { display: block; font-size: 24px; line-height: 1; font-weight: 900; margin: 4px 0 4px; text-wrap: balance; }
.v-poll-chain .mini span { display: block; font-size: 16px; line-height: 1.2; color: #e2ddf2; text-wrap: pretty; }
.v-poll-chain .mini i { display: block; font-style: normal; font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 6px; }
.v-poll-chain .see { margin: 12px auto 0; display: inline-flex; align-items: center; gap: 8px; min-height: 46px; padding: 0 22px; border-radius: 999px; border: 0; background: #fff; color: #111; font: 800 19px/1 "Darker Grotesque", sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.35); position: relative; z-index: 3; }
.v-poll-chain .see:active { transform: scale(0.97); }
.v-poll-chain .note { font-size: 15px; line-height: 1.3; margin: 0 0 8px; }
.v-poll-chain .again { font-size: 15px; margin: 0; }
.v-poll-chain .again button { background: none; border: 0; padding: 6px 4px; margin: -6px -4px; min-height: 32px; color: var(--accent); font-weight: 800; }
@media (max-width: 360px) { .v-poll-chain .ask { font-size: 38px; } .v-poll-chain .opt { font-size: 15px; } }
`;

function joinHuman(parts) {
  if (parts.length <= 1) return parts.join('');
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
}

export default {
  slug: 'poll-chain',
  title: 'Poll-sticker chain',
  short: 'Poll-sticker chain',
  channel: 'instagram',
  blurb: 'Five story slides with native polls and a “mostly A” reveal.',

  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    const known = new Set(Object.values(ctx.tokens).flat());
    const weightsFor = (sides) => {
      const w = {};
      sides.forEach((s, i) => { if (!s) return; for (const t of POLLS[i][s].w) if (known.has(t)) w[t] = (w[t] || 0) + 1; });
      return w;
    };
    const storyA = ctx.score(weightsFor(POLLS.map(() => 'a')))[0].story;
    const storyB = ctx.score(weightsFor(POLLS.map(() => 'b')))[0].story;

    const state = { i: 0, ans: POLLS.map(() => null), timer: null };
    const total = POLLS.length + 1;

    const bars = el('div', { class: 'bars', 'aria-hidden': 'true' }, Array.from({ length: total }, () => el('i')));
    const who = el('div', { class: 'who' }, el('div', { class: 'ig-avatar' }, el('i', { text: '🔮' })), el('span', { text: 'storycityapp' }), el('span', { class: 'ago', text: '2h' }));
    const slideHost = el('div', { class: 'slide' });
    const frame = el('div', { class: 'ig-story', role: 'group', 'aria-label': 'Instagram story mock-up', dataset: { slide: 1 } }, slideHost, bars, who);
    const wrap = el('div', { class: 'v-poll-chain' },
      frame,
      el('p', { class: 'muted note', text: 'Built with native poll stickers, nothing to code. The reveal slide goes up 24 hours later.' }),
      el('p', { class: 'muted again' }, 'Tap right to skip, left to go back. ', el('button', { type: 'button', text: 'Start over', onClick: () => { clearTimeout(state.timer); ctx.restart(); } })),
    );

    const go = (n) => { clearTimeout(state.timer); state.i = Math.max(0, Math.min(total - 1, n)); draw(); };
    const zones = () => [
      el('button', { class: 'zone l', type: 'button', 'aria-label': 'Back', onClick: () => go(state.i - 1) }),
      el('button', { class: 'zone r', type: 'button', 'aria-label': 'Next', onClick: () => go(state.i + 1) }),
    ];

    function pollSlide(i) {
      const p = POLLS[i]; const picked = state.ans[i];
      const opt = (side) => {
        const o = p[side]; const pct = side === 'a' ? p.pct : 100 - p.pct;
        const b = el('button', { class: 'opt' + (picked === side ? ' mine' : ''), type: 'button', dataset: { side }, 'aria-pressed': picked === side ? 'true' : 'false' },
          el('span', { class: 'fill' }), el('span', { class: 'lbl', text: o.t }), picked ? el('span', { class: 'pct', text: pct + '%' }) : null);
        if (picked) requestAnimationFrame(() => { b.querySelector('.fill').style.width = pct + '%'; });
        b.addEventListener('click', (e) => { e.stopPropagation(); if (state.ans[i]) return; vote(i, side); });
        return b;
      };
      const poll = el('div', { class: 'poll' + (picked ? ' voted' : ''), role: 'group', 'aria-label': p.q }, opt('a'), opt('b'));
      return [
        el('h2', { class: 'ask' }, el('small', { text: `${i + 1} of ${POLLS.length}` }), p.q),
        poll,
        el('div', { class: 'hint', text: picked ? 'Tap the right side to keep going' : 'Tap one' }),
        zones(),
      ];
    }

    function vote(i, side) {
      state.ans[i] = side;
      const poll = slideHost.querySelector('.poll');
      poll.classList.add('voted');
      poll.querySelectorAll('.opt').forEach(b => {
        const s = b.dataset.side; const pct = s === 'a' ? POLLS[i].pct : 100 - POLLS[i].pct;
        b.classList.toggle('mine', s === side); b.setAttribute('aria-pressed', s === side ? 'true' : 'false');
        b.append(el('span', { class: 'pct', text: pct + '%' }));
        requestAnimationFrame(() => { b.querySelector('.fill').style.width = pct + '%'; });
      });
      const hint = slideHost.querySelector('.hint'); if (hint) hint.textContent = 'Tap the right side to keep going';
      clearTimeout(state.timer);
      state.timer = setTimeout(() => go(i + 1), 700);
    }

    function revealSlide() {
      const mini = (side, s, label) => el('div', { class: 'mini ' + side },
        el('div', { class: 'side', text: label }),
        el('b', { text: s.name }),
        el('span', { text: s.blurb }),
        el('i', { text: `${s.minutes} min · ${s.where}` }));
      return [
        el('div', { class: 'reveal' },
          el('div', { class: 'eyebrow', text: 'The reveal' }),
          el('h3', { text: 'Mostly left or mostly right?' }),
          mini('a', storyA, 'Mostly left →'),
          mini('b', storyB, 'Mostly right →'),
          el('button', { class: 'see', type: 'button', onClick: seeMine }, '🔗', el('span', { text: 'See mine' }))),
        zones(),
      ];
    }

    function seeMine() {
      clearTimeout(state.timer);
      const did = state.ans.map((s, i) => s ? POLLS[i][s].did : null).filter(Boolean);
      const why = did.length ? `You ${joinHuman(did)}.` : 'You skipped every poll, so this is the house pick.';
      ctx.finish({ weights: weightsFor(state.ans), why, headline: 'Mostly you' });
    }

    function draw() {
      slideHost.innerHTML = '';
      frame.dataset.slide = state.i + 1;
      [...bars.children].forEach((b, j) => { b.className = j < state.i ? 'on' : j === state.i ? 'cur' : ''; });
      slideHost.style.background = state.i < POLLS.length ? POLLS[state.i].bg : REVEAL_BG;
      slideHost.append(...(state.i < POLLS.length ? pollSlide(state.i) : revealSlide()).flat(Infinity));
    }

    ctx.root.append(wrap);
    draw();
  },
};
