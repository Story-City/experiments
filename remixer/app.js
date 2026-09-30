// The Remixer: crisp-E's image remix tool (Operation: COPY//WRITE, Loc 3i).
const ART = { file:'art/maynard.jpg' };
const $ = s => document.querySelector(s);
const stage = $('#stage'), ctx = stage.getContext('2d', { willReadFrequently:true });
let W = 0, H = 0, orig = null, hist = [], future = [], used = new Set(), busy = false, mode = null, instant = false;
let layer = null, layerBase = null, monaImg = null, lastTool = null, lastBase = null;

/* ---------- step navigation ---------- */
const STEPS = ['s-intro','s-remix','s-saved'];
const TITLES = { 's-intro':'Loc 3i', 's-remix':'Remixer', 's-saved':'Loc 3j' };
function go(id){
  STEPS.forEach(s => { $('#'+s).hidden = s !== id; });
  const n = STEPS.indexOf(id);
  document.querySelectorAll('.steps i').forEach((el,i) => el.classList.toggle('on', i <= n));
  $('#appTitle').textContent = TITLES[id];
  $('#screen').scrollTop = 0;
}

/* ---------- helpers ---------- */
function blank(){ const c = document.createElement('canvas'); c.width = W; c.height = H; return c; }
function snap(){ const c = blank(); c.getContext('2d').drawImage(stage, 0, 0); c.adj = { ...adj }; return c; }
function put(c){ ctx.clearRect(0,0,W,H); ctx.drawImage(c, 0, 0); if (c.adj && (c.adj.recolour !== adj.recolour || c.adj.contrast !== adj.contrast)) setAdj(c.adj); }
function push(){ hist.push(snap()); if (hist.length > 15) hist.shift(); future = []; lastTool = null; }
const rnd = (a,b) => a + Math.random()*(b-a);
const ease = t => 1 - Math.pow(1-t, 3);
function animate(ms, frame){
  return new Promise(res => {
    if (instant || matchMedia('(prefers-reduced-motion: reduce)').matches){ frame(1); return res(); }
    const t0 = performance.now();
    const tick = now => { const t = Math.min(1, (now-t0)/ms); frame(t); t < 1 ? requestAnimationFrame(tick) : res(); };
    requestAnimationFrame(tick);
  });
}
let toastT;
function toast(msg, center = false, hold = 1800){
  const t = $('#toast'); t.textContent = msg; t.classList.toggle('center', !!center); t.classList.toggle('sm', center === 'small');
  t.classList.toggle('slow', center === 'small' || center === 'scrawl');
  t.classList.toggle('scrawl', center === 'scrawl');
  void t.offsetWidth; t.classList.remove('off'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('off'), hold);
}

function markUsed(tool){
  used.add(tool);
  document.querySelector(`.tool[data-tool="${tool}"]`).classList.add('used');
  sync();
}
// Goal: use at least one tool from each of the three sections. Save stays locked until then.
const SECTIONS = { yours:['me','recolour','contrast'], rebuild:['dots','pixel','shapes','glass'], wreck:['glitch','shuffle','marble','smudge'] };
function sync(){
  const done = Object.keys(SECTIONS).map(k => SECTIONS[k].some(t => used.has(t)));
  const left = done.map((d,i) => d ? null : i+1).filter(Boolean);
  document.querySelectorAll('#pips i').forEach((p,i) => p.classList.toggle('on', done[i]));
  document.querySelectorAll('.modtabs button').forEach((b,i) => b.classList.toggle('done', done[i]));
  $('#goalTxt').innerHTML = !left.length ? '<b>Remixed!</b> Keep going or save it.'
    : left.length === 3 ? 'Use <b>1 tool from each section</b> to remix it'
    : `Nice. Still to go: section <b>${left.join('</b> and <b>')}</b>`;
  $('#doSave').disabled = left.length > 0;
  // A tool you just used shows a small re-roll symbol: tapping it again gives a different version.
  document.querySelectorAll('.tile').forEach(b => b.classList.toggle('can-again', !!lastTool && (b.dataset.tool || b.id) === lastTool));
  $('#undo').disabled = hist.length === 0;
  $('#redo').disabled = future.length === 0;
  $('#restart').disabled = hist.length === 0;
  document.querySelectorAll('.tool').forEach(b => { if (!used.has(b.dataset.tool)) b.classList.remove('used'); });
}

/* ---------- colour matrix (from experiment) ---------- */
function recolourCanvas(src){
  const out = blank(), o = out.getContext('2d'); o.drawImage(src,0,0);
  const d = o.getImageData(0,0,W,H), p = d.data;
  const h = rnd(50,310)*Math.PI/180, c = Math.cos(h), s = Math.sin(h), v = rnd(1.1,1.6), k = rnd(1.0,1.2);
  const hue = [.213+c*.787-s*.213,.715-c*.715-s*.715,.072-c*.072+s*.928,.213-c*.213+s*.143,.715+c*.285+s*.140,.072-c*.072-s*.283,.213-c*.213-s*.787,.715-c*.715+s*.715,.072+c*.928+s*.072];
  const sat = [.213+.787*v,.715-.715*v,.072-.072*v,.213-.213*v,.715+.285*v,.072-.072*v,.213-.213*v,.715-.715*v,.072+.928*v];
  const m = []; for (let i=0;i<3;i++) for (let j=0;j<3;j++) m[i*3+j] = (sat[i*3]*hue[j]+sat[i*3+1]*hue[3+j]+sat[i*3+2]*hue[6+j])*k;
  const off = 128*(1-k);
  for (let i=0;i<p.length;i+=4){ const r=p[i],g=p[i+1],b=p[i+2];
    p[i]=m[0]*r+m[1]*g+m[2]*b+off; p[i+1]=m[3]*r+m[4]*g+m[5]*b+off; p[i+2]=m[6]*r+m[7]*g+m[8]*b+off; }
  o.putImageData(d,0,0); return out;
}

