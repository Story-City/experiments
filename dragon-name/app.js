const PARTS = ['sharp-toothed', 'green-eyed', 'fire-eater'];
const DECOYS = ['three-headed', 'gold-hoarding'];
const ANSWER = PARTS.join('-');
const MAX_TYPOS = 3;

const variant = new URLSearchParams(location.search).get('v') === 'text' ? 'text' : 'jumble';
const $ = (id) => document.getElementById(id);
const msg = $('msg'), submit = $('submit');
const slots = PARTS.map(() => null);

function norm(s) { return s.toLowerCase().replace(/[^a-z]/g, ''); }

function distance(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

function matchesTyped(text) {
  return distance(norm(text), norm(ANSWER)) <= MAX_TYPOS;
}

function matchesJumble() {
  return slots.every((t) => t) && slots.every((t, i) => t === PARTS[i]);
}

function shuffled(list) {
  const a = list.slice();
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a.length > 1 && a.every((x, i) => x === list[i]));
  return a;
}

function makeTag(word) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'tag';
  b.textContent = word;
  b.dataset.word = word;
  return b;
}

function render() {
  const slotsEl = $('slots'), tray = $('tray');
  slotsEl.replaceChildren();
  tray.replaceChildren();
  slots.forEach((word, i) => {
    const el = document.createElement('div');
    el.className = 'slot' + (word ? ' full' : '');
    el.dataset.i = i;
    if (word) el.append(makeTag(word));
    else el.textContent = 'Slot ' + (i + 1);
    slotsEl.append(el);
  });
  const placed = new Set(slots);
  shuffleOrder.filter((w) => !placed.has(w)).forEach((w) => tray.append(makeTag(w)));
  submit.disabled = slots.some((t) => !t);
  msg.textContent = '';
}

function slotAt(x, y) {
  const el = document.elementFromPoint(x, y);
  return el && el.closest('.slot');
}

function place(word, slotIndex) {
  const from = slots.indexOf(word);
  if (from !== -1) slots[from] = null;
  if (slots[slotIndex]) {
    const bumped = slots[slotIndex];
    slots[slotIndex] = null;
    if (from !== -1) slots[from] = bumped;
  }
  slots[slotIndex] = word;
  render();
}

function unplace(word) {
  const i = slots.indexOf(word);
  if (i !== -1) slots[i] = null;
  render();
}

function wireDrag() {
  let drag = null;
  document.addEventListener('pointerdown', (e) => {
    const tag = e.target.closest('.tag');
    if (!tag || !$('jumble').contains(tag)) return;
    e.preventDefault();
    const ghost = tag.cloneNode(true);
    ghost.classList.add('drag-ghost');
    document.body.append(ghost);
    tag.classList.add('lifted');
    drag = { word: tag.dataset.word, tag, ghost, sx: e.clientX, sy: e.clientY, moved: false };
    move(e);
  });
  function move(e) {
    if (!drag) return;
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true;
    drag.ghost.style.left = e.clientX + 'px';
    drag.ghost.style.top = e.clientY + 'px';
    document.querySelectorAll('.slot.over').forEach((s) => s.classList.remove('over'));
    const s = slotAt(e.clientX, e.clientY);
    if (s) s.classList.add('over');
  }
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { word, ghost, moved, tag } = drag;
    drag = null;
    ghost.remove();
    tag.classList.remove('lifted');
    document.querySelectorAll('.slot.over').forEach((s) => s.classList.remove('over'));
    const target = slotAt(e.clientX, e.clientY);
    const inSlot = slots.includes(word);
    if (!moved) {
      if (inSlot) return unplace(word);
      const free = slots.indexOf(null);
      return free === -1 ? undefined : place(word, free);
    }
    if (target) place(word, Number(target.dataset.i));
    else if (inSlot) unplace(word);
  });
  document.addEventListener('pointercancel', () => {
    if (!drag) return;
    drag.ghost.remove();
    drag.tag.classList.remove('lifted');
    drag = null;
  });
}

function fail(text) {
  msg.textContent = text;
  const target = variant === 'text' ? $('entry') : $('slots');
  target.classList.remove('nudge');
  void target.offsetWidth;
  target.classList.add('nudge');
}

function finish() {
  $('doneName').textContent = PARTS.join(' ');
  document.querySelector('.phone > .screen:not(.done)').hidden = true;
  $('done').hidden = false;
}

submit.addEventListener('click', () => {
  if (variant === 'text') {
    if (!norm($('name').value)) return fail('Type the dragon’s name first.');
    return matchesTyped($('name').value) ? finish() : fail('That is not the name in the research file.');
  }
  matchesJumble() ? finish() : fail('Those tags do not fit the dragon in your photo.');
});
$('name').addEventListener('keydown', (e) => { if (e.key === 'Enter') submit.click(); });
$('again').addEventListener('click', () => location.reload());

let shuffleOrder = [];
if (variant === 'text') {
  $('entry').hidden = false;
  $('name').focus({ preventScroll: true });
} else {
  $('jumble').hidden = false;
  shuffleOrder = shuffled([...PARTS, ...DECOYS]);
  wireDrag();
  render();
  submit.disabled = true;
}
