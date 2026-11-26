// The story loop: first landing after the FTUE, the overview, Start, routes, the in-story map,
// treadmill, sofa, camera, gems, the chat reader, chapter breaks, endings, postcards, Lock It In,
// the comeback flow, Play Together and the linked arrival.
import {
  S, O, reg, regSheet, toast, openSheet, closeSheet, later, every, rerender, esc, ic, n0, solves, src, idea,
  bestMode, byId, STORIES, weatherKind, isDark, gemSvg, GEM_TYPES, gemCol, localHere, catOf, badgeOf, timeLabel, backBtn, sparkle, $, $$,
  MODE_COL, modeName, walkTxt, distTxt, daylightLeft, modeState, trialDates, inCanada, ruralOk, hasName, blurShared, pronoun, homeOff, remembered,
} from './core.js';
import {
  SUMMONS_END, VICTORY, RECS, TRIAL, ACCOUNT, OVERVIEW, START, ROUTES, PERMISSION, WALKMAP, TREAD, SOFA, CAMERA, READER,
  BREAK, ENDING, POSTCARD, LOCKIN, GEMS, COMEBACK, TOGETHER, LINKED, CARD, MORE, WEATHER, MAP, BOT, LOOPS, NOHOME, LIVEMAP,
} from './words.js';
import { storyCard, coverOf, thumb, bubble, modeSwitch, factsRow, chip, toggle } from './ui.js';
import { storyMap, liveWorld, routePreview, treadMap, postcardRoute, TRACK, ROUTE, along, slice, isRural, W as MAP_W, H as MAP_H } from './maps.js';
import { SQUEAKY, PREVIOUSLY } from './stories.js';
import { stepsFor, treadMinutes, curStory, chapterTitle, priceTxt, familyLine, lenTrail, lenScale, storyLen, fmtMins, sinceCard } from './screens-tabs.js';

// the one flow being played
export const F = { id: 'squeaky', way: 'door', length: 'written', ch: 3, mode: 'walk', remember: false, custom: false, time: 15, kids: false, route: null, radius: 0, newStory: false, carry: 0 };
const pts = (a) => a.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
const chOf = (s) => (s.id === 'squeaky' ? 5 : s.chapters);
const unitWord = () => (s) => (s.episodes ? 'Episode' : 'Chapter');

// ================================================================== FIRST LANDING AFTER THE FTUE
// The Summons' last chapter and the in-story account ask were removed (Melissa, Nov 4): they belong
// to the FTUE; the mockup starts at "Good places to start".
regSheet('acctInside', () => {
  const A = ACCOUNT;
  return {
    jewel: byId.summons.accent, label: A.inside.title,
    html: `<div class="gemline">${gemSvg('curio', 40)}<p>${esc(A.inside.line)}</p></div>
      <h3>${esc(A.inside.title)}</h3><p class="more">${esc(A.inside.sub)}</p>
      <div class="btns signin"><button class="btn ghost" data-act="signInSheet">${esc(A.apple)}</button><button class="btn ghost" data-act="signInSheet">${esc(A.google)}</button><button class="btn ghost" data-act="signInSheet">${esc(A.email)}</button></div>
      <div class="btns"><button class="link" data-close>${esc(A.skip)}</button></div>
      ${src('Nov 3: “Create an account (skippable), asked again inside the sample story”. No benefit pictures (Oct 8).')}`,
  };
});

// The Summons victory screen was removed too (Melissa, Nov 4): it's the FTUE's last screen, so this
// mockup starts at "Good places to start".

// picks after a story: must work anywhere, and in the dark (Oct 15; tester B10)
export function recPicks(from) {
  const dark = isDark();
  if (from === 'squeaky') return ['knight', dark || isRural() ? 'adelaide' : 'alice'];
  const second = O.recPick === 'alice' ? 'alice' : O.recPick === 'anywhere' ? 'knight' : (dark || isRural() ? 'knight' : 'alice');
  return ['incident', second];
}
reg('recs', {
  jewel: (p) => (p.from === 'squeaky' ? byId.squeaky.accent : byId.summons.accent),
  html(p) {
    const fromSq = p.from === 'squeaky';
    const ids = recPicks(p.from);
    const who = fromSq ? 'The Mailbox' : 'Wren';
    const T = MORE.teaser;
    const line = fromSq ? MORE.mailLine(T[ids[0]], T[ids[1]]) : (ids[1] === 'alice' ? RECS.line : MORE.recLine(T[ids[0]], T[ids[1]]));
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(fromSq ? ENDING.recsTitle : RECS.title)}</span></div>
      <div class="guide"><span class="g-av">${esc(fromSq ? 'M' : 'W')}</span><div class="g-bubble"><b>${esc(who)}</b><p>${esc(line)}</p></div></div>
      <h2 class="sw-head">${esc(RECS.title)}</h2>
      <div class="sw-list">${ids.map((id) => { const s = byId[id]; return `<button class="stepcard" data-act="recStart" data-id="${id}">${thumb(s, 't-step')}<span class="sc-info"><b>${esc(s.title)}</b><span class="sc-sum">${esc(s.blurb || s.hook)}</span><span class="sc-chip">${esc(s.genre)}</span></span></button>`; }).join('')}</div>
      <div class="btns"><button class="btn primary" data-act="recsLibrary">${esc(fromSq && O.lockIn === 'follow' ? BREAK.lockIn : 'Show me other adventures')}</button></div>
      ${src('Matches the real Welcome “Good places to start” list (StoryStepCard: 2:3 cover, title, summary, genre chip; “Show me other adventures”) — Melissa, Nov 4. Character recommends — Oct 21/28; picks must work anywhere and after dark — Oct 15 (B10); option “Second pick after the FTUE”')}`;
  },
});

reg('trial', {
  jewel: () => '#5B8CFF', cls: () => 'trialscr',
  html(p) {
    const T = TRIAL, d = +O.trial, dates = trialDates(d);
    const second = p.second && !S.account;
    const price = priceTxt();
    return `<div class="bar"><button class="back" data-act="trialNo" aria-label="${esc(T.close)}">${ic('x')}</button></div>
      <p class="cliff">${esc(p.cliff || T.cliff)}</p>
      <p class="kicker">${esc(second ? T.second.kicker : T.kicker)}</p><h1 class="display">${esc(second ? T.second.title : T.title)}</h1><p class="sub">${esc(second ? T.second.lead : T.lead(d))}</p>
      ${second ? `<div class="btns"><button class="btn jewel" data-act="keepStory">${esc(T.second.keep)}</button></div>${src('Golden Path page: a new reader without an account can keep one premium story (B5)')}` : ''}
      <ul class="ticks">${T.perks.map((x) => `<li>${ic('check')} ${esc(x)}</li>`).join('')}${familyLine() ? `<li>${ic('people')} ${esc(familyLine())}</li>` : ''}</ul>
      <ol class="timeline">${T.timeline(d, price, dates.remind, dates.end).map((x, i) => `<li class="${i ? '' : 'now'}"><b>${esc(x.k)}</b><span>${esc(x.t)}</span></li>`).join('')}</ol>
      <div class="plans" role="radiogroup">${T.plans.map((pl) => `<button role="radio" aria-checked="${S.trialPlan === pl.id}" class="plan ${S.trialPlan === pl.id ? 'on' : ''}" data-act="plan" data-v="${pl.id}"><b>${esc(pl.name)}</b><span class="price">${esc(inCanada() ? pl.price.replace('$', 'CA$') : T.storePrice[pl.id])}</span>${inCanada() ? `<small>${esc(pl.per)}</small>` : ''}${pl.best ? `<em>${esc(pl.best)}</em>` : ''}</button>`).join('')}</div>
      ${!inCanada() ? `<p class="hint">${esc(T.storeCurrency)}</p>` : ''}
      <p class="trust">${ic('bell')} ${esc(S.city === 'Lagos' ? T.trustAndroid : T.trust)}</p>
      <div class="btns"><button class="btn primary" data-act="trialYes">${esc(T.go)}</button><p class="hint centre">${esc(T.goPrice(price))}</p><button class="link" data-act="trialNo">${esc(T.notNow)}</button></div>
      <p class="hint centre"><button class="link pretend" data-act="noop" data-t="${esc(T.restore)}">${esc(T.restore)}</button> · <button class="link pretend" data-sheet="whyNot">${esc(T.help.title)}</button></p>
      ${src(`RevenueCat-hosted in the real app; needs a close — Brett, Oct 8. Trial length ${d} days (open, C3). Dates computed, price on the button (B4, C12).`)}${solves('p5')}`;
  },
});
regSheet('whyNot', () => ({
  jewel: '#C49BFF', label: TRIAL.help.title,
  html: `<h3>${esc(TRIAL.help.title)}</h3><p class="more">${esc(TRIAL.help.sub)}</p><div class="choices">${TRIAL.help.rows.map((r) => `<button class="choice" data-act="whyRow" data-v="${r.id}"><b>${esc(r.t)}</b><span>${esc(r.id === 'walk' && homeOff() ? NOHOME.helpWalk : r.s)}</span></button>`).join('')}</div>${src('trial-moment mockup “What would help?”')}`,
}));
regSheet('trialNotif', () => ({
  jewel: '#F5B82E', label: TRIAL.notifK,
  html: `<p class="kicker">${esc(TRIAL.notifK)}</p><h3>${esc(TRIAL.notif)}</h3><div class="btns"><button class="btn primary" data-act="trialNotif" data-v="1">${esc(TRIAL.notifYes)}</button><button class="link" data-act="trialNotif" data-v="0">${esc(TRIAL.notifNo)}</button></div>${src('The promised trial reminder needs notification permission (B4)')}`,
}));

reg('account', {
  jewel: () => '#5B8CFF',
  html(p) {
    const A = ACCOUNT, pre = p.mode === 'pre';
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(A.kicker)}</span></div>
      ${pre ? `<div class="rev-only"><p class="kicker">${esc(A.orderKicker)}</p><ol class="order">${A.order.map((x, i) => `<li class="${i === 0 ? 'done' : i === 1 ? 'now' : ''}">${esc(x)}</li>`).join('')}</ol></div>` : ''}
      <h1 class="display">${esc(A.title)}</h1><p class="sub">${esc(pre ? A.pre : A.re)}</p>
      <div class="btns signin"><button class="btn ghost" data-act="signIn">${esc(A.apple)}</button><button class="btn ghost" data-act="signIn">${esc(A.google)}</button><button class="btn ghost" data-act="signIn">${esc(A.email)}</button></div>
      <div class="btns"><button class="link" data-act="skipAccount" data-mode="${pre ? 'pre' : 're'}">${esc(A.skip)}</button></div>
      ${src(A.note)}
      ${src('Nov 3 order: Welcome → Create an account (skippable for now) → sample → paywall at its end. Continue as guest stays (Sep 11, Oct 15). Leo checking Apple on a hard gate.')}
      ${pre ? `<p class="solves">mockup: the sample story (The Summons) plays after this step, then you land at its last chapter.</p>` : ''}`;
  },
});

