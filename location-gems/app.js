/** Location Gems hub — LOCATION-GEMS-HUB-v7 */
const SPOOF_COLLECTED_GEM_ID = 'spoof-collected-gem-prototype';
const SPOOF_COLLECTED_GEM_AUTHOR = 'RiverWalker';
const PROTOTYPE_GEM_IMAGE = 'assets/prototype-gem.webp';
const ELF_SRC = 'assets/elf.png';
const MY_USER = '@you';

/** Same faceted gem as daily-side-quests map pins — StoryCity design, not AI */
const GEM_OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE = 'M9 7.5H15L12 20.5Z';
const GEM_FACETS = 'M9 7.5L12 20.5L15 7.5M1.5 7.5H22.5';

const PUBLIC_GEM_FILL = '#00c2ff';
const HIDDEN_GEM_FILL = '#9370c4';
const SILVER_GEM_FILL = '#c8d2e6';
const GOLD_GEM_FILL = '#ffc448';
const PLATINUM_GEM_FILL = '#e8eef8';
const DIAMOND_GEM_FILL = '#b4f0ff';

const RARITY = {
  cyan: { id: 'cyan', fill: PUBLIC_GEM_FILL, label: 'cyan', minLikes: 0 },
  silver: { id: 'silver', fill: SILVER_GEM_FILL, label: 'silver', minLikes: 20 },
  gold: { id: 'gold', fill: GOLD_GEM_FILL, label: 'gold', minLikes: 50 },
  platinum: { id: 'platinum', fill: PLATINUM_GEM_FILL, label: 'platinum', minLikes: 100 },
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
    text: '[debug find 1]',
    place: 'Whimsy Walk · near you',
    likes: 0,
    pending: true,
  },
  {
    id: 'find-you-b',
    user: MY_USER,
    photo: 'assets/find-b.jpg',
    text: '[debug find 2]',
    place: 'Whimsy Walk · near you',
    likes: 0,
    pending: true,
  },
  {
    id: 'find-you-c',
    user: MY_USER,
    photo: 'assets/find-c.jpg',
    text: '[debug find 3]',
    place: 'Whimsy Walk · near you',
    likes: 0,
    pending: true,
  },
];

const TAP_ANYWHERE = 'Tap anywhere to continue';
const ROTATE_MS = 2200;
const TIP_KEY = 'location-gems-hub-snapshot-tip-seen';
const ONBOARD_KEY = 'location-gems-hub-onboard-seen';
const SWIPE_COMMIT_X = 72;
const SWIPE_COMMIT_Y = 78;
const HAZE_IN_MS = 160;
const SHINE_MS = 1400;
const HOLD_AFTER_SHINE_MS = 500;
const COPY_CELEBRATE_MS = 780;
const HAZE_OUT_MS = 300;
const CARD_IN_MS = 980;
const CARD_OUT_MS = 560;
const FLY_MS = 720;
const LIKES_DEMO = 12;
const HOLD_RING_LEN = 163.36;

const GLANCE_ARC_CX = 120;
const GLANCE_ARC_CY = 96;
const GLANCE_ARC_R = 80;
const GLANCE_ARC_START = 190;
const GLANCE_ARC_END = -10;

