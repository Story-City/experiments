// Every screen line for the first-story-flow mockup. One line = one edit.
// [real] = word for word from the app (origin/main 4.28.1, or 4.27.2 for the old flow).
// [new]  = written for this proposal.
// {story} {who} {walk} are filled in by app.js.

// The nine steps, as the tester panel and the side note show them.
export const STEPS = [
  { name: 'Hook', note: 'One screen, one promise, one button. Replaces the portal intro and the old carousel.' },
  { name: 'How do you walk?', note: 'One tap. The answer sets the map mode the first story opens in (Steps or Hunt) and which stories go on the Start here shelf. Path shows as “coming soon”.' },
  { name: 'Trial offer (skippable)', note: 'The early “cold” paywall from 4.27.2, shown once. The real one is RevenueCat’s hosted paywall; this is a stand-in.' },
  { name: 'Home: Start here + tour', note: 'Home in the app’s dark look. A new Start here shelf on top: the real Summons (“Tiny story”) plus three short stories matched to the walk answer. A three-stop tour points out Start here, the Map tab and the Library tab.' },
  { name: 'Chapter 1', note: 'Chat-bubble reader. First-time-only tips: the first choice, the first puzzle, and a map spotlight at the chapter end.' },
  { name: 'First unlock', note: 'The key fix: about 30 steps, or “I’m at home” unlocks it on the couch. Modes can be switched any time.' },
  { name: 'Save your story?', note: 'A soft account ask after chapter 1. “Not now” keeps playing.' },
  { name: 'Second trial offer', note: 'At chapter 2’s cliffhanger, only for players who skipped step 3. Players with a trial go straight on.' },
  { name: 'Finish + reminder', note: 'A short first story ends. “Your next chapter is waiting” is tied to their step goal.' },
];

// Step 2 answers. mode = the map mode the first story opens in.
export const WALKS = {
  dog:       { label: 'Dog walks',          short: 'dog walks', for: 'your dog walks',  line: 'Same route, new story every day.', mode: 'steps' },   // [new]
  city:      { label: 'Exploring my city',  short: 'exploring', for: 'exploring your city',  line: 'Real places reveal what happens next.', mode: 'hunt' }, // line trimmed from the real Explore card
  treadmill: { label: 'Treadmill',          short: 'treadmill', for: 'the treadmill',  line: 'Every step counts, even on the spot.', mode: 'steps' }, // [new]
  home:      { label: 'At home',            short: 'at home', for: 'playing at home',    line: 'Play from the couch. Walk when you like.', mode: 'steps' }, // [new]
};

// Step 2, version C: select all that apply. walk = which Start here shelf; mode = starting map mode.
export const LIKES = {                                              // [new]
  alone:     { label: 'Alone',                walk: 'dog',       mode: 'steps' },
  partner:   { label: 'With my partner',      walk: 'dog',       mode: 'steps' },
  kids:      { label: 'With my kids',         walk: 'home',      mode: 'steps' },
  dog:       { label: 'With my dog',          walk: 'dog',       mode: 'steps' },
  route:     { label: 'Same route every day', walk: 'dog',       mode: 'steps' },
  explore:   { label: 'Exploring new places', walk: 'city',      mode: 'hunt' },
  treadmill: { label: 'On a treadmill',       walk: 'treadmill', mode: 'steps' },
  home:      { label: 'At home',              walk: 'home',      mode: 'steps' },
};

