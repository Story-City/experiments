const QUESTS = [
  { title: 'A Whimsy walk' },
  { title: 'Have you noticed...' },
  { title: 'Fond memory' },
];

const FRAME = {
  home: 'assets/flow/01.png?v=7',
  entry: 'assets/flow/03.png?v=7',
};

const CAPTURE_FULL = 'assets/parts/find-a.jpg?v=30';
const CAPTURE_SLOTS = [
  'assets/parts/find-a.jpg?v=30',
  'assets/parts/find-b.jpg?v=30',
  'assets/parts/find-c.jpg?v=30',
];

/** Other challengers — gem on map + panel image/text (+ likes on zoom) */
const OTHER_ENTRIES = [
  {
    photo: 'assets/parts/find-b.jpg?v=30',
    text: 'Paw print in the sidewalk concrete near the ravine.',
    likes: 12,
    x: 28, y: 32,
  },
  {
    photo: 'assets/parts/find-c.jpg?v=30',
    text: 'Bird-shaped cloud above Victoria Trail.',
    likes: 7,
    x: 68, y: 28,
  },
  {
    photo: 'assets/parts/find-d.jpg?v=30',
    text: 'Fox silhouette in the ivy on the mailbox.',
    likes: 21,
    x: 48, y: 42,
  },
];

/** Beach spots for my jams (map %); plane points here */
const MY_JAM_SPOTS = [
  { x: 46, y: 40 },
  { x: 52, y: 44 },
  { x: 41, y: 43 },
];

/** Place plane so its natural nose (upper-right) aims at the jam */
const PLANE_OFFSET = { x: -8, y: 5 };

const GEM_OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE = 'M15 7.5H22.5L12 20.5Z';
const GEM_FACETS = 'M1.5 7.5H22.5M7 1.5L9 7.5L12 20.5L15 7.5L17 1.5';
/** Others' gems — cyan, distinct from my purple jams */
const OTHER_GEM_FILL = '#00c2ff';
const MY_GEM_FILL = '#b36bff';
const READ_LABEL_OTHERS = 'See what other Challengers found';
const READ_LABEL_MINE = 'Your find';

const FADE_MS = 780;
const SLIDE_MS = 480;
const LIFT_MS = 520;
const PAN_MS = 1100;
const SETTLE_MS = 980;
const FLIGHT_MS = 860;
const FINDS_NEEDED = 3;
const EASE_OUT = 'cubic-bezier(0.33, 0.0, 0.2, 1)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.45, 0.64, 1)';

const phone = document.getElementById('phone');
const sceneA = document.getElementById('sceneA');
const sceneB = document.getElementById('sceneB');
const stampSheet = document.getElementById('stampSheet');
const stampSheetBg = document.getElementById('stampSheetBg');
const stampParts = Array.from(document.querySelectorAll('.stamp-part'));
const mapStage = document.getElementById('mapStage');
const mapPan = document.getElementById('mapPan');
const gemLayer = document.getElementById('gemLayer');
const jamLayer = document.getElementById('jamLayer');
const planeMark = document.getElementById('planeMark');
const findPanel = document.getElementById('findPanel');
const findCard = document.getElementById('findCard');
const findCardBack = document.getElementById('findCardBack');
const findCardDeep = document.getElementById('findCardDeep');
const findSide = document.getElementById('findSide');
const panelPhoto = document.getElementById('panelPhoto');
const panelPhotoBack = document.getElementById('panelPhotoBack');
const panelPhotoDeep = document.getElementById('panelPhotoDeep');
const writeMode = document.getElementById('writeMode');
const readMode = document.getElementById('readMode');
const noteWords = document.getElementById('noteWords');
const readText = document.getElementById('readText');
const readLabel = document.getElementById('readLabel');
const likeBtn = document.getElementById('likeBtn');
const likeHeart = document.getElementById('likeHeart');
const likeCount = document.getElementById('likeCount');
const nextGem = document.getElementById('nextGem');
const tipWrap = document.getElementById('tipWrap');
const seeOther = document.getElementById('seeOther');
const othersBtn = document.getElementById('othersBtn');
const photoLightbox = document.getElementById('photoLightbox');
const lightboxPhoto = document.getElementById('lightboxPhoto');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const textPopupClose = document.getElementById('textPopupClose');
/** Front of the visual stack */
let panelPhotoSrc = '';
/** @type {string[]} oldest → newest under the front */
let stackUnder = [];
/** @type {Record<number, boolean>} */
let likedByGem = {};
/** @type {Record<number, boolean>} first-time invite pulse already shown */
let likeInviteSeen = {};
const TIP_SWIPE_DISMISS_PX = 64;
const flyThumb = document.getElementById('flyThumb');
const slotCells = Array.from(document.querySelectorAll('.slot-cell'));
const camera = document.getElementById('camera');
const cameraVideo = document.getElementById('cameraVideo');
const cameraSnap = document.getElementById('cameraSnap');
const cameraFallback = document.getElementById('cameraFallback');
const cameraFallbackImg = document.getElementById('cameraFallbackImg');
const cameraPrompt = document.getElementById('cameraPrompt');
const hint = document.getElementById('hint');
const playBtn = document.getElementById('play');
const resetBtn = document.getElementById('reset');
const picker = document.getElementById('picker');
const camHot = document.getElementById('camHot');
const closeHot = document.getElementById('closeHot');
const entryHot = document.getElementById('entryHot');
const backHot = document.getElementById('backHot');

