// Story lines for the first-story-flow mockup. One line = one bubble; edit freely.
//
// Each story is cut to 3 chapters for the mock ("short first story").
// Beats inside a chapter:
//   'text'                      a bubble from the story's character
//   { n: 'text' }               a narrator line (centred, no bubble)
//   { me: 'text' }              one reply chip; tapping it sends the player's bubble
//   { choice: [a, b], then: [[...lines after a], [...lines after b]] }   first one shows the "choices" tip
//   { puzzle: 'WORD', ask: 'line', hint: 'small print' }                 tap-to-decrypt; first one shows the puzzle tip
//   { img: 'img/x.jpg', alt: 'caption' }   a story picture in the chat
//   { pill: 'text' }                        a system pill (glass, centred), e.g. “Gem saved to your map”
//   choice options can carry `dim: 1` (index of the discouraged choice); it opens the app's push-back panel
// unlock: { place, objective, tip, hunt, huntTip, mode } (mode forces the map mode for that unlock, as the real Summons does)
// After the last beat of chapters 1 and 2 the map opens for the unlock (see `unlock`).
//
// Where the words come from:
//   knight   real FTUE script (scripts/the-knights-quest-clean.md), Sir Wendell's voice, trimmed
//   summons  the real scripted FTUE story from the app (SC-3894 branch = main, Nov 12), word for word, condensed to 3 chapters;
//            art is the app's own (creator.storycity.app media), saved in img/summons-*
//   others   first lines are the real cold opens (public story API, Nov 4); the rest is written for this mock
// Covers are Story City's own art (public story API), copied from apps/everyday-app/covers.

