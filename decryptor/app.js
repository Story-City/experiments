// The Decryptor: the letter comes back scrambled. Each rounded swatch points at a colour in it;
// photograph something nearby that matches, and that part of the picture comes back.
// Two camera versions: ?v=chip (colour fills the screen around a chip window) and ?v=strip (colour in the bottom third).

const ART = 'art/maynard.jpg';
// Spots in the 900×628 painting, spread across it (not in a row). Each colour is sampled from the image at its spot,
// and the swatch sits at `at` (as a share of the frame, kept inside the picture), with a dashed lead to the spot.
const SPOTS = [
  { name: 'red', x: 720, y: 570, at: [0.7, 0.22] },
  { name: 'teal', x: 520, y: 500, at: [0.3, 0.72] },
  { name: 'cream', x: 110, y: 130, at: [0.34, 0.4] },
];
const REVEAL_SHARE = 0.2; // radius of each cleared patch, as a share of the image width
const SAMPLE_RADIUS = 10;
// Passing = same colour family. Colours: hue within HUE_RANGE degrees. The one neutral (at most one per puzzle):
// the photo must be neutral too, and close in lightness.
const NEUTRAL_CHROMA = 15;
const HUE_RANGE = 35;
const NEUTRAL_LIGHTNESS_RANGE = 25;
const HISTORY_KEY = 'sc-story-history';
const PUZZLE = { story: 'The Summons', chapter: 'The Hiding Spot', puzzle: 'Decrypt the letter' };
const CARD_SIZE = 1080;
// Pixel size of the scramble. No tile shuffle, so each colour stays under its swatch's lead.
const BLOCK = 30;

const VARIANT = new URLSearchParams(location.search).get('v') === 'strip' ? 'strip' : 'chip';
const $ = (s) => document.querySelector(s);
const stage = $('#stage');
const ctx = stage.getContext('2d', { willReadFrequently: true });
const img = new Image();
let scrambled = null;
let colours = [];
let found = new Set();
let results = []; // per spot: { colour, photo (canvas), score }
let current = null;
let stream = null;

document.querySelectorAll('.ab a').forEach((a) => a.classList.toggle('on', a.dataset.v === VARIANT));

// ---------- colour helpers ----------
const toHex = ([r, g, b]) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
function toLab([r, g, b]) {
  const lin = (v) => { v /= 255; return v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92; };
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
const distance = (a, b) => { const [p, q] = [toLab(a), toLab(b)]; return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
const isLight = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b > 150;
const toLch = (rgb) => { const [L, a, b] = toLab(rgb); return [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360]; };
const hueGap = (h1, h2) => { const d = Math.abs(h1 - h2) % 360; return d > 180 ? 360 - d : d; };

function sameFamily(got, target) {
  const [gL, gC, gH] = toLch(got); const [tL, tC, tH] = toLch(target);
  if (tC < NEUTRAL_CHROMA) return gC < NEUTRAL_CHROMA + 5 && Math.abs(gL - tL) <= NEUTRAL_LIGHTNESS_RANGE;
  return gC >= NEUTRAL_CHROMA * 0.8 && hueGap(gH, tH) <= HUE_RANGE;
}
// Accuracy for bragging: 100% is a perfect match, dropping one point per Lab unit away.
const accuracy = (got, target) => Math.max(0, Math.min(100, Math.round(100 - distance(got, target))));

function average(context, cx, cy, radius) {
  const d = context.getImageData(Math.max(0, cx - radius), Math.max(0, cy - radius), radius * 2, radius * 2).data;
  let r = 0; let g = 0; let b = 0; let n = 0;
  for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n += 1; }
  return [r / n, g / n, b / n];
}

// ---------- the scrambled image ----------
function buildScramble() {
  const W = img.naturalWidth; const H = img.naturalHeight;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  // Heavy pixelation: the colours are all there, but the picture is unreadable.
  const small = document.createElement('canvas'); small.width = Math.ceil(W / BLOCK); small.height = Math.ceil(H / BLOCK);
  small.getContext('2d').drawImage(img, 0, 0, small.width, small.height);
  x.imageSmoothingEnabled = false;
  x.drawImage(small, 0, 0, W, H);
  return c;
}

function draw() {
  const W = img.naturalWidth; const H = img.naturalHeight;
  ctx.drawImage(found.size === SPOTS.length ? img : scrambled, 0, 0);
  // Each matched colour clears a soft patch of the real picture around its spot.
  SPOTS.forEach((s, i) => {
    if (!found.has(i) || found.size === SPOTS.length) return;
    ctx.save();
    ctx.beginPath(); ctx.arc(s.x, s.y, W * REVEAL_SHARE, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(img, 0, 0, W, H);
    ctx.restore();
  });
}

function layout() {
  const easel = $('#easel');
  const box = easel.getBoundingClientRect();
  const frame = stage.getBoundingClientRect();
  const sx = frame.width / img.naturalWidth;
  const ox = frame.left - box.left; const oy = frame.top - box.top;
  const leads = $('#leads'); leads.innerHTML = '';
  const holder = $('#swatches'); holder.innerHTML = '';
  SPOTS.forEach((s, i) => {
    const px = ox + s.x * sx; const py = oy + s.y * sx;
    const bx = box.width * s.at[0]; const by = box.height * s.at[1];
    leads.insertAdjacentHTML('beforeend', `<line x1="${bx}" y1="${by}" x2="${px}" y2="${py}"/><circle cx="${px}" cy="${py}" r="4"/>`);
    const b = document.createElement('button');
    b.className = `swatch${found.has(i) ? ' found' : ''}`;
    b.style.left = `${bx}px`; b.style.top = `${by}px`;
    b.style.setProperty('--c', toHex(colours[i]));
    b.setAttribute('aria-label', `Find ${s.name}`);
    b.addEventListener('click', () => openCamera(i));
    holder.append(b);
  });
  $('#pips').innerHTML = SPOTS.map((s, i) => `<i class="${found.has(i) ? 'on' : ''}" style="--pip:${toHex(colours[i])}"></i>`).join('');
}

function tip(text, nope) {
  $('#tipText').textContent = text;
  const t = $('#tip');
  t.classList.remove('nope');
  if (nope) { void t.offsetWidth; t.classList.add('nope'); }
}

// ---------- camera ----------
async function openCamera(i) {
  if (found.has(i)) return;
  current = i;
  const target = colours[i];
  const cam = $('#s-camera');
  cam.className = `camera v-${VARIANT}`;
  cam.style.setProperty('--target', toHex(target));
  cam.style.setProperty('--on-target', isLight(target) ? '#170c35' : '#fff');
  $('#chipFrame').hidden = VARIANT !== 'chip';
  $('#strip').hidden = VARIANT !== 'strip';
  $('#camHint').textContent = VARIANT === 'chip' ? 'Fill the window with this colour' : 'Find this colour near you';
  cam.hidden = false;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    $('#video').srcObject = stream;
    $('#video').hidden = false;
    $('#fake').hidden = true;
  } catch {
    // No camera (desktop without one, or a headless test): a dark stand-in, and the test button.
    $('#video').hidden = true;
    const f = $('#fake'); f.width = 300; f.height = 600; f.hidden = false;
    const fx = f.getContext('2d'); fx.fillStyle = '#2a2a2a'; fx.fillRect(0, 0, 300, 600);
    $('#camHint').textContent = 'No camera here. Use the test button.';
  }
}

function closeCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
  $('#s-camera').hidden = true;
}

