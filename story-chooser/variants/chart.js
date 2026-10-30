// Variant 12 · Story chart / Venn. Not a quiz: every story is already plotted, you look, then pick.
// Contract: ../../../docs/story-chooser.md. Imports nothing; everything comes through ctx.
const NS = 'http://www.w3.org/2000/svg';
const MODE_COLOUR = { walk: '#f2c230', pin: '#2f8bff', hunt: '#b36bff' };
const SET_COLOUR = { S: '#b36bff', U: '#009eff', K: '#3ddc84' };
// Short labels for the chart. Anything not listed falls back to the first 2–3 words of the name.
const SHORT = {
  alice: 'Alice', barista: 'Barista Tips', murder: 'River Valley Murder', jubilee: 'Garden Jubilee',
  netaverse: 'The Netaverse', coronet: 'Coronet Caper', woglins: 'Woglins & Wozzips', frightnight: 'Frightnight',
  squeaky: 'Squeaky', loveyeg: 'Love Edmonton', parable: 'Calgary Parable', incident: 'The Incident',
  knight: "Knight's Quest", heartbreak: 'Heartbreak Speedrun',
};
const X_WORDS = ['deep in cosy', 'on the cosy side', 'halfway between cosy and creepy', 'just left of creepy', 'right in creepy'];
const Y_WORDS = ['right down at silly', 'a little above silly', 'halfway up to serious', 'well above silly', 'right up at serious'];
const RANK = ['closest', 'second closest', 'third closest'];

