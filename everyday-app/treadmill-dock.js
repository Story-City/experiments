// Treadmill mode as the approved "walk map dock" ("Inside the box option two"; UX doc approved by Melissa, Nov 26,
// feature in development, Jira SC-3737). Two tips, a dock card with the mode switch, steps and a treadmill switch,
// a speed sheet with glass up / down triangles, then a walking figure on the map with Pause walk / Resume walking.
import { S, O, reg, regSheet, openSheet, closeSheet, sheetHooks, toast, rerender, esc, ic, n0, src, $, byId, every, backBtn, weatherKind } from './core.js';
import { TREADDOCK } from './words.js';
import { storyMap } from './maps.js';
import { F, goalFor } from './screens-story.js';

const KMH_MIN = 1, KMH_MAX = 8, KMH_STEP = 0.1, KMH_DEFAULT = 4;
const STEP_M = 0.75;
const MOCK_CHAPTER_S = 12;
const TICK_MS = 250;
const HOLD_MS = 120;

const td = { on: false, walking: false, paused: false, started: false, speed: KMH_DEFAULT, steps: 0, tip: 0, done: false };
export const treadDock = td;

const stepsPerMin = () => (td.speed * 1000) / 60 / STEP_M;
const minsLeft = (goal) => Math.max(1, Math.round((goal - td.steps) / stepsPerMin()));
const modeNames = () => (O.modeNames === 'location' ? ['Steps', 'Location', 'Hunt'] : ['Steps', 'Path', 'Hunt']);
const cold = () => ['cold', 'snow', 'storm', 'rain'].includes(weatherKind()) || S.temp <= 0;

function figure() {
  if (!td.on || !td.started) return '';
  return `<div class="td-walker ${td.paused ? 'paused' : ''}" aria-hidden="true"><svg viewBox="0 0 40 60"><circle cx="20" cy="8" r="6" fill="#FBF7FF"/><path class="td-body" d="M20 15 L20 34" stroke="#FBF7FF" stroke-width="4" stroke-linecap="round"/><path class="td-arm" d="M20 19 L11 29 M20 19 L29 27" stroke="#FBF7FF" stroke-width="3.4" stroke-linecap="round"/><path class="td-leg l" d="M20 34 L12 52" stroke="#FBF7FF" stroke-width="4" stroke-linecap="round"/><path class="td-leg r" d="M20 34 L28 52" stroke="#FBF7FF" stroke-width="4" stroke-linecap="round"/></svg></div>
    <div class="td-speedside"><button class="td-tri up" data-act="tdNudge" data-v="1" aria-label="${esc(TREADDOCK.up)}"></button><span class="td-pill">${esc(TREADDOCK.kmh(td.speed))}</span><button class="td-tri down" data-act="tdNudge" data-v="-1" aria-label="${esc(TREADDOCK.down)}"></button></div>`;
}

function tipOverlay() {
  if (td.tip >= 2) return '';
  const winter = td.tip === 0 && cold();
  if (td.tip === 0 && !winter) td.tip = 1;
  const t = td.tip === 0 ? TREADDOCK.tipWinter : TREADDOCK.tipMode;
  return `<button class="td-tipwrap" data-act="tdTip" aria-label="${esc(TREADDOCK.tipTap)}"><span class="td-tip ${td.tip === 1 ? 'point' : ''}"><span>${esc(t)}</span><small>${esc(TREADDOCK.tipTap)}</small></span></button>`;
}

