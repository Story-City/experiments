// Story chooser shell. Variants live in ./variants/<slug>.js and talk to this file only through `ctx`.
// Contract for a variant module:
//   export default { slug, title, short, channel: 'instagram' | 'app', blurb, mount(ctx) }
// A variant imports nothing. Everything it needs (DOM helper, stories, scoring, photos, carousel, result screen) is on ctx.
const V = window.CACHE_V || '';
const { STORIES, TOKENS, score } = await import('./stories.js' + V);
const { PHOTOS } = await import('./photos.js' + V);

export const VARIANTS = [
  { n: 5,  slug: 'rooms',       short: 'Rooms carousel',          channel: 'instagram', blurb: 'Which room do you sleep in tonight? Six rooms, one pick.' },
  { n: 6,  slug: 'doors',       short: 'Real doors',              channel: 'instagram', blurb: 'Six doors from real streets. Which one do you knock on?' },
  { n: 7,  slug: 'windows',     short: 'Lit windows',             channel: 'instagram', blurb: 'Four windows glowing at night. What is happening inside?' },
  { n: 13, slug: 'first-lines', short: 'First lines',             channel: 'instagram', blurb: 'Five opening sentences. Keep reading the one that grabs you.' },
  { n: 17, slug: 'poll-chain',  short: 'Poll-sticker chain',      channel: 'instagram', blurb: 'Five story slides with native polls and a “mostly A” reveal.' },
  { n: 16, slug: 'sound',       short: 'Sound pick',              channel: 'instagram', blurb: 'Swipe through four places with the sound on. Stay in the one you like.' },
  { n: 11, slug: 'cards',       short: 'Draw a card',             channel: 'instagram', blurb: 'A face-down deck. Draw one, or draw three.' },
  { n: 1,  slug: 'fork',        short: 'Fork in the Road',        channel: 'app',       blurb: 'Seven this-or-that taps, each a tiny story moment.' },
  { n: 8,  slug: 'swipe',       short: 'Swipe deck',              channel: 'app',       blurb: 'Like or pass on ten images. Your likes add up to a story.' },
  { n: 12, slug: 'chart',       short: 'Story chart / Venn',      channel: 'app',       blurb: 'Stories plotted cozy-to-creepy and silly-to-serious. Look, then pick.' },
  { n: 14, slug: 'how-long',    short: 'How long have you got?',  channel: 'app',       blurb: 'Time, place and company. The practical matcher.' },
  { n: 15, slug: 'friend',      short: 'Let a friend choose',     channel: 'app',       blurb: 'Send a link. A friend answers about you. You get the story.' },
  { n: 20, slug: 'stranger',    short: 'A stranger interviews you', channel: 'app',     round: 2, blurb: 'A one-minute chat. Your replies pick the story.' },
  { n: 18, slug: 'envelope',    short: 'Walk to open the envelope', channel: 'app',     round: 2, blurb: 'No choosing. Walk thirty steps and the seal breaks.' },
  { n: 22, slug: 'door-of-day', short: 'Door of the Day',         channel: 'instagram', round: 2, blurb: 'One door, one story, everyone gets the same one today.' },
  { n: 23, slug: 'blind-date',  short: 'Blind date with a story', channel: 'instagram', round: 2, blurb: 'Brown paper, three hints, one first line. Tear to reveal.' },
];

/* ---------- tiny DOM helper ---------- */
export function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') for (const [p, val] of Object.entries(v)) p.startsWith('--') ? n.style.setProperty(p, val) : (n.style[p] = val);
    else if (k === 'dataset') Object.assign(n.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    n.append(k.nodeType ? k : document.createTextNode(String(k)));
  }
  return n;
}
const svg = (d) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = d; return s; };
const ICON = {
  heart: '<path d="M12 21s-7.5-4.6-9.5-9.3C1 7.8 3.6 4.5 7 4.5c2 0 3.4 1.1 4.3 2.4.9-1.3 2.3-2.4 4.3-2.4 3.4 0 6 3.3 4.5 7.2C19.5 16.4 12 21 12 21z"/>',
  comment: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12z"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  save: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
};

