// First story flow: the recommended first-time path, one phone, nine steps.
// Words: copy.js (screens) and stories.js (story lines). Tester panel jumps to any step.
// Links: #s1…#s9 opens a step; ?walk=dog|city|treadmill|home, ?story=<id>, ?trial=1 (took the first trial).
const V = window.CACHE_V || '';
const [{ COPY, STEPS, WALKS }, { STORIES, START_HERE, SAMPLE, SHELVES }] = await Promise.all([
  import('./copy.js' + V), import('./stories.js' + V),
]);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const screen = $('#screen');
const overlay = $('#overlay');
const wait = (ms) => new Promise((r) => { const t = setTimeout(r, ms); pending.push(() => { clearTimeout(t); r(); }); });
let pending = [];
let run = 0; // bumps on every jump so old async chains stop

const qs = new URLSearchParams(location.search);
const S = {
  step: 1,
  walk: WALKS[qs.get('walk')] ? qs.get('walk') : 'dog',
  mode: null, // set from walk
  trial: qs.get('trial') === '1',
  skipped: false,
  account: false,
  story: STORIES[qs.get('story')] ? qs.get('story') : null,
  ch: 0,
  seen: {}, // first-time tips
};
S.mode = WALKS[S.walk].mode;

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fill = (t) => String(t)
  .replace(/\{story\}/g, story().title).replace(/\{who\}/g, story().who)
  .replace(/\{walk\}/g, WALKS[S.walk].short).replace(/\{goal\}/g, COPY.unlock.goal);
const story = () => STORIES[S.story || pickDefault()];
function pickDefault() { return START_HERE[S.walk][0]; }

const ICON = {
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4L3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4zM9 4v13.5M15 6.5V20"/></svg>',
  lib: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5.5A1.5 1.5 0 015.5 4H9v15H5.5A1.5 1.5 0 014 19zM9 4h4v15H9zM14 5.2l3.4-.9 3.5 13.5-3.4.9z"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-6.5 8 6.5V20h-5.5v-5h-5v5H4z"/></svg>',
  cam: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5h4"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/></svg>',
  apple: '<svg viewBox="0 0 24 24" aria-hidden="true" class="fillicon"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8C7 7.3 5.6 8.2 4.8 9.6c-1.6 2.8-.4 6.9 1.2 9.1.8 1.1 1.6 2.3 2.8 2.3 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7 2-1.1 2.7-2.2c.9-1.3 1.2-2.5 1.2-2.6 0 0-2.3-.9-2.1-3.6zM14.2 5.6c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.7-1 2.8 1 .1 2.1-.5 2.8-1.3z"/></svg>',
  google: '<svg viewBox="0 0 24 24" aria-hidden="true" class="gicon"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0012 22z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 000 9.2z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 003.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/></svg>',
};
const WALK_ICON = {
  dog: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 13l-3-4 1-3 4 3h5l3-4h2l1 4 3 2v3l-3 1v7h-3v-5h-7v5H9v-6l-2-1z"/><circle cx="21" cy="9.5" r=".8" class="dot"/></svg>',
  city: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 27V14l6-3v16M10 27V7l8-3v23M18 27V12l9 3v12M3 27h26M13 10h2M13 14h2M13 18h2M22 18h2M22 22h2M6 18h2"/></svg>',
  treadmill: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 24h21l3-4M7 27h18M22 20V8l4-2"/><circle cx="13" cy="6" r="2"/><path d="M13 9l-2 6 3 3v4M12 13l4 2 2-2M11 15l-3 2"/></svg>',
  home: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 15L16 6l11 9M8 13v13h16V13M13 26v-7h6v7"/></svg>',
};

// ---------------------------------------------------------------- shell

