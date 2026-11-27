// Everyday Story City: every word on screen lives here. Edit copy freely; the JS only reads it.
// Rules: buttons in Title Case, 1–3 words, named for what happens next. Story titles in Title Case.
// Headings in sentence case. No emoji in headings or buttons. No streaks, no "you missed".
// Spaced em dash " — " in copy, en dash for ranges. Canadian spelling.
// Lines marked (real) are today's app copy from release/4.28.0 en.json (03-design.md).

export const APP = {
  title: 'Story City · Everyday',
  version: 'Version 4.29.0 (mockup)',
  rig: { name: 'Everyday Story City', tag: 'Mockup', journeys: 'Journeys', options: 'Team Options', reviewer: 'Reviewer' },
  back: 'Back',
  close: 'Close',
  done: 'Done',
  mock: 'Mockup',
};

// ---------- reviewer aids ----------
export const RIG = {
  journeysTitle: 'Journeys',
  journeysSub: 'Jump to a player’s start state. Each sets the time, weather, place, day and account. This starts the journey fresh.',
  optionsTitle: 'Team options',
  optionsSub: 'Open questions, shown as switches. Defaults are a sensible guess, not a decision.',
  reviewerOn: 'Reviewer mode on: dashed notes show what each screen solves and where each decision came from.',
  reviewerOff: 'Reviewer mode off.',
  reset: 'Reset All',
  stateKicker: 'Right now in this mockup',
  stateLine: (s) => `${s.timeLabel} · ${s.weatherLabel} · ${s.placeLabel} · day ${s.day}${s.away ? ` · back after ${s.away} days` : ''}`,
  nextDay: 'Next Day',
  later: '+3 h',
  laterLabel: 'Later Today (+3 hours)',
  nextDayLabel: 'Next Day: keeps everything, moves to 8 am tomorrow',
  timeK: 'Move time',
  timeSub: 'Next Day keeps every gem, seal, find, friend and setting, and adds what happened overnight. Later Today moves the clock 3 hours.',
  screens: 'Every Screen',
  screensTitle: 'Every screen',
  screensSub: 'Tap one to jump there. Back always returns you.',
};

// ---------- tab bar ----------
export const TABS = {
  today: 'Today', home: 'Home', map: 'Map', library: 'Library', feed: 'Feed', you: 'You',
  stories: 'Stories', gems: 'Gems', whimsy: 'Whimsy Walks', go: 'Go',
};
export const STEPPILL = {
  line: (n, goal) => `${n} out of ${goal} steps today`, // (real) "out of {{target}} steps today"
  off: 'Steps off · Tap to enable', // (real)
};

// ---------- the first landing after the FTUE ----------
export const SUMMONS_END = {
  header: 'The Summons',
  chapter: 'The mailbox',
  status: 'CODE ACCEPTED',
  lines: [
    { who: 'narr', t: 'You slide the letter through the slot and type the six numbers from the wax seal.' },
    { who: 'char', t: 'Code accepted.' },
    { who: 'narr', t: 'The ground hums. A trap door beside the mailbox slides away with a soft snick.' },
    { who: 'char', t: 'Don’t panic. The ground is supposed to do that.' },
    { who: 'char', t: 'The stairs go down further than you’d think.' },
  ],
  from: 'Wren',
  next: 'Go Down the Stairs',
};

export const VICTORY = {
  kicker: 'Ending found',
  title: 'You found one of our hideouts!', // (real, SC-3874)
  sub: 'Impressive. Welcome to the team.', // (real, SC-3874)
  endings: (n, of) => `${n} of ${of} endings`,
  endingName: 'Welcome to the Society',
  end: 'End Story', // Oct 28: "End Story", not "Continue"
};

// the app's helper bot (tips, picks outside a story) — Melissa, Nov 4
export const BOT = 'Bookerton';

export const RECS = {
  kicker: 'From Wren',
  // Oct 28 decided copy
  line: 'Got a taste for secrets? Why not try solving a murder? Or stopping a Wonderland invasion?',
  title: 'Good places to start',
  learn: 'Learn More',
  start: 'Start',
  library: 'See the Whole Library',
  heart: 'Add to Wish List',
  hearted: 'On your Wish List',
  why: {
    incident: 'Solve a murder · plays anywhere',
    alice: 'Stop a Wonderland invasion · needs a park',
  },
};

export const TRIAL = {
  kicker: 'The Society’s archive',
  title: 'Turn Your Steps into Adventures', // A/B winner
  cliff: 'Every story’s chapter 2 is a short walk away. Someone’s waiting.',
  lead: (d) => `Everything below is yours for ${d} days.`,
  perks: ['Every full-length adventure', 'Play Anywhere, Passport and local stories', 'Your gems and progress, kept'],
  timeline: (d, price, remind, end) => [
    { k: 'Today', t: 'Everything unlocked' },
    { k: `Day ${d - 2}`, t: `We remind you · ${remind}` },
    { k: `Day ${d}`, t: `${price} starts · ${end}` },
  ],
  storeCurrency: 'Your store shows the price in your currency before you pay.',
  storePrice: { year: 'Yearly price in your currency', month: 'Monthly price in your currency' },
  goPrice: (p) => `Then ${p}. Cancel before and you pay nothing.`,
  notifK: 'Want that reminder?',
  notif: 'We promised to remind you 2 days before the trial ends. That needs notifications.',
  notifYes: 'Allow Notifications',
  notifNo: 'Remind Me by Email',
  second: {
    kicker: 'Chapter 2 is a short walk away',
    title: 'Keep this story, or unlock them all',
    lead: 'Without an account you can keep one premium story free. Or try everything.',
    keep: 'Keep This Story',
    kept: 'Kept. This story is yours.',
  },
  plans: [
    { id: 'year', name: 'Yearly', price: '$34.99 a year', per: 'About 67¢ a week', best: 'Best value' },
    { id: 'month', name: 'Monthly', price: '$4.99 a month', per: 'About $1.15 a week' },
  ],
  trust: 'We’ll remind you 2 days before. Cancel any time in your App Store settings.',
  trustAndroid: 'We’ll remind you 2 days before. Cancel any time in Google Play.',
  go: 'Start Free Trial',
  notNow: 'Not Now',
  restore: 'Restore Purchases',
  started: 'Trial started. Everything’s unlocked.',
  family: { onephone: 'One membership covers the family on one phone.', everyone: 'One membership covers everyone walking with you, up to 4 phones.' },
  close: 'Close',
  help: {
    title: 'What would help?',
    sub: 'No wrong answer. It changes what we show you next.',
    rows: [
      { id: 'more', t: 'I want to try more first', s: 'Chapter 1 of every story stays free.' },
      { id: 'walk', t: 'I’m not walking right now', s: 'Stories play from the sofa too.' },
      { id: 'price', t: 'It’s the price', s: 'Yearly works out to about 67¢ a week.' },
    ],
  },
};

export const ACCOUNT = {
  kicker: 'Save your progress',
  title: 'Keep your steps and gems safe',
  pre: 'A free account keeps your chapters, steps and gems safe on any phone.',
  re: 'You skipped this at the start. Fair. Your first gem and your Summons ending are only on this phone until you sign up.',
  apple: 'Continue with Apple',
  google: 'Continue with Google',
  email: 'Continue with Email',
  skip: 'Skip for Now',
  done: 'Signed in. Your progress is saved.',
  note: 'No pictures, no pressure: the app’s own sign-up drawer (Oct 8).',
  order: ['Welcome', 'Create an account', 'The Summons', 'Trial at the end'],
  orderKicker: 'Nov 3 order',
  inside: {
    status: 'GEM FOUND',
    line: 'The hiding spot: saved, but only on this phone.',
    title: 'Save your first gem?',
    sub: 'Make a free account so it’s not just on this phone. Skip and it stays here.',
  },
};

// ---------- Today ----------
export const TODAY = {
  kicker: (d) => `Today · ${d}`,
  hello: { morning: 'Good morning', midday: 'Good afternoon', evening: 'Good evening', night: 'Still up' },
  firstKicker: 'Welcome to the Society',
  firstTitle: 'Here’s today.',
  firstTip: 'Three small things a day. Do one, do all three, or none. That’s it.',
  living: 'Overheard',
  doors: {
    story: 'Your story',
    storyFirst: (who) => `${who}’s pick for your first full story`,
    whimsy: 'Today’s Whimsy Walk',
    mission: '1-minute mission',
  },
  storyMeta: (ch, of) => `Chapter ${ch} of ${of}`,
  away: (txt) => `Next stop: ${txt} away`,
  keep: 'Keep Going',
  startIt: 'Start Chapter 1',
  previously: 'Previously On…',
  previouslyLine: 'Back in the story in twenty seconds.',
  whimsySame: 'Same walk for everyone today',
  doIt: 'Do It Now',
  remind: 'Remind Me Later',
  remindQuiet: 'That’s in your quiet hours. Tomorrow at 7:30 am instead.',
  reminded: 'Okay. One nudge, in an hour.',
  sealed: 'Tomorrow’s is sealed.',
  missionTitle: 'No time for a walk today? Wanna bet?',
  missionLine: 'Take 10 steps. Photograph something green. You’re done.',
  imIn: 'I’m In',
  notToday: 'Not Today',
  thatsToday: 'That’s today.',
  thatsTodaySub: 'Nothing else to scroll. Go see what’s out there.',
  fits: 'What Fits Right Now?',
  roulette: 'Route Roulette',
  week: 'This week',
  weekLine: (w, c, g) => `${w} ${w === 1 ? 'walk' : 'walks'} · ${c} ${c === 1 ? 'chapter' : 'chapters'} · ${g} new ${g === 1 ? 'gem' : 'gems'}`,
  weekNote: 'Days you walked light up. That’s all it counts.',
  favourKicker: 'A favour',
  three: {
    kicker: 'Today’s 3 challenges',
    items: [
      { t: 'Find something orange', s: 'Colour hunt · 2 min', jewel: '#FA7423' },
      { t: 'Walk 1 km a new way', s: 'Whimsy Walk · 12 min', jewel: '#35C6D7' },
      { t: 'Save a gem', s: 'Any spot you love · 1 min', jewel: '#00CD9D' },
    ],
  },
  // feature nudges: a slim strip, dismissable, never shown again once used (Melissa, Nov 5)
  nudge: {
    together: { t: 'Walking with someone? One phone starts.', b: 'Start a Walk' },
    live: (who) => ({ t: `${who} is on today’s walk, 400 m away.`, b: `Join ${who}` }),
    pick: { t: 'Not sure what to do? Three taps, one pick.', b: 'Help Me Pick' },
    roulette: { t: 'Bored of your block? Let the app pick the turns.', b: 'Route Roulette' },
    x: 'Hide this tip',
  },
  newsGroups: { mine: 'Your gems', friends: 'Friends', near: 'Near you', coming: 'Coming up' },
  // Card options view (#cards): the undecided Today cards as A / B / C (Melissa, Nov 5)
  cards: {
    k: 'Today · card options',
    title: 'Card Options',
    sub: 'Each undecided card, three ways, with the same content as Today. Reply with the letters, like “Whimsy B, nudge C”.',
    back: 'Back to Today',
    decided: 'decided',
    option: 'option',
    types: { story: 'Story card', line: 'Character line', whimsy: 'Whimsy Walk', mission: 'Mini Mission', nudge: 'Feature nudge', news: 'News list' },
    notes: {
      whimsy: { a: 'Illustration left, text right: the mirror of the story card.', b: 'Same layout as the mission; told apart by colour (citrine to emerald) and size.', c: 'Wide card, big illustration on top.' },
      mission: { a: 'Same family as Whimsy A, smaller, no illustration.', b: 'Same layout as Whimsy B, in amethyst, smaller.', c: 'A compact pill with a tiny icon.' },
      nudge: { a: 'A slim strip: icon, one line, one small button.', b: 'Small tiles with a line drawing.', c: 'A speech bubble from Bookerton.' },
      news: { a: 'A plain list with dividers.', b: 'Grouped under small headings.', c: 'A sideways scroll of small tiles.' },
    },
  },
};

// weather and daylight twists (new idea #4)
export const WEATHER = {
  labels: { clear: 'Clear', cloud: 'Cloudy', rain: 'Rain', snow: 'Snow', cold: 'Bitter cold', hot: 'Hot', storm: 'Storm' },
  daylight: (m) => `${m} min of daylight left`,
  preDawn: (t) => `Still dark · sunrise ${t}`,
  light: (t, m) => (m > 90 ? `Sunset ${t} · about ${Math.round(m / 60)} hours of light` : `Sunset ${t} · ${m} min of light`),
  dark: 'After dark',
  flips: {
    rain: { k: 'Rain Edition today', t: 'It’s raining. Your story has a few extra lines for the rain.', a: 'Play Indoors', b: 'Going Out Anyway' },
    cold: { k: 'Minus thirty?', t: 'Steps in the living room still count. Tonight’s chapter plays from the couch.', a: 'Play Indoors', b: 'Going Out Anyway' },
    snow: { k: 'Icy out?', t: 'The sofa version is ready. Or walk carefully: fresh snow, every footprint the first.', a: 'Play Indoors', b: 'Go Out Anyway' },
    storm: { k: 'Stay in tonight', t: 'Thunder on the way. The story waits; the sofa version is ready.', a: 'Play Indoors', b: 'Remind Me Later' },
    dusk: { k: 'Light is going', t: (m) => `${m} minutes of light left: a short loop near home, or the sofa version?`, a: 'Short Loop', b: 'Play at Home' },
    dark: { k: 'It’s dark out', t: 'Stay on lit streets you know, or play at home. Both count.', a: 'Lit Streets Only', b: 'Play at Home' },
    predawn: { k: 'Still dark', t: (t) => `Sunrise is at ${t}. Lit streets you know, or play at home until it’s light.`, a: 'Lit Streets Only', b: 'Play at Home' },
    ruralDark: { k: 'No streetlights out here', t: 'Wear something bright, take a light and walk facing traffic. Or play at home.', a: 'Bring a Light', b: 'Play at Home' },
    hot: { k: 'Hot out', t: 'Shade route, or the evening when it cools down. Bring water.', a: 'Shade Route', b: 'Later Tonight' },
    notNow: 'Not Now',
  },
  rainLine: 'Rain Edition',
};

// What Fits Right Now? (new idea #1)
export const FITS = {
  kicker: 'What fits right now?',
  title: 'Three taps. One story.',
  time: 'Time',
  times: [{ id: 5, t: '5 min' }, { id: 15, t: '15 min' }, { id: 30, t: '30 min' }, { id: 45, t: '45+' }],
  energy: 'Energy',
  energyQ: 'How much energy do you have?',
  // ids kept from the old Stroll / Brisk; Low replaces Sit Down and Unmotivated (Melissa, Nov 4)
  energies: [{ id: 'empty', t: 'None' }, { id: 'low', t: 'A Little' }, { id: 'stroll', t: 'Some' }, { id: 'brisk', t: 'Lots' }],   // Melissa, Nov 4
  lowHook: 'Short, and it starts with a mystery. Just get out the door.',
  lowShort: 'Short, and it starts right at your door. Ten minutes and you’re in.',
  lowDoor: 'It starts at your door, and you can stop after any chapter.',
  lowSit: 'No walking needed. Put your feet up and read.',
  lowCafe: 'One short walk to a café, then you sit.',
  weather: 'Weather',
  weatherAuto: 'read automatically · tap to change',
  company: 'Company',
  companies: [{ id: 'solo', t: 'Just Me' }, { id: 'kids', t: 'With Kids' }, { id: 'friends', t: 'With Friends' }, { id: 'date', t: 'Date' }],
  go: 'Show My Pick',
  pickKicker: 'Your pick',
  alts: 'Or one of these',
  because: 'Because',
  open: 'Open Story',
  again: 'Change Answers',
};

