import { STORIES } from './stories.js';

const BALANCE_MAX_LINES = 6;
const MIN_EVEN_RATIO = 0.6;
const MIN_FIT_FRACTION = 0.5;
const FIT_STEP_PX = 6;
const TICKET_STOCK = ['#C5D1E2', '#E3D1BC', '#C1D5D0'];
const SERIAL_BASE = 214;
const SERIAL_STEP = 97;
const CHOICE_HEADER = 'Where to next?';
const AUDIO_BUTTON_TEXT = 'Tap To Play Audio';
const END_LABEL = 'The End';
const LAYOUTS = [
  { key: 'page', name: 'Full page' },
  { key: 'window', name: 'Text window' },
  { key: 'over', name: 'Over picture' },
];
const CAST_VERSIONS = [
  { key: 'a', name: 'Names above' },
  { key: 'b', name: 'Profile circles' },
  { key: 'c', name: 'Colour-coded' },
  { key: 'd', name: 'Quote line' },
  { key: 'e', name: 'Back and forth' },
];
// The app's map-choice colours (theme.ts muted slate / amber / teal), lifted for a dark screen, plus amethyst.
const CHARACTER_COLOURS = ['#5B86C9', '#C98A3E', '#4E9C86', '#9B6BD6'];
// Narrated reader's timing when there's no audio to follow: 0.75 s per line + 0.36 s per word.
const LINE_BASE_SECS = 0.75;
const SECS_PER_WORD = 0.36;
const TICK_MS = 100;
const AUDIO_START_TIMEOUT_MS = 3000;
const FOLLOW_SLACK_PX = 120;
const OWN_SCROLL_MS = 700;
const SVG_NS = 'http://www.w3.org/2000/svg';

const $ = (id) => document.getElementById(id);
const phone = $('phone');
// Kept as a reference: the Text window layout moves it inside the story text, which each chapter clears.
const NEXT_CHAPTERS = $('nextChapters');

const params = new URLSearchParams(location.search);
const FAST = Math.max(0, +params.get('fast') || 0);   // hidden: fake audio at N× for headless tests
const state = {
  story: clamp((parseInt(params.get('s'), 10) || 1) - 1, 0, STORIES.length - 1),
  chapter: 0,
  cast: CAST_VERSIONS.some((v) => v.key === params.get('ch')) ? params.get('ch') : 'a',
  layout: LAYOUTS.some((v) => v.key === params.get('lay')) ? params.get('lay') : 'page',
};
state.chapter = clamp((parseInt(params.get('c'), 10) || 1) - 1, 0, STORIES[state.story].chapters.length - 1);

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

