// Team vote on the fog looks. Each look gets a letter (A–F) and a small preview: the real fog look
// painted over the mockup's map, with one walk's trail cleared. Tap a favourite, thumbs-down any you'd
// never want. Votes save as you tap and everyone sees the live tally.
//
// Votes are saved by poll-store.js (the experiments hub's database). Opened outside the experiments
// site, the page still works but doesn't save.

const V = window.CACHE_V || '';
const { LOOKS } = await import(`./fog-looks.js${V}`);
const { VOTE } = await import(`./copy.js${V}`);
const { connect } = await import(`./poll-store.js${V}`);

const SLUG = 'poll:fog-looks';
const KEY = 'sc-fog-vote';
const W = 390;
const H = 640;
const CROP = { y: 60, h: 400 }; // the part of the map each preview shows
const LETTERS = 'ABCDEFGH';
const KEYS = Object.keys(LOOKS);
const letterOf = (k) => LETTERS[KEYS.indexOf(k)];

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) setText(n, text); return n; };
// Never one word alone on the last line: the last two words share a no-wrap span.
function setText(n, text) {
  const m = String(text).match(/^([\s\S]*?\S)\s+(\S+\s+\S+)$/);
  n.textContent = m ? m[1] + ' ' : String(text);
  if (m) { const s = document.createElement('span'); s.className = 'nw'; s.textContent = m[2]; n.append(s); }
  return n;
}

/* ---------- my vote (kept on this phone too) ---------- */
let mine = { name: '', pick: '', down: [], note: '' };
try { mine = { ...mine, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { /* private mode: start fresh */ }
const keepLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) { /* not saved on this phone, still sent */ } };

/* ---------- the map under the fog (same streets as the mockup) ---------- */
const XS = [0, 40, 120, 195, 280, 360, 390];
const YS = [0, 90, 160, 230, 300, 380, 470, 560, 640];
const TRAIL = [[195, 380], [195, 300], [120, 300], [120, 230], [120, 160], [195, 160], [195, 90], [280, 90]];
function drawMap(g) {
  g.fillStyle = '#170c35';
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < XS.length - 1; i++) {
    for (let j = 0; j < YS.length - 1; j++) {
      const park = (i === 4 && j === 1) || (i === 1 && j === 5);
      g.fillStyle = park ? '#1f3a3a' : '#241b46';
      const w = Math.max(0, XS[i + 1] - XS[i] - 16);
      const h = Math.max(0, YS[j + 1] - YS[j] - 16);
      g.beginPath();
      g.roundRect(XS[i] + 8, YS[j] + 8, w, h, 6);
      g.fill();
    }
  }
  g.strokeStyle = '#3a2f66';
  for (const x of XS.slice(1, -1)) { g.lineWidth = x === 195 ? 22 : 14; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (const y of YS.slice(1, -1)) { g.lineWidth = y === 300 ? 22 : 14; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.fillStyle = '#2d6b4a';
  for (const [x, y] of [[300, 110], [330, 130], [312, 145], [345, 112]]) { g.beginPath(); g.arc(x, y, 9, 0, Math.PI * 2); g.fill(); }
}
const mapLayer = document.createElement('canvas');
mapLayer.width = W; mapLayer.height = H;
drawMap(mapLayer.getContext('2d'));

// One walk's cleared trail: soft round blobs along the route, a wider clearing where you started.
const trail = document.createElement('canvas');
trail.width = W; trail.height = H;
(() => {
  const g = trail.getContext('2d');
  const blob = (x, y, r) => {
    const gr = g.createRadialGradient(x, y, r * 0.45, x, y, r);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  };
  blob(195, 380, 58);
  for (let i = 1; i < TRAIL.length; i++) {
    const [x0, y0] = TRAIL[i - 1]; const [x1, y1] = TRAIL[i];
    const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 6);
    for (let k = 0; k <= n; k++) blob(x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n, 30);
  }
})();

const fog = document.createElement('canvas');
fog.width = W; fog.height = H;
const fctx = fog.getContext('2d');
// Paint one preview: map, then the look's fog with the trail cut out, then one gem glowing through.
function paint(canvas, k, t) {
  fctx.globalCompositeOperation = 'source-over';
  fctx.clearRect(0, 0, W, H);
  LOOKS[k].paint(fctx, t);
  fctx.globalCompositeOperation = 'destination-out';
  fctx.drawImage(trail, 0, 0);
  fctx.globalCompositeOperation = 'source-over';
  const g = canvas.getContext('2d');
  const s = canvas.width / W;
  g.setTransform(s, 0, 0, s, 0, -CROP.y * s);
  g.drawImage(mapLayer, 0, 0);
  g.drawImage(fog, 0, 0);
  g.save();
  g.shadowColor = '#00cd9d'; g.shadowBlur = 14; g.fillStyle = '#00cd9d';
  g.beginPath(); g.moveTo(282, 191); g.lineTo(290, 198); g.lineTo(282, 209); g.lineTo(274, 198); g.closePath(); g.fill();
  g.restore();
}

