/** Location Gems hub — LOCATION-GEMS-HUB-v49 */
const SPOOF_COLLECTED_GEM_ID = 'spoof-collected-gem-prototype';
const SPOOF_COLLECTED_GEM_AUTHOR = 'RiverWalker';
const PROTOTYPE_GEM_IMAGE = 'assets/prototype-gem.webp';
const MY_USER = '@you';

/** Same faceted gem as daily-side-quests map pins — StoryCity design, not AI */
const GEM_OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE = 'M9 7.5H15L12 20.5Z';
const GEM_FACETS = 'M9 7.5L12 20.5L15 7.5M1.5 7.5H22.5';
const GEM_STROKE = 1.5;
const GEM_FACET_STROKE = 1;
/** Softer outline when the gem renders large (rails, likes card, empty). */
const GEM_STROKE_SOFT = 0.7;
const GEM_FACET_STROKE_SOFT = 0.45;
const GEM_OUTLINE_OPACITY_SOFT = 0.42;
const GEM_FACET_OPACITY_SOFT = 0.32;
/** Same fav heart path as app outline — stroke matches gem icons on tabs */
const HEART_PATH =
  'M15.0007 10.0002C16.2423 8.7835 17.5007 7.32516 17.5007 5.41683C17.5007 4.20125 17.0178 3.03547 16.1582 2.17592C15.2987 1.31638 14.1329 0.833496 12.9173 0.833496C11.4507 0.833496 10.4173 1.25016 9.16732 2.50016C7.91732 1.25016 6.88398 0.833496 5.41732 0.833496C4.20174 0.833496 3.03595 1.31638 2.17641 2.17592C1.31687 3.03547 0.833984 4.20125 0.833984 5.41683C0.833984 7.3335 2.08398 8.79183 3.33398 10.0002L9.16732 15.8335L15.0007 10.0002Z';
const LIKE_PINK_HOT = '#ff7aab';

const PUBLIC_GEM_FILL = '#00c2ff';
const HIDDEN_GEM_FILL = '#9370c4';
const SILVER_GEM_FILL = '#c8d2e6';
const GOLD_GEM_FILL = '#ffc448';
const PLATINUM_GEM_FILL = '#d2dcff';
const DIAMOND_GEM_FILL = '#b4f0ff';

const RARITY = {
  cyan: { id: 'cyan', fill: PUBLIC_GEM_FILL, label: 'aquamarine', minLikes: 0 },
  silver: { id: 'silver', fill: SILVER_GEM_FILL, label: 'moonstone', minLikes: 20 },
  gold: { id: 'gold', fill: GOLD_GEM_FILL, label: 'topaz', minLikes: 50 },
  platinum: { id: 'platinum', fill: PLATINUM_GEM_FILL, label: 'opal', minLikes: 100 },
  diamond: { id: 'diamond', fill: DIAMOND_GEM_FILL, label: 'diamond', minLikes: 200 },
};

const SNAPSHOT_PLACES = [
  'a café',
  'a park bench',
  'a street corner',
  'a bridge',
  'a town square',
  'a waterfront',
];

const CHALLENGE_FINDS = [
  {
    id: 'find-mara',
    user: '@mara.k',
    photo: 'assets/find-b.jpg',
    text: 'Paw print in the sidewalk concrete near the ravine.',
    place: 'Kennedale Ravine',
    likes: 12,
    collected: true,
  },
  {
    id: 'find-juniper',
    user: '@juniper.walks',
    photo: 'assets/find-c.jpg',
    text: 'Bird-shaped cloud above Victoria Trail.',
    place: 'Victoria Trail NW',
    likes: 24,
    collected: true,
  },
  {
    id: 'find-fox',
    user: '@foxtrail',
    photo: 'assets/find-d.jpg',
    text: 'Fox silhouette in the ivy on the mailbox.',
    place: '28 St NW',
    likes: 61,
    collected: true,
  },
  {
    id: 'find-you-a',
    user: MY_USER,
    photo: 'assets/find-a.jpg',
    text: '[find 1]',
    place: 'Whimsy Walk · near you',
    likes: 0,
    pending: true,
  },
  {
    id: 'find-you-b',
    user: MY_USER,
    photo: 'assets/find-b.jpg',
    text: '[find 2]',
    place: 'Whimsy Walk · near you',
    likes: 0,
    pending: true,
  },
  {
    id: 'find-you-c',
    user: MY_USER,
    photo: 'assets/find-c.jpg',
    text: '[find 3]',
    place: 'Whimsy Walk · near you',
    likes: 0,
    pending: true,
  },
];

const ROTATE_MS = 2200;
const TIP_OUT_MS = 360;
const TIP_SWIPE_DISMISS_PX = 72;
const FEED_SWIPE_DISMISS_PX = 72;
const FEED_DISMISS_MS = 320;
const TIP_TAP_SLOP_PX = 8;
const SWIPE_SETTLE_MS = 420;
const SWIPE_FADE_MS = 520;
const EASE_POPULAR = 'cubic-bezier(0.33, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.32, 0, 0.67, 0)';
const ONBOARD_TIPS_HOLD = [
  { text: '[hold the photo to activate sides]', target: 'card', sides: true },
  { text: '[swipe left to hide]', target: 'railPrivate', sides: 'private' },
  { text: '[swipe right to publish]', target: 'railPublic', sides: 'public' },
  { text: '[take a snapshot anytime on the camera]', target: 'camera' },
];
const ONBOARD_TIPS_DRAG = [
  { text: '[hold the photo to activate sides]', target: 'card', sides: true },
  { text: '[drag onto hidden to hide]', target: 'dropHidden', sides: 'private' },
  { text: '[drag onto public to publish]', target: 'dropPublic', sides: 'public' },
  { text: '[take a snapshot anytime on the camera]', target: 'camera' },
];
const TIP_KEY = 'location-gems-hub-snapshot-tip-seen';
const ONBOARD_KEY = 'location-gems-hub-onboard-seen';
const SWIPE_COMMIT_X = 72;
const SWIPE_COMMIT_Y = 78;
const RAIL_ENTER_X = 40;
const RAIL_EXIT_X = 22;
const RAIL_ENTER_Y = 52;
const RAIL_EXIT_Y = 30;
const HAZE_IN_MS = 120;
const SHINE_MS = 1400;
const HOLD_AFTER_SHINE_MS = 280;
const COPY_CELEBRATE_MS = 2000;
const HAZE_OUT_MS = 240;
const CARD_IN_MS = 560;
const CARD_OUT_MS = 360;
const COPY_LEAD_MS = 160;
const RARITY_PROMOTE_MS = 720;
const TEXT_SWIPE_MS = 900;
const FLY_MS = 720;
const LIKES_DEMO = 12;
const LIKES_STACK_SECOND = 8;
const LIKES_STACK_SHUFFLE_MS = 560;
const GLANCE_ARC_CX = 120;
const GLANCE_ARC_CY = 96;
const GLANCE_ARC_R = 80;
const GLANCE_ARC_START = 190;
const GLANCE_ARC_END = -10;

const COPY = {
  emptyPublicTitle: '[nothing public yet]',
  emptyPublicBody: '[publish a find and it’ll show up here]',
  emptyHiddenTitle: '[no hidden gems]',
  emptyHiddenBody: '[keep one just for yourself — it’ll land here]',
  emptyLikedTitle: '[no liked gems yet]',
  emptyLikedBody: '[heart a gem and it’ll show up in Liked]',
  spoofCollectedTitle: 'Morning light on the corner',
  spoofCollectedTagline: 'Fresh bread before the city wakes',
  spoofCollectedReflection:
    'This corner always smells like fresh bread before the city wakes up. I come here when I need to feel grounded.',
  detailOwnSubtitle: 'Yours',
  detailCollectedSubtitle: 'Left by someone else',
  railPrivate: '[keep hidden]',
  railPublic: '[publish]',
  railDelete: '[delete]',
  dropHidden: '[hidden]',
  dropPublic: '[public]',
  likesSubtitle: '[on this gem]',
  likesSubtitleStack: '[on 2 gems]',
  likesWord: '[likes]',
  detailNav: '[navigate]',
  detailPublish: '[publish]',
  detailUnpublish: '[unpublish]',
  detailAdd: '[confirm]',
  detailWriteLabel: '[add a few words]',
  detailNotePh: '[optional note]',
  detailSkip: '[skip]',
  bannerOwn: '[you can add more anytime]',
  bannerOther: '[you need to be there to add to theirs]',
  holdHint: 'Press + hold, then swipe.',
  holdHintDrag: 'Press + hold, then drag to Hidden or Public.',
  sortTitle: '[sort your finds]',
  sortIntro: '[hold the photo — left hidden, right public, down delete]',
  sortIntroDrag: '[hold the photo — drag onto Hidden or Public]',
  publicIntroTitle: '[public]',
  publicIntroBody: '[on the map for other people]',
  hiddenIntroTitle: '[hidden]',
  hiddenIntroBody: '[just for you]',
  likedIntroTitle: '[liked]',
  likedIntroBody: '[gems you hearted]',
  privateBadge: '[hidden]',
  publicBadge: '[public]',
  descriptionLabel: '[notes]',
  sortEmpty: '[all sorted]',
  allSortedCount: '[done]',
  leftCount: (n) => `${n} left`,
  likesHeart: (n) => String(n),
  likesPlain: (n) => String(n),
  leftBy: (name) => `@${name}`,
  navigateSpoof: '[would open navigate]',
  anotherEntry: '[another note]',
  gemNearby: '[nearby]',
  feedLive: '[live]',
  feedLabel: '[nearby public gems]',
  feedDismiss: '[dismiss all]',
  feedDistance: (minutes) => `${minutes} min away`,
  feedFresh: '[new]',
};

