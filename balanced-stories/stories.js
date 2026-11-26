// Real chapter text, pictures and choices from the public Story City API (api.storycity.app), fetched 25 Nov 2026.
// Script lines ("NAME: text") become character bubbles; long passages are split into 1–2 sentence lines.
//   who: narrator (centred, no bubble) | figure (left bubble, name above)
export const STORIES = [
 {
  "key": "incident",
  "short": "Incident",
  "title": "Tales from the Incident",
  "kind": "Graphic novel",
  "chapters": [
   {
    "img": "https://creator.storycity.app/media/6a83490836b76_Cafe%20Intro%20-%206.jpg",
    "audio": "https://creator.storycity.app/media/6ae8c982a507d_StoryCity_Tales_intro-a-Update_20261030_Master%20REV%20(1).mp3",
    "lines": [
     {
      "who": "narrator",
      "html": "Welcome to Tales from the Incident."
     },
     {
      "who": "narrator",
      "html": "Every street has a story. Most people just walk past them."
     },
     {
      "who": "narrator",
      "html": "You won’t."
     },
     {
      "who": "narrator",
      "html": "When you hear (Notification SFX), the case needs your attention, check the app for your next step in this mystery."
     },
     {
      "who": "narrator",
      "html": "If a button isn’t clickable you may be required to move to the next featured location to unlock the next piece of this mystery."
     },
     {
      "who": "narrator",
      "html": "When you hear (SFX walking alert), it’s time to head to the next location."
     },
     {
      "who": "narrator",
      "html": "Check the map in the Story City app to see where the story goes next."
     }
    ],
    "prompt": "Continue when you're ready.",
    "options": [
     "Carry on"
    ],
    "pick": 0
   },
   {
    "img": "https://creator.storycity.app/media/6a83496774278_Cafe%20Intro%20-%204.jpg",
    "audio": "https://creator.storycity.app/media/6a7dfc12afc2e_StoryCity_Tales_Intro-b_20260714_WebMaster.mp3",
    "lines": [
     {
      "who": "narrator",
      "html": "Sometimes the case opens up side files."
     },
     {
      "who": "narrator",
      "html": "Look for the Codex buttons at the end of each episode. These are rabbit holes into the deeper lore of this world."
     },
     {
      "who": "narrator",
      "html": "Look for blue links in the chapters, you can tap on these to open reminders on characters or lore."
     },
     {
      "who": "narrator",
      "html": "Follow them if you’re curious. The truth tends to hide in the details."
     }
    ],
    "prompt": null,
    "options": [
     "Carry on"
    ],
    "pick": 0
   },
   {
    "img": "https://creator.storycity.app/media/6a83497b7e478_Cafe%20Intro%20-%205.jpg",
    "audio": "https://creator.storycity.app/media/6a7dfcabb348c_StoryCity_Tales_Intro-d_20260714_WebMaster.mp3",
    "lines": [
     {
      "who": "narrator",
      "html": "One last thing before we begin. You can experience this story two ways:"
     },
     {
      "who": "narrator",
      "html": "Narrative Mode - Chapters contain one continuous audio with fewer interruptions so you can keep your phone in your pocket longer as you roam."
     },
     {
      "who": "narrator",
      "html": "Great for podcast or audio book fans. OR"
     },
     {
      "who": "narrator",
      "html": "Interactive Mode - Interact with the story to earn badges; each badge is a clue to what really happened. Expect 2–3 check-ins per chapter, breaking up longer scenes."
     },
     {
      "who": "narrator",
      "html": "Perfect if you like to gamify your world."
     },
     {
      "who": "narrator",
      "html": "It all leads to the same truth."
     }
    ],
    "prompt": "How do you want to hear it?",
    "options": [
     "Narrative Mode",
     "Interactive Mode"
    ],
    "pick": 1
   },
   {
    "img": "https://creator.storycity.app/media/6a83498e29680_Cafe%20Intro%20-%201.jpg",
    "audio": "https://creator.storycity.app/media/6a7dfe06bc97d_StoryCity_Tales_Intro-e_20260714_WebMaster.mp3",
    "lines": [
     {
      "who": "narrator",
      "html": "This particular mystery begins at your local cafe…"
     },
     {
      "who": "narrator",
      "html": "If you’re in step count mode, dive in."
     },
     {
      "who": "narrator",
      "html": "If you’re in location mode, push the button below when you’ve arrived at your local cafe, perhaps with your beverage of choice."
     }
    ],
    "prompt": null,
    "options": [
     "I'm ready to begin"
    ],
    "pick": 0
   },
   {
    "img": "https://creator.storycity.app/media/6a7f89cfe626f_FIFarron%20and%20Nyam.jpg",
    "audio": "https://creator.storycity.app/media/6a7dfeda2a918_StoryCity_Tales_Loc1-1a_20260714_WebMaster.mp3",
    "lines": [
     {
      "who": "narrator",
      "html": "The Capital of Laresveila, a city with more magic history than it would like to admit."
     },
     {
      "who": "narrator",
      "html": "A commuter stuffs themselves into a crystal-powered propulsor tram, firing a suspicious look at the unhoused Fae in the alley outside."
     },
     {
      "who": "narrator",
      "html": "A man slides a cursed letter through the crack in the door, hoping the witch who made it didn’t hold back."
     },
     {
      "who": "narrator",
      "html": "A vitriolic aircast cries the dangers of Portal Park, still wild and overgrown despite being cleaved from the Fae realms during the Severing 20 years ago."
     },
     {
      "who": "narrator",
      "html": "Resentment seeps from the cracks in the pavement; this town is a cracked mirror, one bad day from shattering."
     },
     {
      "who": "narrator",
      "html": "Few feel it teetering more than <span info=\"Farron comes from a family of oracles, who bared high status in their home country of Moerway but are reviled in their new one. The family changed their name to Augustine from Augurine, a reference to their family profession, augury. Farron and his sibling Thea were smuggled as kids out of Moerway during a coup and were encouraged to lay low and get normal jobs, which Farron ignored, instead opting to practise the family craft as an unlicensed seer.\">Farron Augustine</span>, an illegal seer who gives unsanctioned readings to souls desperate enough to pay."
     },
     {
      "who": "narrator",
      "html": "He works out of the Pick-You-Up café, wreathed in the scent of their mood-enhancing brews, his usual table adorned with the exotic trappings the locals expect."
     },
     {
      "who": "narrator",
      "html": "Most notably the filigreed porcelain teacups, hand-painted by his family back in Moerway, with a delicate pot to match. Farron pours a fragrant brew for his sour-faced guest."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "My friend, I can only help you if you take the ritual seriously."
     },
     {
      "who": "narrator",
      "html": "Ever since this customer stepped into the coffee shop and they locked eyes, a sense of unease swept away Farron’s good humour."
     },
     {
      "who": "narrator",
      "html": "The joys of being a seer; so in tune with fate you can make money off the future, so in tune you can ruin your whole day and never know why."
     },
     {
      "who": "narrator",
      "html": "All you can hope is to feel your way out of fate."
     },
     {
      "who": "figure",
      "name": "Niyam",
      "html": "Yes, yes, turn the cup."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "Clockwise. Careful, keep it in the saucer – otherwise they won’t settle right."
     },
     {
      "who": "figure",
      "name": "Niyam",
      "html": "I want that real Moerway reading, you get me? No grifter bullshit."
     },
     {
      "who": "narrator",
      "html": "Hmm. A little insensitive to discount Farron’s years of practice, but Farron just gives him a wry smile."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "Now take the last sip, <span info=\"Niyam is a regular customer of Farron, and yet, as he’s prone to anger, he always get upset when he doesn’t hear what he wants.\">Niyam</span>."
     },
     {
      "who": "narrator",
      "html": "Finally he does it."
     },
     {
      "who": "narrator",
      "html": "Farron considers giving him a portent of doom for fun – but a passing protester in the street outside reminds him what happens to seers who don’t satisfy."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "Let me take a look… hmm…"
     },
     {
      "who": "figure",
      "name": "Niyam",
      "html": "(grumbles)"
     },
     {
      "who": "narrator",
      "html": "Damn it, of all the times for a cloudy reading. That clump could be a cloud, or an axe?"
     },
     {
      "who": "narrator",
      "html": "Farron could spin a yarn so Niyam’ll leave smiling, but the man asked for the real deal. Farron reaches for his symbol cards."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "(sighing) … Listen, buddy."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "I promise I wouldn’t do this if I didn’t have to."
     },
     {
      "who": "figure",
      "name": "Niyam",
      "html": "Send that shit to the Fae Realms! You want me to pay more for your rottin’ seer lies?"
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "I’m not running an illegal underground charity here, Niyam."
     },
     {
      "who": "figure",
      "name": "Niyam",
      "html": "Fine."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "Thank you."
     }
    ],
    "prompt": null,
    "options": [
     "Flip the cards"
    ],
    "pick": 0
   },
   {
    "img": "https://creator.storycity.app/media/6a7f8a1165eee_1-1b%201.png",
    "audio": "https://creator.storycity.app/media/6a7e0e9501f3c_StoryCity_Tales_Loc1-1b_20260714_WebMaster.mp3",
    "lines": [
     {
      "who": "figure",
      "name": "Farron",
      "html": "(flipping the first card) Oh."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "(flipping the second card) Hmm...."
     },
     {
      "who": "narrator",
      "html": "…So much for sending him home smiling."
     },
     {
      "who": "figure",
      "name": "Niyam",
      "html": "There’s fire on that one."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "Niyam Renashandran, soon you will lose all you have. Let it be known this is no one’s fault but your own."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "Take no fe-"
     },
     {
      "who": "figure",
      "name": "Niyam",
      "html": "Screw you!"
     },
     {
      "who": "figure",
      "name": "Lerato",
      "html": "Woah hey! That’s enough!"
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "haha-whoa!"
     },
     {
      "who": "narrator",
      "html": "The man’s face contorts into a grim rictus as he hefts our young seer by his collar."
     },
     {
      "who": "figure",
      "name": "Niyam",
      "html": "I’m not the only one tired of your kind, your empty promises to protect us while you fuck with the future behind our backs. Laresveila won’t ever forget."
     },
     {
      "who": "figure",
      "name": "Lerato",
      "html": "Enjoy your ban, buddy. Don’t EVER come back here…"
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "Easy, easy."
     },
     {
      "who": "figure",
      "name": "Lerato",
      "html": "Are you okay?"
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "<span info=\"Lerato Limone works as a coffee witch at the Pick-You-Up Café. She helps Farron hide his seer business out of friendship and a deep unrequited love.\">Lerato</span>, I’m fine. I’ll clean this up, and then – agh, I’m supposed to meet <span info=\"Thea (short for Orothea), like their older brother Farron, comes from a family of oracles. However, Thea holds resentment and a bitterness about their gift, wishing they could live a normal life.\">Thea</span> in the park."
     },
     {
      "who": "figure",
      "name": "Farron",
      "html": "Could I grab a tea to go?"
     },
     {
      "who": "figure",
      "name": "Lerato",
      "html": "Sure. You know, it’s about time for my break anyway."
     },
     {
      "who": "figure",
      "name": "Lerato",
      "html": "Why don’t I walk with you?"
     },
     {
      "who": "narrator",
      "html": "Lerato tosses her apron behind the counter, and offers Farron a large to-go cup of tea."
     }
    ],
    "prompt": null,
    "options": [
     "Grab the tea from Lerato"
    ],
    "pick": 0
   }
  ]
 },
 {
  "key": "laundromat",
  "short": "Laundromat",
  "title": "Dictators Laundromat",
  "kind": "Narrated",
  "chapters": [
   {
    "img": "https://creator.storycity.app/media/69151e955a10e_CH1a_welcome_Just%20logo.jpg",
    "audio": "https://storycity.app/media/6917b37895404_The%20Dictator's%20Laundromat.wav",
    "lines": [
     {
      "who": "narrator",
      "html": "Hey future tyrant!"
     },
     {
      "who": "narrator",
      "html": "Welcome to <span info=\"\" src=\"https://storycity.app/media/691512edc6d4e_CH1a_welcome.jpg\">The Dictator’s Laundromat</span>, where we clean money, not clothes."
     },
     {
      "who": "narrator",
      "html": "We at the <a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://hrf.org/about-us/\">Human Rights Foundation</a> figured: if you've got some free time (doing laundry), you might as well learn how the world’s dirtiest dictators wash their cash, polish their image, and scrub their crimes clean."
     },
     {
      "who": "narrator",
      "html": "So sit down, channel your inner despot, and see how many Dictator Dollars you can launder before the rinse cycle ends."
     },
     {
      "who": "narrator",
      "html": "The amount you earn, and the control you keep over your people, is dependent on how well you pay attention."
     },
     {
      "who": "narrator",
      "html": "Remember: image is everything, even when you’re terrible."
     },
     {
      "who": "narrator",
      "html": "Load, spin, profit."
     }
    ],
    "prompt": null,
    "options": [
     "Yes, I'm ready!"
    ],
    "pick": 0
   },
   {
    "img": "https://creator.storycity.app/media/690fcdd7492a6_Laundromat_Hub1.jpg",
    "audio": "https://storycity.app/media/6917b3bb3961c_CH%201b%20-%20HUB%201.wav",
    "lines": [
     {
      "who": "narrator",
      "html": "What is Kleptocracy?"
     },
     {
      "who": "narrator",
      "html": "Congratulations, Supreme Leader! You’ve seized power and, shockingly, refuse to give it up."
     },
     {
      "who": "narrator",
      "html": "But tyranny isn’t cheap. You’ll need a mountain of cash to fund your palaces, propaganda, and very convincing elections."
     },
     {
      "who": "narrator",
      "html": "Luckily, <span info=\"Kleptocracy, also referred to as thievocracy, is a government whose corrupt leaders use political power to expropriate the wealth of the people and land they govern, typically by embezzling or misappropriating government funds at the expense of the wider population.\">kleptocracy</span> is here to help!"
     },
     {
      "who": "narrator",
      "html": "“Kleptocracy” literally means “rule of thieves” — but it can also mean any government in which the ruling leaders steal from the populace, lining their own pockets."
     },
     {
      "who": "narrator",
      "html": "Choose any of the gleaming options below to start laundering your money and your reputation."
     },
     {
      "who": "narrator",
      "html": "Each path offers shady opportunities to spin your dirty deeds into perfectly clean, perfectly legal Dictator Dollars."
     },
     {
      "who": "narrator",
      "html": "Because what’s absolute power without making gobs of money along the way?"
     },
     {
      "who": "narrator",
      "html": "When you think your offshore empire is big enough, hit the CASH OUT button for one final rinse."
     },
     {
      "who": "narrator",
      "html": "Your total Dictator Dollars will reveal your official rank in the hierarchy of corruption. Will you be a mere Despicable Despot… or a full-blown Platinum Tyrant?"
     }
    ],
    "prompt": "How will you launder your money?",
    "options": [
     "Hire lobbyists",
     "Create a shell company",
     "Buy a sports team",
     "CASH OUT"
    ],
    "pick": 3
   },
   {
    "img": "https://creator.storycity.app/media/690fd11bd6a5a_Change%20reputation.jpg",
    "audio": "https://storycity.app/media/6917b7b95fc36_CH%208a%20-%20QUIZ%20INTRO.wav",
    "lines": [
     {
      "who": "narrator",
      "html": "Congratulations on amassing your collection of Dictator Dollars! You're now one of many dictators who frequent the laundromat to scrub their dirty money clean."
     },
     {
      "who": "narrator",
      "html": "Like any good dictator, we know you're obsessed with your reputation and how you rank as one of the world's most dastardly leaders, but before we give you your rank, we're going to test your knowledge and give you a final opportunity to earn some last Dictator Dollars!"
     }
    ],
    "prompt": "Are you ready for the Dictator Test?",
    "options": [
     "VIP laundromat unlocked!",
     "VIP laundromat unlocked!",
     "Bring it on!"
    ],
    "pick": 0
   },
   {
    "img": "https://creator.storycity.app/media/6914f7a3e1077_CH1c_Hub2.jpg",
    "audio": "https://storycity.app/media/6917b3dd244f2_CH%201c%20-%20HUB%202.wav",
    "lines": [
     {
      "who": "narrator",
      "html": "Oh ho, big moves!"
     },
     {
      "who": "narrator",
      "html": "You’ve graduated from petty graft to boutique <span info=\"Kleptocracy, also referred to as thievocracy, is a government whose corrupt leaders use political power to expropriate the wealth of the people and land they govern, typically by embezzling or misappropriating government funds at the expense of the wider population.\">kleptocracy</span> and hit the jackpot of corruption to open this secret VIP laundromat. Velvet rope, gold detergent, it’s got everything."
     },
     {
      "who": "narrator",
      "html": "New pathways unlocked means new opportunities to make your cash perfectly clean."
     },
     {
      "who": "narrator",
      "html": "Spin more schemes, flip more properties, and watch your Dictator Dollars pile up."
     },
     {
      "who": "narrator",
      "html": "When you’re feeling flush, hit CASH OUT and we’ll slap a shiny title on your crimes; a ranking that tells the world (quietly) how good you are at getting away with it."
     },
     {
      "who": "narrator",
      "html": "Fortune favors the corrupt."
     }
    ],
    "prompt": "How will you launder your money?",
    "options": [
     "Invest via a private firm",
     "Buy real estate",
     "Expand your art collection",
     "CASH OUT"
    ],
    "pick": 0
   },
   {
    "img": "https://creator.storycity.app/media/6914fc2437951_CH5a_Private%20Firms.jpg",
    "audio": "https://storycity.app/media/6917b591ed451_CH%205a%20-%20PRIVATE%20FIRMS.wav",
    "lines": [
     {
      "who": "narrator",
      "html": "Are you a dictator looking to grow your pile of looted wealth?"
     },
     {
      "who": "narrator",
      "html": "Cycle 1: Identify a Firm"
     },
     {
      "who": "narrator",
      "html": "Private equity, hedge funds, and venture capital firms have no money laundering checks, and many are happy to work with despots."
     },
     {
      "who": "narrator",
      "html": "Cycle 2: Invest"
     },
     {
      "who": "narrator",
      "html": "The firm will take your money and invest in anything profitable. Ride-share services, video games, gyms, hospitals—anything you want!"
     },
     {
      "who": "narrator",
      "html": "Cycle 3: Profit!"
     },
     {
      "who": "narrator",
      "html": "Watch your money grow and grow, multiplying all that looted wealth into the stratosphere—and <span info=\"One of the beauties of private equity, hedge funds, and venture capital is that you can use these investments to invest in almost any other industry you want. \n\nAfter all, what industry isn't receiving funds from private equity, hedge funds, or venture capital? You can invest in media outlets. You can invest in social media platforms. You can invest in restaurants. You can invest almost anywhere.\n\nAll of it helps hide your money. All of it comes without any money-laundering checks. And all of it is profitable. Ka-ching!\">corrupting other industries along the way.</span>"
     }
    ],
    "prompt": "How will you invest your dirty money?",
    "options": [
     "Invest in ride share services",
     "Invest in video games",
     "Invest in gyms",
     "Invest in hospitals",
     "Launder money a different way"
    ],
    "pick": 0
   },
   {
    "img": "https://creator.storycity.app/media/691e169e2e3bd_CH5b_ride%20shares.jpg",
    "audio": "https://storycity.app/media/6917b5a64a76d_CH%205b%20-%20Invest%20in%20ride%20share%20services.wav",
    "lines": [
     {
      "who": "narrator",
      "html": "You invest in ride share services."
     },
     {
      "who": "narrator",
      "html": "For the money that you're dealing with, it's a pretty small industry, only costing you around $50,000, but everyone's gotta start somewhere right?"
     },
     {
      "who": "narrator",
      "html": "And this adds 2 more Dictator Dollars to the pot, win-win!"
     },
     {
      "who": "narrator",
      "html": "--- Receipt 🧾 ---"
     },
     {
      "who": "narrator",
      "html": "<span info=\"The total amount of money made before subtracting what was originally invested.\">Gross Return:</span> $1,000,000"
     },
     {
      "who": "narrator",
      "html": "<span info=\"The amount of profit left after subtracting the original investment.\n\nIn this case the original investment is $50,000.\">Net Return:</span> $950,000"
     },
     {
      "who": "narrator",
      "html": "<span info=\"ROI shows how much you earned compared to how much you invested, written as a percentage. \n\nIt’s calculated by dividing the Net Return (your profit) by the Amount Invested.\n\nExample: ROI = Net Return ÷ Amount Invested.\">ROI:</span> 1900%"
     }
    ],
    "prompt": null,
    "options": [
     "Launder more money"
    ],
    "pick": 0
   }
  ]
 }
];
