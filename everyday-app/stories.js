// Story data for the everyday mockup. Titles, creators, hooks, blurbs, endings, cities and
// mode fits come from reports/everyday-app/stories.json (public story API + Notion, Nov 4).
// Guessed fields (accent, inter, recs, cold-open wording where noted, company/energy tags)
// are listed in docs/everyday-app.md. Accent = one story accent from the brand palette.
// modes: 'on' | 'off' | 'soon', with a tooltip key from OVERVIEW.modeOffTip.

export const STORIES = [
  { id: 'summons', together: true, access: 'Step-free: a streetlight and a mailbox, both on the sidewalk', best: 'path', title: 'The Summons', creator: 'Story City', cat: 'anywhere', genre: 'Mystery', age: 'PG',
    hook: 'A secret society has chosen you. Nobody told you why.', blurb: 'A wax-sealed letter waits under a streetlight with your name on it. Deliver it, and all will be revealed.',
    mins: [5, 15], chapters: 4, endings: 3, inter: 2, accent: '#FA7423', format: 'chat',
    modes: { walk: 'on', path: 'on', hunt: 'on' }, step: 'yes', km: 0.3, steps: 400, stops: 'a streetlight, a mailbox', bring: 'Nothing. Five minutes.',
    cold: ['It’s an ordinary day just like any other.', 'Except… a letter with a wax seal is waiting under the streetlight.', 'It has your name on it.'], coldNote: 'rewritten to lead with the letter (safety)',
    recs: ['incident', 'alice', 'knight', 'chase'], tags: ['mystery', 'short', 'solo'], free: true, sample: true, char: 'Wren' },

  { id: 'knight', access: 'Step-free; one stop is a park lawn', best: 'path', title: 'A Knight Needs Your Help', creator: 'Story City', cat: 'anywhere', genre: 'Fantasy', age: 'G',
    hook: 'A knight is stuck in the wrong century and needs a squire. You, apparently.', blurb: 'Sir Wendell is hunting an invisible dragon. It naps in the tallest tree and fears cats.',
    mins: [5, 15], chapters: 3, endings: 3, inter: 2, accent: '#BED13F', format: 'chat',
    modes: { walk: 'on', path: 'on', hunt: 'on' }, step: 'yes', km: 0.4, steps: 500, stops: 'a street corner, a park, the tallest tree', bring: 'A kid, if you have one.',
    cold: ['Halt! You there. Yes, you with the phone.', 'I am Sir Wendell, and I require a squire.'], coldNote: 'written for the mockup',
    recs: ['squeaky', 'alice', 'spy', 'summons'], tags: ['kids', 'short', 'funny'], free: true, sample: true, char: 'Sir Wendell' },

  { id: 'alice', town: true, title: 'Alice Through The Tear', creator: 'Natalie Merizalde, art by Miles Lett', cat: 'nearyou', needs: 'a park', genre: 'Fantasy', age: 'PG',
    hook: 'Follow the Rabbit. Find Alice. Save your City.', blurb: 'Wonderland is invading your city, and only you can stop it!',
    mins: [45, 60], chapters: 7, endings: 4, inter: 2, accent: '#ED54B3', format: 'audio', rating: [3.8, 62],
    modes: { walk: 'on', path: 'soon', hunt: 'off' }, offTip: { path: 'nopath', hunt: 'nohunt' }, step: 'yes', km: 1.6, steps: 2100,
    stops: 'picnic tables, a statue, a garden, a playground, water', bring: 'Headphones.',
    cold: ['Wonderland is invading your city, and only you can stop it!'],
    recs: ['knight', 'squeaky', 'omicron', 'chase'], tags: ['family', 'fantasy', 'park'], char: 'The White Rabbit' },

  { id: 'frightnight', best: 'hunt', title: 'Frightnight Ghost Tours', creator: 'Domini Gee and Emily Craven, illustrations by Victoria Ilnytska', cat: 'anywhere', genre: 'Spooky', age: 'PG',
    hook: 'Will you survive your first tour as a rookie exorcist?', blurb: 'One night, one hunt, one shot to prove yourself. And the ghosts won’t wait for you to get good.',
    mins: [50, 80], chapters: 8, endings: 2, inter: 3, accent: '#FF6050', format: 'audio', rating: [5.0, 13], seasonal: true,
    modes: { walk: 'on', path: 'on', hunt: 'on' }, step: 'yes', km: 1.2, steps: 1600, stops: 'a mural, an old building, a transit stop, a park', bring: 'Headphones. A friend, if you scare easily.',
    cold: ['Hey… can you hear me?', 'Tap the button on the phone if you can hear me.'],
    recs: ['tustin', 'incident', 'summons', 'omicron'], tags: ['spooky', 'friends', 'night'], together: true, char: 'Fright' },

  { id: 'incident', best: 'path', title: 'Tales from the Incident', creator: 'Story City Stories', cat: 'anywhere', genre: 'Urban fantasy mystery', age: '13+',
    hook: 'A seer, a detective, a fae—murder connects them all.', blurb: 'An episodic audio mystery. Six episodes; one walk each.',
    mins: [30, 45], chapters: 5, endings: 1, inter: 2, accent: '#9883F8', format: 'audio', rating: [5.0, 1],
    episodes: { count: 6, live: [1, 2, 3, 4] },
    modes: { walk: 'on', path: 'on', hunt: 'on' }, step: 'yes', km: 2.2, steps: 2900, stops: 'a park, a bench, a café, a transit stop', bring: 'Headphones.',
    cold: ['A seer, a detective, a fae.', 'Murder connects them all.'],
    recs: ['omicron', 'summons', 'chase', 'parable'], tags: ['mystery', 'long', 'solo'], char: 'Cye' },

  { id: 'squeaky', access: 'Step-free on most streets; every stop is an everyday object', best: 'hunt', title: 'Have You Seen Squeaky?', creator: 'Story City', cat: 'anywhere', genre: 'Family comedy', age: 'G',
    hook: 'One missing toy sparks an unforgettable neighborhood quest.', blurb: 'Your pet has finally returned home after a day of solo adventuring. But why the long face? Their favourite toy Squeaky was lost along the way.',
    mins: [30, 45], chapters: 5, endings: 2, inter: 3, accent: '#DEC523', format: 'audio', rating: [5.0, 9],
    modes: { walk: 'on', path: 'on', hunt: 'on' }, step: 'yes', km: 2.0, steps: 2650, stops: 'a mailbox, a fire hydrant, a playground slide', bring: 'A pet, real or imaginary.',
    cold: ['Your pet has finally returned home after a day of solo adventuring.', 'But why the long face?'],
    recs: ['knight', 'alice', 'spy', 'kindness'], tags: ['kids', 'funny', 'photos'], char: 'The Mailbox' },

  { id: 'spy', together: true, town: true, title: 'Spy Academy', creator: 'Nick Manning, art by Teddy Kaboom', cat: 'nearyou', needs: 'a café and some stairs', genre: 'Spy puzzles', age: 'G',
    hook: 'Do you have what it takes to join this elite spy organization?', blurb: 'A covert spy agency has recruited you to join its ranks—if you’re good enough.',
    mins: [45, 60], chapters: 7, endings: 2, inter: 3, accent: '#4CBFE9', format: 'hunt', rating: [5.0, 7],
    modes: { walk: 'on', path: 'on', hunt: 'on' }, step: 'partly', km: 0.9, steps: 1200, stops: 'street art, a café, a staircase, a lamppost', bring: 'A pen.',
    cold: ['A covert spy agency has recruited you.', 'If you’re good enough.'],
    recs: ['coronet', 'squeaky', 'pirate', 'dynasty'], tags: ['kids', 'puzzles'], char: 'Handler' },

  { id: 'pirate', town: true, best: 'hunt', title: 'Pirate Captain', creator: 'Jody McGregor, art by Gabriel Cunnett', cat: 'nearyou', needs: 'a park and a few shops', genre: 'Comedy fantasy', age: 'PG',
    hook: 'Outwit rivals, gather crew, race for treasure and glory.', blurb: 'So you fancy yourself a pirate, do you? Bold move for someone standing on dry land.',
    mins: [45, 60], chapters: 5, endings: 12, inter: 3, accent: '#00CBBF', format: 'hunt', rating: [4.3, 3],
    modes: { walk: 'on', path: 'on', hunt: 'on' }, step: 'partly', km: 1.1, steps: 1450, stops: 'a dock-ish spot, a shop, a park', bring: 'Your best pirate voice.',
    cold: ['So you fancy yourself a pirate, do you?', 'Bold move for someone standing on dry land.'],
    recs: ['spy', 'squeaky', 'adelaide', 'frightnight'], tags: ['funny', 'friends', 'photos'], char: 'The Quartermaster' },

  { id: 'barista', town: true, best: 'path', title: 'Tips From Your Barista', creator: 'Domini Gee, art by Nastassia Mihalicz', cat: 'nearyou', needs: 'a café', genre: 'Cosy fantasy', age: '13+',
    hook: 'A magical coffee shop has taken over—can you survive its secrets?', blurb: 'AKA, ways to survive your fae coffee shop experience.',
    mins: [15, 20], chapters: 1, endings: 23, inter: 1, accent: '#ED8D00', format: 'audio', rating: [5.0, 1], cafe: true, sit: true,
    episodes: { count: 6, live: [1, 2, 3, 4, 5, 6] },
    modes: { walk: 'off', path: 'on', hunt: 'on' }, offTip: { walk: 'none' }, step: 'no', km: 0.4, steps: 500, stops: 'one café per episode', bring: 'A coffee order you can defend.',
    cold: ['AKA, ways to survive your fae coffee shop experience.'],
    recs: ['incident', 'laundromat', 'alice', 'summons'], tags: ['sit', 'short', 'cosy', 'date'], char: 'Your Barista' },

  { id: 'laundromat', access: 'Step-free: no walking at all', title: 'Dictators Laundromat', creator: 'Human Rights Foundation', cat: 'anywhere', genre: 'Satire, non-fiction', age: '13+',
    hook: 'Welcome to the laundromat, where you discover how dirty money spins clean.', blurb: 'Wanna learn how to launder money?',
    mins: [20, 30], chapters: 4, endings: 4, inter: 1, accent: '#93DC5E', format: 'text', rating: [4.7, 25], sit: true, free: true,
    modes: { walk: 'off', path: 'off', hunt: 'off' }, offTip: { walk: 'none', path: 'none', hunt: 'none' }, step: 'no', km: 0, steps: 0, stops: 'none — start at a laundromat or your own laundry', bring: 'A chair.',
    cold: ['Wanna learn how to launder money?'],
    recs: ['barista', 'summons', 'adelaide', 'incident'], tags: ['sit', 'learn'], char: 'The Attendant' },

  { id: 'omicron', best: 'hunt', title: 'The Omicron', creator: 'Isobelle Carmody', cat: 'anywhere', genre: 'Epic fantasy', age: 'G',
    hook: 'Can you hear me? Good. You are in great danger…', blurb: 'One to one and three-quarter hours, 2.5–5 km, 27 ways through and 5 endings.',
    mins: [60, 105], chapters: 5, endings: 5, inter: 3, accent: '#58B0F6', format: 'audio',
    modes: { walk: 'on', path: 'on', hunt: 'on' }, step: 'yes', km: 3.5, steps: 4700, stops: 'a radio mast, a big church, a park', bring: 'Headphones and an afternoon.',
    cold: ['Can you hear me? Good.', 'You are in great danger…'],
    recs: ['incident', 'alice', 'chase', 'frightnight'], tags: ['long', 'fantasy', 'steps'], char: 'The Voice' },

  { id: 'coronet', together: true, start: 'the Legislature fountain', access: 'Some stairs; a step-free way round the grounds', title: 'The Coronet Caper', creator: 'Celia Taylor', cat: 'local', city: 'Edmonton', place: 'the Legislature grounds', genre: 'Comedy heist', age: 'G',
    hook: 'Prove your heist chops—decode clues to recover the Coronet.', blurb: 'You’ve been invited to join a team of master criminals—but they’re not sure you have what it takes.',
    mins: [45, 60], chapters: 7, endings: 4, inter: 3, accent: '#DA82ED', format: 'hunt', rating: [4.8, 12],
    modes: { walk: 'off', path: 'on', hunt: 'on' }, offTip: { walk: 'local' }, step: 'no', km: 1.1, steps: 1450, stops: 'the Legislature grounds, 7 stops', bring: 'A pencil. Youth and adult tracks.',
    cold: ['You’ve been invited to join a team of master criminals.', 'They’re not sure you have what it takes.'],
    recs: ['dragons', 'spy', 'dynasty', 'adelaide'], tags: ['puzzles', 'kids', 'friends'], char: 'The Mastermind', where: { Edmonton: 9 } },

  { id: 'dragons', start: 'the Chinese Garden gate', access: 'Step-free garden paths · benches throughout', best: 'hunt', title: 'Dragons in the Park Scavenger Hunt', creator: 'CTC Storytelling Centre', cat: 'local', city: 'Edmonton', place: 'Louise McKinney Park', genre: 'Cultural history hunt', age: 'G',
    hook: 'Find the dragons living in Louise McKinney Park', blurb: 'Seventeen dragon landmarks in the Edmonton Chinese Garden. Free.',
    mins: [50, 50], chapters: 17, endings: 1, inter: 3, accent: '#35C6D7', format: 'hunt', rating: [4.8, 19], free: true,
    modes: { walk: 'off', path: 'on', hunt: 'on' }, offTip: { walk: 'local' }, step: 'partly', km: 1.7, steps: 2250, stops: '17 dragons in one park', bring: 'Sharp eyes.',
    cold: ['Find the dragons living in Louise McKinney Park.'],
    recs: ['coronet', 'kindness', 'cnoy', 'squeaky'], tags: ['kids', 'history', 'photos'], char: 'The Guide', where: { Edmonton: 14 } },

  { id: 'parable', start: 'Olympic Plaza', title: 'The Calgary Parable', creator: 'Angelica Ng, art by Rose Enns', cat: 'local', city: 'Calgary', place: 'Olympic Plaza', genre: 'Sci-fi choices', age: 'PG',
    hook: 'An unknown caller & strange alien demands—will you obey or resist?', blurb: '“Earthly inhabitant. I need your help.”',
    mins: [30, 60], chapters: 5, endings: 6, inter: 2, accent: '#5BD380', format: 'audio', rating: [4.8, 6],
    modes: { walk: 'off', path: 'on', hunt: 'on' }, offTip: { walk: 'local' }, step: 'no', km: 1.0, steps: 1300, stops: 'Olympic Plaza to Calgary Tower', bring: 'Headphones.',
    cold: ['“Earthly inhabitant.', 'I need your help.”'],
    recs: ['chase', 'incident', 'omicron', 'adelaide'], tags: ['mystery', 'scifi'], char: 'The Caller', where: { Calgary: 11 } },

  { id: 'chase', start: 'Eau Claire (or your door)', title: 'Chase', creator: 'Kevin Weir, art by Sofiya Iurkevych', cat: 'passport', city: 'Calgary', genre: 'Urban fantasy', age: 'PG',
    hook: 'Pursue the creature & unveil the hidden world beneath Calgary.', blurb: 'Originally created for Downtown Calgary, you can now enter the crisis from your own city.',
    mins: [45, 60], chapters: 6, endings: 9, inter: 2, accent: '#58B0F6', format: 'audio', rating: [4.8, 6], free: true,
    modes: { walk: 'on', path: 'off', hunt: 'off' }, offTip: { path: 'passport', hunt: 'passport' }, step: 'yes', km: 1.3, steps: 1700, stops: 'Eau Claire, Prince’s Island Park, the Bow River path', bring: 'Headphones.',
    cold: ['Something is moving near Eau Claire.', 'It saw you first.'], coldNote: 'written for the mockup',
    recs: ['parable', 'adelaide', 'incident', 'omicron'], tags: ['fantasy', 'steps'], char: 'The Creature' },

  { id: 'adelaide', start: 'Adelaide Town Hall (or your door)', title: 'The Adelaide Time Travel Caper', creator: 'Ben Crisp, art by Gabriel Cunnett', cat: 'passport', city: 'Adelaide', genre: 'History, time travel', age: 'G',
    hook: 'A broken time machine & a mad professor throw you through history.', blurb: 'You knew it was a bad idea helping the Professor with his experiment—a hunk-of-junk time machine that’s now sending you through Adelaide’s crazy history!',
    mins: [30, 45], chapters: 4, endings: 8, inter: 2, accent: '#ED8D00', format: 'audio', rating: [4.2, 5],
    modes: { walk: 'on', path: 'off', hunt: 'off' }, offTip: { path: 'passport', hunt: 'passport' }, step: 'yes', km: 1.0, steps: 1300, stops: 'Adelaide Town Hall and 3 more, laid over your streets', bring: 'Headphones.',
    cold: ['You knew it was a bad idea helping the Professor with his experiment.'],
    recs: ['chase', 'cookout', 'coronet', 'knight'], tags: ['history', 'funny', 'steps'], char: 'The Professor' },

  { id: 'cookout', town: true, best: 'path', title: 'The Unexpected Cookout', creator: 'Tamara Angela, art by The Junkyard Chef', cat: 'passport', city: 'Atlanta', genre: 'Fantasy riddles', age: 'PG',
    hook: 'A mystical cookout. An alternative Atlanta. Solve the riddles to return home!', blurb: 'You’ve accidentally gone through a portal to a strange realm hosting a mystical cookout. Can you build your plate, pass the puzzle gauntlet, and return home?',
    mins: [30, 45], chapters: 5, endings: 1, inter: 3, accent: '#FA7423', format: 'hunt', rating: [3.0, 1], free: true,
    modes: { walk: 'on', path: 'on', hunt: 'on' }, step: 'partly', km: 0.4, steps: 550, stops: 'a playground, a grill, a gazebo — in your own park', bring: 'A snack. A picnic is better.',
    cold: ['You’ve accidentally gone through a portal to a strange realm hosting a mystical cookout.'],
    recs: ['adelaide', 'pirate', 'kindness', 'squeaky'], tags: ['puzzles', 'friends', 'park'], char: 'The Pitmaster' },

  { id: 'kindness', start: 'the Queen Elizabeth Park entrance', access: 'Step-free park paths · benches at most stops', title: 'Kindness Walk Edmonton', creator: 'Story City with Global Dignity Canada', cat: 'local', city: 'Edmonton', place: 'Queen Elizabeth Park', genre: 'Community', age: 'G',
    hook: 'Five stops, countless smiles—spread kindness through your community.', blurb: 'Celebrate Canadian kindness with a walk that helps you bring kindness to your community.',
    mins: [30, 30], chapters: 5, endings: 1, inter: 1, accent: '#BED13F', format: 'text', rating: [5.0, 4],
    modes: { walk: 'off', path: 'on', hunt: 'on' }, offTip: { walk: 'local' }, step: 'partly', km: 0.95, steps: 1250, stops: '5 kindness stops in one park', bring: 'Nothing but a good mood.',
    cold: ['Five stops. Countless smiles.'],
    recs: ['dragons', 'squeaky', 'cnoy', 'knight'], tags: ['kids', 'gentle', 'short'], char: 'Your Guide', where: { Edmonton: 18 } },

  { id: 'tustin', start: 'Old Town Tustin', title: 'The Tustin Tiller Tormentor', creator: 'With the City of Tustin, California', cat: 'local', city: 'Tustin, California', place: 'Old Town Tustin', genre: 'Halloween ghost story', age: '13+',
    hook: 'Every town has its ghosts — but in Tustin, one never left the fields.', blurb: 'Will you run into the thing that Haunts Tiller Days?',
    mins: [45, 80], chapters: 6, endings: 1, inter: 2, accent: '#FF6050', format: 'audio', rating: [5.0, 1], seasonal: true,
    modes: { walk: 'off', path: 'on', hunt: 'on' }, offTip: { walk: 'local' }, step: 'no', km: 4.8, steps: 6400, stops: 'Old Town Tustin, 6 stops', bring: 'A flashlight.',
    cold: ['Every town has its ghosts.', 'But in Tustin, one never left the fields.'],
    recs: ['frightnight', 'incident', 'omicron', 'adelaide'], tags: ['spooky', 'history'], char: 'The Tormentor' },

  { id: 'dynasty', start: 'Churchill Square', title: 'Dynasty Duel', creator: 'Nick Manning, art by Teddy Kaboom', cat: 'local', city: 'Edmonton', place: 'downtown Edmonton', genre: 'Party mystery game', age: 'G',
    hook: 'Two feuding families. One massive payout. Watch your back, because the fight is on!', blurb: 'Pick your family, pick your character, and race across Edmonton to beat your rival family. Play as 1, 2 or 4 players.',
    mins: [60, 60], chapters: 6, endings: 7, inter: 3, accent: '#ED54B3', format: 'hunt', together: true, players: '1, 2 or 4 players',
    modes: { walk: 'off', path: 'on', hunt: 'on' }, offTip: { walk: 'local' }, step: 'no', km: 1.0, steps: 1300, stops: '6 stops per character, downtown', bring: 'Your rivals.',
    cold: ['Two feuding families.', 'One massive payout.'],
    recs: ['coronet', 'spy', 'pirate', 'frightnight'], tags: ['friends', 'party', 'puzzles'], char: 'Grandma Smith', where: { Edmonton: 7 } },

  { id: 'cnoy', start: 'Whyte Avenue', access: 'Step-free sidewalks · some curbs', title: 'CNOY – Social Issues Walk', creator: 'The Mustard Seed', cat: 'local', city: 'Edmonton', place: 'Old Strathcona', genre: 'Non-fiction', age: 'G',
    hook: 'Bundle up and hear stories of homelessness, hope, and change.', blurb: 'The same Strathcona walk in two lengths: 2 km or 5 km. Donate what you can.',
    mins: [30, 90], chapters: 5, endings: 1, inter: 1, accent: '#35C6D7', format: 'audio', lengths: ['2 km · 30 min', '5 km · 60–90 min'],
    modes: { walk: 'off', path: 'on', hunt: 'off' }, offTip: { walk: 'local', hunt: 'nohunt' }, step: 'no', km: 2.0, steps: 2650, stops: 'Strathcona, 5 or 8 stops', bring: 'A warm coat.',
    cold: ['Bundle up and hear stories of homelessness, hope, and change.'],
    recs: ['kindness', 'dragons', 'laundromat', 'coronet'], tags: ['learn', 'gentle'], char: 'Your Guide', where: { Edmonton: 6 } },

  { id: 'balthazar', title: 'The Balthazar Job', creator: 'Kevin · DiceCreamSandwich', cat: 'anywhere', coming: 'Nov 12', creatorStory: true,
    hook: '', blurb: '', genre: 'Creator adventure', age: '', mins: null, chapters: null, endings: null, accent: '#DA82ED',
    modes: { walk: 'soon', path: 'soon', hunt: 'soon' }, offTip: { walk: 'soon', path: 'soon', hunt: 'soon' }, step: 'unknown', cold: [], recs: [], tags: [] },
];