// ================================================================== LINKED ARRIVAL (Mo)
let tipI = 0;
reg('linked', {
  jewel: () => '#DA82ED',
  html() {
    const L = LINKED;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(L.k)}</span></div>
      <div class="frame coming" style="--jewel:#DA82ED"><p class="kicker">${esc(L.by)}</p><p class="big huge">${esc(L.title)}</p><p class="date">${esc(L.date)}</p></div>
      <div class="row2 mt"><button class="btn ghost small" data-act="notify">${esc(L.notify)}</button><button class="btn ghost small" data-sheet="creator" data-p='{"who":"kevin"}'>${esc(L.more)}</button></div>
      <section class="newhere"><p class="big">${esc(L.newHere.replace('5-minute', '5‑minute'))}</p>${storyCard(byId.summons, { cls: 'hero', hook: true })}<div class="btns"><button class="btn primary" data-act="startStory" data-id="summons">${esc(L.sample)}</button><button class="btn ghost" data-sheet="together" data-p='{"id":"summons"}'>${esc(OVERVIEW.together)}</button><button class="btn ghost" data-sheet="make">${esc(MORE.make.btn)}</button></div></section>
      ${src('Creator-link arrivals skip onboarding: offer the sample + first-time tips — Emily, Nov 3 (i140); creator sheet and “make your own” (C4)')}
      ${S.tips && tipI < L.tips.length ? `<div class="spot" data-act="tipNext" role="dialog" aria-label="Tip"><div class="spot-card"><span class="g-av">${esc(BOT[0])}</span><p><b class="g-name">${esc(BOT)}</b>${esc(L.tips[tipI])}</p><small>${tipI + 1} / ${L.tips.length}</small><div class="row2"><button class="link" data-act="tipsOff">${esc(L.tipOff)}</button><button class="btn ghost small" data-act="tipNext">Next</button></div></div></div>` : ''}`;
  },
});
export const tips = { next() { tipI++; }, off() { tipI = 99; S.tips = false; }, reset() { tipI = 0; } };

// ================================================================== STORY OVERVIEW
// "Made by": writer and artist as little faces, plus a fan of their other covers
const initials = (n) => n.replace(/[^A-Za-z ]/g, ' ').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
function makerCard(s, creatorName) {
  const [writer, art] = s.creator.split(/,\s*(?:art|illustrations) by\s*/i);
  const people = [{ n: writer, role: 'Story' }].concat(art ? [{ n: art, role: 'Art' }] : []);
  const ours = /^Story City/.test(writer);
  const others = STORIES.filter((x) => x.id !== s.id && x.creator.split(',')[0] === creatorName && coverOf(x)).slice(0, 3);
  const faces = people.map((p, i) => `<span class="mk-face" style="--i:${i}">${ours && i === 0 ? ic('spark') : esc(initials(p.n))}</span>`).join('');
  const names = people.map((p) => `<span class="mk-name"><small>${p.role}</small>${esc(p.n)}</span>`).join('');
  const fan = others.length ? `<span class="mk-fan" aria-hidden="true">${others.map((x, i) => `<img src="${coverOf(x)}" alt="" style="--r:${(i - (others.length - 1) / 2) * 9}deg">`).join('')}</span>` : '';
  return `<button class="maker" data-sheet="creator" data-p='${esc(JSON.stringify({ name: creatorName }))}' style="--jewel:${s.accent}">
    <span class="mk-faces">${faces}</span><span class="mk-names">${names}<em>${esc(O2more(creatorName, others.length))}</em></span>${fan}</button>`;
}
const O2more = (n, k) => (k ? `${k + 1} stories · See them all` : `More by ${n.split(' ')[0]}`);

reg('overview', {
  jewel: (p) => (byId[p.id] || {}).accent,
  html(p) {
    const s = byId[p.id] || byId.squeaky;
    const O2 = OVERVIEW;
    const hearted = S.myList.includes(s.id);
    const head = `<div class="ov-top"><button class="back" data-back aria-label="Back">${ic('back')}</button><span class="sp"></span>${s.coming ? '' : `<button class="ibtn heart ${hearted ? 'on' : ''}" data-act="heart" data-id="${s.id}" aria-pressed="${hearted}" aria-label="${esc(hearted ? O2.hearted : O2.heart)}">${ic('heart')}</button>`}</div>`;
    if (s.coming) {
      return `${head}<div class="frame coming" style="--jewel:${s.accent}"><p class="kicker">${esc(s.creator)}</p><p class="big huge">${esc(s.title)}</p><p class="date">${esc(O2.comingTitle)}</p></div><p class="sub">${esc(O2.comingSub)}</p><div class="btns"><button class="btn primary" data-act="notify">${esc(O2.notify)}</button><button class="btn ghost" data-sheet="creator" data-p='{"who":"kevin"}'>${esc(LINKED.more)}</button></div>${src('No plot written anywhere: title, creator and date only (stories.json); Kevin’s launch ~Nov 12 — Emily, Nov 3')}`;
    }
    const prog = S.progress[s.id];
    const fin = S.finished[s.id];
    const local = s.cat === 'local', here = localHere(s), far = local && !here;
    const rural = isRural();
    const paid = ['trial', 'member'].includes(S.member);
    const modeTile = (m) => { const st = modeState(s, m); const on = st === 'on'; const tip = st === 'soon' ? O2.modeOffTip.soon : on ? '' : O2.modeOffTip[(s.offTip && s.offTip[m]) || 'none']; return `<button class="mtile ${on ? '' : 'off'}" style="--mc:${MODE_COL[m]}" ${on ? `data-act="toast" data-t="${esc(WALKMAP.tips[m].t)}"` : `data-tip="${esc(tip)}" data-act="tip"`}>${ic(m)}<b>${esc(modeName(m))}</b><span>${esc(on ? O2.modeShort[m] : st === 'soon' ? 'Coming soon' : 'Not in this one')}</span>${on && bestMode(s) === m ? `<em class="bestfit">${esc(O2.bestFit)}</em>` : ''}</button>`; };
    const startLabel = prog ? O2.keep : s.episodes ? O2.startEp(1) : O2.start;
    const walkMins = Math.round((s.steps || 0) / 100);
    const dl = S.downloadedIds && S.downloadedIds.includes(s.id);
    const mb = S.lowData ? 2 : 42;
    const creatorName = s.creator.split(',')[0];
    return `${head}
      <div class="cover${coverOf(s) ? ' has-art' : ''}" style="--jewel:${s.accent}">${coverOf(s) ? `<img class="wash" src="${coverOf(s)}" alt=""><img class="poster" src="${coverOf(s)}" alt="${esc(s.title)} cover">` : `<span class="ghost" aria-hidden="true">${esc(s.title.replace(/^(The|A) /, '')[0])}</span>`}
        <div class="cold" id="cold" aria-label="${esc(O2.hookKicker)}"></div></div>
      <p class="kicker">${esc(catOf(s))} · ${esc(s.genre)}${s.age ? ` · ${esc(s.age)}` : ''}</p>
      <h1 class="display ov-title">${esc(s.title)}</h1>
      <p class="byline">by ${esc(s.creator)}</p>
      <p class="hook-l">${esc(s.hook)}</p>
      <div class="pills"><span class="pill free">${esc(s.free ? 'Free' : O2.free)}</span><span class="pill">${esc(badgeOf(s))}</span>${s.rating ? `<span class="pill">★ ${s.rating[0]} (${s.rating[1]})</span>` : ''}${s.seasonal ? `<span class="pill season">${esc(O2.seasonal)}</span>` : ''}</div>
      <div class="stream" id="stream">
        <div class="sk" data-n="0">${factsRow(s)}${s.mins && s.steps ? `<p class="hint">${esc(s.episodes ? `${timeLabel(s)} · about ${walkMins} min of walking each` : O2.allIn(timeLabel(s).replace('about ', ''), `${walkMins} min`))}</p>` : ''}</div>
        ${fin ? `<section class="sk" data-n="1"><p class="kicker section">${esc(O2.endingsK)}</p><div class="endings-row">${Array.from({ length: Math.min(6, s.endings) }, (_, i) => i < fin.length ? `<div><b>${esc(fin[i])}</b><span>Found</span></div>` : `<div class="locked"><b>?</b><span>${esc(O2.endingLocked)}</span></div>`).join('')}</div><div class="btns"><button class="btn ghost" data-act="findAnother" data-id="${s.id}">${esc(O2.findAnother)}</button></div>${src('Endings found + silhouettes, replay from your last choice (B20)')}</section>` : ''}
        ${s.cat === 'passport' ? `<div class="sk banner" data-n="1">${ic('compass')} ${esc(O2.passportBanner(s.city))}${src('Passport banner (real copy) — Passport stories Flow')}</div>` : ''}
        ${far ? `<div class="sk banner far" data-n="1">${ic('pin')} ${esc((homeOff() ? NOHOME.localFar : O2.localFar)(s.place ? (s.place.includes(s.city) ? s.place : `${s.place}, ${s.city}`) : s.city))}${O.localFar === 'virtual' ? `<p class="hint">${esc(O2.virtualLine)}</p>` : ''}${solves('p4')}</div>` : ''}
        ${s.sit && !s.cafe ? `<div class="sk banner" data-n="1">${ic('library')} ${esc(O2.noneNote)}</div>` : ''}
        ${s.cafe ? `<div class="sk banner" data-n="1">${ic('route')} ${esc(O2.cafeNote)}</div>` : ''}
        ${s.town && rural ? `<div class="sk banner far" data-n="1">${ic('pin')} ${esc(CARD.badges.town)}. ${esc(O2.ruralStops)}</div>` : ''}
        ${isDark() && !s.sit && O.darkNote === 'show' ? `<div class="sk banner dark" data-n="1">${ic('moon')} ${esc(homeOff() ? (rural ? NOHOME.flips.ruralDark.t : NOHOME.afterDark) : rural ? WEATHER.flips.ruralDark.t : O2.afterDark)}${solves('p6')}</div>` : ''}
        <section class="sk" data-n="2"><p class="kicker section">${esc(O2.modesKicker)}</p><div class="mtiles">${['walk', 'path', 'hunt'].map(modeTile).join('')}</div>${bestMode(s) ? `<p class="hint">${esc(O2.bestWhy[bestMode(s)])}</p>` : ''}${src(`Greyed modes with a friendly tooltip — Oct 7, Oct 16; Path ${O.pathReady === 'soon' ? '“coming soon” until single-pin placement is ready — Oct 13' : 'live (team option)'}`)}</section>
        <section class="sk" data-n="3"><p class="kicker section">${esc(O2.catKicker)}</p><div class="catcard"><b>${esc(catOf(s))}</b><p>${esc(CARD.catMeans[O.cats === 'three' && s.cat === 'nearyou' ? 'anywhere' : s.cat])}</p></div>${src(O.cats === 'four' ? 'Four badges — Naming Conventions' : 'Three categories — Decision Log, Oct 16')}</section>
        ${s.episodes ? `<section class="sk" data-n="4"><p class="kicker section">${esc(O2.episodes)}</p><div class="eps">${Array.from({ length: s.episodes.count }, (_, i) => `<span class="ep ${s.episodes.live.includes(i + 1) ? '' : 'soon'}">${i + 1}<small>${esc(s.episodes.live.includes(i + 1) ? O2.epLive : O2.epSoon)}</small></span>`).join('')}</div></section>` : ''}
        ${s.km ? `<section class="sk" data-n="4"><p class="kicker section">${esc(O2.whereKicker)}</p>${s.start ? `<p class="big small-big">${esc(O2.startsAt(s.start))}${here ? ` · ${here} min ${S.loc === 'far' ? 'walk' : 'drive'}` : ''}</p>` : `<p class="hint">${esc(O2.placedNear)}</p>`}<div class="mapbox mini">${routePreview('ov', s.start ? O.routePreview : 'dots', s.accent, Math.min(17, s.chapters), s.id.length)}</div><p class="meta">${esc(`${s.km.toFixed(1)} km · ${walkTxt(s.steps)} · ${s.chapters} stops`)}</p><p class="hint"><b>${esc(O2.stopsKicker)}:</b> ${esc(rural && s.cat !== 'local' ? O2.ruralStops : s.stops)}</p><p class="safety">${ic('check')} ${esc(rural ? O2.ruralPublic : O2.publicOnly)}</p>${src(`Route preview: ${O.routePreview}; start named, dots = stops (B2)`)}${solves('p6')}</section>` : ''}
        ${s.lengths ? `<p class="hint sk" data-n="4">${esc(s.lengths.join(' · '))} — the only real pick-your-length pair.</p>` : ''}
        <section class="sk" data-n="5"><p class="kicker section">${esc(O2.access)}</p><p class="access">${ic(s.access ? 'check' : 'info')} ${esc(s.access || O2.accessUnknown)}</p>${src('Step-free and bench info (C9); guessed per story')}</section>
        <section class="sk" data-n="5"><p class="kicker section">${esc(O2.bringKicker)}</p><p class="bring">${esc(s.bring)}</p>${s.together ? `<button class="link ov-together" data-act="ovTogether" data-id="${s.id}">${ic('people')} ${esc(O2.togetherLink)}${s.players ? ` · ${esc(s.players)}` : ''}</button>` : ''}${solves('p11')}</section>
        <section class="sk" data-n="5"><button class="btn ghost small" data-act="download" data-id="${s.id}">${ic('download')} ${esc(dl ? O2.dlDone(mb) : O2.dlLabel(mb))}</button></section>
        <section class="sk" data-n="6"><p class="kicker section">${esc(O2.madeBy)}</p>${makerCard(s, creatorName)}${src('Made by card with More by — Emily, Nov 3 (C4); writer + artist faces and a fan of their covers — Melissa, Nov 4')}</section>
        ${!s.free ? `<section class="sk premium" data-n="6"><p class="kicker">${esc(O2.premiumK)}</p><p>${esc(paid ? O2.premiumMember : O2.freeLine)}</p>${!paid && familyLine() ? `<p class="hint">${esc(familyLine())}</p>` : ''}</section>` : ''}
        <section class="sk" data-n="7"><p class="kicker section">${esc(O2.nextKicker)}</p><div class="row-scroll">${s.recs.filter((id) => id !== s.id && !byId[id].sample).concat(s.recs.filter((id) => byId[id].sample && s.id !== id && !s.sample)).slice(0, 4).map((id) => storyCard(byId[id])).join('')}</div>${src('Every story recommends 4 next picks — Emily’s list, Nov 3')}</section>
      </div>
      <div class="dockpad"></div>
      <div class="dock">${far && O.localFar === 'onsite' ? `<p class="hint centre">${esc((homeOff() ? NOHOME.localFar : OVERVIEW.localFar)(s.city))}</p>` : ''}<button class="btn primary" data-act="startStory" data-id="${s.id}">${esc(startLabel)}</button>${!prog && !s.free && !paid ? `<p class="dock-note">${esc('Chapter 1 is free. No account needed.')}</p>` : ''}</div>
      ${solves('p3')}${src('Start pinned above the fold; streams in instead of a spinner — snag Sep 25, Oct 30; chapter 1 free in every story')}`;
  },
  mount(p, el) {
    const s = byId[p.id]; if (!s || s.coming) return;
    const cold = $('#cold', el);
    s.cold.forEach((t, i) => later(() => { const b = document.createElement('p'); b.className = 'cb'; b.textContent = t; cold.appendChild(b); }, 250 + i * 650));
    $$('.sk', el).forEach((n) => { n.classList.add('wait'); later(() => n.classList.remove('wait'), 120 + (+n.dataset.n) * 140); });
    if (p.start) later(() => openSheet('start', { id: s.id, fresh: true }), 300);
  },
});
regSheet('dlAsk', (p) => ({
  jewel: '#5B8CFF', label: OVERVIEW.dlAsk,
  html: `<p class="kicker">${esc(OVERVIEW.dlAsk)}</p><h3>${esc(OVERVIEW.dlAskSub(S.lowData ? 2 : 42))}</h3><div class="btns"><button class="btn primary" data-act="dlWait" data-id="${esc(p.id)}">${esc(OVERVIEW.dlWait)}</button><button class="btn ghost" data-act="dlNow" data-id="${esc(p.id)}">${esc(OVERVIEW.dlNow)}</button></div>${src('Roaming and capped plans: ask before a big download (B13, A16)')}`,
}));

// ================================================================== START: how are you walking today?
export function waysFor(s) {
  const local = s.cat === 'local', far = local && !localHere(s);
  // homePlay off (Golden Path Q24, TTT): no From the Sofa / At Home way. A no-walking story just opens.
  if (homeOff()) {
    if (s.sit && !s.cafe) return ['read'];
    if (s.cafe) return ['route'];
    if (local) return far ? (O.localFar === 'virtual' ? ['virtual'] : ['there']) : ['there', 'virtual'];
    const w = ['door'];
    if (modeState(s, 'path', 'route') === 'on' && !isRural()) w.push('route');
    w.push('tread');
    return w;
  }
  if (s.sit && !s.cafe) return ['sofa'];
  if (s.cafe) return ['route', 'sofa'];
  if (local) return far ? (O.localFar === 'virtual' ? ['virtual', 'sofa'] : ['there']) : ['there', 'virtual', O.homeOpt === 'one' ? 'home' : 'sofa'];
  const w = ['door'];
  if (modeState(s, 'path', 'route') === 'on' && !isRural()) w.push('route');
  if (O.homeOpt === 'one') w.push('home'); else w.push('tread', 'sofa');
  return w;
}
export function smartWay(s) {
  const ways = waysFor(s);
  const k = weatherKind();
  const off = homeOff();
  // homePlay off: the indoor fallback is the treadmill, and only for someone who walks on one; else Out the Door
  const indoor = off ? (S.remember === 'tread' && ways.includes('tread') ? 'tread' : null)
    : ways.includes(S.remember) && ['tread', 'sofa', 'home'].includes(S.remember) ? S.remember : ways.includes('sofa') ? 'sofa' : ways.includes('home') ? 'home' : null;
  // a no-walking story: weather and the dark don't matter, so the reason is always "no walking"
  if (s.sit && !s.cafe) return { w: ways[0], why: START.smartWhy.sit };
  const mins = s.mins ? s.mins[0] : 15;
  let w = null, why = null;
  const rem = remembered();
  if (rem && ways.includes(rem)) { w = rem; why = rem === 'tread' ? 'pad' : 'remembered'; }
  else if (k === 'cold' && ways.includes('tread')) { w = 'tread'; why = 'cold'; }
  else if (['rain', 'storm', 'cold', 'snow'].includes(k) && (indoor || off)) { w = indoor || ways[0]; why = k; }
  // never steer people outside into the dark (tester C6); with homePlay off: lit streets you know
  else if ((isDark() || (daylightLeft() > 0 && daylightLeft() < mins + 10)) && (indoor || off)) { w = indoor || ways[0]; why = isDark() ? 'dark' : 'darkSoon'; }
  else { w = ways[0]; why = S.weather === 'cloud' ? 'cloud' : 'clear'; }
  if (!ways.includes(w)) w = ways[0];
  if (!(S.remember && w === S.remember) && !['dark', 'darkSoon', 'rain', 'storm', 'cold', 'snow'].includes(why)) { if (w === 'virtual') why = 'virtual'; else if (w === 'there') why = 'there'; else if (s.cafe && w === 'route') why = 'cafe'; else if (s.sit && !s.cafe) why = 'sit'; }
  return { w, why: (off && NOHOME.smartWhy[why]) || START.smartWhy[why] || '' };
}
const wayMeta = (w) => (w === 'virtual' ? { name: OVERVIEW.virtual, line: OVERVIEW.virtualLine, meta: 'Steps · virtual' } : w === 'read' ? NOHOME.read : START.ways[w]);
const wayIcon = { door: 'door', route: 'route', tread: 'tread', sofa: 'sofa', home: 'sofa', there: 'pin', virtual: 'compass', read: 'library' };
const wayCol = { door: '#00CD9D', route: '#5B8CFF', tread: '#F5B82E', sofa: '#C49BFF', home: '#C49BFF', there: '#5B8CFF', virtual: '#00CD9D', read: '#C49BFF' };
const LENK = { short: 0.5, written: 1, long: 2 };
function wayLength(s, w, len) {
  const trail = O.length === 'trail';
  const steps = stepsFor(s, trail ? null : len);
  if (w === 'read' || (homeOff() && s.sit && !s.cafe)) return NOHOME.readLen;
  if (w === 'sofa' || w === 'home' || (s.sit && !s.cafe)) return 'At home · no steps needed';
  if (trail) { const L = storyLen(s, S.scale || 1); return `About ${fmtMins(L.total)} · ${n0(L.steps)} steps`; }
  if (w === 'tread') return START.treadMin(treadMinutes(steps, 4), 4, Math.max(1, chOf(s) - 1));
  return `${START.lengths[len].name} · ${walkTxt(steps)} a chapter`;
}

regSheet('start', (p) => {
  const s = byId[p.id] || byId[F.id];
  if (F.id !== s.id || p.fresh) { const sm = smartWay(s); Object.assign(F, { id: s.id, way: p.way && waysFor(s).includes(p.way) ? p.way : sm.w, custom: false, remember: !!remembered(), kids: S.company === 'kids', route: null, together: !!p.together && !!s.together }); }
  const sm = smartWay(s);
  const ways = waysFor(s);
  const prog = S.progress[s.id];
  const goLabel = prog ? START.goKeep : s.episodes ? OVERVIEW.startEp(1) : START.go;
  const wayRow = (w) => { const m = wayMeta(w); return `<button class="way ${F.way === w ? 'on' : ''}" role="radio" aria-checked="${F.way === w}" style="--wc:${wayCol[w]}" data-act="way" data-v="${w}">${ic(wayIcon[w])}<span><b>${esc(m.name)}</b><small>${esc(m.line)}</small></span><em>${esc(m.meta)}</em></button>`; };
  const offWays = ['door', 'route', 'tread'].filter((w) => !ways.includes(w) && !(O.homeOpt === 'one' && w === 'tread') && !(ways.includes('there') && w === 'route'));
  const offTip = (w) => (s.sit ? START.wayOff.door_none : s.cat === 'local' ? START.wayOff.door_local : s.cat === 'passport' && w === 'route' ? OVERVIEW.modeOffTip.passport : isRural() && w === 'route' ? 'No placed routes out here yet. Out the Door works anywhere.' : modeState(s, 'path', 'route') === 'soon' ? OVERVIEW.modeOffTip.soon : START.wayOff.route_none);
  const offRows = offWays.map((w) => `<button class="way off" data-act="tip" data-tip="${esc(offTip(w))}" aria-disabled="true">${ic(wayIcon[w])}<span><b>${esc(START.ways[w].name)}</b><small>${esc(s.sit && !s.cafe ? START.wayOff.door_none : START.tooltipSoon)}</small></span></button>`).join('');
  const lenBlock = O.length === 'none' || (s.sit && !s.cafe) || ['sofa', 'home', 'read'].includes(F.way) ? '' : F.way === 'route'
    ? `<p class="lbl">${esc(START.routeLengths)}</p><div class="choices">${START.routes.map((r) => `<button class="choice ${F.route === r.id ? 'sel' : ''}" data-act="routeLen" data-v="${r.id}" aria-pressed="${F.route === r.id}"><b>${esc(r.t)}</b><span>${esc(r.s)}</span></button>`).join('')}</div>${src('Real route profiles: 1 km Loop, 1/2 km Walk, 3 km Loop (API)')}`
    : O.length === 'trail'
      ? (() => { const k = S.scale || 1; return `<p class="lbl">${esc(START.length)}</p>${lenTrail(s, k)}<input type="range" id="lenRange" class="ft-range" data-id="${s.id}" min="40" max="250" step="10" value="${Math.round(k * 100)}" style="--p:${Math.round((k - 0.4) / 2.1 * 100)}%" aria-label="${esc(`Length of the walk: about ${fmtMins(storyLen(s, k).total)}`)}">${lenScale(s)}<p class="hint">${esc(START.lengthNote)}</p>${src('One slider for the overall walk: total time, steps and distance; the walk you get uses the same factor (Melissa, Nov 5)')}`; })()
    : O.length === 'minutes'
      ? `<p class="lbl">${esc(START.length)}</p><div class="chips">${[15, 30, 45].map((m) => chip(`${m} min`, F.time === m, `data-act="lenMin" data-v="${m}"`)).join('')}</div>${src('15 / 30 / 45 slider — Melissa, Oct 6')}`
      : `<p class="lbl">${esc(START.length)}</p><div class="choices">${['short', 'written', 'long'].map((k) => { const L = START.lengths[k]; return `<button class="choice ${F.length === k ? 'sel' : ''}" data-act="len" data-v="${k}" aria-pressed="${F.length === k}"><b>${esc(L.name)}</b><span>${esc(L.line)} ${esc(F.way === 'tread' ? START.treadMin(treadMinutes(stepsFor(s, k), 4), 4) : `${walkTxt(stepsFor(s, k))} a chapter`)}.</span></button>`; }).join('')}</div><p class="hint">${esc(START.lengthNote)}</p>${s.sample && F.way === 'tread' ? `<p class="hint">${esc(START.sampleNote)}</p>` : ''}${idea('Length dial (#9)')}`;
  const timeFirst = `<p class="lbl">${esc(START.timeFirst)}</p><div class="chips">${START.times.map((t) => chip(t.t, F.time === t.id, `data-act="timeFirst" data-v="${t.id}"`)).join('')}</div><p class="hint">${esc(START.fitsIn(F.time, Math.max(1, Math.round(F.time / 8))))}</p>`;
  const kids = S.company === 'kids' && !s.sit ? `<div class="kidcap">${toggle('kids', F.kids, START.kids, START.kidsLine)}${F.kids ? `<div class="pad12"><p class="hint">${esc(START.kidsControl)}</p><p class="lbl">${esc(START.radius)}</p><div class="chips">${START.radii.map((r, i) => chip(r, F.radius === i, `data-act="radius" data-v="${i}"`)).join('')}</div></div>` : ''}${idea('Kid Captain (#10)')}${solves('p11')}</div>` : '';
  // a no-walking story has one way only: nothing to remember, no modes to switch
  const remember = ways.length < 2 ? '' : `<label class="remember"><input type="checkbox" data-tg="remember" ${F.remember ? 'checked' : ''}><span><b>${esc(START.remember)}</b><small>${esc(START.rememberNote)}</small></span></label>`;
  // Play Together lives here now, under the why line (Melissa, Nov 5); only on stories that play together
  const canTogether = !!s.together && !(s.sit && !s.cafe);
  if (!canTogether) F.together = false;
  const who = canTogether ? `<div class="viewby who" role="group" aria-label="${esc(START.whoLabel)}"><span>${esc(START.who)}</span><div class="seg minis">${[['solo', START.justMe], ['together', TOGETHER.k.replace('Play together', 'Play Together')]].map(([k, l]) => `<button class="${(F.together ? 'together' : 'solo') === k ? 'on' : ''}" aria-pressed="${(F.together ? 'together' : 'solo') === k}" data-act="startWho" data-v="${k}">${esc(l)}</button>`).join('')}</div></div>${F.together ? `<p class="hint who-line">${ic('people')} ${esc(s.id === 'dynasty' ? START.togetherDynasty : START.togetherLine)}</p>` : ''}` : '';
  const goBtn = (label) => (F.together ? `<button class="btn primary" data-act="startTogether" data-id="${s.id}">${ic('people')} ${esc(START.goTogether)}</button>` : `<button class="btn primary" data-act="startGo">${esc(label)}</button>`);
  const lockLine = s.sit && !s.cafe ? '' : `<p class="lockline">${esc(S.storyOnly && O.modeLock === 'switch' ? START.lock.storyOnly : START.lock[O.modeLock])}</p>`;
  let body;
  if (O.startAsk === 'smart' && !F.custom) {
    const m = wayMeta(F.way);
    body = `<p class="why">${esc(sm.why)}</p>${who}<div class="way on big" style="--wc:${wayCol[F.way]}">${ic(wayIcon[F.way])}<span><b>${esc(m.name)}</b><small>${esc(m.line)}</small></span><em>${esc(O.length === 'none' ? m.meta : wayLength(s, F.way, F.length))}</em></div>
      ${F.way === 'door' && ways.includes('route') ? `<button class="link" data-act="loopBack">${esc(START.loopBack)}</button>` : ''}
      ${O.length === 'trail' ? lenBlock : ''}${kids}<div class="btns">${goBtn(goLabel)}<button class="link" data-act="custom">${esc(START.customize)}</button></div>${lockLine}
      ${src('Smart default from your door + Customize — Emily, Melissa agreed, Nov 3; dark and dusk default indoors (C6)')}${idea('Weather-aware default (#10)')}`;
  } else {
    body = `${O.startAsk === 'time' ? timeFirst : ''}<p class="why">${esc(sm.why)}</p>${who}<div class="ways" role="radiogroup">${ways.map(wayRow).join('')}${offRows}</div>
      ${O.startAsk === 'time' ? '' : lenBlock}${kids}${remember}
      <div class="btns">${goBtn(F.way === 'route' && !F.route ? START.findRoute : goLabel)}${O.startAsk === 'smart' ? `<button class="link" data-act="custom">${esc(START.hideCustom)}</button>` : ''}</div>${lockLine}
      ${src(O.startAsk === 'four' ? 'Every way shown with the smart pick pre-selected, no Customize — Melissa, Nov 5 (was Golden Path, Oct 30 four options)' : O.startAsk === 'time' ? '“How long do you have?” first — Melissa, Nov 3' : 'Customize — Nov 3')}`;
  }
  return {
    jewel: s.accent, label: START.kicker, cls: 'tall',
    html: `${thumb(s, 't-sheet')}<p class="kicker">${esc(START.kicker)}</p><h3>${esc(s.title)}</h3>${body}${solves('p1', 'p2')}`,
  };
});

// ================================================================== ROUTES
let cook = 0;
reg('routes', {
  jewel: () => '#5B8CFF',
  html(p) {
    const R = ROUTES;
    const rural = isRural();
    const lenName = p.len ? (START.routes.find((r) => r.id === p.len) || {}).t : '';
    if (p.cook && cook < 2) return `<div class="bar">${backBtn()}<span class="walk-name">${esc(R.kicker)}</span></div><div class="cooking"><div class="pot" aria-hidden="true"><i></i><i></i><i></i></div><h1 class="display">${esc(R.cooking)}</h1>${lenName ? `<p class="hint">${esc(lenName)}${p.stepfree ? ' · step-free' : ''}</p>` : ''}<ul class="cook-steps" id="cooksteps"></ul></div>${src('“Cooking up your perfect route” — Melissa, Nov 3')}`;
    if (p.cook) return `<div class="bar">${backBtn()}<span class="walk-name">${esc(R.ready)}</span></div><h1 class="display">${esc(R.ready)}</h1><div class="mapbox">${routePreview('rr', 'line', '#5B8CFF', 4, 2)}</div><p class="big">${esc(R.readyLine(p.len === '3loop' ? '3.0' : p.len === '2walk' ? '2.0' : '1.0', 4))}</p>${p.stepfree ? `<p class="access">${ic('check')} Step-free, with a bench at every stop</p>` : ''}<p class="safety">${ic('check')} ${esc(rural ? OVERVIEW.ruralPublic : R.publicOnly)}</p>
      <div class="btns"><button class="btn primary" data-act="routeUse">${esc(R.startHere)}</button><button class="btn ghost" data-act="routeAgain">${esc(R.another)}</button></div>${solves('p4', 'p6')}${src('Park mode, flex radius, public tags only — Andrew, Nov 3; backyard drop-spot bug')}`;
    const s = byId[p.id || F.id];
    const local = s && s.cat === 'local';
    const row = (k, t, sub, b, len, extra = '') => `<button class="route-row" data-go="routes" data-p='${esc(JSON.stringify({ cook: 1, id: s ? s.id : '', len: len || '', stepfree: extra === 'sf' ? 1 : 0 }))}'><div class="rr-map">${routePreview('r' + k, 'line', '#5B8CFF', 4, k)}</div><div><span class="rbadge">${esc(b)}</span><b>${esc(t)}</b><small>${esc(sub)}</small></div>${ic('chev')}</button>`;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(R.kicker)}</span></div>
      <h1 class="display">${esc(R.title)}</h1>
      ${rural ? row(1, 'Out and back on your road', 'Ends where you started', 'Generated', '2walk') : `
      ${local ? row(1, s.start || s.place, s.stops, R.author) : ''}
      ${row(2, R.closest('0.6'), '4 stops · 1.1 km', R.community)}
      ${START.routes.map((r, i) => row(3 + i, r.t, r.s, 'Generated', r.id)).join('')}
      ${row(9, R.park, R.parkLine, 'Generated')}`}
      ${row(10, MORE.stepFreeRoute, 'Flat, no stairs, a bench at every stop', 'Generated', '1loop', 'sf')}
      <div class="btns"><button class="btn primary" data-go="routes" data-p='{"cook":1,"id":"${s ? s.id : ''}"}'>${esc(R.generate)}</button></div>
      <p class="safety">${ic('check')} ${esc(rural ? OVERVIEW.ruralPublic : R.publicOnly)}</p>
      ${src('Route Selection (real copy, SC-3876): “Find a route near you”, “Use This Route”; rural and step-free options (A4, C9)')}`;
  },
  mount(p) {
    if (!(p.cook && cook < 2)) { if (!p.cook) cook = 0; return; }
    ROUTES.cookingSteps.forEach((t, i) => later(() => { const u = $('#cooksteps'); if (u) u.insertAdjacentHTML('beforeend', `<li>${ic('check')} ${esc(t)}</li>`); }, 300 + i * 420));
    later(() => { cook = 2; rerender(); }, 2200);
  },
});
export const routesCook = { reset() { cook = 0; }, get v() { return cook; } };

