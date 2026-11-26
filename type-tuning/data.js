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
  { id: 'storyTitle', label: 'Story title', font: 'head', weight: 500, size: 30, case: 'title', lh: 1.02, ls: -0.01, colour: 'pearl',
    use: 'Story detail, screen titles, paywall' },
  { id: 'chapterTitle', label: 'Chapter title', font: 'head', weight: 500, size: 24, case: 'sentence', lh: 1.05, ls: -0.01, colour: 'pearl',
    use: 'Chapter reader, map card' },
  { id: 'cardTitle', label: 'Card title', font: 'head', weight: 500, size: 17, case: 'title', lh: 1.05, ls: -0.01, colour: 'pearl',
    use: 'Library cards' },
  { id: 'eyebrow', label: 'Subhead / eyebrow', font: 'body', weight: 700, size: 13, case: 'caps', lh: 1.2, ls: 0.14, colour: 'glow',
    use: 'Above story and chapter titles' },
  { id: 'body', label: 'Body', font: 'body', weight: 400, size: 16, case: 'none', lh: 1.5, ls: -0.01, colour: 'mist',
    use: 'Descriptions, story text, pop-ups' },
  { id: 'bubble', label: 'Chat bubbles', font: 'body', weight: 400, size: 16, case: 'none', lh: 1.4, ls: 0, colour: 'starlight', phoneFont: false,
    use: 'Character messages in the reader' },
  { id: 'button', label: 'Buttons / labels', font: 'body', weight: 600, size: 16, case: 'title', lh: 1.2, ls: 0, colour: 'starlight',
    use: 'Buttons, choices, chips, tabs' },
  { id: 'caption', label: 'Captions / meta', font: 'body', weight: 400, size: 13, case: 'none', lh: 1.45, ls: -0.01, colour: 'lilac',
    use: 'Time, chapters, hints, small print' },
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
  tune: 'Tune type',
  hint: 'Tap any text on a screen to tune its role.',
  screensAria: 'App screens',
  specBadge: 'Showing the spec',
  linkCopied: 'Link copied',
};

export const SCREENS = [
  { id: 'library', label: 'Library' },
  { id: 'detail', label: 'Story' },
  { id: 'reader', label: 'Chapter' },
  { id: 'map', label: 'Map' },
  { id: 'paywall', label: 'Paywall' },
];

// Real story copy: Alice Through The Tear (public API) and the app's own strings.
export const COPY = {
  library: {
    title: 'Your library',
    continueKicker: 'Continue',
    current: { genre: 'Wonderland · 50 min', title: 'Alice Through The Tear', meta: 'Chapter 2 of 9 · 1,200 steps', jewel: '#ED54B3', button: 'Keep Playing' },
    newKicker: 'New this week',
    cards: [
      { genre: 'Mystery', title: 'The Summons', meta: '5 min · Plays anywhere', jewel: '#58B0F6' },
      { genre: 'Spooky', title: 'Frightnight Ghost Tours', meta: '45 min · 6 chapters', jewel: '#DA82ED' },
      { genre: 'Spy caper', title: 'Spy Academy', meta: '60 min · Edmonton', jewel: '#00CBBF' },
      { genre: 'Treasure hunt', title: 'A Pirate Captain', meta: '40 min · Near you', jewel: '#F5B82E' },
    ],
    tabs: ['Explore', 'Library', 'Map', 'Me'],
  },
  detail: {
    eyebrow: 'Wonderland · Plays anywhere',
    title: 'Alice Through The Tear',
    meta: '50 min · 9 chapters · 4 endings',
    jewel: '#ED54B3',
    paras: [
      'Wonderland is bleeding into your streets.',
      'The Queen of Hearts has torn pages from Wonderland’s storybook, ripping open breaches between worlds as she expands her territory into your city.',
      'Alice is trapped on the other side, with only the White Rabbit left to guide you.',
    ],
    button: 'Start Chapter 1',
    under: 'Chapter 1 is free. No account needed.',
  },
  reader: {
    progress: 'Chapter 1 of 9',
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