// ---------- icons copied from webview/reader/Injected*Icon.js ----------
function svgEl(w, h, paths, cls) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('fill', 'none');
  for (const p of paths) {
    const path = document.createElementNS(SVG_NS, 'path');
    for (const [k, v] of Object.entries(p)) path.setAttribute(k, v);
    svg.appendChild(path);
  }
  svg.classList.add(cls);
  return svg;
}
const AUDIO_FILL = '#B9E5FF';
const audioIcon = () => svgEl(42, 34, [
  { d: 'M21.1994 16.9999C21.1994 20.9843 21.1994 24.8358 21.1994 28.8202C21.1994 29.0858 21.1994 29.3515 21.1994 29.6171C21.0669 30.1483 20.6694 30.414 20.1395 30.2812C19.8745 30.2812 19.742 30.1483 19.477 30.0155C16.4297 28.5546 13.3824 26.9608 10.4675 25.4999C9.01012 24.8358 8.34766 23.6405 8.34766 22.1796C8.34766 18.8593 8.34766 15.4062 8.34766 12.0858C8.34766 10.4921 9.01012 9.4296 10.4675 8.76553C13.5148 7.3046 16.4297 5.84366 19.477 4.24991C19.6095 4.1171 19.8745 3.98428 20.1395 3.85147C20.6694 3.71866 21.0669 3.98428 21.1994 4.51553C21.1994 4.78116 21.1994 5.04678 21.1994 5.31241C21.1994 9.16397 21.1994 13.1483 21.1994 16.9999Z', fill: AUDIO_FILL },
  { d: 'M38.1575 17.3985C38.1575 12.3516 36.7001 8.23443 33.9178 4.51568C33.5203 3.98443 33.1228 3.45318 32.7254 2.92193C32.3279 2.39068 32.4604 2.12505 32.8579 1.5938C33.2553 1.19536 33.6528 0.664115 34.1828 0.265677C34.5803 -0.132761 34.9777 -0.265573 35.3752 0.265677C36.1702 1.06255 36.8326 1.85943 37.4951 2.78911C39.8799 6.10943 41.3374 9.82818 41.8673 13.9454C42.3973 18.1954 41.8673 22.3126 40.2774 26.1641C39.2175 28.6876 37.7601 31.0782 35.9052 33.0704C35.7727 33.336 35.5077 33.4688 35.2427 33.7344C34.8452 34 34.4478 34 34.1828 33.7344C33.6528 33.2032 33.1228 32.8047 32.7254 32.2735C32.3279 31.8751 32.3279 31.6094 32.5929 31.211C32.7254 30.9454 32.9904 30.6797 33.1228 30.5469C35.9052 27.3594 37.4951 23.7735 38.0251 19.6563C38.1576 18.7266 38.1575 17.7969 38.1575 17.3985Z', fill: AUDIO_FILL },
  { d: 'M0 17C0 15.2734 0 13.4141 0 11.6875C0 10.4922 0.794953 9.69531 1.98738 9.69531C2.78233 9.69531 3.57729 9.69531 4.23975 9.69531C5.29968 9.69531 6.09464 10.4922 6.09464 11.5547C6.09464 15.1406 6.09464 18.7266 6.09464 22.4453C6.09464 23.5078 5.29968 24.3047 4.23975 24.3047C3.44479 24.3047 2.64984 24.3047 1.85489 24.3047C0.794953 24.3047 0 23.5078 0 22.4453C0 20.5859 0 18.8594 0 17Z', fill: AUDIO_FILL },
  { d: 'M32.8572 16.7344C32.8572 19.5234 32.3272 21.9141 31.1348 24.0391C30.6048 25.1016 29.8098 26.0312 29.1474 26.9609C29.0149 27.0937 28.8824 27.2266 28.7499 27.3594C28.4849 27.625 28.0874 27.625 27.8225 27.3594C27.16 26.8281 26.63 26.1641 25.9676 25.6328C25.7026 25.3672 25.7026 25.1016 25.8351 24.8359C25.9676 24.5703 26.1001 24.4375 26.2325 24.1719C28.0874 21.9141 28.8824 19.2578 28.7499 16.3359C28.6174 13.9453 27.69 11.6875 26.2325 9.82813C26.1001 9.69531 25.9676 9.5625 25.9676 9.42969C25.7026 9.03125 25.8351 8.76563 26.1001 8.5C26.63 7.96875 27.16 7.4375 27.69 6.90625C27.9549 6.64063 28.4849 6.64063 28.7499 6.90625C29.2799 7.30469 29.6773 7.83594 30.0748 8.36719C31.3997 10.3594 32.3272 12.4844 32.5922 14.7422C32.7247 15.5391 32.7247 16.3359 32.8572 16.7344Z', fill: AUDIO_FILL },
], 'audio-icon');
const infoIcon = () => svgEl(16, 16, [{ 'fill-rule': 'evenodd', 'clip-rule': 'evenodd', fill: '#fff', d: 'M15.7345 8.26603C15.7345 12.4082 12.3766 15.7661 8.23441 15.7661C4.09226 15.7661 0.734375 12.4082 0.734375 8.26603C0.734375 4.12388 4.09226 0.765991 8.23441 0.765991C12.3766 0.765991 15.7345 4.12388 15.7345 8.26603ZM9.22905 5.07378C9.22905 5.64036 8.78368 6.09966 8.23428 6.09966C7.68488 6.09966 7.2395 5.64036 7.2395 5.07378C7.2395 4.5072 7.68488 4.04789 8.23428 4.04789C8.78368 4.04789 9.22905 4.5072 9.22905 5.07378ZM8.2343 7.81019C7.6849 7.81019 7.23953 8.25556 7.23953 8.80496V12.1202C7.23953 12.6696 7.6849 13.115 8.2343 13.115C8.7837 13.115 9.22908 12.6696 9.22908 12.1202V8.80496C9.22908 8.25556 8.7837 7.81019 8.2343 7.81019Z' }], 'link-image');
const linkIcon = () => svgEl(18, 10, [{ fill: '#fff', d: 'M2.48446 4.99217C2.48446 3.56717 3.64279 2.40883 5.06779 2.40883H7.60946C8.04668 2.40883 8.40112 2.05439 8.40112 1.61717V1.61717C8.40112 1.17994 8.04668 0.8255 7.60946 0.8255H5.06779C2.76779 0.8255 0.901123 2.69217 0.901123 4.99217C0.901123 7.29217 2.76779 9.15883 5.06779 9.15883H7.60946C8.04668 9.15883 8.40112 8.80439 8.40112 8.36717V8.36717C8.40112 7.92994 8.04668 7.5755 7.60946 7.5755H5.06779C3.64279 7.5755 2.48446 6.41717 2.48446 4.99217ZM5.90112 4.99217C5.90112 5.4524 6.27422 5.8255 6.73446 5.8255H11.7345C12.1947 5.8255 12.5678 5.4524 12.5678 4.99217V4.99217C12.5678 4.53193 12.1947 4.15883 11.7345 4.15883H6.73446C6.27422 4.15883 5.90112 4.53193 5.90112 4.99217V4.99217ZM13.4011 0.8255H10.8595C10.4222 0.8255 10.0678 1.17994 10.0678 1.61717V1.61717C10.0678 2.05439 10.4222 2.40883 10.8595 2.40883H13.4011C14.8261 2.40883 15.9845 3.56717 15.9845 4.99217C15.9845 6.41717 14.8261 7.5755 13.4011 7.5755H10.8595C10.4222 7.5755 10.0678 7.92994 10.0678 8.36717V8.36717C10.0678 8.80439 10.4222 9.15883 10.8595 9.15883H13.4011C15.7011 9.15883 17.5678 7.29217 17.5678 4.99217C17.5678 2.69217 15.7011 0.8255 13.4011 0.8255Z' }], 'link-image');

