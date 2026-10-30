// Story City — city.html?c=<slug>: one template for every story city.
// Hero with the real local count, a constellation of story start points, genre chips, cards,
// the Play Anywhere shelf, dynamic <title>/meta and JSON-LD.
import { loadCatalogue, esc, plural, titleCase, fmtMinutes, storyCard } from './city-data.js';

const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const slug = (new URLSearchParams(location.search).get('c') || '').toLowerCase();
const base = location.href.replace(/[?#].*$/, '').replace(/[^/]*$/, '');

function setMeta(name, content, prop){
  const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let m = document.head.querySelector(sel);
  if (!m) { m = document.createElement('meta'); m.setAttribute(prop ? 'property' : 'name', name); document.head.appendChild(m); }
  m.setAttribute('content', content);
}
function setHead(title, desc, canon){
  document.title = title;
  setMeta('description', desc); setMeta('og:title', title, true); setMeta('og:description', desc, true);
  const l = document.head.querySelector('link[rel=canonical]'); if (l && canon) l.href = canon;
}

/* ---------- Not found ---------- */
function notFound(cities, anywhere){
  setHead('City not found | Story City', 'This city is not on the Story City map yet. See every story city, or play a Play Anywhere story on your own streets.');
  setMeta('robots', 'noindex');
  $('cy-eyebrow').textContent = 'Story cities';
  $('cy-h1').textContent = slug ? 'That city isn’t on the story map yet' : 'Pick a story city';
  $('cy-crumb-city').textContent = slug ? 'Not found' : 'Pick a city';
  $('cy-crumb-country').remove();
  $('cy-lede').innerHTML = 'Try one of these: ' + cities.slice(0, 6).map(c =>
    `<a href="city.html?c=${encodeURIComponent(c.slug)}">${esc(c.name)}</a>`).join(', ') + `, or <a href="cities.html">see every story city</a>.`;
  shelf(anywhere, null);
}

/* ---------- Constellation ---------- */
const KM_LAT = 110.57;
function project(city, list){
  const k = Math.cos(city.lat * Math.PI / 180) * 111.32;
  return list.map(s => ({ s, kx: (s.lng - city.lng) * k, ky: (s.lat - city.lat) * KM_LAT }));
}
const NICE = [0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100];

function seeded(str){ let h = 2166136261; for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }

let pts = [], edges = [], pinned = null, mapState = null;

function layout(city, list){
  const fig = $('cy-map'), w = fig.clientWidth, h = fig.clientHeight;
  const pad = Math.max(36, Math.min(w, h) * 0.12);
  // Centre on the median start point, then pull far-flung stories inward (distance → √distance)
  // so one story 20 km out doesn't squash the downtown cluster. Rings stay labelled in true km.
  const med = a => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
  const centre = { lat: med(list.map(s => s.lat)), lng: med(list.map(s => s.lng)) };
  const real = project(centre, list);
  const F = d => Math.sqrt(d);
  const raw = real.map(p => { const d = Math.hypot(p.kx, p.ky), k = d ? F(d) / d : 0; return { s: p.s, kx: p.kx * k, ky: p.ky * k }; });
  const rxs = real.map(p => p.kx), rys = real.map(p => p.ky);
  const spanKm = Math.max(Math.max(...rxs) - Math.min(...rxs), Math.max(...rys) - Math.min(...rys));
  const xs = raw.map(p => p.kx), ys = raw.map(p => p.ky);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 0.3), spanY = Math.max(maxY - minY, 0.3);
  const scale = Math.min((w - 2 * pad) / spanX, (h - 2 * pad) / spanY); // px per √km
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const toPx = (kx, ky) => [w / 2 + (kx - cx) * scale, h / 2 - (ky - cy) * scale];
  // place, nudging stories that start on the same corner so each star stays tappable
  const placed = [], MIN = Math.min(26, Math.max(14, w / 40));
  raw.forEach((p, i) => {
    let [x, y] = toPx(p.kx, p.ky), a = i * 2.39996, r = 0;
    while (placed.some(q => Math.hypot(q.x - x, q.y - y) < MIN) && r < 400) { r += 4; a += 2.39996; [x, y] = toPx(p.kx, p.ky); x += Math.cos(a) * r; y += Math.sin(a) * r; }
    x = Math.max(16, Math.min(w - 16, x)); y = Math.max(16, Math.min(h - 16, y));
    placed.push({ x, y, s: p.s });
  });
  // minimum spanning tree = constellation lines
  const n = placed.length, inT = new Array(n).fill(false), best = new Array(n).fill(Infinity), from = new Array(n).fill(-1), E = [];
  if (n) { best[0] = 0; }
  for (let it = 0; it < n; it++) {
    let u = -1; for (let i = 0; i < n; i++) if (!inT[i] && (u < 0 || best[i] < best[u])) u = i;
    inT[u] = true; if (from[u] >= 0) E.push([from[u], u]);
    for (let v = 0; v < n; v++) if (!inT[v]) { const d = Math.hypot(placed[u].x - placed[v].x, placed[u].y - placed[v].y); if (d < best[v]) { best[v] = d; from[v] = u; } }
  }
  // distance rings around the centre, at real distances
  const [ox, oy] = toPx(0, 0);
  const maxR = Math.hypot(w, h) / 2;
  const ringKm = NICE.filter(v => F(v) * scale >= 34 && F(v) * scale < maxR);
  const rings = ringKm.filter((v, i) => i === 0 || F(v) * scale - F(ringKm[i - 1]) * scale >= 40).slice(0, 6)
    .map(km => ({ km, r: F(km) * scale }));
  return { w, h, ox, oy, rings, placed, E, spanKm };
}

function drawMap(city, list){
  const L = layout(city, list);
  mapState = { city, list };
  pts = L.placed; edges = L.E;
  const rnd = seeded(city.slug);
  const dust = Array.from({ length: Math.round(L.w * L.h / 5200) }, () =>
    `<circle cx="${(rnd() * L.w).toFixed(1)}" cy="${(rnd() * L.h).toFixed(1)}" r="${(rnd() * 1.1 + .3).toFixed(2)}" opacity="${(rnd() * .5 + .15).toFixed(2)}"/>`).join('');
  const kmLabel = v => v < 1 ? (v * 1000) + ' m' : v + ' km';
  const rings = L.rings.map(({ km, r }) => {
    const a = -Math.PI / 4, tx = L.ox + Math.cos(a) * r, ty = L.oy + Math.sin(a) * r;
    return `<circle cx="${L.ox.toFixed(1)}" cy="${L.oy.toFixed(1)}" r="${r.toFixed(1)}"/>` +
      (tx > 20 && tx < L.w - 40 && ty > 14 ? `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}">${kmLabel(km)}</text>` : '');
  });
  const ringLabel = L.rings.map(x => kmLabel(x.km)).join(', ');
  const lines = L.E.map(([a, b], i) => {
    const p = L.placed[a], q = L.placed[b], len = Math.hypot(p.x - q.x, p.y - q.y);
    return `<line data-a="${a}" data-b="${b}" x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" style="--len:${len.toFixed(1)};--i:${i}"/>`;
  }).join('');
  const svg = $('cy-svg');
  svg.setAttribute('viewBox', `0 0 ${L.w} ${L.h}`);
  svg.innerHTML = `<defs><radialGradient id="cyHalo"><stop offset="0" stop-color="var(--citrine)" stop-opacity=".55"/><stop offset="1" stop-color="var(--citrine)" stop-opacity="0"/></radialGradient></defs>
    <g class="cy-dust">${dust}</g>
    <g class="cy-rings">${rings.join('')}</g>
    <g class="cy-centre"><path d="M${L.ox} ${L.oy - 7}v14M${L.ox - 7} ${L.oy}h14"/></g>
    <g class="cy-lines">${lines}</g>`;
  $('cy-stars').innerHTML = L.placed.map((p, i) => {
    const s = p.s;
    return `<button type="button" class="cy-star" data-i="${i}" data-genre="${esc(s.genre || '')}" style="left:${p.x.toFixed(1)}px;top:${p.y.toFixed(1)}px;--i:${i}"
      aria-label="${esc(titleCase(s.name, s.language))}, ${esc(s.genre || 'story')}${s.minutes ? ', ' + esc(fmtMinutes(s.minutes)) : ''}" aria-haspopup="dialog"><i aria-hidden="true"></i></button>`;
  }).join('');
  const across = L.spanKm < 1 ? Math.round(L.spanKm * 1000 / 50) * 50 + ' m' : (L.spanKm < 10 ? L.spanKm.toFixed(1) : Math.round(L.spanKm)) + ' km';
  $('cy-cap').textContent = list.length > 1
    ? `Where each story starts, drawn closer together the further out they are. Rings at ${ringLabel}; the stars spread about ${across} across.`
    : `Where the story starts.`;
  bindStars();
  applyFilter(currentGenre, true);
}

function bindStars(){
  $('cy-stars').querySelectorAll('.cy-star').forEach(b => {
    const i = +b.dataset.i;
    b.addEventListener('mouseenter', () => { if (pinned == null) openPop(i, false); });
    b.addEventListener('mouseleave', () => { if (pinned == null) closePop(); });
    b.addEventListener('focus', () => { if (pinned !== i) openPop(i, false); });
    b.addEventListener('click', e => { e.stopPropagation(); if (pinned === i) { closePop(); return; } openPop(i, true); });
  });
}

function openPop(i, pin){
  const p = pts[i]; if (!p) return;
  const s = p.s, pop = $('cy-pop');
  const rating = s.rating != null && s.reviews > 0 ? `<span class="ct-rate"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>${s.rating.toFixed(1)} <span class="ct-rev">(${esc(plural(s.reviews, 'review'))})</span></span>` : '';
  pop.innerHTML = `${s.cover ? `<img src="${esc(s.cover)}" alt="" width="72" height="90">` : ''}
    <div><p class="eyebrow">${esc(s.genre || 'Story')}</p>
      <h3 id="cy-pop-t" ${s.language === 'fr' ? 'lang="fr"' : ''}>${esc(titleCase(s.name, s.language))}</h3>
      <p class="ct-meta">${s.minutes ? `<span>${esc(fmtMinutes(s.minutes))}</span>` : ''}${rating}${s.language === 'fr' ? '<span class="ct-lang" lang="fr">En français</span>' : ''}</p>
      ${pin ? `<button type="button" class="btn txt cy-pop-go">See Story <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>` : ''}</div>
    ${pin ? `<button type="button" class="ibtn cy-pop-x" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>` : ''}`;
  pop.hidden = false; pop.classList.toggle('pinned', !!pin);
  const fig = $('cy-map'), pw = pop.offsetWidth, ph = pop.offsetHeight;
  let x = p.x - pw / 2, y = p.y - ph - 18;
  x = Math.max(8, Math.min(fig.clientWidth - pw - 8, x));
  if (y < 8) y = p.y + 22;
  if (y + ph > fig.clientHeight - 8) y = Math.max(8, fig.clientHeight - ph - 8);
  pop.style.left = x + 'px'; pop.style.top = y + 'px';
  document.querySelectorAll('.cy-star').forEach(b => { b.classList.toggle('on', +b.dataset.i === i); b.setAttribute('aria-expanded', pin && +b.dataset.i === i); });
  document.querySelectorAll('.cy-lines line').forEach(l => l.classList.toggle('on', +l.dataset.a === i || +l.dataset.b === i));
  pinned = pin ? i : null;
  if (pin) {
    pop.querySelector('.cy-pop-x').addEventListener('click', e => { e.stopPropagation(); closePop(true); });
    pop.querySelector('.cy-pop-go').addEventListener('click', () => {
      const card = document.getElementById('s-' + s.id);
      closePop();
      if (card) { if (card.hidden) { applyFilter('all'); } card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); card.focus({ preventScroll: true }); card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash'); }
    });
    pop.querySelector('.cy-pop-go').focus({ preventScroll: true });
  }
}
function closePop(refocus){
  const was = pinned;
  $('cy-pop').hidden = true; pinned = null;
  document.querySelectorAll('.cy-star.on').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.cy-star[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  document.querySelectorAll('.cy-lines line.on').forEach(l => l.classList.remove('on'));
  if (refocus && was != null) { const b = document.querySelector(`.cy-star[data-i="${was}"]`); if (b) b.focus({ preventScroll: true }); }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('cy-pop').hidden) closePop(pinned != null); });
