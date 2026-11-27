// Drawn maps: plain SVG in palette colours. No map tiles, no images.
// One neighbourhood layout per place type (city grid, rural roads, Lagos estate) reused by
// the Map tab, the in-story map, the treadmill and route previews.
import { S, O, gemSvg, esc, byId, gemVisOf, gemTier, TIER_COL, hideHome, blurShared, othersNear } from './core.js';
import { PLACES, COVERS } from './stories.js';

export const W = 390, H = 520;
export const HOME = { x: 214, y: 300 };

const city = () => (S.loc === 'far' ? 'Edmonton' : S.city);
// a journey can name its own neighbourhood (Glen lives in Beverly: loops must-fix 15)
export const place = () => { const p = PLACES[city()] || PLACES.Edmonton; return S.hood && city() === S.city ? { ...p, hood: S.hood } : p; };
export const isRural = () => S.loc === 'rural' || !!place().rural;

// streets: [x1,y1,x2,y2,kind]  kind: 0 street, 1 avenue
const GRID = (() => {
  const s = [];
  [40, 110, 180, 320, 390, 460].forEach((y) => s.push([0, y, W, y, 0]));
  s.push([0, 250, W, 250, 1]);
  [30, 105, 255, 330].forEach((x) => s.push([x, 70, x, H, 0]));
  s.push([180, 60, 180, H, 1]);
  s.push([0, 500, 150, 330, 0]);
  return s;
})();
const RURAL = [[0, 260, W, 260, 1], [200, 0, 200, H, 1], [200, 120, 340, 120, 0], [60, 260, 60, 430, 0]];
const LAGOS = [[0, 90, W, 120, 1], [0, 300, W, 270, 1], [120, 0, 140, H, 0], [270, 0, 250, H, 0], [140, 190, 250, 200, 0], [0, 420, 250, 400, 0], [60, 120, 70, 300, 0], [320, 120, 330, 280, 0]];
export const streets = () => (isRural() ? RURAL : S.city === 'Lagos' && S.loc !== 'far' ? LAGOS : GRID);

// the walks that cleared fog (along streets)
export const WALKED = [
  [[214, 300], [180, 300], [180, 250], [105, 250], [105, 180], [180, 180], [180, 250]],
  [[214, 300], [255, 300], [255, 390], [330, 390], [330, 320], [255, 320]],
  [[180, 250], [255, 250], [255, 180], [330, 180]],
];
export const RURAL_WALKED = [[[214, 300], [200, 300], [200, 260], [60, 260], [60, 330]], [[200, 260], [200, 120], [300, 120]]];

// the in-story route (Path) and the walker's track (Walk)
export const ROUTE = [[214, 300], [180, 300], [180, 250], [255, 250], [255, 180], [300, 180]];
export const TRACK = [[195, 300], [180, 300], [180, 282], [180, 262], [180, 250], [160, 250], [140, 250], [122, 250], [105, 250], [105, 230], [105, 210]];

const pts = (a) => a.map((p) => p.join(',')).join(' ');
export const polyLen = (a) => a.slice(1).reduce((t, p, i) => t + Math.hypot(p[0] - a[i][0], p[1] - a[i][1]), 0);
export function along(a, f) {
  const L = polyLen(a) * Math.max(0, Math.min(1, f)); let acc = 0;
  for (let i = 1; i < a.length; i++) {
    const seg = Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]);
    if (acc + seg >= L) { const t = seg ? (L - acc) / seg : 0; return [a[i - 1][0] + (a[i][0] - a[i - 1][0]) * t, a[i - 1][1] + (a[i][1] - a[i - 1][1]) * t]; }
    acc += seg;
  }
  return a[a.length - 1];
}
export function slice(a, f) {
  const end = along(a, f), L = polyLen(a) * f; let acc = 0; const out = [a[0]];
  for (let i = 1; i < a.length; i++) { const seg = Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]); if (acc + seg >= L) break; out.push(a[i]); acc += seg; }
  out.push(end); return out;
}

