// Field Notes: word-bank hints left at a spot by earlier agents. Likes only, never dislikes. Leave one back.
const TEXT = {
  kicker: 'Gem 3 · The Old Clock Tower',
  title: 'Notes left here',
  sub: 'Agents who passed this spot left a few words for you.',
  like: 'Like this note',
  liked: 'Liked',
  report: 'Hide and report this note',
  hidden: 'Note hidden. Thanks for keeping it kind.',
  undo: 'Undo',
  you: 'You',
  leave: 'Leave a Note',
  buildKicker: 'Your note',
  buildTitle: 'Build it from the word bank',
  template: 'Pick a starter',
  pickWord: 'Tap a word for each gap',
  preview: 'Preview',
  leaveIt: 'Leave It Here',
  doneKicker: 'Note left',
  doneTitle: 'The next agent will thank you',
  doneSub: 'Your note stays at The Old Clock Tower. Agents can like it, but no one can say a mean word back.',
  likedLater: (n) => `${n} liked your note ✦`,
  read: 'Read the Notes',
  home: 'Back to Tools',
  blank: '___',
};

// The word bank. Every combination has been checked to stay kind and all-ages.
const WORDS = {
  where: ['up', 'down', 'behind you', 'closer', 'to the left', 'to the right', 'under things', 'near the door'],
  thing: ['puddles', 'geese', 'the wind', 'slippery leaves', 'stairs', 'low branches', 'a dead end', 'a sneaky shortcut'],
  ahead: ['treasure', 'a clue', 'a shortcut', 'stairs', 'something shiny', 'a friendly cat', 'a great view', 'a riddle'],
  cheer: ['keep going', 'look closer', 'it’s worth it', 'trust the map', 'you’ve got this', 'take your time'],
};
const TEMPLATES = [
  { id: 'look', parts: ['Try looking ', 'where'] },
  { id: 'beware', parts: ['Beware of ', 'thing'] },
  { id: 'ahead', parts: ['ahead', ' ahead'] },
  { id: 'wary', parts: ['Be wary of ', 'thing', ' … but ', 'cheer'] },
];
const GAPS = ['where', 'thing', 'ahead', 'cheer'];

// Pretend notes from other agents (fictional codenames).
const SEED = [
  { id: 's1', agent: 'Agent Juniper', when: '2 days ago', likes: 14, t: 'look', w: ['up'] },
  { id: 's2', agent: 'Agent Nightjar', when: 'last week', likes: 9, t: 'wary', w: ['geese', 'it’s worth it'] },
  { id: 's3', agent: 'Agent Pebble', when: 'yesterday', likes: 3, t: 'ahead', w: ['a friendly cat'] },
];
const NAMES = ['Moth', 'Comet', 'Fern', 'Lantern', 'Otter', 'Quill', 'Sparrow', 'Velvet', 'Thistle', 'Ember'];
const STORE = 'storytools-field-notes';
const AGENT = 'storytools-agent';

