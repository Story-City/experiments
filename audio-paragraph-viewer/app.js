(() => {
'use strict';

const $ = id => document.getElementById(id);
const audio = $('audio');
const chatEl = $('chat');
const vnEl = $('vn');
const baseCv = $('tlBase');
const topCv = $('tlTop');
const wrapEl = $('tlWrap');

const DIFFER_S = 0.5;
const BOUNDARY_S = 0.3;
const PREF_KEY = 'sct380viewer';

const S = {
  index: null,
  storyId: null,
  order: null,
  chapter: null,
  model: 'small',
  mode: 'chat',
  pad: 150,
  tm: [],
  matched: [],
  check: [],
  cur: -1,
  last: -1,
  selected: -1,
  pin: -1,
  pinFrom: 0,
  stopAt: null,
  boundary: -1,
  hoverT: null,
  loadToken: 0,
};

const prefs = (() => {
  try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch (e) { return {}; }
})();
const savePrefs = () => {
  try { localStorage.setItem(PREF_KEY, JSON.stringify({ model: S.model, mode: S.mode, pad: S.pad, speed: audio.defaultPlaybackRate, volumeSlider: +$('volume').value })); } catch (e) { /* storage unavailable */ }
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const unit = v => (v === null || v === '' || !Number.isFinite(Number(v)) ? 1 : clamp(Number(v), 0, 1));
const sliderToGain = s => unit(s) ** 2;
const gainToSlider = g => Math.sqrt(unit(g));
window.viewerVolume = { sliderToGain, gainToSlider };
const dur = () => (Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (S.chapter ? S.chapter.duration : 0));
const fmtTime = t => {
  t = Math.max(0, t || 0);
  const m = Math.floor(t / 60);
  return `${m}:${(t - m * 60).toFixed(1).padStart(4, '0')}`;
};
const sec = v => `${v.toFixed(2)} s`;
const paras = () => (S.chapter ? S.chapter.paragraphs : []);
const modelKey = () => (S.model === 'small' ? 'small' : 'large');
const otherKey = () => (S.model === 'small' ? 'large' : 'small');
const modelName = key => (key === 'small' ? 'small' : 'large-v3');
const isOk = i => !!S.tm[i] && S.tm[i].status === 'ok' && S.tm[i].start != null;

/* ---------- derived data ---------- */

function compute() {
  const ps = paras();
  const key = modelKey();
  S.tm = ps.map(p => p[key]);
  S.matched = ps.map((p, i) => i).filter(isOk)
    .map(i => ({ i, start: S.tm[i].start, end: S.tm[i].end }))
    .sort((a, b) => a.start - b.start);
  S.check = ps.map((p, i) => isOk(i) && ((i > 0 && !isOk(i - 1)) || (i < ps.length - 1 && !isOk(i + 1))));
}

function differDetail(i) {
  const p = paras()[i];
  const a = p.small, b = p.large;
  if ((a.status === 'ok') !== (b.status === 'ok')) {
    return `models differ: ${a.status === 'ok' ? 'large-v3' : 'small'} left it unmatched`;
  }
  const parts = [];
  const ds = Math.abs(a.start - b.start), de = Math.abs(a.end - b.end);
  if (ds > DIFFER_S) parts.push(`start ${ds.toFixed(2)} s`);
  if (de > DIFFER_S) parts.push(`end ${de.toFixed(2)} s`);
  return `models differ: ${parts.join(', ')}`;
}

/* ---------- paragraph elements ---------- */

function badge(cls, icon, text, title) {
  const b = document.createElement('span');
  b.className = `badge ${cls}`;
  b.textContent = `${icon} ${text}`;
  if (title) b.title = title;
  return b;
}

function captionText(i) {
  const p = paras()[i];
  const t = S.tm[i];
  if (!isOk(i)) return `No timing from ${modelName(modelKey())} (${t.matched}/${t.words} words matched)`;
  let s = `${sec(t.start)} to ${sec(t.end)} · ${t.matched}/${t.words} words matched (${t.frac.toFixed(3)})`;
  if (p.differ) {
    const o = p[otherKey()];
    s += o.status === 'ok'
      ? ` · ${modelName(otherKey())}: ${sec(o.start)} to ${sec(o.end)}`
      : ` · ${modelName(otherKey())}: unmatched`;
  }
  return s;
}

function buildPara(i, cls) {
  const p = paras()[i];
  const ok = isOk(i);
  const el = document.createElement('article');
  el.className = `para ${cls || ''}`.trim();
  if (p.isAppLine) el.classList.add('appline');
  if (!ok) el.classList.add('nosync');
  el.dataset.i = i;
  const head = document.createElement('div');
  head.className = 'para-head';
  const num = document.createElement('span');
  num.className = 'num';
  num.textContent = `#${i + 1}`;
  head.appendChild(num);
  if (p.isAppLine) head.appendChild(badge('appline', '▤', 'app line', 'On-screen app text; the narrator may not read it'));
  if (!ok) head.appendChild(badge('unmatched', '∅', 'unmatched', 'No audio was matched to this paragraph; it is never highlighted by time'));
  if (S.check[i]) head.appendChild(badge('check', '?', 'check', 'Next to an unmatched paragraph; its audio may spill into this one'));
  if (p.differ) head.appendChild(badge('differ', '≠', differDetail(i), 'small and large-v3 disagree by more than 0.5 s'));
  const txt = document.createElement('p');
  txt.className = 'txt';
  txt.textContent = p.text;
  const cap = document.createElement('p');
  cap.className = 'cap';
  cap.textContent = captionText(i);
  el.append(head, txt, cap);
  el.title = paraTitle(i);
  return el;
}

function paraTitle(i) {
  if (!isOk(i)) return captionText(i);
  return `${captionText(i)}\nClick to play from ${sec(Math.max(0, S.tm[i].start - S.pad / 1000))}`;
}

/* ---------- chat and visual novel views ---------- */

function renderChat() {
  const keep = chatEl.scrollTop;
  chatEl.textContent = '';
  paras().forEach((p, i) => chatEl.appendChild(buildPara(i, i === S.cur ? 'cur' : '')));
  chatEl.querySelectorAll('.para.cur').forEach(addNowBadge);
  chatEl.scrollTo({ top: keep, behavior: 'auto' });
}

function addNowBadge(el) {
  if (el.querySelector('.badge.now')) return;
  const head = el.querySelector('.para-head');
  head.insertBefore(badge('now', '▶', 'now playing'), head.children[1] || null);
}

function renderVN() {
  vnEl.textContent = '';
  const ps = paras();
  if (!ps.length) return;
  const cur = S.cur;
  const prevI = cur >= 0 ? cur - 1 : S.last;
  const nextI = cur >= 0 ? cur + 1 : S.last + 1;
  if (prevI >= 0 && prevI < ps.length) vnEl.appendChild(buildPara(prevI, 'vn-line vn-prev'));
  if (cur >= 0) {
    const main = buildPara(cur, 'vn-line vn-main');
    addNowBadge(main);
    vnEl.appendChild(main);
  } else {
    const main = document.createElement('article');
    main.className = 'para vn-line vn-main pause';
    const head = document.createElement('div');
    head.className = 'para-head';
    head.appendChild(badge('appline', '…', 'pause', 'No matched paragraph covers this moment'));
    const txt = document.createElement('p');
    txt.className = 'txt';
    txt.textContent = S.last < 0 ? 'Before the first matched paragraph.' : `Pause after paragraph ${S.last + 1}.`;
    main.append(head, txt);
    vnEl.appendChild(main);
  }
  if (nextI >= 0 && nextI < ps.length) vnEl.appendChild(buildPara(nextI, 'vn-line vn-next'));
  vnEl.firstElementChild.style.marginTop = 'auto';
  const main = vnEl.querySelector('.vn-main');
  const over = main.offsetTop + main.offsetHeight + 16 - vnEl.clientHeight;
  vnEl.scrollTop = Math.max(0, over);
}

function revealCurrent(smooth) {
  if (S.mode !== 'chat') return;
  const i = S.cur >= 0 ? S.cur : -1;
  if (i < 0) return;
  const el = chatEl.querySelector(`[data-i="${i}"]`);
  if (!el) return;
  const top = el.offsetTop - (chatEl.clientHeight - el.offsetHeight) / 2;
  chatEl.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });
}

function updateHighlight(changedCur) {
  drawBase();
  chatEl.querySelectorAll('.para.cur').forEach(el => {
    el.classList.remove('cur');
    const b = el.querySelector('.badge.now');
    if (b) b.remove();
  });
  if (S.cur >= 0) {
    const el = chatEl.querySelector(`[data-i="${S.cur}"]`);
    if (el) { el.classList.add('cur'); addNowBadge(el); }
  }
  if (S.mode === 'vn') renderVN();
  if (changedCur && S.cur >= 0) revealCurrent(true);
}

function setMode(mode) {
  S.mode = mode;
  chatEl.hidden = mode !== 'chat';
  vnEl.hidden = mode !== 'vn';
  $('modeChat').setAttribute('aria-pressed', String(mode === 'chat'));
  $('modeVn').setAttribute('aria-pressed', String(mode === 'vn'));
  if (mode === 'vn') renderVN();
  else revealCurrent(false);
  savePrefs();
}

function setModel(key) {
  S.model = key === 'large' ? 'large' : 'small';
  $('modelSmall').setAttribute('aria-pressed', String(S.model === 'small'));
  $('modelLarge').setAttribute('aria-pressed', String(S.model === 'large'));
  compute();
  locate();
  renderChat();
  if (S.mode === 'vn') renderVN();
  fillChapterOptions();
  drawBase();
  updateUi();
  revealCurrent(false);
  savePrefs();
}

/* ---------- playhead location ---------- */

function locate() {
  const t = audio.currentTime || 0;
  if (S.pin >= 0 && (!isOk(S.pin) || t < S.pinFrom - 0.05 || t >= S.tm[S.pin].start)) S.pin = -1;
  let last = -1;
  for (const m of S.matched) {
    if (m.start <= t) last = m.i; else break;
  }
  if (S.pin >= 0) last = S.pin;
  const cur = last;
  const changed = cur !== S.cur || last !== S.last;
  const curChanged = cur !== S.cur;
  S.cur = cur;
  S.last = last;
  if (cur >= 0) S.selected = cur;
  return { changed, curChanged };
}

function focusIndex() {
  if (S.cur >= 0) return S.cur;
  if (S.selected >= 0 && isOk(S.selected)) return S.selected;
  if (S.last >= 0) return S.last;
  return S.matched.length ? S.matched[0].i : -1;
}

function nowText() {
  const t = audio.currentTime || 0;
  const n = paras().length;
  let s;
  if (!S.matched.length) s = 'Now: no matched paragraphs in this chapter';
  else if (S.cur >= 0) s = `Now: paragraph ${S.cur + 1} of ${n} (${sec(S.tm[S.cur].start)} to ${sec(S.tm[S.cur].end)})`;
  else if (S.last < 0) s = `Now: before the first matched paragraph (${sec(S.matched[0].start)})`;
  else if (S.last === S.matched[S.matched.length - 1].i) s = `Now: after the last matched paragraph (${S.last + 1})`;
  else s = `Now: pause after paragraph ${S.last + 1}`;
  if (S.boundary >= 0) s += ` · boundary check on paragraph ${S.boundary + 1}, stops at ${sec(S.stopAt)}`;
  return `${s} · ${fmtTime(t)}`;
}

let seekDragging = false;
function updateUi() {
  const t = audio.currentTime || 0;
  const d = dur();
  $('timeNow').textContent = fmtTime(t);
  $('timeEnd').textContent = fmtTime(d);
  const seek = $('seek');
  seek.max = d || 1;
  if (!seekDragging) seek.value = t;
  $('nowLine').textContent = nowText();
  const playing = !audio.paused && !audio.ended;
  $('playText').textContent = playing ? 'Pause' : 'Play';
  $('playIcon').textContent = playing ? '❚❚' : '▶';
  $('playBtn').setAttribute('aria-label', playing ? 'Pause' : 'Play');
  const f = focusIndex();
  const bb = $('boundaryBtn');
  bb.textContent = S.boundary >= 0 ? `Checking paragraph ${S.boundary + 1}...` : (f >= 0 ? `Boundary check: paragraph ${f + 1}` : 'Boundary check');
  bb.classList.toggle('active', S.boundary >= 0);
  bb.disabled = f < 0;
  drawTop();
}

function refresh() {
  const { changed, curChanged } = locate();
  if (changed) updateHighlight(curChanged);
  updateUi();
}

/* ---------- playback control ---------- */

function startPlay() {
  const p = audio.play();
  if (p && p.catch) p.catch(() => {});
}

function userSeek(t, play, pin = -1) {
  S.stopAt = null;
  S.boundary = -1;
  S.pin = pin;
  S.pinFrom = clamp(t, 0, dur() || t);
  audio.currentTime = S.pinFrom;
  if (play) startPlay();
  refresh();
}

function togglePlay() {
  S.stopAt = null;
  S.boundary = -1;
  if (audio.paused) startPlay(); else audio.pause();
  refresh();
}

function playParagraph(i) {
  if (!isOk(i)) {
    $('nowLine').textContent = `Paragraph ${i + 1} has no timing in ${modelName(modelKey())}, so there is nowhere to seek.`;
    return;
  }
  S.selected = i;
  userSeek(S.tm[i].start - S.pad / 1000, true, i);
}

function stepParagraph(dir) {
  if (!S.matched.length) return;
  const pad = S.pad / 1000;
  const t = audio.currentTime || 0;
  let target = null;
  if (dir > 0) {
    target = S.matched.find(m => m.start - pad > t + 0.05);
  } else {
    const before = S.matched.filter(m => m.start - pad < t - 0.5);
    target = before.length ? before[before.length - 1] : null;
  }
  if (target) {
    S.selected = target.i;
    userSeek(target.start - pad, false, target.i);
  } else if (dir < 0) {
    userSeek(0, false);
  }
}

function boundaryCheck() {
  const i = focusIndex();
  if (i < 0 || !isOk(i)) return;
  const t = S.tm[i];
  S.selected = i;
  userSeek(t.start - BOUNDARY_S, true);
  S.stopAt = t.end + BOUNDARY_S;
  S.boundary = i;
  updateUi();
}

function tick() {
  if (S.stopAt != null && audio.currentTime >= S.stopAt) {
    audio.pause();
    S.stopAt = null;
    S.boundary = -1;
  }
  refresh();
}

let raf = 0;
function loop() {
  tick();
  raf = audio.paused ? 0 : requestAnimationFrame(loop);
}
audio.addEventListener('play', () => { if (!raf) raf = requestAnimationFrame(loop); refresh(); });
['pause', 'seeked', 'timeupdate', 'loadedmetadata', 'durationchange'].forEach(ev => audio.addEventListener(ev, () => {
  if (ev === 'durationchange' || ev === 'loadedmetadata') drawBase();
  tick();
}));
audio.addEventListener('ended', () => { S.stopAt = null; S.boundary = -1; refresh(); });

/* ---------- timeline ---------- */

const T = { w: 0, h: 0, dpr: 1, labelH: 30, axisH: 16, stripH: 9 };

function colors() {
  const cs = getComputedStyle(document.documentElement);
  const g = name => cs.getPropertyValue(name).trim();
  return { text: g('--text'), muted: g('--text-muted'), border: g('--border'), accent: g('--accent'), a: g('--tint-a'), b: g('--tint-b'), flag: g('--flag') };
}

function sizeCanvases() {
  T.dpr = window.devicePixelRatio || 1;
  T.w = wrapEl.clientWidth;
  T.h = wrapEl.clientHeight;
  [baseCv, topCv].forEach(cv => {
    cv.width = Math.max(1, Math.round(T.w * T.dpr));
    cv.height = Math.max(1, Math.round(T.h * T.dpr));
  });
}

const xOf = t => (dur() ? (t / dur()) * T.w : 0);
const wave = () => ({ y0: T.labelH, y1: T.h - T.axisH - T.stripH });

function hatch(ctx, c) {
  const p = document.createElement('canvas');
  p.width = p.height = 6;
  const pc = p.getContext('2d');
  pc.strokeStyle = c.muted;
  pc.lineWidth = 1.2;
  pc.beginPath();
  pc.moveTo(0, 6);
  pc.lineTo(6, 0);
  pc.stroke();
  return ctx.createPattern(p, 'repeat');
}

function drawBase() {
  if (!T.w) sizeCanvases();
  const ctx = baseCv.getContext('2d');
  ctx.setTransform(T.dpr, 0, 0, T.dpr, 0, 0);
  ctx.clearRect(0, 0, T.w, T.h);
  if (!S.chapter) return;
  const c = colors();
  const { y0, y1 } = wave();
  const mid = (y0 + y1) / 2;

  S.matched.forEach((m, k) => {
    const x0 = xOf(m.start), x1 = xOf(m.end);
    const col = k % 2 ? c.b : c.a;
    ctx.globalAlpha = m.i === S.cur ? 0.5 : 0.22;
    ctx.fillStyle = col;
    ctx.fillRect(x0, 0, Math.max(1, x1 - x0), y1);
    ctx.globalAlpha = 1;
  });

  const peaks = S.chapter.peaks;
  const N = peaks.length;
  ctx.fillStyle = c.text;
  ctx.globalAlpha = 0.75;
  for (let px = 0; px < T.w; px++) {
    const a = Math.floor((px / T.w) * N), b = Math.max(a + 1, Math.floor(((px + 1) / T.w) * N));
    let v = 0;
    for (let k = a; k < b && k < N; k++) if (peaks[k] > v) v = peaks[k];
    const h = Math.max(1, Math.pow(v, 0.6) * (y1 - y0));
    ctx.fillRect(px, mid - h / 2, 1, h);
  }
  ctx.globalAlpha = 1;

  S.matched.forEach((m, k) => {
    const x0 = xOf(m.start), x1 = xOf(m.end);
    const col = k % 2 ? c.b : c.a;
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, y1); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(x1, 0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.setLineDash([]);
    if (m.i === S.cur) {
      ctx.strokeStyle = c.text;
      ctx.lineWidth = 2;
      ctx.strokeRect(x0, 1, Math.max(1, x1 - x0), y1 - 1);
    }
    ctx.fillStyle = c.text;
    ctx.font = '700 11px system-ui, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(`#${m.i + 1}`, x0 + 4, 3 + (k % 2) * 13);
  });

  paras().forEach((p, i) => {
    if (!p.differ || !isOk(i)) return;
    const o = p[otherKey()];
    if (o.status !== 'ok') return;
    ctx.fillStyle = c.flag;
    ctx.strokeStyle = c.flag;
    [o.start, o.end].forEach(t => {
      const x = xOf(t);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x - 5, y1); ctx.lineTo(x + 5, y1); ctx.lineTo(x, y1 - 9); ctx.closePath(); ctx.fill();
    });
  });

  const spans = S.chapter.unassigned[modelKey()] || [];
  const pat = hatch(ctx, c);
  spans.forEach(sp => {
    const x0 = xOf(sp.start), x1 = xOf(sp.end);
    ctx.fillStyle = pat;
    ctx.fillRect(x0, y1 + 1, Math.max(2, x1 - x0), T.stripH - 1);
    ctx.strokeStyle = c.muted;
    ctx.lineWidth = 1;
    ctx.strokeRect(x0 + 0.5, y1 + 1.5, Math.max(2, x1 - x0) - 1, T.stripH - 2);
  });

  const steps = [1, 2, 5, 10, 15, 30, 60, 120];
  const step = steps.find(s => xOf(s) >= 70) || 120;
  ctx.fillStyle = c.muted;
  ctx.strokeStyle = c.border;
  ctx.font = '10px system-ui, sans-serif';
  ctx.textBaseline = 'top';
  for (let t = 0; t <= dur(); t += step) {
    const x = Math.round(xOf(t)) + 0.5;
    ctx.beginPath(); ctx.moveTo(x, T.h - T.axisH); ctx.lineTo(x, T.h - T.axisH + 4); ctx.stroke();
    const m = Math.floor(t / 60);
    ctx.fillText(`${m}:${String(Math.round(t - m * 60)).padStart(2, '0')}`, x + 3, T.h - T.axisH + 3);
  }
}

