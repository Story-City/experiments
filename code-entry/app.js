// Code entry (V0.5): the end of The Summons. The player enters the code from the letter's wax seal
// on a glowing in-page keypad. Words live in story.js; this file is behaviour and drawing only.
const { STORY, VARIANTS } = await import(`./story.js${window.CACHE_V || ''}`);

const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pick = () => { const q = new URLSearchParams(location.search).get('v') || location.hash.slice(1); return VARIANTS[q] ? q : 'digits'; };
const JUMP = /code/.test(location.hash);   // testers' shortcut: #code jumps straight to the keypad
let vKey = pick();
let V = VARIANTS[vKey];

// ---------- art (CSS/SVG only, no image files) ----------
const HOOD = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4c-8 0-13 7-13 15v17h26V19C33 11 28 4 20 4z" fill="#7c62c9"/><ellipse cx="20" cy="21" rx="7.5" ry="9" fill="#170c35"/><circle cx="17" cy="21" r="1.2" fill="#c9a2ff"/><circle cx="23" cy="21" r="1.2" fill="#c9a2ff"/></svg>`;

// The Society's symbol (same mark as the hoodie and the seal in the FTUE letter): ring, triangle, dot.
const symbol = (cx, cy, r, color, w = 3) => {
  const k = r / 26;
  return `<g fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round"><circle cx="${cx}" cy="${cy}" r="${r}"/>` +
    `<path d="M${cx} ${cy - 18 * k} L${cx + 16 * k} ${cy + 12 * k} H${cx - 16 * k} Z"/></g><circle cx="${cx}" cy="${cy + 2 * k}" r="${4 * k}" fill="${color}"/>`;
};

// The drop spot: a glowing mail slot floating in midair, buttons beside it, the symbol above.
function dropSpot(p){
  const stars = Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 97) % 400}" cy="${(i * 53) % 230}" r="${i % 3 ? 1 : 1.6}" fill="#fff" opacity="${0.25 + (i % 4) * 0.15}"/>`).join('');
  const keys = Array.from({ length: 12 }, (_, i) => `<rect x="${262 + (i % 3) * 22}" y="${238 + Math.floor(i / 3) * 22}" width="16" height="16" rx="4" fill="#59c3ff" opacity="${i === 4 ? 1 : 0.75}"/>`).join('');
  return `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="${p}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0620"/><stop offset="0.75" stop-color="#2a1a5e"/></linearGradient>
    <radialGradient id="${p}halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#59c3ff" stop-opacity="0.55"/><stop offset="1" stop-color="#59c3ff" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}gold" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f5c95a" stop-opacity="0.6"/><stop offset="1" stop-color="#f5c95a" stop-opacity="0"/></radialGradient>
    <linearGradient id="${p}brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1d58c"/><stop offset="1" stop-color="#9b6d25"/></linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#${p}sky)"/>${stars}
  <path d="M0 400 L400 380 V500 H0 Z" fill="#120a2b"/>
  <path d="M0 430 L400 412" stroke="#2a1f52" stroke-width="2"/>
  <ellipse class="pulse" cx="200" cy="440" rx="90" ry="12" fill="#59c3ff" opacity="0.35"/>
  <g class="float">
    <circle cx="200" cy="270" r="150" fill="url(#${p}halo)"/>
    <circle cx="200" cy="120" r="54" fill="url(#${p}gold)"/>
    ${symbol(200, 120, 30, '#f5c95a', 4)}
    <rect x="88" y="220" width="160" height="104" rx="14" fill="url(#${p}brass)"/>
    <rect x="96" y="228" width="144" height="88" rx="9" fill="#2a1d0a" opacity="0.35"/>
    <rect x="110" y="262" width="116" height="18" rx="9" fill="#06030f"/>
    <rect x="110" y="262" width="116" height="18" rx="9" fill="none" stroke="#59c3ff" stroke-width="3"/>
    <rect x="252" y="228" width="80" height="102" rx="12" fill="#1c133a" stroke="#59c3ff" stroke-width="2" opacity="0.95"/>
    ${keys}
  </g>
</svg>`;
}

