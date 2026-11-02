import { register } from './more.js';
import { STORIES, STORY_FOR, STORY_WORDS } from './stories-data.js';
import { SECTIONS, MORE_WALKS, QUESTS, QUEST_WORDS } from './more-words.js';
import { HOME, WALKS, HERO, tonightId, REMIND, CAMERA, POSTCARD, BINGO, PUMPKIN, CAT, ROULETTE, SHARE } from './walks.js';

const screen = document.getElementById('screen');
const sheet = document.getElementById('sheet');
const scrim = document.getElementById('scrim');
const toastEl = document.getElementById('toast');
const camInput = document.getElementById('camInput');

let where = 'out';          // 'out' | 'home'
let leave = null;           // cleanup for the current walk (timers)
let current = null;         // the walk being played
const phone = document.getElementById('phone');

/* ---------- tiny helpers ---------- */
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
  return el;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);

function show(...kids) {
  closeSheet();
  screen.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));
  screen.style.animation = 'none'; void screen.offsetWidth; screen.style.animation = '';
  screen.scrollTop = 0;
  if (current?.id && screen.querySelector('[data-end]')) { markDone(); offerStory(); offerShare(); offerNudge(); }
}

/* ---------- what you've walked: a count and a keepsake per walk, kept on this phone ---------- */
const MEM_KEY = 'whimsy-walked-v1';
let walked = {};
try { walked = JSON.parse(localStorage.getItem(MEM_KEY)) || {}; } catch { walked = {}; }
const saveWalked = () => { try { localStorage.setItem(MEM_KEY, JSON.stringify(walked)); } catch { /* storage full or blocked: still works this visit */ } };

// Called when a walk's end screen appears. Keeps its title, a small photo and/or a line of text.
function markDone() {
  const id = current.id;
  if (walked[id]?.lastRun === runId) return; // re-renders of the same end screen count once
  const rec = walked[id] = { count: (walked[id]?.count || 0) + 1, at: Date.now(), lastRun: runId, keep: {} };
  const title = screen.querySelector('h2.display') || screen.querySelector('.kicker');
  rec.keep.title = title?.textContent || '';
  const words = screen.querySelector('.poem, .frame .big, .note p, .quest-line, .postcard .title');
  if (words) rec.keep.text = words.innerText.replace(/\s+\n/g, '\n').slice(0, 220);
  const img = screen.querySelector('#screen img');
  saveWalked();
  if (img) thumb(img.src).then((t) => { if (t) { rec.keep.img = t; saveWalked(); } });
}
let runId = 0;

/* ---------- every walk ends by handing off to a real story ---------- */
const PROG_KEY = 'whimsy-story-v1';
let storyProg = {};
try { storyProg = JSON.parse(localStorage.getItem(PROG_KEY)) || {}; } catch { storyProg = {}; }
function storyFor(id) {
  const q = QUESTS.find((x) => x.id === id);
  return STORY_FOR[q ? (q.spooky ? 'spookyQuest' : 'quest') : id];
}
// Each finished walk walks a little of chapter 2. It starts part-way, so it already feels underway.
const storyPct = (key) => Math.min(95, 20 + 15 * (storyProg[key] || 0));
function offerStory() {
  const link = storyFor(current.id);
  if (!link || screen.querySelector('.story-next')) return;
  const [key, bridge] = link;
  const st = STORIES[key];
  if (storyProg.lastRun !== runId) {
    storyProg[key] = (storyProg[key] || 0) + 1; storyProg.lastRun = runId;
    try { localStorage.setItem(PROG_KEY, JSON.stringify(storyProg)); } catch { /* fine */ }
  }
  const pct = storyPct(key);
  const block = h('section', { class: 'story-next' },
    h('p', { class: 'kicker' }, STORY_WORDS.kicker),
    h('div', { class: 'story-row' },
      st.cover ? h('img', { class: 'story-cover', src: st.cover, alt: '', loading: 'lazy' }) : h('div', { class: 'story-cover blank' }, '✦'),
      h('div', {}, h('b', {}, st.title), h('span', {}, bridge))),
    h('p', { class: 'story-tease' }, `“${st.teaser}”`),
    h('div', { class: 'story-bar', role: 'img', 'aria-label': STORY_WORDS.bar(st.title, pct) }, h('i', { style: `width:${pct}%` })),
    h('p', { class: 'hint' }, STORY_WORDS.bar(st.title, pct)),
    h('button', { class: 'btn primary', id: 'readStory', onclick: () => chapterSheet(st) }, STORY_WORDS.read));
  const btns = screen.querySelector('.btns:last-of-type');
  btns ? btns.before(block) : screen.append(block);
}
function chapterSheet(st) {
  openSheet([
    h('p', { class: 'kicker' }, `${st.genre} · ${st.chapter}`),
    h('h3', {}, st.title),
    st.cover ? h('img', { class: 'chapter-cover', src: st.cover, alt: '' }) : null,
    h('p', { class: 'chapter-text' }, st.opening),
    h('p', { class: 'hint' }, STORY_WORDS.note),
    h('div', { class: 'btns' }, h('button', { class: 'btn primary', onclick: () => { closeSheet(); toast(STORY_WORDS.opens); } }, STORY_WORDS.keep)),
  ], null, '#5B8CFF');
}

