// Map sheet for the first-time user mockup.
// Three visual modes, one colour each:
//   walk to unlock  -> dotted trail yellow -> green + a thin ring that shrinks as you walk
//   nearby spot     -> solid blue route to a blue pin
//   scavenger hunt  -> purple viewfinder corners, sonar sweep, camera button
// Plus the gem drop after the hunt.

const NS = 'http://www.w3.org/2000/svg';
const W = 390;
const H = 640;

// Two routes through the same pretend neighbourhood.
const ROUTES = {
  out: {
    start: [195, 520],
    walk: [[195, 520], [195, 300], [120, 300], [120, 262]],
    walkSteps: 220,
    ring: 200,
    auto: [[120, 262], [120, 230], [248, 230]],
    autoDist: '60 m',
    hunt: [[248, 230], [262, 214], [292, 196], [300, 170]],
  },
  in: {
    start: [195, 520],
    walk: [[195, 520], [195, 470], [160, 470], [160, 440]],
    walkSteps: 30,
    ring: 90,
    auto: [[160, 440], [160, 420], [228, 420]],
    autoDist: '8 steps',
    hunt: [[228, 420], [240, 404], [252, 396]],
  },
  // Country road: no street corners or streetlights, so the "nearby spot" is a
  // marker the story drops on the road (the fallback when auto-placement finds nothing).
  rural: {
    start: [200, 560],
    walk: [[200, 560], [200, 540], [170, 470], [175, 400]],
    walkSteps: 300,
    ring: 220,
    auto: [[175, 400], [225, 330], [230, 280]],
    autoDist: '150 m',
    hunt: [[230, 280], [250, 262], [268, 252]],
  },
};

const COUNTRY_ROAD = [[200, 640], [200, 540], [170, 470], [175, 400], [225, 330], [230, 250], [200, 180], [190, 90], [205, 0]];

const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.append(n);
  return n;
};