const COPY = {
  emptyPublicTitle: '[no public gems yet]',
  emptyPublicBody: '[publish a find or collect one on a walk — they show here with a cyan glow]',
  emptyHiddenTitle: '[no hidden gems yet]',
  emptyHiddenBody: '[keep a find just for you — dull purple, only you can see it]',
  spoofCollectedTitle: 'Morning light on the corner',
  spoofCollectedTagline: 'Fresh bread before the city wakes',
  spoofCollectedReflection:
    'This corner always smells like fresh bread before the city wakes up. I come here when I need to feel grounded.',
  detailOwnSubtitle: 'A memory you marked on the map',
  detailCollectedSubtitle: 'A memory another reader left at this place',
  railPrivate: '[keep hidden]',
  railPublic: '[publish]',
  railDelete: '[delete]',
  dropHidden: '[hidden gems]',
  dropPublic: '[public gems]',
  likesSubtitle: '[on this public gem]',
  detailNav: '[navigate to gem]',
  detailPublish: '[publish gem]',
  detailUnpublish: '[unpublish gem]',
  detailAdd: '[add more to this gem]',
  bannerOwn: '[add as many entries as you like on your gem]',
  bannerOther: '[you have to be at the location to add more to somebody else’s gem]',
  holdHint: 'Press + hold the photo — sides light up. Then swipe.',
  holdHintDrag: 'Press + hold — then drag onto Hidden or Public.',
  sortTitle: '[sort finds into gems]',
  sortIntro:
    '[press and hold the photo — swipe left to keep hidden, right to publish, or down to delete]',
  sortIntroDrag:
    '[press and hold the photo — drag onto Hidden gems or Public gems]',
  publicIntroTitle: '[public gems]',
  publicIntroBody:
    '[on the map for others — cyan glow; more likes unlock silver → gold → platinum → diamond]',
  hiddenIntroTitle: '[hidden gems]',
  hiddenIntroBody: '[only for you — dull purple. publish anytime from the gem]',
  privateBadge: '[hidden]',
  publicBadge: '[public]',
  descriptionLabel: '[description]',
  sortEmpty: '[all finds sorted — scroll for your gems]',
  allSortedCount: '[all sorted]',
  leftCount: (n) => `${n} left`,
  likesHeart: (n) => `${n} ♥`,
  likesPlain: (n) => `${n} likes`,
  leftBy: (name) => `Left by @${name}`,
  navigateSpoof: '[navigate spoofed — walk to gem]',
  anotherEntry: '[another entry on this gem]',
  gemNearby: '[gem nearby]',
  feedLive: '[your public gem is live]',
};

