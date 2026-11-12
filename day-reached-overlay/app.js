// Mirrored from suite-city feature/SC-3526-training-hub
// TrainingHubStreakBannerStyles + useTrainingHubStreakBanner weekdayLabel.
const FIGMA_FRAME_WIDTH = 375;
const BEAD_SMALL_SIZE = 30;
const BEAD_CURRENT_SIZE = 54;
const BEAD_SMALL_LABEL = 12;
const BEAD_CURRENT_LABEL = 16;
const FIGMA_BEADS = [
  { left: 25, top: 95, size: BEAD_SMALL_SIZE, labelSize: BEAD_SMALL_LABEL },
  { left: 75, top: 42, size: BEAD_SMALL_SIZE, labelSize: BEAD_SMALL_LABEL },
  { left: 160, top: 0, size: BEAD_CURRENT_SIZE, labelSize: BEAD_CURRENT_LABEL },
  { left: 261, top: 34, size: BEAD_SMALL_SIZE, labelSize: BEAD_SMALL_LABEL },
  { left: 315, top: 89, size: BEAD_SMALL_SIZE, labelSize: BEAD_SMALL_LABEL },
];
const DAY_OFFSETS = [-2, -1, 0, 1, 2];
const TODAY_BEAD_INDEX = 2;
const FIGMA_ARC_PATH =
  'M171 0C265.441 0 342 77.0004 342 171.985C342 172.808 341.993 173.629 341.981 174.449C340.671 80.6001 264.623 4.92773 171 4.92773C77.3773 4.92773 1.32794 80.6001 0.0175781 174.449C0.00613292 173.629 0 172.808 0 171.985C0.000131189 77.0004 76.5594 0 171 0Z';
const ACCENT_GLOW_BLUR = 34;
const ACCENT_GLOW_OPACITY = 0.22;
const ACCENT_GLOW_LAYERS = [
  { spread: 0.82, opacity: ACCENT_GLOW_OPACITY * 0.1 },
  { spread: 0.71, opacity: ACCENT_GLOW_OPACITY * 0.11 },
  { spread: 0.6, opacity: ACCENT_GLOW_OPACITY * 0.12 },
  { spread: 0.49, opacity: ACCENT_GLOW_OPACITY * 0.13 },
  { spread: 0.38, opacity: ACCENT_GLOW_OPACITY * 0.14 },
  { spread: 0.27, opacity: ACCENT_GLOW_OPACITY * 0.15 },
  { spread: 0.16, opacity: ACCENT_GLOW_OPACITY * 0.16 },
];
const DAY_REACHED_LOTTIE_WIDTH = 1920;
const DAY_REACHED_LOTTIE_HEIGHT = 1080;
const DAY_REACHED_LOTTIE_FRAMES = 43;
const DAY_REACHED_LOTTIE_FPS = 30;
const DAY_REACHED_LOTTIE_DURATION_MS = Math.round(
  (DAY_REACHED_LOTTIE_FRAMES / DAY_REACHED_LOTTIE_FPS) * 1000,
);
const DAY_REACHED_LOTTIE_FINISH_GRACE_MS = 600;
const DAY_REACHED_LOTTIE_FALLBACK_MS =
  DAY_REACHED_LOTTIE_DURATION_MS + DAY_REACHED_LOTTIE_FINISH_GRACE_MS;
const DAY_REACHED_SETTLE_CENTER_X = 1010.3;
const DAY_REACHED_SETTLE_CENTER_Y = 527.1;
const DAY_REACHED_SETTLE_DIAMETER = 882.3;
const DAY_REACHED_LOTTIE_CENTER_DIVISOR = 2;
const DAY_REACHED_BEAD_REVEAL_MS = 280;
const HAZE_IN_MS = 160;
const SHINE_MS = 1400;
const HOLD_AFTER_SHINE_MS = 500;
const HOLD_READABLE_MS = SHINE_MS + HOLD_AFTER_SHINE_MS;
const HAZE_OUT_MS = 380;
const STREAK_COUNT = 3;

const UNDERLAY_CACHE = 'v=15';
const SIDE_FAR_INDEXES = new Set([0, 4]);
const SIDE_NEAR_INDEXES = new Set([1, 3]);
const UNDERLAYS = {
  adventure: {
    src: `underlays/adventure.jpg?${UNDERLAY_CACHE}`,
    alt: 'Story City staging — adventure mode picker',
  },
  audio: {
    src: `underlays/audio.jpg?${UNDERLAY_CACHE}`,
    alt: 'Story City staging — tap to play audio',
  },
  reader: {
    src: `underlays/reader.jpg?${UNDERLAY_CACHE}`,
    alt: 'Story City staging — reader text with Carry on',
  },
};

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shiftLocalDate(dateStr, offset) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + offset);
  return formatLocalDate(date);
}

