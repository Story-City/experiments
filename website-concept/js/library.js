/* Story City website — Walk-to-chapters line + Story Library shelf
   Mounts into <section id="library" data-module="library">.
   Data: data/stories.json (falls back to a tiny built-in list of real covers). */
(() => {
  const root = document.querySelector('[data-module="library"]');
  if (!root) return;

  const STEPS_PER_MIN = 120;
  const MIN_PER_CHAPTER = 8;   // conservative: a chapter usually takes a bit less than this
  const TYPE_LABEL = { anywhere: 'Play Anywhere', local: 'Local', passport: 'Passport' };
  const FALLBACK = [
    { id: 'alice', name: 'Alice Through The Tear', summary: 'Wonderland is bleeding into your streets.', genre: 'Fantasy', minutes: null, type: 'anywhere', cover: 'img/alice.jpg' },
    { id: 'coronet', name: 'The Coronet Caper', summary: 'Pull off a heist daring enough to impress master criminals.', genre: 'Heist', minutes: 45, type: 'anywhere', cover: 'img/coronet.jpg' },
    { id: 'woglins', name: 'Woglins and Wozzips', summary: "Weird things are loose, and it's all your fault.", genre: 'Comedy', minutes: 45, type: 'anywhere', cover: 'img/woglins.jpg' },
    { id: 'barista', name: 'Tips From Your Barista', summary: 'Ways to survive your fae coffee shop experience.', genre: 'Fantasy', minutes: null, type: 'anywhere', cover: 'img/barista.jpg' },
    { id: 'crystal', name: 'Crystal of Echoes', summary: 'Multiple paths lead to the same destination, but your choices decide whether you join the Sacred Order, the Merchant Guild or the Shadow Collectors.', genre: 'Adventure', minutes: 25, type: 'anywhere', cover: 'img/crystal-cover.jpg' },
    { id: 'summons', name: 'The Summons', summary: 'A mysterious letter arrives, and a guide called Wren is waiting to show you what it means.', genre: 'Mystery', minutes: null, type: 'anywhere', cover: null },
    { id: 'knight', name: "The Knight's Quest", summary: 'Ride out on a quest with Sir Wendell, a knight who speaks olde English.', genre: 'Adventure', minutes: null, type: 'anywhere', cover: null }
  ];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const titleCase = s => String(s || '').replace(/(^|[\s(\-"“])([a-z])/g, (m, a, b) => a + b.toUpperCase());
  const fmt = n => n.toLocaleString('en-CA');
  const minutesOf = s => {
    if (Number.isFinite(+s.minutes) && +s.minutes > 0) return +s.minutes;
    const m = String(s.duration || '').match(/(\d+)\s*(h|hr|hour)?/i);
    return m ? (m[2] ? +m[1] * 60 : +m[1]) : null;
  };
  const typeLine = s => {
    const t = TYPE_LABEL[s.type] || 'Story';
    return s.type === 'local' && s.city ? `${t} · ${s.city}` : t;
  };
  const SPARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z"/></svg>';
  const coverHTML = (s, cls) => s.cover
    ? `<img class="${cls}" src="${esc(s.cover)}" alt="" loading="lazy" decoding="async">`
    : `<span class="${cls} lib-noimg">${SPARK}<span>${esc(titleCase(s.name))}</span></span>`;

  let stories = [], usingFallback = false;
  const state = { walk: 20, genre: 'All', q: '' };

  root.classList.add('lib');
  root.setAttribute('aria-labelledby', 'lib-title');
  root.innerHTML = `
  <div class="wrap">
    <p class="lib-calc">
      Your usual walk is
      <span class="lib-edit"><button type="button" class="lib-num lib-walk" aria-label="Usual walk: 20 minutes. Click to change">20</button><input class="lib-num lib-walk-in" type="number" inputmode="numeric" min="5" max="300" step="5" aria-label="Usual walk in minutes" hidden></span>
      minutes — that's about <output class="lib-num lib-out" id="lib-steps">2,400</output> steps, or about <output class="lib-num lib-out" id="lib-chapters">2</output> <span id="lib-chword">chapters</span>.
    </p>

    <header class="lib-head">
      <p class="eyebrow">Story library</p>
      <h2 id="lib-title">Find a story for your next walk</h2>
    </header>

    <div class="lib-tools">
      <div class="lib-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <label class="sr-only" for="lib-q">Search stories</label>
        <input id="lib-q" type="search" placeholder="Search stories" autocomplete="off">
      </div>
      <div class="lib-chips" role="group" aria-label="Filter by genre"></div>
    </div>

    <p class="sr-only" id="lib-count" aria-live="polite"></p>
    <div class="lib-shelf-wrap">
      <button type="button" class="ibtn lib-nav lib-prev" aria-label="Scroll stories left"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
      <ul class="lib-shelf" id="lib-shelf" aria-label="Stories"></ul>
      <button type="button" class="ibtn lib-nav lib-next" aria-label="Scroll stories right"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
    <p class="lib-empty" hidden>No stories match that yet. Try another word or genre.</p>
    <p class="lib-sample placeholder" hidden>Sample covers shown — the full catalogue loads from <code>data/stories.json</code>.</p>
  </div>

  <dialog class="lib-sheet" aria-labelledby="lib-s-title">
    <div class="lib-s-in">
      <span class="lib-s-grab" aria-hidden="true"></span>
      <button type="button" class="ibtn lib-s-x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div class="lib-s-body">
        <div class="lib-s-cover"></div>
        <div class="lib-s-text">
          <p class="eyebrow" id="lib-s-genre"></p>
          <h3 id="lib-s-title"></h3>
          <p class="lib-s-meta" id="lib-s-meta"></p>
          <p class="lib-s-sum" id="lib-s-sum"></p>
          <a class="btn lib-s-cta" href="#demo">Read the First Chapter</a>
        </div>
      </div>
    </div>
  </dialog>`;

  const $ = s => root.querySelector(s);
  const shelf = $('#lib-shelf'), chipsEl = $('.lib-chips'), sheet = $('.lib-sheet');

  /* ---------- walk → steps → chapters ---------- */
  const walkBtn = $('.lib-walk'), walkIn = $('.lib-walk-in');
  function paintCalc() {
    const m = state.walk;
    const ch = Math.max(1, Math.floor(m / MIN_PER_CHAPTER));
    walkBtn.textContent = m;
    walkBtn.setAttribute('aria-label', `Usual walk: ${m} minutes. Click to change`);
    $('#lib-steps').textContent = fmt(m * STEPS_PER_MIN);
    $('#lib-chapters').textContent = ch;
    $('#lib-chword').textContent = ch === 1 ? 'chapter' : 'chapters';
    shelf.querySelectorAll('.lib-book').forEach(b => {
      const mins = +b.dataset.min;
      b.querySelector('.lib-fit').hidden = !(mins && mins <= m);
    });
  }
  function setWalk(v) {
    v = Math.round(+v);
    if (!Number.isFinite(v) || v <= 0) return;
    state.walk = Math.min(300, Math.max(5, v));
    paintCalc();
  }
  function openEdit() {
    walkIn.value = state.walk;
    walkIn.style.width = `${Math.max(2, String(state.walk).length) + 1.6}ch`;
    walkBtn.hidden = true; walkIn.hidden = false;
    walkIn.focus(); walkIn.select();
  }
  function closeEdit(commit) {
    if (walkIn.hidden) return;
    if (commit) setWalk(walkIn.value);
    walkIn.hidden = true; walkBtn.hidden = false;
    walkBtn.focus();
  }
  walkBtn.addEventListener('click', openEdit);
  walkBtn.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); setWalk(state.walk + 5); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); setWalk(state.walk - 5); }
  });
  walkIn.addEventListener('input', () => { walkIn.style.width = `${Math.max(2, walkIn.value.length) + 1.6}ch`; });
  walkIn.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); closeEdit(true); }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeEdit(false); }
  });
  walkIn.addEventListener('blur', () => closeEdit(true));

  /* ---------- shelf ---------- */
  function renderChips() {
    const count = {};
    stories.forEach(s => { const g = titleCase(s.genre); if (g) count[g] = (count[g] || 0) + 1; });
    const genres = ['All', ...Object.keys(count).sort((a, b) => count[b] - count[a] || a.localeCompare(b))];
    chipsEl.innerHTML = genres.map(g => `<button type="button" class="chip lib-chip" aria-pressed="${g === state.genre}">${esc(g)}</button>`).join('');
    chipsEl.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      state.genre = b.textContent;
      chipsEl.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      filter();
    }));
  }
  function renderShelf() {
    shelf.innerHTML = stories.map((s, i) => {
      const mins = minutesOf(s), t = titleCase(s.name);
      return `<li data-i="${i}"><button type="button" class="lib-book" data-min="${mins || ''}" aria-label="${esc(t)}, ${esc(s.genre || 'story')}${mins ? `, ${mins} minutes` : ''}. Open details">
        <span class="lib-cover">${coverHTML(s, 'lib-img')}<span class="lib-sheen" aria-hidden="true"></span><span class="lib-fit" hidden>Fits your walk</span></span>
        <span class="lib-genre">${esc(s.genre || '')}</span>
        <span class="lib-name">${esc(t)}</span>
        <span class="lib-len">${mins ? `${mins} min · ` : ''}${esc(typeLine(s))}</span>
      </button></li>`;
    }).join('');
    shelf.querySelectorAll('.lib-book').forEach(b => {
      const i = +b.closest('li').dataset.i;
      b.addEventListener('click', () => openSheet(i, b));
      b.addEventListener('pointermove', e => tilt(b, e));
      b.addEventListener('pointerleave', () => untilt(b));
    });
  }
  function tilt(b, e) {
    if (reduce.matches || e.pointerType === 'touch') return;
    const c = b.querySelector('.lib-cover'), r = c.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    c.style.setProperty('--ry', `${(px - 0.5) * 12}deg`);
    c.style.setProperty('--rx', `${(0.5 - py) * 10}deg`);
    c.style.setProperty('--mx', `${px * 100}%`);
    c.style.setProperty('--my', `${py * 100}%`);
    b.classList.add('is-tilt');
  }
  function untilt(b) {
    const c = b.querySelector('.lib-cover');
    c.style.removeProperty('--ry'); c.style.removeProperty('--rx');
    b.classList.remove('is-tilt');
  }
  function filter() {
    const q = state.q.trim().toLowerCase();
    let n = 0;
    shelf.querySelectorAll('li').forEach(li => {
      const s = stories[+li.dataset.i];
      const okG = state.genre === 'All' || titleCase(s.genre) === state.genre;
      const hay = `${s.name} ${s.summary} ${s.genre} ${s.city || ''} ${typeLine(s)}`.toLowerCase();
      const ok = okG && (!q || q.split(/\s+/).every(w => hay.includes(w)));
      li.hidden = !ok; if (ok) n++;
    });
    $('.lib-empty').hidden = n > 0;
    $('#lib-count').textContent = `${n} ${n === 1 ? 'story' : 'stories'} shown`;
    shelf.scrollTo({ left: 0, behavior: 'auto' });
    navState();
  }
  $('#lib-q').addEventListener('input', e => { state.q = e.target.value; filter(); });

  const step = () => Math.max(200, shelf.clientWidth * 0.8);
  $('.lib-prev').addEventListener('click', () => shelf.scrollBy({ left: -step(), behavior: reduce.matches ? 'auto' : 'smooth' }));
  $('.lib-next').addEventListener('click', () => shelf.scrollBy({ left: step(), behavior: reduce.matches ? 'auto' : 'smooth' }));
  function navState() {
    const max = shelf.scrollWidth - shelf.clientWidth - 2;
    $('.lib-prev').disabled = shelf.scrollLeft <= 2;
    $('.lib-next').disabled = shelf.scrollLeft >= max;
  }
  shelf.addEventListener('scroll', () => requestAnimationFrame(navState), { passive: true });
  addEventListener('resize', () => requestAnimationFrame(navState));

  /* ---------- bottom sheet ---------- */
  let opener = null;
  function openSheet(i, from) {
    const s = stories[i], mins = minutesOf(s);
    opener = from;
    $('.lib-s-cover').innerHTML = coverHTML(s, 'lib-s-img');
    $('#lib-s-genre').textContent = s.genre || 'Story';
    $('#lib-s-title').textContent = titleCase(s.name);
    const meta = [];
    if (mins) meta.push(`${mins} min`);
    meta.push(typeLine(s));
    const rating = +s.rating;
    if (s.rating != null && Number.isFinite(rating) && rating > 0) {
      const rv = +s.reviews;
      meta.push(`Rated ${rating.toFixed(1)} of 5${Number.isFinite(rv) && rv > 0 ? ` (${fmt(rv)} review${rv === 1 ? "" : "s"})` : ''}`);
    }
    $('#lib-s-meta').innerHTML = meta.map(m => `<span>${esc(m)}</span>`).join('');
    $('#lib-s-sum').textContent = s.summary || '';
    document.documentElement.classList.add('lib-locked');
    sheet.classList.remove('is-closing');
    sheet.showModal();
    $('.lib-s-x').focus();
  }
  function closeSheet() {
    if (!sheet.open || sheet.classList.contains('is-closing')) return;
    const done = () => {
      sheet.classList.remove('is-closing'); sheet.close();
      document.documentElement.classList.remove('lib-locked');
      opener?.focus({ preventScroll: true });
    };
    if (reduce.matches) return done();
    sheet.classList.add('is-closing');
    setTimeout(done, 220);
  }
  sheet.addEventListener('cancel', e => { e.preventDefault(); closeSheet(); });
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });
  $('.lib-s-x').addEventListener('click', closeSheet);
  $('.lib-s-cta').addEventListener('click', () => { opener = null; closeSheet(); });

  /* ---------- data ---------- */
  async function load() {
    try {
      const r = await fetch('data/stories.json', { cache: 'no-cache' });
      if (!r.ok) throw 0;
      const j = await r.json();
      const arr = (Array.isArray(j) ? j : (j.stories || [])).filter(s => s && s.name);
      if (!arr.length) throw 0;
      stories = arr;
    } catch { stories = FALLBACK; usingFallback = true; }
    $('.lib-sample').hidden = !usingFallback;
    renderChips(); renderShelf(); paintCalc(); filter();
  }
  paintCalc();
  load();

  window.SC_LIBRARY = { state, setWalk };
})();