function drawTop() {
  if (!T.w) return;
  const ctx = topCv.getContext('2d');
  ctx.setTransform(T.dpr, 0, 0, T.dpr, 0, 0);
  ctx.clearRect(0, 0, T.w, T.h);
  if (!S.chapter) return;
  const c = colors();
  if (S.hoverT != null) {
    const hx = xOf(S.hoverT);
    ctx.strokeStyle = c.muted;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(hx + 0.5, 0); ctx.lineTo(hx + 0.5, T.h - T.axisH); ctx.stroke();
  }
  if (S.stopAt != null) {
    const sx = xOf(S.stopAt);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 3;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, T.h - T.axisH); ctx.stroke();
    ctx.setLineDash([]);
  }
  const x = xOf(audio.currentTime || 0);
  ctx.strokeStyle = c.text;
  ctx.fillStyle = c.text;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, T.h - T.axisH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 6, 0); ctx.lineTo(x + 6, 0); ctx.lineTo(x, 9); ctx.closePath(); ctx.fill();
}

function timeAt(ev) {
  const r = topCv.getBoundingClientRect();
  return clamp(((ev.clientX - r.left) / r.width) * dur(), 0, dur());
}

function hoverText(t) {
  const m = S.matched.filter(x => x.start <= t && t <= x.end).pop();
  if (m) return `Pointer at ${sec(t)}: paragraph ${m.i + 1} (${sec(m.start)} to ${sec(m.end)}). Click to seek.`;
  return `Pointer at ${sec(t)}: no matched paragraph. Click to seek.`;
}

