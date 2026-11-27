// Core: state, team options, router, sheets, toasts and shared drawing helpers.
// Screens register themselves with reg(); sheets with regSheet(). app.js boots everything.
import { STORIES, byId } from './stories.js';
import { APP, SOLVES, GEMS, CARD, WEATHER, WALKMAP, LOOPS } from './words.js';

// ---------------------------------------------------------------- team options
// Every open question from reports/everyday-app/01-decisions.md, as a switch.
// [value, label, source]. The first choice is the default unless def says otherwise.
export const OPTIONS = [
  { id: 'tabs', label: 'Bottom tabs', q: 'Q1 / C8', choices: [
    ['nov26', 'Today · Stories · Create · Gems · You', 'Brett chat, Nov 26 (Feed, Stories, Gems, You + one-tap camera); gems keep their own tab — Decision Log, Nov 26'],
    ['five', 'Today · Map · Library · Feed · You', 'Builder’s default: Today feed (Melissa + Victoria, Nov 2) + personal area (Brett, Oct 8)'],
    ['real', 'Home · Feed · Library, Profile drawer', 'What 4.28.0 ships (MainNavigator.tsx, Nov 4)'],
    ['library', 'Library only', 'Brett + Melissa, Oct 8; logged Oct 14'],
    ['sgw', 'Stories · Gems · Whimsy Walks', 'Melissa, design review Oct 7'],
    ['maphome', 'Map as home · Library · You', 'Brett, Nov 3 (“people are just always in it”)'],
    ['go', 'Feed · Library · Go · Map · You', 'day-two and after-ftue mockups (Oct 30 – Nov 2)'],
  ] },
  { id: 'treadLook', label: 'Treadmill mode', q: 'SC-3737', choices: [
    ['dock', 'Walk map dock: tips, treadmill switch, speed sheet, walking figure', 'UX doc “Treadmill mode — walk map dock”, approved by Melissa, Nov 26'],
    ['screen', 'Its own screen with a belt-speed switch and chase scene', 'Everyday build, Nov 4–5'],
  ] },
  { id: 'firstTab', label: 'First tab name', q: 'NSC-2137', choices: [
    ['today', 'Today', 'Melissa, Nov 26: Today can show the weather and, later, your day (NSC-2137)'],
    ['feed', 'Feed', 'Brett chat, Nov 26 (Feed, Stories, Gems, You)'],
  ] },
  { id: 'youLayout', label: 'You tab layout', q: 'Stash', choices: [
    ['galleries', 'Three swipeable galleries: Progress · Collections · History', 'Melissa, Nov 26 (The Stash, version E)'],
    ['tabs', 'Steps · Stories · Stamps switch', 'Melissa, Nov 4'],
  ] },
  { id: 'gemPins', label: 'Gem pins on the map', q: 'gem-pins V3', choices: [
    ['v3', 'V3: category gem art, private gems as a glowing outline', 'gem-pins V3 (Melissa, Nov 26); hollow outline for private — NSC-2123 lead option'],
    ['flat', 'Flat gem shapes with a ring', 'Everyday build, Nov 4'],
  ] },
  { id: 'snapFlow', label: 'After the Create camera', q: 'Gem flow', choices: [
    ['pile', 'Send It drops the photo in the pile to sort later', 'Location gems app flow (NSC-1116): snapshot pile, then sort; one-tap camera — Brett, Nov 26'],
    ['details', 'Straight to name, type and who can see it', 'Everyday build, Nov 4'],
  ] },
  { id: 'sortLayout', label: 'Sorting gems', q: 'location-gems V3', choices: [
    ['right', 'Drag right onto Publish · Keep hidden · Delete', 'location-gems V3 (Melissa, Nov 26–27)'],
    ['buttons', 'Three buttons under the photo', 'Builder’s add: for tapping through'],
  ] },
  { id: 'calendar', label: 'Today: your day from the calendar', q: 'NSC-2137', choices: [
    ['preview', 'Show the opt-in “free window” card (later feature)', 'Melissa, Nov 26 (NSC-2137)'],
    ['off', 'Off', '—'],
  ] },
  { id: 'modeLock', label: 'Map modes during a story', q: 'Q2 / C1', choices: [
    ['switch', 'Switch any time', 'Melissa, Oct 14 (Decision Log, current rule)'],
    ['start', 'Chosen at Start, held for the playthrough', 'Golden Path room, Oct 30'],
    ['route', 'Curated routes lock; Steps and Hunt stay switchable', 'Dev, Oct 30'],
  ] },
  { id: 'startAsk', label: 'What Start asks first', q: 'Q3', choices: [
    ['four', 'Every way shown, the smart pick pre-selected with its reason (no Customize)', 'Melissa, Nov 5: “always needs to come up, not hidden behind Customize”; Golden Path, Oct 30 (four options)'],
    ['smart', 'Smart default + Customize', 'Emily, Melissa agreed, Nov 3'],
    ['time', '“How long do you have?” first', 'Melissa, Nov 3'],
  ] },
  { id: 'modeNames', label: 'Mode names', q: 'Q4 / C5', choices: [
    ['steps', 'Steps / Path / Hunt', 'Decided: Melissa, Nov 4 (Nov 3 poll favourite)'],
    ['location', 'Steps / Location / Hunt', 'Nov 3 poll (Path vs Location one vote apart)'],
  ] },
  { id: 'homeOpt', label: 'Treadmill and at home', q: 'Q6', choices: [
    ['two', 'Two options: Treadmill or Pad, From the Sofa', 'Oct 30 draft (four options)'],
    ['one', 'One option: At Home', 'Oct 30, inferred (“very same”)'],
  ] },
  { id: 'homePlay', label: 'Play at home (From the Sofa, At Home versions)', q: 'Golden Path Q24 (TTT)', choices: [
    ['off', 'Off: Story City is always a walk', 'Melissa, Nov 5: removed until the team decides'],
    ['on', 'On: sofa / at-home versions', 'Overnight mockup'],
  ] },
  { id: 'mapBase', label: 'Map: what the streets look like', q: 'Melissa, Nov 9: see the real in-app map with the mockup', choices: [
    ['real', 'A. Real app map (simulator screenshot, McCauley, Edmonton)', 'Melissa, Nov 9'],
    ['drawn', 'B. Drawn mockup map', 'Overnight mockup'],
  ] },
  { id: 'walkMapLook', label: 'In-story map screen', q: 'Melissa, Nov 9: copy what is live in the app', choices: [
    ['live', 'A. Live app (4.28.1)', 'Melissa, Nov 9 (WalkMapScreen + FtueMap on origin/main)'],
    ['mock', 'B. Old mockup design', 'Overnight mockup'],
  ] },
  { id: 'treadMap', label: 'Treadmill map', q: 'Q5', choices: [
    ['story', 'The story’s own streets', 'Melissa, Nov 2'],
    ['neighbourhood', 'Your neighbourhood, virtually', 'Victoria’s prototype, Nov 2'],
    ['fantasy', 'A storybook map', 'Melissa, Nov 2 (Tales from the Incident)'],
  ] },
  { id: 'length', label: 'Story length control', q: 'Q7', choices: [
    ['trail', 'Trail slider: stretch or shrink the walks between chapters', 'Melissa, Nov 4 (same slider as Help Me Pick)'],
    ['dial', 'Short Cut / As Written / Long Way Round', 'Anna, Oct 16; research idea 9'],
    ['minutes', 'Minutes: 15 / 30 / 45', 'Melissa, Oct 6; Brett listed it'],
    ['none', 'No control (as today)', 'release 4.28.0'],
  ] },
  { id: 'unit', label: 'Unit players see', q: 'Q8', choices: [
    ['steps', 'Steps', 'Melissa + Victoria, Oct 8 (“still called steps”)'],
    ['minutes', 'Minutes', 'Golden Path, Oct 16 debate'],
    ['distance', 'Distance', 'Golden Path, Oct 16 debate'],
  ] },
  { id: 'steps', label: 'Steps per walk (sample stories)', q: 'Q19 / C6', choices: [
    ['30', 'About 30 steps', 'Melissa + Victoria, Oct 8'],
    ['80', '80 steps (about 60 m)', 'Integration branch, standup Oct 15'],
  ] },
  { id: 'trial', label: 'Trial length', q: 'Q18 / C3', choices: [
    ['7', '7 days', 'CLAUDE.md, App Store, Halloween plan'],
    ['14', '14 days', 'Spoken Oct 29 and Oct 30'],
  ] },
  { id: 'trialWhen', label: 'When the trial moment shows', q: '§9', choices: [
    ['recs', 'After the character’s two picks', 'Brief order; Victoria’s celebration page, Oct 28'],
    ['library', 'Only behind See the Whole Library', 'SC-3874 build (story cards skip it)'],
  ] },
  { id: 'reask', label: 'When a guest is asked again to sign up', q: 'C2 · B5', choices: [
    ['inside', 'Once, inside the sample (in the FTUE, not shown here)', 'Nov 3 order: “asked again inside the sample story”'],
    ['after', 'Once, after the trial moment', 'Phase 2 build (tester B5: contradicts Nov 3)'],
    ['gem', 'At the first gem save, later', 'Design review, Oct 7'],
    ['never', 'Not again', '—'],
  ] },
  { id: 'pathReady', label: 'Path mode', q: 'C24 · B25', choices: [
    ['soon', 'Greyed “coming soon” (Local Originals and routes still use it)', 'CLAUDE.md, Oct 13: until single-pin placement is ready'],
    ['live', 'Live everywhere', 'Brett, Nov 3 (“start any story in path, step or hunt”)'],
  ] },
  { id: 'recPick', label: 'Second pick after the FTUE', q: 'B10 · for Melissa', choices: [
    ['auto', 'Alice by day, a Play Anywhere story after dark', 'Builder: keeps Oct 28 copy, obeys Oct 15 “must work anywhere”'],
    ['alice', 'Always Alice (“stopping a Wonderland invasion”)', 'Melissa, Oct 28 copy'],
    ['anywhere', 'Always a Play Anywhere story', 'Golden Path task, Oct 15'],
  ] },
  { id: 'family', label: 'Family line on prices', q: 'A9 · for Melissa', choices: [
    ['onephone', '“One membership covers the family on one phone”', 'Assumption: pricing not decided'],
    ['everyone', '“Covers everyone walking with you, up to 4 phones”', 'play-together mockup (assumption)'],
    ['hidden', 'Say nothing yet', 'Today’s app'],
  ] },
  { id: 'cadence', label: 'Daily cadence', q: 'Q9 / C11', choices: [
    ['one', 'One Whimsy Walk + a 1-minute mission', 'Melissa, Nov 2'],
    ['three', 'Three daily challenges', 'Victoria, Nov 2'],
    ['merged', 'Both, merged', 'Nov 2 (agreed in principle)'],
  ] },
  { id: 'pinStyle', label: 'Story pins on the map', q: 'map', choices: [
    ['dot', 'Jewel dot; the story card slides up on tap', 'Competitor research (Airbnb, AllTrails, Google Maps), Nov 4'],
    ['cover', 'Small cover poster with a title label', 'Mockup, Nov 4'],
  ] },
  { id: 'fogLook', label: 'Fog look', q: 'fog-mode', choices: [
    ['clouds', 'Cloud sea', 'Melissa likes this one (fog-mode doc)'],
    ['darkClouds', 'Dark cloud sea', 'fog-mode experiment'],
    ['night', 'Night mist', 'fog-mode experiment; the app’s purples'],
    ['swirl', 'Soft swirl', 'fog-mode default'],
    ['paper', 'Topo paper', 'Leo’s TikTok, Oct 14'],
    ['stars', 'Starry void', 'fog-mode experiment'],
  ] },
  { id: 'fogWhere', label: 'Where fog shows', q: 'Q10 / C12', choices: [
    ['home', 'Home map only', 'Melissa’s lean (fog doc); off in stories, Nov 2'],
    ['everywhere', 'Home map and inside stories', 'fog-mode mockup'],
    ['burst', 'Home map + a small burst on unlock', 'fog-mode doc'],
  ] },
  { id: 'cats', label: 'Story categories', q: 'Q14 / C9', choices: [
    ['four', 'Four: Play Anywhere, Plays Near You, Passport, Local Original', 'Naming Conventions'],
    ['three', 'Three: Play Anywhere, Passport, Local', 'Decision Log, Oct 16'],
  ] },
  { id: 'routePreview', label: 'Route preview', q: 'Q15', choices: [
    ['dots', 'Unnamed dots', 'Melissa, Oct 14'],
    ['line', 'Full line', 'Emily, Nov 3 (overview map)'],
    ['start', 'Start point only', 'Emily, Nov 3 (browse map)'],
  ] },
  { id: 'localFar', label: 'A local story, far away', q: 'Q16', choices: [
    ['virtual', 'Offer a virtual walk', 'Brett/Melissa Sep 30; i85, i137'],
    ['onsite', 'On site only', 'Golden Path page (open)'],
  ] },
  { id: 'storyEnd', label: 'End of a full story', q: 'Q13 / C10', choices: [
    ['optin', 'Ending, then a postcard if you want one', 'Melissa, Nov 3'],
    ['anim', 'Ending animation only', 'Oct 28 (FTUE V1 rule)'],
    ['stats', 'Badge + stats + postcard', 'FTUE review, Oct 21'],
  ] },
  { id: 'lockIn', label: 'Pick My Walk Time after a story', q: 'Q12', choices: [
    ['follow', 'After the recommendations', 'after-walk mockup; research idea 5'],
    ['replace', 'Instead of the recommendations', 'Built, then swapped out Oct 16'],
    ['none', 'Not shown', 'Oct 28: dropped as underbaked for V1'],
  ] },
  { id: 'upNext', label: 'Up next', q: 'Q11', choices: [
    ['one', 'One locked-in story', 'Golden Path page'],
    ['queue', 'A queue of up to 3', 'after-walk mockup'],
    ['none', 'None', '—'],
  ] },
  { id: 'youName', label: 'Profile tab name', q: 'Q21', choices: [
    ['You', 'You', 'day-two mockup'],
    ['Profile', 'Profile', 'the app today'],
    ['Your Story', 'Your Story', 'profile-hub mockup'],
  ] },
  { id: 'locRefused', label: 'Location refused', q: 'Q20 / C7', choices: [
    ['steps', 'Carry on with steps', 'Oct 21 (Decision Log)'],
    ['push', '“Staying inside?” first, then steps', 'Oct 30 draft'],
  ] },
  { id: 'skipWalk', label: 'Skip the walk', q: 'Q25 / C14', choices: [
    ['free', 'Free skip', 'Shipped in 4.27.2 (App Store notes, Oct 24)'],
    ['none', 'No skip', 'Melissa, standup Oct 15'],
  ] },
  { id: 'inter', label: 'Interactivity badge', q: 'Q26', choices: [
    ['words', 'Words: Just Listen / Light / Some / Lots (the Library’s View by scale)', 'Melissa, Nov 5 (“interactivity instead of level”); story-overview mockup'],
    ['dots', 'Dots, 1 to 3', 'Golden Path page'],
  ] },
  { id: 'tips', label: 'Tooltips', q: 'Q24', choices: [
    ['global', 'On, with one global off switch', 'Melissa, Nov 2'],
    ['pertip', 'Per-tip “Don’t Show Again”', 'Emily, Nov 3'],
  ] },
  { id: 'gemLook', label: 'Gem look', q: 'Q22', choices: [
    ['both', 'Five shapes and five colours', 'Melissa, Oct 14–30'],
    ['shape', 'Five shapes, one colour', 'Brainstorm, Oct 29'],
    ['colour', 'One shape, five colours', 'Brainstorm, Oct 29'],
  ] },
  { id: 'localBadge', label: 'Local Original badge on covers', q: 'Library · Melissa, Nov 5', choices: [
    ['stamp', 'A. Pin stamp: a round badge with a map pin and the city', 'Builder’s experiment (Melissa: “a defining badge for Local Originals”)'],
    ['ribbon', 'B. Ribbon: a corner ribbon reading LOCAL ORIGINAL', 'Builder’s experiment'],
    ['strip', 'C. Place strip: “Only in Edmonton · Legislature grounds” along the bottom, in citrine', 'Builder’s experiment'],
  ] },
  { id: 'homeBubble', label: 'Home on your own map', q: 'Golden Path Q21 · TTT', choices: [
    ['always', 'Always hidden (blob)', 'Overnight mockup, Nov 4'],
    ['choice', 'Player’s choice: Hide My Home setting, on for under-16s', 'Melissa’s pick, Nov 4 (TTT)'],
    ['shareOnly', 'Shown to you; blurred only when shared', 'Option B, Nov 4'],
  ] },
  // ---- gems (reports/gems/research.md, Nov 4). Default = the brief's recommendation.
  { id: 'gemWho', label: 'Gems: who can see one', q: 'Gems Q1', choices: [
    ['three', 'Just Me / Friends / Everyone', 'Gems brief (d)4: Just Me + Everyone decided (Oct 1), Friends from the mockup (B6)'],
    ['two', 'Just Me / Everyone', 'Team: “public or private” (design review Oct 1; brainstorm Oct 29)'],
    ['four', 'Just Me / One Friend / Friends / Everyone', 'Earlier mockup (words.js); Amara’s “leave a gem for one friend” task'],
  ] },
  { id: 'gemPublic', label: 'Gems: who can make a public one', q: 'Gems Q5 · Q1', choices: [
    ['players', 'Players 16+; under 16 keeps gems to Just Me or Friends', 'Gems brief (d)4; Problems B6 (under-16 safeguards); Snap Map teen limits'],
    ['anyone', 'Any player, any age (public places only)', 'Design review, Oct 1: “public must be a public place”, no age rule'],
    ['claim', 'Players 16+, plus creators and local businesses who claim a spot', 'Brainstorm, Oct 29: claimable gems, like claiming a business'],
    ['reviewed', 'Players 16+, and a person checks each public gem first', 'Wayfarer and Geocaching review before publishing (gems brief (c))'],
  ] },
  { id: 'gemSocial', label: 'Gems: what others can do', q: 'Gems Q3', choices: [
    ['presets', 'Cheer + I Found It + 3 preset reactions; no comments', 'Gems brief (d)8: cheers, not votes; Amara safety note: preset phrases'],
    ['cheers', 'Cheer + I Found It only', 'Gems brief (d)8; Geocaching favourites: scarce and positive-only'],
    ['friends', 'Cheer + comments from friends only', 'Gems brief (d)8: “comments in V1: friends only”'],
    ['comments', 'Cheer + open comments (needs moderation)', 'Victoria gem review, Jul 17: “moderation / detection will be needed”'],
    ['votes', 'Up and down votes', 'Community Gems Loop, Oct 8; Experiments card “Community gems… with upvotes”'],
  ] },
  { id: 'gemRarity', label: 'Gems: rarity', q: 'Gems Q2', choices: [
    ['finds', 'Rough → Fine → Flawless → Perfect, earned by finders + cheers; a map filter and a small label', 'Gems brief (d)10; brainstorm Oct 29 (“a filter, not a visual”); Geocaching favourites'],
    ['filter', 'Same tiers, map filter only (nothing on the gem)', 'Brainstorm, Oct 29: shown as a filter, not a visual'],
    ['votes', 'Common → Rare → Epic → Legendary by votes, as a badge on the gem', 'Location gems ideation, Jul; design review Oct 1'],
    ['off', 'No rarity: every gem is equal', 'Our research: “avoid wheels, scratch cards, rarity” (04-research-ideas); Wayfarer'],
  ] },
  { id: 'gemFade', label: 'Gems: do they fade?', q: 'Gems Q4', choices: [
    ['permanent', 'Permanent', 'Decided: a gem is a permanent point (design review Oct 13; Naming Conventions)'],
    ['seasonal', 'Permanent, or “just for this season” if you pick it', 'Test walk Sep 22 (expiring gems); Whimsy board; Brett’s Halloween house'],
    ['fade', 'Shared gems fade after 30 days unless someone finds them', 'Whimsy board: Fading Gems Trail'],
  ] },
  { id: 'darkNote', label: 'After-dark note on story pages', q: 'Golden Path Q15 (TTT)', choices: [
    ['hide', 'Hidden for now', 'Melissa, Nov 5: removed until the team decides'],
    ['show', 'Show it on every story page after dark', 'Overnight mockup (tester C6)'],
  ] },
  { id: 'energyUi', label: 'Help Me Pick: energy control', q: 'Library', choices: [
    ['buttons', 'Three buttons: Low / Medium / High', 'Melissa, Nov 4'],
    ['slider', 'A slider, then Pick for Me', 'Melissa, Nov 4 (to compare)'],
  ] },
  { id: 'gemQuick', label: 'Gems: “Just Save It” from + Gem', q: 'Gems', choices: [
    ['onetap', 'Saves at once, private; details later', 'Melissa, Nov 4: one tap is the default (Sky test)'],
    ['details', 'Opens the details, then Save Gem to My Map', 'Gems brief (d)3–5; explicit save tap (Oct 23)'],
  ] },
  { id: 'libView', label: 'Library view', q: '§1', choices: [
    ['shelves', 'Shelves', 'The app today'],
    ['feed', 'Feed (full-screen cards)', 'The app’s Feed tab (FeedStoryCardCarousel); Melissa, Nov 4'],
    ['swipe', 'One at a time', 'Brett, Oct 8 (testers split ~50/50)'],
  ] },
  // ---- loops (reports/loops-nov5/brief.md §4, Nov 5). First choice = the brief's pick; none settled until the team chooses.
  { id: 'sealCap', label: 'Whimsy: seals per day', q: 'Loops §4', choices: [
    ['day', 'One a day, any 7 days', 'Loops brief: Pokémon GO Field Research (1 stamp a day); Maya pressed 5 in 2 minutes, Sky got one for 0 flips'],
    ['every', 'One for every walk', 'The Nov 4 mockup'],
  ] },
  { id: 'socialNote', label: 'Gems and friends: how you hear back', q: 'Loops §4', choices: [
    ['card', 'Since you were here card, plus 1 opt-in note a day (shares the story budget)', 'Loops brief: 11 of 12 pairs; one-a-day lock-screen rule (4.28.0 nudgeGuard)'],
    ['cardOnly', 'Card only, no notifications', 'Commuters pair'],
    ['each', 'A note for each first find or cheer per gem', 'Loops brief option 3'],
  ] },
  { id: 'findNames', label: 'Gems: who you see found yours', q: 'Loops §4', choices: [
    ['names', 'Friends by name, everyone else as a count', 'Loops brief; danas pair want names'],
    ['counts', 'Counts only, never names', 'Gems research #1 (count only)'],
  ] },
  { id: 'friendsMeans', label: 'Gems: what “Friends” means', q: 'Loops §4', choices: [
    ['mine', 'Your friends only', 'Loops brief: safer for teens (Amara); Snap Map teen rules'],
    ['fof', 'Your friends and their friends', 'The Nov 4 gem page wording (“and their friends, like you”)'],
  ] },
  { id: 'seenIt', label: 'Gems: finding from afar', q: 'Loops §4', choices: [
    ['off', 'Off: a find only counts on the spot', 'iNaturalist on-site rule; gems brief (d)8'],
    ['cheer', '“I’ve Seen It” counts as a cheer', 'Nonwalkers pair (Darnell, Glen)'],
    ['find', '“I’ve Seen It” counts as a find', 'Nonwalkers pair (Darnell, Glen)'],
  ] },
  { id: 'walkedTogether', label: 'Friends: shared progress', q: 'Loops §4', choices: [
    ['none', 'None: just friends’ doodles', 'Loops brief; no streaks (01-decisions C13)'],
    ['weekly', 'A weekly line, no streak: “You + Ama: 31,000 of 50,000 steps this week”', 'Walkers pair; friends research #2'],
    ['flame', 'Shared flame with up to 5 friends (Duolingo)', 'Friends research #2; conflicts with C13 no streaks'],
  ] },
  { id: 'duskDoor', label: 'Today at dusk or dark', q: 'Loops §4', choices: [
    ['short', 'A short safe Whimsy door (10 min, lit, doorstep or At Home)', 'Amara (after school), Chinedu (Lagos dusk)'],
    ['story', 'One door: the story (today)', 'The Nov 4 mockup (Sky test)'],
  ] },
  { id: 'lowEnergy', label: 'When Today shows one door', q: 'Loops §4', choices: [
    ['signals', 'After 3+ days away, or 3 low-step days, or tapping None', 'Sky (low energy pair)'],
    ['away', 'After 3+ days away only (today)', 'The Nov 4 mockup'],
  ] },
  { id: 'remindLater', label: 'Whimsy: Remind Me Later', q: 'Loops §4', choices: [
    ['pick', 'Pick a time: Tonight / Tomorrow Morning / Saturday', 'Ben, Dana'],
    ['hour', 'One nudge in an hour (today)', 'The Nov 4 mockup'],
  ] },
  { id: 'gemsTabName', label: 'You: gem collection tab', q: 'Loops §4', choices: [
    ['Stamps', 'Stamps (today)', 'Melissa, Nov 4'],
    ['Gems', 'Gems', 'Commuters pair'],
  ] },
  { id: 'unsealAt', label: 'Whimsy: when tomorrow’s walk opens', q: 'Loops §4', choices: [
    ['7 am', '7 am', 'Loops brief'],
    ['6 am', '6 am', 'Families, social, distance pairs'],
    ['midnight', 'Midnight', 'Families, social, distance pairs'],
  ] },
  { id: 'arcSpot', label: 'Step tracker: where it sits', q: 'Loops must-fix 3', choices: [
    ['float', 'Floating above the tab bar (Victoria’s design, SC-3246); every tab scrolls clear of it', 'Melissa, Nov 5: “put it back”; Victoria’s arched tracker, Nov 4'],
    ['header', 'Docked under the header, never over content', 'Loops brief must-fix 3 (6 pairs: the dial covered Do It Now and Ama’s post)'],
  ] },
  { id: 'lineVoAt', label: 'Today: character line play button', q: 'Melissa, Nov 9: try 3 places', choices: [
    ['left', 'D. To the left of the quote', 'Melissa, Nov 9'],
    ['top', 'A. Top right of the quote', 'Melissa, Nov 9'],
    ['byline', 'B. Beside the name and story line', 'Melissa, Nov 9'],
    ['inline', 'C. Small, right after the last word of the quote', 'Melissa, Nov 5 / Nov 9'],
    ['float', 'Old: floats between the quote and the character, centred', 'Melissa, Nov 5 (she didn\u2019t like it, Nov 9)'],
  ] },
];
const DEF_O = Object.fromEntries(OPTIONS.map((o) => [o.id, o.choices[0][0]]));
export const O = { ...DEF_O };
// Team Option homePlay (Golden Path Q24, TTT): off = no sofa / at-home versions anywhere (Melissa, Nov 5).
// The treadmill / walking pad, Shoes On and the gem home bubble stay: they aren't "playing at home".
export const homeOff = () => O.homePlay === 'off';
// the remembered way, minus the sofa / at-home ones when homePlay is off
export const remembered = () => (homeOff() && ['sofa', 'home'].includes(S.remember) ? null : S.remember);
export const optLabel = (id) => { const o = OPTIONS.find((x) => x.id === id); const c = o && o.choices.find((x) => x[0] === O[id]); return c ? c[1] : ''; };

