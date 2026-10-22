import { CAST, LABEL } from './cast.js?v=21';

const BAR_COUNT = 32;
const BAR_GAP = 2;
const BAR_MIN = 3;
const TIP_STYLES = ['solid', 'place'];
const TIP_STYLE_KEY = 'audio-preview-tip-style';
const SWIPE_THRESHOLD_PX = 48;
const SWIPE_AXIS_RATIO = 1.15;
const SWIPE_SNAP_MS = 280;

const clip = document.getElementById('clip');
const start = document.getElementById('start');
const castEl = document.getElementById('cast');
const castStage = document.getElementById('castStage');
const castTrack = document.getElementById('castTrack');
const tipTemplate = document.getElementById('tipSlideTemplate');

const $ = (id) => document.getElementById(id);

let active = CAST[0];
let tipStyle = 'solid';
let raf = 0;
let audioCtx = null;
let analyser = null;
let sourceNode = null;
let freq = null;
let time = null;
let wired = false;
let dragOffsetPx = 0;
let swipeStartX = 0;
let swipeStartY = 0;
let swipeDx = 0;
let swipeActive = false;
let swipeLocked = false;
let suppressPlayClick = false;
let trackBuilt = false;

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

function activeSlide() {
  return castTrack.querySelector(`.cast-slide[data-id="${active.id}"]`);
}

function activeTip() {
  return activeSlide()?.querySelector('.tip') || null;
}

function activeBars() {
  return activeSlide()?.querySelector('.voice-bars') || null;
}

function activeLabel() {
  return activeSlide()?.querySelector('.voice-label') || null;
}

function drawBars(values) {
  const canvas = activeBars();
  if (!canvas) return;
  const ctx2d = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
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
  const tip = activeTip();
  const label = activeLabel();
  const bars = activeBars();
  tip?.classList.toggle('playing', on);
  tip?.setAttribute('aria-pressed', String(on));
  if (label) label.hidden = on;
  if (bars) {
    bars.hidden = !on;
    if (!on) {
      const ctx2d = bars.getContext('2d');
      ctx2d.clearRect(0, 0, bars.width, bars.height);
    }
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

function renderDescription(lines) {
  const root = $('description');
  root.replaceChildren();
  lines.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    root.append(p);
  });
}

function castIndex(id) {
  const index = CAST.findIndex((item) => item.id === id);
  return index < 0 ? 0 : index;
}

function setTrackOffset(index, dragPx, animate) {
  const width = castStage.clientWidth || 1;
  const x = -(index * width) + dragPx;
  castTrack.style.transition = animate ? `transform ${SWIPE_SNAP_MS}ms ease` : 'none';
  castTrack.style.transform = `translate3d(${x}px, 0, 0)`;
}

function syncTrack(animate) {
  setTrackOffset(castIndex(active.id), dragOffsetPx, Boolean(animate));
}

function renderDots() {
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
      selectCast(entry.id, { animate: true });
    });
    castEl.append(btn);
  });
}

function wireTip(tip, entry) {
  tip.addEventListener('click', (event) => {
    event.preventDefault();
    if (suppressPlayClick) {
      suppressPlayClick = false;
      return;
    }
    if (entry.id !== active.id) {
      selectCast(entry.id, { animate: true });
      return;
    }
    togglePlay();
  });

  const down = () => tip.classList.add('pressed');
  const up = () => tip.classList.remove('pressed');
  tip.addEventListener('pointerdown', down);
  tip.addEventListener('pointerup', up);
  tip.addEventListener('pointercancel', up);
  tip.addEventListener('pointerleave', up);
}

