// Photo library for the story chooser. The KEYS are fixed (variants reference them through ctx.photo / ctx.photoEl).
// Each entry is { url, credit, alt } or null. url must be a direct, hotlinkable image that is free to use
// (Unsplash licence or Wikimedia Commons CC BY / CC BY-SA / CC0 / public domain). No AI-generated images.
// credit is shown on the Credits page, so include photographer + source + licence, e.g. "Jane Doe / Wikimedia Commons, CC BY-SA 4.0".
// A null entry renders as a labelled placeholder, so variants work before photos arrive.
export const PHOTOS = {
  // Rooms: "Which room do you sleep in tonight?" (moody interiors, no people)
  'rooms.library': { // candlelit library with a ladder, warm light
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Library_Ladder%2C_Biltmore_House%2C_Biltmore_Estate%2C_Asheville%2C_NC_%2846728130021%29.jpg/1280px-Library_Ladder%2C_Biltmore_House%2C_Biltmore_Estate%2C_Asheville%2C_NC_%2846728130021%29.jpg',
    credit: 'Warren LeMay / Wikimedia Commons, CC0',
    alt: 'A curved wooden library ladder in front of tall shelves of leather-bound books.',
    page: 'https://commons.wikimedia.org/wiki/File:Library_Ladder,_Biltmore_House,_Biltmore_Estate,_Asheville,_NC_(46728130021).jpg',
  },
  'rooms.attic': { // attic room with a telescope or star charts, skylight
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Attic_bedroom.jpg/1280px-Attic_bedroom.jpg',
    credit: 'Ben Husmann / Wikimedia Commons, CC BY 2.0',
    alt: 'A timber attic bedroom with a glowing window, a desk and a spinning wheel.',
    page: 'https://commons.wikimedia.org/wiki/File:Attic_bedroom.jpg',
  },
  'rooms.greenhouse': { // overgrown greenhouse or conservatory, plants everywhere
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Westmount_Public_Library_by_Rodrigo_Tetsuo_Argenton_%2802%29.jpg/1280px-Westmount_Public_Library_by_Rodrigo_Tetsuo_Argenton_%2802%29.jpg',
    credit: 'Rodrigo Tetsuo Argenton / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A Victorian glass conservatory full of ferns and hanging baskets around a small pool.',
    page: 'https://commons.wikimedia.org/wiki/File:Westmount_Public_Library_by_Rodrigo_Tetsuo_Argenton_(02).jpg',
  },
  'rooms.cabin': { // ship's cabin or boat interior, brass and wood
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Cabin_of_the_Marine_Captain_%28USS_Constitution%29.jpg/1280px-Cabin_of_the_Marine_Captain_%28USS_Constitution%29.jpg',
    credit: 'Demetri Andriani / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A small ship cabin with a canvas hammock, a writing desk and a brass oil lamp.',
    page: 'https://commons.wikimedia.org/wiki/File:Cabin_of_the_Marine_Captain_(USS_Constitution).jpg',
  },
  'rooms.diner': { // diner booth under neon at night, empty
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Empire_Diner_Interior_%2850538852931%29.jpg/1280px-Empire_Diner_Interior_%2850538852931%29.jpg',
    credit: 'Eden, Janine and Jim / Wikimedia Commons, CC BY 2.0',
    alt: 'An empty diner at night with booths, counter stools and a red neon glow.',
    page: 'https://commons.wikimedia.org/wiki/File:Empire_Diner_Interior_(50538852931).jpg',
  },
  'rooms.kitchen': { // old castle or farmhouse kitchen with a fire going
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Open_fire_in_hearth_grate_at_The_Black_Horse_Inn%2C_Nuthurst%2C_West_Sussex.jpg/1280px-Open_fire_in_hearth_grate_at_The_Black_Horse_Inn%2C_Nuthurst%2C_West_Sussex.jpg',
    credit: 'Acabashi / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A log fire burning in an old iron grate inside a brick hearth.',
    page: 'https://commons.wikimedia.org/wiki/File:Open_fire_in_hearth_grate_at_The_Black_Horse_Inn,_Nuthurst,_West_Sussex.jpg',
  },

  // Doors: "Which door do you knock on?" (real street doors, no people, ideally Edmonton/Calgary-looking)
  'doors.red': { // red wooden door with brass knocker
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Ireland_Cashel_BW_2025-09-14_14-21-01.jpg/1280px-Ireland_Cashel_BW_2025-09-14_14-21-01.jpg',
    credit: 'Berthold Werner / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A glossy red panelled door with brass fittings under a white fanlight.',
    page: 'https://commons.wikimedia.org/wiki/File:Ireland_Cashel_BW_2025-09-14_14-21-01.jpg',
  },
  'doors.blue': { // peeling blue door, old paint
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kencot_distressed_cottage_door_West_Oxfordshire_England_01.jpg/1280px-Kencot_distressed_cottage_door_West_Oxfordshire_England_01.jpg',
    credit: 'Acabashi / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A weathered pale blue cottage door with peeling paint and iron hinges in a stone wall.',
    page: 'https://commons.wikimedia.org/wiki/File:Kencot_distressed_cottage_door_West_Oxfordshire_England_01.jpg',
  },
  'doors.arched': { // arched stone doorway, heavy door
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Castle_Hedingham%2C_St_Nicholas%27_Church%2C_Essex_England%2C_south_door.jpg/1280px-Castle_Hedingham%2C_St_Nicholas%27_Church%2C_Essex_England%2C_south_door.jpg',
    credit: 'Acabashi / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A heavy arched oak door with scrolled ironwork in a stone doorway.',
    page: 'https://commons.wikimedia.org/wiki/File:Castle_Hedingham,_St_Nicholas%27_Church,_Essex_England,_south_door.jpg',
  },
  'doors.black': { // glossy black door, lantern beside it
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/1694_Doorway%2C_Constitution_Hill%2C_Settle_%287705338436%29.jpg/1280px-1694_Doorway%2C_Constitution_Hill%2C_Settle_%287705338436%29.jpg',
    credit: 'Tim Green / Wikimedia Commons, CC BY 2.0',
    alt: 'A glossy black door with a lion knocker under a carved stone arch and hanging lantern.',
    page: 'https://commons.wikimedia.org/wiki/File:1694_Doorway,_Constitution_Hill,_Settle_(7705338436).jpg',
  },
  'doors.shop': { // small shop door with a bell, warm light inside
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Door%2C_Myrings_Sweet_Shop%2C_Fore_Street%2C_St_Ives%2C_Cornwall_-_January_2021.jpg/1280px-Door%2C_Myrings_Sweet_Shop%2C_Fore_Street%2C_St_Ives%2C_Cornwall_-_January_2021.jpg',
    credit: 'Mutney / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A narrow wooden sweet-shop door with a diamond window set in a granite wall.',
    page: 'https://commons.wikimedia.org/wiki/File:Door,_Myrings_Sweet_Shop,_Fore_Street,_St_Ives,_Cornwall_-_January_2021.jpg',
  },
  'doors.garden': { // green garden gate or door in an ivy wall
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Old_City%2C_Baku-_Part_III_-_OldCityBaku8325.jpg/1280px-Old_City%2C_Baku-_Part_III_-_OldCityBaku8325.jpg',
    credit: 'lumoplank / Wikimedia Commons, CC0',
    alt: 'A weathered green wooden door with brass fittings framed by ivy on a stone wall.',
    page: 'https://commons.wikimedia.org/wiki/File:Old_City,_Baku-_Part_III_-_OldCityBaku8325.jpg',
  },

  // Windows: "What is happening inside?" (lit windows at night, seen from the street)
  'windows.candle': { // single candlelit window at night
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Lumignons_fete_des_Lumieres_Lyon_8-12-2013.jpg/1280px-Lumignons_fete_des_Lumieres_Lyon_8-12-2013.jpg',
    credit: 'Myrabella / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'Small candles glowing on a windowsill at night beside a lantern and a lit window.',
    page: 'https://commons.wikimedia.org/wiki/File:Lumignons_fete_des_Lumieres_Lyon_8-12-2013.jpg',
  },
  'windows.neon': { // window with neon glow or a neon sign inside
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Laundromat_neon_sign.jpg/1280px-Laundromat_neon_sign.jpg',
    credit: 'Beyond My Ken / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A blue neon washing-machine sign glowing in a shop window.',
    page: 'https://commons.wikimedia.org/wiki/File:Laundromat_neon_sign.jpg',
  },
  'windows.curtain': { // warm window with a silhouette or curtains, night
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Llghtened_Windows_at_night_in_Paris.jpg/1280px-Llghtened_Windows_at_night_in_Paris.jpg',
    credit: 'Philippe Alès / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'Warmly lit apartment windows with curtains and bookshelves seen from the street at night.',
    page: 'https://commons.wikimedia.org/wiki/File:Llghtened_Windows_at_night_in_Paris.jpg',
  },
  'windows.attic': { // small attic or tower window lit at night
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Nour.jpg',
    credit: 'محمد بوعلام عصامي / Wikimedia Commons, CC BY-SA 3.0',
    alt: 'A single small window glowing in a dark wall at night.',
    page: 'https://commons.wikimedia.org/wiki/File:Nour.jpg',
  },

  // Deck: swipe like/pass images (atmospheric objects and places, no people)
  'deck.fog': { // foggy street or path
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Street_lamps_in_a_foggy_night%2C_Alameda_Dom_Afonso_Henriques%2C_Lisbon%2C_Portugal_julesvernex2.jpg/1280px-Street_lamps_in_a_foggy_night%2C_Alameda_Dom_Afonso_Henriques%2C_Lisbon%2C_Portugal_julesvernex2.jpg',
    credit: 'Jules Verne Times Two / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'Street lamps glowing through thick fog on a dark night.',
    page: 'https://commons.wikimedia.org/wiki/File:Street_lamps_in_a_foggy_night,_Alameda_Dom_Afonso_Henriques,_Lisbon,_Portugal_julesvernex2.jpg',
  },
  'deck.lantern': { // lantern glowing in the dark
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Lanterns_in_Ira_2.jpg',
    credit: 'Mehdi / Wikimedia Commons, CC BY-SA 3.0',
    alt: 'A kerosene lantern glowing on the ground in the dark.',
    page: 'https://commons.wikimedia.org/wiki/File:Lanterns_in_Ira_2.jpg',
  },
  'deck.clockwork': { // gears, clockwork, pocket watch
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Asian_6497_macro_%283389999521%29.jpg/1280px-Asian_6497_macro_%283389999521%29.jpg',
    credit: 'Guy Sie / Wikimedia Commons, CC BY-SA 2.0',
    alt: 'Close-up of the gears and jewels of a mechanical watch movement.',
    page: 'https://commons.wikimedia.org/wiki/File:Asian_6497_macro_(3389999521).jpg',
  },
  'deck.teacup': { // teacup and saucer, cosy
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/2026.09.02_Lichte_Porzellan_Tea_Cup%2C_Saucer_%26_Plate_05.jpg/1280px-2026.09.02_Lichte_Porzellan_Tea_Cup%2C_Saucer_%26_Plate_05.jpg',
    credit: 'Illarion Kalashnikov / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A vintage porcelain teacup and saucer painted with a leaping green hare.',
    page: 'https://commons.wikimedia.org/wiki/File:2026.09.02_Lichte_Porzellan_Tea_Cup,_Saucer_%26_Plate_05.jpg',
  },
  'deck.forest': { // forest path
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Autumn_in_a_misty_forest_%28Unsplash%29.jpg/1280px-Autumn_in_a_misty_forest_%28Unsplash%29.jpg',
    credit: 'Alessio Lin / Wikimedia Commons (via Unsplash), CC0',
    alt: 'A leaf-strewn path leading into a misty autumn forest.',
    page: 'https://commons.wikimedia.org/wiki/File:Autumn_in_a_misty_forest_(Unsplash).jpg',
  },
  'deck.chest': { // locked chest or old padlock
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Lancaster_Castle_-_padlock_in_Old_Cells_-_2022-12-30.jpg/1280px-Lancaster_Castle_-_padlock_in_Old_Cells_-_2022-12-30.jpg',
    credit: 'The wub / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'A rusted iron padlock with a brass key on an old cell door.',
    page: 'https://commons.wikimedia.org/wiki/File:Lancaster_Castle_-_padlock_in_Old_Cells_-_2022-12-30.jpg',
  },
  'deck.map': { // old map or compass
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Compass_Study_%284925267732%29.jpg/1280px-Compass_Study_%284925267732%29.jpg',
    credit: 'Calsidyrose / Wikimedia Commons, CC BY 2.0',
    alt: 'A brass pocket compass lying open on a vintage map.',
    page: 'https://commons.wikimedia.org/wiki/File:Compass_Study_(4925267732).jpg',
  },
  'deck.neon': { // neon sign at night
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Crescent_Palms_Motel_neon_sign_at_night%2C_New_Orleans.jpg/1280px-Crescent_Palms_Motel_neon_sign_at_night%2C_New_Orleans.jpg',
    credit: 'Stephen Kennedy / Wikimedia Commons, CC BY 2.0',
    alt: 'A glowing vintage motel neon sign against a black night sky.',
    page: 'https://commons.wikimedia.org/wiki/File:Crescent_Palms_Motel_neon_sign_at_night,_New_Orleans.jpg',
  },
  'deck.books': { // stack of old books
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Old_Books_01.JPG/1280px-Old_Books_01.JPG',
    credit: 'Ch. Maderthoner / Wikimedia Commons, CC0',
    alt: 'A stack of four old leather-bound books with marbled edges.',
    page: 'https://commons.wikimedia.org/wiki/File:Old_Books_01.JPG',
  },
  'deck.rain': { // rain on a city street at night
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/City_streets%3B_Reflections_on_the_street_surface_after_rain.jpg/1280px-City_streets%3B_Reflections_on_the_street_surface_after_rain.jpg',
    credit: 'Tarasna0922 / Wikimedia Commons, CC BY-SA 4.0',
    alt: 'Orange and blue street lights reflected on a wet road at night.',
    page: 'https://commons.wikimedia.org/wiki/File:City_streets;_Reflections_on_the_street_surface_after_rain.jpg',
  },
};
