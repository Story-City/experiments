// The everyday surfaces: Today, Map, Library, Feed, You, Settings, Reminders, Lock screen,
// Whimsy Walks, Route Roulette, Mini Missions, plus their sheets.
import {
  S, O, reg, regSheet, go, toast, openSheet, rerender, every, esc, ic, n0, solves, src, idea,
  byId, STORIES, weatherKind, weatherLine, daylightLeft, partOfDay, isDark, gemSvg, GEM_TYPES, gemCol, localHere, catOf,
  badgeOf, timeLabel, backBtn, sparkle, $, walkTxt, hasName, beforeSunrise, sun, fmtTime, trialDates, inCanada, ruralOk,
  modeState, distTxt, interLabel, interScale, bestMode, gemVisOf, gemTier, hideHome,
  walkIdFor, walkDef, walkVersion, unsealAt, myCode, codeName, pronoun, othersNear, sinceItems, unseen, friendDoodles, ageWhen,
  walkName, daylit, lowDays, friendNear, firstName, gemOn, seeded, DAYS, homeOff, remembered,
} from './core.js';
import {
  TODAY, WEATHER, FITS, LIBRARY, FEED, MAP, GEMS, YOU, SETTINGS, REMIND, LOCK, WHIMSY, ROULETTE, MISSION, LIVING,
  SHEETS_W, CARD, GO, TABS, OVERVIEW, LOCKIN, TRIAL, MORE, START, SOFA, BOT, LOOPS, NOHOME, NAV26, TODAY26,
} from './words.js';
import { youGalleries } from './you-gallery.js';
import { storyCard, thumb, coverOf, shelf, tabHead, weekRow, toggle, selectRow, linkRow, thatsToday, chip, stepPill, dayLabel } from './ui.js';
import { homeMap, doodle, doorDoodle, isRural, place, pinsFor, WALKED, RURAL_WALKED } from './maps.js';
import { mountFog, FOG_LOOKS } from './fog.js';
import { SQUEAKY, PREVIOUSLY } from './stories.js';

const wxIcon = () => ic(isDark() ? 'moon' : { rain: 'rain', snow: 'snow', cloud: 'cloud', storm: 'rain' }[S.weather] || (S.temp <= -20 ? 'cold' : 'sun'));
const LEN = { short: 0.5, written: 1, long: 2 };

// ------------------------------------------------------------------ shared story helpers
// One honest number per chapter, used by Today, Start, the map, the treadmill, the widget and the lock screen.
export function stepsFor(s, len) {
  if (!s) return 500;
  // the trail slider stretches every walk by one factor (Melissa, Nov 5: the walk you get matches the length you picked)
  const k = !len && O.length === 'trail' ? (S.scale || 1) : LEN[len || S.length || 'written'];
  if (s.sample) return Math.round(+O.steps * k);
  return Math.round((s.steps || 2000) / Math.max(1, (s.chapters || 5) - 1) * k);
}
export const treadMinutes = (steps, kmh) => Math.max(1, Math.round(steps * 0.75 / (kmh * 1000 / 60)));
// the story the player is in right now (latest first)
export function curStory() {
  const ids = Object.keys(S.progress);
  if (!ids.length) return null;
  return S.progress[S.lastStory] ? S.lastStory : ids[ids.length - 1];
}
export function chapterTitle(id, ch) {
  if (id === 'squeaky' && SQUEAKY.chapters[ch]) return SQUEAKY.chapters[ch].title;
  if (id === 'frightnight' && ch === 3) return 'The school';
  return `Chapter ${ch}`;
}
export const rememberLabel = () => ({ door: 'Out the door', route: 'On a route', tread: 'On your pad', sofa: 'From the sofa', home: 'At home' }[remembered()] || '');
export const priceTxt = (plan = S.trialPlan) => (inCanada() ? (plan === 'month' ? 'CA$4.99 a month' : 'CA$34.99 a year') : TRIAL.storePrice[plan === 'month' ? 'month' : 'year']);
export const familyLine = () => (O.family === 'hidden' ? '' : TRIAL.family[O.family]);
const after = () => isDark() || (daylightLeft() > 0 && daylightLeft() < 30);

// ================================================================== TODAY
function flipCard() {
  let k = weatherKind();
  if (!k || S.flipDismissed) return '';
  if (k === 'dark') return '';   // the "It's dark out" card is gone from Today (Melissa, Nov 4)
  if (k === 'dark' && beforeSunrise()) k = 'predawn';
  if (k === 'dark' && isRural()) k = 'ruralDark';
  const off = homeOff();
  const f = (off && NOHOME.flips[k]) || WEATHER.flips[k];
  const t = typeof f.t === 'function' ? f.t(k === 'predawn' ? fmtTime(sun().sunrise) : daylightLeft()) : f.t;
  // every button does what it says (testers A2, C5)
  // homePlay off: the indoor button is the treadmill / pad, and the dark ones wait for daylight
  const DO = off ? {
    rain: ['pad', 'door'], cold: ['pad', 'door'], snow: ['pad', 'door'], storm: ['pad', 'later'],
    dusk: ['short', 'lit'], dark: ['lit', 'later'], predawn: ['lit', 'later'], ruralDark: ['light', 'later'], hot: ['shade', 'later'],
  }[k] : {
    rain: ['indoor', 'door'], cold: ['indoor', 'door'], snow: ['indoor', 'door'], storm: ['indoor', 'later'],
    dusk: ['short', 'sofa'], dark: ['lit', 'sofa'], predawn: ['lit', 'sofa'], ruralDark: ['light', 'sofa'], hot: ['shade', 'later'],
  }[k];
  // Status sits in the header, never as a card (Melissa, Nov 5): one plain line and two text actions
  return `<div class="flip" data-k="${k}">
    <p class="flip-t"><b>${esc(f.k)}.</b> ${esc(t)}</p>
    <div class="flip-acts"><button class="link" data-act="flip" data-do="${DO[0]}">${esc(f.a)}</button><button class="link" data-act="flip" data-do="${DO[1]}">${esc(f.b)}</button><button class="link flip-x" data-act="flip" data-do="dismiss">${esc(WEATHER.flips.notNow)}</button></div>
    ${idea('weather and daylight twists (research #4)')}${solves('p1', 'p6')}
  </div>`;
}

// Feature nudges (Melissa, Nov 5): a slim strip with an icon, one line and one small button.
// Hide this tip or use it once and it never comes back. At most two at a time, so a new one rotates in.
export function nudgeItems(all = false) {
  const N = S.nudges || {}, T = TODAY.nudge;
  const live = S.friends.length && !isRural() && S.city !== 'Lagos' ? firstName(S.friends[0]) : null;
  const L = live ? T.live(live) : T.together;
  const list = [
    { k: 'together', used: !!S.wt, icon: 'people', t: L.t, b: L.b, attrs: live ? 'data-open="wtJoin"' : 'data-then="wtOpen" data-v="whimsy"' },
    { k: 'pick', used: fitState.shown, icon: 'spark', t: T.pick.t, b: T.pick.b, attrs: 'data-open="fits"' },
    { k: 'roulette', used: false, icon: 'route', t: T.roulette.t, b: T.roulette.b, attrs: 'data-then="rouletteGo"' },
  ];
  return all ? list : list.filter((x) => !N[x.k] && !x.used).slice(0, 2);
}
// little line drawings for tile nudges (option B): two walkers, a pointing hand of cards, a spinning wheel
const NUDGE_ART = {
  together: '<circle cx="22" cy="16" r="6"/><circle cx="43" cy="18" r="5.5"/><path d="M12 54l4-18c1-5 11-5 12 0l3 18M34 54l3-16c1-5 10-5 11 0l3 16"/><path d="M28 38c3 2 6 2 9 0" stroke-dasharray="1 3"/>',
  pick: '<rect x="12" y="18" width="20" height="28" rx="3" transform="rotate(-12 22 32)"/><rect x="30" y="14" width="20" height="28" rx="3" transform="rotate(10 40 28)"/><path d="M38 24l1.4 3.6 3.6 1.4-3.6 1.4L38 34l-1.4-3.6-3.6-1.4 3.6-1.4z"/>',
  route: '<circle cx="32" cy="32" r="20"/><path d="M32 12v40M12 32h40M18 18l28 28M46 18L18 46"/><circle cx="32" cy="32" r="4"/>',
};
const NUDGE_KEY = { together: 'together', pick: 'pick', roulette: 'route' };
export function nudgeCard(x, v = 'a') {
  const T = TODAY.nudge;
  const go = `<button class="btn ghost small" data-act="nudge" data-k="${x.k}" ${x.attrs}>${esc(x.b)}</button>`;
  const hide = `<button class="nudge-x" data-act="nudge" data-k="${x.k}" data-x="1" aria-label="${esc(T.x)}">${ic('x')}</button>`;
  if (v === 'b') return `<div class="nudge nv-b"><span class="n-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${NUDGE_ART[NUDGE_KEY[x.k]]}</svg></span><p>${esc(x.t)}</p>${go}${hide}</div>`;
  if (v === 'c') return `<div class="nudge nv-c"><span class="pav bk" aria-hidden="true">${esc(BOT[0])}</span><div class="bubble"><p class="kicker">${esc(BOT)}</p><p>${esc(x.t)}</p>${go}</div>${hide}</div>`;
  return `<div class="nudge nv-a">${ic(x.icon)}<p>${esc(x.t)}</p>${go}${hide}</div>`;
}
// Feature nudges (Melissa, Nov 5): hide one or use it once and it never comes back. At most two at a time
function nudges(v = 'a', items = nudgeItems()) {
  if (!items.length) return '';
  return `<div class="nudges nvs-${v}">${items.map((x) => nudgeCard(x, v)).join('')}
    ${src('Feature nudges: one line, one button, gone once used — Melissa, Nov 5. Walk Together is friends only; nobody sees where you are unless you join.')}</div>`;
}

// character art: round avatars where art exists, a lettered circle for everyone else (Melissa, Nov 5)
const CHAR_ART = { Wren: 'summons', 'Sir Wendell': 'knight' };
export const charAv = (who, cls = 'lv-av') => (CHAR_ART[who] ? `<span class="${cls} art art-${CHAR_ART[who]}" aria-hidden="true"></span>` : `<span class="${cls}" aria-hidden="true">${esc(who.replace(/^The /, '')[0])}</span>`);

function livingLine() {
  // the line comes from the player's current story and changes each day (loops must-fix 14)
  const sid = curStory() || S.lastStory;
  let L;
  if (S.first) L = LIVING.first;
  else if (sid === 'squeaky' && S.weather === 'rain' && S.day === S.day0) L = LIVING.rain;
  else if (!sid && isRural()) L = LIVING.rural;
  else { const pool = LOOPS.overheard[sid] || LOOPS.overheard.default; const x = pool[S.day % pool.length]; L = { ...x, story: LOOPS.storyName[sid] || (byId[sid] ? byId[sid].title : LIVING.default.story) }; if (!LOOPS.overheard[sid]) L.story = { Wren: 'The Summons', 'Sir Wendell': 'A Knight Needs Your Help', 'The Mailbox': 'Have You Seen Squeaky?' }[x.who]; }
  // no card (Melissa, Nov 5): the quote on the left, the whole character on the right (no circle), the story title
  // is the link to its overview.
  const sto = STORIES.find((x) => x.title === L.story);
  const vo = (cls) => `<button class="vo lv-vo ${cls}" data-act="vo" data-who="${esc(L.who)}" aria-label="Hear ${esc(L.who)}">${ic('play')}<span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></button>`;
  // play button: top right of the quote, beside the byline, or after the last word (Team Option lineVoAt, Melissa Nov 9)
  const at = O.lineVoAt || 'left', inline = at === 'inline';
  const cut = L.t.lastIndexOf(' ', L.t.lastIndexOf(' ') - 1);   // last two words + button stay together (no widows)
  const quote = inline ? `“${esc(L.t.slice(0, cut + 1))}<span class="nowrap">${esc(L.t.slice(cut + 1))}”${vo('in')}</span>` : `“${esc(L.t)}”`;
  const story = sto ? `<button class="lv-story" data-go="overview" data-id="${sto.id}">${esc(L.story)}</button>` : `<i>${esc(L.story)}</i>`;
  const by = at === 'byline' ? `<figcaption class="lv-by">${vo('by')}<span>${esc(L.who)} · ${story}</span></figcaption>` : `<figcaption>${esc(L.who)} · ${story}</figcaption>`;
  return `<figure class="living lv3 vo-${at}" style="--jewel:${sto ? sto.accent : '#C49BFF'}">${charAv(L.who)}<div class="lv-body"><blockquote>${quote}</blockquote>${by}</div>
    ${at === 'left' ? vo('fl lf') : at === 'top' ? vo('fl tp') : at === 'float' ? vo('fl') : ''}${idea('the world keeps living (#32)')}${src('From the story you’re in, a new line each day — loops brief must-fix 14 (Tasha)')}${src(`No card, real art, the title opens the story; play button: ${at} (Team Option lineVoAt) — Melissa, Nov 5`)}</figure>`;
}

function storyDoor() {
  const cur = curStory();
  if (S.away >= 7 && cur) {
    const s = byId[cur], pr = S.progress[cur];
    const pv = PREVIOUSLY[cur];
    return `<button class="door door-story" style="--jewel:${s.accent}" data-go="comeback">
      ${thumb(s, 't-door')}<span class="kicker">${esc(TODAY.previously)}</span>
      <span class="door-title">${esc(s.title)}</span>
      <span class="door-line">${esc(pv ? pv.lines[0].t : s.hook)}</span>
      <span class="meta">${esc(TODAY.storyMeta(pr.ch, pr.of))} · ${esc(TODAY.previouslyLine)}</span>
      <span class="btn primary as-btn">${esc(TODAY.previously.replace('…', ''))}</span>
    </button>${src('Comeback uses the player’s real last story; it disappears once they’re back (tester C7)')}`;
  }
  if (!cur) {
    const finishedFull = Object.keys(S.finished).some((id) => !byId[id].sample);
    const id = finishedFull ? (S.upNext[0] || 'knight') : (S.myList[0] || 'incident');
    const s = byId[id];
    return `<div class="door door-story" style="--jewel:${s.accent}">
      ${thumb(s, 't-door')}<p class="kicker">${esc(finishedFull ? MORE.nextStory : TODAY.doors.storyFirst(BOT))}</p>
      <button class="door-title linkish" data-go="overview" data-id="${s.id}">${esc(s.title)}</button>
      <p class="door-line">${esc(s.hook)}</p>
      <p class="meta">${esc(timeLabel(s))} · ${esc(badgeOf(s))} · ${esc(CARD.free)}</p>
      <button class="btn primary" data-act="startStory" data-id="${s.id}">${esc(TODAY.startIt)}</button>
    </div>`;
  }
  const s = byId[cur], pr = S.progress[cur];
  const next = chapterTitle(cur, pr.ch);
  const steps = stepsFor(s), left = Math.max(0, steps - (S.bank || 0));
  const line = cur === 'squeaky' ? `The ${next.replace(/^The /, '').toLowerCase()} saw something.` : s.hook;
  // walked steps count toward the next chapter; once they cover it, the chapter is open (pass 2: Rosa)
  if (!left) return `<div class="door door-story door-open" style="--jewel:${s.accent}">
    ${thumb(s, 't-door')}<p class="kicker">${esc(TODAY.doors.story)} · ${esc(TODAY.storyMeta(pr.ch, pr.of))}</p>
    <button class="door-title linkish" data-go="overview" data-id="${s.id}">${esc(s.title)}</button>
    <p class="door-line">${esc(LOOPS.openedDoor(pr.ch))}</p>
    <div class="pbar big"><i style="width:${Math.round(pr.ch / pr.of * 100)}%"></i></div>
    <button class="btn primary" data-act="readOpened" data-id="${s.id}">${esc(LOOPS.readCh(pr.ch))}</button>
    ${src('Whimsy and Roulette steps count toward the chapter — walkers retest (Rosa: 8,550 steps, still “663 steps away”)')}
  </div>`;
  return `<div class="door door-story" style="--jewel:${s.accent}">
    ${thumb(s, 't-door')}<p class="kicker">${esc(TODAY.doors.story)} · ${esc(TODAY.storyMeta(pr.ch, pr.of))}</p>
    <button class="door-title linkish" data-go="overview" data-id="${s.id}">${esc(s.title)}</button>
    <p class="door-line">${esc(line)}</p>
    <div class="pbar big"><i style="width:${Math.round((pr.ch - 1) / pr.of * 100)}%"></i></div>
    <p class="meta">${esc(TODAY.away(walkTxt(left)))}${remembered() ? ` · ${esc(rememberLabel())}` : ''}</p>
    <button class="btn primary" data-act="keepGoing" data-id="${s.id}">${esc(TODAY.keep)}</button>
    ${solves('p3')}
  </div>`;
}

const fmtLeft = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} minutes`);
// the version a walk plays in: indoor walks (Mall Lap) never get the street versions
export const verFor = (id, short) => { const w = walkDef(id); let v = walkVersion(); if (short && v === 'out') v = S.loc === 'rural' ? (homeOff() ? 'out' : 'home') : 'lit'; if (w.indoor && v === 'lit') v = 'out'; return v; };
export const myDoodleSvg = (d) => doodle(d.n, d.wt ? 'wt' + S.day : S.name + ':' + S.day + ':' + (d.id || ''), { loop: d.id === 'roulette', cols: d.cols });
export function whimsyDoor(o = {}) {
  const id = walkIdFor(), w = walkDef(id), ver = verFor(id, o.short), name = walkName(id);
  const tom = walkName(walkIdFor(1), 1);
  // the done door: doodle, seal count, tomorrow's teaser. No Do It Now (loops build step 3)
  if (S.whimsyDone) {
    const d = S.myDoodle || { n: 5 };
    return `<button class="door door-whimsy door-done" style="--jewel:${w.jewel}" data-go="whimsy">
      <span class="stamp">${esc(LOOPS.version[d.ver] === 'At Home' ? 'Done' : 'Walked')}</span>
      <span class="dd-doodle" aria-hidden="true">${myDoodleSvg(d)}</span>
      <span class="kicker">${esc(TODAY.doors.whimsy)}</span>
      <span class="door-title">${esc(name)}</span>
      <span class="door-line">${esc(S.sealToday || O.sealCap === 'every' ? LOOPS.walked(S.seals) : LOOPS.walkedNoSeal)}</span>
      <span class="meta">${esc(LOOPS.tomorrow(tom, unsealAt()))}</span>
      <span class="link as-link">${esc(LOOPS.seeBook)} ${ic('chev')}</span>
      ${src('The done door: doodle, seal count, tomorrow — loops brief build 3 (6 pairs saw WALKED and Do It Now at once); Pokémon GO Field Research')}
    </button>`;
  }
  return whimsyCard('a', o);
}
// Whimsy Walk card, three looks (A / B / C) shown on #cards; Today uses A. Never a keyline, never a cover,
// so it can't be mistaken for a story (Melissa, Nov 5). Every walk gets its own little line drawing.
export function whimsyCard(v = 'a', o = {}) {
  const id = walkIdFor(), w = walkDef(id), ver = verFor(id, o.short), name = walkName(id);
  const V = w[ver] || w.out;
  const short = o.short;
  const line = short ? LOOPS.dusk(isDark() ? 'now' : fmtLeft(daylightLeft())).replace('Dark in now', 'It’s dark') : (w.dayName && daylit() && V.day) || V.hook;
  // indoor walks don't wear a street label ("An indoor walk · Lit Streets", groups retest)
  const verLbl = ver !== 'out' && !(w.indoor && ver === 'lit') ? ` · ${esc(LOOPS.version[ver])}` : '';
  const sh = short ? 'data-short="1"' : '';
  const art = `<span class="w-art" aria-hidden="true">${walkArt(id)}</span>`;
  return `<div class="wcard wv-${v}" style="--jewel:${w.jewel}">
    ${v === 'b' ? '' : art}
    <div class="w-body"><p class="kicker">${v === 'b' ? `<span class="w-mini" aria-hidden="true">${walkArt(id)}</span>` : ''}${esc(short ? LOOPS.duskK : TODAY.doors.whimsy)}${verLbl}</p>
    <button class="w-title linkish" data-act="whimsyGo" ${sh}>${esc(name)}</button>
    <p class="w-line">${esc(line)}</p></div>
    <p class="w-meta">${esc(TODAY.whimsySame)} · ${esc(TODAY.sealed)}</p>
    <div class="row2"><button class="btn ghost small" data-act="whimsyGo" ${sh}>${esc(TODAY.doIt)}</button><button class="btn ghost small" data-act="remindHour">${esc(TODAY.remind)}</button></div>
    ${ver !== 'out' ? src(`The door follows How I play, weather and dark: ${LOOPS.version[ver]} — loops brief build 9`) : ''}
    ${short ? src('At dusk, a short safe door instead of hiding Whimsy — Amara, Chinedu (Team Option duskDoor)') : ''}
    ${src('A daily pool of 7 picked by the date: the same walk for everyone, no repeat inside a week — pass 2 (walkers, distance)')}
  </div>`;
}
// hand-drawn line placeholders until each walk has its own illustration (no AI images): a coin, a bingo card,
// a star, a bulb, and wandering footprints for the rest
const STAR = (cx, cy, R, r) => Array.from({ length: 10 }, (_, i) => { const a = (i * 36 - 90) * Math.PI / 180, d = i % 2 ? r : R; return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`; }).join(' ');
const ART = {
  cat: '<circle cx="30" cy="34" r="20"/><circle cx="30" cy="34" r="14.5" stroke-dasharray="2 3.2"/><path d="M30 25.5v17M25 29.5c0-2.6 10-2.6 10 0s-10 3.4-10 6.6 10 3 10 0"/><path d="M50 8c4 2.5 6 6 6 10M47 13c2 1.3 3 3 3 5"/>',
  bingo: '<rect x="10" y="10" width="44" height="44" rx="5"/><path d="M24.7 10v44M39.3 10v44M10 24.7h44M10 39.3h44"/><circle cx="17.3" cy="17.3" r="4"/><circle cx="32" cy="32" r="4"/><path d="M43.5 43.5l7.6 7.6M51.1 43.5l-7.6 7.6"/>',
  mall: `<polygon points="${STAR(32, 34, 22, 9.5)}"/><path d="M50 10v6M47 13h6M12 50v4M10 52h4"/>`,
  lights: '<path d="M24 40c-4-3-7-8-7-13a15 15 0 0 1 30 0c0 5-3 10-7 13v5H24z"/><path d="M25 50h14M27 55h10M32 6V2M12 13l-3-3M52 13l3-3"/>',
  any: '<path d="M10 52c8-2 10-14 20-16s16 6 24-22" stroke-dasharray="1 6.5"/><ellipse cx="10" cy="52" rx="3" ry="4.5"/><path d="M54 6l1.6 4.4L60 12l-4.4 1.6L54 18l-1.6-4.4L48 12l4.4-1.6z"/>',
};
export const walkArt = (id) => `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ART[id] || ART.any}</svg>`;
const MISSION_ART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.5" r="8"/><path d="M12 9.5v4l2.5 2M10 2.5h4M12 2.5v3"/></svg>';
// the low-energy door: Get Out the Door, and it counts (pass 2: Sky)
function doorDoor() {
  const D = LOOPS.lowDoor;
  if (S.doorDone) return `<button class="door door-whimsy door-done" style="--jewel:#B36BFF" data-go="whimsy"><span class="stamp">Done</span><span class="dd-doodle" aria-hidden="true">${doorDoodle()}</span><span class="kicker">${esc(D.k)}</span><span class="door-title">${esc(D.title)}</span><span class="door-line">${esc(S.sealToday ? D.done(S.seals) : D.doneNoSeal)}</span><span class="link as-link">${esc(LOOPS.seeBook)} ${ic('chev')}</span></button>`;
  return `<div class="door door-whimsy door-low" style="--jewel:#B36BFF">
    <p class="kicker">${esc(D.k)}</p><p class="door-title">${esc(D.title)}</p>
    <p class="door-line">${esc(D.line)}</p>
    <div class="btns"><button class="btn ghost" data-act="shoesGo">${esc(D.go)}</button></div>
    ${src('On a low day the one small door is Get Out the Door, and Door Open presses a seal — lowenergy retest (Sky)')}
  </div>`;
}
export function missionSteps() {
  if (after()) return { title: MISSION.darkAlt.title, step2: MISSION.darkAlt.step, gem: 'curio', gemName: 'A light that’s on' };
  const m = LOOPS.missions[S.day % LOOPS.missions.length];
  if (S.weather === 'snow' && m.gem === 'nature' && m.step.includes('green')) return { title: m.title, step2: MISSION.snowAlt.step, gem: 'nature', gemName: 'Something not white' };
  return { title: m.title, step2: m.step, gem: m.gem, gemName: m.gemName };
}
const missionDoor = () => missionCard('a');
// Mini Mission: small and light, one line and one small button, visibly smaller than Whimsy (Melissa, Nov 5).
// Three looks on #cards; Today uses A. At dusk the button is Do It at Your Door, unless homePlay is off.
export function missionCard(v = 'a') {
  const m = missionSteps();
  const door = isDusk() && !homeOff();
  const btn = `<button class="btn ghost small" data-go="${door ? 'doorstep' : 'mission'}">${esc(door ? SOFA.doorstep : TODAY.imIn)}</button>`;
  const icon = `<span class="m-ic" aria-hidden="true">${MISSION_ART}</span>`;
  return `<div class="mcard mv-${v}" style="--jewel:#F5B82E">
    ${S.missionDone ? `<span class="stamp">Done</span>` : ''}
    ${v === 'c' ? icon : ''}<div class="m-body">${v === 'c' ? '' : `<p class="kicker">${v === 'b' ? icon : ''}${esc(TODAY.doors.mission)}</p>`}<p class="m-line">${esc(m.title)}</p></div>${btn}
    ${src('Mini Missions name — Melissa, Nov 4; “Wanna bet?” card, Whimsy DB; swaps by daylight and season (tester A17)')}${solves('p9')}
  </div>`;
}
function threeDoors() {
  return `<section class="three"><p class="kicker">${esc(TODAY.three.kicker)}</p><div class="three-grid">${TODAY.three.items.map((it, i) => `<button class="ch3" style="--jewel:${it.jewel}" data-go="${['mission', 'roulette', 'gemsave'][i]}"><b>${esc(it.t)}</b><span>${esc(it.s).replace(/ (\d+) min$/, ' $1&nbsp;min')}</span></button>`).join('')}</div>${src('Three daily challenges — Victoria, Nov 2')}</section>`;
}