/** @type {'home'|'menu'|'revealed'|'entry'|'map'|'camera'|'note'|'browse'} */
let phase = 'home';
let quest = 0;
let finds = 0;
/** @type {{ photo: string, text: string }[]} */
let myEntries = [];
/** Viewing my finds vs others' gems */
let viewingMine = false;
let myIndex = 0;
let stream = null;
let facingMode = 'environment';
let busy = false;
let pendingCapture = null;
let usingLiveCamera = false;
let frontIsA = true;
let stampsRevealed = false;
let otherIndex = 0;
let gemsBuilt = false;
let timers = [];

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}
function wait(ms) {
  return new Promise((resolve) => later(resolve, ms));
}
function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}
function setHint(t) {
  hint.textContent = t;
}

function frontScene() { return frontIsA ? sceneA : sceneB; }
function backScene() { return frontIsA ? sceneB : sceneA; }

async function showScene(src) {
  const front = frontScene();
  if (front.getAttribute('src') === src && front.classList.contains('is-front')) return;
  const next = backScene();
  next.src = src;
  try { if (next.decode) await next.decode(); } catch (_) { await wait(40); }
  next.classList.add('is-front');
  front.classList.remove('is-front');
  frontIsA = next === sceneA;
  await wait(FADE_MS);
}

function setStampFaces(revealed) {
  stampsRevealed = revealed;
  stampSheetBg.src = revealed
    ? 'assets/parts/revealed.png?v=7'
    : 'assets/parts/menu.png?v=7';
  stampParts.forEach((part) => {
    part.classList.toggle('is-revealed', revealed);
    const cam = part.querySelector('.stamp-cam-hot');
    if (cam) cam.hidden = !revealed;
  });
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

function buildGems() {
  if (gemsBuilt) return;
  gemsBuilt = true;
  gemLayer.replaceChildren();
  OTHER_ENTRIES.forEach((entry, i) => {
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'gem-pin';
    pin.dataset.gem = String(i);
    pin.style.left = `${entry.x}%`;
    pin.style.top = `${entry.y}%`;
    pin.setAttribute('aria-label', `Other find ${i + 1}`);
    pin.innerHTML = gemSvg(OTHER_GEM_FILL);
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      openOtherGem(i);
    });
    gemLayer.appendChild(pin);
  });
}

function gemPins() {
  return Array.from(gemLayer.querySelectorAll('.gem-pin'));
}

/** Gentle zoom anchored on the gem — keep mild so layout doesn't warp. */
const GEM_ZOOM = 1.08;

function setMapPan(entry, animate) {
  mapPan.style.transition = animate === false
    ? 'none'
    : `transform ${PAN_MS}ms ${EASE_OUT}`;
  if (!entry || entry.x == null || entry.y == null) {
    mapPan.style.transformOrigin = '50% 38%';
    mapPan.style.transform = 'scale(1)';
    return;
  }
  mapPan.style.transformOrigin = `${entry.x}% ${entry.y}%`;
  mapPan.style.transform = `scale(${GEM_ZOOM})`;
}

function resetMapCamera(animate) {
  gemPins().forEach((p) => p.classList.remove('is-active'));
  setMapPan(null, animate);
}

function jamSpotAt(index) {
  return MY_JAM_SPOTS[Math.min(index, MY_JAM_SPOTS.length - 1)];
}

function aimPlaneAt(spot) {
  // Keep Figma orientation — only reposition so the nose points at the jam
  planeMark.style.left = `${spot.x + PLANE_OFFSET.x}%`;
  planeMark.style.top = `${spot.y + PLANE_OFFSET.y}%`;
}

function showPlaneForJam(index) {
  const spot = jamSpotAt(index);
  aimPlaneAt(spot);
  planeMark.hidden = false;
  planeMark.setAttribute('aria-hidden', 'false');
  void planeMark.offsetWidth;
  planeMark.classList.add('is-on');
}

function hidePlane() {
  planeMark.classList.remove('is-on');
  planeMark.hidden = true;
  planeMark.setAttribute('aria-hidden', 'true');
}

