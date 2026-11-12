// Quests + flow from Figma row 5872:391583 → right. See SOURCE.md.
const QUESTS = [
  {
    id: 'whimsy',
    title: 'A Whimsy walk',
    body: 'Find 3 animalistic pattern near you and share them with your local community',
  },
  {
    id: 'noticed',
    title: 'Have you noticed...',
    body: 'Find 3 animalistic pattern near you and share them with your local community',
  },
  {
    id: 'memory',
    title: 'Fond memory',
    body: 'Share a memory of a one place that you find special',
  },
];

const SCREENS = {
  home: 'assets/flow/01.png?v=3',
  homeEntry: 'assets/flow/03.png?v=3',
  mapEmpty: 'assets/flow/05.png?v=3',
  mapPrint: 'assets/flow/06.png?v=3',
  mapTip: 'assets/flow/07.png?v=3',
};

const SHEET_IN_MS = 380;
const STAMP_STEP_MS = 140;
const STAMP_IN_MS = 480;
const FADE_MS = 320;

const underlay = document.getElementById('underlay');
const overlay = document.getElementById('overlay');
const stampsHost = document.getElementById('stamps');
const playBtn = document.getElementById('play');
const resetBtn = document.getElementById('reset');
const closeBtn = document.getElementById('close');
const dim = document.getElementById('dim');
const shineEl = document.getElementById('shine');
const hint = document.getElementById('hint');
const questPicker = document.getElementById('questPicker');
const entryHit = document.getElementById('entryHit');
const mapCamera = document.getElementById('mapCamera');
const mapBack = document.getElementById('mapBack');

/** @type {'home'|'entry'|'menu'|'mapEmpty'|'mapPrint'|'mapTip'} */
let phase = 'home';
let selectedQuest = 0;
let menuOpen = false;
let timers = [];
let fading = false;

function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function setHint(text) {
  hint.textContent = text;
}

function triggerHit() {
  shineEl.classList.remove('is-on');
  void shineEl.offsetWidth;
  shineEl.classList.add('is-on');
}

function setUnderlay(src) {
  if (underlay.getAttribute('src') === src || fading) {
    underlay.src = src;
    return Promise.resolve();
  }
  fading = true;
  underlay.classList.add('is-fading');
  return new Promise((resolve) => {
    later(() => {
      underlay.src = src;
      underlay.classList.remove('is-fading');
      fading = false;
      resolve();
    }, FADE_MS);
  });
}

function syncHits() {
  entryHit.hidden = phase !== 'entry';
  mapCamera.hidden = !(phase === 'mapEmpty' || phase === 'mapPrint' || phase === 'mapTip');
  mapBack.hidden = !(phase === 'mapEmpty' || phase === 'mapPrint' || phase === 'mapTip');
  playBtn.disabled = menuOpen || phase === 'mapEmpty' || phase === 'mapPrint' || phase === 'mapTip';
}

function buildPicker() {
  questPicker.replaceChildren();
  QUESTS.forEach((quest, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = quest.title;
    btn.setAttribute('aria-pressed', i === selectedQuest ? 'true' : 'false');
    btn.addEventListener('click', () => {
      selectedQuest = i;
      Array.from(questPicker.children).forEach((chip, idx) => {
        chip.setAttribute('aria-pressed', idx === selectedQuest ? 'true' : 'false');
      });
      if (menuOpen) paintStamps(false);
      setHint(`Picked “${quest.title}”. Play opens the menu.`);
    });
    questPicker.appendChild(btn);
  });
}

