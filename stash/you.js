// Version D: the You tab with data displays. All words come from words.js (YOU).
import * as W from './words.js';

const Y = W.YOU;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const GEM_COLOR = { nature: '#00cd9d', art: '#5b8cff', landmarks: '#f5b82e', 'eat-drink': '#ff4f79', curiosities: '#b36bff' };
const SKY_SEED = 7;
const STORY_SHARE = [0.4, 0.6, 0, 0, 0.5, 0.3, 0.2];

function seeded(n) {
  let x = n;
  return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
}

function card(title, body, opts = {}) {
  const tag = opts.go ? `button class="ycard ycard-tap" data-go="${opts.go}"` : opts.tab ? `button class="ycard ycard-tap" data-tab="${opts.tab}"` : 'section class="ycard"';
  const close = tag.startsWith('button') ? 'button' : 'section';
  return `<${tag}><span class="ycard-h"><b>${esc(title)}</b>${opts.right ? `<small>${esc(opts.right)}</small>` : ''}</span>${body}</${close}>`;
}

function patch() {
  const walked = [
    'M10 52 C22 48 30 40 40 38 S58 30 70 34',
    'M40 38 L40 14 L62 14',
    'M70 34 C78 40 84 50 92 52',
    'M22 60 L22 44',
  ];
  const glows = [['#00cd9d', 64, 15], ['#f5b82e', 86, 22], ['#5b8cff', 26, 20], ['#b36bff', 78, 60]];
  return `<svg class="ypatch" viewBox="0 0 100 70" role="img" aria-label="${esc(Y.patch.line)}">
    <defs>
      <filter id="yFog" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="4"/>
        <feColorMatrix values="0 0 0 0 .17  0 0 0 0 .1  0 0 0 0 .36  0 0 0 -1.1 1.25"/>
      </filter>
      <filter id="yBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
      <mask id="yClear"><rect width="100" height="70" fill="#fff"/>
        <g stroke="#000" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#yBlur)">${walked.map(d => `<path d="${d}"/>`).join('')}</g>
      </mask>
    </defs>
    <rect width="100" height="70" fill="#1a0b3d"/>
    <path d="M0 26 C30 20 50 30 100 22" stroke="#1b3fa8" stroke-width="5" fill="none" opacity=".7"/>
    <path d="M0 14 H100 M0 38 H100 M0 52 H100 M22 0 V70 M40 0 V70 M62 0 V70 M84 0 V70" stroke="#46337e" stroke-width="1.2"/>
    <rect x="44" y="42" width="14" height="8" rx="2" fill="#00cd9d" opacity=".25"/>
    ${glows.map(([c, x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${c}" filter="url(#yBlur)"/>`).join('')}
    <g mask="url(#yClear)"><rect width="100" height="70" fill="#130828" opacity=".9"/><rect width="100" height="70" filter="url(#yFog)"/></g>
    <g fill="none" stroke="#c49bff" stroke-width=".7" stroke-dasharray="1.4 1.6" opacity=".8">${walked.map(d => `<path d="${d}"/>`).join('')}</g>
    <circle cx="16" cy="56" r="7" fill="#c49bff" opacity=".35" filter="url(#yBlur)"/>
  </svg>
  <div class="ymeter"><i style="width:${Y.patch.pct}%"></i></div>
  <p class="yline">${esc(Y.patch.line)}</p><p class="muted balance">${esc(Y.patch.sub)}</p>`;
}

function trail() {
  const end = Y.trail.stops.at(-1)[1];
  const x = km => 30 + (km / end) * 240;
  const road = 'M30 40 C70 22 95 56 145 38 S220 22 270 40';
  const done = Y.trail.km / end;
  const me = x(Y.trail.km);
  return `<svg class="ytrail" viewBox="0 0 300 74" role="img" aria-label="${esc(Y.trail.line)}">
    <path d="${road}" stroke="#46337e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="${road}" stroke="url(#yTrailG)" stroke-width="4" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="${done} 1"/>
    <defs><linearGradient id="yTrailG"><stop offset="0" stop-color="#5b8cff"/><stop offset="1" stop-color="#c49bff"/></linearGradient></defs>
    ${Y.trail.stops.map(([n, km], i) => `<g><circle cx="${x(km)}" cy="${i % 2 ? 62 : 14}" r="0"/><text x="${x(km)}" y="${i % 2 ? 68 : 12}" text-anchor="middle" class="ytx">${esc(n)}</text></g>`).join('')}
    <circle cx="${me}" cy="39" r="6" fill="#fbf7ff" stroke="#c49bff" stroke-width="2.5"/>
  </svg>
  <p class="yline">${esc(Y.trail.line)}</p><p class="muted">${esc(Y.trail.kid)}</p>`;
}

function sky() {
  const r = seeded(SKY_SEED);
  let stars = '';
  for (let i = 0; i < Y.sky.walks; i++) {
    const v = r();
    const cx = 10 + r() * 280, cy = 8 + r() * 80;
    const s = 1.4 + v * 3.4;
    const big = v > 0.75;
    stars += big
      ? `<circle cx="${cx}" cy="${cy}" r="${s * 2.6}" fill="#c49bff" opacity=".16"/><path d="M${cx} ${cy - s * 1.7} L${cx + s * .4} ${cy - s * .4} L${cx + s * 1.7} ${cy} L${cx + s * .4} ${cy + s * .4} L${cx} ${cy + s * 1.7} L${cx - s * .4} ${cy + s * .4} L${cx - s * 1.7} ${cy} L${cx - s * .4} ${cy - s * .4}Z" fill="#fbf7ff"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${s * .6}" fill="#d9cef5" opacity="${.55 + v * .45}"/>`;
  }
  const ends = Y.sky.endings.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#ff4f79" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="2" fill="#ff4f79"/>`).join('');
  return `<svg class="ysky" viewBox="0 0 300 96" role="img" aria-label="${Y.sky.walks} walks as stars">
    <rect width="300" height="96" rx="10" fill="#0b0620"/>${stars}${ends}</svg>
  <p class="muted balance">${esc(Y.sky.sub)}</p>`;
}