/* ---------- tap tools ---------- */
const TOOLS = {
  async recolour(before){
    const after = recolourCanvas(before);
    await animate(650, t => {
      const x = W*ease(t); put(before);
      ctx.save(); ctx.beginPath(); ctx.rect(0,0,x,H); ctx.clip(); ctx.drawImage(after,0,0); ctx.restore();
      if (t < 1){ ctx.fillStyle = 'rgba(124,240,196,.85)'; ctx.fillRect(x-2,0,3,H); }
    });
  },
  async shuffle(before, count = 7){
    const n = 8, cw = W/n, ch = H/n, moves = [];
    for (let k=0;k<count;k++){
      const w = Math.ceil(rnd(1,3))*cw, h = Math.ceil(rnd(1,3))*ch;
      const sx = Math.floor(rnd(0,n))*cw, sy = Math.floor(rnd(0,n))*ch, dx = Math.floor(rnd(0,n))*cw, dy = Math.floor(rnd(0,n))*ch;
      moves.push({sx,sy,dx,dy,w,h,delay:k*.06});
    }
    await animate(700, t => {
      put(before);
      moves.forEach(m => { const u = ease(Math.max(0, Math.min(1,(t-m.delay)/(1-.42))));
        const x = m.sx+(m.dx-m.sx)*u, y = m.sy+(m.dy-m.sy)*u;
        if (t<1){ ctx.shadowColor='rgba(0,0,0,.55)'; ctx.shadowBlur=18*(1-u)+2; }
        ctx.drawImage(before, m.sx,m.sy,m.w,m.h, x,y,m.w,m.h); ctx.shadowBlur=0; ctx.shadowColor='transparent'; });
    });
  },
  async glitch(before){
    const bands = Array.from({length:14}, () => ({ y:rnd(0,H), h:rnd(4,H/9), dx:rnd(-.1,.1)*W }));
    const split = Math.round(rnd(3,5));
    // Colour split only inside the glitched strips, and half-strength, so the painting keeps its own colours.
    const finalFrame = () => {
      put(before);
      bands.forEach(b => ctx.drawImage(before, 0,b.y,W,b.h, b.dx,b.y,W,b.h));
      const d = ctx.getImageData(0,0,W,H), p = d.data, src = new Uint8ClampedArray(p);
      bands.forEach(b => {
        for (let y=Math.max(0,b.y|0); y<Math.min(H,(b.y+b.h)|0); y++) for (let x=0;x<W;x++){
          const i=(y*W+x)*4, j=(y*W+Math.min(W-1,x+split))*4, k=(y*W+Math.max(0,x-split))*4;
          p[i] = (src[i]+src[j])/2; p[i+2] = (src[i+2]+src[k+2])/2;
        }
      });
      ctx.putImageData(d,0,0);
    };
    let last = -1;
    await animate(600, t => {
      const f = Math.floor(t*9); if (f === last && t<1) return; last = f;
      if (t >= 1) return finalFrame();
      put(before);
      for (let k=0;k<8;k++){ const y=rnd(0,H), h=rnd(3,H/12); ctx.drawImage(before,0,y,W,h,rnd(-.15,.15)*W*t*1.5,y,W,h); }
    });
  },
  async dots(before){
    const step = Math.max(6, Math.round(W/rnd(48,80))), cols = Math.ceil(W/step), rows = Math.ceil(H/step);
    const sm = document.createElement('canvas'); sm.width = cols; sm.height = rows;
    const sc = sm.getContext('2d'); sc.drawImage(before,0,0,cols,rows);
    const px = sc.getImageData(0,0,cols,rows).data;
    await animate(650, t => {
      t = ease(t); put(before);
      ctx.fillStyle = `rgba(16,12,32,${.92*t})`; ctx.fillRect(0,0,W,H);
      for (let y=0;y<rows;y++) for (let x=0;x<cols;x++){
        const i=(y*cols+x)*4, r=px[i],g=px[i+1],b=px[i+2], lum=(.3*r+.59*g+.11*b)/255;
        const rad = step*.5*(.3+.75*lum)*t; if (rad<.3) continue;
        ctx.fillStyle = `rgb(${Math.min(255,r*1.15)},${Math.min(255,g*1.15)},${Math.min(255,b*1.15)})`;
        ctx.beginPath(); ctx.arc(x*step+step/2, y*step+step/2, rad, 0, 6.2832); ctx.fill();
      }
    });
  },
};
Object.assign(TOOLS, {
  async pixel(before){
    const target = Math.round(W/rnd(26,48)), sm = document.createElement('canvas'), sc = sm.getContext('2d');
    await animate(600, t => {
      const cols = Math.max(target, Math.round(W/(1+(W/target-1)*ease(t))));
      sm.width = cols; sm.height = Math.max(1, Math.round(cols*H/W));
      sc.imageSmoothingQuality = 'high'; sc.drawImage(before,0,0,sm.width,sm.height);
      ctx.imageSmoothingEnabled = false; ctx.clearRect(0,0,W,H); ctx.drawImage(sm,0,0,W,H); ctx.imageSmoothingEnabled = true;
    });
  },
  // Brett's "Shapes" effect from the Remix a Masterpiece experiment: flat-colour Voronoi cells.
  async shapes(before){
    const sz = Math.max(6, Math.round(rnd(15,60)*W/1000)), salt = (Math.random()*1e6)|0;
    const hash = n => { let x = Math.imul((n+salt) ^ 0x9e3779b9, 0x85ebca6b); x ^= x>>>13; x = Math.imul(x, 0xc2b2ae35); x ^= x>>>16; return (x>>>0)/4294967296; };
    const gw = Math.ceil(W/sz), gh = Math.ceil(H/sz), count = gw*gh, seeds = new Float32Array(count*2);
    for (let g=0;g<count;g++){ seeds[g*2] = ((g%gw)+.1+.8*hash(g*2))*sz; seeds[g*2+1] = (((g/gw)|0)+.1+.8*hash(g*2+1))*sz; }
    const src = before.getContext('2d').getImageData(0,0,W,H), d = src.data, labels = new Int32Array(W*H), sum = new Float32Array(count*4);
    for (let y=0;y<H;y++){ const cy = (y/sz)|0;
      for (let x=0;x<W;x++){ const cx = (x/sz)|0; let best = 0, bd = Infinity;
        for (let j=Math.max(0,cy-1);j<=Math.min(gh-1,cy+1);j++) for (let i=Math.max(0,cx-1);i<=Math.min(gw-1,cx+1);i++){
          const g = j*gw+i, dx = seeds[g*2]-x, dy = seeds[g*2+1]-y, dd = dx*dx+dy*dy; if (dd<bd){ bd=dd; best=g; } }
        const p = y*W+x, n = p*4, g4 = best*4; labels[p] = best; sum[g4]+=d[n]; sum[g4+1]+=d[n+1]; sum[g4+2]+=d[n+2]; sum[g4+3]++; } }
    for (let p=0;p<labels.length;p++){ const g = labels[p]*4, n = p*4, c = sum[g+3]; d[n]=sum[g]/c; d[n+1]=sum[g+1]/c; d[n+2]=sum[g+2]/c; }
    const after = blank(); after.getContext('2d').putImageData(src,0,0);
    await animate(650, t => { put(before); ctx.globalAlpha = ease(t); ctx.drawImage(after,0,0); ctx.globalAlpha = 1; });
  },
  // Stained glass (the original look). Each tap changes the piece size and how rich the colours are.
  async glass(before){
    const w = Math.round(W/2), h = Math.round(H/2), gx = 9 + (Math.random()*14|0), cs = w/gx, gy = Math.ceil(h/cs), pop = rnd(1.3,1.8);
    const seeds = [];
    for (let j=0;j<gy;j++) for (let i=0;i<gx;i++) seeds.push({ x:(i+rnd(.1,.9))*cs, y:(j+rnd(.1,.9))*cs, r:0,g:0,b:0,n:0 });
    const sm = document.createElement('canvas'); sm.width = w; sm.height = h; const sc = sm.getContext('2d');
    sc.drawImage(before,0,0,w,h); const src = sc.getImageData(0,0,w,h), sp = src.data;
    const lab = new Int32Array(w*h);
    for (let y=0;y<h;y++) for (let x=0;x<w;x++){
      const ci = Math.floor(x/cs), cj = Math.floor(y/cs); let best = 1e9, bi = 0;
      for (let dj=-2;dj<=2;dj++) for (let di=-2;di<=2;di++){ const ii=ci+di, jj=cj+dj; if (ii<0||jj<0||ii>=gx||jj>=gy) continue;
        const k = jj*gx+ii, s = seeds[k], d = (s.x-x)**2+(s.y-y)**2; if (d<best){ best=d; bi=k; } }
      lab[y*w+x] = bi; const s = seeds[bi], o = (y*w+x)*4; s.r+=sp[o]; s.g+=sp[o+1]; s.b+=sp[o+2]; s.n++;
    }
    const out = sc.createImageData(w,h), op = out.data;
    for (let y=0;y<h;y++) for (let x=0;x<w;x++){
      const k = y*w+x, l = lab[k], o = k*4;
      const edge = (x>0&&lab[k-1]!==l)||(x<w-1&&lab[k+1]!==l)||(y>0&&lab[k-w]!==l)||(y<h-1&&lab[k+w]!==l);
      if (edge){ op[o]=22; op[o+1]=18; op[o+2]=28; op[o+3]=255; continue; }
      const s = seeds[l], n = s.n||1, avg = (s.r+s.g+s.b)/(3*n), glow = 1.18-.35*Math.hypot(s.x-x, s.y-y)/cs;
      op[o] = (avg+(s.r/n-avg)*pop)*glow; op[o+1] = (avg+(s.g/n-avg)*pop)*glow; op[o+2] = (avg+(s.b/n-avg)*pop)*glow; op[o+3] = 255;
    }
    sc.putImageData(out,0,0);
    await animate(700, t => { put(before); ctx.globalAlpha = ease(t); ctx.drawImage(sm,0,0,W,H); ctx.globalAlpha = 1; });
  },
});

