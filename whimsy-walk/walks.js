// All the words for the Whimsy Walks experiment. Each walk has its own shape,
// so each has its own block. `out` = walking outside, `home` = at-home version.

export const HOME = {
  kicker: 'Whimsy Walks · 5 today',
  title: 'Where to, today?',
  sub: { out: 'Pick a walk. Your street does the rest.', home: 'Staying in? Every walk works around the house too.' },
  surprise: 'Surprise Me',
  where: { out: 'Outside', home: 'At Home' },
  hero: 'Tonight only',
  notNow: 'Not Now',
};

// One card per walk. jewel = its story accent from the brand palette.
// hook can be a function of today's postcard theme.
export const WALKS = [
  { id: 'postcard', no: 1, jewel: '#ED54B3', mech: 'A collecting walk', name: 'Postcard Walk',
    hook: (t) => `Today, only ${t.noun} count.`, more: 'Your best 3 shots become a postcard.',
    how: ['Notice', 'Snap', 'Send'], tags: ['Any length', 'Camera'], go: 'Get My Theme' },
  { id: 'bingo', no: 2, jewel: '#F5B82E', mech: 'A spotting walk', name: 'Block Bingo',
    hook: () => "Nine things to spot. The middle one's free.", more: 'Three in a row wins. Fill the card for a sticker.',
    how: ['Spot', 'Snap', 'Bingo'], tags: ['20–30 min', 'Camera'], go: 'Deal My Card' },
  { id: 'pumpkin', no: 3, jewel: '#FA7423', mech: 'A judging walk', name: 'Pumpkin Patrol',
    hook: () => 'Somewhere on your block lives Pumpkin Royalty.', more: "Rate every jack-o'-lantern you pass. Crown one.",
    how: ['Snap', 'Rate', 'Crown'], tags: ['After dark', 'Camera'], go: 'Start Patrol' },
  { id: 'roulette', no: 4, jewel: '#35C6D7', mech: 'A following walk', name: 'Route Roulette',
    hook: () => "Tell it how long. It won't tell you where.", more: 'You only see the next turn. It always brings you home.',
    how: ['Choose', 'Follow', 'Home'], tags: ['You pick the time', 'Ends at your door'], go: 'Pick My Time' },
  { id: 'cat', no: 5, jewel: '#BED13F', mech: 'A wandering walk', name: 'Turn Left at Every Cat',
    hook: () => 'One rule: see a cat, turn left.', more: 'Every 4th cat is a rebel. Your route becomes a doodle.',
    how: ['Look', 'Turn', 'Doodle'], tags: ['Ends when you say', 'No camera'], go: 'Follow the Cats' },
];
export const HERO = 'pumpkin';

export const CAMERA = { take: 'Take Photo', pretend: 'or pretend', cancel: 'Cancel' };

