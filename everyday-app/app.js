// Everyday Story City: boot, the phone shell (tab bar, step pill), one click handler for the
// whole app, the actions, the reviewer rig (Journeys, Team options, Reviewer mode) and Problems and fixes.
import {
  S, O, OPTIONS, go, back, render, rerender, toast, openSheet, closeSheet, sheetIsOpen, currentSheet, current, regSheet,
  $, $$, esc, ic, resetState, saveOpts, loadOpts, resetOpts, onRendered, homeTab, byId, fmtTime, later, isDark, daylightLeft,
  BASE_STATE, DAYS, nextDay, laterToday, whileAway, walkIdFor, walkDef, walkVersion, weatherKind, countWalk, pressSeal, codeName, myCode, pronoun,
  seedHist, logAct, firstName, homeOff, remembered,
} from './core.js';
import { APP, RIG, TABS, JOURNEYS, TODAY, MAP, GEMS, WALKMAP, POSTCARD, LOCKIN, TRIAL, ACCOUNT, OVERVIEW, FEED, REMIND, SHEETS_W, YOU, PERMISSION, ROUTES, MORE, MISSION, BREAK, LIBRARY, LOOPS, ROULETTE, NOHOME } from './words.js';
import { stepArc } from './ui.js';
import { fitTrail, lenTrail, storyLen, fmtMins, shoes, coming, ideasUI, fits, lib, feedCheer, whimsy, roulette, mission, doorstep, LOCKIN_TIMES, mapUI, youUI, curStory, stepsFor, missionSteps, frUI, verFor, wpMins, rlTurns, wtUI } from './screens-tabs.js';
import { F, smartWay, waysFor, arrive, mockGps, walkState, goalFor, tread, cam, together, tips, routesCook } from './screens-story.js';
import { gemForm, resetGemForm, GEM_ACT, defaultGemName } from './gems.js';
import { PROBLEMS, probUI } from './problems.js';
import { SQUEAKY } from './stories.js';

document.title = APP.title;
const paid = () => ['trial', 'member'].includes(S.member);
const hasNameLocal = () => (S.account || ['trial', 'member', 'free'].includes(S.member) ? S.name : 'You');

// ---------------------------------------------------------------- shell: tabs + step pill
const TABSETS = {
  // Feed folded into Today (Melissa, Nov 4): four tabs plus the + Gem button
  five: [['today', 'today', TABS.today], ['map', 'map', TABS.map], ['GEM', 'plus', 'Gem'], ['library', 'library', TABS.library], ['you', 'you', null]],
  real: [['today', 'home', TABS.home], ['feed', 'feed', TABS.feed], ['library', 'library', TABS.library]],
  library: [['library', 'library', TABS.library]],
  sgw: [['library', 'library', TABS.stories], ['map', 'gem', TABS.gems], ['whimsy', 'whimsy', TABS.whimsy]],
  maphome: [['map', 'map', TABS.map], ['library', 'library', TABS.library], ['you', 'you', null]],
  go: [['feed', 'feed', TABS.feed], ['library', 'library', TABS.library], ['GO', 'go', TABS.go], ['map', 'map', TABS.map], ['you', 'you', null]],
};
let lastY = 0;
function drawShell(def) {
  const tabs = $('#tabs');
  const set = TABSETS[O.tabs];
  const cur = def && def.tab;
  tabs.style.gridTemplateColumns = `repeat(${set.length}, 1fr)`;
  tabs.innerHTML = set.map(([id, icn, label]) => {
    const lab = label || YOU.names[O.youName];
    // quick gem: one tap from any tab (Melissa, Nov 4)
    if (id === 'GEM') return `<button class="addgem" data-sheet="quickGem" aria-label="Save a gem here">${ic('plus')}<span>Gem</span></button>`;
    if (id === 'GO') return `<button class="go" data-sheet="go" aria-label="${esc(TABS.go)}">${esc(TABS.go)}</button>`;
    return `<button data-tab="${id}" ${cur === id ? 'aria-current="page"' : ''}>${ic(icn)}<span>${esc(lab)}</span></button>`;
  }).join('');
  // Victoria's arched tracker is the only step display (Melissa, Nov 4: the small pill is gone).
  // By default it floats above the tab bar again (Melissa, Nov 5); .tabpad lets every tab scroll clear of it.
  // Docked under the header stays as the alternative (loops must-fix 3; Team Option arcSpot).
  const dock = O.arcSpot === 'header';   // renamed from arcDock (Nov 5) so an old saved "header" can't pin it to the top
  document.body.classList.add('pill-floating', 'pill-arc');
  document.body.classList.toggle('arc-dock', dock);
  const pill = $('#pill');
  const showArc = def && def.tab && def.tab !== 'feed' && def.tab !== 'map';
  pill.innerHTML = showArc && !dock ? stepArc() : '';
  if (showArc && dock) { const th = $('#screen .tabhead'); const arc = stepArc(); if (th && arc && !$('#screen .arcdock')) th.insertAdjacentHTML('afterend', `<div class="arcdock">${arc}</div>`); }
  pill.classList.remove('hide'); lastY = 0;
  document.body.classList.toggle('ts-small', S.textSize === 'Small');
  document.body.classList.toggle('ts-large', S.textSize === 'Large');
  document.body.classList.toggle('rm', !!S.motion);
  const fb = $('#fixback');
  fb.hidden = !(S.fromProblems && current().id !== 'problems');
  $('#rigstate').textContent = RIG.stateLine({ timeLabel: fmtTime(S.hour), weatherLabel: `${S.temp}°`, placeLabel: S.loc === 'rural' ? 'rural' : S.loc === 'far' ? `${S.city} (visiting)` : S.city, day: S.day, away: S.away });
}
onRendered((def) => drawShell(def));
// the time / steps trail slider in What Fits: repaint the trail as it moves, without re-rendering the sheet
// when the length slider is let go, redraw the sheet so the summary card's time matches
document.addEventListener('change', (e) => { if (e.target.id === 'lenRange') openSheet('start', { id: e.target.dataset.id }); });
document.addEventListener('input', (e) => {
  if (e.target.id === 'enRange') {   // energy slider on Help Me Pick: the Pick for Me button carries the choice
    const i = +e.target.value, ids = ['empty', 'low', 'stroll', 'brisk'], names = ['None', 'A Little', 'Some', 'Lots'];
    e.target.style.setProperty('--p', `${Math.round(i / 3 * 100)}%`); e.target.setAttribute('aria-label', `Energy: ${names[i]}`);
    const b = document.querySelector('.en-go'); if (b) b.dataset.v = ids[i];
    return;
  }
  if (e.target.id === 'lenRange') {
    const k = +e.target.value / 100; F.scale = S.scale = k; F.length = S.length = k < 0.8 ? 'short' : k > 1.25 ? 'long' : 'written';
    e.target.setAttribute('aria-label', `Length of the walk: about ${fmtMins(storyLen(byId[e.target.dataset.id], k).total)}`);
    e.target.style.setProperty('--p', `${Math.round((k - 0.4) / 2.1 * 100)}%`);
    const t = document.getElementById('lenTrail'); if (t) t.outerHTML = lenTrail(byId[e.target.dataset.id], k);
    return;
  }
  if (e.target.id !== 'fitRange') return;
  fits.time = +e.target.value; e.target.style.setProperty('--p', `${Math.round((fits.time - 5) / 115 * 100)}%`);
  const t = document.getElementById('fitTrail'); if (t) t.outerHTML = fitTrail(fits.time, fits.unit);
});
// the floating pill hides while you scroll down, so it never sits on content
$('#screen').addEventListener('scroll', () => {
  // …and comes back at the bottom, where .tabpad leaves the last card clear of it (Melissa, Nov 5)
  const sc = $('#screen'); const y = sc.scrollTop; const atEnd = y + sc.clientHeight >= sc.scrollHeight - 4;
  $('#pill').classList.toggle('hide', y > lastY && y > 40 && !atEnd); lastY = y;
}, { passive: true });

// ---------------------------------------------------------------- tooltips for greyed things
let tipT;
function showTip(el, text) {
  const t = $('#tip'); const ph = $('#phone').getBoundingClientRect(); const r = el.getBoundingClientRect();
  t.textContent = text; t.hidden = false;
  const w = Math.min(280, ph.width - 32);
  t.style.width = w + 'px';
  let x = r.left - ph.left + r.width / 2 - w / 2; x = Math.max(16, Math.min(ph.width - w - 16, x));
  t.style.left = x + 'px';
  const above = r.top - ph.top - 12;
  t.style.top = 'auto'; t.style.bottom = 'auto';
  if (above > 90) { t.style.bottom = (ph.bottom - r.top + 8) + 'px'; } else { t.style.top = (r.bottom - ph.top + 8) + 'px'; }
  clearTimeout(tipT); tipT = setTimeout(() => { t.hidden = true; }, 2800);
}

