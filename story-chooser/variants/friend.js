// #15 Let a friend choose. Two roles in one file, chosen by the URL.
//   no `f` param  → the sender: name a friend, answer five things about them, make a link.
//   `f=<base64url JSON {name, from, weights, a}>` → the receiver: see what was said, get the story.
// Imports nothing; talks to the shell only through ctx.

const QUESTIONS = [
  { q: 'On a night out they are the one who…', about: 'On a night out you’re the one who', choices: [
    { t: 'plans everything',                          w: ['thoughtful', 'calm'],      said: 'plans everything' },
    { t: 'disappears and comes back with a story',    w: ['adventure', 'lively'],     said: 'disappears and comes back with a story' },
    { t: 'makes everyone laugh',                      w: ['funny', 'playful'],        said: 'makes everyone laugh' },
  ] },
  { q: 'Scary movies:', about: 'Scary movies:', choices: [
    { t: 'front row',         w: ['eerie', 'spooky'],  said: 'front row' },
    { t: 'behind a cushion',  w: ['cozy', 'tender'],   said: 'behind a cushion' },
  ] },
  { q: 'Their ideal Sunday:', about: 'Your ideal Sunday:', choices: [
    { t: 'café and a book',          w: ['cafe', 'cozy', 'mystery'],   said: 'café and a book' },
    { t: 'somewhere outdoors',       w: ['park', 'calm', 'adventure'], said: 'somewhere outdoors' },
    { t: 'downtown, somewhere new',  w: ['downtown', 'lively'],        said: 'downtown, somewhere new' },
  ] },
  { q: 'They would absolutely…', about: 'You would absolutely', choices: [
    { t: 'solve the murder',        w: ['mystery', 'heist'],    said: 'solve the murder' },
    { t: 'befriend the ghost',      w: ['fantasy', 'spooky'],   said: 'befriend the ghost' },
    { t: 'fall for the detective',  w: ['romance', 'tender'],   said: 'fall for the detective' },
  ] },
  { q: 'How long before they get bored?', about: 'You get bored after', choices: [
    { t: 'fifteen minutes',   w: ['quick'],  said: 'fifteen minutes' },
    { t: 'an hour, easily',   w: ['long'],   said: 'an hour, easily' },
  ] },
];

const CSS = `
.v-friend h2 { font-size: 32px; line-height: 1.02; font-weight: 900; margin: 22px 0 8px; text-wrap: balance; }
.v-friend h2.q { font-size: 28px; line-height: 1.05; margin: 12px 0 14px; }
.v-friend .sub { color: var(--muted); font-size: 18px; line-height: 1.25; margin: 0 0 18px; text-wrap: pretty; }
.v-friend label { display: block; font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 16px 0 6px; }
.v-friend input { width: 100%; height: 48px; padding: 0 14px; border-radius: 14px; border: 1px solid var(--line); background: var(--raised); color: var(--text); font: inherit; font-size: 18px; font-weight: 700; outline: none; }
.v-friend input::placeholder { color: rgba(178,181,180,0.7); font-weight: 500; }
.v-friend input:focus { border-color: var(--accent); }
.v-friend input[readonly] { color: var(--muted); font-weight: 500; font-size: 15px; text-overflow: ellipsis; }
.v-friend .btn { margin-top: 16px; }
.v-friend .eyebrow { font-size: 13px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--story); margin-top: 6px; }
.v-friend .back { background: none; border: 0; padding: 6px 8px; margin: 6px 0 0 -8px; min-height: 32px; color: var(--muted); font-weight: 800; font-size: 15px; }
.v-friend .linkrow { display: flex; gap: 8px; margin-top: 6px; }
.v-friend .linkrow input { flex: 1; min-width: 0; }
.v-friend .linkrow .btn { margin: 0; flex: none; padding: 0 16px; }
.v-friend .linkcard { background: var(--raised); border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px 16px; margin-top: 18px; }
.v-friend .linkcard p { margin: 0 0 4px; font-size: 17px; }
.v-friend .fine { color: var(--muted); font-size: 14px; margin: 10px 0 0; text-wrap: pretty; }
.v-friend .fine a { display: inline-block; padding: 5px 0; margin: -5px 0; }
.v-friend .intro { background: var(--raised); border: 1px solid var(--line); border-radius: 16px; padding: 16px 16px 6px; margin: 18px 0 16px; }
.v-friend .intro h2 { margin: 0 0 8px; font-size: 28px; line-height: 1.02; }
.v-friend .intro ul { list-style: none; margin: 0; padding: 0; }
.v-friend .intro li { padding: 10px 0; border-top: 1px solid var(--line); font-size: 17px; line-height: 1.25; }
.v-friend .intro li b { display: block; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
.v-friend .intro li span { font-weight: 800; }
`;