// ================================================================== PERMISSION (in character, on the map)
regSheet('perm', () => ({
  jewel: '#00CD9D', label: 'Location and steps',
  html: `<div class="guide"><span class="g-av">W</span><div class="g-bubble"><b>${esc(PERMISSION.from)}</b><p>${esc(PERMISSION.line1)} ${esc(PERMISSION.line2)}</p></div></div>
    <p class="hint">${esc(PERMISSION.why)} ${esc(PERMISSION.noAlways)}</p>
    <div class="btns"><button class="btn primary" data-act="perm" data-v="use">${esc(PERMISSION.inUse)}</button><button class="btn ghost" data-act="perm" data-v="steps">${esc(PERMISSION.steps)}</button><button class="link" data-act="perm" data-v="no">${esc(PERMISSION.notNow)}</button></div>
    ${src('Asked on the map, in character — Oct 21; no “always” in V1 — Brett, Oct 30')}${solves('p8')}`,
}));
regSheet('permPush', () => ({
  jewel: '#C49BFF', label: 'Staying inside?',
  html: `<p class="big">${esc(homeOff() ? NOHOME.refusedPush : PERMISSION.refusedPush)}</p><div class="btns"><button class="btn primary" data-act="${homeOff() ? 'toTread' : 'toSofa'}">${esc(homeOff() ? START.ways.tread.name : START.ways.sofa.name)}</button><button class="btn ghost" data-act="perm" data-v="steps">${esc(PERMISSION.steps)}</button></div>${src('Oct 30 draft keeps the “stay inside” pushback (C7)')}`,
}));
regSheet('approx', () => ({
  jewel: '#F5B82E', label: 'Approximate location',
  html: `<p class="big">${esc(PERMISSION.approx)}</p><div class="btns"><button class="btn primary" data-act="useSteps">${esc(PERMISSION.useSteps)}</button><button class="btn ghost" data-act="noop" data-t="${esc(PERMISSION.openSettings)}">${esc(PERMISSION.openSettings)}</button></div>${solves('p7')}${src('Chaos audit: approximate location never finishes, silently (L2)')}`,
}));
regSheet('skip', () => ({
  jewel: '#C49BFF', label: WALKMAP.skip.k,
  html: O.skipWalk === 'none'
    ? (homeOff() ? `<p class="big">${esc(NOHOME.skipNone)}</p><div class="btns"><button class="btn primary" data-close>${esc(WALKMAP.skip.b)}</button></div>${src('No skip — Melissa, Oct 15; play at home off (homePlay)')}`
      : `<p class="big">${esc(WALKMAP.skip.none)}</p><div class="btns"><button class="btn primary" data-act="toSofa">${esc(START.ways.sofa.name)}</button><button class="btn ghost" data-close>${esc(WALKMAP.skip.b)}</button></div>${src('No skip — Melissa, Oct 15')}`)
    : `<p class="kicker">${esc(WALKMAP.skip.k)}</p><p class="big">${esc(WALKMAP.skip.t)}</p><div class="btns"><button class="btn primary" data-act="arrive">${esc(WALKMAP.skip.a)}</button><button class="btn ghost" data-close>${esc(WALKMAP.skip.b)}</button></div>${src('Never show the paywall from the walk screen — Sep 22 snag; free skip shipped 4.27.2')}`,
}));
regSheet('modeTip', (p) => { const t = WALKMAP.tips[p.m]; return { jewel: MODE_COL[p.m], label: t.k, html: `<p class="kicker">${esc(t.k)}</p><h3>${esc(t.t)}</h3><p class="more">${esc(t.s)}</p><div class="btns"><button class="btn jewel" data-close>${esc(WALKMAP.tips.ok)}</button></div>${O.tips === 'pertip' ? `<button class="link" data-act="tipsOffSheet">Don’t Show Again</button>` : ''}${src('Tutorial copy — Naming Conventions; ? brings tips back — Oct 16')}` }; });

