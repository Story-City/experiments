// Every screen line for the first-story-flow mockup. One line = one edit.
// [real] = word for word from the app (origin/main 4.28.1, or 4.27.2 for the old flow).
// [new]  = written for this proposal.
// {story} {who} {walk} are filled in by app.js.

// Two flows, switched in the tester panel (?flow=a|b). B is the default.
//   A = the Nov 12 proposal.  B = story first (the Nov 16 research report's recommended flow).
export const FLOWS = {
  a: ['hook', 'walk', 'trial1', 'home', 'ch1', 'unlock1', 'account', 'trial2', 'finish'],
  b: ['hook', 'walk', 'ch1', 'trial1', 'unlock1', 'account', 'trial2', 'finish', 'home'],
};

// Every step, as the tester panel and the side note show them. a / b = the note for that flow.
export const STEP_INFO = {
  hook: { name: 'Hook',
    a: 'One screen, one promise, one button. Replaces the portal intro and the old carousel.',
    b: 'One screen, one promise, one button. “Your first story is free.” sets expectations before any offer.' },
  walk: { name: 'How do you walk?',
    a: 'One tap. The answer sets the map mode the first story opens in (Steps or Hunt) and which stories go on the Start here shelf. Path shows as “coming soon”.',
    b: 'One tap (version A tiles). The answer sets the map mode, then The Summons starts straight away.' },
  trial1: { name: 'Trial offer (skippable)', nameB: 'Trial offer (2 pages)',
    a: 'The early “cold” paywall from 4.27.2, shown once. The real one is RevenueCat’s hosted paywall; this is a stand-in.',
    b: 'Right after chapter 1’s payoff. Page 1: what you get. Page 2: Today / Day 5 / Day 7 and the plans. “Skip for now” on both. The reminder is promised, not shown as a push.' },
  home: { name: 'Home: Start here + tour', nameB: 'Home, after the story',
    a: 'Home in the app’s dark look. A new Start here shelf on top: the real Summons (“Tiny story”) plus three short stories matched to the walk answer. A three-stop tour points out Start here, the Map tab and the Library tab.',
    b: 'Home, the Start here shelf and the three-stop tour only appear once the first story is done.' },
  ch1: { name: 'Chapter 1',
    a: 'Chat-bubble reader. First-time-only tips: the first choice, the first puzzle, and a map spotlight at the chapter end.',
    b: 'Straight into The Summons: no Home, shelf or tour. “Not feeling it?” offers the three stories matched to the walk answer.' },
  unlock1: { name: 'First unlock',
    a: 'The key fix: about 30 steps, or “I’m at home” unlocks it on the couch. Modes can be switched any time.',
    b: 'The character asks for step counting, then the iOS prompt. Steps already walked today (iPhone) unlock it at once. “I’m at home” is an equal button that plays a short virtual walk. Location is asked only in Hunt.' },
  account: { name: 'Save your story?',
    a: 'A soft account ask after chapter 1. “Not now” keeps playing.',
    b: 'A soft account ask after chapter 1, then one notification ask. “Not now” keeps playing.' },
  trial2: { name: 'Second trial offer',
    a: 'At chapter 2’s cliffhanger, only for players who skipped step 3. Players with a trial go straight on.',
    b: 'Chapter 2’s cliffhanger, same session. Without a trial: the offer again, or “Walk 500 steps tomorrow” for free (Melissa to decide; switch in the tester panel).' },
  finish: { name: 'Finish + reminder',
    a: 'A short first story ends. “Your next chapter is waiting” is tied to their step goal.',
    b: 'The first story ends with the reminder. Then Home opens for the first time.' },
};

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
    title2: 'Walk to find out what happens next.',
    titleB: 'Pick up the story.',                                    // [new] flow B: the story starts for you (research report, step 1)                  // [new] blue second line, like “an adventure.”
    sub: '',                                                        // removed (Melissa, Nov 12); the real line is “Less scrolling, more strolling. Never have a boring walk again.”
    cta: 'Start Exploring',                                         // [real]
    login: 'Already have an account? Sign in',                      // [real]
    loginToast: 'Sign in opens here',
    free: 'Your first story is free.',                              // [new] flow B (research report, step 1)
  },
  pick: {                                                           // [new] flow B, chapter 1
    link: 'Not feeling it? Pick another story',
    title: 'Pick another story',
    sub: 'Short first stories for {for}.',
  },
  // Flow B's two-page trial offer. Page 1 = the real RevenueCat points; page 2 = how the trial works.
  trialB: {
    done: '✓ Chapter 1 complete',                                   // [new]
    next: 'Continue',
    title: 'Try every story', title2: 'free for 7 days',            // [new]
    timeline: [                                                     // [new]
      ['Today', 'Your free trial starts', 'Play every story, with no limits.'],
      ['Day 5', 'We remind you', 'A heads-up before your trial ends.'],
      ['Day 7', 'Your plan starts', 'Cancel any time before then.'],
    ],
  },
  // Flow B permissions. Lines marked [real] are from the app (summons.ts, app.config.ts, en.json scriptedFtue).
  perm: {
    motionAsk: "Their drop is within {n} steps of you, but my scans can't tell which way. Turn on step tracking and I'll count them down.", // [real]
    motionBtn: 'Share my steps',                                    // [real]
    homeBtn: 'I’m at home',                                         // [new]
    iosMotion: '“Story City” Would Like to Access Your Motion & Fitness Activity', // iOS system
    motionWhy: "Story City counts your steps while you're signed in, for your step stats and so you can walk to unlock chapters.", // [real] NSMotionUsageDescription
    iosNo: 'Don’t Allow', iosOk: 'OK',                              // iOS system
    motionOn: '👣 Step counting on',                                // [real]
    today: 'You’ve already walked {steps} steps today.',            // [new]
    motionOff: 'Step counting is off, so this chapter plays at home.', // [new]
    turnOn: 'Enable step tracking',                                 // [real]
    settingsToast: 'In the app, this opens Settings',
    locAsk: "Ok, we'll need you to share your location so we can guide you.", // [real]
    locBtn: 'Share my location',                                    // [real]
    iosLoc: 'Allow “Story City” to use your location?',             // iOS system
    locWhy: 'Uses your location in the background to progress through adventures, and locate stories near you.', // [real] NSLocationWhenInUseUsageDescription
    iosOnce: 'Allow Once', iosWhile: 'Allow While Using App',       // iOS system (no “Always” in session one)
    locOn: '📍 Location shared',                                    // [real]
    locOff: 'Location is off, so this hunt plays at home.',         // [new]
    virtual: 'A short walk from home',                              // [new]
    virtualSub: 'Your character walks it for you.',                 // [new]
  },
  nudge: {                                                          // [new] flow B, after “Save your story?”
    title: 'Want a nudge when your next chapter unlocks?',
    sub: 'One notification when it’s ready.',
    yes: 'Yes, nudge me',
    no: 'Not now',
    ios: '“Story City” Would Like to Send You Notifications',       // iOS system
    iosBody: 'Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.', // iOS system
    allow: 'Allow',
    on: '🔔 Notifications on',                                       // [real]
  },
  wait: {                                                           // [new] flow B free path (Melissa to decide)
    link: 'Or walk 500 steps tomorrow to unlock it free',
    title: 'Chapter 3 unlocks tomorrow',
    sub: 'Walk 500 steps tomorrow and it’s yours, free. We’ll send one reminder.',
    demo: 'Pretend it’s tomorrow',
    trial: 'Or start your free trial',
    objective: 'Walk 500 steps',
  },
  resume: {                                                         // [new] tester: close and reopen the app
    kick: 'Welcome back',
    title: 'Pick up where you left off',
    chapter: 'Chapter {n} of {of}',
    cta: 'Keep reading',
    other: 'Start something else',
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
    notNow: 'Not now',                                              // flow B: no Home yet, so this opens it for the first time
  },
  library: {
    search: 'Search',                                               // [real] common.search
    start: 'Start here',                                            // [new]
    startSub: 'Short first stories for {for}. Each one takes about 15 minutes.', // [new]
    sampleTag: 'Tiny story',                                        // [new] Golden Path Q8 pick B
    playedTag: '✓ Played',                                          // [new] flow B: Home opens after the first story
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
    goalFree: 500,                                                  // flow B “walk tomorrow” path
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
    today: 'Your steps from today unlocked it.',                     // [new] flow B pre-fill
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
    flow: 'Flow',
    flowA: 'A · Nov 12 proposal',
    flowB: 'B · Story first',
    today: 'Steps already walked today (iPhone)',
    todayNone: 'None',
    todaySome: '2,340',
    free: 'Free “walk tomorrow” path',
    freeOn: 'Show it',
    freeOff: 'Hide it',
    reopen: 'Close and reopen the app',
    reopenName: 'Close and reopen',
    reopenNote: 'The card a returning player sees. Guests can’t resume yet: saving progress is in the growth plan.',
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
