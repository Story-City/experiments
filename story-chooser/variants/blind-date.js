// Variant 23 · Blind date with a story. Three parcels in brown paper, like a library's "Blind Date with a Book":
// three hint words and a first line on each, cover hidden. Pick one, tear the paper (drag across it or tap three
// times), meet your story. One cosy, one creepy, one funny every time. Imports nothing; talks to the shell only through ctx.

// Hand-written per story: three hint words and a chapter-1 opener (second person, under 18 words).
const DATES = {
  cosy: [
    { id: 'barista', hints: ['fae', 'coffee', 'bargains'], line: 'You order a flat white. The barista asks what you’re willing to trade for it.' },
    { id: 'jubilee', hints: ['bunting', 'clues', 'honey'], line: 'The garden party has cake, bunting and one very worried detective asking for you by name.' },
    { id: 'squeaky', hints: ['dog', 'park', 'lost toy'], line: 'Your dog is home. Squeaky is not. Someone has to retrace this afternoon.' },
  ],
  creepy: [
    { id: 'frightnight', hints: ['ghosts', 'torch', 'first shift'], line: 'Your new boss hands you a torch, a bell and a waiver. Sign quickly.' },
    { id: 'omicron', hints: ['signal', 'danger', 'future'], line: 'Your phone lights up with a message from a number that doesn’t exist yet.' },
    { id: 'parable', hints: ['phone', 'demands', 'deadline'], line: 'Unknown number. You answer. A calm voice reads out your address, then the first demand.' },
    { id: 'chase', hints: ['tunnels', 'claws', 'bus stop'], line: 'Something with too many legs just ran past the bus stop. Nobody else noticed.' },
    { id: 'powerplay', hints: ['hockey', 'timeline', 'whodunit'], line: 'A detective in a very old coat says last night’s game ended wrong. Fix it.' },
  ],
  funny: [
    { id: 'woglins', hints: ['gremlins', 'lawn', 'oops'], line: 'You only opened the box for a second. Now the Legislature lawn is giggling.' },
    { id: 'coronet', hints: ['crew', 'crown', 'alibi'], line: 'Three strangers slide into your booth. ‘We hear you’re good with locks. Prove it.’' },
    { id: 'loveyeg', hints: ['city', 'crush', 'self-help'], line: 'Edmonton, you and I need to talk. Put your shoes on. This could take an hour.' },
  ],
};
const FOR = { cosy: 'for a cosy walk', creepy: 'for a creepy night', funny: 'for a good laugh' };

// A ragged tear line across the middle, in a 0–100 box.
const TEAR = (() => {
  const pts = []; const ys = [50, 46, 53, 47, 55, 48, 52, 45, 54, 49, 51, 46, 53, 50];
  for (let i = 0; i < ys.length; i++) pts.push([+(i * 100 / (ys.length - 1)).toFixed(2), ys[i]]);
  return pts;
})();
const clipTop = `polygon(0% 0%, 100% 0%, ${TEAR.slice().reverse().map(([x, y]) => `${x}% ${y}%`).join(', ')})`;
const clipBottom = `polygon(${TEAR.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%, 0% 100%)`;

const SCRIPT = '"Bradley Hand", "Segoe Print", "Chalkboard SE", "Comic Sans MS", "Marker Felt", cursive';
const STAMP = '"American Typewriter", "Courier New", ui-monospace, monospace';

