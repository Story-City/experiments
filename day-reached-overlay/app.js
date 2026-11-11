// Constants mirrored from suite-city feature/SC-3526-training-hub
// TrainingHubStreakBannerStyles.ts — do not invent new geometry.
const FIGMA_FRAME_WIDTH = 375;
const BEAD_SMALL_SIZE = 30;
const BEAD_CURRENT_SIZE = 54;
const BEAD_SMALL_LABEL = 12;
const BEAD_CURRENT_LABEL = 16;
const FIGMA_BEADS = [
  { left: 25, top: 95, size: BEAD_SMALL_SIZE, labelSize: BEAD_SMALL_LABEL, label: '1' },
  { left: 75, top: 42, size: BEAD_SMALL_SIZE, labelSize: BEAD_SMALL_LABEL, label: '2' },
  { left: 160, top: 0, size: BEAD_CURRENT_SIZE, labelSize: BEAD_CURRENT_LABEL, label: '3' },
  { left: 261, top: 34, size: BEAD_SMALL_SIZE, labelSize: BEAD_SMALL_LABEL, label: '4' },
  { left: 315, top: 89, size: BEAD_SMALL_SIZE, labelSize: BEAD_SMALL_LABEL, label: '5' },
];
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
const DAY_REACHED_BEAD_REVEAL_MS = 320;
// Genshin-style level toast: soft in → celebrate → readable hold → soft out.
const HAZE_IN_MS = 450;
const HOLD_READABLE_MS = 900;
const HAZE_OUT_MS = 700;

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
const graphic = document.getElementById('graphic');
const beadsHost = document.getElementById('beads');
const arcSvg = document.getElementById('arc');
const lottieHost = document.getElementById('lottie');
const playBtn = document.getElementById('play');
const hint = document.getElementById('hint');
const holdForReview = new URLSearchParams(location.search).has('hold');

let anim = null;
let timers = [];
let playing = false;
let lottieFinished = false;

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function destroyAnim() {
  if (anim) {
    anim.destroy();
    anim = null;
  }
  lottieHost.replaceChildren();
}

function buildArc() {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#5b8cff';
  const ns = 'http://www.w3.org/2000/svg';
  arcSvg.replaceChildren();
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

function buildBeads(hideTodayFace) {
  beadsHost.replaceChildren();
  const scale = graphic.clientWidth / FIGMA_FRAME_WIDTH || 1;
  FIGMA_BEADS.forEach((spec, index) => {
    const el = document.createElement('div');
    el.className = 'bead';
    if (index < TODAY_BEAD_INDEX) el.classList.add('is-complete');
    if (index === TODAY_BEAD_INDEX) {
      el.classList.add('is-today');
      if (hideTodayFace) el.classList.add('is-hidden-face');
      else el.classList.add('is-complete');
    }
    el.style.left = `${spec.left * scale}px`;
    el.style.top = `${spec.top * scale}px`;
    el.style.width = `${spec.size * scale}px`;
    el.style.height = `${spec.size * scale}px`;
    el.style.fontSize = `${spec.labelSize * scale}px`;
    const label = document.createElement('span');
    label.textContent = spec.label;
    el.appendChild(label);
    beadsHost.appendChild(el);
  });
  return scale;
}

function placeLottie(scale) {
  const layout = dayReachedLottieLayout(scale);
  lottieHost.style.left = `${layout.left}px`;
  lottieHost.style.top = `${layout.top}px`;
  lottieHost.style.width = `${layout.width}px`;
  lottieHost.style.height = `${layout.height}px`;
  return layout;
}

function finishPlay() {
  if (!playing) return;
  playing = false;
  clearTimers();
  destroyAnim();
  overlay.classList.remove('is-in', 'is-out');
  overlay.setAttribute('aria-hidden', 'true');
  hint.textContent = 'Done — tap to replay. Beads stay at Training Hub scale.';
  playBtn.disabled = false;
}

function beginDissolve() {
  destroyAnim();
  overlay.classList.remove('is-in');
  overlay.classList.add('is-out');
  later(finishPlay, HAZE_OUT_MS);
}

function onLottieDone() {
  if (lottieFinished || !playing) return;
  lottieFinished = true;
  // Reveal today’s bead before fading Lottie (DAY_REACHED_BEAD_REVEAL_MS).
  buildBeads(false);
  later(() => {
    destroyAnim();
    hint.textContent = holdForReview
      ? 'Held for review (?hold=1). Soft dissolve paused.'
      : 'Holding readable beat, then soft dissolve…';
    if (holdForReview) {
      playBtn.disabled = false;
      playing = false;
      return;
    }
    later(beginDissolve, HOLD_READABLE_MS);
  }, DAY_REACHED_BEAD_REVEAL_MS);
}

function playDayReached() {
  if (!window.lottie || playing) return;
  playing = true;
  lottieFinished = false;
  playBtn.disabled = true;
  hint.textContent = 'Soft haze in → day-reached Lottie on today’s bead…';
  clearTimers();
  destroyAnim();

  buildArc();
  const scale = buildBeads(true);
  placeLottie(scale);

  overlay.classList.remove('is-out');
  overlay.classList.add('is-in');
  overlay.setAttribute('aria-hidden', 'false');

  later(() => {
    anim = window.lottie.loadAnimation({
      container: lottieHost,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'training_hub_day_reached.json',
    });

    anim.addEventListener('DOMLoaded', () => {
      hint.textContent = 'Playing Training Hub day-reached Lottie…';
      anim.goToAndPlay(0, true);
      later(onLottieDone, DAY_REACHED_LOTTIE_FALLBACK_MS);
    });
    anim.addEventListener('complete', onLottieDone);
    anim.addEventListener('data_failed', () => {
      hint.textContent = 'Lottie failed to load.';
      finishPlay();
    });
  }, HAZE_IN_MS);
}

playBtn.addEventListener('click', playDayReached);
window.addEventListener('resize', () => {
  if (!overlay.classList.contains('is-in') && !holdForReview) return;
  const hide = !!document.querySelector('.bead.is-hidden-face');
  const scale = buildBeads(hide);
  placeLottie(scale);
});

buildArc();
buildBeads(false);
