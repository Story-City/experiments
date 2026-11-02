// Story Stamp: every walker who stops at a spot adds one line.
// No free typing: you build your line from a sentence and a bank of word chips,
// so every line is kind and safe for walkers of any age. Then it gets an ink stamp.

const TEXT = {
  kicker: "You're standing at",
  spot: 'The bench by the library',
  spotNote: 'A pretend spot for this demo',
  soFar: 'The story so far',
  you: 'You',
  here: 'right here',
  add: 'Add Your Line',
  like: 'Like this line',
  liked: 'You like this line',
  report: 'Report',
  reportLabel: 'Report this line and hide it',
  hiddenToast: 'Hidden. Thanks for looking out.',
  hiddenNote: (n) => (n === 1 ? '1 line hidden by you' : `${n} lines hidden by you`),
  unhide: 'Show Them Again',
  pickKicker: 'Your line · step 1 of 2',
  pickTitle: 'Pick a sentence',
  endsWith: 'The story so far ends with:',
  fillKicker: 'Your line · step 2 of 2',
  fillTitle: 'Fill the blanks',
  fillFor: { thing: 'Pick a someone or something', place: 'Pick a place', action: 'Pick what happens', feel: 'Pick a feeling' },
  tapBlank: 'Tap a blank to change it.',
  surprise: 'Surprise Me',
  other: 'Different Sentence',
  safe: 'Lines are built from the word bank, so they stay kind for walkers of every age.',
  stamp: 'Stamp It',
  payKicker: 'Stamped',
  payTitle: 'The story, with your line in it.',
  share: 'Share the Story',
  back: 'Back to Tools',
  shared: 'Story copied, ready to paste',
  noShare: 'Sharing works on phones',
  brand: 'Story City',
};

const STORE = 'st-story-stamp-v2';      // new key: the old version kept free text
const LIKES = 'st-story-stamp-likes';
const HIDDEN = 'st-story-stamp-hidden';

// The word bank. Every word fits every sentence; a test reads all combinations.
// a = the article to use before a thing ("an owl").
const WORDS = {
  thing: [
    { w: 'crow', a: 'a' }, { w: 'snail', a: 'a' }, { w: 'teapot', a: 'a' }, { w: 'lamplighter', a: 'a' },
    { w: 'kite', a: 'a' }, { w: 'moon', a: 'a' }, { w: 'baker', a: 'a' }, { w: 'goose', a: 'a' },
    { w: 'lantern', a: 'a' }, { w: 'squirrel', a: 'a' }, { w: 'umbrella', a: 'an' }, { w: 'owl', a: 'an' },
  ],
  place: ['bakery', 'duck pond', 'library steps', 'old oak tree', 'bus stop', 'fountain', 'red door', 'bandstand'].map((w) => ({ w })),
  action: ['dance a little jig', 'sing to the pigeons', 'bake a giant pancake', 'tell a silly joke', 'fall fast asleep',
    'drift up into the clouds', 'start a tiny parade', 'count every star'].map((w) => ({ w })),
  feel: ['marvellous', 'wobbly', 'sparkly', 'puzzling', 'peaceful', 'giggly'].map((w) => ({ w })),
};

// Sentences: strings stay as written, { s } is a blank of that word type, art adds "a"/"an".
const TEMPLATES = [
  ['Then ', { s: 'thing', art: true }, ' appeared by the ', { s: 'place' }, '.'],
  ['Nobody expected the ', { s: 'thing' }, ' to ', { s: 'action' }, '.'],
  ['The ', { s: 'thing' }, ' whispered a secret to the ', { s: 'thing' }, '.'],
  ['Down at the ', { s: 'place' }, ', the frogs began to ', { s: 'action' }, '.'],
  ['It was the most ', { s: 'feel' }, ' night the ', { s: 'thing' }, ' had ever seen.'],
];