topCv.addEventListener('pointerdown', ev => {
  if (!S.chapter) return;
  topCv.setPointerCapture(ev.pointerId);
  userSeek(timeAt(ev), false);
});
topCv.addEventListener('pointermove', ev => {
  if (!S.chapter) return;
  const t = timeAt(ev);
  S.hoverT = t;
  $('hoverLine').textContent = hoverText(t);
  if (ev.buttons & 1) userSeek(t, false); else drawTop();
});
topCv.addEventListener('pointerleave', () => {
  S.hoverT = null;
  $('hoverLine').textContent = '';
  drawTop();
});

new ResizeObserver(() => { sizeCanvases(); drawBase(); drawTop(); }).observe(wrapEl);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { drawBase(); drawTop(); });

/* ---------- loading ---------- */

function storyMeta() { return S.index.stories.find(s => s.id === S.storyId); }

function chapterLabel(c) {
  const u = c.unmatched[modelKey()];
  let s = `${c.order}. ${c.name} · ${c.paragraphs} paragraphs`;
  if (u) s += ` · ${u} unmatched`;
  if (c.differ) s += ` · ${c.differ} differ`;
  return s;
}

function fillChapterOptions() {
  if (!S.index) return;
  const sel = $('chapterSel');
  sel.textContent = '';
  storyMeta().chapters.forEach(c => {
    const o = document.createElement('option');
    o.value = c.order;
    o.textContent = chapterLabel(c);
    sel.appendChild(o);
  });
  if (S.order != null) sel.value = S.order;
}

