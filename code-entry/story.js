// Every word the player sees lives here, so a wording change is a one-line edit.
// Pick a version on the start list or with ?v=glow (numbers keypad with Victoria's envelope art, the default),
// ?v=letters (QWERTY), ?v=dial (dial, 5 letters), ?v=dial7 (dial, 7 letters) or ?v=dialwords (dial of words). All use the glowing blue style.
// image: the clue picture (swap the file to change it). Without it, the drawn envelope shows the answer on its seal.

export const STORY = {
  title: 'The Summons',
  chapter: 'The Drop Spot',
  sender: 'Unknown number',
  start: {
    kicker: 'The Summons · The Drop Spot',
    title: 'Code Entry',
    sub: 'Enter the code from the letter’s wax seal. Pick a version to try.',
  },
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  help: 'Get a hint',
  loupeHint: 'Press and drag to look closer',
  hintsUsed: n => `Hints used: ${n}`,
  win: {
    rumble: 'Don’t panic. The ground is supposed to do that.',
    title: 'Welcome to the Society.',
    eyebrow: 'End of mockup',
    again: 'Play again',
    other: { glow: 'Try the word version', letters: 'Try the dial', dial: 'Try the 7-letter dial', dial7: 'Try the dial of words', dialwords: 'Try the number keypad' },
    otherTo: { glow: 'letters', letters: 'dial', dial: 'dial7', dial7: 'dialwords', dialwords: 'glow' },
  },
};

