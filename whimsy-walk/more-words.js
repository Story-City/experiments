// Words for the walks and quests added from the Notion "Whimsy Walks & Quests" board.
// Cards use the same fields as WALKS in walks.js; each walk's own screens read its block below.

export const SECTIONS = [
  { id: 'spooky', label: 'Spooky season' },
  { id: 'snap', label: 'Snap and collect' },
  { id: 'wander', label: 'Wander' },
  { id: 'listen', label: 'Listen and write' },
];

export const MORE_WALKS = [
  // spooky season
  { id: 'cursed', section: 'spooky', jewel: '#FF6050', mech: 'A spelling walk', name: 'Cursed Ransom Note',
    hook: () => 'A ghost forgot its name. The Halloween signs remember.', more: 'Collect its letters from spooky signs to spell it back.',
    how: ['Spot', 'Snap', 'Spell'], tags: ['Halloween only', 'Camera'], go: 'Find the Letters' },
  { id: 'seance', section: 'spooky', jewel: '#DA82ED', mech: 'A listening walk', name: 'Séance of Sounds',
    hook: () => "Record 3 sounds. Together, they're a message.", more: 'The ghost speaks through whatever you hear.',
    how: ['Listen', 'Record', 'Reveal'], tags: ['10 min', 'Microphone'], go: 'Begin the Séance' },
  { id: 'fog', section: 'spooky', jewel: '#4CBFE9', mech: 'A warmer-colder walk', name: 'Fog Walk',
    hook: () => 'No map. Just warmer, or colder.', more: 'Something spooky is hidden nearby. Follow the glow.',
    how: ['Walk', 'Feel', 'Find'], tags: ['15 min', 'No camera'], go: 'Into the Fog' },
  { id: 'haunted', section: 'spooky', jewel: '#93DC5E', mech: 'A haunting walk', name: 'Haunted Remix',
    hook: () => 'Three ordinary spots. Three haunted ones.', more: 'Snap a spot, then let it get possessed.',
    how: ['Snap', 'Haunt', 'Repeat'], tags: ['Halloween only', 'Camera'], go: 'Start Haunting' },
  // snap and collect
  { id: 'rainbow', section: 'snap', jewel: '#DEC523', mech: 'An in-order walk', name: 'Rainbow Walk',
    hook: () => 'Red first. Then orange. No skipping.', more: 'Seven colours, in order. Your photos become a rainbow.',
    how: ['Find', 'Snap', 'Next'], tags: ['20–40 min', 'Camera'], go: 'Find Red First' },
  { id: 'ransom', section: 'snap', jewel: '#ED8D00', mech: 'A spelling walk', name: 'Ransom Note',
    hook: () => "There's a secret word. The signs on your street can spell it.", more: 'Snap one letter at a time from real signs.',
    how: ['Spot', 'Snap', 'Spell'], tags: ['15–30 min', 'Camera'], go: 'Reveal the Letters' },
  { id: 'shapes', section: 'snap', jewel: '#5BD380', mech: 'A building walk', name: 'Shape Hunt',
    hook: () => 'A circle, a triangle, a square and a line walk into a street…', more: 'Snap one of each. They become a little creature.',
    how: ['Hunt', 'Snap', 'Build'], tags: ['15 min', 'Camera', 'Bring a friend'], go: 'Start Building' },
  { id: 'museum', section: 'snap', jewel: '#58B0F6', mech: 'A curating walk', name: 'Tiny Museum',
    hook: () => "Your street is full of priceless artifacts. Nobody's labelled them.", more: 'Snap 3 things and write their museum labels.',
    how: ['Find', 'Snap', 'Label'], tags: ['20 min', 'Camera', 'Writing'], go: 'Open the Museum' },
  { id: 'grumpy', section: 'snap', jewel: '#FF6050', mech: 'A naming walk', name: 'Grumpy Things Tour',
    hook: () => 'Some mailboxes are just grumpy.', more: 'Find 3 grumpy-looking things. Give each a name.',
    how: ['Spot', 'Snap', 'Name'], tags: ['15 min', 'Camera'], go: 'Start the Tour' },
  { id: 'safari', section: 'snap', jewel: '#00CBBF', mech: 'A gallery walk', name: 'Street Art Safari',
    hook: () => 'Somewhere near you, a wall is showing off.', more: 'Find 3 murals and save each one as a gem.',
    how: ['Find', 'Snap', 'Save'], tags: ['30 min', 'Camera', 'Gems'], go: 'Start the Safari' },
  { id: 'backwards', section: 'snap', jewel: '#BED13F', mech: 'A rewind walk', name: 'Backwards Walk',
    hook: () => 'Walk out. Turn around. See what you missed.', more: 'On the way back, spot 3 things you walked right past.',
    how: ['Walk', 'Turn', 'Spot'], tags: ['Any length', 'Camera'], go: 'Head Out' },
  { id: 'remix', section: 'snap', jewel: '#9883F8', mech: 'A remixing walk', name: 'Remix 3',
    hook: () => 'Snap your street. Then mess with it, three ways.', more: 'Mix it, Shape it, Wreck it: one remix per photo.',
    how: ['Snap', 'Remix', 'Repeat'], tags: ['15 min', 'Camera'], go: 'Start Remixing' },
  // wander
  { id: 'coin', section: 'wander', jewel: '#F5B82E', mech: 'A deciding walk', name: 'Coin-Flip Walk',
    hook: () => 'Heads, go left. Tails, go right.', more: 'Flip at every corner. Let the coin pick your street.',
    how: ['Walk', 'Flip', 'Turn'], tags: ['Ends when you say', 'No camera'], go: 'Flip the First Coin' },
  { id: 'steps', section: 'wander', jewel: '#ED8D00', mech: 'A saving walk', name: 'Spend Your Steps',
    hook: () => "Every step is a coin. Something's for sale at the end.", more: 'Save up steps, then spend them on a mystery chest.',
    how: ['Walk', 'Save', 'Spend'], tags: ['20+ min', 'No camera'], go: 'Start Saving' },
  { id: 'mood', section: 'wander', jewel: '#DA82ED', mech: 'A matching walk', name: 'Mood Walk',
    hook: () => "Tell it how you feel. It'll pick the walk.", more: 'Three small prompts, made for your mood.',
    how: ['Feel', 'Walk', 'Notice'], tags: ['10–20 min', 'No camera'], go: 'Pick a Feeling' },
  // listen and write
  { id: 'sound', section: 'listen', jewel: '#58B0F6', mech: 'A pausing walk', name: 'Sound Walk',
    hook: () => "Stop. Listen. What's the quietest sound here?", more: "Three stops, one word each. You'll end with a sound poem.",
    how: ['Stop', 'Listen', 'Write'], tags: ['10 min', 'Writing'], go: 'Take the First Stop' },
  { id: 'haiku', section: 'listen', jewel: '#ED54B3', mech: 'A writing walk', name: 'Haiku Walk',
    hook: () => 'Three things you see. Seventeen syllables.', more: 'Notice 3 things, then turn them into a haiku.',
    how: ['Notice', 'Count', 'Write'], tags: ['15 min', 'Writing'], go: 'Start Noticing' },
];

