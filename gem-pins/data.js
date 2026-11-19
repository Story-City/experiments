// Gem map pins: every option, label and line of text. Edit here; one line = one change.
// Spec: Melissa's thread, 19 Nov 2026 (15 toggles, real Edmonton map, 44px tap areas, mixed states).

export const CATS = [
  { id: 'nature', label: 'Nature', colour: '#3ddc84', shape: 'pear' },
  { id: 'eat', label: 'Eat & Drink', colour: '#ff9f43', shape: 'round' },
  { id: 'shop', label: 'Shop', colour: '#ff6fae', shape: 'emerald' },
  { id: 'culture', label: 'Culture', colour: '#b36bff', shape: 'hex' },
  { id: 'play', label: 'Play', colour: '#ffd23f', shape: 'star' },
  { id: 'curio', label: 'Curiosities', colour: '#33c7d1', shape: 'trillion' },
];

// Rarity colours are Victoria's gem set (approved-ui/assets/gems): moonstone, aquamarine, topaz.
export const RARITY = {
  common: { label: 'Common', colour: '#c8d2e6' },
  rare: { label: 'Rare', colour: '#00c2ff' },
  mythical: { label: 'Mythical', colour: '#ffc448' },
};

// Colours you can pick for your gems. The first two are free when option 9 is "2 free + rest locked".
export const PALETTE = [
  { id: 'emerald', label: 'Emerald', colour: '#00cd9d' },
  { id: 'sapphire', label: 'Sapphire', colour: '#5b8cff' },
  { id: 'ruby', label: 'Ruby', colour: '#ff4f79' },
  { id: 'topaz', label: 'Topaz', colour: '#ffc448' },
  { id: 'amethyst', label: 'Amethyst', colour: '#b36bff' },
  { id: 'aquamarine', label: 'Aquamarine', colour: '#00c2ff' },
  { id: 'rose', label: 'Rose quartz', colour: '#ff9ec7' },
  { id: 'peridot', label: 'Peridot', colour: '#b5e655' },
];
export const FREE_COLOURS = 2;
export const APP_ACCENT = '#009eff'; // your gems when you can't pick a colour (option 9 Off)
export const BASE = '#8c86b8'; // others' gems in "quiet base colour"
export const OTHERS_FULL = '#b36bff'; // others' gems in "full colour" when their own colours are hidden
export const LOVE = '#e84aa8'; // liked

// The 15 toggles, in the thread's order. `start` is the "Start with" column.
export const OPTIONS = [
  { id: 'colour', n: 1, label: 'What colour means', start: 'whose', opts: [['whose', 'Whose it is'], ['rarity', 'Rarity'], ['category', 'Category'], ['picked', 'Your picked colour']] },
  { id: 'shape', n: 2, label: 'Gem shape', start: 'one', opts: [['one', 'One shape for all'], ['category', 'A shape per category']] },
  { id: 'rarityBy', n: 3, label: 'Rarity shown by', start: 'sizeGlow', opts: [['size', 'Size'], ['glow', 'Glow'], ['sizeGlow', 'Size + glow'], ['colour', 'Colour']] },
  { id: 'levels', n: 4, label: 'Rarity levels', start: '3', opts: [['2', '2: Common, Rare'], ['3', '3: Common, Rare, Mythical']] },
  { id: 'sizes', n: 5, label: 'Rarity sizes', start: '22-28-34', opts: [['22-28-34', '22 / 28 / 34 px'], ['22-26-30', '22 / 26 / 30 px']] },
  { id: 'mine', n: 6, label: 'Mine: private vs public', start: 'hollow', opts: [['hollow', 'Hollow vs solid'], ['dashed', 'Dashed vs solid frame'], ['lock', 'Lock badge']] },
  { id: 'liked', n: 7, label: 'Liked', start: 'heart', opts: [['heart', 'Heart badge'], ['colour', 'Its own colour'], ['ring', 'Double ring']] },
  { id: 'others', n: 8, label: 'Others’ gems', start: 'quiet', opts: [['quiet', 'Quiet base colour'], ['full', 'Full colour']] },
  { id: 'pick', n: 9, label: 'Pick your gem colour', start: 'two', opts: [['off', 'Off'], ['free', 'Free choice of all'], ['two', '2 free + rest locked']] },
  { id: 'sees', n: 10, label: 'Who sees your colour', start: 'me', opts: [['me', 'Only you'], ['all', 'Everyone']] },
  { id: 'tagMode', n: 11, label: 'Categories', start: 'multi', opts: [['one', 'One type per gem'], ['multi', 'Multiple tags per gem']] },
  { id: 'tags', n: 12, label: 'Category tags', start: CATS.map((c) => c.id), multi: true, opts: CATS.map((c) => [c.id, c.label]) },
  { id: 'filter', n: 13, label: 'Category filter', start: 'chips', opts: [['chips', 'Chips above map'], ['sheet', 'Filter sheet'], ['none', 'None']] },
  { id: 'density', n: 14, label: 'Map density', start: '40', opts: [['10', '10'], ['40', '40'], ['100', '100']] },
  { id: 'cb', n: 15, label: 'Colour-blind view', start: 'off', opts: [['off', 'Off'], ['rg', 'Red-green simulation']] },
  // added 19 Nov (Melissa): gems you've already been to
  { id: 'visited', n: 16, label: 'Visited shown by', start: 'fade', opts: [['fade', 'Faded'], ['check', 'Check badge'], ['small', 'Smaller'], ['none', 'Not shown']] },
  { id: 'show', n: 17, label: 'Show', start: 'all', opts: [['all', 'All gems'], ['unvisited', 'Only unvisited']] },
];

