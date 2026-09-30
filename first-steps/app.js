const V = new URL(import.meta.url).search;
const { createGlitches } = await import(`./glitch.js${V}`);
const { VERSIONS } = await import(`./story.js${V}`);
const { createMap } = await import(`./map.js${V}`);
const SHARED = {};
const SHARED_CHOICES = {};
const SHARED_ACTIONS = {};
const SHARED_WALKS = {};
let version = VERSIONS.summons;
let STORY = { start: 'intro' };
let CAST = version.cast;
let CHAPTERS = version.chapters;

const $ = (id) => document.getElementById(id);
const phone = $('phone');
const thread = $('thread');
const choicesEl = $('choices');
const field = $('field');
const sendBtn = $('sendBtn');
const speedBtn = $('speedBtn');

const SPEEDS = [1, 2, 4];
const ABORT = Symbol('abort');
let speed = 1;
let gen = 0;
let pending = [];
let lastSide = null;
let lastRow = null;
let lastReceipt = null;
let activeThread = null;
const canvases = {};
const fx = createGlitches({ phone, thread, sleep: (ms) => wait(ms, false) });
const map = createMap({ phone, getSpeed: () => speed, camera: (src, label) => fakeCamera(src, label) });

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function wait(ms, skippable = true) {
  const myGen = gen;
  return new Promise((resolve, reject) => {
    const entry = { done: () => { clearTimeout(t); myGen === gen ? resolve() : reject(ABORT); }, skippable };
    const t = setTimeout(() => {
      pending = pending.filter((p) => p !== entry);
      entry.done();
    }, ms / speed);
    pending.push(entry);
  });
}

function skip() {
  const now = pending.filter((p) => p.skippable);
  pending = pending.filter((p) => !p.skippable);
  now.forEach((p) => p.done());
}

function abortAll() {
  gen++;
  const all = pending;
  pending = [];
  all.forEach((p) => p.done());
}

let stuck = true;
let userScrolling = false;
let userScrollTimer;

let scrollQueued = false;

function scrollDown() {
  if (!stuck || scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    scrollQueued = false;
    if (stuck) thread.scrollTop = thread.scrollHeight;
  });
}

function markUserScroll() {
  userScrolling = true;
  clearTimeout(userScrollTimer);
  userScrollTimer = setTimeout(() => { userScrolling = false; }, 250);
}

['wheel', 'touchmove', 'keydown'].forEach((ev) => thread.addEventListener(ev, markUserScroll, { passive: true }));
thread.addEventListener('scroll', () => {
  if (thread.scrollHeight - thread.scrollTop - thread.clientHeight < 48) stuck = true;
  else if (userScrolling) stuck = false;
});
new ResizeObserver(scrollDown).observe(thread);
new MutationObserver(scrollDown).observe(thread, { childList: true, subtree: true, characterData: true });

function setThread(key) {
  activeThread = key;
  const who = CAST[key];
  $('headAvatar').src = who.avatar;
  $('headName').textContent = who.name;
  phone.classList.toggle('hacked', !!who.hacker);
  setStatus();
}

function setStatus(typing = false) {
  const el = $('headStatus');
  el.textContent = typing ? 'typing…' : CAST[activeThread].status;
  el.classList.toggle('typing', typing);
}

function glass(el) {
  el.classList.add('glass');
  return el;
}

