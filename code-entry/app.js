// Code Entry (V0.8): the end of The Summons. The player enters the code from the letter's wax seal
// on a glowing numbers keypad (?v=glow, the default), QWERTY keys (?v=letters) or a ring dial (?v=dial).
// Words and the dial's letters live in story.js; this file is behaviour and drawing only.
const { STORY, VARIANTS } = await import(`./story.js${window.CACHE_V || ''}`);

const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Unknown or retired variants (an old ?v=digits link) fall back to Glow.
const pick = () => { const q = new URLSearchParams(location.search).get('v') || location.hash.slice(1); return VARIANTS[q] ? q : 'glow'; };
const JUMP = /code/.test(location.hash);   // testers' shortcut: #code jumps straight to the keypad
let vKey = pick();
let V = VARIANTS[vKey];

// ---------- art (CSS/SVG; a variant's clue can be an image file instead, see story.js) ----------
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

// The whole envelope, face down, with a small wax seal at the flap's tip. The code is small on purpose:
// the player presses and drags the loupe over the seal to read it. p prefixes ids (the loupe draws a second copy).
function envelope(code, p, decorative){
  const cx = 180, cy = 132, pts = [];
  for (let i = 0; i < 48; i++) {
    const a = i / 48 * Math.PI * 2, r = 25 + 1.4 * Math.sin(a * 7) + 1 * Math.sin(a * 13 + 1);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const blob = 'M' + pts.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join(' L') + ' Z';
  const big = code.length <= 6;
  const label = decorative ? 'aria-hidden="true"' : `role="img" aria-label="${V.sealLabel}"`;
  return `<svg viewBox="0 0 360 250" preserveAspectRatio="xMidYMid meet" ${label}>
  <defs>
    <linearGradient id="${p}pa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6ead0"/><stop offset="1" stop-color="#dcc28a"/></linearGradient>
    <linearGradient id="${p}fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efdfb6"/><stop offset="1" stop-color="#d9bd84"/></linearGradient>
    <radialGradient id="${p}sw" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#d9463b"/><stop offset="0.55" stop-color="#8e1a17"/><stop offset="1" stop-color="#560b09"/></radialGradient>
    <linearGradient id="${p}sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset="0.5" stop-color="#f5c95a"/><stop offset="1" stop-color="#c8912b"/></linearGradient>
  </defs>
  <rect x="38" y="42" width="290" height="182" rx="6" fill="#000" opacity="0.35" transform="translate(5 7)" style="filter:blur(5px)"/>
  <rect x="35" y="38" width="290" height="182" rx="6" fill="url(#${p}pa)"/>
  <path d="M35 220 L150 128 M325 220 L210 128" stroke="#b89a5e" stroke-width="1.2" opacity="0.55"/>
  <path d="M35 38 H325 L${cx} ${cy + 6} Z" fill="url(#${p}fl)" stroke="#b89a5e" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M41 42 H319" stroke="#fff" stroke-width="1" opacity="0.5"/>
  <path d="${blob}" fill="url(#${p}sw)" transform="translate(1.5 3)" opacity="0.35" style="filter:blur(2px)"/>
  <path d="${blob}" fill="url(#${p}sw)"/>
  <circle cx="${cx}" cy="${cy}" r="20" fill="none" stroke="#5a0c0a" stroke-width="1.6" opacity="0.65"/>
  <ellipse cx="${cx - 10}" cy="${cy - 12}" rx="6" ry="2.6" fill="#fff" opacity="0.16" transform="rotate(-30 ${cx - 10} ${cy - 12})"/>
  ${symbol(cx, cy - 8, 6.5, `url(#${p}sg)`, 1.2)}
  <text x="${cx}" y="${cy + 11}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="${big ? 9.5 : 8}"
    textLength="${big ? 30 : 31}" lengthAdjust="spacingAndGlyphs" fill="url(#${p}sg)" stroke="#3a0705" stroke-width="0.3" paint-order="stroke">${code}</text>
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
  tick: () => tone(1568, 0.035, { gain: 0.03 }),   // the dial's ratchet: one soft tick per letter passing the notch
  back: () => tone(622, 0.05),
  wrong: () => { tone(233, 0.13, { type: 'triangle', gain: 0.07 }); tone(175, 0.18, { type: 'triangle', gain: 0.07, at: 0.14 }); },
  right: () => [1046, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.12, { type: 'triangle', gain: 0.05, at: i * 0.08 })),
  chime: () => [784, 1175, 1568].forEach((f, i) => tone(f, 0.9, { gain: 0.035, at: i * 0.12 })),
};
function buzz(pattern){
  try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(pattern); } catch (e) {}
}

