// Every word the player sees lives here, so a wording change is a one-line edit.
// Pick a variant with ?v=digits (default, the plain original), ?v=letters or ?v=glow (both use the glowing blue keypad).
// image: the clue picture (swap the file to change it). Without it, the drawn envelope shows the answer on its seal.

export const STORY = {
  title: 'The Summons',
  chapter: 'The Drop Spot',
  sender: 'Unknown number',
  start: {
    kicker: 'The Summons · last chapter',
    title: 'The Drop Spot',
    sub: 'Deliver the letter and enter the code from its seal.',
    button: 'Start',
    switchLabel: 'Mockup:',
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
    other: { digits: 'Try the word version', letters: 'Try the number version', glow: 'Try the classic keypad' },
    otherTo: { digits: 'letters', letters: 'digits', glow: 'digits' },
  },
};

export const VARIANTS = {
  digits: {
    label: 'Numbers',
    answer: '786666',
    keypad: 'digits',
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
  },
  letters: {
    label: 'Word',
    answer: 'BISCUIT',
    keypad: 'letters',
    style: 'glow',   // glowing blue keypad, like ?v=glow
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
    backKey: 'DEL',
    sendKey: 'ENTER',
    backLabel: 'Delete',
    sendLabel: 'Enter',
  },
  glow: {
    label: 'Glow',
    answer: '786666',
    keypad: 'digits',
    style: 'glow',   // vault look: near-black panel, glowing blue characters
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
};