function show(html, cls = '') {
  screen.className = 'screen ' + cls;
  screen.removeAttribute('data-story');
  $('#bg').removeAttribute('style'); $('#bg').className = '';
  screen.innerHTML = html;
  screen.scrollTop = 0;
  noWidows(screen);
}
function sheet(html, cls = '') {
  overlay.innerHTML = `<div class="scrim"></div><div class="sheet ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  overlay.hidden = false;
  noWidows(overlay);
  requestAnimationFrame(() => overlay.classList.add('on'));
}
function closeSheet() { overlay.classList.remove('on'); overlay.hidden = true; overlay.innerHTML = ''; }
function choose(root, sel) {
  return new Promise((r) => {
    const my = run;
    root.addEventListener('click', function h(e) {
      const b = e.target.closest(sel);
      if (!b || b.disabled) return;
      root.removeEventListener('click', h);
      if (my === run) r(b.dataset.v ?? b.dataset.k ?? '');
    });
  });
}

function setStep(n) {
  S.step = n;
  $$('.tstep').forEach((b) => b.setAttribute('aria-current', String(+b.dataset.s === n)));
  $('#tbtnN').textContent = `${n}/9`;
  const st = STEPS[n - 1];
  $('#note').innerHTML = `<p class="nk">Step ${n} of 9</p><h2>${st.name}</h2><p>${st.note}</p>`;
  noWidows($('#note'));
  const url = new URL(location.href);
  url.hash = 's' + n;
  url.searchParams.set('walk', S.walk);
  if (S.story) url.searchParams.set('story', S.story); else url.searchParams.delete('story');
  if (S.trial) url.searchParams.set('trial', '1'); else url.searchParams.delete('trial');
  history.replaceState(null, '', url);
}

// ---------------------------------------------------------------- 1 hook

async function hook() {
  setStep(1);
  const c = COPY.hook;
  show(`<div class="hook">
      <div class="hookart" aria-hidden="true"></div>
      <div class="hooktop"><img class="logo" src="img/logo-on-dark.png" alt="Story City"></div>
      <div class="hookbody">
        <h1>${c.title}</h1>
        <p class="lede">${c.sub}</p>
        <button class="btn grad" data-k="go">${c.cta}</button>
        <button class="link" data-k="login">${c.login}</button>
      </div>
    </div>`, 'dark');
  const k = await choose(screen, '[data-k]');
  if (k === 'login') { await toast(COPY.hook.loginToast); return hook(); }
  return walkPick();
}

// ---------------------------------------------------------------- 2 walk

async function walkPick() {
  setStep(2);
  const c = COPY.walk;
  show(`<div class="pad walk">
      <p class="kick">${c.kick}</p>
      <h1>${c.title}</h1>
      <p class="sub">${c.sub}</p>
      <div class="walks">${Object.entries(WALKS).map(([k, w]) => `<button class="wcard${k === S.walk ? ' was' : ''}" data-v="${k}">
          <span class="wic">${WALK_ICON[k]}</span><span class="wt"><b>${w.label}</b><small>${w.line}</small></span>
          <span class="wmode m-${w.mode}">${COPY.modes[w.mode].name}</span></button>`).join('')}</div>
      <p class="fine">${c.fine}</p>
    </div>`);
  const v = await choose(screen, '.wcard');
  S.walk = v; S.mode = WALKS[v].mode;
  const b = $(`.wcard[data-v="${v}"]`); b.classList.add('on');
  await wait(380);
  return trial(1);
}

// ---------------------------------------------------------------- 3 & 8 trial

async function trial(which) {
  const second = which === 2;
  setStep(second ? 8 : 3);
  const c = second ? COPY.trial2 : COPY.trial;
  const st = story();
  const cliff = second ? (st.ch[1].cliff || '') : '';
  sheet(`<div class="pw">
      <button class="pwx" data-k="skip" aria-label="${c.skip}">${ICON.close}</button>
      <div class="pwhero${second ? ' cliff' : ''}">
        ${second ? `<p class="kick">${fill(c.kick)}</p><p class="cliffline">“${esc(cliff)}”</p>` : '<img class="logo" src="img/logo-on-dark.png" alt="Story City">'}
      </div>
      <h2>${fill(c.title)}</h2>
      <ul class="pwlist">${c.points.map((p) => `<li>${ICON.check}<span>${fill(p)}</span></li>`).join('')}</ul>
      <div class="plans">
        ${COPY.plans.map((p, i) => `<button class="plan${i === 0 ? ' on' : ''}" data-plan="${i}"><span><b>${p.name}</b><small>${p.sub}</small></span><em>${p.price}</em>${p.tag ? `<i>${p.tag}</i>` : ''}</button>`).join('')}
      </div>
      <button class="btn grad" data-k="start">${c.cta}</button>
      <p class="pwfine">${c.fine}</p>
      <button class="link" data-k="skip">${c.skip}</button>
    </div>`, 'full paywall');
  const sh = $('.sheet', overlay);
  sh.addEventListener('click', (e) => {
    const p = e.target.closest('.plan'); if (!p) return;
    $$('.plan', sh).forEach((x) => x.classList.toggle('on', x === p));
  });
  const k = await choose(sh, '[data-k]');
  closeSheet();
  if (k === 'start') { S.trial = true; await toast(c.started); }
  else if (!second) { S.skipped = true; }
  if (!second) return library();
  if (S.trial) return unlock(2);
  return locked();
}

async function locked() {
  setStep(8);
  const st = story(), c = COPY.locked;
  show(`${topbar(st.title, `Chapter 3 of ${st.ch.length}`)}
    <div class="pad lockedwrap">
      <div class="lockcard"><span class="lic">${ICON.lock}</span>
        <h2>${fill(c.title)}</h2><p class="sub">${fill(c.sub)}</p>
        <button class="btn grad" data-k="trial">${c.cta}</button>
        <button class="link" data-k="lib">${c.back}</button>
      </div>
    </div>`);
  const k = await choose(screen, '[data-k]');
  if (k === 'trial') return trial(2);
  return library();
}

// ---------------------------------------------------------------- 4 library

// ExploreCard: 2:3 poster, radius 4, title over a dark fade, travel chip bottom-left
function cover(st, size = '') {
  const art = st.cover ? `<img src="${st.cover}" alt="" loading="lazy">` : `<span class="glyph">${st.avatar ? `<img src="${st.avatar}" alt="">` : st.glyph}</span>`;
  const bg = st.cover ? '' : ` style="--g1:${st.glow[0]};--g2:${st.glow[1]}"`;
  const title = st.cover && st.coverTitle ? '' : `<b class="ctitle">${st.title}</b>`;
  return `<span class="cover ${size}${st.cover ? '' : ' noart'}${title ? ' fade' : ''}"${bg}>${art}${title}</span>`;
}

async function library() {
  setStep(4);
  const c = COPY.library, w = WALKS[S.walk];
  const picks = START_HERE[S.walk];
  show(`<header class="libhead"><h1>${c.title}</h1>
        <label class="search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg><input type="search" placeholder="${c.search}" aria-label="${c.search}"></label></header>
      <section class="shelf start">
        <div class="shead"><h2>${c.start}</h2><span class="spill m-${S.mode}">${COPY.modes[S.mode].name}</span></div>
        <p class="ssub">${fill(c.startSub).replace('{for}', w.for)}</p>
        <div class="srow">
          ${picks.map((id) => storyCard(id)).join('')}
          ${storyCard(SAMPLE, true)}
        </div>
      </section>
      ${SHELVES.map((sh) => `<section class="shelf"><div class="shead"><h2>${sh.name}</h2><span class="seeall">${c.seeAll}</span></div>
        <div class="srow">${sh.items.map((it) => `<div class="scard dim"><span class="cover${it.titleOn ? ' fade' : ''}"><img src="${it.cover}" alt="" loading="lazy">${it.titleOn ? `<b class="ctitle">${it.title}</b>` : ''}</span>
          <small>${it.mins}</small></div>`).join('')}</div></section>`).join('')}
      <div class="navpad"></div>`, 'lib light');
  screen.insertAdjacentHTML('beforeend', bottomNav());
  if (!S.seen.lib) {
    S.seen.lib = true;
    snack(COPY.tips.library, 5000, true);
  }
  const id = await choose(screen, '.scard[data-v]');
  S.story = id;
  return overview();
}

function storyCard(id, sample = false) {
  const st = STORIES[id], c = COPY.library;
  return `<button class="scard${sample ? ' sample' : ''}" data-v="${id}">
      ${cover(st)}
      <span class="travel">${st.where === 'near' ? st.mins : c.anywhere}</span>
      ${sample ? `<span class="tag">${c.sampleTag}</span>` : ''}
      <small>${st.mins} · ${st.ch.length} ${c.chapters}</small>
    </button>`;
}

function bottomNav() {
  return `<nav class="bnav" aria-label="Tabs"><span class="bt on">${ICON.lib}<small>${COPY.library.title}</small></span></nav>`;
}

async function overview() {
  const st = story(), c = COPY.overview;
  const modeOk = { steps: true, path: false, hunt: true };
  sheet(`<div class="ov">
      <div class="ovart">${cover(st, 'wide')}</div>
      <div class="ovbody">
        <p class="kick">${st.genre} · ${st.age}</p>
        <h2>${st.title}</h2>
        <p class="sub">${st.blurb}</p>
        <div class="facts"><span>${st.mins}</span><span>${st.ch.length} ${COPY.library.chapters}</span><span>${c.where[st.where]}</span></div>
        <p class="ovmode">${c.opensIn} <b class="m-${S.mode}">${COPY.modes[S.mode].name}</b>. ${c.switch}</p>
        <button class="btn grad" data-k="start">${c.cta}</button>
        <button class="link" data-k="back">${c.back}</button>
      </div>
    </div>`, 'tall');
  const k = await choose($('.sheet', overlay), '[data-k]');
  closeSheet();
  if (k === 'back') return library();
  S.ch = 0;
  return reader(0);
}

// ---------------------------------------------------------------- 5 reader

function topbar(title, sub, mapBtn = false) {
  return `<header class="rtop"><button class="chip ghost" data-k="lib" aria-label="Back to library">${ICON.back}</button>
    <div class="rt"><b>${title}</b><small>${sub}</small></div>
    ${mapBtn ? `<button class="chip ghost mapbtn" data-k="map" aria-label="Open map">${ICON.map}</button>` : '<span class="chip ghost hide"></span>'}</header>`;
}

async function reader(ci) {
  const my = ++run;
  S.ch = ci;
  setStep(ci === 0 ? 5 : ci === 1 ? 8 : 9);
  const st = story(), ch = st.ch[ci];
  show(`${topbar(st.title, `Chapter ${ci + 1} of ${st.ch.length} · ${ch.name}`, true)}
    <div class="thread" id="thread"><p class="chname">Chapter ${ci + 1}<b>${ch.name}</b></p></div>
    <div class="reply" id="reply"></div>`, 'reader');
  screen.dataset.story = S.story;
  const bg = $('#bg');
  bg.className = 'on';
  bg.style.backgroundImage = `url(${st.cover || 'img/ftue_background.png'})`;
  screen.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k="lib"]');
    if (b) { run++; closeSheet(); library(); }
  });
  const thread = $('#thread'), reply = $('#reply');
  const alive = () => my === run;

  for (const beat of ch.beats) {
    if (!alive()) return;
    if (typeof beat === 'string') { await say(thread, st, beat, alive); continue; }
    if (beat.n) { await wait(450); if (!alive()) return; addRow(thread, `<p class="narr">${esc(beat.n)}</p>`); continue; }
    if (beat.me) { const v = await offer(reply, [beat.me]); if (!alive()) return; me(thread, v); continue; }
    if (beat.choice) {
      const first = !S.seen.choice;
      if (first) { S.seen.choice = true; snack(COPY.tips.choice, 0); }
      const v = await offer(reply, beat.choice);
      if (!alive()) return;
      hideSnack();
      me(thread, v);
      for (const line of beat.then[beat.choice.indexOf(v)]) await say(thread, st, line, alive);
      continue;
    }
    if (beat.puzzle) { await say(thread, st, beat.ask, alive); if (!alive()) return; await puzzle(thread, beat, alive); continue; }
  }
  if (!alive()) return;
  if (ch.end) return finish();
  if (ch.cliff) { await wait(500); if (!alive()) return; addRow(thread, `<p class="narr cliff">${esc(ch.cliff)}</p>`); }
  await wait(500);
  if (!alive()) return;
  addRow(thread, `<div class="chend"><p>${ci === 0 ? COPY.reader.end1 : COPY.reader.end2}</p></div>`);
  reply.innerHTML = `<button class="btn grad" data-k="map">${ICON.map}<span>${COPY.reader.openMap}</span></button>`;
  if (ci === 0 && !S.seen.map) {
    S.seen.map = true;
    await spotlight($('.mapbtn'), COPY.tips.map);
    if (!alive()) return;
  }
  await choose(screen, '[data-k="map"]');
  if (!alive()) return;
  if (ci === 1 && !S.trial) return trial(2);
  return unlock(ci + 1);
}

function addRow(thread, html) {
  thread.insertAdjacentHTML('beforeend', html);
  noWidows(thread.lastElementChild);
  const sc = screen; sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' });
}
async function say(thread, st, text, alive) {
  addRow(thread, `<div class="row them typing">${avatar(st)}<div class="col"><small class="from">${esc(st.who)}</small><div class="bub"><span class="dots"><i></i><i></i><i></i></span></div></div></div>`);
  await wait(Math.min(1300, 420 + text.length * 14));
  const t = $$('.typing', thread).pop();
  if (!alive()) return;
  t.classList.remove('typing');
  $('.bub', t).textContent = text;
  noWidows(t);
  screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' });
  await wait(200);
}
function avatar(st) {
  return `<span class="av"${st.avatar ? '' : ` style="--g1:${st.glow[0]};--g2:${st.glow[1]}"`}>${st.avatar ? `<img src="${st.avatar}" alt="">` : st.glyph}</span>`;
}
function me(thread, text) { addRow(thread, `<div class="row mine"><div class="bub">${esc(text)}</div></div>`); }
function offer(reply, opts) {
  reply.innerHTML = opts.map((o) => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join('');
  return choose(reply, '.opt').then((v) => { reply.innerHTML = ''; return v; });
}

// tap-to-decrypt: each tile flips from a symbol to its letter
async function puzzle(thread, beat, alive) {
  const glyphs = '✦◆✧❖✶◈✷❂';
  const letters = [...beat.puzzle];
  const first = !S.seen.puzzle;
  addRow(thread, `<div class="decrypt"><div class="tiles">${letters.map((l, i) => `<button class="tile" data-i="${i}" aria-label="Encrypted tile ${i + 1}">${glyphs[i % glyphs.length]}</button>`).join('')}</div><small>${beat.hint}</small></div>`);
  if (first) { S.seen.puzzle = true; snack(COPY.tips.puzzle, 0); }
  const box = $$('.decrypt', thread).pop();
  await new Promise((done) => {
    const my = run;
    box.addEventListener('click', (e) => {
      const t = e.target.closest('.tile');
      if (!t || t.classList.contains('open') || my !== run) return;
      t.classList.add('open'); t.textContent = letters[+t.dataset.i]; t.setAttribute('aria-label', letters[+t.dataset.i]);
      if ($$('.tile:not(.open)', box).length === 0) { box.classList.add('solved'); done(); }
    });
    pending.push(done);
  });
  hideSnack();
  if (!alive()) return;
  await wait(350);
  me(thread, beat.puzzle);
}

// ---------------------------------------------------------------- 6 unlock (the map)

async function unlock(nextCh) {
  const my = ++run;
  setStep(nextCh === 1 ? 6 : 8);
  const st = story(), c = COPY.unlock;
  const goal = nextCh === 1 ? c.goalSteps : c.goalSteps2;
  const target = st.ch[nextCh - 1].unlock;
  const home = S.walk === 'home';
  let count = 0;
  const render = () => {
    const m = S.mode;
    show(`${topbar(st.title, `${c.unlocks} ${nextCh + 1}`)}
      <div class="map m-${m}" id="map">${mapSvg(m, count / goal)}
        <div class="modes" role="tablist" aria-label="Map mode">${['steps', 'path', 'hunt'].map((k) => `<button role="tab" class="mode m-${k}${k === m ? ' on' : ''}${k === 'path' ? ' soon' : ''}" data-mode="${k}" aria-selected="${k === m}"${k === 'path' ? ' aria-disabled="true"' : ''}>${COPY.modes[k].name}</button>`).join('')}</div>
        <p class="modetip" id="modetip" hidden>${COPY.modes.path.tip}</p>
      </div>
      ${S.seen.mapTip ? '' : `<div class="maptip" id="maptip"><p><b>${c.tipTitle}</b>${fill(c.tip)}</p><button class="gotit" data-k="gotit">Got It</button><img src="img/elf.png" alt=""></div>`}
      <div class="msheet">
        ${m === 'hunt' ? `<h2>${esc(target.hunt)}</h2><p class="sub">${c.huntSub}</p>
          <button class="btn hunt" data-k="photo">${ICON.cam}<span>${c.photo}</span></button>`
        : `<h2>${fill(c.walkTitle).replace('{n}', goal).replace('{place}', esc(target.place))}</h2>
          <div class="counter"><b id="cnt">${count}</b><span>${c.outOf.replace('{n}', goal)}</span></div>
          <div class="bar"><i id="barfill" style="width:${100 * count / goal}%"></i></div>
          <p class="sub">${home ? c.walkSubHome : c.walkSub}</p>
          <button class="demo" data-k="walk">▶ ${c.pretend}</button>`}
        <div class="skiprow${home ? ' strong' : ''}"><button class="skippill" data-k="home">${c.homeBtn}</button><p><b>${c.homeTitle}.</b> ${m === 'hunt' ? c.homeSubHunt : c.homeSub}</p></div>
      </div>`, 'mapscreen');
  };
  render();
  screen.addEventListener('click', async (e) => {
    if (my !== run) return;
    const lib = e.target.closest('[data-k="lib"]');
    if (lib) { run++; closeSheet(); return library(); }
    if (e.target.closest('[data-k="gotit"]')) { S.seen.mapTip = true; $('#maptip')?.remove(); return; }
    const mb = e.target.closest('[data-mode]');
    if (mb) {
      if (mb.dataset.mode === 'path') { const t = $('#modetip'); t.hidden = false; setTimeout(() => { if (t.isConnected) t.hidden = true; }, 2600); return; }
      S.mode = mb.dataset.mode; return render();
    }
  });
  const how = await new Promise((done) => {
    screen.addEventListener('click', async (e) => {
      if (my !== run) return;
      const b = e.target.closest('[data-k="walk"],[data-k="photo"],[data-k="home"]');
      if (!b) return;
      if (b.dataset.k === 'home') return done('home');
      if (b.dataset.k === 'photo') { await camera(target.hunt); return my === run && done('photo'); }
      b.disabled = true;
      while (count < goal && my === run) {
        count = Math.min(goal, count + Math.ceil(goal / 15));
        const cnt = $('#cnt'); if (cnt) cnt.textContent = count;
        const bf = $('#barfill'); if (bf) bf.style.width = (100 * count / goal) + '%';
        const ring = $('.goalring'); if (ring) ring.setAttribute('r', 48 - 30 * count / goal);
        const trail = $('#trailDone'); if (trail) trail.setAttribute('stroke-dashoffset', 1 - count / goal);
        await wait(110);
      }
      if (my === run) done('walk');
    });
  });
  if (my !== run) return;
  await unlockedSheet(nextCh, how);
  if (my !== run) return;
  if (nextCh === 1 && !S.account) return account();
  return reader(nextCh);
}

async function unlockedSheet(nextCh, how) {
  const c = COPY.unlocked;
  sheet(`<div class="unl"><span class="burst">${ICON.check}</span><p class="kick">${c.kick}</p><h2>${c.title.replace('{n}', nextCh + 1)}</h2>
    <p class="sub">${how === 'home' ? c.home : how === 'photo' ? c.photo : c.walk}</p>
    <button class="btn grad" data-k="go">${c.cta}</button></div>`, 'small');
  await choose($('.sheet', overlay), '[data-k]');
  closeSheet();
}

function camera(label) {
  return new Promise((done) => {
    sheet(`<div class="cam"><div class="vf"><i></i><i></i><i></i><i></i><p>${esc(label)}</p></div>
      <div class="camrow"><button class="chip ghost" data-k="x" aria-label="Close camera">${ICON.close}</button><button class="shutter" data-k="snap" aria-label="Take photo"></button><span class="chip ghost hide"></span></div></div>`, 'full camsheet');
    $('.sheet', overlay).addEventListener('click', async (e) => {
      const b = e.target.closest('[data-k]'); if (!b) return;
      if (b.dataset.k === 'x') { closeSheet(); return; }
      $('.vf', overlay).classList.add('flash');
      await wait(450); closeSheet(); done();
    });
  });
}

// a drawn neighbourhood; trail colour per mode
function mapSvg(mode, t) {
  const road = 'M-20 520H420M-20 300H420M120 -20V700M290 -20V700M-20 120L180 40M200 700L420 560';
  const park = '<rect x="140" y="140" width="130" height="140" rx="10" class="park"/><rect x="310" y="330" width="100" height="150" rx="10" class="park"/>';
  const blocks = [[10, 10, 90, 90], [140, 10, 130, 110], [310, 10, 90, 270], [10, 140, 90, 140], [10, 320, 90, 180], [140, 320, 130, 180], [10, 540, 90, 120], [140, 540, 130, 120], [310, 500, 90, 160]]
    .map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="blk"/>`).join('');
  const me = '<g class="me" transform="translate(205 360)"><circle r="22" class="halo"/><circle r="8" class="dotme"/></g>';
  let over = '';
  if (mode === 'steps') {
    over = `<defs><linearGradient id="tg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="var(--steps-a)"/><stop offset="1" stop-color="var(--steps-b)"/></linearGradient></defs>
      <path d="M205 360V300H120V200" class="trail" pathLength="1"/>
      <path id="trailDone" d="M205 360V300H120V200" class="trailDone" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${1 - t}"/>
      <circle cx="120" cy="200" r="${48 - 30 * t}" class="goalring"/><circle cx="120" cy="200" r="7" class="goaldot"/>`;
  } else if (mode === 'hunt') {
    over = '<circle cx="205" cy="360" r="150" class="sonar"/><circle cx="205" cy="360" r="90" class="sonar s2"/>';
  }
  return `<svg class="mapsvg" viewBox="0 0 400 660" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="400" height="660" class="ground"/>${park}${blocks}<path d="${road}" class="road"/>${over}${me}</svg>`;
}