function initialsAvatar(letters) {
  const size = 96;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const disc = (x, y, r, text) => {
    const g = ctx.createLinearGradient(0, y - r, 0, y + r);
    g.addColorStop(0, cssVar('--avatar-top') || cssVar('--text-muted'));
    g.addColorStop(1, cssVar('--avatar-bottom') || cssVar('--text-muted'));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = cssVar('--avatar-text') || cssVar('--text');
    ctx.font = `600 ${Math.round(r * 0.95)}px -apple-system, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + r * 0.05);
  };
  if (letters.length === 1) {
    disc(48, 48, 48, letters[0]);
  } else {
    disc(34, 36, 30, letters[0]);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(62, 60, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    disc(62, 60, 30, letters[1]);
  }
  return c.toDataURL();
}

Object.values(VERSIONS).forEach((v) => Object.values(v.cast).forEach((who) => {
  if (!who.avatar) who.avatar = initialsAvatar(who.initials);
}));

function addRow(side, from, content) {
  const row = document.createElement('div');
  row.className = `row ${side}`;
  const key = side === 'them' ? `them:${from}` : 'me';
  if (lastSide === key && lastRow) lastRow.classList.remove('last');
  else if (lastSide) row.classList.add('gap');
  if (side === 'them' && lastSide !== key && CAST[activeThread].group) {
    row.label = document.createElement('div');
    row.label.className = 'sender';
    row.label.textContent = CAST[from].name;
    thread.append(row.label);
  }
  row.classList.add('last');
  if (side === 'them') {
    const mini = document.createElement('img');
    mini.className = 'mini';
    mini.src = CAST[from].avatar;
    mini.alt = '';
    row.append(mini);
  }
  row.append(content);
  thread.append(row);
  lastSide = key;
  lastRow = row;
  scrollDown();
  return row;
}

function addSystem(text, cls = '') {
  const el = glass(document.createElement('div'));
  el.className += ` system ${cls}`;
  el.textContent = text;
  thread.append(el);
  lastSide = null;
  lastRow = null;
  scrollDown();
}

function markRead() {
  if (lastReceipt && lastReceipt.dataset.state === 'delivered') {
    const t = new Date();
    lastReceipt.textContent = `Read ${t.getHours() % 12 || 12}:${String(t.getMinutes()).padStart(2, '0')}`;
    lastReceipt.dataset.state = 'read';
  }
}

async function showTyping(from, ms) {
  const bubble = glass(document.createElement('div'));
  bubble.className += ' bubble typing-bubble';
  bubble.innerHTML = '<i></i><i></i><i></i>';
  const prevSide = lastSide;
  const prevRow = lastRow;
  const row = addRow('them', from, bubble);
  setStatus(true);
  markRead();
  try {
    await wait(ms);
  } finally {
    row.remove();
    row.label?.remove();
    lastSide = prevSide;
    lastRow = prevRow;
    if (prevRow) prevRow.classList.add('last');
    setStatus(false);
  }
}

function typingTime(text) {
  return Math.min(2600, Math.max(700, 350 + text.length * 26));
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawPixelated(canvas, img, size) {
  const ctx = canvas.getContext('2d');
  const w = Math.max(1, Math.round(canvas.width / size));
  const h = Math.max(1, Math.round(canvas.height / size));
  const tmp = document.createElement('canvas');
  tmp.width = w;
  tmp.height = h;
  tmp.getContext('2d').drawImage(img, 0, 0, w, h);
  ctx.imageSmoothingEnabled = size <= 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height);
}

function scribble(canvas, count) {
  const ctx = canvas.getContext('2d');
  const colors = [cssVar('--glitch-a'), cssVar('--glitch-b'), cssVar('--hacker')];
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[i % colors.length];
    const bw = 8 + Math.random() * 60;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, bw, 4 + Math.random() * 14);
  }
}

function drawCorrupt(canvas, img) {
  drawPixelated(canvas, img, 22);
  scribble(canvas, 18);
}

function drawRemix(canvas, img, t) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = data.data;
  const levels = 4;
  const step = 255 / (levels - 1);
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    d[i] = Math.round(b / step) * step;
    d[i + 1] = Math.round(r / step) * step;
    d[i + 2] = Math.round(g / step) * step;
  }
  ctx.putImageData(data, 0, 0);
  const slices = 10;
  for (let s = 0; s < slices; s++) {
    const y = Math.random() * canvas.height;
    const h = 4 + Math.random() * 20;
    const dx = (Math.random() - 0.5) * 40 * t;
    ctx.drawImage(canvas, 0, y, canvas.width, h, dx, y, canvas.width, h);
  }
  ctx.save();
  ctx.translate(canvas.width * 0.5, canvas.height * 0.82);
  ctx.rotate(-0.18);
  ctx.font = `900 ${Math.round(canvas.width * 0.16)}px ui-monospace, Menlo, monospace`;
  ctx.textAlign = 'center';
  ctx.lineWidth = 6;
  ctx.strokeStyle = cssVar('--glitch-ground');
  ctx.strokeText('crisp-E', 0, 0);
  ctx.fillStyle = cssVar('--hacker');
  ctx.fillText('crisp-E', 0, 0);
  ctx.restore();
}

async function addImage(beat) {
  const img = await loadImage(beat.image);
  const canvas = document.createElement('canvas');
  canvas.width = 440;
  canvas.height = Math.round(440 * (img.height / img.width));
  canvas.getContext('2d', { willReadFrequently: true });
  if (beat.effect === 'corrupt') drawCorrupt(canvas, img);
  else drawPixelated(canvas, img, 1);
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', beat.alt);
  if (beat.id) canvases[beat.id] = { canvas, img };
  const bubble = glass(document.createElement('div'));
  bubble.className += ` bubble media from-${beat.from}`;
  bubble.append(canvas);
  addRow('them', beat.from, bubble);
}

async function runEffect(action) {
  const target = canvases[action.target];
  if (!target) {
    console.warn(`No image with id "${action.target}" for ${action.effect}`);
    return;
  }
  const { canvas, img } = target;
  userScrolling = false;
  canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await wait(400, false);
  if (action.effect === 'restore') {
    for (const size of [22, 16, 12, 8, 5, 3, 2, 1]) {
      drawPixelated(canvas, img, size);
      if (size > 5) scribble(canvas, Math.round(size / 2));
      await wait(170, false);
    }
    canvas.setAttribute('aria-label', action.alt);
    addSystem('Node transmitted to S.A.D. server');
  } else {
    for (let i = 0; i < 7; i++) {
      drawRemix(canvas, img, 1 - i / 7);
      await wait(150, false);
    }
    canvas.setAttribute('aria-label', action.alt);
    addSystem('Node remixed · original overwritten');
  }
  await wait(700);
}

function openRemix(action) {
  const target = canvases[action.target];
  const sheet = $('remixSheet');
  const frame = $('remixFrame');
  const myGen = gen;
  $('remixTitle').textContent = action.title;
  const params = new URLSearchParams({ embed: '1', src: target.img.src, credit: action.credit });
  frame.src = `../image-remix/?${params}`;
  sheet.hidden = false;
  return new Promise((resolve, reject) => {
    const close = (result) => {
      window.removeEventListener('message', onMessage);
      $('remixClose').removeEventListener('click', onCancel);
      pending = pending.filter((p) => p !== entry);
      sheet.hidden = true;
      frame.src = 'about:blank';
      result === ABORT ? reject(ABORT) : resolve(result);
    };
    const onMessage = (e) => {
      if (e.origin !== location.origin || e.source !== frame.contentWindow) return;
      if (e.data?.type === 'remix' && typeof e.data.dataUrl === 'string') close(e.data.dataUrl);
    };
    const onCancel = () => close(null);
    const entry = { done: () => close(myGen === gen ? null : ABORT), skippable: false };
    pending.push(entry);
    window.addEventListener('message', onMessage);
    $('remixClose').addEventListener('click', onCancel);
  });
}

// Real photos the pretend camera "takes" for each colour (drawings fill any gaps).
const SNAP_PHOTOS = { yellow: 'img/snap-yellow.jpg', green: 'img/snap-green.jpg', orange: 'img/snap-orange.jpg' };

const DECRYPT_STEPS = [22, 14, 9, 5, 3, 2, 1];
const DECRYPT_MODES = {
  tap: { cols: 3, rows: 4 },
  photo: {
    cols: 1,
    rows: 3,
    targets: [
      { name: 'yellow', hue: 52, token: '--target-yellow' },
      { name: 'green', hue: 110, token: '--target-green' },
      { name: 'orange', hue: 28, token: '--target-orange' },
    ],
  },
};

function drawCell(ctx, img, col, row, size, cw, ch) {
  const x = col * cw;
  const y = row * ch;
  const sx = (x / ctx.canvas.width) * img.width;
  const sy = (y / ctx.canvas.height) * img.height;
  const sw = (cw / ctx.canvas.width) * img.width;
  const sh = (ch / ctx.canvas.height) * img.height;
  if (size <= 1) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, cw, ch);
    return;
  }
  const w = Math.max(1, Math.round(cw / size));
  const h = Math.max(1, Math.round(ch / size));
  const tmp = document.createElement('canvas');
  tmp.width = w;
  tmp.height = h;
  tmp.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, 0, 0, w, h, x, y, cw, ch);
  if (size > 6) {
    const colors = [cssVar('--glitch-a'), cssVar('--glitch-b'), cssVar('--hacker')];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(x + Math.random() * cw, y + Math.random() * ch, 6 + Math.random() * 30, 3 + Math.random() * 8);
    }
  }
}

function averageColor(img) {
  const c = document.createElement('canvas');
  c.width = c.height = 24;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  const s = Math.min(img.width, img.height) * 0.5;
  ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 24, 24);
  const d = ctx.getImageData(0, 0, 24, 24).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
  const n = d.length / 4;
  r /= n; g /= n; b /= n;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0;
  if (max !== min) {
    if (max === r) hue = ((g - b) / (max - min)) * 60;
    else if (max === g) hue = (2 + (b - r) / (max - min)) * 60;
    else hue = (4 + (r - g) / (max - min)) * 60;
  }
  return { css: `rgb(${r | 0}, ${g | 0}, ${b | 0})`, hue: (hue + 360) % 360, sat: max ? (max - min) / max : 0 };
}

function hueMatches(color, target) {
  const d = Math.abs(color.hue - target.hue);
  return color.sat > 0.18 && Math.min(d, 360 - d) <= 35;
}

function openDecrypt(action) {
  const { img } = canvases[action.target];
  const sheet = $('decryptSheet');
  const canvas = $('decryptCanvas');
  const hint = $('decryptHint');
  const stageEl = $('decryptStage');
  const fileInput = $('decryptFile');
  const myGen = gen;
  canvas.width = 600;
  canvas.height = Math.round(600 * (img.height / img.width));
  const ctx = canvas.getContext('2d');
  let mode, cw, ch, total, state, cleared, snapFor, snaps = [], shooting = false;

  const showProgress = () => { hint.textContent = `${cleared}/${total} pieces restored`; };

  async function decryptCell(i) {
    const col = i % mode.cols;
    const row = Math.floor(i / mode.cols);
    state[i] = 'working';
    for (const size of DECRYPT_STEPS.slice(1)) {
      drawCell(ctx, img, col, row, size, cw, ch);
      await new Promise((r) => setTimeout(r, 55));
    }
    state[i] = 'clear';
    cleared++;
    showProgress();
    if (cleared === total) {
      hint.textContent = 'Restored!';
      setTimeout(() => close(true), 800);
    }
  }

  function setup(name) {
    mode = DECRYPT_MODES[name];
    cw = canvas.width / mode.cols;
    ch = canvas.height / mode.rows;
    total = mode.cols * mode.rows;
    state = Array(total).fill('locked');
    cleared = 0;
    for (let i = 0; i < total; i++) drawCell(ctx, img, i % mode.cols, Math.floor(i / mode.cols), mode.targets ? 9 : DECRYPT_STEPS[0], cw, ch);
    snaps.forEach((el) => el.remove());
    // Photo mode: one coloured square per scrambled strip, sitting on the image.
    // Tap a square, photograph something that colour, and the square fills with
    // your photo while its strip of the picture clears.
    snaps = (mode.targets || []).map((t, i) => {
      const b = document.createElement('button');
      b.className = 'snap';
      b.style.setProperty('--snap', `var(${t.token})`);
      b.innerHTML = '<span class="snap-fill"></span><span class="snap-cam">📷</span><span class="snap-text"></span>';
      b.querySelector('.snap-text').textContent = t.name;
      b.setAttribute('aria-label', `Photograph something ${t.name}`);
      b.addEventListener('click', async () => {
        if (state[i] !== 'locked' || shooting) return;
        shooting = true;
        const src = await fakeCamera(SNAP_PHOTOS[t.name] || `img/snap-${t.name}.svg`, `Pointing at something ${t.name}…`);
        shooting = false;
        if (state[i] === 'locked' && !sheet.hidden) fillSnap(i, src);
      });
      stageEl.append(b);
      return b;
    });
    requestAnimationFrame(placeSnaps);
    document.querySelectorAll('#decryptModes button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === name)));
    showProgress();
  }

  const onTap = (e) => {
    if (mode.targets) return;
    const r = canvas.getBoundingClientRect();
    const col = Math.min(mode.cols - 1, Math.floor(((e.clientX - r.left) / r.width) * mode.cols));
    const row = Math.min(mode.rows - 1, Math.floor(((e.clientY - r.top) / r.height) * mode.rows));
    const i = row * mode.cols + col;
    if (state[i] === 'locked') decryptCell(i);
  };

  const SNAP_X = [0.24, 0.76, 0.5];
  function placeSnaps() {
    const cr = canvas.getBoundingClientRect();
    const sr = stageEl.getBoundingClientRect();
    snaps.forEach((b, i) => {
      b.style.left = `${cr.left - sr.left + cr.width * SNAP_X[i % SNAP_X.length]}px`;
      b.style.top = `${cr.top - sr.top + cr.height * ((i + 0.5) / mode.rows)}px`;
    });
  }

  function fillSnap(i, src) {
    const btn = snaps[i];
    btn.querySelector('.snap-fill').style.backgroundImage = `url("${src}")`;
    btn.classList.remove('miss');
    btn.classList.add('filled');
    btn.querySelector('.snap-text').textContent = '✓';
    decryptCell(i);
  }

  function thumb(img) {
    const c = document.createElement('canvas');
    c.width = c.height = 120;
    const s = Math.min(img.width, img.height);
    c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 120, 120);
    return c.toDataURL('image/jpeg', 0.8);
  }

  const onPhoto = async () => {
    const file = fileInput.files[0];
    const i = snapFor;
    if (!file || i == null || state[i] !== 'locked') return;
    const url = URL.createObjectURL(file);
    try {
      const photo = await loadImage(url);
      const color = averageColor(photo);
      const target = mode.targets[i];
      if (hueMatches(color, target)) fillSnap(i, thumb(photo));
      else {
        const btn = snaps[i];
        btn.classList.add('miss');
        btn.querySelector('.snap-text').textContent = `not ${target.name} enough`;
      }
    } finally {
      URL.revokeObjectURL(url);
    }
  };


  const onMode = (e) => {
    const name = e.target.closest('button')?.dataset.mode;
    if (name && cleared < total) setup(name);
  };

  let resolveFn, rejectFn, entry;
  function close(result) {
    canvas.removeEventListener('pointerdown', onTap);
    fileInput.removeEventListener('change', onPhoto);
    $('decryptModes').removeEventListener('click', onMode);
    $('decryptClose').removeEventListener('click', onCancel);
    removeEventListener('resize', placeSnaps);
    snaps.forEach((el) => el.remove());
    pending = pending.filter((p) => p !== entry);
    sheet.hidden = true;
    result === ABORT ? rejectFn(ABORT) : resolveFn(result);
  }
  const onCancel = () => close(null);

  setup(action.mode || 'tap');
  $('decryptTitle').textContent = action.title;
  sheet.hidden = false;
  return new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
    entry = { done: () => close(myGen === gen ? null : ABORT), skippable: false };
    pending.push(entry);
    canvas.addEventListener('pointerdown', onTap);
    fileInput.addEventListener('change', onPhoto);
    $('decryptModes').addEventListener('click', onMode);
    $('decryptClose').addEventListener('click', onCancel);
    addEventListener('resize', placeSnaps);
  });
}

async function overwriteNode(id, src, alt) {
  const { canvas } = canvases[id];
  const img = await loadImage(src);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  canvas.setAttribute('aria-label', alt);
  canvases[id].img = img;
}

async function sendImage(src, alt) {
  const img = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = 440;
  canvas.height = Math.round(440 * (img.height / img.width));
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', alt);
  const bubble = glass(document.createElement('div'));
  bubble.className += ' bubble media';
  bubble.append(canvas);
  if (lastReceipt) lastReceipt.remove();
  addRow('me', null, bubble);
  lastReceipt = document.createElement('div');
  lastReceipt.className = 'receipt';
  lastReceipt.textContent = 'Delivered';
  lastReceipt.dataset.state = 'delivered';
  thread.append(lastReceipt);
  await wait(900);
}

async function flicker(label) {
  const el = $('headFlicker');
  el.textContent = label;
  try {
    for (const on of [true, false, true, false, true, false]) {
      el.hidden = !on;
      await wait(on ? 90 : 60, false);
    }
  } finally {
    el.hidden = true;
  }
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function clearThread() {
  thread.innerHTML = '';
  lastSide = null;
  lastRow = null;
  lastReceipt = null;
}

async function glitch(kind, clear) {
  const onDark = clear ? clearThread : undefined;
  if (reducedMotion.matches) {
    onDark?.();
    return wait(300);
  }
  if (kind === 'hack') return fx.hack(onDark);
  if (kind === 'quiet') return fx.quiet(onDark);
  return fx.flicker();
}

function addHistory(items) {
  for (const item of items) {
    if (item.system) {
      addSystem(item.system);
      continue;
    }
    const bubble = glass(document.createElement('div'));
    bubble.className += ' bubble';
    bubble.textContent = item.text;
    if (item.from === 'me') addRow('me', null, bubble);
    else addRow('them', item.from, bubble);
  }
  thread.querySelectorAll('.bubble, .system').forEach((el) => { el.style.animation = 'none'; });
}

async function takeOver(key, style) {
  setThread(key);
  if (reducedMotion.matches) return;
  const who = CAST[key];
  await Promise.all([
    fx.scramble($('headName'), who.name),
    fx.scramble($('headStatus'), who.status),
    style === 'loud' ? fx.rgb() : null,
  ]);
}

function expand(beats) {
  return beats.flatMap((b) => (b.ref ? SHARED[b.ref] : [b]));
}

async function runBeat(beat) {
  if (beat.glitch) return glitch(beat.glitch, beat.clear);
  if (beat.typing) return showTyping(beat.typing, beat.ms);
  if (beat.system) {
    addSystem(beat.system);
    return wait(700);
  }
  if (beat.thread) {
    if (beat.takeover) await takeOver(beat.thread, beat.takeover);
    else setThread(beat.thread);
    return wait(300);
  }
  if (beat.flicker) return flicker(beat.flicker);
  if (beat.hesitate) {
    await wait(500);
    await showTyping(beat.hesitate, 1400);
    return wait(900);
  }
  await wait(lastSide && lastSide.startsWith('them') ? 280 : 650);
  if (beat.image) {
    await showTyping(beat.from, 1100);
    await addImage(beat);
    return wait(500);
  }
  const text = typeof beat.text === 'function' ? beat.text(player) : beat.text;
  await showTyping(beat.from, typingTime(text));
  const bubble = glass(document.createElement('div'));
  bubble.className += ` bubble from-${beat.from}`;
  bubble.textContent = text;
  if (beat.from === 'knight') scrapEdges(bubble);
  if (beat.cut) bubble.classList.add('cut');
  addRow('them', beat.from, bubble);
}

const player = { replySeconds: 0 };
const val = (v) => (typeof v === 'function' ? v(player) : v);

function offer(options) {
  choicesEl.innerHTML = '';
  const shownAt = performance.now();
  return new Promise((resolve, reject) => {
    const entry = { done: () => reject(ABORT), skippable: false };
    pending.push(entry);
    options.forEach((opt, i) => {
      const b = glass(document.createElement('button'));
      b.className += ` choice${opt.kind ? ' action' : ''}`;
      b.style.animationDelay = `${i * 70}ms`;
      b.textContent = opt.text;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        player.replySeconds = Math.max(1, Math.round((performance.now() - shownAt) / 1000));
        choicesEl.innerHTML = '';
        pending = pending.filter((p) => p !== entry);
        resolve(opt);
      });
      choicesEl.append(b);
    });
  });
}

async function typeAndSend(text) {
  field.innerHTML = '';
  const span = document.createElement('span');
  const caret = document.createElement('span');
  caret.className = 'caret';
  field.append(span, caret);
  for (const ch of text) {
    span.textContent += ch;
    await wait(ch === ' ' ? 45 : 28 + Math.random() * 55, false);
  }
  sendBtn.disabled = false;
  await wait(380, false);
  sendBtn.classList.add('pulse');
  await wait(120, false);
  sendBtn.classList.remove('pulse');
  sendBtn.disabled = true;
  field.innerHTML = '<span class="placeholder">Message</span>';

  const bubble = glass(document.createElement('div'));
  bubble.className += ' bubble';
  bubble.textContent = text;
  if (lastReceipt) lastReceipt.remove();
  addRow('me', null, bubble);
  lastReceipt = document.createElement('div');
  lastReceipt.className = 'receipt';
  lastReceipt.textContent = 'Delivered';
  lastReceipt.dataset.state = 'delivered';
  thread.append(lastReceipt);
  scrollDown();
}

async function walkTo(walk) {
  const card = glass(document.createElement('div'));
  card.className += ' walk-card';
  card.innerHTML = `
    <div class="pin"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg></div>
    <div><div class="label">Walk to</div><div class="place"></div><div class="dist"></div></div>`;
  card.querySelector('.place').textContent = walk.place;
  const dist = card.querySelector('.dist');
  thread.append(card);
  lastSide = null;
  lastRow = null;
  scrollDown();
  const total = 240;
  for (let m = total; m >= 0; m -= 20) {
    dist.textContent = m ? `${m} m away` : 'You’ve arrived';
    await wait(180);
  }
  addSystem(`📍 ${walk.place}`, 'arrive');
  await wait(900);
}

async function play(id) {
  const ch = CHAPTERS[id];
  if (ch.thread) setThread(ch.thread);
  if (ch.history) addHistory(ch.history);
  for (const beat of expand(ch.beats || [])) await runBeat(beat);

  if (ch.next) return play(ch.next);
  if (ch.end) {
    await wait(600);
    showEnd();
    return;
  }
  if (ch.step) {
    await runStep(ch.step);
    return play(ch.step.to);
  }
  if (ch.choices) {
    const options = typeof ch.choices === 'string' ? SHARED_CHOICES[ch.choices] : ch.choices;
    const pick = await offer(options);
    if (pick.set) Object.assign(player, pick.set);
    await typeAndSend(pick.text);
    return play(pick.to);
  }
  if (ch.walk) {
    const walk = typeof ch.walk === 'string' ? SHARED_WALKS[ch.walk] : ch.walk;
    await offer([{ ...walk, kind: 'action' }]);
    await walkTo(walk);
    return play(walk.to);
  }
  if (ch.action) {
    const action = typeof ch.action === 'string' ? SHARED_ACTIONS[ch.action] : ch.action;
    if (action.game === 'jigsaw') {
      let solved = null;
      while (!solved) {
        await offer([{ ...action, kind: 'action' }]);
        solved = await tracked(openJigsaw(action), closeJigsaw);
      }
      addSystem(action.done);
      await wait(500);
      await addImage({ from: version.guide, image: action.image, alt: action.alt });
      await wait(700);
      return play(action.to);
    }
    if (action.game === 'decrypt') {
      let solved = null;
      while (!solved) {
        await offer([{ ...action, kind: 'action' }]);
        solved = await openDecrypt(action);
      }
      const { canvas, img } = canvases[action.target];
      drawPixelated(canvas, img, 1);
      canvas.setAttribute('aria-label', action.alt);
      addSystem(action.done);
      await wait(700);
      return play(action.to);
    }
    if (action.editor) {
      let remix = null;
      while (!remix) {
        await offer([{ ...action, kind: 'action' }]);
        remix = await openRemix(action);
      }
      await sendImage(remix, action.alt);
      await overwriteNode(action.target, remix, action.alt);
      addSystem(action.done);
      await wait(700);
      return play(action.to);
    }
    await offer([{ ...action, kind: 'action' }]);
    await runEffect(action);
    return play(action.to);
  }
}

function reset() {
  abortAll();
  phone.querySelectorAll('.fake-cam').forEach((el) => el.remove());
  map.reset();
  closeModal();
  $('tabbar').hidden = true;
  $('spotlight').hidden = true;
  phone.classList.remove('home');
  Object.keys(player).forEach((k) => delete player[k]);
  player.replySeconds = 0;
  stuck = true;
  thread.innerHTML = '';
  choicesEl.innerHTML = '';
  field.innerHTML = '<span class="placeholder">Message</span>';
  lastSide = null;
  lastRow = null;
  lastReceipt = null;
  $('endCard').hidden = true;
  setThread(version.guide);
}

async function start() {
  reset();
  try {
    const at = new URLSearchParams(location.search).get('at');
    await play(CHAPTERS[at] ? at : STORY.start);
  } catch (e) {
    if (e !== ABORT) throw e;
  }
}

thread.addEventListener('click', skip);
speedBtn.addEventListener('click', () => {
  speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
  speedBtn.textContent = `${speed}×`;
});
// --- first-time steps: location, map modes, account, paywall, more stories ---

function tracked(promise, cancel) {
  const myGen = gen;
  return new Promise((resolve, reject) => {
    const entry = { done: () => { cancel(); reject(ABORT); }, skippable: false };
    pending.push(entry);
    promise.then((v) => {
      pending = pending.filter((p) => p !== entry);
      myGen === gen ? resolve(v) : reject(ABORT);
    });
  });
}

let modalResolve = null;
function closeModal(value = null) {
  const m = $('modal');
  m.hidden = true;
  m.innerHTML = '';
  m.className = 'card-overlay';
  if (modalResolve) {
    const r = modalResolve;
    modalResolve = null;
    r(value);
  }
}

// Shows a modal built from html; any [data-value] button closes it with that value.
function modal(html, cls) {
  const m = $('modal');
  m.className = `card-overlay ${cls}`;
  m.innerHTML = html;
  m.hidden = false;
  const p = new Promise((resolve) => {
    modalResolve = resolve;
    m.querySelectorAll('[data-value]').forEach((b) => b.addEventListener('click', () => closeModal(b.dataset.value)));
  });
  return tracked(p, () => closeModal());
}

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function locationPrompt() {
  return modal(`
    <div class="ios-alert glass" role="alertdialog">
      <div class="ios-body">
        <b>Allow “Story City” to use your location?</b>
        <p>Stories unlock as you walk, and characters can point you to real places nearby.</p>
        <div class="ios-mini-map"><i></i></div>
      </div>
      <button data-value="once">Allow Once</button>
      <button data-value="yes">Allow While Using App</button>
      <button data-value="no">Don’t Allow</button>
    </div>`, 'ios');
}

async function accountSheet(step) {
  return modal(`
    <div class="sheet glass account-sheet" role="dialog" aria-modal="true">
      <div class="gem-badge">💎</div>
      <h2>${esc(step.title)}</h2>
      <p class="blurb">${esc(step.body)}</p>
      <button class="auth apple" data-value="apple"> Continue with Apple</button>
      <button class="auth" data-value="google">Continue with Google</button>
      <button class="auth" data-value="email">Continue with email</button>
      <button class="link-btn" data-value="later">Not now</button>
      <p class="mock-note">Mockup · nothing is saved</p>
    </div>`, 'bottom');
}

async function paywallSheet(step) {
  return modal(`
    <div class="sheet glass paywall-sheet" role="dialog" aria-modal="true">
      <p class="eyebrow">${esc(step.eyebrow)}</p>
      <h2>${esc(step.title)}</h2>
      <ul>${step.perks.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <button class="cta wide" data-value="trial">Start 7-day free trial</button>
      <p class="mock-note">Then [price] a year · cancel anytime</p>
      <button class="link-btn" data-value="later">Maybe later</button>
    </div>`, 'bottom');
}

async function spotlight(step) {
  phone.classList.add('home');
  $('tabbar').hidden = false;
  await wait(500, false);
  const tab = $('storiesTab');
  const pr = phone.getBoundingClientRect();
  const r = tab.getBoundingClientRect();
  const hole = $('spotHole');
  const pad = 6;
  Object.assign(hole.style, {
    left: `${r.left - pr.left - pad}px`, top: `${r.top - pr.top - pad}px`,
    width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px`,
  });
  const tip = $('spotTip');
  tip.textContent = `${step.tip} ↓`;
  tip.style.left = `${Math.max(12, r.left - pr.left + r.width / 2 - 100)}px`;
  tip.style.bottom = `${pr.bottom - r.top + 16}px`;
  $('spotlight').hidden = false;
  await tracked(new Promise((resolve) => {
    const go = () => { tab.removeEventListener('click', go); hole.removeEventListener('click', go); resolve(); };
    tab.addEventListener('click', go);
    hole.addEventListener('click', go);
  }), () => {});
  $('spotlight').hidden = true;
}