// Pretend walkers (agent code names, never real names), each line built from the same bank.
// warm = how much love the line already has, shown only as a soft glow.
const SEED = [
  { id: 's1', who: 'Agent Juniper', where: 'Oliver', warm: 2, tpl: 0, words: ['crow', 'library steps'] },
  { id: 's2', who: 'Agent Pip', where: 'Garneau', warm: 1, tpl: 1, words: ['crow', 'tell a silly joke'] },
  { id: 's3', who: 'Agent Moth', where: 'Westmount', warm: 0, tpl: 2, words: ['goose', 'moon'] },
  { id: 's4', who: 'Agent Fern', where: 'Strathcona', warm: 2, tpl: 3, words: ['bakery', 'bake a giant pancake'] },
  { id: 's5', who: 'Agent Otter', where: 'Highlands', warm: 1, tpl: 4, words: ['marvellous', 'moon'] },
];

// Turn a sentence + chosen words into plain text (blanks show as ___).
export function render(tpl, words) {
  let i = 0;
  return TEMPLATES[tpl].map((part) => {
    if (typeof part === 'string') return part;
    const w = words[i++];
    if (!w) return '___';
    const entry = WORDS[part.s].find((x) => x.w === w);
    return part.art ? `${entry?.a || 'a'} ${w}` : w;
  }).join('');
}
export { WORDS, TEMPLATES };

