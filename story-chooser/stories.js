// Story set + scoring engine for the story chooser. Every variant scores against these same tags,
// so the Instagram versions and the app versions are interchangeable skins.
//
// TOKENS is the whole vocabulary. An answer in any variant adds points to some of these tokens
// (e.g. picking the candlelit library adds { cozy: 2, mystery: 1, night: 1, solo: 1 }).
// score(weights) returns every story ranked by how many of its tags you weighted.
//
// pop is a placeholder popularity rank (FTUE stories first) until Andrew's numbers replace it.
// vibe places a story on the chart: creepy 0 (cosy) → 10 (creepy), serious 0 (silly) → 10 (serious).
// Covers hotlink from creator.storycity.app (Story City's own assets). The two FTUE stories have no cover yet.
// Generated from the public API on 2026-10-30; tags, blurbs and vibes are hand-written.

export const TOKENS = {
  "mood": [
    "cozy",
    "eerie",
    "playful",
    "epic",
    "tender",
    "mysterious",
    "funny",
    "thoughtful"
  ],
  "genre": [
    "mystery",
    "fantasy",
    "scifi",
    "romance",
    "comedy",
    "history",
    "spooky",
    "adventure",
    "art",
    "heist"
  ],
  "length": [
    "quick",
    "medium",
    "long"
  ],
  "where": [
    "downtown",
    "park",
    "cafe",
    "anywhere",
    "neighbourhood"
  ],
  "company": [
    "solo",
    "kids",
    "friends",
    "date"
  ],
  "time": [
    "day",
    "night"
  ],
  "energy": [
    "calm",
    "lively"
  ],
  "mode": [
    "walk",
    "pin",
    "hunt"
  ]
};

