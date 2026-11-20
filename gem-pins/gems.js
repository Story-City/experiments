// Gem pins drawn as SVG inside a 44 × 44 tap area. Shapes live in a 24 × 24 box centred on (12, 12).
// "classic" is Victoria's gem cut (approved-ui/assets/gems). The category cuts (round, emerald, pear,
// hex, star, trillion) follow her style (19 Nov, for Brett): flat fill, a light table facet on top
// (white 30%), a dark pavilion facet below (black 22%), white facet lines (60%) and a white outline.

const SHAPES = {
  classic: {
    body: 'M7 2.5H17L22.5 8.5L12 21.5L1.5 8.5Z',
    light: 'M7 2.5H17L15 8.5H9Z',
    dark: 'M9 8.5H15L12 21.5Z',
    lines: 'M9 8.5L12 21.5L15 8.5M1.5 8.5H22.5',
  },
  round: {
    body: 'M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20Z',
    light: 'M8.2 3H15.8L14.4 10H9.6Z',
    dark: 'M9.6 10H14.4L12 21.9Z',
    lines: 'M2.2 10H21.8M9.6 10L12 21.9L14.4 10M8.2 3L9.6 10M15.8 3L14.4 10M3.6 15.6L9.6 10M20.4 15.6L14.4 10',
  },
  emerald: {
    body: 'M6.5 3H17.5L21.5 7V17L17.5 21H6.5L2.5 17V7Z',
    light: 'M6.5 3H17.5L16 7.5H8Z',
    dark: 'M8 16.5H16L17.5 21H6.5Z',
    lines: 'M8 7.5H16V16.5H8ZM2.5 7L8 7.5M21.5 7L16 7.5M2.5 17L8 16.5M21.5 17L16 16.5',
  },
  pear: {
    body: 'M12 1.5C14.5 4.8 19.5 9.6 19.5 14.6C19.5 18.9 16.1 22.3 12 22.3C7.9 22.3 4.5 18.9 4.5 14.6C4.5 9.6 9.5 4.8 12 1.5Z',
    light: 'M12 1.5L15.2 11.2H8.8Z',
    dark: 'M8.8 11.2H15.2L12 22.3Z',
    lines: 'M8.8 11.2H15.2M12 1.5L8.8 11.2L12 22.3L15.2 11.2ZM4.7 13.2L8.8 11.2M19.3 13.2L15.2 11.2',
  },
  hex: {
    body: 'M12 1.5L21.5 7V17L12 22.5L2.5 17V7Z',
    light: 'M12 1.5L16.5 9.5H7.5Z',
    dark: 'M7.5 9.5H16.5L12 22.5Z',
    lines: 'M2.5 7L7.5 9.5H16.5L21.5 7M7.5 9.5L12 22.5L16.5 9.5M12 1.5L7.5 9.5M12 1.5L16.5 9.5M2.5 17L7.5 9.5M21.5 17L16.5 9.5',
  },
  star: {
    body: 'M12 1.8l3.1 6.4 7 .9-5.1 4.9 1.3 6.9L12 17.5l-6.3 3.4 1.3-6.9L1.9 9.1l7-.9Z',
    light: 'M12 1.8L14.4 9.2H9.6Z',
    dark: 'M9.6 9.2H14.4L12 17.5Z',
    lines: 'M9.6 9.2H14.4M12 1.8L9.6 9.2L12 17.5L14.4 9.2ZM1.9 9.1L9.6 9.2M22.1 9.1L14.4 9.2M5.7 20.9L12 17.5L18.3 20.9',
  },
  trillion: {
    body: 'M12 2.5L22 20.5H2Z',
    light: 'M12 2.5L15.2 10.5H8.8Z',
    dark: 'M8.8 10.5H15.2L12 20.5Z',
    lines: 'M8.8 10.5H15.2L12 20.5ZM12 2.5L8.8 10.5M12 2.5L15.2 10.5M2 20.5L8.8 10.5M22 20.5L15.2 10.5',
  },
};