export default function run(k) {
  const { h } = k;
  css(k);

  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? fallback; } catch (e) { return fallback; }
  }
  function keep(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* demo still works */ } }
  const mineList = () => { const v = load(STORE, []); return Array.isArray(v) ? v : []; };
  const likes = () => new Set(load(LIKES, []));
  const hidden = () => new Set(load(HIDDEN, []));
  const seedLines = () => SEED.map((l) => ({ ...l, text: render(l.tpl, l.words) }));
  const lines = () => {
    const hide = hidden();
    return [...seedLines().filter((l) => !hide.has(l.id)),
      ...mineList().map((l) => ({ ...l, who: TEXT.you, where: TEXT.here, mine: true }))];
  };
  const today = () => new Date().toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric' });
  read();

  /* ---------- read the story ---------- */
  function read(justAdded) {
    const all = lines();
    const liked = likes();
    const nHidden = SEED.filter((l) => hidden().has(l.id)).length;
    k.show(
      k.bar(`${all.length} lines`),
      h('p', { class: 'kicker' }, TEXT.kicker),
      h('h1', { class: 'display' }, TEXT.spot),
      h('p', { class: 'hint' }, TEXT.spotNote),
      h('p', { class: 'kicker ss-sofar' }, TEXT.soFar),
      h('ol', { class: 'ss-lines' }, all.map((l, i) => lineItem(l, justAdded && i === all.length - 1, liked))),
      nHidden ? h('p', { class: 'hint centre ss-hidden' }, TEXT.hiddenNote(nHidden), ' · ',
        h('button', { class: 'link', onclick: () => { keep(HIDDEN, []); read(); } }, TEXT.unhide)) : null,
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', onclick: pickSentence }, TEXT.add)));
    if (justAdded) thud();
  }

  // One line of the story. Other walkers' lines get a like star and a quiet report flag.
  function lineItem(l, fresh, liked) {
    const li = h('li', { class: `ss-line${l.mine ? ' mine' : ''}${fresh ? ' fresh' : ''}`, 'data-id': l.id || '' },
      h('p', {}, l.text),
      h('span', { class: 'ss-who' }, `${l.who} · ${l.where}`),
      l.mine ? h('div', { class: 'ss-mini' }, stamp(l.date, 'var(--jewel)')) : null);
    if (l.mine) return li;
    const on = liked.has(l.id);
    const warm = () => Math.min(3, l.warm + (likes().has(l.id) ? 1 : 0));
    li.dataset.warm = warm();
    const star = h('button', { class: 'ss-like', 'aria-pressed': String(on), 'aria-label': on ? TEXT.liked : TEXT.like, onclick: () => {
      const set = likes();
      if (set.has(l.id)) set.delete(l.id); else set.add(l.id);
      keep(LIKES, [...set]);
      const now = set.has(l.id);
      star.setAttribute('aria-pressed', String(now));
      star.setAttribute('aria-label', now ? TEXT.liked : TEXT.like);
      li.dataset.warm = warm();
    } }, '✦');
    const flag = h('button', { class: 'ss-report', 'aria-label': TEXT.reportLabel, onclick: () => {
      const set = hidden(); set.add(l.id); keep(HIDDEN, [...set]);
      li.classList.add('ss-going');
      const t = setTimeout(() => read(), 320);
      k.onLeave(() => clearTimeout(t));
      k.toast(TEXT.hiddenToast);
    } }, TEXT.report);
    li.append(h('div', { class: 'ss-acts' }, star, flag));
    return li;
  }

  // The big stamp slams down over the screen, then the sheet opens.
  function thud() {
    const big = h('div', { class: 'ss-thud', 'aria-hidden': 'true' }, stamp(today(), 'var(--jewel)'));
    (document.getElementById('phone') || document.body).append(big);
    const last = document.querySelector('.ss-line.fresh');
    last?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const t1 = setTimeout(() => big.remove(), 1300);
    k.onLeave(() => big.remove());
    const t2 = setTimeout(payoff, 1350);
    k.onLeave(() => { clearTimeout(t1); clearTimeout(t2); });
  }

  /* ---------- step 1: pick a sentence ---------- */
  function pickSentence() {
    const all = lines();
    const last = all[all.length - 1];
    k.show(
      k.bar(TEXT.spot),
      h('p', { class: 'kicker' }, TEXT.pickKicker),
      h('h1', { class: 'display' }, TEXT.pickTitle),
      last ? [h('p', { class: 'hint ss-ends' }, TEXT.endsWith), h('blockquote', { class: 'ss-quote' }, last.text)] : null,
      h('div', { class: 'ss-tpls' }, TEMPLATES.map((_, i) => h('button', { class: 'ss-tpl', 'data-tpl': i, onclick: () => fill(i) },
        sentence(i, [], -1)))),
      h('p', { class: 'hint ss-safe' }, TEXT.safe));
  }

  /* ---------- step 2: fill the blanks from word chips ---------- */
  function fill(tpl, words = []) {
    const slots = TEMPLATES[tpl].filter((p) => typeof p !== 'string');
    let active = Math.max(0, words.findIndex((w) => !w));
    if (words.length < slots.length && words.every(Boolean)) active = words.length;
    const preview = h('blockquote', { class: 'ss-quote ss-preview', 'aria-live': 'polite' });
    const label = h('p', { class: 'ss-prompt' });
    const chips = h('div', { class: 'ss-chips' });
    const go = h('button', { class: 'btn jewel', disabled: true, onclick: () => send() }, TEXT.stamp);

    function paint() {
      preview.replaceChildren(...sentence(tpl, words, active, (i) => { active = i; paint(); }).flat(Infinity));
      const type = slots[active].s;
      label.textContent = TEXT.fillFor[type];
      // A word can't fill both blanks ("the goose whispered to the goose").
      const taken = words.filter((w, i) => w && i !== active);
      chips.replaceChildren(...WORDS[type].filter((x) => !taken.includes(x.w)).map((x) => h('button', {
        class: 'ss-chip', 'aria-pressed': String(words[active] === x.w), onclick: () => {
          words[active] = x.w;
          const next = slots.findIndex((_, i) => !words[i]);
          if (next >= 0) active = next;
          paint();
        },
      }, x.w)));
      go.disabled = !(slots.every((_, i) => words[i]));
    }
    function surprise() {
      const pickd = [];
      slots.forEach((sl, i) => { pickd[i] = k.pick(WORDS[sl.s].filter((x) => !pickd.includes(x.w))).w; });
      words = pickd; active = 0; paint();
    }
    function send() {
      if (!slots.every((_, i) => words[i])) return;
      const list = mineList();
      list.push({ id: `m${Date.now()}`, tpl, words: words.slice(), text: render(tpl, words), date: today() });
      keep(STORE, list);
      read(true);
    }

    k.show(
      k.bar(TEXT.spot),
      h('p', { class: 'kicker' }, TEXT.fillKicker),
      h('h1', { class: 'display' }, TEXT.fillTitle),
      preview,
      h('p', { class: 'hint ss-tap' }, TEXT.tapBlank),
      label,
      chips,
      h('div', { class: 'ss-links' },
        h('button', { class: 'link', onclick: surprise }, TEXT.surprise),
        h('button', { class: 'link', onclick: pickSentence }, TEXT.other)),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, go));
    paint();
  }

  // A sentence with its blanks as little tappable slots (or plain spans on the picker).
  function sentence(tpl, words, active, onSlot) {
    let i = 0;
    return TEMPLATES[tpl].map((part) => {
      if (typeof part === 'string') return part;
      const n = i++;
      const w = words[n];
      const entry = w && WORDS[part.s].find((x) => x.w === w);
      const art = part.art ? `${entry?.a || 'a'} ` : '';
      const txt = w || ' ___ ';
      if (!onSlot) return [art, h('span', { class: 'ss-blank' }, txt)];
      return [art, h('button', { class: `ss-slot${n === active ? ' on' : ''}${w ? ' full' : ''}`, onclick: () => onSlot(n) }, txt)];
    });
  }

  /* ---------- payoff: the whole story on a pearl page ---------- */
  function payoff() {
    const all = lines();
    const mine = all.filter((l) => l.mine).pop();
    k.openSheet([
      h('p', { class: 'kicker' }, TEXT.payKicker),
      h('h3', {}, TEXT.payTitle),
      h('div', { class: 'ss-page' },
        h('p', { class: 'ss-page-title' }, TEXT.spot),
        all.map((l) => h('p', { class: `ss-page-line${l.mine ? ' mine' : ''}` }, l.text)),
        h('div', { class: 'ss-page-stamp' }, stamp(mine ? mine.date : today(), '#46337e'))),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: () => share(all) }, TEXT.share),
        h('button', { class: 'link', onclick: k.home }, TEXT.back)),
    ], null, k.tool.jewel);
  }

  async function share(all) {
    const text = `${TEXT.spot}\n\n${all.map((l) => l.text).join('\n')}\n\n${TEXT.brand}`;
    try {
      if (navigator.share) { await navigator.share({ title: TEXT.spot, text }); return; }
      await navigator.clipboard.writeText(text);
      k.toast(TEXT.shared);
    } catch (e) { k.toast(TEXT.noShare); }
  }
}

