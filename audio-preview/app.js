const SNIPPET_START = 0.768;
const SNIPPET_END = 9.024;

const play = document.getElementById('play');
const clip = document.getElementById('clip');
const start = document.getElementById('start');

let raf = 0;

function setPlaying(on) {
  play.classList.toggle('playing', on);
  play.setAttribute('aria-pressed', String(on));
}

function stopClip() {
  clip.pause();
  setPlaying(false);
  cancelAnimationFrame(raf);
  raf = 0;
}

function watchEnd() {
  if ((clip.currentTime || 0) >= SNIPPET_END) {
    clip.pause();
    clip.currentTime = SNIPPET_START;
    setPlaying(false);
    cancelAnimationFrame(raf);
    raf = 0;
    return;
  }
  raf = requestAnimationFrame(watchEnd);
}

async function togglePlay() {
  if (clip.paused) {
    if (clip.currentTime >= SNIPPET_END || clip.currentTime < SNIPPET_START) {
      clip.currentTime = SNIPPET_START;
    }
    try {
      await clip.play();
      setPlaying(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(watchEnd);
    } catch (err) {
      setPlaying(false);
    }
    return;
  }
  stopClip();
}

play.addEventListener('click', togglePlay);
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
setPlaying(false);