// What's in the window (A) or the middle of the camera view (B): its average colour,
// plus a wide crop of the photo for the brag card.
function capture() {
  const v = $('#video');
  if (!v.videoWidth) return null;
  const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(v, 0, 0);
  const cy = VARIANT === 'strip' ? c.height * 0.33 : c.height / 2;
  const colour = average(x, Math.round(c.width / 2), Math.round(cy), Math.round(Math.min(c.width, c.height) * 0.12));
  const photo = document.createElement('canvas'); photo.width = c.width; photo.height = Math.round(c.width / 3);
  photo.getContext('2d').drawImage(c, 0, Math.max(0, cy - photo.height / 2), c.width, photo.height, 0, 0, photo.width, photo.height);
  return { colour, photo };
}

// No camera: a made-up photo a little off the target, so the score still varies.
function fakeCapture(target) {
  const nudge = () => (Math.random() - 0.5) * 40;
  const colour = target.map((v) => Math.max(0, Math.min(255, v + nudge())));
  const photo = document.createElement('canvas'); photo.width = 600; photo.height = 200;
  const x = photo.getContext('2d');
  x.fillStyle = toHex(colour); x.fillRect(0, 0, 600, 200);
  for (let i = 0; i < 900; i += 1) {
    const shade = colour.map((v) => Math.max(0, Math.min(255, v + (Math.random() - 0.5) * 50)));
    x.fillStyle = toHex(shade); x.fillRect(Math.random() * 600, Math.random() * 200, 14, 14);
  }
  return { colour, photo };
}

function settle(got) {
  const flash = $('#flash'); flash.hidden = false;
  setTimeout(() => { flash.hidden = true; }, 350);
  closeCamera();
  if (!got) { tip('The camera did not catch that. Try again.', true); return; }
  const target = colours[current];
  const score = accuracy(got.colour, target);
  if (!sameFamily(got.colour, target)) {
    tip(`Not quite: ${score}% match. Find something in the same colour family and try again.`, true);
    return;
  }
  results[current] = { ...got, score };
  found.add(current);
  draw(); layout();
  if (found.size === SPOTS.length) {
    tip(`All three! The letter is back. Accuracy: ${overall()}%.`);
    $('#done').hidden = false;
    saveToHistory();
  } else {
    tip(`Got it: ${score}% match. ${SPOTS.length - found.size} to go.`);
  }
}

const overall = () => Math.round(results.reduce((sum, r) => sum + r.score, 0) / SPOTS.length);

