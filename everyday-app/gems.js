// Gems, the whole flow (Nov 4; brief: reports/gems/research.md).
// Create: + Gem → Snap It / Just Save It → details → who can see it → Save Gem to My Map → GEM CREATED.
// After: the map card, the gem page (yours or someone else's), cheers / reactions / comments / votes,
// reporting, rarity. Every open question is a Team Option in core.js (gemWho, gemPublic, gemSocial,
// gemRarity, gemFade, gemQuick).
import {
  S, O, reg, regSheet, go, back, toast, openSheet, closeSheet, rerender, esc, ic, src, idea, solves,
  gemSvg, GEM_TYPES, gemCol, gemVisOf, gemTier, TIER_COL, backBtn, sparkle, $, current, popTo, popWhile, blurShared,
  later, countWalk, pressSeal, tierNext, pronoun, atHome, logAct, firstName,
} from './core.js';
import { GEMS, LOOPS, GEMTAB } from './words.js';
import { chip, toggle } from './ui.js';
import { gemSpotMap, HOME } from './maps.js';
import { mapUI, youUI } from './screens-tabs.js';

// ---------------------------------------------------------------- the form being filled in
// Where you're standing. The mockup's "you" dot sits at home, so a walk spot is the default and
// the dashed mockup tray switches it (home bubble and schoolyard checks).
const SPOTS = { walk: { x: 168, y: 196 }, home: { x: 236, y: 274 }, school: { x: 128, y: 118 } };
const HIDDEN_VIBES = ['Hidden', 'Secret-feeling'];
const gs = {};
export function resetGemForm() {
  // honest save: nothing preselected (loops build 10; 9 pairs hit the preselected Odd vibe)
  Object.assign(gs, { type: null, vibes: [], vis: 'me', name: '', note: '', photo: false, season: false, spot: 'walk', ...SPOTS.walk, friend: S.friends[0] || '', edit: null, allVibes: false });
}
resetGemForm();
export const gemForm = gs;
const inBubble = () => Math.hypot(gs.x - HOME.x, gs.y - HOME.y) < 64;
export const gemAtHome = (g) => !!g && Math.hypot(g.x - HOME.x, g.y - HOME.y) < 64;
const typeName = (t) => (GEMS.types[t || 'curio'] || GEMS.types.curio).name;   // no type picked saves as a Curiosity
// an unnamed gem is named by type and street, never the example text (loops must-fix 9)
export const defaultGemName = (t) => LOOPS.defaultName(LOOPS.typeWord[t || 'curio'], LOOPS.streets[S.loc === 'far' ? 'Edmonton' : S.city] || LOOPS.streets.Edmonton);
const friendsLine = () => (O.friendsMeans === 'fof' ? LOOPS.whoFriendsTheirs : GEMS.who.friends.s);
const gemById = (id) => S.gems.find((g) => g.id === id);
const isGemScreen = (id) => ['gem-snap', 'gemsave', 'gem-who', 'gem-made'].includes(id);
const VIS_IC = { me: 'lock', friend1: 'you', friends: 'people', all: 'map' };
// where you're standing for Just Save It: right after a walk you're out, not home (pass 2: Jordan)
const standing = () => S.qgSpot || (S.outNow ? 'walk' : atHome() ? 'home' : 'walk');

function whoList() { return { two: ['me', 'all'], four: ['me', 'friend1', 'friends', 'all'] }[O.gemWho] || ['me', 'friends', 'all']; }
// why a choice isn't allowed here, or null
function blockOf(v) {
  if (v === 'me') return null;
  // public gems are never at a home, whatever the home setting (safety rule); friends follow the setting
  if (inBubble() && (v === 'all' || blurShared())) return v === 'all' && !blurShared() ? GEMS.blocks.homePublic : GEMS.blocks.home;
  if (v === 'all' && S.teen && O.gemPublic !== 'anyone') return GEMS.blocks.teen;
  if (v === 'all' && gs.spot === 'school') return GEMS.blocks.school;
  if (v === 'friend1' && !S.friends.length) return LOOPS.inviteShare;
  return null;
}
function fixVis() { if (!whoList().includes(gs.vis) || blockOf(gs.vis)) gs.vis = 'me'; if (gs.vis !== 'me') gs.vibes = gs.vibes.filter((v) => !HIDDEN_VIBES.includes(v)); }
// one friends rule, same words everywhere (loops Friends #5; Team Option friendsMeans)
const whoShort = (v, g) => (g && !g.mine && v !== 'all' ? LOOPS.theirsFriends[O.friendsMeans](g.by.replace(/ \w\.$/, ''), pronoun(g.by, true)) : v === 'friend1' ? GEMS.whoShort.friend1((g && g.friendName) || gs.friend) : v === 'friends' && O.friendsMeans === 'fof' ? 'You, your friends and their friends' : GEMS.whoShort[v]);
const hereLine = () => `<p class="gm-here">${ic('pin')} <span>${esc(GEMS.here)}</span> <button class="link pretend" data-sheet="gemNudge">${esc(GEMS.nudge)}</button></p>`;
const stepper = (n) => `<span class="count">${n} of 2</span>`;

// ================================================================== + GEM (the tab-bar button)
regSheet('quickGem', () => ({
  jewel: '#B36BFF', label: GEMS.start.k,
  html: `<p class="kicker">${gemSvg('curio', 16)} ${esc(GEMS.start.k)}</p><h3>${esc(GEMS.start.title)}</h3>
    <div class="qg qg3">
      <button class="qg-btn" data-go="gem-snap">${ic('camera')}<b>${esc(GEMS.start.snap)}</b><small>${esc(GEMS.start.snapSub)}</small></button>
      ${O.gemQuick === 'onetap'
        ? `<button class="qg-btn" data-act="quickGem" data-v="spot">${ic('pin')}<b>${esc(GEMS.start.just)}</b><small>${esc(GEMS.start.justOne)}</small></button>`
        : `<button class="qg-btn" data-go="gemsave">${ic('pin')}<b>${esc(GEMS.start.just)}</b><small>${esc(GEMS.start.justSub)}</small></button>`}
      <button class="qg-btn" data-go="gem-upload">${ic('download')}<b>Upload</b><small>A photo from earlier</small></button>
    </div>
    <p class="hint">${ic('lock')} ${esc(O.gemQuick === 'onetap' ? GEMS.start.later : GEMS.start.note)}</p>
    ${O.gemQuick === 'onetap' ? `<div class="mocktray"><span>${esc(LOOPS.spotsK)}</span>${['walk', 'home'].map((k) => `<button data-act="qgSpot" data-v="${k}" aria-pressed="${standing() === k}">${esc(LOOPS.spots[k])}</button>`).join('')}</div>` : ''}
    ${src(O.gemQuick === 'onetap' ? 'One tap saves; details later — Melissa, Nov 4' : '+ Gem tab — Decision Log, Nov 4; Snap → details → who → save — gems brief (d)1–5')}
    ${src('Not auto-placed: making a gem is personal and on purpose — Victoria + Melissa, Jul 17 (decided)')}`,
}));

