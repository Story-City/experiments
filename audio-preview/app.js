const TIP_HOLD_MS = 2000;
const TIP_SLIDE_MS = 320;

const tip = document.getElementById('tip');
const recall = document.getElementById('recall');
const audioButton = document.querySelector('.audio-button');
const start = document.getElementById('start');

let armed = false;
let holdTimer = 0;
let hideTimer = 0;

function showTip() {
  clearTimeout(holdTimer);
  clearTimeout(hideTimer);
  armed = false;
  recall.hidden = true;
  tip.hidden = false;
  tip.classList.remove('out');
  void tip.offsetWidth;
  tip.classList.add('in');
  holdTimer = setTimeout(() => {
    armed = true;
  }, TIP_HOLD_MS);
}

function hideTip() {
  if (!armed) return;
  armed = false;
  tip.classList.remove('in');
  tip.classList.add('out');
  hideTimer = setTimeout(() => {
    tip.hidden = true;
    recall.hidden = false;
  }, TIP_SLIDE_MS);
}

tip.addEventListener('click', (event) => {
  if (event.target.closest('.audio-button')) return;
  hideTip();
});

recall.addEventListener('click', showTip);

document.querySelectorAll('[role="tab"]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    document.querySelectorAll('[role="tab"]').forEach((item) => {
      item.setAttribute('aria-selected', String(item === tab));
    });
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== name;
    });
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

press(audioButton);
press(start);
showTip();
