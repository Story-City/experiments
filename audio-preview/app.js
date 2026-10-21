const TIP_SLIDE_MS = 320;
const SNIPPET_END = 9.024;

const LINES = [
  { start: 0.768, end: 2.976, text: 'Welcome to Tales from the Incident.' },
  { start: 3.808, end: 9.024, text: 'Every street has a story. Most people just walk past them. You won’t.' },
];

const tip = document.getElementById('tip');
const recall = document.getElementById('recall');
const tipLabel = document.getElementById('tipLabel');
const tipText = document.getElementById('tipText');
const clip = document.getElementById('clip');
const start = document.getElementById('start');

let hideTimer = 0;
let raf = 0;
let tipOpen = false;

function stopClip() {
  clip.pause();
  setPlaying(false);
  cancelAnimationFrame(raf);
  raf = 0;
}

function showTip() {
  clearTimeout(hideTimer);
  tipOpen = true;
  recall.hidden = true;
  tip.hidden = false;
  tip.classList.remove('out');
  void tip.offsetWidth;
  tip.classList.add('in');
}

function hideTip() {
  if (!tipOpen) return;
  tipOpen = false;
  stopClip();
  tip.classList.remove('in');
  tip.classList.add('out');
  hideTimer = setTimeout(() => {
    tip.hidden = true;
    recall.hidden = false;
  }, TIP_SLIDE_MS);
}

function setPlaying(on) {
  tip.classList.toggle('playing', on);
  tip.setAttribute('aria-pressed', String(on));
  tipLabel.textContent = on ? 'Playing' : 'Tap to play';
  if (!on) tipText.textContent = LINES[0].text;
}

function syncLine() {
  const t = clip.currentTime || 0;
  if (t >= SNIPPET_END) {
    clip.pause();
    clip.currentTime = LINES[0].start;
    setPlaying(false);
    cancelAnimationFrame(raf);
    raf = 0;
    return;
  }
  const line = LINES.find((item) => t >= item.start && t < item.end) || LINES[LINES.length - 1];
  if (tipText.textContent !== line.text) tipText.textContent = line.text;
  raf = requestAnimationFrame(syncLine);
}

async function togglePlay() {
  if (clip.paused) {
    if (clip.currentTime >= SNIPPET_END || clip.currentTime < LINES[0].start) {
      clip.currentTime = LINES[0].start;
    }
    try {
      await clip.play();
      setPlaying(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncLine);
    } catch (err) {
      setPlaying(false);
    }
    return;
  }
  stopClip();
}

tip.addEventListener('click', (event) => {
  event.stopPropagation();
  togglePlay();
});

recall.addEventListener('click', showTip);

// Sample-story put-away: after the tip has sat a moment, tap empty audio panel to tuck it.
document.getElementById('panel-audio').addEventListener('click', (event) => {
  if (event.target.closest('#tip') || event.target.closest('#recall')) return;
  if (tipOpen && !tip.classList.contains('playing')) hideTip();
});

clip.addEventListener('ended', stopClip);

document.querySelectorAll('[role="tab"]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    document.querySelectorAll('[role="tab"]').forEach((item) => {
      item.setAttribute('aria-selected', String(item === tab));
    });
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== name;
    });
    if (name !== 'audio') stopClip();
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

press(tip);
press(start);
setPlaying(false);
showTip();