// ================================================================== FROM MY PHOTOS (Melissa, Nov 5)
// Pick a photo you took earlier; its location pins the gem where you took it. Mock camera roll: no real photos.
const ROLL = [
  { id: 'r1', when: 'Today · 2:14 pm', icon: 'sun', tint: '#00CD9D', x: 168, y: 196, spot: 'walk', type: 'nature', near: '400 m from here', line: 'On your walk today' },
  { id: 'r2', when: 'Today · 2:31 pm', icon: 'spark', tint: '#FF4F79', x: 300, y: 160, spot: 'walk', type: 'art', near: '650 m from here', line: 'On your walk today' },
  { id: 'r3', when: 'Yesterday · 6:05 pm', icon: 'door', tint: '#F5B82E', x: 72, y: 196, spot: 'walk', type: 'shop', near: '900 m from here', line: 'Yesterday' },
  { id: 'r4', when: 'Monday', icon: 'camera', tint: '#5B8CFF', x: null, y: null, spot: 'walk', type: null, near: '', line: 'No location saved' },
  { id: 'r5', when: 'Sunday', icon: 'home', tint: '#C49BFF', x: 236, y: 274, spot: 'home', type: null, near: 'at home', line: 'Taken at home' },
  { id: 'r6', when: 'Oct 30', icon: 'flag', tint: '#35C6D7', x: 128, y: 118, spot: 'school', type: 'landmark', near: '1.1 km from here', line: 'Near a school' },
];
let upPick = null;
reg('gem-upload', {
  jewel: () => '#B36BFF',
  html() {
    const ph = ROLL.find((r) => r.id === upPick);
    const tile = (r) => `<button class="roll ${upPick === r.id ? 'on' : ''}" data-act="upPick" data-v="${r.id}" style="--t:${r.tint}" aria-pressed="${upPick === r.id}">${ic(r.icon)}<small>${esc(r.when)}</small>${r.x === null ? `<em class="noloc">${ic('pin')}</em>` : ''}</button>`;
    let pinBlock = '';
    if (ph) {
      
      const placed = ph.x !== null || S.upPlaced;
      const where = ph.x !== null ? ph : { x: gs.x, y: gs.y };
      pinBlock = `<div class="up-pin">
        <p class="kicker">${ph.x === null ? (placed ? 'Pinned by you' : 'This photo has no location') : 'Pinned where you took it'}</p>
        ${placed ? `<div class="mapbox mini">${gemSpotMap('up', { x: where.x, y: where.y, type: ph.type || 'curio' })}</div>
        <p class="up-where">${ic('pin')} <span>${esc(ph.x === null ? 'Where you said you took it' : `${ph.when} · ${ph.near}`)}</span> <button class="link" data-sheet="gemNudge">Nudge the Pin</button></p>`
        : `<p class="hint">Your phone didn’t save where this was taken. Put the pin on the spot yourself.</p><button class="btn ghost small" data-act="upPlace">${ic('pin')} Drop the Pin Where I Took It</button>`}
        ${ph.spot === 'home' ? `<p class="hint">${ic('lock')} Taken inside your home bubble, so this gem stays just for you.</p>` : ''}
        ${ph.spot === 'school' ? `<p class="hint">${ic('lock')} Near a school: you can keep it or share with friends, not with everyone.</p>` : ''}
        ${placed ? `<div class="btns"><button class="btn primary" data-act="upUse">Use This Photo and Spot</button></div>` : ''}
      </div>`;
    }
    return `<header class="slim">${backBtn()}<div><b>From My Photos</b><span>${esc(GEMS.start.title)}</span></div></header>
      <p class="hint">Pick a photo from your walk. We’ll put the pin where you took it.</p>
      <div class="rollgrid">${ROLL.map(tile).join('')}</div>
      ${pinBlock}
      <p class="hint up-safe">${ic('lock')} Only the spot is used. Your photo’s hidden details, like the time and camera, are removed before anyone else sees it.</p>
      ${src('Upload a photo from earlier; its location sets the pin — Melissa, Nov 5. Mock camera roll (no real photos, no AI images).')}
      ${src('Safety: no location → you place the pin; home bubble → private only; near a school → never public; location data stripped from shared photos')}`;
  },
});

// ================================================================== SNAP
reg('gem-snap', {
  jewel: () => '#B36BFF', cls: () => 'camscr',
  html(p) {
    return `<header class="slim">${backBtn()}<div><b>${esc(p.quick ? GEMTAB.snapK : GEMS.snapK)}</b><span>${esc(GEMS.start.title)}</span></div></header>
      <div class="viewfinder ${gs.photo ? 'snapped' : ''}"><i class="vf tl"></i><i class="vf tr"></i><i class="vf bl"></i><i class="vf br"></i>${gs.photo ? `<div class="shot gm-shot">${gemSvg(gs.type, 46)}<span>${esc(GEMS.polaroidNote)}</span></div>` : `<p class="vf-hint">${esc(GEMS.snapHint)}</p>`}</div>
      ${hereLine()}
      <div class="cam">${gs.photo ? (p.quick && O.snapFlow === 'pile' ? `<div class="row2 wide"><button class="btn ghost" data-act="gemRetake">${esc(GEMTAB.retake)}</button><button class="btn jewel" data-act="gemSend">${esc(GEMTAB.sendIt)}</button></div>` : `<div class="row2 wide"><button class="btn ghost" data-act="gemRetake">${esc(GEMS.retake)}</button><button class="btn jewel" data-act="gemUsePhoto">${esc(GEMS.usePhoto)}</button></div>`) : `<button class="shutter" data-act="gemSnap" aria-label="Take photo"></button>`}</div>
      <div class="centre"><button class="link" data-act="gemNoCam">${esc(GEMS.noCam)}</button></div>
      ${src('Camera prompt: “snap a photo, add a short note” — Victoria gem review, Jul 17 (proposed); no-camera fallback — docs/everyday-app.md')}
      ${idea('nudge the pin onto the exact spot (gems brief (d)2); a gem is a point, not a zone — Oct 13 (decided)')}`;
  },
});
regSheet('gemNudge', () => {
  const home = inBubble();
  return {
    jewel: gemCol(gs.type), label: GEMS.nudgeTitle,
    html: `<p class="kicker">${ic('pin')} ${esc(GEMS.nudgeK)}</p><h3>${esc(GEMS.nudgeTitle)}</h3><p class="more">${esc(GEMS.nudgeSub)}</p>
      <div class="gm-nudge"><div class="mapbox gm-nmap">${gemSpotMap('nm', { ...gs, mine: true, vis: home ? 'me' : gs.vis })}</div>
        <div class="gm-arrows" role="group" aria-label="Move the pin">
          <button class="ibtn up" data-act="gemNudge" data-v="up" aria-label="Move up">${ic('chev')}</button>
          <button class="ibtn left" data-act="gemNudge" data-v="left" aria-label="Move left">${ic('chev')}</button>
          <button class="ibtn right" data-act="gemNudge" data-v="right" aria-label="Move right">${ic('chev')}</button>
          <button class="ibtn down" data-act="gemNudge" data-v="down" aria-label="Move down">${ic('chev')}</button>
        </div></div>
      <p class="safety ${home ? 'warn' : ''}">${ic(home ? 'home' : 'check')} ${esc(home ? (blurShared() ? GEMS.blocks.home : GEMS.blocks.homePublic) : GEMS.checks.bubble)}</p>
      <div class="btns"><button class="btn primary" data-close>${esc(GEMS.nudgeDone)}</button></div>
      ${idea('nudge the pin (gems brief (d)2); home bubble check — research idea #20')}`,
  };
});