// ---------- the app's WebView injection, minus the native bridge ----------
function injectLikeApp(root) {
  root.querySelectorAll('audio').forEach((audio) => {
    const content = document.createElement('div');
    content.classList.add('button-content');
    const label = document.createElement('h1');
    label.classList.add('audio-text');
    label.innerText = AUDIO_BUTTON_TEXT;
    content.append(audioIcon(), label);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('audio-button');
    btn.append(content);
    btn.addEventListener('click', togglePlayback);
    audio.controls = false;
    audio.hidden = true;
    audio.parentNode.insertBefore(btn, audio);
  });
  root.querySelectorAll('span[info]').forEach((el) => {
    el.classList.add('link-wrapper');
    el.removeAttribute('src');
    el.appendChild(infoIcon());
  });
  root.querySelectorAll('a').forEach((el) => {
    el.classList.add('link-wrapper');
    el.appendChild(linkIcon());
    el.setAttribute('target', '_blank');
    el.addEventListener('click', (e) => e.preventDefault());
  });
  root.querySelectorAll('img').forEach((img) => { img.loading = 'lazy'; });
  root.querySelectorAll('button:not(.audio-button)').forEach((b) => {
    b.parentNode.insertBefore(document.createTextNode(b.textContent), b);
    b.style.display = 'none';
  });
}

// ---------- the new style ----------
const isSpace = (ch) => ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r' || ch === ' ';
const isBreakable = (ch) => ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r';

function textSegments(el) {
  const segments = [[]];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(n) {
      if (n.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
      if (n.namespaceURI === SVG_NS || n.hidden) return NodeFilter.FILTER_REJECT;
      if (n.tagName === 'BR') return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    },
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeType === Node.ELEMENT_NODE) segments.push([]);
    else segments[segments.length - 1].push(n);
  }
  return segments;
}

// Glue the last two words of each run of text together with a no-break space,
// deleting any other breakable spaces in that gap so the line can't split there.
function joinLastTwoWords(nodes) {
  let phase = 'trailing';
  for (let ni = nodes.length - 1; ni >= 0; ni--) {
    const node = nodes[ni];
    const chars = node.data.split('');
    let changed = false;
    for (let i = chars.length - 1; i >= 0; i--) {
      const ch = chars[i];
      if (phase === 'trailing') { if (!isSpace(ch)) phase = 'lastWord'; continue; }
      if (phase === 'lastWord') {
        if (isSpace(ch)) {
          phase = 'gap';
          if (isBreakable(ch)) { chars[i] = ' '; changed = true; }
        }
        continue;
      }
      if (phase === 'gap') {
        if (isSpace(ch)) { if (isBreakable(ch)) { chars[i] = ''; changed = true; } continue; }
        if (changed) node.data = chars.join('');
        return;
      }
    }
    if (changed) node.data = chars.join('');
  }
}

