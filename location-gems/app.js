/** Location Gems hub + sort-into-gems — LOCATION-GEMS-HUB-v2 */
const SPOOF_COLLECTED_GEM_ID = 'spoof-collected-gem-prototype';
const SPOOF_COLLECTED_GEM_AUTHOR = 'RiverWalker';
const PROTOTYPE_GEM_IMAGE = 'assets/prototype-gem.webp';
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

/** Daily Side Quests finds — collected appearance + sort deck */
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

const ONBOARD_SLIDES = [
  {
    title: '[why location gems exist]',
    body: '[explain gems turn places you notice into memories others can find — and why the hub keeps them]',
  },
  {
    title: '[how gems get likes]',
    body: '[explain public gems can earn likes from walkers who discover them on the map]',
  },
  {
    title: '[sort challenge finds into gems]',
    body: '[explain swipe: left private hidden gems, right public with place + photo + writing, down delete]',
  },
];

const ROTATE_MS = 2200;
const TIP_KEY = 'location-gems-hub-snapshot-tip-seen';
const ONBOARD_KEY = 'location-gems-hub-onboard-seen';
const GRID_GAP = 16;
const H_PAD = 24;
const SWIPE_COMMIT_X = 110;
const SWIPE_COMMIT_Y = 120;
const HAZE_IN_MS = 160;
const SHINE_MS = 1400;
const HOLD_AFTER_SHINE_MS = 500;
const COPY_CELEBRATE_MS = 780;
const HAZE_OUT_MS = 300;
const LIKES_DEMO = 12;

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
};

const phone = document.getElementById('phone');
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
const hint = document.getElementById('hint');
const resetHub = document.getElementById('resetHub');
const feedStrip = document.getElementById('feedStrip');
const sortCta = document.getElementById('sortCta');
const sortCtaCount = document.getElementById('sortCtaCount');
const openSortBtn = document.getElementById('openSort');
const sortSheet = document.getElementById('sortSheet');
const sortClose = document.getElementById('sortClose');
const sortSub = document.getElementById('sortSub');
const sortStack = document.getElementById('sortStack');
const hintPrivate = document.getElementById('hintPrivate');
const hintPublic = document.getElementById('hintPublic');
const hintDelete = document.getElementById('hintDelete');
const onboard = document.getElementById('onboard');
const onboardKicker = document.getElementById('onboardKicker');
const onboardTitle = document.getElementById('onboardTitle');
const onboardBody = document.getElementById('onboardBody');
const onboardSkip = document.getElementById('onboardSkip');
const onboardNext = document.getElementById('onboardNext');
const likesBanner = document.getElementById('likesBanner');
const likesShine = document.getElementById('likesShine');
const likesCopy = document.getElementById('likesCopy');
const likesHeadline = document.getElementById('likesHeadline');
const debugLikes = document.getElementById('debugLikes');
const debugOnboard = document.getElementById('debugOnboard');

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
let rotateTimer = 0;
let createdSeq = 0;
let onboardIndex = 0;
let likesBusy = false;
let drag = null;

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
    gemFill: MY_GEM_FILL,
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
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
    gemFill: MY_GEM_FILL,
    likes: find.likes || 0,
    createdAt: new Date().toISOString(),
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
    vis.textContent = '[private]';
    photo.appendChild(vis);
  } else if (gem.isPublic === true && createdGems.some((g) => g.id === gem.id)) {
    const vis = document.createElement('span');
    vis.className = 'polaroid-badge';
    vis.textContent = '[public]';
    photo.appendChild(vis);
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
      body: '[your public gem is live]',
    })),
    ...collectedGems.slice(0, 3).map((g) => ({
      photo: g.imageUri,
      title: `@${g.authorUsername || 'walker'}`,
      body: getGemTagline(g) || '[gem nearby]',
    })),
  ].slice(0, 5);
  items.forEach((item) => {
    const chip = document.createElement('article');
    chip.className = 'feed-chip';
    chip.innerHTML = `<img src="${item.photo}" alt=""><p><strong>${item.title}</strong>${item.body}</p>`;
    feedStrip.appendChild(chip);
  });
}