/* ---------- toast ---------- */
let toastEl, toastTimer;
export function toast(msg, ms = 1800) {
  if (!toastEl) { toastEl = el('div', { class: 'toast', role: 'status' }); document.body.append(toastEl); }
  toastEl.textContent = msg; toastEl.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.hidden = true; }, ms);
}

/* ---------- photos ---------- */
export const photo = (key) => PHOTOS[key] || null;
const placeholder = (label, cls = '') => el('div', { class: ('ph ' + cls).trim(), text: label, 'aria-label': label });
export function photoEl(key, label = '', cls = '') {
  const p = PHOTOS[key];
  const fallback = label || key.split('.').pop();
  if (p && p.url) {
    const img = el('img', { src: p.url, alt: p.alt || fallback, loading: 'lazy', class: cls || null, draggable: 'false' });
    img.addEventListener('error', () => img.replaceWith(placeholder(fallback, cls)), { once: true });
    return img;
  }
  return placeholder(fallback, cls);
}

/* ---------- Instagram carousel ---------- */
// slides: [{ key | img | node, title, sub, n, onPick, cls }]   opts: { handle, caption, likes, label, onSlide }
export function carousel(slides, opts = {}) {
  const track = el('div', { class: 'ig-track', role: 'group', 'aria-label': opts.label || 'Carousel' });
  const dots = el('div', { class: 'ig-dots' });
  const count = el('div', { class: 'ig-count', text: `1/${slides.length}` });
  const cur = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
  const go = (i) => { i = Math.max(0, Math.min(slides.length - 1, i)); track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }); };
  const prev = el('button', { class: 'ig-arrow prev', 'aria-label': 'Previous', text: '‹', onClick: (e) => { e.stopPropagation(); go(cur() - 1); } });
  const next = el('button', { class: 'ig-arrow next', 'aria-label': 'Next', text: '›', onClick: (e) => { e.stopPropagation(); go(cur() + 1); } });
  slides.forEach((s, i) => {
    const slide = el('div', { class: ('ig-slide ' + (s.cls || '')).trim(), dataset: { i } });
    if (s.node) slide.append(s.node);
    else if (s.img) slide.append(el('img', { src: s.img, alt: s.title || '', draggable: 'false' }));
    else if (s.key) slide.append(photoEl(s.key, s.title));
    if (s.n != null) slide.append(el('div', { class: 'n', text: s.n }));
    if (s.title || s.sub) slide.append(el('div', { class: 'cap' }, s.title ? el('b', { text: s.title }) : null, s.sub ? el('span', { text: s.sub }) : null));
    if (s.onPick) {
      slide.classList.add('pickable'); slide.tabIndex = 0; slide.setAttribute('role', 'button');
      slide.setAttribute('aria-label', s.title || `Slide ${i + 1}`);
      slide.addEventListener('click', () => s.onPick(s, i));
      slide.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.onPick(s, i); } });
    }
    track.append(slide);
    dots.append(el('i', { class: i === 0 ? 'on' : '' }));
  });
  prev.hidden = true; next.hidden = slides.length < 2;
  track.addEventListener('scroll', () => {
    const i = cur();
    count.textContent = `${i + 1}/${slides.length}`;
    [...dots.children].forEach((d, j) => d.classList.toggle('on', j === i));
    prev.hidden = i === 0; next.hidden = i === slides.length - 1;
    opts.onSlide && opts.onSlide(i);
  }, { passive: true });
  const post = el('div', { class: 'ig-post' },
    el('div', { class: 'ig-head' }, el('div', { class: 'ig-avatar' }, el('i', { text: '🔮' })), el('span', { text: opts.handle || 'storycityapp' }), el('span', { class: 'more', text: '•••' })),
    el('div', { class: 'ig-carousel' }, track, slides.length > 1 ? count : null, prev, next),
    el('div', { class: 'ig-actions' }, svg(ICON.heart), svg(ICON.comment), svg(ICON.send), dots, svg(ICON.save)),
    opts.likes ? el('div', { class: 'ig-likes', text: opts.likes }) : null,
    opts.caption ? el('div', { class: 'ig-caption', html: `<b>${opts.handle || 'storycityapp'}</b> ${opts.caption}` }) : null,
  );
  post.go = go; post.track = track; post.current = cur;
  return post;
}

