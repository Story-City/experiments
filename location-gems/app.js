/** Location Gems hub — LOCATION-GEMS-HUB-v157 */
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
/** Outline-only hidden gem from gem-pins ART.hollow (map prototype) */
const HIDDEN_HOLLOW_ART = 'assets/gems/hidden-hollow.svg';
const HOLLOW_GEM_LINE = HIDDEN_GEM_FILL;
/** Melissa's jam categories (gem-pins / 19 Nov) — shape + colour */
/** Melissa’s cats — Figma Component 22 gems (Social Media 2847:469) */
/* Same as gem-pins: eat + shop combined into one Eat & Drink stop */
const JAM_CATS = [
  { id: 'nature', label: 'Nature', colour: '#00CD9D', art: 'assets/gems/nature.svg' },
  { id: 'eat', label: 'Eat & Drink', colour: '#FF4F79', art: 'assets/gems/eat-drink.svg' },
  { id: 'culture', label: 'Culture', colour: '#41C7D8', art: 'assets/gems/art.svg' },
  { id: 'play', label: 'Play', colour: '#F7C85C', art: 'assets/gems/play.svg' },
  { id: 'landmark', label: 'Landmarks', colour: '#F1A638', art: 'assets/gems/landmarks.svg' },
  { id: 'curio', label: 'Curiosities', colour: '#B36BFF', art: 'assets/gems/curiosities.svg' },
];
const JAM_CAT_ALIASES = { shop: 'eat', entertainment: 'play' };
const SORT_CARD_LOOKS = new Set(['polaroid', 'tape', 'tinted', 'overlay']);
const SORT_FRAME_DEFAULT = '#ffffff';
const SORT_CARD_TEXT_DEFAULT = '#1a1230';
/* Figma 2853:555 Variant3 — dark indigo frame + light chin text */
const SORT_TINTED_FRAME = '#13123b';
const SORT_TINTED_TEXT = '#f2eef8';
const SORT_TINT_SHADE_A_DEFAULT = '#7dffd8';
const SORT_TINT_SHADE_B_DEFAULT = '#ff5252';
/* Story.name / Story.summary — server Assert\Length; web-client Title/Tagline */
const PUBLISH_TITLE_MAX = 40;
const PUBLISH_NOTE_MAX = 160;
/** Extra jam cats after the primary pick (debug Subcategories toggle). */
const PUBLISH_EXTRA_CATS_MAX = 2;
/* Feather bookmark — same mark as gem-pins-v2 save-for-later */
const BOOKMARK_PATH = 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z';
const BOOKMARK_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${BOOKMARK_PATH}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
    text: '',
    place: 'Whimsy Walk · near you',
    likes: 0,
    pending: true,
  },
  {
    id: 'find-you-c',
    user: MY_USER,
    photo: 'assets/find-c.jpg',
    text: '[find 3]',
    place: '28 St NW',
    likes: 0,
    pending: true,
  },
];

const ROTATE_MS = 2200;
/** Page-anchor keepers: Original + Loom / Cascade / Tide (Save look persists these). */
const PAGE_ANCHOR_DEFAULT = 'camera';
const PAGE_ANCHOR_VARIANTS = new Set(['camera', 'tide', 'cascade', 'loom']);
const PAGE_ANCHOR_FLOWY = new Set(['tide', 'cascade', 'loom']);
const PAGE_ANCHOR_COPY_ORIGINAL = '[share gems of:]';
const PAGE_ANCHOR_ENTER_MS = 1300;
const PAGE_ANCHOR_BLUR_DEFAULT = 0;
const PAGE_ANCHOR_OPACITY_DEFAULT = 0;
const PAGE_ANCHOR_SIZE_DEFAULT = 100;
const PAGE_ANCHOR_GEM_BLUR_BASE = 1.1;
/** Heading debug default must stay Original. Never boot to slash/erode/soft. */
const HEADING_DEFAULT = 'original';
const HEADING_VARIANTS = new Set(['original', 'slash', 'erode', 'soft']);
const HEADING_SLASH_MS = 520;
const HEADING_SOFT_MS = 900;
/** Place-word motion for the rotating snapshot line. */
const PLACE_MOTION_DEFAULT = 'swap';
const PLACE_MOTION_VARIANTS = new Set(['swap', 'roller', 'shine']);
const PLACE_ROLLER_MS = 620;
const PLACE_SHINE_MS = 720;
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
const SORT_PEEL_MS = 720;
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
  railPrivate: '[keep hidden]',
  railPublic: '[publish]',
  railDelete: '[delete]',
  dropHidden: '[hidden]',
  dropPublic: '[public]',
  likesSubtitle: '[on this gem]',
  likesSubtitleStack: '[on 2 gems]',
  likesWord: '[likes]',
  detailNav: '[navigate]',
  saveLater: '[save for later]',
  savedLater: '[saved for later]',
  detailPublish: '[publish]',
  detailUnpublish: '[unpublish]',
  detailAdd: '[confirm]',
  detailWriteLabel: '[add a few words]',
  detailNotePh: '[optional note]',
  detailReport: '[report]',
  detailReported: '[thanks — we’ll take a look]',
  bannerOwn: '[you can add more anytime]',
  bannerOther: '[you need to be there to add to theirs]',
  holdHint: 'Press + hold, then swipe.',
  holdHintDrag: 'Press + hold, then drag to Hidden or Public.',
  sortTitle: '[sort your finds]',
  sortIntro: '[hold the photo — left hidden, right public, down delete]',
  sortIntroDrag: '[hold the photo — drag onto Hidden or Public]',
  sortIntroRight: '[hold the photo — up to publish, right to keep hidden, down to delete]',
  sortIntroRightMid: '[hold the photo — up to publish, right to delete, down to keep hidden]',
  sortIntroSplit: '[hold the photo — up right to publish, down right to keep hidden, left to delete]',
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
  feedDismiss: '×',
  feedDistance: (minutes) => `${minutes} min away`,
  feedFresh: '[new]',
  feedPromptKicker: '[spot this]',
  publishTip: '[warn address will be shared on publish]',
  publishTitleLabel: '[title]',
  publishTitlePh: '[name the thing you found]',
  publishWriteLabel: '[add a few words]',
  publishNotePh: '[optional note]',
  publishAddressLabel: '[address]',
  publishNext: '[confirm]',
  publishCatPrompt: '[what best describes your jam]',
  publishCatMorePrompt: '[any other categories that apply]',
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
  saveLater: 'Save for later',
  savedLater: 'Saved for later',
  detailPublish: 'Publish',
  detailUnpublish: 'Unpublish',
  detailAdd: 'Confirm',
  detailWriteLabel: 'Add a few words',
  detailNotePh: 'Optional note',
  detailReport: 'Report',
  detailReported: 'Thanks — we’ll take a look',
  bannerOwn: 'You can add more anytime.',
  bannerOther: 'You need to be there to add to theirs.',
  holdHint: 'Press + hold, then swipe.',
  holdHintDrag: 'Press + hold, then drag to Hidden or Public.',
  sortTitle: 'Sort your finds',
  sortIntro: 'Hold the photo — left hidden, right public, down delete.',
  sortIntroDrag: 'Hold the photo — drag onto Hidden or Public.',
  sortIntroRight: 'Hold the photo — up to publish, right to keep hidden, down to delete.',
  sortIntroRightMid: 'Hold the photo — up to publish, right to delete, down to keep hidden.',
  sortIntroSplit: 'Hold the photo — up right to publish, down right to keep hidden, left to delete.',
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
  feedDismiss: '×',
  feedDistance: (minutes) => `${minutes} min away`,
  feedFresh: 'New',
  feedPromptKicker: 'Spot this',
  publishTip: '[warn address will be shared on publish]',
  publishTitleLabel: '[title]',
  publishTitlePh: '[name the thing you found]',
  publishWriteLabel: '[add a few words]',
  publishNotePh: '[optional note]',
  publishAddressLabel: '[address]',
  publishNext: 'Confirm',
  publishCatPrompt: '[what best describes your jam]',
  publishCatMorePrompt: '[any other categories that apply]',
  emptyPublicTitle: 'Nothing public yet',
  emptyPublicBody: 'Publish a find and it’ll show up here.',
  emptyHiddenTitle: 'No hidden gems',
  emptyHiddenBody: 'Keep one just for yourself — it’ll land here.',
  emptyLikedTitle: 'No liked gems yet',
  emptyLikedBody: 'Heart a gem and it’ll show up in Liked.',
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
const snapshotSection = document.getElementById('snapshotSection');
const snapshotBtn = document.getElementById('snapshotBtn');
const snapshotPrefix = document.getElementById('snapshotPrefix');
const taglineBlock = document.getElementById('taglineBlock');
const cameraButton = document.getElementById('cameraButton');
const rotatingWord = document.getElementById('rotatingWord');
const rotatingWordNext = document.getElementById('rotatingWordNext');
const placeRoller = document.getElementById('placeRoller');
const placeRollerTrack = document.getElementById('placeRollerTrack');
const snapshotTip = document.getElementById('snapshotTip');
const snapshotTipOk = document.getElementById('snapshotTipOk');
const snapshotTipScrim = document.getElementById('snapshotTipScrim');
const sectionIntroTitle = document.getElementById('sectionIntroTitle');
const sectionIntroBody = document.getElementById('sectionIntroBody');
const tabPublicIcon = document.getElementById('tabPublicIcon');
const tabHiddenIcon = document.getElementById('tabHiddenIcon');
const detail = document.getElementById('detail');
const detailBack = document.getElementById('detailBack');
const detailPhoto = document.getElementById('detailPhoto');
const detailGemTitle = document.getElementById('detailGemTitle');
const detailTagline = document.getElementById('detailTagline');
const detailAuthor = document.getElementById('detailAuthor');
const detailCaption = document.getElementById('detailCaption');
const detailLikes = document.getElementById('detailLikes');
const detailLikeBtn = document.getElementById('detailLikeBtn');
const detailLikeHeart = document.getElementById('detailLikeHeart');
const detailCatChip = document.getElementById('detailCatChip');
const detailCatGem = document.getElementById('detailCatGem');
const detailCatLabel = document.getElementById('detailCatLabel');
const detailVisChip = document.getElementById('detailVisChip');
const detailRarityChip = document.getElementById('detailRarityChip');
const detailRarityGem = document.getElementById('detailRarityGem');
const detailRarityLabel = document.getElementById('detailRarityLabel');
const detailSectionLabel = document.getElementById('detailSectionLabel');
const detailOverlay = document.querySelector('.detail-overlay');
const detailActions = document.getElementById('detailActions');
const detailNav = document.getElementById('detailNav');
const detailSave = document.getElementById('detailSave');
const detailPublish = document.getElementById('detailPublish');
const detailEntries = document.getElementById('detailEntries');
const detailBanner = document.getElementById('detailBanner');
const detailBannerCopy = document.getElementById('detailBannerCopy');
const detailWrite = document.getElementById('detailWrite');
const detailWriteLabel = document.getElementById('detailWriteLabel');
const detailNote = document.getElementById('detailNote');
const detailNoteCount = document.getElementById('detailNoteCount');
const detailAdd = document.getElementById('detailAdd');
const detailMenu = document.getElementById('detailMenu');
const detailMenuPop = document.getElementById('detailMenuPop');
const detailReport = document.getElementById('detailReport');
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
const sortFrameColor = document.getElementById('sortFrameColor');
const sortTintShadeA = document.getElementById('sortTintShadeA');
const sortTintShadeB = document.getElementById('sortTintShadeB');
const sortCardTextColor = document.getElementById('sortCardTextColor');
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
let feedVariant = 'banner';
let pageAnchor = PAGE_ANCHOR_DEFAULT;
const pageAnchorBlur = document.getElementById('pageAnchorBlur');
const pageAnchorBlurValue = document.getElementById('pageAnchorBlurValue');
const pageAnchorOpacity = document.getElementById('pageAnchorOpacity');
const pageAnchorOpacityValue = document.getElementById('pageAnchorOpacityValue');
const pageAnchorSize = document.getElementById('pageAnchorSize');
const pageAnchorSizeValue = document.getElementById('pageAnchorSizeValue');
let headingLook = HEADING_DEFAULT;
let placeMotion = PLACE_MOTION_DEFAULT;
let hubEdition = 'v1';
let sortCardLook = 'polaroid';
let pendingPublish = null;
let headingSlashTimer = 0;
let headingSoftTimer = 0;
let placeRollTimer = 0;
const FEED_VARIANTS = new Set([
  'banner',
  'overlay',
  'text',
  'wide',
  'caption',
  'peek',
]);
const publishSheet = document.getElementById('publishSheet');
const publishSheetScrim = document.getElementById('publishSheetScrim');
const publishTipWrap = document.getElementById('publishTipWrap');
const publishTipCopy = document.getElementById('publishTipCopy');
const publishAddress = document.getElementById('publishAddress');
const publishAddressText = document.getElementById('publishAddressText');
const publishTitleLabel = document.getElementById('publishTitleLabel');
const publishTitle = document.getElementById('publishTitle');
const publishTitleCount = document.getElementById('publishTitleCount');
const publishWriteLabel = document.getElementById('publishWriteLabel');
const publishNote = document.getElementById('publishNote');
const publishNoteCount = document.getElementById('publishNoteCount');
const publishNext = document.getElementById('publishNext');
const publishStepWords = document.getElementById('publishStepWords');
const publishStepCats = document.getElementById('publishStepCats');
const publishCatPrompt = document.getElementById('publishCatPrompt');
const publishCatGrid = document.getElementById('publishCatGrid');
const publishCatActions = document.getElementById('publishCatActions');
const publishCatNext = document.getElementById('publishCatNext');
const publishPhoto = document.getElementById('publishPhoto');
const hubMeta = document.getElementById('hubMeta');
let publishKbBound = false;
let publishDraft = { title: '', note: '', category: null, extras: [] };
let publishStep = 'cats';
let publishCatPhase = 'primary';
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
const debugSubcats = document.getElementById('debugSubcats');
const debugAppPages = document.getElementById('debugAppPages');
// The same bottom bar as every Gem map pins version (shared/gem-tabbar). Its + camera hands a photo
// to this page: Gems re-reads the hand-off, Map goes back to the version you came from.
const appPagesNav = GemTabBar.mount({
  host: phone,
  active: 'gems',
  onGems: () => takeCameraHandoff(),
  onTab(page) {
    if (page === 'map') {
      location.href = appPagesMapHref();
      return false;
    }
    if (hint) hint.textContent = `[${page} — not in this prototype]`;
    return true;
  },
}).nav;
appPagesNav.hidden = true;
const debugDesignMove = document.getElementById('debugDesignMove');
/** Map page experiment — gated by debug “Gems / Map pages”. */
const APP_PAGES_MAP_HREF = '../gem-pins/?v=36&edition=v2&appPages=1';
const APP_PAGES_EDITION_KEY = 'gem-pins-edition';
function appPagesMapHref() {
  let edition = null;
  try { edition = sessionStorage.getItem(APP_PAGES_EDITION_KEY); } catch (e) { /* private window */ }
  if (!edition) return APP_PAGES_MAP_HREF;
  const url = new URL(APP_PAGES_MAP_HREF, location.href);
  if (edition === 'v1') url.searchParams.delete('edition');
  else url.searchParams.set('edition', edition);
  return url.href;
}
const APP_PAGES_PARAM = 'appPages';
const btnRadius = document.getElementById('btnRadius');
const btnRadiusValue = document.getElementById('btnRadiusValue');
const spaceScale = document.getElementById('spaceScale');
const spaceScaleValue = document.getElementById('spaceScaleValue');
const typeScale = document.getElementById('typeScale');
const typeScaleValue = document.getElementById('typeScaleValue');
const designSelectionLabel = document.getElementById('designSelectionLabel');
const designActions = document.getElementById('designActions');
const designElementScale = document.getElementById('designElementScale');
const designElementScaleValue = document.getElementById('designElementScaleValue');
const designElementPad = document.getElementById('designElementPad');
const designElementPadValue = document.getElementById('designElementPadValue');
const designResetPos = document.getElementById('designResetPos');
const designCenterX = document.getElementById('designCenterX');
const designCenterY = document.getElementById('designCenterY');
const designCenterBoth = document.getElementById('designCenterBoth');
const designLock = document.getElementById('designLock');
const designUnlock = document.getElementById('designUnlock');
const designClearStudio = document.getElementById('designClearStudio');
const designSaveStudio = document.getElementById('designSaveStudio');
const designSaveNote = document.getElementById('designSaveNote');
const designUndo = document.getElementById('designUndo');
const designRedo = document.getElementById('designRedo');
/** Pieces designers can select + drag in Move mode (groups / components). */
/** Top-level groups only — not layout chrome like overlay/info-row (those stole dig clicks). */
const DESIGN_TARGET_SEL = [
  '.camera-button',
  '.tagline-block',
  '.sort-inline-head',
  '.sort-card',
  '.gem-card',
  '.feed-dock',
  '.feed-chip',
  '.detail-actions',
  '.ov-chip',
  '.like-btn',
  '.detail-gem-title',
  '.detail-author',
  '.detail-body',
  '.publish-sheet-card',
  '.publish-cat-btn',
  '.tab-bar',
  '.snapshot-section',
].join(', ');
/** Prefer these when digging so the gem wins over empty wrappers / photo bg. */
const DESIGN_CONTENT_SEL = [
  '.ov-chip-gem',
  '.cat-gem-art',
  '.gem-card-gem',
  '.feed-chip-corner-gem',
  '.publish-cat-gem',
  '.like-heart',
  '.bookmark-btn',
  '.icon-act',
  '.nav-btn',
].join(', ');
/** One-level dig skips these and lands on content inside them. */
const DESIGN_WRAPPER_SEL = [
  '.gem-card-corner',
  '.gem-card-corner-stack',
  '.gem-card-corner-art',
  '.feed-chip-corner',
  '.gem-card-scrim',
  '.detail-media-scrim',
].join(', ');
const DESIGN_DRAG_THRESHOLD_PX = 5;
const BTN_RADIUS_PILL = 24;
const DESIGN_STUDIO_KEY = 'location-gems-design-studio-v1';
const DESIGN_HISTORY_MAX = 40;

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
let subcatsMode = false;
let designMoveMode = false;
/** @type {Set<HTMLElement>} */
let designSelection = new Set();
/** @type {{ els: HTMLElement[], startX: number, startY: number, origins: { el: HTMLElement, x: number, y: number }[] } | null} */
let designDrag = null;
/** @type {{ target: HTMLElement, startX: number, startY: number, pointerId: number } | null} */
let designDragPending = null;
let designSaveTimer = 0;
/** @type {any[]} */
let designHistory = [];
let designHistoryIndex = -1;
let designHistoryMuted = false;
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

