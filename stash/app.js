import * as W from './words.js';
import { NOTES } from './notes.js';

const params = new URLSearchParams(location.search);
const startV = (params.get('v') || location.hash.slice(1) || 'a').toLowerCase();

const S = {
  v: W.VERSIONS[startV] ? startV : 'a',
  tab: 'stash',
  stack: ['home'],
  seg: 'public',
  toSort: W.FINDS.length,
  sortIdx: 0,
  kept: 12,
};

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const ICON = {
  back: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg class="ic ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  gear: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  today: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>',
  map: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
  library: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h4v15H4zM10 5h4v15h-4z"/><path d="M16 6l3.5-1 3 14-3.5 1z"/></svg>',
  stash: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 11c0-4 4-6 9-6s9 2 9 6z"/><rect x="3" y="11" width="18" height="9" rx="1.5"/><rect x="10" y="9.5" width="4" height="4.5" rx="1"/></svg>',
  heart: '<svg class="ic ic-s" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
};

function chestArt(n) {
  const types = ['nature', 'art', 'landmarks', 'eat-drink', 'curiosities'];
  const shown = Math.max(1, Math.min(5, Math.round(n / 3)));
  const gems = types.slice(0, shown).map((t, i) =>
    `<image href="img/gem-${t}.svg" x="${22 + i * 16}" y="${16 + (i % 2) * 5}" width="22" height="22"/>`).join('');
  return `<svg class="chest" viewBox="0 0 120 90" role="img" aria-label="Your chest, ${n} gems inside">
    <defs><radialGradient id="glowG" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#c49bff" stop-opacity=".55"/><stop offset="1" stop-color="#c49bff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="60" cy="34" rx="58" ry="30" fill="url(#glowG)"/>
    <path d="M20 32 L26 6 H94 L100 32 Z" fill="#2a1658" stroke="#c49bff" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M38 6 L36 32 M82 6 L84 32" stroke="#46337e" stroke-width="2"/>
    <rect x="14" y="30" width="92" height="12" fill="#0b0620"/>
    ${gems}
    <rect x="14" y="38" width="92" height="44" rx="6" fill="#1a0b3d" stroke="#c49bff" stroke-width="1.5"/>
    <path d="M34 38v44M86 38v44" stroke="#46337e" stroke-width="3"/>
    <rect x="52" y="44" width="16" height="18" rx="3" fill="#f5b82e"/>
    <circle cx="60" cy="52" r="2.4" fill="#1a0b3d"/>
  </svg>`;
}

function topbar(title, opts = {}) {
  const back = S.stack.length > 1 ? `<button class="icon-btn" data-act="back" aria-label="Back">${ICON.back}</button>` : '<span class="icon-spacer"></span>';
  const right = opts.gear ? `<button class="icon-btn" data-go="settings" aria-label="Settings">${ICON.gear}</button>` : '<span class="icon-spacer"></span>';
  return `<div class="topbar">${back}<h1>${esc(title)}</h1>${right}</div>`;
}

function tile(c) {
  const badge = c.id === 'gems' && S.toSort ? `<span class="dot" aria-label="${S.toSort} to sort"></span>` : '';
  const sub = c.id === 'gems' ? `${S.kept} kept${S.toSort ? ` · ${S.toSort} to sort` : ''}` : c.sub;
  return `<button class="tile" data-go="${c.id}" style="--accent:${c.accent}">
    <span class="tile-t">${esc(c.title)}${badge}</span><span class="tile-s">${esc(sub)}</span></button>`;
}

function home() {
  const comps = W.COMPARTMENTS.filter(c => S.v !== 'b' || c.id !== 'gems');
  const hop = S.v === 'b'
    ? `<button class="hop" data-tab="gem"><span class="hop-gems">${W.GEM_TYPES.slice(0, 3).map(g => `<img src="img/gem-${g.id}.svg" alt="">`).join('')}</span>
        <span class="hop-t">Your gems are in the Gem Hub<small>${S.kept} kept${S.toSort ? ` · ${S.toSort} to sort` : ''}</small></span>${ICON.next}</button>`
    : '';
  return `${topbar('', { gear: true })}
  <div class="hero">
    ${chestArt(S.kept)}
    <h2 class="balance">${esc(W.PLAYER.name)}’s Stash</h2>
    <button class="chip chip-member" data-go="settings">${esc(W.PLAYER.status)}</button>
    <p class="week balance">${esc(W.PLAYER.week)}</p>
  </div>
  ${hop}
  <div class="tiles">${comps.map(tile).join('')}</div>
  <div class="rows">${W.ROWS.map(r => `<button class="row" data-go="${r.id === 'settings' ? 'settings' : ''}" data-toast="${r.id === 'settings' ? '' : esc(r.title) + ' (mockup)'}"><span><b>${esc(r.title)}</b><small>${esc(r.sub)}</small></span>${ICON.next}</button>`).join('')}</div>`;
}