// which doors Today shows (Team Options cadence, duskDoor, lowEnergy) — one place, so the Since card can match it
const isDusk = () => weatherKind() === 'dusk' || (after() && !isDark());
export function todayMode() {
  const low = O.lowEnergy === 'signals' && (S.energyNone || lowDays() >= 3);
  if (S.away >= 3) return 'away';
  if (low) return 'low';
  if (isDusk() && O.duskDoor === 'story') return 'duskStory';
  if (isDusk()) return 'dusk';
  return 'full';
}
const hasWalkDoor = (m = todayMode()) => ['dusk', 'full'].includes(m) && O.cadence !== 'three';

// "Since you were here": top of Today (and the comeback), only when something changed (loops build 6)
export function sinceCard() {
  const items = sinceItems();
  if (!items.length) return '';
  const mode = todayMode();
  // the walk link matches the doors Today actually shows (pass 2: lowenergy)
  const showWalk = items.some((a) => ['doodle', 'friends', 'saw'].includes(a.kind)) && !S.whimsyDone && hasWalkDoor(mode);
  const gentle = mode === 'low' && !S.doorDone;
  const y = S.yday && !S.storyOnly && S.yday.steps > 0 ? (S.yday.steps >= S.yday.goal ? LOOPS.ydayMet(n0(S.yday.steps)) : LOOPS.ydayShort(n0(S.yday.steps), n0(S.yday.goal))) : '';
  return `<section class="since"><p class="kicker">${ic('bell')} ${esc(LOOPS.sinceK)}</p>
    ${newsList(items.slice(0, 3).map((a) => actItem(a, true)))}
    ${items.length > 3 ? `<button class="link pretend" data-sheet="bell">${esc(`${items.length - 3} more`)}</button>` : ''}
    ${y ? `<p class="since-goal">${ic('walk')} ${esc(y)}</p>` : ''}
    <div class="since-foot">${showWalk ? `<button class="link pretend" data-act="whimsyGo">${esc(LOOPS.act.todayWalk(walkName(walkIdFor())))}</button>` : gentle ? `<button class="link pretend" data-act="shoesGo">${esc(LOOPS.lowDoor.gentle)}</button>` : '<span></span>'}<button class="link pretend" data-act="sinceGot">${esc(LOOPS.sinceGot)}</button></div>
    ${src('Since you were here: up to 3 lines, newest first, tap opens the gem — loops brief Gems #1; Munzee cap-on, Geocaching logs')}
    ${src('One line per gem, named friends + a count; yesterday’s steps against the goal; Cheer Back — pass 2 (walkers, lowtech, social)')}
  </section>`;
}
// ---- News (Melissa, Nov 5): a light list, not cards. Avatar or gem, one line, time ago, an optional small Cheer.
// One item shape for Since you were here, Around you and the bell; three looks on #cards (A list, B grouped, C tiles)
const pavOf = (who, col = '#C49BFF', me = false) => `<span class="pav${me ? ' me' : ''}" style="--jewel:${col}">${esc(who[0])}</span>`;
const miniCheer = (attrs, on, label) => `<button class="cheer mini" ${attrs} aria-pressed="${!!on}">${sparkle(12)} ${esc(label)}</button>`;
const agoOf = (a) => a.when || (S.day - a.day <= 0 ? LOOPS.ages.today : S.day - a.day === 1 ? LOOPS.ages.yesterday : LOOPS.ages.days(S.day - a.day));
// one row of activity: the gem's shape, or the friend's initial, or a people mark for "3 friends did…"
function actItem(a, back) {
  const g = a.gem && S.gems.find((x) => x.id === a.gem);
  const who = a.who || (/^[A-Z][a-z]/.test(a.t) && ['friend', 'doodle', 'saw'].includes(a.kind) ? a.t.split(' ')[0] : null);
  const mark = g ? gemSvg(g.type, 24) : who ? pavOf(who) : `<span class="pav" style="--jewel:#C49BFF">${ic('people')}</span>`;
  const cat = a.kind === 'nameit' || (g && g.mine) ? 'mine' : a.kind === 'near' ? 'near' : 'friends';
  // Cheer Back: one tap from the list, and they see it in their morning (pass 2 idea, lowtech)
  const canBack = back && a.who && S.friends.includes(a.who) && ['gem', 'doodle'].includes(a.kind);
  const on = canBack && S.cheerBacks && S.cheerBacks[a.who] === S.day;
  return { cat, mark, t: a.t, when: agoOf(a), open: `data-act="actOpen" data-id="${a.id}"`,
    act: canBack ? miniCheer(`data-act="cheerBack" data-v="${esc(a.who)}" aria-label="${esc(`${LOOPS.cheerBack}: ${a.who}`)}"`, on, on ? FEED.cheered : LOOPS.cheerBack) : '' };
}
const newsRow = (it) => `<div class="nrow"><button class="n-main" ${it.open}>${it.mark}<span class="n-t">${esc(it.t)}</span>${it.when ? `<time>${esc(it.when)}</time>` : ''}</button>${it.act || ''}</div>`;
const actRow = (a, back) => newsRow(actItem(a, back));
export function newsList(items, v = 'a') {
  if (!items.length) return '';
  if (v === 'b') {
    const G = TODAY.newsGroups;
    return `<div class="news nl-b">${Object.keys(G).map((k) => { const xs = items.filter((x) => x.cat === k); return xs.length ? `<p class="n-group">${esc(G[k])}</p>${xs.map(newsRow).join('')}` : ''; }).join('')}</div>`;
  }
  return `<div class="news nl-${v}">${items.map(newsRow).join('')}</div>`;
}
export const bellBtn = () => `<button class="ibtn bell" data-sheet="bell" aria-label="${esc(LOOPS.bellTitle)}${unseen() ? ' (new)' : ''}">${ic('bell')}${unseen() ? '<i class="bdot" aria-hidden="true"></i>' : ''}</button>`;
regSheet('bell', () => {
  const row = (a) => actRow(a, false);
  const today = S.activity.filter((a) => a.day === S.day && a.kind !== 'quiet'), earlier = S.activity.filter((a) => a.day !== S.day && a.kind !== 'quiet');
  const html = `<p class="kicker">${ic('bell')} ${esc(LOOPS.sinceK)}</p><h3>${esc(LOOPS.bellTitle)}</h3>
    ${!today.length && !earlier.length ? `<p class="more">${esc(LOOPS.bellEmpty)}</p>` : ''}
    ${today.length ? `<p class="lbl">${esc(LOOPS.bellToday)}</p><div class="since-list">${today.map(row).join('')}</div>` : ''}
    ${earlier.length ? `<p class="lbl">${esc(LOOPS.bellEarlier)}</p><div class="since-list">${earlier.slice(0, 12).map(row).join('')}</div>` : ''}
    <p class="hint">${ic('lock')} ${esc(LOOPS.bellNote[O.socialNote])}</p>
    ${src('One activity list for gems and friends — loops brief Gems #2; how you hear back is a Team Option (socialNote)')}`;
  S.activity.forEach((a) => { a.seen = true; });
  return { jewel: '#C49BFF', label: LOOPS.bellTitle, html, cls: 'tall' };
});
// Around you: friends' doodles of today's walk, one cheer state per gem, honest empty states (loops build 7).
// Nov 5 (Melissa): a light news list, not cards; the notes and empty states around it stay plain text.
export function aroundParts(mode) {
  const fr = S.friends, w = walkDef(walkIdFor());
  const pre = [], items = [], post = [];
  const today = LOOPS.ages.today;
  const mine = S.whimsyDone && S.myDoodle ? { cat: 'mine', mark: pavOf(S.name, '#C49BFF', true), t: LOOPS.yourDoodle(S.doodleCheers), when: today, open: `data-sheet="${fr.length ? 'shareDoodle' : 'shareCode'}"` } : null;
  if (!fr.length) {
    // your own doodle still shows, with a way to get a first cheer (pass 2: Kai)
    if (mine) items.push(mine);
    post.push(`<div class="empty-note invite"><p>${esc(LOOPS.inviteAround)}</p><button class="btn ghost small" data-sheet="friend">${esc(FEED.addFriend)}</button></div>`);
  } else {
    const ds = friendDoodles();
    // the count matches the rows, and "Your turn?" only when Today has a walk door (pass 2: social, lowenergy)
    if (ds.length) pre.push(`<p class="around-line">${esc(S.whimsyDone ? LOOPS.youWalkedWith(ds.length) : hasWalkDoor(mode) && mode !== 'low' ? LOOPS.friendsDidTurn(ds.length) : LOOPS.friendsDid(ds.length))}</p>`);
    const wk = S.stepsWeek.reduce((a, b) => a + b, 0) + 18400, goalW = 50000;
    if (O.walkedTogether === 'weekly') {
      const left = goalW - wk, m = rlFit(left);
      pre.push(`<div class="hint weekly">${ic('people')} <span>${esc(LOOPS.together.weekly(fr[0], n0(Math.min(wk, goalW)), n0(goalW)))}${S.wd === 6 ? `<br>${esc(left > 0 ? LOOPS.weeklyClose(n0(left), m) : LOOPS.weeklyDone)}` : ''}</span></div>${S.wd === 6 && left > 0 ? `<button class="btn ghost small" data-act="rouletteGo" data-min="${m}">${esc(LOOPS.longWayGo(m))}</button>` : ''}${src('A weekly line, no streak, with a Sunday close-out — walkers pair (Team Option walkedTogether; the brief keeps “None” as the default)')}`);
    }
    if (O.walkedTogether === 'flame') pre.push(`<p class="hint flame">${sparkle(12, 'var(--citrine)')} ${esc(LOOPS.together.flame(Math.min(5, fr.length)))}</p>${src(LOOPS.together.flameNote)}`);
    if (mine) items.push(mine);
    const shown = S.showAllD ? ds : ds.slice(0, 2);
    shown.forEach((d) => {
      const n = w.max ? 2 + (d.n % 8) : d.n, on = !!S.cheeredD[d.key];
      items.push({ cat: 'friends', mark: pavOf(d.who, w.jewel), t: w.friend(d.who, n), when: today, open: `data-sheet="doodleFriend" data-p='${esc(JSON.stringify({ who: d.who, n: d.n, key: d.key }))}' aria-label="${esc(`Open ${d.who}’s doodle`)}"`, act: miniCheer(`data-act="cheerD" data-k="${esc(d.key)}"`, on, on ? FEED.cheered : FEED.cheer) });
    });
    if (ds.length > 2) post.push(`<button class="link more-d" data-act="showAllD">${esc(S.showAllD ? LOOPS.fewer : LOOPS.seeAll(ds.length))}</button>`);
    // a friend's gem (Ama's koi), same cheer as the gem page; only a friend who lives near you
    // only while it's news (today or yesterday), so it never sits at "4 days ago" (pass 2: walkers, groups)
    const fg = othersNear() && S.day - S.day0 <= 1 && S.gems.find((g) => !g.mine && g.friend && !g.hidden && fr.includes(g.by) && friendNear(g.by));
    if (fg) items.push(gemItem(fg, true));
  }
  // a gem near you: a different one each day, never one you've found (pass 2: distance, groups)
  if (othersNear()) {
    const pool = S.gems.filter((g) => !g.mine && !g.friend && !g.hidden && !g.found);
    const ng = pool.length ? pool[(S.day + 1) % pool.length] : null;
    if (ng) items.push(gemItem(ng, false));
  } else {
    const own = S.gems.find((g) => g.mine && gemVisOf(g) === 'all' && !g.hidden);
    post.push(`<p class="hint">${ic('pin')} ${esc(isRural() ? LOOPS.nearestGem(14) : own ? LOOPS.ownFirst(own.name) : LOOPS.noGemsHere)}</p>`);
  }
  // a character and a creator, rotated each day; Lagos gets its own lines (pass 2: groups, lowtech)
  const cp = S.city === 'Lagos' && S.loc !== 'far' ? LOOPS.charPostsLagos : LOOPS.charPosts;
  const c = cp[S.day % cp.length], cs = STORIES.find((x) => x.title === c.story);
  items.push({ cat: 'near', mark: charAv(c.who, 'pav'), t: `${c.who}: ${c.what}`, when: LOOPS.postAges[S.day % LOOPS.postAges.length], open: cs ? `data-go="overview" data-id="${cs.id}"` : '' });
  const crs = FEED.posts.filter((x) => x.kind === 'creator' || x.kind === 'new');
  const cr = crs[S.day % crs.length];
  const kevin = cr.story === 'balthazar';
  items.push({ cat: 'coming', mark: pavOf(cr.who, cr.jewel), t: `${cr.what}: ${cr.detail}`, when: ageWhen(cr.when), open: kevin ? `data-sheet="creator" data-p='{"who":"kevin"}'` : `data-go="overview" data-id="${cr.story}"`, act: kevin ? `<button class="cheer mini" data-act="notify">${esc(FEED.notify)}</button>` : '' });
  return { pre, items, post };
}
function aroundYou(mode) {
  const { pre, items, post } = aroundParts(mode);
  return `<section class="around"><div class="shelf-head"><h2 class="kicker section">Around you</h2>${S.friends.length ? `<button class="link" data-sheet="friend">${esc(FEED.addFriend)}</button>` : ''}</div>${pre.join('')}${newsList(items)}${post.join('')}
    ${src('Friends’ doodles of today’s walk, flips and seal only, never the route — loops brief Friends #3; Wordle shares how, not where')}${src('Each friend’s doodle is drawn from their own walk; posts and the nearby gem rotate daily — pass 2')}${src('Above “That’s today” — loops brief Friends #6')}${src('News is a light list: one line, time ago, a small Cheer — Melissa, Nov 5')}</section>`;
}
function gemItem(g, friend) {
  const t = friend ? `${g.by} left a gem for friends: ${gemOn(g.name)}` : `${(g.dist || 5) * 80} m from you: ${g.name}`;
  return { cat: friend ? 'friends' : 'near', mark: gemSvg(g.type, 24), t, when: friend ? ageWhen('2 h') : LOOPS.ages.today, open: `data-go="gem-view" data-p='{"id":"${g.id}"}'`,
    act: miniCheer(`data-act="gemCheer" data-id="${g.id}"`, g.cheered, `${g.cheered ? FEED.cheered : FEED.cheer} · ${g.cheers || 0}`) };
}
// the shortest Roulette (15 / 30 / 45 / 60 / 90 min) that covers a step gap, at about 95 steps a minute
const rlFit = (steps) => [15, 30, 45, 60, 90].find((t) => t * 95 >= steps) || 90;
// The Long Way Home (walkers idea): from 5:30 pm, a little short of the goal, a Roulette sized to the gap
function longWay(mode) {
  if (S.storyOnly || S.hour < 17.5 || S.hour > 21.5 || !hasWalkDoor(mode)) return '';
  const left = S.goal - S.stepsToday;
  if (left <= 0 || left > 4000) return '';
  const m = rlFit(left);
  // a feature nudge strip like the others on Today (Melissa, Nov 5: six card types, each with its own look)
  return `<div class="nudge nv-a lw">${ic('route')}<p>${esc(LOOPS.longWay(n0(left), m))}</p><button class="btn ghost small" data-act="rouletteGo" data-min="${m}">${esc(LOOPS.longWayGo(m))}</button>${idea('The Long Way Home (walkers): a Roulette sized to the gap')}</div>`;
}
reg('today', {
  tab: 'today',
  html() {
    const hello = hasName() ? `${TODAY.hello[partOfDay()]}, ${S.name}` : TODAY.hello[partOfDay()];
    const title = O.tabs === 'real' ? TABS.home : hello;
    const firstName26 = O.tabs === 'nov26' ? NAV26.first[O.firstTab] : null;
    // one door after 3+ days away; on a low day the story stays and one tiny door joins it (pass 2: Tasha, Sky)
    const mode = todayMode(), cur = curStory();
    const oneDoor = mode === 'away' || mode === 'low' || mode === 'duskStory';
    let doors;
    if (mode === 'away') doors = storyDoor();
    else if (mode === 'low') doors = (cur ? storyDoor() : '') + doorDoor();
    else if (mode === 'duskStory') doors = storyDoor();
    // at dusk the short safe door, then the 1-minute mission (Do It at Your Door), then the story (pass 2: Gord, Amara)
    else if (mode === 'dusk') doors = whimsyDoor({ short: true }) + missionDoor() + (cur ? storyDoor() : '');
    else {
      doors = storyDoor();
      if (O.cadence === 'one') doors += whimsyDoor() + missionDoor();
      else if (O.cadence === 'three') doors += threeDoors();
      else doors += whimsyDoor() + threeDoors();
    }
    return `${tabHead(title, { kicker: firstName26 ? `${firstName26} · ${S.dow}, ${S.date}` : TODAY.kicker(`${S.dow}, ${S.date}`), right: `${bellBtn()}<button class="ibtn" data-go="library" data-p='{"focus":1}' aria-label="Search">${ic('search')}</button>` })}
      <div class="today-status"><p class="wx">${wxIcon()} ${esc(weatherLine())}</p>
      ${oneDoor || mode === 'dusk' || S.whimsyDone || S.walkedToday ? '' : flipCard()}</div>
      ${calCard()}
      ${sinceCard()}
      ${S.first ? `<section class="firstwel"><p class="kicker">${esc(TODAY.firstKicker)}</p><p class="big">${esc(TODAY.firstTitle)}</p>${S.tips ? `<p class="tipline">${sparkle(14, 'var(--glow)')} ${esc(TODAY.firstTip)}</p>` : ''}</section>` : ''}
      ${livingLine()}
      <div class="doors">${doors}</div>${oneDoor ? '' : nudges()}${oneDoor ? src(mode === 'low' ? 'Low day: the story stays, plus Get Out the Door — lowenergy retest; 3 low-step days counted from install, never days away (Team Option lowEnergy)' : 'One door after a break or at dusk — Sky test, Nov 4') : ''}
      ${longWay(mode)}
      ${idea('three small doors, then “That’s today” (#31)')}${solves('p3', 'p10')}
      ${aroundYou(mode)}
      <section class="week"><p class="kicker section">${esc(TODAY.week)}</p>${weekRow()}<p class="weekline">${esc(TODAY.weekLine(S.week.walks, S.week.chapters, S.week.gems))}</p><p class="hint">${esc(TODAY.weekNote)}</p>${src('No streaks: brief safety rule; Melissa Sep 17')}</section>
      ${thatsToday()}
      <div class="tabpad"></div>`;
  },
});

