// Social media posts: a list of post ideas, each opening as a mocked-up Instagram post, story or Reel.
// Words live in posts.js; this file is layout, drawing and behaviour only.
const V = window.CACHE_V || '';
const { PAGE, SECTIONS, FORMATS, POSTS } = await import('./posts.js' + V);

const app = document.getElementById('app');
const params = new URLSearchParams(location.search);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CHOOSER = id => `../story-chooser/?v=${encodeURIComponent(id)}`;

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(c));
  return n;
}
// never one word alone on the last line
const keep = t => { const w = String(t).trim().split(/\s+/); return w.length < 3 ? w.join(' ') : w.slice(0, -2).join(' ') + ' ' + w.slice(-2).join(' '); };

/* ---------- drawn motifs (no photos, no AI images): simple line art in the post's jewel tone ---------- */
const TONES = { sapphire: '#5b8cff', ruby: '#ff4f79', emerald: '#00cd9d', citrine: '#f5b82e', glow: '#c49bff' };
const sigil = d => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="1 7" stroke-linecap="round" stroke-linejoin="round"/>`;
const ART = {
  street: `<path d="M10 92 H110" stroke="currentColor" stroke-width="2"/><rect x="16" y="44" width="26" height="48" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="48" y="30" width="30" height="62" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="84" y="50" width="22" height="42" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="23" y="54" width="6" height="7" fill="currentColor"/><rect x="56" y="40" width="6" height="7" fill="currentColor"/><rect x="66" y="58" width="6" height="7" fill="currentColor" opacity=".5"/><rect x="90" y="60" width="6" height="7" fill="currentColor" opacity=".5"/><path d="M40 92 V70 M40 70 h-6" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="70" r="3" fill="currentColor"/>`,
  seal: `<rect x="18" y="30" width="84" height="56" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 30 L60 64 L102 30" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="60" cy="64" r="14" fill="currentColor"/><path d="M60 55 L68 70 H52 Z" fill="none" stroke="#1a0b3d" stroke-width="2"/><circle cx="60" cy="65" r="2" fill="#1a0b3d"/>`,
  hood: `<path d="M60 22 C40 22 30 40 30 58 V100 H90 V58 C90 40 80 22 60 22 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><ellipse cx="60" cy="60" rx="13" ry="16" fill="currentColor" opacity=".18"/><circle cx="55" cy="60" r="2.4" fill="currentColor"/><circle cx="65" cy="60" r="2.4" fill="currentColor"/>`,
  phone: `<rect x="38" y="16" width="44" height="88" rx="8" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M52 22 h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M46 84 C54 70 62 74 66 60 S74 44 74 36" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/><circle cx="74" cy="34" r="4" fill="currentColor"/>`,
  route: `<path d="M18 96 C30 70 52 86 58 62 S84 40 100 24" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/><circle cx="18" cy="96" r="5" fill="currentColor" opacity=".45"/><path d="M100 12 a9 9 0 0 1 9 9 c0 7 -9 15 -9 15 s-9 -8 -9 -15 a9 9 0 0 1 9 -9 Z" fill="currentColor"/>`,
  fog: `<circle cx="38" cy="48" r="26" fill="currentColor" opacity=".16"/><circle cx="78" cy="60" r="30" fill="currentColor" opacity=".12"/><circle cx="56" cy="84" r="22" fill="currentColor" opacity=".14"/><path d="M28 72 l6 -8 6 8 -6 8 Z" fill="currentColor"/><path d="M84 36 l5 -6 5 6 -5 6 Z" fill="currentColor" opacity=".6"/><path d="M10 100 C34 92 46 104 70 96 S100 92 112 98" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/>`,
  steps: `<g fill="currentColor"><ellipse cx="34" cy="96" rx="6" ry="9"/><ellipse cx="50" cy="80" rx="6" ry="9" opacity=".85"/><ellipse cx="62" cy="62" rx="6" ry="9" opacity=".7"/><ellipse cx="78" cy="46" rx="6" ry="9" opacity=".55"/><ellipse cx="88" cy="28" rx="6" ry="9" opacity=".4"/></g>`,
  gem: `<path d="M60 20 L92 46 L60 104 L28 46 Z" fill="currentColor" opacity=".22"/><path d="M60 20 L92 46 L60 104 L28 46 Z M28 46 H92 M44 46 L60 20 L76 46 L60 104 L44 46" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`,
  window: `<rect x="26" y="20" width="68" height="84" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="32" y="26" width="26" height="34" fill="currentColor" opacity=".8"/><rect x="62" y="26" width="26" height="34" fill="currentColor" opacity=".25"/><rect x="32" y="64" width="26" height="34" fill="currentColor" opacity=".25"/><rect x="62" y="64" width="26" height="34" fill="currentColor" opacity=".55"/>`,
  clock: `<circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M60 34 V60 L76 70" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M60 22 v6 M98 60 h-6 M60 98 v-6 M22 60 h6" stroke="currentColor" stroke-width="2"/>`,
  sword: `<path d="M60 14 L66 22 V78 H54 V22 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M38 78 H82" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M60 82 V100" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="104" r="4" fill="currentColor"/>`,
  magnifier: `<circle cx="52" cy="52" r="24" fill="none" stroke="currentColor" stroke-width="3"/><path d="M70 70 L96 96" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="52" cy="52" r="16" fill="currentColor" opacity=".15"/>`,
  quote: `<text x="18" y="74" font-family="Georgia, serif" font-size="90" fill="currentColor" opacity=".9">“</text><path d="M58 52 H104 M58 66 H96 M58 80 H100" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`,
  fork: `<path d="M60 104 V64 M60 64 C60 48 40 44 30 24 M60 64 C60 48 80 44 90 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><text x="22" y="20" font-family="Georgia, serif" font-size="16" fill="currentColor">A</text><text x="88" y="20" font-family="Georgia, serif" font-size="16" fill="currentColor">B</text>`,
  friends: `<g fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="30" cy="48" r="10"/><circle cx="52" cy="40" r="10"/><circle cx="74" cy="44" r="10"/><circle cx="94" cy="52" r="10"/><path d="M16 92 C16 72 44 72 44 92 M38 88 C38 66 66 66 66 88 M60 88 C60 68 88 68 88 88 M80 96 C80 76 108 76 108 96"/></g>`,
  postcard: `<rect x="14" y="26" width="92" height="68" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M24 80 C36 60 46 74 54 52" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="2 5" stroke-linecap="round"/><circle cx="24" cy="80" r="7" fill="currentColor" opacity=".25"/><circle cx="54" cy="52" r="3.5" fill="currentColor"/><path d="M66 40 H96 M66 52 H92 M66 64 H88" stroke="currentColor" stroke-width="2" opacity=".6"/><rect x="84" y="32" width="14" height="16" fill="currentColor" opacity=".5"/>`,
  calendar: `<rect x="22" y="28" width="76" height="70" rx="6" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M22 46 H98 M42 20 V34 M78 20 V34" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><g fill="currentColor"><rect x="32" y="56" width="10" height="9" rx="2"/><rect x="48" y="56" width="10" height="9" rx="2" opacity=".5"/><rect x="64" y="56" width="10" height="9" rx="2" opacity=".5"/><rect x="80" y="56" width="10" height="9" rx="2" opacity=".5"/><rect x="32" y="74" width="10" height="9" rx="2" opacity=".5"/><rect x="48" y="74" width="10" height="9" rx="2" opacity=".5"/><rect x="64" y="74" width="10" height="9" rx="2" opacity=".5"/></g>`,
  bell: `<path d="M60 22 C44 22 38 36 38 50 V70 L30 82 H90 L82 70 V50 C82 36 76 22 60 22 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M52 90 a8 8 0 0 0 16 0" fill="none" stroke="currentColor" stroke-width="2.5"/>`,
  moon: `<path d="M74 22 A40 40 0 1 0 98 78 A32 32 0 1 1 74 22 Z" fill="currentColor" opacity=".85"/><circle cx="30" cy="30" r="2" fill="currentColor"/><circle cx="96" cy="34" r="1.5" fill="currentColor"/><circle cx="22" cy="80" r="1.5" fill="currentColor"/>`,
  lock: `<rect x="34" y="12" width="52" height="96" rx="10" fill="none" stroke="currentColor" stroke-width="2.5"/><text x="60" y="38" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="currentColor">9:41</text><rect x="40" y="62" width="40" height="24" rx="6" fill="currentColor" opacity=".25"/><path d="M45 79 H66" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="66" cy="79" r="3" fill="currentColor"/>`,
  snow: `<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M60 18 V58 M43 28 L77 48 M43 48 L77 28"/></g><g fill="currentColor"><ellipse cx="38" cy="100" rx="5" ry="8"/><ellipse cx="52" cy="86" rx="5" ry="8" opacity=".7"/><ellipse cx="72" cy="94" rx="5" ry="8" opacity=".5"/><ellipse cx="86" cy="78" rx="5" ry="8" opacity=".35"/><circle cx="24" cy="30" r="2"/><circle cx="96" cy="22" r="2.5"/><circle cx="100" cy="60" r="1.5"/></g>`,
  'sigil-star': sigil('M60 14 L72 48 L108 48 L79 69 L90 104 L60 83 L30 104 L41 69 L12 48 L48 48 Z'),
  'sigil-key': sigil('M30 60 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0 M48 60 H108 M92 60 V76 M104 60 V72'),
  'sigil-moon': sigil('M78 18 A42 42 0 1 0 104 84 A34 34 0 1 1 78 18 Z'),
};
const art = (name, cls = 'art') => `<svg class="${cls}" viewBox="0 0 120 120" aria-hidden="true">${ART[name] || ''}</svg>`;

