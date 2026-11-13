const QUESTS = [
  { title: 'A Whimsy walk' },
  { title: 'Have you noticed...' },
  { title: 'Fond memory' },
];

const FRAME = {
  home: 'assets/flow/01.png?v=7',
  entry: 'assets/flow/03.png?v=7',
};

const CAPTURE_FULL = 'assets/parts/capture.jpg?v=7b';
const CAPTURE_SLOTS = [
  'assets/parts/capture-0.jpg?v=7b',
  'assets/parts/capture-1.jpg?v=7b',
  'assets/parts/capture-2.jpg?v=7b',
];

/** Other challengers — gem on map + panel image/text (+ likes on zoom) */
const OTHER_ENTRIES = [
  {
    photo: 'assets/parts/capture-0.jpg?v=7b',
    text: 'Paw print in the sidewalk concrete near the ravine.',
    likes: 12,
    x: 28, y: 32,
  },
  {
    photo: 'assets/parts/capture-1.jpg?v=7b',
    text: 'Bird-shaped cloud above Victoria Trail.',
    likes: 7,
    x: 68, y: 28,
  },
  {
    photo: 'assets/parts/capture-2.jpg?v=7b',
    text: 'Fox silhouette in the ivy on the mailbox.',
    likes: 21,
    x: 48, y: 42,
  },
];

const GEM_OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE = 'M15 7.5H22.5L12 20.5Z';
const GEM_FACETS = 'M1.5 7.5H22.5M7 1.5L9 7.5L12 20.5L15 7.5L17 1.5';

const FADE_MS = 480;
const SLIDE_MS = 320;
const LIFT_MS = 420;
const PAN_MS = 820;
const SETTLE_MS = 780;
const FLIGHT_MS = 720;
const FINDS_NEEDED = 3;
const EASE_OUT = 'cubic-bezier(0.22, 0.8, 0.24, 1)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.45, 0.64, 1)';

const phone = document.getElementById('phone');
const sceneA = document.getElementById('sceneA');
const sceneB = document.getElementById('sceneB');
const stampSheet = document.getElementById('stampSheet');
const stampA = document.getElementById('stampA');
const stampB = document.getElementById('stampB');
const stampHots = Array.from(document.querySelectorAll('.stamp-hot'));
const mapStage = document.getElementById('mapStage');
const mapPan = document.getElementById('mapPan');
const gemLayer = document.getElementById('gemLayer');
const findPanel = document.getElementById('findPanel');
const findCard = document.getElementById('findCard');
const findCardBack = document.getElementById('findCardBack');
const panelPhoto = document.getElementById('panelPhoto');
const panelPhotoBack = document.getElementById('panelPhotoBack');
const panelStamp = document.getElementById('panelStamp');
const findPlane = document.getElementById('findPlane');
const writeMode = document.getElementById('writeMode');
const readMode = document.getElementById('readMode');
const noteWords = document.getElementById('noteWords');
const readText = document.getElementById('readText');
const readLikes = document.getElementById('readLikes');
const nextGem = document.getElementById('nextGem');
const tipWrap = document.getElementById('tipWrap');
const seeOther = document.getElementById('seeOther');
let panelPhotoSrc = '';
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
/** @type {string[]} */
let captures = [];
let stream = null;
let facingMode = 'environment';
let busy = false;
let pendingCapture = null;
let usingLiveCamera = false;
let frontIsA = true;
let stampFrontIsA = true;
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