function placeJam(index, { pulse }) {
  const spot = jamSpotAt(index);
  let pin = jamLayer.querySelector(`[data-jam="${index}"]`);
  if (!pin) {
    pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'jam-pin';
    pin.dataset.jam = String(index);
    pin.setAttribute('aria-label', `Your find ${index + 1}`);
    pin.innerHTML = `<span class="jam-pulse" aria-hidden="true"></span>${gemSvg(MY_GEM_FILL)}`;
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      openMyEntry(index);
    });
    jamLayer.appendChild(pin);
  }
  pin.style.left = `${spot.x}%`;
  pin.style.top = `${spot.y}%`;
  pin.classList.remove('is-born', 'is-live');
  if (pulse) {
    void pin.offsetWidth;
    pin.classList.add('is-born');
    later(() => {
      pin.classList.remove('is-born');
      pin.classList.add('is-live');
    }, 1100);
  } else {
    pin.classList.add('is-live');
  }
}

function clearJams() {
  jamLayer.replaceChildren();
  hidePlane();
}

function syncOthersControl() {
  const onMap = phase === 'map' || phase === 'browse' || phase === 'note';
  othersBtn.hidden = !onMap;
  const ready = finds >= FINDS_NEEDED;
  othersBtn.disabled = !ready;
  othersBtn.setAttribute('aria-disabled', ready ? 'false' : 'true');
  // Tip hot still works once challenge is done and tip is up
  seeOther.hidden = !(ready && !tipWrap.hidden && tipWrap.classList.contains('is-on'));
}

function clearStackClasses() {
  findCard.classList.remove('is-enter', 'is-shuffle');
  findCardBack.classList.remove('is-shuffle-out');
  findCardDeep.classList.remove('is-shuffle-out');
}

function renderStackLayers() {
  const under = stackUnder;
  if (under.length >= 2) {
    panelPhotoDeep.src = under[under.length - 2];
    findCardDeep.classList.add('is-shown');
  } else {
    findCardDeep.classList.remove('is-shown');
  }
  if (under.length >= 1) {
    panelPhotoBack.src = under[under.length - 1];
    findCardBack.classList.add('is-shown');
  } else {
    findCardBack.classList.remove('is-shown');
  }
}

function setPanelPhoto(src, { swap }) {
  clearStackClasses();

  if (swap && panelPhotoSrc && panelPhotoSrc !== src) {
    // Push current front under; keep a deeper peek for a real stack
    stackUnder.push(panelPhotoSrc);
    if (stackUnder.length > 2) stackUnder.shift();
    renderStackLayers();
    panelPhoto.src = src;
    findCard.classList.add('is-shown');
    void findCard.offsetWidth;
    if (stackUnder.length >= 2) findCardDeep.classList.add('is-shuffle-out');
    findCardBack.classList.add('is-shuffle-out');
    findCard.classList.add('is-shuffle');
  } else {
    stackUnder = [];
    findCardDeep.classList.remove('is-shown');
    findCardBack.classList.remove('is-shown');
    panelPhoto.src = src;
    findCard.classList.add('is-shown');
    void findCard.offsetWidth;
    findCard.classList.add('is-enter');
  }
  panelPhotoSrc = src;
}

function syncLikeUi({ invite }) {
  if (viewingMine) {
    likeBtn.hidden = true;
    likeBtn.classList.remove('is-invite', 'is-liked');
    return;
  }
  likeBtn.hidden = false;
  const entry = OTHER_ENTRIES[otherIndex];
  const liked = !!likedByGem[otherIndex];
  const count = entry.likes + (liked ? 1 : 0);
  likeCount.textContent = String(count);
  likeHeart.textContent = liked ? '♥' : '♡';
  likeBtn.classList.toggle('is-liked', liked);
  const showInvite = invite && !liked && !likeInviteSeen[otherIndex];
  likeBtn.classList.toggle('is-invite', showInvite);
  if (showInvite) {
    later(() => {
      likeInviteSeen[otherIndex] = true;
      likeBtn.classList.remove('is-invite');
    }, 2800);
  }
}

function markActivePins() {
  gemPins().forEach((p, i) => {
    p.classList.toggle('is-active', !viewingMine && phase === 'browse' && i === otherIndex);
  });
  jamLayer.querySelectorAll('.jam-pin').forEach((p) => {
    const i = Number(p.dataset.jam);
    p.classList.toggle('is-active', viewingMine && phase === 'browse' && i === myIndex);
  });
  slotCells.forEach((cell, i) => {
    cell.classList.toggle('is-active-slot', viewingMine && phase === 'browse' && i === myIndex);
  });
}

