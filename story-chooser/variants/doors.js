// Variant 6 · Real doors. "Six doors. Which one do you knock on?"
// An Instagram carousel: one hook slide, six real street doors, one call-to-action slide.
// Tapping a door stands in for commenting its number. Imports nothing; talks to the shell only through ctx.

const DOORS = [
  { key: 'doors.red',    n: 1, title: 'The red door with the brass knocker',         sub: 'Somebody in there is expecting you. Probably.',
    weights: ['adventure', 'lively', 'playful', 'friends', 'day', 'downtown'],
    why: 'You knocked on the red door, so your story is bright, busy and best with company.' },
  { key: 'doors.blue',   n: 2, title: 'The blue door nobody has painted in years',   sub: 'The paint is peeling. The light inside is on.',
    weights: ['eerie', 'mystery', 'spooky', 'night', 'solo', 'neighbourhood'],
    why: 'You knocked on the blue door, so your story is a little eerie, a little lonely and very hard to put down.' },
  { key: 'doors.arched', n: 3, title: 'The arched door in the old stone wall',       sub: 'Older than the street. Older than the city, maybe.',
    weights: ['epic', 'fantasy', 'history', 'long', 'solo', 'day'],
    why: 'You knocked on the arched door, so your story is old, grand and worth the long walk.' },
  { key: 'doors.black',  n: 4, title: 'The black door with a lantern beside it',     sub: 'No number. No name. Just the lantern, lit for you.',
    weights: ['mysterious', 'night', 'solo', 'calm', 'mystery', 'downtown'],
    why: 'You knocked on the black door, so your story is quiet, nocturnal and full of secrets.' },
  { key: 'doors.shop',   n: 5, title: 'The shop door with a bell',                   sub: 'Ding. Someone looks up from the counter and smiles.',
    weights: ['cozy', 'comedy', 'cafe', 'funny', 'day', 'date'],
    why: 'You knocked on the shop door, so your story is warm, funny and happiest over a coffee.' },
  { key: 'doors.garden', n: 6, title: 'The gate in the ivy wall',                    sub: 'You can hear water on the other side. And laughing.',
    weights: ['tender', 'park', 'calm', 'kids', 'romance', 'day'],
    why: 'You opened the gate in the ivy wall, so your story is gentle, green and good for small legs too.' },
];

const CSS = `
.v-doors .ig-arrow[hidden] { display: none; }
.v-doors .ph { font-size: 15px; font-weight: 700; color: rgba(255, 255, 255, 0.45); letter-spacing: 0.06em; text-transform: uppercase; }
.v-doors .note { font-size: 14px; margin: 12px 0 0; }
.v-doors .hook, .v-doors .cta { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center;
  padding: 34px 46px 30px; font-family: "Darker Grotesque", sans-serif; color: #fff; text-align: left;
  background: radial-gradient(110% 60% at 10% 100%, rgba(255, 179, 71, 0.22), transparent 60%),
              linear-gradient(165deg, #341a74 0%, #1d0f46 48%, #0e0727 100%); }
.v-doors .hook .brand { position: absolute; top: 16px; left: 26px; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #a79bd6; }
.v-doors .hook { padding-left: 26px; }
.v-doors .hook h2 { font-size: 46px; line-height: 0.96; font-weight: 900; margin: 0 0 16px; text-wrap: balance; max-width: 8em; }
.v-doors .hook p, .v-doors .cta p { font-size: 20px; line-height: 1.2; text-wrap: balance; color: #d5cdef; margin: 0; font-weight: 700; }
.v-doors .hook .swipe { position: absolute; right: 22px; bottom: 22px; font-size: 14px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #a79bd6; }
.v-doors .cta h2 { font-size: 36px; line-height: 0.98; font-weight: 900; margin: 0 0 12px; text-wrap: balance; max-width: 9em; }
.v-doors .cta .nums { display: flex; gap: 6px; margin: 22px 0 14px; flex-wrap: wrap; }
.v-doors .cta .nums button { width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.22); background: rgba(255, 255, 255, 0.08); color: #fff; font-weight: 900; font-size: 18px; font-family: "Darker Grotesque", sans-serif; padding: 0; }
.v-doors .cta .nums button:active { background: var(--accent); border-color: var(--accent); }
.v-doors .cta .tiny { font-size: 15px; color: #a79bd6; font-weight: 700; }
.v-doors .ig-slide .cap b { font-size: 27px; max-width: 11em; }
`;

export default {
  slug: 'doors',
  title: 'Six doors. Which one do you knock on?',
  short: 'Real doors',
  channel: 'instagram',
  blurb: 'Six doors from real streets. Which one do you knock on?',

  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    ctx.root.innerHTML = '';

    const pick = (door) => {
      const weights = {};
      door.weights.forEach((t, i) => { weights[t] = i < 2 ? 2 : 1; });
      ctx.finish({ weights, why: door.why });
    };

    const hook = el('div', { class: 'hook' },
      el('div', { class: 'brand', text: 'Story City' }),
      el('h2', { text: 'Six doors. Which one do you knock on?' }),
      el('p', { text: 'Swipe. Pick one. Comment the number.' }),
      el('div', { class: 'swipe', 'aria-hidden': 'true', text: 'Swipe ›' }));

    const cta = el('div', { class: 'cta' },
      el('h2', { text: 'Comment your number and we’ll tell you what’s behind it' }),
      el('div', { class: 'nums', role: 'group', 'aria-label': 'Pick a door by number' },
        DOORS.map(d => el('button', { type: 'button', text: d.n, 'aria-label': d.title, onClick: (e) => { e.stopPropagation(); pick(d); } }))),
      el('span', { class: 'tiny', text: 'or tap a door' }));

    const slides = [
      { node: hook, cls: 'hook-slide' },
      ...DOORS.map(d => ({ node: ctx.photoEl(d.key, "Photo: " + d.title.replace(/^The /, "")), n: d.n, title: d.title, sub: d.sub, onPick: () => pick(d) })),
      { node: cta, cls: 'cta-slide' },
    ];

    const post = ctx.carousel(slides, {
      handle: 'storycityapp',
      likes: '428 likes',
      label: 'Six doors. Which one do you knock on?',
      caption: 'These doors are all real. We walked past every one of them this week. 🚪<br>Swipe, pick the one you’d actually knock on, and comment the number. We’ll reply with the story waiting behind it.<br><span class="more">#storycity #yeg #yyc #walkthestory</span>',
    });

    ctx.root.append(el('div', { class: 'v-doors' },
      el('p', { class: 'muted note', text: 'Carousel post. Tap a slide to simulate replying with its number.' }),
      post,
      el('p', { class: 'muted note center', text: 'Mock-up photos. The real post uses doors photographed in Edmonton and Calgary.' }),
    ));
  },
};