function showStampUnder(which) {
  const wantA = which === 'menu';
  if (wantA === stampFrontIsA) return wait(0);
  if (wantA) {
    stampA.classList.add('is-front');
    stampB.classList.remove('is-front');
  } else {
    stampB.classList.add('is-front');
    stampA.classList.remove('is-front');
  }
  stampFrontIsA = wantA;
  return wait(FADE_MS);
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
    pin.setAttribute('aria-label', `Gem ${i + 1}`);
    pin.innerHTML = `<svg viewBox="0 0 24 22" aria-hidden="true">
      <path d="${GEM_OUTLINE}" fill="#b36bff"/>
      <path d="${GEM_TABLE}" fill="#fff" fill-opacity="0.3"/>
      <path d="${GEM_SHADE}" fill="#000" fill-opacity="0.22"/>
      <path d="${GEM_FACETS}" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="1" stroke-linejoin="round"/>
      <path d="${GEM_OUTLINE}" fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;
    pin.addEventListener('click', () => showOtherEntry(i, true));
    gemLayer.appendChild(pin);
  });
}

function gemPins() {
  return Array.from(gemLayer.querySelectorAll('.gem-pin'));
}

function setMapPan(_entry, _animate) {
  // Keep map-hunt locked — panning the full frame shifts baked HUD over fixed slots (seam artifacts).
  mapPan.style.transform = 'none';
}

function resetMapCamera(_animate) {
  gemPins().forEach((p) => p.classList.remove('is-active'));
  setMapPan();
}

function setPanelPhoto(src, { stamp, swap }) {
  panelStamp.hidden = !stamp;
  findCard.classList.remove('is-enter', 'is-shuffle');
  findCardBack.classList.remove('is-shuffle-out');

  if (swap && panelPhotoSrc) {
    // Previous image stays behind; new one shuffles onto the stack
    panelPhotoBack.src = panelPhotoSrc;
    findCardBack.classList.add('is-shown');
    panelPhoto.src = src;
    findCard.classList.add('is-shown');
    void findCard.offsetWidth;
    findCardBack.classList.add('is-shuffle-out');
    findCard.classList.add('is-shuffle');
  } else {
    panelPhoto.src = src;
    findCardBack.classList.remove('is-shown');
    findCard.classList.add('is-shown');
    void findCard.offsetWidth;
    findCard.classList.add('is-enter');
  }
  panelPhotoSrc = src;
}

function showWritePanel(uri) {
  writeMode.hidden = false;
  readMode.hidden = true;
  noteWords.value = '';
  setPanelPhoto(uri, { stamp: true, swap: false });
  findPlane.hidden = false;
  findPlane.classList.remove('is-on');
  void findPlane.offsetWidth;
  findPlane.classList.add('is-on');
  findPanel.hidden = false;
  void findPanel.offsetWidth;
  findPanel.classList.add('is-on');
}

function showReadPanel(entry, { swap }) {
  writeMode.hidden = true;
  readMode.hidden = false;
  readText.textContent = entry.text;
  // Likes appear on demand when zooming to this gem
  readLikes.hidden = true;
  setPanelPhoto(entry.photo, { stamp: false, swap });
  findPlane.hidden = true;
  findPlane.classList.remove('is-on');
  findPanel.hidden = false;
  findPanel.classList.add('is-on');
}

function hideFindPanel() {
  findPanel.classList.remove('is-on');
  findCard.classList.remove('is-shown', 'is-enter', 'is-shuffle');
  findCardBack.classList.remove('is-shown', 'is-shuffle-out');
  findPlane.hidden = true;
  findPlane.classList.remove('is-on');
  findPanel.hidden = true;
  writeMode.hidden = false;
  readMode.hidden = true;
  readLikes.hidden = true;
  panelPhotoSrc = '';
}

function showTip() {
  tipWrap.hidden = false;
  tipWrap.classList.remove('is-dismissing');
  tipWrap.style.transform = '';
  void tipWrap.offsetWidth;
  tipWrap.classList.add('is-on');
  seeOther.hidden = false;
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
    tipWrap.setPointerCapture(e.pointerId);
    onStart(e.clientX);
  });
  tipWrap.addEventListener('pointermove', (e) => onMove(e.clientX));
  tipWrap.addEventListener('pointerup', (e) => onEnd(e.clientX));
  tipWrap.addEventListener('pointercancel', (e) => onEnd(e.clientX));
}

async function showOtherEntry(index, animate) {
  otherIndex = ((index % OTHER_ENTRIES.length) + OTHER_ENTRIES.length) % OTHER_ENTRIES.length;
  const entry = OTHER_ENTRIES[otherIndex];
  gemPins().forEach((p, i) => p.classList.toggle('is-active', i === otherIndex));
  setMapPan(entry, animate);
  showReadPanel(entry, { swap: true });
  // Reveal likes after the pan settles
  later(() => {
    if (phase !== 'browse') return;
    readLikes.hidden = false;
    readLikes.textContent = `♥ ${entry.likes}`;
  }, animate ? PAN_MS : 80);
}

function syncChrome() {
  phone.dataset.phase = phase === 'revealed' ? 'revealed' : phase;
  entryHot.hidden = phase !== 'entry';
  playBtn.disabled = phase === 'camera' || phase === 'note' || busy;
  const onMap = phase === 'map' || phase === 'camera' || phase === 'note' || phase === 'browse';
  mapStage.classList.toggle('is-browse', phase === 'browse');
  backHot.hidden = !onMap || phase === 'camera';
  seeOther.hidden = tipWrap.hidden || !tipWrap.classList.contains('is-on');
  camHot.hidden = !(phase === 'map') || phase === 'note';
  stampHots.forEach((el) => {
    el.hidden = !(phase === 'menu' || phase === 'revealed');
  });
  closeHot.hidden = !(phase === 'menu' || phase === 'revealed');
  markNextSlot();
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
  captures = [];
  pendingCapture = null;
  hideFly();
  hideFindPanel();
  tipWrap.classList.remove('is-on', 'is-dismissing');
  tipWrap.hidden = true;
  tipWrap.style.transform = '';
  seeOther.hidden = true;
  slotCells.forEach((cell) => {
    const img = cell.querySelector('.slot');
    img.removeAttribute('src');
    cell.classList.remove('is-filled', 'is-land', 'is-ready');
  });
  resetMapCamera(false);
}

function resetStampState() {
  stampsRevealed = false;
  stampHots.forEach((h) => h.classList.remove('is-lifting'));
  stampA.classList.add('is-front');
  stampB.classList.remove('is-front');
  stampFrontIsA = true;
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
  await showScene(FRAME.home);
  await showStampSheet();
  syncChrome();
  setHint('Tap a stamp — it lifts, then reveals in place.');
}

async function revealStamp(index) {
  if (phase !== 'menu' || busy) return;
  busy = true;
  quest = index;
  Array.from(picker.children).forEach((c, i) => {
    c.setAttribute('aria-pressed', i === quest ? 'true' : 'false');
  });
  const hot = stampHots[index];
  stampHots.forEach((h) => h.classList.remove('is-lifting'));
  hot.classList.add('is-lifting');
  await wait(LIFT_MS);
  await showStampUnder('revealed');
  stampsRevealed = true;
  phase = 'revealed';
  hot.classList.remove('is-lifting');
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
  await hideStampSheet();
  await showMap();
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

async function flyIntoSlot(uri, index) {
  const cell = slotCells[index];
  const img = cell.querySelector('.slot');
  const start = relativeBox(findCard);
  const end = relativeBox(cell);
  const midX = (start.cx + end.cx) / 2;
  const midY = Math.min(start.cy, end.cy) - phoneSize().height * 0.08;

  flyThumb.src = uri;
  flyThumb.hidden = false;
  flyThumb.classList.add('is-on', 'is-arc');
  flyThumb.style.transition = 'none';
  flyThumb.style.transform = 'rotate(-6deg)';
  setFlyBox(start.left, start.top, Math.max(start.width * 0.7, 64), Math.max(start.height * 0.7, 64), '12px');
  void flyThumb.offsetWidth;

  await animateFlyTo({
    left: midX - 32, top: midY - 32, width: 64, height: 64, radius: '12px', rotate: 4,
  }, Math.floor(FLIGHT_MS * 0.45), EASE_OUT);

  await animateFlyTo({
    left: end.left, top: end.top, width: end.width, height: end.height, radius: '7px', rotate: 0,
  }, Math.floor(FLIGHT_MS * 0.55), EASE_SPRING);

  img.src = uri;
  cell.classList.add('is-filled', 'is-land');
  hideFly();
  await wait(280);
  cell.classList.remove('is-land');
}

async function submitNote() {
  if (phase !== 'note' || !pendingCapture || busy) return;
  busy = true;
  const fullUri = pendingCapture;
  const slotUri = usingLiveCamera && fullUri.startsWith('data:')
    ? fullUri
    : placeholderForFind(finds);

  findPanel.classList.remove('is-on');
  await wait(200);

  captures.push(slotUri);
  finds = captures.length;
  const index = finds - 1;

  await flyIntoSlot(slotUri, index);
  hideFindPanel();
  pendingCapture = null;

  if (finds >= FINDS_NEEDED) {
    showTip();
    phase = 'map';
    syncChrome();
    busy = false;
    setHint('Tip — swipe right to dismiss, or tap to see other Challengers.');
    return;
  }

  phase = 'map';
  syncChrome();
  busy = false;
  setHint(`Submitted ${finds}/${FINDS_NEEDED} — camera again.`);
}

async function enterBrowse() {
  if (busy) return;
  if (phase !== 'browse' && phase !== 'map') return;
  busy = true;
  phase = 'browse';
  dismissTip();
  await showOtherEntry(0, true);
  await wait(PAN_MS);
  busy = false;
  syncChrome();
  setHint('Next shuffles the stack — previous card stays behind.');
}

async function cycleNextGem() {
  if (busy) return;
  if (phase !== 'browse') {
    await enterBrowse();
    return;
  }
  busy = true;
  await showOtherEntry(otherIndex + 1, true);
  await wait(PAN_MS);
  busy = false;
  syncChrome();
  setHint(`Gem ${otherIndex + 1}/${OTHER_ENTRIES.length} — Next again.`);
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
  phase = 'entry';
  clearFinds();
  resetStampState();
  await hideStampSheet();
  await showScene(FRAME.entry);
  syncChrome();
  setHint('Entry chip — tap it or Play.');
});

entryHot.addEventListener('click', () => openMenu());

stampHots.forEach((el) => {
  el.addEventListener('click', () => {
    const i = Number(el.dataset.stamp);
    if (phase === 'menu') revealStamp(i);
    else if (phase === 'revealed') enterMapFromStamp(i);
  });
});

camHot.addEventListener('click', () => openCamera());
seeOther.addEventListener('click', () => enterBrowse());
nextGem.addEventListener('click', () => cycleNextGem());
bindTipSwipe();

backHot.addEventListener('click', async () => {
  if (busy) return;
  clearFinds();
  phase = 'entry';
  await hideMap();
  await showScene(FRAME.entry);
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
