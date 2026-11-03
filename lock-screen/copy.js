// Every line of text in the lock-screen mockup. Edit here; one line = one change.
// Button labels are Title Case. Canadian spelling. No streaks, no guilt, no countdowns.

export const PAGE = {
  kicker: 'Experiment · Lock screen',
  title: 'The story keeps walking with you',
  body: 'Your chapter lives on the lock screen, the Dynamic Island, your home screen and your wrist, so your eyes can stay on the street.',
  surfaceLabel: 'Show',
  platformLabel: 'Phone',
  ios: 'iPhone',
  android: 'Android',
  walk: 'Pretend to Walk',
  pause: 'Pause',
  resume: 'Keep Walking',
  again: 'Start Over',
  tour: 'Tour',
  stopTour: 'Stop Tour',
  draft: 'Concept · not the live app',
};

// The dropdown, in Tour order. `caption` explains the surface beside the phone.
export const SURFACES = [
  { key: 'lock', label: 'Lock screen · Live Activity',
    caption: { kicker: 'Lock screen', title: 'Your chapter, without unlocking', body: 'Distance, a progress bar and one line of story. It changes as you walk, then tells you when the chapter opens.' } },
  { key: 'island', label: 'Dynamic Island · compact + expanded',
    caption: { kicker: 'While you use other apps', title: 'A tiny window into the story', body: 'Compact shows how far is left. It opens up for a moment when the story moves on. Tap the island to open or close it.' },
    androidCaption: { kicker: 'While you use other apps', title: 'A chip in the status bar', body: 'Android shows a small chip with the distance. Tap it to pull down the full Live Update.' } },
  { key: 'widgets', label: 'Home widgets · story in progress',
    caption: { kicker: 'Home screen', title: 'Your next walk, waiting kindly', body: 'Small, medium and large widgets show the walk you planned, the gems glowing near you and a little map.' } },
  { key: 'quiet', label: 'Home widgets · nothing planned',
    caption: { kicker: 'Home screen, quiet week', title: 'No plan? That is fine', body: 'The world keeps glowing, with no counts and no nudging. One gentle Pick a Walk when you feel like it.' } },
  { key: 'watch', label: 'Watch glance',
    caption: { kicker: 'On your wrist', title: 'A glance, a tap, eyes up', body: 'Distance and the next line of story. A soft tap on the wrist when the story moves, a happy one when you arrive.' } },
];

export const STORY = {
  title: 'The Summons',
  app: 'Story City',
  // One leg per chapter. Distance in metres; steps = metres / 0.75.
  legs: [
    { chapter: 'Ch. 2', name: 'A Mysterious Figure', to: 'the street corner', place: 'Street corner', metres: 180,
      lines: [
        'A hooded figure waits on the street corner, tapping at their phone…',
        'They glance up from the screen. Did they just nod at you?',
        'The hooded figure turned left at the corner…',
        'Something pale flutters down onto the pavement.',
      ],
      opens: 'The Mysterious Letter',
      preview: 'As you reach the corner, the figure drops something and dashes around to the next street. A letter, sealed with wax…' },
    { chapter: 'Ch. 3', name: 'The Mysterious Letter', to: 'the streetlight', place: 'Streetlight', metres: 150,
      lines: [
        'The wax seal is warm in your hand. The same symbol as the hoodie.',
        '“Take a picture with me. Then deliver me.”',
        'The streetlight ahead flickers once, as if it knows.',
        'A six-digit number glints in the wax…',
      ],
      opens: 'The Picture',
      preview: 'Under the streetlight the cursive seems to shimmer. You take the picture, just as the letter asked…' },
    { chapter: 'Ch. 4', name: 'The Mailbox', to: 'the mailbox', place: 'Mailbox', metres: 210,
      lines: [
        'Somewhere close, a mailbox is waiting for this letter.',
        'Your phone buzzes: “Deliver the letter, enter its code.”',
        'The street goes very quiet. Even the wind holds still.',
        'The mailbox slot glows a faint blue…',
      ],
      opens: 'Welcome to the Society',
      preview: 'A keypad lights up on the mailbox. The ground hums beneath your feet…' },
  ],
  toGo: 'to go',
  stepsToGo: n => `${n} steps to go`,
  metresTo: (m, to) => `${m} m to ${to}`,
  paused: 'Paused · pick up whenever',
  ready: 'Ready when you are',
  unlocked: 'Chapter unlocked — tap to read',
  unlockedShort: 'Unlocked',
  arrivedAt: place => `You made it to the ${place.toLowerCase()}`,
  readNow: 'Read Now',
  readOnPhone: 'Read on your phone',
  close: 'Close',
  opening: 'Opening Story City',
};

