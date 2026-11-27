// Every word on screen. Edit lines here.
export const VERSIONS = {
  a: { label: 'A', name: 'Combined', note: 'A · Combined: the whole gem hub lives in the Stash, nearby gems included. + Gem only takes the photo.' },
  b: { label: 'B', name: 'Separate ✓', note: 'B · Separate (chosen Nov 26): Gems keep their own tab, Victoria’s Gem Hub. The Stash links over to it.' },
  c: { label: 'C', name: 'Split', note: 'C · Split by job: + Gem takes the photo, your gems live in the Stash, other people’s gems live on the Map.' },
  d: { label: 'D', name: 'You', note: 'D · You, organized (proposal): builds on B. The tab says You, the page is Priya’s Stash, and your walks, finds and stories each get a picture, not just a number.' },
  notes: { label: 'Notes', name: '', note: 'Names, what lives here today, what we want, and A vs B vs C.' },
  research: { label: 'Research', name: '', note: 'How other apps do it, and the rules a profile has to follow.' },
};

export const PLAYER = { name: 'Priya', status: 'Member', week: '3 walks · 2 chapters · 1 new gem this week' };

export const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'map', label: 'Map' },
  { id: 'gem', label: 'Gem' },
  { id: 'library', label: 'Library' },
  { id: 'stash', label: 'Stash' },
];
export const GEMS_TAB = 'Gems';

export const COMPARTMENTS = [
  { id: 'gems', title: 'Gems', sub: '12 kept · 3 to sort', accent: 'var(--emerald)' },
  { id: 'stories', title: 'My Stories', sub: '2 in progress · 4 wished', accent: 'var(--sapphire)' },
  { id: 'badges', title: 'Badges & Stamps', sub: '7 of 20 earned', accent: 'var(--citrine)' },
  { id: 'steps', title: 'Steps', sub: '18,240 this week', accent: 'var(--glow)' },
  { id: 'friends', title: 'Friends', sub: '3 friends · Jess asked', accent: 'var(--ruby)' },
  { id: 'journal', title: 'Walk Journal', sub: '23 walks since July', accent: 'var(--mist)' },
];

export const ROWS = [
  { id: 'settings', title: 'Settings', sub: 'Membership, account, step goal, language' },
  { id: 'reminders', title: 'Reminders', sub: 'Day before my next story' },
  { id: 'coupons', title: 'My Coupons', sub: '1 ready to spend' },
  { id: 'help', title: 'Help & Feedback', sub: 'Ask us, or tell Bookerton an idea' },
];

export const GEM_TYPES = [
  { id: 'nature', label: 'Nature', n: 4 },
  { id: 'art', label: 'Art', n: 2 },
  { id: 'landmarks', label: 'Landmarks', n: 3 },
  { id: 'eat-drink', label: 'Eat & Shop', n: 2 },
  { id: 'curiosities', label: 'Curiosities', n: 1 },
];

export const FINDS = [
  { img: 'find-a.jpg', title: 'TV wall on 124 St', where: 'Whimsy Walk · near you' },
  { img: 'find-b.jpg', title: 'Old clock on Jasper', where: 'The Summons · chapter 3' },
  { img: 'find-c.jpg', title: 'Mural by the bakery', where: 'Dragons in the Park' },
];

export const GEMS = {
  public: [
    { img: 'find-d.jpg', title: 'Heron at the pond', type: 'nature', likes: 12 },
    { img: 'find-c.jpg', title: 'Mural behind the bakery', type: 'art', likes: 4 },
    { img: 'find-b.jpg', title: 'The old clock', type: 'landmarks', likes: 7 },
    { img: 'find-a.jpg', title: 'Best samosas', type: 'eat-drink', likes: 2 },
  ],
  hidden: [
    { img: 'find-c.jpg', title: 'My bench', type: 'nature', likes: 0 },
    { img: 'find-d.jpg', title: 'Secret stairs', type: 'curiosities', likes: 0 },
  ],
  liked: [
    { img: 'find-b.jpg', title: 'Ama’s heron', type: 'nature', likes: 31, by: 'Ama K.' },
    { img: 'find-a.jpg', title: 'Tiny door', type: 'curiosities', likes: 9, by: 'Jess' },
  ],
  nearby: [
    { img: 'find-d.jpg', title: 'Fountain lights', type: 'landmarks', likes: 18, by: '3 min away' },
    { img: 'find-c.jpg', title: 'Little free library', type: 'curiosities', likes: 6, by: '6 min away' },
  ],
};

