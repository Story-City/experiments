// Armchair preview — Story City experiment.
// Flow: first open → couch chapter (indoor steps, one choice, wax-seal puzzle) → cliffhanger
//       → trial-explainer paywall → "Tomorrow, walk it for real" (+ optional reminder).
// Tester switch: ?v=paywall-first | taste-more   ·   ?fast=1 shortens the typing delays (for QA).
import { COPY, VARIANTS, DEFAULT_VARIANT } from './copy.js';

const params = new URLSearchParams(location.search);
const VARIANT = VARIANTS[params.get('v')] ? params.get('v') : DEFAULT_VARIANT;
const V = VARIANTS[VARIANT];
const FAST = params.get('fast') === '1';
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (sel, root = document) => root.querySelector(sel);
const screen = $('#screen');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wait = ms => new Promise(r => setTimeout(r, FAST ? Math.min(ms, 40) : ms));
const state = { trial: false, run: 0 };

// Analytics stand-in: what the real app would send to PostHog.
window.__events = [];
function track(name, props = {}){ const e = { name, variant: VARIANT, ...props }; window.__events.push(e); console.log('[event]', name, JSON.stringify(props)); }

document.title = COPY.pageTitle;

// ---------- small drawings (CSS colours come from tokens via currentColor/classes) ----------
const SYMBOL = `<g class="sym"><circle cx="0" cy="0" r="7" fill="none" stroke-width="1.6"/><path d="M0-4.5c.4 3 2.2 4.1 4.5 4.5-2.3.4-4.1 1.5-4.5 4.5-.4-3-2.2-4.1-4.5-4.5 2.3-.4 4.1-1.5 4.5-4.5z"/></g>`;

const SCENES = {
  window: `<svg class="scene-svg" viewBox="0 0 320 210" role="img" aria-label="Through your window: a figure in a hoodie on the street corner across the road, under a streetlight">
    <rect class="s-sky" width="320" height="210"/>
    <g class="s-stars"><circle cx="40" cy="30" r="1.2"/><circle cx="96" cy="18" r="1"/><circle cx="210" cy="26" r="1.3"/><circle cx="270" cy="44" r="1"/><circle cx="150" cy="40" r=".9"/></g>
    <path class="s-moon" d="M262 22a14 14 0 1 0 10 24 11 11 0 1 1-10-24z"/>
    <rect class="s-house" x="18" y="92" width="70" height="70"/><path class="s-house" d="M12 94l41-30 41 30z"/>
    <rect class="s-lit" x="34" y="110" width="14" height="16"/><rect class="s-lit dim" x="58" y="110" width="14" height="16"/>
    <rect class="s-house" x="264" y="108" width="50" height="54"/><rect class="s-lit dim" x="280" y="120" width="12" height="14"/>
    <rect class="s-road" x="0" y="162" width="320" height="48"/>
    <rect class="s-curb" x="0" y="160" width="320" height="4"/>
    <g class="s-dash"><rect x="20" y="186" width="26" height="3"/><rect x="80" y="186" width="26" height="3"/><rect x="140" y="186" width="26" height="3"/><rect x="200" y="186" width="26" height="3"/><rect x="260" y="186" width="26" height="3"/></g>
    <ellipse class="s-pool" cx="214" cy="162" rx="48" ry="7"/>
    <path class="s-glowcone" d="M222 80l-36 82h72z"/>
    <rect class="s-pole" x="236" y="74" width="4" height="88"/><rect class="s-pole" x="220" y="72" width="20" height="4" rx="2"/><circle class="s-bulb" cx="222" cy="78" r="3.5"/>
    <g class="s-figure" transform="translate(205 98) scale(1.4)">
      <path class="s-body" d="M-11 46c0-18 2-30 11-30s11 12 11 30z"/>
      <path class="s-body" d="M-9 18c-1-10 3-18 9-18s10 8 9 18c-3-3-15-3-18 0z"/>
      <ellipse class="s-face" cx="0" cy="11" rx="4.6" ry="5.4"/>
      <rect class="s-phone" x="7" y="27" width="4" height="6" rx="1"/>
      <g transform="translate(0 30) scale(.55)">${SYMBOL}</g>
    </g>
    <rect class="s-frame" x="0" y="0" width="320" height="210" fill="none" stroke-width="14"/>
    <rect class="s-frame" x="150" y="0" width="6" height="210"/>
    <rect class="s-frame" x="0" y="54" width="320" height="5"/>
  </svg>`,
};