export const LOCK = {
  time: '7:42',
  date: 'Thursday, October 30',
  androidDate: 'Thu, Oct 30',
  liveLabel: 'Story City · The Summons',
  androidApp: 'Story City',
  androidWhen: 'now',
};

export const ISLAND = {
  hint: 'Tap the island',
  androidHint: 'Tap the chip',
  shadeTitle: 'Notifications',
};

export const GEMS = {
  // Gem types: Nature=Emerald, Art=Turquoise, Landmarks=Amber, Eat & Shop=Ruby, Curiosities=Amethyst
  nearby: [
    { type: 'art', label: 'Art', name: 'Painted alley mural', dist: '120 m' },
    { type: 'eat', label: 'Eat & Shop', name: 'Corner bakery', dist: '210 m' },
    { type: 'landmark', label: 'Landmarks', name: 'Old fire hall', dist: '340 m' },
  ],
  quiet: [
    { type: 'nature', label: 'Nature', name: 'Pocket garden', dist: '90 m' },
    { type: 'curio', label: 'Curiosities', name: 'Tiny door in a wall', dist: '260 m' },
    { type: 'art', label: 'Art', name: 'Painted alley mural', dist: '120 m' },
  ],
};

export const WIDGETS = {
  next: 'Next walk',
  when: 'Tomorrow 8 am',
  what: 'The Summons · ch. 3',
  whatLong: 'The Summons · Ch. 3, The Mysterious Letter',
  where: 'Starts at the streetlight · 150 m',
  chapters: '2 of 4 chapters read',
  gemsNear: n => `${n} gems glowing nearby`,
  gemsShort: n => `${n} gems nearby`,
  badges: 'Your badges',
  badgeList: [
    { icon: '✉️', name: 'Letter Keeper' },
    { icon: '🌙', name: 'Night Walker' },
    { icon: '🗝️', name: 'First Secret' },
  ],
  storyLine: 'The letter is still warm in your pocket.',
  open: 'Open Story',
  // nothing planned: gentle, never guilt
  quietKicker: 'Near you',
  quietTitle: 'The streets are glowing',
  quietBody: 'Whenever you feel like a wander, a story is ready.',
  quietSmall: 'A wander, whenever',
  pick: 'Pick a Walk',
  quietLine: 'Someone left a tiny door painted on a wall nearby.',
  idea: 'Short one to try',
  ideaWhat: 'The Summons · 15 min',
  tapToast: {
    open: 'This would open Story City on chapter 3.',
    pick: 'This would open the story chooser. No plan needed.',
    gem: 'This would open the map on this gem.',
  },
};

export const WATCH = {
  time: '7:42',
  arrived: 'Unlocked',
  tapHint: 'Tap on your wrist when the story moves',
};

// App icons on the pretend home screen (generic emoji tiles, no real app art).
export const APPS = [
  ['📷', 'Camera'], ['🗓️', 'Calendar'], ['☀️', 'Weather'], ['🎵', 'Music'],
  ['💬', 'Messages'], ['📝', 'Notes'], ['🗺️', 'Maps'], ['⏰', 'Clock'],
  ['📚', 'Books'], ['🧮', 'Calculator'], ['🎧', 'Podcasts'], ['⚙️', 'Settings'],
];
export const DOCK = [['📞', 'Phone'], ['🌐', 'Browser'], ['✨', 'Story City'], ['🖼️', 'Photos']];