function polaroid(g) {
  return `<figure class="pol"><img src="img/${g.img}" alt=""><figcaption><img class="gt" src="img/gem-${g.type}.svg" alt=""><span>${esc(g.title)}${g.by ? `<small>${esc(g.by)}</small>` : ''}</span>${g.likes ? `<em>${ICON.heart}${g.likes}</em>` : ''}</figcaption></figure>`;
}

function gemsBody() {
  const f = W.FINDS[S.sortIdx % W.FINDS.length];
  const sorter = S.toSort
    ? `<div class="sorter">
        <p class="label">Finds to sort · ${S.toSort} left</p>
        <figure class="pol pol-big"><img src="img/${f.img}" alt=""><figcaption><span>${esc(f.title)}<small>${esc(f.where)}</small></span></figcaption></figure>
        <div class="sort-btns">
          <button class="btn btn-hide" data-sort="hidden">Keep Hidden</button>
          <button class="btn btn-pub" data-sort="public">Publish</button>
          <button class="btn btn-del" data-sort="delete">Delete</button>
        </div>
        <p class="hint balance">In Victoria's hub this is press, hold and swipe. Buttons here for clicking through.</p>
      </div>`
    : `<p class="sorted balance">All finds sorted. Snap a new one with + Gem.</p>`;
  const segs = S.v === 'c' ? ['public', 'hidden', 'liked'] : ['public', 'hidden', 'liked', 'nearby'];
  const segLabel = { public: 'Public', hidden: 'Hidden', liked: 'Liked', nearby: 'Nearby' };
  const note = S.seg === 'nearby' && S.v !== 'b'
    ? '<p class="reviewer balance">Other people’s gems. Option C moves these to the Map.</p>' : '';
  const sum = `<div class="gem-types">${W.GEM_TYPES.map(g => `<span><img src="img/gem-${g.id}.svg" alt="">${g.n}<small>${esc(g.label)}</small></span>`).join('')}</div>`;
  return `${sorter}${sum}
    <div class="seg" role="tablist">${segs.map(s => `<button role="tab" aria-selected="${S.seg === s}" data-seg="${s}">${segLabel[s]}</button>`).join('')}</div>
    ${note}
    <div class="grid">${W.GEMS[S.seg].map(polaroid).join('')}</div>
    ${S.v === 'c' ? `<button class="hop hop-map" data-tab="map">${ICON.map}<span class="hop-t">Gems other people found<small>Nearby gems are on the Map</small></span>${ICON.next}</button>` : ''}`;
}

function gemsScreen() { return `${topbar('Gems')}<div class="pad">${gemsBody()}</div>`; }

function gemHub() {
  return `${topbar('Gem Hub')}
  <div class="pad">
    <button class="snap" data-act="snap"><span class="snap-ring">${ICON.camera}</span><span class="balance">Take a snapshot gem of <b>a park bench</b></span></button>
    ${gemsBody()}
  </div>`;
}

function captureOnly() {
  return `${topbar('New Gem')}
  <div class="pad capture">
    <button class="snap" data-act="snap"><span class="snap-ring">${ICON.camera}</span><span class="balance">Take a snapshot gem of <b>a park bench</b></span></button>
    <p class="balance muted">Snap it and keep walking. It waits in your Stash to sort later.</p>
    <button class="btn btn-ghost" data-tab="stash" data-then="gems">Open My Gems</button>
  </div>`;
}