// ---------------------------------------------------------------- state
export const CITY = {
  Edmonton: { sunset: 16.8, sunrise: 7.8 }, Calgary: { sunset: 17.0, sunrise: 7.75 }, Winnipeg: { sunset: 17.0, sunrise: 7.5 },
  Camrose: { sunset: 16.8, sunrise: 7.8 }, Lagos: { sunset: 18.65, sunrise: 6.6 },
};
export const BASE_STATE = () => ({
  name: 'Sam', persona: null, hour: 18.2, dow: 'Wednesday', date: 'Nov 4', weather: 'clear', temp: 6,
  city: 'Edmonton', loc: 'city', day: 2, away: 0, member: 'trial', trialLeft: 5, account: true, first: false,
  progress: { squeaky: { ch: 3, of: 5 } }, finished: { summons: ['Welcome to the Society'] },
  myList: ['alice'], upNext: ['knight'], hearts: {},
  // gems: vis = me / friend1 / friends / all. by = handle (never a real name for strangers).
  gems: [
    { id: 'g1', type: 'curio', name: 'The hiding spot', x: 214, y: 236, mine: true, priv: true, vis: 'me', vibes: ['Hidden', 'Cozy'], from: 'The Summons', note: 'Where Wren said to look. Behind the blue bin, under the mailbox.' },
    { id: 'g2', type: 'nature', name: 'Crooked crabapple', x: 120, y: 330, mine: true, priv: true, vis: 'me', vibes: ['Pretty', 'Odd'], from: 'A walk', note: 'Leans like it’s listening. Pink for one week in May.', photo: true },
    { id: 'g8', type: 'nature', name: 'Sunset bench on the ridge', x: 150, y: 250, mine: true, priv: false, vis: 'friends', vibes: ['Calm', 'Good for a sit'], from: 'Coin-Flip Walk', note: 'Best seat for the sunset. Bring a mitt for the cold slats.', photo: true, finds: 7, cheers: 15, react: { walk: 4, smile: 6, learn: 0 }, comments: [{ who: 'Jules', t: 'Sat here for ages. You were right.', friend: true }], fadeIn: 21 },
    { id: 'g3', type: 'art', name: 'Owl mural', x: 300, y: 160, mine: false, priv: false, vis: 'all', by: '@mapleowl', dist: 6, vibes: ['Colourful'], from: 'a neighbour', note: 'Look for the tiny mouse by its left foot.', photo: true, finds: 23, cheers: 41, down: 2, react: { walk: 12, smile: 20, learn: 3 }, comments: [{ who: '@ravenreads', t: 'Found the mouse! Took me ages.' }, { who: '@stroll.with.theo', t: 'My kid named the owl Gerald.' }], fadeIn: 28 },
    { id: 'g4', type: 'shop', name: 'Corner bakery window', x: 104, y: 196, mine: false, priv: false, vis: 'all', by: '@lena.walks', dist: 9, vibes: ['Cozy'], from: 'a neighbour', note: 'A gingerbread village in the window until Christmas. Dog biscuits by the door.', photo: true, finds: 6, cheers: 11, down: 0, react: { walk: 5, smile: 4, learn: 0 }, comments: [{ who: '@crumbfan', t: 'The tiny gingerbread rink!' }], season: 'Dec 24', fadeIn: 6 },
    { id: 'g5', type: 'landmark', name: 'Old water tower', x: 290, y: 440, mine: false, priv: false, vis: 'all', by: '@historybuff', dist: 12, vibes: ['Historic', 'Grand'], from: 'a neighbour', note: 'Built in 1958. Count the rivets if you dare.', photo: true, finds: 58, cheers: 120, down: 4, react: { walk: 30, smile: 12, learn: 41 }, comments: [{ who: '@rivetcounter', t: '1,212. I counted twice.' }], fadeIn: 30 },
    { id: 'g6', type: 'curio', name: 'Little free library, green door', x: 176, y: 430, mine: false, priv: false, vis: 'all', by: '@bookwormbea', dist: 5, vibes: ['Tiny', 'Quiet'], from: 'a neighbour', note: 'Take a book, leave a book. Someone left a whole set of moose facts.', photo: true, finds: 3, cheers: 4, down: 0, react: { walk: 1, smile: 3, learn: 2 }, comments: [], fadeIn: 3 },
    { id: 'g7', type: 'art', name: 'The koi drain cover', x: 262, y: 362, mine: false, priv: false, vis: 'friends', by: 'Ama K.', friend: true, dist: 4, vibes: ['Colourful', 'Tiny'], from: 'a friend', note: 'Somebody painted a koi on it. Make a wish, then keep walking.', photo: true, finds: 2, cheers: 3, down: 0, react: { walk: 1, smile: 2, learn: 0 }, comments: [{ who: 'Jules', t: 'Wished for snow. Got snow.', friend: true }], fadeIn: 25 },
  ],
  seals: 2, fogPct: 18, weekWalked: [1, 0, 1, 0, 0, 0, 0], week: { walks: 2, chapters: 2, gems: 1 },
  stepsToday: 1240, goal: 2500, stepsWeek: [3100, 800, 1240, 0, 0, 0, 0], storySteps: 2650,
  lastStory: 'squeaky', favourSeen: {}, downloads: 0, storyOnly: false, pushes: false, miles: false, lowAudio: true,
  rem: { on: false, time: 'lunch', custom: '', days: [1, 1, 1, 1, 1, 0, 0], budget: '1 a day', quiet: '9 pm – 8 am', paused: null },
  gemVis: 'me', ptWaiting: false,
  remember: null, company: 'solo', kids: false, lowData: false, tips: true, textSize: 'Default', motion: false,
  missionDone: false, whimsyDone: false, favour: false, notif: false, lockedTime: null, perm: false, approx: false,
  postcards: 1, trialPlan: 'year', friendsOnly: true, teen: false,
  // ---- loops (Nov 5)
  wd: 2, day0: 2, friends: ['Ama K.', 'Jules', 'Theo', 'Mira'], pending: [], codeN: 0,
  sealToday: false, walkVer: null, energyNone: false, activity: [], sinceGot: false, doodleCheers: 0, myDoodle: null,
  cheeredD: {}, letterRead: false, qgSpot: null, remindAt: null,
  // ---- loops pass 2 (Nov 5, after the retests)
  pile: null, trash: [], likedGems: ['g3', 'g7'], calOn: false, treadTips: 0,
  hist: [], bank: 0, outNow: false, doorDone: false, showAllD: false, foundHint: null, wt: null, tripWalks: 0, stickers: {}, cheerBacks: {}, frNow: false,
});
export let S = BASE_STATE();
export function setState(patch) { Object.assign(S, patch); }
export function resetState(patch = {}) { S = Object.assign(BASE_STATE(), patch); }

