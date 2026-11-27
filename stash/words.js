// Every word on screen. Edit lines here.
export const VERSIONS = {
  a: { label: 'A', name: 'Combined', note: 'A · Combined: the whole gem hub lives in the Stash, nearby gems included. + Gem only takes the photo.' },
  b: { label: 'B', name: 'Separate ✓', note: 'B · Separate (chosen Nov 26): Gems keep their own tab, Victoria’s Gem Hub. The Stash links over to it.' },
  c: { label: 'C', name: 'Split', note: 'C · Split by job: + Gem takes the photo, your gems live in the Stash, other people’s gems live on the Map.' },
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