const CSS = `
.v-blind-date { padding-top: 14px; }
.v-blind-date h2 { font-size: 34px; line-height: 0.98; font-weight: 900; margin: 4px 0 6px; text-wrap: balance; }
.v-blind-date .lead { margin: 0 0 16px; color: var(--muted); font-size: 18px; line-height: 1.2; text-wrap: pretty; }
.v-blind-date .note { font-size: 15px; line-height: 1.25; margin: 10px 0 0; text-wrap: pretty; }
.v-blind-date .love { margin-top: 18px; padding: 12px 14px; border-radius: 14px; background: var(--raised); border: 1px solid var(--line); font-size: 17px; font-weight: 700; line-height: 1.2; }
.v-blind-date .love .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.v-blind-date .love .chips i { font-style: normal; font-size: 14px; font-weight: 800; padding: 3px 10px; border-radius: 999px; background: rgba(255, 255, 255, 0.08); color: var(--muted); }

/* ---- kraft paper ---- */
.v-blind-date .kraft { position: relative; color: #3b2614; overflow: hidden;
  background:
    repeating-linear-gradient(97deg, rgba(90, 55, 20, 0.07) 0 1px, transparent 1px 7px),
    repeating-linear-gradient(8deg, rgba(255, 240, 210, 0.08) 0 2px, transparent 2px 11px),
    radial-gradient(120% 90% at 20% 10%, #d8b48a, #c49866 55%, #ad7f4f); }
.v-blind-date .kraft::before, .v-blind-date .kraft::after { content: ""; position: absolute; z-index: 1; pointer-events: none;
  background: repeating-linear-gradient(45deg, #f1e6cf 0 3px, #cdbb98 3px 5px); box-shadow: 0 1px 2px rgba(60, 30, 0, 0.35); }
.v-blind-date .kraft::before { top: 0; bottom: 0; left: 22%; width: 5px; }
.v-blind-date .kraft::after { left: 0; right: 0; top: 30%; height: 5px; }
.v-blind-date .bow { position: absolute; z-index: 2; left: calc(22% + 2.5px); top: calc(30% + 2.5px); width: 0; height: 0; pointer-events: none; }
.v-blind-date .bow i { position: absolute; width: 22px; height: 13px; border: 3px solid #e9dcc0; border-radius: 50%; top: -8px; }
.v-blind-date .bow i:first-child { right: 0; transform: rotate(-24deg); }
.v-blind-date .bow i:last-child { left: 0; transform: rotate(24deg); }
.v-blind-date .tag { position: absolute; z-index: 3; top: 12px; right: 12px; padding: 6px 12px 7px 16px; background: #fbf6ea; color: #2f2a6b; border-radius: 4px 10px 10px 4px;
  font-family: ${SCRIPT}; font-size: 17px; line-height: 1.05; transform: rotate(3deg); box-shadow: 0 2px 4px rgba(50, 25, 0, 0.3); white-space: nowrap; }
.v-blind-date .tag::before { content: ""; position: absolute; left: 5px; top: 50%; width: 6px; height: 6px; margin-top: -3px; border-radius: 50%; background: #c49866; }
.v-blind-date .tag b { font-weight: 700; }

/* ---- three parcels ---- */
.v-blind-date .parcels { display: grid; gap: 14px; }
.v-blind-date .parcel { display: block; width: 100%; padding: 0; border: 0; border-radius: 10px; text-align: left; box-shadow: 0 10px 22px rgba(0, 0, 0, 0.4); transition: transform 0.2s; }
.v-blind-date .parcel:active { transform: scale(0.985) rotate(-0.4deg); }
.v-blind-date .parcel .body { position: relative; z-index: 3; padding: 74px 18px 18px 18px; }
.v-blind-date .parcel.kraft::after { top: 56px; }
.v-blind-date .parcel .bow { top: 58.5px; }
.v-blind-date .hints { font-family: ${STAMP}; font-size: 15px; letter-spacing: 0.04em; color: #5a2d12; font-weight: 700; margin-bottom: 8px; }
.v-blind-date .first { font-family: ${SCRIPT}; font-size: 21px; line-height: 1.22; color: #2a1a0c; text-wrap: pretty; }
.v-blind-date .parcel .body .first { background: rgba(251, 246, 234, 0.82); padding: 8px 11px 9px; border-radius: 6px; box-shadow: 0 1px 3px rgba(50, 25, 0, 0.25); }
.v-blind-date .parcel .pick { display: block; margin-top: 10px; font-weight: 800; font-size: 16px; color: #3b2614; text-align: right; }

/* ---- the tear ---- */
.v-blind-date .card { background: var(--raised); border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; margin-bottom: 14px; }
.v-blind-date .card .hints { color: var(--story); margin-bottom: 6px; }
.v-blind-date .card .first { color: var(--text); font-size: 21px; }
.v-blind-date .stage-t { position: relative; aspect-ratio: 4 / 3.3; border-radius: 12px; overflow: hidden; background: #0e0726; box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45); touch-action: pan-y; user-select: none; -webkit-user-select: none; cursor: grab; }
.v-blind-date .stage-t:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.v-blind-date .under { position: absolute; inset: 0; }
.v-blind-date .under img, .v-blind-date .under .ph { width: 100%; height: 100%; object-fit: cover; }
.v-blind-date .under .ph { font-size: 26px; font-weight: 900; padding: 24px; background: radial-gradient(90% 70% at 50% 30%, rgba(255, 143, 192, 0.35), transparent 70%), linear-gradient(160deg, #352a66, #140b33); }
.v-blind-date .half { position: absolute; inset: 0; z-index: 2; transition: transform 0.18s ease-out; will-change: transform; }
.v-blind-date .half.top { clip-path: ${clipTop}; }
.v-blind-date .half.bot { clip-path: ${clipBottom}; }
.v-blind-date .half .kraft { position: absolute; inset: 0; }
.v-blind-date .half .say { position: absolute; z-index: 3; left: 0; right: 0; bottom: 18px; text-align: center; font-family: ${SCRIPT}; font-size: 22px; color: #2a1a0c; }
.v-blind-date .rip { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 4; pointer-events: none; overflow: visible; }
.v-blind-date .rip polyline { fill: none; stroke: #fff7e6; stroke-width: 3; stroke-linejoin: round; stroke-linecap: round; filter: drop-shadow(0 0 2px rgba(60, 30, 0, 0.6)); transition: stroke-dashoffset 0.2s ease-out; }
.v-blind-date .stage-t.shake { animation: bd-shake 0.22s ease-in-out; }
@keyframes bd-shake { 25% { transform: rotate(-0.8deg); } 75% { transform: rotate(0.8deg); } }
.v-blind-date .stage-t.ripped { cursor: default; }
.v-blind-date .stage-t.ripped .half { transition: transform 0.75s cubic-bezier(.2, .7, .3, 1), opacity 0.75s ease-in 0.1s; opacity: 0; }
.v-blind-date .stage-t.ripped .half.top { transform: translate(-14%, -95%) rotate(-11deg); }
.v-blind-date .stage-t.ripped .half.bot { transform: translate(12%, 95%) rotate(8deg); }
.v-blind-date .stage-t.ripped .rip { opacity: 0; transition: opacity 0.2s; }
.v-blind-date .how { text-align: center; color: var(--muted); font-size: 16px; margin: 10px 0 0; }
.v-blind-date .dots3 { display: flex; justify-content: center; gap: 6px; margin-top: 6px; }
.v-blind-date .dots3 i { width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.18); }
.v-blind-date .dots3 i.on { background: var(--story); }
.v-blind-date .met { margin-top: 16px; }
.v-blind-date .met .eyebrow { font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--story); font-weight: 800; }
.v-blind-date .met h3 { font-size: 32px; line-height: 0.98; font-weight: 900; margin: 4px 0 6px; text-wrap: balance; }
.v-blind-date .met p { margin: 0 0 14px; font-size: 18px; line-height: 1.2; color: var(--muted); text-wrap: pretty; }
.v-blind-date .met.in { animation: bd-in 0.5s ease-out both; }
@keyframes bd-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.v-blind-date .back { display: inline-block; background: none; border: 0; color: var(--muted); font-size: 16px; padding: 8px 0; margin-top: 6px; text-decoration: underline; }

@media (prefers-reduced-motion: reduce) {
  .v-blind-date .half, .v-blind-date .stage-t.ripped .half { transition: opacity 0.3s; transform: none !important; }
  .v-blind-date .stage-t.shake, .v-blind-date .met.in { animation: none; }
}
`;

