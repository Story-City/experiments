// Drawn maps for the phone mockups. Copied and trimmed from apps/everyday-app/maps.js (never imported
// across folders). Every map uses one 300 × 600 world; each phone shows the part it needs (viewBox).
// The Edmonton base is the Story City app's own map (a simulator screenshot of McCauley / Central
// McDougall, from everyday-app/real-map). Adelaide's satellite look and the fantasy map are drawn SVG.

export const W = 300, H = 600;

// streets on the real map picture, in world units (the 788 × 1050 shot drawn 450 × 600, shifted left 75)
// 101 St runs down x 188; 102 St x 108 (below the school); the avenues sit at y 374 and y 488
export const DOOR = [150, 488];
export const LOOP = [[150, 488], [188, 488], [188, 374], [108, 374], [108, 488], [150, 488]];

const pts = (a) => a.map((p) => p.join(',')).join(' ');
const len = (a) => a.slice(1).reduce((t, p, i) => t + Math.hypot(p[0] - a[i][0], p[1] - a[i][1]), 0);
export function along(a, f) {
  const L = len(a) * Math.max(0, Math.min(1, f)); let acc = 0;
  for (let i = 1; i < a.length; i++) {
    const seg = Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]);
    if (acc + seg >= L) { const t = seg ? (L - acc) / seg : 0; return [a[i - 1][0] + (a[i][0] - a[i - 1][0]) * t, a[i - 1][1] + (a[i][1] - a[i - 1][1]) * t]; }
    acc += seg;
  }
  return a[a.length - 1];
}
export function slice(a, f) {
  const end = along(a, f), L = len(a) * f; let acc = 0; const out = [a[0]];
  for (let i = 1; i < a.length; i++) { const seg = Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]); if (acc + seg >= L) break; out.push(a[i]); acc += seg; }
  out.push(end); return out;
}

export const defs = (id) => `<defs>
  <filter id="${id}-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <linearGradient id="${id}-trail" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F5B82E"/><stop offset="1" stop-color="#00CD9D"/></linearGradient>
</defs>`;

export const svgOpen = (id, vb, label) => `<svg class="map" viewBox="${vb.join(' ')}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">${defs(id)}`;

// the app's own map picture
export const realGround = () => `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#1E1A3A"/><image href="img/edmonton-map.jpg" x="-75" y="0" width="450" height="600" preserveAspectRatio="none"/>`;

export const meDot = (x, y) => `<g transform="translate(${x} ${y})"><circle r="14" fill="#009EFF" opacity=".2"/><circle r="6.5" fill="#fff" stroke="#009EFF" stroke-width="3"/></g>`;
export const doorMark = (x, y) => `<g transform="translate(${x} ${y})"><circle r="10" fill="#170c35" stroke="#C49BFF" stroke-width="1.5"/><path d="M-5 1l5-4.6 5 4.6v5h-10z" fill="#C49BFF"/></g>`;