// ================================================================== DETAILS
function loadFromGem(id) {
  const g = gemById(id); if (!g) return;
  resetGemForm();
  Object.assign(gs, { type: g.type, vibes: (g.vibes || []).slice(), vis: gemVisOf(g), name: g.name, note: g.note || '', photo: !!g.photo, season: !!g.season, x: g.x, y: g.y, friend: g.friendName || GEMS.friendNames[0], edit: id });
}
reg('gemsave', {
  jewel: () => gemCol(gs.type), cls: () => 'gm-scr',
  html(p) {
    const G = GEMS;
    if (p.edit && gs.edit !== p.edit) loadFromGem(p.edit);
    if (p.photo && !p.edit) gs.photo = true;   // from a Hunt photo
    const all = gs.vis === 'me' ? G.vibes : G.vibes.filter((v) => !HIDDEN_VIBES.includes(v));
    // six vibes first, the rest behind More (pass 2: Sky); anything picked always shows
    const vibes = gs.allVibes ? all : all.filter((v, i) => i < 6 || gs.vibes.includes(v));
    const n = gs.note.length;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(p.edit ? G.edit + ' · ' + gs.name : G.saveKicker)}</span>${p.edit ? '' : stepper(1)}</div>
      <div class="gm-top">
        <div class="polaroid small" style="--jewel:${gemCol(gs.type)}"><div class="ph">${gs.type ? gemSvg(gs.type, 54) : sparkle(40, '#C49BFF')}<span>${esc(gs.photo ? G.polaroidNote : G.noPhoto)}</span></div></div>
        <div class="gm-top-r"><h1 class="display">${esc(G.saveTitle)}</h1>${gs.photo ? '' : `<button class="btn ghost small" data-act="gemTo" data-v="gem-snap">${ic('camera')} ${esc(G.addPhoto)}</button>`}</div>
      </div>
      ${p.edit ? '' : hereLine()}
      <label class="lbl" for="gname">${esc(G.name)} <small>${esc(`Blank: “${defaultGemName(gs.type)}”`)}</small></label><input class="field ph-dim" id="gname" placeholder="${esc(G.namePh)}" value="${esc(gs.name)}" maxlength="40">
      <label class="lbl" for="gnote">${esc(G.noteLabel)} <small id="gcount">${n} / ${G.noteMax}</small></label><textarea class="field gm-note-in ph-dim" id="gnote" rows="3" maxlength="${G.noteMax}" placeholder="${esc(G.notePh)}">${esc(gs.note)}</textarea>
      <p class="lbl">${esc(G.type)} <small>${esc(LOOPS.pickType)}</small></p><div class="gemtypes" role="radiogroup">${GEM_TYPES.map((t) => `<button role="radio" aria-checked="${gs.type === t}" class="gt ${gs.type === t ? 'on' : ''}" data-act="gemType" data-v="${t}" style="--jewel:${gemCol(t)}">${gemSvg(t, 30)}<b>${esc(G.types[t].name)}</b><small>${esc(G.types[t].look)}</small></button>`).join('')}</div>
      <p class="lbl">${esc(G.vibesLabel)} <small>${gs.vibes.length} / 3</small></p><div class="chips wrap">${vibes.map((v) => chip(v, gs.vibes.includes(v), `data-act="vibe" data-v="${esc(v)}"`)).join('')}${gs.allVibes ? '' : `<button class="chip more-chip" data-act="moreVibes">${esc(`More (${all.length - vibes.length})`)}</button>`}</div>
      ${O.gemFade === 'seasonal' ? `<div class="gm-tg">${toggle('gemSeason', gs.season, G.seasonLabel, G.seasonSub)}</div>` : ''}
      <div class="btns">${p.edit ? `<button class="btn primary" data-act="gemEditSave">${esc(G.saveChanges)}</button>` : `<button class="btn primary" data-act="gemTo" data-v="gem-who">${esc(G.next)}</button>`}</div>
      ${src('Name, “What makes this spot special?” + live counter (~180), edit any time — Victoria gem review, Jul 17 (proposed)')}
      ${src('Five types, shape + colour; up to 3 of 18 vibes — Melissa, Oct 14–30')}${src('Nothing preselected; a blank name becomes type + street — loops brief Gems #4')}${O.gemFade === 'seasonal' ? src('Seasonal gems — test walk Sep 22; Whimsy board (Team Option)') : ''}`;
  },
  mount(p) {
    const n = $('#gname'); if (n) n.addEventListener('input', () => { gs.name = n.value; });
    if (p.edit && p.focusName && n) setTimeout(() => { n.focus(); n.select(); }, 60);
    const t = $('#gnote'), c = $('#gcount');
    if (t) t.addEventListener('input', () => { gs.note = t.value; if (c) c.textContent = `${t.value.length} / ${GEMS.noteMax}`; });
    if (p.describe && t) setTimeout(() => t.focus(), 60);
  },
});

// ================================================================== WHO CAN SEE IT
function checks() {
  const C = GEMS.checks, ok = (t) => `<li>${ic('check')}<span>${esc(t)}</span></li>`;
  if (gs.vis === 'me') return '';
  const hadHidden = gs.vibes.some((v) => HIDDEN_VIBES.includes(v)) || true;
  const rows = [];
  if (gs.vis === 'all') rows.push(ok(C.place(GEMS.spotPlace[gs.spot])));
  else rows.push(ok(C.friendsOnly));
  rows.push(ok(C.bubble));
  if (gs.photo) rows.push(ok(C.faces));
  if (hadHidden) rows.push(ok(C.vibes));
  if (gs.vis === 'all' && O.gemPublic === 'reviewed') rows.push(ok(C.review));
  if (gs.vis === 'all' && O.gemPublic === 'claim') rows.push(ok(C.claim));
  rows.push(ok(C.report));
  return `<p class="kicker section">${esc(GEMS.checksK)}</p><ul class="gm-checks">${rows.join('')}</ul>`;
}
reg('gem-who', {
  jewel: () => gemCol(gs.type), cls: () => 'gm-scr',
  html(p) {
    const G = GEMS;
    fixVis();
    const edit = p.edit;
    if (edit && gs.edit !== edit) { loadFromGem(edit); fixVis(); }
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(edit ? G.edit + ' · ' + gs.name : G.saveKicker)}</span>${edit ? '' : stepper(2)}</div>
      <div class="gm-sum" style="--jewel:${gemCol(gs.type)}">${gemSvg(gs.type || 'curio', 34)}<div><b>${esc(gs.name || defaultGemName(gs.type))}</b><small>${esc(typeName(gs.type))}${gs.vibes.length ? ' · ' + esc(gs.vibes.join(', ')) : ''}</small></div></div>
      <h1 class="display">${esc(G.whoTitle)}</h1>
      <div class="ways" role="radiogroup" aria-label="${esc(G.whoTitle)}">${whoList().map((v) => {
        const b = blockOf(v);
        return `<button role="radio" aria-checked="${gs.vis === v}" aria-disabled="${!!b}" class="way gm-way ${gs.vis === v ? 'on' : ''} ${b ? 'off' : ''}" style="--wc:${v === 'all' ? '#00CD9D' : v === 'me' ? '#C49BFF' : '#5B8CFF'}" ${b ? `data-act="tip" data-tip="${esc(b)}"` : `data-act="gemVis" data-v="${v}"`}>${ic(b ? 'lock' : VIS_IC[v])}<b>${esc(G.who[v].t)}</b><small>${esc(b || (v === 'friends' ? friendsLine() : G.who[v].s))}</small></button>`;
      }).join('')}</div>
      ${gs.vis === 'friend1' ? `<p class="lbl">${esc(G.pickFriend)}</p><div class="chips">${S.friends.map((f) => chip(f, gs.friend === f, `data-act="gemFriend" data-v="${esc(f)}"`)).join('')}</div>` : ''}
      ${gs.vis === 'friends' && !S.friends.length ? `<p class="hint">${ic('people')} ${esc(LOOPS.inviteShare)} <button class="link pretend" data-sheet="friend">${esc('Add a Friend')}</button></p>` : ''}
      ${checks()}
      ${edit ? '' : `<div class="mocktray"><span>${esc(G.mockK)}</span>${Object.keys(SPOTS).map((k) => `<button data-act="gemSpot" data-v="${k}" aria-pressed="${gs.spot === k}">${esc(G.spots[k])}</button>`).join('')}</div>`}
      ${edit ? '' : hereLine()}
      <div class="btns"><button class="btn primary" data-act="gemSave">${esc(edit ? G.saveChanges : G.save)}</button></div>
      <p class="hint centre">${esc(G.changeLater)}</p>
      ${src('Private by default; a public gem must be a public place — design review Oct 1 (decided)')}
      ${src(O.gemWho === 'two' ? 'Just Me / Everyone — team, Oct 1 and Oct 29' : O.gemWho === 'four' ? 'One Friend — earlier mockup; Amara task 4' : 'Friends — mockup B6 (proposed, Team Option)')}
      ${src('Under 16: Just Me or Friends; shared gems drop Hidden / Secret-feeling; faces blurred — Problems B6 (proposed)')}
      ${idea('home bubble greys out sharing: “Too close to home to share” (gems brief (d)4); schools excluded like Wayfarer')}
      ${src('“Save Gem to My Map” needs an explicit tap — FTUE cowork, Oct 23 (decided)')}${solves('p6')}`;
  },
});