const SPOOF_COPY = {
  railPrivate: 'Keep hidden',
  railPublic: 'Publish',
  railDelete: 'Delete',
  dropHidden: 'Hidden',
  dropPublic: 'Public',
  likesSubtitle: 'on this gem',
  likesSubtitleStack: 'on 2 gems',
  likesWord: 'likes',
  detailNav: 'Navigate',
  detailPublish: 'Publish',
  detailUnpublish: 'Unpublish',
  detailAdd: 'Confirm',
  detailWriteLabel: 'Add a few words',
  detailNotePh: 'Optional note',
  detailSkip: 'Skip',
  bannerOwn: 'You can add more anytime.',
  bannerOther: 'You need to be there to add to theirs.',
  holdHint: 'Press + hold, then swipe.',
  holdHintDrag: 'Press + hold, then drag to Hidden or Public.',
  sortTitle: 'Sort your finds',
  sortIntro: 'Hold the photo — left hidden, right public, down delete.',
  sortIntroDrag: 'Hold the photo — drag onto Hidden or Public.',
  publicIntroTitle: 'Public',
  publicIntroBody: 'On the map for other people.',
  hiddenIntroTitle: 'Hidden',
  hiddenIntroBody: 'Just for you.',
  likedIntroTitle: 'Liked',
  likedIntroBody: 'Gems you hearted.',
  privateBadge: 'Hidden',
  publicBadge: 'Public',
  descriptionLabel: 'Notes',
  sortEmpty: 'All sorted',
  allSortedCount: 'Done',
  leftCount: (n) => `${n} left`,
  likesHeart: (n) => String(n),
  likesPlain: (n) => String(n),
  likesLine: (n) => `${n} likes`,
  leftBy: (name) => `@${name}`,
  navigateSpoof: 'Would open navigate',
  anotherEntry: 'Another note',
  gemNearby: 'Nearby',
  feedLive: 'Live',
  feedLabel: 'Nearby public gems',
  feedDismiss: 'Dismiss all',
  feedDistance: (minutes) => `${minutes} min away`,
  feedFresh: 'New',
  emptyPublicTitle: 'Nothing public yet',
  emptyPublicBody: 'Publish a find and it’ll show up here.',
  emptyHiddenTitle: 'No hidden gems',
  emptyHiddenBody: 'Keep one just for yourself — it’ll land here.',
  emptyLikedTitle: 'No liked gems yet',
  emptyLikedBody: 'Heart a gem and it’ll show up in Liked.',
  detailOwnSubtitle: 'Yours',
  detailCollectedSubtitle: 'Left by someone else',
  spoofCollectedTitle: 'Morning light on the corner',
  spoofCollectedTagline: 'Fresh bread before the city wakes',
  spoofCollectedReflection:
    'This corner always smells like fresh bread before the city wakes up. I come here when I need to feel grounded.',
};

const phone = document.getElementById('phone');
const hub = document.getElementById('hub');
const gemGrid = document.getElementById('gemGrid');
const emptyState = document.getElementById('emptyState');
const emptyTitle = document.getElementById('emptyTitle');
const emptyBody = document.getElementById('emptyBody');
const emptyIcon = document.getElementById('emptyIcon');
const snapshotBtn = document.getElementById('snapshotBtn');
const cameraButton = document.getElementById('cameraButton');
const rotatingWord = document.getElementById('rotatingWord');
const snapshotTip = document.getElementById('snapshotTip');
const snapshotTipOk = document.getElementById('snapshotTipOk');
const snapshotTipScrim = document.getElementById('snapshotTipScrim');
const sectionIntroTitle = document.getElementById('sectionIntroTitle');
const sectionIntroBody = document.getElementById('sectionIntroBody');
const tabPublicIcon = document.getElementById('tabPublicIcon');
const tabHiddenIcon = document.getElementById('tabHiddenIcon');
const detail = document.getElementById('detail');
const detailBack = document.getElementById('detailBack');
const detailFav = document.getElementById('detailFav');
const detailFavIcon = document.getElementById('detailFavIcon');
const detailSubtitle = document.getElementById('detailSubtitle');
const detailPhoto = document.getElementById('detailPhoto');
const detailGemTitle = document.getElementById('detailGemTitle');
const detailTagline = document.getElementById('detailTagline');
const detailAuthor = document.getElementById('detailAuthor');
const detailCaption = document.getElementById('detailCaption');
const detailLikes = document.getElementById('detailLikes');
const detailLikeBtn = document.getElementById('detailLikeBtn');
const detailLikeHeart = document.getElementById('detailLikeHeart');
const detailVisChip = document.getElementById('detailVisChip');
const detailRarityChip = document.getElementById('detailRarityChip');
const detailRarityGem = document.getElementById('detailRarityGem');
const detailRarityLabel = document.getElementById('detailRarityLabel');
const detailSectionLabel = document.getElementById('detailSectionLabel');
const detailOverlay = document.querySelector('.detail-overlay');
const detailNav = document.getElementById('detailNav');
const detailPublish = document.getElementById('detailPublish');
const detailEntries = document.getElementById('detailEntries');
const detailBanner = document.getElementById('detailBanner');
const detailBannerCopy = document.getElementById('detailBannerCopy');
const detailWrite = document.getElementById('detailWrite');
const detailWriteLabel = document.getElementById('detailWriteLabel');
const detailNote = document.getElementById('detailNote');
const detailNoteSkip = document.getElementById('detailNoteSkip');
const detailAdd = document.getElementById('detailAdd');
const hubScroll = document.getElementById('hubScroll');
const accentColor = document.getElementById('accentColor');
const accentAlpha = document.getElementById('accentAlpha');
const radialColor = document.getElementById('radialColor');
const radialAmount = document.getElementById('radialAmount');
const radialImpact = document.getElementById('radialImpact');
const bgColor = document.getElementById('bgColor');
const bgDepth = document.getElementById('bgDepth');
const midToneOn = document.getElementById('midToneOn');
const midToneColor = document.getElementById('midToneColor');
const midTonePick = document.getElementById('midTonePick');
const MID_TONE_DEFAULT = '#241b46';
const tabPublic = document.getElementById('tabPublic');
const tabHidden = document.getElementById('tabHidden');
const tabLiked = document.getElementById('tabLiked');
const sortInlineEl = document.getElementById('sortInline');
const hint = document.getElementById('hint');
const resetHub = document.getElementById('resetHub');
const feedDock = document.getElementById('feedDock');
const feedStrip = document.getElementById('feedStrip');
const feedDismiss = document.getElementById('feedDismiss');
const feedDockLabel = document.getElementById('feedDockLabel');
let feedDismissed = false;
let feedVariant = 'side';
const sortTitle = document.getElementById('sortTitle');
const sortIntro = document.getElementById('sortIntro');
const sortSub = document.getElementById('sortSub');
const sortStack = document.getElementById('sortStack');
const sortEmpty = document.getElementById('sortEmpty');
const sortInline = document.getElementById('sortInline');
const railPrivate = document.getElementById('railPrivate');
const railPublic = document.getElementById('railPublic');
const railDelete = document.getElementById('railDelete');
const railPrivateIcon = document.getElementById('railPrivateIcon');
const railPublicIcon = document.getElementById('railPublicIcon');
const dropHidden = document.getElementById('dropHidden');
const dropPublic = document.getElementById('dropPublic');
const dropHiddenIcon = document.getElementById('dropHiddenIcon');
const dropPublicIcon = document.getElementById('dropPublicIcon');
const spot = document.getElementById('spot');
const mapTip = document.getElementById('mapTip');
const mapTipSteps = document.getElementById('mapTipSteps');
const mapTipBody = document.getElementById('mapTipBody');
const tabBar = document.getElementById('tabBar') || tabPublic?.parentElement;
const likesBanner = document.getElementById('likesBanner');
const likesShine = document.getElementById('likesShine');
const likesCopy = document.getElementById('likesCopy');
const likesHeadline = document.getElementById('likesHeadline');
const likesSubtitle = document.getElementById('likesSubtitle');
const likesJamStack = document.getElementById('likesJamStack');
const likesJamCard = document.getElementById('likesJamCard');
const likesJamCardB = document.getElementById('likesJamCardB');
const debugRarityUp = document.getElementById('debugRarityUp');
const flyLayer = document.getElementById('flyLayer');
const debugLikes = document.getElementById('debugLikes');
const debugLikesMulti = document.getElementById('debugLikesMulti');
const debugOnboard = document.getElementById('debugOnboard');
const debugSpoof = document.getElementById('debugSpoof');
const debugDragMode = document.getElementById('debugDragMode');
const debugLikesStack = document.getElementById('debugLikesStack');

/** @type {'public'|'hidden'|'liked'} */
let activeSection = 'public';
/** @type {any[]} */
let gems = [];
/** @type {string[]} */
let favouriteGemIds = [];
/** @type {Record<string, boolean>} */
let likedByGem = {};
/** @type {any[]} */
let pendingSort = [];
let openGemId = null;
let placeIndex = 0;
let gemSeq = 0;
let likesBusy = false;
let spoofWording = false;
let likesStackMode = false;
let dragMode = false;
/** @type {any} */
let drag = null;
/** @type {(() => void) | null} */
let mapTipAdvance = null;
let mapTipIndex = 0;
/** @type {Array<{ text: string, target: string }>} */
let mapTipQueue = [];
/** @type {string | null} */
let targetsMode = null;
let targetsArmed = false;

function t(key, ...args) {
  const table = spoofWording ? { ...COPY, ...SPOOF_COPY } : COPY;
  const val = table[key];
  if (typeof val === 'function') return val(...args);
  return val;
}