export const byId = Object.fromEntries(STORIES.map((s) => [s.id, s]));

// Have You Seen Squeaky? chapters for the in-story demo. Lines paraphrase the real chapter
// text from the public story API (Stop #3: Fire Hydrant, Playground Slide). Biscuit stands in for @pet_name.
export const SQUEAKY = {
  pet: 'Biscuit',
  chapters: {
    1: {
      title: 'Have you seen Squeaky?', place: 'your door', thing: 'your front door',
      lines: [
        { who: 'narr', t: 'Biscuit has finally come home after a day of solo adventuring. But why the long face?' },
        { who: 'narr', t: 'Their favourite toy, Squeaky, was lost along the way. Time to retrace their steps.' },
        { who: 'char', name: 'Biscuit', t: 'Woof.' },
      ],
      choices: ['Retrace Their Steps'],
      next: 2,
    },
    2: {
      title: 'The mailbox', place: 'the mailbox', thing: 'a mailbox',
      lines: [
        { who: 'narr', t: 'Biscuit loves getting mail. The mailbox on the corner might know something.' },
        { who: 'me', t: 'Hi! Have you seen Squeaky?', choice: true },
        { who: 'char', name: 'The Mailbox', t: 'I’m sorry, do I know you? It’s been so long since anyone visited. No one sends letters anymore.' },
        { who: 'char', name: 'The Mailbox', t: 'Wait. You used to be smaller, didn’t you? Your pet went by earlier, squeaking all the way. Ask the fire hydrant.' },
      ],
      choices: ['To the Fire Hydrant'],
      next: 3,
    },
    3: {
      title: 'The fire hydrant', place: 'the fire hydrant', thing: 'a fire hydrant',
      lines: [
        { who: 'narr', t: 'Biscuit sniffs the hydrant on the corner. Then sniffs again. A trail!' },
        { who: 'me', t: 'Hi! Have you seen Squeaky?', choice: true },
        { who: 'char', name: 'Fire Hydrant', t: 'Oh, hello! Well aren’t you just the cutest thing!' },
        { who: 'char', name: 'Fire Hydrant', t: 'Yes, of course I remember your dear, sweet pet and its adorable squeaky toy. They were the highlight of my day!' },
        { who: 'rain', name: 'Fire Hydrant', t: 'And rain! Everyone else runs inside. I finally get some peace.' },
        { who: 'char', name: 'Fire Hydrant', t: 'Trotting and squeaking along in harmony. Then — oh, it’s too sad — they headed for the playground.' },
      ],
      choices: ['To the Playground', 'Ask About the Toy'],
      next: 4,
    },
    4: {
      title: 'The playground slide', place: 'the playground', thing: 'a playground slide',
      lines: [
        { who: 'narr', t: 'The slide gleams. It looks very pleased with itself.' },
        { who: 'me', t: 'Hi! Have you seen Squeaky?', choice: true },
        { who: 'char', name: 'Playground Slide', t: 'Well, well, well. What brings a unicorn like you to the whitewater rapids?' },
        { who: 'char', name: 'Playground Slide', t: 'A squeaky toy? Hmm. Something squeaked past here at top speed. Try the big tree.' },
      ],
      choices: ['To the Big Tree'],
      next: 5,
    },
    5: {
      title: 'The big tree', place: 'the big tree', thing: 'the tallest tree',
      lines: [
        { who: 'narr', t: 'High in the branches, something small and very round squeaks in the wind.' },
        { who: 'char', name: 'Biscuit', t: 'Woof!' },
        { who: 'narr', t: 'Squeaky. Found. Biscuit has never looked prouder.' },
      ],
      choices: ['Bring Squeaky Home'],
      next: null,
      ending: { name: 'Squeaky Found', of: 2, n: 1 },
    },
  },
};