// Wax seal on the envelope, magnified. Gold characters across the middle; the symbol above them.
function seal(code){
  const cx = 180, cy = 150, pts = [];
  for (let i = 0; i < 64; i++) {
    const a = i / 64 * Math.PI * 2, r = 124 + 6 * Math.sin(a * 7) + 4 * Math.sin(a * 13 + 1);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const blob = 'M' + pts.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join(' L') + ' Z';
  const big = code.length <= 6;
  return `<svg viewBox="0 0 360 300" preserveAspectRatio="xMidYMid meet" style="overflow:visible" role="img" aria-label="${V.sealLabel}">
  <defs>
    <radialGradient id="sw" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#d9463b"/><stop offset="0.55" stop-color="#8e1a17"/><stop offset="1" stop-color="#560b09"/></radialGradient>
    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset="0.5" stop-color="#f5c95a"/><stop offset="1" stop-color="#c8912b"/></linearGradient>
  </defs>
  <g stroke="#8b6b3a" stroke-width="2.5" opacity="0.7" fill="none"><path d="M-400 -260 L${cx} ${cy} L760 -260"/><path d="M-400 560 L${cx} ${cy + 40} L760 560" opacity="0.5"/></g>
  <path d="${blob}" fill="url(#sw)" transform="translate(4 8)" opacity="0.35" style="filter:blur(4px)"/>
  <path d="${blob}" fill="url(#sw)"/>
  <circle cx="${cx}" cy="${cy}" r="98" fill="none" stroke="#5a0c0a" stroke-width="6" opacity="0.65"/>
  <circle cx="${cx}" cy="${cy}" r="94" fill="none" stroke="#e8584c" stroke-width="1.5" opacity="0.5"/>
  <ellipse cx="${cx - 52}" cy="${cy - 62}" rx="26" ry="12" fill="#fff" opacity="0.14" transform="rotate(-30 ${cx - 52} ${cy - 62})"/>
  ${symbol(cx, cy - 46, 22, 'url(#sg)', 3.5)}
  <text x="${cx}" y="${cy + 42}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="${big ? 50 : 40}"
    textLength="${big ? 168 : 172}" lengthAdjust="spacingAndGlyphs" fill="url(#sg)" stroke="#3a0705" stroke-width="1.2" paint-order="stroke">${code}</text>
</svg>`;
}

// After the right code: the trap door slides aside to reveal a glowing staircase.
function stairs(){
  const steps = Array.from({ length: 7 }, (_, i) => {
    const t = i / 7, y = 600 + t * 92, inset = 26 + t * 34, h = 14 - t * 5;
    return `<path d="M${92 + inset} ${y} H${298 - inset} L${294 - inset} ${y + h} H${96 + inset} Z" fill="#f5c95a" opacity="${0.85 - t * 0.5}"/>`;
  }).join('');
  return `<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06030f"/><stop offset="0.55" stop-color="#1d1245"/></linearGradient>
    <linearGradient id="wbeam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f5c95a" stop-opacity="0.75"/><stop offset="1" stop-color="#f5c95a" stop-opacity="0"/></linearGradient>
    <radialGradient id="wpit" cx="0.5" cy="1" r="0.9"><stop offset="0" stop-color="#ffdf8a"/><stop offset="0.6" stop-color="#7a4a12"/><stop offset="1" stop-color="#1a0d03"/></radialGradient>
    <radialGradient id="whalo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#59c3ff" stop-opacity="0.45"/><stop offset="1" stop-color="#59c3ff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="390" height="844" fill="url(#wsky)"/>
  <g transform="translate(0 -170)">
  <path d="M0 520 L390 500 V1100 H0 Z" fill="#120a2b"/>
  <g stroke="#2a1f52" stroke-width="2" fill="none"><path d="M0 560 L390 540"/><path d="M0 640 L390 625"/><path d="M0 740 L390 730"/><path d="M0 860 L390 852"/><path d="M60 520 L10 1100"/><path d="M200 510 V1100"/><path d="M330 504 L390 1100"/></g>
  <path d="M110 590 H280 L300 700 H90 Z" fill="url(#wpit)"/>
  ${steps}
  <g class="rise"><path d="M110 590 H280 L340 120 H50 Z" fill="url(#wbeam)"/></g>
  <g class="slab"><path d="M106 586 H284 L304 704 H86 Z" fill="#2c2350" stroke="#4a3f7a" stroke-width="3"/><path d="M130 610 H262 M120 650 H272" stroke="#3b3166" stroke-width="3"/></g>
  </g>
  <g transform="translate(0 -120)"><g class="float">
    <circle cx="195" cy="400" r="120" fill="url(#whalo)"/>
    <rect x="135" y="370" width="120" height="70" rx="12" fill="#c8912b"/>
    <rect x="152" y="396" width="86" height="14" rx="7" fill="#06030f" stroke="#59c3ff" stroke-width="2.5"/>
    <g class="sym">${symbol(195, 300, 28, '#f5c95a', 4)}</g>
  </g></g>
</svg>`;
}

// ---------- line endings: never one word alone on a line ----------
function setText(el, text){
  const words = String(text).trim().split(/\s+/);
  el.textContent = words.length < 3 ? words.join(' ') : words.slice(0, -2).join(' ') + ' ' + words.slice(-2).join(' ');
}
// Balanced text in a bubble leaves a gap on the right; shrink each bubble to its widest line.
function fitBubble(b){
  b.style.width = '';
  const r = document.createRange(); r.selectNodeContents(b);
  const rects = [...r.getClientRects()].filter(x => x.width > 0);
  if (new Set(rects.map(x => Math.round(x.top))).size < 2) return;
  const cs = getComputedStyle(b);
  const w = Math.max(...rects.map(x => x.right)) - Math.min(...rects.map(x => x.left));
  b.style.width = Math.ceil(w + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + 2) + 'px';
}
const fitAll = () => document.querySelectorAll('.bub, .me').forEach(b => b.offsetParent && fitBubble(b));
addEventListener('resize', () => { fitAll(); sizeBoxes(); });
document.fonts && document.fonts.ready.then(fitAll);

// ---------- sound and haptics ----------
let ctx = null;
let muted = false;
try { muted = localStorage.getItem('sc-code-entry-muted') === '1'; } catch (e) {}
function audio(){
  if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
function tone(freq, dur, { type = 'sine', gain = 0.045, at = 0, slide } = {}){
  if (muted) return;
  const c = audio(); if (!c) return;
  const t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
}
function rumbleSound(){
  if (muted) return;
  const c = audio(); if (!c) return;
  const len = c.sampleRate * 1.6, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  let last = 0; for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
  const src = c.createBufferSource(), lp = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime;
  lp.type = 'lowpass'; lp.frequency.value = 140; src.buffer = buf;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  src.connect(lp).connect(g).connect(c.destination); src.start(t);
}
const sfx = {
  key: () => tone(1046, 0.05),
  back: () => tone(622, 0.05),
  wrong: () => { tone(233, 0.13, { type: 'triangle', gain: 0.07 }); tone(175, 0.18, { type: 'triangle', gain: 0.07, at: 0.14 }); },
  right: () => [1046, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.12, { type: 'triangle', gain: 0.05, at: i * 0.08 })),
  chime: () => [784, 1175, 1568].forEach((f, i) => tone(f, 0.9, { gain: 0.035, at: i * 0.12 })),
};
function buzz(pattern){
  try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(pattern); } catch (e) {}
}