/* ---------- Postcard walk ---------- */
// colour = the pretend photo's background; things = what pretend photos show
export const POSTCARD = {
  todays: "Today's theme",
  hunt: 'Hunt for',
  shuffle: 'Shuffle',
  hint: { out: 'Only snap things that match. Wander wherever you like.', home: 'Only snap things that match. Hunt room to room.' },
  start: "Let's Go",
  snapped: (n) => (n === 1 ? '1 snap' : `${n} snaps`),
  needMore: (n) => `${3 - n} more to make a postcard`,
  finish: 'Make My Postcard',
  pick: 'Pick your best 3',
  picked: (n) => `${n} of 3 picked`,
  make: 'Make Postcard',
  stamp: 'Story City',
  greeting: { out: 'Out on a whim today. Wish you were here!', home: 'Stayed in, still found these. Wish you were here!' },
  share: 'Share Postcard',
  again: 'Back to Walks',
  themes: [
    { id: 'red', noun: 'red things', emoji: '🔴', label: 'Red', title: 'A Red Walk', colour: '#c83a3a', things: ['🍎', '🚒', '🌹', '🛑', '🍓', '🧣'] },
    { id: 'yellow', noun: 'yellow things', emoji: '🟡', label: 'Yellow', title: 'A Yellow Walk', colour: '#e3b62b', things: ['🌻', '🚕', '🍋', '🌼', '🐤', '🧽'] },
    { id: 'blue', noun: 'blue things', emoji: '🔵', label: 'Blue', title: 'A Blue Walk', colour: '#2f6fc8', things: ['🫐', '🦋', '🧢', '💧', '🐟', '🧿'] },
    { id: 'circles', noun: 'circles', emoji: '⭕', label: 'Circles', title: 'A Walk in Circles', colour: '#4b3d8f', things: ['🛞', '🍩', '⚽', '🕰️', '🍪', '🌕'] },
    { id: 'triangles', noun: 'triangles', emoji: '🔺', label: 'Triangles', title: 'A Walk of Triangles', colour: '#3a7d6b', things: ['🏠', '⛺', '🍕', '⚠️', '🎄', '🧀'] },
    { id: 'stripes', noun: 'stripes', emoji: '🦓', label: 'Stripes', title: 'A Stripy Walk', colour: '#555066', things: ['🦓', '🚧', '🍬', '🐝', '🧦', '🐯'] },
    { id: 'fuzzy', noun: 'fuzzy things', emoji: '🧸', label: 'Fuzzy', title: 'A Fuzzy Walk', colour: '#8a6a4f', things: ['🧸', '🐑', '🐈', '🧶', '🌾', '🐝'] },
    { id: 'shiny', noun: 'shiny things', emoji: '✨', label: 'Shiny', title: 'A Shiny Walk', colour: '#5a6a80', things: ['🔑', '🪙', '🚲', '💎', '🪞', '🛎️'] },
    { id: 'crumbly', noun: 'crumbly things', emoji: '🍂', label: 'Crumbly', title: 'A Crumbly Walk', colour: '#9a5a2a', things: ['🍂', '🧱', '🍪', '🪵', '🥐', '🍞'] },
  ],
};

/* ---------- Neighbourhood bingo ---------- */
export const BINGO = {
  title: { out: 'Block Bingo', home: 'Living Room Bingo' },
  hint: 'Tap a square when you spot it. Any order.',
  spot: 'Spot this',
  free: 'Free',
  bingo: 'Bingo.',
  bingoLine: 'Three in a row. You could stop here…',
  keepGoing: 'Keep Going',
  finish: "I'm Done",
  blackout: 'Full card.',
  blackoutLine: 'Every square spotted. Bonus sticker unlocked.',
  doneTitle: (lines) => (lines ? `${lines} ${lines === 1 ? 'line' : 'lines'} spotted` : 'Nice wander'),
  stickerLine: 'Bingo sticker',
  bonusLine: 'Full Card sticker',
  again: 'Back to Walks',
  out: [
    ['A red door', '🚪'], ['A cat in a window', '🐈'], ['A bird', '🐦'], ['A wonky fence', '🪵'],
    ['A face in something', '🙂'], ['A bike', '🚲'], ['Something heart-shaped', '❤️'], ['A puddle', '💧'],
    ['A flag', '🚩'], ['A chalk drawing', '🖍️'], ['A garden gnome', '🧙'], ['A mailbox', '📮'],
    ['A bench', '🪑'], ['A dog on a walk', '🐕'], ['Something sparkly', '✨'], ['A number 7', '7️⃣'],
    ['A wind chime', '🎐'], ['A pinecone', '🌲'], ['A tiny door', '🚪'], ['A pumpkin', '🎃'],
  ],
  home: [
    ['Something red', '🍎'], ['A mug', '☕'], ['A plant', '🪴'], ['Something soft', '🧸'],
    ['A book with a blue cover', '📘'], ['A face in something', '🙂'], ['A clock', '🕰️'], ['Something round', '🍊'],
    ['Odd socks', '🧦'], ['A spoon', '🥄'], ['A key', '🔑'], ['Something older than you', '📻'],
    ['A photo of a friend', '🖼️'], ['A pillow', '🛏️'], ['Something that smells nice', '🕯️'], ['A view out a window', '🪟'],
  ],
};