function defs(id) {
  return `<defs>
    <filter id="${id}-fog" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .85  0 0 0 0 .81  0 0 0 0 .96  0 0 0 .55 .05"/></filter>
    <filter id="${id}-soft"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${id}-hollow" x="-40%" y="-40%" width="180%" height="180%"><feMorphology in="SourceAlpha" operator="erode" radius="1.6" result="in"/><feComposite in="SourceAlpha" in2="in" operator="out" result="ring"/><feFlood flood-color="#FBF7FF"/><feComposite in2="ring" operator="in" result="line"/><feGaussianBlur in="line" stdDeviation="1.6" result="glow"/><feComponentTransfer in="SourceGraphic" result="faint"><feFuncA type="linear" slope=".16"/></feComponentTransfer><feMerge><feMergeNode in="glow"/><feMergeNode in="faint"/><feMergeNode in="line"/></feMerge></filter>
    <filter id="${id}-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="${id}-home"><stop offset="0" stop-color="#2A1658"/><stop offset=".62" stop-color="#2A1658" stop-opacity=".96"/><stop offset="1" stop-color="#2A1658" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F5B82E"/><stop offset="1" stop-color="#00CD9D"/></linearGradient>
  </defs>`;
}

// Satellite look for the home map (Melissa, Nov 4): drawn, not real imagery: roofs, tree canopy,
// asphalt with lane marks and the river, on the same street grid so pins and fog still line up.
function satBase() {
  let seed = 11; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let g = `<rect width="${W}" height="${H}" fill="#3a4034"/>`;
  g += `<path d="M0 0 H${W} V28 C300 46 220 18 140 40 S40 30 0 52Z" fill="#1f3a4a"/><path d="M0 52 C40 30 140 40 140 40 S300 46 ${W} 28" fill="none" stroke="#6f7a5a" stroke-width="3" opacity=".6"/>`;
  const blocks = [[37, 117], [112, 117], [187, 117], [262, 117], [37, 187], [112, 187], [187, 187], [262, 187], [37, 257], [112, 257], [187, 257], [262, 257], [112, 327], [187, 327], [112, 397], [187, 397], [262, 397]];
  const roofs = ['#8a8580', '#6d6a66', '#9b8f84', '#7a5f52', '#5d5a57', '#a39c94', '#6a4f45'];
  blocks.forEach(([x, y]) => {
    g += `<rect x="${x}" y="${y}" width="61" height="56" rx="2" fill="#4a5140"/>`;
    for (let k = 0; k < 6; k++) {
      const rx = x + 3 + (k % 3) * 19 + r() * 3, ry = y + 4 + Math.floor(k / 3) * 26 + r() * 3;
      g += `<rect x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" width="${(13 + r() * 4).toFixed(1)}" height="${(15 + r() * 6).toFixed(1)}" rx="1" fill="${roofs[Math.floor(r() * roofs.length)]}"/>`;
    }
    for (let k = 0; k < 4; k++) g += `<circle cx="${(x + 4 + r() * 53).toFixed(1)}" cy="${(y + 4 + r() * 48).toFixed(1)}" r="${(3 + r() * 4).toFixed(1)}" fill="#2f4a2a" opacity=".9"/>`;
  });
  [[262, 327], [37, 397]].forEach(([x, y]) => {
    g += `<rect x="${x}" y="${y}" width="62" height="56" rx="3" fill="#4f6b3a"/>`;
    for (let k = 0; k < 14; k++) g += `<circle cx="${(x + 6 + r() * 50).toFixed(1)}" cy="${(y + 6 + r() * 44).toFixed(1)}" r="${(4 + r() * 6).toFixed(1)}" fill="${r() > .5 ? '#2c4a26' : '#38592f'}"/>`;
  });
  g += `<g stroke-linecap="butt">${streets().map(([a, b, c, d, k]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#2d2f33" stroke-width="${k ? 13 : 8}"/>${k ? `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#d8c98a" stroke-width="1" stroke-dasharray="6 7" opacity=".55"/>` : ''}`).join('')}</g>`;
  const st = place().streets;
  const sl = (x, y, t, rot = 0) => t ? `<text x="${x}" y="${y}" ${rot ? `transform="rotate(${rot} ${x} ${y})"` : ''} fill="#fff" font-family="Karla, sans-serif" font-size="9.5" font-weight="700" letter-spacing=".06em" paint-order="stroke" stroke="#000" stroke-opacity=".5" stroke-width="2">${esc(t.toUpperCase())}</text>` : '';
  return g + sl(8, 244, st[0]) + sl(186, 470, st[1], -90) + sl(8, 104, st[2]) + sl(336, 300, st[3], -90) + sl(130, 22, st[4]);
}

