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
const COPY_CELEBRATE_MS = 780;
const FUTURE_DAYS_AFTER_COPY_MS = 360;
const HAZE_IN_MS = 160;
const SHINE_MS = 1400;
const HOLD_AFTER_SHINE_MS = 500;
// Hold the settled static frame — don’t rush dissolve.
const HOLD_READABLE_MS = SHINE_MS + HOLD_AFTER_SHINE_MS;
const HAZE_OUT_MS = 300;
const SIDE_BEADS_FADE_IN_MS = 520;
const SIDE_BEADS_FADE_OUT_MS = 380;
// Past days: same bubble rhythm as the ending pair — delayed to land with settle.
const SIDE_DOMINO_DURING_ORDER = [0, 1];
const SIDE_DOMINO_AFTER_ORDER = [3, 4];
const SIDE_DOMINO_OUT_ORDER = [4, 3, 1, 0];
const SIDE_DOMINO_AFTER_STEP_MS = 300;
const SIDE_DOMINO_DURING_STEP_MS = SIDE_DOMINO_AFTER_STEP_MS;
const SIDE_DOMINO_DURING_SPAN_MS =
  SIDE_BEADS_FADE_IN_MS +
  SIDE_DOMINO_DURING_STEP_MS * Math.max(0, SIDE_DOMINO_DURING_ORDER.length - 1);
const SIDE_DOMINO_DURING_START_MS = Math.max(
  0,
  DAY_REACHED_LOTTIE_DURATION_MS - SIDE_DOMINO_DURING_SPAN_MS,
);
const DISSOLVE_WAIT_MS = Math.max(
  HAZE_OUT_MS,
  SIDE_BEADS_FADE_OUT_MS + SIDE_DOMINO_AFTER_STEP_MS * (SIDE_DOMINO_OUT_ORDER.length - 1),
);
const STREAK_COUNT = 3;

const UNDERLAY_CACHE = 'v=35';
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
const DEFAULT_ACCENT_HEX = '#009EFF';
const LOTTIE_SRC = 'training_hub_day_reached.json';
// Source Lottie blues / green (0–1) — remapped to the active accent.
const LOTTIE_BLUE_A = [0.4, 0.8, 1];
const LOTTIE_BLUE_B = [0.388, 0.71, 1];
const LOTTIE_GREEN = [0.184, 0.753, 0.239];
const COLOR_EPS = 0.02;

let activeAccentHex = DEFAULT_ACCENT_HEX;
let lottieMaster = null;
let accentReload = null;

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
  // Hub: settle diameter maps 1:1 onto the today bead.
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
const arcFade = document.getElementById('arcFade');
const playBtn = document.getElementById('play');
const hint = document.getElementById('hint');
const phone = document.getElementById('phone');
const underlay = document.getElementById('underlay');
const accentColorEl = document.getElementById('accentColor');
const accentHexEl = document.getElementById('accentHex');
const accentApplyEl = document.getElementById('accentApply');
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

