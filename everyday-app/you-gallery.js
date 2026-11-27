// You tab as three swipeable galleries: Progress, Collections, History, each with See all
// (Melissa, Nov 26: "3 little swipeable galleries ... or open it up and see everything all at once").
// Data comes from the live state S, so Next Day, journeys and new gems all show up here.
import { S, O, reg, esc, ic, n0, src, byId, gemSvg, GEM_TYPES, gemCol, seeded, backBtn } from './core.js';
import { GEMS, YOU, LIBRARY, YOUG } from './words.js';
import { homeMap } from './maps.js';

const PREVIEW = 6;
const KM_PER_STEP = 0.00075;
const LIFETIME_STEPS_PER_DAY = 1800;
const STORY_SHARE_FALLBACK = 0.4;
const CLOCK_HOURS = [0, 0, 0, 0, 0, 0, 1, 3, 4, 2, 1, 2, 3, 2, 1, 2, 4, 9, 12, 10, 5, 2, 1, 0];
const DUSK = [17, 20];
const ROUTES = [
  'M8 40 C14 20 30 18 34 30 S50 44 56 20',
  'M10 14 L24 14 L24 34 L44 34 L44 18 L56 18',
  'M8 30 C8 10 30 6 34 22 C38 38 56 38 56 16',
  'M32 8 C52 8 56 40 32 42 C10 42 10 10 30 10',
];

function totals() {
  const week = S.stepsWeek.reduce((a, b) => a + b, 0);
  const life = week + S.day * LIFETIME_STEPS_PER_DAY;
  const walks = (S.week?.walks || 0) + S.hist.filter((h) => h.walked).length + Math.floor(S.day / 2);
  const chapters = Object.values(S.progress).reduce((a, p) => a + Math.max(0, p.ch - 1), 0) + Object.keys(S.finished).length * 5;
  const gems = S.gems.filter((g) => g.mine).length;
  return { week, life, km: life * KM_PER_STEP, walks, chapters, gems };
}

function compare(km) {
  const c = YOUG.compare.filter(([, len]) => km >= len).pop() || YOUG.compare[0];
  const n = km / c[1];
  return c[2](n >= 10 ? n0(Math.round(n)) : n.toFixed(1));
}

function card(title, body, opts = {}) {
  const attr = opts.go ? `data-go="${opts.go}"${opts.p ? ` data-p='${opts.p}'` : ''}` : opts.tab ? `data-tab="${opts.tab}"` : '';
  const tag = attr ? 'button' : 'div';
  return `<${tag} class="yg-card" ${attr}><span class="yg-h"><b>${esc(title)}</b>${opts.right ? `<small>${esc(opts.right)}</small>` : ''}</span>${body}</${tag}>`;
}

function patchCard() {
  return card(YOUG.patch.t, `<span class="yg-map">${homeMap({ id: 'ygm', fog: false, filter: 'mine', frontier: false })}</span>
    <span class="yg-meter"><i style="width:${S.fogPct}%"></i></span><span class="yg-line">${esc(YOUG.patch.line(S.fogPct))}</span><span class="yg-sub">${esc(YOUG.patch.sub)}</span>`, { tab: 'map' });
}

function farCard(t) {
  const km = t.km;
  const pct = Math.min(1, (km % 10) / 10 || 0.05);
  return card(YOUG.far.t, `<svg class="yg-trail" viewBox="0 0 300 60" role="img" aria-label="${esc(YOUG.far.line(km.toFixed(1)))}">
      <path d="M20 34 C70 14 100 52 150 32 S230 16 280 34" stroke="#46337e" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M20 34 C70 14 100 52 150 32 S230 16 280 34" stroke="url(#ygTrail)" stroke-width="4" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="${pct.toFixed(3)} 1"/>
      <defs><linearGradient id="ygTrail"><stop offset="0" stop-color="#5b8cff"/><stop offset="1" stop-color="#c49bff"/></linearGradient></defs>
    </svg><span class="yg-big">${esc(km.toFixed(1))} km</span><span class="yg-line">${esc(compare(km))}</span><span class="yg-sub">${esc(YOUG.far.sub)}</span>`);
}

function weekCard(t) {
  const max = Math.max(...S.stepsWeek, 1);
  const share = t.week ? Math.min(1, S.storySteps / t.week) : STORY_SHARE_FALLBACK;
  return card(YOUG.week.t, `<span class="yg-bars">${S.stepsWeek.map((v, i) => `<span><i style="height:${v ? Math.max(6, v / max * 100) : 2}%"><em style="height:${share * 100}%"></em></i><small>${'MTWTFSS'[i]}</small></span>`).join('')}</span>
    <span class="yg-key"><span><i class="k-story"></i>${n0(Math.min(S.storySteps, t.week))} ${esc(YOUG.week.story)}</span><span><i class="k-every"></i>${n0(Math.max(0, t.week - S.storySteps))} ${esc(YOUG.week.every)}</span></span>`, { right: `${n0(t.week)} ${YOUG.week.steps}` });
}

