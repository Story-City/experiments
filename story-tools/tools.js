// All the words on the Story Tools home screen and card backs.
// Each tool's own screens keep their text at the top of tools/<id>.js.

export const HOME = {
  kicker: 'Story City · Toolbox',
  title: 'Story Tools',
  sub: 'Little gadgets a story (or a whimsy walk) can hand you. Tap one to try it.',
  notNow: 'Not now',
  surprise: 'Surprise Me',
  cut: (n) => `Cut · ${n} tools`,
  cutWhy: 'Melissa, 2 Nov: not good enough to build. Kept here so the team can see them.',
  back: 'Back to tools',
};

// Families group the cards on the home screen.
export const FAMILIES = [
  { id: 'photo', label: 'Photo magic' },
  { id: 'puzzle', label: 'Puzzles and locks' },
  { id: 'sound', label: 'Sound' },
  { id: 'map', label: 'Finding your way' },
  { id: 'keep', label: 'Keep and share' },
  { id: 'new', label: 'New ideas · not on the board yet' },
];

// One card per tool from the Whimsy Walks & Quests board (Kind = Tool).
// jewel = its story accent from the brand palette. board = the Notion idea, word for word.
export const TOOLS = [
  // Photo magic
  { id: 'tiny-world', family: 'photo', verdict: 'cut', jewel: '#35C6D7', mech: 'A photo trick', name: 'Tiny World',
    hook: 'Your street, shrunk to a model village.', more: 'Snap anything wide. The tool blurs the top and bottom and pumps the colour, so it looks like a tabletop miniature.',
    how: ['Snap', 'Slide', 'Shrink'], tags: ['Any walk', 'Photo'], go: 'Shrink Something',
    ask: ['Someone’s been building a model of your street. Down to the last mailbox.', 'Snap a wide view and I’ll show you what they see.'],
    board: 'Tiny world: turn your photo into a miniature / tilt-shift scene' },
  { id: 'portal', family: 'photo', verdict: 'cut', jewel: '#9883F8', mech: 'A photo trick', name: 'Portal',
    hook: 'Cut a hole in one place and look through to another.', more: 'Pick a shape, cut it out of one photo, and drop it into a second photo. Drag it where you like.',
    how: ['Cut', 'Drop', 'Peek'], tags: ['Any walk', 'Photos'], go: 'Open a Portal',
    ask: ['Two places in this city are closer than they look.', 'Cut a doorway out of one and open it into the other.'],
    board: 'Portal: cut a shape from one photo and drop it into another' },
  { id: 'face-finder', family: 'photo', verdict: 'cut', jewel: '#F5B82E', mech: 'A photo trick', name: 'Face-Finder',
    hook: 'Everything has a face if you look hard enough.', more: 'Snap a mailbox, a hydrant, a tree. Then stick on googly eyes and a mouth, and give it a name.',
    how: ['Snap', 'Stick', 'Name'], tags: ['Any walk', 'Photo'], go: 'Find a Face',
    ask: ['The Society says objects on this street are watching us.', 'Find one with a face. Then give it its real face.'],
    board: 'Face-finder: add googly eyes or a mouth to anything you photograph' },
  { id: 'spot-difference', family: 'photo', verdict: 'cut', jewel: '#ED54B3', mech: 'A photo puzzle', name: 'Spot the Difference',
    hook: 'Something in your photo moved. Can you tell what?', more: 'Take a photo, look at it for five seconds, and the tool quietly changes a few things. Tap what changed.',
    how: ['Snap', 'Study', 'Spot'], tags: ['Any walk', 'Photo'], go: 'Start Looking',
    ask: ['Something on your street changed while you weren’t looking.', 'Snap it now. Study it. Then tell me what moved.'],
    board: 'Spot the difference: the app quietly changes your photo; find what changed' },
  { id: 'zoom-mystery', family: 'photo', verdict: 'cut', jewel: '#FA7423', mech: 'A spotting puzzle', name: 'Zoom Mystery',
    hook: 'A super-close crop of something nearby. What is it?', more: 'The story shows you a tiny piece of something on your route. Guess, or pull back for a hint, then go find it.',
    how: ['Squint', 'Guess', 'Find'], tags: ['Hunt', 'Photo'], go: 'Show Me the Clue',
    ask: ['I found this on the Society’s camera. It’s somewhere near you.', 'Tell me what it is, then go and find the real thing.'],
    board: 'Zoom mystery: a super-close crop of something nearby; find what it is' },
  { id: 'then-now', family: 'photo', verdict: 'Story-specific', jewel: '#C9C6D3', mech: 'A lining-up tool', name: 'Then and Now',
    hook: 'Stand where someone stood a hundred years ago.', more: 'An old photo of the spot floats over your camera. Line them up, then slide between then and now.',
    how: ['Find', 'Line Up', 'Slide'], tags: ['Trail', 'Photo'], go: 'Line It Up',
    ask: ['This spot has been here a long time. Longer than the Society.', 'Stand where the old photographer stood and line it up.'],
    board: 'Then & now: line your camera up with an old photo of the same spot' },
  { id: 'remix-relay', family: 'photo', verdict: 'Maybe', jewel: '#DA82ED', mech: 'A pass-it-on tool', name: 'Remix Relay',
    hook: 'Someone left you a photo. Remix it and pass it on.', more: 'A photo on its way to the Society’s archive. Each agent adds one remix and passes it on. Faces and house numbers are blurred.',
    how: ['Catch', 'Remix', 'Pass'], tags: ['Any walk', 'With others'], go: 'Catch the Baton',
    ask: ['Agents pass this photo hand to hand. Each one leaves a mark.', 'It’s your turn. Add yours, then pass it on.'],
    board: "Remix relay: remix someone else's photo, then pass it on" },

  // Puzzles and locks
  { id: 'riddle-lock', family: 'puzzle', jewel: '#FF4F79', mech: 'A lock', name: 'Riddle Lock',
    hook: 'A padlock that only opens at the right spot.', more: "The answer is written somewhere real: on a plaque, a sign, a bench. Go there, read it, and spin the lock.",
    how: ['Read', 'Walk', 'Unlock'], tags: ['Trail', 'Puzzle'], go: 'Try the Lock',
    ask: ['The Society locked the next clue. Of course they did.', 'The answer is written on something real. Go read it.'],
    board: 'Riddle lock: a padlock that opens with an answer only found at a spot' },
  { id: 'cipher-wheel', family: 'puzzle', jewel: '#00CD9D', mech: 'A decoder', name: 'Cipher Wheel',
    hook: 'A secret message. The key is hidden on a plaque or sign.', more: 'Find the number the story asks for (a plaque year, a bus stop), turn the wheel to it, and read the message. The ring is yours to keep.',
    how: ['Find', 'Turn', 'Decode'], tags: ['Hunt', 'Puzzle'], go: 'Spin the Wheel',
    ask: ['This message is in the Society’s old code.', 'The key is a number out there on a sign. Find it and turn the wheel.'],
    board: 'Cipher wheel: decode a message using house or sign numbers' },
  { id: 'echo-answer', family: 'puzzle', jewel: '#58B0F6', mech: 'A heads-up puzzle', name: 'Echo Answer',
    hook: 'Answer out loud. Phone in your pocket.', more: 'The riddle is read to you. Say the answer out loud and the tool listens. No screen needed.',
    how: ['Listen', 'Think', 'Say It'], tags: ['Any walk', 'Voice'], go: 'Hear the Riddle',
    ask: ['Put your phone away for this one. I’ll whisper the riddle.', 'When you know it, just say it out loud.'],
    board: 'Echo answer: answer a riddle out loud, no looking at the phone' },

  // Sound
  { id: 'sound-catcher', family: 'sound', jewel: '#93DC5E', mech: 'A sound trick', name: 'Sound Catcher',
    hook: 'Five seconds of your street becomes a creature.', more: 'Record any sound. Loud, soft, high or low, it hatches a little creature with its own tune.',
    how: ['Listen', 'Catch', 'Hatch'], tags: ['Wander', 'Sound'], go: 'Catch a Sound',
    ask: ['Strange sounds have been hatching things around here.', 'Catch five seconds of your street and see what comes out.'],
    board: 'Sound catcher: record 5 seconds of sound; it becomes a creature or a tune' },
  { id: 'whisper-drop', family: 'sound', jewel: '#4CBFE9', mech: 'A message drop', name: 'Whisper Drop',
    hook: 'Voices waiting at a spot. Leave a reply for the next walker.', more: 'Hear what the Society’s friends left here, then leave a kind reply in your own agent voice. It only plays for someone standing on the spot.',
    how: ['Arrive', 'Listen', 'Leave One'], tags: ['Trail', 'With others'], go: 'Listen Here',
    ask: ['Some friends of the Society left voices at this spot.', 'Listen first. Then leave a kind reply in your agent voice.'],
    board: 'Whisper drop: leave a voice note at a spot for the next person' },

  // Finding your way
  { id: 'compass', family: 'map', jewel: '#DEC523', mech: 'A no-map tool', name: 'Compass Only',
    hook: 'No map. Just an arrow and warmer or colder.', more: 'Somewhere near you is a hidden spot. The arrow wobbles, the screen warms up as you get close.',
    how: ['Follow', 'Warmer', 'Found'], tags: ['Trail', 'Walking'], go: 'Hide Something',
    ask: ['I’ve hidden something for you. No map this time.', 'Just my compass. Follow the arrow and tell me if you’re getting warmer.'],
    board: 'Compass only: no map, just an arrow and warmer / colder' },
  { id: 'path-drawer', family: 'map', jewel: '#ED8D00', mech: 'A drawing walk', name: 'Sigil Walk',
    hook: 'Walk a secret symbol into your streets.', more: 'Pick a sigil and it lays a faint guide over your streets. Your walk draws the line.',
    how: ['Pick', 'Walk', 'Draw'], tags: ['Wander', 'Walking'], go: 'Pick a Sigil',
    ask: ['The Society signs its letters by walking them into the streets.', 'Pick a sigil. Your footsteps will draw it.'],
    board: 'Path drawer: your walk draws a shape on the map (heart, star, cat)' },

  // Keep and share
  { id: 'field-guide', family: 'keep', jewel: '#5BD380', mech: 'A collecting book', name: 'Field Guide',
    hook: 'Catalogue the creatures of your street.', more: 'Faces in windows, doors that look grumpy, a very suspicious hydrant. Snap one and write its entry.',
    how: ['Spot', 'Snap', 'Catalogue'], tags: ['Hunt', 'Keeps forever'], go: 'Open the Guide',
    ask: ['This city is full of creatures nobody has written down.', 'Start a field guide. Grumpy doors count.'],
    board: 'Field guide: catalogue the "creatures" you find (faces, weird doors)' },
  { id: 'sticker-book', family: 'keep', jewel: '#FF6050', mech: 'A keepsake', name: 'Sticker Book',
    hook: 'Every quest you finish leaves a sticker.', more: 'A little passport that fills up as you play. Each page is a neighbourhood or a season.',
    how: ['Play', 'Earn', 'Stick'], tags: ['Any walk', 'Keeps forever'], go: 'Open My Passport',
    ask: ['Every agent keeps a passport. Here’s yours.', 'Finish a quest and you get a stamp. Fill it up at your own pace.'],
    board: 'Sticker book: each finished quest adds a sticker to your passport' },
  { id: 'story-stamp', family: 'keep', jewel: '#9AAEC4', mech: 'A group story', name: 'Pass the Pen',
    hook: 'One line at each spot. Together, a story.', more: 'Every walker who stops here adds one line, built from a word bank so it stays kind. Read the story so far, then add yours.',
    how: ['Read', 'Add', 'Pass'], tags: ['Any walk', 'With others'], go: 'Read the Story',
    ask: ['Walkers have been writing a story at this bench, one line each.', 'Read it, then add the next line.'],
    board: 'Story stamp: write one line at a spot; the lines become a group story' },
  // New ideas from the overnight research (not on the Notion board yet)
  { id: 'case-card', family: 'new', jewel: '#C9C6D3', mech: 'A share card', name: 'Case Card',
    hook: 'Show how you did. Never what you found.', more: 'Finish a chapter and get a little card: your route shape, clues found, hints used. No spoilers, so friends can still play it.',
    how: ['Finish', 'Card', 'Share'], tags: ['After a chapter', 'Share'], go: 'Make My Card',
    ask: ['Chapter closed. The Society wants a report.', 'Keep it vague. Nobody likes a spoiler.'],
    board: 'New: spoiler-free result card after a chapter (like the Wordle grid)' },
  { id: 'silhouette', family: 'new', jewel: '#DEC523', mech: 'A matching hunt', name: 'Silhouette Match',
    hook: 'A shadow outline. Find the real thing that fits it.', more: 'The story shows a black shape. Find something on your street that matches, line it up in the camera and see how well it fits.',
    how: ['Study', 'Hunt', 'Fit'], tags: ['Hunt', 'Photo'], go: 'Show Me the Shadow',
    ask: ['Only a shadow made it through on this transmission.', 'Find what cast it. Line it up so I can see.'],
    board: 'New: photograph the real object that matches a shadow outline, scored on fit' },
  { id: 'field-notes', family: 'new', jewel: '#58B0F6', mech: 'A hint drop', name: 'Field Notes',
    hook: 'Leave a hint at a spot for the next agent.', more: 'Build a note from a word bank, like "Try looking up". Notes can be liked but never disliked, so they stay kind.',
    how: ['Read', 'Build', 'Leave'], tags: ['Any walk', 'With others'], go: 'Read the Notes',
    ask: ['Agents who came before you left notes here.', 'Read them. If one helps, leave one back.'],
    board: 'New: word-bank hints left at spots for later players, likes only' },
  { id: 'evidence-board', family: 'new', jewel: '#FF4F79', mech: 'A deduction board', name: 'Evidence Board',
    hook: 'Pin your clues. Connect two and the story twists.', more: 'Gems and clues from the chapter land on a corkboard. Draw a string between the right two and a hidden scene unlocks.',
    how: ['Pin', 'Connect', 'Twist'], tags: ['In a story', 'Puzzle'], go: 'Open the Board',
    ask: ['You’ve collected a lot. I think two of these are connected.', 'Pin them up. Find the pair.'],
    board: 'New: pin gems and clues, link the right ones to unlock a twist' },
  { id: 'travelling-clue', family: 'new', jewel: '#ED8D00', mech: 'A carry-it-on object', name: 'Clue Courier',
    hook: 'A clue that wants to reach the river. Carry it a little way.', more: 'Pick up a story object at a gem, carry it on your walk, and drop it at the next gem. Watch its whole journey on the map.',
    how: ['Pick Up', 'Carry', 'Drop'], tags: ['Trail', 'With others'], go: 'Pick It Up',
    ask: ['This brass key has been travelling for weeks, hand to hand.', 'It needs to reach the river. Carry it one stop closer.'],
    board: 'New: a story object players carry gem to gem toward a goal (like a Geocaching travel bug)' },
];

// Already on the experiments site, so not repeated here.
export const ALREADY = [
  { board: 'Remixer', where: 'The Remixer' },
  { board: 'Fog of war', where: 'Fog mode' },
  { board: 'Colour picker', where: 'The Decryptor' },
  { board: 'Image un-mixer', where: 'First steps (the jigsaw)' },
];

export const GUIDE = { name: 'Wren', status: 'The Society · encrypted', avatar: 'img/wren.svg' };

export const CAMERA = { pretend: 'or use a sample photo' };
