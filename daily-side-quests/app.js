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

const GEMS = [
  {
    id: 'footprint',
    title: 'Have you noticed…',
    sub: 'Find 3 animalistic patterns nearby.',
    prompt: 'Find an animalistic pattern near you',
    overlay: 'assets/parts/footprint.png?v=7',
    x: 168,
    y: 250,
  },
  {
    id: 'airplanes',
    title: 'Sky scribble',
    sub: 'Catch 3 airplane shapes in the clouds.',
    prompt: 'Frame an airplane shape near you',
    overlay: 'assets/parts/airplanes.png?v=7',
    x: 280,
    y: 180,
  },
  {
    id: 'whimsy',
    title: 'A Whimsy walk',
    sub: 'Snap 3 whimsical finds on your path.',
    prompt: 'Snap something whimsical nearby',
    overlay: 'assets/parts/footprint.png?v=7',
    x: 110,
    y: 360,
  },
];

const FADE_MS = 420;
const SETTLE_MS = 780;
const FLIGHT_MS = 720;
const PHOTO_HOLD_MS = 280;
const PHOTO_SHRINK_MS = 480;
const BEAT_MS = 120;
const FINDS_NEEDED = 3;
const MAP_VIEW = { w: 390, h: 640 };
const EASE_OUT = 'cubic-bezier(0.22, 0.8, 0.24, 1)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.45, 0.64, 1)';
const NS = 'http://www.w3.org/2000/svg';

const GEM_OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const GEM_TABLE = 'M7 1.5H17L15 7.5H9Z';
const GEM_SHADE = 'M15 7.5H22.5L12 20.5Z';
const GEM_FACETS = 'M1.5 7.5H22.5M7 1.5L9 7.5L12 20.5L15 7.5L17 1.5';

const phone = document.getElementById('phone');
const sceneA = document.getElementById('sceneA');
const sceneB = document.getElementById('sceneB');
const mapWorld = document.getElementById('mapWorld');
const mapPan = document.getElementById('mapPan');
const mapSvg = document.getElementById('mapSvg');
const gemLayer = document.getElementById('gemLayer');
const mapTitle = document.getElementById('mapTitle');
const mapSub = document.getElementById('mapSub');
const doneTip = document.getElementById('doneTip');
const camField = document.getElementById('camField');
const camOverlay = document.getElementById('camOverlay');
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
const flyThumb = document.getElementById('flyThumb');
const slotCells = Array.from(document.querySelectorAll('.slot-cell'));
const hint = document.getElementById('hint');
const playBtn = document.getElementById('play');
const resetBtn = document.getElementById('reset');
const picker = document.getElementById('picker');
const camHot = document.getElementById('camHot');
const closeHot = document.getElementById('closeHot');
const entryHot = document.getElementById('entryHot');
const backHot = document.getElementById('backHot');
const seeOther = document.getElementById('seeOther');
const seeOtherTip = document.getElementById('seeOtherTip');
const stampHots = Array.from(document.querySelectorAll('.stamp-hot'));

/** @type {'home'|'menu'|'entry'|'revealed'|'map'|'camera'} */
let phase = 'home';
let quest = 0;
let gemIndex = 0;
let finds = 0;
/** @type {string[]} */
let captures = [];
let stream = null;
let facingMode = 'environment';
let busy = false;
let pendingCapture = null;
let usingLiveCamera = false;
let frontIsA = true;
let timers = [];
let mapBuilt = false;

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

function el(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.append(n);
  return n;
}

