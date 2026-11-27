// Starting a Story: every word on screen lives here, so a line edit is a one-line change.
// [real] = from the live app, the catalogue or a decided line; [new] = written for this mockup.

export const VERSIONS = {
  a: {
    letter: 'A', name: 'Four-option pop-up', who: 'Golden Path draft, Oct 30',
    note: 'Start opens a pop-up: route, walking, treadmill or at home. Tick “Remember my choice” and the pop-up stops showing.',
  },
  b: {
    letter: 'B', name: 'Smart default + Customize', who: 'Emily, Nov 3',
    note: 'The best way to play is already picked from where the story plays. One tap starts it. A small Customize link changes it.',
  },
  c: {
    letter: 'C', name: 'Time first', who: 'Emily, Nov 3',
    note: 'Start asks how long you have, then where to begin: your door, a park nearby or a virtual walk.',
  },
};

// The four story kinds a tester can pick. modes = map modes the story allows; best = the smart default (version B).
export const KINDS = {
  anywhere: {
    label: 'Play Anywhere', line: 'No set places. Just walk.',
    title: 'Frightnight Ghost Tours', img: 'img/frightnight.jpg', mins: 60, chapters: 9, genre: 'Spooky',     // [real] catalogue
    summary: 'Will you survive your first tour as a rookie exorcist?',                                       // [real]
    chapter: 'Mural start', first: 'Hey… can you hear me? Tap the button on the phone if you can hear me.',  // [real] chapter 1
    modes: ['steps', 'path', 'hunt'], best: 'steps',
    pin: 'Mural', pinSteps: 160, find: 'a mural',
  },
  nearyou: {
    label: 'Near You', line: 'Stops are kinds of places, found near you.',
    title: 'A Pirate Captain', img: 'img/pirate.jpg', mins: 45, chapters: 8, genre: 'Adventure',
    summary: 'Outwit rivals and gather your crew in a race for treasure and glory!',                          // [real]
    chapter: 'The wave feature', first: 'Quartermaster Donaldo is easy to spot. A large man with a blond beard and a tricorne hat, he stares at the water longingly.', // [real], trimmed
    modes: ['steps', 'path', 'hunt'], best: 'hunt',
    pin: 'Fountain', pinSteps: 140, find: 'a fountain',
  },
  passport: {
    label: 'Passport', line: 'Written for Brisbane, laid over your streets.',
    title: 'Covert Cadets (Brisbane)', img: 'img/cadets.jpg', mins: 30, chapters: 6, genre: 'Action',
    summary: 'A covert spy agency has recruited you — if you’re good enough. Can you ace this spy academy?',  // [real]
    chapter: 'Normal basketball', first: 'Your first test, Cadet. Find a court and show us what you’ve got.', // [new] (real chapter name)
    modes: ['steps', 'path', 'hunt'], best: 'path', city: 'Brisbane',
    pin: 'Basketball court', pinSteps: 220, find: 'a basketball hoop',
  },
  onespot: {
    label: 'One location', line: 'Played at one real place. No steps.',
    title: 'Dictators Laundromat', img: 'img/laundromat.jpg', mins: 45, chapters: 7, genre: 'Education',
    summary: 'Wanna learn how to launder money?',                                                            // [real]
    chapter: 'Welcome to the laundromat', first: 'Hey future tyrant! Welcome to the Dictator’s Laundromat, where we clean money, not clothes.', // [real]
    modes: ['path'], best: 'path', onlyHere: true,
    pin: 'Laundromat', pinSteps: 1600, find: '',
  },
};

export const NO_STEPS_TIP = 'This story can only be done in location, no steps.'; // [real] decided Nov 12

export const MODES = {
  steps: { label: 'Steps', line: 'Walk anywhere. The circle shrinks as you go.' },
  path:  { label: 'Path',  line: 'Follow the map to a place nearby.' },
  hunt:  { label: 'Hunt',  line: 'Find the thing and snap a photo.' },
};

export const STORY = {
  start: 'Start Story',
  chapters: '{n} chapters',
  mins: '{n} min',
  free: 'Chapter 1 free',
};

// Version A: the four-option pop-up (Golden Path, Oct 30)
export const A = {
  title: 'How do you want to play this time?',
  sub: 'Pick one for this story.',
  opts: {
    route:     { label: 'On a Route',  line: 'Follow a route near you.' },
    walk:      { label: 'Walking',     line: 'Head out your door. We’ll guide you.' },
    treadmill: { label: 'Treadmill',   line: 'Walk in place. Your steps still count.' },
    home:      { label: 'At Home',     line: 'Play from the couch. Walk when you like.' },
  },
  hereLabel: 'At the Location',
  hereLine: 'Go to the {place} to play.',
  remember: 'Remember my choice',
  rememberFine: 'Change it anytime in Settings.',
  go: 'Start Story',
  routesTitle: 'Routes near you',
  routesSub: 'Pick one. You’ll follow it the whole story.',
  routes: [
    { name: 'Old Strathcona loop', far: '1.4 km away', len: '2.1 km route' },
    { name: 'River Valley trail', far: '2.8 km away', len: '3.0 km route' },
    { name: 'Downtown arts walk', far: '6.5 km away', len: '2.4 km route' },
  ],
  remembered: 'Using your saved choice: {how}.',
};