// the Walk trail: dotted yellow → green, the walked part solid
export function trail(id, path, f) {
  return `<polyline points="${pts(path)}" fill="none" stroke="#00CD9D" stroke-opacity=".55" stroke-width="4" stroke-dasharray="1 8" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<polyline points="${pts(slice(path, f))}" fill="none" stroke="url(#${id}-trail)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
export const route = (path, col = '#2F8BFF', w = 5, dash = '') => `<polyline points="${pts(path)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

// a story start pin: the cover in a little white frame
export function coverPin(x, y, img, k = 1, ring = '') {
  return `<g transform="translate(${x} ${y}) scale(${k})">`
    + (ring ? `<circle cy="-26" r="30" fill="${ring}" opacity=".18"/>` : '')
    + `<ellipse cy="1" rx="6" ry="2" fill="#000" opacity=".45"/><path d="M-5 -9 L0 -1 L5 -9 Z" fill="#fff"/><rect x="-14" y="-48" width="28" height="40" rx="6" fill="#fff"/>`
    + `<clipPath id="cp-${img}-${x}"><rect x="-12" y="-46" width="24" height="36" rx="4"/></clipPath><image href="img/${img}.jpg" x="-12" y="-46" width="24" height="36" preserveAspectRatio="xMidYMid slice" clip-path="url(#cp-${img}-${x})"/></g>`;
}
export const dotPin = (x, y, col) => `<g transform="translate(${x} ${y})"><circle r="11" fill="${col}" opacity=".25"/><circle r="6" fill="${col}" stroke="#fff" stroke-width="2"/></g>`;
export const label = (x, y, t, o = {}) => {
  const w = Math.round(t.length * (o.fs || 10) * 0.5 + 14);
  return `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-10" width="${w}" height="19" rx="9.5" fill="#0B0620" fill-opacity=".82" stroke="${o.col || '#C49BFF'}" stroke-opacity=".6"/><text y="4" text-anchor="middle" fill="#fff" font-family="'Darker Grotesque', sans-serif" font-size="${o.fs || 10}" font-weight="700">${t}</text></g>`;
};

// ---------------------------------------------------------------- Adelaide, satellite style (drawn)
// The square mile: a street grid wrapped in parklands, King William St down the middle,
// Victoria Square in the centre, North Terrace on top and the River Torrens beyond it.
export function adelaideSat() {
  let seed = 7; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let g = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#56603f"/>`;
  // parkland canopy all round
  for (let k = 0; k < 220; k++) {
    const x = -30 + r() * 360, y = -30 + r() * 660;
    if (x > 28 && x < 272 && y > 150 && y < 520) continue;
    g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(4 + r() * 7).toFixed(1)}" fill="${r() > .5 ? '#2f4a26' : '#3c5a30'}" opacity=".95"/>`;
  }
  // the river and the lake
  g += `<path d="M-40 92 C40 70 90 112 150 98 S250 70 340 96 L340 118 C250 92 200 128 150 120 S40 92 -40 116Z" fill="#2c5560"/>`;
  g += `<path d="M-40 104 C40 82 90 124 150 110 S250 82 340 108" fill="none" stroke="#8fb3b0" stroke-opacity=".25" stroke-width="2"/>`;
  // the oval across the river
  g += `<ellipse cx="150" cy="40" rx="42" ry="30" fill="#3f6a32" stroke="#c9c1a8" stroke-width="5"/><ellipse cx="150" cy="40" rx="16" ry="11" fill="#c9b98c" opacity=".7"/>`;
  // city blocks with roofs
  g += `<rect x="28" y="150" width="244" height="370" fill="#4b4c47"/>`;
  const roofs = ['#8a8580', '#6d6a66', '#9b8f84', '#a0644c', '#5d5a57', '#b9b2a8', '#7d5246'];
  const xs = [28, 88, 150, 212, 272], ys = [150, 210, 270, 330, 390, 455, 520];
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    const x0 = xs[i] + 6, y0 = ys[j] + 6, w = xs[i + 1] - xs[i] - 12, h = ys[j + 1] - ys[j] - 12;
    if (i === 1 && j === 2 || i === 2 && j === 2) continue;   // Victoria Square handled below
    g += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#5a5a55"/>`;
    for (let k = 0; k < 7; k++) {
      const bw = 8 + r() * 14, bh = 8 + r() * 14;
      g += `<rect x="${(x0 + r() * (w - bw)).toFixed(1)}" y="${(y0 + r() * (h - bh)).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="1" fill="${roofs[Math.floor(r() * roofs.length)]}"/>`;
    }
    if (r() > .4) g += `<circle cx="${(x0 + r() * w).toFixed(1)}" cy="${(y0 + r() * h).toFixed(1)}" r="${(3 + r() * 3).toFixed(1)}" fill="#3c5a30"/>`;
  }
  // Victoria Square
  g += `<rect x="94" y="276" width="112" height="48" rx="3" fill="#4f6b3a"/>`;
  for (let k = 0; k < 10; k++) g += `<circle cx="${(100 + r() * 100).toFixed(1)}" cy="${(282 + r() * 36).toFixed(1)}" r="${(3 + r() * 4).toFixed(1)}" fill="#2f4a26"/>`;
  // roads: terraces and the grid, King William St wider
  const road = (x1, y1, x2, y2, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2d2f33" stroke-width="${w}"/>`;
  [150, 520].forEach((y) => { g += road(10, y, 290, y, 9); });
  [28, 272].forEach((x) => { g += road(x, 140, x, 530, 9); });
  ys.slice(1, -1).forEach((y) => { g += road(28, y, 272, y, 6); });
  [88, 212].forEach((x) => { g += road(x, 150, x, 520, 6); });
  g += road(150, 60, 150, 560, 12);
  g += `<line x1="150" y1="60" x2="150" y2="560" stroke="#d8c98a" stroke-width="1" stroke-dasharray="6 7" opacity=".55"/>`;
  g += `<line x1="10" y1="150" x2="290" y2="150" stroke="#d8c98a" stroke-width="1" stroke-dasharray="6 7" opacity=".45"/>`;
  const sl = (x, y, t, rot = 0) => `<text x="${x}" y="${y}" ${rot ? `transform="rotate(${rot} ${x} ${y})"` : ''} fill="#fff" font-family="'Darker Grotesque', sans-serif" font-size="10" font-weight="800" letter-spacing=".08em" paint-order="stroke" stroke="#000" stroke-opacity=".55" stroke-width="2.5">${t}</text>`;
  g += sl(36, 145, 'NORTH TCE') + sl(166, 500, 'KING WILLIAM ST', -90) + sl(106, 304, 'VICTORIA SQ') + sl(196, 128, 'RIVER TORRENS') + sl(36, 516, 'SOUTH TCE');
  return g;
}
// the walk up King William St from Victoria Square to the Town Hall, then on to North Terrace
export const ADL_PATH = [[150, 330], [150, 300], [150, 262], [150, 238], [150, 206], [150, 176], [150, 152], [190, 152], [238, 152]];
export const TOWN_HALL = [150, 232];

