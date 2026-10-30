// Fork in the Road: seven this-or-that taps, each a tiny story moment. App channel.
// Each tap adds +2 to its first token and +1 to the other two. No thinking allowed.

const FORKS = [
  [{ label: 'A letter sealed with wax', glyph: '✉️', pick: 'the sealed letter', tokens: ['history', 'mysterious', 'calm'] },
   { label: 'A text from an unknown number', glyph: '📱', pick: 'the text from nobody', tokens: ['scifi', 'eerie', 'lively'] }],
  [{ label: 'Follow the footsteps', glyph: '👣', pick: 'the footsteps', tokens: ['mystery', 'eerie', 'solo'] },
   { label: 'Follow the music', glyph: '🎶', pick: 'the music', tokens: ['playful', 'funny', 'friends'] }],
  [{ label: 'Lantern', glyph: '🏮', pick: 'the lantern', tokens: ['cozy', 'fantasy', 'night'] },
   { label: 'Flashlight', glyph: '🔦', pick: 'the flashlight', tokens: ['adventure', 'scifi', 'lively'] }],
  [{ label: 'The door is locked', glyph: '🔒', pick: 'the locked door', tokens: ['mystery', 'heist', 'thoughtful'] },
   { label: 'The door is already open', glyph: '🚪', pick: 'the open door', tokens: ['spooky', 'eerie', 'night'] }],
  [{ label: 'Tea from a stranger', glyph: '🍵', pick: 'the stranger’s tea', tokens: ['cozy', 'cafe', 'tender'] },
   { label: 'A sword from a stranger', glyph: '⚔️', pick: 'the stranger’s sword', tokens: ['epic', 'adventure', 'kids'] }],
  [{ label: 'Fog', glyph: '🌫️', pick: 'the fog', tokens: ['eerie', 'mysterious', 'night'] },
   { label: 'Moonlight', glyph: '🌙', pick: 'the moonlight', tokens: ['romance', 'tender', 'calm'] }],
  [{ label: 'A lost key', glyph: '🗝️', pick: 'the lost key', tokens: ['mystery', 'downtown', 'solo'] },
   { label: 'A found map', glyph: '🗺️', pick: 'the found map', tokens: ['adventure', 'park', 'friends'] }],
];

const CSS = `
.v-fork { display: flex; flex-direction: column; min-height: calc(100dvh - 64px); }
.v-fork .intro { flex: 1; display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 24px 0 48px; }
.v-fork .intro .mark { font-size: 44px; line-height: 1; margin-bottom: 14px; }
.v-fork .intro h2 { font-size: 40px; line-height: 0.98; font-weight: 900; margin: 0 0 10px; text-wrap: balance; }
.v-fork .intro p { font-size: 20px; margin: 0 auto 26px; max-width: 26ch; text-wrap: balance; }
.v-fork .intro .btn { align-self: center; min-width: 200px; }
.v-fork .screen { animation: v-fork-in 140ms ease-out both; }
@keyframes v-fork-in { from { opacity: 0; translate: 0 8px; } to { opacity: 1; translate: 0 0; } }
.v-fork .count { font-size: 13px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-top: 6px; }
.v-fork .forks { display: flex; flex-direction: column; gap: 10px; }
.v-fork .panel { position: relative; width: 100%; min-height: clamp(176px, 30dvh, 290px); border-radius: 22px; border: 1px solid var(--line);
  background: var(--raised); color: var(--text); padding: 18px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  text-align: center; transition: scale 90ms ease-out, background 90ms ease-out; -webkit-tap-highlight-color: transparent; }
.v-fork .panel.a { background: linear-gradient(160deg, rgba(0, 158, 255, 0.16), var(--raised) 60%); }
.v-fork .panel.b { background: linear-gradient(340deg, rgba(179, 107, 255, 0.18), var(--raised) 60%); }
.v-fork .panel:active { scale: 0.975; background: var(--raised-2); }
.v-fork .panel .glyph { font-size: 44px; line-height: 1; filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35)); }
.v-fork .panel .lbl { font-size: 32px; line-height: 0.98; font-weight: 900; max-width: 11ch; text-wrap: balance; }
.v-fork .or { position: relative; z-index: 1; margin: -21px auto; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center;
  background: var(--bg); border: 1px solid var(--line); font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.v-fork .gut { text-align: center; color: var(--muted); font-size: 14px; margin: 14px 0 0; }
@media (max-height: 700px) { .v-fork .panel { min-height: 150px; } .v-fork .panel .glyph { font-size: 34px; } .v-fork .panel .lbl { font-size: 28px; } }
`;

export default {
  slug: 'fork',
  title: 'Fork in the Road',
  short: 'Fork in the Road',
  channel: 'app',
  blurb: 'Seven this-or-that taps, each a tiny story moment.',
  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    const weights = {};
    const picks = [];
    const wrap = el('div', { class: 'v-fork' });
    ctx.root.append(wrap);

    const show = (node) => { wrap.innerHTML = ''; wrap.append(node); window.scrollTo(0, 0); };

    const intro = () => show(el('div', { class: 'intro screen' },
      el('div', { class: 'mark', 'aria-hidden': 'true', text: '⑂' }),
      el('h2', { text: 'Seven quick forks' }),
      el('p', { class: 'muted', text: 'No thinking allowed. Tap what pulls you.' }),
      el('button', { class: 'btn primary', text: 'Start', onClick: () => fork(0) }),
    ));

    const fork = (i) => {
      if (i >= FORKS.length) return done();
      const [a, b] = FORKS[i];
      const panel = (opt, cls) => el('button', { class: 'panel ' + cls, 'aria-label': opt.label, onClick: () => choose(i, opt) },
        el('span', { class: 'glyph', 'aria-hidden': 'true', text: opt.glyph }),
        el('span', { class: 'lbl', text: opt.label }));
      show(el('div', { class: 'screen' },
        el('div', { class: 'progress', 'aria-hidden': 'true' }, FORKS.map((_, j) => el('i', { class: j <= i ? 'on' : '' }))),
        el('div', { class: 'forks' }, panel(a, 'a'), el('span', { class: 'or', 'aria-hidden': 'true', text: 'or' }), panel(b, 'b')),
        el('p', { class: 'gut', text: 'Go with your gut.' }),
      ));
    };

    const choose = (i, opt) => {
      picks.push(opt);
      opt.tokens.forEach((t, k) => { weights[t] = (weights[t] || 0) + (k === 0 ? 2 : 1); });
      fork(i + 1);
    };

    const done = () => {
      // Name the picks that pulled the winner closest, so the why-line feels earned.
      const best = ctx.score(weights)[0];
      const tags = new Set(best ? best.story.tags : []);
      const ranked = picks.map((p, i) => ({ p, i, hit: p.tokens.filter(t => tags.has(t)).length }))
        .sort((x, y) => (y.hit - x.hit) || (x.i - y.i)).slice(0, 3).sort((x, y) => x.i - y.i).map(x => x.p.pick);
      const names = ranked.length > 1 ? ranked.slice(0, -1).join(', ') + ' and ' + ranked[ranked.length - 1] : ranked[0];
      ctx.finish({ weights, why: `You took ${names}, and this is where they lead.` });
    };

    intro();
  },
};
