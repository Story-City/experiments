// All the words for the Whimsy Walks experiment. Each walk has its own shape,
// so each has its own block. `out` = walking outside, `home` = at-home version.

export const HOME = {
  kicker: 'Whimsy Walks',
  title: 'Out on a Whim?',
  sub: { out: 'Pick a walk. Each one plays a little differently.', home: 'Staying in? Every walk works around the house too.' },
  surprise: 'Surprise Me',
  where: { out: "I'm Outside", home: "I'm at Home" },
};

export const WALKS = [
  { id: 'postcard', emoji: '💌', name: 'Postcard Walk', line: 'One theme. Snap what matches. Your best 3 become a postcard.' },
  { id: 'bingo', emoji: '🔲', name: 'Neighbourhood Bingo', line: 'Nine things to spot. Get 3 in a row.' },
  { id: 'pumpkin', emoji: '🎃', name: 'Pumpkin Patrol', line: "Rate every jack-o'-lantern you pass. Crown the best." },
  { id: 'roulette', emoji: '🎲', name: 'Route Roulette', line: 'At the end of every block, spin for which way to go.' },
  { id: 'cat', emoji: '🐈', name: 'Turn Left at Every Cat', line: 'One rule, one button. See where the cats take you.' },
];

export const CAMERA = { take: 'Take Photo', pretend: 'or pretend', cancel: 'Cancel' };

/* ---------- Postcard walk ---------- */
// colour = the pretend photo's background; things = what pretend photos show
export const POSTCARD = {
  todays: "Today's theme",
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
    { id: 'red', emoji: '🔴', label: 'Red', title: 'A Red Walk', colour: '#c83a3a', things: ['🍎', '🚒', '🌹', '🛑', '🍓', '🧣'] },
    { id: 'yellow', emoji: '🟡', label: 'Yellow', title: 'A Yellow Walk', colour: '#e3b62b', things: ['🌻', '🚕', '🍋', '🌼', '🐤', '🧽'] },
    { id: 'blue', emoji: '🔵', label: 'Blue', title: 'A Blue Walk', colour: '#2f6fc8', things: ['🫐', '🦋', '🧢', '💧', '🐟', '🧿'] },
    { id: 'circles', emoji: '⭕', label: 'Circles', title: 'A Walk in Circles', colour: '#4b3d8f', things: ['🛞', '🍩', '⚽', '🕰️', '🍪', '🌕'] },
    { id: 'triangles', emoji: '🔺', label: 'Triangles', title: 'A Walk of Triangles', colour: '#3a7d6b', things: ['🏠', '⛺', '🍕', '⚠️', '🎄', '🧀'] },
    { id: 'stripes', emoji: '🦓', label: 'Stripes', title: 'A Stripy Walk', colour: '#555066', things: ['🦓', '🚧', '🍬', '🐝', '🧦', '🐯'] },
    { id: 'fuzzy', emoji: '🧸', label: 'Fuzzy', title: 'A Fuzzy Walk', colour: '#8a6a4f', things: ['🧸', '🐑', '🐈', '🧶', '🌾', '🐝'] },
    { id: 'shiny', emoji: '✨', label: 'Shiny', title: 'A Shiny Walk', colour: '#5a6a80', things: ['🔑', '🪙', '🚲', '💎', '🪞', '🛎️'] },
    { id: 'crumbly', emoji: '🍂', label: 'Crumbly', title: 'A Crumbly Walk', colour: '#9a5a2a', things: ['🍂', '🧱', '🍪', '🪵', '🥐', '🍞'] },
  ],
};

/* ---------- Neighbourhood bingo ---------- */
export const BINGO = {
  title: { out: 'Neighbourhood Bingo', home: 'Living Room Bingo' },
  hint: 'Tap a square when you spot it. Any order.',
  free: 'Free',
  bingo: 'Bingo!',
  bingoLine: 'Three in a row. You could stop here…',
  keepGoing: 'Keep Going',
  finish: "I'm Done",
  blackout: 'Full Card!',
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
  spotted: "Spotted a Jack-o'-Lantern!",
  rateIt: 'How good is it?',
  rated: (n) => (n === 1 ? '1 pumpkin rated' : `${n} pumpkins rated`),
  empty: 'No pumpkins yet. Keep your eyes peeled.',
  crown: 'Crown the Best',
  needMore: 'Rate 2 to crown a winner',
  winnerKicker: 'Pumpkin of the Night',
  again: 'Back to Walks',
  scores: ['Bit of a Squash', 'Getting There', 'Solid Gourd', 'Spooky Good', 'Pumpkin Royalty'],
  pretendColours: ['#d9772b', '#c8642a', '#e08a32', '#b8562a', '#e39b3c'],
};

/* ---------- Turn left at every cat ---------- */
export const CAT = {
  title: 'Turn Left at Every Cat',
  rule: { out: 'Walk any way you like. Every time you see a cat, turn left.', home: 'Every cat you spot (window, photo, TV, your couch) means: move somewhere new, to your left.' },
  start: "Let's Go",
  saw: 'Saw a Cat!',
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
  rule: { out: "Tell me how long you've got. I'll plan a loop from your door and back, and only tell you one turn at a time.", home: "Tell me how long you've got. I'll plan a loop around the house, one turn at a time." },
  howLong: 'How long do you want to walk?',
  mins: (m) => `About ${m} min`,
  start: "Let's Go",
  door: { out: 'Step out your door and turn', home: 'Stand up and turn' },
  walk: (n, unit) => `then walk ${n} ${unit[n === 1 ? 0 : 1]}`,
  unit: { out: ['block', 'blocks'], home: ['steps', 'steps'] },
  homeAhead: (n, unit) => `Home is ${n} ${unit[n === 1 ? 0 : 1]} ahead`,
  dirs: { left: '↰ Turn left', right: '↱ Turn right' },
  next: "I'm at the Corner",
  arrived: "I'm Home!",
  toGo: (m) => (m < 1 ? 'Almost home' : `About ${m} min to go`),
  twists: ['…and look up.', '…and count the red doors.', '…and say hi to a tree.', '…and walk like you’re late for a ball.', '…and find something round.', '…and listen for a bird.'],
  endTitle: 'You made a loop!',
  endLine: (turns, mins) => `${turns} turns · about ${mins} min · back where you started`,
  stopped: 'Loop cut short. Here’s where you got to.',
  done: "I'm Done",
  again: 'Back to Walks',
};

export const SHARE = { tag: '#outonawhim', unsupported: 'Sharing opens on your phone' };