const SPOOF_COPY = {
  railPrivate: 'Keep as a quiet gem',
  railPublic: 'Publish this gem',
  railDelete: 'Toss this find',
  dropHidden: 'Hidden gems',
  dropPublic: 'Public gems',
  likesSubtitle: 'on this public gem',
  detailNav: 'Navigate to gem',
  detailPublish: 'Publish gem',
  detailUnpublish: 'Unpublish gem',
  detailAdd: 'Add more to this gem',
  bannerOwn: 'On your gems, add as much as you’d like.',
  bannerOther: 'On somebody else’s gems, be at the location to add more.',
  holdHint: 'Press + hold the photo — sides light up. Then swipe.',
  holdHintDrag: 'Press + hold — drag onto Hidden or Public.',
  sortTitle: 'Sort finds into gems',
  sortIntro: 'Press and hold the photo — swipe left hidden, right publish, down delete.',
  sortIntroDrag: 'Press and hold — drag onto Hidden gems or Public gems.',
  publicIntroTitle: 'Public gems',
  publicIntroBody:
    'On the map for others — cyan glow; more likes unlock silver → gold → platinum → diamond.',
  hiddenIntroTitle: 'Hidden gems',
  hiddenIntroBody: 'Only for you — dull purple. Publish anytime from the gem.',
  privateBadge: 'Hidden',
  publicBadge: 'Public',
  descriptionLabel: 'Description',
  sortEmpty: 'All finds sorted — scroll for your gems',
  allSortedCount: 'All sorted',
  leftCount: (n) => `${n} left`,
  likesHeart: (n) => `${n} likes`,
  likesPlain: (n) => `${n} likes on this gem`,
  likesLine: (n) => `${n} likes on this gem`,
  leftBy: (name) => `Left by @${name}`,
  navigateSpoof: 'Navigate spoofed — you’d walk to this gem',
  anotherEntry: 'Another line on my gem',
  gemNearby: 'Gem nearby',
  feedLive: 'Your public gem is live',
  emptyPublicTitle: 'No public gems yet',
  emptyPublicBody: 'Publish a find or collect one on a walk — cyan glow lives here.',
  emptyHiddenTitle: 'No hidden gems yet',
  emptyHiddenBody: 'Keep a find just for you — dull purple, only you see it.',
  detailOwnSubtitle: 'A memory you marked on the map',
  detailCollectedSubtitle: 'A memory another reader left at this place',
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
const detailRarity = document.getElementById('detailRarity');
const detailChips = document.getElementById('detailChips');
const detailSectionLabel = document.getElementById('detailSectionLabel');
const detailNav = document.getElementById('detailNav');
const detailPublish = document.getElementById('detailPublish');
const detailEntries = document.getElementById('detailEntries');
const detailBanner = document.getElementById('detailBanner');
const detailBannerCopy = document.getElementById('detailBannerCopy');
const detailAdd = document.getElementById('detailAdd');
const hubScroll = document.getElementById('hubScroll');
const hint = document.getElementById('hint');
const resetHub = document.getElementById('resetHub');
const feedStrip = document.getElementById('feedStrip');
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
const holdCue = document.getElementById('holdCue');
const holdRingFill = document.getElementById('holdRingFill');
const spot = document.getElementById('spot');
const spotTip = document.getElementById('spotTip');
const snack = document.getElementById('snack');
const likesBanner = document.getElementById('likesBanner');
const likesShine = document.getElementById('likesShine');
const likesCopy = document.getElementById('likesCopy');
const likesHeadline = document.getElementById('likesHeadline');
const likesSubtitle = document.getElementById('likesSubtitle');
const likesJamCard = document.getElementById('likesJamCard');
const likesJamPhoto = document.getElementById('likesJamPhoto');
const likesJamUser = document.getElementById('likesJamUser');
const likesJamText = document.getElementById('likesJamText');
const likesJamPlace = document.getElementById('likesJamPlace');
const flyLayer = document.getElementById('flyLayer');
const debugLikes = document.getElementById('debugLikes');
const debugOnboard = document.getElementById('debugOnboard');
const debugSpoof = document.getElementById('debugSpoof');
const debugDragMode = document.getElementById('debugDragMode');

/** @type {'public'|'hidden'} */
let activeSection = 'public';
/** @type {any[]} */
let gems = [];
/** @type {string[]} */
let favouriteGemIds = [];
/** @type {any[]} */
let pendingSort = [];
let openGemId = null;
let placeIndex = 0;
let gemSeq = 0;
let likesBusy = false;
let spoofWording = false;
let dragMode = false;
/** @type {any} */
let drag = null;
/** @type {Array<() => void>} */
const pendingEnds = [];

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

function gemSvg(fill) {
  return `<svg viewBox="0 0 24 22" aria-hidden="true">
    <path d="${GEM_OUTLINE}" fill="${fill}"/>
    <path d="${GEM_TABLE}" fill="#fff" fill-opacity="0.3"/>
    <path d="${GEM_SHADE}" fill="#000" fill-opacity="0.22"/>
    <path d="${GEM_FACETS}" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="1" stroke-linejoin="round"/>
    <path d="${GEM_OUTLINE}" fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
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
    createdAt: new Date().toISOString(),
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
  return gems.filter((g) => !g.isPublic && g.owned);
}

function emptyCopy() {
  if (activeSection === 'public') {
    return { title: t('emptyPublicTitle'), body: t('emptyPublicBody') };
  }
  return { title: t('emptyHiddenTitle'), body: t('emptyHiddenBody') };
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
  } else {
    sectionIntroTitle.textContent = t('hiddenIntroTitle');
    sectionIntroBody.textContent = t('hiddenIntroBody');
  }
}

function buildGemCard(gem, opts = {}) {
  const rarity = rarityForLikes(gem.likes, gem.isPublic);
  const wrap = document.createElement('div');
  wrap.className = 'gem-card';
  if (opts.enter) wrap.classList.add('is-enter');
  const img = document.createElement('img');
  img.className = 'gem-card-photo';
  img.src = gem.imageUri;
  img.alt = '';
  img.decoding = 'async';
  wrap.appendChild(img);
  const likes = publicLikes(gem);
  if (gem.isPublic && likes > 0) {
    const likesEl = document.createElement('span');
    likesEl.className = 'gem-card-likes';
    likesEl.textContent = t('likesHeart', likes);
    wrap.appendChild(likesEl);
  }
  if (gem.isPublic && rarity.id !== 'cyan') {
    const rarityEl = document.createElement('span');
    rarityEl.className = 'gem-card-rarity';
    rarityEl.textContent = rarity.label;
    wrap.appendChild(rarityEl);
  }
  const gemEl = document.createElement('span');
  gemEl.className = 'gem-card-gem';
  if (!gem.isPublic) gemEl.classList.add('is-hidden-fill');
  else if (rarity.id !== 'cyan') gemEl.classList.add(`is-${rarity.id}`);
  gemEl.innerHTML = gemSvg(rarity.fill);
  wrap.appendChild(gemEl);
  return wrap;
}

function renderFeed() {
  feedStrip.replaceChildren();
  const publicGems = gems.filter((g) => g.isPublic);
  const items = publicGems.slice(0, 5).map((g) => ({
    photo: g.imageUri,
    title: g.owned ? displayCopy(getGemTitle(g)) : `@${g.authorUsername || 'walker'}`,
    body: displayCopy(getGemTagline(g)) || t('gemNearby'),
  }));
  items.forEach((item) => {
    const chip = document.createElement('article');
    chip.className = 'feed-chip';
    chip.innerHTML = `<img src="${item.photo}" alt=""><p><strong>${item.title}</strong>${item.body}</p>`;
    feedStrip.appendChild(chip);
  });
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
    const caption = document.createElement('p');
    caption.className = 'gem-card-caption';
    caption.textContent = displayCopy(getGemTagline(gem) || getGemTitle(gem) || '—');
    cell.appendChild(caption);
    gemGrid.appendChild(cell);
  });
}

function setSortingFocus(on) {
  hub.classList.toggle('is-sorting-focus', on && pendingSort.length > 0);
}

function hideTargets() {
  [railPrivate, railPublic, railDelete].forEach((rail) => {
    rail.classList.remove('is-on', 'is-flash', 'is-hot');
  });
  [dropHidden, dropPublic].forEach((zone) => {
    zone.classList.remove('is-on', 'is-hot');
  });
}

function setTargets(mode, armed) {
  if (!armed) {
    hideTargets();
    return;
  }
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
    rail.classList.add('is-on', 'is-flash');
    rail.classList.remove('is-hot');
  });
  if (mode === 'private') {
    railPrivate.classList.add('is-hot');
    railPrivate.classList.remove('is-flash');
  } else if (mode === 'public') {
    railPublic.classList.add('is-hot');
    railPublic.classList.remove('is-flash');
  } else if (mode === 'delete') {
    railDelete.classList.add('is-hot');
    railDelete.classList.remove('is-flash');
  }
}

function setHoldCue(on, ready) {
  holdCue.classList.toggle('is-on', on);
  holdCue.classList.toggle('is-ready', !!ready);
  if (on) {
    holdRingFill.style.transition = 'stroke-dashoffset 280ms linear';
    holdRingFill.style.strokeDashoffset = '0';
  } else {
    holdRingFill.style.transition = 'none';
    holdRingFill.style.strokeDashoffset = String(HOLD_RING_LEN);
  }
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
  setSortingFocus(false);
  hideTargets();
  setHoldCue(false, false);
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

function showTip(visible) {
  snapshotTip.hidden = !visible;
  snapshotTip.setAttribute('aria-hidden', visible ? 'false' : 'true');
  cameraButton.classList.toggle('is-highlighted', visible);
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
  const entries =
    Array.isArray(gem.entries) && gem.entries.length
      ? gem.entries
      : [gem.caption || gem.tagline || ''].filter(Boolean);
  detailEntries.replaceChildren();
  if (!entries.length) {
    detailEntries.hidden = true;
    return;
  }
  entries.forEach((text) => {
    const p = document.createElement('p');
    p.className = 'detail-entry';
    p.textContent = displayCopy(text);
    detailEntries.appendChild(p);
  });
  detailEntries.hidden = false;
  detailBanner.hidden = false;
  detailBannerCopy.textContent = gem.owned ? t('bannerOwn') : t('bannerOther');
  detailAdd.hidden = !gem.owned;
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
  const likes = publicLikes(gem);
  if (gem.isPublic && likes > 0) {
    detailLikes.hidden = false;
    detailLikes.textContent = t('likesPlain', likes);
  } else {
    detailLikes.hidden = true;
  }
  if (gem.isPublic && rarity.id !== 'cyan') {
    detailRarity.hidden = false;
    detailRarity.textContent = rarity.label;
  } else {
    detailRarity.hidden = true;
  }
  detailChips.replaceChildren();
  const visChip = document.createElement('span');
  visChip.className = 'detail-chip';
  visChip.textContent = gem.isPublic ? t('publicBadge') : t('privateBadge');
  detailChips.appendChild(visChip);
  if (gem.isPublic && rarity.id !== 'cyan') {
    const rChip = document.createElement('span');
    rChip.className = 'detail-chip';
    rChip.textContent = rarity.label;
    detailChips.appendChild(rChip);
  }
  if (gem.owned) {
    detailPublish.hidden = false;
    detailPublish.textContent = gem.isPublic ? t('detailUnpublish') : t('detailPublish');
  } else {
    detailPublish.hidden = true;
  }
  if (gem.authorUsername) {
    detailAuthor.hidden = false;
    detailAuthor.textContent = t('leftBy', gem.authorUsername);
  } else {
    detailAuthor.hidden = true;
  }
  detailSectionLabel.textContent = t('descriptionLabel');
  detailCaption.textContent = displayCopy(gem.caption || '');
  detailNav.hidden = false;
  detailNav.textContent = t('detailNav');
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
  gem.entries.push(t('anotherEntry'));
  renderDetailEntries(gem);
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

function hideSnack() {
  snack.classList.remove('on');
  snack.hidden = true;
}

function showSnack(text) {
  snack.innerHTML = `<p>${text}</p><button type="button" class="snx" aria-label="Dismiss tip">×</button><img class="elf" src="${ELF_SRC}" alt="">`;
  snack.hidden = false;
  requestAnimationFrame(() => snack.classList.add('on'));
  snack.querySelector('.snx').onclick = hideSnack;
}

function spotlight(target, text, opts = {}) {
  return new Promise((done) => {
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
    spotTip.innerHTML = `${opts.step ? `<em>${opts.step}</em>` : ''}${
      opts.title ? `<b>${opts.title}</b>` : ''
    }<p>${text}</p><small>${TAP_ANYWHERE}</small><img class="elf" src="${ELF_SRC}" alt="">`;
    spot.hidden = false;
    const end = () => {
      spot.hidden = true;
      spot.onclick = null;
      done();
    };
    spot.onclick = end;
    pendingEnds.push(end);
  });
}

function clearSpotlights() {
  pendingEnds.splice(0).forEach((fn) => fn());
  spot.hidden = true;
  hideSnack();
}

async function runOnboardingTips() {
  clearSpotlights();
  sortInline.scrollIntoView({ block: 'nearest' });
  await wait(80);
  if (pendingSort.length) {
    const card = sortStack.querySelector('.sort-card:not(.is-under)') || sortStack;
    await spotlight(card, '[press and hold the photo — that activates the sides]', {
      step: '1 of 3',
      title: '[sort finds]',
    });
  }
  if (dragMode) {
    await spotlight(dropHidden, '[drag onto hidden gems to keep it just for you]', {
      step: '2 of 3',
      title: t('dropHidden'),
    });
    await spotlight(dropPublic, '[drag onto public gems to publish it]', {
      step: '3 of 3',
      title: t('dropPublic'),
    });
  } else {
    await spotlight(railPrivate, '[swipe left = hidden purple gem]', {
      step: '2 of 3',
      title: t('railPrivate'),
    });
    await spotlight(railPublic, '[swipe right = public cyan gem]', {
      step: '3 of 3',
      title: t('railPublic'),
    });
  }
  showSnack('[scroll for public / hidden gems]');
  storageSet(ONBOARD_KEY);
}

function railModeFromDelta(dx, dy) {
  if (dragMode) {
    if (dx < -36) return 'private';
    if (dx > 36) return 'public';
    return null;
  }
  if (dy > 48 && Math.abs(dx) < 64) return 'delete';
  if (dx > 36) return 'public';
  if (dx < -36) return 'private';
  return null;
}

function bindSortDrag(card) {
  const snapBack = () => {
    card.classList.remove('is-dragging');
    card.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.transform = 'rotate(-4deg)';
    window.setTimeout(() => {
      card.style.transition = '';
      card.style.transform = '';
    }, 240);
  };

  const finishDrag = (dx, dy) => {
    const armed = !!(drag && drag.armed);
    drag = null;
    setHoldCue(false, false);
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
      setHoldCue(true, true);
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
      setTargets(railModeFromDelta(drag.dx, drag.dy), true);
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
    const card = document.createElement('div');
    card.className = 'fly-card is-swing';
    card.innerHTML = `<img src="${photoSrc}" alt="">`;
    const stage = document.getElementById('sortStage');
    const sr = stage.getBoundingClientRect();
    const pr = phone.getBoundingClientRect();
    card.style.left = `${sr.left - pr.left + sr.width / 2 - 70}px`;
    card.style.top = `${sr.top - pr.top + 70}px`;
    if (!toPublic) card.style.animationName = 'gemSwingIn';
    flyLayer.appendChild(card);
    window.setTimeout(() => {
      card.remove();
      resolve();
    }, FLY_MS);
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
  card.style.transition = 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease';
  card.style.transform = fly;
  card.style.opacity = '0';
  await wait(260);
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

function pickLikedJam() {
  const publicGems = gems.filter((g) => g.isPublic && publicLikes(g) > 0);
  if (publicGems.length) {
    return publicGems.slice().sort((a, b) => publicLikes(b) - publicLikes(a))[0];
  }
  return createSpoofCollectedGem();
}

function fillLikesJamCard(gem) {
  likesJamPhoto.src = gem.imageUri;
  likesJamUser.textContent = gem.authorUsername ? `@${gem.authorUsername}` : MY_USER;
  likesJamText.textContent = getGemTagline(gem) || getGemTitle(gem);
  likesJamPlace.textContent = gem.title || '';
  const likes = publicLikes(gem) || LIKES_DEMO;
  likesHeadline.innerHTML = `<span class="likes-rich">${likes} likes</span>`;
  likesSubtitle.textContent = t('likesSubtitle');
}

async function playLikesBanner() {
  if (likesBusy) return;
  likesBusy = true;
  const gem = pickLikedJam();
  fillLikesJamCard(gem);
  likesBanner.hidden = false;
  likesBanner.classList.remove('is-out');
  likesBanner.classList.add('is-on');
  likesCopy.classList.remove('is-on');
  likesShine.classList.remove('is-on');
  likesJamCard.classList.remove('is-in', 'is-out');
  await wait(HAZE_IN_MS);
  likesShine.classList.add('is-on');
  likesJamCard.classList.add('is-in');
  await wait(CARD_IN_MS * 0.35);
  likesCopy.classList.add('is-on');
  await wait(SHINE_MS + HOLD_AFTER_SHINE_MS);
  await wait(COPY_CELEBRATE_MS * 0.35);
  likesJamCard.classList.remove('is-in');
  likesJamCard.classList.add('is-out');
  await wait(CARD_OUT_MS);
  likesBanner.classList.add('is-out');
  await wait(HAZE_OUT_MS);
  likesBanner.hidden = true;
  likesBanner.classList.remove('is-on', 'is-out');
  likesShine.classList.remove('is-on');
  likesCopy.classList.remove('is-on');
  likesJamCard.classList.remove('is-in', 'is-out');
  likesBusy = false;
}

function setSpoofWording(on) {
  spoofWording = on;
  debugSpoof.setAttribute('aria-pressed', on ? 'true' : 'false');
  debugSpoof.textContent = on ? 'Debug: spoof wording ✓' : 'Debug: spoof wording';
  refreshHub();
  if (openGemId) openDetail(openGemId);
}

function setDragMode(on) {
  dragMode = on;
  hub.classList.toggle('is-drag-mode', on);
  debugDragMode.setAttribute('aria-pressed', on ? 'true' : 'false');
  debugDragMode.textContent = on ? 'Debug: drag to sections ✓' : 'Debug: drag to sections';
  dropHidden.hidden = !on;
  dropPublic.hidden = !on;
  dropHidden.setAttribute('aria-hidden', on ? 'false' : 'true');
  dropPublic.setAttribute('aria-hidden', on ? 'false' : 'true');
  hideTargets();
  applyStaticCopy();
}

function resetState() {
  clearSpotlights();
  gems = [];
  favouriteGemIds = [];
  gemSeq = 0;
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
  railPrivateIcon.innerHTML = gemSvg(HIDDEN_GEM_FILL);
  railPublicIcon.innerHTML = gemSvg(PUBLIC_GEM_FILL);
  dropHiddenIcon.innerHTML = gemSvg(HIDDEN_GEM_FILL);
  dropPublicIcon.innerHTML = gemSvg(PUBLIC_GEM_FILL);
  tabPublicIcon.innerHTML = gemSvg(PUBLIC_GEM_FILL);
  tabHiddenIcon.innerHTML = gemSvg(HIDDEN_GEM_FILL);
  holdRingFill.style.strokeDasharray = String(HOLD_RING_LEN);
  holdRingFill.style.strokeDashoffset = String(HOLD_RING_LEN);
}

function init() {
  initIcons();
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
resetHub.addEventListener('click', resetState);
debugLikes.addEventListener('click', () => playLikesBanner());
debugOnboard.addEventListener('click', () => runOnboardingTips());
debugSpoof.addEventListener('click', () => setSpoofWording(!spoofWording));
debugDragMode.addEventListener('click', () => setDragMode(!dragMode));

init();