// After the very first walk, offer a gentle reminder for tomorrow (mockup: nothing is really scheduled).
function offerNudge() {
  let asked = false;
  try { asked = !!localStorage.getItem('whimsy-nudge'); } catch { /* fine */ }
  if (asked || doneCount() !== 1) return;
  const note = (v) => { try { localStorage.setItem('whimsy-nudge', v); } catch { /* fine */ } };
  const when = h('select', { class: 'field', 'aria-label': REMIND.kicker }, REMIND.times.map((t) => h('option', { selected: t === REMIND.times[2] }, t)));
  const card = h('div', { class: 'nudge', id: 'nudge' },
    h('p', { class: 'kicker' }, REMIND.kicker), h('p', { class: 'nudge-title' }, REMIND.title), when,
    h('div', { class: 'row2' },
      h('button', { class: 'btn ghost small', onclick: () => { note('yes'); card.replaceChildren(h('p', { class: 'nudge-title' }, REMIND.set(when.value))); } }, REMIND.yes),
      h('button', { class: 'link', onclick: () => { note('no'); card.remove(); } }, REMIND.no)));
  const btns = screen.querySelector('.btns:last-of-type');
  btns ? btns.before(card) : screen.append(card);
}
function thumb(src) {
  return new Promise((ok) => {
    const i = new Image();
    i.onload = () => { const c = document.createElement('canvas'); c.width = c.height = 200; const s = Math.min(i.width, i.height);
      c.getContext('2d').drawImage(i, (i.width - s) / 2, (i.height - s) / 2, s, s, 0, 0, 200, 200); ok(c.toDataURL('image/jpeg', 0.7)); };
    i.onerror = () => ok(null); i.src = src;
  });
}
const doneCount = () => Object.keys(walked).length;
const stamp = (id) => walked[id] ? h('span', { class: 'stamp' }, walked[id].count > 1 ? `Walked ${walked[id].count}×` : 'Walked') : h('span', { class: 'star', 'aria-hidden': 'true' }, '✦');
function keepsake(id) {
  const k = walked[id]?.keep;
  if (!k) return null;
  return h('div', { class: 'keepsake' },
    h('p', { class: 'kicker' }, HOME.lastTime),
    h('div', { class: 'keep-row' }, k.img ? h('img', { src: k.img, alt: '' }) : null,
      h('div', {}, h('b', {}, k.title), k.text ? h('span', {}, k.text) : null)));
}

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { toastEl.hidden = true; }, 1800);
}

function bar(right) {
  return h('div', { class: 'bar' },
    h('button', { class: 'back', onclick: goHome, 'aria-label': 'Back to walks' }, '‹'),
    current ? h('span', { class: 'walk-name' }, current.name) : null,
    right != null ? h('span', { class: 'count' }, right) : null);
}

/* ---------- sheet (closes on outside click + Esc) ---------- */
let onSheetClose = null;
function openSheet(kids, onClose, jewel) {
  sheet.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));
  if (jewel) sheet.style.setProperty('--jewel', jewel); else sheet.style.removeProperty('--jewel');
  sheet.hidden = false; scrim.hidden = false;
  onSheetClose = onClose || null;
}
function closeSheet() {
  if (sheet.hidden) return;
  sheet.hidden = true; scrim.hidden = true;
  const cb = onSheetClose; onSheetClose = null;
  cb?.();
}
scrim.addEventListener('click', closeSheet);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

/* ---------- camera: real phone camera, or a pretend snap ---------- */
function realPhoto() {
  return new Promise((resolve) => {
    camInput.value = '';
    const done = (url) => { camInput.onchange = camInput.oncancel = null; resolve(url); };
    camInput.onchange = () => { const f = camInput.files[0]; done(f ? URL.createObjectURL(f) : null); };
    camInput.oncancel = () => done(null);
    camInput.click();
  });
}