// Crystal set: flat two-tone shapes with one highlight stroke and no white edge.
Object.assign(SHAPES, {
  leaf: { flat: true, body: 'M12 1.5C17.5 6 19 9.5 19 12s-1.5 6-7 10.5C6.5 18 5 14.5 5 12s1.5-6 7-10.5Z', dark: 'M12 1.5C17.5 6 19 9.5 19 12s-1.5 6-7 10.5Z', hi: 'M9.4 6.6C8.3 8.3 7.9 10 8 12' },
  pebble: { flat: true, body: 'M2.5 13.5C2.5 9.2 6 6.5 10.5 6.5c3.2 0 5.8 1 8 2.3C20.8 10.2 21.8 12 21.8 14c0 2.8-3.6 4-9.3 4-6.5 0-10-1.4-10-4.5Z', dark: 'M2.6 13.8c1.6 1.8 4.6 2.4 9.6 2.4 4.6 0 8.2-.8 9.6-2.1-.1 2.7-3.7 3.9-9.3 3.9-6.4 0-9.8-1.3-9.9-4.2Z', hi: 'M7.6 9.3c1.1-.6 2.3-.9 3.4-.9' },
  shard: { flat: true, body: 'M8.6 3.6L13.4 1.5 15.9 4.2 16.6 22.5H8.4L8 8.2Z', dark: 'M13 3.4L15.9 4.2 16.6 22.5H13.4Z', hi: 'M9.7 8.2v9.5' },
  bar: { flat: true, body: 'M2.5 8.5L5.5 5.5H19.5L22 8V15.8L19 18.8H5.5L2.5 15.8Z', dark: 'M19.6 10.3L22 8V15.8L19 18.8H5.5L8.4 16.1H19.6Z', hi: 'M9.6 9.3H15.4' },
});

// Seasonal shapes (option 22A): one per season.
Object.assign(SHAPES, {
  winter: { flat: true, body: 'M12 1.5 L9.7 8.02 L2.91 6.75 L7.4 12 L2.91 17.25 L9.7 15.98 L12 22.5 L14.3 15.98 L21.09 17.25 L16.6 12 L21.09 6.75 L14.3 8.02Z', dark: 'M12 12L12 1.5 16 9.7 21.1 6.75Z', hi: 'M9.5 7.5l1.4 2.3' },
  autumn: { flat: true, body: 'M12 1.5l2.2 4.3 3.3-1.4-.8 4.6 4.3-.4-2.6 3.6 2.6 2.2-5 .9.9 3.3L13 17v5.5h-2V17l-4.5 1.6.9-3.3-5-.9 2.6-2.2-2.6-3.6 4.3.4-.8-4.6 3.3 1.4Z', dark: 'M12 1.5l2.2 4.3 3.3-1.4-.8 4.6 4.3-.4-2.6 3.6 2.6 2.2-5 .9.9 3.3L13 17v5.5h-1V1.5Z', hi: 'M9 8.5l1.5 2' },
  spring: { flat: true, body: 'M7.4 6.8a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0-9.2 0ZM12.35 10.39a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0-9.2 0ZM10.46 16.21a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0-9.2 0ZM4.34 16.21a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0-9.2 0ZM2.45 10.39a4.6 4.6 0 1 0 9.2 0a4.6 4.6 0 1 0-9.2 0Z', dark: 'M12 9.2a2.8 2.8 0 1 0 0 5.6a2.8 2.8 0 1 0 0-5.6Z', hi: 'M10 4.6c.8-.5 1.6-.6 2.4-.5' },
  summer: { flat: true, body: 'M12 5.6a6.4 6.4 0 1 1 0 12.8a6.4 6.4 0 1 1 0-12.8ZM19.11 9.95L23.2 12L19.11 14.05ZM18.47 15.58L19.92 19.92L15.58 18.47ZM14.05 19.11L12 23.2L9.95 19.11ZM8.42 18.47L4.08 19.92L5.53 15.58ZM4.89 14.05L0.8 12L4.89 9.95ZM5.53 8.42L4.08 4.08L8.42 5.53ZM9.95 4.89L12 0.8L14.05 4.89ZM15.58 5.53L19.92 4.08L18.47 8.42Z', dark: 'M12 5.6a6.4 6.4 0 0 1 0 12.8Z', hi: 'M9.3 9.4c.6-.8 1.4-1.3 2.3-1.5' },
});
const CLOCK = 'M0-3.4v3.4l2.2 1.4';