/* ---------- contrast + saturation: one tap picks a punchy look ---------- */
const LOOKS = [
  { name:'Vivid', sat:1.9,  con:1.3,  lift:0 },
  { name:'Pop',   sat:2.6,  con:1.15, lift:0 },
  { name:'Crisp', sat:1.25, con:1.2,  lift:6 },
  { name:'Moody', sat:.7,   con:1.45, lift:-18 },
  { name:'Faded', sat:.55,  con:.72,  lift:28 },
  { name:'Bleach',sat:.35,  con:1.25, lift:22 },
  { name:'Noir',  sat:0,    con:1.6,  lift:0 },
  { name:'Sepia', sat:0,    con:1.1,  lift:6,  tint:[1.12,.97,.76] },
  { name:'Cyano', sat:0,    con:1.25, lift:0,  tint:[.68,.9,1.28] },
];
TOOLS.contrast = async function(before){
  const look = LOOKS[Math.random()*LOOKS.length|0];
  const out = blank(), o = out.getContext('2d'); o.drawImage(before,0,0);
  const d = o.getImageData(0,0,W,H); xform(d.data, 'contrast', look); o.putImageData(d,0,0);
  await animate(600, t => {
    const y = H*ease(t); put(before);
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,W,y); ctx.clip(); ctx.drawImage(out,0,0); ctx.restore();
    if (t < 1){ ctx.fillStyle = 'rgba(111,168,255,.85)'; ctx.fillRect(0,y-2,W,3); }
  });
};
async function runTool(name){
  if (busy) return;
  setMode(null); cancelLayer();
  busy = true; $('#tools').classList.add('busy');
  // Tapping the same tool again swaps in a new version instead of stacking on top.
  let before;
  if (name === lastTool && lastBase){ before = lastBase; future = []; }
  else { push(); before = snap(); lastTool = name; lastBase = before; }
  await TOOLS[name](before);
  busy = false; $('#tools').classList.remove('busy');
  markUsed(name);
}

