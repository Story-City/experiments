// Story City — cities.html: a dotted, hand-drawn world map of story cities + a list by country.
import { LAND, SEAS } from './city-land.js';
import { loadCatalogue, esc, plural } from './city-data.js';

const W = 1000, TOP = 80, BOT = -58, H = Math.round((TOP - BOT) / 360 * W);
const px = lon => (lon + 180) / 360 * W;
const py = lat => (TOP - lat) / 360 * W;
const NS = 'http://www.w3.org/2000/svg';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const VIEWS = { world: [0, 0, W, H], na: [20, 15, 350, 190], au: [790, 228, 210, 135], sa: [250, 170, 180, 213], eu: [440, 15, 190, 115] };

const svg = document.getElementById('cx-svg');
const tip = document.getElementById('cx-tip');
const mapEl = document.getElementById('cx-map');
svg.setAttribute('viewBox', VIEWS.world.join(' '));

function inRing(x, y, ring){
  let ins = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}
const box = r => r.reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [999, 999, -999, -999]);

function drawLand(){
  const polys = LAND.map(r => ({ r, b: box(r) })), seas = SEAS.map(r => ({ r, b: box(r) }));
  const hit = (lon, lat, list) => list.some(p => lon >= p.b[0] && lon <= p.b[2] && lat >= p.b[1] && lat <= p.b[3] && inRing(lon, lat, p.r));
  let d = '';
  const step = 1.6;
  for (let lat = TOP - step / 2; lat > BOT; lat -= step) {
    for (let lon = -180 + step / 2; lon < 180; lon += step) {
      if (hit(lon, lat, polys) && !hit(lon, lat, seas)) d += `M${px(lon).toFixed(1)} ${py(lat).toFixed(1)}h0`;
    }
  }
  const g = document.createElementNS(NS, 'g');
  g.innerHTML = `<defs>
      <radialGradient id="cxGlowC"><stop offset="0" stop-color="var(--citrine)" stop-opacity=".9"/><stop offset="1" stop-color="var(--citrine)" stop-opacity="0"/></radialGradient>
      <radialGradient id="cxGlowG"><stop offset="0" stop-color="var(--glow)" stop-opacity=".85"/><stop offset="1" stop-color="var(--glow)" stop-opacity="0"/></radialGradient>
      <radialGradient id="cxGlowT"><stop offset="0" stop-color="var(--turquoise)" stop-opacity=".8"/><stop offset="1" stop-color="var(--turquoise)" stop-opacity="0"/></radialGradient>
    </defs>
    <g class="cx-grat">${[-30, 0, 30, 60].map(l => `<path d="M0 ${py(l)}H${W}"/>`).join('')}${[-120, -60, 0, 60, 120].map(l => `<path d="M${px(l)} 0V${H}"/>`).join('')}</g>
    <path class="cx-land" d="${d}"/>`;
  svg.appendChild(g);
}

let dots = [];
function drawCities(cities){
  const max = cities[0] ? cities[0].n : 1;
  const layer = document.createElementNS(NS, 'g');
  layer.setAttribute('class', 'cx-cities');
  // smallest on top so tiny cities stay reachable next to big ones
  [...cities].sort((a, b) => b.n - a.n).forEach((c, i) => {
    const tier = c.n >= 20 ? 'C' : c.n >= 5 ? 'G' : 'T';
    const a = document.createElementNS(NS, 'a');
    a.setAttribute('href', 'city.html?c=' + encodeURIComponent(c.slug));
    a.setAttribute('class', 'cx-city t' + tier);
    a.setAttribute('aria-label', `${c.name}, ${c.country}: ${plural(c.n, 'story', 'stories')}`);
    a.style.setProperty('--d', (i % 9) * 0.37 + 's');
    const x = px(c.lng), y = py(c.lat);
    a.innerHTML = `<circle class="halo" cx="${x}" cy="${y}" fill="url(#cxGlow${tier})"/><circle class="core" cx="${x}" cy="${y}"/><circle class="hit" cx="${x}" cy="${y}"/><text x="${x}" y="${y}">${esc(c.name)}</text>`;
    layer.appendChild(a);
    dots.push({ el: a, c, x, y, base: 1.6 + 5.2 * Math.sqrt(c.n / max) });
    const show = () => showTip(a, c);
    a.addEventListener('mouseenter', show); a.addEventListener('focus', show);
    a.addEventListener('mouseleave', hideTip); a.addEventListener('blur', hideTip);
  });
  svg.appendChild(layer);
  sizeDots(VIEWS.world);
}

function scaleOf(vb){
  const r = svg.getBoundingClientRect();
  const s = Math.min(r.width / vb[2], r.height / vb[3]);
  return s || (1);
}
let curView = 'world';
function sizeDots(vb){
  const zoom = W / vb[2];                       // 1 at world, ~3–5 zoomed in
  const k = 1 / Math.pow(zoom, 0.72);          // dots grow a little, not by the full zoom
  const pxPerUnit = scaleOf(vb);
  svg.style.setProperty('--land', (2.6 / Math.pow(zoom, 0.45)).toFixed(2));
  dots.forEach(d => {
    const r = d.base * k;
    d.el.querySelector('.core').setAttribute('r', r.toFixed(2));
    d.el.querySelector('.halo').setAttribute('r', (r * 3.4).toFixed(2));
    d.el.querySelector('.hit').setAttribute('r', Math.max(r * 1.6, 22 / pxPerUnit).toFixed(2)); // ≥44 px tap target
    const t = d.el.querySelector('text');
    t.setAttribute('font-size', (12.5 / pxPerUnit).toFixed(2));
    t.setAttribute('dx', (r + 5 / pxPerUnit).toFixed(2));
    t.setAttribute('dy', (4 / pxPerUnit).toFixed(2));
    const labelled = curView === 'world' ? d.c.n >= 20 : d.c.n >= 3;
    d.el.classList.toggle('lab', labelled);
  });
}