/** When spoof is on, replace leftover [bracket] copy with readable text */
function displayCopy(text) {
  if (text == null) return '';
  const s = String(text);
  if (!spoofWording) return s;
  if (s === COPY.spoofCollectedTitle) return SPOOF_COPY.spoofCollectedTitle;
  if (s === COPY.spoofCollectedTagline) return SPOOF_COPY.spoofCollectedTagline;
  if (s === COPY.spoofCollectedReflection) return SPOOF_COPY.spoofCollectedReflection;
  if (/^\[.*\]$/.test(s.trim())) {
    return s.replace(/^\[/, '').replace(/\]$/, '');
  }
  return s;
}

function gemSvg(fill, opts = {}) {
  const soft = !!opts.softOutline;
  const outlineW = soft ? GEM_STROKE_SOFT : GEM_STROKE;
  const facetW = soft ? GEM_FACET_STROKE_SOFT : GEM_FACET_STROKE;
  const outlineOp = soft ? GEM_OUTLINE_OPACITY_SOFT : 1;
  const facetOp = soft ? GEM_FACET_OPACITY_SOFT : 0.6;
  return `<svg viewBox="0 0 24 22" aria-hidden="true">
    <path d="${GEM_OUTLINE}" fill="${fill}"/>
    <path d="${GEM_TABLE}" fill="#fff" fill-opacity="0.3"/>
    <path d="${GEM_SHADE}" fill="#000" fill-opacity="0.22"/>
    <path d="${GEM_FACETS}" fill="none" stroke="#fff" stroke-opacity="${facetOp}" stroke-width="${facetW}" stroke-linejoin="round"/>
    <path d="${GEM_OUTLINE}" fill="none" stroke="#fff" stroke-opacity="${outlineOp}" stroke-width="${outlineW}" stroke-linejoin="round"/>
  </svg>`;
}

function heartSvg() {
  return `<svg viewBox="0 0 19 17" aria-hidden="true">
    <path d="${HEART_PATH}" fill="${LIKE_PINK_HOT}"/>
    <path d="${HEART_PATH}" fill="none" stroke="#fff" stroke-width="${GEM_STROKE}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function storageGet(key) {
  try {
    return localStorage.getItem(key) === '1';
  } catch (_) {
    return false;
  }
}

function storageSet(key) {
  try {
    localStorage.setItem(key, '1');
  } catch (_) {
    /* ignore */
  }
}

function storageClear(key) {
  try {
    localStorage.removeItem(key);
  } catch (_) {
    /* ignore */
  }
}

function rarityForLikes(likes, isPublic) {
  if (!isPublic) {
    return { id: 'hidden', fill: HIDDEN_GEM_FILL, label: 'hidden', minLikes: 0 };
  }
  const n = Number(likes) || 0;
  if (n >= RARITY.diamond.minLikes) return RARITY.diamond;
  if (n >= RARITY.platinum.minLikes) return RARITY.platinum;
  if (n >= RARITY.gold.minLikes) return RARITY.gold;
  if (n >= RARITY.silver.minLikes) return RARITY.silver;
  return RARITY.cyan;
}

/* Prototype walk minutes — same “{{minutes}} min away” string as app TravelTime */
const FEED_MINUTES_BY_FIND = {
  'find-mara': 2,
  'find-juniper': 4,
  'find-fox': 6,
};
const SPOOF_FEED_MINUTES = 1;

function createSpoofCollectedGem() {
  return {
    id: SPOOF_COLLECTED_GEM_ID,
    storyId: 'location-gems-prototype',
    imageUri: PROTOTYPE_GEM_IMAGE,
    title: COPY.spoofCollectedTitle,
    tagline: COPY.spoofCollectedTagline,
    caption: COPY.spoofCollectedReflection,
    authorUsername: SPOOF_COLLECTED_GEM_AUTHOR,
    isPublic: true,
    owned: false,
    likes: LIKES_DEMO,
    minutesAway: SPOOF_FEED_MINUTES,
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
    entries: [COPY.spoofCollectedReflection, '[another note left at this gem]'],
  };
}

function findToGem(find, opts) {
  gemSeq += 1;
  return {
    id: opts.id || `gem-${find.id}-${gemSeq}`,
    storyId: 'daily-side-quests',
    imageUri: find.photo,
    title: find.place,
    tagline: find.text,
    caption: find.text,
    authorUsername: find.user.replace(/^@/, ''),
    isPublic: !!opts.isPublic,
    owned: !!opts.owned,
    likes: opts.isPublic ? find.likes || 0 : 0,
    minutesAway:
      opts.minutesAway != null ? opts.minutesAway : FEED_MINUTES_BY_FIND[find.id],
    createdAt: opts.createdAt || new Date().toISOString(),
    entries: [find.text],
  };
}

function seedGems() {
  gems = [];
  CHALLENGE_FINDS.filter((f) => f.collected).forEach((find) => {
    gems.push(
      findToGem(find, {
        id: `collected-${find.id}`,
        isPublic: true,
        owned: false,
      }),
    );
  });
  gems.unshift(createSpoofCollectedGem());
}

function seedPendingSort() {
  pendingSort = CHALLENGE_FINDS.filter((f) => f.pending).map((f) => ({ ...f }));
}

function getGemTagline(gem) {
  return (gem.tagline || '').trim();
}

function getGemTitle(gem) {
  const title = (gem.title || '').trim();
  if (title) return title;
  return (gem.caption || '').trim();
}

function publicLikes(gem) {
  if (!gem.isPublic) return 0;
  return Number(gem.likes) || 0;
}

function activeGems() {
  if (activeSection === 'public') return gems.filter((g) => g.isPublic);
  if (activeSection === 'hidden') return gems.filter((g) => !g.isPublic && g.owned);
  return gems.filter((g) => likedByGem[g.id] || favouriteGemIds.includes(g.id));
}

function emptyCopy() {
  if (activeSection === 'public') {
    return { title: t('emptyPublicTitle'), body: t('emptyPublicBody') };
  }
  if (activeSection === 'hidden') {
    return { title: t('emptyHiddenTitle'), body: t('emptyHiddenBody') };
  }
  return { title: t('emptyLikedTitle'), body: t('emptyLikedBody') };
}

function glancePolar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function glanceArcPath() {
  const start = glancePolar(GLANCE_ARC_CX, GLANCE_ARC_CY, GLANCE_ARC_R, GLANCE_ARC_START);
  const end = glancePolar(GLANCE_ARC_CX, GLANCE_ARC_CY, GLANCE_ARC_R, GLANCE_ARC_END);
  const sweep = Math.abs(GLANCE_ARC_END - GLANCE_ARC_START);
  const large = sweep <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${GLANCE_ARC_R} ${GLANCE_ARC_R} 0 ${large} 1 ${end.x} ${end.y}`;
}

function setupSnapshotArc() {
  const d = glanceArcPath();
  document.querySelectorAll('.snapshot-arc-track, .snapshot-arc-fill').forEach((el) => {
    el.setAttribute('d', d);
  });
  const fill = document.querySelector('.snapshot-arc-fill');
  if (!fill) return;
  const len = (Math.abs(GLANCE_ARC_END - GLANCE_ARC_START) / 360) * 2 * Math.PI * GLANCE_ARC_R;
  fill.style.strokeDasharray = `${len} ${len}`;
  fill.style.strokeDashoffset = '0';
}

function applyStaticCopy() {
  sortTitle.textContent = t('sortTitle');
  sortIntro.textContent = dragMode ? t('sortIntroDrag') : t('sortIntro');
  document.querySelectorAll('[data-copy]').forEach((el) => {
    const map = {
      private: 'railPrivate',
      public: 'railPublic',
      delete: 'railDelete',
      dropHidden: 'dropHidden',
      dropPublic: 'dropPublic',
    };
    const key = map[el.dataset.copy];
    if (key) el.textContent = t(key);
  });
  detailNav.textContent = t('detailNav');
  detailAdd.textContent = t('detailAdd');
  detailWriteLabel.textContent = t('detailWriteLabel');
  detailNote.placeholder = t('detailNotePh');
  detailNoteSkip.textContent = t('detailSkip');
  detailSectionLabel.textContent = t('descriptionLabel');
  likesSubtitle.textContent = t('likesSubtitle');
  sortEmpty.textContent = t('sortEmpty');
  hint.textContent = dragMode ? t('holdHintDrag') : t('holdHint');
  syncSectionIntro();
}

function syncSectionIntro() {
  if (activeSection === 'public') {
    sectionIntroTitle.textContent = t('publicIntroTitle');
    sectionIntroBody.textContent = t('publicIntroBody');
  } else if (activeSection === 'hidden') {
    sectionIntroTitle.textContent = t('hiddenIntroTitle');
    sectionIntroBody.textContent = t('hiddenIntroBody');
  } else {
    sectionIntroTitle.textContent = t('likedIntroTitle');
    sectionIntroBody.textContent = t('likedIntroBody');
  }
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = h.length === 3
    ? h.split('').map((c) => c + c).join('')
    : h;
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function softAccentHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c) => Math.min(255, Math.round(c + (255 - c) * 0.55));
  const to = (n) => n.toString(16).padStart(2, '0');
  return `#${to(mix(r))}${to(mix(g))}${to(mix(b))}`;
}

