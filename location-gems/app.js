/** Location Gems hub — LOCATION-GEMS-HUB-v4 */
const SPOOF_COLLECTED_GEM_ID = 'spoof-collected-gem-prototype';
const SPOOF_COLLECTED_GEM_AUTHOR = 'RiverWalker';
const PROTOTYPE_GEM_IMAGE = 'assets/prototype-gem.webp';
const ELF_SRC = 'assets/elf.png';
const MY_USER = '@you';
const MY_GEM_FILL = '#b36bff';
const GEM_OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE = 'M9 7.5H15L12 20.5Z';
const GEM_FACETS = 'M9 7.5L12 20.5L15 7.5M1.5 7.5H22.5';

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
    likes: 7,
    collected: true,
  },
  {
    id: 'find-fox',
    user: '@foxtrail',
    photo: 'assets/find-d.jpg',
    text: 'Fox silhouette in the ivy on the mailbox.',
    place: '28 St NW',
    likes: 21,
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
const GRID_GAP = 16;
const H_PAD = 24;
const SWIPE_COMMIT_X = 72;
const SWIPE_COMMIT_Y = 78;
const HOLD_MS = 420;
const HAZE_IN_MS = 160;
const SHINE_MS = 1400;
const HOLD_AFTER_SHINE_MS = 500;
const COPY_CELEBRATE_MS = 780;
const HAZE_OUT_MS = 300;
const CARD_IN_MS = 980;
const CARD_OUT_MS = 560;
const LIKES_DEMO = 12;
const HOLD_RING_LEN = 163.36;

const GLANCE_ARC_CX = 120;
const GLANCE_ARC_CY = 96;
const GLANCE_ARC_R = 80;
const GLANCE_ARC_START = 190;
const GLANCE_ARC_END = -10;

const COPY = {
  emptyCollectedTitle: 'No gems collected yet',
  emptyCollectedBody:
    'While you explore an adventure, gems left by others show up here — the bench, the view, the corner that made someone pause.',
  emptyCreatedTitle: "Nothing you've marked yet",
  emptyCreatedBody:
    'When a place catches you mid-adventure, tap the camera to leave a photo and a short note for whoever comes next.',
  emptyFavouritesTitle: 'No favourites yet',
  emptyFavouritesBody:
    'Tap the heart on any gem you love and it will be saved here for easy access.',
  spoofCollectedTitle: 'Morning light on the corner',
  spoofCollectedTagline: 'Fresh bread before the city wakes',
  spoofCollectedReflection:
    'This corner always smells like fresh bread before the city wakes up. I come here when I need to feel grounded.',
  detailOwnSubtitle: 'A memory you marked on the map',
  detailCollectedSubtitle: 'A memory another reader left at this place',
  railPrivate: '[keep hidden]',
  railPublic: '[make public]',
  railDelete: '[delete]',
  likesSubtitle: '[on this public gem]',
  detailNav: '[navigate to jam]',
  detailAdd: '[add more to this jam]',
  bannerOwn: '[add as many entries as you like on your jam]',
  bannerOther: '[you have to be at the location to add more to somebody else’s jam]',
  holdHint: 'Hold a card — then swipe.',
  privateBadge: '[hidden]',
  publicBadge: '[public]',
};

const SPOOF_COPY = {
  railPrivate: 'Keep as a quiet gem',
  railPublic: 'Publish this shiny gem',
  railDelete: 'Toss this find',
  likesSubtitle: 'on this public gem',
  detailNav: 'Navigate to jam',
  detailAdd: 'Add more to this jam',
  bannerOwn: 'On your gems, add as much as you’d like.',
  bannerOther: 'On somebody else’s gems, be at the location to add more.',
  holdHint: 'Hold, then swipe left / right / down.',
  privateBadge: 'Hidden',
  publicBadge: 'Public',
  likesLine: (n) => `${n} likes on this jam`,
};

const phone = document.getElementById('phone');
const hub = document.getElementById('hub');
const gemGrid = document.getElementById('gemGrid');
const emptyState = document.getElementById('emptyState');
const emptyTitle = document.getElementById('emptyTitle');
const emptyBody = document.getElementById('emptyBody');
const snapshotBtn = document.getElementById('snapshotBtn');
const cameraButton = document.getElementById('cameraButton');
const rotatingWord = document.getElementById('rotatingWord');
const snapshotTip = document.getElementById('snapshotTip');
const snapshotTipOk = document.getElementById('snapshotTipOk');
const snapshotTipScrim = document.getElementById('snapshotTipScrim');
const tabFavIcon = document.getElementById('tabFavIcon');
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
const detailVisibility = document.getElementById('detailVisibility');
const detailLikes = document.getElementById('detailLikes');
const detailNav = document.getElementById('detailNav');
const detailEntries = document.getElementById('detailEntries');
const detailBanner = document.getElementById('detailBanner');
const detailBannerCopy = document.getElementById('detailBannerCopy');
const detailAdd = document.getElementById('detailAdd');
const hint = document.getElementById('hint');
const resetHub = document.getElementById('resetHub');
const feedStrip = document.getElementById('feedStrip');
const sortSub = document.getElementById('sortSub');
const sortStack = document.getElementById('sortStack');
const sortEmpty = document.getElementById('sortEmpty');
const sortInline = document.getElementById('sortInline');
const railPrivate = document.getElementById('railPrivate');
const railPublic = document.getElementById('railPublic');
const railDelete = document.getElementById('railDelete');
const railPublicIcon = document.getElementById('railPublicIcon');
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
const debugLikes = document.getElementById('debugLikes');
const debugOnboard = document.getElementById('debugOnboard');
const debugSpoof = document.getElementById('debugSpoof');

/** @type {'collected'|'created'|'favourites'} */
let activeSection = 'collected';
/** @type {any[]} */
let createdGems = [];
/** @type {any[]} */
let collectedGems = [];
/** @type {string[]} */
let favouriteGemIds = [];
/** @type {any[]} */
let pendingSort = [];
let openGemId = null;
let placeIndex = 0;
let createdSeq = 0;
let likesBusy = false;
let spoofWording = false;
/** @type {any} */
let drag = null;
/** @type {Array<() => void>} */
const pendingEnds = [];

function t(key) {
  if (spoofWording && SPOOF_COPY[key]) return SPOOF_COPY[key];
  return COPY[key];
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
    likes: LIKES_DEMO,
    gemFill: MY_GEM_FILL,
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
    entries: [
      COPY.spoofCollectedReflection,
      '[another note left at this jam]',
    ],
  };
}