// one designed slide: tone gradient, motif, kicker, big line, small line
function slide(s, opts = {}) {
  const d = el('div', { class: 'slide' + (opts.tall ? ' tall' : '') });
  d.style.setProperty('--tone', TONES[s.tone] || TONES.sapphire);
  d.innerHTML = art(s.art);
  const t = el('div', { class: 'words' });
  if (s.kicker) t.append(el('div', { class: 'kicker', text: s.kicker }));
  if (s.big) t.append(el('div', { class: 'big', text: keep(s.big) }));
  if (s.small) t.append(el('div', { class: 'small', text: keep(s.small) }));
  d.append(t);
  return d;
}

/* ---------- list ---------- */
function renderList() {
  document.title = 'Story City · Social media posts';
  app.innerHTML = '';
  const main = el('main', { class: 'stage list' },
    el('h1', { text: PAGE.title }),
    el('p', { class: 'lead', text: PAGE.lead }));
  for (const s of SECTIONS) {
    const items = POSTS.filter(p => p.section === s.key);
    main.append(el('div', { class: 'group-title', text: s.title }), el('p', { class: 'group-sub', text: s.sub }));
    if (s.key === 'chooser') main.append(el('p', { class: 'also-note' }, PAGE.chooserNote + ' ', el('a', { href: '../story-chooser/', text: 'Open Help Me Choose a Story ›' })));
    for (const p of items) {
      const from = !!p.chooser;
      main.append(el('a', { class: 'pcard' + (from ? ' from' : ''), href: from ? CHOOSER(p.chooser) : `?v=${p.id}` },
        el('span', { class: 'fmt', text: FORMATS[p.format] }),
        el('span', { class: 't' }, el('b', { text: p.title }), el('span', { text: p.blurb }),
          from ? el('span', { class: 'also', text: PAGE.alsoChooser + ' ↗' }) : null),
        el('span', { class: 'go', 'aria-hidden': 'true', text: '›' })));
    }
  }
  main.append(el('p', { class: 'foot', text: PAGE.sampleNote }));
  app.append(main);
}