function lineWidths(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const lines = [];
  for (const r of range.getClientRects()) {
    if (r.width === 0) continue;
    const line = lines.find((l) => Math.abs(l.top - r.top) < r.height / 2);
    if (line) { line.left = Math.min(line.left, r.left); line.right = Math.max(line.right, r.right); }
    else lines.push({ top: r.top, left: r.left, right: r.right });
  }
  return lines.map((l) => l.right - l.left);
}

const lineCount = (el) => lineWidths(el).length;

const evenness = (widths) => Math.min(...widths) / Math.max(...widths);

// text-wrap: balance is skipped by some engines (e.g. around inline pills); try
// narrower widths with the same line count and keep the most even one.
function evenOut(el) {
  const widths = lineWidths(el);
  if (widths.length < 2 || widths.length > BALANCE_MAX_LINES) return;
  let best = { ratio: evenness(widths), width: null };
  if (best.ratio >= MIN_EVEN_RATIO) return;
  const full = el.getBoundingClientRect().width;
  for (let w = full - FIT_STEP_PX; w >= full * MIN_FIT_FRACTION; w -= FIT_STEP_PX) {
    el.style.maxWidth = `${w}px`;
    const now = lineWidths(el);
    if (now.length !== widths.length) continue;
    const ratio = evenness(now);
    if (ratio > best.ratio) best = { ratio, width: w };
  }
  el.style.maxWidth = best.width ? `${best.width}px` : '';
}

// Balanced text in a bubble leaves a gap on the right; shrink each bubble to its widest line.
function fitBubble(b) {
  b.style.width = '';
  const widths = lineWidths(b);
  if (widths.length < 2) return;
  const cs = getComputedStyle(b);
  b.style.width = `${Math.ceil(Math.max(...widths) + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + 2)}px`;
}

function applyNewStyle(blocks) {
  for (const el of blocks) for (const seg of textSegments(el)) joinLastTwoWords(seg);
  for (const el of blocks) if (lineCount(el) <= BALANCE_MAX_LINES) el.classList.add('bal');
  for (const el of blocks) if (el.classList.contains('bal')) evenOut(el);
}

// ---------- rendering ----------
function renderControls() {
  const seg = $('storySeg');
  seg.innerHTML = '';
  STORIES.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = `${i + 1} ${s.short}`;
    b.title = `${s.title} (${s.kind.toLowerCase()})`;
    b.setAttribute('aria-label', `Story ${i + 1}: ${s.title}`);
    b.setAttribute('aria-pressed', String(i === state.story));
    b.addEventListener('click', () => { state.story = i; state.chapter = 0; render(true); });
    seg.appendChild(b);
  });
  const laySeg = $('laySeg');
  laySeg.innerHTML = '';
  LAYOUTS.forEach((v) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = v.name;
    b.setAttribute('aria-pressed', String(v.key === state.layout));
    b.addEventListener('click', () => { state.layout = v.key; render(true); });
    laySeg.appendChild(b);
  });
  const hasCast = storyCast(STORIES[state.story]).length > 0;
  $('castRow').hidden = !hasCast;
  const castSeg = $('castSeg');
  castSeg.innerHTML = '';
  CAST_VERSIONS.forEach((v) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = v.key.toUpperCase();
    b.title = v.name;
    b.setAttribute('aria-label', `${v.key.toUpperCase()}: ${v.name}`);
    b.setAttribute('aria-pressed', String(v.key === state.cast));
    b.addEventListener('click', () => { state.cast = v.key; render(false); });
    castSeg.appendChild(b);
  });
  $('castName').textContent = CAST_VERSIONS.find((v) => v.key === state.cast).name;
  const total = STORIES[state.story].chapters.length;
  $('count').textContent = `${state.chapter + 1}/${total}`;
  $('prev').disabled = state.chapter === 0;
  $('next').disabled = state.chapter === total - 1;
}