// Draws a stand-in "photo" (an emoji on a soft backdrop) so desktop testers can play.
function pretendPhoto(emoji, colour) {
  const c = document.createElement('canvas');
  c.width = c.height = 480;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(170, 140, 30, 240, 240, 380);
  g.addColorStop(0, shade(colour, 40)); g.addColorStop(1, shade(colour, -50));
  x.fillStyle = g; x.fillRect(0, 0, 480, 480);
  x.translate(240 + (Math.random() - 0.5) * 60, 250 + (Math.random() - 0.5) * 40);
  x.rotate((Math.random() - 0.5) * 0.5);
  x.font = `${200 + Math.random() * 60}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.shadowColor = 'rgba(0,0,0,0.35)'; x.shadowBlur = 24; x.shadowOffsetY = 10;
  x.fillText(emoji, 0, 0);
  return c.toDataURL('image/jpeg', 0.8);
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

// Big shutter + "or pretend" link. onPhoto(url) gets the photo.
function cameraControls(label, onPhoto, pretend) {
  return h('div', { class: 'cam' },
    h('button', { class: 'shutter', 'aria-label': label, onclick: async () => { const u = await realPhoto(); if (u) onPhoto(u); } }),
    h('span', { class: 'lbl' }, label),
    h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => onPhoto(pretend()) }, CAMERA.pretend));
}

/* ---------- home: square text-only cards, tonight's walk as the hero ---------- */
const todayTheme = pick(POSTCARD.themes);
// every walk in display order (hero first, then by section); the number on each card follows that order
const ALL = [...WALKS, ...MORE_WALKS];
const ORDER = SECTIONS.flatMap((sec) => ALL.filter((w) => w.section === sec.id));
const dayParam = new URLSearchParams(location.search).get('day');
const TODAY = dayParam ? new Date(`${dayParam}T12:00`) : new Date();
const TONIGHT = tonightId(ORDER.map((w) => w.id), TODAY);
ORDER.forEach((w, i) => { w.no = i + 1; });
let more; // the board's walks and quests, wired up once the helpers below exist

function walkCard(w, hero) {
  return h('button', { class: `walk${hero ? ' hero' : ''}`, 'data-walk': w.id, style: `--jewel:${w.jewel}`, onclick: () => cardBack(w) },
    h('span', { class: 'ghost', 'aria-hidden': 'true' }, w.no),
    h('span', { class: 'mech' }, hero ? `${w.id !== TONIGHT ? HOME.next : w.id === HERO ? HOME.hero : HOME.tonight} · ${w.mech}` : w.mech.replace(/^an? /i, '').replace(/ walk$/, '')),
    stamp(w.id),
    h('span', { class: 'title' }, w.name),
    hero ? h('span', { class: 'hook' }, w.hook(todayTheme)) : null,
    h('span', { class: 'meta' }, hero ? w.tags.join(' · ') : w.tags[0]));
}

function questCard(q, wide) {
  return h('button', { class: `walk quest${wide ? ' wide' : ''}`, 'data-walk': q.id, style: `--jewel:${q.jewel}`, onclick: () => questBack(q) },
    h('span', { class: 'mech' }, `${q.spooky ? QUEST_WORDS.spookyShort : QUEST_WORDS.kicker} · ${q.mins} min`),
    stamp(q.id),
    h('span', { class: 'title' }, q.title));
}
function questBack(q) {
  openSheet([
    h('p', { class: 'kicker' }, `${q.spooky ? QUEST_WORDS.spooky : QUEST_WORDS.kicker} · ${q.mins} min`),
    h('h3', {}, q.title),
    h('p', { class: 'hook' }, q.line),
    keepsake(q.id),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary', id: 'startWalk', onclick: () => start(q.id) }, walked[q.id] ? QUEST_WORDS.again : QUEST_WORDS.go),
      h('button', { class: 'link', onclick: closeSheet }, HOME.notNow)),
  ], null, q.jewel);
}

// The card turns over into a sheet: the full pitch and the one button.
function cardBack(w) {
  openSheet([
    h('span', { class: 'ghost-no', 'aria-hidden': 'true' }, w.no),
    h('p', { class: 'kicker' }, `Walk no. ${w.no} · ${w.mech}`),
    h('h3', {}, w.name),
    h('p', { class: 'hook' }, w.hook(todayTheme)),
    h('p', { class: 'more' }, w.more),
    h('p', { class: 'how' }, w.how.flatMap((step, i) => (i ? [h('i', {}, '✦'), step] : [step]))),
    h('div', { class: 'tags' }, w.tags.map((t) => h('span', { class: 'tag' }, t))),
    keepsake(w.id),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary', id: 'startWalk', onclick: () => start(w.id) }, walked[w.id] ? HOME.again : w.go),
      h('button', { class: 'link', onclick: closeSheet }, HOME.notNow)),
  ], null, w.jewel);
}

// Walks that need real streets; At Home hides them.
const OUTDOOR_ONLY = ['fog', 'safari'];
const fits = (w) => where === 'out' || !OUTDOOR_ONLY.includes(w.id);
const needsCamera = (w) => w.tags.includes('Camera');

// Three picks for right now: suited to the time of day, not yet walked, at most two that need a camera.
function forYou(exclude) {
  const hr = TODAY.getHours();
  const prefer = hr < 11 ? ['listen', 'wander'] : hr < 17 ? ['snap', 'wander'] : ['spooky', 'wander', 'listen'];
  const pool = ORDER.filter((w) => w !== exclude && fits(w) && !walked[w.id]);
  const ranked = [...pool].sort((a, b) => (prefer.indexOf(a.section) + 1 || 9) - (prefer.indexOf(b.section) + 1 || 9));
  const out = [];
  let cams = 0;
  for (const w of ranked) { if (out.length === 3) break; if (needsCamera(w) && cams === 2) continue; if (needsCamera(w)) cams++; out.push(w); }
  return out;
}

/* ---------- seal book: one wax seal per walk you finish; seven open a sealed letter ---------- */
function sealBook() {
  const n = Math.min(7, doneCount());
  return h('button', { class: 'seals', id: 'seals', 'aria-label': HOME.sealsLabel(n), onclick: () => (n >= 7 ? openLetter() : toast(HOME.sealsHint(7 - n))) },
    h('span', { class: 'seal-row' }, Array.from({ length: 7 }, (_, i) => h('i', { class: i < n ? 'on' : '' }, i < n ? '✦' : ''))),
    h('span', { class: 'seal-text' }, n >= 7 ? HOME.sealsOpen : HOME.sealsLabel(n)));
}
function openLetter() {
  const st = STORIES.summons;
  openSheet([
    h('p', { class: 'kicker' }, HOME.letterKicker),
    h('div', { class: 'letter-paper' }, h('p', {}, HOME.letter), h('p', { class: 'sig' }, HOME.letterSig)),
    h('div', { class: 'btns' }, h('button', { class: 'btn primary', onclick: () => chapterSheet(st) }, STORY_WORDS.read)),
  ], null, '#C49BFF');
}

function goHome() {
  leave?.(); leave = null; current = null;
  phone.style.removeProperty('--jewel');
  if (location.search && !dayParam) history.replaceState(null, '', location.pathname);
  const whereBtn = (key) => h('button', { class: 'chip', 'aria-pressed': String(where === key), onclick: () => { where = key; goHome(); } }, HOME.where[key]);
  // tonight's walk leads; once you've walked it, the top spot goes to one you haven't tried
  const tonight = ORDER.find((w) => w.id === TONIGHT);
  const hero = !walked[TONIGHT] && fits(tonight) ? tonight : ORDER.find((w) => !walked[w.id] && fits(w)) || tonight;
  const quick = QUESTS.find((q) => !walked[q.id]) || QUESTS[0];
  const picks = forYou(hero);
  const row = (cards) => h('div', { class: 'row-scroll' }, cards);
  show(
    h('div', { class: 'home-head' },
      h('p', { class: 'kicker' }, HOME.kicker),
      h('h1', { class: 'display' }, HOME.title),
      h('p', { class: 'sub' }, HOME.sub[where]),
      h('div', { class: 'where', role: 'group', 'aria-label': 'Where are you?' }, whereBtn('out'), whereBtn('home'))),
    sealBook(),
    h('div', { class: 'cards' }, walkCard(hero, true)),
    h('p', { class: 'kicker section' }, HOME.quick),
    h('div', { class: 'cards' }, questCard(quick, true)),
    picks.length ? [h('p', { class: 'kicker section' }, HOME.forYou), h('div', { class: 'cards three' }, picks.map((w) => walkCard(w)))] : null,
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', id: 'surprise', onclick: () => cardBack(pick(ORDER.filter((w) => fits(w) && !walked[w.id])) || pick(ORDER)) }, HOME.surprise)),
    h('h2', { class: 'display all-head' }, HOME.all),
    SECTIONS.map((sec) => [
      h('p', { class: 'kicker section' }, sec.label),
      row(ORDER.filter((w) => w.section === sec.id && fits(w)).map((w) => walkCard(w))),
    ]),
    h('p', { class: 'kicker section' }, QUEST_WORDS.section),
    row(QUESTS.map((q) => questCard(q))),
  );
}

function start(id) {
  leave?.(); leave = null;
  const q = QUESTS.find((x) => x.id === id);
  current = q ? { id: q.id, name: q.spooky ? QUEST_WORDS.spooky : QUEST_WORDS.kicker, jewel: q.jewel } : ALL.find((w) => w.id === id);
  runId = Date.now(); // a fresh id per play, so stamps and story progress count each walk once
  phone.style.setProperty('--jewel', current.jewel);
  if (q) return more.quest(q);
  ({ postcard: () => postcardIntro(todayTheme), bingo: bingoStart, pumpkin: pumpkinWalk, cat: catWalk, roulette: rouletteIntro, ...more.starts })[id]();
}

/* ---------- Postcard walk ---------- */
let pc;
function postcardIntro(theme = pick(POSTCARD.themes)) {
  pc = { theme, photos: [], picked: [] };
  show(
    bar(),
    h('p', { class: 'kicker' }, POSTCARD.todays),
    h('div', { class: 'theme-big', style: `--swatch:${theme.colour}` },
      h('div', { class: 'name', id: 'themeName' }, theme.label, h('span', { class: 'dot', 'aria-hidden': 'true' }))),
    h('p', { class: 'sub' }, POSTCARD.hint[where]),
    h('div', {}, h('button', { class: 'link pretend', id: 'shuffle', style: 'padding-left:0', onclick: () => {
      const others = POSTCARD.themes.filter((t) => t !== theme);
      postcardIntro(pick(others));
    } }, POSTCARD.shuffle)),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'go', onclick: postcardWalk }, POSTCARD.start)),
  );
  fitWord(document.getElementById('themeName'));
}

// Shrink the theme word until it fits on one line (after the font loads too).
function fitWord(el) {
  if (!el) return;
  const fit = () => {
    let size = 96;
    el.style.fontSize = `${size}px`;
    while (el.scrollWidth > el.parentElement.clientWidth && size > 36) el.style.fontSize = `${(size -= 4)}px`;
  };
  fit();
  document.fonts?.ready.then(fit);
}

function postcardWalk() {
  const t = pc.theme;
  const n = pc.photos.length;
  const slots = Math.max(3, n);
  show(
    bar(POSTCARD.snapped(n)),
    h('div', {}, h('span', { class: 'theme-chip', style: `--swatch:${t.colour}` }, h('i'), `${POSTCARD.hunt} ${t.noun}`)),
    h('div', { class: 'strip' }, Array.from({ length: slots }, (_, i) =>
      pc.photos[i] ? h('img', { src: pc.photos[i], alt: '' }) : h('div', { class: 'slot' }))),
    n < 3 ? h('p', { class: 'progress' }, POSTCARD.needMore(n)) : null,
    h('div', { class: 'spacer' }),
    cameraControls(CAMERA.take, (u) => { pc.photos.push(u); postcardWalk(); }, () => pretendPhoto(pick(t.things), t.colour)),
    h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'finish', disabled: n < 3, onclick: () => {
      if (n === 3) { pc.picked = [0, 1, 2]; postcardShow(); } else postcardPick();
    } }, POSTCARD.finish)),
  );
}

function postcardPick() {
  const k = pc.picked.length;
  show(
    bar(),
    h('h2', { class: 'display' }, POSTCARD.pick),
    h('div', { class: 'strip' }, pc.photos.map((src, i) =>
      h('button', { 'aria-pressed': String(pc.picked.includes(i)), onclick: () => {
        if (pc.picked.includes(i)) pc.picked = pc.picked.filter((j) => j !== i);
        else if (pc.picked.length < 3) pc.picked.push(i);
        postcardPick();
      } }, h('img', { src, alt: '' })))),
    h('p', { class: 'progress' }, POSTCARD.picked(k)),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'make', disabled: k < 3, onclick: postcardShow }, POSTCARD.make)),
  );
}

function postcardShow() {
  const t = pc.theme;
  const date = new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  show(
    bar(),
    h('div', { class: 'postcard', id: 'postcard' },
      h('div', { class: 'photos' }, pc.picked.map((i) => h('img', { src: pc.photos[i], alt: '' }))),
      h('div', { class: 'foot' },
        h('div', {},
          h('div', { class: 'title' }, t.title),
          h('div', { class: 'msg' }, `${date} · ${POSTCARD.greeting[where]}`),
          h('div', { class: 'tag-line' }, SHARE.tag)),
        h('div', { class: 'stamp' }, h('i', {}, '✦'), POSTCARD.stamp))),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn jewel', onclick: shareKeepsake }, POSTCARD.share),
      h('button', { class: 'btn ghost', 'data-end': '', onclick: goHome }, POSTCARD.again)),
  );
}

/* ---------- keepsake image: the end screen as a 4:5 card people can post ---------- */
function offerShare() {
  if (screen.querySelector('#shareKeep') || current.id === 'postcard') return;
  const btns = screen.querySelector('.btns:last-of-type');
  if (btns) btns.prepend(h('button', { class: 'btn ghost', id: 'shareKeep', onclick: shareKeepsake }, SHARE.keep));
}
const loadImage = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
function wrap(x, text, maxW) {
  const lines = []; let line = '';
  for (const w of text.split(/\s+/)) { const t = line ? `${line} ${w}` : w; if (x.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
async function keepsakeCanvas() {
  await document.fonts?.ready;
  const W = 1080, H = 1350, P = 84;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const jewel = getComputedStyle(phone).getPropertyValue('--jewel').trim() || '#5b8cff';
  x.fillStyle = '#1a0b3d'; x.fillRect(0, 0, W, H);
  const g = x.createRadialGradient(W, H, 0, W, H, W * 1.1); g.addColorStop(0, jewel + '55'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = jewel + '66'; x.lineWidth = 3; x.beginPath(); x.roundRect(28, 28, W - 56, H - 56, 26); x.stroke();
  x.fillStyle = '#c49bff'; x.font = '700 30px Karla, sans-serif'; x.letterSpacing = '6px';
  x.fillText((current?.name || 'Whimsy Walks').toUpperCase(), P, 150); x.letterSpacing = '0px';
  const title = screen.querySelector('h2.display')?.textContent || screen.querySelector('.kicker')?.textContent || '';
  x.fillStyle = '#fbf7ff'; x.font = '600 84px Erode, Georgia, serif';
  const tl = wrap(x, title, W - P * 2).slice(0, 3); tl.forEach((l, i) => x.fillText(l, P, 260 + i * 90));
  let y = 260 + tl.length * 90 + 30;
  const imgs = [...screen.querySelectorAll('img')].filter((i) => !i.closest('.story-next, .keepsake')).slice(0, 4);
  const loaded = (await Promise.all(imgs.map((i) => loadImage(i.src)))).filter(Boolean);
  const box = H - y - 190;
  if (loaded.length) {
    const n = loaded.length, cols = n === 1 ? 1 : 2, rows = Math.ceil(n / cols), gap = 18;
    const cw = (W - P * 2 - gap * (cols - 1)) / cols, ch = Math.min(cw, (box - gap * (rows - 1)) / rows);
    loaded.forEach((im, i) => {
      const cx = P + (i % cols) * (cw + gap), cy = y + Math.floor(i / cols) * (ch + gap), s = Math.min(im.width / cw, im.height / ch);
      x.save(); x.beginPath(); x.roundRect(cx, cy, cw, ch, 16); x.clip();
      x.drawImage(im, (im.width - cw * s) / 2, (im.height - ch * s) / 2, cw * s, ch * s, cx, cy, cw, ch); x.restore();
    });
  } else {
    const words = screen.querySelector('.poem, .frame .big, .note p, .quest-line, .sub')?.innerText || '';
    x.fillStyle = '#d9cef5'; x.font = 'italic 500 60px Erode, Georgia, serif';
    wrap(x, words.replace(/\n+/g, ' / '), W - P * 2).slice(0, 8).forEach((l, i) => x.fillText(l, P, y + 70 + i * 76));
  }
  x.fillStyle = jewel; x.font = '600 44px Erode, Georgia, serif'; x.fillText('✦', P, H - 92);
  x.fillStyle = '#fbf7ff'; x.font = '700 32px Karla, sans-serif'; x.fillText(SHARE.tag, P + 60, H - 98);
  x.fillStyle = '#a493d6'; x.font = '600 28px Karla, sans-serif'; x.textAlign = 'right'; x.fillText('Story City · Whimsy Walks', W - P, H - 98);
  return c;
}
async function shareKeepsake() {
  const c = await keepsakeCanvas();
  const blob = await new Promise((ok) => c.toBlob(ok, 'image/jpeg', 0.9));
  const file = new File([blob], 'whimsy-walk.jpg', { type: 'image/jpeg' });
  if (navigator.canShare?.({ files: [file] })) { try { await navigator.share({ files: [file], text: SHARE.tag }); } catch { /* closed */ } return; }
  const a = h('a', { href: URL.createObjectURL(blob), download: 'whimsy-walk.jpg' }); document.body.append(a); a.click(); a.remove();
  toast(SHARE.saved);
}

async function share(title, text) {
  if (!navigator.share) return toast(SHARE.unsupported);
  try { await navigator.share({ title, text }); } catch { /* closed the share sheet */ }
}

/* ---------- Neighbourhood bingo ---------- */
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let bg;
function bingoStart() {
  const items = shuffle(BINGO[where]).slice(0, 8).map(([label, em]) => ({ label, em, photo: null }));
  items.splice(4, 0, { free: true });
  bg = { cells: items, celebrated: false };
  bingoBoard();
}
const bingoHas = (i) => bg.cells[i].free || bg.cells[i].photo;
const bingoLines = () => LINES.filter((l) => l.every(bingoHas));

function bingoGrid(tap) {
  const onLine = new Set(bingoLines().flat());
  return h('div', { class: 'grid' }, bg.cells.map((c, i) => {
    if (c.free) return h('div', { class: `sq free${onLine.has(i) ? ' line' : ''}` }, `✦ ${BINGO.free}`);
    const cls = `sq${c.photo ? ' got' : ''}${onLine.has(i) ? ' line' : ''}`;
    const kids = c.photo ? [h('img', { src: c.photo, alt: c.label })] : [c.label];
    return tap ? h('button', { class: cls, 'data-sq': i, onclick: () => !c.photo && bingoSnap(i) }, kids) : h('div', { class: cls }, kids);
  }));
}

function bingoBoard() {
  const got = bg.cells.filter((c) => c.photo).length;
  show(
    bar(`${got} / 8`),
    h('h2', { class: 'display' }, BINGO.title[where]),
    h('p', { class: 'sub' }, BINGO.hint),
    bingoGrid(true),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', id: 'bingoDone', onclick: bingoEnd }, BINGO.finish)),
  );
}

function bingoSnap(i) {
  const c = bg.cells[i];
  const got = (u) => {
    c.photo = u;
    bingoBoard();
    const full = bg.cells.every((x, j) => bingoHas(j));
    if (full) return celebrate(BINGO.blackout, BINGO.blackoutLine, null, bingoEnd);
    if (!bg.celebrated && bingoLines().length) {
      bg.celebrated = true;
      celebrate(BINGO.bingo, BINGO.bingoLine, BINGO.keepGoing, bingoEnd);
    }
  };
  openSheet([
    h('p', { class: 'kicker' }, BINGO.spot),
    h('h3', {}, c.label),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary', onclick: async () => { closeSheet(); const u = await realPhoto(); if (u) got(u); } }, CAMERA.take),
      h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => { closeSheet(); got(pretendPhoto(c.em, pick(['#3a7d6b', '#4b3d8f', '#8a6a4f', '#2f6fc8']))); } }, CAMERA.pretend)),
  ]);
}

function celebrate(big, line, keepLabel, onFinish) {
  openSheet([
    h('div', { class: 'celebrate' }, h('div', { class: 'big' }, big), h('p', { class: 'sub' }, line)),
    h('div', { class: 'btns' },
      keepLabel ? h('button', { class: 'btn jewel', id: 'keep', onclick: closeSheet }, keepLabel) : null,
      h('button', { class: `btn ${keepLabel ? 'ghost' : 'jewel'}`, id: 'celebrateDone', onclick: onFinish }, BINGO.finish)),
  ]);
}

function bingoEnd() {
  const lines = bingoLines().length;
  const full = bg.cells.every((x, j) => bingoHas(j));
  show(
    bar(),
    h('h2', { class: 'display' }, BINGO.doneTitle(lines)),
    lines ? h('div', { class: 'stickers' },
      h('div', { class: 'sticker' }, h('div', { class: 's' }, '✦'), BINGO.stickerLine),
      full ? h('div', { class: 'sticker bonus' }, h('div', { class: 's' }, '✦'), BINGO.bonusLine) : null) : null,
    bingoGrid(false),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', 'data-end': '', onclick: goHome }, BINGO.again)),
  );
}

/* ---------- Pumpkin Patrol ---------- */
let pk = { list: [] };
function pumpkinWalk(fresh = true) {
  if (fresh) pk = { list: [] };
  const n = pk.list.length;
  show(
    bar(PUMPKIN.rated(n)),
    h('h2', { class: 'display' }, PUMPKIN.title),
    h('p', { class: 'sub' }, PUMPKIN.hint[where]),
    n ? h('div', { class: 'pumpkins' }, [...pk.list].reverse().map(pumpkinRow)) : h('div', { class: 'empty' }, PUMPKIN.empty),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn jewel', id: 'spotted', onclick: async () => { const u = await realPhoto(); if (u) pumpkinRate(u); } }, PUMPKIN.spotted),
      h('button', { class: 'link pretend', 'data-pretend': '', onclick: () => pumpkinRate(pretendPhoto('🎃', pick(['#2a1a40', '#1d1430', '#33204a', '#24182f']))) }, CAMERA.pretend),
      h('button', { class: 'btn ghost', id: 'crown', disabled: n < 2, onclick: pumpkinEnd }, n < 2 ? PUMPKIN.needMore : PUMPKIN.crown)),
  );
}

const pumpkinRow = (p) => h('div', { class: 'pk' },
  h('img', { src: p.photo, alt: '' }),
  h('div', {}, h('b', {}, PUMPKIN.scores[p.score - 1]), h('span', { class: 'stars', 'aria-label': PUMPKIN.outOf(p.score) }, '✦'.repeat(p.score), h('s', {}, '✦'.repeat(5 - p.score)))));

function pumpkinRate(photo) {
  const label = h('div', { class: 'rate-label' });
  let chosen = false;
  const btns = [1, 2, 3, 4, 5].map((s) => h('button', {
    'aria-label': `${s} of 5`, 'data-score': s,
    onpointerenter: () => { if (!chosen) light(s); },
    onclick: () => {
      if (chosen) return;
      chosen = true; light(s);
      setTimeout(() => { pk.list.push({ photo, score: s }); closeSheet(); pumpkinWalk(false); }, 550);
    },
  }, String(s)));
  const light = (s) => { btns.forEach((b, i) => b.classList.toggle('on', i < s)); label.textContent = PUMPKIN.scores[s - 1]; };
  openSheet([
    h('img', { class: 'preview', src: photo, alt: '' }),
    h('h3', {}, PUMPKIN.rateIt),
    h('div', { class: 'rate' }, btns),
    label,
  ]);
}

function pumpkinEnd() {
  let best = pk.list[0];
  for (const p of pk.list) if (p.score >= best.score) best = p;
  show(
    bar(),
    h('p', { class: 'kicker centre' }, PUMPKIN.winnerKicker),
    h('div', { class: 'winner' }, h('img', { src: best.photo, alt: '' }), h('span', { class: 'crown' }, '✦')),
    h('h2', { class: 'display centre' }, PUMPKIN.scores[best.score - 1]),
    h('p', { class: 'sub centre' }, PUMPKIN.rated(pk.list.length)),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', 'data-end': '', onclick: goHome }, PUMPKIN.again)),
  );
}

/* ---------- Turn left at every cat ---------- */
let ct;
function catWalk() {
  ct = { cats: 0, lefts: 0, rights: 0, heading: -90, pts: [[0, 0], [0, -30]], marks: [] };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'doodle');
  const arrow = h('div', { class: 'arrow', id: 'arrow' }, CAT.walking);
  const count = h('span', { class: 'count' }, CAT.count(0));
  const top = bar(); top.append(count);
  const rule = h('div', { class: 'frame', id: 'rule' }, h('p', { class: 'kicker' }, CAT.ruleLabel), h('p', { class: 'big' }, CAT.rule[where]));
  show(
    top,
    rule,
    svg,
    arrow,
    h('div', { class: 'btns' },
      h('button', { class: 'btn jewel', id: 'sawCat', onclick: () => {
        rule.hidden = true;
        ct.cats++;
        const rebel = ct.cats % 4 === 0;
        rebel ? ct.rights++ : ct.lefts++;
        turn(rebel ? 90 : -90, '✦');
        count.textContent = CAT.count(ct.cats);
        arrow.textContent = rebel ? `↱ ${CAT.rebel}` : `↰ ${pick(CAT.lefts)}`;
        arrow.classList.remove('flash'); void arrow.offsetWidth; arrow.classList.add('flash');
        drawDoodle(svg, true);
      } }, CAT.saw),
      h('button', { class: 'btn ghost', id: 'catDone', onclick: catEnd }, CAT.done)),
  );
  walkDoodle(svg);
}

// The cat walk's route doodle: it keeps growing while you walk.
function walkDoodle(svg) {
  drawDoodle(svg, true);
  const tick = setInterval(() => {
    const last = ct.pts.at(-1);
    const r = (ct.heading * Math.PI) / 180;
    last[0] += Math.cos(r) * 1.4; last[1] += Math.sin(r) * 1.4;
    drawDoodle(svg, true);
  }, 120);
  leave = () => clearInterval(tick);
}

// Drop a marker where you are and change direction (deg: -90 left, 90 right, 0 straight).
function turn(deg, emoji) {
  const last = ct.pts.at(-1);
  stretch(last, 40); // quick taps still leave a readable zig-zag
  ct.marks.push([...last, emoji]);
  ct.pts.push([...last]);
  ct.heading += deg + (deg ? (Math.random() - 0.5) * 24 : 0);
}

// Make sure the segment ending at `last` is at least `min` long, along the current heading.
function stretch(last, min) {
  const prev = ct.pts.at(-2);
  const len = Math.hypot(last[0] - prev[0], last[1] - prev[1]);
  if (len >= min) return;
  const r = (ct.heading * Math.PI) / 180;
  last[0] = prev[0] + Math.cos(r) * min; last[1] = prev[1] + Math.sin(r) * min;
}

function drawDoodle(svg, live) {
  const all = [...ct.pts, ...ct.marks];
  const xs = all.map((p) => p[0]); const ys = all.map((p) => p[1]);
  const pad = 30;
  let minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad, minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
  const w = Math.max(maxX - minX, 160), hgt = Math.max(maxY - minY, 160);
  minX -= (w - (maxX - minX)) / 2; minY -= (hgt - (maxY - minY)) / 2;
  svg.setAttribute('viewBox', `${minX} ${minY} ${w} ${hgt}`);
  const s = w / 300; // keep marks the same size as the drawing grows
  const d = ct.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const end = ct.pts.at(-1);
  svg.innerHTML = `<path d="${d}" style="stroke-width:${3.5 * s};stroke-dasharray:${1 * s} ${9 * s}"/>`
    + `<circle class="home" cx="0" cy="0" r="${8 * s}" style="stroke-width:${3 * s}"/>`
    + ct.marks.map((m) => `<text class="mark" x="${m[0]}" y="${m[1]}" text-anchor="middle" dominant-baseline="central" style="font-size:${18 * s}px">${m[2]}</text>`).join('')
    + (live === 'loop' ? ''
      : live
      ? `<circle class="me" cx="${end[0]}" cy="${end[1]}" r="${7 * s}" style="stroke-width:${4 * s}"/>`
      : `<text class="mark" x="${end[0]}" y="${end[1]}" text-anchor="middle" dominant-baseline="central" style="font-size:${30 * s}px">✦</text>`);
}

function catEnd() {
  leave?.(); leave = null;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'doodle');
  show(
    bar(),
    h('h2', { class: 'display' }, CAT.endTitle),
    h('p', { class: 'sub' }, ct.cats ? CAT.endLine(ct.cats, ct.lefts, ct.rights) : CAT.noCats),
    svg,
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', 'data-end': '', onclick: goHome }, CAT.again)),
  );
  drawDoodle(svg, false);
}

/* ---------- Route Roulette ---------- */
const BLOCK_MIN = 1.2;      // minutes to walk one block (about 100 m)
const STEPS_PER_UNIT = 10;  // at home, one "block" = 10 steps
let rr;

function rouletteIntro() {
  let mins = 20;
  const label = h('div', { class: 'theme-big' }, h('div', { class: 'name', id: 'mins' }, ROULETTE.mins(mins)));
  show(
    bar(),
    h('p', { class: 'kicker' }, ROULETTE.howLong),
    label,
    h('input', { type: 'range', class: 'slider', id: 'length', min: 10, max: 60, step: 5, value: mins, 'aria-label': ROULETTE.howLong,
      oninput: (e) => { mins = +e.target.value; label.firstChild.textContent = ROULETTE.mins(mins); } }),
    h('p', { class: 'sub' }, ROULETTE.rule[where]),
    h('div', { class: 'spacer' }),
    h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'go', onclick: () => rouletteWalk(mins) }, ROULETTE.start)),
  );
}

// Plans a closed loop on a street grid: grow a blob of city blocks until its outline
// is about the right length, then walk its outline. Returns legs of {turn, len}.
function planLoop(target) {
  for (let tries = 0; tries < 200; tries++) {
    const cells = new Set(['0,0']);
    while (perimeter(cells) < target) {
      const k = grow(cells);
      cells.add(k);
      if (!outlineOk(cells)) cells.delete(k);
    }
    const loop = outline(cells);
    if (loop && Math.abs(loop.length - target) <= 2) return toLegs(loop);
  }
  return toLegs(outline(new Set(['0,0'])));
}
// Next block to add. Mostly fills a nook (touches 2+ blocks) so loops stay chunky
// with a few fun jogs, instead of zig-zagging every block.
function grow(cells) {
  const around = new Map();
  for (const c of cells) {
    const [x, y] = c.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${x + dx},${y + dy}`;
      if (!cells.has(k)) around.set(k, (around.get(k) || 0) + 1);
    }
  }
  const nooks = [...around].filter(([, n]) => n >= 2).map(([k]) => k);
  return nooks.length && Math.random() < 0.8 ? pick(nooks) : pick([...around.keys()]);
}
function perimeter(cells) {
  let p = 0;
  for (const c of cells) { const [x, y] = c.split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!cells.has(`${x + dx},${y + dy}`)) p++; }
  return p;
}
// Directed unit edges round each cell (counter-clockwise), keeping only the outer ones.
function edges(cells) {
  const out = [];
  for (const c of cells) {
    const [x, y] = c.split(',').map(Number);
    if (!cells.has(`${x},${y - 1}`)) out.push([[x, y], [x + 1, y]]);
    if (!cells.has(`${x + 1},${y}`)) out.push([[x + 1, y], [x + 1, y + 1]]);
    if (!cells.has(`${x},${y + 1}`)) out.push([[x + 1, y + 1], [x, y + 1]]);
    if (!cells.has(`${x - 1},${y}`)) out.push([[x, y + 1], [x, y]]);
  }
  return out;
}
// One clean outline: no corner touching itself and no courtyards (holes).
function outlineOk(cells) {
  const es = edges(cells);
  const starts = new Set();
  for (const [a] of es) { const k = `${a}`; if (starts.has(k)) return false; starts.add(k); }
  return outline(cells)?.length === es.length;
}
function outline(cells) {
  const es = edges(cells);
  const from = new Map(es.map((e) => [`${e[0]}`, e]));
  const loop = [];
  let e = es[0];
  do { loop.push(e[0]); e = from.get(`${e[1]}`); if (!e) return null; } while (e !== es[0] && loop.length <= es.length);
  return loop;
}
// Turn a list of grid points into legs, starting mid-street where possible (your door).
function toLegs(loop) {
  const n = loop.length;
  const dir = (i) => { const a = loop[i % n], b = loop[(i + 1) % n]; return [b[0] - a[0], b[1] - a[1]]; };
  const straight = [...Array(n).keys()].filter((i) => `${dir(i)}` === `${dir((i + n - 1) % n)}`);
  const start = straight.length ? pick(straight) : 0;
  const legs = [];
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n, d = dir(i);
    const last = legs.at(-1);
    if (last && `${last.d}` === `${d}`) { last.len++; continue; }
    const prev = last ? last.d : null;
    // cross product sign tells left vs right (y grows downward on screen)
    const turn = prev ? (prev[0] * d[1] - prev[1] * d[0] > 0 ? 'right' : 'left') : pick(['left', 'right']);
    legs.push({ d, len: 1, turn });
  }
  // if the walk ends heading the same way it started, the last leg is really the first one's start
  if (legs.length > 1 && `${legs.at(-1).d}` === `${legs[0].d}`) { const tail = legs.pop(); legs.push({ ...tail, home: true }); }
  legs.at(-1).home = true;
  return { legs, pts: loop.map((p) => [...p]), start };
}

