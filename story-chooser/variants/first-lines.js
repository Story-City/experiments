// First lines: five opening sentences in an Instagram carousel, no titles, no covers. Instagram channel.
// The one you can't put down is the story you start.

const LINES = [
  { id: 'summons',     line: 'The envelope has your name on it, but you never told anyone you’d be here.' },
  { id: 'knight',      line: 'The man in armour at the bus stop looks you up and down, and sighs.' },
  { id: 'alice',       line: 'You’ve walked this street a thousand times, and it has never had a white rabbit.' },
  { id: 'frightnight', line: 'Your first night on the job, and the tour group is already one person too many.' },
  { id: 'spring',      line: 'The river has been listening to you for years. Today it finally says something back.' },
];

const SKINS = [
  'linear-gradient(160deg, #2a1a5e 0%, #170c35 55%, #0b0620 100%)',
  'linear-gradient(200deg, #0b2a4a 0%, #170c35 60%, #0a0518 100%)',
  'linear-gradient(150deg, #3a1a4a 0%, #1c0f3a 55%, #07060f 100%)',
  'linear-gradient(170deg, #0f2f2a 0%, #15123a 55%, #06040f 100%)',
  'linear-gradient(190deg, #3b2412 0%, #1a1040 50%, #07060f 100%)',
];

const CSS = `
.v-first-lines .card { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;
  padding: 56px 26px 36px; font-family: "Darker Grotesque", -apple-system, system-ui, sans-serif; color: #fff; position: relative; }
.v-first-lines .card::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(120% 70% at 50% 110%, rgba(0, 0, 0, 0.45), transparent 60%); }
.v-first-lines .card > * { position: relative; z-index: 1; }
.v-first-lines .hook { background: linear-gradient(180deg, #1b0f45, #07060f); }
.v-first-lines .hook .eyebrow { font-size: 13px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #ff8fc0; margin-bottom: 14px; }
.v-first-lines .hook h3 { font-size: 40px; line-height: 0.98; font-weight: 900; margin: 0 0 18px; text-wrap: balance; max-width: 12ch; }
.v-first-lines .hook .swipe { font-size: 16px; font-weight: 700; color: #a8a8a8; }
.v-first-lines .line { font-size: 34px; line-height: 1.02; font-weight: 800; margin: 0; text-wrap: balance; max-width: 15ch; }
.v-first-lines .line::before { content: "“"; color: #ff8fc0; }
.v-first-lines .line::after { content: "”"; color: #ff8fc0; }
.v-first-lines .end { background: linear-gradient(180deg, #07060f, #1b0f45); }
.v-first-lines .end h3 { font-size: 36px; line-height: 0.98; font-weight: 900; margin: 0 0 14px; text-wrap: balance; max-width: 13ch; }
.v-first-lines .end .nums { display: flex; gap: 8px; justify-content: center; margin-top: 6px; }
.v-first-lines .end .nums i { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-weight: 900; font-size: 18px;
  background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.18); }
.v-first-lines .hint { color: var(--muted); font-size: 15px; text-align: center; margin: 0 0 8px; }
@media (max-width: 360px) { .v-first-lines .line { font-size: 30px; } .v-first-lines .hook h3 { font-size: 34px; } }
`;

export default {
  slug: 'first-lines',
  title: 'First lines',
  short: 'First lines',
  channel: 'instagram',
  blurb: 'Five opening sentences. Keep reading the one that grabs you.',
  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    const story = (id) => ctx.stories.find(s => s.id === id);
    const card = (cls, ...kids) => el('div', { class: 'card ' + cls }, ...kids);

    const slides = [
      { node: card('hook',
          el('div', { class: 'eyebrow', text: 'Five first lines' }),
          el('h3', { text: 'Keep reading the one you can’t put down.' }),
          el('div', { class: 'swipe', text: 'Swipe →' })) },
      ...LINES.map((L, i) => ({
        n: i + 1,
        node: card('', el('p', { class: 'line', text: L.line })),
        onPick: () => ctx.finish({
          story: story(L.id),
          why: `You couldn’t put down line ${i + 1}, and that line is how this story begins.`,
        }),
      })),
      { node: card('end',
          el('h3', { text: 'Comment the number. We’ll send you the rest.' }),
          el('div', { class: 'nums', 'aria-hidden': 'true' }, LINES.map((_, i) => el('i', { text: i + 1 })))) },
    ];
    slides[1 + LINES.length - 1].node.style.background = SKINS[4];
    LINES.forEach((_, i) => { slides[i + 1].node.style.background = SKINS[i]; });

    const post = ctx.carousel(slides, {
      handle: 'storycityapp',
      likes: '212 likes',
      label: 'Five first lines',
      caption: 'Five first lines. No titles, no covers, no spoilers. Read all five, then comment the number you couldn’t put down and we’ll send you the rest, plus the street it starts on. <span class="more">#storycity #walkingstories #yeg #yyc</span>',
    });

    ctx.root.append(el('div', { class: 'v-first-lines' },
      el('p', { class: 'hint', text: 'Mock-up: tap a line to see which story it opens.' }),
      post));
  },
};