// ---------- story cards, badges ----------
export const CARD = {
  free: 'Chapter 1 free',
  included: 'Included',
  coming: (d) => `Coming ${d}`,
  ep: (n) => `Episode ${n}`,
  badges: {
    anywhere: 'Starts at your door',
    nearyou: (place) => `Needs ${place} nearby`,
    passport: (city) => `A virtual walk of ${city}`,
    localNear: (place, min, how) => `Lives at ${place} · ${min} min ${how}`,
    town: 'Needs a town: cafés or shops',
    localFar: (city) => `Lives in ${city}`,
    sit: 'No walking needed',
    cafe: 'Walk to a café, then sit',
  },
  cats: {
    four: { anywhere: 'Play Anywhere', nearyou: 'Plays Near You', passport: 'Passport', local: 'Local Original' },
    three: { anywhere: 'Play Anywhere', nearyou: 'Play Anywhere', passport: 'Passport', local: 'Local' },
  },
  catMeans: {
    anywhere: 'Plays wherever you are. No special place needed.',
    nearyou: 'Needs a kind of place, like the nearest park. We place it near you.',
    passport: 'Written for a real city. Your streets stand in for theirs.',
    local: 'Written for one real place, with real stops.',
  },
  interScale: { 1: 'Light', 2: 'Some', 3: 'Lots' },   // + Just Listen for audio walks (core.js interScale)
  formats: { chat: 'Chat story', audio: 'Audio walk', hunt: 'Puzzle hunt', text: 'Read-along' },
};

// ---------- Library ----------
export const LIBRARY = {
  title: 'Library',
  search: 'Search stories, places, moods',
  moods: ['Rainy day', 'Date night', 'Spooky', 'Puzzles'],
  filters: [
    { id: 'near', t: 'Near Me' },
    { id: 'tread', t: 'Treadmill' },
    { id: 'stepfree', t: 'Step-Free' },
    { id: 'home', t: 'At Home' },
    { id: 'short', t: 'Under 20 Min' },
    { id: 'kids', t: 'With Kids' },
    { id: 'steps', t: 'Works With Steps' },
  ],
  rows: {
    progress: 'In progress', // (real) "In Progress"
    upnext: 'Up next',
    mylist: 'Wish List',
    mylistEmpty: 'Tap ♡ on any story to save it here.',
    coming: 'Coming soon',
    anywhere: 'Play Anywhere adventures', // (real) "Play Anywhere Adventures"
    nearyou: 'Adventures near you', // (real)
    passport: 'Passport adventures', // (real)
    local: 'Local Originals near you',
    localFar: 'Local Originals in other cities',
    sit: 'No walking needed',
    together: 'Play together',
    seasonal: 'Seasonal',
    whimsy: 'Whimsy Walks',
    finished: 'Finished',
    creator: 'Creator adventures', // (real) "Creator Adventures"
  },
  passportTip: 'Travel the world without leaving your city.', // (real, Emily's edit)
  empty: 'No matching adventures found', // (real)
  emptySub: 'Try At Home or Treadmill. Any Play Anywhere story starts at your door.',
  results: (n, q) => `${n} ${n === 1 ? 'story' : 'stories'} for “${q}”`,
  clear: 'Clear',
  view: { shelves: 'Shelves', feed: 'Feed', swipe: 'One at a Time' },
  feedStart: 'Start Adventure',          // real app: stories.start
  feedHear: 'Hear It',
  feedPlaying: (who) => `Playing ${who}…`,
  feedNoVo: 'Voice line to record',
  feedVoAudio: 'From the story’s own audio',
  feedEnd: 'You’ve seen them all. New stories land here first.',
  swipeHint: 'Swipe or tap the arrows',
  next: 'Next',
  prev: 'Previous',
  endings: (n, of) => `${n} of ${of} endings found`,
  doAnother: 'Do Another One',
  seeAll: 'See All',
};

// ---------- Feed ----------
export const FEED = {
  title: 'Feed',
  sub: 'Friends, finds and the people who write the stories.',
  todayTop: 'Today’s Whimsy Walk',
  friends: 'Friends',
  friendsOnly: 'Friends only',
  community: 'Finds near you',
  characters: 'From the stories',
  creators: 'Creators',
  newStories: 'New and coming',
  cheer: 'Cheer',
  cheered: 'Cheered',
  notify: 'Notify Me',
  notified: 'We’ll tell you Nov 12.',
  caught: 'You’re all caught up.',
  caughtSub: 'That’s the whole feed. Go find something for it.',
  addFriend: 'Add a Friend',
  posts: [
    { kind: 'friend', who: 'Ama K.', what: 'walked the Coin-Flip Walk', detail: '11 flips, 6 heads, 1 dead end. The doodle looks like a duck.', when: '1 h', jewel: '#BED13F' },
    { kind: 'friend', who: 'Jules', what: 'found ending 2 of 3 in The Summons', detail: 'No spoilers. There’s more than one way out.', when: '3 h', jewel: '#FA7423' },
    { kind: 'character', who: 'Wren', story: 'The Summons', what: 'Someone left a mailbox flag up on your street.', detail: 'Not me. Probably not me.', when: '5 h', jewel: '#FA7423' },
    { kind: 'community', who: 'A gem near you', what: 'Little free library, green door', detail: 'Curiosities · public · 400 m away', when: 'today', gem: 'curio', gemId: 'g6' },
    { kind: 'friend', who: 'Ama K.', what: 'left a gem for friends: the koi drain cover', detail: 'Friends only. A 4-minute walk from you.', when: '2 h', gem: 'art', gemId: 'g7' },
    { kind: 'character', who: 'Sir Wendell', story: 'A Knight Needs Your Help', what: 'The dragon napped in the tallest tree again.', detail: 'It fears cats. Keep one handy.', when: 'yesterday', jewel: '#BED13F' },
    { kind: 'creator', who: 'Kevin · DiceCreamSandwich', what: 'The Balthazar Job', detail: 'A new creator adventure, coming Nov 12.', when: 'Nov 3', jewel: '#DA82ED', story: 'balthazar' },
    { kind: 'creator', who: 'Human Rights Foundation', what: 'Dictators Laundromat', detail: 'No walking needed. Four ranked endings. Free.', when: 'this week', jewel: '#93DC5E', story: 'laundromat' },
    { kind: 'new', who: 'Story City', what: 'Tales from the Incident', detail: 'Episodes 1–4 are live. Episodes 5 and 6 are on the way.', when: 'this month', jewel: '#9883F8', story: 'incident' },
  ],
};

// ---------- Map tab ----------
export const MAP = {
  title: 'Your map',
  filters: [{ id: 'mine', t: 'My Gems' }, { id: 'all', t: 'All Gems' }, { id: 'every', t: 'Everything' }],
  fogOn: 'Fog On',
  fogOff: 'Fog Off',
  uncovered: (p) => `${p}% of your neighbourhood uncovered`,
  uncoveredSub: 'Measured inside a 1 km circle, so every street counts.',
  homeBubble: 'Home bubble',
  homeBubbleSub: 'Your home stays private: we blur the 200 m around it, and nobody else sees this map.',
  homeHidden: 'Your home is hidden.',
  homeHiddenSub: 'We blur the area around it here, on postcards and on anything you share.',
  homeShownChoice: 'Only you see your home. Turn on Hide My Home in Settings to blur it.',
  homeShownShare: 'Only you see your home. Anything you share blurs it.',
  visiting: (c) => `Visiting ${c}`,
  visitingSub: 'Visiting mode: no home bubble, no fog. Story starts sorted by walk time from you.',
  padFog: 'Pad steps don’t clear fog. They light up your next story stop instead.',
  frontierK: 'This week’s frontier',
  frontier: (st) => `Something is glinting on ${st}.`,
  frontierSub: 'Walk it before Sunday and see what it is.',
  frontierGo: 'Take Me Past It',
  nearList: 'Plays near you',
  nearListSub: 'Placed for you when you start. No pins, no spoilers.',
  startsList: 'Story starts on this map',
  cook: 'Cook Up a Route',
  legend: { gem: 'Gem', start: 'Story start', whimsy: 'Whimsy start', you: 'You', mine: 'yours', private: 'private' },
  emptyRural: 'No stops here yet. Any story can start at your door.',
  ruralFallback: 'Out here, stories use what you have: fence posts, a big tree, a road sign.',
  routePreview: (km, min, n) => `${km} km · about ${min} min · ${n} stops`,
  routeNote: 'Long-press showed this: the route as unnamed dots, no spoilers.',
  safety: 'Public place · daylight-friendly',
  moveStop: 'Move This Stop',
  report: 'Report a Problem',
  openStory: 'Open Story',
  locate: 'Recenter',
};

// ---------- Gems ----------
export const GEMS = {
  types: {
    nature: { name: 'Nature', look: 'Emerald leaf' },
    art: { name: 'Art', look: 'Turquoise pebble' },
    landmark: { name: 'Landmarks', look: 'Amber shard' },
    shop: { name: 'Eat & Shop', look: 'Ruby wide cut' },
    curio: { name: 'Curiosities', look: 'Amethyst tall trio' },
  },
  vibes: ['Cozy', 'Quiet', 'Spooky', 'Hidden', 'Wild', 'Pretty', 'Odd', 'Historic', 'Kid-approved', 'Sunny', 'Shady', 'Busy', 'Calm', 'Colourful', 'Tiny', 'Grand', 'Secret-feeling', 'Good for a sit'],
  saveKicker: 'Save a gem',
  saveTitle: 'Keep this spot',
  name: 'Name it',
  namePh: 'e.g. The hydrant who cried',
  type: 'What kind of place?',
  vibesLabel: 'Pick up to 3 vibes',
  privacy: 'Who can see it?',
  private: 'Just Me',
  friends: 'Friends',
  oneFriend: 'One Friend',
  teenNote: 'Under 16: gems stay with you or your friends.',
  blur: 'We blur faces before anyone else sees it.',
  noHidden: 'Shared gems skip “Hidden” and “Secret-feeling”. Public places only.',
  public: 'Everyone',
  privateNote: 'Private by default. Public gems must be public places.',
  save: 'Save Gem to My Map', // Oct 23: explicit tap
  created: 'GEM CREATED', // Nov 3: caps, no name
  goTo: 'See It on My Map',
  polaroidNote: 'Your photo here',
  detailMine: 'Your gem',
  detailPublic: 'A public gem',
  first: 'Your first gem: saved on your map.',

  // ---- the whole gem flow (reports/gems/research.md, Nov 4)
  start: { k: 'Save a gem here', title: 'Keep this spot', snap: 'Snap It', snapSub: 'Photo + this spot', just: 'Just Save It', justSub: 'This spot, no photo', justOne: 'This spot, one tap', note: 'Private to you until you choose. You can change it any time.', later: 'Private to you. Name it, pick a type or share it later from You.' },
  snapK: 'Snap a gem',
  snapHint: 'Frame the spot, not the people.',
  usePhoto: 'Use This Photo',
  retake: 'Retake',
  noCam: 'No Camera? Describe It',
  here: 'Saved where you’re standing',
  nudge: 'Nudge the Pin',
  nudgeK: 'Exact spot',
  nudgeTitle: 'Nudge the pin',
  nudgeSub: 'A gem is one exact point, not an area. Move it onto the spot.',
  nudgeDone: 'Done',
  steps: ['Details', 'Who sees it'],
  photoLabel: 'Photo',
  noPhoto: 'No photo yet',
  addPhoto: 'Add a Photo',
  noteLabel: 'What makes this spot special?',
  notePh: 'It looks like it’s crying. Every single day.',
  noteMax: 180,
  seasonLabel: 'Just for this season',
  seasonSub: 'It fades on Dec 21. Good for lights, leaves and pumpkins.',
  next: 'Next: Who Can See It',
  saveChanges: 'Save Changes',
  whoTitle: 'Who can see it?',
  who: {
    me: { t: 'Just Me', s: 'Only on your map. Nobody else knows it’s there.' },
    friend1: { t: 'One Friend', s: 'Leave it for one friend to find.' },
    friends: { t: 'Friends', s: 'People you’ve added. Not their friends.' },
    all: { t: 'Everyone', s: 'On the map for every player nearby.' },
  },
  whoShort: { me: 'Only you', friend1: (n) => `Only you and ${n}`, friends: 'You and your friends', all: 'Every player nearby', theirs: (b) => `${b} and their friends, like you` },
  friendNames: ['Ama K.', 'Jules', 'Theo'],
  pickFriend: 'Which friend?',
  blocks: {
    home: 'Too close to home to share. Gems in your home bubble stay with you.',
    homePublic: 'Public gems can’t be at a home. Keep this one to you or your friends.',
    teen: 'Under 16: gems stay with you or your friends.',
    school: 'Schools and daycares can’t hold public gems.',
  },
  checksK: 'Before anyone else sees it',
  checks: {
    place: (p) => `A public place: ${p}`,
    bubble: 'Outside your home bubble',
    faces: 'Faces blurred before anyone sees it',
    vibes: '“Hidden” and “Secret-feeling” come off',
    review: 'A person checks it first, usually within a day',
    report: 'Anyone can report it, and it hides at once',
    claim: 'Local businesses can claim their own spot',
    friendsOnly: 'Only friends you’ve added',
  },
  spots: { walk: 'Out on a walk', home: 'At home', school: 'In a schoolyard' },
  spotPlace: { walk: 'the path by the park', home: 'near home', school: 'a schoolyard' },
  mockK: 'Mockup: where are you standing?',
  changeLater: 'You can change this any time.',
  madeK: 'GEM CREATED',
  madeLine: {
    me: 'It’s on your map. Only you can see it.',
    friend1: (n) => `It’s waiting for ${n}. Nobody else can see it.`,
    friends: 'It’s on your map, and your friends can see it now.',
    all: 'It’s on the map for every player nearby.',
    review: 'It shows for everyone once a person has checked it.',
  },
  share: 'Share Your Gem with a Friend',
  backStory: 'Back to the Story',
  done: 'Done',
  rarityStart: { finds: 'Every shared gem starts Rough. It gets rarer as people find it.', votes: 'Every shared gem starts Common. Votes move it up.' },
  guest: 'Saved on this phone for now. Make a free account so your gems are still here tomorrow.',
  guestBtn: 'Keep My Gems',
  shareK: 'Share a gem',
  shareTitle: 'Send it to a friend',
  shareSub: 'They get a link to this one gem. Your other gems stay yours.',
  send: 'Send',
  copy: 'Copy Link',
  moreApps: 'More Apps',
  sent: (n) => `Sent to ${n.replace(/\.$/, '')}. Only they can open it.`,
  copied: 'Link copied. It opens this one gem.',
  view: { mine: 'Your gem', by: (b) => `Left by ${b}`, friend: (b) => `From ${b}, a friend` },
  away: (m) => `${m} min walk`,
  whoK: 'Who can see it',
  change: 'Change',
  edit: 'Edit',
  remove: 'Remove',
  takeMe: 'Take Me There',
  takeMeDone: 'Walking line on. Your map shows the way.',
  saveLater: 'Save for Later',
  savedLater: 'Saved',
  foundIt: 'I Found It',
  foundTip: 'Be there to tap this. It counts when you’re within 30 m.',
  found: (n) => `Found. You’re finder number ${n}.`,
  foundAlready: 'Found It',
  cheer: 'Cheer',
  cheered: 'Cheered',
  stats: (f, c) => `${f} found it · ${c} ${c === 1 ? 'cheer' : 'cheers'}`,
  reactions: [{ id: 'walk', t: 'Worth the Walk' }, { id: 'smile', t: 'Made Me Smile' }, { id: 'learn', t: 'Learned Something' }],
  reactK: 'Leave a reaction',
  commentsK: 'Comments',
  friendsCommentsK: 'Comments from friends',
  commentPh: 'Say something kind',
  post: 'Post',
  posted: 'Posted. Only friends see it.',
  postedAll: 'Posted.',
  noComments: 'No comments yet. Be the first.',
  friendsNone: 'Only your friends’ comments show here. None yet.',
  votesK: 'Is this a good gem?',
  up: 'Vote up',
  downV: 'Vote down',
  reportLink: 'Report This Gem',
  reportK: 'Report a gem',
  reportTitle: 'What’s wrong with it?',
  reportRows: [
    { t: 'Private home', s: 'It’s someone’s house or yard.' },
    { t: 'Not safe', s: 'A busy road, a cliff edge, a building site.' },
    { t: 'Gone', s: 'The thing isn’t there anymore.' },
    { t: 'Not nice', s: 'Mean, rude or not for kids.' },
  ],
  reportNote: 'It hides for you straight away and a person checks it. Reports from several people take it off the map.',
  reportDone: 'Thanks. It’s hidden while we check.',
  removeTitle: 'Remove this gem?',
  removeSub: 'It leaves your map. Its finds and cheers go with it.',
  removeYes: 'Remove Gem',
  removeNo: 'Keep It',
  removed: 'Gem removed.',
  seasonal: (d) => `Just for this season · fades ${d}`,
  fadeIn: (n) => `Fades in ${n} days unless someone finds it. Every find resets the clock.`,
  tiers: { finds: ['Rough', 'Fine', 'Flawless', 'Perfect'], votes: ['Common', 'Rare', 'Epic', 'Legendary'] },
  tierLine: (t, f) => `${t} · ${f} ${f === 1 ? 'finder' : 'finders'}`,
  rarityK: 'How rarity works',
  rarityBtn: 'How Rarity Works',
  rarityTitle: 'Gems get rarer as people find them',
  raritySub: {
    finds: 'Every shared gem starts Rough. It moves up when different people walk there and tap I Found It, plus cheers over time. Never by luck, never by type.',
    votes: 'Every shared gem starts Common. People vote it up to Rare, Epic and Legendary.',
  },
  rarityHow: { finds: ['Rough: just shared', 'Fine: about 5 finders', 'Flawless: about 15 finders', 'Perfect: 40 finders or more'], votes: ['Common: just shared', 'Rare: 8 votes', 'Epic: 30 votes', 'Legendary: 100 votes'] },
  rarityFilter: 'Rarity is a map filter, not a badge. Tap Rarest on your map.',
  rarityPrivate: 'Private gems don’t get rarer: nobody else can find them.',
  rareChip: 'Rarest',
  nearK: 'Gems within 5 minutes',
  openGem: 'Open Gem',
  stampsLine: 'You choose who sees each gem.',
  stampsTeen: 'Under 16, never Everyone.',
  madeFound: (m, f) => `Made ${m} · Found ${f}`,
  seeGem: 'See the Gem',
  newGem: 'Save a New Gem',
};

