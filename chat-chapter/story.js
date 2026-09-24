export const STORY = {
  title: 'Operation COPY/WRITE',
  start: 'pre',
};

export const CAST = {
  quillbus: { name: 'Quillbus Aldersley', avatar: 'img/quillbus.jpg', status: 'Society for Art Demarcation' },
  crispe: { name: 'crisp-E', avatar: 'img/crispe.jpg', status: 'hijacked your thread' },
  maya: { name: 'Maya', initials: ['M'] },
  jonah: { name: 'Jonah', initials: ['J'] },
  friends: { name: 'First Years', initials: ['M', 'J'], status: 'Maya, Jonah', group: true },
};

const HEAD_TO = 'Head to the next node';

function replyJoke(s) {
  const secs = s === 1 ? '1 second' : `${s} seconds`;
  if (s <= 5) return `${secs}, new record 😂`;
  if (s <= 20) return `${secs}?? do you sleep holding your phone 😂`;
  if (s <= 60) return 'under a minute, as always 😂';
  return 'still faster than Jonah answers anything 😂';
}

export const CHAPTERS = {
  pre: {
    thread: 'friends',
    history: [
      { system: 'Today 8:52 AM' },
    ],
    beats: [
      { from: 'jonah', text: 'anyone free this weekend? need help moving a couch' },
    ],
    choices: [
      { text: 'Me!', to: 'pre2' },
      { text: 'I’m free', to: 'pre2' },
      { text: 'Sure, what time?', to: 'pre2' },
      { text: 'I’m free but… ugh. Is there pizza?', to: 'pre2' },
    ],
  },
  pre2: {
    beats: [
      { from: 'maya', text: ({ replySeconds: s }) => `${replyJoke(s)} where’d you get that jacket btw` },
    ],
    choices: [
      { text: 'Thrift store. Six bucks.', to: 'hacked' },
      { text: 'Made it myself 🧵', to: 'hacked' },
      { text: 'Stole it from my dad', to: 'hacked' },
      { text: 'Vintage. Don’t ask what it cost.', to: 'hacked' },
    ],
  },
  hacked: {
    beats: [
      { typing: 'maya', ms: 1600 },
      { glitch: 'hack', clear: true },
      { thread: 'quillbus', scramble: true },
    ],
    next: 'c0',
  },
  c0: {
    thread: 'quillbus',
    beats: [
      { system: 'Incoming transmission · encrypted' },
      { from: 'quillbus', text: 'Hello? Did I get through?' },
      { from: 'quillbus', text: 'Please, push one of the buttons on your screen if you can hear me.' },
      { from: 'quillbus', text: 'It is of the utmost urgency and importance!' },
    ],
    choices: [
      { text: 'Uhhhh who are you?', to: 'c2' },
      { text: 'I read you loud and clear stranger!', to: 'c2' },
    ],
  },
  c2: {
    beats: [
      { from: 'quillbus', text: 'My hacking worked! Huzzah!' },
      { from: 'quillbus', text: 'My report says: “A scan of school records and social feeds has determined you’re attentive, stylish, and have nothing better to do.”' },
      { flicker: 'WARHOL' },
      { from: 'quillbus', text: 'Oh but how rude of me. My name is Quillbus Aldersley, and I am a representative of a, shall we say secret, society dedicated to the preservation of art itself.' },
      { from: 'quillbus', text: 'Believe it or not, there are priceless pieces of art that are being destroyed on this very campus.' },
      { from: 'quillbus', text: 'I need someone with feet on the ground to save these images from a fate of ruin and destruction.' },
      { from: 'quillbus', text: 'Can I count on you?' },
    ],
    choices: [
      { text: 'I love art, count me in!', to: 'c3' },
      { text: 'Sure, I’ve got some spare time', to: 'c4' },
      { text: 'No thanks, I’m good!', to: 'c5' },
    ],
  },
  c3: {
    beats: [
      { from: 'quillbus', text: 'I knew my source was right about you!' },
      { ref: 'mission' },
    ],
    walk: { text: 'Head to the first node', place: 'The first node', to: 'c7' },
  },
  c4: {
    beats: [
      { from: 'quillbus', text: 'I was hoping for a bit more enthusiasm, but I’ll take it!' },
      { ref: 'mission' },
    ],
    walk: { text: 'Head to the first node', place: 'The first node', to: 'c7' },
  },
  c5: {
    beats: [
      { hesitate: 'quillbus' },
      { from: 'quillbus', text: 'A-are you sure? You would be doing the work of a hero!' },
    ],
    choices: [
      { text: 'I changed my mind, count me in!', to: 'c3' },
      { text: 'No, I’m really not interested. Bye weirdo!', to: 'c6' },
    ],
  },
  c6: {
    beats: [
      { hesitate: 'quillbus' },
      { system: 'Quillbus Aldersley left the conversation' },
    ],
    end: { title: 'Greatness called and you hung up.', body: 'Play again to see if you can reach a different end.' },
  },
  c7: {
    beats: [
      { from: 'quillbus', text: 'You made it!' },
      { from: 'quillbus', image: 'img/node-sunflowers.jpg', effect: 'corrupt', id: 'node1', alt: 'Van Gogh’s Sunflowers, pixelated and streaked with coloured noise' },
      { from: 'quillbus', text: 'My word! The node here is corrupted. It must have been done by a digital anarchist known only as crisp-E.' },
      { from: 'quillbus', text: 'Don’t worry, they didn’t damage it beyond repair. Together, we can fix this piece and transmit it back home to me, where I can keep it safe.' },
      { from: 'quillbus', text: 'You’re going to need photos of your location to remove this horrible fuzziness, one of each of the specified colours if you can. Hurry, quickly now!' },
    ],
    action: { text: 'Decrypt image', target: 'node1', effect: 'restore', to: 'c8', alt: 'Van Gogh’s Sunflowers, restored' },
  },
  c8: {
    beats: [
      { from: 'quillbus', text: 'Success! It’s restored and in S.A.D.’s central server!' },
      { from: 'quillbus', text: 'Ah look at it. Just beautiful. Doesn’t it seem the spirit of art to you?' },
      { from: 'quillbus', text: 'Irreverent, yet dignified.' },
      { from: 'quillbus', text: 'It connects us to the unifying aspects of humanity through history…' },
      { from: 'quillbus', text: 'And to think, if that anarchist crisp-E had their way this piece would never have connected to our central server and would’ve been irrevocably damaged, changed beyond repair.' },
      { from: 'quillbus', text: 'This is why it’s crucial you aid me. We must foil crisp-E before they access other nodes across campus. If you move fast enough, you may be able to catch them in their vile, vandalistic acts and correct them before the originals are lost forever!' },
    ],
    choices: [
      { text: 'What’re we waiting for, let’s go!', to: 'c9' },
      { text: 'crisp-E sounds fun, I’d like to meet them', to: 'c10' },
    ],
  },
  c9: {
    beats: [
      { from: 'quillbus', text: 'Your enthusiasm is infectious!' },
      { from: 'quillbus', text: 'I think I’m going to let out a cheer…' },
      { from: 'quillbus', text: 'woohoo!' },
      { from: 'quillbus', text: 'In any case, the next node is close. I’ve sent the coordinates to your map!' },
    ],
    walk: { text: 'Head to the second node', place: 'The Quad', to: 'c11' },
  },
  c10: {
    beats: [
      { hesitate: 'quillbus' },
      { from: 'quillbus', text: 'Hm. That is troubling to hear you say…' },
      { from: 'quillbus', text: 'But I suppose, if you do meet them you’ll see that they are not ‘fun’ — they are in fact a brigand.' },
      { from: 'quillbus', text: 'In any case, the next node is close. I’ve sent the coordinates to your map!' },
    ],
    walk: { text: 'Head to the second node', place: 'The Quad', to: 'c11' },
  },
  c11: {
    beats: [
      { from: 'quillbus', text: 'Excellent. You’re almost at the next node, I’m rea–', cut: true },
      { glitch: 'hack' },
      { system: 'crisp-E hijacked this conversation' },
      { thread: 'crispe', scramble: true },
      { from: 'crispe', text: 'heeey send me a pic and i’ll draw you' },
      { from: 'crispe', text: 'what it’s the least i can do for my new biggest fan' },
      { from: 'crispe', text: 'nevermind i hacked your camera' },
      { from: 'crispe', text: 'here’s what you look like' },
      { from: 'crispe', image: 'img/node-scream.jpg', alt: 'Munch’s The Scream, sent as a drawing of you' },
    ],
    choices: [
      { text: 'Wow, you are a menace.', to: 'c12' },
      { text: 'Thanks, I guess?', to: 'c13' },
      { text: 'Your picture really captures my essence.', to: 'c14' },
    ],
  },
  c12: {
    beats: [
      { from: 'crispe', text: 'ya? Well you’re a NERD' },
      { from: 'crispe', text: 'sorry the caps were uncalled for' },
      { from: 'crispe', text: 'i mean you’re probably a nerd about something' },
      { from: 'crispe', text: 'we can infodump later' },
      { ref: 'bun' },
    ],
    choices: 'node',
  },
  c13: {
    beats: [
      { from: 'crispe', text: 'at least someone around here appreciates my genius' },
      { from: 'crispe', text: 'don’t worry i was kidding about the camera hack' },
      { from: 'crispe', text: 'or was i??? hehehhe' },
      { ref: 'bun' },
    ],
    choices: 'node',
  },
  c14: {
    beats: [
      { from: 'crispe', text: 'yeah thanks i was inspired' },
      { from: 'crispe', text: 'sorry for spying' },
      { from: 'crispe', text: 'just can’t help it when someone sends an assassin after me i wanna know about ‘em' },
      { from: 'crispe', text: 'guess i’m just an empath that way' },
      { ref: 'bun' },
    ],
    choices: 'node',
  },
  c15: {
    beats: [
      { from: 'crispe', text: 'profit??? that’s quill’s thing' },
      { from: 'crispe', text: 'i’m just here to remind everyone that nothing is sacred' },
      { ref: 'remix' },
    ],
    action: 'remix',
  },
  c16: {
    beats: [
      { from: 'crispe', text: 'oh quill? he does that' },
      { from: 'crispe', text: 'got like a tele-dom kink or somethin' },
      { ref: 'remix' },
    ],
    action: 'remix',
  },
  c17: {
    beats: [
      { from: 'crispe', text: 'lmao that’s hilarious!' },
      { from: 'crispe', text: 'so goofy he’s just tryin to recruit people off the street' },
      { ref: 'remix' },
    ],
    action: 'remix',
  },
  c18: {
    beats: [
      { from: 'crispe', text: 'YES' },
      { from: 'crispe', text: 'you can post it if you want' },
      { from: 'crispe', text: '#messwithQ' },
      { from: 'crispe', text: 'but listen buddy' },
      { from: 'crispe', text: 'quilllllby wants you to fix stuff so he can hide it away' },
      { from: 'crispe', text: 'until it becomes valuable by being rare' },
      { from: 'crispe', text: 'but you know that’s not how it works' },
      { from: 'crispe', text: 'stuff only costs money because we decide' },
      { from: 'crispe', text: 'and art is like air' },
      { from: 'crispe', text: 'we breathe it, we live it, everyone needs it' },
      { from: 'crispe', text: 'so why would you pretend it’s scarce' },
      { from: 'crispe', text: 'ya feel me?' },
    ],
    choices: [
      { text: 'Quillbus said you were an anarchist.', to: 'c19' },
      { text: 'I dunno...', to: 'c20' },
      { text: 'I feel you HARD!', to: 'c21' },
    ],
  },
  c19: {
    beats: [
      { from: 'crispe', text: 'ol’ quillbus said that about ME?? what an honor.' },
      { ref: 'faafo' },
    ],
    walk: 'library',
  },
  c20: {
    beats: [
      { from: 'crispe', text: 'ooooh so decisive' },
      { from: 'crispe', text: 'if you don’t stand for somethin you fall for anything dog' },
      { from: 'crispe', text: 'soons or lates you might gotta pick a side' },
      { ref: 'faafo' },
    ],
    walk: 'library',
  },
  c21: {
    beats: [
      { from: 'crispe', text: 'gross way to phrase that' },
      { from: 'crispe', text: 'but ‘preciate the sentiment' },
      { ref: 'faafo' },
    ],
    walk: 'library',
  },
  c22: {
    beats: [
      { system: 'No one is typing…' },
    ],
    end: { title: 'To be continued at the Library.', body: 'This prototype covers the first three locations of Operation COPY/WRITE.' },
  },
};