// ---------- start ----------
$('startArt').innerHTML = dropSpot('a');
$('startKicker').textContent = STORY.start.kicker;
setText($('startTitle'), STORY.start.title);
setText($('startSub'), STORY.start.sub);
$('startBtn').textContent = STORY.start.button;
$('abLabel').textContent = STORY.start.switchLabel;
document.querySelectorAll('.ab button').forEach(b => {
  b.textContent = VARIANTS[b.dataset.v].label;
  b.onclick = () => setVariant(b.dataset.v);
});
function setVariant(k){
  vKey = k; V = VARIANTS[k];
  document.querySelectorAll('.ab button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === k)));
  const u = new URL(location.href); u.searchParams.set('v', k); u.hash = ''; history.replaceState(null, '', u);
}
setVariant(vKey);
['topAva', 'sayAva', 'winAva'].forEach(id => $(id).innerHTML = HOOD);
$('topSender').textContent = STORY.sender;
$('topChapter').textContent = STORY.chapter;
$('codeTitle').textContent = STORY.chapter;
$('helpBtn').setAttribute('aria-label', STORY.help);

let runId = 0;
function show(id){ ['start', 'chat', 'code', 'win'].forEach(s => $(s).hidden = s !== id); }
function toStart(){ runId++; show('start'); }
$('startBtn').onclick = () => { audio(); startChat(); };
$('chatBack').onclick = toStart;
$('codeBack').onclick = toStart;

// ---------- chat ----------
const thread = $('thread'), choicesEl = $('choices');
function scrollDown(){ thread.scrollTop = thread.scrollHeight; }
function addLine(el){ el.classList.add('line', 'enter'); thread.appendChild(el); el.querySelectorAll('.bub').forEach(fitBubble); if (el.classList.contains('me')) fitBubble(el); scrollDown(); }
let lastFromThem = false;
function sayEl(inner, isPic){
  const d = document.createElement('div');
  d.className = 'say' + (lastFromThem ? ' cont' : '');
  d.innerHTML = `<div class="ava">${HOOD}</div><div><div class="who"></div>${isPic ? '<div class="pic"></div>' : '<div class="bub"></div>'}</div>`;
  d.querySelector('.who').textContent = STORY.sender;
  lastFromThem = true;
  return d;
}
async function typing(id){
  const t = document.createElement('div');
  t.className = 'typing line enter';
  t.innerHTML = `<div class="ava">${HOOD}</div><div class="dots"><i></i><i></i><i></i></div>`;
  if (lastFromThem) t.querySelector('.ava').style.visibility = 'hidden';
  thread.appendChild(t); scrollDown();
  await sleep(700);
  t.remove();
  return id === runId;
}
function waitChoice(label, id){
  return new Promise(res => {
    choicesEl.innerHTML = ''; choicesEl.hidden = false;
    const b = document.createElement('button'); setText(b, label);
    b.onclick = () => { audio(); choicesEl.hidden = true; res(id === runId); };
    choicesEl.appendChild(b);
  });
}
async function startChat(){
  const id = ++runId;
  show('chat'); thread.innerHTML = ''; choicesEl.hidden = true; lastFromThem = false;
  await sleep(400);
  for (const step of V.chat) {
    if (id !== runId) return;
    if (step.say) { if (!await typing(id)) return; const d = sayEl(); setText(d.querySelector('.bub'), step.say); addLine(d); }
    else if (step.image) { if (!await typing(id)) return; const d = sayEl('', true); const pic = d.querySelector('.pic'); pic.innerHTML = dropSpot('c'); pic.setAttribute('role', 'img'); pic.setAttribute('aria-label', step.alt); addLine(d); }
    else if (step.choice) { if (!await waitChoice(step.choice, id)) return; const m = document.createElement('div'); m.className = 'me'; setText(m, step.choice); lastFromThem = false; addLine(m); }
    else if (step.open) { await sleep(700); if (id !== runId) return; openCode(); return; }
    await sleep(380);
  }
}

// ---------- code entry ----------
const boxesEl = $('boxes'), keypadEl = $('keypad'), sayLine = $('sayLine'), solveBtn = $('solveBtn');
let entry = '', busy = false, tier = 0, hintsUsed = 0, wrongs = 0, idleTimer = 0;
const N = () => V.answer.length;

const BACK_SVG = `<svg viewBox="0 0 24 24"><path d="M21 5H9l-6 7 6 7h12z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/></svg>`;
const SEND_SVG = `<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>`;
function buildKeypad(){
  const chars = V.keypad === 'letters' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') : '123456789'.split('');
  const keys = V.keypad === 'letters' ? [...chars, 'back', 'send'] : [...chars, 'back', '0', 'send'];
  keypadEl.className = 'keypad' + (V.keypad === 'letters' ? ' letters' : '');
  keypadEl.innerHTML = '';
  keys.forEach((k, i) => {
    const b = document.createElement('button');
    b.className = 'key' + (k === 'send' ? ' send' : k === 'back' ? ' back' : '');
    b.dataset.k = k; b.style.setProperty('--i', i);
    if (k === 'back') { b.innerHTML = BACK_SVG; b.setAttribute('aria-label', 'Delete'); }
    else if (k === 'send') { b.innerHTML = SEND_SVG; b.setAttribute('aria-label', 'Send'); }
    else b.textContent = k;
    b.addEventListener('pointerdown', e => { e.preventDefault(); press(k, b); });
    b.addEventListener('click', e => { if (e.detail === 0) press(k, b); });   // keyboard / screen reader activation
    keypadEl.appendChild(b);
  });
}
function sizeBoxes(){
  const n = N(), gap = n > 6 ? 7 : 8, avail = Math.min($('phone').clientWidth, 440) - 32;
  boxesEl.style.setProperty('--gap', gap + 'px');
  boxesEl.style.setProperty('--bw', Math.min(50, Math.floor((avail - gap * (n - 1)) / n)) + 'px');
}
function renderBoxes(popAt = -1){
  const n = N();
  if (boxesEl.children.length !== n) { boxesEl.innerHTML = ''; for (let i = 0; i < n; i++) { const d = document.createElement('div'); d.className = 'box'; boxesEl.appendChild(d); } }
  [...boxesEl.children].forEach((d, i) => {
    d.textContent = entry[i] || '';
    d.classList.toggle('filled', i < entry.length);
    d.classList.toggle('next', i === entry.length && !busy);
    d.classList.toggle('pop', i === popAt);
  });
  boxesEl.setAttribute('aria-label', entry.length ? `Entered ${entry.split('').join(' ')}, ${entry.length} of ${n}` : `Nothing entered yet, ${n} to go`);
  keypadEl.querySelector('.send').classList.toggle('ready', entry.length === n);
}
function say(text, kind = ''){
  setText($('sayText'), text);
  sayLine.className = 'say-line ' + kind;
  void sayLine.offsetWidth; sayLine.classList.add('fresh');
  fitBubble($('sayText'));
}
function markHints(){
  $('hintsUsed').hidden = hintsUsed === 0;
  $('hintsUsed').textContent = STORY.hintsUsed(hintsUsed);
}
function lookAtSeal(){ const l = $('lens'); l.classList.remove('look'); void l.offsetWidth; l.classList.add('look'); }
function nudgeHelp(){ const h = $('helpBtn'); h.classList.remove('nudge'); void h.offsetWidth; h.classList.add('nudge'); }
function idle(){ clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (!$('code').hidden && !busy) nudgeHelp(); }, 15000); }