// ---------------------------------------------------------------- a storybook map (drawn)
export const FANTASY_PATH = [[60, 520], [90, 470], [70, 420], [120, 380], [180, 400], [220, 350], [200, 300], [130, 270], [110, 220], [170, 180], [240, 160]];
export function fantasy() {
  let g = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#1d1142"/>`;
  g += `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="url(#fx-v)"/>`;
  // sea and coast
  g += `<path d="M-40 560 C40 530 70 590 140 570 S250 520 340 560 L340 700 L-40 700Z" fill="#14305a" opacity=".85"/>`;
  g += `<path d="M-40 560 C40 530 70 590 140 570 S250 520 340 560" fill="none" stroke="#5B8CFF" stroke-opacity=".5" stroke-width="2" stroke-dasharray="3 5"/>`;
  // river
  g += `<path d="M330 250 C260 270 250 330 190 340 S90 330 40 370 S-10 430 -30 440" fill="none" stroke="#3a6fd8" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/>`;
  // mountains
  [[40, 150], [80, 120], [124, 150], [60, 200], [250, 470], [282, 440]].forEach(([x, y]) => {
    g += `<path d="M${x - 24} ${y + 20}L${x} ${y - 22}L${x + 24} ${y + 20}" fill="#2a1a5e" stroke="#8a74d6" stroke-width="2" stroke-linejoin="round"/><path d="M${x - 7} ${y - 9}L${x} ${y - 22}L${x + 7} ${y - 9}" fill="#d9cef5" opacity=".7"/>`;
  });
  // forest
  for (let i = 0; i < 16; i++) { const x = 190 + (i % 4) * 24 + (i % 2) * 8, y = 220 + Math.floor(i / 4) * 22; g += `<path d="M${x} ${y - 12}L${x + 9} ${y + 6}H${x - 9}Z" fill="#00CD9D" opacity=".45"/>`; }
  // landmarks
  const lm = (x, y, t) => `<g transform="translate(${x} ${y})"><circle r="5" fill="#F5B82E"/><circle r="10" fill="none" stroke="#F5B82E" stroke-opacity=".4"/></g><text x="${x > 150 ? x - 13 : x + 13}" y="${y + 4}" text-anchor="${x > 150 ? 'end' : 'start'}" fill="#e7dcff" font-family="Georgia, serif" font-style="italic" font-size="12">${t}</text>`;
  g += lm(240, 160, 'The Old Signal Tower') + lm(130, 270, 'Lamplight Alley') + lm(180, 400, 'Whispering Bridge');
  g += `<text x="24" y="560" fill="#a493d6" font-family="Georgia, serif" font-style="italic" font-size="12">Here be hydrants</text>`;
  // compass
  g += `<g transform="translate(262 66)" opacity=".85"><circle r="18" fill="none" stroke="#a493d6" stroke-width="1"/><path d="M0 -24L5 0L0 24L-5 0Z" fill="#C49BFF"/><text y="-28" text-anchor="middle" fill="#C49BFF" font-family="Georgia, serif" font-size="10">N</text></g>`;
  return g;
}
export const fantasyDefs = `<radialGradient id="fx-v" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#2a1a5e" stop-opacity="0"/><stop offset="1" stop-color="#0b0620" stop-opacity=".8"/></radialGradient>`;