// ================================================================== GEM CREATED
reg('gem-made', {
  jewel: (p) => { const g = gemById(p.id); return g ? gemCol(g.type) : '#B36BFF'; }, cls: () => 'gm-made',
  html(p) {
    const G = GEMS;
    const g = gemById(p.id) || S.gems.find((x) => x.mine) || S.gems[0];
    const v = gemVisOf(g);
    // pending friends are the audience: "Jess will see it when she accepts" (pass 2: Maya)
    const pend = S.pending[S.pending.length - 1];
    const line = v === 'all' && O.gemPublic === 'reviewed' ? G.madeLine.review : v === 'friend1' ? G.madeLine.friend1(g.friendName) : v === 'friends' && !S.friends.length ? (pend ? LOOPS.madePending(pend, pronoun(pend)) : LOOPS.madeFriendsNone) : G.madeLine[v];
    const homeSpot = gemAtHome(g) && blurShared();
    const rare = O.gemRarity !== 'off' && (v === 'all' || v === 'friends');
    const story = p.after === 'chapter' || p.after === 'break';
    return `<div class="gm-made-top"><span class="gm-bubble">${sparkle(14, 'currentColor')} ${esc(G.madeK)}</span></div>
      <div class="polaroid gm-pol" style="--jewel:${gemCol(g.type)}"><div class="ph">${gemSvg(g.type, 76)}<span>${esc(g.photo ? G.polaroidNote : G.noPhoto)}</span></div><b>${esc(g.name)}</b>${g.note ? `<i class="pol-note">${esc(g.note)}</i>` : ''}<small>${esc(G.types[g.type].name)} · ${esc(G.who[v].t)}</small><span class="gm-logo">${sparkle(10, '#7E4FD0')} Story City</span></div>
      <p class="gm-line">${esc(line)}</p>
      ${rare ? `<p class="hint centre gm-bal">${esc(O.gemRarity === 'votes' ? G.rarityStart.votes : G.rarityStart.finds)}</p><button class="link pretend" data-sheet="gemRarity">${esc(G.rarityBtn)}</button>` : ''}
      ${!S.account ? `<div class="guestbar"><p>${esc(G.guest)}</p><button class="btn ghost small" data-go="account" data-p='{"mode":"re","next":"back"}'>${esc(G.guestBtn)}</button></div>` : ''}
      <div class="btns">${homeSpot ? `<button class="btn primary gm-dim" data-act="tip" data-tip="${esc(GEMS.blocks.home)}" aria-disabled="true">${ic('lock')} ${esc(LOOPS.shareHome)}</button>` : v === 'all' && !S.teen ? `<button class="btn primary" data-sheet="gemShare" data-p='{"id":"${g.id}"}'>${ic('share')} ${esc('Share Your Gem')}</button>` : !S.friends.length ? `<button class="btn primary" data-sheet="friend">${ic('people')} ${esc(LOOPS.inviteShare.replace('.', '').replace('Add a friend to share it', 'Add a Friend to Share It'))}</button>` : `<button class="btn primary" data-sheet="gemShare" data-p='{"id":"${g.id}"}'>${ic('share')} ${esc(G.share)}</button>`}
        <button class="btn ghost gm-goto" data-act="gemGoTo" data-id="${g.id}">${ic('pin')} <span>${esc(G.goTo)}</span> ${ic('chev')}</button></div>
      <div class="centre"><button class="link" data-act="gemDone" data-after="${esc(p.after || '')}">${esc(story ? G.backStory : G.done)}</button></div>
      ${src('Status bubble “GEM CREATED”, all caps, no name — design review Nov 3 (decided)')}
      ${src('Polaroid + “Share your gem with a friend” first, no Cancel; logo on the Polaroid — Victoria gem review, Jul 17 (proposed)')}
      ${src('Go-to arrow opens the map at the gem — FTUE review, Oct 21 (decided)')}
      ${rare ? idea('rarity starts here: every shared gem starts at the bottom tier (gems brief (d)10)') : ''}
      ${!S.account ? src('“Save it as a gem” stays a sign-up hook — Golden Path, Oct 30') : ''}`;
  },
});
regSheet('gemShare', (p) => {
  const g = gemById(p.id) || S.gems[0];
  return {
    jewel: gemCol(g.type), label: GEMS.shareTitle,
    html: `<p class="kicker">${ic('share')} ${esc(GEMS.shareK)}</p><h3>${esc(GEMS.shareTitle)}</h3><p class="more">${esc(GEMS.shareSub)}</p>
      ${gemAtHome(g) && blurShared() ? `<p class="safety warn">${ic('home')} ${esc(GEMS.blocks.home)}</p>` : ''}
      ${S.friends.length ? `<div class="gm-friends">${S.friends.map((f) => `<div class="gm-fr"><span class="pav">${esc(f[0])}</span><b>${esc(f)}</b>${gemAtHome(g) && blurShared() ? `<button class="btn ghost small gm-dim" data-act="tip" data-tip="${esc(LOOPS.shareHome)}" aria-disabled="true">${esc(GEMS.send)}</button>` : `<button class="btn ghost small" data-act="gemShareTo" data-v="${esc(f)}">${esc(GEMS.send)}</button>`}</div>`).join('')}</div>`
        : `<div class="empty-note invite"><p>${esc(LOOPS.inviteShare)}</p><button class="btn ghost small" data-sheet="friend">${esc('Add a Friend')}</button></div>`}
      <div class="btns">${S.teen || (gemAtHome(g) && blurShared()) ? '' : `<div class="row2"><button class="btn ghost small" data-act="gemCopy">${esc(GEMS.copy)}</button><button class="btn ghost small" data-act="gemCopy" data-v="apps">${esc(GEMS.moreApps)}</button></div>${gemVisOf(g) === 'all' ? `<button class="btn ghost small" data-act="storySize">${esc(LOOPS.storySize)}</button>` : ''}`}</div>
      ${gemVisOf(g) === 'all' ? src('Copy Link and a story-size Polaroid on day 0, before any friend — social retest (Kai); under 16 stays friends-only') : ''}
      ${src('Share a link, not just the image — Victoria gem review, Jul 17; friends-only for under 16 (B6)')}${idea('Pikmin Bloom postcards: one gem, one friend, can’t be forwarded')}`,
  };
});

