// Each entry is one comprehensive demo: story overview + character sprite + audio snippet.
// Drop replacement art in sprites/<id>.png (or .webp) to override the remote fallback.
export const CAST = [
  {
    id: 'tales',
    character: 'Hooded guide',
    sprite: 'sprites/tales.png',
    spriteFallback: 'https://creator.storycity.app/media/6ad14ddd3f3ee_ftue-door-summons-character.png',
    audio: 'snippet.mp3',
    start: 0.768,
    end: 9.024,
    story: {
      title: 'Tales from the Incident',
      author: 'Story City',
      cover: 'https://creator.storycity.app/media/6ab6d67bab537_Ep5_Intro-1.jpg',
      genre: 'Mystery',
      age: '13+',
      duration: '45 min',
      summary: 'Every street has a story. Most people just walk past them.',
      description: [
        'Welcome to Tales from the Incident.',
        'Every street has a story. Most people just walk past them. You won’t.',
        'There’s more than one way to follow a story like this. By default, it’s tied to the city. You’ll move from place to place, unlocking each moment where it happened.',
      ],
    },
  },
  {
    id: 'frightnight',
    character: 'Night caller',
    sprite: 'sprites/frightnight.png',
    spriteFallback: 'https://creator.storycity.app/media/6ad14ddaebe6c_ftue-door-knight-character.png',
    audio: 'snippet-frightnight.wav',
    start: 0.576,
    end: 8.5,
    story: {
      title: 'Frightnight Ghost Tours',
      author: 'Story City',
      cover: 'https://storycity.app/media/68e533ee4b780_Intro_v3.png',
      genre: 'Horror',
      age: '16+',
      duration: '60 min',
      summary: 'Hey… can you hear me? A voice on the line wants you to follow.',
      description: [
        'Hey… can you hear me?',
        'Tap the button on the phone if you can hear me.',
        'Good. Don’t hang up. The tour starts where you are standing.',
      ],
    },
  },
];

export const LABEL = 'Tap to play audio snippet';
