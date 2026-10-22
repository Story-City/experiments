import { CAST, LABEL } from './cast.js';

const BAR_COUNT = 32;
const BAR_GAP = 2;
const BAR_MIN = 3;

const play = document.getElementById('play');
const label = document.getElementById('voiceLabel');
const bars = document.getElementById('bars');
const clip = document.getElementById('clip');
const start = document.getElementById('start');
const sprite = document.getElementById('sprite');
const castEl = document.getElementById('cast');
const ctx2d = bars.getContext('2d');

const $ = (id) => document.getElementById(id);

let active = CAST[0];
let raf = 0;
let audioCtx = null;
let analyser = null;
let sourceNode = null;
let freq = null;
let time = null;
let wired = false;

function ensureGraph() {
  if (wired) return analyser != null;
  wired = true;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return false;
  try {
    audioCtx = new Ctx();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.65;
    sourceNode = audioCtx.createMediaElementSource(clip);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
    freq = new Uint8Array(analyser.frequencyBinCount);
    time = new Uint8Array(analyser.fftSize);
    return true;
  } catch (err) {
    analyser = null;
    freq = null;
    time = null;
    return false;
  }
}

function drawBars(values) {
  const w = bars.width;
  const h = bars.height;
  const slot = w / BAR_COUNT;
  const barW = Math.max(2, slot - BAR_GAP);
  ctx2d.clearRect(0, 0, w, h);
  ctx2d.fillStyle = '#B9E5FF';
  for (let i = 0; i < BAR_COUNT; i += 1) {
    const amp = values[i] || 0;
    const barH = Math.max(BAR_MIN, amp * h);
    const x = i * slot + (slot - barW) / 2;
    const y = (h - barH) / 2;
    const r = Math.min(barW / 2, 2);
    ctx2d.beginPath();
    if (ctx2d.roundRect) {
      ctx2d.roundRect(x, y, barW, barH, r);
    } else {
      ctx2d.rect(x, y, barW, barH);
    }
    ctx2d.fill();
  }
}

function sampleBars() {
  const values = new Array(BAR_COUNT).fill(0);
  if (!analyser || !freq || !time) return values;

  analyser.getByteFrequencyData(freq);
  analyser.getByteTimeDomainData(time);

  const freqStep = Math.max(1, Math.floor(freq.length / BAR_COUNT));
  const timeStep = Math.max(1, Math.floor(time.length / BAR_COUNT));

  for (let i = 0; i < BAR_COUNT; i += 1) {
    let peak = 0;
    const t0 = i * timeStep;
    const t1 = Math.min(time.length, t0 + timeStep);
    for (let t = t0; t < t1; t += 1) {
      peak = Math.max(peak, Math.abs(time[t] - 128) / 128);
    }
    const energy = (freq[Math.min(freq.length - 1, i * freqStep)] || 0) / 255;
    values[i] = Math.min(1, peak * 0.75 + energy * 0.55);
  }
  return values;
}

function setPlaying(on) {
  play.classList.toggle('playing', on);
  play.setAttribute('aria-pressed', String(on));
  label.hidden = on;
  bars.hidden = !on;
  if (!on) {
    ctx2d.clearRect(0, 0, bars.width, bars.height);
  }
}

function stopClip() {
  clip.pause();
  setPlaying(false);
  cancelAnimationFrame(raf);
  raf = 0;
}

function tick() {
  if ((clip.currentTime || 0) >= active.end) {
    clip.pause();
    clip.currentTime = active.start;
    setPlaying(false);
    cancelAnimationFrame(raf);
    raf = 0;
    return;
  }
  drawBars(sampleBars());
  raf = requestAnimationFrame(tick);
}

async function togglePlay() {
  if (!clip.paused) {
    stopClip();
    return;
  }
  ensureGraph();
  if (audioCtx && audioCtx.state === 'suspended') {
    try { await audioCtx.resume(); } catch (err) { /* ignore */ }
  }
  if (clip.currentTime >= active.end || clip.currentTime < active.start) {
    clip.currentTime = active.start;
  }
  try {
    await clip.play();
    setPlaying(true);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  } catch (err) {
    setPlaying(false);
  }
}

function setSprite(entry) {
  sprite.onerror = () => {
    if (sprite.src !== entry.spriteFallback) {
      sprite.src = entry.spriteFallback;
    }
  };
  sprite.alt = entry.character;
  sprite.src = entry.sprite;
}

function renderDescription(lines) {
  const root = $('description');
  root.replaceChildren();
  lines.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    root.append(p);
  });
}

function renderCast() {
  castEl.replaceChildren();
  CAST.forEach((entry) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dot';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(entry.id === active.id));
    btn.setAttribute('aria-label', entry.character);
    btn.dataset.id = entry.id;
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      selectCast(entry.id);
    });
    castEl.append(btn);
  });
}

function applyStory(entry) {
  const story = entry.story;
  $('cover').setAttribute('aria-label', story.title);
  $('coverImg').src = story.cover;
  $('author').textContent = story.author;
  $('title').textContent = story.title;
  $('chipGenre').textContent = story.genre;
  $('chipAge').textContent = story.age;
  $('chipDuration').textContent = story.duration;
  $('summary').textContent = story.summary;
  renderDescription(story.description);
  document.title = `Story overview: ${story.title}`;
}

function selectCast(id) {
  const entry = CAST.find((item) => item.id === id) || CAST[0];
  if (entry.id === active.id && clip.src) {
    return;
  }
  stopClip();
  active = entry;
  applyStory(entry);
  setSprite(entry);
  $('voiceBy').textContent = entry.voiceBy || entry.character;
  clip.src = entry.audio;
  clip.load();
  label.textContent = LABEL;
  setPlaying(false);
  renderCast();
  const url = new URL(location.href);
  url.searchParams.set('c', entry.id);
  history.replaceState(null, '', url);
}

play.addEventListener('click', (event) => {
  event.preventDefault();
  togglePlay();
});
clip.addEventListener('ended', stopClip);
clip.addEventListener('error', () => setPlaying(false));

document.querySelectorAll('[role="tab"]').forEach((tab) => {
  if (tab.closest('#cast')) return;
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    document.querySelectorAll('.tabs [role="tab"]').forEach((item) => {
      item.setAttribute('aria-selected', String(item === tab));
    });
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== name;
    });
    if (name !== 'details') stopClip();
  });
});

function press(button) {
  const down = () => button.classList.add('pressed');
  const up = () => button.classList.remove('pressed');
  button.addEventListener('pointerdown', down);
  button.addEventListener('pointerup', up);
  button.addEventListener('pointercancel', up);
  button.addEventListener('pointerleave', up);
}

press(play);
press(start);

const startId = new URLSearchParams(location.search).get('c');
selectCast(startId || CAST[0].id);