export default function run(k) {
  const { h, show, bar, toast, openSheet, closeSheet, css, tool, home, onLeave } = k;
  css('field-notes', CSS);
  const state = load();
  const timers = [];
  let gone = false;
  onLeave(() => { gone = true; timers.forEach(clearTimeout); });

  const allNotes = () => [...state.mine.map((n) => ({ ...n, agent: TEXT.you, mine: true })), ...SEED];
  const sentence = (t, w) => {
    let i = 0;
    const tpl = TEMPLATES.find((x) => x.id === t);
    const s = tpl.parts.map((p) => (GAPS.includes(p) ? (w[i++] || TEXT.blank) : p)).join('');
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  /* ---------- 1. the spot card with notes ---------- */
  function spot() {
    const list = h('div', { class: 'fn-list' });
    const draw = () => list.replaceChildren(...allNotes().filter((n) => !state.hidden.includes(n.id)).map(noteCard));
    function noteCard(n) {
      const liked = state.liked.includes(n.id);
      const count = n.likes + (liked ? 1 : 0);
      return h('article', { class: `fn-note${n.mine ? ' mine' : ''}`, 'data-note': n.id },
        h('p', { class: 'fn-text' }, sentence(n.t, n.w)),
        h('div', { class: 'fn-meta' },
          h('span', {}, h('b', {}, n.agent), ` · ${n.when}`),
          h('button', { class: `fn-like${liked ? ' on' : ''}`, 'aria-pressed': String(liked), 'aria-label': TEXT.like, onclick: () => {
            state.liked = liked ? state.liked.filter((x) => x !== n.id) : [...state.liked, n.id];
            save(state); draw();
          } }, h('span', { 'aria-hidden': 'true' }, '✦'), ` ${count}`),
          n.mine ? null : h('button', { class: 'fn-flag', 'aria-label': TEXT.report, onclick: () => hide(n.id) }, '⚑')));
    }
    function hide(id) {
      state.hidden.push(id); save(state); draw();
      const undo = h('button', { class: 'fn-undo', onclick: () => { state.hidden = state.hidden.filter((x) => x !== id); save(state); draw(); undoBar.remove(); } }, TEXT.undo);
      const undoBar = h('div', { class: 'fn-undobar', role: 'status' }, h('span', {}, TEXT.hidden), undo);
      list.after(undoBar);
      timers.push(setTimeout(() => undoBar.remove(), 5000));
    }
    show(
      bar(),
      h('div', { class: 'fn-spot' },
        h('div', { class: 'fn-badge', 'aria-hidden': 'true' }, clockTower()),
        h('div', {}, h('p', { class: 'kicker' }, TEXT.kicker), h('h1', { class: 'display' }, TEXT.title))),
      h('p', { class: 'sub' }, TEXT.sub),
      list,
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, h('button', { class: 'btn jewel', id: 'fnLeave', onclick: build }, TEXT.leave)),
    );
    draw();
  }

  /* ---------- 2. build a note: starter (dropdown) + word chips, live preview ---------- */
  function build() {
    let t = TEMPLATES[0].id;
    let words = [];
    const select = h('select', { class: 'fn-select', id: 'fnTemplate', 'aria-label': TEXT.template },
      TEMPLATES.map((x) => h('option', { value: x.id }, sentence(x.id, []))));
    const preview = h('p', { class: 'fn-text' });
    const chips = h('div', { class: 'fn-chips' });
    const go = h('button', { class: 'btn jewel', id: 'fnLeaveIt', disabled: true, onclick: () => leave(t, words) }, TEXT.leaveIt);
    const gaps = () => TEMPLATES.find((x) => x.id === t).parts.filter((p) => GAPS.includes(p));

    function draw() {
      const g = gaps();
      preview.textContent = sentence(t, words);
      go.disabled = words.length < g.length;
      chips.replaceChildren(...g.map((gap, gi) => h('div', { class: 'fn-gap' },
        g.length > 1 ? h('p', { class: 'fn-gaplabel' }, `${TEXT.pickWord} · ${gi + 1}`) : null,
        h('div', { class: 'tags' }, WORDS[gap].map((word) => h('button', {
          class: `fn-chip${words[gi] === word ? ' on' : ''}`, 'aria-pressed': String(words[gi] === word),
          onclick: () => { words[gi] = word; words = words.slice(0, g.length); draw(); },
        }, word))))));
    }
    select.addEventListener('change', () => { t = select.value; words = []; draw(); });

    show(
      bar(),
      h('p', { class: 'kicker' }, TEXT.buildKicker),
      h('h1', { class: 'display' }, TEXT.buildTitle),
      h('label', { class: 'fn-label', for: 'fnTemplate' }, TEXT.template),
      select,
      h('p', { class: 'fn-label' }, TEXT.pickWord),
      chips,
      h('p', { class: 'fn-label' }, TEXT.preview),
      h('article', { class: 'fn-note mine fn-preview' }, preview,
        h('div', { class: 'fn-meta' }, h('span', {}, h('b', {}, agentName()), ' · just now'))),
      h('div', { class: 'spacer' }),
      h('div', { class: 'btns' }, go),
    );
    draw();
  }

  /* ---------- 3. leave it: saved, then the payoff sheet ---------- */
  function leave(t, w) {
    const note = { id: `m${Date.now()}`, when: 'just now', likes: 0, t, w: [...w] };
    state.mine.unshift(note);
    state.mine = state.mine.slice(0, 5);
    save(state);
    spot();
    openSheet([
      h('div', { class: 'celebrate' },
        h('p', { class: 'kicker' }, TEXT.doneKicker),
        h('article', { class: 'fn-note mine fn-sheetnote' }, h('p', { class: 'fn-text' }, sentence(t, w)),
          h('div', { class: 'fn-meta' }, h('span', {}, h('b', {}, agentName()), ' · just now'))),
        h('h3', {}, TEXT.doneTitle),
        h('p', { class: 'more' }, TEXT.doneSub)),
      h('div', { class: 'btns' },
        h('button', { class: 'btn jewel', onclick: closeSheet }, TEXT.read),
        h('button', { class: 'link', onclick: home }, TEXT.home)),
    ], () => {
      if (gone) return;
      // A pretend agent likes it a moment later: delayed, positive, never a dislike.
      timers.push(setTimeout(() => {
        toast(TEXT.likedLater(`Agent ${NAMES[Math.floor(Math.random() * NAMES.length)]}`));
      }, 1600));
    }, tool.jewel);
  }

  function agentName() {
    try {
      let n = localStorage.getItem(AGENT);
      if (!n) { n = `Agent ${NAMES[Math.floor(Math.random() * NAMES.length)]}`; localStorage.setItem(AGENT, n); }
      return n;
    } catch (e) { return 'Agent Moth'; }
  }

  // A tiny clock tower badge for the spot.
  function clockTower() {
    return h('svg', { viewBox: '0 0 40 56' },
      h('path', { d: 'M20 2 L30 14 L10 14 Z', fill: 'var(--jewel)' }),
      h('rect', { x: '11', y: '14', width: '18', height: '40', rx: '2', fill: 'var(--velvet)', stroke: 'var(--jewel)', 'stroke-width': '1.5' }),
      h('circle', { cx: '20', cy: '25', r: '6', fill: 'var(--pearl)' }),
      h('path', { d: 'M20 25 V21 M20 25 L23 27', stroke: 'var(--midnight)', 'stroke-width': '1.4', 'stroke-linecap': 'round' }),
      h('rect', { x: '16', y: '42', width: '8', height: '12', rx: '4', fill: 'var(--ink)' }));
  }

  spot();
}