// ---------- story history ----------
// Prototype only: kept in this browser. In the app this belongs with the player's story progress
// (Josiah's SC-2222 saved puzzle responses).
function readHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}
function saveToHistory() {
  const entry = { ...PUZZLE, score: overall(), scores: results.map((r) => r.score), at: new Date().toISOString() };
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...readHistory()].slice(0, 20))); } catch { /* private window */ }
}
function showHistory() {
  const mine = readHistory().filter((h) => h.story === PUZZLE.story && h.puzzle === PUZZLE.puzzle);
  if (!mine.length) { $('#history').innerHTML = ''; return; }
  const best = Math.max(...mine.map((h) => h.score));
  const rows = mine.slice(0, 5).map((h) => `<li><span>${new Date(h.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><b>${h.score}%</b></li>`).join('');
  $('#history').innerHTML = `<h3>Saved to your story history</h3><p>Best on this puzzle: <b>${best}%</b></p><ul>${rows}</ul>`;
}

// ---------- brag card ----------
// A square in three rows. Each row: the photo they took, with the colour they were matching
// as a swatch on the left and their accuracy on the right.
function roundRect(x, l, t, w, h, r) {
  x.beginPath(); x.moveTo(l + r, t); x.arcTo(l + w, t, l + w, t + h, r); x.arcTo(l + w, t + h, l, t + h, r);
  x.arcTo(l, t + h, l, t, r); x.arcTo(l, t, l + w, t, r); x.closePath();
}
function drawCard() {
  const card = $('#card'); const x = card.getContext('2d');
  const S = CARD_SIZE; const rowH = S / SPOTS.length;
  x.fillStyle = '#170c35'; x.fillRect(0, 0, S, S);
  results.forEach((r, i) => {
    const top = i * rowH;
    // Photo fills the row (cover crop).
    const p = r.photo; const scale = Math.max(S / p.width, rowH / p.height);
    const w = p.width * scale; const h = p.height * scale;
    x.save(); x.beginPath(); x.rect(0, top, S, rowH); x.clip();
    x.drawImage(p, (S - w) / 2, top + (rowH - h) / 2, w, h);
    x.restore();
    // Target swatch, same rounded square as the puzzle.
    const sw = rowH * 0.62; const sl = rowH * 0.19; const st = top + (rowH - sw) / 2;
    x.save(); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 24; x.shadowOffsetY = 8;
    roundRect(x, sl, st, sw, sw, sw * 0.27); x.fillStyle = toHex(colours[i]); x.fill(); x.restore();
    roundRect(x, sl, st, sw, sw, sw * 0.27); x.lineWidth = 10; x.strokeStyle = '#fff'; x.stroke();
    // Score, with a soft shadow so it reads on any photo.
    x.save();
    x.font = '800 48px Figtree, system-ui, sans-serif';
    x.textAlign = 'right'; x.textBaseline = 'middle';
    x.shadowColor = 'rgba(0,0,0,.65)'; x.shadowBlur = 18; x.shadowOffsetY = 3;
    x.fillStyle = '#fff'; x.fillText(`${r.score}%`, S - 56, top + rowH / 2 + 2);
    x.restore();
    if (i) { x.fillStyle = '#fff'; x.fillRect(0, top - 3, S, 6); }
  });
  // Small footer tag on the bottom row: story and overall score.
  const tag = `Story City · ${PUZZLE.story} · ${overall()}%`;
  x.font = '700 34px Figtree, system-ui, sans-serif';
  const tw = x.measureText(tag).width + 40;
  roundRect(x, S - tw - 24, S - 72, tw, 52, 26); x.fillStyle = 'rgba(11,9,22,.72)'; x.fill();
  x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.fillText(tag, S - tw - 4, S - 45);
}

function showCard() {
  drawCard();
  $('#cardTotal').textContent = `${overall()}% accurate`;
  showHistory();
  $('#s-puzzle').hidden = true;
  $('#s-card').hidden = false;
}

async function shareCard() {
  const blob = await new Promise((done) => $('#card').toBlob(done, 'image/png'));
  const file = new File([blob], 'story-city-colour-match.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'My Story City colour match' }); } catch { /* cancelled */ }
    return;
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

$('#shutter').addEventListener('click', () => settle(capture()));
$('#fakeMatch').addEventListener('click', () => settle(fakeCapture(colours[current])));
$('#camBack').addEventListener('click', closeCamera);
$('#restart').addEventListener('click', () => { found = new Set(); results = []; $('#done').hidden = true; tip('Tap a colour. Find something nearby that matches it, and snap it.'); draw(); layout(); });
$('#done').addEventListener('click', showCard);
$('#share').addEventListener('click', shareCard);
$('#cardBack').addEventListener('click', () => { $('#s-card').hidden = true; $('#s-puzzle').hidden = false; requestAnimationFrame(layout); });
addEventListener('resize', () => img.naturalWidth && layout());

img.onload = () => {
  stage.width = img.naturalWidth; stage.height = img.naturalHeight;
  const probe = document.createElement('canvas'); probe.width = img.naturalWidth; probe.height = img.naturalHeight;
  const px = probe.getContext('2d', { willReadFrequently: true }); px.drawImage(img, 0, 0);
  colours = SPOTS.map((s) => average(px, s.x, s.y, SAMPLE_RADIUS));
  scrambled = buildScramble();
  draw();
  requestAnimationFrame(layout);
};
img.src = ART;