function skyCard(t) {
  const r = seeded('sky' + S.name);
  let stars = '';
  for (let i = 0; i < Math.max(1, t.walks); i++) {
    const v = r(), cx = 10 + r() * 280, cy = 8 + r() * 70, s = 1.4 + v * 3.2;
    stars += v > 0.75
      ? `<circle cx="${cx}" cy="${cy}" r="${s * 2.6}" fill="#c49bff" opacity=".16"/><path d="M${cx} ${cy - s * 1.7} L${cx + s * .4} ${cy - s * .4} L${cx + s * 1.7} ${cy} L${cx + s * .4} ${cy + s * .4} L${cx} ${cy + s * 1.7} L${cx - s * .4} ${cy + s * .4} L${cx - s * 1.7} ${cy} L${cx - s * .4} ${cy - s * .4}Z" fill="#fbf7ff"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${s * .6}" fill="#d9cef5" opacity="${.55 + v * .45}"/>`;
  }
  const ends = Object.values(S.finished).flat().map((_, i) => { const x = 60 + i * 70, y = 22 + (i % 2) * 30; return `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#ff4f79" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="2" fill="#ff4f79"/>`; }).join('');
  return card(YOUG.sky.t, `<svg class="yg-sky" viewBox="0 0 300 86" role="img" aria-label="${esc(YOUG.sky.aria(t.walks))}"><rect width="300" height="86" rx="10" fill="#0b0620"/>${stars}${ends}</svg><span class="yg-sub">${esc(YOUG.sky.sub)}</span>`, { right: YOUG.sky.right(t.walks) });
}

function clockCard() {
  const max = Math.max(...CLOCK_HOURS);
  const bars = CLOCK_HOURS.map((v, i) => {
    const a = (i / 24) * Math.PI * 2 + Math.PI / 2, r0 = 22, r1 = r0 + (v / max) * 24 + 1, c = Math.cos(a), s = Math.sin(a);
    const col = i >= DUSK[0] && i <= DUSK[1] ? '#f5b82e' : '#c49bff';
    return `<line x1="${50 + c * r0}" y1="${50 + s * r0}" x2="${50 + c * r1}" y2="${50 + s * r1}" stroke="${col}" stroke-width="3.4" stroke-linecap="round" opacity="${v ? 1 : .2}"/>`;
  }).join('');
  return card(YOUG.clock.t, `<span class="yg-clock"><svg viewBox="0 0 100 100" role="img" aria-label="${esc(YOUG.clock.sub)}"><circle cx="50" cy="50" r="18" fill="#1a0b3d" stroke="#46337e"/>${bars}<text x="50" y="10" class="yg-tx" text-anchor="middle">${esc(YOUG.clock.noon)}</text><text x="50" y="97" class="yg-tx" text-anchor="middle">${esc(YOUG.clock.midnight)}</text></svg><span><b>${esc(YOUG.clock.line)}</b><small>${esc(YOUG.clock.sub)}</small></span></span>`);
}

function flowerCard() {
  const made = Object.fromEntries(GEM_TYPES.map((k) => [k, S.gems.filter((g) => g.mine && g.type === k).length]));
  const found = Object.fromEntries(GEM_TYPES.map((k) => [k, S.gems.filter((g) => g.found && g.type === k).length]));
  const max = Math.max(1, ...GEM_TYPES.map((k) => made[k] + found[k]));
  const petals = GEM_TYPES.map((k, i) => {
    const a = (i / GEM_TYPES.length) * 360 - 90, lm = 8 + (made[k] / max) * 30, lv = 8 + ((made[k] + found[k]) / max) * 30, rad = (a * Math.PI) / 180;
    const ix = 50 + Math.cos(rad) * (lv + 7), iy = 50 + Math.sin(rad) * (lv + 7);
    return `<g transform="rotate(${a} 50 50)"><ellipse cx="${50 + lv / 2}" cy="50" rx="${lv / 2}" ry="6" fill="none" stroke="${gemCol(k)}" stroke-width="1" stroke-dasharray="2 1.6"/><ellipse cx="${50 + lm / 2}" cy="50" rx="${lm / 2}" ry="5" fill="${gemCol(k)}" opacity=".85"/></g><g transform="translate(${ix - 6} ${iy - 6})">${gemSvg(k, 12)}</g>`;
  }).join('');
  const top = GEM_TYPES.slice().sort((a, b) => made[b] - made[a])[0];
  const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  const cheers = S.gems.filter((g) => g.mine).reduce((a, g) => a + (g.cheers || 0), 0);
  return card(YOUG.flower.t, `${sum(made) ? `<span class="yg-club">${esc(YOUG.flower.club(GEMS.types[top].name))}</span>` : ''}<span class="yg-flower"><svg viewBox="0 0 100 100" role="img" aria-label="${esc(YOUG.flower.t)}">${petals}<circle cx="50" cy="50" r="4" fill="#fbf7ff"/></svg>
    <span class="yg-stat"><span><b>${sum(made)}</b> ${esc(YOUG.flower.made)} <i class="k-solid"></i></span><span><b>${sum(found)}</b> ${esc(YOUG.flower.found)} <i class="k-dash"></i></span><span><b>${cheers}</b> ${esc(YOUG.flower.cheers)}</span></span></span>`, { tab: 'map' });
}

