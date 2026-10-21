(() => {
'use strict';

const $ = id => document.getElementById(id);
const audio = $('audio');
const LEAD_S = 0.15;
const PREF_KEY = 'sct380phone';
const SPEEDS = [0.75, 1, 1.25, 1.5];

const S = {
  index: null,
  storyId: null,
  order: null,
  chapter: null,
  model: 'small',
  flow: [],
  hidden: 0,
  k: -2,
  pin: -1,
  pinFrom: 0,
  token: 0,
  imgToken: 0,
  sheetStory: null,
  userScrollAt: 0,
};

const prefs = (() => {
  try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch (e) { return {}; }
})();
function savePrefs() {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify({ story: S.storyId, order: S.order, model: S.model, speed: audio.defaultPlaybackRate }));
  } catch (e) { /* storage unavailable */ }
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const modelKey = () => (S.model === 'large' ? 'large' : 'small');
const dur = () => (Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (S.chapter ? S.chapter.duration : 0));
const fmt = t => {
  t = Math.max(0, Math.floor(t || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};
const story = id => S.index.stories.find(s => s.id === id);

/* ---------- reading flow ---------- */

function buildFlow() {
  const key = modelKey();
  const ps = S.chapter.paragraphs;
  S.flow = ps
    .filter(p => p[key].status === 'ok' && p[key].start != null)
    .map(p => ({ i: p.i, start: p[key].start, end: p[key].end, text: p.text, app: p.isAppLine }))
    .sort((a, b) => a.start - b.start);
  S.hidden = ps.length - S.flow.length;
}

function locate(t) {
  if (S.pin >= 0 && (!S.flow[S.pin] || t < S.pinFrom - 0.05 || t >= S.flow[S.pin].start)) S.pin = -1;
  let k = -1;
  for (let j = 0; j < S.flow.length; j++) {
    if (S.flow[j].start <= t) k = j; else break;
  }
  return S.pin >= 0 ? S.pin : k;
}

function fill(lineId, textId, j) {
  const el = $(lineId);
  const item = S.flow[j];
  $(textId).textContent = item ? item.text : '';
  el.dataset.j = item ? String(j) : '';
  el.classList.toggle('empty', !item);
  el.classList.toggle('appline', !!(item && item.app));
}

function render() {
  const idle = S.k < 0;
  const j = idle ? 0 : S.k;
  const main = $('mainLine');
  fill('prevLine', 'prevText', idle ? -1 : j - 1);
  fill('mainLine', 'mainText', j);
  fill('nextLine', 'nextText', j + 1);
  main.classList.remove('empty');
  main.classList.toggle('idle', idle && S.flow.length > 0);
  $('hint').hidden = !(idle && S.flow.length > 0);
  if (!S.flow.length) {
    $('mainText').textContent = 'No narrated text in this chapter.';
    main.dataset.j = '';
    main.classList.add('empty');
  }
  main.scrollTop = 0;
  const n = S.hidden;
  $('notice').textContent = `${n} ${n === 1 ? 'line' : 'lines'} not in the audio`;
  $('hiddenNote').textContent = `${n} ${n === 1 ? 'line' : 'lines'} not in the audio. Unmatched paragraphs are left out of the reading view.`;
}

function autoScroll(t) {
  const m = $('mainLine');
  if (S.k < 0 || audio.paused || m.scrollHeight <= m.clientHeight + 2 || Date.now() - S.userScrollAt < 4000) return;
  const item = S.flow[S.k];
  const frac = clamp((t - item.start) / Math.max(0.5, item.end - item.start), 0, 1);
  m.scrollTop = frac * (m.scrollHeight - m.clientHeight);
}

/* ---------- playback ---------- */

let seekDragging = false;
function updateUi(t) {
  $('timeNow').textContent = fmt(t);
  $('timeEnd').textContent = fmt(dur());
  const seek = $('seek');
  seek.max = dur() || 1;
  if (!seekDragging) seek.value = t;
  const playing = !audio.paused && !audio.ended;
  $('playText').textContent = playing ? 'Pause' : 'Play';
  $('playIcon').textContent = playing ? '❚❚' : '▶';
  $('playBtn').setAttribute('aria-label', playing ? 'Pause' : 'Play');
}

function refresh() {
  if (!S.chapter) return;
  const t = audio.currentTime || 0;
  const k = locate(t);
  if (k !== S.k) { S.k = k; render(); }
  updateUi(t);
  autoScroll(t);
}

function startPlay() {
  const p = audio.play();
  if (p && p.catch) p.catch(() => {});
}

function playFlow(j) {
  const item = S.flow[j];
  if (!item) return;
  S.pin = j;
  S.pinFrom = Math.max(0, item.start - LEAD_S);
  audio.currentTime = S.pinFrom;
  startPlay();
  refresh();
}

let raf = 0;
function loop() {
  refresh();
  raf = audio.paused ? 0 : requestAnimationFrame(loop);
}
audio.addEventListener('play', () => { if (!raf) raf = requestAnimationFrame(loop); refresh(); });
['pause', 'ended', 'seeked', 'timeupdate', 'loadedmetadata', 'durationchange'].forEach(ev => audio.addEventListener(ev, refresh));

$('playBtn').addEventListener('click', () => {
  if (audio.paused) startPlay(); else audio.pause();
  refresh();
});

const seekEl = $('seek');
seekEl.addEventListener('pointerdown', () => { seekDragging = true; });
window.addEventListener('pointerup', () => { seekDragging = false; });
seekEl.addEventListener('input', () => { S.pin = -1; audio.currentTime = +seekEl.value; refresh(); });

function setSpeed(v) {
  audio.defaultPlaybackRate = v;
  audio.playbackRate = v;
  $('speedSeg').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.speed === v)));
  savePrefs();
}
$('speedSeg').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b) setSpeed(+b.dataset.speed);
});

