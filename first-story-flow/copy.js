// Every screen line for the first-story-flow mockup. One line = one edit.
// [real] = word for word from the app (origin/main 4.28.1, or 4.27.2 for the old flow).
// [new]  = written for this proposal.
// {story} {who} {walk} are filled in by app.js.

// The nine steps, as the tester panel and the side note show them.
export const STEPS = [
  { name: 'Hook', note: 'One screen, one promise, one button. Replaces the portal intro and the old carousel.' },
  { name: 'How do you walk?', note: 'One tap. The answer sets the map mode the first story opens in (Steps or Hunt) and which stories go on the Start here shelf. Path shows as “coming soon”.' },
  { name: 'Trial offer (skippable)', note: 'The early “cold” paywall from 4.27.2, shown once. The real one is RevenueCat’s hosted paywall; this is a stand-in.' },
  { name: 'Library: Start here', note: 'Three short first stories matched to the walk answer, plus the sample story as one choice, not forced.' },
  { name: 'Chapter 1', note: 'Chat-bubble reader. First-time-only tips: the first choice, the first puzzle, and a map spotlight at the chapter end.' },
  { name: 'First unlock', note: 'The key fix: about 30 steps, or “I’m at home” unlocks it on the couch. Modes can be switched any time.' },
  { name: 'Save your story?', note: 'A soft account ask after chapter 1. “Not now” keeps playing.' },
  { name: 'Second trial offer', note: 'At chapter 2’s cliffhanger, only for players who skipped step 3. Players with a trial go straight on.' },
  { name: 'Finish + reminder', note: 'A short first story ends. “Your next chapter is waiting” is tied to their step goal.' },
];

// Step 2 answers. mode = the map mode the first story opens in.
export const WALKS = {
  dog:       { label: 'Dog walks',          short: 'dog walks', for: 'your dog walks',  line: 'Same route, new story every day.', mode: 'steps' },   // [new]
  city:      { label: 'Exploring my city',  short: 'exploring', for: 'exploring your city',  line: 'Head to real places to reveal what happens next.', mode: 'hunt' }, // line [real] Explore card
  treadmill: { label: 'Treadmill',          short: 'treadmill', for: 'the treadmill',  line: 'Every step counts, even on the spot.', mode: 'steps' }, // [new]
  home:      { label: 'At home',            short: 'at home', for: 'playing at home',    line: 'Play from the couch. Walk when you like.', mode: 'steps' }, // [new]
};

export const COPY = {
  hook: {
    title: 'Pick a story. Walk to find out what happens next.',   // [new] (the brief)
    sub: 'Don’t just walk. Explore.',                               // [real] 4.27.2 intro subtitle
    cta: 'Start Exploring',                                         // [real] 4.27.2
    login: 'Already have an account? Sign in',                      // [real]
    loginToast: 'Sign in opens here',
  },
  walk: {
    kick: 'Walk to Unlock',                                         // [real] 4.27.2 mode-pick subheader
    title: 'How do you walk?',                                      // [new] (was “How would you like to unlock adventures?”)
    sub: 'Adventures progress as you move in the world.',           // [real] 4.27.2
    fine: 'Not sure? No problem. Switch any time on the map.',      // [real] 4.27.2, “on your Profile” → “on the map”
  },
  modes: {
    steps: { name: 'Steps' },                                       // [real] decision Nov 4 (code still says Walk)
    path: { name: 'Path', tip: 'Path is coming soon.' },
    hunt: { name: 'Hunt' },
  },
  trial: {
    title: 'Start your free trial',                                 // [real]
    points: ['Every chapter of every story', 'New stories every month', 'Cancel any time before day 7'], // [new]
    cta: 'Start your free trial',                                   // [real]
    fine: '7 days free, then billed yearly. Cancel any time in Settings.', // [new]
    skip: 'Not now',                                                // [real] previewWall.notNow
    started: 'Trial started',
  },
  trial2: {
    kick: '{story} · end of chapter 2',
    title: 'Start a free trial to keep reading',                    // [real]
    points: ['Find out what happens next', 'Every premium adventure', 'Cancel any time before day 7'], // [new]
    cta: 'Start your free trial',                                   // [real]
    fine: '7 days free, then billed yearly. Cancel any time in Settings.',
    skip: 'Not now',                                                // [real]
    started: 'Trial started',
  },
  plans: [
    { name: 'Yearly', sub: '7 days free', price: '$4.17/mo', tag: 'Best value' },   // prices are placeholders
    { name: 'Monthly', sub: 'No trial', price: '$9.99/mo' },
  ],
  locked: {
    title: 'End of Preview',                                        // [real]
    sub: 'Start a free trial to keep reading and unlock every premium adventure.', // [real] previewWall.premiumBodyTrial
    cta: 'Start your free trial',
    back: 'Back to Library',
  },
  library: {
    title: 'Library',
    search: 'Search adventures',
    start: 'Start here',                                            // [new]
    startSub: 'Short first stories for {for}. Each one takes about 15 minutes.', // [new]
    sampleTag: 'Tiny story',                                        // [new] Golden Path Q8 pick B
    chapters: 'chapters',
    anywhere: 'Play Anywhere',                                      // [real] travel chip
    seeAll: 'See all',
  },
  shelves: { anywhere: 'Play Anywhere Adventures', near: 'Adventures Near You' }, // [real] Explore section names
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
    tipTitle: 'How it works',                                        // [real]
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
    kick: 'End of chapter 1',
    title: 'Save your story?',                                      // [new] (the brief)
    sub: 'Create a free account to keep your progress and pick up your story on any phone.', // [real] FTUE line, “gem” → “progress”
    points: ['Read every free adventure', 'Save progress, track steps, earn points!'], // [real] SignupBenefits
    icons: ['img/premium-story-icon.png', 'img/progress-tracking-icon.png'],
    google: 'Continue with Google',                                 // [real]
    apple: 'Continue with Apple',                                   // [real]
    email: 'Continue with Email',                                   // [real]
    skip: 'Not now',                                                // [real] FTUE version
    legal: 'By continuing you agree to the Terms and Privacy Policy.',
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
    cta: 'Back to Library',
  },
  tips: {
    library: 'Start with a short one. You can switch stories any time.',   // [new]
    choice: 'Your choices change the ending.',                       // [new] (the brief)
    puzzle: 'Tap each tile to crack the code.',                     // [new], snackbar style is real
    map: 'Your map unlocks the next chapter. Open it when you’re ready.', // [new]
    tapAnywhere: 'Tap anywhere to continue',
  },
  tester: {
    title: 'Tester panel',
    walk: 'Walk answer',
    story: 'Story',
    trial: 'First trial offer',
    skipped: 'Skipped',
    took: 'Took it',
    reset: 'Reset tips and start over',
  },
};