async function mapStep(step) {
  const opts = { indoor: !!player.indoor, rural: !!player.rural, title: version.mapTitle, place: val(step.place), find: val(step.find) };
  let result = null;
  while (!result) {
    await offer([{ text: step.button, kind: 'action' }]);
    result = await tracked(map.open(step.type, opts), () => map.forceClose());
  }
  return result;
}

async function runStep(step) {
  if (step.type === 'location') {
    await offer([{ text: step.button, kind: 'action' }]);
    const answer = await locationPrompt();
    player.located = answer !== 'no';
    addSystem(player.located ? '📍 Location on' : 'Location off · using a pretend map');
    return wait(600);
  }
  if (step.type === 'walk') {
    await mapStep(step);
    addSystem(player.indoor ? '🏠 Walked to the far end of your home · unlocked' : player.rural ? '🌾 Walked up your road · unlocked' : '🚶 Walked to the street corner · unlocked', 'arrive');
    return wait(700);
  }
  if (step.type === 'auto') {
    await mapStep(step);
    addSystem(`📍 ${val(step.place)}`, 'arrive');
    return wait(700);
  }
  if (step.type === 'hunt') {
    const src = await mapStep(step);
    await sendImage(src, 'Your photo');
    return;
  }
  if (step.type === 'gem') {
    await mapStep(step);
    addSystem('💎 My first location gem · saved privately', 'arrive');
    return wait(700);
  }
  if (step.type === 'account') {
    await offer([{ text: step.button, kind: 'action' }]);
    const how = await accountSheet(step);
    player.account = how !== 'later';
    addSystem(player.account ? '✓ Account created · gem saved' : 'Skipped for now · gem kept on this phone');
    return wait(600);
  }
  if (step.type === 'paywall') {
    await offer([{ text: step.button, kind: 'action' }]);
    const pick = await paywallSheet(step);
    player.trial = pick === 'trial';
    addSystem(player.trial ? '✓ Free trial started' : 'Maybe later · the door stays closed for now');
    return wait(600);
  }
  if (step.type === 'spotlight') return spotlight(step);
}