// ---------- start: just the list of versions ----------
$('startKicker').textContent = STORY.start.kicker;
setText($('startTitle'), STORY.start.title);
setText($('startSub'), STORY.start.sub);
for (const k of Object.keys(VARIANTS)) {
  const b = document.createElement('button');
  b.className = 'version';
  b.innerHTML = '<b></b><span></span>';
  b.querySelector('b').textContent = VARIANTS[k].label;
  setText(b.querySelector('span'), VARIANTS[k].blurb);
  b.onclick = () => { audio(); setVariant(k); openCode(); };
  $('versions').appendChild(b);
}
function setVariant(k){
  vKey = k; V = VARIANTS[k];
  const u = new URL(location.href); u.searchParams.set('v', k); u.hash = ''; history.replaceState(null, '', u);
}
setVariant(vKey);
['topAva', 'winAva'].forEach(id => $(id).innerHTML = HOOD);
$('topSender').textContent = STORY.sender;
$('topChapter').textContent = STORY.chapter;
$('codeTitle').textContent = STORY.chapter;
$('helpBtn').setAttribute('aria-label', STORY.help);

let runId = 0;
function show(id){ ['start', 'chat', 'code', 'win'].forEach(s => $(s).hidden = s !== id); }
function toStart(){ runId++; show('start'); }
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

