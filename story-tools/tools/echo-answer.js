// Echo Answer: a riddle read aloud, answered out loud. Phone can stay in your pocket.
const TEXT = {
  kicker: (n) => `Riddle ${n} of 3`,
  title: 'Listen closely',
  sub: 'The riddle is read to you. Say your answer out loud.',
  hear: 'Hear the Riddle',
  again: 'Play Again',
  showWords: 'Show the Words',
  hideWords: 'Hide the Words',
  pocket: 'Pocket Mode',
  pocketTip: 'Pop the phone in your pocket. Tap anywhere to come back.',
  idle: 'Ready',
  speaking: 'Reading',
  listening: 'Listening',
  thinking: 'Hmm…',
  noMic: 'No listening on this device. Pick an answer below.',
  heard: (t) => `I heard “${t}”`,
  notQuite: 'Not quite. Try again.',
  sayNotQuite: 'Not quite. Have another think.',
  sayYes: 'Yes! You got it.',
  pretendKicker: 'Or tap what you’d say',
  pretend: (a) => `Pretend I Said: ${a}`,
  typePh: 'Type your answer',
  check: 'Check',
  doneKicker: 'You got it',
  doneSub: (a) => `The answer was “${a}”. The story door creaks open.`,
  next: 'Next Riddle',
  back: 'Back to Tools',
};

const RIDDLES = [
  { say: 'I have hands but I cannot clap. I have a face but I cannot smile. What am I?', answer: 'A clock', accept: ['clock', 'watch'], options: ['A Clock', 'A Glove', 'A Tree'] },
  { say: 'The more of me you take, the more of me you leave behind. What am I?', answer: 'Footsteps', accept: ['footstep', 'step', 'footprint', 'track'], options: ['A Cookie', 'Footsteps', 'Time'] },
  { say: 'I have a neck but no head, and I wear a cap. What am I?', answer: 'A bottle', accept: ['bottle', 'shirt', 'sweater', 'jar'], options: ['A Giraffe', 'A Bottle', 'A Hat'] },
];
const KEY = 'st-echo-answer';

export default function run(k) {
  const { h, show, bar, openSheet, closeSheet, css, tool, home, toast, onLeave } = k;
  css('echo-answer', CSS);

  const synth = window.speechSynthesis;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  let turn = load();
  let pocketEl = null;
  onLeave(() => { stopAll(); pocketEl?.remove(); document.removeEventListener('keydown', escPocket); });

  function riddleScreen() {
    const r = RIDDLES[turn % RIDDLES.length];
    const orb = h('div', { class: 'ea-orb' }, h('span', {}, TEXT.idle));
    const words = h('p', { class: 'frame ea-words', hidden: true }, r.say);
    const wordsBtn = h('button', { class: 'link', onclick: () => {
      words.hidden = !words.hidden;
      wordsBtn.textContent = words.hidden ? TEXT.showWords : TEXT.hideWords;
    } }, TEXT.showWords);
    const heard = h('p', { class: 'hint centre ea-heard' });
    const input = h('input', { class: 'ea-type', type: 'text', placeholder: TEXT.typePh, 'aria-label': TEXT.typePh, autocomplete: 'off' });
    const form = h('form', { class: 'ea-form', onsubmit: (e) => { e.preventDefault(); judge(input.value); } },
      input, h('button', { class: 'ea-check', type: 'submit' }, TEXT.check));
    const mainBtn = h('button', { class: 'btn jewel', onclick: () => ask() }, TEXT.hear);

    // Shared state painter for both the screen orb and the pocket orb.
    const paint = (state, label) => {
      [orb, pocketEl?.querySelector('.ea-orb')].forEach((o) => {
        if (!o) return;
        o.className = `ea-orb ${state}`;
        o.firstChild.textContent = label;
      });
    };

    show(
      bar(TEXT.kicker(turn % RIDDLES.length + 1)),
      h('h1', { class: 'display centre' }, TEXT.title),
      h('p', { class: 'sub centre' }, TEXT.sub),
      orb,
      heard,
      h('div', { class: 'ea-row' },
        h('button', { class: 'link', onclick: () => ask() }, TEXT.again),
        wordsBtn,
        h('button', { class: 'link', onclick: pocket }, TEXT.pocket)),
      words,
      h('div', { class: 'btns' }, mainBtn),
      h('p', { class: 'kicker centre ea-or' }, TEXT.pretendKicker),
      h('div', { class: 'ea-pretend' }, r.options.map((o) => h('button', { class: 'btn ghost', onclick: () => judge(o) }, TEXT.pretend(o)))),
      form,
    );

    // Read it aloud, then listen.
    function ask() {
      stopAll();
      heard.textContent = '';
      if (!synth) return listen();
      paint('speaking', TEXT.speaking);
      const u = new SpeechSynthesisUtterance(r.say);
      u.rate = 0.92; u.pitch = 1.05;
      u.onend = () => listen();
      u.onerror = () => listen();
      synth.speak(u);
    }

    function listen() {
      if (!SR) { paint('', TEXT.idle); heard.textContent = TEXT.noMic; return; }
      try {
        rec = new SR();
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 4;
        rec.onresult = (e) => {
          const alts = Array.from(e.results[0] || []).map((a) => a.transcript);
          heard.textContent = TEXT.heard(alts[0] || '');
          judge(alts.join(' '));
        };
        rec.onerror = () => { paint('', TEXT.idle); heard.textContent = TEXT.noMic; };
        rec.onend = () => { if (orb.classList.contains('listening')) paint('', TEXT.idle); };
        rec.start();
        paint('listening', TEXT.listening);
      } catch (e) {
        paint('', TEXT.idle); heard.textContent = TEXT.noMic;
      }
    }

    function judge(said) {
      if (!said.trim()) return;
      if (matches(said, r.accept)) {
        stopAll();
        speak(TEXT.sayYes);
        exitPocket();
        turn++; save(turn);
        openSheet([
          h('div', { class: 'celebrate' },
            h('p', { class: 'kicker' }, TEXT.doneKicker),
            h('div', { class: 'ea-orb done' }, h('span', {}, '✦')),
            h('h3', {}, r.answer),
            h('p', { class: 'more' }, TEXT.doneSub(r.answer))),
          h('div', { class: 'btns' },
            h('button', { class: 'btn jewel', onclick: () => { closeSheet(); riddleScreen(); } }, TEXT.next),
            h('button', { class: 'link', onclick: home }, TEXT.back)),
        ], null, tool.jewel);
      } else {
        paint('', TEXT.thinking);
        speak(TEXT.sayNotQuite);
        toast(TEXT.notQuite);
      }
    }

    // Pocket mode: dark, big orb; tap anywhere or Esc to leave.
    function pocket() {
      exitPocket();
      pocketEl = h('div', { class: 'ea-pocket', role: 'dialog', 'aria-label': TEXT.pocket, onclick: exitPocket },
        h('div', { class: 'ea-orb big' }, h('span', {}, TEXT.idle)),
        h('p', {}, TEXT.pocketTip));
      document.getElementById('phone').append(pocketEl);
      document.addEventListener('keydown', escPocket);
      ask();
    }
  }

  function escPocket(e) { if (e.key === 'Escape') exitPocket(); }
  function exitPocket() {
    pocketEl?.remove(); pocketEl = null;
    document.removeEventListener('keydown', escPocket);
  }
  function speak(t) {
    if (!synth) return;
    synth.cancel();
    synth.speak(new SpeechSynthesisUtterance(t));
  }
  function stopAll() {
    try { synth?.cancel(); } catch (e) { /* ignore */ }
    try { rec?.abort(); } catch (e) { /* ignore */ }
    rec = null;
  }

  riddleScreen();
}

