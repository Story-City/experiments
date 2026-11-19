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

const HEART = 'M0 2.6s-3.4-2.1-4.2-4.2c-.5-1.4.4-2.9 1.9-2.9.9 0 1.6.5 2.3 1.2.7-.7 1.4-1.2 2.3-1.2 1.5 0 2.4 1.5 1.9 2.9C3.4.5 0 2.6 0 2.6Z';
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
    g.push(`<path d="${s.body}" fill="${o.fill}" fill-opacity=".16" stroke="${o.fill}" stroke-width="${(2.6 / k).toFixed(2)}" stroke-linejoin="round"/>`);
  } else {
    g.push(`<path d="${s.body}" fill="${o.fill}"/>`);
    g.push(`<path d="${s.light}" fill="#fff" fill-opacity=".32"/>`);
    g.push(`<path d="${s.dark}" fill="#000" fill-opacity=".22"/>`);
    g.push(`<path d="${s.lines}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${(0.9 / k).toFixed(2)}" stroke-linejoin="round"/>`);
    g.push(`<path d="${s.body}" fill="none" stroke="#fff" stroke-width="${(1.4 / k).toFixed(2)}" stroke-linejoin="round"/>`);
  }
  g.push('</g>');
  parts.push(g.join(''));
  // badges sit on the gem's corner, so they move in with smaller gems
  const bx = 22 + r * 0.72;
  if (o.heart) parts.push(`<g transform="translate(${bx} ${22 - r * 0.72})"><circle r="6.5" fill="${o.loveColour}" stroke="#170c35" stroke-width="1.5"/><path d="${HEART}" fill="#fff"/></g>`);
  if (o.lock) parts.push(`<g transform="translate(${bx} ${22 + r * 0.72})"><circle r="6.5" fill="#241b46" stroke="#fff" stroke-width="1.3"/><path d="${LOCK}" fill="none" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></g>`);
  const cls = ['pin-svg', o.glow ? `glow-${o.glow}` : ''].join(' ').trim();
  return `<svg class="${cls}" viewBox="0 0 44 44" width="44" height="44" style="--glow:${o.fill}" aria-hidden="true">${parts.join('')}</svg>`;
}