function findToCollectedGem(find) {
  return {
    id: `collected-${find.id}`,
    storyId: 'daily-side-quests',
    imageUri: find.photo,
    title: find.place,
    tagline: find.text,
    caption: find.text,
    authorUsername: find.user.replace(/^@/, ''),
    isPublic: true,
    likes: find.likes || 0,
    gemFill: MY_GEM_FILL,
    createdAt: new Date().toISOString(),
    entries: [find.text],
  };
}

function seedCollectedFromChallenges() {
  CHALLENGE_FINDS.filter((f) => f.collected).forEach((find) => {
    const id = `collected-${find.id}`;
    if (collectedGems.some((g) => g.id === id)) return;
    collectedGems.push(findToCollectedGem(find));
  });
  if (!collectedGems.some((g) => g.id === SPOOF_COLLECTED_GEM_ID)) {
    collectedGems.unshift(createSpoofCollectedGem());
  }
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
  if (gem.isPublic === false) return 0;
  return Number(gem.likes) || 0;
}

function activeGems() {
  if (activeSection === 'collected') return collectedGems;
  if (activeSection === 'created') return createdGems;
  return [...collectedGems, ...createdGems].filter((g) => favouriteGemIds.includes(g.id));
}

function emptyCopy() {
  if (activeSection === 'collected') {
    return { title: COPY.emptyCollectedTitle, body: COPY.emptyCollectedBody };
  }
  if (activeSection === 'created') {
    return { title: COPY.emptyCreatedTitle, body: COPY.emptyCreatedBody };
  }
  return { title: COPY.emptyFavouritesTitle, body: COPY.emptyFavouritesBody };
}