function ticket(label, index, onPress) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ticket';
  btn.style.setProperty('--stock', TICKET_STOCK[index % TICKET_STOCK.length]);
  const serial = String(SERIAL_BASE + SERIAL_STEP * index).padStart(4, '0');
  btn.innerHTML = `
    <span class="ticket-body"><span class="ticket-title"></span></span>
    <span class="ticket-stub"><span class="ticket-serial">Nº${serial}</span>
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="rgba(44,44,44,.75)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>`;
  btn.querySelector('.ticket-title').textContent = label.trim();
  btn.addEventListener('click', onPress);
  return btn;
}

function render(scrollTop) {
  stopPlayback();
  const story = STORIES[state.story];
  const ch = story.chapters[state.chapter];
  $('navTitle').textContent = story.title;

  phone.classList.remove(...LAYOUTS.map((v) => `lay-${v.key}`));
  phone.classList.add(`lay-${state.layout}`);
  const featured = $('featured');
  featured.innerHTML = '';
  if (ch.img) {
    const img = document.createElement('img');
    img.src = ch.img;
    img.alt = '';
    featured.appendChild(img);
  }
  const capBox = document.createElement('div');
  capBox.className = 'cap-box';
  capBox.setAttribute('aria-live', 'polite');
  featured.appendChild(capBox);
  const web = $('webview');
  web.innerHTML = '';
  if (ch.audio) web.appendChild(document.createElement('audio'));
  const narration = document.createElement('div');
  narration.className = 'narration';
  let lastSpeaker = null;
  const cast = storyCast(story);
  const chapterSpeakers = [...new Set(ch.lines.filter((l) => l.name).map((l) => l.name))];
  const seen = new Set();
  phone.classList.remove(...CAST_VERSIONS.map((v) => `cv-${v.key}`));
  phone.classList.add(`cv-${state.cast}`);
  for (const line of ch.lines) {
    const d = document.createElement('div');
    if (line.who === 'narrator') {
      d.className = 'narr';
      d.innerHTML = line.html;
      lastSpeaker = null;
    } else {
      d.className = 'say';
      d.style.setProperty('--c', CHARACTER_COLOURS[cast.indexOf(line.name) % CHARACTER_COLOURS.length]);
      const newRun = line.name !== lastSpeaker;
      const firstTime = !seen.has(line.name);
      seen.add(line.name);
      if (!newRun) d.classList.add('cont');
      if (chapterSpeakers.indexOf(line.name) === 1) d.classList.add('right');
      const showName = state.cast === 'a' ? newRun : firstTime;
      if (showName && state.cast !== 'b') {
        const who = document.createElement('div');
        who.className = 'who';
        who.textContent = line.name;
        d.appendChild(who);
      }
      const avatar = document.createElement('span');
      avatar.className = 'avatar';
      avatar.textContent = line.name.charAt(0);
      avatar.title = line.name;
      avatar.setAttribute('aria-label', line.name);
      d.appendChild(avatar);
      const bub = document.createElement('div');
      bub.className = 'bub';
      bub.innerHTML = line.html;
      d.appendChild(bub);
      lastSpeaker = line.name;
    }
    d.hidden = true;
    narration.appendChild(d);
  }
  web.appendChild(narration);
  injectLikeApp(web);

  const nc = NEXT_CHAPTERS;
  nc.innerHTML = '';
  nc.hidden = true;
  const isLast = state.chapter === story.chapters.length - 1;
  const header = document.createElement('h2');
  header.className = 'nc-header';
  header.textContent = ch.options.length ? (ch.prompt || CHOICE_HEADER) : (ch.prompt || END_LABEL);
  nc.appendChild(header);
  if (ch.options.length) {
    const list = document.createElement('div');
    list.className = 'choice-list';
    ch.options.forEach((label, i) => list.appendChild(ticket(label, i, () => {
      if (!isLast) { state.chapter += 1; render(true); }
    })));
    nc.appendChild(list);
  }

  for (const el of narration.querySelectorAll('.narr, .bub')) for (const seg of textSegments(el)) joinLastTwoWords(seg);
  const lineEls = [...narration.children];
  if (state.layout === 'window') narration.appendChild(nc); else $('content').appendChild(nc);
  narration.addEventListener('scroll', () => {
    if (performance.now() < ownScrollUntil) return;
    follow = narration.scrollTop + narration.clientHeight >= narration.scrollHeight - FOLLOW_SLACK_PX;
  }, { passive: true });
  follow = true;
  setupPlayback(ch, lineEls, narration, nc, capBox);

  renderControls();
  const url = new URL(location.href);
  url.searchParams.set('s', state.story + 1);
  url.searchParams.set('c', state.chapter + 1);
  url.searchParams.delete('m');
  url.searchParams.set('lay', state.layout);
  if (cast.length) url.searchParams.set('ch', state.cast); else url.searchParams.delete('ch');
  history.replaceState(null, '', url);
  if (scrollTop) window.scrollTo(0, 0);
}