function weekdayLabel(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
  });
}

function dayReachedLottieLayout(scale) {
  const today = FIGMA_BEADS[TODAY_BEAD_INDEX];
  const centerX = (today.left + today.size / DAY_REACHED_LOTTIE_CENTER_DIVISOR) * scale;
  const centerY = (today.top + today.size / DAY_REACHED_LOTTIE_CENTER_DIVISOR) * scale;
  const compScale = (today.size * scale) / DAY_REACHED_SETTLE_DIAMETER;
  return {
    width: DAY_REACHED_LOTTIE_WIDTH * compScale,
    height: DAY_REACHED_LOTTIE_HEIGHT * compScale,
    left: centerX - DAY_REACHED_SETTLE_CENTER_X * compScale,
    top: centerY - DAY_REACHED_SETTLE_CENTER_Y * compScale,
  };
}

const overlay = document.getElementById('overlay');
const playLayer = document.getElementById('playLayer');
const graphic = document.getElementById('graphic');
const beadsHost = document.getElementById('beads');
const arcSvg = document.getElementById('arc');
const lottieHost = document.getElementById('lottie');
const copyEl = document.getElementById('copy');
const headlineEl = document.getElementById('headline');
const subtitleEl = document.getElementById('subtitle');
const shineEl = document.getElementById('shine');
const playBtn = document.getElementById('play');
const hint = document.getElementById('hint');
const phone = document.getElementById('phone');
const underlay = document.getElementById('underlay');
const holdForReview = new URLSearchParams(location.search).has('hold');

let anim = null;
let animReady = false;
let animLoading = null;
let timers = [];
let playing = false;
let lottieFinished = false;
let laidOutScale = 0;

headlineEl.innerHTML = `<span class="headline-rich">${STREAK_COUNT}-day streak!</span>`;
subtitleEl.textContent = 'Keep it up!';

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function buildArc() {
  if (arcSvg.childElementCount > 0) return;
  const accent = '#009EFF';
  const ns = 'http://www.w3.org/2000/svg';
  ACCENT_GLOW_LAYERS.forEach((layer) => {
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', FIGMA_ARC_PATH);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', accent);
    path.setAttribute('stroke-width', String(ACCENT_GLOW_BLUR * layer.spread));
    path.setAttribute('stroke-opacity', String(layer.opacity));
    arcSvg.appendChild(path);
  });
  const fill = document.createElementNS(ns, 'path');
  fill.setAttribute('d', FIGMA_ARC_PATH);
  fill.setAttribute('fill', accent);
  fill.setAttribute('fill-rule', 'evenodd');
  arcSvg.appendChild(fill);
}

function layoutBeads() {
  const scale = graphic.clientWidth / FIGMA_FRAME_WIDTH || 1;
  if (Math.abs(scale - laidOutScale) < 0.001 && beadsHost.childElementCount === FIGMA_BEADS.length) {
    return scale;
  }
  laidOutScale = scale;
  beadsHost.replaceChildren();
  const today = formatLocalDate(new Date());
  DAY_OFFSETS.forEach((offset, index) => {
    const spec = FIGMA_BEADS[index];
    const date = shiftLocalDate(today, offset);
    const el = document.createElement('div');
    el.className = 'bead';
    if (index < TODAY_BEAD_INDEX) el.classList.add('is-complete');
    if (index === TODAY_BEAD_INDEX) el.classList.add('is-today', 'is-complete');
    if (SIDE_FAR_INDEXES.has(index)) el.classList.add('is-side-far');
    if (SIDE_NEAR_INDEXES.has(index)) el.classList.add('is-side-near');
    el.style.left = `${spec.left * scale}px`;
    el.style.top = `${spec.top * scale}px`;
    el.style.width = `${spec.size * scale}px`;
    el.style.height = `${spec.size * scale}px`;
    el.style.fontSize = `${spec.labelSize * scale}px`;
    const sheen = document.createElement('div');
    sheen.className = 'sheen';
    el.appendChild(sheen);
    const label = document.createElement('span');
    label.textContent = weekdayLabel(date);
    el.appendChild(label);
    beadsHost.appendChild(el);
  });
  return scale;
}

function setTodayFace(awaitingLottie, shiny) {
  const todayEl = beadsHost.children[TODAY_BEAD_INDEX];
  if (!todayEl) return;
  todayEl.classList.add('is-complete', 'is-today');
  todayEl.classList.toggle('is-awaiting-lottie', awaitingLottie);
  todayEl.classList.toggle('is-shiny', !awaitingLottie && shiny);
}