/* ---------- page ---------- */
setText($('kicker'), VOTE.kicker);
setText($('title'), VOTE.title);
setText($('lead'), VOTE.lead);
setText($('back'), VOTE.back);
$('whoLabel').textContent = VOTE.nameLabel;
$('who').placeholder = VOTE.namePlaceholder;
$('who').value = mine.name;
$('noteLabel').textContent = VOTE.noteLabel;
$('note').placeholder = VOTE.notePlaceholder;
$('note').value = mine.note;

const cards = {};
for (const k of KEYS) {
  const L = LOOKS[k];
  const li = el('li', 'look');
  li.dataset.k = k;
  const thumb = document.createElement('canvas');
  thumb.className = 'thumb';
  thumb.setAttribute('role', 'img');
  thumb.setAttribute('aria-label', `${letterOf(k)}: ${L.name}. ${L.what}`);
  const head = el('div', 'head');
  head.append(el('span', 'letter', letterOf(k)), el('b', 'name', L.name));
  const what = el('p', 'what', L.what);
  const pick = el('button', 'pick', VOTE.pick);
  pick.type = 'button';
  const down = el('button', 'down');
  down.type = 'button';
  down.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 13V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2-2l-1-5a2 3 0 0 0-2-2h-7a3 3 0 0 0-3 3"/></svg>';
  const row = el('div', 'row');
  row.append(pick, down);
  const see = el('a', 'see', VOTE.see + ' ›');
  see.href = `home.html?fog=${k}`;
  const tally = el('p', 'tally');
  li.append(thumb, head, what, row, tally, see);
  $('looks').append(li);
  cards[k] = { li, thumb, pick, down, tally };
  pick.addEventListener('click', () => vote({ pick: mine.pick === k ? '' : k, down: mine.down.filter((x) => x !== k) }));
  down.addEventListener('click', () => {
    const isDown = mine.down.includes(k);
    vote({ down: isDown ? mine.down.filter((x) => x !== k) : [...mine.down, k], pick: !isDown && mine.pick === k ? '' : mine.pick });
  });
  thumb.addEventListener('click', () => { active = k; });
}

// Size the previews to their cards; repaint still frames, and keep one look moving at a time.
const t0 = performance.now();
let active = mine.pick || '';
function sizeThumbs() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  for (const k of KEYS) {
    const c = cards[k].thumb;
    const w = Math.round(c.getBoundingClientRect().width * dpr);
    if (!w) continue;
    c.width = w; c.height = Math.round((w * CROP.h) / W);
    paint(c, k, 6);
  }
}
let last = 0;
function loop(now) {
  if (active && LOOKS[active].animated && !matchMedia('(prefers-reduced-motion: reduce)').matches && now - last > 33) {
    last = now;
    paint(cards[active].thumb, active, 6 + (now - t0) / 1000);
  }
  requestAnimationFrame(loop);
}
addEventListener('resize', sizeThumbs);
sizeThumbs();
requestAnimationFrame(loop);

/* ---------- voting ---------- */
let db = null; // { uid, save } once connected to the hub
let all = []; // everyone's latest vote: { name, pick, down, note, uid }

function status(text, kind = '') {
  const s = $('status');
  s.className = 'status ' + kind;
  setText(s, text);
}

function vote(patch) {
  const name = $('who').value.trim();
  if (!name) {
    $('you').classList.add('need');
    $('who').focus();
    status(VOTE.needName, 'warn');
    return;
  }
  $('you').classList.remove('need');
  mine = { ...mine, ...patch, name };
  if (patch.pick) active = patch.pick;
  keepLocal();
  render();
  save();
}

let saveTimer = 0;
function save() {
  clearTimeout(saveTimer);
  if (!db) { status(VOTE.previewOnly); return; }
  status(VOTE.saving);
  saveTimer = setTimeout(async () => {
    const text = JSON.stringify({ name: mine.name, pick: mine.pick, down: mine.down, note: mine.note, ts: Date.now() });
    try {
      await db.save(text, mine.name);
      status(VOTE.saved, 'ok');
    } catch (e) {
      status(VOTE.offline, 'warn');
    }
  }, 350);
}