export const STORIES = {
  knight: {
    title: 'The Knight’s Quest', who: 'Sir Wendell', avatar: 'img/knight.png', cover: null, glow: ['#3a2b10', '#BED13F'],
    genre: 'Fantasy', age: 'G', mins: '15 min', chapters: 3, where: 'anywhere', best: 'steps',
    blurb: 'A knight is stuck in the wrong century and needs a squire. You, apparently.',
    ch: [
      { name: 'A knight needs your help', beats: [
        'Hark! Is this a magic looking-glass? Thou there, Adventurer!',
        'I am Sir Wendell, and I hunt a dragon. I have need of thy help, and quickly!',
        { choice: ['I’m listening', 'Is this a prank?'], then: [
          ['Splendid! A squire with manners.'],
          ['A prank? Upon my honour, nay! The beast is very real.'],
        ] },
        'The beast hath turned invisible. But it left a message scratched upon my shield.',
        { puzzle: 'NORTH', ask: 'Tap each rune to read it.', hint: 'Tap a tile to decrypt it' },
        'North! It flieth north. Walk with me a little way, that we may follow its tracks.',
      ], unlock: { place: 'the dragon’s tracks', hunt: 'Find a tall tree and take its picture' } },
      { name: 'Dragon Tracks', beats: [
        'Seest thou those tracks?! The fiery beast was here, of that I am certain.',
        'By my troth! A Green Firedrake. ’Tis said they are nasty brutes!',
        { choice: ['Follow the tracks', 'Wait for backup'], then: [
          ['Bold! The tracks lead to the tallest tree hereabouts.'],
          ['Backup? I AM the backup. Come, the tree awaits.'],
        ] },
        'Hark! A roar! It cometh this way. Adventurer, get behind me!',
      ], cliff: 'The branches shake. Something big is up there.', unlock: { place: 'the tallest tree', hunt: 'Find the tallest tree and take its picture' } },
      { name: 'Afraid of Cats', beats: [
        'There be the beast! CHAAAARGE!!!',
        { choice: ['Help fight the dragon', 'The Knight’s got this'], then: [
          ['Thy courage doth thee credit! Speak the beast’s weakness, quickly!'],
          ['Then watch and learn, squire!'],
        ] },
        'What sayest thou? This dragon feareth… cats?',
        '’Tis well I never ride without my faithful companion, Mittens!',
        'It hath fled toward the mountains. The true quest beginneth now.',
      ], end: { name: 'Afraid of Cats', n: 1, of: 3 } },
    ],
  },

  summons: {
    title: 'The Summons', who: 'Unknown number', letter: 'U', avatar: null, art: 'img/summons-character.png', cover: null,
    glow: ['#2A2458', '#5A38AE'], bg: 'img/summons-chat-bg.jpg', tipArt: 'img/summons-character.png',
    genre: 'Mystery', age: 'PG', mins: '15 min', chapters: 3, where: 'anywhere', best: 'steps',
    blurb: 'A secret society is recruiting. Will you answer?',          // [real] welcome door tagline
    ch: [
      { name: 'The Text', beats: [
        "Hey, wait, don't block me.\nI need your help!",
        'Look out your window, the one facing the street.',
        'Are you looking?',
        { me: 'Yes… what am I looking for?' },
        { img: 'img/summons-figure.jpg', alt: 'A figure in the shadows across the street, the hoodie symbol on their chest' },
        'You see the street corner? The figure in the dark hoodie?',
        "That's me.",
        "I'm part of The Society, a group working in the shadows to protect your city.",
        'Lately, another organization has been working against us.',
        "You've been on my radar for a while.",
        "But before I can invite you to join us, you'll need to prove yourself.",
        "Head to the street if you're in.",
        'This mission will be brief, likely less than 5 minutes.',
        "I'll open a map on your screen to show you where to go.",
        { choice: ['Okay! Open the map.', "I'd rather stay inside"], dim: 1, then: [[], []] },
      ], unlock: {
        objective: 'Get to the street',
        tip: "I've added a circle on your map. Walk in any direction — it will shrink as you near your goal. About {n} steps.",
        hunt: 'Find a streetlight and take its picture',               // [new] for players who picked Hunt
        huntTip: 'No steps to count this time. Find a streetlight near you, then tap the camera button to show me with a photo.',
      } },
      { name: 'The Letter', beats: [
        'I had to slip away, one of their agents spotted me.',
        "Don't let your guard down. He could be anywhere.",
        'He should have left something for his contact.',
        'WAIT.',
        "My scans say you're right on top of it!?",
        'Your instincts are sharper than I expected. It took me hours to find my first drop.',
        'Have a look around — do you see what he left?',
        { me: 'Looking now...' },
        { img: 'img/summons-envelope.jpg', alt: 'An old letter with an intricate wax seal, lying on the sidewalk' },
        "That's it! Grab it, but be discreet.",
        "You'll need to find somewhere to hide while we plan your next move.",
        "Avoid private property though, it'll draw too much attention if you wander into a neighbor's yard.",
        { me: 'On It, finding somewhere to hide' },
      ], cliffQuote: "You'll need to find somewhere to hide while we plan your next move.",
      unlock: {
        mode: 'hunt', objective: 'Find somewhere to hide', hunt: 'Find somewhere to hide',
        huntTip: 'No steps to count this time. Search near you for a quiet spot to look at the letter, then tap the camera button to show me with a photo.',
      } },
      { name: 'The Hiding Spot', beats: [
        'Nice spot. Your ingenuity is exactly why I want you on this team.',
        "Let's save this spot as a gem on your map, in case we need it again.",
        { me: 'Save it' },
        { pill: 'Gem saved to your map: My hiding spot' },
        'Ok, my scans show the coast is clear. Time to look at the letter.',
        "Dang, it's encrypted. Well, I never said stopping these guys would be easy.",
        { puzzle: '786666', ask: 'Go ahead and see if you can decrypt it!', hint: 'Tap a tile to decrypt it' },
        { pill: 'Letter decrypted' },
        'You did it! I knew I was right about you.',
        "Okay, you'll need to leave it at one of our drop spots. We'll take it from there.",
        { img: 'img/summons-mailbox.jpg', alt: 'A glowing mail slot floating in midair, the glowing symbol above it and a code keypad beside it' },
        'These spots are code-locked.',
        "I've set this one to the numbers on the letter's seal.",
        { me: '786666' },
        { img: 'img/summons-staircase.jpg', alt: 'A hidden staircase opening in the ground' },
      ], end: { name: 'You found one of our hideouts!', sub: 'Impressive. Welcome to the team.', n: 1, of: 3 } },
    ],
  },

  squeaky: {
    title: 'Have You Seen Squeaky?', who: 'The Mailbox', avatar: null, glyph: '✉', cover: 'img/squeaky.jpg', coverTitle: true, glow: ['#3a2f10', '#DEC523'],
    genre: 'Family comedy', age: 'G', mins: '30 min', chapters: 5, where: 'anywhere', best: 'hunt',
    blurb: 'One missing toy sparks an unforgettable neighbourhood quest.',
    ch: [
      { name: 'The Long Face', beats: [
        { n: 'Your pet has finally returned home after a day of solo adventuring.' },
        { n: 'But why the long face?' },
        'Psst. Down here. Yes, the mailbox. Your pet left something behind.',
        { choice: ['A mailbox can talk?', 'Left what?'], then: [
          ['Only to good listeners.'],
          ['Squeaky! Their favourite toy.'],
        ] },
        'I wrote down where I last saw it. My handwriting is… mail-themed.',
        { puzzle: 'SLIDE', ask: 'Tap each stamp to read it.', hint: 'Tap a tile to decrypt it' },
        'The slide! Every good toy ends up at a playground eventually.',
      ], unlock: { place: 'the playground', hunt: 'Find a slide or a bench and take its picture' } },
      { name: 'The Playground', beats: [
        'Hello! I’m the slide. Squeaky was here this morning.',
        { choice: ['Where did it go?', 'Did it say anything?'], then: [
          ['A squirrel took it. Typical.'],
          ['It squeaked. That’s all it ever says.'],
        ] },
        'The squirrel headed for the biggest tree on the block.',
      ], cliff: 'From the top of the tree: one tiny, sad squeak.', unlock: { place: 'the big tree', hunt: 'Find the biggest tree and take its picture' } },
      { name: 'Home Again', beats: [
        'You found it! The squirrel says sorry. Mostly.',
        { me: 'Take Squeaky home' },
        'Your pet’s tail hasn’t stopped wagging since.',
      ], end: { name: 'Home Again', n: 1, of: 2 } },
    ],
  },

  incident: {
    title: 'Tales from the Incident', who: 'Cye', avatar: null, glyph: '☾', cover: 'img/incident.jpg', coverTitle: true, glow: ['#1b1440', '#9883F8'],
    genre: 'Urban fantasy mystery', age: '13+', mins: '30 min', chapters: 5, where: 'anywhere', best: 'steps',
    blurb: 'A seer, a detective, a fae. A mystery connects them all.',
    ch: [
      { name: 'The Seer', beats: [
        { n: 'A seer, a detective, a fae.' },
        { n: 'A mystery connects them all.' },
        'You can see this message? Then you have the Sight. Rare.',
        { choice: ['What’s the Sight?', 'Who is this?'], then: [
          ['Seeing what others walk past.'],
          ['Cye. I find things. Today I need help finding them.'],
        ] },
        'Someone left a mark on the city. Read it for me.',
        { puzzle: 'BRIDGE', ask: 'Tap each glyph.', hint: 'Tap a tile to decrypt it' },
        'The bridge. Walk with me, and keep your eyes open.',
      ], unlock: { place: 'the bridge', hunt: 'Find a bridge, railing or bench and take its picture' } },
      { name: 'The Detective', beats: [
        'Detective Arlo is already here. He doesn’t believe in the Sight.',
        { choice: ['Show him', 'Stay quiet'], then: [
          ['He’s rattled. Good. Rattled people listen.'],
          ['Smart. Let him think he found it himself.'],
        ] },
        'There’s a second mark. Fresher.',
      ], cliff: 'The fresh mark spells your name.', unlock: { place: 'the second mark', hunt: 'Find a mural or sign and take its picture' } },
      { name: 'The Fae', beats: [
        'The fae made the marks. Not to warn. To invite.',
        { me: 'Accept the invitation' },
        'Then this is only the first episode.',
      ], end: { name: 'Episode 1: The Invitation', n: 1, of: 1 } },
    ],
  },

  pirate: {
    title: 'Pirate Captain', who: 'Captain Bly', avatar: null, glyph: '⚓', cover: 'img/pirate.jpg', coverTitle: true, glow: ['#10283a', '#4CBFE9'],
    genre: 'Comedy fantasy', age: 'PG', mins: '45 min', chapters: 5, where: 'near', best: 'hunt',
    blurb: 'Outwit rivals, gather crew, race for treasure and glory.',
    ch: [
      { name: 'Dry Land', beats: [
        'So you fancy yourself a pirate, do you? Bold move for someone standing on dry land.',
        { choice: ['Aye, Captain!', 'I get seasick'], then: [
          ['Ha! That’s the spirit.'],
          ['Good news: there’s no sea. Bad news: there’s no sea.'],
        ] },
        'Every crew needs a map. Mine got wet.',
        { puzzle: 'PARK', ask: 'Tap each smudge to read it.', hint: 'Tap a tile to decrypt it' },
        'The park! Treasure always hides under trees. Hop to it.',
      ], unlock: { place: 'the park', hunt: 'Find a tree or a park sign and take its picture' } },
      { name: 'First Mate', beats: [
        'A rival crew got here first. Look, footprints.',
        { choice: ['Follow them', 'Set a trap'], then: [
          ['Sneaky. I like it.'],
          ['Traps! You’ll go far, sailor.'],
        ] },
        'The trail leads to a shop with a sign shaped like a fish.',
      ], cliff: 'The rival captain is waiting inside. She’s smiling.', unlock: { place: 'the fish sign', hunt: 'Find a shop sign and take its picture' } },
      { name: 'Treasure', beats: [
        'The rival captain wants to join us. Do we let her?',
        { me: 'Welcome aboard' },
        'Two crews, one map. The real hunt starts now.',
      ], end: { name: 'Two Crews', n: 1, of: 2 } },
    ],
  },

  adelaide: {
    title: 'The Adelaide Time Travel Caper', who: 'Professor Penn', avatar: null, glyph: '⌛', cover: 'img/adelaide.jpg', coverTitle: false, glow: ['#2a1a10', '#F5B82E'],
    genre: 'History, time travel', age: 'G', mins: '30 min', chapters: 4, where: 'anywhere', best: 'steps',
    blurb: 'Hop through Adelaide’s history, from your own front door.',
    ch: [
      { name: 'The Machine', beats: [
        'Testing, testing. Is this 2026? Splendid. I’ve broken my time machine.',
        { choice: ['Can I help?', 'Time machine?'], then: [
          ['You already are.'],
          ['Don’t look so surprised. It’s a very small one.'],
        ] },
        'The dial is stuck on a year. Read it for me.',
        { puzzle: '1836', ask: 'Tap each cog.', hint: 'Tap a tile to decrypt it' },
        '1836! The year Adelaide was founded. Walk with me and we’ll jump.',
      ], unlock: { place: '1836', hunt: 'Find something old and take its picture' } },
      { name: 'Founding Day', beats: [
        'Tents, mud and a lot of very confused surveyors.',
        { choice: ['Help survey', 'Fix the machine'], then: [
          ['You’ve drawn a straight line. They’re impressed.'],
          ['One cog fixed. Two to go.'],
        ] },
        'The dial is spinning again. Hold on!',
      ], cliff: 'We’ve landed. But the year on the dial is blank.', unlock: { place: 'the next year', hunt: 'Find a clock or a sign and take its picture' } },
      { name: 'Home Time', beats: [
        'Back in 2026. Mostly. Your shoes are a bit muddy.',
        { me: 'Worth it' },
        'Same time tomorrow? I’ve another dial to fix.',
      ], end: { name: 'Home Time', n: 1, of: 2 } },
    ],
  },
};