function showTip(a, c){
  const core = a.querySelector('.core').getBoundingClientRect();
  const m = mapEl.getBoundingClientRect();
  tip.innerHTML = `<b>${esc(c.name)}</b><span>${esc([c.region !== c.name ? c.region : '', c.country].filter(Boolean).join(', '))}</span><span class="n">${esc(plural(c.n, 'story', 'stories'))}</span>`;
  tip.classList.add('on');
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = core.left + core.width / 2 - m.left - tw / 2, y = core.top - m.top - th - 12;
  x = Math.max(8, Math.min(m.width - tw - 8, x));
  if (y < 8) y = core.bottom - m.top + 12;
  tip.style.transform = `translate(${x}px, ${y}px)`;
}
function hideTip(){ tip.classList.remove('on'); }

let anim = 0;
function zoomTo(key){
  const to = VIEWS[key]; if (!to) return;
  const from = svg.getAttribute('viewBox').split(' ').map(Number);
  curView = key; hideTip();
  cancelAnimationFrame(anim);
  if (reduce) { svg.setAttribute('viewBox', to.join(' ')); sizeDots(to); return; }
  const t0 = performance.now(), dur = 900;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const tick = now => {
    const t = Math.min(1, (now - t0) / dur), e = ease(t);
    const vb = from.map((v, i) => v + (to[i] - v) * e);
    svg.setAttribute('viewBox', vb.map(v => v.toFixed(2)).join(' '));
    sizeDots(vb);
    if (t < 1) anim = requestAnimationFrame(tick);
  };
  anim = requestAnimationFrame(tick);
}
document.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-zoom]').forEach(x => x.setAttribute('aria-pressed', x === b));
  zoomTo(b.dataset.zoom);
}));
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => sizeDots(svg.getAttribute('viewBox').split(' ').map(Number)), 120); });

function renderList(cities){
  const byCountry = new Map();
  cities.forEach(c => { if (!byCountry.has(c.country)) byCountry.set(c.country, []); byCountry.get(c.country).push(c); });
  const groups = [...byCountry].map(([country, list]) => ({ country, list, n: list.reduce((s, c) => s + c.n, 0) }))
    .sort((a, b) => b.n - a.n || a.country.localeCompare(b.country));
  const host = document.getElementById('cx-list');
  host.innerHTML = groups.map(g => `<section class="cx-country" data-country="${esc(g.country)}" aria-labelledby="cx-c-${esc(g.country.replace(/\W+/g, ''))}">
      <h3 id="cx-c-${esc(g.country.replace(/\W+/g, ''))}">${esc(g.country)} <span>${esc(plural(g.n, 'story', 'stories'))} in ${esc(plural(g.list.length, 'city', 'cities'))}</span></h3>
      <ul>${g.list.map(c => `<li data-q="${esc((c.name + ' ' + c.region + ' ' + c.country).toLowerCase())}"><a class="cx-row" href="city.html?c=${encodeURIComponent(c.slug)}">
        <span class="cx-row-n" aria-hidden="true">${c.n}</span>
        <span class="cx-row-t"><b>${esc(c.name)}</b><span>${esc(c.region && c.region !== c.name ? c.region : c.country)}</span></span>
        <span class="sr-only">, ${esc(plural(c.n, 'story', 'stories'))}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></a></li>`).join('')}</ul>
    </section>`).join('');

  const q = document.getElementById('cx-q'), status = document.getElementById('cx-status');
  q.addEventListener('input', () => {
    const v = q.value.trim().toLowerCase();
    let shown = 0;
    host.querySelectorAll('.cx-country').forEach(sec => {
      let any = 0;
      sec.querySelectorAll('li').forEach(li => { const ok = !v || li.dataset.q.includes(v); li.hidden = !ok; if (ok) { any++; shown++; } });
      sec.hidden = !any;
    });
    status.textContent = !v ? '' : shown ? `${plural(shown, 'city', 'cities')} found` : 'No story city by that name yet. The Play Anywhere stories below work there.';
  });
}

function jsonLd(cities){
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  const base = location.href.replace(/[^/]*$/, '');
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Story City cities',
    numberOfItems: cities.length,
    itemListElement: cities.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.name}, ${c.country}`, url: base + 'city.html?c=' + c.slug })) });
  document.head.appendChild(s);
}

drawLand();
loadCatalogue().then(({ cities, anywhere, stories }) => {
  const local = cities.reduce((s, c) => s + c.n, 0);
  const countries = new Set(cities.map(c => c.country)).size;
  document.getElementById('cx-lede').textContent =
    `${local} stories written for the streets of ${cities.length} cities in ${countries} countries. Every glowing dot is one of them: pick a city to see where each story begins.`;
  document.getElementById('cx-any-n').textContent = `Plus ${anywhere.length} Play Anywhere stories`;
  drawCities(cities);
  renderList(cities);
  jsonLd(cities);
}).catch(err => {
  console.warn(err);
  document.getElementById('cx-list').innerHTML = '<p class="pg-status">The city list could not load. Please refresh to try again.</p>';
});