function syncSortCta() {
  const n = pendingSort.length;
  sortCtaCount.textContent = n ? `${n} waiting` : '[all sorted]';
  sortCta.hidden = false;
  openSortBtn.disabled = n === 0;
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

function refreshHub() {
  renderFeed();
  syncSortCta();
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
  if (owned) {
    detailVisibility.hidden = false;
    detailVisibility.textContent = gem.isPublic ? '[public gem]' : '[private · hidden gems]';
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
  syncDetailFav();
  detail.hidden = false;
  detail.setAttribute('aria-hidden', 'false');
  hint.textContent = 'Gem detail — heart to favourite, back to hub.';
}

function closeDetail() {
  openGemId = null;
  detail.hidden = true;
  detail.setAttribute('aria-hidden', 'true');
  hint.textContent = 'Hub ready.';
  if (activeSection === 'favourites') renderGrid();
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
    gemFill: MY_GEM_FILL,
    createdAt: new Date().toISOString(),
  });
  setSection('created');
  refreshHub();
  hint.textContent = 'Created a sample public gem.';
}

function handleSnapshot() {
  if (!snapshotTip.hidden) dismissTip();
  addSampleCreatedGem();
}

function tickPlaces() {
  placeIndex = (placeIndex + 1) % SNAPSHOT_PLACES.length;
  rotatingWord.textContent = SNAPSHOT_PLACES[placeIndex];
}

function showOnboardSlide() {
  const slide = ONBOARD_SLIDES[onboardIndex];
  onboardKicker.textContent = `${onboardIndex + 1} / ${ONBOARD_SLIDES.length}`;
  onboardTitle.textContent = slide.title;
  onboardBody.textContent = slide.body;
  onboardNext.textContent =
    onboardIndex === ONBOARD_SLIDES.length - 1 ? '[start sorting]' : '[next]';
}

function openOnboard() {
  onboardIndex = 0;
  showOnboardSlide();
  onboard.hidden = false;
  onboard.setAttribute('aria-hidden', 'false');
}

function closeOnboard({ openSortAfter }) {
  onboard.hidden = true;
  onboard.setAttribute('aria-hidden', 'true');
  storageSet(ONBOARD_KEY);
  if (openSortAfter) openSortSheet();
}