function paintStamps(animateIn) {
  stampsHost.replaceChildren();
  QUESTS.forEach((quest, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'stamp is-hand';
    btn.dataset.index = String(index);
    if (index !== selectedQuest) btn.classList.add('is-dim');

    const face = document.createElement('img');
    face.className = 'stamp-face';
    face.src = 'assets/stamp-card.png?v=3';
    face.alt = '';
    face.decoding = 'async';
    face.draggable = false;

    const reveal = document.createElement('div');
    reveal.className = 'stamp-reveal';
    const copy = document.createElement('div');
    copy.className = 'stamp-copy';
    const title = document.createElement('p');
    title.className = 'stamp-title';
    title.textContent = quest.title;
    const body = document.createElement('p');
    body.className = 'stamp-body';
    body.textContent = quest.body;
    copy.append(title, body);

    const cam = document.createElement('button');
    cam.type = 'button';
    cam.className = 'camera-btn';
    cam.setAttribute('aria-label', `Camera for ${quest.title}`);
    cam.textContent = '📷';
    cam.addEventListener('click', (ev) => {
      ev.stopPropagation();
      enterMap(index);
    });

    reveal.append(copy, cam);
    btn.append(face, reveal);

    btn.addEventListener('click', () => {
      if (!menuOpen) return;
      selectedQuest = index;
      Array.from(questPicker.children).forEach((chip, idx) => {
        chip.setAttribute('aria-pressed', idx === selectedQuest ? 'true' : 'false');
      });
      Array.from(stampsHost.children).forEach((el, idx) => {
        el.classList.toggle('is-dim', idx !== selectedQuest);
        if (idx === selectedQuest) revealStamp(el);
      });
    });

    stampsHost.appendChild(btn);
    if (animateIn) {
      later(() => btn.classList.add('is-in'), SHEET_IN_MS + index * STAMP_STEP_MS);
    } else {
      btn.classList.add('is-in');
    }
  });
}

function revealStamp(btn) {
  if (btn.classList.contains('is-revealed')) return;
  btn.classList.remove('is-hand');
  btn.classList.add('is-revealed');
  triggerHit();
  setHint('Hand settled — tap the camera to enter the map hunt.');
}

function openMenu(fromEntry) {
  clearTimers();
  menuOpen = true;
  phase = 'menu';
  syncHits();
  setUnderlay(fromEntry ? SCREENS.homeEntry : SCREENS.home);
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  paintStamps(true);
  setHint('Hand mode — tap a stamp to reveal, then camera.');
  later(() => {
    // Auto-focus picker selection into hand mode path.
    const target = stampsHost.children[selectedQuest];
    if (target) target.classList.remove('is-dim');
  }, SHEET_IN_MS + STAMP_IN_MS);
}

function closeMenu() {
  menuOpen = false;
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  phase = 'entry';
  setUnderlay(SCREENS.homeEntry).then(() => {
    syncHits();
    setHint('Closed — entry chip on the dock, or Play again.');
  });
}

async function enterMap(questIndex) {
  selectedQuest = questIndex;
  menuOpen = false;
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  phase = 'mapEmpty';
  triggerHit();
  await setUnderlay(SCREENS.mapEmpty);
  syncHits();
  setHint(`Map hunt — ${QUESTS[questIndex].title}. Tap camera.`);
}

async function advanceMap() {
  if (phase === 'mapEmpty') {
    phase = 'mapPrint';
    await setUnderlay(SCREENS.mapPrint);
    syncHits();
    setHint('Footprint on the map — camera again.');
    return;
  }
  if (phase === 'mapPrint') {
    phase = 'mapTip';
    triggerHit();
    await setUnderlay(SCREENS.mapTip);
    syncHits();
    setHint('Tip mode — what other Challangers found. Reset to restart.');
    return;
  }
}

async function goHomeEntry() {
  phase = 'entry';
  menuOpen = false;
  overlay.classList.remove('is-open');
  await setUnderlay(SCREENS.homeEntry);
  syncHits();
  setHint('Home with side-quest entry — tap the chip or Play.');
}

async function resetAll() {
  clearTimers();
  menuOpen = false;
  phase = 'home';
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  shineEl.classList.remove('is-on');
  await setUnderlay(SCREENS.home);
  syncHits();
  setHint('Reset — Play opens Daily Side quests.');
}

playBtn.addEventListener('click', () => openMenu(false));
resetBtn.addEventListener('click', () => resetAll());
closeBtn.addEventListener('click', () => closeMenu());
dim.addEventListener('click', () => closeMenu());
entryHit.addEventListener('click', () => openMenu(true));
mapCamera.addEventListener('click', () => advanceMap());
mapBack.addEventListener('click', () => goHomeEntry());

buildPicker();
syncHits();
setHint('Idle — pick a quest, then Play.');