// Preset combos: each sets all 15 options (anything not listed stays on "Start with").
// Numbers in `what` match the options panel, so "P3" + "6B" is easy to say in a meeting.
export const PRESETS = [
  { id: 'start', label: 'Thread start', what: 'The thread’s “Start with” column.', set: {} },
  { id: 'mine', label: 'Mine stands out', what: 'Yours in your colour with a frame (dashed = private), liked gems in pink, everyone else quiet.', set: { colour: 'whose', others: 'quiet', mine: 'dashed', liked: 'colour' } },
  { id: 'rarity', label: 'Rarity first', what: 'Colour = rarity (Victoria’s moonstone / aquamarine / topaz) plus glow; yours get a lock badge when private.', set: { colour: 'rarity', rarityBy: 'glow', mine: 'lock', liked: 'heart', others: 'full' } },
  { id: 'category', label: 'Category map', what: 'Colour and shape both show the category; rarity is glow only; yours get a frame.', set: { colour: 'category', shape: 'category', rarityBy: 'glow', mine: 'dashed', liked: 'ring', others: 'full' } },
  { id: 'collector', label: 'Collector’s colours', what: 'Everyone’s gems in the colour they picked, all colours free, shown to everyone.', set: { colour: 'picked', pick: 'free', sees: 'all', others: 'full', liked: 'ring' } },
  { id: 'minimal', label: 'Minimal', what: 'Two rarity levels by size only, smaller sizes, lock badge, no filter.', set: { rarityBy: 'size', levels: '2', sizes: '22-26-30', mine: 'lock', filter: 'none' } },
  { id: 'busy', label: 'Busy downtown', what: 'Category map at 100 gems with the filter sheet: does it still read?', set: { colour: 'category', shape: 'category', rarityBy: 'glow', mine: 'dashed', filter: 'sheet', density: '100', others: 'full' } },
  { id: 'cb', label: 'Colour-blind check', what: 'Category colours through a red-green simulation.', set: { colour: 'category', rarityBy: 'sizeGlow', cb: 'rg', others: 'full' } },
];

// Notes shown under an option when another option makes it do nothing.
export const NOTES = {
  visitedHidden: 'Visited gems are hidden right now (17B).',
  colourTaken: 'Colour is showing rarity (3D), so this has no effect right now.',
  sizesUnused: 'Only used when rarity is shown by size (3A or 3C).',
  seesUnused: 'Only matters when you can pick a colour (9B or 9C).',
  seesNotShown: 'On the map, others’ colours show with 1D. Your own colour always shows to you.',
  pickedSame: 'Looks like 1A until others’ colours are shown to everyone (10B).',
};

export const COPY = {
  kicker: 'Experiment · Gem map pins',
  title: 'Gem map pins',
  lead: 'Find the clearest way to show who a gem belongs to, how rare it is, and its categories. Letters let you say which you mean (“3B”).',
  reset: 'Back to Start',
  presets: 'Preset combos',
  custom: 'Your own mix: change any option below, or pick a preset.',
  share: 'Copy link to this setup',
  copied: 'Link copied',
  options: 'Options',
  close: 'Done',
  mapTitle: 'Gems near you',
  all: 'All',
  filter: (n, total) => (n === total ? 'Filter' : `Filter · ${n}`),
  filterTitle: 'Show gems tagged',
  key: 'Key',
  yourColour: 'Your gem colour',
  locked: 'Story City+',
  lockedToast: 'More colours come with Story City+ (mockup, nothing to buy here)',
  seesMe: 'Only you see this colour. Others see your gems like everyone else’s.',
  seesAll: 'Everyone sees your gems in this colour.',
  yours: 'Yours',
  others: 'Others’',
  private: 'Private: only you can see it',
  public: 'Public: everyone can see it',
  by: (name) => `Found by ${name}`,
  liked: 'You liked this',
  visited: 'Visited',
  notVisited: 'Not visited yet',
  markVisited: 'Mark Visited',
  unvisitedChip: 'Not visited',
  shownUnvisited: (n) => `${n} unvisited gems`,
  like: 'Like',
  unlike: 'Liked',
  likes: (n) => `${n} like${n === 1 ? '' : 's'}`,
  shown: (n) => `${n} gems on the map`,
};

export const OWNERS = ['Priya', 'Sam', 'Jordan', 'Mei', 'Omar', 'Lou', 'Kai', 'Tess', 'Ravi', 'Ana'];

// Gem names by category (what someone found and pinned).
export const NAMES = {
  nature: ['Crabapple blossoms', 'Hawk on the light post', 'Secret pocket garden', 'Giant old elm', 'River valley lookout', 'Hidden rain garden', 'Squirrel highway'],
  eat: ['Best samosas in town', 'Tiny patio café', 'Pho for a cold day', 'Fresh bannock stand', 'Midnight perogies', 'The good bubble tea'],
  shop: ['Vintage record bin', 'Corner bookshop cat', 'Retro toy window', 'Handmade soap stall', 'Thrift treasure rack'],
  culture: ['Alley mural', 'Old bank façade', 'Poetry on the wall', 'Ukrainian church dome', 'Painted utility box', 'Little free library'],
  play: ['Chalk hopscotch', 'Tire swing', 'Hidden ping-pong table', 'Skate ledge', 'Giant chess set'],
  curio: ['Tiny door', 'Ghost sign', 'Bench with a plaque', 'Sidewalk fossil', 'Upside-down street sign', 'Lost-mitten fence'],
};