// time helpers
export const fmtTime = (h) => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); const ap = hh >= 12 ? 'pm' : 'am'; const h12 = ((hh + 11) % 12) + 1; return `${h12}:${String(mm).padStart(2, '0')} ${ap}`; };
export const partOfDay = () => (S.hour < 5 ? 'night' : S.hour < 12 ? 'morning' : S.hour < 17 ? 'midday' : S.hour < 22 ? 'evening' : 'night');
export const sun = () => CITY[S.city] || CITY.Edmonton;
export const isDark = () => S.hour >= sun().sunset || S.hour < sun().sunrise;
export const daylightLeft = () => Math.max(0, Math.round((sun().sunset - S.hour) * 60));
export function weatherKind() {
  if (S.weather === 'storm') return 'storm';
  if (S.temp <= -20) return 'cold';
  if (S.weather === 'rain') return 'rain';
  if (S.weather === 'snow') return 'snow';
  if (S.weather === 'hot' || S.temp >= 30) return 'hot';
  if (isDark()) return 'dark';
  if (daylightLeft() > 0 && daylightLeft() <= 90) return 'dusk';
  return null;
}
export const beforeSunrise = () => S.hour < sun().sunrise;
export function lightLine() {
  if (beforeSunrise()) return WEATHER.preDawn(fmtTime(sun().sunrise));
  if (isDark()) return WEATHER.dark;
  return WEATHER.light(fmtTime(sun().sunset), daylightLeft());
}
export const weatherLine = () => `${S.temp}° · ${WEATHER.labels[S.weather] || 'Clear'} · ${lightLine()}`;
// a guest has no name to greet
export const hasName = () => S.account || ['trial', 'member', 'free'].includes(S.member);
// honest trial dates from today (Nov 4) and the days left
export function addDays(n) { const d = 4 + n; return d <= 30 ? `Nov ${d}` : `Dec ${d - 30}`; }
export function trialDates(left) { const L = left ?? +O.trial; return { end: addDays(L), remind: addDays(Math.max(0, L - 2)) }; }
export const inCanada = () => S.city !== 'Lagos';
// home on your own map (Team Option homeBubble). hideHome: draw the blob on your own map.
// blurShared: postcards and anything shared (gems for friends) keep home out of it.
export const hideHome = () => (O.homeBubble === 'choice' ? (S.hideHome ?? !!S.teen) : O.homeBubble !== 'shareOnly');
export const blurShared = () => (O.homeBubble === 'choice' ? hideHome() : true);