function applyAccent() {
  const hex = accentColor.value || '#00c2ff';
  const alpha = (Number(accentAlpha.value) || 100) / 100;
  const { r, g, b } = hexToRgb(hex);
  const deep = `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 20)})`;
  const accent = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  const solid = `rgb(${r}, ${g}, ${b})`;
  const soft = softAccentHex(hex);
  document.documentElement.style.setProperty('--brand-accent', accent);
  document.documentElement.style.setProperty('--brand-primary', solid);
  document.documentElement.style.setProperty('--brand-primary-deep', deep);
  document.documentElement.style.setProperty('--accent-soft', soft);
  /* Likes rich text follows accent hue (not a fixed blue) */
  document.documentElement.style.setProperty('--likes-hue', solid);
  document.documentElement.style.setProperty('--likes-hue-soft', soft);
  document.documentElement.style.setProperty(
    '--accent-glow',
    `rgba(${r}, ${g}, ${b}, ${0.55 * alpha})`,
  );
  applyRadial();
}

function applyRadial() {
  const hex = (radialColor && radialColor.value) || '#b36bff';
  const amount = ((radialAmount && Number(radialAmount.value)) || 55) / 100;
  const impact = ((radialImpact && Number(radialImpact.value)) || 60) / 100;
  const { r, g, b } = hexToRgb(hex);
  const alpha = 0.35 * amount + 0.65 * amount * impact;
  const spreadX = 140 + Math.round(120 * impact);
  const spreadY = 55 + Math.round(35 * impact);
  const fade = 58 + Math.round(22 * (1 - impact));
  document.documentElement.style.setProperty('--btn-radial-solid', hex);
  document.documentElement.style.setProperty(
    '--btn-radial',
    `rgba(${r}, ${g}, ${b}, ${alpha})`,
  );
  document.documentElement.style.setProperty(
    '--btn-radial-wash',
    `radial-gradient(ellipse ${spreadX}% ${spreadY}% at 50% 45%, rgba(${r}, ${g}, ${b}, ${alpha}), transparent ${fade}%)`,
  );
}

function applyBg() {
  const hex = (bgColor && bgColor.value) || '#170c35';
  const depth = ((bgDepth && Number(bgDepth.value)) || 100) / 100;
  const { r, g, b } = hexToRgb(hex);
  const out = `rgb(${Math.round(r * depth)}, ${Math.round(g * depth)}, ${Math.round(b * depth)})`;
  document.documentElement.style.setProperty('--bg', out);
}

function midToneEnabled() {
  return !!(midToneOn && midToneOn.getAttribute('aria-checked') === 'true');
}

function applyMidTone() {
  const on = midToneEnabled();
  if (midTonePick) midTonePick.hidden = !on;
  const hex =
    on && midToneColor && midToneColor.value
      ? midToneColor.value
      : MID_TONE_DEFAULT;
  document.documentElement.style.setProperty('--raised', hex);
}

function setSwitch(el, on) {
  if (!el) return;
  el.setAttribute('aria-checked', on ? 'true' : 'false');
}

function nextRarity(rarity) {
  const order = [RARITY.cyan, RARITY.silver, RARITY.gold, RARITY.platinum, RARITY.diamond];
  const i = order.findIndex((r) => r.id === rarity.id);
  return order[Math.min(order.length - 1, Math.max(0, i) + 1)];
}

function likesSlotEls(card) {
  return {
    card,
    photo: card.querySelector('[data-likes-photo]'),
    cornerArt: card.querySelector('[data-likes-corner-art]'),
    gem: card.querySelector('[data-likes-gem]'),
    rarity: card.querySelector('[data-likes-rarity]'),
    text: card.querySelector('[data-likes-text]'),
    count: card.querySelector('[data-likes-count]'),
    user: card.querySelector('[data-likes-user]'),
    place: card.querySelector('[data-likes-place]'),
  };
}

function setLikesCardRarity(els, rarity, { pop = false } = {}) {
  if (!els || !els.gem) return;
  els.card.style.setProperty('--gem-line', rarity.fill);
  if (els.cornerArt) {
    els.cornerArt.innerHTML = cornerRibbonHtml(
      rarity.fill,
      `likes-${els.card.getAttribute('data-likes-slot') || '0'}-${rarity.id}`,
    );
  }
  els.gem.innerHTML = gemSvg(rarity.fill, { softOutline: true });
  if (els.rarity) {
    els.rarity.hidden = rarity.id === 'cyan';
    els.rarity.textContent = rarity.label;
    els.rarity.classList.toggle('is-pop', !!pop);
  }
}

function cornerRibbonHtml(fill, uid) {
  const tpl = window.LOCATION_GEMS_CORNER_RIBBON;
  if (!tpl) return '';
  const safe = String(uid || 'x').replace(/[^a-zA-Z0-9_-]/g, '');
  return tpl
    .split('{{GEM}}')
    .join(fill)
    .replace(/paint0_linear_0_4/g, `paint0_${safe}`)
    .replace(/paint1_linear_0_4/g, `paint1_${safe}`);
}

function buildGemCard(gem, opts = {}) {
  const rarity = rarityForLikes(gem.likes, gem.isPublic);
  const wrap = document.createElement('div');
  wrap.className = 'gem-card';
  if (opts.enter) wrap.classList.add('is-enter');
  wrap.style.setProperty('--gem-line', rarity.fill);
  const img = document.createElement('img');
  img.className = 'gem-card-photo';
  img.src = gem.imageUri;
  img.alt = '';
  img.decoding = 'async';
  wrap.appendChild(img);
  const scrim = document.createElement('div');
  scrim.className = 'gem-card-scrim';
  wrap.appendChild(scrim);
  if (gem.isPublic && rarity.id !== 'cyan') {
    const rarityEl = document.createElement('span');
    rarityEl.className = `gem-card-rarity is-${rarity.id}`;
    rarityEl.textContent = rarity.label;
    wrap.appendChild(rarityEl);
  }
  /* Figma 2825:457 — organic indigo blotch + brush lines tinted to gem */
  const corner = document.createElement('div');
  corner.className = 'gem-card-corner';
  const art = document.createElement('div');
  art.className = 'gem-card-corner-art';
  art.setAttribute('aria-hidden', 'true');
  art.innerHTML = cornerRibbonHtml(rarity.fill, gem.id || rarity.id);
  corner.appendChild(art);
  const stack = document.createElement('div');
  stack.className = 'gem-card-corner-stack';
  const gemEl = document.createElement('span');
  gemEl.className = 'gem-card-gem';
  if (!gem.isPublic) gemEl.classList.add('is-hidden-fill');
  else if (rarity.id !== 'cyan') gemEl.classList.add(`is-${rarity.id}`);
  gemEl.innerHTML = gemSvg(rarity.fill);
  stack.appendChild(gemEl);
  corner.appendChild(stack);
  wrap.appendChild(corner);
  const footer = document.createElement('div');
  footer.className = 'gem-card-footer';
  const caption = document.createElement('p');
  caption.className = 'gem-card-caption';
  caption.textContent = displayCopy(getGemTagline(gem) || getGemTitle(gem) || '—');
  footer.appendChild(caption);
  const likes = publicLikes(gem);
  if (gem.isPublic && likes > 0) {
    const likesEl = document.createElement('span');
    likesEl.className = 'gem-card-likes';
    likesEl.innerHTML = `<span class="like-heart" aria-hidden="true">♥</span><span>${t('likesHeart', likes)}</span>`;
    footer.appendChild(likesEl);
  }
  wrap.appendChild(footer);
  return wrap;
}

function bindFeedChipActions(chip, g) {
  const go = chip.querySelector('.feed-chip-go');
  if (go) {
    go.addEventListener('click', (e) => {
      e.stopPropagation();
      hint.textContent = t('navigateSpoof');
      openDetail(g.id);
    });
  }
  chip.addEventListener('click', () => openDetail(g.id));
  chip.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail(g.id);
    }
  });
}

function buildFeedChip(g, variant) {
  const rarity = rarityForLikes(g.likes, true);
  const minutes = Number(g.minutesAway);
  const dist =
    Number.isFinite(minutes) && minutes >= 0
      ? t('feedDistance', minutes)
      : t('gemNearby');
  const gemClass =
    rarity.id !== 'cyan' ? `feed-chip-gem is-${rarity.id}` : 'feed-chip-gem';
  const rarityWord =
    rarity.id !== 'cyan'
      ? `<span class="feed-chip-rarity-word is-${rarity.id}">${rarity.label}</span>`
      : '';
  const gemEl = `<span class="${gemClass}" aria-hidden="true">${gemSvg(rarity.fill)}</span>`;
  const goBtn = `<button type="button" class="feed-chip-go">${t('detailNav')}</button>`;
  const chip = document.createElement('article');
  chip.className = `feed-chip is-${variant}`;
  chip.setAttribute('role', 'button');
  chip.tabIndex = 0;
  chip.setAttribute(
    'aria-label',
    `${dist}${rarity.id !== 'cyan' ? `, ${rarity.label}` : ''}`,
  );

  if (variant === 'banner') {
    chip.innerHTML = `
      <div class="feed-chip-media is-banner">
        <img src="${g.imageUri}" alt="">
      </div>
      <div class="feed-chip-body is-row">
        <div class="feed-chip-copy">
          <p class="feed-chip-dist">${dist}</p>
          <div class="feed-chip-meta">${gemEl}${rarityWord}</div>
        </div>
        ${goBtn}
      </div>`;
  } else if (variant === 'compact') {
    chip.innerHTML = `
      <div class="feed-chip-media is-tiny">
        <img src="${g.imageUri}" alt="">
      </div>
      <p class="feed-chip-dist">${dist}</p>
      <div class="feed-chip-meta">${gemEl}${rarityWord}</div>
      ${goBtn}`;
  } else {
    chip.innerHTML = `
      <div class="feed-chip-media">
        <img src="${g.imageUri}" alt="">
      </div>
      <div class="feed-chip-body">
        <p class="feed-chip-dist">${dist}</p>
        <div class="feed-chip-meta">${gemEl}${rarityWord}</div>
        ${goBtn}
      </div>`;
  }
  bindFeedChipActions(chip, g);
  return chip;
}

