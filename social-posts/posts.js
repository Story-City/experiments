// Every word on every post lives here, so a wording change is a one-line edit.
// A post is one of four formats:
//   carousel: swipeable Instagram post, `slides`
//   post:     a single Instagram square, `slides` with one slide
//   story:    9:16 Instagram story, `frames`; a frame can carry one `sticker` (poll, quiz, slider or link)
//   reel:     9:16 Reel / TikTok, `beats` of on-screen text that play in order
// A slide or frame: { art, tone, kicker, big, small }. art is a drawn motif (see ART in app.js); tone is a brand jewel.
// `chooser` entries live in Help me choose a story and open there.

export const PAGE = {
  title: 'Social media posts',
  lead: 'Post ideas for Story City’s Instagram and TikTok, made to get new people walking their first story. Tap one to see the mock-up.',
  account: 'storycityapp',
  alsoChooser: 'Also in Help me choose a story',
  openChooser: 'Open It There',
  chooserNote: 'These Instagram ideas match a new player to their first story. They live in Help me choose a story, where each one plays through to the story it picks.',
  sampleNote: 'Numbers, likes and quotes in these mock-ups are made up for the mock-up only. Replace them with real ones before anything is posted.',
};

export const SECTIONS = [
  { key: 'notice', title: 'Stop the scroll', sub: 'For people who have never heard of Story City' },
  { key: 'first', title: 'Get them to a first story', sub: 'For people who have seen us and need a reason to try' },
  { key: 'back', title: 'Bring them back', sub: 'For trial players and people who have walked once' },
  { key: 'chooser', title: 'Help me choose a story', sub: 'Instagram ways to match someone to their first story' },
];

export const FORMATS = { carousel: 'Carousel', post: 'Post', story: 'Story', reel: 'Reel / TikTok' };