/* ---------- load the node, with crisp-E's head start ---------- */
(function init(){
  const img = new Image();
  img.onload = async () => {
    W = stage.width = img.naturalWidth; H = stage.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    clean = snap();
    $('#startImg').src = stage.toDataURL('image/jpeg', .9);
    // crisp-E's head start: just a light touch — a few thin glitch lines and a hint of colour split.
    const base = snap();
    for (let k=0;k<5;k++){ const y = rnd(.1,.9)*H, h = rnd(2,7); ctx.drawImage(base, 0,y,W,h, rnd(-.03,.03)*W,y,W,h); }
    const d = ctx.getImageData(0,0,W,H), px = d.data, src = new Uint8ClampedArray(px), sp = 2;
    for (let y=0;y<H;y++) for (let x=0;x<W;x++){ const i = (y*W+x)*4; px[i] = src[(y*W+Math.min(W-1,x+sp))*4]; }
    ctx.putImageData(d,0,0);
    orig = snap();
    put(clean);
    sync();
    setTimeout(() => { thumbsReady = makeThumbs(); }, 50);
  };
  img.src = ART.file;
})();
// Opening the tool: the untouched painting shows for a second, then crisp-E's glitch flickers in.
let clean = null, started = false, thumbsReady = Promise.resolve();
$('#toRemix').onclick = async () => {
  go('s-remix');
  if (started) return;
  started = true; busy = true; $('#tools').classList.add('busy');
  await Promise.all([thumbsReady, new Promise(r => setTimeout(r, 1000))]);
  put(clean);
  let last = -1;
  await animate(700, t => {
    const f = Math.floor(t*10); if (f === last && t < 1) return; last = f;
    if (t >= 1) return put(orig);
    put(f % 2 ? orig : clean);
    for (let k=0;k<3;k++){ const y = rnd(0,H), h = rnd(2,10); ctx.drawImage(clean,0,y,W,h,rnd(-.06,.06)*W,y,W,h); }
  });
  busy = false; $('#tools').classList.remove('busy');
};

/* ---------- re-roll badges on tools that give a new version each tap ---------- */
['dots','pixel','shapes','glass','glitch','shuffle','surprise'].forEach(k => {
  const t = k === 'surprise' ? $('#surprise') : document.querySelector(`.tile[data-tool="${k}"]`);
  t.querySelector('.thumb').insertAdjacentHTML('beforeend', '<span class="again" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg></span>');
});

/* ---------- tool-set tabs ---------- */
document.querySelectorAll('.modtabs button').forEach(t => t.onclick = () => {
  document.querySelectorAll('.modtabs button').forEach(b => b.setAttribute('aria-selected', b === t));
  document.querySelectorAll('.mod').forEach(m => m.hidden = m.dataset.mod !== t.dataset.mod);
});



/* ---------- Colour & Contrast pickers: a grid of named options with previews ---------- */
const PRESETS = {
  recolour: [ {name:'Ember',h:20,s:1.35},  {name:'Gold',h:50,s:1.35},   {name:'Lime',h:90,s:1.3},
              {name:'Jade',h:130,s:1.3},   {name:'Lagoon',h:165,s:1.3}, {name:'Ocean',h:200,s:1.35},
              {name:'Violet',h:245,s:1.3}, {name:'Magenta',h:285,s:1.4}, {name:'Rose',h:320,s:1.35} ],
  contrast: LOOKS,
};
/* Colour and Contrast are settings, not layers: the painting keeps at most one of each,
   applied as a live colour matrix on top. Picking a new one replaces the old one. */