const b64url = {
  enc(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = ''; bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  dec(str) {
    const b = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
    const bin = atob(b); const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  },
};
const clean = (s, fallback) => { s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, 40); return s || fallback; };

export default {
  slug: 'friend',
  title: 'Let a friend choose',
  short: 'Let a friend choose',
  channel: 'app',
  blurb: 'Send a link. A friend answers about you. You get the story.',

  mount(ctx) {
    const { el, root } = ctx;
    ctx.style(CSS);
    const known = new Set(Object.values(ctx.tokens).flat());
    const wrap = el('div', { class: 'v-friend' });
    root.append(wrap);

    const raw = ctx.params.get('f');
    if (raw != null) {
      let payload = null;
      try { payload = b64url.dec(raw); } catch (e) { payload = null; }
      const weights = payload && payload.weights && typeof payload.weights === 'object'
        ? Object.fromEntries(Object.entries(payload.weights).filter(([t, n]) => known.has(t) && Number.isFinite(+n) && +n > 0).map(([t, n]) => [t, +n]))
        : null;
      if (weights && Object.keys(weights).length) return receiver(payload, weights);
      ctx.toast('That link didn’t work. Make a fresh one.', 2600);
    }
    sender();

    /* ---------- the sender ---------- */
    function sender() {
      const st = { name: '', from: '', step: -1, picks: QUESTIONS.map(() => null) };
      const show = () => { wrap.innerHTML = ''; window.scrollTo(0, 0); wrap.append(st.step < 0 ? nameStep() : st.step < QUESTIONS.length ? question(st.step) : linkStep()); };

      const field = (label, value, placeholder, onInput, id) => [
        el('label', { for: id, text: label }),
        el('input', { id, type: 'text', value, placeholder, autocomplete: 'off', autocapitalize: 'words', maxlength: '40', onInput: (e) => onInput(e.target.value) }),
      ];

      function nameStep() {
        const start = () => { st.step = 0; show(); };
        return el('div', {},
          el('h2', { text: 'Let someone who knows you choose' }),
          el('p', { class: 'sub', text: 'Answer five quick things about a friend. We’ll send them the story.' }),
          field('Who is this for?', st.name, 'Their first name', (v) => { st.name = v; }, 'f-name'),
          el('button', { class: 'btn primary block', type: 'button', text: 'Start', onClick: start }),
          el('p', { class: 'fine', text: 'Nothing is saved anywhere. The answers travel inside the link.' }));
      }

      function question(i) {
        const q = QUESTIONS[i]; const name = clean(st.name, 'your friend');
        return el('div', {},
          el('div', { class: 'progress', 'aria-hidden': 'true' }, QUESTIONS.map((_, j) => el('i', { class: j <= i ? 'on' : '' }))),
          el('div', { class: 'eyebrow', text: `About ${name} · ${i + 1} of ${QUESTIONS.length}` }),
          el('h2', { class: 'q', text: q.q }),
          q.choices.map((c, k) => el('button', { class: 'choice' + (st.picks[i] === k ? ' on' : ''), type: 'button', text: c.t, onClick: () => { st.picks[i] = k; st.step = i + 1; show(); } })),
          el('button', { class: 'back', type: 'button', text: '‹ Back', onClick: () => { st.step = i - 1; show(); } }));
      }

      function weights() {
        const w = {};
        st.picks.forEach((k, i) => { if (k == null) return; for (const t of QUESTIONS[i].choices[k].w) if (known.has(t)) w[t] = (w[t] || 0) + 1; });
        return w;
      }

      function linkStep() {
        const name = clean(st.name, 'your friend');
        const out = el('input', { type: 'text', readonly: true, 'aria-label': 'Link to send', value: '' });
        const copyBtn = el('button', { class: 'btn', type: 'button', text: 'Copy', disabled: true, onClick: copy });
        const openBtn = el('button', { class: 'btn primary block', type: 'button', text: `Open it as ${name} would`, disabled: true, onClick: () => { if (out.value) location.href = out.value; } });
        const card = el('div', { class: 'linkcard', hidden: true },
          el('p', { text: `Send this to ${name}.` }),
          el('div', { class: 'linkrow' }, out, copyBtn),
          openBtn);
        const make = () => {
          const payload = { name, from: clean(st.from, 'A friend'), weights: weights(), a: st.picks };
          out.value = `${location.origin}${location.pathname}?v=friend&f=${b64url.enc(payload)}`;
          copyBtn.disabled = false; openBtn.disabled = false; card.hidden = false;
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
        function copy() {
          const text = out.value; const done = () => ctx.toast(`Copied. Send it to ${name}.`);
          const fallback = () => { out.focus(); out.select(); ctx.toast('Select the link and copy it.', 2600); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
          else fallback();
        }
        return el('div', {},
          el('div', { class: 'progress', 'aria-hidden': 'true' }, QUESTIONS.map(() => el('i', { class: 'on' }))),
          el('div', { class: 'eyebrow', text: 'Last thing' }),
          el('h2', { text: 'Make the link' }),
          el('p', { class: 'sub', text: `${name} sees your answers, then the story they add up to.` }),
          field('And you are?', st.from, 'Your first name', (v) => { st.from = v; }, 'f-from'),
          el('button', { class: 'btn primary block make', type: 'button', text: 'Make the link', onClick: make }),
          card,
          el('button', { class: 'back', type: 'button', text: '‹ Back', onClick: () => { st.step = QUESTIONS.length - 1; show(); } }));
      }

      show();
    }

    /* ---------- the receiver ---------- */
    function receiver(payload, weights) {
      const from = clean(payload.from, 'A friend');
      const picks = Array.isArray(payload.a) ? payload.a : [];
      const said = (i) => { const k = picks[i]; const c = QUESTIONS[i] && QUESTIONS[i].choices[k]; return c ? c.said : null; };
      const items = QUESTIONS.map((q, i) => said(i) ? el('li', {}, el('b', { text: q.about }), el('span', { text: said(i) })) : null).filter(Boolean);
      const one = said(0), two = said(3);
      const why = one && two ? `${from} says you’re the one who ${one} and would ${two}.`
        : one ? `${from} says you’re the one who ${one}.`
        : two ? `${from} says you would absolutely ${two}.`
        : `${from} answered for you, so you can blame them.`;
      wrap.append(
        el('div', { class: 'eyebrow', text: 'A story, chosen for you' }),
        el('div', { class: 'intro' },
          el('h2', { text: `${from} answered five questions about you.` }),
          items.length ? el('ul', {}, items) : el('p', { class: 'muted', text: 'They kept the answers to themselves.' })),
        el('button', { class: 'btn primary block', type: 'button', text: 'Show me my story',
          onClick: () => ctx.finish({ weights, why, headline: `${from} chose for you` }) }),
        el('p', { class: 'fine' }, 'Want to return the favour? ', el('a', { href: `${location.pathname}?v=friend`, text: 'Choose one for them' }), '.'));
    }
  },
};
