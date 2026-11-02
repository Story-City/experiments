// Real Story City stories each walk leads into (public API, Nov 2026). The Summons and the Knight are
// the first-time sample stories; they're unlisted, so check with Brett that the app opens them by uuid.
export const STORIES = {
 "summons": {
  "uuid": "01a045aa-90bb-7626-8e4f-ebd48706d33f",
  "title": "The Summons",
  "genre": "Mystery",
  "cover": null,
  "chapter": "The Summons",
  "opening": "It’s an ordinary day just like any other. Except…you receive a text from an unknown number that simply says: “Look out your window.” Curiosity or naivety leading your steps, you approach your nearest street-facing window.",
  "teaser": "It’s an ordinary day just like any other. Except…you receive a text from an unknown number that simply says: “Look out your window.” Curiosity or naivety…"
 },
 "knight": {
  "uuid": "01a04abf-7b02-7ea0-85fb-1a62d40ae00b",
  "title": "A Knight Needs Your Help",
  "genre": "Fantasy",
  "cover": null,
  "chapter": "A knight needs your help",
  "opening": "You there, Adventurer! I’m hunting a dragon and I need your help, quickly now, head to the nearest street-facing window, and push the button below when you’re there.",
  "teaser": "You there, Adventurer! I’m hunting a dragon and I need your help, quickly now, head to the nearest street-facing window, and push the button below…"
 },
 "spy": {
  "uuid": "1f053a04-f335-61e6-aa20-2f370605f7f1",
  "title": "Spy Academy",
  "genre": "Action",
  "cover": "https://creator.storycity.app/media/685f116baec7d.jpg",
  "chapter": "Chapter 1",
  "opening": "Welcome recruit, my name is Agent Hansen. The spy academy you’ve applied for is so secret I can’t even tell you its name… yet. If you’re good enough, you’ll work it out. Maybe. You probably saw a jogger on your way here. That's Agent 96. If you didn't see her, even better. She is head of covert surveillance, after all. Before you can join, we need to see what you’re made of. It won’t be easy—most people fail.",
  "teaser": "Welcome recruit, my name is Agent Hansen. The spy academy you’ve applied for is so secret I can’t even tell you its name… yet."
 },
 "squeaky": {
  "uuid": "1f02f48e-e3ef-6258-b59f-a77f82de01c0",
  "title": "Have You Seen Squeaky?",
  "genre": "Adventure",
  "cover": "https://creator.storycity.app/media/68c1dda7c34a0_cover_update_v1_2000px.jpg",
  "chapter": "Have you seen Squeaky?",
  "opening": "Your pet has finally returned home after a day of solo adventuring. But why the long face? Their favorite toy Squeaky was lost along the way. Oh no! Go with your pet to retrace their steps.",
  "teaser": "Your pet has finally returned home after a day of solo adventuring. But why the long face? Their favorite toy Squeaky was lost along the way. Oh no!"
 },
 "fright": {
  "uuid": "1f076fc7-b371-696a-a758-67f8f40a226a",
  "title": "Frightnight Ghost Tours",
  "genre": "Paranormal Mystery",
  "cover": "https://creator.storycity.app/media/6a5a6da723abc_FRIGHTNIGHT_cover.png",
  "chapter": "Mural start",
  "opening": "Hey… can you hear me? Tap the button on the phone if you can hear me. Awesome! Welcome to the community rookie ghost explorer! I’m Fright, one of the Fright Night Community guides dedicated to helping you live-stream ghost tours, but with a twist! These tours aren’t just for thrills, together, we’ll be legit exorcising real ghosts from our world. First, set up.",
  "teaser": "Hey… can you hear me? Tap the button on the phone if you can hear me. Awesome! Welcome to the community rookie ghost explorer!"
 },
 "alice": {
  "uuid": "019f70ed-249a-7c1f-8711-cc11cec44cb6",
  "title": "Alice Through The Tear",
  "genre": "Adventure",
  "cover": "https://creator.storycity.app/media/6a62894196c54_alice_coverart.png",
  "chapter": "Chapter 1",
  "opening": "Has it been that long? Yes… Twenty years and eleventy-two unbirthdays since you fell tail-over-teakettle through the looking glass and back home: Where physics never takes a holiday and spice cakes don’t let you brush the clouds. Somewhere along your thousandth commute and millionth text, you almost forgot Wonderland entirely, when— All of a sudden, a flying, screaming book smacks you square in the face.",
  "teaser": "Has it been that long? Yes… Twenty years and eleventy-two unbirthdays since you fell tail-over-teakettle through the looking glass and back home:…"
 },
 "pirate": {
  "uuid": "1f05799c-ce93-6e46-9932-35a91e22360d",
  "title": "Pirate Captain",
  "genre": "Adventure",
  "cover": "https://creator.storycity.app/media/6917bf2074c9e_pirate_captain_cover_v2.png",
  "chapter": "Chapter 1",
  "opening": "Outwit rivals & gather crew in a race for treasure & glory!",
  "teaser": "Outwit rivals & gather crew in a race for treasure & glory!"
 },
 "cookout": {
  "uuid": "019f04e3-66df-7c9d-a082-487212efb9ba",
  "title": "The Unexpected Cookout",
  "genre": "Local History",
  "cover": "https://creator.storycity.app/media/6a5a773ecdb90_The Unexpected Cookout _cover.png",
  "chapter": "Chapter 1",
  "opening": "You look around this beautiful park and can’t help but smile. Today’s gonna be a good day. A ball bounces your way. You reach down…",
  "teaser": "You look around this beautiful park and can’t help but smile. Today’s gonna be a good day. A ball bounces your way. You reach down…"
 }
};

