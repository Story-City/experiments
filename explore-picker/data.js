// All copy for the explore picker lives here. Each line is a one-line edit.

export const COPY = {
  pageTitle: 'Explore picker · 12 ways to pick',
  stepLabel: 'Step 2 of 3',
  title: 'How do you like to explore?',
  sub: 'Pick all that apply. Each pick changes what you see next.',
  skip: 'Skip',
  continue: 'Continue',
  continueHint: 'Pick one or more to continue',
  unlockKicker: 'Your picks',
  unlockTitle: "Here's what your picks unlocked",
  unlockSub: 'Ready for your first walk tomorrow.',
  defaultKicker: 'Explore',
  defaultTitle: "Here's your Explore",
  defaultSub: 'A bit of everything. Tune it any time in Settings.',
  start: 'Start exploring',
  change: 'Change my picks',
  startToast: 'Mockup ends here. Tap Change my picks to try again.',
  noteToggle: 'Why',
};

// id · label (full option) · short (tiny spaces) · emoji · color · unlock + note (shown after Continue)
// scene (map tile C) · item (bag E) · ingredient (potion K) · titleWord + titleRank (explorer card L) · bookerton (chat I)
export const OPTIONS = [
  { id: 'stories',   label: 'Turn my walks into stories',  short: 'Story walks',    emoji: '📖', color: '#b36bff', scene: '🏛️', item: '📖', ingredient: '🖋️', titleWord: 'Story-chasing', titleRank: 1,
    unlock: 'Story picks on Today',                       note: 'Three stories that start near you, saved for tomorrow.',
    bookerton: 'A story walker! I have a shelf of those for you.' },
  { id: 'gems',      label: 'Find hidden gems near me',     short: 'Hidden gems',    emoji: '💎', color: '#33c7d1', scene: '⛲', item: '💎', ingredient: '💎', titleWord: 'Gem-hunting', titleRank: 2,
    unlock: 'Add a favourite place as your first gem',    note: 'A café, a bench, a mural. Pin it now, find more tomorrow.',
    bookerton: 'Ooh, a gem hunter. The best spots hide in plain sight.' },
  { id: 'steps',     label: 'Hit a step goal',              short: 'Step goal',      emoji: '👟', color: '#00cd9d', scene: '🌳', item: '👟', ingredient: '🍃', titleWord: 'Step-counting', titleRank: 3,
    unlock: 'Set your step goal',                         note: 'Pick a number. Every story walk counts toward it.',
    bookerton: 'Steps it is. Every chapter counts toward your goal.' },
  { id: 'fog',       label: 'Clear the fog on my map',      short: 'Clear fog',      emoji: '🌁', color: '#c49bff', scene: '🏘️', item: '🔦', ingredient: '☁️', titleWord: 'Fog-clearing', titleRank: 0,
    unlock: 'Your map fogs, your spot clears',            note: 'Walk anywhere and the mist lifts behind you.',
    bookerton: 'A fog clearer. Your map starts misty, then you light it up.' },
  { id: 'daily',     label: 'A tiny daily adventure',       short: 'Tiny adventure', emoji: '☀️', color: '#ffc861', scene: '🎈', item: '🎈', ingredient: '🌼', titleWord: 'Everyday', titleRank: 4,
    unlock: "Today's Whimsy Walk",                        note: 'Ten minutes, one small surprise, a new one each day.',
    bookerton: 'Tiny daily adventures are my favourite kind.' },
  { id: 'together',  label: 'Walk with friends or family',  short: 'Together',       emoji: '👫', color: '#ff8fb1', scene: '🧺', item: '🧃', ingredient: '🍓', titleWord: 'Friendly', titleRank: 5,
    unlock: 'Walk together',                              note: 'Invite someone and play the same story side by side.',
    bookerton: 'Better with company. I will save you a two-player story.' },
  { id: 'city',      label: 'Explore a new city',           short: 'New city',       emoji: '🧭', color: '#7aa2ff', scene: '🗼', item: '🧭', ingredient: '🗺️', titleWord: 'Globetrotting', titleRank: 2,
    unlock: 'Passport stories',                           note: 'Stories that travel with you, stamped in every city.',
    bookerton: 'A traveller! Your passport is ready for its first stamp.' },
  { id: 'treadmill', label: 'Walk indoors on a treadmill',  short: 'Treadmill',      emoji: '🏃', color: '#5ee0c2', scene: '🏠', item: '🎧', ingredient: '⚙️', titleWord: 'Indoor', titleRank: 6,
    unlock: 'Treadmill mode',                             note: 'Stories that move with your steps, no map needed.',
    bookerton: 'Rainy day walker, noted. Stories work indoors too.' },
  { id: 'puzzles',   label: 'Solve puzzles',                short: 'Puzzles',        emoji: '🧩', color: '#ff9f6b', scene: '🔐', item: '🧩', ingredient: '🔮', titleWord: 'Puzzle', titleRank: 7,
    unlock: 'Puzzle-heavy stories first',                 note: 'Codes, riddles and Mini Missions at the top of your list.',
    bookerton: 'A puzzler. I will put the trickiest Mini Missions first.' },
];

