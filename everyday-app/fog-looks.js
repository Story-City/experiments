// Different ways of drawing the fog. Each look paints the whole fog layer in
// map coordinates (390 × 640); app.js then cuts the cleared ground out of it.
// Animated looks repaint every frame with t = seconds since the page opened.

const W = 390;
const H = 640;

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
import { TERRAIN } from './terrain.js';

const rgba = ([r, g, b, a], k = 1) => `rgba(${r},${g},${b},${a * k})`;

// A seamless tile of soft round blobs, so it can drift forever without seams.
function tile(size, n, rmin, rmax, colors, seed) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = r() * size;
    const y = r() * size;
    const rad = rmin + r() * (rmax - rmin);
    const col = colors[Math.floor(r() * colors.length)];
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        const cx = x + dx;
        const cy = y + dy;
        if (cx + rad < 0 || cy + rad < 0 || cx - rad > size || cy - rad > size) continue;
        const grad = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
        grad.addColorStop(0, rgba(col));
        grad.addColorStop(0.55, rgba(col, 0.45));
        grad.addColorStop(1, rgba(col, 0));
        g.fillStyle = grad;
        g.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      }
    }
  }
  return c;
}

// Fill the map with a tile, shifted, turned (degrees round the map's middle) and scaled.
function drift(p, t, { ox = 0, oy = 0, rot = 0, scale = 1, alpha = 1 }) {
  t.pat ||= p.createPattern(t, 'repeat');
  t.pat.setTransform(new DOMMatrix().translateSelf(W / 2, H / 2).rotateSelf(rot).scaleSelf(scale).translateSelf(-W / 2 + ox, -H / 2 + oy));
  p.globalAlpha = alpha;
  p.fillStyle = t.pat;
  p.fillRect(0, 0, W, H);
  p.globalAlpha = 1;
}

// Contour lines from real ground heights (terrain.js: central Edmonton's river
// valley). One height map sliced every 2 m, so lines nest and never cross,
// bunch up on the steep banks and spread out on the flats. Every 10 m is a
// slightly stronger "index" line, like a real topo map. Land doesn't move, so
// each style of lines is drawn once and reused.
const SCALE = 2; // contour canvas pixels per map unit
const INTERVAL = 2; // metres between lines
const lineCache = {};
function smoothGrid() {
  const { nx, ny, h } = TERRAIN;
  let g = Float32Array.from(h);
  for (let pass = 0; pass < 2; pass++) { // soften survey noise so lines don't jitter
    const out = new Float32Array(g.length);
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        let sum = 0;
        let n = 0;
        for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
          const x = i + di;
          const y = j + dj;
          if (x >= 0 && y >= 0 && x < nx && y < ny) { sum += g[y * nx + x]; n++; }
        }
        out[j * nx + i] = sum / n;
      }
    }
    g = out;
  }
  return g;
}
function contourCanvas({ color, width, minor, major }) {
  const key = [color, width, minor, major].join();
  if (lineCache[key]) return lineCache[key];
  const { nx, ny, step } = TERRAIN;
  const g = (lineCache.grid ||= smoothGrid());
  let lo = Infinity;
  let hi = -Infinity;
  g.forEach((v) => { lo = Math.min(lo, v); hi = Math.max(hi, v); });
  const c = document.createElement('canvas');
  c.width = W * SCALE;
  c.height = H * SCALE;
  const p = c.getContext('2d');
  p.scale(SCALE, SCALE);
  p.strokeStyle = color;
  p.lineWidth = width;
  p.lineCap = 'round';
  // marching squares: in each grid cell, find where this height crosses its edges
  for (let lv = Math.ceil(lo / INTERVAL) * INTERVAL; lv < hi; lv += INTERVAL) {
    p.beginPath();
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const a = g[j * nx + i];
        const b = g[j * nx + i + 1];
        const cc = g[(j + 1) * nx + i + 1];
        const d = g[(j + 1) * nx + i];
        const code = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (cc > lv ? 2 : 0) | (d > lv ? 1 : 0);
        if (code === 0 || code === 15) continue;
        const x = i * step;
        const y = j * step;
        const T = () => [x + (step * (lv - a)) / (b - a), y];
        const R = () => [x + step, y + (step * (lv - b)) / (cc - b)];
        const B = () => [x + (step * (lv - d)) / (cc - d), y + step];
        const L = () => [x, y + (step * (lv - a)) / (d - a)];
        const pairs = {
          1: [[L, B]], 2: [[B, R]], 3: [[L, R]], 4: [[T, R]], 5: [[T, R], [L, B]], 6: [[T, B]], 7: [[L, T]],
          8: [[L, T]], 9: [[T, B]], 10: [[L, T], [B, R]], 11: [[T, R]], 12: [[L, R]], 13: [[B, R]], 14: [[L, B]],
        }[code];
        for (const [u, v] of pairs) { const [x1, y1] = u(); const [x2, y2] = v(); p.moveTo(x1, y1); p.lineTo(x2, y2); }
      }
    }
    p.globalAlpha = Math.round(lv) % 10 === 0 ? major : minor;
    p.stroke();
  }
  return (lineCache[key] = c);
}
function contours(p, opts, alpha = 1) {
  p.globalAlpha = alpha;
  p.drawImage(contourCanvas(opts), 0, 0, W, H);
  p.globalAlpha = 1;
}

