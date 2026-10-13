const ART = '../decryptor/art/maynard.jpg';
const TAP_GAIN = 0.22;
const DECAY_GRACE_MS = 1100;
const DECAY_PER_SEC = 0.28;
const BLOCK_MAX = 34;
const GLOW_COUNT = 2;
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.35;

const ZONES = [
  { x: 0, y: 0, w: 1, h: 0.46 },
  { x: 0, y: 0.46, w: 0.5, h: 0.54 },
  { x: 0.5, y: 0.46, w: 0.5, h: 0.54 },
];

const $ = (id) => document.getElementById(id);
const canvas = $('art');
const ctx = canvas.getContext('2d');
const scratch = document.createElement('canvas');
const sctx = scratch.getContext('2d');
const img = new Image();

let clarity = ZONES.map(() => 0);
let lastClick = ZONES.map(() => 0);
let solved = false;
let lastFrame = 0;
let scale = 1;
let panX = 0;
let panY = 0;
let pinching = false;

const pointers = new Map();

function glowing() {
  return ZONES.map((_, i) => i)
    .filter((i) => clarity[i] < 1)
    .sort((a, b) => clarity[a] - clarity[b])
    .slice(0, GLOW_COUNT);
}

function resetRace() {
  clarity = ZONES.map(() => 0);
  lastClick = ZONES.map(() => 0);
  solved = false;
  $('shine').classList.remove('on');
  $('again').hidden = true;
  zoneKey = '';
  drawZones();
  paint();
}

function blockFor(amount) {
  if (amount >= 1) return 1;
  return Math.max(2, Math.round(BLOCK_MAX - (BLOCK_MAX - 2) * amount));
}

function paint() {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (!width) return;
  ZONES.forEach((zone, i) => {
    const sx = zone.x * width;
    const sy = zone.y * height;
    const sw = zone.w * width;
    const sh = zone.h * height;
    const block = blockFor(clarity[i]);
    if (block <= 1) {
      ctx.drawImage(img, sx, sy, sw, sh, sx, sy, sw, sh);
      return;
    }
    const tw = Math.max(1, Math.ceil(sw / block));
    const th = Math.max(1, Math.ceil(sh / block));
    scratch.width = tw;
    scratch.height = th;
    sctx.imageSmoothingEnabled = true;
    sctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(scratch, 0, 0, tw, th, sx, sy, sw, sh);
  });
}

function frame(now) {
  if (!solved && lastFrame) decay(now - lastFrame);
  lastFrame = now;
  paint();
  paintProgress();
  drawZones();
  if (!solved && clarity.every((amount) => amount >= 1)) finish();
  if (!solved) requestAnimationFrame(frame);
}

function decay(dt) {
  const now = performance.now();
  let oldest = -1;
  let oldestAt = Infinity;
  ZONES.forEach((_, i) => {
    if (clarity[i] <= 0 || !lastClick[i]) return;
    if (now - lastClick[i] < DECAY_GRACE_MS) return;
    if (lastClick[i] < oldestAt) {
      oldestAt = lastClick[i];
      oldest = i;
    }
  });
  if (oldest < 0) return;
  clarity[oldest] = Math.max(0, clarity[oldest] - DECAY_PER_SEC * (dt / 1000));
}

function paintProgress() {
  const done = clarity.reduce((sum, amount) => sum + amount, 0) / ZONES.length;
  $('progress-fill').style.transform = `scaleX(${done})`;
}

function finish() {
  solved = true;
  $('shine').classList.add('on');
  $('again').hidden = false;
  drawZones();
}

function zoneAt(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const u = (clientX - rect.left) / rect.width;
  const v = (clientY - rect.top) / rect.height;
  if (u < 0 || v < 0 || u > 1 || v > 1) return -1;
  return ZONES.findIndex((zone) => u >= zone.x && u < zone.x + zone.w && v >= zone.y && v < zone.y + zone.h);
}

function countClick(clientX, clientY) {
  if (solved) return;
  const index = zoneAt(clientX, clientY);
  if (index < 0) return;
  const now = performance.now();
  if (clarity[index] < 1) clarity[index] = Math.min(1, clarity[index] + TAP_GAIN);
  lastClick[index] = now;
  burst(clientX, clientY);
  drawZones();
}