$('prev').addEventListener('click', () => { state.chapter -= 1; render(true); });
$('next').addEventListener('click', () => { state.chapter += 1; render(true); });

function storyCast(story) {
  return [...new Set(story.chapters.flatMap((c) => c.lines.filter((l) => l.name).map((l) => l.name)))];
}

// ---------- voiceover sync: lines appear as they're spoken ----------
let pb = null;
const wordsOf = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

function setupPlayback(ch, lineEls, narration, nc, capBox) {
  const words = ch.lines.map((l) => wordsOf(l.html));
  const total = words.reduce((a, b) => a + b, 0) || 1;
  const fakeSecs = words.map((w) => LINE_BASE_SECS + w * SECS_PER_WORD);
  const share = [];
  let acc = 0;
  for (const w of words) { share.push(acc / total); acc += w; }
  const fakeStarts = [];
  acc = 0;
  for (const s2 of fakeSecs) { fakeStarts.push(acc); acc += s2; }
  pb = { ch, lineEls, narration, nc, capBox, timed: ch.lines.length > 0 && ch.lines.every((l) => typeof l.t === 'number'), share, fakeStarts, fakeTotal: acc, revealed: 0, playing: false, ended: false,
    audio: null, fake: !ch.audio || FAST > 0, clock: 0, lastTick: 0, timer: null, startGuard: null };
  if (!ch.lines.length) finishPlayback();
  else startPlayback();   // like the app with autoplay on; a blocked autoplay waits for a tap on the button
}

const pbDuration = () => (!pb.fake && pb.audio && isFinite(pb.audio.duration) ? pb.audio.duration : pb.fakeTotal);
const pbTime = () => (!pb.fake && pb.audio ? pb.audio.currentTime : pb.clock);
// Brett's measured line times when we have them; otherwise each line's share of the words.
const lineStart = (i) => {
  if (!pb.fake && pb.timed) return pb.ch.lines[i].t;
  if (!pb.fake && pb.audio && isFinite(pb.audio.duration)) return pb.share[i] * pb.audio.duration;
  return pb.fakeStarts[i];
};

function startPlayback() {
  if (!pb || pb.ended) return;
  pb.playing = true;
  pb.narration.classList.add('playing');
  if (!pb.fake) {
    if (!pb.audio) {
      pb.audio = new Audio(pb.ch.audio);
      pb.audio.preload = 'auto';
      pb.audio.addEventListener('ended', finishPlayback);
      pb.audio.addEventListener('error', switchToFake);
    }
    const mine = pb;
    pb.audio.play().catch(() => { if (mine === pb && pb.audio.paused) pausePlayback(); });
    clearTimeout(pb.startGuard);
    pb.startGuard = setTimeout(() => { if (mine === pb && pb.playing && pb.audio.currentTime === 0) switchToFake(); }, AUDIO_START_TIMEOUT_MS);
  }
  pb.lastTick = performance.now();
  clearInterval(pb.timer);
  pb.timer = setInterval(tick, TICK_MS);
  tick();
}

function switchToFake() {
  if (!pb || pb.fake) return;
  const t = pb.audio ? pb.audio.currentTime : 0;
  if (pb.audio) pb.audio.pause();
  pb.fake = true;
  pb.clock = pb.fakeStarts[Math.max(0, pb.revealed - 1)] || t;
}

function pausePlayback() {
  if (!pb) return;
  pb.playing = false;
  if (pb.audio) pb.audio.pause();
  clearInterval(pb.timer);
}

function stopPlayback() {
  if (!pb) return;
  pausePlayback();
  clearTimeout(pb.startGuard);
  if (pb.audio) { pb.audio.removeAttribute('src'); pb.audio.load(); }
  pb = null;
}

function togglePlayback() {
  if (!pb) return;
  if (pb.ended) { render(true); return; }
  if (pb.playing) pausePlayback(); else startPlayback();
}

