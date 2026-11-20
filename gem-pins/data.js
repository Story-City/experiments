// Gem map pins: every option, label and line of text. Edit here; one line = one change.
// Spec: Melissa's thread, 19 Nov 2026 (15 toggles, real Edmonton map, 44px tap areas, mixed states).

export const CATS = [
  { id: 'nature', label: 'Nature', colour: '#3ddc84', shape: 'pear', crystal: 'leaf' },
  { id: 'eat', label: 'Eat & Drink', colour: '#ff9f43', shape: 'round', crystal: 'bar' },
  { id: 'shop', label: 'Shop', colour: '#ff6fae', shape: 'emerald', crystal: 'bar' },
  { id: 'culture', label: 'Culture', colour: '#b36bff', shape: 'hex', crystal: 'pebble' },
  { id: 'play', label: 'Play', colour: '#ffd23f', shape: 'star', crystal: 'pebble' },
  { id: 'curio', label: 'Curiosities', colour: '#33c7d1', shape: 'trillion', crystal: 'shard' },
];

// Rarity colours are Victoria's gem set (approved-ui/assets/gems): moonstone, aquamarine, topaz.
// Crystal set (option 2C, from Melissa's mockup 19 Nov): four types, each covering one or two categories.
export const CRYSTALS = [
  { id: 'leaf', label: 'Nature' },
  { id: 'pebble', label: 'Art' },
  { id: 'shard', label: 'Landmarks' },
  { id: 'bar', label: 'Eat & Shop' },
];

export const SEASONS = {
  autumn: { label: 'Autumn', colour: '#ff8a3d', until: 'until the first snow' },
  winter: { label: 'Winter', colour: '#9fe3ff', until: 'until March' },
  spring: { label: 'Spring', colour: '#ff9ec7', until: 'until June' },
  summer: { label: 'Summer', colour: '#ffd23f', until: 'until September' },
};

export const RARITY = {
  common: { label: 'Common', colour: '#c8d2e6' },
  rare: { label: 'Rare', colour: '#00c2ff' },
  epic: { label: 'Epic', colour: '#9370c4' },
  mythical: { label: 'Mythical', colour: '#ffc448' },
};
// Rarity colour sets (option 20). Victoria's: moonstone, aquamarine, her amethyst "hidden", topaz.
// Treasure (Treasure Hunt preset): quartz, sapphire, amethyst, gold.
export const RARITY_SETS = {
  victoria: { common: '#c8d2e6', rare: '#00c2ff', epic: '#9370c4', mythical: '#ffc448' },
  treasure: { common: '#ece6f7', rare: '#3d6bff', epic: '#a259f5', mythical: '#ffcc33' },
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
  { id: 'colour', n: 1, label: 'Colour shows', start: 'whose', opts: [['whose', 'Creator'], ['rarity', 'Rarity'], ['category', 'Category'], ['picked', 'Creator’s picked colour'], ['none', 'Nothing (one colour)']] },
  { id: 'shape', n: 2, label: 'Gem shape', start: 'one', opts: [['one', 'One shape for all'], ['category', 'A shape per category'], ['crystal', 'Crystal set']] },
  { id: 'rarityBy', n: 3, label: 'Rarity shown by', start: 'sizeGlow', opts: [['size', 'Size'], ['glow', 'Glow'], ['sizeGlow', 'Size + glow'], ['colour', 'Colour'], ['sizeGlowSparkle', 'Size + glow + sparkle'], ['none', 'Not shown'], ['sparkle', 'Sparkle'], ['sizeSparkle', 'Size + sparkle'], ['glowSparkle', 'Glow + sparkle']] },
  { id: 'levels', n: 4, label: 'Rarity levels', start: '3', opts: [['2', '2: Common, Rare'], ['3', '3: Common, Rare, Mythical'], ['4', '4: + Epic']] },
  { id: 'sizes', n: 5, label: 'Rarity sizes', start: '22-28-34', opts: [['22-28-34', '22 / 28 / 34 px'], ['22-26-30', '22 / 26 / 30 px']] },
  { id: 'mine', n: 6, label: 'Mine: private vs public', start: 'hollow', opts: [['hollow', 'Hollow vs solid'], ['dashed', 'Dashed vs solid frame'], ['lock', 'Lock badge'], ['none', 'Not shown'], ['outline', 'Outline only (dotted = private)'], ['own', 'Own colour + shape'], ['plinth', 'Plinth under the gem (hollow = private)'], ['groundring', 'Ring on the ground (broken = private)']] },
  { id: 'liked', n: 7, label: 'Liked', start: 'heart', opts: [['heart', 'Heart badge'], ['colour', 'Its own colour'], ['ring', 'Double ring'], ['outline', 'Pink outline'], ['none', 'Not shown']] },
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
  { id: 'details', n: 18, label: 'Gem details on tap', start: 'sheet', opts: [['sheet', 'Bottom sheet'], ['pop', 'Card by the gem'], ['full', 'Full-screen photo'], ['peek', 'Swipe strip']] },
  // added 19 Nov (Melissa): temporary gems
  { id: 'expiring', n: 21, label: 'Expiring soon shown by', start: 'clock', opts: [['clock', 'Clock badge'], ['countdown', 'Countdown (“2h”)'], ['ring', 'Pulsing ring'], ['none', 'Not shown']] },
  { id: 'seasonal', n: 22, label: 'Seasonal shown by', start: 'shape', opts: [['shape', 'Season shape'], ['badge', 'Season badge'], ['colour', 'Season colour'], ['none', 'Not shown']] },
  { id: 'season', n: 23, label: 'Season', start: 'winter', opts: [['autumn', 'Autumn (maple leaf)'], ['winter', 'Winter (snowflake)'], ['spring', 'Spring (flower)'], ['summer', 'Summer (sun)']] },
  // added 19 Nov for the preset combos
  // added 20 Nov: the Branding session's gem art (apps/gem-styles), Victoria's style and Neon
  { id: 'art', n: 25, label: 'Gem art', start: 'drawn', opts: [['drawn', 'Drawn shapes (uses 1 + 2)'], ['victoria', 'Victoria’s style'], ['neon', 'Neon']] },
  { id: 'curio', n: 26, label: 'Curiosities gem', start: 'nugget', opts: [['nugget', 'Nugget'], ['fan', 'Crystal fan']] },
  { id: 'layer', n: 27, label: 'Mine / Liked / All buttons', start: 'off', opts: [['off', 'Off'], ['on', 'On: dim the rest']] },
  { id: 'cluster', n: 24, label: 'Close gems', start: 'all', opts: [['all', 'Show all'], ['group', 'Group with a number']] },
  { id: 'glowOn', n: 19, label: 'Glow on', start: 'rare', opts: [['rare', 'Rare and up'], ['mythical', 'Mythical only']] },
  { id: 'rarityColours', n: 20, label: 'Rarity colours', start: 'victoria', opts: [['victoria', 'Victoria’s set'], ['treasure', 'Treasure set']] }, // moonstone / aquamarine / amethyst / topaz; quartz / sapphire / amethyst / gold
];

