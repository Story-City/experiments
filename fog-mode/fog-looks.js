// Different ways of drawing the fog. Each look paints the whole fog layer in
// map coordinates (390 × 640); app.js then cuts the cleared ground out of it.
// Animated looks repaint every frame with t = seconds since the page opened.

const W = 390;
const H = 640;

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
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

// Wobbly rings round a few "hills", like contour lines. `time` makes them undulate.
function contours(p, { color, width = 0.8, alpha = 0.5, time = 0, seed = 7, hills }) {
  const r = rng(seed);
  p.strokeStyle = color;
  p.lineWidth = width;
  hills.forEach(([cx, cy, n]) => {
    const ph = [r() * 6, r() * 6, r() * 6];
    for (let k = 1; k <= n; k++) {
      const R = k * 15;
      p.beginPath();
      for (let a = 0; a <= 64; a++) {
        const th = (a / 64) * Math.PI * 2;
        const rr = R + Math.sin(th * 3 + ph[0] + time * 0.35) * R * 0.12 + Math.sin(th * 5 + ph[1] - time * 0.22) * R * 0.06 + Math.sin(th * 2 + ph[2] + k * 0.3 + time * 0.5) * 4;
        const x = cx + Math.cos(th) * rr;
        const y = cy + Math.sin(th) * rr * 0.82;
        a ? p.lineTo(x, y) : p.moveTo(x, y);
      }
      p.globalAlpha = typeof alpha === 'function' ? alpha(k) : alpha;
      p.stroke();
    }
  });
  p.globalAlpha = 1;
}

function grain(p, n, light, dark, seed) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    p.fillStyle = r() > 0.5 ? light : dark;
    p.fillRect(r() * W, r() * H, 0.8, 0.8);
  }
}

const HILLS = [[80, 120, 9], [300, 260, 11], [150, 520, 8], [360, 560, 6], [20, 380, 5]];
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
      contours(p, { color: '#8f84b8', width: 0.7, alpha: 0.24 + 0.08 * Math.sin(t * 0.6), time: t, hills: HILLS });
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
      contours(p, { color: '#8f84b8', alpha: (k) => (k % 4 === 0 ? 0.9 : 0.5), hills: HILLS });
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
      contours(p, { color: '#9d8cff', width: 0.6, alpha: 0.07, time: t * 0.7, seed: 19, hills: HILLS });
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
  parchment: {
    name: 'Old parchment',
    what: 'An unfinished explorer’s map: warm paper, faded grid, a compass rose. Walking “draws in” the streets.',
    animated: false,
    paint(p) {
      T.parch ||= tile(512, 50, 20, 110, [[160, 120, 70, 0.14], [255, 250, 235, 0.3], [120, 85, 45, 0.08]], 17);
      p.fillStyle = '#eadcbe';
      p.fillRect(0, 0, W, H);
      drift(p, T.parch, {});
      p.strokeStyle = 'rgba(120,90,50,0.13)';
      p.lineWidth = 0.6;
      for (let x = 0; x <= W; x += 39) { p.beginPath(); p.moveTo(x, 0); p.lineTo(x, H); p.stroke(); }
      for (let y = 0; y <= H; y += 40) { p.beginPath(); p.moveTo(0, y); p.lineTo(W, y); p.stroke(); }
      contours(p, { color: '#8a6a3e', width: 0.6, alpha: 0.28, seed: 31, hills: [[300, 200, 6], [70, 470, 7]] });
      // compass rose
      p.save();
      p.translate(310, 560);
      p.strokeStyle = 'rgba(110,80,40,0.45)';
      p.fillStyle = 'rgba(110,80,40,0.3)';
      p.beginPath(); p.arc(0, 0, 30, 0, Math.PI * 2); p.stroke();
      for (let i = 0; i < 8; i++) {
        const long = i % 2 === 0 ? 40 : 22;
        p.rotate(Math.PI / 4);
        p.beginPath(); p.moveTo(0, -long); p.lineTo(5, 0); p.lineTo(-5, 0); p.closePath(); p.fill();
      }
      p.restore();
      p.fillStyle = 'rgba(110,80,40,0.55)';
      p.font = 'italic 600 11px Georgia, serif';
      p.fillText('N', 306, 512);
      // burnt edges
      const v = p.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
      v.addColorStop(0, 'rgba(90,60,25,0)');
      v.addColorStop(1, 'rgba(90,60,25,0.35)');
      p.fillStyle = v;
      p.fillRect(0, 0, W, H);
      grain(p, 2200, 'rgba(255,250,235,0.3)', 'rgba(90,60,25,0.1)', 5);
    },
  },
  stars: {
    name: 'Starry void',
    rim: [150, 190, 255],
    what: 'The unexplored map is night sky: slow nebula clouds and twinkling stars. Mystery, not weather.',
    animated: true,
    paint(p, t) {
      T.neb ||= tile(512, 18, 80, 200, [[120, 60, 200, 0.28], [40, 90, 200, 0.2], [200, 80, 170, 0.12]], 41);
      T.starList ||= (() => { const r = rng(53); return Array.from({ length: 170 }, () => [r() * W, r() * H, 0.5 + r() * 1.2, r() * 6, 0.4 + r() * 1.6]); })();
      p.fillStyle = '#0d0722';
      p.fillRect(0, 0, W, H);
      drift(p, T.neb, { ox: t * 3, oy: t * 1.5, rot: t * 0.3 });
      T.starList.forEach(([x, y, s, ph, sp]) => {
        p.globalAlpha = 0.25 + 0.75 * Math.abs(Math.sin(t * sp + ph));
        p.fillStyle = '#fff';
        p.fillRect(x, y, s, s);
      });
      p.globalAlpha = 1;
    },
  },
};
