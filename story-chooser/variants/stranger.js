// #20 A stranger interviews you. A one-minute chat thread in the Story City reader style.
// Five beats: a stranger texts you about a key, asks four things, then sends you a story.
// The chooser doubles as a demo of the reader (chat bubbles, typing dots, reply buttons).
// Imports nothing; talks to the shell only through ctx.

const BEATS = [
  {
    lines: ['You dropped this.', 'It’s a key. Old. Heavy. You’ve never seen it before.'],
    replies: [
      { t: 'That’s not mine',        w: { mystery: 2, thoughtful: 1 },   echo: 'said the key wasn’t yours' },
      { t: 'Where did you find it?', w: { adventure: 2, lively: 1 },     echo: 'asked where the key came from' },
      { t: '…keep talking',          w: { eerie: 2, mysterious: 1 },     echo: 'told the stranger to keep talking' },
    ],
  },
  {
    lines: ['It only works at certain hours.', 'When are you usually out walking?'],
    replies: [
      { t: 'Mornings',        w: { day: 2, calm: 1 },   echo: 'walk in the mornings' },
      { t: 'After dark',      w: { night: 2, eerie: 1 }, echo: 'walk after dark' },
      { t: 'Whenever I can',  w: { quick: 2 },           echo: 'walk whenever you can' },
    ],
  },
  {
    lines: ['Some doors need more than one pair of hands.', 'Who’s walking with you?'],
    replies: [
      { t: 'Just me',       w: { solo: 2 },                echo: 'walk on your own' },
      { t: 'With my kids',  w: { kids: 2, playful: 1 },    echo: 'bring your kids' },
      { t: 'With friends',  w: { friends: 2, funny: 1 },   echo: 'bring friends' },
    ],
  },
  {
    lines: ['Last question.', 'When you open a door you shouldn’t, what do you hope is behind it?'],
    replies: [
      { t: 'Something wonderful', w: { fantasy: 2, tender: 1, cozy: 1 }, echo: 'hope for something wonderful' },
      { t: 'Something terrible',  w: { spooky: 2, eerie: 1 },            echo: 'hope for something terrible' },
      { t: 'Something funny',     w: { comedy: 2, funny: 1 },            echo: 'hope for something funny' },
    ],
  },
];

// Beat 5: the stranger's reaction echoes the player's answers.
const REACT = {
  time: ['A morning walker. Good. The light shows more than people think.', 'After dark, then. The best doors only open then.', 'Whenever you can. Even better. It won’t wait long.'],
  company: ['And alone. You’ll hear everything.', 'And the kids will spot what grown-ups miss.', 'And friends make braver choices.'],
};

