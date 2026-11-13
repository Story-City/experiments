const QUESTS = [
  { title: 'A Whimsy walk' },
  { title: 'Have you noticed...' },
  { title: 'Fond memory' },
];

const FRAME = {
  home: 'assets/flow/01.png?v=7',
  menu: 'assets/parts/menu.png?v=7',
  entry: 'assets/flow/03.png?v=7',
  revealed: 'assets/parts/revealed.png?v=7',
};

const CAPTURE_FULL = 'assets/parts/capture.jpg?v=7b';
const CAPTURE_SLOTS = [
  'assets/parts/capture-0.jpg?v=7b',
  'assets/parts/capture-1.jpg?v=7b',
  'assets/parts/capture-2.jpg?v=7b',
];

const SLIDE_MS = 320; // RN Modal animationType="slide"
const SETTLE_MS = 780;
const FLIGHT_MS = 720;
const PHOTO_HOLD_MS = 280;
const PHOTO_SHRINK_MS = 520;
const BEAT_MS = 120;
const FINDS_NEEDED = 3;
const EASE_OUT = 'cubic-bezier(0.22, 0.8, 0.24, 1)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.45, 0.64, 1)';

const phone = document.getElementById('phone');
const scene = document.getElementById('scene');
const mapStage = document.getElementById('mapStage');
const findCard = document.getElementById('findCard');
const findPlane = document.getElementById('findPlane');
const tipLayer = document.getElementById('tipLayer');
const flyThumb = document.getElementById('flyThumb');
const slotCells = Array.from(document.querySelectorAll('.slot-cell'));
const camera = document.getElementById('camera');
const cameraVideo = document.getElementById('cameraVideo');
const cameraSnap = document.getElementById('cameraSnap');
const cameraFallback = document.getElementById('cameraFallback');
const cameraFallbackImg = document.getElementById('cameraFallbackImg');
const cameraPrompt = document.getElementById('cameraPrompt');
const shutter = document.getElementById('shutter');
const cameraClose = document.getElementById('cameraClose');
const cameraSkip = document.getElementById('cameraSkip');
const cameraFlip = document.getElementById('cameraFlip');
const confirm = document.getElementById('confirm');
const confirmPhoto = document.getElementById('confirmPhoto');
const retakeBtn = document.getElementById('retake');
const sendItBtn = document.getElementById('sendIt');
const hint = document.getElementById('hint');
const playBtn = document.getElementById('play');
const resetBtn = document.getElementById('reset');
const picker = document.getElementById('picker');
const camHot = document.getElementById('camHot');
const closeHot = document.getElementById('closeHot');
const entryHot = document.getElementById('entryHot');
const backHot = document.getElementById('backHot');
const mapHot = document.getElementById('mapHot');
const stampHots = Array.from(document.querySelectorAll('.stamp-hot'));

/** @type {'home'|'menu'|'entry'|'revealed'|'map'|'camera'} */
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

function showScene(src) {
  return new Promise((resolve) => {
    if (scene.getAttribute('src') === src) {
      resolve();
      return;
    }
    scene.classList.add('is-fading');
    later(() => {
      scene.src = src;
      scene.classList.remove('is-fading');
      resolve();
    }, 280);
  });
}

function syncHots() {
  phone.dataset.phase = phase;
  const menu = phase === 'menu';
  const revealed = phase === 'revealed';
  const hunting = phase === 'map';
  stampHots.forEach((el) => {
    el.hidden = !(menu || revealed);
  });
  closeHot.hidden = !(menu || revealed);
  entryHot.hidden = phase !== 'entry';
  mapStage.hidden = !(hunting || phase === 'camera');
  camHot.hidden = !hunting;
  mapHot.hidden = !hunting;
  backHot.hidden = !hunting;
  playBtn.disabled = phase === 'camera' || busy;
  scene.hidden = hunting || phase === 'camera';
  markNextSlot();
}

function markNextSlot() {
  slotCells.forEach((cell, i) => {
    cell.classList.toggle('is-ready', phase === 'map' && i === finds && finds < FINDS_NEEDED);
  });
}

function clearFinds() {
  finds = 0;
  captures = [];
  findCard.hidden = true;
  findCard.classList.remove('is-on', 'is-pulse');
  findPlane.hidden = true;
  findPlane.classList.remove('is-on');
  tipLayer.hidden = true;
  tipLayer.classList.remove('is-on');
  hideFly();
  slotCells.forEach((cell) => {
    const img = cell.querySelector('.slot');
    img.removeAttribute('src');
    cell.classList.remove('is-filled', 'is-land', 'is-ready');
  });
}

function hideFly() {
  flyThumb.hidden = true;
  flyThumb.classList.remove('is-on', 'is-hero', 'is-arc');
  flyThumb.style.transition = 'none';
  flyThumb.style.transform = '';
  flyThumb.style.left = '';
  flyThumb.style.top = '';
  flyThumb.style.width = '';
  flyThumb.style.height = '';
  flyThumb.style.borderRadius = '';
  flyThumb.style.offsetPath = '';
  flyThumb.style.offsetDistance = '';
}