// ---------------------------------------------------------------- 7 account

async function account() {
  setStep(7);
  const c = COPY.account, st = story();
  sheet(`<div class="acct"><span class="grab"></span>
      <p class="kick">${fill(c.kick)}</p>
      <h2>${fill(c.title)}</h2>
      <p class="sub">${fill(c.sub)}</p>
      <ul class="benefits">${c.points.map((p, i) => `<li><img src="${c.icons[i]}" alt=""><span>${p}</span></li>`).join('')}</ul>
      <button class="sso" data-k="google">${ICON.google}<span>${c.google}</span></button>
      <button class="sso" data-k="apple">${ICON.apple}<span>${c.apple}</span></button>
      <button class="sso" data-k="email">${ICON.mail}<span>${c.email}</span></button>
      <button class="link" data-k="skip">${c.skip}</button>
      <p class="legal">${c.legal}</p>
    </div>`, 'drawer');
  const k = await choose($('.sheet', overlay), '[data-k]');
  closeSheet();
  if (k !== 'skip') { S.account = true; await toast(c.saved); }
  else await toast(c.later);
  return reader(1);
}

// ---------------------------------------------------------------- 9 finish

async function finish() {
  const my = ++run;
  setStep(9);
  const st = story(), c = COPY.finish, end = st.ch[st.ch.length - 1].end;
  const next = [...START_HERE[S.walk], SAMPLE].find((id) => id !== S.story);
  show(`<div class="pad fin">
      <p class="kick">${c.kick}</p>
      <h1>${fill(c.title)}</h1>
      <div class="endcard">${cover(st, 'mini')}<div><b>${esc(end.name)}</b><small>${c.ending.replace('{n}', end.n).replace('{of}', end.of)}</small></div></div>
      <p class="sub">${end.of > 1 ? c.replay : c.oneEnd}</p>
      <section class="remind">
        <p class="mk">${c.remindKick}</p>
        <div class="notif"><span class="nicon">SC</span><div><b>${c.notifTitle}</b><small>${fill(c.notifBody)}</small></div><em>${c.notifWhen}</em></div>
        <p class="sub">${fill(c.remindSub)}</p>
        <label class="toggle"><input type="checkbox" id="remind" checked><span class="sw"></span><b>${c.remindLabel}</b></label>
      </section>
      <section class="upnext"><p class="mk">${c.upNext}</p>${storyCard(next)}</section>
      <button class="btn grad" data-k="lib">${c.cta}</button>
      <div class="navpad"></div>
    </div>`);
  if (my !== run) return;
  screen.addEventListener('click', (e) => {
    const card = e.target.closest('.scard[data-v]');
    if (card && my === run) { run++; S.story = card.dataset.v; return overview(); }
    if (e.target.closest('[data-k="lib"]') && my === run) { run++; return library(); }
  });
}