// Your day from the calendar: a later, opt-in feature, shown so the team can see it (Melissa, Nov 26; NSC-2137).
// Only the free gap is used; event names never leave the phone; off for under-13s.
function calCard() {
  if (O.calendar !== 'preview' || S.away >= 3) return '';
  const body = S.calOn
    ? `<p class="big">${esc(TODAY26.calLine)}</p><p class="hint">${ic('lock')} ${esc(TODAY26.calSub)}</p>`
    : `<p class="hint">${esc(TODAY26.calAskP)}</p><button class="btn ghost small" data-sheet="calAsk">${ic('clock')} ${esc(TODAY26.calBtn)}</button>`;
  return `<section class="calcard" style="--jewel:#5B8CFF"><p class="kicker">${ic('clock')} ${esc(TODAY26.calK)}</p>${body}${src(TODAY26.calLater + ' — NSC-2137')}</section>`;
}
regSheet('calAsk', () => ({
  jewel: '#5B8CFF', label: TODAY26.calK,
  html: `<p class="kicker">${ic('clock')} ${esc(TODAY26.calK)}</p><h3>${esc(TODAY26.calAskH)}</h3><p class="more">${esc(TODAY26.calAskP)}</p>
    <div class="btns"><button class="btn primary" data-act="calYes">${esc(TODAY26.calYes)}</button><button class="btn ghost" data-close>${esc(TODAY26.calNo)}</button></div>
    ${src('Ask only when the player taps Find Me a Time, never in the first-time experience — NSC-2137')}`,
}));

// ================================================================== TODAY: CARD OPTIONS (#cards)
// Every undecided Today card as A / B / C, stacked, each labelled so Melissa can reply "Whimsy B, nudge C" (Nov 5).
reg('cards', {
  tab: 'today',
  html() {
    const C = TODAY.cards, T = C.types;
    const lbl = (t, v) => `<p class="opt-lbl">${esc(t)} · ${esc(v ? `${C.option} ${v.toUpperCase()}` : C.decided)}</p>`;
    const note = (k, v) => `<p class="opt-note">${esc(C.notes[k][v])}</p>`;
    const news = [...S.activity.filter((a) => a.kind !== 'quiet').slice(0, 3).map((a) => actItem(a, true)), ...aroundParts('full').items];
    const nudgeSet = nudgeItems(true).slice(0, 2);
    const block = (k, v, html) => `<div class="opt-block">${lbl(T[k], v)}${note(k, v)}${html}</div>`;
    return `${tabHead(C.title, { kicker: C.k })}
      <p class="opt-sub">${esc(C.sub)}</p><button class="link opt-back" data-go="today" data-root="1">${ic('back')} ${esc(C.back)}</button>
      <div class="opt-block">${lbl(T.story)}<div class="doors">${storyDoor()}</div></div>
      <div class="opt-block">${lbl(T.line)}${livingLine()}</div>
      ${['a', 'b', 'c'].map((v) => `<section class="opt-sec">${block('whimsy', v, whimsyCard(v))}${block('mission', v, missionCard(v))}</section>`).join('')}
      ${['a', 'b', 'c'].map((v) => `<section class="opt-sec">${block('nudge', v, nudges(v, nudgeSet))}</section>`).join('')}
      ${['a', 'b', 'c'].map((v) => `<section class="opt-sec">${block('news', v, newsList(news, v))}</section>`).join('')}
      ${src('Card options for Today: Whimsy, Mini Mission, nudge and news, three looks each — Melissa, Nov 5')}
      <div class="tabpad"></div>`;
  },
});

// ================================================================== WHAT FITS RIGHT NOW? (sheet)
const fitState = { time: 15, energy: 'stroll', company: 'solo', weather: null, shown: false, unit: 'time' };

