/** Location Gems hub — port of mobile-rn feature/location-gems LocationGemsHub */
const SPOOF_COLLECTED_GEM_ID = 'spoof-collected-gem-prototype';
const SPOOF_COLLECTED_GEM_AUTHOR = 'RiverWalker';
const PROTOTYPE_GEM_IMAGE = 'assets/prototype-gem.webp';
const BORROWED_FINDS = [
  'assets/find-a.jpg',
  'assets/find-b.jpg',
  'assets/find-c.jpg',
];
const SNAPSHOT_PLACES = [
  'a café',
  'a park bench',
  'a street corner',
  'a bridge',
  'a town square',
  'a waterfront',
];
const ROTATE_MS = 2200;
const TIP_KEY = 'location-gems-hub-snapshot-tip-seen';
const GRID_GAP = 16;
const H_PAD = 24;
const POLAROID_ASPECT = 1.24;
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
    'When a place catches you mid-adventure, tap the camera to leave a photo and a note for whoever comes next.',
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
const hint = document.getElementById('hint');
const resetHub = document.getElementById('resetHub');

/** @type {'collected'|'created'|'favourites'} */
let activeSection = 'collected';
/** @type {{ id: string, storyId: string, imageUri: string, title: string, tagline: string, caption?: string, authorUsername?: string, createdAt: string }[]} */
let createdGems = [];
/** @type {typeof createdGems} */
let collectedGems = [];
/** @type {string[]} */
let favouriteGemIds = [];
let openGemId = null;
let placeIndex = 0;
let rotateTimer = 0;
let createdSeq = 0;

function createSpoofCollectedGem() {
  return {
    id: SPOOF_COLLECTED_GEM_ID,
    storyId: 'location-gems-prototype',
    imageUri: PROTOTYPE_GEM_IMAGE,
    title: COPY.spoofCollectedTitle,
    tagline: COPY.spoofCollectedTagline,
    caption: COPY.spoofCollectedReflection,
    authorUsername: SPOOF_COLLECTED_GEM_AUTHOR,
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
  };
}

function ensureSpoofCollectedGem() {
  if (collectedGems.some((g) => g.id === SPOOF_COLLECTED_GEM_ID)) return;
  collectedGems.unshift(createSpoofCollectedGem());
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

function tipSeen() {
  try {
    return localStorage.getItem(TIP_KEY) === '1';
  } catch (_) {
    return false;
  }
}

function markTipSeen() {
  try {
    localStorage.setItem(TIP_KEY, '1');
  } catch (_) {
    /* ignore */
  }
}

function showTip(visible) {
  snapshotTip.hidden = !visible;
  snapshotTip.setAttribute('aria-hidden', visible ? 'false' : 'true');
  cameraButton.classList.toggle('is-highlighted', visible);
}

function dismissTip() {
  showTip(false);
  markTipSeen();
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
  hint.textContent = 'Hub ready — tap a polaroid or the camera.';
  if (activeSection === 'favourites') renderGrid();
}

function addSampleCreatedGem() {
  createdSeq += 1;
  const photo = BORROWED_FINDS[(createdSeq - 1) % BORROWED_FINDS.length];
  const gem = {
    id: `created-${Date.now()}-${createdSeq}`,
    storyId: 'location-gems-hub',
    imageUri: photo,
    title: 'Corner I marked',
    tagline: SNAPSHOT_PLACES[(createdSeq - 1) % SNAPSHOT_PLACES.length],
    caption: 'Saved from the hub snapshot control (camera capture not ported in this web experiment).',
    createdAt: new Date().toISOString(),
  };
  createdGems.unshift(gem);
  setSection('created');
  hint.textContent = 'Created a sample gem — full camera capture still needs a call.';
}

function handleSnapshot() {
  if (!snapshotTip.hidden) dismissTip();
  addSampleCreatedGem();
}

function tickPlaces() {
  placeIndex = (placeIndex + 1) % SNAPSHOT_PLACES.length;
  rotatingWord.textContent = SNAPSHOT_PLACES[placeIndex];
}

function resetState() {
  createdGems = [];
  collectedGems = [];
  favouriteGemIds = [];
  createdSeq = 0;
  ensureSpoofCollectedGem();
  closeDetail();
  try {
    localStorage.removeItem(TIP_KEY);
  } catch (_) {
    /* ignore */
  }
  showTip(true);
  setSection('collected');
  hint.textContent = 'Hub reset — spoof collected gem + snapshot tip.';
}

function init() {
  ensureSpoofCollectedGem();
  setupSnapshotArc();
  setSection('collected');
  showTip(!tipSeen());
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

init();