// ---------------------------------------------------------------- persistence (per-viewer only)
const LS = 'sc-everyday-v2';   // v2 (Nov 27): new defaults for tabs, You, gems; old saved choices would hide them
export function saveOpts() { try { localStorage.setItem(LS, JSON.stringify({ O, rev: document.body.classList.contains('reviewer') })); } catch (e) {} }
export function loadOpts() {
  try { const d = JSON.parse(localStorage.getItem(LS) || 'null'); if (d && d.O) Object.assign(O, d.O); return d; } catch (e) { return null; }
}
export function resetOpts() { Object.assign(O, DEF_O); saveOpts(); }

// ---------------------------------------------------------------- router
const SCREENS = {};
const SHEETS = {};
export const reg = (id, def) => { SCREENS[id] = def; };
export const regSheet = (id, fn) => { SHEETS[id] = fn; };
export const screenIds = () => Object.keys(SCREENS);
export const sheetIds = () => Object.keys(SHEETS);
let stack = [];
export const current = () => stack[stack.length - 1] || { id: 'today', p: {} };
const timers = new Set();
export const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
export const every = (fn, ms) => { const t = setInterval(fn, ms); timers.add(t); return t; };
export const stopTimers = () => { timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers.clear(); };
let afterRender = null;
export const onRendered = (fn) => { afterRender = fn; };