// The real in-app map (Melissa, Nov 9, option A): a simulator screenshot of the Story City app's own map
// (McCauley / Central McDougall, Edmonton, from the FTUE Steps screen, panned so the app's own blue dot is off
// the shot). Pins and routes are still drawn on the mockup's grid, so they won't follow the real streets.
const realBase = () => `<rect width="${W}" height="${H}" fill="#1E1A3A"/><image href="real-map/edmonton-map.jpg" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>`;

function base(id, sat = false) {
  const rural = isRural();
  if (sat && !rural) return satBase();
  if (O.mapBase === 'real' && !rural) return realBase();
  let g = `<rect width="${W}" height="${H}" fill="#0B0620"/>`;
  if (rural) {
    // fields, a shelter belt, the farmyard
    g += `<g fill="none" stroke="#2A1658" stroke-width="1">${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 30} 270 L${i * 30 - 40} 520"/>`).join('')}${Array.from({ length: 10 }, (_, i) => `<path d="M210 ${10 + i * 24} H390"/>`).join('')}</g>`;
    g += `<rect x="215" y="275" width="70" height="55" rx="6" fill="#2A1658" opacity=".7"/>`;
    g += `<g fill="#00CD9D" opacity=".2">${Array.from({ length: 9 }, (_, i) => `<circle cx="${20 + i * 18}" cy="${235 + (i % 2) * 6}" r="8"/>`).join('')}</g>`;
  } else {
    g += `<path d="M0 0 H${W} V28 C300 46 220 18 140 40 S40 30 0 52Z" fill="#5B8CFF" opacity=".16"/>`;
    g += `<rect x="262" y="327" width="62" height="56" rx="10" fill="#00CD9D" opacity=".09" stroke="#00CD9D" stroke-opacity=".22"/>`;
    g += `<rect x="37" y="397" width="62" height="56" rx="10" fill="#00CD9D" opacity=".09" stroke="#00CD9D" stroke-opacity=".22"/>`;
    // building blocks, faint
    g += `<g fill="#1A0B3D">${[[37, 117], [112, 117], [187, 117], [262, 117], [37, 187], [112, 187], [187, 187], [262, 187], [37, 257], [112, 257], [187, 257], [262, 257], [112, 327], [187, 327], [112, 397], [187, 397], [262, 397]].map(([x, y]) => `<rect x="${x}" y="${y}" width="61" height="56" rx="4"/>`).join('')}</g>`;
  }
  g += `<g stroke-linecap="round">${streets().map(([a, b, c, d, k]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${k ? '#46337E' : '#2A1658'}" stroke-width="${k ? (rural ? 9 : 13) : 8}"/>`).join('')}</g>`;
  // labels
  const st = place().streets;
  if (rural) {
    g += lab(16, 252, st[0]) + lab(208, 30, st[1], 90) + lab(214, 112, st[2]);
  } else {
    g += lab(8, 244, st[0]) + lab(186, 470, st[1], -90) + lab(8, 104, st[2]) + lab(336, 300, st[3], -90) + lab(130, 22, st[4]);
  }
  return g;
}
const lab = (x, y, t, rot = 0) => t ? `<text x="${x}" y="${y}" ${rot ? `transform="rotate(${rot} ${x} ${y})"` : ''} fill="#A493D6" font-family="Karla, sans-serif" font-size="9.5" font-weight="700" letter-spacing=".06em" opacity=".75">${esc(t.toUpperCase())}</text>` : '';

// gem-pins V3: Victoria's category gem art at 28px; your private gems as a glowing outline (NSC-2123 lead option)
const V3_ART = { nature: 'nature', art: 'art', shop: 'eat-drink', landmark: 'landmarks', curio: 'curiosities' };
const V3_SCALE = { landmark: 1.12 };
function gemAtV3(g, id) {
  const priv = g.mine && gemVisOf(g) === 'me';
  const sz = 28 * (V3_SCALE[g.type] || 1);
  const sel = S.focusGem === g.id ? `<circle r="${sz * 0.68}" fill="none" stroke="#FBF7FF" stroke-width="2" class="gem-focus"/>` : '';
  return `<g class="gem-pin v3" data-gem="${g.id}" transform="translate(${g.x} ${g.y})" tabindex="0" role="button" aria-label="${esc(g.name)}">${sel}<image href="gem-art/${V3_ART[g.type] || 'curiosities'}.svg" x="${-sz / 2}" y="${-sz / 2}" width="${sz}" height="${sz}"${priv ? ` filter="url(#${id}-hollow)"` : ''}/><circle r="${sz * 0.8}" fill="transparent"/></g>`;
}
function gemAt(g, size = 26, id = 'm') {
  if (O.gemPins === 'v3') return gemAtV3(g, id);
  const priv = gemVisOf(g) === 'me';
  let ring = (g.mine ? `<circle r="${size * 0.62}" fill="none" stroke="#FBF7FF" stroke-width="1.4" ${priv ? 'stroke-dasharray="3 3"' : ''} opacity=".8"/>` : '') + `<circle r="22" fill="transparent"/>`;
  // rarity as a badge only in the "votes" option; the default keeps it a filter (brainstorm, Oct 29)
  const t = O.gemRarity === 'votes' ? gemTier(g) : null;
  if (t) ring += `<circle r="${size * 0.72}" fill="none" stroke="${TIER_COL[t.i]}" stroke-width="2.2"/>`;
  if (S.focusGem === g.id) ring += `<circle r="${size * 0.9}" fill="none" stroke="#FBF7FF" stroke-width="2" class="gem-focus"/>`;
  const faded = O.gemFade === 'fade' && !priv && (g.fadeIn || 30) <= 7;
  return `<g class="gem-pin" data-gem="${g.id}" transform="translate(${g.x} ${g.y})" tabindex="0" role="button" aria-label="${esc(g.name)}"${faded ? ' opacity=".5"' : ''}>${ring}<g filter="url(#${id}-glow)"><svg x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" viewBox="0 0 40 40">${gemSvg(g.type, 40).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></g><circle r="${size * 0.75}" fill="transparent"/></g>`;
}
// home shown plainly (Team Option): a small house on an ordinary street, no blob
const houseAt = () => `<g class="home-plain" transform="translate(${HOME.x} ${HOME.y})" aria-label="Your home"><circle r="11" fill="#1A0B3D" stroke="#C49BFF" stroke-width="1.5"/><path d="M-6 1l6-5.5 6 5.5v6h-12z" fill="#C49BFF"/></g>`;
const homeBubble = (id) => `<g class="home-bubble"><circle cx="${HOME.x}" cy="${HOME.y}" r="44" fill="url(#${id}-home)"/><path d="M${HOME.x - 7} ${HOME.y + 1}l7-6 7 6v7h-14z" fill="none" stroke="#C49BFF" stroke-width="1.6" stroke-linejoin="round"/></g>`;
export const meDot = (x, y) => `<g class="me" transform="translate(${x} ${y})"><circle r="15" fill="#5B8CFF" opacity=".18" class="me-pulse"/><circle r="7.5" fill="#FBF7FF" stroke="#5B8CFF" stroke-width="3"/></g>`;
// story start pins: the story's cover in a little framed pin, with a soft label pill under it
const storyPin = (x, y, s, i) => {
  // default: a jewel dot, like Airbnb / AllTrails / Google Maps; the story card slides up on tap
  // (reports/map-pins-research.md, Nov 4). The cover poster stays as a Team Options choice.
  if (O.pinStyle !== 'cover') return `<g class="story-pin" data-pin="${s.id}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${esc(s.title)} starts here">`
    + `<circle r="13" fill="${s.accent}" opacity=".22"/><circle r="7.5" fill="${s.accent}" stroke="#FBF7FF" stroke-width="2"/><circle r="22" fill="transparent"/></g>`;
  const t = s.title.length > 24 ? s.title.slice(0, 22) + '…' : s.title;
  const w = Math.round(t.length * 5.3 + 16), k = 0.72;   // the pin is drawn at 72%
  // keep the label inside the part of the map a tall phone actually shows (about x 80–310)
  const lx = Math.max((80 - x) / k + w / 2, Math.min((310 - x) / k - w / 2, 0));
  const has = s.id in COVERS;
  const art = has ? `<clipPath id="pc-${s.id}"><rect x="-12" y="-46" width="24" height="36" rx="4"/></clipPath><image href="covers/${s.id}.jpg" x="-12" y="-46" width="24" height="36" preserveAspectRatio="xMidYMid slice" clip-path="url(#pc-${s.id})"/>`
    : `<rect x="-12" y="-46" width="24" height="36" rx="4" fill="${s.accent}"/><text y="-23" text-anchor="middle" fill="#0B0620" font-family="Erode, Georgia, serif" font-size="14" font-weight="700">${esc(s.title.replace(/^(The|A|An) /, '')[0])}</text>`;
  return `<g class="story-pin" data-pin="${s.id}" transform="translate(${x} ${y}) scale(.72)" tabindex="0" role="button" aria-label="${esc(s.title)} starts here">`
    + `<ellipse cy="1" rx="6" ry="2" fill="#0B0620" opacity=".45"/><path d="M-5 -9 L0 -1 L5 -9 Z" fill="#FBF7FF"/><rect x="-14" y="-48" width="28" height="40" rx="6" fill="#FBF7FF"/>${art}`
    + `<g transform="translate(${lx} 0)"><rect x="${-w / 2}" y="6" width="${w}" height="17" rx="8.5" fill="#0B0620" fill-opacity=".78" stroke="${s.accent}" stroke-opacity=".55"/><text y="18" text-anchor="middle" fill="#FBF7FF" font-family="Karla, sans-serif" font-size="10" font-weight="600">${esc(t)}</text></g>`
    + `<circle cy="-24" r="24" fill="transparent"/></g>`;
};

// where story starts sit on the browse map (fixed routes only)
export function pinsFor() {
  if (isRural()) return [];
  const c = city();
  const local = ['coronet', 'dragons', 'kindness', 'dynasty', 'cnoy', 'parable'].map((id) => byId[id]).filter((s) => s.city === c);
  const spots = [[105, 330], [285, 220], [140, 150], [290, 470], [115, 470]];
  const out = local.map((s, i) => ({ s, x: spots[i][0], y: spots[i][1] }));
  if (!out.length && c !== 'Lagos') out.push({ s: byId.frightnight, x: 300, y: 220, placed: true });
  return out;
}

// ------------------------------------------------------------ the home map (Map tab)
// part: 'all' (one SVG, SVG fog), 'base' (streets only) or 'top' (pins, gems, you; no ground),
// so the full-screen map can put the canvas fog (fog.js) between them.
export function homeMap({ id = 'hm', fog = true, filter = 'every', frontier = true, home = true, part = 'all', sat = false, noStories = false } = {}) {
  const rural = isRural();
  const walked = rural ? RURAL_WALKED : WALKED;
  const cat = filter.startsWith('cat:') ? filter.slice(4) : null;
  let gems = S.gems.filter((g) => !g.hidden && !(S.trash || []).some((t) => t.gemId === g.id) && (cat ? g.type === cat : filter === 'mine' ? g.mine : filter === 'rare' ? ((gemTier(g) || { i: 0 }).i >= 2) : true));
  if (rural) gems = S.gems.filter((g) => g.mine && !g.hidden).slice(0, 2).map((g, i) => ({ ...g, x: [80, 300][i], y: [300, 110][i] }));
  // other people's gems only where there are players near you: Lagos sees no Edmonton gems (loops brief, lowtech pair)
  else if (!othersNear()) gems = gems.filter((g) => g.mine);
  let svg = `<svg class="map-svg${part === 'top' ? ' map-top' : ''}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" ${part === 'top' ? 'aria-hidden="true"' : 'role="img" aria-label="Map of your neighbourhood"'}>${defs(id)}${part === 'top' ? '' : base(id, sat)}`;
  if (part === 'base') return svg + '</svg>';
  if (part === 'top') fog = false;
  // whimsy start ring
  if (filter === 'every' && !noStories) svg += `<circle cx="${rural ? 300 : 105}" cy="${rural ? 200 : 390}" r="13" fill="none" stroke="#C49BFF" stroke-width="2" stroke-dasharray="2 4" class="whimsy-ring"/>`;
  if (filter === 'every' && !noStories) pinsFor().forEach((p, i) => { svg += storyPin(p.x, p.y, p.s, i); });
  if (fog) {
    svg += `<mask id="${id}-mask"><rect width="${W}" height="${H}" fill="#fff"/><g filter="url(#${id}-soft)" stroke="#000" stroke-width="44" stroke-linecap="round" stroke-linejoin="round" fill="none">${walked.map((w) => `<polyline points="${pts(w)}"/>`).join('')}</g></mask>`;
    svg += `<g mask="url(#${id}-mask)" class="fog"><rect width="${W}" height="${H}" fill="#1A0B3D" opacity=".86"/><rect width="${W}" height="${H}" filter="url(#${id}-fog)" opacity=".55"/></g>`;
  }
  if (fog || part === 'top') {
    if (frontier && !rural) svg += `<g class="frontier" filter="url(#${id}-glow)"><line x1="105" y1="460" x2="255" y2="460" stroke="#F5B82E" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round"/></g>`;
    if (frontier && rural) svg += `<g class="frontier" filter="url(#${id}-glow)"><line x1="200" y1="120" x2="200" y2="20" stroke="#F5B82E" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round"/></g>`;
  }
  if (home) svg += hideHome() ? homeBubble(id) : houseAt();
  if (filter !== 'none') gems.forEach((g) => { svg += gemAt(g, 26, id); });
  // the You dot: where you last saved a spot on a walk, else just outside home (Just Save It drops the pin here)
  svg += S.youAt ? meDot(S.youAt.x + 18, S.youAt.y + 14) : meDot(HOME.x + 22, HOME.y - 26);
  return svg + '</svg>';
}

// ------------------------------------------------------------ the in-story chapter map
export function storyMap({ id = 'sm', mode = 'walk', fog = false } = {}) {
  let svg = `<svg class="map-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Chapter map">${defs(id)}${base(id)}`;
  if (fog) {
    svg += `<mask id="${id}-mask"><rect width="${W}" height="${H}" fill="#fff"/><polyline id="fogclear" points="${pts(TRACK.slice(0, 2))}" filter="url(#${id}-soft)" stroke="#000" stroke-width="54" stroke-linecap="round" stroke-linejoin="round" fill="none"/></mask>`;
    svg += `<g mask="url(#${id}-mask)"><rect width="${W}" height="${H}" fill="#1A0B3D" opacity=".8"/><rect width="${W}" height="${H}" filter="url(#${id}-fog)" opacity=".5"/></g>`;
  }
  if (mode === 'path') {
    svg += `<polyline points="${pts(ROUTE)}" fill="none" stroke="#5B8CFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".9" class="route"/>`;
    const [px, py] = ROUTE[ROUTE.length - 1];
    svg += `<g class="dest" transform="translate(${px} ${py})" data-stop tabindex="0" role="button" aria-label="Stop: long-press to move or report"><circle r="16" fill="#5B8CFF" opacity=".2"/><path d="M0 0c-7-8-11-12-11-18a11 11 0 0122 0c0 6-4 10-11 18z" fill="#5B8CFF" stroke="#0B0620" stroke-width="1.5"/><circle cy="-18" r="4" fill="#0B0620"/></g>`;
  }
  if (mode === 'walk') {
    svg += `<polyline id="trail" points="${pts(TRACK.slice(0, 2))}" fill="none" stroke="url(#${id}-trail)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 9"/>`;
    svg += `<circle id="ring" cx="${TRACK[0][0]}" cy="${TRACK[0][1]}" r="120" fill="none" stroke="#00CD9D" stroke-width="2.5" opacity=".9"/>`;
  }
  if (mode === 'hunt') {
    svg += `<g id="huntR" transform="translate(${TRACK[0][0]} ${TRACK[0][1]})"><circle r="92" fill="#B36BFF" opacity=".08" stroke="#B36BFF" stroke-width="2" stroke-dasharray="6 6"/><path class="sweep" d="M0 0 L92 -20 A94 94 0 0 1 80 46 Z" fill="#B36BFF" opacity=".16"/></g>`;
  }
  svg += `<g id="meg">${meDot(TRACK[0][0], TRACK[0][1])}</g>`;
  return svg + '</svg>';
}

// ------------------------------------------------------------ the in-story map, live-app look (walkMapLook = live)
// Only the ground: streets, the route and the walked trail. It sits in a group the screen pans so the camera
// follows you, as the live map does. The ring, the dot, the pin and the hunt sweep are drawn over it in screen
// pixels by screens-story.js, at the live app's sizes. The real map picture is drawn larger than the mockup grid
// so it still covers the screen while the camera pans.
export function liveWorld({ id = 'lw', sat = false } = {}) {
  const rural = isRural();
  let g;
  if (sat && !rural) g = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#3a4034"/>${satBase()}`;
  else if (O.mapBase === 'real' && !rural) g = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#1E1A3A"/><image href="real-map/edmonton-map.jpg" x="-110" y="-130" width="580" height="773" preserveAspectRatio="xMidYMid slice"/>`;
  else g = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#0B0620"/>${base(id)}`;
  return `<svg class="lwm-world" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs(id)}<g id="lwm-pan">${g}<g id="lwm-trail"></g><polyline id="lwm-route" points="" fill="none" stroke="#2f8bff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></g></svg>`;
}

// ------------------------------------------------------------ route preview (dots / line / start only)
// stops = how many dots; the start ring sits inside the frame (tester B2)
export function routePreview(id = 'rp', how = O.routePreview, accent = '#5B8CFF', stops = 6, seed = 0) {
  let svg = `<svg class="map-svg" viewBox="0 90 ${W} 280" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Route preview, ${stops} stops">${defs(id)}${base(id)}`;
  const shapes = [
    [[105, 320], [105, 250], [180, 250], [180, 180], [255, 180], [330, 180]],
    [[60, 300], [140, 300], [140, 220], [230, 220], [300, 150], [330, 250]],
    [[180, 330], [255, 330], [255, 250], [180, 250], [105, 180], [60, 140]],
  ];
  const r = shapes[seed % shapes.length];
  const pp = Array.from({ length: Math.max(2, stops) }, (_, i) => along(r, i / Math.max(1, stops - 1)));
  if (how === 'line') svg += `<polyline points="${pts(r)}" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (how !== 'start') pp.forEach(([x, y], i) => { if (i) svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${stops > 10 ? 4 : 6}" fill="${accent}" opacity=".9"/>`; });
  svg += `<g transform="translate(${r[0][0]} ${r[0][1]})"><circle r="12" fill="none" stroke="#FBF7FF" stroke-width="2"/><circle r="4" fill="#FBF7FF"/></g>`;
  return svg + '</svg>';
}