const CSS = `
.v-stranger { --mine: linear-gradient(170deg, var(--accent), var(--accent-deep)); margin: 0 -16px; }
.v-stranger .chat-head { position: sticky; top: 58px; z-index: 4; display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: rgba(23, 12, 53, 0.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.v-stranger .avatar { width: 40px; height: 40px; border-radius: 50%; flex: none; display: grid; place-items: center; font-weight: 900; font-size: 20px; color: #fff; background: radial-gradient(circle at 30% 25%, #6d5bd0, #2a1d63 70%); border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 0 0 3px rgba(179,107,255,0.18); }
.v-stranger .who { min-width: 0; flex: 1; line-height: 1.1; }
.v-stranger .name { font-weight: 800; font-size: 18px; }
.v-stranger .status { font-size: 14px; color: var(--muted); }
.v-stranger .status::before { content: ""; display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--gem); margin-right: 5px; vertical-align: 1px; }
.v-stranger .status.typing { color: #6cc4ff; }
.v-stranger .status.typing::before { background: #6cc4ff; }
.v-stranger .pips { display: flex; gap: 4px; flex: none; }
.v-stranger .pips i { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.18); }
.v-stranger .pips i.on { background: var(--accent); }
.v-stranger .skip { background: none; border: 0; color: var(--muted); font-weight: 800; font-size: 15px; padding: 8px 0 8px 8px; min-height: 36px; text-decoration: underline; text-underline-offset: 3px; flex: none; }

.v-stranger .thread { display: flex; flex-direction: column; gap: 3px; padding: 14px 12px 8px; }
.v-stranger .row, .v-stranger .choices { scroll-margin-bottom: 28px; }
.v-stranger .system { align-self: center; margin: 10px 0 8px; font-size: 14px; color: var(--muted); padding: 3px 12px; border-radius: 999px; background: rgba(255,255,255,0.05); text-align: center; text-wrap: balance; }
.v-stranger .system.sent { color: var(--story); font-weight: 800; background: rgba(255,179,71,0.1); }
.v-stranger .row { display: flex; align-items: flex-end; gap: 8px; max-width: 100%; }
.v-stranger .row.them { padding-right: 44px; }
.v-stranger .row.me { justify-content: flex-end; padding-left: 64px; }
.v-stranger .row.gap { margin-top: 10px; }
.v-stranger .mini { width: 26px; height: 26px; border-radius: 50%; flex: none; display: grid; place-items: center; font-size: 13px; font-weight: 900; background: radial-gradient(circle at 30% 25%, #6d5bd0, #2a1d63 70%); visibility: hidden; }
.v-stranger .row.last .mini { visibility: visible; }
.v-stranger .bubble { padding: 7px 13px 8px; border-radius: 20px; max-width: 100%; font-size: 19px; line-height: 1.22; overflow-wrap: break-word; text-wrap: pretty; animation: vs-pop 0.34s cubic-bezier(0.2, 1.4, 0.4, 1) both; }
.v-stranger .them .bubble { background: var(--raised); border: 1px solid var(--line); transform-origin: left bottom; }
.v-stranger .me .bubble { background: var(--mine); color: #fff; font-weight: 700; transform-origin: right bottom; }
.v-stranger .row.them.last .bubble { border-bottom-left-radius: 6px; }
.v-stranger .row.me .bubble { border-bottom-right-radius: 6px; }
.v-stranger .typing { display: flex; gap: 5px; padding: 12px 14px; }
.v-stranger .typing i { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); animation: vs-dot 1.2s infinite ease-in-out; }
.v-stranger .typing i:nth-child(2) { animation-delay: 0.15s; }
.v-stranger .typing i:nth-child(3) { animation-delay: 0.3s; }

.v-stranger .choices { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; padding: 6px 12px 4px; }
.v-stranger .reply { max-width: 88%; text-align: right; padding: 10px 16px; min-height: 44px; border-radius: 20px; border: 1px solid rgba(0,158,255,0.55); background: rgba(0,158,255,0.1); color: #fff; font-size: 18px; font-weight: 700; line-height: 1.15; animation: vs-rise 0.36s cubic-bezier(0.2, 1.2, 0.4, 1) both; }
.v-stranger .reply:nth-child(2) { animation-delay: 0.06s; }
.v-stranger .reply:nth-child(3) { animation-delay: 0.12s; }
.v-stranger .reply:active { transform: scale(0.97); background: rgba(0,158,255,0.25); }

.v-stranger .story { display: flex; gap: 12px; align-items: center; width: 100%; max-width: 280px; padding: 8px; border-radius: 20px; border: 1px solid rgba(255,179,71,0.45); background: var(--raised-2); color: var(--text); text-align: left; animation: vs-pop 0.4s cubic-bezier(0.2, 1.4, 0.4, 1) both; box-shadow: 0 0 0 0 rgba(255,179,71,0.4); }
.v-stranger .story:not(:disabled) { animation: vs-pop 0.4s cubic-bezier(0.2, 1.4, 0.4, 1) both, vs-glow 2.4s 0.6s ease-in-out infinite; }
.v-stranger .story .cv { width: 64px; height: 84px; border-radius: 12px; overflow: hidden; flex: none; position: relative; background: linear-gradient(135deg, #6d5bd0, #170c35 75%); }
.v-stranger .story .cv img { width: 100%; height: 100%; object-fit: cover; filter: blur(7px) saturate(1.2); transform: scale(1.25); }
.v-stranger .story .cv::after { content: "?"; position: absolute; inset: 0; display: grid; place-items: center; font-weight: 900; font-size: 30px; color: rgba(255,255,255,0.85); text-shadow: 0 2px 8px rgba(0,0,0,0.6); }
.v-stranger .story .tx { min-width: 0; line-height: 1.1; }
.v-stranger .story small { display: block; font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--story); margin-bottom: 3px; }
.v-stranger .story b { display: block; font-size: 22px; font-weight: 900; line-height: 1.02; text-wrap: balance; }
.v-stranger .story span { display: block; font-size: 15px; color: var(--muted); margin-top: 5px; }

.v-stranger .ig-note { margin: 18px 16px 0; padding-top: 12px; border-top: 1px solid var(--line); color: var(--muted); font-size: 15px; line-height: 1.25; text-wrap: pretty; }

@keyframes vs-pop { from { transform: scale(0.6) translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes vs-rise { from { transform: translateY(14px); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes vs-dot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.45; } 30% { transform: translateY(-4px); opacity: 1; } }
@keyframes vs-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,179,71,0); } 50% { box-shadow: 0 0 0 6px rgba(255,179,71,0.18); } }
@media (prefers-reduced-motion: reduce) {
  .v-stranger .bubble, .v-stranger .reply, .v-stranger .story, .v-stranger .story:not(:disabled), .v-stranger .typing i { animation: none; }
}
`;