function buildTrack() {
  castTrack.replaceChildren();
  CAST.forEach((entry) => {
    const node = tipTemplate.content.cloneNode(true);
    const slide = node.querySelector('.cast-slide');
    const tip = node.querySelector('.tip');
    const placeImg = node.querySelector('.tip-place-img');
    const sprite = node.querySelector('.sprite');
    const voiceBy = node.querySelector('.voice-by-name');
    const label = node.querySelector('.voice-label');

    slide.dataset.id = entry.id;
    placeImg.src = entry.place || entry.story.place || '';
    voiceBy.textContent = entry.voiceBy || entry.character;
    label.textContent = LABEL;
    sprite.alt = entry.character;
    sprite.onerror = () => {
      if (sprite.src !== entry.spriteFallback) {
        sprite.src = entry.spriteFallback;
      }
    };
    sprite.src = entry.sprite;
    TIP_STYLES.forEach((name) => {
      tip.classList.toggle(`tip--${name}`, tipStyle === name);
    });
    wireTip(tip, entry);
    castTrack.append(slide);
  });
  trackBuilt = true;
  syncTipStyleUi();
  syncTrack(false);
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

function syncTipStyleUi() {
  castTrack.querySelectorAll('.tip').forEach((tip) => {
    TIP_STYLES.forEach((name) => {
      tip.classList.toggle(`tip--${name}`, tipStyle === name);
    });
  });
  document.querySelectorAll('.dbg-btn[data-tip-style]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.tipStyle === tipStyle));
  });
}

function setTipStyle(next) {
  const style = TIP_STYLES.includes(next) ? next : 'solid';
  tipStyle = style;
  syncTipStyleUi();
  try { localStorage.setItem(TIP_STYLE_KEY, style); } catch (err) { /* ignore */ }
  const url = new URL(location.href);
  url.searchParams.set('tip', style);
  history.replaceState(null, '', url);
}

function selectCast(id, options = {}) {
  const entry = CAST.find((item) => item.id === id) || CAST[0];
  const same = entry.id === active.id && clip.src;
  if (!options.force && same && !options.animate) {
    syncTrack(false);
    renderDots();
    return;
  }
  stopClip();
  active = entry;
  applyStory(entry);
  clip.src = entry.audio;
  clip.load();
  setPlaying(false);
  dragOffsetPx = 0;
  renderDots();
  syncTrack(Boolean(options.animate));
  const url = new URL(location.href);
  url.searchParams.set('c', entry.id);
  url.searchParams.set('tip', tipStyle);
  history.replaceState(null, '', url);
}

castStage.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  swipeStartX = event.clientX;
  swipeStartY = event.clientY;
  swipeDx = 0;
  swipeActive = true;
  swipeLocked = false;
  castStage.setPointerCapture(event.pointerId);
});

castStage.addEventListener('pointermove', (event) => {
  if (!swipeActive) return;
  const dx = event.clientX - swipeStartX;
  const dy = event.clientY - swipeStartY;
  if (!swipeLocked) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    if (Math.abs(dx) < Math.abs(dy) * SWIPE_AXIS_RATIO) {
      swipeActive = false;
      return;
    }
    swipeLocked = true;
    stopClip();
    castStage.classList.add('swiping');
  }
  swipeDx = dx;
  dragOffsetPx = dx;
  syncTrack(false);
});

function endSwipe(event) {
  if (!swipeActive) return;
  swipeActive = false;
  castStage.classList.remove('swiping');
  if (event && castStage.hasPointerCapture?.(event.pointerId)) {
    castStage.releasePointerCapture(event.pointerId);
  }
  if (!swipeLocked) {
    dragOffsetPx = 0;
    return;
  }
  suppressPlayClick = true;
  const index = castIndex(active.id);
  let nextIndex = index;
  if (swipeDx <= -SWIPE_THRESHOLD_PX && index < CAST.length - 1) {
    nextIndex = index + 1;
  } else if (swipeDx >= SWIPE_THRESHOLD_PX && index > 0) {
    nextIndex = index - 1;
  }
  dragOffsetPx = 0;
  if (nextIndex !== index) {
    selectCast(CAST[nextIndex].id, { animate: true, force: true });
  } else {
    syncTrack(true);
  }
}

castStage.addEventListener('pointerup', endSwipe);
castStage.addEventListener('pointercancel', endSwipe);
window.addEventListener('resize', () => syncTrack(false));

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

press(start);

document.querySelectorAll('.dbg-btn[data-tip-style]').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    setTipStyle(btn.dataset.tipStyle);
  });
});

const params = new URLSearchParams(location.search);
const startId = params.get('c');
let savedTip = params.get('tip');
if (!savedTip) {
  try { savedTip = localStorage.getItem(TIP_STYLE_KEY); } catch (err) { savedTip = null; }
}
buildTrack();
setTipStyle(savedTip || 'solid');
selectCast(startId || CAST[0].id, { force: true });
