// The Gems tab (Decision Log, Nov 26: gems keep their own tab) with two views:
// Map: the gem map with gem-pins V3 pins and its category row; tap a pin for a swipeable strip of nearby gems.
// My Gems: the Gem Hub. Sort the snapshot pile (location-gems V3 "Drag right"), then Public / Hidden / Liked, nearby.
// The Create button (one-tap camera, Brett, Nov 26) drops photos into the pile.
import { S, O, reg, regSheet, go, back, toast, openSheet, closeSheet, rerender, esc, ic, src, $, gemSvg, GEM_TYPES, gemCol, current } from './core.js';
import { GEMTAB, GEMS } from './words.js';
import { homeMap } from './maps.js';

export const GEM_ART = { nature: 'nature', art: 'art', shop: 'eat-drink', landmark: 'landmarks', curio: 'curiosities' };
export const gemArt = (type, size = 28, cls = '') => `<img class="gart ${cls}" src="gem-art/${GEM_ART[type] || 'curiosities'}.svg" width="${size}" height="${size}" alt="">`;

const RAIL_ENTER_X = 40;
const STRIP_MAX = 12;
const ME = { x: 236, y: 300 };
const MIN_PER_UNIT = 0.06;
const RAILS = ['publish', 'hidden', 'delete'];
const RAIL_COL = { publish: '0,194,255', hidden: '179,107,255', delete: '255,90,90' };

let view = 'map', filter = 'all', hubTab = 'public', drag = null, findN = 0;
export const gemsTabUI = { set view(v) { view = v; }, get view() { return view; } };

const pile = () => { if (!S.pile) S.pile = GEMTAB.pileFinds.map((f) => ({ ...f })); return S.pile; };
const minsTo = (g) => (g.dist ? g.dist : Math.max(1, Math.round(Math.hypot(g.x - ME.x, g.y - ME.y) * MIN_PER_UNIT)));
const visible = (g) => !g.hidden && !S.trash.some((t) => t.gemId === g.id);
const isPublic = (g) => g.mine && g.vis !== 'me' && visible(g);
const isHidden = (g) => g.mine && g.vis === 'me' && visible(g);
const isLiked = (g) => S.likedGems.includes(g.id) && visible(g);

const mapFilter = () => (filter === 'all' ? 'every' : filter === 'mine' ? 'mine' : `cat:${filter}`);
function mapView() {
  const f = mapFilter();
  const shown = S.gems.filter((g) => visible(g) && (filter === 'all' || (filter === 'mine' ? g.mine : g.type === filter))).length;
  const cats = ['all', ...GEM_TYPES, 'mine'];
  const icon = (k) => (k === 'all' ? `<i class="g26-all" aria-hidden="true"></i>` : k === 'mine' ? `<i class="g26-mine" aria-hidden="true">${esc(S.name[0])}</i>` : gemArt(k, 28));
  return `<div class="mapfull g26-map">
    <div class="mapbox fullbleed" id="gemmap">${homeMap({ id: 'g26', fog: false, filter: f, frontier: false, noStories: true })}</div>
    <div class="map-float g26-float">
      ${viewSwitch()}
      <div class="g26-cats" role="radiogroup" aria-label="Show gems">${cats.map((k) => `<button role="radio" class="${filter === k ? 'on' : ''}" aria-checked="${filter === k}" data-act="g26Filter" data-v="${k}" aria-label="${esc(GEMTAB.filters[k])}">${icon(k)}</button>`).join('')}</div>
      <p class="g26-legend">${filter === 'all' || filter === 'mine' ? icon(filter) : gemArt(filter, 22)}<b>${esc(GEMTAB.filters[filter])}</b><span>${esc(shown ? GEMTAB.notes[filter] : filter === 'mine' ? GEMTAB.noneMine : GEMTAB.noneHere)}</span></p>
    </div>
    ${src('Gem pins V3: category gem art, private gems as a glowing outline, swipe row of categories — gem-pins V3 (Melissa, Nov 26); categories still open (NSC-2122)')}
  </div>`;
}

function viewSwitch() {
  const n = pile().length;
  return `<div class="seg minis g26-views" role="tablist" aria-label="${esc(GEMTAB.title)}">${GEMTAB.views.map(([k, t]) => `<button role="tab" class="${view === k ? 'on' : ''}" aria-selected="${view === k}" data-act="g26View" data-v="${k}">${esc(t)}${k === 'hub' && n ? ` <span class="g26-count">${n}</span>` : ''}</button>`).join('')}</div>`;
}