function normalizeHex(raw) {
  const t = String(raw || '').trim();
  const m = t.match(/^#?([0-9a-fA-F]{6})$/);
  if (!m) return null;
  return `#${m[1].toUpperCase()}`;
}

function hexToRgb01(hex) {
  const n = hex.replace('#', '');
  return [
    parseInt(n.slice(0, 2), 16) / 255,
    parseInt(n.slice(2, 4), 16) / 255,
    parseInt(n.slice(4, 6), 16) / 255,
  ];
}

function hexToRgbCss(hex) {
  const n = hex.replace('#', '');
  return `${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)}`;
}

function softFromHex(hex) {
  const soft = hexToRgb01(hex).map((c) => Math.round(Math.min(1, c * 0.45 + 0.55) * 255));
  return `#${soft.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function currentAccent() {
  return {
    hex: activeAccentHex,
    rgb: hexToRgbCss(activeAccentHex),
    soft: softFromHex(activeAccentHex),
  };
}

function colorNear(a, b) {
  return (
    Math.abs(a[0] - b[0]) < COLOR_EPS &&
    Math.abs(a[1] - b[1]) < COLOR_EPS &&
    Math.abs(a[2] - b[2]) < COLOR_EPS
  );
}

function tintLottieData(master, accentHex) {
  const data = JSON.parse(JSON.stringify(master));
  const solid = hexToRgb01(accentHex);
  const light = solid.map((c) => Math.min(1, c * 0.55 + 0.45));
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if ((node.ty === 'fl' || node.ty === 'st') && node.c && Array.isArray(node.c.k) && typeof node.c.k[0] === 'number') {
      const k = node.c.k;
      if (colorNear(k, LOTTIE_BLUE_A) || colorNear(k, LOTTIE_BLUE_B)) {
        node.c.k = [...light, k[3] ?? 1];
      } else if (colorNear(k, LOTTIE_GREEN)) {
        node.c.k = [...solid, k[3] ?? 1];
      }
    }
    Object.values(node).forEach(walk);
  };
  walk(data);
  return data;
}

function applyAccentVars() {
  const accent = currentAccent();
  const root = document.documentElement.style;
  root.setProperty('--accent', accent.hex);
  root.setProperty('--accent-rgb', accent.rgb);
  root.setProperty('--accent-soft', accent.soft);
}

function buildArc() {
  arcSvg.replaceChildren();
  const accent = currentAccent().hex;
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
    el.dataset.bead = String(index);
    if (index < TODAY_BEAD_INDEX) el.classList.add('is-complete');
    if (index === TODAY_BEAD_INDEX) el.classList.add('is-today');
    if (SIDE_FAR_INDEXES.has(index)) el.classList.add('is-side-far');
    if (SIDE_NEAR_INDEXES.has(index)) el.classList.add('is-side-near');
    el.style.left = `${spec.left * scale}px`;
    el.style.top = `${spec.top * scale}px`;
    el.style.width = `${spec.size * scale}px`;
    el.style.height = `${spec.size * scale}px`;
    el.style.fontSize = `${spec.labelSize * scale}px`;
    const label = document.createElement('span');
    label.textContent = weekdayLabel(date);
    el.appendChild(label);
    beadsHost.appendChild(el);
  });
  return scale;
}

function setTodayFace(visible) {
  const todayEl = beadsHost.children[TODAY_BEAD_INDEX];
  if (!todayEl) return;
  todayEl.classList.add('is-today');
  todayEl.classList.toggle('is-complete', visible);
  todayEl.classList.toggle('is-hidden-face', !visible);
}

function placeLottie(scale) {
  const layout = dayReachedLottieLayout(scale);
  lottieHost.style.left = `${layout.left}px`;
  lottieHost.style.top = `${layout.top}px`;
  lottieHost.style.width = `${layout.width}px`;
  lottieHost.style.height = `${layout.height}px`;
  lottieHost.style.overflow = 'visible';
  lottieHost.style.opacity = '1';
}

function setCopyVisible(on) {
  copyEl.classList.toggle('is-on', on);
  copyEl.setAttribute('aria-hidden', on ? 'false' : 'true');
}

function triggerGloryShine() {
  shineEl.classList.remove('is-on');
  void shineEl.offsetWidth;
  shineEl.classList.add('is-on');
}

function clearGloryShine() {
  shineEl.classList.remove('is-on');
}

function setArcSettled(on) {
  arcFade.classList.toggle('is-settled', on);
}

function clearSideDomino() {
  Array.from(beadsHost.children).forEach((el) => {
    el.classList.remove('is-side-shown', 'is-side-hiding');
  });
}

function revealSideBead(index) {
  const el = beadsHost.children[index];
  if (!el) return;
  el.classList.remove('is-side-hiding');
  el.classList.add('is-side-shown');
}

function runSideDominoDuring() {
  SIDE_DOMINO_DURING_ORDER.forEach((index, step) => {
    later(() => {
      if (!playing) return;
      revealSideBead(index);
    }, SIDE_DOMINO_DURING_START_MS + step * SIDE_DOMINO_DURING_STEP_MS);
  });
}

function runSideDominoAfterSettle() {
  SIDE_DOMINO_AFTER_ORDER.forEach((index, step) => {
    later(() => {
      if (!lottieFinished) return;
      revealSideBead(index);
    }, step * SIDE_DOMINO_AFTER_STEP_MS);
  });
}

function runSideDominoOut() {
  SIDE_DOMINO_OUT_ORDER.forEach((index, step) => {
    later(() => {
      const el = beadsHost.children[index];
      if (!el) return;
      el.classList.remove('is-side-shown');
      el.classList.add('is-side-hiding');
    }, step * SIDE_DOMINO_AFTER_STEP_MS);
  });
}

function stopAnimAtStart() {
  if (!anim) return;
  anim.pause();
  anim.goToAndStop(0, true);
}

function destroyAnim() {
  if (anim) {
    anim.removeEventListener('complete', onLottieDone);
    anim.destroy();
  }
  anim = null;
  animReady = false;
  animLoading = null;
  lottieHost.replaceChildren();
}

function loadMasterLottie() {
  if (lottieMaster) return Promise.resolve(lottieMaster);
  return fetch(LOTTIE_SRC)
    .then((res) => {
      if (!res.ok) throw new Error('Lottie fetch failed');
      return res.json();
    })
    .then((data) => {
      lottieMaster = data;
      return data;
    });
}

function ensureAnim() {
  if (animReady && anim) return Promise.resolve(anim);
  if (animLoading) return animLoading;
  animLoading = loadMasterLottie()
    .then((master) => new Promise((resolve, reject) => {
      anim = window.lottie.loadAnimation({
        container: lottieHost,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: tintLottieData(master, currentAccent().hex),
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
    }))
    .catch((err) => {
      animLoading = null;
      throw err;
    });
  return animLoading;
}

function finishPlay() {
  playing = false;
  clearTimers();
  setCopyVisible(false);
  clearGloryShine();
  setArcSettled(false);
  setTodayFace(false);
  clearSideDomino();
  stopAnimAtStart();
  playLayer.classList.remove('is-in', 'is-out');
  overlay.setAttribute('aria-hidden', 'true');
  hint.textContent = 'Done — switch underlay or replay.';
  playBtn.disabled = false;
}

function beginDissolve() {
  setCopyVisible(false);
  clearGloryShine();
  runSideDominoOut();
  playLayer.classList.remove('is-in');
  playLayer.classList.add('is-out');
  later(() => {
    stopAnimAtStart();
    finishPlay();
  }, DISSOLVE_WAIT_MS);
}

function onLottieDone() {
  if (lottieFinished || !playing) return;
  lottieFinished = true;
  setArcSettled(true);
  setTodayFace(true);
  // Drop the Lottie frame immediately — bead is the settle target.
  stopAnimAtStart();
  lottieHost.style.opacity = '0';
  // Hit effect (copy + glory shine) lands with the animation finish.
  setCopyVisible(true);
  triggerGloryShine();
  // Days after today wait until the streak line has its moment.
  later(() => {
    if (!lottieFinished) return;
    runSideDominoAfterSettle();
  }, FUTURE_DAYS_AFTER_COPY_MS);
  later(() => {
    hint.textContent = holdForReview
      ? 'Held for review (?hold=1). Soft dissolve paused.'
      : 'Settled static — dissolve when ready…';
    if (holdForReview) {
      playBtn.disabled = false;
      playing = false;
      return;
    }
    later(
      beginDissolve,
      HOLD_READABLE_MS + COPY_CELEBRATE_MS + FUTURE_DAYS_AFTER_COPY_MS,
    );
  }, DAY_REACHED_BEAD_REVEAL_MS);
}

async function playDayReached() {
  if (!window.lottie) return;
  // Restart from the top if already mid-play — tester can spam tap / Space.
  if (playing) {
    clearTimers();
    if (anim) {
      anim.removeEventListener('complete', onLottieDone);
      stopAnimAtStart();
    }
  }
  playing = true;
  lottieFinished = false;
  playBtn.disabled = true;
  hint.textContent = 'Day reached…';
  clearTimers();
  setCopyVisible(false);
  clearGloryShine();
  setArcSettled(false);
  lottieHost.style.opacity = '1';

  buildArc();
  const scale = layoutBeads();
  clearSideDomino();
  setTodayFace(false);
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
    // Count backwards from Lottie finish: arc + past days land static with it.
    void arcFade.offsetWidth;
    setArcSettled(true);
    runSideDominoDuring();
    later(onLottieDone, DAY_REACHED_LOTTIE_FALLBACK_MS);
  }, HAZE_IN_MS);
}

function setSurface(name) {
  const shot = UNDERLAYS[name] ?? UNDERLAYS.adventure;
  phone.dataset.surface = name;
  underlay.src = shot.src;
  underlay.alt = shot.alt;
  document.querySelectorAll('.chip[data-surface]').forEach((chip) => {
    chip.setAttribute('aria-pressed', chip.dataset.surface === name ? 'true' : 'false');
  });
}

function syncAccentInputs(hex) {
  accentColorEl.value = hex.toLowerCase();
  accentHexEl.value = hex;
}

function setAccentHex(raw, { play = false } = {}) {
  const hex = normalizeHex(raw);
  if (!hex) {
    hint.textContent = 'Use a 6-digit hex like #009EFF.';
    syncAccentInputs(activeAccentHex);
    return Promise.resolve();
  }
  activeAccentHex = hex;
  syncAccentInputs(hex);
  applyAccentVars();
  buildArc();
  if (accentReload) return accentReload;
  destroyAnim();
  accentReload = ensureAnim()
    .then(() => {
      placeLottie(layoutBeads());
      accentReload = null;
      if (play) return playDayReached();
      hint.textContent = `${hex} ready — tap Play or the phone.`;
    })
    .catch(() => {
      accentReload = null;
      hint.textContent = 'Lottie tint failed — tap Play to retry.';
    });
  return accentReload;
}

document.querySelectorAll('.chip[data-surface]').forEach((chip) => {
  chip.addEventListener('click', () => setSurface(chip.dataset.surface));
});
accentColorEl.addEventListener('input', () => {
  setAccentHex(accentColorEl.value, { play: false });
});
accentHexEl.addEventListener('change', () => {
  setAccentHex(accentHexEl.value, { play: false });
});
accentHexEl.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  setAccentHex(accentHexEl.value, { play: true });
});
accentApplyEl.addEventListener('click', () => {
  setAccentHex(accentHexEl.value || accentColorEl.value, { play: true });
});

playBtn.addEventListener('click', () => {
  playDayReached();
});

// Phone itself is the tester control — not only the blue Play button.
phone.addEventListener('click', () => {
  playDayReached();
});
phone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    playDayReached();
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key !== ' ') return;
  const tag = (event.target && event.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
  event.preventDefault();
  playDayReached();
});

window.addEventListener('resize', () => {
  const scale = layoutBeads();
  placeLottie(scale);
});

laidOutScale = 0;
applyAccentVars();
buildArc();
const initialScale = layoutBeads();
placeLottie(initialScale);
if (window.lottie) {
  ensureAnim()
    .then(() => {
      hint.textContent = 'Ready — tap the phone to test.';
      playDayReached();
    })
    .catch(() => {
      hint.textContent = 'Lottie preload failed — tap the phone to retry.';
    });
}