// walk id → [story, bridge line]
export const STORY_FOR = {
 "postcard": [
  "summons",
  "Liked noticing things? The Summons starts with one text: look out your window."
 ],
 "bingo": [
  "spy",
  "Sharp eyes like yours are exactly what Spy Academy is looking for."
 ],
 "pumpkin": [
  "fright",
  "You judged the jack-o'-lanterns. Frightnight would like you to meet their ghosts."
 ],
 "roulette": [
  "summons",
  "Liked not knowing the way? The Summons doesn't tell you either."
 ],
 "cat": [
  "squeaky",
  "Following animals suits you. Someone's pet has lost their favourite toy."
 ],
 "cursed": [
  "fright",
  "Good with lost ghosts? Frightnight Ghost Tours needs a rookie."
 ],
 "seance": [
  "summons",
  "Got the message? The Summons begins with a text from an unknown number."
 ],
 "fog": [
  "knight",
  "Good at finding hidden things? A knight has lost an invisible dragon."
 ],
 "haunted": [
  "fright",
  "Spotted the haunted side of your street? Frightnight sees it every night."
 ],
 "rainbow": [
  "alice",
  "Liked a world in full colour? Wonderland is spilling into your streets."
 ],
 "ransom": [
  "spy",
  "Cracked the secret word? A spy academy would like a word."
 ],
 "shapes": [
  "alice",
  "Made a creature from shapes? Wonderland has stranger ones loose nearby."
 ],
 "museum": [
  "alice",
  "Every object has a story. Alice's book has lost all of its words."
 ],
 "grumpy": [
  "squeaky",
  "Met the grumpy ones? In this story, the mailbox talks back."
 ],
 "safari": [
  "fright",
  "Loved the murals? Frightnight's ghost tour starts at one."
 ],
 "backwards": [
  "summons",
  "Noticed what you'd missed? The Summons starts on an ordinary day, just like this."
 ],
 "remix": [
  "cookout",
  "Liked your street remixed? The Unexpected Cookout drops you somewhere stranger."
 ],
 "coin": [
  "pirate",
  "Let a coin choose? Pirate Captain is after a whole chest of them."
 ],
 "steps": [
  "knight",
  "Every step counted. A knight needs a few more of them."
 ],
 "mood": [
  "knight",
  "Up for a little more? A knight needs help with an invisible dragon."
 ],
 "sound": [
  "summons",
  "Listening closely? The Summons starts with a sound from your phone."
 ],
 "haiku": [
  "alice",
  "Noticed the small things? Alice is looking for a book's missing words."
 ],
 "spookyQuest": [
  "fright",
  "That was a taste. Frightnight Ghost Tours runs the whole night."
 ],
 "quest": [
  "knight",
  "Got a few more minutes? A knight needs your help, quickly now."
 ]
};

export const STORY_WORDS = {
  kicker: 'Up next · a story',
  read: 'Read Chapter 1',
  bar: (title, pct) => `Your walk counted. Chapter 2 of ${title} is ${pct}% walked.`,
  keep: 'Keep Reading in Story City',
  note: 'In the app, this opens the story right here.',
  opens: 'Opens in the Story City app',
};