export const COMMON = {
  next: 'Next', done: "I'm Done", again: 'Back to Walks', save: 'Save', skip: 'Skip',
  of: (i, n) => `${i} / ${n}`,
};

export const RAINBOW = {
  find: 'Find something',
  colours: [
    { name: 'Red', hex: '#e03a3a', things: ['🍎', '🛑', '🌹', '🍓'] },
    { name: 'Orange', hex: '#f08a2a', things: ['🍊', '🥕', '🎃', '🦊'] },
    { name: 'Yellow', hex: '#f2cf3a', things: ['🌻', '🚕', '🍋', '🐤'] },
    { name: 'Green', hex: '#3aa860', things: ['🌿', '🥒', '🐸', '🌲'] },
    { name: 'Blue', hex: '#3a78e0', things: ['🫐', '🧢', '💧', '🦋'] },
    { name: 'Indigo', hex: '#4b3dbf', things: ['🔮', '🌌', '👖', '☂️'] },
    { name: 'Violet', hex: '#9a4ad8', things: ['🍇', '🪻', '🦄', '💜'] },
  ],
  endTitle: 'Your rainbow',
  endLine: 'Seven colours, in order, from your own street.',
};

export const RANSOM = {
  words: ['WHIM', 'STROLL', 'QUEST', 'MAGIC', 'WANDER'],
  ghosts: ['AGATHA', 'EDMUND', 'HOLLIS', 'MAVIS'],
  tap: 'Tap a letter, then find it on a real sign.',
  tapCursed: 'Tap a letter, then find it on a spooky sign.',
  findKicker: 'Find this letter on a sign',
  where: { out: 'Shop signs, street names, house numbers, posters.', home: 'Cereal boxes, book spines, fridge magnets.' },
  endTitle: 'The secret word was…',
  endTitleCursed: 'The ghost’s name was…',
  note: 'Meet me at the corner. Come alone. Bring snacks.',
  noteCursed: 'Thank you for remembering me. I’ll stop rattling the gate now.',
};