async function loadChapter(storyId, order) {
  const token = ++S.loadToken;
  S.storyId = storyId;
  S.order = order;
  const meta = storyMeta().chapters.find(c => c.order === order) || storyMeta().chapters[0];
  S.order = meta.order;
  $('storySel').value = storyId;
  fillChapterOptions();
  audio.pause();
  S.stopAt = null;
  S.boundary = -1;
  S.cur = S.last = S.selected = S.pin = -1;
  let data;
  try {
    const res = await fetch(meta.file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    if (token !== S.loadToken) return;
    S.chapter = null;
    chatEl.textContent = `Could not load ${meta.file}: ${err.message}`;
    return;
  }
  if (token !== S.loadToken) return;
  S.chapter = data;
  audio.src = data.audio;
  compute();
  renderChat();
  renderVN();
  sizeCanvases();
  drawBase();
  chatEl.scrollTop = 0;
  refresh();
  const prevCh = storyMeta().chapters.findIndex(c => c.order === S.order);
  $('prevCh').disabled = prevCh <= 0;
  $('nextCh').disabled = prevCh >= storyMeta().chapters.length - 1;
  try { history.replaceState(null, '', `#${storyId}/${S.order}`); } catch (e) { /* history unavailable */ }
}

function stepChapter(dir) {
  const list = storyMeta().chapters;
  const k = list.findIndex(c => c.order === S.order) + dir;
  if (k >= 0 && k < list.length) loadChapter(S.storyId, list[k].order);
}

/* ---------- events ---------- */

function inTextControl(el) {
  const tag = el.tagName;
  return tag === 'SELECT' || tag === 'TEXTAREA' || (tag === 'INPUT' && !['range', 'checkbox', 'button'].includes(el.type));
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey || inTextControl(e.target)) return;
  const onRange = e.target.tagName === 'INPUT' && e.target.type === 'range';
  if (e.key === ' ') { e.preventDefault(); if (!e.repeat) togglePlay(); }
  else if (e.key === 'ArrowLeft' && !onRange) { e.preventDefault(); stepParagraph(-1); }
  else if (e.key === 'ArrowRight' && !onRange) { e.preventDefault(); stepParagraph(1); }
  else if (e.key === 'm' || e.key === 'M') setModel(S.model === 'small' ? 'large' : 'small');
});
document.addEventListener('keyup', e => {
  if (e.key === ' ' && !inTextControl(e.target)) e.preventDefault();
});
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b && e.detail > 0) b.blur();
});