/* ---------- one post ---------- */
function renderPost(p) {
  document.title = `Story City · ${p.title}`;
  app.innerHTML = '';
  const stage = el('main', { class: 'stage post' });
  app.append(el('header', { class: 'topbar' },
    el('a', { class: 'back', href: './', text: '‹ All' }),
    el('h1', { text: p.title }),
    el('span', { class: 'badge', text: FORMATS[p.format] })), stage);
  if (p.format === 'reel') stage.append(reel(p));
  else if (p.format === 'story') stage.append(story(p));
  else stage.append(feedPost(p));
  stage.append(el('section', { class: 'notes' },
    el('h2', { text: 'Why it works' }), el('p', { text: p.why }),
    el('h2', { text: 'How we’d know' }), el('p', { text: p.measure }),
    el('p', { class: 'foot', text: PAGE.sampleNote })));
}

const head = () => el('div', { class: 'ig-head' }, el('span', { class: 'ig-avatar' }, el('i', { html: art('seal', 'mini') })), el('b', { text: PAGE.account }), el('span', { class: 'more', text: '•••' }));
const ICONS = {
  heart: '<path d="M12 20s-7-4.4-9.2-8.6C1.2 8.3 3 5 6.3 5c2 0 3.3 1.1 3.9 2.2h3.6C14.4 6.1 15.7 5 17.7 5 21 5 22.8 8.3 21.2 11.4 19 15.6 12 20 12 20Z"/>',
  comment: '<path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12Z"/>',
  send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z"/>',
  save: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
};
const icon = k => el('span', { class: 'ic', html: `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>` });