function grain(p, n, light, dark, seed) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    p.fillStyle = r() > 0.5 ? light : dark;
    p.fillRect(r() * W, r() * H, 0.8, 0.8);
  }
}

let T = {}; // tiles, made on first use

export const LOOKS = {
  swirl: {
    name: 'Soft swirl',
    what: 'Pale mist that slowly drifts and turns, with faint contour lines breathing underneath.',
    animated: true,
    paint(p, t) {
      T.swBig ||= tile(512, 26, 80, 200, [[255, 255, 255, 0.55], [150, 135, 200, 0.22]], 11);
      T.swMid ||= tile(320, 30, 40, 110, [[255, 255, 255, 0.45], [120, 100, 180, 0.18]], 23);
      T.swSmall ||= tile(220, 40, 20, 60, [[255, 255, 255, 0.35], [170, 155, 220, 0.15]], 37);
      p.fillStyle = '#e4ddf2';
      p.fillRect(0, 0, W, H);
      contours(p, { color: '#8f84b8', width: 0.6, minor: 0.2, major: 0.36 }, 0.85 + 0.15 * Math.sin(t * 0.6));
      drift(p, T.swBig, { ox: t * 7, oy: t * 3, rot: Math.sin(t * 0.05) * 8 });
      drift(p, T.swMid, { ox: -t * 11, oy: t * 6, rot: -t * 0.8, alpha: 0.7 + 0.25 * Math.sin(t * 0.5) });
      drift(p, T.swSmall, { ox: t * 4, oy: -t * 9, rot: t * 1.3, scale: 1.2, alpha: 0.6 + 0.2 * Math.sin(t * 0.8 + 1) });
    },
  },
  paper: {
    name: 'Topo paper',
    what: 'Still, pale paper with clear contour lines (the first version, from Leo’s TikTok).',
    animated: false,
    paint(p) {
      T.paper ||= tile(512, 40, 30, 120, [[255, 255, 255, 0.35], [120, 105, 170, 0.16]], 7);
      p.fillStyle = '#ddd6ee';
      p.fillRect(0, 0, W, H);
      drift(p, T.paper, {});
      contours(p, { color: '#8f84b8', width: 0.7, minor: 0.3, major: 0.6 });
      grain(p, 2600, 'rgba(255,255,255,0.25)', 'rgba(60,40,110,0.08)', 3);
    },
  },
  night: {
    name: 'Night mist',
    rim: [190, 170, 255],
    what: 'Dark, in the app’s own purples. Wisps roll across; the map glows through where you’ve walked.',
    animated: true,
    paint(p, t) {
      T.nBig ||= tile(512, 22, 90, 220, [[70, 56, 125, 0.55], [100, 80, 175, 0.25]], 5);
      T.nWisp ||= tile(300, 30, 40, 120, [[170, 150, 245, 0.28], [90, 160, 255, 0.16]], 9);
      p.fillStyle = '#140a2e';
      p.fillRect(0, 0, W, H);
      drift(p, T.nBig, { ox: t * 6, oy: -t * 2, rot: Math.sin(t * 0.04) * 6 });
      drift(p, T.nWisp, { ox: -t * 14, oy: t * 4, scale: 1.4, alpha: 0.75 + 0.25 * Math.sin(t * 0.7) });
      contours(p, { color: '#9d8cff', width: 0.6, minor: 0.07, major: 0.14 });
    },
  },
  clouds: {
    name: 'Cloud sea',
    what: 'Like looking down from above the clouds. Two layers drift past at different speeds.',
    animated: true,
    paint(p, t) {
      // each cloud layer is drawn twice: a blue-grey shadow, then the white tops
      T.cLowShade ||= tile(512, 40, 40, 100, [[95, 108, 165, 0.6]], 13);
      T.cLow ||= tile(512, 40, 40, 100, [[255, 255, 255, 1]], 13);
      T.cHighShade ||= tile(400, 26, 25, 70, [[110, 120, 175, 0.45]], 29);
      T.cHigh ||= tile(400, 26, 25, 70, [[255, 255, 255, 1]], 29);
      const sky = p.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#c9d2ee');
      sky.addColorStop(1, '#aab6df');
      p.fillStyle = sky;
      p.fillRect(0, 0, W, H);
      drift(p, T.cLowShade, { ox: t * 8 + 7, oy: t * 1.5 + 9 });
      drift(p, T.cLow, { ox: t * 8, oy: t * 1.5 });
      drift(p, T.cHighShade, { ox: t * 18 + 6, oy: t * 3 + 8, scale: 1.3 });
      drift(p, T.cHigh, { ox: t * 18, oy: t * 3, scale: 1.3 });
    },
  },
  darkClouds: {
    name: 'Dark cloud sea',
    what: 'Cloud sea at night: almost-black clouds with faint purple tops. The map you uncover is the brightest thing on screen.',
    animated: true,
    rim: [120, 105, 190],
    paint(p, t) {
      T.dLowShade ||= tile(512, 40, 40, 100, [[0, 0, 0, 0.75]], 13);
      T.dLow ||= tile(512, 40, 40, 100, [[26, 20, 44, 1]], 13);
      T.dHighShade ||= tile(400, 26, 25, 70, [[0, 0, 0, 0.6]], 29);
      T.dHigh ||= tile(400, 26, 25, 70, [[40, 32, 66, 1]], 29);
      const sky = p.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#06040d');
      sky.addColorStop(1, '#030207');
      p.fillStyle = sky;
      p.fillRect(0, 0, W, H);
      drift(p, T.dLowShade, { ox: t * 8 + 7, oy: t * 1.5 + 9 });
      drift(p, T.dLow, { ox: t * 8, oy: t * 1.5 });
      drift(p, T.dHighShade, { ox: t * 18 + 6, oy: t * 3 + 8, scale: 1.3 });
      drift(p, T.dHigh, { ox: t * 18, oy: t * 3, scale: 1.3 });
    },
  },
  stars: {
    name: 'Starry void',
    rim: [150, 190, 255],
    what: 'The unexplored map is night sky: slow nebula clouds and twinkling stars. Mystery, not weather.',
    animated: true,
    paint(p, t) {
      T.neb ||= tile(512, 18, 80, 200, [[90, 45, 160, 0.16], [30, 70, 170, 0.12], [150, 60, 130, 0.07]], 41);
      T.starList ||= (() => { const r = rng(53); return Array.from({ length: 170 }, () => [r() * W, r() * H, 0.5 + r() * 1.2, r() * 6, 0.4 + r() * 1.6]); })();
      p.fillStyle = '#030108'; // near black, so the uncovered map reads lighter
      p.fillRect(0, 0, W, H);
      drift(p, T.neb, { ox: t * 3, oy: t * 1.5, rot: t * 0.3 });
      T.starList.forEach(([x, y, s, ph, sp]) => {
        p.globalAlpha = 0.2 + 0.6 * Math.abs(Math.sin(t * sp + ph));
        p.fillStyle = '#fff';
        p.fillRect(x, y, s, s);
      });
      p.globalAlpha = 1;
    },
  },
};