const HEART = 'M0 2.6s-3.4-2.1-4.2-4.2c-.5-1.4.4-2.9 1.9-2.9.9 0 1.6.5 2.3 1.2.7-.7 1.4-1.2 2.3-1.2 1.5 0 2.4 1.5 1.9 2.9C3.4.5 0 2.6 0 2.6Z';
const CHECK = 'M-3 0l2 2.2L3.2-2.2';
const LOCK = 'M-2.6-.6v-1.6a2.6 2.6 0 0 1 5.2 0v1.6M-3.6-.6h7.2v4.4h-7.2Z';

// One pin. o: { shape, size, fill, hollow, ring: 'dashed' | 'solid' | null, ringColour, lock, heart, double, glow, pulse }
// Hourglass crystal for expiring gems (21E, Melissa 20 Nov): a hexagonal crystal pinched at the waist.
// Drawn like Victoria's gems (three-tone facets, white facet lines, bold white outline), or as glowing
// lines for Neon. Returns gem-art markup (100 × 100 box) so it scales into the pin like the other art.
const mixHex = (hex, to, t) => '#' + [1, 3, 5].map((i) => { const c = parseInt(hex.slice(i, i + 2), 16); return Math.round(c + (to - c) * t).toString(16).padStart(2, '0'); }).join('');
export function hourglassArt(colour, neon = false) {
  const P = { A: '28 12', B: '36 17', C: '64 17', D: '72 12', L: '42 50', BW: '46 53', CW: '54 53', R: '58 50', E: '28 88', F: '36 93', G: '64 93', H: '72 88', T1: '36 7', T2: '64 7' };
  const f = (...k) => 'M' + k.map((x) => P[x]).join(' L') + 'Z';
  const outline = 'M36 7 L64 7 L72 12 L58 50 L72 88 L64 93 L36 93 L28 88 L42 50 L28 12Z';
  const edges = `M${P.B} L${P.C} M${P.A} L${P.B} M${P.C} L${P.D} M${P.B} L${P.BW} L${P.F} M${P.C} L${P.CW} L${P.G} M${P.L} L${P.BW} L${P.CW} L${P.R} M${P.E} L${P.F} L${P.G} L${P.H}`;
  if (neon) {
    const id = 'hgn';
    return `<svg viewBox="-8 -8 116 116" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter></defs>`
      + `<g filter="url(#${id})" opacity=".8"><path d="${outline}" fill="none" stroke="${colour}" stroke-width="6" stroke-linejoin="round"/></g>`
      + `<path d="${edges}" fill="none" stroke="${mixHex(colour, 255, 0.35)}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`
      + `<path d="${outline}" fill="none" stroke="${mixHex(colour, 255, 0.45)}" stroke-width="3.6" stroke-linejoin="round"/></svg>`;
  }
  const light = mixHex(colour, 255, 0.4), top = mixHex(colour, 255, 0.62), dark = mixHex(colour, 0, 0.32);
  return `<svg viewBox="-6 -6 112 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`
    + `<path d="${f('A', 'B', 'BW', 'L')}" fill="${colour}"/><path d="${f('B', 'C', 'CW', 'BW')}" fill="${light}"/><path d="${f('C', 'D', 'R', 'CW')}" fill="${dark}"/>`
    + `<path d="${f('L', 'BW', 'F', 'E')}" fill="${dark}"/><path d="${f('BW', 'CW', 'G', 'F')}" fill="${colour}"/><path d="${f('CW', 'R', 'H', 'G')}" fill="${mixHex(colour, 0, 0.5)}"/>`
    + `<path d="${f('A', 'T1', 'T2', 'D', 'C', 'B')}" fill="${top}"/>`
    + `<path d="M41 24 L44 40" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
    + `<path d="${edges}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>`
    + `<path d="${outline}" fill="none" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/></svg>`;
}