// ---------- Story overview ----------
export const OVERVIEW = {
  loading: 'Loading the rest…',
  ready: 'You can start now',
  hookKicker: 'Cold open',
  facts: { min: 'min', minEach: 'min each', chapters: 'chapters', chapter: 'chapter', endings: 'endings', ending: 'ending', eps: 'episodes' },
  catKicker: 'What kind of story',
  modesKicker: 'Plays in',
  modeShort: { walk: 'Any direction', path: 'Follow the pin', hunt: 'Find & snap' },
  bestFit: 'Best fit',
  bestWhy: { walk: 'Plays anywhere, so Steps fits best: walk any direction.', hunt: 'Plays near you, so Hunt fits best: head to the kinds of places it needs.', path: 'Lives in a real place, so Path fits best: follow its route.' },
  modeOffTip: {
    none: 'This story has no walking. It’s all dialogue and choices.',
    local: 'This story needs its real stops. Path leads you there.',
    passport: 'Passport stories play in Steps mode. Your streets stand in for theirs.',
    nohunt: 'Nothing to photograph in this one. Use Steps or follow the pin.',
    nopath: 'No stops to place yet. Use Steps and walk any direction instead.',
    soon: 'Coming soon. We’re teaching the map to place single pins.',
  },
  whereKicker: 'Where it plays',
  bringKicker: 'Bring',
  stopsKicker: 'Stops',
  publicOnly: 'Public places only: parks, benches, murals, libraries.',
  madeBy: 'Made by',
  moreBy: (n) => `More by ${n}`,
  nextKicker: 'After this, try',
  premiumK: 'Premium adventure', // (real)
  premiumMember: 'Included with your subscription.', // (real)
  premiumUpsell: 'Start a free trial for unlimited premium adventures', // (real)
  free: 'Chapter 1 free',
  start: 'Start Chapter 1',
  keep: 'Keep Going',
  startEp: (n) => `Start Episode ${n}`,
  together: 'Play Together',
  togetherLink: 'Playing with others? Pick Play Together when you start',
  heart: 'Add to Wish List',
  hearted: 'On your Wish List',
  passportBanner: (c) => `You’re about to visit ${c} without leaving your city. Your local streets will stand in for ${c} as you play.`, // (real)
  localFar: (place) => `This story lives in ${place}. Walk it there, or take it home.`,
  walkThere: 'Walk It There',
  virtual: 'Virtual Walk From Here',
  virtualNote: 'You are virtually walking the real route. Your steps count the same.',
  virtualLine: 'Walk the same distance from your own door. Your steps count the same.',
  sitNote: 'A sit-down story. Read it on the sofa, the bus or at a café.',
  cafeNote: 'One short walk to a café, then sit down for the episode.',
  noneNote: 'This story has no walking. It’s all dialogue and choices.',
  seasonal: 'Seasonal · a Halloween story you can play all year',
  episodes: 'Episodes',
  epLive: 'Live',
  epSoon: 'On the way',
  comingTitle: 'Coming Nov 12',
  comingSub: 'A new story from a creator. More details on launch day.',
  notify: 'Notify Me',
  notified: 'We’ll tell you on Nov 12.',
  afterDark: 'It’s dark out. Outdoor stops stick to lit streets, or play at home.',
  offline: 'Download for Offline',
  dlLabel: (mb) => `Download · ${mb} MB`,
  dlAsk: 'You’re not on Wi-Fi',
  dlAskSub: (mb) => `This chapter with audio is ${mb} MB. Wait for Wi-Fi, or download now?`,
  dlWait: 'Wait for Wi-Fi',
  dlNow: 'Download Now',
  dlDone: (mb) => `Saved for offline · ${mb} MB. Plays with no signal.`,
  access: 'Access',
  accessUnknown: 'Not checked yet. Tell us after you walk it.',
  endingsK: 'Endings',
  endingLocked: 'Not found yet',
  findAnother: 'Find Another Ending',
  ruralStops: 'Out here: a fence post, a big tree, a road sign.',
  ruralPublic: 'Only public spots: road edges and public land. Never a yard that isn’t yours.',
  placedNear: 'Placed near you when you start: no fixed map yet.',
  startsAt: (p) => `Starts at ${p}`,
  allIn: (t, w) => `About ${t} in all · ${w} of it walking`,
  freeLine: 'Chapter 1 free · Members get the rest.',
  moreByBtn: (n) => `More by ${n}`,
  offlineDone: 'Saved for offline · 42 MB',
  lowData: 'Low-data mode: text only, about 2 MB',
  kidsNote: 'Kid Captain: your kid holds the phone and makes the calls.',
};

// ---------- Start: how are you walking today? ----------
export const START = {
  kicker: 'How are you walking today?',
  smartWhy: {
    clear: 'Clear skies. Out the door it is.',
    darkSoon: 'Dark soon. Start it from the sofa, or walk it tomorrow.',
    cloud: 'Dry for now. Out the door it is.',
    rain: 'Raining. We picked the sofa; change it if you like rain.',
    snow: 'Snowing. Out the door, or stay in. Your call.',
    cold: 'Bitter cold out. Steps around the house still count.',
    storm: 'Storm coming. The sofa version is ready.',
    hot: 'Hot out. Evening or a shade route.',
    dark: 'After dark. The sofa version is ready; lit streets you know if you go out.',
    remembered: 'Your usual. Change it any time in Settings.',
    pad: 'You usually walk on your pad.',
    virtual: 'This story lives somewhere else. Here’s the virtual walk.',
    there: 'You’re close. Walk the real route.',
    sit: 'This story has no walking. It’s all dialogue and choices.',
    cafe: 'One short walk to a café, then sit down.',
  },
  ways: {
    door: { name: 'Out the Door', line: 'Start where you’re standing. Ends wherever you stop.', meta: 'Steps mode' },
    route: { name: 'Follow a Route', line: 'Real stops near you, placed on a map.', meta: 'Path · a pin at a time' },
    tread: { name: 'Treadmill or Pad', line: 'Set your belt speed. We count every step.', meta: 'Indoor · pace' },
    sofa: { name: 'From the Sofa', line: 'Read it now. The walks become window walks.', meta: 'At home · no steps needed' },
    home: { name: 'At Home', line: 'Treadmill, walking pad or sofa. All count.', meta: 'Indoor' },
    there: { name: 'Walk It There', line: 'Go to the real place and follow the stops.', meta: 'Path · real route' },
  },
  who: 'Who',
  whoLabel: 'Who’s playing',
  justMe: 'Just Me',
  togetherLine: 'Play Together: 2–8 phones, everyone joins with a code or QR.',
  togetherDynasty: 'Play Together: 2 or 4 players, on one phone or everyone’s.',
  goTogether: 'Start Together',
  customize: 'Customize',
  hideCustom: 'Fewer Options',
  length: 'Length',
  lengths: {
    short: { name: 'Short Cut', line: 'Same story, shorter walks between chapters.' },
    written: { name: 'As Written', line: 'The way the author planned it.' },
    long: { name: 'Long Way Round', line: 'Longer walks, same words. Good for step goals.' },
  },
  lengthNote: 'Only the walking changes. The story stays the same.',
  timeFirst: 'How long have you got?',
  times: [{ id: 5, t: '5 min' }, { id: 15, t: '15 min' }, { id: 30, t: '30 min' }, { id: 60, t: '60+' }],
  fitsIn: (m, ch) => `Fits ${ch} ${ch === 1 ? 'chapter' : 'chapters'} in ${m} minutes. We’ll stop at a cliffhanger.`,
  routeLengths: 'Route length',
  routes: [
    { id: '1loop', t: '1 km Loop', s: 'Ends where you start' },
    { id: '2walk', t: '2 km Walk', s: 'Out and back' },
    { id: '3loop', t: '3 km Loop', s: 'Ends where you start' },
  ],
  remember: 'Remember My Choice',
  rememberNote: 'Change it any time in Settings.',
  go: 'Start Chapter 1',
  goKeep: 'Keep Going',
  findRoute: 'Find a Route',
  lock: {
    switch: 'Switch modes anytime. Your steps always count.', // decided card line, Oct 14
    storyOnly: 'Switch modes anytime.',
    start: 'Your choice holds for this playthrough.',
    route: 'Routes lock in. Steps and Hunt stay switchable.',
  },
  kids: 'Kid Captain',
  kidsLine: 'Your kid holds the phone, makes the choices and plays spotter between stops.',
  radius: 'Stay within',
  radii: ['2 blocks', '5 blocks', '1 km'],
  tooltipSoon: 'Coming soon for this story.',
  loopBack: 'Loop Back Instead',
  loopLine: 'Ends back where you started.',
  treadMin: (m, v, ch) => `About ${m} min a chapter at ${v} km/h${ch ? ` · ${ch} chapters ≈ ${m * ch} min` : ''}`,
  sampleNote: 'A 5-minute sample. For a longer pad session, try Long Way Round or a full story.',
  kidsControl: 'You still control Stop, Skip and who sees photos.',
  wayOff: {
    route_none: 'No stops to follow in this one.',
    door_local: 'Needs its real stops. Try Walk It There or a virtual walk.',
    door_none: 'No walking in this one.',
    tread_none: 'No walking in this one.',
  },
};

export const ROUTES = {
  kicker: 'Follow a route',
  title: 'Find a route near you', // (real)
  author: 'Author’s Route', // (real)
  community: 'Community Routes', // (real)
  mine: 'My Routes', // (real)
  closest: (km) => `Closest route · ${km} km away`, // (real) "Closest route - {n} km away"
  use: 'Use This Route', // (real)
  generate: 'Cook Up a Route',
  park: 'Park Mode',
  parkLine: 'The whole route stays inside one park.',
  cooking: 'Cooking up your perfect route…', // Nov 3
  cookingSteps: ['Finding public spots', 'Skipping backyards', 'Checking the light', 'Plating it up'],
  ready: 'Your route',
  readyLine: (km, n) => `${km} km · ${n} stops · ends near where you started`,
  startHere: 'Start Here',
  another: 'Find Another Route',
  publicOnly: 'Only public spots: parks, benches, murals, libraries.',
};

// ---------- permission, in character, on the map ----------
export const PERMISSION = {
  from: 'Wren',
  line1: 'Two things:',
  line2: 'show me where you are, and let me count your steps.',
  why: 'Story City uses your location while you play to progress in the story.', // decided Oct 23
  inUse: 'While Using the App',
  steps: 'Steps Only',
  notNow: 'Not Now',
  noAlways: 'We never ask for “always”.',
  approx: 'Your location is set to approximate. We’ll count steps instead.',
  useSteps: 'Use Steps',
  openSettings: 'Open Settings',
  refusedSteps: 'No problem. We’ll count steps instead. The story keeps going.',
  refusedPush: 'Staying inside? The sofa version is right here. Or count steps only.',
};

// ---------- in-story map ----------
export const WALKMAP = {
  objective: {
    walk: 'Walk in any direction.',
    path: 'Follow the map to the pin.',
    hunt: (thing) => `Find ${thing} near you.`,
  },
  tips: {
    walk: { k: 'WALK MODE', t: 'Walk in any direction.', s: 'The circle shows how far you still need to go — it will shrink as you get closer to your goal. The next chapter will unlock when you reach it.' },
    path: { k: 'PATH MODE', t: 'Follow the map to the pin.', s: 'The line on your map shows the way — the next chapter will unlock when you arrive.' },
    hunt: { k: 'HUNT MODE', t: 'Find a place nearby that matches the story.', s: 'Take a picture of it when you get there — the next chapter will unlock once you do.' },
    ok: 'Got It', // Naming Conventions "GOT IT"
  },
  counting: 'Counting your steps now. I’ll buzz when you arrive.',
  huntLine: 'Find it, then tap Take Photo.',
  spotter: (t) => `Spotter: look for ${t}.`,
  finishHome: 'Finish at Home',
  finishHomeLine: (a, b) => `You walked ${a} of ${b}. The rest can be a window walk.`,
  blocksRural: (m) => `about ${m}`,
  pocket: 'Pocket your phone. I’ll buzz when you arrive.',
  stepsOf: (n) => `out of ${n} steps`, // (real) "out of {{goal}} steps"
  blocks: (b) => `about ${b} ${b === 1 ? 'block' : 'blocks'}`,
  metres: (m) => `${m} m to go`,
  locating: 'Locating Nearest Drop Spot…', // Path UX doc Nov 2
  hunt2: (thing) => `Have you found ${thing}?`,
  takePhoto: 'Take Photo', // (real)
  switchHint: 'Switch modes anytime. Your steps always count.', // (real)
  lockedHint: 'Mode set for this playthrough.',
  routeHint: 'On a route. Steps and Hunt stay switchable.',
  arrived: 'You’re here.',
  unlocked: 'Chapter Unlocked', // decided name
  openCh: (n) => `Read Chapter ${n}`,
  fuzzy: { k: 'GPS is fuzzy here', t: 'Close enough counts.', wait: (s) => `I’m Here appears in ${s} s`, here: 'I’m Here' },
  stopClosed: { k: 'Closed today?', t: 'I’ll find you the next-best spot.', a: 'Swap This Stop' },
  stopHere: 'Stop Here for Today',
  stopped: (n) => `Saved. Chapter ${n} picks up wherever you are next time.`,
  skip: { k: 'Skip this walk?', t: 'The chapter opens now. Your steps so far still count.', a: 'Skip for Now', b: 'Keep Walking', none: 'Skipping is off in this version. Try From the Sofa instead.' },
  skipBtn: 'Skip the Walk', // (real) "Skip the walk"
  safety: 'Public place · daylight-friendly',
  stopLong: 'Long-press any stop to move or report it.',
  mock: { ahead: 'Skip Ahead', gps: 'Weak GPS', approx: 'Approximate', closed: 'Stop Closed', label: 'Mockup controls' },
  backStory: 'Back to the Story', // (real)
  modeNames: {
    steps: { walk: 'Steps', path: 'Path', hunt: 'Hunt' },   // Walk → Steps: Melissa, Nov 4
    location: { walk: 'Steps', path: 'Location', hunt: 'Hunt' },
  },
  eyesUp: 'Eyes up. I’ll read it to you.',
  chime: 'Buzz',
};

