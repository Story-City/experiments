// Narrated reader mockup. One reader view for narrated and text stories.
//   ?v=synced   (default) audio bar; lines appear as they're spoken, current line lit, earlier lines dimmed
//   ?v=text     same content as a text story: no audio bar, typing dots, tap to skip ahead
//   ?v=captions full-screen art with one or two caption lines over it
// There's no real audio: each line gets a duration and a timer moves the highlight.
// "Read aloud" uses the phone's voice (speechSynthesis) when it's available; muted works the same.

const { STORY, CAST, OPENING, CHOICE, BRANCHES } = await import(`./story.js${window.CACHE_V || ''}`);

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const VARIANTS = ['synced', 'text', 'captions'];
const fromHash = location.hash.slice(1);
let V = VARIANTS.includes(params.get('v')) ? params.get('v') : VARIANTS.includes(fromHash) ? fromHash : 'synced';
const FAST = Math.max(1, +params.get('fast') || 1);   // hidden: speeds up headless tests
const SPEEDS = [1, 1.5, 2, 0.75];

const HOOD = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4c-8 0-13 7-13 15v17h26V19C33 11 28 4 20 4z" fill="#7c62c9"/><ellipse cx="20" cy="21" rx="7.5" ry="9" fill="#170c35"/><circle cx="17" cy="21" r="1.2" fill="#c9a2ff"/><circle cx="23" cy="21" r="1.2" fill="#c9a2ff"/></svg>`;

// Night street, drawn here (no image files). The figure, envelope and pocket fade in and out by scene.
const SCENE_SVG = `<svg viewBox="0 0 390 760" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0620"/><stop offset="0.7" stop-color="#2a1a5e"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd98a" stop-opacity="0.75"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
    <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd98a" stop-opacity="0.35"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="390" height="760" fill="url(#sky)"/>
  <g fill="#fff" opacity="0.6"><circle cx="40" cy="60" r="1.2"/><circle cx="120" cy="30" r="1"/><circle cx="210" cy="80" r="1.4"/><circle cx="330" cy="45" r="1"/><circle cx="300" cy="120" r="1.1"/><circle cx="70" cy="150" r="0.9"/></g>
  <circle cx="320" cy="110" r="26" fill="#efe6c8" opacity="0.85"/><circle cx="331" cy="103" r="24" fill="#120a2c"/>
  <g fill="#120a2c">
    <rect x="-10" y="250" width="110" height="330"/><rect x="95" y="300" width="80" height="280"/><rect x="290" y="230" width="120" height="350"/><path d="M290 230l60-50 60 50z"/>
  </g>
  <g fill="#f2c96b" opacity="0.8"><rect x="20" y="290" width="16" height="22"/><rect x="60" y="340" width="16" height="22"/><rect x="115" y="330" width="14" height="20"/><rect x="310" y="280" width="16" height="22"/><rect x="350" y="330" width="16" height="22" opacity="0.4"/></g>
  <rect y="580" width="390" height="180" fill="#1d1340"/>
  <rect y="575" width="390" height="10" fill="#2f2560"/>
  <g class="lamp-glow"><path d="M232 205 L170 590 L300 590 Z" fill="url(#cone)"/><circle cx="235" cy="200" r="70" fill="url(#glow)"/></g>
  <rect x="231" y="200" width="7" height="385" fill="#0d0824"/><path d="M222 196h26l-5-14h-16z" fill="#0d0824"/><rect x="226" y="196" width="18" height="6" rx="2" fill="#ffe7b0"/>
  <g class="fig">
    <path d="M205 380c-22 0-34 20-34 44v34c-8 26-12 70-14 132h96c-2-62-6-106-14-132v-34c0-24-12-44-34-44z" fill="#0a0618"/>
    <ellipse cx="205" cy="430" rx="15" ry="19" fill="#05030d"/>
    <path d="M193 470l-8 6 8 6 8-6z" fill="#c9a2ff" opacity="0.8"/>
  </g>
  <g class="env"><rect x="238" y="482" width="40" height="27" rx="2" fill="#efe2c2" transform="rotate(-8 258 495)"/><circle cx="259" cy="495" r="6" fill="#8e1c2a"/></g>
  <g class="pocket"><rect x="115" y="560" width="160" height="104" rx="6" fill="#efe2c2" transform="rotate(4 195 612)"/><path d="M117 566l78 52 78-46" fill="none" stroke="#c9b48a" stroke-width="3" transform="rotate(4 195 612)"/><circle cx="196" cy="618" r="15" fill="#8e1c2a"/></g>
</svg>`;