let adj = { recolour:null, contrast:null };
function colourMat(pr){
  const h = pr.h*Math.PI/180, c = Math.cos(h), s = Math.sin(h), v = pr.s, k = 1.08;
  const hue = [.213+c*.787-s*.213,.715-c*.715-s*.715,.072-c*.072+s*.928,.213-c*.213+s*.143,.715+c*.285+s*.140,.072-c*.072-s*.283,.213-c*.213-s*.787,.715-c*.715+s*.715,.072+c*.928+s*.072];
  const sat = [.213+.787*v,.715-.715*v,.072-.072*v,.213-.213*v,.715+.285*v,.072-.072*v,.213-.213*v,.715-.715*v,.072+.928*v];
  const A = []; for (let i=0;i<3;i++) for (let j=0;j<3;j++) A[i*3+j] = (sat[i*3]*hue[j]+sat[i*3+1]*hue[3+j]+sat[i*3+2]*hue[6+j])*k;
  const o = 128*(1-k); return { A, o:[o,o,o] };
}
function contrastMat(pr){
  const v = pr.sat, k = pr.con, L = [.2126,.7152,.0722], t = pr.tint || [1,1,1], A = [], o = [];
  for (let i=0;i<3;i++){ for (let j=0;j<3;j++) A[i*3+j] = t[i]*k*((i===j?v:0)+(1-v)*L[j]); o[i] = t[i]*(128*(1-k)+pr.lift); }
  return { A, o };
}
function combine(a, b){ // b after a
  const A = [], o = [];
  for (let i=0;i<3;i++){ for (let j=0;j<3;j++) A[i*3+j] = b.A[i*3]*a.A[j]+b.A[i*3+1]*a.A[3+j]+b.A[i*3+2]*a.A[6+j];
    o[i] = b.A[i*3]*a.o[0]+b.A[i*3+1]*a.o[1]+b.A[i*3+2]*a.o[2]+b.o[i]; }
  return { A, o };
}
function adjMat(state){
  let M = { A:[1,0,0,0,1,0,0,0,1], o:[0,0,0] };
  if (state.recolour != null) M = combine(M, colourMat(PRESETS.recolour[state.recolour]));
  if (state.contrast != null) M = combine(M, contrastMat(PRESETS.contrast[state.contrast]));
  return M;
}
function applyMat(p, M){
  const A = M.A, o = M.o;
  for (let i=0;i<p.length;i+=4){ const r=p[i],g=p[i+1],b=p[i+2];
    p[i]=A[0]*r+A[1]*g+A[2]*b+o[0]; p[i+1]=A[3]*r+A[4]*g+A[5]*b+o[1]; p[i+2]=A[6]*r+A[7]*g+A[8]*b+o[2]; }
}
function xform(p, tool, pr){ applyMat(p, tool === 'contrast' ? contrastMat(pr) : colourMat(pr)); }
function setAdj(next){
  adj = { recolour:next.recolour ?? null, contrast:next.contrast ?? null };
  const on = adj.recolour != null || adj.contrast != null;
  if (on){ const M = adjMat(adj), A = M.A, o = M.o.map(x => x/255);
    $('#adjM').setAttribute('values', `${A[0]} ${A[1]} ${A[2]} 0 ${o[0]} ${A[3]} ${A[4]} ${A[5]} 0 ${o[1]} ${A[6]} ${A[7]} ${A[8]} 0 ${o[2]} 0 0 0 1 0`); }
  stage.style.filter = on ? 'url(#adjF)' : '';
}
// The finished picture: painting + current Colour/Contrast baked in.
function baked(state = adj){
  const c = snap(), cx = c.getContext('2d');
  if (state.recolour != null || state.contrast != null){ const d = cx.getImageData(0,0,W,H); applyMat(d.data, adjMat(state)); cx.putImageData(d,0,0); }
  return c;
}

function openPicker(t){
  cancelLayer(); setMode(t);
  $('#pickTray').setAttribute('aria-label', t === 'recolour' ? 'Colour options' : 'Contrast options');
  const side = Math.min(W,H), sm = document.createElement('canvas'); sm.width = sm.height = 150;
  const sc = sm.getContext('2d', { willReadFrequently:true });
  sc.drawImage(stage, (W-side)/2, (H-side)/2, side, side, 0, 0, 150, 150);
  const src = sc.getImageData(0,0,150,150);
  const grid = $('#pickGrid'); grid.innerHTML = '';
  PRESETS[t].forEach((pr, i) => {
    const d = new ImageData(new Uint8ClampedArray(src.data), 150, 150);
    applyMat(d.data, adjMat({ ...adj, [t]:i })); sc.putImageData(d,0,0);
    const b = document.createElement('button'); b.className = 'opt';
    b.setAttribute('aria-pressed', adj[t] === i);
    b.innerHTML = `<img alt="" src="${sm.toDataURL('image/jpeg', .85)}"><span>${pr.name}</span>`;
    b.onclick = e => { e.stopPropagation(); if (busy) return; setMode(null); choosePreset(t, i); };
    grid.appendChild(b);
  });
}
async function choosePreset(t, i){
  if (busy || adj[t] === i) return;
  busy = true; $('#tools').classList.add('busy');
  push();
  const next = { ...adj, [t]:i }, out = baked(next);
  // Wipe the new look across, then hand over to the live filter.
  // Colour travels the long side of the painting, so it gets more time to feel the same pace as Contrast.
  await bleed(out, t === 'recolour' ? 'across' : 'down', t === 'recolour' ? 1400 : 900);
  setAdj(next); $('#wipe').hidden = true;
  busy = false; $('#tools').classList.remove('busy');
  markUsed(t);
}