function rouletteWalk(mins) {
  // Longer walks plan on a coarser grid so turns stay a few minutes apart.
  const blocks = mins / BLOCK_MIN;
  const scale = Math.max(1, Math.round(blocks / 16));
  const plan = planLoop(Math.max(4, Math.round(blocks / scale / 2) * 2));
  plan.legs.forEach((l) => { l.len *= scale; });
  rr = { mins, legs: plan.legs, at: 0 };
  // ct drives the shared doodle: walked legs only, scaled up to doodle units
  ct = { heading: 0, pts: [[0, 0]], marks: [] };
  const unit = ROULETTE.unit[where];
  const k = where === 'home' ? STEPS_PER_UNIT : 1;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'doodle');
  const wheel = h('div', { class: 'arrow', id: 'arrow' });
  const then = h('p', { class: 'leg', id: 'leg' });
  const twist = h('p', { class: 'sub centre twist', id: 'twist' });
  const togo = h('span', { class: 'count', id: 'togo' });
  const top = bar(); top.append(togo);
  const nextBtn = h('button', { class: 'btn jewel', id: 'corner' });

  const blocksLeft = () => rr.legs.slice(rr.at).reduce((t, l) => t + l.len, 0);
  const showLeg = () => {
    const leg = rr.legs[rr.at];
    wheel.textContent = rr.at === 0 ? `${ROULETTE.door[where]} ${leg.turn}` : ROULETTE.dirs[leg.turn];
    then.textContent = leg.home && rr.at > 0 ? ROULETTE.homeAhead(leg.len * k, unit) : ROULETTE.walk(leg.len * k, unit);
    twist.textContent = rr.at && Math.random() < 0.3 ? pick(ROULETTE.twists) : '';
    togo.textContent = ROULETTE.toGo(Math.round(blocksLeft() * BLOCK_MIN));
    nextBtn.textContent = leg.home ? ROULETTE.arrived : ROULETTE.next;
    wheel.classList.remove('flash'); void wheel.offsetWidth; wheel.classList.add('flash');
    drawDoodle(svg, true);
  };
  nextBtn.addEventListener('click', () => {
    const leg = rr.legs[rr.at];
    const last = ct.pts.at(-1);
    ct.pts.push([last[0] + leg.d[0] * 40 * leg.len, last[1] + leg.d[1] * 40 * leg.len]);
    rr.at++;
    if (rr.at >= rr.legs.length) return rouletteEnd(true);
    showLeg();
  });
  show(
    top,
    svg,
    wheel,
    then,
    twist,
    h('div', { class: 'btns' }, nextBtn, h('button', { class: 'btn ghost', id: 'rouletteDone', onclick: () => rouletteEnd(false) }, ROULETTE.done)),
  );
  showLeg();
}