function week() {
  const days = W.STEPS.days, max = Math.max(...days);
  const d = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return `<div class="bars ybars">${days.map((v, i) => {
    const h = v ? Math.max(6, v / max * 100) : 2;
    return `<span><i style="height:${h}%"><em style="height:${STORY_SHARE[i] * 100}%"></em></i><small>${d[i]}</small></span>`;
  }).join('')}</div>
  <div class="ykey"><span><i class="k-story"></i>${W.STEPS.story} ${esc(Y.week.story)}</span><span><i class="k-every"></i>${W.STEPS.everyday} ${esc(Y.week.everyday)}</span></div>`;
}

function clock() {
  const h = Y.clock.hours, max = Math.max(...h);
  const bars = h.map((v, i) => {
    const a = (i / 24) * Math.PI * 2 + Math.PI / 2;
    const r0 = 22, r1 = r0 + (v / max) * 26 + 1;
    const c = Math.cos(a), s = Math.sin(a);
    const col = i >= 17 && i <= 20 ? '#f5b82e' : '#c49bff';
    return `<line x1="${50 + c * r0}" y1="${50 + s * r0}" x2="${50 + c * r1}" y2="${50 + s * r1}" stroke="${col}" stroke-width="3.6" stroke-linecap="round" opacity="${v ? 1 : .2}"/>`;
  }).join('');
  return `<div class="yclock"><svg viewBox="0 0 100 100" role="img" aria-label="${esc(Y.clock.sub)}">
    <circle cx="50" cy="50" r="18" fill="#1a0b3d" stroke="#46337e"/>
    ${bars}
    <text x="50" y="12" class="ytx" text-anchor="middle">noon</text><text x="50" y="94" class="ytx" text-anchor="middle">midnight</text>
    <text x="50" y="53" class="ytx ytx-b" text-anchor="middle">☾</text>
  </svg><span><b>${esc(Y.clock.line)}</b><small>${esc(Y.clock.sub)}</small></span></div>`;
}

function gemFlower() {
  const types = W.GEM_TYPES;
  const max = Math.max(...types.map(t => Y.gemRings[t.id][0] + Y.gemRings[t.id][1]));
  const petals = types.map((t, i) => {
    const [made, visited] = Y.gemRings[t.id];
    const a = (i / types.length) * 360 - 90;
    const lm = 10 + (made / max) * 30, lv = 10 + ((made + visited) / max) * 30;
    const c = GEM_COLOR[t.id];
    const tip = (a * Math.PI) / 180;
    const ix = 50 + Math.cos(tip) * (lv + 7), iy = 50 + Math.sin(tip) * (lv + 7);
    return `<g transform="rotate(${a} 50 50)">
      <ellipse cx="${50 + lv / 2}" cy="50" rx="${lv / 2}" ry="6" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 1.6"/>
      <ellipse cx="${50 + lm / 2}" cy="50" rx="${lm / 2}" ry="5" fill="${c}" opacity=".8"/>
    </g><image href="img/gem-${t.id}.svg" x="${ix - 5}" y="${iy - 5}" width="10" height="10"/>`;
  }).join('');
  const sum = k => types.reduce((n, t) => n + Y.gemRings[t.id][k], 0);
  return `<p class="yclub">${esc(Y.gemWheel.club)}</p><div class="yflower"><svg viewBox="0 0 100 100" role="img" aria-label="Gems by type">${petals}<circle cx="50" cy="50" r="4" fill="#fbf7ff"/></svg>
    <ul class="ystat">
      <li><b>${sum(0)}</b> ${esc(Y.gemWheel.made)} <i class="k-solid"></i></li>
      <li><b>${sum(1)}</b> ${esc(Y.gemWheel.visited)} <i class="k-dash"></i></li>
      <li><b>${sum(2)}</b> ${esc(Y.gemWheel.liked)} ♥</li>
    </ul></div>
    <span class="ylink">${esc(Y.gemWheel.link)} ›</span>`;
}