// ================================================================== THE IN-STORY MAP
const walk = { f: 0, done: false, gps: false, located: false, hunt2: false };
export const walkState = walk;
// the trail slider's factor (S.scale) when it's the length control, so the walk matches what you picked
export const goalFor = () => stepsFor(byId[F.id], O.length === 'trail' ? null : F.length);
function chapterInfo() { const s = byId[F.id]; if (s.id === 'squeaky' && SQUEAKY.chapters[F.ch]) return SQUEAKY.chapters[F.ch]; return { title: chapterTitle(s.id, F.ch), place: 'the next stop', thing: 'the next stop' }; }
const chHead = (ch) => (/^Chapter \d+$/.test(chapterInfo().title) ? `Chapter ${ch}` : `Chapter ${ch} · ${chapterInfo().title}`);

const liveLook = () => O.walkMapLook !== 'mock';
reg('walkmap', {
  jewel: () => (liveLook() ? LIVE_ACC[F.mode] : MODE_COL[F.mode]), cls: () => (liveLook() ? 'mapscr lwmscr' : 'mapscr'),
  html() {
    if (liveLook()) return liveWalkmap();
    const s = byId[F.id], ch = chapterInfo(), m = F.mode, goal = goalFor();
    const lockedOpt = O.modeLock === 'start' ? { locked: true, lockTip: WALKMAP.lockedHint } : O.modeLock === 'route' && F.way === 'route' ? { locked: true, lockTip: WALKMAP.routeHint } : {};
    lockedOpt.way = F.way;
    const footer = O.modeLock === 'switch' ? (S.storyOnly ? START.lock.storyOnly : WALKMAP.switchHint) : O.modeLock === 'start' ? WALKMAP.lockedHint : WALKMAP.routeHint;
    const virtual = F.way === 'virtual';
    const fog = O.fogWhere === 'everywhere';
    const line = m === 'hunt' ? WALKMAP.huntLine : F.kids ? WALKMAP.spotter(ch.thing) : WALKMAP.counting;
    return `<header class="slim">${backBtn(WALKMAP.backStory)}<div><b>${esc(s.title)}</b><span>${esc(chHead(F.ch))}</span></div><button class="ibtn" data-sheet="modeTip" data-p='{"m":"${m}"}' aria-label="Show the tip again">?</button></header>
      <p class="objective">${esc(m === 'hunt' ? WALKMAP.objective.hunt(ch.thing) : WALKMAP.objective[m])}</p>
      <div class="mapbox full" id="wm">${storyMap({ mode: m, fog })}
        ${m === 'path' ? `<div class="locating" id="locating">${esc(WALKMAP.locating)}</div>` : ''}
        ${virtual ? `<div class="virtual-tag">${esc(OVERVIEW.virtualNote)}</div>` : ''}
        ${m === 'hunt' ? '<i class="vf tl"></i><i class="vf tr"></i><i class="vf bl"></i><i class="vf br"></i>' : ''}
        <div class="gpscard" id="gpscard" hidden><p class="kicker">${esc(WALKMAP.fuzzy.k)}</p><p class="big">${esc(WALKMAP.fuzzy.t)}</p><p class="hint" id="gpswait">${esc(WALKMAP.fuzzy.wait(3))}</p><button class="btn jewel small" id="imhere" data-act="arrive" hidden>${esc(WALKMAP.fuzzy.here)}</button>${solves('p7')}</div>
        <div class="gpscard closed" id="closedcard" hidden><p class="kicker">${esc(WALKMAP.stopClosed.k)}</p><p class="big">${esc(WALKMAP.stopClosed.t)}</p><button class="btn jewel small" data-act="swapStop">${esc(WALKMAP.stopClosed.a)}</button>${solves('p6')}</div>
        <div class="arrival" id="arrival" hidden><div class="burst" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<i style="--r:${i * 30}deg"></i>`).join('')}</div><span class="unlocked">${esc(WALKMAP.unlocked)}</span><p class="big">${esc(WALKMAP.arrived)}</p>${O.fogWhere === 'burst' ? `<p class="hint">A little fog lifted around this stop.</p>` : ''}<button class="btn jewel" data-act="openChapter">${esc(WALKMAP.openCh(F.ch))}</button>${solves('p7')}</div>
      </div>
      <div class="panel">
        ${modeSwitch(m, s, lockedOpt)}
        <div class="readout" id="readout">${readout(m, goal)}</div>
        <p class="counting">${ic(m === 'hunt' ? 'camera' : 'walk')} <span>${esc(line)}</span></p>
        ${m === 'hunt' ? `<button class="btn jewel" data-act="huntPhoto" id="huntbtn">${ic('camera')} ${esc(WALKMAP.takePhoto)}</button>` : ''}
        <p class="foot">${esc(footer)}</p>
        <div class="${homeOff() ? 'row2' : 'row3'} links3"><button class="link" data-act="stopHere">${esc(WALKMAP.stopHere.replace(' for Today', ''))}</button>${homeOff() ? '' : `<button class="link" data-act="finishHome">${esc(WALKMAP.finishHome)}</button>`}<button class="link" data-sheet="skip">${esc(WALKMAP.skipBtn)}</button></div>
        <p class="hint centre">${ic('flag')} ${esc(WALKMAP.stopLong)}</p>
        <div class="mocktray" aria-label="${esc(WALKMAP.mock.label)}"><span>${esc(WALKMAP.mock.label)}</span><button data-act="mockAhead">${esc(WALKMAP.mock.ahead)}</button><button data-act="mockGps">${esc(WALKMAP.mock.gps)}</button><button data-sheet="approx">${esc(WALKMAP.mock.approx)}</button><button data-act="mockClosed">${esc(WALKMAP.mock.closed)}</button></div>
        ${src('No Start Walking button: counting starts when the map opens with a destination — Oct 7; slim story + chapter header — Oct 7; Walk ring + yellow→green trail; Path metres + “Locating…”; Hunt radius moves with you — Oct 7–16; one step number everywhere (A6)')}${solves('p8')}
      </div>`;
  },
  mount(p, scr) {
    Object.assign(walk, { f: F.carry || 0, done: false, gps: false, located: F.mode !== 'path', hunt2: false }); F.carry = 0;
    if (!S.perm) later(() => openSheet('perm'), 350);
    if (F.mode === 'path') later(() => { walk.located = true; const l = $('#locating'); if (l) l.hidden = true; const st = $('#lwm-status'); if (st && !walk.done) { st.innerHTML = liveStatus('path', goalFor()); livePaint(goalFor()); } }, 1400);
    if (liveLook()) liveMount(scr);
    const goal = goalFor();
    const speed = Math.max(1, goal / 70);
    every(() => {
      if (walk.done || walk.gps || !walk.located || document.getElementById('sheet').hidden === false) return;
      walk.f = Math.min(1, walk.f + speed / goal);
      paint(goal);
      if (walk.f >= 1 && F.mode !== 'hunt') arrive();
    }, 140);
  },
});
const blocks = (left) => (isRural() || S.pushes || O.unit === 'distance' ? WALKMAP.blocksRural(distTxt(left)) : WALKMAP.blocks(Math.max(1, Math.round(left * 0.75 / 90))));
function readout(m, goal) {
  const left = Math.round(goal * (1 - walk.f));
  if (m === 'walk') {
    if (S.storyOnly || O.unit === 'minutes') return `<b class="big-n" id="rn">${Math.max(0, Math.round(left / 100))}</b><span>min to go</span><small id="rb">${esc(blocks(left))}</small>`;
    return `<b class="big-n" id="rn">${n0(Math.round(goal * walk.f))}</b><span>${esc(S.pushes ? `out of ${n0(goal)} steps or pushes` : WALKMAP.stepsOf(n0(goal)))}</span><small id="rb">${esc(blocks(left))}</small>`;
  }
  if (m === 'path') { const metres = Math.round(goal * 0.75 * (1 - walk.f)); return `<b class="big-n" id="rn">${n0(metres)}</b><span>${esc(WALKMAP.metres('').replace(/^ /, ''))}</span><div class="pbar big"><i id="pb" style="width:${walk.f * 100}%"></i></div>`; }
  return `<b class="big-n hunt-n" id="rn">${esc(walk.hunt2 ? WALKMAP.hunt2(chapterInfo().thing) : '')}</b>`;
}
function paint(goal) {
  if (liveLook()) return livePaint(goal);
  const m = F.mode;
  const pos = m === 'path' ? along(ROUTE, walk.f) : along(TRACK, walk.f);
  const me = $('#meg .me'); if (me) me.setAttribute('transform', `translate(${pos[0].toFixed(1)} ${pos[1].toFixed(1)})`);
  if (m === 'walk') {
    const tr = $('#trail'); if (tr) tr.setAttribute('points', pts(slice(TRACK, walk.f)));
    const ring = $('#ring'); if (ring) { ring.setAttribute('cx', pos[0]); ring.setAttribute('cy', pos[1]); ring.setAttribute('r', Math.max(10, 120 * (1 - walk.f)).toFixed(1)); }
  }
  if (m === 'hunt') {
    const hr = $('#huntR'); if (hr) hr.setAttribute('transform', `translate(${pos[0].toFixed(1)} ${pos[1].toFixed(1)})`);
    if (walk.f > 0.5 && !walk.hunt2) { walk.hunt2 = true; const r = $('#rn'); if (r) r.textContent = WALKMAP.hunt2(chapterInfo().thing); }
    if (walk.f >= 1) walk.f = 1;
  }
  const fc = $('#fogclear'); if (fc) fc.setAttribute('points', pts(slice(TRACK, Math.max(0.05, walk.f))));
  const rd = $('#readout'); if (rd && m !== 'hunt') rd.innerHTML = readout(m, goal);
  const c = $('.counting span'); if (c && walk.f > 0.05 && m !== 'hunt' && !F.kids) c.textContent = WALKMAP.pocket;
}
export function arrive() {
  if (walk.done) return; walk.done = true; walk.f = 1;
  closeSheet(true);
  const g = $('#gpscard'); if (g) g.hidden = true;
  const a = $('#arrival'); if (a) a.hidden = false;
  liveArrive();
  if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) try { navigator.vibrate(60); } catch (e) {}
}
export function mockGps() {
  walk.gps = true; const g = $('#gpscard'); if (!g) return; g.hidden = false;
  let n = 3; const w = $('#gpswait');
  const t = every(() => { n--; if (w) w.textContent = WALKMAP.fuzzy.wait(Math.max(0, n)); if (n <= 0) { clearInterval(t); const b = $('#imhere'); if (b) b.hidden = false; if (w) w.textContent = 'In the real app: after 60 s within about 80 m.'; } }, 700);
}

// ================================================================== THE IN-STORY MAP, LIVE-APP LOOK (walkMapLook = live)
// Copied from the live app, 4.28.1 (origin/main): WalkMapScreen.tsx shows FtueMap.tsx with the reader's props
// (no character tip, no lockModes, own player dot in Hunt only). Sizes and colours from FtueMapStyles.ts,
// ScriptedFtueConstants.ts (MAP_MODE_COLORS), HuntCameraButtonStyles.ts, SkipWalkRowStyles.ts and StoryCityButton.tsx.
const LIVE_ACC = { walk: '#3ddc84', path: '#2f8bff', hunt: '#b36bff' };   // MAP_MODE_ACCENTS
// walkColor(): the Walk ring, bar and trail fade from walkStart #f2c230 to walkEnd #3ddc84 as you get closer
const walkColor = (p) => { const a = [0xf2, 0xc2, 0x30], b = [0x3d, 0xdc, 0x84]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * Math.max(0, Math.min(1, p)))).join(', ')})`; };
const lwState = { sat: false, snackT: 0 };
const LIVE_IC = {
  // Walk is the app's Ionicons "walk" figure, redrawn here; Path and Hunt are the live app's own 24-unit paths
  walk: '<circle cx="13.5" cy="3.8" r="2.1" fill="currentColor" stroke="none"/><path d="M13.6 7.6 11.2 15M11.2 15l-2.6 6.4M11.2 15l3.1 2.6 1 3.9M13.2 9.6 9.4 11.6l-1 3.4M13.4 9.2l1.9 2.9 3.1 1.1" stroke-width="2.3"/>',
  path: '<path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/>',
  hunt: '<path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3"/><circle cx="12" cy="12" r="3"/>',
  // Ionicons outlines, redrawn
  layers: '<path d="M12 3.5 2.8 8.2l9.2 4.6 9.2-4.6z"/><path d="m2.8 12.2 9.2 4.6 9.2-4.6"/><path d="m2.8 16.2 9.2 4.6 9.2-4.6"/>',
  map: '<path d="M9 4.5 3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
  camera: '<path d="M8.6 6.2 10 4.2h4l1.4 2H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.2a2 2 0 0 1 2-2z"/><circle cx="12" cy="12.6" r="3.6"/>',
};
const liveIc = (k, cls = 'lwm-ic', sw = 2) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LIVE_IC[k]}</svg>`;
// the hunt target, as the reader's "Look for:" line shows it ("a fire hydrant" becomes "Fire hydrant")
const lookFor = (t) => { const x = String(t || '').replace(/^(a|an|the|your)\s+/i, ''); return x.charAt(0).toUpperCase() + x.slice(1); };
const destName = () => { const t = chapterInfo().title; return t.charAt(0).toUpperCase() + t.slice(1); };

// StepsBar: the count over a thick rounded bar, in the mode's colour (Walk and Path)
function liveSteps(n, goal, col) {
  const pct = goal ? Math.min(100, (n / goal) * 100) : 0;
  return `<div class="lwm-steps"><p class="lwm-steps-t"><b id="lwm-n">${Math.round(n)}</b><span>${esc(LIVEMAP.outOf(goal))}</span></p><div class="lwm-track"><i id="lwm-fill" style="width:${pct.toFixed(1)}%;background:${col}" ${pct > 0 ? '' : 'hidden'}></i></div></div>`;
}
// The card's status area is always as tall as Hunt's camera button, so the card never changes size.
function liveStatus(m, goal) {
  const n = Math.round(goal * walk.f);
  if (m === 'walk') return liveSteps(n, goal, walkColor(walk.f));
  if (m === 'path') return walk.located ? liveSteps(n, goal, LIVE_ACC.path) : `<div class="lwm-locating"><i class="lwm-spin" aria-hidden="true"></i><span>${esc(LIVEMAP.findingPlace)}</span></div>`;
  return `<button class="lwm-shutter" data-act="huntPhoto" aria-label="${esc(LIVEMAP.takePhoto)}"><span>${liveIc('camera', 'lwm-cam', 1.6)}</span></button>`;
}
function liveFooter(m) {
  if (walk.done) return `<button class="lwm-continue" data-act="openChapter">${esc(LIVEMAP.cont)}</button>`;
  let route = '';
  if (m === 'path') {
    // a route picked on Route Selection is "Generated around you"; otherwise the reader has none chosen yet
    const onRoute = F.way === 'route';
    const name = onRoute ? (START.routes.find((r) => r.id === F.route) || {}).t : '';
    route = `<div class="lwm-route">${liveIc('map', 'lwm-ic lwm-route-ic', 1.6)}<div class="lwm-route-t">${name ? `<b>${esc(name)}</b>` : ''}<small>${esc(onRoute ? LIVEMAP.route.generated : LIVEMAP.route.none)}</small></div><button class="lwm-route-act" data-go="routes" data-p='${esc(JSON.stringify({ id: F.id }))}'>${esc(onRoute ? LIVEMAP.route.change : LIVEMAP.route.choose)}</button></div>`;
  }
  return `${route}<button class="lwm-skip" data-sheet="skip">${esc(LIVEMAP.skip)}</button>`;
}

function liveWalkmap() {
  const s = byId[F.id], ch = chapterInfo(), m = F.mode, goal = goalFor();
  walk.located = m !== 'path';   // Path opens on "Finding a place to walk to…" (mount sets the same, just after)
  const locked = O.modeLock === 'start' || (O.modeLock === 'route' && F.way === 'route');
  const seg = (k) => {
    const sel = k === m;
    const st = modeState(s, k, F.way);
    let note = '';
    if (!sel && st !== 'on') note = k === 'path' ? LIVEMAP.pathUnavailable : OVERVIEW.modeOffTip[(s.offTip && s.offTip[k]) || 'none'];
    else if (!sel && locked) note = O.modeLock === 'start' ? WALKMAP.lockedHint : WALKMAP.routeHint;
    const attrs = note ? `data-lwm-note="${esc(note)}" aria-disabled="true"` : `data-act="mode" data-m="${k}"`;
    return `<button class="lwm-seg${sel ? ' on' : ''}${k === 'walk' ? ' lwm-seg-walk' : ''}" role="tab" aria-selected="${sel}" ${sel ? `style="background:${LIVE_ACC[k]}"` : ''} ${attrs}>${liveIc(k)}<span>${esc(LIVEMAP.modes[k])}</span>${note ? '<i class="lwm-lock" aria-hidden="true"></i>' : ''}</button>`;
  };
  const hunt = m === 'hunt';
  return `<div class="lwm mode-${m}" id="lwm" style="--acc:${LIVE_ACC[m]}">
      <div class="lwm-topfade" aria-hidden="true"></div>
      <div class="lwm-top">
        <button class="lwm-back" data-back aria-label="${esc(LIVEMAP.backToStory)}"><svg class="lwm-chev" viewBox="0 0 12 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l-6 6 6 6"/></svg><svg class="lwm-book" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/></svg></button>
        <h1 class="lwm-title">${esc(s.title)}</h1>
        <button class="lwm-back lwm-layers${lwState.sat ? ' on' : ''}" data-lwm-layers aria-label="${esc(lwState.sat ? LIVEMAP.map : LIVEMAP.satellite)}">${liveIc('layers', 'lwm-ic lwm-layers-ic', 1.6)}</button>
      </div>
      <div class="lwm-map" id="lwm-map">
        ${liveWorld({ sat: lwState.sat })}
        ${m === 'walk' ? '<i class="lwm-ring" id="lwm-ring" aria-hidden="true"></i>' : ''}
        ${hunt ? `<div class="lwm-hunt" id="lwm-hunt" aria-hidden="true"><svg class="lwm-hring" id="lwm-hring"><circle fill="none" stroke="#b36bff" stroke-width="2" stroke-dasharray="4 8"/></svg><div class="lwm-sweep"><svg id="lwm-sweep"><defs><radialGradient id="lwm-fade" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#b36bff" stop-opacity=".45"/><stop offset="1" stop-color="#b36bff" stop-opacity="0"/></radialGradient></defs><path fill="url(#lwm-fade)"/></svg></div></div>` : ''}
        ${m === 'path' ? `<div class="lwm-pin" id="lwm-pin" aria-hidden="true"><b>${esc(destName())}</b><svg viewBox="0 0 30 40"><path d="M15 39 C11 31 1 25 1 15 A14 14 0 1 1 29 15 C29 25 19 31 15 39Z" fill="#2f8bff" stroke="#fff" stroke-width="2"/></svg></div>` : ''}
        <i class="lwm-dot${hunt ? ' own' : ''}" id="lwm-dot" aria-hidden="true"></i>
        ${hunt ? '<i class="lwm-vf tl"></i><i class="lwm-vf tr"></i><i class="lwm-vf bl"></i><i class="lwm-vf br"></i>' : ''}
        <i class="lwm-bottomfade" aria-hidden="true"></i>
        <div class="lwm-snack" id="lwm-snack" role="status" hidden></div>
        <div class="gpscard" id="gpscard" hidden><p class="kicker">${esc(WALKMAP.fuzzy.k)}</p><p class="big">${esc(WALKMAP.fuzzy.t)}</p><p class="hint" id="gpswait">${esc(WALKMAP.fuzzy.wait(3))}</p><button class="btn jewel small" id="imhere" data-act="arrive" hidden>${esc(WALKMAP.fuzzy.here)}</button>${solves('p7')}</div>
        <div class="gpscard closed" id="closedcard" hidden><p class="kicker">${esc(WALKMAP.stopClosed.k)}</p><p class="big">${esc(WALKMAP.stopClosed.t)}</p><button class="btn jewel small" data-act="swapStop">${esc(WALKMAP.stopClosed.a)}</button>${solves('p6')}</div>
      </div>
      <div class="lwm-card" id="lwm-card">
        <div class="lwm-obj"><p class="lwm-objective">${esc(destName())}</p>${hunt ? `<p class="lwm-sub">${esc(LIVEMAP.lookFor(lookFor(ch.thing)))}</p>` : ''}</div>
        <div class="lwm-switch" role="tablist" aria-label="${esc(LIVEMAP.switchLabel)}">${['walk', 'path', 'hunt'].map(seg).join('')}</div>
        <div class="lwm-status" id="lwm-status">${liveStatus(m, goal)}</div>
        <p class="lwm-hint">${esc(hunt ? LIVEMAP.huntHint : LIVEMAP.switchHint)}</p>
        <div class="lwm-footer" id="lwm-footer">${liveFooter(m)}</div>
      </div>
    </div>
    <div class="lwm-below">
      <div class="mocktray" aria-label="${esc(WALKMAP.mock.label)}"><span>${esc(WALKMAP.mock.label)}</span><button data-act="mockAhead">${esc(WALKMAP.mock.ahead)}</button><button data-act="mockGps">${esc(WALKMAP.mock.gps)}</button><button data-sheet="approx">${esc(WALKMAP.mock.approx)}</button><button data-act="mockClosed">${esc(WALKMAP.mock.closed)}</button></div>
      ${src('Live app 4.28.1 (origin/main): WalkMapScreen.tsx + FtueMap.tsx, copy from en.json; still says Walk, not Steps. Old design: Team Options, In-story map screen B')}
    </div>`;
}

function liveMount(scr) {
  const root = scr && scr.querySelector('#lwm');
  if (!root) return;
  root.addEventListener('click', (e) => {
    const n = e.target.closest('[data-lwm-note]');
    if (n) { liveSnack(n.dataset.lwmNote); return; }
    if (e.target.closest('[data-lwm-layers]')) { lwState.sat = !lwState.sat; if (!walk.done) F.carry = walk.f; rerender(); }
  });
  // place the dot, ring, pin and sweep once the map has its size
  later(() => livePaint(goalFor()), 0);
}
// MapSnackbar: drops in at the top of the map, then hides itself
function liveSnack(text) {
  const el = $('#lwm-snack'); if (!el) return;
  el.textContent = text; el.hidden = false;
  clearTimeout(lwState.snackT); lwState.snackT = setTimeout(() => { const x = $('#lwm-snack'); if (x) x.hidden = true; }, 3200);
}

function livePaint(goal) {
  const box = $('#lwm-map'); if (!box) return;
  const m = F.mode, f = walk.f;
  const bw = box.clientWidth, bh = box.clientHeight;
  const k = Math.max(bw / MAP_W, bh / MAP_H);
  const me = m === 'path' ? along(ROUTE, f) : along(TRACK, f);
  const pin = ROUTE[ROUTE.length - 1];
  // the camera: Walk and Hunt follow you; Path frames you and the pin
  const foc = m === 'path' && walk.located ? [(me[0] + pin[0]) / 2, (me[1] + pin[1]) / 2] : me;
  const at = (q) => [bw / 2 + (q[0] - foc[0]) * k, bh / 2 + (q[1] - foc[1]) * k];
  const pan = $('#lwm-pan'); if (pan) pan.setAttribute('transform', `translate(${(MAP_W / 2 - foc[0]).toFixed(1)} ${(MAP_H / 2 - foc[1]).toFixed(1)})`);
  // the walked trail (this leg), 4 px, coloured by mode; Walk's fades yellow to green along the way
  const tr = $('#lwm-trail');
  if (tr) {
    const line = m === 'path' ? ROUTE : TRACK;
    const N = m === 'walk' ? 16 : 1; let out = '';
    if (f > 0.002) {
      for (let i = 0; i < N; i++) {
        const a = (i / N) * f, b = ((i + 1) / N) * f;
        const col = m === 'walk' ? walkColor(b) : LIVE_ACC[m];
        out += `<polyline points="${pts(subLine(line, a, b))}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
      }
    }
    tr.innerHTML = out;
  }
  // Path: the route from you to the pin (6 px, plain blue, no outline)
  const rt = $('#lwm-route');
  if (rt) {
    rt.setAttribute('points', m === 'path' && walk.located && f < 0.999 ? pts(subLine(ROUTE, f, 1)) : '');
  }
  const [mx, my] = at(me);
  const dot = $('#lwm-dot'); if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  const r0 = bw / 2.3;   // the ring starts at the step goal, framed at 1.15× across the screen's width
  const ring = $('#lwm-ring');
  if (ring) { const r = Math.max(1, r0 * (1 - f)); Object.assign(ring.style, { left: mx + 'px', top: my + 'px', width: 2 * r + 'px', height: 2 * r + 'px', borderColor: walkColor(f) }); ring.hidden = walk.done; }
  const hunt = $('#lwm-hunt');
  if (hunt) {
    Object.assign(hunt.style, { left: mx + 'px', top: my + 'px', width: 2 * r0 + 'px', height: 2 * r0 + 'px' });
    const hs = $('#lwm-hring'), sw = $('#lwm-sweep'), d = (2 * r0).toFixed(1), r = r0.toFixed(1);
    [hs, sw].forEach((el) => { el.setAttribute('width', d); el.setAttribute('height', d); el.setAttribute('viewBox', `0 0 ${d} ${d}`); });
    const c = hs.querySelector('circle'); c.setAttribute('cx', r); c.setAttribute('cy', r); c.setAttribute('r', (r0 - 1).toFixed(1));
    const g = sw.querySelector('radialGradient'); g.setAttribute('cx', r); g.setAttribute('cy', r); g.setAttribute('r', r);
    const S2 = Math.SQRT1_2;
    sw.querySelector('path').setAttribute('d', `M${r} ${r} L${d} ${r} A${r} ${r} 0 0 0 ${(r0 + r0 * S2).toFixed(1)} ${(r0 - r0 * S2).toFixed(1)} Z`);
  }
  // no pin (or route) until a place to walk to is found
  const pe = $('#lwm-pin'); if (pe) { const [px, py] = at(pin); pe.style.left = px + 'px'; pe.style.top = py + 'px'; pe.hidden = !walk.located; }
  // the card's count and bar
  if (!walk.done && (m === 'walk' || (m === 'path' && walk.located))) {
    const n = $('#lwm-n'); if (n) n.textContent = String(Math.round(goal * f));
    const fill = $('#lwm-fill'); if (fill) { fill.hidden = f <= 0; fill.style.width = (f * 100).toFixed(1) + '%'; fill.style.background = m === 'walk' ? walkColor(f) : LIVE_ACC.path; }
  }
}
// the part of a polyline between fractions a and b of its length
function subLine(line, a, b) {
  const seg = line.slice(1).map((q, i) => Math.hypot(q[0] - line[i][0], q[1] - line[i][1]));
  const tot = seg.reduce((t, x) => t + x, 0) || 1;
  const out = [along(line, a)]; let acc = 0;
  for (let i = 1; i < line.length; i++) { acc += seg[i - 1]; const fr = acc / tot; if (fr > a && fr < b) out.push(line[i]); }
  out.push(along(line, b));
  return out;
}