// The in-story map as it ships today (Team Option walkMapLook = live). Every string is copied word for word
// from the live app, version 4.28.1, origin/main: src/localization/en.json (scriptedFtue.map.*, reader.walk.*,
// reader.skipSteps, common.continue). The live app still says "Walk", not "Steps" (Nov 4 rename not shipped).
export const LIVEMAP = {
  modes: { walk: 'Walk', path: 'Path', hunt: 'Hunt' },          // scriptedFtue.map.modeStep / modePath / modeHunt
  switchLabel: 'How to unlock this chapter',                     // scriptedFtue.map.modeSwitchLabel
  outOf: (g) => `out of ${g} steps`,                             // scriptedFtue.map.outOfSteps
  switchHint: 'Switch modes anytime. Your steps always count.',  // reader.walk.switchHint
  huntHint: 'Find it, then take a photo to continue.',          // reader.walk.huntHint
  lookFor: (f) => `Look for: ${f}`,                              // reader.walk.huntLookFor
  findingPlace: 'Finding a place to walk to…',                   // reader.walk.findingPlace
  pathUnavailable: 'Path isn\'t available for this adventure, please use a different mode.', // reader.walk.pathUnavailable
  unlocked: '✓ Chapter unlocked',                                // scriptedFtue.map.unlocked
  backToStory: 'Back to the story',                              // scriptedFtue.map.backToStory
  takePhoto: 'Take photo',                                       // scriptedFtue.map.takePhoto
  skip: 'Skip the walk',                                         // reader.skipSteps
  cont: 'Continue',                                              // common.continue
  satellite: 'Satellite', map: 'Map',                            // common.satellite / common.map
  route: {                                                       // reader.walk.route.*
    generated: 'Generated around you', none: 'No route chosen yet', change: 'Change route', choose: 'Choose a route',
  },
};

export const TREAD = {
  k: 'Treadmill or pad',
  yes: 'Yes, treadmill steps count.',
  yesSub: 'The next chapter’s waiting.',
  speed: 'About how fast?',
  speeds: [{ id: 3, t: '3 km/h' }, { id: 4, t: '4 km/h' }, { id: 5, t: '5 km/h' }],
  speedNote: 'Set it once. We pace the story to your belt.',
  steps: 'steps',
  left: (m) => `${m} min to the next chapter`,
  pause: 'Pause',
  resume: 'Resume',
  chase: { k: 'Chase scene', t: 'Two-minute push. The hydrant is gaining on you.' },
  map: {
    story: 'Walking the story’s own streets',
    neighbourhood: 'Walking your neighbourhood, virtually',
    fantasy: 'Walking the story’s storybook map',
  },
  haze: 'Virtual layer',
  done: 'Read the Chapter',
};

export const SOFA = {
  k: 'From the sofa',
  title: 'This walk becomes a window walk',
  window: 'Look out a window. Find something that has been there longer than you have.',
  found: 'Found It',
  orSteps: 'Or walk round the room',
  roomLine: (n) => `${n} steps around the room count too.`,
  noSteps: 'Just Read',
  noStepsLine: 'No steps today. Totally allowed.',
  carry: (a, b) => `You walked ${a} of ${b} steps. The rest is a window walk.`,
  room: 'Move round the room',
  dark: 'Look out a window. Find a light that’s on and wonder who left it.',
  readOn: 'Read On',
  doorstep: 'Do It at Your Door',
  doorstepLine: 'Doorstep mission: how many birds in 60 seconds?',
};

export const CAMERA = {
  k: 'Hunt',
  hint: 'Frame it so the story can see it. Keep faces out: it’s about the place.',
  sendIt: 'Send It', // Hunt UX doc
  retake: 'Retake',
  noCam: 'Describe It',
  noCamLine: 'No camera? Describe what you found instead.',
  skipThis: 'Skip This One',
  descPh: 'A red slide shaped like a dragon’s tongue',
  saveGem: 'Save as a Gem?',
  saveGemSub: 'Any spot from a hunt can be yours to keep.',
  noThanks: 'No Thanks',
};

// ---------- chapter reader ----------
export const READER = {
  pick: 'Pick one',
  tapMag: 'Tap to magnify',
  hint: 'Hint',
  hints: ['Hint 1', 'Hint 2', 'Solve This for Me'],
  next: (place) => `Walk to ${place}`,
  status: { walk: 'WALKING NOTIFICATION', gem: 'GEM CREATED', decrypt: 'IMAGE DECRYPTED' },
};

export const BREAK = {
  k: (n, of) => `Chapter ${n} of ${of} complete`,
  title: 'Chapter done.',
  titleWalk: 'Nice walk.',
  titleRead: 'Nice read.',
  hookK: 'Next time',
  nextK: 'Next',
  next: (place, txt) => `${place} · ${txt}`,
  keep: 'Keep Going',
  stop: 'Stop Here for Today',
  stopLine: (n) => `Chapter ${n} picks up wherever you are next time. Your steps are saved.`,
  shorter: 'Shorter Walk',
  longer: 'Longer Walk',
  favourK: 'A favour from the Mailbox',
  favour: 'The Mailbox needs something blue. Snap one on your way?',
  favourSub: 'Do it and you’ll hear a bonus line in the next chapter.',
  favourGo: 'I’ll Do It',
  favourDone: 'Favour done. Listen for the bonus line.',
  gemK: 'Liked that spot?',
  gemGo: 'Save a Gem',
  lockIn: 'Pick My Walk Time',
};

export const ENDING = {
  k: 'Ending found',
  end: 'End Story',
  find: 'Find Another Ending',
  stats: (km, steps, gems) => [{ n: km, l: 'km' }, { n: steps, l: 'steps' }, { n: gems, l: gems === '1' ? 'gem' : 'gems' }],
  badge: 'Badge earned',
  postcardQ: 'Make a postcard?',
  postcardQSub: 'Your route shape, one line from the story, no spoilers.',
  makeCard: 'Make Postcard',
  skipCard: 'Not This Time',
  recsTitle: 'What’s next',
};

export const POSTCARD = {
  k: 'Postcard',
  greeting: 'Out on a walk. Found a story.',
  trimmed: 'Start and end trimmed, so nobody sees your door.',
  full: 'Your whole route, door to door. You chose to show your home.',
  share: 'Share Postcard',
  save: 'Save to Journal',
  saved: 'Saved to your Walk Journal.',
  stamp: 'Story City',
};

export const LOCKIN = {
  k: 'Your next walk',
  title: 'When should the story find you?',
  sub: 'One reminder, in a character’s voice. Never a nag.',
  times: [
    { id: 'morning', t: 'Morning', s: '7:30 am' },
    { id: 'lunch', t: 'Lunch', s: '12:10 pm' },
    { id: 'after', t: 'After Work', s: '5:30 pm' },
    { id: 'evening', t: 'Evening', s: '7:00 pm' },
  ],
  days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  daysLabel: 'Which days',
  preview: 'It will look like this',
  go: 'Lock It In',
  later: 'I’ll Choose Later', // decided button copy, Oct 28
  set: (t) => `Locked in. ${t}, the story will find you.`,
  askK: 'One more thing',
  ask: 'Can we tap you on the shoulder at that time?',
  askSub: 'Notifications are only for the walk you just picked. At most one a day.',
  allow: 'Allow Notifications',
};

// ---------- Whimsy Walks ----------
export const WHIMSY = {
  k: 'Whimsy Walks',
  title: 'One walk a day. That’s the whole idea.',
  today: 'Today’s walk',
  todayId: 'cat',
  outside: 'Outside',
  home: 'At Home',
  tomorrow: 'Tomorrow’s walk',
  tomorrowSealed: 'Sealed until morning.',
  sealsLabel: (n) => `Seal book · ${n} of 7`,
  sealsHint: (n) => `${7 - n} more seals and a letter opens. Seals never reset.`,
  roulette: 'Route Roulette',
  rouletteLine: 'Tell it how long. It won’t tell you where.',
  always: 'Always here',
  seasonal: 'This season',
  doAnother: 'Do Another One',
  walks: {
    cat: { name: 'Coin-Flip Walk', mech: 'A wandering walk', hook: 'At every corner, flip a coin. Heads left, tails right.', more: 'The coin picks the route. Your walk becomes a doodle.', homeHook: 'At home: flip at every doorway. Heads, a new room. Tails, back the way you came.', jewel: '#BED13F', go: 'Flip the First Coin' },
    bingo: { name: 'Block Bingo', mech: 'A spotting walk', hook: 'Nine things to spot. The middle one’s free.', jewel: '#F5B82E' },
    lights: { name: 'Lights Patrol', mech: 'A judging walk', hook: 'Pumpkin Patrol grew up. Rate every window light you pass.', jewel: '#FA7423', note: 'Pumpkin Patrol becomes Lights Patrol after Halloween' },
    mall: { name: 'Mall Lap Mystery', mech: 'An indoor walk', hook: 'Find something shaped like a star. Indoors counts.', jewel: '#4CBFE9' },
  },
  play: {
    k: 'Coin-Flip Walk',
    rule: 'At every corner, flip the coin.',
    count: (n) => `${n} ${n === 1 ? 'flip' : 'flips'} so far`,
    cat: 'Flip the Coin',
    rebel: 'Tails. Turn right.',
    left: 'Heads. Turn left.',
    finish: 'Finish Walk',
    homeRule: 'At every doorway, flip the coin.',
  },
  end: {
    k: 'Walk done',
    title: 'Your walk was a doodle.',
    seal: 'Seal pressed',
    handK: 'From your story',
    hand: 'The fire hydrant on your route has been asking about you.',
    handGo: 'Back to Squeaky',
    share: 'Share Doodle',
    tag: '#outonawhim',
    friendsSee: 'Friends see: how many flips and your doodle. Never where you walked.',
  },
};

export const ROULETTE = {
  k: 'Route Roulette',
  title: 'How long have you got?',
  sub: 'The only Whimsy Walk that asks. It always brings you back where you started.',
  times: [{ id: 15, t: '15 min' }, { id: 30, t: '30 min' }, { id: 45, t: '45 min' }, { id: 60, t: '60 min' }, { id: 90, t: '90 min' }],
  go: 'Spin It',
  turns: ['Turn left at the next corner.', 'Straight on past two more houses.', 'Right, toward the tallest tree.', 'Left. You’ve never walked this one.', 'Home stretch. Right, then right again.'],
  // longer walks get more turns: about one every 6 minutes (pass 2: a 90-minute one is 15 turns)
  turnPool: ['Turn left at the next corner.', 'Straight on past two more houses.', 'Right, toward the tallest tree.', 'Left. You’ve never walked this one.', 'Cross when it’s safe, then left.', 'Follow the next dog walker for one block. Politely.', 'Right at the first red door.', 'Straight on to the end of the block.', 'Left, toward the sound of a bell or a bird.', 'Take the side with more trees.', 'Right. Count the lamp posts as you go.', 'Left at the next bench, if there is one.', 'Straight on. Look up at the rooftops.', 'Right, then the first left.', 'Pick the quieter street.', 'Left. Say hello to the next cat.', 'Straight on past the shop with the best window.', 'Right, toward the tallest building you can see.'],
  homeStretch: 'Home stretch. Back the way that loops you home.',
  turnsFor: (t) => Math.max(5, Math.round(t / 6)),
  twist: 'Prefers streets you haven’t walked.',
  twistDark: 'After dark: sticks to lit streets you’ve walked before.',
  homeVer: 'At home: 5 turns round the house. The story picks the room.',
  homeTurns: ['Kitchen. Look for something round.', 'Hallway. Count the doors.', 'Window. What moved?', 'Back to your chair. Sit for one breath.', 'Last turn: the room you like best.'],
  toward: (st) => `Steering you past ${st}.`,
  nextTurn: 'Next Turn',
  home: 'You’re back where you started. That loop cleared new fog.',
  homeVisiting: 'You’re back where you started.',
  homeIndoor: 'Back in your chair. Five rooms, one loop.',
  done: 'Done',
};

// ---------- Mini Missions ----------
export const MISSION = {
  k: '1-minute mission',
  title: 'No time for a walk today? Wanna bet?',
  steps: (n) => `${n} of 10 steps`,
  step1: 'Take 10 steps. Anywhere. Hallway counts.',
  step2: 'Photograph something green.',
  snap: 'Snap It',
  pretend: 'Pretend Snap',
  done: 'You’re done.',
  doneSub: 'That was the whole mission. Done for today. Tomorrow’s is sealed.',
  gem: 'It left a gem on your map.',
  keepK: 'Keep it as a gem?',
  keepSub: 'Private, and never inside your home bubble.',
  noThanks: 'No Thanks',
  same: 'Same mission for everyone today',
  compare: 'Ama found green in 12 s. You: 31 s. No places shared.',
  darkAlt: { title: 'Find a light that’s on', step: 'Find a light that’s on. A porch, a window, a streetlight.' },
  snowAlt: { step: 'Photograph something that isn’t white.' },
  doorstep: { title: 'How many birds in 60 seconds?', line: 'From the front step, a balcony or a window.', tap: 'Saw One', done: (n) => `${n} birds. That counts as getting out.` },
  home: 'Back to Today',
  timer: (s) => `${s} s`,
};

// ---------- You ----------
export const YOU = {
  names: { You: 'You', Profile: 'Profile', 'Your Story': 'Your Story' },
  status: { member: 'Member', trial: (d) => `Trial · ${d} days left`, guest: 'Guest', free: 'Free account' },
  trialLine: (end, price, remind) => `Free until ${end}. Then ${price}. We’ll remind you ${remind}.`,
  memberLine: (d, price) => `${price} · renews ${d}.`,
  statusTitle: 'What members get',
  statusPerks: ['Unlimited access to every adventure', 'Every Play Anywhere adventure, unlocked', 'New adventures added all the time'], // (real)
  statusRenew: (d) => `Renews ${d}`,
  manage: 'Manage Subscription',
  subscribe: 'Start Free Trial',
  steps: 'Your steps',
  stepsWeek: (n) => `${n} steps this week`,
  stepsSplit: (a, b) => `${a} from stories · ${b} everyday`,
  goal: 'Daily step goal',
  goals: ['2,500', '5,000', '7,500', '10,000', 'Custom'],
  storyOnlyLine: 'Story only: step counts are hidden.',
  stepsNote: 'Real steps from your phone live here. Map steps are distance.',
  could: (n, s) => `Today’s steps could unlock ${n} chapters of ${s}.`,
  gems: 'Your gems',
  stories: 'Your stories',
  collection: 'Collection',
  journal: 'Walk Journal',
  seals: 'Seals',
  endings: 'Endings found',
  stamps: 'Passport stamps',
  badges: 'Badges',
  settings: 'Settings',
  reminders: 'Reminders',
  lock: 'Lock Screen and Widgets',
  guest: 'Playing as a guest. Your gems live only on this phone.',
  signUp: 'Save My Progress',
  inProgress: 'In progress',
  finished: 'Finished',
  upNext: 'Up next',
  myList: 'Wish List',
  recap: 'Sunday recap',
  recapLine: 'Your week in steps, gems and chapters. Sundays at 5 pm, if you want it.',
};