export function go(id, p = {}, opts = {}) {
  if (!SCREENS[id]) { console.warn('no screen', id); return; }
  closeSheet(true);
  if (opts.root) stack = [];
  if (opts.replace) stack.pop();
  stack.push({ id, p });
  render();
}
// pop screens off the stack: popTo('break') keeps everything up to the last 'break'
export function popTo(id, silent) {
  const i = stack.map((x) => x.id).lastIndexOf(id);
  if (i < 0) return false;
  closeSheet(true); stack = stack.slice(0, i + 1); if (!silent) render(); return true;
}
// leave a flow: drop the top screens while test() is true, then show what's under them
export function popWhile(test) {
  closeSheet(true);
  while (stack.length > 1 && test(stack[stack.length - 1].id)) stack.pop();
  if (test(current().id)) { stack = []; return go(homeTab(), {}, { root: true }); }
  render();
}
export function back() {
  closeSheet(true);
  if (stack.length > 1) { stack.pop(); render(); }
  else go(homeTab(), {}, { root: true });
}
export function rerender() { const y = $('#screen').scrollTop; render(true); $('#screen').scrollTop = y; }
export function homeTab() { return { nov26: 'today', five: 'today', real: 'today', library: 'library', sgw: 'library', maphome: 'map', go: 'feed' }[O.tabs] || 'today'; }

export function render(keepAnim) {
  stopTimers();
  let { id, p } = current();
  // a screen that was removed (e.g. the Summons victory, Nov 4) falls back to the mockup's start
  if (!SCREENS[id]) { id = 'recs'; p = { from: 'summons' }; }
  const def = SCREENS[id];
  const scr = $('#screen');
  scr.className = 'scr scr-' + id + (def.cls ? ' ' + def.cls(p) : '');
  scr.style.setProperty('--jewel', (def.jewel && def.jewel(p)) || 'var(--sapphire)');
  if (!keepAnim) { scr.style.animation = 'none'; void scr.offsetWidth; scr.style.animation = ''; }
  scr.innerHTML = def.html(p);
  if (!keepAnim) scr.scrollTop = 0;
  const showTabs = !!def.tab;
  $('#phone').classList.toggle('has-tabs', showTabs);
  if (afterRender) afterRender(def, p);
  if (def.mount) def.mount(p, scr);
}

// ---------------------------------------------------------------- sheets
let sheetOpen = null;
let sheetReturn = null;
export function openSheet(id, p = {}) {
  const fn = SHEETS[id]; if (!fn) { console.warn('no sheet', id); return; }
  const sh = $('#sheet'), scrim = $('#scrim');
  const out = fn(p);
  const html = typeof out === 'string' ? out : out.html;
  sh.className = 'sheet' + (out.cls ? ' ' + out.cls : '');
  sh.style.setProperty('--jewel', out.jewel || 'var(--sapphire)');
  sh.innerHTML = `<div class="grab" aria-hidden="true"></div>${html}`;
  if (!sheetOpen) { sheetReturn = document.activeElement; }
  sh.hidden = false; scrim.hidden = false;
  sh.scrollTop = 0;
  sheetOpen = { id, p };
  sh.setAttribute('aria-label', out.label || id);
  if (out.mount) out.mount(sh, p);
  later(() => { const f = sh.querySelector('[autofocus], button, [href], input, select'); if (f && f.focus) try { f.focus({ preventScroll: true }); } catch (e) {} }, 40);
}
export const sheetHooks = {};
export function closeSheet(silent) {
  if (!sheetOpen) return;
  const sh = $('#sheet');
  sh.hidden = true; $('#scrim').hidden = true; sh.innerHTML = '';
  const was = sheetOpen;
  sheetOpen = null;
  if (was && sheetHooks[was.id]) sheetHooks[was.id]();
  if (!silent && sheetReturn && sheetReturn.focus && document.contains(sheetReturn)) try { sheetReturn.focus({ preventScroll: true }); } catch (e) {}
}
export const sheetIsOpen = () => !!sheetOpen;
export const currentSheet = () => sheetOpen;

// ---------------------------------------------------------------- toast
let toastT;
export function toast(msg, action) {
  const t = $('#toast');
  if (action) t.innerHTML = `<span>${esc(msg)}</span><button class="toast-act" data-act="${esc(action.act)}" ${action.id ? `data-id="${esc(action.id)}"` : ''}>${esc(action.label)}</button>`;
  else t.textContent = msg;
  t.classList.toggle('has-act', !!action); t.hidden = false;
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, action ? 5200 : 2600);
}

// ---------------------------------------------------------------- tiny helpers
export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const attr = (o) => esc(JSON.stringify(o));
export const n0 = (n) => Number(n).toLocaleString('en-CA');
// reviewer-only notes
export const solves = (...keys) => `<p class="solves">solves: ${keys.map((k) => esc(SOLVES[k] || k)).join('; ')}</p>`;
export const src = (t) => `<span class="src">from: ${esc(t)}</span>`;
export const idea = (t) => `<span class="src idea">new idea: ${esc(t)}</span>`;
export const story = (id) => byId[id];
export { STORIES, byId };

// mode names follow the option; colours follow the team decision (Walk green, Path blue, Hunt purple)
// Best-fit mode follows where a story plays (Melissa, Nov 4): Play Anywhere and Passport → Steps,
// Near You (needs certain kinds of places) → Hunt, Local Originals → Path (their real route).
// Falls back to the story's own pick, then none, when that mode isn't on for the story.
export function bestMode(s) {
  const want = { anywhere: 'walk', passport: 'walk', nearyou: 'hunt', local: 'path' }[s.cat];
  return [want, s.best].find((m) => m && modeState(s, m) === 'on') || null;
}
export const modeName = (m) => (WALKMAP.modeNames[O.modeNames] || WALKMAP.modeNames.steps)[m];
export const MODE_COL = { walk: '#00CD9D', path: '#5B8CFF', hunt: '#B36BFF' };