export const STORIES = [
  {
    "id": "summons",
    "name": "The Summons",
    "blurb": "A secret society has chosen you. Nobody told you why.",
    "minutes": 15,
    "where": "anywhere",
    "mode": "walk",
    "age": "PG",
    "genre": "Mystery",
    "universal": true,
    "cover": null,
    "pop": 100,
    "vibe": {
      "creepy": 6,
      "serious": 6
    },
    "tags": [
      "mysterious",
      "eerie",
      "mystery",
      "quick",
      "anywhere",
      "solo",
      "night",
      "calm",
      "walk"
    ],
    "note": "FTUE sample story, not yet in the public API"
  },
  {
    "id": "knight",
    "name": "The Knight's Quest",
    "blurb": "A knight is stuck in the wrong century and needs a squire. You, apparently.",
    "minutes": 15,
    "where": "anywhere",
    "mode": "walk",
    "age": "G",
    "genre": "Adventure",
    "universal": true,
    "cover": null,
    "pop": 95,
    "vibe": {
      "creepy": 1,
      "serious": 2
    },
    "tags": [
      "playful",
      "epic",
      "fantasy",
      "adventure",
      "quick",
      "anywhere",
      "kids",
      "day",
      "lively",
      "walk"
    ],
    "note": "FTUE sample story, not yet in the public API"
  },
  {
    "id": "alice",
    "name": "Alice Through The Tear",
    "blurb": "Wonderland is leaking into your city. Follow the Rabbit, find Alice, save the place you live.",
    "minutes": 45,
    "where": "anywhere",
    "mode": "walk",
    "age": "PG",
    "genre": "Adventure",
    "universal": true,
    "cover": "https://creator.storycity.app/media/6a62894196c54_alice_coverart.png",
    "pop": 90,
    "vibe": {
      "creepy": 3,
      "serious": 3
    },
    "tags": [
      "playful",
      "fantasy",
      "adventure",
      "medium",
      "anywhere",
      "kids",
      "friends",
      "day",
      "lively",
      "walk"
    ]
  },
  {
    "id": "barista",
    "name": "Tips From Your Barista",
    "blurb": "Your local café is run by the fae. Here is how to survive your order.",
    "minutes": 90,
    "where": "a café",
    "mode": "pin",
    "age": "13+",
    "genre": "Urban Fantasy",
    "universal": true,
    "cover": "https://creator.storycity.app/media/6a5a3f434b0ff_Tips%20From%20Your%20Barista_cover.png",
    "pop": 70,
    "vibe": {
      "creepy": 3,
      "serious": 2
    },
    "tags": [
      "cozy",
      "funny",
      "fantasy",
      "comedy",
      "long",
      "cafe",
      "solo",
      "date",
      "day",
      "calm",
      "pin"
    ]
  },
  {
    "id": "omicron",
    "name": "The Omicron",
    "blurb": "Can you hear me? Good. You are in great danger.",
    "minutes": 90,
    "where": "anywhere",
    "mode": "walk",
    "age": "G",
    "genre": "Dystopia",
    "universal": true,
    "cover": "https://creator.storycity.app/media/6a57a042efec4_Omicron_cover.png",
    "pop": 60,
    "vibe": {
      "creepy": 8,
      "serious": 8
    },
    "tags": [
      "eerie",
      "epic",
      "scifi",
      "long",
      "anywhere",
      "solo",
      "night",
      "lively",
      "walk"
    ]
  },
  {
    "id": "spring",
    "name": "Spring",
    "blurb": "The river can hear the thoughts of everyone in Edmonton. Only you can hear it back.",
    "minutes": 60,
    "where": "the river valley",
    "mode": "walk",
    "age": "PG",
    "genre": "Fantasy",
    "universal": false,
    "cover": "https://creator.storycity.app/media/62ec0e8adae60_Emily_Craven_-_Story_City_two_men_in_love_sitting_on_a_tree_swi_1ca212b0-3713-4268-8611-e9e2d7475b8f.png",
    "pop": 55,
    "vibe": {
      "creepy": 2,
      "serious": 8
    },
    "tags": [
      "tender",
      "thoughtful",
      "fantasy",
      "romance",
      "long",
      "park",
      "solo",
      "date",
      "day",
      "calm",
      "walk"
    ]
  },
  {
    "id": "murder",
    "name": "Murder on the River Valley",
    "blurb": "You are a journalist at a protest when a body turns up. Find the killer before the killer finds you.",
    "minutes": 45,
    "where": "the Legislature grounds",
    "mode": "pin",
    "age": "M 15+",
    "genre": "Crime",
    "universal": false,
    "cover": "https://creator.storycity.app/media/62e9fff22d1e5_Murder%20on%20RV%201.png",
    "pop": 50,
    "vibe": {
      "creepy": 8,
      "serious": 9
    },
    "tags": [
      "mysterious",
      "eerie",
      "mystery",
      "medium",
      "park",
      "downtown",
      "solo",
      "friends",
      "night",
      "lively",
      "pin"
    ]
  },
  {
    "id": "jubilee",
    "name": "The Case of the Garden Jubilee",
    "blurb": "Sherlock Holmes needs a hand. Winnie-the-Pooh has vanished from the garden party.",
    "minutes": 30,
    "where": "a park",
    "mode": "walk",
    "age": "PG",
    "genre": "Mystery",
    "universal": false,
    "cover": "https://creator.storycity.app/media/62bde1be12bd8_3426007_custom-079a57231468334d7e3dddf0079573805fd02a28-s1100-c50.jpg",
    "pop": 65,
    "vibe": {
      "creepy": 1,
      "serious": 3
    },
    "tags": [
      "cozy",
      "playful",
      "mystery",
      "quick",
      "park",
      "kids",
      "friends",
      "day",
      "calm",
      "walk"
    ]
  },
  {
    "id": "heartbreak",
    "name": "Heartbreak Speedrun",
    "blurb": "Nine dates. Three suitors. One broken heart. This is the run.",
    "minutes": 45,
    "where": "downtown",
    "mode": "walk",
    "age": "M 15+",
    "genre": "Romance",
    "universal": false,
    "cover": "https://creator.storycity.app/media/6670ba9b90ff5_Oohay_Image.jpg",
    "pop": 48,
    "vibe": {
      "creepy": 1,
      "serious": 4
    },
    "tags": [
      "funny",
      "tender",
      "romance",
      "comedy",
      "medium",
      "downtown",
      "date",
      "friends",
      "night",
      "lively",
      "walk"
    ]
  },
  {
    "id": "netaverse",
    "name": "A Hole in the Netaverse",
    "blurb": "Edmonton has a cyberpunk backup, and it is corrupting. Get in and restore it before it is gone.",
    "minutes": 75,
    "where": "downtown",
    "mode": "hunt",
    "age": "PG",
    "genre": "Sci-Fi",
    "universal": false,
    "cover": "https://creator.storycity.app/media/62ec2aaced39d_Emily_Craven_-_Story_City_flickering_AR_hologram_overlay_of_dys_00d898e8-1148-4105-af91-a2a3acc3a03a.png",
    "pop": 45,
    "vibe": {
      "creepy": 6,
      "serious": 7
    },
    "tags": [
      "epic",
      "mysterious",
      "scifi",
      "long",
      "downtown",
      "solo",
      "friends",
      "night",
      "lively",
      "hunt"
    ]
  },
  {
    "id": "seeing",
    "name": "Seeing Beyond",
    "blurb": "A voice is calling from a piece of public art. Someone is trapped inside it.",
    "minutes": 45,
    "where": "a downtown park",
    "mode": "pin",
    "age": "13+",
    "genre": "Fantasy",
    "universal": false,
    "cover": "https://creator.storycity.app/media/66540b97f071b_cw-2-bearvhills-2.jpg",
    "pop": 42,
    "vibe": {
      "creepy": 5,
      "serious": 7
    },
    "tags": [
      "mysterious",
      "thoughtful",
      "fantasy",
      "art",
      "medium",
      "park",
      "downtown",
      "solo",
      "day",
      "calm",
      "pin"
    ]
  },
  {
    "id": "coronet",
    "name": "The Coronet Caper",
    "blurb": "A crew of master criminals is not sure you have what it takes. Pull off the heist and prove them wrong.",
    "minutes": 45,
    "where": "downtown",
    "mode": "hunt",
    "age": "G",
    "genre": "Crime",
    "universal": false,
    "cover": "https://creator.storycity.app/media/62ecc85add419_cover.jpg",
    "pop": 58,
    "vibe": {
      "creepy": 2,
      "serious": 3
    },
    "tags": [
      "playful",
      "funny",
      "heist",
      "adventure",
      "medium",
      "downtown",
      "kids",
      "friends",
      "day",
      "lively",
      "hunt"
    ]
  },
  {
    "id": "woglins",
    "name": "Woglins and Wozzips",
    "blurb": "Weird little things are loose around the Legislature, and it is entirely your fault.",
    "minutes": 45,
    "where": "the Legislature grounds",
    "mode": "walk",
    "age": "PG",
    "genre": "Fantasy",
    "universal": false,
    "cover": "https://creator.storycity.app/media/62e98d904d349_WWCover.jpg",
    "pop": 52,
    "vibe": {
      "creepy": 2,
      "serious": 1
    },
    "tags": [
      "playful",
      "funny",
      "fantasy",
      "comedy",
      "medium",
      "park",
      "kids",
      "day",
      "lively",
      "walk"
    ]
  },
  {
    "id": "frightnight",
    "name": "Frightnight Ghost Tours",
    "blurb": "First night on the job as a rookie exorcist. Try to survive the tour.",
    "minutes": 60,
    "where": "anywhere",
    "mode": "walk",
    "age": "PG",
    "genre": "Paranormal Mystery",
    "universal": true,
    "cover": "https://creator.storycity.app/media/6a5a6da723abc_FRIGHTNIGHT_cover.png",
    "pop": 62,
    "vibe": {
      "creepy": 9,
      "serious": 4
    },
    "tags": [
      "eerie",
      "spooky",
      "mystery",
      "long",
      "anywhere",
      "friends",
      "night",
      "lively",
      "walk"
    ]
  },
  {
    "id": "powerplay",
    "name": "Power Play",
    "blurb": "A hockey star has been murdered. Detective Timely needs you to travel through time and fix the timeline.",
    "minutes": 50,
    "where": "downtown",
    "mode": "pin",
    "age": "13+",
    "genre": "Mystery",
    "universal": false,
    "cover": "https://creator.storycity.app/media/68279f706ca3c_ES1.png",
    "pop": 47,
    "vibe": {
      "creepy": 3,
      "serious": 3
    },
    "tags": [
      "funny",
      "mysterious",
      "mystery",
      "history",
      "medium",
      "downtown",
      "friends",
      "day",
      "lively",
      "pin"
    ]
  },
  {
    "id": "chase",
    "name": "Chase",
    "blurb": "Something is running through Calgary that should not exist. Follow it under the city.",
    "minutes": 60,
    "where": "downtown Calgary",
    "mode": "walk",
    "age": "PG",
    "genre": "Fantasy",
    "universal": false,
    "cover": "https://creator.storycity.app/media/6660cd1007d6e_small%20-%20k9.png",
    "pop": 44,
    "vibe": {
      "creepy": 7,
      "serious": 7
    },
    "tags": [
      "epic",
      "eerie",
      "fantasy",
      "adventure",
      "long",
      "downtown",
      "solo",
      "night",
      "lively",
      "walk"
    ]
  },
  {
    "id": "squeaky",
    "name": "Have You Seen Squeaky?",
    "blurb": "Your pet came home without Squeaky. Retrace the day and find the lost toy.",
    "minutes": 45,
    "where": "anywhere",
    "mode": "walk",
    "age": "G",
    "genre": "Adventure",
    "universal": true,
    "cover": "https://creator.storycity.app/media/68c1dda7c34a0_cover_update_v1_2000px.jpg",
    "pop": 57,
    "vibe": {
      "creepy": 0,
      "serious": 1
    },
    "tags": [
      "cozy",
      "playful",
      "adventure",
      "medium",
      "anywhere",
      "neighbourhood",
      "kids",
      "day",
      "calm",
      "walk"
    ]
  },
  {
    "id": "loveyeg",
    "name": "How to Love Edmonton, A Self Help Guide",
    "blurb": "A walking tour to help you fall in love with Edmonton. Again.",
    "minutes": 60,
    "where": "downtown",
    "mode": "walk",
    "age": "G",
    "genre": "Comedy",
    "universal": false,
    "cover": "https://creator.storycity.app/media/66009ddc05af5_story%20city%20cover.png",
    "pop": 40,
    "vibe": {
      "creepy": 1,
      "serious": 5
    },
    "tags": [
      "funny",
      "thoughtful",
      "comedy",
      "history",
      "long",
      "downtown",
      "solo",
      "date",
      "day",
      "calm",
      "walk"
    ]
  },
  {
    "id": "parable",
    "name": "The Calgary Parable",
    "blurb": "A call from an unknown number, with a list of demands. Obey, or find out what happens if you don’t.",
    "minutes": 60,
    "where": "downtown Calgary",
    "mode": "pin",
    "age": "PG",
    "genre": "Sci-Fi",
    "universal": false,
    "cover": "https://creator.storycity.app/media/65f843795709a_Adobe_Express_20240318_0736070_1.png",
    "pop": 43,
    "vibe": {
      "creepy": 7,
      "serious": 8
    },
    "tags": [
      "eerie",
      "mysterious",
      "scifi",
      "long",
      "downtown",
      "solo",
      "night",
      "lively",
      "pin"
    ]
  },
  {
    "id": "incident",
    "name": "Tales from the Incident",
    "blurb": "A seer, a detective and a fae. One murder connects all three.",
    "minutes": 45,
    "where": "anywhere",
    "mode": "walk",
    "age": "13+",
    "genre": "Fantasy",
    "universal": true,
    "cover": "https://creator.storycity.app/media/6a9079bce0f3c_TALES_COVERARTv4.png",
    "pop": 46,
    "vibe": {
      "creepy": 6,
      "serious": 7
    },
    "tags": [
      "mysterious",
      "eerie",
      "fantasy",
      "mystery",
      "medium",
      "anywhere",
      "solo",
      "night",
      "calm",
      "walk"
    ]
  }
];

// weights: { token: points }. Returns [{ story, points, matched }] best first. Ties go to the more popular story.
export function score(weights = {}, stories = STORIES) {
  return stories.map(story => {
    let points = 0; const matched = [];
    for (const t of story.tags) if (weights[t]) { points += weights[t]; matched.push(t); }
    return { story, points, matched };
  }).sort((a, b) => (b.points - a.points) || (b.story.pop - a.story.pop));
}

export const byId = (id) => STORIES.find(s => s.id === id);