export const POSTS = [
  /* ---------- stop the scroll ---------- */
  {
    id: 'your-street', section: 'notice', format: 'carousel',
    title: 'Your street, after dark',
    blurb: 'An ordinary street, then the letter that changes it.',
    slides: [
      { art: 'street', tone: 'sapphire', kicker: 'Story City', big: 'This is a normal street.', small: 'Swipe' },
      { art: 'seal', tone: 'ruby', big: 'Until a letter with a wax seal turns up on it.' },
      { art: 'hood', tone: 'glow', big: 'And someone in a hood is waiting at the corner.' },
      { art: 'phone', tone: 'sapphire', kicker: 'Story City', big: 'Don’t just walk. Step into the story.', small: 'First story free · link in bio' },
    ],
    caption: 'Your walk home, but it’s a mystery. Story City turns the streets you already walk into chapters you unlock on foot.',
    tags: '#storycity #walkthestory #yegwalks #yycwalks',
    why: 'Starts on something everyone recognises (their own street) and turns it in three swipes. Carousels get a second look in the feed when people don’t swipe.',
    measure: 'Saves and swipe-through to slide 4.',
  },
  {
    id: 'pov-long-way', section: 'notice', format: 'reel',
    title: 'POV: you took the long way home',
    blurb: 'A week of walks, told in on-screen text.',
    audio: 'Original audio · soft footsteps and a ticking clock',
    art: 'route', tone: 'glow',
    beats: [
      'POV: you started taking the long way home',
      'Day 1: one chapter, 900 steps',
      'Day 3: someone keeps leaving me notes',
      'Day 5: I know every alley in my neighbourhood now',
      'Day 7: I walk further just to find out what happens next',
      'Walk further. Find out what happens next.',
    ],
    caption: 'It started as one chapter. Now the long way home is the only way home.',
    tags: '#storycity #walkthestory #pov #eveningwalk',
    why: 'POV text-on-video is a native Reels and TikTok format. It sells the habit, not the app, and the last line is the ad hook.',
    measure: 'Watch-through to the last beat; follows from the reel.',
  },
  {
    id: 'fog-clears', section: 'notice', format: 'reel',
    title: 'Walking clears the fog',
    blurb: 'Two weeks of walks, sped up: the map comes out of the fog.',
    audio: 'Original audio · wind, then a single chime',
    art: 'fog', tone: 'sapphire',
    beats: [
      'Every walk clears a little fog',
      'This is two weeks of evening walks',
      'Gems glow through what you haven’t walked yet',
      'What’s under the rest?',
    ],
    caption: 'Fog mode: your neighbourhood starts hidden. Every walk reveals a little more, and the gems are always where you haven’t been.',
    tags: '#storycity #fogofwar #walkthestory #yegwalks',
    why: 'Satisfying reveal (a progress bar people can watch fill in), and it shows a feature without a single menu.',
    measure: 'Replays and shares.',
  },
  {
    id: 'wax-seal-quiz', section: 'notice', format: 'story',
    title: 'What’s on the seal?',
    blurb: 'A quiz sticker about the letter from The Summons.',
    frames: [
      { art: 'seal', tone: 'ruby', kicker: 'The Summons', big: 'Someone slid this under your door.', small: 'Tap to keep going' },
      { art: 'seal', tone: 'ruby', big: 'What’s pressed into the seal?', sticker: { type: 'quiz', q: 'Guess the seal', options: ['A crown', 'An eye in a triangle', 'A key', 'A number'], right: 1 } },
      { art: 'phone', tone: 'sapphire', big: 'The letter is the first chapter.', small: 'Open it in Story City', sticker: { type: 'link', label: 'Read Chapter 1' } },
    ],
    why: 'Quiz stickers get taps from people who would never comment. The answer is a small spoiler that makes the story feel real.',
    measure: 'Sticker taps, then link taps on the last frame.',
  },
  {
    id: 'would-you-follow', section: 'notice', format: 'story',
    title: 'Would you follow?',
    blurb: 'A poll sticker, then the result and a nudge to chapter 2.',
    frames: [
      { art: 'hood', tone: 'glow', big: 'A hooded figure waves you toward the alley.', sticker: { type: 'poll', q: 'Do you…', options: ['Follow', 'Walk on'], pct: [68, 32] } },
      { art: 'route', tone: 'sapphire', big: '68% of you followed.', small: 'Chapter 2 is waiting at the end of that alley.', sticker: { type: 'link', label: 'Find Out What Happens' } },
    ],
    why: 'A poll is a choice, and choices are the product. Sharing the result the next day brings people back to the account.',
    measure: 'Poll votes; link taps on the result frame.',
  },
  {
    id: 'sigil-walks', section: 'notice', format: 'carousel',
    title: 'We walked a star',
    blurb: 'Route maps that draw shapes: Sigil Walk from Story Tools.',
    slides: [
      { art: 'sigil-star', tone: 'citrine', kicker: 'Sigil Walk', big: 'We walked a star.', small: '2.1 km · 41 minutes' },
      { art: 'sigil-key', tone: 'emerald', big: 'Then a key.', small: 'It opened chapter 4.' },
      { art: 'sigil-moon', tone: 'glow', big: 'Tonight: the moon.', small: 'Your route draws the shape. The shape unlocks the story.' },
    ],
    caption: 'Sigil Walk: trace the shape with your feet and the story opens. Start point blurred, as always.',
    tags: '#storycity #gpsart #walkthestory #stravaart',
    why: 'GPS art is already a hobby people share. This borrows it and adds a reason to do it.',
    measure: 'Shares and saves; comments asking “how?”.',
  },
  {
    id: 'not-what-you-think', section: 'notice', format: 'carousel',
    title: '3 things Story City isn’t',
    blurb: 'Myth-busting for people who think it’s a step counter or a game.',
    slides: [
      { art: 'steps', tone: 'sapphire', kicker: 'Story City', big: '3 things we are not' },
      { art: 'steps', tone: 'emerald', kicker: '1', big: 'Not a step counter that nags you.', small: 'No streaks. No guilt.' },
      { art: 'gem', tone: 'citrine', kicker: '2', big: 'Not a game you have to be good at.', small: 'If you can walk, you can play.' },
      { art: 'window', tone: 'glow', kicker: '3', big: 'Not only for outside.', small: 'Rainy night? Play from your couch.' },
      { art: 'phone', tone: 'sapphire', big: 'It’s a story that moves when you do.', small: 'First story free · link in bio' },
    ],
    caption: 'Stories you walk. That’s it. That’s the app.',
    tags: '#storycity #walkthestory #interactivefiction',
    why: 'Answers the three objections from playtests before anyone has to ask.',
    measure: 'Saves; drop in “is it like Pokémon Go?” comments.',
  },

  /* ---------- get them to a first story ---------- */
  {
    id: 'lunch-break', section: 'first', format: 'carousel',
    title: 'Stories for your lunch break',
    blurb: 'Three real stories you can finish in 30 minutes or less.',
    slides: [
      { art: 'clock', tone: 'citrine', kicker: 'Lunch break?', big: '3 stories you can finish before you’re back at your desk' },
      { art: 'seal', tone: 'ruby', kicker: '15 min', big: 'The Summons', small: 'A secret society has chosen you. Nobody told you why.' },
      { art: 'sword', tone: 'emerald', kicker: '15 min', big: 'The Knight’s Quest', small: 'A knight is stuck in the wrong century and needs a squire.' },
      { art: 'magnifier', tone: 'sapphire', kicker: '30 min', big: 'The Case of the Garden Jubilee', small: 'Sherlock Holmes needs a hand. Winnie-the-Pooh has vanished.' },
    ],
    caption: 'Your lunch break, but make it a mystery. Save this for tomorrow.',
    tags: '#storycity #lunchbreak #walkthestory #yeg',
    why: 'Removes the “how long does it take?” worry and names real stories. A save is a plan to come back.',
    measure: 'Saves, and first-story starts from the bio link around lunchtime.',
  },
  {
    id: 'first-line-friday', section: 'first', format: 'post',
    title: 'First Line Friday',
    blurb: 'A weekly series: one opening line, one story.',
    slides: [
      { art: 'quote', tone: 'glow', kicker: 'First Line Friday', big: '“The letter was still warm, as if someone had only just let go of it.”', small: 'The Summons · 15 min' },
    ],
    caption: 'First Line Friday. One opening line, every week. Want the rest? It’s the first story, and it’s free.',
    tags: '#firstlinefriday #storycity #walkthestory #amreading',
    why: 'A weekly series is easy to make and easy to recognise. Readers already use #firstlinefriday.',
    measure: 'Comments and profile visits each Friday.',
  },
  {
    id: 'you-pick-ending', section: 'first', format: 'carousel',
    title: 'You choose what happens',
    blurb: 'A real story choice, two ways it could go. Vote in the comments.',
    slides: [
      { art: 'fork', tone: 'sapphire', kicker: 'Your call', big: 'The knight asks you to hold his sword while he ties his boot.' },
      { art: 'sword', tone: 'emerald', kicker: 'A', big: 'Hold it.', small: 'It’s heavier than it looks.' },
      { art: 'steps', tone: 'citrine', kicker: 'B', big: 'Run.', small: 'You’re a fast squire.' },
      { art: 'phone', tone: 'glow', big: 'Comment A or B.', small: 'Then play it and see what really happens.' },
    ],
    caption: 'From The Knight’s Quest. What would you do? A or B in the comments.',
    tags: '#storycity #chooseyourownadventure #walkthestory',
    why: 'Choices are what make Story City different from a podcast or an audiobook. Comment votes are cheap engagement.',
    measure: 'Comments; first-story starts for The Knight’s Quest.',
  },
  {
    id: 'play-together', section: 'first', format: 'reel',
    title: 'Four friends, one phone',
    blurb: 'Play together: roles, a passed phone and a group vote.',
    audio: 'Original audio · laughing, then a door creaks',
    art: 'friends', tone: 'citrine',
    beats: [
      'Four friends. One phone. A ghost who needs help.',
      'Everyone gets a role: Navigator, Decoder, Lookout, Voice',
      'Pass the phone when the story calls your name',
      'Tie on a choice? Flip the coin.',
      'Tonight’s plan: Frightnight Ghost Tours',
    ],
    caption: 'Story City with friends. One phone, four roles, one very confused ghost.',
    tags: '#storycity #thingstodoyeg #friendsnight #walkthestory',
    why: 'Shows a night out, not an app. Friends tag friends, which is free reach.',
    measure: 'Tags and shares; group starts.',
  },
  {
    id: 'gem-of-the-week', section: 'first', format: 'post',
    title: 'Gem of the week',
    blurb: 'One gem, how many people found it, and a hint where to look.',
    slides: [
      { art: 'gem', tone: 'emerald', kicker: 'Gem of the week', big: 'The Ember Opal', small: 'Found by 214 walkers in Edmonton this week. It likes bridges.' },
    ],
    caption: 'This week’s gem glows near water. Have you found yours?',
    tags: '#storycity #gemhunt #yegwalks',
    why: 'A light weekly collectible post keeps the account alive between story launches. The hint gives a reason to go out today.',
    measure: 'Comments saying “found it”; walks started that weekend.',
  },
  {
    id: 'walk-postcards', section: 'first', format: 'carousel',
    title: 'Your walk postcards',
    blurb: 'Reposting players’ after-walk postcards (with the start point blurred).',
    slides: [
      { art: 'postcard', tone: 'citrine', kicker: 'From your walks', big: 'You sent us these.', small: 'Tag #walkthestory to be featured' },
      { art: 'postcard', tone: 'ruby', kicker: '@a.walker', big: 'Chapter 3, The Summons', small: '1.4 km · found the Ember Opal' },
      { art: 'postcard', tone: 'emerald', kicker: '@another.walker', big: 'The Knight’s Quest, finished', small: '3.2 km · with my kid' },
    ],
    caption: 'Every walk ends with a postcard. These are yours. (Start points are always blurred so nobody can tell where you live.)',
    tags: '#walkthestory #storycity #yegwalks #yycwalks',
    why: 'Real players beat any ad, and the postcard already exists in the Walk postcard experiment.',
    measure: 'Tagged posts per week.',
  },
  {
    id: 'summons-trailer', section: 'first', format: 'reel',
    title: 'The Summons: trailer',
    blurb: 'A 15-second trailer for the first free story.',
    audio: 'Original audio · low strings',
    art: 'seal', tone: 'ruby',
    beats: [
      'A secret society has chosen you',
      'Nobody told you why',
      'The first clue is on your street',
      'The Summons · 15 minutes · free',
    ],
    caption: 'The Summons. Our first story is free, and it starts outside your door.',
    tags: '#storycity #thesummons #walkthestory',
    why: 'A trailer gives the first story a name people can remember and search for.',
    measure: 'Watch-through; first-story starts for The Summons.',
  },

  /* ---------- bring them back ---------- */
  {
    id: 'trial-explained', section: 'back', format: 'carousel',
    title: 'Your 7-day free trial, explained',
    blurb: 'An honest, plain walkthrough of what happens in the trial.',
    slides: [
      { art: 'calendar', tone: 'sapphire', kicker: 'No surprises', big: 'What happens in your 7-day free trial' },
      { art: 'calendar', tone: 'emerald', kicker: 'Day 1', big: 'Every story unlocks.', small: 'Add a card. You won’t be charged today.' },
      { art: 'bell', tone: 'citrine', kicker: 'Day 5', big: 'We remind you.', small: 'Two days before it ends, so you can decide.' },
      { art: 'calendar', tone: 'glow', kicker: 'Day 7', big: 'Keep walking, or cancel in two taps.', small: 'Cancel any time before then and you pay nothing.' },
    ],
    caption: 'A card is needed for the trial, so here’s exactly what happens with it.',
    tags: '#storycity',
    why: '“Card required” is where people drop off. Saying plainly what happens, and that we remind them, builds the trust to start.',
    measure: 'Trial starts from the bio link; fewer “will I be charged?” comments.',
  },
  {
    id: 'no-guilt', section: 'back', format: 'story',
    title: 'No streaks, no guilt',
    blurb: 'A gentle story for people who missed a few days.',
    frames: [
      { art: 'moon', tone: 'glow', big: 'Missed a few days?', small: 'Good. Life happens.' },
      { art: 'seal', tone: 'ruby', big: 'Your story waited for you.', small: 'Right where you left it.', sticker: { type: 'link', label: 'Pick Up Where You Left Off' } },
    ],
    why: 'Fits the brand (never guilt) and is the opposite of what fitness apps send. Good for people who stopped after chapter 1.',
    measure: 'Link taps from people who already follow us.',
  },
  {
    id: 'lock-screen', section: 'back', format: 'reel',
    title: 'Your story on your lock screen',
    blurb: 'The Live Activity: the story keeps walking with you.',
    audio: 'Original audio · a phone buzz, then footsteps',
    art: 'lock', tone: 'sapphire',
    beats: [
      'Phone in your pocket. Story still going.',
      '90 m to the street corner',
      'Your lock screen tells you when you’re close',
      'The story keeps walking with you',
    ],
    caption: 'No need to stare at your screen. Story City lives on your lock screen while you walk.',
    tags: '#storycity #iphonetips #walkthestory',
    why: 'Answers “do I have to look at my phone the whole time?”, the biggest worry about walking with an app.',
    measure: 'Saves; comments asking for Android (useful signal).',
  },
  {
    id: 'tonights-walk', section: 'back', format: 'story',
    title: 'Tonight’s Whimsy Walk',
    blurb: 'A daily story with tonight’s tiny walk and a slider.',
    frames: [
      { art: 'window', tone: 'citrine', kicker: 'Tonight’s Whimsy Walk', big: 'Count 10 lit windows.', small: 'Ten minutes. Any street.' },
      { art: 'window', tone: 'citrine', big: 'How many did you find last time?', sticker: { type: 'slider', q: 'Windows spotted', max: 10 } },
      { art: 'phone', tone: 'glow', big: 'Every window has a story.', sticker: { type: 'link', label: 'Open Tonight’s Walk' } },
    ],
    why: 'A daily, tiny, no-pressure reason to open the app. Whimsy Walks already has one for every night.',
    measure: 'Slider taps; walks started that evening.',
  },
  {
    id: 'first-snow', section: 'back', format: 'post',
    title: 'The first snow walk',
    blurb: 'A seasonal post for the first snowfall.',
    slides: [
      { art: 'snow', tone: 'sapphire', kicker: 'First snow', big: 'Every footprint is a clue tonight.', small: 'Wrap up. The story is outside.' },
    ],
    caption: 'First snow in Edmonton. Best night of the year for a mystery walk.',
    tags: '#yegsnow #storycity #walkthestory #winterwalk',
    why: 'Seasonal moments get shared, and winter is when walking apps lose people. This makes the cold part of the story.',
    measure: 'Shares on the day; walks started that night.',
  },

  /* ---------- from Help me choose a story ---------- */
  { id: 'rooms', section: 'chooser', format: 'carousel', chooser: 'rooms', title: 'Rooms carousel', blurb: 'Which room do you sleep in tonight? Six rooms, one pick.' },
  { id: 'doors', section: 'chooser', format: 'carousel', chooser: 'doors', title: 'Real doors', blurb: 'Six doors from real streets. Which one do you knock on?' },
  { id: 'windows', section: 'chooser', format: 'carousel', chooser: 'windows', title: 'Lit windows', blurb: 'Four windows glowing at night. What is happening inside?' },
  { id: 'first-lines', section: 'chooser', format: 'carousel', chooser: 'first-lines', title: 'First lines', blurb: 'Five opening sentences. Keep reading the one that grabs you.' },
  { id: 'poll-chain', section: 'chooser', format: 'story', chooser: 'poll-chain', title: 'Poll-sticker chain', blurb: 'Five story slides with native polls and a “mostly A” reveal.' },
  { id: 'sound', section: 'chooser', format: 'carousel', chooser: 'sound', title: 'Sound pick', blurb: 'Swipe through four places with the sound on. Stay in the one you like.' },
  { id: 'door-of-day', section: 'chooser', format: 'post', chooser: 'door-of-day', title: 'Door of the Day', blurb: 'One door, one story, everyone gets the same one today.' },
  { id: 'blind-date', section: 'chooser', format: 'post', chooser: 'blind-date', title: 'Blind date with a story', blurb: 'Brown paper, three hints, one first line. Tear to reveal.' },
];