function jamCatById(id) {
  const resolved = JAM_CAT_ALIASES[id] || id;
  return JAM_CATS.find((c) => c.id === resolved) || JAM_CATS[0];
}

function nextJamCatId() {
  return JAM_CATS[Math.max(0, gemSeq - 1) % JAM_CATS.length].id;
}

function ensureGemCategory(gem) {
  if (!gem) return JAM_CATS[0];
  gem.category = jamCatById(gem.category || nextJamCatId()).id;
  return jamCatById(gem.category);
}

function categoryGemMark(cat) {
  if (!cat?.art) return '';
  return `<img class="cat-gem-art" src="${cat.art}" alt="" decoding="async">`;
}

function hollowHiddenGemMark() {
  return `<img class="cat-gem-art hollow-gem-art" src="${HIDDEN_HOLLOW_ART}" alt="" decoding="async">`;
}

function gemVisualFill(gem) {
  if (!gem.isPublic) return HIDDEN_GEM_FILL;
  if (gem.category) return jamCatById(gem.category).colour;
  return gemCornerFill(gem);
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
  if (!showRarity()) {
    return { id: 'cyan', fill: PUBLIC_GEM_FILL, label: 'aquamarine', minLikes: 0 };
  }
  const n = Number(likes) || 0;
  if (n >= RARITY.diamond.minLikes) return RARITY.diamond;
  if (n >= RARITY.platinum.minLikes) return RARITY.platinum;
  if (n >= RARITY.gold.minLikes) return RARITY.gold;
  if (n >= RARITY.silver.minLikes) return RARITY.silver;
  return RARITY.cyan;
}

function showRarity() {
  return hubEdition === 'v2';
}

function gemCornerFill(gem) {
  if (!gem.isPublic) return HIDDEN_GEM_FILL;
  if (!showRarity()) return PUBLIC_GEM_FILL;
  return rarityForLikes(gem.likes, true).fill;
}

/* Prototype walk minutes — same “{{minutes}} min away” string as app TravelTime */
const FEED_MINUTES_BY_FIND = {
  'find-mara': 2,
  'find-juniper': 4,
  'find-fox': 6,
};
const SPOOF_FEED_MINUTES = 1;

function createSpoofCollectedGem() {
  gemSeq += 1;
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
    category: nextJamCatId(),
    minutesAway: SPOOF_FEED_MINUTES,
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
    entries: [COPY.spoofCollectedReflection, '[another note left at this gem]'],
  };
}

function findToGem(find, opts) {
  gemSeq += 1;
  const cat = jamCatById(opts.category || nextJamCatId()).id;
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
    category: cat,
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
  sortIntro.textContent = isSortRight() ? t(sortRightIntroKey()) : dragMode ? t('sortIntroDrag') : t('sortIntro');
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
  if (detailSave) {
    detailSave.innerHTML = BOOKMARK_ICON;
    detailSave.setAttribute('aria-label', t('saveLater'));
    if (openGemId) syncDetailSave();
  }
  detailAdd.textContent = t('detailAdd');
  detailWriteLabel.textContent = t('detailWriteLabel');
  if (detailNote) {
    detailNote.placeholder = t('detailNotePh');
    detailNote.maxLength = PUBLISH_NOTE_MAX;
  }
  if (detailReport) detailReport.textContent = t('detailReport');
  detailSectionLabel.textContent = t('descriptionLabel');
  likesSubtitle.textContent = t('likesSubtitle');
  sortEmpty.textContent = t('sortEmpty');
  hint.textContent = isSortRight() ? t(sortRightIntroKey()) : dragMode ? t('holdHintDrag') : t('holdHint');
  syncDetailNoteCount();
  syncSectionIntro();
}

function syncDetailNoteCount() {
  if (detailNoteCount && detailNote) {
    detailNoteCount.textContent = `${detailNote.value.length}/${PUBLISH_NOTE_MAX}`;
  }
}

function setDetailMenuOpen(on) {
  if (!detailMenuPop || !detailMenu) return;
  detailMenuPop.hidden = !on;
  detailMenu.setAttribute('aria-expanded', on ? 'true' : 'false');
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
  /* Mid tone drives unsorted frame for Polaroid only — other looks stay tinted */
  const useMidForFrame =
    on && midToneColor && midToneColor.value && sortCardLook === 'polaroid';
  const frame = useMidForFrame
    ? midToneColor.value
    : (sortFrameColor && sortFrameColor.value) || SORT_FRAME_DEFAULT;
  document.documentElement.style.setProperty('--sort-frame', frame);
  if (sortFrameColor && useMidForFrame) sortFrameColor.value = frame;
}

function applySortCardText() {
  const hex = (sortCardTextColor && sortCardTextColor.value) || SORT_CARD_TEXT_DEFAULT;
  document.documentElement.style.setProperty('--sort-card-text', hex);
}