// Everyone's latest vote: one per person (by name, so voting again from another phone replaces it).
function tallyFrom(docs) {
  const latest = new Map();
  for (const d of docs) {
    let v;
    try { v = JSON.parse(d.text); } catch (e) { continue; }
    const who = (v.name || d.author?.name || d.author?.uid || '').trim();
    const id = who.toLowerCase() || d.author?.uid;
    if (!id) continue;
    if (!latest.has(id) || (latest.get(id).ts || 0) < (v.ts || 0)) latest.set(id, { ...v, name: who, uid: d.author?.uid });
  }
  return [...latest.values()];
}

function render() {
  // my buttons
  for (const k of KEYS) {
    const c = cards[k];
    const isPick = mine.pick === k;
    const isDown = mine.down.includes(k);
    c.li.classList.toggle('mine', isPick);
    c.li.classList.toggle('disliked', isDown);
    setText(c.pick, isPick ? VOTE.picked : VOTE.pick);
    c.pick.setAttribute('aria-pressed', String(isPick));
    c.down.setAttribute('aria-pressed', String(isDown));
    c.down.setAttribute('aria-label', (isDown ? VOTE.undown : VOTE.down)(`${letterOf(k)}, ${LOOKS[k].name}`));
  }
  // everyone's votes (mine counted as I see it right now, even before it saves)
  const others = all.filter((v) => v.name.toLowerCase() !== mine.name.trim().toLowerCase());
  const votes = mine.name && (mine.pick || mine.down.length) ? [...others, mine] : others;
  const score = Object.fromEntries(KEYS.map((k) => [k, {
    up: votes.filter((v) => v.pick === k).length,
    down: votes.filter((v) => (v.down || []).includes(k)).length,
    names: votes.filter((v) => v.pick === k).map((v) => v.name),
  }]));
  for (const k of KEYS) {
    const s = score[k];
    setText(cards[k].tally, s.up || s.down ? VOTE.tally(s.up, s.down) + (s.names.length ? ' · ' + VOTE.by(s.names.join(', ')) : '') : '');
  }
  const box = $('results');
  box.innerHTML = '';
  box.append(el('h2', '', VOTE.resultsTitle));
  if (!votes.length) { box.append(el('p', 'muted', VOTE.noVotes)); }
  else {
    const ranked = [...KEYS].sort((a, b) => (score[b].up - score[b].down) - (score[a].up - score[a].down) || score[b].up - score[a].up);
    const top = score[ranked[0]].up - score[ranked[0]].down;
    const tied = ranked.filter((k) => score[k].up - score[k].down === top).length > 1;
    box.append(el('p', 'muted', VOTE.voters(votes.length) + ' · ' + (tied ? VOTE.tie : VOTE.leading(`${letterOf(ranked[0])}, ${LOOKS[ranked[0]].name}`))));
    const max = Math.max(1, ...KEYS.map((k) => score[k].up), ...KEYS.map((k) => score[k].down));
    const list = el('ol', 'bars');
    for (const k of ranked) {
      const s = score[k];
      const li = el('li');
      const lab = el('span', 'lab');
      lab.append(el('span', 'letter', letterOf(k)), el('span', 'nm', LOOKS[k].name));
      const bars = el('span', 'bar');
      const up = el('i', 'up'); up.style.width = `${(s.up / max) * 100}%`;
      const dn = el('i', 'dn'); dn.style.width = `${(s.down / max) * 100}%`;
      bars.append(up, dn);
      li.append(lab, bars, el('span', 'num', `${s.up} · −${s.down}`));
      li.setAttribute('aria-label', `${letterOf(k)}, ${LOOKS[k].name}: ${VOTE.tally(s.up, s.down)}`);
      list.append(li);
    }
    box.append(list);
  }
  // notes from the team
  const notes = votes.filter((v) => v.note && v.note.trim());
  const nbox = $('notes');
  nbox.hidden = !notes.length;
  nbox.innerHTML = '';
  if (notes.length) {
    nbox.append(el('h2', '', VOTE.notesTitle));
    const ul = el('ul');
    for (const v of notes) { const li = el('li'); li.append(el('b', '', v.name + ': ')); li.append(document.createTextNode(v.note.trim())); ul.append(li); }
    nbox.append(ul);
  }
}

$('who').addEventListener('input', () => {
  $('you').classList.remove('need');
  mine.name = $('who').value.trim();
  keepLocal();
});
$('who').addEventListener('change', () => { if (mine.pick || mine.down.length) vote({}); });
$('note').addEventListener('change', () => vote({ note: $('note').value.trim().slice(0, 400) }));

render();

// Connect to the hub (only works on the experiments site, where ../hub/ exists).
try {
  db = await connect(SLUG, (docs) => { all = tallyFrom(docs); render(); }, () => status(VOTE.offline, 'warn'));
} catch (e) {
  db = null;
}
if (!db) status(VOTE.previewOnly);