/* ---------- the round ink stamp (needs textPath, so its own SVG maker) ---------- */
const NS = 'http://www.w3.org/2000/svg';
let stampNo = 0;
function s(tag, attrs = {}, ...kids) {
  const el = document.createElementNS(NS, tag);
  for (const [a, v] of Object.entries(attrs)) el.setAttribute(a, v);
  for (const kid of kids.flat()) if (kid != null) el.append(kid);
  return el;
}
function stamp(date, ink) {
  const id = `ss-arc-${++stampNo}`;
  return s('svg', { viewBox: '0 0 120 120', class: 'ss-stamp', style: `--ink:${ink}` },
    s('defs', {}, s('path', { id, d: 'M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0' })),
    s('circle', { cx: 60, cy: 60, r: 56, class: 'ss-r1' }),
    s('circle', { cx: 60, cy: 60, r: 50, class: 'ss-r2' }),
    s('circle', { cx: 60, cy: 60, r: 30, class: 'ss-r2' }),
    s('text', { class: 'ss-arc' }, s('textPath', { href: `#${id}`, startOffset: '0' }, `${TEXT.spot.toUpperCase()} ✦ STORY CITY ✦`)),
    s('text', { x: 60, y: 57, 'text-anchor': 'middle', class: 'ss-star' }, '✦'),
    s('text', { x: 60, y: 72, 'text-anchor': 'middle', class: 'ss-date' }, String(date).toUpperCase()));
}