// ---------------------------------------------------------------- tips (TutorialSnackbar + spotlight)

function snack(text, ms, low = false) {
  const s = $('#snack');
  s.classList.toggle('low', low);
  s.innerHTML = `<p>${text}</p><button class="snx" aria-label="Dismiss tip">${ICON.close}</button><img class="elf" src="img/elf.png" alt="">`;
  noWidows(s);
  s.hidden = false; requestAnimationFrame(() => s.classList.add('on'));
  $('button', s).onclick = hideSnack;
  clearTimeout(snack.t);
  if (ms) snack.t = setTimeout(hideSnack, ms);
}
function hideSnack() { const s = $('#snack'); s.classList.remove('on'); s.hidden = true; }
async function toast(text) {
  const t = $('#toast'); t.textContent = text; t.hidden = false; t.classList.add('on');
  await wait(1300); t.classList.remove('on'); t.hidden = true;
}
function spotlight(target, text) {
  return new Promise((done) => {
    const sp = $('#spot');
    const pr = $('#phone').getBoundingClientRect(), r = target.getBoundingClientRect();
    const z = parseFloat(getComputedStyle($('#phone')).zoom) || 1;
    const k = Math.abs(pr.width - $('#phone').offsetWidth) < 2 ? 1 : z;   // rects come back zoomed in some browsers
    const cx = (r.left - pr.left + r.width / 2) / k, cy = (r.top - pr.top + r.height / 2) / k;
    sp.style.setProperty('--x', cx + 'px'); sp.style.setProperty('--y', cy + 'px');
    $('#spotTip').innerHTML = `<p>${text}</p><small>${COPY.tips.tapAnywhere}</small><img class="elf" src="img/elf.png" alt="">`;
    noWidows($('#spotTip'));
    sp.hidden = false;
    const end = () => { sp.hidden = true; sp.onclick = null; done(); };
    sp.onclick = end; pending.push(end);
  });
}

