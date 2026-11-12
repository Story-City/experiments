// Quests from Figma 5550:355652 / 5569:278* (hidden until reveal).
const QUESTS = [
  {
    title: 'A Whimsy walk',
    body: 'Find 3 animalistic pattern near you and share them with your local community',
  },
  {
    title: 'Have you noticed...',
    body: 'Find 3 animalistic pattern near you and share them with your local community',
  },
  {
    title: 'Fond memory',
    body: 'Share a memory of a one place that you find special',
  },
];

const STAMP_STEP_MS = 160;
const STAMP_IN_MS = 520;
const SHEET_IN_MS = 420;

const overlay = document.getElementById('overlay');
const sheet = document.getElementById('sheet');
const stampsHost = document.getElementById('stamps');
const openBtn = document.getElementById('open');
const closeBtn = document.getElementById('close');
const dim = document.getElementById('dim');
const shineEl = document.getElementById('shine');
const hint = document.getElementById('hint');

let open = false;
let timers = [];

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function triggerGloryShine() {
  shineEl.classList.remove('is-on');
  void shineEl.offsetWidth;
  shineEl.classList.add('is-on');
}

function buildStamps() {
  stampsHost.replaceChildren();
  QUESTS.forEach((quest, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'stamp';
    btn.dataset.index = String(index);
    btn.setAttribute('aria-label', `Side quest ${index + 1}: tap to reveal`);

    const face = document.createElement('img');
    face.className = 'stamp-face';
    face.src = 'assets/stamp-card.png?v=1';
    face.alt = '';
    face.decoding = 'async';
    face.draggable = false;

    const reveal = document.createElement('div');
    reveal.className = 'stamp-reveal';
    const title = document.createElement('p');
    title.className = 'stamp-title';
    title.textContent = quest.title;
    const body = document.createElement('p');
    body.className = 'stamp-body';
    body.textContent = quest.body;
    reveal.append(title, body);

    btn.append(face, reveal);
    btn.addEventListener('click', () => revealStamp(btn));
    stampsHost.appendChild(btn);
  });
}

function revealStamp(btn) {
  if (!open || btn.classList.contains('is-revealed')) return;
  btn.classList.add('is-revealed');
  btn.setAttribute('aria-label', btn.querySelector('.stamp-title').textContent);
  triggerGloryShine();
  hint.textContent = 'Quest revealed — tap another stamp, or close.';
}

function resetStamps() {
  Array.from(stampsHost.children).forEach((el) => {
    el.classList.remove('is-revealed', 'is-in');
  });
}

function openModal() {
  if (open) return;
  open = true;
  clearTimers();
  resetStamps();
  shineEl.classList.remove('is-on');
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  openBtn.disabled = true;
  hint.textContent = 'Modal open — stamps easing in…';

  Array.from(stampsHost.children).forEach((el, step) => {
    later(() => {
      if (!open) return;
      el.classList.add('is-in');
    }, SHEET_IN_MS + step * STAMP_STEP_MS);
  });

  later(() => {
    if (!open) return;
    hint.textContent = 'Tap a stamp to reveal its side quest.';
  }, SHEET_IN_MS + STAMP_IN_MS + STAMP_STEP_MS * (QUESTS.length - 1));
}

function closeModal() {
  if (!open) return;
  open = false;
  clearTimers();
  shineEl.classList.remove('is-on');
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  openBtn.disabled = false;
  hint.textContent = 'Closed — open again anytime.';
  later(resetStamps, 300);
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
dim.addEventListener('click', closeModal);

buildStamps();
