// Victoria's gem art, copied from Story-City/experiments approved-ui/assets/gems (Nov 18, 2026):
// one cut, a colour per rarity. Copied, not linked, because experiment folders don't share files.

export const GEM_COLORS = {
  aquamarine: '#00c2ff',
  moonstone: '#c8d2e6',
  topaz: '#ffc448',
  opal: '#d2dcff',
  diamond: '#b4f0ff',
  hidden: '#9370c4',
};

// Her SVG is 24 × 22; the gem's middle is (12, 11).
const OUTLINE = 'M7 1.5H17L22.5 7.5L12 20.5L1.5 7.5Z';
const PARTS = (color) => [
  { d: OUTLINE, fill: color },
  { d: 'M7 1.5H17L15 7.5H9Z', fill: '#fff', fillOpacity: 0.3 },
  { d: 'M9 7.5H15L12 20.5Z', fill: '#000', fillOpacity: 0.22 },
  { d: 'M9 7.5L12 20.5L15 7.5M1.5 7.5H22.5', stroke: '#fff', strokeOpacity: 0.6, width: 1 },
  { d: OUTLINE, stroke: '#fff', strokeOpacity: 1, width: 1.5 },
];

// SVG markup for one gem centred on (0, 0), `size` map units wide.
export function gemMarkup(rarity, size = 22) {
  const s = size / 24;
  const paths = PARTS(GEM_COLORS[rarity]).map((p) => p.stroke
    ? `<path d="${p.d}" fill="none" stroke="${p.stroke}" stroke-opacity="${p.strokeOpacity}" stroke-width="${p.width}" stroke-linejoin="round"/>`
    : `<path d="${p.d}" fill="${p.fill}"${p.fillOpacity != null ? ` fill-opacity="${p.fillOpacity}"` : ''}/>`).join('');
  return `<g transform="scale(${s}) translate(-12 -11)">${paths}</g>`;
}

// Just the outline (for the blurred shape that shows through the fog).
export function gemGhostMarkup(size = 22) {
  return `<path transform="scale(${size / 24}) translate(-12 -11)" d="${OUTLINE}"/>`;
}

// Draw one gem on a canvas, centred on (x, y), `size` wide.
export function drawGem(g, rarity, x, y, size = 22) {
  const s = size / 24;
  g.save();
  g.translate(x, y); g.scale(s, s); g.translate(-12, -11);
  g.lineJoin = 'round';
  for (const p of PARTS(GEM_COLORS[rarity])) {
    const path = new Path2D(p.d);
    if (p.stroke) { g.globalAlpha = p.strokeOpacity; g.strokeStyle = p.stroke; g.lineWidth = p.width; g.stroke(path); }
    else { g.globalAlpha = p.fillOpacity ?? 1; g.fillStyle = p.fill; g.fill(path); }
  }
  g.restore();
}