function ripples() {
  return `<div class="yrip">${Y.ripples.list.map(g => {
    const rings = Math.min(4, Math.ceil(g.n / 10));
    return `<div><svg viewBox="0 0 60 60" role="img" aria-label="${esc(g.line)}">${Array.from({ length: rings }, (_, i) => `<circle cx="30" cy="30" r="${10 + i * 5.5}" fill="none" stroke="${GEM_COLOR[g.type]}" stroke-width="1" opacity="${.8 - i * .18}"/>`).join('')}<image href="img/gem-${g.type}.svg" x="22" y="22" width="16" height="16"/></svg><span><b>${esc(g.title)}</b><small>${esc(g.line)}</small></span></div>`;
  }).join('')}</div><p class="muted balance">${esc(Y.ripples.sub)}</p>`;
}

function postcards() {
  return `<div class="ypost">${Y.routes.map(r => `<figure><svg viewBox="0 0 64 50" role="img" aria-label="${esc(r.name)}"><rect width="64" height="50" rx="4" fill="#1a0b3d"/><path d="${r.d}" fill="none" stroke="#c49bff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="0 .06 .88 .06"/></svg><figcaption>${esc(r.name)}</figcaption></figure>`).join('')}</div>
  <p class="muted balance">${esc(Y.postcards.sub)}</p>`;
}

function shelf() {
  return Y.shelf.map(s => {
    const pct = s.ch[0] / s.ch[1] * 100;
    const ends = s.endings ? `<span class="ypips">${Array.from({ length: s.endings[1] }, (_, i) => `<i class="${i < s.endings[0] ? 'on' : ''}"></i>`).join('')} endings</span>` : `<span class="ymini">Chapter ${s.ch[0]} of ${s.ch[1]}</span>`;
    return `<div class="yshelf"><img src="img/${s.img}" alt=""><span><b>${esc(s.title)}</b><span class="ymeter ymeter-s"><i style="width:${pct}%"></i></span>${ends}</span><em>${esc(s.tag)}</em></div>`;
  }).join('');
}

function storyPath() {
  const nodes = [[50, 8], [30, 26], [70, 26], [20, 44], [42, 44], [62, 44], [82, 44], [30, 62], [56, 62], [76, 62], [20, 82], [50, 82], [80, 82]];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [4, 7], [5, 8], [6, 9], [7, 10], [8, 11], [9, 12], [4, 8]];
  const taken = new Set(['0-1', '1-3', '3-7', '7-10']);
  const lit = new Set([0, 1, 3, 7, 10]);
  const ends = [10, 11, 12];
  return `<svg class="ypath" viewBox="0 0 100 92" role="img" aria-label="${esc(Y.pathSub)}">
    ${edges.map(([a, b]) => { const on = taken.has(`${a}-${b}`); return `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="${on ? '#ff4f79' : '#46337e'}" stroke-width="${on ? 2 : 1}" ${on ? '' : 'stroke-dasharray="2 2"'}/>`; }).join('')}
    ${nodes.map(([x, y], i) => ends.includes(i)
      ? `<g><rect x="${x - 6}" y="${y - 5}" width="12" height="10" rx="2" fill="${lit.has(i) ? '#ff4f79' : '#1a0b3d'}" stroke="${lit.has(i) ? '#ff4f79' : '#46337e'}"/><text x="${x}" y="${y + 2.5}" text-anchor="middle" class="ytx ytx-b">${lit.has(i) ? '1' : '?'}</text></g>`
      : `<circle cx="${x}" cy="${y}" r="${lit.has(i) ? 3.2 : 2.4}" fill="${lit.has(i) ? '#fbf7ff' : '#2a1658'}" stroke="${lit.has(i) ? '#ff4f79' : '#46337e'}"/>`).join('')}
  </svg><p class="muted balance">${esc(Y.pathSub)}</p>`;
}

export function youHome(S, h) {
  const header = `<div class="yhead">
    <span class="yav">${esc(W.PLAYER.name[0])}</span>
    <span class="yhead-t"><h2>${esc(W.PLAYER.name)}’s Stash</h2><small>${esc(Y.since)}</small>
      <span class="yhead-chips"><button class="chip chip-member" data-go="settings">${esc(W.PLAYER.status)}</button><button class="chip" data-go="friends">${esc(Y.friendsChip)}</button></span></span>
  </div>
  <div class="yhl">${Y.headline.map(([n, l]) => `<span><b>${n}</b><small>${esc(l)}</small></span>`).join('')}</div>
  <div class="seg yseg" role="tablist">${Y.subs.map(([k, l]) => `<button role="tab" aria-selected="${S.ysub === k}" data-ysub="${k}">${esc(l)}</button>`).join('')}</div>`;

  let body = '';
  if (S.ysub === 'walks') {
    body = card(Y.patch.t, patch(), { tab: 'map' })
      + card(Y.trail.t, trail())
      + card(Y.sky.t, sky(), { right: Y.sky.right })
      + card(Y.week.t, week(), { go: 'steps', right: `${W.STEPS.week} steps` })
      + card(Y.clock.t, clock());
  } else if (S.ysub === 'finds') {
    body = card(Y.gemWheel.t, gemFlower(), { tab: 'gem' })
      + card(Y.ripples.t, ripples())
      + card(Y.badgesT, `<div class="embs embs-row">${W.BADGES.filter(b => b.got).slice(-4).reverse().map(h.emblem).join('')}</div>`, { go: 'badges', right: Y.badgesSub })
      + card(Y.postcards.t, postcards(), { right: `${Y.routes.length} of 23` });
  } else {
    body = card(Y.storiesT, shelf(), { go: 'stories' })
      + card(Y.pathT, storyPath());
  }

  const rows = `<div class="rows">${Y.rows.map(([id, t, s]) => {
    const go = ['journal', 'year', 'settings'].includes(id) ? id : '';
    return `<button class="row" data-go="${go}" data-toast="${go ? '' : esc(t) + ' (mockup)'}"><span><b>${esc(t)}</b><small>${esc(s)}</small></span>${h.ICON.next}</button>`;
  }).join('')}</div>`;

  return `${h.topbar('', { gear: true })}${header}<div class="pad ybody">${body}</div>${rows}`;
}

export function yearScreen(S, h) {
  const c = Y.year[S.yearIdx % Y.year.length];
  return `${h.topbar(Y.yearT)}<div class="pad">
    <p class="muted balance">${esc(Y.yearSub)}</p>
    <button class="yyear" data-act="yearNext"><span class="yyear-n">${S.yearIdx % Y.year.length + 1} / ${Y.year.length}</span><b>${esc(c.big)}</b><span class="balance">${esc(c.line)}</span></button>
    <button class="btn btn-ghost wide" data-toast="Share card (mockup)">Share This Card</button>
  </div>`;
}

// Version E: three swipeable galleries, each with a See all page
const G = W.GALLERY;
const PREVIEW = 6;

function routeSvg(i, cls = 'yroute') {
  if (i === null || i === undefined) return `<svg class="${cls}" viewBox="0 0 64 50" role="img" aria-label="${esc(G.indoor)}"><rect width="64" height="50" rx="4" fill="#1a0b3d"/><path d="M20 30 L32 20 L44 30 V40 H20Z" fill="none" stroke="#5b8cff" stroke-width="2" stroke-linejoin="round"/><text x="32" y="48" text-anchor="middle" class="ytx">${esc(G.indoor)}</text></svg>`;
  const r = Y.routes[i];
  return `<svg class="${cls}" viewBox="0 0 64 50" role="img" aria-label="${esc(r.name)}"><rect width="64" height="50" rx="4" fill="#1a0b3d"/><path d="${r.d}" fill="none" stroke="#c49bff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="0 .06 .88 .06"/></svg>`;
}