// Preset combos (Melissa, 19 Nov): six full setups, one tap each. Density and colour-blind stay as
// they are, so each preset can be run at 10 / 40 / 100 gems and with the colour-blind view.
// The options panel, grouped by what a gem has to show (Melissa, 19 Nov): the thing down the left,
// how it's shown on the right. Colour comes first because Creator, Rarity and Category all compete for it.
export const GROUPS = [
  ['Gem art', [['art', 'Style'], ['curio', 'Curiosities']]],
  ['Colour', [['colour', 'Colour shows']]],
  ['Creator', [['others', 'Others’ gems'], ['pick', 'You pick a colour'], ['sees', 'Who sees it']]],
  ['Rarity', [['rarityBy', 'Shown by'], ['levels', 'Levels'], ['sizes', 'Sizes'], ['glowOn', 'Glow on'], ['rarityColours', 'Colours']]],
  ['Category', [['shape', 'Shape'], ['tagMode', 'Tags per gem'], ['tags', 'Which tags'], ['filter', 'Filter']]],
  ['Private vs public', [['mine', 'Shown by']]],
  ['Liked', [['liked', 'Shown by']]],
  ['Visited', [['visited', 'Shown by'], ['show', 'Show']]],
  ['Time-limited', [['expiring', 'Expiring soon'], ['seasonal', 'Seasonal'], ['season', 'Season']]],
  ['Tapping a gem', [['details', 'Details']]],
  ['Map', [['density', 'Gems on screen'], ['cluster', 'Close gems'], ['cb', 'Colour-blind view']]],
  ['Mine / Liked / All', [['layer', 'Buttons above the map']]],
];