function onParaClick(e) {
  const el = e.target.closest('[data-i]');
  if (el && !el.classList.contains('pause')) playParagraph(+el.dataset.i);
}
chatEl.addEventListener('click', onParaClick);
vnEl.addEventListener('click', onParaClick);

$('playBtn').addEventListener('click', togglePlay);
$('boundaryBtn').addEventListener('click', boundaryCheck);
$('modeChat').addEventListener('click', () => setMode('chat'));
$('modeVn').addEventListener('click', () => setMode('vn'));
$('modelSmall').addEventListener('click', () => setModel('small'));
$('modelLarge').addEventListener('click', () => setModel('large'));
$('prevCh').addEventListener('click', () => stepChapter(-1));
$('nextCh').addEventListener('click', () => stepChapter(1));

$('storySel').addEventListener('change', e => {
  e.target.blur();
  loadChapter(e.target.value, S.index.stories.find(s => s.id === e.target.value).chapters[0].order);
});
$('chapterSel').addEventListener('change', e => {
  e.target.blur();
  loadChapter(S.storyId, +e.target.value);
});

const seekEl = $('seek');
seekEl.addEventListener('pointerdown', () => { seekDragging = true; });
window.addEventListener('pointerup', () => { seekDragging = false; });
seekEl.addEventListener('input', () => userSeek(+seekEl.value, false));