// how a story is labelled under the chosen category set
export function catOf(s) { const set = CARD.cats[O.cats]; return set[s.cat] || set.anywhere; }
export function badgeOf(s) {
  const B = CARD.badges;
  if (s.coming) return CARD.coming(s.coming);
  if (s.cafe) return B.cafe;
  if (s.sit) return B.sit;
  if (s.town && S.loc === 'rural') return B.town;
  if (s.cat === 'passport') return B.passport(s.city);
  if (s.cat === 'local') {
    const here = localHere(s);
    return here ? B.localNear(s.place, here, S.loc === 'far' ? 'walk' : 'drive') : B.localFar(s.city);
  }
  if (s.cat === 'nearyou') return B.nearyou(s.needs);
  return B.anywhere;
}
// minutes away if the player is in the story's city, else null
export function localHere(s) { if (!s.where) return null; const city = S.loc === 'far' ? 'Edmonton' : S.city; return s.where[city] || null; }
// rural players: stories needing a town are flagged, never offered as "near you"
export const ruralOk = (s) => !(S.loc === 'rural' && s.town);
// One interactivity scale everywhere: Just Listen / Light / Some / Lots, the Library's View by groups (Melissa, Nov 5)
export const interScale = (s) => (s.inter === 1 && s.format === 'audio' ? 'Just Listen' : CARD.interScale[s.inter || 1]);
export const interLabel = (s) => (O.inter === 'dots' ? '●'.repeat(s.inter) + '○'.repeat(3 - s.inter) : interScale(s));
export function timeLabel(s) { if (!s.mins) return ''; const [a, b] = s.mins; const t = a === b ? `about ${a} min` : `${a}–${b} min`; return s.episodes ? `${t} an episode` : t; }
// walks shown in the unit the team picks
export function distTxt(steps) {
  const m = Math.round(steps * 0.75);
  if (S.miles) { const mi = m / 1609; return mi >= 0.2 ? `${mi.toFixed(1)} mi` : `${Math.round(m * 3.28 / 10) * 10} ft`; }
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m / 10) * 10} m`;
}
export function walkTxt(steps) {
  const u = S.showAs || O.unit;
  if (u === 'minutes' || S.storyOnly) return `about ${Math.max(1, Math.round(steps / 100))} min`;
  if (u === 'distance' || S.pushes) return distTxt(steps);
  return `${n0(steps)} steps`;
}
// effective mode state for a story, honouring the Path decision (CLAUDE.md, Oct 13)
export function modeState(s, m, way) {
  const st = (s && s.modes[m]) || 'on';
  if (m === 'path' && st === 'on' && O.pathReady === 'soon' && s.cat !== 'local' && way !== 'route' && !s.cafe) return 'soon';
  return st;
}

// ---------------------------------------------------------------- icons (2px rounded line, 24 grid)
const P = {
  today: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  library: '<path d="M4 4h5a3 3 0 013 3v13a2 2 0 00-2-2H4z"/><path d="M20 4h-5a3 3 0 00-3 3v13a2 2 0 012-2h6z"/>',
  feed: '<rect x="4" y="4" width="16" height="7" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/>',
  you: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  gem: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 18 3-18"/>',
  whimsy: '<path d="M12 21c-5 0-8-3-8-7 0-5 5-6 6-10 4 2 10 5 10 10 0 4-3 7-8 7z"/><path d="M12 21v-6"/>',
  go: '<path d="M8 5l11 7-11 7z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  bell: '<path d="M6 16V11a6 6 0 1112 0v5l2 2H4z"/><path d="M10 21h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  walk: '<circle cx="13" cy="4" r="2"/><path d="M10 21l2-6-3-3 1-5 4 3 3 1M12 15l3 6M9 9l-3 3"/>',
  path: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M7.5 16.5C11 14 7 10 10.5 8.5S15 9 16.5 7.5"/>',
  hunt: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><circle cx="12" cy="12" r="2.5"/>',
  sofa: '<path d="M4 11V8a2 2 0 012-2h12a2 2 0 012 2v3"/><path d="M2 12a2 2 0 014 0v2h12v-2a2 2 0 014 0v6H2z"/><path d="M5 18v2M19 18v2"/>',
  tread: '<path d="M3 17h15l3-4"/><path d="M3 20h18"/><circle cx="12" cy="5" r="2"/><path d="M11 8l-1 5 3 2M13 9l2 2"/>',
  route: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h7a3 3 0 010 6H10a3 3 0 000 6h7"/>',
  door: '<path d="M6 21V4a1 1 0 011-1h10a1 1 0 011 1v17"/><path d="M3 21h18"/><circle cx="14.5" cy="12" r="1"/>',
  share: '<path d="M12 4v11M8 8l4-4 4 4"/><path d="M5 13v6h14v-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  play: '<path d="M8 5l11 7-11 7z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
  rain: '<path d="M7 15a4 4 0 01-.5-8A6 6 0 0118 8a3.5 3.5 0 01-.5 7z"/><path d="M9 18l-1 3M13 18l-1 3M17 18l-1 3"/>',
  snow: '<path d="M7 14a4 4 0 01-.5-8A6 6 0 0118 7a3.5 3.5 0 01-.5 7z"/><path d="M9 18h.01M13 20h.01M17 18h.01"/>',
  cloud: '<path d="M7 18a4 4 0 01-.5-8A6 6 0 0118 11a3.5 3.5 0 01-.5 7z"/>',
  cold: '<path d="M12 2v20M4 6l16 12M20 6L4 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  kid: '<circle cx="9" cy="6" r="2.5"/><circle cx="17" cy="9" r="2"/><path d="M5 21v-5a4 4 0 018 0v5M14 21v-3a3 3 0 016 0v3"/>',
  people: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c.8-3.5 3.2-5 6-5s5.2 1.5 6 5M14 15.5c2.6-.5 6 .5 7 4.5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  spark: '<path d="M12 2c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 2z" transform="scale(.83) translate(2.4 0)"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  move: '<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>',
  download: '<path d="M12 4v11M8 11l4 4 4-4"/><path d="M5 19h14"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="15" r="1"/><circle cx="15" cy="9" r="1"/><circle cx="9" cy="15" r="1"/>',
  ear: '<path d="M7 9a5 5 0 0110 0c0 4-4 4-4 8a3 3 0 01-6 0"/><path d="M10 9a2 2 0 014 0"/>',
};
export const ic = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
export const ICON_NAMES = Object.keys(P);

// ---------------------------------------------------------------- gems: brand-guideline shapes (40×40, flat)
const GEM_SHAPES = {
  nature: { col: '#00CD9D', d: '<path d="M20 3c8.6 6.6 11 16.4 8.2 24.6C26.4 32.8 23.6 35.8 20 37c-3.6-1.2-6.4-4.2-8.2-9.4C9 19.4 11.4 9.6 20 3z" fill="C"/><path d="M20 3c8.6 6.6 11 16.4 8.2 24.6C26.4 32.8 23.6 35.8 20 37z" fill="#13945F" opacity=".45"/><path d="M15.6 13.5c-1.7 3.8-2.1 7.8-1.2 11.6" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>' },
  art: { col: '#35C6D7', d: '<path d="M4.5 23C4 17 7.5 10.5 13 9.2c4.5-1 9 1.3 14 2.8 5 1.5 8.5 5.5 8.5 10.5S31 30.5 25 31c-6 .5-13 .8-17-1.4-2.4-1.3-3.3-3.8-3.5-6.6z" fill="C"/><path d="M9.5 15.5c1.6-2.4 4.2-3.6 7-3.4" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>' },
  landmark: { col: '#ED8D00', d: '<path d="M14 3.5c1-.9 2.5-.7 3.6-.1l9.8 5.4c1 .6 1.6 1.6 1.6 2.7V35c0 1.1-.9 2-2 2H13c-1.1 0-2-.8-2.1-1.9-.6-9.1-.5-19.6 1.5-27.5.4-1.6.9-3 1.6-4.1z" fill="C"/><path d="M24 6.3l3.4 2.5c1 .6 1.6 1.6 1.6 2.7V35c0 1.1-.9 2-2 2h-3z" fill="#1A0B3D" opacity=".25"/><path d="M14.8 9c-1 5-1.2 10-.9 15" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>' },
  shop: { col: '#FF4F79', d: '<path d="M9 10h22c.6 0 1.2.3 1.6.8l4 5c.3.4.4.8.4 1.2v6c0 .4-.1.8-.4 1.2l-4 5c-.4.5-1 .8-1.6.8H9c-.6 0-1.2-.3-1.6-.8l-4-5c-.3-.4-.4-.8-.4-1.2v-6c0-.4.1-.8.4-1.2l4-5c.4-.5 1-.8 1.6-.8z" fill="C"/><path d="M27 10h4c.6 0 1.2.3 1.6.8l4 5c.3.4.4.8.4 1.2v6c0 .4-.1.8-.4 1.2l-4 5c-.4.5-1 .8-1.6.8h-4z" fill="#C2234F" opacity=".45"/><path d="M9.5 14.2h11" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>' },
  curio: { col: '#B36BFF', d: '<path d="M9 36 7 17l3.5-7L14 17l1 19z" fill="C"/><path d="M10.5 10 14 17l1 19h-3z" fill="#7E4FD0" opacity=".45"/><path d="M25 36l1-21 4-6.5 3.5 6.5-2.5 21z" fill="C"/><path d="M30 8.5 33.5 15 31 36h-2.5z" fill="#7E4FD0" opacity=".45"/><path d="M16 36V12l4-9 4 9v24z" fill="C"/><path d="M20 3l4 9v24h-4z" fill="#7E4FD0" opacity=".45"/><path d="M18.2 13v13" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>' },
};
export const GEM_TYPES = Object.keys(GEM_SHAPES);
// who can see a gem (older saves only have priv)
export const gemVisOf = (g) => g.vis || (g.priv ? 'me' : 'all');
// rarity: earned by what people did (distinct finders on site, plus cheers over time), never by chance or type.
// Private gems have none: nobody else can find them. Returns { i, name } or null.
export function gemTier(g) {
  if (O.gemRarity === 'off' || gemVisOf(g) === 'me' || gemVisOf(g) === 'friend1') return null;
  const finds = g.finds || 0, cheers = g.cheers || 0;
  if (O.gemRarity === 'votes') { const i = cheers >= 100 ? 3 : cheers >= 30 ? 2 : cheers >= 8 ? 1 : 0; return { i, name: GEMS.tiers.votes[i] }; }
  const pts = finds + Math.floor(cheers / 4);
  const i = pts >= 40 ? 3 : pts >= 15 ? 2 : pts >= 5 ? 1 : 0;
  return { i, name: GEMS.tiers.finds[i] };
}
export const TIER_COL = ['#A493D6', '#5B8CFF', '#C49BFF', '#F5B82E'];
export const gemCol = (t) => (O.gemLook === 'shape' || !GEM_SHAPES[t] ? '#C49BFF' : GEM_SHAPES[t].col);
export function gemSvg(type, size = 28, extra = '') {
  const shapeType = O.gemLook === 'colour' ? 'curio' : type;
  const g = GEM_SHAPES[shapeType] || GEM_SHAPES.curio;
  const col = gemCol(type);
  return `<svg class="gem-ic ${extra}" width="${size}" height="${size}" viewBox="0 0 40 40" role="img" aria-label="${esc(GEMS.types[type] ? GEMS.types[type].name : 'Gem')} gem">${g.d.replace(/fill="C"/g, `fill="${col}"`)}</svg>`;
}

// the four-point sparkle from the brand guidelines
export const sparkle = (size = 18, col = 'currentColor') => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z" fill="${col}"/></svg>`;

export const backBtn = (label = APP.back) => `<button class="back" data-back aria-label="${esc(label)}">${ic('back')}</button>`;