// ---------- Settings ----------
export const SETTINGS = {
  title: 'Settings',
  sub: { title: 'Story City Subscription', active: 'Active', trial: 'Free trial', none: 'Not subscribed' }, // (real)
  sections: {
    account: 'Account Settings', // (real)
    play: 'Playing',
    steps: 'Steps',
    notif: 'Notifications',
    map: 'Map and fog',
    privacy: 'Privacy',
    access: 'Accessibility',
    data: 'Data saver',
    audio: 'Audio',
    more: 'More',
  },
  rows: {
    email: 'Account Email Address', reset: 'Reset Password', edit: 'Edit Profile', del: 'Delete Account', // (real)
    howPlay: 'How I play', howPlayAsk: 'Ask me each time', howPlayUndo: 'Ask Each Time',
    goal: 'Daily step goal', // (real)
    countSteps: 'Count my steps', indoor: 'Count treadmill and indoor steps', health: 'Sync with Apple Health', healthSub: 'Reads your steps so they match your watch. Writes nothing.',
    storyOnly: 'Story only', storyOnlySub: 'Hide step counts and goals. Walks show as minutes.', pushes: 'Count pushes (wheelchair)', pushesSub: 'Walks show as distance; copy says “steps or pushes”.',
    guestK: 'Account', guestRow: 'Create a Free Account',
    unit: 'Distance Unit', units: ['Automatic (km)', 'Kilometers (km)', 'Miles (mi)'], // (real)
    showAs: 'Show walks as', showAsOpts: ['Steps', 'Minutes', 'Distance'],
    reminders: 'Reminders', remindersVal: 'At most 1 a day',
    tips: 'Tips and tooltips', tipsSub: 'Spotlight tips from your guide. Turn off everywhere.',
    fogHome: 'Fog on my map', fogStory: 'Fog inside stories', fogLook: 'Fog look', fogLooks: ['Soft Swirl', 'Topo Paper', 'Night Mist', 'Cloud Sea', 'Dark Clouds', 'Starry Void'],
    mapStyle: 'Map style', mapStyles: ['Base Map', 'Satellite'],
    bubble: 'Home bubble', bubbleSizes: ['200 m', '400 m', '800 m'], bubbleSub: 'Fog and postcards never show this circle around home.',
    gemsPrivate: 'New gems are private', who: 'Who sees my walks', whoOpts: ['Friends Only', 'Nobody'],
    trim: 'Trim postcard start and end',
    hideHome: 'Hide my home', hideHomeSub: 'Blurs the area around your home on your map, postcards and anything you share.',
    location: 'Location & Tracking', locationVal: 'When in Use', // (real)
    textSize: 'Text size', textSizes: ['Small', 'Default', 'Large'],
    motion: 'Reduce motion', eyes: 'Eyes-up mode', eyesSub: 'Reads the chat aloud. Big two-button replies.',
    gemPatterns: 'Gem shapes with patterns', gemPatternsSub: 'Colour is never the only difference.',
    lowData: 'Text only on the road', lowDataSub: 'No downloads on cellular. About 2 MB a chapter.', lowAudio: 'Download chapters with audio on Wi-Fi', lowAudioSub: 'About 8 MB a chapter, saved before you go.',
    wifi: 'Download next chapter on wifi', offline: 'Downloaded stories',
    autoplay: 'Autoplay audio', music: 'Adventure music', // (real)
    lang: 'App Language', langs: ['English', 'French'], // (real)
    restore: 'Restore Purchases', // (real)
    replay: 'Replay the Intro', feature: 'Send a Feature Request', help: 'Help', signout: 'Sign Out', coupons: 'Discount Coupons', // (real-ish)
  },
  newTag: 'New',
  saved: 'Saved',
};

// ---------- Reminders ----------
export const REMIND = {
  title: 'Reminders',
  sub: 'You pick when. The story picks the words.',
  walkTime: 'Pick my walk time',
  walkTimeNext: (t, s, ch) => `${t}: ${s}, chapter ${ch}.`,
  budget: 'At most',
  budgets: ['1 a day', '2 a week', '1 a week', 'Only new chapters'],
  master: 'All reminders',
  masterOff: 'Reminders are off. Nothing will reach you.',
  custom: 'My own time',
  paused: (d) => `Paused until ${d}`,
  resume: 'Resume Now',
  resumed: 'Reminders back on.',
  quiet: 'Quiet hours',
  quiets: ['9 pm – 8 am', '10 pm – 7 am', '8 pm – 9 am', 'None'],
  reasons: 'What can reach me',
  reasonList: [
    { id: 'planned', t: 'Before my planned walk', on: true },
    { id: 'chapter', t: 'When a new chapter drops', on: true },
    { id: 'weather', t: 'Nice walking weather', s: 'Only when it’s dry and light for 30+ minutes', on: false },
    { id: 'mission', t: 'Today’s 1-minute mission', on: false },
    { id: 'steps', t: 'My steps could unlock a chapter', s: 'Once a day, after you’ve walked. Counts steps you already took.', on: true },
    { id: 'friend', t: 'A friend left a gem for me', on: true },
    { id: 'recap', t: 'Sunday recap', on: false },
  ],
  voice: 'Written by',
  voices: ['The story’s character', 'A plain narrator'],
  away: 'Away for a bit',
  aways: ['1 Week', '2 Weeks', 'Until I’m Back'],
  awaySet: (t) => `Paused ${t.toLowerCase()}. Your place is kept.`,
  promise: 'Never “you missed”. Never a streak. Never more than you set.',
  preview: 'See Lock Screen',
};

export const LOCK = {
  title: 'Lock screen and widgets',
  time: '7:52',
  date: 'Wednesday, November 4',
  app: 'STORY CITY',
  notes: [
    { from: 'The Mailbox', story: 'Have You Seen Squeaky?', t: 'The hydrant’s been talking about you. Loudly. Chapter 4 is a short walk away.', when: 'now' },
    { from: 'Sir Wendell', story: 'A Knight Needs Your Help', t: 'You’ve walked 3,240 steps today. That’s two chapters’ worth, squire. The dragon is napping. Shall we?', when: '5:30 pm', why: 'steps' },
    { from: 'Wren', story: 'The Summons', t: 'Got 5 minutes? The Society does.', when: 'Mon' },
  ],
  liveK: 'Live Activity',
  live: (n) => `${n} steps to the playground`,
  liveLast: '“They headed for the slide.”',
  widgetK: 'Home screen widget',
  widget: 'Chapter 4 is 530 steps away',
  widgetMission: 'Today: something green',
  island: 'Squeaky · 320 steps',
  note: 'Written in the character’s voice. No emoji in titles. At most one a day.',
};

// ---------- Comeback ----------
export const COMEBACK = {
  k: 'Welcome back',
  title: 'The story waited for you.',
  prevK: 'Previously on',
  nothingLost: 'Nothing was lost. Your gems, seals and endings are all here.',
  finishSofa: 'Finish From the Sofa',
  walkIt: 'Walk It Now',
  mission: '1-Minute Mission',
  sub: (d) => `Membership renews ${d}. Manage it any time in Settings.`,
  reminders: 'Your reminders were paused while you were away. Turn them back on?',
  remindersGo: 'Set Reminders',
};

// ---------- Play together ----------
export const TOGETHER = {
  k: 'Play together',
  title: 'Dynasty Duel',
  how: 'How many players?',
  counts: ['1', '2', '4'],
  phones: 'How are you playing?',
  one: 'One Phone',
  oneLine: 'Pass it round. Everyone gets a job.',
  each: 'Everyone’s Phone',
  eachLine: 'Friends join free with a code.',
  roles: ['Reader', 'Navigator', 'Spotter'],
  rolesLabel: 'Jobs on one phone',
  code: 'Join code',
  share: 'Share Code',
  covers: 'One membership covers everyone walking with you.',
  coversNote: 'Assumption: pricing isn’t decided.',
  expires: 'Code expires in 60 minutes. You let each person in.',
  lobbyK: 'Lobby',
  lobby: (n) => `Waiting for ${n} more`,
  wants: (who) => `${who} wants to join.`,
  letIn: 'Let Them In',
  joined: (who) => `${who} joined`,
  begin: 'Start Chapter 1',
  friendsOnly: 'Only friends you let in. Never public.',
  families: 'Pick your family',
  fam: ['The Smiths', 'The Jenkins'],
  go: 'Start Together',
};

// ---------- linked arrival (Mo) ----------
export const LINKED = {
  k: 'From Kevin’s video',
  title: 'The Balthazar Job',
  by: 'Kevin · DiceCreamSandwich',
  date: 'Coming Nov 12',
  notify: 'Notify Me',
  newHere: 'New here? Try a 5-minute story first.',
  sample: 'Try The Summons',
  more: 'More by Kevin',
  tips: [
    'Tap anywhere to keep going.',
    'Stories happen on real streets. Yours works.',
    'Chapter 1 of every story is free.',
  ],
  tipOff: 'Turn Tips Off',
};

// ---------- the GO menu (day-two variant) ----------
export const GO = {
  k: 'Let’s go',
  rows: [
    { id: 'continue', t: 'Continue', s: 'Have You Seen Squeaky? · chapter 3' },
    { id: 'fits', t: 'Help Me Pick', s: 'Three taps, one story' },
    { id: 'gem', t: 'Save a Gem', s: 'Keep the spot you’re standing on' },
    { id: 'whimsy', t: 'Today’s Whimsy Walk', s: 'Coin-Flip Walk' },
  ],
};

// ---------- source and solves notes (Reviewer mode only) ----------
export const SOLVES = {
  p1: 'can’t play right now: indoors, bad weather, treadmill (S2, W1, T1)',
  p2: 'no idea how long it takes (M1, T2, T4)',
  p3: 'lands in a cluttered feed with nothing to do (D1, S1)',
  p4: 'nothing near me / can’t tell what works where I am (D2, D3, L5)',
  p5: 'paywall wall: no close, cut off, card fear (P1–P4)',
  p6: 'unsafe, private or closed stops (F1, F2, F5)',
  p7: 'GPS won’t confirm arrival (L1, L2, L3)',
  p8: 'steps feel invisible or don’t count (T1, T2, T3, S5)',
  p9: 'no time today (M2)',
  p10: 'no reason to come back; badges hidden; streak fatigue (R1–R4)',
  p11: 'families and friends: paying per person, kids bored (K1, K2, K4)',
  p12: 'reminders that nag, or never come (R5, M3)',
};

// one line a day from a character or the city (new idea #32: the world keeps living)
export const LIVING = {
  default: { who: 'The Mailbox', story: 'Have You Seen Squeaky?', t: 'Someone posted an actual letter today. First one in weeks. I’m not crying, you’re crying.' },
  first: { who: 'Wren', story: 'The Summons', t: 'You kept the secret. Good. Tomorrow there’s more.' },
  rain: { who: 'Fire Hydrant', story: 'Have You Seen Squeaky?', t: 'Rain. Finally, some peace and quiet on this corner.' },
  away: { who: 'Fright', story: 'Frightnight Ghost Tours', t: 'The janitor at the school is still waiting. Ghosts are patient. So are we.' },
  rural: { who: 'Sir Wendell', story: 'A Knight Needs Your Help', t: 'A fence post is merely a very short castle. I have checked.' },
};

export const SHEETS_W = {
  tipK: 'Good to know',
  recapK: 'Sunday recap',
  recapTitle: 'Your week',
  recapLines: (s, c, g) => [`${s} steps`, `${c} chapters`, `${g} new ${g === 1 ? 'gem' : 'gems'}`],
  recapNote: 'No missed days. Just what you did.',
  reportK: 'This stop',
  reportTitle: 'Something wrong here?',
  reportRows: ['Closed today', 'Private property', 'Doesn’t feel safe', 'Hard to reach'],
  reportDone: 'Thanks. We moved it somewhere public nearby.',
  moveDone: 'Moved. Your new stop is 90 m away, at a bench by the library.',
  pinK: 'Starts here',
};

// ---------- reviewer journeys (persona start states, from 05-personas.md) ----------
export const JOURNEYS = [
  { id: 'first', name: 'New player, end of The Summons', line: 'Day 0 · 7:40 pm, dark · clear, 6° · Edmonton · skipped the account' },
  { id: 'acct', name: 'Before the sample: the account step', line: 'Day 0 · Nov 3 order · Welcome → account → The Summons' },
  { id: 'priya', name: 'Priya at lunch, 15 minutes', line: '12:05 pm · −4°, clear · downtown Calgary · day 9 · member' },
  { id: 'marcus', name: 'Marcus and the kids, Saturday', line: 'Sat 10 am · 2°, cloudy · Edmonton suburb · with kids' },
  { id: 'dana', name: 'Dana on her walking pad, 7 am, raining', line: '7:00 am, before sunrise · rain, 3° · Winnipeg · remembers Treadmill' },
  { id: 'wes', name: 'Wes on the farm', line: '6:30 pm · −12°, cloudy · near Camrose (rural) · free account · low data' },
  { id: 'hannah', name: 'Hannah visiting Edmonton', line: '2 pm · −3° · downtown Edmonton, home is Halifax · day 1 · guest' },
  { id: 'ruth', name: 'Ruth on a rainy morning', line: '10:30 am · rain, 5° · Old Strathcona · member · Rain Edition' },
  { id: 'jordan', name: 'Jordan checks his steps', line: '6:30 am · clear, −8° · Calgary · member · step goal 5,000' },
  { id: 'amara', name: 'Amara after school', line: '3:40 pm · clear, 1° · NE Calgary · 15, friends-only · trial' },
  { id: 'glen', name: 'Glen on an icy afternoon', line: '2 pm · snow, −6° · Beverly, Edmonton · remembers From the Sofa' },
  { id: 'tasha', name: 'Tasha back after 3 weeks', line: '8:15 pm · cloudy, 4° · Calgary · member · away 21 days' },
  { id: 'mo', name: 'Mo from Kevin’s video', line: 'Linked arrival · day 0 · Edmonton · new, tips on' },
  { id: 'chinedu', name: 'Chinedu at dusk in Lagos', line: '6:15 pm, 24 min of light · 29° · Yaba, Lagos · guest · low data' },
];