function storiesCard() {
  const rows = Object.entries(S.progress).map(([id, p]) => `<span class="yg-srow"><b>${esc(byId[id].title)}</b><span class="yg-meter"><i style="width:${Math.round(p.ch / p.of * 100)}%"></i></span><small>${esc(YOUG.stories.ch(p.ch, p.of))}</small></span>`);
  const fin = Object.entries(S.finished).map(([id, e]) => `<span class="yg-srow"><b>${esc(byId[id].title)}</b><span class="yg-pips">${Array.from({ length: byId[id].endings || 1 }, (_, i) => `<i class="${i < e.length ? 'on' : ''}"></i>`).join('')}</span><small>${esc(LIBRARY.endings(e.length, byId[id].endings))}</small></span>`);
  return card(YOUG.stories.t, rows.concat(fin).join('') || `<span class="yg-sub">${esc(YOUG.stories.none)}</span>`, { go: 'you-all', p: '{"which":"stories"}' });
}

function progressCards(t) {
  return [patchCard(), farCard(t), weekCard(t), skyCard(t), clockCard(), flowerCard(), storiesCard()];
}

function collectionItems() {
  const items = [];
  S.gems.filter((g) => g.mine || g.found).forEach((g) => items.push({ kind: 'gem', html: `<button class="yg-gem" data-go="gem-view" data-p='{"id":"${g.id}"}' style="--gc:${gemCol(g.type)}"><span class="yg-gem-art">${gemSvg(g.type, 44)}</span><b>${esc(g.name)}</b><small>${esc(g.found && !g.mine ? YOUG.coll.found : GEMS.who[g.vis || 'me']?.t || '')}</small></button>` }));
  if (S.seals) items.splice(1, 0, { kind: 'seal', html: `<button class="yg-seal" data-go="whimsy"><span class="yg-seal-n">${S.seals}<small>/7</small></span><b>${esc(YOUG.coll.seals)}</b></button>` });
  Object.keys(S.finished).forEach((id) => items.push({ kind: 'badge', html: `<span class="yg-badge"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3l14 8v18l-14 8-14-8V11z" fill="${byId[id].accent}" fill-opacity=".25" stroke="${byId[id].accent}" stroke-width="1.6"/></svg><b>${esc(byId[id].title)}</b></span>` }));
  for (let i = 0; i < Math.min(S.postcards, ROUTES.length); i++) items.push({ kind: 'postcard', html: `<button class="yg-post" data-go="postcard" data-p='{"id":"summons"}'><svg viewBox="0 0 64 50" aria-hidden="true"><rect width="64" height="50" rx="4" fill="#1a0b3d"/><path d="${ROUTES[i]}" fill="none" stroke="#c49bff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="0 .06 .88 .06"/></svg><b>${esc(i ? YOUG.coll.walk(i) : 'The Summons')}</b></button>` });
  items.push({ kind: 'stamp', html: `<span class="yg-stamp ghosted"><span><b>${esc(YOUG.coll.passport)}</b><small>${esc(YOUG.coll.passportSub)}</small></span></span>` });
  return items;
}