function openTextPopup() {
  findSide.classList.remove('is-closed');
}

function closeTextPopup() {
  findSide.classList.add('is-closed');
}

function openLightbox() {
  if (!panelPhotoSrc) return;
  lightboxPhoto.src = panelPhotoSrc;
  lightboxCaption.textContent = readMode.hidden
    ? (noteWords.value || 'Add a few words…')
    : (readText.textContent || '');
  photoLightbox.hidden = false;
}

function closeLightbox() {
  photoLightbox.hidden = true;
  lightboxPhoto.removeAttribute('src');
}

function showWritePanel(uri) {
  viewingMine = false;
  closeLightbox();
  writeMode.hidden = false;
  readMode.hidden = true;
  noteWords.value = '';
  setPanelPhoto(uri, { swap: false });
  showPlaneForJam(finds);
  openTextPopup();
  findPanel.hidden = false;
  void findPanel.offsetWidth;
  findPanel.classList.add('is-on');
}

function showReadPanel(entry, { swap }) {
  viewingMine = false;
  closeLightbox();
  writeMode.hidden = true;
  readMode.hidden = false;
  readLabel.textContent = READ_LABEL_OTHERS;
  readText.textContent = entry.text || '—';
  nextGem.hidden = false;
  setPanelPhoto(entry.photo, { swap });
  syncLikeUi({ invite: true });
  hidePlane();
  openTextPopup();
  findPanel.hidden = false;
  findPanel.classList.add('is-on');
  markActivePins();
}

function showMyReadPanel(entry, { swap }) {
  viewingMine = true;
  closeLightbox();
  writeMode.hidden = true;
  readMode.hidden = false;
  readLabel.textContent = READ_LABEL_MINE;
  readText.textContent = entry.text || '—';
  nextGem.hidden = myEntries.length < 2;
  setPanelPhoto(entry.photo, { swap });
  syncLikeUi({ invite: false });
  hidePlane();
  openTextPopup();
  findPanel.hidden = false;
  findPanel.classList.add('is-on');
  markActivePins();
}

function hideFindPanel() {
  closeLightbox();
  findPanel.classList.remove('is-on');
  findCard.classList.remove('is-shown', 'is-enter', 'is-shuffle');
  findCardBack.classList.remove('is-shown', 'is-shuffle-out');
  findCardDeep.classList.remove('is-shown', 'is-shuffle-out');
  findSide.classList.remove('is-closed');
  hidePlane();
  findPanel.hidden = true;
  writeMode.hidden = false;
  readMode.hidden = true;
  panelPhotoSrc = '';
  stackUnder = [];
  viewingMine = false;
  likeBtn.hidden = false;
  nextGem.hidden = false;
  likeBtn.classList.remove('is-invite', 'is-liked');
  markActivePins();
}

function showTip() {
  tipWrap.hidden = false;
  tipWrap.classList.remove('is-dismissing');
  tipWrap.style.transform = '';
  void tipWrap.offsetWidth;
  tipWrap.classList.add('is-on');
  syncOthersControl();
}

function dismissTip() {
  if (tipWrap.hidden) return;
  tipWrap.classList.remove('is-on');
  tipWrap.classList.add('is-dismissing');
  seeOther.hidden = true;
  later(() => {
    tipWrap.hidden = true;
    tipWrap.classList.remove('is-dismissing');
    tipWrap.style.transform = '';
    syncOthersControl();
  }, 340);
}

function bindTipSwipe() {
  let startX = 0;
  let dragging = false;

  const onStart = (x) => {
    if (tipWrap.hidden || !tipWrap.classList.contains('is-on')) return;
    startX = x;
    dragging = true;
    tipWrap.style.transition = 'none';
  };
  const onMove = (x) => {
    if (!dragging) return;
    const dx = Math.max(0, x - startX);
    tipWrap.style.transform = `translateX(${dx}px)`;
  };
  const onEnd = (x) => {
    if (!dragging) return;
    dragging = false;
    tipWrap.style.transition = '';
    const dx = x - startX;
    if (dx >= TIP_SWIPE_DISMISS_PX) {
      dismissTip();
    } else {
      tipWrap.style.transform = '';
    }
  };

  tipWrap.addEventListener('pointerdown', (e) => {
    // Don't steal the See others hot-spot — that must stay clickable
    if (e.target === seeOther || seeOther.contains(/** @type {Node} */ (e.target))) return;
    tipWrap.setPointerCapture(e.pointerId);
    onStart(e.clientX);
  });
  tipWrap.addEventListener('pointermove', (e) => onMove(e.clientX));
  tipWrap.addEventListener('pointerup', (e) => onEnd(e.clientX));
  tipWrap.addEventListener('pointercancel', (e) => onEnd(e.clientX));
}

