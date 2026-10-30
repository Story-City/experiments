// Every line of text in the fog mode mockup. Edit here; one line = one change.

export const MODES = {
  walk: { label: 'Walk', chip: 'Walk to unlock' },
  pin: { label: 'Pin', chip: 'Pin nearby' },
  hunt: { label: 'Hunt', chip: 'Scavenger hunt' },
};

export const COPY = {
  intro: {
    kicker: 'Experiment · Fog mode',
    title: 'Your neighbourhood is under the fog',
    body: 'Every walk clears a little more of your map. The parts you have walked stay clear, so your map slowly becomes yours.',
    look: 'Fog',
    start: 'Open the map',
  },
  // Opening: fog as the location ask (FTUE Cowork, Oct 23)
  ask: {
    from: 'Story City',
    lines: ['Your map is under the fog.', 'Turn on location and it lifts around you. Then every walk clears a little more.'],
    reply: 'Show me',
    osTitle: 'Allow “Story City” to use your location?',
    osBody: 'Your map clears where you walk. Where you have walked stays on this phone.',
    allow: 'Allow While Using App',
    deny: 'Not Now',
    allowed: 'There you are.',
    denied: 'No problem. Play from home: indoor steps still count, and the fog lifts where the story is headed.',
  },
  storyName: 'The Summons',
  days: [
    {
      chapter: 'Chapter 2',
      next: 'the old clock tower',
      huntFind: 'the tallest tree nearby',
    },
    {
      chapter: 'Chapter 3',
      next: 'the glint by Maple Park',
      huntFind: 'something shiny',
    },
  ],
  uncovered: (pct) => `${pct}% uncovered`,
  hint: {
    walk: 'The fog lifts wherever you walk. Your steps always count.',
    indoor: 'Steps from home count. Fog only lifts round the story, not round you.',
  },
  walkBtn: { start: '▶ Pretend to walk', keep: '▶ Keep walking', pause: 'Pause' },
  indoorBtn: 'Walking indoors?',
  indoorOn: 'Indoor steps count. The fog lifts around the clock tower while you walk.',
  indoorStatus: (left) => `<b>${left} indoor steps</b> to unlock. The fog is lifting where you're headed.`,
  switchToast: (n) => `You've walked ${n} steps. They still count.`,
  gemFound: 'You found a gem the fog was hiding ✨',
  storyFound: 'A story was hiding under the fog 📖',
  glint: 'Something is glinting in the fog…',
  unlocked: 'Chapter unlocked',
  unlockedToday: (pct) => `You cleared <b>${pct}%</b> of your map today.`,
  read: 'Read the chapter',
  tomorrow: 'Next day ›',
  dayTwo: {
    kicker: 'The next day',
    title: 'Welcome back',
    body: (pct) => `Yesterday you cleared ${pct}% of your map, and it's still clear. Something is glinting at the edge of the fog.`,
    start: 'Go look',
  },
  end: {
    kicker: 'Your map so far',
    title: (pct) => `${pct}% of your neighbourhood uncovered`,
    body: 'Two walks, two gems. The fog is thinnest to the east. Want a reminder for your next walk?',
    remind: 'Remind me tomorrow',
    again: 'Start over',
  },
  pinTitle: (name, steps) => `${name} · ${steps} steps away`,
  pinStatus: (name, steps) => `<b>${name}</b>, ${steps} steps away. The route cuts through the fog.`,
  huntStatus: (find) => `Find <b>${find}</b>. Wander a little and the fog lifts as you search.`,
  walkStatus: (left) => `<b>${left} steps</b> to unlock`,
};