function polaroidWidth() {
  const w = phone.getBoundingClientRect().width || 376;
  return Math.floor((w - H_PAD * 2 - GRID_GAP) / 2);
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

function applyRailCopy() {
  document.querySelectorAll('[data-copy]').forEach((el) => {
    const key =
      el.dataset.copy === 'private'
        ? 'railPrivate'
        : el.dataset.copy === 'public'
          ? 'railPublic'
          : 'railDelete';
    el.textContent = t(key);
  });
  detailNav.textContent = t('detailNav');
  detailAdd.textContent = t('detailAdd');
  likesSubtitle.textContent = t('likesSubtitle');
  hint.textContent = t('holdHint');
}

function buildPolaroid(gem, width) {
  const wrap = document.createElement('div');
  wrap.className = 'polaroid';
  wrap.style.setProperty('--pw', `${width}px`);
  const tape = document.createElement('img');
  tape.className = 'polaroid-tape';
  tape.src = 'assets/polaroid_tape.svg';
  tape.alt = '';
  const frame = document.createElement('div');
  frame.className = 'polaroid-frame';
  const photo = document.createElement('div');
  photo.className = 'polaroid-photo';
  const img = document.createElement('img');
  img.src = gem.imageUri;
  img.alt = '';
  img.decoding = 'async';
  photo.appendChild(img);
  if (gem.gemFill) {
    const badge = document.createElement('div');
    badge.className = 'polaroid-gem-badge';
    badge.innerHTML = gemSvg(gem.gemFill);
    photo.appendChild(badge);
  }
  if (gem.isPublic === false) {
    const vis = document.createElement('span');
    vis.className = 'polaroid-badge';
    vis.textContent = t('privateBadge');
    photo.appendChild(vis);
  } else if (gem.isPublic === true && createdGems.some((g) => g.id === gem.id)) {
    const vis = document.createElement('span');
    vis.className = 'polaroid-badge';
    vis.textContent = t('publicBadge');
    photo.appendChild(vis);
  }
  const likes = publicLikes(gem);
  if (gem.isPublic !== false && likes > 0) {
    const likesEl = document.createElement('span');
    likesEl.className = 'polaroid-likes';
    likesEl.textContent = spoofWording
      ? SPOOF_COPY.likesLine(likes)
      : `${likes} ♥`;
    photo.appendChild(likesEl);
  }
  const caption = document.createElement('div');
  caption.className = 'polaroid-caption';
  const p = document.createElement('p');
  p.textContent = getGemTagline(gem) || getGemTitle(gem) || '—';
  caption.appendChild(p);
  frame.appendChild(photo);
  frame.appendChild(caption);
  wrap.appendChild(tape);
  wrap.appendChild(frame);
  return wrap;
}

function renderFeed() {
  feedStrip.replaceChildren();
  const publicCreated = createdGems.filter((g) => g.isPublic);
  const items = [
    ...publicCreated.slice(0, 2).map((g) => ({
      photo: g.imageUri,
      title: getGemTitle(g),
      body: spoofWording ? 'your public gem is live' : '[your public gem is live]',
    })),
    ...collectedGems.slice(0, 3).map((g) => ({
      photo: g.imageUri,
      title: `@${g.authorUsername || 'walker'}`,
      body: getGemTagline(g) || (spoofWording ? 'gem nearby' : '[gem nearby]'),
    })),
  ].slice(0, 5);
  items.forEach((item) => {
    const chip = document.createElement('article');
    chip.className = 'feed-chip';
    chip.innerHTML = `<img src="${item.photo}" alt=""><p><strong>${item.title}</strong>${item.body}</p>`;
    feedStrip.appendChild(chip);
  });
}

function renderGrid() {
  const gems = activeGems();
  const width = polaroidWidth();
  gemGrid.replaceChildren();
  if (!gems.length) {
    gemGrid.hidden = true;
    const copy = emptyCopy();
    emptyTitle.textContent = copy.title;
    emptyBody.textContent = copy.body;
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;
  gemGrid.hidden = false;
  gems.forEach((gem) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'gem-cell';
    cell.setAttribute('aria-label', getGemTitle(gem) || 'Gem');
    cell.appendChild(buildPolaroid(gem, width));
    cell.addEventListener('click', () => openDetail(gem.id));
    gemGrid.appendChild(cell);
  });
}

function setSortingFocus(on) {
  hub.classList.toggle('is-sorting-focus', on && pendingSort.length > 0);
}

function hideRails() {
  [railPrivate, railPublic, railDelete].forEach((rail) => {
    rail.classList.remove('is-on', 'is-flash', 'is-hot');
  });
}

function setRails(mode, armed) {
  if (!armed) {
    hideRails();
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
  if (!on) {
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
      <p class="sort-card-text">${find.text}</p>
      <p class="sort-card-place">📍 ${find.place}</p>
    </div>
  `;
  return card;
}

function renderSortStack() {
  sortStack.replaceChildren();
  const n = pendingSort.length;
  sortSub.textContent = n ? `${n} left` : '[all sorted]';
  sortEmpty.hidden = n > 0;
  setSortingFocus(false);
  hideRails();
  setHoldCue(false, false);
  if (!n) return;
  const top = pendingSort[0];
  const next = pendingSort[1];
  if (next) sortStack.appendChild(buildSortCard(next, true, false));
  const front = buildSortCard(top, false, true);
  sortStack.appendChild(front);
  bindSortDrag(front);
}

function refreshHub() {
  applyRailCopy();
  renderFeed();
  renderSortStack();
  renderGrid();
}

function setSection(section) {
  activeSection = section;
  document.querySelectorAll('.tab-button').forEach((btn) => {
    const on = btn.dataset.section === section;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  tabFavIcon.src =
    section === 'favourites' ? 'assets/fav_checked.svg' : 'assets/fav_unchecked.svg';
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
  return [...collectedGems, ...createdGems].find((g) => g.id === id) || null;
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
  if (activeSection === 'favourites') renderGrid();
}

function syncDetailFav() {
  if (!openGemId) return;
  detailFavIcon.src = isFavourite(openGemId)
    ? 'assets/fav_checked.svg'
    : 'assets/fav_unchecked.svg';
}

function renderDetailEntries(gem, owned) {
  const entries = Array.isArray(gem.entries) && gem.entries.length
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
    p.textContent = text;
    detailEntries.appendChild(p);
  });
  detailEntries.hidden = false;
  detailBanner.hidden = false;
  detailBannerCopy.textContent = owned ? t('bannerOwn') : t('bannerOther');
  detailAdd.hidden = !owned;
}

function openDetail(id) {
  const gem = findGem(id);
  if (!gem) return;
  openGemId = id;
  const owned = createdGems.some((g) => g.id === id);
  detailSubtitle.textContent = owned
    ? COPY.detailOwnSubtitle
    : COPY.detailCollectedSubtitle;
  detailPhoto.src = gem.imageUri;
  detailGemTitle.textContent = getGemTitle(gem);
  detailTagline.textContent = getGemTagline(gem);
  const likes = publicLikes(gem);
  if (gem.isPublic !== false && likes > 0) {
    detailLikes.hidden = false;
    detailLikes.textContent = spoofWording
      ? SPOOF_COPY.likesLine(likes)
      : `${likes} likes`;
  } else {
    detailLikes.hidden = true;
  }
  if (owned) {
    detailVisibility.hidden = false;
    detailVisibility.textContent = gem.isPublic ? t('publicBadge') : t('privateBadge');
  } else {
    detailVisibility.hidden = true;
  }
  if (gem.authorUsername) {
    detailAuthor.hidden = false;
    detailAuthor.textContent = `Left by @${gem.authorUsername}`;
  } else {
    detailAuthor.hidden = true;
  }
  detailCaption.textContent = gem.caption || '';
  detailNav.hidden = false;
  detailNav.textContent = t('detailNav');
  renderDetailEntries(gem, owned);
  syncDetailFav();
  detail.hidden = false;
  detail.setAttribute('aria-hidden', 'false');
}

function closeDetail() {
  openGemId = null;
  detail.hidden = true;
  detail.setAttribute('aria-hidden', 'true');
  if (activeSection === 'favourites') renderGrid();
}

function addEntryToOpenGem() {
  if (!openGemId) return;
  const gem = findGem(openGemId);
  if (!gem || !createdGems.some((g) => g.id === openGemId)) return;
  if (!Array.isArray(gem.entries)) gem.entries = [gem.caption || gem.tagline || ''].filter(Boolean);
  gem.entries.push(spoofWording ? 'Another line on my jam' : '[another entry on this jam]');
  renderDetailEntries(gem, true);
}

function addSampleCreatedGem() {
  createdSeq += 1;
  const photo = CHALLENGE_FINDS[(createdSeq - 1) % CHALLENGE_FINDS.length].photo;
  createdGems.unshift({
    id: `created-${Date.now()}-${createdSeq}`,
    storyId: 'location-gems-hub',
    imageUri: photo,
    title: 'Corner I marked',
    tagline: SNAPSHOT_PLACES[(createdSeq - 1) % SNAPSHOT_PLACES.length],
    caption: '[snapshot gem from hub camera]',
    isPublic: true,
    likes: 0,
    gemFill: MY_GEM_FILL,
    createdAt: new Date().toISOString(),
    entries: ['[snapshot gem from hub camera]'],
  });
  setSection('created');
  refreshHub();
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

/** first-story-flow spotlight — hole on target, tip with elf */
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
    await spotlight(card, '[hold the card first — then swipe]', {
      step: '1 of 4',
      title: '[sort finds]',
    });
  }
  await spotlight(railPrivate, '[left = hidden gem]', {
    step: '2 of 4',
    title: t('railPrivate'),
  });
  await spotlight(railPublic, '[right = shiny public gem]', {
    step: '3 of 4',
    title: t('railPublic'),
  });
  await spotlight(railDelete, '[down = lid / delete]', {
    step: '4 of 4',
    title: t('railDelete'),
  });
  showSnack('[scroll down for collected / created / favourites]');
  storageSet(ONBOARD_KEY);
}

function findToCreatedGem(find, isPublic) {
  createdSeq += 1;
  return {
    id: `sorted-${find.id}-${createdSeq}`,
    storyId: 'daily-side-quests',
    imageUri: find.photo,
    title: find.place,
    tagline: find.text,
    caption: find.text,
    isPublic,
    likes: isPublic ? LIKES_DEMO : 0,
    gemFill: MY_GEM_FILL,
    createdAt: new Date().toISOString(),
    entries: [find.text],
  };
}

function railModeFromDelta(dx, dy) {
  if (dy > 48 && Math.abs(dx) < 64) return 'delete';
  if (dx > 36) return 'public';
  if (dx < -36) return 'private';
  return null;
}

function bindSortDrag(card) {
  const clearHoldTimer = () => {
    if (drag && drag.holdTimer) {
      window.clearTimeout(drag.holdTimer);
      drag.holdTimer = null;
    }
  };

  const finishDrag = (dx, dy) => {
    const armed = !!(drag && drag.armed);
    clearHoldTimer();
    drag = null;
    setHoldCue(false, false);
    setRails(null, false);
    setSortingFocus(false);
    if (!armed) {
      card.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.transform = '';
      window.setTimeout(() => {
        card.style.transition = '';
      }, 240);
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
    if (dy > SWIPE_COMMIT_Y && Math.abs(dx) < SWIPE_COMMIT_X) {
      settleSort(card, 'delete');
      return;
    }
    card.style.transition = 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.transform = '';
    window.setTimeout(() => {
      card.style.transition = '';
    }, 240);
  };

  card.addEventListener(
    'pointerdown',
    (e) => {
      if (drag || e.button === 2) return;
      e.preventDefault();
      card.setPointerCapture(e.pointerId);
      hub.classList.add('is-sorting-focus');
      setHoldCue(true, false);
      holdRingFill.style.transition = `stroke-dashoffset ${HOLD_MS}ms linear`;
      holdRingFill.style.strokeDashoffset = '0';
      drag = {
        card,
        id: e.pointerId,
        x0: e.clientX,
        y0: e.clientY,
        dx: 0,
        dy: 0,
        armed: false,
        holdTimer: window.setTimeout(() => {
          if (!drag || drag.id !== e.pointerId) return;
          drag.armed = true;
          setHoldCue(true, true);
          setRails(null, true);
          hint.textContent = t('holdHint');
        }, HOLD_MS),
      };
    },
    { passive: false },
  );

  card.addEventListener(
    'pointermove',
    (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      e.preventDefault();
      drag.dx = e.clientX - drag.x0;
      drag.dy = e.clientY - drag.y0;
      if (!drag.armed) {
        if (Math.hypot(drag.dx, drag.dy) > 12) {
          clearHoldTimer();
          setHoldCue(false, false);
          holdRingFill.style.transition = 'none';
          holdRingFill.style.strokeDashoffset = String(HOLD_RING_LEN);
          card.style.transform = '';
          drag = null;
          setSortingFocus(false);
        }
        return;
      }
      const rot = -4 + drag.dx * 0.06;
      card.style.transform = `translate(${drag.dx}px, ${drag.dy}px) rotate(${rot}deg)`;
      setRails(railModeFromDelta(drag.dx, drag.dy), true);
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

function settleSort(card, action) {
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
  window.setTimeout(() => {
    pendingSort.shift();
    if (action === 'public') {
      createdGems.unshift(findToCreatedGem(find, true));
      hint.textContent = t('railPublic');
      setSection('created');
    } else if (action === 'private') {
      createdGems.unshift(findToCreatedGem(find, false));
      hint.textContent = t('railPrivate');
      setSection('created');
    } else {
      hint.textContent = t('railDelete');
    }
    refreshHub();
  }, 260);
}

function pickLikedJam() {
  const publicCreated = createdGems.filter((g) => g.isPublic && publicLikes(g) > 0);
  if (publicCreated.length) return publicCreated[0];
  const publicCollected = collectedGems.filter((g) => g.isPublic !== false && publicLikes(g) > 0);
  if (publicCollected.length) return publicCollected[0];
  return createSpoofCollectedGem();
}

function fillLikesJamCard(gem) {
  likesJamPhoto.src = gem.imageUri;
  likesJamUser.textContent = gem.authorUsername
    ? `@${gem.authorUsername}`
    : MY_USER;
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
  applyRailCopy();
  renderFeed();
  renderGrid();
  if (openGemId) openDetail(openGemId);
}

function resetState() {
  clearSpotlights();
  createdGems = [];
  collectedGems = [];
  favouriteGemIds = [];
  createdSeq = 0;
  seedCollectedFromChallenges();
  seedPendingSort();
  closeDetail();
  storageClear(TIP_KEY);
  storageClear(ONBOARD_KEY);
  showTip(true);
  setSection('collected');
  refreshHub();
  hint.textContent = t('holdHint');
  runOnboardingTips();
}

function init() {
  if (railPublicIcon) railPublicIcon.innerHTML = gemSvg(MY_GEM_FILL);
  holdRingFill.style.strokeDasharray = String(HOLD_RING_LEN);
  holdRingFill.style.strokeDashoffset = String(HOLD_RING_LEN);
  seedCollectedFromChallenges();
  seedPendingSort();
  setupSnapshotArc();
  applyRailCopy();
  setSection('collected');
  refreshHub();
  showTip(!storageGet(TIP_KEY));
  window.setInterval(tickPlaces, ROTATE_MS);
  window.addEventListener('resize', () => renderGrid());
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
  hint.textContent = spoofWording
    ? 'Navigate spoofed — you’d walk to this jam'
    : '[navigate spoofed — walk to jam]';
});
detailAdd.addEventListener('click', addEntryToOpenGem);
resetHub.addEventListener('click', resetState);
debugLikes.addEventListener('click', () => playLikesBanner());
debugOnboard.addEventListener('click', () => runOnboardingTips());
debugSpoof.addEventListener('click', () => setSpoofWording(!spoofWording));

init();