// Shown when the player taps Skip: a plain default Explore.
export const DEFAULT_EXPLORE = [
  { emoji: '📚', title: 'Stories near you',  note: 'The most played stories within a short walk.' },
  { emoji: '🗺️', title: 'Your map in Steps mode', note: 'Switch to Path or Hunt any time.' },
  { emoji: '⚡', title: 'Mini Missions',     note: 'Quick challenges for a spare ten minutes.' },
];

// Bookerton (version I)
export const BOOKERTON = {
  name: 'Bookerton',
  intro1: "Hi, I'm Bookerton. I'll tune your stories before your first walk.",
  intro2: 'How do you like to explore? Tap every one that fits.',
  removed: 'No problem, crossed that one off.',
  empty: 'Take your time. Tap as many as you like.',
  many: 'You like a bit of everything. My kind of walker.',
};

// Explorer card (version L)
export const EXPLORER = {
  cardLabel: 'Explorer card',
  name: 'You',
  emptyTitle: 'Curious Walker',
  nounFew: 'Walker',      // 1–2 picks
  nounSome: 'Explorer',   // 3–4 picks
  nounMany: 'Legend',     // 5+ picks
  meta: 'Level 1 · Joined today',
  addLabel: 'Add to your card',
  emptyBadges: 'Badges appear as you pick',
};

// The 12 versions of the picking mechanic. hint = one line inside the phone; why / risk = the note under the switcher.
export const VERSIONS = [
  { key: 'a', name: 'Card shuffle',      hint: 'Tap a card to flick it onto your pile.',
    why: 'Physical, tactile and quick; the pile makes choices feel owned.', risk: 'Nine text cards is a lot to read on a couch.' },
  { key: 'b', name: 'Gems light up',     hint: 'Tap a gem to light it up.',
    why: 'Ties straight into gem pins, so it teaches the world.', risk: 'Glowing gems may read as rewards, not preferences.' },
  { key: 'c', name: 'Map tiles unfog',   hint: 'Tap a tile to clear its fog.',
    why: 'Previews fog clearing on the map before the first walk.', risk: 'Players may think unpicked tiles stay locked.' },
  { key: 'd', name: 'Constellation',     hint: 'Tap stars to light them and join them up.',
    why: 'Feels like making something personal and mysterious.', risk: 'Short star labels can hide what each pick means.' },
  { key: 'e', name: 'Pack your bag',     hint: 'Tap things to pack them for tomorrow.',
    why: 'Packing a bag says tomorrow is a trip worth taking.', risk: 'The objects need their labels to make sense.' },
  { key: 'f', name: 'Swipe deck',        hint: 'Swipe right or tap Yes. Left for not for me.',
    why: 'Familiar, one decision at a time, fast to finish.', risk: 'Nine cards in a row can feel like a survey.' },
  { key: 'g', name: 'Bubbles',           hint: 'Tap the bubbles that sound like you.',
    why: 'Known from music apps, playful and scannable at once.', risk: 'Short bubble labels lose nuance.' },
  { key: 'h', name: 'Trail of lanterns', hint: 'Light lanterns along the trail to tomorrow.',
    why: 'Every pick moves you toward tomorrow’s walk, literally.', risk: 'A long trail needs scrolling on small phones.' },
  { key: 'i', name: 'Bookerton chat',    hint: '',
    why: 'Meets Bookerton early and feels like a conversation.', risk: 'Chat can feel slow if the reactions lag.' },
  { key: 'j', name: 'Passport stamps',   hint: 'Tap a page to stamp it.',
    why: 'Stamping feels satisfying and links to Passport stories.', risk: 'Passport may suggest travel only.' },
  { key: 'k', name: 'Potion brew',       hint: 'Drop ingredients in to brew your mix.',
    why: 'The changing brew colour makes every pick visible.', risk: 'Whimsy may hide the practical choices.' },
  { key: 'l', name: 'Explorer card',     hint: 'Tap to add badges to your card.',
    why: 'An identity reveal people want to screenshot and share.', risk: 'Funny titles can misfire on odd combos.' },
];