// ---------- the loupe: press and drag on the envelope to magnify. A ringless glass bubble whose edge fades into the picture ----------
const ZOOM = 2.5;
const MAG_SVG = `<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>`;
let loupeOn = false, loupeUsed = false;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function loupeAt(e){
  const lens = $('lens'), L = $('loupe'); if (!L) return;
  const r = lens.getBoundingClientRect(), D = L.offsetWidth, R = D / 2;
  const x = clamp(e.clientX - r.left, 0, r.width), y = clamp(e.clientY - r.top, 0, r.height);
  const lift = e.pointerType === 'mouse' ? 0 : R + 22;      // sit above the finger so it doesn't hide the view
  let cx = x, cy = y - lift;
  if (lift && cy < R) cx = x > r.width / 2 ? x - lift : x + lift;   // no room above: move to the side instead
  cx = clamp(cx, R, r.width - R); cy = clamp(cy, R, r.height - R);
  L.style.transform = `translate(${cx - R}px, ${cy - R}px)`;
  const img = lens.querySelector('.clue');
  if (img) {   // clue picture: the loupe is the same image as a background, ZOOM times the size it's drawn at
    const b = drawnBox(img, r);
    L.style.backgroundSize = `${b.w * ZOOM}px ${b.h * ZOOM}px`;
    L.style.backgroundPosition = `${R - (x - b.x) * ZOOM}px ${R - (y - b.y) * ZOOM}px`;
    return;
  }
  const svg = L.firstElementChild;
  svg.style.width = r.width * ZOOM + 'px'; svg.style.height = r.height * ZOOM + 'px';
  svg.style.left = (R - x * ZOOM) + 'px'; svg.style.top = (R - y * ZOOM) + 'px';
}
// Where the picture is actually drawn inside the panel (object-fit cover or contain, with object-position).
function drawnBox(img, r){
  const nw = img.naturalWidth || r.width, nh = img.naturalHeight || r.height, cs = getComputedStyle(img);
  const s = (cs.objectFit === 'contain' ? Math.min : Math.max)(r.width / nw, r.height / nh);
  const w = nw * s, h = nh * s, [px, py] = cs.objectPosition.split(' ').map(v => parseFloat(v) / 100);
  return { w, h, x: (r.width - w) * (isNaN(px) ? 0.5 : px), y: (r.height - h) * (isNaN(py) ? 0.5 : py) };
}
function loupeEnd(){
  if (!loupeOn) return;
  loupeOn = false; $('lens').classList.remove('peek');
  if (!loupeUsed) { loupeUsed = true; const h = $('loupeHint'); if (h) h.classList.add('gone'); }
}
{
  const lens = $('lens');
  lens.addEventListener('pointerdown', e => {
    if (!e.isPrimary || !$('loupe')) return;
    e.preventDefault(); idle();
    try { lens.setPointerCapture(e.pointerId); } catch (err) {}
    loupeOn = true; loupeAt(e); lens.classList.add('peek');
  });
  lens.addEventListener('pointermove', e => { if (loupeOn) loupeAt(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => lens.addEventListener(t, loupeEnd));
  lens.addEventListener('contextmenu', e => e.preventDefault());
}

// ---------- code entry ----------
const boxesEl = $('boxes'), keypadEl = $('keypad'), sayLine = $('sayLine'), solveBtn = $('solveBtn');
let entry = '', busy = false, tier = 0, hintsUsed = 0, wrongs = 0, idleTimer = 0;
const N = () => V.answer.length;

// Glow keypad * and #: thin strokes drawn as tall as the digits and centred on them (a typed * sits small and high)
const GLYPH_SVG = {
  '*': `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5v21M2.91 6.75l18.18 10.5M2.91 17.25l18.18-10.5"/></svg>`,
  '#': `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 1.5L7.4 22.5M16.6 1.5L14.4 22.5M3.5 8H21M3 16h17.5"/></svg>`,
  '⌫': `<svg viewBox="0 0 28 20" aria-hidden="true"><path d="M26.5 2H9L1.5 10 9 18h17.5z"/><path d="M13.5 6.5l7 7M20.5 6.5l-7 7"/></svg>`,
};
// Word keypad: QWERTY rows, like a phone keyboard. Each row is centred; ⌫ and ENTER take the spare width either side of row 3.
const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map(r => r.split(''));
function keyButton(k){
  const b = document.createElement('button');
  b.className = 'key' + (k === 'send' ? ' send' : k === 'back' ? ' back' : '');
  b.dataset.k = k;
  // ⌫/* and ENTER/#: a symbol with a tiny label underneath (* / # like a door keypad), or a short word (ENTER)
  if (k === 'back' || k === 'send') {
    const face = k === 'back' ? V.backKey : V.sendKey, label = k === 'back' ? V.backLabel : V.sendLabel;
    b.innerHTML = face.length > 1 ? `<span class="ch word">${face}</span>` : (GLYPH_SVG[face] ? `<span class="ch glyph">${GLYPH_SVG[face]}</span>` : `<span class="ch">${face}</span>`) + `<small>${label}</small>`;
    b.setAttribute('aria-label', label);
  }
  else b.textContent = k;
  b.addEventListener('pointerdown', e => { e.preventDefault(); press(k, b); });
  b.addEventListener('click', e => { if (e.detail === 0) press(k, b); });   // keyboard / screen reader activation
  return b;
}
function buildKeypad(){
  const letters = V.keypad === 'letters', dial = V.keypad === 'dial';
  keypadEl.className = 'keypad glow' + (letters ? ' letters' : '') + (dial ? ' dial' : '');
  $('code').classList.add('glow'); $('code').classList.toggle('letters', letters); $('code').classList.toggle('dial', dial);
  keypadEl.innerHTML = '';
  if (dial) { buildDial(); return; }
  if (letters) {
    [QWERTY[0], QWERTY[1], ['back', ...QWERTY[2], 'send']].forEach(row => {
      const r = document.createElement('div'); r.className = 'kb-row';
      row.forEach(k => r.appendChild(keyButton(k)));
      keypadEl.appendChild(r);
    });
  }
  else [...'123456789'.split(''), 'back', '0', 'send'].forEach(k => keypadEl.appendChild(keyButton(k)));
  alignGlyphs();
}
// Numbers keypad: size the drawn * and # to a digit's real height and move them onto the digits' centre line, using the font's own metrics.
function alignGlyphs(){
  const zero = keypadEl.querySelector('[data-k="0"]'); if (!zero) return;
  const cs = getComputedStyle(zero), c = document.createElement('canvas').getContext('2d');
  c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = c.measureText('0');
  const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const dy = (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
  if (!h || isNaN(dy)) return;
  keypadEl.style.setProperty('--glyph-h', h.toFixed(1) + 'px');
  keypadEl.style.setProperty('--glyph-dy', dy.toFixed(1) + 'px');
}
// ---------- the dial: one ring per character, outer ring first. Drag a ring (or tap a character) to turn it;
// the characters under the gold notch, read outside in, spell the code. Only the top of the wheel shows
// (crop, the dial's centre sits below the window) — like the window of a combination lock. No send key:
// the moment the right code lines up, it sends itself. Each variant sets its ring characters in story.js
// (symbols, repeated `repeat` times round each ring so the spacing feels the same for 0–9 as for A–Z). ----------
const DIAL = { cx: 180, cy: 521, inner: 183, outer: 503, crop: 383 };   // a big wheel seen through a narrow window; crop: how much of its top is visible
let SYMS = '', M = 26, STEP = 360 / 26;   // the characters round each ring, how many, and the angle between them
let rings = [];           // { g, step } — step counts whole one-character turns clockwise (any integer)
let dialWon = false;
let activeRing = 0;       // keyboard: ↑/↓ pick a ring, ←/→ turn it, or type the character you want on top
const modM = x => ((x % M) + M) % M;
const topIndex = r => modM(-r.step);
const dialWord = () => rings.map(r => SYMS[topIndex(r)]).join('');
// the copy of character ch on ring i that's the shortest turn away
function nearest(i, ch){
  let best = -1, bestD = Infinity;
  for (let k = 0; k < M; k++) if (SYMS[k] === ch) { const d = Math.abs(modM(-k - rings[i].step + M / 2) - M / 2); if (d < bestD) { bestD = d; best = k; } }
  return best;
}

function buildDial(){
  SYMS = (V.symbols || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ').repeat(V.repeat || 1); M = SYMS.length; STEP = 360 / M;
  const n = N(), bandW = (DIAL.outer - DIAL.inner) / n, cx = DIAL.cx, cy = DIAL.cy;
  const fs = Math.round(bandW * 0.62), slotW = Math.round(fs * 1.6);   // one size on every ring, so the code reads as one even column
  let svg = `<svg viewBox="0 0 360 ${DIAL.crop}" aria-hidden="true">`;
  for (let i = 0; i <= n; i++) svg += `<circle class="${i ? 'sep' : 'sep rim'}" cx="${cx}" cy="${cy}" r="${DIAL.outer - i * bandW}"/>`;
  svg += `<path class="notch" d="M${cx - 8} 2 h16 l-8 11 z"/>`;
  for (let i = 0; i < n; i++) {
    const r = DIAL.outer - (i + 0.5) * bandW;
    // every character is drawn at the top of the wheel, dead centre, then rotated into place about the
    // wheel's centre — so whichever one sits under the notch is exactly on the vertical centre line
    svg += `<g class="ring" data-i="${i}" style="transform-origin:${cx}px ${cy}px">` + [...SYMS].map((ch, k) =>
      `<text x="${cx}" y="${(cy - r).toFixed(1)}" font-size="${fs}" transform="rotate(${(k * STEP).toFixed(3)} ${cx} ${cy})">${ch}</text>`
    ).join('') + `</g>`;
  }
  // the outline round the lined-up column: this replaces the code field on the dial
  svg += `<rect class="slot" x="${cx - slotW / 2}" y="${cy - DIAL.outer + 3}" width="${slotW}" height="${DIAL.outer - DIAL.inner - 6}" rx="${Math.round(slotW * 0.28)}"/>`;
  svg += `</svg>`;
  keypadEl.innerHTML = svg;
  rings = [...keypadEl.querySelectorAll('.ring')].map(g => ({ g, step: 0 }));
  activeRing = 0; dialWon = false;
  rings.forEach((r, i) => setStep(i, -(SYMS.indexOf(V.answer[i]) + V.startAt[i]), true));
  entry = dialWord();
  dialDrag(keypadEl.querySelector('svg'));
}
function setStep(i, s, quiet){
  const r = rings[i]; r.step = s;
  r.g.style.transform = `rotate(${(s * STEP).toFixed(2)}deg)`;
  [...r.g.children].forEach((t, k) => t.classList.toggle('top', k === topIndex(r)));
  if (quiet) return;
  entry = dialWord(); renderBoxes(i);
  // the right code sends itself once the ring has settled into place
  if (entry === V.answer && !dialWon) { dialWon = true; busy = true; clearTimeout(idleTimer); setTimeout(right, 380); }
}
// turn ring i the short way round so character k sits under the notch
function spinTo(i, k){
  const cur = rings[i].step, h = Math.floor(M / 2);
  setStep(i, cur + modM(-k - cur + h) - h);
}
function dialDrag(svg){
  let d = null;   // the live drag: which ring, the grab angle, how far it has turned
  const at = e => {
    const b = svg.getBoundingClientRect(), s = b.width / 360;   // the window shows the wheel's top; its centre sits below
    const x = (e.clientX - b.left) / s - DIAL.cx, y = (e.clientY - b.top) / s - DIAL.cy;
    return { a: Math.atan2(x, -y) * 180 / Math.PI, dist: Math.hypot(x, y) };
  };
  svg.addEventListener('pointerdown', e => {
    if (busy || !e.isPrimary) return;
    const { a, dist } = at(e);
    if (dist < DIAL.inner - 6 || dist > DIAL.outer + 12) return;
    e.preventDefault(); idle();
    const bandW = (DIAL.outer - DIAL.inner) / rings.length;
    const i = clamp(Math.floor((DIAL.outer - dist) / bandW), 0, rings.length - 1);
    d = { i, a0: a, last: a, acc: 0, det: rings[i].step };
    activeRing = i;
    rings[i].g.classList.add('drag');
    try { svg.setPointerCapture(e.pointerId); } catch (err) {}
  });
  svg.addEventListener('pointermove', e => {
    if (!d) return;
    const { a } = at(e);
    let da = a - d.last; if (da > 180) da -= 360; if (da < -180) da += 360;
    d.acc += da; d.last = a;
    const r = rings[d.i], live = r.step * STEP + d.acc;   // r.step stays the grab point until release
    r.g.style.transform = `rotate(${live.toFixed(2)}deg)`;
    const det = Math.round(live / STEP);                  // the ratchet: tick each time a character passes the notch
    if (det !== d.det) { d.det = det; sfx.tick(); buzz(5); [...r.g.children].forEach((t, k) => t.classList.toggle('top', k === modM(-det))); }
  });
  const up = () => {
    if (!d) return;
    const { i, acc, a0 } = d; d = null;
    const r = rings[i]; r.g.classList.remove('drag');
    if (Math.abs(acc) < STEP * 0.36) {   // a tap: bring the tapped character round to the notch
      const k = modM(Math.round(a0 / STEP) - r.step);
      if (k !== topIndex(r)) { spinTo(i, k); sfx.tick(); buzz(8); }
      else setStep(i, r.step);
    }
    else setStep(i, Math.round((r.step * STEP + acc) / STEP));
  };
  ['pointerup', 'pointercancel'].forEach(t => svg.addEventListener(t, up));
}
async function dialSolve(){
  for (let i = 0; i < rings.length; i++) {
    await sleep(240);
    spinTo(i, nearest(i, V.answer[i])); sfx.tick(); buzz(8);
  }
  await sleep(500);
}

function sizeBoxes(){
  if (!boxesEl.clientWidth) return;   // code screen hidden
  const n = N(), gap = n > 6 ? 4 : 6, avail = boxesEl.clientWidth - 20;   // the field's own width (it matches the keypad) less its padding
  boxesEl.style.setProperty('--gap', gap + 'px');
  boxesEl.style.setProperty('--bw', Math.min(44, Math.floor((avail - gap * (n - 1)) / n)) + 'px');
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
  boxesEl.setAttribute('aria-label', 'Code: ' + (entry.length ? `${entry.split('').join(' ')}, ${entry.length} of ${n}` : `nothing entered yet, ${n} to go`));
  [...boxesEl.children].forEach(d => d.setAttribute('aria-hidden', 'true'));
  keypadEl.querySelector('.send')?.classList.toggle('ready', entry.length === n);
}
// The line under the label: hints stay until the next message, wrong-answer replies fade after a few seconds.
let sayTimer = 0;
function say(text, kind = ''){
  clearTimeout(sayTimer);
  setText($('sayText'), text);
  sayLine.className = 'say-line ' + kind;
  void sayLine.offsetWidth; sayLine.classList.add('fresh');
  if (kind === 'bad' || kind === 'note') sayTimer = setTimeout(() => { sayLine.classList.add('faded'); sayTimer = setTimeout(() => { $('sayText').textContent = ''; }, 500); }, 4000);
}
function markHints(){
  $('hintsUsed').hidden = hintsUsed === 0;
  $('hintsUsed').textContent = STORY.hintsUsed(hintsUsed);
}
function lookAtSeal(){ const l = $('lens'); l.classList.remove('look'); void l.offsetWidth; l.classList.add('look'); }
function nudgeHelp(){ const h = $('helpBtn'); h.classList.remove('nudge'); void h.offsetWidth; h.classList.add('nudge'); }
function idle(){ clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (!$('code').hidden && !busy) nudgeHelp(); }, 15000); }

function openCode(){
  runId++;
  entry = ''; busy = false; tier = 0; hintsUsed = 0; wrongs = 0;
  show('code');
  // The clue: Victoria's art when the variant names an image, otherwise the drawn envelope with the answer on its seal.
  const clue = V.image
    ? `<img class="clue" src="${V.image}" alt="${V.imageAlt || V.sealLabel}" draggable="false">` +
      `<div class="loupe img" id="loupe" aria-hidden="true" style="background-image:url('${V.image}')"></div>`
    : envelope(V.answer, 'e') + `<div class="loupe" id="loupe" aria-hidden="true">${envelope(V.answer, 'm', true)}</div>`;
  $('lens').innerHTML = clue +
    `<div class="loupe-hint${loupeUsed ? ' gone' : ''}" id="loupeHint" aria-hidden="true">${MAG_SVG}<span>${STORY.loupeHint}</span></div>`;
  buildKeypad(); sizeBoxes(); boxesEl.className = 'boxes'; boxesEl.innerHTML = ''; renderBoxes();
  solveBtn.hidden = true; setText(solveBtn, V.solve); markHints();
  setText($('codeLabel'), V.codeLabel); say('');
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
  if (k === 'back') { if (V.keypad === 'dial' || !entry) return; entry = entry.slice(0, -1); sfx.back(); buzz(6); renderBoxes(); return; }
  if (k === 'send') { if (entry.length < N()) { say(V.notFull, 'note'); sfx.back(); return; } check(); return; }
  if (V.keypad === 'dial' || entry.length >= N()) return;
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
  if (V.keypad === 'dial') { await dialSolve(); return; }   // the rings turn themselves; the last one lining up sends it
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
  if (V.keypad === 'dial') {   // ↑/↓ pick a ring, ←/→ turn it one step, or type the character you want on top
    if (busy) return;
    if (k === 'ArrowLeft' || k === 'ArrowRight') { e.preventDefault(); idle(); setStep(activeRing, rings[activeRing].step + (k === 'ArrowRight' ? 1 : -1)); sfx.tick(); }
    else if (k === 'ArrowUp' || k === 'ArrowDown') { e.preventDefault(); activeRing = clamp(activeRing + (k === 'ArrowDown' ? 1 : -1), 0, rings.length - 1); }
    else if (k.length === 1 && SYMS.includes(k)) { idle(); spinTo(activeRing, nearest(activeRing, k)); sfx.tick(); activeRing = Math.min(activeRing + 1, rings.length - 1); }
    return;
  }
  if (k === 'Enter') { e.preventDefault(); press('send', true); }
  else if (k === 'Backspace') press('back', true);
  else if (V.backKey === '*' && k === '*') press('back', true);
  else if (V.sendKey === '#' && k === '#') press('send', true);
  else if (V.keypad === 'letters' ? /^[A-Z]$/.test(k) : /^[0-9]$/.test(k)) press(k, true);
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
  const other = STORY.win.otherTo[vKey];
  setText($('otherBtn'), STORY.win.other[vKey]);
  $('otherBtn').onclick = () => { setVariant(other); openCode(); };
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
$('againBtn').onclick = () => openCode();

if (JUMP) openCode();