// Loose match: any accepted word (or its plural) appears in what was said.
function matches(said, accept) {
  const words = said.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).map((w) => w.replace(/s$/, ''));
  return accept.some((a) => words.includes(a));
}
function load() { try { return Number(localStorage.getItem(KEY)) || 0; } catch (e) { return 0; } }
function save(n) { try { localStorage.setItem(KEY, String(n)); } catch (e) { /* ignore */ } }

const CSS = `
.ea-orb { width: 168px; height: 168px; margin: 26px auto 8px; border-radius: 50%; display: grid; place-items: center; position: relative;
  background: radial-gradient(circle at 38% 32%, color-mix(in srgb, var(--starlight) 55%, var(--jewel)), var(--jewel) 55%, color-mix(in srgb, var(--jewel) 50%, var(--midnight)));
  box-shadow: 0 0 40px color-mix(in srgb, var(--jewel) 40%, transparent); transition: transform 0.3s; }
.ea-orb span { font: 700 13px var(--f-body); letter-spacing: 0.16em; text-transform: uppercase; color: var(--midnight); }
.ea-orb.speaking { animation: ea-talk 0.5s ease-in-out infinite alternate; }
@keyframes ea-talk { to { transform: scale(1.06); } }
.ea-orb.listening::before, .ea-orb.listening::after { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--jewel); animation: ea-ring 1.6s ease-out infinite; }
.ea-orb.listening::after { animation-delay: 0.8s; }
@keyframes ea-ring { to { transform: scale(1.6); opacity: 0; } }
.ea-orb.done { width: 92px; height: 92px; margin: 8px auto 12px; }
.ea-orb.done span { font-size: 30px; }
.ea-heard { min-height: 1.5em; margin: 6px 0 0; }
.ea-row { display: flex; justify-content: center; flex-wrap: wrap; }
.ea-words { margin: 8px 0 0; font: italic 500 19px/1.35 var(--f-head); color: var(--starlight); padding: 18px 20px; }
.ea-or { margin: 24px 0 8px; }
.ea-pretend { display: grid; gap: 8px; }
.ea-pretend .btn { min-height: 46px; padding: 10px 16px; font-size: 15px; }
.ea-form { display: flex; gap: 8px; margin-top: 10px; }
.ea-type { flex: 1; min-width: 0; height: 48px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--velvet); color: var(--starlight); font: 500 16px var(--f-body); padding: 0 18px; }
.ea-type::placeholder { color: var(--lilac); }
.ea-check { flex: 0 0 auto; height: 48px; padding: 0 18px; border-radius: 999px; border: 0; background: var(--velvet); color: var(--jewel); font-weight: 700; }
.ea-pocket { position: absolute; inset: 0; z-index: 15; background: var(--ink); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; padding: 24px; text-align: center; color: var(--lilac); animation: fade 0.3s both; cursor: pointer; }
.ea-orb.big { width: 240px; height: 240px; margin: 0; }
`;
