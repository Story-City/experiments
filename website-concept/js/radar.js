/* Story City website — "Your street is already a story"
   Mounts into <section id="radar" data-module="radar">.
   Your spot -> real OpenStreetMap streets (Overpass) drawn as a night map on canvas,
   then the three map modes (Walk / Path / Hunt) play on it, with location gems on real places.
   Location never leaves the device except as the query sent to the public map services
   (Nominatim for search, Overpass for streets). No libraries. */
(() => {
  const root = document.querySelector('[data-module="radar"]');
  if (!root) return;

  /* ---------- constants ---------- */
  const R_STREETS = 600;          // metres of streets to fetch
  const R_POI = 650;              // metres of places to fetch
  const LOCAL_KM = 50;            // local stories within this distance
  const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
  const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
  const PRESETS = [ // walkable centres; names checked against data/cities.json at load
    { name: 'Edmonton', lat: 53.5418, lng: -113.4966 },
    { name: 'Calgary', lat: 51.0453, lng: -114.0658 },
    { name: 'Melbourne', lat: -37.8142, lng: 144.9632 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'London', lat: 51.5113, lng: -0.1235 },
    { name: 'New York', lat: 40.7309, lng: -73.9973 },
    { name: 'Toronto', lat: 43.6534, lng: -79.3841 },
    { name: 'Vancouver', lat: 49.2827, lng: -123.1207 }
  ];
  const FALLBACK_STORIES = [
    { id: 'alice', name: 'Alice Through The Tear', minutes: 45, type: 'anywhere', cover: 'img/alice.jpg' },
    { id: 'coronet', name: 'The Coronet Caper', minutes: 45, type: 'anywhere', cover: 'img/coronet.jpg' },
    { id: 'woglins', name: 'Woglins and Wozzips', minutes: 45, type: 'anywhere', cover: 'img/woglins.jpg' },
    { id: 'barista', name: 'Tips From Your Barista', minutes: null, type: 'anywhere', cover: 'img/barista.jpg' },
    { id: 'crystal', name: 'Crystal of Echoes', minutes: 25, type: 'anywhere', cover: 'img/crystal-cover.jpg' }
  ];

  /* Gem shapes — paths copied exactly from apps/brand-guidelines/index.src.html (Location gems).
     Colours come from tokens: m = gem colour, s = darker facet (Ink overlay), h = Starlight highlight. */
  const GEMS = {
    nature: { label: 'Nature', shape: 'leaf', v: '--emerald', paths: [
      ['m', 'M20 3c8.6 6.6 11 16.4 8.2 24.6C26.4 32.8 23.6 35.8 20 37c-3.6-1.2-6.4-4.2-8.2-9.4C9 19.4 11.4 9.6 20 3z'],
      ['s', 'M20 3c8.6 6.6 11 16.4 8.2 24.6C26.4 32.8 23.6 35.8 20 37z'],
      ['h', 'M15.6 13.5c-1.7 3.8-2.1 7.8-1.2 11.6']] },
    art: { label: 'Art', shape: 'pebble', v: '--turquoise', paths: [
      ['m', 'M4.5 23C4 17 7.5 10.5 13 9.2c4.5-1 9 1.3 14 2.8 5 1.5 8.5 5.5 8.5 10.5S31 30.5 25 31c-6 .5-13 .8-17-1.4-2.4-1.3-3.3-3.8-3.5-6.6z'],
      ['h', 'M9.5 15.5c1.6-2.4 4.2-3.6 7-3.4']] },
    landmark: { label: 'Landmarks', shape: 'shard', v: '--amber', paths: [
      ['m', 'M14 3.5c1-.9 2.5-.7 3.6-.1l9.8 5.4c1 .6 1.6 1.6 1.6 2.7V35c0 1.1-.9 2-2 2H13c-1.1 0-2-.8-2.1-1.9-.6-9.1-.5-19.6 1.5-27.5.4-1.6.9-3 1.6-4.1z'],
      ['s', 'M24 6.3l3.4 2.5c1 .6 1.6 1.6 1.6 2.7V35c0 1.1-.9 2-2 2h-3z'],
      ['h', 'M14.8 9c-1 5-1.2 10-.9 15']] },
    eat: { label: 'Eat & Shop', shape: 'wide cut', v: '--ruby', paths: [
      ['m', 'M9 10h22c.6 0 1.2.3 1.6.8l4 5c.3.4.4.8.4 1.2v6c0 .4-.1.8-.4 1.2l-4 5c-.4.5-1 .8-1.6.8H9c-.6 0-1.2-.3-1.6-.8l-4-5c-.3-.4-.4-.8-.4-1.2v-6c0-.4.1-.8.4-1.2l4-5c.4-.5 1-.8 1.6-.8z'],
      ['s', 'M27 10h4c.6 0 1.2.3 1.6.8l4 5c.3.4.4.8.4 1.2v6c0 .4-.1.8-.4 1.2l-4 5c-.4.5-1 .8-1.6.8h-4z'],
      ['h', 'M9.5 14.2h11']] },
    curio: { label: 'Curiosities', shape: 'cluster', v: '--glow', paths: [
      ['m', 'M17 23 8 14l-4-1 1 4 9 11zM16 27 5 25l-3 2.5L5 30l11 .5zM24 23l9-7h4l-2 4-10 7.5zM24 28l11-1 3 1.8-3 2.2-11 .5zM16 28V9l4.5-6.5L25 9v19z'],
      ['s', 'M20.5 2.5 25 9v19h-4.5zM24 28l11-1 3 1.8-3 2.2-11 .5zM16 27 5 25l-3 2.5L5 30l11 .5z'],
      ['S', 'M14 31c2-1.8 4.2-2.6 6.5-2.6s4.5.8 6.5 2.6c-2 1.2-4.2 1.8-6.5 1.8S16 32.2 14 31z'],
      ['h', 'M18.4 11v12']] }
  };
  const GEM_ORDER = ['nature', 'art', 'landmark', 'eat', 'curio'];
  const gemSVG = (k, cls = '') => {
    const g = GEMS[k];
    return `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true">` + g.paths.map(([t, d]) =>
      t === 'h' ? `<path d="${d}" style="stroke:var(--starlight)" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
      : `<path d="${d}" style="fill:var(${t === 'm' ? g.v : '--ink'})" ${t === 's' ? 'opacity=".35"' : t === 'S' ? 'opacity=".5"' : ''}/>`).join('') + '</svg>';
  };

  const MODES = {
    walk: { label: 'Walk', icon: '<path d="M8 20c-1.7 0-2.6-1.5-2.4-3.4.2-2.2 1.3-3.6 2.7-3.5 1.4.1 2 1.7 1.8 3.7-.2 1.9-.9 3.2-2.1 3.2zM16 11c-1.2 0-1.9-1.3-2.1-3.2-.2-2 .4-3.6 1.8-3.7 1.4-.1 2.5 1.3 2.7 3.5.2 1.9-.7 3.4-2.4 3.4z"/>' },
    path: { label: 'Path', icon: '<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>' },
    hunt: { label: 'Hunt', icon: '<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z"/><circle cx="12" cy="12.5" r="3.5"/>' }
  };
  const SPARK = 'M12 0c.9 6.6 4.9 10.8 12 12-7.1 1.2-11.1 5.4-12 12-.9-6.6-4.9-10.8-12-12C7.1 10.8 11.1 6.6 12 0z';

  /* ---------- helpers ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => Math.round(n).toLocaleString('en-CA');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const kmBetween = (a, b, c, d) => {
    const R = 6371, r = Math.PI / 180, dLat = (c - a) * r, dLng = (d - b) * r;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const seedOf = (lat, lng) => Math.round(lat * 1e4) * 31 + Math.round(lng * 1e4);
  const ls = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* full or blocked */ } } };

  // token colours for canvas (read from CSS variables; nothing hard-coded)
  let C = {};
  const toRGB = hex => { const h = hex.replace('#', '').trim(); const f = h.length === 3 ? h.split('').map(c => c + c).join('') : h; const n = parseInt(f, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const rgba = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
  const mix = (a, b, t) => [lerp(a[0], b[0], t) | 0, lerp(a[1], b[1], t) | 0, lerp(a[2], b[2], t) | 0];
  function readColours() {
    const cs = getComputedStyle(root);
    ['ink', 'midnight', 'velvet', 'line', 'starlight', 'mist', 'lilac', 'sapphire', 'glow', 'ruby', 'citrine', 'emerald', 'turquoise', 'amethyst', 'amber']
      .forEach(n => { C[n] = toRGB(cs.getPropertyValue('--' + n) || '#0B0620'); });
  }

  /* ---------- DOM ---------- */
  // the page may already give this section its heading (in the mount, or in the section around it)
  const hasHead = root.querySelector('.sechead, h2') || (root.parentElement && root.parentElement.closest('section')?.querySelector('.sechead, h2'));
  const host = root.querySelector('.wrap') || root.appendChild(Object.assign(document.createElement('div'), { className: 'wrap' }));
  const app = document.createElement('div');
  app.className = 'radar';
  app.innerHTML = `
    ${hasHead ? '' : `<header class="radar-head"><p class="eyebrow">Near you</p><h2>Your street is already a story</h2>
      <p class="radar-lede">Play Anywhere stories place themselves on the real streets around you: the park becomes a meeting point, the corner café a hiding place. Have a look at yours.</p></header>`}
    <div class="radar-controls">
      <button type="button" class="btn sec radar-locate"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/><circle cx="12" cy="12" r="7"/></svg>Use My Location</button>
      <div class="radar-search">
        <label class="sr-only" for="radar-q">Search for a city or address</label>
        <svg class="radar-search-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
        <input id="radar-q" type="search" autocomplete="off" spellcheck="false" placeholder="Type a city or address"
          role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="radar-results">
        <ul class="radar-results" id="radar-results" role="listbox" aria-label="Places found" hidden></ul>
      </div>
      <label class="radar-city"><span class="sr-only">Or pick a city</span>
        <select aria-label="Or pick a city"><option value="">Or pick a city</option></select>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>
      </label>
    </div>
    <div class="radar-body">
      <div class="radar-stage">
        <canvas class="radar-canvas" tabindex="0" role="img" aria-roledescription="story map" aria-describedby="radar-keys"></canvas>
        <p class="sr-only" id="radar-keys">Drag or use the arrow keys to move the map. Plus and minus zoom, 0 recentres. Click a gem to see the place.</p>
        <div class="radar-modes" role="group" aria-label="Map mode">
          ${Object.entries(MODES).map(([k, m]) => `<button type="button" class="radar-mode" data-mode="${k}" aria-pressed="${k === 'walk'}"><svg viewBox="0 0 24 24" aria-hidden="true">${m.icon}</svg>${m.label}</button>`).join('')}
        </div>
        <div class="radar-zoom">
          <button type="button" class="ibtn" data-z="in" aria-label="Zoom in"><svg viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></svg></button>
          <button type="button" class="ibtn" data-z="out" aria-label="Zoom out"><svg viewBox="0 0 24 24"><path d="M6 12h12"/></svg></button>
          <button type="button" class="ibtn" data-z="home" aria-label="Recentre the map"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg></button>
        </div>
        <div class="radar-status" role="status" hidden><span class="radar-status-t"></span><button type="button" class="radar-retry" hidden>Try Again</button></div>
        <div class="radar-caption" aria-hidden="true"><span class="radar-cap-mode"></span><span class="radar-cap-t"></span></div>
        <p class="sr-only radar-live" aria-live="polite"></p>
        <div class="radar-pop" role="dialog" aria-label="Place" hidden></div>
        <p class="radar-hint" hidden>Hold Ctrl or ⌘ and scroll to zoom</p>
        <ul class="sr-only radar-places" aria-label="Places on this map"></ul>
      </div>
      <aside class="radar-stories card" aria-labelledby="radar-st-h">
        <p class="eyebrow">Playable here</p>
        <h3 id="radar-st-h">Stories for <span class="radar-place">your streets</span></h3>
        <ul class="radar-list"></ul>
      </aside>
    </div>
    <div class="radar-legend" role="group" aria-label="Show gem types">
      ${GEM_ORDER.map(k => `<button type="button" class="radar-gemchip" data-gem="${k}" aria-pressed="true">${gemSVG(k)}<span><b>${esc(GEMS[k].label)}</b> <span class="radar-gc">0</span></span></button>`).join('')}
    </div>
    <p class="radar-fine"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>
      <span><b>Your location stays on your device.</b> To draw the map, only the place you pick (the words you type, or a point on the map) goes to OpenStreetMap's free public map services. We don't keep it.
      Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>.</span></p>`;
  host.appendChild(app);

  const $ = s => app.querySelector(s);
  const canvas = $('.radar-canvas'), ctx = canvas.getContext('2d');
  const stage = $('.radar-stage'), statusEl = $('.radar-status'), statusT = $('.radar-status-t'), retryBtn = $('.radar-retry');
  const capMode = $('.radar-cap-mode'), capT = $('.radar-cap-t'), live = $('.radar-live'), pop = $('.radar-pop'), hint = $('.radar-hint');
  const input = $('#radar-q'), results = $('#radar-results'), select = $('.radar-city select'), locateBtn = $('.radar-locate');
  const list = $('.radar-list'), placeEl = $('.radar-place'), placesList = $('.radar-places');

  /* ---------- state ---------- */
  let W = 0, H = 0, dpr = 1, s0 = 1;
  const view = { cx: 0, cy: 0, s: 1 }, target = { cx: 0, cy: 0, s: 1 };
  let scene = null, sceneT0 = 0, mode = 'walk', modeT0 = performance.now();
  let place = null, visible = false, running = false, needsDraw = true;
  const shown = new Set(GEM_ORDER);
  let sprites = {}, stories = [], storiesReady = null;
  let fetchCtl = null, loadSeq = 0;

  /* ---------- geometry: lat/lng -> local metres ---------- */
  const projector = (lat0, lng0) => {
    const kx = Math.cos(lat0 * Math.PI / 180) * 111320, ky = 110540;
    return (lat, lng) => [(lng - lng0) * kx, -(lat - lat0) * ky];
  };

  /* ---------- tiny priority queue for routes ---------- */
  function dijkstra(adj, src) {
    const dist = new Map([[src, 0]]), prev = new Map(), heap = [[0, src]];
    const push = e => { heap.push(e); let i = heap.length - 1; while (i) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
    while (heap.length) {
      const [d, u] = pop();
      if (d > (dist.get(u) ?? Infinity)) continue;
      for (const [v, w] of adj.get(u) || []) { const nd = d + w; if (nd < (dist.get(v) ?? Infinity)) { dist.set(v, nd); prev.set(v, u); push([nd, v]); } }
    }
    return { dist, prev };
  }
  const pathTo = (prev, src, dst) => { const out = [dst]; let u = dst; while (u !== src && prev.has(u)) { u = prev.get(u); out.push(u); } return u === src ? out.reverse() : null; };
  const polyLen = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
  function resample(pts, step) {
    const out = [pts[0]]; let carry = 0;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], seg = Math.hypot(bx - ax, by - ay);
      let d = step - carry;
      while (d <= seg) { const t = d / seg; out.push([lerp(ax, bx, t), lerp(ay, by, t)]); d += step; }
      carry = seg - (d - step);
    }
    return out;
  }

  /* ---------- scene building (shared by real + sketch) ---------- */
  const MAJOR = /^(primary|secondary|tertiary|trunk)(_link)?$/;
  const MINOR = /^(residential|unclassified|living_street|pedestrian|road)$/;
  const NOWALK = /^(motorway|motorway_link|trunk|trunk_link|construction|proposed|raceway|bus_guideway|corridor|elevator)$/;

  function finishScene(sc, seed) {
    const { nodes, adj } = sc;
    // start: nearest connected node to the centre
    let best = null, bd = Infinity;
    for (const [id, p] of nodes) { if (!(adj.get(id) || []).length) continue; const d = p[0] * p[0] + p[1] * p[1]; if (d < bd) { bd = d; best = id; } }
    sc.me = best != null ? nodes.get(best) : [0, 0];
    sc.startId = best;
    // gems: spaced out, named first, nearest first
    sc.pois.forEach(p => { p.d = Math.hypot(p.x - sc.me[0], p.y - sc.me[1]); });
    const cand = sc.pois.filter(p => p.d < R_POI).sort((a, b) => (!!b.name - !!a.name) || a.d - b.d);
    const gems = [];
    for (const p of cand) { if (gems.length >= 24) break; if (gems.every(g => Math.hypot(g.x - p.x, g.y - p.y) > 55)) gems.push(p); }
    sc.gems = gems;
    if (best == null) { sc.walk = null; sc.route = null; sc.red = null; return sc; }

    // Path: shortest street route to a real named place (prefer a park), ~150 m+
    const { dist, prev } = dijkstra(adj, best);
    const nearestNode = (x, y) => { let bi = null, b = Infinity; for (const [id, q] of nodes) { if (!dist.has(id)) continue; const d = (q[0] - x) ** 2 + (q[1] - y) ** 2; if (d < b) { b = d; bi = id; } } return bi; };
    const scored = gems.map(g => { const n = nearestNode(g.x, g.y); return { g, n, d: n != null ? dist.get(n) : Infinity }; }).filter(o => isFinite(o.d));
    const pick = scored.filter(o => o.g.name && o.g.type === 'nature' && o.d >= 120 && o.d <= 650).sort((a, b) => a.d - b.d)[0]
      || scored.filter(o => o.g.name && o.d >= 100 && o.d <= 650).sort((a, b) => a.d - b.d)[0]
      || scored.filter(o => o.d >= 80).sort((a, b) => a.d - b.d)[0] || scored[0];
    if (pick && pick.n !== best) {
      const ids = pathTo(prev, best, pick.n);
      if (ids) { const pts = ids.map(i => nodes.get(i)); pts.push([pick.g.x, pick.g.y]); sc.route = { pts, len: polyLen(pts), poi: pick.g }; }
    }
    // Walk: a wandering street walk of ~450 m (seeded, so the same spot gives the same walk)
    const r = rng(seed), seen = new Set([best]), ids = [best]; let L = 0, cur = best, heading = null;
    while (L < 460 && ids.length < 400) {
      const opts = (adj.get(cur) || []).filter(([v]) => !seen.has(v));
      if (!opts.length) break;
      const p = nodes.get(cur);
      opts.forEach(o => { const q = nodes.get(o[0]); const a = Math.atan2(q[1] - p[1], q[0] - p[0]); o.score = (heading == null ? 0 : Math.cos(a - heading)) + r() * 1.2; o.a = a; });
      opts.sort((a, b) => b.score - a.score);
      const [v, w] = opts[0]; heading = opts[0].a; seen.add(v); ids.push(v); L += w; cur = v;
    }
    if (L > 120) { const pts = ids.map(i => nodes.get(i)); sc.walk = { pts, dots: resample(pts, 11), len: L }; }
    // Hunt: something red = nearest Eat & Shop (ruby) gem, else any gem
    sc.red = gems.filter(g => g.type === 'eat').sort((a, b) => a.d - b.d)[0] || gems[0] || null;
    return sc;
  }

  function classify(t) {
    if (/^(park|playground|garden|nature_reserve)$/.test(t.leisure || '')) return 'nature';
    if (t.tourism === 'artwork' || /^(arts_centre|theatre)$/.test(t.amenity || '')) return 'art';
    if (t.historic || /^(museum|attraction|viewpoint)$/.test(t.tourism || '')) return 'landmark';
    if (/^(cafe|restaurant|bakery|ice_cream|pub|bar)$/.test(t.amenity || '') || t.shop) return 'eat';
    return 'curio';
  }

  function buildReal(json, lat, lng) {
    const P = projector(lat, lng), nodes = new Map(), adj = new Map();
    const major = new Path2D(), minor = new Path2D(), small = new Path2D(), parks = new Path2D();
    const pois = []; let streetCount = 0;
    for (const e of json.elements) if (e.type === 'node' && !e.tags) nodes.set(e.id, P(e.lat, e.lon));
    const link = (a, b, w) => { (adj.get(a) || adj.set(a, []).get(a)).push([b, w]); (adj.get(b) || adj.set(b, []).get(b)).push([a, w]); };
    for (const e of json.elements) {
      if (e.type === 'way' && e.nodes && e.tags && e.tags.highway) {
        const hw = e.tags.highway, path = MAJOR.test(hw) ? major : MINOR.test(hw) ? minor : small;
        const walkable = !NOWALK.test(hw) && e.tags.access !== 'private' && e.tags.foot !== 'no';
        let prevId = null; streetCount++;
        e.nodes.forEach((id, i) => {
          const p = nodes.get(id); if (!p) { prevId = null; return; }
          if (prevId == null || i === 0) path.moveTo(p[0], p[1]); else path.lineTo(p[0], p[1]);
          if (walkable && prevId != null) { const q = nodes.get(prevId); link(prevId, id, Math.hypot(p[0] - q[0], p[1] - q[1])); }
          prevId = id;
        });
      } else if (e.type === 'way' && e.geometry && e.tags && e.tags.leisure) {
        e.geometry.forEach((g, i) => { const p = P(g.lat, g.lon); i ? parks.lineTo(p[0], p[1]) : parks.moveTo(p[0], p[1]); });
        parks.closePath();
      } else if (e.tags && (e.center || e.type === 'node') && !e.tags.highway) {
        const ll = e.center || e; if (ll.lat == null) continue;
        const [x, y] = P(ll.lat, ll.lon);
        const name = e.tags.name || e.tags['name:en'] || null;
        if (!name && e.tags.leisure === 'garden') continue;
        pois.push({ x, y, name, type: classify(e.tags), kind: e.tags.leisure || e.tags.amenity || e.tags.tourism || (e.tags.historic && 'historic') || (e.tags.shop && 'shop') || '' });
      }
    }
    if (streetCount < 8) throw new Error('too few streets');
    // de-duplicate (park ways appear as both polygon and centre)
    const uniq = []; pois.forEach(p => { if (!uniq.some(q => q.name && q.name === p.name && Math.hypot(q.x - p.x, q.y - p.y) < 120)) uniq.push(p); });
    return finishScene({ real: true, nodes, adj, major, minor, small, parks, pois: uniq, streetCount }, seedOf(lat, lng));
  }

  // Procedural night grid — used while loading and whenever the map services can't be reached.
  function buildSketch(lat, lng) {
    const seed = seedOf(lat, lng), r = rng(seed);
    const nodes = new Map(), adj = new Map(), major = new Path2D(), minor = new Path2D(), small = new Path2D(), parks = new Path2D();
    const ang = (r() - .5) * .7, sp = 95 + r() * 30, N = 8, ca = Math.cos(ang), sa = Math.sin(ang);
    const id = (i, j) => (i + 50) * 1000 + (j + 50);
    const put = (i, j) => { const x = i * sp + (r() - .5) * 18, y = j * sp * (0.8 + (i % 3 === 0 ? .05 : 0)) + (r() - .5) * 18; nodes.set(id(i, j), [x * ca - y * sa, x * sa + y * ca]); };
    for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) put(i, j);
    const link = (a, b) => { const p = nodes.get(a), q = nodes.get(b), w = Math.hypot(p[0] - q[0], p[1] - q[1]); (adj.get(a) || adj.set(a, []).get(a)).push([b, w]); (adj.get(b) || adj.set(b, []).get(b)).push([a, w]); };
    const seg = (path, a, b) => { const p = nodes.get(a), q = nodes.get(b); path.moveTo(p[0], p[1]); path.lineTo(q[0], q[1]); };
    const inR = k => { const p = nodes.get(k); return Math.hypot(p[0], p[1]) < R_STREETS + 60; };
    const majI = Math.floor(r() * 4) - 2, majJ = Math.floor(r() * 4) - 2;
    for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) {
      const a = id(i, j); if (!inR(a)) continue;
      [[i + 1, j, j === majJ || j === majJ + 5], [i, j + 1, i === majI || i === majI - 5]].forEach(([u, v, isMaj]) => {
        if (u > N || v > N) return; const b = id(u, v); if (!inR(b)) return;
        if (!isMaj && r() < .09) return;
        seg(isMaj ? major : minor, a, b); link(a, b);
      });
      if (i === j && i < N) { const b = id(i + 1, j + 1); if (inR(b)) { seg(major, a, b); link(a, b); } }
      if (r() < .1 && i < N) { const b = id(i + 1, j - 1); if (j > -N && inR(b)) { seg(small, a, b); link(a, b); } }
    }
    const pois = [];
    for (let k = 0; k < 3; k++) { // park blocks
      const i = Math.floor(r() * 8) - 4, j = Math.floor(r() * 8) - 4;
      const c = [id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1)].map(q => nodes.get(q));
      const mx = c.reduce((s, p) => s + p[0], 0) / 4, my = c.reduce((s, p) => s + p[1], 0) / 4;
      c.forEach((p, n) => { const x = lerp(p[0], mx, .18), y = lerp(p[1], my, .18); n ? parks.lineTo(x, y) : parks.moveTo(x, y); }); parks.closePath();
      pois.push({ x: mx, y: my, name: null, type: 'nature' });
    }
    const types = ['eat', 'eat', 'eat', 'art', 'art', 'landmark', 'curio', 'curio', 'eat', 'landmark', 'art', 'curio'];
    types.forEach(t => { const i = Math.floor(r() * 12) - 6, j = Math.floor(r() * 12) - 6, p = nodes.get(id(i, j)); if (p) pois.push({ x: p[0] + 14, y: p[1] - 12, name: null, type: t }); });
    return finishScene({ real: false, nodes, adj, major, minor, small, parks, pois, streetCount: 0 }, seed);
  }

  /* ---------- network ---------- */
  function overpassQuery(lat, lng) {
    const a = `(around:${R_STREETS},${lat.toFixed(5)},${lng.toFixed(5)})`, b = `(around:${R_POI},${lat.toFixed(5)},${lng.toFixed(5)})`;
    return `[out:json][timeout:20];
way["highway"]["area"!="yes"]${a}->.s;
.s out body qt;
node(w.s);
out skel qt;
way["leisure"~"^(park|playground|garden)$"]${a};
out geom qt 40;
(
  nwr["leisure"~"^(park|playground|garden)$"]["name"]${b};
  nwr["tourism"~"^(artwork|museum|viewpoint|attraction)$"]${b};
  nwr["historic"]["name"]${b};
  nwr["amenity"~"^(cafe|library|ice_cream|bakery|theatre|arts_centre|fountain)$"]${b};
  nwr["shop"~"^(books|bakery|gift|antiques|florist|music|toys|chocolate|second_hand)$"]${b};
);
out center tags qt 160;`;
  }

  async function fetchStreets(lat, lng, signal) {
    const key = `radar:${lat.toFixed(3)},${lng.toFixed(3)}`, cached = ls.get(key);
    if (cached) { try { return JSON.parse(cached); } catch { /* ignore */ } }
    const body = 'data=' + encodeURIComponent(overpassQuery(lat, lng));
    let lastErr;
    for (const url of OVERPASS) {           // one request at a time; the mirror only if the main server fails
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 15000);
      const onAbort = () => ctl.abort(); signal.addEventListener('abort', onAbort);
      try {
        const res = await fetch(url, { method: 'POST', body, signal: ctl.signal, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        // keep a lean copy for this tab session so switching back is instant
        try { const s = JSON.stringify(json); if (s.length < 2.5e6) ls.set(key, s); } catch { /* ignore */ }
        return json;
      } catch (e) { lastErr = e; if (signal.aborted) throw e; }
      finally { clearTimeout(t); signal.removeEventListener('abort', onAbort); }
    }
    throw lastErr;
  }

  /* ---------- loading a place ---------- */
  function setStatus(text, retry) {
    statusEl.hidden = !text; statusT.textContent = text || ''; retryBtn.hidden = !retry;
  }
  async function loadPlace(p) {
    place = p; const seq = ++loadSeq;
    if (fetchCtl) fetchCtl.abort();
    fetchCtl = new AbortController();
    placeEl.textContent = p.label;
    setScene(buildSketch(p.lat, p.lng));
    renderStories();
    setStatus(`Reading the streets of ${p.label}…`);
    try {
      const json = await fetchStreets(p.lat, p.lng, fetchCtl.signal);
      if (seq !== loadSeq) return;
      setScene(buildReal(json, p.lat, p.lng));
      setStatus('');
    } catch (e) {
      if (seq !== loadSeq || e.name === 'AbortError' && fetchCtl.signal.aborted && seq !== loadSeq) return;
      setStatus(navigator.onLine === false ? "You're offline, so this is a sketch of a story map." : 'The map service is busy, so this is a sketch of a story map.', true);
    }
  }
  retryBtn.addEventListener('click', () => place && loadPlace(place));

  function setScene(sc) {
    scene = sc; sceneT0 = performance.now(); modeT0 = sceneT0;
    hidePop();
    resetView(true);
    const counts = Object.fromEntries(GEM_ORDER.map(k => [k, 0]));
    sc.gems.forEach(g => counts[g.type]++);
    app.querySelectorAll('.radar-gemchip').forEach(b => { b.querySelector('.radar-gc').textContent = counts[b.dataset.gem]; });
    placesList.innerHTML = sc.gems.map(g => `<li>${esc(GEMS[g.type].label)} gem: ${esc(g.name || 'unnamed spot')}, ${fmt(g.d)} m away</li>`).join('');
    canvas.setAttribute('aria-label', `Story map of ${place ? place.label : 'your streets'}${sc.real ? '' : ' (sketch)'}, with ${sc.gems.length} location gems. Mode: ${MODES[mode].label}.`);
    updateCaption(true);
    kick();
  }

  /* ---------- view: pan / zoom ---------- */
  function resetView(snap) {
    target.cx = scene ? scene.me[0] * .4 : 0; target.cy = scene ? scene.me[1] * .4 : 0; target.s = s0;
    if (snap || reduce.matches) Object.assign(view, target);
    kick();
  }
  const sMin = () => s0 * .55, sMax = () => s0 * 5;
  function zoomAt(f, px = W / 2, py = H / 2, snap) {
    const ns = clamp(target.s * f, sMin(), sMax());
    const wx = (px - W / 2) / target.s + target.cx, wy = (py - H / 2) / target.s + target.cy;
    target.cx = wx - (px - W / 2) / ns; target.cy = wy - (py - H / 2) / ns; target.s = ns;
    if (snap || reduce.matches) Object.assign(view, target);
    kick();
  }
  const limitPan = () => { const m = R_STREETS + 200; target.cx = clamp(target.cx, -m, m); target.cy = clamp(target.cy, -m, m); };
  const toScreen = (x, y) => [(x - view.cx) * view.s + W / 2, (y - view.cy) * view.s + H / 2];

  const pointers = new Map(); let pinch = null, dragMoved = 0, vel = [0, 0], lastMove = 0, mapActive = false, hintT = 0;
  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, [e.offsetX, e.offsetY]);
    dragMoved = 0; vel = [0, 0]; mapActive = true; canvas.classList.add('is-drag');
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: target.s }; }
  });
  canvas.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId), cur = [e.offsetX, e.offsetY];
    if (pointers.size === 1) {
      const dx = cur[0] - prev[0], dy = cur[1] - prev[1]; dragMoved += Math.abs(dx) + Math.abs(dy);
      target.cx -= dx / target.s; target.cy -= dy / target.s; limitPan();
      view.cx = target.cx; view.cy = target.cy;
      const now = performance.now(), dt = Math.max(1, now - lastMove); lastMove = now;
      vel = [lerp(vel[0], -dx / target.s / dt * 16, .5), lerp(vel[1], -dy / target.s / dt * 16, .5)];
    }
    pointers.set(e.pointerId, cur);
    if (pointers.size === 2 && pinch) {
      const [a, b] = [...pointers.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const pm = [(a[0] + b[0]) / 2 - (cur[0] - prev[0]) / 2, (a[1] + b[1]) / 2 - (cur[1] - prev[1]) / 2];
      target.cx -= (mx - pm[0]) / target.s; target.cy -= (my - pm[1]) / target.s;
      zoomAt((pinch.s * d / pinch.d) / target.s, mx, my, true); dragMoved += 10;
    }
    kick();
  });
  const endPointer = e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null;
    if (!pointers.size) {
      canvas.classList.remove('is-drag');
      if (dragMoved < 6 && e.type === 'pointerup') hitTest(e.offsetX, e.offsetY);
      else if (!reduce.matches && performance.now() - lastMove < 60) { target.cx += vel[0] * 14; target.cy += vel[1] * 14; limitPan(); kick(); }
    }
  };
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('pointerleave', () => { if (!pointers.size) mapActive = false; });
  canvas.addEventListener('wheel', e => {
    // Wheel zooms when you're using the map (or with Ctrl/⌘ — also a trackpad pinch); otherwise the page scrolls as normal.
    if (!(e.ctrlKey || e.metaKey || mapActive || document.activeElement === canvas)) {
      hint.hidden = false; clearTimeout(hintT); hintT = setTimeout(() => { hint.hidden = true; }, 1400); return;
    }
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    zoomAt(Math.exp(-clamp(dy, -120, 120) * (e.ctrlKey ? .012 : .0022)), e.offsetX, e.offsetY);
  }, { passive: false });
  canvas.addEventListener('keydown', e => {
    const step = 70 / target.s, k = e.key;
    if (k === 'ArrowLeft') target.cx -= step; else if (k === 'ArrowRight') target.cx += step;
    else if (k === 'ArrowUp') target.cy -= step; else if (k === 'ArrowDown') target.cy += step;
    else if (k === '+' || k === '=') zoomAt(1.4); else if (k === '-' || k === '_') zoomAt(1 / 1.4);
    else if (k === '0') resetView();
    else return;
    e.preventDefault(); limitPan(); kick();
  });
  app.querySelector('.radar-zoom').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    b.dataset.z === 'in' ? zoomAt(1.5) : b.dataset.z === 'out' ? zoomAt(1 / 1.5) : resetView();
  });

  /* ---------- gem popover ---------- */
  let popGem = null;
  function hitTest(px, py) {
    if (!scene) return;
    let best = null, bd = 26;
    scene.gems.forEach(g => { if (!shown.has(g.type)) return; const [x, y] = toScreen(g.x, g.y); const d = Math.hypot(x - px, y - py); if (d < bd) { bd = d; best = g; } });
    best ? showPop(best) : hidePop();
  }
  function showPop(g) {
    popGem = g;
    const G = GEMS[g.type];
    pop.innerHTML = `${gemSVG(g.type, 'radar-pop-gem')}<div><p class="radar-pop-k">${esc(G.label)} · ${esc(G.shape)}</p><p class="radar-pop-n">${esc(g.name || (scene.real ? 'An unnamed spot' : 'A spot in this sketch'))}</p><p class="radar-pop-d">${fmt(g.d)} m from your spot</p></div>
      <button type="button" class="radar-pop-x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17"/></svg></button>`;
    pop.hidden = false; placePop();
    pop.querySelector('.radar-pop-x').addEventListener('click', () => { hidePop(); canvas.focus(); });
  }
  function placePop() {
    if (!popGem || pop.hidden) return;
    const [x, y] = toScreen(popGem.x, popGem.y), w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.transform = `translate(${clamp(x - w / 2, 8, W - w - 8)}px, ${clamp(y - h - 22, 60, H - h - 8)}px)`;
  }
  function hidePop() { pop.hidden = true; popGem = null; }
  document.addEventListener('pointerdown', e => { if (!pop.hidden && !pop.contains(e.target) && e.target !== canvas) hidePop(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!pop.hidden) { hidePop(); canvas.focus(); } closeResults(); } });

  /* ---------- modes + legend ---------- */
  app.querySelector('.radar-modes').addEventListener('click', e => {
    const b = e.target.closest('.radar-mode'); if (!b || b.dataset.mode === mode) return;
    mode = b.dataset.mode; modeT0 = performance.now();
    app.querySelectorAll('.radar-mode').forEach(x => x.setAttribute('aria-pressed', x === b));
    stage.dataset.mode = mode;
    updateCaption(true); kick();
  });
  stage.dataset.mode = mode;
  app.querySelector('.radar-legend').addEventListener('click', e => {
    const b = e.target.closest('.radar-gemchip'); if (!b) return;
    const k = b.dataset.gem, on = !shown.has(k);
    on ? shown.add(k) : shown.delete(k); b.setAttribute('aria-pressed', on);
    if (popGem && !shown.has(popGem.type)) hidePop();
    kick();
  });

  let capKey = '';
  function updateCaption(announce, p = reduce.matches ? 1 : 0) {
    if (!scene) return;
    let m = MODES[mode].label, t;
    if (mode === 'walk') {
      if (!scene.walk) t = 'Walk somewhere new and the next chapter unlocks';
      else { const total = Math.round(scene.walk.len / .75 / 10) * 10, left = Math.round(total * (1 - p) / 10) * 10; t = p >= 1 ? 'Chapter 2 unlocked' : `${fmt(left)} steps to Chapter 2`; if (announce) live.textContent = `Walk mode. About ${fmt(total)} steps along these streets unlocks Chapter 2.`; }
    } else if (mode === 'path') {
      const r = scene.route; const n = r && (r.poi.name || (r.poi.type === 'nature' ? 'the park around the corner' : 'a spot around the corner'));
      t = r ? `Chapter 2 waits at ${n} · ${fmt(r.len)} m` : 'Chapter 2 waits at a real place nearby';
      if (announce) live.textContent = `Path mode. ${t.replace(' · ', ', ')}.`;
    } else {
      t = 'Photograph something red';
      if (announce) live.textContent = 'Hunt mode. Find something red and photograph it.';
    }
    const key = m + t; if (key === capKey) return; capKey = key;
    capMode.textContent = m; capT.textContent = t;
    canvas.setAttribute('aria-label', canvas.getAttribute('aria-label').replace(/Mode: \w+\./, `Mode: ${m}.`));
  }

  /* ---------- drawing ---------- */
  function makeSprites() {
    sprites = {};
    const S = 46;
    GEM_ORDER.forEach(k => {
      const c = document.createElement('canvas'); c.width = c.height = Math.round(S * dpr);
      const g = c.getContext('2d'), G = GEMS[k], col = C[G.v.slice(2)];
      g.scale(dpr, dpr); g.translate(S / 2, S / 2); g.scale(26 / 40, 26 / 40); g.translate(-20, -20);
      g.shadowColor = rgba(col, .65); g.shadowBlur = 14 * dpr;
      G.paths.forEach(([t, d]) => {
        const p = new Path2D(d);
        if (t === 'h') { g.shadowBlur = 0; g.strokeStyle = rgba(C.starlight, .6); g.lineWidth = 1.6; g.lineCap = 'round'; g.stroke(p); }
        else { g.fillStyle = t === 'm' ? rgba(col, 1) : rgba(C.ink, t === 's' ? .35 : .5); g.fill(p); g.shadowBlur = 0; }
      });
      sprites[k] = c;
    });
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const ow = W; W = r.width; H = r.height; dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const prevS0 = s0; s0 = Math.min(W, H) / (2 * 470);
    if (ow) { const f = s0 / prevS0; view.s *= f; target.s *= f; } else Object.assign(view, { s: s0 }), target.s = s0;
    makeSprites(); needsDraw = true; kick();
  }

  function strokeWorld(path, px, col) {
    const k = Math.pow(view.s / s0, .55);
    ctx.lineWidth = px * k / view.s; ctx.strokeStyle = col; ctx.stroke(path);
  }

  function draw(now) {
    const sc = scene; if (!sc || !W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = rgba(C.midnight, 1); ctx.fillRect(0, 0, W, H);
    const fadeIn = reduce.matches ? 1 : clamp((now - sceneT0) / 700, 0, 1);
    ctx.globalAlpha = ease(fadeIn);

    // world layer
    ctx.setTransform(dpr * view.s, 0, 0, dpr * view.s, dpr * (W / 2 - view.cx * view.s), dpr * (H / 2 - view.cy * view.s));
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = rgba(C.velvet, .95); ctx.fill(sc.parks, 'evenodd');
    strokeWorld(sc.parks, 1, rgba(C.emerald, .18));
    strokeWorld(sc.small, 1.2, rgba(C.line, .75));
    strokeWorld(sc.minor, 4, rgba(C.velvet, 1));
    strokeWorld(sc.minor, 2, rgba(C.line, 1));
    strokeWorld(sc.major, 8, rgba(C.velvet, 1));
    strokeWorld(sc.major, 3.6, rgba(C.line, 1));
    strokeWorld(sc.major, 1, rgba(C.lilac, .35));
    // edge fade so the fetched circle melts into the night
    const fg = ctx.createRadialGradient(0, 0, R_STREETS * .62, 0, 0, R_STREETS * 1.02);
    fg.addColorStop(0, rgba(C.midnight, 0)); fg.addColorStop(1, rgba(C.midnight, 1));
    ctx.fillStyle = fg; ctx.fillRect(-R_STREETS * 3, -R_STREETS * 3, R_STREETS * 6, R_STREETS * 6);

    const t = (now - modeT0) / 1000, still = reduce.matches;
    let walkP = 1, huntA = -Math.PI / 4;
    const me = sc.me;

    if (mode === 'path' && sc.route) drawPath(sc.route, t, still);
    if (mode === 'walk' && sc.walk) walkP = drawWalk(sc.walk, t, still);
    if (mode === 'hunt') huntA = drawHunt(me, t, still);

    // screen layer
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sc.gems.forEach(g => {
      if (!shown.has(g.type)) return;
      const [x, y] = toScreen(g.x, g.y); if (x < -30 || y < -30 || x > W + 30 || y > H + 30) return;
      let sz = 1;
      if (mode === 'hunt') { const a = Math.atan2(g.y - me[1], g.x - me[0]); const da = Math.abs(((a - huntA + Math.PI * 3) % (Math.PI * 2)) - Math.PI); sz = da < .45 && g.d < 470 ? 1.28 : .9; }
      if (popGem === g) sz = 1.3;
      const S = 46 * sz; ctx.drawImage(sprites[g.type], x - S / 2, y - S / 2, S, S);
    });
    if (mode === 'path' && sc.route) drawPin(sc.route, t, still);
    if (mode === 'hunt' && sc.red) drawFinder(sc.red, me, huntA, t, still);
    drawMe(me, t, still, walkP);
    ctx.globalAlpha = 1;
    if (mode === 'walk') updateCaption(false, walkP);
    placePop();
  }

  function drawWalk(w, t, still) {
    const CYCLE = 7.5, HOLD = 2.2, raw = still ? 1 : (t % (CYCLE + HOLD)) / CYCLE, p = Math.min(1, raw);
    const n = w.dots.length, upto = Math.max(1, Math.floor(ease(p) * (n - 1)) + 1), rad = 2.6 / view.s * Math.pow(view.s / s0, .4);
    for (let i = 0; i < upto; i++) {
      const [x, y] = w.dots[i], c = mix(C.citrine, C.emerald, i / (n - 1));
      ctx.fillStyle = rgba(c, .35 + .65 * (i / upto)); ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }
    // shrinking ring around where you are on the walk
    const [hx, hy] = w.dots[upto - 1], col = mix(C.citrine, C.emerald, (upto - 1) / (n - 1));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const [sx, sy] = toScreen(hx, hy);
    const ringR = lerp(54, 14, ease(p));
    ctx.lineWidth = 2; ctx.strokeStyle = rgba(col, .85); ctx.beginPath(); ctx.arc(sx, sy, ringR, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = rgba(col, 1); ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();
    if (p >= 1) { // arrived: emerald bloom + chapter tag
      const q = still ? .4 : clamp((raw - 1) * CYCLE / HOLD, 0, 1);
      ctx.strokeStyle = rgba(C.emerald, .7 * (1 - q)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, 14 + q * 46, 0, Math.PI * 2); ctx.stroke();
      tag(sx, sy - 30, 'Chapter 2 unlocked', C.emerald, C.midnight);
    }
    ctx.setTransform(dpr * view.s, 0, 0, dpr * view.s, dpr * (W / 2 - view.cx * view.s), dpr * (H / 2 - view.cy * view.s));
    return p;
  }

  function partial(pts, len) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let L = 0;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], s = Math.hypot(bx - ax, by - ay);
      if (L + s >= len) { const k = (len - L) / s; ctx.lineTo(lerp(ax, bx, k), lerp(ay, by, k)); return; }
      ctx.lineTo(bx, by); L += s;
    }
  }
  function drawPath(r, t, still) {
    const p = still ? 1 : ease(clamp(t / 2.4, 0, 1)), k = Math.pow(view.s / s0, .5) / view.s;
    partial(r.pts, r.len * p);
    ctx.strokeStyle = rgba(C.sapphire, .22); ctx.lineWidth = 14 * k; ctx.stroke();
    ctx.strokeStyle = rgba(C.sapphire, 1); ctx.lineWidth = 5 * k; ctx.stroke();
    if (p >= 1 && !still) { ctx.setLineDash([2 * k, 16 * k]); ctx.lineDashOffset = -t * 30 * k; ctx.strokeStyle = rgba(C.starlight, .75); ctx.lineWidth = 2.4 * k; ctx.stroke(); ctx.setLineDash([]); }
  }
  function drawPin(r, t, still) {
    const p = still ? 1 : clamp((t - 2.0) / .5, 0, 1); if (p <= 0) return;
    const [x, y0] = toScreen(r.pts[r.pts.length - 1][0], r.pts[r.pts.length - 1][1]), y = y0 - (1 - ease(p)) * 18;
    ctx.globalAlpha = p;
    ctx.fillStyle = rgba(C.sapphire, .25); ctx.beginPath(); ctx.ellipse(x, y0, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(C.sapphire, 1); ctx.beginPath();
    ctx.moveTo(x, y); ctx.bezierCurveTo(x - 4, y - 8, x - 13, y - 15, x - 13, y - 24); ctx.arc(x, y - 24, 13, Math.PI, 0); ctx.bezierCurveTo(x + 13, y - 15, x + 4, y - 8, x, y); ctx.fill();
    ctx.fillStyle = rgba(C.starlight, 1); ctx.beginPath(); ctx.arc(x, y - 24, 4.5, 0, Math.PI * 2); ctx.fill();
    const name = r.poi.name || (r.poi.type === 'nature' ? 'The park' : 'Around the corner');
    tag(x, y - 50, `Chapter 2 · ${name.length > 30 ? name.slice(0, 29) + '…' : name}`, C.sapphire, C.midnight);
    ctx.globalAlpha = 1;
  }
  function drawHunt(me, t, still) {
    const a = still ? -Math.PI / 4 : t * (Math.PI * 2 / 6) - Math.PI / 2, R = 470, half = .42;
    const g = ctx.createRadialGradient(me[0], me[1], 0, me[0], me[1], R);
    g.addColorStop(0, rgba(C.amethyst, .5)); g.addColorStop(.7, rgba(C.amethyst, .16)); g.addColorStop(1, rgba(C.amethyst, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(me[0], me[1]); ctx.arc(me[0], me[1], R, a - half, a + half * .35); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(C.amethyst, .8); ctx.lineWidth = 2 / view.s; ctx.beginPath(); ctx.moveTo(me[0], me[1]); ctx.lineTo(me[0] + Math.cos(a + half * .35) * R * .95, me[1] + Math.sin(a + half * .35) * R * .95); ctx.stroke();
    ctx.setLineDash([4 / view.s, 8 / view.s]); ctx.strokeStyle = rgba(C.amethyst, .3); ctx.lineWidth = 1.2 / view.s;
    [160, 320].forEach(rr => { ctx.beginPath(); ctx.arc(me[0], me[1], rr, 0, Math.PI * 2); ctx.stroke(); }); ctx.setLineDash([]);
    return a;
  }
  let redSeen = -9;
  function drawFinder(g, me, a, t, still) {
    const ga = Math.atan2(g.y - me[1], g.x - me[0]), da = Math.abs(((ga - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (da < .4 || still) redSeen = t;
    const q = still ? 1 : clamp(1 - (t - redSeen) / 2.6, 0, 1); if (q <= 0) return;
    const [x, y] = toScreen(g.x, g.y), s = 26 + (1 - q) * 8, L = 9;
    ctx.globalAlpha = q; ctx.strokeStyle = rgba(C.amethyst, 1); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(x + dx * s, y + dy * (s - L)); ctx.lineTo(x + dx * s, y + dy * s); ctx.lineTo(x + dx * (s - L), y + dy * s); ctx.stroke(); });
    tag(x, y - s - 18, 'Something red?', C.amethyst, C.midnight);
    ctx.globalAlpha = 1;
  }
  function drawMe(me, t, still, walkP) {
    const [x, y] = toScreen(me[0], me[1]), pulse = still ? .5 : (t % 2.2) / 2.2;
    ctx.fillStyle = rgba(C.glow, .35 * (1 - pulse)); ctx.beginPath(); ctx.arc(x, y, 9 + pulse * 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(C.midnight, 1); ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(C.starlight, 1); ctx.beginPath(); ctx.arc(x, y, 6.5, 0, Math.PI * 2); ctx.fill();
    if (mode === 'walk' && walkP < .08 && !still) tag(x, y - 26, 'You start here', C.starlight, C.midnight);
  }
  function tag(x, y, text, bg, fg) {
    ctx.font = '700 12.5px Karla, system-ui, sans-serif';
    const w = ctx.measureText(text).width + 20, h = 24;
    const lx = clamp(x - w / 2, 6, W - w - 6), ly = clamp(y - h / 2, 6, H - h - 6);
    ctx.fillStyle = rgba(bg, 1); ctx.beginPath(); ctx.roundRect ? ctx.roundRect(lx, ly, w, h, 12) : ctx.rect(lx, ly, w, h); ctx.fill();
    ctx.fillStyle = rgba(fg, 1); ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(text, lx + 10, ly + h / 2 + .5);
  }

  /* ---------- loop: runs only while visible; idles under reduced motion ---------- */
  function kick() { needsDraw = true; if (!running && visible) { running = true; requestAnimationFrame(frame); } }
  function frame(now) {
    const k = reduce.matches ? 1 : .22;
    let moving = false;
    ['cx', 'cy', 's'].forEach(p => { const d = target[p] - view[p]; if (Math.abs(d) > (p === 's' ? s0 * 1e-4 : .02)) { view[p] += d * k; moving = true; } else view[p] = target[p]; });
    const animating = !reduce.matches && visible && !document.hidden;
    if (needsDraw || moving || animating || pointers.size) { draw(now); needsDraw = false; }
    if (visible && (moving || animating || pointers.size)) requestAnimationFrame(frame); else running = false;
  }
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) { if (!place) start(); kick(); } }, { rootMargin: '200px' }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  reduce.addEventListener?.('change', () => { modeT0 = performance.now(); kick(); });
  new ResizeObserver(resize).observe(stage);

  /* ---------- stories card ---------- */
  function loadStories() {
    if (storiesReady) return storiesReady;
    storiesReady = fetch('data/stories.json').then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { const arr = Array.isArray(d) ? d : d.stories; if (!arr || !arr.length) throw 0; stories = arr; })
      .catch(() => { stories = FALLBACK_STORIES; })
      .then(renderStories);
    return storiesReady;
  }
  function renderStories() {
    if (!stories.length) { list.innerHTML = '<li class="radar-empty">Finding stories…</li>'; return; }
    const lat = place?.lat, lng = place?.lng;
    const local = lat == null ? [] : stories.filter(s => s.type !== 'anywhere' && s.lat != null && s.lng != null)
      .map(s => ({ s, km: kmBetween(lat, lng, s.lat, s.lng) })).filter(o => o.km <= LOCAL_KM).sort((a, b) => (b.s.reviews || 0) - (a.s.reviews || 0) || a.km - b.km).slice(0, 4);
    const anywhere = stories.filter(s => s.type === 'anywhere').slice(0, local.length ? 3 : 5).map(s => ({ s }));
    const item = ({ s, km }) => `<li class="radar-story">
      ${s.cover ? `<img src="${esc(s.cover)}" alt="" loading="lazy" decoding="async" width="56" height="84">` : `<span class="radar-noimg"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${SPARK}"/></svg></span>`}
      <div><p class="radar-st-type">${km != null ? `Local · ${km < 1 ? 'under 1' : fmt(km)} km away` : 'Play Anywhere'}</p>
        <h4>${esc(s.name)}</h4>
        <p class="radar-st-meta">${s.minutes ? `${fmt(s.minutes)} min` : 'Story'}${s.genre ? ` · ${esc(s.genre)}` : ''}</p>
        <a href="#demo" class="radar-st-link">Read the First Chapter<span class="sr-only">: ${esc(s.name)}</span></a></div></li>`;
    list.innerHTML = (local.length ? `<li class="radar-group">Written for here</li>${local.map(item).join('')}` : '')
      + `<li class="radar-group">${local.length ? 'Plays on any street' : 'Plays on these streets'}</li>${anywhere.map(item).join('')}`;
  }

  /* ---------- inputs: presets, search, geolocation ---------- */
  async function initPresets() {
    let presets = PRESETS;
    try {
      const d = await fetch('data/cities.json').then(r => r.ok ? r.json() : null);
      const known = d && (d.cities || d);
      if (Array.isArray(known) && known.length) {
        // keep the brief's eight; check each against the catalogue so the list notes where local stories exist
        presets = PRESETS.map(p => { const c = known.find(k => (k.city || k.name) === p.name); return { ...p, local: c ? c.local ?? c.count ?? 0 : 0 }; });
      }
    } catch { /* fine, use built-ins */ }
    select.insertAdjacentHTML('beforeend', presets.map((p, i) => `<option value="${i}">${esc(p.name)}${p.local ? ` · ${p.local} local ${p.local === 1 ? 'story' : 'stories'}` : ''}</option>`).join(''));
    select.addEventListener('change', () => { const p = presets[+select.value]; if (p) { input.value = ''; loadPlace({ label: p.name, lat: p.lat, lng: p.lng }); } });
    return presets;
  }
  let presetsReady = null;
  async function start() {
    if (place) return;
    const ps = await presetsReady;
    if (place) return;
    select.value = '0';
    loadPlace({ label: ps[0].name, lat: ps[0].lat, lng: ps[0].lng });
  }

  // Nominatim: debounced, one request in flight, at most one per ~1.1 s (usage policy)
  let qTimer = 0, qCtl = null, qLast = 0, found = [], active = -1;
  function closeResults() { results.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; }
  function showResults(msg) {
    results.innerHTML = msg ? `<li class="radar-res-msg" role="presentation">${esc(msg)}</li>` : found.map((f, i) => {
      const parts = f.display_name.split(', ');
      return `<li role="option" id="radar-opt-${i}" aria-selected="${i === active}" data-i="${i}"><b>${esc(parts[0])}</b><span>${esc(parts.slice(1, 4).join(', '))}</span></li>`;
    }).join('');
    results.hidden = false; input.setAttribute('aria-expanded', 'true');
  }
  async function geocode(q, thenPick) {
    if (qCtl) qCtl.abort();
    qCtl = new AbortController(); qLast = Date.now();
    try {
      const url = `${NOMINATIM}?format=jsonv2&limit=5&q=${encodeURIComponent(q)}&accept-language=${encodeURIComponent(navigator.language || 'en')}`;
      const res = await fetch(url, { signal: qCtl.signal, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      found = await res.json(); active = -1;
      if (input.value.trim() !== q) return;
      if (!found.length) return showResults('No places found. Try a city name.');
      if (thenPick) return pick(0);
      showResults();
    } catch (e) { if (e.name !== 'AbortError') showResults("Search isn't answering right now. Pick a city instead."); }
  }
  function schedule(q, now) {
    clearTimeout(qTimer);
    const wait = Math.max(now ? 0 : 650, 1100 - (Date.now() - qLast));
    qTimer = setTimeout(() => geocode(q, now), wait);
  }
  function pick(i) {
    const f = found[i]; if (!f) return;
    const label = f.display_name.split(', ')[0];
    input.value = label; closeResults(); select.value = '';
    loadPlace({ label, lat: +f.lat, lng: +f.lon });
  }
  input.addEventListener('input', () => { const q = input.value.trim(); if (q.length < 3) { clearTimeout(qTimer); closeResults(); return; } schedule(q); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!found.length || results.hidden) return; e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + found.length) % found.length; showResults();
      input.setAttribute('aria-activedescendant', `radar-opt-${active}`);
    } else if (e.key === 'Enter') {
      e.preventDefault(); const q = input.value.trim(); if (q.length < 2) return;
      if (!results.hidden && found.length) pick(Math.max(0, active)); else schedule(q, true);
    } else if (e.key === 'Escape') closeResults();
  });
  results.addEventListener('click', e => { const li = e.target.closest('[data-i]'); if (li) pick(+li.dataset.i); });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.radar-search')) closeResults(); });

  locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) { setStatus("This browser can't share a location. Type a place instead."); return; }
    locateBtn.disabled = true; setStatus('Finding your spot…');
    navigator.geolocation.getCurrentPosition(pos => {
      locateBtn.disabled = false; input.value = ''; select.value = '';
      loadPlace({ label: 'your streets', lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, err => {
      locateBtn.disabled = false;
      setStatus(err.code === 1 ? 'No problem. Type a place or pick a city instead.' : "Couldn't find your spot. Type a place instead.");
      setTimeout(() => { if (statusT.textContent.startsWith('No problem') || statusT.textContent.startsWith("Couldn't")) setStatus(''); }, 4000);
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  });

  /* ---------- go ---------- */
  readColours();
  presetsReady = initPresets();
  loadStories();
  window.SC_RADAR = { load: loadPlace, get scene() { return scene; } };
})();