document.addEventListener('click', e => { if (!$('cy-pop').hidden && !e.target.closest('#cy-pop') && !e.target.closest('.cy-star')) closePop(); });

/* ---------- Genre chips + cards ---------- */
let currentGenre = 'all';
function chips(list){
  const counts = new Map();
  list.forEach(s => counts.set(s.genre || 'Story', (counts.get(s.genre || 'Story') || 0) + 1));
  const genres = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const host = $('cy-chips');
  if (genres.length < 2) { host.hidden = true; return; }
  host.innerHTML = `<button class="chip" type="button" data-g="all" aria-pressed="true">All <span>${list.length}</span></button>` +
    genres.map(([g, n]) => `<button class="chip" type="button" data-g="${esc(g)}" aria-pressed="false">${esc(g)} <span>${n}</span></button>`).join('');
  host.addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (b) applyFilter(b.dataset.g); });
}
function applyFilter(g, quiet){
  currentGenre = g;
  document.querySelectorAll('#cy-chips [data-g]').forEach(b => b.setAttribute('aria-pressed', b.dataset.g === g));
  let shown = 0;
  document.querySelectorAll('#cy-grid .ct-card').forEach(c => { const ok = g === 'all' || c.dataset.genre === g; c.hidden = !ok; if (ok) shown++; });
  const off = new Set();
  document.querySelectorAll('.cy-star').forEach(b => {
    const ok = g === 'all' || b.dataset.genre === g;
    b.classList.toggle('off', !ok); b.tabIndex = ok ? 0 : -1; b.setAttribute('aria-hidden', !ok);
    if (!ok) off.add(+b.dataset.i);
  });
  document.querySelectorAll('.cy-lines line').forEach(l => l.classList.toggle('off', off.has(+l.dataset.a) || off.has(+l.dataset.b)));
  if (pinned != null && off.has(pinned)) closePop();
  if (!quiet) $('cy-status').textContent = g === 'all' ? `Showing all ${plural(shown, 'story', 'stories')}` : `Showing ${plural(shown, g + ' story', g + ' stories')}`;
}

