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

const OTHER_ENTRIES = [
  { scale: 1.26, tx: 16, ty: 12 },
  { scale: 1.3, tx: -20, ty: 16 },
  { scale: 1.22, tx: -2, ty: -14 },
];

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
const mineNote = document.getElementById('mineNote');
const minePhoto = document.getElementById('minePhoto');
const findPlane = document.getElementById('findPlane');
const noteField = document.getElementById('noteField');
const noteWords = document.getElementById('noteWords');
const tipLayer = document.getElementById('tipLayer');
const seeOther = document.getElementById('seeOther');
const otherNotes = Array.from(document.querySelectorAll('.map-note.other'));
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
  // which: 'menu' | 'revealed'
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

function setMapPan(entry, animate) {
  const e = entry || { scale: 1.06, tx: 0, ty: 0 };
  if (!animate) mapPan.style.transition = 'none';
  mapPan.style.transform = `translate(${e.tx}%, ${e.ty}%) scale(${e.scale})`;
  if (!animate) {
    void mapPan.offsetWidth;
    mapPan.style.transition = '';
  }
}

function focusOther(index, animate) {
  otherIndex = ((index % OTHER_ENTRIES.length) + OTHER_ENTRIES.length) % OTHER_ENTRIES.length;
  otherNotes.forEach((n, i) => n.classList.toggle('is-focus', i === otherIndex));
  setMapPan(OTHER_ENTRIES[otherIndex], animate);
}

function resetMapCamera(animate) {
  otherNotes.forEach((n) => n.classList.remove('is-focus'));
  setMapPan({ scale: 1.06, tx: 0, ty: 0 }, animate);
}

function syncChrome() {
  phone.dataset.phase = phase === 'revealed' ? 'revealed' : phase;
  entryHot.hidden = phase !== 'entry';
  playBtn.disabled = phase === 'camera' || phase === 'note' || busy;
  const onMap = phase === 'map' || phase === 'camera' || phase === 'note' || phase === 'browse';
  camHot.hidden = !(phase === 'map' || phase === 'browse');
  backHot.hidden = !onMap || phase === 'camera';
  seeOther.hidden = !(phase === 'browse' || (tipLayer.classList.contains('is-on') && onMap));
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
  mineNote.hidden = true;
  mineNote.classList.remove('is-on');
  findPlane.hidden = true;
  findPlane.classList.remove('is-on');
  noteField.hidden = true;
  noteField.classList.remove('is-on');
  noteWords.value = '';
  tipLayer.hidden = true;
  tipLayer.classList.remove('is-on');
  seeOther.hidden = true;
  otherNotes.forEach((n) => n.classList.remove('is-focus'));
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
  setHint('Map — take a photo. Note lands on the map; Confirm sits in the sheet.');
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
  if ((phase !== 'map' && phase !== 'browse') || busy) return;
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
  setHint('Shutter — then the note drops onto the map (field stays in the sheet).');
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
  minePhoto.src = uri;
  mineNote.hidden = false;
  mineNote.classList.remove('is-on');
  void mineNote.offsetWidth;
  mineNote.classList.add('is-on');

  findPlane.hidden = false;
  findPlane.classList.remove('is-on');
  void findPlane.offsetWidth;
  findPlane.classList.add('is-on');

  // Field in sheet band — after note is visible, never covering it
  noteWords.value = '';
  noteField.hidden = false;
  void noteField.offsetWidth;
  noteField.classList.add('is-on');

  phase = 'note';
  syncChrome();
  setHint('Note is on the map. Field is in the sheet — Skip or Confirm.');
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
  const start = relativeBox(mineNote.hidden ? cell : mineNote);
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

  noteField.classList.remove('is-on');
  await wait(220);
  noteField.hidden = true;

  captures.push(slotUri);
  finds = captures.length;
  const index = finds - 1;

  await flyIntoSlot(slotUri, index);

  mineNote.classList.remove('is-on');
  await wait(160);
  mineNote.hidden = true;
  pendingCapture = null;

  if (finds >= FINDS_NEEDED) {
    tipLayer.hidden = false;
    tipLayer.classList.remove('is-on');
    void tipLayer.offsetWidth;
    tipLayer.classList.add('is-on');
    seeOther.hidden = false;
    phase = 'browse';
    syncChrome();
    busy = false;
    setHint('Tap the tip — See other challenges pans the map camera.');
    return;
  }

  phase = 'map';
  syncChrome();
  busy = false;
  setHint(`Submitted ${finds}/${FINDS_NEEDED} — camera again.`);
}

async function cycleOtherChallenges() {
  if (busy) return;
  if (phase !== 'browse' && phase !== 'map') return;
  busy = true;
  phase = 'browse';
  tipLayer.hidden = false;
  tipLayer.classList.add('is-on');
  seeOther.hidden = false;
  focusOther(otherIndex + 1, true);
  await wait(PAN_MS);
  busy = false;
  syncChrome();
  setHint(`Other find ${otherIndex + 1}/${OTHER_ENTRIES.length} — tap tip again to cycle.`);
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
seeOther.addEventListener('click', () => cycleOtherChallenges());

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
syncChrome();
setHint('Idle — pick a quest, then Play.');