// ---------- Phase 4 additions (tester fixes) ----------
export const MORE = {
  teaser: {
    incident: 'solving a murder', alice: 'stopping a Wonderland invasion', knight: 'helping a knight hunt an invisible dragon',
    adelaide: 'fixing a broken time machine', squeaky: 'finding a lost toy', frightnight: 'surviving a ghost tour', summons: 'answering a secret society',
  },
  recLine: (a, b) => `Got a taste for secrets? Why not try ${a}? Or ${b}?`,
  mailLine: (a, b) => `Not bad for someone who used to be smaller. Fancy ${a} next? Or ${b}?`,
  nextStory: 'Your next story',
  keepPick: (t, ch, m) => `Keep going: ${t}, chapter ${ch} · about ${m} min`,
  keepBecause: 'Because it fits, and you’re already in it.',
  friend: {
    k: 'Friends', title: 'Add a friend',
    sub: 'Friends see your walks and finds. Never where you live, never a map of your streets.',
    share: 'Share My Code', enter: 'Enter a Code', code: 'Your code: SAM-4821', only: 'Friends only, never public.',
    teen: 'Under 16: a parent gets a note when you add a friend.',
  },
  creator: {
    k: 'Creator', follow: 'Follow', following: 'Following', stories: 'Their stories', links: 'Kevin walks his stories on video; links on his profile.',
    soon: 'Coming Nov 12',
  },
  make: {
    btn: 'Make Your Own Walk', k: 'Every player is a creator',
    title: 'Make your own walk',
    steps: ['Pick three spots you love. Your gems count.', 'Write one line for each. A clue, a joke, a secret.', 'Share it with friends, or keep it for you.'],
    note: 'Creator Tools are on the web today; this is where the app would hand you over.',
    go: 'Open Creator Tools',
  },
  whimsyDark: { k: 'It’s dark out', t: 'Play the At Home version, or keep to lit streets you know.', tWalk: 'Keep to lit streets you know, or save it for daylight.', home: 'At Home Version', lit: 'Lit Streets I Know', later: 'Save It for Daylight' },
  whimsyPad: 'On a treadmill: flip every 2 minutes. Heads, speed up a notch. Tails, slow down one.',
  previouslyGeneric: (t) => `Last time in ${t}…`,
  stepFreeK: 'Step-free',
  stepFreeRoute: 'Step-Free, With Benches',
  priceNote: 'Price shown in Canadian dollars. Your store converts it at checkout.',
  problems: {
    title: 'Problems and fixes',
    sub: 'What three testers found walking the mockup as 12 players, and what changed. Tap Show Me to see each fix in place.',
    open: 'Problems and Fixes',
    showMe: 'Show Me',
    back: 'Back to Fixes',
    statuses: { fixed: 'Fixed', partly: 'Partly fixed', open: 'Open', melissa: 'For Melissa' },
    sev: { blocker: 'Blocker', major: 'Major', minor: 'Minor', polish: 'Polish' },
    all: 'All',
    counts: (f, p, o) => `${f} fixed · ${p} partly · ${o} open`,
  },
};