function shelf(anywhere, city){
  if (!anywhere.length) return;
  $('cy-any').hidden = false;
  $('cy-any-h').textContent = city
    ? `Plus ${anywhere.length} Play Anywhere stories you can play here too`
    : `${anywhere.length} Play Anywhere stories you can play on any street`;
  $('cy-shelf').innerHTML = anywhere.map(s => storyCard(s, { idPrefix: 'a' })).join('');
}

function jsonLd(city, list){
  const abs = u => u ? new URL(u, base).href : undefined;
  const items = list.map((s, i) => {
    const work = { '@type': 'CreativeWork', name: titleCase(s.name, s.language), genre: s.genre || undefined,
      description: s.summary || undefined, inLanguage: s.language || undefined, image: abs(s.cover),
      timeRequired: s.minutes ? 'PT' + s.minutes + 'M' : undefined, contentRating: s.ageRating || undefined,
      locationCreated: s.lat != null ? { '@type': 'Place', geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng } } : undefined };
    if (s.rating != null && s.reviews > 0) work.aggregateRating = { '@type': 'AggregateRating', ratingValue: s.rating, reviewCount: s.reviews, bestRating: 5, worstRating: 1 };
    return { '@type': 'ListItem', position: i + 1, item: work };
  });
  const data = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'TouristDestination', name: city.name, description: `${plural(list.length, 'interactive walking story', 'interactive walking stories')} set on the streets of ${city.name}.`,
      geo: { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng },
      containedInPlace: { '@type': 'AdministrativeArea', name: city.region, containedInPlace: { '@type': 'Country', name: city.country } },
      url: base + 'city.html?c=' + city.slug },
    { '@type': 'ItemList', name: `Story City stories in ${city.name}`, numberOfItems: list.length, itemListElement: items },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Story cities', item: base + 'cities.html' },
      { '@type': 'ListItem', position: 2, name: city.name, item: base + 'city.html?c=' + city.slug } ] } ] };
  const s = document.createElement('script'); s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