// ------------------------------------------------------------ treadmill maps
export function treadMap(kind, f = 0) {
  if (kind === 'fantasy') {
    const path = [[30, 470], [90, 400], [70, 320], [160, 270], [230, 300], [300, 220], [260, 140], [340, 80]];
    const [mx, my] = along(path, f);
    return `<svg class="map-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Storybook map">
      <rect width="${W}" height="${H}" fill="#1A0B3D"/>
      <g fill="none" stroke="#46337E" stroke-width="2">${[[60, 130], [110, 100], [160, 140]].map(([x, y]) => `<path d="M${x - 30} ${y + 24}L${x} ${y - 20}L${x + 30} ${y + 24}"/>`).join('')}</g>
      <g fill="#00CD9D" opacity=".18">${Array.from({ length: 12 }, (_, i) => `<circle cx="${210 + (i % 4) * 34}" cy="${380 + Math.floor(i / 4) * 30}" r="15"/>`).join('')}</g>
      <path d="M0 220 C80 200 120 250 200 230 S330 190 390 210" stroke="#5B8CFF" stroke-opacity=".3" stroke-width="16" fill="none"/>
      <polyline points="${pts(path)}" fill="none" stroke="#C49BFF" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
      <polyline points="${pts(slice(path, f))}" fill="none" stroke="#F5B82E" stroke-width="4" stroke-linecap="round"/>
      <text x="40" y="60" fill="#A493D6" font-family="Erode, Georgia, serif" font-style="italic" font-size="16">Here be hydrants</text>
      ${meDot(mx, my)}</svg>`;
  }
  const [mx, my] = along(TRACK, f);
  return `<svg class="map-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Virtual walk map">${defs('tm')}${base('tm')}
    <polyline points="${pts(TRACK)}" fill="none" stroke="#46337E" stroke-width="4" stroke-dasharray="1 8" stroke-linecap="round"/>
    <polyline points="${pts(slice(TRACK, f))}" fill="none" stroke="url(#tm-trail)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    ${meDot(mx, my)}</svg>`;
}