export const SHAPES = {
  list: [
    { id: 'circle', name: 'a circle', things: ['🍩', '🛞', '⚽', '🕰️'] },
    { id: 'triangle', name: 'a triangle', things: ['🍕', '⛺', '⚠️', '🏠'] },
    { id: 'square', name: 'a square', things: ['🪟', '📦', '🧇', '🖼️'] },
    { id: 'line', name: 'a line', things: ['🖊️', '🪵', '🚧', '🥢'] },
  ],
  tap: 'Tap a shape, then snap something that matches.',
  friend: 'Out with a friend? Hand them the phone for every other shape.',
  build: 'Build My Creature',
  endTitle: 'Meet your creature',
  names: ['Bartholomew', 'Pip', 'Lady Wobble', 'Sir Squarington', 'Noodle', 'Professor Blip'],
  rename: 'Tap the name to change it.',
};

export const MUSEUM = {
  exhibit: (i) => `Exhibit ${i}`,
  find: 'Find something worth a glass case.',
  label: 'Write its label',
  titlePh: 'The Lonely Mitten',
  linePh: 'Found on a fence, waiting for its other half. Circa yesterday.',
  open: 'Open the Museum',
  endTitle: 'The Museum of Small Things',
  endLine: 'Admission free. Please do not touch the mitten.',
};

export const GRUMPY = {
  find: 'Find something that looks grumpy.',
  name: 'Who is this?',
  names: ['Gerald', 'Mildred', 'Grumbleton', 'Doris', 'Mr. Huff', 'Agnes'],
  namePh: 'Type a name',
  endTitle: 'The Grumpy Lineup',
  endLine: 'None of them would say what was wrong.',
};

export const SAFARI = {
  find: { out: 'Find a mural, a painted wall or some street art.', home: 'Find a poster, a painting or a drawing.' },
  save: 'Save as a Gem',
  name: 'Name this gem',
  namePh: 'The Fox on 4th',
  endTitle: '3 art gems saved',
  endLine: 'They’re on your map now, for you or anyone you share them with.',
};

export const BACKWARDS = {
  out: 'Walk out any way you like.',
  outLine: 'Don’t look too hard. That’s the point.',
  turn: 'Turn Around',
  back: 'Now walk back the same way.',
  backLine: 'Spot 3 things you walked right past.',
  endTitle: 'You walked right past these',
  time: (m) => (m < 1 ? 'Under a minute out' : `${m} min out`),
};

export const REMIX = {
  styles: [
    { id: 'mix', name: 'Mix It', line: 'Colours swapped' },
    { id: 'shape', name: 'Shape It', line: 'Mirrored into a pattern' },
    { id: 'wreck', name: 'Wreck It', line: 'Glitched to bits' },
  ],
  haunted: [
    { id: 'ghost', name: 'Ghostly', line: 'Pale and see-through' },
    { id: 'cursed', name: 'Cursed', line: 'Something green got in' },
    { id: 'possessed', name: 'Possessed', line: 'It’s looking back' },
  ],
  snap: 'Snap a spot',
  pick: 'Pick a remix',
  pickHaunted: 'How haunted?',
  endTitle: 'Three remixes',
  endTitleHaunted: 'Three haunted spots',
};

