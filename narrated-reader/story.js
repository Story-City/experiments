// The Summons, chapter 1, retold as a narrated chapter.
// One line per entry. Edit text here; nothing else needs to change.
//   who:   'narrator' (centred, no bubble), 'figure' (left bubble), 'player' (right bubble)
//   secs:  optional audio length; left out, it's worked out from the word count
//   scene: optional art for the ?v=captions variant ('corner', 'letter', 'empty', 'pocket')

export const STORY = {
  title: 'The Summons',
  chapter: 'Chapter 1 · The Corner',
  next: 'Chapter 2 · The Hiding Spot',
};

export const CAST = {
  narrator: { name: 'Storyteller' },
  figure:   { name: 'The Hooded Figure' },
  player:   { name: 'You' },
};

export const OPENING = [
  { who: 'narrator', scene: 'corner', text: 'The streetlights flicker on, one by one, as you walk.' },
  { who: 'narrator', text: 'At the corner, under the last lamp, someone is waiting.' },
  { who: 'narrator', text: 'A dark hood. A long coat. A strange symbol stitched on one sleeve: a key with an eye where the handle should be.' },
  { who: 'figure',   text: 'Hello. Don’t bother asking how I know your name.' },
  { who: 'figure',   text: 'You’ve been chosen for a higher purpose.' },
  { who: 'narrator', scene: 'letter', text: 'The figure holds out an envelope, sealed with dark red wax.' },
  { who: 'figure',   text: 'Take it, and the city opens up to you. Walk on, and we never met.' },
];

export const CHOICE = {
  prompt: 'What do you do?',
  options: [
    { id: 'take', label: 'Take the letter', said: 'I’ll take it.' },
    { id: 'walk', label: 'Keep walking',    said: 'No thanks.' },
  ],
};

export const BRANCHES = {
  take: [
    { who: 'narrator', text: 'The wax is still warm. Pressed into it is the same strange symbol.' },
    { who: 'figure',   text: 'Good. Don’t open it here. Too many eyes.' },
    { who: 'figure',   text: 'Find somewhere cozy nearby, somewhere you can read in peace.' },
    { who: 'narrator', scene: 'empty', text: 'When you look up again, the corner is empty.' },
    { who: 'narrator', text: 'Only the letter is left, and the sound of footsteps fading down the street.' },
  ],
  walk: [
    { who: 'figure',   text: 'Bold. Most people at least ask what’s inside.' },
    { who: 'narrator', scene: 'empty', text: 'You walk on. Behind you, the streetlight flickers once, then goes dark.' },
    { who: 'figure',   text: 'The Society always offers a second chance.' },
    { who: 'narrator', scene: 'pocket', text: 'A block later, you find an envelope in your pocket. You’re sure it wasn’t there before.' },
  ],
};