function progressCards() {
  return [
    [Y.patch.t, patch()],
    [Y.trail.t, trail()],
    [Y.sky.t, sky()],
    [Y.week.t, week()],
    [Y.clock.t, clock()],
    [Y.gemWheel.t, gemFlower()],
    [G.storiesCard, shelf()],
    [G.endingsCard, storyPath()],
  ];
}

function item(it, h) {
  const kind = `<span class="gk gk-${it.kind}">${esc(G.kinds[it.kind])}</span>`;
  let body = '';
  if (it.kind === 'gem') body = `<figure class="pol gpol"><img src="img/${it.img}" alt=""><figcaption><img class="gt" src="img/gem-${it.type}.svg" alt=""><span>${esc(it.title)}${it.hidden ? `<small>${esc(G.hidden)}</small>` : ''}</span></figcaption></figure>`;
  if (it.kind === 'badge') body = `<div class="gbadge">${h.emblem(W.BADGES[it.badge])}</div>`;
  if (it.kind === 'stamp') body = `<div class="gstamp"><span class="gstamp-in"><b>${esc(it.city)}</b><small>${esc(it.date)}</small></span></div>`;
  if (it.kind === 'postcard') body = `<figure class="gpost">${routeSvg(it.route, 'yroute')}<figcaption>${esc(Y.routes[it.route].name)}</figcaption></figure>`;
  return `<div class="gitem">${kind}${body}<small class="gwhen">${esc(it.when)}</small></div>`;
}