async function showOtherEntry(index, animate) {
  const next = ((index % OTHER_ENTRIES.length) + OTHER_ENTRIES.length) % OTHER_ENTRIES.length;
  const entry = OTHER_ENTRIES[next];
  const same = !viewingMine && next === otherIndex && panelPhotoSrc === entry.photo;
  otherIndex = next;
  setMapPan(entry, animate);
  showReadPanel(entry, { swap: !same });
}

async function openOtherGem(index) {
  if (busy) return;
  if (finds < FINDS_NEEDED) return;
  if (phase !== 'map' && phase !== 'browse') return;
  busy = true;
  phase = 'browse';
  dismissTip();
  await showOtherEntry(index, true);
  busy = false;
  syncChrome();
  setHint(`Other find ${otherIndex + 1}/${OTHER_ENTRIES.length} — tap gems or Next.`);
}

async function openMyEntry(index) {
  if (busy) return;
  if (phase !== 'map' && phase !== 'browse') return;
  const entry = myEntries[index];
  if (!entry) return;
  busy = true;
  phase = 'browse';
  dismissTip();
  const same = viewingMine && index === myIndex && panelPhotoSrc === entry.photo;
  myIndex = index;
  gemPins().forEach((p) => p.classList.remove('is-active'));
  setMapPan(jamSpotAt(index), true);
  showMyReadPanel(entry, { swap: !same });
  busy = false;
  syncChrome();
  setHint(`Your find ${myIndex + 1}/${myEntries.length} — tap a jam or slot to reopen.`);
}

function syncChrome() {
  phone.dataset.phase = phase === 'revealed' ? 'revealed' : phase;
  entryHot.hidden = phase !== 'entry';
  playBtn.disabled = phase === 'camera' || phase === 'note' || busy;
  const onMap = phase === 'map' || phase === 'camera' || phase === 'note' || phase === 'browse';
  mapStage.classList.toggle('is-browse', phase === 'browse');
  mapStage.classList.toggle('is-gems', finds >= FINDS_NEEDED && (phase === 'map' || phase === 'browse'));
  backHot.hidden = !onMap || phase === 'camera';
  camHot.hidden = phase !== 'map';
  stampParts.forEach((el) => {
    el.hidden = !(phase === 'menu' || phase === 'revealed');
  });
  closeHot.hidden = !(phase === 'menu' || phase === 'revealed');
  syncOthersControl();
  markNextSlot();
  markActivePins();
}

function markNextSlot() {
  slotCells.forEach((cell, i) => {
    cell.classList.toggle('is-ready', phase === 'map' && i === finds && finds < FINDS_NEEDED);
  });
}

function hideFly() {
  flyThumb.hidden = true;
  flyThumb.classList.remove('is-on', 'is-arc');
  flyThumb.style.transition = 'none';
  flyThumb.style.transform = '';
  flyThumb.style.left = '';
  flyThumb.style.top = '';
  flyThumb.style.width = '';
  flyThumb.style.height = '';
  flyThumb.style.borderRadius = '';
}

function clearFinds() {
  finds = 0;
  myEntries = [];
  myIndex = 0;
  viewingMine = false;
  pendingCapture = null;
  likedByGem = {};
  likeInviteSeen = {};
  hideFly();
  hideFindPanel();
  clearJams();
  tipWrap.classList.remove('is-on', 'is-dismissing');
  tipWrap.hidden = true;
  tipWrap.style.transform = '';
  seeOther.hidden = true;
  othersBtn.hidden = true;
  othersBtn.disabled = true;
  slotCells.forEach((cell) => {
    const img = cell.querySelector('.slot');
    img.removeAttribute('src');
    cell.classList.remove('is-filled', 'is-land', 'is-ready', 'is-active-slot');
  });
  resetMapCamera(false);
}

function resetStampState() {
  setStampFaces(false);
}

async function showStampSheet() {
  stampSheet.classList.add('is-on');
  stampSheet.setAttribute('aria-hidden', 'false');
  await wait(FADE_MS);
}

async function hideStampSheet() {
  stampSheet.classList.remove('is-on');
  stampSheet.setAttribute('aria-hidden', 'true');
  await wait(FADE_MS);
}

async function showMap() {
  buildGems();
  mapStage.classList.add('is-on');
  mapStage.setAttribute('aria-hidden', 'false');
  resetMapCamera(false);
  await wait(FADE_MS);
}

async function hideMap() {
  mapStage.classList.remove('is-on');
  mapStage.setAttribute('aria-hidden', 'true');
  await wait(FADE_MS);
}