// ================================================================ loops (Nov 5): every loop gets a "tomorrow"
// Brief: reports/loops-nov5/brief.md. The reviewer's Next Day button keeps everything and adds what happened overnight.
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hash = (str) => { let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return Math.abs(h); };
export const seeded = (k) => { let x = hash(k) || 1; return () => { x = (Math.imul(x, 1103515245) + 12345) & 0x7fffffff; return x / 0x7fffffff; }; };
// today's Whimsy Walk: a pool of 7, picked by the date, so everyone gets the same walk the same day and a
// daily walker doesn't repeat inside a week (pass 2: walkers, distance)
export function dateIdx(d = S.date) {
  const m = String(d).match(/^(\w+) (\d+)$/); if (!m) return S.day;
  return ({ Oct: 0, Nov: 31, Dec: 61, Jan: 92 }[m[1]] || 0) + +m[2];
}
export function walkIdFor(off = 0) {
  const pool = LOOPS.pool;
  return pool[((dateIdx() + off) % pool.length + pool.length) % pool.length];
}
// Lights Patrol in daylight plays as Window Patrol (pass 2: no 8 am Lights Patrol)
export const daylit = () => !isDark() && daylightLeft() > 30;
export const walkName = (id, off = 0) => { const w = walkDef(id); return w.dayName && (off ? false : daylit()) ? w.dayName : w.name; };
export const walkDef = (id) => LOOPS.walks[id] || LOOPS.walks.cat;
export const unsealAt = () => (O.unsealAt === 'midnight' ? 'midnight' : O.unsealAt);
// the version of the walk: follows How I play, then the dark. Rain asks first (app.js).
export function walkVersion() {
  const off = homeOff();
  if (S.walkVer && !(off && S.walkVer === 'home')) return S.walkVer;
  if (S.remember === 'tread') return 'pad';
  if (!off && (S.remember === 'sofa' || S.remember === 'home')) return 'home';
  // after dark: lit streets you know; on a farm road there are no streetlights, so the doorway version (Wes).
  // With homePlay off the farm keeps the outside version and the after-dark sheet asks first (bring a light).
  if (isDark()) return S.loc === 'rural' ? (off ? 'out' : 'home') : 'lit';
  return 'out';
}
export const atHome = () => ['tread', 'sofa', 'home'].includes(remembered()) || beforeSunrise();
// friend codes: the player's name plus 4 digits, resettable
const nameTag = (n) => String(n || 'Player').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8) || 'PLAYER';
// under-16s and guests get a name-free code (pass 2: Amara's code shared her first name; Maya's guest code said SAM)
const CODE_WORDS = ['MOTH', 'FERN', 'OTTER', 'COMET', 'MAPLE', 'HERON', 'PEBBLE', 'LANTERN', 'WREN', 'FINCH'];
export const nameFree = () => S.teen || !hasName();
export const myCode = () => `${nameFree() ? CODE_WORDS[hash(S.name + S.persona + ':' + S.codeN) % CODE_WORDS.length] : nameTag(S.name)}-${String(1000 + hash(S.name + ':' + S.codeN) % 9000)}`;
export function codeName(code) {
  const m = String(code || '').trim().toUpperCase().match(/^([A-Z]{2,10})\s*-?\s*(\d{4})$/);
  if (!m) return null;
  return m[1][0] + m[1].slice(1).toLowerCase();
}
const PRON = { 'Ama K.': ['she', 'her'], Jess: ['she', 'her'], Mira: ['she', 'her'], Theo: ['he', 'his'], Sam: ['they', 'their'], Jules: ['they', 'their'], Priya: ['she', 'her'], Kai: ['he', 'his'] };
// where friends live: the mockup's friends live in your city, Jess lives 3,000 km away (Maya's friend).
// Only friends who are near can find a gem; faraway friends cheer it instead (pass 2: distance)
const FAR = { Jess: 'Halifax' };
export const friendNear = (n) => !FAR[n] && S.loc === 'city' && S.city !== 'Lagos';
export const firstName = (n) => String(n).replace(/ \w\.$/, '');
// "your heron at Whitemud Creek", never "your The heron" (pass 2 copy fix)
export const gemRef = (name) => `your ${/^The /.test(name) ? name.slice(4) : name}`;
export const gemOn = (name) => (/^The /.test(name) ? 'the ' + name.slice(4) : name);
export const pronoun = (n, poss) => (PRON[n] || ['they', 'their'])[poss ? 1 : 0];
// other people's gems only show where there are players near you (not on the farm, not in Lagos)
export const othersNear = () => !(S.loc === 'rural' || (S.city === 'Lagos' && S.loc !== 'far'));
// rarity progress: "2 more finders to Fine"
export function tierNext(g) {
  if (O.gemRarity !== 'finds' && O.gemRarity !== 'filter') return null;
  const t = gemTier(g); if (!t) return null;
  if (t.i >= 3) return { top: true };
  const pts = (g.finds || 0) + Math.floor((g.cheers || 0) / 4);
  return { n: Math.max(1, [5, 15, 40][t.i] - pts), name: GEMS.tiers.finds[t.i + 1] };
}
export function logAct(kind, t, extra = {}) { S.activity.unshift({ id: 'a' + S.activity.length + '-' + S.day, day: S.day, kind, t, seen: false, ...extra }); S.sinceGot = false; }
export const sinceItems = () => (S.sinceGot ? [] : S.activity.filter((a) => a.day === S.day && a.kind !== 'quiet'));
export const unseen = () => S.activity.some((a) => !a.seen);

