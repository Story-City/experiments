// Story progress: every word on the page lives here.
export const PAGE = {
  kicker: 'Idea · Nov 12',
  title: 'Story progress',
  sub: 'Eight ways to show how far you are in a story. Play The Summons in the phone and watch how each one copes when a choice changes the length.',
  tip: 'At chapter 2, pick “I’d rather stay inside” for the shorter route.',
  restart: 'Start over',
  lengthLabel: 'When a choice changes the length',
  was: 'was',
};

// Melissa's shortlist from the 14 sketches (Nov 12). `was` = the letter in the first round of sketches.
export const OPTIONS = [
  { k: 'A', was: 'A', short: 'Dots', name: 'Dots at the top', status: 'Okay',
    what: 'One dot per chapter, with “Chapter 2 of 5” underneath.',
    length: 'It counts the longest route. Take a shorter one and a dot drops off.' },
  { k: 'B', was: 'C', short: 'Fog path', name: 'Fog path', status: 'Okay',
    what: 'Shows where you’ve been. The road ahead fades into fog.',
    length: 'It never shows a total, so a choice can’t break it.' },
  { k: 'C', was: 'D', short: 'Bar', name: 'Bar plus “about X left”', status: 'Okay',
    what: 'A thin bar and a short line of words.',
    length: '“About” covers routes that run longer or shorter.' },
  { k: 'D', was: 'E', short: 'Ribbon', name: 'Bookmark ribbon', status: 'Unsure',
    what: 'A thin ribbon down the right edge fills as you read. Not sure the side edge works.',
    length: 'It fills by share of the route, so it jumps ahead a little if the route gets shorter.' },
  { k: 'E', was: 'I', short: 'Branch map', name: 'Branch map', status: 'Keep',
    what: 'The story’s real forks. Your route glows; the roads not taken stay faint. Busy, but interesting.',
    length: 'A shorter route just looks like a different road, so nothing has to change.' },
  { k: 'F', was: 'K', short: 'Three acts', name: 'Three acts', status: 'Concept only',
    what: 'Beginning, middle and end, with a marker. Not right as drawn, but the idea might get better.',
    length: 'Works whatever the chapter count. A shorter route moves through the acts faster.' },
  { k: 'G', was: 'L', short: 'Ring', name: 'Chapter ring', status: 'Keep',
    what: 'A ring fills around the chapter number in the header, like the shrinking ring on the Steps map.',
    length: 'It fills by share of the route, so a shorter route fills it faster.' },
  { k: 'H', was: 'M', short: 'Stamps', name: 'Passport stamps', status: 'Keep',
    what: 'A stamp for each place or moment in the story. The next one is a dashed outline.',
    length: 'It only counts what you’ve done, so it needs no total.' },
];

// The Summons, shortened from the real script (docs/script-the-summons.md).
// Each chapter: title, icon (for the stamps), lines (n = narration, t = text from the unknown number), choices.
export const STORY = {
  title: 'The Summons',
  start: 'c1',
  ch: {
    c1: { title: 'The Summons', icon: 'window', lines: [['n', 'It’s an ordinary day, just like any other.'], ['n', 'Except you get a text from an unknown number.'], ['t', 'Look out your window']], choices: [['I’m Here', 'c2']] },
    c2: { title: 'A mysterious figure', icon: 'eye', lines: [['n', 'On the street corner, a figure in a dark hoodie taps at their phone.'], ['t', 'Are you ready for a higher purpose? Come to the street corner.']], choices: [['I’d Rather Stay Inside', 'c3r'], ['I’m at the Street Corner', 'c3']] },
    c3: { title: 'The mysterious letter', icon: 'letter', lines: [['n', 'The figure drops something and dashes around the corner.'], ['n', 'It’s a letter with a wax seal: “Take a picture with me. Then deliver me.”']], choices: [['I’m at the Mailbox', 'c4']] },
    c4: { title: 'The mailbox', icon: 'mailbox', lines: [['n', 'The figure is nowhere to be seen.'], ['t', 'Deliver the letter, enter its code, and all will be revealed.']], choices: [['Enter the Code', 'c5'], ['I’m Done with This', 'c5x']] },
    c5: { title: 'Welcome to the Society', icon: 'stairs', lines: [['n', 'A trap door slides open beside you.'], ['n', 'A dim staircase leads down into the unknown.']], end: 'The secret is yours. That was 1 of 3 endings.' },
    c5x: { title: 'Throw away adventure', icon: 'flame', lines: [['n', 'You toss the letter into the gutter.'], ['n', 'Behind you, it starts to smoke and turns to ash.']], end: 'You tossed this mystery aside. That was 1 of 3 endings.' },
    c3r: { title: 'Reject the call', icon: 'sofa', lines: [['n', 'You close the window and settle in to watch some TV.']], choices: [['Sit Down and Relax', 'c4r']] },
    c4r: { title: 'Static', icon: 'tv', lines: [['n', 'Every channel is static. A strange symbol fills the screen.'], ['t', 'To reject us is to reject life itself.']], end: 'Secret societies don’t love rejection. That was 1 of 3 endings.' },
  },
};