export const SEANCE = {
  candles: 'Three candles. One sound each.',
  record: 'Record a Sound',
  recording: 'Listening…',
  stop: 'Stop',
  what: 'What was it?',
  sounds: ['wind', 'footsteps', 'a dog', 'traffic', 'a bird', 'leaves', 'a door', 'voices', 'a bell'],
  reveal: 'Reveal the Message',
  endTitle: 'The ghost says…',
  message: (a, b, c) => `“Follow the ${a}. Wait for ${b}. When you hear ${c}, I’ll be right behind you.”`,
  play: 'Play the Séance',
  micNo: 'No microphone here, so this one’s pretend: a gate creaking in the wind.',
};

export const SOUND = {
  stop: (i) => `Stop ${i} of 3`,
  listen: 'Stand still and listen.',
  word: 'One word for one sound you heard',
  wordPh: 'rustle',
  endTitle: 'Your sound poem',
};

export const HAIKU = {
  notice: 'Name 3 things you can see',
  ph: ['a red door', 'wet leaves', 'one crow'],
  write: 'Now write your haiku',
  lines: ['5 syllables', '7 syllables', '5 syllables'],
  linePh: ['wet leaves on the step', 'a crow argues with the wind', 'nobody wins'],
  endTitle: 'Your haiku',
};

export const MOOD = {
  ask: 'How are you feeling?',
  after: 'And now?',
  feelings: [
    { id: 'restless', name: 'Restless', prompts: ['Walk fast for one whole block.', 'Find the steepest bit nearby and go up it.', 'Count 20 steps out loud (in your head is fine).'] },
    { id: 'tired', name: 'Tired', prompts: ['Walk slower than everyone else.', 'Find somewhere to sit for one minute.', 'Look for the softest thing on your street.'] },
    { id: 'curious', name: 'Curious', prompts: ['Take a street you’ve never taken.', 'Read one sign you usually ignore.', 'Find the oldest thing on the block.'] },
    { id: 'low', name: 'Low', prompts: ['Find one thing that’s growing.', 'Look up for ten seconds.', 'Notice something someone made with care.'] },
    { id: 'happy', name: 'Happy', prompts: ['Smile at the next dog.', 'Find something yellow.', 'Hum one song all the way through.'] },
    { id: 'stuck', name: 'Stuck', prompts: ['Turn the opposite way to usual.', 'Stop at a corner and spin once.', 'Find a door you’ve never noticed.'] },
  ],
  prompt: (i) => `Prompt ${i} of 3`,
  next: 'Done, Next',
  endTitle: (a, b) => (a === b ? `Still ${b.toLowerCase()}. That’s allowed.` : `${a} → ${b}`),
  endLine: 'Thanks for walking with it.',
};

export const COIN = {
  flip: 'Flip at This Corner',
  heads: 'Heads. Go left.',
  tails: 'Tails. Go right.',
  ready: 'Walk to the first corner.',
  count: (n) => (n === 1 ? '1 flip' : `${n} flips`),
  endTitle: 'The coin decided',
  endLine: (h, t) => `${h} heads, ${t} tails.`,
};

export const FOG = {
  intro: 'Something is hidden nearby. Your only clue is the glow.',
  walk: 'Walk a Block',
  left: 'Turn Left',
  right: 'Turn Right',
  temps: ['Freezing', 'Cold', 'Cool', 'Warmer', 'Warm', 'Hot', 'Very hot'],
  found: 'You found it',
  spots: ['An old oak with a hollow full of letters.', 'A gate that creaks even when nobody touches it.', 'A lamppost that flickers in a pattern.', 'A bench with someone’s initials carved in 1923.'],
  blocks: (n) => (n === 1 ? '1 block walked' : `${n} blocks walked`),
};

export const STEPS = {
  saved: 'steps saved',
  walking: 'Walking… steps add up on their own.',
  ff: 'Fast-forward 500 steps',
  chests: [
    { name: 'Small Chest', cost: 300, prizes: ['A sticker: “I walked for snacks.”', 'A fact: pigeons can recognise faces.'] },
    { name: 'Big Chest', cost: 800, prizes: ['A secret: the next Story City chapter unlocks 50 steps sooner.', 'A gem: a tiny amber shard for your collection.'] },
    { name: 'Glowing Chest', cost: 1500, prizes: ['A whole gem cavern view, just for you.', 'A title: Keeper of Steps.'] },
  ],
  open: 'Open',
  need: (n) => `${n.toLocaleString()} more`,
  got: 'Inside the chest',
};

