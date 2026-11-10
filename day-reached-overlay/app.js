// Same asset + frame timing as TrainingHubStreakBannerStyles on
// suite-city feature/SC-3526-training-hub.
const DAY_REACHED_LOTTIE_FRAMES = 43;
const DAY_REACHED_LOTTIE_FPS = 30;
const DAY_REACHED_LOTTIE_DURATION_MS = Math.round(
  (DAY_REACHED_LOTTIE_FRAMES / DAY_REACHED_LOTTIE_FPS) * 1000,
);
const DAY_REACHED_LOTTIE_FINISH_GRACE_MS = 600;
const DAY_REACHED_LOTTIE_FALLBACK_MS =
  DAY_REACHED_LOTTIE_DURATION_MS + DAY_REACHED_LOTTIE_FINISH_GRACE_MS;
const DAY_REACHED_FADE_MS = 320;

const overlay = document.getElementById('overlay');
const lottieHost = document.getElementById('lottie');
const playBtn = document.getElementById('play');
const hint = document.getElementById('hint');

let anim = null;
let fallbackTimer = null;
let fadeTimer = null;
let playing = false;

function clearTimers() {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
  if (fadeTimer) {
    clearTimeout(fadeTimer);
    fadeTimer = null;
  }
}

function destroyAnim() {
  if (anim) {
    anim.destroy();
    anim = null;
  }
  lottieHost.replaceChildren();
}

function finishPlay() {
  if (!playing) return;
  playing = false;
  clearTimers();
  overlay.classList.remove('is-on');
  overlay.setAttribute('aria-hidden', 'true');
  destroyAnim();
  hint.textContent = 'Done — tap again to replay over the end-of-story screen.';
  playBtn.disabled = false;
}

function playDayReached() {
  if (!window.lottie) {
    hint.textContent = 'Lottie failed to load.';
    return;
  }
  if (playing) return;

  playing = true;
  playBtn.disabled = true;
  hint.textContent = 'Playing Training Hub day-reached Lottie…';
  clearTimers();
  destroyAnim();

  overlay.classList.add('is-on');
  overlay.setAttribute('aria-hidden', 'false');

  anim = window.lottie.loadAnimation({
    container: lottieHost,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: 'training_hub_day_reached.json',
  });

  const onComplete = () => {
    fadeTimer = setTimeout(finishPlay, DAY_REACHED_FADE_MS);
  };

  anim.addEventListener('complete', onComplete);
  fallbackTimer = setTimeout(onComplete, DAY_REACHED_LOTTIE_FALLBACK_MS);
}

playBtn.addEventListener('click', playDayReached);