// Arrived: the card's status says the chapter is unlocked in the mode's colour, the switch stops working,
// the hint keeps its space but hides, Continue replaces Skip, and rays burst from the middle of the map.
function liveArrive() {
  const root = $('#lwm'); if (!root || !liveLook()) return;
  root.classList.add('arrived');
  const m = F.mode;
  const st = $('#lwm-status'); if (st) st.innerHTML = `<p class="lwm-done" style="color:${LIVE_ACC[m]}">${esc(LIVEMAP.unlocked)}</p>`;
  const ft = $('#lwm-footer'); if (ft) ft.innerHTML = liveFooter(m);
  root.querySelectorAll('.lwm-seg').forEach((b) => { b.disabled = true; });
  const ring = $('#lwm-ring'); if (ring) ring.hidden = true;
  const hunt = $('#lwm-hunt'); if (hunt) hunt.hidden = true;
  root.querySelectorAll('.lwm-vf').forEach((v) => { v.hidden = true; });
  const map = $('#lwm-map');
  if (map) map.insertAdjacentHTML('beforeend', `<div class="lwm-burst" aria-hidden="true" style="--c:${m === 'path' ? LIVE_ACC.path : LIVE_ACC.walk}">${Array.from({ length: 10 }, (_, i) => `<i style="--r:${i * 36}deg"></i>`).join('')}</div>`);
}

