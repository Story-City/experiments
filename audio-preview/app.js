const SNIPPET_START = 0.768;
const SNIPPET_END = 9.024;
const BAR_COUNT = 28;
const BAR_GAP = 3;
const BAR_MIN = 3;
const LABEL = 'Tap to play audio snippet';

const play = document.getElementById('play');
const label = document.getElementById('voiceLabel');
const bars = document.getElementById('bars');
const clip = document.getElementById('clip');
const start = document.getElementById('start');
const ctx2d = bars.getContext('2d');

let raf = 0;

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

// Vertical dictation-style lines, clocked to the playing snippet.
function sampleBars() {
  const values = new Array(BAR_COUNT);
  const t = clip.currentTime || 0;
  for (let i = 0; i < BAR_COUNT; i += 1) {
    const voice = Math.abs(Math.sin(t * 11.2 + i * 0.63));
    const breath = Math.abs(Math.sin(t * 2.7 + i * 1.1));
    const mid = 1 - Math.abs(i - (BAR_COUNT - 1) / 2) / (BAR_COUNT / 2);
    values[i] = 0.12 + (0.35 + 0.55 * voice) * (0.35 + 0.65 * breath) * (0.55 + 0.45 * mid);
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
  if ((clip.currentTime || 0) >= SNIPPET_END) {
    clip.pause();
    clip.currentTime = SNIPPET_START;
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
  if (clip.currentTime >= SNIPPET_END || clip.currentTime < SNIPPET_START) {
    clip.currentTime = SNIPPET_START;
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

play.addEventListener('click', (event) => {
  event.preventDefault();
  togglePlay();
});
clip.addEventListener('ended', stopClip);
clip.addEventListener('error', () => {
  setPlaying(false);
});

document.querySelectorAll('[role="tab"]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    document.querySelectorAll('[role="tab"]').forEach((item) => {
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
label.textContent = LABEL;
setPlaying(false);