function css(k) {
  k.css('story-stamp', `
.ss-sofar { margin-top: 22px; }
.ss-lines { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; counter-reset: ss; }
.ss-line { position: relative; background: var(--velvet); border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px 10px 44px; counter-increment: ss; }
.ss-line::before { content: counter(ss); position: absolute; left: 12px; top: 11px; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--line); display: grid; place-items: center;
  font: 700 11px var(--f-body); color: var(--lilac); }
.ss-line p { margin: 0; font: italic 500 18px/1.3 var(--f-head); color: var(--starlight); text-wrap: pretty; }
.ss-who { display: block; margin-top: 6px; font: 700 10.5px/1.3 var(--f-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--lilac); }
.ss-line.mine { border-color: color-mix(in srgb, var(--jewel) 60%, transparent); padding-right: 70px; background: radial-gradient(90% 120% at 100% 50%, color-mix(in srgb, var(--jewel) 16%, transparent), transparent 70%), var(--velvet); }
.ss-line.mine::before { border-color: var(--jewel); color: var(--jewel); }
.ss-mini { position: absolute; right: 8px; top: 50%; width: 56px; translate: 0 -50%; rotate: -12deg; opacity: 0.9; }
.ss-line.fresh .ss-mini { animation: ss-in 0.4s 1s cubic-bezier(0.2, 1.4, 0.4, 1) both; }
.ss-line.fresh { animation: fade 0.4s ease both; }
@keyframes ss-in { from { opacity: 0; scale: 1.6; } }
.ss-stamp { width: 100%; display: block; overflow: visible; }
.ss-r1 { fill: none; stroke: var(--ink); stroke-width: 3; }
.ss-r2 { fill: none; stroke: var(--ink); stroke-width: 1.2; }
.ss-arc { font: 800 7.8px var(--f-body); letter-spacing: 0.12em; fill: var(--ink); }
.ss-star { font-size: 14px; fill: var(--ink); }
.ss-date { font: 800 9px var(--f-body); letter-spacing: 0.08em; fill: var(--ink); }
.ss-thud { position: absolute; left: 50%; top: 42%; width: 220px; translate: -50% -50%; z-index: 5; pointer-events: none;
  animation: ss-thud 1.3s cubic-bezier(0.3, 1.3, 0.5, 1) both; filter: drop-shadow(0 0 20px color-mix(in srgb, var(--jewel) 50%, transparent)); }
@keyframes ss-thud {
  0% { opacity: 0; transform: scale(2.4) rotate(10deg); }
  22% { opacity: 1; transform: scale(0.94) rotate(-10deg); }
  30% { transform: scale(1.02) rotate(-8deg); }
  75% { opacity: 1; transform: scale(1) rotate(-8deg); }
  100% { opacity: 0; transform: scale(0.4) rotate(-14deg) translate(120px, 260px); }
}
.ss-ends { margin: 18px 0 6px; }
.ss-quote { margin: 0; padding: 10px 14px; border-left: 3px solid var(--jewel); font: italic 500 18px/1.3 var(--f-head); color: var(--mist); background: var(--velvet); border-radius: 0 10px 10px 0; }
.ss-prompt { margin: 18px 0 8px; font: 600 15px var(--f-body); color: var(--glow); }
.ss-preview { font-size: 20px; line-height: 1.6; color: var(--starlight); min-height: 92px; }
.ss-slot, .ss-blank { font: inherit; color: var(--glow); }
.ss-slot { min-height: 40px; padding: 2px 8px; margin: 2px 0; border: 0; border-bottom: 2px dashed var(--line); border-radius: 6px 6px 0 0; background: color-mix(in srgb, var(--jewel) 10%, transparent); font-style: italic; }
.ss-slot.full { color: var(--starlight); border-bottom-style: solid; }
.ss-slot.on { border-bottom-color: var(--jewel); background: color-mix(in srgb, var(--jewel) 28%, transparent); box-shadow: 0 0 14px color-mix(in srgb, var(--jewel) 40%, transparent); }
.ss-blank { letter-spacing: 0.04em; }
.ss-tap { margin: 6px 0 0; font-size: 13px; }
.ss-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ss-chip { min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--velvet); color: var(--mist); font: italic 500 16px var(--f-head); }
.ss-chip[aria-pressed="true"] { background: var(--jewel); border-color: var(--jewel); color: var(--midnight); }
.ss-links { display: flex; justify-content: center; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.ss-tpls { display: grid; gap: 10px; margin-top: 18px; }
.ss-tpl { text-align: left; min-height: 56px; padding: 12px 16px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--velvet); color: var(--starlight); font: italic 500 18px/1.35 var(--f-head); }
.ss-tpl:active { border-color: var(--jewel); }
.ss-safe { margin-top: 16px; }
.ss-acts { display: flex; align-items: center; gap: 4px; margin: 0 -6px -8px -12px; }
.ss-like { width: 44px; height: 44px; border-radius: 50%; border: 0; background: none; color: var(--lilac); font-size: 20px; transition: color 0.2s, text-shadow 0.2s, transform 0.15s; }
.ss-like[aria-pressed="true"] { color: var(--jewel); text-shadow: 0 0 12px var(--jewel); animation: pop 0.35s both; }
.ss-report { margin-left: auto; min-height: 44px; padding: 0 8px; border: 0; background: none; color: var(--lilac); opacity: 0.7; font: 600 12px var(--f-body); text-decoration: underline; text-underline-offset: 3px; }
.ss-line[data-warm="1"] { box-shadow: 0 0 12px color-mix(in srgb, var(--jewel) 14%, transparent); }
.ss-line[data-warm="2"] { box-shadow: 0 0 18px color-mix(in srgb, var(--jewel) 24%, transparent); border-color: color-mix(in srgb, var(--jewel) 30%, var(--line)); }
.ss-line[data-warm="3"] { box-shadow: 0 0 24px color-mix(in srgb, var(--jewel) 36%, transparent); border-color: color-mix(in srgb, var(--jewel) 50%, var(--line)); }
.ss-line { transition: box-shadow 0.4s, border-color 0.4s, opacity 0.3s, transform 0.3s; }
.ss-line.ss-going { opacity: 0; transform: translateX(-20px); }
.ss-hidden { margin-top: 12px; }
.ss-hidden .link { padding: 8px; }
.ss-page { position: relative; margin: 16px 2px 0; background: var(--pearl); color: var(--midnight); border-radius: 6px; padding: 16px 16px 18px; rotate: -1deg;
  box-shadow: 0 18px 40px rgba(11, 6, 32, 0.5); max-height: 46vh; overflow-y: auto; animation: land 0.55s cubic-bezier(0.2, 1.3, 0.4, 1) both; }
.ss-page-title { font: 600 22px/1.1 var(--f-head); margin: 0 0 10px; padding-right: 70px; }
.ss-page-line { margin: 0 0 8px; font: italic 500 16px/1.35 var(--f-head); }
.ss-page-line.mine { background: color-mix(in srgb, var(--jewel) 30%, transparent); border-radius: 4px; padding: 2px 6px; margin-left: -6px; margin-right: -6px; }
.ss-page-stamp { position: absolute; top: 8px; right: 10px; width: 66px; rotate: 14deg; opacity: 0.8; }
`);
}
