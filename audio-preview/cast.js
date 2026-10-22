// Character demos for Tales from the Incident — same story overview, different sprite + Tales snippet.
// Drop replacement art in sprites/<id>.png (or .webp) to override the remote fallback.
const TALES_STORY = {
  title: 'Tales from the Incident',
  author: 'Story City',
  cover: 'https://creator.storycity.app/media/6ab6d67bab537_Ep5_Intro-1.jpg',
  // Location plate for tip--place (blurred + darkened). Swap per story later.
  place: 'place/tales.jpg',
  genre: 'Mystery',
  age: '13+',
  duration: '45 min',
  summary: 'Every street has a story. Most people just walk past them.',
  description: [
    'Welcome to Tales from the Incident.',
    'Every street has a story. Most people just walk past them. You won’t.',
    'There’s more than one way to follow a story like this. By default, it’s tied to the city. You’ll move from place to place, unlocking each moment where it happened.',
  ],
};

export const CAST = [
  {
    id: 'tales',
    character: 'Hooded guide',
    voiceBy: 'Story City Narration',
    sprite: 'sprites/tales.png',
    spriteFallback: 'https://creator.storycity.app/media/6ad14ddd3f3ee_ftue-door-summons-character.png',
    audio: 'snippet.mp3',
    start: 0.768,
    end: 9.024,
    story: TALES_STORY,
  },
  {
    id: 'brighid',
    character: 'Brighid',
    voiceBy: 'Brighid',
    sprite: 'sprites/brighid.png',
    spriteFallback: 'https://creator.storycity.app/media/6ad14ddaebe6c_ftue-door-knight-character.png',
    audio: 'snippet-tales-brighid.mp3',
    start: 0.384,
    end: 8.288,
    story: TALES_STORY,
  },
];

export const LABEL = 'Tap to play audio snippet';