// ---------------------------------------------------------------- tester panel

function jump(n) {
  run++;
  pending.splice(0).forEach((f) => f());
  closeSheet(); hideSnack(); $('#spot').hidden = true;
  if (!S.story && n >= 5) S.story = pickDefault();
  const firstTime = { 5: ['choice', 'puzzle', 'map', 'mapTip'], 6: ['mapTip'] };
  (firstTime[n] || []).forEach((k) => delete S.seen[k]);
  if (n <= 3) { S.trial = false; S.skipped = false; }
  if (n === 8 && !S.trial) S.skipped = true;
  const go = {
    1: hook, 2: walkPick, 3: () => trial(1), 4: library, 5: () => reader(0),
    6: () => unlock(1), 7: account, 8: () => (S.trial ? reader(1) : trial(2)), 9: finish,
  }[n];
  go();
}

function buildPanel() {
  const p = $('#tpanel');
  p.innerHTML = `<p class="th">${COPY.tester.title}</p>
    <ol class="tsteps">${STEPS.map((s, i) => `<li><button class="tstep" data-s="${i + 1}"><b>${i + 1}</b>${s.name}</button></li>`).join('')}</ol>
    <p class="tl">${COPY.tester.walk}</p>
    <div class="tchips" id="twalk">${Object.entries(WALKS).map(([k, w]) => `<button class="tchip" data-walk="${k}">${w.short}</button>`).join('')}</div>
    <p class="tl">${COPY.tester.story}</p>
    <div class="tchips" id="tstory"></div>
    <p class="tl">${COPY.tester.trial}</p>
    <div class="tchips" id="ttrial"><button class="tchip" data-trial="0">${COPY.tester.skipped}</button><button class="tchip" data-trial="1">${COPY.tester.took}</button></div>
    <button class="tchip wide" data-reset>${COPY.tester.reset}</button>`;
  p.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.s) { togglePanel(false); return jump(+b.dataset.s); }
    if (b.dataset.walk) { S.walk = b.dataset.walk; S.mode = WALKS[S.walk].mode; if (!START_HERE[S.walk].includes(S.story) && S.story !== SAMPLE) S.story = null; }
    if (b.dataset.story) S.story = b.dataset.story;
    if (b.dataset.trial) { S.trial = b.dataset.trial === '1'; S.skipped = !S.trial; }
    if ('reset' in b.dataset) { S.seen = {}; S.trial = false; S.skipped = false; S.account = false; S.story = null; togglePanel(false); return jump(1); }
    syncPanel();
    jump(S.step);
  });
}
function syncPanel() {
  $$('[data-walk]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.walk === S.walk)));
  const ids = [...START_HERE[S.walk], SAMPLE];
  $('#tstory').innerHTML = ids.map((id) => `<button class="tchip" data-story="${id}" aria-pressed="${id === (S.story || pickDefault())}">${STORIES[id].title.replace(/^The /, '')}</button>`).join('');
  $$('[data-trial]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.trial === '1') === S.trial)));
}
function togglePanel(open) {
  const p = $('#tpanel'), b = $('#tbtn');
  const on = open ?? p.hidden;
  p.hidden = !on; b.setAttribute('aria-expanded', String(on));
  if (on) syncPanel();
}
$('#tbtn').addEventListener('click', () => togglePanel());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') togglePanel(false); });
document.addEventListener('click', (e) => {
  if (!$('#tpanel').hidden && !e.target.closest('#tpanel, #tbtn')) togglePanel(false);
});

// keep the last two words together (no lone last word)
function noWidows(root) {
  if (!root) return;
  const SEL = 'h1, h2, h3, p, small, li span, .bub, .opt, b';
  [...(root.matches?.(SEL) ? [root] : []), ...root.querySelectorAll(SEL)].forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let last = null;
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) last = walker.currentNode;
    if (!last || el.textContent.trim().split(/\s+/).length < 3) return;
    const m = last.nodeValue.match(/^([\s\S]*[^\s ])([  ]+)([^\s ]+\s*)$/);
    if (!m || m[2].includes(' ')) return;
    last.nodeValue = m[1] + ' ' + m[3];
  });
}

// fit the framed phone to short laptop screens
function fit() { document.documentElement.style.setProperty('--s', Math.min(1, (innerHeight - 48) / 866).toFixed(3)); }
fit(); addEventListener('resize', fit);

buildPanel();
const start = +(location.hash.match(/^#s(\d)$/) || [])[1] || 1;
jump(Math.min(9, Math.max(1, start)));