// Drag & drop settings: what we need to show (left) and the attributes we can play with (the cloud).
// `uses` = which attributes each thing can take, and the option value each one sets.
export const QUALITIES = [
  { id: 'colour', label: 'Colour', only: true }, // only one thing can own colour
  { id: 'shape', label: 'Shape' },
  { id: 'size', label: 'Size' },
  { id: 'glow', label: 'Glow' },
  { id: 'sparkle', label: 'Sparkle' },
  { id: 'badge', label: 'Badge' },
  { id: 'outline', label: 'Outline' },
  { id: 'ring', label: 'Ring' },
  { id: 'frame', label: 'Frame' },
  { id: 'hollow', label: 'Hollow' },
  { id: 'fade', label: 'Fade' },
  { id: 'label', label: 'Label' },
  { id: 'tint', label: 'Tint' },
];
export const THINGS = [
  { id: 'creator', label: 'Creator', uses: ['colour'], many: false },
  { id: 'rarity', label: 'Rarity', uses: ['colour', 'size', 'glow', 'sparkle'], many: true },
  { id: 'category', label: 'Category', uses: ['colour', 'shape'], many: true },
  { id: 'mine', label: 'Private vs public', uses: ['hollow', 'frame', 'badge', 'outline'], many: false },
  { id: 'liked', label: 'Liked', uses: ['badge', 'outline', 'ring', 'tint'], many: false },
  { id: 'visited', label: 'Visited', uses: ['fade', 'badge', 'size'], many: false },
  { id: 'expiring', label: 'Expiring soon', uses: ['badge', 'label', 'ring'], many: false },
  { id: 'seasonal', label: 'Seasonal', uses: ['shape', 'badge', 'tint'], many: false },
];

export const PRESETS = [
  { id: 'explorer', desc: 'Your gems stand out in your colour; everyone else’s are quiet. Rarer gems are bigger and glow. The everyday map.', label: 'Explorer', star: true, tests: 'Can you spot new gems vs your own at a glance?', what: 'Creator · one shape · size + glow · hollow / solid · heart badge · tags + chips.',
    set: { colour: 'whose', shape: 'one', rarityBy: 'sizeGlow', mine: 'hollow', liked: 'heart', tagMode: 'multi', filter: 'chips', pick: 'off', others: 'quiet' } },
  { id: 'treasure', desc: 'A gem’s colour tells you how rare it is, from plain quartz up to gold. Only gold glows, so the best finds call to you.', label: 'Treasure Hunt', tests: 'Does rarity in colour feel more exciting?', what: 'Rarity in colour (quartz, sapphire, amethyst, gold) · one shape · glow on gold only · dashed / solid frame · heart badge · tags + chips.',
    set: { colour: 'rarity', rarityColours: 'treasure', levels: '4', shape: 'one', rarityBy: 'glow', glowOn: 'mythical', mine: 'dashed', liked: 'heart', tagMode: 'multi', filter: 'chips', others: 'full', pick: 'off' } },
  { id: 'jewel', desc: 'Each kind of place has its own colour and its own gem cut, so you can tell a café from a mural before you tap.', label: 'Jewel Box', tests: 'Is “what is it” at a glance worth the sorting pain?', what: 'Category colour · a shape per category · size + glow · dashed / solid frame · heart badge · one type per gem.',
    set: { colour: 'category', shape: 'category', rarityBy: 'sizeGlow', mine: 'dashed', liked: 'heart', tagMode: 'one', filter: 'chips', others: 'full', pick: 'off' } },
  { id: 'yours', desc: 'Explorer, but you choose the colour of your own gems: two free, the rest locked for Story City+.', label: 'Make It Yours', tests: 'Does picking a colour make people care more? (2 free, rest locked)', what: 'Creator, in your picked colour · one shape · size + glow · hollow / solid · heart badge · tags + chips. Tap the colour button, top right.',
    set: { colour: 'whose', shape: 'one', rarityBy: 'sizeGlow', mine: 'hollow', liked: 'heart', tagMode: 'multi', filter: 'chips', pick: 'two', others: 'quiet' } },
  { id: 'calm', desc: 'Just two colours, yours and everyone else’s, and only mythical gems glow. The quietest map we can make.', label: 'Calm', tests: 'How minimal can it get before the map stops being useful?', what: 'Creator in 2 colours only · one shape · glow on mythical only · hollow / solid · heart badge · tags + chips.',
    set: { colour: 'whose', shape: 'one', rarityBy: 'glow', glowOn: 'mythical', mine: 'hollow', liked: 'heart', tagMode: 'multi', filter: 'chips', pick: 'off', others: 'quiet' } },
  { id: 'loud', desc: 'Three colours, size, glow and sparkle all at once. Rarer gems twinkle and liked gems turn pink.', label: 'Loud', tests: 'Where’s the point of too much?', what: 'Creator in 3 colours (liked gets its own) · one shape · size + glow + sparkle · dashed / solid frame · tags + chips.',
    set: { colour: 'whose', shape: 'one', rarityBy: 'sizeGlowSparkle', mine: 'dashed', liked: 'colour', tagMode: 'multi', filter: 'chips', pick: 'off', others: 'full' } },
  { id: 'brett', label: 'Brett’s pick', desc: 'Every kind of place has its own gem in Victoria’s style. Yours are the white diamond: solid when public, hollow when private. Rarer gems are bigger and glow.', tests: 'Can you tell what a gem is, and how rare, before you tap?',
    what: 'Victoria’s gem art · category gems · size + glow · yours = the diamond (hollow = private) · heart badge.',
    set: { art: 'victoria', colour: 'category', shape: 'category', rarityBy: 'sizeGlow', mine: 'own', liked: 'heart', tagMode: 'multi', filter: 'chips', pick: 'off', others: 'full' } },
  { id: 'neon', label: 'Neon', desc: 'The same category gems as glowing outlines, like a sign in a dark window. Yours are the white diamond.', tests: 'Is neon the most “sleek mystery”, and does it still read on a busy map?',
    what: 'Neon gem art · category gems · size + glow · yours = the diamond (hollow = private).',
    set: { art: 'neon', colour: 'category', shape: 'category', rarityBy: 'sizeGlow', mine: 'own', liked: 'heart', tagMode: 'multi', filter: 'chips', pick: 'off', others: 'full' } },
];
export const MATCHUP = ['explorer', 'treasure']; // the most useful head-to-head: does colour show whose, or how rare?