// Version B: smart default + Customize (Emily, Nov 3)
export const B = {
  kick: 'How you’ll play',
  how: {
    steps: 'Steps, from your door',
    path: 'Path to a {place} near you',
    hunt: 'Hunt near you',
    here: 'At the {place}',
    treadmill: 'Steps, on a treadmill',
    home: 'At home',
  },
  why: {
    anywhere: 'This story fits any walk.',
    nearyou: 'Its stops are places near you.',
    passport: 'We’ll place Brisbane’s stops near you.',
    onespot: 'This story happens at one place.',
  },
  customize: 'Customize',
  sheetTitle: 'How do you want to play?',
  best: 'Best fit',
  indoors: 'Not going out?',
  treadmill: 'Treadmill',
  home: 'At Home',
};

// Version C: time first (Emily, Nov 3)
export const C = {
  timeTitle: 'How long do you have?',
  timeSub: 'We’ll fit the walks to your time.',
  times: [
    { m: 15, label: '15 min', line: 'A quick one', goal: 20 },
    { m: 30, label: '30 min', line: 'A good walk', goal: 30 },
    { m: 60, label: 'An hour or more', line: 'Make a day of it', goal: 40 },
  ],
  whereTitle: 'Where do you want to start?',
  where: {
    door: { label: 'From Your Door', line: 'Start right where you are.' },
    park: { label: 'A Park Nearby', line: 'Riverside Park, 6 min away.' },
    virtual: { label: 'A Virtual Walk', line: 'Walk anywhere. Watch the story’s map go by.' },
    virtualCity: { label: 'A Virtual Walk of {city}', line: 'Walk anywhere. Watch {city} go by.' },
  },
  hereLabel: 'At the {place}',
  hereLine: 'This story happens there.',
  noTime: 'This one takes about {mins} min at the {place}, so there’s no time to pick.',
  park: 'Riverside Park',
};

export const LOADING = {
  path: 'Cooking up your route…',   // [new] Emily's phrase, Nov 3
  hunt: 'Looking for {find} near you…',
  steps: 'Getting your story ready…',
};

export const MAP = {
  chapter: 'Chapter 1',
  stepsLeft: '{n} steps to go',
  stepsRow: '<b>{n} steps</b> to begin chapter 1',
  pathAway: '{pin} · {n} steps away',
  pathRow: '<b>{pin}</b>, {n} steps away',
  routeRow: 'On the <b>{route}</b>. First stop in {n} steps.',
  parkRow: 'Head to <b>Riverside Park</b>. Chapter 1 begins at the gate.',
  huntTitle: 'Find {find}',
  huntRow: 'Find <b>{find}</b>. Snap it when you do.',
  hint: 'Switch modes anytime. Your steps always count.',   // [real] decided line
  treadmill: 'Treadmill',
  treadRow: 'Set your belt going. <b>{n} steps</b> to begin.',
  home: 'At home',
  homeRow: 'Walk around the room, or skip it this time.',  // [real]
  homeBtn: 'Skip the Walk',                                // [real] reader.skipSteps
  virtual: 'Virtual walk',
  virtualOf: 'Virtual walk · {city}',
  pretend: 'Pretend to Walk',                              // tester-only
  pause: 'Pause',
  arrivedPath: 'You’re at the {pin}.',
  arrivedSteps: 'You walked it. Nice.',
  arrivedHunt: 'That looks like {find}.',
  arrivedHome: 'Skipped from home. Steps you take later still count.',
  arriveNote: 'Nothing opens until you tap.',              // crossing a geofence must not auto-advance
  read: 'Read Chapter 1',
  switched: 'Switched to {mode}.',
  shutter: 'Take photo',
};

export const END = {
  kick: 'Chapter 1 begins',
  taps: '{n} taps',
  tapsOne: '1 tap',
  tapsLine: 'from the story page to the chapter 1 map',
  how: 'Played as: {how}',
  again: 'Try Another Story Kind',
  next: 'Try Version {v}',
  restart: 'Start Over',
};

export const TESTER = {
  btn: 'Tester',
  version: 'Version',
  kind: 'Story kind',
  forget: 'Forget Saved Choice',
  restart: 'Start Over',
  tapsNow: '{n} taps so far',
  noteKick: 'Version {v} · {who}',
};
