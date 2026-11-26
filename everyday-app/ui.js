// Shared pieces: story cards, shelves, tab headers, chat bubbles, the mode switch.
import { S, O, esc, ic, catOf, badgeOf, timeLabel, interLabel, byId, n0, src, MODE_COL, modeName, sparkle, gemSvg, modeState } from './core.js';
import { CARD, OVERVIEW, YOU, STEPPILL, TODAY, LIBRARY } from './words.js';
import { COVERS } from './stories.js';

const initial = (t) => (t.replace(/^(The|A|An) /, '')[0] || 'S');

export const coverOf = (s) => (s && s.id in COVERS ? `covers/${s.id}.jpg` : '');

// Local Original badge (Melissa, Nov 5; Team Option localBadge): A pin stamp, B corner ribbon, C citrine place strip.
// Shared by posters, thumbs and (if its owner wants) the overview cover: localBadge(s) returns '' for other stories.
const cityOf = (s) => String(s.city || '').split(',')[0];
const placeOf = (s) => String(s.place || '').replace(/^the /, '');
export const isLocal = (s) => !!s && s.cat === 'local';
export function localBadge(s) {
  if (!isLocal(s)) return '';
  const v = O.localBadge || 'stamp';
  const label = `${CARD.cats.four.local} · ${cityOf(s)}`;
  if (v === 'ribbon') return `<span class="lbadge lb-ribbon" role="img" aria-label="${esc(label)}"><span>Local Original</span></span>`;
  if (v === 'strip') return `<span class="lbadge lb-strip" role="img" aria-label="${esc(label)}">${ic('pin')}<span><b>Only in ${esc(cityOf(s))}</b>${placeOf(s) ? `<small>${esc(placeOf(s))}</small>` : ''}</span></span>`;
  return `<span class="lbadge lb-stamp" role="img" aria-label="${esc(label)}">${ic('pin')}<span>${esc(cityOf(s))}</span></span>`;
}
const lbCls = (s) => (isLocal(s) ? ` has-lb lbv-${O.localBadge || 'stamp'}` : '');
// small 2:3 cover for rows, doors and recs; lettered placeholder when there's no cover yet.
// A Local Original's cover is a span carrying the same thumb classes, so its badge can sit on it.
export const thumb = (s, cls = '') => (coverOf(s) ? (isLocal(s) ? `<span class="thumb lthumb ${cls}${lbCls(s)}" aria-hidden="true"><img src="${coverOf(s)}" alt="" loading="lazy">${localBadge(s)}</span>` : `<img class="thumb ${cls}" src="${coverOf(s)}" alt="" loading="lazy">`)
  : `<span class="thumb none ${cls}${lbCls(s)}" style="--jewel:${s.accent || 'var(--sapphire)'}" aria-hidden="true">${esc(initial(s.title))}${localBadge(s)}</span>`);

// Stories get the app's 2:3 poster (ExploreCard), with real cover art where there is one; the title only
// sits on the art when the cover doesn't already include it (coverIncludesTitle).
// Wish List heart on every poster (Melissa, Nov 5): a sibling of the card button (never nested), top right of the cover
export const heartBtn = (s) => { const on = S.myList.includes(s.id); return `<button class="cheart ${on ? 'on' : ''}" data-act="cardHeart" data-id="${s.id}" aria-pressed="${on}" aria-label="${esc(`${on ? OVERVIEW.hearted : OVERVIEW.heart}: ${s.title}`)}">${ic('heart')}</button>`; };
function posterCard(s, o, meta, kick, star, bar) {
  const titled = COVERS[s.id];  // undefined = no cover yet: a type-only placeholder poster
  const pic = coverOf(s) ? `<img src="${coverOf(s)}" alt="" loading="lazy">` : `<span class="ghost" aria-hidden="true">${esc(initial(s.title))}</span>`;
  const art = `<span class="art${coverOf(s) ? '' : ' none'}${lbCls(s)}" style="--jewel:${s.accent || 'var(--sapphire)'}">${pic}${titled ? '' : `<span class="ptitle">${esc(s.title)}</span>`}${localBadge(s)}${bar}</span>`;
  const label = `aria-label="${esc(s.title)}. ${esc(meta)}"`;
  const heart = s.coming ? star : heartBtn(s);
  if ((o.cls || '').includes('hero')) {
    return `<div class="pc hero"><button class="pcard hero" style="--jewel:${s.accent}" data-go="overview" data-id="${s.id}" ${label}>${art}
      <span class="side"><span class="mech">${esc(kick)}</span>${o.hook ? `<span class="hook">${esc(s.hook)}</span>` : ''}<span class="meta">${esc(meta)}</span></span></button>${heart}</div>`;
  }
  return `<div class="pc ${o.cls || ''}"><button class="pcard ${o.cls || ''}" data-go="overview" data-id="${s.id}" ${label}>${art}<span class="meta">${esc(meta)}</span></button>${heart}</div>`;
}