/* ---------- bleed: new colour soaks across the painting like ink on wet paper ---------- */
function noiseField(w, h){
  const f = new Float32Array(w*h);
  for (const [cells, amp] of [[5,.55],[11,.3],[23,.15]]){
    const gw = cells+1, gh = Math.ceil(cells*h/w)+1, g = Float32Array.from({length:gw*gh}, Math.random);
    for (let y=0;y<h;y++) for (let x=0;x<w;x++){
      const fx = x/w*cells, fy = y/h*(gh-1), ix = fx|0, iy = fy|0, tx = fx-ix, ty = fy-iy;
      const a = g[iy*gw+ix], b = g[iy*gw+ix+1], c = g[(iy+1)*gw+ix], d = g[(iy+1)*gw+ix+1];
      const sx = tx*tx*(3-2*tx), sy = ty*ty*(3-2*ty);
      f[y*w+x] += amp*((a+(b-a)*sx)+((c+(d-c)*sx)-(a+(b-a)*sx))*sy);
    }
  }
  return f;
}
async function bleed(out, dir, ms){
  const wipe = $('#wipe'), wx = wipe.getContext('2d');
  wipe.width = W; wipe.height = H; wipe.hidden = false;
  const mw = 120, mh = Math.round(120*H/W), n = dir === 'across' ? noiseField(mh, mw).map((_,i,a) => a[(i%mw)*mh + (i/mw|0)]) : noiseField(mw, mh);
  const mask = document.createElement('canvas'); mask.width = mw; mask.height = mh;
  const mc = mask.getContext('2d'), md = mc.createImageData(mw, mh), edge = .16;
  const v = new Float32Array(mw*mh);
  // The side-to-side bleed crosses the painting's short edge, so it needs more wobble to look as ragged as the top-down one.
  const rough = dir === 'across' ? .52 : .38;
  for (let y=0;y<mh;y++) for (let x=0;x<mw;x++){
    const g = dir === 'across' ? x/mw : dir === 'down' ? y/mh : (x/mw + y/mh)/2;
    v[y*mw+x] = (1-rough)*g + rough*n[y*mw+x];
  }
  await animate(ms, t => {
    const T = ease(t)*(1+edge*2) - edge;
    for (let i=0;i<v.length;i++){ const a = Math.max(0, Math.min(1, (T - v[i] + edge)/edge)); md.data[i*4+3] = a*255; }
    mc.putImageData(md, 0, 0);
    wx.globalCompositeOperation = 'copy'; wx.drawImage(out, 0, 0);
    wx.globalCompositeOperation = 'destination-in'; wx.imageSmoothingQuality = 'high'; wx.drawImage(mask, 0, 0, W, H);
    wx.globalCompositeOperation = 'source-over';
  });
}

function cancelPicker(){ if (!busy) setMode(null); }
// Tapping anywhere that isn't an option cancels.
$('#pickTray').onclick = e => { if (!e.target.closest('.opt')) cancelPicker(); };

/* ---------- compare tab names (notes panel) ---------- */
document.querySelectorAll('.namepick button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.namepick button').forEach(x => x.setAttribute('aria-pressed', x === b));
  const names = b.dataset.names.split('|');
  document.querySelectorAll('.modtabs .tn').forEach((t,i) => t.textContent = names[i]);
  go('s-remix');
});
/* ---------- preview thumbnails: each tile shows its effect on this painting ---------- */
async function makeThumbs(){
  const keep = snap(), side = Math.min(W,H), sx = (W-side)/2, sy = (H-side)/2;
  const shot = () => { const c = document.createElement('canvas'); c.width = c.height = 180; c.getContext('2d').drawImage(stage, sx, sy, side, side, 0, 0, 180, 180); return c.toDataURL('image/jpeg', .82); };
  const set = (k, url) => { const img = document.querySelector(`img[data-thumb="${k}"]`); if (img) img.src = url; };
  const path = t => ({ x: W*(.15+.7*t), y: H*(.5+.22*Math.sin(t*Math.PI*2.2)) });
  instant = true;
  put(orig); const base = shot(); set('me', base);
  for (const k of ['recolour','contrast','dots','pixel','shapes','glass','glitch','shuffle']){
    put(orig); await TOOLS[k](orig); set(k, shot()); await new Promise(r => setTimeout(r));
  }
  put(orig); ctx.drawImage(baked({ recolour:7, contrast:1 }),0,0); set('surprise', shot());
  put(orig); for (let i=0;i<3;i++){ let p = path(0); for (let t=.02;t<=1;t+=.02){ const q = path(t); q.y += (i-1)*H*.18; if (t===.02) p = {x:path(0).x,y:path(0).y+(i-1)*H*.18}; smear(p,q); p = q; } } set('smudge', shot());
  put(orig); for (let i=0;i<2;i++){ stroke = { last:{ x:path(0).x, y:path(0).y+(i-.5)*H*.3 } }; for (let t=.02;t<=1;t+=.02){ const q = path(t); q.y += (i-.5)*H*.3; marbleTo(q); } } stroke = null; set('marble', shot());
  instant = false; put(keep);
}


