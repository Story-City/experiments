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

// Home map: your own map from the home screen, no story running (Melissa's lean, Oct 30)
export const HOME = {
  chip: 'Your map',
  title: 'Your neighbourhood',
  week: (walks, gems) => `This week: ${walks} walks · ${gems} gem${gems === 1 ? '' : 's'} found`,
  hint: 'The fog is thinnest by Maple Park. Something amber is glowing there.',
  nearLabel: 'Stories near you',
  wander: '▶ Go for a Wander',
  pause: 'Pause',
  keep: '▶ Keep Wandering',
  wanderToast: 'Wander anywhere. The fog lifts wherever you go.',
  gemFound: 'You found a gem the fog was hiding ✨',
  storyFound: (name) => `A story was hiding under the fog: ${name} 📖`,
  start: 'Start Story',
  starting: (name) => `(${name} opens here)`,
  close: 'Not Now',
  history: 'Earlier this week',
};

// Stories on the home map: real Story City stories (Edmonton catalogue, public API, Oct 29).
// `hidden: true` = only appears once the fog is cleared there.
export const STORIES = [
  { id: 'summons', at: [195, 300], name: 'The Summons', meta: 'Sample story · 10 min', blurb: 'A text from an unknown number: look out your window.', hidden: false },
  { id: 'dragons', at: [120, 470], name: 'Dragons in the Park Scavenger Hunt', meta: 'Adventure · 50 min', blurb: 'Find the dragons living in the park.', hidden: false },
  { id: 'coal', at: [120, 200], name: 'Coal Call', meta: 'Local history · 45 min', blurb: 'A ghost hijacks your phone. Can you help them unearth buried riches?', hidden: false },
  { id: 'powerplay', at: [296, 300], name: 'Power Play', meta: 'Mystery · 50 min', blurb: 'A hockey star has been murdered. Travel through time to find out who did it.', hidden: true },
  { id: 'cloudships', at: [90, 120], name: 'Coming of the Cloudships', meta: 'Sci-fi · 45 min', blurb: 'You’re an undercover alien saviour deciding humanity’s fate.', hidden: true },
];