function sorter() {
  const p = pile();
  if (!p.length) return `<section class="g26-sort done"><p class="big">${esc(GEMTAB.allSorted)}</p><p class="hint">${esc(GEMTAB.allSortedSub)}</p><button class="btn ghost small" data-act="createSnap">${ic('camera')} ${esc(GEMTAB.snapK)}</button></section>`;
  const [front, next] = p;
  const card = (f, cls) => `<figure class="g26-card ${cls}" ${cls === 'front' ? 'id="g26front"' : ''}><img src="${esc(f.img)}" alt="" draggable="false"><figcaption><b>${esc(f.title)}</b><small>${esc(f.where)}</small></figcaption></figure>`;
  const right = O.sortLayout === 'right';
  return `<section class="g26-sort ${right ? 'right' : 'buttons'}">
    <div class="g26-sorthead"><span>${esc(GEMTAB.sortIntro)}</span><b>${esc(GEMTAB.left(p.length))}</b></div>
    <div class="g26-stage" id="g26stage">
      ${next ? card(next, 'under') : ''}${card(front, 'front')}
      <div class="g26-rails" role="group" aria-label="${esc(GEMTAB.railsAria)}">${RAILS.map((r) => `<button class="g26-rail r-${r}" data-act="g26Sort" data-v="${r}" style="--rc:${RAIL_COL[r]}" aria-label="${esc(GEMTAB.rails[r])}">${r === 'publish' ? ic('share') : r === 'hidden' ? ic('lock') : ic('x')}<span>${esc(GEMTAB.rails[r])}</span></button>`).join('')}</div>
    </div>
  </section>`;
}

function gemTile(g) {
  const priv = g.vis === 'me';
  const ph = g.img ? `<img src="${esc(g.img)}" alt="">` : `<span class="g26-tileart" style="--gc:${gemCol(g.type)}">${O.gemPins === 'v3' ? gemArt(g.type, 46, priv ? 'hollow' : '') : gemSvg(g.type, 46)}</span>`;
  return `<button class="g26-tile" data-go="gem-view" data-p='{"id":"${g.id}"}'>${ph}<span><b>${esc(g.name)}</b><small>${esc(g.by && !g.mine ? g.by : priv ? GEMTAB.privateMine : GEMS.who[g.vis]?.t || '')}</small></span>${S.likedGems.includes(g.id) ? `<em>${ic('heart')}</em>` : ''}</button>`;
}

function hubView() {
  const lists = { public: S.gems.filter(isPublic), hidden: S.gems.filter(isHidden), liked: S.gems.filter(isLiked) };
  const tabDef = GEMTAB.tabs.find((t) => t[0] === hubTab);
  const list = lists[hubTab];
  const nearby = S.gems.filter((g) => !g.mine && visible(g) && g.vis === 'all').sort((a, b) => minsTo(a) - minsTo(b));
  return `<div class="g26-hub">
    ${viewSwitch()}
    <h1 class="display g26-h">${esc(GEMTAB.sortH)}</h1><div class="g26-opal" aria-hidden="true"></div>
    ${sorter()}
    <div class="seg minis g26-hubtabs" role="tablist">${GEMTAB.tabs.map(([k, t]) => `<button role="tab" class="${hubTab === k ? 'on' : ''}" aria-selected="${hubTab === k}" data-act="g26Hub" data-v="${k}">${esc(t)} <span class="g26-count">${lists[k].length}</span></button>`).join('')}</div>
    <p class="hint">${esc(tabDef[2])}</p>
    ${list.length ? `<div class="g26-grid">${list.map(gemTile).join('')}</div>` : `<div class="empty-note"><p class="big">${esc(GEMTAB.empty[hubTab][0])}</p><p class="hint">${esc(GEMTAB.empty[hubTab][1])}</p></div>`}
    ${S.trash.length ? `<button class="lrow" data-act="g26Trash"><b>${esc(GEMTAB.deletedRow(S.trash.length))}</b><span>${esc(GEMTAB.deletedSub)}</span>${ic('chev')}</button>` : ''}
    ${nearby.length ? `<p class="kicker section">${esc(GEMTAB.nearbyK)}</p><div class="g26-near">${nearby.map((g) => `<button class="g26-nearcard" data-go="gem-view" data-p='{"id":"${g.id}"}'>${gemArt(g.type, 30)}<b>${esc(g.name)}</b><small>${esc(GEMTAB.away(minsTo(g)))}</small></button>`).join('')}</div>` : ''}
    ${src('Gem Hub: sort finds, Public / Hidden / Liked, gems nearby — Decision Log, Nov 26; Drag right sort — location-gems V3 (Melissa, Nov 26–27); delete goes to Recently deleted for 30 days')}
    <div class="tabpad"></div>
  </div>`;
}

