// Type tuning: every role default and every word on screen lives here.
// app.js only reads this file. Sizes are px at the brand page's scale.

export const FONTS = {
  head: { name: 'Erode', stack: "'Erode', Georgia, serif", min: 300, max: 700 },
  body: { name: 'Karla', stack: "'Karla', system-ui, sans-serif", min: 200, max: 800 },
  phone: { name: 'Phone font', stack: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", min: 300, max: 700 },
};

// Erode runs small, so the brand page draws it 20% larger (size-adjust).
// React Native has no size-adjust, so the app needs size × this number.
export const ERODE_ADJUST = 1.2;

export const SCALE = {
  base: 16,
  ratio: 1.2,
  baseRange: [13, 20],
  ratios: [
    { v: 1.125, label: '1.125 · Major second' },
    { v: 1.2, label: '1.2 · Minor third' },
    { v: 1.25, label: '1.25 · Major third' },
    { v: 1.333, label: '1.333 · Perfect fourth' },
    { v: 1.414, label: '1.414 · Augmented fourth' },
  ],
};

export const CASES = [
  { id: 'none', label: 'As is' },
  { id: 'title', label: 'Title Case' },
  { id: 'sentence', label: 'Sentence' },
  { id: 'caps', label: 'CAPS' },
];

// Words kept lower case inside Title Case (never the first word).
export const TITLE_SMALL_WORDS = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'to', 'vs'];

export const RANGES = {
  size: [9, 64],
  lh: [0.9, 2, 0.01],
  ls: [-0.06, 0.24, 0.005],
};

// The spec (Nov 25, 2026): titles 30, subheads 13, body 16;
// chapter titles sentence case, story titles Title Case.
export const ROLES = [
  { id: 'storyTitle', label: 'Story title', font: 'head', weight: 500, size: 30, case: 'title', lh: 1.02, ls: -0.01, colour: '#FBF7FF',
    use: 'Story detail, screen titles, paywall' },
  { id: 'chapterTitle', label: 'Chapter title', font: 'head', weight: 500, size: 24, case: 'sentence', lh: 1.05, ls: -0.01, colour: '#FBF7FF',
    use: 'Chapter reader, map card' },
  { id: 'cardTitle', label: 'Card title', font: 'head', weight: 500, size: 17, case: 'title', lh: 1.05, ls: -0.01, colour: '#FBF7FF',
    use: 'Library cards' },
  { id: 'eyebrow', label: 'Subhead / eyebrow', font: 'body', weight: 700, size: 13, case: 'caps', lh: 1.2, ls: 0.14, colour: '#C49BFF',
    use: 'Above story and chapter titles' },
  { id: 'body', label: 'Body', font: 'body', weight: 400, size: 16, case: 'none', lh: 1.5, ls: -0.01, colour: '#D9CEF5',
    use: 'Descriptions, story text, pop-ups' },
  { id: 'bubble', label: 'Chat bubbles', font: 'body', weight: 400, size: 16, case: 'none', lh: 1.4, ls: 0, colour: '#FBF7FF', phoneFont: false,
    use: 'Character messages in the reader' },
  { id: 'button', label: 'Buttons / labels', font: 'body', weight: 600, size: 16, case: 'title', lh: 1.2, ls: 0, colour: '#FBF7FF',
    use: 'Buttons, choices, plan names' },
  { id: 'caption', label: 'Captions / meta', font: 'body', weight: 400, size: 13, case: 'none', lh: 1.45, ls: -0.01, colour: '#A493D6',
    use: 'Time, genre and length chips, tabs, small print' },
];

