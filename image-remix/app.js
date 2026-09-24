const ART = [
  { file: 'van-gogh-self-portrait.jpg', title: 'Self-Portrait', artist: 'Vincent van Gogh', year: 1887 },
  { file: 'mona-lisa.jpg', title: 'Mona Lisa', artist: 'Leonardo da Vinci', year: '1503–19' },
  { file: 'pearl-earring.jpg', title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', year: 1665 },
  { file: 'van-gogh-sunflowers.jpg', title: 'Sunflowers', artist: 'Vincent van Gogh', year: 1888 },
  { file: 'van-gogh-bedroom.jpg', title: 'The Bedroom', artist: 'Vincent van Gogh', year: 1888 },
  { file: 'great-wave.jpg', title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', year: '1831' },
  { file: 'grande-jatte.jpg', title: 'A Sunday on La Grande Jatte', artist: 'Georges Seurat', year: '1884–86' },
  { file: 'starry-night.jpg', title: 'The Starry Night', artist: 'Vincent van Gogh', year: 1889 },
  { file: 'the-scream.jpg', title: 'The Scream', artist: 'Edvard Munch', year: 1893 },
  { file: 'birth-of-venus.jpg', title: 'The Birth of Venus', artist: 'Sandro Botticelli', year: '1484–86' },
  { file: 'the-kiss.jpg', title: 'The Kiss', artist: 'Gustav Klimt', year: '1907–08' },
  { file: 'arnolfini.jpg', title: 'The Arnolfini Portrait', artist: 'Jan van Eyck', year: 1434 },
  { file: 'whistlers-mother.jpg', title: "Whistler's Mother", artist: 'James McNeill Whistler', year: 1871 },
  { file: 'wanderer.jpg', title: 'Wanderer above the Sea of Fog', artist: 'Caspar David Friedrich', year: 1818 },
  { file: 'vertumnus.jpg', title: 'Vertumnus', artist: 'Giuseppe Arcimboldo', year: 1591 },
  { file: 'night-watch.jpg', title: 'The Night Watch', artist: 'Rembrandt van Rijn', year: 1642 },
];

const PARAMS = new URLSearchParams(location.search);
const EMBED = PARAMS.has('embed') && parent !== window;
const EMBED_SRC = PARAMS.get('src') || '';
const EMBED_CREDIT = PARAMS.get('credit') || '';

const LOOK_DEFAULTS = { pixel: 1, hue: 0, sepia: 0, saturate: 100, contrast: 100, blur: 0, aberration: 0, fisheye: 0, tilt: 0, shapes: 0, posterize: 0 };
const PHOTO_DEFAULTS = { opacity: 100, feather: 35, size: 40, shape: 'circle', blend: 'source-over' };
const PHOTO_MAX = 900;
const UNDO_MAX = 10;

const stage = document.getElementById('stage');
const ctx = stage.getContext('2d', { willReadFrequently: true });
const work = document.createElement('canvas');
const workCtx = work.getContext('2d');

const state = {
  art: null,
  base: null,
  undo: [],
  tool: 'move',
  smudge: { brush: 50, strength: 70, mode: 'marble' },
  artIndex: 0,
  photo: null,
  masked: null,
  maskKey: '',
  look: { ...LOOK_DEFAULTS },
  layer: { ...PHOTO_DEFAULTS, x: 0, y: 0, rot: 0 },
};

let frameQueued = false;
function requestRender() {
  if (frameQueued) return;
  frameQueued = true;
  requestAnimationFrame(() => { frameQueued = false; render(); });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function selectArt(i) {
  state.artIndex = i;
  const a = ART[i];
  await loadArt('art/' + a.file, `${a.title} — ${a.artist}, ${a.year}`);
  document.querySelectorAll('#artStrip button').forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
}

async function loadArt(src, credit) {
  state.art = await loadImage(src);
  stage.width = state.art.naturalWidth;
  stage.height = state.art.naturalHeight;
  state.base = document.createElement('canvas');
  state.base.width = stage.width;
  state.base.height = stage.height;
  state.base.getContext('2d', { willReadFrequently: true }).drawImage(state.art, 0, 0);
  state.undo = [];
  syncUndo();
  placeLayer();
  document.getElementById('credit').textContent = credit;
  requestRender();
}

function placeLayer() {
  state.layer.x = stage.width / 2;
  state.layer.y = stage.height * 0.4;
  state.layer.rot = 0;
}

function buildMasked() {
  const { photo, layer } = state;
  const key = `${layer.shape}|${layer.feather}`;
  if (state.masked && state.maskKey === key) return state.masked;

  let sx = 0, sy = 0, sw = photo.width, sh = photo.height;
  if (layer.shape !== 'full') {
    const side = Math.min(sw, sh);
    sx = (sw - side) / 2; sy = (sh - side) / 2; sw = sh = side;
  }
  const c = document.createElement('canvas');
  c.width = sw; c.height = sh;
  const m = c.getContext('2d');
  m.drawImage(photo, sx, sy, sw, sh, 0, 0, sw, sh);
  m.globalCompositeOperation = 'destination-in';
  const f = layer.feather / 100;

  if (layer.shape === 'circle') {
    const r = sw / 2;
    const g = m.createRadialGradient(r, r, r * (1 - f) * 0.98, r, r, r);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = g;
    m.fillRect(0, 0, sw, sh);
  } else if (f > 0) {
    const edge = Math.min(sw, sh) * 0.5 * f;
    const gx = m.createLinearGradient(0, 0, sw, 0);
    gx.addColorStop(0, 'rgba(0,0,0,0)');
    gx.addColorStop(edge / sw, 'rgba(0,0,0,1)');
    gx.addColorStop(1 - edge / sw, 'rgba(0,0,0,1)');
    gx.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = gx;
    m.fillRect(0, 0, sw, sh);
    const gy = m.createLinearGradient(0, 0, 0, sh);
    gy.addColorStop(0, 'rgba(0,0,0,0)');
    gy.addColorStop(edge / sh, 'rgba(0,0,0,1)');
    gy.addColorStop(1 - edge / sh, 'rgba(0,0,0,1)');
    gy.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = gy;
    m.fillRect(0, 0, sw, sh);
  }
  state.masked = c;
  state.maskKey = key;
  return c;
}

function drawPhoto(ctx) {
  const { layer } = state;
  const masked = buildMasked();
  const scale = (layer.size / 100) * stage.width / masked.width;
  ctx.save();
  ctx.translate(layer.x, layer.y);
  ctx.rotate(layer.rot);
  ctx.scale(scale, scale);
  ctx.globalAlpha = layer.opacity / 100;
  ctx.globalCompositeOperation = layer.blend;
  ctx.drawImage(masked, -masked.width / 2, -masked.height / 2);
  ctx.restore();
}

const tiltBlur = document.createElement('canvas');
const tiltSmall = document.createElement('canvas');

function applyTiltShift() {
  const t = state.look.tilt;
  if (t === 0) return;
  const W = stage.width, H = stage.height;
  const f = 1 / (1 + t * 0.2);
  tiltSmall.width = Math.max(1, Math.round(W * f));
  tiltSmall.height = Math.max(1, Math.round(H * f));
  const sc = tiltSmall.getContext('2d');
  sc.imageSmoothingQuality = 'high';
  sc.drawImage(stage, 0, 0, tiltSmall.width, tiltSmall.height);
  tiltBlur.width = W; tiltBlur.height = H;
  const bc = tiltBlur.getContext('2d');
  bc.imageSmoothingQuality = 'high';
  bc.drawImage(tiltSmall, 0, 0, W, H);
  bc.globalCompositeOperation = 'destination-in';
  const g = bc.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(0,0,0,1)');
  g.addColorStop(0.3, 'rgba(0,0,0,0)');
  g.addColorStop(0.62, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,1)');
  bc.fillStyle = g;
  bc.fillRect(0, 0, W, H);
  bc.globalCompositeOperation = 'source-over';
  ctx.drawImage(tiltBlur, 0, 0);
}

function resample(factor, smooth) {
  const W = stage.width, H = stage.height;
  const w = Math.max(1, Math.round(W * factor)), h = Math.max(1, Math.round(H * factor));
  work.width = w; work.height = h;
  workCtx.imageSmoothingEnabled = true;
  workCtx.imageSmoothingQuality = 'high';
  workCtx.drawImage(stage, 0, 0, w, h);
  ctx.save();
  ctx.imageSmoothingEnabled = smooth;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(work, 0, 0, w, h, 0, 0, W, H);
  ctx.restore();
}

function mul(a, b) {
  const r = new Array(9);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
  return r;
}

function colorMatrix(look) {
  const t = look.hue * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
  const hue = [
    0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928,
    0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.140, 0.072 - c * 0.072 - s * 0.283,
    0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072,
  ];
  const v = look.saturate / 100;
  const sat = [
    0.213 + 0.787 * v, 0.715 - 0.715 * v, 0.072 - 0.072 * v,
    0.213 - 0.213 * v, 0.715 + 0.285 * v, 0.072 - 0.072 * v,
    0.213 - 0.213 * v, 0.715 - 0.715 * v, 0.072 + 0.928 * v,
  ];
  const a = look.sepia / 100;
  const sepTarget = [0.393, 0.769, 0.189, 0.349, 0.686, 0.168, 0.272, 0.534, 0.131];
  const id = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const sep = id.map((x, i) => x + (sepTarget[i] - x) * a);
  const k = look.contrast / 100;
  const m = mul(sep, mul(sat, hue)).map(x => x * k);
  return { m, off: 128 * (1 - k) };
}

function applyColor() {
  const { look } = state;
  if (look.hue === 0 && look.saturate === 100 && look.sepia === 0 && look.contrast === 100) return;
  const { m, off } = colorMatrix(look);
  const img = ctx.getImageData(0, 0, stage.width, stage.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    d[i] = m[0] * r + m[1] * g + m[2] * b + off;
    d[i + 1] = m[3] * r + m[4] * g + m[5] * b + off;
    d[i + 2] = m[6] * r + m[7] * g + m[8] * b + off;
  }
  ctx.putImageData(img, 0, 0);
}

function applyAberration() {
  const d = Math.round(state.look.aberration * stage.width / 1000);
  if (d === 0) return;
  const W = stage.width, H = stage.height;
  const img = ctx.getImageData(0, 0, W, H);
  const src = new Uint8ClampedArray(img.data);
  const out = img.data;
  for (let y = 0; y < H; y++) {
    const row = y * W;
    for (let x = 0; x < W; x++) {
      const i = (row + x) * 4;
      out[i] = src[(row + Math.max(0, x - d)) * 4];
      out[i + 2] = src[(row + Math.min(W - 1, x + d)) * 4 + 2];
    }
  }
  ctx.putImageData(img, 0, 0);
}

function applyFisheye() {
  const k = state.look.fisheye / 100 * 0.85;
  if (k === 0) return;
  const W = stage.width, H = stage.height;
  const img = ctx.getImageData(0, 0, W, H);
  const src = new Uint8ClampedArray(img.data);
  const out = img.data;
  const cx = (W - 1) / 2, cy = (H - 1) / 2, R = Math.hypot(cx, cy);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - cx, dy = y - cy;
      const f = 1 - k + k * Math.sqrt(dx * dx + dy * dy) / R;
      const sx = Math.min(W - 1.001, Math.max(0, cx + dx * f));
      const sy = Math.min(H - 1.001, Math.max(0, cy + dy * f));
      const x0 = sx | 0, y0 = sy | 0, fx = sx - x0, fy = sy - y0;
      const a = (y0 * W + x0) * 4, b = a + 4, c = a + W * 4, d = c + 4;
      const o = (y * W + x) * 4;
      for (let ch = 0; ch < 3; ch++) {
        const top = src[a + ch] + (src[b + ch] - src[a + ch]) * fx;
        const bot = src[c + ch] + (src[d + ch] - src[c + ch]) * fx;
        out[o + ch] = top + (bot - top) * fy;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

let cellCache = null;

function seededRand(n) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

function cellLabels(W, H, sz) {
  const key = `${W}x${H}@${sz}`;
  if (cellCache && cellCache.key === key) return cellCache;
  const gw = Math.ceil(W / sz), gh = Math.ceil(H / sz);
  const seeds = new Float32Array(gw * gh * 2);
  for (let g = 0; g < gw * gh; g++) {
    seeds[g * 2] = ((g % gw) + 0.1 + 0.8 * seededRand(g * 2)) * sz;
    seeds[g * 2 + 1] = (((g / gw) | 0) + 0.1 + 0.8 * seededRand(g * 2 + 1)) * sz;
  }
  const labels = new Int32Array(W * H);
  for (let y = 0; y < H; y++) {
    const cy = (y / sz) | 0;
    for (let x = 0; x < W; x++) {
      const cx = (x / sz) | 0;
      let best = 0, bd = Infinity;
      for (let j = Math.max(0, cy - 1); j <= Math.min(gh - 1, cy + 1); j++) {
        for (let i = Math.max(0, cx - 1); i <= Math.min(gw - 1, cx + 1); i++) {
          const g = j * gw + i, dx = seeds[g * 2] - x, dy = seeds[g * 2 + 1] - y, dd = dx * dx + dy * dy;
          if (dd < bd) { bd = dd; best = g; }
        }
      }
      labels[y * W + x] = best;
    }
  }
  cellCache = { key, labels, count: gw * gh };
  return cellCache;
}

function applyShapes() {
  const v = state.look.shapes;
  if (v === 0) return;
  const W = stage.width, H = stage.height;
  const { labels, count } = cellLabels(W, H, Math.max(6, Math.round(v * W / 1000)));
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  const sum = new Float32Array(count * 4);
  for (let p = 0; p < labels.length; p++) {
    const g = labels[p] * 4, n = p * 4;
    sum[g] += d[n]; sum[g + 1] += d[n + 1]; sum[g + 2] += d[n + 2]; sum[g + 3]++;
  }
  for (let p = 0; p < labels.length; p++) {
    const g = labels[p] * 4, n = p * 4, c = sum[g + 3];
    d[n] = sum[g] / c; d[n + 1] = sum[g + 1] / c; d[n + 2] = sum[g + 2] / c;
  }
  ctx.putImageData(img, 0, 0);
}

function applyPosterize() {
  const v = state.look.posterize;
  if (v === 0) return;
  const levels = Math.round(16 - v * 0.14);
  const q = 255 / (levels - 1);
  const img = ctx.getImageData(0, 0, stage.width, stage.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.round(d[i] / q) * q;
    d[i + 1] = Math.round(d[i + 1] / q) * q;
    d[i + 2] = Math.round(d[i + 2] / q) * q;
  }
  ctx.putImageData(img, 0, 0);
}

function render() {
  if (!state.art) return;
  const { look } = state;
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, stage.width, stage.height);
  ctx.drawImage(state.base, 0, 0);
  if (state.photo) drawPhoto(ctx);
  if (look.blur > 0) {
    resample(1 / (1 + look.blur * 0.6), true);
    if (look.blur > 6) resample(0.5, true);
  }
  applyTiltShift();
  applyShapes();
  if (look.pixel > 1) resample(1 / look.pixel, false);
  applyColor();
  applyPosterize();
  applyAberration();
  applyFisheye();
}

async function loadPhoto(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const k = Math.min(1, PHOTO_MAX / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    state.photo = c;
    state.masked = null;
    placeLayer();
    syncPhotoUI();
    selectTab('photo');
    requestRender();
  } finally {
    URL.revokeObjectURL(url);
  }
}

function syncPhotoUI() {
  const has = !!state.photo;
  document.getElementById('photoEmpty').hidden = has;
  document.getElementById('photoControls').hidden = !has;
  const hint = document.getElementById('hint');
  hint.textContent = state.tool === 'smudge' ? (state.smudge.mode === 'marble' ? 'Drag to swirl the colours' : 'Drag to smear the paint') : 'Drag to move · pinch to resize and turn';
  hint.hidden = !has && state.tool !== 'smudge';
  document.querySelectorAll('#shapeSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.shape === state.layer.shape)));
  document.querySelectorAll('#blendSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.blend === state.layer.blend)));
  document.querySelectorAll('#paintSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === state.smudge.mode)));
  document.querySelectorAll('input[data-key]').forEach(inp => {
    const k = inp.dataset.key;
    inp.value = k in state.look ? state.look[k] : k in state.smudge ? state.smudge[k] : state.layer[k];
  });
}

function selectTab(name) {
  document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
  document.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== name; });
  state.tool = name === 'smudge' ? 'smudge' : 'move';
  syncPhotoUI();
}

function rand(min, max) { return Math.round(min + Math.random() * (max - min)); }
function chance(p) { return Math.random() < p; }

function rollDice() {
  state.look = {
    pixel: chance(0.35) ? rand(4, 22) : 1,
    hue: chance(0.6) ? rand(20, 340) : 0,
    sepia: chance(0.3) ? rand(30, 100) : 0,
    saturate: rand(40, 230),
    contrast: rand(75, 170),
    blur: chance(0.15) ? rand(2, 8) : 0,
    aberration: chance(0.4) ? rand(4, 20) : 0,
    fisheye: chance(0.3) ? rand(20, 80) : 0,
    tilt: chance(0.3) ? rand(30, 90) : 0,
    shapes: chance(0.25) ? rand(15, 60) : 0,
    posterize: chance(0.25) ? rand(40, 100) : 0,
  };
  if (state.photo) {
    const blends = ['source-over', 'multiply', 'screen', 'overlay', 'difference'];
    const shapes = ['circle', 'square', 'full'];
    state.layer.blend = blends[rand(0, blends.length - 1)];
    state.layer.shape = shapes[rand(0, shapes.length - 1)];
    state.layer.opacity = rand(55, 100);
  }
  syncPhotoUI();
  requestRender();
}

function reset() {
  state.look = { ...LOOK_DEFAULTS };
  Object.assign(state.layer, PHOTO_DEFAULTS);
  placeLayer();
  syncPhotoUI();
  requestRender();
}

async function save() {
  if (EMBED) {
    parent.postMessage({ type: 'remix', dataUrl: stage.toDataURL('image/jpeg', 0.85) }, location.origin);
    return;
  }
  const blob = await new Promise(r => stage.toBlob(r, 'image/jpeg', 0.9));
  const name = `remix-${ART[state.artIndex].file}`;
  const file = new File([blob], name, { type: 'image/jpeg' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'My remix' }); return; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function baseCtx() {
  return state.base.getContext('2d', { willReadFrequently: true });
}

function pushUndo() {
  state.undo.push({
    pixels: baseCtx().getImageData(0, 0, stage.width, stage.height),
    photo: state.photo,
    layer: { ...state.layer },
  });
  if (state.undo.length > UNDO_MAX) state.undo.shift();
  syncUndo();
}

function undo() {
  const snap = state.undo.pop();
  if (!snap) return;
  baseCtx().putImageData(snap.pixels, 0, 0);
  state.photo = snap.photo;
  Object.assign(state.layer, snap.layer);
  state.masked = null;
  syncPhotoUI();
  syncUndo();
  requestRender();
}

function syncUndo() {
  document.getElementById('undo').disabled = state.undo.length === 0;
}

function clearSmudges() {
  pushUndo();
  const b = baseCtx();
  b.clearRect(0, 0, stage.width, stage.height);
  b.drawImage(state.art, 0, 0);
  requestRender();
}

let stroke = null;

function startStroke(p) {
  pushUndo();
  if (state.photo) {
    drawPhoto(baseCtx());
    state.photo = null;
    state.masked = null;
    syncPhotoUI();
  }
  const d = Math.max(4, Math.round(state.smudge.brush * stage.width / 1000));
  const x = Math.round(p.x - d / 2), y = Math.round(p.y - d / 2);
  stroke = { d, buf: Float32Array.from(baseCtx().getImageData(x, y, d, d).data), last: p };
}

function dab(cx, cy) {
  const { d, buf } = stroke;
  const r = d / 2;
  const x0 = Math.round(cx - r), y0 = Math.round(cy - r);
  const b = baseCtx();
  const img = b.getImageData(x0, y0, d, d);
  const px = img.data;
  const k = state.smudge.strength / 100;
  for (let j = 0; j < d; j++) {
    for (let i = 0; i < d; i++) {
      const dist = Math.hypot(i + 0.5 - r, j + 0.5 - r);
      if (dist > r) continue;
      const n = (j * d + i) * 4;
      if (px[n + 3] === 0 || buf[n + 3] === 0) continue;
      const w = k * (1 - dist / r);
      for (let c = 0; c < 3; c++) {
        const v = px[n + c] + (buf[n + c] - px[n + c]) * w;
        px[n + c] = v;
        buf[n + c] += (v - buf[n + c]) * (1 - k);
      }
    }
  }
  b.putImageData(img, x0, y0);
}

function marbleDab(cx, cy, mx, my) {
  const d = stroke.d;
  const R = Math.round(d * 1.5), lam = d / 4, size = R * 2;
  const x0 = Math.round(cx - R), y0 = Math.round(cy - R);
  const b = baseCtx();
  const img = b.getImageData(x0, y0, size, size);
  const px = img.data;
  const src = new Uint8ClampedArray(px);
  const k = state.smudge.strength / 100 * 1.6;
  const c = lam / (R + lam);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const dist = Math.hypot(i + 0.5 - R, j + 0.5 - R);
      if (dist >= R) continue;
      const n = (j * size + i) * 4;
      if (src[n + 3] === 0) continue;
      const w = k * (lam / (dist + lam) - c) / (1 - c);
      const sx = Math.min(size - 1.001, Math.max(0, i - mx * w));
      const sy = Math.min(size - 1.001, Math.max(0, j - my * w));
      const ix = sx | 0, iy = sy | 0, fx = sx - ix, fy = sy - iy;
      const a = (iy * size + ix) * 4, bb = a + 4, cc = a + size * 4, dd = cc + 4;
      if (src[a + 3] === 0 || src[dd + 3] === 0) continue;
      for (let ch = 0; ch < 3; ch++) {
        const top = src[a + ch] + (src[bb + ch] - src[a + ch]) * fx;
        const bot = src[cc + ch] + (src[dd + ch] - src[cc + ch]) * fx;
        px[n + ch] = top + (bot - top) * fy;
      }
    }
  }
  b.putImageData(img, x0, y0);
}

function moveStroke(p) {
  const { last, d } = stroke;
  const marble = state.smudge.mode === 'marble';
  const step = Math.max(1, d / (marble ? 10 : 6));
  const dist = Math.hypot(p.x - last.x, p.y - last.y);
  const n = Math.floor(dist / step);
  for (let s = 1; s <= n; s++) {
    const t = (s * step) / dist;
    const x = last.x + (p.x - last.x) * t, y = last.y + (p.y - last.y) * t;
    if (marble) marbleDab(x, y, (p.x - last.x) / dist * step, (p.y - last.y) / dist * step);
    else dab(x, y);
  }
  if (n > 0) {
    const t = (n * step) / dist;
    stroke.last = { x: last.x + (p.x - last.x) * t, y: last.y + (p.y - last.y) * t };
  }
  requestRender();
}

const pointers = new Map();
let gesture = null;

function toCanvas(e) {
  const r = stage.getBoundingClientRect();
  return { x: (e.clientX - r.left) * stage.width / r.width, y: (e.clientY - r.top) * stage.height / r.height };
}

function startGesture() {
  const pts = [...pointers.values()];
  const { layer } = state;
  if (pts.length === 1) {
    gesture = { type: 'drag', px: pts[0].x, py: pts[0].y, lx: layer.x, ly: layer.y };
  } else if (pts.length >= 2) {
    const [a, b] = pts;
    gesture = {
      type: 'pinch',
      dist: Math.hypot(b.x - a.x, b.y - a.y) || 1,
      angle: Math.atan2(b.y - a.y, b.x - a.x),
      mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2,
      size: layer.size, rot: layer.rot, lx: layer.x, ly: layer.y,
    };
  }
}

stage.addEventListener('pointerdown', e => {
  if (state.tool === 'smudge') {
    if (stroke) return;
    stage.setPointerCapture(e.pointerId);
    startStroke(toCanvas(e));
    stroke.id = e.pointerId;
    return;
  }
  if (!state.photo) return;
  stage.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, toCanvas(e));
  startGesture();
});

stage.addEventListener('pointermove', e => {
  if (stroke) {
    if (e.pointerId === stroke.id) moveStroke(toCanvas(e));
    return;
  }
  if (!pointers.has(e.pointerId) || !gesture) return;
  pointers.set(e.pointerId, toCanvas(e));
  const pts = [...pointers.values()];
  const { layer } = state;
  if (gesture.type === 'drag' && pts.length === 1) {
    layer.x = gesture.lx + pts[0].x - gesture.px;
    layer.y = gesture.ly + pts[0].y - gesture.py;
  } else if (gesture.type === 'pinch' && pts.length >= 2) {
    const [a, b] = pts;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    layer.size = Math.min(150, Math.max(5, gesture.size * dist / gesture.dist));
    layer.rot = gesture.rot + Math.atan2(b.y - a.y, b.x - a.x) - gesture.angle;
    layer.x = gesture.lx + (a.x + b.x) / 2 - gesture.mx;
    layer.y = gesture.ly + (a.y + b.y) / 2 - gesture.my;
    document.querySelector('input[data-key="size"]').value = layer.size;
  }
  requestRender();
});

function endPointer(e) {
  if (stroke && e.pointerId === stroke.id) stroke = null;
  pointers.delete(e.pointerId);
  gesture = null;
  if (pointers.size) startGesture();
}
stage.addEventListener('pointerup', endPointer);
stage.addEventListener('pointercancel', endPointer);

stage.addEventListener('wheel', e => {
  if (!state.photo || state.tool === 'smudge') return;
  e.preventDefault();
  state.layer.size = Math.min(150, Math.max(5, state.layer.size * (e.deltaY < 0 ? 1.08 : 0.92)));
  document.querySelector('input[data-key="size"]').value = state.layer.size;
  requestRender();
}, { passive: false });

document.querySelectorAll('input[data-key]').forEach(inp => {
  inp.addEventListener('input', () => {
    const k = inp.dataset.key, v = Number(inp.value);
    if (k in state.look) state.look[k] = v;
    else if (k in state.smudge) state.smudge[k] = v;
    else {
      state.layer[k] = v;
      if (k === 'feather') state.masked = null;
    }
    requestRender();
  });
});

document.querySelectorAll('input[data-photo]').forEach(inp => {
  inp.addEventListener('change', () => {
    if (inp.files[0]) loadPhoto(inp.files[0]);
    inp.value = '';
  });
});

document.querySelectorAll('#shapeSeg button').forEach(b => b.addEventListener('click', () => {
  state.layer.shape = b.dataset.shape;
  syncPhotoUI();
  requestRender();
}));
document.querySelectorAll('#blendSeg button').forEach(b => b.addEventListener('click', () => {
  state.layer.blend = b.dataset.blend;
  syncPhotoUI();
  requestRender();
}));
document.querySelectorAll('#paintSeg button').forEach(b => b.addEventListener('click', () => {
  state.smudge.mode = b.dataset.mode;
  syncPhotoUI();
}));
document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => selectTab(b.dataset.tab)));

document.getElementById('removePhoto').addEventListener('click', () => {
  state.photo = null;
  state.masked = null;
  syncPhotoUI();
  requestRender();
});
document.getElementById('dice').addEventListener('click', rollDice);
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('clearSmudge').addEventListener('click', clearSmudges);
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('save').addEventListener('click', save);

const strip = document.getElementById('artStrip');
ART.forEach((a, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', `${a.title} by ${a.artist}`);
  b.innerHTML = `<img src="art/thumbs/${a.file}" alt="" loading="lazy">`;
  b.addEventListener('click', () => selectArt(i));
  strip.appendChild(b);
});

syncPhotoUI();
if (EMBED) {
  document.body.classList.add('embed');
  document.getElementById('save').textContent = 'Send';
  const src = new URL(EMBED_SRC, location.href);
  if (EMBED_SRC && src.origin === location.origin) loadArt(src.href, EMBED_CREDIT);
  else selectArt(0);
} else {
  selectArt(0);
}
