// Story progress: eight ways to show how far you are in a story, on one playable phone.
// Pick a version with the letter chips (or #a … #h, or ?v=a). Tap the story's choices to move on.
const V = window.CACHE_V || '';
const { PAGE, OPTIONS, STORY } = await import('./words.js' + V);

const $ = (id) => document.getElementById(id);
const CH = STORY.ch;
let cur = 'A';
let path = [STORY.start];

// ---------------------------------------------------------------- story maths
const kids = (id) => (CH[id].choices || []).map((c) => c[1]);
const maxDepth = (id) => 1 + Math.max(0, ...kids(id).map(maxDepth));
function stats() {
  const id = path[path.length - 1];
  const n = path.length;
  const total = n - 1 + maxDepth(id);
  return { id, n, total, left: total - n, ended: !kids(id).length };
}

// ---------------------------------------------------------------- icons
const ICON = {
  window: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M12 4v16M4 12h16"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  letter: '<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M3 7l9 6 9-6"/>',
  mailbox: '<path d="M7 7h10a4 4 0 0 1 4 4v6H3v-6a4 4 0 0 1 4-4zM7 7a4 4 0 0 1 4 4v6M11 17v4M15 11h3"/>',
  stairs: '<path d="M3 20h5v-4h4v-4h4V8h5"/>',
  flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 3 2 0-2 0-4 0-6z"/>',
  sofa: '<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 11h18v6H3zM5 17v2M19 17v2"/>',
  tv: '<rect x="3" y="7" width="18" height="12" rx="1"/><path d="M8 3l4 4 4-4"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  flag: '<path d="M6 21V4M6 4h11l-2 4 2 4H6"/>',
};
const ic = (k, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

// ---------------------------------------------------------------- the eight indicators
const word = (x, one, many) => `${x} ${x === 1 ? one : many}`;

function dots(s) {   // A
  let h = '';
  for (let i = 1; i <= s.total; i++) h += `<span class="dot ${i < s.n ? 'done' : i === s.n ? 'now' : 'next'}"></span>`;
  return `<div class="ind ind-a"><div class="dots">${h}</div><p class="icap">Chapter ${s.n} of ${s.total}</p></div>`;
}

function fog(s) {   // B
  let h = '';
  for (let i = 1; i < s.n; i++) h += '<span class="dot done"></span>';
  h += '<span class="dot now"></span>';
  if (s.ended) h += `<span class="fogend">${ic('flag')}</span>`;
  else h += '<span class="dot fog1"></span><span class="dot fog2"></span><span class="dot fog3"></span><span class="fogq">?</span>';
  return `<div class="ind ind-b"><div class="dots">${h}</div><p class="icap">${s.ended ? 'The end' : 'Your path so far'}</p></div>`;
}

function bar(s) {   // C
  const pct = Math.round((s.n / s.total) * 100);
  const txt = s.ended ? 'The end' : s.left === 1 ? 'About 1 chapter left' : `About ${word(s.left, 'chapter', 'chapters')} left`;
  return `<div class="ind ind-c"><div class="track"><span class="fill" style="width:${pct}%"></span></div><p class="icap left">${txt}</p></div>`;
}

function ribbon(s) {   // D (sits on the screen edge, not in the header)
  return `<div class="ribbon" aria-hidden="true"><span style="height:${Math.round((s.n / s.total) * 100)}%"></span></div>`;
}

const POS = { c1: [14, 24], c2: [66, 24], c3: [118, 12], c4: [170, 12], c5: [222, 5], c5x: [222, 21], c3r: [118, 37], c4r: [170, 37] };
function branch(s) {   // E
  const on = new Set(path);
  let lines = '', nodes = '';
  for (const id of Object.keys(POS)) {
    for (const k of kids(id)) {
      const lit = on.has(id) && on.has(k);
      const [x1, y1] = POS[id], [x2, y2] = POS[k];
      lines += `<path d="M${x1} ${y1} L${x2} ${y2}" class="${lit ? 'lit' : 'faint'}"/>`;
    }
    const [x, y] = POS[id];
    const cls = id === s.id ? 'now' : on.has(id) ? 'lit' : 'faint';
    nodes += `<circle cx="${x}" cy="${y}" r="${id === s.id ? 5 : 3.2}" class="${cls}"/>`;
  }
  return `<div class="ind ind-e"><svg viewBox="0 0 236 44" class="tree" aria-hidden="true">${lines}${nodes}</svg><p class="icap">Your route · ${s.ended ? 'the end' : 'roads ahead'}</p></div>`;
}

function acts(s) {   // F
  const f = s.total > 1 ? (s.n - 1) / (s.total - 1) : 1;
  const act = f >= 0.999 ? 2 : Math.min(2, Math.floor(f * 3));
  const inAct = f >= 0.999 ? 1 : (f * 3) - act;
  const names = ['Beginning', 'Middle', 'End'];
  const seg = names.map((_, i) => `<span class="seg"><span style="width:${i < act ? 100 : i === act ? Math.max(12, Math.round(inAct * 100)) : 0}%"></span></span>`).join('');
  const lab = names.map((t, i) => `<span class="${i === act ? 'on' : ''}">${t}</span>`).join('');
  return `<div class="ind ind-f"><div class="segs">${seg}</div><div class="actlab">${lab}</div></div>`;
}

function ring(s) {   // G (replaces the chapter number in the header)
  const c = 2 * Math.PI * 15, f = s.n / s.total;
  return `<span class="ring"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="rt"/><circle cx="18" cy="18" r="15" class="rf" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 18 18)"/></svg><b>${s.n}</b></span>`;
}

function stamps(s) {   // H
  let h = path.map((id) => `<span class="stamp${id === s.id ? ' now' : ''}">${ic(CH[id].icon)}</span>`).join('');
  if (!s.ended) h += '<span class="stamp next"></span>';
  return `<div class="ind ind-h"><div class="stamps">${h}</div><p class="icap">${word(path.length, 'stamp', 'stamps')} collected</p></div>`;
}

const TOP = { A: dots, B: fog, C: bar, E: branch, F: acts, H: stamps };

// ---------------------------------------------------------------- render
function phone() {
  const s = stats(), c = CH[s.id];
  const badge = cur === 'G' ? ring(s) : `<span class="chn">${s.n}</span>`;
  const lines = c.lines.map(([t, x]) => t === 't'
    ? `<div class="bub txt"><span class="from">Unknown number</span>${x}</div>`
    : `<div class="bub">${x}</div>`).join('');
  const foot = s.ended
    ? `<div class="endcard"><p class="endk">The end</p><p class="endt">${c.end}</p><button type="button" class="cta" data-act="restart">Play Again</button></div>`
    : c.choices.map(([t, to], i) => `<button type="button" class="${i === c.choices.length - 1 ? 'cta' : 'alt'}" data-to="${to}">${t}</button>`).join('');
  return `<div class="phone"><div class="scr">
    <div class="sb"><span>9:41</span><span class="isl"></span><span>100%</span></div>
    <div class="pad">
      <header class="bar">${ic('back', 'bk')}<div class="bt"><p class="st">${STORY.title}</p><p class="ct">${c.title}</p></div>${badge}</header>
      ${TOP[cur] ? TOP[cur](s) : ''}
      <div class="feed" aria-live="polite">${lines}</div>
      <div class="foot">${foot}</div>
    </div>
    ${cur === 'D' ? ribbon(s) : ''}
  </div></div>`;
}

function render() {
  const o = OPTIONS.find((x) => x.k === cur);
  for (const b of $('chips').querySelectorAll('.chip')) {
    const on = b.dataset.k === cur;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  }
  $('stage').innerHTML = `<div class="ph">${phone()}<button type="button" class="ghost" data-act="restart">${PAGE.restart}</button><p class="tip">${PAGE.tip}</p></div>
    <article class="note">
      <header class="oh"><span class="let">${o.k}</span><div><h2>${o.name}</h2><p class="tags"><span class="tag t-${o.status.toLowerCase().replace(/\s+/g, '-')}">${o.status}</span><span class="was">${PAGE.was} ${o.was}</span></p></div></header>
      <p class="what">${o.what}</p>
      <p class="lk">${PAGE.lengthLabel}</p>
      <p class="len">${o.length}</p>
    </article>`;
  noWidows($('stage'));
}

// keep the last two words together (no lone last word)
function noWidows(root) {
  root.querySelectorAll('h1, h2, .sub, .what, .len, .tip, .bub, .endt').forEach((el) => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let last = null;
    while (w.nextNode()) if (w.currentNode.nodeValue.trim()) last = w.currentNode;
    if (!last || el.textContent.trim().split(/\s+/).length < 3) return;
    const m = last.nodeValue.match(/^([\s\S]*\S) (\S+\s*)$/);
    if (m) last.nodeValue = m[1] + ' ' + m[2];
  });
}