async function goHome() {
  clearTimers();
  await closeCamera(false);
  clearFinds();
  resetStampState();
  phase = 'home';
  if (stampSheet.classList.contains('is-on')) await hideStampSheet();
  if (mapStage.classList.contains('is-on')) await hideMap();
  await showScene(FRAME.home);
  syncChrome();
  setHint('Idle — pick a quest, then Play.');
}

async function openMenu() {
  if (busy) return;
  clearFinds();
  resetStampState();
  if (mapStage.classList.contains('is-on')) await hideMap();
  phase = 'menu';
  setStampFaces(false);
  await showScene(FRAME.home);
  await showStampSheet();
  syncChrome();
  setHint('Tap a stamp part — hand/dice animate; reveal then tap camera.');
}

async function revealStamp(index) {
  if (phase !== 'menu' || busy) return;
  busy = true;
  quest = index;
  Array.from(picker.children).forEach((c, i) => {
    c.setAttribute('aria-pressed', i === quest ? 'true' : 'false');
  });
  setStampFaces(true);
  await wait(FADE_MS);
  phase = 'revealed';
  busy = false;
  syncChrome();
  setHint(`${QUESTS[quest].title} — tap its camera to open the map.`);
}

async function enterMapFromStamp(index) {
  if (phase !== 'revealed' || busy) return;
  busy = true;
  quest = index;
  clearFinds();
  phase = 'map';
  // Overlap fades so stamp→map does not blink through black
  buildGems();
  mapStage.classList.add('is-on');
  mapStage.setAttribute('aria-hidden', 'false');
  resetMapCamera(false);
  stampSheet.classList.remove('is-on');
  stampSheet.setAttribute('aria-hidden', 'true');
  await wait(FADE_MS);
  busy = false;
  syncChrome();
  setHint('Map — photo lands as the tilted card above the hunt panel.');
}

async function startStream() {
  cameraFallback.hidden = true;
  cameraVideo.hidden = false;
  usingLiveCamera = false;
  try {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facingMode } },
      audio: false,
    });
    cameraVideo.srcObject = stream;
    await cameraVideo.play();
    usingLiveCamera = true;
    return true;
  } catch (err) {
    cameraVideo.hidden = true;
    cameraFallback.hidden = false;
    if (cameraFallbackImg) cameraFallbackImg.src = CAPTURE_FULL;
    usingLiveCamera = false;
    return false;
  }
}

function stopStream() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
    cameraVideo.srcObject = null;
  }
}

async function openCamera() {
  if (phase !== 'map' || busy) return;
  if (finds >= FINDS_NEEDED) return;
  busy = true;
  phase = 'camera';
  pendingCapture = null;
  cameraPrompt.textContent = `Find ${finds + 1} of ${FINDS_NEEDED} — animalistic pattern`;
  syncChrome();
  camera.hidden = false;
  camera.setAttribute('aria-hidden', 'false');
  void camera.offsetWidth;
  camera.classList.add('is-on');
  await startStream();
  await wait(SLIDE_MS);
  busy = false;
  setHint('Shutter — card drops left; write beside it.');
}

async function closeCamera(animate) {
  if (animate) {
    camera.classList.remove('is-on');
    await wait(SLIDE_MS);
  } else {
    camera.classList.remove('is-on');
  }
  camera.setAttribute('aria-hidden', 'true');
  camera.hidden = true;
  stopStream();
}

function snapCapture() {
  if (!usingLiveCamera) return CAPTURE_FULL;
  const w = cameraVideo.videoWidth;
  const h = cameraVideo.videoHeight;
  if (!w || !h) return CAPTURE_FULL;
  cameraSnap.width = w;
  cameraSnap.height = h;
  cameraSnap.getContext('2d').drawImage(cameraVideo, 0, 0, w, h);
  return cameraSnap.toDataURL('image/jpeg', 0.72);
}

function placeholderForFind(index) {
  return CAPTURE_SLOTS[index % CAPTURE_SLOTS.length];
}

async function landNoteOnMap(uri) {
  pendingCapture = uri;
  showWritePanel(uri);
  phase = 'note';
  syncChrome();
  setHint('Card left, write right — soft overlay above the hunt panel.');
}

async function handleShutter() {
  if (phase !== 'camera' || busy) return;
  busy = true;
  const uri = snapCapture();
  await closeCamera(true);
  await landNoteOnMap(uri);
  busy = false;
}

async function handleCameraSkip() {
  if (phase !== 'camera' || busy) return;
  busy = true;
  await closeCamera(true);
  await landNoteOnMap(CAPTURE_FULL);
  busy = false;
}

function phoneSize() {
  const box = phone.getBoundingClientRect();
  return { width: box.width, height: box.height };
}