async function goHome() {
  clearTimers();
  await closeCameraSheet(false);
  clearFinds();
  phase = 'home';
  await showScene(FRAME.home);
  syncHots();
  setHint('Idle — pick a quest, then Play.');
}

async function openMenu() {
  if (busy) return;
  clearFinds();
  phase = 'menu';
  await showScene(FRAME.menu);
  syncHots();
  setHint('Hand stamps — tap one to reveal.');
}

async function revealStamp(index) {
  if (phase !== 'menu' || busy) return;
  busy = true;
  quest = index;
  Array.from(picker.children).forEach((c, i) => {
    c.setAttribute('aria-pressed', i === quest ? 'true' : 'false');
  });
  phase = 'revealed';
  await showScene(FRAME.revealed);
  busy = false;
  syncHots();
  setHint(`${QUESTS[quest].title} revealed — tap its camera.`);
}

async function enterMap() {
  if (phase !== 'revealed' || busy) return;
  busy = true;
  clearFinds();
  phase = 'map';
  await showScene(FRAME.home);
  syncHots();
  busy = false;
  setHint('Map hunt — tap the map or the camera.');
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
    if (cameraFallbackImg) {
      cameraFallbackImg.src = CAPTURE_FULL;
    }
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

async function openCameraSheet() {
  if (phase !== 'map' || busy) return;
  if (finds >= FINDS_NEEDED) return;
  busy = true;
  phase = 'camera';
  pendingCapture = null;
  confirm.hidden = true;
  cameraPrompt.textContent = `Find ${finds + 1} of ${FINDS_NEEDED} — animalistic pattern`;
  syncHots();

  // App CameraSheet: full-screen Modal, animationType="slide" — no map zoom.
  camera.classList.add('is-on');
  camera.setAttribute('aria-hidden', 'false');
  await startStream();
  await wait(SLIDE_MS);
  busy = false;
  setHint('Camera open — shutter, then Send It.');
}

async function closeCameraSheet(animate) {
  if (animate) {
    camera.classList.remove('is-on');
    await wait(SLIDE_MS);
  } else {
    camera.classList.remove('is-on');
  }
  confirm.hidden = true;
  camera.setAttribute('aria-hidden', 'true');
  stopStream();
}

function placeholderForFind(index) {
  return CAPTURE_SLOTS[index % CAPTURE_SLOTS.length];
}

function snapCapture() {
  if (!usingLiveCamera) {
    return CAPTURE_FULL;
  }
  const w = cameraVideo.videoWidth;
  const h = cameraVideo.videoHeight;
  if (!w || !h) {
    return CAPTURE_FULL;
  }
  cameraSnap.width = w;
  cameraSnap.height = h;
  const ctx = cameraSnap.getContext('2d');
  ctx.drawImage(cameraVideo, 0, 0, w, h);
  return cameraSnap.toDataURL('image/jpeg', 0.72);
}

async function handleShutter() {
  if (phase !== 'camera' || busy || !confirm.hidden) return;
  busy = true;
  pendingCapture = snapCapture();
  confirmPhoto.src = pendingCapture;
  confirm.hidden = false;
  busy = false;
  setHint('Confirm — Retake or Send It.');
}

function handleRetake() {
  pendingCapture = null;
  confirm.hidden = true;
  setHint('Retake — shutter again.');
}

function phoneSize() {
  const box = phone.getBoundingClientRect();
  return { width: box.width, height: box.height };
}

function relativeBox(el) {
  const phoneBox = phone.getBoundingClientRect();
  const box = el.getBoundingClientRect();
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
    if (target.rotate != null) {
      flyThumb.style.transform = `rotate(${target.rotate}deg)`;
    }
    later(resolve, duration + 20);
  });
}

async function heroPhotoIn(uri) {
  const size = phoneSize();
  const heroW = size.width * 0.78;
  const heroH = size.height * 0.58;
  const left = (size.width - heroW) / 2;
  const top = size.height * 0.14;

  flyThumb.src = uri;
  flyThumb.hidden = false;
  flyThumb.classList.add('is-on', 'is-hero');
  flyThumb.style.transition = 'none';
  flyThumb.style.transform = 'scale(1.08)';
  setFlyBox(left, top - 24, heroW, heroH, '18px');
  void flyThumb.offsetWidth;
  flyThumb.style.transition = `transform ${PHOTO_HOLD_MS}ms ${EASE_OUT}, opacity ${PHOTO_HOLD_MS}ms ease`;
  flyThumb.style.transform = 'scale(1)';
  await wait(PHOTO_HOLD_MS + 40);
}

async function shrinkPhotoTowardFind() {
  const find = relativeBox(findCard);
  const pad = 10;
  await animateFlyTo({
    left: find.left - pad,
    top: find.top - pad,
    width: find.width + pad * 2,
    height: find.height + pad * 2,
    radius: '12px',
    rotate: -10,
  }, PHOTO_SHRINK_MS, EASE_OUT);
}