function pick(k, focus) {
  cur = OPTIONS.some((o) => o.k === k) ? k : 'A';
  history.replaceState(null, '', location.pathname + '#' + cur.toLowerCase());
  render();
  if (focus) $('chips').querySelector(`[data-k="${cur}"]`)?.focus();
}

function fromUrl() {
  const h = location.hash.replace('#', ''), v = new URLSearchParams(location.search).get('v') || '';
  return (h || v || 'a').toUpperCase();
}

// ---------------------------------------------------------------- boot
$('kicker').textContent = PAGE.kicker;
$('title').textContent = PAGE.title;
$('sub').textContent = PAGE.sub;
$('chips').innerHTML = OPTIONS.map((o) => `<button type="button" role="tab" class="chip" data-k="${o.k}" aria-controls="stage" aria-selected="false"><b>${o.k}</b>${o.short}</button>`).join('');
noWidows(document.querySelector('.top'));

$('chips').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) pick(b.dataset.k); });
$('chips').addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const ks = OPTIONS.map((o) => o.k), i = ks.indexOf(cur);
  pick(ks[(i + (e.key === 'ArrowRight' ? 1 : ks.length - 1)) % ks.length], true);
  e.preventDefault();
});
$('stage').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.to) path.push(b.dataset.to);
  else if (b.dataset.act === 'restart') path = [STORY.start];
  else return;
  render();
});
window.addEventListener('hashchange', () => { const k = fromUrl(); if (k !== cur) pick(k); });
pick(fromUrl());