// The website matchmaker's trail slider (apps/website/js/matchmaker.js), with a Time / Steps toggle
// (Melissa, Nov 4). 5–120 min; about 100 steps a minute, as elsewhere in the mockup.
const TRAIL_PTS = (() => {
  const cub = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
  const segs = [[[24, 98], [110, 30], [190, 120], [290, 70]], [[290, 70], [390, 20], [470, 18], [576, 52]]];
  const out = [];
  segs.forEach(([p0, p1, p2, p3], si) => { for (let i = si ? 1 : 0; i <= 17; i++) { const t = i / 17; out.push([cub(p0[0], p1[0], p2[0], p3[0], t), cub(p0[1], p1[1], p2[1], p3[1], t)]); } });
  return out;
})();
function trailSvg(frac, gid) {
  const shown = Math.max(2, Math.round(2 + (TRAIL_PTS.length - 2) * Math.min(1, Math.max(0, frac))));
  const [ex, ey] = TRAIL_PTS[shown - 1];
  return `<svg viewBox="0 0 600 130" aria-hidden="true"><defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="20" x2="580" y1="0" y2="0"><stop offset="0" stop-color="#F5B82E"/><stop offset="1" stop-color="#00CD9D"/></linearGradient></defs>
      <path d="M24 98 C 110 30, 190 120, 290 70 S 470 18, 576 52" fill="none" stroke="#46337E" stroke-width="2" stroke-dasharray="1 11" stroke-linecap="round"/>
      ${TRAIL_PTS.map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.6" fill="url(#${gid})" ${i < shown ? '' : 'opacity="0"'}/>`).join('')}
      <circle class="ft-ring" cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="12" fill="none" stroke="#00CD9D" stroke-width="2"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="6.5" fill="#FBF7FF"/></svg>`;
}
// Story length: one slider for the whole walk (Melissa, Nov 5: "adjust the overall length of the walk instead of
// phrasing it in words"). k = 0.4–2.5 × the author's walking. The story itself never changes.
export const fmtMins = (m) => (m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`);
export function storyLen(s, k) {
  const legs = Math.max(1, (s.chapters || 5) - 1);
  const base = stepsFor(s, 'written');                            // the author's steps per walk (the same number the walk uses)
  const per = Math.max(10, Math.round(base * k / (base * k < 500 ? 10 : 50)) * (base * k < 500 ? 10 : 50));
  const steps = per * legs;                                       // all the walking, in steps
  const walkAsWritten = base * legs / 100;                        // minutes of walking as written (about 100 steps a minute)
  const read = Math.max(3, (s.mins ? s.mins[0] : 20) - walkAsWritten * 0.6);
  const raw = read + steps / 100;
  const total = Math.max(4, raw < 20 ? Math.round(raw) : Math.round(raw / 5) * 5);
  return { total, per, steps, stops: legs };
}
export function lenTrail(s, k) {
  const L = storyLen(s, k);
  const each = s.episodes ? ' · each episode' : '';
  return `<div class="ftrail" id="lenTrail"><output class="ft-out" for="lenRange" aria-live="polite"><b>About ${L.total < 60 ? `${L.total} minutes` : fmtMins(L.total)}</b><span>about ${n0(L.steps)} steps · ${distTxt(L.steps)}${each}</span></output>${trailSvg((k - 0.4) / 2.1, 'ltGrad')}</div>`;
}
// the scale under the slider: the story's real shortest and longest times
export const lenScale = (s) => `<div class="ft-scale" aria-hidden="true"><span>${fmtMins(storyLen(s, 0.4).total)}</span><span>${fmtMins(storyLen(s, 2.5).total)}</span></div>`;
export function fitTrail(m, unit) {
  const shown = Math.max(2, Math.round(2 + (TRAIL_PTS.length - 2) * (m - 5) / 115));
  const [ex, ey] = TRAIL_PTS[shown - 1];
  const steps = n0(Math.round(m * 100 / 100) * 100);
  const mins = m < 60 ? `${m} minutes` : (m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} hour${m > 60 ? 's' : ''}`);
  const [big, small] = unit === 'steps' ? [`${steps} steps`, `about ${mins}`] : [mins, `about ${steps} steps`];
  return `<div class="ftrail" id="fitTrail"><output class="ft-out" for="fitRange" aria-live="polite"><b>${big}</b><span>${small}</span></output>
    <svg viewBox="0 0 600 130" aria-hidden="true"><defs><linearGradient id="ftGrad" gradientUnits="userSpaceOnUse" x1="20" x2="580" y1="0" y2="0"><stop offset="0" stop-color="#F5B82E"/><stop offset="1" stop-color="#00CD9D"/></linearGradient></defs>
      <path d="M24 98 C 110 30, 190 120, 290 70 S 470 18, 576 52" fill="none" stroke="#46337E" stroke-width="2" stroke-dasharray="1 11" stroke-linecap="round"/>
      ${TRAIL_PTS.map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.6" fill="url(#ftGrad)" ${i < shown ? '' : 'opacity="0"'}/>`).join('')}
      <circle class="ft-ring" cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="12" fill="none" stroke="#00CD9D" stroke-width="2"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="6.5" fill="#FBF7FF"/></svg></div>`;
}
export function scoreStory(s, f) {
  if (s.coming || !s.mins) return -99;
  let sc = 0;
  const per = s.mins[0];
  // only stories whose shortest time fits the slot (tester A3)
  if (per <= f.time) sc += 4; else if (per <= f.time + 5) sc += 1; else sc -= 6 + (per - f.time) / 10;
  const wx = f.weather || S.weather;
  const bad = ['rain', 'storm'].includes(wx) || S.temp <= -20;
  const sitDown = s.sit && !s.cafe;
  // Energy is Low / Medium / High (Melissa, Nov 4). Ids kept: low, stroll (Medium), brisk (High).
  // Low: short, a strong hook, starts at your door; sit-down and at-home stories score well too.
  if (f.energy === 'low') {
    if (per < 20) sc += 3; else sc -= 2 + (per - 20) / 10;
    if (hooky(s)) sc += 2;
    if (s.cat === 'anywhere' || s.step === 'yes') sc += 2;
    if (sitDown) sc += homeOff() ? -12 : 3;   // homePlay off: no sit-at-home picks
    if (s.cafe) sc -= 3;
    if (s.inter >= 3) sc -= 2;
  } else { if (s.sit) sc -= 12; } // Medium and High never get a sit-down pick (A3, B18, C13)
  if (f.energy === 'brisk' && s.step === 'yes' && s.mins[1] >= 30) sc += 2;
  if (f.energy === 'brisk' && s.inter >= 3) sc += 1;
  if (f.energy === 'stroll' && s.inter <= 2) sc += 1;
  if (f.company === 'kids') sc += (s.age === 'G' && s.tags.includes('kids')) ? 4 : s.age === 'G' ? 1 : -4;
  if (f.company === 'friends') sc += (s.together || s.tags.includes('friends')) ? 3 : 0;
  if (f.company === 'date') sc += (s.tags.includes('date') || s.tags.includes('spooky') || s.tags.includes('mystery')) ? 2 : 0;
  const sitOk = sitDown && !homeOff();
  if (bad) sc += (sitOk || s.step === 'yes') ? 2 : -2;
  if (isDark()) sc += s.cat === 'anywhere' || sitOk ? 1 : -3;
  if (s.cat === 'local' && !localHere(s)) sc -= 5;
  if (!ruralOk(s)) sc -= 6;
  if (s.cat === 'nearyou' && isRural()) sc -= 3;
  if (S.progress[s.id] || S.finished[s.id]) sc -= 3;
  if (s.sample) sc -= 2;
  return sc;
}
// a story that opens on a mystery or a cliffhanger
const hooky = (s) => ['mystery', 'spooky'].some((t) => s.tags.includes(t)) || /Mystery|Spooky|Thriller/.test(s.genre);
export function becauseLine(s, f) {
  const wx = f.weather || S.weather;
  // Low energy: warm, no guilt, never "you should" (Melissa, Nov 4)
  if (f.energy === 'low') {
    if (s.cafe) return FITS.lowCafe;
    if (s.sit) return FITS.lowSit;
    return s.mins[0] < 20 && hooky(s) ? FITS.lowHook : s.mins[0] < 20 ? FITS.lowShort : FITS.lowDoor;
  }
  const parts = [`you have ${f.time === 45 ? '45+' : f.time} minutes`];
  if (wx === 'rain') parts.push('it’s raining'); else if (S.temp <= -20) parts.push('it’s bitter out'); else if (isDark()) parts.push('it’s dark');
  if (f.company !== 'solo') parts.push(FITS.companies.find((c) => c.id === f.company).t.toLowerCase());
  const tail = s.cafe ? 'one short walk to a café, then you sit' : s.sit ? 'this one needs no walking' : s.episodes ? `one ${s.mins[0]}-minute episode` : s.step === 'yes' ? 'it starts at your door, or plays on a pad' : s.cat === 'nearyou' ? `it lands on ${s.needs} near you` : 'it starts nearby';
  return `${FITS.because} ${parts.join(', ')}: ${tail}.`;
}
regSheet('fits', () => {
  const f = fitState;
  const wx = f.weather || S.weather;
  let res = '';
  if (f.shown && f.energy === 'low') {
    // Low energy: two small doors, no more questions (Melissa, Nov 4; Sky test)
    const ranked = STORIES.filter((x) => !x.coming && x.mins && x.mins[0] <= 20).map((x) => [scoreStory(x, f), x]).sort((a, b) => b[0] - a[0]);
    const one = (ranked[0] || [0, byId.summons])[1];
    const m = missionSteps();
    res = `<div class="fit-res low">
      <div class="fit-pick" style="--jewel:#F5B82E"><b>${esc(m.title)}</b><span class="meta">1 minute · right outside your door</span><p class="because">${esc(`Take 10 steps. ${m.step2} You’re done.`)}</p><button class="btn primary" data-go="mission">Do It Now</button></div>
      <p class="kicker section">Or one short story</p>
      <button class="lrow alt" data-act="startStory" data-id="${one.id}" style="--jewel:${one.accent}">${thumb(one, 't-row')}<b>${esc(one.title)}</b><span>${esc(timeLabel(one))} · ${esc(becauseLine(one, f))}</span>${ic('chev')}</button>
      <button class="link" data-act="fitsAgain">More Options</button>${src('Low energy goes straight to a 1-minute mission or one short story: 1–2 taps (Sky test, Nov 4)')}</div>`;
  } else if (f.shown) {
    const ranked = STORIES.map((s) => [scoreStory(s, f), s]).sort((a, b) => b[0] - a[0]).map((x) => x[1]);
    // the chapter in progress comes first when it fits (A3)
    const cur = curStory();
    let keep = '';
    if (cur && f.energy !== 'low') {
      const s = byId[cur], pr = S.progress[cur];
      const mins = Math.max(4, Math.round(stepsFor(s) / 100));
      if (mins <= f.time + 2) keep = `<div class="fit-pick" style="--jewel:${s.accent}"><b>${esc(MORE.keepPick(s.title, pr.ch, mins))}</b><p class="because">${esc(MORE.keepBecause)}</p><button class="btn primary" data-act="keepGoing" data-id="${s.id}">${esc(TODAY.keep)}</button></div><p class="kicker section">${esc(FITS.alts)}</p>`;
    }
    const top = ranked.slice(0, keep ? 2 : 3);
    const [pick, ...alts] = top;
    res = `<div class="fit-res"><p class="kicker">${esc(FITS.pickKicker)}</p>
      ${keep || `<div class="fit-pick" style="--jewel:${pick.accent}"><b>${esc(pick.title)}</b><span class="meta">${esc(timeLabel(pick))} · ${esc(badgeOf(pick))} · ${esc(pick.age)}</span><p class="because">${esc(becauseLine(pick, f))}</p><button class="btn primary" data-go="overview" data-id="${pick.id}">${esc(FITS.open)}</button></div><p class="kicker section">${esc(FITS.alts)}</p>`}
      ${(keep ? top : alts).map((s) => `<button class="lrow alt" data-go="overview" data-id="${s.id}" style="--jewel:${s.accent}">${thumb(s, 't-row')}<b>${esc(s.title)}</b><span>${esc(s.age)} · ${esc(becauseLine(s, f))}</span>${ic('chev')}</button>`).join('')}
      <button class="link" data-act="fitsAgain">${esc(FITS.again)}</button></div>`;
  }
  return {
    jewel: '#C49BFF', label: FITS.kicker,
    html: `<p class="kicker">${esc(FITS.kicker)}</p><h3>${esc(f.shown && f.energy === 'low' ? 'Start tiny.' : FITS.title)}</h3>
      ${f.shown ? '' : `<p class="fit-energy">Energy: <b>${esc((FITS.energies.find((t) => t.id === f.energy) || FITS.energies[1]).t)}</b> · <button class="link" data-act="fit" data-k="energy" data-v="low">I Only Have a Little</button></p>
      <div class="ft-head"><p class="lbl">${esc(f.unit === 'steps' && f.energy !== 'low' ? 'How far?' : 'How long have you got?')}</p><div class="seg minis ft-unit" role="group" aria-label="Pick by">${[['time', 'Time'], ['steps', 'Steps']].map(([k, t]) => `<button class="${f.unit === k ? 'on' : ''}" aria-pressed="${f.unit === k}" data-act="fitUnit" data-v="${k}">${t}</button>`).join('')}</div></div>
      ${fitTrail(f.time, f.unit)}<input type="range" id="fitRange" class="ft-range" min="5" max="120" step="5" value="${f.time}" style="--p:${Math.round((f.time - 5) / 115 * 100)}%" aria-label="${f.unit === 'steps' ? 'Steps' : 'Minutes'}"><div class="ft-scale" aria-hidden="true">${f.unit === 'steps' ? '<span>500</span><span>6,000</span><span>12,000</span>' : '<span>5 min</span><span>1 h</span><span>2 h</span>'}</div>
      <div class="viewby fitrow" role="group" aria-label="${esc(FITS.company)}"><span>${esc(FITS.company)}</span><div class="seg minis">${FITS.companies.map((t) => `<button class="${f.company === t.id ? 'on' : ''}" aria-pressed="${f.company === t.id}" data-act="fit" data-k="company" data-v="${t.id}">${esc(t.t)}</button>`).join('')}</div></div>
      <div class="btns"><button class="btn primary" data-act="fitsGo">${esc(FITS.go)}</button></div>`}
      ${res}
      ${idea('What Fits Right Now? — 3 questions, 1 pick + 2 alternates; weather read in the background (#1; Melissa, Nov 4)')}${src('Help Me Pick — Anna + Melissa, Oct 16; one pick, never a list — Oct 30; energy and time now respected (A3, B18, C13)')}${solves('p2', 'p3')}`,
  };
});
export const fits = fitState;

// ================================================================== MAP TAB
let mapFilter = 'every', fogOn = true;
export const mapUI = { set filter(v) { mapFilter = v; }, set drawer(v) { drawerOpen = v; }, toggleFog() { fogOn = !fogOn; S.fogTabOn = fogOn; }, sync() { fogOn = S.fogTabOn !== false && S.loc !== 'far'; } };
let drawerOpen = false;
reg('map', {
  tab: 'map',
  cls: () => 'mapfull-scr',
  html() {
    const rural = isRural(), visiting = S.loc === 'far';
    const fog = fogOn && S.fogTabOn !== false && !visiting;
    const pins = pinsFor();
    const nearIds = ['squeaky', 'alice', 'spy', 'pirate', 'cookout', 'incident'].filter((id) => ruralOk(byId[id]));
    const look = FOG_LOOKS.find((l) => l.k === O.fogLook) || FOG_LOOKS[0];
    const pct = rural ? 6 : S.fogPct;
    if (mapFilter === 'rare' && O.gemRarity === 'off') mapFilter = 'every';
    const nearGems = rural || visiting || !othersNear() ? [] : S.gems.filter((g) => !g.mine && !g.hidden && (g.dist || 99) <= 6).sort((a, b) => a.dist - b.dist);
    return `<div class="mapfull">
      <div class="mapbox fullbleed" id="homemap">${homeMap({ fog: false, filter: mapFilter, home: !visiting, part: 'base', sat: !!S.mapSat })}${fog ? '<canvas class="fogc" id="fogc" aria-hidden="true"></canvas>' : ''}${homeMap({ id: 'hmt', fog: false, frontier: fog, filter: mapFilter, home: !visiting, part: 'top' })}</div>
      <div class="map-float">
        ${tabHead(O.tabs === 'sgw' ? TABS.gems : MAP.title, { kicker: visiting ? MAP.visiting(S.city) : place().hood, right: `<button class="ibtn" data-act="satToggle" aria-pressed="${!!S.mapSat}" aria-label="Satellite view" title="Satellite view">${ic('map')}</button><button class="ibtn" data-act="fogToggle" aria-pressed="${fog}" aria-label="Fog on map">${ic('cloud')}</button>${fog ? `<button class="ibtn" data-sheet="fogLooks" aria-label="Fog look: ${esc(look.name)}">${ic('spark')}</button>` : ''}` })}
        <div class="seg minis mapseg" role="radiogroup" aria-label="Show">${MAP.filters.concat(O.gemRarity !== 'off' && !rural ? [{ id: 'rare', t: GEMS.rareChip }] : []).map((f) => `<button role="radio" class="${mapFilter === f.id ? 'on' : ''}" aria-checked="${mapFilter === f.id}" data-act="mapFilter" data-v="${f.id}">${esc(f.t)}</button>`).join('')}</div>
      </div>
      <button class="mapbtn" data-act="recenter" aria-label="${MAP.locate}">${ic('compass')}</button>
      <section class="mapdrawer ${drawerOpen ? 'open' : ''}" aria-label="Around you">
        <button class="dr-handle" data-act="mapDrawer" aria-expanded="${drawerOpen}"><i></i>
          ${fog ? `<span class="dr-peek"><b>${esc(MAP.uncovered(pct))}</b><span class="pbar"><i style="width:${pct}%"></i></span></span>` : `<span class="dr-peek"><b>${esc(MAP.nearList)}</b></span>`}
          <span class="dr-more">${esc(drawerOpen ? 'Less' : 'More')}</span></button>
        <div class="dr-body">
          ${fog ? `<p class="hint">${esc(look.name)} fog · <button class="link" data-sheet="fogLooks">Change look</button></p>` : ''}
          ${solves('p4', 'p10')}${src('Map tab: start points + gems; filter My Gems · All Gems · Everything — Melissa Oct 14, Emily Nov 3; full screen — Melissa, Nov 4')}
          ${visiting ? `<p class="hint">${esc(MAP.visitingSub)}</p>` : ''}
          ${fog ? `<section class="fogstat"><p class="hint">${esc(MAP.uncoveredSub)}</p>
            <p class="hint home-b">${ic('home')} <span>${O.homeBubble === 'always' ? `<b>${esc(MAP.homeBubble)}.</b> ${esc(MAP.homeBubbleSub)}` : hideHome() ? `<b>${esc(MAP.homeHidden)}</b> ${esc(MAP.homeHiddenSub)}` : esc(O.homeBubble === 'choice' ? MAP.homeShownChoice : MAP.homeShownShare)}</span></p>${S.remember === 'tread' ? `<p class="hint">${esc(MAP.padFog)}</p>` : ''}${idea('Home Bubble (#20)')}${src('Fog looks and real contour lines from the fog-mode experiment; clears as you walk — Melissa, Oct 30')}</section>` : ''}
          ${fog ? `<section class="frontier-card" style="--jewel:#F5B82E"><p class="kicker">${esc(MAP.frontierK)}</p><p class="big">${esc(MAP.frontier(place().frontier))}</p><p class="hint">${esc(MAP.frontierSub)}</p><button class="btn ghost small" data-act="rouletteGo" data-toward="${esc(place().frontier)}">${esc(MAP.frontierGo)}</button>${idea('Fog Frontier (#18)')}</section>` : ''}
          <div class="maplegend"><span>${gemSvg('curio', 14)} ${esc(MAP.legend.gem)}</span><span><i class="lg-pin"></i>${esc(MAP.legend.start)}</span><span><i class="lg-ring"></i>${esc(MAP.legend.whimsy)}</span><span><i class="lg-me"></i>${esc(MAP.legend.you)}</span></div>
          ${rural ? `<section class="empty-note"><p class="big">${esc(MAP.emptyRural)}</p><p class="hint">${esc(MAP.ruralFallback)}</p>${src('Auto-place fallbacks: tag → fallback tags → nearest corner — Andrew, Oct 8 / Nov 3')}</section>` : ''}
          ${mapFilter === 'all' && !nearGems.length && !rural ? `<p class="hint">${ic('pin')} ${esc(LOOPS.allGemsEmpty)}</p>` : ''}
          ${nearGems.length ? `<section><p class="kicker section">${esc(GEMS.nearK)}</p>${nearGems.map((g) => { const t = O.gemRarity === 'finds' || O.gemRarity === 'votes' ? gemTier(g) : null; return `<button class="lrow" data-go="gem-view" data-p='{"id":"${g.id}"}'>${gemSvg(g.type, 26)}<b>${esc(g.name)}</b><span>${esc(GEMS.away(g.dist))} · ${esc(g.friend ? GEMS.view.friend(g.by) : GEMS.view.by(g.by))}${t ? ` · ${esc(t.name)}` : ''}</span>${ic('chev')}</button>`; }).join('')}${src('Gems within a 5-minute walk; “left by @name” — Gems Nearby review + Location gems ideation, Jul')}</section>` : ''}
          ${pins.length ? `<section><p class="kicker section">${esc(MAP.startsList)}</p>${pins.map((p) => `<button class="lrow" data-sheet="pin" data-p='{"id":"${p.s.id}"}' style="--jewel:${p.s.accent}">${thumb(p.s, 't-row')}<b>${esc(p.s.title)}</b><span>${esc(badgeOf(p.s))}</span>${ic('chev')}</button>`).join('')}</section>` : ''}
          <section><p class="kicker section">${esc(MAP.nearList)}</p><p class="hint">${esc(MAP.nearListSub)}</p>${nearIds.map((id) => byId[id]).map((s) => `<button class="lrow" data-go="overview" data-id="${s.id}" style="--jewel:${s.accent}">${thumb(s, 't-row')}<b>${esc(s.title)}</b><span>${esc(timeLabel(s))} · ${esc(badgeOf(s))}</span>${ic('chev')}</button>`).join('')}</section>
          <div class="btns"><button class="btn primary" data-go="routes" data-p='{"cook":1}'>${esc(MAP.cook)}</button></div>
        </div>
      </section>
    </div>`;
  },
  mount() {
    const c = $('#fogc');
    if (c) mountFog(c, { look: O.fogLook, paths: isRural() ? RURAL_WALKED : WALKED, home: S.loc !== 'far' && hideHome() });
  },
});
regSheet('fogLooks', () => ({
  jewel: '#C49BFF', label: 'Fog look',
  html: `<p class="kicker">${ic('cloud')} Fog look</p><h3>How should the unexplored map look?</h3>
    <div class="looks">${FOG_LOOKS.map((l) => `<button class="lookrow ${O.fogLook === l.k ? 'on' : ''}" data-act="fogLook" data-v="${l.k}" aria-pressed="${O.fogLook === l.k}"><i class="lk-sw lk-${l.k}"></i><b>${esc(l.name)}</b><span>${esc(l.what)}</span></button>`).join('')}</div>
    ${src('Six looks from the fog-mode experiment (story-city.github.io/experiments/fog-mode); Cloud sea is Melissa’s favourite')}`,
}));
regSheet('pin', (p) => {
  const s = byId[p.id];
  return {
    jewel: s.accent, label: s.title,
    html: `${thumb(s, 't-sheet')}<p class="kicker">${esc(SHEETS_W.pinK)} · ${esc(catOf(s))}</p><h3>${esc(s.title)}</h3><p class="hook">${esc(s.hook)}</p>
      <p class="meta">${esc(s.start ? OVERVIEW.startsAt(s.start) : badgeOf(s))} · ${esc(MAP.routePreview(s.km.toFixed(1), s.mins[0], s.chapters))}</p><p class="hint">${esc(MAP.routeNote)}</p>
      <p class="safety">${ic('check')} ${esc(MAP.safety)}</p>
      <div class="btns"><button class="btn primary" data-go="overview" data-id="${s.id}">${esc(MAP.openStory)}</button>
      <div class="row2"><button class="btn ghost small" data-act="moveStop">${ic('move')} ${esc(MAP.moveStop)}</button><button class="btn ghost small" data-sheet="report">${ic('flag')} ${esc(MAP.report)}</button></div></div>
      ${src('Long-press shows the route as unnamed dots + distance and time — Melissa Oct 14')}${solves('p6')}`,
  };
});
regSheet('report', () => ({
  jewel: '#FF4F79', label: SHEETS_W.reportTitle,
  html: `<p class="kicker">${esc(SHEETS_W.reportK)}</p><h3>${esc(SHEETS_W.reportTitle)}</h3><div class="choices">${SHEETS_W.reportRows.map((r) => `<button class="choice" data-act="reportDone"><b>${esc(r)}</b></button>`).join('')}</div>${solves('p6')}`,
}));

// ================================================================== LIBRARY
// the Library opens on the View by you last used, across tabs and reloads (Melissa, Nov 5). Shelves / Feed is O.libView, saved with the options.
const LIBBY_KEY = 'sc-everyday-libby';
let libQuery = '', libFilter = null, swipeI = 0, libBy = (() => { try { const v = localStorage.getItem(LIBBY_KEY); return v === 'where' || (v && ['length', 'genre', 'mode', 'inter'].includes(v)) ? v : 'where'; } catch (e) { return 'where'; } })();
// "View by" groupings for the shelves view (Melissa, Nov 4). Interactivity uses the mockup's guessed
// 1–3 scores until Emily's Listen / Light / Some / Lots ratings land in the Master Adventure List.
const GENRE_BUCKET = (g) => (/spook|ghost/i.test(g) ? 'Spooky' : /myster|heist|spy/i.test(g) ? 'Mystery and puzzles' : /fantasy|riddle/i.test(g) ? 'Fantasy'
  : /sci-fi/i.test(g) ? 'Sci-fi' : /family/i.test(g) ? 'Family and funny' : 'History and real life');
const VIEW_BY = {
  length: { label: 'Length', groups: ['Under 20 min', '20–45 min', 'Over 45 min'], of: (s) => (s.mins[0] <= 20 ? 'Under 20 min' : s.mins[1] <= 45 ? '20–45 min' : 'Over 45 min') },
  genre: { label: 'Genre', groups: ['Mystery and puzzles', 'Fantasy', 'Spooky', 'Family and funny', 'Sci-fi', 'History and real life'], of: (s) => GENRE_BUCKET(s.genre) },
  mode: { label: 'Mode', groups: ['Best in Steps', 'Best in Path', 'Best in Hunt', 'Any mode'], of: (s) => ({ walk: 'Best in Steps', path: 'Best in Path', hunt: 'Best in Hunt' }[bestMode(s)] || 'Any mode') },
  inter: { label: 'Interactivity', groups: ['Just Listen', 'Light', 'Some', 'Lots'], of: (s) => interScale(s) },   // the same helper as the overview tile
};
const atHome = (s) => (s.sit && !s.cafe) || (s.step === 'yes' && s.cat !== 'local' && !s.needs);
const padOk = (s) => s.step === 'yes' && s.cat !== 'local' && !s.needs;
// homePlay off: the At Home chip is gone, and "indoor", "cold" and Rainy day mean the treadmill instead
const homeish = (s) => (homeOff() ? padOk(s) : atHome(s));
const libFilters = () => LIBRARY.filters.filter((x) => !(homeOff() && x.id === 'home'));
function libFilterFn(s) {
  if (!libFilter || (libFilter === 'home' && homeOff())) return true;
  if (libFilter === 'near') return (['anywhere', 'nearyou'].includes(s.cat) || !!localHere(s)) && ruralOk(s) && !(isRural() && s.cat === 'nearyou');
  if (libFilter === 'home') return atHome(s);
  if (libFilter === 'tread') return s.step === 'yes' && s.cat !== 'local' && !s.needs;
  if (libFilter === 'stepfree') return !!s.access && /step-free/i.test(s.access);
  if (libFilter === 'short') return s.mins && s.mins[0] <= 20;
  if (libFilter === 'kids') return s.age === 'G' || s.tags.includes('kids');
  if (libFilter === 'steps') return s.step === 'yes';
  return true;
}
const ALIAS = {
  'river valley': ['dragons', 'kindness', 'cnoy'], indoor: 'home', treadmill: 'tread', cold: 'home', pad: 'tread', farm: 'anywhereStep', rural: 'anywhereStep',
  bench: 'stepfree', 'step-free': 'stepfree', wheelchair: 'stepfree', accessible: 'stepfree',
};
function searchHits(q) {
  const t = q.toLowerCase().trim();
  const mood = { 'rainy day': (s) => homeish(s), 'with kids': (s) => s.age === 'G', 'date night': (s) => s.tags.some((x) => ['date', 'spooky', 'mystery'].includes(x)), spooky: (s) => s.tags.includes('spooky'), 'under 20 min': (s) => s.mins && s.mins[0] <= 20, puzzles: (s) => s.inter === 3 };
  const a = ALIAS[t];
  let hits;
  if (mood[t]) hits = STORIES.filter(mood[t]);
  else if (Array.isArray(a)) hits = a.map((id) => byId[id]);
  else if (a === 'home') hits = STORIES.filter(homeish);
  else if (a === 'tread') hits = STORIES.filter((s) => s.step === 'yes' && s.cat !== 'local' && !s.needs);
  else if (a === 'stepfree') hits = STORIES.filter((s) => s.access && /step-free/i.test(s.access));
  else if (a === 'anywhereStep') hits = STORIES.filter((s) => s.cat === 'anywhere' && s.step === 'yes');
  else hits = STORIES.filter((s) => [s.title, s.genre, s.city, s.place, s.hook, s.creator, s.start].join(' ').toLowerCase().includes(t));
  return hits.filter((s) => !s.coming || t === 'balthazar').sort((x, y) => (localHere(x) || 99) - (localHere(y) || 99));
}
// Feed view: the app's full-height FeedStoryCard (2:3 cover, details, Start Adventure), plus a
// line from the story's own opening in the character's voice, with a voice-over button.
const feedRank = (s) => (s.coming ? 9 : localHere(s) ? 0 : { anywhere: 1, nearyou: 2, passport: 3 }[s.cat] || 4);
function feedCard(s) {
  const on = S.myList.includes(s.id);
  const art = coverOf(s) ? `<img class="wash" src="${coverOf(s)}" alt=""><img class="fposter" src="${coverOf(s)}" alt="${esc(s.title)} cover" loading="lazy">` : `<span class="fposter none" style="--jewel:${s.accent}"><b>${esc(s.title)}</b></span>`;
  const line = s.cold && s.cold.length ? s.cold.join(' ') : s.hook;
  const vo = s.format === 'audio' ? LIBRARY.feedVoAudio : LIBRARY.feedNoVo;
  return `<article class="fcard" style="--jewel:${s.accent}">
    <div class="fart">${art}</div>
    <div class="fdet">
      ${s.coming ? '' : `<figure class="living snip"><blockquote>${esc(line)}</blockquote><figcaption>${esc(s.char || s.creator)} · <i>${esc(s.title)}</i>
        <button class="vo" data-act="vo" data-who="${esc(s.char || 'the narrator')}" aria-label="${esc(LIBRARY.feedHear)}">${ic('play')}<span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>${esc(LIBRARY.feedHear)}</button></figcaption>
        <p class="solves">VO: ${esc(vo)}${s.coldNote ? ` · line ${esc(s.coldNote)}` : ' · line from the story'}</p></figure>`}
      <p class="kicker">${esc(catOf(s))} · ${esc(s.genre || '')}${s.age ? ` · ${esc(s.age)}` : ''}</p>
      <h2 class="ftitle">${esc(s.title)}</h2>
      <p class="fby">by ${esc(s.creator.split(',')[0])}</p>
      <p class="meta">${esc(s.coming ? CARD.coming(s.coming) : [timeLabel(s), badgeOf(s), s.inter ? (O.inter === 'dots' ? interLabel(s) : `Interactivity: ${interLabel(s)}`) : ''].filter(Boolean).join(' · '))}</p>
      <div class="frow">${s.coming ? `<button class="btn primary" data-act="notify">Notify Me</button>` : `<button class="btn primary" data-act="startStory" data-id="${s.id}">${ic('play')} ${esc(LIBRARY.feedStart)}</button>`}
        <button class="ibtn" data-act="fheart" data-id="${s.id}" aria-pressed="${on}" aria-label="${esc(on ? OVERVIEW.hearted : OVERVIEW.heart)}">${ic('heart')}</button>
        <button class="ibtn" data-go="overview" data-id="${s.id}" aria-label="About this story">${ic('info')}</button></div>
    </div>
  </article>`;
}

// Coming Soon: one full-width card at a time, arrows to flip through trailers (Melissa, Nov 4)
let comingI = 0;
export const coming = { step(d) { comingI = (comingI + d + COMING.length) % COMING.length; } };
const COMING = [
  { id: 'balthazar', k: 'Coming Nov 12', title: 'The Balthazar Job', by: 'Kevin · DiceCreamSandwich', line: 'Kevin’s first Story City heist. Walk it the day it drops.', src: 'Creator launch ~Nov 12 — Emily, Nov 3' },
  { id: 'incident', k: 'Episode 5 · coming soon', title: 'Tales from the Incident', by: 'Story City Stories', line: 'Episodes 1–4 are out. The next walk picks up where Cye left off.', src: 'Episodes 5–6 not live yet (public story API); date is a guess' },
];
function comingGallery() {
  const c = COMING[comingI], st = byId[c.id];
  return `<section class="shelf-sec coming-sec"><div class="shelf-head"><h2 class="kicker section">${esc(LIBRARY.rows.coming)}</h2></div>
    <div class="cg-wrap"><button class="cg-arrow" data-act="comingNav" data-d="-1" aria-label="Previous">${ic('back')}</button>
    <div class="cgal" style="--jewel:${st.accent}">${thumb(st, 't-cg')}
      <div class="cg-body"><p class="kicker">${esc(c.k)}</p><b class="cg-title">${esc(c.title)}</b><span class="cg-by">${esc(c.by)}</span><p class="cg-line">${esc(c.line)}</p>
        <div class="cg-btns"><button class="btn primary small" data-act="toast" data-t="Trailer plays here: 30 seconds, sound on.">${ic('play')} Trailer</button><button class="btn ghost small" data-act="notify">Notify Me</button></div></div></div>
    <button class="cg-arrow flip" data-act="comingNav" data-d="1" aria-label="Next">${ic('back')}</button></div>
    <div class="cg-dots" aria-hidden="true">${COMING.map((_, i) => `<i class="${i === comingI ? 'on' : ''}"></i>`).join('')}</div>${src(`${c.src}; gallery — Melissa, Nov 4`)}</section>`;
}

reg('library', {
  tab: 'library',
  html(p) {
    const C = LIBRARY.rows;
    const f = (ids) => ids.filter((id) => libFilterFn(byId[id]));
    let body = '';
    if (libQuery) {
      const hits = searchHits(libQuery).filter(libFilterFn);
      body = `<p class="kicker section">${esc(LIBRARY.results(hits.length, libQuery))}</p>${hits.length ? `<div class="cards">${hits.map((s) => storyCard(s)).join('')}</div>` : `<div class="empty"><b>${esc(LIBRARY.empty)}</b><span>${esc(homeOff() ? NOHOME.emptySub : LIBRARY.emptySub)}</span></div>`}`;
    } else if (O.libView === 'shelves' && libBy !== 'where') {
      const V = VIEW_BY[libBy], all = STORIES.filter((x) => !x.coming && libFilterFn(x));
      body = V.groups.map((g) => shelf(g, all.filter((x) => V.of(x) === g).map((x) => x.id))).join('') + src(libBy === 'inter' ? 'Interactivity is a guess for now; Emily is rating every story (Notion task, Nov 4)' : 'View by — Melissa, Nov 4');
    } else if (O.libView === 'feed') {
      const all = STORIES.filter(libFilterFn).sort((a, b) => feedRank(a) - feedRank(b));
      body = `<div class="lfeed" aria-label="${esc(LIBRARY.view.feed)}">${all.map(feedCard).join('')}<p class="hint centre fend">${esc(LIBRARY.feedEnd)}</p></div>${src('Feed view: the app’s Feed tab cards (FeedStoryCardCarousel), in the Library — Melissa, Nov 4')}${idea('a voiced line from each story (Melissa, Nov 4)')}`;
    } else if (O.libView === 'swipe') {
      const all = STORIES.filter(libFilterFn);
      const s = all[swipeI % all.length];
      body = `<div class="swipe">${storyCard(s, { cls: 'hero', hook: true })}<div class="row2"><button class="btn ghost small" data-act="swipe" data-d="-1">${esc(LIBRARY.prev)}</button><button class="btn ghost small" data-act="swipe" data-d="1">${esc(LIBRARY.next)}</button></div><p class="hint centre">${esc(LIBRARY.swipeHint)} · ${swipeI % all.length + 1} / ${all.length}</p>${src('Library view toggle — Brett, Oct 8')}</div>`;
    } else {
      const four = O.cats === 'four';
      const anywhere = ['incident', 'squeaky', 'frightnight', 'omicron', 'knight', 'summons'].concat(four ? [] : ['alice', 'spy', 'pirate']);
      const localIds = ['coronet', 'dragons', 'kindness', 'dynasty', 'cnoy', 'parable', 'tustin'];
      const near = localIds.filter((id) => localHere(byId[id])).sort((a, b) => localHere(byId[a]) - localHere(byId[b]));
      const far = localIds.filter((id) => !near.includes(id));
      const upn = O.upNext === 'none' ? [] : O.upNext === 'queue' ? [...S.upNext, 'adelaide', 'squeaky'].slice(0, 3) : S.upNext.slice(0, 1);
      const farShelf = shelf(inCanada() ? C.localFar : 'Stories set in other cities', f(far));
      body = shelf(C.progress, f(Object.keys(S.progress)))
        + (upn.length ? shelf(C.upnext, f(upn), { note: src(O.upNext === 'queue' ? 'Up Next stack — after-walk mockup' : 'One locked-in story — Golden Path page') }) : '')
        + comingGallery()
        // Wish List: always here, first row under Coming Soon; one compact line when it's empty (Melissa, Nov 5)
        + (S.myList.length ? shelf(C.mylist, f(S.myList), { note: src('Heart any story into your Wish List — Melissa Oct 28 / Nov 5') })
          : `<section class="shelf-sec wish-empty"><div class="shelf-head"><h2 class="kicker section">${esc(C.mylist)}</h2></div><p class="hint">${esc(C.mylistEmpty)}</p></section>`)
        + shelf(C.anywhere, f(anywhere))
        + (four && !isRural() ? shelf(C.nearyou, f(['alice', 'spy', 'pirate', 'barista'])) : '')
        + shelf(C.passport, f(['chase', 'adelaide', 'cookout']), { tip: LIBRARY.passportTip })
        + shelf(C.local, f(near))
        + (inCanada() ? farShelf : '')
        + shelf(C.sit, f(['laundromat']), { note: src('Barista moved out: it needs a short café walk (C13)') })
        + shelf(C.together, f(['dynasty', 'frightnight', 'summons', 'spy', 'coronet']))
        + (S.city !== 'Lagos' ? shelf(C.seasonal, f(['frightnight', 'tustin'])) : '')
        + `<section class="shelf-sec"><div class="shelf-head"><h2 class="kicker section">${esc(C.whimsy)}</h2><button class="link" data-go="whimsy">${esc(LIBRARY.seeAll)}</button></div><div class="row-scroll">${['cat', 'bingo', 'lights', 'mall'].filter((k) => k !== 'lights' || S.city !== 'Lagos').map((k) => { const w = WHIMSY.walks[k]; return `<button class="walk quest" style="--jewel:${w.jewel}" data-act="whimsyGo" data-id="${k}"><span class="mech">${esc(w.mech)}</span><span class="title">${esc(w.name)}</span></button>`; }).join('')}</div></section>`
        + shelf(C.finished, Object.keys(S.finished), { card: { meta: LIBRARY.endings(1, 3) } })
        + (inCanada() ? '' : farShelf);
    }
    const chips = libFilters().map((x) => chip(x.t, libFilter === x.id, `data-act="libFilter" data-v="${x.id}"`)).join('') + LIBRARY.moods.map((m) => chip(m, libQuery === m, `data-act="mood" data-v="${esc(m)}"`)).join('');
    const nextView = O.libView === 'feed' ? 'shelves' : 'feed';   // one icon, top right: switch between Shelves and Feed
    return `${tabHead(O.tabs === 'sgw' || O.tabs === 'nov26' ? TABS.stories : LIBRARY.title, { right: `<button class="ibtn" data-act="libView" data-v="${nextView}" aria-label="Show as ${esc(LIBRARY.view[nextView])}" title="Show as ${esc(LIBRARY.view[nextView])}">${ic(nextView === 'feed' ? 'feed' : 'library')}</button>` })}
      ${!libQuery ? `<section class="helppick hp2" aria-label="Help me pick"><span class="g-av">${esc(BOT[0])}</span><div class="hp-body"><b>Help Me Pick</b><span>${esc(FITS.energyQ)}</span>${O.energyUi === 'slider' ? `<input type="range" id="enRange" class="en-range" min="0" max="3" step="1" value="2" aria-label="Energy: Some" style="--p:67%"><div class="en-scale" aria-hidden="true">${FITS.energies.map((t) => `<span>${esc(t.t)}</span>`).join('')}</div><button class="btn primary small en-go" data-act="helpPick" data-v="stroll">Pick for Me</button>` : `<div class="hp-btns">${FITS.energies.map((t) => `<button data-act="helpPick" data-v="${t.id}">${esc(t.t)}</button>`).join('')}</div>`}</div></section>${src('Energy on the Help Me Pick card: Low → two quick options; Medium/High → time/steps and company (Melissa, Nov 4)')}` : ''}
      ${O.libView === 'shelves' && !libQuery ? `<div class="viewby" role="group" aria-label="View by"><span>View by</span><div class="seg minis">${[['where', 'Place']].concat(Object.entries(VIEW_BY).map(([k, v]) => [k, v.label])).map(([k, t]) => `<button class="${libBy === k ? 'on' : ''}" data-act="libBy" data-v="${k}" aria-pressed="${libBy === k}">${esc(t)}</button>`).join('')}</div></div>` : ''}
      <label class="search">${ic('search')}<input type="search" id="libq" placeholder="${esc(LIBRARY.search)}" value="${esc(libQuery)}" aria-label="${esc(LIBRARY.search)}" ${p.focus ? 'autofocus' : ''}>${libQuery ? `<button class="link" data-act="libClear">${esc(LIBRARY.clear)}</button>` : ''}</label>
      <div class="chips scrollx" aria-label="Filters">${chips}</div>
      ${solves('p4')}${src('One row of filters and moods; At Home = no venue needed; Treadmill and Step-Free added (A13, C9)')}
      ${body}<div class="tabpad"></div>`;
  },
  mount(p, el) {
    const q = $('#libq', el);
    if (q) {
      q.addEventListener('input', () => { libQuery = q.value.trim(); clearTimeout(q._t); q._t = setTimeout(() => { rerender(); const n = $('#libq'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 250); });
      if (p.focus) setTimeout(() => q.focus(), 60);
    }
  },
});
export const lib = { set by(v) { libBy = VIEW_BY[v] ? v : 'where'; try { localStorage.setItem(LIBBY_KEY, libBy); } catch (e) {} }, set q(v) { libQuery = v; }, set f(v) { libFilter = v; }, get f() { return libFilter; }, swipe(d) { swipeI = Math.max(0, swipeI + d); } };

// ================================================================== FEED
const cheered = new Set();
function feedPost(x, i) {
  return `<article class="post" style="--jewel:${x.jewel || '#C49BFF'}">
      <header>${x.gem ? gemSvg(x.gem, 28) : `<span class="pav">${esc(x.who[0])}</span>`}<div><b>${esc(x.who)}</b>${x.kind === 'character' ? `<small>in ${esc(x.story)}</small>` : ''}</div><time>${esc(x.when)}</time></header>
      <p class="post-what">${esc(x.what)}</p><p class="post-d">${esc(x.detail)}</p>
      <div class="post-act">${x.gemId && S.gems.some((g) => g.id === x.gemId && !g.hidden) ? `<button class="btn ghost small" data-go="gem-view" data-p='{"id":"${x.gemId}"}'>${esc(GEMS.seeGem)}</button>` : ''}${x.kind === 'creator' && x.story === 'balthazar' ? `<button class="btn ghost small" data-act="notify">${esc(FEED.notify)}</button><button class="btn ghost small" data-sheet="creator" data-p='{"who":"kevin"}'>${esc(MORE.creator.k)}</button>` : x.story && byId[x.story] && x.kind !== 'character' ? `<button class="btn ghost small" data-go="overview" data-id="${x.story}">${esc(OVERVIEW.free)}</button>` : ''}
      ${(() => { const g = x.gemId && S.gems.find((q) => q.id === x.gemId); if (g) return `<button class="cheer" data-act="gemCheer" data-id="${g.id}" aria-pressed="${!!g.cheered}">${sparkle(14)} ${esc(g.cheered ? FEED.cheered : FEED.cheer)}</button>`; return x.kind === 'friend' || x.kind === 'community' ? `<button class="cheer" data-act="cheer" data-i="${i}" aria-pressed="${cheered.has(i)}">${sparkle(14)} ${esc(cheered.has(i) ? FEED.cheered : FEED.cheer)}</button>` : ''; })()}</div>
    </article>`;
}
reg('feed', {
  tab: 'feed',
  html() {
    const groups = [['friend', FEED.friends], ['character', FEED.characters], ['community', FEED.community], ['creator', FEED.creators], ['new', FEED.newStories]];
    const w = WHIMSY.walks.cat;
    const posts = FEED.posts.map((x, i) => [{ ...x, when: ageWhen(x.when) }, i]).filter(([x]) => !(x.kind === 'community' && !othersNear()) && !(x.kind === 'friend' && !S.friends.includes(x.who)));
    return `${tabHead(FEED.title, { kicker: FEED.sub, right: `<button class="ibtn" data-sheet="friend" aria-label="${esc(FEED.addFriend)}">${ic('people')}</button>` })}
      <button class="walk quest wide feedtop" style="--jewel:${w.jewel}" data-act="whimsyGo"><span class="mech">${esc(FEED.todayTop)}</span><span class="title">${esc(w.name)}</span><span class="meta">${esc(TODAY.whimsySame)}</span></button>
      ${src('Today’s Whimsy Walk is always the top item on the feed — Melissa, Nov 2')}
      ${S.friends.length ? '' : `<div class="empty-note invite"><p>${esc(LOOPS.inviteAround)}</p><button class="btn ghost small" data-sheet="friend">${esc(FEED.addFriend)}</button></div>`}
      ${groups.map(([k, t]) => { const items = posts.filter(([x]) => x.kind === k); return items.length ? `<section><p class="kicker section">${esc(t)}${k === 'friend' ? ` <span class="pill-mini">${ic('lock')} ${esc(FEED.friendsOnly)}</span>` : ''}</p>${items.map(([x, i]) => feedPost(x, i)).join('')}</section>` : ''; }).join('')}
      ${src('Today feed: friends, shared results, new stories, gems near you — Nov 2; character posts — Oct 28; creators front and centre — Nov 3')}${solves('p10')}
      <div class="btns"><button class="btn ghost" data-sheet="friend">${esc(FEED.addFriend)}</button></div>
      <div class="thats">${sparkle(16, 'var(--glow)')}<p class="thats-t">${esc(FEED.caught)}</p><p class="hint centre">${esc(FEED.caughtSub)}</p></div>
      <div class="tabpad"></div>`;
  },
});
export const feedCheer = (i) => { cheered.has(i) ? cheered.delete(i) : cheered.add(i); };
// Add a Friend: your real code, Reset My Code, a working Enter a Code (loops build 5)
export const frUI = { input: '', confirm: null, err: '' };
regSheet('friend', () => {
  const F2 = MORE.friend, L = LOOPS.friend;
  return {
    jewel: '#C49BFF', label: F2.title, cls: 'tall',
    html: `<p class="kicker">${esc(F2.k)}</p><h3>${esc(F2.title)}</h3><p class="more">${esc(F2.sub)}</p>
      <p class="lbl">${esc(L.codeK)}</p><p class="code mycode">${esc(myCode())}</p>
      <div class="row2"><button class="btn primary small" data-sheet="shareCode">${esc(F2.share)}</button><button class="btn ghost small" data-act="frReset">${esc(L.reset)}</button></div>
      ${nameFreeNote()}
      <label class="lbl" for="frcode">${esc(L.theirCode)}</label>
      <div class="gm-reply"><input class="field" id="frcode" autocomplete="off" autocapitalize="characters" maxlength="16" placeholder="${esc(L.codePh)}" value="${esc(frUI.input)}"><button class="btn primary small inl" data-act="frCode">${esc(L.add)}</button></div>
      <button class="tg-chip" data-act="frNow" aria-pressed="${!!S.frNow}">${ic(S.frNow ? 'check' : 'people')} <span><b>${esc(LOOPS.inPerson.now)}</b><small>${esc(LOOPS.inPerson.sub)}</small></span></button>
      ${frUI.err ? `<p class="hint warn">${esc(frUI.err)}</p>` : ''}
      ${frUI.confirm ? `<div class="frconfirm"><span class="pav">${esc(frUI.confirm[0])}</span><div><b>${esc(L.confirm(frUI.confirm))}</b><small>${esc(L.confirmSub)}</small></div></div>
        <div class="row2"><button class="btn primary small" data-act="frAdd">${esc(L.addBtn)}</button><button class="btn ghost small" data-act="frNo">${esc(L.notNow)}</button></div>` : ''}
      <div class="mocktray"><span>${esc(L.mockK)}</span>${['JESS-2290', 'SAM-4821', 'AMA-1180'].filter((c) => !c.startsWith(myCode().split('-')[0] + '-')).map((c) => `<button data-act="frTry" data-v="${c}">${c}</button>`).join('')}</div>
      <p class="lbl">${esc(L.yours)}</p>
      ${S.friends.length || S.pending.length ? `<div class="frlist">${S.friends.map((f) => `<span class="frchip"><span class="pav">${esc(f[0])}</span>${esc(f)}</span>`).join('')}${S.pending.map((f) => `<span class="frchip pending"><span class="pav">${esc(f[0])}</span>${esc(L.pending(f))}</span>`).join('')}</div>` : `<p class="hint">${esc(L.none)}</p>`}
      <p class="hint">${ic('lock')} ${esc(F2.only)}</p>${S.teen ? `<p class="hint">${esc(F2.teen)}</p>` : ''}
      ${src('Codes from your name plus 4 digits, with a reset — Pikmin Bloom friend codes; loops brief Friends #1 (11 of 12 pairs)')}${src('Under 16 and guests: a name-free code — social retest (Amara), distance retest (Maya’s guest code said SAM)')}${src('Side by side? The add is instant — groups retest (Priya & Sam)')}${src('Friends feed, never public; under-16 safeguards (tester B6, B9)')}`,
    mount(sh) { const i = sh.querySelector('#frcode'); if (i) { i.addEventListener('input', () => { frUI.input = i.value; }); i.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sh.querySelector('[data-act="frCode"]').click(); } }); } },
  };
});
const nameFreeNote = () => (S.teen ? `<p class="hint">${ic('lock')} ${esc('Under 16, your code has no name in it.')}</p>` : '');
// Share My Code: a real preview, WhatsApp first in Lagos (pass 2: Chinedu)
regSheet('shareCode', () => {
  const c = myCode(), A = LOOPS.apps;
  const apps = S.city === 'Lagos' ? [A.whatsapp, A.messages, A.copy] : [A.messages, A.whatsapp, A.copy];
  return {
    jewel: '#C49BFF', label: LOOPS.shareCodeK,
    html: `<p class="kicker">${ic('share')} ${esc(LOOPS.shareCodeK)}</p><h3>${esc(c)}</h3>
      <div class="msgprev"><p>${esc(LOOPS.shareMsg(c))}</p><small>${esc(LOOPS.shareLink(c))}</small></div>
      <div class="row3 apps">${apps.map((a) => `<button class="btn ${a === apps[0] ? 'primary' : 'ghost'} small" data-act="appShare" data-v="${esc(a)}">${esc(a)}</button>`).join('')}</div>
      <p class="hint">${ic('lock')} ${esc(MORE.friend.only)}</p>
      ${src('A share preview, WhatsApp first in Lagos — lowtech retest (Chinedu)')}`,
  };
});
// Share Doodle: send it to one named friend, or copy a link (pass 2: Gord, groups)
regSheet('shareDoodle', () => {
  const d = S.myDoodle || { n: 5 }; const w = walkDef(d.id && d.id !== 'roulette' ? d.id : walkIdFor());
  return {
    jewel: w.jewel, label: LOOPS.shareDoodleK, cls: 'tall',
    html: `<p class="kicker">${ic('share')} ${esc(LOOPS.shareDoodleK)}</p><h3>${esc(LOOPS.shareDoodleT)}</h3><p class="more">${esc(LOOPS.shareDoodleSub)}</p>
      <div class="sd-card" style="--jewel:${w.jewel}">${myDoodleSvg(d)}<div><b>${esc(d.id === 'roulette' ? WHIMSY.roulette : walkName(d.id || walkIdFor()))}</b><small>${esc(`${S.dow} · ${d.wt ? d.wt : S.name}`)}</small></div></div>
      ${S.friends.length ? `<div class="gm-friends">${S.friends.map((f) => `<div class="gm-fr"><span class="pav">${esc(f[0])}</span><b>${esc(f)}</b><button class="btn ghost small" data-act="sendTo" data-v="${esc(f)}">${esc(GEMS.send)}</button></div>`).join('')}</div>` : `<div class="empty-note invite"><p>${esc(LOOPS.shareFirst)}</p><button class="btn ghost small" data-sheet="shareCode">${esc(LOOPS.shareFirstBtn)}</button></div>`}
      ${S.teen ? '' : `<div class="row2"><button class="btn ghost small" data-act="appShare" data-v="${esc(LOOPS.apps.copy)}">${esc(LOOPS.apps.copy)}</button><button class="btn ghost small" data-act="storySize">${esc(LOOPS.storySize)}</button></div>`}
      ${src('Send to one named friend, not just a toast — lowtech retest (Gord: “nothing can go to Jess”)')}`,
  };
});
// a friend's doodle: side by side with yours, a count compare, a cheer, a set reply, Walk With Me (pass 2: social, distance)
regSheet('doodleFriend', (p) => {
  const id = walkIdFor(), w = walkDef(id), mine = S.whimsyDone && S.myDoodle;
  const n = w.max ? 2 + (p.n % 8) : p.n, me = mine ? S.myDoodle.n : 0, on = !!S.cheeredD[p.key];
  const sent = S.stickers[p.key];
  return {
    jewel: w.jewel, label: p.who, cls: 'tall',
    html: `<p class="kicker">${esc(LOOPS.doodleK)} · ${esc(walkName(id))}</p><h3>${esc(mine ? LOOPS.bothWalked : w.friend(p.who, n))}</h3>
      <div class="dd-pair"><figure>${doodle(p.n, p.who + ':' + S.day)}<figcaption>${esc(firstName(p.who))}</figcaption></figure>${mine ? `<figure>${myDoodleSvg(S.myDoodle)}<figcaption>You</figcaption></figure>` : ''}</div>
      ${mine ? `<p class="statline centre">${esc(LOOPS.compareShort(firstName(p.who), n, me))}</p>` : ''}
      <p class="hint centre">${esc(LOOPS.noDistance)}</p>
      <div class="post-act"><button class="cheer" data-act="cheerD" data-k="${esc(p.key)}" data-re="${esc(JSON.stringify(p))}" aria-pressed="${on}">${sparkle(14)} ${esc(on ? FEED.cheered : FEED.cheer)}</button></div>
      <p class="lbl">${esc('Send a reply')}</p><div class="chips wrap">${LOOPS.stickers.map((t) => `<button class="chip" aria-pressed="${sent === t}" data-act="sticker" data-v="${esc(t)}" data-who="${esc(p.who)}" data-k="${esc(p.key)}" data-re="${esc(JSON.stringify(p))}">${esc(t)}</button>`).join('')}</div>
      <p class="hint">${esc(LOOPS.stickerNote)}</p>
      <div class="btns">${mine ? '' : `<button class="btn primary" data-act="whimsyGo">${esc(TODAY.doIt)}</button>`}<button class="btn ghost" data-act="wtOpen" data-v="whimsy" data-with="${esc(p.who)}">${ic('people')} ${esc(LOOPS.walkWithMe)}</button></div>
      ${src('Doodle cards open: “Ama 12 · you 3”, side by side when you both walked — social + distance retests; set replies, not free text (safe for teens)')}`,
  };
});
// Take Me Home from any walk outside (pass 2: Gord, Chinedu)
regSheet('takeHome', (p) => ({
  jewel: '#5B8CFF', label: LOOPS.homeK,
  html: `<p class="kicker">${ic('home')} ${esc(LOOPS.homeK)}</p><p class="big">${esc(LOOPS.homeT(Math.max(3, Math.round((p.mins || 6) / 2))))}</p>
    <div class="btns"><button class="btn primary" data-act="${p.to === 'roulette' ? 'rlDone' : 'whimsyFinish'}" data-home="1">${ic('home')} ${esc(LOOPS.homeGo)}</button><button class="btn ghost" data-close>${esc(LOOPS.keepWalking)}</button></div>
    ${src('Take Me Home with the way back — lowtech retest (Gord won’t walk outside without it); brief listed it as later')}`,
}));
// a Trip page for visitors (pass 2: Hannah)
regSheet('trip', () => {
  const T = LOOPS.trip, mine = S.gems.filter((g) => g.mine && !g.hidden), found = S.gems.filter((g) => g.found);
  return {
    jewel: '#00CD9D', label: T.k(S.city), cls: 'tall',
    html: `<p class="kicker">${ic('map')} ${esc('Trip page')}</p><h3>${esc(T.k(S.city))}</h3><p class="statline">${esc(T.line(mine.length, found.length, S.tripWalks || 0))}</p>
      <div class="since-list">${mine.concat(found).map((g) => `<button class="since-row" data-go="gem-view" data-p='{"id":"${g.id}"}'>${gemSvg(g.type, 24)}<span>${esc(g.name)}${g.found ? ` · ${esc(LOOPS.foundStamp)}` : ''}</span>${ic('chev')}</button>`).join('') || `<p class="hint">${esc(LOOPS.foundNone)}</p>`}</div>
      <p class="hint">${esc(T.sub)}</p>
      <div class="btns"><button class="btn primary" data-act="toast" data-t="${esc(T.done)}">${ic('share')} ${esc(T.share)}</button></div>
      ${src('A Trip page that lasts after you leave — distance retest (Hannah); brief listed a Trip Book as later')}`,
  };
});
regSheet('creator', (p) => {
  const C2 = MORE.creator;
  const isKevin = p.who === 'kevin';
  const name = isKevin ? 'Kevin · DiceCreamSandwich' : p.name;
  const list = isKevin ? ['balthazar'] : STORIES.filter((s) => s.creator.split(',')[0] === p.name).map((s) => s.id);
  return {
    jewel: '#DA82ED', label: name, cls: 'tall',
    html: `<p class="kicker">${esc(C2.k)}</p><h3>${esc(name)}</h3>
      <div class="btns"><button class="btn ghost small" data-act="follow">${esc(C2.follow)}</button></div>
      <p class="kicker section">${esc(C2.stories)}</p><div class="row-scroll">${list.map((id) => storyCard(byId[id])).join('')}</div>
      ${isKevin ? `<p class="hint">${esc(C2.links)}</p>` : ''}
      <div class="btns"><button class="btn ghost" data-sheet="make">${esc(MORE.make.btn)}</button></div>
      ${src('Tap the creator to see their other stories — Emily, Nov 3 (tester C4)')}`,
  };
});
regSheet('make', () => {
  const M = MORE.make;
  return {
    jewel: '#00CD9D', label: M.title,
    html: `<p class="kicker">${esc(M.k)}</p><h3>${esc(M.title)}</h3><ol class="ticks num">${M.steps.map((x) => `<li>${ic('check')} ${esc(x)}</li>`).join('')}</ol>
      <div class="btns"><button class="btn primary" data-act="toast" data-t="${esc(M.note)}">${esc(M.go)}</button></div>${src('“Every user is a creator” — Melissa + Emily, Nov 3; gems → stories — Nov 3')}`,
  };
});

// ================================================================== YOU
// Profile tabs: Steps / Stories / Stamps (Melissa, Nov 4). Stamps = gems, seals, endings, passport stamps, badges.
let youTab = 'steps';
export const youUI = { set tab(v) { youTab = v; } };
reg('you', {
  tab: 'you',
  html(p) {
    const name = YOU.names[O.youName];
    const st = S.member === 'member' ? YOU.status.member : S.member === 'trial' ? YOU.status.trial(S.trialLeft) : S.member === 'free' ? YOU.status.free : YOU.status.guest;
    const week = S.stepsWeek.reduce((a, b) => a + b, 0);
    const story = Math.min(S.storySteps, week);
    const max = Math.max(...S.stepsWeek, 1);
    const counts = Object.fromEntries(GEM_TYPES.map((t) => [t, S.gems.filter((g) => g.mine && g.type === t).length]));
    const cur = curStory();
    const curS = cur ? byId[cur] : byId.knight;
    const remVal = S.rem.paused ? REMIND.paused(S.rem.paused) : !S.rem.on ? 'Off' : `At most ${S.rem.budget}`;
    return `<header class="tabhead"><div class="avatar big"><span>${esc(S.name[0])}</span></div><div class="th-mid"><p class="kicker">${esc(name)}</p><h1 class="display th-title">${esc(hasName() ? S.name : YOU.status.guest)}</h1></div><button class="ibtn" data-go="settings" aria-label="${esc(YOU.settings)}">${ic('gear')}</button></header>
      ${!hasName() && S.member === 'guest' ? '' : `<button class="status st-${S.member}" data-sheet="status">${esc(st)} ${ic('chev')}</button>`}${solves('p5')}
      ${!S.account ? `<div class="guestbar"><p>${esc(YOU.guest)}</p><button class="btn ghost small" data-go="account" data-p='{"mode":"re","next":"back"}'>${esc(YOU.signUp)}</button></div>` : ''}
      ${S.loc === 'far' ? `<button class="tripcard" data-sheet="trip"><span class="kicker">${ic('map')} ${esc('Trip page')}</span><b>${esc(LOOPS.trip.k(S.city))}</b><small>${esc(LOOPS.trip.line(S.gems.filter((g) => g.mine && !g.hidden).length, S.gems.filter((g) => g.found).length, S.tripWalks || 0))}</small>${ic('chev')}</button>` : ''}

      ${O.youLayout === 'galleries' ? youGalleries() : `
      <div class="seg minis youtabs" role="tablist" aria-label="Profile">${[['steps', 'Steps'], ['stories', 'Stories'], ['stamps', O.gemsTabName]].map(([k, t]) => `<button role="tab" class="${youTab === k ? 'on' : ''}" aria-selected="${youTab === k}" data-act="youTab" data-v="${k}">${t}</button>`).join('')}</div>
      <section id="sec-steps" ${youTab === 'steps' ? '' : 'hidden'}><p class="kicker section">${esc(YOU.steps)}</p>
        ${S.storyOnly ? `<p class="hint">${esc(YOU.storyOnlyLine)}</p>` : `<p class="big">${esc(YOU.stepsWeek(n0(week)))}</p><p class="hint">${esc(YOU.stepsSplit(n0(story), n0(Math.max(0, week - story))))}</p>
        <div class="bars" role="list" aria-label="Steps per day this week">${S.stepsWeek.map((v, i) => `<div role="listitem" class="sbar ${i === S.wd ? 'today' : ''}" aria-label="${dayLabel(i)}: ${i > S.wd ? 'still to come' : n0(v) + ' steps'}"><i style="height:${v ? Math.max(8, v / max * 100) : 0}%"></i><span>${'MTWTFSS'[i]}</span></div>`).join('')}</div>
        ${selectRow('goal', YOU.goal, YOU.goals, n0(S.goal))}
        <p class="could">${sparkle(12, 'var(--citrine)')} ${esc(couldLine(cur))}</p>
        ${S.stepsToday >= S.goal ? `<p class="hint goal-met">${ic('check')} ${esc(LOOPS.goalMet(n0(S.stepsToday), n0(S.goal)))}</p>` : ''}
        <p class="hint">${esc(YOU.stepsNote)}</p>`}${src('Real pedometer steps live in Profile, not on the map — Brett, Oct 15')}${solves('p8')}
      </section>

      <section ${youTab === 'stamps' ? '' : 'hidden'}><p class="kicker section">${esc(YOU.gems)}</p>
        <button class="mapbox mini" data-go="map" data-root="1" aria-label="Open your map">${homeMap({ id: 'ym', fog: false, filter: 'mine', frontier: false })}</button>
        <div class="gemcounts">${GEM_TYPES.map((t) => `<div>${gemSvg(t, 26)}<b>${counts[t]}</b><span>${esc(GEMS.types[t].name)}</span></div>`).join('')}</div>
        <p class="meta">${esc(GEMS.madeFound(S.gems.filter((g) => g.mine).length, S.gems.filter((g) => g.found).length))}</p>
        <p class="hint">${ic('lock')} ${esc(GEMS.stampsLine)}${S.teen ? ` ${esc(GEMS.stampsTeen)}` : ''}</p>
        ${S.gems.some((g) => g.mine) ? '' : `<div class="empty-note first-gem">${gemSvg('curio', 40, 'ghosted')}<p>${esc(LOOPS.emptyStamps)}</p><button class="btn ghost small" data-sheet="quickGem">${ic('plus')} ${esc(GEMS.newGem)}</button></div>`}
        ${S.gems.filter((g) => g.mine).map((g) => { const v = gemVisOf(g); return `<button class="lrow" data-go="gem-view" data-p='{"id":"${g.id}"}'>${gemSvg(g.type, 24)}<b>${esc(g.name)}${g.isNew ? ` <span class="newdot">${esc(LOOPS.newDot)}</span>` : ''}</b><span>${esc(GEMS.who[v].t)}${v === 'friend1' ? ` · ${esc(g.friendName || '')}` : ''}${g.cheers || g.finds ? ` · ${esc(GEMS.stats(g.finds || 0, g.cheers || 0))}` : ''}</span>${ic('chev')}</button>`; }).join('')}
        <p class="kicker section">${esc(LOOPS.foundK)}</p>
        ${S.gems.some((g) => g.found) ? S.gems.filter((g) => g.found).map((g) => `<button class="lrow" data-go="gem-view" data-p='{"id":"${g.id}"}'>${gemSvg(g.type, 24)}<b>${esc(g.name)} <span class="foundtag">${esc(LOOPS.foundStamp)}</span></b><span>${esc(g.friend ? GEMS.view.friend(g.by) : GEMS.view.by(g.by))}</span>${ic('chev')}</button>`).join('') : `<p class="hint">${esc(LOOPS.foundNone)}</p>`}
        <button class="btn ghost small" data-sheet="quickGem">${ic('plus')} ${esc(GEMS.newGem)}</button>${src('Your gems: map + list in You, edit any time — Victoria gem review, Jul 17; collection counts made and found — gems brief (d)10')}
      </section>

      <section ${youTab === 'stories' ? '' : 'hidden'}><p class="kicker section">${esc(YOU.stories)}</p>
        ${Object.entries(S.progress).map(([id, pr]) => `<button class="lrow" data-go="overview" data-id="${id}" style="--jewel:${byId[id].accent}">${thumb(byId[id], 't-row')}<b>${esc(byId[id].title)}</b><span>${esc(YOU.inProgress)} · ${pr.ch} of ${pr.of}</span>${ic('chev')}</button>`).join('')}
        ${O.upNext !== 'none' ? S.upNext.map((id) => `<button class="lrow" data-go="overview" data-id="${id}" style="--jewel:${byId[id].accent}">${thumb(byId[id], 't-row')}<b>${esc(byId[id].title)}</b><span>${esc(YOU.upNext)}</span>${ic('chev')}</button>`).join('') : ''}
        ${Object.entries(S.finished).map(([id, e]) => `<button class="lrow" data-go="overview" data-id="${id}" style="--jewel:${byId[id].accent}">${thumb(byId[id], 't-row')}<b>${esc(byId[id].title)}</b><span>${esc(LIBRARY.endings(e.length, byId[id].endings))}</span>${ic('chev')}</button>`).join('')}
        ${S.myList.map((id) => `<button class="lrow" data-go="overview" data-id="${id}" style="--jewel:${byId[id].accent}">${thumb(byId[id], 't-row')}<b>${esc(byId[id].title)}</b><span>${esc(YOU.myList)}</span>${ic('chev')}</button>`).join('')}
      </section>

      <section ${youTab === 'stamps' ? '' : 'hidden'}><p class="kicker section">${esc(YOU.collection)}</p>
        <div class="coll">
          <button class="coll-btn" data-go="whimsy"><p class="lbl">${esc(YOU.seals)}</p>${sealRow(S.seals)}<small>${esc(LOOPS.sealHint(S.seals))}</small></button>
          <div><p class="lbl">${esc(YOU.endings)}</p><b class="cbig">${Object.values(S.finished).reduce((a, e) => a + e.length, 0)}</b><small>${Object.entries(S.finished).map(([id, e]) => `${byId[id].title}: ${e[0]}`).join(' · ') || 'Finish a story to find one.'}</small></div>
          <div><p class="lbl">${esc(YOU.stamps)}</p><div class="stamps"><span class="pstamp ghosted">Adelaide</span><span class="pstamp ghosted">Calgary</span><span class="pstamp ghosted">Atlanta</span></div><small>Walk a Passport story to fill one.</small></div>
          <div><p class="lbl">${esc(YOU.badges)}</p><div class="badges"><span class="badge-c ${S.progress.frightnight ? '' : 'ghosted'}">Fright</span><span class="badge-c ${S.finished.squeaky ? '' : 'ghosted'}">Squeaky</span><span class="badge-c ${S.finished.summons ? '' : 'ghosted'}">Society</span></div><small>Visible any time, not only at the end.</small></div>
        </div>${solves('p10')}${src('Badges visible any time — Leo + Emily, Oct 2 snag')}
      </section>

      <section ${youTab === 'stories' ? '' : 'hidden'}><p class="kicker section">${esc(YOU.journal)}</p>
        <button class="mini-pc" data-go="postcard" data-p='{"id":"summons"}'><span>The Summons</span><small>Edmonton · Oct 31 · 0.4 km</small></button>
        ${S.postcards > 1 ? `<p class="hint">${S.postcards} postcards in your journal.</p>` : ''}
      </section>
`}
      <section class="links">${linkRow(YOU.reminders, remVal, 'reminders')}${linkRow(YOU.lock, '', 'lock')}<button class="lrow" data-sheet="recap"><b>${esc(YOU.recap)}</b><span>${esc(SETTINGS.newTag)}</span>${ic('chev')}</button><button class="lrow" data-sheet="make"><b>${esc(MORE.make.btn)}</b><span>${esc(MORE.make.k)}</span>${ic('chev')}</button><button class="lrow" data-sheet="ideas"><b>Suggest a Feature</b><span>Tell us what you wish Story City did</span>${ic('chev')}</button>${linkRow(YOU.settings, '', 'settings')}</section>
      <div class="tabpad"></div>`;
  },
  mount(p) { if (p.sec && youTab !== 'steps' && p.sec === 'steps') { youTab = 'steps'; return rerender(); } if (p.sec) { const el = document.getElementById('sec-' + p.sec); if (el) el.scrollIntoView({ block: 'start' }); } },
});
// what today's walking did for your story, from the same bank as the story door (pass 2: Rosa)
function couldLine(cur) {
  const s = cur ? byId[cur] : null;
  if (!s) return YOU.could(2, byId.knight.title);
  const need = stepsFor(s), ch = S.progress[cur].ch;
  return (S.bank || 0) >= need ? LOOPS.youOpened(ch, s.title) : LOOPS.youToOpen(n0(need - (S.bank || 0)), ch, s.title);
}
// Suggest a Feature: write your own, or back someone else's (Melissa, Nov 5)
const IDEAS = [
  { id: 'i1', t: 'Play with a friend in another city', n: 214 },
  { id: 'i2', t: 'Audio player with 2× speed', n: 167 },
  { id: 'i3', t: 'More stories for kids under 8', n: 141 },
  { id: 'i4', t: 'Longer walks: 10,000-step stories', n: 98 },
  { id: 'i5', t: 'Bigger text option', n: 76 },
];
let ideaTab = 'new', ideaSent = false;
export const ideasUI = { set tab(v) { ideaTab = v; }, sent() { ideaSent = true; }, reset() { ideaSent = false; } };
regSheet('ideas', () => {
  S.ideaVotes = S.ideaVotes || [];
  const head = `<p class="kicker">${ic('spark')} Help shape Story City</p><h3>Suggest a Feature</h3>
    <div class="seg minis idea-tabs" role="tablist">${[['new', 'My Idea'], ['top', 'Most Wanted']].map(([k, t]) => `<button role="tab" class="${ideaTab === k ? 'on' : ''}" aria-selected="${ideaTab === k}" data-act="ideaTab" data-v="${k}">${t}</button>`).join('')}</div>`;
  let body;
  if (ideaTab === 'top') {
    body = `<ul class="idea-list">${IDEAS.map((x) => { const v = S.ideaVotes.includes(x.id); return `<li><span>${esc(x.t)}</span><button class="idea-vote ${v ? 'on' : ''}" data-act="ideaVote" data-v="${x.id}" aria-pressed="${v}">${ic('heart')} ${x.n + (v ? 1 : 0)}</button></li>`; }).join('')}</ul>
      <p class="hint">Tap the heart on the ones you want too. The team reads every one.</p>`;
  } else if (ideaSent) {
    body = `<div class="idea-thanks">${sparkle(18, 'var(--glow)')}<b>Thanks. It’s on its way to the team.</b><span>We read every idea. If we build yours, you’ll hear about it first.</span></div>
      <div class="btns"><button class="btn ghost small" data-act="ideaTab" data-v="top">See What Others Asked For</button><button class="link" data-act="ideaAgain">Send Another</button></div>`;
  } else {
    body = `<label class="lbl" for="ideaText">What do you wish Story City did?</label>
      <textarea id="ideaText" class="field idea-text" rows="4" maxlength="300" placeholder="[One idea, in your own words]"></textarea>
      <p class="lbl">It’s about</p><div class="chips wrap">${['Stories', 'Walking', 'Map', 'Gems', 'Friends', 'Something else'].map((c) => chip(c, S.ideaCat === c, `data-act="ideaCat" data-v="${c}"`)).join('')}</div>
      <div class="btns"><button class="btn primary" data-act="ideaSend">Send to the Team</button></div>
      <p class="hint">Something broken instead? <button class="link" data-act="toast" data-t="Report a Problem opens here, with a screenshot attached.">Report a Problem</button></p>`;
  }
  return { jewel: '#C49BFF', label: 'Suggest a Feature', cls: 'tall', html: head + body + src('Feature requests from inside the app, in You — Melissa, Nov 5. Feeds the team (e.g. the Discord feature-request bot).') };
});
export function statusLine() {
  if (S.member === 'trial') { const d = trialDates(S.trialLeft); return YOU.trialLine(d.end, priceTxt(), d.remind); }
  if (S.member === 'member') return YOU.memberLine('Nov 18', priceTxt());
  return '';
}
regSheet('status', () => ({
  jewel: '#5B8CFF', label: YOU.statusTitle,
  html: `<p class="kicker">${esc(S.member === 'guest' ? YOU.status.guest : S.member === 'free' ? YOU.status.free : S.member === 'trial' ? YOU.status.trial(S.trialLeft) : YOU.status.member)}</p><h3>${esc(YOU.statusTitle)}</h3>
    <ul class="ticks">${YOU.statusPerks.map((x) => `<li>${ic('check')} ${esc(x)}</li>`).join('')}</ul>
    ${familyLine() ? `<p class="hint">${ic('people')} ${esc(familyLine())}</p>${src('Assumption: pricing isn’t decided (A9, for Melissa)')}` : ''}
    ${statusLine() ? `<p class="big small-big">${esc(statusLine())}</p>` : ''}
    ${!inCanada() ? `<p class="hint">${esc(TRIAL.storeCurrency)}</p>` : ''}
    <div class="btns">${S.member === 'member' || S.member === 'trial' ? `<button class="btn ghost" data-act="manageSub">${esc(YOU.manage)}</button>` : `<button class="btn primary" data-go="trial" data-p='{"next":"back"}'>${esc(YOU.subscribe)}</button>`}</div>
    ${src('A clear “subscribed” status; dates computed from the trial; price shown (B4)')}${solves('p5')}`,
}));
regSheet('recap', () => ({
  jewel: '#00CD9D', label: SHEETS_W.recapK,
  html: `<p class="kicker">${esc(SHEETS_W.recapK)}</p><h3>${esc(SHEETS_W.recapTitle)}</h3>${weekRow()}<div class="recap">${[...SHEETS_W.recapLines(n0(S.stepsWeek.reduce((a, b) => a + b, 0)), S.week.chapters, S.week.gems), `${S.week.walks} ${S.week.walks === 1 ? 'walk' : 'walks'}`, `${S.seals} of 7 seals`].map((l) => `<p class="big">${esc(l)}</p>`).join('')}</div><p class="hint">${esc(SHEETS_W.recapNote)}</p>${src('Sunday recap — walk-postcard mockup; weekly, not daily')}`,
}));
regSheet('tip', (p) => ({ jewel: '#C49BFF', label: SHEETS_W.tipK, html: `<p class="kicker">${esc(SHEETS_W.tipK)}</p><p class="big">${esc(p.t)}</p><div class="btns"><button class="btn ghost" data-close>${esc('Got It')}</button></div>` }));

// ================================================================== SETTINGS
reg('settings', {
  html() {
    const R = SETTINGS.rows, N = `<span class="newtag">${esc(SETTINGS.newTag)}</span>`;
    const paid = ['trial', 'member'].includes(S.member);
    const subVal = S.member === 'member' ? SETTINGS.sub.active : S.member === 'trial' ? SETTINGS.sub.trial : SETTINGS.sub.none;
    const sec = (t, inner, isNew) => `<section class="set"><p class="kicker section">${esc(t)} ${isNew ? N : ''}</p><div class="set-box">${inner}</div></section>`;
    const remVal = S.rem.paused ? REMIND.paused(S.rem.paused) : !S.rem.on ? 'Off' : `At most ${S.rem.budget}`;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(SETTINGS.title)}</span></div>
      <h1 class="display">${esc(SETTINGS.title)}</h1>
      <section class="subblock"><p class="kicker">${esc(SETTINGS.sub.title)}</p><p class="big">${esc(subVal)}</p>${paid ? `<p class="hint">${esc(statusLine())}</p>` : ''}<ul class="ticks">${YOU.statusPerks.map((x) => `<li>${ic('check')} ${esc(x)}</li>`).join('')}</ul><button class="btn ${paid ? 'ghost' : 'primary'}" ${paid ? 'data-act="manageSub"' : `data-go="trial" data-p='{"next":"back"}'`}>${esc(paid ? YOU.manage : YOU.subscribe)}</button></section>
      ${S.account ? sec(SETTINGS.sections.account, [R.email, R.reset, R.edit, R.del].map((x) => `<button class="lrow" data-act="noop" data-t="${esc(x)}"><b>${esc(x)}</b>${ic('chev')}</button>`).join('')) : sec(R.guestK, `<button class="lrow" data-go="account" data-p='{"mode":"re","next":"back"}'><b>${esc(R.guestRow)}</b>${ic('chev')}</button>`)}
      ${sec(SETTINGS.sections.play, `<div class="selrow"><span class="tg-t"><b>${esc(R.howPlay)} ${N}</b><small>${esc(S.remember ? rememberLabel() : R.howPlayAsk)}</small></span>${S.remember ? `<button class="btn ghost small inl" data-act="forget">${esc(R.howPlayUndo)}</button>` : ''}</div>${src('“Remember my choice”, undo in Settings — dev, Oct 30')}
        ${toggle('storyOnly', S.storyOnly, R.storyOnly, R.storyOnlySub)}${src('Story only: for story-first players (tester B3)')}
        ${toggle('tips', S.tips, R.tips, R.tipsSub)}${src(O.tips === 'global' ? 'Global tooltip switch — Melissa, Nov 2' : 'Per-tip — Emily, Nov 3')}
        ${selectRow('showAs', R.showAs, R.showAsOpts, { steps: 'Steps', minutes: 'Minutes', distance: 'Distance' }[O.unit])}`)}
      ${sec(SETTINGS.sections.steps, `${selectRow('goal', R.goal, YOU.goals, n0(S.goal))}${toggle('count', !S.storyOnly, R.countSteps)}${toggle('indoor', true, R.indoor, 'Treadmill, walking pad, mall laps.')}${toggle('pushes', S.pushes, R.pushes, R.pushesSub)}${toggle('health', false, R.health, R.healthSub)}${selectRow('unit', R.unit, R.units, S.miles ? R.units[2] : R.units[0])}`)}
      ${sec(SETTINGS.sections.notif, linkRow(R.reminders, remVal, 'reminders'), true)}
      ${sec(SETTINGS.sections.map, `${toggle('fogTab', S.fogTabOn !== false, R.fogHome)}${toggle('fogStory', O.fogWhere === 'everywhere', R.fogStory, 'Off by default.')}${src('Fog off by default in stories — Melissa, Nov 2')}${selectRow('fogLook', R.fogLook, R.fogLooks, R.fogLooks[0], '(mockup: one look drawn)')}${selectRow('mapStyle', R.mapStyle, R.mapStyles, R.mapStyles[0], '(mockup)')}`, true)}
      ${sec(SETTINGS.sections.privacy, `${O.homeBubble === 'choice' ? `${toggle('hideHome', hideHome(), R.hideHome, R.hideHomeSub)}${src('Home bubble: player’s choice, on by default for under-16s — Melissa, Nov 4 (Team Option, TTT)')}` : ''}${hideHome() ? selectRow('bubble', R.bubble, R.bubbleSizes, R.bubbleSizes[0], R.bubbleSub) : ''}${toggle('gemsPriv', true, R.gemsPrivate)}${selectRow('who', R.who, R.whoOpts, S.friendsOnly ? R.whoOpts[0] : R.whoOpts[1])}${toggle('trim', true, R.trim)}<div class="lrow static"><b>${esc(R.location)}</b><span>${esc(R.locationVal)}</span></div>`, true)}
      ${sec(SETTINGS.sections.access, `${selectRow('textSize', R.textSize, R.textSizes, S.textSize)}${toggle('motion', S.motion, R.motion)}${toggle('eyes', !!S.eyes, R.eyes, R.eyesSub)}${toggle('gemPat', false, R.gemPatterns, R.gemPatternsSub + ' (mockup)')}`, true)}
      ${sec(SETTINGS.sections.data, `${toggle('lowAudio', S.lowAudio, R.lowAudio, R.lowAudioSub)}${toggle('lowData', S.lowData, R.lowData, R.lowDataSub)}<div class="lrow static"><b>${esc(R.offline)}</b><span>${S.downloads}</span></div>`, true)}
      ${sec(SETTINGS.sections.audio, `${toggle('autoplay', true, R.autoplay)}${toggle('music', true, R.music)}${selectRow('lang', R.lang, R.langs, R.langs[0])}`)}
      ${sec(SETTINGS.sections.more, [R.coupons, R.restore, R.replay, R.feature, R.help].concat(S.account ? [R.signout] : []).map((x) => `<button class="lrow" data-act="noop" data-t="${esc(x)}"><b>${esc(x)}</b>${ic('chev')}</button>`).join(''))}
      ${src('Real settings order from GeneralAppSettings.tsx (4.28.0); “New” rows are additions')}${solves('p12')}
      <p class="hint centre">${esc('Version 4.29.0 (mockup)')}</p>`;
  },
});