function envelopeSVG(stage, rim){ // stage 0 sealed, 1/2 cracked, 3 open
  const cracks = stage >= 1 ? `<path class="crack" d="M-3-9l2 6-3 4 4 6"/>` : '';
  const cracks2 = stage >= 2 ? `<path class="crack" d="M6-6l-4 5 5 3-2 6"/>` : '';
  return `<svg class="env-svg" viewBox="0 0 280 170" aria-hidden="true">
    <rect class="e-paper" x="10" y="10" width="260" height="150" rx="6"/>
    <path class="e-fold" d="M10 16l130 84 130-84"/>
    <path class="e-fold soft" d="M10 160l100-72M270 160l-100-72"/>
    ${rim ? `<path id="rimArc" d="M100 98a40 40 0 0 0 80 0" fill="none"/><text class="e-rim"><textPath href="#rimArc" startOffset="50%" text-anchor="middle">${rim}</textPath></text>` : `<text class="e-script" x="140" y="146" text-anchor="middle">for you</text>`}
    <g transform="translate(140 98)"><g class="seal ${stage >= 3 ? 'open' : ''}">
      <path class="s-wax" d="M0-27c7 0 9 4 15 6s9 9 9 15-2 9-1 15-6 10-13 11-8 5-14 5-9-4-15-6-9-9-9-15 2-9 1-15 6-10 13-11 8-5 14-5z"/>
      <circle class="s-wax-in" r="16"/>
      <g transform="scale(1.35)">${SYMBOL}</g>${cracks}${cracks2}
    </g></g>
  </svg>`;
}

// ---------- screens ----------
function show(html, cls = ''){
  screen.className = 'screen ' + cls;
  screen.innerHTML = html;
  screen.scrollTop = 0;
}

function renderStart(){
  state.run++;
  const c = COPY.start;
  show(`
    <section class="pad start">
      <div class="hero" aria-hidden="true">
        <div class="hero-glow"></div>
        <svg class="hero-spark" viewBox="0 0 24 24"><path d="M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z"/></svg>
        <div class="hero-letter">${envelopeSVG(0)}</div>
      </div>
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h1 class="h1">${esc(c.title)}</h1>
      <p class="lead">${esc(c.line)}</p>
      <div class="card story-card">
        <span class="story-icon" aria-hidden="true">✉️</span>
        <div><p class="eyebrow sm">${esc(c.storyEyebrow)}</p><h2 class="h3">${esc(c.storyTitle)}</h2><p class="meta">${esc(c.storyMeta)}</p></div>
      </div>
      <div class="stack">
        <button class="btn" id="couch" type="button">${esc(c.couch)}</button>
        <button class="btn sec" id="outside" type="button">${esc(c.outside)}</button>
      </div>
      <p class="fine center">${esc(c.fine)}</p>
    </section>`, 'is-start');
  $('#couch').onclick = () => { track('armchair_start'); renderChapter(); };
  $('#outside').onclick = () => { track('outside_chosen'); renderOutside(); };
}

function renderOutside(){
  const c = COPY.outside;
  show(`
    <section class="pad centered">
      <div class="big-emoji" aria-hidden="true">🚶</div>
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h1 class="h1">${esc(c.title)}</h1>
      <p class="lead">${esc(c.body)}</p>
      <p class="fine">${esc(c.note)}</p>
      <div class="stack">
        <button class="btn" id="back" type="button">${esc(c.back)}</button>
        <button class="btn txt" id="couch" type="button">${esc(c.couch)}</button>
      </div>
    </section>`);
  $('#back').onclick = renderStart;
  $('#couch').onclick = () => { track('armchair_start', { from: 'outside' }); renderChapter(); };
}

// ---------- the chapter (chat bubbles) ----------
let log, dock, bar, run, beatsDone = 0, beatsTotal = 1;