// The Start here shelf: three short first stories per walk answer, plus the sample story.
// Placeholder picks for the mock; Matt/Emily to curate the real ones.
export const START_HERE = {
  dog:       ['squeaky', 'knight', 'incident'],
  city:      ['pirate', 'squeaky', 'knight'],
  treadmill: ['incident', 'adelaide', 'knight'],
  home:      ['adelaide', 'knight', 'incident'],
};
export const SAMPLE = 'summons';

// The rest of the Library (covers only, not playable in the mock).
export const FEATURED = { title: 'Frightnight Ghost Tours', cover: 'img/frightnight.jpg', chips: ['★ 5.0', 'Spooky', 'PG'] };
export const SHELVES = [
  { name: 'Suggested For You', items: [
    { title: 'Alice Through The Tear', cover: 'img/alice.jpg', mins: 'Play Anywhere' },
    { title: 'Spy Academy', cover: 'img/spy.jpg', mins: '12 min away' },
    { title: 'The Omicron', cover: 'img/omicron.jpg', mins: 'Play Anywhere' },
  ] },
  { name: 'Play Anywhere Adventures', items: [
    { title: 'Frightnight Ghost Tours', cover: 'img/frightnight.jpg', mins: 'Play Anywhere' },
    { title: 'Tales from the Incident', cover: 'img/incident.jpg', mins: 'Play Anywhere' },
    { title: 'Have You Seen Squeaky?', cover: 'img/squeaky.jpg', mins: 'Play Anywhere' },
  ] },
  { name: 'Adventures Near You', items: [
    { title: 'Tips From Your Barista', cover: 'img/barista.jpg', mins: '8 min away' },
    { title: 'The Coronet Caper', cover: 'img/coronet.jpg', mins: '20 min away', titleOn: true },
    { title: 'Pirate Captain', cover: 'img/pirate.jpg', mins: '15 min away' },
  ] },
];