const CSS = `
.v-chart .sub { margin: -4px 0 14px; font-size: 17px; }
.v-chart .seg { display: flex; background: var(--raised); border: 1px solid var(--line); border-radius: 14px; padding: 3px; margin: 0 0 12px; }
.v-chart .seg button { flex: 1; min-height: 42px; border: 0; background: transparent; border-radius: 11px; font-weight: 800; font-size: 17px; color: var(--muted); }
.v-chart .seg button[aria-pressed="true"] { background: var(--raised-2); color: #fff; }
.v-chart svg { display: block; width: 100%; height: auto; font-family: "Darker Grotesque", -apple-system, system-ui, sans-serif; font-weight: 700; touch-action: manipulation; user-select: none; -webkit-user-select: none; border-radius: 14px; }
.v-chart .plot { fill: rgba(255, 255, 255, 0.025); }
.v-chart .grid { stroke: rgba(255, 255, 255, 0.07); stroke-width: 1; }
.v-chart .grid.mid { stroke: rgba(255, 255, 255, 0.18); stroke-dasharray: 3 3; }
.v-chart .quad { fill: rgba(255, 255, 255, 0.42); font-size: 12.5px; font-weight: 800; pointer-events: none; }
.v-chart .axis { fill: var(--muted); font-size: 12.5px; font-weight: 800; pointer-events: none; }
.v-chart .dot { cursor: pointer; }
.v-chart .dot .hit { fill: transparent; }
.v-chart .dot .body { stroke: rgba(0, 0, 0, 0.35); stroke-width: 1; transition: opacity 0.25s; }
.v-chart .dot.dim .body { opacity: 0.16; }
.v-chart .dot.hot .body, .v-chart .dot.sel .body { stroke: #fff; stroke-width: 2.5; }
.v-chart .lbl { fill: #fff; font-size: 12.5px; font-weight: 700; paint-order: stroke; stroke: var(--bg); stroke-width: 3px; stroke-linejoin: round; pointer-events: none; }
.v-chart .lbl.sel { font-weight: 900; fill: #fff; }
.v-chart .lbl.off { visibility: hidden; }
.v-chart .lead { stroke: rgba(255, 255, 255, 0.45); stroke-width: 1; }
.v-chart .me .ring { fill: var(--accent); opacity: 0.25; transform-box: fill-box; transform-origin: center; animation: v-chart-pulse 1.6s ease-out infinite; }
.v-chart .me .core { fill: #fff; stroke: var(--accent); stroke-width: 3; }
.v-chart .me .guide { stroke: var(--accent); stroke-width: 1; stroke-dasharray: 3 4; opacity: 0.6; }
@keyframes v-chart-pulse { 0% { transform: scale(0.6); opacity: 0.45; } 100% { transform: scale(1.6); opacity: 0; } }
.v-chart .legend { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; font-size: 14px; color: var(--muted); margin: 8px 2px 4px; }
.v-chart .legend i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; vertical-align: -1px; }
.v-chart .hint { font-size: 14px; margin: 6px 2px 0; }
.v-chart .panel { margin-top: 10px; }
.v-chart .card { background: var(--raised); border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px 16px; }
.v-chart .card .eyebrow { font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 800; color: var(--muted); margin-bottom: 4px; }
.v-chart .card .eyebrow i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }
.v-chart .card h3 { margin: 0 0 4px; font-size: 24px; line-height: 1.02; font-weight: 900; text-wrap: balance; }
.v-chart .card p { margin: 0 0 6px; font-size: 17px; line-height: 1.25; }
.v-chart .card .meta { font-size: 15px; margin-bottom: 12px; }
.v-chart .near { background: var(--raised); border: 1px solid var(--line); border-radius: 16px; padding: 6px 16px 10px; }
.v-chart .near .title { font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 800; color: var(--muted); margin: 8px 0 2px; }
.v-chart .near .echo { font-size: 16px; margin: 0 0 4px; }
.v-chart .near .row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid var(--line); }
.v-chart .near .row .t { min-width: 0; flex: 1; }
.v-chart .near .row b { display: block; font-size: 18px; font-weight: 800; line-height: 1.1; }
.v-chart .near .row span { display: block; color: var(--muted); font-size: 14px; }
.v-chart .near .row .btn { min-height: 40px; padding: 0 14px; font-size: 16px; flex: none; }
.v-chart .near .clear { background: none; border: 0; color: var(--muted); font-size: 14px; padding: 6px 0 0; text-decoration: underline; }
.v-chart .set-title { font-size: 13px; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; pointer-events: none; }
.v-chart .name { cursor: pointer; }
.v-chart .name rect { fill: transparent; }
.v-chart .name text { fill: #fff; font-size: 12.5px; font-weight: 700; }
.v-chart .name.sel text { font-weight: 900; fill: #fff; text-decoration: underline; }
.v-chart .nobody { fill: rgba(255, 255, 255, 0.35); font-size: 12.5px; font-style: italic; pointer-events: none; }
.v-chart .leader { stroke: rgba(255, 255, 255, 0.35); stroke-width: 1; stroke-dasharray: 2 3; fill: none; }
.v-chart .leader-dot { fill: rgba(255, 255, 255, 0.5); }
.v-chart .none { margin: 10px 0 0; background: var(--raised); border: 1px solid var(--line); border-radius: 14px; padding: 10px 12px 6px; }
.v-chart .none .title { font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 800; color: var(--muted); margin: 0 0 8px; }
.v-chart .chips { display: flex; flex-wrap: wrap; gap: 8px; }
.v-chart .chip { background: var(--raised-2); border: 1px solid var(--line); border-radius: 999px; padding: 6px 12px; font-size: 15px; font-weight: 700; min-height: 36px; margin-bottom: 4px; }
.v-chart .chip.sel { border-color: var(--accent); }
`;

/* ---------- tiny helpers ---------- */
function sv(tag, attrs = {}, ...kids) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(String(k)));
  return n;
}
const shortName = (s) => {
  if (SHORT[s.id]) return SHORT[s.id];
  if (s.name.length <= 18) return s.name;
  const w = s.name.replace(/[,:]/g, '').split(' ');
  const three = w.slice(0, 3).join(' ');
  return three.length <= 18 ? three : w.slice(0, 2).join(' ');
};
const hits = (a, b, pad = 1) => a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;
const within = (r, box) => r.x >= box.x && r.y >= box.y && r.x + r.w <= box.x + box.w && r.y + r.h <= box.y + box.h;
const side = (v, lo, hi) => (v >= 5 ? hi : lo);
const quadrant = (s) => `${side(s.vibe.creepy, 'cosy', 'creepy')} & ${side(s.vibe.serious, 'silly', 'serious')}`;
const quadWhy = (s) => `You went straight for the ${side(s.vibe.creepy, 'cosy', 'creepy')}-and-${side(s.vibe.serious, 'silly', 'serious')} corner.`;
const bucket = (v) => Math.max(0, Math.min(4, Math.floor(v / 2)));
const textW = (t) => { try { return t.getComputedTextLength() || 0; } catch (e) { return 0; } };
const isSpooky = (s) => s.tags.includes('eerie') || s.tags.includes('spooky');
const isShort = (s) => s.minutes <= 45;
const isKids = (s) => s.tags.includes('kids');
const regionKey = (s) => `${isSpooky(s) ? 1 : 0}${isShort(s) ? 1 : 0}${isKids(s) ? 1 : 0}`;
function regionWhy(s) {
  const parts = [isSpooky(s) ? 'spooky' : 'not spooky', isShort(s) ? 'under 45 minutes' : 'over 45 minutes', isKids(s) ? 'good with kids' : 'not for kids'];
  const line = parts.join(', ');
  return line.charAt(0).toUpperCase() + line.slice(1) + '. Correct.';
}
function regionName(s) {
  const on = [isSpooky(s) && 'Spooky', isShort(s) && 'Under 45 min', isKids(s) && 'Good with kids'].filter(Boolean);
  return on.length ? on.join(' + ') : 'None of the above';
}

