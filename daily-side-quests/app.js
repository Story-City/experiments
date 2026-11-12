// Figma row from 5872:391583 rightward — see SOURCE.md.
const FRAMES = [
  {
    src: 'assets/flow/01.png?v=2',
    label: '1 · Home',
    hint: 'Explore home — start of the row.',
    node: '5872:391583',
  },
  {
    src: 'assets/flow/02.png?v=2',
    label: '2 · Quests closed',
    hint: 'Daily Side quests — stamps unrevealed.',
    node: '5872:390209',
    hit: true,
  },
  {
    src: 'assets/flow/03.png?v=2',
    label: '3 · Entry chip',
    hint: 'Home with side-quest entry on the dock.',
    node: '5872:390968',
  },
  {
    src: 'assets/flow/04.png?v=2',
    label: '4 · Revealed',
    hint: 'Stamps revealed — camera on each quest.',
    node: '5872:392959',
    hit: true,
  },
  {
    src: 'assets/flow/05.png?v=2',
    label: '5 · Map hunt',
    hint: 'A Whimsy Walk map — Debug destination sheet.',
    node: '5897:281964',
  },
  {
    src: 'assets/flow/06.png?v=2',
    label: '6 · Footprint',
    hint: 'Footprint card on the map.',
    node: '5897:281965',
  },
  {
    src: 'assets/flow/07.png?v=2',
    label: '7 · Tip',
    hint: 'Character tip — see what other Challangers found.',
    node: '5897:281966',
    hit: true,
  },
];

const FADE_MS = 420;

const frameEl = document.getElementById('frame');
const chips = document.getElementById('chips');
const hint = document.getElementById('hint');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shineEl = document.getElementById('shine');
const phone = document.getElementById('phone');

let index = 0;
let busy = false;

function triggerHit() {
  shineEl.classList.remove('is-on');
  void shineEl.offsetWidth;
  shineEl.classList.add('is-on');
}

function renderChips() {
  chips.replaceChildren();
  FRAMES.forEach((frame, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = frame.label;
    btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    btn.addEventListener('click', () => goTo(i));
    chips.appendChild(btn);
  });
}

function syncChrome() {
  const frame = FRAMES[index];
  hint.textContent = `${frame.hint} (${frame.node})`;
  prevBtn.disabled = index === 0 || busy;
  nextBtn.disabled = index === FRAMES.length - 1 || busy;
  Array.from(chips.children).forEach((chip, i) => {
    chip.setAttribute('aria-pressed', i === index ? 'true' : 'false');
  });
}

function goTo(next) {
  if (busy || next === index || next < 0 || next >= FRAMES.length) return;
  busy = true;
  syncChrome();
  frameEl.classList.add('is-fading');
  window.setTimeout(() => {
    index = next;
    const frame = FRAMES[index];
    frameEl.src = frame.src;
    frameEl.alt = frame.label;
    frameEl.classList.remove('is-fading');
    if (frame.hit) triggerHit();
    busy = false;
    syncChrome();
  }, FADE_MS);
}

prevBtn.addEventListener('click', () => goTo(index - 1));
nextBtn.addEventListener('click', () => goTo(index + 1));
phone.addEventListener('click', () => {
  if (index < FRAMES.length - 1) goTo(index + 1);
});

renderChips();
syncChrome();
frameEl.alt = FRAMES[0].label;