// ================================================================== TREADMILL
const tm ={ speed: 4, f: 0, paused: false, sec: 0 };
reg('treadmill', {
  jewel: () => '#F5B82E', cls: () => 'treadscr',
  html() {
    const s = byId[F.id], goal = goalFor();
    return `<header class="slim">${backBtn()}<div><b>${esc(s.title)}</b><span>${esc(TREAD.k)} · ${esc(chHead(F.ch))}</span></div></header>
      <div class="yes">${ic('check')} <b>${esc(TREAD.yes)}</b> <span>Every step counts the same as outside.</span></div>
      <div class="mapbox haze" id="tmap">${treadMap(O.treadMap, tm.f)}<span class="haze-tag">${esc(TREAD.haze)} · ${esc(O.treadMap === 'story' && s.cat === 'anywhere' ? 'Walking the story’s streets, laid over your city' : TREAD.map[O.treadMap])}</span></div>
      <div class="tread-read"><div><b class="big-n" id="tsteps">${n0(Math.round(goal * tm.f))}</b><span>${esc(`of ${n0(goal)} ${TREAD.steps}`)}</span></div><div><b class="big-n" id="ttime">0:00</b><span id="tleft">${esc(TREAD.left(treadMinutes(Math.round(goal * (1 - tm.f)), tm.speed)))}</span></div></div>
      <div class="chase" id="chase" hidden><p class="kicker">${esc(TREAD.chase.k)}</p><p>${esc(s.id === 'squeaky' ? TREAD.chase.t : 'Two-minute push. Something is gaining on you.')} Faster steps bring the chapter sooner.</p>${idea('Pad Pace chase scene (#12)')}</div>
      <p class="lbl">${esc(TREAD.speed)}</p><div class="seg" role="radiogroup">${TREAD.speeds.map((x) => `<button role="radio" aria-checked="${tm.speed === x.id}" class="${tm.speed === x.id ? 'on' : ''}" data-act="tspeed" data-v="${x.id}">${esc(x.t)}</button>`).join('')}</div>
      <p class="hint">Change it any time. Minutes left follow your belt.</p>
      <p class="hint">${esc(MAP.padFog)}</p>
      <div class="btns"><button class="btn ghost" data-act="tpause" id="tpause">${esc(tm.paused ? TREAD.resume : TREAD.pause)}</button><button class="btn primary" data-act="tdone" id="tdone" ${tm.f >= 1 ? '' : 'hidden'}>${esc(TREAD.done)}</button></div>
      <p class="solves">mockup: time runs about 20× fast so you can see a chapter unlock.</p>
      ${src(`Treadmill is the top dev priority — Anna, Oct 16; belt speed + pause/resume — Victoria, Nov 2; map: ${O.treadMap} (Q5); minutes at belt speed (A6)`)}${solves('p1', 'p8')}`;
  },
  mount() {
    tm.f = 0; tm.sec = 0; tm.paused = false;
    const goal = goalFor();
    every(() => {
      if (tm.paused || tm.f >= 1) return;
      tm.sec += 7; tm.f = Math.min(1, tm.f + 7 / 60 / Math.max(0.3, treadMinutes(goal, tm.speed)));
      const a = $('#tsteps'); if (a) a.textContent = n0(Math.round(goal * tm.f));
      const t = $('#ttime'); if (t) t.textContent = `${Math.floor(tm.sec / 60)}:${String(tm.sec % 60).padStart(2, '0')}`;
      const l = $('#tleft'); if (l) l.textContent = tm.f >= 1 ? TREAD.yesSub : TREAD.left(treadMinutes(Math.round(goal * (1 - tm.f)), tm.speed));
      const mp = $('#tmap'); if (mp) mp.firstElementChild.outerHTML = treadMap(O.treadMap, tm.f);
      const ch = $('#chase'); if (ch) ch.hidden = !(tm.f > 0.45 && tm.f < 0.75);
      if (tm.f >= 1) { const d = $('#tdone'); if (d) d.hidden = false; }
    }, 330);
  },
});
export const tread = tm;