// ================================================================== REMINDERS + LOCK SCREEN
const LOCKIN_TIMES = LOCKIN.times;
export { LOCKIN_TIMES };
export function remTimeLabel() { if (S.rem.time === 'custom' && S.rem.custom) return S.rem.custom; const t = LOCKIN_TIMES.find((x) => x.id === S.rem.time) || LOCKIN_TIMES[1]; return t.s; }
reg('reminders', {
  html() {
    const rem = S.rem;
    const cur = curStory(); const cs = cur ? byId[cur] : byId.knight; const ch = cur ? S.progress[cur].ch : 1;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(REMIND.title)}</span></div>
      <h1 class="display">${esc(REMIND.title)}</h1><p class="sub">${esc(REMIND.sub)}</p>
      <section class="set"><div class="set-box">${toggle('remOn', rem.on, REMIND.master)}</div></section>
      ${rem.paused ? `<div class="guestbar"><p>${esc(REMIND.paused(rem.paused))}</p><button class="btn ghost small" data-act="resume">${esc(REMIND.resume)}</button></div>` : ''}
      ${!rem.on ? `<p class="promise">${esc(REMIND.masterOff)}</p>` : `
      <section><p class="kicker section">${esc(REMIND.walkTime)}</p><div class="choices">${LOCKIN_TIMES.map((x) => `<button class="choice ${x.id === rem.time ? 'sel' : ''}" data-act="pickTime" data-v="${x.id}" aria-pressed="${x.id === rem.time}"><b>${esc(x.t)}</b><span>${esc(x.s)}</span></button>`).join('')}
        <label class="choice ${rem.time === 'custom' ? 'sel' : ''}"><b>${esc(REMIND.custom)}</b><input class="field timefield" type="time" data-remtime value="${esc(rem.custom || '21:30')}" aria-label="${esc(REMIND.custom)}"></label></div>
        <div class="chips days">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => chip(d, rem.days[i], `data-act="day" data-i="${i}" aria-label="${dayLabel(i)}"`)).join('')}</div>
        <p class="hint">${esc(REMIND.walkTimeNext(remTimeLabel(), cs.title, ch))}</p>${idea('Pick My Walk Time (#26)')}</section>
      <section class="set"><div class="set-box">${selectRow('budget', REMIND.budget, REMIND.budgets, rem.budget)}${selectRow('quiet', REMIND.quiet, REMIND.quiets, rem.quiet)}${selectRow('voice', REMIND.voice, REMIND.voices, REMIND.voices[0])}</div>${idea('reminder budget + quiet hours (#27)')}</section>
      <section class="set"><p class="kicker section">${esc(REMIND.reasons)}</p><div class="set-box">${REMIND.reasonList.map((r) => toggle('r-' + r.id, r.on, r.t, r.s || '')).join('')}</div></section>
      <section><p class="kicker section">${esc(REMIND.away)}</p><div class="row3">${REMIND.aways.map((a) => `<button class="btn ghost small" data-act="away" data-v="${esc(a)}">${esc(a)}</button>`).join('')}</div>${idea('Away for a Bit (#28)')}</section>`}
      <p class="promise">${esc(REMIND.promise)}</p>
      <div class="btns"><button class="btn primary" data-go="lock">${esc(REMIND.preview)}</button></div>
      ${src('Ask for notifications at the end, with a reason — Melissa Oct 21/23; master switch, own time and paused state (C14)')}${solves('p12')}`;
  },
});

// gem finds and cheers on the lock screen, following socialNote (pass 2: groups)
function gemNotes() {
  if (O.socialNote === 'cardOnly') return [];
  const g = S.activity.filter((a) => a.day === S.day && ['gem', 'tier'].includes(a.kind));
  return O.socialNote === 'each' ? g.slice(0, 3).map((a) => a.t) : g.slice(0, 1).map((a) => a.t);
}
reg('lock', {
  cls: () => 'lockscr',
  html() {
    const cur = curStory() || 'squeaky'; const s = byId[cur]; const pr = S.progress[cur] || { ch: 4 };
    const steps = Math.max(0, stepsFor(s) - (S.bank || 0)); const left = Math.round(steps * 0.48);
    const place = chapterTitle(cur, pr.ch).replace(/^The /, 'the ');
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(LOCK.title)}</span></div>
      <div class="lockphone"><p class="lk-date">${esc(`${S.dow}, ${{ Oct: 'October', Nov: 'November', Dec: 'December', Jan: 'January' }[S.date.split(' ')[0]] || ''} ${S.date.split(' ')[1] || ''}`)}</p><p class="lk-time">${esc(fmtTime(Math.max(7.8, Math.min(S.hour, 23))).replace(/ [ap]m$/, ''))}</p>
        <div class="island">${ic('walk')} ${esc(`${s.title.split(' ').slice(-1)[0].replace('?', '')} · ${walkTxt(left)}`)}</div>
        ${gemNotes().map((t) => `<div class="notif gemnote"><div class="nf-top"><span class="nf-app">${esc(LOCK.app)}</span><time>${esc('8:02 am')}</time></div><b>${esc(LOOPS.sinceK)}</b><p>${esc(t)}</p></div>`).join('')}
        ${LOCK.notes.map((n, i) => `<div class="notif"><div class="nf-top"><span class="nf-app">${esc(LOCK.app)}</span><time>${esc(n.when)}</time></div><b>${esc(n.from)} · <i>${esc(n.story)}</i></b><p>${esc(i === 0 && cur === 'squeaky' ? (steps ? `The hydrant’s been talking about you. Loudly. Chapter ${pr.ch} is ${walkTxt(steps)} away.` : `The hydrant’s been talking about you. Loudly. Chapter ${pr.ch} is open. Your walks got you there.`) : n.t)}</p></div>`).join('')}
        <div class="live"><p class="kicker">${esc(LOCK.liveK)} · ${esc(s.title)}</p><b>${esc(`${walkTxt(left)} to ${place}`)}</b><div class="pbar"><i style="width:52%"></i></div><p>${esc(LOCK.liveLast)}</p></div>
      </div>
      <p class="kicker section">${esc(LOCK.widgetK)}</p>
      <div class="widget"><i class="wg-ring"></i><small>${esc(s.title)}</small><b>${esc(steps ? `Chapter ${pr.ch} is ${walkTxt(steps)} away` : `Chapter ${pr.ch} is open`)}</b><span>${esc(`This week: ${n0(S.stepsWeek.reduce((a, b) => a + b, 0))} steps`)}</span><span>${esc(LOCK.widgetMission)}</span></div>
      <p class="hint">${esc(LOCK.note)}</p>${src('lock-screen mockup (Good); story-voice pushes — Oct 21; one step number everywhere (A6)')}${src(`Gem news on the lock screen follows socialNote: ${O.socialNote === 'cardOnly' ? 'none (card only)' : O.socialNote === 'each' ? 'one per first find or cheer' : 'at most one a day'} — groups retest`)}${solves('p8', 'p12')}`;
  },
});