export default {
  slug: 'stranger',
  title: 'A stranger interviews you',
  short: 'A stranger interviews you',
  channel: 'app',
  blurb: 'A one-minute chat. Your replies pick the story.',

  mount(ctx) {
    const { el, root } = ctx;
    ctx.style(CSS);
    const known = new Set(Object.values(ctx.tokens).flat());
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const weights = {};
    const picks = [];   // index of the reply chosen at each beat
    let alive = true;   // goes false once we leave the chat (skip or finish)

    const add = (w) => { for (const [t, n] of Object.entries(w)) if (known.has(t)) weights[t] = (weights[t] || 0) + n; };
    const wait = (ms) => new Promise(r => setTimeout(r, reduced ? 0 : ms));
    const nowidow = (t) => t.replace(/ (\S+)$/, '\u00a0$1');   // glue the last two words so no word sits alone
    const jitter = (lo, hi) => lo + Math.round(Math.random() * (hi - lo));

    const status = el('div', { class: 'status', text: 'online' });
    const pips = el('div', { class: 'pips', 'aria-label': 'Progress' }, BEATS.map(() => el('i')), el('i'));
    const skip = el('button', { class: 'skip', text: 'Skip the chat', onClick: () => done(true) });
    const thread = el('div', { class: 'thread', role: 'log', 'aria-live': 'polite', 'aria-label': 'Chat with an unknown number' });
    const wrap = el('div', { class: 'v-stranger' },
      el('div', { class: 'chat-head' },
        el('div', { class: 'avatar', 'aria-hidden': 'true', text: '?' }),
        el('div', { class: 'who' }, el('div', { class: 'name', text: 'Unknown number' }), status),
        pips, skip),
      thread,
      el('p', { class: 'ig-note', text: 'Instagram version: the same five beats as Story slides with poll stickers.' }),
    );
    root.append(wrap);

    const setPip = (i) => [...pips.children].forEach((p, j) => p.classList.toggle('on', j <= i));
    const scrollTo = (node) => node.scrollIntoView({ block: 'end', behavior: reduced ? 'auto' : 'smooth' });

    // Incoming rows group: only the last row in a run shows the mini avatar and the tail.
    let lastThem = null;
    const them = (child, gap) => {
      if (lastThem) lastThem.classList.remove('last');
      const row = el('div', { class: 'row them last' + (gap ? ' gap' : '') }, el('div', { class: 'mini', 'aria-hidden': 'true', text: '?' }), child);
      thread.append(row); lastThem = row; return row;
    };
    const system = (text, cls = '') => { const n = el('div', { class: ('system ' + cls).trim(), text }); thread.append(n); return n; };

    async function say(text, first) {
      if (!alive) return;
      let gap = first;
      if (!reduced) {
        status.textContent = 'typing…'; status.classList.add('typing');
        const prev = lastThem;
        const dots = them(el('div', { class: 'bubble typing', 'aria-label': 'typing' }, el('i'), el('i'), el('i')), gap);
        scrollTo(dots);
        await wait(jitter(500, 900));
        if (!alive) return;
        dots.remove(); lastThem = prev;
        if (prev) prev.classList.add('last');
      }
      status.textContent = 'online'; status.classList.remove('typing');
      const row = them(el('div', { class: 'bubble', text: nowidow(text) }), gap);
      scrollTo(row);
      await wait(jitter(180, 320));
    }

    function ask(replies) {
      return new Promise(resolve => {
        if (!alive) return;
        const box = el('div', { class: 'choices', role: 'group', 'aria-label': 'Your reply' },
          replies.map((r, i) => el('button', { class: 'reply', text: r.t, onClick: () => {
            box.remove();
            thread.append(el('div', { class: 'row me gap' }, el('div', { class: 'bubble', text: nowidow(r.t) })));
            lastThem = null;
            resolve(i);
          } })));
        thread.after(box);
        // keep the reply buttons directly under the thread
        requestAnimationFrame(() => scrollTo(box));
      });
    }

    // Echo up to three of the player's own replies: the key, when they walk, what they hope for.
    function why() {
      const e = [0, 1, 3].map(i => picks[i] != null ? BEATS[i].replies[picks[i]].echo : null).filter(Boolean);
      if (!e.length) return 'You skipped the chat, so the stranger guessed from the key alone.';
      const parts = e.map((x, i) => (i === 0 ? 'You ' : 'you ') + x);
      return (parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]) + '.';
    }

    function done(skipped) {
      if (!alive && skipped) return;
      alive = false;
      ctx.finish({ weights: { ...weights }, why: why(), headline: skipped ? 'The stranger guessed' : 'The stranger chose' });
    }

    async function run() {
      system('Today · a new message');
      for (let b = 0; b < BEATS.length; b++) {
        setPip(b);
        for (let i = 0; i < BEATS[b].lines.length; i++) await say(BEATS[b].lines[i], i === 0 && b > 0);
        if (!alive) return;
        const p = await ask(BEATS[b].replies);
        picks[b] = p; add(BEATS[b].replies[p].w);
        await wait(250);
      }
      setPip(BEATS.length);
      const t = picks[1], c = picks[2];
      await say(REACT.time[t], true);
      await say(REACT.company[c]);
      await say('Then I know exactly which door this opens.');
      if (!alive) return;
      await wait(400);
      if (!alive) return;
      system('The stranger sent you a story', 'sent');
      const best = ctx.score(weights)[0].story;
      const card = el('button', { class: 'story', 'aria-label': `Open the story: ${best.name}`, onClick: () => done(false) },
        el('div', { class: 'cv' }, best.cover ? el('img', { src: best.cover, alt: '', draggable: 'false' }) : null),
        el('div', { class: 'tx' }, el('small', { text: 'A story for you' }), el('b', { text: nowidow(best.name) }), el('span', { text: 'Tap to open' })));
      const row = them(card, false);
      skip.hidden = true;
      status.textContent = 'online';
      scrollTo(row);
    }

    run();
  },
};