/* ---------- result screen ---------- */
// Identity first, story second: every result gets a named archetype and a daylist-style walk name.
const ARCHETYPES = {
  'creepy-serious-night': ['The Midnight Investigator', 'You notice the thing everyone else walks past, and you can’t leave a question unanswered.'],
  'creepy-serious-day':   ['The Daylight Detective', 'You like your mysteries with the lights on, and you always read the last page first. Almost always.'],
  'creepy-silly-night':   ['The Ghost Whisperer', 'You laugh in the dark so nothing else can. Secretly, you hope something laughs back.'],
  'creepy-silly-day':     ['The Haunt Hunter', 'You go looking for strange on purpose, and you bring snacks.'],
  'cozy-serious-night':   ['The Lamplight Wanderer', 'You take the long way home on purpose. You’re quieter than people think, and braver.'],
  'cozy-serious-day':     ['The Quiet Cartographer', 'You map the small things: the blue door, the good bench, the shortcut nobody uses.'],
  'cozy-silly-night':     ['The Moonlit Mischief-Maker', 'You’re the reason the plan changed, and the reason it was fun.'],
  'cozy-silly-day':       ['The Side-Quest Hero', 'You can’t walk past a puddle, a puzzle or a stranger’s dog. Good.'],
};
const MOODWORD = { cozy: 'cosy', eerie: 'shivery', playful: 'mischief', epic: 'heroic', tender: 'soft-hearted', mysterious: 'secret', funny: 'giggly', thoughtful: 'wandering', spooky: 'haunted', romance: 'starry-eyed' };
const PLACEWORD = { downtown: 'downtown', park: 'river valley', cafe: 'café', anywhere: 'around-the-block', neighbourhood: 'neighbourhood' };
function archetype(story, weights) {
  const w = (k) => weights[k] || 0;
  const creepy = story.vibe.creepy + (w('eerie') + w('spooky') - w('cozy') - w('calm')) * 0.5 >= 5 ? 'creepy' : 'cozy';
  const serious = story.vibe.serious + (w('thoughtful') + w('mystery') - w('funny') - w('playful')) * 0.5 >= 5 ? 'serious' : 'silly';
  const hour = new Date().getHours();
  const night = w('night') !== w('day') ? (w('night') > w('day')) : (hour >= 18 || hour < 6);
  const [name, line] = ARCHETYPES[`${creepy}-${serious}-${night ? 'night' : 'day'}`];
  return { name, line };
}
function walkName(story, weights) {
  const d = new Date(); const h = d.getHours();
  const day = d.toLocaleDateString('en-CA', { weekday: 'long' }).toLowerCase();
  const part = h < 5 ? 'midnight' : h < 12 ? 'morning' : h < 17 ? 'afternoon' : h < 21 ? 'twilight' : 'midnight';
  const moods = Object.keys(MOODWORD).sort((a, b) => (weights[b] || 0) - (weights[a] || 0));
  const mood = (weights[moods[0]] ? moods[0] : story.tags.find(t => MOODWORD[t])) || 'mysterious';
  const place = PLACEWORD[story.tags.find(t => PLACEWORD[t])] || 'around-the-block';
  return `${day} ${part} ${MOODWORD[mood]} ${place} walk`;
}
function share(story, why, who, walk) {
  const text = `I’m ${who.name.replace(/^The /, 'a ')}. Tonight’s walk: “${walk}”, and my story is “${story.name}”. Which one are you? storycity.app`;
  const done = () => toast('Copied. Paste it anywhere.');
  if (navigator.share) { navigator.share({ text }).catch(() => {}); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => toast(text, 3500));
  else toast(text, 3500);
}
function coverEl(s) {
  const box = el('div', { class: 'cover' }, placeholder(s.name));
  if (s.cover) {
    const img = el('img', { src: s.cover, alt: '', class: 'cover-img', decoding: 'async' });
    img.addEventListener('load', () => img.classList.add('in'), { once: true });
    img.addEventListener('error', () => img.remove(), { once: true });
    box.append(img);
  }
  return box;
}
// opts: { weights, why, frame: 'ig' | 'app', headline, story (force a specific story), top }
export function renderResult(ctx, opts = {}) {
  let { weights = {}, why = '', frame = 'app', headline, top = 3 } = opts;
  const userWeights = weights;
  if (opts.story && !Object.keys(weights).length) weights = Object.fromEntries(opts.story.tags.map(t => [t, 1]));
  const ranked = score(weights);
  const best = opts.story ? (ranked.find(r => r.story === opts.story) || { story: opts.story, matched: [] }) : ranked[0];
  const alts = ranked.filter(r => r.story !== best.story).slice(0, top - 1);
  const s = best.story;
  const who = archetype(s, userWeights);
  const walk = walkName(s, userWeights);
  const start = el('button', { class: 'btn primary block start', text: 'Start this story' });
  start.addEventListener('click', () => {
    if (start.classList.contains('sealed')) return;
    start.classList.add('sealed'); start.textContent = 'Sealed ✦ opening chapter 1…';
    setTimeout(() => toast(`In the app this opens “${s.name}”, chapter 1`), 650);
  });
  const root = ctx.root; root.innerHTML = '';
  root.append(el('section', { class: 'result' },
    el('div', { class: 'rcard' },
      el('div', { class: 'eyebrow', text: headline || (frame === 'ig' ? 'You are…' : 'You are') }),
      el('div', { class: 'who', text: who.name }),
      el('p', { class: 'line', text: who.line }),
      el('div', { class: 'walk' }, el('span', { text: 'Tonight’s walk' }), el('b', { text: `“${walk}”` }))),
    el('div', { class: 'eyebrow story-eyebrow', text: 'Your story' }),
    el('h2', { text: s.name }),
    coverEl(s),
    el('p', { text: s.blurb }),
    why ? el('p', { class: 'why', text: why }) : null,
    el('div', { class: 'tags' }, (best.matched && best.matched.length ? best.matched : s.tags.slice(0, 4)).map(t => el('i', { text: t }))),
    el('div', { class: 'meta muted', text: `${s.minutes} min · ${s.where} · ${s.mode === 'walk' ? 'Walk mode' : s.mode === 'pin' ? 'Pin mode' : 'Hunt mode'}` }),
    el('div', { class: 'row' }, start),
    el('div', { class: 'row' },
      el('button', { class: 'btn ghost', text: 'Share my card', onClick: () => share(s, why, who, walk) }),
      el('button', { class: 'btn ghost', text: 'Try again', onClick: () => ctx.restart() })),
    alts.length ? el('div', { class: 'alts' },
      el('div', { class: 'group-title', text: 'Close seconds' }),
      alts.map(a => el('button', { class: 'alt', onClick: () => renderResult(ctx, { ...opts, story: a.story }) },
        el('b', { text: a.story.name }), el('span', { text: `${a.story.minutes} min` })))) : null,
    el('p', { class: 'again' }, el('a', { href: './', text: 'Try another way to choose' })),
  ));
  window.scrollTo(0, 0);
  return best;
}

