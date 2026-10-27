(() => {
'use strict';

/** Shared story data from Brett's SCT-380 experiment (do not duplicate). */
const DATA_ROOT = '../audio-paragraph-viewer/';

const $ = id => document.getElementById(id);
const audio = $('audio');
const LEAD_S = 0.15;
const PREF_KEY = 'sct380vnproto';
const SPEEDS = [0.75, 1, 1.25, 1.5];
/** Tales from the Incident — real timed audio + NARRATOR:/character labels in Brett’s data. */
const DEFAULT_STORY = 'tales';
/** Loc 3-1c — Brighid interaction; intro → investigate poses + cast stage sides. */
const DEFAULT_ORDER = 22;
const SPRITE_ENTER_MS = 480;
const SPRITE_EXIT_MS = 360;

/** On-stage cast with real art only. First speaker owns left; the next owns right. */
const CAST = {
  chane: {
    id: 'chane',
    match: /^chane$/i,
    poses: ['intro', 'charming'],
  },
  brighid: {
    id: 'brighid',
    match: /^brighid$/i,
    poses: ['intro', 'investigate'],
  },
};

const S = {
  index: null,
  storyId: null,
  order: null,
  chapter: null,
  model: 'small',
  flow: [],
  hidden: 0,
  k: -2,
  pin: -1,
  pinFrom: 0,
  token: 0,
  imgToken: 0,
  sheetStory: null,
  userScrollAt: 0,
  wordIdx: -1,
  words: [],
  choicesOpen: false,
  stage: {
    sides: Object.create(null),
    currentId: null,
    currentPose: null,
    visible: false,
    animToken: 0,
    req: 0,
  },
};

const prefs = (() => {
  try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch (e) { return {}; }
})();
function savePrefs() {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify({ story: S.storyId, order: S.order, model: S.model, speed: audio.defaultPlaybackRate }));
  } catch (e) { /* storage unavailable */ }
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const modelKey = () => (S.model === 'large' ? 'large' : 'small');
const dur = () => (Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (S.chapter ? S.chapter.duration : 0));
const fmt = t => {
  t = Math.max(0, Math.floor(t || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};
const story = id => S.index.stories.find(s => s.id === id);
const dataUrl = rel => DATA_ROOT + rel.replace(/^\//, '');

/* ---------- reading flow ---------- */

/** ~3 caption lines; new dialog entry only between sentences — never mid-sentence. */
const DIALOG_LINES = 3;
const DIALOG_CHARS_PER_LINE = 42;
const DIALOG_MAX_CHARS = DIALOG_LINES * DIALOG_CHARS_PER_LINE;

function splitSentences(text) {
  const raw = (text || '').trim();
  if (!raw) return [];
  // Keep the trailing punctuation + space with each sentence; do not split on abbreviations mid-word.
  const parts = raw.match(/[^.!?]+(?:[.!?]+["')\]]*)?(?:\s+|$)/g);
  return (parts || [raw]).map(s => s.trim()).filter(Boolean);
}

function splitDialogChunks(text) {
  const sentences = splitSentences(text);
  if (!sentences.length) return [];

  const chunks = [];
  let buf = '';

  const flush = () => {
    const t = buf.trim();
    if (t) chunks.push(t);
    buf = '';
  };

  sentences.forEach(sentence => {
    // One sentence alone always stays whole, even if longer than 3 lines.
    if (!buf) {
      buf = sentence;
      if (buf.length >= DIALOG_MAX_CHARS) flush();
      return;
    }
    const next = `${buf} ${sentence}`;
    if (next.length > DIALOG_MAX_CHARS) {
      flush();
      buf = sentence;
      if (buf.length >= DIALOG_MAX_CHARS) flush();
    } else {
      buf = next;
    }
  });
  flush();
  return chunks.length ? chunks : [(text || '').trim()].filter(Boolean);
}

/** Tales labels speakers as `NARRATOR:` / `CYE:`; pirate uses quotes. Never invent names. */
function parseVoiceLine(raw, isApp) {
  const full = (raw || '').trim();
  if (isApp) return { narr: true, speaker: null, body: full };
  const tagged = full.match(/^([A-Z][A-Z0-9 /.'-]{0,40})\s*:\s*([\s\S]*)$/);
  if (tagged) {
    const who = tagged[1].trim();
    const body = (tagged[2] || '').trim();
    if (who === 'NARRATOR') return { narr: true, speaker: null, body };
    const speaker = who
      .split(/(\s+)/)
      .map(w => (/^\s+$/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase()))
      .join('');
    return { narr: false, speaker, body };
  }
  if (/^["“'«]/.test(full)) return { narr: false, speaker: null, body: full };
  return { narr: true, speaker: null, body: full };
}

function buildFlow() {
  const key = modelKey();
  const ps = S.chapter.paragraphs;
  const matched = ps
    .filter(p => p[key].status === 'ok' && p[key].start != null)
    .sort((a, b) => a[key].start - b[key].start);

  S.flow = [];
  matched.forEach(p => {
    const voice = parseVoiceLine(p.text, p.isAppLine);
    const chunks = splitDialogChunks(voice.body);
    const span = Math.max(0.05, p[key].end - p[key].start);
    const weights = chunks.map(c => Math.max(1, c.length));
    const totalW = weights.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    chunks.forEach((text, ci) => {
      const start = p[key].start + (acc / totalW) * span;
      acc += weights[ci];
      const end = p[key].start + (acc / totalW) * span;
      S.flow.push({
        i: p.i,
        chunk: ci,
        chunks: chunks.length,
        start,
        end,
        text,
        app: p.isAppLine,
        narr: voice.narr,
        speaker: voice.speaker,
      });
    });
  });
  S.hidden = ps.length - matched.length;
}

function locate(t) {
  if (S.pin >= 0 && (!S.flow[S.pin] || t < S.pinFrom - 0.05 || t >= S.flow[S.pin].start)) S.pin = -1;
  let k = -1;
  for (let j = 0; j < S.flow.length; j++) {
    if (S.flow[j].start <= t) k = j; else break;
  }
  return S.pin >= 0 ? S.pin : k;
}

/** Split paragraph text into word tokens; timings estimated inside [start,end] (no word stamps in data). */
function buildWords(item) {
  if (!item || !item.text) return [];
  const parts = item.text.match(/\S+\s*/g) || [];
  const weights = parts.map(p => Math.max(1, p.trim().length));
  const totalW = weights.reduce((a, b) => a + b, 0) || 1;
  const span = Math.max(0.05, (item.end - item.start) || 1);
  let acc = 0;
  return parts.map((raw, i) => {
    const start = item.start + (acc / totalW) * span;
    acc += weights[i];
    const end = item.start + (acc / totalW) * span;
    return { raw, start, end };
  });
}

function paintWords(activeIdx) {
  const root = $('mainText');
  const spans = root.querySelectorAll('.w');
  spans.forEach((el, i) => {
    el.classList.toggle('said', i < activeIdx);
    el.classList.toggle('now', i === activeIdx);
    el.classList.toggle('soon', i > activeIdx);
  });
  const now = root.querySelector('.w.now');
  if (now) now.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function renderWords(item, t) {
  const root = $('mainText');
  root.textContent = '';
  S.words = buildWords(item);
  S.wordIdx = -1;
  if (!S.words.length) {
    root.textContent = item ? item.text : '';
    return;
  }
  const frag = document.createDocumentFragment();
  S.words.forEach((w, i) => {
    const span = document.createElement('span');
    span.className = 'w soon';
    span.dataset.i = String(i);
    span.textContent = w.raw;
    frag.appendChild(span);
  });
  root.appendChild(frag);
  syncWord(t);
}

function syncWord(t) {
  if (!S.words.length) return;
  let idx = -1;
  for (let i = 0; i < S.words.length; i++) {
    if (S.words[i].start <= t) idx = i; else break;
  }
  if (idx === S.wordIdx) return;
  S.wordIdx = idx;
  paintWords(idx);
}

function isNarratorLine(item) {
  if (!item) return false;
  if (item.narr != null) return !!item.narr;
  if (item.app) return true;
  const t = (item.text || '').trim();
  return !/^["“'«]/.test(t);
}

function preloadSprites() {
  document.querySelectorAll('.sprite-layer').forEach(layer => {
    const img = new Image();
    img.decoding = 'async';
    img.src = layer.getAttribute('src');
    if (layer.decode) layer.decode().catch(() => {});
  });
}

function resetStage() {
  S.stage.sides = Object.create(null);
  S.stage.currentId = null;
  S.stage.currentPose = null;
  S.stage.visible = false;
  S.stage.animToken += 1;
  S.stage.req += 1;
  const el = $('sprite');
  if (!el) return;
  el.classList.remove('is-enter-left', 'is-enter-right', 'is-exit-left', 'is-exit-right');
  el.dataset.visible = '0';
  el.dataset.cast = '';
  el.dataset.pose = '';
  el.dataset.side = '';
  el.setAttribute('aria-hidden', 'true');
  el.querySelectorAll('.sprite-cast').forEach(node => { node.hidden = true; });
  el.querySelectorAll('.sprite-layer').forEach(layer => layer.classList.remove('is-on'));
}

function resolveCast(item) {
  if (!item || !item.speaker) return null;
  return Object.values(CAST).find(c => c.match.test(item.speaker)) || null;
}

/** First on-stage cast owns left (center home); the next distinct cast owns right. */
function sideForCast(castId) {
  if (S.stage.sides[castId]) return S.stage.sides[castId];
  const taken = Object.values(S.stage.sides);
  const side = taken.includes('left') ? 'right' : 'left';
  S.stage.sides[castId] = side;
  return side;
}

function castParaIndex(castId, item) {
  if (!item) return -1;
  const cast = CAST[castId];
  if (!cast) return -1;
  const seen = [];
  for (let n = 0; n < S.flow.length; n++) {
    const f = S.flow[n];
    if (f.narr || f.app || !f.speaker || !cast.match.test(f.speaker)) continue;
    if (!seen.includes(f.i)) seen.push(f.i);
    if (f.i === item.i) return seen.indexOf(f.i);
  }
  return -1;
}

function poseForCast(cast, item) {
  const idx = castParaIndex(cast.id, item);
  if (cast.id === 'brighid') return idx <= 0 ? 'intro' : 'investigate';
  if (cast.id === 'chane') return idx <= 0 ? 'intro' : 'charming';
  return cast.poses[0];
}

function showCastLayers(castId, pose) {
  const el = $('sprite');
  if (!el) return;
  el.querySelectorAll('.sprite-cast').forEach(node => {
    const on = node.dataset.cast === castId;
    node.hidden = !on;
    if (!on) return;
    node.querySelectorAll('.sprite-layer').forEach(layer => {
      layer.classList.toggle('is-on', layer.dataset.pose === pose);
    });
  });
  el.dataset.cast = castId;
  el.dataset.pose = pose;
  applyAccentFromSprite(castId, pose);
}

/** Pull a saturated accent from the visible sprite crop for name + frame. */
const accentCache = Object.create(null);
/** Target relative luminance so name/frame stay readable on the dark dock. */
const ACCENT_LUM_TARGET = 0.62;
const ACCENT_LUM_MIN = 0.52;
const ACCENT_LUM_MAX = 0.72;

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
}

function relativeLum(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hue2rgb(p, q, h + 1 / 3) * 255,
    g: hue2rgb(p, q, h) * 255,
    b: hue2rgb(p, q, h - 1 / 3) * 255,
  };
}

/** Keep sprite hue/sat; retarget luminance into a UI-safe band. */
function normalizeAccentLuminance(r, g, b) {
  const hsl = rgbToHsl(r, g, b);
  const sat = clamp(hsl.s * 1.12, 0.35, 0.85);
  let lo = ACCENT_LUM_MIN;
  let hi = ACCENT_LUM_MAX;
  let best = hslToRgb(hsl.h, sat, ACCENT_LUM_TARGET);
  let bestErr = Math.abs(relativeLum(best.r, best.g, best.b) - ACCENT_LUM_TARGET);
  for (let step = 0; step < 12; step++) {
    const mid = (lo + hi) / 2;
    const rgb = hslToRgb(hsl.h, sat, mid);
    const lum = relativeLum(rgb.r, rgb.g, rgb.b);
    const err = Math.abs(lum - ACCENT_LUM_TARGET);
    if (err < bestErr) {
      best = rgb;
      bestErr = err;
    }
    if (lum < ACCENT_LUM_TARGET) lo = mid;
    else hi = mid;
  }
  return {
    r: clamp(best.r, 0, 255),
    g: clamp(best.g, 0, 255),
    b: clamp(best.b, 0, 255),
  };
}

function sampleAccentFromImage(img) {
  const size = 48;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  try {
    ctx.drawImage(img, 0, 0, size, size);
  } catch (e) {
    return null;
  }
  const { data } = ctx.getImageData(0, 0, size, size);
  const buckets = Object.create(null);
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 180) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max < 45 || max > 250) continue;
    const sat = max === 0 ? 0 : (max - min) / max;
    if (sat < 0.22) continue;
    const lum = relativeLum(r, g, b);
    if (lum < 0.12 || lum > 0.9) continue;
    let h = 0;
    const d = max - min;
    if (d) {
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    const key = Math.round(h * 18);
    const weight = sat * (1 - Math.abs(lum - 0.45)) * (a / 255);
    const slot = buckets[key] || (buckets[key] = { r: 0, g: 0, b: 0, w: 0 });
    slot.r += r * weight;
    slot.g += g * weight;
    slot.b += b * weight;
    slot.w += weight;
  }
  let best = null;
  Object.keys(buckets).forEach(k => {
    const slot = buckets[k];
    if (!best || slot.w > best.w) best = slot;
  });
  if (!best || best.w <= 0) return null;
  const tuned = normalizeAccentLuminance(best.r / best.w, best.g / best.w, best.b / best.w);
  const hex = rgbToHex(tuned.r, tuned.g, tuned.b);
  const glow = `rgba(${Math.round(tuned.r)}, ${Math.round(tuned.g)}, ${Math.round(tuned.b)}, 0.38)`;
  return { hex, glow };
}

function clearFrameAccent() {
  const dock = $('dock');
  const phone = $('phone');
  if (dock) {
    dock.style.removeProperty('--frame-accent');
    dock.style.removeProperty('--frame-accent-glow');
  }
  if (phone) {
    phone.style.removeProperty('--frame-accent');
    phone.style.removeProperty('--frame-accent-glow');
  }
  if (window.TicketChoice && window.TicketChoice.retintStubs) {
    window.TicketChoice.retintStubs();
  }
}

function setFrameAccent(hex, glow) {
  const dock = $('dock');
  const phone = $('phone');
  if (dock) {
    dock.style.setProperty('--frame-accent', hex);
    dock.style.setProperty('--frame-accent-glow', glow);
  }
  /* Tickets share the same story/character rim as the audio dock. */
  if (phone) {
    phone.style.setProperty('--frame-accent', hex);
    phone.style.setProperty('--frame-accent-glow', glow);
  }
  if (window.TicketChoice && window.TicketChoice.retintStubs) {
    window.TicketChoice.retintStubs();
  }
}

function applyAccentFromSprite(castId, pose) {
  const key = `${castId}:${pose}:L${ACCENT_LUM_TARGET}`;
  if (accentCache[key]) {
    setFrameAccent(accentCache[key].hex, accentCache[key].glow);
    return;
  }
  const img = document.querySelector(`.sprite-cast[data-cast="${castId}"] .sprite-layer[data-pose="${pose}"]`);
  if (!img) return;
  const finish = () => {
    const sampled = sampleAccentFromImage(img);
    if (!sampled) return;
    accentCache[key] = sampled;
    if (S.stage.currentId === castId && S.stage.currentPose === pose) {
      setFrameAccent(sampled.hex, sampled.glow);
    }
  };
  if (img.complete && img.naturalWidth) finish();
  else img.addEventListener('load', finish, { once: true });
}

function clearSpriteAnim(el) {
  el.classList.remove('is-enter-left', 'is-enter-right', 'is-exit-left', 'is-exit-right');
}

function runSpriteAnim(el, className, ms) {
  const token = ++S.stage.animToken;
  clearSpriteAnim(el);
  // Force reflow so repeated same-side enters still animate.
  void el.offsetWidth;
  el.classList.add(className);
  return new Promise(resolve => {
    window.setTimeout(() => {
      if (token !== S.stage.animToken) return resolve(false);
      el.classList.remove(className);
      resolve(true);
    }, ms);
  });
}

async function exitCurrentSprite() {
  const el = $('sprite');
  if (!el || !S.stage.visible || !S.stage.currentId) {
    if (el) {
      el.dataset.visible = '0';
      el.setAttribute('aria-hidden', 'true');
    }
    S.stage.visible = false;
    S.stage.currentId = null;
    S.stage.currentPose = null;
    return;
  }
  const side = S.stage.sides[S.stage.currentId] || 'left';
  const ok = await runSpriteAnim(el, side === 'right' ? 'is-exit-right' : 'is-exit-left', SPRITE_EXIT_MS);
  if (!ok) return;
  el.dataset.visible = '0';
  el.setAttribute('aria-hidden', 'true');
  S.stage.visible = false;
  S.stage.currentId = null;
  S.stage.currentPose = null;
}

async function enterSprite(cast, pose) {
  const el = $('sprite');
  if (!el) return;
  const side = sideForCast(cast.id);
  showCastLayers(cast.id, pose);
  el.dataset.side = side;
  el.dataset.visible = '1';
  el.setAttribute('aria-hidden', 'false');
  S.stage.visible = true;
  S.stage.currentId = cast.id;
  S.stage.currentPose = pose;
  await runSpriteAnim(el, side === 'right' ? 'is-enter-right' : 'is-enter-left', SPRITE_ENTER_MS);
}

function crossfadePose(pose) {
  const el = $('sprite');
  if (!el || !S.stage.currentId) return;
  showCastLayers(S.stage.currentId, pose);
  S.stage.currentPose = pose;
}

async function updateSprite(item) {
  const req = ++S.stage.req;
  // Narrator keeps whoever is already on stage (no swipe).
  if (!item || isNarratorLine(item)) return;

  const cast = resolveCast(item);
  if (!cast) {
    // Speaker with no art — clear the stage if someone else was up.
    if (S.stage.visible) await exitCurrentSprite();
    return;
  }

  const pose = poseForCast(cast, item);
  if (S.stage.currentId === cast.id && S.stage.visible) {
    if (pose !== S.stage.currentPose) crossfadePose(pose);
    return;
  }

  if (S.stage.visible && S.stage.currentId && S.stage.currentId !== cast.id) {
    await exitCurrentSprite();
    if (req !== S.stage.req) return;
  }
  await enterSprite(cast, pose);
}

function setVoiceChrome(item) {
  const narr = isNarratorLine(item);
  const dock = $('dock');
  if (dock) {
    dock.classList.toggle('narrator', narr);
    dock.classList.toggle('character', !narr && !!item);
  }
  const speaker = $('speakerName');
  if (speaker) {
    // Narrator / app: no name plate — italic body + quiet frame.
    // Character: only show a name from the chapter data (Tales `CYE:` etc.), never invent one.
    if (!item || narr || !item.speaker) {
      speaker.textContent = '';
      speaker.hidden = true;
    } else {
      speaker.hidden = false;
      speaker.textContent = item.speaker;
    }
  }
  const main = $('mainLine');
  if (main) main.classList.toggle('narrator-line', narr);
  const sprite = $('sprite');
  if (sprite) sprite.dataset.voice = narr || !item ? 'narrator' : 'character';
  if (narr || !item) {
    clearFrameAccent();
  } else if (S.stage.currentId && S.stage.currentPose) {
    applyAccentFromSprite(S.stage.currentId, S.stage.currentPose);
  }
  updateSprite(item);
}

function render() {
  const idle = S.k < 0;
  const j = idle ? 0 : S.k;
  const main = $('mainLine');
  const item = S.flow[j];
  const t = audio.currentTime || 0;
  main.dataset.j = item ? String(j) : '';
  main.classList.toggle('appline', !!(item && item.app));
  main.classList.toggle('idle', idle && S.flow.length > 0);
  main.classList.toggle('empty', !S.flow.length);
  $('hint').hidden = !(idle && S.flow.length > 0);
  setVoiceChrome(item);
  if (!S.flow.length) {
    $('mainText').textContent = 'No narrated text in this chapter.';
    main.dataset.j = '';
    S.words = [];
    S.wordIdx = -1;
    setVoiceChrome(null);
  } else if (item) {
    renderWords(item, idle ? item.start - 0.01 : t);
  }
  main.scrollTop = 0;
  const n = S.hidden;
  $('hiddenNote').textContent = `${n} ${n === 1 ? 'line' : 'lines'} not in the audio. Unmatched paragraphs are left out of the reading view.`;
}

function autoScroll(t) {
  syncWord(t);
  const m = $('mainLine');
  if (S.k < 0 || audio.paused || m.scrollHeight <= m.clientHeight + 2 || Date.now() - S.userScrollAt < 4000) return;
  const now = m.querySelector('.w.now');
  if (now) now.scrollIntoView({ block: 'nearest' });
}

/* ---------- playback ---------- */

let seekDragging = false;
function updateUi(t) {
  const now = fmt(t);
  const end = fmt(dur());
  $('timeNow').textContent = now;
  $('timeEnd').textContent = end;
  $('timeStamp').textContent = `${now}/${end}`;
  const seek = $('seek');
  const total = dur() || 1;
  seek.max = total;
  if (!seekDragging) seek.value = t;
  const pct = clamp((t / total) * 100, 0, 100);
  seek.style.setProperty('--progress', `${pct}%`);
  const playing = !audio.paused && !audio.ended;
  $('playText').textContent = playing ? 'Pause' : 'Play';
  const glyph = $('playIcon');
  glyph.classList.toggle('is-pause', playing);
  glyph.classList.toggle('is-play', !playing);
  glyph.textContent = '';
  $('playBtn').setAttribute('aria-label', playing ? 'Pause' : 'Play');
}

function refresh() {
  if (!S.chapter) return;
  const t = audio.currentTime || 0;
  const k = locate(t);
  if (k !== S.k) { S.k = k; render(); }
  updateUi(t);
  autoScroll(t);
}

function startPlay() {
  const p = audio.play();
  if (p && p.catch) p.catch(() => {});
}

function playFlow(j) {
  const item = S.flow[j];
  if (!item) return;
  S.pin = j;
  S.pinFrom = Math.max(0, item.start - LEAD_S);
  audio.currentTime = S.pinFrom;
  startPlay();
  refresh();
}

let raf = 0;
function loop() {
  refresh();
  raf = audio.paused ? 0 : requestAnimationFrame(loop);
}
audio.addEventListener('play', () => { if (!raf) raf = requestAnimationFrame(loop); refresh(); });
['pause', 'ended', 'seeked', 'timeupdate', 'loadedmetadata', 'durationchange'].forEach(ev => audio.addEventListener(ev, refresh));

$('playBtn').addEventListener('click', () => {
  if (audio.paused) startPlay(); else audio.pause();
  refresh();
});

const seekEl = $('seek');
seekEl.addEventListener('pointerdown', () => { seekDragging = true; });
window.addEventListener('pointerup', () => { seekDragging = false; });
seekEl.addEventListener('input', () => { S.pin = -1; audio.currentTime = +seekEl.value; refresh(); });

function setSpeed(v) {
  audio.defaultPlaybackRate = v;
  audio.playbackRate = v;
  $('speedSeg').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.speed === v)));
  const label = Number.isInteger(v) ? `${v}x` : `${v}x`;
  $('speedLabel').textContent = label;
  savePrefs();
}
function setSpeedOpen(open) {
  $('speedSeg').hidden = !open;
  $('speedToggle').setAttribute('aria-expanded', String(open));
}
$('speedToggle').addEventListener('click', () => {
  setSpeedOpen($('speedSeg').hidden);
});
$('speedSeg').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  setSpeed(+b.dataset.speed);
  setSpeedOpen(false);
});

const textFrame = $('textFrame');
textFrame.addEventListener('click', e => {
  const el = e.target.closest('.line');
  if (el && el.dataset.j !== '') playFlow(+el.dataset.j);
});
textFrame.addEventListener('keydown', e => {
  const el = e.target.closest('.line');
  if (el && (e.key === 'Enter' || e.key === ' ') && el.dataset.j !== '') { e.preventDefault(); playFlow(+el.dataset.j); }
});
['touchstart', 'wheel', 'pointerdown'].forEach(ev => $('mainLine').addEventListener(ev, () => { S.userScrollAt = Date.now(); }, { passive: true }));

/* ---------- place background ---------- */

function setPlaceBg(url) {
  const place = $('placeBg');
  const img = $('placeBgImg');
  const mine = ++S.imgToken;
  img.onload = () => { if (mine === S.imgToken) place.dataset.state = 'ok'; };
  img.onerror = () => { if (mine === S.imgToken) place.dataset.state = 'none'; };
  if (!url) {
    img.removeAttribute('src');
    place.dataset.state = 'none';
    return;
  }
  place.dataset.state = 'loading';
  img.src = url;
}

/* ---------- loading ---------- */

function fillChapterSelect(storyId, order) {
  const sel = $('chapterSel');
  if (!sel) return;
  sel.textContent = '';
  const st = story(storyId);
  if (!st) return;
  st.chapters.forEach(c => {
    const o = document.createElement('option');
    o.value = String(c.order);
    o.textContent = `${c.order}. ${c.name}`;
    if (c.order === order) o.selected = true;
    sel.appendChild(o);
  });
}

function setHeader(st, meta) {
  const product = $('productSel');
  if (product) product.value = st.id;
  fillChapterSelect(st.id, meta.order);
  const legacy = $('storySel');
  if (legacy) legacy.value = st.id;
}

async function loadChapter(storyId, order) {
  const mine = ++S.token;
  const st = story(storyId) || S.index.stories[0];
  const meta = st.chapters.find(c => c.order === order) || st.chapters[0];
  S.storyId = st.id;
  S.order = meta.order;
  S.sheetStory = st.id;
  audio.pause();
  S.pin = -1;
  setHeader(st, meta);
  let data;
  try {
    const res = await fetch(dataUrl(meta.file));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    if (mine !== S.token) return;
    S.chapter = null;
    $('mainText').textContent = `Could not load the chapter: ${err.message}`;
    return;
  }
  if (mine !== S.token) return;
  S.chapter = data;
  audio.src = data.audio;
  buildFlow();
  S.k = -2;
  resetStage();
  hideChoices(true);
  setPlaceBg(data.image);
  refresh();
  try { history.replaceState(null, '', `#${S.storyId}/${S.order}`); } catch (e) { /* history unavailable */ }
  savePrefs();
}

/* ---------- choices (debug → end of chapter; left-rail player replies) ---------- */

function setChoicesOpen(open) {
  S.choicesOpen = open;
  const phone = $('phone');
  if (phone) phone.classList.toggle('choices-open', open);
}

function hideChoices(clearThread) {
  setChoicesOpen(false);
  const choices = $('choices');
  const rail = $('choiceRail');
  const thread = $('choiceThread');
  if (choices) {
    choices.classList.remove('is-on');
    choices.hidden = true;
    choices.textContent = '';
  }
  if (clearThread && thread) thread.textContent = '';
  if (rail) {
    const hasMsgs = !!(thread && thread.childElementCount);
    rail.hidden = !hasMsgs;
  }
}

/** Destination title on the ticket body — same as TicketChoiceButton title. */
const VERB_CONTINUE = 'Continue';
const VERB_NAVIGATE = 'Navigate';

function tidyChoiceLabel(label) {
  return String(label || '')
    .replace(/^\s*\[\d+\]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function destinationTitle(nameOrLabel) {
  let t = tidyChoiceLabel(nameOrLabel);
  const afterColon = t.match(/:\s*(.+)$/);
  if (afterColon) t = afterColon[1].trim();
  return t.replace(/\s*\(Interactive[^)]*\)\s*$/i, '').trim();
}

/** Parse Tales lane / episode step from the chapter’s real name — no invented copy. */
function chapterStep(name) {
  const m = String(name || '').match(/\[(\d+)\]/);
  return m ? Number(m[1]) : null;
}

function chapterLane(name) {
  const n = String(name || '');
  if (/Loc\s*2/i.test(n) || /transit station/i.test(n)) return 'loc2';
  if (/Loc\s*3/i.test(n) || /trashcan/i.test(n)) return 'loc3';
  if (/Loc\s*4/i.test(n)) return 'loc4';
  if (/Loc\s*1|Ep1|Cafe/i.test(n)) return 'loc1';
  return 'other';
}

function isInteractiveChapter(name) {
  return /\(Interactive/i.test(String(name || ''));
}

function optionFromChapter(c, label, mode) {
  const title = destinationTitle(label || c.name);
  const actionMode = mode === 'navigate' ? 'navigate' : 'proceed';
  const verb = actionMode === 'navigate' ? VERB_NAVIGATE : VERB_CONTINUE;
  return {
    id: `ch-${c.order}`,
    order: c.order,
    title,
    verb,
    mode: actionMode,
    // Thread / a11y: verb is the button label; title is the destination above it.
    label: actionMode === 'navigate' ? `*${verb}*` : verb,
  };
}

/** Mode labels taken only from this chapter’s paragraph text (short mode name only). */
function modeLabelsFromChapter() {
  const labels = { narrative: null, interactive: null, location: null, stepCount: null };
  const paras = (S.chapter && S.chapter.paragraphs) || [];
  paras.forEach(p => {
    const t = String(p.text || '');
    if (!labels.narrative && /\bNarrative Mode\b/i.test(t)) labels.narrative = 'Narrative Mode';
    if (!labels.interactive && /\bInteractive Mode\b/i.test(t)) labels.interactive = 'Interactive Mode';
    if (!labels.location && /\bLocation Mode\b/i.test(t)) labels.location = 'Location Mode';
    if (!labels.stepCount && /\bStep Count Mode\b/i.test(t)) labels.stepCount = 'Step Count Mode';
  });
  return labels;
}

/**
 * Section choices: real next chapters for this lane / step, plus mode forks
 * when this chapter’s script names them. Labels are chapter names or script lines.
 */
function sectionChoiceOptions() {
  const st = story(S.storyId);
  if (!st) return [];
  const cur = st.chapters.find(c => c.order === S.order);
  if (!cur) return [];

  const lane = chapterLane(cur.name);
  const step = chapterStep(cur.name);
  const later = st.chapters.filter(c => c.order > S.order).sort((a, b) => a.order - b.order);
  const sameLane = later.filter(c => chapterLane(c.name) === lane);
  const options = [];
  const seen = new Set();

  const push = (c, label, mode) => {
    if (!c || seen.has(c.order)) return;
    seen.add(c.order);
    options.push(optionFromChapter(c, label, mode));
  };

  const modes = modeLabelsFromChapter();
  const hasModeFork = !!(modes.narrative && modes.interactive);

  if (hasModeFork) {
    const interactiveNext = sameLane.find(c => isInteractiveChapter(c.name));
    const narrativeNext = sameLane.find(c => !isInteractiveChapter(c.name));
    if (narrativeNext) push(narrativeNext, modes.narrative, 'proceed');
    if (interactiveNext) push(interactiveNext, modes.interactive, 'proceed');
  }

  // Continue this storyline: next chapter in the same lane.
  if (!hasModeFork && sameLane[0]) push(sameLane[0], sameLane[0].name, 'proceed');

  // Parallel section at the next episode step (other locations) — Navigate.
  if (step != null) {
    later
      .filter(c => chapterStep(c.name) === step + 1 && chapterLane(c.name) !== lane)
      .forEach(c => push(c, c.name, 'navigate'));
  }

  // Fallback: immediate next index chapter only.
  if (!options.length && later[0]) push(later[0], later[0].name, 'proceed');

  return options;
}

function showChoices(options) {
  const rail = $('choiceRail');
  const choices = $('choices');
  if (!rail || !choices) return;
  if (!options.length) {
    hideChoices(false);
    return;
  }
  rail.hidden = false;
  choices.textContent = '';
  const makeTicket = window.TicketChoice && window.TicketChoice.create;
  options.forEach((opt, i) => {
    if (!makeTicket) return;
    const stubCue =
      (window.TicketChoice && window.TicketChoice.resolveStubCue
        ? window.TicketChoice.resolveStubCue(opt.mode)
        : opt.mode === 'navigate' ? 'navigation' : 'narrative');
    const ticket = makeTicket({
      title: opt.title || opt.verb,
      verb: opt.verb,
      mode: opt.mode,
      stubCue,
      choiceIndex: i,
      onPress: () => submitChoice(opt),
    });
    ticket.style.animationDelay = `${i * 0.05}s`;
    ticket.dataset.id = opt.id;
    choices.appendChild(ticket);
  });
  choices.hidden = false;
  choices.classList.add('is-on');
  setChoicesOpen(true);
  /* Frost canvas samples scene after layout/shift settles. */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (window.TicketChoice && window.TicketChoice.repaintFrost) {
        window.TicketChoice.repaintFrost();
      }
    });
  });
}

function submitChoice(opt) {
  const thread = $('choiceThread');
  if (thread) {
    const msg = document.createElement('div');
    msg.className = 'choice-msg';
    msg.textContent = opt.title ? `${opt.label} · ${opt.title}` : opt.label;
    thread.appendChild(msg);
    msg.scrollIntoView({ block: 'nearest' });
  }
  hideChoices(false);
  const rail = $('choiceRail');
  if (rail) rail.hidden = false;
  if (opt.order != null) loadChapter(S.storyId, opt.order);
}

function offerSectionChoices() {
  const next = sectionChoiceOptions();
  if (!next.length) {
    hideChoices(false);
    return false;
  }
  showChoices(next);
  return true;
}

/** Debug: scrub to end of audio and offer section → next-chapter choices. */
function debugJumpToChoices() {
  if (!S.chapter) return;
  audio.pause();
  const end = dur() || (S.flow.length ? S.flow[S.flow.length - 1].end : 0);
  const t = Math.max(0, end - 0.35);
  try { audio.currentTime = t; } catch (e) { /* seek unavailable */ }
  if (S.flow.length) {
    S.pin = -1;
    S.k = S.flow.length - 1;
    render();
  }
  updateUi(t);
  if (!offerSectionChoices()) {
    $('mainText').textContent = 'No connected chapter from this section.';
  }
}

$('debugChoices').addEventListener('click', debugJumpToChoices);

audio.addEventListener('ended', () => {
  if (S.choicesOpen) return;
  offerSectionChoices();
});

function parseHash() {
  const [s, o] = location.hash.slice(1).split('/');
  const st = story(s);
  if (!st) return null;
  const order = Number(o);
  return { story: st.id, order: st.chapters.some(c => c.order === order) ? order : st.chapters[0].order };
}

window.addEventListener('hashchange', () => {
  const h = parseHash();
  if (h && (h.story !== S.storyId || h.order !== S.order)) loadChapter(h.story, h.order);
});

/* ---------- sheet ---------- */

function chapterMeta(c) {
  const u = c.unmatched[modelKey()];
  let s = `${c.paragraphs} paragraphs`;
  if (u) s += ` · ${u} unmatched`;
  if (c.differ) s += ` · ${c.differ} differ`;
  return s;
}

function buildChapterList() {
  const list = $('chapterList');
  list.textContent = '';
  story(S.sheetStory).chapters.forEach(c => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.order = c.order;
    const current = S.sheetStory === S.storyId && c.order === S.order;
    if (current) b.setAttribute('aria-current', 'true');
    const nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = `${c.order}. ${c.name}`;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = chapterMeta(c);
    b.append(nm, meta);
    li.appendChild(b);
    list.appendChild(li);
  });
}

function openSheet() {
  S.sheetStory = S.storyId;
  $('storySel').value = S.storyId;
  buildChapterList();
  $('sheet').hidden = false;
  const cur = $('chapterList').querySelector('[aria-current="true"]');
  if (cur) cur.scrollIntoView({ block: 'center' });
  $('sheetClose').focus();
}

function closeSheet() {
  $('sheet').hidden = true;
  $('pickBtn').focus();
}

function setModel(key) {
  S.model = key === 'large' ? 'large' : 'small';
  $('modelSmall').setAttribute('aria-pressed', String(S.model === 'small'));
  $('modelLarge').setAttribute('aria-pressed', String(S.model === 'large'));
  if (S.chapter) { S.pin = -1; buildFlow(); S.k = -2; refresh(); }
  if (!$('sheet').hidden) buildChapterList();
  savePrefs();
}

$('pickBtn').addEventListener('click', openSheet);
$('sheetClose').addEventListener('click', closeSheet);
$('sheetBg').addEventListener('click', closeSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('sheet').hidden) closeSheet(); });
$('modelSmall').addEventListener('click', () => setModel('small'));
$('modelLarge').addEventListener('click', () => setModel('large'));
$('productSel').addEventListener('change', e => {
  const st = story(e.target.value);
  if (!st) return;
  loadChapter(st.id, st.chapters[0].order);
});
$('chapterSel').addEventListener('change', e => {
  loadChapter(S.storyId || $('productSel').value, +e.target.value);
});
$('desktopLink').addEventListener('click', e => {
  e.currentTarget.href = `${DATA_ROOT}index.html${location.hash}`;
});

/* ---------- start ---------- */

async function init() {
  preloadSprites();
  const res = await fetch(dataUrl('data/index.json'));
  S.index = await res.json();
  const product = $('productSel');
  const legacy = $('storySel');
  S.index.stories.forEach(s => {
    const o = document.createElement('option');
    o.value = s.id;
    o.textContent = s.title;
    product.appendChild(o);
    if (legacy) legacy.appendChild(o.cloneNode(true));
  });
  setModel(prefs.model);
  setSpeed(SPEEDS.includes(prefs.speed) ? prefs.speed : 1);
  const h = parseHash();
  const tales = story(DEFAULT_STORY);
  const defaultStart = {
    story: tales ? tales.id : S.index.stories[0].id,
    order: tales && tales.chapters.some(c => c.order === DEFAULT_ORDER)
      ? DEFAULT_ORDER
      : (tales || S.index.stories[0]).chapters[0].order,
  };
  // Brighid Loc 3-1c + stage sides; hash still wins. Speed/model stay in prefs.
  const start = h || defaultStart;
  await loadChapter(start.story, start.order);
}

init().catch(err => { $('mainText').textContent = `Could not start: ${err.message}`; });
})();