export const NEARBY_PINS = [
  { type: 'landmarks', x: 62, y: 30 }, { type: 'curiosities', x: 30, y: 58 }, { type: 'nature', x: 74, y: 70 },
  { type: 'art', x: 46, y: 18 }, { type: 'eat-drink', x: 18, y: 32 },
];

export const STORIES = {
  progress: [
    { img: 'incident.jpg', title: 'Tales from the Incident', line: 'Episode 2 · chapter 3 of 6' },
    { img: 'coronet.jpg', title: 'The Coronet Caper', line: 'Chapter 5 of 9' },
  ],
  wish: [
    { img: 'alice.jpg', title: 'Alice Through the Tear' },
    { img: 'dragons.jpg', title: 'Dragons in the Park' },
  ],
  finished: [
    { img: 'frightnight.jpg', title: 'Frightnight', line: 'Endings found 1 of 3' },
  ],
};

export const BADGES = [
  { t: 'First Steps', got: true, c: 'var(--emerald)' },
  { t: 'Look Out Your Window', got: true, c: 'var(--sapphire)' },
  { t: 'Fright Night', got: true, c: 'var(--ruby)' },
  { t: 'First Gem', got: true, c: 'var(--emerald)' },
  { t: '5 Gems Kept', got: true, c: 'var(--citrine)' },
  { t: 'Night Walker', got: true, c: 'var(--glow)' },
  { t: 'Found 2 Endings', got: true, c: 'var(--sapphire)' },
  { t: '3 Friends', got: false, c: 'var(--ruby)', how: 'Add 3 friends' },
  { t: 'Ten Chapters', got: false, c: 'var(--citrine)', how: 'Finish 10 chapters' },
];
export const STAMPS = [
  { city: 'Edmonton', got: true }, { city: 'Calgary', got: true }, { city: 'Melbourne', got: false }, { city: 'Atlanta', got: false },
];

export const STEPS = { week: '18,240', days: [3100, 5200, 900, 0, 4400, 2240, 2400], story: '7,900', everyday: '10,340', goal: 2500 };

export const FRIENDS = {
  code: 'PRIYA-2204',
  list: [
    { name: 'Ama K.', line: 'Walked The Summons yesterday' },
    { name: 'Jess', line: 'Asked to be friends', ask: true },
    { name: 'Dev', line: 'Cheered your heron' },
  ],
};

export const JOURNAL = [
  { day: 'Tue Nov 24', line: '2,240 steps · Coronet Caper chapter 5 · kept 1 gem' },
  { day: 'Mon Nov 23', line: '4,400 steps · Whimsy Walk to the river' },
  { day: 'Sat Nov 21', line: '5,200 steps · Finished Frightnight (ending 1 of 3) · Fright Night badge' },
];

export const SETTINGS = [
  ['Membership', 'Member · renews Dec 12 · Manage'],
  ['Account', 'Email, password, edit profile, delete account'],
  ['Daily step goal', '2,500 steps'],
  ['How I play', 'Undo “Remember my choice”'],
  ['Notifications', 'Reminders, friend news'],
  ['Privacy', 'Who sees my gems and walks'],
  ['Distance unit', 'Automatic'],
  ['App language', 'English'],
  ['Audio', 'Autoplay, adventure music'],
  ['Text size and motion', 'Bigger text, reduce motion'],
  ['Restore purchases', ''],
  ['Privacy policy and terms', ''],
  ['Sign out', ''],
];