/* ---------- smudge (drag) ---------- */
let stroke = null;
function toCanvas(e){ const r = stage.getBoundingClientRect(); return { x:(e.clientX-r.left)*W/r.width, y:(e.clientY-r.top)*H/r.height }; }
function smear(from, to){
  const R = W*.06, dist = Math.hypot(to.x-from.x, to.y-from.y), steps = Math.max(1, Math.ceil(dist/(R*.25)));
  for (let s=1;s<=steps;s++){
    const x0 = from.x+(to.x-from.x)*(s-1)/steps, y0 = from.y+(to.y-from.y)*(s-1)/steps;
    const x1 = from.x+(to.x-from.x)*s/steps, y1 = from.y+(to.y-from.y)*s/steps;
    ctx.save(); ctx.beginPath(); ctx.arc(x1,y1,R,0,6.2832); ctx.clip(); ctx.globalAlpha = .55;
    ctx.translate(x1,y1); ctx.rotate(.18); ctx.translate(-x1,-y1);
    ctx.drawImage(stage, x0-R, y0-R, R*2, R*2, x1-R, y1-R, R*2, R*2); ctx.restore();
  }
}
function marbleDab(cx, cy, mx, my){
  const d = Math.round(W*.09), R = Math.round(d*1.5), lam = d/4, size = R*2;
  const x0 = Math.round(cx-R), y0 = Math.round(cy-R);
  const img = ctx.getImageData(x0, y0, size, size), px = img.data, src = new Uint8ClampedArray(px);
  const k = 1.1, c = lam/(R+lam);
  for (let j=0;j<size;j++) for (let i=0;i<size;i++){
    const dist = Math.hypot(i+.5-R, j+.5-R); if (dist >= R) continue;
    const n = (j*size+i)*4; if (src[n+3] === 0) continue;
    const w = k*(lam/(dist+lam)-c)/(1-c);
    const sx = Math.min(size-1.001, Math.max(0, i-mx*w)), sy = Math.min(size-1.001, Math.max(0, j-my*w));
    const ix = sx|0, iy = sy|0, fx = sx-ix, fy = sy-iy;
    const a = (iy*size+ix)*4, bb = a+4, cc = a+size*4, dd = cc+4;
    if (src[a+3] === 0 || src[dd+3] === 0) continue;
    for (let ch=0;ch<3;ch++){ const top = src[a+ch]+(src[bb+ch]-src[a+ch])*fx, bot = src[cc+ch]+(src[dd+ch]-src[cc+ch])*fx; px[n+ch] = top+(bot-top)*fy; }
  }
  ctx.putImageData(img, x0, y0);
}
function marbleTo(p){
  const last = stroke.last, step = Math.max(1, W*.009), dist = Math.hypot(p.x-last.x, p.y-last.y), n = Math.floor(dist/step);
  for (let s=1;s<=n;s++){ const t = s*step/dist; marbleDab(last.x+(p.x-last.x)*t, last.y+(p.y-last.y)*t, (p.x-last.x)/dist*step, (p.y-last.y)/dist*step); }
  if (n > 0){ const t = n*step/dist; stroke.last = { x:last.x+(p.x-last.x)*t, y:last.y+(p.y-last.y)*t }; }
}
stage.addEventListener('pointerdown', e => {
  if (mode === 'smudge' || mode === 'marble'){ stage.setPointerCapture(e.pointerId); stroke = { p:toCanvas(e), last:toCanvas(e), moved:0, pushed:false, tool:mode }; }
  else if (mode === 'me' && layer){ stage.setPointerCapture(e.pointerId); const p = toCanvas(e); stroke = { drag:true, ox:p.x-layer.x, oy:p.y-layer.y }; }
});
stage.addEventListener('pointermove', e => {
  if (!stroke) return; const p = toCanvas(e);
  if (stroke.drag){ layer.x = p.x-stroke.ox; layer.y = p.y-stroke.oy; drawLayer(); return; }
  if (!stroke.pushed){ push(); stroke.pushed = true; sync(); }
  if (stroke.tool === 'marble') marbleTo(p); else smear(stroke.p, p);
  stroke.moved += Math.hypot(p.x-stroke.p.x, p.y-stroke.p.y); stroke.p = p;
});
const endStroke = () => { if (stroke && !stroke.drag && stroke.moved > W*.15) markUsed(stroke.tool); stroke = null; };
stage.addEventListener('pointerup', endStroke); stage.addEventListener('pointercancel', endStroke);

function setMode(m){
  mode = m;
  document.querySelectorAll('.tool[aria-pressed]').forEach(b => b.setAttribute('aria-pressed', b.dataset.tool === m));
  stage.className = (m === 'smudge' || m === 'marble') ? 'swirl' : m === 'me' ? 'move' : '';
  $('#meTray').hidden = m !== 'me';
  $('#pickTray').hidden = !(m === 'recolour' || m === 'contrast');
}