const lerp = (a, b, t) => a + (b - a) * t;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function mix(a, b, t) {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`;
}

function pathLength(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return len;
}

function pointAt(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    if (d <= seg) return [lerp(x0, x1, d / seg), lerp(y0, y1, d / seg)];
    d -= seg;
  }
  return pts[pts.length - 1];
}

function polyPath(pts) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
}

function drawStreets(g) {
  el('rect', { width: W, height: H, class: 'm-ground' }, g);
  const blocksX = [0, 40, 120, 195, 280, 360, W];
  const blocksY = [0, 90, 230, 300, 440, 560, H];
  for (let i = 0; i < blocksX.length - 1; i++) {
    for (let j = 0; j < blocksY.length - 1; j++) {
      const park = (i === 4 && j === 1) || (i === 1 && j === 4);
      el('rect', {
        x: blocksX[i] + 9, y: blocksY[j] + 9,
        width: Math.max(0, blocksX[i + 1] - blocksX[i] - 18), height: Math.max(0, blocksY[j + 1] - blocksY[j] - 18),
        rx: 6, class: park ? 'm-park' : 'm-block',
      }, g);
    }
  }
  [40, 120, 280, 360].forEach((x) => el('line', { x1: x, y1: 0, x2: x, y2: H, class: 'm-road' }, g));
  [90, 230, 440, 560].forEach((y) => el('line', { x1: 0, y1: y, x2: W, y2: y, class: 'm-road' }, g));
  el('line', { x1: 195, y1: 0, x2: 195, y2: H, class: 'm-road main' }, g);
  el('line', { x1: 0, y1: 300, x2: W, y2: 300, class: 'm-road main' }, g);
  // Trees in the parks, for the hunt.
  [[300, 120], [330, 150], [312, 190], [345, 200], [290, 165], [70, 470], [95, 500]].forEach(([x, y]) => {
    el('circle', { cx: x, cy: y, r: 9, class: 'm-tree' }, g);
  });
  const label = el('text', { x: 320, y: 112, class: 'm-label', 'text-anchor': 'middle' }, g);
  label.textContent = 'Maple Park';
  const street = el('text', { x: 205, y: 294, class: 'm-label small' }, g);
  street.textContent = 'Main St';
}

function drawCountry(g) {
  el('rect', { width: W, height: H, class: 'm-ground' }, g);
  [[10, 20, 150, 150, -4], [230, 30, 150, 120, 3], [20, 250, 130, 170, 2], [260, 380, 120, 150, -3], [20, 470, 130, 150, 4]].forEach(([x, y, w, h, r]) => {
    el('rect', { x, y, width: w, height: h, rx: 10, class: 'm-field', transform: `rotate(${r} ${x + w / 2} ${y + h / 2})` }, g);
  });
  el('path', { d: 'M0 360 C80 340 110 420 170 380 S 300 300 390 330', class: 'm-creek' }, g);
  el('path', { d: polyPath(COUNTRY_ROAD), class: 'm-road country' }, g);
  el('path', { d: 'M200 560 H246', class: 'm-road lane' }, g);
  el('rect', { x: 246, y: 546, width: 26, height: 22, rx: 3, class: 'm-house' }, g);
  [[290, 240], [305, 262], [280, 268], [318, 236], [60, 200], [80, 222], [330, 470], [120, 600]].forEach(([x, y]) => {
    el('circle', { cx: x, cy: y, r: 11, class: 'm-tree' }, g);
  });
  const label = el('text', { x: 212, y: 470, class: 'm-label small' }, g);
  label.textContent = 'Range Rd 24';
}

export function createMap({ phone, getSpeed, camera }) {
  const sheet = document.createElement('section');
  sheet.className = 'card-overlay map-sheet';
  sheet.hidden = true;
  sheet.innerHTML = `
    <div class="sheet glass map-wrap" role="dialog" aria-modal="true" aria-label="Map">
      <div class="sheet-bar"><span class="map-title"></span><button class="pill-btn map-back">Chat</button></div>
      <div class="map-stage">
        <svg class="map-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"></svg>
        <div class="viewfinder" hidden><i></i><i></i><i></i><i></i></div>
        <div class="map-hud glass">
          <span class="mode-chip"></span>
          <div class="hud-title"></div>
          <div class="hud-bar" hidden><i></i></div>
        </div>
        <div class="map-key glass">
          <span data-k="walk"><b class="k-walk"></b>Walk to unlock</span>
          <span data-k="auto"><b class="k-auto"></b>Nearby spot</span>
          <span data-k="hunt"><b class="k-hunt"></b>Scavenger hunt</span>
        </div>
        <div class="map-flash" hidden></div>
      </div>
      <div class="map-foot"></div>
    </div>`;
  phone.append(sheet);

  const $ = (s) => sheet.querySelector(s);
  const svg = $('.map-svg');
  const base = el('g', {}, svg);
  const trails = el('g', {}, svg);
  const live = el('g', {}, svg);
  const gems = el('g', {}, svg);
  const me = el('g', { class: 'm-me' }, svg);
  el('circle', { r: 16, class: 'm-me-pulse' }, me);
  el('circle', { r: 7, class: 'm-me-dot' }, me);
  let baseKind = 'town';
  drawStreets(base);
  function setBase(kind) {
    if (kind === baseKind) return;
    base.innerHTML = '';
    (kind === 'rural' ? drawCountry : drawStreets)(base);
    baseKind = kind;
  }

  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  let pos = ROUTES.out.start;
  let photo = null;
  let raf = 0;

  function place([x, y]) {
    pos = [x, y];
    me.setAttribute('transform', `translate(${x} ${y})`);
  }

  let hurry = false;
  function frame(ms, fn) {
    hurry = false;
    return new Promise((resolve) => {
      const t0 = performance.now();
      const dur = ms / getSpeed();
      const tick = (now) => {
        const t = hurry ? 1 : Math.min(1, (now - t0) / dur);
        fn(t);
        if (t < 1 && !sheet.hidden) raf = requestAnimationFrame(tick);
        else resolve();
      };
      raf = requestAnimationFrame(tick);
    });
  }

  function setMode(kind, title) {
    sheet.dataset.mode = kind;
    const chip = { walk: 'Walk to unlock', auto: 'Nearby spot', hunt: 'Scavenger hunt', gem: 'Location gem' }[kind];
    $('.mode-chip').textContent = chip;
    $('.hud-title').textContent = title;
    $('.hud-bar').hidden = kind !== 'walk';
    $('.viewfinder').hidden = kind !== 'hunt';
    sheet.querySelectorAll('.map-key span').forEach((s) => s.classList.toggle('on', s.dataset.k === kind));
  }

  function foot(html) {
    $('.map-foot').innerHTML = html;
    return $('.map-foot');
  }

  function button(text, cls = '') {
    const b = document.createElement('button');
    b.className = `cta ${cls}`;
    b.textContent = text;
    $('.map-foot').append(b);
    return new Promise((r) => b.addEventListener('click', r, { once: true }));
  }

  // --- walk to unlock -----------------------------------------------------
  async function walk(route) {
    const total = route.walkSteps;
    setMode('walk', `${total} steps to go`);
    const f = foot(`<p class="map-note">Look around, not at your phone. We’ll chime when you’re there.</p>
      <button class="link-btn">Skip the walk (demo)</button>`);
    f.querySelector('.link-btn').addEventListener('click', () => { hurry = true; });
    let quarter = 0;
    const pts = route.walk;
    const len = pathLength(pts);
    const yellow = css('--walk-start');
    const green = css('--walk-end');
    const ring = el('circle', { r: route.ring, class: 'm-ring' }, live);
    const dots = el('g', {}, live);
    const bar = $('.hud-bar i');
    let laid = 0;
    await frame(route.walkSteps > 250 ? 8000 : route.walkSteps > 50 ? 7000 : 4200, (t) => {
      const p = pointAt(pts, len * t);
      place(p);
      while (laid <= len * t) {
        const d = pointAt(pts, laid);
        el('circle', { cx: d[0], cy: d[1], r: 2.6, fill: mix(yellow, green, laid / len) }, dots);
        laid += 9;
      }
      const colour = mix(yellow, green, t);
      ring.setAttribute('cx', p[0]);
      ring.setAttribute('cy', p[1]);
      ring.setAttribute('r', Math.max(0, route.ring * (1 - t)));
      ring.setAttribute('stroke', colour);
      bar.style.width = `${t * 100}%`;
      if (Math.floor(t * 4) > quarter && t < 1) {
        quarter = Math.floor(t * 4);
        $('.map-hud').animate([{ transform: 'scale(1.03)' }, { transform: 'none' }], 260);
      }
      const left = Math.ceil(total * (1 - t));
      $('.hud-title').textContent = left ? `${left} steps to go` : 'Unlocked!';
    });
    ring.remove();
    dots.classList.add('done');
    trails.append(dots);
    burst(pos, green);
    foot('<p class="map-note strong">Chapter unlocked ✓</p>');
    // Arrival is automatic: no button to tap (only the hunt needs a tap, for the photo).
    await new Promise((r) => setTimeout(r, 1300 / getSpeed()));
  }

  // --- nearby spot (auto-placed) -----------------------------------------
  async function auto(route, placeName) {
    const pts = route.auto;
    const end = pts[pts.length - 1];
    setMode('auto', `${placeName} · ${route.autoDist}`);
    foot('<p class="map-note">Story City found a real spot near you. Use it, or walk the full distance instead.</p>');
    const full = el('path', { d: polyPath(pts), class: 'm-route' }, live);
    const done = el('path', { d: polyPath(pts), class: 'm-route live' }, live);
    const pin = el('g', { class: 'm-pin', transform: `translate(${end[0]} ${end[1]})` }, live);
    el('path', { d: 'M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z', class: 'm-pin-body' }, pin);
    el('path', { d: 'M-4 -30 h8 M0 -30 v10 M-5 -20 h10', class: 'm-pin-icon' }, pin);
    const tag = el('text', { x: 0, y: -44, class: 'm-label pin', 'text-anchor': 'middle' }, pin);
    tag.textContent = placeName;
    const len = pathLength(pts);
    done.style.strokeDasharray = `${len}`;
    done.style.strokeDashoffset = `${len}`;
    await new Promise((r) => setTimeout(r, 700 / getSpeed()));
    await frame(3600, (t) => {
      place(pointAt(pts, len * t));
      done.style.strokeDashoffset = `${len * (1 - t)}`;
    });
    full.remove();
    done.classList.add('arrived');
    trails.append(done, pin);
    pin.classList.add('arrived');
    $('.hud-title').textContent = `You’re at the ${placeName.toLowerCase()}`;
    foot('<p class="map-note strong">You’ve arrived ✓</p>');
    await new Promise((r) => setTimeout(r, 1300 / getSpeed()));
  }

  // --- scavenger hunt -----------------------------------------------------
  function hunt(route, find, indoor, rural) {
    setMode('hunt', `Find: ${find}`);
    const zone = el('g', { class: 'm-zone', transform: `translate(${pos[0]} ${pos[1]})` }, live);
    el('circle', { r: 120, class: 'm-zone-fill' }, zone);
    el('circle', { r: 120, class: 'm-zone-edge' }, zone);
    const sweep = el('path', { d: 'M0 0 L120 0 A120 120 0 0 0 85 -85 Z', class: 'm-sweep' }, zone);
    let angle = 0;
    let spinning = true;
    (function spin() {
      if (!spinning || sheet.hidden) return;
      angle = (angle + 1.6 * getSpeed()) % 360;
      sweep.setAttribute('transform', `rotate(${-angle})`);
      requestAnimationFrame(spin);
    })();
    // Wander a little while searching.
    const pts = route.hunt;
    const len = pathLength(pts);
    frame(6000, (t) => place(pointAt(pts, len * t)));

    const f = foot(`
      <p class="map-note">${indoor ? 'Search your home. Snap it when you find it.' : rural ? 'Search around you. It might take a short walk. Snap it when you find it.' : 'Search your neighbourhood. It might take a short walk. Snap it when you find it.'}</p>
      <div class="shutter-row">
        <button class="shutter" aria-label="Take photo"><i></i></button>
      </div>
      `);
    return new Promise((resolve) => {
      const finish = async (src) => {
        spinning = false;
        const flash = $('.map-flash');
        flash.hidden = false;
        await new Promise((r) => setTimeout(r, 260));
        flash.hidden = true;
        zone.remove();
        photo = src;
        resolve(src);
      };
      let busy = false;
      f.querySelector('.shutter').addEventListener('click', async () => {
        if (busy) return;
        busy = true;
        const src = await camera(indoor ? 'img/snap-shelf.svg' : 'img/tree-photo.jpg', `Pointing at ${find.toLowerCase()}…`);
        finish(src);
      });
    });
  }

  // --- first location gem -------------------------------------------------
  async function gem() {
    setMode('gem', 'Your first location gem');
    const g = el('g', { class: 'm-gem', transform: `translate(${pos[0]} ${pos[1]})` }, gems);
    el('circle', { r: 24, class: 'm-gem-ring' }, g);
    const clip = `clip${Date.now()}`;
    const cp = el('clipPath', { id: clip }, g);
    el('circle', { r: 20 }, cp);
    el('image', { href: photo || 'img/tree-photo.jpg', x: -20, y: -20, width: 40, height: 40, 'clip-path': `url(#${clip})`, preserveAspectRatio: 'xMidYMid slice' }, g);
    el('path', { d: 'M0 -40 l9 9 -9 12 -9 -12z', class: 'm-gem-icon' }, g);
    const f = foot(`
      <div class="gem-card">
        <div class="gem-thumb"></div>
        <div>
          <div class="gem-name">My first location gem</div>
          <div class="gem-meta">🔒 Private · only you can see it</div>
          <div class="gem-meta">Add details and make it public anytime.</div>
        </div>
      </div>`);
    f.querySelector('.gem-thumb').style.backgroundImage = `url("${photo || 'img/tree-photo.jpg'}")`;
    await button('Save gem');
    burst(pos, css('--hunt'));
    g.classList.add('saved');
    $('.hud-title').textContent = 'Gem saved to your map';
    foot('<p class="map-note strong">💎 Saved · private to you</p>');
    await new Promise((r) => setTimeout(r, 1100 / getSpeed()));
  }

  function burst([x, y], colour) {
    const g = el('g', { class: 'm-burst', transform: `translate(${x} ${y})` }, svg);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      el('line', { x1: Math.cos(a) * 10, y1: Math.sin(a) * 10, x2: Math.cos(a) * 26, y2: Math.sin(a) * 26, stroke: colour }, g);
    }
    setTimeout(() => g.remove(), 900);
  }

  let closeFn = null;

  // Opens the sheet for one step. Resolves with a result, or null when the
  // player taps "Chat" to go back (the step is then offered again).
  function open(kind, opts) {
    const route = opts.indoor ? ROUTES.in : opts.rural ? ROUTES.rural : ROUTES.out;
    setBase(opts.rural && !opts.indoor ? 'rural' : 'town');
    if (kind === 'walk') place(route.start);
    $('.map-title').textContent = opts.title;
    sheet.hidden = false;
    live.innerHTML = '';
    return new Promise((resolve) => {
      const back = () => close(null);
      closeFn = (result) => {
        cancelAnimationFrame(raf);
        $('.map-back').removeEventListener('click', back);
        sheet.hidden = true;
        closeFn = null;
        resolve(result);
      };
      const close = (r) => closeFn && closeFn(r);
      $('.map-back').addEventListener('click', back);
      const run = {
        walk: () => walk(route).then(() => true),
        auto: () => auto(route, opts.place).then(() => true),
        hunt: () => hunt(route, opts.find, opts.indoor, opts.rural),
        gem: () => gem().then(() => true),
      }[kind];
      run().then((r) => close(r));
    });
  }

  function forceClose() {
    if (closeFn) closeFn(null);
  }

  function reset() {
    forceClose();
    trails.innerHTML = '';
    live.innerHTML = '';
    gems.innerHTML = '';
    photo = null;
    setBase('town');
    place(ROUTES.out.start);
  }

  reset();
  return { open, reset, forceClose };
}