// Version D: the You tab, organized, with data displays
export const YOU = {
  tab: 'You',
  since: 'Walking with Story City since July',
  friendsChip: '3 friends',
  headline: [['142', 'km walked'], ['23', 'walks'], ['47', 'chapters'], ['12', 'gems']],
  subs: [['walks', 'Walks'], ['finds', 'Finds'], ['stories', 'Stories']],
  patch: { t: 'Your patch', pct: 38, line: '38% of your neighbourhood uncovered', sub: 'Your home stays blurred. Tap to open the map.' },
  trail: {
    t: 'How far you’ve walked',
    km: 142,
    line: '142 km. That’s walking from Edmonton almost to Red Deer.',
    stops: [['Edmonton', 0], ['Leduc', 33], ['Wetaskiwin', 70], ['Ponoka', 103], ['Lacombe', 126], ['Red Deer', 150]],
    kid: 'Or 1,580 hockey rinks end to end.',
  },
  sky: { t: 'Your walking sky', right: '23 walks', sub: 'Every walk lights a star, and bigger walks shine brighter. Red rings are story endings you found.', walks: 23, endings: [[212, 30]] },
  week: { t: 'This week', story: 'in stories', everyday: 'everyday' },
  clock: { t: 'When you walk', line: 'You’re a dusk walker', sub: 'Most of your steps happen between 5 and 8 pm.', hours: [0,0,0,0,0,0,1,3,4,2,1,2,3,2,1,2,4,9,12,10,5,2,1,0] },
  gemWheel: { club: 'You’re a Nature Seeker 🌿', t: 'Your gems', made: 'made', visited: 'visited', liked: 'liked', link: 'Open the Gem Hub' },
  gemRings: { nature: [4, 3, 11], art: [2, 3, 6], landmarks: [3, 2, 4], 'eat-drink': [2, 1, 7], curiosities: [1, 0, 3] },
  ripples: {
    t: 'Gems you shared',
    sub: 'Just yours to see. No rankings.',
    list: [
      { type: 'nature', title: 'Heron at the pond', n: 34, line: 'has welcomed 34 explorers' },
      { type: 'art', title: 'Mural behind the bakery', n: 9, line: 'has welcomed 9 explorers' },
    ],
  },
  postcards: { t: 'Postcards', sub: 'The shape of each walk. Your start and end are trimmed.' },
  routes: [
    { name: 'Whimsy Walk to the river', d: 'M8 40 C14 20 30 18 34 30 S50 44 56 20' },
    { name: 'Coronet Caper ch. 5', d: 'M10 14 L24 14 L24 34 L44 34 L44 18 L56 18' },
    { name: 'Frightnight', d: 'M8 30 C8 10 30 6 34 22 C38 38 56 38 56 16' },
    { name: 'Morning loop', d: 'M32 8 C52 8 56 40 32 42 C10 42 10 10 30 10' },
  ],
  badgesT: 'Badges & stamps', badgesSub: '7 of 20 · newest first',
  storiesT: 'Your stories',
  shelf: [
    { title: 'Tales from the Incident', img: 'incident.jpg', ch: [3, 6], endings: null, tag: 'Continue' },
    { title: 'The Coronet Caper', img: 'coronet.jpg', ch: [5, 9], endings: null, tag: 'Continue' },
    { title: 'Frightnight', img: 'frightnight.jpg', ch: [7, 7], endings: [1, 3], tag: 'Finished' },
  ],
  pathT: 'Your path through Frightnight',
  pathSub: 'You found ending 1 of 3. Two more are still out there.',
  rows: [
    ['journal', 'Walk Journal', 'Every walk, day by day'],
    ['year', 'Your Story City year', 'Opens Dec 20'],
    ['settings', 'Settings', 'Membership, account, privacy, step goal'],
    ['help', 'Help & Feedback', 'Ask us, or tell Bookerton an idea'],
  ],
  year: [
    { big: '142 km', line: 'You walked almost to Red Deer.' },
    { big: 'Dusk', line: 'Your favourite time to walk. The ghosts noticed.' },
    { big: 'Nature', line: 'Your top gem type. 4 kept, 11 liked.' },
    { big: '38%', line: 'of your neighbourhood out of the fog.' },
    { big: '1 of 3', line: 'Frightnight endings found. Going back for the others?' },
  ],
  yearT: 'Your Story City year', yearSub: 'A preview. Tap to flip through. Share any card.',
};