export default {
  slug: 'blind-date',
  title: 'Blind date with a story',
  short: 'Blind date with a story',
  channel: 'instagram',
  blurb: 'Brown paper, three hints, one first line. Tear to reveal.',

  mount(ctx) {
    const { el } = ctx;
    ctx.style(CSS);
    const shuffle = ctx.shuffle || ((a) => a.slice().sort(() => Math.random() - 0.5));
    const byId = (id) => ctx.stories.find(s => s.id === id);

    // one cosy, one creepy, one funny, in a random order
    const dates = shuffle(Object.keys(DATES).map(mood => {
      const d = shuffle(DATES[mood]).find(x => byId(x.id));
      return d && { ...d, mood, story: byId(d.id) };
    }).filter(Boolean)).map((d, i) => ({ ...d, n: i + 1 }));

    const tagEl = (d) => el('div', { class: 'tag' }, el('b', { text: `No. ${d.n}` }), ` · ${FOR[d.mood]}`);
    const bow = () => el('div', { class: 'bow', 'aria-hidden': 'true' }, el('i'), el('i'));
    const hintText = (d) => d.hints.join(' · ');
    const loveNote = () => el('div', { class: 'love' },
      'After chapter 1 we’ll ask: second date? 💌',
      el('div', { class: 'chips', 'aria-hidden': 'true' }, el('i', { text: 'Love at first step' }), el('i', { text: 'Just friends' }), el('i', { text: 'Ghosted' })));

    // ---- screen 1: three parcels ----
    const showParcels = () => {
      ctx.root.innerHTML = '';
      window.scrollTo(0, 0);
      ctx.root.append(el('div', { class: 'v-blind-date' },
        el('h2', { text: 'Three blind dates. Pick one by its wrapping.' }),
        el('p', { class: 'lead', text: 'No covers, no titles. Three hints and the first line, that’s all you get.' }),
        el('div', { class: 'parcels' }, dates.map(d => el('button', {
          type: 'button', class: 'parcel kraft', 'aria-label': `Parcel ${d.n}, ${FOR[d.mood]}: ${hintText(d)}. ${d.line}`, onClick: () => showTear(d) },
          bow(), tagEl(d),
          el('div', { class: 'body' },
            el('div', { class: 'hints', text: hintText(d) }),
            el('div', { class: 'first', text: `“${d.line}”` }),
            el('span', { class: 'pick', 'aria-hidden': 'true', text: 'Pick this one ›' }))))),
        loveNote(),
        el('p', { class: 'muted note', text: 'Instagram version: a carousel of three parcels, comment 1, 2 or 3; reveal in Stories tomorrow.' }),
      ));
    };

    // ---- screen 2: tear it open ----
    const showTear = (d) => {
      ctx.root.innerHTML = '';
      window.scrollTo(0, 0);
      const s = d.story;
      const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      let prog = 0, taps = 0, done = false, start = null, moved = false;

      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      poly.setAttribute('points', TEAR.map(p => p.join(',')).join(' '));
      poly.setAttribute('pathLength', '100');
      poly.setAttribute('vector-effect', 'non-scaling-stroke');
      poly.style.strokeDasharray = '100 100'; poly.style.strokeDashoffset = '100';
      const rip = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      rip.setAttribute('class', 'rip'); rip.setAttribute('viewBox', '0 0 100 100'); rip.setAttribute('preserveAspectRatio', 'none'); rip.setAttribute('aria-hidden', 'true');
      rip.append(poly);

      const face = () => el('div', { class: 'kraft' }, bow(), tagEl(d), el('div', { class: 'say', text: 'tear here, if you dare' }));
      const top = el('div', { class: 'half top' }, face());
      const bot = el('div', { class: 'half bot' }, face());
      const under = el('div', { class: 'under' }, s.cover ? el('img', { src: s.cover, alt: `Cover of ${s.name}`, draggable: 'false' }) : el('div', { class: 'ph', text: s.name }));
      const dots = el('div', { class: 'dots3', 'aria-hidden': 'true' }, el('i'), el('i'), el('i'));
      const how = el('p', { class: 'how', text: 'Drag across the paper, or tap it three times.' });
      const stage = el('div', { class: 'stage-t', role: 'button', tabindex: '0', 'aria-label': `Tear open parcel ${d.n}. Tap three times or drag across.` }, under, top, bot, rip);
      const met = el('div', { class: 'met', hidden: true });
      const back = el('button', { class: 'back', text: '‹ Pick a different parcel', onClick: showParcels });

      const draw = () => {
        poly.style.strokeDashoffset = String(100 - prog * 100);
        const gap = prog * 5;
        top.style.transform = `translateY(${-gap}px)`;
        bot.style.transform = `translateY(${gap}px)`;
        [...dots.children].forEach((x, i) => x.classList.toggle('on', i < Math.round(prog * 3)));
      };
      const finishTear = () => {
        if (done) return; done = true; prog = 1; draw();
        top.style.transform = ''; bot.style.transform = '';
        stage.classList.add('ripped'); stage.setAttribute('aria-label', `Unwrapped: ${s.name}`); stage.removeAttribute('tabindex'); stage.removeAttribute('role');
        how.hidden = true; dots.hidden = true; back.hidden = true;
        met.hidden = false; if (!reduced) met.classList.add('in');
        if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) { try { navigator.vibrate(30); } catch (e) { /* ignore */ } }
      };
      const tap = () => {
        if (done) return;
        taps++; prog = Math.max(prog, taps / 3); draw();
        if (!reduced) { stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake'); }
        if (prog >= 1) setTimeout(finishTear, 160);
      };
      stage.addEventListener('pointerdown', (e) => { if (done) return; start = { x: e.clientX, y: e.clientY, base: prog }; moved = false; try { stage.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } });
      stage.addEventListener('pointermove', (e) => {
        if (!start || done) return;
        const dx = Math.abs(e.clientX - start.x);
        if (dx > 10) moved = true;
        if (!moved) return;
        prog = Math.min(1, Math.max(prog, start.base + dx / (stage.clientWidth * 0.7))); draw();
        if (prog >= 1) { start = null; finishTear(); }
      });
      const end = () => { if (!start) return; const wasTap = !moved; start = null; if (wasTap) tap(); };
      stage.addEventListener('pointerup', end);
      stage.addEventListener('pointercancel', () => { start = null; });
      stage.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } });

      met.append(
        el('div', { class: 'eyebrow', text: 'It’s a date with' }),
        el('h3', { text: s.name }),
        el('p', { text: s.blurb }),
        el('button', { class: 'btn primary block', text: 'Go on the date', onClick: () => ctx.finish({
          story: s, headline: 'Your blind date',
          why: `You picked it for “${hintText(d)}” and a first line you couldn’t leave alone.` }) }),
        loveNote());

      ctx.root.append(el('div', { class: 'v-blind-date' },
        el('h2', { text: `Parcel No. ${d.n}, ${FOR[d.mood]}` }),
        el('div', { class: 'card' }, el('div', { class: 'hints', text: hintText(d) }), el('div', { class: 'first', text: `“${d.line}”` })),
        stage, how, dots, met, back,
      ));
      draw();
    };

    showParcels();
  },
};
