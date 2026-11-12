const QUESTS = [
  { title: 'A Whimsy walk' },
  { title: 'Have you noticed...' },
  { title: 'Fond memory' },
];

const FRAME = {
  home: 'assets/flow/01.png?v=5',
  menu: 'assets/parts/menu.png?v=5',
  entry: 'assets/flow/03.png?v=5',
  revealed: 'assets/parts/revealed.png?v=5',
};

const SLIDE_MS = 320;
const SETTLE_MS = 780;
const FLASH_MS = 220;
const CAMERA_ANIMATE_MS = 500;
const FINDS_NEEDED = 3;
const PLACEHOLDER_PHOTO = 'assets/parts/footprint.png?v=5';

const phone = document.getElementById('phone');
const scene = document.getElementById('scene');
const mapStage = document.getElementById('mapStage');
const findCard = document.getElementById('findCard');
const findPlane = document.getElementById('findPlane');
const tipLayer = document.getElementById('tipLayer');
const slots = Array.from(document.querySelectorAll('.slot'));
const shineEl = document.getElementById('shine');
const flashEl = document.getElementById('flash');
const camera = document.getElementById('camera');
const cameraVideo = document.getElementById('cameraVideo');
const cameraSnap = document.getElementById('cameraSnap');
const cameraFallback = document.getElementById('cameraFallback');
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

function hit() {
  shineEl.classList.remove('is-on');
  void shineEl.offsetWidth;
  shineEl.classList.add('is-on');
}

function flash() {
  flashEl.classList.remove('is-on');
  void flashEl.offsetWidth;
  flashEl.classList.add('is-on');
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
  mapStage.hidden = !hunting && phase !== 'camera';
  // Keep map under camera while sheet is open
  if (phase === 'camera') {
    mapStage.hidden = false;
  }
  camHot.hidden = !hunting;
  mapHot.hidden = !hunting;
  backHot.hidden = !hunting;
  playBtn.disabled = phase === 'camera' || busy;
  scene.hidden = hunting || phase === 'camera';
}

function clearFinds() {
  finds = 0;
  captures = [];
  findCard.hidden = true;
  findCard.classList.remove('is-on');
  findPlane.hidden = true;
  findPlane.classList.remove('is-on');
  tipLayer.hidden = true;
  tipLayer.classList.remove('is-on');
  slots.forEach((slot) => {
    slot.removeAttribute('src');
    slot.classList.remove('is-on');
  });
  mapStage.classList.remove('is-zoomed');
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
  hit();
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
    return true;
  } catch (err) {
    cameraFallback.hidden = false;
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

  // Soft map zoom, then CameraSheet slides up (app Modal slide).
  mapStage.classList.add('is-zoomed');
  await wait(CAMERA_ANIMATE_MS);
  camera.classList.add('is-on');
  camera.setAttribute('aria-hidden', 'false');
  await startStream();
  await wait(SLIDE_MS);
  busy = false;
  setHint('CameraSheet open — shutter, then Send It.');
}

async function closeCameraSheet(animate) {
  confirm.hidden = true;
  pendingCapture = null;
  if (animate) {
    camera.classList.remove('is-on');
    await wait(SLIDE_MS);
    mapStage.classList.remove('is-zoomed');
    await wait(CAMERA_ANIMATE_MS);
  } else {
    camera.classList.remove('is-on');
    mapStage.classList.remove('is-zoomed');
  }
  camera.setAttribute('aria-hidden', 'true');
  stopStream();
}

function snapCapture() {
  const w = cameraVideo.videoWidth;
  const h = cameraVideo.videoHeight;
  if (!w || !h || cameraFallback.hidden === false) {
    return PLACEHOLDER_PHOTO;
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
  flash();
  await wait(FLASH_MS);
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

async function settleFind(uri) {
  captures.push(uri);
  finds = captures.length;

  const slot = slots[finds - 1];
  if (slot) {
    slot.src = uri;
    slot.classList.add('is-on');
  }

  findCard.hidden = false;
  findPlane.hidden = false;
  void findCard.offsetWidth;
  findCard.classList.add('is-on');
  findPlane.classList.add('is-on');

  await wait(SETTLE_MS);
  hit();

  if (finds >= FINDS_NEEDED) {
    setHint('Finds settled — tip incoming…');
    await wait(220);
    tipLayer.hidden = false;
    void tipLayer.offsetWidth;
    tipLayer.classList.add('is-on');
    await wait(SETTLE_MS);
    hit();
    setHint('Done — tip settled. Reset to play again.');
    return;
  }

  setHint(`Find ${finds}/${FINDS_NEEDED} on the map — tap camera again.`);
}

async function handleSendIt() {
  if (!pendingCapture || busy) return;
  busy = true;
  const uri = pendingCapture;
  await closeCameraSheet(true);
  phase = 'map';
  syncHots();
  await settleFind(uri);
  busy = false;
  syncHots();
}

async function handleSkip() {
  if (phase !== 'camera' || busy) return;
  busy = true;
  await closeCameraSheet(true);
  phase = 'map';
  syncHots();
  await settleFind(PLACEHOLDER_PHOTO);
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

buildPicker();
syncHots();
setHint('Idle — pick a quest, then Play.');
