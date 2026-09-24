const V = new URL(import.meta.url).search;
const { createGlitches } = await import(`./glitch.js${V}`);
const { STORY, CAST, CHAPTERS, SHARED, SHARED_CHOICES, SHARED_ACTIONS, SHARED_WALKS } = await import(`./story.js${V}`);

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
  phone.classList.toggle('hacked', key === 'crispe');
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

Object.values(CAST).forEach((who) => {
  if (!who.avatar) who.avatar = initialsAvatar(who.initials);
});

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
  let mode, cw, ch, total, state, cleared, snapFor, snaps = [];

  const showProgress = () => { hint.textContent = `${cleared}/${total} sectors decrypted`; };

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
      hint.textContent = 'Node decrypted';
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
    for (let i = 0; i < total; i++) drawCell(ctx, img, i % mode.cols, Math.floor(i / mode.cols), DECRYPT_STEPS[0], cw, ch);
    snaps.forEach((el) => el.remove());
    snaps = (mode.targets || []).map((t, i) => {
      const b = document.createElement('button');
      b.className = 'snap glass';
      b.style.top = `${(i + 0.5) * (100 / mode.rows)}%`;
      b.innerHTML = '<span class="swatch"></span><span class="snap-text"></span>';
      b.querySelector('.swatch').style.background = `var(${t.token})`;
      b.querySelector('.snap-text').textContent = `Snap something ${t.name}`;
      b.addEventListener('click', () => { snapFor = i; fileInput.value = ''; fileInput.click(); });
      stageEl.append(b);
      return b;
    });
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

  const onPhoto = async () => {
    const file = fileInput.files[0];
    const i = snapFor;
    if (!file || i == null || state[i] !== 'locked') return;
    const url = URL.createObjectURL(file);
    try {
      const photo = await loadImage(url);
      const color = averageColor(photo);
      const target = mode.targets[i];
      const btn = snaps[i];
      btn.querySelector('.swatch').style.background = color.css;
      if (hueMatches(color, target)) {
        btn.hidden = true;
        decryptCell(i);
      } else {
        btn.querySelector('.snap-text').textContent = `Not ${target.name} enough. Try again`;
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
    pending = pending.filter((p) => p !== entry);
    sheet.hidden = true;
    result === ABORT ? rejectFn(ABORT) : resolveFn(result);
  }
  const onCancel = () => close(null);

  setup('tap');
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
  if (style === 'type') {
    $('headStatus').textContent = '';
    await fx.typeIn($('headName'), who.name);
    await fx.typeIn($('headStatus'), who.status, 30);
    return;
  }
  await Promise.all([
    fx.scramble($('headName'), who.name),
    fx.scramble($('headStatus'), who.status),
    fx.rgb(),
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
  if (beat.cut) bubble.classList.add('cut');
  addRow('them', beat.from, bubble);
}

const player = { replySeconds: 0 };

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
  for (const beat of expand(ch.beats)) await runBeat(beat);

  if (ch.next) return play(ch.next);
  if (ch.end) {
    await wait(900);
    $('endTitle').textContent = ch.end.title;
    $('endBody').textContent = ch.end.body;
    $('endCard').hidden = false;
    return;
  }
  if (ch.choices) {
    const options = typeof ch.choices === 'string' ? SHARED_CHOICES[ch.choices] : ch.choices;
    const pick = await offer(options);
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
  stuck = true;
  thread.innerHTML = '';
  choicesEl.innerHTML = '';
  field.innerHTML = '<span class="placeholder">Message</span>';
  lastSide = null;
  lastRow = null;
  lastReceipt = null;
  $('endCard').hidden = true;
  setThread(CHAPTERS[STORY.start].thread);
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
$('restartBtn').addEventListener('click', start);
$('replayBtn').addEventListener('click', start);
$('startBtn').addEventListener('click', () => {
  $('intro').hidden = true;
  start();
});

document.title = STORY.title;
setThread(CHAPTERS[STORY.start].thread);