function setSpeed(v) {
  audio.defaultPlaybackRate = v;
  audio.playbackRate = v;
  $('speedSeg').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.speed === v)));
  savePrefs();
}
$('speedSeg').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b) setSpeed(+b.dataset.speed);
});

function setPad(ms) {
  S.pad = clamp(ms, 0, 500);
  $('pad').value = S.pad;
  $('padOut').textContent = `${S.pad} ms`;
  document.querySelectorAll('.para[data-i]').forEach(el => { el.title = paraTitle(+el.dataset.i); });
  savePrefs();
}
$('pad').addEventListener('input', e => setPad(+e.target.value));
['seek', 'pad', 'volume'].forEach(id => $(id).addEventListener('pointerup', e => e.target.blur()));
$('volume').addEventListener('input', e => { audio.volume = sliderToGain(e.target.value); savePrefs(); });

/* ---------- start ---------- */

async function init() {
  const res = await fetch('data/index.json');
  S.index = await res.json();
  const storySel = $('storySel');
  S.index.stories.forEach(s => {
    const o = document.createElement('option');
    o.value = s.id;
    o.textContent = `${s.title} (${s.chapters.length} chapters, ${s.source})`;
    storySel.appendChild(o);
  });
  S.model = prefs.model === 'large' ? 'large' : 'small';
  $('modelSmall').setAttribute('aria-pressed', String(S.model === 'small'));
  $('modelLarge').setAttribute('aria-pressed', String(S.model === 'large'));
  setPad(Number.isFinite(prefs.pad) ? prefs.pad : 150);
  setSpeed([0.75, 1, 1.25, 1.5].includes(prefs.speed) ? prefs.speed : 1);
  const volEl = $('volume');
  volEl.value = Number.isFinite(prefs.volumeSlider) ? clamp(prefs.volumeSlider, 0, 1) : gainToSlider(prefs.volume);
  audio.volume = sliderToGain(volEl.value);
  setMode(prefs.mode === 'vn' ? 'vn' : 'chat');
  const [hs, ho] = location.hash.slice(1).split('/');
  const story = S.index.stories.find(s => s.id === hs) || S.index.stories[0];
  const chapter = story.chapters.find(c => c.order === +ho) || story.chapters[0];
  await loadChapter(story.id, chapter.order);
}

init().catch(err => { chatEl.textContent = `Could not start: ${err.message}`; });
})();
