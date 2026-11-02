// Every line of text in the armchair preview lives here.
// Story text is lightly paraphrased from docs/script-the-summons.md (chapter 1, "The Summons").
// Buttons: Title Case. Chapter titles: sentence case. Story titles: Title Case.

export const COPY = {
  pageTitle: 'Story City · Armchair preview',
  draftFlag: 'Mockup',

  tester: {
    open: 'Tester',
    title: 'Tester switch',
    hint: 'Pick a version. The page restarts with ?v= set.',
    restart: 'Start Over',
    close: 'Close',
  },

  // 1. First open
  start: {
    eyebrow: 'Story City',
    title: 'Walk into a story',
    line: 'Your neighbourhood becomes the stage. Start the first chapter right now — no shoes needed.',
    storyEyebrow: 'Free preview',
    storyTitle: 'The Summons',
    storyMeta: 'Mystery · Chapter 1 of 3',
    couch: 'Try It From Your Couch (2 Min)',
    outside: "I'm Outside, Let's Go",
    fine: 'A made-up story. Every character is fictional.',
  },

  // "I'm outside" path
  outside: {
    eyebrow: 'Real walk',
    title: 'Straight to the real thing',
    body: 'In the app, this skips the couch chapter and opens The Summons with your location on. You walk to a street corner, then a mailbox.',
    note: 'This mockup only covers the couch path.',
    back: 'Back to Start',
    couch: 'Try the Couch Version',
  },

  // 2. Armchair chapter
  chapter: {
    eyebrow: 'The Summons · Chapter 1',
    title: 'A text from nowhere',
    unknown: 'Unknown number',
    you: 'You',
    typing: 'typing',
    stepsLabel: 'steps',
    stepsTap: 'Pretend to Walk',
    stepsHint: 'Tap, hold, or walk around the room with your phone.',
    stepsDone: 'You made it',
    sealHint: 'Tap the wax seal to break it',
    sealCracks: ['Crack…', 'Almost…'],
    finish: 'Finish the Chapter',
  },

  // The beats, in order. Types: narr (story text), sms (text from the unknown number),
  // you (player reply), scene (drawing), steps (indoor step goal), choice, seal (puzzle), go (one button).
  beats: [
    { t: 'narr', text: "It's an ordinary day, just like any other." },
    { t: 'sms', text: 'Look out your window' },
    { t: 'narr', text: 'Curiosity (or maybe naivety) leading the way, you head for the nearest window that faces the street.' },
    { t: 'steps', goal: 30, label: 'to the window', icon: '🪟' },
    { t: 'you', text: "I'm at the window" },
    { t: 'scene', name: 'window' },
    { t: 'narr', text: 'On the corner across the street stands a figure in a dark hoodie, a strange symbol on the front. They look up, then tap at the phone in their hand.' },
    { t: 'sms', text: 'Are you ready for a higher purpose? Come to the street corner.' },
    { t: 'choice', options: [
      { label: 'Head to the Corner', you: "I'm on my way", then: [] },
      { label: 'Stay Inside', you: "I'd rather stay inside", then: [
        { t: 'narr', text: 'You step back and pick up the remote. When you peek again, the figure is still there, calm as anything, as if they have all the time in the world.' },
        { t: 'narr', text: 'It would take less than five minutes to check it out. Surely.' },
        { t: 'go', label: 'Fine, Just a Peek', you: 'Fine. Just a peek.' },
      ] },
    ] },
    { t: 'narr', text: 'For now, your hallway will have to play the part of the sidewalk.' },
    { t: 'steps', goal: 40, label: 'to the street corner', icon: '🚏' },
    { t: 'you', text: "I'm at the street corner" },
    { t: 'narr', text: 'As you get close, the figure drops something on the ground and slips around the corner to the next street over.' },
    { t: 'narr', text: 'It’s a letter, sealed with an intricate wax seal. The same symbol as the hoodie.' },
    { t: 'seal' },
    { t: 'narr', text: 'Inside, in looping cursive, just two lines:' },
    { t: 'letter', lines: ['Take a picture with me.', 'Then deliver me.'] },
  ],

  // Extra indoor beat, only in the taste-more variant
  extraBeats: [
    { t: 'go', label: 'Snap a Picture', you: '📸 Snap' },
    { t: 'photo' },
    { t: 'narr', text: 'In the photo, something you missed: tiny numbers pressed into the rim of the seal.' },
    { t: 'code', answer: '786666', prompt: 'Copy the seal’s number into your casebook', ok: 'Saved to your casebook' },
    { t: 'sms', text: 'Deliver the letter, enter its code, and all will be revealed.' },
  ],

  photo: { flash: 'Saved to your casebook', caption: 'The letter, photographed' },
  keypad: { clear: 'Clear', wrong: 'Not quite. Look at the rim of the seal again.', label: 'Seal number' },

  // 3. Cliffhanger, then paywall
  paywall: {
    eyebrow: 'Your free trial',
    title: 'How your free trial works',
    close: 'Close',
    steps: [
      { when: 'Today', icon: '🔓', text: 'Full access to every story and every chapter, starting with the rest of The Summons.' },
      { when: 'Day 5', icon: '🔔', text: "We'll send you a reminder that your trial is ending." },
      { when: 'Day 7', icon: '⭐', text: 'Your plan starts. Cancel anytime before then and you pay nothing.' },
    ],
    plans: [
      { id: 'annual', name: 'Yearly', price: '$X / year', sub: 'Works out to $X a month', tag: 'Best value' },
      { id: 'monthly', name: 'Monthly', price: '$X / month', sub: 'Billed every month', tag: '' },
    ],
    placeholder: 'Prices are placeholders.',
    start: 'Start Free Trial',
    notNow: 'Not Now',
    fine: 'Cancel anytime in your app store settings.',
    started: 'Your free trial has started',
  },

  // 4. Walk it for real
  walk: {
    eyebrowTrial: 'Trial started · Chapter 2',
    eyebrowFree: 'Chapter 2 · Outside',
    title: 'Tomorrow, walk it for real',
    bodyTrial: 'The letter is in your casebook. Next time you head out, The Summons picks up right where you left off.',
    bodyFree: 'The letter is in your casebook. Chapter 2 happens outside, and your free trial can start whenever you’re ready.',
    needTitle: "What you'll need",
    needs: [
      { icon: '⏱️', text: 'About 10 minutes' },
      { icon: '🚏', text: 'A street corner' },
      { icon: '📮', text: 'A mailbox nearby' },
      { icon: '👟', text: 'Comfy shoes, if you like' },
    ],
    remindLabel: 'Remind me tomorrow',
    remindOptional: 'Optional. One gentle nudge, that’s all.',
    timeLabel: 'Time',
    times: ['8:00 am', '12:00 pm', '5:30 pm', '7:00 pm'],
    timeDefault: 2,
    done: 'Done',
    doneSet: 'Set Reminder',
    allSetTitle: 'See you out there',
    allSetReminder: "We'll remind you tomorrow at {time}.",
    allSetNone: 'No reminder. The story will wait for you.',
    restart: 'Start Over',
  },
};

// Tester switch (?v=). Text for each version lives here too.
export const VARIANTS = {
  'paywall-first': {
    label: 'Paywall first',
    desc: 'The paywall comes straight after the letter opens.',
    extra: false,
    cliff: {
      eyebrow: 'End of chapter 1',
      title: 'The letter wants to be delivered',
      body: 'Somewhere near you, there’s a real mailbox. Chapter 2 happens there.',
      next: 'See What’s Next',
    },
  },
  'taste-more': {
    label: 'Taste more',
    desc: 'One more indoor beat (photo + the seal’s number), then the paywall.',
    extra: true,
    cliff: {
      eyebrow: 'End of chapter 1',
      title: 'You have the code',
      body: 'Now the letter needs a real mailbox, somewhere near you. Chapter 2 happens there.',
      next: 'See What’s Next',
    },
  },
};
export const DEFAULT_VARIANT = 'paywall-first';
