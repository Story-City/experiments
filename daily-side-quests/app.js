const QUESTS = [
  { title: 'A Whimsy walk' },
  { title: 'Have you noticed...' },
  { title: 'Fond memory' },
];

const FRAME = {
  home: 'assets/flow/01.png?v=4',
  menu: 'assets/flow/02.png?v=4',
  entry: 'assets/flow/03.png?v=4',
  revealed: 'assets/flow/04.png?v=4',
  map: 'assets/flow/05.png?v=4',
  find: 'assets/flow/06.png?v=4',
  tip: 'assets/flow/07.png?v=4',
};

const IN_MS = 380;
const ZOOM_MS = 920;
const SETTLE_MS = 780;
const FLASH_MS = 220;
const FINDS_NEEDED = 3;

const phone = document.getElementById('phone');
const stage = document.getElementById('stage');
const scene = document.getElementById('scene');
const findEl = document.getElementById('find');
const tipEl = document.getElementById('tip');
const shineEl = document.getElementById('shine');
const flashEl = document.getElementById('flash');
const camera = document.getElementById('camera');
const cameraVideo = document.getElementById('cameraVideo');
const cameraFallback = document.getElementById('cameraFallback');
const cameraLabel = document.getElementById('cameraLabel');
const shutter = document.getElementById('shutter');
const cameraClose = document.getElementById('cameraClose');
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

/** @type {'home'|'menu'|'entry'|'revealed'|'map'|'find'|'camera'} */
let phase = 'home';
let quest = 0;
let finds = 0;
let stream = null;
let busy = false;
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
    stage.classList.add('is-fading');
    later(() => {
      scene.src = src;
      stage.classList.remove('is-fading');
      resolve();
    }, IN_MS);
  });
}

function syncHots() {
  phone.dataset.phase = phase;
  const menu = phase === 'menu';
  const revealed = phase === 'revealed';
  const hunting = phase === 'map' || phase === 'find';
  stampHots.forEach((el) => {
    el.hidden = !(menu || revealed);
  });
  closeHot.hidden = !(menu || revealed);
  camHot.hidden = !hunting;
  mapHot.hidden = !hunting;
  backHot.hidden = !hunting;
  entryHot.hidden = phase !== 'entry';
  playBtn.disabled = phase === 'camera' || busy;
}

function clearFindLayers() {
  findEl.hidden = true;
  findEl.classList.remove('is-on');
  tipEl.hidden = true;
  tipEl.classList.remove('is-on');
}

async function goHome() {
  clearTimers();
  await stopCamera(false);
  finds = 0;
  phase = 'home';
  clearFindLayers();
  stage.classList.remove('is-zoomed');
  await showScene(FRAME.home);
  syncHots();
  setHint('Idle — pick a quest, then Play.');
}

async function openMenu() {
  if (busy) return;
  phase = 'menu';
  finds = 0;
  clearFindLayers();
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
  phase = 'map';
  finds = 0;
  clearFindLayers();
  await showScene(FRAME.map);
  syncHots();
  busy = false;
  setHint('Map hunt — tap the map or the camera.');
}

async function openCamera() {
  if ((phase !== 'map' && phase !== 'find') || busy) return;
  if (finds >= FINDS_NEEDED) return;
  busy = true;
  phase = 'camera';
  syncHots();
  cameraLabel.textContent = `Find ${finds + 1} of ${FINDS_NEEDED} — then shutter`;

  // Soft zoom into the map find area, then camera settles open.
  stage.classList.add('is-zoomed');
  camera.classList.remove('is-closing');
  camera.classList.add('is-on');
  camera.setAttribute('aria-hidden', 'false');

  cameraFallback.hidden = true;
  try {
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      cameraVideo.srcObject = stream;
      await cameraVideo.play();
    }
  } catch (err) {
    cameraFallback.hidden = false;
  }

  await wait(ZOOM_MS);
  busy = false;
  setHint('Camera open — shutter to capture, then zoom out.');
}

async function stopCamera(animate) {
  if (animate) {
    camera.classList.add('is-closing');
    stage.classList.remove('is-zoomed');
    await wait(ZOOM_MS);
  } else {
    stage.classList.remove('is-zoomed');
  }
  camera.classList.remove('is-on', 'is-closing');
  camera.setAttribute('aria-hidden', 'true');
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
    cameraVideo.srcObject = null;
  }
}

async function captureAndSettle() {
  if (phase !== 'camera' || busy) return;
  busy = true;
  finds += 1;

  flash();
  await wait(FLASH_MS);

  // Zoom out of camera into the map, then soft-settle the find.
  await stopCamera(true);
  await showScene(FRAME.map);

  findEl.hidden = false;
  void findEl.offsetWidth;
  findEl.classList.add('is-on');
  phase = 'find';

  await wait(SETTLE_MS);
  hit();

  if (finds >= FINDS_NEEDED) {
    setHint('Find settled — tip incoming…');
    await wait(220);
    tipEl.hidden = false;
    void tipEl.offsetWidth;
    tipEl.classList.add('is-on');
    await wait(SETTLE_MS);
    hit();
    setHint('Done — tip settled. Reset to play again.');
    busy = false;
    syncHots();
    return;
  }

  setHint(`Find ${finds}/${FINDS_NEEDED} settled — tap map or camera again.`);
  busy = false;
  syncHots();
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
  clearFindLayers();
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

camHot.addEventListener('click', () => openCamera());
mapHot.addEventListener('click', () => openCamera());

backHot.addEventListener('click', async () => {
  if (busy) return;
  phase = 'entry';
  finds = 0;
  clearFindLayers();
  await showScene(FRAME.entry);
  syncHots();
  setHint('Back at home entry.');
});

shutter.addEventListener('click', () => captureAndSettle());

cameraClose.addEventListener('click', async () => {
  if (busy) return;
  busy = true;
  await stopCamera(true);
  phase = finds > 0 ? 'find' : 'map';
  syncHots();
  busy = false;
  setHint('Camera closed — tap map or camera again.');
});

buildPicker();
syncHots();
setHint('Idle — pick a quest, then Play.');