// ------------------------------------------------------------ small doodle for Whimsy / Roulette
// With no seed it's the classic shape. With a seed (a player + a day) each player's doodle is their own
// walk: same number of turns, different turns (pass 2: every friend's doodle was the same cross).
// o.loop closes it back to the start (Roulette "back where you started"); o.cols draws a shared walk in
// one colour per person (Walk Together).
const CLASSIC = [[195, 400], [195, 300], [120, 300], [120, 230], [200, 230], [200, 160], [280, 160], [280, 250], [340, 250]];
function seededPath(n, seed) {
  let h = 2166136261; for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  const rnd = () => { h = (Math.imul(h, 1103515245) + 12345) & 0x7fffffff; return h / 0x7fffffff; };
  const D = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  let dir = 0, x = 195, y = 400; const p = [[x, y]];
  for (let i = 0; i < Math.max(1, n); i++) {
    const len = 62 + Math.round(rnd() * 48);
    let tries = 0, nx, ny;
    do { nx = x + D[dir][0] * len; ny = y + D[dir][1] * len; if (nx < 80 || nx > 340 || ny < 140 || ny > 410) dir = (dir + (rnd() < 0.5 ? 1 : 3)) % 4; tries++; } while ((nx < 80 || nx > 340 || ny < 140 || ny > 410) && tries < 6);
    x = Math.max(80, Math.min(340, nx)); y = Math.max(140, Math.min(410, ny)); p.push([x, y]);
    dir = (dir + (rnd() < 0.5 ? 1 : 3)) % 4;
  }
  return p;
}
export function doodle(n, seed, o = {}) {
  let p = seed ? seededPath(Math.min(14, n), seed) : CLASSIC.slice(0, Math.min(CLASSIC.length, 2 + n));
  if (o.loop && p.length > 2) { const [lx, ly] = p[p.length - 1]; p = p.concat([[lx, 400], [195, 400]].filter(([x, y]) => !(x === lx && y === ly))); }
  const end = p[p.length - 1];
  const line = o.cols && o.cols.length > 1
    ? p.slice(1).map((q, i) => `<line x1="${p[i][0]}" y1="${p[i][1]}" x2="${q[0]}" y2="${q[1]}" stroke="${o.cols[i % o.cols.length]}" stroke-width="5" stroke-linecap="round"/>`).join('')
    : `<polyline points="${pts(p)}" fill="none" stroke="var(--jewel)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<svg class="doodle" viewBox="60 120 300 320" role="img" aria-label="${esc(o.label || 'Your route so far')}">${line}${o.loop ? '' : meDot(...end)}<g transform="translate(195 400)"><circle r="9" fill="#1A0B3D" stroke="#FBF7FF" stroke-width="2"/></g></svg>`;
}
// Get Out the Door: a doorway, open, with a step outside (pass 2: Sky)
export function doorDoodle() {
  return `<svg class="doodle door-doodle" viewBox="60 120 300 320" role="img" aria-label="An open door"><path d="M150 410V170h120v240" fill="none" stroke="var(--jewel)" stroke-width="5" stroke-linejoin="round"/><path d="M150 170l-40 30v230l40-20" fill="none" stroke="var(--jewel)" stroke-width="5" stroke-linejoin="round" opacity=".7"/><path d="M90 410h240" stroke="var(--jewel)" stroke-width="5" stroke-linecap="round"/>${meDot(210, 380)}</svg>`;
}

// postcard route shape: start and end trimmed (privacy)
export function postcardRoute() {
  const r = [[60, 150], [60, 110], [120, 110], [120, 60], [200, 60], [200, 120], [260, 120], [260, 70]];
  const shown = blurShared() ? r.slice(1, -1) : r;   // trimmed unless the player chose to show home
  return `<svg viewBox="40 40 240 130" class="pc-route" aria-hidden="true"><defs><linearGradient id="pcg" x1="0" x2="1"><stop offset="0" stop-color="#F5B82E"/><stop offset="1" stop-color="#00CD9D"/></linearGradient></defs><polyline points="${pts(shown)}" fill="none" stroke="url(#pcg)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>${r.slice(1, -1).filter((_, i) => i % 2).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#1A0B3D"/>`).join('')}</svg>`;
}

// a small map with one gem on it, for nudging the pin while you save (no tap target on the gem)
export function gemSpotMap(id, g) {
  return homeMap({ id, fog: false, filter: 'none', frontier: false }).replace(/<\/svg>$/, gemAt({ ...g, id: 'spot', mine: true }, 32, id).replace(/ data-gem="[^"]*"| tabindex="0" role="button"/g, '') + '</svg>');
}