function storyRow(s) {
  return `<div class="srow"><img src="img/${s.img}" alt=""><span><b>${esc(s.title)}</b>${s.line ? `<small>${esc(s.line)}</small>` : ''}</span></div>`;
}
function stories() {
  return `${topbar('My Stories')}<div class="pad">
    <p class="label">In progress</p>${W.STORIES.progress.map(storyRow).join('')}
    <p class="label">Wish List</p>${W.STORIES.wish.map(storyRow).join('')}
    <p class="label">Finished</p>${W.STORIES.finished.map(storyRow).join('')}
    <p class="label">Made by me</p><p class="muted balance">Stories you write show here. Want to make one?</p>
  </div>`;
}

function emblem(b) {
  return `<div class="emb ${b.got ? '' : 'emb-off'}" style="--c:${b.c}"><svg viewBox="0 0 40 40"><path d="M20 3l14 8v18l-14 8-14-8V11z" fill="${b.got ? 'var(--c)' : 'none'}" fill-opacity=".25" stroke="var(--c)" stroke-width="1.6" ${b.got ? '' : 'stroke-dasharray="3 3"'}/></svg><span>${esc(b.t)}</span>${b.how ? `<small>${esc(b.how)}</small>` : ''}</div>`;
}
function badges() {
  return `${topbar('Badges & Stamps')}<div class="pad">
    <p class="label">Badges</p><div class="embs">${W.BADGES.map(emblem).join('')}</div>
    <p class="label">Passport stamps</p><div class="stamps">${W.STAMPS.map(s => `<span class="stamp ${s.got ? '' : 'stamp-off'}">${esc(s.city)}</span>`).join('')}</div>
  </div>`;
}

function steps() {
  const max = Math.max(...W.STEPS.days);
  const d = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return `${topbar('Steps')}<div class="pad">
    <p class="big">${W.STEPS.week}<small>steps this week</small></p>
    <div class="bars">${W.STEPS.days.map((v, i) => `<span><i style="height:${v ? Math.max(6, v / max * 100) : 2}%"></i><small>${d[i]}</small></span>`).join('')}</div>
    <div class="split"><span><b>${W.STEPS.story}</b><small>in stories</small></span><span><b>${W.STEPS.everyday}</b><small>everyday</small></span></div>
    <p class="muted balance">Daily goal ${W.STEPS.goal.toLocaleString()}. Quiet days are just quiet. No streaks here.</p>
  </div>`;
}

function friends() {
  return `${topbar('Friends')}<div class="pad">
    <div class="code"><span>Your code</span><b>${W.FRIENDS.code}</b><button class="btn btn-ghost" data-toast="Share My Code (mockup)">Share</button></div>
    ${W.FRIENDS.list.map(f => `<div class="frow"><span class="av">${esc(f.name[0])}</span><span><b>${esc(f.name)}</b><small>${esc(f.line)}</small></span>${f.ask ? '<button class="btn btn-pub" data-toast="Jess added">Accept</button>' : ''}</div>`).join('')}
    <button class="btn btn-ghost wide" data-toast="Add a Friend (mockup)">Add a Friend</button>
  </div>`;
}

function journal() {
  return `${topbar('Walk Journal')}<div class="pad">${W.JOURNAL.map(j => `<div class="jrow"><b>${esc(j.day)}</b><span>${esc(j.line)}</span></div>`).join('')}</div>`;
}

function settings() {
  return `${topbar('Settings')}<div class="pad rows rows-flat">${W.SETTINGS.map(([t, s]) => `<button class="row" data-toast="${esc(t)} (mockup)"><span><b>${esc(t)}</b>${s ? `<small>${esc(s)}</small>` : ''}</span>${ICON.next}</button>`).join('')}</div>`;
}

function standIn(tab) {
  if (tab === 'library') {
    return `${topbar('Library')}<div class="pad"><p class="muted balance">Library becomes every story you can walk. Your own stories move to the Stash.</p>
      ${[...W.STORIES.progress, ...W.STORIES.wish, ...W.STORIES.finished].map(storyRow).join('')}</div>`;
  }
  const t = { today: 'Today', map: 'Map' }[tab];
  const where = tab === 'map' && S.v === 'a' ? ' Nearby gems are in Stash → Gems in this version.' : tab === 'map' && S.v === 'b' ? ' Nearby gems are in the Gem Hub in this version.' : '';
  return `${topbar(t)}<div class="pad"><p class="muted balance">${t} is a stand-in here. See Everyday Story City for the full ${t} tab.${where}</p></div>`;
}