// Notes shown under an option when another option makes it do nothing.
export const NOTES = {
  visitedHidden: 'Visited gems are hidden right now (17B).',
  artSets: 'Gem art (25B or 25C) sets colour and shape by category.',
  curioUnused: 'Only used with gem art (25B or 25C).',
  ownSame: 'Looks like 6A until colour or shape shows the category (1C or 2B).',
  glowUnused: 'Only used when rarity glows (3B, 3C or 3E).',
  coloursUnused: 'Only used when colour shows rarity (1B or 3D).',
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
  myPick: 'Melissa’s pick',
  tests: 'Tests: ',
  tryAt: 'Try it at',
  cbShort: 'Colour-blind',
  matchup: 'Explorer ⇄ Treasure Hunt',
  matchupWhat: 'The big question: does colour show whose gem it is, or how rare it is?',
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
  savePreset: '+ Save as preset',
  presetName: 'Name this preset',
  presetNamePh: 'e.g. Quiet treasure',
  yourName: 'Your name',
  save: 'Save',
  savedBy: (who, when) => `Saved by ${who}${when ? ` · ${when}` : ''}`,
  savedTeam: 'Saved for the team',
  savedLocal: 'Saved on this device (team presets save on the experiments site)',
  deletePreset: (n) => `Delete the preset ${n}`,
  needPresetName: 'Give the preset a name first',
  saveFail: 'Couldn’t save. Check your connection and try again.',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  cluster: (n) => `${n} gems here. Tap to zoom in`,
  tapForMore: 'Tap for more · tap the map to close',
  modeDropdowns: 'Dropdowns',
  modeDrag: 'Drag & drop',
  dndHelp: 'Drag an attribute onto something we need to show. Or tap an attribute, then tap a row.',
  cloud: 'Attributes',
  newAttr: '+ New attribute',
  newAttrPlaceholder: 'e.g. Bounce, Halo, Shadow',
  add: 'Add',
  cancel: 'Cancel',
  ideaNote: 'Dashed = a new attribute: it’s saved in the setup and the link, but the mockup can’t draw it yet.',
  deleteAttr: (a) => `Delete the attribute ${a}`,
  attrExists: (a) => `There’s already an attribute called ${a}`,
  cantUse: (thing, q) => `${thing} can’t be shown by ${q}`,
  colourMoved: (from, to) => `Colour moved from ${from} to ${to}`,
  dropHere: 'Drop an attribute here',
  remove: (q, thing) => `Remove ${q} from ${thing}`,
  ends: (left, from) => `Ends in ${left} · part of a ${from}`,
  seasonal: (season, until) => `${season} gem · ${until}`,
  close: 'Close',
  more: 'More ›',
  nearby: (n) => `${n} gems nearby · swipe`,
  unvisitedChip: 'Not visited',
  shownUnvisited: (n) => `${n} unvisited gems`,
  like: 'Like',
  unlike: 'Liked',
  likes: (n) => `${n} like${n === 1 ? '' : 's'}`,
  shown: (n) => `${n} gems on the map`,
};

// Photos of finds (Victoria's, from Location Gems); each gem uses one.
export const PHOTOS = ['img/find-a.jpg', 'img/find-b.jpg', 'img/find-c.jpg', 'img/find-d.jpg'];

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