function relativeBox(elNode) {
  const phoneBox = phone.getBoundingClientRect();
  const box = elNode.getBoundingClientRect();
  return {
    left: box.left - phoneBox.left,
    top: box.top - phoneBox.top,
    width: box.width,
    height: box.height,
    cx: box.left - phoneBox.left + box.width / 2,
    cy: box.top - phoneBox.top + box.height / 2,
  };
}

function setFlyBox(left, top, width, height, radius) {
  flyThumb.style.left = `${left}px`;
  flyThumb.style.top = `${top}px`;
  flyThumb.style.width = `${width}px`;
  flyThumb.style.height = `${height}px`;
  if (radius != null) flyThumb.style.borderRadius = radius;
}

async function animateFlyTo(target, duration, easing) {
  return new Promise((resolve) => {
    flyThumb.style.transition = [
      `left ${duration}ms ${easing}`,
      `top ${duration}ms ${easing}`,
      `width ${duration}ms ${easing}`,
      `height ${duration}ms ${easing}`,
      `border-radius ${duration}ms ${easing}`,
      `transform ${duration}ms ${easing}`,
    ].join(', ');
    setFlyBox(target.left, target.top, target.width, target.height, target.radius);
    if (target.rotate != null) flyThumb.style.transform = `rotate(${target.rotate}deg)`;
    later(resolve, duration + 20);
  });
}

function fillSlot(uri, index) {
  const cell = slotCells[index];
  if (!cell) return;
  const img = cell.querySelector('.slot');
  img.src = uri;
  cell.classList.add('is-filled', 'is-land');
  later(() => cell.classList.remove('is-land'), 520);
}

async function flyIntoSlot(uri, index) {
  const cell = slotCells[index];
  if (!cell) return;
  const start = relativeBox(findCard);
  const end = relativeBox(cell);
  const hasStart = start.width > 8 && start.height > 8;
  const hasEnd = end.width > 8 && end.height > 8;

  // Always land the thumbnail even if the fly animation cannot measure boxes.
  if (!hasEnd) {
    fillSlot(uri, index);
    return;
  }

  flyThumb.src = uri;
  flyThumb.hidden = false;
  flyThumb.classList.add('is-on', 'is-arc');
  flyThumb.style.transition = 'none';
  flyThumb.style.transform = 'rotate(-6deg)';
  if (hasStart) {
    setFlyBox(start.left, start.top, Math.max(start.width * 0.7, 64), Math.max(start.height * 0.7, 64), '12px');
  } else {
    const phoneBox = phoneSize();
    setFlyBox(phoneBox.width * 0.2, phoneBox.height * 0.42, 96, 128, '12px');
  }
  void flyThumb.offsetWidth;

  const midX = ((hasStart ? start.cx : end.cx) + end.cx) / 2;
  const midY = Math.min(hasStart ? start.cy : end.cy, end.cy) - phoneSize().height * 0.08;

  await animateFlyTo({
    left: midX - 32, top: midY - 32, width: 64, height: 64, radius: '12px', rotate: 4,
  }, Math.floor(FLIGHT_MS * 0.45), EASE_OUT);

  await animateFlyTo({
    left: end.left, top: end.top, width: end.width, height: end.height, radius: '7px', rotate: 0,
  }, Math.floor(FLIGHT_MS * 0.55), EASE_SPRING);

  fillSlot(uri, index);
  hideFly();
  await wait(280);
}

async function submitNote() {
  if (phase !== 'note' || !pendingCapture || busy) return;
  busy = true;
  const fullUri = pendingCapture;
  const slotUri = usingLiveCamera && fullUri.startsWith('data:')
    ? fullUri
    : placeholderForFind(finds);
  const noteText = (noteWords.value || '').trim();

  // Measure fly start while the card is still laid out, then fade the panel.
  myEntries.push({ photo: slotUri, text: noteText });
  finds = myEntries.length;
  const index = finds - 1;

  placeJam(index, { pulse: true });
  showPlaneForJam(index);
  await flyIntoSlot(slotUri, index);
  findPanel.classList.remove('is-on');
  hideFindPanel();
  later(() => hidePlane(), 900);
  pendingCapture = null;

  if (finds >= FINDS_NEEDED) {
    showTip();
    phase = 'map';
    syncChrome();
    busy = false;
    setHint('Challenge done — Show other gems is unlocked.');
    return;
  }

  phase = 'map';
  syncChrome();
  busy = false;
  setHint(`Jam ${finds}/${FINDS_NEEDED} on the beach — camera again. Tap jam to reopen.`);
}

async function enterBrowse() {
  if (busy) return;
  if (finds < FINDS_NEEDED) return;
  if (phase !== 'browse' && phase !== 'map') return;
  busy = true;
  phase = 'browse';
  dismissTip();
  await showOtherEntry(0, true);
  await wait(PAN_MS);
  busy = false;
  syncChrome();
  setHint('Cyan gems = others. Purple jams = yours. Next cycles the stack.');
}