reg('gems', {
  tab: 'gems',
  cls: (p) => (view === 'map' && !(p && p.hub) ? 'mapfull-scr' : ''),
  html(p) { if (p && p.hub) { view = 'hub'; delete p.hub; } return view === 'map' ? mapView() : hubView(); },
  mount() { if (view === 'hub' && O.sortLayout === 'right') bindDrag(); },
});

// ---------------------------------------------------------------- the strip that slides up when you tap a pin
regSheet('gemStrip', (p) => {
  const all = S.gems.filter((g) => visible(g) && (g.mine || g.vis !== 'me') && !g.hidden).sort((a, b) => minsTo(a) - minsTo(b)).slice(0, STRIP_MAX);
  const first = all.findIndex((g) => g.id === p.id);
  const order = first > 0 ? all.slice(first).concat(all.slice(0, first)) : all;
  S.focusGem = p.id;
  const m = $('#gemmap'); if (m) m.innerHTML = homeMap({ id: 'g26', fog: false, filter: mapFilter(), frontier: false, noStories: true });
  return {
    jewel: gemCol((order[0] || {}).type), label: GEMTAB.title, cls: 'g26-stripsheet',
    html: `<div class="g26-strip" id="g26strip">${order.map((g) => {
      const priv = g.mine && g.vis === 'me';
      return `<article class="g26-gcard" data-gemid="${g.id}" style="--gc:${gemCol(g.type)}">
        <span class="g26-away">${esc(priv ? GEMTAB.privateMine : GEMTAB.away(minsTo(g)))}</span>
        <p class="g26-gname">${esc(g.name)}</p>
        <p class="hint">${esc(g.note || '')}</p>
        <div class="row2"><button class="btn ghost small" data-act="g26Go" data-id="${g.id}">${ic('route')} ${esc(GEMTAB.go)}</button><button class="btn ghost small" data-act="g26Save" data-id="${g.id}">${ic('heart')} ${esc(GEMTAB.save)}</button></div>
        <button class="link" data-go="gem-view" data-p='{"id":"${g.id}"}'>${esc(GEMTAB.open)} ${ic('chev')}</button>
      </article>`;
    }).join('')}</div>${src('Tap a pin: a swipe strip of the nearest gems; swiping moves the highlight — gem-pins V3')}`,
  };
});
document.addEventListener('scroll', (e) => {
  if (e.target.id !== 'g26strip') return;
  const cards = [...e.target.children];
  const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
  const c = cards[Math.min(cards.length - 1, Math.round(e.target.scrollLeft / step))];
  if (!c || S.focusGem === c.dataset.gemid) return;
  S.focusGem = c.dataset.gemid;
  const m = $('#gemmap'); if (m) m.innerHTML = homeMap({ id: 'g26', fog: false, filter: mapFilter(), frontier: false, noStories: true });
}, true);

// ---------------------------------------------------------------- publish: what kind, who can see it
let pubType = null;
regSheet('gemPublish', () => {
  const f = pile()[0]; if (!f) return { html: '' };
  pubType = pubType || f.type;
  const who = GEMTAB.publishWho.filter(([k]) => !(k === 'all' && S.teen && O.gemPublic !== 'anyone'));
  return {
    jewel: '#00C2FF', label: GEMTAB.publishK,
    html: `<p class="kicker">${esc(GEMTAB.publishK)}</p><h3>${esc(f.title)}</h3>
      <p class="lbl">${esc(GEMTAB.publishType)}</p>
      <div class="g26-types">${GEM_TYPES.map((t) => `<button class="${pubType === t ? 'on' : ''}" aria-pressed="${pubType === t}" data-act="g26Type" data-v="${t}">${gemArt(t, 30)}<small>${esc(GEMS.types[t].name)}</small></button>`).join('')}</div>
      <p class="lbl">${esc(GEMTAB.publishH)}</p>
      <div class="btns">${who.map(([k, , label]) => `<button class="btn ${k === 'all' ? 'primary' : 'ghost'}" data-act="g26Publish" data-v="${k}">${esc(label)}</button>`).join('')}<button class="link" data-close>${esc(GEMTAB.publishCancel)}</button></div>
      ${S.teen ? `<p class="hint">${ic('lock')} ${esc(GEMS.blocks.teen)}</p>` : ''}
      ${src('Publish asks the category, then who can see it — location-gems publish sheet; under-16s can’t post to Everyone')}`,
  };
});