function buildMap() {
  if (mapBuilt) return;
  mapBuilt = true;
  const base = el('g', {}, mapSvg);
  el('rect', { width: MAP_VIEW.w, height: MAP_VIEW.h, class: 'ground' }, base);
  const xs = [0, 40, 120, 195, 280, 360, 390];
  const ys = [0, 90, 160, 230, 300, 380, 470, 560, 640];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      const park = (i === 4 && j === 1) || (i === 1 && j === 5);
      el('rect', {
        x: xs[i] + 8,
        y: ys[j] + 8,
        width: Math.max(0, xs[i + 1] - xs[i] - 16),
        height: Math.max(0, ys[j + 1] - ys[j] - 16),
        rx: 6,
        class: park ? 'park' : 'block',
      }, base);
    }
  }
  xs.slice(1, -1).forEach((x) => {
    el('line', {
      x1: x, y1: 0, x2: x, y2: MAP_VIEW.h,
      class: x === 195 ? 'road main' : 'road',
    }, base);
  });
  ys.slice(1, -1).forEach((y) => {
    el('line', {
      x1: 0, y1: y, x2: MAP_VIEW.w, y2: y,
      class: y === 300 ? 'road main' : 'road',
    }, base);
  });
  [[300, 110], [330, 130], [312, 145], [345, 112], [70, 400], [95, 430], [62, 448]].forEach(([x, y]) => {
    el('circle', { cx: x, cy: y, r: 9, class: 'tree' }, base);
  });
  const t1 = el('text', { x: 320, y: 104, class: 'label', 'text-anchor': 'middle' }, base);
  t1.textContent = 'Maple Park';
  const t2 = el('text', { x: 203, y: 294, class: 'label' }, base);
  t2.textContent = 'Main St';

  gemLayer.replaceChildren();
  GEMS.forEach((gem, i) => {
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'gem-pin';
    pin.dataset.gem = String(i);
    pin.style.left = `${(gem.x / MAP_VIEW.w) * 100}%`;
    pin.style.top = `${(gem.y / MAP_VIEW.h) * 100}%`;
    pin.setAttribute('aria-label', gem.title);
    pin.innerHTML = `
      <i class="ring" aria-hidden="true"></i>
      <svg viewBox="0 0 24 22" aria-hidden="true">
        <path d="${GEM_OUTLINE}" fill="#b36bff"/>
        <path d="${GEM_TABLE}" fill="#fff" fill-opacity="0.3"/>
        <path d="${GEM_SHADE}" fill="#000" fill-opacity="0.22"/>
        <path d="${GEM_FACETS}" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="1" stroke-linejoin="round"/>
        <path d="${GEM_OUTLINE}" fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`;
    pin.addEventListener('click', () => cycleToGem(i));
    gemLayer.appendChild(pin);
  });
}

function gemPins() {
  return Array.from(gemLayer.querySelectorAll('.gem-pin'));
}