async function cycleNextGem() {
  if (busy) return;
  if (phase !== 'browse') {
    await enterBrowse();
    return;
  }
  busy = true;
  if (viewingMine) {
    const next = (myIndex + 1) % myEntries.length;
    myIndex = next;
    showMyReadPanel(myEntries[next], { swap: true });
    setHint(`Your find ${myIndex + 1}/${myEntries.length}.`);
  } else {
    await showOtherEntry(otherIndex + 1, true);
    setHint(`Other find ${otherIndex + 1}/${OTHER_ENTRIES.length}.`);
  }
  await wait(280);
  busy = false;
  syncChrome();
}

function buildPicker() {
  picker.replaceChildren();
  QUESTS.forEach((q, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = q.title;
    btn.setAttribute('aria-pressed', i === quest ? 'true' : 'false');
    btn.addEventListener('click', () => {
      quest = i;
      Array.from(picker.children).forEach((c, idx) => {
        c.setAttribute('aria-pressed', idx === quest ? 'true' : 'false');
      });
      setHint(`Picked “${q.title}”.`);
    });
    picker.appendChild(btn);
  });
}

playBtn.addEventListener('click', () => openMenu());
resetBtn.addEventListener('click', () => goHome());

closeHot.addEventListener('click', async () => {
  if (busy) return;
  busy = true;
  phase = 'entry';
  clearFinds();
  resetStampState();
  const sceneP = showScene(FRAME.entry);
  stampSheet.classList.remove('is-on');
  stampSheet.setAttribute('aria-hidden', 'true');
  await sceneP;
  await wait(FADE_MS);
  busy = false;
  syncChrome();
  setHint('Entry chip — tap it or Play.');
});

entryHot.addEventListener('click', () => openMenu());

stampParts.forEach((el) => {
  el.addEventListener('click', (e) => {
    const cam = e.target.closest('.stamp-cam-hot');
    const i = Number(el.dataset.stamp);
    if (cam && phase === 'revealed') {
      e.preventDefault();
      e.stopPropagation();
      enterMapFromStamp(Number(cam.dataset.cam));
      return;
    }
    if (phase === 'menu') revealStamp(i);
    else if (phase === 'revealed') enterMapFromStamp(i);
  });
});

camHot.addEventListener('click', () => openCamera());
seeOther.addEventListener('click', () => enterBrowse());
othersBtn.addEventListener('click', () => {
  if (othersBtn.disabled || finds < FINDS_NEEDED) return;
  enterBrowse();
});
nextGem.addEventListener('click', () => cycleNextGem());
likeBtn.addEventListener('click', () => {
  if (viewingMine) return;
  likedByGem[otherIndex] = !likedByGem[otherIndex];
  likeInviteSeen[otherIndex] = true;
  syncLikeUi({ invite: false });
});
findCard.addEventListener('click', (e) => {
  e.preventDefault();
  openLightbox();
});
textPopupClose.addEventListener('click', () => closeTextPopup());
lightboxClose.addEventListener('click', () => closeLightbox());
photoLightbox.addEventListener('click', (e) => {
  if (e.target === photoLightbox || e.target === lightboxPhoto) closeLightbox();
});
slotCells.forEach((cell, i) => {
  cell.addEventListener('click', () => {
    if (!cell.classList.contains('is-filled')) return;
    openMyEntry(i);
  });
});
bindTipSwipe();

backHot.addEventListener('click', async () => {
  if (busy) return;
  busy = true;
  clearFinds();
  phase = 'entry';
  const sceneP = showScene(FRAME.entry);
  mapStage.classList.remove('is-on');
  mapStage.setAttribute('aria-hidden', 'true');
  await sceneP;
  await wait(FADE_MS);
  busy = false;
  syncChrome();
  setHint('Back at home entry.');
});

document.getElementById('shutter').addEventListener('click', () => handleShutter());
document.getElementById('cameraClose').addEventListener('click', async () => {
  if (busy) return;
  busy = true;
  pendingCapture = null;
  await closeCamera(true);
  phase = 'map';
  syncChrome();
  busy = false;
  setHint('Camera closed.');
});
document.getElementById('cameraSkip').addEventListener('click', () => handleCameraSkip());
document.getElementById('cameraFlip').addEventListener('click', async () => {
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  await startStream();
});
document.getElementById('noteSkip').addEventListener('click', () => {
  noteWords.value = '';
  submitNote();
});
document.getElementById('noteConfirm').addEventListener('click', () => submitNote());

if (cameraFallbackImg) cameraFallbackImg.src = CAPTURE_FULL;

buildPicker();
buildGems();
syncChrome();
setHint('Idle — pick a quest, then Play.');
