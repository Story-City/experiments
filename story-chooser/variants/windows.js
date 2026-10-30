// Variant 7 · Lit windows. "It's late. One window is still lit. What is happening inside?"
// An Instagram carousel: one hook slide, four lit windows (each slide is a guess), one call-to-action slide.
// Tapping a window stands in for commenting its number. Imports nothing; talks to the shell only through ctx.

const WINDOWS = [
  { key: 'windows.candle',  n: 1, title: 'Someone is reading a letter they shouldn’t', sub: 'One candle. One page. One very steady hand.',
    weights: ['eerie', 'mystery', 'mysterious', 'solo', 'night', 'calm'],
    why: 'You guessed the letter nobody was meant to read, so your story is hushed, strange and full of secrets.' },
  { key: 'windows.neon',    n: 2, title: 'A first date that is going badly',           sub: 'Pink neon, two menus, and a silence you can hear from here.',
    weights: ['funny', 'romance', 'comedy', 'downtown', 'night', 'date'],
    why: 'You guessed the first date going badly, so your story is funny, flirty and a bit of a mess in the best way.' },
  { key: 'windows.curtain', n: 3, title: 'Someone is waiting for a signal',            sub: 'The curtain twitches every time a car goes by.',
    weights: ['mysterious', 'spooky', 'mystery', 'friends', 'night', 'lively'],
    why: 'You guessed the signal nobody else can see, so your story is tense, shadowy and better with someone watching your back.' },
  { key: 'windows.attic',   n: 4, title: 'A kid who should be asleep is drawing a map', sub: 'Crayons on the floor. An X where the treasure goes.',
    weights: ['thoughtful', 'fantasy', 'playful', 'kids', 'calm', 'quick'],
    why: 'You guessed the kid drawing a map past bedtime, so your story is playful, dreamy and quick enough to finish before lights out.' },
];

const CSS = `
.v-windows .ig-arrow[hidden] { display: none; }
.v-windows .ph { font-size: 15px; font-weight: 700; color: rgba(255, 255, 255, 0.45); letter-spacing: 0.06em; text-transform: uppercase; }
.v-windows .note { font-size: 14px; margin: 12px 0 0; }
.v-windows .hook, .v-windows .cta { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center;
  padding: 34px 46px 30px; font-family: "Darker Grotesque", sans-serif; color: #fff; text-align: left;
  background: radial-gradient(60% 40% at 78% 38%, rgba(255, 196, 96, 0.34), transparent 70%),
              linear-gradient(170deg, #1f1150 0%, #130a33 50%, #07041a 100%); }
.v-windows .hook .brand { position: absolute; top: 16px; left: 26px; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #a79bd6; }
.v-windows .hook { padding-left: 26px; }
.v-windows .hook .late { font-size: 22px; font-weight: 800; color: #ffc860; margin: 0 0 10px; letter-spacing: 0.02em; }
.v-windows .hook h2 { font-size: 36px; line-height: 0.96; font-weight: 900; margin: 0 0 16px; text-wrap: balance; }
.v-windows .hook p, .v-windows .cta p { font-size: 20px; line-height: 1.2; text-wrap: balance; color: #d5cdef; margin: 0; font-weight: 700; }
.v-windows .hook .swipe { position: absolute; right: 22px; bottom: 22px; font-size: 14px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #a79bd6; }
.v-windows .cta h2 { font-size: 36px; line-height: 0.98; font-weight: 900; margin: 0 0 12px; text-wrap: balance; max-width: 9em; }
.v-windows .cta .nums { display: flex; gap: 6px; margin: 22px 0 14px; flex-wrap: wrap; }
.v-windows .cta .nums button { width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.22); background: rgba(255, 255, 255, 0.08); color: #fff; font-weight: 900; font-size: 18px; font-family: "Darker Grotesque", sans-serif; padding: 0; }
.v-windows .cta .nums button:active { background: var(--accent); border-color: var(--accent); }
.v-windows .cta .tiny { font-size: 15px; color: #a79bd6; font-weight: 700; }
.v-windows .ig-slide .cap { padding-top: 90px; }
.v-windows .ig-slide .cap .guess { display: block; font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #ffc860; margin-bottom: 4px; }
.v-windows .ig-slide .cap b { font-size: 27px; max-width: 11em; }
`;

export default {
  slug: 'windows',
  title: 'It’s late. One window is still lit. What is happening inside?',
  short: 'Lit windows',
  channel: 'instagram',
  blurb: 'Four windows glowing at night. What is happening inside?',

  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    ctx.root.innerHTML = '';

    const pick = (w) => {
      const weights = {};
      w.weights.forEach((t, i) => { weights[t] = i < 2 ? 2 : 1; });
      ctx.finish({ weights, why: w.why });
    };

    const hook = el('div', { class: 'hook' },
      el('div', { class: 'brand', text: 'Story City' }),
      el('p', { class: 'late', text: 'It’s late. One window is still lit.' }),
      el('h2', { text: 'What is happening inside?' }),
      el('p', { text: 'Swipe. Pick your guess. Comment the number.' }),
      el('div', { class: 'swipe', 'aria-hidden': 'true', text: 'Swipe ›' }));

    const cta = el('div', { class: 'cta' },
      el('h2', { text: 'Comment your number and we’ll tell you your story' }),
      el('div', { class: 'nums', role: 'group', 'aria-label': 'Pick a guess by number' },
        WINDOWS.map(w => el('button', { type: 'button', text: w.n, 'aria-label': w.title, onClick: (e) => { e.stopPropagation(); pick(w); } }))),
      el('span', { class: 'tiny', text: 'or tap a window' }));

    const slides = [
      { node: hook, cls: 'hook-slide' },
      ...WINDOWS.map(w => ({ node: ctx.photoEl(w.key, "Photo: " + w.key.split(".").pop() + " window"), n: w.n, title: w.title, sub: w.sub, onPick: () => pick(w) })),
      { node: cta, cls: 'cta-slide' },
    ];

    const post = ctx.carousel(slides, {
      handle: 'storycityapp',
      likes: '519 likes',
      label: 'It’s late. One window is still lit. What is happening inside?',
      caption: 'It’s past midnight and one window on the street is still glowing. 🕯️ Four guesses. Swipe, pick the one you believe, and comment the number.<br>We’ll reply with the story that starts behind that window. Bring a jacket.<br><span class="more">#storycity #latenightwalks #walkthestory</span>',
    });

    // The eyebrow "Your guess" goes above the title on each window slide.
    post.querySelectorAll('.ig-slide.pickable .cap').forEach(cap => cap.prepend(el('span', { class: 'guess', text: 'Your guess' })));

    ctx.root.append(el('div', { class: 'v-windows' },
      el('p', { class: 'muted note', text: 'Carousel post. Tap a slide to simulate replying with its number.' }),
      post,
      el('p', { class: 'muted note center', text: 'Mock-up photos. The real post uses windows photographed on real streets at night.' }),
    ));
  },
};