// ================================================================== SOFA / AT HOME
let room = 0;
reg('sofa', {
  jewel: () => '#C49BFF',
  html() {
    const s = byId[F.id], goal = Math.min(30, goalFor());
    const home = O.homeOpt === 'one';
    const carry = F.carryHome;
    const C = 2 * Math.PI * 66;
    return `<header class="slim">${backBtn()}<div><b>${esc(s.title)}</b><span>${esc(SOFA.k)} · ${esc(chHead(F.ch))}</span></div></header>
      <h1 class="display">${esc(SOFA.title)}</h1>
      ${carry ? `<p class="sub">${esc(SOFA.carry(n0(carry[0]), n0(carry[1])))}</p>` : ''}
      <div class="frame window"><p class="kicker">Window walk</p><p class="big">${esc(isDark() ? SOFA.dark : SOFA.window)}</p><button class="btn jewel small" data-act="sofaDone">${esc(SOFA.found)}</button></div>
      ${idea('Window Walk (#42)')}
      <p class="kicker section">${esc(S.pushes ? SOFA.room : SOFA.orSteps)}</p>
      <div class="roomring"><svg viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="66" fill="none" stroke="#2A1658" stroke-width="10"/><circle id="roomarc" cx="75" cy="75" r="66" fill="none" stroke="#00CD9D" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - room / goal)).toFixed(1)}"/></svg><span id="roomn">${room}</span><small>/ ${goal}</small></div>
      <p class="hint centre">${esc(S.pushes ? 'Steps or pushes round the room count too.' : SOFA.roomLine(goal))}</p>
      ${home ? `<div class="btns"><button class="btn ghost" data-act="toTread">${esc(START.ways.tread.name)}</button></div>` : ''}
      <p class="hint centre">${esc(SOFA.noStepsLine)}</p>
      <div class="btns"><button class="btn ghost" data-act="sofaDone">${esc(SOFA.noSteps)}</button><button class="btn ghost" data-go="doorstep">${esc(SOFA.doorstep)}</button></div>
      <p class="hint">${esc(SOFA.doorstepLine)}</p>
      ${src('At home is a first-class choice — Oct 30 draft; nobody watches the player’s home (brief)')}${solves('p1')}`;
  },
  mount() {
    room = 0; const goal = Math.min(30, goalFor()); const C = 2 * Math.PI * 66;
    every(() => { if (room >= goal) return; room++; const n = $('#roomn'); if (n) n.textContent = room; const a = $('#roomarc'); if (a) a.setAttribute('stroke-dashoffset', (C * (1 - room / goal)).toFixed(1)); if (room >= goal) toast(WALKMAP.unlocked); }, 260);
  },
});

// ================================================================== HUNT CAMERA
let snapped = false, noCam = false;
reg('camera', {
  jewel: () => '#B36BFF', cls: () => 'camscr',
  html() {
    const ch = chapterInfo();
    return `<header class="slim">${backBtn()}<div><b>${esc(CAMERA.k)}</b><span>${esc(WALKMAP.objective.hunt(ch.thing))}</span></div></header>
      <div class="viewfinder ${snapped ? 'snapped' : ''}"><i class="vf tl"></i><i class="vf tr"></i><i class="vf bl"></i><i class="vf br"></i>${snapped ? `<div class="shot"><span>${esc(ch.thing)}</span></div>` : `<p class="vf-hint">${esc(CAMERA.hint)}</p>`}</div>
      ${noCam ? `<label class="lbl" for="camdesc">${esc(CAMERA.noCamLine)}</label><input class="field" id="camdesc" placeholder="${esc(CAMERA.descPh)}">` : ''}
      <div class="cam">${snapped || noCam ? `<div class="row2 wide"><button class="btn ghost" data-act="retake">${esc(CAMERA.retake)}</button><button class="btn jewel" data-act="sendIt">${esc(CAMERA.sendIt)}</button></div>` : `<button class="shutter" data-act="snap" aria-label="${esc(WALKMAP.takePhoto)}"></button>`}</div>
      <div class="row2"><button class="link" data-act="noCam">${esc(CAMERA.noCam)}</button><button class="link" data-act="sendIt">${esc(CAMERA.skipThis)}</button></div>
      ${src('Hunt: photo required, “Send It” / “Retake” — Hunt mode UX doc; no-camera fallback (chaos audit X3); faces out (A10)')}`;
  },
});
export const cam = { snap() { snapped = true; }, retake() { snapped = false; noCam = false; }, noCam() { noCam = true; }, reset() { snapped = false; noCam = false; } };
regSheet('saveGemQ', () => ({
  jewel: '#B36BFF', label: CAMERA.saveGem,
  html: `<p class="kicker">${esc(WALKMAP.unlocked)}</p><h3>${esc(CAMERA.saveGem)}</h3><p class="more">${esc(CAMERA.saveGemSub)}</p><div class="btns"><button class="btn primary" data-go="gemsave" data-p='{"after":"chapter","photo":1}'>${esc(GEMS.save)}</button><button class="link" data-act="openChapter">${esc(CAMERA.noThanks)}</button></div>${src('Every Hunt photo offers “save as gem” (dismissable) — Melissa, Oct 1')}`,
}));

// ================================================================== CHAPTER READER
reg('chapter', {
  jewel: () => (byId[F.id] || {}).accent, cls: () => 'reader',
  html() {
    const s = byId[F.id];
    let lines, choices;
    const indoor = ['tread', 'sofa', 'home'].includes(F.way);
    if (s.id === 'squeaky' && SQUEAKY.chapters[F.ch]) {
      const ch = SQUEAKY.chapters[F.ch];
      lines = ch.lines.filter((l) => l.who !== 'rain' || S.weather === 'rain').map((l) => (l.who === 'rain' && indoor ? { ...l, t: 'Hear that rain? Good night to be indoors. I’ll keep the corner warm.' } : l));
      choices = ch.choices;
    } else if (F.ch === 1) {
      lines = s.cold.map((t, i) => (i % 2 ? { who: 'char', name: s.char, t } : { who: 'narr', t }));
      if (s.id === 'summons') lines = s.cold.map((t) => ({ who: 'narr', t })).concat([{ who: 'char', name: 'Wren', t: 'Take it to the closest mailbox. Then we’ll talk.' }]);
      choices = [s.episodes ? 'Walk to Episode 2' : 'Walk to Chapter 2'];
    } else {
      lines = [{ who: 'status', t: `CHAPTER ${F.ch}` }, { who: 'narr', t: `You reach ${chapterInfo().place}. ${s.title} picks up where it left off.` }, { who: 'char', name: s.char, t: 'You came back. Good. There’s more.' }];
      choices = ['Keep Going'];
    }
    const rainLine = S.weather === 'rain' && s.id !== 'squeaky' ? [{ who: 'rain', name: s.char || 'Narrator', t: indoor ? 'Hear that rain? A good night to be indoors with a story.' : 'The rain makes everything louder. Good. Nobody will hear you coming.' }] : [];
    return `<header class="slim">${backBtn()}<div><b>${esc(s.title)}</b><span>${esc(chHead(F.ch))}</span></div><button class="ibtn" data-act="eyesUp" aria-label="Read it to me">${ic('ear')}</button></header>
      <div class="chat">${lines.concat(rainLine).map((l, i) => bubble(l, i)).join('')}</div>
      <div class="spacer"></div>
      ${choices.length > 1 ? `<p class="pick">${esc(READER.pick)}</p>` : ''}
      <div class="replies">${choices.map((c, i) => `<button class="reply" data-act="choice" data-i="${i}">${esc(c)}</button>`).join('')}</div>
      ${s.id !== 'squeaky' && F.ch > 1 ? `<p class="solves">mockup: this story’s chapter text plays here.</p>` : ''}
      ${S.weather === 'rain' ? idea('Rain Edition bubble (#5)') : ''}
      ${src('Chat bubbles: narration centred, characters left, replies right with “Pick one” — Oct 7–8; system font for story chat')}`;
  },
});