export const VARIANTS = {
  glow: {
    label: 'Glow',
    blurb: 'Glowing numbers keypad',
    answer: '786666',
    keypad: 'numbers',
    image: 'img/summons-envelope-seal.jpg',   // Victoria's FTUE art (decrypted letter). Remove this line to fall back to the drawn envelope.
    imageAlt: 'A purple envelope on dark pavement, sealed with gold wax stamped with the numbers 7 8 6 6 6 6',
    chat: [
      { say: 'You found it.' },
      { image: 'dropspot', alt: 'A glowing mail slot floating in midair, with glowing buttons beside it and the hoodie symbol above' },
      { say: 'See these buttons? Enter the code to send the letter.' },
      { choice: 'Okay, here goes…' },
      { say: 'Get the envelope out. Let’s have a look.' },
      { say: 'Look closely at the seal.' },
      { open: true },
    ],
    codeLabel: 'Enter the code',   // shown in capitals above the code field
    hints: ['It’s on the seal.', 'Look at the gold numbers.'],
    solve: 'Solve this for me',
    wrong: 'That’s not it. Look at the seal again.',
    notFull: 'The code has six numbers.',
    sealLabel: 'The wax seal, with gold numbers 7 8 6 6 6 6',
    backKey: '*',   // door-keypad symbols in the digits' own font, each with a small label underneath
    sendKey: '#',
    backLabel: 'Delete',
    sendLabel: 'Enter',
  },
  letters: {
    label: 'Word',
    blurb: 'Type the word on glowing keys',
    answer: 'BISCUIT',
    keypad: 'letters',
    chat: [
      { say: 'You found it.' },
      { image: 'dropspot', alt: 'A glowing mail slot floating in midair, with glowing buttons beside it and the hoodie symbol above' },
      { say: 'See these buttons? Enter the word to send the letter.' },
      { choice: 'Okay, here goes…' },
      { say: 'Get the envelope out. Let’s have a look.' },
      { say: 'Look closely at the seal.' },
      { open: true },
    ],
    codeLabel: 'Enter the word',
    hints: ['It’s on the seal.', 'Look at the gold letters.'],
    solve: 'Solve this for me',
    wrong: 'That’s not it. Look at the seal again.',
    notFull: 'The word has seven letters.',
    sealLabel: 'The wax seal, with the gold word BISCUIT',
    backKey: '⌫',   // thin drawn backspace (QWERTY keypad, bottom left)
    sendKey: 'ENTER',
    backLabel: 'Delete',
    sendLabel: 'Enter',
  },
  dial: {
    label: 'Dial · 5 letters',
    blurb: 'Turn five rings of letters to line up the word',
    answer: 'CRUMB',
    keypad: 'dial',
    // One ring per letter, outer ring first. Each ring carries the right letter and 4 random others, repeating as it turns.
    pick: 5,
    chat: [
      { say: 'You found it.' },
      { image: 'dropspot', alt: 'A glowing mail slot floating in midair, with glowing buttons beside it and the hoodie symbol above' },
      { say: 'See this dial? Line up the word to send the letter.' },
      { choice: 'Okay, here goes…' },
      { say: 'Get the envelope out. Let’s have a look.' },
      { say: 'Look closely at the seal.' },
      { open: true },
    ],
    codeLabel: 'Line up the word',
    hints: ['It’s on the seal.', 'Turn each ring until its letter sits under the gold notch.'],
    solve: 'Solve this for me',
    wrong: 'That’s not it. Look at the seal again.',
    notFull: '',
    sealLabel: 'The wax seal, with the gold word CRUMB',
    backKey: '⌫',   // unused on the dial (nothing to delete)
    sendKey: 'SEND',
    backLabel: 'Delete',
    sendLabel: 'Send',
  },
  dial7: {
    label: 'Dial · 7 letters',
    blurb: 'Turn seven rings of letters to line up the word',
    answer: 'BISCUIT',
    keypad: 'dial',
    // One ring per letter, outer ring first. Each ring carries the right letter and 4 random others, repeating as it turns.
    pick: 5,
    chat: [
      { say: 'You found it.' },
      { image: 'dropspot', alt: 'A glowing mail slot floating in midair, with glowing buttons beside it and the hoodie symbol above' },
      { say: 'See this dial? Line up the word to send the letter.' },
      { choice: 'Okay, here goes…' },
      { say: 'Get the envelope out. Let’s have a look.' },
      { say: 'Look closely at the seal.' },
      { open: true },
    ],
    codeLabel: 'Line up the word',
    hints: ['It’s on the seal.', 'Turn each ring until its letter sits under the gold notch.'],
    solve: 'Solve this for me',
    wrong: 'That’s not it. Look at the seal again.',
    notFull: '',
    sealLabel: 'The wax seal, with the gold word BISCUIT',
    backKey: '⌫',   // unused on the dial
    sendKey: 'SEND',
    backLabel: 'Delete',
    sendLabel: 'Send',
  },
  dialwords: {
    label: 'Dial · words',
    blurb: 'Turn five rings of words to line up a name',
    answer: 'THE GREEN-EYE SHARP-TOOTH FIRE DRAKE',
    words: true,
    keypad: 'dial',
    // One ring per word, outer ring first. Each ring's words repeat as it turns; the right one must be in its list.
    rings: [
      ['THE', 'A', 'OLD', 'ONE', 'YOUR'],
      ['GREEN-EYE', 'RED-EYE', 'GOLD-EYE', 'ONE-EYE', 'BLUE-EYE'],
      ['SHARP-TOOTH', 'LONG-TAIL', 'IRON-CLAW', 'BIG-WING', 'NO-TOOTH'],
      ['FIRE', 'ICE', 'MUD', 'STORM', 'SMOKE'],
      ['DRAKE', 'SNAKE', 'TOAD', 'WYRM', 'DUCK'],
    ],
    // The clue: a note on parchment instead of the envelope (a whole name won't fit on a seal)
    note: { intro: 'Speak the beast’s true name:', lines: ['THE GREEN-EYE', 'SHARP-TOOTH', 'FIRE DRAKE'] },
    chat: [
      { say: 'You found it.' },
      { say: 'Line up its true name and it will let you pass.' },
      { open: true },
    ],
    codeLabel: 'Line up the name',
    hints: ['It’s written on the note.', 'Read it top to bottom: one word on each ring.'],
    solve: 'Solve this for me',
    wrong: 'That’s not it. Read the note again.',
    notFull: '',
    sealLabel: 'A note that reads: Speak the beast’s true name: the green-eye sharp-tooth fire drake',
    backKey: '⌫',   // unused on the dial
    sendKey: 'SEND',
    backLabel: 'Delete',
    sendLabel: 'Send',
  },
};