function load() {
  const empty = { mine: [], liked: [], hidden: [] };
  try { return { ...empty, ...JSON.parse(localStorage.getItem(STORE) || '{}') }; } catch (e) { return empty; }
}
function save(s) {
  try { localStorage.setItem(STORE, JSON.stringify({ mine: s.mine, liked: s.liked, hidden: s.hidden })); } catch (e) { /* ignore */ }
}

const CSS = `
.fn-spot { display: flex; gap: 14px; align-items: center; }
.fn-badge { flex: none; width: 52px; height: 72px; display: grid; place-items: center; border-radius: 12px; background: color-mix(in srgb, var(--jewel) 14%, transparent); border: 1px solid color-mix(in srgb, var(--jewel) 40%, transparent); }
.fn-badge svg { width: 34px; }
.fn-spot .kicker { margin-bottom: 6px; }
.fn-spot .display { font-size: 30px; }
.fn-list { display: grid; gap: 10px; margin-top: 16px; }
.fn-note { position: relative; border-radius: 12px; padding: 14px 16px 8px; background: var(--velvet); border: 1px solid var(--line); animation: fade 0.3s both; }
.fn-note.mine { border-color: color-mix(in srgb, var(--jewel) 60%, transparent); background: color-mix(in srgb, var(--jewel) 10%, var(--velvet)); }
.fn-text { margin: 0; font: italic 500 22px/1.25 var(--f-head); color: var(--starlight); text-wrap: pretty; }
.fn-meta { display: flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 13px; color: var(--lilac); }
.fn-meta > span { flex: 1; min-width: 0; }
.fn-meta b { color: var(--mist); }
.fn-like, .fn-flag { min-width: 44px; height: 44px; border: 0; background: none; border-radius: 999px; font: 700 14px var(--f-body); color: var(--lilac); padding: 0 10px; }
.fn-like.on { color: var(--jewel); }
.fn-like.on span { display: inline-block; animation: pop 0.3s both; }
.fn-flag { font-size: 16px; opacity: 0.7; }
.fn-undobar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px; padding: 4px 4px 4px 14px; border-radius: 12px; background: var(--ink); font-size: 14px; color: var(--mist); }
.fn-undo { min-height: 44px; border: 0; background: none; color: var(--jewel); font-weight: 700; padding: 0 12px; }
.fn-label { margin: 16px 0 8px; font: 700 12px var(--f-body); letter-spacing: 0.14em; text-transform: uppercase; color: var(--glow); display: block; }
.fn-select { width: 100%; min-height: 48px; border-radius: 12px; border: 1.5px solid var(--line); background: var(--velvet); color: var(--starlight); font: 600 16px var(--f-body); padding: 0 14px; }
.fn-gaplabel { margin: 10px 0 0; font-size: 13px; color: var(--lilac); }
.fn-gap .tags { margin-top: 8px; }
.fn-chip { min-height: 44px; padding: 0 14px; border-radius: 999px; border: 1.5px solid var(--line); background: none; font: 600 14px var(--f-body); color: var(--mist); }
.fn-chip.on { border-color: var(--jewel); background: var(--jewel); color: var(--midnight); }
.fn-preview .fn-meta { min-height: 32px; }
.fn-sheetnote { text-align: left; margin: 4px 0 16px; }
.fn-sheetnote .fn-meta { min-height: 30px; }
`;
