// First-time user experience: two versions on the same 12 steps.
// Script source: story-city-product/docs/ftue-two-versions.md

// The chat opens mid-hack: the glitch itself plays over the explainer page
// (app.js), then the guide takes over this thread.
function opening(guide) {
  return {
    intro: {
      beats: [{ thread: guide, takeover: 'quiet' }],
      next: 's3',
    },
  };
}

// home / town / rural (rural falls back to the town line when none is given)
const indoor = (p, home, out, rural) => (p.indoor ? home : p.rural && rural ? rural : out);

export const VERSIONS = {
  summons: {
    label: 'A · The Summons',
    title: 'The Summons',
    blurb: 'A secret society has chosen you. Nobody told you why.',
    guide: 'wren',
    cast: { wren: { name: 'Wren', avatar: 'img/wren.svg', status: 'The Society · encrypted', hacker: true } },
    mapTitle: 'Society map',
    chapters: {
      ...opening('wren'),
      s3: {
        beats: [
          { system: 'Incoming transmission · encrypted' },
          { from: 'wren', text: 'Hello? Is this thing on?' },
          { from: 'wren', text: 'Tap anything if you can read me.' },
        ],
        choices: [
          { text: 'Who is this?', to: 's4' },
          { text: 'I can read you', to: 's4' },
        ],
      },
      s4: {
        beats: [
          { from: 'wren', text: 'Sorry about your screen. The Society doesn’t do phone calls.' },
          { from: 'wren', text: 'My name’s Wren. I’ve been sent to find one person out there…' },
          { from: 'wren', text: '…and my compass keeps pointing at you.' },
          { from: 'wren', text: 'Let me see your map so I can guide you.' },
        ],
        step: { type: 'location', button: 'Share my location', to: 's5' },
      },
      s5: {
        beats: [
          { from: 'wren', text: (p) => (p.located ? 'Got you. Hi! 👋' : 'Fine, we’ll do this the old-fashioned way. I’ll sketch you a map.') },
          { from: 'wren', text: 'The signal keeps cutting out. It’s stronger if you move.' },
          { from: 'wren', text: 'Pick one:' },
        ],
        choices: [
          { text: 'Walk to the nearest street corner', to: 's5b', set: { indoor: false, rural: false } },
          { text: 'Walk up my road (I’m out in the country)', to: 's5b', set: { indoor: false, rural: true } },
          { text: 'Walk to the far end of my home', to: 's5b', set: { indoor: true, rural: false } },
        ],
      },
      s5b: {
        beats: [
          { from: 'wren', text: (p) => indoor(p, 'Perfect. About 30 steps should do it.', 'Perfect. A couple of minutes should do it.', 'Perfect. Out there the signal travels far. About five minutes should do it.') },
          { from: 'wren', text: 'Watch the circle around you. It shrinks as the signal gets stronger.' },
        ],
        step: { type: 'walk', button: 'Start walking', to: 's6' },
      },
      s6: {
        beats: [
          { from: 'wren', text: 'There! Something came through.' },
          { from: 'wren', image: 'img/letter.svg', effect: 'corrupt', id: 'clue', alt: 'A sealed letter, scrambled with static' },
          { from: 'wren', text: 'It’s scrambled. Find these colours around you and snap them to unscramble it.' },
        ],
        action: { text: 'Unscramble the letter', target: 'clue', game: 'decrypt', mode: 'photo', title: 'Unscramble · The letter', done: 'Letter unscrambled', to: 's7', alt: 'A sealed letter: the next clue waits beneath a light' },
      },
      s7: {
        beats: [
          { from: 'wren', text: 'It’s from the Society. “The next clue waits beneath a light.”' },
          { from: 'wren', text: (p) => indoor(p, 'Any lamp near you will do. I’ve pinned the closest one.', 'Lucky you, there’s a streetlight right here. I’ve pinned it.', 'No streetlights out there? No problem. I’ve dropped a glowing marker up your road instead.') },
          { from: 'wren', text: 'Tip: in any story, you can pick a spot like this instead of walking the full distance.' },
        ],
        step: { type: 'auto', button: 'Go to the light', place: (p) => indoor(p, 'Nearest lamp', 'Streetlight', 'Glowing marker'), to: 's8' },
      },
      s8: {
        beats: [
          { from: 'wren', text: 'Last test.' },
          { from: 'wren', text: (p) => indoor(p, 'The Society marks its meeting places by the tallest thing in the room.', 'The Society marks its meeting places by the tallest tree in sight.') },
          { from: 'wren', text: (p) => indoor(p, 'Find it and take its picture.', 'Search your neighbourhood. It might take a short walk. Snap it when you find it.', 'Search around you. It might take a short walk. Snap it when you find it.') },
        ],
        step: { type: 'hunt', button: 'Start the hunt', find: (p) => indoor(p, 'The tallest thing in the room', 'The tallest tree in sight'), to: 's9' },
      },
      s9: {
        beats: [
          { from: 'wren', text: 'That’s it! Want to mark it so you can find it again?' },
        ],
        step: { type: 'gem', button: 'Make it a gem', to: 's10' },
      },
      s10: {
        beats: [
          { from: 'wren', text: 'One problem.' },
          { from: 'wren', text: 'If you close this app, your gem vanishes.' },
          { from: 'wren', text: 'Sign your name in the Society’s book and it’s yours to keep.' },
        ],
        step: { type: 'account', button: 'Sign the book', title: 'Sign the Society’s book', body: 'Keep your gem and pick up where you left off on any phone.', to: 's11' },
      },
      s11: {
        beats: [
          { system: 'New message from the Society' },
          { from: 'wren', text: 'Wait… the Society just replied.' },
          { from: 'wren', text: 'There’s a door under this city, and they want you to open it.' },
          { from: 'wren', text: 'I can keep this line open, but only for members.' },
        ],
        step: {
          type: 'paywall',
          button: 'Become a member',
          eyebrow: 'The Society is waiting',
          title: 'Open the door',
          perks: ['Every chapter of The Summons', 'Dozens more full-length stories', 'Keep every gem you make'],
          to: 's12',
        },
      },
      s12: {
        beats: [
          { from: 'wren', text: 'Oh, and one more thing.' },
          { from: 'wren', text: 'The Society isn’t the only secret around here. Take a look.' },
        ],
        step: { type: 'spotlight', tip: 'More secrets live here', to: 'end' },
      },
      end: { end: true },
    },
  },

  knight: {
    label: 'B · The Knight',
    title: 'A Knight Needs Your Help',
    blurb: 'An invisible dragon is loose near you. A very polite knight needs a hand.',
    guide: 'knight',
    cast: { knight: { name: 'Sir Wendell', avatar: 'img/knight.svg', status: 'Knight of the Order · via portal' } },
    mapTitle: 'Quest map',
    chapters: {
      ...opening('knight'),
      s3: {
        beats: [
          { system: 'Portal opened' },
          { from: 'knight', text: 'Hark! Is this a magic looking-glass?' },
          { from: 'knight', text: 'Tap upon it if thou canst hear me!' },
        ],
        choices: [
          { text: 'Who are you?', to: 's4' },
          { text: 'I hear you!', to: 's4' },
        ],
      },
      s4: {
        beats: [
          { from: 'knight', text: 'Forgive me. I seem to have tumbled into thy… glowing slab.' },
          { from: 'knight', text: 'I am Sir Wendell, and I hunt a dragon that hath turned invisible, right near thee.' },
          { from: 'knight', text: 'Prithee tell, dost thou have a map?' },
        ],
        step: { type: 'location', button: 'Share my location', to: 's5' },
      },
      s5: {
        beats: [
          { from: 'knight', text: (p) => (p.located ? 'Splendid! Now I see where thou art.' : 'No map? Then I shall draw one, as in days of old.') },
          { from: 'knight', text: 'Its scent is faint here. We must follow it!' },
          { from: 'knight', text: 'Choose thy path:' },
        ],
        choices: [
          { text: 'Walk to the nearest street corner', to: 's5b', set: { indoor: false, rural: false } },
          { text: 'Ride up my road (I’m out in the country)', to: 's5b', set: { indoor: false, rural: true } },
          { text: 'Search the far end of my home', to: 's5b', set: { indoor: true, rural: false } },
        ],
      },
      s5b: {
        beats: [
          { from: 'knight', text: (p) => indoor(p, 'A short patrol! Some thirty paces.', 'Onward! A couple of minutes, no more.', 'Open country! Mine favourite. Some five minutes up the road.') },
          { from: 'knight', text: 'Seest thou the circle around thee? That is how far the scent remains. It shrinks as thou drawest near.' },
        ],
        step: { type: 'walk', button: 'Follow the scent', to: 's6' },
      },
      s6: {
        beats: [
          { from: 'knight', text: 'Blast! The beast hath torn my map to shreds!' },
          { from: 'knight', text: 'Make haste, help me piece it together again.' },
        ],
        action: { text: 'Mend the map', game: 'jigsaw', image: 'img/dragon-map.jpg', title: 'Mend · Quest map', done: 'Quest map mended', to: 's7', alt: 'The quest map, mended, with a dragon trail' },
      },
      s7: {
        beats: [
          { from: 'knight', text: (p) => indoor(p, 'The map showeth claw marks by a lamp, and there is one right near thee!', 'The map showeth claw marks at a streetlight, and there is one beside thee!', 'No streetlights yonder! I have planted my banner where the claw marks lead, just up thy road.') },
          { from: 'knight', text: 'Take heed: on any quest thou mayst choose a spot such as this, instead of walking the full distance.' },
        ],
        step: { type: 'auto', button: 'Go to the claw marks', place: (p) => indoor(p, 'Nearest lamp', 'Streetlight', 'Knight’s banner'), to: 's8' },
      },
      s8: {
        beats: [
          { from: 'knight', text: (p) => indoor(p, 'Dragons do nap upon the tallest thing they can find.', 'Dragons do nap in the tallest tree they can find.') },
          { from: 'knight', text: (p) => indoor(p, 'Find it and capture its likeness!', 'Search the neighbourhood! It may be a short march. Capture its likeness when thou findest it.', 'Search the countryside! It may be a short march. Capture its likeness when thou findest it.') },
        ],
        step: { type: 'hunt', button: 'Start the hunt', find: (p) => indoor(p, 'The tallest thing in the room', 'The tallest tree nearby'), to: 's9' },
      },
      s9: {
        beats: [
          { from: 'knight', text: 'A fine lookout! Let us mark it upon thy map.' },
        ],
        step: { type: 'gem', button: 'Make it a gem', to: 's10' },
      },
      s10: {
        beats: [
          { from: 'knight', text: 'Every knight’s deeds are writ in the Great Roll.' },
          { from: 'knight', text: 'Add thy name, that thy mark be never lost.' },
        ],
        step: { type: 'account', button: 'Sign the Great Roll', title: 'Sign the Great Roll', body: 'Keep your gem and pick up your quest on any phone.', to: 's11' },
      },
      s11: {
        beats: [
          { system: '🐉 A roar, then wings' },
          { from: 'knight', text: 'It hath fled toward the mountains!' },
          { from: 'knight', text: 'The true quest beginneth now. Wilt thou ride with me?' },
        ],
        step: {
          type: 'paywall',
          button: 'Ride with Sir Wendell',
          eyebrow: 'The quest continues',
          title: 'Join the Order',
          perks: ['Every chapter of the dragon quest', 'Dozens more full-length stories', 'Keep every gem you make'],
          to: 's12',
        },
      },
      s12: {
        beats: [
          { from: 'knight', text: 'And adventurer? I am not the only hero hereabouts who hath need of thee.' },
        ],
        step: { type: 'spotlight', tip: 'More heroes need you here', to: 'end' },
      },
      end: { end: true },
    },
  },
};