function renderChapter(){
  const c = COPY.chapter;
  run = ++state.run;
  show(`
    <header class="ch-head">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h1 class="h2">${esc(c.title)}</h1>
      <div class="bar" aria-hidden="true"><i id="bar"></i></div>
    </header>
    <div class="log" id="log" role="log" aria-live="polite"></div>
    <div class="dock" id="dock"></div>`, 'is-chapter');
  log = $('#log'); dock = $('#dock'); bar = $('#bar');
  const beats = COPY.beats.concat(V.extra ? COPY.extraBeats : []);
  beatsTotal = beats.length; beatsDone = 0;
  playBeats(beats, true).then(async done => { if (!done) return; await askButtons([c.finish]); if (!alive()) return; track('chapter1_complete'); renderCliff(); });
}

const alive = () => run === state.run;
function progress(){ beatsDone++; if (bar) bar.style.width = Math.min(100, beatsDone / beatsTotal * 100) + '%'; }
function scrollLog(){ requestAnimationFrame(() => log && log.scrollTo({ top: log.scrollHeight, behavior: REDUCED ? 'auto' : 'smooth' })); }

function addBubble(html, cls){
  const el = document.createElement('div');
  el.className = 'msg ' + cls;
  el.innerHTML = html;
  log.appendChild(el); scrollLog();
  return el;
}

async function typing(who){
  const el = addBubble(`<span class="dots" aria-label="${esc(COPY.chapter.typing)}"><i></i><i></i><i></i></span>`, who === 'sms' ? 'sms typing' : 'narr typing');
  await wait(who === 'sms' ? 900 : 650);
  el.remove();
}

async function playBeats(beats, top){
  for (const b of beats) {
    if (!alive()) return false;
    await playBeat(b);
    if (!alive()) return false;
    if (top) progress();
  }
  return true;
}

function dockSet(html){ dock.innerHTML = html; dock.classList.toggle('empty', !html); }

async function playBeat(b){
  const c = COPY.chapter;
  switch (b.t) {
    case 'narr':
      await typing('narr');
      addBubble(`<p>${esc(b.text)}</p>`, 'narr');
      await wait(500);
      break;
    case 'sms': {
      await typing('sms');
      const el = addBubble(`<span class="from">${esc(c.unknown)}</span><p>${esc(b.text)}</p>`, 'sms');
      el.classList.add('buzz');
      await wait(700);
      break;
    }
    case 'you':
      addBubble(`<p>${esc(b.text)}</p>`, 'you');
      await wait(450);
      break;
    case 'scene':
      addBubble(SCENES[b.name], 'scene');
      await wait(900);
      break;
    case 'steps':
      await stepGoal(b);
      break;
    case 'choice': {
      const pick = await askButtons(b.options.map(o => o.label), true);
      const o = b.options[pick];
      track('choice', { pick: o.label });
      addBubble(`<p>${esc(o.you)}</p>`, 'you');
      await wait(450);
      await playBeats(o.then, false);
      break;
    }
    case 'go':
      await askButtons([b.label]);
      addBubble(`<p>${esc(b.you)}</p>`, 'you');
      await wait(400);
      break;
    case 'seal':
      await sealPuzzle();
      break;
    case 'letter':
      addBubble(`<div class="letter">${b.lines.map(l => `<p>${esc(l)}</p>`).join('')}</div>`, 'paper');
      await wait(1200);
      break;
    case 'photo':
      await photoBeat();
      break;
    case 'code':
      await codeBeat(b);
      break;
  }
}

function askButtons(labels, row){
  return new Promise(res => {
    dockSet(`<div class="${row && labels.length > 1 ? 'choices' : 'stack'}">${labels.map((l, i) =>
      `<button class="btn ${i ? 'sec' : ''}" type="button" data-i="${i}">${esc(l)}</button>`).join('')}</div>`);
    dock.querySelectorAll('button').forEach(btn => btn.onclick = () => { dockSet(''); res(+btn.dataset.i); });
  });
}