function burst(clientX, clientY) {
  const rect = $('view').getBoundingClientRect();
  const el = document.createElement('span');
  el.className = 'burst';
  el.style.left = `${(clientX - rect.left) / scale}px`;
  el.style.top = `${(clientY - rect.top) / scale}px`;
  $('view').append(el);
  el.addEventListener('animationend', () => el.remove());
}

let zoneKey = '';

function drawZones() {
  const glow = glowing();
  const key = solved ? 'done' : glow.join(',');
  if (key === zoneKey) return;
  zoneKey = key;
  const holder = $('zones');
  holder.innerHTML = '';
  ZONES.forEach((zone, i) => {
    const el = document.createElement('div');
    el.className = 'zone' + (!solved && glow.includes(i) ? ' hot' : '');
    el.style.left = `${zone.x * 100}%`;
    el.style.top = `${zone.y * 100}%`;
    el.style.width = `${zone.w * 100}%`;
    el.style.height = `${zone.h * 100}%`;
    holder.append(el);
  });
}

function applyView() {
  const frameBox = $('viewport').getBoundingClientRect();
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (!width) return;
  const fit = Math.min(frameBox.width / width, frameBox.height / height);
  const shownW = width * fit;
  const shownH = height * fit;
  const maxX = Math.max(0, (shownW * scale - frameBox.width) / 2);
  const maxY = Math.max(0, (shownH * scale - frameBox.height) / 2);
  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
  const view = $('view');
  view.style.width = `${shownW}px`;
  view.style.transformOrigin = 'center center';
  view.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}

function setZoom(next, originX, originY) {
  const prev = scale;
  scale = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, next));
  if (scale === ZOOM_MIN) {
    panX = 0;
    panY = 0;
  } else if (originX != null) {
    panX -= (originX) * (scale - prev);
    panY -= (originY) * (scale - prev);
  }
  applyView();
}

function openPuzzle() {
  const puzzle = $('puzzle');
  puzzle.hidden = false;
  requestAnimationFrame(() => puzzle.classList.add('open'));
  resetRace();
  applyView();
  lastFrame = 0;
  zoneKey = '';
  requestAnimationFrame(frame);
}

$('decrypt').addEventListener('click', openPuzzle);
$('again').addEventListener('click', () => {
  resetRace();
  lastFrame = 0;
  requestAnimationFrame(frame);
});
$('zin').addEventListener('click', () => setZoom(scale + ZOOM_STEP));
$('zout').addEventListener('click', () => setZoom(scale - ZOOM_STEP));

const viewport = $('viewport');
let pinchDist = 0;

function pinchSpan() {
  const pts = [...pointers.values()];
  return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
}

viewport.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button')) return;
  try { viewport.setPointerCapture(event.pointerId); } catch (error) { /* synthetic clicks have no pointer */ }
  pointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
    ox: event.clientX,
    oy: event.clientY,
  });
  if (pointers.size <= GLOW_COUNT && !event.target.closest('button')) countClick(event.clientX, event.clientY);
  if (pointers.size === 2) {
    pinching = true;
    pinchDist = pinchSpan();
  }
});
viewport.addEventListener('pointermove', (event) => {
  const point = pointers.get(event.pointerId);
  if (!point) return;
  const dx = event.clientX - point.x;
  const dy = event.clientY - point.y;
  point.x = event.clientX;
  point.y = event.clientY;
  if (pointers.size === 2) {
    const dist = pinchSpan();
    if (pinchDist && Math.abs(dist - pinchDist) > 18) {
      setZoom(scale * (dist / pinchDist));
      pinchDist = dist;
    }
    return;
  }
  if (scale > 1) {
    panX += dx;
    panY += dy;
    applyView();
  }
});
viewport.addEventListener('pointerup', (event) => {
  const point = pointers.get(event.pointerId);
  pointers.delete(event.pointerId);
  if (pointers.size < 2) pinchDist = 0;
  if (pointers.size === 0) pinching = false;
});
viewport.addEventListener('pointercancel', (event) => {
  pointers.delete(event.pointerId);
  if (pointers.size < 2) pinchDist = 0;
  if (pointers.size === 0) pinching = false;
});
viewport.addEventListener('wheel', (event) => {
  event.preventDefault();
  setZoom(scale + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
}, { passive: false });
window.addEventListener('resize', applyView);

img.onload = () => {
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  applyView();
};
img.src = ART;