async function flyIntoSlot(uri, index) {
  const cell = slotCells[index];
  const img = cell.querySelector('.slot');
  const start = relativeBox(flyThumb.hidden ? findCard : flyThumb);
  const end = relativeBox(cell);

  // Arc via mid control point (up then into slot).
  const midX = (start.cx + end.cx) / 2 + (index === 0 ? -18 : 12);
  const midY = Math.min(start.cy, end.cy) - phoneSize().height * 0.12;

  flyThumb.src = uri;
  flyThumb.hidden = false;
  flyThumb.classList.add('is-on', 'is-arc');
  flyThumb.style.transition = 'none';
  flyThumb.style.transform = 'rotate(-6deg)';
  setFlyBox(start.left, start.top, Math.max(start.width, 72), Math.max(start.height, 72), '12px');
  void flyThumb.offsetWidth;

  // Midpoint hop
  await animateFlyTo({
    left: midX - 40,
    top: midY - 40,
    width: 80,
    height: 80,
    radius: '14px',
    rotate: 4,
  }, Math.floor(FLIGHT_MS * 0.45), EASE_OUT);

  // Land in slot
  await animateFlyTo({
    left: end.left,
    top: end.top,
    width: end.width,
    height: end.height,
    radius: '7px',
    rotate: 0,
  }, Math.floor(FLIGHT_MS * 0.55), EASE_SPRING);

  img.src = uri;
  cell.classList.add('is-filled', 'is-land');
  hideFly();
  await wait(360);
  cell.classList.remove('is-land');
}

async function settleFind(fullUri, slotUri) {
  captures.push(slotUri);
  finds = captures.length;
  const index = finds - 1;

  // After CameraSheet closes — find appears, then capture goes into a slot.
  await heroPhotoIn(fullUri);

  if (finds === 1) {
    findCard.hidden = false;
    findPlane.hidden = false;
    findCard.classList.remove('is-on', 'is-pulse');
    findPlane.classList.remove('is-on');
    void findCard.offsetWidth;
    findCard.classList.add('is-on');
  } else {
    findCard.classList.remove('is-pulse');
    void findCard.offsetWidth;
    findCard.classList.add('is-pulse');
  }

  await shrinkPhotoTowardFind();
  await wait(BEAT_MS);

  if (finds === 1) {
    findPlane.classList.add('is-on');
    await wait(BEAT_MS);
  }

  await flyIntoSlot(slotUri, index);
  markNextSlot();

  if (finds >= FINDS_NEEDED) {
    setHint('Slots full — tip incoming…');
    await wait(160);
    tipLayer.hidden = false;
    tipLayer.classList.remove('is-on');
    void tipLayer.offsetWidth;
    tipLayer.classList.add('is-on');
    await wait(SETTLE_MS);
    setHint('Done — tip settled. Reset to play again.');
    return;
  }

  setHint(`Find ${finds}/${FINDS_NEEDED} slotted — tap camera again.`);
}

async function handleSendIt() {
  if (!pendingCapture || busy) return;
  busy = true;
  const fullUri = pendingCapture;
  const slotUri = usingLiveCamera && fullUri.startsWith('data:')
    ? fullUri
    : placeholderForFind(finds);
  pendingCapture = null;

  // App: Send It → close CameraSheet modal (slide down), then continue.
  await closeCameraSheet(true);
  phase = 'map';
  syncHots();
  await settleFind(fullUri, slotUri);
  busy = false;
  syncHots();
}

async function handleSkip() {
  if (phase !== 'camera' || busy) return;
  busy = true;
  const fullUri = CAPTURE_FULL;
  const slotUri = placeholderForFind(finds);
  await closeCameraSheet(true);
  phase = 'map';
  syncHots();
  await settleFind(fullUri, slotUri);
  busy = false;
  syncHots();
}

async function handleFlip() {
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  await startStream();
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
  await showScene(FRAME.entry);
  syncHots();
  setHint('Entry chip on the dock — tap it or Play.');
});

entryHot.addEventListener('click', () => openMenu());

stampHots.forEach((el) => {
  el.addEventListener('click', () => {
    const i = Number(el.dataset.stamp);
    if (phase === 'menu') revealStamp(i);
    else if (phase === 'revealed') enterMap();
  });
});

camHot.addEventListener('click', () => openCameraSheet());
mapHot.addEventListener('click', () => openCameraSheet());

backHot.addEventListener('click', async () => {
  if (busy) return;
  clearFinds();
  phase = 'entry';
  await showScene(FRAME.entry);
  syncHots();
  setHint('Back at home entry.');
});

shutter.addEventListener('click', () => handleShutter());
cameraClose.addEventListener('click', async () => {
  if (busy) return;
  busy = true;
  pendingCapture = null;
  await closeCameraSheet(true);
  phase = 'map';
  syncHots();
  busy = false;
  setHint('Camera closed — tap map or camera again.');
});
cameraSkip.addEventListener('click', () => handleSkip());
cameraFlip.addEventListener('click', () => handleFlip());
retakeBtn.addEventListener('click', () => handleRetake());
sendItBtn.addEventListener('click', () => handleSendIt());

if (cameraFallbackImg) {
  cameraFallbackImg.src = CAPTURE_FULL;
}

buildPicker();
syncHots();
setHint('Idle — pick a quest, then Play.');