// Previously On… recaps (Tasha). Frightnight lines paraphrase the real opening beats.
export const PREVIOUSLY = {
  frightnight: {
    chapter: 3, of: 8, place: 'the school',
    lines: [
      { who: 'char', name: 'Fright', t: 'Hey… rookie. You still there?' },
      { who: 'narr', t: 'You set up your first ghost-tour stream at the mural. The old building’s ghost turned out to be a gentle one.' },
      { who: 'char', name: 'Fright', t: 'Next stop: the school. The janitor’s been waiting a long time. Ready?' },
    ],
  },
  squeaky: {
    chapter: 3, of: 5, place: 'the fire hydrant',
    lines: [
      { who: 'narr', t: 'Biscuit came home without Squeaky.' },
      { who: 'char', name: 'The Mailbox', t: 'I remember you. You used to be smaller. Your pet went by here, squeaking.' },
      { who: 'narr', t: 'Next: the fire hydrant on the corner. It might know more.' },
    ],
  },
};

// Pretend people and places for the map (fictional; never real addresses).
export const PLACES = {
  Edmonton: { hood: 'Garneau', streets: ['Whyte Ave', '87 Ave', '109 St', '111 St', 'Saskatchewan Dr'], frontier: '84 Avenue', river: true },
  Calgary: { hood: 'Kensington', streets: ['Kensington Rd', '10 St NW', '5 Ave NW', 'Memorial Dr', '14 St NW'], frontier: '3 Avenue NW', river: true },
  Winnipeg: { hood: 'Wolseley', streets: ['Wolseley Ave', 'Lenore St', 'Westminster Ave', 'Ruby St', 'Arlington St'], frontier: 'Ruby Street', river: true },
  Camrose: { hood: 'Range Road 203', streets: ['Range Rd 203', 'Twp Rd 470', 'the lane'], frontier: 'the north lane', rural: true },
  Lagos: { hood: 'Yaba', streets: ['Herbert Macaulay Way', 'Commercial Ave', 'Montgomery Rd', 'Akoka Rd'], frontier: 'Montgomery Road' },
};

// Real cover art from the public story API (coverArt), saved as covers/<id>.jpg on Nov 4.
// true = the title is painted into the art (coverIncludesTitle), so the card doesn't repeat it.
// The Summons, A Knight Needs Your Help and The Balthazar Job have no cover yet.
export const COVERS = { alice: true, frightnight: true, incident: true, squeaky: true, spy: true, pirate: true, barista: true, laundromat: true, omicron: true, cookout: true,
  coronet: false, dragons: false, parable: false, chase: false, adelaide: false, kindness: false, tustin: false, dynasty: false, cnoy: false };