/* ---------- Pumpkin Patrol ---------- */
export const PUMPKIN = {
  title: 'Pumpkin Patrol',
  hint: { out: "Every jack-o'-lantern you pass gets a snap and a score.", home: 'Rate your own pumpkins, or ones in photos.' },
  spotted: "Snap a Jack-o'-Lantern",
  rateIt: 'How good is it?',
  outOf: (n) => `${n} / 5`,
  rated: (n) => (n === 1 ? '1 pumpkin rated' : `${n} pumpkins rated`),
  empty: 'No pumpkins yet. Keep your eyes peeled.',
  crown: 'Crown the Best',
  needMore: 'Rate 2 to crown a winner',
  winnerKicker: 'Pumpkin of the night',
  again: 'Back to Walks',
  scores: ['Bit of a Squash', 'Getting There', 'Solid Gourd', 'Spooky Good', 'Pumpkin Royalty'],
  pretendColours: ['#d9772b', '#c8642a', '#e08a32', '#b8562a', '#e39b3c'],
};

/* ---------- Turn left at every cat ---------- */
export const CAT = {
  title: 'Turn Left at Every Cat',
  ruleLabel: 'The one rule',
  rule: { out: 'Walk any way you like. Every time you see a cat, turn left.', home: 'Every cat you spot (window, photo, TV, your couch) means: move somewhere new, to your left.' },
  start: "Let's Go",
  saw: 'I Saw a Cat',
  count: (n) => (n === 1 ? '1 cat' : `${n} cats`),
  walking: 'Walking… keep an eye out',
  lefts: ['Turn left.', 'Cat says: left.', 'Left it is.', 'Lefty loosey.', 'Swing left.'],
  rebel: 'This one’s a rebel. Turn RIGHT.',
  done: "I'm Done",
  endTitle: 'Where the cats took you',
  endLine: (cats, lefts, rights) => `${cats} ${cats === 1 ? 'cat' : 'cats'} · ${lefts} ${lefts === 1 ? 'left' : 'lefts'}${rights ? ` · ${rights} ${rights === 1 ? 'right' : 'rights'}` : ''}`,
  noCats: 'No cats today. Just a lovely straight walk.',
  again: 'Back to Walks',
};

/* ---------- Route Roulette ---------- */
// The one walk that asks how long: it plans a loop of that length from your door.
export const ROULETTE = {
  title: 'Route Roulette',
  rule: { out: "A secret loop from your door and back. You'll only ever see the next turn.", home: "A secret loop around the house. You'll only ever see the next turn." },
  howLong: 'How long do you want to walk?',
  mins: (m) => `${m} min`,
  start: "Let's Go",
  door: { out: 'Step out your door and turn', home: 'Stand up and turn' },
  walk: (n, unit) => `then walk ${n} ${unit[n === 1 ? 0 : 1]}`,
  unit: { out: ['block', 'blocks'], home: ['steps', 'steps'] },
  homeAhead: (n, unit) => `Home is ${n} ${unit[n === 1 ? 0 : 1]} ahead`,
  dirs: { left: '↰ Turn left', right: '↱ Turn right' },
  next: "I'm at the Corner",
  arrived: "I'm Home",
  toGo: (m) => (m < 1 ? 'Almost home' : `About ${m} min to go`),
  twists: ['…and look up.', '…and count the red doors.', '…and say hi to a tree.', '…and walk like you’re late for a ball.', '…and find something round.', '…and listen for a bird.'],
  endTitle: 'You made a loop.',
  endLine: (turns, mins) => `${turns} turns · about ${mins} min · back where you started`,
  stopped: 'Loop cut short. Here’s where you got to.',
  done: "I'm Done",
  again: 'Back to Walks',
};

export const SHARE = { tag: '#outonawhim', unsupported: 'Sharing opens on your phone' };
