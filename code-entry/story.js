// Every word the player sees lives here, so a wording change is a one-line edit.
// Pick a version on the start list or with ?v=glow (numbers keypad with Victoria's envelope art, the default),
// ?v=letters (QWERTY), ?v=dial (dial, 5 letters) or ?v=dial7 (dial, 7 letters). All use the glowing blue style.
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
    other: { glow: 'Try the word version', letters: 'Try the dial', dial: 'Try the 7-letter dial', dial7: 'Try the number keypad' },
    otherTo: { glow: 'letters', letters: 'dial', dial: 'dial7', dial7: 'glow' },
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
    // One ring per letter, outer ring first. Every ring carries the whole alphabet, in order (the default symbols).
    startAt: [7, 15, 4, 19, 11],   // how many letters past the answer each ring starts, so none starts solved
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
    // One ring per letter, outer ring first. Every ring carries the whole alphabet, in order.
    startAt: [7, 15, 4, 19, 11, 22, 9],   // how many letters past the answer each ring starts, so none starts solved
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
};
