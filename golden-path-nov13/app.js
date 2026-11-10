// Golden Path Nov 13: one page, six questions, A / B / C pictures side by side.
// Open a question with #q4 (or ?q=4). Arrow keys or the chips switch questions.
const V = window.CACHE_V || '';
const [{ QS }, S] = await Promise.all([import('./questions.js' + V), import('./screens.js' + V)]);

const nav = document.getElementById('qnav');
const main = document.getElementById('q');
const pager = document.getElementById('pager');
const ids = QS.map((q) => q.n);

nav.innerHTML = QS.map((q) => `<button type="button" role="tab" class="qchip${q.star ? ' star' : ''}" data-q="${q.n}" aria-selected="false" id="tab-${q.n}" aria-controls="q"><b>${q.n}</b>${q.short}</button>`).join('');

function render(n) {
  const q = QS.find((x) => x.n === n) || QS[0];
  for (const b of nav.querySelectorAll('.qchip')) {
    const on = +b.dataset.q === q.n;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  }
  const opts = Object.entries(q.opts);
  main.setAttribute('aria-labelledby', `tab-${q.n}`);
  main.innerHTML = `<section class="qhead">
      <p class="qnum">Question ${q.n} · ${q.mins} min${q.star ? ' · <span class="most">the big one</span>' : ''}</p>
      <h2>${q.title}</h2>
      ${q.sub ? `<p class="qsub">${q.sub}</p>` : ''}
    </section>
    <div class="opts n${opts.length}">${opts.map(([k, o]) => {
      const pick = q.pick === k, also = q.also === k;
      return `<article class="opt${pick ? ' pick' : ''}" aria-label="Option ${k}">
        <header class="oh"><span class="let">${k}</span><div><h3 class="oname">${o.name}</h3><p class="cap">${o.cap}</p></div></header>
        <p class="tags"><span class="moment">${S.MOMENT[q.n][k]}</span>${pick ? '<span class="mp">Melissa’s pick</span>' : ''}${also ? '<span class="mp soft">When a story has one</span>' : ''}</p>
        ${S.screen(q.n, k, o)}
        ${S.extra(q.n, k, o)}
      </article>`;
    }).join('')}</div>
    <section class="why"><p><b>Melissa’s pick: ${q.pick}${q.also ? ` (${q.also} when a story has one)` : ''}.</b> ${q.why}</p><p class="unb"><span>Unblocks</span> ${q.unblocks}</p></section>`;
  const i = ids.indexOf(q.n), prev = QS[i - 1], next = QS[i + 1];
  pager.innerHTML = `${prev ? `<button type="button" class="pg" data-q="${prev.n}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>${prev.n} ${prev.short}</button>` : '<span></span>'}`
    + `${next ? `<button type="button" class="pg nx" data-q="${next.n}">${next.n} ${next.short}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>` : '<span></span>'}`;
  noWidows(document.body);
  return q.n;
}

// keep the last two words together on headings, captions and short lines (no lone last word)
function noWidows(root) {
  root.querySelectorAll('h1, h2, h3, .sub, .cap, .lede, .fine, .qsub, .why p, .callout, .also p, .moment, .srow b, .feat b, .pcard b, .tcard b, .who b, .rtext span, .tl td').forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let last = null;
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) last = walker.currentNode;
    if (!last || el.textContent.trim().split(/\s+/).length < 3) return;   // two words can't avoid a lone word
    const m = last.nodeValue.match(/^([\s\S]*\S)([  ]+)(\S+\s*)$/);
    if (!m || m[2].includes(' ')) return;   // one word, or already joined
    last.nodeValue = m[1] + ' ' + m[3];
  });
}

function go(n, focus) {
  const shown = render(n);
  const url = new URL(location.href);
  url.searchParams.delete('q');
  url.hash = 'q' + shown;
  history.replaceState(null, '', url);
  if (focus) nav.querySelector(`[data-q="${shown}"]`)?.focus();
}

function fromUrl() {
  const h = location.hash.match(/^#q(\d+)$/), p = new URLSearchParams(location.search).get('q');
  const n = +(h ? h[1] : p || 0);
  return ids.includes(n) ? n : ids[0];
}

nav.addEventListener('click', (e) => { const b = e.target.closest('.qchip'); if (b) go(+b.dataset.q); });
nav.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const cur = ids.indexOf(+document.activeElement.dataset.q);
  const n = ids[(cur + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length];
  go(n, true); e.preventDefault();
});
pager.addEventListener('click', (e) => { const b = e.target.closest('.pg'); if (b) { go(+b.dataset.q); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
window.addEventListener('hashchange', () => go(fromUrl()));

// inside the phones: pick one in a group, open and close a sheet
main.addEventListener('click', (e) => {
  const s = e.target.closest('[data-seg]');
  if (s) {
    const grp = s.closest('[role="radiogroup"]');
    grp.querySelectorAll('[data-seg]').forEach((b) => b.setAttribute('aria-checked', String(b === s)));
    return;
  }
  const o = e.target.closest('[data-open]');
  if (o) {
    const ph = o.closest('.scr');
    ph.querySelector('#' + o.dataset.open).hidden = false;
    ph.querySelector('.scrim[data-close]').hidden = false;
    return;
  }
  const c = e.target.closest('[data-close]');
  if (c) {
    const ph = c.closest('.scr');
    ph.querySelectorAll('.sheet.cz').forEach((x) => { x.hidden = true; });
    ph.querySelector('.scrim[data-close]').hidden = true;
  }
});

go(fromUrl());
document.documentElement.classList.add('ready');
