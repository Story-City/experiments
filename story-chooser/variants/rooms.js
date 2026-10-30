// Variant 5 · Rooms carousel. "Which room do you sleep in tonight?"
// An Instagram carousel: one hook slide, six rooms, one call-to-action slide.
// Tapping a room stands in for commenting its number. Imports nothing; talks to the shell only through ctx.

const ROOMS = [
  { key: 'rooms.library',    n: 1, title: 'The candlelit library',       sub: 'Ladders, dust and one book that is warm to the touch.',
    weights: ['cozy', 'mystery', 'mysterious', 'night', 'solo', 'calm'],
    why: 'You chose the candlelit library, so your story is quiet, close and a little bit secret.' },
  { key: 'rooms.attic',      n: 2, title: 'The attic with the telescope', sub: 'A skylight, a star chart, and something moving up there.',
    weights: ['mysterious', 'scifi', 'thoughtful', 'night', 'solo', 'calm'],
    why: 'You chose the attic with the telescope, so your story looks up, thinks hard and keeps you guessing.' },
  { key: 'rooms.greenhouse', n: 3, title: 'The overgrown greenhouse',     sub: 'Glass gone green. Everything in here is still growing.',
    weights: ['tender', 'fantasy', 'calm', 'day', 'park', 'romance'],
    why: 'You chose the overgrown greenhouse, so your story is soft, green and quietly magical.' },
  { key: 'rooms.cabin',      n: 4, title: 'The ship’s cabin',             sub: 'Brass, rope and a map with a hole burned through it.',
    weights: ['epic', 'adventure', 'heist', 'lively', 'friends', 'day'],
    why: 'You chose the ship’s cabin, so your story is big, bold and better with a crew.' },
  { key: 'rooms.diner',      n: 5, title: 'The diner booth at 2 am',      sub: 'Neon in the window, pie in the case, nobody asking questions.',
    weights: ['funny', 'romance', 'night', 'downtown', 'date', 'lively'],
    why: 'You chose the diner booth at 2 am, so your story is late, funny and a little bit flirty.' },
  { key: 'rooms.kitchen',    n: 6, title: 'The castle kitchen',           sub: 'A fire going, bread rising, and a very old recipe book.',
    weights: ['cozy', 'history', 'kids', 'playful', 'day', 'comedy'],
    why: 'You chose the castle kitchen, so your story is warm, old-fashioned and fun for the whole table.' },
];

const CSS = `
.v-rooms .ig-arrow[hidden] { display: none; }
.v-rooms .ph { font-size: 15px; font-weight: 700; color: rgba(255, 255, 255, 0.45); letter-spacing: 0.06em; text-transform: uppercase; }
.v-rooms .note { font-size: 14px; margin: 12px 0 0; }
.v-rooms .hook, .v-rooms .cta { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center;
  padding: 34px 46px 30px; font-family: "Darker Grotesque", sans-serif; color: #fff; text-align: left;
  background: radial-gradient(120% 70% at 85% 0%, rgba(0, 158, 255, 0.28), transparent 60%),
              linear-gradient(165deg, #341a74 0%, #1d0f46 48%, #0e0727 100%); }
.v-rooms .hook .brand { position: absolute; top: 16px; left: 26px; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #a79bd6; }
.v-rooms .hook { padding-left: 26px; }
.v-rooms .hook h2 { font-size: 46px; line-height: 0.96; font-weight: 900; margin: 0 0 16px; text-wrap: balance; max-width: 9em; }
.v-rooms .hook p, .v-rooms .cta p { font-size: 20px; line-height: 1.2; text-wrap: balance; color: #d5cdef; margin: 0; font-weight: 700; }
.v-rooms .hook .swipe { position: absolute; right: 22px; bottom: 22px; font-size: 14px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #a79bd6; }
.v-rooms .cta h2 { font-size: 36px; line-height: 0.98; font-weight: 900; margin: 0 0 12px; text-wrap: balance; max-width: 9em; }
.v-rooms .cta .nums { display: flex; gap: 6px; margin: 22px 0 14px; flex-wrap: wrap; }
.v-rooms .cta .nums button { width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.22); background: rgba(255, 255, 255, 0.08); color: #fff; font-weight: 900; font-size: 18px; font-family: "Darker Grotesque", sans-serif; padding: 0; }
.v-rooms .cta .nums button:active { background: var(--accent); border-color: var(--accent); }
.v-rooms .cta .tiny { font-size: 15px; color: #a79bd6; font-weight: 700; }
.v-rooms .ig-slide .cap b { max-width: 10em; }
`;

export default {
  slug: 'rooms',
  title: 'Which room do you sleep in tonight?',
  short: 'Rooms carousel',
  channel: 'instagram',
  blurb: 'Which room do you sleep in tonight? Six rooms, one pick.',

  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    ctx.root.innerHTML = '';

    const pick = (room) => {
      const weights = {};
      room.weights.forEach((t, i) => { weights[t] = i < 2 ? 2 : 1; });
      ctx.finish({ weights, why: room.why });
    };

    const hook = el('div', { class: 'hook' },
      el('div', { class: 'brand', text: 'Story City' }),
      el('h2', { text: 'Which room do you sleep in tonight?' }),
      el('p', { text: 'Swipe. Pick one. Comment the number.' }),
      el('div', { class: 'swipe', 'aria-hidden': 'true', text: 'Swipe ›' }));

    const cta = el('div', { class: 'cta' },
      el('h2', { text: 'Comment your number and we’ll tell you your story' }),
      el('div', { class: 'nums', role: 'group', 'aria-label': 'Pick a room by number' },
        ROOMS.map(r => el('button', { type: 'button', text: r.n, 'aria-label': r.title, onClick: (e) => { e.stopPropagation(); pick(r); } }))),
      el('span', { class: 'tiny', text: 'or tap a room' }));

    const slides = [
      { node: hook, cls: 'hook-slide' },
      ...ROOMS.map(r => ({ node: ctx.photoEl(r.key, "Photo: " + r.title.replace(/^The /, "")), n: r.n, title: r.title, sub: r.sub, onPick: () => pick(r) })),
      { node: cta, cls: 'cta-slide' },
    ];

    const post = ctx.carousel(slides, {
      handle: 'storycityapp',
      likes: '312 likes',
      label: 'Which room do you sleep in tonight?',
      caption: 'Six rooms. One of them is yours tonight. Swipe through, pick the one you could actually fall asleep in, and comment the number.<br>We’ll reply with the story that starts there. Then you go for a walk and find out how it ends. 🔮<br><span class="more">#storycity #walkthestory #yegwalks #yycwalks</span>',
    });

    ctx.root.append(el('div', { class: 'v-rooms' },
      el('p', { class: 'muted note', text: 'Carousel post. Tap a slide to simulate replying with its number.' }),
      post,
      el('p', { class: 'muted note center', text: 'Every reply gets one story, chosen from the same tags as the app.' }),
    ));
  },
};