function buildSortCard(find, under) {
  const card = document.createElement('article');
  card.className = `sort-card${under ? ' is-under' : ''}`;
  card.dataset.id = find.id;
  card.innerHTML = `
    <img class="sort-card-photo" src="${find.photo}" alt="">
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
  sortSub.textContent = `${pendingSort.length} left`;
  if (!pendingSort.length) {
    sortSub.textContent = '[all sorted]';
    return;
  }
  const top = pendingSort[0];
  const next = pendingSort[1];
  if (next) sortStack.appendChild(buildSortCard(next, true));
  const front = buildSortCard(top, false);
  sortStack.appendChild(front);
  bindSortDrag(front);
}

function setSortHints(dx, dy) {
  const left = dx < -40;
  const right = dx > 40;
  const down = dy > 50 && Math.abs(dx) < 80;
  hintPrivate.classList.toggle('is-on', left);
  hintPrivate.classList.toggle('is-flash', left || (!dx && !dy));
  hintPublic.classList.toggle('is-on', right);
  hintDelete.classList.toggle('is-on', down);
}

function bindSortDrag(card) {
  const onPointerDown = (e) => {
    if (drag) return;
    card.setPointerCapture(e.pointerId);
    drag = {
      card,
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      dx: 0,
      dy: 0,
    };
  };
  const onPointerMove = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    drag.dx = e.clientX - drag.x0;
    drag.dy = e.clientY - drag.y0;
    const rot = drag.dx * 0.05;
    card.style.transform = `translate(${drag.dx}px, ${drag.dy}px) rotate(${rot}deg)`;
    setSortHints(drag.dx, drag.dy);
  };
  const onPointerUp = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const { dx, dy } = drag;
    drag = null;
    setSortHints(0, 0);
    hintPrivate.classList.add('is-flash');
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
    card.style.transition = 'transform 220ms var(--ease-out)';
    card.style.transform = '';
    window.setTimeout(() => {
      card.style.transition = '';
    }, 240);
  };
  card.addEventListener('pointerdown', onPointerDown);
  card.addEventListener('pointermove', onPointerMove);
  card.addEventListener('pointerup', onPointerUp);
  card.addEventListener('pointercancel', onPointerUp);
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
    gemFill: MY_GEM_FILL,
    createdAt: new Date().toISOString(),
  };
}

function settleSort(card, action) {
  const find = pendingSort[0];
  if (!find) return;
  const fly =
    action === 'public'
      ? 'translate(140%, -8%) rotate(18deg)'
      : action === 'private'
        ? 'translate(-140%, -8%) rotate(-18deg)'
        : 'translate(0, 140%) rotate(4deg)';
  card.style.transition = 'transform 280ms var(--ease-out), opacity 280ms var(--ease-out)';
  card.style.transform = fly;
  card.style.opacity = '0';
  window.setTimeout(() => {
    pendingSort.shift();
    if (action === 'public') {
      createdGems.unshift(findToCreatedGem(find, true));
      hint.textContent = '[public gem saved]';
    } else if (action === 'private') {
      createdGems.unshift(findToCreatedGem(find, false));
      hint.textContent = '[private · hidden gems]';
    } else {
      hint.textContent = '[find deleted]';
    }
    if (!pendingSort.length) {
      closeSortSheet();
      setSection('created');
      refreshHub();
      return;
    }
    renderSortStack();
    refreshHub();
  }, 280);
}

function openSortSheet() {
  if (!pendingSort.length) {
    hint.textContent = '[nothing left to sort]';
    return;
  }
  closeDetail();
  sortSheet.hidden = false;
  sortSheet.setAttribute('aria-hidden', 'false');
  setSortHints(0, 0);
  hintPrivate.classList.add('is-flash', 'is-on');
  renderSortStack();
  hint.textContent = 'Swipe finds: ← private · ↓ delete · public →';
}

function closeSortSheet() {
  sortSheet.hidden = true;
  sortSheet.setAttribute('aria-hidden', 'true');
  drag = null;
  refreshHub();
}

async function playLikesBanner() {
  if (likesBusy) return;
  likesBusy = true;
  likesHeadline.innerHTML = `<span class="likes-rich">${LIKES_DEMO} likes</span>`;
  likesBanner.hidden = false;
  likesBanner.classList.remove('is-out');
  likesBanner.classList.add('is-on');
  likesBanner.setAttribute('aria-hidden', 'false');
  likesCopy.classList.remove('is-on');
  likesShine.classList.remove('is-on');
  await wait(HAZE_IN_MS);
  likesCopy.classList.add('is-on');
  likesCopy.setAttribute('aria-hidden', 'false');
  await wait(120);
  likesShine.classList.add('is-on');
  await wait(SHINE_MS + HOLD_AFTER_SHINE_MS);
  await wait(COPY_CELEBRATE_MS * 0.35);
  likesBanner.classList.add('is-out');
  await wait(HAZE_OUT_MS);
  likesBanner.hidden = true;
  likesBanner.classList.remove('is-on', 'is-out');
  likesShine.classList.remove('is-on');
  likesCopy.classList.remove('is-on');
  likesBanner.setAttribute('aria-hidden', 'true');
  likesBusy = false;
}

function resetState() {
  createdGems = [];
  collectedGems = [];
  favouriteGemIds = [];
  createdSeq = 0;
  seedCollectedFromChallenges();
  seedPendingSort();
  closeDetail();
  closeSortSheet();
  closeOnboard({ openSortAfter: false });
  storageClear(TIP_KEY);
  storageClear(ONBOARD_KEY);
  showTip(true);
  setSection('collected');
  refreshHub();
  openOnboard();
  hint.textContent = 'Hub reset — onboarding + finds ready to sort.';
}

function init() {
  seedCollectedFromChallenges();
  seedPendingSort();
  setupSnapshotArc();
  setSection('collected');
  refreshHub();
  showTip(!storageGet(TIP_KEY));
  if (!storageGet(ONBOARD_KEY)) openOnboard();
  rotateTimer = window.setInterval(tickPlaces, ROTATE_MS);
  window.addEventListener('resize', () => renderGrid());
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
resetHub.addEventListener('click', resetState);
sortCta.addEventListener('click', () => openSortSheet());
openSortBtn.addEventListener('click', () => openSortSheet());
sortClose.addEventListener('click', closeSortSheet);
onboardSkip.addEventListener('click', () => closeOnboard({ openSortAfter: false }));
onboardNext.addEventListener('click', () => {
  if (onboardIndex >= ONBOARD_SLIDES.length - 1) {
    closeOnboard({ openSortAfter: true });
    return;
  }
  onboardIndex += 1;
  showOnboardSlide();
});
debugLikes.addEventListener('click', () => {
  playLikesBanner();
});
debugOnboard.addEventListener('click', () => openOnboard());

init();
