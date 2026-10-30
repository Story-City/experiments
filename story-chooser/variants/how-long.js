// How long have you got? Time, place and company, then an optional mood. The practical matcher. App channel.
// Four screens, about ten seconds. Length and place +3, company +2, mood +2.

const STEPS = [
  { q: 'How long have you got?', pts: 3, opts: [
    { label: 'About 15 minutes', token: 'quick',  say: 'Fifteen minutes' },
    { label: 'Half an hour',     token: 'medium', say: 'Thirty minutes' },
    { label: 'An hour or more',  token: 'long',   say: 'An hour or more' } ] },
  { q: 'Where are you right now?', pts: 3, opts: [
    { label: 'Downtown',                  token: 'downtown', say: 'downtown' },
    { label: 'In a park',                 token: 'park',     say: 'in a park' },
    { label: 'At a café',                 token: 'cafe',     say: 'at a café' },
    { label: 'At home or somewhere else', token: 'anywhere', say: 'wherever you happen to be' } ] },
  { q: 'Who’s with you?', pts: 2, opts: [
    { label: 'Just me', token: 'solo',    say: 'on your own' },
    { label: 'Kids',    token: 'kids',    say: 'with the kids' },
    { label: 'Friends', token: 'friends', say: 'with friends' },
    { label: 'A date',  token: 'date',    say: 'on a date' } ] },
];
const MOODS = [
  { label: 'Cosy',   glyph: '🕯️', tokens: ['cozy', 'calm'],      say: 'cosy' },
  { label: 'Creepy', glyph: '🕸️', tokens: ['eerie', 'spooky'],   say: 'creepy' },
  { label: 'Funny',  glyph: '🙃', tokens: ['funny', 'playful'],  say: 'funny' },
  { label: 'Big',    glyph: '⚡', tokens: ['epic', 'adventure'], say: 'big' },
];

const CSS = `
.v-how-long .screen { animation: v-hl-in 140ms ease-out both; }
@keyframes v-hl-in { from { opacity: 0; translate: 0 8px; } to { opacity: 1; translate: 0 0; } }
.v-how-long .q { font-size: 34px; margin: 10px 0 16px; }
.v-how-long .choice { min-height: 60px; font-size: 20px; padding: 16px 18px; -webkit-tap-highlight-color: transparent; }
.v-how-long .sub { color: var(--muted); font-size: 16px; margin: -8px 0 16px; }
.v-how-long .chips { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.v-how-long .chip { min-height: 108px; border-radius: 18px; border: 1px solid var(--line); background: var(--raised); color: var(--text);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 24px; font-weight: 900; -webkit-tap-highlight-color: transparent; }
.v-how-long .chip .glyph { font-size: 32px; line-height: 1; }
.v-how-long .chip:active { background: var(--raised-2); border-color: var(--accent); }
.v-how-long .chip.cosy { background: linear-gradient(160deg, rgba(255, 179, 71, 0.16), var(--raised) 65%); }
.v-how-long .chip.creepy { background: linear-gradient(160deg, rgba(179, 107, 255, 0.18), var(--raised) 65%); }
.v-how-long .chip.funny { background: linear-gradient(160deg, rgba(61, 220, 132, 0.14), var(--raised) 65%); }
.v-how-long .chip.big { background: linear-gradient(160deg, rgba(242, 194, 48, 0.16), var(--raised) 65%); }
.v-how-long .surprise { margin-top: 14px; }
.v-how-long .foot { text-align: center; color: var(--muted); font-size: 14px; margin: 14px 0 0; }
`;

export default {
  slug: 'how-long',
  title: 'How long have you got?',
  short: 'How long have you got?',
  channel: 'app',
  blurb: 'Time, place and company. The practical matcher.',
  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    const weights = {};
    const said = [];
    const add = (t, n) => { weights[t] = (weights[t] || 0) + n; };
    const wrap = el('div', { class: 'v-how-long' });
    ctx.root.append(wrap);
    const total = STEPS.length + 1;
    const show = (node) => { wrap.innerHTML = ''; wrap.append(node); window.scrollTo(0, 0); };
    const progress = (i) => el('div', { class: 'progress', 'aria-hidden': 'true' }, Array.from({ length: total }, (_, j) => el('i', { class: j <= i ? 'on' : '' })));

    const step = (i) => {
      if (i >= STEPS.length) return mood();
      const s = STEPS[i];
      show(el('div', { class: 'screen' },
        progress(i),
        el('h2', { class: 'q', text: s.q }),
        s.opts.map(o => el('button', { class: 'choice', text: o.label, onClick: () => { add(o.token, s.pts); said.push(o.say); step(i + 1); } })),
        i === 0 ? el('p', { class: 'foot', text: 'Three taps, then we pick.' }) : null,
      ));
    };

    const mood = () => show(el('div', { class: 'screen' },
      progress(STEPS.length),
      el('h2', { class: 'q', text: 'And tonight you want it…' }),
      el('p', { class: 'sub', text: 'Optional. One tap, or let us surprise you.' }),
      el('div', { class: 'chips' }, MOODS.map(m => el('button', { class: 'chip ' + m.say, onClick: () => { m.tokens.forEach(t => add(t, 2)); done(m.say); } },
        el('span', { class: 'glyph', 'aria-hidden': 'true', text: m.glyph }), el('span', { text: m.label })))),
      el('button', { class: 'btn ghost block surprise', text: 'Surprise me', onClick: () => done(null) }),
    ));

    const done = (moodSay) => {
      const [len, where, who] = said;
      const tail = moodSay ? `and you wanted it ${moodSay}.` : 'and you left the mood to us.';
      ctx.finish({ weights, why: `${len}, ${where}, ${who}, ${tail}` });
    };

    step(0);
  },
};