function rouletteEnd(home) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'doodle');
  const turns = rr.legs.length - 1;
  show(
    bar(),
    h('h2', { class: 'display' }, home ? ROULETTE.endTitle : ROULETTE.title),
    h('p', { class: 'sub' }, home ? ROULETTE.endLine(turns, rr.mins) : ROULETTE.stopped),
    svg,
    h('div', { class: 'btns' }, h('button', { class: 'btn ghost', 'data-end': '', onclick: goHome }, ROULETTE.again)),
  );
  drawDoodle(svg, home ? 'loop' : false);
}

/* ---------- boot: ?v=<walk or quest> opens it straight away ---------- */
more = register({ relabel: (q) => { current = { id: current.id, name: q.spooky ? QUEST_WORDS.spooky : QUEST_WORDS.kicker, jewel: q.jewel }; phone.style.setProperty('--jewel', q.jewel); }, markDone: () => { if (current?.id) { markDone(); offerStory(); } }, h, show, bar, openSheet, closeSheet, cameraControls, realPhoto, pretendPhoto, pick, shuffle, goHome, where: () => where, setLeave: (f) => { leave = f; } });
window.__ww = more; window.__keep = keepsakeCanvas; // hooks for the headless tests
const v = new URLSearchParams(location.search).get('v') || location.hash.slice(1);
if (v === 'home' || new URLSearchParams(location.search).get('home')) where = 'home';
if (ALL.some((w) => w.id === v) || QUESTS.some((q) => q.id === v)) start(v); else goHome();