// ---------------------------------------------------------------- the flow helpers
function routeWalk() {
  const s = byId[F.id];
  const w = F.way;
  F.carry = 0; F.carryHome = null;
  S.lastStory = F.id;
  if (w === 'route') return go('routes', F.route ? { id: s.id, cook: 1, len: F.route } : { id: s.id });
  if (w === 'tread') return go('treadmill');
  if (w === 'sofa' || w === 'home') return go('sofa');
  if (w === 'read') return go('chapter');   // homePlay off: a no-walking story just opens
  F.mode = w === 'there' ? 'path' : s.modes.walk === 'on' ? 'walk' : s.modes.path === 'on' ? 'path' : 'hunt';
  go('walkmap');
}
function startGo() {
  const s = byId[F.id];
  if (F.remember) S.remember = F.way; else if (S.remember && !F.remember) S.remember = null;
  closeSheet(true);
  S.lastStory = s.id;
  if (S.progress[s.id]) { F.ch = S.progress[s.id].ch; return routeWalk(); }
  F.ch = 1; F.newStory = true;
  go('chapter');
}
function startStory(id, keep) {
  F.id = id;
  const s = byId[id];
  if (s.coming) return go('overview', { id });
  if (keep && remembered() && waysFor(s).includes(S.remember) && O.startAsk === 'smart') { F.way = S.remember; F.remember = true; F.length = S.length || 'written'; return startGo(); }
  openSheet('start', { id, fresh: true });
}
let trialSeen = false;
let pendingTrial = null;
function afterTrial(p) {
  trialSeen = true;
  if (p.next === 'recs') return go('recs', { from: 'summons' }, { replace: true });
  if (p.next === 'back') return back();
  if (p.next === 'walk') {
    if (paid() || S.kept === F.id) { S.progress[F.id] = { ch: 2, of: byId[F.id].chapters }; F.ch = 2; return routeWalk(); }
    return go('overview', { id: F.id }, { replace: true });
  }
  if (!S.account && O.reask === 'after' && ['home', 'library', 'start'].includes(p.next)) return go('account', { mode: 're', next: p.next, id: p.id }, { replace: true });
  nextAfter(p);
}
function nextAfter(p) {
  if (p.next === 'start' && p.id) return go('overview', { id: p.id, start: 1 }, { replace: true });
  if (p.next === 'overview' && p.id) return go('overview', { id: p.id }, { replace: true });
  if (p.next === 'library') return go('library', {}, { root: true });
  if (p.next === 'back') return back();
  if (p.next === 'chapter') return go('chapter', {}, { replace: true });
  if (p.next === 'map') return go('map', {}, { root: true });
  firstHome();
}
function firstHome() { S.first = true; go(homeTab(), {}, { root: true }); }
function toRecs() { closeSheet(true); if (O.lockIn === 'replace') return go('lockin'); go('recs', { from: F.id === 'squeaky' ? 'squeaky' : 'squeaky' }); }
function finishWalkToChapter() { const c = current().id; if (['walkmap', 'camera', 'treadmill', 'sofa', 'gemsave', 'gem-who', 'gem-snap'].includes(c)) go('chapter', {}, { replace: true }); else go('chapter'); }
const cur = () => curStory() || S.myList[0] || 'incident';
const indoorWay = () => (S.remember === 'tread' || homeOff() ? 'tread' : O.homeOpt === 'one' ? 'home' : 'sofa');
const QUIET = { '9 pm – 8 am': [21, 8], '10 pm – 7 am': [22, 7], '8 pm – 9 am': [20, 9], None: null };
const inQuiet = (h) => { const q = QUIET[S.rem.quiet]; if (!q) return false; return h >= q[0] || h < q[1]; };
const PAUSE = { '1 Week': 'Nov 11', '2 Weeks': 'Nov 18', 'Until I’m Back': 'you’re back' };