function focusGem(index, animate) {
  gemIndex = ((index % GEMS.length) + GEMS.length) % GEMS.length;
  const gem = GEMS[gemIndex];
  gemPins().forEach((pin, i) => {
    pin.classList.toggle('is-active', i === gemIndex);
  });
  mapTitle.textContent = gem.title;
  mapSub.textContent = gem.sub;
  camOverlay.src = gem.overlay;
  cameraPrompt.textContent = gem.prompt;

  // Soft pan so the active gem sits near upper-mid of the phone
  const tx = (MAP_VIEW.w / 2 - gem.x) * 0.55;
  const ty = (MAP_VIEW.h * 0.38 - gem.y) * 0.55;
  if (!animate) mapPan.style.transition = 'none';
  mapPan.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(1.18)`;
  if (!animate) {
    void mapPan.offsetWidth;
    mapPan.style.transition = '';
  }

  // Hunt zone under active gem
  let zone = mapSvg.querySelector('.hunt-zone');
  if (!zone) {
    zone = el('g', { class: 'hunt-zone' }, mapSvg);
    el('circle', { class: 'zone-fill', r: 52 }, zone);
    el('circle', { class: 'zone-edge', r: 52 }, zone);
  }
  zone.setAttribute('transform', `translate(${gem.x} ${gem.y})`);
}

async function cycleToGem(index) {
  if (busy && phase === 'camera') return;
  const next = index == null ? gemIndex + 1 : index;
  focusGem(next, true);
  doneTip.hidden = true;
  if (finds >= FINDS_NEEDED) {
    finds = 0;
    captures = [];
    slotCells.forEach((cell) => {
      const img = cell.querySelector('.slot');
      img.removeAttribute('src');
      cell.classList.remove('is-filled', 'is-land', 'is-ready');
    });
  }
  markNextSlot();
  setHint(`${GEMS[gemIndex].title} — tap the camera.`);
}

function frontScene() {
  return frontIsA ? sceneA : sceneB;
}

function backScene() {
  return frontIsA ? sceneB : sceneA;
}

async function showScene(src) {
  const front = frontScene();
  if (front.getAttribute('src') === src && front.classList.contains('is-front')) {
    return;
  }
  const next = backScene();
  next.src = src;
  try {
    if (next.decode) await next.decode();
  } catch (_) {
    await wait(40);
  }
  next.classList.add('is-front');
  front.classList.remove('is-front');
  frontIsA = next === sceneA;
  await wait(FADE_MS);
}

function syncHots() {
  phone.dataset.phase = phase;
  const menu = phase === 'menu';
  const revealed = phase === 'revealed';
  const onMap = phase === 'map' || phase === 'camera';
  stampHots.forEach((elHot) => {
    elHot.hidden = !(menu || revealed);
  });
  closeHot.hidden = !(menu || revealed);
  entryHot.hidden = phase !== 'entry';
  phone.classList.toggle('is-map', onMap);
  playBtn.disabled = phase === 'camera' || busy;
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
  hideFly();
  doneTip.hidden = true;
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
}

async function showMapWorld() {
  buildMap();
  focusGem(gemIndex, false);
  mapWorld.classList.add('is-on');
  mapWorld.setAttribute('aria-hidden', 'false');
  await wait(FADE_MS);
}

async function hideMapWorld() {
  mapWorld.classList.remove('is-on');
  mapWorld.setAttribute('aria-hidden', 'true');
  await wait(FADE_MS);
}

async function goHome() {
  clearTimers();
  await closeCamField(false);
  clearFinds();
  phase = 'home';
  if (mapWorld.classList.contains('is-on')) await hideMapWorld();
  phone.classList.remove('is-map');
  await showScene(FRAME.home);
  syncHots();
  setHint('Idle — pick a quest, then Play.');
}

async function openMenu() {
  if (busy) return;
  clearFinds();
  if (mapWorld.classList.contains('is-on')) await hideMapWorld();
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
  // Stamp index nudges starting gem
  gemIndex = index % GEMS.length;
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
  syncHots();
  await showMapWorld();
  busy = false;
  setHint('Map hunt — open the camera, or See other challenges.');
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

async function openCamField() {
  if (phase !== 'map' || busy) return;
  if (finds >= FINDS_NEEDED) return;
  busy = true;
  phase = 'camera';
  pendingCapture = null;
  confirm.hidden = true;
  camField.classList.remove('is-confirm');
  const gem = GEMS[gemIndex];
  cameraPrompt.textContent = gem.prompt;
  camOverlay.src = gem.overlay;
  syncHots();

  camField.classList.add('is-on');
  camField.setAttribute('aria-hidden', 'false');
  await startStream();
  await wait(FADE_MS);
  busy = false;
  setHint('Glass field — shutter, Skip, or Confirm after snap.');
}

async function closeCamField(animate) {
  camField.classList.remove('is-confirm');
  if (animate) {
    camField.classList.remove('is-on');
    await wait(FADE_MS);
  } else {
    camField.classList.remove('is-on');
  }
  confirm.hidden = true;
  camField.setAttribute('aria-hidden', 'true');
  stopStream();
}

function placeholderForFind(index) {
  return CAPTURE_SLOTS[index % CAPTURE_SLOTS.length];
}

function snapCapture() {
  if (!usingLiveCamera) return CAPTURE_FULL;
  const w = cameraVideo.videoWidth;
  const h = cameraVideo.videoHeight;
  if (!w || !h) return CAPTURE_FULL;
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
  camField.classList.add('is-confirm');
  busy = false;
  setHint('Confirm on the field — Retake or Confirm.');
}

function handleRetake() {
  pendingCapture = null;
  confirm.hidden = true;
  camField.classList.remove('is-confirm');
  setHint('Retake — shutter again.');
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
    if (target.rotate != null) {
      flyThumb.style.transform = `rotate(${target.rotate}deg)`;
    }
    later(resolve, duration + 20);
  });
}

async function heroPhotoIn(uri) {
  const size = phoneSize();
  const heroW = size.width * 0.72;
  const heroH = size.height * 0.42;
  const left = (size.width - heroW) / 2;
  const top = size.height * 0.16;

  flyThumb.src = uri;
  flyThumb.hidden = false;
  flyThumb.classList.add('is-on', 'is-hero');
  flyThumb.style.transition = 'none';
  flyThumb.style.transform = 'scale(1.06)';
  setFlyBox(left, top, heroW, heroH, '16px');
  void flyThumb.offsetWidth;
  flyThumb.style.transition = `transform ${PHOTO_HOLD_MS}ms ${EASE_OUT}, opacity ${PHOTO_HOLD_MS}ms ease`;
  flyThumb.style.transform = 'scale(1)';
  await wait(PHOTO_HOLD_MS + 40);
}

async function flyIntoSlot(uri, index) {
  const cell = slotCells[index];
  const img = cell.querySelector('.slot');
  const start = relativeBox(flyThumb);
  const end = relativeBox(cell);
  const midX = (start.cx + end.cx) / 2 + (index === 0 ? -18 : 12);
  const midY = Math.min(start.cy, end.cy) - phoneSize().height * 0.1;

  flyThumb.src = uri;
  flyThumb.hidden = false;
  flyThumb.classList.add('is-on', 'is-arc');
  flyThumb.style.transition = 'none';
  flyThumb.style.transform = 'rotate(-6deg)';
  setFlyBox(start.left, start.top, Math.max(start.width, 72), Math.max(start.height, 72), '12px');
  void flyThumb.offsetWidth;

  await animateFlyTo({
    left: midX - 36,
    top: midY - 36,
    width: 72,
    height: 72,
    radius: '14px',
    rotate: 4,
  }, Math.floor(FLIGHT_MS * 0.45), EASE_OUT);

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
  await wait(320);
  cell.classList.remove('is-land');
}

async function settleFind(fullUri, slotUri) {
  captures.push(slotUri);
  finds = captures.length;
  const index = finds - 1;

  await heroPhotoIn(fullUri);
  await wait(BEAT_MS);
  await flyIntoSlot(slotUri, index);
  markNextSlot();

  // Soft pulse active gem
  const pin = gemPins()[gemIndex];
  if (pin) {
    pin.classList.remove('is-active');
    void pin.offsetWidth;
    pin.classList.add('is-active');
  }

  if (finds >= FINDS_NEEDED) {
    doneTip.hidden = false;
    setHint('Slots full — See other challenges to cycle gems.');
    await wait(SETTLE_MS);
    return;
  }

  setHint(`Find ${finds}/${FINDS_NEEDED} slotted — open camera again.`);
}

async function handleSendIt() {
  if (!pendingCapture || busy) return;
  busy = true;
  const fullUri = pendingCapture;
  const slotUri = usingLiveCamera && fullUri.startsWith('data:')
    ? fullUri
    : placeholderForFind(finds);
  pendingCapture = null;

  await closeCamField(true);
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
  await closeCamField(true);
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
  if (mapWorld.classList.contains('is-on')) await hideMapWorld();
  await showScene(FRAME.entry);
  syncHots();
  setHint('Entry chip on the dock — tap it or Play.');
});

entryHot.addEventListener('click', () => openMenu());

stampHots.forEach((elHot) => {
  elHot.addEventListener('click', () => {
    const i = Number(elHot.dataset.stamp);
    if (phase === 'menu') revealStamp(i);
    else if (phase === 'revealed') enterMap();
  });
});

camHot.addEventListener('click', () => openCamField());
seeOther.addEventListener('click', () => cycleToGem());
seeOtherTip.addEventListener('click', () => cycleToGem());

backHot.addEventListener('click', async () => {
  if (busy) return;
  clearFinds();
  phase = 'entry';
  await hideMapWorld();
  await showScene(FRAME.entry);
  syncHots();
  setHint('Back at home entry.');
});

shutter.addEventListener('click', () => handleShutter());
cameraClose.addEventListener('click', async () => {
  if (busy) return;
  busy = true;
  pendingCapture = null;
  await closeCamField(true);
  phase = 'map';
  syncHots();
  busy = false;
  setHint('Field closed — camera or See other challenges.');
});
cameraSkip.addEventListener('click', () => handleSkip());
cameraFlip.addEventListener('click', () => handleFlip());
retakeBtn.addEventListener('click', () => handleRetake());
sendItBtn.addEventListener('click', () => handleSendIt());

if (cameraFallbackImg) cameraFallbackImg.src = CAPTURE_FULL;

buildPicker();
buildMap();
syncHots();
setHint('Idle — pick a quest, then Play.');