// Instagram feed post or carousel
function feedPost(p) {
  const slides = p.slides;
  const track = el('div', { class: 'ig-track', role: 'group', 'aria-label': 'Carousel' }, slides.map(s => slide(s)));
  const dots = el('div', { class: 'ig-dots' }, slides.length > 1 ? slides.map((_, i) => el('i', { class: i ? '' : 'on' })) : []);
  const count = slides.length > 1 ? el('span', { class: 'ig-count', text: `1/${slides.length}` }) : null;
  const go = d => track.scrollBy({ left: d * track.clientWidth, behavior: RM ? 'auto' : 'smooth' });
  const prev = el('button', { class: 'ig-arrow prev', 'aria-label': 'Previous slide', text: '‹', onclick: () => go(-1) });
  const next = el('button', { class: 'ig-arrow next', 'aria-label': 'Next slide', text: '›', onclick: () => go(1) });
  const sync = () => {
    const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
    if (count) count.textContent = `${i + 1}/${slides.length}`;
    prev.hidden = i === 0; next.hidden = i >= slides.length - 1;
  };
  track.addEventListener('scroll', () => requestAnimationFrame(sync));
  const frame = el('div', { class: 'ig-carousel' }, track, count, slides.length > 1 ? [prev, next] : []);
  setTimeout(sync);
  let liked = false;
  const likes = el('div', { class: 'ig-likes', text: '1,284 likes' });
  const heart = icon('heart');
  heart.addEventListener('click', () => { liked = !liked; heart.classList.toggle('on', liked); likes.textContent = liked ? '1,285 likes' : '1,284 likes'; });
  return el('article', { class: 'ig-post' }, head(), frame,
    el('div', { class: 'ig-actions' }, heart, icon('comment'), icon('send'), dots, icon('save')),
    likes,
    el('p', { class: 'ig-caption' }, el('b', { text: PAGE.account + ' ' }), p.caption + ' ', el('span', { class: 'tags', text: p.tags })));
}