function other() {
  return version === VERSIONS.summons ? VERSIONS.knight : VERSIONS.summons;
}

function showEnd() {
  $('spotlight').hidden = true;
  $('endTitle').textContent = 'The Stories tab opens here.';
  $('endBody').textContent = `That’s the whole first-time tour for ${version.label}. Located: ${player.located ? 'yes' : 'no'} · ${player.indoor ? 'home' : player.rural ? 'rural' : 'town'} path · account: ${player.account ? 'yes' : 'skipped'} · trial: ${player.trial ? 'started' : 'not yet'}.`;
  $('otherBtn').textContent = `Try ${other().label}`;
  $('endCard').hidden = false;
}

function useVersion(key) {
  version = VERSIONS[key] || VERSIONS.summons;
  CAST = version.cast;
  CHAPTERS = version.chapters;
  STORY = { start: 'intro', title: version.title };
  document.title = `Story City · ${version.title}`;
  document.body.dataset.version = key;
  const url = new URL(location.href);
  url.searchParams.set('v', key);
  history.replaceState(null, '', url);
}

// Welcome screen -> cheerful explainer -> it glitches and gets hacked.
const ROTATING = ['an adventure', 'a quest', 'an escape room', 'a heist', 'a ghost hunt', 'a mission'];
let rotateTimer = 0;
function startRotator() {
  clearInterval(rotateTimer);
  let n = 0;
  const el = $('rotator');
  rotateTimer = setInterval(() => {
    n = (n + 1) % ROTATING.length;
    el.classList.remove('roll');
    void el.offsetWidth;
    el.textContent = ROTATING[n];
    el.classList.add('roll');
  }, 1800);
}