// ================================================================== THE MAP CARD (tap a gem pin)
regSheet('gem', (p) => {
  const g = gemById(p.id) || S.gems[0];
  const v = gemVisOf(g);
  const t = O.gemRarity === 'finds' || O.gemRarity === 'votes' ? gemTier(g) : null;
  const kicker = g.mine ? GEMS.view.mine : g.friend ? GEMS.view.friend(g.by) : GEMS.view.by(g.by);
  return {
    jewel: gemCol(g.type), label: g.name,
    html: `<div class="gm-card">${gemSvg(g.type, 46)}<div><p class="kicker">${esc(kicker)}</p><h3>${esc(g.name)}</h3><p class="meta">${esc(GEMS.types[g.type].name)} · ${esc(g.mine ? GEMS.who[v].t : GEMS.away(g.dist || 5))}${t ? ` · ${esc(t.name)}` : ''}</p></div></div>
      ${g.note ? `<p class="more gm-note">“${esc(g.note)}”</p>` : ''}
      <div class="btns"><button class="btn primary" data-go="gem-view" data-p='{"id":"${g.id}"}'>${esc(GEMS.openGem)}</button>
      ${g.mine ? '' : `<div class="row2"><button class="btn ghost small" data-act="gemTake" data-id="${g.id}">${ic('walk')} ${esc(GEMS.takeMe)}</button><button class="btn ghost small" data-act="gemSaveLater" data-id="${g.id}" aria-pressed="${!!g.saved}">${ic('heart')} ${esc(g.saved ? GEMS.savedLater : GEMS.saveLater)}</button></div>`}</div>
      ${src('Tap a gem → Polaroid + short blurb — brainstorm Oct 29; “Take me there” (not “Navigate”), heart = save for later, “left by @person” — Jul 17 reviews (proposed)')}`,
  };
});

