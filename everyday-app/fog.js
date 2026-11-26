// Fog on the home map, from the fog-mode experiment (apps/fog-mode): the same six looks
// (fog-looks.js, real Edmonton contours in terrain.js), painted on a canvas between the
// map and its pins. Walked streets and the home bubble are cut out of it.
import { LOOKS } from './fog-looks.js';
import { W, H, HOME } from './maps.js';

const RES = 2;
const LAYER_H = 640;   // the looks paint a 390 × 640 sheet; the home map uses the top 390 × 520
let raf = 0;

function clearAt(m, x, y, r) {
  const g = m.createRadialGradient(x, y, r * 0.45, x, y, r);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  m.fillStyle = g;
  m.beginPath(); m.arc(x, y, r, 0, Math.PI * 2); m.fill();
}
function clearPath(m, pts, r) {
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 4));
    for (let k = 0; k <= n; k++) clearAt(m, ax + (bx - ax) * k / n, ay + (by - ay) * k / n, r);
  }
}

export function mountFog(canvas, { look = 'clouds', paths = [], home = true, r = 26 } = {}) {
  cancelAnimationFrame(raf);
  const L = LOOKS[look] || LOOKS.clouds;
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(box.width * dpr); canvas.height = Math.round(box.height * dpr);
  const s = Math.max(box.width / W, box.height / H) * dpr;   // same as the SVG's xMidYMid slice
  const ox = (canvas.width - W * s) / 2, oy = (canvas.height - H * s) / 2;
  const ctx = canvas.getContext('2d');

  const mask = document.createElement('canvas');
  mask.width = W * RES; mask.height = H * RES;
  const m = mask.getContext('2d');
  m.scale(RES, RES);
  paths.forEach((p) => clearPath(m, p, r));
  if (home) clearAt(m, HOME.x, HOME.y, 46);

  // the cleared edge takes the look's rim colour (cloud tops, star glow)
  let rim = null;
  if (L.rim) {
    rim = document.createElement('canvas'); rim.width = mask.width; rim.height = mask.height;
    const rc = rim.getContext('2d'); rc.drawImage(mask, 0, 0);
    rc.globalCompositeOperation = 'source-in'; rc.fillStyle = `rgb(${L.rim.join()})`; rc.fillRect(0, 0, rim.width, rim.height);
  }

  const layer = document.createElement('canvas');
  const lres = L.animated ? 1 : RES;
  layer.width = W * lres; layer.height = LAYER_H * lres;
  const lc = layer.getContext('2d');
  const still = !L.animated || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0 = performance.now();
  let last = 0;
  const draw = (now) => {
    if (!canvas.isConnected) return;
    if (!still) raf = requestAnimationFrame(draw);
    if (now - last < 33) return;   // about 30 frames a second is plenty for drifting fog
    last = now;
    lc.setTransform(lres, 0, 0, lres, 0, 0); lc.clearRect(0, 0, W, LAYER_H);
    L.paint(lc, still ? 12 : (now - t0) / 1000);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(s / lres, 0, 0, s / lres, ox, oy); ctx.drawImage(layer, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.setTransform(s / RES, 0, 0, s / RES, ox, oy); ctx.drawImage(mask, 0, 0);
    if (rim) { ctx.globalCompositeOperation = 'source-atop'; ctx.globalAlpha = 0.9; ctx.drawImage(rim, 0, 0); ctx.globalAlpha = 1; }
    ctx.globalCompositeOperation = 'source-over';
  };
  draw(performance.now() + 100);
}

export const FOG_LOOKS = Object.entries(LOOKS).map(([k, v]) => ({ k, name: v.name, what: v.what }));