// ---------- Loops (Nov 5): gems, Whimsy Walks and friends each get a "tomorrow" ----------
// Brief: reports/loops-nov5/brief.md. Every loop ends with something waiting, something changed, one thing to do next.
export const LOOPS = {
  // the daily pool of 7, picked by date so everyone gets the same walk and a daily walker
  // doesn't repeat inside a week (pass 2: walkers, distance). Each walk plays its own way (kind).
  pool: ['cat', 'bingo', 'abc', 'mall', 'ear', 'lights', 'twin'],
  walks: {
    cat: {
      name: 'Coin-Flip Walk', mech: 'A wandering walk', jewel: '#BED13F', kind: 'coin', unit: 'flip', units: 'flips', verb: 'flipped', per: 2,
      out: { hook: 'At every corner, flip a coin. Heads left, tails right.', rule: 'At every corner, flip the coin.', btn: 'Flip the Coin', first: 'First corner coming up.', heads: 'Heads. Turn left.', tails: 'Tails. Turn right.' },
      home: { hook: 'Flip at every doorway. Heads, a new room. Tails, back the way you came.', rule: 'At every doorway, flip the coin.', btn: 'Flip the Coin', first: 'First doorway coming up.', heads: 'Heads. A new room.', tails: 'Tails. Back the way you came.' },
      pad: { hook: 'Flip every 2 minutes. Heads, speed up a notch. Tails, slow down one.', rule: 'Every 2 minutes, flip the coin.', btn: 'Flip the Coin', first: 'First flip in 2 minutes.', heads: 'Heads. Speed up a notch.', tails: 'Tails. Slow down one.' },
      lit: { hook: 'Lit streets you know. At every corner, flip a coin.', rule: 'Lit streets only. At every corner, flip the coin.', btn: 'Flip the Coin', first: 'First lit corner coming up.', heads: 'Heads. Left, if it’s lit.', tails: 'Tails. Right, if it’s lit.' },
      count: (n) => `${n} ${n === 1 ? 'flip' : 'flips'} so far`,
      friend: (who, n) => `${who} flipped ${n} times today.`,
    },
    bingo: {
      name: 'Block Bingo', mech: 'A spotting walk', jewel: '#F5B82E', kind: 'card', unit: 'square', units: 'squares', verb: 'spotted', max: 9, per: 1.5,
      out: { hook: 'Nine things to spot. The middle one’s free.', rule: 'Tap a square when you spot it. A new card every day.', btn: 'Spot It', items: ['A red door', 'A cat in a window', 'A flag', 'A bike', 'A dog walker', 'A wreath', 'A birdhouse', 'A garden gnome', 'A painted rock', 'A bus', 'Chalk drawings', 'A mailbox', 'A crow', 'A bench', 'A hedge shaped like something', 'Wind chimes'] },
      home: { hook: 'Nine things to spot round the house. The middle one’s free.', rule: 'Tap a square when you spot it, room by room.', btn: 'Spot It', items: ['A spoon', 'A sock', 'A plant', 'A photo', 'A clock', 'Something blue', 'A book', 'A mug', 'A pillow', 'A shoe', 'A key', 'A candle', 'A blanket', 'Something round'] },
      pad: { hook: 'Nine things to spot from the pad: out the window, on the wall, on the screen.', rule: 'Tap a square when you spot it from where you’re walking.', btn: 'Spot It', items: ['A window', 'Something blue', 'A clock', 'A plant', 'A screen', 'A water bottle', 'A lamp', 'A picture', 'A door', 'Something soft', 'A bird outside', 'Something red'] },
      lit: { hook: 'Nine things to spot on lit streets you know.', rule: 'Tap a square when you spot it.', btn: 'Spot It', items: ['A porch light', 'A lit sign', 'A bike', 'A lamp in a window', 'A string of lights', 'A reflector', 'A lit doorbell', 'A glowing screen', 'A streetlight', 'The moon', 'A lit wreath', 'A cat on a step'] },
      count: (n) => `${n} of 9 spotted`,
      friend: (who, n) => `${who} spotted ${n} of 9 today.`,
    },
    abc: {
      name: 'Alphabet Walk', mech: 'A letter walk', jewel: '#35C6D7', kind: 'letters', unit: 'letter', units: 'letters', verb: 'found', per: 1.5,
      out: { hook: 'Find an A, then a B, then a C. Signs, plates, posters.', rule: 'Signs, plates and posters count. In order.', btn: 'Found It' },
      home: { hook: 'Find an A, then a B, then a C round the house. Packets and spines count.', rule: 'Packets, books and fridge magnets count. In order.', btn: 'Found It' },
      pad: { hook: 'Find an A, then a B, from the pad. Screens and spines count.', rule: 'Anything you can see from the pad. In order.', btn: 'Found It' },
      lit: { hook: 'Find an A, then a B, on lit signs you pass.', rule: 'Lit signs, plates and posters. In order.', btn: 'Found It' },
      count: (n) => `${n} ${n === 1 ? 'letter' : 'letters'} found`,
      friend: (who, n) => `${who} got to ${String.fromCharCode(64 + Math.min(26, n))} today.`,
    },
    lights: {
      name: 'Lights Patrol', dayName: 'Window Patrol', mech: 'A judging walk', jewel: '#FA7423', kind: 'rate', unit: 'light', units: 'lights', verb: 'judged', per: 1,
      out: { hook: 'Rate every window light you pass. Pumpkin Patrol grew up.', rule: 'Pass a light. Give it a score out of ten.', btn: 'Rate It', day: 'Rate every window you pass, out of ten. After dark it’s Lights Patrol.' },
      home: { hook: 'Rate every lamp in the house. Yes, the fridge counts.', rule: 'Every lamp, a score out of ten.', btn: 'Rate It' },
      pad: { hook: 'Rate every light you can see from the pad.', rule: 'Every light in view, a score out of ten.', btn: 'Rate It' },
      lit: { hook: 'Rate the lights on streets you know.', rule: 'Pass a light. Give it a score out of ten.', btn: 'Rate It' },
      count: (n) => `${n} ${n === 1 ? 'light' : 'lights'} judged`,
      friend: (who, n) => `${who} judged ${n} lights today.`,
    },
    mall: {
      name: 'Mall Lap Mystery', mech: 'An indoor walk', jewel: '#4CBFE9', kind: 'count', indoor: true, unit: 'star', units: 'stars', verb: 'found', per: 2,
      out: { hook: 'Find something shaped like a star. Indoors counts.', rule: 'Any star: a sign, a sticker, a sale tag.', btn: 'Found One' },
      home: { hook: 'Find something shaped like a star at home.', rule: 'Any star: a sticker, a cookie cutter, a toy.', btn: 'Found One' },
      pad: { hook: 'Walk, and count every star you can see from the pad.', rule: 'Any star in view.', btn: 'Found One' },
      lit: { hook: 'Find something shaped like a star. Indoors counts.', rule: 'Any star: a sign, a sticker, a sale tag.', btn: 'Found One' },
      count: (n) => `${n} ${n === 1 ? 'star' : 'stars'} found`,
      friend: (who, n) => `${who} found ${n} stars today.`,
    },
    ear: {
      name: 'Sound Map', mech: 'A listening walk', jewel: '#93DC5E', kind: 'chips', unit: 'sound', units: 'sounds', verb: 'heard', per: 1.5,
      out: { hook: 'Stop at every corner and listen. Tap what you hear.', rule: 'Stop. Listen. Tap what you hear.', btn: 'Heard It', items: ['Bird', 'Car', 'Voices', 'Dog', 'Wind', 'Music', 'Footsteps', 'A bell'] },
      home: { hook: 'Stop in every room and listen. Tap what you hear.', rule: 'Stop. Listen. Tap what you hear.', btn: 'Heard It', items: ['Fridge hum', 'A clock', 'Voices', 'A tap', 'A door', 'Music', 'A phone', 'A bird outside'] },
      pad: { hook: 'Every 2 minutes, stop and listen. Tap what you hear.', rule: 'Listen. Tap what you hear.', btn: 'Heard It', items: ['The pad', 'Music', 'Voices', 'Traffic', 'A fan', 'A bird outside', 'A door', 'Rain'] },
      lit: { hook: 'Stop at every lit corner and listen. Tap what you hear.', rule: 'Stop. Listen. Tap what you hear.', btn: 'Heard It', items: ['Car', 'Voices', 'Dog', 'Wind', 'Music', 'Footsteps', 'An owl', 'A door'] },
      count: (n) => `${n} ${n === 1 ? 'sound' : 'sounds'} heard`,
      friend: (who, n) => `${who} heard ${n} sounds today.`,
    },
    twin: {
      name: 'Spot the Pair', mech: 'A matching walk', jewel: '#DA82ED', kind: 'count', unit: 'pair', units: 'pairs', verb: 'found', per: 2,
      out: { hook: 'Find two things that match. Twin doors, two red cars, matching mitts.', rule: 'Two of a kind, side by side or far apart.', btn: 'Found a Pair' },
      home: { hook: 'Find two things that match at home. Socks don’t count. Too easy.', rule: 'Two of a kind. Not socks.', btn: 'Found a Pair' },
      pad: { hook: 'Find two things that match from the pad.', rule: 'Two of a kind, anywhere in view.', btn: 'Found a Pair' },
      lit: { hook: 'Find two lit things that match. Twin porch lights count.', rule: 'Two of a kind, on lit streets.', btn: 'Found a Pair' },
      count: (n) => `${n} ${n === 1 ? 'pair' : 'pairs'} found`,
      friend: (who, n) => `${who} found ${n} pairs today.`,
    },
  },
  version: { out: 'Outside', home: 'At Home', pad: 'On the Pad', lit: 'Lit Streets' },
  versionWhy: {
    home: 'At Home: you play from the sofa. Change it in Settings.',
    pad: 'On the Pad: you walk on a treadmill or pad.',
    lit: 'Lit streets you know: it’s dark out.',
    rain: 'At Home, because it’s raining.',
  },
  finish: 'Finish Walk',
  // the done door
  walked: (n) => `Walked · seal ${n} of 7`,
  walkedNoSeal: 'Walked · today’s seal is pressed',
  tomorrow: (name, at) => `Tomorrow: ${name}. Opens at ${at}.`,
  tomorrowEnd: (name, at) => `Tomorrow: ${name}. Sealed until ${at}.`,
  seeBook: 'See Your Seal Book',
  doAnother: 'Do Another',
  // walk end
  statsOut: (steps, km, min) => `+${steps} steps · ${km} · ${min} min`,
  statsHome: (min) => `${min} minutes up and about`,
  statsNone: 'Nothing to count this time. Today’s walk is still here.',
  sealPressed: 'Seal pressed',
  sealAlready: 'Today’s seal is already pressed. The steps still count.',
  sealAlreadyHome: 'Today’s seal is already pressed. The minutes still count.',
  sealNone: (unit) => `No ${unit}s yet, so no seal. One ${unit} presses it.`,
  sealHint: (n) => (n >= 7 ? 'Seven seals. Wren’s letter is open.' : `${7 - n} more ${7 - n === 1 ? 'seal' : 'seals'} and Wren’s letter opens. Any 7 days. Seals never reset.`),
  letterTease: 'Wren’s letter begins: “You’ve walked further than you think…”',
  letterOpen: 'Read Wren’s Letter',
  letterK: 'Seven seals',
  letterTitle: 'A letter from Wren',
  letter: ['You’ve walked further than you think. Seven days, seven seals, and none of them had to be in a row. The Society never counts that way.', 'There’s a door near you we’ve never shown anyone. Next time you’re out, look for a gem with a wax seal on it. It’s yours.', '— W.'],
  gemHere: 'Leave a gem here?',
  gemHereSub: 'Private to you. Never inside your home bubble.',
  gemHereHome: 'You’re home. Save it for your eyes only?',
  gemHereHomeSub: 'Just for you. Spots at home are never shared.',
  saveIt: 'Save It',
  noThanks: 'No Thanks',
  gemSaved: (tab) => `Saved where you finished. It’s in You → ${tab}.`,
  missionSeal: 'Done. Seal pressed.',
  missionNoSeal: 'Done. Today’s seal was already pressed.',
  dusk: (m) => `Dark in ${m}. Here’s a 10-minute one.`,
  duskK: 'Before dark',
  rainAsk: { k: 'It’s raining', t: 'It’s raining. Play the At Home version, or go anyway?', home: 'At Home Version', go: 'Go Anyway' },
  darkSoonK: (m) => `Dark in ${m}`,
  // remind me later (Team Option remindLater)
  remindK: 'Remind me',
  remindTitle: 'When should we nudge you?',
  remindTimes: [{ id: 'tonight', t: 'Tonight', s: '7 pm' }, { id: 'morning', t: 'Tomorrow Morning', s: '8 am' }, { id: 'sat', t: 'Saturday', s: '10 am' }],
  remindSet: (t) => `Okay. One nudge, ${t.toLowerCase()}.`,

  // since you were here + the bell
  sinceK: 'Since you were here',
  sinceGot: 'Got It',
  bellTitle: 'What happened',
  bellToday: 'Today',
  bellEarlier: 'Earlier',
  bellEmpty: 'Nothing yet. When someone finds or cheers your gems, it shows up here.',
  bellNote: {
    card: 'Plus at most one note a day on your lock screen, if you turn it on.',
    cardOnly: 'No notifications for this. It waits here and on Today.',
    each: 'A note for the first find and the first cheer on each gem.',
  },
  newDot: 'new',
  act: {
    // g is already "your heron at Whitemud Creek" (gemRef drops a leading "The"); one line per gem (pass 2)
    found: (who, g) => `${who} found ${g}.`,
    foundN: (n, g) => `${n} ${n === 1 ? 'person' : 'people'} found ${g}.`,
    foundMore: (who, n, g) => `${who} and ${n} ${n === 1 ? 'other' : 'others'} found ${g}.`,
    foundTwo: (a, b, g) => `${a} and ${b} found ${g}.`,
    cheer: (who, g) => `${who} cheered ${g}.`,
    cheerFar: (who, g) => `From afar, ${who} cheered ${g}.`,
    cheersN: (n, g) => `${n} new ${n === 1 ? 'cheer' : 'cheers'} on ${g}.`,
    saw: (who) => `${who} saw your cheer.`,
    sticker: (who, t) => `${who} sent you “${t}”.`,
    nearNew: (g, m) => `New near you: ${g}, ${m} min away.`,
    gemEcho: (d, g) => `${d} days ago you saved ${g}. Still there?`,
    instant: (who) => `You and ${who} are friends now.`,
    tier: (g, t, n) => `${g} is ${t} now. ${n} ${n === 1 ? 'person' : 'people'} found it.`,
    doodleCheer: (who) => `${who} cheered your doodle.`,
    doodleCheersN: (n) => `${n} friends cheered your doodle.`,
    accepted: (who) => `${who} accepted your friend request.`,
    friendWalk: (n) => `${n} ${n === 1 ? 'friend' : 'friends'} did yesterday’s walk.`,
    nameIt: 'You saved a spot yesterday. Name it?',
    todayWalk: (name) => `Today’s walk: ${name}.`,
  },
  // friends
  friend: {
    codeK: 'Your code',
    reset: 'Reset My Code',
    resetDone: 'New code. The old one stops working.',
    theirCode: 'Their code',
    codePh: 'e.g. JESS-2290',
    add: 'Add',
    confirm: (n) => `Add ${n}?`,
    confirmSub: 'They see your walks and finds. Never where you live.',
    addBtn: 'Add Friend',
    notNow: 'Not Now',
    sent: (n, pr) => `Request sent. ${n} will see it next time ${pr} ${pr === 'they' ? 'open' : 'opens'} Story City.`,
    pending: (n) => `${n}: request sent`,
    bad: 'That doesn’t look like a code. It’s a name, a dash and 4 numbers.',
    self: 'That’s your own code.',
    already: (n) => `${n} is already your friend.`,
    mockK: 'Mockup: codes to try',
    yours: 'Your friends',
    none: 'No friends yet. Share your code, or type theirs.',
  },
  inviteAround: 'Add one friend to see their walks and gems here.',
  inviteShare: 'Add a friend to share it.',
  inviteLobby: 'Share your code to bring someone in.',
  friendsDid: (n) => `${n} ${n === 1 ? 'friend' : 'friends'} did today’s walk.`,
  friendsDidTurn: (n) => `${n} ${n === 1 ? 'friend' : 'friends'} did today’s walk. Your turn?`,
  yourDoodle: (c) => (c ? `Your doodle has ${c} ${c === 1 ? 'cheer' : 'cheers'}.` : 'Your doodle. No cheers yet.'),
  yourDoodleK: 'You',
  noDistance: 'Friends see the count, the doodle and the seal. Never the route.',
  nearestGem: (km) => `Nearest gem: ${km} km`,
  noGemsHere: 'No gems near you yet. Yours could be the first.',
  together: {
    weekly: (who, a, b) => `You + ${who}: ${a} of ${b} steps this week`,
    flame: (n) => `Shared flame · ${n} friends · day 4`,
    flameNote: 'Conflicts with “no streaks” (01-decisions C13). Shown so the team can see it.',
  },
  // gems
  found: (n) => `Found it. You’re finder number ${n}.`,
  foundTier: (g, t) => `Found it. ${g} is ${t} now.`,
  foundFriend: (who) => `Found it. ${who} will hear about it.`,
  foundStamp: 'Found',
  foundK: 'Found',
  foundNone: 'Gems you find show up here, with a Found stamp.',
  toNext: (n, t) => `${n} more ${n === 1 ? 'finder' : 'finders'} to ${t}`,
  top: 'Perfect: the rarest there is',
  seenIt: 'I’ve Seen It',
  seenTip: { cheer: 'Seen it from afar? That counts as a cheer.', find: 'Seen it from afar? That counts as a find.' },
  seenDone: { cheer: 'Counted as a cheer. Thanks for looking.', find: 'Counted as a find, from afar.' },
  emptyStamps: 'Your first gem goes here.',
  quickSaved: (tab) => `Saved a spot. It’s in You → ${tab}.`,
  quickName: 'Name It',
  quickHome: { k: 'You’re home', t: 'You’re home. Save it for your eyes only?', yes: 'Save It, Just Me', no: 'Not Now' },
  spotsK: 'Mockup: where are you standing?',
  spots: { walk: 'Out on a walk', home: 'At home' },
  defaultName: (type, street) => `${type} on ${street}`,
  typeWord: { nature: 'Nature spot', art: 'Art', landmark: 'Landmark', shop: 'Shop', curio: 'Curiosity', none: 'Spot' },
  streets: { Edmonton: '104 St NW', Calgary: '10 St NW', Winnipeg: 'Corydon Ave', Camrose: 'Range Rd 202', Lagos: 'Herbert Macaulay Way' },
  pickType: 'Pick one, or leave it',
  vibeDrop: { k: 'One thing first', t: (v) => `${v} only works for Just Me. Keep it private?`, keep: 'Keep It Private', drop: (v) => `Drop ${v}` },
  shareHome: 'Too close to home to share',
  madeFriendsNone: 'It’s on your map. Add a friend to share it.',
  theirsFriends: { mine: (b, pr) => `${b} shared this with ${pr} friends, like you.`, theirs: (b, pr) => `${b} shared this with ${pr} friends and their friends.` },
  whoFriendsTheirs: 'People you’ve added, and their friends.',
  hello: 'Your friends now',
  // overheard lines, by story, rotated by day (bug 14: from the player's current story)
  overheard: {
    squeaky: [{ who: 'The Mailbox', t: 'Someone posted an actual letter today. First one in weeks. I’m not crying, you’re crying.' }, { who: 'Fire Hydrant', t: 'A dog looked at me today. Just looked. I’ll be thinking about it for a week.' }, { who: 'The Playground Slide', t: 'Squeaky was here. Or a very confident pigeon.' }, { who: 'The Mailbox', t: 'Nothing but flyers. I’m saving the good ones for you.' }],
    frightnight: [{ who: 'Fright', t: 'The janitor at the school is still waiting. Ghosts are patient. So are we.' }, { who: 'Fright', t: 'Somebody left the porch light on for us. Rude, but thoughtful.' }, { who: 'Fright', t: 'The tour bus is mostly fog tonight. Mostly.' }],
    knight: [{ who: 'Sir Wendell', t: 'The dragon napped in the tallest tree again. It fears cats.' }, { who: 'Sir Wendell', t: 'A fence post is merely a very short castle. I have checked.' }, { who: 'Sir Wendell', t: 'I polished my armour. It’s still mostly rust. Onward.' }],
    summons: [{ who: 'Wren', t: 'You kept the secret. Good. Tomorrow there’s more.' }, { who: 'Wren', t: 'Somebody on your street is a member. I won’t say who.' }, { who: 'Wren', t: 'The stairs are quiet today. That’s never a good sign.' }],
    default: [{ who: 'Wren', t: 'Somebody on your street is a member. I won’t say who.' }, { who: 'Sir Wendell', t: 'The dragon napped in the tallest tree again. It fears cats.' }, { who: 'The Mailbox', t: 'Someone posted an actual letter today. First one in weeks.' }],
  },
  storyName: { squeaky: 'Have You Seen Squeaky?', frightnight: 'Frightnight Ghost Tours', knight: 'A Knight Needs Your Help', summons: 'The Summons' },
  // the 1-minute mission rotates by day (pool of 4; after dark it's always a light)
  missions: [
    { title: 'No time for a walk today? Wanna bet?', step: 'Photograph something green.', gem: 'nature', gemName: 'Something green' },
    { title: 'Ten steps and something round', step: 'Photograph something round.', gem: 'curio', gemName: 'Something round' },
    { title: 'Ten steps and a bit of sky', step: 'Photograph the sky, whatever it’s doing.', gem: 'nature', gemName: 'A bit of sky' },
    { title: 'Ten steps and something old', step: 'Photograph something older than you.', gem: 'landmark', gemName: 'Something old' },
  ],
  doorDark: { title: 'How many lit windows in 60 seconds?', line: 'From the front step, a balcony or a window.', tap: 'Saw One', done: (n) => `${n} lit windows. That counts as getting out.` },
  ages: { today: 'today', yesterday: 'yesterday', days: (n) => `${n} days ago`, weeks: (n) => `${n} ${n === 1 ? 'week' : 'weeks'} ago` },
  // ---------------------------------------------------------------- pass 2 (Nov 5, after the retests)
  sealsWord: { coin: 'flips', card: 'squares', letters: 'letters', rate: 'lights', count: 'finds', chips: 'sounds', turn: 'turns' },
  friendsSee: (u) => `Friends see: how many ${u} and your doodle. Never where you walked.`,
  compare: (who, n, u, me) => `${who}: ${n} ${u} today. You: ${me}.`,
  compareShort: (who, n, me) => `${who} ${n} · you ${me}`,
  // walk player: the clock, the dark and the way home (lowtech: Gord, Chinedu)
  timer: (m) => `${m} min walked`,
  darkIn: (m) => `Dark in ${m} min`,
  headBack: (m) => `Dark in ${m} min. Head back?`,
  takeHome: 'Take Me Home',
  homeK: 'Heading home',
  homeT: (m) => `About ${m} minutes back the way you came. Your map points the way.`,
  homeGo: 'Head Home',
  keepWalking: 'Keep Walking',
  homeVia: 'Headed home. It all counts.',
  // the 3×3 Block Bingo card, Lights Patrol's scores, the alphabet, the sound map
  card: { free: 'Free', tap: 'Tap a square when you spot it.', line: 'Bingo. A full line.', all: 'All nine. Full card.' },
  rate: { prompt: 'Pass a light. Tap its score.', last: (s) => `Last one: ${s} out of 10`, best: (b, a) => `Best ${b} · average ${a}` },
  abc: { find: (l) => `Find ${'AEFHILMNORSX'.includes(l) ? 'an' : 'a'} ${l}`, done: 'A to Z. The whole alphabet.', got: (l) => `Got ${l}.` },
  ear: { heard: (list) => `Heard: ${list}` },
  // a doorway doodle for Get Out the Door; the low-energy door (lowenergy: Sky)
  lowDoor: { k: 'Just one thing', title: 'Get out the door', line: 'Shoes on, coat on, door open. That’s the whole thing, and it counts.', go: 'Shoes On', done: (n) => `Door open · seal ${n} of 7`, doneNoSeal: 'Door open · it counts', gentle: 'Or a gentle one: Get Out the Door' },
  doorCounted: (res, n) => (res === 'pressed' ? `That counts. Seal ${n} of 7 pressed.` : 'That counts. Today’s seal was already pressed.'),
  doorBack: 'Back to Today',
  // steps reach the story (walkers: Rosa)
  opened: (n, ch) => `Your ${n} steps opened chapter ${ch}.`,
  openedDoor: (ch) => `Chapter ${ch} is open. Your walks got you there.`,
  readCh: (ch) => `Read Chapter ${ch}`,
  toOpen: (n, ch) => `${n} more steps and chapter ${ch} opens.`,
  youOpened: (ch, t) => `Your walks opened chapter ${ch} of ${t}.`,
  youToOpen: (n, ch, t) => `${n} more steps open chapter ${ch} of ${t}.`,
  // the step goal (walkers: Jordan, Rosa)
  goalMet: (s, g) => `Goal met: ${s} of ${g} steps today.`,
  goalLeft: (left, g) => `${left} to your ${g}.`,
  ydayMet: (s) => `Yesterday: ${s} steps. Goal met.`,
  ydayShort: (s, g) => `Yesterday: ${s} of ${g} steps.`,
  longWay: (left, m) => `${left} steps to your goal. A ${m}-minute Roulette closes it.`,
  longWayGo: (m) => `Spin a ${m}-Minute One`,
  weeklyClose: (left, m) => `${left} to go: a ${m}-minute Roulette closes it.`,
  weeklyDone: 'Done together this week. No streak, just the week.',
  // rotating walk-end lines
  teases: ['Wren’s letter begins: “You’ve walked further than you think…”', 'Wren sealed it with green wax. Nobody has opened one yet.', 'The letter mentions a door near you. That’s all we know.', 'Seven seals, any seven days. The letter waits.'],
  hands: {
    squeaky: ['The fire hydrant on your route has been asking about you.', 'The mailbox swears it saw Squeaky. It says that a lot.', 'The playground slide has a new squeak. Suspicious.', 'Somebody on your street is keeping a secret. Probably the hydrant.'],
    default: ['Your story picks up right where you left it.', 'Someone in your story has been waiting.', 'The next chapter is closer than it was this morning.'],
  },
  // friends: around you, doodles, replies
  youWalkedWith: (n) => `You and ${n} ${n === 1 ? 'friend' : 'friends'} walked today.`,
  seeAll: (n) => `See All ${n}`,
  fewer: 'Show Fewer',
  stepsLine: (n) => `+${n} steps`,
  shareFirst: 'Share your code so someone can cheer it.',
  shareFirstBtn: 'Share My Code',
  walkWithMe: 'Walk With Me',
  doodleK: 'Today’s walk',
  bothWalked: 'You both walked today',
  stickers: ['Nice One', 'Same Walk Tomorrow?', 'Love the Doodle'],
  stickerSent: (who) => `Sent. ${who} sees it in the morning.`,
  stickerNote: 'Three set replies, no typing. Safe for every age.',
  cheerBack: 'Cheer Back',
  cheeredBack: (who) => `${who} sees your cheer in the morning.`,
  // share sheets: your code, your doodle
  shareCodeK: 'Share your code',
  shareMsg: (c) => `Walk with me on Story City. My code: ${c}`,
  shareLink: (c) => `storycity.app/f/${c}`,
  apps: { whatsapp: 'WhatsApp', messages: 'Messages', copy: 'Copy Link' },
  appSent: (a) => (a === 'Copy Link' ? 'Link copied.' : `Opens ${a} with the message ready.`),
  shareDoodleK: 'Share your doodle',
  shareDoodleT: 'Send it to someone',
  shareDoodleSub: 'They see the doodle and the count. Never the route.',
  sendTo: (n) => `Sent to ${n.replace(/\.$/, '')}.`,
  storySize: 'Story-Size Polaroid',
  storySizeDone: 'Saved a story-size Polaroid to your photos.',
  // in-person adds are instant (groups: Priya & Sam)
  inPerson: { now: 'We’re together right now', sub: 'Type or scan their code while you’re side by side, and you’re friends at once.' },
  // gems
  madePending: (n, pr) => `It’s on your map. ${n} will see it when ${pr} ${pr === 'they' ? 'accept' : 'accepts'}.`,
  foundFar: 'Walk there first: it counts when you’re standing at it.',
  gemWhoK: 'Who found it and cheered',
  gemWhoRow: (who, what, when) => `${who} ${what} · ${when}`,
  gemWhoMore: (n) => `and ${n} more`,
  gemWhoNone: 'Nobody yet. Finds and cheers show up here by name if they’re friends.',
  whatFound: 'found it', whatCheered: 'cheered', whatSaw: 'saw it from afar',
  echoK: 'Gem Echo',
  backHere: 'I’m Back Here',
  backDone: (res) => (res === 'pressed' ? 'Back at your spot. That counts, and the seal is pressed.' : 'Back at your spot. That counts.'),
  replies: {
    Wren: ['That corner you saved? It hums at night. I checked.', 'Good spot. The Society has a map of those.', 'You kept it to yourself. Smart. Some spots are better that way.'],
    'Sir Wendell': ['A fine spot. I would build a very small castle there.', 'I stood guard at your spot. Nothing happened. Splendid.'],
    'The Mailbox': ['I saw you stop there. Nobody stops for me.', 'A secret spot. My lips are sealed. I don’t have lips.'],
  },
  allGemsEmpty: 'No public gems near you yet. Yours would be the first.',
  ownFirst: (g) => `Your ${g} is the first gem near here.`,
  trip: { k: (c) => `Your ${c}`, line: (s, f, w) => `${s} saved · ${f} found · ${w} ${w === 1 ? 'walk' : 'walks'}`, sub: 'A page for this trip. It stays after you leave.', share: 'Share My Trip', done: 'Link copied. Your trip page stays after you leave.' },
  // character and city lines on Today, rotated daily (Lagos gets its own)
  charPosts: [
    { who: 'Wren', story: 'The Summons', what: 'Someone left a mailbox flag up on your street.', detail: 'Not me. Probably not me.' },
    { who: 'Sir Wendell', story: 'A Knight Needs Your Help', what: 'The dragon napped in the tallest tree again.', detail: 'It fears cats. Keep one handy.' },
    { who: 'Wren', story: 'The Summons', what: 'A door on your street was painted overnight.', detail: 'Green. The Society’s colour. Coincidence.' },
    { who: 'The Mailbox', story: 'Have You Seen Squeaky?', what: 'Three letters today. A record.', detail: 'One was a postcard of a cat. I keep looking at it.' },
    { who: 'Sir Wendell', story: 'A Knight Needs Your Help', what: 'I have named every crow on your block.', detail: 'They have not agreed to it.' },
    { who: 'Wren', story: 'The Summons', what: 'The bench by the park is warm. Someone sat there all morning.', detail: 'Members do that.' },
  ],
  charPostsLagos: [
    { who: 'Wren', story: 'The Summons', what: 'Someone left a gate ajar on your street.', detail: 'Not me. Probably not me.' },
    { who: 'Sir Wendell', story: 'A Knight Needs Your Help', what: 'A gecko guarded my post all afternoon.', detail: 'A noble beast. Very small.' },
    { who: 'Wren', story: 'The Summons', what: 'The danfo driver on your road hums the Society’s tune.', detail: 'He doesn’t know it yet.' },
  ],
  postAges: ['1 h', '3 h', '5 h', '2 h'],
  // walk together (groups blocker): 2–8 phones, one doodle, a seal each
  wt: {
    k: 'Walk it together', title: 'Walk it together', btn: 'Walk It Together',
    sub: 'Today’s walk on everyone’s phone. One doodle, a seal each.',
    subRl: 'Route Roulette for two or more: the phones take turns, and nobody sees the next one.',
    how: 'How many phones?', counts: ['2', '3', '4', '5', '6', '8'],
    code: 'Walk code', scan: 'Side by side? They scan this.',
    wait: (n) => `Waiting for ${n} more`, all: 'Everyone’s in.', letIn: 'Let Them In', in: 'In',
    shareCode: 'Share the Code', go: 'Start Together', goRl: 'Pick a Time',
    label: (n) => `Together · ${n} phones`,
    turn: (who) => `${who}’s turn`, yourTurn: 'Your turn',
    hidden: (who) => `${who} sees this one. You get the next.`,
    endK: 'Walked together', oneDoodle: (n) => `One doodle, drawn in ${n} colours.`,
    caption: (names, d) => `${names} · ${d}`,
    sealEach: 'A seal each. It’s in everyone’s seal book.',
    none: 'Add a friend first, or let them scan your code.',
    more: (n) => `${n} more can join with the code.`,
    friendsOnly: 'Only friends you let in. Never public.',
  },
  roulette: { twistOnce: 'Prefers streets you haven’t walked.', darkOnce: 'After dark: sticks to lit streets you’ve walked before.' },
};