/* ---------- Quick quests: one small thing, 1–5 minutes ---------- */
export const QUEST_WORDS = {
  section: 'Quick quests · 1–5 min',
  kicker: 'Quest',
  spooky: 'Spooky quest',
  spookyShort: 'Spooky',
  go: 'Do It Now',
  doneKicker: 'Quest done',
  steps: (n) => `${n} / 10 steps`,
  step: 'Take a Step',
  green: 'Now snap something green.',
  spotHint: 'Something in your photo just moved. Tap where.',
  spotMiss: 'Not there. Look again.',
  spotFound: 'Found it.',
  write: 'Write one line',
  mood: 'How do you feel right now?',
};

export const QUESTS = [
  { id: 'q-bet', jewel: '#F5B82E', mins: 1, title: 'No time for a walk? Wanna bet?', line: 'Take 10 steps. Snap something green. You’re done.', type: 'bet' },
  { id: 'q-shadow', jewel: '#9883F8', mins: 2, spooky: true, title: 'Find a shadow that looks like something else', line: 'Snap it, then say what it looks like.', type: 'snapWrite', ask: 'What does it look like?', ph: 'A dragon eating a bin', thing: '🐉', colour: '#2a2a40' },
  { id: 'q-diff', jewel: '#00CBBF', mins: 2, spooky: true, title: 'Spot the difference, haunted edition', line: 'Snap anything. Then find what moved.', type: 'spotdiff', thing: '🪟', colour: '#3a4a60' },
  { id: 'q-face', jewel: '#FA7423', mins: 2, spooky: true, title: 'Find a face in a window, a pumpkin or a tree', line: 'Once you see it, you can’t unsee it.', type: 'snap', thing: '🎃', colour: '#2a1a40' },
  { id: 'q-gem', jewel: '#DA82ED', mins: 3, spooky: true, title: 'Leave a haunted gem', line: 'Snap a spot and write a one-line ghost story for it.', type: 'gem', ask: 'Its ghost story, in one line', ph: 'A boy waits here for a bus that stopped running in 1951.', thing: '🚏', colour: '#2a2a40' },
  { id: 'q-sound', jewel: '#4CBFE9', mins: 2, spooky: true, title: 'Record the creepiest sound on your walk', line: 'Creaks count. So do crows.', type: 'sound' },
  { id: 'q-orange', jewel: '#ED8D00', mins: 3, spooky: true, title: 'Find 3 orange things', line: 'Leaves, cones, cats. Anything orange.', type: 'snapN', n: 3, things: ['🍂', '🧡', '🦊', '🥕', '🍊'], colour: '#c86a2a' },
  { id: 'q-bench', jewel: '#58B0F6', mins: 2, spooky: true, title: 'Photograph an empty bench', line: 'Who’s sitting there? Write one line.', type: 'snapWrite', ask: 'Who’s sitting there?', ph: 'A woman in a green hat, still waiting for him.', thing: '🪑', colour: '#3a4a3a' },
  { id: 'q-door', jewel: '#93DC5E', mins: 2, spooky: true, title: 'Remix your front door into a haunted house', line: 'Snap the door. The app does the haunting.', type: 'remix', thing: '🚪', colour: '#5a3a2a' },
  { id: 'q-tree', jewel: '#5BD380', mins: 2, spooky: true, title: 'Photograph the spookiest tree on your street', line: 'Bonus points for gnarled branches.', type: 'snap', thing: '🌳', colour: '#1f2a24' },
  { id: 'q-watch', jewel: '#ED54B3', mins: 2, spooky: true, title: 'Find something that looks like it’s watching you', line: 'Two knots, two windows, two bolts. Eyes are everywhere.', type: 'snap', thing: '👀', colour: '#2a2040' },
  { id: 'q-mood', jewel: '#DEC523', mins: 1, title: 'How do you feel? Get a matching quest', line: 'Pick a feeling and we’ll pick the quest.', type: 'mood',
    match: { restless: 'q-orange', tired: 'q-bench', curious: 'q-shadow', low: 'q-tree', happy: 'q-face', stuck: 'q-diff' } },
];