function markVersion() {
  document.querySelectorAll('.mock-switch button').forEach((b) => {
    b.setAttribute('aria-pressed', String(VERSIONS[b.dataset.v] === version));
  });
}

async function hackExplainer() {
  const ex = $('explainer');
  const myGen = gen;
  // Let them start reading the cheerful page, then break it.
  await new Promise((r) => {
    const t = setTimeout(r, 1500);
    $('exNext').onclick = () => { clearTimeout(t); r(); };
    ex.querySelector('.ex-skip').onclick = () => { clearTimeout(t); r(); };
  });
  if (myGen !== gen) return;
  // GLITCH … pause … GLITCH GLITCH … pause … GLITCH → hard cut to the chat.
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  if (!reducedMotion.matches) {
    await diagonalBurst(ex, 170);
    await pause(650);
    await diagonalBurst(ex, 120);
    await pause(90);
    await diagonalBurst(ex, 150);
    await pause(520);
    await diagonalBurst(ex, 230, true);
  }
  ex.hidden = true;
  phone.classList.remove('welcome-on');
}

// One short burst of slanted tears: copies of the screen, cut into diagonal
// bands, shoved sideways with a colour split, re-rolled every ~50ms.
async function diagonalBurst(screen, ms, last = false) {
  const layers = [];
  for (let i = 0; i < 6; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'diag-slice';
    const copy = screen.cloneNode(true);
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    copy.setAttribute('aria-hidden', 'true');
    wrap.append(copy);
    phone.append(wrap);
    layers.push(wrap);
  }
  screen.classList.add('ex-rgb');
  const rnd = (a, b) => a + Math.random() * (b - a);
  const t0 = performance.now();
  try {
    while (performance.now() - t0 < ms) {
      layers.forEach((w, i) => {
        const y = rnd(-20, 100);
        const h = rnd(3, i % 2 ? 9 : 18);
        const slope = 28;
        w.style.clipPath = `polygon(0 ${y + slope}%, 100% ${y}%, 100% ${y + h}%, 0 ${y + h + slope}%)`;
        w.style.transform = `translateX(${rnd(-38, 38)}px)`;
        w.style.filter = i % 3 === 0 ? 'invert(1) hue-rotate(90deg)' : i % 3 === 1 ? 'hue-rotate(160deg) saturate(3)' : 'none';
      });
      if (last) screen.style.opacity = Math.random() < 0.5 ? '0.15' : '1';
      await new Promise((r) => setTimeout(r, 50));
    }
  } finally {
    layers.forEach((w) => w.remove());
    screen.classList.remove('ex-rgb');
    screen.style.opacity = '';
  }
}