export default {
  slug: 'chart',
  title: 'Where are you tonight?',
  short: 'Story chart / Venn',
  channel: 'app',
  blurb: 'Stories plotted cozy-to-creepy and silly-to-serious. Look, then pick.',

  mount(ctx) {
    ctx.style(CSS);
    const { el, root, stories } = ctx;
    const byId = Object.fromEntries(stories.map((s) => [s.id, s]));
    let view = 'chart';

    const body = el('div', { class: 'view' });
    const panel = el('div', { class: 'panel', 'aria-live': 'polite' });
    const seg = el('div', { class: 'seg', role: 'tablist', 'aria-label': 'Chart or Venn' },
      ['chart', 'venn'].map((v) => el('button', { type: 'button', role: 'tab', 'aria-pressed': String(v === view), dataset: { v }, text: v === 'chart' ? 'Chart' : 'Venn', onClick: () => show(v) })));
    root.append(el('div', { class: 'v-chart' },
      el('h2', { class: 'q', text: 'Where are you tonight?' }),
      el('p', { class: 'muted sub', text: 'Every story, plotted. Tap one, or tap where you are.' }),
      seg, body, panel));

    function show(v) {
      view = v;
      for (const b of seg.children) b.setAttribute('aria-pressed', String(b.dataset.v === v));
      body.innerHTML = ''; panel.innerHTML = '';
      if (v === 'chart') renderChart(); else renderVenn();
    }

    /* ---------- the card under the chart ---------- */
    function card(story, why, eyebrow) {
      panel.innerHTML = '';
      const c = el('div', { class: 'card' },
        el('div', { class: 'eyebrow' }, el('i', { style: { background: MODE_COLOUR[story.mode] } }), eyebrow),
        el('h3', { text: story.name }),
        el('p', { text: story.blurb }),
        el('div', { class: 'meta muted', text: `${story.minutes} min · ${story.where} · ${story.mode}` }),
        el('button', { class: 'btn primary block', text: 'Pick this one', onClick: () => ctx.finish({ story, why }) }));
      panel.append(c);
      requestAnimationFrame(() => { try { c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* older browsers */ } });
    }

    /* ======================= view 1: the chart ======================= */
    function renderChart() {
      const W = 360, H = 360, PL = 26, PT = 6, PR = 354, PB = 334, PAD = 30;
      const span = PR - PL - 2 * PAD;
      const xOf = (c) => PL + PAD + (c / 10) * span;
      const yOf = (s) => PB - PAD - (s / 10) * span;
      const plotBox = { x: PL + 1, y: PT + 1, w: PR - PL - 2, h: PB - PT - 2 };

      const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Every story plotted from cosy to creepy and silly to serious' });
      svg.append(sv('rect', { class: 'plot', x: PL, y: PT, width: PR - PL, height: PB - PT, rx: 12 }));
      for (let i = 0; i <= 10; i += 2) {
        const gx = PL + ((PR - PL) * i) / 10, gy = PT + ((PB - PT) * i) / 10;
        svg.append(sv('line', { class: 'grid', x1: gx, y1: PT, x2: gx, y2: PB }), sv('line', { class: 'grid', x1: PL, y1: gy, x2: PR, y2: gy }));
      }
      const mx = (PL + PR) / 2, my = (PT + PB) / 2;
      svg.append(sv('line', { class: 'grid mid', x1: mx, y1: PT, x2: mx, y2: PB }), sv('line', { class: 'grid mid', x1: PL, y1: my, x2: PR, y2: my }));
      // quadrant labels
      const quads = [
        sv('text', { class: 'quad', x: PL + 9, y: PT + 17, text: 'cosy & serious' }),
        sv('text', { class: 'quad', x: PR - 9, y: PT + 17, 'text-anchor': 'end', text: 'creepy & serious' }),
        sv('text', { class: 'quad', x: PL + 9, y: PB - 8, text: 'cosy & silly' }),
        sv('text', { class: 'quad', x: PR - 9, y: PB - 8, 'text-anchor': 'end', text: 'creepy & silly' }),
      ];
      svg.append(...quads);
      // axis words
      svg.append(
        sv('text', { class: 'axis', x: PL, y: H - 7, text: '← cosy' }),
        sv('text', { class: 'axis', x: PR, y: H - 7, 'text-anchor': 'end', text: 'creepy →' }),
        sv('text', { class: 'axis', x: 15, y: PB, transform: `rotate(-90 15 ${PB})`, text: '← silly' }),
        sv('text', { class: 'axis', x: 15, y: PT, transform: `rotate(-90 15 ${PT})`, 'text-anchor': 'end', text: 'serious →' }),
      );

      // dots: nudge exact duplicates apart so both stay tappable
      const dots = stories.map((s) => ({ s, cx: xOf(s.vibe.creepy), cy: yOf(s.vibe.serious), r: 5 + ((Math.max(40, Math.min(100, s.pop)) - 40) / 60) * 6 }));
      const groups = {};
      for (const d of dots) (groups[`${d.s.vibe.creepy},${d.s.vibe.serious}`] ||= []).push(d);
      for (const g of Object.values(groups)) if (g.length > 1) g.forEach((d, i) => { const a = Math.PI * (0.75 + (2 * i) / g.length); d.cx += Math.cos(a) * 8; d.cy += Math.sin(a) * 8; });
      const dotRect = (d) => ({ x: d.cx - d.r - 1, y: d.cy - d.r - 1, w: 2 * d.r + 2, h: 2 * d.r + 2 });
      const dotLayer = sv('g', { class: 'dots' });
      const lblLayer = sv('g', { class: 'lbls' });
      const meLayer = sv('g', { class: 'me' });
      for (const d of dots.slice().sort((a, b) => b.r - a.r)) {
        d.g = sv('g', { class: 'dot', 'data-id': d.s.id, role: 'button', tabindex: 0, 'aria-label': `${d.s.name}, ${quadrant(d.s)}` },
          sv('circle', { class: 'hit', cx: d.cx, cy: d.cy, r: Math.max(d.r + 6, 14) }),
          sv('circle', { class: 'body', cx: d.cx, cy: d.cy, r: d.r, fill: MODE_COLOUR[d.s.mode] || '#fff' }));
        d.lbl = sv('text', { class: 'lbl off', 'data-for': d.s.id, text: shortName(d.s) });
        dotLayer.append(d.g); lblLayer.append(d.lbl);
      }
      svg.append(dotLayer, meLayer, lblLayer);

      // label layout: try spots around the dot, keep the first that is clear; otherwise hide until tapped
      const candidates = (d, w) => {
        const h = 14, g = 4, { cx, cy, r } = d;
        const right = (dy) => ({ x: cx + r + g, y: cy + dy - h / 2, w, h, anchor: 'start', lead: Math.abs(dy) > 9 });
        const left = (dy) => ({ x: cx - r - g - w, y: cy + dy - h / 2, w, h, anchor: 'end', lead: Math.abs(dy) > 9 });
        const above = (dx) => ({ x: cx + dx - w / 2, y: cy - r - g - h, w, h, anchor: 'middle', lead: Math.abs(dx) > 22 });
        const below = (dx) => ({ x: cx + dx - w / 2, y: cy + r + g, w, h, anchor: 'middle', lead: Math.abs(dx) > 22 });
        return [right(0), left(0), above(0), below(0), right(-9), right(9), left(-9), left(9), above(-22), above(22), below(-22), below(22), right(-18), right(18), left(-18), left(18), above(-40), above(40), below(-40), below(40), right(-27), right(27), left(-27), left(27), right(-40), right(40), left(-40), left(40)];
      };
      const placeText = (t, rc) => {
        const tx = rc.anchor === 'start' ? rc.x : rc.anchor === 'end' ? rc.x + rc.w : rc.x + rc.w / 2;
        t.setAttribute('x', tx); t.setAttribute('y', rc.y + 10.8); t.setAttribute('text-anchor', rc.anchor); t.classList.remove('off');
      };
      let placed = [];
      const leadLayer = sv('g', { class: 'leads' });
      svg.insertBefore(leadLayer, lblLayer);
      // no room beside the dot: search outward in rings for a clear spot, and draw a thin lead back to the dot
      const ringSpot = (d, w, obstacles, maxR = 54) => {
        const h = 14;
        for (let rad = d.r + 12; rad <= maxR; rad += 6) {
          for (let a = 0; a < 360; a += 20) {
            const t = (a * Math.PI) / 180, px = d.cx + Math.cos(t) * rad, py = d.cy + Math.sin(t) * rad;
            const rc = { x: px - w / 2, y: py - h / 2, w, h, anchor: 'middle', lead: true };
            if (within(rc, plotBox) && !obstacles.some((o) => hits(rc, o, 2))) return rc;
          }
        }
        return null;
      };
      const drawLead = (d, rc) => {
        const ax = Math.max(rc.x, Math.min(rc.x + rc.w, d.cx)), ay = Math.max(rc.y, Math.min(rc.y + rc.h, d.cy));
        const ang = Math.atan2(ay - d.cy, ax - d.cx);
        leadLayer.append(sv('line', { class: 'lead', 'data-for': d.s.id, x1: d.cx + Math.cos(ang) * (d.r + 1), y1: d.cy + Math.sin(ang) * (d.r + 1), x2: ax, y2: ay }));
      };
      function layout(onlyIds) {
        const quadRects = quads.map((q) => { const b = q.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
        const taken = [...dots.filter((d) => !onlyIds || onlyIds.includes(d.s.id)).map(dotRect), ...quadRects]; // dimmed dots don't block
        placed = []; leadLayer.innerHTML = '';
        for (const d of dots) d.lbl.classList.add('off');
        const order = dots.filter((d) => !onlyIds || onlyIds.includes(d.s.id)).sort((a, b) => b.s.pop - a.s.pop);
        const pending = [];
        for (const d of order) {
          const w = textW(d.lbl) + 2;
          const spot = candidates(d, w).find((rc) => within(rc, plotBox) && !taken.some((o) => hits(rc, o)) && !placed.some((o) => hits(rc, o, 2)));
          if (spot) { placeText(d.lbl, spot); placed.push({ ...spot, id: d.s.id }); if (spot.lead) drawLead(d, spot); } else pending.push({ d, w });
        }
        for (const { d, w } of pending) {
          const spot = ringSpot(d, w, [...taken, ...placed]);
          if (spot) { placeText(d.lbl, spot); placed.push({ ...spot, id: d.s.id }); drawLead(d, spot); }
        }
      }
      // show one label no matter what (for a tapped dot), and hush neighbours it would cover
      function forceLabel(d) {
        const w = textW(d.lbl) + 2;
        const dotsOnly = dots.filter((o) => o !== d).map(dotRect);
        let spot = candidates(d, w).find((rc) => within(rc, plotBox) && !dotsOnly.some((o) => hits(rc, o)));
        const lead = !spot || spot.lead;
        spot = spot || ringSpot(d, w, dotsOnly, 90) || candidates(d, w).find((rc) => within(rc, plotBox)) || candidates(d, w)[0];
        placeText(d.lbl, spot);
        for (const p of placed) if (p.id !== d.s.id && hits(spot, p, 2)) { dots.find((o) => o.s.id === p.id).lbl.classList.add('off'); leadLayer.querySelectorAll(`[data-for="${p.id}"]`).forEach((l) => l.remove()); }
        leadLayer.querySelectorAll(`[data-for="${d.s.id}"]`).forEach((l) => l.remove());
        if (lead) drawLead(d, spot);
        lblLayer.append(d.lbl);
      }

      // state
      let selected = null, marker = null;
      const clearState = () => {
        selected = null; marker = null; meLayer.innerHTML = ''; panel.innerHTML = '';
        for (const d of dots) { d.g.classList.remove('dim', 'hot', 'sel'); d.lbl.classList.remove('sel'); }
        hint.textContent = HINT;
        layout();
      };
      function select(story) {
        const d = dots.find((x) => x.s === story);
        clearState();
        selected = story;
        d.g.classList.add('sel'); d.lbl.classList.add('sel');
        forceLabel(d);
        card(story, quadWhy(story), `${quadrant(story)} · ${story.mode}`);
      }
      function dropMarker(px, py) {
        clearState();
        const x = Math.max(PL + PAD, Math.min(PR - PAD, px)), y = Math.max(PT + PAD, Math.min(PB - PAD, py));
        const vx = ((x - PL - PAD) / span) * 10, vy = ((PB - PAD - y) / span) * 10;
        marker = { vx, vy };
        const near = dots.map((d) => ({ d, dist: Math.hypot(d.s.vibe.creepy - vx, d.s.vibe.serious - vy) })).sort((a, b) => a.dist - b.dist || b.d.s.pop - a.d.s.pop).slice(0, 3);
        const ids = near.map((n) => n.d.s.id);
        for (const d of dots) d.g.classList.toggle('dim', !ids.includes(d.s.id)), d.g.classList.toggle('hot', ids.includes(d.s.id));
        meLayer.append(
          sv('line', { class: 'guide', x1: x, y1: y, x2: x, y2: PB }), sv('line', { class: 'guide', x1: PL, y1: y, x2: x, y2: y }),
          sv('circle', { class: 'ring', cx: x, cy: y, r: 16 }), sv('circle', { class: 'core', cx: x, cy: y, r: 6 }));
        layout(ids);
        const where = `${X_WORDS[bucket(vx)]} and ${Y_WORDS[bucket(vy)]}`;
        hint.textContent = `You're ${where}.`;
        panel.innerHTML = '';
        const box = el('div', { class: 'near' },
          el('div', { class: 'title', text: 'Closest to you' }),
          el('p', { class: 'echo', text: `You're ${where}. These three are nearest.` }),
          near.map((n, i) => {
            const s = n.d.s;
            const why = `You put yourself ${where}, and this was the ${RANK[i]} story.`;
            return el('div', { class: 'row' },
              el('div', { class: 't' }, el('b', { text: s.name }), el('span', { text: `${s.minutes} min · ${s.where} · ${s.mode}` })),
              el('button', { class: 'btn ghost', text: 'Pick', 'aria-label': `Pick ${s.name}`, onClick: () => ctx.finish({ story: s, why }) }));
          }),
          el('button', { class: 'clear', type: 'button', text: 'Clear and start over', onClick: clearState }));
        panel.append(box);
        requestAnimationFrame(() => { try { box.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* fine */ } });
      }

      const toSvg = (e) => { const r = svg.getBoundingClientRect(); return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height }; };
      svg.addEventListener('click', (e) => {
        const g = e.target.closest && e.target.closest('.dot');
        if (g) { select(byId[g.getAttribute('data-id')]); return; }
        const p = toSvg(e);
        if (p.x >= PL && p.x <= PR && p.y >= PT && p.y <= PB) dropMarker(p.x, p.y);
      });
      svg.addEventListener('keydown', (e) => {
        const g = e.target.closest && e.target.closest('.dot');
        if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(byId[g.getAttribute('data-id')]); }
      });

      const HINT = 'Bigger dot = played more. Tap an empty spot to drop yourself on the map.';
      const hint = el('p', { class: 'hint muted', text: HINT });
      body.append(svg,
        el('div', { class: 'legend' },
          el('span', {}, el('i', { style: { background: MODE_COLOUR.walk } }), 'Walk'),
          el('span', {}, el('i', { style: { background: MODE_COLOUR.pin } }), 'Pin'),
          el('span', {}, el('i', { style: { background: MODE_COLOUR.hunt } }), 'Hunt')),
        hint);
      layout();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (svg.isConnected && !selected && !marker) layout(); });
      body.__layout = layout; // for the QA rig
    }

    /* ======================= view 2: the Venn ======================= */
    function renderVenn() {
      const W = 360, H = 436;
      const C = { S: { cx: 120, cy: 172, r: 108 }, U: { cx: 240, cy: 172, r: 108 }, K: { cx: 152, cy: 302, r: 108 } };
      const keys = ['S', 'U', 'K'];
      const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Three overlapping circles: Spooky, Under 45 minutes, Good with kids' });
      for (const k of keys) svg.append(sv('circle', { cx: C[k].cx, cy: C[k].cy, r: C[k].r, fill: SET_COLOUR[k], 'fill-opacity': 0.13, stroke: SET_COLOUR[k], 'stroke-opacity': 0.75, 'stroke-width': 1.5 }));
      const titles = [
        sv('text', { class: 'set-title', x: 8, y: C.S.cy - C.S.r - 6, fill: SET_COLOUR.S, text: 'Spooky' }),
        sv('text', { class: 'set-title', x: W - 8, y: C.U.cy - C.U.r - 6, 'text-anchor': 'end', fill: SET_COLOUR.U, text: 'Under 45 min' }),
        sv('text', { class: 'set-title', x: C.K.cx, y: C.K.cy + C.K.r + 17, 'text-anchor': 'middle', fill: SET_COLOUR.K, text: 'Good with kids' }),
      ];
      svg.append(...titles);
      const nameLayer = sv('g');
      const leadLayer = sv('g');
      svg.append(leadLayer, nameLayer);

      // region maths
      const inRegion = (x, y, key, m = 0) => keys.every((k, i) => {
        const d = Math.hypot(x - C[k].cx, y - C[k].cy);
        return key[i] === '1' ? d < C[k].r - m : d > C[k].r + m;
      });
      const bounds = { x: 3, y: 3, w: W - 6, h: H - 6 };
      const rectOk = (rc, key, m) => {
        if (!within(rc, bounds)) return false;
        const xs = [rc.x, rc.x + rc.w / 2, rc.x + rc.w], ys = [rc.y, rc.y + rc.h / 2, rc.y + rc.h];
        for (const x of xs) for (const y of ys) if (!inRegion(x, y, key, m)) return false;
        return true;
      };
      const samples = {};
      for (let y = 6; y < H; y += 6) for (let x = 6; x < W; x += 6) {
        const key = keys.map((k) => (Math.hypot(x - C[k].cx, y - C[k].cy) < C[k].r ? '1' : '0')).join('');
        (samples[key] ||= []).push([x, y]);
      }
      const centroid = (key) => { const p = samples[key] || []; return p.length ? { x: p.reduce((a, q) => a + q[0], 0) / p.length, y: p.reduce((a, q) => a + q[1], 0) / p.length } : null; };
      const bbox = (key) => { const p = samples[key] || []; return { x0: Math.min(...p.map((q) => q[0])), x1: Math.max(...p.map((q) => q[0])), y0: Math.min(...p.map((q) => q[1])), y1: Math.max(...p.map((q) => q[1])) }; };
      const taken = [];
      // find the best column (one line per item) inside `key`, nearest to `goal`
      function placeColumn(items, key, goal, LH, m) {
        if (!samples[key]) return null;
        const b = bbox(key); let best = null;
        const total = items.length * LH;
        for (let y0 = Math.max(bounds.y, b.y0 - 6); y0 <= b.y1 - total + 6; y0 += 3) {
          for (let cx = b.x0 - 6; cx <= b.x1 + 6; cx += 3) {
            const d = Math.hypot(cx - goal.x, y0 + total / 2 - goal.y);
            if (best && d >= best.d) continue;
            let ok = true;
            for (let i = 0; i < items.length && ok; i++) {
              const rc = { x: cx - items[i].w / 2 - 3, y: y0 + i * LH, w: items[i].w + 6, h: LH };
              ok = rectOk(rc, key, m) && !taken.some((t) => hits(rc, t, 2));
            }
            if (ok) best = { cx, y0, d };
          }
        }
        return best;
      }

      // group stories by region, build name elements first so we can measure them
      const groups = {};
      for (const s of stories) (groups[regionKey(s)] ||= []).push(s);
      const nameEls = {};
      for (const s of stories) {
        const t = sv('text', { text: shortName(s), 'text-anchor': 'middle' });
        const g = sv('g', { class: 'name', 'data-id': s.id, role: 'button', tabindex: 0, 'aria-label': `${s.name}: ${regionName(s)}` }, sv('rect'), t);
        nameEls[s.id] = { g, t };
        if (regionKey(s) !== '000') nameLayer.append(g);
      }
      const LH = 16;
      function layout() {
        taken.length = 0;
        for (const t of titles) { const b = t.getBBox(); taken.push({ x: b.x, y: b.y, w: b.width, h: b.height }); }
        leadLayer.innerHTML = '';
        const widest = (list) => list.map((s) => ({ s, w: textW(nameEls[s.id].t) }));
        const put = (items, col) => items.forEach((it, i) => {
          const { g, t } = nameEls[it.s.id];
          const y = col.y0 + i * LH;
          t.setAttribute('x', col.cx); t.setAttribute('y', y + 12);
          const r = g.firstChild; r.setAttribute('x', col.cx - it.w / 2 - 6); r.setAttribute('y', y - 1); r.setAttribute('width', it.w + 12); r.setAttribute('height', LH + 2);
          taken.push({ x: col.cx - it.w / 2 - 3, y, w: it.w + 6, h: LH });
        });
        const regionKeys = ['100', '010', '001', '110', '101', '011', '111'];
        const callouts = [];
        for (const key of regionKeys) {
          const list = (groups[key] || []).slice().sort((a, b) => b.pop - a.pop);
          const goal = centroid(key);
          if (!goal) continue;
          if (!list.length) {
            const n = sv('text', { class: 'nobody', 'text-anchor': 'middle', text: 'nobody' });
            leadLayer.append(n);
            const w = textW(n) || 40;
            const col = placeColumn([{ w }], key, goal, 14, 1);
            if (col) { n.setAttribute('x', col.cx); n.setAttribute('y', col.y0 + 11); } else n.remove();
            continue;
          }
          const items = widest(list);
          const col = placeColumn(items, key, goal, LH, 2);
          if (col) put(items, col); else callouts.push({ key, items, goal });
        }
        // crowded regions: the names sit in free space next to the diagram, with a dotted lead back to the region
        for (const c of callouts) {
          const col = placeColumn(c.items, '000', c.goal, LH, 3);
          if (!col) { // last resort: stack under the diagram (should not happen with this story set)
            const y0 = H - c.items.length * LH - 4; put(c.items, { cx: W / 2, y0 }); continue;
          }
          put(c.items, col);
          const maxW = Math.max(...c.items.map((i) => i.w));
          const colRect = { x: col.cx - maxW / 2, y: col.y0, w: maxW, h: c.items.length * LH };
          const ax = Math.max(colRect.x, Math.min(colRect.x + colRect.w, c.goal.x)), ay = Math.max(colRect.y, Math.min(colRect.y + colRect.h, c.goal.y));
          leadLayer.append(sv('line', { class: 'leader', x1: c.goal.x, y1: c.goal.y, x2: ax, y2: ay }), sv('circle', { class: 'leader-dot', cx: c.goal.x, cy: c.goal.y, r: 3 }));
        }
      }

      // none-of-the-above strip
      const none = (groups['000'] || []).slice().sort((a, b) => b.pop - a.pop);
      const chips = none.map((s) => el('button', { class: 'chip', type: 'button', 'data-id': s.id, text: shortName(s), onClick: () => select(s) }));
      const strip = el('div', { class: 'none' }, el('div', { class: 'title', text: 'None of the above' }), el('div', { class: 'chips' }, chips));

      function select(story) {
        for (const { g } of Object.values(nameEls)) g.classList.remove('sel');
        for (const c of chips) c.classList.toggle('sel', c.getAttribute('data-id') === story.id);
        if (nameEls[story.id]) nameEls[story.id].g.classList.add('sel');
        card(story, regionWhy(story), `${regionName(story)} · ${story.mode}`);
      }
      svg.addEventListener('click', (e) => { const g = e.target.closest && e.target.closest('.name'); if (g) select(byId[g.getAttribute('data-id')]); });
      svg.addEventListener('keydown', (e) => { const g = e.target.closest && e.target.closest('.name'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(byId[g.getAttribute('data-id')]); } });

      body.append(svg, strip, el('p', { class: 'hint muted', text: 'Tap a name to read about it.' }));
      layout();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (svg.isConnected) layout(); });
      body.__layout = layout;
    }

    show('chart');
  },
};