/* ---------- add a pic (photo overlay) ---------- */
function circleCrop(img, sx, sy, side){
  const c = document.createElement('canvas'); c.width = c.height = 400; const m = c.getContext('2d');
  m.drawImage(img, sx, sy, side, side, 0, 0, 400, 400);
  m.globalCompositeOperation = 'destination-in';
  const g = m.createRadialGradient(200,200,150,200,200,200); g.addColorStop(0,'#000'); g.addColorStop(1,'rgba(0,0,0,0)');
  m.fillStyle = g; m.fillRect(0,0,400,400); return c;
}
function startLayer(crop){
  if (!layer) layerBase = snap();
  layer = { img:crop, x:W*.55, y:H*.62, size:+$('#meSize').value/100*W };
  $('#meSrc').hidden = true; $('#meAdjust').hidden = false;
  $('#meHint').textContent = 'Drag it where you want it.';
  drawLayer();
}
function drawLayer(ring = true){
  put(layerBase);
  const s = layer.size; ctx.drawImage(layer.img, layer.x-s/2, layer.y-s/2, s, s);
  if (ring){ ctx.strokeStyle = 'rgba(245,214,142,.9)'; ctx.setLineDash([8,6]); ctx.lineWidth = Math.max(2, W/300);
    ctx.beginPath(); ctx.arc(layer.x, layer.y, s/2+4, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]); }
}
function cancelLayer(){
  if (layer && layerBase) put(layerBase);
  layer = null; layerBase = null;
  $('#meSrc').hidden = false; $('#meAdjust').hidden = true; $('#meHint').textContent = 'Take a pic and slap it on the painting.';
}
$('#meSize').oninput = e => { if (layer){ layer.size = e.target.value/100*W; drawLayer(); } };
document.querySelectorAll('.meFile').forEach(inp => inp.onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const img = new Image(); img.onload = () => { const side = Math.min(img.width,img.height); startLayer(circleCrop(img,(img.width-side)/2,(img.height-side)/2,side)); URL.revokeObjectURL(img.src); };
  img.src = URL.createObjectURL(f); e.target.value = '';
});
$('#meSample').onclick = () => {
  const go2 = m => { const w = m.naturalWidth, h = m.naturalHeight, side = w*.34; startLayer(circleCrop(m, w*.5-side/2, h*.235-side/2, side)); };
  if (monaImg && monaImg.complete) return go2(monaImg);
  monaImg = new Image(); monaImg.onload = () => go2(monaImg); monaImg.src = 'art/mona-lisa.jpg';
};
$('#meCancel').onclick = () => { cancelLayer(); setMode(null); };
$('#meStamp').onclick = () => {
  drawLayer(false); const done = snap();
  put(layerBase); push(); put(done);
  layer = null; layerBase = null; cancelLayer(); setMode(null);
  markUsed('me'); toast('Stuck on. Looking good.');
};

/* ---------- tool buttons ---------- */
document.querySelectorAll('.tool').forEach(b => b.onclick = () => {
  const t = b.dataset.tool; if (!t) return;
  if (t === 'smudge' || t === 'marble'){ cancelLayer(); const on = mode !== t; setMode(on ? t : null); if (on) toast(t === 'marble' ? 'Drag to pull the paint into swirls' : 'Drag on the painting to smudge it'); return; }
  if (t === 'recolour' || t === 'contrast'){ if (mode === t) setMode(null); else openPicker(t); return; }
  if (t === 'me'){ if (mode === 'me'){ cancelLayer(); setMode(null); } else setMode('me'); return; }
  runTool(t);
});
$('#undo').onclick = () => { if (busy || !hist.length) return; cancelLayer(); if (mode === 'recolour' || mode === 'contrast') setMode(null); future.push(snap()); put(hist.pop()); lastTool = null; sync(); toast('Undone'); };
$('#redo').onclick = () => { if (busy || !future.length) return; cancelLayer(); if (mode === 'recolour' || mode === 'contrast') setMode(null); hist.push(snap()); put(future.pop()); lastTool = null; sync(); toast('Redone'); };
$('#restart').onclick = () => { if (busy) return; cancelLayer(); setMode(null); put(orig); hist = []; future = []; lastTool = null; used = new Set(); sync(); toast("Back to crisp-E's start"); };
// Surprise me only uses the tools on its own tab: it rolls a random Colour + Contrast together.
// Tapping again re-rolls; one Undo goes back to before the surprise.
$('#surprise').onclick = async () => {
  if (busy) return;
  setMode(null); cancelLayer();
  busy = true; $('#tools').classList.add('busy');
  if (lastTool !== 'surprise'){ push(); lastTool = 'surprise'; }
  else future = [];
  const roll = (k) => { let i; do { i = Math.random()*PRESETS[k].length|0; } while (i === adj[k]); return i; };
  const next = { recolour:roll('recolour'), contrast:roll('contrast') }, out = baked(next), wipe = $('#wipe');
  // The name fades in as the new look starts bleeding in, holds a moment, then fades out.
  toast(`${PRESETS.recolour[next.recolour].name} + ${PRESETS.contrast[next.contrast].name}`, 'small', 1700);
  await bleed(out, 'diag', 950);
  setAdj(next); wipe.hidden = true;
  busy = false; $('#tools').classList.remove('busy');
  markUsed('recolour'); markUsed('contrast');
};

/* ---------- save + crisp-E reacts ---------- */
$('#doSave').onclick = () => {
  cancelLayer(); setMode(null);
  $('#finalImg').src = baked().toDataURL('image/jpeg', .9);
  go('s-saved');
  const c = $('#reactChat'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
};
$('#backRemix').onclick = () => go('s-remix');
function flash(btn, msg){ const o = btn.textContent; btn.textContent = msg; setTimeout(() => btn.textContent = o, 1600); }
$('#shareBtn').onclick = e => flash(e.currentTarget, 'Share sheet opens here');
$('#continueBtn').onclick = e => flash(e.currentTarget, 'On to crisp-E\'s rant →');