function setFeedVariant(variant) {
  const next =
    variant === 'banner' || variant === 'compact' ? variant : 'side';
  feedVariant = next;
  document.querySelectorAll('[data-feed-variant]').forEach((btn) => {
    const on = btn.getAttribute('data-feed-variant') === next;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  if (feedStrip) feedStrip.dataset.variant = next;
  renderFeed();
}

function renderFeed() {
  feedStrip.replaceChildren();
  if (feedDockLabel) feedDockLabel.textContent = t('feedLabel');
  if (feedDismiss) feedDismiss.textContent = t('feedDismiss');
  if (feedDismissed) {
    feedDock.hidden = true;
    return;
  }
  const publicGems = gems
    .filter((g) => g.isPublic)
    .slice()
    .sort((a, b) => (Number(a.minutesAway) || 9999) - (Number(b.minutesAway) || 9999));
  if (!publicGems.length) {
    feedDock.hidden = true;
    return;
  }
  feedDock.hidden = false;
  feedDock.classList.remove('is-dismissing', 'is-swiping');
  feedDock.style.transform = '';
  feedStrip.dataset.variant = feedVariant;
  publicGems.forEach((g) => {
    feedStrip.appendChild(buildFeedChip(g, feedVariant));
  });
}

function dismissFeed() {
  if (feedDismissed || !feedDock || feedDock.hidden) return;
  feedDismissed = true;
  feedDock.classList.remove('is-swiping');
  feedDock.classList.add('is-dismissing');
  feedDock.style.transform = '';
  window.setTimeout(() => {
    feedDock.hidden = true;
    feedDock.classList.remove('is-dismissing');
    feedStrip.replaceChildren();
  }, FEED_DISMISS_MS);
}

function bindFeedDismissGesture() {
  if (!feedDock) return;
  let startX = 0;
  let dragging = false;
  const onStart = (x, target) => {
    if (feedDock.hidden || feedDismissed) return;
    if (target && target.closest('.feed-strip')) return;
    startX = x;
    dragging = true;
    feedDock.classList.add('is-swiping');
    feedDock.style.transform = 'translateX(0)';
  };
  const onMove = (x) => {
    if (!dragging) return;
    const dx = Math.max(0, x - startX);
    feedDock.style.transform = `translateX(${dx}px)`;
  };
  const onEnd = (x) => {
    if (!dragging) return;
    dragging = false;
    feedDock.classList.remove('is-swiping');
    const dx = x - startX;
    if (dx >= FEED_SWIPE_DISMISS_PX) {
      dismissFeed();
    } else {
      feedDock.style.transform = '';
    }
  };
  feedDock.addEventListener('pointerdown', (e) => {
    onStart(e.clientX, e.target);
    if (dragging) feedDock.setPointerCapture(e.pointerId);
  });
  feedDock.addEventListener('pointermove', (e) => onMove(e.clientX));
  feedDock.addEventListener('pointerup', (e) => onEnd(e.clientX));
  feedDock.addEventListener('pointercancel', (e) => onEnd(e.clientX));
}

function renderGrid(enterId) {
  const list = activeGems();
  gemGrid.replaceChildren();
  if (!list.length) {
    gemGrid.hidden = true;
    const copy = emptyCopy();
    emptyTitle.textContent = copy.title;
    emptyBody.textContent = copy.body;
    emptyIcon.innerHTML = gemSvg(
      activeSection === 'public' ? PUBLIC_GEM_FILL : HIDDEN_GEM_FILL,
      { softOutline: true },
    );
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;
  gemGrid.hidden = false;
  list.forEach((gem) => {
    const cell = document.createElement('div');
    cell.className = 'gem-cell';
    cell.dataset.id = gem.id;
    const card = buildGemCard(gem, { enter: gem.id === enterId });
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.setAttribute('aria-label', getGemTitle(gem) || 'Gem');
    card.addEventListener('click', () => openDetail(gem.id));
    cell.appendChild(card);
    gemGrid.appendChild(cell);
  });
}

function setSortingFocus(on) {
  hub.classList.toggle('is-sorting-focus', on && pendingSort.length > 0);
}

function hideTargets() {
  targetsMode = null;
  targetsArmed = false;
  [railPrivate, railPublic, railDelete].forEach((rail) => {
    rail.classList.remove('is-on', 'is-hot');
  });
  [dropHidden, dropPublic].forEach((zone) => {
    zone.classList.remove('is-on', 'is-hot');
  });
}

function setTargets(mode, armed) {
  if (!armed) {
    if (!targetsArmed) return;
    hideTargets();
    return;
  }
  if (targetsArmed && targetsMode === mode) return;
  targetsArmed = true;
  targetsMode = mode;
  if (dragMode) {
    dropHidden.hidden = false;
    dropPublic.hidden = false;
    dropHidden.setAttribute('aria-hidden', 'false');
    dropPublic.setAttribute('aria-hidden', 'false');
    dropHidden.classList.add('is-on');
    dropPublic.classList.add('is-on');
    dropHidden.classList.toggle('is-hot', mode === 'private');
    dropPublic.classList.toggle('is-hot', mode === 'public');
    return;
  }
  [railPrivate, railPublic, railDelete].forEach((rail) => {
    rail.classList.add('is-on');
    rail.classList.remove('is-hot');
  });
  if (mode === 'private') railPrivate.classList.add('is-hot');
  else if (mode === 'public') railPublic.classList.add('is-hot');
  else if (mode === 'delete') railDelete.classList.add('is-hot');
}

function buildSortCard(find, under, enter) {
  const card = document.createElement('article');
  card.className = `sort-card${under ? ' is-under' : ''}${enter ? ' is-enter' : ''}`;
  card.dataset.id = find.id;
  card.innerHTML = `
    <img class="sort-card-photo" src="${find.photo}" alt="" draggable="false">
    <div class="sort-card-body">
      <p class="sort-card-user">${find.user}</p>
      <p class="sort-card-text">${displayCopy(find.text)}</p>
      <p class="sort-card-place">📍 ${displayCopy(find.place)}</p>
    </div>
  `;
  return card;
}

function renderSortStack() {
  sortStack.replaceChildren();
  const n = pendingSort.length;
  sortSub.textContent = n ? t('leftCount', n) : t('allSortedCount');
  sortEmpty.hidden = n > 0;
  sortEmpty.textContent = t('sortEmpty');
  sortInlineEl.classList.toggle('is-done', n === 0);
  setSortingFocus(false);
  hideTargets();
  if (!n) return;
  const top = pendingSort[0];
  const next = pendingSort[1];
  if (next) sortStack.appendChild(buildSortCard(next, true, false));
  const front = buildSortCard(top, false, true);
  sortStack.appendChild(front);
  bindSortDrag(front);
}

function refreshHub(enterId) {
  applyStaticCopy();
  renderFeed();
  renderSortStack();
  renderGrid(enterId);
}

function setSection(section) {
  activeSection = section;
  document.querySelectorAll('.tab-button').forEach((btn) => {
    const on = btn.dataset.section === section;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  syncSectionIntro();
  renderGrid();
}

function showTip(_visible) {
  /* Snapshot tip card removed for now */
  snapshotTip.hidden = true;
  snapshotTip.setAttribute('aria-hidden', 'true');
  cameraButton.classList.remove('is-highlighted');
}

function dismissTip() {
  showTip(false);
  storageSet(TIP_KEY);
}

function findGem(id) {
  return gems.find((g) => g.id === id) || null;
}

function isFavourite(id) {
  return favouriteGemIds.includes(id);
}

function toggleFavourite(id) {
  if (isFavourite(id)) {
    favouriteGemIds = favouriteGemIds.filter((x) => x !== id);
  } else {
    favouriteGemIds.push(id);
  }
  syncDetailFav();
}

function syncDetailFav() {
  if (!openGemId) return;
  detailFavIcon.src = isFavourite(openGemId)
    ? 'assets/fav_checked.svg'
    : 'assets/fav_unchecked.svg';
}

function renderDetailEntries(gem) {
  const caption = (gem.caption || '').trim();
  const entries = (
    Array.isArray(gem.entries) && gem.entries.length
      ? gem.entries
      : []
  ).filter((text) => String(text).trim() && String(text).trim() !== caption);
  detailEntries.replaceChildren();
  if (!entries.length) {
    detailEntries.hidden = true;
  } else {
    entries.forEach((text) => {
      const p = document.createElement('p');
      p.className = 'detail-entry';
      p.textContent = displayCopy(text);
      detailEntries.appendChild(p);
    });
    detailEntries.hidden = false;
  }
  detailBanner.hidden = false;
  detailBannerCopy.textContent = gem.owned ? t('bannerOwn') : t('bannerOther');
  detailWrite.hidden = !gem.owned;
  if (gem.owned) {
    detailWriteLabel.textContent = t('detailWriteLabel');
    detailNote.placeholder = t('detailNotePh');
    detailNoteSkip.textContent = t('detailSkip');
    detailAdd.textContent = t('detailAdd');
    detailNote.value = '';
  }
}

function syncDetailLike(gem) {
  const likes = publicLikes(gem);
  const liked = !!likedByGem[gem.id];
  if (!gem.isPublic) {
    detailLikeBtn.hidden = true;
    return;
  }
  detailLikeBtn.hidden = false;
  detailLikes.textContent = t('likesPlain', likes);
  detailLikeHeart.textContent = liked ? '♥' : likes > 0 ? '♥' : '♡';
  detailLikeBtn.classList.toggle('is-liked', liked);
}

function openDetail(id) {
  const gem = findGem(id);
  if (!gem) return;
  openGemId = id;
  const rarity = rarityForLikes(gem.likes, gem.isPublic);
  detailSubtitle.textContent = gem.owned
    ? t('detailOwnSubtitle')
    : t('detailCollectedSubtitle');
  detailPhoto.src = gem.imageUri;
  detailGemTitle.textContent = displayCopy(getGemTitle(gem));
  detailTagline.textContent = displayCopy(getGemTagline(gem));
  if (gem.authorUsername || gem.owned) {
    detailAuthor.hidden = false;
    detailAuthor.textContent = gem.owned
      ? MY_USER
      : t('leftBy', gem.authorUsername);
  } else {
    detailAuthor.hidden = true;
  }
  detailVisChip.hidden = false;
  detailVisChip.textContent = gem.isPublic ? t('publicBadge') : t('privateBadge');
  if (detailOverlay) {
    detailOverlay.style.setProperty('--rarity-glow', rarity.fill);
  }
  /* Rarity is a public-likes tier — not a second “Hidden” chip */
  if (gem.isPublic && rarity.id !== 'cyan') {
    detailRarityChip.hidden = false;
    detailRarityLabel.textContent = rarity.label;
    detailRarityGem.innerHTML = gemSvg(rarity.fill);
    detailRarityChip.classList.add('is-rare');
  } else {
    detailRarityChip.hidden = true;
    detailRarityChip.classList.remove('is-rare');
  }
  if (gem.owned) {
    detailPublish.hidden = false;
    detailPublish.textContent = gem.isPublic ? t('detailUnpublish') : t('detailPublish');
  } else {
    detailPublish.hidden = true;
  }
  detailSectionLabel.textContent = t('descriptionLabel');
  detailCaption.textContent = displayCopy(gem.caption || '');
  detailNav.hidden = false;
  detailNav.textContent = t('detailNav');
  syncDetailLike(gem);
  renderDetailEntries(gem);
  syncDetailFav();
  detail.hidden = false;
  detail.setAttribute('aria-hidden', 'false');
}

function closeDetail() {
  openGemId = null;
  detail.hidden = true;
  detail.setAttribute('aria-hidden', 'true');
}

function addEntryToOpenGem() {
  if (!openGemId) return;
  const gem = findGem(openGemId);
  if (!gem || !gem.owned) return;
  if (!Array.isArray(gem.entries)) {
    gem.entries = [gem.caption || gem.tagline || ''].filter(Boolean);
  }
  const note = (detailNote.value || '').trim();
  gem.entries.push(note || t('anotherEntry'));
  detailNote.value = '';
  renderDetailEntries(gem);
}

function toggleDetailLike() {
  if (!openGemId) return;
  const gem = findGem(openGemId);
  if (!gem || !gem.isPublic) return;
  likedByGem[gem.id] = !likedByGem[gem.id];
  if (likedByGem[gem.id]) {
    gem.likes = (Number(gem.likes) || 0) + 1;
    if (!favouriteGemIds.includes(gem.id)) favouriteGemIds.push(gem.id);
  } else {
    gem.likes = Math.max(0, (Number(gem.likes) || 0) - 1);
  }
  syncDetailLike(gem);
  if (activeSection === 'liked') renderGrid();
}

function togglePublish(id) {
  const gem = findGem(id);
  if (!gem || !gem.owned) return;
  gem.isPublic = !gem.isPublic;
  if (!gem.isPublic) gem.likes = 0;
  else if (!gem.likes) gem.likes = LIKES_DEMO;
  setSection(gem.isPublic ? 'public' : 'hidden');
  refreshHub(gem.id);
  if (openGemId === id) openDetail(id);
}

function addSampleCreatedGem() {
  gemSeq += 1;
  const photo = CHALLENGE_FINDS[(gemSeq - 1) % CHALLENGE_FINDS.length].photo;
  const gem = {
    id: `created-${Date.now()}-${gemSeq}`,
    storyId: 'location-gems-hub',
    imageUri: photo,
    title: 'Corner I marked',
    tagline: SNAPSHOT_PLACES[(gemSeq - 1) % SNAPSHOT_PLACES.length],
    caption: '[snapshot gem from hub camera]',
    isPublic: false,
    owned: true,
    likes: 0,
    createdAt: new Date().toISOString(),
    entries: ['[snapshot gem from hub camera]'],
  };
  gems.unshift(gem);
  setSection('hidden');
  refreshHub(gem.id);
}

function handleSnapshot() {
  if (!snapshotTip.hidden) dismissTip();
  addSampleCreatedGem();
}

function tickPlaces() {
  placeIndex = (placeIndex + 1) % SNAPSHOT_PLACES.length;
  rotatingWord.textContent = SNAPSHOT_PLACES[placeIndex];
}

function tipTargetEl(kind) {
  if (kind === 'card') {
    return sortStack.querySelector('.sort-card:not(.is-under)') || sortStack;
  }
  if (kind === 'railPrivate') return railPrivate;
  if (kind === 'railPublic') return railPublic;
  if (kind === 'dropHidden') return dropHidden;
  if (kind === 'dropPublic') return dropPublic;
  if (kind === 'camera') return cameraButton || snapshotBtn;
  return sortStack;
}

function syncOnboardSides(step) {
  if (!step || !step.sides) {
    setTargets(null, false);
    return;
  }
  if (step.sides === true) setTargets(null, true);
  else setTargets(step.sides, true);
}

function placeSpotlight(target) {
  const pr = phone.getBoundingClientRect();
  const r = target.getBoundingClientRect();
  const z = parseFloat(getComputedStyle(phone).zoom) || 1;
  const k = Math.abs(pr.width - phone.offsetWidth) < 2 ? 1 : z;
  const cx = (r.left - pr.left + r.width / 2) / k;
  const cy = (r.top - pr.top + r.height / 2) / k;
  const rad = Math.max(26, Math.min(150, Math.max(r.width, r.height) / k / 2 + 8));
  spot.style.setProperty('--x', `${cx}px`);
  spot.style.setProperty('--y', `${cy}px`);
  spot.style.setProperty('--r', `${rad}px`);
  spot.classList.toggle('above', cy > phone.offsetHeight * 0.55);
}

function hideMapTip() {
  spot.hidden = true;
  mapTip.classList.remove('is-on', 'is-out');
  mapTip.style.transform = '';
  mapTipAdvance = null;
  setTargets(null, false);
  if (mapTipSteps) {
    mapTipSteps.hidden = true;
    mapTipSteps.replaceChildren();
  }
}

function clearMapTips() {
  mapTipAdvance = null;
  mapTipQueue = [];
  mapTipIndex = 0;
  hideMapTip();
}

function advanceMapTip() {
  if (!mapTipAdvance) return;
  mapTipAdvance();
}

function presentMapTip() {
  const total = mapTipQueue.length;
  if (!total || mapTipIndex >= total) {
    hideMapTip();
    storageSet(ONBOARD_KEY);
    return;
  }
  const step = mapTipQueue[mapTipIndex];
  const target = tipTargetEl(step.target);
  if (step.target === 'camera' && snapshotBtn) {
    snapshotBtn.scrollIntoView({ block: 'nearest' });
  } else {
    sortInline.scrollIntoView({ block: 'nearest' });
  }
  syncOnboardSides(step);
  placeSpotlight(target);
  mapTipBody.textContent = displayCopy(step.text);
  mapTipBody.classList.remove('is-swap');
  void mapTipBody.offsetWidth;
  mapTipBody.classList.add('is-swap');
  if (mapTipSteps) {
    mapTipSteps.hidden = true;
    mapTipSteps.replaceChildren();
  }
  spot.hidden = false;
  mapTip.classList.remove('is-out');
  mapTip.style.transform = '';
  void mapTip.offsetWidth;
  mapTip.classList.add('is-on');
  mapTipAdvance = () => {
    mapTipAdvance = null;
    mapTip.classList.remove('is-on');
    mapTip.classList.add('is-out');
    window.setTimeout(() => {
      mapTipIndex += 1;
      if (mapTipIndex >= total) {
        hideMapTip();
        storageSet(ONBOARD_KEY);
        return;
      }
      presentMapTip();
    }, TIP_OUT_MS);
  };
}

function runOnboardingTips() {
  clearMapTips();
  mapTipQueue = dragMode ? ONBOARD_TIPS_DRAG.slice() : ONBOARD_TIPS_HOLD.slice();
  mapTipIndex = 0;
  window.setTimeout(() => presentMapTip(), 80);
}

function bindTipGesture() {
  let startX = 0;
  let dragging = false;
  const onStart = (x) => {
    if (spot.hidden || !mapTip.classList.contains('is-on')) return;
    startX = x;
    dragging = true;
    mapTip.style.transition = 'none';
  };
  const onMove = (x) => {
    if (!dragging) return;
    const dx = Math.max(0, x - startX);
    mapTip.style.transform = `translateX(${dx}px)`;
  };
  const onEnd = (x) => {
    if (!dragging) return;
    dragging = false;
    mapTip.style.transition = '';
    const dx = x - startX;
    if (dx >= TIP_SWIPE_DISMISS_PX) {
      advanceMapTip();
    } else {
      mapTip.style.transform = '';
      if (Math.abs(dx) <= TIP_TAP_SLOP_PX) advanceMapTip();
    }
  };
  mapTip.addEventListener('pointerdown', (e) => {
    mapTip.setPointerCapture(e.pointerId);
    onStart(e.clientX);
  });
  mapTip.addEventListener('pointermove', (e) => onMove(e.clientX));
  mapTip.addEventListener('pointerup', (e) => onEnd(e.clientX));
  mapTip.addEventListener('pointercancel', (e) => onEnd(e.clientX));
  spot.addEventListener('click', (e) => {
    if (e.target === spot) advanceMapTip();
  });
}

function railModeFromDelta(dx, dy, current) {
  const enterX = RAIL_ENTER_X;
  const exitX = RAIL_EXIT_X;
  const enterY = RAIL_ENTER_Y;
  const exitY = RAIL_EXIT_Y;
  if (dragMode) {
    if (current === 'private') return dx <= -exitX ? 'private' : dx >= enterX ? 'public' : null;
    if (current === 'public') return dx >= exitX ? 'public' : dx <= -enterX ? 'private' : null;
    if (dx <= -enterX) return 'private';
    if (dx >= enterX) return 'public';
    return null;
  }
  if (current === 'delete') {
    if (dy >= exitY && Math.abs(dx) < SWIPE_COMMIT_X) return 'delete';
  } else if (dy >= enterY && Math.abs(dx) < 56) {
    return 'delete';
  }
  if (current === 'private') return dx <= -exitX ? 'private' : dx >= enterX ? 'public' : null;
  if (current === 'public') return dx >= exitX ? 'public' : dx <= -enterX ? 'private' : null;
  if (dx >= enterX) return 'public';
  if (dx <= -enterX) return 'private';
  return null;
}

function bindSortDrag(card) {
  const snapBack = () => {
    card.classList.remove('is-dragging');
    card.style.transition = `transform ${SWIPE_SETTLE_MS}ms ${EASE_POPULAR}, opacity ${SWIPE_FADE_MS}ms ${EASE_IN}`;
    card.style.transform = 'rotate(-4deg)';
    card.style.opacity = '1';
    window.setTimeout(() => {
      card.style.transition = '';
      card.style.transform = '';
    }, SWIPE_FADE_MS);
  };

  const finishDrag = (dx, dy) => {
    const armed = !!(drag && drag.armed);
    drag = null;
    setTargets(null, false);
    setSortingFocus(false);
    if (hubScroll) hubScroll.style.overflowY = '';
    if (!armed) {
      snapBack();
      return;
    }
    if (dx > SWIPE_COMMIT_X) {
      settleSort(card, 'public');
      return;
    }
    if (dx < -SWIPE_COMMIT_X) {
      settleSort(card, 'private');
      return;
    }
    if (!dragMode && dy > SWIPE_COMMIT_Y && Math.abs(dx) < SWIPE_COMMIT_X) {
      settleSort(card, 'delete');
      return;
    }
    snapBack();
  };

  const moveCard = (dx, dy) => {
    const rot = -4 + dx * 0.08;
    const lift = 1.03;
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${lift})`;
  };

  card.addEventListener(
    'pointerdown',
    (e) => {
      if (drag || e.button === 2) return;
      e.preventDefault();
      e.stopPropagation();
      card.setPointerCapture(e.pointerId);
      card.classList.remove('is-enter');
      card.classList.add('is-dragging');
      card.style.animation = 'none';
      hub.classList.add('is-sorting-focus');
      if (hubScroll) hubScroll.style.overflowY = 'hidden';
      setTargets(null, true);
      drag = {
        card,
        id: e.pointerId,
        x0: e.clientX,
        y0: e.clientY,
        dx: 0,
        dy: 0,
        armed: true,
      };
      moveCard(0, 0);
      hint.textContent = dragMode ? t('holdHintDrag') : t('holdHint');
    },
    { passive: false },
  );

  card.addEventListener(
    'pointermove',
    (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      e.preventDefault();
      e.stopPropagation();
      drag.dx = e.clientX - drag.x0;
      drag.dy = e.clientY - drag.y0;
      moveCard(drag.dx, drag.dy);
      setTargets(railModeFromDelta(drag.dx, drag.dy, targetsMode), true);
    },
    { passive: false },
  );

  const up = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const { dx, dy } = drag;
    finishDrag(dx, dy);
  };
  card.addEventListener('pointerup', up);
  card.addEventListener('pointercancel', up);
}

function flyGemIntoSection(photoSrc, toPublic) {
  return new Promise((resolve) => {
    const target = toPublic ? tabPublic : tabHidden;
    const stage = document.getElementById('sortStage');
    const pr = phone.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    const startX = sr.left - pr.left + sr.width / 2 - 70;
    const startY = sr.top - pr.top + 70;
    const endX = tr.left - pr.left + tr.width / 2 - 35;
    const endY = tr.top - pr.top + tr.height / 2 - 40;
    const card = document.createElement('div');
    card.className = 'fly-card is-fly';
    card.innerHTML = `<img src="${photoSrc}" alt="">`;
    card.style.left = `${startX}px`;
    card.style.top = `${startY}px`;
    card.style.width = '140px';
    flyLayer.appendChild(card);
    card.style.transition = `transform ${FLY_MS}ms ${EASE_POPULAR}, opacity ${FLY_MS}ms ${EASE_IN}`;
    requestAnimationFrame(() => {
      card.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.28)`;
      card.style.opacity = '0';
    });
    window.setTimeout(() => {
      card.remove();
      resolve();
    }, FLY_MS + 40);
  });
}

async function settleSort(card, action) {
  const find = pendingSort[0];
  if (!find) return;
  const fly =
    action === 'public'
      ? 'translate(120%, -6%) rotate(16deg)'
      : action === 'private'
        ? 'translate(-120%, -6%) rotate(-16deg)'
        : 'translate(0, 120%) rotate(3deg)';
  card.style.transition = `transform ${SWIPE_SETTLE_MS}ms ${EASE_POPULAR}, opacity ${SWIPE_FADE_MS}ms ${EASE_IN}`;
  card.style.transform = fly;
  card.style.opacity = '0';
  await wait(SWIPE_FADE_MS);
  pendingSort.shift();
  if (action === 'delete') {
    hint.textContent = t('railDelete');
    refreshHub();
    return;
  }
  const gem = findToGem(find, {
    isPublic: action === 'public',
    owned: true,
  });
  if (action === 'public') gem.likes = LIKES_DEMO;
  gems.unshift(gem);
  await flyGemIntoSection(find.photo, action === 'public');
  setSection(action === 'public' ? 'public' : 'hidden');
  hint.textContent = action === 'public' ? t('railPublic') : t('railPrivate');
  refreshHub(gem.id);
  const cell = gemGrid.querySelector(`[data-id="${gem.id}"]`);
  if (cell) cell.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function pickLikedJams(count) {
  const publicGems = gems
    .filter((g) => g.isPublic && publicLikes(g) > 0)
    .slice()
    .sort((a, b) => publicLikes(b) - publicLikes(a));
  const picked = publicGems.slice(0, count);
  while (picked.length < count) {
    const find = CHALLENGE_FINDS[picked.length] || CHALLENGE_FINDS[0];
    const spoof = createSpoofCollectedGem();
    spoof.id = `${SPOOF_COLLECTED_GEM_ID}-${picked.length}`;
    if (find) {
      spoof.imageUri = find.photo;
      spoof.tagline = find.text;
      spoof.title = find.place;
      spoof.authorUsername = String(find.user || '').replace(/^@/, '') || SPOOF_COLLECTED_GEM_AUTHOR;
      spoof.likes = find.likes || LIKES_STACK_SECOND;
    }
    picked.push(spoof);
  }
  return picked;
}

function fillLikesJamCard(card, gem, likesOverride) {
  const els = likesSlotEls(card);
  if (!els.photo) return { likes: 0, rarity: RARITY.cyan };
  els.photo.src = gem.imageUri;
  if (els.user) {
    els.user.textContent = gem.authorUsername ? `@${gem.authorUsername}` : MY_USER;
  }
  if (els.text) {
    els.text.textContent = displayCopy(getGemTagline(gem) || getGemTitle(gem) || '—');
  }
  if (els.place) els.place.textContent = gem.title || '';
  const likes = likesOverride != null ? likesOverride : publicLikes(gem) || LIKES_DEMO;
  const rarity = rarityForLikes(likes, true);
  if (els.count) {
    els.count.innerHTML = `<span class="like-heart" aria-hidden="true">♥</span><span>${t('likesHeart', likes)}</span>`;
  }
  setLikesCardRarity(els, rarity, { pop: false });
  return { likes, rarity, els };
}

function clearLikesStackMotion(cards) {
  cards.forEach((card) => {
    card.classList.remove(
      'is-in',
      'is-out',
      'is-impact',
      'is-rarity-up',
      'is-enter',
      'is-shuffle',
      'is-peek-out',
      'is-front',
      'is-back',
    );
  });
}

function setLikesStackVisible(on) {
  if (!likesJamStack) return;
  likesJamStack.classList.toggle('is-multi', on);
  if (likesJamCardB) {
    likesJamCardB.hidden = !on;
    likesJamCardB.setAttribute('aria-hidden', on ? 'false' : 'true');
  }
}

async function playLikesBanner(opts = {}) {
  if (likesBusy) return;
  likesBusy = true;
  const promote = !!opts.promote;
  const stackOn = (likesStackMode || !!opts.stack) && !promote;
  const cards = [likesJamCard, likesJamCardB].filter(Boolean);
  const gemsForBanner = pickLikedJams(stackOn ? 2 : 1);
  const filled = [];
  setLikesStackVisible(stackOn);
  gemsForBanner.forEach((gem, i) => {
    let likes = publicLikes(gem) || (i === 0 ? LIKES_DEMO : LIKES_STACK_SECOND);
    let rarity = rarityForLikes(likes, true);
    if (promote && i === 0) {
      const target = nextRarity(rarity.id === 'diamond' ? RARITY.platinum : rarity);
      likes = Math.max(0, target.minLikes - 1);
      rarity = rarityForLikes(likes, true);
    }
    const card = cards[i];
    if (!card) return;
    filled.push({
      ...fillLikesJamCard(card, { ...gem, likes, isPublic: true }, likes),
      card,
    });
  });
  const totalLikes = filled.reduce((sum, row) => sum + row.likes, 0);
  likesHeadline.innerHTML = `<span class="likes-rich">${totalLikes} ${t('likesWord')}</span>`;
  likesSubtitle.textContent = stackOn ? t('likesSubtitleStack') : t('likesSubtitle');
  likesBanner.hidden = false;
  likesBanner.classList.remove('is-out');
  likesBanner.classList.add('is-on');
  likesCopy.classList.remove('is-on', 'is-swipe');
  likesShine.classList.remove('is-on');
  clearLikesStackMotion(cards);
  await wait(HAZE_IN_MS);
  likesShine.classList.add('is-on');
  likesCopy.classList.add('is-on');
  if (stackOn && likesJamCard && likesJamCardB) {
    /* daily-side-quests stack: back peeks, front noteDrops, then shuffle */
    likesJamCardB.classList.add('is-back');
    likesJamCard.classList.add('is-front');
    void likesJamCard.offsetWidth;
    likesJamCard.classList.add('is-enter');
    await wait(CARD_IN_MS);
    likesJamCard.classList.add('is-impact');
    await wait(HOLD_AFTER_SHINE_MS);
    likesJamCard.classList.remove('is-enter', 'is-front', 'is-impact');
    likesJamCardB.classList.remove('is-back');
    void likesJamCard.offsetWidth;
    likesJamCard.classList.add('is-peek-out');
    likesJamCardB.classList.add('is-front', 'is-shuffle');
    await wait(LIKES_STACK_SHUFFLE_MS);
    likesJamCardB.classList.add('is-impact');
    await wait(SHINE_MS);
  } else {
    likesJamCard.classList.add('is-in');
    await wait(CARD_IN_MS);
    likesJamCard.classList.add('is-impact');
    if (promote && filled[0]) {
      await wait(HOLD_AFTER_SHINE_MS);
      const promoted = nextRarity(filled[0].rarity);
      const likes = promoted.minLikes;
      likesHeadline.innerHTML = `<span class="likes-rich">${likes} ${t('likesWord')}</span>`;
      if (filled[0].els?.count) {
        filled[0].els.count.innerHTML = `<span class="like-heart" aria-hidden="true">♥</span><span>${t('likesHeart', likes)}</span>`;
      }
      setLikesCardRarity(filled[0].els, promoted, { pop: true });
      likesJamCard.classList.add('is-rarity-up');
      hint.textContent = `[rarity → ${promoted.label}]`;
      await wait(RARITY_PROMOTE_MS);
    } else {
      await wait(SHINE_MS + HOLD_AFTER_SHINE_MS);
    }
  }
  await wait(COPY_CELEBRATE_MS);
  likesCopy.classList.add('is-swipe');
  await wait(TEXT_SWIPE_MS);
  cards.forEach((card) => {
    if (card.hidden) return;
    card.classList.remove('is-enter', 'is-shuffle', 'is-peek-out', 'is-impact', 'is-rarity-up');
    card.classList.add('is-out');
  });
  likesCopy.classList.remove('is-on', 'is-swipe');
  await wait(CARD_OUT_MS);
  likesBanner.classList.add('is-out');
  await wait(HAZE_OUT_MS);
  likesBanner.hidden = true;
  likesBanner.classList.remove('is-on', 'is-out');
  likesShine.classList.remove('is-on');
  likesCopy.classList.remove('is-on', 'is-swipe');
  clearLikesStackMotion(cards);
  setLikesStackVisible(false);
  likesBusy = false;
}

function setLikesStackMode(on) {
  likesStackMode = on;
  setSwitch(debugLikesStack, on);
}

function setSpoofWording(on) {
  spoofWording = on;
  setSwitch(debugSpoof, on);
  refreshHub();
  if (openGemId) openDetail(openGemId);
}

function setDragMode(on) {
  dragMode = on;
  hub.classList.toggle('is-drag-mode', on);
  setSwitch(debugDragMode, on);
  dropHidden.hidden = !on;
  dropPublic.hidden = !on;
  dropHidden.setAttribute('aria-hidden', on ? 'false' : 'true');
  dropPublic.setAttribute('aria-hidden', on ? 'false' : 'true');
  hideTargets();
  applyStaticCopy();
}

function setMidTone(on) {
  setSwitch(midToneOn, on);
  applyMidTone();
}

function resetState() {
  clearMapTips();
  gems = [];
  favouriteGemIds = [];
  likedByGem = {};
  gemSeq = 0;
  feedDismissed = false;
  seedGems();
  seedPendingSort();
  closeDetail();
  storageClear(TIP_KEY);
  storageClear(ONBOARD_KEY);
  showTip(true);
  setSection('public');
  refreshHub();
  hint.textContent = dragMode ? t('holdHintDrag') : t('holdHint');
  runOnboardingTips();
}

function initIcons() {
  railPrivateIcon.innerHTML = gemSvg(HIDDEN_GEM_FILL, { softOutline: true });
  railPublicIcon.innerHTML = gemSvg(PUBLIC_GEM_FILL, { softOutline: true });
  dropHiddenIcon.innerHTML = gemSvg(HIDDEN_GEM_FILL, { softOutline: true });
  dropPublicIcon.innerHTML = gemSvg(PUBLIC_GEM_FILL, { softOutline: true });
  tabPublicIcon.innerHTML = gemSvg(PUBLIC_GEM_FILL);
  tabHiddenIcon.innerHTML = gemSvg(HIDDEN_GEM_FILL);
  const tabLikedIcon = document.querySelector('#tabLiked .tab-like-icon');
  if (tabLikedIcon) tabLikedIcon.innerHTML = heartSvg();
}

function init() {
  initIcons();
  applyAccent();
  applyRadial();
  applyBg();
  applyMidTone();
  seedGems();
  seedPendingSort();
  setupSnapshotArc();
  applyStaticCopy();
  setSection('public');
  refreshHub();
  showTip(!storageGet(TIP_KEY));
  window.setInterval(tickPlaces, ROTATE_MS);
  if (!storageGet(ONBOARD_KEY)) {
    window.setTimeout(() => runOnboardingTips(), 400);
  }
}

document.querySelectorAll('.tab-button').forEach((btn) => {
  btn.addEventListener('click', () => setSection(/** @type {any} */ (btn.dataset.section)));
});
snapshotBtn.addEventListener('click', handleSnapshot);
snapshotTipOk.addEventListener('click', dismissTip);
snapshotTipScrim.addEventListener('click', dismissTip);
detailBack.addEventListener('click', closeDetail);
detailFav.addEventListener('click', () => {
  if (openGemId) toggleFavourite(openGemId);
});
detailNav.addEventListener('click', () => {
  hint.textContent = t('navigateSpoof');
});
detailPublish.addEventListener('click', () => {
  if (openGemId) togglePublish(openGemId);
});
detailAdd.addEventListener('click', addEntryToOpenGem);
detailNoteSkip.addEventListener('click', () => {
  detailNote.value = '';
});
detailLikeBtn.addEventListener('click', toggleDetailLike);
accentColor.addEventListener('input', applyAccent);
accentAlpha.addEventListener('input', applyAccent);
if (radialColor) radialColor.addEventListener('input', applyRadial);
if (radialAmount) radialAmount.addEventListener('input', applyRadial);
if (radialImpact) radialImpact.addEventListener('input', applyRadial);
if (bgColor) bgColor.addEventListener('input', applyBg);
if (bgDepth) bgDepth.addEventListener('input', applyBg);
if (midToneColor) midToneColor.addEventListener('input', applyMidTone);
if (midToneOn) {
  midToneOn.addEventListener('click', () => setMidTone(!midToneEnabled()));
}
resetHub.addEventListener('click', resetState);
debugLikes.addEventListener('click', () => playLikesBanner());
if (debugLikesMulti) {
  debugLikesMulti.addEventListener('click', () => {
    setLikesStackMode(true);
    playLikesBanner({ stack: true });
  });
}
debugRarityUp.addEventListener('click', () => playLikesBanner({ promote: true }));
debugOnboard.addEventListener('click', () => runOnboardingTips());
if (feedDismiss) feedDismiss.addEventListener('click', dismissFeed);
debugSpoof.addEventListener('click', () => setSpoofWording(!spoofWording));
debugDragMode.addEventListener('click', () => setDragMode(!dragMode));
if (debugLikesStack) {
  debugLikesStack.addEventListener('click', () => setLikesStackMode(!likesStackMode));
}
document.querySelectorAll('[data-feed-variant]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setFeedVariant(btn.getAttribute('data-feed-variant') || 'side');
  });
});
bindTipGesture();
bindFeedDismissGesture();
setFeedVariant(feedVariant);

if (new URLSearchParams(location.search).get('embed') === '1') {
  document.body.classList.add('is-embed');
}

window.addEventListener('message', (event) => {
  if (!event || !event.data) return;
  if (event.data.type === 'set-location-gems-accent') {
    const hex = event.data.accent;
    if (typeof hex === 'string' && hex && accentColor) {
      accentColor.value = hex;
      applyAccent();
    }
    return;
  }
  if (event.data.type === 'play-likes') {
    playLikesBanner({ promote: !!event.data.promote });
  }
});

init();