// Gem art (option 25): the Branding session's SVGs, scaled into the pin. Each copy gets its own
// filter ids so many pins on one map don't clash.
let artUid = 0;
function artMarkup(markup, size) {
  const n = ++artUid;
  const d = size * 1.25, at = 22 - d / 2;
  return markup.replace(/id="([^"]+)"/g, (m, id) => `id="${id}-p${n}"`).replace(/url\(#([^)]+)\)/g, (m, id) => `url(#${id}-p${n})`)
    .replace('<svg ', `<svg x="${at.toFixed(1)}" y="${at.toFixed(1)}" width="${d.toFixed(1)}" height="${d.toFixed(1)}" overflow="visible" `);
}

export function pinSvg(o) {
  const s = SHAPES[o.shape] || SHAPES.classic;
  const k = o.size / 24;
  const r = o.size / 2;
  const parts = [];
  if (o.double) {
    parts.push(`<circle cx="22" cy="22" r="${r + 3.5}" fill="none" stroke="${o.loveColour}" stroke-width="1.6"/>`);
    parts.push(`<circle cx="22" cy="22" r="${r + 6.5}" fill="none" stroke="${o.loveColour}" stroke-width="1.6"/>`);
  }
  if (o.ring) parts.push(`<circle cx="22" cy="22" r="${r + 4}" fill="rgba(23,12,53,.35)" stroke="${o.ringColour}" stroke-width="2"${o.ring === 'dashed' ? ' stroke-dasharray="3.2 2.6"' : ''}/>`);
  // expiring, behind the gem: a warm yellow glow (21I) or rays (21H), both pulsing
  if (o.expireGlow) parts.push(`<circle class="expire-glow" cx="22" cy="22" r="${(r + 6).toFixed(1)}" fill="#ffc44a" style="filter: blur(5px)"/>`);
  if (o.expireRays) {
    const rays = [];
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + Math.PI / 8, c = Math.cos(a), s2 = Math.sin(a);
      rays.push(`M${(22 + c * (r + 3)).toFixed(1)} ${(22 + s2 * (r + 3)).toFixed(1)}L${(22 + c * (r + 8)).toFixed(1)} ${(22 + s2 * (r + 8)).toFixed(1)}`);
    }
    parts.push(`<path class="expire-rays" d="${rays.join('')}" stroke="#ffc44a" stroke-width="2.2" stroke-linecap="round" fill="none"/>`);
  }
  // yours (6G plinth / 6H ground ring): marked underneath, so the category gem stays as it is
  const foot = 22 + (o.art ? o.size * 0.56 : r * 0.92);
  if (o.groundRing) {
    const rx = o.size * 0.5, ry = o.size * 0.17, c = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    const dash = o.groundRing === 'broken' ? ` stroke-dasharray="${(c * 0.32).toFixed(1)} ${(c * 0.18).toFixed(1)}" stroke-dashoffset="${(c * 0.09).toFixed(1)}"` : '';
    parts.push(`<ellipse cx="22" cy="${foot.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${o.groundRing === 'broken' ? 'none' : 'rgba(255,255,255,.12)'}" stroke="#fff" stroke-width="2"${dash}/>`);
  }
  if (o.art) parts.push(artMarkup(o.art, o.size * (o.artScale || 1)));
  else {
  const g = [`<g transform="translate(${22 - 12 * k} ${22 - 12 * k}) scale(${k})">`];
  if (o.hollow) {
    // dotted = private (6E): round dots, a touch heavier so the dots read
    const dots = o.dotted ? ` stroke-dasharray="${(0.01 / k).toFixed(3)} ${(3 / k).toFixed(2)}" stroke-linecap="round"` : '';
    g.push(`<path d="${s.body}" fill="${o.fill}" fill-opacity=".16" stroke="${o.outline || o.fill}" stroke-width="${((o.dotted ? 2 : 1.4) / k).toFixed(2)}" stroke-linejoin="round"${dots}/>`); // same weight as the other gems' edge
  } else if (s.flat) {
    g.push(`<path d="${s.body}" fill="${o.fill}"/>`);
    g.push(`<path d="${s.dark}" fill="#000" fill-opacity=".2"/>`);
    g.push(`<path d="${s.hi}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="${(1.3 / k).toFixed(2)}" stroke-linecap="round"/>`);
    if (o.outline) g.push(`<path d="${s.body}" fill="none" stroke="${o.outline}" stroke-width="${(2.2 / k).toFixed(2)}" stroke-linejoin="round"/>`);
  } else {
    g.push(`<path d="${s.body}" fill="${o.fill}"/>`);
    g.push(`<path d="${s.light}" fill="#fff" fill-opacity=".3"/>`);
    g.push(`<path d="${s.dark}" fill="#000" fill-opacity=".22"/>`);
    g.push(`<path d="${s.lines}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="${(0.9 / k).toFixed(2)}" stroke-linejoin="round"/>`);
    g.push(`<path d="${s.body}" fill="none" stroke="${o.outline || '#fff'}" stroke-width="${((o.outline ? 2.2 : 1.4) / k).toFixed(2)}" stroke-linejoin="round"/>`);
  }
  g.push('</g>');
  parts.push(g.join(''));
  }
  if (o.plinth) {
    const w = o.size * 0.86, top = foot + 0.5, h = 5;
    const d = `M${(22 - w / 2 + 1.5).toFixed(1)} ${top.toFixed(1)}H${(22 + w / 2 - 1.5).toFixed(1)}L${(22 + w / 2).toFixed(1)} ${(top + h).toFixed(1)}H${(22 - w / 2).toFixed(1)}Z`;
    if (o.plinth === 'solid') parts.push(`<path d="${d}" fill="#fff" stroke="#170c35" stroke-width=".8" stroke-linejoin="round"/>`);
    else parts.push(`<path d="${d}" fill="rgba(23,12,53,.55)" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/><g transform="translate(22 ${(top + h / 2 + 0.2).toFixed(1)}) scale(.42)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"><path d="M-2.6-.6v-1.6a2.6 2.6 0 0 1 5.2 0v1.6M-3.6-.6h7.2v4.4h-7.2Z"/></g>`);
  }
  // badges sit on the gem's corner, so they move in with smaller gems
  const bx = 22 + r * 0.72;
  if (o.heart) parts.push(`<g transform="translate(${bx} ${22 - r * 0.72})"><circle r="6.5" fill="${o.loveColour}" stroke="#170c35" stroke-width="1.5"/><path d="${HEART}" fill="#fff"/></g>`);
  if (o.lock) parts.push(`<g transform="translate(${bx} ${22 + r * 0.72})"><circle r="6.5" fill="#241b46" stroke="#fff" stroke-width="1.3"/><path d="${LOCK}" fill="none" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></g>`);
  if (o.check) parts.push(`<g transform="translate(${22 - r * 0.72} ${22 + r * 0.72})"><circle r="6.5" fill="#3ddc84" stroke="#170c35" stroke-width="1.5"/><path d="${CHECK}" fill="none" stroke="#0b0620" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  // time-limited: expiring soon (21) and seasonal badge (22B)
  if (o.clock) parts.push(`<g transform="translate(${22 - r * 0.72} ${22 - r * 0.72})"><circle r="6.5" fill="#ffb020" stroke="#170c35" stroke-width="1.5"/><circle r="4" fill="none" stroke="#2a1600" stroke-width="1.2"/><path d="${CLOCK}" transform="scale(.9)" fill="none" stroke="#2a1600" stroke-width="1.3" stroke-linecap="round"/></g>`);
  if (o.countdown) { const w = 6 + o.countdown.length * 5.2; parts.push(`<g transform="translate(22 ${22 + r + 5})"><rect x="${-w / 2}" y="-6" width="${w}" height="12" rx="6" fill="#ffb020" stroke="#170c35" stroke-width="1.2"/><text y="3.2" text-anchor="middle" font-size="8.5" font-weight="800" font-family="system-ui, sans-serif" fill="#2a1600">${o.countdown}</text></g>`); }
  if (o.expireRing) parts.push(`<circle class="expire-ring" cx="22" cy="22" r="${r + 4}" fill="none" stroke="#ffb020" stroke-width="2" stroke-dasharray="4 3"/>`);
  if (o.seasonBadge) parts.push(`<g transform="translate(${22 - r * 0.72} ${22 - r * 0.72})"><circle r="6.5" fill="${o.seasonBadge}" stroke="#170c35" stroke-width="1.5"/><path d="M0-4v8M-3.5-2l7 4M-3.5 2l7-4" stroke="#170c35" stroke-width="1.3" stroke-linecap="round"/></g>`);
  // sparkle: little stars twinkling round rarer gems (option 3E)
  // 29: A stars, B tiny glints, C one corner glint, D orbiting dust (subtler as the letters go on)
  const SPOTS = [[-1, -1.05], [1.15, -0.35], [-1.2, 0.5], [0.75, 1.05]];
  const n = o.sparkle || 0;
  if (n && (!o.sparkStyle || o.sparkStyle === 'stars')) {
    for (let i = 0; i < n; i++) {
      const [sx, sy] = SPOTS[i];
      parts.push(`<g transform="translate(${(22 + sx * (r + 3)).toFixed(1)} ${(22 + sy * (r + 3)).toFixed(1)})"><path class="spark" style="animation-delay:${(i * 0.45).toFixed(2)}s" d="M0-3.4L.9-.9 3.4 0 .9.9 0 3.4-.9.9-3.4 0-.9-.9Z" fill="#fff"/></g>`);
    }
  } else if (n && o.sparkStyle === 'glints') {
    for (let i = 0; i < n; i++) {
      const [sx, sy] = SPOTS[(i * 3) % 4];
      parts.push(`<circle class="glint-dot" style="animation-delay:${(i * 0.9).toFixed(1)}s" cx="${(22 + sx * (r + 1.5)).toFixed(1)}" cy="${(22 + sy * (r + 1.5)).toFixed(1)}" r="1.1" fill="#fff"/>`);
    }
  } else if (n && o.sparkStyle === 'corner') {
    parts.push(`<g transform="translate(${(22 + r * 0.55).toFixed(1)} ${(22 - r * 0.6).toFixed(1)}) scale(${(0.5 + n * 0.12).toFixed(2)})"><path class="corner-glint" d="M0-4L.7-.7 4 0 .7.7 0 4-.7.7-4 0-.7-.7Z" fill="#fff"/></g>`);
  } else if (n && o.sparkStyle === 'dust') {
    const dots = [];
    for (let i = 0; i < n + 2; i++) { const a = (i / (n + 2)) * Math.PI * 2; dots.push(`<circle cx="${(22 + Math.cos(a) * (r + 4)).toFixed(1)}" cy="${(22 + Math.sin(a) * (r + 4) * 0.8).toFixed(1)}" r="${i % 2 ? 0.8 : 1.1}" fill="#fff" opacity="${i % 2 ? 0.45 : 0.75}"/>`); }
    parts.push(`<g class="dust">${dots.join('')}</g>`);
  }
  const cls = ['pin-svg', o.glow ? `glow-${o.glow}` : ''].join(' ').trim();
  return `<svg class="${cls}" viewBox="0 0 44 44" width="44" height="44" style="--glow:${o.fill}" aria-hidden="true">${parts.join('')}</svg>`;
}