// ---------------------------------------------------------------- actions
const ACT = {
  toast: (el) => toast(el.dataset.t),
  noop: (el) => toast(el.dataset.t ? `${el.dataset.t}: not in this mockup` : 'Not in this mockup'),
  tip: (el) => showTip(el, el.dataset.tip),
  // first landing
  endSummons: () => { S.finished.summons = ['Welcome to the Society']; if (O.trialWhen === 'victory' && !trialSeen && !paid()) return go('trial', { next: 'recs' }); go('recs', { from: 'summons' }, { root: true }); },
  recStart: (el) => { const id = el.dataset.id; if (O.trialWhen === 'recs' && !trialSeen && !paid()) return go('trial', { next: 'start', id }); go('overview', { id, start: 1 }); },
  recsLibrary: () => {
    if (current().p.from === 'squeaky') return O.lockIn === 'follow' ? go('lockin') : go('library', {}, { root: true });
    if (O.trialWhen !== 'victory' && !trialSeen && !paid()) return go('trial', { next: 'library' });
    afterTrial({ next: 'library' });
  },
  trialYes: () => { S.member = 'trial'; S.trialLeft = +O.trial; toast(TRIAL.started); pendingTrial = current().p; if (!S.notif) return openSheet('trialNotif'); afterTrial(pendingTrial); },
  trialNotif: (el) => { S.notif = el.dataset.v === '1'; closeSheet(true); toast(S.notif ? 'Done. We’ll remind you 2 days before.' : 'We’ll email you 2 days before.'); afterTrial(pendingTrial || {}); },
  trialNo: () => afterTrial(current().p),
  keepStory: () => { S.kept = F.id; toast(TRIAL.second.kept); afterTrial(current().p); },
  plan: (el) => { S.trialPlan = el.dataset.v; rerender(); },
  whyRow: () => { closeSheet(); toast('Thanks. That changes what we show you next.'); },
  signIn: () => { S.account = true; if (S.member === 'guest') S.member = 'free'; toast(ACCOUNT.done); const p = current().p; if (p.mode === 'pre') return go('recs', { from: 'summons' }); nextAfter(p); },
  signInSheet: () => { S.account = true; if (S.member === 'guest') S.member = 'free'; closeSheet(true); toast(ACCOUNT.done); },
  skipAccount: (el) => { const p = current().p; if (el.dataset.mode === 'pre') return go('recs', { from: 'summons' }); nextAfter(p); },
  // today
  startStory: (el) => { if (together.from === 'start' && current().id === 'lobby' && el.dataset.id === F.id) { together.from = null; return startGo(); } startStory(el.dataset.id); },
  keepGoing: (el) => { S.away = 0; const id = el.dataset.id || cur(); if (S.progress[id] && (S.bank || 0) >= stepsFor(byId[id])) return ACT.readOpened(el); startStory(id, true); },
  flip: (el) => {
    const d = el.dataset.do;
    if (d === 'dismiss') { S.flipDismissed = true; return rerender(); }
    if (d === 'later') { S.flipDismissed = true; toast('Okay. We’ll check again later today.'); return rerender(); }
    if (d === 'shade') return go('routes', { id: cur() });
    // homePlay off: the indoor button is the treadmill / pad: today's walk on the pad, or the story on it
    if (d === 'pad' && !S.whimsyDone && O.cadence !== 'three') { S.walkVer = 'pad'; whimsy.start(walkIdFor(), 'pad'); return go('whimsy-play'); }
    // Play Indoors starts today's At Home walk, the door just below it (pass 2: Gord)
    if (d === 'indoor' && !S.whimsyDone && O.cadence !== 'three') { S.walkVer = 'home'; whimsy.start(walkIdFor(), 'home'); return go('whimsy-play'); }
    const id = cur(); F.id = id;
    const way = d === 'indoor' ? indoorWay() : d === 'pad' ? 'tread' : d === 'sofa' ? (O.homeOpt === 'one' ? 'home' : 'sofa') : 'door';
    openSheet('start', { id, fresh: true, way });
    F.way = waysFor(byId[id]).includes(way) ? way : F.way;
    if (d === 'short') { F.length = 'short'; S.length = 'short'; S.scale = 0.5; }
    openSheet('start', { id });
    if (d === 'lit') toast('Lit streets you know. Your route will stay on them.');
    if (d === 'light') toast('Bright clothes, a light, facing traffic. Enjoy it.');
  },
  remindHour: () => { if (O.remindLater === 'pick') return openSheet('remindPick'); if (inQuiet(Math.floor(S.hour) + 1)) return toast(TODAY.remindQuiet); toast(TODAY.reminded); },
  remindAt: (el) => { const t = LOOPS.remindTimes.find((x) => x.id === el.dataset.v); S.remindAt = t.id; closeSheet(true); toast(LOOPS.remindSet(t.t)); },
  // Low energy skips the rest: straight to a 1-minute mission or one short story (Melissa, Nov 4; Sky test)
  fit: (el) => { const k = el.dataset.k; fits[k] = k === 'time' ? +el.dataset.v : el.dataset.v; if (k === 'energy' && el.dataset.v === 'low') fits.shown = true; openSheet('fits'); },
  fitsGo: () => { fits.shown = true; openSheet('fits'); },
  fitsAgain: () => { fits.shown = false; if (fits.energy === 'low') fits.energy = 'stroll'; openSheet('fits'); },
  // the door picks the version from How I play, weather and time; rain and dark ask first (loops build 9)
  whimsyGo: (el) => {
    const id = (el && el.dataset.id) || walkIdFor(); pendingWalk = id;
    const short = !!(el && el.dataset.short);
    const ver = verFor(id, short), indoor = walkDef(id).indoor;
    // indoor walks (Mall Lap) never ask about rain or the dark (pass 2: Rosa, Sky)
    if (!indoor && ver === 'out' && (isDark() || (daylightLeft() > 0 && daylightLeft() < 30))) return openSheet('whimsyDark', { to: 'whimsy-play' });
    if (!indoor && ver === 'out' && ['rain', 'storm', 'snow', 'cold'].includes(weatherKind())) return openSheet('whimsyRain', { id });
    closeSheet(true); whimsy.start(id, ver, short); go('whimsy-play');
  },
  rainGo: (el) => { const v = ['home', 'pad'].includes(el.dataset.v) ? el.dataset.v : 'out'; closeSheet(true); if (v !== 'out') S.walkVer = v; whimsy.start(pendingWalk, v); go('whimsy-play'); },
  rouletteGo: (el) => { roulette.t = null; roulette.i = 0; roulette.turns = []; roulette.preset = +(el && el.dataset.min) || null; roulette.toward = (el && el.dataset.toward) || ''; if (isDark() || (daylightLeft() > 0 && daylightLeft() < 30)) return openSheet('whimsyDark', { to: 'roulette' }); roulette.home = false; go('roulette'); },
  darkGo: (el) => { const v = el.dataset.v, home = v === 'home'; closeSheet(true); if (el.dataset.to === 'roulette') { roulette.home = home; go('roulette'); } else { whimsy.start(pendingWalk, home ? 'home' : v === 'out' ? 'out' : 'lit'); go('whimsy-play'); } },
  // start sheet
  way: (el) => { F.way = el.dataset.v; openSheet('start', { id: F.id }); },
  len: (el) => { F.length = el.dataset.v; S.length = el.dataset.v; if (el.dataset.rr) { toast(el.dataset.v === 'short' ? 'Shorter walks from here on.' : 'Longer walks from here on.'); return rerender(); } openSheet('start', { id: F.id }); },
  lenMin: (el) => { F.time = +el.dataset.v; openSheet('start', { id: F.id }); },
  timeFirst: (el) => { F.time = +el.dataset.v; F.length = F.time <= 15 ? 'short' : F.time >= 60 ? 'long' : 'written'; S.length = F.length; openSheet('start', { id: F.id }); },
  routeLen: (el) => { F.route = el.dataset.v; openSheet('start', { id: F.id }); },
  radius: (el) => { F.radius = +el.dataset.v; openSheet('start', { id: F.id }); },
  loopBack: () => { F.way = 'route'; F.route = '1loop'; startGo(); },
  custom: () => { F.custom = !F.custom; openSheet('start', { id: F.id }); },
  // Play Together inside the start sheet (Melissa, Nov 5): Start Together opens the same Play Together sheet
  startWho: (el) => { F.together = el.dataset.v === 'together'; openSheet('start', { id: F.id }); },
  startTogether: (el) => { together.from = 'start'; openSheet('together', { id: el.dataset.id || F.id }); },
  ovTogether: (el) => { F.id = el.dataset.id; openSheet('start', { id: el.dataset.id, fresh: true, together: 1 }); },
  startGo: () => startGo(),
  // routes
  routeUse: () => { F.way = 'route'; F.mode = 'path'; routesCook.reset(); if (!S.progress[F.id]) { S.progress[F.id] = { ch: Math.max(2, F.ch), of: byId[F.id].chapters }; F.ch = Math.max(2, F.ch); } go('walkmap', {}, { replace: true }); },
  routeAgain: () => { routesCook.reset(); render(); },
  // map tab
  mapFilter: (el) => { mapUI.filter = el.dataset.v; rerender(); },
  fogToggle: () => { mapUI.toggleFog(); rerender(); },
  satToggle: () => { S.mapSat = !S.mapSat; toast(S.mapSat ? 'Satellite view on.' : 'Map view on.'); rerender(); },
  fogLook: (el) => { O.fogLook = el.dataset.v; saveOpts(); closeSheet(); rerender(); },
  mapDrawer: (el) => { const d = el.closest('.mapdrawer'); const open = d.classList.toggle('open'); el.setAttribute('aria-expanded', open); el.querySelector('.dr-more').textContent = open ? 'Less' : 'More'; mapUI.drawer = open; },
  recenter: () => toast('Centred on you. Your home stays hidden.'),
  moveStop: () => { closeSheet(); toast(SHEETS_W.moveDone); },
  reportDone: () => { closeSheet(); toast(SHEETS_W.reportDone); },
  // library
  libView: (el) => { O.libView = el.dataset.v || 'shelves'; saveOpts(); rerender(); },
  // feed cards keep their scroll spot, so these update in place instead of re-rendering
  fheart: (el) => { const id = el.dataset.id; const i = S.myList.indexOf(id); if (i >= 0) S.myList.splice(i, 1); else S.myList.push(id); el.setAttribute('aria-pressed', i < 0); toast(i >= 0 ? WISH.off : WISH.on); },
  vo: (el) => { const on = !el.classList.contains('playing'); document.querySelectorAll('.vo.playing').forEach((b) => b.classList.remove('playing')); el.classList.toggle('playing', on); if (on) { toast(LIBRARY.feedPlaying(el.dataset.who)); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('playing'), 6000); } },
  // Empty energy skips stories altogether: Shoes On helps you get out the door (Melissa, Nov 4)
  helpPick: (el) => { if (el.dataset.v === 'empty') { S.energyNone = true; shoes.reset(); return go('shoes'); } fits.energy = el.dataset.v || 'stroll'; fits.shown = el.dataset.v === 'low'; openSheet('fits'); },
  shoeStep: () => {
    // Door Open counts: the day lights up, a seal, a doorway doodle (pass 2: Sky)
    if (shoes.next() === 3) { countWalk({ steps: 20, home: true }); shoes.res = pressSeal(1); S.doorDone = true; }
    rerender();
  },
  fitUnit: (el) => { fits.unit = el.dataset.v; openSheet('fits'); },
  comingNav: (el) => { coming.step(+el.dataset.d); rerender(); },
  ideaTab: (el) => { ideasUI.tab = el.dataset.v; openSheet('ideas'); },
  ideaCat: (el) => { S.ideaCat = el.dataset.v; const t = document.getElementById('ideaText'); const keep = t ? t.value : ''; openSheet('ideas'); const t2 = document.getElementById('ideaText'); if (t2) t2.value = keep; },
  ideaSend: () => { const t = document.getElementById('ideaText'); if (!t || !t.value.trim()) { toast('Write your idea first.'); return; } ideasUI.sent(); openSheet('ideas'); },
  ideaAgain: () => { ideasUI.reset(); openSheet('ideas'); },
  ideaVote: (el) => { S.ideaVotes = S.ideaVotes || []; const i = S.ideaVotes.indexOf(el.dataset.v); if (i >= 0) S.ideaVotes.splice(i, 1); else S.ideaVotes.push(el.dataset.v); openSheet('ideas'); },
  wtJoinScan: () => { closeSheet(); toast('Joined BEACON. Ama’s walk is starting.'); },
  wtJoinType: () => { const t = document.getElementById('wtWord'); const w = t ? t.value.trim().toUpperCase() : ''; if (!/^[A-Z]{6}$/.test(w)) { toast('Walk codes are one 6-letter word.'); return; } closeSheet(); toast(`Joined ${w}.`); },
  youTab: (el) => { youUI.tab = el.dataset.v; rerender(); },
  libBy: (el) => { lib.by = el.dataset.v; rerender(); },
  libClear: () => { lib.q = ''; rerender(); },
  mood: (el) => { lib.q = el.dataset.v; rerender(); },
  libFilter: (el) => { lib.f = lib.f === el.dataset.v ? null : el.dataset.v; rerender(); },
  swipe: (el) => { lib.swipe(+el.dataset.d); rerender(); },
  // feed, friends, creators
  cheer: (el) => { feedCheer(+el.dataset.i); rerender(); },
  notify: () => toast(FEED.notified),
  follow: () => toast('Following. New stories from them land in your Feed.'),
  // you, settings, reminders
  manageSub: () => toast('Opens the App Store subscription page.'),
  forget: () => { S.remember = null; toast('We’ll ask each time.'); rerender(); },
  pickTime: (el) => { S.rem.time = el.dataset.v; S.lockedTime = el.dataset.v; rerender(); },
  day: (el) => { const i = +el.dataset.i; S.rem.days[i] = S.rem.days[i] ? 0 : 1; el.setAttribute('aria-pressed', !!S.rem.days[i]); },
  away: (el) => { S.rem.paused = PAUSE[el.dataset.v] || 'you’re back'; toast(REMIND.awaySet(el.dataset.v)); rerender(); },
  resume: () => { S.rem.paused = null; toast(REMIND.resumed); rerender(); },
  // whimsy, roulette, mission, doorstep
  cat: () => { whimsy.cat(); rerender(); },
  wpCount: () => { whimsy.cat(); rerender(); },
  wpMark: (el) => { whimsy.mark(+el.dataset.v); rerender(); },
  wpRate: (el) => { whimsy.rate(+el.dataset.v); rerender(); },
  wpHear: (el) => { whimsy.hear(el.dataset.v); rerender(); },
  // everything counts: steps, This Week, today's dot, fog; one seal a day (loops build 2 + 4)
  whimsyFinish: (el) => {
    const w = whimsy.st, d = walkDef(w.id), home = w.ver === 'home';
    const per = { cat: 190, bingo: 150, lights: 120, mall: 160, abc: 140, ear: 130, twin: 170 }[w.id] || 150;
    const steps = w.n ? (home ? w.n * 40 : w.n * per + 260) : 0;
    const mins = w.n ? Math.max(home ? 4 : 5, home ? w.n * 2 : Math.max(wpMins(), Math.round(steps / 100))) : 0;
    if (w.n) countWalk({ steps, home: home || w.ver === 'pad' });
    const res = pressSeal(w.n);
    const wt = S.wt ? S.wt.people.slice() : null;
    if (w.id === walkIdFor() && w.n) { S.whimsyDone = true; S.myDoodle = { n: w.n, ver: w.ver, id: w.id, wt: wt ? wt.join(' & ') : null, cols: wt ? ['#BED13F', '#35C6D7', '#FF4F79', '#F5B82E', '#C49BFF', '#00CD9D', '#FA7423', '#5B8CFF'].slice(0, wt.length) : null }; }
    S.wt = null;
    go('whimsy-end', { id: w.id, n: w.n, steps, mins, ver: w.ver, res, name: d.name, wt, via: el && el.dataset && el.dataset.home ? 'home' : null }, { replace: true });
  },
  // walked steps opened the chapter: read it now (pass 2: Rosa)
  readOpened: (el) => {
    const id = (el && el.dataset.id) || cur(); const s = byId[id]; const pr = S.progress[id];
    if (!pr) return startStory(id, true);
    S.bank = Math.max(0, (S.bank || 0) - stepsFor(s)); S.away = 0;
    Object.assign(F, { id, ch: pr.ch, way: remembered() || 'door' }); S.lastStory = id;
    go('chapter');
  },
  endGem: (el) => {
    const p = current().p;
    if (el.dataset.v === '1') {
      const home = p.ver === 'home';
      const at = { x: home ? 236 : 150 + (S.gems.length % 4) * 18, y: home ? 274 : 210 + (S.gems.length % 3) * 16 };
      S.gems.push({ id: 'g' + Date.now(), type: 'curio', name: `End of the ${p.id === 'roulette' ? 'Route Roulette' : walkDef(p.id).name}`, ...at, mine: true, priv: true, vis: 'me', vibes: [], from: p.id === 'roulette' ? 'Route Roulette' : walkDef(p.id).name, note: '', savedDay: S.day });
      S.week.gems++; p.gem = 'saved';
    } else p.gem = 'no';
    rerender();
  },
  cheerD: (el) => { const k = el.dataset.k; S.cheeredD[k] = !S.cheeredD[k]; if (el.dataset.re) { rerender(); return openSheet('doodleFriend', JSON.parse(el.dataset.re)); } rerender(); },
  // set replies on a friend's doodle, and Cheer Back from the Since card (pass 2: distance, lowtech)
  sticker: (el) => { S.stickers[el.dataset.k] = el.dataset.v; toast(LOOPS.stickerSent(firstName(el.dataset.who))); rerender(); openSheet('doodleFriend', JSON.parse(el.dataset.re)); },
  cheerBack: (el) => { const who = el.dataset.v; S.cheerBacks[who] = S.cheerBacks[who] === S.day ? null : S.day; if (S.cheerBacks[who]) toast(LOOPS.cheeredBack(firstName(who))); rerender(); },
  showAllD: () => { S.showAllD = !S.showAllD; rerender(); },
  sendTo: (el) => { closeSheet(); toast(LOOPS.sendTo(el.dataset.v)); },
  appShare: (el) => { closeSheet(); toast(LOOPS.appSent(el.dataset.v)); },
  storySize: () => { closeSheet(); toast(LOOPS.storySizeDone); },
  frNow: () => { S.frNow = !S.frNow; openSheet('friend'); },
  // Get Out the Door: the low-energy door, and Door Open counts (pass 2: Sky)
  shoesGo: () => { shoes.reset(); go('shoes'); },
  // Walk Together: 2–8 phones (groups blocker)
  wtOpen: (el) => { Object.assign(wtUI, { kind: el.dataset.v || 'whimsy', n: el.dataset.with ? 2 : Math.min(8, Math.max(2, S.friends.length + 1)), letIn: [], with: el.dataset.with || null, code: null }); closeSheet(true); go('wt-lobby'); },
  wtN: (el) => { wtUI.n = +el.dataset.v; wtUI.letIn = wtUI.letIn.slice(0, wtUI.n - 1); rerender(); },
  wtLetIn: (el) => { if (!wtUI.letIn.includes(el.dataset.v)) wtUI.letIn.push(el.dataset.v); rerender(); },
  wtGo: () => {
    S.wt = { kind: wtUI.kind, people: [hasNameLocal(), ...wtUI.letIn] };
    if (wtUI.kind === 'roulette') { roulette.t = null; roulette.i = 0; roulette.turns = []; roulette.home = false; return go('roulette', {}, { replace: true }); }
    const id = walkIdFor(); whimsy.start(id, verFor(id)); go('whimsy-play', {}, { replace: true });
  },
  sinceGot: () => { S.sinceGot = true; rerender(); },
  // Today's feature nudges: used or hidden once, never shown again (Melissa, Nov 5)
  nudge: (el) => { const d = el.dataset; (S.nudges || (S.nudges = {}))[d.k] = 1; if (d.x) return rerender(); if (d.then && ACT[d.then]) return ACT[d.then](el); if (d.open) { rerender(); return openSheet(d.open); } rerender(); },
  actOpen: (el) => {
    const a = S.activity.find((x) => x.id === el.dataset.id); if (!a) return;
    closeSheet(true);
    if (a.kind === 'nameit' && a.gem) return go('gemsave', { edit: a.gem, focusName: 1 });
    if (a.gem && S.gems.some((g) => g.id === a.gem && !g.hidden)) return go('gem-view', { id: a.gem });
    if (a.kind === 'doodle' || a.kind === 'friends') return ACT.whimsyGo(null);
  },
  // friends: a working Enter a Code (loops build 5)
  frCode: () => {
    const i = $('#frcode'); const v = (i ? i.value : frUI.input).trim(); frUI.input = v; frUI.confirm = null;
    const name = codeName(v);
    if (!name) frUI.err = LOOPS.friend.bad;
    else if (v.toUpperCase().replace(/\s/g, '') === myCode()) frUI.err = LOOPS.friend.self;
    else if (S.friends.some((f) => f.split(' ')[0].toLowerCase() === name.toLowerCase())) frUI.err = LOOPS.friend.already(name);
    else { frUI.err = ''; frUI.confirm = name; }
    openSheet('friend');
  },
  frTry: (el) => { const i = $('#frcode'); if (i) i.value = el.dataset.v; frUI.input = el.dataset.v; ACT.frCode(); },
  frAdd: () => {
    const n = frUI.confirm; Object.assign(frUI, { input: '', confirm: null, err: '' });
    // side by side: friends at once, so Sam is in Share, the lobby and Around you tonight (pass 2: groups)
    if (S.frNow && n) { if (!S.friends.includes(n)) S.friends.push(n); S.added = [...(S.added || []), n]; S.pending = S.pending.filter((x) => x !== n); logAct('friend', LOOPS.act.instant(n), { who: n }); rerender(); openSheet('friend'); return toast(`${n}’s in. You’re friends now.`); }
    if (n && !S.pending.includes(n)) S.pending.push(n); openSheet('friend'); toast(LOOPS.friend.sent(n, pronoun(n)));
  },
  frNo: () => { Object.assign(frUI, { input: '', confirm: null, err: '' }); openSheet('friend'); },
  frReset: () => { S.codeN++; openSheet('friend'); toast(LOOPS.friend.resetDone); },
  rlWhere: (el) => { roulette.home = el.dataset.v === 'home'; rerender(); },
  rlTime: (el) => { roulette.t = +el.dataset.v; roulette.i = 0; roulette.turns = rlTurns(roulette.t, roulette.home); rerender(); },
  rlNext: () => { roulette.i++; rerender(); },
  // Roulette ends on the same walk-end screen, with a doodle and the day's seal (loops must-fix 10)
  rlDone: (el) => {
    const t = roulette.t, home = roulette.home, total = roulette.turns.length || 5;
    const via = el && el.dataset && el.dataset.home ? 'home' : null;
    const n = Math.max(1, roulette.i);
    // heading home early still counts, scaled to how far you got
    const frac = via ? Math.max(0.2, roulette.i / total) : 1;
    const steps = home ? n * 60 : Math.round(t * 95 * frac);
    roulette.t = null; closeSheet(true);
    countWalk({ steps, home });
    const res = pressSeal(n);
    const wt = S.wt ? S.wt.people.slice() : null; S.wt = null;
    go('whimsy-end', { id: 'roulette', n, steps, mins: home ? Math.max(5, n * 2) : Math.round(t * frac), ver: home ? 'home' : 'out', res, wt, via }, { replace: true });
  },
  mSnap: () => { mission.snap = true; mission.kept = null; S.missionDone = true; S.away = 0; countWalk({ steps: 60, home: true }); mission.seal = pressSeal(1); rerender(); },
  mKeep: (el) => { mission.kept = el.dataset.v === '1'; const m = missionSteps(); if (mission.kept) { S.gems.push({ id: 'gm' + Date.now(), type: m.gem || 'nature', name: m.gemName || 'Something green', x: 250, y: 280, mine: true, priv: true, vis: 'me', vibes: ['Tiny'], from: 'A 1-minute mission', savedDay: S.day }); S.week.gems++; toast(GEMS.created); } rerender(); },
  bird: () => { doorstep.n++; const n = $('#dsn'); if (n) n.textContent = doorstep.n; },
  goMenu: (el) => { const v = el.dataset.v; closeSheet(true); if (v === 'continue') startStory(cur(), true); else if (v === 'fits') openSheet('fits'); else if (v === 'gem') { resetGemForm(); go('gemsave'); } else go('whimsy-play'); },
  // in-story map
  mode: (el) => { if (el.dataset.tip) return showTip(el, el.dataset.tip); if (F.mode === el.dataset.m) return; F.carry = walkState.f; F.mode = el.dataset.m; rerender(); },
  huntPhoto: () => { cam.reset(); go('camera'); },
  snap: () => { cam.snap(); rerender(); },
  retake: () => { cam.retake(); rerender(); },
  noCam: () => { cam.noCam(); rerender(); },
  sendIt: () => { openSheet('saveGemQ'); },
  openChapter: () => { closeSheet(true); finishWalkToChapter(); },
  arrive: () => { if (current().id === 'walkmap') arrive(); else { closeSheet(true); finishWalkToChapter(); } },
  stopHere: () => {
    const s = byId[F.id]; const onBreak = current().id === 'break';
    const ch = onBreak ? F.ch + 1 : F.ch;
    S.progress[s.id] = { ch, of: s.id === 'squeaky' ? 5 : s.chapters }; S.lastStory = s.id;
    toast(WALKMAP.stopped(ch)); go(homeTab(), {}, { root: true });
  },
  finishHome: () => { if (homeOff()) return; const g = goalFor(); F.carryHome = [Math.round(g * walkState.f), g]; F.way = indoorWay() === 'tread' ? 'sofa' : indoorWay(); go('sofa', {}, { replace: true }); },
  mockAhead: () => { walkState.f = Math.max(walkState.f, 0.94); walkState.located = true; },
  mockGps: () => mockGps(),
  mockClosed: () => { const c = $('#closedcard'); if (c) c.hidden = false; },
  swapStop: () => { const c = $('#closedcard'); if (c) c.hidden = true; toast(SHEETS_W.moveDone); },
  perm: (el) => { const v = el.dataset.v; if (v === 'no' && O.locRefused === 'push' && currentSheet().id !== 'permPush') return openSheet('permPush'); S.perm = true; closeSheet(); if (v !== 'use') toast(PERMISSION.refusedSteps); },
  toSofa: () => { if (homeOff()) return ACT.toTread(); closeSheet(true); F.way = 'sofa'; go('sofa', {}, { replace: current().id === 'walkmap' }); },
  useSteps: () => { closeSheet(); toast(PERMISSION.refusedSteps); },
  tipsOffSheet: () => { S.tips = false; closeSheet(); toast('Tips off. Turn them back on in Settings.'); },
  tspeed: (el) => { tread.speed = +el.dataset.v; $$('.seg [data-act="tspeed"]').forEach((b) => { const on = +b.dataset.v === tread.speed; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); }); },
  tpause: (el) => { tread.paused = !tread.paused; el.textContent = tread.paused ? 'Resume' : 'Pause'; },
  tdone: () => finishWalkToChapter(),
  toTread: () => { F.way = 'tread'; go('treadmill', {}, { replace: true }); },
  sofaDone: () => finishWalkToChapter(),
  eyesUp: () => toast(WALKMAP.eyesUp),
  // gems: the whole flow lives in gems.js (GEM_ACT, merged below)
  // reader + breaks
  choice: (el) => {
    const s = byId[F.id], i = +el.dataset.i;
    S.away = 0; S.lastStory = s.id;
    if (s.id === 'squeaky' && SQUEAKY.chapters[F.ch]) {
      const ch = SQUEAKY.chapters[F.ch];
      if (i === 1) return toast('Fire Hydrant: “A toy? Round, squeaky, slightly chewed? Never seen it. Try the playground.”');
      if (ch.ending) { delete S.progress.squeaky; S.finished.squeaky = [ch.ending.name]; return go('ending', {}, { replace: true }); }
      if (F.ch === 1 && !paid() && !s.free && S.kept !== s.id) return go('trial', { next: 'walk', second: trialSeen, cliff: `${s.title}: chapter 2 is a short walk away. Someone’s waiting.` });
      S.progress.squeaky = { ch: F.ch, of: 5 }; S.week.chapters++;
      return go('break', {}, { replace: true });
    }
    if (F.ch === 1) {
      if (!paid() && !s.free && S.kept !== s.id) return go('trial', { next: 'walk', second: trialSeen, cliff: `${s.title}: chapter 2 is a short walk away. Someone’s waiting.` });
      S.progress[s.id] = { ch: 2, of: s.chapters }; F.ch = 2; return routeWalk();
    }
    if (F.ch >= (s.chapters || 3)) { delete S.progress[s.id]; S.finished[s.id] = [s.id === 'summons' ? 'Welcome to the Society' : `Ending 1 of ${s.endings}`]; return go('ending', {}, { replace: true }); }
    S.progress[s.id] = { ch: F.ch, of: s.chapters };
    go('break', {}, { replace: true });
  },
  breakKeep: () => { F.ch++; const s = byId[F.id]; S.progress[s.id] = { ch: F.ch, of: s.id === 'squeaky' ? 5 : s.chapters }; routeWalk(); },
  favour: () => { S.favour = true; S.favourSeen[F.id + F.ch] = true; toast(BREAK.favourDone); rerender(); },
  endStory: () => { if (O.storyEnd === 'optin') return openSheet('postcardQ'); if (O.storyEnd === 'stats') return go('postcard', { id: F.id, next: 1 }); toRecs(); },
  findAnother: (el) => { const id = el.dataset.id || F.id; const s = byId[id]; F.id = id; F.ch = id === 'squeaky' ? 5 : Math.max(1, (s.chapters || 3)); F.way = F.way || 'door'; toast('Back at your last choice. Pick the other way.'); go('chapter'); },
  toRecs: () => toRecs(),
  savePc: (el) => { S.postcards++; toast(POSTCARD.saved); if (el.dataset.next) return toRecs(); back(); },
  pcDone: () => back(),
  sharePc: () => toast('Share sheet opens. Start and end of the route are trimmed.'),
  lockIn: () => { const t = LOCKIN_TIMES.find((x) => x.id === (S.rem.time || 'lunch')) || LOCKIN_TIMES[1]; S.rem.time = t.id; S.lockedTime = t.id; toast(LOCKIN.set(t.s)); if (!S.notif) return openSheet('notifAsk'); go(homeTab(), {}, { root: true }); },
  notifYes: () => { S.notif = true; closeSheet(true); toast('Done. One nudge, at the time you picked.'); go(homeTab(), {}, { root: true }); },
  notifNo: () => { closeSheet(true); go(homeTab(), {}, { root: true }); },
  // comeback, together, overview
  comeSofa: () => { if (homeOff()) return startStory(cur(), false); const id = cur(); F.id = id; F.ch = (S.progress[id] || { ch: 3 }).ch; F.way = 'sofa'; F.carryHome = null; go('sofa'); },
  comeWalk: () => startStory(cur(), false),
  ptN: (el) => { together.n = el.dataset.v; openSheet('together', { id: el.dataset.id }); },
  ptPhones: (el) => { together.phones = el.dataset.v; openSheet('together', { id: el.dataset.id }); },
  ptStart: (el) => { closeSheet(true); S.ptLetIn = false; if (together.phones === 'each') return go('lobby', { id: el.dataset.id }); if (together.from === 'start' && el.dataset.id === F.id) { together.from = null; return startGo(); } startStory(el.dataset.id); },
  letIn: () => { S.ptLetIn = true; rerender(); },
  heart: (el) => { const id = el.dataset.id; const i = S.myList.indexOf(id); if (i >= 0) S.myList.splice(i, 1); else S.myList.push(id); toast(i >= 0 ? WISH.off : WISH.on); rerender(); },
  // the heart on a poster: toggles the Wish List on the spot, never opens the story (Melissa, Nov 5)
  cardHeart: (el, e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const id = el.dataset.id; const i = S.myList.indexOf(id); if (i >= 0) S.myList.splice(i, 1); else S.myList.push(id);
    toast(i >= 0 ? WISH.off : WISH.on);
    // redraw (the Wish List shelf changes) but keep every shelf where it was scrolled to
    const keep = {}; $$('#screen .shelf-sec').forEach((sec) => { const h = sec.querySelector('h2'); const r = sec.querySelector('.row-scroll'); if (h && r) keep[h.textContent] = r.scrollLeft; });
    rerender();
    $$('#screen .shelf-sec').forEach((sec) => { const h = sec.querySelector('h2'); const r = sec.querySelector('.row-scroll'); if (h && r && keep[h.textContent]) r.scrollLeft = keep[h.textContent]; });
  },
  download: (el) => { if (S.lowData || S.loc === 'far' || S.loc === 'rural') return openSheet('dlAsk', { id: el.dataset.id }); doDownload(el.dataset.id); },
  dlWait: () => { closeSheet(); toast('Queued. It downloads next time you’re on Wi-Fi.'); },
  dlNow: (el) => { closeSheet(true); doDownload(el.dataset.id); },
  tipNext: (el, e) => { e.stopPropagation(); tips.next(); rerender(); },
  tipsOff: (el, e) => { e.stopPropagation(); tips.off(); rerender(); },
  // problems and fixes
  showMe: (el) => showMe(+el.dataset.i),
  probFilter: (el) => { probUI.filter = el.dataset.v; rerender(); },
  probClose: () => { S.fromProblems = false; go(homeTab(), {}, { root: true }); },
  fixBack: () => openProblems(),
};
Object.assign(ACT, GEM_ACT);
let pendingWalk = null;
function doDownload(id) { S.downloads++; S.downloadedIds = (S.downloadedIds || []).concat(id); toast(OVERVIEW.dlDone(S.lowData ? 2 : 42)); rerender(); }