// a finished walk, mission, roulette or found gem: steps, This Week, today's dot, fog, and the story's next chapter
export function countWalk({ steps = 0, home = false, fog = true }) {
  S.stepsToday += steps; S.stepsWeek[S.wd] = (S.stepsWeek[S.wd] || 0) + steps;
  S.weekWalked[S.wd] = 1; S.week.walks++; S.away = 0; S.walkedToday = true;
  S.bank = (S.bank || 0) + steps;   // walked steps count toward the current chapter (pass 2: walkers)
  if (S.loc === 'far') S.tripWalks = (S.tripWalks || 0) + 1;
  if (!home) S.outNow = true;
  if (fog && !home && S.loc === 'city' && S.city !== 'Lagos') S.fogPct = Math.min(100, S.fogPct + (steps > 1500 ? 3 : 1));
}
// one seal a day, any 7 days (Team Option sealCap). Needs at least 1 flip, turn or step.
export function pressSeal(n) {
  if (!(n >= 1)) return 'none';
  if (O.sealCap === 'day' && S.sealToday) return 'already';
  S.seals = Math.min(7, S.seals + 1); S.sealToday = true; return 'pressed';
}
// friends who did today's walk (made up, steady for the day; more as the day goes on)
export function friendDoodles() {
  const fr = S.friends;
  if (!fr.length || S.hour < 8) return [];
  // friends you just added come first, so a new friend shows up the morning they accept
  const add = S.added || [], order = [...fr.filter((f) => add.includes(f)).reverse(), ...fr.filter((f) => !add.includes(f))];
  const k = Math.min(fr.length, 1 + Math.floor((S.hour - 8) / 3) + (S.day % 2));
  return order.slice(0, k).map((who, i) => { const n = 4 + hash(who + S.day) % 11; return { who, n, steps: 600 + n * 170, key: `d:${who}:${S.day}`, i }; });
}
function nextDate(d) {
  const m = String(d).match(/^(\w+) (\d+)$/); if (!m) return d;
  const len = { Oct: 31, Nov: 30, Dec: 31 }[m[1]] || 30; const n = +m[2] + 1;
  return n > len ? `${{ Oct: 'Nov', Nov: 'Dec', Dec: 'Jan' }[m[1]] || m[1]} 1` : `${m[1]} ${n}`;
}
// one gem's overnight: friends near you find it (each friend once), faraway friends cheer it, strangers find a
// public one. One line per gem: "Ama K. and 1 other found your heron." (pass 2: distance, walkers, lowtech)
function gemNight(g, r, scale, first) {
  const A = LOOPS.act, v = gemVisOf(g);
  const pool = v === 'friend1' ? [g.friendName].filter(Boolean) : S.friends;
  g.finders = g.finders || []; g.log = g.log || [];
  const before = gemTier(g), ref = gemRef(g.name);   // the full name: "Curiosity" alone was clumsy (lowtech)
  const lines = [];
  const near = pool.filter((f) => friendNear(f) && !g.finders.includes(f));
  const far = pool.filter((f) => !friendNear(f));
  // finds: named friends nearby (each once), plus strangers on a public gem (always a count)
  const named = near.length && (r() < 0.75 || first) ? near.slice(0, Math.min(near.length, Math.max(1, Math.round(scale)))) : [];
  const strangers = v === 'all' && (r() < 0.8 || first) ? Math.max(1, Math.round((1 + Math.floor(r() * 2)) * scale)) : 0;
  named.forEach((f) => { g.finders.push(f); g.log.unshift({ who: f, what: 'found', day: S.day }); });
  g.finds = (g.finds || 0) + named.length + strangers;
  if (named.length || strangers) {
    const showNames = O.findNames === 'names' && named.length;
    lines.push({ t: !showNames ? A.foundN(named.length + strangers, ref) : named.length === 2 && !strangers ? A.foundTwo(named[0], named[1], ref) : named.length + strangers > 1 ? A.foundMore(named[0], named.length + strangers - 1, ref) : A.found(named[0], ref), who: showNames ? named[0] : null });
  }
  // cheers: a faraway friend cheers it from afar; otherwise a count (or one friend by name)
  const farWho = far.length && (r() < 0.6 || (first && !lines.length)) ? far[(S.day + g.name.length) % far.length] : null;
  let c = Math.round((r() < 0.7 ? 1 + Math.floor(r() * 3) : 0) * scale);
  const react = (k) => { g.react = g.react || { walk: 0, smile: 0, learn: 0 }; for (let i = 0; i < k; i++) { const id = ['smile', 'walk', 'smile', 'learn'][(S.day + i) % 4]; g.react[id] = (g.react[id] || 0) + 1; } };
  if (farWho) { g.cheers = (g.cheers || 0) + 1; react(1); g.log.unshift({ who: farWho, what: 'saw', day: S.day }); lines.push({ t: O.findNames === 'names' ? A.cheerFar(farWho, ref) : A.cheersN(1, gemOn(g.name)), who: O.findNames === 'names' ? farWho : null }); c = 0; }
  if (c && pool.length) {
    g.cheers = (g.cheers || 0) + c; react(c);
    const who = pool.filter(friendNear)[(S.day + 1) % Math.max(1, pool.filter(friendNear).length)];
    if (c === 1 && who && O.findNames === 'names') { g.log.unshift({ who, what: 'cheered', day: S.day }); lines.push({ t: A.cheer(who, ref), who }); }
    else lines.push({ t: A.cheersN(c, gemOn(g.name)) });
  } else if (c && v === 'all') { g.cheers = (g.cheers || 0) + c; react(c); lines.push({ t: A.cheersN(c, gemOn(g.name)) }); }
  const after = gemTier(g);
  lines.slice(0, 2).reverse().forEach((x) => logAct('gem', x.t, { gem: g.id, who: x.who }));
  if (before && after && after.i > before.i) logAct('tier', A.tier(g.name.replace(/^The /, 'The '), after.name, g.finds), { gem: g.id });
  if (lines.length) { g.isNew = true; g.fadeIn = 30; }
  return lines.length;
}
function overnight(r, scale = 1) {
  const A = LOOPS.act;
  S.pending.forEach((n) => { if (!S.friends.includes(n)) S.friends.push(n); S.added = [...(S.added || []), n]; logAct('friend', A.accepted(n), { who: n }); });
  S.pending = [];
  const first = S.day === S.day0 + 1;
  let news = 0;
  S.gems.filter((g) => g.mine && !g.hidden && gemVisOf(g) !== 'me').forEach((g) => {
    const v = gemVisOf(g);
    if (v !== 'all' && !(v === 'friend1' ? g.friendName : S.friends.length)) return;
    news += gemNight(g, r, scale, first);
  });
  return news;
}
// rolling step history across week boundaries: { d, steps, walked, away } (pass 2: lowenergy)
export function seedHist() {
  S.hist = [];
  for (let i = 1; i <= 7; i++) {
    const d = S.day - i; if (d < 0) break;   // nothing before install
    const away = S.away > 0 && i <= S.away;
    const steps = S.wd - i >= 0 ? (S.stepsWeek[S.wd - i] || 0) : 2400;
    S.hist.push({ d, steps: away ? 0 : steps, walked: !away && steps >= 500, away });
  }
}
// low-step days among the last 3 calendar days, counting only days since install and never days away.
// A player's first 7 days never drop the Whimsy door (pass 2 blocker: Maya, Hannah, Chinedu; Tasha; Sky)
export function lowDays() {
  if (S.day < 7) return 0;
  let n = 0;
  for (let i = 1; i <= 3; i++) {
    const h = (S.hist || []).find((x) => x.d === S.day - i);
    if (!h || h.d < 0 || h.away) continue;
    if (h.steps < 500 && !h.walked) n++;
  }
  return n;
}
const WX_NEXT = { rain: 'cloud', storm: 'rain', snow: 'cloud', cloud: 'clear', clear: 'cloud', hot: 'clear' };
export function nextDay() {
  const r = seeded('day' + S.day + S.name);
  const walked = S.whimsyDone, prevDay = S.day, yday = S.stepsToday, A = LOOPS.act;
  S.hist = [{ d: prevDay, steps: yday, walked: !!S.walkedToday, away: false }, ...(S.hist || []).filter((h) => h.d !== prevDay)].slice(0, 14);
  S.yday = { steps: yday, goal: S.goal };
  S.day++; S.hour = 8; S.wd = (S.wd + 1) % 7; S.dow = DAYS[S.wd]; S.date = nextDate(S.date);
  if (S.wd === 0) { S.weekWalked = [0, 0, 0, 0, 0, 0, 0]; S.stepsWeek = [0, 0, 0, 0, 0, 0, 0]; S.week = { walks: 0, chapters: 0, gems: 0 }; }
  S.stepsToday = 0; S.stepsWeek[S.wd] = 0;
  S.whimsyDone = false; S.sealToday = false; S.missionDone = false; S.flipDismissed = false; S.energyNone = false;
  S.walkVer = null; S.first = false; S.away = 0; S.sinceGot = false; S.myDoodle = null; S.doodleCheers = 0; S.atGem = null; S.remindAt = null; S.youAt = null; S.qgSpot = null;
  S.outNow = false; S.walkedToday = false; S.doorDone = false; S.showAllD = false; S.foundHint = null; S.wt = null;
  // the weather moves on too: Ruth's rain clears to cloud, then clear (pass 2)
  S.weather = (S.day % 4 === 3 && S.weather0) ? S.weather0 : (WX_NEXT[S.weather] || S.weather);
  if (S.trialLeft > 0 && S.member === 'trial') S.trialLeft--;
  // logged oldest first: the card shows newest first, so gem news lands on top
  // a quick-saved spot from yesterday wants a name; any other private spot gets a character's answer,
  // and once a week Gem Echo brings back an older one (private gems pay off too: lowenergy)
  const q = S.gems.find((g) => g.mine && g.from === 'Quick save' && g.savedDay === prevDay);
  const priv = S.gems.filter((g) => g.mine && gemVisOf(g) === 'me' && g.savedDay === prevDay && g !== q).pop();
  const old = S.gems.filter((g) => g.mine && gemVisOf(g) === 'me' && (g.savedDay ?? -99) <= S.day - 5 && !g.hidden);
  if (S.day % 7 === 0 && old.length) { const g = old[S.day % old.length]; g.echo = S.day; logAct('echo', A.gemEcho(S.day - (g.savedDay ?? S.day - 9), gemOn(g.name)), { gem: g.id }); }
  if (priv) { const who = ['Wren', 'Sir Wendell', 'The Mailbox'][S.day % 3]; const L = LOOPS.replies[who]; logAct('reply', `${who}: ${L[S.day % L.length]}`, { gem: priv.id }); }
  else if (q && S.day % 2) { const L = LOOPS.replies.Wren; logAct('reply', `Wren: ${L[S.day % L.length]}`, { gem: q.id }); }
  if (q) logAct('nameit', A.nameIt, { gem: q.id });
  if (S.friends.length) logAct('friends', A.friendWalk(Math.min(S.friends.length, 1 + (prevDay % 3))));
  if (walked && S.friends.length) { const who = S.friends[prevDay % S.friends.length]; logAct('doodle', A.doodleCheer(who), { who }); }
  // the cheers and replies you sent yesterday land: "Ama saw your cheer" (pass 2: friends both ways)
  Object.keys(S.cheeredD).filter((k) => S.cheeredD[k] && k.endsWith(':' + prevDay)).slice(0, 2).forEach((k) => { const who = k.split(':')[1]; logAct('saw', A.saw(who), { who }); });
  Object.entries(S.cheerBacks || {}).filter(([, d]) => d === prevDay).slice(0, 1).forEach(([who]) => logAct('saw', A.saw(who), { who }));
  overnight(r);
  // nothing changed: ask nothing (no friends and no shared gems means no card)
  if (!S.friends.length) S.activity = S.activity.filter((a) => !(a.day === S.day && a.kind === 'friends'));
}
export function laterToday() {
  S.hour = Math.min(23.5, S.hour + 3);
  // a request sent today can be accepted this evening, so day 1 can bring a first cheer (pass 2: Kai)
  const acc = S.pending.slice();
  acc.forEach((n) => { if (!S.friends.includes(n)) S.friends.push(n); S.added = [...(S.added || []), n]; logAct('friend', LOOPS.act.accepted(n), { who: n }); });
  S.pending = [];
  if (S.whimsyDone && S.friends.length) {
    const who = [...acc, ...S.friends.filter((f) => !acc.includes(f))].slice(0, Math.max(acc.length, Math.min(S.friends.length, 1 + (S.day % 2))));
    who.forEach((w) => { S.doodleCheers++; logAct('doodle', LOOPS.act.doodleCheer(w), { who: w }); });
  }
}
// Tasha and other returners: what happened while they were away (bigger numbers)
export function whileAway() { if (S.away >= 7) overnight(seeded('away' + S.name), Math.min(3, Math.ceil(S.away / 7))); }
// how old a fixed post looks after Next Day
export function ageWhen(when) {
  const d = S.day - S.day0;
  if (d <= 0) return when;
  if (d === 1) return LOOPS.ages.yesterday;
  return d < 7 ? LOOPS.ages.days(d) : LOOPS.ages.weeks(Math.floor(d / 7));
}