// ---------------------------------------------------------------- sorting
function settle(kind, vis) {
  const p = pile(); const f = p.shift(); if (!f) return;
  if (kind === 'delete') {
    S.trash.unshift({ find: f });
    toast(GEMTAB.snack.deleted, { act: 'g26Undo', label: GEMTAB.snack.undo });
  } else {
    const id = 'gp' + (S.gems.length + 1) + '-' + Date.now() % 10000;
    S.gems.unshift({ id, type: pubType || f.type, name: f.title, x: f.x || ME.x, y: f.y || ME.y, mine: true, priv: vis === 'me', vis, vibes: [], from: f.where, note: '', img: f.img, photo: true, isNew: true });
    hubTab = vis === 'me' ? 'hidden' : 'public';
    toast(vis === 'me' ? GEMTAB.snack.hidden : vis === 'friends' ? GEMTAB.snack.friends : GEMTAB.snack.public);
  }
  pubType = null;
  rerender();
}

function bindDrag() {
  const card = $('#g26front'), stage = $('#g26stage');
  if (!card || !stage) return;
  const rails = [...stage.querySelectorAll('.g26-rail')];
  const aim = (y, dx) => {
    if (dx < RAIL_ENTER_X) return null;
    let best = null, bd = Infinity;
    rails.forEach((r) => { const b = r.getBoundingClientRect(); const d = Math.abs(b.top + b.height / 2 - y); if (d < bd) { bd = d; best = r; } });
    return best;
  };
  card.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY, lit: null };
    try { card.setPointerCapture(e.pointerId); } catch (x) {}
    stage.classList.add('aiming');
  });
  card.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    card.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
    const r = aim(e.clientY, dx);
    if (r !== drag.lit) { rails.forEach((x) => x.classList.toggle('lit', x === r)); drag.lit = r; }
  });
  const up = () => {
    if (!drag) return;
    const r = drag.lit; drag = null;
    stage.classList.remove('aiming');
    rails.forEach((x) => x.classList.remove('lit'));
    card.style.transform = '';
    if (r) G26_ACT.g26Sort(r);
  };
  card.addEventListener('pointerup', up);
  card.addEventListener('pointercancel', up);
}

export const G26_ACT = {
  createSnap: () => go('gem-snap', { quick: 1 }),
  g26View: (el) => { view = el.dataset.v; S.focusGem = null; rerender(); },
  g26Filter: (el) => { filter = el.dataset.v; rerender(); },
  g26Hub: (el) => { hubTab = el.dataset.v; rerender(); },
  g26Sort: (el) => {
    const v = el.dataset.v;
    if (v === 'publish') return openSheet('gemPublish');
    settle(v === 'hidden' ? 'hidden' : 'delete', 'me');
  },
  g26Type: (el) => { pubType = el.dataset.v; openSheet('gemPublish'); },
  g26Publish: (el) => { closeSheet(true); settle('publish', el.dataset.v); },
  g26Undo: () => { const t = S.trash.shift(); if (!t) return; pile().unshift(t.find); toast(GEMTAB.snack.restored); if (current().id === 'gems') rerender(); },
  g26Trash: () => toast(GEMTAB.deletedSub),
  g26Go: () => { closeSheet(true); go('routes', { cook: 1 }); },
  g26Save: (el) => { const id = el.dataset.id; if (!S.likedGems.includes(id)) S.likedGems.push(id); toast(GEMTAB.saved); },
  // the Create camera: Send It drops the photo in the pile (location gems app flow, NSC-1116)
  gemSend: () => {
    findN += 1;
    const f = GEMTAB.newFind(findN);
    const imgs = ['finds/find-d.jpg', 'finds/find-a.jpg', 'finds/find-b.jpg', 'finds/find-c.jpg'];
    pile().push({ id: 'fn' + findN, img: imgs[(findN - 1) % imgs.length], title: f.title, where: f.where, type: 'curio', x: ME.x + 10, y: ME.y - 10 });
    back();
    toast(GEMTAB.snapped, { act: 'g26SortNow', label: GEMTAB.sortNow });
  },
  g26SortNow: () => { view = 'hub'; if (current().id !== 'gems') return go('gems', {}, { root: true }); rerender(); },
};
