const MODES = {
  app: {
    glow: 'is-app',
    lottie: false,
    note: 'Idle: opacity pulse like useBannerPulse (0.3 ↔ 1, 2.6s). Tap: press scale only.',
  },
  soft: {
    glow: 'is-soft',
    lottie: false,
    note: 'Softer halo, narrower opacity swing (0.42 ↔ 0.82), slower. Tap: press scale only.',
  },
  wide: {
    glow: 'is-wide',
    lottie: false,
    note: 'Soft + wider blur bloom. Still only the glow layer breathes. Tap: press scale only.',
  },
  breathe: {
    glow: 'is-breathe',
    lottie: false,
    note: 'Glow opacity + tiny scale breathe. Button face stays solid. Tap: press scale only.',
  },
  lottie: {
    glow: 'is-lottie',
    lottie: true,
    note: 'Soft idle glow. Tap plays a soft yellow Lottie burst over the CTA.',
  },
};

const glow = document.getElementById('glow');
const cta = document.getElementById('cta');
const note = document.getElementById('note');
const lottieHost = document.getElementById('lottie');
const chips = [...document.querySelectorAll('.chip')];

let mode = 'app';
let anim = null;

function setMode(next) {
  mode = next;
  const cfg = MODES[mode];
  glow.className = `cta-glow ${cfg.glow}`;
  lottieHost.classList.toggle('is-on', cfg.lottie);
  note.textContent = cfg.note;
  chips.forEach((chip) => {
    const on = chip.dataset.mode === mode;
    chip.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function playTapBurst() {
  if (!window.lottie || !MODES[mode].lottie) return;
  if (anim) {
    anim.destroy();
    anim = null;
  }
  lottieHost.replaceChildren();
  anim = window.lottie.loadAnimation({
    container: lottieHost,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: 'tap-burst.json',
  });
  anim.addEventListener('complete', () => {
    if (anim) {
      anim.destroy();
      anim = null;
    }
    lottieHost.replaceChildren();
  });
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => setMode(chip.dataset.mode));
});

cta.addEventListener('pointerdown', () => cta.classList.add('is-pressed'));
cta.addEventListener('pointerup', () => cta.classList.remove('is-pressed'));
cta.addEventListener('pointercancel', () => cta.classList.remove('is-pressed'));
cta.addEventListener('pointerleave', () => cta.classList.remove('is-pressed'));

cta.addEventListener('click', () => {
  playTapBurst();
});

setMode('app');