/* ---------- Render ---------- */
function render(city, anywhere){
  const list = city.stories;
  const N = list.length, place = [city.region && city.region !== city.name ? city.region : '', city.country].filter(Boolean).join(', ');
  const title = `${plural(N, 'walking story', 'walking stories')} in ${city.name}${city.region && city.region !== city.name ? ', ' + city.region : ''} | Story City`;
  const genres = [...new Set(list.map(s => s.genre).filter(Boolean))];
  const desc = `Play ${plural(N, 'interactive story', 'interactive stories')} on the real streets of ${city.name}` +
    (genres.length ? ` — ${genres.slice(0, 3).join(', ').toLowerCase()} and more` : '') +
    `. Choose your path, walk, and find out what happens next. Plus ${anywhere.length} Play Anywhere stories.`;
  setHead(title, desc, base + 'city.html?c=' + city.slug);

  $('cy-crumb-country').textContent = city.country;
  $('cy-crumb-city').textContent = city.name;
  $('cy-eyebrow').textContent = place || 'Story city';
  $('cy-h1').innerHTML = `<span class="cy-n">${N}</span> ${N === 1 ? 'story' : 'stories'} on the streets of ${esc(city.name)}`;
  const mins = list.map(s => s.minutes).filter(Boolean).sort((a, b) => a - b);
  const range = mins.length ? (mins[0] === mins[mins.length - 1] ? `It takes about ${fmtMinutes(mins[0])}.` : `Each one takes ${fmtMinutes(mins[0])} to ${fmtMinutes(mins[mins.length - 1])}.`) : '';
  $('cy-lede').textContent = `${N === 1 ? 'A choose-your-path story' : 'Choose-your-path stories'} written for real places in ${city.name}. ${range} Walk, choose, and find out what happens next.`;
  $('cy-actions').hidden = false;
  $('cy-cta-p').textContent = `Every story is free for 7 days on iOS and Android, including ${N === 1 ? 'the one' : 'all ' + N} in ${city.name}.`;

  const placed = list.filter(s => s.lat != null && s.lng != null);
  if (placed.length) {
    $('cy-mapwrap').hidden = false;
    $('cy-stars').setAttribute('aria-label', `Where each of the ${plural(placed.length, 'story', 'stories')} in ${city.name} starts`);
    requestAnimationFrame(() => {
      drawMap(city, placed);
      const fig = $('cy-map');
      if (reduce || !('IntersectionObserver' in window)) fig.classList.add('lit');
      else { const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { fig.classList.add('lit'); io.disconnect(); } }), { threshold: .25 }); io.observe(fig); }
    });
    let rz, lastW = $('cy-map').clientWidth;
    addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { const w = $('cy-map').clientWidth; if (w !== lastW) { lastW = w; closePop(); drawMap(city, placed); } }, 150); });
  }

  $('cy-stories').hidden = false;
  $('cy-st-h').textContent = `Local stories in ${city.name}`;
  $('cy-grid').innerHTML = list.map(s => storyCard(s)).join('');
  chips(list);
  shelf(anywhere, city);
  jsonLd(city, list);
}

loadCatalogue().then(({ cities, anywhere }) => {
  const city = cities.find(c => c.slug === slug);
  if (!city) return notFound(cities, anywhere);
  render(city, anywhere);
}).catch(err => {
  console.warn(err);
  $('cy-h1').textContent = 'The stories could not load';
  $('cy-lede').innerHTML = 'Please refresh to try again, or <a href="cities.html">see every story city</a>.';
});