reg('treadmill-dock', {
  jewel: () => '#00CD9D', cls: () => 'mapscr tdscr',
  html() {
    const s = byId[F.id], goal = goalFor();
    const names = modeNames();
    const pct = Math.min(100, (td.steps / goal) * 100);
    return `<header class="slim">${backBtn()}<div><b>${esc(s.title)}</b><span>${esc(TREADDOCK.k)} · Chapter ${F.ch}</span></div></header>
      <div class="mapbox full td-map" id="tdmap">${storyMap({ mode: 'walk' })}${figure()}
        <div class="arrival" id="tdarrive" ${td.done ? '' : 'hidden'}><div class="burst" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<i style="--r:${i * 30}deg"></i>`).join('')}</div><span class="unlocked">${esc(TREADDOCK.arrived)}</span><button class="btn jewel" data-act="tdRead">${esc(TREADDOCK.read)}</button></div>
      </div>
      <section class="td-dock ${td.tip === 1 ? 'tip-hi' : ''}">
        <div class="td-row1">
          <div class="seg minis td-modes" role="radiogroup" aria-label="Map mode">${names.map((n, i) => i === 2
            ? `<button role="radio" aria-checked="false" class="off" data-act="tip" data-tip="${esc(TREADDOCK.huntNo)}">${esc(n)}</button>`
            : `<button role="radio" aria-checked="${i === 0}" class="${i === 0 ? 'on' : ''}" data-act="tip" data-tip="${esc(i === 0 ? names[0] : TREADDOCK.huntNo.replace('Hunt', n))}">${esc(n)}</button>`).join('')}</div>
          <button class="ibtn td-info" data-act="tdInfo" aria-label="${esc(TREADDOCK.info)}">${ic('info')}</button>
        </div>
        <div class="td-row2">
          <button class="td-icon ${td.on ? 'on' : ''}" data-act="tdSheet" ${td.on ? '' : 'disabled'} aria-label="${esc(TREADDOCK.speedH)}">${ic('tread')}</button>
          <span class="td-lab">${esc(TREADDOCK.toggle)}</span>
          <button class="td-switch ${td.on ? 'on' : ''}" role="switch" aria-checked="${td.on}" data-act="tdToggle" aria-label="${esc(TREADDOCK.toggle)}"><i></i></button>
          <span class="td-steps" id="tdsteps">${esc(TREADDOCK.steps(n0(Math.round(td.steps)), n0(goal)))}</span>
        </div>
        <div class="td-bar"><i id="tdbar" style="width:${pct}%"></i></div>
        ${td.on && td.started && !td.done ? `<button class="btn td-neon" data-act="tdPause" id="tdpause">${esc(td.paused ? TREADDOCK.resume : TREADDOCK.pause)}</button>` : ''}
        <p class="hint centre">${esc(td.on && td.started ? TREADDOCK.est(minsLeft(goal)) : TREADDOCK.huntNo)}</p>
        <p class="solves">mockup: sped up so a chapter unlocks in about ${MOCK_CHAPTER_S} seconds.</p>
        ${src('Treadmill mode — walk map dock, Inside the box option two: UX doc approved by Melissa, Nov 26 (SC-3737). Tip copy is a placeholder (NSC-2128); steps = distance ÷ 0.75 m (Golden Path)')}
      </section>
      ${tipOverlay()}`;
  },
  mount() {
    every(() => {
      if (!td.on || !td.started || td.paused || td.done) return;
      const goal = goalFor();
      td.steps = Math.min(goal, td.steps + goal * (TICK_MS / (MOCK_CHAPTER_S * 1000)) * (td.speed / KMH_DEFAULT));
      const st = $('#tdsteps'); if (st) st.textContent = TREADDOCK.steps(n0(Math.round(td.steps)), n0(goal));
      const b = $('#tdbar'); if (b) b.style.width = `${(td.steps / goal) * 100}%`;
      if (td.steps >= goal) { td.done = true; rerender(); }
    }, TICK_MS);
  },
});

regSheet('tdSpeed', () => ({
  jewel: '#4E6CAF', label: TREADDOCK.speedK, cls: 'td-sheet',
  html: `<p class="kicker">${ic('tread')} ${esc(TREADDOCK.speedK)}</p><h3>${esc(TREADDOCK.speedH)}</h3>
    <div class="td-speedbox"><button class="td-tri up big" data-act="tdNudge" data-v="1" aria-label="${esc(TREADDOCK.up)}"></button><span class="td-pill big" id="tdpill">${esc(TREADDOCK.kmh(td.speed))}</span><button class="td-tri down big" data-act="tdNudge" data-v="-1" aria-label="${esc(TREADDOCK.down)}"></button></div>
    <p class="hint centre" id="tdest">${esc(TREADDOCK.est(minsLeft(goalFor())))}</p>
    <div class="btns">${td.started ? `<button class="btn primary" data-close>${esc('Done')}</button>` : `<button class="btn primary" data-act="tdStart">${esc(TREADDOCK.start)}</button>`}</div>
    ${src('Glass up / down triangles, not a slider; hold to keep going; fill #160D34, outline #4E6CAF — approved UX doc, Nov 26')}`,
}));

function nudge(d) {
  td.speed = Math.round(Math.min(KMH_MAX, Math.max(KMH_MIN, td.speed + d * KMH_STEP)) * 10) / 10;
  document.querySelectorAll('.td-pill').forEach((p) => { p.textContent = TREADDOCK.kmh(td.speed); });
  const e = $('#tdest'); if (e) e.textContent = TREADDOCK.est(minsLeft(goalFor()));
}
let holdT = null;
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.td-tri'); if (!b) return;
  const d = +b.dataset.v; clearInterval(holdT);
  holdT = setInterval(() => nudge(d), HOLD_MS);
});
['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => document.addEventListener(t, () => { clearInterval(holdT); holdT = null; }));

export const TD_ACT = {
  tdTip: () => { td.tip += 1; rerender(); },
  tdInfo: () => { td.tip = cold() ? 0 : 1; rerender(); },
  tdToggle: () => {
    if (td.on) { td.on = false; td.started = false; td.paused = false; rerender(); return toast(TREADDOCK.endedToast); }
    td.on = true; rerender(); openSheet('tdSpeed');
  },
  tdSheet: () => { if (td.on) openSheet('tdSpeed'); },
  tdNudge: (el) => nudge(+el.dataset.v),
  tdStart: () => { td.started = true; td.paused = false; closeSheet(true); rerender(); },
  tdPause: () => { td.paused = !td.paused; rerender(); },
};
// a sheet dismissed before the first Start turns the switch back off (approved edge case)
sheetHooks.tdSpeed = () => { if (td.on && !td.started) { td.on = false; if ($('.tdscr')) rerender(); } };
export function tdReset() { Object.assign(td, { on: false, walking: false, paused: false, started: false, speed: KMH_DEFAULT, steps: 0, done: false, tip: S.treadTips >= 2 ? 2 : 0 }); }