// ---------------------------------------------------------------- toggles and selects
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset.remtime !== undefined) { S.rem.time = 'custom'; S.rem.custom = t.value; toast(`Saved: ${t.value}`); return rerender(); }
  if (t.dataset.tg) {
    const k = t.dataset.tg, on = t.checked;
    if (k === 'remember') { F.remember = on; return; }
    if (k === 'kids') { F.kids = on; return openSheet('start', { id: F.id }); }
    if (k === 'tips') S.tips = on;
    if (k === 'motion') { S.motion = on; drawShell({ tab: null }); }
    if (k === 'eyes') S.eyes = on;
    if (k === 'lowData') S.lowData = on;
    if (k === 'lowAudio') S.lowAudio = on;
    if (k === 'storyOnly') { S.storyOnly = on; rerender(); }
    if (k === 'count') { S.storyOnly = !on; rerender(); }
    if (k === 'pushes') { S.pushes = on; }
    if (k === 'fogTab') { S.fogTabOn = on; mapUI.sync(); }
    if (k === 'fogStory') { O.fogWhere = on ? 'everywhere' : 'home'; saveOpts(); }
    if (k === 'remOn') { S.rem.on = on; return rerender(); }
    if (k === 'hideHome') { S.hideHome = on; toast(SETTINGSAVED); return rerender(); }
    if (k === 'gemSeason') { gemForm.season = on; return; }
    toast(SETTINGSAVED);
    return;
  }
  if (t.dataset.sel) {
    const k = t.dataset.sel, v = t.value;
    if (k === 'textSize') { S.textSize = v; rerender(); }
    if (k === 'goal' && v !== 'Custom') { S.goal = +v.replace(/,/g, ''); rerender(); }
    if (k === 'showAs') { S.showAs = v.toLowerCase(); }
    if (k === 'unit') { S.miles = /Miles/.test(v); }
    if (k === 'who') S.friendsOnly = v === 'Friends Only';
    if (k === 'budget') S.rem.budget = v;
    if (k === 'quiet') S.rem.quiet = v;
    toast(SETTINGSAVED);
  }
});
const SETTINGSAVED = 'Saved';
const WISH = { on: 'Added to your Wish List.', off: 'Removed from your Wish List.' };