// Indoor steps: tap, hold, or (where the browser allows it without asking) real motion.
function stepGoal(b){
  const c = COPY.chapter;
  return new Promise(res => {
    let n = 0, holdT = null, repT = null, finished = false;
    const R = 46, CIRC = 2 * Math.PI * R;
    dockSet(`
      <div class="steps">
        <div class="ring-wrap">
          <svg class="ring" viewBox="0 0 110 110" aria-hidden="true">
            <circle class="ring-bg" cx="55" cy="55" r="${R}"/>
            <circle class="ring-fg" id="ringFg" cx="55" cy="55" r="${R}" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"/>
          </svg>
          <div class="ring-mid"><span class="ring-icon" aria-hidden="true">${b.icon}</span><b id="stepN">0</b><small>/ ${b.goal} ${esc(c.stepsLabel)}</small></div>
        </div>
        <div class="steps-side">
          <p class="steps-goal"><b>${b.goal} ${esc(c.stepsLabel)}</b> ${esc(b.label)}</p>
          <button class="btn walk" id="walkBtn" type="button"><span aria-hidden="true">👣</span> ${esc(c.stepsTap)}</button>
          <p class="fine">${esc(c.stepsHint)}</p>
        </div>
      </div>`);
    const fg = $('#ringFg'), num = $('#stepN'), btn = $('#walkBtn'), wrap = $('.ring-wrap');
    const add = k => {
      if (finished || !alive()) return stop();
      n = Math.min(b.goal, n + k);
      num.textContent = n;
      fg.style.strokeDashoffset = CIRC * (1 - n / b.goal);
      puff(wrap);
      if (n >= b.goal) done();
    };
    const stop = () => { clearTimeout(holdT); clearInterval(repT); holdT = repT = null; };
    btn.addEventListener('pointerdown', e => { e.preventDefault(); add(3); holdT = setTimeout(() => { repT = setInterval(() => add(2), 140); }, 350); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => btn.addEventListener(t, stop));
    btn.addEventListener('click', e => { if (e.detail === 0) add(3); }); // keyboard
    btn.addEventListener('contextmenu', e => e.preventDefault());
    // real steps, where available without a permission prompt
    let last = 0, hi = false;
    const onMotion = e => { const a = e.accelerationIncludingGravity; if (!a || a.x == null) return;
      const m = Math.hypot(a.x, a.y, a.z); const now = performance.now();
      if (m > 12.5 && !hi && now - last > 300) { hi = true; last = now; add(1); } else if (m < 10.5) hi = false; };
    window.addEventListener('devicemotion', onMotion);
    function done(){
      finished = true; stop(); window.removeEventListener('devicemotion', onMotion);
      track('steps_goal', { goal: b.goal, label: b.label });
      $('.steps').classList.add('done');
      btn.disabled = true; btn.innerHTML = `<span aria-hidden="true">✨</span> ${esc(c.stepsDone)}`;
      setTimeout(() => { dockSet(''); res(); }, FAST ? 60 : 700);
    }
  });
}
function puff(wrap){
  if (REDUCED) return;
  const s = document.createElement('span'); s.className = 'puff'; s.textContent = '👣';
  s.style.left = (30 + Math.random() * 40) + '%';
  wrap.appendChild(s); setTimeout(() => s.remove(), 800);
}

function sealPuzzle(){
  const c = COPY.chapter;
  return new Promise(res => {
    let stage = 0;
    const el = addBubble(`<button class="env-btn" type="button" aria-label="${esc(c.sealHint)}">${envelopeSVG(0)}</button>`, 'paper env');
    dockSet(`<p class="hint" id="sealHint"><span aria-hidden="true">👆</span> ${esc(c.sealHint)}</p>`);
    const btn = $('.env-btn', el);
    btn.onclick = () => {
      stage++;
      btn.innerHTML = envelopeSVG(stage);
      btn.classList.remove('wobble'); void btn.offsetWidth; btn.classList.add('wobble');
      const h = $('#sealHint');
      if (stage < 3) { if (h) h.textContent = c.sealCracks[stage - 1]; return; }
      btn.disabled = true; track('seal_opened');
      dockSet('');
      setTimeout(res, FAST ? 60 : 700);
    };
  });
}

async function photoBeat(){
  const p = COPY.photo;
  const el = addBubble(`<div class="photo"><div class="vf"><i></i><i></i><i></i><i></i></div>${envelopeSVG(3, '7 8 6 6 6 6')}<span class="flash"></span></div><p class="cap">${esc(p.caption)}</p>`, 'paper photo-msg');
  await wait(50); el.classList.add('snap');
  toast(p.flash);
  track('photo_taken');
  await wait(1300);
}

function codeBeat(b){
  const k = COPY.keypad;
  return new Promise(res => {
    let val = '';
    dockSet(`
      <div class="code">
        <p class="code-prompt">${esc(b.prompt)}</p>
        <div class="slots" id="slots" aria-label="${esc(k.label)}" role="status">${'<i></i>'.repeat(b.answer.length)}</div>
        <p class="code-msg" id="codeMsg" aria-live="polite"></p>
        <div class="keys">${[1,2,3,4,5,6,7,8,9].map(d => `<button type="button" class="key" data-d="${d}">${d}</button>`).join('')}
          <button type="button" class="key k-sm" data-d="c">${esc(k.clear)}</button><button type="button" class="key" data-d="0">0</button><span></span></div>
      </div>`);
    const slots = [...$('#slots').children], msg = $('#codeMsg');
    const paint = () => slots.forEach((s, i) => { s.textContent = val[i] || ''; s.classList.toggle('on', !!val[i]); });
    const onKey = d => {
      if (d === 'c') { val = ''; msg.textContent = ''; return paint(); }
      if (val.length >= b.answer.length) return;
      val += d; paint();
      if (val.length === b.answer.length) {
        if (val === b.answer) {
          track('code_entered');
          $('.code').classList.add('ok'); msg.textContent = b.ok;
          document.removeEventListener('keydown', kb);
          setTimeout(() => { dockSet(''); addBubble(`<p>📓 ${esc(b.answer)}</p>`, 'you'); res(); }, FAST ? 60 : 900);
        } else {
          msg.textContent = k.wrong; $('.slots').classList.add('shake');
          setTimeout(() => { val = ''; paint(); const s = $('.slots'); if (s) s.classList.remove('shake'); }, 700);
        }
      }
    };
    dock.querySelectorAll('.key').forEach(btn => btn.onclick = () => onKey(btn.dataset.d));
    const kb = e => { if (!alive() || !$('.code')) return document.removeEventListener('keydown', kb);
      if (/^[0-9]$/.test(e.key)) onKey(e.key); else if (e.key === 'Backspace') { val = val.slice(0, -1); paint(); } };
    document.addEventListener('keydown', kb);
  });
}

function toast(text){
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = text; t.setAttribute('role', 'status');
  $('#phone').appendChild(t); setTimeout(() => t.classList.add('out'), 1600); setTimeout(() => t.remove(), 2100);
}

// ---------- cliffhanger ----------
function renderCliff(){
  const c = V.cliff;
  show(`
    <section class="pad centered cliff">
      <div class="cliff-art" aria-hidden="true">
        <span class="mailbox">📮</span><span class="dot-trail"><i></i><i></i><i></i><i></i></span><span class="env-mini">✉️</span>
      </div>
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h1 class="h1">${esc(c.title)}</h1>
      <p class="lead">${esc(c.body)}</p>
      <div class="stack"><button class="btn" id="next" type="button">${esc(c.next)}</button></div>
    </section>`, 'is-cliff');
  $('#next').onclick = renderPaywall;
}

// ---------- paywall (trial explainer) ----------
function renderPaywall(){
  const p = COPY.paywall;
  let plan = p.plans[0].id;
  track('paywall_view');
  show(`
    <section class="pad paywall">
      <button class="close-x" id="pwClose" type="button" aria-label="${esc(p.close)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <p class="eyebrow">${esc(p.eyebrow)}</p>
      <h1 class="h1">${esc(p.title)}</h1>
      <ol class="timeline">
        ${p.steps.map((s, i) => `<li class="tl-${i}"><span class="tl-dot" aria-hidden="true">${s.icon}</span><div><b>${esc(s.when)}</b><p>${esc(s.text)}</p></div></li>`).join('')}
      </ol>
      <div class="plans" role="radiogroup">
        ${p.plans.map((pl, i) => `<button type="button" class="plan ${i ? '' : 'on'}" role="radio" aria-checked="${i ? 'false' : 'true'}" data-id="${pl.id}">
          <span class="radio" aria-hidden="true"></span>
          <span class="plan-txt"><b>${esc(pl.name)}</b><small>${esc(pl.sub)}</small></span>
          <span class="plan-price">${esc(pl.price)}</span>${pl.tag ? `<span class="tag">${esc(pl.tag)}</span>` : ''}
        </button>`).join('')}
      </div>
      <p class="fine center ph">${esc(p.placeholder)}</p>
      <div class="stack">
        <button class="btn" id="pwStart" type="button">${esc(p.start)}</button>
        <button class="btn txt" id="pwNot" type="button">${esc(p.notNow)}</button>
      </div>
      <p class="fine center">${esc(p.fine)}</p>
    </section>`, 'is-paywall');
  screen.querySelectorAll('.plan').forEach(b => b.onclick = () => {
    plan = b.dataset.id;
    screen.querySelectorAll('.plan').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on); });
  });
  const dismiss = how => { track('paywall_dismiss', { how }); renderWalk(false); };
  $('#pwClose').onclick = () => dismiss('x');
  $('#pwNot').onclick = () => dismiss('not_now');
  $('#pwStart').onclick = () => { state.trial = true; track('trial_start', { plan }); toast(p.started); renderWalk(true); };
}

