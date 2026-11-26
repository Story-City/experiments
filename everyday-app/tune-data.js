// Type and colour tuning panel: roles, how app.css styles are sorted into them, and its words.
// tune.js reads every app.css rule that sets a font and sorts it into a role (font, italic,
// caps, size, colour). Defaults are the app as built. A role moves every style in it by the
// same step (size scales, weight / spacing shift), so the hierarchy inside a role survives.
// Colour lands only on styles whose colour is that role's own (colourVar).

export const FONTS = {
  head: { name: 'Erode', stack: "'Erode', Georgia, serif", min: 300, max: 700 },
  body: { name: 'Karla', stack: "'Karla', system-ui, sans-serif", min: 400, max: 800 },
  phone: { name: 'Phone font', stack: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif", min: 300, max: 700 } };

export const ERODE_ADJUST = 1.2;

export const CASES = [
  { id: 'built', label: 'As built' },
  { id: 'caps', label: 'CAPS' },
  { id: 'none', label: 'No caps' },
];

// Sorting rules. Sizes in px; FORCE wins over the rules, SKIP keeps a style out of every role.
export const CLASSIFY = {
  storyMin: 26,
  chapterMin: 21,
  captionMax: 14.5,
  buttonish: /btn|button|chip|reply|\blink\b|\.go\b|seg|tag\b|pill|cheer|\.mode\b/,
  skip: /^(\.rig|body\.reviewer|\.solves|\.src|\.tt-|html|:root|\*)|::|\.ghost\b|\.counter|\.lk-time|\.code\b/,
  force: { body: 'body', '.kicker': 'eyebrow' },
};

export const RANGES = { size: [8, 64], lh: [0.85, 2, 0.01], ls: [-0.06, 0.24, 0.005] };

export const ROLES = [
  { id: 'storyTitle', label: 'Big titles', use: 'Screen and story titles, sheet titles', font: 'head',
    weight: 600, size: 34, lh: 1.04, ls: 0.01, colour: '#FBF7FF', colourVar: '--starlight' },
  { id: 'chapterTitle', label: 'Titles', use: 'Chapter and section titles', font: 'head',
    weight: 600, size: 22, lh: 1.15, ls: -0.01, colour: '#FBF7FF', colourVar: '--starlight' },
  { id: 'cardTitle', label: 'Card titles', use: 'Story rows, choices, cards, stats', font: 'head',
    weight: 600, size: 17, lh: 1.15, ls: -0.01, colour: '#FBF7FF', colourVar: '--starlight' },
  { id: 'hook', label: 'Story lines (italic)', use: 'Hooks, quotes, the guide’s lines', font: 'head', italic: true,
    weight: 500, size: 17, lh: 1.3, ls: -0.01, colour: '#D9CEF5', colourVar: '--mist' },
  { id: 'eyebrow', label: 'Subhead / eyebrow', use: 'The glowing caps line above titles', font: 'body',
    weight: 700, size: 12, lh: 1.3, ls: 0.16, colour: '#C49BFF', colourVar: '--glow', caps: true },
  { id: 'label', label: 'Small labels', use: 'Small caps meta: time, counts, tags', font: 'body',
    weight: 700, size: 11, lh: 1.4, ls: 0.1, colour: '#A493D6', colourVar: '--lilac', caps: true },
  { id: 'body', label: 'Body', use: 'Descriptions and everyday text', font: 'body',
    weight: 400, size: 16, lh: 1.5, ls: -0.01, colour: '#D9CEF5', colourVar: '--mist', colourExtra: ['#phone'] },
  { id: 'bubble', label: 'Chat bubbles', use: 'Character and player messages', font: 'phone', phoneFont: true,
    weight: 400, size: 17, lh: 1.4, ls: 0, colour: '#FBF7FF', colourVar: '--starlight', colourExtra: ['.b.char', '.b.me'] },
  { id: 'button', label: 'Buttons', use: 'Buttons, replies, chips, links', font: 'body',
    weight: 600, size: 16, lh: 1.25, ls: 0, colour: '#FBF7FF', colourVar: '--starlight' },
  { id: 'caption', label: 'Captions / hints', use: 'Hints, small print, tab names', font: 'body',
    weight: 400, size: 14, lh: 1.45, ls: -0.01, colour: '#A493D6', colourVar: '--lilac' },
];

// Surfaces: `vars` are app.css custom properties set on the phone; `rules` paint one property.
export const SURFACES = [
  { id: 'bg', label: 'Background', hex: '#1A0B3D', vars: ['--midnight'] },
  { id: 'raised', label: 'Cards and sheets', hex: '#2A1658', vars: ['--velvet'] },
  { id: 'line', label: 'Lines and borders', hex: '#46337E', vars: ['--line'] },
  { id: 'button', label: 'Button fill', hex: '#2F5FE0', rules: [['.btn.primary', 'background'], ['.tabs .go', 'background']] },
  { id: 'bubbleThem', label: 'Their chat bubbles', hex: '#2A1658', rules: [['.b.char', 'background']] },
  { id: 'bubbleMe', label: 'Your chat bubbles', hex: '#2F5FE0', rules: [['.b.me', 'background']] },
  { id: 'accent', label: 'Highlights', hex: '#C49BFF', vars: ['--glow'] },
  { id: 'chrome', label: 'Tab bar', hex: '#1A0B3D', rules: [['.tabs', 'background']] },
];

export const PALETTE = [
  { name: 'Ink', hex: '#0B0620' }, { name: 'Midnight', hex: '#1A0B3D' }, { name: 'Velvet', hex: '#2A1658' }, { name: 'Line', hex: '#46337E' },
  { name: 'Starlight', hex: '#FBF7FF' }, { name: 'Mist', hex: '#D9CEF5' }, { name: 'Lilac', hex: '#A493D6' }, { name: 'Amethyst glow', hex: '#C49BFF' },
  { name: 'Amethyst', hex: '#B36BFF' }, { name: 'Sapphire', hex: '#5B8CFF' }, { name: 'Royal sapphire', hex: '#2F5FE0' }, { name: 'Deep sapphire', hex: '#1B3FA8' },
  { name: 'Citrine', hex: '#F5B82E' }, { name: 'Emerald', hex: '#00CD9D' }, { name: 'Ruby', hex: '#FF4F79' }, { name: 'Spinel', hex: '#ED54B3' },
  { name: 'Celestite', hex: '#58B0F6' }, { name: 'App background', hex: '#170C35' }, { name: 'App raised', hex: '#241B46' }, { name: 'App surface', hex: '#0E0A22' },
  { name: 'App tab bar', hex: '#2A2F5C' }, { name: 'App border', hex: '#676767' }, { name: 'App blue', hex: '#009EFF' }, { name: 'App deep blue', hex: '#0259A1' },
  { name: 'App light grey', hex: '#EEEEEE' }, { name: 'White', hex: '#FFFFFF' },
];

// Today's app = mobile-rn's dark theme (src/v2/config/defaultTheme.ts). It has no eyebrow,
// so that one borrows its accent blue.
export const THEMES = [
  { id: 'built', label: 'As built' },
  { id: 'today', label: 'Today’s app',
    surfaces: { bg: '#170C35', raised: '#241B46', line: '#676767', button: '#0259A1', bubbleThem: '#241B46', bubbleMe: '#009EFF', accent: '#009EFF', chrome: '#2A2F5C' },
    roles: { storyTitle: '#FFFFFF', chapterTitle: '#FFFFFF', cardTitle: '#FFFFFF', hook: '#EEEEEE', eyebrow: '#009EFF', label: '#EEEEEE', body: '#EEEEEE', bubble: '#FFFFFF', button: '#FFFFFF', caption: '#EEEEEE' } },
];

// The Nov 25 spec, one tap away: Erode Medium titles at 30, eyebrows Karla Bold 13 caps.
export const SPEC = {
  storyTitle: { weight: 500, size: 30, lh: 1.02, ls: -0.01 },
  chapterTitle: { weight: 500, size: 24, lh: 1.05, ls: -0.01 },
  cardTitle: { weight: 500, size: 17, lh: 1.05, ls: -0.01 },
  eyebrow: { weight: 700, size: 13, lh: 1.2, ls: 0.14 },
  body: { weight: 400, size: 16, lh: 1.5, ls: -0.01 } };

export const WEIGHT_NAMES = { 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold' };

export const UI = {
  rigButton: 'Type',
  title: 'Type and colour',
  sub: 'Tune the real screens. Untouched roles stay as built.',
  compare: { built: 'As built', mine: 'Mine' },
  spec: 'Apply Spec',
  reset: 'Reset All',
  resetRole: 'Reset',
  pick: 'Tap Text to Pick',
  pickOn: 'Tap any text in the phone',
  export: 'Export',
  exports: { css: 'CSS', json: 'JSON', table: 'Table' },
  exportTitles: { css: 'CSS variables', json: 'JSON (paste back with Load)', table: 'Brand guidelines table' },
  load: 'Load',
  loadTitle: 'Paste a JSON export',
  loadGo: 'Load Setup',
  loadBad: 'That isn’t a setup from this panel.',
  copy: 'Copy',
  copied: 'Copied',
  close: 'Close',
  colours: 'Colours',
  theme: 'Theme',
  colour: 'Colour',
  custom: 'Custom',
  weight: 'Weight',
  size: 'Size',
  lh: 'Line height',
  ls: 'Spacing',
  bubbleFont: 'Font',
  karla: 'Karla',
  phoneFont: 'Phone font',
  appSize: 'App size',
  erodeNote: 'Erode is drawn 20% larger here.',
  groupNote: (n) => `Moves ${n} text styles together.`,
  closePanel: 'Close panel' };