export const WEIGHT_NAMES = { 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold' };

export const UI = {
  title: 'Type tuning',
  sub: 'Erode + Karla on real screens',
  scale: 'Type scale',
  base: 'Base',
  ratio: 'Ratio',
  compare: { spec: 'Spec', mine: 'Mine' },
  reset: 'Reset All',
  resetRole: 'Reset',
  copyLink: 'Copy Link',
  export: 'Export',
  exports: { css: 'CSS', json: 'JSON', table: 'Table' },
  exportTitles: { css: 'CSS variables', json: 'JSON', table: 'Brand guidelines table' },
  copied: 'Copied',
  copy: 'Copy',
  close: 'Close',
  weight: 'Weight',
  size: 'Size',
  case: 'Case',
  lh: 'Line height',
  ls: 'Spacing',
  bubbleFont: 'Font',
  karla: 'Karla',
  phoneFont: 'Phone font',
  appSize: 'App size',
  erodeNote: 'Erode is drawn 20% larger here, like the brand page.',
  tune: 'Tune type and colour',
  hint: 'Tap any text on a screen to tune its role.',
  screensAria: 'App screens',
  specBadge: 'Showing the spec',
  linkCopied: 'Link copied',
  colours: 'Colours',
  colour: 'Colour',
  theme: 'Theme',
  custom: 'Custom',
  surfacesNote: 'Tap a swatch to change it.',
};

export const SCREENS = [
  { id: 'library', label: 'Library' },
  { id: 'detail', label: 'Story' },
  { id: 'reader', label: 'Chapter' },
  { id: 'map', label: 'Map' },
  { id: 'paywall', label: 'Paywall' },
];

// Colour pickers offer these swatches (brand guidelines jewel palette, plus today's app).
export const PALETTE = [
  { name: 'Ink', hex: '#0B0620' },
  { name: 'Midnight', hex: '#1A0B3D' },
  { name: 'Velvet', hex: '#2A1658' },
  { name: 'Line', hex: '#46337E' },
  { name: 'Starlight', hex: '#FBF7FF' },
  { name: 'Mist', hex: '#D9CEF5' },
  { name: 'Lilac', hex: '#A493D6' },
  { name: 'Amethyst glow', hex: '#C49BFF' },
  { name: 'Amethyst', hex: '#B36BFF' },
  { name: 'Sapphire', hex: '#5B8CFF' },
  { name: 'Royal sapphire', hex: '#2F5FE0' },
  { name: 'Deep sapphire', hex: '#1B3FA8' },
  { name: 'Citrine', hex: '#F5B82E' },
  { name: 'Emerald', hex: '#00CD9D' },
  { name: 'Ruby', hex: '#FF4F79' },
  { name: 'Spinel', hex: '#ED54B3' },
  { name: 'Celestite', hex: '#58B0F6' },
  { name: 'App background', hex: '#170C35' },
  { name: 'App raised', hex: '#241B46' },
  { name: 'App surface', hex: '#0E0A22' },
  { name: 'App tab bar', hex: '#2A2F5C' },
  { name: 'App border', hex: '#676767' },
  { name: 'App blue', hex: '#009EFF' },
  { name: 'App deep blue', hex: '#0259A1' },
  { name: 'App light grey', hex: '#EEEEEE' },
  { name: 'White', hex: '#FFFFFF' },
];

// Everything on the screens that isn't text.
export const SURFACES = [
  { id: 'bg', label: 'Background', hex: '#1A0B3D' },
  { id: 'raised', label: 'Cards and sheets', hex: '#2A1658' },
  { id: 'line', label: 'Lines and borders', hex: '#46337E' },
  { id: 'button', label: 'Button fill', hex: '#2F5FE0' },
  { id: 'bubbleThem', label: 'Their chat bubbles', hex: '#2A1658' },
  { id: 'bubbleMe', label: 'Your chat bubbles', hex: '#2F5FE0' },
  { id: 'accent', label: 'Highlights', hex: '#C49BFF' },
  { id: 'chrome', label: 'Tab bar and chips', hex: '#0B0620' },
];

// One tap sets every colour. Roles left out keep their own colour.
// Today's app = mobile-rn's dark theme (src/v2/config/defaultTheme.ts). The app has
// no eyebrow yet, so that one borrows its accent blue.
export const THEMES = [
  { id: 'jewel', label: 'Brand jewel' },
  { id: 'today', label: 'Today’s app',
    surfaces: { bg: '#170C35', raised: '#241B46', line: '#676767', button: '#0259A1', bubbleThem: '#241B46', bubbleMe: '#009EFF', accent: '#009EFF', chrome: '#2A2F5C' },
    roles: { storyTitle: '#FFFFFF', chapterTitle: '#FFFFFF', cardTitle: '#FFFFFF', eyebrow: '#009EFF', body: '#EEEEEE', bubble: '#FFFFFF', button: '#FFFFFF', caption: '#EEEEEE' } },
];

// Real covers and blurbs from the public API (Nov 25, 2026). Every cover here has
// its title painted in, so, like the app, cards show no title text on top.
export const STORIES = {
  alice: { title: 'Alice Through The Tear', genre: 'Adventure', rating: 'PG', time: '45 min', cover: 'covers/alice.jpg', coverHasTitle: true,
    summary: 'Follow the Rabbit. Find Alice. Save your City.' },
  frightnight: { title: 'Frightnight Ghost Tours', genre: 'Paranormal Mystery', rating: 'PG', time: '60 min', cover: 'covers/frightnight.jpg', coverHasTitle: true,
    summary: 'Will you survive your first tour as a rookie exorcist?' },
  spy: { title: 'Spy Academy', genre: 'Action', rating: 'G', time: '45 min', cover: 'covers/spy.jpg', coverHasTitle: true,
    summary: 'Do you have what it takes to join this elite spy organization?' },
  pirate: { title: 'Pirate Captain', genre: 'Adventure', rating: 'PG', time: '45 min', cover: 'covers/pirate.jpg', coverHasTitle: true,
    summary: 'Outwit rivals, gather crew, race for treasure and glory.' },
  squeaky: { title: 'Have You Seen Squeaky?', genre: 'Adventure', rating: 'G', time: '45 min', cover: 'covers/squeaky.jpg', coverHasTitle: true,
    summary: 'One missing toy sparks an unforgettable neighborhood quest.' },
  tales: { title: 'Tales from the Incident', genre: 'Fantasy', rating: '13+', time: '45 min', cover: 'covers/tales.jpg', coverHasTitle: true,
    summary: 'A seer, a detective, a fae—murder connects them all.' },
};

// Screen copy: Alice Through The Tear (public API) and the app's own strings.
export const COPY = {
  library: {
    title: 'Your library',
    continueKicker: 'Continue',
    current: { story: 'alice', meta: 'Chapter 2 · 1,200 steps', button: 'Keep Playing' },
    newKicker: 'New this week',
    cards: ['frightnight', 'spy', 'pirate', 'squeaky', 'tales', 'alice'],
    tabs: ['Explore', 'Library', 'Map', 'Me'],
  },
  detail: {
    story: 'alice',
    eyebrow: 'Adventure · Plays anywhere',
    title: 'Alice Through The Tear',
    meta: '45 min · 4 endings · PG',
    paras: [
      'Follow the Rabbit. Find Alice. Save your City.',
      'Wonderland is bleeding into your streets.',
      'The Queen of Hearts has torn pages from Wonderland’s storybook, ripping open breaches between worlds as she expands her territory into your city.',
      'Alice is trapped on the other side, with only the White Rabbit left to guide you.',
    ],
    button: 'Start Chapter 1',
    under: 'Chapter 1 is free. No account needed.',
  },
  reader: {
    progress: 'Chapter 1',
    eyebrow: 'Chapter 1',
    title: 'A flying, screaming book',
    narration: 'Somewhere along your thousandth commute and millionth text, you almost forgot Wonderland entirely, when a flying, screaming book smacks you square in the face.',
    sender: 'Alice',
    time: '2:14 pm',
    bubbles: [
      { from: 'them', text: 'Well don’t stand there and snog the bibliography.' },
      { from: 'them', text: 'Hold out your phone so we can talk!' },
      { from: 'me', text: 'Alice? Is that really you?' },
      { from: 'them', text: 'Wonderland has escaped these pages, and the Queen of Hearts is leading the invasion.' },
    ],
    choices: ['Talk to book', 'Toss it'],
  },
  map: {
    mode: 'Path',
    eyebrow: 'Next stop · 350 m',
    title: 'The unbirthday tea party',
    body: 'White Rabbit is waiting by the tea party. Follow the pin.',
    meta: 'About 470 steps · Switch modes anytime',
    button: 'I’m Here',
  },
  paywall: {
    eyebrow: 'Chapter 1 complete',
    title: 'Keep the story going',
    body: 'Start a free trial to keep reading and unlock every premium adventure.',
    perks: ['Unlimited access to every adventure', 'Every Play Anywhere adventure, unlocked', 'Save your progress and steps'],
    plans: [
      { label: 'Yearly', price: '$34.99/yr', note: '7 days free, then $34.99 a year', on: true },
      { label: 'Monthly', price: '$4.99/mo', note: 'Billed every month', on: false },
    ],
    button: 'Start Your Free Trial',
    small: 'Cancel anytime in Settings. You won’t be charged today.',
    later: 'Not now',
  },
};

// Names that keep their capital in Sentence case.
export const PROPER_WORDS = ['I', 'I’m', 'Alice', 'Wonderland', 'White', 'Rabbit', 'Queen', 'Hearts', 'Summons', 'Frightnight', 'Ghost', 'Tours', 'Spy', 'Academy', 'Pirate', 'Captain', 'Edmonton', 'Play', 'Anywhere', 'Settings'];