// ================================================================== THE GEM PAGE
function socialBlock(g) {
  const G = GEMS, soc = O.gemSocial;
  const cheerBtn = `<button class="cheer" data-act="gemCheer" data-id="${g.id}" aria-pressed="${!!g.cheered}">${sparkle(14)} ${esc(g.cheered ? G.cheered : G.cheer)} · ${g.cheers || 0}</button>`;
  if (soc === 'votes') {
    const score = (g.cheers || 0) - (g.down || 0);
    return `<div class="gm-votes"><p class="lbl">${esc(G.votesK)}</p><button class="ibtn" data-act="gemVote" data-id="${g.id}" data-v="1" aria-pressed="${g.vote === 1}" aria-label="${esc(G.up)}">${ic('chev', 'up')}</button><b>${score}</b><button class="ibtn" data-act="gemVote" data-id="${g.id}" data-v="-1" aria-pressed="${g.vote === -1}" aria-label="${esc(G.downV)}">${ic('chev', 'down')}</button></div>${src('Up/down votes for quality control — Community Gems Loop, Oct 8 (Experiments: low confidence)')}`;
  }
  let out = `<div class="gm-social">${cheerBtn}</div>`;
  if (soc === 'presets') {
    out = `<p class="lbl">${esc(G.reactK)}</p><div class="chips gm-react">${G.reactions.map((r) => `<button class="chip" aria-pressed="${g.reacted === r.id}" data-act="gemReact" data-id="${g.id}" data-v="${r.id}">${esc(r.t)} · ${(g.react || {})[r.id] || 0}</button>`).join('')}</div>${out}
      ${idea('cheers, not votes; 3 preset reactions instead of comments (gems brief (d)8)')}`;
  }
  if (soc === 'friends' || soc === 'comments') {
    const list = (g.comments || []).filter((c) => soc === 'comments' || c.friend);
    out += `<p class="lbl">${esc(soc === 'friends' ? G.friendsCommentsK : G.commentsK)}</p>
      ${list.length ? `<ul class="gm-comments">${list.map((c) => `<li><b>${esc(c.who)}</b> ${esc(c.t)}</li>`).join('')}</ul>` : `<p class="hint">${esc(soc === 'friends' ? G.friendsNone : G.noComments)}</p>`}
      <div class="gm-reply"><input class="field" id="gmcomment" maxlength="120" placeholder="${esc(G.commentPh)}" aria-label="${esc(G.commentPh)}"><button class="btn primary small inl" data-act="gemComment" data-id="${g.id}">${esc(G.post)}</button></div>
      ${src(soc === 'friends' ? 'Comments in V1: friends only — gems brief (d)8' : 'Open comments need moderation — Victoria gem review, Jul 17')}`;
  }
  return out;
}
// who found and cheered your gem, by name for friends, with when (pass 2: Gord)
function whoList2(g) {
  const L = (g.log || []).filter((x) => O.findNames === 'names');
  if (!L.length) return O.findNames === 'names' ? `<p class="hint">${esc(LOOPS.gemWhoNone)}</p>` : '';
  const when = (d) => (d === S.day ? LOOPS.ages.today : d === S.day - 1 ? LOOPS.ages.yesterday : LOOPS.ages.days(S.day - d));
  const what = { found: LOOPS.whatFound, cheered: LOOPS.whatCheered, saw: LOOPS.whatSaw };
  const named = L.slice(0, 4), others = Math.max(0, (g.finds || 0) + (g.cheers || 0) - L.length);
  return `<p class="lbl">${esc(LOOPS.gemWhoK)}</p><ul class="gm-whos">${named.map((x) => `<li><span class="pav">${esc(x.who[0])}</span>${esc(LOOPS.gemWhoRow(x.who, what[x.what] || x.what, when(x.day)))}</li>`).join('')}${others ? `<li class="more">${esc(LOOPS.gemWhoMore(others))}</li>` : ''}</ul>`;
}
function tierBlock(g) {
  const t = gemTier(g);
  if (!t) return '';
  if (O.gemRarity === 'votes') return `<button class="gm-badge" style="--tc:${TIER_COL[t.i]}" data-sheet="gemRarity">${esc(t.name)}</button>`;
  if (O.gemRarity === 'filter') return g.mine ? `<p class="hint">${esc(GEMS.rarityFilter)}</p>` : '';
  const nx = tierNext(g);
  return `<button class="gm-tier" data-sheet="gemRarity">${sparkle(12, TIER_COL[t.i])} ${esc(GEMS.tierLine(t.name, g.finds || 0))} ${ic('info')}</button>${nx ? `<p class="hint centre tier-next">${esc(nx.top ? LOOPS.top : LOOPS.toNext(nx.n, nx.name))}</p>` : ''}`;
}
reg('gem-view', {
  jewel: (p) => { const g = gemById(p.id); return g ? gemCol(g.type) : '#B36BFF'; }, cls: () => 'gm-scr',
  html(p) {
    const G = GEMS;
    const g = gemById(p.id);
    if (!g || g.hidden) return `<div class="bar">${backBtn()}<span class="walk-name">${esc(G.view.mine)}</span></div><p class="big">${esc(G.removed)}</p>`;
    const v = gemVisOf(g);
    const shared = v !== 'me';
    const here = S.atGem === g.id;
    const kicker = g.mine ? G.view.mine : g.friend ? G.view.friend(g.by) : G.view.by(g.by);
    const fade = O.gemFade === 'seasonal' && g.season ? G.seasonal(g.season) : O.gemFade === 'fade' && shared ? G.fadeIn(g.fadeIn || 30) : '';
    g.isNew = false;
    return `<div class="bar">${backBtn()}<span class="walk-name">${esc(kicker)}</span>${g.mine ? '' : `<span class="count">${esc(G.away(g.dist || 5))}</span>`}</div>
      <div class="polaroid gm-pol" style="--jewel:${gemCol(g.type)}">${g.found ? `<span class="found-stamp" aria-label="${esc(LOOPS.foundStamp)}">${esc(LOOPS.foundStamp)}</span>` : ''}<div class="ph">${gemSvg(g.type, 70)}<span>${esc(g.photo ? G.polaroidNote : G.noPhoto)}</span></div><b>${esc(g.name)}</b><small>${esc(G.types[g.type].name)} · ${esc(g.from === 'Quick save' ? 'Saved spot' : g.from)}</small><span class="gm-logo">${sparkle(10, '#7E4FD0')} Story City</span></div>
      ${tierBlock(g)}
      ${g.note ? `<p class="gm-note">“${esc(g.note)}”</p>` : ''}
      ${(g.vibes || []).length ? `<div class="tags">${g.vibes.map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>` : ''}
      ${fade ? `<p class="hint">${ic('clock')} ${esc(fade)}</p>` : ''}
      <div class="gm-who"><span class="gm-who-ic">${ic(VIS_IC[v])}</span><div><p class="lbl">${esc(G.whoK)}</p><b>${esc(G.who[v].t)}</b><small>${esc(whoShort(v, g))}</small></div>${g.mine ? `<button class="btn ghost small inl" data-act="gemTo" data-v="gem-who" data-edit="${g.id}">${esc(G.change)}</button>` : ''}</div>
      ${g.mine ? `
        ${!shared && O.gemRarity !== 'off' ? `<p class="hint">${esc(G.rarityPrivate)}</p>` : ''}
        ${g.echo === S.day && !g.backDay ? `<div class="echo"><p class="kicker">${esc(LOOPS.echoK)}</p><button class="btn jewel small" data-act="gemBack" data-id="${g.id}">${ic('check')} ${esc(LOOPS.backHere)}</button></div>${idea('Gem Echo: going back to your own spot counts, even for a private gem (lowenergy)')}` : ''}
        ${shared ? `<p class="meta">${esc(G.stats(g.finds || 0, g.cheers || 0))}</p>${whoList2(g)}
          ${O.gemSocial === 'presets' ? `<div class="tags">${G.reactions.map((r) => `<span class="tag">${esc(r.t)} · ${(g.react || {})[r.id] || 0}</span>`).join('')}</div>` : ''}
          ${['friends', 'comments'].includes(O.gemSocial) && (g.comments || []).length ? `<ul class="gm-comments">${g.comments.filter((c) => O.gemSocial === 'comments' || c.friend).map((c) => `<li><b>${esc(c.who)}</b> ${esc(c.t)}</li>`).join('')}</ul>` : ''}` : ''}
        <div class="btns"><div class="row2"><button class="btn ghost small" data-go="gemsave" data-p='{"edit":"${g.id}"}'>${esc(G.edit)}</button><button class="btn ghost small" data-sheet="gemShare" data-p='{"id":"${g.id}"}'>${ic('share')} ${esc(G.share.split(' with')[0])}</button></div>
          <button class="btn ghost small gm-goto" data-act="gemGoTo" data-id="${g.id}">${ic('pin')} <span>${esc(G.goTo)}</span> ${ic('chev')}</button></div>
        <div class="centre"><button class="link" data-sheet="gemRemove" data-p='{"id":"${g.id}"}'>${esc(G.remove)}</button></div>
        ${src('Your gems: edit any time — Victoria gem review, Jul 17 (proposed)')}`
      : `
        <div class="btns"><button class="btn primary" data-act="gemTake" data-id="${g.id}">${ic('walk')} ${esc(G.takeMe)}</button>
          <div class="row2"><button class="btn ghost small" data-act="gemSaveLater" data-id="${g.id}" aria-pressed="${!!g.saved}">${ic('heart')} ${esc(g.saved ? G.savedLater : G.saveLater)}</button>
          ${g.found ? `<button class="btn ghost small" aria-disabled="true" disabled>${ic('check')} ${esc(G.foundAlready)}</button>` : here ? `<button class="btn jewel small" data-act="gemFound" data-id="${g.id}">${ic('check')} ${esc(G.foundIt)}</button>` : `<button class="btn ghost small gm-dim" data-act="foundFar" data-id="${g.id}">${ic('pin')} ${esc(G.foundIt)}</button>`}</div>
          ${S.foundHint === g.id && !here && !g.found ? `<p class="hint found-far">${ic('pin')} ${esc(LOOPS.foundFar)}</p>` : ''}
          ${O.seenIt !== 'off' && !here && !g.found && !g.seen ? `<button class="btn ghost small" data-act="gemSeen" data-id="${g.id}">${ic('compass')} ${esc(LOOPS.seenIt)}</button>${src(`Finding from afar counts as a ${O.seenIt} — nonwalkers pair (Team Option seenIt)`)}` : ''}</div>
        <div class="mocktray"><span>Mockup</span><button data-act="gemHere" data-id="${g.id}" aria-pressed="${here}">${esc(here ? 'I’m Standing at the Gem' : 'Pretend I’m at the Gem')}</button></div>
        ${idea('“I Found It” only counts on site (within 30 m); it feeds rarity (gems brief (d)8)')}${src('I Found It pays the finder (a Found stamp, the tier named) and tells the maker — loops brief Gems #3; Munzee, Geocaching')}
        ${socialBlock(g)}
        <div class="centre"><button class="link" data-sheet="gemReport" data-p='{"id":"${g.id}"}'>${ic('flag')} ${esc(G.reportLink)}</button></div>
        ${idea('report like a story stop: Private home · Not safe · Gone · Not nice; hides at once (gems brief (d)9)')}`}
      ${src('Other people’s gems on the home map — Brett + Emily, Nov 3; glow through fog — design review, Nov 3')}
      <div class="tabpad"></div>`;
  },
});
regSheet('gemReport', (p) => ({
  jewel: '#FF4F79', label: GEMS.reportTitle,
  html: `<p class="kicker">${ic('flag')} ${esc(GEMS.reportK)}</p><h3>${esc(GEMS.reportTitle)}</h3>
    <div class="choices">${GEMS.reportRows.map((r) => `<button class="choice" data-act="gemReport" data-id="${esc(p.id)}"><b>${esc(r.t)}</b><span>${esc(r.s)}</span></button>`).join('')}</div>
    <p class="hint">${esc(GEMS.reportNote)}</p>
    ${src('Exclusion list: private homes, K-12 schools, daycares — Wayfarer; “content moderation will be needed” — Jul 17')}${solves('p6')}`,
}));
regSheet('gemRemove', (p) => ({
  jewel: '#FF4F79', label: GEMS.removeTitle,
  html: `<h3>${esc(GEMS.removeTitle)}</h3><p class="more">${esc(GEMS.removeSub)}</p>
    <div class="btns"><button class="btn primary" data-act="gemRemove" data-id="${esc(p.id)}">${esc(GEMS.removeYes)}</button><button class="btn ghost" data-close>${esc(GEMS.removeNo)}</button></div>`,
}));
regSheet('gemRarity', () => {
  const k = O.gemRarity === 'votes' ? 'votes' : 'finds';
  return {
    jewel: '#C49BFF', label: GEMS.rarityK,
    html: `<p class="kicker">${sparkle(12, 'var(--glow)')} ${esc(GEMS.rarityK)}</p><h3>${esc(GEMS.rarityTitle)}</h3><p class="more">${esc(GEMS.raritySub[k])}</p>
      <ol class="gm-ladder">${GEMS.rarityHow[k].map((t, i) => `<li style="--tc:${TIER_COL[i]}"><i></i>${esc(t)}</li>`).join('')}</ol>
      ${k === 'finds' ? `<p class="hint">${esc(GEMS.rarityFilter)}</p>` : ''}<p class="hint">${esc(GEMS.rarityPrivate)}</p>
      ${src(k === 'votes' ? 'Common → legendary, rated by people — Location gems ideation, Jul; design review Oct 1' : 'Rough → fine → flawless → perfect, set by how many find it; a filter, not a visual — brainstorm, Oct 29')}
      ${idea('earned by distinct finders on site plus cheers, never by chance or type (Geocaching favourites; gems brief (c))')}`,
  };
});

// ================================================================== ACTIONS (merged into app.js's ACT)
function leaveFlow(after) {
  if (after === 'break') { if (popTo('break')) return; }
  if (after === 'chapter') {
    popWhile(isGemScreen, true);
    return go('chapter', {}, { replace: current().id === 'camera' });
  }
  popWhile(isGemScreen);
}
function nudge(d) {
  const step = 14;
  gs.x = Math.max(70, Math.min(320, gs.x + (d === 'left' ? -step : d === 'right' ? step : 0)));
  gs.y = Math.max(40, Math.min(480, gs.y + (d === 'up' ? -step : d === 'down' ? step : 0)));
  if (gs.spot === 'home' && !inBubble()) gs.spot = 'walk';
}
export const GEM_ACT = {
  gemTo: (el) => {
    const v = el.dataset.v, p = current().p || {};
    if (el.dataset.edit) return go(v, { edit: el.dataset.edit });
    if (v === 'gem-snap') return go('gem-snap', { after: p.after, fromDetails: 1 });
    go(v, { after: p.after, edit: p.edit });
  },
  gemSnap: () => { gs.photo = true; rerender(); },
  gemRetake: () => { gs.photo = false; rerender(); },
  gemUsePhoto: () => { const p = current().p || {}; if (p.fromDetails) return back(); go('gemsave', { after: p.after }); },
  gemNoCam: () => { gs.photo = false; const p = current().p || {}; if (p.fromDetails) return back(); go('gemsave', { after: p.after, describe: 1 }); },
  gemType: (el) => { gs.type = el.dataset.v; rerender(); },
  vibe: (el) => { const v = el.dataset.v; const a = gs.vibes; if (a.includes(v)) a.splice(a.indexOf(v), 1); else if (a.length < 3) a.push(v); else return toast('Up to 3 vibes.'); rerender(); },
  gemVis: (el) => {
    const v = el.dataset.v, hid = gs.vibes.filter((x) => HIDDEN_VIBES.includes(x));
    // say so before a picked vibe drops (loops must-fix 6)
    if (v !== 'me' && hid.length) return openSheet('gemVibeDrop', { v, vibe: hid[0] });
    gs.vis = v; fixVis(); rerender();
  },
  gemVibeKeep: () => { closeSheet(true); gs.vis = 'me'; rerender(); },
  gemVibeDrop: (el) => { closeSheet(true); gs.vis = el.dataset.v; fixVis(); rerender(); },
  gemFriend: (el) => { gs.friend = el.dataset.v; rerender(); },
  gemSpot: (el) => { gs.spot = el.dataset.v; Object.assign(gs, SPOTS[gs.spot]); fixVis(); rerender(); },
  gemNudge: (el) => { nudge(el.dataset.v); fixVis(); rerender(); openSheet('gemNudge'); },
  gemSave: () => {
    fixVis();
    const p = current().p || {};
    const fields = { type: gs.type || 'curio', name: gs.name.trim() || defaultGemName(gs.type), note: gs.note.trim(), vibes: gs.vibes.slice(), vis: gs.vis, priv: gs.vis === 'me', photo: gs.photo, x: gs.x, y: gs.y, friendName: gs.vis === 'friend1' ? gs.friend : undefined, season: gs.season ? 'Dec 21' : undefined };
    if (p.edit) { const g = gemById(p.edit); if (g) Object.assign(g, { vis: fields.vis, priv: fields.priv, friendName: fields.friendName, vibes: fields.vibes }); toast(GEMS.saveChanges.replace('Save ', '') + ' saved.'); return popTo('gem-view') || back(); }
    const n = S.gems.filter((g) => g.mine).length;
    const id = 'g' + Date.now();
    S.gems.push({ id, ...fields, x: gs.x + (n % 3) * 6 - 6, mine: true, from: p.after ? 'A story' : 'A walk', finds: 0, cheers: 0, react: { walk: 0, smile: 0, learn: 0 }, comments: [], fadeIn: 30 });
    S.week.gems++; S.focusGem = id;
    go('gem-made', { id, after: p.after }, { replace: true });
  },
  gemEditSave: () => {
    const p = current().p || {}; const g = gemById(p.edit);
    if (g) Object.assign(g, { type: gs.type || g.type, name: gs.name.trim() || (g.from === 'Quick save' ? defaultGemName(gs.type || g.type) : g.name), note: gs.note.trim(), vibes: gs.vibes.slice(), photo: gs.photo, season: gs.season ? (g.season || 'Dec 21') : undefined });
    if (g && g.from === 'Quick save') g.from = 'A walk';   // the "Quick save" label goes once you edit
    toast('Changes saved.'); if (!popTo('gem-view')) back();
  },
  gemDone: (el) => leaveFlow(el.dataset.after),
  gemGoTo: (el) => { S.focusGem = el.dataset.id; mapUI.filter = 'every'; go('map', {}, { root: true }); toast('Here it is.'); },
  gemTake: (el) => { S.focusGem = el.dataset.id; mapUI.filter = 'all'; go('map', {}, { root: true }); toast(GEMS.takeMeDone); },
  gemSaveLater: (el) => { const g = gemById(el.dataset.id); g.saved = !g.saved; toast(g.saved ? 'Saved for later.' : 'Removed from Saved.'); if (current().id === 'gem-view') rerender(); else openSheet('gem', { id: g.id }); },
  gemHere: (el) => { S.atGem = S.atGem === el.dataset.id ? null : el.dataset.id; rerender(); },
  // I Found It from afar says why, in place (pass 2: Ines; the floating tip was cut off)
  foundFar: (el) => { S.foundHint = el.dataset.id; rerender(); },
  moreVibes: () => { gs.allVibes = true; rerender(); },
  gemBack: (el) => { const g = gemById(el.dataset.id); g.backDay = S.day; countWalk({ steps: 300 }); const res = pressSeal(1); toast(LOOPS.backDone(res)); rerender(); },
  gemFound: (el) => {
    const g = gemById(el.dataset.id); const before = gemTier(g);
    g.found = true; g.foundDay = S.day; g.finds = (g.finds || 0) + 1; g.fadeIn = 30;
    const after = gemTier(g);
    // getting there counts as a walk and can press today's seal (loops §2)
    countWalk({ steps: (g.dist || 5) * 100 }); const seal = pressSeal(1);
    const msg = before && after && after.i > before.i ? LOOPS.foundTier(g.name, after.name) : g.friend ? LOOPS.foundFriend(g.by.replace(/ \w\.$/, '')) : LOOPS.found(g.finds);
    toast(msg + (seal === 'pressed' ? ' Seal pressed.' : ''));
    logAct('quiet', msg, { gem: g.id });
    rerender();
  },
  gemSeen: (el) => {
    const g = gemById(el.dataset.id); g.seen = true;
    if (O.seenIt === 'find') { g.finds = (g.finds || 0) + 1; g.found = true; g.foundDay = S.day; } else { g.cheered = true; g.cheers = (g.cheers || 0) + 1; }
    toast(LOOPS.seenDone[O.seenIt]); rerender();
  },
  gemCheer: (el) => { const g = gemById(el.dataset.id); g.cheered = !g.cheered; g.cheers = (g.cheers || 0) + (g.cheered ? 1 : -1); rerender(); },
  gemReact: (el) => { const g = gemById(el.dataset.id); g.react = g.react || {}; const v = el.dataset.v; if (g.reacted) g.react[g.reacted]--; g.reacted = g.reacted === v ? null : v; if (g.reacted) g.react[v] = (g.react[v] || 0) + 1; rerender(); },
  gemVote: (el) => { const g = gemById(el.dataset.id); const v = +el.dataset.v; if (g.vote === 1) g.cheers--; if (g.vote === -1) g.down--; g.vote = g.vote === v ? 0 : v; if (g.vote === 1) g.cheers++; if (g.vote === -1) g.down = (g.down || 0) + 1; rerender(); },
  gemComment: (el) => { const i = $('#gmcomment'); const t = i && i.value.trim(); if (!t) return toast('Write something first.'); const g = gemById(el.dataset.id); (g.comments = g.comments || []).push({ who: S.name, t, friend: true }); toast(O.gemSocial === 'friends' ? GEMS.posted : GEMS.postedAll); rerender(); },
  gemShareTo: (el) => { closeSheet(); toast(GEMS.sent(el.dataset.v)); },
  upPick: (el) => { upPick = el.dataset.v; const r = ROLL.find((x) => x.id === upPick); S.upPlaced = false; if (r.x !== null) Object.assign(gs, { x: r.x, y: r.y, spot: r.spot }); else Object.assign(gs, { ...SPOTS.walk, spot: 'walk' }); rerender(); },
  upPlace: () => { S.upPlaced = true; rerender(); },
  upUse: () => { const r = ROLL.find((x) => x.id === upPick); gs.photo = true; if (r && r.type && !gs.type) gs.type = r.type; fixVis(); go('gemsave', { fromUpload: 1 }); },
  gemCopy: () => { closeSheet(); toast(GEMS.copied); },
  gemReport: (el) => { const g = gemById(el.dataset.id); if (g) g.hidden = true; closeSheet(true); if (current().id === 'gem-view') back(); else rerender(); toast(GEMS.reportDone); },
  gemRemove: (el) => { const i = S.gems.findIndex((g) => g.id === el.dataset.id); if (i >= 0) S.gems.splice(i, 1); closeSheet(true); popWhile((id) => id === 'gem-view' || isGemScreen(id)); toast(GEMS.removed); },
  quickGem: () => {
    // Team Option "one tap": saves where you're standing, private; name and details later (Melissa, Nov 4)
    // At home it asks first (loops must-fix 8, danas pair)
    if (standing() === 'home') return openSheet('quickHome');
    quickSave(false);
  },
  quickHomeYes: () => quickSave(true),
  qgSpot: (el) => { S.qgSpot = el.dataset.v; openSheet('quickGem'); },
  gemNameQuick: (el) => { $('#toast').hidden = true; go('gemsave', { edit: el.dataset.id, focusName: 1 }); },
};
// a free spot near where you're standing, never on top of another gem
function freeSpot(base) {
  const taken = S.gems.filter((g) => !g.hidden);
  for (let r = 0; r < 6; r++) for (let a = 0; a < 8; a++) {
    const x = base.x + Math.round(Math.cos(a * Math.PI / 4) * r * 16), y = base.y + Math.round(Math.sin(a * Math.PI / 4) * r * 16);
    if (taken.every((g) => Math.hypot(g.x - x, g.y - y) > 22)) return { x, y };
  }
  return { ...base };
}
// Just Save It shows where it went: a 1.5 s Polaroid flash, then a toast with Name It (loops Gems #5)
function quickSave(home) {
  const at = freeSpot(home ? SPOTS.home : SPOTS.walk);
  const id = 'g' + Date.now();
  S.gems.push({ id, type: 'curio', name: 'Saved spot', ...at, mine: true, priv: true, vis: 'me', vibes: [], from: 'Quick save', note: '', savedDay: S.day });
  S.week.gems++; S.focusGem = id; S.youAt = home ? null : SPOTS.walk;
  youUI.tab = 'stamps';   // "It's in You → Stamps" opens there (pass 2: Gord)
  closeSheet(true);
  const ph = $('#phone'); const f = document.createElement('div'); f.className = 'qflash'; f.setAttribute('aria-hidden', 'true');
  f.innerHTML = `<div class="polaroid gm-pol" style="--jewel:#B36BFF"><div class="ph">${gemSvg('curio', 60)}<span>${esc('This spot')}</span></div><b>${esc('Saved spot')}</b><small>${esc('Just me')}</small></div>`;
  ph.appendChild(f);
  later(() => { f.remove(); toast(LOOPS.quickSaved(O.gemsTabName), { label: LOOPS.quickName, act: 'gemNameQuick', id }); }, 1500);
  setTimeout(() => { if (f.isConnected) f.remove(); }, 2200);
  if (current().id === 'map' || current().id === 'you') rerender();
}
regSheet('quickHome', () => ({
  jewel: '#B36BFF', label: LOOPS.quickHome.k,
  html: `<p class="kicker">${ic('home')} ${esc(LOOPS.quickHome.k)}</p><p class="big">${esc(LOOPS.quickHome.t)}</p>
    <div class="btns"><button class="btn primary" data-act="quickHomeYes">${ic('lock')} ${esc(LOOPS.quickHome.yes)}</button><button class="btn ghost" data-close>${esc(LOOPS.quickHome.no)}</button></div>
    ${src('Just Save It at home runs the home-bubble check — loops must-fix 8 (danas pair)')}`,
}));
regSheet('gemVibeDrop', (p) => ({
  jewel: '#C49BFF', label: LOOPS.vibeDrop.k,
  html: `<p class="kicker">${esc(LOOPS.vibeDrop.k)}</p><p class="big">${esc(LOOPS.vibeDrop.t(p.vibe))}</p>
    <div class="btns"><button class="btn primary" data-act="gemVibeKeep">${esc(LOOPS.vibeDrop.keep)}</button><button class="btn ghost" data-act="gemVibeDrop" data-v="${esc(p.v)}">${esc(LOOPS.vibeDrop.drop(p.vibe))}</button></div>
    ${src('Choosing Friends or Everyone used to drop a vibe silently — loops must-fix 6')}`,
}));