const reader = $('reader');
reader.addEventListener('click', e => {
  const el = e.target.closest('.line');
  if (el && el.dataset.j !== '') playFlow(+el.dataset.j);
});
reader.addEventListener('keydown', e => {
  const el = e.target.closest('.line');
  if (el && (e.key === 'Enter' || e.key === ' ') && el.dataset.j !== '') { e.preventDefault(); playFlow(+el.dataset.j); }
});
['touchstart', 'wheel', 'pointerdown'].forEach(ev => $('mainLine').addEventListener(ev, () => { S.userScrollAt = Date.now(); }, { passive: true }));

/* ---------- image ---------- */

function setHero(url) {
  const hero = $('hero');
  const img = $('heroImg');
  const mine = ++S.imgToken;
  img.onload = () => { if (mine === S.imgToken) hero.dataset.state = 'ok'; };
  img.onerror = () => { if (mine === S.imgToken) hero.dataset.state = 'none'; };
  if (!url) {
    img.removeAttribute('src');
    hero.dataset.state = 'none';
    return;
  }
  hero.dataset.state = 'loading';
  img.src = url;
}

/* ---------- loading ---------- */

function setHeader(st, meta) {
  $('pickStory').textContent = st.title;
  $('pickChapter').textContent = `${meta.order}. ${meta.name}`;
}

