// Gem pins drawn as SVG inside a 44 × 44 tap area. Shapes live in a 24 × 24 box centred on (12, 12).
// "classic" is Victoria's gem cut (approved-ui/assets/gems); the rest are one shape per category.

const SHAPES = {
  classic: {
    body: 'M7 2.5H17L22.5 8.5L12 21.5L1.5 8.5Z',
    light: 'M7 2.5H17L15 8.5H9Z',
    dark: 'M9 8.5H15L12 21.5Z',
    lines: 'M9 8.5L12 21.5L15 8.5M1.5 8.5H22.5',
  },
  round: {
    body: 'M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20Z',
    light: 'M7 4.5h10l3.2 3.8H3.8Z',
    dark: 'M8.5 16.5h7L12 21.5Z',
    lines: 'M3.8 8.3h16.4M7 4.5L12 8.3 17 4.5M12 8.3v13',
  },
  emerald: {
    body: 'M6.5 2.5h11l4 4v11l-4 4h-11l-4-4v-11Z',
    light: 'M6.5 2.5h11l4 4h-19Z',
    dark: 'M2.5 17.5h19l-4 4h-11Z',
    lines: 'M7 7h10v10H7Z',
  },
  pear: {
    body: 'M12 2C15.5 6.5 20 10.5 20 14.5a8 8 0 0 1-16 0C4 10.5 8.5 6.5 12 2Z',
    light: 'M12 2C14 4.6 16 6.6 17.3 8.6H6.7C8 6.6 10 4.6 12 2Z',
    dark: 'M8 19.5h8L12 22.5Z',
    lines: 'M6.7 8.6h10.6M12 2v20.5',
  },
  hex: {
    body: 'M12 1.5l9.5 5.5v10L12 22.5 2.5 17V7Z',
    light: 'M12 1.5l9.5 5.5L12 12.5 2.5 7Z',
    dark: 'M12 12.5l9.5 4.5L12 22.5Z',
    lines: 'M2.5 7L12 12.5 21.5 7M12 12.5v10',
  },
  star: {
    body: 'M12 1.8l3.1 6.4 7 .9-5.1 4.9 1.3 6.9L12 17.5l-6.3 3.4 1.3-6.9L1.9 9.1l7-.9Z',
    light: 'M12 1.8l3.1 6.4L12 12 8.9 8.2Z',
    dark: 'M12 12l6.3 8.9L12 17.5Z',
    lines: 'M12 12L12 1.8M12 12l10-2.9M12 12l6.3 8.9M12 12l-6.3 8.9M12 12L1.9 9.1',
  },
  trillion: {
    body: 'M12 2.5L22 20.5H2Z',
    light: 'M12 2.5L17 11.5H7Z',
    dark: 'M12 14.5L22 20.5H2Z',
    lines: 'M12 2.5v12M2 20.5l10-6 10 6',
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
  const g = [`<g transform="translate(${22 - 12 * k} ${22 - 12 * k}) scale(${k})">`];
  if (o.hollow) {
    g.push(`<path d="${s.body}" fill="${o.fill}" fill-opacity=".16" stroke="${o.outline || o.fill}" stroke-width="${(1.4 / k).toFixed(2)}" stroke-linejoin="round"/>`); // same weight as the other gems' edge
  } else if (s.flat) {
    g.push(`<path d="${s.body}" fill="${o.fill}"/>`);
    g.push(`<path d="${s.dark}" fill="#000" fill-opacity=".2"/>`);
    g.push(`<path d="${s.hi}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="${(1.3 / k).toFixed(2)}" stroke-linecap="round"/>`);
    if (o.outline) g.push(`<path d="${s.body}" fill="none" stroke="${o.outline}" stroke-width="${(2.2 / k).toFixed(2)}" stroke-linejoin="round"/>`);
  } else {
    g.push(`<path d="${s.body}" fill="${o.fill}"/>`);
    g.push(`<path d="${s.light}" fill="#fff" fill-opacity=".32"/>`);
    g.push(`<path d="${s.dark}" fill="#000" fill-opacity=".22"/>`);
    g.push(`<path d="${s.lines}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${(0.9 / k).toFixed(2)}" stroke-linejoin="round"/>`);
    g.push(`<path d="${s.body}" fill="none" stroke="${o.outline || '#fff'}" stroke-width="${((o.outline ? 2.2 : 1.4) / k).toFixed(2)}" stroke-linejoin="round"/>`);
  }
  g.push('</g>');
  parts.push(g.join(''));
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
  const SPOTS = [[-1, -1.05], [1.15, -0.35], [-1.2, 0.5], [0.75, 1.05]];
  for (let i = 0; i < (o.sparkle || 0); i++) {
    const [sx, sy] = SPOTS[i];
    parts.push(`<path class="spark" style="animation-delay:${(i * 0.45).toFixed(2)}s" transform="translate(${(22 + sx * (r + 3)).toFixed(1)} ${(22 + sy * (r + 3)).toFixed(1)})" d="M0-3.4L.9-.9 3.4 0 .9.9 0 3.4-.9.9-3.4 0-.9-.9Z" fill="#fff"/>`);
  }
  const cls = ['pin-svg', o.glow ? `glow-${o.glow}` : ''].join(' ').trim();
  return `<svg class="${cls}" viewBox="0 0 44 44" width="44" height="44" style="--glow:${o.fill}" aria-hidden="true">${parts.join('')}</svg>`;
}