// ================================================================== WHIMSY WALKS
// One player drives every walk in the daily pool; each walk plays its own way (pass 2): a coin, a 3×3 bingo
// card, scores out of ten, the alphabet, a sound map, or a plain counter. Plus a clock, the dark and the way home.
const wp = { n: 0, id: 'cat', ver: 'out', short: false, marks: [], scores: [], heard: [] };
const sealRow = (n) => `<span class="seal-row" role="img" aria-label="${n} of 7 seals">${Array.from({ length: 7 }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
const WT_COLS = ['#BED13F', '#35C6D7', '#FF4F79', '#F5B82E', '#C49BFF', '#00CD9D', '#FA7423', '#5B8CFF'];
export const wtNames = () => (S.wt ? S.wt.people.map((x) => firstName(x)) : []);
const andList = (a) => (a.length <= 1 ? a.join('') : a.length === 2 ? `${a[0]} & ${a[1]}` : `${a.slice(0, -1).join(', ')} & ${a[a.length - 1]}`);
reg('whimsy', {
  tab: 'whimsy',
  html() {
    const id = walkIdFor(), w = walkDef(id), ver = verFor(id), V = w[ver] || w.out;
    const tom = walkName(walkIdFor(1), 1);
    const others = LOOPS.pool.filter((k) => k !== id).slice(0, 3);
    const verLbl = ver !== 'out' && !(w.indoor && ver === 'lit') ? ` · ${esc(LOOPS.version[ver])}` : '';
    return `${O.tabs === 'sgw' ? tabHead(TABS.whimsy) : `<div class="bar">${backBtn()}<span class="walk-name">${esc(WHIMSY.k)}</span></div>`}
      <h1 class="display">${esc(WHIMSY.title)}</h1>
      <div class="cards"><button class="walk hero ${S.whimsyDone ? 'is-done' : ''}" style="--jewel:${w.jewel}" data-act="whimsyGo"><span class="ghost" aria-hidden="true">${esc(String(S.seals))}</span><span class="mech">${esc(WHIMSY.today)} · ${esc(w.mech)}${verLbl}</span><span class="title">${esc(walkName(id))}</span><span class="hook">${esc(S.whimsyDone ? (S.sealToday ? LOOPS.walked(S.seals) : LOOPS.walkedNoSeal) : (w.dayName && daylit() && V.day) || V.hook)}</span><span class="meta">${esc(S.whimsyDone ? LOOPS.doAnother : TODAY.whimsySame)}</span></button></div>
      <span class="wt-links"><button class="link wt-link" data-act="wtOpen" data-v="whimsy">${ic('people')} ${esc(LOOPS.wt.btn)}</button><button class="link wt-link" data-sheet="wtJoin">${ic('camera')} Join a Walk</button></span>
      <div class="seals static"><span class="seal-row-wrap">${sealRow(S.seals)}</span><span class="seal-text">${esc(WHIMSY.sealsLabel(S.seals))}</span></div>
      <p class="hint">${esc(LOOPS.sealHint(S.seals))}</p>
      ${S.seals >= 7 ? `<div class="btns"><button class="btn jewel" data-sheet="letter">${esc(LOOPS.letterOpen)}</button></div>` : `<p class="hint letter-tease">${esc(LOOPS.teases[S.day % LOOPS.teases.length])}</p>`}
      <div class="sealed"><p class="kicker">${esc(WHIMSY.tomorrow)}</p><p class="big">${esc(tom)}</p><p class="hint">${esc(LOOPS.tomorrowEnd(tom, unsealAt()).replace(`Tomorrow: ${tom}. `, ''))}</p></div>
      <p class="kicker section">${esc(WHIMSY.always)}</p>
      <div class="cards"><button class="walk quest" style="--jewel:#35C6D7" data-act="rouletteGo"><span class="mech">${esc('A following walk')}</span><span class="title">${esc(WHIMSY.roulette)}</span><span class="meta">${esc('You pick the time')}</span></button>
      ${others.map((k) => { const x = walkDef(k); return `<button class="walk quest" style="--jewel:${x.jewel}" data-act="whimsyGo" data-id="${k}"><span class="mech">${esc(x.mech)}</span><span class="title">${esc(walkName(k))}</span></button>`; }).join('')}</div>
      ${src('One seal a day, any 7 days; never show missed days — loops brief Whimsy #3 (Team Option sealCap); Pokémon GO; INSEAD streak study')}
      ${src('Seven walks, each its own way to play — pass 2 (walkers: “the 4-walk pool repeats on day 5”)')}
      <div class="tabpad"></div>`;
  },
});
regSheet('letter', () => ({
  jewel: '#F5B82E', label: LOOPS.letterTitle,
  html: `<p class="kicker">${sparkle(12, 'var(--citrine)')} ${esc(LOOPS.letterK)}</p><h3>${esc(LOOPS.letterTitle)}</h3><div class="letter">${LOOPS.letter.map((l) => `<p>${esc(l)}</p>`).join('')}</div><div class="btns"><button class="btn ghost" data-close>${esc('Close')}</button></div>${src('Seven seals open a letter — Whimsy board; loops brief Whimsy #6')}`,
}));
// today's 3×3 card: 8 named squares picked by the date, the middle one free
export function bingoItems(ver) {
  const V = walkDef('bingo')[ver] || walkDef('bingo').out;
  const r = seeded('bingo' + S.date + ver), pool = V.items.slice(), out = [];
  while (out.length < 8 && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  out.splice(4, 0, LOOPS.card.free);
  return out;
}
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
export const wpMins = () => Math.round(wp.n * walkDef(wp.id).per);
// the clock, the dark and the way home, on every walk outside (pass 2: Gord, Chinedu)
function hud(mins, to) {
  const outside = ['out', 'lit'].includes(to === 'roulette' ? (rl.home ? 'home' : 'out') : wp.ver) && !(to !== 'roulette' && walkDef(wp.id).indoor);
  const dl = daylightLeft(), lightLeft = !isDark() && dl > 0 && dl <= 90 ? dl - mins : null;
  const warn = lightLeft !== null && lightLeft <= 12;
  return `<div class="hud ${warn ? 'warn' : ''}"><span>${ic('clock')} ${esc(LOOPS.timer(mins))}</span>${lightLeft !== null ? `<span>${ic('moon')} ${esc(warn ? LOOPS.headBack(Math.max(1, lightLeft)) : LOOPS.darkIn(lightLeft))}</span>` : ''}${outside ? `<button class="btn ${warn ? 'primary' : 'ghost'} small" data-sheet="takeHome" data-p='${esc(JSON.stringify({ mins, to }))}'>${ic('home')} ${esc(LOOPS.takeHome)}</button>` : ''}</div>`;
}
function playArea(w, V) {
  const k = w.kind;
  if (k === 'card') {
    const items = bingoItems(wp.ver), marked = new Set([4, ...wp.marks]);
    const line = LINES.some((l) => l.every((x) => marked.has(x)));
    return `<p class="${line ? 'arrow flash bingo-msg' : 'hint centre'}">${esc(marked.size === 9 ? LOOPS.card.all : line ? LOOPS.card.line : LOOPS.card.tap)}</p>
      <div class="bingo" role="group" aria-label="Bingo card">${items.map((t, i) => `<button class="bsq ${marked.has(i) ? 'on' : ''} ${i === 4 ? 'free' : ''}" ${i === 4 ? 'disabled' : `data-act="wpMark" data-v="${i}"`} aria-pressed="${marked.has(i)}">${i === 4 ? sparkle(14, 'var(--citrine)') : ''}<span>${esc(t)}</span></button>`).join('')}</div>`;
  }
  if (k === 'rate') {
    const sc = wp.scores, best = sc.length ? Math.max(...sc) : 0, avg = sc.length ? (sc.reduce((a, b) => a + b, 0) / sc.length).toFixed(1) : 0;
    return `${doodle(wp.n, S.name + ':' + S.day + ':' + wp.id)}<p class="arrow flash">${esc(sc.length ? LOOPS.rate.last(sc[sc.length - 1]) : LOOPS.rate.prompt)}</p>${sc.length ? `<p class="hint centre">${esc(LOOPS.rate.best(best, avg))}</p>` : ''}
      <div class="rate" role="group" aria-label="Score out of ten">${Array.from({ length: 10 }, (_, i) => `<button class="rchip" data-act="wpRate" data-v="${i + 1}">${i + 1}</button>`).join('')}</div>`;
  }
  if (k === 'letters') {
    const done = wp.n >= 26, L = String.fromCharCode(65 + Math.min(25, wp.n));
    return `<div class="abc"><b>${esc(done ? 'Z' : L)}</b><span>${esc(done ? LOOPS.abc.done : LOOPS.abc.find(L))}</span></div><p class="hint centre">${esc(wp.n ? LOOPS.abc.got(String.fromCharCode(64 + Math.min(26, wp.n))) : V.rule)}</p>`;
  }
  if (k === 'chips') {
    return `${doodle(wp.n, S.name + ':' + S.day + ':' + wp.id)}<p class="arrow flash">${esc(wp.heard.length ? LOOPS.ear.heard(wp.heard.join(', ').toLowerCase()) : V.rule)}</p>
      <div class="chips wrap ear">${V.items.map((t) => `<button class="chip" aria-pressed="${wp.heard.includes(t)}" data-act="wpHear" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div>`;
  }
  // coin and plain counters
  const coin = k === 'coin', rebel = [0, 1, 0, 0, 1, 1, 0, 1][wp.n % 8];
  const big = !wp.n ? (coin ? V.first : V.btn + ' when you see one.') : coin ? (rebel ? V.tails : V.heads) : w.count(wp.n);
  return `${doodle(wp.n, wp.n ? S.name + ':' + S.day + ':' + wp.id : '')}<p class="arrow flash">${esc(big)}</p>`;
}
reg('whimsy-play', {
  jewel: () => walkDef(wp.id).jewel,
  html() {
    const w = walkDef(wp.id), V = w[wp.ver] || w.out;
    const done9 = (w.max && wp.marks.length >= 8) || (w.kind === 'letters' && wp.n >= 26);
    const verLbl = wp.ver !== 'out' && !(w.indoor && wp.ver === 'lit') ? ` · ${esc(LOOPS.version[wp.ver])}` : '';
    const btn = ['card', 'rate', 'chips'].includes(w.kind) || done9 ? '' : `<button class="btn jewel" data-act="wpCount">${esc(V.btn)}</button>`;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(walkName(wp.id))}${verLbl}</span><span class="count">${esc(w.count(wp.n))}</span></div>
      ${S.wt ? `<p class="wt-strip">${S.wt.people.map((x, i) => `<span class="pav" style="--jewel:${WT_COLS[i % WT_COLS.length]}">${esc(x[0])}</span>`).join('')} ${esc(LOOPS.wt.label(S.wt.people.length))}</p>` : ''}
      ${w.kind === 'card' ? '' : `<p class="kicker">${esc(V.rule)}</p>`}
      ${playArea(w, V)}
      ${wp.short ? `<p class="twist">${esc('A 10-minute one. Lit streets you know.')}</p>` : ''}
      ${hud(wpMins(), 'whimsy')}
      <div class="btns">${btn}<button class="btn ${done9 ? 'primary' : 'ghost'}" data-act="whimsyFinish">${esc(LOOPS.finish)}</button></div>
      ${src('Each walk plays its own way: a 3×3 card, scores out of ten, the alphabet, a sound map — pass 2 (distance, social, lowtech, walkers)')}
      ${src('A clock, “Dark in 12 min. Head back?” and Take Me Home — lowtech retest (Gord, Chinedu)')}`;
  },
});
// walk end: stats, goal, seal, tomorrow, the story's next chapter, a friends compare, a gem at the spot
reg('whimsy-end', {
  jewel: (p) => (p.id === 'roulette' ? '#35C6D7' : walkDef(p.id).jewel),
  html(p) {
    const E = WHIMSY.end, cur = curStory();
    const home = p.ver === 'home';
    const tom = walkName(walkIdFor(1), 1);
    const stats = !p.n ? LOOPS.statsNone : home || S.storyOnly ? LOOPS.statsHome(p.mins) : LOOPS.statsOut(n0(p.steps), distTxt(p.steps), p.mins);
    const w = p.id === 'roulette' ? null : walkDef(p.id);
    const unit = w ? w.unit : 'turn', units = w ? w.units : 'turns';
    const sealLine = p.res === 'pressed' ? `${E.seal} · ${S.seals} of 7` : p.res === 'already' ? (home ? LOOPS.sealAlreadyHome : LOOPS.sealAlready) : LOOPS.sealNone(unit);
    const goal = !S.storyOnly && p.n && !home ? (S.stepsToday >= S.goal ? LOOPS.goalMet(n0(S.stepsToday), n0(S.goal)) : LOOPS.goalLeft(n0(S.goal - S.stepsToday), n0(S.goal))) : '';
    // the story's next chapter, from the same step bank as Today (pass 2: Rosa)
    let story = '';
    if (cur) {
      const s = byId[cur], pr = S.progress[cur], need = stepsFor(s), bank = S.bank || 0;
      const hands = LOOPS.hands[cur] || LOOPS.hands.default;
      story = `<div class="story-next" style="--jewel:${s.accent}"><p class="kicker">${esc(E.handK)} · ${esc(s.title)}</p>
        ${bank >= need && p.steps ? `<p class="quest-line">${esc(LOOPS.opened(n0(p.steps), pr.ch))}</p><button class="btn primary small" data-act="readOpened" data-id="${cur}">${esc(LOOPS.readCh(pr.ch))}</button>`
          : `<p class="quest-line">${esc(hands[S.day % hands.length])}</p>${p.steps && bank < need ? `<p class="hint">${esc(LOOPS.toOpen(n0(need - bank), pr.ch))}</p>` : ''}<button class="btn ghost small" data-act="keepGoing" data-id="${cur}">${esc(TODAY.keep)}</button>`}</div>`;
    }
    // a friend who did the same walk today: their count beside yours (pass 2: social)
    const fd = w && !p.wt ? friendDoodles()[0] : null;
    const cmp = fd && p.n ? LOOPS.compare(firstName(fd.who), w.max ? 2 + (fd.n % 8) : fd.n, units, p.n) : '';
    const names = p.wt ? andList(p.wt.map(firstName)) : '';
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(p.wt ? LOOPS.wt.endK : E.k)}</span></div>
      <h1 class="display">${esc(E.title)}</h1>${myDoodleSvg({ n: Math.max(1, p.n), id: p.id, wt: p.wt ? names : null, cols: p.wt ? WT_COLS.slice(0, p.wt.length) : null })}
      ${p.wt ? `<p class="hint centre">${esc(LOOPS.wt.oneDoodle(p.wt.length))}</p><p class="wt-cap">${esc(LOOPS.wt.caption(names, S.dow.slice(0, 3)))}</p>` : ''}
      ${p.via === 'home' ? `<p class="hint centre">${ic('home')} ${esc(LOOPS.homeVia)}</p>` : ''}
      <p class="walkstats">${esc(stats)}</p>
      ${goal ? `<p class="goalline ${S.stepsToday >= S.goal ? 'met' : ''}">${esc(goal)}</p>` : ''}
      <div class="seals static ${p.res === 'pressed' ? 'pressed' : ''}"><span class="seal-row-wrap">${sealRow(S.seals)}</span><span class="seal-text${p.res === 'pressed' ? '' : ' plain'}">${esc(sealLine)}</span></div>
      ${p.wt && p.res !== 'none' ? `<p class="hint">${esc(LOOPS.wt.sealEach)}</p>` : `<p class="hint">${esc(LOOPS.sealHint(S.seals))}</p>`}
      ${story}
      ${cmp ? `<p class="cmpline">${ic('people')} ${esc(cmp)}</p>` : ''}
      <div class="tease"><p>${esc(LOOPS.tomorrowEnd(tom, unsealAt()))}</p>${S.seals >= 7 ? `<button class="link pretend" data-sheet="letter">${esc(LOOPS.letterOpen)}</button>` : `<p class="hint">${esc(LOOPS.teases[S.day % LOOPS.teases.length])}</p>`}</div>
      ${p.gem === 'saved' ? `<p class="hint">${ic('check')} ${esc(LOOPS.gemSaved(O.gemsTabName))}</p>` : p.gem === 'no' ? '' : `<div class="gemline">${gemSvg('curio', 34)}<div><p>${esc(home ? LOOPS.gemHereHome : LOOPS.gemHere)}</p><small class="hint">${esc(home ? LOOPS.gemHereHomeSub : LOOPS.gemHereSub)}</small></div></div>
        <div class="row2"><button class="btn ghost small" data-act="endGem" data-v="1">${esc(LOOPS.saveIt)}</button><button class="btn ghost small" data-act="endGem" data-v="0">${esc(LOOPS.noThanks)}</button></div>`}
      <p class="hint">${ic('lock')} ${esc(LOOPS.friendsSee(units))}</p>
      <div class="btns"><button class="btn primary" data-sheet="shareDoodle">${esc(E.share)}</button><button class="link" data-go="today" data-root="1">${esc(MISSION.home)}</button></div>
      ${src('Everything counts: steps, This Week, today’s dot, fog — loops brief build 2; one seal a day — build 4; tomorrow and the letter — Whimsy #6')}
      ${src('Walked steps open the next chapter; the goal line; each walk’s own words; a friends compare — pass 2 (walkers, social)')}
      ${src('Walk end hands off to Gems: “Leave a gem here?”, private by default — loops brief §2')}`;
  },
});
export const whimsy = {
  set where(v) {}, get where() { return 'out'; }, cat() { wp.n++; }, reset() { wp.n = 0; },
  start(id, ver, short) { wp.id = id || walkIdFor(); wp.ver = ver || verFor(wp.id); wp.short = !!short; wp.n = 0; wp.marks = []; wp.scores = []; wp.heard = []; },
  mark(i) { const k = wp.marks.indexOf(i); if (k >= 0) wp.marks.splice(k, 1); else wp.marks.push(i); wp.n = wp.marks.length; },
  rate(v) { wp.scores.push(v); wp.n = wp.scores.length; },
  hear(t) { const k = wp.heard.indexOf(t); if (k >= 0) wp.heard.splice(k, 1); else wp.heard.push(t); wp.n = wp.heard.length; },
  get st() { return wp; },
};
regSheet('whimsyDark', (p) => {
  const dark = isDark();
  // homePlay off: no At Home version. Lit streets (or, on a farm road, bring a light), or save it for daylight
  if (homeOff()) {
    const rural = isRural(), go = rural ? 'out' : 'lit', goT = rural ? NOHOME.whimsyDark.light : MORE.whimsyDark.lit;
    return {
      jewel: '#C49BFF', label: MORE.whimsyDark.k,
      html: `<p class="kicker">${ic('moon')} ${esc(dark ? MORE.whimsyDark.k : LOOPS.darkSoonK(fmtLeft(daylightLeft())))}</p><p class="big">${esc(dark ? NOHOME.whimsyDark.t : LOOPS.dusk(fmtLeft(daylightLeft())))}</p>
      ${rural ? `<p class="hint">${esc(NOHOME.flips.ruralDark.t)}</p>` : ''}
      <div class="btns"><button class="btn primary" data-act="darkGo" data-v="${go}" data-to="${esc(p.to)}">${esc(goT)}</button><button class="link" data-close>${esc(MORE.whimsyDark.later)}</button></div>
      ${src('Play at home is off (Team Option homePlay, Golden Path Q24 TTT): lit streets or daylight only')}${solves('p6')}`,
    };
  }
  return {
    jewel: '#C49BFF', label: MORE.whimsyDark.k,
    html: `<p class="kicker">${ic('moon')} ${esc(dark ? MORE.whimsyDark.k : LOOPS.darkSoonK(fmtLeft(daylightLeft())))}</p><p class="big">${esc(p.to === 'roulette' ? MORE.whimsyDark.t : dark ? MORE.whimsyDark.tWalk : LOOPS.dusk(fmtLeft(daylightLeft())))}</p>
    ${isRural() ? `<p class="hint">${esc(WEATHER.flips.ruralDark.t)}</p>` : ''}
    <div class="btns">${p.to === 'roulette' ? `<button class="btn primary" data-act="darkGo" data-v="home" data-to="${esc(p.to)}">${esc(MORE.whimsyDark.home)}</button><button class="btn ghost" data-act="darkGo" data-v="lit" data-to="${esc(p.to)}">${esc(MORE.whimsyDark.lit)}</button>`
      : `<button class="btn primary" data-act="darkGo" data-v="lit" data-to="${esc(p.to)}">${esc(MORE.whimsyDark.lit)}</button><button class="btn ghost" data-act="darkGo" data-v="home" data-to="${esc(p.to)}">${esc(MORE.whimsyDark.home)}</button><button class="link" data-close>${esc(MORE.whimsyDark.later)}</button>`}</div>
    ${solves('p6')}${src('After dark, never steer people into unfamiliar streets (tester C6); “Dark in 24 minutes”, not “It’s dark out” while it’s light — loops brief Whimsy #4')}`,
  };
});
// rain, snow or ice: ask first (loops brief Whimsy #4). Indoor walks never ask (pass 2)
regSheet('whimsyRain', (p) => {
  const k = { rain: 'It’s raining.', storm: 'There’s a storm.', snow: 'It’s snowy out.', cold: 'It’s bitter out.' }[weatherKind()] || 'It’s wet out.';
  return {
    jewel: '#5B8CFF', label: LOOPS.rainAsk.k,
    html: homeOff() ? `<p class="kicker">${wxIcon()} ${esc(k.replace('.', ''))}</p><p class="big">${esc(NOHOME.rainAsk(k))}</p>
      <div class="btns"><button class="btn primary" data-act="rainGo" data-v="out" data-id="${esc(p.id || '')}">${esc(LOOPS.rainAsk.go)}</button><button class="btn ghost" data-act="rainGo" data-v="pad" data-id="${esc(p.id || '')}">${esc(NOHOME.rainPad)}</button><button class="link" data-close>${esc(NOHOME.rainLater)}</button></div>
      ${src('Play at home is off (homePlay): the pad version, not the At Home one')}`
    : `<p class="kicker">${wxIcon()} ${esc(k.replace('.', ''))}</p><p class="big">${esc(`${k} Play the At Home version, or go anyway?`)}</p>
      <div class="btns"><button class="btn primary" data-act="rainGo" data-v="home" data-id="${esc(p.id || '')}">${esc(LOOPS.rainAsk.home)}</button><button class="btn ghost" data-act="rainGo" data-v="out" data-id="${esc(p.id || '')}">${esc(LOOPS.rainAsk.go)}</button></div>
      ${src('Rain, ice or dark ask first — loops brief Whimsy #4 (nonwalkers, danas, lowenergy)')}`,
  };
});
regSheet('remindPick', () => ({
  jewel: '#C49BFF', label: LOOPS.remindTitle,
  html: `<p class="kicker">${ic('bell')} ${esc(LOOPS.remindK)}</p><h3>${esc(LOOPS.remindTitle)}</h3>
    <div class="choices">${LOOPS.remindTimes.map((t) => `<button class="choice" data-act="remindAt" data-v="${t.id}"><b>${esc(t.t)}</b><span>${esc(t.s)}</span></button>`).join('')}</div>
    ${src('Pick a time — Ben, Dana (Team Option remindLater)')}`,
}));