// ---------- Team Option homePlay = off (Melissa, Nov 5: "remove all references to at home… but take it to the team") ----------
// Golden Path Q24 (TTT). The words that replace every sofa / at-home line while the switch is off.
// Kept on purpose: the treadmill / walking pad (still walking), Shoes On, and the gem home-bubble lines.
export const NOHOME = {
  flips: {
    cold: { k: 'Minus thirty?', t: 'Treadmill steps count the same. Or wrap up warm for a short one.', a: 'Treadmill or Pad', b: 'Going Out Anyway' },
    rain: { k: 'Rain Edition today', t: 'It’s raining. Your story has a few extra lines for the rain.', a: 'Treadmill or Pad', b: 'Going Out Anyway' },
    snow: { k: 'Icy out?', t: 'Walk carefully: fresh snow, every footprint the first. Or use a treadmill.', a: 'Treadmill or Pad', b: 'Go Out Carefully' },
    storm: { k: 'Stay in tonight', t: 'Thunder on the way. The story waits for you.', a: 'Treadmill or Pad', b: 'Remind Me Later' },
    dusk: { k: 'Light is going', t: (m) => `${m} minutes of light left: a short loop near home, or lit streets you know?`, a: 'Short Loop', b: 'Lit Streets Only' },
    dark: { k: 'It’s dark out', t: 'Stay on lit streets you know. Every step counts.', a: 'Lit Streets Only', b: 'Wait for Daylight' },
    predawn: { k: 'Still dark', t: (t) => `Sunrise is at ${t}. Lit streets you know, or wait until it’s light.`, a: 'Lit Streets Only', b: 'Wait for Daylight' },
    ruralDark: { k: 'No streetlights out here', t: 'Wear something bright, take a light and walk facing traffic. Or wait for daylight.', a: 'Bring a Light', b: 'Wait for Daylight' },
  },
  // Start: the smart default's reason line, with no sofa
  smartWhy: {
    rain: 'Raining. Out the door with a hood, or pick the treadmill.',
    snow: 'Snowing. Out the door, carefully. Your call.',
    cold: 'Bitter cold out. Treadmill steps count the same.',
    storm: 'Storm coming. The story can wait, or pick the treadmill.',
    dark: 'After dark. Keep to lit streets you know.',
    darkSoon: 'Dark soon. A short one on lit streets you know.',
  },
  // a story with no walking at all (Dictators Laundromat): it just opens
  read: { name: 'Read It Now', line: 'No walking in this one. Dialogue and choices only.', meta: 'No steps needed' },
  readLen: 'No steps needed',
  helpWalk: 'Treadmill and walking-pad steps count too.',
  emptySub: 'Try Treadmill or Near Me. Any Play Anywhere story starts at your door.',
  localFar: (place) => `This story lives in ${place}. Walk it there, or walk it virtually from here.`,
  afterDark: 'It’s dark out. Outdoor stops stick to lit streets.',
  refusedPush: 'Staying inside? A treadmill or walking pad works too. Or count steps only.',
  skipNone: 'Skipping is off in this version. Keep walking: the chapter is close.',
  whimsyDark: { t: 'Keep to lit streets you know, or save it for daylight.', light: 'Bring a Light' },
  rainAsk: (k) => `${k} Bring a hood and go anyway, or walk it on a treadmill?`,
  rainPad: 'Treadmill or Pad',
  rainLater: 'Save It for Later',
  doorLine: 'From the front step or a balcony.',
  glenLine: '2 pm · snow, −6° · Beverly, Edmonton · step-free stories · Large text',
  comeWalk: 'Walk It Now',
};

// ---------------------------------------------------------------- Nov 27 overnight: the whole new app
// Tabs from the Nov 26 chat with Brett (Feed · Stories · Create · Gems · You) and Melissa's Today task (NSC-2137)
export const NAV26 = {
  create: 'Create',
  createAria: 'Take a picture of a gem',
  first: { today: 'Today', feed: 'Feed' },
};

// You as three swipeable galleries (The Stash, version E)
export const YOUG = {
  seeAll: 'See all',
  strip: { km: 'km walked', walks: 'walks', chapters: 'chapters', gems: 'gems' },
  progress: { t: 'Progress', sub: 'Your walks in pictures' },
  collections: { t: 'Collections', sub: 'Newest first' },
  history: { t: 'History', sub: 'Your days, newest first' },
  kinds: { gem: 'Gem', seal: 'Seals', badge: 'Badge', postcard: 'Postcard', stamp: 'Stamp' },
  groups: [['gem', 'Gems'], ['seal', 'Whimsy seals'], ['badge', 'Badges'], ['postcard', 'Postcards'], ['stamp', 'Passport stamps']],
  patch: { t: 'Your patch', line: (p) => `${p}% of your neighbourhood uncovered`, sub: 'Your home stays blurred. Tap to open the map.' },
  far: { t: 'How far you’ve walked', line: (km) => `${km} km walked`, sub: 'Every step counts, story or not.' },
  compare: [
    ['rinks', 0.06, (n) => `That’s ${n} hockey rinks end to end.`],
    ['bridge', 0.777, (n) => `That’s the High Level Bridge ${n} times.`],
    ['stalbert', 15, (n) => `That’s walking to St. Albert ${n} times.`],
    ['reddeer', 150, (n) => `That’s walking to Red Deer ${n} times.`],
  ],
  week: { t: 'This week', story: 'in stories', every: 'everyday', steps: 'steps' },
  sky: { t: 'Your walking sky', right: (n) => `${n} walks`, aria: (n) => `${n} walks as stars`, sub: 'Every walk lights a star; bigger walks shine brighter. Red rings are story endings you found.' },
  clock: { t: 'When you walk', line: 'You’re a dusk walker', sub: 'Most of your steps happen between 5 and 8 pm.', noon: 'noon', midnight: 'midnight' },
  flower: { t: 'Your gems', club: (type) => `You’re a ${type} seeker`, made: 'made', found: 'found', cheers: 'cheers' },
  stories: { t: 'Stories on the go', ch: (a, b) => `Chapter ${a} of ${b}`, none: 'Start a story and it shows up here.' },
  coll: { found: 'Found it', seals: 'Whimsy seals', walk: (i) => `Walk ${i + 1}`, passport: 'Passport', passportSub: 'Walk a Passport story' },
  hist: { today: 'Today', yesterday: 'Yesterday', ago: (n) => `${n} days ago`, away: 'Away', quiet: 'A quiet day', walk: 'Out for a walk', storyWalk: (t) => `Walked ${t}`, fog: 'Fog cleared' },
};

// The Gems tab: the gem map (V3 pins) and the Gem Hub (sort, Public / Hidden / Liked, nearby). Decision Log Nov 26.
export const GEMTAB = {
  title: 'Gems',
  views: [['map', 'Map'], ['hub', 'My Gems']],
  filters: { all: 'All gems', nature: 'Nature', shop: 'Eat & Shop', art: 'Culture', landmark: 'Landmarks', curio: 'Curiosities', mine: 'Mine' },
  notes: {
    all: 'Every gem near you', nature: 'Trees, birds, gardens, river views', shop: 'Bakeries, cafés, little shops', art: 'Murals, sculptures, music',
    landmark: 'Buildings and places with a story', curio: 'Odd, tiny, wonderful things', mine: 'Yours: hollow ones are private',
  },
  away: (m) => `${m} min away`,
  noneHere: 'None near you yet. Be the first.',
  noneMine: 'Your first gem goes here. Tap Create.',
  privateMine: 'Yours · Private',
  open: 'Open Gem',
  go: 'Take Me There',
  save: 'Save for Later',
  saved: 'Saved for later.',
  close: 'Close',
  sortH: 'Sort your gems',
  sortIntro: 'Hold the photo and drag right to publish, keep hidden or delete.',
  left: (n) => `${n} left`,
  allSorted: 'All sorted',
  allSortedSub: 'Snap a new one with the Create button.',
  rails: { publish: 'Publish', hidden: 'Keep hidden', delete: 'Delete' },
  railsAria: 'Or tap one:',
  tabs: [['public', 'Public', 'On the map for other people.'], ['hidden', 'Hidden', 'Just for you.'], ['liked', 'Liked', 'Gems you hearted.']],
  empty: {
    public: ['Nothing public yet', 'Publish a find and it’ll show up here.'],
    hidden: ['No hidden gems', 'Keep one just for yourself and it’ll land here.'],
    liked: ['No liked gems yet', 'Heart a gem and it’ll show up in Liked.'],
  },
  snack: {
    hidden: 'Kept hidden: only you can see it',
    friends: 'Shared with your friends',
    public: 'Published: everyone nearby can see it',
    deleted: 'Moved to Recently deleted',
    undo: 'Undo',
    restored: 'Photo restored to your pile',
  },
  publishK: 'Publish',
  publishH: 'Who can see this?',
  publishWho: [['friends', 'Friends', 'Share with Friends'], ['all', 'Everyone', 'Publish to Everyone']],
  publishType: 'What kind of gem?',
  publishCancel: 'Not Yet',
  deletedRow: (n) => `Recently deleted · ${n}`,
  deletedSub: 'Photos stay here for 30 days, then they’re gone for good.',
  nearbyK: 'Nearby public gems',
  snapped: 'Snapped. It’s waiting in Gems to sort.',
  sortNow: 'Sort Now',
  snapK: 'Create',
  sendIt: 'Send It',
  retake: 'Retake',
  pileFinds: [
    { id: 'f1', img: 'finds/find-a.jpg', title: 'TV wall on 124 St', where: 'On your walk · 2:14 pm', type: 'art', x: 168, y: 196 },
    { id: 'f2', img: 'finds/find-b.jpg', title: 'Old clock on Jasper', where: 'The Summons · chapter 3', type: 'landmark', x: 300, y: 160 },
    { id: 'f3', img: 'finds/find-c.jpg', title: 'Steps by the bakery', where: 'Yesterday · 6:05 pm', type: 'shop', x: 72, y: 196 },
  ],
  newFind: (n) => ({ title: `New find ${n}`, where: 'Just now' }),
};

// Treadmill mode: walk map dock, "Inside the box option two" (UX doc approved by Melissa, Nov 26; copy still NSC-2128)
export const TREADDOCK = {
  k: 'Treadmill',
  tipWinter: 'Too cold out? Treadmill steps count too. Flip the switch and walk this chapter inside.',
  tipMode: 'This switch turns on treadmill mode. Set your belt speed and we’ll count your steps as you walk.',
  tipTap: 'Tap anywhere',
  info: 'Show the tips again',
  huntNo: 'Hunt does not start treadmill.',
  toggle: 'Treadmill',
  speedK: 'Belt speed',
  speedH: 'How fast is your belt?',
  kmh: (v) => `${v.toFixed(1)} km/h`,
  est: (m) => `About ${m} min to the next chapter`,
  start: 'Start walking',
  pause: 'Pause walk',
  resume: 'Resume walking',
  up: 'Faster',
  down: 'Slower',
  steps: (n, g) => `${n} of ${g} steps`,
  arrived: 'Chapter unlocked',
  read: 'Read the Chapter',
  endedToast: 'Treadmill off. Your steps are saved.',
  placeholder: 'Tip copy is still a placeholder (NSC-2128).',
};

// Today: weather now, your day later (NSC-2137)
export const TODAY26 = {
  calK: 'Your day',
  calLine: 'You’re free 12:30 – 1:00. That’s a 20-minute chapter.',
  calSub: 'From your calendar. We only see the gap, never what your plans are.',
  calBtn: 'Find Me a Time',
  calAskH: 'Find you a free window?',
  calAskP: 'We’ll look at your calendar on this phone for gaps long enough for a chapter. Event names and places never leave your phone.',
  calYes: 'Look for Gaps',
  calNo: 'Not Now',
  calOn: 'Calendar on. We’ll only suggest, never nag.',
  calTeen: 'Calendar suggestions are off for players under 13.',
  calLater: 'Later: opt-in. Shown here so the team can see it.',
};
