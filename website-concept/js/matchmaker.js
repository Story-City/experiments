/* Story City website — Story Matchmaker
   Mounts into <section id="matchmaker" data-module="matchmaker">.
   Three questions (time, company, vibe) → a fanned deck of story covers.
   Data: data/stories.json (falls back to a tiny built-in list of real covers).
   Shareable: #match=<minutes>-<company>-<vibe.vibe.vibe> */
(() => {
  const root = document.querySelector('[data-module="matchmaker"]');
  if (!root) return;

  const STEPS_PER_MIN = 120;
  const VIBES = ['Peaceful','Cozy','Dreamy','Romantic','Nostalgic','Moody','Spooky','Secret','Mysterious','Intriguing','Curious','Whimsical','Quirky','Charming','Playful','Inspiring','Lively','Gritty','Wild','Grand','Breathtaking'];
  const COMPANY = [
    { id: 'me', label: 'Just me', icon: '<circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>' },
    { id: 'friend', label: 'With a friend', icon: '<circle cx="8.5" cy="7.5" r="3"/><circle cx="16" cy="7.5" r="3"/><path d="M2.5 20c0-3.4 2.6-5.5 6-5.5s6 2.1 6 5.5M13.5 14.6c.8-.1 1.6-.1 2.5-.1 3.4 0 5.5 2.1 5.5 5.5"/>' },
    { id: 'kids', label: 'With kids', icon: '<circle cx="9" cy="6" r="3"/><circle cx="17.5" cy="11" r="2.2"/><path d="M3 21c0-4 2.7-6.8 6-6.8s6 2.8 6 6.8M14.3 21c0-2.6 1.4-4.4 3.2-4.4s3.2 1.8 3.2 4.4"/>' },
    { id: 'group', label: 'A group', icon: '<circle cx="12" cy="6.5" r="2.8"/><circle cx="5" cy="9" r="2.3"/><circle cx="19" cy="9" r="2.3"/><path d="M7 20c0-3.3 2.2-5.6 5-5.6s5 2.3 5 5.6M1.5 19c0-2.5 1.5-4.3 3.5-4.3M22.5 19c0-2.5-1.5-4.3-3.5-4.3"/>' }
  ];
  const TYPE_LABEL = { anywhere: 'Play Anywhere', local: 'Local', passport: 'Passport' };
  /* Genre → vibe guesses, used only when a story has no vibes of its own */
  const GENRE_VIBES = [
    [/halloween|horror|ghost|haunt|paranorm/, ['Spooky','Mysterious','Moody','Secret']],
    [/myster|detective|noir/, ['Mysterious','Intriguing','Moody','Secret','Spooky','Curious']],
    [/heist|crime|caper|thrill|true/, ['Intriguing','Secret','Gritty','Moody']],
    [/urban fantas/, ['Whimsical','Mysterious','Secret','Quirky']],
    [/fantas|fairy|magic|fae/, ['Whimsical','Dreamy','Charming']],
    [/comed|funny|humou?r/, ['Quirky','Playful','Whimsical']],
    [/romanc|love/, ['Romantic','Cozy','Dreamy']],
    [/superhero|action/, ['Lively','Wild','Gritty']],
    [/advent|quest/, ['Wild','Grand','Lively']],
    [/histor|period|walking tour|indigen/, ['Nostalgic','Curious','Grand','Charming']],
    [/educat|biograph|memoir/, ['Inspiring','Curious','Nostalgic','Charming']],
    [/art|music|audio|theatre/, ['Inspiring','Dreamy','Quirky']],
    [/nature/, ['Peaceful','Wild','Breathtaking']],
    [/sci|future|space|time travel|dystop/, ['Curious','Intriguing','Moody','Inspiring','Gritty']],
    [/cozy|slice|café|cafe|contemporary|drama/, ['Cozy','Charming','Peaceful']],
    [/event/, ['Lively','Playful','Charming']]
  ];
  const KID_FRIENDLY = ['Whimsical','Playful','Quirky','Charming','Cozy','Curious'];
  const GROUP_FRIENDLY = ['Lively','Playful','Quirky','Wild'];
  const MOMENTS = {
    Spooky: 'perfect for a dusk walk', Moody: 'made for a grey afternoon', Secret: 'best kept to quiet side streets', Curious: 'for the streets you think you know', Mysterious: 'for lamplight and long shadows', Intriguing: 'for when you need to know what happens next',
    Cozy: 'good with a coffee in hand', Peaceful: 'for a slow, easy wander', Dreamy: 'lovely at golden hour',
    Romantic: 'one for an evening stroll', Nostalgic: 'for the old part of town', Whimsical: 'for a walk with no plan',
    Quirky: 'for the odd corners of your street', Charming: 'for a sunny lunch break', Playful: 'easy to share and laugh at',
    Inspiring: 'for a walk that clears your head', Lively: 'great on a busy street', Gritty: 'for back lanes and brick walls',
    Wild: 'for parks and open paths', Grand: 'for the big buildings downtown', Breathtaking: 'for the best view you know'
  };
  const COMPANY_MOMENT = { kids: 'easy for little legs', friend: 'better with two', group: 'made for a group' };

  const FALLBACK = [
    { id: 'alice', name: 'Alice Through The Tear', summary: 'Wonderland is bleeding into your streets.', genre: 'Fantasy', minutes: null, type: 'anywhere', cover: 'img/alice.jpg' },
    { id: 'coronet', name: 'The Coronet Caper', summary: 'Pull off a heist daring enough to impress master criminals.', genre: 'Heist', minutes: 45, type: 'anywhere', cover: 'img/coronet.jpg' },
    { id: 'woglins', name: 'Woglins and Wozzips', summary: "Weird things are loose, and it's all your fault.", genre: 'Comedy', minutes: 45, type: 'anywhere', cover: 'img/woglins.jpg' },
    { id: 'barista', name: 'Tips From Your Barista', summary: 'Ways to survive your fae coffee shop experience.', genre: 'Fantasy', minutes: null, type: 'anywhere', cover: 'img/barista.jpg' },
    { id: 'crystal', name: 'Crystal of Echoes', summary: 'Your choices decide whether you join the Sacred Order, the Merchant Guild or the Shadow Collectors.', genre: 'Adventure', minutes: 25, type: 'anywhere', cover: 'img/crystal-cover.jpg' }
  ];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const titleCase = s => String(s || '').replace(/(^|[\s(\-"“])([a-z])/g, (m, a, b) => a + b.toUpperCase());
  const fmt = n => n.toLocaleString('en-CA');
  const minutesOf = s => {
    if (Number.isFinite(+s.minutes) && +s.minutes > 0) return +s.minutes;
    const m = String(s.duration || '').match(/(\d+)\s*(h|hr|hour)?/i);
    if (!m) return null;
    return m[2] ? +m[1] * 60 : +m[1];
  };
  const vibesOf = s => {
    if (Array.isArray(s.vibes) && s.vibes.length) return s.vibes.map(titleCase).filter(v => VIBES.includes(v));
    const g = String(s.genre || '').toLowerCase();
    for (const [re, v] of GENRE_VIBES) if (re.test(g)) return v;
    return ['Whimsical'];
  };

  /* ---------- state ---------- */
  const state = { minutes: 25, company: null, vibes: [], q: 0 };
  let stories = [];
  let usingFallback = false;

  /* ---------- markup ---------- */
  const dotCount = 34;
  root.classList.add('mm');
  root.setAttribute('aria-labelledby', 'mm-title');
  root.innerHTML = `
  <div class="wrap">
    <header class="mm-head">
      <p class="eyebrow">Story matchmaker</p>
      <h2 id="mm-title">Got 5 minutes? Start a story.</h2>
      <p class="mm-lede">Three quick questions. We'll deal you a hand of stories that fit your walk.</p>
    </header>

    <div class="mm-stage card" id="mm-stage">
      <ol class="mm-progress" aria-label="Questions">
        <li data-i="0"><span>Time</span></li><li data-i="1"><span>Company</span></li><li data-i="2"><span>Vibe</span></li>
      </ol>

      <div class="mm-q" data-q="0">
        <p class="eyebrow">Chapter one</p>
        <h3 tabindex="-1">How long have you got?</h3>
        <div class="mm-time">
          <output class="mm-time-out" for="mm-range" aria-live="polite"><b id="mm-min">25 minutes</b><span id="mm-steps">about 3,000 steps</span></output>
          <svg class="mm-trail" viewBox="0 0 600 130" aria-hidden="true" focusable="false">
            <defs><linearGradient id="mm-grad" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="580" y2="0">
              <stop offset="0" class="mm-stop-a"/><stop offset="1" class="mm-stop-b"/></linearGradient></defs>
            <path id="mm-trailpath" class="mm-trail-guide" d="M24 98 C 110 30, 190 120, 290 70 S 470 18, 576 52"/>
            <g class="mm-dots"></g>
            <circle class="mm-ring" r="12"/>
            <circle class="mm-you" r="6"/>
          </svg>
          <label class="sr-only" for="mm-range">Walk length in minutes</label>
          <input type="range" id="mm-range" class="mm-range" min="5" max="120" step="5" value="25" aria-valuetext="25 minutes">
          <div class="mm-scale" aria-hidden="true"><span>5 min</span><span>1 h</span><span>2 h</span></div>
        </div>
      </div>

      <div class="mm-q" data-q="1" hidden>
        <p class="eyebrow">Chapter two</p>
        <h3 tabindex="-1">Who's coming?</h3>
        <div class="mm-company" role="group" aria-label="Who's coming">
          ${COMPANY.map(c => `<button type="button" class="mm-who" data-who="${c.id}" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true">${c.icon}</svg><span>${c.label}</span></button>`).join('')}
        </div>
      </div>

      <div class="mm-q" data-q="2" hidden>
        <p class="eyebrow">Chapter three</p>
        <h3 tabindex="-1">Pick a vibe</h3>
        <p class="mm-hint" id="mm-vibe-hint" aria-live="polite">Choose up to 3.</p>
        <div class="mm-vibes" role="group" aria-label="Vibes, choose up to 3" aria-describedby="mm-vibe-hint">
          ${VIBES.map(v => `<button type="button" class="chip mm-vibe" data-vibe="${v}" aria-pressed="false">${v}</button>`).join('')}
        </div>
      </div>

      <div class="mm-nav">
        <button type="button" class="btn txt mm-back" hidden>Back</button>
        <button type="button" class="btn mm-next">Next</button>
      </div>
    </div>

    <div class="mm-results" id="mm-results" hidden>
      <div class="mm-summary">
        <p class="mm-answers" id="mm-answers"></p>
        <button type="button" class="btn txt mm-change">Change Answers</button>
      </div>
      <p class="mm-reason" id="mm-reason" aria-live="polite"></p>
      <div class="mm-deck" id="mm-deck" role="list" aria-label="Your matched stories"></div>
      <p class="mm-tip">Tap a card to turn it over.</p>
      <div class="mm-actions">
        <button type="button" class="btn sec mm-share"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/></svg>Copy Link</button>
        <span class="mm-copied" role="status" aria-live="polite"></span>
      </div>
      <p class="mm-sample placeholder" hidden>Sample covers shown — the full catalogue loads from <code>data/stories.json</code>.</p>
    </div>
  </div>`;

  const $ = s => root.querySelector(s);
  const $$ = s => [...root.querySelectorAll(s)];
  const stage = $('#mm-stage'), results = $('#mm-results'), deck = $('#mm-deck');
  const range = $('#mm-range'), nextBtn = $('.mm-next'), backBtn = $('.mm-back');

  /* ---------- trail of dots ---------- */
  const trailPath = $('#mm-trailpath');
  const dotsG = $('.mm-dots');
  const total = trailPath.getTotalLength();
  const pts = [];
  for (let i = 0; i < dotCount; i++) {
    const p = trailPath.getPointAtLength((i / (dotCount - 1)) * total);
    pts.push(p);
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', p.x.toFixed(1)); c.setAttribute('cy', p.y.toFixed(1)); c.setAttribute('r', '4.2');
    c.style.transitionDelay = `${(i % 8) * 12}ms`;
    dotsG.appendChild(c);
  }
  const dotEls = [...dotsG.children];
  const ring = $('.mm-ring'), you = $('.mm-you');

  function paintTime() {
    const m = state.minutes;
    const shown = Math.max(2, Math.round(2 + (dotCount - 2) * (m - 5) / 115));
    dotEls.forEach((d, i) => d.classList.toggle('on', i < shown));
    const end = pts[shown - 1];
    for (const el of [ring, you]) { el.setAttribute('cx', end.x.toFixed(1)); el.setAttribute('cy', end.y.toFixed(1)); }
    const label = m < 60 ? `${m} minutes` : (m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} hour${m > 60 ? 's' : ''}`);
    $('#mm-min').textContent = label;
    $('#mm-steps').textContent = `about ${fmt(m * STEPS_PER_MIN)} steps`;
    range.setAttribute('aria-valuetext', `${label}, about ${fmt(m * STEPS_PER_MIN)} steps`);
    range.style.setProperty('--p', `${((m - 5) / 115) * 100}%`);
  }
  range.addEventListener('input', () => { state.minutes = +range.value; paintTime(); });

  /* ---------- company + vibes ---------- */
  $$('.mm-who').forEach(b => b.addEventListener('click', () => {
    state.company = b.dataset.who;
    $$('.mm-who').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    syncNav();
  }));
  $$('.mm-vibe').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.vibe, i = state.vibes.indexOf(v);
    if (i > -1) state.vibes.splice(i, 1);
    else if (state.vibes.length < 3) state.vibes.push(v);
    else { nudge(); return; }
    paintVibes(); syncNav();
  }));
  function paintVibes() {
    const full = state.vibes.length >= 3;
    $$('.mm-vibe').forEach(b => {
      const on = state.vibes.includes(b.dataset.vibe);
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('mm-dim', full && !on);
    });
    const n = state.vibes.length;
    $('#mm-vibe-hint').textContent = n === 0 ? 'Choose up to 3.' : n < 3 ? `${n} of 3 chosen.` : '3 of 3 chosen. Tap one to swap it out.';
  }
  function nudge() {
    const h = $('#mm-vibe-hint');
    h.classList.remove('mm-shake'); void h.offsetWidth; h.classList.add('mm-shake');
  }

  /* ---------- question flow ---------- */
  function showQ(n, focus = true) {
    state.q = n;
    $$('.mm-q').forEach(q => { q.hidden = +q.dataset.q !== n; });
    $$('.mm-progress li').forEach(li => {
      const i = +li.dataset.i;
      li.classList.toggle('on', i === n); li.classList.toggle('done', i < n);
      if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    backBtn.hidden = n === 0;
    syncNav();
    const q = $(`.mm-q[data-q="${n}"]`);
    if (!reduce.matches) { q.classList.remove('mm-in'); void q.offsetWidth; q.classList.add('mm-in'); }
    if (focus) q.querySelector('h3').focus({ preventScroll: true });
  }
  function syncNav() {
    const q = state.q;
    nextBtn.textContent = q === 2 ? 'Deal My Stories' : 'Next';
    nextBtn.disabled = q === 1 && !state.company;
    nextBtn.classList.toggle('mm-off', nextBtn.disabled);
  }
  nextBtn.addEventListener('click', () => {
    if (state.q < 2) showQ(state.q + 1);
    else showResults(true);
  });
  backBtn.addEventListener('click', () => showQ(Math.max(0, state.q - 1)));
  $('.mm-change').addEventListener('click', () => {
    results.hidden = true; stage.hidden = false; showQ(0);
  });

  /* ---------- matching ---------- */
  function rank() {
    const want = state.minutes, picks = state.vibes;
    return stories.filter(s => !s.language || s.language === 'en').map(s => { // the page is in English; French editions stay in the library
      const mins = minutesOf(s), vibes = vibesOf(s);
      let score = 0;
      const hits = picks.filter(v => vibes.includes(v));
      score += hits.length * 4;
      if (mins != null) {
        if (mins <= want) score += 3 - Math.min(2.5, (want - mins) / 30);
        else score += Math.max(-2, 1.5 - (mins - want) / 30); // longer stories still start; you play a chapter or two
      } else score += 1;
      if (state.company === 'kids') { score += vibes.filter(v => KID_FRIENDLY.includes(v)).length; if (/horror|ghost|paranorm|crime|thrill|halloween/i.test(s.genre) ) score -= 4; if (s.ageRating && !/^(G|PG)$/.test(s.ageRating)) score -= 100; if (/death|dead|kill|murder|blood|corpse|unlove|exorcis|launder/i.test(`${s.name} ${s.summary}`)) score -= 5; }
      if (state.company === 'group') score += vibes.filter(v => GROUP_FRIENDLY.includes(v)).length * 0.7;
      if (s.type === 'anywhere') score += 1.5; // playable on your own street
      if (Number.isFinite(+s.rating)) score += (+s.rating - 4) * 0.4;
      return { s, mins, vibes, hits, score };
    }).sort((a, b) => b.score - a.score)
      .filter((r, i, all) => { // one card per story family: "Covert Cadets (Austin)" = "Covert Cadets (Brisbane)"
        const base = String(r.s.name).replace(/\s*\(.*\)\s*$/, '').toLowerCase();
        return all.findIndex(o => String(o.s.name).replace(/\s*\(.*\)\s*$/, '').toLowerCase() === base) === i;
      }).slice(0, 5);
  }
  function reasonFor(r) {
    const lead = r.hits[0] || r.vibes[0];
    const moment = COMPANY_MOMENT[state.company] && !r.hits.length ? COMPANY_MOMENT[state.company] : (MOMENTS[lead] || 'right for your walk');
    if (r.mins == null) return `${lead}, ${moment}`;
    if (r.mins <= state.minutes) return `${lead}, ${r.mins} minutes, ${moment}`;
    return `${lead}, ${r.mins} minutes, one for a longer walk`;
  }

  /* ---------- deck ---------- */
  let cards = [], flipped = null;
  const coverHTML = s => s.cover
    ? `<img src="${esc(s.cover)}" alt="" decoding="async">`
    : `<div class="mm-noimg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z"/></svg><span>${esc(titleCase(s.name))}</span></div>`;

  function showResults(fromUser) {
    if (!stories.length) return;
    stage.hidden = true; results.hidden = false;
    const who = COMPANY.find(c => c.id === state.company);
    $('#mm-answers').innerHTML = `<b>${esc($('#mm-min').textContent)}</b> · ${esc(who ? who.label : 'Anyone')}${state.vibes.length ? ' · ' + esc(state.vibes.join(', ')) : ''}`;
    $('.mm-sample').hidden = !usingFallback;
    const ranked = rank();
    flipped = null;
    deck.innerHTML = ranked.map((r, i) => {
      const s = r.s, t = esc(titleCase(s.name));
      const type = TYPE_LABEL[s.type] || 'Story';
      const typeLine = s.type === 'local' && s.city ? `${type} · ${esc(s.city)}` : type;
      return `<div class="mm-card" role="listitem" data-i="${i}">
        <div class="mm-card-in">
          <button type="button" class="mm-face mm-front" aria-label="${t}. Turn over for details">
            ${coverHTML(s)}
            <span class="mm-front-label"><span class="mm-front-genre">${esc(s.genre || '')}</span><span class="mm-front-title">${t}</span></span>
          </button>
          <div class="mm-face mm-backf" inert>
            <button type="button" class="ibtn mm-unflip" aria-label="Turn ${t} back over"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
            <p class="eyebrow">${esc(s.genre || 'Story')}</p>
            <h3>${t}</h3>
            <p class="mm-meta">${r.mins != null ? `<span>${r.mins} min</span>` : ''}<span>${typeLine}</span></p>
            <p class="mm-sum">${esc(s.summary || '')}</p>
            <p class="mm-why">${esc(reasonFor(r))}</p>
            <div class="mm-ctas">
              <a class="btn" href="#demo">Read the First Chapter</a>
              <a class="btn sec" href="#get-app">Get the App</a>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
    cards = [...deck.children];
    cards.forEach((c, i) => {
      c.querySelector('.mm-front').addEventListener('click', () => flip(i));
      c.querySelector('.mm-unflip').addEventListener('click', () => unflip(true));
      c.querySelectorAll('.mm-ctas a').forEach(a => a.addEventListener('click', () => unflip(false)));
    });
    $('#mm-reason').textContent = ranked[0] ? `Top pick: ${titleCase(ranked[0].s.name)}. ${reasonFor(ranked[0])}.` : '';
    layout(true);
    writeHash();
    if (fromUser) {
      results.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => cards[0]?.querySelector('.mm-front').focus({ preventScroll: true }), reduce.matches ? 0 : 500);
    }
  }

  function layout(deal) {
    const n = cards.length; if (!n) return;
    const W = deck.clientWidth;
    const cw = cards[0].offsetWidth;
    const spread = n > 1 ? Math.max(18, Math.min(130, (W - cw) / (n - 1))) : 0;
    const maxRot = W < 520 ? 7 : 10;
    cards.forEach((c, i) => {
      const k = n > 1 ? i / (n - 1) - 0.5 : 0; // -0.5 … 0.5
      const isF = flipped === i;
      const x = isF ? 0 : k * spread * (n - 1);
      const rot = isF ? 0 : k * 2 * maxRot;
      const y = isF ? -6 : Math.abs(k) * 2 * 18;
      c.style.setProperty('--x', `${x}px`);
      c.style.setProperty('--y', `${y}px`);
      c.style.setProperty('--r', `${rot}deg`);
      c.style.setProperty('--s', isF ? (W < 520 ? 1.04 : 1.12) : 1);
      c.style.zIndex = isF ? 50 : (10 + n - Math.round(Math.abs(k) * 2 * n)) ;
      c.classList.toggle('is-flipped', isF);
      c.classList.toggle('is-dim', flipped != null && !isF);
      if (deal) {
        c.style.setProperty('--d', `${i * 90}ms`);
        c.classList.remove('dealt');
      } else c.style.setProperty('--d', '0ms');
    });
    if (deal) {
      if (reduce.matches) cards.forEach(c => c.classList.add('dealt'));
      else requestAnimationFrame(() => requestAnimationFrame(() => cards.forEach(c => c.classList.add('dealt'))));
    }
  }
  function flip(i) {
    flipped = i;
    cards.forEach((c, j) => {
      c.querySelector('.mm-front').inert = j === i;
      c.querySelector('.mm-backf').inert = j !== i;
    });
    layout(false);
    const r = cards[i];
    $('#mm-reason').textContent = `${r.querySelector('h3').textContent}. ${r.querySelector('.mm-why').textContent}.`;
    setTimeout(() => r.querySelector('.mm-unflip').focus({ preventScroll: true }), reduce.matches ? 0 : 320);
  }
  function unflip(returnFocus) {
    if (flipped == null) return;
    const i = flipped; flipped = null;
    cards.forEach(c => { c.querySelector('.mm-front').inert = false; c.querySelector('.mm-backf').inert = true; });
    layout(false);
    if (returnFocus) cards[i]?.querySelector('.mm-front').focus({ preventScroll: true });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && flipped != null) unflip(true); });
  document.addEventListener('pointerdown', e => {
    if (flipped == null) return;
    const card = cards[flipped];
    if (card && !card.contains(e.target)) unflip(false);
  });
  let rt; addEventListener('resize', () => { cancelAnimationFrame(rt); rt = requestAnimationFrame(() => layout(false)); });

  /* ---------- share via hash ---------- */
  function writeHash() {
    const h = `#match=${state.minutes}-${state.company || 'me'}-${state.vibes.map(v => v.toLowerCase()).join('.')}`;
    history.replaceState(null, '', h);
  }
  function readHash() {
    const m = location.hash.match(/^#match=(\d+)-([a-z]+)-?([a-z.]*)$/i);
    if (!m) return false;
    state.minutes = Math.min(120, Math.max(5, Math.round(+m[1] / 5) * 5));
    state.company = COMPANY.some(c => c.id === m[2]) ? m[2] : 'me';
    state.vibes = m[3].split('.').map(titleCase).filter(v => VIBES.includes(v)).slice(0, 3);
    range.value = state.minutes;
    $$('.mm-who').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.who === state.company)));
    paintTime(); paintVibes();
    return true;
  }
  $('.mm-share').addEventListener('click', async () => {
    writeHash();
    const url = location.href, out = $('.mm-copied');
    try { await navigator.clipboard.writeText(url); out.textContent = 'Link copied.'; }
    catch { out.textContent = url; }
    setTimeout(() => { out.textContent = ''; }, 4000);
  });

  /* ---------- data ---------- */
  async function load() {
    try {
      const r = await fetch('data/stories.json', { cache: 'no-cache' });
      if (!r.ok) throw 0;
      const j = await r.json();
      const arr = Array.isArray(j) ? j : (j.stories || []);
      if (!arr.length) throw 0;
      stories = arr.filter(s => s && s.name);
    } catch { stories = FALLBACK; usingFallback = true; }
  }

  paintTime(); paintVibes(); showQ(0, false);
  load().then(() => {
    if (readHash()) {
      showResults(false);
      requestAnimationFrame(() => root.scrollIntoView({ block: 'start' }));
    }
  });
  addEventListener('hashchange', () => { if (readHash()) showResults(false); });

  window.SC_MATCHMAKER = { state, rank: () => rank().map(r => r.s.name) };
})();