function openCode(){
  entry = ''; busy = false; tier = 0; hintsUsed = 0; wrongs = 0;
  show('code');
  $('lens').innerHTML = seal(V.answer);
  buildKeypad(); sizeBoxes(); boxesEl.className = 'boxes'; boxesEl.innerHTML = ''; renderBoxes();
  solveBtn.hidden = true; setText(solveBtn, V.solve); markHints();
  say(V.prompt);
  idle();
}
function flashKey(k){
  const b = keypadEl.querySelector(`[data-k="${k}"]`); if (!b) return;
  b.classList.add('lit'); setTimeout(() => b.classList.remove('lit'), 140);
}
function press(k, btn){
  if (busy) return;
  idle();
  if (btn) flashKey(k);
  if (k === 'back') { if (!entry) return; entry = entry.slice(0, -1); sfx.back(); buzz(6); renderBoxes(); return; }
  if (k === 'send') { if (entry.length < N()) { say(V.notFull); sfx.back(); return; } check(); return; }
  if (entry.length >= N()) return;
  entry += k; sfx.key(); buzz(8); renderBoxes(entry.length - 1);
}
function check(){
  if (entry === V.answer) return right();
  wrongs++; busy = true;
  boxesEl.classList.add('shake'); sfx.wrong(); buzz([60, 40, 60]);
  say(V.wrong, 'bad'); lookAtSeal(); nudgeHelp();
  setTimeout(() => { boxesEl.classList.remove('shake'); entry = ''; busy = false; renderBoxes(); }, 650);
}
$('helpBtn').onclick = () => {
  audio(); idle();
  if (busy) return;
  if (tier < V.hints.length) { say(V.hints[tier], 'hint'); tier++; hintsUsed++; markHints(); lookAtSeal(); sfx.key(); }
  else if (solveBtn.hidden) { solveBtn.hidden = false; sfx.key(); }
  else nudgeEl(solveBtn);
};
function nudgeEl(el){ el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; }
solveBtn.onclick = async () => {
  if (busy) return;
  busy = true; solveBtn.hidden = true; hintsUsed++; markHints();
  entry = ''; renderBoxes();
  for (const ch of V.answer) { await sleep(190); flashKey(ch); entry += ch; sfx.key(); renderBoxes(entry.length - 1); }
  await sleep(260);
  right();
};
$('muteBtn').onclick = () => {
  muted = !muted;
  try { localStorage.setItem('sc-code-entry-muted', muted ? '1' : '0'); } catch (e) {}
  markMute();
  if (!muted) sfx.key();
};
function markMute(){
  $('muteBtn').setAttribute('aria-pressed', String(muted));
  $('muteBtn').setAttribute('aria-label', muted ? STORY.soundOff : STORY.soundOn);
  $('muteBtn').title = muted ? STORY.soundOff : STORY.soundOn;
}
markMute();
addEventListener('keydown', e => {
  if ($('code').hidden || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  if (k === 'Backspace') press('back', true);
  else if (k === 'Enter') { e.preventDefault(); press('send', true); }
  else if (V.keypad === 'digits' ? /^[0-9]$/.test(k) : /^[A-Z]$/.test(k)) press(k, true);
});

// ---------- right: the staircase ----------
async function right(){
  busy = true; clearTimeout(idleTimer);
  renderBoxes(); boxesEl.classList.add('right'); keypadEl.classList.add('won');
  sfx.right(); buzz([20, 30, 20, 30, 120]);
  const id = runId;
  await sleep(1000); if (id !== runId) return;
  const w = $('win');
  w.className = 'win'; $('winArt').innerHTML = stairs();
  setText($('winText'), STORY.win.rumble);
  $('winEyebrow').textContent = STORY.win.eyebrow;
  setText($('winTitle'), STORY.win.title);
  $('againBtn').textContent = STORY.win.again;
  const other = vKey === 'digits' ? 'letters' : 'digits';
  setText($('otherBtn'), STORY.win.other[vKey]);
  $('otherBtn').onclick = () => { setVariant(other); startChat(); };
  show('win');
  await sleep(120); w.classList.add('rumble', 'open'); rumbleSound(); buzz([200, 80, 300]);
  await sleep(1400); if (id !== runId) return;
  w.classList.add('talk'); fitBubble($('winText')); tone(880, 0.08); tone(1175, 0.1, { at: 0.09 });
  await sleep(1900); if (id !== runId) return;
  w.classList.add('welcome'); sfx.chime(); sparks();
  await sleep(1100); if (id !== runId) return;
  w.classList.add('done');
}
function sparks(){
  const w = $('win'), r = w.getBoundingClientRect();
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('i'); s.className = 'spark';
    s.style.left = (r.width / 2 + (Math.random() - 0.5) * 120) + 'px';
    s.style.top = (r.height * 0.42 + (Math.random() - 0.5) * 60) + 'px';
    s.style.setProperty('--dx', ((Math.random() - 0.5) * 300).toFixed(0) + 'px');
    s.style.setProperty('--dy', (-80 - Math.random() * 260).toFixed(0) + 'px');
    s.style.animationDelay = (Math.random() * 0.5).toFixed(2) + 's';
    w.appendChild(s); setTimeout(() => s.remove(), 3400);
  }
}
$('againBtn').onclick = () => startChat();

if (JUMP) openCode();