/* ---------- picker (start screen) ---------- */
function renderPicker(app) {
  document.title = 'Story City · Help me choose a story';
  app.innerHTML = '';
  const group = (title, channel) => [
    el('div', { class: 'group-title', text: title }),
    VARIANTS.filter(v => (channel === 'round2' ? v.round === 2 : (v.channel === channel && !v.round))).map(v => el('a', { class: 'vcard ' + v.channel, href: `?v=${v.slug}` },
      el('span', { class: 'num', text: v.n }),
      el('span', { class: 't' }, el('b', { text: v.short }), el('span', { text: v.blurb })),
      el('span', { class: 'go', 'aria-hidden': 'true', text: '›' }))),
  ];
  app.append(el('main', { class: 'stage picker' },
    el('h2', { text: 'Help me choose a story' }),
    el('p', { class: 'lead', text: 'Sixteen ways to match a new player to their first story. Tap one to try it on a phone.' }),
    group('Instagram first · nothing to build in the app', 'instagram'),
    group('App or web widget', 'app'),
    group('New ideas · round two', 'round2'),
    el('p', { class: 'foot' }, 'Every way scores the same story tags, so the Instagram versions feed the app versions. ', el('a', { href: '?v=credits', text: 'Photo credits' })),
  ));
}

function renderCredits(app) {
  document.title = 'Story City · Photo credits';
  app.innerHTML = '';
  const items = Object.entries(PHOTOS).filter(([, p]) => p && p.url);
  app.append(topbar({ short: 'Photo credits', channel: null }),
    el('main', { class: 'stage credits' },
      el('p', { class: 'muted', text: items.length ? 'Placeholder photos for the mock-up. Swap for Story City photos before anything goes on Instagram.' : 'No photos yet. Every picture is a labelled placeholder.' }),
      el('ul', {}, items.map(([k, p]) => el('li', {}, el('b', { text: k }), ' · ', p.credit || 'no credit given', ' · ', el('a', { href: p.url, text: 'source' }))))));
}