// each copy of the art needs its own gradient ids, or a hidden copy's gradients win
const sceneSvg = k => SCENE_SVG.replace(/id="(\w+)"/g, `id="$1-${k}"`).replace(/url\(#(\w+)\)/g, `url(#$1-${k})`);

// ---------- timeline ----------
const secsFor = line => line.secs || (line.who === 'player' ? 1.2 : 0.75 + line.text.split(/\s+/).length * 0.36);
let chosen = null;
let timeline = [];
function build(){
  timeline = OPENING.map(l => ({ ...l, ms: secsFor(l) * 1000 }));
  timeline.push({ kind: 'choice', ms: 0 });
  if (chosen) {
    const opt = CHOICE.options.find(o => o.id === chosen);
    timeline.push({ who: 'player', text: opt.said, ms: secsFor({ who: 'player' }) * 1000 });
    BRANCHES[chosen].forEach(l => timeline.push({ ...l, ms: secsFor(l) * 1000 }));
  }
}
const choiceIdx = () => timeline.findIndex(x => x.kind === 'choice');
const isChoice = i => timeline[i] && timeline[i].kind === 'choice';
// the part of the timeline the scrubber covers: up to the choice until one is made
const span = () => chosen ? timeline.length : choiceIdx();
const totalMs = () => timeline.slice(0, span()).reduce((s, x) => s + x.ms, 0);
const posMs = () => timeline.slice(0, idx).reduce((s, x) => s + x.ms, 0) + t;

// ---------- state ----------
let idx = 0, t = 0, reached = -1, playing = false, speedI = 0, follow = true, ended = false;
let timer = null, lastTick = 0, runId = 0;
const els = [];          // thread element for each timeline index
let endEl = null;

const reader = $('reader'), thread = $('thread'), choicesEl = $('choices'), playBtn = $('playBtn'), scrub = $('scrub');

// ---------- start screen ----------
$('startTitle').textContent = STORY.title;
$('startChapter').textContent = STORY.chapter;
$('startArt').innerHTML = sceneSvg('a'); $('startArt').classList.add('scene-art'); $('startArt').dataset.s = 'corner';
function markVariant(){
  document.querySelectorAll('.ab button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === V)));
  $('startKind').textContent = V === 'text' ? 'Text story' : 'Narrated story · 🎧';
  $('startBtn').textContent = V === 'text' ? 'Start chapter' : 'Play chapter';
}
document.querySelectorAll('.ab button').forEach(b => b.onclick = () => {
  V = b.dataset.v; markVariant();
  const u = new URL(location.href); u.searchParams.set('v', V); u.hash = ''; history.replaceState(null, '', u);
});
markVariant();
$('startBtn').onclick = open;
$('backBtn').onclick = close;

function open(){
  runId++;
  chosen = null; build();
  idx = 0; t = 0; reached = -1; ended = false; follow = true; speedI = 0;
  els.length = 0; endEl = null;
  thread.innerHTML = ''; $('captions').innerHTML = '';
  choicesEl.hidden = true; $('nowBtn').hidden = true;
  $('topTitle').textContent = STORY.title; $('topChapter').textContent = STORY.chapter;
  $('speedBtn').textContent = '1×';
  reader.className = 'reader ' + (V === 'text' ? 'no-audio' : V === 'captions' ? 'cap' : 'synced');
  $('audio').hidden = V === 'text';
  $('aloudWrap').hidden = V === 'text' || !('speechSynthesis' in window);
  $('scene').hidden = V !== 'captions';
  $('captions').hidden = V !== 'captions';
  if (V === 'captions') { $('scene').innerHTML = sceneSvg('b'); $('scene').classList.add('scene-art'); }
  $('start').hidden = true; reader.hidden = false;
  if (V === 'text') runText(runId);
  else { reveal(0); setPlaying(true); }
}
function close(){
  runId++; setPlaying(false); stopSpeech();
  reader.hidden = true; $('start').hidden = false;
}

// ---------- rendering ----------
function lineEl(i){
  const l = timeline[i];
  const d = document.createElement('div');
  if (l.who === 'narrator') { d.className = 'line narr'; d.textContent = l.text; }
  else if (l.who === 'player') { d.className = 'line me'; d.textContent = l.text; }
  else {
    const prev = timeline[i - 1];
    d.className = 'line say' + (prev && prev.who === l.who ? ' cont' : '');
    d.innerHTML = `<div class="ava">${HOOD}</div><div><div class="who"></div><div class="bub"></div></div>`;
    d.querySelector('.who').textContent = CAST[l.who].name;
    d.querySelector('.bub').textContent = l.text;
  }
  return d;
}
// show every line up to i (the choice marker has no element)
function reveal(i){
  for (let k = reached + 1; k <= Math.min(i, timeline.length - 1); k++) {
    if (isChoice(k)) continue;
    const d = lineEl(k); d.classList.add('enter'); els[k] = d; thread.appendChild(d);
  }
  reached = Math.max(reached, i);
}
function paint(){
  if (V === 'captions') return paintCaptions();
  const cur = curEl();
  els.forEach(d => d && d.classList.toggle('now', d === cur && !ended));
  if (follow) scrollToNow();
}
function paintCaptions(){
  const box = $('captions');
  let s = 'corner';
  for (let k = 0; k <= Math.min(idx, timeline.length - 1); k++) if (timeline[k].scene) s = timeline[k].scene;
  $('scene').dataset.s = s;
  if (ended) return;
  const cur = timeline[idx];
  if (!cur || cur.kind === 'choice') return;
  let prevI = idx - 1; while (prevI >= 0 && isChoice(prevI)) prevI--;
  const prev = timeline[prevI];
  const key = idx + ':' + chosen;
  if (box.dataset.k === key) return;
  box.dataset.k = key;
  box.innerHTML = '';
  if (prev) { const p = document.createElement('div'); p.className = 'cap-prev'; p.textContent = prev.text; box.appendChild(p); }
  const c = document.createElement('div');
  c.className = 'cap-line ' + (cur.who === 'narrator' ? 'n' : cur.who === 'player' ? 'p' : 'f');
  if (cur.who === 'figure') { const w = document.createElement('span'); w.className = 'cap-who'; w.textContent = CAST.figure.name; c.appendChild(w); }
  c.appendChild(document.createTextNode(cur.text));
  box.appendChild(c);
}

// ---------- auto-scroll + "back to now" ----------
// the line being spoken; while a choice waits, the last line said stays lit
function curEl(){ for (let k = Math.min(idx, reached); k >= 0; k--) if (els[k]) return els[k]; return null; }
let progTop = -1;   // where the reader last scrolled itself; any other position means the person scrolled
function scrollToNow(){
  const target = ended ? endEl : curEl();
  if (!target) return;
  const top = target.offsetTop - thread.offsetTop;
  const want = top + target.offsetHeight - thread.clientHeight + 40;
  thread.scrollTop = Math.max(0, ended || isChoice(idx) ? thread.scrollHeight : Math.max(want, Math.min(thread.scrollTop, top - 20)));
  progTop = thread.scrollTop;
}
thread.addEventListener('scroll', () => {
  if (Math.abs(thread.scrollTop - progTop) < 2 || V === 'captions') return;
  const atBottom = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 60;
  const cur = ended ? endEl : curEl();
  let curVisible = true;
  if (cur) { const r = cur.getBoundingClientRect(), tr = thread.getBoundingClientRect(); curVisible = r.bottom > tr.top + 10 && r.top < tr.bottom - 10; }
  follow = atBottom || curVisible;
  $('nowBtn').hidden = follow;
}, { passive: true });
$('nowBtn').onclick = () => { follow = true; $('nowBtn').hidden = true; scrollToNow(); };

// ---------- audio clock (synced + captions) ----------
function setPlaying(on){
  playing = on && !ended && !isChoice(idx);
  reader.classList.toggle('paused', !playing);
  playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  clearInterval(timer);
  if (playing) { lastTick = performance.now(); timer = setInterval(tick, 80); speakCurrent(); }
  else stopSpeech();
  syncBar();
}
function tick(){
  const now = performance.now(), dt = (now - lastTick) * SPEEDS[speedI] * FAST; lastTick = now;
  const cur = timeline[idx];
  if (!cur) return;
  t += dt;
  // reading aloud: the voice decides when the line ends (with a fallback if it never reports back)
  if (speaking !== null && t >= cur.ms) { if (t < cur.ms * 3) { t = Math.min(t, cur.ms - 1); syncBar(); return; } }
  if (t >= cur.ms) advance(); else syncBar();
}
function advance(){
  stopSpeech();
  idx++; t = 0;
  while (isChoice(idx) && chosen) idx++;      // already chosen: run straight through
  goTo(idx);
}
// land on idx: reveal, paint, and pause for a choice or the end
function goTo(i){
  idx = i;
  if (idx >= timeline.length) return finish();
  ended = false; if (endEl) endEl.hidden = true;
  reveal(idx);
  if (isChoice(idx)) { paint(); setPlaying(false); showChoices(); return; }
  choicesEl.hidden = true;
  paint();
  if (playing) speakCurrent();
  syncBar();
}
function syncBar(){
  const total = totalMs();
  scrub.value = total ? Math.round(Math.min(1, posMs() / total) * 1000) : 0;
  $('tNow').textContent = fmt(posMs()); $('tEnd').textContent = (chosen ? '' : '~') + fmt(total);
  playBtn.disabled = ended ? false : isChoice(idx);
}
const fmt = ms => { const s = Math.round(ms / 1000 / SPEEDS[speedI]); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

playBtn.onclick = () => {
  if (ended) return replay();
  setPlaying(!playing);
};
$('speedBtn').onclick = () => {
  speedI = (speedI + 1) % SPEEDS.length;
  $('speedBtn').textContent = SPEEDS[speedI] + '×';
  if (speaking !== null) { stopSpeech(); speakCurrent(); }
  syncBar();
};
let wasPlaying = false;
scrub.addEventListener('pointerdown', () => { wasPlaying = playing; });
scrub.addEventListener('input', () => {
  const target = (+scrub.value / 1000) * totalMs();
  let acc = 0, i = 0;
  while (i < span() && acc + timeline[i].ms <= target) { acc += timeline[i].ms; i++; }
  stopSpeech();
  t = Math.max(0, target - acc);
  follow = true; $('nowBtn').hidden = true;
  goTo(i);
});
scrub.addEventListener('change', () => { if (!isChoice(idx) && !ended && (wasPlaying || playing)) setPlaying(true); });

// ---------- choices (always buttons; they pause the audio) ----------
function showChoices(){
  choicesEl.innerHTML = '';
  const q = document.createElement('div'); q.className = 'q'; q.textContent = CHOICE.prompt; choicesEl.appendChild(q);
  CHOICE.options.forEach(o => {
    const b = document.createElement('button'); b.textContent = o.label; b.dataset.choice = o.id;
    b.onclick = () => choose(o.id);
    choicesEl.appendChild(b);
  });
  choicesEl.hidden = false;
  if (V !== 'captions') { follow = true; scrollToNow(); }
}
function choose(id){
  chosen = id; build();
  choicesEl.hidden = true;
  const at = choiceIdx() + 1;
  if (V === 'text') return textChose(at);
  t = 0; idx = at; goTo(at); setPlaying(true);
}

// ---------- end of chapter ----------
function finish(){
  ended = true; idx = timeline.length; t = 0;
  setPlaying(false); paint();
  if (!endEl) {
    endEl = document.createElement('div');
    endEl.className = 'end';
    endEl.innerHTML = `<b>End of chapter 1</b><p></p><button class="go" id="nextBtn">Next chapter</button><br><button class="again" id="againBtn">Replay chapter</button>`;
    endEl.querySelector('p').textContent = 'Up next: ' + STORY.next;
    endEl.querySelector('#nextBtn').onclick = e => { e.target.textContent = 'In the app: free-trial screen'; };
    endEl.querySelector('#againBtn').onclick = replay;
    (V === 'captions' ? $('captions') : thread).appendChild(endEl);
  }
  if (V === 'captions') { const box = $('captions'); box.dataset.k = ''; box.innerHTML = ''; box.appendChild(endEl); }
  endEl.hidden = false;
  scrub.value = 1000; $('tNow').textContent = $('tEnd').textContent;
  playBtn.disabled = false;
  if (follow && V !== 'captions') scrollToNow();
}
function replay(){ open(); }

// ---------- read aloud (optional; silent works the same) ----------
let speaking = null;
const synth = window.speechSynthesis;
function speakCurrent(){
  if (!$('aloud').checked || !synth || V === 'text') return;
  const cur = timeline[idx];
  if (!cur || !cur.text || speaking === idx) return;
  stopSpeech();
  const u = new SpeechSynthesisUtterance(cur.text);
  u.rate = SPEEDS[speedI]; u.pitch = cur.who === 'figure' ? 0.6 : cur.who === 'player' ? 1.2 : 1;
  const mine = idx; speaking = idx;
  u.onend = u.onerror = () => { if (speaking === mine && playing && idx === mine) { speaking = null; advance(); } };
  synth.speak(u);
}
function stopSpeech(){ speaking = null; if (synth && (synth.speaking || synth.pending)) synth.cancel(); }
$('aloud').onchange = () => { if ($('aloud').checked) { t = 0; speakCurrent(); } else stopSpeech(); };

// ---------- text story (no audio): typing dots, auto-advance, tap to skip ----------
const wait = (ms, run) => new Promise(r => { skipWait = r; setTimeout(r, ms / FAST); }).then(() => run === runId);
let skipWait = () => {};
thread.addEventListener('click', e => { if (V === 'text' && !e.target.closest('button')) skipWait(); });
async function runText(run, from = 0){
  for (let i = from; i < timeline.length; i++) {
    const l = timeline[i];
    if (l.kind === 'choice') { idx = i; reached = i; showChoices(); return; }
    if (l.who === 'figure') {
      const ty = document.createElement('div'); ty.className = 'typing';
      ty.innerHTML = `<div class="ava">${HOOD}</div><div class="dots"><i></i><i></i><i></i></div>`;
      if (timeline[i - 1] && timeline[i - 1].who === 'figure') ty.querySelector('.ava').style.visibility = 'hidden';
      thread.appendChild(ty); scrollToNow2();
      if (!await wait(650, run)) return;
      ty.remove();
    }
    idx = i; reveal(i); if (follow) scrollToNow2();
    if (!await wait(700 + l.text.split(/\s+/).length * 170, run)) return;
  }
  ended = true; idx = timeline.length; finish();
}
function scrollToNow2(){ if (follow) { thread.scrollTop = thread.scrollHeight; progTop = thread.scrollTop; } }
function textChose(at){
  idx = at; runText(runId, at);
}

// for headless tests
window.__nr = { get state(){ return { V, idx, reached, playing, ended, chosen, follow, len: timeline.length, scrub: +scrub.value }; }, open, choose };