async function begin() {
  clearInterval(rotateTimer);
  $('intro').hidden = true;
  $('explainer').hidden = false;
  reset();
  phone.classList.add('welcome-on');
  try {
    await hackExplainer();
    await play(STORY.start);
  } catch (e) {
    if (e !== ABORT) throw e;
  }
}

function showIntro() {
  reset();
  $('explainer').hidden = true;
  $('intro').hidden = false;
  phone.classList.add('welcome-on');
  markVersion();
  startRotator();
}

document.querySelectorAll('.mock-switch button').forEach((b) => b.addEventListener('click', () => {
  useVersion(b.dataset.v);
  markVersion();
}));
$('startBtn').addEventListener('click', begin);

$('restartBtn').addEventListener('click', showIntro);
$('replayBtn').addEventListener('click', () => { $('endCard').hidden = true; showIntro(); });
$('otherBtn').addEventListener('click', () => {
  const key = Object.keys(VERSIONS).find((k) => VERSIONS[k] === other());
  $('endCard').hidden = true;
  useVersion(key);
  showIntro();
});

// Open a version directly with ?v=knight or #knight
const startKey = new URLSearchParams(location.search).get('v') || location.hash.slice(1);
useVersion(VERSIONS[startKey] ? startKey : 'summons');
setThread(version.guide);
showIntro();