// square text card (whimsy-walk .walk), one story accent each; poster when there's cover art
export function storyCard(s, o = {}) {
  if (!s) return '';
  const prog = S.progress[s.id];
  const meta = o.meta || (s.coming ? CARD.coming(s.coming) : [timeLabel(s), badgeOf(s)].filter(Boolean).join(' · '));
  const kick = o.kicker || (s.coming ? 'Creator adventure' : catOf(s));
  const star = S.myList.includes(s.id) ? `<span class="star" aria-label="${esc(OVERVIEW.hearted)}">${ic('heart')}</span>` : '';
  const bar = prog ? `<span class="pbar"><i style="width:${Math.round((prog.ch - 1) / prog.of * 100)}%"></i></span>` : '';
  if (!(o.cls || '').includes('quest')) return posterCard(s, o, meta, kick, star, bar);
  return `<button class="walk ${o.cls || ''}" style="--jewel:${s.accent}" data-go="overview" data-id="${s.id}" aria-label="${esc(s.title)}. ${esc(meta)}">
    <span class="ghost" aria-hidden="true">${esc(initial(s.title))}</span>
    <span class="mech">${esc(kick)}</span>${star}
    <span class="title">${esc(s.title)}</span>
    ${o.hook ? `<span class="hook">${esc(s.hook)}</span>` : ''}
    <span class="meta">${esc(meta)}</span>${bar}
  </button>`;
}

export function shelf(title, ids, o = {}) {
  const list = ids.map((id) => (typeof id === 'string' ? byId[id] : id)).filter(Boolean);
  if (!list.length) return '';
  return `<section class="shelf-sec"><div class="shelf-head"><h2 class="kicker section">${esc(title)}</h2>${o.tip ? `<button class="tipq" data-sheet="tip" data-p='${esc(JSON.stringify({ t: o.tip }))}' aria-label="What is this?">${ic('info')}</button>` : ''}${o.right || ''}</div>
    ${o.note || ''}<div class="row-scroll">${list.map((s) => storyCard(s, o.card || {})).join('')}</div></section>`;
}

export const avatar = () => `<button class="avatar" data-go="you" aria-label="${esc(YOU.names[O.youName])}"><span>${esc(S.name[0])}</span>${S.member === 'guest' ? '<i class="dot" aria-hidden="true"></i>' : ''}</button>`;

export function tabHead(title, o = {}) {
  return `<header class="tabhead">${avatar()}<div class="th-mid">${o.kicker ? `<p class="kicker">${esc(o.kicker)}</p>` : ''}<h1 class="display th-title">${esc(title)}</h1></div>${o.right || ''}</header>`;
}

// Victoria's arched step tracker (StepGlanceArcProgress + StepGlanceTextOverlay, SC-3246): a 200° arc,
// r 80, 14 px stroke (thicker than the app's 8: Melissa, Nov 4), with a soft glow, sunk behind the tab bar; the count sits inside the arch.
const ARC = (() => {
  const pt = (a) => [120 + 80 * Math.cos(a * Math.PI / 180), 96 + 80 * Math.sin(a * Math.PI / 180)].map((v) => v.toFixed(2)).join(' ');
  return { d: `M ${pt(190)} A 80 80 0 1 1 ${pt(-10)}`, len: (200 / 360) * 2 * Math.PI * 80 };
})();
export function stepArc() {
  if (S.storyOnly) return '';
  const off = !S.perm && S.member === 'guest' && S.first;
  const ratio = off ? 0 : Math.min(1, S.stepsToday / S.goal);
  const done = ratio >= 1;
  const dash = `stroke-dasharray="${ARC.len.toFixed(1)} ${ARC.len.toFixed(1)}" stroke-dashoffset="${(ARC.len * (1 - ratio)).toFixed(1)}"`;
  const col = done ? 'var(--emerald)' : 'url(#arcGrad)';
  return `<button class="steparc ${done ? 'done' : ''}" ${off ? 'data-go="settings"' : 'data-go="you" data-p=\'{"sec":"steps"}\''} aria-label="${esc(off ? 'Steps off. Tap to enable' : STEPPILL.line(n0(S.stepsToday), n0(S.goal)))}">
    <span class="sa-bg" aria-hidden="true"></span>
    <svg viewBox="-20 -14 280 120" aria-hidden="true"><defs><linearGradient id="arcGrad" x1="40" x2="200" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F5B82E"/><stop offset="1" stop-color="#00CD9D"/></linearGradient><filter id="arcGlow" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="9"/></filter></defs>
      <path d="${ARC.d}" fill="none" stroke="#2A1658" stroke-width="14" stroke-linecap="round"/>
      ${ratio > 0 ? `<path d="${ARC.d}" fill="none" stroke="${col}" stroke-width="24" stroke-linecap="round" ${dash} filter="url(#arcGlow)" opacity=".55"/><path d="${ARC.d}" fill="none" stroke="${col}" stroke-width="14" stroke-linecap="round" ${dash}/>` : ''}
    </svg>
    <span class="sa-text">${off ? `<b>Steps off</b><small>Tap to enable</small>` : `<b>${n0(S.stepsToday)}</b><small>steps today</small>`}</span>
  </button>`;
}