async function loadChapter(storyId, order) {
  const mine = ++S.token;
  const st = story(storyId) || S.index.stories[0];
  const meta = st.chapters.find(c => c.order === order) || st.chapters[0];
  S.storyId = st.id;
  S.order = meta.order;
  S.sheetStory = st.id;
  audio.pause();
  S.pin = -1;
  setHeader(st, meta);
  let data;
  try {
    const res = await fetch(meta.file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    if (mine !== S.token) return;
    S.chapter = null;
    $('mainText').textContent = `Could not load the chapter: ${err.message}`;
    return;
  }
  if (mine !== S.token) return;
  S.chapter = data;
  audio.src = data.audio;
  buildFlow();
  S.k = -2;
  setHero(data.image);
  refresh();
  try { history.replaceState(null, '', `#${S.storyId}/${S.order}`); } catch (e) { /* history unavailable */ }
  savePrefs();
}

function parseHash() {
  const [s, o] = location.hash.slice(1).split('/');
  const st = story(s);
  if (!st) return null;
  const order = Number(o);
  return { story: st.id, order: st.chapters.some(c => c.order === order) ? order : st.chapters[0].order };
}

window.addEventListener('hashchange', () => {
  const h = parseHash();
  if (h && (h.story !== S.storyId || h.order !== S.order)) loadChapter(h.story, h.order);
});

/* ---------- sheet ---------- */

function chapterMeta(c) {
  const u = c.unmatched[modelKey()];
  let s = `${c.paragraphs} paragraphs`;
  if (u) s += ` · ${u} unmatched`;
  if (c.differ) s += ` · ${c.differ} differ`;
  return s;
}

function buildChapterList() {
  const list = $('chapterList');
  list.textContent = '';
  story(S.sheetStory).chapters.forEach(c => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.order = c.order;
    const current = S.sheetStory === S.storyId && c.order === S.order;
    if (current) b.setAttribute('aria-current', 'true');
    const nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = `${c.order}. ${c.name}`;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = chapterMeta(c);
    b.append(nm, meta);
    li.appendChild(b);
    list.appendChild(li);
  });
}

function openSheet() {
  S.sheetStory = S.storyId;
  $('storySel').value = S.storyId;
  buildChapterList();
  $('sheet').hidden = false;
  const cur = $('chapterList').querySelector('[aria-current="true"]');
  if (cur) cur.scrollIntoView({ block: 'center' });
  $('sheetClose').focus();
}

function closeSheet() {
  $('sheet').hidden = true;
  $('pickBtn').focus();
}

function setModel(key) {
  S.model = key === 'large' ? 'large' : 'small';
  $('modelSmall').setAttribute('aria-pressed', String(S.model === 'small'));
  $('modelLarge').setAttribute('aria-pressed', String(S.model === 'large'));
  if (S.chapter) { S.pin = -1; buildFlow(); S.k = -2; refresh(); }
  if (!$('sheet').hidden) buildChapterList();
  savePrefs();
}

$('pickBtn').addEventListener('click', openSheet);
$('sheetClose').addEventListener('click', closeSheet);
$('sheetBg').addEventListener('click', closeSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('sheet').hidden) closeSheet(); });
$('modelSmall').addEventListener('click', () => setModel('small'));
$('modelLarge').addEventListener('click', () => setModel('large'));
$('storySel').addEventListener('change', e => {
  S.sheetStory = e.target.value;
  buildChapterList();
  document.querySelector('.sheet-body').scrollTop = 0;
});
$('chapterList').addEventListener('click', e => {
  const b = e.target.closest('button[data-order]');
  if (!b) return;
  closeSheet();
  loadChapter(S.sheetStory, +b.dataset.order);
});
$('desktopLink').addEventListener('click', e => { e.currentTarget.href = `index.html${location.hash}`; });

/* ---------- start ---------- */

async function init() {
  const res = await fetch('data/index.json');
  S.index = await res.json();
  S.index.stories.forEach(s => {
    const o = document.createElement('option');
    o.value = s.id;
    o.textContent = `${s.title} (${s.chapters.length} chapters)`;
    $('storySel').appendChild(o);
  });
  setModel(prefs.model);
  setSpeed(SPEEDS.includes(prefs.speed) ? prefs.speed : 1);
  const h = parseHash();
  const saved = story(prefs.story) ? { story: prefs.story, order: prefs.order } : null;
  const first = S.index.stories[0];
  const start = h || saved || { story: first.id, order: first.chapters[0].order };
  await loadChapter(start.story, start.order);
}

init().catch(err => { $('mainText').textContent = `Could not start: ${err.message}`; });
})();