// ---------- tomorrow, walk it for real ----------
function renderWalk(trial){
  const w = COPY.walk;
  show(`
    <section class="pad walk-screen">
      <p class="eyebrow">${esc(trial ? w.eyebrowTrial : w.eyebrowFree)}</p>
      <h1 class="h1">${esc(w.title)}</h1>
      <p class="lead">${esc(trial ? w.bodyTrial : w.bodyFree)}</p>
      <div class="card need">
        <h2 class="h4">${esc(w.needTitle)}</h2>
        <ul>${w.needs.map(n => `<li><span aria-hidden="true">${n.icon}</span>${esc(n.text)}</li>`).join('')}</ul>
      </div>
      <div class="card remind">
        <label class="switch-row" for="remind">
          <span><b>${esc(w.remindLabel)}</b><small>${esc(w.remindOptional)}</small></span>
          <input type="checkbox" id="remind" role="switch"><span class="switch" aria-hidden="true"></span>
        </label>
        <div class="time-row" id="timeRow" hidden>
          <label for="remindTime">${esc(w.timeLabel)}</label>
          <select id="remindTime">${w.times.map((t, i) => `<option ${i === w.timeDefault ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
        </div>
      </div>
      <div class="stack"><button class="btn" id="walkDone" type="button">${esc(w.done)}</button></div>
    </section>`, 'is-walk');
  const sw = $('#remind'), row = $('#timeRow'), btn = $('#walkDone');
  sw.onchange = () => { row.hidden = !sw.checked; btn.textContent = sw.checked ? w.doneSet : w.done; };
  btn.onclick = () => {
    const time = sw.checked ? $('#remindTime').value : null;
    track(time ? 'reminder_set' : 'reminder_skipped', time ? { time } : {});
    renderAllSet(time);
  };
}

function renderAllSet(time){
  const w = COPY.walk;
  show(`
    <section class="pad centered">
      <div class="big-emoji" aria-hidden="true">🌙</div>
      <h1 class="h1">${esc(w.allSetTitle)}</h1>
      <p class="lead">${esc(time ? w.allSetReminder.replace('{time}', time) : w.allSetNone)}</p>
      <div class="stack"><button class="btn sec" id="again" type="button">${esc(w.restart)}</button></div>
    </section>`);
  $('#again').onclick = renderStart;
}

// ---------- tester switch (opens; closes on outside tap + Esc) ----------
const tBtn = $('#testerBtn'), tPop = $('#testerPop');
tBtn.innerHTML = `<span class="t-dot" aria-hidden="true"></span>${esc(COPY.tester.open)} · ${esc(V.label)}`;
tPop.innerHTML = `
  <p class="eyebrow sm">${esc(COPY.tester.title)}</p>
  <p class="fine">${esc(COPY.tester.hint)}</p>
  <div class="t-list">${Object.entries(VARIANTS).map(([k, v]) => `<a class="t-opt ${k === VARIANT ? 'on' : ''}" href="?v=${k}${FAST ? '&fast=1' : ''}"><b>${esc(v.label)}</b><small>${esc(v.desc)}</small></a>`).join('')}</div>
  <button class="btn sec sm" id="tRestart" type="button">${esc(COPY.tester.restart)}</button>`;
const openTester = open => { tPop.hidden = !open; tBtn.setAttribute('aria-expanded', open); };
tBtn.onclick = e => { e.stopPropagation(); openTester(tPop.hidden); };
$('#tRestart').onclick = () => { openTester(false); renderStart(); };
document.addEventListener('pointerdown', e => { if (!tPop.hidden && !tPop.contains(e.target) && !tBtn.contains(e.target)) openTester(false); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!tPop.hidden) { openTester(false); tBtn.focus(); return; }
  const x = $('#pwClose'); if (x) x.click();   // Esc on the paywall = Not now
});

renderStart();