// ================================================================== WALK TOGETHER (groups blocker)
// 2–8 phones on today's walk or Route Roulette: one doodle in everyone's colours, a seal each.
// Roulette for two or more: the phones take turns, and nobody sees the next one.
// Walk codes are a random, friendly 6-letter word (Melissa, Nov 5): easy to say out loud, no numbers or
// mixed characters. Hand-picked so every code is safe for kids and can't spell anything rude.
const WALK_WORDS = ['PEBBLE', 'BREEZE', 'MEADOW', 'PUZZLE', 'SPROUT', 'HARBOR', 'CASTLE', 'LOCKET', 'BEACON', 'RIDDLE',
  'MARBLE', 'CANDLE', 'ORCHID', 'WALNUT', 'POCKET', 'TOFFEE', 'MITTEN', 'PIRATE', 'ROCKET', 'VELVET', 'ZIGZAG', 'JIGSAW',
  'PICNIC', 'WIZARD', 'DRAGON', 'BUTTON', 'GARDEN', 'COBALT', 'SUMMIT', 'FALCON', 'PUFFIN', 'MAGPIE', 'LAGOON', 'SAFARI',
  'COMET', 'TUNDRA', 'CACTUS', 'GALAXY', 'MUFFIN', 'NUTMEG', 'PAPAYA', 'QUIVER', 'RIBBON', 'SHERPA', 'TEAPOT', 'WILLOW'].filter((w) => w.length === 6);