// Pretend phone camera for the mockup: it opens already pointed at the right
// thing, focuses, and snaps on its own (or when the shutter is tapped).
function fakeCamera(src, label) {
  const cam = document.createElement('div');
  cam.className = 'fake-cam';
  cam.innerHTML = `
    <div class="cam-view"><img alt=""></div>
    <div class="cam-top"></div>
    <div class="cam-focus"></div>
    <div class="cam-bottom"><span>PHOTO</span><button class="cam-shutter" aria-label="Take photo"></button></div>
    <div class="cam-flash"></div>`;
  cam.querySelector('img').src = src;
  cam.querySelector('.cam-top').textContent = label;
  phone.append(cam);
  return new Promise((resolve) => {
    let done = false;
    const snap = () => {
      if (done) return;
      done = true;
      cam.classList.add('snapped');
      setTimeout(() => { cam.remove(); resolve(src); }, 380);
    };
    cam.querySelector('.cam-shutter').addEventListener('click', snap);
    setTimeout(snap, 1700 / speed);
  });
}

// Torn-map jigsaw: the picture is cut into six ragged pieces scattered over the
// sheet. Drag each one close to its spot on the board and it snaps in place.
let jigsawClose = null;
function closeJigsaw() { jigsawClose?.(null); }

function openJigsaw(action) {
  let COLS = 2;
  let ROWS = 3;
  const sheet = document.createElement('section');
  sheet.className = 'card-overlay remix-sheet jigsaw-sheet';
  sheet.innerHTML = `
    <div class="sheet glass" role="dialog" aria-modal="true" aria-label="${esc(action.title)}">
      <div class="sheet-bar"><span>${esc(action.title)}</span><button class="pill-btn js-cancel">Cancel</button></div>
      <div class="jig-stage"><div class="jig-board"></div></div>
      <p class="decrypt-hint jig-hint">Drag the torn pieces onto the map</p>
      <button class="link-btn js-auto">Skip the puzzle (demo)</button>
    </div>`;
  phone.append(sheet);
  const stage = sheet.querySelector('.jig-stage');
  const board = sheet.querySelector('.jig-board');
  const hint = sheet.querySelector('.jig-hint');
  const pieces = [];
  let placed = 0;

  return new Promise((resolve) => {
    jigsawClose = (result) => {
      jigsawClose = null;
      sheet.remove();
      resolve(result);
    };
    sheet.querySelector('.js-cancel').addEventListener('click', () => jigsawClose?.(null));

    loadImage(action.image).then((img) => new Promise((r) => requestAnimationFrame(() => r(img)))).then((img) => {
      const aspect = img.naturalWidth / img.naturalHeight;
      // wide maps: 3 across, 2 down; tall maps: 2 across, 3 down
      if (aspect > 1) { COLS = 3; ROWS = 2; }
      const sr = stage.getBoundingClientRect();
      const bw = aspect > 1 ? Math.min(sr.width * 0.94, sr.height * 0.5 * aspect) : Math.min(sr.width * 0.62, sr.height * 0.62 * aspect);
      const bh = bw / aspect;
      const bx = (sr.width - bw) / 2;
      const by = 8;
      Object.assign(board.style, { left: `${bx}px`, top: `${by}px`, width: `${bw}px`, height: `${bh}px` });
      const pw = bw / COLS;
      const ph = bh / ROWS;
      const rnd = (a, b) => a + Math.random() * (b - a);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const el = document.createElement('div');
          el.className = 'jig-piece';
          // ragged edges, a little different on every piece
          const jag = (n) => Array.from({ length: n }, (_, i) => i);
          const top = jag(6).map((i) => `${(i / 5) * 100}% ${r ? rnd(0, 4) : 0}%`);
          const right = jag(5).map((i) => `${c < COLS - 1 ? 100 - rnd(0, 4) : 100}% ${(i / 4) * 100}%`);
          const bottom = jag(6).map((i) => `${100 - (i / 5) * 100}% ${r < ROWS - 1 ? 100 - rnd(0, 4) : 100}%`);
          const left = jag(5).map((i) => `${c ? rnd(0, 4) : 0}% ${100 - (i / 4) * 100}%`);
          el.style.clipPath = `polygon(${[...top, ...right, ...bottom, ...left].join(',')})`;
          Object.assign(el.style, {
            width: `${pw}px`, height: `${ph}px`,
            backgroundImage: `url(${action.image})`,
            backgroundSize: `${bw}px ${bh}px`,
            backgroundPosition: `${-c * pw}px ${-r * ph}px`,
          });
          const home = { x: bx + c * pw, y: by + r * ph };
          // scatter below and around the board
          const x = rnd(0, sr.width - pw);
          const y = rnd(by + bh * 0.55, sr.height - ph);
          const rot = rnd(-24, 24);
          Object.assign(el.style, { left: `${x}px`, top: `${y}px`, transform: `rotate(${rot}deg)`, zIndex: String(2 + pieces.length) });
          const piece = { el, home, done: false };
          pieces.push(piece);
          stage.append(el);
          drag(piece);
        }
      }

      function snap(piece) {
        piece.done = true;
        piece.el.classList.add('placed');
        Object.assign(piece.el.style, { left: `${piece.home.x}px`, top: `${piece.home.y}px`, transform: 'none', zIndex: '1' });
        placed++;
        hint.textContent = placed < pieces.length ? `${placed} of ${pieces.length} pieces` : 'Mended!';
        if (placed === pieces.length) {
          board.classList.add('whole');
          setTimeout(() => jigsawClose?.(true), 900);
        }
      }

      function drag(piece) {
        const el = piece.el;
        let dx = 0;
        let dy = 0;
        el.addEventListener('pointerdown', (e) => {
          if (piece.done) return;
          e.preventDefault();
          el.setPointerCapture(e.pointerId);
          const r = el.getBoundingClientRect();
          dx = e.clientX - r.left;
          dy = e.clientY - r.top;
          el.style.zIndex = '50';
          el.classList.add('lifted');
        });
        el.addEventListener('pointermove', (e) => {
          if (!el.hasPointerCapture(e.pointerId)) return;
          const s = stage.getBoundingClientRect();
          el.style.left = `${e.clientX - s.left - dx}px`;
          el.style.top = `${e.clientY - s.top - dy}px`;
        });
        el.addEventListener('pointerup', (e) => {
          if (!el.hasPointerCapture(e.pointerId)) return;
          el.releasePointerCapture(e.pointerId);
          el.classList.remove('lifted');
          const x = parseFloat(el.style.left);
          const y = parseFloat(el.style.top);
          if (Math.hypot(x - piece.home.x, y - piece.home.y) < Math.min(pw, ph) * 0.45) snap(piece);
        });
      }

      sheet.querySelector('.js-auto').addEventListener('click', () => {
        pieces.filter((p) => !p.done).forEach((p, i) => setTimeout(() => !p.done && snap(p), i * 220));
      });
    });
  });
}