function topbar(meta) {
  return el('header', { class: 'topbar' },
    el('a', { class: 'back', href: './', 'aria-label': 'All ways to choose', text: '‹ All' }),
    el('h1', { text: meta.short }),
    meta.channel ? el('span', { class: 'badge ' + meta.channel, text: meta.channel }) : null);
}

/* ---------- variant mount ---------- */
async function mountVariant(app, slug) {
  const meta = VARIANTS.find(v => v.slug === slug);
  if (!meta) { app.innerHTML = ''; app.append(topbar({ short: 'Not found', channel: null }), el('main', { class: 'stage' }, el('p', { text: `No variant called “${slug}”.` }), el('a', { href: './', text: 'All ways to choose' }))); return; }
  document.title = `Story City · ${meta.short}`;
  app.innerHTML = '';
  const stage = el('main', { class: 'stage', id: 'stage' });
  app.append(topbar(meta), stage);
  let mod;
  try { mod = (await import(`./variants/${slug}.js` + V)).default; }
  catch (e) { console.error(e); stage.append(el('p', { class: 'muted', text: 'This way isn’t built yet.' })); return; }
  const ctx = {
    root: stage, variant: { ...meta, ...mod }, params: new URLSearchParams(location.search),
    stories: STORIES, tokens: TOKENS, score, el, toast, photo, photoEl, carousel,
    finish: (opts) => renderResult(ctx, { frame: meta.channel === 'instagram' ? 'ig' : 'app', ...opts }),
    restart: () => { stage.innerHTML = ''; window.scrollTo(0, 0); mod.mount(ctx); },
    home: () => { location.href = './'; },
    shuffle: (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    style: (css) => { if (!document.querySelector(`style[data-variant="${slug}"]`)) document.head.append(el('style', { 'data-variant': slug, text: css })); },
  };
  mod.mount(ctx);
}

const app = document.getElementById('app');
const params = new URLSearchParams(location.search);
const slug = params.get('v') || location.hash.slice(1);
window.__chooser = { VARIANTS, STORIES, TOKENS, PHOTOS, score };
if (!slug) renderPicker(app);
else if (slug === 'credits') renderCredits(app);
else mountVariant(app, slug);