function placeLottie(scale) {
  const layout = dayReachedLottieLayout(scale);
  lottieHost.style.left = `${layout.left}px`;
  lottieHost.style.top = `${layout.top}px`;
  lottieHost.style.width = `${layout.width}px`;
  lottieHost.style.height = `${layout.height}px`;
  lottieHost.style.overflow = 'visible';
}

function setCopyVisible(on) {
  copyEl.classList.toggle('is-on', on);
  copyEl.setAttribute('aria-hidden', on ? 'false' : 'true');
}

function stopAnimAtStart() {
  if (!anim) return;
  anim.pause();
  anim.goToAndStop(0, true);
}

function ensureAnim() {
  if (animReady && anim) return Promise.resolve(anim);
  if (animLoading) return animLoading;
  animLoading = new Promise((resolve, reject) => {
    anim = window.lottie.loadAnimation({
      container: lottieHost,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'training_hub_day_reached.json',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        progressiveLoad: false,
        hideOnTransparent: true,
      },
    });
    anim.addEventListener('DOMLoaded', () => {
      lottieHost.style.overflow = 'visible';
      const svg = lottieHost.querySelector('svg');
      if (svg) svg.style.overflow = 'visible';
      anim.goToAndStop(0, true);
      animReady = true;
      resolve(anim);
    });
    anim.addEventListener('data_failed', () => {
      animLoading = null;
      reject(new Error('Lottie failed to load'));
    });
  });
  return animLoading;
}

function finishPlay() {
  playing = false;
  clearTimers();
  setCopyVisible(false);
  setTodayFace(false, false);
  shineEl.classList.remove('is-on');
  stopAnimAtStart();
  playLayer.classList.remove('is-in', 'is-out');
  overlay.setAttribute('aria-hidden', 'true');
  hint.textContent = 'Done — switch underlay or replay.';
  playBtn.disabled = false;
}

function beginDissolve() {
  setCopyVisible(false);
  playLayer.classList.remove('is-in');
  playLayer.classList.add('is-out');
  later(() => {
    stopAnimAtStart();
    finishPlay();
  }, HAZE_OUT_MS);
}

function onLottieDone() {
  if (lottieFinished || !playing) return;
  lottieFinished = true;
  setTodayFace(false, true);
  setCopyVisible(true);
  shineEl.classList.remove('is-on');
  void shineEl.offsetWidth;
  shineEl.classList.add('is-on');
  later(() => {
    hint.textContent = holdForReview
      ? 'Held for review (?hold=1). Soft dissolve paused.'
      : 'Shine held — soft dissolve next…';
    if (holdForReview) {
      playBtn.disabled = false;
      playing = false;
      return;
    }
    later(beginDissolve, HOLD_READABLE_MS);
  }, DAY_REACHED_BEAD_REVEAL_MS);
}

async function playDayReached() {
  if (!window.lottie || playing) return;
  playing = true;
  lottieFinished = false;
  playBtn.disabled = true;
  hint.textContent = 'Day reached…';
  clearTimers();
  setCopyVisible(false);
  shineEl.classList.remove('is-on');

  buildArc();
  const scale = layoutBeads();
  setTodayFace(true, false);
  placeLottie(scale);

  try {
    await ensureAnim();
  } catch (err) {
    hint.textContent = 'Lottie failed to load.';
    finishPlay();
    return;
  }

  // Host already sized; SVG already in DOM — opacity fade only, then play.
  playLayer.classList.remove('is-out');
  playLayer.classList.add('is-in');
  overlay.setAttribute('aria-hidden', 'false');

  later(() => {
    if (!playing || !anim) return;
    anim.removeEventListener('complete', onLottieDone);
    anim.addEventListener('complete', onLottieDone);
    anim.goToAndPlay(0, true);
    later(onLottieDone, DAY_REACHED_LOTTIE_FALLBACK_MS);
  }, HAZE_IN_MS);
}

function setSurface(name) {
  const shot = UNDERLAYS[name] ?? UNDERLAYS.adventure;
  phone.dataset.surface = name;
  underlay.src = shot.src;
  underlay.alt = shot.alt;
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.setAttribute('aria-pressed', chip.dataset.surface === name ? 'true' : 'false');
  });
}

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => setSurface(chip.dataset.surface));
});

playBtn.addEventListener('click', () => {
  playDayReached();
});

window.addEventListener('resize', () => {
  const scale = layoutBeads();
  placeLottie(scale);
});

buildArc();
const initialScale = layoutBeads();
placeLottie(initialScale);
if (window.lottie) {
  ensureAnim().catch(() => {
    hint.textContent = 'Lottie preload failed — tap play to retry.';
  });
}
