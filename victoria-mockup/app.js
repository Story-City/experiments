const ART = 'envelope.png';
const HITS_TO_WIN = 10;
const APP_ACCENT = '#009EFF';
const BLOCK_MAX = 34;
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.35;
const MOLE_EDGE = 0.16;
const MOLE_GAP_MS = 180;
const MOLE_SEPARATION = 0.22;

const $ = (id) => document.getElementById(id);
const canvas = $('art');
const ctx = canvas.getContext('2d');
const scratch = document.createElement('canvas');
const sctx = scratch.getContext('2d');
const img = new Image();

let hits = 0;
let mole = null;
let solved = false;
let scale = 1;
let panX = 0;
let panY = 0;
let gapTimer = 0;

const pointers = new Map();

function resetRace() {
  hits = 0;
  solved = false;
  window.clearTimeout(gapTimer);
  $('shine').classList.remove('on');
  $('again').hidden = true;
  placeMole();
  paint();
  paintProgress();
}

function blockFor(amount) {
  if (amount >= 1) return 1;
  return Math.max(2, Math.round(BLOCK_MAX - (BLOCK_MAX - 2) * amount));
}

function paint() {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (!width) return;
  const amount = solved ? 1 : hits / HITS_TO_WIN;
  const block = blockFor(amount);
  if (block <= 1) {
    ctx.drawImage(img, 0, 0);
    return;
  }
  const tw = Math.max(1, Math.ceil(width / block));
  const th = Math.max(1, Math.ceil(height / block));
  scratch.width = tw;
  scratch.height = th;
  sctx.imageSmoothingEnabled = true;
  sctx.drawImage(img, 0, 0, width, height, 0, 0, tw, th);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(scratch, 0, 0, tw, th, 0, 0, width, height);
}

function paintProgress() {
  const fill = $('progress-fill');
  fill.style.width = `${(hits / HITS_TO_WIN) * 100}%`;
  fill.style.background = APP_ACCENT;
}

function finish() {
  solved = true;
  mole = null;
  drawMole();
  paint();
  $('shine').classList.add('on');
  $('again').hidden = false;
}

function randomSpot(previous) {
  let spot = previous;
  let guard = 0;
  do {
    spot = {
      x: MOLE_EDGE + Math.random() * (1 - MOLE_EDGE * 2),
      y: MOLE_EDGE + Math.random() * (1 - MOLE_EDGE * 2),
    };
    guard += 1;
  } while (
    previous
    && guard < 8
    && Math.hypot(spot.x - previous.x, spot.y - previous.y) < MOLE_SEPARATION
  );
  return spot;
}

function placeMole() {
  if (solved) return;
  mole = randomSpot(mole);
  drawMole();
}

function drawMole() {
  const el = $('mole');
  if (!mole || solved) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.style.left = `${mole.x * 100}%`;
  el.style.top = `${mole.y * 100}%`;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

function hitMole(clientX, clientY) {
  if (solved || !mole) return false;
  const rect = $('mole').getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return Math.hypot(clientX - cx, clientY - cy) <= rect.width / 2;
}

function countClick(clientX, clientY) {
  if (!hitMole(clientX, clientY)) return;
  hits += 1;
  burst(clientX, clientY);
  paintProgress();
  paint();
  mole = null;
  drawMole();
  if (hits >= HITS_TO_WIN) {
    finish();
    return;
  }
  gapTimer = window.setTimeout(placeMole, MOLE_GAP_MS);
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
}

function closePuzzle() {
  const puzzle = $('puzzle');
  puzzle.classList.remove('open');
  window.setTimeout(() => {
    if (!puzzle.classList.contains('open')) puzzle.hidden = true;
  }, 320);
}

$('decrypt').addEventListener('click', openPuzzle);
$('sheet-back').addEventListener('click', closePuzzle);
if (new URLSearchParams(location.search).get('debug') === '1') $('zoom').hidden = false;
$('again').addEventListener('click', resetRace);
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
  });
  if (pointers.size === 1) countClick(event.clientX, event.clientY);
  if (pointers.size === 2) pinchDist = pinchSpan();
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
  pointers.delete(event.pointerId);
  if (pointers.size < 2) pinchDist = 0;
});
viewport.addEventListener('pointercancel', (event) => {
  pointers.delete(event.pointerId);
  if (pointers.size < 2) pinchDist = 0;
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
  paint();
};
img.src = ART;