function tick() {
  if (!pb || !pb.playing) return;
  const now = performance.now();
  if (pb.fake) pb.clock += ((now - pb.lastTick) / 1000) * Math.max(1, FAST);
  pb.lastTick = now;
  const t = pbTime();
  let target = 1;
  while (target < pb.lineEls.length && lineStart(target) <= t) target++;
  revealTo(target);
  if (pb.fake && t >= pb.fakeTotal) finishPlayback();
}

function revealTo(n) {
  for (let i = pb.revealed; i < Math.min(n, pb.lineEls.length); i++) {
    const el = pb.lineEls[i];
    el.hidden = false;
    el.classList.add('enter');
    styleLine(el);
  }
  if (n > pb.revealed) {
    pb.revealed = Math.min(n, pb.lineEls.length);
    pb.lineEls.forEach((el, i) => el.classList.toggle('now', i === pb.revealed - 1));
    if (state.layout === 'over') showCaption(pb.lineEls[pb.revealed - 1]);
    else followNewest(pb.lineEls[pb.revealed - 1]);
  }
}

// Over the picture: only the line being spoken, replaced by the next one.
function showCaption(el) {
  const c = el.cloneNode(true);
  c.hidden = false;
  c.classList.remove('now', 'enter');
  if (c.matches('.say')) c.classList.remove('cont');
  pb.capBox.replaceChildren(c);
  c.classList.add('enter');
  c.querySelectorAll('.bub').forEach((b) => { b.style.width = ''; b.style.maxWidth = ''; });
  styleLine(c);
}

function styleLine(el) {
  const blocks = el.matches('.narr') ? [el] : [...el.querySelectorAll('.bub')];
  for (const b of blocks) {
    b.classList.remove('bal');
    b.style.maxWidth = '';
    if (lineCount(b) <= BALANCE_MAX_LINES) { b.classList.add('bal'); evenOut(b); }
    if (b.matches('.bub')) fitBubble(b);
  }
}

function finishPlayback() {
  if (!pb || pb.ended) return;
  revealTo(pb.lineEls.length);
  pausePlayback();
  pb.ended = true;
  pb.narration.classList.remove('playing');
  pb.lineEls.forEach((el) => el.classList.remove('now'));
  pb.nc.hidden = false;
  applyNewStyle([...pb.nc.querySelectorAll('.nc-header, .ticket-title')]);
  followNewest(pb.nc, true);
}

// Tap the story text (or the caption over the picture) to jump to the next line, and the voiceover with it.
$('webview').addEventListener('click', skipLine);
$('featured').addEventListener('click', (e) => { if (e.target.closest('.cap-box')) skipLine(e); });
function skipLine(e) {
  if (!pb || pb.ended || e.target.closest('button, .link-wrapper, .next-chapters')) return;
  if (pb.revealed >= pb.lineEls.length) { finishPlayback(); return; }
  const next = pb.revealed;
  if (!pb.fake && pb.audio && (pb.timed || isFinite(pb.audio.duration))) pb.audio.currentTime = lineStart(next);
  else pb.clock = pb.fakeStarts[next];
  revealTo(next + 1);
}

// Follow the voice unless the reader has scrolled up to look back.
let follow = true;
let ownScrollUntil = 0;
addEventListener('scroll', () => {
  if (performance.now() < ownScrollUntil) return;
  follow = window.scrollY + innerHeight >= document.documentElement.scrollHeight - FOLLOW_SLACK_PX;
}, { passive: true });
function followNewest(el, force) {
  if (!el || (!follow && !force)) return;
  ownScrollUntil = performance.now() + OWN_SCROLL_MS;
  if (state.layout === 'window') {
    const box = pb.narration;
    box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    return;
  }
  const r = el.getBoundingClientRect();
  if (r.bottom <= innerHeight - 16) return;
  ownScrollUntil = performance.now() + OWN_SCROLL_MS;
  window.scrollBy({ top: r.bottom - innerHeight + 24, behavior: 'smooth' });
}

render(false);
// Line counts depend on the web font; restyle what's showing once it has loaded.
document.fonts.ready.then(() => { if (pb) pb.lineEls.filter((el) => !el.hidden).forEach(styleLine); });
window.__balancedStories = {
  state, render, STORIES,
  finishNow: () => finishPlayback(),
  get playback() { return pb && { revealed: pb.revealed, total: pb.lineEls.length, playing: pb.playing, ended: pb.ended, fake: pb.fake }; },
};