// Instagram story: tap the right side for the next frame, the left side to go back; stickers are tappable
function story(p) {
  let i = 0;
  const bars = el('div', { class: 'bars' }, p.frames.map(() => el('i')));
  const body = el('div', { class: 'sbody' });
  const frame = el('div', { class: 'ig-story' }, bars,
    el('div', { class: 'who' }, el('span', { class: 'ig-avatar' }, el('i', { html: art('seal', 'mini') })), el('b', { text: PAGE.account }), el('span', { text: '2h' })),
    body,
    el('button', { class: 'tap prev', 'aria-label': 'Previous', onclick: () => show(i - 1) }),
    el('button', { class: 'tap next', 'aria-label': 'Next', onclick: () => show(i + 1) }));
  function show(k) {
    if (k < 0 || k >= p.frames.length) return;
    i = k;
    [...bars.children].forEach((b, n) => b.className = n < i ? 'done' : n === i ? 'on' : '');
    const f = p.frames[i];
    body.innerHTML = '';
    body.className = 'sbody' + (f.sticker ? ' has-sticker ' + f.sticker.type : '');   // stickers push the words up so nothing is covered
    body.append(slide(f, { tall: true }));
    if (f.sticker) body.append(sticker(f.sticker));
    if (i < p.frames.length - 1) body.append(el('div', { class: 'hint', text: 'Tap the right side for more' }));
  }
  show(0);
  return frame;
}
function sticker(s) {
  const box = el('div', { class: 'sticker ' + s.type });
  if (s.type === 'poll') {
    box.append(el('div', { class: 'sq', text: s.q }));
    const opts = s.options.map((o, k) => el('button', { class: 'opt', onclick: () => {
      box.classList.add('voted');
      opts.forEach((b, n) => { b.classList.toggle('mine', n === k); b.style.setProperty('--pct', s.pct[n] + '%'); b.querySelector('.pct').textContent = s.pct[n] + '%'; });
    } }, el('span', { class: 'fill' }), el('span', { class: 'lbl', text: o }), el('span', { class: 'pct' })));
    box.append(el('div', { class: 'opts' }, opts));
  } else if (s.type === 'quiz') {
    box.append(el('div', { class: 'sq', text: s.q }));
    const opts = s.options.map((o, k) => el('button', { class: 'opt', onclick: () => {
      if (box.classList.contains('answered')) return;
      box.classList.add('answered');
      opts.forEach((b, n) => b.classList.add(n === s.right ? 'right' : n === k ? 'wrong' : 'other'));
    } }, el('span', { class: 'letter', text: 'ABCD'[k] }), el('span', { class: 'lbl', text: o })));
    box.append(el('div', { class: 'opts' }, opts));
  } else if (s.type === 'slider') {
    const out = el('b', { text: '5' });
    const r = el('input', { type: 'range', min: 0, max: s.max || 10, value: 5, 'aria-label': s.q });
    r.addEventListener('input', () => out.textContent = r.value);
    box.append(el('div', { class: 'sq' }, s.q + ': ', out), r);
  } else if (s.type === 'link') {
    box.append(el('button', { class: 'linkbtn', onclick: () => toast('In the real story this opens Story City.') }, el('span', { html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1"/></svg>' }), s.label));
  }
  return box;
}

// Reel / TikTok: the on-screen text beats play in order over the drawn motif; tap to pause, Replay at the end
function reel(p) {
  let i = -1, timer = 0, paused = false;
  const bars = el('div', { class: 'rprog' }, el('i'));
  const text = el('div', { class: 'rtext', 'aria-live': 'polite' });
  const bg = el('div', { class: 'rbg', html: art(p.art, 'art big') });
  bg.style.setProperty('--tone', TONES[p.tone] || TONES.sapphire);
  const replay = el('button', { class: 'replay', hidden: true, text: 'Replay', onclick: () => { replay.hidden = true; i = -1; step(); } });
  const pauseBadge = el('div', { class: 'paused', hidden: true, text: 'Paused' });
  const frame = el('div', { class: 'reel' }, bg, bars, text, pauseBadge, replay,
    el('div', { class: 'rside' }, ...['heart', 'comment', 'send', 'save'].map(icon)),
    el('div', { class: 'rcap' }, el('b', { text: '@' + PAGE.account }), el('p', { text: p.caption }), el('span', { class: 'audio', text: '♪ ' + p.audio })));
  const DUR = 2600;
  function step() {
    clearTimeout(timer);
    i++;
    if (i >= p.beats.length) { replay.hidden = false; return; }
    text.classList.remove('in'); void text.offsetWidth;
    text.textContent = keep(p.beats[i]); text.classList.add('in');
    text.classList.toggle('last', i === p.beats.length - 1);
    bars.firstChild.style.width = ((i + 1) / p.beats.length * 100) + '%';
    if (!paused) timer = setTimeout(step, RM ? DUR * 1.4 : DUR);
  }
  frame.addEventListener('click', e => {
    if (e.target.closest('.replay, .rside')) return;
    if (!replay.hidden) return;
    paused = !paused; pauseBadge.hidden = !paused;
    if (paused) clearTimeout(timer); else timer = setTimeout(step, 900);
  });
  setTimeout(step, 300);
  return frame;
}

function toast(t) {
  const n = el('div', { class: 'toast', text: t });
  document.body.append(n); setTimeout(() => n.remove(), 2400);
}

/* ---------- route ---------- */
const id = params.get('v');
const post = POSTS.find(x => x.id === id);
if (post && post.chooser) location.replace(CHOOSER(post.chooser));
else if (post) renderPost(post);
else renderList();