// ---------------------------------------------------------------- one click handler
document.addEventListener('click', (e) => {
  const tipEl = $('#tip'); if (tipEl && !tipEl.hidden && !e.target.closest('[data-tip]')) tipEl.hidden = true;
  const el = e.target.closest('[data-act],[data-go],[data-back],[data-sheet],[data-close],[data-tab],[data-gem],[data-pin],[data-rig],[data-opt],[data-journey],[data-jump]');
  if (!el) return;
  if (el.dataset.rig) return rig(el.dataset.rig);
  if (el.dataset.opt) return setOpt(el.dataset.opt, el.dataset.v);
  if (el.dataset.journey) { S.fromProblems = false; return journey(el.dataset.journey); }
  if (el.dataset.jump) { closeSheet(true); const [id, p, sheet, sp] = JUMPS[el.dataset.jump]; prep(id); go(id, p || {}); if (sheet) later(() => openSheet(sheet, sp || {}), 60); return; }
  if (el.dataset.close !== undefined) return closeSheet();
  if (el.dataset.back !== undefined) return back();
  if (el.dataset.tab) { S.first = S.first && el.dataset.tab === homeTab(); return go(el.dataset.tab, {}, { root: true }); }
  if (el.dataset.gem) return openSheet('gem', { id: el.dataset.gem });
  if (el.dataset.pin) return openSheet('pin', { id: el.dataset.pin });
  if (el.dataset.act) { const fn = ACT[el.dataset.act]; if (fn) { e.preventDefault(); fn(el, e); } else console.warn('no action', el.dataset.act); if (el.dataset.go === undefined) return; }
  if (el.dataset.sheet) { let p = {}; try { p = el.dataset.p ? JSON.parse(el.dataset.p) : {}; } catch (x) {} return openSheet(el.dataset.sheet, p); }
  if (el.dataset.go) {
    let p = {}; try { p = el.dataset.p ? JSON.parse(el.dataset.p) : {}; } catch (x) {}
    if (el.dataset.id) p.id = el.dataset.id;
    prep(el.dataset.go);
    go(el.dataset.go, p, { root: !!el.dataset.root });
  }
});
// reset per-visit state for screens that keep their own
function prep(id) {
  if (id === 'mission') { mission.steps = 0; mission.snap = false; mission.kept = null; mission.seal = null; }
  if (id === 'doorstep') { doorstep.n = 0; doorstep.t = 60; doorstep.seal = null; doorstep.onDone = () => { countWalk({ steps: 20, home: true }); doorstep.seal = pressSeal(doorstep.n); }; }
  if (id === 'whimsy-play') whimsy.start();
  if (id === 'roulette') { roulette.t = null; roulette.i = 0; }
  if (id === 'camera') cam.reset();
  if (id === 'routes') routesCook.reset();
  if (id === 'gemsave' || id === 'gem-snap' || id === 'gem-who') resetGemForm();
  if (id === 'linked') tips.reset();
  if (id === 'map') mapUI.sync();
}
// keyboard: Esc closes; Enter/Space on SVG buttons
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { const t = $('#tip'); if (t && !t.hidden) { t.hidden = true; return; } if (sheetIsOpen()) { closeSheet(); return; } }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-gem],[data-pin],[data-stop]')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
});
$('#scrim').addEventListener('click', () => closeSheet());
// long-press a stop on the chapter map: move or report it
let lp;
document.addEventListener('pointerdown', (e) => { const st = e.target.closest('[data-stop]'); if (!st) return; lp = setTimeout(() => openSheet('stop'), 550); });
['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => document.addEventListener(ev, () => clearTimeout(lp)));
document.addEventListener('click', (e) => { if (e.target.closest('[data-stop]')) openSheet('stop'); });
regSheet('stop', () => ({
  jewel: '#5B8CFF', label: SHEETS_W.reportK,
  html: `<p class="kicker">${esc(SHEETS_W.reportK)}</p><h3>${esc(WALKMAP.safety)}</h3><p class="more">${esc(ROUTES.publicOnly)}</p><div class="btns"><button class="btn ghost" data-act="moveStop">${ic('move')} ${esc(MAP.moveStop)}</button><button class="btn ghost" data-sheet="report">${ic('flag')} ${esc(MAP.report)}</button></div><p class="solves">solves: unsafe, private or closed stops (F1, F2, F5)</p>`,
}));

// ---------------------------------------------------------------- reviewer rig
function rig(what) {
  if (what === 'reviewer') {
    const on = !document.body.classList.contains('reviewer');
    document.body.classList.toggle('reviewer', on);
    $('#rigRev').setAttribute('aria-pressed', on);
    saveOpts(); toast(on ? 'Reviewer mode on' : 'Reviewer mode off');
    return;
  }
  if (what === 'journeys') return openSheet('journeys');
  if (what === 'nextDay') { closeSheet(true); nextDay(); whimsy.start(); fits.shown = false; frUI.confirm = null; roulette.t = null; go(homeTab(), {}, { root: true }); return toast(`Day ${S.day} · ${S.dow}, ${S.date} · 8:00 am`); }
  if (what === 'later') { closeSheet(true); laterToday(); rerender(); return toast(`Later today · ${fmtTime(S.hour)}`); }
  if (what === 'options') return openSheet('options');
  if (what === 'screens') return openSheet('screens');
  if (what === 'problems') return openProblems();
  if (what === 'resetOpts') { resetOpts(); openSheet('options'); rerender(); toast('Options reset'); }
}
let probScroll = 0;
function openProblems() { closeSheet(true); S.fromProblems = true; go('problems', {}, { root: true }); later(() => { $('#screen').scrollTop = probScroll; }, 30); }
function showMe(i) {
  const p = PROBLEMS[i]; const [j, screen, params, x = {}] = p[7];
  probScroll = $('#screen').scrollTop;
  journey(j, true);
  S.fromProblems = true;
  if (x.progress) Object.assign(S.progress, x.progress);
  if (x.flow) { Object.assign(F, { length: 'written', mode: 'walk', route: null, carry: 0, carryHome: null, remember: false }, x.flow); S.lastStory = x.flow.id; if (!S.progress[x.flow.id] && screen !== 'chapter') S.progress[x.flow.id] = { ch: x.flow.ch, of: x.flow.id === 'squeaky' ? 5 : byId[x.flow.id].chapters }; }
  if (x.q) lib.q = x.q;
  if (x.flow) S.perm = true;
  if (x.tipsOff) tips.off();
  if (x.libFilter) lib.f = x.libFilter;
  closeSheet(true);
  if (!x.tipsOff) prep(screen);
  if (x.via) go(x.via, {}, { root: true });
  go(screen, params || {}, { root: !x.via });
  if (x.sheet) later(() => { if (x.fits) Object.assign(fits, x.fits); openSheet(x.sheet, x.sp || {}); if (x.custom) { F.custom = true; openSheet('start', { id: x.sp.id }); } }, 380);
  toast(`${p[0]} · ${MORE.problems.statuses[p[6]]}`);
}
function setOpt(id, v) {
  O[id] = v; saveOpts();
  const sh = $('#sheet'); const y = sh.scrollTop;
  render(true);
  openSheet('options'); $('#sheet').scrollTop = y;
}
regSheet('journeys', () => ({
  cls: 'rigsheet tall', jewel: '#C49BFF', label: RIG.journeysTitle,
  html: `<p class="kicker">${esc(APP.rig.tag)}</p><h3>${esc(RIG.journeysTitle)}</h3>
    <div class="btns"><button class="btn primary" data-rig="problems">${esc(MORE.problems.open)}</button></div>
    <p class="kicker section">${esc(RIG.timeK)}</p><p class="more">${esc(RIG.timeSub)}</p>
    <div class="row2"><button class="btn ghost small" data-rig="nextDay">${esc(RIG.nextDay)}</button><button class="btn ghost small" data-rig="later" aria-label="${esc(RIG.laterLabel)}">${esc('Later Today')}</button></div>
    <p class="kicker section">${esc(RIG.journeysTitle)}</p>
    <p class="more">${esc(RIG.journeysSub)}</p>
    <div class="jlist">${JOURNEYS.map((j) => `<button class="jrow" data-journey="${j.id}"><b>${esc(j.name)}</b><span>${esc(j.id === 'glen' && homeOff() ? NOHOME.glenLine : j.line)}</span></button>`).join('')}</div>
    <div class="btns"><button class="btn ghost" data-rig="screens">${esc(RIG.screens)}</button></div>`,
}));
regSheet('options', () => ({
  cls: 'rigsheet tall', jewel: '#C49BFF', label: RIG.optionsTitle,
  html: `<p class="kicker">${esc(APP.rig.tag)}</p><h3>${esc(RIG.optionsTitle)}</h3><p class="more">${esc(RIG.optionsSub)}</p>
    <div class="btns"><button class="btn ghost" data-rig="problems">${esc(MORE.problems.open)}</button></div>
    ${OPTIONS.map((o) => `<fieldset class="opt"><legend><b>${esc(o.label)}</b> <small>${esc(o.q)}</small></legend>${o.choices.map(([v, l, s]) => `<button class="optrow ${O[o.id] === v ? 'on' : ''}" role="radio" aria-checked="${O[o.id] === v}" data-opt="${o.id}" data-v="${esc(v)}"><i></i><span><b>${esc(l)}</b><small>from: ${esc(s)}</small></span></button>`).join('')}</fieldset>`).join('')}
    <div class="btns"><button class="btn ghost" data-rig="resetOpts">${esc(RIG.reset)}</button></div>`,
}));
// every screen, reachable
const JUMPS = {
  recs: ['recs', { from: 'summons' }], trial: ['trial', { next: 'back' }], account: ['account', { mode: 're', next: 'back' }],
  today: ['today'], 'today: card options': ['cards'], map: ['map'], library: ['library'], feed: ['feed'], you: ['you'], settings: ['settings'], reminders: ['reminders'], lock: ['lock'],
  'overview: Squeaky': ['overview', { id: 'squeaky' }], 'overview: Coronet (Edmonton)': ['overview', { id: 'coronet' }], 'overview: Calgary Parable': ['overview', { id: 'parable' }],
  'overview: Adelaide (Passport)': ['overview', { id: 'adelaide' }], 'overview: Chase (Passport)': ['overview', { id: 'chase' }], 'overview: Dictators Laundromat': ['overview', { id: 'laundromat' }],
  'overview: Tips From Your Barista': ['overview', { id: 'barista' }], 'overview: Frightnight (seasonal)': ['overview', { id: 'frightnight' }], 'overview: The Balthazar Job': ['overview', { id: 'balthazar' }],
  'overview: Dynasty Duel': ['overview', { id: 'dynasty' }], 'overview: Pirate Captain (Hunt)': ['overview', { id: 'pirate' }], 'overview: Tales from the Incident': ['overview', { id: 'incident' }],
  routes: ['routes', { id: 'squeaky' }], walkmap: ['walkmap'], treadmill: ['treadmill'], sofa: ['sofa'], camera: ['camera'], gemsave: ['gemsave'], chapter: ['chapter'], break: ['break'], ending: ['ending'], postcard: ['postcard', { id: 'squeaky' }], lockin: ['lockin'],
  'gem: + Gem sheet': ['today', {}, 'quickGem'], 'gem: snap': ['gem-snap'], 'gem: from my photos': ['gem-upload'], 'gem: details': ['gemsave'], 'gem: who can see it': ['gem-who'], 'gem: created': ['gem-made', { id: 'g8' }],
  'gem: yours (private)': ['gem-view', { id: 'g2' }], 'gem: yours (friends)': ['gem-view', { id: 'g8' }], 'gem: a neighbour’s': ['gem-view', { id: 'g3' }], 'gem: a friend’s': ['gem-view', { id: 'g7' }], 'gem: map card': ['map', {}, 'gem', { id: 'g3' }], 'gem: rarity': ['map', {}, 'gemRarity'],
  whimsy: ['whimsy'], 'whimsy-play': ['whimsy-play'], 'whimsy-end': ['whimsy-end', { id: 'cat', n: 6, steps: 1400, mins: 14, ver: 'out', res: 'pressed' }], 'whimsy: bell': ['today', {}, 'bell'], 'friends: add a friend': ['today', {}, 'friend'], roulette: ['roulette'], mission: ['mission'], doorstep: ['doorstep'], comeback: ['comeback'], linked: ['linked'], lobby: ['lobby', { id: 'frightnight' }], problems: ['problems'],
  'whimsy: walk together': ['wt-lobby'], 'whimsy: get out the door': ['shoes'], 'sheet: share code': ['today', {}, 'shareCode'], 'sheet: share doodle': ['today', {}, 'shareDoodle'], 'sheet: take me home': ['whimsy-play', {}, 'takeHome', { mins: 12 }], 'sheet: trip page': ['you', {}, 'trip'],
};
regSheet('screens', () => ({
  cls: 'rigsheet tall', jewel: '#C49BFF', label: RIG.screensTitle,
  html: `<p class="kicker">${esc(APP.rig.tag)}</p><h3>${esc(RIG.screensTitle)}</h3><p class="more">${esc(RIG.screensSub)}</p><div class="jgrid">${Object.keys(JUMPS).filter((k) => !(homeOff() && k === 'sofa')).map((k) => `<button class="jchip" data-jump="${esc(k)}">${esc(k)}</button>`).join('')}</div>`,
}));

// persona start states (05-personas.md). Everything not set comes from BASE_STATE.
// day-0 guests start honest: no gems of their own, no friends, no friend's gem (loops build 5 + 10)
const NEWBIE = { friends: [], gems: BASE_STATE().gems.filter((g) => !g.mine && !g.friend), progress: {}, finished: {}, myList: [], upNext: [], seals: 0, fogPct: 4, week: { walks: 1, chapters: 1, gems: 0 }, weekWalked: [0, 0, 1, 0, 0, 0, 0], stepsToday: 420, stepsWeek: [0, 0, 420, 0, 0, 0, 0], storySteps: 420, lastStory: null };
const JSTATE = {
  first: [{ ...NEWBIE, name: 'Sam', hour: 19.67, weather: 'clear', temp: 6, city: 'Edmonton', day: 0, member: 'guest', account: false, perm: true, finished: { summons: ['Welcome to the Society'] } }, 'recs', { from: 'summons' }],
  acct: [{ ...NEWBIE, name: 'Sam', hour: 19.3, weather: 'clear', temp: 6, city: 'Edmonton', day: 0, member: 'guest', account: false }, 'account', { mode: 'pre' }],
  priya: [{ name: 'Priya', hour: 12.08, weather: 'clear', temp: -4, city: 'Calgary', day: 9, member: 'member' }, 'today', null, () => { fits.time = 15; fits.shown = false; openSheet('fits'); }],
  marcus: [{ name: 'Marcus', hour: 10, dow: 'Saturday', date: 'Nov 7', weather: 'cloud', temp: 2, city: 'Edmonton', company: 'kids', member: 'member', day: 20 }, 'today', null, () => { fits.company = 'kids'; }],
  dana: [{ name: 'Dana', hour: 7, weather: 'rain', temp: 3, city: 'Winnipeg', member: 'member', remember: 'tread', day: 14 }, 'today'],
  wes: [{ name: 'Wes', hour: 18.5, weather: 'cloud', temp: -12, city: 'Camrose', loc: 'rural', member: 'free', lowData: true, day: 5 }, 'map'],
  hannah: [{ ...NEWBIE, name: 'Hannah', hour: 14, weather: 'cloud', temp: -3, city: 'Edmonton', loc: 'far', member: 'guest', account: false, day: 1, perm: false }, 'library'],
  ruth: [{ name: 'Ruth', hour: 10.5, weather: 'rain', temp: 5, city: 'Edmonton', member: 'member', day: 31, finished: { summons: ['Welcome to the Society'] } }, 'today'],
  jordan: [{ name: 'Jordan', hour: 6.5, weather: 'clear', temp: -8, city: 'Calgary', member: 'member', goal: 5000, stepsToday: 3400, stepsWeek: [11200, 9800, 3400, 0, 0, 0, 0], storySteps: 8600, weekWalked: [1, 1, 1, 0, 0, 0, 0], day: 40 }, 'you', { sec: 'steps' }],
  amara: [{ name: 'Amara', hour: 15.67, weather: 'clear', temp: 1, city: 'Calgary', member: 'trial', trialLeft: 4, teen: true, company: 'friends', day: 3 }, 'today'],
  // homePlay off: Glen starts Out the Door with step-free stories, not From the Sofa (journey() swaps it)
  glen: [{ name: 'Glen', hood: 'Beverly', hour: 14, weather: 'snow', temp: -6, city: 'Edmonton', member: 'member', remember: 'sofa', textSize: 'Large', day: 12 }, 'today'],
  tasha: [{ name: 'Tasha', hour: 20.25, weather: 'cloud', temp: 4, city: 'Calgary', away: 21, member: 'member', progress: { frightnight: { ch: 3, of: 8 } }, lastStory: 'frightnight', weekWalked: [0, 0, 0, 0, 0, 0, 0], week: { walks: 0, chapters: 0, gems: 0 }, stepsToday: 210, stepsWeek: [0, 0, 210, 0, 0, 0, 0], storySteps: 0, day: 34, rem: { on: true, time: 'evening', custom: '', days: [1, 1, 1, 1, 1, 0, 0], budget: '1 a day', quiet: '9 pm – 8 am', paused: 'you’re back' } }, 'today'],
  mo: [{ ...NEWBIE, name: 'Mo', hour: 13, weather: 'clear', temp: 3, city: 'Edmonton', member: 'guest', account: false, day: 0 }, 'linked'],
  chinedu: [{ ...NEWBIE, name: 'Chinedu', hour: 18.25, weather: 'cloud', temp: 29, city: 'Lagos', member: 'free', lowData: true, day: 3 }, 'today'],
};
function journey(id, quiet) {
  let [patch, screen, p, then] = JSTATE[id];
  if (homeOff() && ['sofa', 'home'].includes(patch.remember)) patch = { ...patch, remember: null, stepFree: true };
  closeSheet(true);
  resetState({ ...patch, persona: id, rem: { ...(patch.rem || { on: false, time: 'lunch', custom: '', days: [1, 1, 1, 1, 1, 0, 0], budget: '1 a day', quiet: '9 pm – 8 am', paused: null }), days: [...((patch.rem && patch.rem.days) || [1, 1, 1, 1, 1, 0, 0])] } });
  // loops: day bookkeeping, the weekday index, what happened while a returner was away
  S.day0 = S.day; S.wd = Math.max(0, DAYS.indexOf(S.dow)); if (S.wd !== 2 && !patch.stepsWeek) { S.stepsWeek = [0, 0, 0, 0, 0, 0, 0].map((_, i) => (i < S.wd ? [3100, 800, 1900, 2400, 600][i] || 0 : i === S.wd ? S.stepsToday : 0)); }
  S.weather0 = S.weather; S.gems.forEach((g) => { g.finders = g.finders || []; g.log = g.log || []; });
  seedHist(); whileAway(); whimsy.start(); Object.assign(frUI, { input: '', confirm: null, err: '' }); S.wt = null;
  trialSeen = false; fits.shown = false; fits.time = 15; fits.company = patch.company || 'solo'; fits.energy = 'stroll'; fits.weather = null;
  lib.q = ''; lib.f = S.stepFree ? 'stepfree' : null; whimsy.where = 'out'; mapUI.sync();
  Object.assign(F, { id: 'squeaky', way: 'door', length: 'written', ch: 3, mode: 'walk', remember: false, custom: false, kids: false, route: null, radius: 0, carry: 0, carryHome: null });
  prep(screen);
  go(screen, p || {}, { root: true });
  if (then && !quiet) later(then, 350);
  if (!quiet) toast(JOURNEYS.find((j) => j.id === id).name);
}

// ---------------------------------------------------------------- boot
const saved = loadOpts();
if (saved && saved.rev) { document.body.classList.add('reviewer'); }
$('#rig').innerHTML = `<span class="rig-name">${esc(APP.rig.name)} <em>${esc(APP.rig.tag)}</em></span>
  <button data-rig="journeys">${esc(APP.rig.journeys)}</button><button data-rig="options">${esc(APP.rig.options)}</button>
  <button id="rigRev" data-rig="reviewer" aria-pressed="${document.body.classList.contains('reviewer')}">${esc(APP.rig.reviewer)}</button>
  <button class="rig-time" data-rig="nextDay" title="${esc(RIG.nextDayLabel)}">${esc(RIG.nextDay)}</button><button class="rig-time" data-rig="later" title="${esc(RIG.laterLabel)}" aria-label="${esc(RIG.laterLabel)}">${esc(RIG.later)}</button>
  <span id="rigstate" class="rig-state"></span>`;
$('#fixback').textContent = MORE.problems.back;
const qs = new URLSearchParams(location.search);
if (qs.get('reviewer') === '1') { document.body.classList.add('reviewer'); $('#rigRev').setAttribute('aria-pressed', 'true'); }
const hash = location.hash.slice(1);   // artifact links only pass a bare #token: #problems, #reviewer, #j-tasha
if (hash === 'reviewer') { document.body.classList.add('reviewer'); $('#rigRev').setAttribute('aria-pressed', 'true'); }
const startJ = qs.get('j') || (hash.startsWith('j-') ? hash.slice(2) : null);
if (qs.get('view') === 'problems' || hash === 'problems') { journey('first', true); openProblems(); }
// Today card options (Melissa, Nov 5): Priya's midday Today, then the A / B / C view
else if (qs.get('view') === 'cards' || hash === 'cards') { journey('priya', true); go('cards', {}, { root: true }); }
else if (startJ && JSTATE[startJ]) journey(startJ);
else journey('first');