export const SHARED = {
  mission: [
    { from: 'quillbus', text: 'Now that you’re officially on board, let me reveal the full scope of your mission.' },
    { from: 'quillbus', text: 'There are nodes of art all around us, in the digital metaverse, currently stalled in physical locations on this very campus, kept from their final destination!' },
    { from: 'quillbus', text: 'My organisation, known as the Society for Art Demarcation, has been given the sacred task to collect these priceless pieces of original art, so they may connect to our network and live forever protected in our central server — to protect art’s status as a limited commodity for the good of artists and collectors alike!' },
    { from: 'quillbus', text: 'Otherwise, anarchists and vandals will corrupt the nodes, like tomato soup on canvas, blocking everyone from the experience of being awed by their original beauty.' },
    { from: 'quillbus', text: 'So, my new friend, I need you to go to the first location I’m sending to your device now. Once you’re there we can decrypt the first node and transfer it to the S.A.D. server.' },
  ],
  bun: [
    { from: 'crispe', text: 'okay for now let’s think outside the bun a little' },
    { from: 'crispe', text: 'you’re here for the artnode right???' },
  ],
  remix: [
    { from: 'crispe', text: 'anyway you can access the node but I didn’t do anything yet' },
    { from: 'crispe', image: 'img/node-kiss.jpg', id: 'node2', alt: 'Klimt’s The Kiss' },
    { from: 'crispe', text: '… can you do it for me??' },
    { from: 'crispe', text: 'come onnnnn it’ll be funnnnn' },
  ],
  faafo: [
    { from: 'crispe', text: 'okay, so' },
    { from: 'crispe', text: 'there’s more of these node things around campus' },
    { from: 'crispe', text: 'whatever you choose ya got me curious' },
    { from: 'crispe', text: 'you can either help me liberate more art, embrace the change' },
    { from: 'crispe', text: 'orrrrr you can be weak af and lock them away for quilly' },
    { from: 'crispe', text: 'here’s the location for the next one' },
    { from: 'crispe', text: 'Let’s f.a.a.f.o' },
  ],
};

export const SHARED_CHOICES = {
  node: [
    { text: 'That’s right. You’ll never profit from your vandalism!', to: 'c15' },
    { text: 'That other guy kinda made me come here.', to: 'c16' },
    { text: 'Maybe. Or maybe I’m messing with Quillbus…', to: 'c17' },
  ],
};

export const SHARED_ACTIONS = {
  remix: { text: 'Remix art piece', target: 'node2', editor: true, title: 'Remix · The Kiss', credit: 'The Kiss — Gustav Klimt, 1907–08', to: 'c18', alt: 'Your remix of Klimt’s The Kiss' },
};

export const SHARED_WALKS = {
  library: { text: HEAD_TO, place: 'The Library', to: 'c22' },
};