function walk(w) {
  return `<div class="gwalk">${routeSvg(w.route)}<span><small>${esc(w.day)}</small><b>${esc(w.title)}</b><span class="gbits">${w.bits.map(b => `<i>${esc(b)}</i>`).join('')}</span></span></div>`;
}

function rail(id, title, sub, slides, cls) {
  return `<section class="grail">
    <div class="grail-h"><span><b>${esc(title)}</b><small>${esc(sub)}</small></span><button class="glink" data-go="all-${id}">${esc(G.seeAll)} ›</button></div>
    <div class="gtrack ${cls}" data-track="${id}">${slides.map(sl => `<div class="gslide">${sl}</div>`).join('')}<button class="gslide gmore" data-go="all-${id}">${esc(G.seeAll)}<small>${slides.length}+</small></button></div>
    <div class="gdots" data-dots="${id}">${slides.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
  </section>`;
}

export function youGalleries(S, h) {
  const header = `<div class="yhead">
    <span class="yav">${esc(W.PLAYER.name[0])}</span>
    <span class="yhead-t"><h2>${esc(W.PLAYER.name)}’s Stash</h2><small>${esc(Y.since)}</small>
      <span class="yhead-chips"><button class="chip chip-member" data-go="settings">${esc(W.PLAYER.status)}</button><button class="chip" data-go="friends">${esc(Y.friendsChip)}</button></span></span>
  </div>
  <div class="yhl">${Y.headline.map(([n, l]) => `<span><b>${n}</b><small>${esc(l)}</small></span>`).join('')}</div>`;
  const prog = progressCards().map(([t, b]) => `<div class="ycard gcard"><span class="ycard-h"><b>${esc(t)}</b></span>${b}</div>`);
  const coll = G.items.slice(0, PREVIEW).map(it => item(it, h));
  const hist = G.walks.slice(0, 4).map(walk);
  const rows = `<div class="rows">${Y.rows.filter(([id]) => id !== 'journal').map(([id, t, s]) => {
    const go = ['year', 'settings'].includes(id) ? id : '';
    return `<button class="row" data-go="${go}" data-toast="${go ? '' : esc(t) + ' (mockup)'}"><span><b>${esc(t)}</b><small>${esc(s)}</small></span>${h.ICON.next}</button>`;
  }).join('')}</div>`;
  return `${h.topbar('', { gear: true })}${header}
    ${rail('progress', G.progress.t, G.progress.sub, prog, 'gtrack-wide')}
    ${rail('collections', G.collections.t, G.collections.sub, coll, 'gtrack-small')}
    ${rail('history', G.history.t, G.history.sub, hist, 'gtrack-mid')}
    ${rows}`;
}

export function seeAll(which, h) {
  if (which === 'progress') {
    return `${h.topbar(G.progress.t)}<div class="pad">${progressCards().map(([t, b]) => `<div class="ycard"><span class="ycard-h"><b>${esc(t)}</b></span>${b}</div>`).join('')}</div>`;
  }
  if (which === 'collections') {
    return `${h.topbar(G.collections.t)}<div class="pad">${G.groups.map(([k, l]) => {
      const list = G.items.filter(it => it.kind === k);
      return `<p class="label">${esc(l)} · ${list.length}</p><div class="gall gall-${k}">${list.map(it => item(it, h)).join('')}</div>`;
    }).join('')}</div>`;
  }
  return `${h.topbar(G.history.t)}<div class="pad">${G.walks.map(walk).join('')}</div>`;
}