function mapNearby() {
  const pins = W.NEARBY_PINS.map(p => `<image href="img/gem-${p.type}.svg" x="${p.x - 4}" y="${p.y - 4}" width="8" height="8"/>`).join('');
  return `${topbar('Map')}
  <div class="pad">
    <svg class="minimap" viewBox="0 0 100 90" role="img" aria-label="Map with five gems near you">
      <rect width="100" height="90" rx="6" fill="#1a0b3d"/>
      <path d="M0 62 C25 54 40 74 60 66 S90 50 100 56" stroke="#1b3fa8" stroke-width="6" fill="none" opacity=".7"/>
      <path d="M0 24 H100 M0 44 H100 M22 0 V90 M52 0 V90 M80 0 V90" stroke="#46337e" stroke-width="1.6"/>
      <rect x="60" y="74" width="18" height="12" rx="3" fill="#00cd9d" opacity=".18"/>
      <circle cx="50" cy="45" r="14" fill="#c49bff" opacity=".12"/>
      <circle cx="50" cy="45" r="2.6" fill="#fbf7ff" stroke="#c49bff" stroke-width="1"/>
      ${pins}
    </svg>
    <p class="label">Gems near you</p>
    <div class="grid">${W.GEMS.nearby.map(polaroid).join('')}</div>
    <p class="reviewer balance">C: other people’s gems live here. Your own are in Stash → Gems.</p>
  </div>`;
}

const SCREENS = { home, gems: gemsScreen, stories, badges, steps, friends, journal, settings };

function render() {
  const notes = S.v === 'notes';
  $('phone').hidden = notes;
  $('notes').hidden = !notes;
  $('versionPick').innerHTML = Object.entries(W.VERSIONS).map(([k, v]) =>
    `<button role="tab" aria-selected="${S.v === k}" data-v="${k}">${esc(v.label)}${v.name ? `<span class="vn"> · ${esc(v.name)}</span>` : ''}</button>`).join('');
  $('versionNote').textContent = W.VERSIONS[S.v].note;
  if (notes) { $('notes').innerHTML = NOTES; return; }

  let html;
  if (S.tab === 'stash') html = (SCREENS[S.stack.at(-1)] || home)();
  else if (S.tab === 'gem') html = S.v === 'b' ? gemHub() : captureOnly();
  else html = S.tab === 'map' && S.v === 'c' ? mapNearby() : standIn(S.tab);
  $('screen').innerHTML = html;
  $('screen').scrollTop = 0;

  $('tabs').innerHTML = W.TABS.map(t => {
    if (t.id === 'gem') return `<button class="tab tab-gem" data-tab="gem" aria-label="${S.v === 'b' ? 'Gem Hub' : 'New Gem'}" aria-current="${S.tab === 'gem'}"><span>+</span></button>`;
    const dot = t.id === 'stash' && S.v !== 'b' && S.toSort ? '<i class="tab-dot"></i>' : '';
    return `<button class="tab" data-tab="${t.id}" aria-current="${S.tab === t.id}">${ICON[t.id]}${dot}<small>${t.label}</small></button>`;
  }).join('');
}

let toastT;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 1800);
}

function setVersion(v) {
  S.v = v; S.tab = 'stash'; S.stack = ['home'];
  const u = new URL(location.href); u.searchParams.set('v', v); history.replaceState(null, '', u);
  render();
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  const d = b.dataset;
  if (d.v) return setVersion(d.v);
  if (d.tab) {
    S.tab = d.tab; S.stack = d.then ? ['home', d.then] : ['home']; S.seg = 'public';
    return render();
  }
  if (d.go) { S.tab = 'stash'; S.stack.push(d.go); return render(); }
  if (d.act === 'back') { S.stack.pop(); return render(); }
  if (d.seg) { S.seg = d.seg; return render(); }
  if (d.sort) {
    S.toSort -= 1; S.sortIdx += 1;
    if (d.sort !== 'delete') S.kept += 1;
    toast({ hidden: 'Kept hidden. Only you can see it.', public: 'Published. It’s on the map for others.', delete: 'Deleted.' }[d.sort]);
    return render();
  }
  if (d.act === 'snap') {
    S.toSort += 1;
    toast(S.v === 'b' ? 'Snapped. It’s at the top of your finds.' : 'Snapped. It’s waiting in Stash → Gems.');
    return render();
  }
  if (d.toast) toast(d.toast);
});

render();