export const COPY = {
  hook: {
    title: 'Pick a story.',                                         // [new] (the brief), in the real welcome layout
    title2: 'Walk to find out what happens next.',                  // [new] blue second line, like “an adventure.”
    sub: '',                                                        // removed (Melissa, Nov 12); the real line is “Less scrolling, more strolling. Never have a boring walk again.”
    cta: 'Start Exploring',                                         // [real]
    login: 'Already have an account? Sign in',                      // [real]
    loginToast: 'Sign in opens here',
  },
  likes: {
    title: 'How do you like to walk?',                              // [new] (Melissa, Nov 12)
    sub: 'Select all that apply.',
    cta: 'Continue',
  },
  walk: {
    kick: 'Walk to Unlock',                                         // [real] 4.27.2 mode-pick subheader
    title: 'How do you usually walk?',                              // [new] (Melissa, Nov 12; was “How would you like to unlock adventures?”)
    sub: 'Adventures progress as you move in the world.',           // [real] 4.27.2
    fine: 'Not sure? No problem. Switch anytime.',                  // [real] 4.27.2, trimmed (Melissa, Nov 12)
  },
  modes: {
    steps: { name: 'Steps', tipTitle: 'STEPS MODE' },               // [real] decision Nov 4 (code still says Walk / WALK MODE)
    path: { name: 'Path', tip: 'Path is coming soon.', tipTitle: 'PATH MODE' },
    hunt: { name: 'Hunt', tipTitle: 'HUNT MODE' },                  // [real]
  },
  // The paywall is RevenueCat's hosted screen, copied from the running app (Nov 12).
  paywall: {
    points: [                                                       // [real]
      ['Make Walking Actually Fun', 'Hit step goals while saving worlds'],
      ['100+ Adventures', 'Fantasy, mysteries, puzzles & more'],
      ['Track Every Adventure', 'Accumulate steps across adventures'],
    ],
    cta: 'Start 7-day free trial',                                  // [real]
    skip: 'Skip for now',                                           // [real]
    started: 'Trial started',
  },
  trial: { title: 'Turn Your Steps into', title2: 'Adventures' },   // [real]
  trial2: { title: 'Find out what', title2: 'happens next' },       // [new] same paywall, cliffhanger headline
  plans: [                                                          // [real]
    { name: 'Monthly', price: '$3.99 / month' },
    { name: 'Yearly', price: '$2.49 / month', tag: '38% OFF' },
  ],
  locked: {
    title: 'End of Preview',                                        // [real]
    sub: 'Start a free trial to keep reading and unlock every premium adventure.', // [real] previewWall.premiumBodyTrial
    cta: 'Start your free trial',
    back: 'Back to Home',
  },
  library: {
    search: 'Search',                                               // [real] common.search
    start: 'Start here',                                            // [new]
    startSub: 'Short first stories for {for}. Each one takes about 15 minutes.', // [new]
    sampleTag: 'Tiny story',                                        // [new] Golden Path Q8 pick B
    chapters: 'chapters',
    anywhere: 'Play Anywhere',                                      // [real] travel chip
  },
  tabs: [                                                           // [real] mainNavTabs; Map is debug-only in 4.28
    { k: 'home', label: 'Home' },
    { k: 'feed', label: 'Feed' },
    { k: 'map', label: 'Map' },
    { k: 'lib', label: 'Library' },
  ],
  tour: [                                                           // [new] first visit to Home, tap anywhere
    { target: '.start', title: 'Start here', text: 'Short first stories picked for {for}. Tap one to begin.' },
    { target: '[data-tab="map"]', title: 'Your map', text: 'See stories around you. Inside a story, the map shows where to walk next.' },
    { target: '[data-tab="lib"]', title: 'Your Library', text: 'Stories you start are saved here, so you can pick up where you left off.' },
  ],
  mapTab: { title: 'Stories around you', sub: 'Tap a pin to start one. Play Anywhere stories meet you wherever you are.' }, // [new]
  libTab: {
    guest: 'Create an Account to add Adventures to your Library',   // [real] NotLoggedInView
    signin: 'Sign In/Register',                                     // [real]
    browse: 'Back to Browse Adventures',                            // [real]
    signinToast: 'Opens the sign-up drawer',
    inProgress: 'In Progress',                                      // [real]
    one: 'Adventure', many: 'Adventures',                           // [real]
    empty: 'Your library is empty!',                                // [real]
    emptySub: 'Start an adventure from the Home tab.',              // [real], “Explore tab” → “Home tab”
  },
  feedTab: 'Feed isn’t part of this mockup.',
  pushBack: {                                                       // [real] the Summons location push-back
    title: 'Story City is more fun with location',
    sub: 'Your location lets the story find you and unlock each chapter as you walk. Want to give it a try?',
    no: 'No thanks',
    noToast: 'In the app, “No thanks” leads to another ending',
  },
  overview: {
    where: { anywhere: 'Play Anywhere', near: 'Near You' },
    opensIn: 'Opens in',
    switch: 'Switch modes any time.',
    cta: 'Start Adventure',
    back: 'Back',
  },
  reader: {
    end1: 'End of chapter 1',
    end2: 'End of chapter 2',
    openMap: 'Open the map',
  },
  unlock: {
    unlocks: 'Unlocks chapter',
    goal: '30 steps',
    goalSteps: 30,                                                  // first unlock: tiny on purpose
    goalSteps2: 60,
    walkTitle: 'Walk {n} steps to {place}',
    walkSub: 'Walk in any direction. The circle shrinks as you near your goal.', // [real] map tip, trimmed
    walkSubHome: 'Walk around the room, or skip it this time.',
    outOf: 'out of {n} steps',                                      // [real]
    huntSub: 'Point your camera at it and tap the button.',
    photo: 'Take a photo',
    pretend: 'Pretend to walk',                                     // tester-only button
    homeTitle: 'I’m at home',                                       // [new] the couch-proof unlock
    homeSub: 'Skip the walk this time. Steps you take later still count.',
    homeSubHunt: 'No camera hunt today. Unlock it from the couch.',
    homeBtn: 'Skip the walk',                                       // [real] reader.skipSteps
    tip: 'Walk about 30 steps and chapter 2 unlocks. At home? Skip the walk.', // [new], tip box style is real
  },
  unlocked: {
    kick: '✓ Chapter unlocked',                                     // [real]
    title: 'Chapter {n} is ready',
    walk: 'You walked it. Nice.',
    photo: 'Photo saved. Nice find.',
    home: 'Unlocked from home. Your steps still count whenever you walk.',
    cta: 'Keep reading',
  },
  account: {
    title: 'Save your story?',                                      // [new] (the brief); the real drawer says “Sign up”
    sub: 'Create a free account to keep your progress and pick up your story on any phone.', // [real] FTUE line, “gem” → “progress”
    google: 'Continue with Google',                                 // [real]
    facebook: 'Continue with Facebook',                             // [real]
    apple: 'Continue with Apple',                                   // [real]
    email: 'Continue with Email',                                   // [real]
    skip: 'Not now',                                                // [real] FTUE version (the main drawer says “Continue as Guest”)
    legal: 'By creating an account you are agreeing to our <a>EULA</a>', // [real]
    saved: 'Story saved',
    later: 'We’ll ask again later',
  },
  finish: {
    kick: 'The End',
    title: 'You finished your first story!',                       // [new], Golden Path Q8 pattern
    ending: 'Ending {n} of {of}',
    replay: 'Other choices lead to other endings. Replay any time.',
    oneEnd: 'More episodes are on the way.',
    remindKick: 'Your next chapter is waiting',                     // [new] (the brief)
    notifTitle: 'Your next chapter is waiting',
    notifBody: 'You hit 30 steps. Chapter 1 of your next story is unlocked.',
    notifWhen: 'now',
    remindSub: 'We’ll nudge you once, when you reach today’s step goal.',
    remindLabel: 'Remind me on my next walk',
    upNext: 'Up next',
    cta: 'See the Full Story Library',                              // [real] FTUE recs button
  },
  tips: {
    choice: 'Your choices change the ending.',                       // [new] (the brief)
    puzzle: 'Tap each tile to crack the code.',                     // [new], snackbar style is real
    map: 'Your map unlocks the next chapter. Open it when you’re ready.', // [new]
    tapAnywhere: 'Tap anywhere to continue',
  },
  tester: {
    title: 'Tester panel',
    walk: 'Walk answer',
    story: 'Story',
    tiles: 'Step 2 version',
    tilesA: 'A · Centred',
    tilesB: 'B · Big icon',
    tilesC: 'C · Select all',
    trial: 'First trial offer',
    skipped: 'Skipped',
    took: 'Took it',
    reset: 'Reset tips and start over',
  },
};