// ================================================================== CHAPTER BREAK
reg('break', {
  jewel: () => (byId[F.id] || {}).accent,
  html() {
    const s = byId[F.id];
    const of = chOf(s);
    const done = F.ch;
    const nextCh = done + 1;
    const nextTitle = chapterTitle(s.id, nextCh);
    const steps = goalFor();   // the same length the player picked on Start (trail slider or dial)
    const indoor = ['tread', 'sofa', 'home'].includes(F.way);
    const showFavour = s.id === 'squeaky' && !S.favour && !S.favourSeen[s.id + done] && done === 3;
    const hook = s.id === 'squeaky' && SQUEAKY.chapters[nextCh] ? SQUEAKY.chapters[done].lines[SQUEAKY.chapters[done].lines.length - 1].t : s.hook;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(s.title)}</span></div>
      <p class="kicker">${esc(BREAK.k(done, of))}</p><h1 class="display">${esc(F.way === 'sofa' || F.way === 'home' ? BREAK.titleRead : F.way === 'tread' ? BREAK.title : BREAK.titleWalk)}</h1>
      <div class="dots">${Array.from({ length: of }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('')}</div>
      <section class="nextbox"><p class="kicker">${esc(BREAK.nextK)}</p><p class="big">${esc(BREAK.next(nextTitle, indoor ? (F.way === 'tread' ? `about ${treadMinutes(steps, 4)} min on the pad` : 'a window walk') : walkTxt(steps)))}</p>
        <p class="hint"><b>${esc(BREAK.hookK)}:</b> ${esc(hook)}</p>
        ${O.length === 'dial' && !indoor ? `<div class="row2"><button class="btn ghost small" data-act="len" data-v="short" data-rr="1">${esc(BREAK.shorter)}</button><button class="btn ghost small" data-act="len" data-v="long" data-rr="1">${esc(BREAK.longer)}</button></div>` : ''}${solves('p2')}</section>
      ${showFavour ? `<section class="favour" style="--jewel:#5B8CFF"><p class="kicker">${esc(BREAK.favourK)}</p><p class="big">${esc(BREAK.favour)}</p><p class="hint">${esc(BREAK.favourSub)}</p><button class="btn ghost small" data-act="favour">${esc(BREAK.favourGo)}</button>${idea('Favours from a character (#8)')}</section>` : ''}
      <div class="btns"><button class="btn primary" data-act="breakKeep">${esc(BREAK.keep)}</button><button class="btn ghost" data-act="stopHere">${esc(BREAK.stop)}</button><button class="link" data-go="gemsave" data-p='{"after":"break"}'>${esc(BREAK.gemGo)}</button></div>
      <p class="hint">${esc(BREAK.stopLine(nextCh))}</p>${idea('Bookmark Beats: stop at a cliffhanger (#8 in B)')}`;
  },
});

// ================================================================== ENDING, POSTCARD, LOCK IT IN
reg('ending', {
  jewel: () => (byId[F.id] || {}).accent, cls: () => 'victory',
  html() {
    const s = byId[F.id];
    const e = s.id === 'squeaky' ? SQUEAKY.chapters[5].ending : s.id === 'summons' ? { name: 'Welcome to the Society', n: 1, of: 3 } : { name: `Ending 1 of ${s.endings}`, n: 1, of: s.endings };
    const stats = O.storyEnd === 'stats';
    return `<div class="bar">${backBtn()}</div><div class="stairs" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
      <div class="vic-text"><p class="kicker">${esc(ENDING.k)} · ${esc(VICTORY.endings(e.n, e.of))}</p><h1 class="display">${esc(e.name)}</h1><p class="sub">${esc(s.title)}</p></div>
      ${stats && !S.storyOnly ? `<div class="stats">${ENDING.stats(distTxt(s.steps).replace(/ (km|mi)$/, ''), n0(s.steps), '1').map((x) => `<div><b>${esc(x.n)}</b><span>${esc(x.l)}</span></div>`).join('')}</div><div class="badge-c on big">${esc(ENDING.badge)}: ${esc(s.title.split(' ').pop().replace('?', ''))}</div>` : ''}
      <div class="spacer"></div>
      <div class="btns"><button class="btn primary" data-act="endStory">${esc(ENDING.end)}</button><button class="link" data-act="findAnother" data-id="${s.id}">${esc(ENDING.find)}</button></div>
      ${src(`End of a full story: ${O.storyEnd} (Q13); “End Story” — Oct 28; “1 of N endings” — Emily, Oct 2`)}${solves('p10')}`;
  },
});
regSheet('postcardQ', () => ({
  jewel: '#F5B82E', label: ENDING.postcardQ,
  html: `<p class="kicker">${esc(POSTCARD.k)}</p><h3>${esc(ENDING.postcardQ)}</h3><p class="more">${esc(ENDING.postcardQSub)}</p><div class="btns"><button class="btn primary" data-go="postcard" data-p='{"id":"${F.id}","next":1}'>${esc(ENDING.makeCard)}</button><button class="link" data-act="toRecs">${esc(ENDING.skipCard)}</button></div>`,
}));
reg('postcard', {
  jewel: () => '#F5B82E',
  html(p) {
    const s = byId[p.id || F.id] || byId.squeaky;
    const where = S.loc === 'far' ? S.city : S.city === 'Camrose' ? 'Near Camrose' : S.city;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(POSTCARD.k)}</span></div>
      <div class="postcard"><div class="pc-art" style="--jewel:${s.accent}">${postcardRoute()}</div><div class="foot"><div><div class="title">${esc(s.title)}</div><div class="where">${esc(`${where} · ${S.date}`)}</div><div class="msg">${esc(POSTCARD.greeting)}</div><div class="tag-line">#outonawhim</div></div><div class="stamp"><i>${sparkle(22, s.accent)}</i>${esc(POSTCARD.stamp)}</div></div></div>
      <p class="hint centre">${esc(blurShared() ? POSTCARD.trimmed : POSTCARD.full)}</p>
      <div class="btns"><button class="btn primary" data-act="sharePc">${esc(POSTCARD.share)}</button><button class="btn ghost" data-act="savePc" data-next="${p.next ? 1 : ''}">${esc(POSTCARD.save)}</button><button class="link" data-act="${p.next ? 'toRecs' : 'pcDone'}">Done</button></div>
      ${src('Shareable, spoiler-free postcard — Melissa, Nov 3; walk-postcard mockup (Walk citrine→emerald); city, date, Done (B24, C17)')}${idea('Start/end trimmed for privacy (#2.10)')}`;
  },
});
reg('lockin', {
  jewel: () => '#C49BFF',
  html() {
    const L = LOCKIN, t = S.rem.time || 'lunch';
    const nextS = byId[S.upNext[0] || 'knight'];
    const tm = (L.times.find((x) => x.id === t) || L.times[1]).s;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(L.k)}</span></div>
      <h1 class="display">${esc(L.title)}</h1><p class="sub">${esc(L.sub)}</p>
      <div class="choices">${L.times.map((x) => `<button class="choice ${x.id === t ? 'sel' : ''}" aria-pressed="${x.id === t}" data-act="pickTime" data-v="${x.id}"><b>${esc(x.t)}</b><span>${esc(x.s)}</span></button>`).join('')}</div>
      <p class="lbl">${esc(L.daysLabel)}</p><div class="chips days">${L.days.map((d, i) => chip(d, S.rem.days[i], `data-act="day" data-i="${i}" aria-label="${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i]}"`)).join('')}</div>
      <p class="lbl">${esc(L.preview)}</p><div class="notif"><div class="nf-top"><span class="nf-app">STORY CITY</span><time>${esc(tm)}</time></div><b>${esc(nextS.char || 'Story City')} · <i>${esc(nextS.title)}</i></b><p>${esc(nextS.id === 'knight' ? 'The dragon is napping. Now is our chance, squire. Bring a cat if you have one.' : nextS.hook)}</p></div>
      <div class="btns"><button class="btn primary" data-act="lockIn">${esc(L.go)}</button><button class="link" data-go="today" data-root="1">${esc(L.later)}</button></div>
      ${src('“When’s your next walk?” returns naming the recommended story — Oct 16/28; ask for notifications at the end, with a reason — Oct 21')}${idea('Pick My Walk Time (#5)')}${solves('p12')}`;
  },
});
regSheet('notifAsk', () => ({
  jewel: '#C49BFF', label: LOCKIN.askK,
  html: `<p class="kicker">${esc(LOCKIN.askK)}</p><h3>${esc(LOCKIN.ask)}</h3><p class="more">${esc(LOCKIN.askSub)}</p><div class="btns"><button class="btn primary" data-act="notifYes">${esc(LOCKIN.allow)}</button><button class="link" data-act="notifNo">${esc(TRIAL.notNow)}</button></div>`,
}));

// ================================================================== COMEBACK
reg('comeback', {
  jewel: () => byId[curStory() || 'frightnight'].accent,
  html() {
    const C = COMEBACK;
    const id = curStory() || 'frightnight';
    const s = byId[id];
    const pr = S.progress[id] || { ch: 3, of: chOf(s) };
    const pv = PREVIOUSLY[id] || { lines: s.cold.map((t) => ({ who: 'narr', t })), place: chapterTitle(id, pr.ch) };
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(C.k)}</span></div>
      <h1 class="display">${esc(C.title)}</h1>
      ${sinceCard()}
      <p class="kicker section">${esc(C.prevK)} · ${esc(s.title)}</p>
      <div class="chat">${pv.lines.map((l, i) => bubble(l, i)).join('')}</div>
      <p class="meta">Chapter ${pr.ch} of ${pr.of} · ${esc(pv.place || chapterTitle(id, pr.ch))}</p>
      ${homeOff() ? `<div class="btns"><button class="btn primary" data-act="comeWalk">${esc(C.walkIt)}</button><button class="btn ghost small" data-go="mission">${esc(C.mission)}</button></div>`
        : `<div class="btns"><button class="btn primary" data-act="comeSofa">${esc(C.finishSofa)}</button><div class="row2"><button class="btn ghost small" data-act="comeWalk">${esc(C.walkIt)}</button><button class="btn ghost small" data-go="mission">${esc(C.mission)}</button></div></div>`}
      <p class="hint">${ic('check')} ${esc(C.nothingLost)}</p>${src('What happened while you were away sits on top: “Since you were here” — loops brief Gems #1 (Tasha after 21 days)')}
      ${S.rem.paused || S.away >= 7 ? `<div class="guestbar"><p>${esc(C.reminders)}</p><button class="btn ghost small" data-go="reminders">${esc(C.remindersGo)}</button></div>` : ''}
      ${['trial', 'member'].includes(S.member) ? `<p class="hint">${esc(C.sub('Nov 18'))} ${esc(priceTxt())}.</p>` : ''}
      ${idea('Previously On… (#6, #39)')}${src('Built from the player’s real last story (C7); no streak guilt, no discount first (research 2.12)')}${solves('p10')}`;
  },
});

// ================================================================== PLAY TOGETHER
const pt = { n: '2', phones: 'one' };
regSheet('together', (p) => {
  const s = byId[p.id] || byId.dynasty;
  const T = TOGETHER;
  return {
    jewel: s.accent, label: T.k, cls: 'tall',
    html: `<p class="kicker">${esc(T.k)}</p><h3>${esc(s.title)}</h3>
      <p class="lbl">${esc(T.how)}</p><div class="seg" role="radiogroup">${(s.id === 'dynasty' ? T.counts : ['2', '3', '4', '5', '6', '8']).map((c) => `<button role="radio" aria-checked="${pt.n === c}" class="${pt.n === c ? 'on' : ''}" data-act="ptN" data-v="${c}" data-id="${s.id}">${esc(c)}</button>`).join('')}</div>
      ${s.id === 'dynasty' ? `<p class="lbl">${esc(T.families)}</p><div class="row2">${T.fam.map((f) => `<button class="btn ghost small" data-act="toast" data-t="${esc(f)} it is.">${esc(f)}</button>`).join('')}</div>` : ''}
      <p class="lbl">${esc(T.phones)}</p><div class="choices"><button class="choice ${pt.phones === 'one' ? 'sel' : ''}" data-act="ptPhones" data-v="one" data-id="${s.id}"><b>${esc(T.one)}</b><span>${esc(T.oneLine)}</span></button><button class="choice ${pt.phones === 'each' ? 'sel' : ''}" data-act="ptPhones" data-v="each" data-id="${s.id}"><b>${esc(T.each)}</b><span>${esc(T.eachLine)}</span></button></div>
      ${pt.phones === 'one' ? `<p class="lbl">${esc(T.rolesLabel)}</p><div class="tags">${T.roles.map((r) => `<span class="tag">${esc(r)}</span>`).join('')}</div>` : `<p class="lbl">${esc(T.code)}</p><p class="code">QZ7K</p><p class="hint">${ic('lock')} ${esc(T.expires)}</p><button class="btn ghost small" data-act="toast" data-t="Share sheet opens with the code.">${esc(T.share)}</button>`}
      ${familyLine() ? `<p class="hint">${esc(T.covers)}</p>` : ''}${src(T.coversNote)}
      <div class="btns"><button class="btn primary" data-act="ptStart" data-id="${s.id}">${esc(T.go)}</button></div>
      ${src('Play Together — play-together mockup; Dynasty Duel plays as 1, 2 or 4 (API); expiring codes + approval (B6, B9)')}${src('Up to 8 phones on other stories — groups retest (Ines’s game night is 5); Dynasty Duel keeps its API limit')}${solves('p11')}`,
  };
});
export const together = pt;

reg('lobby', {
  jewel: (p) => byId[p.id].accent,
  html(p) {
    const s = byId[p.id]; const T = TOGETHER;
    const me = hasName() ? S.name : 'You';
    // the friend who wants in is a real one (the newest you added); no friends, no made-up joiner (loops Friends #2)
    // the newest friend you added; while that friend is still pending, no stand-in joins (pass 2: groups)
    const added = (S.added || []).filter((f) => S.friends.includes(f));
    const pend = S.pending[S.pending.length - 1];
    const joiner = added.length ? added[added.length - 1] : pend ? null : S.friends.length ? S.friends[S.friends.length - 1] : null;
    const who = joiner ? joiner.replace(/ \w\.$/, '') : '';
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(T.lobbyK)} · ${esc(s.title)}</span></div>
      <h1 class="display">${esc(S.ptLetIn && joiner ? T.joined(who) : T.lobby(Math.max(1, +pt.n - 1)))}</h1>
      <p class="code">QZ7K</p><p class="hint centre">${esc(T.expires)}</p>
      <div class="lobby-row"><span class="pav me">${esc(me[0])}</span><b>${esc(me)} (host)</b></div>
      ${!joiner && pend ? `<div class="empty-note invite"><p>${esc(`${pend}: request sent. ${pend} can join once ${pronoun(pend)} ${pronoun(pend) === 'they' ? 'accept' : 'accepts'}.`)}</p><button class="btn ghost small" data-sheet="friend">${esc('Add Them Now')}</button></div>`
        : !joiner ? `<div class="empty-note invite"><p>${esc(LOOPS.inviteLobby)}</p><button class="btn ghost small" data-sheet="friend">${esc('Share My Code')}</button></div>`
        : S.ptLetIn ? `<div class="lobby-row"><span class="pav">${esc(joiner[0])}</span><b>${esc(joiner)}</b><span class="hint">${ic('check')} In</span></div>` : `<div class="lobby-row"><span class="pav">${esc(joiner[0])}</span><b>${esc(T.wants(who))}</b><button class="btn jewel small" data-act="letIn">${esc(T.letIn)}</button></div>`}
      <p class="hint">${ic('lock')} ${esc(T.friendsOnly)}</p>
      <div class="btns"><button class="btn primary" data-act="startStory" data-id="${s.id}" ${S.ptLetIn && joiner ? '' : 'disabled'}>${esc(T.begin)}</button></div>
      ${src('Start Together leads somewhere: a lobby with host approval (B9)')}${src('Host initial from your name; the joiner is a friend you added; no friends shows an invite — loops brief Friends #2')}`;
  },
});