function applySortTintShades() {
  const a = (sortTintShadeA && sortTintShadeA.value) || SORT_TINT_SHADE_A_DEFAULT;
  const b = (sortTintShadeB && sortTintShadeB.value) || SORT_TINT_SHADE_B_DEFAULT;
  document.documentElement.style.setProperty('--sort-tint-a', a);
  document.documentElement.style.setProperty('--sort-tint-b', b);
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
    els.rarity.hidden = !showRarity() || rarity.id === 'cyan';
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
  const cat = ensureGemCategory(gem);
  const hidden = !gem.isPublic;
  const line = hidden ? HOLLOW_GEM_LINE : cat.colour;
  const wrap = document.createElement('div');
  wrap.className = 'gem-card';
  if (opts.enter) wrap.classList.add('is-enter');
  wrap.style.setProperty('--gem-line', line);
  const img = document.createElement('img');
  img.className = 'gem-card-photo';
  img.src = gem.imageUri;
  img.alt = '';
  img.decoding = 'async';
  wrap.appendChild(img);
  const scrim = document.createElement('div');
  scrim.className = 'gem-card-scrim';
  wrap.appendChild(scrim);
  if (showRarity() && gem.isPublic && rarity.id !== 'cyan') {
    const rarityEl = document.createElement('span');
    rarityEl.className = `gem-card-rarity is-${rarity.id}`;
    rarityEl.textContent = rarity.label;
    wrap.appendChild(rarityEl);
  }
  /* Public: category Figma gem. Hidden: map-prototype hollow outline gem. */
  const corner = document.createElement('div');
  corner.className = 'gem-card-corner';
  const art = document.createElement('div');
  art.className = 'gem-card-corner-art';
  art.setAttribute('aria-hidden', 'true');
  art.innerHTML = cornerRibbonHtml(line, gem.id || (hidden ? 'hidden' : cat.id));
  corner.appendChild(art);
  const stack = document.createElement('div');
  stack.className = 'gem-card-corner-stack';
  const gemEl = document.createElement('span');
  gemEl.className = hidden ? 'gem-card-gem is-hollow' : 'gem-card-gem';
  if (!hidden && showRarity() && rarity.id !== 'cyan') {
    gemEl.classList.add(`is-${rarity.id}`);
  }
  gemEl.innerHTML = hidden ? hollowHiddenGemMark() : categoryGemMark(cat);
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

function syncSaveBtn(btn, gemId) {
  if (!btn) return;
  const on = isFavourite(gemId);
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.setAttribute('aria-label', on ? t('savedLater') : t('saveLater'));
  if (btn.classList.contains('bookmark-btn') || btn.classList.contains('icon-act')) {
    btn.innerHTML = BOOKMARK_ICON;
    return;
  }
  btn.textContent = on ? t('savedLater') : t('saveLater');
}

function bindFeedChipActions(chip, g) {
  const go = chip.querySelector('.feed-chip-go, .nav-btn');
  if (go) {
    go.addEventListener('click', (e) => {
      e.stopPropagation();
      hint.textContent = t('navigateSpoof');
      openDetail(g.id);
    });
  }
  const save = chip.querySelector('.bookmark-btn, .save-btn');
  if (save) {
    syncSaveBtn(save, g.id);
    save.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavourite(g.id);
      syncSaveBtn(save, g.id);
      if (openGemId === g.id) syncDetailSave();
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

function feedCornerHtml(gem, rarity, uid) {
  const cat = ensureGemCategory(gem);
  return `
    <div class="feed-chip-corner" aria-hidden="true">
      <div class="feed-chip-corner-art">${cornerRibbonHtml(cat.colour, uid)}</div>
      <div class="feed-chip-corner-stack">
        <span class="feed-chip-corner-gem">${categoryGemMark(cat)}</span>
      </div>
    </div>`;
}

function buildFeedChip(g, variant) {
  const rarity = rarityForLikes(g.likes, true);
  const minutes = Number(g.minutesAway);
  const dist =
    Number.isFinite(minutes) && minutes >= 0
      ? t('feedDistance', minutes)
      : t('gemNearby');
  const rarityWord =
    showRarity() && rarity.id !== 'cyan'
      ? `<p class="feed-chip-rarity-word is-${rarity.id}">${rarity.label}</p>`
      : '';
  const actions = `
    <div class="feed-chip-actions">
      <button type="button" class="nav-btn is-compact">${t('detailNav')}</button>
      <button type="button" class="icon-act bookmark-btn" aria-pressed="false" aria-label="${t('saveLater')}"></button>
    </div>`;
  const corner = feedCornerHtml(g, rarity, `feed-${g.id || rarity.id}`);
  const copyBlock = `
    <div class="feed-chip-copy">
      <p class="feed-chip-dist">${dist}</p>
      ${rarityWord}
    </div>`;
  const chip = document.createElement('article');
  chip.className = `feed-chip is-${variant}`;
  chip.style.setProperty('--gem-line', gemVisualFill(g));
  chip.setAttribute('role', 'button');
  chip.tabIndex = 0;
  chip.setAttribute(
    'aria-label',
    `${dist}${showRarity() && rarity.id !== 'cyan' ? `, ${rarity.label}` : ''}`,
  );

  const promptLine = g.caption || g.tagline || g.title || '';
  const captionPromptBlock = `
    <p class="feed-chip-prompt-kicker">${t('feedPromptKicker')}</p>
    <p class="feed-chip-prompt">${promptLine}</p>`;
  if (variant === 'text') {
    chip.innerHTML = `
      <div class="feed-chip-prompt-panel">
        <p class="feed-chip-prompt-kicker">${dist}</p>
        <p class="feed-chip-prompt">${promptLine}</p>
        <div class="feed-chip-prompt-foot">
          ${rarityWord}
        </div>
        ${actions}
      </div>
      ${corner}`;
  } else if (variant === 'caption') {
    chip.innerHTML = `
      <div class="feed-chip-shot">
        <img src="${g.imageUri}" alt="">
        <div class="feed-chip-fade" aria-hidden="true"></div>
      </div>
      <div class="feed-chip-body is-on-photo is-caption">
        <div class="feed-chip-caption-copy">
          ${captionPromptBlock}
          ${copyBlock}
        </div>
        ${actions}
      </div>
      ${corner}`;
  } else if (variant === 'peek') {
    chip.innerHTML = `
      <div class="feed-chip-shot">
        <img src="${g.imageUri}" alt="">
        <div class="feed-chip-fade" aria-hidden="true"></div>
      </div>
      <div class="feed-chip-body is-peek">
        <div class="feed-chip-caption-copy">
          <p class="feed-chip-prompt">${promptLine}</p>
          ${copyBlock}
        </div>
        ${actions}
      </div>
      ${corner}`;
  } else if (variant === 'overlay') {
    chip.innerHTML = `
      <div class="feed-chip-shot">
        <img src="${g.imageUri}" alt="">
        <div class="feed-chip-fade" aria-hidden="true"></div>
      </div>
      <div class="feed-chip-body is-on-photo">
        ${copyBlock}
        ${actions}
      </div>
      ${corner}`;
  } else {
    chip.innerHTML = `
      <div class="feed-chip-shot">
        <img src="${g.imageUri}" alt="">
        <div class="feed-chip-fade" aria-hidden="true"></div>
      </div>
      <div class="feed-chip-body">
        ${copyBlock}
        ${actions}
      </div>
      ${corner}`;
  }
  bindFeedChipActions(chip, g);
  return chip;
}

function setFeedVariant(variant) {
  const next = FEED_VARIANTS.has(variant) ? variant : 'banner';
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
    emptyIcon.innerHTML =
      activeSection === 'hidden'
        ? hollowHiddenGemMark()
        : gemSvg(PUBLIC_GEM_FILL, { softOutline: true });
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
  const look = SORT_CARD_LOOKS.has(sortCardLook) ? sortCardLook : 'polaroid';
  const words = String(find.text || '').trim();
  const hasWords = !!words;
  const isPolaroidFrame = look === 'polaroid' || look === 'tape' || look === 'tinted';
  const isTintedFrame = look === 'tinted' || look === 'tape';
  const card = document.createElement('article');
  card.className = `sort-card is-${look}${isPolaroidFrame ? ' is-polaroid' : ''}${isTintedFrame ? ' is-tinted' : ''}${hasWords ? ' has-words' : ' no-words'}${under ? ' is-under' : ''}${enter ? ' is-enter' : ''}`;
  card.dataset.id = find.id;
  card.style.setProperty('--gem-line', PUBLIC_GEM_FILL);
  /* Figma 2850:550 — asset tape; 2853:555 — rotated translucent strip */
  let tape = '';
  if (look === 'tape') {
    tape = `<img class="sort-card-tape" src="assets/polaroid_tape.svg" alt="" draggable="false" aria-hidden="true">`;
  } else if (look === 'tinted') {
    tape = `<span class="sort-card-tape-strip" aria-hidden="true"></span>`;
  }
  const textBlock = hasWords
    ? `<p class="sort-card-text">${displayCopy(words)}</p>`
    : '';
  /* Address always present on unsorted cards */
  const body = `
    <div class="sort-card-body">
      <p class="sort-card-user">${find.user}</p>
      ${textBlock}
      <p class="sort-card-place"><span class="sort-card-place-icon" aria-hidden="true"></span>${displayCopy(find.place)}</p>
    </div>`;
  if (look === 'overlay') {
    card.innerHTML = `
      <div class="sort-card-media">
        <img class="sort-card-photo" src="${find.photo}" alt="" draggable="false">
        <div class="sort-card-fade" aria-hidden="true"></div>
        ${body}
      </div>`;
  } else {
    card.innerHTML = `
      ${tape}
      <div class="sort-card-media">
        <img class="sort-card-photo" src="${find.photo}" alt="" draggable="false">
      </div>
      ${body}`;
  }
  return card;
}

function applySortLookFrameDefaults(look) {
  if (!sortFrameColor || !sortCardTextColor) return;
  if (look === 'tinted' || look === 'overlay' || look === 'tape') {
    /* Other looks tinted — Polaroid stays the plain first option */
    sortFrameColor.value = SORT_TINTED_FRAME;
    sortCardTextColor.value = SORT_TINTED_TEXT;
  } else if (look === 'polaroid') {
    sortFrameColor.value = SORT_FRAME_DEFAULT;
    sortCardTextColor.value = SORT_CARD_TEXT_DEFAULT;
  } else {
    return;
  }
  document.documentElement.style.setProperty('--sort-frame', sortFrameColor.value);
  applySortCardText();
  applyMidTone();
}

function setSortCardLook(look) {
  const next = SORT_CARD_LOOKS.has(look) ? look : 'polaroid';
  sortCardLook = next;
  document.body.classList.toggle('is-sort-look-polaroid', next === 'polaroid');
  document.querySelectorAll('[data-sort-look]').forEach((btn) => {
    const on = btn.getAttribute('data-sort-look') === next;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  applySortLookFrameDefaults(next);
  renderSortStack();
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
  const studio = readDesignStudio();
  if (studio?.positions) applyDesignPositions(studio.positions);
  if (designMoveMode) markDesignTargets(true);
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
  syncDetailSave();
}

function syncDetailSave() {
  if (!detailSave || !openGemId) return;
  syncSaveBtn(detailSave, openGemId);
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
    if (detailNote) {
      detailNote.placeholder = t('detailNotePh');
      detailNote.maxLength = PUBLISH_NOTE_MAX;
      detailNote.value = '';
    }
    detailAdd.textContent = t('detailAdd');
    syncDetailNoteCount();
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
  /* Hollow until this person likes it — count can still be > 0 */
  detailLikeHeart.textContent = liked ? '♥' : '♡';
  detailLikeBtn.classList.toggle('is-liked', liked);
}

function openDetail(id) {
  const gem = findGem(id);
  if (!gem) return;
  openGemId = id;
  const del = document.getElementById('detailDelete');
  if (del) del.hidden = !gem.owned;
  const rarity = rarityForLikes(gem.likes, gem.isPublic);
  const cat = ensureGemCategory(gem);
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
  if (detailCatChip && detailCatGem && detailCatLabel) {
    detailCatChip.hidden = false;
    detailCatChip.style.setProperty('--cat-fill', cat.colour);
    detailCatGem.innerHTML = categoryGemMark(cat);
    detailCatLabel.textContent = cat.label;
  }
  detailVisChip.hidden = false;
  detailVisChip.textContent = gem.isPublic ? t('publicBadge') : t('privateBadge');
  if (detailOverlay) {
    detailOverlay.style.setProperty('--rarity-glow', rarity.fill);
  }
  /* Rarity is a public-likes tier — V2 only */
  if (showRarity() && gem.isPublic && rarity.id !== 'cyan') {
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
  if (detailActions) detailActions.hidden = false;
  if (detailNav) detailNav.textContent = t('detailNav');
  setDetailMenuOpen(false);
  syncDetailLike(gem);
  renderDetailEntries(gem);
  syncDetailSave();
  detail.hidden = false;
  detail.setAttribute('aria-hidden', 'false');
}

function closeDetail() {
  openGemId = null;
  setDetailMenuOpen(false);
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
  const note = (detailNote?.value || '').trim().slice(0, PUBLISH_NOTE_MAX);
  if (!note) return;
  gem.entries.push(note);
  if (detailNote) detailNote.value = '';
  syncDetailNoteCount();
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
    category: nextJamCatId(),
    createdAt: new Date().toISOString(),
    entries: ['[snapshot gem from hub camera]'],
  };
  gems.unshift(gem);
  setSection('hidden');
  refreshHub(gem.id);
}

function handleSnapshot() {
  if (document.body.classList.contains('is-v3')) return; // V3 has no camera up top
  if (!snapshotTip.hidden) dismissTip();
  addSampleCreatedGem();
}

function tickPlaces() {
  const nextIndex = (placeIndex + 1) % SNAPSHOT_PLACES.length;
  const nextText = SNAPSHOT_PLACES[nextIndex];
  if (placeMotion === 'roller') {
    playPlaceRoller(nextText);
  } else if (placeMotion === 'shine') {
    playPlaceShine(nextText);
  } else if (rotatingWord) {
    rotatingWord.textContent = nextText;
  }
  placeIndex = nextIndex;
  playHeadingPlaceMotion();
}

function resetPlaceRollerTrack() {
  if (!placeRoller || !placeRollerTrack || !rotatingWord) return;
  placeRoller.classList.remove('is-rolling', 'is-shining');
  placeRollerTrack.style.transition = 'none';
  placeRollerTrack.style.transform = 'translate3d(0, 0, 0)';
  if (rotatingWordNext) rotatingWordNext.textContent = '';
}

function playPlaceRoller(nextText) {
  if (!placeRoller || !placeRollerTrack || !rotatingWord || !rotatingWordNext) {
    if (rotatingWord) rotatingWord.textContent = nextText;
    return;
  }
  window.clearTimeout(placeRollTimer);
  rotatingWordNext.textContent = nextText;
  placeRoller.classList.remove('is-rolling');
  placeRollerTrack.style.transition = 'none';
  placeRollerTrack.style.transform = 'translate3d(0, 0, 0)';
  void placeRollerTrack.offsetWidth;
  placeRoller.classList.add('is-rolling');
  placeRollTimer = window.setTimeout(() => {
    rotatingWord.textContent = nextText;
    rotatingWordNext.textContent = '';
    placeRoller.classList.remove('is-rolling');
    placeRollerTrack.style.transition = 'none';
    placeRollerTrack.style.transform = 'translate3d(0, 0, 0)';
  }, PLACE_ROLLER_MS);
}

function playPlaceShine(nextText) {
  if (!placeRoller || !rotatingWord) {
    if (rotatingWord) rotatingWord.textContent = nextText;
    return;
  }
  window.clearTimeout(placeRollTimer);
  rotatingWord.textContent = nextText;
  placeRoller.classList.remove('is-shining');
  void placeRoller.offsetWidth;
  placeRoller.classList.add('is-shining');
  placeRollTimer = window.setTimeout(() => {
    placeRoller.classList.remove('is-shining');
  }, PLACE_SHINE_MS);
}

function setPlaceMotion(variant) {
  const next = PLACE_MOTION_VARIANTS.has(variant) ? variant : PLACE_MOTION_DEFAULT;
  placeMotion = next;
  resetPlaceRollerTrack();
  /* Motion only — keep live accent/type; leave Heading font trials on Original */
  if (headingLook !== HEADING_DEFAULT) setHeadingLook(HEADING_DEFAULT);
  if (taglineBlock) taglineBlock.dataset.placeMotion = next;
  document.querySelectorAll('.variant-btn[data-place-motion]').forEach((btn) => {
    const on = btn.getAttribute('data-place-motion') === next;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function playHeadingPlaceMotion() {
  if (!taglineBlock) return;
  if (headingLook === 'slash') {
    taglineBlock.classList.remove('is-slashing');
    void taglineBlock.offsetWidth;
    taglineBlock.classList.add('is-slashing');
    window.clearTimeout(headingSlashTimer);
    headingSlashTimer = window.setTimeout(() => {
      taglineBlock.classList.remove('is-slashing');
    }, HEADING_SLASH_MS);
  } else if (headingLook === 'soft') {
    taglineBlock.classList.remove('is-soft-in');
    void taglineBlock.offsetWidth;
    taglineBlock.classList.add('is-soft-in');
    window.clearTimeout(headingSoftTimer);
    headingSoftTimer = window.setTimeout(() => {
      taglineBlock.classList.remove('is-soft-in');
    }, HEADING_SOFT_MS);
  }
}

function setHeadingLook(variant) {
  const next = HEADING_VARIANTS.has(variant) ? variant : HEADING_DEFAULT;
  headingLook = next;
  if (taglineBlock) {
    taglineBlock.dataset.heading = next;
    taglineBlock.classList.remove('is-slashing', 'is-soft-in');
  }
  document.querySelectorAll('.variant-btn[data-heading]').forEach((btn) => {
    const on = btn.getAttribute('data-heading') === next;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  if (next === 'slash' || next === 'soft') playHeadingPlaceMotion();
}

let pageAnchorEnterTimer = 0;
let pageAnchorDriftRo = null;

function fillPageAnchorGems() {
  const gems = document.getElementById('pageAnchorGems');
  if (!gems || gems.childElementCount) return;
  /* All jam crystal categories — same art as hub / RN gems */
  JAM_CATS.forEach((cat) => {
    const wrap = document.createElement('span');
    wrap.className = 'page-anchor-gem';
    wrap.dataset.cat = cat.id;
    wrap.innerHTML = categoryGemMark(cat);
    gems.appendChild(wrap);
  });
}

/** RN-adaptive travel: layout width → --pa-drift-travel (maps to onLayout in RN). */
function syncPageAnchorDriftTravel() {
  const layer = document.getElementById('pageAnchorLayer');
  if (!layer) return;
  const travel = Math.round(layer.getBoundingClientRect().width + 56);
  layer.style.setProperty('--pa-drift-travel', `${Math.max(280, travel)}px`);
}

function ensurePageAnchorDriftObserver() {
  const layer = document.getElementById('pageAnchorLayer');
  if (!layer || pageAnchorDriftRo) return;
  syncPageAnchorDriftTravel();
  if (typeof ResizeObserver === 'function') {
    pageAnchorDriftRo = new ResizeObserver(() => syncPageAnchorDriftTravel());
    pageAnchorDriftRo.observe(layer);
  } else {
    window.addEventListener('resize', syncPageAnchorDriftTravel);
  }
}

function setPageAnchor(variant) {
  const next = PAGE_ANCHOR_VARIANTS.has(variant) ? variant : PAGE_ANCHOR_DEFAULT;
  const flowy = PAGE_ANCHOR_FLOWY.has(next);
  pageAnchor = next;
  if (flowy) fillPageAnchorGems();
  if (hub) {
    hub.dataset.pageAnchor = next;
    hub.classList.toggle('is-page-anchor-flow', flowy);
    hub.classList.remove('is-page-anchor-enter');
    window.clearTimeout(pageAnchorEnterTimer);
    if (flowy) {
      ensurePageAnchorDriftObserver();
      syncPageAnchorDriftTravel();
      void hub.offsetWidth;
      hub.classList.add('is-page-anchor-enter');
      pageAnchorEnterTimer = window.setTimeout(() => {
        hub.classList.remove('is-page-anchor-enter');
      }, PAGE_ANCHOR_ENTER_MS);
    }
  }
  if (snapshotSection) snapshotSection.dataset.pageAnchor = next;
  document.querySelectorAll('.variant-btn[data-page-anchor]').forEach((btn) => {
    const on = btn.getAttribute('data-page-anchor') === next;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  if (snapshotPrefix) snapshotPrefix.textContent = displayCopy(PAGE_ANCHOR_COPY_ORIGINAL);
  if (snapshotBtn) snapshotBtn.setAttribute('aria-label', displayCopy(PAGE_ANCHOR_COPY_ORIGINAL));
  applyPageAnchorFx();
}

function formatSigned(n, suffix = '') {
  const v = Math.round(n);
  return `${v > 0 ? '+' : ''}${v}${suffix}`;
}

function applyPageAnchorFx() {
  const blurSigned = pageAnchorBlur
    ? Math.max(-12, Math.min(12, Number(pageAnchorBlur.value) || 0))
    : PAGE_ANCHOR_BLUR_DEFAULT;
  const opacitySigned = pageAnchorOpacity
    ? Math.max(-100, Math.min(100, Number(pageAnchorOpacity.value) || 0))
    : PAGE_ANCHOR_OPACITY_DEFAULT;
  const sizePct = pageAnchorSize
    ? Math.max(40, Math.min(220, Number(pageAnchorSize.value) || 100))
    : PAGE_ANCHOR_SIZE_DEFAULT;
  if (pageAnchorBlurValue) pageAnchorBlurValue.textContent = formatSigned(blurSigned);
  if (pageAnchorOpacityValue) pageAnchorOpacityValue.textContent = formatSigned(opacitySigned);
  if (pageAnchorSizeValue) pageAnchorSizeValue.textContent = `${Math.round(sizePct)}%`;
  const layer = document.getElementById('pageAnchorLayer');
  if (!layer) return;
  /* Center 0 = current look; + blur softens layer; − unblurs crystal base soft */
  const layerBlur = blurSigned > 0 ? blurSigned : 0;
  const gemBlur =
    blurSigned < 0
      ? Math.max(0, PAGE_ANCHOR_GEM_BLUR_BASE + blurSigned * (PAGE_ANCHOR_GEM_BLUR_BASE / 12))
      : PAGE_ANCHOR_GEM_BLUR_BASE;
  const layerOpacity = opacitySigned < 0 ? Math.max(0, 1 + opacitySigned / 100) : 1;
  const gemGain = opacitySigned > 0 ? 1 + opacitySigned / 100 : 1;
  layer.style.setProperty('--pa-blur', `${layerBlur}px`);
  layer.style.setProperty('--pa-gem-blur', `${gemBlur.toFixed(2)}px`);
  layer.style.setProperty('--pa-opacity', String(layerOpacity));
  layer.style.setProperty('--pa-gem-gain', String(gemGain));
  layer.style.setProperty('--pa-gem-scale', String(sizePct / 100));
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

function bindSwipeDismissTip(el, isActive, onDismiss) {
  if (!el) return;
  let startX = 0;
  let dragging = false;
  el.addEventListener('pointerdown', (e) => {
    if (!isActive()) return;
    el.setPointerCapture(e.pointerId);
    startX = e.clientX;
    dragging = true;
    el.style.transition = 'none';
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = Math.max(0, e.clientX - startX);
    el.style.transform = `translateX(${dx}px)`;
  });
  el.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    el.style.transition = '';
    const dx = e.clientX - startX;
    if (dx >= TIP_SWIPE_DISMISS_PX || Math.abs(dx) <= TIP_TAP_SLOP_PX) {
      onDismiss();
      return;
    }
    el.style.transform = '';
  });
  el.addEventListener('pointercancel', () => {
    if (!dragging) return;
    dragging = false;
    el.style.transition = '';
    el.style.transform = '';
  });
}

function bindTipGesture() {
  bindSwipeDismissTip(
    mapTip,
    () => !spot.hidden && mapTip.classList.contains('is-on'),
    () => advanceMapTip(),
  );
  spot.addEventListener('click', (e) => {
    if (e.target === spot) advanceMapTip();
  });
  bindSwipeDismissTip(
    publishTipWrap,
    () =>
      !!(
        publishTipWrap &&
        !publishTipWrap.hidden &&
        publishTipWrap.classList.contains('is-on')
      ),
    () => hidePublishTip(),
  );
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
    card.style.transform = `rotate(${sortCardTilt()}deg)`;
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
      openPublishSheet(card);
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
    const rot = isSortRight() ? 0 : -4 + dx * 0.08;
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
      hint.textContent = isSortRight() ? t(sortRightIntroKey()) : dragMode ? t('holdHintDrag') : t('holdHint');
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
      setTargets(isSortRight() ? sortRightModeFromDelta(drag.dx, drag.dy) : railModeFromDelta(drag.dx, drag.dy, targetsMode), true);
    },
    { passive: false },
  );

  const finishRightDrag = (mode) => {
    drag = null;
    setTargets(null, false);
    setSortingFocus(false);
    if (hubScroll) hubScroll.style.overflowY = '';
    if (mode === 'public') openPublishSheet(card);
    else if (mode === 'private' || mode === 'delete') settleSort(card, mode);
    else snapBack();
  };

  const up = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    if (isSortRight()) {
      finishRightDrag(targetsMode);
      return;
    }
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

function syncPublishSheetCopy() {
  if (publishTipCopy) publishTipCopy.textContent = t('publishTip');
  if (publishTitleLabel) publishTitleLabel.textContent = t('publishTitleLabel');
  if (publishTitle) {
    publishTitle.placeholder = t('publishTitlePh');
    publishTitle.maxLength = PUBLISH_TITLE_MAX;
  }
  if (publishWriteLabel) publishWriteLabel.textContent = t('publishWriteLabel');
  if (publishNote) {
    publishNote.placeholder = t('publishNotePh');
    publishNote.maxLength = PUBLISH_NOTE_MAX;
  }
  if (publishNext) publishNext.textContent = t('publishNext');
  if (publishCatNext) publishCatNext.textContent = t('publishNext');
  syncPublishCatPrompt();
  syncPublishCharCounts();
}

function syncPublishCatPrompt() {
  if (!publishCatPrompt) return;
  const more = subcatsMode && publishCatPhase === 'extras';
  publishCatPrompt.textContent = more ? t('publishCatMorePrompt') : t('publishCatPrompt');
}

function syncPublishCatSelection() {
  if (!publishCatGrid) return;
  const primary = publishDraft.category;
  const extras = publishDraft.extras || [];
  publishCatGrid.querySelectorAll('.publish-cat-btn').forEach((btn) => {
    const id = btn.dataset.catId;
    const isPrimary = id === primary;
    const isExtra = extras.includes(id);
    btn.classList.toggle('is-on', isPrimary || isExtra);
    btn.classList.toggle('is-primary', isPrimary);
    btn.setAttribute('aria-selected', isPrimary || isExtra ? 'true' : 'false');
  });
  if (publishCatActions) {
    const show = subcatsMode && publishCatPhase === 'extras' && !!primary;
    publishCatActions.hidden = !show;
  }
  syncPublishCatPrompt();
}

function handlePublishCatPick(catId) {
  if (!pendingPublish) return;
  if (!subcatsMode) {
    goPublishWordsStep(catId);
    return;
  }
  if (publishCatPhase === 'primary' || !publishDraft.category) {
    publishDraft.category = catId;
    publishDraft.extras = [];
    publishCatPhase = 'extras';
    syncPublishCatSelection();
    return;
  }
  if (catId === publishDraft.category) return;
  const extras = publishDraft.extras || [];
  const idx = extras.indexOf(catId);
  if (idx >= 0) {
    extras.splice(idx, 1);
  } else if (extras.length < PUBLISH_EXTRA_CATS_MAX) {
    extras.push(catId);
  }
  publishDraft.extras = extras;
  syncPublishCatSelection();
}

function syncPublishCharCounts() {
  if (publishTitleCount && publishTitle) {
    publishTitleCount.textContent = `${publishTitle.value.length}/${PUBLISH_TITLE_MAX}`;
  }
  if (publishNoteCount && publishNote) {
    publishNoteCount.textContent = `${publishNote.value.length}/${PUBLISH_NOTE_MAX}`;
  }
}

function syncPublishAddress(find) {
  const place = find?.place || '';
  if (publishAddressText) publishAddressText.textContent = place;
  if (publishAddress) publishAddress.hidden = !place;
}

function syncPublishKeyboard() {
  if (!publishSheet || publishSheet.hidden) return;
  const vv = window.visualViewport;
  if (!vv || !phone) {
    publishSheet.style.setProperty('--kb', '0px');
    return;
  }
  /* Sheet lives inside .phone — measure how much of the phone bottom the keyboard covers */
  const phoneBottom = phone.getBoundingClientRect().bottom;
  const visibleBottom = vv.offsetTop + vv.height;
  const occluded = Math.max(0, Math.round(phoneBottom - visibleBottom));
  publishSheet.style.setProperty('--kb', `${occluded}px`);
}

function bindPublishKeyboard() {
  if (publishKbBound || !window.visualViewport) return;
  publishKbBound = true;
  window.visualViewport.addEventListener('resize', syncPublishKeyboard);
  window.visualViewport.addEventListener('scroll', syncPublishKeyboard);
}

function showPublishTip() {
  if (!publishTipWrap || !publishTipCopy) return;
  publishTipCopy.textContent = t('publishTip');
  publishTipCopy.classList.remove('is-swap');
  void publishTipCopy.offsetWidth;
  publishTipCopy.classList.add('is-swap');
  publishTipWrap.hidden = false;
  publishTipWrap.classList.remove('is-dismissing');
  publishTipWrap.style.transform = '';
  void publishTipWrap.offsetWidth;
  publishTipWrap.classList.add('is-on');
}

function hidePublishTip() {
  if (!publishTipWrap || publishTipWrap.hidden) return;
  publishTipWrap.classList.remove('is-on');
  publishTipWrap.classList.add('is-dismissing');
  window.setTimeout(() => {
    publishTipWrap.hidden = true;
    publishTipWrap.classList.remove('is-dismissing');
    publishTipWrap.style.transform = '';
  }, 280);
}

function setPublishStep(step) {
  publishStep = step === 'words' ? 'words' : 'cats';
  const words = publishStep === 'words';
  if (publishStepWords) publishStepWords.hidden = !words;
  if (publishStepCats) publishStepCats.hidden = words;
  if (publishSheet) {
    publishSheet.classList.toggle('is-words', words);
    publishSheet.classList.toggle('is-cats', !words);
  }
  if (!words) {
    renderPublishCats();
    hidePublishTip();
  } else {
    showPublishTip();
  }
  syncPublishKeyboard();
}

function renderPublishCats() {
  if (!publishCatGrid) return;
  publishCatGrid.replaceChildren();
  publishCatGrid.setAttribute('aria-multiselectable', subcatsMode ? 'true' : 'false');
  JAM_CATS.forEach((cat) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'publish-cat-btn';
    btn.dataset.catId = cat.id;
    btn.style.setProperty('--cat-fill', cat.colour);
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    btn.setAttribute('aria-label', cat.label);
    btn.innerHTML = `
      <span class="publish-cat-gem" aria-hidden="true">${categoryGemMark(cat)}</span>
      <span class="publish-cat-label">${cat.label}</span>`;
    btn.addEventListener('click', () => handlePublishCatPick(cat.id));
    publishCatGrid.appendChild(btn);
  });
  syncPublishCatSelection();
}

function beginPublishSheet({ photo, place, card = null, find = null, gemId = null, source = 'sort' }) {
  if (!publishSheet) return;
  pendingPublish = { card, find, gemId, source };
  publishDraft = { title: '', note: '', category: null, extras: [] };
  publishCatPhase = 'primary';
  clearMapTips();
  phone.classList.add('is-publishing');
  syncPublishSheetCopy();
  if (publishPhoto) {
    publishPhoto.src = photo || '';
    publishPhoto.alt = '';
  }
  syncPublishAddress({ place: place || '' });
  if (publishTitle) publishTitle.value = '';
  if (publishNote) publishNote.value = '';
  syncPublishCharCounts();
  bindPublishKeyboard();
  publishSheet.hidden = false;
  publishSheet.setAttribute('aria-hidden', 'false');
  setPublishStep('cats');
  syncPublishKeyboard();
  resetPublishAudience();
}

function openPublishSheet(card) {
  const find = pendingSort[0];
  if (!find || !publishSheet) {
    settleSort(card, 'public');
    return;
  }
  card.classList.remove('is-dragging');
  card.classList.add('is-publishing');
  card.style.transition = `opacity ${SWIPE_FADE_MS}ms ${EASE_IN}`;
  card.style.transform = `rotate(${sortCardTilt()}deg)`;
  card.style.opacity = '0';
  setTargets(null, false);
  setSortingFocus(false);
  beginPublishSheet({
    photo: find.photo,
    place: find.place,
    card,
    find,
    source: 'sort',
  });
}

function openPublishSheetFromDetail(gem) {
  if (!gem || !gem.owned || gem.isPublic) return;
  setDetailMenuOpen(false);
  beginPublishSheet({
    photo: gem.imageUri,
    place: getGemTagline(gem) || gem.title || '',
    gemId: gem.id,
    source: 'detail',
  });
}

function closePublishSheet({ restoreCard = true } = {}) {
  hidePublishTip();
  if (publishSheet) {
    publishSheet.hidden = true;
    publishSheet.setAttribute('aria-hidden', 'true');
    publishSheet.classList.remove('is-words', 'is-cats');
    publishSheet.style.setProperty('--kb', '0px');
  }
  phone.classList.remove('is-publishing');
  const card = pendingPublish?.card;
  pendingPublish = null;
  publishDraft = { title: '', note: '', category: null, extras: [] };
  publishCatPhase = 'primary';
  publishStep = 'cats';
  if (publishCatActions) publishCatActions.hidden = true;
  if (restoreCard && card) {
    card.classList.remove('is-publishing');
    card.style.transition = `transform ${SWIPE_SETTLE_MS}ms ${EASE_POPULAR}, opacity ${SWIPE_FADE_MS}ms ${EASE_IN}`;
    card.style.transform = `rotate(${sortCardTilt()}deg)`;
    card.style.opacity = '1';
    window.setTimeout(() => {
      card.style.transition = '';
      card.style.transform = '';
    }, SWIPE_FADE_MS);
  }
}

function goPublishWordsStep(categoryId) {
  if (!pendingPublish) return;
  if (categoryId) {
    publishDraft.category = categoryId;
    if (!Array.isArray(publishDraft.extras)) publishDraft.extras = [];
  }
  if (!publishDraft.category) return;
  if (publishCatActions) publishCatActions.hidden = true;
  setPublishStep('words');
  window.setTimeout(() => {
    syncPublishKeyboard();
    publishTitle?.focus();
  }, 80);
}

function applyPublishCategories(gem, categoryId, extras) {
  const primary = jamCatById(categoryId).id;
  gem.category = primary;
  const extraIds = (extras || [])
    .map((id) => jamCatById(id).id)
    .filter((id) => id !== primary);
  gem.categories = [primary, ...extraIds];
}

// V3 publish safety (Melissa, 27 Nov test notes): pick who sees the gem before it's shared; the
// confirm button names the result. The default comes from Settings › Privacy (gem-pins-gem-audience).
const AUDIENCE_KEY = 'gem-pins-gem-audience';
const ADDRESS_KEY = 'gem-pins-share-address';
const AUDIENCES = ['me', 'friends', 'everyone'];
const AUDIENCE_BUTTON = { me: 'Keep hidden', friends: 'Share with friends', everyone: 'Publish to everyone' };
const AUDIENCE_DONE = { me: 'Kept hidden: only you can see it', friends: 'Shared with your friends', everyone: 'Published: everyone nearby can see it' };
let publishAudience = 'friends';
const isV3 = () => document.body.classList.contains('is-v3');
const readSetting = (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } };
function paintPublishAudience() {
  document.querySelectorAll('[data-audience]').forEach((b) => {
    const on = b.dataset.audience === publishAudience;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-checked', String(on));
  });
  const shareAddress = readSetting(ADDRESS_KEY) === 'on';
  const note = document.getElementById('publishAudienceNote');
  if (note) {
    note.textContent = publishAudience === 'me'
      ? 'It stays in your Hidden gems.'
      : `${shareAddress ? 'The address is shared.' : 'The address stays private.'} Change it in Settings › Privacy.`;
  }
  if (isV3() && publishNext) publishNext.textContent = AUDIENCE_BUTTON[publishAudience];
}
function resetPublishAudience() {
  const saved = readSetting(AUDIENCE_KEY);
  // a publish is a choice to share, so a saved "Only me" still starts the picker on Friends
  publishAudience = saved === 'everyone' ? 'everyone' : 'friends';
  paintPublishAudience();
}
document.querySelectorAll('[data-audience]').forEach((b) => b.addEventListener('click', () => {
  publishAudience = AUDIENCES.includes(b.dataset.audience) ? b.dataset.audience : 'friends';
  paintPublishAudience();
}));

async function finishPublishWithWords() {
  const pending = pendingPublish;
  if (!pending || !publishDraft.category) return;
  const audience = isV3() ? publishAudience : 'everyone';
  const title = (publishTitle?.value || '').trim().slice(0, PUBLISH_TITLE_MAX) || t('publishTitlePh');
  const note = (publishNote?.value || '').trim().slice(0, PUBLISH_NOTE_MAX);
  const categoryId = publishDraft.category;
  const extras = publishDraft.extras || [];
  if (pending.source === 'detail' && pending.gemId) {
    const gem = findGem(pending.gemId);
    closePublishSheet({ restoreCard: false });
    if (!gem) return;
    gem.isPublic = audience !== 'me';
    gem.audience = audience;
    gem.title = title;
    gem.tagline = note || title;
    gem.caption = note || title;
    applyPublishCategories(gem, categoryId, extras);
    if (!gem.likes) gem.likes = LIKES_DEMO;
    if (!Array.isArray(gem.entries)) gem.entries = [];
    if (note && !gem.entries.includes(note)) gem.entries.unshift(note);
    setSection(gem.isPublic ? 'public' : 'hidden');
    refreshHub(gem.id);
    openDetail(gem.id);
    if (isV3()) showSnack(AUDIENCE_DONE[audience]);
    return;
  }
  const card = pending.card;
  closePublishSheet({ restoreCard: false });
  if (card) {
    card.classList.remove('is-publishing');
    card.style.opacity = '1';
    await settleSort(card, audience === 'me' ? 'private' : 'public', {
      title,
      caption: note || title,
      category: categoryId,
      categories: [categoryId, ...extras],
      audience: isV3() ? audience : undefined,
    });
  }
}

async function settleSort(card, action, opts = {}) {
  const find = pendingSort[0];
  if (!find) return;
  if (action === 'delete') {
    card.classList.remove('is-dragging', 'is-enter');
    card.style.transition = '';
    card.style.transform = '';
    card.style.opacity = '';
    card.classList.add('is-peeling');
    await wait(SORT_PEEL_MS);
    const deleted = pendingSort.shift();
    hint.textContent = t('railDelete');
    refreshHub();
    if (isV3()) offerUndoDelete(deleted);
    return;
  }
  const fly = isSortRight()
    ? 'translate(130%, 0)'
    : action === 'public'
      ? 'translate(120%, -6%) rotate(16deg)'
      : 'translate(-120%, -6%) rotate(-16deg)';
  card.style.transition = `transform ${SWIPE_SETTLE_MS}ms ${EASE_POPULAR}, opacity ${SWIPE_FADE_MS}ms ${EASE_IN}`;
  card.style.transform = fly;
  card.style.opacity = '0';
  await wait(SWIPE_FADE_MS);
  pendingSort.shift();
  const gem = findToGem(find, {
    isPublic: action === 'public',
    owned: true,
    category: opts.category,
  });
  if (opts.audience) gem.audience = opts.audience;
  if (opts.title && action !== 'public') {
    gem.title = opts.title;
    gem.tagline = opts.caption || opts.title;
    gem.caption = opts.caption || opts.title;
  }
  if (action === 'public') {
    gem.likes = LIKES_DEMO;
    if (opts.title) {
      gem.title = opts.title;
      gem.tagline = opts.caption || opts.title;
      gem.caption = opts.caption || opts.title;
      gem.entries = [opts.caption || opts.title];
    }
    if (opts.categories && opts.categories.length) {
      applyPublishCategories(gem, opts.categories[0], opts.categories.slice(1));
    }
  }
  ensureGemCategory(gem);
  gems.unshift(gem);
  await flyGemIntoSection(find.photo, action === 'public');
  setSection(action === 'public' ? 'public' : 'hidden');
  if (opts.audience) showSnack(AUDIENCE_DONE[opts.audience]);
  else hint.textContent = action === 'public' ? t('railPublic') : t('railPrivate');
  refreshHub(gem.id);
  const cell = gemGrid.querySelector(`[data-id="${gem.id}"]`);
  if (cell) cell.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function setHubEdition(edition) {
  hubEdition = edition === 'v1' ? 'v1' : 'v2';
  document.body.classList.toggle('is-v1', hubEdition === 'v1');
  document.body.classList.toggle('is-v2', hubEdition === 'v2');
  document.querySelectorAll('[data-hub-edition]').forEach((btn) => {
    const on = btn.getAttribute('data-hub-edition') === hubEdition;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  if (hubMeta) {
    hubMeta.textContent =
      hubEdition === 'v1'
        ? 'LOCATION-GEMS-HUB-v116 · V1. Figma gems, no rarity.'
        : 'LOCATION-GEMS-HUB-v116 · V2. Rarity = aquamarine/moonstone/topaz/opal/diamond.';
  }
  refreshHub();
  renderFeed();
  renderPublishCats();
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
    /* one drop: under already peeking gem corner, front noteDrops once */
    likesJamCardB.classList.add('is-back');
    likesJamCard.classList.add('is-front');
    void likesJamCard.offsetWidth;
    likesJamCard.classList.add('is-enter');
    await wait(CARD_IN_MS);
    likesJamCard.classList.add('is-impact');
    await wait(SHINE_MS + HOLD_AFTER_SHINE_MS);
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
  if (snapshotPrefix) snapshotPrefix.textContent = displayCopy(PAGE_ANCHOR_COPY_ORIGINAL);
  if (snapshotBtn) snapshotBtn.setAttribute('aria-label', displayCopy(PAGE_ANCHOR_COPY_ORIGINAL));
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

function setSubcatsMode(on) {
  subcatsMode = on;
  setSwitch(debugSubcats, on);
  if (publishSheet && !publishSheet.hidden && publishStep === 'cats') {
    publishDraft.category = null;
    publishDraft.extras = [];
    publishCatPhase = 'primary';
    renderPublishCats();
  }
}

function applyBtnRadius() {
  if (!btnRadius) return;
  const n = Number(btnRadius.value);
  const pill = !Number.isFinite(n) || n >= BTN_RADIUS_PILL;
  const px = pill ? '999px' : `${Math.max(0, n)}px`;
  document.documentElement.style.setProperty('--btn-radius', px);
  if (btnRadiusValue) btnRadiusValue.textContent = pill ? 'pill' : `${Math.max(0, n)}`;
}

function applySpaceScale() {
  if (!spaceScale) return;
  const n = Number(spaceScale.value);
  const pct = Number.isFinite(n) ? n : 100;
  document.documentElement.style.setProperty('--space-scale', String(pct / 100));
  if (spaceScaleValue) spaceScaleValue.textContent = `${pct}%`;
}

function applyTypeScale() {
  if (!typeScale) return;
  const n = Number(typeScale.value);
  const pct = Number.isFinite(n) ? n : 100;
  document.documentElement.style.setProperty('--type-scale', String(pct / 100));
  if (typeScaleValue) typeScaleValue.textContent = `${pct}%`;
}

function designOffsetOf(el) {
  const x = Number(el.dataset.designX || 0);
  const y = Number(el.dataset.designY || 0);
  return { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 };
}

function designScaleOf(el) {
  const s = Number(el.dataset.designScale || 100);
  return Number.isFinite(s) && s > 0 ? s : 100;
}

function applyDesignTransform(el) {
  const { x, y } = designOffsetOf(el);
  const scale = designScaleOf(el) / 100;
  const parts = [];
  if (x || y) parts.push(`translate(${x}px, ${y}px)`);
  if (scale !== 1) parts.push(`scale(${scale})`);
  el.style.transform = parts.length ? parts.join(' ') : '';
  el.style.transformOrigin = 'center center';
}

/** @deprecated use applyDesignTransform */
function applyDesignOffset(el) {
  applyDesignTransform(el);
}

function designKeyFor(el) {
  if (el.dataset.designKey) return el.dataset.designKey;
  const base =
    el.id ||
    el.className
      .toString()
      .split(/\s+/)
      .find((c) => c && !c.startsWith('is-')) ||
    'piece';
  const parent = el.parentElement;
  const idx = parent ? [...parent.children].indexOf(el) : 0;
  const key = `${base}:${idx}`;
  el.dataset.designKey = key;
  return key;
}

function designLabelFor(el) {
  return (
    el.getAttribute('aria-label') ||
    el.dataset.designName ||
    el.id ||
    el.className
      .toString()
      .split(/\s+/)
      .find((c) => c && !c.startsWith('is-')) ||
    'piece'
  );
}

function isDesignLocked(el) {
  return el.dataset.designLocked === '1';
}

function designPadOf(el) {
  const p = Number(el.dataset.designPad);
  return Number.isFinite(p) ? p : -1;
}

function applyDesignPad(el) {
  const p = designPadOf(el);
  if (p < 0) el.style.padding = '';
  else el.style.padding = `${p}px`;
}

function syncDesignSelectionUi() {
  const list = [...designSelection];
  if (designSelectionLabel) {
    if (!list.length) designSelectionLabel.textContent = '[nothing selected]';
    else if (list.length === 1) designSelectionLabel.textContent = designLabelFor(list[0]);
    else designSelectionLabel.textContent = `[${list.length} selected · edits all]`;
  }
  if (designActions) designActions.hidden = list.length === 0;
  if (designElementScale && list.length) {
    const scales = list.map((el) => designScaleOf(el));
    const same = scales.every((s) => s === scales[0]);
    designElementScale.value = String(same ? scales[0] : 100);
    if (designElementScaleValue) {
      designElementScaleValue.textContent = same ? `${scales[0]}%` : 'mix';
    }
  }
  if (designElementPad && list.length) {
    const pads = list.map((el) => designPadOf(el));
    const same = pads.every((p) => p === pads[0]);
    const shown = same && pads[0] >= 0 ? pads[0] : same && pads[0] < 0 ? 0 : 0;
    designElementPad.value = String(shown);
    if (designElementPadValue) {
      designElementPadValue.textContent = same ? `${shown}` : 'mix';
    }
  }
}

function clearDesignSelection() {
  designSelection.forEach((el) => {
    el.classList.remove('is-design-selected', 'is-design-dragging');
  });
  designSelection.clear();
  designDrag = null;
  designDragPending = null;
  syncDesignSelectionUi();
}

function selectDesignTarget(el, { additive = false } = {}) {
  if (!el) return;
  if (!additive) {
    designSelection.forEach((node) => {
      if (node !== el) node.classList.remove('is-design-selected', 'is-design-dragging');
    });
    designSelection.clear();
  }
  if (designSelection.has(el) && additive) {
    el.classList.remove('is-design-selected', 'is-design-dragging');
    designSelection.delete(el);
  } else {
    designSelection.add(el);
    el.classList.add('is-design-selected');
  }
  syncDesignSelectionUi();
}

function markDesignTargets(on) {
  if (!phone) return;
  phone.querySelectorAll('.is-design-target').forEach((el) => el.classList.remove('is-design-target'));
  if (!on) return;
  phone.querySelectorAll(DESIGN_TARGET_SEL).forEach((el) => {
    if (el.closest('[hidden]')) return;
    designKeyFor(el);
    el.classList.add('is-design-target');
    if (isDesignLocked(el)) el.classList.add('is-design-locked');
    applyDesignOffset(el);
  });
}

function setDesignMoveMode(on) {
  designMoveMode = on;
  setSwitch(debugDesignMove, on);
  if (phone) phone.classList.toggle('is-design-move', on);
  if (!on) {
    clearDesignSelection();
    markDesignTargets(false);
    return;
  }
  markDesignTargets(true);
  if (hint) hint.textContent = '[1st click = group · next click digs into child · Shift adds]';
}

function resetDesignPosition() {
  if (!designSelection.size) return;
  designSelection.forEach((el) => {
    delete el.dataset.designX;
    delete el.dataset.designY;
    delete el.dataset.designScale;
    delete el.dataset.designPad;
    applyDesignTransform(el);
    applyDesignPad(el);
  });
  syncDesignSelectionUi();
  scheduleDesignStudioSave();
}

function applyElementScaleToSelection(pct) {
  const n = Number(pct);
  const scale = Number.isFinite(n) ? Math.max(40, Math.min(220, n)) : 100;
  designSelection.forEach((el) => {
    if (isDesignLocked(el)) return;
    if (scale === 100) delete el.dataset.designScale;
    else el.dataset.designScale = String(Math.round(scale));
    applyDesignTransform(el);
  });
  if (designElementScaleValue) designElementScaleValue.textContent = `${Math.round(scale)}%`;
  scheduleDesignStudioSave();
}

function applyElementPadToSelection(px) {
  const n = Number(px);
  const pad = Number.isFinite(n) ? Math.max(0, Math.min(32, n)) : 0;
  designSelection.forEach((el) => {
    if (isDesignLocked(el)) return;
    if (pad === 0) delete el.dataset.designPad;
    else el.dataset.designPad = String(Math.round(pad));
    applyDesignPad(el);
  });
  if (designElementPadValue) designElementPadValue.textContent = `${Math.round(pad)}`;
  scheduleDesignStudioSave();
}

function designNodeFromEventTarget(start) {
  if (!start) return null;
  let el = start.nodeType === 1 ? /** @type {HTMLElement} */ (start) : start.parentElement;
  if (!el) return null;
  if (el.tagName === 'PATH' && el.ownerSVGElement) {
    el = /** @type {HTMLElement} */ (/** @type {unknown} */ (el.ownerSVGElement));
  }
  return el;
}

/** Outermost selectable group under a node. */
function resolveDesignGroup(start) {
  if (!phone || !start) return null;
  const el = designNodeFromEventTarget(start);
  if (!el || !phone.contains(el)) return null;
  return /** @type {HTMLElement | null} */ (el.closest(DESIGN_TARGET_SEL));
}

/**
 * Figma dig: one level deeper from `selected` toward the node under the cursor.
 * Gems/art win immediately — never stop on corner/scrim “bg” wrappers.
 */
function digDesignOneLevel(selected, start) {
  if (!selected || !start) return null;
  let hit = designNodeFromEventTarget(start);
  if (!hit || !selected.contains(hit) || hit === selected) return null;

  const content = /** @type {HTMLElement | null} */ (hit.closest(DESIGN_CONTENT_SEL));
  if (content && selected.contains(content) && content !== selected) {
    return content;
  }

  let el = hit;
  while (el.parentElement && el.parentElement !== selected) {
    el = el.parentElement;
    if (!selected.contains(el)) return null;
  }
  if (!el || el === selected || el.parentElement !== selected) return null;

  if (el.matches(DESIGN_WRAPPER_SEL)) {
    const nested = /** @type {HTMLElement | null} */ (el.querySelector(DESIGN_CONTENT_SEL));
    if (nested) return nested;
    return null;
  }
  return el;
}

function setDesignLocked(on) {
  designSelection.forEach((el) => {
    if (on) {
      el.dataset.designLocked = '1';
      el.classList.add('is-design-locked');
    } else {
      delete el.dataset.designLocked;
      el.classList.remove('is-design-locked');
    }
  });
  scheduleDesignStudioSave();
}

function centerDesignSelection(axis) {
  if (!phone || !designSelection.size) return;
  const phoneRect = phone.getBoundingClientRect();
  designSelection.forEach((el) => {
    if (isDesignLocked(el)) return;
    const r = el.getBoundingClientRect();
    const off = designOffsetOf(el);
    let dx = 0;
    let dy = 0;
    if (axis === 'x' || axis === 'both') {
      dx = phoneRect.left + phoneRect.width / 2 - (r.left + r.width / 2);
    }
    if (axis === 'y' || axis === 'both') {
      dy = phoneRect.top + phoneRect.height / 2 - (r.top + r.height / 2);
    }
    el.dataset.designX = String(Math.round(off.x + dx));
    el.dataset.designY = String(Math.round(off.y + dy));
    applyDesignOffset(el);
  });
  scheduleDesignStudioSave();
}

function collectDesignPositions() {
  /** @type {Record<string, { x: number, y: number, scale?: number, pad?: number, locked?: boolean }>} */
  const positions = {};
  if (!phone) return positions;
  const nodes = new Set([
    ...phone.querySelectorAll(DESIGN_TARGET_SEL),
    ...phone.querySelectorAll(
      '[data-design-x], [data-design-y], [data-design-scale], [data-design-pad], [data-design-locked]',
    ),
  ]);
  nodes.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const key = designKeyFor(el);
    const off = designOffsetOf(el);
    const scale = designScaleOf(el);
    const pad = designPadOf(el);
    const locked = isDesignLocked(el);
    if (!off.x && !off.y && scale === 100 && pad < 0 && !locked) return;
    positions[key] = { x: off.x, y: off.y };
    if (scale !== 100) positions[key].scale = scale;
    if (pad >= 0) positions[key].pad = pad;
    if (locked) positions[key].locked = true;
  });
  return positions;
}

function applyDesignPositions(positions) {
  if (!phone || !positions) return;
  Object.keys(positions).forEach((key) => {
    const saved = positions[key];
    if (!saved) return;
    let el =
      phone.querySelector(`[data-design-key="${CSS.escape(key)}"]`) ||
      [...phone.querySelectorAll(DESIGN_TARGET_SEL)].find((node) => designKeyFor(node) === key) ||
      null;
    if (!el) return;
    if (saved.x) el.dataset.designX = String(saved.x);
    else delete el.dataset.designX;
    if (saved.y) el.dataset.designY = String(saved.y);
    else delete el.dataset.designY;
    if (saved.scale && saved.scale !== 100) el.dataset.designScale = String(saved.scale);
    else delete el.dataset.designScale;
    if (saved.pad != null && saved.pad >= 0) el.dataset.designPad = String(saved.pad);
    else delete el.dataset.designPad;
    if (saved.locked) {
      el.dataset.designLocked = '1';
      el.classList.add('is-design-locked');
    }
    applyDesignTransform(el);
    applyDesignPad(el);
  });
}

function readDesignStudio() {
  try {
    const raw = localStorage.getItem(DESIGN_STUDIO_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function captureDesignStudio() {
  return {
    btnRadius: btnRadius ? Number(btnRadius.value) : BTN_RADIUS_PILL,
    spaceScale: spaceScale ? Number(spaceScale.value) : 100,
    typeScale: typeScale ? Number(typeScale.value) : 100,
    accent: accentColor ? accentColor.value : '#00c2ff',
    accentAlpha: accentAlpha ? Number(accentAlpha.value) : 100,
    radialColor: radialColor ? radialColor.value : '#b36bff',
    radialAmount: radialAmount ? Number(radialAmount.value) : 55,
    radialImpact: radialImpact ? Number(radialImpact.value) : 60,
    bgColor: bgColor ? bgColor.value : '#170c35',
    bgDepth: bgDepth ? Number(bgDepth.value) : 100,
    midToneOn: midToneEnabled(),
    midToneColor: midToneColor ? midToneColor.value : MID_TONE_DEFAULT,
    sortFrame: sortFrameColor ? sortFrameColor.value : SORT_FRAME_DEFAULT,
    sortTintA: sortTintShadeA ? sortTintShadeA.value : SORT_TINT_SHADE_A_DEFAULT,
    sortTintB: sortTintShadeB ? sortTintShadeB.value : SORT_TINT_SHADE_B_DEFAULT,
    sortCardText: sortCardTextColor ? sortCardTextColor.value : SORT_CARD_TEXT_DEFAULT,
    pageAnchor: PAGE_ANCHOR_VARIANTS.has(pageAnchor) ? pageAnchor : PAGE_ANCHOR_DEFAULT,
    paBlur: pageAnchorBlur ? Number(pageAnchorBlur.value) : PAGE_ANCHOR_BLUR_DEFAULT,
    paOpacity: pageAnchorOpacity ? Number(pageAnchorOpacity.value) : PAGE_ANCHOR_OPACITY_DEFAULT,
    paSize: pageAnchorSize ? Number(pageAnchorSize.value) : PAGE_ANCHOR_SIZE_DEFAULT,
    positions: collectDesignPositions(),
    savedAt: Date.now(),
  };
}

function studioSnapshotsEqual(a, b) {
  if (!a || !b) return false;
  try {
    const strip = (s) => {
      const { savedAt, ...rest } = s;
      return rest;
    };
    return JSON.stringify(strip(a)) === JSON.stringify(strip(b));
  } catch {
    return false;
  }
}

function syncDesignHistoryButtons() {
  if (designUndo) designUndo.disabled = designHistoryIndex <= 0;
  if (designRedo) designRedo.disabled = designHistoryIndex < 0 || designHistoryIndex >= designHistory.length - 1;
}

function pushDesignHistory(snapshot) {
  if (designHistoryMuted || !snapshot) return;
  const cur = designHistory[designHistoryIndex];
  if (cur && studioSnapshotsEqual(cur, snapshot)) {
    syncDesignHistoryButtons();
    return;
  }
  designHistory = designHistory.slice(0, designHistoryIndex + 1);
  designHistory.push(snapshot);
  if (designHistory.length > DESIGN_HISTORY_MAX) {
    designHistory.shift();
  }
  designHistoryIndex = designHistory.length - 1;
  syncDesignHistoryButtons();
}

function applyDesignStudioData(data, { note } = {}) {
  if (!data) return;
  designHistoryMuted = true;
  if (btnRadius && data.btnRadius != null) btnRadius.value = String(data.btnRadius);
  if (spaceScale && data.spaceScale != null) spaceScale.value = String(data.spaceScale);
  if (typeScale && data.typeScale != null) typeScale.value = String(data.typeScale);
  if (accentColor && data.accent) accentColor.value = data.accent;
  if (accentAlpha && data.accentAlpha != null) accentAlpha.value = String(data.accentAlpha);
  if (radialColor && data.radialColor) radialColor.value = data.radialColor;
  if (radialAmount && data.radialAmount != null) radialAmount.value = String(data.radialAmount);
  if (radialImpact && data.radialImpact != null) radialImpact.value = String(data.radialImpact);
  if (bgColor && data.bgColor) bgColor.value = data.bgColor;
  if (bgDepth && data.bgDepth != null) bgDepth.value = String(data.bgDepth);
  if (midToneColor && data.midToneColor) midToneColor.value = data.midToneColor;
  if (typeof data.midToneOn === 'boolean') setMidTone(data.midToneOn);
  if (sortFrameColor && data.sortFrame) sortFrameColor.value = data.sortFrame;
  if (sortTintShadeA && data.sortTintA) sortTintShadeA.value = data.sortTintA;
  if (sortTintShadeB && data.sortTintB) sortTintShadeB.value = data.sortTintB;
  if (sortCardTextColor && data.sortCardText) sortCardTextColor.value = data.sortCardText;
  if (pageAnchorBlur && data.paBlur != null) pageAnchorBlur.value = String(data.paBlur);
  if (pageAnchorOpacity && data.paOpacity != null) pageAnchorOpacity.value = String(data.paOpacity);
  if (pageAnchorSize && data.paSize != null) pageAnchorSize.value = String(data.paSize);
  applyBtnRadius();
  applySpaceScale();
  applyTypeScale();
  applyAccent();
  applyRadial();
  applyBg();
  applyMidTone();
  applySortTintShades();
  applySortCardText();
  if (data.pageAnchor) setPageAnchor(data.pageAnchor);
  else applyPageAnchorFx();
  if (phone) {
    phone.querySelectorAll(DESIGN_TARGET_SEL).forEach((el) => {
      delete el.dataset.designX;
      delete el.dataset.designY;
      delete el.dataset.designScale;
      delete el.dataset.designLocked;
      el.classList.remove('is-design-locked');
      applyDesignTransform(el);
    });
  }
  applyDesignPositions(data.positions || {});
  designHistoryMuted = false;
  if (designSaveNote && note) designSaveNote.textContent = note;
  syncDesignHistoryButtons();
}

function writeDesignStudio(data) {
  try {
    localStorage.setItem(DESIGN_STUDIO_KEY, JSON.stringify(data));
    if (designSaveNote) designSaveNote.textContent = 'Saved in this browser · auto';
  } catch {
    if (designSaveNote) designSaveNote.textContent = '[could not save in this browser]';
  }
}

function scheduleDesignStudioSave() {
  window.clearTimeout(designSaveTimer);
  designSaveTimer = window.setTimeout(() => {
    const data = captureDesignStudio();
    pushDesignHistory(data);
    writeDesignStudio(data);
  }, 180);
}

/** Explicit Save: write current look; keep the prior saved look under Undo. */
function saveDesignStudioLook() {
  window.clearTimeout(designSaveTimer);
  const previous = readDesignStudio();
  const current = captureDesignStudio();
  designHistory = designHistory.slice(0, designHistoryIndex + 1);
  if (previous && !studioSnapshotsEqual(previous, current)) {
    const tip = designHistory[designHistory.length - 1];
    if (tip && studioSnapshotsEqual(tip, current)) {
      designHistory.pop();
    }
    const after = designHistory[designHistory.length - 1];
    if (!after || !studioSnapshotsEqual(after, previous)) {
      designHistory.push(previous);
    }
  }
  const tip = designHistory[designHistory.length - 1];
  if (!tip || !studioSnapshotsEqual(tip, current)) {
    designHistory.push(current);
  }
  if (designHistory.length > DESIGN_HISTORY_MAX) {
    designHistory = designHistory.slice(-DESIGN_HISTORY_MAX);
  }
  designHistoryIndex = designHistory.length - 1;
  syncDesignHistoryButtons();
  writeDesignStudio(current);
  if (designSaveNote) {
    designSaveNote.textContent =
      designHistoryIndex > 0 ? 'Saved · previous under Undo' : 'Saved in this browser';
  }
  if (designSaveStudio) {
    designSaveStudio.classList.add('is-saved-flash');
    window.setTimeout(() => designSaveStudio.classList.remove('is-saved-flash'), 900);
  }
  publishLookToolsToParent();
}

function undoDesignStudio() {
  if (designHistoryIndex <= 0) return;
  designHistoryIndex -= 1;
  const data = designHistory[designHistoryIndex];
  applyDesignStudioData(data, { note: 'Undo · saved' });
  writeDesignStudio(data);
  syncDesignHistoryButtons();
}

function redoDesignStudio() {
  if (designHistoryIndex >= designHistory.length - 1) return;
  designHistoryIndex += 1;
  const data = designHistory[designHistoryIndex];
  applyDesignStudioData(data, { note: 'Redo · saved' });
  writeDesignStudio(data);
  syncDesignHistoryButtons();
}

function loadDesignStudio() {
  const data = readDesignStudio();
  if (!data) {
    pushDesignHistory(captureDesignStudio());
    syncDesignHistoryButtons();
    return;
  }
  applyDesignStudioData(data, { note: 'Restored from this browser · auto' });
  designHistory = [data];
  designHistoryIndex = 0;
  syncDesignHistoryButtons();
}

function clearDesignStudio() {
  try {
    localStorage.removeItem(DESIGN_STUDIO_KEY);
  } catch {
    /* ignore */
  }
  if (btnRadius) btnRadius.value = String(BTN_RADIUS_PILL);
  if (spaceScale) spaceScale.value = '100';
  if (typeScale) typeScale.value = '100';
  applyBtnRadius();
  applySpaceScale();
  applyTypeScale();
  if (phone) {
    phone.querySelectorAll(DESIGN_TARGET_SEL).forEach((el) => {
      delete el.dataset.designX;
      delete el.dataset.designY;
      delete el.dataset.designScale;
      delete el.dataset.designLocked;
      el.classList.remove('is-design-locked');
      applyDesignTransform(el);
    });
    phone.querySelectorAll('[data-design-scale], [data-design-x], [data-design-y]').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      delete el.dataset.designX;
      delete el.dataset.designY;
      delete el.dataset.designScale;
      delete el.dataset.designLocked;
      el.classList.remove('is-design-locked');
      applyDesignTransform(el);
    });
  }
  clearDesignSelection();
  if (pageAnchorBlur) pageAnchorBlur.value = String(PAGE_ANCHOR_BLUR_DEFAULT);
  if (pageAnchorOpacity) pageAnchorOpacity.value = String(PAGE_ANCHOR_OPACITY_DEFAULT);
  if (pageAnchorSize) pageAnchorSize.value = String(PAGE_ANCHOR_SIZE_DEFAULT);
  setPageAnchor(PAGE_ANCHOR_DEFAULT);
  const data = captureDesignStudio();
  designHistory = [data];
  designHistoryIndex = 0;
  writeDesignStudio(data);
  if (designSaveNote) designSaveNote.textContent = 'Cleared · defaults restored';
  syncDesignHistoryButtons();
}

function beginDesignDragFromPending() {
  if (!designDragPending) return;
  const { target, startX, startY, pointerId } = designDragPending;
  designDragPending = null;
  const movers = [...designSelection].filter((el) => !isDesignLocked(el));
  if (!movers.length) return;
  designDrag = {
    els: movers,
    startX,
    startY,
    origins: movers.map((el) => {
      const off = designOffsetOf(el);
      return { el, x: off.x, y: off.y };
    }),
  };
  movers.forEach((el) => el.classList.add('is-design-dragging'));
  target.setPointerCapture?.(pointerId);
}

function onDesignPointerDown(e) {
  if (!designMoveMode || !phone || e.button !== 0) return;
  if (e.target.closest('.edition-rail, .tool-rail')) return;
  e.preventDefault();
  e.stopPropagation();
  if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

  const hit = designNodeFromEventTarget(/** @type {Node} */ (e.target));
  const group = resolveDesignGroup(hit);
  const additive = e.shiftKey || e.metaKey || e.ctrlKey;

  if (!group || !hit || !phone.contains(group)) {
    designDragPending = null;
    clearDesignSelection();
    return;
  }

  let target = group;
  if (!additive && designSelection.size === 1) {
    const selected = [...designSelection][0];
    /* Same container still selected → next click digs one child level (Figma). */
    if (selected === group || selected.contains(hit)) {
      const dug = digDesignOneLevel(selected, hit);
      if (dug) target = dug;
      else if (selected !== group && !selected.contains(hit)) target = group;
      else target = selected;
    }
  } else if (additive && designSelection.size === 1) {
    /* Shift still adds groups for multi-edit */
    target = group;
  }

  designKeyFor(target);
  target.classList.add('is-design-target');
  selectDesignTarget(target, { additive });
  if (hint && !additive) {
    hint.textContent =
      target === group
        ? `[group · ${designLabelFor(target)} · click again to dig]`
        : `[child · ${designLabelFor(target)} · click again to dig]`;
  }

  designDragPending = {
    target,
    startX: e.clientX,
    startY: e.clientY,
    pointerId: e.pointerId,
  };
  target.setPointerCapture?.(e.pointerId);
}

function onDesignClickBlock(e) {
  if (!designMoveMode) return;
  if (e.target.closest('.edition-rail, .tool-rail')) return;
  e.preventDefault();
  e.stopPropagation();
  if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
}

function onDesignPointerMove(e) {
  if (designDragPending && !designDrag) {
    const dx = e.clientX - designDragPending.startX;
    const dy = e.clientY - designDragPending.startY;
    if (Math.hypot(dx, dy) >= DESIGN_DRAG_THRESHOLD_PX) {
      beginDesignDragFromPending();
    } else {
      return;
    }
  }
  if (!designDrag) return;
  const dx = e.clientX - designDrag.startX;
  const dy = e.clientY - designDrag.startY;
  designDrag.origins.forEach(({ el, x, y }) => {
    el.dataset.designX = String(Math.round(x + dx));
    el.dataset.designY = String(Math.round(y + dy));
    applyDesignTransform(el);
  });
}

function onDesignPointerUp(e) {
  if (designDragPending) {
    designDragPending = null;
  }
  if (!designDrag) return;
  designDrag.els.forEach((el) => el.classList.remove('is-design-dragging'));
  try {
    e.target.releasePointerCapture?.(e.pointerId);
  } catch {
    /* ignore */
  }
  designDrag = null;
  scheduleDesignStudioSave();
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
  hint.textContent = isSortRight() ? t(sortRightIntroKey()) : dragMode ? t('holdHintDrag') : t('holdHint');
  runOnboardingTips();
}

function initIcons() {
  railPrivateIcon.innerHTML = hollowHiddenGemMark();
  railPublicIcon.innerHTML = gemSvg(PUBLIC_GEM_FILL, { softOutline: true });
  dropHiddenIcon.innerHTML = hollowHiddenGemMark();
  dropPublicIcon.innerHTML = gemSvg(PUBLIC_GEM_FILL, { softOutline: true });
  tabPublicIcon.innerHTML = gemSvg(PUBLIC_GEM_FILL);
  tabHiddenIcon.innerHTML = hollowHiddenGemMark();
  const tabLikedIcon = document.querySelector('#tabLiked .tab-like-icon');
  if (tabLikedIcon) tabLikedIcon.innerHTML = heartSvg();
}

function init() {
  initIcons();
  applyAccent();
  applyRadial();
  applyBg();
  applyMidTone();
  applySortTintShades();
  applySortCardText();
  applyBtnRadius();
  applySpaceScale();
  applyTypeScale();
  seedGems();
  seedPendingSort();
  setupSnapshotArc();
  fillPageAnchorGems();
  applyStaticCopy();
  applyPageAnchorFx();
  setPageAnchor(PAGE_ANCHOR_DEFAULT);
  setHeadingLook(HEADING_DEFAULT);
  setPlaceMotion(PLACE_MOTION_DEFAULT);
  setHubEdition(hubEdition);
  setSortCardLook(sortCardLook);
  setSection('public');
  refreshHub();
  loadDesignStudio();
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
detailNav.addEventListener('click', () => {
  hint.textContent = t('navigateSpoof');
});
if (detailSave) {
  detailSave.addEventListener('click', () => {
    if (!openGemId) return;
    toggleFavourite(openGemId);
    syncDetailSave();
    renderFeed();
  });
}
detailPublish.addEventListener('click', () => {
  if (!openGemId) return;
  const gem = findGem(openGemId);
  if (!gem || !gem.owned) return;
  if (gem.isPublic) {
    togglePublish(openGemId);
    return;
  }
  openPublishSheetFromDetail(gem);
});
detailAdd.addEventListener('click', addEntryToOpenGem);
if (detailNote) {
  detailNote.addEventListener('input', syncDetailNoteCount);
}
if (detailMenu) {
  detailMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    setDetailMenuOpen(!!(detailMenuPop && detailMenuPop.hidden));
  });
}
if (detailMenuPop) {
  detailMenuPop.addEventListener('click', (e) => e.stopPropagation());
}
if (detailReport) {
  detailReport.addEventListener('click', () => {
    setDetailMenuOpen(false);
    hint.textContent = t('detailReported');
    if (detailBanner && detailBannerCopy) {
      detailBanner.hidden = false;
      detailBannerCopy.textContent = t('detailReported');
    }
  });
}
detail.addEventListener('click', (e) => {
  if (e.target.closest('.detail-menu-wrap')) return;
  setDetailMenuOpen(false);
});
detailLikeBtn.addEventListener('click', toggleDetailLike);
function publishLookToolsToParent() {
  if (!document.body.classList.contains('is-tools-embed')) return;
  if (window.parent === window) return;
  window.parent.postMessage({
    type: 'location-gems-look',
    accent: accentColor ? accentColor.value : '#00c2ff',
    accentAlpha: accentAlpha ? Number(accentAlpha.value) : 100,
    radial: radialColor ? radialColor.value : '#b36bff',
    radialAmount: radialAmount ? Number(radialAmount.value) : 55,
    radialImpact: radialImpact ? Number(radialImpact.value) : 60,
    bg: bgColor ? bgColor.value : '#170c35',
    bgDepth: bgDepth ? Number(bgDepth.value) : 100,
    midToneOn: midToneEnabled(),
    midTone: midToneColor ? midToneColor.value : '#241b46',
    btnRadius: btnRadius ? Number(btnRadius.value) : 24,
    spaceScale: spaceScale ? Number(spaceScale.value) : 100,
    typeScale: typeScale ? Number(typeScale.value) : 100,
  }, '*');
}

function onLookToolInput(fn) {
  return () => {
    fn();
    if (!designHistoryMuted) scheduleDesignStudioSave();
    publishLookToolsToParent();
  };
}
accentColor.addEventListener('input', onLookToolInput(applyAccent));
accentAlpha.addEventListener('input', onLookToolInput(applyAccent));
if (radialColor) radialColor.addEventListener('input', onLookToolInput(applyRadial));
if (radialAmount) radialAmount.addEventListener('input', onLookToolInput(applyRadial));
if (radialImpact) radialImpact.addEventListener('input', onLookToolInput(applyRadial));
if (bgColor) bgColor.addEventListener('input', onLookToolInput(applyBg));
if (bgDepth) bgDepth.addEventListener('input', onLookToolInput(applyBg));
if (midToneColor) midToneColor.addEventListener('input', onLookToolInput(applyMidTone));
if (sortFrameColor) {
  sortFrameColor.addEventListener(
    'input',
    onLookToolInput(() => {
      document.documentElement.style.setProperty(
        '--sort-frame',
        sortFrameColor.value || SORT_FRAME_DEFAULT,
      );
    }),
  );
}
if (sortTintShadeA) {
  sortTintShadeA.addEventListener('input', onLookToolInput(applySortTintShades));
}
if (sortTintShadeB) {
  sortTintShadeB.addEventListener('input', onLookToolInput(applySortTintShades));
}
if (sortCardTextColor) {
  sortCardTextColor.addEventListener('input', onLookToolInput(applySortCardText));
}
if (midToneOn) {
  midToneOn.addEventListener(
    'click',
    onLookToolInput(() => setMidTone(!midToneEnabled())),
  );
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
if (debugSubcats) {
  debugSubcats.addEventListener('click', () => setSubcatsMode(!subcatsMode));
}

function setAppPagesMode(on) {
  setSwitch(debugAppPages, on);
  if (phone) phone.classList.toggle('has-app-pages', on);
  if (appPagesNav) appPagesNav.hidden = !on;
  const url = new URL(location.href);
  if (on) url.searchParams.set(APP_PAGES_PARAM, '1');
  else url.searchParams.delete(APP_PAGES_PARAM);
  history.replaceState(null, '', url);
}

function initAppPagesDebug() {
  const on = new URLSearchParams(location.search).get(APP_PAGES_PARAM) === '1';
  setAppPagesMode(on);
  if (debugAppPages) {
    debugAppPages.addEventListener('click', () => {
      setAppPagesMode(debugAppPages.getAttribute('aria-checked') !== 'true');
    });
  }
}
initAppPagesDebug();

if (debugDesignMove) {
  debugDesignMove.addEventListener('click', () => setDesignMoveMode(!designMoveMode));
}
if (designElementScale) {
  designElementScale.addEventListener('input', () => {
    applyElementScaleToSelection(designElementScale.value);
  });
}
if (designElementPad) {
  designElementPad.addEventListener('input', () => {
    applyElementPadToSelection(designElementPad.value);
  });
}
if (btnRadius) {
  btnRadius.addEventListener('input', () => {
    applyBtnRadius();
    scheduleDesignStudioSave();
    publishLookToolsToParent();
  });
}
if (spaceScale) {
  spaceScale.addEventListener('input', () => {
    applySpaceScale();
    scheduleDesignStudioSave();
    publishLookToolsToParent();
  });
}
if (typeScale) {
  typeScale.addEventListener('input', () => {
    applyTypeScale();
    scheduleDesignStudioSave();
    publishLookToolsToParent();
  });
}
if (designResetPos) designResetPos.addEventListener('click', resetDesignPosition);
if (designCenterX) designCenterX.addEventListener('click', () => centerDesignSelection('x'));
if (designCenterY) designCenterY.addEventListener('click', () => centerDesignSelection('y'));
if (designCenterBoth) designCenterBoth.addEventListener('click', () => centerDesignSelection('both'));
if (designLock) designLock.addEventListener('click', () => setDesignLocked(true));
if (designUnlock) designUnlock.addEventListener('click', () => setDesignLocked(false));
if (designSaveStudio) designSaveStudio.addEventListener('click', saveDesignStudioLook);
if (designClearStudio) designClearStudio.addEventListener('click', clearDesignStudio);
if (designUndo) designUndo.addEventListener('click', undoDesignStudio);
if (designRedo) designRedo.addEventListener('click', redoDesignStudio);
if (phone) {
  phone.addEventListener('pointerdown', onDesignPointerDown, true);
  phone.addEventListener('pointermove', onDesignPointerMove);
  phone.addEventListener('pointerup', onDesignPointerUp);
  phone.addEventListener('pointercancel', onDesignPointerUp);
  phone.addEventListener('click', onDesignClickBlock, true);
  phone.addEventListener('auxclick', onDesignClickBlock, true);
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && designMoveMode) clearDesignSelection();
  const mod = e.metaKey || e.ctrlKey;
  if (!mod) return;
  const key = e.key.toLowerCase();
  if (key === 'z' && !e.shiftKey) {
    e.preventDefault();
    undoDesignStudio();
  } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
    e.preventDefault();
    redoDesignStudio();
  }
});
if (debugLikesStack) {
  debugLikesStack.addEventListener('click', () => setLikesStackMode(!likesStackMode));
}
if (publishCatNext) {
  publishCatNext.addEventListener('click', () => {
    if (!publishDraft.category) return;
    goPublishWordsStep();
  });
}
document.querySelectorAll('[data-feed-variant]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setFeedVariant(btn.getAttribute('data-feed-variant') || 'banner');
  });
});
document.querySelectorAll('.variant-btn[data-page-anchor]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setPageAnchor(btn.getAttribute('data-page-anchor') || PAGE_ANCHOR_DEFAULT);
    if (!designHistoryMuted) scheduleDesignStudioSave();
  });
});
if (pageAnchorBlur) {
  pageAnchorBlur.addEventListener('input', onLookToolInput(applyPageAnchorFx));
}
if (pageAnchorOpacity) {
  pageAnchorOpacity.addEventListener('input', onLookToolInput(applyPageAnchorFx));
}
if (pageAnchorSize) {
  pageAnchorSize.addEventListener('input', onLookToolInput(applyPageAnchorFx));
}
document.querySelectorAll('.variant-btn[data-heading]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setHeadingLook(btn.getAttribute('data-heading') || HEADING_DEFAULT);
  });
});
document.querySelectorAll('.variant-btn[data-place-motion]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setPlaceMotion(btn.getAttribute('data-place-motion') || PLACE_MOTION_DEFAULT);
  });
});
document.querySelectorAll('[data-hub-edition]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setHubEdition(btn.getAttribute('data-hub-edition') || 'v1');
  });
});
document.querySelectorAll('[data-sort-look]').forEach((btn) => {
  btn.addEventListener('click', () => {
    setSortCardLook(btn.getAttribute('data-sort-look') || 'polaroid');
  });
});
if (publishSheetScrim) {
  publishSheetScrim.addEventListener('click', () => closePublishSheet({ restoreCard: true }));
}
if (publishNext) {
  publishNext.addEventListener('click', () => finishPublishWithWords());
}
if (publishTitle) {
  publishTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      publishNote?.focus();
    }
  });
  publishTitle.addEventListener('input', syncPublishCharCounts);
  publishTitle.addEventListener('focus', syncPublishKeyboard);
}
if (publishNote) {
  publishNote.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      finishPublishWithWords();
    }
  });
  publishNote.addEventListener('input', syncPublishCharCounts);
  publishNote.addEventListener('focus', syncPublishKeyboard);
}
bindTipGesture();
bindFeedDismissGesture();
setFeedVariant(feedVariant);