function historyItems() {
  const today = S.stepsToday ? [{ label: YOUG.hist.today, steps: S.stepsToday, walked: S.stepsToday >= 500, story: S.lastStory }] : [];
  const past = S.hist.map((h, i) => ({ label: i === 0 ? YOUG.hist.yesterday : YOUG.hist.ago(i + 1), steps: h.steps, walked: h.walked, away: h.away }));
  return today.concat(past).map((h, i) => `<span class="yg-walk"><svg viewBox="0 0 64 50" aria-hidden="true"><rect width="64" height="50" rx="4" fill="#1a0b3d"/>${h.walked ? `<path d="${ROUTES[i % ROUTES.length]}" fill="none" stroke="#c49bff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="0 .06 .88 .06"/>` : `<circle cx="32" cy="25" r="3" fill="#46337e"/>`}</svg>
    <span><small>${esc(h.label)}</small><b>${esc(h.away ? YOUG.hist.away : h.walked ? (h.story && byId[h.story] ? YOUG.hist.storyWalk(byId[h.story].title) : YOUG.hist.walk) : YOUG.hist.quiet)}</b><span class="yg-bits">${h.steps ? `<i>${n0(h.steps)} ${esc(YOUG.week.steps)}</i>` : ''}${h.walked ? `<i>${esc(YOUG.hist.fog)}</i>` : ''}</span></span></span>`);
}

function rail(id, title, sub, slides, cls) {
  return `<section class="yg-rail"><div class="yg-railh"><span><b>${esc(title)}</b><small>${esc(sub)}</small></span><button class="yg-all" data-go="you-all" data-p='{"which":"${id}"}'>${esc(YOUG.seeAll)} ${ic('chev')}</button></div>
    <div class="yg-track ${cls}" data-ygtrack="${id}">${slides.map((s) => `<div class="yg-slide">${s}</div>`).join('')}<button class="yg-slide yg-more" data-go="you-all" data-p='{"which":"${id}"}'>${esc(YOUG.seeAll)}<small>${slides.length}</small></button></div>
    <div class="yg-dots" data-ygdots="${id}" aria-hidden="true">${slides.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div></section>`;
}

export function youGalleries() {
  const t = totals();
  const strip = `<div class="yg-strip">${[[t.km.toFixed(1), YOUG.strip.km], [t.walks, YOUG.strip.walks], [t.chapters, YOUG.strip.chapters], [t.gems, YOUG.strip.gems]].map(([n, l]) => `<span><b>${esc(n)}</b><small>${esc(l)}</small></span>`).join('')}</div>`;
  const coll = collectionItems();
  return `${strip}
    ${rail('progress', YOUG.progress.t, YOUG.progress.sub, progressCards(t), 'yg-wide')}
    ${rail('collections', YOUG.collections.t, YOUG.collections.sub, coll.slice(0, PREVIEW).map((c) => `<div class="yg-item"><span class="yg-kind k-${c.kind}">${esc(YOUG.kinds[c.kind])}</span>${c.html}</div>`), 'yg-small')}
    ${rail('history', YOUG.history.t, YOUG.history.sub, historyItems().slice(0, 4), 'yg-wide')}
    ${src('You as three swipeable galleries, newest first, See all opens everything — Melissa, Nov 26 (The Stash, version E)')}`;
}

reg('you-all', {
  tab: 'you',
  html(p) {
    const t = totals();
    const head = (title) => `<header class="slim">${backBtn()}<div><b>${esc(title)}</b><span>${esc(YOU.names[O.youName])}</span></div></header>`;
    if (p.which === 'progress') return `${head(YOUG.progress.t)}<div class="yg-allpad">${progressCards(t).join('')}</div><div class="tabpad"></div>`;
    if (p.which === 'stories') return `${head(YOUG.stories.t)}<div class="yg-allpad">${storiesCard()}</div><div class="tabpad"></div>`;
    if (p.which === 'collections') {
      const items = collectionItems();
      return `${head(YOUG.collections.t)}<div class="yg-allpad">${YOUG.groups.map(([k, l]) => { const list = items.filter((c) => c.kind === k); return list.length ? `<p class="kicker section">${esc(l)} · ${list.length}</p><div class="yg-grid">${list.map((c) => `<div class="yg-item">${c.html}</div>`).join('')}</div>` : ''; }).join('')}</div><div class="tabpad"></div>`;
    }
    return `${head(YOUG.history.t)}<div class="yg-allpad">${historyItems().join('')}</div><div class="tabpad"></div>`;
  },
});

document.addEventListener('scroll', (e) => {
  const tr = e.target;
  if (!tr.dataset || !tr.dataset.ygtrack) return;
  const slides = [...tr.children].filter((c) => !c.classList.contains('yg-more'));
  const step = slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : 1;
  const i = Math.min(slides.length - 1, Math.round(tr.scrollLeft / step));
  document.querySelectorAll(`[data-ygdots="${tr.dataset.ygtrack}"] i`).forEach((d, k) => d.classList.toggle('on', k === i));
}, true);
