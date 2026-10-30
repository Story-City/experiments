/* Story City home page: the page is a walk.
   Scrolling = steps, each section = a chapter stop, reaching one unlocks it. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = { citrine: '#F5B82E', emerald: '#00CD9D', sapphire: '#5B8CFF', amethyst: '#B36BFF', glow: '#C49BFF', starlight: '#FBF7FF', mist: '#D9CEF5', lilac: '#A493D6', line: '#46337E', velvet: '#2A1658', midnight: '#1A0B3D', ink: '#0B0620', ruby: '#FF4F79', turquoise: '#35C6D7' };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('sc-' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('sc-' + k, JSON.stringify(v)); } catch {} }
  };
  const SPARK = 'M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z';
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

  /* ---------- Nav ---------- */
  const nav = $('#nav'), menu = $('#menu'), menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', e => { e.stopPropagation(); const open = menu.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open); });
  const closeMenu = () => { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };
  document.addEventListener('click', e => { if (!menu.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });

  /* ---------- Cycling word: "Turn any walk into a …" ---------- */
  const words = ['mystery.', 'mission.', 'quest.', 'heist.', 'haunting.', 'treasure hunt.', 'love story.', 'mystery.'];
  const cyc = $('#cycle');
  if (!reduce) {
    let wi = 0;
    setInterval(() => {
      const old = cyc.firstElementChild; old.classList.add('out');
      wi = (wi + 1) % words.length;
      const n = document.createElement('span'); n.textContent = words[wi]; n.className = 'pre'; cyc.appendChild(n);
      requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove('pre')));
      setTimeout(() => old.remove(), 460);
    }, 2400);
  }

  /* ---------- Hero sky: stars + a city of streets far below, all on canvas ---------- */
  const sky = $('#sky'), sx = sky.getContext('2d');
  let W = 0, H = 0, stars = [], streets = [], mouse = { x: .5, y: .5 }, heroVisible = true;
  function seedSky() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = sky.clientWidth; H = sky.clientHeight; sky.width = W * dpr; sky.height = H * dpr; sx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round(W * H / 5200) }, () => ({ x: Math.random() * W, y: Math.random() * H * .8, r: Math.random() * 1.3 + .2, t: Math.random() * 6.28, z: Math.random() }));
    // a perspective street grid at the bottom, like looking down on a city at night
    streets = [];
    for (let i = -14; i <= 14; i++) streets.push({ kind: 'v', i });
    for (let j = 0; j < 12; j++) streets.push({ kind: 'h', j });
  }
  function drawSky(t) {
    sx.clearRect(0, 0, W, H);
    const g = sx.createRadialGradient(W * .72, H * .42, 10, W * .72, H * .42, Math.max(W, H) * .7);
    g.addColorStop(0, 'rgba(42,22,88,.95)'); g.addColorStop(.55, 'rgba(26,11,61,.9)'); g.addColorStop(1, 'rgba(11,6,32,1)');
    sx.fillStyle = g; sx.fillRect(0, 0, W, H);
    const px = (mouse.x - .5), py = (mouse.y - .5);
    for (const s of stars) {
      const a = .35 + .65 * (reduce ? .7 : (Math.sin(t / 900 + s.t) * .5 + .5));
      sx.globalAlpha = a * (.4 + s.z * .6);
      sx.fillStyle = s.z > .93 ? C.citrine : C.starlight;
      sx.beginPath(); sx.arc(s.x - px * 14 * s.z, s.y - py * 10 * s.z, s.r, 0, 6.28); sx.fill();
    }
    sx.globalAlpha = 1;
    // street grid with perspective
    const horizon = H * .7, vx = W * (.5 - px * .08);
    sx.lineWidth = 1;
    const sg = sx.createLinearGradient(0, horizon, 0, H); sg.addColorStop(0, 'rgba(70,51,126,0)'); sg.addColorStop(.35, 'rgba(70,51,126,.55)'); sg.addColorStop(1, 'rgba(70,51,126,.7)');
    for (const st of streets) {
      sx.beginPath();
      if (st.kind === 'v') { sx.moveTo(vx + st.i * 6, horizon); sx.lineTo(vx + st.i * W * .12, H + 40); }
      else { const k = (st.j + ((t / 4000) % 1) * (reduce ? 0 : 1)) / 12; const y = horizon + Math.pow(k, 2.2) * (H - horizon + 40); sx.moveTo(0, y); sx.lineTo(W, y); }
      sx.strokeStyle = sg; sx.stroke();
    }
    // a walker's dotted route glowing through the grid
    sx.save(); sx.setLineDash([2, 9]); sx.lineCap = 'round'; sx.lineWidth = 3;
    const rg = sx.createLinearGradient(0, H, 0, horizon); rg.addColorStop(0, C.citrine); rg.addColorStop(.8, C.emerald); rg.addColorStop(1, 'rgba(0,205,157,0)');
    sx.strokeStyle = rg; sx.beginPath(); sx.moveTo(vx + 2 * W * .12, H + 40); sx.lineTo(vx + 12, horizon + 6); sx.stroke(); sx.restore();
  }
  function skyLoop(t) { if (heroVisible) drawSky(t); if (!reduce) requestAnimationFrame(skyLoop); }
  seedSky(); requestAnimationFrame(skyLoop);
  addEventListener('resize', () => { seedSky(); if (reduce) drawSky(0); });
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth; mouse.y = e.clientY / innerHeight; tiltDoors(); }, { passive: true });
  new IntersectionObserver(([e]) => heroVisible = e.isIntersecting).observe($('.hero'));

  /* ---------- Portal: real story covers orbit the ring; pick a door ---------- */
  const DOORS = [
    { img: 'img/alice.jpg', title: 'Alice Through The Tear', genre: 'Adventure', href: '#library' },
    { img: 'img/coronet.jpg', title: 'The Coronet Caper', genre: 'Mystery', href: '#library' },
    { img: 'img/woglins.jpg', title: 'The Woglins', genre: 'Adventure', href: '#library' },
    { img: 'img/barista.jpg', title: 'Tips From Your Barista', genre: 'Comedy', href: '#library' },
    { img: 'img/crystal-cover.jpg', title: 'The Crystal', genre: 'Fantasy', href: '#library' }
  ];
  const portal = $('#portal'); let doorEls = [], front = 0;
  function buildDoors(list) {
    doorEls.forEach(d => d.remove());
    doorEls = list.slice(0, 5).map((d, i) => {
      const b = document.createElement('a'); b.className = 'door'; b.href = d.href || '#library';
      b.setAttribute('aria-label', `${d.title}, ${d.genre}`);
      b.innerHTML = `<img src="${d.img}" alt="" loading="eager"><span class="cap"><small>${d.genre}</small>${d.title}</span>`;
      b.addEventListener('click', ev => { if (d.id && window.SC_LIBRARY && window.SC_LIBRARY.open) { ev.preventDefault(); window.SC_LIBRARY.open(d.id); } });
      b.addEventListener('mouseenter', () => { front = i; placeDoors(); });
      b.addEventListener('focus', () => { front = i; placeDoors(); });
      portal.insertBefore(b, portal.querySelector('.hint')); return b;
    });
    placeDoors();
  }
  function placeDoors() {
    const n = doorEls.length;
    doorEls.forEach((el, i) => {
      let k = ((i - front) % n + n) % n; if (k > n / 2) k -= n;   // -2..2
      const ang = k * 0.62, x = Math.sin(ang) * 118, z = Math.cos(ang) * 120 - 120, rot = -k * 16;
      el.style.transform = `translateX(${x}%) translateZ(${z}px) rotateY(${rot}deg) scale(${1 - Math.abs(k) * .12})`;
      el.style.zIndex = 10 - Math.abs(k); el.style.filter = k ? `brightness(${.75 - Math.abs(k) * .12}) saturate(.85)` : 'none';
    });
  }
  function tiltDoors() { if (reduce) return; portal.style.transform = `rotateX(${(mouse.y - .5) * -6}deg) rotateY(${(mouse.x - .5) * 8}deg)`; }
  buildDoors(DOORS);
  let auto = reduce ? null : setInterval(() => { if (!portal.matches(':hover') && !portal.contains(document.activeElement)) { front = (front + 1) % doorEls.length; placeDoors(); } }, 3200);
  // swap in real catalogue covers when the data file exists
  fetch('data/stories.json').then(r => r.ok ? r.json() : null).then(d => {
    const list = d && (d.stories || d);
    if (!Array.isArray(list)) return;
    const HERO_GENRES = ['Fantasy', 'Mystery', 'Adventure', 'Paranormal', 'Paranormal Mystery', 'Urban Fantasy', 'Time Travel', 'Sci-Fi', 'Thriller', 'Halloween', 'Superhero'];
    const pick = list.filter(s => s.cover && HERO_GENRES.includes(s.genre) && s.language !== 'fr')
      .sort((a, b) => (b.type === 'anywhere') - (a.type === 'anywhere') || (b.reviews || 0) - (a.reviews || 0)).slice(0, 5);
    if (pick.length >= 3) buildDoors(pick.map(s => ({ id: s.id, img: s.cover, title: s.name, genre: s.genre || (s.type === 'anywhere' ? 'Play Anywhere' : 'Story'), href: '#library' })));
  }).catch(() => {});

  /* ---------- Reveal on scroll ---------- */
  const ro = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: .18, rootMargin: '0px 0px -8% 0px' });
  const watchReveals = () => $$('.rv:not(.in)').forEach(el => ro.observe(el));
  watchReveals(); setTimeout(watchReveals, 1500);

  /* ---------- The walk: scroll → steps, sections → chapter stops ---------- */
  const PX_PER_STEP = 6;                         // ~6 px of reading = one step
  const trail = $('#trail'), fill = $('#trailFill'), walker = $('#walker');
  const stepsEl = $('#steps'), counter = $('#stepcount'), unlock = $('#unlock');
  const chapters = $$('main > section[data-chapter]');
  let maxSteps = 0, shown = 0, unlocked = new Set([0]), stops = [];
  chapters.forEach((sec, i) => {
    const s = document.createElement('button'); s.className = 'stop'; s.tabIndex = -1;
    s.innerHTML = `<span>${sec.dataset.chapter}</span>`;
    s.addEventListener('click', () => sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
    trail.appendChild(s); stops.push(s);
  });
  function layoutStops() {
    const doc = document.documentElement.scrollHeight - innerHeight;
    chapters.forEach((sec, i) => { stops[i].style.top = Math.min(1, sec.offsetTop / Math.max(1, doc)) * 100 + '%'; });
  }
  let toastT;
  function toast(i) {
    $('#unlockSmall').textContent = i === chapters.length - 1 ? 'Final chapter unlocked' : `Chapter ${i} unlocked`;
    $('#unlockTitle').textContent = chapters[i].dataset.chapter;
    unlock.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => unlock.classList.remove('show'), 2200);
    counter.classList.remove('pop'); void counter.offsetWidth; counter.classList.add('pop');
  }
  function onScroll() {
    const y = scrollY, doc = document.documentElement.scrollHeight - innerHeight, p = Math.min(1, y / Math.max(1, doc));
    nav.classList.toggle('solid', y > 30);
    maxSteps = Math.max(maxSteps, Math.round(y / PX_PER_STEP));
    counter.classList.toggle('hide', y < innerHeight * .5);
    const h = trail.clientHeight;
    fill.setAttribute('y2', p * h); walker.style.top = p * 100 + '%';
    let here = 0;
    chapters.forEach((sec, i) => { if (sec.getBoundingClientRect().top < innerHeight * .55) here = i; });
    stops.forEach((s, i) => { s.classList.toggle('on', i <= here); s.classList.toggle('here', i === here); });
    if (!unlocked.has(here) && here > 0) { unlocked.add(here); toast(here); }
    if (here === chapters.length - 1) finale();
  }
  // count the number up smoothly rather than jumping
  (function tick() {
    if (shown !== maxSteps) { shown += Math.ceil((maxSteps - shown) * .18); if (Math.abs(maxSteps - shown) < 2) shown = maxSteps; stepsEl.textContent = shown.toLocaleString(); $('#walkedN').textContent = shown.toLocaleString(); }
    requestAnimationFrame(tick);
  })();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', layoutStops);
  addEventListener('load', () => { layoutStops(); onScroll(); });
  new ResizeObserver(layoutStops).observe(document.body);
  layoutStops(); onScroll();

  /* ---------- Finale: a burst of sparkles when the final chapter opens ---------- */
  let finaleDone = false;
  function finale() {
    if (finaleDone) return; finaleDone = true;
    if (reduce) return;
    const cv = $('#confetti'), cx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
    const w = cv.clientWidth, h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = [C.citrine, C.emerald, C.glow, C.sapphire, C.turquoise];
    const ps = Array.from({ length: 70 }, () => ({ x: w / 2, y: h * .38, vx: (Math.random() - .5) * 11, vy: -Math.random() * 10 - 3, s: Math.random() * 12 + 6, r: Math.random() * 6, vr: (Math.random() - .5) * .2, c: cols[Math.random() * cols.length | 0], life: 1 }));
    const p2d = new Path2D(SPARK);
    (function f() {
      cx.clearRect(0, 0, w, h); let alive = 0;
      for (const p of ps) {
        p.vy += .22; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .007; if (p.life <= 0) continue; alive++;
        cx.save(); cx.globalAlpha = Math.min(1, p.life * 1.5); cx.translate(p.x, p.y); cx.rotate(p.r); cx.scale(p.s / 24, p.s / 24); cx.translate(-12, -12); cx.fillStyle = p.c; cx.fill(p2d); cx.restore();
      }
      if (alive) requestAnimationFrame(f); else cx.clearRect(0, 0, w, h);
    })();
  }

  /* A dotted path revealed along its length: the dots stay dots, a mask does the reveal */
  function dottedReveal(parent, d, stroke, width, defsEl, id) {
    const m = svgEl('mask', { id, maskUnits: 'userSpaceOnUse' }, defsEl);
    const mp = svgEl('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': width * 3, 'stroke-linecap': 'round' }, m);
    const p = svgEl('path', { d, fill: 'none', stroke, 'stroke-width': width, 'stroke-dasharray': '1 9', 'stroke-linecap': 'round', mask: `url(#${id})` }, parent);
    const len = mp.getTotalLength();
    return { len, at: k => { mp.style.strokeDasharray = `${len * k} ${len + 1}`; return p.getPointAtLength(len * k); } };
  }

  /* ---------- Mini walk art (step 3 card) ---------- */
  (function miniWalk() {
    const s = svgEl('svg', { viewBox: '0 0 200 130', width: '90%', height: '90%' }, $('#miniWalk'));
    const defs = svgEl('defs', {}, s); const lg = svgEl('linearGradient', { id: 'mwg', gradientUnits: 'userSpaceOnUse', x1: 18, y1: 110, x2: 182, y2: 26 }, defs);
    svgEl('stop', { offset: 0, 'stop-color': C.citrine }, lg); svgEl('stop', { offset: 1, 'stop-color': C.emerald }, lg);
    const d = 'M18 110 C 60 110 50 40 100 50 S 150 100 182 26';
    svgEl('path', { d, fill: 'none', stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '1 9', 'stroke-linecap': 'round' }, s);
    const lit = dottedReveal(s, d, 'url(#mwg)', 4, defs, 'mwm');
    const ring = svgEl('circle', { cx: 182, cy: 26, r: 18, fill: 'none', stroke: C.emerald, 'stroke-width': 1.5 }, s);
    const dot = svgEl('circle', { r: 6, fill: C.starlight }, s);
    let t0 = null;
    (function f(t) {
      if (t0 == null) t0 = t || 0; const p = reduce ? 1 : Math.min(1, ((t - t0) % 4400) / 3600);
      const pt = lit.at(p); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      ring.setAttribute('r', 18 - p * 10); ring.setAttribute('opacity', p < 1 ? .8 : 0);
      if (!reduce) requestAnimationFrame(f);
    })(performance.now());
  })();

  /* ---------- Modes explorer: Walk / Path / Hunt on one drawn street map ---------- */
  const MODES = {
    walk: { title: 'Walk', line: 'Steps unlock the next chapter.', body: 'Head any way you like. A dotted path fills from gold to green as you go, and the ring around you shrinks until the chapter opens.', hud: ['Walk 30 steps', 'to unlock chapter 2'] },
    path: { title: 'Path', line: 'The story sends you somewhere real.', body: 'A blue route leads to a real place nearby, like the park on the corner or the library steps. Arrive, and the scene plays out there.', hud: ['Head to the park', 'chapter 3 waits there'] },
    hunt: { title: 'Hunt', line: 'Find it. Photograph it.', body: 'A purple sweep searches the streets around you. Spot something that fits the clue, snap a photo, and the story believes you.', hud: ['Find something red', 'and take its photo'] }
  };
  const msvg = $('#modeSvg'); let mode = 'walk', modeT0 = 0;
  // street map: blocks + roads, drawn once
  (function drawStreets() {
    const g = svgEl('g', {}, msvg);
    svgEl('rect', { width: 400, height: 300, fill: C.midnight }, g);
    const cols = [0, 70, 150, 230, 320, 400], rows = [0, 60, 130, 210, 300];
    for (let i = 0; i < cols.length - 1; i++) for (let j = 0; j < rows.length - 1; j++) {
      const park = (i === 3 && j === 0) || (i === 1 && j === 2);
      svgEl('rect', { x: cols[i] + 8, y: rows[j] + 8, width: cols[i + 1] - cols[i] - 16, height: rows[j + 1] - rows[j] - 16, rx: 6, fill: park ? 'rgba(0,205,157,.10)' : C.velvet, stroke: park ? 'rgba(0,205,157,.25)' : 'none' }, g);
    }
    svgEl('path', { d: 'M0 250 C 120 230 160 280 400 240', stroke: C.line, 'stroke-width': 10, fill: 'none', opacity: .6 }, g);
  })();
  const layer = svgEl('g', {}, msvg);
  const defs = svgEl('defs', {}, msvg);
  const wg = svgEl('linearGradient', { id: 'walkGrad', gradientUnits: 'userSpaceOnUse', x1: 40, y1: 260, x2: 290, y2: 60 }, defs);
  svgEl('stop', { offset: 0, 'stop-color': C.citrine }, wg); svgEl('stop', { offset: 1, 'stop-color': C.emerald }, wg);
  const hg = svgEl('radialGradient', { id: 'huntGrad' }, defs);
  svgEl('stop', { offset: 0, 'stop-color': C.amethyst, 'stop-opacity': .55 }, hg); svgEl('stop', { offset: 1, 'stop-color': C.amethyst, 'stop-opacity': 0 }, hg);
  let parts = {};
  function setMode(m) {
    mode = m; modeT0 = performance.now(); layer.innerHTML = ''; parts = {};
    $$('.modeswitch button').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === m));
    const M = MODES[m];
    $('#modeWhat').innerHTML = `<h3>${M.title}</h3><p class="tagline">${M.line}</p><p>${M.body}</p>`;
    $('#hudTitle').textContent = M.hud[0]; $('#hudSub').textContent = M.hud[1];
    $('#hudBar').style.background = m === 'walk' ? '' : (m === 'path' ? C.sapphire : C.amethyst);
    if (m === 'walk') {
      const d = 'M40 262 L40 200 L150 200 L150 122 L230 122 L230 62 L290 62';
      svgEl('path', { d, fill: 'none', stroke: C.line, 'stroke-width': 4, 'stroke-dasharray': '1 10', 'stroke-linecap': 'round' }, layer);
      layer.querySelectorAll('mask').forEach(x => x.remove());
      parts.walk = dottedReveal(layer, d, 'url(#walkGrad)', 5, layer, 'walkMask');
      parts.ring = svgEl('circle', { cx: 290, cy: 62, r: 44, fill: 'rgba(0,205,157,.06)', stroke: C.emerald, 'stroke-width': 1.5 }, layer);
      parts.me = svgEl('circle', { r: 8, fill: C.starlight, stroke: C.sapphire, 'stroke-width': 3 }, layer);
    } else if (m === 'path') {
      const d = 'M40 262 L110 262 L110 200 L190 200 L190 122 L270 122 L270 40';
      parts.path = svgEl('path', { d, fill: 'none', stroke: C.sapphire, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, layer);
      parts.len = parts.path.getTotalLength(); parts.path.style.strokeDasharray = parts.len; parts.path.style.strokeDashoffset = parts.len;
      const pin = svgEl('g', { transform: 'translate(270 40)' }, layer);
      svgEl('path', { d: 'M0 0 C -12 -14 -12 -30 0 -30 C 12 -30 12 -14 0 0Z', fill: C.sapphire }, pin);
      svgEl('circle', { cy: -20, r: 4.5, fill: C.midnight }, pin);
      svgEl('text', { x: 14, y: -22, fill: C.starlight, 'font-size': 12, 'font-family': 'Karla, sans-serif', 'font-weight': 700 }, pin).textContent = 'The park';
      parts.pin = pin;
      parts.me = svgEl('circle', { r: 8, fill: C.starlight, stroke: C.sapphire, 'stroke-width': 3, cx: 40, cy: 262 }, layer);
    } else {
      parts.cone = svgEl('path', { d: 'M0 0 L150 -45 A 158 158 0 0 1 150 45 Z', fill: 'url(#huntGrad)' }, layer);
      parts.target = svgEl('use', { href: '#gem-eat', x: 286, y: 70, width: 30, height: 30, opacity: 0 }, layer);
      parts.flash = svgEl('rect', { width: 400, height: 300, fill: C.starlight, opacity: 0 }, layer);
      parts.me = svgEl('circle', { r: 8, fill: C.starlight, stroke: C.amethyst, 'stroke-width': 3, cx: 170, cy: 170 }, layer);
      svgEl('circle', { cx: 170, cy: 170, r: 120, fill: 'none', stroke: C.amethyst, 'stroke-width': 1.2, 'stroke-dasharray': '3 6', opacity: .6 }, layer);
    }
  }
  function modeFrame(t) {
    const dur = 5200, k = reduce ? 1 : Math.min(1, ((t - modeT0) % (dur + 1600)) / dur), bar = $('#hudBar');
    if (mode === 'walk' && parts.walk) {
      const p = parts.walk.at(k); parts.me.setAttribute('cx', p.x); parts.me.setAttribute('cy', p.y);
      parts.ring.setAttribute('r', 44 - 34 * k); bar.style.width = k * 100 + '%';
      $('#hudTitle').textContent = k < 1 ? `${Math.round(k * 30)} of 30 steps` : 'Chapter 2 unlocked';
    } else if (mode === 'path' && parts.path) {
      parts.path.style.strokeDashoffset = parts.len * (1 - k);
      const p = parts.path.getPointAtLength(parts.len * k); parts.me.setAttribute('cx', p.x); parts.me.setAttribute('cy', p.y);
      parts.pin.setAttribute('transform', `translate(270 ${40 - (k >= 1 ? 4 : 0)})`); bar.style.width = k * 100 + '%';
      $('#hudTitle').textContent = k < 1 ? `Head to the park · ${Math.round((1 - k) * 150)} m` : 'You found it';
    } else if (mode === 'hunt' && parts.cone) {
      const a = (reduce ? 340 : (t - modeT0) / 14) % 360;
      parts.cone.setAttribute('transform', `translate(170 170) rotate(${a})`);
      const found = k >= 1; parts.target.setAttribute('opacity', found ? 1 : Math.max(0, Math.cos((a - 335) * Math.PI / 180) - .85) * 6);
      parts.flash.setAttribute('opacity', found && !reduce ? Math.max(0, .5 - ((t - modeT0) % (dur + 1600) - dur) / 600) : 0);
      bar.style.width = k * 100 + '%'; $('#hudTitle').textContent = found ? 'Photo taken. Clue found' : 'Find something red';
    }
    if (!reduce) requestAnimationFrame(modeFrame);
  }
  $$('.modeswitch button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('.modeswitch').addEventListener('keydown', e => {
    const ks = Object.keys(MODES), i = ks.indexOf(mode);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = ks[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3]; setMode(n); $(`.modeswitch [data-mode=${n}]`).focus(); }
  });
  setMode('walk'); requestAnimationFrame(modeFrame);

  /* ---------- Location gems: build one, it drops into your vault ---------- */
  const GEMS = [
    { id: 'nature', name: 'Nature', stone: 'Emerald · leaf' },
    { id: 'art', name: 'Art', stone: 'Turquoise · pebble' },
    { id: 'landmark', name: 'Landmarks', stone: 'Amber · shard' },
    { id: 'eat', name: 'Eat & Shop', stone: 'Ruby · wide cut' },
    { id: 'curio', name: 'Curiosities', stone: 'Amethyst · cluster' }
  ];
  const VIBES = ['Peaceful', 'Cozy', 'Dreamy', 'Romantic', 'Nostalgic', 'Moody', 'Spooky', 'Secret', 'Whimsical', 'Quirky', 'Charming', 'Playful', 'Inspiring', 'Lively', 'Gritty', 'Wild', 'Grand', 'Breathtaking'];
  let gemType = 'nature', vibes = [];
  const typesEl = $('#gemTypes'), vibesEl = $('#vibes');
  GEMS.forEach(g => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'gemtype'; b.dataset.id = g.id; b.setAttribute('aria-pressed', g.id === gemType);
    b.innerHTML = `<svg aria-hidden="true"><use href="#gem-${g.id}"/></svg>${g.name}`;
    b.addEventListener('click', () => { gemType = g.id; $$('.gemtype').forEach(x => x.setAttribute('aria-pressed', x === b)); renderGem(); });
    typesEl.appendChild(b);
  });
  VIBES.forEach(v => {
    const c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.textContent = v; c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', () => {
      if (vibes.includes(v)) vibes = vibes.filter(x => x !== v);
      else { if (vibes.length >= 3) vibes.shift(); vibes.push(v); }
      $$('.chip', vibesEl).forEach(x => x.setAttribute('aria-pressed', vibes.includes(x.textContent)));
      renderGem();
    });
    vibesEl.appendChild(c);
  });
  $('#gemName').addEventListener('input', renderGem);
  function renderGem() {
    const g = GEMS.find(x => x.id === gemType), big = $('#bigGem');
    big.innerHTML = `<use href="#gem-${g.id}"/>`;
    big.animate && !reduce && big.animate([{ transform: 'scale(.6) rotate(-20deg)', opacity: .3 }, { transform: 'scale(1)', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.2,.7,.2,1)' });
    $('#gemLabel').textContent = $('#gemName').value.trim() || g.name;
    $('#gemVibes').textContent = vibes.length ? vibes.join(' · ') : g.stone;
  }
  function renderSaved() {
    const saved = store.get('gems', []), host = $('#savedGems');
    host.innerHTML = saved.slice(-8).map(s => `<svg aria-label="${s.name.replace(/"/g, '')}"><use href="#gem-${s.type}"/></svg>`).join('');
  }
  $('#saveGem').addEventListener('click', () => {
    const g = GEMS.find(x => x.id === gemType);
    const saved = store.get('gems', []); saved.push({ type: gemType, name: $('#gemName').value.trim() || g.name, vibes, at: Date.now() }); store.set('gems', saved);
    renderSaved(); burst();
    const btn = $('#saveGem'); btn.textContent = 'Saved. Find It in the App'; setTimeout(() => btn.textContent = 'Save Another Gem', 2600);
  });
  function burst() {
    if (reduce) return;
    const cv = $('#burst'), cx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), w = cv.clientWidth, h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const p2d = new Path2D(SPARK), cols = [C.citrine, C.glow, C.emerald];
    const ps = Array.from({ length: 22 }, (_, i) => ({ a: i / 22 * 6.28, v: 3 + Math.random() * 3, s: 6 + Math.random() * 10, c: cols[i % 3], d: 0 }));
    let f = 0;
    (function go() {
      cx.clearRect(0, 0, w, h); f++;
      for (const p of ps) { p.d += p.v; p.v *= .94; const x = w / 2 + Math.cos(p.a) * p.d, y = h * .45 + Math.sin(p.a) * p.d; cx.save(); cx.globalAlpha = Math.max(0, 1 - f / 60); cx.translate(x, y); cx.scale(p.s / 24, p.s / 24); cx.translate(-12, -12); cx.fillStyle = p.c; cx.fill(p2d); cx.restore(); }
      if (f < 60) requestAnimationFrame(go); else cx.clearRect(0, 0, w, h);
    })();
  }
  renderGem(); renderSaved();

  /* ---------- Treadmill teaser: a little walker on the spot, the world scrolling past ---------- */
  (function tread() {
    const s = $('#treadSvg');
    svgEl('rect', { x: 40, y: 168, width: 220, height: 14, rx: 7, fill: C.velvet, stroke: C.line }, s);
    const belt = svgEl('line', { x1: 50, x2: 250, y1: 175, y2: 175, stroke: C.lilac, 'stroke-width': 2, 'stroke-dasharray': '6 10' }, s);
    svgEl('path', { d: 'M230 168 L250 70 L268 70', stroke: C.line, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, s);
    const sky = svgEl('g', {}, s);
    for (let i = 0; i < 6; i++) svgEl('use', { href: '#spark', x: 30 + i * 52, y: 20 + (i % 2) * 26, width: 10 + (i % 3) * 4, height: 10 + (i % 3) * 4, fill: i % 2 ? C.glow : C.citrine, opacity: .8 }, sky);
    const walker = svgEl('g', { transform: 'translate(150 168)' }, s);
    svgEl('circle', { cx: 0, cy: -78, r: 11, fill: C.starlight }, walker);
    svgEl('path', { d: 'M0 -66 L0 -32', stroke: C.starlight, 'stroke-width': 6, 'stroke-linecap': 'round' }, walker);
    const legA = svgEl('path', { stroke: C.citrine, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, walker);
    const legB = svgEl('path', { stroke: C.emerald, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, walker);
    const arm = svgEl('path', { stroke: C.starlight, 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, walker);
    const phone = svgEl('rect', { width: 9, height: 15, rx: 2, fill: C.sapphire }, walker);
    function f(t) {
      const k = Math.sin(t / 240), off = (t / 16) % 16;
      legA.setAttribute('d', `M0 -32 L${k * 14} 0`); legB.setAttribute('d', `M0 -32 L${-k * 14} 0`);
      arm.setAttribute('d', `M0 -60 L14 -50`); phone.setAttribute('x', 12); phone.setAttribute('y', -60);
      belt.setAttribute('stroke-dashoffset', off); sky.setAttribute('transform', `translate(${-((t / 40) % 52)} 0)`);
      if (!reduce) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  })();

  /* ---------- FAQ as a conversation with the guide ---------- */
  const FAQ = [
    ['How far do I have to walk?', ['You choose. Every story shows how long it takes before you start, from a quick coffee-run story to a long Sunday wander.', 'And you can stop whenever you like.', { ph: '[Confirm with team: is your place saved if you stop mid-story?]' }]],
    ['Do I have to go somewhere special?', ['Nope. Play Anywhere stories place themselves on the streets around you, wherever you are.', 'Some stories were written for one city, so you can play them right where they happen.']],
    ['Is it safe to read while walking?', ['Choices and puzzles never need steps, so you can stop, read and decide. The story waits for you.', 'Keep your eyes up when you\'re moving, and only cross where it\'s safe. No story is worth a stubbed toe.']],
    ['What do you do with my location?', ['Your location shows you where the story is happening around you.', 'If you\'d rather not share it, you can still play by counting steps instead.', { ph: '[Confirm with team: link to the privacy policy]' }]],
    ['What if I get stuck on a puzzle?', ['There are hints, one at a time, so you only take as much help as you want.', 'And if you just want to know what happens next, tap Solve This for Me. No judgement.']],
    ['How much does it cost?', ['Every story is free for 7 days.', { ph: '[Confirm with team: price after the trial, and what\'s free forever]' }]],
    ['Can I play indoors?', ['Indoor mode is coming soon: treadmill, rainy day laps, walking on the spot.', 'Until then, some stories can be played as a virtual walk.']],
    ['Can kids play?', ['Every story has an age rating, so you can pick ones that suit the whole family.', { ph: '[Confirm with team: minimum age and family sharing]' }]],
    ['Can I play with friends?', [{ ph: '[Confirm with team: playing together, sharing a story]' }]],
    ['Can I write my own story?', ['Yes. Writers build stories in our creator tools: chapters, choices and the places they happen.', 'Have a look at the Creators page.']]
  ];
  const qsEl = $('#faqQs'), convo = $('#convo'); let busy = false;
  function bubble(cls, html) { const b = document.createElement('div'); b.className = 'b ' + cls; b.innerHTML = html; convo.appendChild(b); convo.scrollTop = convo.scrollHeight; return b; }
  async function ask(i, chip) {
    if (busy) return; busy = true; chip.classList.add('asked');
    const [q, a] = FAQ[i]; bubble('me', q);
    for (const line of a) {
      const ty = bubble('them typing', '<i></i><i></i><i></i>');
      await new Promise(r => setTimeout(r, reduce ? 0 : 520 + (typeof line === 'string' ? line.length * 9 : 400)));
      ty.remove();
      if (typeof line === 'string') bubble('them', line); else bubble('them ph', line.ph);
    }
    busy = false;
  }
  FAQ.forEach(([q], i) => { const c = document.createElement('button'); c.className = 'chip'; c.textContent = q; c.addEventListener('click', () => ask(i, c)); qsEl.appendChild(c); });
  const who = document.createElement('div'); who.className = 'who'; who.textContent = 'Wren'; convo.appendChild(who);
  bubble('them', 'Hello. I\'m Wren, your guide. Ask me anything, I don\'t bite.');
})();