// A drawn QR-style code for the mockup (not scannable): three finder squares + pattern from the word
function qrSvg(word, size = 168) {
  const n = 21; let h = 0; for (const c of word) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#0B0620"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#FBF7FF"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#0B0620"/>`;
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
  let cells = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inFinder(x, y) && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  return `<svg class="qr" viewBox="-2 -2 25 25" width="${size}" height="${size}" role="img" aria-label="QR code for ${esc(word)}"><rect x="-2" y="-2" width="25" height="25" rx="2" fill="#FBF7FF"/><g fill="#0B0620">${cells}</g>${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</svg>`;
}
regSheet('wtJoin', () => ({
  jewel: '#C49BFF', label: 'Join a walk',
  html: `<p class="kicker">${ic('people')} Join a walk</p><h3>Walking with someone?</h3>
    <button class="viewfinder qr-scan" data-act="wtJoinScan" aria-label="Scan their code"><i class="vf tl"></i><i class="vf tr"></i><i class="vf bl"></i><i class="vf br"></i><span>${ic('camera')} Point at their screen</span></button>
    <p class="lbl">Or type their walk word</p>
    <div class="wt-type"><input id="wtWord" class="field" maxlength="6" placeholder="BEACON" autocapitalize="characters" aria-label="Walk word"><button class="btn primary small" data-act="wtJoinType">Join</button></div>
    ${src('Join by scanning the host’s QR when you’re together, or typing the 6-letter word — Melissa, Nov 5')}`,
}));
export const wtUI = { kind: 'whimsy', n: 2, letIn: [], with: null, code: null };
reg('wt-lobby', {
  jewel: () => (wtUI.kind === 'roulette' ? '#35C6D7' : walkDef(walkIdFor()).jewel),
  html() {
    const W = LOOPS.wt, me = hasName() ? S.name : 'You';
    const cand = [...new Set([...(wtUI.with ? [wtUI.with] : []), ...(S.added || []).slice().reverse(), ...S.friends])].filter((f) => S.friends.includes(f)).slice(0, wtUI.n - 1);
    const inN = wtUI.letIn.length, wait = Math.max(0, wtUI.n - 1 - inN);
    if (!wtUI.code) wtUI.code = WALK_WORDS[Math.floor(Math.random() * WALK_WORDS.length)];
    const code = wtUI.code;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(W.k)}</span></div>
      <h1 class="display">${esc(wtUI.kind === 'roulette' ? WHIMSY.roulette : walkName(walkIdFor()))}</h1>
      <p class="sub">${esc(wtUI.kind === 'roulette' ? W.subRl : W.sub)}</p>
      <p class="lbl">${esc(W.how)}</p><div class="seg minis" role="radiogroup">${W.counts.map((c) => `<button role="radio" aria-checked="${+c === wtUI.n}" class="${+c === wtUI.n ? 'on' : ''}" data-act="wtN" data-v="${c}">${esc(c)}</button>`).join('')}</div>
      <div class="wt-code">${qrSvg(code)}<div><p class="lbl">${esc(W.code)}</p><p class="code">${esc(code)}</p><p class="hint">Together? They scan the code. Apart? Read them the word.</p></div></div>
      <div class="lobby-row"><span class="pav me" style="--jewel:${WT_COLS[0]}">${esc(me[0])}</span><b>${esc(me)} (host)</b></div>
      ${cand.map((f, i) => wtUI.letIn.includes(f) ? `<div class="lobby-row"><span class="pav" style="--jewel:${WT_COLS[(i + 1) % WT_COLS.length]}">${esc(f[0])}</span><b>${esc(f)}</b><span class="hint">${ic('check')} ${esc(W.in)}</span></div>` : `<div class="lobby-row"><span class="pav">${esc(f[0])}</span><b>${esc(TOGETHER_WANTS(f))}</b><button class="btn jewel small" data-act="wtLetIn" data-v="${esc(f)}">${esc(W.letIn)}</button></div>`).join('')}
      ${!S.friends.length ? `<div class="empty-note invite"><p>${esc(W.none)}</p><button class="btn ghost small" data-sheet="friend">${esc(FEED.addFriend)}</button></div>` : wtUI.n - 1 > cand.length ? `<p class="hint">${ic('people')} ${esc(W.more(wtUI.n - 1 - cand.length))} <button class="link pretend" data-sheet="shareCode">${esc(W.shareCode)}</button></p>` : ''}
      <p class="hint">${ic('lock')} ${esc(W.friendsOnly)}</p>
      <div class="btns"><button class="btn primary" data-act="wtGo" ${inN ? '' : 'disabled'}>${esc(inN && wait ? W.wait(wait) + ' · ' + (wtUI.kind === 'roulette' ? W.goRl : W.go) : wtUI.kind === 'roulette' ? W.goRl : W.go)}</button></div>
      ${src('Walk Together: 2–8 phones, one shared doodle, a seal each — groups retest blocker (Ines’s 5, Priya & Sam); the brief had it as later')}${idea('Roulette for Two: the phones take turns, nobody sees the next one (groups)')}`;
  },
});
const TOGETHER_WANTS = (f) => `${firstName(f)} wants to join.`;

// ================================================================== ROUTE ROULETTE
// turns scale with the time: about one every 6 minutes, at least 5 (pass 2: a 90-minute one is 15 turns)
const rl = { t: null, i: 0, home: false, toward: '', turns: [], preset: null };
export function rlTurns(t, home) {
  if (home) return ROULETTE.homeTurns.slice();
  const n = ROULETTE.turnsFor(t), r = seeded('rl' + S.date + t), pool = ROULETTE.turnPool.slice(), out = [];
  while (out.length < n - 1) { if (!pool.length) pool.push(...ROULETTE.turnPool); out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]); }
  return out.concat([ROULETTE.homeStretch]);
}
reg('roulette', {
  jewel: () => '#35C6D7',
  html() {
    const R2 = ROULETTE;
    const dark = after();
    if (homeOff()) rl.home = false;
    if (!rl.t) return `<div class="bar">${backBtn()}<span class="walk-name">${esc(R2.k)}</span></div>
      <h1 class="display">${esc(R2.title)}</h1><p class="sub">${esc(R2.sub)}</p>
      ${S.wt ? `<p class="wt-strip">${S.wt.people.map((x, i) => `<span class="pav" style="--jewel:${WT_COLS[i % WT_COLS.length]}">${esc(x[0])}</span>`).join('')} ${esc(LOOPS.wt.label(S.wt.people.length))}</p>` : ''}
      ${homeOff() ? '' : `<div class="seg" role="radiogroup">${['out', 'home'].map((k) => `<button role="radio" aria-checked="${(rl.home ? 'home' : 'out') === k}" class="${(rl.home ? 'home' : 'out') === k ? 'on' : ''}" data-act="rlWhere" data-v="${k}">${esc(k === 'out' ? WHIMSY.outside : WHIMSY.home)}</button>`).join('')}</div>`}
      ${rl.toward ? `<p class="hint">${esc(R2.toward(rl.toward))}</p>` : ''}
      <p class="hint">${ic(rl.home ? 'home' : dark ? 'moon' : 'route')} ${esc(rl.home ? R2.homeVer : dark ? R2.twistDark : R2.twist)}</p>
      <div class="rl-times">${R2.times.map((x) => `<button class="choice ${rl.preset === x.id ? 'sel' : ''}" data-act="rlTime" data-v="${x.id}"><b>${esc(x.t)}</b><small>${esc(rl.home ? '5 turns' : `${R2.turnsFor(x.id)} turns`)}</small></button>`).join('')}</div>
      ${S.wt ? '' : `<button class="link wt-link" data-act="wtOpen" data-v="roulette">${ic('people')} ${esc(LOOPS.wt.btn)}</button>`}
      ${src('15 / 30 / 45 / 60 / 90 min, about a turn every 6 minutes — walkers retest (Roulette was 5 turns at any length)')}
      ${src('Route Roulette: pick a duration, loop back, unwalked streets, only the next turn — Melissa, Nov 2 / Oct 30; At Home version (C22)')}${solves('p10')}`;
    const turns = rl.turns.length ? rl.turns : rlTurns(rl.t, rl.home);
    const done = rl.i >= turns.length;
    const mins = Math.round(rl.t * Math.min(1, rl.i / turns.length));
    // walking together: the phones take turns, and nobody sees the next one (Roulette for Two)
    const ppl = S.wt ? S.wt.people : null, whose = ppl ? ppl[rl.i % ppl.length] : null, mine = !ppl || rl.i % ppl.length === 0;
    const line = done ? (rl.home ? R2.homeIndoor : S.loc !== 'city' ? R2.homeVisiting : R2.home) : mine ? turns[rl.i] : LOOPS.wt.hidden(firstName(whose));
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(R2.k)} · ${rl.t} min</span><span class="count">${Math.min(rl.i + 1, turns.length)} / ${turns.length}</span></div>
      ${ppl && !done ? `<p class="wt-strip">${ppl.map((x, i) => `<span class="pav ${x === whose ? 'now' : ''}" style="--jewel:${WT_COLS[i % WT_COLS.length]}">${esc(x[0])}</span>`).join('')} ${esc(mine ? LOOPS.wt.yourTurn : LOOPS.wt.turn(firstName(whose)))}</p>` : ''}
      ${doodle(rl.i + 1, 'rl' + S.day + rl.t, { loop: done, cols: ppl ? WT_COLS.slice(0, ppl.length) : null })}
      <p class="arrow flash ${mine ? '' : 'dim'}">${esc(line)}</p>
      ${done ? '' : hud(mins, 'roulette')}
      <div class="btns">${done ? `<button class="btn primary" data-act="rlDone">${esc(R2.done)}</button>` : `<button class="btn primary" data-act="rlNext">${esc(R2.nextTurn)}</button>`}</div>`;
  },
});
export const roulette = rl;

// ================================================================== MINI MISSION
const ms = { steps: 0, snap: false, kept: null, seal: null };
// ================================================================== SHOES ON (energy: Empty)
// Three tiny voiced taps; getting ready is the first win (Sky test idea; Melissa, Nov 4)
let shoeI = 0;
let shoeRes = 'none';
export const shoes = { reset() { shoeI = 0; shoeRes = 'none'; }, next() { shoeI = Math.min(3, shoeI + 1); return shoeI; }, set res(v) { shoeRes = v; }, get i() { return shoeI; } };
reg('shoes', {
  jewel: () => '#B36BFF',
  html() {
    const coat = S.temp <= 5 ? `It’s ${S.temp}° out. The warm one.` : S.weather === 'rain' ? 'The one with a hood.' : 'Or a hoodie. Anything counts.';
    const steps = [
      { t: 'Shoes On', line: 'Any shoes. Odd socks count.' },
      { t: 'Coat On', line: coat },
      { t: 'Door Open', line: 'Just stand in the doorway. One breath of outside.' },
    ];
    const done = shoeI >= 3;
    return `<div class="bar">${backBtn()}<span class="walk-name">Get out the door</span></div>
      <div class="guide"><span class="g-av">${esc(BOT[0])}</span><div class="g-bubble"><b>${esc(BOT)}</b><p>${esc(done ? 'You’re out. That was the hardest part.' : 'Three tiny taps. No story yet. Just these.')}</p>
        <button class="vo" data-act="vo" data-who="${esc(BOT)}" aria-label="Hear it">${ic('play')}<span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>Hear It</button></div></div>
      <ol class="shoes">${steps.map((st, i) => `<li class="${i < shoeI ? 'done' : i === shoeI ? 'now' : ''}">
        ${i === shoeI && !done ? `<button class="shoe-btn" data-act="shoeStep"><b>${esc(st.t)}</b><span>${esc(st.line)}</span></button>` : `<div class="shoe-btn"><b>${esc(st.t)}</b><span>${esc(i < shoeI ? 'Done.' : st.line)}</span></div>`}
        <i class="shoe-dot">${i < shoeI ? ic('check') : i + 1}</i></li>`).join('')}</ol>
      ${done ? `<div class="door-done-card" style="--jewel:#B36BFF">${doorDoodle()}<p class="big centre">${esc(LOOPS.doorCounted(shoeRes, S.seals))}</p>${sealRow(S.seals)}</div>
        <div class="btns"><button class="btn primary" data-go="mission">Take 10 Steps</button><button class="btn ghost" data-act="startStory" data-id="knight">A 5-Minute Story</button><button class="link" data-go="today" data-root="1">That’s Enough for Today</button></div>${src('Door Open counts: the day lights up, a seal, a doorway doodle — lowenergy retest (Sky)')}` : ''}
      ${src('Energy “Empty”: Shoes On → Coat On → Door Open, voiced; no story until you’re out — Sky test idea, Melissa Nov 4')}<div class="tabpad"></div>`;
  },
});

reg('mission', {
  jewel: () => '#F5B82E',
  html() {
    const M = MISSION;
    const m = missionSteps();
    if (ms.snap) return `<div class="bar">${backBtn()}<span class="walk-name">${esc(M.k)}</span></div>
      <div class="celebrate">${sparkle(56, 'var(--jewel)')}<h1 class="display">${esc(M.done)}</h1><p class="sub">${esc(M.doneSub)}</p></div>
      ${S.friendsOnly && (S.teen || S.company === 'friends') && S.friends.includes('Ama K.') && /green/.test(m.step2) ? `<p class="hint centre">${esc(M.compare)}</p>` : ''}
      <p class="hint centre">${esc(ms.seal === 'pressed' ? LOOPS.missionSeal : ms.seal === 'already' ? LOOPS.missionNoSeal : '')}</p>
      ${ms.kept === null ? `<div class="gemline">${gemSvg(m.gem || 'nature', 40)}<div><p>${esc(M.keepK)}</p><small class="hint">${esc(M.keepSub)}</small></div></div>
      <div class="btns"><button class="btn primary" data-act="mKeep" data-v="1">${esc(GEMS.save)}</button><button class="link" data-act="mKeep" data-v="0">${esc(M.noThanks)}</button></div>` : `<div class="btns"><button class="btn primary" data-go="today" data-root="1">${esc(M.home)}</button>${ms.kept ? `<button class="link" data-go="map" data-root="1">${esc(GEMS.goTo)}</button>` : ''}</div>`}
      ${src('“Save Gem to My Map” needs an explicit tap — Melissa, Oct 23 (A11)')}${solves('p9')}`;
    const stepped = ms.steps >= 10;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(M.k)}</span><span class="count">${esc(M.timer(60 - Math.min(59, ms.steps * 3)))}</span></div>
      <h1 class="display">${esc(m.title)}</h1><p class="hint">${esc(M.same)}</p>
      <ol class="mission-steps"><li class="${stepped ? 'done' : 'now'}"><b>${esc(S.pushes ? 'Move 10 steps or pushes. Hallway counts.' : M.step1)}</b><div class="pbar big"><i style="width:${ms.steps * 10}%"></i></div><small id="mstep">${esc(M.steps(ms.steps))}</small></li>
      <li class="${stepped ? 'now' : ''}"><b>${esc(m.step2)}</b></li></ol>
      <div class="btns">${stepped ? `<button class="btn jewel" data-act="mSnap">${ic('camera')} ${esc(M.snap)}</button>` : ''}<button class="btn ghost" data-go="doorstep">${esc(SOFA.doorstep)}</button></div>
      ${idea('Doorstep Missions (#23)')}`;
  },
  mount() {
    if (ms.snap || ms.steps >= 10) return;
    every(() => { ms.steps = Math.min(10, ms.steps + 1); if (ms.steps >= 10) rerender(); else { const b = $('.mission-steps .pbar i'); if (b) b.style.width = ms.steps * 10 + '%'; const t = $('#mstep'); if (t) t.textContent = MISSION.steps(ms.steps); } }, 450);
  },
});
export const mission = ms;

// Doorstep mission: a 60-second bird count from the front step (C11)
const ds = { n: 0, t: 60, seal: null, onDone: null };
reg('doorstep', {
  jewel: () => '#4CBFE9',
  html() {
    const D = after() ? LOOPS.doorDark : MISSION.doorstep;
    const done = ds.t <= 0;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(SOFA.doorstep)}</span><span class="count" id="dst">${esc(MISSION.timer(Math.max(0, ds.t)))}</span></div>
      <h1 class="display">${esc(D.title)}</h1><p class="sub">${esc(homeOff() ? NOHOME.doorLine : D.line)}</p>
      <p class="counter" id="dsn">${ds.n}</p>
      ${done ? `<p class="big centre">${esc(D.done(ds.n))}</p>${ds.seal ? `<p class="hint centre">${esc(ds.seal === 'pressed' ? LOOPS.missionSeal : ds.seal === 'already' ? LOOPS.missionNoSeal : '')}</p>` : ''}<div class="btns"><button class="btn primary" data-go="today" data-root="1">${esc(MISSION.home)}</button></div>` : `<div class="btns"><button class="btn jewel" data-act="bird">${esc(D.tap)}</button></div>`}
      ${src('“Do It at Your Door” (was From Your Step); the task matches the card and the time — loops must-fix 13')}
      ${idea('Doorstep Missions (#23)')}${solves('p9')}`;
  },
  mount() {
    if (ds.t <= 0) return;
    every(() => { ds.t -= 5; const t = $('#dst'); if (t) t.textContent = MISSION.timer(Math.max(0, ds.t)); if (ds.t <= 0) { if (ds.onDone) ds.onDone(); rerender(); } }, 500);
  },
});
export const doorstep = ds;

// ================================================================== GO menu (center tab variant)
regSheet('go', () => ({
  jewel: '#5B8CFF', label: GO.k,
  html: `<p class="kicker">${esc(GO.k)}</p><div class="choices">${GO.rows.map((r) => `<button class="choice" data-act="goMenu" data-v="${r.id}"><b>${esc(r.t)}</b><span>${esc(r.s)}</span></button>`).join('')}</div>${src('Centre GO menu — day-two mockup')}`,
}));