export function stepPill(inline) {
  if (S.storyOnly) return '';
  if (!S.perm && S.member === 'guest' && S.first) return `<div class="${inline ? 'pill-inline' : ''}"><button class="steppill off" data-go="settings">${esc(STEPPILL.off)}</button></div>`;
  const pct = Math.min(100, Math.round(S.stepsToday / S.goal * 100));
  return `<div class="${inline ? 'pill-inline' : ''}"><button class="steppill" data-go="you" data-p='{"sec":"steps"}' aria-label="${esc(STEPPILL.line(n0(S.stepsToday), n0(S.goal)))}"><span class="sp-ring" style="--p:${pct}%"></span><b>${n0(S.stepsToday)}</b> ${esc(STEPPILL.line('', n0(S.goal)).replace(/^ /, ''))}</button></div>`;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export function weekRow() {
  const d = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const td = S.wd ?? 2;   // today's dot follows Next Day (loops build 2)
  return `<div class="weekrow" role="list" aria-label="Days you walked this week">${d.map((x, i) => `<span role="listitem" class="wd ${S.weekWalked[i] ? 'lit' : ''} ${i === td ? 'today' : ''}" aria-label="${DAYS[i]}${i === td ? ' (today)' : ''}: ${S.weekWalked[i] ? 'walked' : i > td ? 'still to come' : 'no walk'}"><i aria-hidden="true">${x}</i></span>`).join('')}</div>`;
}

export function bubble(l, i = 0) {
  if (l.who === 'narr') return `<p class="b narr" style="--i:${i}">${esc(l.t)}</p>`;
  if (l.who === 'me') return `<p class="b me" style="--i:${i}">${esc(l.t)}</p>`;
  if (l.who === 'status') return `<p class="b status" style="--i:${i}">${esc(l.t)}</p>`;
  const rain = l.who === 'rain';
  return `<div class="b char ${rain ? 'rain' : ''}" style="--i:${i}">${l.name ? `<span class="who">${esc(l.name)}${rain ? ` · <em>Rain Edition</em>` : ''}</span>` : ''}${esc(l.t)}</div>`;
}

// mode switch: Steps / Path / Hunt, greyed with a tooltip when a mode doesn't apply
export function modeSwitch(cur, s, o = {}) {
  const ms = ['walk', 'path', 'hunt'];
  return `<div class="modes" role="radiogroup" aria-label="How to unlock this chapter">${ms.map((m) => {
    const st = s ? modeState(s, m, o.way) : 'on';
    const locked = o.locked && m !== cur;
    const off = st !== 'on' || locked;
    const tip = st === 'soon' ? OVERVIEW.modeOffTip.soon : st !== 'on' ? OVERVIEW.modeOffTip[(s.offTip && s.offTip[m]) || 'none'] : locked ? o.lockTip : '';
    return `<button class="mode m-${m} ${cur === m ? 'on' : ''} ${off ? 'off' : ''}" role="radio" aria-checked="${cur === m}" style="--mc:${MODE_COL[m]}" data-act="mode" data-m="${m}" ${off ? `data-tip="${esc(tip)}" aria-disabled="true"` : ''}>${ic(m)}<span>${esc(modeName(m))}</span>${st === 'soon' ? '<small>soon</small>' : ''}</button>`;
  }).join('')}</div>`;
}

export const factsRow = (s) => {
  const F = OVERVIEW.facts;
  const parts = [];
  if (s.mins) parts.push([timeLabel(s).replace('about ', '').replace(' min', '').replace(' an episode', ''), s.episodes ? F.minEach : F.min]);
  if (s.episodes) parts.push([s.episodes.count, F.eps]);
  else if (s.chapters) parts.push([s.chapters, s.chapters === 1 ? F.chapter : F.chapters]);
  if (s.endings) parts.push([s.endings, s.endings === 1 ? F.ending : F.endings]);
  return `<div class="facts">${parts.map(([n, l]) => `<div><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}<div><b class="inter">${esc(interLabel(s))}</b><span>interactivity</span></div></div>`;
};

export const chip = (label, on, attrs = '') => `<button class="chip" aria-pressed="${!!on}" ${attrs}>${esc(label)}</button>`;
export const toggle = (id, on, label, sub = '', attrs = '') => `<label class="tg"><span class="tg-t"><b>${esc(label)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span><input type="checkbox" role="switch" data-tg="${id}" ${on ? 'checked' : ''} ${attrs}><i aria-hidden="true"></i></label>`;
export const selectRow = (id, label, opts, val, sub = '') => `<label class="selrow"><span class="tg-t"><b>${esc(label)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span><select class="field mini" data-sel="${id}">${opts.map((o) => `<option ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
export const linkRow = (label, val, go, p) => `<button class="lrow" data-go="${go}" ${p ? `data-p='${esc(JSON.stringify(p))}'` : ''}><b>${esc(label)}</b>${val ? `<span>${esc(val)}</span>` : ''}${ic('chev')}</button>`;
export const dayLabel = (i) => DAYS[i];
export const thatsToday = () => `<div class="thats">${sparkle(16, 'var(--glow)')}<p class="thats-t">${esc(TODAY.thatsToday)}</p><p class="hint centre">${esc(TODAY.thatsTodaySub)}</p></div>`;
export { gemSvg };