const locationGemsParams = new URLSearchParams(location.search);
if (locationGemsParams.get('embed') === '1') {
  document.body.classList.add('is-embed');
}
if (locationGemsParams.get('tools') === '1') {
  document.body.classList.add('is-tools-embed');
  requestAnimationFrame(() => publishLookToolsToParent());
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

// A photo handed over by the + camera in Gem map pins V3: "later" puts it on top of the unsorted
// pile; "now" also opens the publish sheet on it, the same as swiping it right.
const CAMERA_HANDOFF_KEY = 'gem-pins-camera-photo';
function takeCameraHandoff() {
  let shot = null;
  try {
    shot = JSON.parse(sessionStorage.getItem(CAMERA_HANDOFF_KEY) || 'null');
    sessionStorage.removeItem(CAMERA_HANDOFF_KEY);
  } catch (e) {
    return;
  }
  if (!shot || !shot.photo) return;
  if (!snapshotTip.hidden) dismissTip();
  pendingSort.unshift({ id: `find-camera-${Date.now()}`, user: MY_USER, photo: shot.photo, text: '', place: shot.place || '', pending: true });
  renderSortStack();
  sortInlineEl.scrollIntoView({ block: 'start' });
  if (shot.action !== 'now' || !sortStack.lastElementChild) return;
  // The first-visit tips (already scheduled by init) would land on top of the publish sheet, so this
  // visit skips them; they still show on the next normal visit.
  runOnboardingTips = () => {};
  openPublishSheet(sortStack.lastElementChild);
}
takeCameraHandoff();

// V3 card size: standard, big or almost full screen (Melissa, 27 Nov), remembered on this device
const CARD_SIZE_KEY = 'location-gems-card-size';
const CARD_SIZES = ['standard', 'big', 'full'];
function setCardSize(size) {
  const next = CARD_SIZES.includes(size) ? size : CARD_SIZES[0];
  CARD_SIZES.forEach((s) => document.body.classList.toggle(`card-size-${s}`, s === next));
  document.querySelectorAll('[data-card-size]').forEach((b) => {
    const on = b.dataset.cardSize === next;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  try { localStorage.setItem(CARD_SIZE_KEY, next); } catch (e) { /* private window */ }
}
document.querySelectorAll('[data-card-size]').forEach((b) => b.addEventListener('click', () => setCardSize(b.dataset.cardSize)));
setCardSize((() => { try { return localStorage.getItem(CARD_SIZE_KEY); } catch (e) { return null; } })());

// V3 safety bar (Melissa, 27 Nov test notes): says what just happened; after a delete it offers Undo
const UNDO_MS = 5000;
let undoTimer = 0;
let undoBar = null;
function showSnack(text, onUndo) {
  if (!undoBar) {
    undoBar = document.createElement('div');
    undoBar.className = 'undo-bar';
    undoBar.setAttribute('role', 'status');
    undoBar.innerHTML = '<span class="undo-text"></span><button type="button" class="undo-btn">Undo</button>';
    phone.appendChild(undoBar);
  }
  undoBar.querySelector('.undo-text').textContent = text;
  const btn = undoBar.querySelector('.undo-btn');
  const fresh = btn.cloneNode(true);
  fresh.hidden = !onUndo;
  btn.replaceWith(fresh);
  if (onUndo) {
    fresh.addEventListener('click', () => {
      clearTimeout(undoTimer);
      undoBar.classList.remove('is-on');
      onUndo();
    });
  }
  undoBar.classList.add('is-on');
  clearTimeout(undoTimer);
  undoTimer = setTimeout(() => undoBar.classList.remove('is-on'), UNDO_MS);
}
function offerUndoDelete(find) {
  if (!find) return;
  const entry = addToTrash({ kind: 'find', item: find, photo: find.photo });
  showSnack('Moved to Recently deleted', () => restoreFromTrash(entry));
}

// V3 Recently deleted (Melissa, 27 Nov): deleted finds and gems wait here for 30 days
const TRASH_DAYS = 30;
const DAY_MS = 86400000;
const trash = [];
const trashEl = document.getElementById('trash');
const trashGrid = document.getElementById('trashGrid');
const trashRow = document.getElementById('trashRow');
let trashPending = null;
function addToTrash(entry) {
  const e = { ...entry, id: `trash-${Date.now()}-${trash.length}`, deletedAt: Date.now() };
  trash.unshift(e);
  paintTrash();
  return e;
}
function restoreFromTrash(entry) {
  const i = trash.indexOf(entry);
  if (i < 0) return;
  trash.splice(i, 1);
  if (entry.kind === 'find') pendingSort.unshift(entry.item);
  else gems.unshift(entry.item);
  showSnack(entry.kind === 'find' ? 'Photo restored to your pile' : 'Gem restored');
  paintTrash();
  refreshHub(entry.kind === 'gem' ? entry.item.id : undefined);
}
function paintTrash() {
  if (trashRow) {
    trashRow.hidden = trash.length === 0;
    document.getElementById('trashCount').textContent = String(trash.length);
  }
  if (!trashGrid) return;
  trashGrid.replaceChildren();
  document.getElementById('trashEmpty').hidden = trash.length > 0;
  trash.forEach((e) => {
    const left = Math.max(1, TRASH_DAYS - Math.floor((Date.now() - e.deletedAt) / DAY_MS));
    const tile = document.createElement('div');
    tile.className = 'trash-tile';
    tile.innerHTML = `<div class="trash-photo"><img src="${e.photo}" alt=""><span class="trash-days">${left} days</span></div>
      <div class="trash-actions"><button type="button" class="trash-btn" data-act="restore">Restore</button><button type="button" class="trash-btn is-danger" data-act="delete">Delete</button></div>`;
    tile.querySelector('[data-act=restore]').addEventListener('click', () => restoreFromTrash(e));
    tile.querySelector('[data-act=delete]').addEventListener('click', () => { trashPending = e; document.getElementById('trashConfirm').hidden = false; });
    trashGrid.appendChild(tile);
  });
}
function openTrash() {
  clearMapTips();
  paintTrash();
  trashEl.hidden = false;
  trashEl.setAttribute('aria-hidden', 'false');
}
function closeTrash() {
  trashEl.hidden = true;
  trashEl.setAttribute('aria-hidden', 'true');
}
if (trashEl) {
  trashRow.addEventListener('click', openTrash);
  document.getElementById('trashBack').addEventListener('click', closeTrash);
  document.getElementById('trashConfirmNo').addEventListener('click', () => { trashPending = null; document.getElementById('trashConfirm').hidden = true; });
  document.getElementById('trashConfirmYes').addEventListener('click', () => {
    const i = trash.indexOf(trashPending);
    if (i >= 0) trash.splice(i, 1);
    trashPending = null;
    document.getElementById('trashConfirm').hidden = true;
    showSnack('Deleted for good');
    paintTrash();
  });
}
// your own gems can be deleted from the ⋯ menu in V3; they go to Recently deleted too
const detailDelete = document.getElementById('detailDelete');
if (detailDelete) {
  detailDelete.addEventListener('click', () => {
    const gem = findGem(openGemId);
    setDetailMenuOpen(false);
    if (!gem || !gem.owned) return;
    gems = gems.filter((g) => g !== gem);
    closeDetail();
    refreshHub();
    const entry = addToTrash({ kind: 'gem', item: gem, photo: gem.imageUri });
    showSnack('Moved to Recently deleted', () => restoreFromTrash(entry));
  });
}

// V3 Sort layout: swipe (default) or drag right, a big photo dragged onto the publish, hidden or delete rail stacked on the right (Melissa, 27 Nov)
const SORT_LAYOUT_KEY = 'location-gems-sort-layout';
const SORT_LAYOUTS = ['swipe', 'right', 'right-mid', 'split'];
const SORT_DRAG_LAYOUTS = ['right', 'right-mid', 'split'];
const SORT_INTRO_KEYS = { right: 'sortIntroRight', 'right-mid': 'sortIntroRightMid', split: 'sortIntroSplit' };
let sortLayout = SORT_LAYOUTS[0];
function sortRightIntroKey() {
  return SORT_INTRO_KEYS[sortLayout] || 'sortIntroRight';
}
const SORT_CARD_TILT_DEG = -4;
function sortCardTilt() {
  return isSortRight() ? 0 : SORT_CARD_TILT_DEG;
}
function isSortRight() {
  return isV3() && document.body.classList.contains('sort-layout-right');
}
// The slightest move up lights publish and down lights delete; a move to the right that stays level lights hidden
const SORT_RIGHT_NUDGE_Y = 10;
const SORT_RIGHT_NUDGE_X = 14;
function sortRightModeFromDelta(dx, dy) {
  if (sortLayout === 'split') {
    if (dx <= -SORT_RIGHT_NUDGE_X && -dx > Math.abs(dy)) return 'delete';
    if (dy <= -SORT_RIGHT_NUDGE_Y) return 'public';
    if (dy >= SORT_RIGHT_NUDGE_Y) return 'private';
    return null;
  }
  const level = sortLayout === 'right-mid' ? 'delete' : 'private';
  const down = sortLayout === 'right-mid' ? 'private' : 'delete';
  if (dy <= -SORT_RIGHT_NUDGE_Y) return 'public';
  if (dy >= SORT_RIGHT_NUDGE_Y) return down;
  if (dx >= SORT_RIGHT_NUDGE_X) return level;
  return null;
}
function setSortLayout(layout) {
  const next = SORT_LAYOUTS.includes(layout) ? layout : SORT_LAYOUTS[0];
  sortLayout = next;
  document.body.classList.toggle('sort-layout-right', SORT_DRAG_LAYOUTS.includes(next));
  document.body.classList.toggle('sort-variant-mid', next === 'right-mid');
  document.body.classList.toggle('sort-variant-split', next === 'split');
  document.querySelectorAll('[data-sort-layout]').forEach((b) => {
    const on = b.dataset.sortLayout === next;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  try { localStorage.setItem(SORT_LAYOUT_KEY, next); } catch (e) { /* private window */ }
  applyStaticCopy();
}
document.querySelectorAll('[data-sort-layout]').forEach((b) => b.addEventListener('click', () => setSortLayout(b.dataset.sortLayout)));
setSortLayout((() => { try { return localStorage.getItem(SORT_LAYOUT_KEY); } catch (e) { return null; } })());

// V3 opal behind the heading: faceted low-poly triangles in opal colours, drawn once with a fixed seed
const OPAL_COLS = 12;
const OPAL_ROWS = 7;
const OPAL_W = 320;
const OPAL_H = 190;
const OPAL_JITTER = 0.38;
const OPAL_SEED = 27;
const OPAL_FIRE_CHANCE = 0.08;
const OPAL_PALETTE = ['#7dffd8', '#5fd3ff', '#8f9bff', '#c58bff', '#ff8fc8', '#ffc98a', '#9dffb0', '#6fe7ff'];
function drawOpal(host) {
  if (!host) return;
  let seed = OPAL_SEED;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const cw = OPAL_W / OPAL_COLS;
  const rh = OPAL_H / OPAL_ROWS;
  const pts = [];
  for (let r = 0; r <= OPAL_ROWS; r += 1) {
    const row = [];
    for (let c = 0; c <= OPAL_COLS; c += 1) {
      const edgeX = c === 0 || c === OPAL_COLS;
      const edgeY = r === 0 || r === OPAL_ROWS;
      row.push([
        c * cw + (edgeX ? 0 : (rand() - 0.5) * cw * OPAL_JITTER * 2),
        r * rh + (edgeY ? 0 : (rand() - 0.5) * rh * OPAL_JITTER * 2),
      ]);
    }
    pts.push(row);
  }
  const tri = (a, b, c, i) => {
    const fire = rand() < OPAL_FIRE_CHANCE;
    const fill = fire ? '#fffbe8' : OPAL_PALETTE[(i + Math.floor(rand() * 3)) % OPAL_PALETTE.length];
    const op = (fire ? 0.9 : 0.35 + rand() * 0.55).toFixed(2);
    return `<polygon points="${[a, b, c].map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')}" fill="${fill}" fill-opacity="${op}"/>`;
  };
  let polys = '';
  for (let r = 0; r < OPAL_ROWS; r += 1) {
    for (let c = 0; c < OPAL_COLS; c += 1) {
      const band = Math.floor((c / OPAL_COLS) * OPAL_PALETTE.length);
      const [a, b, d, e] = [pts[r][c], pts[r][c + 1], pts[r + 1][c], pts[r + 1][c + 1]];
      if ((r + c) % 2) polys += tri(a, b, e, band) + tri(a, e, d, band + 1);
      else polys += tri(a, b, d, band) + tri(b, e, d, band + 1);
    }
  }
  host.innerHTML = `<svg viewBox="0 0 ${OPAL_W} ${OPAL_H}" preserveAspectRatio="none">${polys}</svg>`;
}
drawOpal(document.getElementById('v3Opal'));