// Every parchment scrap gets its own gently uneven outline (and a matching
// rolled-up start shape), so no two of Sir Wendell's notes look alike.
function scrapEdges(el) {
  const r = (a, b) => a + Math.random() * (b - a);
  const tear = r(0.6, 1.8);
  const pts = [];
  const nTop = 6 + Math.floor(Math.random() * 5);
  for (let i = 0; i <= nTop; i++) pts.push([(i / nTop) * 100, r(0, tear)]);
  const nSide = 4 + Math.floor(Math.random() * 3);
  for (let i = 1; i < nSide; i++) pts.push([100 - r(0, tear * 1.2), (i / nSide) * 100]);
  const nBot = 6 + Math.floor(Math.random() * 5);
  for (let i = 0; i <= nBot; i++) pts.push([100 - (i / nBot) * 100, 100 - r(0, tear * 1.4)]);
  pts.push([0, 90], [0, 10]);
  const poly = (sx) => `polygon(${pts.map(([x, y]) => `${(x * sx).toFixed(1)}% ${y.toFixed(1)}%`).join(', ')})`;
  el.style.setProperty('--scrap', poly(1));
  el.style.setProperty('--scrap-rolled', poly(0.06));
  el.style.backgroundPosition = `${Math.round(r(0, 100))}% ${Math.round(r(0, 100))}%`;
  el.style.backgroundSize = `${Math.round(r(360, 520))}px auto`;
}
